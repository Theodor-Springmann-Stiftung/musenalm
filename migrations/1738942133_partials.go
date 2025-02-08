package migrations

import (
	"errors"
	"maps"
	"slices"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
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
		partials, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(partials)
	})
}

func partialsTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.CONTENTS_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func partialsFields(app core.App) *core.FieldsList {
	entries, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		return nil
	}

	fields := core.NewFieldsList(
		// Title information
		&core.TextField{Name: dbmodels.PREFERRED_TITLE_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.VARIANT_TITLE_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: dbmodels.PARALLEL_TITLE_FIELD, Required: false},

		// Transcribed information
		&core.TextField{Name: dbmodels.TITLE_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: dbmodels.SUBTITLE_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: dbmodels.INCIPIT_STMT_FIELD, Required: false, Presentable: false},

		&core.TextField{Name: dbmodels.RESPONSIBILITY_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: dbmodels.PLACE_STMT_FIELD, Required: false, Presentable: false},
		&core.TextField{Name: dbmodels.PUBLICATION_STMT_FIELD, Required: false, Presentable: false},

		// Other discerning Information
		&core.NumberField{Name: dbmodels.YEAR_FIELD, Required: false},
		&core.TextField{Name: dbmodels.EDITION_FIELD, Required: false},

		// Media Information
		&core.SelectField{
			Name:      dbmodels.LANGUAGE_FIELD,
			Required:  false,
			Values:    dbmodels.LANGUAGE_VALUES,
			MaxSelect: len(dbmodels.LANGUAGE_VALUES),
		},
		&core.SelectField{
			Name:      dbmodels.CONTENT_TYPE_FIELD,
			Required:  false,
			Values:    dbmodels.CONTENT_TYPE_VALUES,
			MaxSelect: len(dbmodels.CONTENT_TYPE_VALUES),
		},

		// Physical Description
		&core.TextField{Name: dbmodels.EXTENT_FIELD, Required: false},
		&core.TextField{Name: dbmodels.DIMENSIONS_FIELD, Required: false},
		&core.SelectField{
			Name:      dbmodels.MEDIA_TYPE_FIELD,
			Required:  false,
			Values:    dbmodels.MEDIA_TYPE_VALUES,
			MaxSelect: len(dbmodels.MEDIA_TYPE_VALUES),
		},
		&core.SelectField{
			Name:      dbmodels.CARRIER_TYPE_FIELD,
			Required:  false,
			Values:    dbmodels.CARRIER_TYPE_VALUES,
			MaxSelect: len(dbmodels.CARRIER_TYPE_VALUES),
		},

		// Musenalm specific data
		&core.SelectField{
			Name:      dbmodels.MUSENALM_INHALTE_TYPE_FIELD,
			Required:  false,
			Values:    dbmodels.MUSENALM_TYPE_VALUES,
			MaxSelect: len(dbmodels.MUSENALM_TYPE_VALUES),
		},
		&core.SelectField{
			Name:      dbmodels.MUSENALM_PAGINATION_FIELD,
			Required:  false,
			Values:    slices.Collect(maps.Values(dbmodels.MUSENALM_PAGINATION_VALUES)),
			MaxSelect: len(dbmodels.MUSENALM_PAGINATION_VALUES),
		},
		&core.FileField{
			Name:      dbmodels.SCAN_FIELD,
			Required:  false,
			MaxSize:   100 * 1024 * 1024,
			MaxSelect: 1000,
			MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
			Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
		}, // 100 MB a file

		// Band:
		&core.NumberField{Name: dbmodels.NUMBERING_FIELD, Required: false},
		&core.RelationField{
			Name:          dbmodels.ENTRIES_TABLE,
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
	addIndex(collection, dbmodels.PREFERRED_TITLE_FIELD, false)
	addIndex(collection, dbmodels.VARIANT_TITLE_FIELD, false)
	addIndex(collection, dbmodels.PARALLEL_TITLE_FIELD, false)
	addIndex(collection, dbmodels.TITLE_STMT_FIELD, false)
	addIndex(collection, dbmodels.SUBTITLE_STMT_FIELD, false)
	addIndex(collection, dbmodels.INCIPIT_STMT_FIELD, false)
	addIndex(collection, dbmodels.RESPONSIBILITY_STMT_FIELD, false)
	addIndex(collection, dbmodels.PLACE_STMT_FIELD, false)
	addIndex(collection, dbmodels.PUBLICATION_STMT_FIELD, false)
	addIndex(collection, dbmodels.YEAR_FIELD, false)
	addIndex(collection, dbmodels.EDITION_FIELD, false)
}
