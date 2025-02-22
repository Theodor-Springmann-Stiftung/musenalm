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
		DefaultPage: pagemodels.DefaultPage[*pagemodels.IndexTexte]{
			Name: pagemodels.P_INDEX_NAME,
		},
	}
	app.Register(ip)
}

type IndexPage struct {
	pagemodels.DefaultPage[*pagemodels.IndexTexte]
}

// TODO:
func (p *IndexPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET("/{$}", func(e *core.RequestEvent) error {
		var builder strings.Builder
		err := engine.Render(&builder, "/", nil, "blank")
		if err != nil {
			return err
		}
		return e.HTML(http.StatusOK, builder.String())
	})
	return nil
}
