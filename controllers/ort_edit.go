package controllers

import (
	"fmt"
	"net/http"
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_ORT           = "/ort/{id}/"
	URL_ORT_EDIT      = "edit"
	URL_ORT_DELETE    = "edit/delete"
	TEMPLATE_ORT_EDIT = "/ort/edit/"
)

func init() {
	pep := &OrtEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ORT_EDIT_NAME,
			URL:      URL_ORT_EDIT,
			Template: TEMPLATE_ORT_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(pep)
}

type OrtEditPage struct {
	pagemodels.StaticPage
}

func (p *OrtEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_ORT)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ORT_EDIT, p.GET(engine, app))
	rg.POST(URL_ORT_EDIT, p.POST(engine, app))
	rg.POST(URL_ORT_DELETE, p.POSTDelete(engine, app))
	return nil
}

type OrtEditResult struct {
	Place   *dbmodels.Place
	User    *dbmodels.User
	Prev    *dbmodels.Place
	Next    *dbmodels.Place
	Entries []*dbmodels.Entry
}

func NewOrtEditResult(app core.App, id string) (*OrtEditResult, error) {
	place, err := dbmodels.Places_ID(app, id)
	if err != nil {
		return nil, err
	}

	var user *dbmodels.User
	if place.Editor() != "" {
		u, err := dbmodels.Users_ID(app, place.Editor())
		if err == nil {
			user = u
		} else {
			app.Logger().Error("Failed to load user for place editor", "place", place.Id, "error", err)
		}
	}

	prev, next, err := placeNeighbors(app, place.Id)
	if err != nil {
		app.Logger().Error("Failed to load place neighbors", "place", place.Id, "error", err)
	}

	entries, err := placeEntries(app, place.Id)
	if err != nil {
		app.Logger().Error("Failed to load place entries", "place", place.Id, "error", err)
	}
	if len(entries) > 0 {
		dbmodels.Sort_Entries_Year_Title(entries)
	}

	return &OrtEditResult{
		Place:   place,
		User:    user,
		Prev:    prev,
		Next:    next,
		Entries: entries,
	}, nil
}

func (p *OrtEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		result, err := NewOrtEditResult(app, id)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["result"] = result

		req := templating.NewRequest(e)
		data["csrf_token"] = req.Session().Token
		data["cancel_url"] = cancelURLFromHeader(e)

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *OrtEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string, formdata *ortEditForm) error {
	id := e.Request.PathValue("id")
	data := make(map[string]any)
	result, err := NewOrtEditResult(app, id)
	if err != nil {
		return engine.Response404(e, err, data)
	}
	if formdata != nil && result != nil && result.Place != nil {
		name := strings.TrimSpace(formdata.Name)
		status := strings.TrimSpace(formdata.Status)
		applyPlaceForm(result.Place, *formdata, name, status, nil)
	}
	data["result"] = result
	data["error"] = message

	req := templating.NewRequest(e)
	data["csrf_token"] = req.Session().Token
	data["cancel_url"] = cancelURLFromHeader(e)

	return engine.Response200(e, p.Template, data, p.Layout)
}

type ortEditForm struct {
	CSRFToken  string `form:"csrf_token"`
	LastEdited string `form:"last_edited"`
	SaveAction string `form:"save_action"`
	Name       string `form:"name"`
	Pseudonyms string `form:"pseudonyms"`
	Annotation string `form:"annotation"`
	URI        string `form:"uri"`
	Fictional  bool   `form:"fictional"`
	Status     string `form:"status"`
	Comment    string `form:"edit_comment"`
}

func applyPlaceForm(place *dbmodels.Place, formdata ortEditForm, name string, status string, user *dbmodels.FixedUser) {
	place.SetName(name)
	place.SetPseudonyms(strings.TrimSpace(formdata.Pseudonyms))
	place.SetAnnotation(strings.TrimSpace(formdata.Annotation))
	place.SetURI(strings.TrimSpace(formdata.URI))
	place.SetFictional(formdata.Fictional)
	place.SetEditState(status)
	place.SetComment(strings.TrimSpace(formdata.Comment))
	if user != nil {
		place.SetEditor(user.Id)
	}
}

