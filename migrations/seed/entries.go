package seed

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func SeedTableEntries(
	app core.App,
	entries xmlmodels.Bände,
	biblio map[int]xmlmodels.BIBLIOEintrag,
	orte xmlmodels.Orte,
) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	records := make([]*core.Record, 0, len(entries.Bände))
	r := regexp.MustCompile("\\d{6}")
	if err != nil {
		fmt.Println(err)
	}

	omap := datatypes.MakeMap(orte.Orte, func(o xmlmodels.Ort) string { return o.ID })
	ocoll, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.PLACES_TABLE)
		return err
	}

	for i := 0; i < len(entries.Bände); i++ {
		band := entries.Bände[i]
		record := core.NewRecord(collection)

		// TODO: Hier bevorzugter reihentitel + jahr, oder irgendein reihentitel, oder reihentitelALT
		if band.ReihentitelALT == "" {
			continue
		}
		record.Set(dbmodels.PREFERRED_TITLE_FIELD, NormalizeString(band.ReihentitelALT))
		record.Set(dbmodels.TITLE_STMT_FIELD, NormalizeString(band.Titelangabe))
		record.Set(dbmodels.REFERENCES_FIELD, NormalizeString(band.Nachweis))
		record.Set(dbmodels.ANNOTATION_FIELD, NormalizeString(band.Anmerkungen))
		if band.Jahr != 0 {
			record.Set(dbmodels.YEAR_FIELD, band.Jahr)
		}
		record.Set(dbmodels.RESPONSIBILITY_STMT_FIELD, NormalizeString(band.Verantwortlichkeitsangabe))
		record.Set(dbmodels.PUBLICATION_STMT_FIELD, NormalizeString(band.Ortsangabe))
		record.Set(dbmodels.EXTENT_FIELD, NormalizeString(band.Struktur))

		record.Set(dbmodels.CARRIER_TYPE_FIELD, "Band")
		record.Set(dbmodels.CONTENT_TYPE_FIELD, []string{"unbewegtes Bild", "Text"})
		record.Set(dbmodels.MEDIA_TYPE_FIELD, "ohne Hilfsmittel")
		record.Set(dbmodels.LANGUAGE_FIELD, "ger")
		record.Set(dbmodels.MUSENALMID_FIELD, band.ID)

		if band.Erfasst {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		} else if band.Gesichtet {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[2])
		} else if band.BiblioID != 0 {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[0])
		}

		handleDeprecated(record, band)
		handleItems(r, band, &biblio, record)
		handleOrte(record, band, omap, app, ocoll)

		records = append(records, record)
	}

	return batchSave(app, records)
}

func handleOrte(
	record *core.Record,
	band xmlmodels.Band,
	orte map[string]xmlmodels.Ort,
	app core.App,
	ocollection *core.Collection,
) {
	for _, v := range band.Orte {
		o, ok := orte[v.Value]
		if ok {
			n := NormalizeString(o.Name)
			e := false
			if strings.HasPrefix(n, "[") {
				n = n[1 : len(n)-1]
				e = true
			}

			ort, err := app.FindFirstRecordByData(dbmodels.PLACES_TABLE, dbmodels.PLACES_NAME_FIELD, n)
			if err == nil {
				before := record.GetStringSlice(dbmodels.PLACES_TABLE)
				record.Set(dbmodels.PLACES_TABLE, append(before, ort.Id))
			} else {
				orec := core.NewRecord(ocollection)
				orec.Set(dbmodels.PLACES_NAME_FIELD, n)
				orec.Set(dbmodels.ANNOTATION_FIELD, o.Anmerkungen)
				orec.Set(dbmodels.PLACES_FICTIONAL_FIELD, o.Fiktiv)
				orec.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
				if err := app.Save(orec); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", orec)
					continue
				} else {
					before := record.GetStringSlice(dbmodels.PLACES_TABLE)
					record.Set(dbmodels.PLACES_TABLE, append(before, orec.Id))
				}
			}

			if e {
				// INFO: We do not need to get the record metadata here, as we know that the record is new
				record.Set(
					dbmodels.META_FIELD,
					map[string]dbmodels.MetaData{dbmodels.PLACES_TABLE: {Conjecture: true}},
				)
			}
		}
	}
}

func handleDeprecated(record *core.Record, band xmlmodels.Band) {
	depr := dbmodels.Deprecated{
		Reihentitel: NormalizeString(band.ReihentitelALT),
		Norm:        NormalizeString(band.Norm),
		BiblioID:    band.BiblioID,
		Status:      band.Status.Value,
	}

	record.Set(dbmodels.MUSENALM_DEPRECATED_FIELD, depr)
}

func handleItems(r *regexp.Regexp, band xmlmodels.Band, biblio *map[int]xmlmodels.BIBLIOEintrag, record *core.Record) {
	nst := NormalizeString(band.Norm)
	matches := r.FindAllStringSubmatchIndex(nst, -1)
	t := map[string]string{}
	for i, m := range matches {
		nr := nst[m[0]:m[1]]
		end := len(nst)

		if m[1] >= len(nst) {
			t[nr] = ""
			continue
		}

		if len(matches)-1 > i {
			end = matches[i+1][0]
		}

		rest := nst[m[1]:end]
		var last []rune

		for y, c := range rest {
			if c == '\\' && y < len(rest)-1 && rest[y+1] == ')' {
				break
			}
			if c != '(' && c != ')' {
				last = append(last, c)
			}
		}

		if last != nil && len(last) > 0 {
			t[nr] = string(last)
		}
	}

	var exemlist []dbmodels.Exemplar

	if band.BiblioID != 0 {
		exem := dbmodels.Exemplar{Identifier: strconv.Itoa(band.BiblioID)}
		if e, ok := (*biblio)[band.BiblioID]; ok {
			exem.Location = strings.TrimSpace(e.Standort)
			exem.Condition = strings.TrimSpace(e.Zustand)
			message := ""
			message = appendMessage(e.NotizÄusseres, message)
			message = appendMessage(e.NotizInhalt, message)
			message = appendMessage(e.Anmerkungen, message)
			exem.Annotation = message
		}

		exemlist = append(exemlist, exem)
	}

	for nr, m := range t {
		exem := dbmodels.Exemplar{Identifier: nr}

		no, err := strconv.Atoi(strings.TrimSpace(nr))
		message := strings.TrimSpace(m)
		if err != nil {
			if e, ok := (*biblio)[no]; ok {
				exem.Location = strings.TrimSpace(e.Standort)
				exem.Condition = strings.TrimSpace(e.Zustand)
				message = appendMessage(e.NotizÄusseres, message)
				message = appendMessage(e.NotizInhalt, message)
				message = appendMessage(e.Anmerkungen, message)
			}
		}
		exem.Annotation = message

		if exem.Identifier != "" {
			exemlist = append(exemlist, exem)
		}
	}

	if len(exemlist) > 0 {
		record.Set(dbmodels.ITEMS_TABLE, exemlist)
	}
}

func appendMessage(message string, toAppend string) string {
	notiza := strings.TrimSpace(toAppend)
	if notiza != "" {
		if message != "" {
			message += "\n"
		}
		message += notiza
	}
	return message
}
