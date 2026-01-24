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
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_PERSON_EDIT       = "edit"
	URL_PERSON_EDIT_SLASH = "edit/"
	TEMPLATE_PERSON_EDIT  = "/person/edit/"
)

func init() {
	pep := &PersonEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_PERSON_EDIT_NAME,
			URL:      URL_PERSON_EDIT,
			Template: TEMPLATE_PERSON_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(pep)
}

type PersonEditPage struct {
	pagemodels.StaticPage
}

func (p *PersonEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group("/person/{id}/")
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_PERSON_EDIT, p.GET(engine, app))
	rg.GET(URL_PERSON_EDIT_SLASH, p.GET(engine, app))
	rg.POST(URL_PERSON_EDIT, p.POST(engine, app))
	rg.POST(URL_PERSON_EDIT_SLASH, p.POST(engine, app))
	rg.POST(URL_PERSON_EDIT+"/delete", p.POSTDelete(engine, app))
	return nil
}

type PersonEditResult struct {
	Agent *dbmodels.Agent
	User  *dbmodels.User
	Prev  *dbmodels.Agent
	Next  *dbmodels.Agent
	Entries []*dbmodels.Entry
	EntryTypes map[string][]string
	Contents []*dbmodels.Content
	ContentEntries map[string]*dbmodels.Entry
	ContentTypes map[string][]string
}

func NewPersonEditResult(app core.App, id string) (*PersonEditResult, error) {
	agent, err := dbmodels.Agents_ID(app, id)
	if err != nil {
		return nil, err
	}

	var user *dbmodels.User
	if agent.Editor() != "" {
		u, err := dbmodels.Users_ID(app, agent.Editor())
		if err == nil {
			user = u
		} else {
			app.Logger().Error("Failed to load user for agent editor", "agent", agent.Id, "error", err)
		}
	}

	prev, next, err := agentNeighbors(app, agent.Id)
	if err != nil {
		app.Logger().Error("Failed to load agent neighbors", "agent", agent.Id, "error", err)
	}

	entries, entryTypes, err := agentEntries(app, agent.Id)
	if err != nil {
		app.Logger().Error("Failed to load agent entries", "agent", agent.Id, "error", err)
	}
	if len(entries) > 0 {
		dbmodels.Sort_Entries_Year_Title(entries)
	}

	contents, contentEntries, contentTypes, err := agentContentsDetails(app, agent.Id)
	if err != nil {
		app.Logger().Error("Failed to load agent contents", "agent", agent.Id, "error", err)
	}
	if len(contents) > 0 {
		dbmodels.Sort_Contents_Numbering(contents)
	}

	return &PersonEditResult{
		Agent:   agent,
		User:    user,
		Prev:    prev,
		Next:    next,
		Entries: entries,
		EntryTypes: entryTypes,
		Contents: contents,
		ContentEntries: contentEntries,
		ContentTypes: contentTypes,
	}, nil
}

func (p *PersonEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		result, err := NewPersonEditResult(app, id)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["result"] = result

		req := templating.NewRequest(e)
		data["csrf_token"] = req.Session().Token

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *PersonEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string, formdata *personEditForm) error {
	id := e.Request.PathValue("id")
	data := make(map[string]any)
	result, err := NewPersonEditResult(app, id)
	if err != nil {
		return engine.Response404(e, err, data)
	}
	if formdata != nil && result != nil && result.Agent != nil {
		name := strings.TrimSpace(formdata.Name)
		status := strings.TrimSpace(formdata.Status)
		applyPersonForm(result.Agent, *formdata, name, status, nil)
	}
	data["result"] = result
	data["error"] = message

	req := templating.NewRequest(e)
	data["csrf_token"] = req.Session().Token

	return engine.Response200(e, p.Template, data, p.Layout)
}

func agentNeighbors(app core.App, currentID string) (*dbmodels.Agent, *dbmodels.Agent, error) {
	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
		return nil, nil, err
	}
	if len(agents) == 0 {
		return nil, nil, nil
	}
	dbmodels.Sort_Agents_Name(agents)
	for index, item := range agents {
		if item.Id != currentID {
			continue
		}
		var prev *dbmodels.Agent
		var next *dbmodels.Agent
		if index > 0 {
			prev = agents[index-1]
		}
		if index+1 < len(agents) {
			next = agents[index+1]
		}
		return prev, next, nil
	}
	return nil, nil, nil
}

