package migrations_index

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

var bilder_fields = core.NewFieldsList(
	&core.TextField{Name: pagemodels.F_INDEX_BILDER_TITEL, Required: true, Presentable: true},
	&core.EditorField{Name: pagemodels.F_INDEX_BILDER_BESCHREIBUNG, Required: false, Presentable: false},
	&core.FileField{
		Name:      pagemodels.F_INDEX_BILDER_BILD,
		Required:  true,
		MaxSize:   100 * 1024 * 1024,
		MaxSelect: 1000,
		MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
	}, // 100 MB a file
	&core.FileField{
		Name:      pagemodels.F_INDEX_BILDER_VORSCHAU,
		Required:  true,
		MaxSize:   100 * 1024 * 1024,
		MaxSelect: 1000,
		MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
	}, // 100 MB a file
)

var texte_fields = core.NewFieldsList(
	&core.TextField{Name: pagemodels.F_INDEX_TEXTE_TITEL, Required: true, Presentable: true},
	&core.EditorField{Name: pagemodels.F_INDEX_TEXTE_ABS1, Required: false, Presentable: false},
	&core.EditorField{Name: pagemodels.F_INDEX_TEXTE_ABS2, Required: false, Presentable: false},
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
			pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_TEXTE))
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
	c.ListRule = types.Pointer("")
	c.ViewRule = types.Pointer("")
	c.Fields = bilder_fields
	return c
}

func texteCollection() *core.Collection {
	c := core.NewBaseCollection(
		pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_TEXTE))
	c.ListRule = types.Pointer("")
	c.ViewRule = types.Pointer("")
	c.Fields = texte_fields
	return c
}
