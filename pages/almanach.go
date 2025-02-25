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
	URL_ALMANACH      = "/almanach/{id}"
	TEMPLATE_ALMANACH = "/almanach/"
)

func init() {
	rp := &AlmanachPage{
		StaticPage: pagemodels.StaticPage{
			Name: pagemodels.P_REIHEN_NAME,
		},
	}
	app.Register(rp)
}

type AlmanachPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_ALMANACH, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]interface{})
		result, err := NewAlmanachResult(app, id)
		if err != nil {
			engine.Response404(e, err, nil)
		}

		data["result"] = result
		err = p.getAbbr(app, data)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		return p.Get(e, engine, data)
	})

	return nil
}

func (p *AlmanachPage) getAbbr(app core.App, data map[string]interface{}) error {
	abbrs, err := pagemodels.GetAbks(app)
	if err != nil {
		return err
	}

	data["abbrs"] = abbrs
	return nil
}

func (p *AlmanachPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	return engine.Response200(request, TEMPLATE_ALMANACH, data)
}

type AlmanachResult struct {
	Entry          *dbmodels.Entry
	Places         []*dbmodels.Place
	Series         []*dbmodels.Series
	Contents       []*dbmodels.Content
	Agents         map[string]*dbmodels.Agent          // <- Key is agent id
	EntriesSeries  map[string]*dbmodels.REntriesSeries // <- Key is series id
	EntriesAgents  []*dbmodels.REntriesAgents
	ContentsAgents map[string][]*dbmodels.RContentsAgents // <- Key is content id
}

func NewAlmanachResult(app core.App, id string) (*AlmanachResult, error) {
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

	return &AlmanachResult{
		Entry:          entry,
		Places:         places,
		Series:         series,
		Contents:       contents,
		Agents:         agentsMap,
		EntriesSeries:  srelationsMap,
		EntriesAgents:  entriesagents,
		ContentsAgents: caMap,
	}, nil

}
