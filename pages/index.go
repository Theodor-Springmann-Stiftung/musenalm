package pages

import (
	"net/http"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	ip := &IndexPage{
		Page: pagemodels.Page{
			Name: pagemodels.P_INDEX_NAME,
		},
	}
	app.Register(ip)
}

type IndexPage struct {
	pagemodels.Page
}

func (p *IndexPage) Up(app core.App) error {
	return nil
}

func (p *IndexPage) Down(app core.App) error {
	return nil
}

func (p *IndexPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET("/{$}", func(e *core.RequestEvent) error {
		var builder strings.Builder
		err := engine.Render(&builder, "/", nil)
		if err != nil {
			return err
		}
		return e.HTML(http.StatusOK, builder.String())
	})
	return nil
}
