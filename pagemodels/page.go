package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type IPage interface {
	Up(app core.App) error
	Down(app core.App) error
	// TODO: pass the cache here
	Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error
}

type Page struct {
	// WARNING: this is not thread safe, just set this once in setup
	Name     string
	Layout   string
	Template string
}

func (p *Page) Up(app core.App) error {
	return nil
}

func (p *Page) Down(app core.App) error {
	return nil
}

func (p *Page) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.Name, func(e *core.RequestEvent) error {
		return engine.Response200(e, p.Template, nil, p.Layout)
	})
	return nil
}
