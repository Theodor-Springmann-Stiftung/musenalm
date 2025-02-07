package migrations

import (
	"errors"

	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		partials := partialsTable()
		fields := partialsFields(app)
		if fields == nil {
			return errors.New("Could not find places collection")
		}

		partials.Fields = *fields
		partialsIndexes(partials)

		return app.Save(partials)
	}, func(app core.App) error {
		partials, err := app.FindCollectionByNameOrId(models.PARTIALS_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(partials)
	})
}

func partialsTable() *core.Collection {
	collection := core.NewBaseCollection(models.PARTIALS_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func partialsFields(app core.App) *core.FieldsList {
	entries, err := app.FindCollectionByNameOrId(models.ENTRIES_TABLE)
	if err != nil {
		return nil
	}

	fields := core.NewFieldsList(
		// Title information
		&core.TextField{Name: models.PREFERRED_TITLE_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: models.VARIANT_TITLE_FIELD, Required: false, Presentable: false},
		&core.BoolField{Name: models.PARALLEL_TITLE_FIELD, Required: false},

		// Transcribed information
		&core.TextField{Name: models.TITLE_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: models.SUBTITLE_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: models.INCIPIT_STMT_FIELD, Required: false, Presentable: false},

		&core.TextField{Name: models.RESPONSIBILITY_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: models.PLACE_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: models.PUBLICATION_STMT_FIELD, Required: false, Presentable: false},

		// Other discerning Information
		&core.NumberField{Name: models.YEAR_FIELD, Required: false},
		&core.TextField{Name: models.EDITION_FIELD, Required: false},

		// Media Information
		&core.SelectField{
			Name:      models.LANGUAGE_FIELD,
			Required:  false,
			Values:    models.LANGUAGE_VALUES,
			MaxSelect: len(models.LANGUAGE_VALUES),
		},
		&core.SelectField{
			Name:      models.CONTENT_TYPE_FIELD,
			Required:  false,
			Values:    models.CONTENT_TYPE_VALUES,
			MaxSelect: len(models.CONTENT_TYPE_VALUES),
		},

		// Physical Description
		&core.TextField{Name: models.EXTENT_FIELD, Required: false},
		&core.TextField{Name: models.DIMENSIONS_FIELD, Required: false},
		&core.SelectField{
			Name:      models.MEDIA_TYPE_FIELD,
			Required:  false,
			Values:    models.MEDIA_TYPE_VALUES,
			MaxSelect: len(models.MEDIA_TYPE_VALUES),
		},
		&core.SelectField{
			Name:      models.CARRIER_TYPE_FIELD,
			Required:  false,
			Values:    models.CARRIER_TYPE_VALUES,
			MaxSelect: len(models.CARRIER_TYPE_VALUES),
		},

		// Musenalm specific data
		&core.SelectField{
			Name:      models.MUSENALM_INHALTE_TYPE_FIELD,
			Required:  false,
			Values:    models.MUSENALM_TYPE_VALUES,
			MaxSelect: len(models.MUSENALM_TYPE_VALUES),
		},
		&core.SelectField{
			Name:      models.MUSENALM_PAGINATION_FIELD,
			Required:  false,
			Values:    models.MUSENALM_PAGINATION_VALUES,
			MaxSelect: len(models.MUSENALM_PAGINATION_VALUES),
		},
		&core.FileField{
			Name:      models.SCAN_FIELD,
			Required:  false,
			MaxSize:   100 * 1024 * 1024,
			MaxSelect: 1000,
			MimeTypes: models.MUSENALM_MIME_TYPES,
			Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
		}, // 100 MB a file

		// Band:
		&core.NumberField{Name: models.NUMBERING_FIELD, Required: false},
		&core.RelationField{
			Name:          models.ENTRIES_TABLE,
			Required:      true,
			CollectionId:  entries.Id,
			CascadeDelete: false,
			MaxSelect:     1,
			MinSelect:     1,
		},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return &fields
}

func partialsIndexes(collection *core.Collection) {
	addMusenalmIDIndex(collection)
	addIndex(collection, models.PREFERRED_TITLE_FIELD, false)
	addIndex(collection, models.VARIANT_TITLE_FIELD, false)
	addIndex(collection, models.PARALLEL_TITLE_FIELD, false)
	addIndex(collection, models.TITLE_STMT_FIELD, false)
	addIndex(collection, models.SUBTITLE_STMT_FIELD, false)
	addIndex(collection, models.INCIPIT_STMT_FIELD, false)
	addIndex(collection, models.RESPONSIBILITY_STMT_FIELD, false)
	addIndex(collection, models.PLACE_STMT_FIELD, false)
	addIndex(collection, models.PUBLICATION_STMT_FIELD, false)
	addIndex(collection, models.YEAR_FIELD, false)
	addIndex(collection, models.EDITION_FIELD, false)
}
