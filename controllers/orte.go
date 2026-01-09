package controllers

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ORTE      = "/orte/"
	TEMPLATE_ORTE = "/orte/"
)

func init() {
	op := &OrtePage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ORTE_NAME,
			URL:      URL_ORTE,
			Template: TEMPLATE_ORTE,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
		},
	}
	app.Register(op)
}

type OrtePage struct {
	pagemodels.StaticPage
}

type OrteResult struct {
	Places []*dbmodels.Place
}

func (p *OrtePage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_ORTE, func(e *core.RequestEvent) error {
		places := []*dbmodels.Place{}
		if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
			return engine.Response500(e, err, nil)
		}
		if len(places) > 0 {
			dbmodels.Sort_Places_Name(places)
		}

		// Get place IDs for counting
		ids := []any{}
		for _, p := range places {
			ids = append(ids, p.Id)
		}

		// Count linked Bände for each place
		bcount := map[string]int{}
		if len(ids) > 0 {
			count, err := dbmodels.CountPlacesBaende(app, ids)
			if err != nil {
				app.Logger().Error("Error counting places", "error", err)
			} else {
				bcount = count
				app.Logger().Info("Place counts", "bcount", bcount, "total_places", len(ids))
			}
		}

		data := map[string]any{
			"result": &OrteResult{Places: places},
			"bcount": bcount,
		}
		return engine.Response200(e, p.Template, data, p.Layout)
	})
	return nil
}
