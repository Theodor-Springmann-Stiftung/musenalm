package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_PERSONEN = "/personen/"
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

func (p *PersonenPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
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

	if filter == "autor" {
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
	dbmodels.SortAgentsByName(agents)
	data["agents"] = agents
	data["filter"] = filter
	data["letter"] = letter

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

	agents, altagents, err := dbmodels.BasicSearchAgents(app, search)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	dbmodels.SortAgentsByName(agents)
	dbmodels.SortAgentsByName(altagents)

	data["search"] = search
	data["agents"] = agents
	data["altagents"] = altagents

	return p.Get(e, engine, data)
}

func (p *PersonenPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	err := p.CommonData(request.App, data)
	if err != nil {
		return engine.Response404(request, err, data)
	}

	return engine.Response200(request, URL_PERSONEN, data)
}
