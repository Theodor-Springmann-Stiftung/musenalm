package controllers

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ALMANACH_EDIT      = "edit/"
	TEMPLATE_ALMANACH_EDIT = "/almanach/edit/"
)

func init() {
	ep := &AlmanachEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ALMANACH_EDIT_NAME,
			URL:      URL_ALMANACH_EDIT,
			Template: TEMPLATE_ALMANACH_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(ep)
}

type AlmanachEditPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachEditPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_ALMANACH)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ALMANACH_EDIT, p.GET(engine, app))
	return nil
}

func (p *AlmanachEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		data := make(map[string]any)
		filters := NewBeitraegeFilterParameters(e)
		result, err := NewAlmanachEditResult(app, id, filters)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["filters"] = filters
		data["csrf_token"] = req.Session().Token
		data["item_types"] = dbmodels.ITEM_TYPE_VALUES

		abbrs, err := pagemodels.GetAbks(app)
		if err == nil {
			data["abbrs"] = abbrs
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

type AlmanachEditResult struct {
	Next *dbmodels.Entry
	Prev *dbmodels.Entry
	User *dbmodels.User
	AlmanachResult
}

func NewAlmanachEditResult(app core.App, id string, filters BeitraegeFilterParameters) (*AlmanachEditResult, error) {
	result, err := NewAlmanachResult(app, id, filters)
	if err != nil {
		return nil, err
	}

	var user *dbmodels.User
	if result.Entry.Editor() != "" {
		u, err := dbmodels.Users_ID(app, result.Entry.Editor())
		if err == nil {
			user = u
		} else {
			app.Logger().Error("Failed to load user for entry editor", "entry", result.Entry.Id, "error", err)
		}
	}

	next := result.Entry.Next(app)
	prev := result.Entry.Prev(app)

	return &AlmanachEditResult{
		User:           user,
		AlmanachResult: *result,
		Next:           next,
		Prev:           prev,
	}, nil
}
