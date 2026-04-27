package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	musenalmapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	gndprovider "github.com/Theodor-Springmann-Stiftung/musenalm/providers/gnd"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
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
	musenalmapp.Register(pep)
}

type PersonEditPage struct {
	pagemodels.StaticPage
}

func (p *PersonEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_PERSON_EDIT_BASE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_PERSON_EDIT, p.GET(engine, app))
	rg.GET(URL_PERSON_EDIT_SLASH, p.GET(engine, app))
	rg.POST(URL_PERSON_EDIT, p.POST(engine, app, ia, store))
	rg.POST(URL_PERSON_EDIT_SLASH, p.POST(engine, app, ia, store))
	rg.POST(URL_PERSON_STATUS, p.POSTStatus(app, ia, store))
	rg.POST(URL_PERSON_DELETE, p.POSTDelete(engine, app, ia, store))
	return nil
}

type PersonEditResult struct {
	Agent          *dbmodels.Agent
	User           *dbmodels.User
	Prev           *dbmodels.Agent
	Next           *dbmodels.Agent
	PrevMusenalm   *dbmodels.Agent
	NextMusenalm   *dbmodels.Agent
	Entries        []*dbmodels.Entry
	EntryTypes     map[string][]string
	Contents       []*dbmodels.Content
	ContentEntries map[string]*dbmodels.Entry
	ContentTypes   map[string][]string
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
	prevMusenalm, nextMusenalm, err := agentMusenalmNeighbors(app, agent.Id)
	if err != nil {
		app.Logger().Error("Failed to load agent Musenalm neighbors", "agent", agent.Id, "error", err)
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
		Agent:          agent,
		User:           user,
		Prev:           prev,
		Next:           next,
		PrevMusenalm:   prevMusenalm,
		NextMusenalm:   nextMusenalm,
		Entries:        entries,
		EntryTypes:     entryTypes,
		Contents:       contents,
		ContentEntries: contentEntries,
		ContentTypes:   contentTypes,
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
		data["cancel_url"] = cancelURLFromHeader(e)

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
	data["cancel_url"] = cancelURLFromHeader(e)

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

func agentMusenalmNeighbors(app core.App, currentID string) (*dbmodels.Agent, *dbmodels.Agent, error) {
	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
		return nil, nil, err
	}
	if len(agents) == 0 {
		return nil, nil, nil
	}
	sort.Slice(agents, func(i, j int) bool {
		return agents[i].MusenalmID() < agents[j].MusenalmID()
	})
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
	CSRFToken string `json:"csrf_token"`
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
	if user != nil && !user.IsSuperuser {
		editorID := user.Id
		agent.SetEditor(editorID)
	}
}

func (p *PersonEditPage) POST(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
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

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			editorID := req.EditorUserID()
			return store.UpdateAgent(tx, agent, canonical.AgentInput{
				Name:             formdata.Name,
				Pseudonyms:       formdata.Pseudonyms,
				BiographicalData: formdata.BiographicalData,
				Profession:       formdata.Profession,
				References:       formdata.References,
				Annotation:       formdata.Annotation,
				URI:              gndprovider.NormalizeURI(strings.TrimSpace(formdata.URI)),
				CorporateBody:    formdata.CorporateBody,
				Fictional:        formdata.Fictional,
				Status:           formdata.Status,
				Comment:          formdata.Comment,
				EditorID:         editorID,
			}, effects)
		}); err != nil {
			app.Logger().Error("Failed to save agent", "agent_id", agent.Id, "error", err)
			return p.renderError(engine, app, e, canonicalErrorMessage(err, "Speichern fehlgeschlagen."), &formdata)
		}

		if musenalmApp, ok := ia.(*musenalmapp.App); ok {
			musenalmApp.ScheduleAgentGNDRefresh(agent.Id)
		}

		if strings.TrimSpace(formdata.SaveAction) == "view" {
			redirect := fmt.Sprintf(URL_PERSON_VIEW_FORMAT, strconv.Itoa(agent.MusenalmID()))
			return e.Redirect(http.StatusSeeOther, redirect)
		}
		setFlashSuccess(e, "Änderungen gespeichert.")
		redirect := fmt.Sprintf(URL_PERSON_EDIT_FORMAT, id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *PersonEditPage) POSTStatus(app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
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

		agent, err := dbmodels.Agents_ID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Person wurde nicht gefunden.",
			})
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.UpdateAgentStatus(tx, agent, payload.Status, req.EditorUserID(), effects)
		}); err != nil {
			app.Logger().Error("Failed to update agent status", "agent_id", agent.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Status konnte nicht gespeichert werden."),
			})
		}

		freshAgent, freshErr := dbmodels.Agents_ID(app, id)
		if freshErr == nil && freshAgent != nil {
			agent = freshAgent
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":     true,
			"status":      agent.EditState(),
			"last_edited": agent.Updated().Time().Format(time.RFC3339Nano),
		})
	}
}

func (p *PersonEditPage) POSTDelete(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
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

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.DeleteAgent(tx, agent, canonical.DeleteOptions{}, effects)
		}); err != nil {
			app.Logger().Error("Failed to delete agent", "agent_id", agent.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Löschen fehlgeschlagen."),
			})
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": URL_PERSONEN_REDIRECT,
		})
	}
}
