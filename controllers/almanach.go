package controllers

import (
	"sort"
	"strings"

	musapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

// getSortedEntries returns cached sorted entries or loads and caches them
func getSortedEntries(pbApp core.App) ([]*dbmodels.Entry, error) {
	return musapp.GetSortedEntries(pbApp)
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
	musapp.Register(rp)
}

type AlmanachPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET(p.URL, p.GET(engine, app))
	router.GET(URL_ALMANACH_CONTENTS, p.GETContents(engine, app))
	return nil
}

func (p *AlmanachPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		filters := NewBeitraegeFilterParameters(e)
		result, err := NewAlmanachEntryResult(app, id)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["filters"] = filters

		return engine.Response200(e, p.Template, data)
	}
}

func (p *AlmanachPage) GETContents(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		filters := NewBeitraegeFilterParameters(e)
		result, err := NewAlmanachContentsResult(app, id, filters)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["filters"] = filters

		return engine.Response200(e, TEMPLATE_ALMANACH_CONTENTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

type AlmanachResult struct {
	Entry                          *dbmodels.Entry
	SeriesRelations                []*dbmodels.REntriesSeries
	Contents                       []*dbmodels.Content
	Items                          []*dbmodels.Item
	EntriesSeries                  map[string]*dbmodels.REntriesSeries // <- Key is series id
	EntriesAgents                  []*dbmodels.REntriesAgents
	ContentsAgents                 map[string][]*dbmodels.RContentsAgents // <- Key is content id
	ContentAgentDisplays           map[string][]*ContentAgentDisplay      // <- Key is content id
	ActiveContentNumberReservation *dbmodels.ContentNumberReservation

	Types       []string
	HasScans    bool
	HasContents bool

	PrevByTitle *dbmodels.Entry
	NextByTitle *dbmodels.Entry
}

type ContentAgentDisplay struct {
	ID        string
	Name      string
	LifeDates string
}

func buildContentAgentDisplays(contents []*dbmodels.Content, contentAgents map[string][]*dbmodels.RContentsAgents, displayApp *musapp.App) map[string][]*ContentAgentDisplay {
	displaysByContent := make(map[string][]*ContentAgentDisplay, len(contents))
	if displayApp == nil {
		return displaysByContent
	}

	collator := collate.New(language.German)
	for _, content := range contents {
		if content == nil {
			continue
		}

		rels := contentAgents[content.Id]
		displays := make([]*ContentAgentDisplay, 0, len(rels))
		seen := make(map[string]struct{}, len(rels))
		for _, rel := range rels {
			if rel == nil || rel.Agent() == "" {
				continue
			}

			display := displayApp.GetAgentDisplay(rel.Agent())
			if display == nil {
				continue
			}

			name := strings.TrimSpace(display.Name)
			if name == "" {
				continue
			}

			displayID := strings.TrimSpace(display.ID)
			if displayID == "" {
				displayID = rel.Agent()
			}
			if _, ok := seen[displayID]; ok {
				continue
			}
			seen[displayID] = struct{}{}

			displays = append(displays, &ContentAgentDisplay{
				ID:        displayID,
				Name:      name,
				LifeDates: strings.TrimSpace(display.LifeDates),
			})
		}

		sort.Slice(displays, func(i, j int) bool {
			return collator.CompareString(displays[i].Name, displays[j].Name) < 0
		})
		displaysByContent[content.Id] = displays
	}

	return displaysByContent
}

func entryHasContents(app core.App, entryID string) (bool, error) {
	if entryID == "" {
		return false, nil
	}

	var ret []struct {
		Id string `db:"id"`
	}
	err := app.RecordQuery(dbmodels.CONTENTS_TABLE).
		Select("id").
		Where(dbx.HashExp{dbmodels.ENTRIES_TABLE: entryID}).
		Limit(1).
		All(&ret)
	if err != nil {
		return false, err
	}

	return len(ret) > 0, nil
}

func NewAlmanachEntryResult(app core.App, id string) (*AlmanachResult, error) {
	entry, err := dbmodels.Entries_MusenalmID(app, id)
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

	entriesagents, err := dbmodels.REntriesAgents_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	prevByTitle, nextByTitle, err := entryNeighborsByPreferredTitle(app, entry.Id)
	if err != nil {
		return nil, err
	}

	hasContents, err := entryHasContents(app, entry.Id)
	if err != nil {
		return nil, err
	}

	ret := &AlmanachResult{
		Entry:           entry,
		SeriesRelations: srelations,
		EntriesSeries:   srelationsMap,
		EntriesAgents:   entriesagents,
		HasContents:     hasContents,
		PrevByTitle:     prevByTitle,
		NextByTitle:     nextByTitle,
	}

	return ret, nil
}

func NewAlmanachContentsResult(app core.App, id string, params BeitraegeFilterParameters) (*AlmanachResult, error) {
	entry, err := dbmodels.Entries_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	contents, err := dbmodels.Contents_Entry(app, entry.Id)
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
	if err != nil {
		return nil, err
	}
	caMap := map[string][]*dbmodels.RContentsAgents{}
	for _, r := range contentsagents {
		caMap[r.Content()] = append(caMap[r.Content()], r)
	}

	ret := &AlmanachResult{
		Entry:          entry,
		Contents:       contents,
		ContentsAgents: caMap,
		Types:          types,
		HasScans:       hs,
		HasContents:    len(contents) > 0,
	}

	return ret, nil
}

func NewAlmanachResult(app core.App, id string, params BeitraegeFilterParameters) (*AlmanachResult, error) {
	// INFO: what about sql.ErrNoRows?
	// We don't get sql.ErrNoRows here, since dbx converts every empty slice or
	// empty id to a WHERE 0=1 query, which will not error.
	entry, err := dbmodels.Entries_MusenalmID(app, id)
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

	contents, err := dbmodels.Contents_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}
	hasContents := len(contents) > 0

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
	if err != nil {
		return nil, err
	}
	caMap := map[string][]*dbmodels.RContentsAgents{}
	for _, r := range contentsagents {
		caMap[r.Content()] = append(caMap[r.Content()], r)
	}

	entriesagents, err := dbmodels.REntriesAgents_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	prevByTitle, nextByTitle, err := entryNeighborsByPreferredTitle(app, entry.Id)
	if err != nil {
		return nil, err
	}

	ret := &AlmanachResult{
		Entry:           entry,
		SeriesRelations: srelations,
		Contents:        contents,
		Items:           items,
		EntriesSeries:   srelationsMap,
		EntriesAgents:   entriesagents,
		ContentsAgents:  caMap,
		Types:           types,
		HasScans:        hs,
		HasContents:     hasContents,
		PrevByTitle:     prevByTitle,
		NextByTitle:     nextByTitle,
	}

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

func Types_Contents(contents []*dbmodels.Content) []string {
	types := map[string]bool{}
	for _, c := range contents {
		for _, t := range c.MusenalmType() {
			types[t] = true
		}
	}

	ret := make([]string, 0, len(types))
	for t := range types {
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
