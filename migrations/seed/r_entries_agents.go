package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromRelationBändeAkteure(
	app core.App,
	relations xmlmodels.Relationen_Bände_Akteure,
	entries map[int]*dbmodels.Entry,
	agents map[int]*dbmodels.Agent,
) ([]*dbmodels.REntriesAgents, error) {
	records := make([]*dbmodels.REntriesAgents, 0, len(relations.Relationen))
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE))
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
		return nil, err
	}

	for _, relation := range relations.Relationen {
		entry, ok := entries[relation.Band]
		if !ok {
			app.Logger().Error("Error finding Entry", "error", err, "relation", relation)
			continue
		}

		agent, ok := agents[relation.Akteur]
		if !ok {
			app.Logger().Error("Error finding Agent", "error", err, "relation", relation)
			continue
		}

		record := dbmodels.NewREntriesAgents(core.NewRecord(collection))
		record.SetEntry(entry.Id)
		record.SetAgent(agent.Id)

		switch relation.Relation {
		case "8":
			record.SetType("Vertrieb")
		case "7":
			record.SetType("Druck")
		case "6":
			record.SetType("Verlag")
		case "5":
			record.SetType("Herausgeber:in")
		}

		rel := record.Type()
		ent := record.Entry()
		ser := record.Agent()

		if strings.TrimSpace(rel) == "" || strings.TrimSpace(ent) == "" || strings.TrimSpace(ser) == "" {
			entry.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
			_ = app.Save(entry)
		}
		records = append(records, record)
	}

	return records, nil
}