func agentEntries(app core.App, agentID string) ([]*dbmodels.Entry, map[string][]string, error) {
	relations, err := dbmodels.REntriesAgents_Agent(app, agentID)
	if err != nil {
		return nil, nil, err
	}
	if len(relations) == 0 {
		return []*dbmodels.Entry{}, map[string][]string{}, nil
	}
	entryIds := make([]any, 0, len(relations))
	typeMap := make(map[string][]string)
	for _, relation := range relations {
		entryIds = append(entryIds, relation.Entry())
		typeMap[relation.Entry()] = append(typeMap[relation.Entry()], relation.Type())
	}
	entries, err := dbmodels.Entries_IDs(app, entryIds)
	if err != nil {
		return nil, typeMap, err
	}
	return entries, typeMap, nil
}

func agentContentsDetails(app core.App, agentID string) ([]*dbmodels.Content, map[string]*dbmodels.Entry, map[string][]string, error) {
	relations, err := dbmodels.RContentsAgents_Agent(app, agentID)
	if err != nil {
		return nil, nil, nil, err
	}
	if len(relations) == 0 {
		return []*dbmodels.Content{}, map[string]*dbmodels.Entry{}, map[string][]string{}, nil
	}

	contentIDs := make([]any, 0, len(relations))
	typeMap := make(map[string][]string)
	for _, relation := range relations {
		contentIDs = append(contentIDs, relation.Content())
		typeMap[relation.Content()] = append(typeMap[relation.Content()], relation.Type())
	}

	contents, err := dbmodels.Contents_IDs(app, contentIDs)
	if err != nil {
		return nil, nil, nil, err
	}

	entryIDs := []any{}
	for _, content := range contents {
		entryIDs = append(entryIDs, content.Entry())
	}

	entries, err := dbmodels.Entries_IDs(app, entryIDs)
	if err != nil {
		return contents, map[string]*dbmodels.Entry{}, typeMap, nil
	}

	entryMap := make(map[string]*dbmodels.Entry, len(entries))
	for _, entry := range entries {
		entryMap[entry.Id] = entry
	}

	return contents, entryMap, typeMap, nil
}

type personEditForm struct {
	CSRFToken        string `form:"csrf_token"`
	LastEdited       string `form:"last_edited"`
	SaveAction       string `form:"save_action"`
	Name             string `form:"name"`
	Pseudonyms       string `form:"pseudonyms"`
	BiographicalData string `form:"biographical_data"`
	Profession       string `form:"profession"`
	References       string `form:"references"`
	Annotation       string `form:"annotation"`
	URI              string `form:"uri"`
	CorporateBody    bool   `form:"corporate_body"`
	Fictional        bool   `form:"fictional"`
	Status           string `form:"status"`
	Comment          string `form:"edit_comment"`
}

type personDeletePayload struct {
	CSRFToken  string `json:"csrf_token"`
	LastEdited string `json:"last_edited"`
}

func applyPersonForm(agent *dbmodels.Agent, formdata personEditForm, name string, status string, user *dbmodels.FixedUser) {
	agent.SetName(name)
	agent.SetPseudonyms(strings.TrimSpace(formdata.Pseudonyms))
	agent.SetBiographicalData(strings.TrimSpace(formdata.BiographicalData))
	agent.SetProfession(strings.TrimSpace(formdata.Profession))
	agent.SetReferences(strings.TrimSpace(formdata.References))
	agent.SetAnnotation(strings.TrimSpace(formdata.Annotation))
	agent.SetURI(strings.TrimSpace(formdata.URI))
	agent.SetCorporateBody(formdata.CorporateBody)
	agent.SetFictional(formdata.Fictional)
	agent.SetEditState(status)
	agent.SetComment(strings.TrimSpace(formdata.Comment))
	if user != nil {
		agent.SetEditor(user.Id)
	}
}

