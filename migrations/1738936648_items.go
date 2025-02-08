package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		items := itemsTable()
		items.Fields = itemsFields(app)
		itemsIndexes(items)

		return app.Save(items)
	}, func(app core.App) error {
		items, err := app.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(items)
	})
}

func itemsTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.ITEMS_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func itemsFields(app core.App) core.FieldsList {
	bcoll, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		panic(err)
	}

	fields := core.NewFieldsList(
		&core.RelationField{Name: dbmodels.ENTRIES_TABLE, CollectionId: bcoll.Id, Required: false},
		&core.TextField{Name: dbmodels.ITEMS_IDENTIFIER_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.ITEMS_LOCATION_FIELD, Required: false, Presentable: true},
		&core.TextField{Name: dbmodels.ITEMS_OWNER_FIELD, Required: false, Presentable: false},
		&core.SelectField{
			Name:        dbmodels.ITEMS_MEDIA_FIELD,
			Required:    false,
			Presentable: true,
			Values:      dbmodels.ITEM_TYPE_VALUES,
			MaxSelect:   len(dbmodels.ITEM_TYPE_VALUES) - 1,
		},
		&core.TextField{Name: dbmodels.ITEMS_CONDITION_FIELD, Required: false, Presentable: true},
		&core.FileField{
			Name:      dbmodels.SCAN_FIELD,
			Required:  false,
			MaxSize:   100 * 1024 * 1024,
			MaxSelect: 1000,
			MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
			Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
		}, // 100 MB a file
		&core.URLField{Name: dbmodels.URI_FIELD, Required: false, Presentable: false},
	)

	setNotesAndAnnotationsField(&fields)

	return fields
}

func itemsIndexes(collection *core.Collection) {
	addIndex(collection, dbmodels.ITEMS_CONDITION_FIELD, false)
	addIndex(collection, dbmodels.ITEMS_OWNER_FIELD, false)
	addIndex(collection, dbmodels.ITEMS_LOCATION_FIELD, false)
	addIndex(collection, dbmodels.ITEMS_IDENTIFIER_FIELD, false)
	addIndex(collection, dbmodels.URI_FIELD, false)
}
