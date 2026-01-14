package controllers

import (
	"sort"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ALMANACH      = "/almanach/{id}/"
	TEMPLATE_ALMANACH = "/almanach/"
)

// Simple in-memory cache for sorted entries
var (
	sortedEntriesCache struct {
		sync.RWMutex
		entries []*dbmodels.Entry
	}
)

// InvalidateSortedEntriesCache clears the cached sorted entries list
func InvalidateSortedEntriesCache() {
	sortedEntriesCache.Lock()
	defer sortedEntriesCache.Unlock()
	sortedEntriesCache.entries = nil
}

// getSortedEntries returns cached sorted entries or loads and caches them
func getSortedEntries(app core.App) ([]*dbmodels.Entry, error) {
	// Try to read from cache first
	sortedEntriesCache.RLock()
	if sortedEntriesCache.entries != nil {
		cached := sortedEntriesCache.entries
		sortedEntriesCache.RUnlock()
		return cached, nil
	}
	sortedEntriesCache.RUnlock()

	// Cache miss - load and sort
	sortedEntriesCache.Lock()
	defer sortedEntriesCache.Unlock()

	// Double-check after acquiring write lock
	if sortedEntriesCache.entries != nil {
		return sortedEntriesCache.entries, nil
	}

	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return nil, err
	}

	dbmodels.Sort_Entries_Title_Year(entries)
	sortedEntriesCache.entries = entries

	return entries, nil
}

func init() {
	rp := &AlmanachPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHEN_NAME,
			URL:      URL_ALMANACH,
			Template: TEMPLATE_ALMANACH,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
		},
	}
	app.Register(rp)
}

type AlmanachPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET(p.URL, p.GET(engine, app))
	return nil
}

func (p *AlmanachPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		filters := NewBeitraegeFilterParameters(e)
		result, err := NewAlmanachResult(app, id, filters)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["filters"] = filters

		return engine.Response200(e, p.Template, data)
	}
}

type AlmanachResult struct {
	Entry          *dbmodels.Entry
	Places         []*dbmodels.Place
	Series         []*dbmodels.Series
	Contents       []*dbmodels.Content
	Items          []*dbmodels.Item
	Agents         map[string]*dbmodels.Agent          // <- Key is agent id
	EntriesSeries  map[string]*dbmodels.REntriesSeries // <- Key is series id
	EntriesAgents  []*dbmodels.REntriesAgents
	ContentsAgents map[string][]*dbmodels.RContentsAgents // <- Key is content id

	Types    []string
	HasScans bool

	PrevByTitle *dbmodels.Entry
	NextByTitle *dbmodels.Entry
}

func NewAlmanachResult(app core.App, id string, params BeitraegeFilterParameters) (*AlmanachResult, error) {
	// INFO: what about sql.ErrNoRows?
	// We don't get sql.ErrNoRows here, since dbx converts every empty slice or
	// empty id to a WHERE 0=1 query, which will not error.
	entry, err := dbmodels.Entries_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	places, err := dbmodels.Places_IDs(app, datatypes.ToAny(entry.Places()))
	if err != nil {
		return nil, err
	}

	srelations, err := dbmodels.REntriesSeries_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	srelationsMap := map[string]*dbmodels.REntriesSeries{}
	for _, r := range srelations {
		sids = append(sids, r.Series())
		srelationsMap[r.Series()] = r
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, err
	}

	contents, err := dbmodels.Contents_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	items, err := dbmodels.Items_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	types := Types_Contents(contents)

	hs := HasScans(contents)

	if params.OnlyScans {
		cscans := []*dbmodels.Content{}
		for _, c := range contents {
			if len(c.Scans()) > 0 {
				cscans = append(cscans, c)
			}
		}
		contents = cscans
	}

	if params.Type != "" {
		cfiltered := []*dbmodels.Content{}
	outer:
		for _, c := range contents {
			for _, t := range c.MusenalmType() {
				if t == params.Type {
					cfiltered = append(cfiltered, c)
					continue outer
				}
			}
		}
		contents = cfiltered
	}

	dbmodels.Sort_Contents_Numbering(contents)

	contentsagents, err := dbmodels.RContentsAgents_Contents(app, dbmodels.Ids(contents))
	caids := []any{}
	caMap := map[string][]*dbmodels.RContentsAgents{}
	for _, r := range contentsagents {
		caids = append(caids, r.Agent())
		caMap[r.Content()] = append(caMap[r.Content()], r)
	}

	entriesagents, err := dbmodels.REntriesAgents_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	for _, r := range entriesagents {
		caids = append(caids, r.Agent())
	}

	agents, err := dbmodels.Agents_IDs(app, caids)
	if err != nil {
		return nil, err
	}

	agentsMap := map[string]*dbmodels.Agent{}
	for _, a := range agents {
		agentsMap[a.Id] = a
	}

	prevByTitle, nextByTitle, err := entryNeighborsByPreferredTitle(app, entry.Id)
	if err != nil {
		return nil, err
	}

	ret := &AlmanachResult{
		Entry:          entry,
		Places:         places,
		Series:         series,
		Contents:       contents,
		Items:          items,
		Agents:         agentsMap,
		EntriesSeries:  srelationsMap,
		EntriesAgents:  entriesagents,
		ContentsAgents: caMap,
		Types:          types,
		HasScans:       hs,
		PrevByTitle:    prevByTitle,
		NextByTitle:    nextByTitle,
	}

	ret.Collections()
	return ret, nil

}

