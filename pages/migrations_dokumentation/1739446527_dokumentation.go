package migrations_dokumentation

import (
	"errors"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

var reihen_fields = core.NewFieldsList(
	pagemodels.EditorField(pagemodels.F_TEXT),
)

func init() {
	m.Register(func(app core.App) error {
		collection := pageCollection()
		if err := app.Save(collection); err != nil {
			app.Logger().Error("Failed to save collection:", "error", err, "collection", collection)
			return err
		}

		abk := abkCollection()
		if err := app.Save(abk); err != nil {
			app.Logger().Error("Failed to save collection:", "error", err, "collection", abk)
			return err
		}

		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME))
		if err == nil && collection != nil {
			if err := app.Delete(collection); err != nil {
				app.Logger().Error("Failed to delete collection:", "error", err, "collection", collection)
			}
		}

		collection_abk, err2 := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME, pagemodels.T_ABK_NAME))
		if err == nil && collection_abk != nil {
			if err := app.Delete(collection_abk); err != nil {
				app.Logger().Error("Failed to delete collection:", "error", err, "collection", collection_abk)
			}
		}
		return errors.Join(err, err2)
	})
}

func pageCollection() *core.Collection {
	c := pagemodels.BasePageCollection(pagemodels.P_DOK_NAME)
	c.Fields = append(c.Fields, reihen_fields...)
	return c
}

func abkCollection() *core.Collection {
	c := core.NewBaseCollection(pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME, pagemodels.T_ABK_NAME))
	c.Fields = core.NewFieldsList(
		pagemodels.RequiredTextField(pagemodels.F_ABK),
		pagemodels.RequiredTextField(pagemodels.F_BEDEUTUNG),
	)
	dbmodels.SetBasicPublicRules(c)
	return c
}
