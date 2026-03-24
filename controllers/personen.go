package controllers

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

// INFO: V0 of these
const (
	PARAM_FILTER = "filter"
)

func init() {
	rp := &PersonenPage{
		StaticPage: pagemodels.StaticPage{
			Name: pagemodels.P_REIHEN_NAME,
		},
	}
	app.Register(rp)
}

type PersonenPage struct {
	pagemodels.StaticPage
}

func (p *PersonenPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET(URL_PERSONEN, func(e *core.RequestEvent) error {
		if e.Request.URL.Query().Get(PARAM_SEARCH) != "" {
			return p.SearchRequest(app, engine, e)
		}

		return p.FilterRequest(app, engine, e)
	})

	return nil
}

func (p *PersonenPage) CommonData(app core.App, data map[string]interface{}) error {

	return nil
}

func (p *PersonenPage) FilterRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	filter := e.Request.URL.Query().Get(PARAM_FILTER)
	letter := e.Request.URL.Query().Get(PARAM_LETTER)
	if letter == "" {
		letter = "A"
	}

	if filter == "" {
		filter = "noorg"
	}

	data := map[string]interface{}{}

	var err error = nil
	agents := []*dbmodels.Agent{}
	if filter == "org" {
		agents, err = dbmodels.AgentsForOrg(app, true, letter)
	}

	if filter == "noorg" {
		agents, err = dbmodels.AgentsForOrg(app, false, letter)
	}

	if filter == "musik" {
		agents, err = dbmodels.AgentsForProfession(app, "Musik", letter)
	}

	if filter == "text" {
		agents, err = dbmodels.AgentsForProfession(app, "Text", letter)
	}

	if filter == "graphik" {
		agents, err = dbmodels.AgentsForProfession(app, "Graphik", letter)
	}

	if filter == "hrsg" {
		agents, err = dbmodels.AgentsForProfession(app, "Hrsg", letter)
	}

	if err != nil {
		return engine.Response404(e, err, data)
	}
	dbmodels.Sort_Agents_Name(agents)
	data["agents"] = agents
	data["filter"] = filter
	data["letter"] = letter

	ids := []any{}
	for _, a := range agents {
		ids = append(ids, a.Id)
	}

	bcount, err := dbmodels.CountAgentsBaende(app, ids)
	if err == nil {
		data["bcount"] = bcount
	}

	count, err := dbmodels.CountAgentsContents(app, ids)
	if err == nil {
		data["ccount"] = count
	}

	letters, err := dbmodels.LettersForAgents(app, filter)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	data["letters"] = letters

	return p.Get(e, engine, data)
}

func (p *PersonenPage) SearchRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	search := e.Request.URL.Query().Get(PARAM_SEARCH)
	data := map[string]interface{}{}
	agents := []*dbmodels.Agent{}
	altagents := []*dbmodels.Agent{}

	a, err := dbmodels.FTS5SearchAgents(app, search)
	if err != nil {
		return engine.Response404(e, err, data)
	}
	agents = a

	if len(agents) == 0 {
		// INFO: Fallback to regular search, if FTS5 fails
		a, aa, err := dbmodels.BasicSearchAgents(app, search)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		agents = a
		altagents = aa
	} else {
		data["FTS"] = true
	}

	dbmodels.Sort_Agents_Name(agents)
	dbmodels.Sort_Agents_Name(altagents)

	data["search"] = search
	data["agents"] = agents
	data["altagents"] = altagents

	ids := []any{}
	for _, a := range agents {
		ids = append(ids, a.Id)
	}

	for _, a := range altagents {
		ids = append(ids, a.Id)
	}

	bcount, err := dbmodels.CountAgentsBaende(app, ids)
	if err == nil {
		data["bcount"] = bcount
	}

	count, err := dbmodels.CountAgentsContents(app, ids)
	if err == nil {
		data["ccount"] = count
	}

	return p.Get(e, engine, data)
}

func (p *PersonenPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	err := p.CommonData(request.App, data)
	if err != nil {
		return engine.Response404(request, err, data)
	}

	return engine.Response200(request, URL_PERSONEN, data)
}
