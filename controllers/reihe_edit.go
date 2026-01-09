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
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_REIHE_EDIT      = "edit"
	TEMPLATE_REIHE_EDIT = "/reihe/edit/"
)

func init() {
	rep := &ReiheEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHE_EDIT_NAME,
			URL:      URL_REIHE_EDIT,
			Template: TEMPLATE_REIHE_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(rep)
}

type ReiheEditPage struct {
	pagemodels.StaticPage
}

func (p *ReiheEditPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_REIHE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_REIHE_EDIT, p.GET(engine, app))
	rg.POST(URL_REIHE_EDIT, p.POST(engine, app))
	return nil
}

type ReiheEditResult struct {
	Series *dbmodels.Series
	User   *dbmodels.User
}

func NewReiheEditResult(app core.App, id string) (*ReiheEditResult, error) {
	series, err := dbmodels.Series_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	var user *dbmodels.User
	if series.Editor() != "" {
		u, err := dbmodels.Users_ID(app, series.Editor())
		if err == nil {
			user = u
		} else {
			app.Logger().Error("Failed to load user for series editor", "series", series.Id, "error", err)
		}
	}

	return &ReiheEditResult{
		Series: series,
		User:   user,
	}, nil
}

func (p *ReiheEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		result, err := NewReiheEditResult(app, id)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["result"] = result

		req := templating.NewRequest(e)
		data["csrf_token"] = req.Session().Token

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *ReiheEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string) error {
	id := e.Request.PathValue("id")
	data := make(map[string]any)
	result, err := NewReiheEditResult(app, id)
	if err != nil {
		return engine.Response404(e, err, data)
	}
	data["result"] = result
	data["error"] = message

	req := templating.NewRequest(e)
	data["csrf_token"] = req.Session().Token

	return engine.Response200(e, p.Template, data, p.Layout)
}

type reiheEditForm struct {
	CSRFToken  string `form:"csrf_token"`
	LastEdited string `form:"last_edited"`
	Title      string `form:"title"`
	Pseudonyms string `form:"pseudonyms"`
	Annotation string `form:"annotation"`
	References string `form:"references"`
	Frequency  string `form:"frequency"`
	Status     string `form:"status"`
	Comment    string `form:"edit_comment"`
}

func (p *ReiheEditPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		formdata := reiheEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderError(engine, app, e, err.Error())
		}

		series, err := dbmodels.Series_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		if formdata.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(formdata.LastEdited)
			if err != nil {
				return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.")
			}
			if !series.Updated().Time().Equal(lastEdited.Time()) {
				return p.renderError(engine, app, e, "Die Reihe wurde inzwischen geändert. Bitte Seite neu laden.")
			}
		}

		title := strings.TrimSpace(formdata.Title)
		if title == "" {
			return p.renderError(engine, app, e, "Reihentitel ist erforderlich.")
		}

		status := strings.TrimSpace(formdata.Status)
		if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
			return p.renderError(engine, app, e, "Ungültiger Status.")
		}

		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			series.SetTitle(title)
			series.SetPseudonyms(strings.TrimSpace(formdata.Pseudonyms))
			series.SetAnnotation(strings.TrimSpace(formdata.Annotation))
			series.SetReferences(strings.TrimSpace(formdata.References))
			series.SetFrequency(strings.TrimSpace(formdata.Frequency))
			series.SetEditState(status)
			series.SetComment(strings.TrimSpace(formdata.Comment))
			if user != nil {
				series.SetEditor(user.Id)
			}
			return tx.Save(series)
		}); err != nil {
			app.Logger().Error("Failed to save series", "series_id", series.Id, "error", err)
			return p.renderError(engine, app, e, "Speichern fehlgeschlagen.")
		}

		redirect := fmt.Sprintf("/reihe/%s/edit?saved_message=%s", id, url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
