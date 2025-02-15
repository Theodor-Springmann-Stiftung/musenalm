package dbmodels

import (
	"slices"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

type SeriesEntries map[string][]*REntriesSeries

func SortSeriessesByTitle(series []*Series) {
	collator := collate.New(language.German)
	slices.SortFunc(series, func(i, j *Series) int {
		return collator.CompareString(i.Title(), j.Title())
	})
}

func BasicSearchSeries(app core.App, query string) ([]*Series, []*Series, error) {
	series, err := TitleSearchSeries(app, query)
	if err != nil {
		return nil, nil, err
	}

	altseries, err := AltSearchSeries(app, query)
	if err != nil {
		return nil, nil, err
	}
	return series, altseries, nil
}

func TitleSearchSeries(app core.App, query string) ([]*Series, error) {
	series := []*Series{}
	err := app.RecordQuery(SERIES_TABLE).
		Where(dbx.Like(SERIES_TITLE_FIELD, query).Match(true, true)).
		OrderBy(SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return nil, err
	}

	return series, nil
}

func AltSearchSeries(app core.App, query string) ([]*Series, error) {
	series := []*Series{}
	err := app.RecordQuery(SERIES_TABLE).
		Where(dbx.Like(ANNOTATION_FIELD, query).Match(true, true)).
		OrderBy(SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return nil, err
	}

	return series, nil
}

func IDsForSeriesses(series []*Series) []any {
	ids := []any{}
	for _, s := range series {
		ids = append(ids, s.Id)
	}
	return ids
}

func makeMapForEnrySeries(relations []*REntriesSeries, entries map[string]*Entry) SeriesEntries {
	m := map[string][]*REntriesSeries{}
	for _, r := range relations {
		m[r.Series()] = append(m[r.Series()], r)
	}

	for _, rel := range m {
		slices.SortFunc(rel, func(i, j *REntriesSeries) int {
			ientry := entries[i.Entry()]
			jentry := entries[j.Entry()]
			return ientry.Year() - jentry.Year()
		})
	}

	return m
}

func EntriesForSeriesses(app core.App, series []*Series) (
	SeriesEntries,
	map[string]*Entry,
	error) {
	ids := IDsForSeriesses(series)
	relations := []*core.Record{}

	err := app.RecordQuery(RelationTableName(ENTRIES_TABLE, SERIES_TABLE)).
		Where(dbx.HashExp{
			SERIES_TABLE: ids,
		}).
		All(&relations)
	if err != nil {
		return nil, nil, err
	}

	app.ExpandRecords(relations, []string{ENTRIES_TABLE}, nil)
	bmap := map[string]*Entry{}
	for _, r := range relations {
		record := r.ExpandedOne(ENTRIES_TABLE)
		if record == nil {
			continue
		}
		entry := NewEntry(record)
		bmap[entry.Id] = entry
	}

	smap := map[string][]*REntriesSeries{}
	for _, r := range relations {
		rel := NewREntriesSeries(r)
		smap[rel.Series()] = append(smap[rel.Series()], rel)
	}

	for _, rel := range smap {
		slices.SortFunc(rel, func(i, j *REntriesSeries) int {
			ientry := bmap[i.Entry()]
			jentry := bmap[j.Entry()]
			return ientry.Year() - jentry.Year()
		})
	}

	return smap, bmap, nil
}

func LettersForSeries(app core.App) ([]string, error) {
	letters := []core.Record{}
	ids := []string{}

	err := app.RecordQuery(SERIES_TABLE).
		Select("upper(substr(" + SERIES_TITLE_FIELD + ", 1, 1)) AS id").
		Distinct(true).
		All(&letters)
	if err != nil {
		return nil, err
	}

	for _, l := range letters {
		ids = append(ids, l.GetString("id"))
	}
	return ids, nil
}

func AllAgentsForSeries(app core.App) ([]*Agent, error) {
	rels := []*core.Record{}
	// INFO: we could just fetch all relations here
	err := app.RecordQuery(RelationTableName(ENTRIES_TABLE, AGENTS_TABLE)).
		GroupBy(AGENTS_TABLE).
		All(&rels)
	if err != nil {
		return nil, err
	}

	app.ExpandRecords(rels, []string{AGENTS_TABLE}, nil)
	agents := []*Agent{}
	for _, r := range rels {
		record := r.ExpandedOne(AGENTS_TABLE)
		if record == nil {
			continue
		}
		agent := NewAgent(record)
		agents = append(agents, agent)
	}

	SortAgentsByName(agents)

	return agents, err
}

func SeriesForLetter(app core.App, letter string) ([]*Series, error) {
	series := []*Series{}
	err := app.RecordQuery(SERIES_TABLE).
		Where(dbx.Like(SERIES_TITLE_FIELD, letter).Match(false, true)).
		OrderBy(SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return nil, err
	}

	return series, nil
}

func SeriesForAgent(app core.App, id string) ([]*Series, SeriesEntries, map[string]*Entry, error) {
	entries, _, err := EntriesForAgent(app, id)
	if err != nil {
		return nil, nil, nil, err
	}

	return SeriesForEntries(app, entries)
}

func SeriesForPlace(app core.App, id string) ([]*Series, SeriesEntries, map[string]*Entry, error) {
	entries, err := EntriesForPlace(app, id)
	if err != nil {
		return nil, nil, nil, err
	}

	return SeriesForEntries(app, entries)
}

func SeriesForEntries(app core.App, entries []*Entry) ([]*Series, SeriesEntries, map[string]*Entry, error) {
	bids := make([]any, 0, len(entries))
	for _, e := range entries {
		bids = append(bids, e.Id)
	}

	srels := []*REntriesSeries{}
	err := app.RecordQuery(RelationTableName(ENTRIES_TABLE, SERIES_TABLE)).
		Where(dbx.HashExp{ENTRIES_TABLE: bids}).
		All(&srels)
	if err != nil {
		return nil, nil, nil, err
	}

	sids := []any{}
	for _, s := range srels {
		sids = append(sids, s.Series())
	}

	series := []*Series{}
	err = app.RecordQuery(SERIES_TABLE).
		Where(dbx.HashExp{ID_FIELD: sids}).
		All(&series)
	if err != nil {
		return nil, nil, nil, err
	}

	bmap := make(map[string]*Entry, len(entries))
	for _, e := range entries {
		bmap[e.Id] = e
	}

	smap := makeMapForEnrySeries(srels, bmap)

	return series, smap, bmap, nil
}

func SeriesForYear(app core.App, year int) ([]*Series, SeriesEntries, map[string]*Entry, error) {
	series, err := EntriesForYear(app, year)
	if err != nil {
		return nil, nil, nil, err
	}

	return SeriesForEntries(app, series)
}

func SeriesForId(app core.App, id string) (*Series, error) {
	s := &Series{}
	err := app.RecordQuery(SERIES_TABLE).
		Where(dbx.HashExp{MUSENALMID_FIELD: id}).
		One(s)
	if err != nil {
		return nil, err
	}

	return s, nil
}
