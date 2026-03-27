package controllers

import (
	"fmt"
	"maps"
	"net/http"
	"net/url"
	"slices"
	"sort"
	"strings"
	"time"

	musapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	ep := &AlmanachContentsEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ALMANACH_CONTENTS_EDIT_NAME,
			URL:      URL_ALMANACH_CONTENTS_EDIT,
			Template: TEMPLATE_ALMANACH_CONTENTS_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	musapp.Register(ep)
}

type AlmanachContentsEditPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachContentsEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_ALMANACH_CONTENTS_ADMIN_BASE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ALMANACH_CONTENTS_EDIT, p.GET(engine, app, ia))
	rg.GET(URL_ALMANACH_CONTENTS_NEW, p.GETNew(engine, app, ia))
	rg.GET(URL_ALMANACH_CONTENTS_ITEM_EDIT, p.GETItemEdit(engine, app, ia))
	rg.GET(URL_ALMANACH_CONTENTS_ITEM_EDIT_SLASH, p.GETItemEdit(engine, app, ia))
	rg.POST(URL_ALMANACH_CONTENTS_EDIT, p.POSTSave(engine, app, ia, store))
	rg.POST(URL_ALMANACH_CONTENTS_DELETE, p.POSTDelete(engine, app, ia, store))
	rg.POST(URL_ALMANACH_CONTENTS_EDIT_EXTENT, p.POSTUpdateExtent(engine, app, ia, store))
	rg.POST(URL_ALMANACH_CONTENTS_UPLOAD, p.POSTUploadScans(engine, app, store))
	rg.POST(URL_ALMANACH_CONTENTS_DELETE_SCAN, p.POSTDeleteScan(engine, app, store))
	return nil
}

func (p *AlmanachContentsEditPage) GET(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		data := make(map[string]any)
		displayApp, _ := ma.(*musapp.App)
		result, err := NewAlmanachEditResult(app, displayApp, id, BeitraegeFilterParameters{})
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["csrf_token"] = req.Session().Token
		data["content_types"] = dbmodels.CONTENT_TYPE_VALUES
		data["musenalm_types"] = dbmodels.MUSENALM_TYPE_VALUES
		data["pagination_values"] = paginationValuesSorted()
		data["agent_relations"] = dbmodels.AGENT_RELATIONS
		data["cancel_url"] = cancelURLFromHeader(e)

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}
		data["edit_content_id"] = strings.TrimSpace(e.Request.URL.Query().Get("edit_content"))
		data["new_content"] = strings.TrimSpace(e.Request.URL.Query().Get("new_content"))

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *AlmanachContentsEditPage) GETItemEdit(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		contentMusenalmID := strings.TrimSpace(e.Request.PathValue("contentMusenalmId"))
		if contentMusenalmID == "" {
			return e.String(http.StatusBadRequest, "")
		}

		req := templating.NewRequest(e)
		data := make(map[string]any)
		displayApp, _ := ma.(*musapp.App)
		result, err := NewAlmanachEditResult(app, displayApp, id, BeitraegeFilterParameters{})
		if err != nil {
			engine.Response404(e, err, nil)
		}

		content, err := dbmodels.Contents_MusenalmID(app, contentMusenalmID)
		if err != nil || content == nil {
			return e.String(http.StatusNotFound, "")
		}
		if content.Entry() != result.Entry.Id {
			return e.String(http.StatusNotFound, "")
		}

		contents, err := dbmodels.Contents_Entry(app, result.Entry.Id)
		if err == nil && len(contents) > 1 {
			sort.Slice(contents, func(i, j int) bool {
				if contents[i].Numbering() == contents[j].Numbering() {
					return contents[i].Id < contents[j].Id
				}
				return contents[i].Numbering() < contents[j].Numbering()
			})
		}
		var prevContent *dbmodels.Content
		var nextContent *dbmodels.Content
		contentIndex := 0
		contentTotal := 0
		if len(contents) > 0 {
			contentTotal = len(contents)
			for i, c := range contents {
				if c.Id != content.Id {
					continue
				}
				contentIndex = i + 1
				if i > 0 {
					prevContent = contents[i-1]
				}
				if i < len(contents)-1 {
					nextContent = contents[i+1]
				}
				break
			}
		}

		agentsMap, contentAgentsMap, err := dbmodels.AgentsForContents(app, []*dbmodels.Content{content})
		if err != nil {
			agentsMap = map[string]*dbmodels.Agent{}
			contentAgentsMap = map[string][]*dbmodels.RContentsAgents{}
		}

		data["result"] = result
		data["csrf_token"] = req.Session().Token
		data["content"] = content
		data["content_id"] = content.Id
		data["content_types"] = dbmodels.CONTENT_TYPE_VALUES
		data["musenalm_types"] = dbmodels.MUSENALM_TYPE_VALUES
		data["pagination_values"] = paginationValuesSorted()
		data["agent_relations"] = dbmodels.AGENT_RELATIONS
		data["agents"] = agentsMap
		data["content_agents"] = contentAgentsMap[content.Id]
		data["cancel_url"] = cancelURLFromHeader(e)
		data["prev_content"] = prevContent
		data["next_content"] = nextContent
		data["content_index"] = contentIndex
		data["content_total"] = contentTotal

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, TEMPLATE_ALMANACH_CONTENTS_ITEM_EDIT, data, p.Layout)
	}
}

