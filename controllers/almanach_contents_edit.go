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
	"github.com/pocketbase/pocketbase/tools/security"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_ALMANACH_CONTENTS_EDIT      = "contents/edit"
	URL_ALMANACH_CONTENTS_INSERT    = "contents/insert"
	URL_ALMANACH_CONTENTS_DELETE    = "contents/delete"
	TEMPLATE_ALMANACH_CONTENTS_EDIT = "/almanach/contents/edit/"
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
	rg.POST(URL_ALMANACH_CONTENTS_EDIT, p.POSTSave(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_INSERT, p.POSTInsert(engine, app))
	rg.POST(URL_ALMANACH_CONTENTS_DELETE, p.POSTDelete(engine, app))
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

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}
		data["edit_content_id"] = strings.TrimSpace(e.Request.URL.Query().Get("edit_content"))
		data["new_content"] = strings.TrimSpace(e.Request.URL.Query().Get("new_content"))

		return engine.Response200(e, p.Template, data, p.Layout)
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
	data["error"] = message
	data["edit_content_id"] = strings.TrimSpace(e.Request.URL.Query().Get("edit_content"))
	data["new_content"] = strings.TrimSpace(e.Request.URL.Query().Get("new_content"))
	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *AlmanachContentsEditPage) POSTSave(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		isHTMX := strings.EqualFold(e.Request.Header.Get("HX-Request"), "true")

		if err := e.Request.ParseForm(); err != nil {
			return p.renderSaveError(engine, app, e, req, nil, nil, err.Error(), isHTMX)
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return p.renderSaveError(engine, app, e, req, nil, nil, err.Error(), isHTMX)
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		contents, err := dbmodels.Contents_Entry(app, entry.Id)
		if err != nil {
			return p.renderSaveError(engine, app, e, req, entry, nil, "Beiträge konnten nicht geladen werden.", isHTMX)
		}

		contentInputs := parseContentsForm(e.Request.PostForm)
		contentOrder := parseContentsOrder(e.Request.PostForm)
		orderMap := buildContentOrderMap(contentOrder)
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
			}
			updatedContents = append(updatedContents, contents...)
			updatedContents = append(updatedContents, created...)
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save contents", "entry_id", entry.Id, "error", err)
			return p.renderSaveError(engine, app, e, req, entry, contentInputs, err.Error(), isHTMX)
		}

		if len(updatedContents) == 0 {
			updatedContents = contents
		}
		go updateContentsFTS5(app, entry, updatedContents)

		redirect := fmt.Sprintf("/almanach/%s/contents/edit?saved_message=%s", id, url.QueryEscape("Änderungen gespeichert."))
		if isHTMX {
			e.Response.Header().Set("HX-Redirect", redirect)
			return e.String(http.StatusOK, "")
		}
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) POSTInsert(engine *templating.Engine, app core.App) HandleFunc {
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

		contentCollection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err != nil {
			return p.renderError(engine, app, e, "Beitrag konnte nicht vorbereitet werden.")
		}

		record := core.NewRecord(contentCollection)
		record.Id = "tmp" + security.PseudorandomString(8)
		record.MarkAsNew()
		newContent := dbmodels.NewContent(record)
		newContent.SetEntry(entry.Id)
		newContent.SetYear(entry.Year())
		newContent.SetEditState("Edited")

		data := map[string]any{
			"content":           newContent,
			"entry":             entry,
			"csrf_token":        req.Session().Token,
			"content_types":     dbmodels.CONTENT_TYPE_VALUES,
			"musenalm_types":    dbmodels.MUSENALM_TYPE_VALUES,
			"pagination_values": paginationValuesSorted(),
			"open_edit":         true,
			"is_new":            true,
			"content_id":        record.Id,
		}

		var builder strings.Builder
		if err := engine.Render(&builder, "/almanach/contents/insert/", data, "fragment"); err != nil {
			app.Logger().Error("Failed to render content insert", "entry_id", entry.Id, "error", err)
			return p.renderError(engine, app, e, "Beitrag konnte nicht vorbereitet werden.")
		}

		return e.HTML(http.StatusOK, builder.String())
	}
}

func (p *AlmanachContentsEditPage) POSTDelete(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

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

		redirect := fmt.Sprintf("/almanach/%s/contents/edit", id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AlmanachContentsEditPage) renderSaveError(
	engine *templating.Engine,
	app core.App,
	e *core.RequestEvent,
	req *templating.Request,
	entry *dbmodels.Entry,
	contentInputs map[string]map[string][]string,
	message string,
	isHTMX bool,
) error {
	if !isHTMX {
		return p.renderError(engine, app, e, message)
	}
	if entry == nil {
		id := e.Request.PathValue("id")
		result, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return p.renderError(engine, app, e, message)
		}
		entry = result
	}

	contentID := ""
	fields := map[string][]string{}
	if contentInputs != nil {
		for id, values := range contentInputs {
			contentID = id
			fields = values
			break
		}
	}
	if contentID == "" {
		return p.renderError(engine, app, e, message)
	}

	content := (*dbmodels.Content)(nil)
	contents, err := dbmodels.Contents_Entry(app, entry.Id)
	if err == nil {
		for _, existing := range contents {
			if existing.Id == contentID {
				content = existing
				break
			}
		}
	}
	isNew := false
	if content == nil {
		contentCollection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
		if err != nil {
			return p.renderError(engine, app, e, message)
		}
		record := core.NewRecord(contentCollection)
		record.Id = contentID
		record.MarkAsNew()
		content = dbmodels.NewContent(record)
		content.SetEditState("Edited")
		isNew = true
	}

	numbering := 0.0
	if order := parseContentsOrder(e.Request.PostForm); len(order) > 0 {
		if mapped, ok := buildContentOrderMap(order)[contentID]; ok {
			numbering = mapped
		}
	}
	applyContentFormDraft(content, entry, fields, numbering)

	data := map[string]any{
		"content":           content,
		"content_id":        contentID,
		"entry":             entry,
		"csrf_token":        req.Session().Token,
		"content_types":     dbmodels.CONTENT_TYPE_VALUES,
		"musenalm_types":    dbmodels.MUSENALM_TYPE_VALUES,
		"pagination_values": paginationValuesSorted(),
		"open_edit":         true,
		"is_new":            isNew,
		"error":             message,
	}

	var builder strings.Builder
	if err := engine.Render(&builder, "/almanach/contents/item/", data, "fragment"); err != nil {
		app.Logger().Error("Failed to render content save error", "entry_id", entry.Id, "content_id", contentID, "error", err)
		return p.renderError(engine, app, e, message)
	}

	return e.HTML(http.StatusOK, builder.String())
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
