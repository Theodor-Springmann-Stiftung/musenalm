package pages

import (
	"strings"

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
		Page: pagemodels.Page{
			Name: URL_PERSON,
		},
	}
	app.Register(rp)
}

type PersonPage struct {
	pagemodels.Page
}

func (p *PersonPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_PERSON, func(e *core.RequestEvent) error {
		person := e.Request.PathValue("id")
		data := make(map[string]interface{})
		data[PARAM_PERSON] = person

		agent, err := dbmodels.AgentForId(app, person)
		if err != nil {
			return Error404(e, engine, err)
		}
		data["a"] = agent

		series, relations, entries, err := dbmodels.SeriesForAgent(app, person)
		if err != nil {
			return Error404(e, engine, err)
		}

		dbmodels.SortSeriessesByTitle(series)
		data["series"] = series
		data["relations"] = relations
		data["entries"] = entries

		contents, err := dbmodels.ContentsForAgent(app, person)
		if err != nil {
			return Error404(e, engine, err)
		}

		agents, crelations, err := dbmodels.AgentsForContents(app, contents)
		if err != nil {
			return Error404(e, engine, err)
		}
		data["agents"] = agents
		data["crelations"] = crelations

		centries, err := dbmodels.EntriesForContents(app, contents)
		if err != nil {
			return Error404(e, engine, err)
		}
		data["centries"] = centries

		dbmodels.SortContentsByEntryNumbering(contents, centries)
		data["contents"] = contents

		return p.Get(e, engine, data)
	})

	return nil
}

func (p *PersonPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	var builder strings.Builder
	err := engine.Render(&builder, TEMPLATE_PERSON, data)
	if err != nil {
		return Error404(request, engine, err)
	}

	request.Response.Header().Set("Content-Type", "text/html")
	request.Response.Write([]byte(builder.String()))
	return nil
}
