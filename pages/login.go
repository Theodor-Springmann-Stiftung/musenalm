package pages

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/security"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_LOGIN      = "/login/"
	TEMPLATE_LOGIN = "/login/"
)

// TODO:
// - rate limiting
// - maybe csrf

func init() {
	csrf_cache, err := security.NewCSRFProtector(time.Minute*5, time.Minute)
	if err != nil {
		panic(err)
	}

	lp := &LoginPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_LOGIN_NAME,
			Layout:   "blank",
			Template: TEMPLATE_LOGIN,
			URL:      URL_LOGIN,
		},
		csrf_cache: csrf_cache,
	}
	app.Register(lp)
}

type LoginPage struct {
	pagemodels.StaticPage
	csrf_cache *security.CSRFProtector
}

func (p *LoginPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_LOGIN, p.GET(engine))
	router.POST(URL_LOGIN, p.POST(engine, app))
	return nil
}

func (p *LoginPage) GET(engine *templating.Engine) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		data["record"] = p
		nonce, token, err := p.csrf_cache.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, data)
		}
		data["csrf_nonce"] = nonce
		data["csrf_token"] = token

		// TODO: the function to delete tokens is not yet there
		// as of right now, the tokens get only deleted from the clients
		// We need to delete the tokens from the cache + table.
		e.SetCookie(&http.Cookie{
			Name:   dbmodels.SESSION_COOKIE_NAME,
			Path:   "/",
			MaxAge: -1,
		})
		e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *LoginPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		data["record"] = p

		formdata := struct {
			Username   string `json:"username" form:"username"`
			Password   string `json:"password" form:"password"`
			CsrfNonce  string `json:"csrf_nonce" form:"csrf_nonce"`
			CsrfToken  string `json:"csrf_token" form:"csrf_token"`
			Persistent string `json:"persist" form:"persist"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return engine.Response500(e, err, data)
		}

		if _, err := p.csrf_cache.ValidateTokenBundle(formdata.CsrfNonce, formdata.CsrfToken); err != nil {
			return engine.Response403(e, err, data)
		}

		if formdata.Username == "" || formdata.Password == "" {
			return engine.Response403(e, fmt.Errorf("Username and password are required"), data)
		}

		record, err := app.FindFirstRecordByData(dbmodels.USERS_TABLE, dbmodels.USERS_EMAIL_FIELD, formdata.Username)
		if err != nil || !record.ValidatePassword(formdata.Password) {
			return engine.Response403(e, err, data)
		}

		duration := time.Minute * 60
		if formdata.Persistent == "on" {
			duration = time.Hour * 24 * 90
		}

		token, err := dbmodels.CreateSessionToken(app, record.Id, e.RealIP(), e.Request.UserAgent(), formdata.Persistent == "on", duration)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		if formdata.Persistent == "on" {
			e.SetCookie(&http.Cookie{
				Name:     dbmodels.SESSION_COOKIE_NAME,
				Path:     "/",
				MaxAge:   int(duration.Seconds()),
				Value:    token.Token(),
				SameSite: http.SameSiteLaxMode,
				HttpOnly: true,
				Secure:   true,
			})
		} else {
			e.SetCookie(&http.Cookie{
				Name:     dbmodels.SESSION_COOKIE_NAME,
				Path:     "/",
				Value:    token.Token(),
				SameSite: http.SameSiteLaxMode,
				HttpOnly: true,
				Secure:   true,
			})
		}

		redirect := "/reihen"
		if r := e.Request.URL.Query().Get("redirectTo"); r != "" {
			redirect = r
		}
		return e.Redirect(303, redirect)
	}
}
