package migrations

import (
	"errors"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		entries := entriesTable()
		fields := entriesFields(app)
		if fields == nil {
			return errors.New("Could not find places collection")
		}

		entries.Fields = *fields
		entriesIndexes(entries)

		return app.Save(entries)
	}, func(app core.App) error {
		entries, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(entries)
	})
}

func entriesTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.ENTRIES_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func entriesFields(app core.App) *core.FieldsList {
	places, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
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
			Name:      dbmodels.CARRIER_TYPE_FIELD,
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

		// Norm Data
		&core.TextField{Name: dbmodels.REFERENCES_FIELD, Required: false},
		&core.RelationField{
			Name:          dbmodels.PLACES_TABLE,
			Required:      false,
			CollectionId:  places.Id,
			CascadeDelete: false,
			MaxSelect:     5000,
		},

		// EDIT DATA:
		&core.JSONField{Name: dbmodels.META_FIELD, Required: false},
		&core.JSONField{Name: dbmodels.MUSENALM_DEPRECATED_FIELD, Required: false},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return &fields
}

func entriesIndexes(collection *core.Collection) {
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
