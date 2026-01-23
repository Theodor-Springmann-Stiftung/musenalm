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
	URL_ORTE_NEW = "/orte/new/"
)

func init() {
	pnp := &OrtNewPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ORT_NEW_NAME,
			URL:      URL_ORTE_NEW,
			Template: TEMPLATE_ORT_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(pnp)
}

type OrtNewPage struct {
	pagemodels.StaticPage
}

func (p *OrtNewPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_ORTE_NEW)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST("", p.POST(engine, app))
	return nil
}

func (p *OrtNewPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		return p.renderPage(engine, app, e, req, "")
	}
}

func (p *OrtNewPage) renderPage(engine *templating.Engine, app core.App, e *core.RequestEvent, req *templating.Request, message string) error {
	data := make(map[string]any)

	collection, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		return engine.Response500(e, err, data)
	}
	place := dbmodels.NewPlace(core.NewRecord(collection))
	place.SetEditState("Unknown")

	result := &OrtEditResult{
		Place:   place,
		User:    nil,
		Prev:    nil,
		Next:    nil,
		Entries: []*dbmodels.Entry{},
	}

	data["result"] = result
	data["csrf_token"] = req.Session().Token
	data["is_new"] = true
	if message != "" {
		data["error"] = message
	}

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *OrtNewPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)

		formdata := ortEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderPage(engine, app, e, req, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderPage(engine, app, e, req, err.Error())
		}

		name := strings.TrimSpace(formdata.Name)
		if name == "" {
			return p.renderPage(engine, app, e, req, "Name ist erforderlich.")
		}

		status := strings.TrimSpace(formdata.Status)
		if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
			return p.renderPage(engine, app, e, req, "Ungültiger Status.")
		}

		var createdPlace *dbmodels.Place
		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			collection, err := tx.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
			if err != nil {
				return err
			}
			place := dbmodels.NewPlace(core.NewRecord(collection))
			nextID, err := nextPlaceMusenalmID(tx)
			if err != nil {
				return err
			}
			place.SetMusenalmID(nextID)
			applyPlaceForm(place, formdata, name, status, user)
			if err := tx.Save(place); err != nil {
				return err
			}
			createdPlace = place
			return nil
		}); err != nil {
			app.Logger().Error("Failed to create place", "error", err)
			return p.renderPage(engine, app, e, req, "Speichern fehlgeschlagen.")
		}

		if createdPlace == nil {
			return p.renderPage(engine, app, e, req, "Speichern fehlgeschlagen.")
		}

		// Update FTS5 index for new place (no related entries yet) asynchronously
		go func(appInstance core.App, placeID string) {
			freshPlace, err := dbmodels.Places_ID(appInstance, placeID)
			if err != nil {
				appInstance.Logger().Error("Failed to load place for FTS5 update", "place_id", placeID, "error", err)
				return
			}
			if err := dbmodels.UpdateFTS5Place(appInstance, freshPlace); err != nil {
				appInstance.Logger().Error("Failed to update FTS5 index for new place", "place_id", placeID, "error", err)
			}
		}(app, createdPlace.Id)

		redirect := fmt.Sprintf("/ort/%s/edit?saved_message=%s", createdPlace.Id, url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
