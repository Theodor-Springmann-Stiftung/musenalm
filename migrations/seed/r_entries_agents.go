package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromRelationBändeAkteure(app core.App, relations xmlmodels.Relationen_Bände_Akteure) ([]*core.Record, error) {
	records := make([]*core.Record, 0, len(relations.Relationen))
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE))
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
		return nil, err
	}

	for _, relation := range relations.Relationen {
		entry, err := app.FindFirstRecordByData(dbmodels.ENTRIES_TABLE, dbmodels.MUSENALMID_FIELD, relation.Band)
		if err != nil {
			app.Logger().Error("Error finding Entry", "error", err, "relation", relation)
			continue
		}

		agent, err := app.FindFirstRecordByData(dbmodels.AGENTS_TABLE, dbmodels.MUSENALMID_FIELD, relation.Akteur)
		if err != nil {
			app.Logger().Error("Error finding Agent", "error", err, "relation", relation)
			continue
		}

		record := core.NewRecord(collection)
		record.Set(dbmodels.ENTRIES_TABLE, entry.Id)
		record.Set(dbmodels.AGENTS_TABLE, agent.Id)

		switch relation.Relation {
		case "8":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Vertrieb")
		case "7":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Druck")
		case "6":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Verlag")
		case "5":
			record.Set(dbmodels.RELATION_TYPE_FIELD, "Herausgeber:in")
		}

		rel := record.GetString(dbmodels.RELATION_TYPE_FIELD)
		ent := record.GetString(dbmodels.ENTRIES_TABLE)
		ser := record.GetString(dbmodels.AGENTS_TABLE)

		if strings.TrimSpace(rel) == "" || strings.TrimSpace(ent) == "" || strings.TrimSpace(ser) == "" {
			entry.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
			_ = app.Save(entry)
		}
		records = append(records, record)
	}

	return records, nil
}
