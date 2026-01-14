package controllers

import (
	"fmt"
	"log/slog"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_USER            = "/user/{uid}/"
	URL_USER_EDIT       = "edit/"
	URL_USER_LOGOUT     = "logout/"
	URL_USER_DEACTIVATE = "deactivate/"
	URL_USER_ACTIVATE   = "activate/"
	UID_PATH_VALUE      = "uid"
	TEMPLATE_USER_EDIT  = "/user/edit/"
)

func init() {
	ump := &UserEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_USER_EDIT_NAME,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
			Template: TEMPLATE_USER_EDIT,
			URL:      URL_USER_EDIT,
		},
	}
	app.Register(ump)
}

type UserEditPage struct {
	pagemodels.StaticPage
}

func (p *UserEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_USER)
	rg.BindFunc(middleware.IsAdminOrUser())
	rg.GET(URL_USER_EDIT, p.GET(engine, app))
	rg.POST(URL_USER_EDIT, p.POST(engine, app))
	rg.POST(URL_USER_DEACTIVATE, p.POSTDeactivate(engine, app))
	rg.POST(URL_USER_ACTIVATE, p.POSTActivate(engine, app))
	return nil
}

func (p *UserEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		err := p.getData(app, data, e)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		return engine.Response200(e, TEMPLATE_USER_EDIT, data, p.Layout)
	}
}

func (p *UserEditPage) getData(app core.App, data map[string]any, e *core.RequestEvent) error {
	uid := e.Request.PathValue(UID_PATH_VALUE)
	user, err := dbmodels.Users_ID(app, uid)
	if err != nil {
		return fmt.Errorf("Konnte Nutzer nicht finden: %w", err)
	}

	fu := user.Fixed()

	data["user"] = &fu
	data["db_user"] = user

	req := templating.NewRequest(e)
	data["csrf_token"] = req.Session().Token

	SetRedirect(data, e)

	return nil
}

