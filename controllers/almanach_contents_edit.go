package controllers

import (
	"fmt"
	"maps"
	"net/http"
	"net/url"
	"slices"
	"sort"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ALMANACH_CONTENTS_EDIT      = "contents/edit"
	URL_ALMANACH_CONTENTS_ITEM_EDIT = "contents/{contentMusenalmId}/edit"
	URL_ALMANACH_CONTENTS_DELETE    = "contents/delete"
	URL_ALMANACH_CONTENTS_EDIT_EXTENT = "contents/edit/extent"
	URL_ALMANACH_CONTENTS_UPLOAD    = "contents/upload"
	URL_ALMANACH_CONTENTS_DELETE_SCAN = "contents/scan/delete"
	TEMPLATE_ALMANACH_CONTENTS_EDIT = "/almanach/contents/edit/"
	TEMPLATE_ALMANACH_CONTENTS_ITEM_EDIT = "/almanach/contents/edit_item/"
	TEMPLATE_ALMANACH_CONTENTS_IMAGES_PANEL = "/almanach/contents/images_panel/"
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
	app.Register(ep)
}

type AlmanachContentsEditPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachContentsEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_ALMANACH)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ALMANACH_CONTENTS_EDIT, p.GET(engine, app))
	rg.GET(URL_ALMANACH_CONTENTS_ITEM_EDIT, p.GETItemEdit(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_EDIT, p.POSTSave(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_DELETE, p.POSTDelete(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_EDIT_EXTENT, p.POSTUpdateExtent(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_UPLOAD, p.POSTUploadScans(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_DELETE_SCAN, p.POSTDeleteScan(engine, app))
	return nil
}

func (p *AlmanachContentsEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		data := make(map[string]any)
		result, err := NewAlmanachEditResult(app, id, BeitraegeFilterParameters{})
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["csrf_token"] = req.Session().Token
		data["content_types"] = dbmodels.CONTENT_TYPE_VALUES
		data["musenalm_types"] = dbmodels.MUSENALM_TYPE_VALUES
		data["pagination_values"] = paginationValuesSorted()
		data["agent_relations"] = dbmodels.AGENT_RELATIONS

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}
		data["edit_content_id"] = strings.TrimSpace(e.Request.URL.Query().Get("edit_content"))
		data["new_content"] = strings.TrimSpace(e.Request.URL.Query().Get("new_content"))

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *AlmanachContentsEditPage) GETItemEdit(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		contentMusenalmID := strings.TrimSpace(e.Request.PathValue("contentMusenalmId"))
		if contentMusenalmID == "" {
			return e.String(http.StatusBadRequest, "")
		}

		req := templating.NewRequest(e)
		data := make(map[string]any)
		result, err := NewAlmanachEditResult(app, id, BeitraegeFilterParameters{})
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
		if len(contents) > 0 {
			for i, c := range contents {
				if c.Id != content.Id {
					continue
				}
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
		data["prev_content"] = prevContent
		data["next_content"] = nextContent

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, TEMPLATE_ALMANACH_CONTENTS_ITEM_EDIT, data, p.Layout)
	}
}

func (p *AlmanachContentsEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string) error {
	id := e.Request.PathValue("id")
	req := templating.NewRequest(e)
	data := make(map[string]any)
	result, err := NewAlmanachEditResult(app, id, BeitraegeFilterParameters{})
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
	data["edit_content_id"] = strings.TrimSpace(e.Request.URL.Query().Get("edit_content"))
	data["new_content"] = strings.TrimSpace(e.Request.URL.Query().Get("new_content"))
	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *AlmanachContentsEditPage) renderItemError(engine *templating.Engine, app core.App, e *core.RequestEvent, contentID string, message string) error {
	id := e.Request.PathValue("id")
	req := templating.NewRequest(e)
	data := make(map[string]any)
	result, err := NewAlmanachEditResult(app, id, BeitraegeFilterParameters{})
	if err != nil {
		return engine.Response404(e, err, nil)
	}

	contents, err := dbmodels.Contents_IDs(app, []any{contentID})
	if err != nil || len(contents) == 0 {
		return p.renderError(engine, app, e, message)
	}
	content := contents[0]
	if content.Entry() != result.Entry.Id {
		return p.renderError(engine, app, e, message)
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
	if len(entryContents) > 0 {
		for i, c := range entryContents {
			if c.Id != content.Id {
				continue
			}
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
	data["error"] = message

	return engine.Response200(e, TEMPLATE_ALMANACH_CONTENTS_ITEM_EDIT, data, p.Layout)
}

func (p *AlmanachContentsEditPage) POSTSave(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		if e.Request.MultipartForm == nil {
			if err := e.Request.ParseMultipartForm(router.DefaultMaxMemory); err != nil {
				if e.Request.MultipartForm == nil {
					if err := e.Request.ParseForm(); err != nil {
						return p.renderError(engine, app, e, err.Error())
					}
				}
			}
		}

		contentID := strings.TrimSpace(e.Request.FormValue("content_id"))
		renderError := func(message string) error {
			if contentID != "" {
				return p.renderItemError(engine, app, e, contentID, message)
			}
			return p.renderError(engine, app, e, message)
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
			return p.renderError(engine, app, e, "Beiträge konnten nicht geladen werden.")
		}

		contentInputs := parseContentsForm(e.Request.PostForm)
		contentOrder := parseContentsOrder(e.Request.PostForm)
		orderMap := buildContentOrderMap(contentOrder)
		relationsByContent := map[string]contentAgentRelationsPayload{}
		for contentID := range contentInputs {
			payload := parseContentAgentRelations(e.Request.PostForm, contentID)
			if err := validateContentAgentRelations(payload); err != nil {
				return p.renderError(engine, app, e, err.Error())
			}
			relationsByContent[contentID] = payload
		}
		user := req.User()
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

		var updatedContents []*dbmodels.Content
		if err := app.RunInTransaction(func(tx core.App) error {
			if len(orderMap) > 0 {
				for _, content := range contents {
					numbering, ok := orderMap[content.Id]
					if !ok {
						continue
					}
					if content.Numbering() == numbering {
						continue
					}
					content.SetNumbering(numbering)
					if err := tx.Save(content); err != nil {
						return err
					}
				}
			}
			nextMusenalmID := 0
			if len(newContentIDs) > 0 {
				nextID, err := nextContentMusenalmID(tx)
				if err != nil {
					return err
				}
				nextMusenalmID = nextID
			}
			created := make([]*dbmodels.Content, 0, len(newContentIDs))
			for _, tempID := range newContentIDs {
				fields, ok := contentInputs[tempID]
				if !ok {
					continue
				}
				contentCollection, err := tx.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
				if err != nil {
					return err
				}
				record := core.NewRecord(contentCollection)
				content := dbmodels.NewContent(record)
				content.SetMusenalmID(nextMusenalmID)
				nextMusenalmID++
				content.SetEditState("Edited")
				numbering := orderMap[tempID]
				if numbering <= 0 {
					numbering = float64(len(contents) + len(created) + 1)
				}
				if err := applyContentForm(content, entry, fields, user, numbering); err != nil {
					return err
				}
				if err := tx.Save(content); err != nil {
					return err
				}
				if relations, ok := relationsByContent[tempID]; ok {
					if err := applyContentAgentRelations(tx, content, relations); err != nil {
						return err
					}
				}
				created = append(created, content)
			}
			for _, content := range contents {
				fields, ok := contentInputs[content.Id]
				if !ok {
					continue
				}
				numbering := orderMap[content.Id]
				if err := applyContentForm(content, entry, fields, user, numbering); err != nil {
					return err
				}
				if err := tx.Save(content); err != nil {
					return err
				}
				if relations, ok := relationsByContent[content.Id]; ok {
					if err := applyContentAgentRelations(tx, content, relations); err != nil {
						return err
					}
				}
			}
			if targetContentID != "" && (len(uploadedScans) > 0 || len(deleteScans) > 0) {
				record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, targetContentID)
				if err != nil {
					return err
				}
				content := dbmodels.NewContent(record)
				if content.Entry() != entry.Id {
					return fmt.Errorf("Beitrag gehört zu einem anderen Band.")
				}
				if len(uploadedScans) > 0 {
					content.Set(dbmodels.SCAN_FIELD+"+", uploadedScans)
				}
				if len(deleteScans) > 0 {
					for _, scan := range deleteScans {
						scan = strings.TrimSpace(scan)
						if scan == "" {
							continue
						}
						content.Set(dbmodels.SCAN_FIELD+"-", scan)
					}
				}
				if user != nil {
					content.SetEditor(user.Id)
				}
				if err := tx.Save(content); err != nil {
					return err
				}
			}
			updatedContents = append(updatedContents, contents...)
			updatedContents = append(updatedContents, created...)
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save contents", "entry_id", entry.Id, "error", err)
			return renderError(err.Error())
		}

		if len(updatedContents) == 0 {
			updatedContents = contents
		}
		shouldUpdateFTS := len(contentInputs) > 0 || len(newContentIDs) > 0
		if shouldUpdateFTS {
			touched := updatedContents
			if len(contentInputs) > 0 {
				touchedIDs := map[string]struct{}{}
				for id := range contentInputs {
					touchedIDs[id] = struct{}{}
				}
				filtered := make([]*dbmodels.Content, 0, len(touchedIDs))
				for _, content := range updatedContents {
					if _, ok := touchedIDs[content.Id]; ok {
						filtered = append(filtered, content)
					}
				}
				if len(filtered) > 0 {
					touched = filtered
				}
			}
			go updateContentsFTS5(app, entry, touched)
		}

		redirect := fmt.Sprintf("/almanach/%s/contents/edit?saved_message=%s", id, url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTUpdateExtent(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		if err := e.Request.ParseForm(); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return p.renderError(engine, app, e, err.Error())
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		entry.SetExtent(strings.TrimSpace(e.Request.FormValue("extent")))
		if user := req.User(); user != nil {
			entry.SetEditor(user.Id)
		}
		if err := app.Save(entry); err != nil {
			app.Logger().Error("Failed to update entry extent", "entry_id", entry.Id, "error", err)
			return p.renderError(engine, app, e, "Struktur/Umfang konnte nicht gespeichert werden.")
		}

		InvalidateSortedEntriesCache()

		go func(appInstance core.App, entryRecord *dbmodels.Entry) {
			if err := updateEntryFTS5WithContents(appInstance, entryRecord, false); err != nil {
				appInstance.Logger().Error("Failed to update entry FTS5", "entry_id", entryRecord.Id, "error", err)
			}
		}(app, entry)

		redirect := fmt.Sprintf("/almanach/%s/contents/edit?saved_message=%s", id, url.QueryEscape("Struktur/Umfang gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTDelete(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		isHTMX := strings.EqualFold(e.Request.Header.Get("HX-Request"), "true")

		if err := e.Request.ParseForm(); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return p.renderError(engine, app, e, err.Error())
		}

		contentID := strings.TrimSpace(e.Request.FormValue("content_id"))
		if contentID == "" {
			return p.renderError(engine, app, e, "Beitrag konnte nicht gelöscht werden.")
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		var remaining []*dbmodels.Content
		if err := app.RunInTransaction(func(tx core.App) error {
			record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, contentID)
			if err != nil {
				return err
			}
			content := dbmodels.NewContent(record)
			if content.Entry() != entry.Id {
				return fmt.Errorf("Beitrag gehört zu einem anderen Band.")
			}

			relationsTable := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
			relations, err := dbmodels.RContentsAgents_Content(tx, contentID)
			if err != nil {
				return err
			}
			for _, rel := range relations {
				relRecord, err := tx.FindRecordById(relationsTable, rel.Id)
				if err != nil {
					continue
				}
				if err := tx.Delete(relRecord); err != nil {
					return err
				}
			}

			if err := tx.Delete(record); err != nil {
				return err
			}

			remaining, err = dbmodels.Contents_Entry(tx, entry.Id)
			if err != nil {
				return err
			}
			dbmodels.Sort_Contents_Numbering(remaining)
			for idx, content := range remaining {
				content.SetNumbering(float64(idx + 1))
				if err := tx.Save(content); err != nil {
					return err
				}
			}
			return nil
		}); err != nil {
			app.Logger().Error("Failed to delete content", "entry_id", entry.Id, "content_id", contentID, "error", err)
			return p.renderError(engine, app, e, "Beitrag konnte nicht gelöscht werden.")
		}

		go func(contentID string) {
			_ = dbmodels.DeleteFTS5Content(app, contentID)
		}(contentID)

		if len(remaining) > 0 {
			go updateContentsFTS5(app, entry, remaining)
		}

		if isHTMX {
			success := `<div hx-swap-oob="innerHTML:#user-message"><div class="text-green-800 text-sm mt-2 rounded-xs bg-green-200 p-2 font-bold border-green-700 shadow border mb-3"><i class="ri-checkbox-circle-fill"></i> Beitrag geloescht.</div></div>`
			return e.HTML(http.StatusOK, success)
		}

		redirect := fmt.Sprintf("/almanach/%s/contents/edit", id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTUploadScans(engine *templating.Engine, app core.App) HandleFunc {
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

		content.Set(dbmodels.SCAN_FIELD+"+", files)
		if user := req.User(); user != nil {
			content.SetEditor(user.Id)
		}
		if err := app.Save(content); err != nil {
			app.Logger().Error("Failed to upload scans", "entry_id", entry.Id, "content_id", content.Id, "error", err)
			return renderContentsImagesHTMXError(e, "Upload fehlgeschlagen.", isHTMX)
		}

		if !isHTMX {
			redirect := fmt.Sprintf("/almanach/%s/contents/edit", id)
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
		if err := engine.Render(&builder, TEMPLATE_ALMANACH_CONTENTS_IMAGES_PANEL, data, "fragment"); err != nil {
			app.Logger().Error("Failed to render images panel", "entry_id", entry.Id, "content_id", content.Id, "error", err)
			return e.String(http.StatusInternalServerError, "")
		}

		success := `<div hx-swap-oob="innerHTML:#user-message"><div class="text-green-800 text-sm mt-2 rounded-xs bg-green-200 p-2 font-bold border-green-700 shadow border mb-3"><i class="ri-checkbox-circle-fill"></i> Digitalisat gespeichert.</div></div>`
		countOOB := renderContentImagesCountOOB(content)
		return e.HTML(http.StatusOK, builder.String()+success+countOOB)
	}
}

func (p *AlmanachContentsEditPage) POSTDeleteScan(engine *templating.Engine, app core.App) HandleFunc {
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

		content.Set(dbmodels.SCAN_FIELD+"-", scan)
		if user := req.User(); user != nil {
			content.SetEditor(user.Id)
		}
		if err := app.Save(content); err != nil {
			app.Logger().Error("Failed to delete scan", "entry_id", entry.Id, "content_id", content.Id, "scan", scan, "error", err)
			return renderContentsImagesHTMXError(e, "Loeschen fehlgeschlagen.", isHTMX)
		}

		if !isHTMX {
			redirect := fmt.Sprintf("/almanach/%s/contents/edit", id)
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
		if err := engine.Render(&builder, TEMPLATE_ALMANACH_CONTENTS_IMAGES_PANEL, data, "fragment"); err != nil {
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

func parseContentsForm(form url.Values) map[string]map[string][]string {
	contentInputs := map[string]map[string][]string{}
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
		if _, ok := contentInputs[contentID]; !ok {
			contentInputs[contentID] = map[string][]string{}
		}
		contentInputs[contentID][field] = values
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
	Relations   []contentAgentRelationPayload
	NewRelations []contentAgentRelationPayload
	DeletedIDs  []string
}

type contentAgentRender struct {
	Id        string
	Agent     string
	Type      string
	Uncertain bool
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

func validateContentAgentRelations(payload contentAgentRelationsPayload) error {
	for _, relation := range payload.Relations {
		if err := validateRelationTypeValue(relation.Type, dbmodels.AGENT_RELATIONS); err != nil {
			return err
		}
	}
	for _, relation := range payload.NewRelations {
		if err := validateRelationTypeValue(relation.Type, dbmodels.AGENT_RELATIONS); err != nil {
			return err
		}
	}
	return nil
}

func validateRelationTypeValue(value string, allowed []string) error {
	value = strings.TrimSpace(value)
	if value == "" {
		return fmt.Errorf("Ungültiger Beziehungstyp.")
	}
	if !slices.Contains(allowed, value) {
		return fmt.Errorf("Ungültiger Beziehungstyp.")
	}
	return nil
}

func applyContentForm(content *dbmodels.Content, entry *dbmodels.Entry, fields map[string][]string, user *dbmodels.FixedUser, numbering float64) error {
	preferredTitle := buildContentPreferredTitle(content, fields)
	if preferredTitle == "" {
		label := content.Id
		if content.Numbering() > 0 {
			label = strconv.FormatFloat(content.Numbering(), 'f', -1, 64)
		}
		return fmt.Errorf("Kurztitel ist erforderlich (Beitrag %s).", label)
	}

	status := strings.TrimSpace(firstValue(fields["edit_state"]))
	if status == "" {
		status = content.EditState()
	}
	if !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
		return fmt.Errorf("Ungültiger Status (Beitrag %s).", content.Id)
	}

	musenalmTypes := sanitizeContentStrings(fields["musenalm_type"])
	if len(musenalmTypes) == 0 {
		return fmt.Errorf("Musenalm-Typ ist erforderlich (Beitrag %s).", content.Id)
	}

	if numbering <= 0 {
		numbering = content.Numbering()
	}

	content.SetPreferredTitle(preferredTitle)
	if value, ok := optionalFieldValue(fields, "variant_title"); ok {
		content.SetVariantTitle(value)
	}
	if value, ok := optionalFieldValue(fields, "parallel_title"); ok {
		content.SetParallelTitle(value)
	}
	if value, ok := optionalFieldValue(fields, "title_statement"); ok {
		content.SetTitleStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "subtitle_statement"); ok {
		content.SetSubtitleStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "incipit_statement"); ok {
		content.SetIncipitStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "responsibility_statement"); ok {
		content.SetResponsibilityStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "place_statement"); ok {
		content.SetPlaceStmt(value)
	}
	content.SetYear(entry.Year())
	content.SetExtent(strings.TrimSpace(firstValue(fields["extent"])))
	content.SetLanguage(sanitizeContentStrings(fields["language"]))
	if values, ok := fields["content_type"]; ok {
		content.SetContentType(sanitizeContentStrings(values))
	}
	content.SetMusenalmType(musenalmTypes)
	content.SetMusenalmPagination(strings.TrimSpace(firstValue(fields["musenalm_pagination"])))
	content.SetNumbering(numbering)
	content.SetEntry(entry.Id)
	content.SetEditState(status)
	if value, ok := optionalFieldValue(fields, "edit_comment"); ok {
		content.SetComment(value)
	}
	if value, ok := optionalFieldValue(fields, "annotation"); ok {
		content.SetAnnotation(value)
	}
	if user != nil {
		content.SetEditor(user.Id)
	}
	return nil
}

func applyContentAgentRelations(tx core.App, content *dbmodels.Content, payload contentAgentRelationsPayload) error {
	if content == nil {
		return nil
	}
	tableName := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		col, err := tx.FindCollectionByNameOrId(tableName)
		if err != nil {
			return nil, err
		}
		collection = col
		return collection, nil
	}

	for _, relation := range payload.Relations {
		relationID := strings.TrimSpace(relation.ID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			return err
		}
		proxy := dbmodels.NewRContentsAgents(record)
		if proxy.Content() != content.Id {
			return fmt.Errorf("Relation %s gehört zu einem anderen Beitrag.", relationID)
		}
		proxy.SetContent(content.Id)
		proxy.SetAgent(strings.TrimSpace(relation.TargetID))
		proxy.SetType(strings.TrimSpace(relation.Type))
		proxy.SetUncertain(relation.Uncertain)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	for _, relationID := range payload.DeletedIDs {
		relationID = strings.TrimSpace(relationID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			continue
		}
		proxy := dbmodels.NewRContentsAgents(record)
		if proxy.Content() != content.Id {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	for _, relation := range payload.NewRelations {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		col, err := getCollection()
		if err != nil {
			return err
		}
		proxy := dbmodels.NewRContentsAgents(core.NewRecord(col))
		proxy.SetContent(content.Id)
		proxy.SetAgent(targetID)
		proxy.SetType(strings.TrimSpace(relation.Type))
		proxy.SetUncertain(relation.Uncertain)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	return nil
}

func applyContentFormDraft(content *dbmodels.Content, entry *dbmodels.Entry, fields map[string][]string, numbering float64) {
	if value, ok := optionalFieldValue(fields, "variant_title"); ok {
		content.SetVariantTitle(value)
	}
	if value, ok := optionalFieldValue(fields, "parallel_title"); ok {
		content.SetParallelTitle(value)
	}
	if value, ok := optionalFieldValue(fields, "title_statement"); ok {
		content.SetTitleStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "subtitle_statement"); ok {
		content.SetSubtitleStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "incipit_statement"); ok {
		content.SetIncipitStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "responsibility_statement"); ok {
		content.SetResponsibilityStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "place_statement"); ok {
		content.SetPlaceStmt(value)
	}
	if value, ok := optionalFieldValue(fields, "edit_comment"); ok {
		content.SetComment(value)
	}
	if value, ok := optionalFieldValue(fields, "annotation"); ok {
		content.SetAnnotation(value)
	}

	content.SetExtent(strings.TrimSpace(firstValue(fields["extent"])))
	content.SetLanguage(sanitizeContentStrings(fields["language"]))
	if values, ok := fields["content_type"]; ok {
		content.SetContentType(sanitizeContentStrings(values))
	}
	content.SetMusenalmType(sanitizeContentStrings(fields["musenalm_type"]))
	content.SetMusenalmPagination(strings.TrimSpace(firstValue(fields["musenalm_pagination"])))
	content.SetEntry(entry.Id)
	content.SetYear(entry.Year())

	if status := strings.TrimSpace(firstValue(fields["edit_state"])); status != "" {
		content.SetEditState(status)
	}
	if numbering > 0 {
		content.SetNumbering(numbering)
	}
	if preferredTitle := buildContentPreferredTitle(content, fields); preferredTitle != "" {
		content.SetPreferredTitle(preferredTitle)
	}
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

func buildContentPreferredTitle(content *dbmodels.Content, fields map[string][]string) string {
	title := fieldOrCurrent(fields, "title_statement", content.TitleStmt())
	if title != "" {
		return title
	}
	subtitle := fieldOrCurrent(fields, "subtitle_statement", content.SubtitleStmt())
	if subtitle != "" {
		return subtitle
	}
	incipit := fieldOrCurrent(fields, "incipit_statement", content.IncipitStmt())
	if incipit != "" {
		return incipit
	}

	types := fields["musenalm_type"]
	if _, ok := fields["musenalm_type"]; !ok {
		types = content.MusenalmType()
	}
	types = sanitizeContentStrings(types)
	typeLabel := strings.Join(types, ", ")
	responsibility := fieldOrCurrent(fields, "responsibility_statement", content.ResponsibilityStmt())
	if responsibility != "" && !strings.EqualFold(responsibility, "unbezeichnet") {
		if typeLabel != "" {
			return fmt.Sprintf("[%s] Unterzeichnet: %s", typeLabel, responsibility)
		}
		return fmt.Sprintf("Unterzeichnet: %s", responsibility)
	}

	extent := fieldOrCurrent(fields, "extent", content.Extent())
	if typeLabel == "" {
		typeLabel = "Beitrag"
	}
	if extent != "" {
		return fmt.Sprintf("[%s %s]", typeLabel, extent)
	}
	return fmt.Sprintf("[%s]", typeLabel)
}

func optionalFieldValue(fields map[string][]string, key string) (string, bool) {
	values, ok := fields[key]
	if !ok {
		return "", false
	}
	return strings.TrimSpace(firstValue(values)), true
}

func fieldOrCurrent(fields map[string][]string, key, current string) string {
	if value, ok := optionalFieldValue(fields, key); ok {
		return value
	}
	return strings.TrimSpace(current)
}

func firstValue(values []string) string {
	if len(values) == 0 {
		return ""
	}
	return values[0]
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

func updateContentsFTS5(app core.App, entry *dbmodels.Entry, contents []*dbmodels.Content) {
	if len(contents) == 0 {
		return
	}
	agents, relations, err := dbmodels.AgentsForContents(app, contents)
	if err != nil {
		app.Logger().Error("Failed to load content agents for FTS5 update", "entry_id", entry.Id, "error", err)
		return
	}
	for _, content := range contents {
		contentAgents := []*dbmodels.Agent{}
		for _, rel := range relations[content.Id] {
			if agent := agents[rel.Agent()]; agent != nil {
				contentAgents = append(contentAgents, agent)
			}
		}
		if err := dbmodels.UpdateFTS5Content(app, content, entry, contentAgents); err != nil {
			app.Logger().Error("Failed to update FTS5 content", "content_id", content.Id, "error", err)
		}
	}
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
