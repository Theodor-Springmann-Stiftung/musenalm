package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		usersCollection, err := app.FindCollectionByNameOrId(dbmodels.USERS_TABLE)
		if err != nil {
			app.Logger().Error("Failed to find users collection for exports migration", "error", err)
			return err
		}

		collection := core.NewBaseCollection(dbmodels.EXPORTS_TABLE)
		fields := exportsFields(usersCollection.Id)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields

		dbmodels.AddIndex(collection, dbmodels.EXPORT_STATUS_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.EXPORT_EXPIRES_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.EXPORT_CREATED_BY_FIELD, false)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.EXPORTS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			app.Logger().Error("Failed to find collection for deletion", "collection", dbmodels.EXPORTS_TABLE, "error", err)
			return err
		}

		return app.Delete(collection)
	})
}

func exportsFields(usersCollectionId string) core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{
			Name:        dbmodels.EXPORT_NAME_FIELD,
			Required:    true,
			Presentable: true,
		},
		&core.TextField{
			Name:        dbmodels.EXPORT_FILENAME_FIELD,
			Presentable: true,
		},
		&core.SelectField{
			Name:        dbmodels.EXPORT_STATUS_FIELD,
			Required:    true,
			Presentable: true,
			MaxSelect:   1,
			Values:      dbmodels.EXPORT_STATUS_VALUES,
		},
		&core.NumberField{
			Name:        dbmodels.EXPORT_PROGRESS_FIELD,
			Presentable: true,
		},
		&core.NumberField{
			Name:        dbmodels.EXPORT_TABLES_TOTAL_FIELD,
			Presentable: true,
		},
		&core.NumberField{
			Name:        dbmodels.EXPORT_TABLES_DONE_FIELD,
			Presentable: true,
		},
		&core.NumberField{
			Name:        dbmodels.EXPORT_SIZE_FIELD,
			Presentable: true,
		},
		&core.TextField{
			Name:        dbmodels.EXPORT_CURRENT_TABLE_FIELD,
			Presentable: true,
		},
		&core.TextField{
			Name:        dbmodels.EXPORT_ERROR_FIELD,
			Presentable: true,
		},
		&core.DateField{
			Name:        dbmodels.EXPORT_EXPIRES_FIELD,
			Presentable: true,
		},
		&core.RelationField{
			Name:          dbmodels.EXPORT_CREATED_BY_FIELD,
			CollectionId:  usersCollectionId,
			MaxSelect:     1,
			CascadeDelete: true,
			Presentable:   true,
		},
	)

	return fields
}
