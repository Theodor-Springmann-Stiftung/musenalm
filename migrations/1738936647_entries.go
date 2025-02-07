package migrations

import (
	"errors"

	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		entries := entriesTable()
		fields := entriesFields(entries, app)
		if fields == nil {
			return errors.New("Could not find places collection")
		}

		entries.Fields = *fields
		entriesIndexes(entries)

		return app.Save(entries)
	}, func(app core.App) error {
		entries, err := app.FindCollectionByNameOrId(models.ENTRIES_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(entries)
	})
}

func entriesTable() *core.Collection {
	collection := core.NewBaseCollection(models.ENTRIES_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func entriesFields(collection *core.Collection, app core.App) *core.FieldsList {
	places, err := app.FindCollectionByNameOrId(models.PLACES_TABLE)
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

		// Norm Data
		&core.TextField{Name: "references", Required: false},
		&core.RelationField{Name: "places", Required: false, CollectionId: places.Id, CascadeDelete: false, MaxSelect: 5000},

		// Musenalm specific data
		&core.SelectField{Name: "musenalm_status", Required: false, Values: models.MUSENALM_STATUS_VALUES, MaxSelect: len(models.MUSENALM_STATUS_VALUES)},
		&core.JSONField{Name: "musenalm_deprecated", Required: false},

		// Exemplare:
		&core.JSONField{Name: "items", Required: false},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return &fields
}

func entriesIndexes(collection *core.Collection) {
	addMusenalmIDIndex(collection)
	addIndex(collection, "preferredtitle", false)
	addIndex(collection, "varianttitle", false)
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
