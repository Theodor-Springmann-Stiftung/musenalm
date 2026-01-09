package controllers

import (
	"fmt"
	"net/http"
	"net/url"
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_REIHEN_NEW = "/reihen/new/"
)

func init() {
	rnp := &ReiheNewPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHE_NEW_NAME,
			URL:      URL_REIHEN_NEW,
			Template: TEMPLATE_REIHE_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(rnp)
}

type ReiheNewPage struct {
	pagemodels.StaticPage
}

func (p *ReiheNewPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_REIHEN_NEW)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST("", p.POST(engine, app))
	return nil
}

func (p *ReiheNewPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		return p.renderPage(engine, app, e, req, "")
	}
}

func (p *ReiheNewPage) renderPage(engine *templating.Engine, app core.App, e *core.RequestEvent, req *templating.Request, message string) error {
	data := make(map[string]any)

	collection, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
	if err != nil {
		return engine.Response500(e, err, data)
	}
	series := dbmodels.NewSeries(core.NewRecord(collection))
	series.SetEditState("Unknown")

	result := &ReiheEditResult{
		Series:           series,
		User:             nil,
		Prev:             nil,
		Next:             nil,
		Entries:          []*dbmodels.Entry{},
		Contents:         []*dbmodels.Content{},
		ContentEntries:   map[string]*dbmodels.Entry{},
		ContentTypes:     map[string][]string{},
		PreferredEntries: []*dbmodels.Entry{},
	}

	data["result"] = result
	data["csrf_token"] = req.Session().Token
	data["is_new"] = true
	if message != "" {
		data["error"] = message
	}

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *ReiheNewPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)

		formdata := reiheEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderPage(engine, app, e, req, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderPage(engine, app, e, req, err.Error())
		}

		title := strings.TrimSpace(formdata.Title)
		if title == "" {
			return p.renderPage(engine, app, e, req, "Reihentitel ist erforderlich.")
		}

		status := strings.TrimSpace(formdata.Status)
		if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
			return p.renderPage(engine, app, e, req, "Ungültiger Status.")
		}

		var createdSeries *dbmodels.Series
		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			collection, err := tx.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
			if err != nil {
				return err
			}
			series := dbmodels.NewSeries(core.NewRecord(collection))
			nextID, err := nextSeriesMusenalmID(tx)
			if err != nil {
				return err
			}
			series.SetMusenalmID(nextID)
			applySeriesForm(series, formdata, title, status, user)
			if err := tx.Save(series); err != nil {
				return err
			}
			createdSeries = series
			return nil
		}); err != nil {
			app.Logger().Error("Failed to create series", "error", err)
			return p.renderPage(engine, app, e, req, "Speichern fehlgeschlagen.")
		}

		if createdSeries == nil {
			return p.renderPage(engine, app, e, req, "Speichern fehlgeschlagen.")
		}

		redirect := fmt.Sprintf(
			"/reihe/%d/edit?saved_message=%s",
			createdSeries.MusenalmID(),
			url.QueryEscape("Änderungen gespeichert."),
		)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
