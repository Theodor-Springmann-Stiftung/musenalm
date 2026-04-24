package controllers

import (
	"database/sql"
	"fmt"
	"maps"
	"slices"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	rp := &PersonPage{
		StaticPage: pagemodels.StaticPage{
			Name:     URL_PERSON,
			Template: TEMPLATE_PERSON,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
			URL:      URL_PERSON,
		},
	}
	app.Register(rp)
}

type PersonPage struct {
	pagemodels.StaticPage
}

func (p *PersonPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	musenalmApp, ok := ia.(*app.App)
	if !ok {
		return fmt.Errorf("unexpected app implementation %T", ia)
	}
	router.GET(URL_PERSON, func(e *core.RequestEvent) error {
		person := e.Request.PathValue("id")
		data := make(map[string]interface{})
		data[PARAM_PERSON] = person

		result, err := NewAgentResult(musenalmApp, person)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["result"] = result

		return engine.Response200(e, p.Template, data, p.Layout)
	})

	return nil
}

type AgentResult struct {
	Agent *dbmodels.Agent

	BResult          []*dbmodels.Series                    // Sorted
	EntriesSeries    map[string][]*dbmodels.REntriesSeries // KEY: Series ID, secondary only
	PreferredEntries map[string][]*dbmodels.Entry          // KEY: Series ID, preferred only
	EntriesAgents    map[string][]*dbmodels.REntriesAgents // KEY: Entry ID
	EntryCount       int

	// INFO: we could save a DB query by quering the entries table only once
	CResult        []*dbmodels.Entry                      /// Sorted
	Contents       map[string][]*dbmodels.Content         // KEY: entry ID
	ContentsAgents map[string][]*dbmodels.RContentsAgents // KEY: Content ID
}

