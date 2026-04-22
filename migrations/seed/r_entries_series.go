package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromRelationBändeReihen(
	app core.App,
	relations xmlmodels.Relationen_Bände_Reihen,
	series map[int]*dbmodels.Series,
	entries map[int]*dbmodels.Entry,
) ([]*dbmodels.REntriesSeries, error) {
	records := make([]*dbmodels.REntriesSeries, 0, len(relations.Relationen))
	seen := make(map[string]int)
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
		return nil, err
	}

	for _, relation := range relations.Relationen {
		entry, ok := entries[relation.Band]
		if !ok {
			app.Logger().Error("Error finding Entry", "error", err, "relation", relation)
			continue
		}

		ser, ok := series[relation.Reihe]
		if !ok {
			app.Logger().Error("Error finding Series", "error", err, "relation", relation)
			continue
		}

		// Relation type "1" = Bevorzugter Reihentitel — stored directly on the entry
		if relation.Relation == "1" {
			entry.SetSeries(ser.Id)
			_ = app.Save(entry)
			continue
		}

		record := dbmodels.NewREntriesSeries(core.NewRecord(collection))
		record.SetEntry(entry.Id)
		record.SetSeries(ser.Id)

		switch relation.Relation {
		case "2":
			record.SetType("Alternatives Titelblatt")
		case "3":
			record.SetType("In anderer Sprache")
		case "4":
			entry.SetLanguage([]string{"fre"})
			_ = app.Save(entry)
			record.SetType("In anderer Sprache")
		case "5":
			record.SetType("Alternatives Titelblatt")
		case "6":
			record.SetType("Späterer Reihentitel")
		case "7":
			record.SetType("Früherer Reihentitel")
		}

		rel := record.Type()
		ent := record.Entry()
		serID := record.Series()

		if strings.TrimSpace(rel) == "" || strings.TrimSpace(ent) == "" || strings.TrimSpace(serID) == "" {
			appendEntryComment(entry, "Unvollständige Relation Band–Reihe; bitte prüfen.")
			_ = app.Save(entry)
		}

		key := entry.Id + "|" + ser.Id
		if _, ok := seen[key]; ok {
			appendEntryComment(entry, "Doppelte Relation Band–Reihe entfernt; bitte prüfen.")
			_ = app.Save(entry)
			continue
		}

		seen[key] = len(records)
		records = append(records, record)
	}

	return records, nil
}
