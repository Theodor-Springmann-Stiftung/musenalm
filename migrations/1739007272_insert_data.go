package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/migrations/seed"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		adb, err := xmlmodels.ReadAccessDB(xmlmodels.DATA_PATH)
		if err != nil {
			return err
		}

		*adb.Reihen = xmlmodels.SanitizeReihen(*adb.Reihen, *adb.Relationen_Bände_Reihen)

		seed.SeedTableAgents(app, *adb.Akteure)
		seed.SeedTablePlaces(app, *adb.Orte)
		seed.SeedTableSeries(app, *adb.Reihen)
		seed.SeedTableEntries(app, *adb.Bände, *adb.BIBLIO, *adb.Orte)
		return nil
	}, func(app core.App) error {
		return delete_data(app)
	})
}

func delete_data(app core.App) error {
	_ = deleteTableContents(app, dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
	_ = deleteTableContents(app, dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE))
	_ = deleteTableContents(app, dbmodels.RelationTableName(dbmodels.PARTIALS_TABLE, dbmodels.AGENTS_TABLE))
	_ = deleteTableContents(app, dbmodels.PARTIALS_TABLE)
	_ = deleteTableContents(app, dbmodels.ENTRIES_TABLE)
	_ = deleteTableContents(app, dbmodels.SERIES_TABLE)
	_ = deleteTableContents(app, dbmodels.AGENTS_TABLE)
	_ = deleteTableContents(app, dbmodels.PLACES_TABLE)
	return nil
}

func deleteTableContents(app core.App, table string) error {
	_, err := app.DB().NewQuery("DELETE FROM " + table).Execute()
	if err != nil {
		return err
	}
	return nil
}
