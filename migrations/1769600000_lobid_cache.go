package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection(dbmodels.LOBID_CACHE_TABLE)
		fields := core.NewFieldsList(
			&core.TextField{Name: dbmodels.KEY_FIELD, Required: true, Presentable: true},
			&core.TextField{Name: dbmodels.KIND_FIELD, Required: true, Presentable: true},
			&core.NumberField{Name: dbmodels.STATUS_CODE_FIELD, Required: true},
			&core.TextField{Name: dbmodels.BODY_FIELD, Required: false},
			&core.DateField{Name: dbmodels.EXPIRES_AT_FIELD, Required: true},
		)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields
		dbmodels.AddIndex(collection, dbmodels.KEY_FIELD, true)
		dbmodels.AddIndex(collection, dbmodels.KIND_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.EXPIRES_AT_FIELD, false)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.LOBID_CACHE_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			return err
		}

		return app.Delete(collection)
	})
}
