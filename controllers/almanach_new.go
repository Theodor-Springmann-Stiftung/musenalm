package controllers

import (
	"net/http"
	"net/url"
	"strconv"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ALMANACH_NEW      = "/almanach-new/"
	URL_ALMANACH_NEW_SAVE = "save"
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

func (p *AlmanachNewPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_ALMANACH_NEW)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST(URL_ALMANACH_NEW_SAVE, p.POSTSave(engine, app))
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
			User: nil,
			AlmanachResult: AlmanachResult{
				Entry:          entry,
				Places:         []*dbmodels.Place{},
				Series:         []*dbmodels.Series{},
				Contents:       []*dbmodels.Content{},
				Items:          []*dbmodels.Item{},
				Agents:         map[string]*dbmodels.Agent{},
				EntriesSeries:  map[string]*dbmodels.REntriesSeries{},
				EntriesAgents:  []*dbmodels.REntriesAgents{},
				ContentsAgents: map[string][]*dbmodels.RContentsAgents{},
				Types:          []string{},
				HasScans:       false,
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

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *AlmanachNewPage) POSTSave(engine *templating.Engine, app core.App) HandleFunc {
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

		if err := payload.Validate(); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": err.Error(),
			})
		}

		var entry *dbmodels.Entry
		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			collection, err := tx.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
			if err != nil {
				return err
			}
			newEntry := dbmodels.NewEntry(core.NewRecord(collection))
			nextID, err := nextEntryMusenalmID(tx)
			if err != nil {
				return err
			}
			newEntry.SetMusenalmID(nextID)

			if err := applyEntryChanges(tx, newEntry, &payload, user); err != nil {
				return err
			}
			if err := applyItemsChanges(tx, newEntry, &payload); err != nil {
				return err
			}
			if err := applySeriesRelations(tx, newEntry, &payload); err != nil {
				return err
			}
			if err := applyAgentRelations(tx, newEntry, &payload); err != nil {
				return err
			}

			entry = newEntry
			return nil
		}); err != nil {
			app.Logger().Error("Failed to create almanach entry", "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Speichern fehlgeschlagen.",
			})
		}

		// Invalidate sorted entries cache since new entry was created
		InvalidateSortedEntriesCache()

		// Update FTS5 index asynchronously
		go func(appInstance core.App, entryID string) {
			freshEntry, err := dbmodels.Entries_ID(appInstance, entryID)
			if err != nil {
				appInstance.Logger().Error("Failed to load entry for FTS5 update", "entry_id", entryID, "error", err)
				return
			}
			if err := updateEntryFTS5(appInstance, freshEntry); err != nil {
				appInstance.Logger().Error("Failed to update FTS5 index for new entry", "entry_id", entryID, "error", err)
			}
		}(app, entry.Id)

		redirect := "/"
		if entry != nil {
			redirect = "/almanach/" + strconv.Itoa(entry.MusenalmID()) + "/edit?saved_message=" + url.QueryEscape("Änderungen gespeichert.")
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
