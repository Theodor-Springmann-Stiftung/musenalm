package pages

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

const (
	URL_USER_MANAGEMENT      = "/user/management"
	TEMPLATE_USER_MANAGEMENT = "/user/management/"
	URL_DEACTIVATE_USER      = "/deactivate/"
	URL_ACTIVATE_USER        = "/activate/"
	URL_LOGOUT_USER          = "/logout/"
)

type SessionCount struct {
	Count  int    `json:"count" db:"count"`
	UserId string `json:"user" db:"user"`
}

func init() {
	ump := &UserManagementPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_USER_MGMT_NAME,
			Layout:   "blankfooter",
			Template: TEMPLATE_USER_MANAGEMENT,
			URL:      URL_USER_MANAGEMENT,
		},
	}
	app.Register(ump)
}

type UserManagementPage struct {
	pagemodels.StaticPage
}

func (p *UserManagementPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
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
		GroupBy(dbmodels.SESSIONS_USER_FIELD).
		OrderBy("count DESC")

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
		p.getData(app, data)
		SetRedirect(data, e)

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) getData(app core.App, data map[string]any) error {
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

	csrfNonce, csrfToken, err := CSRF_CACHE.GenerateTokenBundle()
	if err != nil {
		return fmt.Errorf("Konnte kein CSRF-Token generieren.")
	}
	data["csrf_nonce"] = csrfNonce
	data["csrf_token"] = csrfToken

	return nil
}

func (p *UserManagementPage) ErrorResponse(engine *templating.Engine, e *core.RequestEvent, err error) error {
	data := make(map[string]any)
	data["error"] = err.Error()

	nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
	if err != nil {
		return engine.Response500(e, err, data)
	}
	data["csrf_nonce"] = nonce
	data["csrf_token"] = token

	str, err := engine.RenderToString(e, data, p.Template, p.Layout)

	return e.HTML(400, str)
}

func (p *UserManagementPage) POSTDeactivate(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		formdata := struct {
			User  string `form:"uid"`
			CSRF  string `form:"csrf_token"`
			Nonce string `form:"csrf_nonce"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Formulardaten ungültig: %w", err))
		}

		if _, err := CSRF_CACHE.ValidateTokenBundle(formdata.Nonce, formdata.CSRF); err != nil {
			return p.ErrorResponse(engine, e, err)
		}

		user, err := app.FindRecordById(dbmodels.USERS_TABLE, formdata.User)
		if err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht finden."))
		}

		u := dbmodels.NewUser(user)

		u.SetDeactivated(true)

		if err := app.Save(u); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht deaktivieren: %w", err))
		}

		go DeleteSessionsForUser(app, u.Id)

		data := make(map[string]any)
		data["success"] = "Nutzer " + u.Name() + "(" + u.Email() + ") wurde deaktiviert."

		p.getData(app, data)

		req := templating.NewRequest(e)
		if req.User() != nil && req.User().Id == u.Id {
			return e.Redirect(303, "/login/")
		}

		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) POSTActivate(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		formdata := struct {
			User  string `form:"uid"`
			CSRF  string `form:"csrf_token"`
			Nonce string `form:"csrf_nonce"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Formulardaten ungültig: %w", err))
		}

		if _, err := CSRF_CACHE.ValidateTokenBundle(formdata.Nonce, formdata.CSRF); err != nil {
			return p.ErrorResponse(engine, e, err)
		}

		user, err := app.FindRecordById(dbmodels.USERS_TABLE, formdata.User)
		if err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht finden."))
		}

		u := dbmodels.NewUser(user)

		u.SetDeactivated(false)

		if err := app.Save(u); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht aktivieren: %w", err))
		}

		go DeleteSessionsForUser(app, u.Id)

		data := make(map[string]any)
		data["success"] = "Nutzer " + u.Name() + "(" + u.Email() + ") wurde aktiviert."

		p.getData(app, data)

		req := templating.NewRequest(e)
		if req.User() != nil && req.User().Id == u.Id {
			return e.Redirect(303, "/login/")
		}

		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) POSTLogout(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		formdata := struct {
			User  string `form:"uid"`
			CSRF  string `form:"csrf_token"`
			Nonce string `form:"csrf_nonce"`
		}{}

		if err := e.BindBody(&formdata); err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Formulardaten ungültig: %w", err))
		}

		if _, err := CSRF_CACHE.ValidateTokenBundle(formdata.Nonce, formdata.CSRF); err != nil {
			return p.ErrorResponse(engine, e, err)
		}

		user, err := app.FindRecordById(dbmodels.USERS_TABLE, formdata.User)
		if err != nil {
			return p.ErrorResponse(engine, e, fmt.Errorf("Konnte Nutzer nicht finden."))
		}

		u := dbmodels.NewUser(user)
		go DeleteSessionsForUser(app, u.Id)

		data := make(map[string]any)
		data["success"] = "Nutzer " + u.Name() + "(" + u.Email() + ") wurde überall ausgeloggt."

		p.getData(app, data)

		req := templating.NewRequest(e)
		if req.User() != nil && req.User().Id == u.Id {
			return e.Redirect(301, "/login/")
		}

		// TODO: is there a better way to do this?
		// This destroys the URL FullPath thing, bc fullURL is set to /user/management/logout/
		// Same above
		e.Response.Header().Add("HX-Push-Url", "false")
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}
