package controllers

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	ucp := &UserCreatePage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_USER_CREATE_NAME,
			Layout:   pagemodels.LAYOUT_BLANK_PAGE,
			Template: TEMPLATE_USER_CREATE,
			URL:      URL_USER_CREATE,
		},
	}
	app.Register(ucp)
}

type UserCreatePage struct {
	pagemodels.StaticPage
}

func (p *UserCreatePage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_USER_CREATE)
	rg.BindFunc(middleware.HasToken())
	rg.GET("{"+PATH_VALUE_ROLE+"}", p.GET(engine, app))
	rg.POST("{"+PATH_VALUE_ROLE+"}", p.POST(engine, app))
	return nil
}

func (p *UserCreatePage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		role := e.Request.PathValue("role")
		if role != "User" && role != "Editor" && role != "Admin" {
			return engine.Response404(e, fmt.Errorf("invalid role: %s", role), nil)
		}

		// TODO: check access token
		data := make(map[string]any)
		nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, data)
		}

		data["role"] = role
		data["csrf_nonce"] = nonce
		data["csrf_token"] = token

		SetRedirect(data, e)

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func InvalidSignupResponse(engine *templating.Engine, e *core.RequestEvent, error string) error {
	data := make(map[string]any)
	data["error"] = error
	nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
	if err != nil {
		return engine.Response500(e, err, data)
	}

	data["csrf_nonce"] = nonce
	data["csrf_token"] = token

	SetRedirect(data, e)

	str, err := engine.RenderToString(e, data, TEMPLATE_USER_CREATE, pagemodels.LAYOUT_BLANK_PAGE)
	if err != nil {
		return engine.Response500(e, err, data)
	}

	return e.HTML(400, str)
}

func (p *UserCreatePage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		role := e.Request.PathValue("role")
		if role != "User" && role != "Editor" && role != "Admin" {
			return engine.Response404(e, fmt.Errorf("invalid role: %s", role), nil)
		}

		// TODO: check access token
		data := make(map[string]any)
		data["role"] = role

		formdata := struct {
			Username       string `form:"username"`
			Password       string `form:"password"`
			PasswordRepeat string `form:"password_repeat"`
			Name           string `form:"name"`
			CsrfNonce      string `form:"csrf_nonce"`
			CsrfToken      string `form:"csrf_token"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return engine.Response500(e, err, data)
		}

		data["formdata"] = formdata

		if _, err := CSRF_CACHE.ValidateTokenBundle(formdata.CsrfNonce, formdata.CsrfToken); err != nil {
			return InvalidSignupResponse(engine, e, "CSRF-Token ungültig.")
		}

		if formdata.Username == "" || formdata.Password == "" || formdata.Name == "" {
			return InvalidSignupResponse(engine, e, "Bitte alle Felder ausfüllen.")
		}

		if formdata.Password != formdata.PasswordRepeat {
			return InvalidSignupResponse(engine, e, "Passwörter stimmen nicht überein.")
		}

		_, err := app.FindAuthRecordByEmail(dbmodels.USERS_TABLE, formdata.Username)
		if err == nil {
			return InvalidSignupResponse(engine, e, "Benutzer existiert bereits.")
		}

		user, err := dbmodels.CreateUser(app, formdata.Username, formdata.Password, formdata.Name, role)
		if err != nil {
			return InvalidSignupResponse(engine, e, fmt.Sprintf("Fehler beim Erstellen des Benutzers: %s", err.Error()))
		}

		SetRedirect(data, e)

		data["user"] = user
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}
