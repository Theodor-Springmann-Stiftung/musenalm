package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		places := placesTable()
		places.Fields = placesFields()
		placesIndexes(places)

		return app.Save(places)
	}, func(app core.App) error {
		places, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(places)
	})
}

func placesTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.PLACES_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	return collection
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
