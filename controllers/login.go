package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/security"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

var CSRF_CACHE *security.CSRFProtector

// TODO:
// - rate limiting

func init() {
	csrf_cache, err := security.NewCSRFProtector(time.Minute*10, time.Minute)
	if err != nil {
		panic(err)
	}
	CSRF_CACHE = csrf_cache

	lp := &LoginPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_LOGIN_NAME,
			Layout:   pagemodels.LAYOUT_BLANK_PAGE,
			Template: TEMPLATE_LOGIN,
			URL:      URL_LOGIN,
		},
	}
	app.Register(lp)
}

type LoginPage struct {
	pagemodels.StaticPage
}

func (p *LoginPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET(URL_LOGIN, p.GET(engine, app))
	r := router.POST(URL_LOGIN, p.POST(engine, app))
	r.BindFunc(middleware.RateLimiter(30, time.Minute*2, time.Hour*6))
	return nil
}

func (p *LoginPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		data["record"] = p
		nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, data)
		}
		data["csrf_nonce"] = nonce
		data["csrf_token"] = token

		Logout(e, &app)

		SetRedirect(data, e)

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func Unauthorized(
	engine *templating.Engine,
	e *core.RequestEvent,
	error error,
	data map[string]any) error {

	nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
	if err != nil {
		return engine.Response500(e, err, data)
	}

	data["csrf_nonce"] = nonce
	data["csrf_token"] = token
	data["error"] = error.Error()

	SetRedirect(data, e)

	htm, err := engine.RenderToString(e, data, TEMPLATE_LOGIN, pagemodels.LAYOUT_BLANK_PAGE)
	if err != nil {
		return engine.Response500(e, err, data)
	}

	return e.HTML(http.StatusUnauthorized, htm)
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

		data["formdata"] = formdata

		if _, err := CSRF_CACHE.ValidateTokenBundle(formdata.CsrfNonce, formdata.CsrfToken); err != nil {
			return Unauthorized(engine, e, fmt.Errorf("ungültiges CSRF-token oder zeit abgelaufen, bitte versuchen sie es erneut"), data)
		}

		if formdata.Username == "" || formdata.Password == "" {
			return Unauthorized(engine, e, fmt.Errorf("benutzername oder passwort falsch, bitte versuchen sie es erneut"), data)
		}

		user, userErr := dbmodels.Users_Email(app, formdata.Username)
		userAuthenticated := userErr == nil && user.ValidatePassword(formdata.Password)

		superuser, superuserErr := app.FindAuthRecordByEmail(core.CollectionNameSuperusers, formdata.Username)
		superuserAuthenticated := superuserErr == nil && superuser.ValidatePassword(formdata.Password)

		sessionUserID := ""
		sessionSuperuserID := ""

		switch {
		case userAuthenticated && !user.Deactivated():
			sessionUserID = user.Id
		case superuserAuthenticated:
			sessionSuperuserID = superuser.Id
		case userAuthenticated && user.Deactivated():
			return Unauthorized(engine, e, fmt.Errorf("ihr benutzerkonto ist deaktiviert, bitte kontaktieren sie den administrator"), data)
		default:
			return Unauthorized(engine, e, fmt.Errorf("benutzername oder passwort falsch, bitte versuchen sie es erneut"), data)
		}

		duration := time.Hour * 2
		if formdata.Persistent == "on" {
			duration = time.Hour * 24 * 90
		}

		token, err := dbmodels.CreateSessionToken(
			app,
			sessionUserID,
			sessionSuperuserID,
			e.RealIP(),
			e.Request.UserAgent(),
			formdata.Persistent == "on",
			duration,
		)
		if err != nil || token == nil || token.SessionTokenClear == "" {
			return engine.Response500(e, err, data)
		}

		if formdata.Persistent == "on" {
			e.SetCookie(&http.Cookie{
				Name:     dbmodels.SESSION_COOKIE_NAME,
				Path:     "/",
				MaxAge:   int(duration.Seconds()),
				Value:    token.SessionTokenClear,
				SameSite: http.SameSiteLaxMode,
				HttpOnly: true,
				Secure:   true,
			})
		} else {
			e.SetCookie(&http.Cookie{
				Name:     dbmodels.SESSION_COOKIE_NAME,
				Path:     "/",
				Value:    token.SessionTokenClear,
				SameSite: http.SameSiteLaxMode,
				HttpOnly: true,
				Secure:   true,
			})
		}

		SetRedirect(data, e)

		return RedirectTo(e)
	}
}
