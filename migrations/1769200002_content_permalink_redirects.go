package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		contentsCollection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection(dbmodels.CONTENT_PERMALINK_REDIRECTS_TABLE)
		fields := core.NewFieldsList(
			&core.RelationField{
				Name:          dbmodels.CONTENTS_TABLE,
				Required:      true,
				CollectionId:  contentsCollection.Id,
				MinSelect:     1,
				MaxSelect:     1,
				CascadeDelete: true,
			},
			&core.NumberField{
				Name:     dbmodels.CONTENT_PERMALINK_REDIRECT_OLD_FIELD,
				Required: true,
			},
		)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields

		dbmodels.AddIndex(collection, dbmodels.CONTENTS_TABLE, false)
		dbmodels.AddIndexNoCollate(collection, dbmodels.CONTENT_PERMALINK_REDIRECT_OLD_FIELD, true)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENT_PERMALINK_REDIRECTS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			return err
		}

		return app.Delete(collection)
	})
}
