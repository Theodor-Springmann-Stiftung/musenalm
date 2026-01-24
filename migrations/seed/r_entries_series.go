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

		series, ok := series[relation.Reihe]
		if !ok {
			app.Logger().Error("Error finding Series", "error", err, "relation", relation)
			continue
		}

		record := dbmodels.NewREntriesSeries(core.NewRecord(collection))
		record.SetEntry(entry.Id)
		record.SetSeries(series.Id)

		switch relation.Relation {
		case "1":
			record.SetType("Bevorzugter Reihentitel")
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
		ser := record.Series()

		if strings.TrimSpace(rel) == "" || strings.TrimSpace(ent) == "" || strings.TrimSpace(ser) == "" {
			appendEntryComment(entry, "Unvollständige Relation Band–Reihe; bitte prüfen.")
			_ = app.Save(entry)
		}

		key := entry.Id + "|" + series.Id
		if idx, ok := seen[key]; ok {
			existing := records[idx]
			if existing.Type() == "Bevorzugter Reihentitel" {
				appendEntryComment(entry, "Doppelte Relation Band–Reihe entfernt; bitte prüfen.")
				_ = app.Save(entry)
				continue
			}
			if record.Type() == "Bevorzugter Reihentitel" {
				records[idx] = record
				appendEntryComment(entry, "Doppelte Relation Band–Reihe entfernt; bitte prüfen.")
				_ = app.Save(entry)
				continue
			}
			appendEntryComment(entry, "Doppelte Relation Band–Reihe entfernt; bitte prüfen.")
			_ = app.Save(entry)
			continue
		}

		seen[key] = len(records)
		records = append(records, record)
	}

	return records, nil
}
