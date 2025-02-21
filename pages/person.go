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

		agent, err := dbmodels.AgentForId(app, person)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["a"] = agent

		series, relations, entries, err := dbmodels.SeriesForAgent(app, person)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		dbmodels.SortSeriessesByTitle(series)
		data["series"] = series
		data["relations"] = relations
		data["entries"] = entries

		contents, err := dbmodels.ContentsForAgent(app, person)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		agents, crelations, err := dbmodels.AgentsForContents(app, contents)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["agents"] = agents
		data["crelations"] = crelations

		centries, err := dbmodels.EntriesForContents(app, contents)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["centries"] = centries

		dbmodels.SortContentsByEntryNumbering(contents, centries)
		data["contents"] = contents

		return engine.Response200(e, p.Template, data, p.Layout)
	})

	return nil
}
