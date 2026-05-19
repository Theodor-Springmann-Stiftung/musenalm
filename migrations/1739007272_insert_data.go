package migrations

import (
	"errors"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/imports"
	"github.com/Theodor-Springmann-Stiftung/musenalm/migrations/seed"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		if candidate, err := imports.FindLatestImport("data"); err != nil {
			return err
		} else if candidate != nil {
			app.Logger().Info("Importing Musenalm data from export", "path", candidate.Path)
			if err := imports.ImportData(app, candidate); err != nil {
				return err
			}
			return imports.RebuildFTS(app)
		}

		adb, err := xmlmodels.ReadAccessDB(xmlmodels.DATA_PATH, app.Logger())
		if err != nil {
			return err
		}
		legacyData, err := xmlmodels.ReadLegacyFallbackData(xmlmodels.DATA_PATH, app.Logger())
		if err != nil {
			return err
		}
		realnameData, err := xmlmodels.ReadRealnameTab(xmlmodels.DATA_PATH, app.Logger())
		if err != nil {
			return err
		}

		adb.Reihen = xmlmodels.SanitizeReihen(adb.Reihen, adb.Relationen_Bände_Reihen)
		images := seed.IndexContentImages(xmlmodels.IMG_PATH)

		var agentsmap map[int]*dbmodels.Agent
		var placesmap map[string]*dbmodels.Place
		var placesmapid map[string]*dbmodels.Place
		var seriesmap map[int]*dbmodels.Series
		var entriesmap map[int]*dbmodels.Entry
		var entriesmapid map[string]*dbmodels.Entry
		var seriesmapid map[string]*dbmodels.Series
		var agentsmapid map[string]*dbmodels.Agent
		var agentsmapname map[string]*dbmodels.Agent
		var contentsmap map[int]*dbmodels.Content
		var modernBandEntries map[int]*dbmodels.Entry
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
			agentsmap = datatypes.MakeMap(agents, func(record *dbmodels.Agent) int { return record.MusenalmID() })
			agentsmapid = datatypes.MakeMap(agents, func(record *dbmodels.Agent) string { return record.Id })
			agentsmapname = datatypes.MakeMap(agents, func(record *dbmodels.Agent) string { return record.Name() })
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
			seriesmap = datatypes.MakeMap(series, func(record *dbmodels.Series) int { return record.MusenalmID() })
			seriesmapid = datatypes.MakeMap(series, func(record *dbmodels.Series) string { return record.Id })
			wg.Done()
		}()

		wg.Wait()

		legacyMatches := seed.LegacyBandMatches(adb.Bände, adb.Inhalte, legacyData)
		contentCounts := seed.SelectedContentCounts(adb.Inhalte, legacyMatches)
		entries, err := seed.RecordsFromBände(app, *adb, placesmap, contentCounts, legacyMatches)
		if err != nil {
			panic(err)
		}
		postCutoverEntries, postCutoverBandEntries, err := seed.RecordsFromPostCutoverAlmNeu(app, *adb, legacyData, placesmap, seriesmap)
		if err != nil {
			panic(err)
		}
		entries = append(entries, postCutoverEntries...)
		modernBandEntries = postCutoverBandEntries
		for _, record := range entries {
			if err = app.Save(record); err != nil {
				app.Logger().Error("Error saving record", "error", err, "record", record)
			}
		}

		entriesmap = datatypes.MakeMap(entries, func(record *dbmodels.Entry) int { return record.MusenalmID() })
		entriesmapid = datatypes.MakeMap(entries, func(record *dbmodels.Entry) string { return record.Id })

		wg.Add(1)

		go func() {
			records, err := seed.ItemsFromBändeAndBIBLIOWithAliases(app, adb.Bände, adb.BIBLIO, entriesmap, modernBandEntries, legacyData)
			if err != nil {
				panic(err)
			}
			for _, record := range records {
				if err = app.Save(record); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", record)
				}
			}
			items = records
			wg.Done()
		}()

		wg.Wait()

		contentRecords, err := seed.RecordsFromLegacyData(app, legacyData, entriesmap, items, images)
		if err != nil {
			panic(err)
		}
		for _, record := range contentRecords {
			if err = app.Save(record); err != nil {
				app.Logger().Error("Error saving record", "error", err, "record", record)
			}
		}
		contentsmap = datatypes.MakeMap(contentRecords, func(record *dbmodels.Content) int { return record.MusenalmID() })

		r_contents_agents = map[string][]*dbmodels.RContentsAgents{}

		wg.Add(2)

		go func() {
			entriesByModernBand := map[int]*dbmodels.Entry{}
			for id, entry := range entriesmap {
				entriesByModernBand[id] = entry
			}
			for id, entry := range modernBandEntries {
				entriesByModernBand[id] = entry
			}
			records, err := seed.RecordsFromRelationBändeReihen(app, adb.Relationen_Bände_Reihen, seriesmap, entriesByModernBand)
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
			entriesByModernBand := map[int]*dbmodels.Entry{}
			for id, entry := range entriesmap {
				entriesByModernBand[id] = entry
			}
			for id, entry := range modernBandEntries {
				entriesByModernBand[id] = entry
			}
			records, err := seed.RecordsFromRelationBändeAkteure(app, adb.Relationen_Bände_Akteure, entriesByModernBand, agentsmap)
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

		wg.Wait()

		resolver, err := seed.NewAgentResolver(app, agentsmapname, agentsmapid)
		if err != nil {
			panic(err)
		}

		realnameResolver := seed.NewRealnameResolver(realnameData)

		contentFallbackRelations, err := seed.RecordsFromLegacyContentsAgents(
			app,
			contentsmap,
			r_contents_agents,
			legacyData,
			resolver,
			realnameResolver,
		)
		if err != nil {
			panic(err)
		}
		for _, record := range contentFallbackRelations {
			if err = app.Save(record); err != nil {
				app.Logger().Error("Error saving fallback content-agent relation", "error", err, "record", record)
			}
		}

		entryFallbackRelations, err := seed.RecordsFromFallbackEntriesAgents(
			app,
			entriesmapid,
			r_entries_agents,
			resolver,
		)
		if err != nil {
			panic(err)
		}
		for _, record := range entryFallbackRelations {
			if err = app.Save(record); err != nil {
				app.Logger().Error("Error saving fallback entry-agent relation", "error", err, "record", record)
			}
		}

		if _, err := seed.RunDataHarmonization(app); err != nil {
			panic(err)
		}

		filteredSeriesMap := map[int]*dbmodels.Series{}
		filteredSeriesMapByID := map[string]*dbmodels.Series{}
		for musenalmID, record := range seriesmap {
			found, findErr := app.FindRecordById(dbmodels.SERIES_TABLE, record.Id)
			if findErr == nil && found != nil {
				filteredSeriesMap[musenalmID] = record
				filteredSeriesMapByID[record.Id] = record
			}
		}
		seriesmap = filteredSeriesMap
		seriesmapid = filteredSeriesMapByID

		filteredAgentsByMusenalmID := map[int]*dbmodels.Agent{}
		filteredAgentsByID := map[string]*dbmodels.Agent{}
		filteredAgentsByName := map[string]*dbmodels.Agent{}
		for musenalmID, record := range agentsmap {
			found, findErr := app.FindRecordById(dbmodels.AGENTS_TABLE, record.Id)
			if findErr == nil && found != nil {
				filteredAgentsByMusenalmID[musenalmID] = record
				filteredAgentsByID[record.Id] = record
				filteredAgentsByName[record.Name()] = record
			}
		}
		agentsmap = filteredAgentsByMusenalmID
		agentsmapid = filteredAgentsByID
		agentsmapname = filteredAgentsByName

		filteredContentsMap := map[int]*dbmodels.Content{}
		for musenalmID, record := range contentsmap {
			found, findErr := app.FindRecordById(dbmodels.CONTENTS_TABLE, record.Id)
			if findErr == nil && found != nil {
				filteredContentsMap[musenalmID] = record
			}
		}
		contentsmap = filteredContentsMap

		// INFO: We need to get places again, sice it has changed in entries
		places := []*dbmodels.Place{}
		err = app.RecordQuery(dbmodels.PLACES_TABLE).All(&places)
		if err != nil {
			panic(err)
		}

		placesmapid = datatypes.MakeMap(places, func(record *dbmodels.Place) string { return record.Id })

		// INFO: Inserting FTS5 data
		qp := dbmodels.FTS5InsertQuery(app, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS)
		qa := dbmodels.FTS5InsertQuery(app, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS)
		qs := dbmodels.FTS5InsertQuery(app, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS)
		qi := dbmodels.FTS5InsertQuery(app, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS)
		qe := dbmodels.FTS5InsertQuery(app, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS)
		qc := dbmodels.FTS5InsertQuery(app, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS)

		for _, place := range places {
			if err = dbmodels.BulkInsertFTS5Place(qp, place); err != nil {
				app.Logger().Error("Error inserting place", "error", err, "place", place)
			}
		}

		for _, agent := range agentsmapid {
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
			if sid := entry.Series(); sid != "" {
				if s := seriesmapid[sid]; s != nil {
					ser = append(ser, s)
				}
			}
			for _, series := range r_entries_series[entry.Id] {
				if s := seriesmapid[series.Series()]; s != nil {
					ser = append(ser, s)
				}
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
