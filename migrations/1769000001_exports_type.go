package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.EXPORTS_TABLE)
		if err != nil {
			app.Logger().Error("Failed to find exports collection for type migration", "error", err)
			return err
		}

		field := &core.SelectField{
			Name:        dbmodels.EXPORT_TYPE_FIELD,
			Presentable: true,
			MaxSelect:   1,
			Values:      dbmodels.EXPORT_TYPE_VALUES,
		}

		collection.Fields.Add(field)
		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.EXPORTS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			app.Logger().Error("Failed to find exports collection for type rollback", "error", err)
			return err
		}

		collection.Fields.RemoveByName(dbmodels.EXPORT_TYPE_FIELD)
		return app.Save(collection)
	})
}
