package controllers

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
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
func (p *ReihePage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	musenalmApp, ok := ia.(*app.App)
	if !ok {
		return fmt.Errorf("unexpected app implementation %T", ia)
	}
	pbApp := musenalmApp.Core()
	router.GET(URL_REIHE, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]interface{})
		reihe, err := dbmodels.Series_MusenalmID(pbApp, id)
		if err != nil || reihe == nil || reihe.Id == "" {
			return engine.Response404(e, err, data)
		}
		if reihe.EditState() == "ToDo" {
			return engine.Response404(e, nil, data)
		}
		data["series"] = reihe

		relations, err := seriesRelationsBySeriesIDs(pbApp, []any{reihe.Id})
		if err != nil {
			return engine.Response404(e, err, data)
		}

		rmap := make(map[string][]*dbmodels.REntriesSeries)
		for _, relation := range relations {
			rmap[relation.Series()] = append(rmap[relation.Series()], relation)
		}
		sortSeriesRelationsByEntryYear(rmap[reihe.Id], musenalmApp)

		data["relations"] = rmap[reihe.Id]

		preferredEntries, err := dbmodels.Entries_Series(pbApp, reihe.Id)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["preferred_entries"] = preferredEntries

		return p.Get(e, engine, data)

	})
	return nil
}

func (p *ReihePage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	return engine.Response200(request, TEMPLATE_REIHE, data)
}