func (p *OrtEditPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		formdata := ortEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.", nil)
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderError(engine, app, e, err.Error(), &formdata)
		}

		place, err := dbmodels.Places_ID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		if formdata.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(formdata.LastEdited)
			if err != nil {
				return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.", &formdata)
			}
			if !place.Updated().Time().Equal(lastEdited.Time()) {
				return p.renderError(engine, app, e, "Der Ort wurde inzwischen geändert. Bitte Seite neu laden.", &formdata)
			}
		}

		name := strings.TrimSpace(formdata.Name)
		if name == "" {
			return p.renderError(engine, app, e, "Name ist erforderlich.", &formdata)
		}

		status := strings.TrimSpace(formdata.Status)
		if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
			return p.renderError(engine, app, e, "Ungültiger Status.", &formdata)
		}

		// Capture old name (entries depend on place name)
		oldName := place.Name()

		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			applyPlaceForm(place, formdata, name, status, user)
			return tx.Save(place)
		}); err != nil {
			app.Logger().Error("Failed to save place", "place_id", place.Id, "error", err)
			return p.renderError(engine, app, e, "Speichern fehlgeschlagen.", &formdata)
		}

		// Check if name changed (entries store place name)
		nameChanged := place.Name() != oldName

		// Update FTS5 index for place and conditionally update related entries asynchronously
		go func(appInstance core.App, placeID string, updateEntries bool) {
			freshPlace, err := dbmodels.Places_ID(appInstance, placeID)
			if err != nil {
				appInstance.Logger().Error("Failed to load place for FTS5 update", "place_id", placeID, "error", err)
				return
			}
			// If name changed, update place + entries. Otherwise just update place.
			if updateEntries {
				if err := dbmodels.UpdateFTS5PlaceAndRelatedEntries(appInstance, freshPlace); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 index for place and entries", "place_id", placeID, "error", err)
				}
			} else {
				if err := dbmodels.UpdateFTS5Place(appInstance, freshPlace); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 index for place", "place_id", placeID, "error", err)
				}
			}
		}(app, place.Id, nameChanged)

		if strings.TrimSpace(formdata.SaveAction) == "view" {
			redirect := fmt.Sprintf("/reihen/?place=%s", id)
			return e.Redirect(http.StatusSeeOther, redirect)
		}
		if strings.TrimSpace(formdata.SaveAction) == "view" {
			redirect := fmt.Sprintf("/ort/%s", id)
			return e.Redirect(http.StatusSeeOther, redirect)
		}
		setFlashSuccess(e, "Änderungen gespeichert.")
		redirect := fmt.Sprintf("/ort/%s/edit", id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

type ortDeletePayload struct {
	CSRFToken  string `json:"csrf_token"`
	LastEdited string `json:"last_edited"`
}

func (p *OrtEditPage) POSTDelete(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := ortDeletePayload{}
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültige Formulardaten.",
			})
		}

		if err := req.CheckCSRF(payload.CSRFToken); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": err.Error(),
			})
		}

		place, err := dbmodels.Places_ID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Ort wurde nicht gefunden.",
			})
		}

		if payload.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(payload.LastEdited)
			if err != nil {
				return e.JSON(http.StatusBadRequest, map[string]any{
					"error": "Ungültiger Bearbeitungszeitstempel.",
				})
			}
			if !place.Updated().Time().Equal(lastEdited.Time()) {
				return e.JSON(http.StatusConflict, map[string]any{
					"error": "Der Ort wurde inzwischen geändert. Bitte Seite neu laden.",
				})
			}
		}

		entries, err := placeEntries(app, place.Id)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Löschen fehlgeschlagen.",
			})
		}

		if err := app.RunInTransaction(func(tx core.App) error {
			for _, entry := range entries {
				updatedPlaces := []string{}
				for _, placeID := range entry.Places() {
					if placeID != place.Id {
						updatedPlaces = append(updatedPlaces, placeID)
					}
				}
				entry.SetPlaces(updatedPlaces)
				if err := tx.Save(entry); err != nil {
					return err
				}
			}

			record, err := tx.FindRecordById(dbmodels.PLACES_TABLE, place.Id)
			if err != nil {
				return err
			}
			return tx.Delete(record)
		}); err != nil {
			app.Logger().Error("Failed to delete place", "place_id", place.Id, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Löschen fehlgeschlagen.",
			})
		}

		// Delete place from FTS5 and update all affected entries asynchronously
		go func(appInstance core.App, placeID string, affectedEntries []*dbmodels.Entry) {
			if err := dbmodels.DeleteFTS5Place(appInstance, placeID); err != nil {
				appInstance.Logger().Error("Failed to delete place from FTS5", "place_id", placeID, "error", err)
			}

			// Update FTS5 for all entries that had this place
			for _, entry := range affectedEntries {
				if err := updateEntryFTS5(appInstance, entry); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 for entry after place deletion", "entry_id", entry.Id, "error", err)
				}
			}
		}(app, place.Id, entries)

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": "/orte",
		})
	}
}

func placeEntries(app core.App, placeID string) ([]*dbmodels.Entry, error) {
	entries := []*dbmodels.Entry{}
	err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Where(dbx.NewExp(
			dbmodels.PLACES_TABLE+" = {:id} OR (json_valid("+dbmodels.PLACES_TABLE+") = 1 AND EXISTS (SELECT 1 FROM json_each("+dbmodels.PLACES_TABLE+") WHERE value = {:id}))",
			dbx.Params{"id": placeID},
		)).
		All(&entries)
	return entries, err
}

func placeNeighbors(app core.App, currentID string) (*dbmodels.Place, *dbmodels.Place, error) {
	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return nil, nil, err
	}
	if len(places) == 0 {
		return nil, nil, nil
	}
	dbmodels.Sort_Places_Name(places)
	for index, item := range places {
		if item.Id != currentID {
			continue
		}
		var prev *dbmodels.Place
		var next *dbmodels.Place
		if index > 0 {
			prev = places[index-1]
		}
		if index+1 < len(places) {
			next = places[index+1]
		}
		return prev, next, nil
	}
	return nil, nil, nil
}
