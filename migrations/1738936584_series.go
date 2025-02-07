package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		series := seriesTable()
		series.Fields = seriesFields(series)
		seriesIndexes(series)

		return app.Save(series)
	}, func(app core.App) error {
		series, err := app.FindCollectionByNameOrId(models.SERIES_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(series)
	})
}

func seriesTable() *core.Collection {
	collection := core.NewBaseCollection(models.SERIES_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func seriesFields(collection *core.Collection) core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: "name", Required: true, Presentable: true},
		&core.TextField{Name: "pseudonyms", Required: false},
		&core.TextField{Name: "references", Required: false},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return fields
}

func seriesIndexes(collection *core.Collection) {
	addMusenalmIDIndex(collection)
	addIndex(collection, "name", false)
}
