package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection(dbmodels.SETTINGS_TABLE)
		dbmodels.SetBasicPublicRules(collection)
		fields := core.NewFieldsList(
			&core.TextField{Name: dbmodels.KEY_FIELD, Required: true, Presentable: true},
			&core.JSONField{Name: dbmodels.VALUE_FIELD, Required: false},
		)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields
		dbmodels.AddIndex(collection, dbmodels.KEY_FIELD, true)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.SETTINGS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			app.Logger().Error("Failed to find collection for deletion", "collection", dbmodels.SETTINGS_TABLE, "error", err)
			return err
		}

		return app.Delete(collection)
	})
}
