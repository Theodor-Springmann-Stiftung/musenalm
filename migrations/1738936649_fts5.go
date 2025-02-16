package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		err := createFTS5(app, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS)
		if err != nil {
			app.Logger().Error("Error creating FTS5 table for agents", "error", err)
		}

		err = createFTS5(app, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS)
		if err != nil {
			app.Logger().Error("Error creating FTS5 table for places", "error", err)
		}

		err = createFTS5(app, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS)
		if err != nil {
			app.Logger().Error("Error creating FTS5 table for series", "error", err)
		}

		err = createFTS5(app, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS)
		if err != nil {
			app.Logger().Error("Error creating FTS5 table for items", "error", err)
		}

		err = createFTS5(app, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS)
		if err != nil {
			app.Logger().Error("Error creating FTS5 table for entries", "error", err)
		}

		err = createFTS5(app, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS)
		if err != nil {
			app.Logger().Error("Error creating FTS5 table for contents", "error", err)
		}

		return nil
	}, func(app core.App) error {
		deleteTable(app, dbmodels.FTS5_PREFIX+dbmodels.AGENTS_TABLE)
		deleteTable(app, dbmodels.FTS5_PREFIX+dbmodels.PLACES_TABLE)
		deleteTable(app, dbmodels.FTS5_PREFIX+dbmodels.SERIES_TABLE)
		deleteTable(app, dbmodels.FTS5_PREFIX+dbmodels.ITEMS_TABLE)
		deleteTable(app, dbmodels.FTS5_PREFIX+dbmodels.ENTRIES_TABLE)
		deleteTable(app, dbmodels.FTS5_PREFIX+dbmodels.CONTENTS_TABLE)
		return nil
	})
}

func createFTS5(app core.App, table string, fields []string) error {
	query := dbmodels.CreateFTS5TableQuery(
		table,
		fields...,
	)

	_, err := app.DB().NewQuery(query).Execute()
	if err != nil {
		return err
	}

	return nil

}

func deleteTable(app core.App, table string) error {
	query := "DROP TABLE IF EXISTS " + table

	_, err := app.DB().NewQuery(query).Execute()
	if err != nil {
		return err
	}

	return nil
}
