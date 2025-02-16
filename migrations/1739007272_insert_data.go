package migrations

import (
	"errors"
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
		var placesmapid map[string]*dbmodels.Place
		var seriesmap map[string]*dbmodels.Series
		var entriesmap map[string]*dbmodels.Entry
		var entriesmapid map[string]*dbmodels.Entry
		var seriesmapid map[string]*dbmodels.Series
		var agentsmapid map[string]*dbmodels.Agent
		var contentsmap map[string]*dbmodels.Content
		var r_entries_series map[string][]*dbmodels.REntriesSeries
		var r_entries_agents map[string][]*dbmodels.REntriesAgents
		var r_contents_agents map[string][]*dbmodels.RContentsAgents

		var items []*dbmodels.Item

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
			agentsmapid = datatypes.MakeMap(agents, func(record *dbmodels.Agent) string { return record.Id })
			wg.Done()
		}()

		go func() {
			places, err := seed.RecordsFromOrte(app, adb.Orte)
			if err != nil {
				panic(err)
			}
			for _, record := range places {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			placesmap = datatypes.MakeMap(places, func(record *dbmodels.Place) string { return record.Name() })
			placesmapid = datatypes.MakeMap(places, func(record *dbmodels.Place) string { return record.Id })
			wg.Done()
		}()

		go func() {
			series, err := seed.RecordsFromReihentitel(app, adb.Reihen)
			if err != nil {
				panic(err)
			}
			for _, record := range series {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			seriesmap = datatypes.MakeMap(series, func(record *dbmodels.Series) string { return record.MusenalmID() })
			seriesmapid = datatypes.MakeMap(series, func(record *dbmodels.Series) string { return record.Id })
			wg.Done()
		}()

		wg.Wait()

		entries, err := seed.RecordsFromBände(app, *adb, placesmap)
		if err != nil {
			panic(err)
		}
		for _, record := range entries {
			if err = app.Save(record); err != nil {
				app.Logger().Error("Error saving record", "error", err, "record", record)
			}
		}

		entriesmap = datatypes.MakeMap(entries, func(record *dbmodels.Entry) string { return record.MusenalmID() })
		entriesmapid = datatypes.MakeMap(entries, func(record *dbmodels.Entry) string { return record.Id })

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
			if err != nil {
				panic(err)
			}
			for _, record := range contents {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			contentsmap = datatypes.MakeMap(contents, func(record *dbmodels.Content) string { return record.MusenalmID() })
			wg.Done()
		}()

		wg.Wait()

		wg.Add(3)

		go func() {
			records, err := seed.RecordsFromRelationBändeReihen(app, adb.Relationen_Bände_Reihen, seriesmap, entriesmap)
			if err != nil {
				panic(err)
			}
			for _, record := range records {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			r_entries_series = datatypes.MakeMultiMap(
				records,
				func(record *dbmodels.REntriesSeries) string { return record.Entry() })
			wg.Done()
		}()

		go func() {
			records, err := seed.RecordsFromRelationBändeAkteure(app, adb.Relationen_Bände_Akteure, entriesmap, agentsmap)
			if err != nil {
				panic(err)
			}
			for _, record := range records {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			r_entries_agents = datatypes.MakeMultiMap(
				records,
				func(record *dbmodels.REntriesAgents) string { return record.Entry() })
			wg.Done()
		}()

		go func() {
			records, err := seed.RecordsFromRelationInhalteAkteure(app, adb.Relationen_Inhalte_Akteure, contentsmap, agentsmap)
			if err != nil {
				panic(err)
			}
			for _, record := range records {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			r_contents_agents = datatypes.MakeMultiMap(
				records,
				func(record *dbmodels.RContentsAgents) string { return record.Content() })
			wg.Done()
		}()

		wg.Wait()

		// INFO: Inserting FTS5 data
		qp := dbmodels.FTS5InsertQuery(app, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS)
		qa := dbmodels.FTS5InsertQuery(app, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS)
		qs := dbmodels.FTS5InsertQuery(app, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS)
		qi := dbmodels.FTS5InsertQuery(app, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS)
		qe := dbmodels.FTS5InsertQuery(app, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS)
		qc := dbmodels.FTS5InsertQuery(app, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS)

		for _, place := range placesmap {
			if err = dbmodels.BulkInsertFTS5Place(qp, place); err != nil {
				app.Logger().Error("Error inserting place", "error", err, "place", place)
			}
		}

		for _, agent := range agentsmap {
			if err = dbmodels.BulkInsertFTS5Agent(qa, agent); err != nil {
				app.Logger().Error("Error inserting agent", "error", err, "agent", agent)
			}
		}

		for _, series := range seriesmap {
			if err = dbmodels.BulkInsertFTS5Series(qs, series); err != nil {
				app.Logger().Error("Error inserting series", "error", err, "series", series)
			}
		}

		for _, item := range items {
			if err = dbmodels.BulkInsertFTS5Item(qi, item); err != nil {
				app.Logger().Error("Error inserting item", "error", err, "item", item)
			}
		}

		for _, entry := range entriesmap {
			places := []*dbmodels.Place{}
			for _, place := range entry.Places() {
				places = append(places, placesmapid[place])
			}

			ser := []*dbmodels.Series{}
			for _, series := range r_entries_series[entry.Id] {
				ser = append(ser, seriesmapid[series.Series()])
			}

			agents := []*dbmodels.Agent{}
			for _, agent := range r_entries_agents[entry.Id] {
				agents = append(agents, agentsmapid[agent.Agent()])
			}

			if err = dbmodels.BulkInsertFTS5Entry(
				qe,
				entry,
				places,
				agents,
				ser,
			); err != nil {
				app.Logger().Error("Error inserting entry", "error", err, "entry", entry)
			}
		}

		for _, content := range contentsmap {
			agents := []*dbmodels.Agent{}
			for _, agent := range r_contents_agents[content.Id] {
				agents = append(agents, agentsmapid[agent.Agent()])
			}

			entry := entriesmapid[content.Entry()]

			if err = dbmodels.BulkInsertFTS5Content(
				qc,
				content,
				entry,
				agents,
			); err != nil {
				app.Logger().Error("Error inserting content", "error", err, "content", content)
			}
		}

		return nil
	}, func(app core.App) error {
		return errors.Join(
			delete_data(app),
			dbmodels.DeleteFTS5Data(app),
		)
	})
}

func delete_data(app core.App) error {
	err1 := deleteTableContents(app, dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE))
	err2 := deleteTableContents(app, dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE))
	err3 := deleteTableContents(app, dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
	err4 := deleteTableContents(app, dbmodels.CONTENTS_TABLE)
	err5 := deleteTableContents(app, dbmodels.ENTRIES_TABLE)
	err6 := deleteTableContents(app, dbmodels.SERIES_TABLE)
	err7 := deleteTableContents(app, dbmodels.ITEMS_TABLE)
	err8 := deleteTableContents(app, dbmodels.AGENTS_TABLE)
	err9 := deleteTableContents(app, dbmodels.PLACES_TABLE)
	return errors.Join(err1, err2, err3, err4, err5, err6, err7, err8, err9)
}

func deleteTableContents(app core.App, table string) error {
	_, err := app.DB().NewQuery("DELETE FROM " + table).Execute()
	if err != nil {
		return err
	}
	return nil
}
