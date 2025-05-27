package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ALMANACH_EDIT      = "edit/"
	TEMPLATE_ALMANACH_EDIT = "/almanach/edit/"
)

func init() {
	ep := &AlmanachEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ALMANACH_EDIT_NAME,
			URL:      URL_ALMANACH_EDIT,
			Template: TEMPLATE_ALMANACH_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(ep)
}

type AlmanachEditPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachEditPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_ALMANACH)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ALMANACH_EDIT, p.GET(engine, app))
	return nil
}

func (p *AlmanachEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)

		return engine.Response200(e, p.Template, data)
	}
}
