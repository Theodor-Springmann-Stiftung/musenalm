package migrations_index

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

var texte_fields = core.NewFieldsList(
	pagemodels.EditorField(pagemodels.F_INDEX_TEXTE_ABS1),
	pagemodels.EditorField(pagemodels.F_INDEX_TEXTE_ABS2),
)

func init() {
	m.Register(func(app core.App) error {
		collection_b := bilderCollection()
		if err := app.Save(collection_b); err != nil {
			return err
		}

		collection_t := texteCollection()
		if err := app.Save(collection_t); err != nil {
			return err
		}
		return nil
	}, func(app core.App) error {
		collection_b, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_BILDER))
		if err == nil && collection_b != nil {
			if err := app.Delete(collection_b); err != nil {
				return err
			}
		}

		collection_t, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME))
		if err == nil && collection_t != nil {
			if err := app.Delete(collection_t); err != nil {
				return err
			}
		}
		return nil
	})
}

func bilderCollection() *core.Collection {
	c := core.NewBaseCollection(
		pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_BILDER))
	c.ListRule = dbmodels.PUBLIC_LIST_RULE
	c.ViewRule = dbmodels.PUBLIC_VIEW_RULE
	c.Fields = core.NewFieldsList(
		pagemodels.TextField(pagemodels.F_TITLE),
		pagemodels.EditorField(pagemodels.F_DESCRIPTION),
		pagemodels.RequiredImageField(pagemodels.F_IMAGE, false),
		pagemodels.RequiredImageField(pagemodels.F_PREVIEW, false),
	)

	dbmodels.SetBasicPublicRules(c)
	return c
}

func texteCollection() *core.Collection {
	c := pagemodels.BasePageCollection(pagemodels.P_INDEX_NAME)
	c.Fields = append(c.Fields, texte_fields...)
	c.Fields = append(c.Fields, pagemodels.CreatedUpdatedFields()...)
	dbmodels.SetBasicPublicRules(c)
	return c
}
