package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.USERS_TABLE)
		if err != nil {
			app.Logger().Error("Failed to find 'users' collection to add 'settings' field", "id", dbmodels.USERS_TABLE, "error", err)
			return err
		}

		settingsField := &core.JSONField{
			Name:        dbmodels.USERS_SETTINGS_FIELD,
			Required:    false,
			Presentable: false,
		}

		roleField := &core.SelectField{
			Name:        dbmodels.USERS_ROLE_FIELD,
			Required:    true,
			Presentable: true,
			MaxSelect:   1,
			Values:      dbmodels.USER_ROLES,
		}

		deactivatedField := &core.BoolField{
			Name:        dbmodels.USERS_DEACTIVATED_FIELD,
			Required:    false,
			Presentable: false,
		}

		collection.Fields.Add(settingsField)
		collection.Fields.Add(roleField)
		collection.Fields.Add(deactivatedField)

		app.Logger().Info("Adding 'settings' JSON field to 'users' collection", "collectionId", collection.Id)

		return app.Save(collection)

	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.USERS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				app.Logger().Warn("Users collection not found during rollback of 'settings' field, assuming already handled.", "id", dbmodels.USERS_TABLE)
				return nil
			}
			app.Logger().Error("Failed to find 'users' collection for 'settings' field rollback", "id", dbmodels.USERS_TABLE, "error", err)
			return err
		}

		collection.Fields.RemoveByName(dbmodels.USERS_SETTINGS_FIELD)
		collection.Fields.RemoveByName(dbmodels.USERS_ROLE_FIELD)
		collection.Fields.RemoveByName(dbmodels.USERS_DEACTIVATED_FIELD)
		if err := app.Save(collection); err != nil {
			app.Logger().Warn("Failed to remove 'settings' field during rollback (it might not exist)",
				"collectionId", collection.Id,
				"field", dbmodels.USERS_SETTINGS_FIELD,
				"error", err,
			)
		} else {
			app.Logger().Info("Removed 'settings' JSON field from 'users' collection", "collectionId", collection.Id)
		}

		return app.Save(collection)
	})
}
