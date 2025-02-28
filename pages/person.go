package pages

import (
	"database/sql"
	"maps"
	"slices"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_PERSON      = "/person/{id}"
	TEMPLATE_PERSON = "/person/"
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

func (p *PersonPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_PERSON, func(e *core.RequestEvent) error {
		person := e.Request.PathValue("id")
		data := make(map[string]interface{})
		data[PARAM_PERSON] = person

		result, err := NewAgentResult(app, person)
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

	BResult       []*dbmodels.Series                    // Sorted
	Entries       map[string]*dbmodels.Entry            // KEY: Entry ID
	EntriesSeries map[string][]*dbmodels.REntriesSeries // KEY: Series ID
	EntriesAgents map[string][]*dbmodels.REntriesAgents // KEY: Entry ID

	// INFO: we could save a DB query by quering the entries table only once
	CResult        []*dbmodels.Entry                      /// Sorted
	Contents       map[string][]*dbmodels.Content         // KEY: entry ID
	ContentsAgents map[string][]*dbmodels.RContentsAgents // KEY: Content ID
	Agents         map[string]*dbmodels.Agent             // KEY: Agent ID
}

func NewAgentResult(app core.App, id string) (*AgentResult, error) {
	agent, err := dbmodels.Agents_ID(app, id)
	if err != nil {
		return nil, err
	}

	res := &AgentResult{
		Agent: agent,
	}

	err = res.FilterEntriesByPerson(app, id, res)
	if err != nil {
		return nil, err
	}

	err = res.FilterContentsByEntry(app, id, res)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func (p *AgentResult) FilterEntriesByPerson(app core.App, id string, res *AgentResult) error {
	// 1. DB Hit
	relations, err := dbmodels.REntriesAgents_Agent(app, id)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	if len(relations) == 0 {
		return nil
	}

	entriesagents := make(map[string][]*dbmodels.REntriesAgents)
	entryIds := []any{}
	for _, r := range relations {
		entryIds = append(entryIds, r.Entry())
		entriesagents[r.Entry()] = append(entriesagents[r.Entry()], r)
	}
	res.EntriesAgents = entriesagents

	// 2. DB Hit
	entries, err := dbmodels.Entries_IDs(app, entryIds)
	if err != nil {
		return err
	}

	entryMap := make(map[string]*dbmodels.Entry, len(entries))
	for _, e := range entries {
		entryMap[e.Id] = e
	}
	res.Entries = entryMap

	// 3. DB Hit
	entriesseries, err := dbmodels.REntriesSeries_Entries(app, entryIds)
	if err != nil {
		return err
	}
	entriesseriesmap := make(map[string][]*dbmodels.REntriesSeries, len(entriesseries))
	for _, r := range entriesseries {
		entriesseriesmap[r.Series()] = append(entriesseriesmap[r.Series()], r)
	}

	for _, r := range entriesseriesmap {
		dbmodels.Sort_REntriesSeries_Year(r, entryMap)
	}

	res.EntriesSeries = entriesseriesmap

	seriesIds := []any{}
	for _, s := range entriesseries {
		seriesIds = append(seriesIds, s.Series())
	}

	// 4. DB Hit
	series, err := dbmodels.Series_IDs(app, seriesIds)
	if err != nil {
		return err
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

	contentsagents := make(map[string][]*dbmodels.RContentsAgents)
	contentIds := []any{}
	agentids := []any{}
	for _, r := range relations {
		contentIds = append(contentIds, r.Content())
		agentids = append(agentids, r.Agent())
		contentsagents[r.Content()] = append(contentsagents[r.Content()], r)
	}
	res.ContentsAgents = contentsagents

	agents, err := dbmodels.Agents_IDs(app, agentids)
	if err != nil {
		return err
	}
	aMap := make(map[string]*dbmodels.Agent, len(agents))
	for _, a := range agents {
		aMap[a.Id] = a
	}
	res.Agents = aMap

	contents, err := dbmodels.Contents_IDs(app, contentIds)
	if err != nil {
		return err
	}

	contentMap := make(map[string][]*dbmodels.Content, len(contents))
	entrykeys := []any{}
	for _, c := range contents {
		contentMap[c.Entry()] = append(contentMap[c.Entry()], c)
		entrykeys = append(entrykeys, c.Entry())
	}
	res.Contents = contentMap

	for _, c := range contentMap {
		dbmodels.Sort_Contents_Numbering(c)
	}

	entries, err := dbmodels.Entries_IDs(app, entrykeys)
	if err != nil {
		return err
	}
	dbmodels.Sort_Entries_Year_Title(entries)
	res.CResult = entries

	return nil
}

func (p *AgentResult) LenEntries() int {
	return len(p.Entries)
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
