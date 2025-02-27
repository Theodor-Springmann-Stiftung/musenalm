package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_BEITRAG      = "/beitrag/{id}"
	TEMPLATE_BEITRAG = "/beitrag/"
)

func init() {
	rp := &BeitragPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_BEITRAG_NAME,
			URL:      URL_BEITRAG,
			Template: TEMPLATE_BEITRAG,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
		},
	}
	app.Register(rp)
}

type BeitragPage struct {
	pagemodels.StaticPage
}

func (p *BeitragPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.URL, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]interface{})
		result, err := NewBeitragResult(app, id)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result

		abbrs, err := pagemodels.GetAbks(app)
		if err == nil {
			data["abbrs"] = abbrs
		}

		return engine.Response200(e, p.Template, data)
	})

	return nil
}

type BeitragResult struct {
	Entry          *dbmodels.Entry
	Places         []*dbmodels.Place
	Series         []*dbmodels.Series
	Content        *dbmodels.Content
	Agents         map[string]*dbmodels.Agent          // <- Key is agent id
	EntriesSeries  map[string]*dbmodels.REntriesSeries // <- Key is series id
	EntriesAgents  []*dbmodels.REntriesAgents
	ContentsAgents []*dbmodels.RContentsAgents // <- Key is content id
}

func NewBeitragResult(app core.App, id string) (*BeitragResult, error) {
	content, err := dbmodels.Contents_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	entry, err := dbmodels.Entries_ID(app, content.Entry())
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
	srelationsMap := make(map[string]*dbmodels.REntriesSeries)
	for _, s := range srelations {
		sids = append(sids, s.Series())
		srelationsMap[s.Series()] = s
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, err
	}

	arelations, err := dbmodels.REntriesAgents_Entry(app, entry.Id)
	if err != nil {
		return nil, err
	}

	acrelations, err := dbmodels.RContentsAgents_Content(app, content.Id)
	if err != nil {
		return nil, err
	}

	aids := []any{}
	arelationsMap := make(map[string]*dbmodels.REntriesAgents)
	for _, r := range arelations {
		aids = append(aids, r.Agent())
		arelationsMap[r.Agent()] = r
	}

	for _, r := range acrelations {
		aids = append(aids, r.Agent())
	}

	agents, err := dbmodels.Agents_IDs(app, aids)
	if err != nil {
		return nil, err
	}

	agentsMap := make(map[string]*dbmodels.Agent)
	for _, a := range agents {
		agentsMap[a.Id] = a
	}

	return &BeitragResult{
		Entry:          entry,
		Places:         places,
		Series:         series,
		Content:        content,
		Agents:         agentsMap,
		EntriesSeries:  srelationsMap,
		EntriesAgents:  arelations,
		ContentsAgents: acrelations,
	}, nil
}
