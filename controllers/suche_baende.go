package controllers

import (
	"database/sql"
	"slices"

	musenalmapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

const (
	DEFAULT_PAGESIZE_BAENDE = 40
)

type SearchResultBaende struct {
	Queries []dbmodels.FTS5QueryRequest

	// these are the sorted IDs for hits
	Hits    []string
	Entries map[string]*dbmodels.Entry // <- Key: Entry ID

	// INFO: this is as they say doppelt gemoppelt bc of a logic error i made while tired
	EntriesSeries map[string][]*dbmodels.REntriesSeries // <- Key: Entry ID
	SeriesEntries map[string][]*dbmodels.REntriesSeries // <- Key: Series ID
	EntriesAgents map[string][]*dbmodels.REntriesAgents // <- Key: Entry ID

	Pages []int
}

func EmptyResultBaende() *SearchResultBaende {
	return &SearchResultBaende{
		Hits:          []string{},
		Entries:       make(map[string]*dbmodels.Entry),
		EntriesSeries: make(map[string][]*dbmodels.REntriesSeries),
		SeriesEntries: make(map[string][]*dbmodels.REntriesSeries),
		EntriesAgents: make(map[string][]*dbmodels.REntriesAgents),
	}
}

func NewSearchBaende(app *musenalmapp.App, params SearchParameters) (*SearchResultBaende, error) {
	coreApp := app.Core()
	entries := []*dbmodels.Entry{}
	queries := params.FieldSetBaende()

	if params.AlmString != "" {
		e, err := dbmodels.Entries_MusenalmID(coreApp, params.AlmString)
		if err != nil && err == sql.ErrNoRows {
			return EmptyResultBaende(), nil
		} else if err != nil {
			return nil, err
		}

		entries = append(entries, e)
	} else {
		if len(queries) == 0 {
			return nil, ErrNoQuery
		}

		ids, err := dbmodels.FTS5Search(coreApp, dbmodels.ENTRIES_TABLE, queries...)
		if err != nil {
			return nil, err
		} else if len(ids) == 0 {
			return EmptyResultBaende(), nil
		}

		resultids := []any{}
		for _, id := range ids {
			resultids = append(resultids, id.ID)
		}

		e, err := dbmodels.Entries_IDs(coreApp, resultids)
		if err != nil {
			return nil, err
		}
		entries = e
	}

	resultids := []any{}
	for _, entry := range entries {
		resultids = append(resultids, entry.Id)
	}

	entriesmap := make(map[string]*dbmodels.Entry)
	for _, entry := range entries {
		entriesmap[entry.Id] = entry
	}

	relations, err := dbmodels.REntriesSeries_Entries(coreApp, resultids)
	if err != nil {
		return nil, err
	}

	relationsmap := make(map[string][]*dbmodels.REntriesSeries)
	invrelationsmap := make(map[string][]*dbmodels.REntriesSeries)
	for _, r := range relations {
		invrelationsmap[r.Series()] = append(invrelationsmap[r.Series()], r)
		relationsmap[r.Entry()] = append(relationsmap[r.Entry()], r)
	}

	arelations, err := dbmodels.REntriesAgents_Entries(coreApp, resultids)
	if err != nil {
		return nil, err
	}

	relationsagentsmap := make(map[string][]*dbmodels.REntriesAgents)
	for _, r := range arelations {
		relationsagentsmap[r.Entry()] = append(relationsagentsmap[r.Entry()], r)
	}

	hits := []string{}
	var pages []int
	if params.Sort == "series" {
		for seriesID := range invrelationsmap {
			hits = append(hits, seriesID)
		}
		slices.SortFunc(hits, func(left, right string) int {
			leftSeries := app.GetSeriesDisplay(left)
			rightSeries := app.GetSeriesDisplay(right)
			if leftSeries.Name == rightSeries.Name {
				return leftSeries.MusenalmID - rightSeries.MusenalmID
			}
			if leftSeries.Name < rightSeries.Name {
				return -1
			}
			return 1
		})
		pages = PagesMap(hits, invrelationsmap, DEFAULT_PAGESIZE_BAENDE)
	} else {
		dbmodels.Sort_Entries_Year_Title(entries)
		for _, e := range entries {
			hits = append(hits, e.Id)
		}
		pages = PagesArray(hits, DEFAULT_PAGESIZE_BAENDE)
	}

	if params.Page < 1 || params.Page > len(pages) {
		params.Page = 1
	}

	if params.Page == len(pages) {
		hits = hits[pages[params.Page-1]:]
	} else {
		hits = hits[pages[params.Page-1]:pages[params.Page]]
	}

	return &SearchResultBaende{
		Hits:          hits,
		Entries:       entriesmap,
		EntriesSeries: relationsmap,
		SeriesEntries: invrelationsmap,
		EntriesAgents: relationsagentsmap,
		Pages:         pages,
	}, nil

}

func (r SearchResultBaende) PagesCount() int {
	return len(r.Pages) - 1
}

func (r SearchResultBaende) Count() int {
	return len(r.Entries)
}

func (r SearchResultBaende) SeriesCount() int {
	return len(r.SeriesEntries)
}

func Agents_Entries_IDs(app core.App, ids []any) ([]*dbmodels.Agent, []*dbmodels.REntriesAgents, error) {
	relations, err := dbmodels.REntriesAgents_Entries(app, ids)
	if err != nil {
		return nil, nil, err
	}

	agentids := []any{}
	for _, r := range relations {
		agentids = append(agentids, r.Agent())
	}

	agents, err := dbmodels.Agents_IDs(app, agentids)
	if err != nil {
		return nil, nil, err
	}

	return agents, relations, nil
}
