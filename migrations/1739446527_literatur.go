package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

var lit_fields = core.NewFieldsList(
	pagemodels.EditorField(pagemodels.F_TEXT),
)

func init() {
	m.Register(func(app core.App) error {
		collection := litCollection()
		if err := app.Save(collection); err != nil {
			app.Logger().Error("Failed to save collection:", "error", err, "collection", collection)
			return err
		}
		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_LIT_NAME))
		if err == nil && collection != nil {
			if err := app.Delete(collection); err != nil {
				app.Logger().Error("Failed to delete collection:", "error", err, "collection", collection)
				return err
			}
		}
		return nil
	})
}

func litCollection() *core.Collection {
	c := pagemodels.BasePageCollection(pagemodels.P_LIT_NAME)
	c.Fields = append(c.Fields, lit_fields...)
	dbmodels.SetBasicPublicRules(c)
	return c
}
