package dbmodels

import (
	"strconv"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

type EntriesAgents map[string][]*REntriesAgents

func EntriesForID(app core.App, query int) ([]*Entry, error) {
	entries := []*Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.HashExp{MUSENALMID_FIELD: strconv.Itoa(query)}).
		All(&entries)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

func YearsForEntries(app core.App) ([]int, error) {
	rec := []core.Record{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Select(YEAR_FIELD + " AS id").
		Distinct(true).
		OrderBy("id").
		All(&rec)
	if err != nil {
		return nil, err
	}

	years := []int{}
	for _, r := range rec {
		years = append(years, r.GetInt("id"))
	}

	return years, nil
}

func EntriesForYear(app core.App, year int) ([]*Entry, error) {
	entries := []*Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.HashExp{YEAR_FIELD: year}).
		All(&entries)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

func EntriesForAgent(app core.App, agentId string) ([]*Entry, EntriesAgents, error) {
	relations := []*core.Record{}
	err := app.RecordQuery(RelationTableName(ENTRIES_TABLE, AGENTS_TABLE)).
		Where(dbx.HashExp{AGENTS_TABLE: agentId}).
		All(&relations)
	if err != nil {
		return nil, nil, err
	}

	app.ExpandRecords(relations, []string{ENTRIES_TABLE}, nil)
	entries := []*Entry{}
	for _, r := range relations {
		record := r.ExpandedOne(ENTRIES_TABLE)
		if record == nil {
			continue
		}
		entries = append(entries, NewEntry(record))
	}

	agents := map[string][]*REntriesAgents{}
	for _, r := range relations {
		agent := NewREntriesAgents(r)
		agents[agent.Entry()] = append(agents[agent.Entry()], agent)
	}

	return entries, agents, nil
}

func EntriesForPlace(app core.App, placeId string) ([]*Entry, error) {
	entries := []*Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.Like(PLACES_TABLE, placeId).Match(true, true)).
		All(&entries)
	if err != nil {
		return nil, err
	}

	return entries, nil
}

func EntryForId(app core.App, id string) (*Entry, error) {
	entry := &Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.HashExp{ID_FIELD: id}).
		One(entry)
	if err != nil {
		return nil, err
	}
	return entry, nil
}

func EntriesForIds(app core.App, ids []any) ([]*Entry, error) {
	entries := []*Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.HashExp{ID_FIELD: ids}).
		All(&entries)
	if err != nil {
		return nil, err
	}
	return entries, nil
}

func EntryForMusenalmID(app core.App, id string) (*Entry, error) {
	entry := &Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.HashExp{MUSENALMID_FIELD: id}).
		One(entry)
	if err != nil {
		return nil, err
	}
	return entry, nil
}

func EntriesForContents(app core.App, contents []*Content) (map[string]*Entry, error) {
	cids := []any{}
	for _, c := range contents {
		cids = append(cids, c.Entry())
	}

	entries := []*Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.HashExp{ID_FIELD: cids}).
		All(&entries)
	if err != nil {
		return nil, err
	}

	entriesMap := make(map[string]*Entry, len(entries))
	for _, e := range entries {
		entriesMap[e.Id] = e
	}

	return entriesMap, nil
}