func DeleteSessionsForUser(app core.App, uid string) error {
	defer middleware.SESSION_CACHE.DeleteSessionByUserID(uid)
	records := []*core.Record{}
	err := app.RecordQuery(dbmodels.SESSIONS_TABLE).
		Where(dbx.HashExp{dbmodels.SESSIONS_USER_FIELD: uid}).
		All(&records)
	if err != nil {
		return err
	}

	err = app.RunInTransaction(func(tx core.App) error {
		for _, r := range records {
			session := dbmodels.NewSession(r)
			session.SetStatus(dbmodels.TOKEN_STATUS_VALUES[3])
			if err := tx.Save(r); err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func (p *UserEditPage) InvalidDataResponse(engine *templating.Engine, e *core.RequestEvent, error string, user dbmodels.FixedUser) error {
	data := make(map[string]any)
	err := p.getData(e.App, data, e)
	if err != nil {
		return engine.Response500(e, err, data)
	}

	str, err := engine.RenderToString(e, data, p.Template, p.Layout)
	if err != nil {
		return engine.Response500(e, err, data)
	}

	return e.HTML(400, str)
}

func (p *UserEditPage) POSTDeactivate(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		err := p.getData(app, data, e)
		req := templating.NewRequest(e)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		formdata := struct {
			CSRF string `form:"csrf_token"`
		}{}

		user := data["db_user"].(*dbmodels.User)

		if err := e.BindBody(&formdata); err != nil {
			return p.InvalidDataResponse(engine, e, "Formulardaten ungültig.", user.Fixed())
		}

		if err := req.CheckCSRF(formdata.CSRF); err != nil {
			return p.InvalidDataResponse(engine, e, err.Error(), user.Fixed())
		}

		if formdata.CSRF != req.Session().Token {
			return p.InvalidDataResponse(engine, e, "CSRF-Token ungültig", user.Fixed())
		}

		user.SetDeactivated(true)

		if err := app.Save(user); err != nil {
			return p.InvalidDataResponse(engine, e, "Konnte Nutzer nicht deaktivieren: "+err.Error(), user.Fixed())
		}

		DeleteSessionsForUser(app, user.Id)

		if req.User() != nil && req.User().Id == user.Id {
			return e.Redirect(303, "/login/")
		}

		fu := user.Fixed()
		data["user"] = &fu
		data["success"] = "Nutzer " + fu.Name + "(" + fu.Email + ") wurde deaktiviert."

		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserEditPage) POSTActivate(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		req := templating.NewRequest(e)
		err := p.getData(app, data, e)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		user := data["db_user"].(*dbmodels.User)

		formdata := struct {
			CSRF string `form:"csrf_token"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.InvalidDataResponse(engine, e, "Formulardaten ungültig.", user.Fixed())
		}

		if err := req.CheckCSRF(formdata.CSRF); err != nil {
			return p.InvalidDataResponse(engine, e, err.Error(), user.Fixed())
		}

		user.SetDeactivated(false)

		if err := app.Save(user); err != nil {
			return p.InvalidDataResponse(engine, e, "Konnte Nutzer nicht aktivieren: "+err.Error(), user.Fixed())
		}

		fu := user.Fixed()
		data["user"] = &fu
		data["success"] = "Nutzer " + fu.Name + "(" + fu.Email + ") wurde aktiviert."

		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserEditPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)

		uid := e.Request.PathValue(UID_PATH_VALUE)
		req := templating.NewRequest(e)
		user := req.User()

		user_proxy, err := dbmodels.Users_ID(app, uid)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		fu := user_proxy.Fixed()

		formdata := struct {
			Email          string `form:"username"`
			Name           string `form:"name"`
			Role           string `form:"role"`
			CSRF           string `form:"csrf_token"`
			Password       string `form:"password"`
			PasswordRepeat string `form:"password_repeat"`
			OldPassword    string `form:"old_password"`
			Logout         string `form:"logout"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.InvalidDataResponse(engine, e, err.Error(), fu)
		}

		if err := req.CheckCSRF(formdata.CSRF); err != nil {
			return p.InvalidDataResponse(engine, e, err.Error(), fu)
		}

		if formdata.Email == "" || formdata.Name == "" {
			return p.InvalidDataResponse(engine, e, "Bitte alle Felder ausfüllen", fu)
		}

		// INFO: at this point email and name changes are allowed
		user_proxy.SetEmail(formdata.Email)
		user_proxy.SetName(formdata.Name)

		rolechanged := false
		if formdata.Role != "" && formdata.Role != user_proxy.Role() {
			if user.Role == "Admin" &&
				(formdata.Role == "User" || formdata.Role == "Editor" || formdata.Role == "Admin") {
				user_proxy.SetRole(formdata.Role)
				rolechanged = true
			} else {
				return p.InvalidDataResponse(engine, e, "Rolle nicht erlaubt", fu)
			}
		}

		passwordchanged := false
		if formdata.Password != "" || formdata.PasswordRepeat != "" || formdata.OldPassword != "" {
			if user.Role != "Admin" && formdata.OldPassword == "" {
				return p.InvalidDataResponse(engine, e, "Altes Passwort erforderlich", fu)
			} else if user.Role != "Admin" && !user_proxy.ValidatePassword(formdata.OldPassword) {
				return p.InvalidDataResponse(engine, e, "Altes Passwort falsch", fu)
			}

			if formdata.Password != formdata.PasswordRepeat {
				return p.InvalidDataResponse(engine, e, "Passwörter stimmen nicht überein", fu)
			}

			user_proxy.SetPassword(formdata.Password)
			passwordchanged = true
		}

		if err := app.Save(user_proxy); err != nil {
			return p.InvalidDataResponse(engine, e, err.Error(), fu)
		}

		slog.Info("UserEditPage: User edited", "user_id", user_proxy.Id, "role_changed", rolechanged, "password_changed", passwordchanged, "formdata", formdata)
		if rolechanged || (passwordchanged && formdata.Logout == "on") {
			slog.Error("UserEditPage: Deleting sessions for user", "user_id", user_proxy.Id, "role_changed", rolechanged, "password_changed", passwordchanged)
			if err := DeleteSessionsForUser(app, user_proxy.Id); err != nil {
				return p.InvalidDataResponse(engine, e, "Fehler beim Löschen der Sitzungen: "+err.Error(), fu)
			}

			if user_proxy.Id == user.Id {
				// INFO: user changed his own role, so we log him out
				return e.Redirect(303, "/login/")
			}
		}

		go middleware.SESSION_CACHE.DeleteSessionByUserID(user_proxy.Id)

		fu = user_proxy.Fixed()
		data["user"] = &fu
		if user_proxy.Id == user.Id {
			e.Set("user", &fu)
		}

		data["success"] = "Benutzer erfolgreich bearbeitet"

		data["csrf_token"] = req.Session().Token
		return engine.Response200(e, TEMPLATE_USER_EDIT, data, p.Layout)
	}
}
