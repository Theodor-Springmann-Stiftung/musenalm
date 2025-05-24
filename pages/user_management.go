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
	rg.POST("", p.POST(engine, app))
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
		records := []*core.Record{}
		err := app.RecordQuery(dbmodels.USERS_TABLE).OrderBy(dbmodels.USERS_NAME_FIELD).All(&records)
		if err != nil {
			return engine.Response500(e, err, nil)
		}

		users := make([]*dbmodels.User, 0, len(records))
		for _, record := range records {
			users = append(users, dbmodels.NewUser(record))
		}

		sessionCounts, err := GetSessionsCounts(app)
		if err != nil {
			return engine.Response500(e, err, nil)
		}

		scmap := make(map[string]int)
		for _, sc := range sessionCounts {
			scmap[sc.UserId] = sc.Count
		}

		data := make(map[string]any)
		data["users"] = users
		data["len"] = len(users)
		data["session_counts"] = scmap

		nonce, token, err := CSRF_CACHE.GenerateTokenBundle()
		if err != nil {
			return engine.Response500(e, err, data)
		}
		data["csrf_nonce"] = nonce
		data["csrf_token"] = token

		SetRedirect(data, e)

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *UserManagementPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		return fmt.Errorf("not implemented")
	}
}
