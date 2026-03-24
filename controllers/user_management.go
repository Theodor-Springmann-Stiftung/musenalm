package controllers

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type SessionCount struct {
	Count  int    `json:"count" db:"count"`
	UserId string `json:"user" db:"user"`
}

func init() {
	ump := &UserManagementPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_USER_MGMT_NAME,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
			Template: TEMPLATE_USER_MANAGEMENT,
			URL:      URL_USER_MANAGEMENT,
		},
	}
	app.Register(ump)
}

type UserManagementPage struct {
	pagemodels.StaticPage
}

func (p *UserManagementPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_USER_MANAGEMENT)
	rg.BindFunc(middleware.IsAdmin())
	rg.GET("", p.GET(engine, app))
	rg.POST(URL_DEACTIVATE_USER, p.POSTDeactivate(engine, app))
	rg.POST(URL_ACTIVATE_USER, p.POSTActivate(engine, app))
	rg.POST(URL_LOGOUT_USER, p.POSTLogout(engine, app))
	return nil
}

func GetSessionsCounts(app core.App) ([]*SessionCount, error) {
	query := app.RecordQuery(dbmodels.SESSIONS_TABLE).
		Select("COUNT(*) AS count", dbmodels.SESSIONS_USER_FIELD).
		AndWhere(dbx.HashExp{dbmodels.SESSIONS_STATUS_FIELD: dbmodels.TOKEN_STATUS_VALUES[0]}).
		GroupBy(dbmodels.SESSIONS_USER_FIELD)

	var counts []*SessionCount
	err := query.All(&counts)
	if err != nil {
		return nil, fmt.Errorf("failed to get session counts: %w", err)
	}

	return counts, nil
}

func (p *UserManagementPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := make(map[string]any)
		p.getData(app, templating.NewRequest(e), data)
		SetRedirect(data, e)

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) getData(app core.App, req *templating.Request, data map[string]any) error {
	records := []*core.Record{}
	err := app.RecordQuery(dbmodels.USERS_TABLE).OrderBy(dbmodels.USERS_NAME_FIELD).All(&records)
	if err != nil {
		return fmt.Errorf("Konnte keine Nutzer laden: %w", err)
	}

	users := make([]*dbmodels.User, 0, len(records))
	for _, record := range records {
		users = append(users, dbmodels.NewUser(record))
	}

	sessionCounts, err := GetSessionsCounts(app)
	if err != nil {
		return fmt.Errorf("Konnte keine Sitzungsanzahlen laden: %w", err)
	}

	scmap := make(map[string]int)
	for _, sc := range sessionCounts {
		scmap[sc.UserId] = sc.Count
	}

	data["users"] = users
	data["len"] = len(users)
	data["session_counts"] = scmap
	data["csrf_token"] = req.Session().Token

	return nil
}

func (p *UserManagementPage) ErrorResponse(engine *templating.Engine, e *core.RequestEvent, err error) error {
	data := make(map[string]any)
	req := templating.NewRequest(e)
	data["error"] = err.Error()

	err = p.getData(e.App, req, data)
	if err != nil {
		engine.Response500(e, fmt.Errorf("Nutzerdaten konnten nicht geladen werden: %w", err), data)
	}

	str, err := engine.RenderToString(e, data, p.Template, p.Layout)
	if err != nil {
		engine.Response500(e, fmt.Errorf("Konnte Fehlerseite nicht rendern: %w", err), data)
	}

	e.Response.Header().Add("HX-Push-Url", "false")
	return e.HTML(400, str)
}

func (p *UserManagementPage) POSTDeactivate(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		formdata := struct {
			User string `form:"uid"`
			CSRF string `form:"csrf_token"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Formulardaten ungültig: %w", err))
		}

		req := templating.NewRequest(e)
		if err := req.CheckCSRF(formdata.CSRF); err != nil {
			return p.ErrorResponse(engine, e, err)
		}

		u, err := dbmodels.Users_ID(app, formdata.User)
		if err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht finden."))
		}

		u.SetDeactivated(true)

		if err := app.Save(u); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht deaktivieren: %w", err))
		}

		DeleteSessionsForUser(app, u.Id)

		data := make(map[string]any)
		data["success"] = "Nutzer " + u.Name() + "(" + u.Email() + ") wurde deaktiviert."

		p.getData(app, req, data)

		if req.User() != nil && req.User().Id == u.Id {
			return e.Redirect(303, URL_USER_MGMT_LOGIN)
		}

		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) POSTActivate(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		formdata := struct {
			User string `form:"uid"`
			CSRF string `form:"csrf_token"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Formulardaten ungültig: %w", err))
		}

		req := templating.NewRequest(e)
		if err := req.CheckCSRF(formdata.CSRF); err != nil {
			return p.ErrorResponse(engine, e, err)
		}

		u, err := dbmodels.Users_ID(app, formdata.User)
		if err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht finden."))
		}

		u.SetDeactivated(false)

		if err := app.Save(u); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht aktivieren: %w", err))
		}

		go DeleteSessionsForUser(app, u.Id)

		data := make(map[string]any)
		data["success"] = "Nutzer " + u.Name() + "(" + u.Email() + ") wurde aktiviert."

		p.getData(app, req, data)

		if req.User() != nil && req.User().Id == u.Id {
			return e.Redirect(303, URL_USER_MGMT_LOGIN)
		}

		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) POSTLogout(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		formdata := struct {
			User string `form:"uid"`
			CSRF string `form:"csrf_token"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Formulardaten ungültig: %w", err))
		}

		req := templating.NewRequest(e)
		if err := req.CheckCSRF(formdata.CSRF); err != nil {
			return p.ErrorResponse(engine, e, err)
		}

		u, err := dbmodels.Users_ID(app, formdata.User)
		if err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht finden."))
		}

		DeleteSessionsForUser(app, u.Id)

		data := make(map[string]any)
		data["success"] = "Nutzer " + u.Name() + "(" + u.Email() + ") wurde überall ausgeloggt."

		p.getData(app, req, data)

		if req.User() != nil && req.User().Id == u.Id {
			return e.Redirect(301, URL_USER_MGMT_LOGIN)
		}

		// TODO: is there a better way to do this?
		// This destroys the URL FullPath thing, bc fullURL is set to /admin/user/management/logout/
		// Same above
		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}
