package pages

import (
	"net/http"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	lp := &LogoutPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_LOGOUT_NAME,
			Layout:   "blank",
			Template: "/logout/",
			URL:      "/logout/",
		},
	}
	app.Register(lp)
}

type LogoutPage struct {
	pagemodels.StaticPage
}

func (p *LogoutPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.URL, p.GET())
	return nil
}

func (p *LogoutPage) GET() HandleFunc {
	return func(e *core.RequestEvent) error {
		// TODO: the function to delete tokens is not yet there
		// as of right now, the tokens get only deleted from the clients
		// We need to delete the tokens from the cache + table.
		e.SetCookie(&http.Cookie{
			Name:   dbmodels.SESSION_COOKIE_NAME,
			Path:   "/",
			MaxAge: -1,
		})
		e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
		redirect := "/reihen"
		if r := e.Request.URL.Query().Get("redirectTo"); r != "" {
			redirect = r
		}
		return e.Redirect(303, redirect)
	}
}
