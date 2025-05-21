package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		agents_coll, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
		if err != nil {
			return err
		}

		places_coll, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
		if err != nil {
			return err
		}

		series_coll, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
		if err != nil {
			return err
		}

		entries_coll, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
		if err != nil {
			return err
		}

		contents_coll, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err != nil {
			return err
		}

		items_coll, err := app.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err != nil {
			return err
		}

		users_coll, err := app.FindCollectionByNameOrId(dbmodels.USERS_TABLE)
		if err != nil {
			return err
		}

		// add edited field to users collection
		addEditedField(agents_coll, users_coll.Id)
		addEditedField(places_coll, users_coll.Id)
		addEditedField(series_coll, users_coll.Id)
		addEditedField(entries_coll, users_coll.Id)
		addEditedField(contents_coll, users_coll.Id)
		addEditedField(items_coll, users_coll.Id)

		dbmodels.AddIndex(agents_coll, dbmodels.EDITOR_FIELD, false)
		dbmodels.AddIndex(places_coll, dbmodels.EDITOR_FIELD, false)
		dbmodels.AddIndex(series_coll, dbmodels.EDITOR_FIELD, false)
		dbmodels.AddIndex(entries_coll, dbmodels.EDITOR_FIELD, false)
		dbmodels.AddIndex(contents_coll, dbmodels.EDITOR_FIELD, false)
		dbmodels.AddIndex(items_coll, dbmodels.EDITOR_FIELD, false)

		err_agents := app.Save(agents_coll)
		if err_agents != nil {
			return err_agents
		}

		err_places := app.Save(places_coll)
		if err_places != nil {
			return err_places
		}

		err_series := app.Save(series_coll)
		if err_series != nil {
			return err_series
		}

		err_entries := app.Save(entries_coll)
		if err_entries != nil {
			return err_entries
		}

		err_contents := app.Save(contents_coll)
		if err_contents != nil {
			return err_contents
		}

		err_items := app.Save(items_coll)
		if err_items != nil {
			return err_items
		}

		return nil
	}, func(app core.App) error {

		agents_coll, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
		if err == nil {
			removeEditedField(agents_coll)
			_ = app.Save(agents_coll)
		}

		places_coll, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
		if err == nil {
			removeEditedField(places_coll)
			_ = app.Save(places_coll)
		}

		series_coll, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
		if err == nil {
			removeEditedField(series_coll)
			_ = app.Save(series_coll)
		}

		entries_coll, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
		if err == nil {
			removeEditedField(entries_coll)
			_ = app.Save(entries_coll)
		}

		contents_coll, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err == nil {
			removeEditedField(contents_coll)
			_ = app.Save(contents_coll)
		}

		items_coll, err := app.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err == nil {
			removeEditedField(items_coll)
			_ = app.Save(items_coll)
		}

		return nil
	})
}

func removeEditedField(collection *core.Collection) {
	collection.Fields.RemoveByName(dbmodels.EDITOR_FIELD)
}

func addEditedField(collection *core.Collection, usersid string) {
	editedField := &core.RelationField{
		Name:         dbmodels.EDITOR_FIELD,
		Required:     false,
		System:       false,
		CollectionId: usersid,
	}
	collection.Fields.Add(editedField)
}
