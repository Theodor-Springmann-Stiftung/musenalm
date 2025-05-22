package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		usersCollection, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			app.Logger().Error("Failed to find 'users' collection for sessionTokens migration", "error", err)
			return err
		}

		collection := sessionTokensTable()
		fields := sessionTokensFields(usersCollection.Id)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields

		dbmodels.AddIndex(collection, dbmodels.SESSIONS_TOKEN_FIELD, true)
		dbmodels.AddIndex(collection, dbmodels.SESSIONS_USER_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.SESSIONS_EXPIRES_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.SESSIONS_LAST_ACCESS_FIELD, false)

		return app.Save(collection)

	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.SESSIONS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			app.Logger().Error("Failed to find collection for deletion", "collection", dbmodels.SESSIONS_TABLE, "error", err)
			return err
		}

		return app.Delete(collection)
	})
}

func sessionTokensTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.SESSIONS_TABLE)
	return collection
}

func sessionTokensFields(usersCollectionId string) core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{
			Name:        dbmodels.SESSIONS_TOKEN_FIELD,
			Required:    true,
			Presentable: false,
		},
		&core.TextField{
			Name:        dbmodels.SESSIONS_CSRF_FIELD,
			Required:    true,
			Presentable: false,
		},
		&core.RelationField{
			Name:          dbmodels.SESSIONS_USER_FIELD,
			Required:      true,
			CollectionId:  usersCollectionId,
			CascadeDelete: true,
			Presentable:   true,
		},
		&core.DateField{
			Name:        dbmodels.SESSIONS_EXPIRES_FIELD,
			Required:    true,
			Presentable: true,
		},
		&core.DateField{
			Name:        dbmodels.SESSIONS_LAST_ACCESS_FIELD,
			Presentable: false,
		},
		&core.TextField{
			Name:        dbmodels.SESSIONS_IP_FIELD,
			Presentable: false,
		},
		&core.TextField{
			Name:        dbmodels.SESSIONS_USER_AGENT_FIELD,
			Presentable: false,
		},
		&core.BoolField{
			Name:        dbmodels.SESSIONS_PERSIST_FIELD,
			Presentable: true,
		},
	)

	return fields
}
