package migrations

import (
	"errors"

	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		items := itemsTable()
		fields := itemsFields(items, app)
		if fields == nil {
			return errors.New("Could not find places collection")
		}

		items.Fields = *fields
		itemsIndexes(items)

		return app.Save(items)
	}, func(app core.App) error {
		items, err := app.FindCollectionByNameOrId(models.ITEMS_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(items)
	})
}

func itemsTable() *core.Collection {
	collection := core.NewBaseCollection(models.ITEMS_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func itemsFields(collection *core.Collection, app core.App) *core.FieldsList {
	entries, err := app.FindCollectionByNameOrId(models.ENTRIES_TABLE)
	if err != nil {
		return nil
	}

	fields := core.NewFieldsList(
		// Title information
		&core.TextField{Name: "preferredtitle", Required: true, Presentable: true},
		&core.TextField{Name: "varianttitle", Required: false, Presentable: false},
		&core.BoolField{Name: "paralleltitle", Required: false},

		// Transcribed information
		&core.TextField{Name: "title_statement", Required: false, Presentable: false},
		&core.TextField{Name: "subtitle_statement", Required: false, Presentable: false},
		&core.TextField{Name: "incipit_statement", Required: false, Presentable: false},

		&core.TextField{Name: "responsibility_statement", Required: false, Presentable: false},
		&core.TextField{Name: "place_statement", Required: false, Presentable: false},
		&core.TextField{Name: "publication_statement", Required: false, Presentable: false},

		// Other discerning Information
		&core.NumberField{Name: "year", Required: false},
		&core.TextField{Name: "edition", Required: false},

		// Media Information
		&core.SelectField{Name: "language", Required: false, Values: models.LANGUAGE_VALUES, MaxSelect: len(models.LANGUAGE_VALUES)},
		&core.SelectField{Name: "content_type", Required: false, Values: models.CONTENT_TYPE_VALUES, MaxSelect: len(models.CONTENT_TYPE_VALUES)},

		// Physical Description
		&core.TextField{Name: "extent", Required: false},
		&core.TextField{Name: "dimensions", Required: false},
		&core.SelectField{Name: "media_type", Required: false, Values: models.MEDIA_TYPE_VALUES, MaxSelect: len(models.MEDIA_TYPE_VALUES)},
		&core.SelectField{Name: "carrier_type", Required: false, Values: models.CARRIER_TYPE_VALUES, MaxSelect: len(models.CARRIER_TYPE_VALUES)},

		// Musenalm specific data
		&core.SelectField{Name: "musenalm_type", Required: false, Values: models.MUSENALM_TYPE_VALUES, MaxSelect: len(models.MUSENALM_TYPE_VALUES)},
		&core.SelectField{Name: "pagination", Required: false, Values: models.MUSENALM_PAGINATION_VALUES, MaxSelect: len(models.MUSENALM_PAGINATION_VALUES)},
		&core.FileField{Name: "scans", Required: false, MaxSize: 100 * 1024 * 1024, MaxSelect: 100, MimeTypes: models.MUSENALM_MIME_TYPES, Thumbs: []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"}}, // 100 MB

		// Band:
		&core.NumberField{Name: "running_number", Required: false},
		&core.RelationField{Name: "entries", Required: true, CollectionId: entries.Id, CascadeDelete: false, MaxSelect: 1, MinSelect: 1},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return &fields
}

func itemsIndexes(collection *core.Collection) {
	addMusenalmIDIndex(collection)
	addIndex(collection, "preferredtitle", false)
	addIndex(collection, "varianttile", false)
	addIndex(collection, "paralleltitle", false)
	addIndex(collection, "title_statement", false)
	addIndex(collection, "subtitle_statement", false)
	addIndex(collection, "incipit_statement", false)
	addIndex(collection, "responsibility_statement", false)
	addIndex(collection, "place_statement", false)
	addIndex(collection, "publication_statement", false)
	addIndex(collection, "year", false)
	addIndex(collection, "edition", false)
}
