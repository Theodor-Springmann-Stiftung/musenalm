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
	URL_ALMANACH      = "/almanach/{id}"
	TEMPLATE_ALMANACH = "/almanach/"
)

func init() {
	rp := &AlmanachPage{
		Page: pagemodels.Page{
			Name: pagemodels.P_REIHEN_NAME,
		},
	}
	app.Register(rp)
}

type AlmanachPage struct {
	pagemodels.Page
}

func (p *AlmanachPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_ALMANACH, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]interface{})
		entry, err := dbmodels.EntryForMusenalmID(app, id)
		if err != nil {
			return Error404(e, engine, err, data)
		}
		data["entry"] = entry

		series, srelations, _, err := dbmodels.SeriesForEntries(app, []*dbmodels.Entry{entry})
		if err != nil {
			return Error404(e, engine, err, data)
		}

		s := map[string]*dbmodels.Series{}
		for _, r := range series {
			s[r.Id] = r
		}

		data["srelations"] = srelations
		data["series"] = s

		places, err := dbmodels.PlacesForEntry(app, entry)
		if err != nil {
			return Error404(e, engine, err, data)
		}
		data["places"] = places

		contents, err := dbmodels.ContentsForEntry(app, entry)
		if err != nil {
			return Error404(e, engine, err, data)
		}
		data["contents"] = contents

		agents, arelations, err := dbmodels.AgentsForEntries(app, []*dbmodels.Entry{entry})
		if err != nil {
			return Error404(e, engine, err, data)
		}
		data["arelations"] = arelations

		if len(contents) > 0 {
			cagents, crelations, err := dbmodels.AgentsForContents(app, contents)
			if err != nil {
				return Error404(e, engine, err, data)
			}
			data["crelations"] = crelations
			for k, v := range cagents {
				agents[k] = v
			}
		}
		data["agents"] = agents

		return p.Get(e, engine, data)
	})

	return nil
}

func (p *AlmanachPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	return engine.Response200(request, TEMPLATE_ALMANACH, data)
}
