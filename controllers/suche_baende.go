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
	EntriesSeries          map[string][]*dbmodels.REntriesSeries // <- Key: Entry ID, secondary only
	SeriesEntries          map[string][]*dbmodels.REntriesSeries // <- Key: Series ID, secondary only
	PreferredSeriesEntries map[string][]*dbmodels.Entry           // <- Key: Series ID, preferred entries
	EntriesAgents          map[string][]*dbmodels.REntriesAgents  // <- Key: Entry ID

	Pages []int
}

func EmptyResultBaende() *SearchResultBaende {
	return &SearchResultBaende{
		Hits:                   []string{},
		Entries:                make(map[string]*dbmodels.Entry),
		EntriesSeries:          make(map[string][]*dbmodels.REntriesSeries),
		SeriesEntries:          make(map[string][]*dbmodels.REntriesSeries),
		PreferredSeriesEntries: make(map[string][]*dbmodels.Entry),
		EntriesAgents:          make(map[string][]*dbmodels.REntriesAgents),
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

	entries = filterPublicEntries(entries)
	entries = filterEntriesByPublicPreferredSeries(coreApp, entries)

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
	relationsagentsmap = filterEntriesAgentMap(coreApp, relationsagentsmap)

	preferredSeriesMap := make(map[string][]*dbmodels.Entry)
	for _, entry := range entries {
		if sid := entry.Series(); sid != "" {
			preferredSeriesMap[sid] = append(preferredSeriesMap[sid], entry)
		}
	}

	hits := []string{}
	var pages []int
	if params.Sort == "series" {
		seenSeriesHits := map[string]struct{}{}
		for seriesID := range invrelationsmap {
			seenSeriesHits[seriesID] = struct{}{}
		}
		for seriesID := range preferredSeriesMap {
			seenSeriesHits[seriesID] = struct{}{}
		}
		for sid := range seenSeriesHits {
			hits = append(hits, sid)
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
		seriesCountMap := make(map[string]int, len(seenSeriesHits))
		for sid := range seenSeriesHits {
			seriesCountMap[sid] = len(invrelationsmap[sid]) + len(preferredSeriesMap[sid])
		}
		pages = PagesMapCounts(hits, seriesCountMap, DEFAULT_PAGESIZE_BAENDE)
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
		Hits:                   hits,
		Entries:                entriesmap,
		EntriesSeries:          relationsmap,
		SeriesEntries:          invrelationsmap,
		PreferredSeriesEntries: preferredSeriesMap,
		EntriesAgents:          relationsagentsmap,
		Pages:                  pages,
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

func filterEntriesAgentMap(app core.App, m map[string][]*dbmodels.REntriesAgents) map[string][]*dbmodels.REntriesAgents {
	ids := []any{}
	seen := map[string]struct{}{}
	for _, rels := range m {
		for _, r := range rels {
			if _, ok := seen[r.Agent()]; !ok {
				seen[r.Agent()] = struct{}{}
				ids = append(ids, r.Agent())
			}
		}
	}
	publicIDs, err := dbmodels.PublicAgentIDSet(app, ids)
	if err != nil {
		return m
	}
	for eid, rels := range m {
		filtered := rels[:0]
		for _, r := range rels {
			if _, ok := publicIDs[r.Agent()]; ok {
				filtered = append(filtered, r)
			}
		}
		m[eid] = filtered
	}
	return m
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
