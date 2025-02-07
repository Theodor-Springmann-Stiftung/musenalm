package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collections, err := basicRelationCollection(app, models.ENTRIES_TABLE, models.AGENTS_TABLE, models.AGENT_RELATIONS)
		if err != nil {
			return err
		}

		return app.Save(collections)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(models.RelationTableName(models.ENTRIES_TABLE, models.AGENTS_TABLE))
		if err != nil {
			return nil
		}

		return app.Delete(collection)
	})
}
