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
		fields := entriesFields(app)
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

func entriesFields(app core.App) *core.FieldsList {
	places, err := app.FindCollectionByNameOrId(models.PLACES_TABLE)
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
			Name:      models.CARRIER_TYPE_FIELD,
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

		// Norm Data
		&core.TextField{Name: models.REFERENCES_FIELD, Required: false},
		&core.RelationField{
			Name:          models.PLACES_TABLE,
			Required:      false,
			CollectionId:  places.Id,
			CascadeDelete: false,
			MaxSelect:     5000,
		},

		// Musenalm specific data
		&core.SelectField{
			Name:      models.MUSENALM_BAENDE_STATUS_FIELD,
			Required:  false,
			Values:    models.MUSENALM_STATUS_VALUES,
			MaxSelect: len(models.MUSENALM_STATUS_VALUES),
		},
		&core.JSONField{Name: models.MUSENALM_DEPRECATED_FIELD, Required: false},

		// Exemplare:
		&core.JSONField{Name: models.ITEMS_TABLE, Required: false},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return &fields
}

func entriesIndexes(collection *core.Collection) {
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
