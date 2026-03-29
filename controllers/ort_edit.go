package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
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
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_ORT)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ORT_EDIT, p.GET(engine, app))
	rg.POST(URL_ORT_EDIT, p.POST(engine, app, ia, store))
	rg.POST(URL_ORT_STATUS, p.POSTStatus(app, ia, store))
	rg.POST(URL_ORT_DELETE, p.POSTDelete(engine, app, ia, store))
	return nil
}

type OrtEditResult struct {
	Place        *dbmodels.Place
	User         *dbmodels.User
	Prev         *dbmodels.Place
	Next         *dbmodels.Place
	PrevMusenalm *dbmodels.Place
	NextMusenalm *dbmodels.Place
	Entries      []*dbmodels.Entry
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
	prevMusenalm, nextMusenalm, err := placeMusenalmNeighbors(app, place.Id)
	if err != nil {
		app.Logger().Error("Failed to load place Musenalm neighbors", "place", place.Id, "error", err)
	}

	entries, err := placeEntries(app, place.Id)
	if err != nil {
		app.Logger().Error("Failed to load place entries", "place", place.Id, "error", err)
	}
	if len(entries) > 0 {
		dbmodels.Sort_Entries_Year_Title(entries)
	}

	return &OrtEditResult{
		Place:        place,
		User:         user,
		Prev:         prev,
		Next:         next,
		PrevMusenalm: prevMusenalm,
		NextMusenalm: nextMusenalm,
		Entries:      entries,
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
	if user != nil && !user.IsSuperuser {
		editorID := user.Id
		place.SetEditor(editorID)
	}
}

func (p *OrtEditPage) POST(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
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

		expectedUpdatedAt, err := parseExpectedUpdatedAt(formdata.LastEdited)
		if err != nil {
			return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.", &formdata)
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			editorID := req.EditorUserID()
			return store.UpdatePlace(tx, place, canonical.PlaceInput{
				Name:              formdata.Name,
				Pseudonyms:        formdata.Pseudonyms,
				Annotation:        formdata.Annotation,
				URI:               formdata.URI,
				Fictional:         formdata.Fictional,
				Status:            formdata.Status,
				Comment:           formdata.Comment,
				EditorID:          editorID,
				ExpectedUpdatedAt: expectedUpdatedAt,
			}, effects)
		}); err != nil {
			app.Logger().Error("Failed to save place", "place_id", place.Id, "error", err)
			return p.renderError(engine, app, e, canonicalErrorMessage(err, "Speichern fehlgeschlagen."), &formdata)
		}

		if strings.TrimSpace(formdata.SaveAction) == "view" {
			redirect := fmt.Sprintf(URL_REIHEN_PLACE_FILTER, strconv.Itoa(place.MusenalmID()))
			return e.Redirect(http.StatusSeeOther, redirect)
		}
		setFlashSuccess(e, "Änderungen gespeichert.")
		redirect := fmt.Sprintf(URL_ORT_EDIT_FORMAT, id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *OrtEditPage) POSTStatus(app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := statusUpdatePayload{}
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

		expectedUpdatedAt, err := parseExpectedUpdatedAt(payload.LastEdited)
		if err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültiger Bearbeitungszeitstempel.",
			})
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.UpdatePlaceStatus(tx, place, payload.Status, req.EditorUserID(), expectedUpdatedAt, effects)
		}); err != nil {
			app.Logger().Error("Failed to update place status", "place_id", place.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Status konnte nicht gespeichert werden."),
			})
		}

		freshPlace, freshErr := dbmodels.Places_ID(app, id)
		if freshErr == nil && freshPlace != nil {
			place = freshPlace
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":     true,
			"status":      place.EditState(),
			"last_edited": place.Updated().Time().Format(time.RFC3339Nano),
		})
	}
}

type ortDeletePayload struct {
	CSRFToken  string `json:"csrf_token"`
	LastEdited string `json:"last_edited"`
}

func (p *OrtEditPage) POSTDelete(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
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

		expectedUpdatedAt, err := parseExpectedUpdatedAt(payload.LastEdited)
		if err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültiger Bearbeitungszeitstempel.",
			})
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.DeletePlace(tx, place, canonical.DeleteOptions{ExpectedUpdatedAt: expectedUpdatedAt}, effects)
		}); err != nil {
			app.Logger().Error("Failed to delete place", "place_id", place.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Löschen fehlgeschlagen."),
			})
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": URL_ORTE_REDIRECT,
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

func placeMusenalmNeighbors(app core.App, currentID string) (*dbmodels.Place, *dbmodels.Place, error) {
	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return nil, nil, err
	}
	if len(places) == 0 {
		return nil, nil, nil
	}
	sort.Slice(places, func(i, j int) bool {
		return places[i].MusenalmID() < places[j].MusenalmID()
	})
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
