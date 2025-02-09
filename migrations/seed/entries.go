package seed

import (
	"fmt"
	"slices"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromBände(
	app core.App,
	adb xmlmodels.AccessDB,
) ([]*core.Record, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	records := make([]*core.Record, 0, len(adb.Bände.Bände))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	omap := datatypes.MakeMap(adb.Orte.Orte, func(o xmlmodels.Ort) string { return o.ID })
	relmap := datatypes.MakeMultiMap(
		adb.Relationen_Bände_Reihen.Relationen,
		func(r xmlmodels.Relation_Band_Reihe) string { return r.Band },
	)
	rmap := datatypes.MakeMap(adb.Reihen.Reihen, func(r xmlmodels.Reihe) string { return r.ID })
	ocoll, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.PLACES_TABLE)
		return records, err
	}

	for i := 0; i < len(adb.Bände.Bände); i++ {
		band := adb.Bände.Bände[i]
		record := core.NewRecord(collection)

		// TODO: Hier bevorzugter reihentitel + jahr, oder irgendein reihentitel, oder reihentitelALT
		if band.ReihentitelALT == "" {
			continue
		}
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

		handlePreferredTitleEntry(record, band, rmap, relmap)
		handleDeprecated(record, band)
		handleOrte(record, band, omap, app, ocoll)

		records = append(records, record)
	}

	return records, nil
}

func handlePreferredTitleEntry(
	record *core.Record,
	band xmlmodels.Band,
	rmap map[string]xmlmodels.Reihe,
	rrelmap map[string][]xmlmodels.Relation_Band_Reihe,
) {
	rels := rrelmap[band.ID]
	if len(rels) == 0 {
		record.Set(dbmodels.PREFERRED_TITLE_FIELD, NormalizeString(band.ReihentitelALT))
		record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
		return
	}

	jahr := strconv.Itoa(band.Jahr)
	if band.Jahr == 0 {
		jahr = "[o. J.]"
	} else {
		jahr = "(" + jahr + ")"
	}

	bevti := slices.IndexFunc(rels, func(r xmlmodels.Relation_Band_Reihe) bool { return r.Relation == "1" })
	if bevti != -1 {
		bevt := rmap[rels[bevti].Reihe]
		record.Set(dbmodels.PREFERRED_TITLE_FIELD, NormalizeString(bevt.Titel)+" "+jahr)
		return
	}

	slices.SortFunc(rels, func(a, b xmlmodels.Relation_Band_Reihe) int {
		return strings.Compare(a.Relation, b.Relation)
	})

	record.Set(dbmodels.PREFERRED_TITLE_FIELD, NormalizeString(rmap[rels[0].Reihe].Titel)+jahr)
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
		Gesichtet:   band.Gesichtet,
		Erfasst:     band.Erfasst,
	}

	record.Set(dbmodels.MUSENALM_DEPRECATED_FIELD, depr)
}
