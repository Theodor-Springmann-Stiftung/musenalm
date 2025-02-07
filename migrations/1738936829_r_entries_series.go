package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := basicRelationCollection(app, models.ENTRIES_TABLE, models.SERIES_TABLE, models.SERIES_RELATIONS)
		if err != nil {
			return err
		}

		collection.Fields.Add(&core.TextField{Name: models.NUMBERING_FIELD, Required: false, Presentable: true})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(models.RelationTableName(models.ENTRIES_TABLE, models.SERIES_TABLE))
		if err != nil {
			return nil
		}

		return app.Delete(collection)
	})
}
