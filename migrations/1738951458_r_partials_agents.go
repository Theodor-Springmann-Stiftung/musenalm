package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collections, err := basicRelationCollection(app, dbmodels.PARTIALS_TABLE, dbmodels.AGENTS_TABLE, dbmodels.AGENT_RELATIONS)
		if err != nil {
			return err
		}

		return app.Save(collections)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.PARTIALS_TABLE, dbmodels.AGENTS_TABLE))
		if err != nil {
			return nil
		}

		return app.Delete(collection)
	})
}
