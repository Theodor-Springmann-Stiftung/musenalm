package controllers

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	musapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/functions"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
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
	musapp.Register(ep)
}

type AlmanachEditPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_ALMANACH_ADMIN_BASE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ALMANACH_EDIT, p.GET(engine, app, ia))
	rg.POST(URL_ALMANACH_STATUS, p.POSTStatus(app, ia, store))
	rg.POST(URL_ALMANACH_EDIT+"save", p.POSTSave(engine, app, ia, store))
	rg.POST(URL_ALMANACH_EDIT+"delete", p.POSTDelete(engine, app, ia, store))
	return nil
}

func (p *AlmanachEditPage) GET(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		data := make(map[string]any)
		filters := NewBeitraegeFilterParameters(e)
		displayApp, _ := ma.(*musapp.App)
		result, err := NewAlmanachEditResult(app, displayApp, id, filters)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["filters"] = filters
		data["csrf_token"] = req.Session().Token
		data["item_types"] = dbmodels.ITEM_TYPE_VALUES
		data["agent_relations"] = dbmodels.AGENT_RELATIONS
		data["language_options"] = dbmodels.LANGUAGE_VALUES
		if allPlaces, err := dbmodels.Places_All(app); err == nil {
			dbmodels.Sort_Places_Name(allPlaces)
			data["place_options"] = allPlaces
		}
		data["cancel_url"] = cancelURLFromHeader(e)

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

type AlmanachEditResult struct {
	NextByID    *dbmodels.Entry
	PrevByID    *dbmodels.Entry
	NextByTitle *dbmodels.Entry
	PrevByTitle *dbmodels.Entry
	User        *dbmodels.User
	Series      []*dbmodels.Series
	Places      []*dbmodels.Place
	Agents      map[string]*dbmodels.Agent
	AlmanachResult
}

func NewAlmanachEditResult(app core.App, displayApp *musapp.App, id string, filters BeitraegeFilterParameters) (*AlmanachEditResult, error) {
	result, err := NewAlmanachResult(app, id, filters)
	if err != nil {
		return nil, err
	}
	result.ContentAgentDisplays = buildContentAgentDisplays(result.Contents, result.ContentsAgents, displayApp)
	result.ActiveContentNumberReservation, err = dbmodels.ActiveContentNumberReservationForEntry(app, result.Entry.Id)
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

	prevByID := result.Entry.Prev(app)
	nextByID := result.Entry.Next(app)
	prevByTitle, nextByTitle, err := entryNeighborsByPreferredTitle(app, result.Entry.Id)
	if err != nil {
		app.Logger().Error("Failed to load entry neighbors", "entry", result.Entry.Id, "error", err)
	}

	series := []*dbmodels.Series{}
	{
		sids := make([]any, 0, len(result.SeriesRelations)+1)
		if sid := result.Entry.Series(); sid != "" {
			sids = append(sids, sid)
		}
		for _, rel := range result.SeriesRelations {
			if rel != nil && rel.Series() != "" {
				sids = append(sids, rel.Series())
			}
		}
		if len(sids) > 0 {
			series, err = dbmodels.Series_IDs(app, sids)
			if err != nil {
				return nil, err
			}
			dbmodels.Sort_Series_Title(series)
		}
	}

	places := []*dbmodels.Place{}
	if placeIDs := result.Entry.Places(); len(placeIDs) > 0 {
		placeIDsAny := make([]any, 0, len(placeIDs))
		for _, placeID := range placeIDs {
			placeIDsAny = append(placeIDsAny, placeID)
		}
		places, err = dbmodels.Places_IDs(app, placeIDsAny)
		if err != nil {
			return nil, err
		}
		dbmodels.Sort_Places_Name(places)
	}

	agents := map[string]*dbmodels.Agent{}
	if len(result.EntriesAgents) > 0 {
		aids := make([]any, 0, len(result.EntriesAgents))
		for _, rel := range result.EntriesAgents {
			if rel != nil && rel.Agent() != "" {
				aids = append(aids, rel.Agent())
			}
		}
		if len(aids) > 0 {
			loadedAgents, err := dbmodels.Agents_IDs(app, aids)
			if err != nil {
				return nil, err
			}
			for _, agent := range loadedAgents {
				agents[agent.Id] = agent
			}
		}
	}

	return &AlmanachEditResult{
		User:           user,
		Series:         series,
		Places:         places,
		Agents:         agents,
		AlmanachResult: *result,
		NextByID:       nextByID,
		PrevByID:       prevByID,
		NextByTitle:    nextByTitle,
		PrevByTitle:    prevByTitle,
	}, nil
}

func (p *AlmanachEditPage) POSTSave(engine *templating.Engine, app core.App, ma pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := almanachEditPayload{}
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

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Band wurde nicht gefunden.",
			})
		}

		user := req.User()
		if err := runCanonicalMutation(app, ma, func(tx core.App, effects *canonical.MutationEffects) error {
			editorID := req.EditorUserID()
			entryInput := canonicalEntryInput(&payload, editorID)
			if err := store.UpdateEntry(tx, entry, entryInput, effects); err != nil {
				return err
			}
			if err := store.SaveEntryItems(tx, entry, canonicalItemInputs(payload.Items), payload.DeletedItemIDs); err != nil {
				return err
			}
			if err := store.SaveEntrySeriesRelations(tx, entry, payload.PreferredSeriesID, canonicalEntrySeriesRelationInputs(payload.SeriesRelations), canonicalNewEntrySeriesRelationInputs(payload.NewSeriesRelations), payload.DeletedSeriesRelationIDs, effects); err != nil {
				return err
			}
			if err := store.SaveEntryAgentRelations(tx, entry, canonicalRelationInputs(payload.AgentRelations), canonicalNewRelationInputs(payload.NewAgentRelations), payload.DeletedAgentRelationIDs, effects); err != nil {
				return err
			}
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save almanach entry", "entry_id", entry.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Speichern fehlgeschlagen."),
			})
		}

		freshEntry, err := dbmodels.Entries_MusenalmID(app, id)
		if err == nil {
			entry = freshEntry
		}

		updatedInfo := map[string]string{
			"raw":  entry.Updated().Time().Format(time.RFC3339Nano),
			"date": functions.GermanDate(entry.Updated()),
			"time": functions.GermanTime(entry.Updated()),
		}
		if user != nil && strings.TrimSpace(user.Name) != "" {
			updatedInfo["user"] = user.Name
		}

		setFlashSuccess(e, "Änderungen gespeichert.")
		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"message":  "Änderungen gespeichert.",
			"updated":  updatedInfo,
			"redirect": fmt.Sprintf(URL_ALMANACH_VIEW_FORMAT, id),
		})
	}
}

