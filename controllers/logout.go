package controllers

import (
	"net/http"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	lp := &LogoutPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_LOGOUT_NAME,
			Layout:   pagemodels.LAYOUT_BLANK_PAGE,
			Template: TEMPLATE_LOGOUT,
			URL:      URL_LOGOUT,
		},
	}
	app.Register(lp)
}

type LogoutPage struct {
	pagemodels.StaticPage
}

func (p *LogoutPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET(p.URL, p.GET(app))
	return nil
}

func (p *LogoutPage) GET(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		Logout(e, &app)
		return RedirectTo(e)
	}
}

func Logout(e *core.RequestEvent, app *core.App) {
	e.SetCookie(&http.Cookie{
		Name:   dbmodels.SESSION_COOKIE_NAME,
		Path:   "/",
		MaxAge: -1,
	})

	e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")

	cookie, err := e.Request.Cookie(dbmodels.SESSION_COOKIE_NAME)
	if err == nil && app != nil {
		go func() {
			app := *app
			session, err := dbmodels.Sessions_Token(app, cookie.Value)
			if err == nil {
				session.SetStatus(dbmodels.TOKEN_STATUS_VALUES[1])
				if err := app.Save(session); err != nil {
					app.Logger().Error("Failed to update session status.", "error", err.Error())
				}
			} else {
				app.Logger().Error("Failed to find session record.", "error", err.Error())
			}

			middleware.SESSION_CACHE.Delete(cookie.Value)
		}()
	}
}

func RedirectTo(e *core.RequestEvent) error {
	redirect := URL_ADMIN_START

	if r := e.Request.URL.Query().Get("redirectTo"); r != "" {
		redirect = r
	}
	return e.Redirect(303, redirect)
}
