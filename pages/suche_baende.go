package pages

import (
	"database/sql"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

const (
	DEFAULT_PAGESIZE_BAENDE = 40
)

type BaendeFilterParameters struct {
	Agent string
	Year  string
	Place string
	State string
}

func NewBaendeFilterParameters(ev *core.RequestEvent) BaendeFilterParameters {
	agent := ev.Request.URL.Query().Get("agent")
	year := ev.Request.URL.Query().Get("year")
	place := ev.Request.URL.Query().Get("place")
	state := ev.Request.URL.Query().Get("state")
	return BaendeFilterParameters{
		Agent: agent,
		Year:  year,
		Place: place,
		State: state,
	}
}

type SearchResultBaende struct {
	Queries []dbmodels.FTS5QueryRequest

	// these are the sorted IDs for hits
	Hits    []string
	Series  map[string]*dbmodels.Series // <- Key: Series ID
	Entries map[string]*dbmodels.Entry  // <- Key: Entry ID
	Places  map[string]*dbmodels.Place  // <- All places, Key: Place IDs
	Agents  map[string]*dbmodels.Agent  // <- Key: Agent IDs

	// INFO: this is as they say doppelt gemoppelt bc of a logic error i made while tired
	EntriesSeries map[string][]*dbmodels.REntriesSeries // <- Key: Entry ID
	SeriesEntries map[string][]*dbmodels.REntriesSeries // <- Key: Series ID
	EntriesAgents map[string][]*dbmodels.REntriesAgents // <- Key: Entry ID

	Pages []int
}

func EmptyResultBaende() *SearchResultBaende {
	return &SearchResultBaende{
		Hits:          []string{},
		Series:        make(map[string]*dbmodels.Series),
		Entries:       make(map[string]*dbmodels.Entry),
		Places:        make(map[string]*dbmodels.Place),
		Agents:        make(map[string]*dbmodels.Agent),
		EntriesSeries: make(map[string][]*dbmodels.REntriesSeries),
		SeriesEntries: make(map[string][]*dbmodels.REntriesSeries),
		EntriesAgents: make(map[string][]*dbmodels.REntriesAgents),
	}
}

func NewSearchBaende(app core.App, params SearchParameters) (*SearchResultBaende, error) {
	entries := []*dbmodels.Entry{}
	queries := params.FieldSetBaende()

	if params.AlmString != "" {
		e, err := dbmodels.Entries_MusenalmID(app, params.AlmString)
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

		ids, err := dbmodels.FTS5Search(app, dbmodels.ENTRIES_TABLE, queries...)
		if err != nil {
			return nil, err
		} else if len(ids) == 0 {
			return EmptyResultBaende(), nil
		}

		resultids := []any{}
		for _, id := range ids {
			resultids = append(resultids, id.ID)
		}

		e, err := dbmodels.Entries_IDs(app, resultids)
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

	series, relations, err := Series_Entries(app, entries)
	if err != nil {
		return nil, err
	}

	seriesmap := make(map[string]*dbmodels.Series)
	for _, s := range series {
		seriesmap[s.Id] = s
	}

	relationsmap := make(map[string][]*dbmodels.REntriesSeries)
	invrelationsmap := make(map[string][]*dbmodels.REntriesSeries)
	for _, r := range relations {
		invrelationsmap[r.Series()] = append(invrelationsmap[r.Series()], r)
		relationsmap[r.Entry()] = append(relationsmap[r.Entry()], r)
	}

	agents, arelations, err := Agents_Entries_IDs(app, resultids)
	if err != nil {
		return nil, err
	}

	agentsmap := make(map[string]*dbmodels.Agent)
	for _, a := range agents {
		agentsmap[a.Id] = a
	}

	relationsagentsmap := make(map[string][]*dbmodels.REntriesAgents)
	for _, r := range arelations {
		relationsagentsmap[r.Entry()] = append(relationsagentsmap[r.Entry()], r)
	}

	placesids := []any{}
	for _, entry := range entries {
		for _, place := range entry.Places() {
			placesids = append(placesids, place)
		}
	}

	places, err := dbmodels.Places_IDs(app, placesids)
	if err != nil {
		return nil, err
	}

	placesmap := make(map[string]*dbmodels.Place)
	for _, place := range places {
		placesmap[place.Id] = place
	}

	hits := []string{}
	pages := []int{}
	if params.Sort == "series" {
		dbmodels.Sort_Series_Title(series)
		for _, s := range series {
			hits = append(hits, s.Id)
		}
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
		Series:        seriesmap,
		Entries:       entriesmap,
		Places:        placesmap,
		Agents:        agentsmap,
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
	return len(r.Series)
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
