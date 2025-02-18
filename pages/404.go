package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const URL_ERROR_404 = "/errors/404/"
const URL_ERROR_500 = "/errors/500/"

func init() {
	rp := &ErrorPage{
		Page: pagemodels.Page{
			Name: URL_ERROR_404,
		},
	}
	app.Register(rp)
}

type ErrorPage struct {
	pagemodels.Page
}

func (p *ErrorPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_ERROR_404, func(e *core.RequestEvent) error {
		return engine.Response404(e, nil, nil)
	})
	router.GET(URL_ERROR_500, func(e *core.RequestEvent) error {
		return engine.Response500(e, nil, nil)
	})
	return nil
}

func Error404(e *core.RequestEvent, engine *templating.Engine, err error, data map[string]interface{}) error {
	return engine.Response404(e, err, data)
}
