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
	pnp := &PersonNewPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_PERSON_NEW_NAME,
			URL:      URL_PERSONEN_NEW,
			Template: TEMPLATE_PERSON_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(pnp)
}

type PersonNewPage struct {
	pagemodels.StaticPage
}

func (p *PersonNewPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_PERSONEN_NEW)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST("", p.POST(engine, app, store))
	return nil
}

func (p *PersonNewPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		return p.renderPage(engine, app, e, req, "")
	}
}

func (p *PersonNewPage) renderPage(engine *templating.Engine, app core.App, e *core.RequestEvent, req *templating.Request, message string) error {
	data := make(map[string]any)

	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		return engine.Response500(e, err, data)
	}
	agent := dbmodels.NewAgent(core.NewRecord(collection))
	agent.SetEditState("Unknown")

	result := &PersonEditResult{
		Agent:          agent,
		User:           nil,
		Prev:           nil,
		Next:           nil,
		Entries:        []*dbmodels.Entry{},
		EntryTypes:     map[string][]string{},
		Contents:       []*dbmodels.Content{},
		ContentEntries: map[string]*dbmodels.Entry{},
		ContentTypes:   map[string][]string{},
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

func (p *PersonNewPage) POST(engine *templating.Engine, app core.App, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)

		formdata := personEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderPage(engine, app, e, req, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderPage(engine, app, e, req, err.Error())
		}

		var createdAgent *dbmodels.Agent
		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			editorID := ""
			if user != nil {
				editorID = user.Id
			}
			agent, err := store.CreateAgent(tx, canonical.AgentInput{
				Name:             formdata.Name,
				Pseudonyms:       formdata.Pseudonyms,
				BiographicalData: formdata.BiographicalData,
				Profession:       formdata.Profession,
				References:       formdata.References,
				Annotation:       formdata.Annotation,
				URI:              formdata.URI,
				CorporateBody:    formdata.CorporateBody,
				Fictional:        formdata.Fictional,
				Status:           formdata.Status,
				Comment:          formdata.Comment,
				EditorID:         editorID,
			})
			if err != nil {
				return err
			}
			createdAgent = agent
			return nil
		}); err != nil {
			app.Logger().Error("Failed to create agent", "error", err)
			return p.renderPage(engine, app, e, req, canonicalErrorMessage(err, "Speichern fehlgeschlagen."))
		}

		if createdAgent == nil {
			return p.renderPage(engine, app, e, req, "Speichern fehlgeschlagen.")
		}

		// Update FTS5 index for agent (no related records for new agent) asynchronously
		go func(appInstance core.App, agentID string) {
			freshAgent, err := dbmodels.Agents_ID(appInstance, agentID)
			if err != nil {
				appInstance.Logger().Error("Failed to load agent for FTS5 update", "agent_id", agentID, "error", err)
				return
			}
			if err := dbmodels.UpdateFTS5Agent(appInstance, freshAgent); err != nil {
				appInstance.Logger().Error("Failed to update FTS5 index for new agent", "agent_id", agentID, "error", err)
			}
		}(app, createdAgent.Id)

		redirect := fmt.Sprintf(URL_PERSON_REDIRECT, createdAgent.Id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
