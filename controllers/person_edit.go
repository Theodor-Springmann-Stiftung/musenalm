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
	URL_PERSON_EDIT      = "edit"
	TEMPLATE_PERSON_EDIT = "/person/edit/"
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

func (p *PersonEditPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group("/person/{id}/")
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_PERSON_EDIT, p.GET(engine, app))
	rg.POST(URL_PERSON_EDIT, p.POST(engine, app))
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

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *PersonEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string) error {
	id := e.Request.PathValue("id")
	data := make(map[string]any)
	result, err := NewPersonEditResult(app, id)
	if err != nil {
		return engine.Response404(e, err, data)
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
			return p.renderError(engine, app, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderError(engine, app, e, err.Error())
		}

		agent, err := dbmodels.Agents_ID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		if formdata.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(formdata.LastEdited)
			if err != nil {
				return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.")
			}
			if !agent.Updated().Time().Equal(lastEdited.Time()) {
				return p.renderError(engine, app, e, "Die Person wurde inzwischen geändert. Bitte Seite neu laden.")
			}
		}

		name := strings.TrimSpace(formdata.Name)
		if name == "" {
			return p.renderError(engine, app, e, "Name ist erforderlich.")
		}

		status := strings.TrimSpace(formdata.Status)
		if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
			return p.renderError(engine, app, e, "Ungültiger Status.")
		}

		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			applyPersonForm(agent, formdata, name, status, user)
			return tx.Save(agent)
		}); err != nil {
			app.Logger().Error("Failed to save agent", "agent_id", agent.Id, "error", err)
			return p.renderError(engine, app, e, "Speichern fehlgeschlagen.")
		}

		// Update FTS5 index for agent and all related entries/contents asynchronously
		go func(appInstance core.App, agentID string) {
			freshAgent, err := dbmodels.Agents_ID(appInstance, agentID)
			if err != nil {
				appInstance.Logger().Error("Failed to load agent for FTS5 update", "agent_id", agentID, "error", err)
				return
			}
			if err := dbmodels.UpdateFTS5AgentAndRelated(appInstance, freshAgent); err != nil {
				appInstance.Logger().Error("Failed to update FTS5 index for agent and related records", "agent_id", agentID, "error", err)
			}
		}(app, agent.Id)

		redirect := fmt.Sprintf("/person/%s/edit?saved_message=%s", id, url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
