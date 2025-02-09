package migrations

import (
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
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

		wg := sync.WaitGroup{}
		wg.Add(3)
		go func() {
			if records, err := seed.RecordsFromAkteure(app, adb.Akteure); err == nil {
				if err = seed.BatchSave(app, records); err != nil {
					panic(err)
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		go func() {
			if records, err := seed.RecordsFromOrte(app, adb.Orte); err == nil {
				if err = seed.BatchSave(app, records); err != nil {
					panic(err)
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		go func() {
			if records, err := seed.RecordsFromReihentitel(app, adb.Reihen); err == nil {
				if err = seed.BatchSave(app, records); err != nil {
					panic(err)
				}
			} else {
				panic(err)
			}
			wg.Done()
		}()

		wg.Wait()

		if records, err := seed.RecordsFromBände(app, *adb); err == nil {
			if err = seed.BatchSave(app, records); err != nil {
				panic(err)
			}
		} else {
			panic(err)
		}

		if records, err := seed.ItemsFromBändeAndBIBLIO(app, adb.Bände, adb.BIBLIO); err == nil {
			if err = seed.BatchSave(app, records); err != nil {
				panic(err)
			}
		} else {
			panic(err)
		}

		if records, err := seed.RecordsFromInhalte(app, adb.Inhalte); err == nil {
			if err = seed.BatchSave(app, records); err != nil {
				panic(err)
			}
		} else {
			panic(err)
		}

		if records, err := seed.RecordsFromRelationBändeReihen(app, adb.Relationen_Bände_Reihen); err == nil {
			if err = seed.BatchSave(app, records); err != nil {
				panic(err)
			}
		} else {
			panic(err)
		}

		if records, err := seed.RecordsFromRelationBändeAkteure(app, adb.Relationen_Bände_Akteure); err == nil {
			if err = seed.BatchSave(app, records); err != nil {
				panic(err)
			}
		} else {
			panic(err)
		}

		if records, err := seed.RecordsFromRelationInhalteAkteure(app, adb.Relationen_Inhalte_Akteure); err == nil {
			if err = seed.BatchSave(app, records); err != nil {
				panic(err)
			}
		} else {
			panic(err)
		}

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
