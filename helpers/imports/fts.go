package imports

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RebuildFTS(app core.App) error {
	if err := dbmodels.DeleteFTS5Data(app); err != nil {
		return err
	}

	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return err
	}
	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
		return err
	}
	series := []*dbmodels.Series{}
	if err := app.RecordQuery(dbmodels.SERIES_TABLE).All(&series); err != nil {
		return err
	}
	items := []*dbmodels.Item{}
	if err := app.RecordQuery(dbmodels.ITEMS_TABLE).All(&items); err != nil {
		return err
	}
	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return err
	}
	contents := []*dbmodels.Content{}
	if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).All(&contents); err != nil {
		return err
	}

	entriesSeries := []*dbmodels.REntriesSeries{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)).All(&entriesSeries); err != nil {
		return err
	}
	entriesAgents := []*dbmodels.REntriesAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).All(&entriesAgents); err != nil {
		return err
	}
	contentsAgents := []*dbmodels.RContentsAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)).All(&contentsAgents); err != nil {
		return err
	}

	placesById := map[string]*dbmodels.Place{}
	for _, place := range places {
		placesById[place.Id] = place
	}
	agentsById := map[string]*dbmodels.Agent{}
	for _, agent := range agents {
		agentsById[agent.Id] = agent
	}
	seriesById := map[string]*dbmodels.Series{}
	for _, s := range series {
		seriesById[s.Id] = s
	}
	entriesById := map[string]*dbmodels.Entry{}
	for _, entry := range entries {
		entriesById[entry.Id] = entry
	}

	entriesSeriesMap := map[string][]*dbmodels.Series{}
	for _, rel := range entriesSeries {
		if series := seriesById[rel.Series()]; series != nil {
			entriesSeriesMap[rel.Entry()] = append(entriesSeriesMap[rel.Entry()], series)
		}
	}
	entriesAgentsMap := map[string][]*dbmodels.Agent{}
	for _, rel := range entriesAgents {
		if agent := agentsById[rel.Agent()]; agent != nil {
			entriesAgentsMap[rel.Entry()] = append(entriesAgentsMap[rel.Entry()], agent)
		}
	}
	contentsAgentsMap := map[string][]*dbmodels.Agent{}
	for _, rel := range contentsAgents {
		if agent := agentsById[rel.Agent()]; agent != nil {
			contentsAgentsMap[rel.Content()] = append(contentsAgentsMap[rel.Content()], agent)
		}
	}

	qp := dbmodels.FTS5InsertQuery(app, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS)
	qa := dbmodels.FTS5InsertQuery(app, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS)
	qs := dbmodels.FTS5InsertQuery(app, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS)
	qi := dbmodels.FTS5InsertQuery(app, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS)
	qe := dbmodels.FTS5InsertQuery(app, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS)
	qc := dbmodels.FTS5InsertQuery(app, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS)

	for _, place := range places {
		if err := dbmodels.BulkInsertFTS5Place(qp, place); err != nil {
			return err
		}
	}
	for _, agent := range agents {
		if err := dbmodels.BulkInsertFTS5Agent(qa, agent); err != nil {
			return err
		}
	}
	for _, s := range series {
		if err := dbmodels.BulkInsertFTS5Series(qs, s); err != nil {
			return err
		}
	}
	for _, item := range items {
		if err := dbmodels.BulkInsertFTS5Item(qi, item); err != nil {
			return err
		}
	}

	for _, entry := range entries {
		entryPlaces := []*dbmodels.Place{}
		for _, placeId := range entry.Places() {
			if place := placesById[placeId]; place != nil {
				entryPlaces = append(entryPlaces, place)
			}
		}
		entryAgents := entriesAgentsMap[entry.Id]
		entrySeries := entriesSeriesMap[entry.Id]
		if err := dbmodels.BulkInsertFTS5Entry(qe, entry, entryPlaces, entryAgents, entrySeries); err != nil {
			return err
		}
	}

	for _, content := range contents {
		entry := entriesById[content.Entry()]
		contentAgents := contentsAgentsMap[content.Id]
		if err := dbmodels.BulkInsertFTS5Content(qc, content, entry, contentAgents); err != nil {
			return err
		}
	}

	return nil
}
