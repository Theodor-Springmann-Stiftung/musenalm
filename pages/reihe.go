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
	URL_REIHE      = "/reihe/{id}/"
	TEMPLATE_REIHE = "/reihe/"
)

func init() {
	rp := &ReihePage{
		Page: pagemodels.Page{
			Name: pagemodels.P_REIHEN_NAME,
		},
	}
	app.Register(rp)
}

type ReihePage struct {
	pagemodels.Page
}

// TODO: data richtig seutzen, damit die Reihe mit dem template _reihe angezeigt wird
func (p *ReihePage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_REIHE, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]interface{})
		reihe, err := dbmodels.SeriesForId(app, id)
		if err != nil {
			return Error404(e, engine, err, data)
		}
		data["series"] = reihe

		rmap, emap, err := dbmodels.EntriesForSeriesses(app, []*dbmodels.Series{reihe})
		if err != nil {
			return Error404(e, engine, err, data)
		}

		data["relations"] = rmap
		data["entries"] = emap

		return p.Get(e, engine, data)

	})
	return nil
}

func (p *ReihePage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	return engine.Response200(request, TEMPLATE_REIHE, data)
}