func NewAgentResult(musenalmApp *app.App, id string) (*AgentResult, error) {
	pbApp := musenalmApp.Core()
	agent, err := dbmodels.Agents_MusenalmID(pbApp, id)
	if err != nil {
		return nil, err
	}
	if agent.EditState() == "ToDo" {
		return nil, sql.ErrNoRows
	}

	res := &AgentResult{
		Agent: agent,
	}

	err = res.FilterEntriesByPerson(musenalmApp, agent.Id, res)
	if err != nil {
		return nil, err
	}

	err = res.FilterContentsByEntry(pbApp, agent.Id, res)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (p *AgentResult) FilterEntriesByPerson(musenalmApp *app.App, id string, res *AgentResult) error {
	pbApp := musenalmApp.Core()
	// 1. DB Hit
	relations, err := dbmodels.REntriesAgents_Agent(pbApp, id)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if len(relations) == 0 {
		return nil
	}

	entriesagents := make(map[string][]*dbmodels.REntriesAgents)
	entryIDs := make([]any, 0, len(relations))
	seenEntryIDs := make(map[string]struct{}, len(relations))
	for _, r := range relations {
		entriesagents[r.Entry()] = append(entriesagents[r.Entry()], r)
		if _, seen := seenEntryIDs[r.Entry()]; !seen {
			seenEntryIDs[r.Entry()] = struct{}{}
			entryIDs = append(entryIDs, r.Entry())
		}
	}
	res.EntriesAgents = entriesagents
	res.EntryCount = len(seenEntryIDs)

	// 3. DB Hit
	entriesseries, err := dbmodels.REntriesSeries_Entries(pbApp, entryIDs)
	if err != nil {
		return err
	}
	seenSIDs := map[string]struct{}{}
	seriesIds := []any{}
	entriesseriesmap := make(map[string][]*dbmodels.REntriesSeries, len(entriesseries))
	secondaryEntriesBySeries := make(map[string]map[string]struct{}, len(entriesseries))
	for _, r := range entriesseries {
		entriesseriesmap[r.Series()] = append(entriesseriesmap[r.Series()], r)
		if secondaryEntriesBySeries[r.Series()] == nil {
			secondaryEntriesBySeries[r.Series()] = map[string]struct{}{}
		}
		secondaryEntriesBySeries[r.Series()][r.Entry()] = struct{}{}
		if _, ok := seenSIDs[r.Series()]; !ok {
			seenSIDs[r.Series()] = struct{}{}
			seriesIds = append(seriesIds, r.Series())
		}
	}

	for _, r := range entriesseriesmap {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	res.EntriesSeries = entriesseriesmap

	// Also collect preferred series from entry.Series() field
	fullEntries, err := dbmodels.Entries_IDs(pbApp, entryIDs)
	if err != nil {
		return err
	}
	preferredEntries := map[string][]*dbmodels.Entry{}
	for _, entry := range fullEntries {
		if sid := entry.Series(); sid != "" {
			if _, ok := secondaryEntriesBySeries[sid][entry.Id]; !ok {
				preferredEntries[sid] = append(preferredEntries[sid], entry)
			}
			if _, ok := seenSIDs[sid]; !ok {
				seenSIDs[sid] = struct{}{}
				seriesIds = append(seriesIds, sid)
			}
		}
	}
	for _, entries := range preferredEntries {
		dbmodels.Sort_Entries_Year_Title(entries)
	}
	res.PreferredEntries = preferredEntries

	// 4. DB Hit
	series, err := dbmodels.Series_IDs(pbApp, seriesIds)
	if err != nil {
		return err
	}

	series = filterPublicSeries(series)

	publicSeriesSet := make(map[string]struct{}, len(series))
	for _, s := range series {
		publicSeriesSet[s.Id] = struct{}{}
	}

	preferredSeriesForEntry := make(map[string]string, len(fullEntries))
	for _, e := range fullEntries {
		preferredSeriesForEntry[e.Id] = e.Series()
	}

	for sid, rels := range entriesseriesmap {
		filtered := rels[:0]
		for _, rel := range rels {
			esid := preferredSeriesForEntry[rel.Entry()]
			if esid == "" {
				filtered = append(filtered, rel)
			} else if _, ok := publicSeriesSet[esid]; ok {
				filtered = append(filtered, rel)
			}
		}
		entriesseriesmap[sid] = filtered
	}

	for sid := range preferredEntries {
		if _, ok := publicSeriesSet[sid]; !ok {
			delete(preferredEntries, sid)
		}
	}

	res.BResult = series

	return nil
}

func (p *AgentResult) FilterContentsByEntry(app core.App, id string, res *AgentResult) error {
	relations, err := dbmodels.RContentsAgents_Agent(app, id)
	if err != nil {
		return err
	}

	if len(relations) == 0 {
		return nil
	}

	contentIDs := make([]any, 0, len(relations))
	seenContentIDs := make(map[string]struct{}, len(relations))
	for _, r := range relations {
		if _, seen := seenContentIDs[r.Content()]; !seen {
			seenContentIDs[r.Content()] = struct{}{}
			contentIDs = append(contentIDs, r.Content())
		}
	}

	contents, err := dbmodels.Contents_IDs(app, contentIDs)
	if err != nil {
		return err
	}
	contents = filterPublicContents(contents)

	allContentRelations, err := dbmodels.RContentsAgents_Contents(app, contentIDs)
	if err != nil {
		return err
	}
	contentsagents := make(map[string][]*dbmodels.RContentsAgents, len(allContentRelations))
	for _, relation := range allContentRelations {
		contentsagents[relation.Content()] = append(contentsagents[relation.Content()], relation)
	}
	res.ContentsAgents = contentsagents

	contentMap := make(map[string][]*dbmodels.Content, len(contents))
	entrykeys := []any{}
	seenEntryIDs := make(map[string]struct{}, len(contents))
	for _, c := range contents {
		contentMap[c.Entry()] = append(contentMap[c.Entry()], c)
		if _, seen := seenEntryIDs[c.Entry()]; !seen {
			seenEntryIDs[c.Entry()] = struct{}{}
			entrykeys = append(entrykeys, c.Entry())
		}
	}
	res.Contents = contentMap

	for _, c := range contentMap {
		dbmodels.Sort_Contents_Numbering(c)
	}

	entries, err := dbmodels.Entries_IDs(app, entrykeys)
	if err != nil {
		return err
	}
	entries = filterPublicEntries(entries)
	entries = filterEntriesByPublicPreferredSeries(app, entries)
	dbmodels.Sort_Entries_Year_Title(entries)
	res.CResult = entries

	return nil
}

func (p *AgentResult) LenEntries() int {
	return p.EntryCount
}

func (p *AgentResult) LenSeries() int {
	return len(p.BResult)
}

func (p *AgentResult) LenContents() int {
	i := 0
	for _, c := range p.Contents {
		i += len(c)
	}
	return i
}

func (p *AgentResult) Types() []string {
	types := make(map[string]bool)

	// INFO: this is just a handful of entries usuallly so we're fine
	for _, c := range p.Contents {
		for _, c := range c {
			for _, c := range c.MusenalmType() {
				types[c] = true
			}
		}
	}

	return slices.Collect(maps.Keys(types))
}
