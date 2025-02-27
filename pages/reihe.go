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
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHEN_NAME,
			URL:      URL_REIHE,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
			Template: TEMPLATE_REIHE,
		},
	}
	app.Register(rp)
}

type ReihePage struct {
	pagemodels.StaticPage
}

// TODO: data richtig seutzen, damit die Reihe mit dem template _reihe angezeigt wird
func (p *ReihePage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_REIHE, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]interface{})
		reihe, err := dbmodels.Series_MusenalmID(app, id)
		if err != nil || reihe == nil || reihe.Id == "" {
			return engine.Response404(e, err, data)
		}
		data["series"] = reihe

		entries, relations, err := Entries_Series_IDs(app, []any{reihe.Id})
		if err != nil {
			return engine.Response404(e, err, data)
		}

		emap := make(map[string]*dbmodels.Entry)
		for _, entry := range entries {
			emap[entry.Id] = entry
		}

		rmap := make(map[string][]*dbmodels.REntriesSeries)
		for _, relation := range relations {
			rmap[relation.Series()] = append(rmap[relation.Series()], relation)
		}

		data["relations"] = rmap[reihe.Id]
		data["entries"] = emap

		return p.Get(e, engine, data)

	})
	return nil
}

func (p *ReihePage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	return engine.Response200(request, TEMPLATE_REIHE, data)
}
