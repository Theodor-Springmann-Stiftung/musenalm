package migrations

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.SESSIONS_TABLE)
		if err != nil {
			return fmt.Errorf("failed to find %q collection: %w", dbmodels.SESSIONS_TABLE, err)
		}

		superusersCollection, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return fmt.Errorf("failed to find %q collection: %w", core.CollectionNameSuperusers, err)
		}

		userField, ok := collection.Fields.GetByName(dbmodels.SESSIONS_USER_FIELD).(*core.RelationField)
		if !ok {
			return fmt.Errorf("failed to find %q relation field", dbmodels.SESSIONS_USER_FIELD)
		}
		userField.Required = false

		if collection.Fields.GetByName(dbmodels.SESSIONS_SUPERUSER_FIELD) == nil {
			collection.Fields.Add(&core.RelationField{
				Name:          dbmodels.SESSIONS_SUPERUSER_FIELD,
				Required:      false,
				CollectionId:  superusersCollection.Id,
				CascadeDelete: true,
				Presentable:   true,
			})
			dbmodels.AddIndex(collection, dbmodels.SESSIONS_SUPERUSER_FIELD, false)
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.SESSIONS_TABLE)
		if err != nil {
			return fmt.Errorf("failed to find %q collection: %w", dbmodels.SESSIONS_TABLE, err)
		}

		userField, ok := collection.Fields.GetByName(dbmodels.SESSIONS_USER_FIELD).(*core.RelationField)
		if !ok {
			return fmt.Errorf("failed to find %q relation field", dbmodels.SESSIONS_USER_FIELD)
		}
		userField.Required = true
		collection.Fields.RemoveByName(dbmodels.SESSIONS_SUPERUSER_FIELD)

		return app.Save(collection)
	})
}
