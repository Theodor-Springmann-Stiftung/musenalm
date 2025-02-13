package migrations

import (
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/migrations/seed"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		adb, err := xmlmodels.ReadAccessDB(xmlmodels.DATA_PATH, app.Logger())
		if err != nil {
			return err
		}

		adb.Reihen = xmlmodels.SanitizeReihen(adb.Reihen, adb.Relationen_Bände_Reihen)

		var agentsmap map[string]*dbmodels.Agent
		var placesmap map[string]*dbmodels.Place
		var seriesmap map[string]*dbmodels.Series
		var entriesmap map[string]*dbmodels.Entry
		var contentsmap map[string]*dbmodels.Content

		wg := sync.WaitGroup{}
		wg.Add(3)

		go func() {
			agents, err := seed.RecordsFromAkteure(app, adb.Akteure)
			if err == nil {
				for _, record := range agents {
					if err = app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			agentsmap = datatypes.MakeMap(agents, func(record *dbmodels.Agent) string { return record.MusenalmID() })
			wg.Done()
		}()

		go func() {
			places, err := seed.RecordsFromOrte(app, adb.Orte)
			if err == nil {
				for _, record := range places {
					if err = app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			placesmap = datatypes.MakeMap(places, func(record *dbmodels.Place) string { return record.Name() })
			wg.Done()
		}()

		go func() {
			series, err := seed.RecordsFromReihentitel(app, adb.Reihen)
			if err == nil {
				for _, record := range series {
					if err = app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			seriesmap = datatypes.MakeMap(series, func(record *dbmodels.Series) string { return record.MusenalmID() })
			wg.Done()
		}()

		wg.Wait()

		entries, err := seed.RecordsFromBände(app, *adb, placesmap)
		if err == nil {
			for _, record := range entries {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
		} else {
			panic(err)
		}

		entriesmap = datatypes.MakeMap(entries, func(record *dbmodels.Entry) string { return record.MusenalmID() })

		wg.Add(2)

		go func() {
			if records, err := seed.ItemsFromBändeAndBIBLIO(app, adb.Bände, adb.BIBLIO, entriesmap); err == nil {
				for _, record := range records {
					if err = app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		go func() {
			contents, err := seed.RecordsFromInhalte(app, adb.Inhalte, entriesmap)
			if err == nil {
				for _, record := range contents {
					if err = app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			contentsmap = datatypes.MakeMap(contents, func(record *dbmodels.Content) string { return record.MusenalmID() })
			wg.Done()
		}()

		wg.Wait()

		wg.Add(3)

		go func() {
			if records, err := seed.RecordsFromRelationBändeReihen(app, adb.Relationen_Bände_Reihen, seriesmap, entriesmap); err == nil {
				for _, record := range records {
					if err := app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		go func() {
			if records, err := seed.RecordsFromRelationBändeAkteure(app, adb.Relationen_Bände_Akteure, entriesmap, agentsmap); err == nil {
				for _, record := range records {
					if err := app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		go func() {
			if records, err := seed.RecordsFromRelationInhalteAkteure(app, adb.Relationen_Inhalte_Akteure, contentsmap, agentsmap); err == nil {
				for _, record := range records {
					if err := app.Save(record); err != nil {
						app.Logger().Error("Error saving record", "error", err, "record", record)
					}
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		wg.Wait()

		return nil
	}, func(app core.App) error {
		return delete_data(app)
	})
}

func delete_data(app core.App) error {
	_ = deleteTableContents(app, dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
	_ = deleteTableContents(app, dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE))
	_ = deleteTableContents(app, dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
	_ = deleteTableContents(app, dbmodels.CONTENTS_TABLE)
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
