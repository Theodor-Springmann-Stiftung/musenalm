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
	anp := &AlmanachNewPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ALMANACH_NEW_NAME,
			URL:      URL_ALMANACH_NEW,
			Template: TEMPLATE_ALMANACH_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(anp)
}

type AlmanachNewPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachNewPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_ALMANACH_NEW)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST(URL_ALMANACH_NEW_SAVE, p.POSTSave(engine, app, ia, store))
	return nil
}

func (p *AlmanachNewPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		data := make(map[string]any)

		entry, err := newEmptyEntry(app)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		filters := NewBeitraegeFilterParameters(e)
		result := &AlmanachEditResult{
			User:   nil,
			Series: []*dbmodels.Series{},
			Places: []*dbmodels.Place{},
			Agents: map[string]*dbmodels.Agent{},
			AlmanachResult: AlmanachResult{
				Entry:           entry,
				SeriesRelations: []*dbmodels.REntriesSeries{},
				Contents:        []*dbmodels.Content{},
				Items:           []*dbmodels.Item{},
				EntriesSeries:   map[string]*dbmodels.REntriesSeries{},
				EntriesAgents:   []*dbmodels.REntriesAgents{},
				ContentsAgents:  map[string][]*dbmodels.RContentsAgents{},
				Types:           []string{},
				HasScans:        false,
			},
			PrevByID:    nil,
			NextByID:    nil,
			PrevByTitle: nil,
			NextByTitle: nil,
		}

		data["result"] = result
		data["filters"] = filters
		data["csrf_token"] = req.Session().Token
		data["item_types"] = dbmodels.ITEM_TYPE_VALUES
		data["agent_relations"] = dbmodels.AGENT_RELATIONS
		data["series_relations"] = dbmodels.SERIES_RELATIONS
		data["is_new"] = true
		data["cancel_url"] = cancelURLFromHeader(e)

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *AlmanachNewPage) POSTSave(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
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

		var entry *dbmodels.Entry
		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			editorID := req.EditorUserID()
			newEntry, err := store.CreateEntry(tx, canonicalEntryInput(&payload, editorID), effects)
			if err != nil {
				return err
			}
			if err := store.SaveEntryItems(tx, newEntry, canonicalItemInputs(payload.Items), payload.DeletedItemIDs); err != nil {
				return err
			}
			if err := store.SaveEntrySeriesRelations(tx, newEntry, canonicalRelationInputs(payload.SeriesRelations), canonicalNewRelationInputs(payload.NewSeriesRelations), payload.DeletedSeriesRelationIDs, effects); err != nil {
				return err
			}
			if err := store.SaveEntryAgentRelations(tx, newEntry, canonicalRelationInputs(payload.AgentRelations), canonicalNewRelationInputs(payload.NewAgentRelations), payload.DeletedAgentRelationIDs, effects); err != nil {
				return err
			}

			entry = newEntry
			return nil
		}); err != nil {
			app.Logger().Error("Failed to create almanach entry", "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Speichern fehlgeschlagen."),
			})
		}

		redirect := URL_HOME
		if entry != nil {
			redirect = fmt.Sprintf(URL_ALMANACH_VIEW, entry.MusenalmID())
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": redirect,
		})
	}
}

func newEmptyEntry(app core.App) (*dbmodels.Entry, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		return nil, err
	}
	entry := dbmodels.NewEntry(core.NewRecord(collection))
	entry.SetEditState("Unknown")
	return entry, nil
}
