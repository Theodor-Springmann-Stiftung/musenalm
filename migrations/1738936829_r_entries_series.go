package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := basicRelationCollection(app, dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE, dbmodels.SERIES_RELATIONS)
		if err != nil {
			return err
		}

		collection.Fields.Add(&core.TextField{Name: dbmodels.NUMBERING_FIELD, Required: false, Presentable: true})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
		if err != nil {
			return nil
		}

		return app.Delete(collection)
	})
}
