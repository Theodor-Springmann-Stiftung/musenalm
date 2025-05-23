package pages

import (
	"fmt"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_USER_MANAGEMENT_ACCESS      = "/user/management/access/"
	TEMPLATE_USER_MANAGEMENT_ACCESS = "/user/management/access/"
)

func init() {
	ump := &UserManagementAccessPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_USER_MGMT_ACCESS_NAME,
			Layout:   "blank",
			Template: TEMPLATE_USER_MANAGEMENT_ACCESS,
			URL:      URL_USER_MANAGEMENT_ACCESS,
		},
	}
	app.Register(ump)
}

type UserManagementAccessPage struct {
	pagemodels.StaticPage
}

func (p *UserManagementAccessPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_USER_MANAGEMENT_ACCESS)
	rg.BindFunc(middleware.IsAdmin())
	rg.GET("{"+PATH_VALUE_ROLE+"}", p.GET(engine, app))
	rg.POST("{"+PATH_VALUE_ROLE+"}", p.POST(engine, app))
	return nil
}

func (p *UserManagementAccessPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		role := e.Request.PathValue("role")
		if role != "User" && role != "Editor" && role != "Admin" {
			return engine.Response404(e, fmt.Errorf("invalid role: %s", role), nil)
		}

		path_access := URL_USER_CREATE + role
		record, err := app.FindFirstRecordByData(dbmodels.ACCESS_TOKENS_TABLE, dbmodels.ACCESS_TOKENS_URL_FIELD, path_access)
		var access_token *dbmodels.AccessToken
		if err != nil {
			token, err := dbmodels.CreateAccessToken(app, "", path_access, 7*24*time.Hour)
			if err != nil {
				return engine.Response500(e, err, nil)
			}
			access_token = token
		} else {
			access_token = dbmodels.NewAccessToken(record)
		}

		// TODO: check if access token exists, if not generate
		data := make(map[string]any)
		data["role"] = role
		data["access_url"] = "https://musenalm.de" + path_access + "?token=" + access_token.Token()
		data["relative_url"] = path_access + "?token=" + access_token.Token()
		data["validUntil"] = access_token.Expires().Time().Local().Format("02.01.2006 15:04")

		nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, data)
		}
		data["csrf_nonce"] = nonce
		data["csrf_token"] = token

		redirect_url := e.Request.URL.Query().Get("redirectTo")
		if redirect_url != "" {
			data["redirect_url"] = redirect_url
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementAccessPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		role := e.Request.PathValue("role")
		if role != "User" && role != "Editor" && role != "Admin" {
			return engine.Response404(e, fmt.Errorf("invalid role: %s", role), nil)
		}

		path_access := URL_USER_CREATE + role
		record, err := app.FindFirstRecordByData(dbmodels.ACCESS_TOKENS_TABLE, dbmodels.ACCESS_TOKENS_URL_FIELD, path_access)
		if err == nil {
			go app.Delete(record)
		}

		token, err := dbmodels.CreateAccessToken(app, "", path_access, 7*24*time.Hour)
		if err != nil {
			return engine.Response500(e, err, nil)
		}

		data := make(map[string]any)
		data["role"] = role
		data["access_url"] = "https://musenalm.de" + path_access + "?token=" + token.Token()
		data["relative_url"] = path_access + "?token=" + token.Token()
		data["validUntil"] = token.Expires().Time().Format("02.01.2006 15:04")

		redirect_url := e.Request.URL.Query().Get("redirectTo")
		if redirect_url != "" {
			data["redirect_url"] = redirect_url
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}