func entryNeighborsByPreferredTitle(app core.App, entryID string) (*dbmodels.Entry, *dbmodels.Entry, error) {
	entries, err := getSortedEntries(app)
	if err != nil {
		return nil, nil, err
	}
	if len(entries) == 0 {
		return nil, nil, nil
	}

	for index, item := range entries {
		if item.Id != entryID {
			continue
		}
		var prev *dbmodels.Entry
		var next *dbmodels.Entry
		if index > 0 {
			prev = entries[index-1]
		}
		if index+1 < len(entries) {
			next = entries[index+1]
		}
		return prev, next, nil
	}
	return nil, nil, nil
}

func (r *AlmanachResult) Collections() {
	ids := []int{}
	collections := []*dbmodels.Content{}
	for _, s := range r.Contents {
		ids = append(ids, s.MusenalmID())
		for _, t := range s.MusenalmType() {
			if t == "Sammlung" {
				collections = append(collections, s)
			}
		}
	}
}

func Types_Contents(contents []*dbmodels.Content) []string {
	types := map[string]bool{}
	for _, c := range contents {
		for _, t := range c.MusenalmType() {
			types[t] = true
		}
	}

	ret := make([]string, 0, len(types))
	for t, _ := range types {
		ret = append(ret, t)
	}

	sort.Strings(ret)

	return ret
}

func HasScans(contents []*dbmodels.Content) bool {
	for _, c := range contents {
		if len(c.Scans()) > 0 {
			return true
		}
	}
	return false
}

func updateEntryFTS5(app core.App, entry *dbmodels.Entry) error {
	// Always update contents for backward compatibility
	return updateEntryFTS5WithContents(app, entry, true)
}

func updateEntryFTS5WithContents(app core.App, entry *dbmodels.Entry, updateContents bool) error {
	if entry == nil {
		return nil
	}

	// Load related data for FTS5
	places := []*dbmodels.Place{}
	for _, placeID := range entry.Places() {
		place, err := dbmodels.Places_ID(app, placeID)
		if err == nil && place != nil {
			places = append(places, place)
		}
	}

	agents := []*dbmodels.Agent{}
	agentRelations, err := dbmodels.REntriesAgents_Entry(app, entry.Id)
	if err == nil {
		for _, relation := range agentRelations {
			agent, err := dbmodels.Agents_ID(app, relation.Agent())
			if err == nil && agent != nil {
				agents = append(agents, agent)
			}
		}
	}

	series := []*dbmodels.Series{}
	seriesRelations, err := dbmodels.REntriesSeries_Entry(app, entry.Id)
	if err == nil {
		for _, relation := range seriesRelations {
			s, err := dbmodels.Series_ID(app, relation.Series())
			if err == nil && s != nil {
				series = append(series, s)
			}
		}
	}

	// Update entry and conditionally update related contents
	if updateContents {
		return dbmodels.UpdateFTS5EntryAndRelatedContents(app, entry, places, agents, series)
	}
	return dbmodels.UpdateFTS5Entry(app, entry, places, agents, series)
}
