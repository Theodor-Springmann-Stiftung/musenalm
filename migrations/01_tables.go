package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"maps"
	"slices"
)

func init() {
	m.Register(func(app core.App) error {
		err := app.Save(places())
		if err != nil {
			return err
		}

		err = app.Save(agents())
		if err != nil {
			return err
		}

		err = app.Save(series())
		if err != nil {
			return err
		}

		err = app.Save(entries(app))
		if err != nil {
			return err
		}

		err = app.Save(items(app))
		if err != nil {
			return err
		}

		err = app.Save(contents(app))
		if err != nil {
			return err
		}

		r_entries_agents, err := dbmodels.BasicRelationCollection(app, dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE, dbmodels.AGENT_RELATIONS)
		if err != nil {
			return err
		}
		err = app.Save(r_entries_agents)
		if err != nil {
			return err
		}

		r_contents_agents, err := dbmodels.BasicRelationCollection(app, dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE, dbmodels.AGENT_RELATIONS)
		if err != nil {
			return err
		}
		err = app.Save(r_contents_agents)
		if err != nil {
			return err
		}

		r_entries_series, err := dbmodels.EntriesSeriesRelationCollection(app)
		if err != nil {
			return err
		}
		err = app.Save(r_entries_series)
		if err != nil {
			return err
		}

		err = app.Save(r_entries_agents)
		if err != nil {
			return err
		}

		err = app.Save(dataTable())
		if err != nil {
			return err
		}

		err = app.Save(imagesTable())
		if err != nil {
			return err
		}

		err = app.Save(filesTable())
		if err != nil {
			return err
		}

		err = app.Save(htmlTable())
		if err != nil {
			return err
		}

		err = app.Save(pagesTable())
		if err != nil {
			return err
		}

		return nil
	}, func(app core.App) error {
		places, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(places)
	})
}

func series() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.SERIES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = seriesFields()
	seriesIndexes(collection)
	return collection
}

func seriesFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.SERIES_TITLE_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.SERIES_PSEUDONYMS_FIELD, Required: false},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD, Required: false},
		&core.TextField{Name: dbmodels.SERIES_FREQUENCY_FIELD, Required: false},
	)

	dbmodels.SetCreatedUpdatedFields(&fields)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)

	return fields
}

func seriesIndexes(collection *core.Collection) {
	dbmodels.AddMusenalmIDIndex(collection)
	dbmodels.AddIndex(collection, dbmodels.SERIES_TITLE_FIELD, false)
}

func agents() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = agentsFields()
	agentsIndexes(collection)
	return collection
}

func agentsFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.AGENTS_NAME_FIELD, Required: true, Presentable: true},
		&core.BoolField{Name: dbmodels.AGENTS_CORP_FIELD, Required: false},
		&core.BoolField{Name: dbmodels.AGENTS_FICTIONAL_FIELD, Required: false},
		&core.URLField{Name: dbmodels.URI_FIELD, Required: false},
		&core.TextField{Name: dbmodels.AGENTS_BIOGRAPHICAL_DATA_FIELD, Required: false, Presentable: true},
		&core.TextField{Name: dbmodels.AGENTS_PROFESSION_FIELD, Required: false},
		&core.TextField{Name: dbmodels.AGENTS_PSEUDONYMS_FIELD, Required: false},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD, Required: false},
		&core.JSONField{Name: dbmodels.DATA_FIELD, Required: false},
	)

	dbmodels.SetCreatedUpdatedFields(&fields)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)

	return fields
}

func agentsIndexes(collection *core.Collection) {
	dbmodels.AddMusenalmIDIndex(collection)
	dbmodels.AddIndex(collection, dbmodels.AGENTS_NAME_FIELD, false)
	dbmodels.AddIndexNoCollate(collection, dbmodels.URI_FIELD, false)
}

func places() *core.Collection {
	places := core.NewBaseCollection(dbmodels.PLACES_TABLE)
	dbmodels.SetBasicPublicRules(places)
	places.Fields = placesFields()
	placesIndexes(places)
	return places
}

func placesFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.PLACES_NAME_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.PLACES_PSEUDONYMS_FIELD, Required: false, Presentable: true},
		&core.BoolField{Name: dbmodels.AGENTS_FICTIONAL_FIELD, Required: false},
		&core.URLField{Name: dbmodels.URI_FIELD, Required: false, OnlyDomains: []string{"geonames.org"}},
	)

	dbmodels.SetCreatedUpdatedFields(&fields)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)

	return fields
}

func placesIndexes(collection *core.Collection) {
	dbmodels.AddMusenalmIDIndex(collection)
	dbmodels.AddIndex(collection, dbmodels.PLACES_NAME_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.URI_FIELD, false)
}

func items(app core.App) *core.Collection {
	collection := core.NewBaseCollection(dbmodels.ITEMS_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = itemsFields(app)
	itemsIndexes(collection)
	return collection
}

func itemsFields(app core.App) core.FieldsList {
	bcoll, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		panic(err)
	}

	fields := core.NewFieldsList(
		&core.RelationField{Name: dbmodels.ENTRIES_TABLE, CollectionId: bcoll.Id, Required: false},
		&core.TextField{Name: dbmodels.ITEMS_IDENTIFIER_FIELD, Required: false, Presentable: true},
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

	dbmodels.SetCreatedUpdatedFields(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)
	dbmodels.SetEditorStateField(&fields)

	return fields
}

func itemsIndexes(collection *core.Collection) {
	dbmodels.AddIndex(collection, dbmodels.ITEMS_CONDITION_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.ITEMS_OWNER_FIELD, false)
	dbmodels.AddIndexNoCollate(collection, dbmodels.ITEMS_LOCATION_FIELD, false)
	dbmodels.AddIndexNoCollate(collection, dbmodels.ITEMS_IDENTIFIER_FIELD, false)
	dbmodels.AddIndexNoCollate(collection, dbmodels.URI_FIELD, false)
}

func entries(app core.App) *core.Collection {
	collection := core.NewBaseCollection(dbmodels.ENTRIES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = entriesFields(app)
	entriesIndexes(collection)
	return collection
}

func entriesFields(app core.App) core.FieldsList {
	places, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		return nil
	}

	series, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
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
		&core.BoolField{Name: dbmodels.PSEUDONYM_FIELD, Required: false},

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
		&core.RelationField{
			Name:          dbmodels.SERIES_TABLE,
			Required:      false,
			CollectionId:  series.Id,
			CascadeDelete: false,
			MaxSelect:     1,
		},

		// EDIT DATA:
		&core.JSONField{Name: dbmodels.META_FIELD, Required: false},
		&core.JSONField{Name: dbmodels.MUSENALM_DEPRECATED_FIELD, Required: false},
	)

	dbmodels.SetCreatedUpdatedFields(&fields)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)

	return fields
}

func entriesIndexes(collection *core.Collection) {
	dbmodels.AddMusenalmIDIndex(collection)
	dbmodels.AddIndex(collection, dbmodels.PREFERRED_TITLE_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.VARIANT_TITLE_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.PARALLEL_TITLE_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.TITLE_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.SUBTITLE_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.INCIPIT_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.RESPONSIBILITY_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.PLACE_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.PUBLICATION_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.YEAR_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.EDITION_FIELD, false)
	dbmodels.AddIndexNoCollate(collection, dbmodels.SERIES_TABLE, false)
}

