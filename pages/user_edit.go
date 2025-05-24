package pages

import (
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
	URL_USER_EDIT      = "/user/{uid}/edit/"
	UID_PATH_VALUE     = "uid"
	TEMPLATE_USER_EDIT = "/user/edit/"
)

func init() {
	ump := &UserEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_USER_EDIT_NAME,
			Layout:   "blankfooter",
			Template: TEMPLATE_USER_EDIT,
			URL:      URL_USER_EDIT,
		},
	}
	app.Register(ump)
}

type UserEditPage struct {
	pagemodels.StaticPage
}

func (p *UserEditPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_USER_EDIT, p.GET(engine, app))
	router.POST(URL_USER_EDIT, p.POST(engine, app))
	return nil
}

func (p *UserEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)

		uid := e.Request.PathValue(UID_PATH_VALUE)
		req := templating.NewRequest(e)
		user := req.User()

		if user == nil {
			return engine.Response404(e, nil, nil)
		}

		if user.Id != uid && user.Role != "Admin" {
			return engine.Response404(e, nil, nil)
		}

		u, err := app.FindRecordById(dbmodels.USERS_TABLE, uid)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		fu := dbmodels.NewUser(u).Fixed()

		data["user"] = &fu

		nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, nil)
		}
		data["csrf_token"] = token
		data["csrf_nonce"] = nonce

		SetRedirect(data, e)

		return engine.Response200(e, TEMPLATE_USER_EDIT, data, p.Layout)
	}
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
			if err := tx.Delete(r); err != nil {
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

func InvalidDataResponse(engine *templating.Engine, e *core.RequestEvent, error string, user *dbmodels.FixedUser) error {
	data := make(map[string]any)
	data["error"] = error
	data["user"] = user

	nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
	if err != nil {
		return engine.Response500(e, err, data)
	}

	data["csrf_nonce"] = nonce
	data["csrf_token"] = token

	SetRedirect(data, e)

	str, err := engine.RenderToString(e, data, TEMPLATE_USER_EDIT, "blank")
	if err != nil {
		return engine.Response500(e, err, data)
	}

	return e.HTML(400, str)
}

func (p *UserEditPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)

		uid := e.Request.PathValue(UID_PATH_VALUE)
		req := templating.NewRequest(e)
		user := req.User()

		if user == nil {
			return engine.Response404(e, nil, nil)
		}

		if user.Id != uid && user.Role != "Admin" {
			return engine.Response404(e, nil, nil)
		}

		u, err := app.FindRecordById(dbmodels.USERS_TABLE, uid)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		user_proxy := dbmodels.NewUser(u)
		fu := user_proxy.Fixed()

		formdata := struct {
			Email          string `form:"username"`
			Name           string `form:"name"`
			Role           string `form:"role"`
			CsrfNonce      string `form:"csrf_nonce"`
			CsrfToken      string `form:"csrf_token"`
			Password       string `form:"password"`
			PasswordRepeat string `form:"password_repeat"`
			OldPassword    string `form:"old_password"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return InvalidDataResponse(engine, e, err.Error(), &fu)
		}

		if formdata.CsrfNonce != "" && formdata.CsrfToken != "" {
			if _, err := CSRF_CACHE.ValidateTokenBundle(formdata.CsrfNonce, formdata.CsrfToken); err != nil {
				return InvalidDataResponse(engine, e, "CSRF ungültig oder abgelaufen", &fu)
			}
		} else {
			return InvalidDataResponse(engine, e, "CSRF ungültig oder abgelaufen", &fu)
		}

		if formdata.Email == "" || formdata.Name == "" {
			return InvalidDataResponse(engine, e, "Bitte alle Felder ausfüllen", &fu)
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
				return InvalidDataResponse(engine, e, "Rolle nicht erlaubt", &fu)
			}
		}

		if formdata.Password != "" || formdata.PasswordRepeat != "" || formdata.OldPassword != "" {
			if user.Role != "Admin" && formdata.OldPassword == "" {
				return InvalidDataResponse(engine, e, "Altes Passwort erforderlich", &fu)
			} else if user.Role != "Admin" && !user_proxy.ValidatePassword(formdata.OldPassword) {
				return InvalidDataResponse(engine, e, "Altes Passwort falsch", &fu)
			}

			if formdata.Password != formdata.PasswordRepeat {
				return InvalidDataResponse(engine, e, "Passwörter stimmen nicht überein", &fu)
			}

			user_proxy.SetPassword(formdata.Password)
		}

		if err := app.Save(user_proxy); err != nil {
			return InvalidDataResponse(engine, e, err.Error(), &fu)
		}

		if rolechanged {
			if err := DeleteSessionsForUser(app, user_proxy.Id); err != nil {
				return InvalidDataResponse(engine, e, "Fehler beim Löschen der Sitzungen: "+err.Error(), &fu)
			}

			if user_proxy.Id == user.Id {
				// INFO: user changed his own role, so we log him out
				return e.Redirect(303, "/login/")
			}
		}

		fu = user_proxy.Fixed()
		data["user"] = &fu
		if user_proxy.Id == user.Id {
			e.Set("user", &fu)
		}

		data["success"] = "Benutzer erfolgreich bearbeitet"

		nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, nil)
		}
		data["csrf_token"] = token
		data["csrf_nonce"] = nonce

		SetRedirect(data, e)
		return engine.Response200(e, TEMPLATE_USER_EDIT, data, p.Layout)
	}
}