func (p *AlmanachContentsEditPage) GETNew(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		data := make(map[string]any)
		displayApp, _ := ma.(*musapp.App)
		result, err := NewAlmanachEditResult(app, displayApp, id, BeitraegeFilterParameters{})
		if err != nil {
			engine.Response404(e, err, nil)
		}

		contentCollection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		record := core.NewRecord(contentCollection)
		tempID := fmt.Sprintf("tmp-%d", time.Now().UnixNano())
		record.Id = tempID
		content := dbmodels.NewContent(record)
		content.SetEntry(result.Entry.Id)
		content.SetEditState("Edited")

		data["result"] = result
		data["csrf_token"] = req.Session().Token
		data["content"] = content
		data["content_id"] = content.Id
		data["content_types"] = dbmodels.CONTENT_TYPE_VALUES
		data["musenalm_types"] = dbmodels.MUSENALM_TYPE_VALUES
		data["pagination_values"] = paginationValuesSorted()
		data["agent_relations"] = dbmodels.AGENT_RELATIONS
		data["agents"] = map[string]*dbmodels.Agent{}
		data["content_agents"] = []*dbmodels.RContentsAgents{}
		data["is_new"] = true
		data["cancel_url"] = cancelURLFromHeader(e)

		return engine.Response200(e, TEMPLATE_ALMANACH_CONTENTS_ITEM_EDIT, data, p.Layout)
	}
}

func (p *AlmanachContentsEditPage) renderError(engine *templating.Engine, app core.App, ma pagemodels.IApp, e *core.RequestEvent, message string) error {
	id := e.Request.PathValue("id")
	req := templating.NewRequest(e)
	data := make(map[string]any)
	displayApp, _ := ma.(*musapp.App)
	result, err := NewAlmanachEditResult(app, displayApp, id, BeitraegeFilterParameters{})
	if err != nil {
		return engine.Response404(e, err, nil)
	}
	data["result"] = result
	data["csrf_token"] = req.Session().Token
	data["content_types"] = dbmodels.CONTENT_TYPE_VALUES
	data["musenalm_types"] = dbmodels.MUSENALM_TYPE_VALUES
	data["pagination_values"] = paginationValuesSorted()
	data["agent_relations"] = dbmodels.AGENT_RELATIONS
	data["error"] = message
	data["cancel_url"] = cancelURLFromHeader(e)
	data["edit_content_id"] = strings.TrimSpace(e.Request.URL.Query().Get("edit_content"))
	data["new_content"] = strings.TrimSpace(e.Request.URL.Query().Get("new_content"))
	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *AlmanachContentsEditPage) renderItemError(engine *templating.Engine, app core.App, ma pagemodels.IApp, e *core.RequestEvent, contentID string, message string) error {
	id := e.Request.PathValue("id")
	req := templating.NewRequest(e)
	data := make(map[string]any)
	displayApp, _ := ma.(*musapp.App)
	result, err := NewAlmanachEditResult(app, displayApp, id, BeitraegeFilterParameters{})
	if err != nil {
		return engine.Response404(e, err, nil)
	}

	contents, err := dbmodels.Contents_IDs(app, []any{contentID})
	if err != nil || len(contents) == 0 {
		return p.renderError(engine, app, ma, e, message)
	}
	content := contents[0]
	if content.Entry() != result.Entry.Id {
		return p.renderError(engine, app, ma, e, message)
	}

	entryContents, err := dbmodels.Contents_Entry(app, result.Entry.Id)
	if err == nil && len(entryContents) > 1 {
		sort.Slice(entryContents, func(i, j int) bool {
			if entryContents[i].Numbering() == entryContents[j].Numbering() {
				return entryContents[i].Id < entryContents[j].Id
			}
			return entryContents[i].Numbering() < entryContents[j].Numbering()
		})
	}
	var prevContent *dbmodels.Content
	var nextContent *dbmodels.Content
	contentIndex := 0
	contentTotal := 0
	if len(entryContents) > 0 {
		contentTotal = len(entryContents)
		for i, c := range entryContents {
			if c.Id != content.Id {
				continue
			}
			contentIndex = i + 1
			if i > 0 {
				prevContent = entryContents[i-1]
			}
			if i < len(entryContents)-1 {
				nextContent = entryContents[i+1]
			}
			break
		}
	}

	agentsMap, contentAgentsMap, err := dbmodels.AgentsForContents(app, []*dbmodels.Content{content})
	if err != nil {
		agentsMap = map[string]*dbmodels.Agent{}
		contentAgentsMap = map[string][]*dbmodels.RContentsAgents{}
	}

	data["result"] = result
	data["csrf_token"] = req.Session().Token
	data["content"] = content
	data["content_id"] = content.Id
	data["content_types"] = dbmodels.CONTENT_TYPE_VALUES
	data["musenalm_types"] = dbmodels.MUSENALM_TYPE_VALUES
	data["pagination_values"] = paginationValuesSorted()
	data["agent_relations"] = dbmodels.AGENT_RELATIONS
	data["agents"] = agentsMap
	data["content_agents"] = contentAgentsMap[content.Id]
	data["prev_content"] = prevContent
	data["next_content"] = nextContent
	data["content_index"] = contentIndex
	data["content_total"] = contentTotal
	data["error"] = message
	data["cancel_url"] = cancelURLFromHeader(e)

	return engine.Response200(e, TEMPLATE_ALMANACH_CONTENTS_ITEM_EDIT, data, p.Layout)
}

