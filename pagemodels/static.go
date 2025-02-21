package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type StaticPage struct {
	Name     string
	Template string
	Layout   string
	URL      string
}

func (p *StaticPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.URL, func(e *core.RequestEvent) error {
		data := map[string]interface{}{}
		data["record"] = p
		return engine.Response200(e, p.Template, data, p.Layout)
	})
	return nil
}

func (p *StaticPage) Up(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *StaticPage) Down(app core.App, engine *templating.Engine) error {
	return nil
}
