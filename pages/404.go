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

const URL_ERROR_404 = "/errors/404/"

func init() {
	rp := &Error404Page{
		Page: pagemodels.Page{
			Name: URL_ERROR_404,
		},
	}
	app.Register(rp)
}

type Error404Page struct {
	pagemodels.Page
}

func (p *Error404Page) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_ERROR_404, func(e *core.RequestEvent) error {
		return Error404(e, engine, nil)
	})
	return nil
}

func Error404(e *core.RequestEvent, engine *templating.Engine, err error) error {
	data := make(map[string]interface{})
	var sb strings.Builder
	if err != nil {
		e.App.Logger().Error("404 error fetching URL!", "error", err, "request", e.Request.URL)
		data["Error"] = err.Error()
	}
	err = engine.Render(&sb, URL_ERROR_404, data, "default")
	if err != nil {
		return e.String(http.StatusInternalServerError, err.Error())
	}
	return e.HTML(http.StatusNotFound, sb.String())
}
