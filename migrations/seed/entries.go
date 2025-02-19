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
	// INFO: this is a string map, bc it's not by ID but by place name
	places map[string]*dbmodels.Place,
) ([]*dbmodels.Entry, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	records := make([]*dbmodels.Entry, 0, len(adb.Bände.Bände))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	ocoll, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.PLACES_TABLE)
		return records, err
	}

	// INFO: lets make some maps to speed this up
	omap := datatypes.MakeMap(adb.Orte.Orte, func(o xmlmodels.Ort) int { return o.ID })
	relmap := datatypes.MakeMultiMap(
		adb.Relationen_Bände_Reihen.Relationen,
		func(r xmlmodels.Relation_Band_Reihe) int { return r.Band },
	)
	rmap := datatypes.MakeMap(adb.Reihen.Reihen, func(r xmlmodels.Reihe) int { return r.ID })

	for i := 0; i < len(adb.Bände.Bände); i++ {
		band := adb.Bände.Bände[i]
		record := dbmodels.NewEntry(core.NewRecord(collection))

		// TODO: Hier bevorzugter reihentitel + jahr, oder irgendein reihentitel, oder reihentitelALT
		if band.ReihentitelALT == "" {
			continue
		}

		record.SetTitleStmt(NormalizeString(band.Titelangabe))
		record.SetReferences(NormalizeString(band.Nachweis))
		record.SetAnnotation(NormalizeString(band.Anmerkungen))
		record.SetResponsibilityStmt(NormalizeString(band.Verantwortlichkeitsangabe))
		record.SetPublicationStmt(NormalizeString(band.Ortsangabe))
		record.SetExtent(NormalizeString(band.Struktur))
		record.SetCarrierType([]string{"Band"})
		record.SetContentType([]string{"unbewegtes Bild", "Text"})
		record.SetMediaType([]string{"ohne Hilfsmittel"})
		record.SetLanguage([]string{"ger"})
		record.SetMusenalmID(band.ID)

		if band.Jahr != 0 {
			record.SetYear(band.Jahr)
		}

		if band.Erfasst {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		} else if band.Gesichtet {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[2])
		} else if band.BiblioID != 0 {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[0])
		}

		handlePreferredTitleEntry(record, band, rmap, relmap)
		handleDeprecated(record, band)
		handleOrte(record, band, omap, app, ocoll, places)

		records = append(records, record)
	}

	return records, nil
}

func handlePreferredTitleEntry(
	record *dbmodels.Entry,
	band xmlmodels.Band,
	rmap map[int]xmlmodels.Reihe,
	rrelmap map[int][]xmlmodels.Relation_Band_Reihe,
) {
	rels := rrelmap[band.ID]
	if len(rels) == 0 {
		record.SetPreferredTitle(NormalizeString(band.ReihentitelALT))
		record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
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
		record.SetPreferredTitle(NormalizeString(bevt.Titel) + " " + jahr)
		return
	}

	slices.SortFunc(rels, func(a, b xmlmodels.Relation_Band_Reihe) int {
		return strings.Compare(a.Relation, b.Relation)
	})

	record.SetPreferredTitle(NormalizeString(rmap[rels[0].Reihe].Titel) + jahr)
}

func handleOrte(
	record *dbmodels.Entry,
	band xmlmodels.Band,
	orte map[int]xmlmodels.Ort,
	app core.App,
	ocollection *core.Collection,
	places map[string]*dbmodels.Place,
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

			ort, ok := places[n]
			if ok {
				before := record.Places()
				record.SetPlaces(append(before, ort.Id))
			} else {
				orec := dbmodels.NewPlace(core.NewRecord(ocollection))
				orec.SetName(n)
				orec.SetAnnotation(o.Anmerkungen)
				orec.SetFictional(o.Fiktiv)
				orec.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
				if err := app.Save(orec); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", orec)
					continue
				} else {
					before := record.Places()
					record.SetPlaces(append(before, orec.Id))
				}
			}

			if e {
				rec, err := app.FindFirstRecordByData(dbmodels.PLACES_TABLE, dbmodels.PLACES_NAME_FIELD, NormalizeString(o.Name))
				if err != nil {
					app.Logger().Error("Error finding record", "error", err, "record", rec)
				} else if rec != nil {
					err = app.Delete(rec)
					if err != nil {
						app.Logger().Error("Error deleting record", "error", err, "record", rec)
					}
				}
				// INFO: We do not need to get the record metadata here, as we know that the record is new
				record.SetMeta(map[string]dbmodels.MetaData{dbmodels.PLACES_TABLE: {Conjecture: true}})
			}
		}
	}
}

func handleDeprecated(record *dbmodels.Entry, band xmlmodels.Band) {
	depr := dbmodels.Deprecated{
		Reihentitel: NormalizeString(band.ReihentitelALT),
		Norm:        NormalizeString(band.Norm),
		BiblioID:    band.BiblioID,
		Status:      band.Status.Value,
		Gesichtet:   band.Gesichtet,
		Erfasst:     band.Erfasst,
	}

	record.SetDeprecated(depr)
}