func (p *PersonEditPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		formdata := personEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.", nil)
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderError(engine, app, e, err.Error(), &formdata)
		}

		agent, err := dbmodels.Agents_ID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		if formdata.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(formdata.LastEdited)
			if err != nil {
				return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.", &formdata)
			}
			if !agent.Updated().Time().Equal(lastEdited.Time()) {
				return p.renderError(engine, app, e, "Die Person wurde inzwischen geändert. Bitte Seite neu laden.", &formdata)
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

		// Capture old name (entries and contents depend on agent name)
		oldName := agent.Name()

		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			applyPersonForm(agent, formdata, name, status, user)
			return tx.Save(agent)
		}); err != nil {
			app.Logger().Error("Failed to save agent", "agent_id", agent.Id, "error", err)
			return p.renderError(engine, app, e, "Speichern fehlgeschlagen.", &formdata)
		}

		// Check if name changed (entries and contents store agent name)
		nameChanged := agent.Name() != oldName

		// Update FTS5 index for agent and conditionally update related entries/contents asynchronously
		go func(appInstance core.App, agentID string, updateRelated bool) {
			freshAgent, err := dbmodels.Agents_ID(appInstance, agentID)
			if err != nil {
				appInstance.Logger().Error("Failed to load agent for FTS5 update", "agent_id", agentID, "error", err)
				return
			}
			// If name changed, update agent + entries + contents. Otherwise just update agent.
			if updateRelated {
				if err := dbmodels.UpdateFTS5AgentAndRelated(appInstance, freshAgent); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 index for agent and related records", "agent_id", agentID, "error", err)
				}
			} else {
				if err := dbmodels.UpdateFTS5Agent(appInstance, freshAgent); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 index for agent", "agent_id", agentID, "error", err)
				}
			}
		}(app, agent.Id, nameChanged)

		if strings.TrimSpace(formdata.SaveAction) == "view" {
			redirect := fmt.Sprintf("/person/%s", id)
			return e.Redirect(http.StatusSeeOther, redirect)
		}
		setFlashSuccess(e, "Änderungen gespeichert.")
		redirect := fmt.Sprintf("/person/%s/edit/", id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *PersonEditPage) POSTDelete(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := personDeletePayload{}
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

		agent, err := dbmodels.Agents_ID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Person wurde nicht gefunden.",
			})
		}

		if payload.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(payload.LastEdited)
			if err != nil {
				return e.JSON(http.StatusBadRequest, map[string]any{
					"error": "Ungültiger Bearbeitungszeitstempel.",
				})
			}
			if !agent.Updated().Time().Equal(lastEdited.Time()) {
				return e.JSON(http.StatusConflict, map[string]any{
					"error": "Die Person wurde inzwischen geändert. Bitte Seite neu laden.",
				})
			}
		}

		if err := app.RunInTransaction(func(tx core.App) error {
			if err := deleteAgentRelations(tx, agent.Id); err != nil {
				return err
			}
			record, err := tx.FindRecordById(dbmodels.AGENTS_TABLE, agent.Id)
			if err != nil {
				return err
			}
			return tx.Delete(record)
		}); err != nil {
			app.Logger().Error("Failed to delete agent", "agent_id", agent.Id, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Löschen fehlgeschlagen.",
			})
		}

		// Delete from FTS5 index asynchronously
		go func(appInstance core.App, agentID string) {
			if err := dbmodels.DeleteFTS5Agent(appInstance, agentID); err != nil {
				appInstance.Logger().Error("Failed to delete FTS5 agent", "agent_id", agentID, "error", err)
			}
		}(app, agent.Id)

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": "/personen/",
		})
	}
}

func deleteAgentRelations(tx core.App, agentID string) error {
	// Delete all REntriesAgents relations
	entryRelations, err := dbmodels.REntriesAgents_Agent(tx, agentID)
	if err != nil {
		return err
	}
	entryTable := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)
	for _, relation := range entryRelations {
		record, err := tx.FindRecordById(entryTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	// Delete all RContentsAgents relations
	contentRelations, err := dbmodels.RContentsAgents_Agent(tx, agentID)
	if err != nil {
		return err
	}
	contentTable := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
	for _, relation := range contentRelations {
		record, err := tx.FindRecordById(contentTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	return nil
}
