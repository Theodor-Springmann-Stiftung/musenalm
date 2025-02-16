package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		series := seriesTable()
		series.Fields = seriesFields()
		seriesIndexes(series)

		return app.Save(series)
	}, func(app core.App) error {
		series, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(series)
	})
}

func seriesTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.SERIES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
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
