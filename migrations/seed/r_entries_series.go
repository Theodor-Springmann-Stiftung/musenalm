package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromRelationBändeReihen(app core.App, relations xmlmodels.Relationen_Bände_Reihen) ([]*core.Record, error) {
	records := make([]*core.Record, 0, len(relations.Relationen))
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
		return nil, err
	}

	for _, relation := range relations.Relationen {
		entry, err := app.FindFirstRecordByData(dbmodels.ENTRIES_TABLE, dbmodels.MUSENALMID_FIELD, relation.Band)
		if err != nil {
			app.Logger().Error("Error finding Entry", "error", err, "relation", relation)
			continue
		}

		series, err := app.FindFirstRecordByData(dbmodels.SERIES_TABLE, dbmodels.MUSENALMID_FIELD, relation.Reihe)
		if err != nil {
			app.Logger().Error("Error finding Series", "error", err, "relation", relation)
			continue
		}

		record := core.NewRecord(collection)
		record.Set(dbmodels.ENTRIES_TABLE, entry.Id)
		record.Set(dbmodels.SERIES_TABLE, series.Id)

		switch relation.Relation {
		case "1":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Bevorzugter Reihentitel")
		case "2":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Alternativer Reihentitel")
		case "3":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "In anderer Sprache")
		case "4":
			entry.Set(dbmodels.LANGUAGE_FIELD, "fre")
			_ = app.Save(entry)
			record.Set(dbmodels.RELATION_TYPE_FIELD, "In anderer Sprache")
		case "5":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Alternativer Reihentitel")
		case "6":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Früherer Reihentitel")
		case "7":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Späterer Reihentitel")
		}

		rel := record.GetString(dbmodels.RELATION_TYPE_FIELD)
		ent := record.GetString(dbmodels.ENTRIES_TABLE)
		ser := record.GetString(dbmodels.SERIES_TABLE)

		if strings.TrimSpace(rel) == "" || strings.TrimSpace(ent) == "" || strings.TrimSpace(ser) == "" {
			entry.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
			_ = app.Save(entry)
		}

		records = append(records, record)
	}

	return records, nil
}