func (p *AlmanachContentsEditPage) POSTSave(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		if e.Request.MultipartForm == nil {
			if err := e.Request.ParseMultipartForm(router.DefaultMaxMemory); err != nil {
				if e.Request.MultipartForm == nil {
					if err := e.Request.ParseForm(); err != nil {
						return p.renderError(engine, app, ia, e, err.Error())
					}
				}
			}
		}

		contentID := strings.TrimSpace(e.Request.FormValue("content_id"))
		renderError := func(message string) error {
			if contentID != "" {
				return p.renderItemError(engine, app, ia, e, contentID, message)
			}
			return p.renderError(engine, app, ia, e, message)
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return renderError(err.Error())
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		contents, err := dbmodels.Contents_Entry(app, entry.Id)
		if err != nil {
			return p.renderError(engine, app, ia, e, "Beiträge konnten nicht geladen werden.")
		}

		contentInputs := parseContentsForm(e.Request.PostForm)
		contentOrder := parseContentsOrder(e.Request.PostForm)
		orderMap := buildContentOrderMap(contentOrder)
		relationsByContent := map[string]contentAgentRelationsPayload{}
		for contentID := range contentInputs {
			relationsByContent[contentID] = parseContentAgentRelations(e.Request.PostForm, contentID)
		}
		editorID := req.EditorUserID()
		existingByID := make(map[string]*dbmodels.Content, len(contents))
		for _, content := range contents {
			existingByID[content.Id] = content
		}
		newContentIDs := make([]string, 0)
		for contentID := range contentInputs {
			if _, exists := existingByID[contentID]; !exists {
				newContentIDs = append(newContentIDs, contentID)
			}
		}
		if len(newContentIDs) > 1 {
			sort.Slice(newContentIDs, func(i, j int) bool {
				return orderMap[newContentIDs[i]] < orderMap[newContentIDs[j]]
			})
		}

		uploadedScans, _ := e.FindUploadedFiles(dbmodels.SCAN_FIELD)
		deleteScans := valuesForKey(e.Request.PostForm, "scans_delete")
		scansOrder := valuesForKey(e.Request.PostForm, "scans_order")
		pendingScanIDs := valuesForKey(e.Request.PostForm, "scans_pending_ids")
		targetContentID := contentID
		if targetContentID == "" && len(contentInputs) == 1 {
			for id := range contentInputs {
				targetContentID = id
				break
			}
		}
		if contentID == "" {
			contentID = targetContentID
		}

		tempToCreated := map[string]string{}
		var createdContents []*dbmodels.Content
		var updatedContents []*dbmodels.Content
		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			created := make([]*dbmodels.Content, 0, len(newContentIDs))
			for _, tempID := range newContentIDs {
				input, ok := contentInputs[tempID]
				if !ok {
					continue
				}
				input.Numbering = orderMap[tempID]
				if input.Numbering <= 0 {
					input.Numbering = float64(len(contents) + len(created) + 1)
				}
				if strings.TrimSpace(input.EditState) == "" {
					input.EditState = "Edited"
				}
				content, err := store.CreateContent(tx, entry, canonicalContentInput(input, editorID), effects)
				if err != nil {
					return err
				}
				tempToCreated[tempID] = content.Id
				if relations, ok := relationsByContent[tempID]; ok {
					existingRelations, newRelations := canonicalContentRelationsInput(relations)
					if err := store.SaveContentAgentRelations(tx, content, existingRelations, newRelations, relations.DeletedIDs, effects); err != nil {
						return err
					}
				}
				created = append(created, content)
			}
			for _, content := range contents {
				input, ok := contentInputs[content.Id]
				if !ok {
					continue
				}
				input.Numbering = orderMap[content.Id]
				if input.Numbering <= 0 {
					input.Numbering = content.Numbering()
				}
				if err := store.UpdateContent(tx, content, entry, canonicalContentInput(input, editorID), effects); err != nil {
					return err
				}
				if relations, ok := relationsByContent[content.Id]; ok {
					existingRelations, newRelations := canonicalContentRelationsInput(relations)
					if err := store.SaveContentAgentRelations(tx, content, existingRelations, newRelations, relations.DeletedIDs, effects); err != nil {
						return err
					}
				}
			}
			effectiveContentID := targetContentID
			if mappedID, ok := tempToCreated[effectiveContentID]; ok {
				effectiveContentID = mappedID
			}
			if effectiveContentID != "" && (len(uploadedScans) > 0 || len(deleteScans) > 0 || len(scansOrder) > 0) {
				record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, effectiveContentID)
				if err != nil {
					return err
				}
				content := dbmodels.NewContent(record)
				if content.Entry() != entry.Id {
					return fmt.Errorf("beitrag gehört zu einem anderen band")
				}
				if err := store.UpdateContentScans(tx, content, canonical.ContentScansInput{
					UploadedFiles:  uploadedScans,
					DeleteScans:    deleteScans,
					ScansOrder:     scansOrder,
					PendingScanIDs: pendingScanIDs,
					EditorID:       editorID,
				}); err != nil {
					return err
				}
			}
			createdContents = append(createdContents, created...)
			updatedContents = append(updatedContents, contents...)
			updatedContents = append(updatedContents, created...)
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save contents", "entry_id", entry.Id, "error", err)
			return renderError(canonicalErrorMessage(err, "Speichern fehlgeschlagen."))
		}

		if len(updatedContents) == 0 {
			updatedContents = contents
		}
		saveAction := strings.TrimSpace(e.Request.FormValue("save_action"))
		savedMessage := "Änderungen gespeichert."
		if contentID != "" {
			effectiveContentID := contentID
			if mappedID, ok := tempToCreated[effectiveContentID]; ok {
				effectiveContentID = mappedID
			}
			if effectiveContentID != "" {
				if resolved, err := dbmodels.Contents_IDs(app, []any{effectiveContentID}); err == nil && len(resolved) > 0 {
					if saveAction == "view" {
						redirect := fmt.Sprintf(URL_BEITRAG_VIEW_FORMAT, resolved[0].MusenalmID())
						return e.Redirect(http.StatusSeeOther, redirect)
					}
					setFlashSuccess(e, savedMessage)
					redirect := fmt.Sprintf(URL_ALMANACH_CONTENT_ITEM_EDIT_FORMAT, id, resolved[0].MusenalmID())
					return e.Redirect(http.StatusSeeOther, redirect)
				}
			}
		}
		setFlashSuccess(e, savedMessage)
		redirect := fmt.Sprintf(URL_ALMANACH_CONTENTS_EDIT_FORMAT, id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTUpdateExtent(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		if err := e.Request.ParseForm(); err != nil {
			return p.renderError(engine, app, ia, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return p.renderError(engine, app, ia, e, err.Error())
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		editorID := req.EditorUserID()
		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.UpdateEntryExtent(tx, entry, e.Request.FormValue("extent"), editorID, effects)
		}); err != nil {
			app.Logger().Error("Failed to update entry extent", "entry_id", entry.Id, "error", err)
			return p.renderError(engine, app, ia, e, "Struktur/Umfang konnte nicht gespeichert werden.")
		}

		setFlashSuccess(e, "Struktur/Umfang gespeichert.")
		redirect := fmt.Sprintf(URL_ALMANACH_CONTENTS_EDIT_FORMAT, id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTDelete(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		isHTMX := strings.EqualFold(e.Request.Header.Get("HX-Request"), "true")

		if err := e.Request.ParseForm(); err != nil {
			return p.renderError(engine, app, ia, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return p.renderError(engine, app, ia, e, err.Error())
		}

		contentID := strings.TrimSpace(e.Request.FormValue("content_id"))
		if contentID == "" {
			return p.renderError(engine, app, ia, e, "Beitrag konnte nicht gelöscht werden.")
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, contentID)
			if err != nil {
				return err
			}
			content := dbmodels.NewContent(record)
			if content.Entry() != entry.Id {
				return fmt.Errorf("beitrag gehört zu einem anderen band")
			}

			if err := store.DeleteContent(tx, content, effects); err != nil {
				return err
			}
			_, err = store.RenumberEntryContents(tx, entry.Id)
			return err
		}); err != nil {
			app.Logger().Error("Failed to delete content", "entry_id", entry.Id, "content_id", contentID, "error", err)
			return p.renderError(engine, app, ia, e, "Beitrag konnte nicht gelöscht werden.")
		}

		if isHTMX {
			success := `<div hx-swap-oob="innerHTML:#user-message"><div class="text-green-800 text-sm mt-2 rounded-xs bg-green-200 p-2 font-bold border-green-700 shadow border mb-3"><i class="ri-checkbox-circle-fill"></i> Beitrag geloescht.</div></div>`
			return e.HTML(http.StatusOK, success)
		}

		redirect := fmt.Sprintf(URL_ALMANACH_CONTENTS_EDIT_FORMAT, id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTUploadScans(engine *templating.Engine, app core.App, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		isHTMX := strings.EqualFold(e.Request.Header.Get("HX-Request"), "true")

		if e.Request.MultipartForm == nil {
			if err := e.Request.ParseMultipartForm(router.DefaultMaxMemory); err != nil {
				return renderContentsImagesHTMXError(e, "Upload fehlgeschlagen.", isHTMX)
			}
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return renderContentsImagesHTMXError(e, "Upload fehlgeschlagen.", isHTMX)
		}

		contentID := strings.TrimSpace(e.Request.FormValue("content_id"))
		if contentID == "" || strings.HasPrefix(contentID, "tmp") {
			return renderContentsImagesHTMXError(e, "Upload fehlgeschlagen.", isHTMX)
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		contents, err := dbmodels.Contents_IDs(app, []any{contentID})
		if err != nil || len(contents) == 0 {
			return renderContentsImagesHTMXError(e, "Beitrag nicht gefunden.", isHTMX)
		}
		content := contents[0]
		if content.Entry() != entry.Id {
			return renderContentsImagesHTMXError(e, "Beitrag nicht gefunden.", isHTMX)
		}

		files, err := e.FindUploadedFiles(dbmodels.SCAN_FIELD)
		if err != nil || len(files) == 0 {
			return renderContentsImagesHTMXError(e, "Bitte eine Datei auswaehlen.", isHTMX)
		}

		editorID := req.EditorUserID()
		if err := app.RunInTransaction(func(tx core.App) error {
			record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, content.Id)
			if err != nil {
				return err
			}
			current := dbmodels.NewContent(record)
			return store.UpdateContentScans(tx, current, canonical.ContentScansInput{
				UploadedFiles: files,
				EditorID:      editorID,
			})
		}); err != nil {
			app.Logger().Error("Failed to upload scans", "entry_id", entry.Id, "content_id", content.Id, "error", err)
			return renderContentsImagesHTMXError(e, "Upload fehlgeschlagen.", isHTMX)
		}

		if !isHTMX {
			redirect := fmt.Sprintf(URL_ALMANACH_CONTENTS_EDIT_FORMAT, id)
			return e.Redirect(http.StatusSeeOther, redirect)
		}

		if refreshed, err := dbmodels.Contents_IDs(app, []any{content.Id}); err == nil && len(refreshed) > 0 {
			content = refreshed[0]
		}

		data := map[string]any{
			"content":    content,
			"entry":      entry,
			"csrf_token": req.Session().Token,
			"is_new":     false,
		}
		var builder strings.Builder
		if err := engine.Render(&builder, TEMPLATE_ALMANACH_CONTENTS_IMAGES_PANEL, data, pagemodels.LAYOUT_FRAGMENT); err != nil {
			app.Logger().Error("Failed to render images panel", "entry_id", entry.Id, "content_id", content.Id, "error", err)
			return e.String(http.StatusInternalServerError, "")
		}

		success := `<div hx-swap-oob="innerHTML:#user-message"><div class="text-green-800 text-sm mt-2 rounded-xs bg-green-200 p-2 font-bold border-green-700 shadow border mb-3"><i class="ri-checkbox-circle-fill"></i> Digitalisat gespeichert.</div></div>`
		countOOB := renderContentImagesCountOOB(content)
		return e.HTML(http.StatusOK, builder.String()+success+countOOB)
	}
}

func (p *AlmanachContentsEditPage) POSTDeleteScan(engine *templating.Engine, app core.App, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		isHTMX := strings.EqualFold(e.Request.Header.Get("HX-Request"), "true")

		if err := e.Request.ParseForm(); err != nil {
			return renderContentsImagesHTMXError(e, "Loeschen fehlgeschlagen.", isHTMX)
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return renderContentsImagesHTMXError(e, "Loeschen fehlgeschlagen.", isHTMX)
		}

		contentID := strings.TrimSpace(e.Request.FormValue("content_id"))
		scan := strings.TrimSpace(e.Request.FormValue("scan"))
		if contentID == "" || scan == "" {
			return renderContentsImagesHTMXError(e, "Loeschen fehlgeschlagen.", isHTMX)
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		contents, err := dbmodels.Contents_IDs(app, []any{contentID})
		if err != nil || len(contents) == 0 {
			return renderContentsImagesHTMXError(e, "Beitrag nicht gefunden.", isHTMX)
		}
		content := contents[0]
		if content.Entry() != entry.Id {
			return renderContentsImagesHTMXError(e, "Beitrag nicht gefunden.", isHTMX)
		}
		if !slices.Contains(content.Scans(), scan) {
			return renderContentsImagesHTMXError(e, "Datei nicht gefunden.", isHTMX)
		}

		editorID := req.EditorUserID()
		if err := app.RunInTransaction(func(tx core.App) error {
			record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, content.Id)
			if err != nil {
				return err
			}
			current := dbmodels.NewContent(record)
			return store.UpdateContentScans(tx, current, canonical.ContentScansInput{
				DeleteScans: []string{scan},
				EditorID:    editorID,
			})
		}); err != nil {
			app.Logger().Error("Failed to delete scan", "entry_id", entry.Id, "content_id", content.Id, "scan", scan, "error", err)
			return renderContentsImagesHTMXError(e, "Loeschen fehlgeschlagen.", isHTMX)
		}

		if !isHTMX {
			redirect := fmt.Sprintf(URL_ALMANACH_CONTENTS_EDIT_FORMAT, id)
			return e.Redirect(http.StatusSeeOther, redirect)
		}

		if refreshed, err := dbmodels.Contents_IDs(app, []any{content.Id}); err == nil && len(refreshed) > 0 {
			content = refreshed[0]
		}

		data := map[string]any{
			"content":    content,
			"entry":      entry,
			"csrf_token": req.Session().Token,
			"is_new":     false,
		}
		var builder strings.Builder
		if err := engine.Render(&builder, TEMPLATE_ALMANACH_CONTENTS_IMAGES_PANEL, data, pagemodels.LAYOUT_FRAGMENT); err != nil {
			app.Logger().Error("Failed to render images panel", "entry_id", entry.Id, "content_id", content.Id, "error", err)
			return e.String(http.StatusInternalServerError, "")
		}

		success := `<div hx-swap-oob="innerHTML:#user-message"><div class="text-green-800 text-sm mt-2 rounded-xs bg-green-200 p-2 font-bold border-green-700 shadow border mb-3"><i class="ri-checkbox-circle-fill"></i> Digitalisat geloescht.</div></div>`
		countOOB := renderContentImagesCountOOB(content)
		return e.HTML(http.StatusOK, builder.String()+success+countOOB)
	}
}

func renderContentImagesCountOOB(content *dbmodels.Content) string {
	if content == nil {
		return ""
	}
	count := len(content.Scans())
	hiddenClass := ""
	if count == 0 {
		hiddenClass = " hidden"
	}
	return fmt.Sprintf(
		`<span hx-swap-oob="outerHTML" id="content-%s-images-count" class="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 mr-2.5%s"><i class="ri-image-line"></i><span>%d</span></span>`,
		content.Id,
		hiddenClass,
		count,
	)
}

func renderContentsImagesHTMXError(e *core.RequestEvent, message string, isHTMX bool) error {
	if !isHTMX {
		return e.String(http.StatusBadRequest, message)
	}
	e.Response.Header().Set("HX-Reswap", "none")
	payload := fmt.Sprintf(
		`<div hx-swap-oob="innerHTML:#user-message"><div class="text-red-800 text-sm mt-2 rounded-xs bg-red-200 p-2 font-bold border-red-700 shadow border mb-3"><i class="ri-error-warning-fill"></i> %s</div></div>`,
		message,
	)
	return e.HTML(http.StatusBadRequest, payload)
}

type contentFormInput struct {
	PreferredTitle          string
	VariantTitle            string
	ParallelTitle           string
	TitleStatement          string
	SubtitleStatement       string
	IncipitStatement        string
	ResponsibilityStatement string
	Pseudonym               bool
	PlaceStatement          string
	Extent                  string
	Annotation              string
	EditComment             string
	Language                []string
	ContentType             []string
	MusenalmType            []string
	MusenalmPagination      string
	EditState               string
	Numbering               float64
}

func parseContentsForm(form url.Values) map[string]contentFormInput {
	rawInputs := map[string]map[string][]string{}
	for key, values := range form {
		if key == "csrf_token" || key == "last_edited" {
			continue
		}
		trimmed := strings.TrimSuffix(key, "[]")
		if !strings.HasPrefix(trimmed, "content_") {
			continue
		}
		rest := strings.TrimPrefix(trimmed, "content_")
		sep := strings.Index(rest, "_")
		if sep < 0 {
			continue
		}
		contentID := rest[:sep]
		field := rest[sep+1:]
		if field == "" || contentID == "" {
			continue
		}
		if _, ok := rawInputs[contentID]; !ok {
			rawInputs[contentID] = map[string][]string{}
		}
		rawInputs[contentID][field] = values
	}

	contentInputs := make(map[string]contentFormInput, len(rawInputs))
	for contentID, fields := range rawInputs {
		contentInputs[contentID] = contentFormInput{
			VariantTitle:            strings.TrimSpace(firstValue(fields["variant_title"])),
			ParallelTitle:           strings.TrimSpace(firstValue(fields["parallel_title"])),
			TitleStatement:          strings.TrimSpace(firstValue(fields["title_statement"])),
			SubtitleStatement:       strings.TrimSpace(firstValue(fields["subtitle_statement"])),
			IncipitStatement:        strings.TrimSpace(firstValue(fields["incipit_statement"])),
			ResponsibilityStatement: strings.TrimSpace(firstValue(fields["responsibility_statement"])),
			Pseudonym:               parseOptionalBoolField(fields, "pseudonym"),
			PlaceStatement:          strings.TrimSpace(firstValue(fields["place_statement"])),
			Extent:                  strings.TrimSpace(firstValue(fields["extent"])),
			Annotation:              strings.TrimSpace(firstValue(fields["annotation"])),
			EditComment:             strings.TrimSpace(firstValue(fields["edit_comment"])),
			Language:                sanitizeContentStrings(fields["language"]),
			ContentType:             sanitizeContentStrings(fields["content_type"]),
			MusenalmType:            sanitizeContentStrings(fields["musenalm_type"]),
			MusenalmPagination:      strings.TrimSpace(firstValue(fields["musenalm_pagination"])),
			EditState:               strings.TrimSpace(firstValue(fields["edit_state"])),
		}
	}

	return contentInputs
}

type contentAgentRelationPayload struct {
	ID        string
	TargetID  string
	Type      string
	Uncertain bool
}

type contentAgentRelationsPayload struct {
	Relations    []contentAgentRelationPayload
	NewRelations []contentAgentRelationPayload
	DeletedIDs   []string
}

func valuesForKey(form url.Values, key string) []string {
	if values, ok := form[key]; ok {
		return values
	}
	if values, ok := form[key+"[]"]; ok {
		return values
	}
	return nil
}

func hasKey(form url.Values, key string) bool {
	_, ok := form[key]
	return ok
}

func parseContentAgentRelations(form url.Values, contentID string) contentAgentRelationsPayload {
	payload := contentAgentRelationsPayload{}
	if contentID == "" {
		return payload
	}
	prefix := fmt.Sprintf("content_%s_agents_", contentID)
	idPrefix := prefix + "id["

	for key, values := range form {
		if !strings.HasPrefix(key, idPrefix) {
			continue
		}
		relationKey := strings.TrimSuffix(strings.TrimPrefix(key, idPrefix), "]")
		relationID := strings.TrimSpace(firstValue(values))
		if relationKey == "" || relationID == "" {
			continue
		}
		targetKey := fmt.Sprintf("%sagent[%s]", prefix, relationKey)
		typeKey := fmt.Sprintf("%stype[%s]", prefix, relationKey)
		deleteKey := fmt.Sprintf("%sdelete[%s]", prefix, relationKey)
		uncertainKey := fmt.Sprintf("%suncertain[%s]", prefix, relationKey)

		targetID := strings.TrimSpace(firstValue(valuesForKey(form, targetKey)))
		if targetID == "" {
			continue
		}
		if _, ok := form[deleteKey]; ok {
			payload.DeletedIDs = append(payload.DeletedIDs, relationID)
			continue
		}
		payload.Relations = append(payload.Relations, contentAgentRelationPayload{
			ID:        relationID,
			TargetID:  targetID,
			Type:      strings.TrimSpace(firstValue(valuesForKey(form, typeKey))),
			Uncertain: hasKey(form, uncertainKey),
		})
	}

	newIDs := valuesForKey(form, prefix+"new_id")
	newTypes := valuesForKey(form, prefix+"new_type")
	newUncertain := valuesForKey(form, prefix+"new_uncertain")
	uncertainSet := map[string]struct{}{}
	for _, value := range newUncertain {
		trimmed := strings.TrimSpace(value)
		if trimmed == "" {
			continue
		}
		uncertainSet[trimmed] = struct{}{}
	}

	for index, targetID := range newIDs {
		targetID = strings.TrimSpace(targetID)
		if targetID == "" {
			continue
		}
		relationType := ""
		if index < len(newTypes) {
			relationType = strings.TrimSpace(newTypes[index])
		}
		_, uncertain := uncertainSet[targetID]
		payload.NewRelations = append(payload.NewRelations, contentAgentRelationPayload{
			TargetID:  targetID,
			Type:      relationType,
			Uncertain: uncertain,
		})
	}

	return payload
}
func sanitizeContentStrings(values []string) []string {
	cleaned := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		cleaned = append(cleaned, value)
	}
	return cleaned
}

func firstValue(values []string) string {
	if len(values) == 0 {
		return ""
	}
	return values[0]
}

func parseOptionalBoolField(fields map[string][]string, key string) bool {
	values, ok := fields[key]
	if !ok || len(values) == 0 {
		return false
	}
	value := strings.TrimSpace(values[len(values)-1])
	switch strings.ToLower(value) {
	case "1", "true", "on", "yes":
		return true
	default:
		return false
	}
}

func parseContentsOrder(form url.Values) []string {
	raw := form["content_order[]"]
	if len(raw) == 0 {
		raw = form["content_order"]
	}
	order := make([]string, 0, len(raw))
	for _, value := range raw {
		trimmed := strings.TrimSpace(value)
		if trimmed == "" {
			continue
		}
		order = append(order, trimmed)
	}
	return order
}

func buildContentOrderMap(order []string) map[string]float64 {
	orderMap := make(map[string]float64, len(order))
	for index, id := range order {
		orderMap[id] = float64(index + 1)
	}
	return orderMap
}

func paginationValuesSorted() []string {
	orderedKeys := []string{"", "ar", "röm", "alph", "sonst"}
	for i := 1; i <= 8; i++ {
		orderedKeys = append(orderedKeys, fmt.Sprintf("ar%d", i))
	}
	for i := 1; i <= 8; i++ {
		orderedKeys = append(orderedKeys, fmt.Sprintf("röm%d", i))
	}

	values := make([]string, 0, len(dbmodels.MUSENALM_PAGINATION_VALUES))
	seen := map[string]struct{}{}
	for _, key := range orderedKeys {
		value, ok := dbmodels.MUSENALM_PAGINATION_VALUES[key]
		if !ok {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		values = append(values, value)
	}

	remainingKeys := slices.Collect(maps.Keys(dbmodels.MUSENALM_PAGINATION_VALUES))
	sort.Strings(remainingKeys)
	for _, key := range remainingKeys {
		value := dbmodels.MUSENALM_PAGINATION_VALUES[key]
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		values = append(values, value)
	}

	return values
}
