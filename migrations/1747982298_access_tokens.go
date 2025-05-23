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

		collection := accessTokensTable()
		fields := accessTokensFields(usersCollection.Id)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields

		dbmodels.AddIndex(collection, dbmodels.ACCESS_TOKENS_TOKEN_FIELD, true)
		dbmodels.AddIndex(collection, dbmodels.ACCESS_TOKENS_USER_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.ACCESS_TOKENS_EXPIRES_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.ACCESS_TOKENS_LAST_ACCESS_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.ACCESS_TOKENS_URL_FIELD, false)
		dbmodels.AddIndex(collection, dbmodels.ACCESS_TOKENS_STATUS_FIELD, false)

		return app.Save(collection)

	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.ACCESS_TOKENS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			app.Logger().Error("Failed to find collection for deletion", "collection", dbmodels.ACCESS_TOKENS_TABLE, "error", err)
			return err
		}

		return app.Delete(collection)
	})
}

func accessTokensTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.ACCESS_TOKENS_TABLE)
	return collection
}

func accessTokensFields(usersCollectionId string) core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{
			Name:        dbmodels.ACCESS_TOKENS_TOKEN_FIELD,
			Required:    true,
			Presentable: false,
		},
		&core.TextField{
			Name:        dbmodels.ACCESS_TOKENS_CSRF_FIELD,
			Required:    true,
			Presentable: false,
		},
		&core.RelationField{
			Name:          dbmodels.ACCESS_TOKENS_USER_FIELD,
			Required:      true,
			CollectionId:  usersCollectionId,
			CascadeDelete: true,
			Presentable:   true,
		},
		&core.DateField{
			Name:        dbmodels.ACCESS_TOKENS_EXPIRES_FIELD,
			Required:    true,
			Presentable: true,
		},
		&core.DateField{
			Name:        dbmodels.ACCESS_TOKENS_LAST_ACCESS_FIELD,
			Presentable: false,
		},
		&core.TextField{
			Name:        dbmodels.ACCESS_TOKENS_URL_FIELD,
			Presentable: true,
		},
		&core.SelectField{
			Name:        dbmodels.ACCESS_TOKENS_STATUS_FIELD,
			Required:    true,
			Presentable: true,
			MaxSelect:   1,
			Values:      dbmodels.TOKEN_STATUS_VALUES,
		},
	)

	return fields
}
