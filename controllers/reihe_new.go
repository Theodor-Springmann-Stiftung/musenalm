package controllers

import (
	"fmt"
	"net/http"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
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

func (p *ReiheNewPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_REIHEN_NEW)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST("", p.POST(engine, app, ia, store))
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
	data["cancel_url"] = cancelURLFromHeader(e)
	data["is_new"] = true
	if message != "" {
		data["error"] = message
	}

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *ReiheNewPage) POST(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)

		formdata := reiheEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderPage(engine, app, e, req, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderPage(engine, app, e, req, err.Error())
		}

		var createdSeries *dbmodels.Series
		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			editorID := req.EditorUserID()
			series, err := store.CreateSeries(tx, canonical.SeriesInput{
				Title:      formdata.Title,
				Pseudonyms: formdata.Pseudonyms,
				Annotation: formdata.Annotation,
				References: formdata.References,
				Frequency:  formdata.Frequency,
				Status:     formdata.Status,
				Comment:    formdata.Comment,
				EditorID:   editorID,
			}, effects)
			if err != nil {
				return err
			}
			createdSeries = series
			return nil
		}); err != nil {
			app.Logger().Error("Failed to create series", "error", err)
			return p.renderPage(engine, app, e, req, canonicalErrorMessage(err, "Speichern fehlgeschlagen."))
		}

		if createdSeries == nil {
			return p.renderPage(engine, app, e, req, "Speichern fehlgeschlagen.")
		}

		redirect := fmt.Sprintf(URL_REIHE_REDIRECT, createdSeries.MusenalmID())
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