func (p *AlmanachEditPage) POSTStatus(app core.App, ma pagemodels.IApp, store *canonical.Store) HandleFunc {
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

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Band wurde nicht gefunden.",
			})
		}

		if err := runCanonicalMutation(app, ma, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.UpdateEntryStatus(tx, entry, payload.Status, req.EditorUserID(), effects)
		}); err != nil {
			app.Logger().Error("Failed to update almanach status", "entry_id", entry.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Status konnte nicht gespeichert werden."),
			})
		}

		freshEntry, freshErr := dbmodels.Entries_MusenalmID(app, id)
		if freshErr == nil && freshEntry != nil {
			entry = freshEntry
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":     true,
			"status":      entry.EditState(),
			"last_edited": entry.Updated().Time().Format(time.RFC3339Nano),
		})
	}
}

func (p *AlmanachEditPage) POSTDelete(engine *templating.Engine, app core.App, ma pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := almanachDeletePayload{}
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

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Band wurde nicht gefunden.",
			})
		}

		if err := runCanonicalMutation(app, ma, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.DeleteEntry(tx, entry, canonical.DeleteOptions{}, effects)
		}); err != nil {
			app.Logger().Error("Failed to delete almanach entry", "entry_id", entry.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Löschen fehlgeschlagen."),
			})
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": URL_ALMANACH_REIHEN_REDIRECT,
		})
	}
}

type almanachEditPayload struct {
	CSRFToken                string                             `json:"csrf_token"`
	Entry                    almanachEntryPayload               `json:"entry"`
	Languages                []string                           `json:"languages"`
	Places                   []string                           `json:"places"`
	PreferredSeriesID        string                             `json:"preferred_series_id"`
	Items                    []almanachItemPayload              `json:"items"`
	DeletedItemIDs           []string                           `json:"deleted_item_ids"`
	SeriesRelations          []almanachSeriesRelationPayload    `json:"series_relations"`
	NewSeriesRelations       []almanachNewSeriesRelationPayload `json:"new_series_relations"`
	DeletedSeriesRelationIDs []string                           `json:"deleted_series_relation_ids"`
	AgentRelations           []almanachRelationPayload          `json:"agent_relations"`
	NewAgentRelations        []almanachNewRelationPayload       `json:"new_agent_relations"`
	DeletedAgentRelationIDs  []string                           `json:"deleted_agent_relation_ids"`
}

type almanachDeletePayload struct {
	CSRFToken string `json:"csrf_token" form:"csrf_token"`
}

type almanachEntryPayload struct {
	PreferredTitle          string `json:"preferred_title"`
	Title                   string `json:"title"`
	ParallelTitle           string `json:"parallel_title"`
	Subtitle                string `json:"subtitle"`
	VariantTitle            string `json:"variant_title"`
	Incipit                 string `json:"incipit"`
	ResponsibilityStatement string `json:"responsibility_statement"`
	Pseudonym               bool   `json:"pseudonym"`
	PublicationStatement    string `json:"publication_statement"`
	PlaceStatement          string `json:"place_statement"`
	Edition                 string `json:"edition"`
	Annotation              string `json:"annotation"`
	EditComment             string `json:"edit_comment"`
	Extent                  string `json:"extent"`
	Dimensions              string `json:"dimensions"`
	References              string `json:"references"`
	Status                  string `json:"status"`
	Year                    *int   `json:"year"`
}

type almanachItemPayload struct {
	ID         string   `json:"id"`
	Owner      string   `json:"owner"`
	Identifier string   `json:"identifier"`
	Location   string   `json:"location"`
	Media      []string `json:"media"`
	Annotation string   `json:"annotation"`
	URI        string   `json:"uri"`
	Public     bool     `json:"public"`
	Basis      bool     `json:"basis"`
}

type almanachRelationPayload struct {
	ID        string `json:"id"`
	TargetID  string `json:"target_id"`
	Type      string `json:"type"`
	Uncertain bool   `json:"uncertain"`
}

type almanachNewRelationPayload struct {
	TargetID  string `json:"target_id"`
	Type      string `json:"type"`
	Uncertain bool   `json:"uncertain"`
}

type almanachSeriesRelationPayload struct {
	ID         string `json:"id"`
	TargetID   string `json:"target_id"`
	Annotation string `json:"annotation"`
}

type almanachNewSeriesRelationPayload struct {
	TargetID   string `json:"target_id"`
	Annotation string `json:"annotation"`
}