func contents(app core.App) *core.Collection {
	collection := core.NewBaseCollection(dbmodels.CONTENTS_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = contentsFields(app)
	contentsIndexes(collection)
	return collection
}

func contentsFields(app core.App) core.FieldsList {
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
		&core.BoolField{Name: dbmodels.PSEUDONYM_FIELD, Required: false},

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

	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetCreatedUpdatedFields(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)

	return fields
}

func contentsIndexes(collection *core.Collection) {
	dbmodels.AddMusenalmIDIndex(collection)
	dbmodels.AddIndex(collection, dbmodels.PREFERRED_TITLE_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.VARIANT_TITLE_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.PARALLEL_TITLE_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.TITLE_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.SUBTITLE_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.INCIPIT_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.RESPONSIBILITY_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.PLACE_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.PUBLICATION_STMT_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.YEAR_FIELD, false)
	dbmodels.AddIndexNoCollate(collection, dbmodels.ENTRIES_TABLE, false)
}

func dataTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.DATA_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = dataTableFields()
	dataTableIndexes(collection)
	return collection
}

func dataTableFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true, Presentable: true},
		&core.JSONField{Name: dbmodels.VALUE_FIELD, Required: false},
	)
	dbmodels.SetCreatedUpdatedFields(&fields)
	return fields
}

func dataTableIndexes(collection *core.Collection) {
	dbmodels.AddIndex(collection, dbmodels.KEY_FIELD, false)
}

func imagesTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.IMAGES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = imagesTableFields()
	imagesTableIndexes(collection)
	return collection
}

func imagesTableFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.TITLE_FIELD, Required: false},
		&core.TextField{Name: dbmodels.DESCRIPTION_FIELD, Required: false},
		&core.FileField{
			Name:      dbmodels.PREVIEW_FIELD,
			Required:  false,
			MaxSize:   100 * 1024 * 1024,
			MaxSelect: 1,
			MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
			Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
		},
		&core.FileField{
			Name:      dbmodels.IMAGE_FIELD,
			Required:  false,
			MaxSize:   100 * 1024 * 1024,
			MaxSelect: 1,
			MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
			Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
		},
	)
	dbmodels.SetCreatedUpdatedFields(&fields)
	return fields
}

func imagesTableIndexes(collection *core.Collection) {
	dbmodels.AddIndex(collection, dbmodels.KEY_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.TITLE_FIELD, false)
}

func filesTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.FILES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = filesTableFields()
	filesTableIndexes(collection)
	return collection
}

func filesTableFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.TITLE_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.DESCRIPTION_FIELD, Required: false},
		&core.FileField{
			Name:      dbmodels.FILE_FIELD,
			Required:  false,
			MaxSize:   100 * 1024 * 1024,
			MaxSelect: 1,
			MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		},
	)
	dbmodels.SetCreatedUpdatedFields(&fields)
	return fields
}

func filesTableIndexes(collection *core.Collection) {
	dbmodels.AddIndex(collection, dbmodels.TITLE_FIELD, false)
}

func htmlTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.HTML_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = htmlTableFields()
	htmlTableIndexes(collection)
	return collection
}

func htmlTableFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true, Presentable: true},
		&core.EditorField{Name: dbmodels.HTML_FIELD, Required: false, ConvertURLs: false},
	)
	dbmodels.SetCreatedUpdatedFields(&fields)
	return fields
}

func htmlTableIndexes(collection *core.Collection) {
	dbmodels.AddIndex(collection, dbmodels.KEY_FIELD, false)
}

func pagesTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.PAGES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	collection.Fields = pagesTableFields()
	pagesTableIndexes(collection)
	return collection
}

func pagesTableFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true, Presentable: true},
		&core.TextField{Name: dbmodels.TITLE_FIELD, Required: false},
		&core.TextField{Name: dbmodels.URL_FIELD, Required: false},
		&core.TextField{Name: dbmodels.TEMPLATE_FIELD, Required: false},
		&core.TextField{Name: dbmodels.LAYOUT_FIELD, Required: false},
		&core.TextField{Name: dbmodels.TYPE_FIELD, Required: false},
		&core.JSONField{Name: dbmodels.DATA_FIELD, Required: false},
	)
	dbmodels.SetCreatedUpdatedFields(&fields)
	return fields
}

func pagesTableIndexes(collection *core.Collection) {
	dbmodels.AddIndex(collection, dbmodels.KEY_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.URL_FIELD, false)
}
