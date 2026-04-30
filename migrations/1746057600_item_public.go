package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err != nil {
			return err
		}
		collection.Fields.Add(&core.BoolField{
			Name:     dbmodels.ITEMS_PUBLIC_FIELD,
			Required: false,
		})
		collection.Fields.Add(&core.BoolField{
			Name:     dbmodels.ITEMS_BASIS_FIELD,
			Required: false,
		})
		if err := app.Save(collection); err != nil {
			return err
		}
		_, err = app.DB().NewQuery(
			"UPDATE " + dbmodels.ITEMS_TABLE + " SET " + dbmodels.ITEMS_BASIS_FIELD + " = TRUE",
		).Execute()
		return err
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err != nil {
			return err
		}
		collection.Fields.RemoveByName(dbmodels.ITEMS_PUBLIC_FIELD)
		collection.Fields.RemoveByName(dbmodels.ITEMS_BASIS_FIELD)
		return app.Save(collection)
	})
}
