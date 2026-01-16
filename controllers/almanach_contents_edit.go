package controllers

import (
	"fmt"
	"maps"
	"net/http"
	"net/url"
	"slices"
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
		data["pagination_values"] = slices.Collect(maps.Values(dbmodels.MUSENALM_PAGINATION_VALUES))

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}

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
	data["pagination_values"] = slices.Collect(maps.Values(dbmodels.MUSENALM_PAGINATION_VALUES))
	data["error"] = message
	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *AlmanachContentsEditPage) POSTSave(engine *templating.Engine, app core.App) HandleFunc {
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

		contents, err := dbmodels.Contents_Entry(app, entry.Id)
		if err != nil {
			return p.renderError(engine, app, e, "Beiträge konnten nicht geladen werden.")
		}

		contentInputs := parseContentsForm(e.Request.PostForm)
		user := req.User()

		if err := app.RunInTransaction(func(tx core.App) error {
			for _, content := range contents {
				fields, ok := contentInputs[content.Id]
				if !ok {
					continue
				}
				if err := applyContentForm(content, entry, fields, user); err != nil {
					return err
				}
				if err := tx.Save(content); err != nil {
					return err
				}
			}
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save contents", "entry_id", entry.Id, "error", err)
			return p.renderError(engine, app, e, err.Error())
		}

		go updateContentsFTS5(app, entry, contents)

		redirect := fmt.Sprintf("/almanach/%s/contents/edit?saved_message=%s", id, url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
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

func applyContentForm(content *dbmodels.Content, entry *dbmodels.Entry, fields map[string][]string, user *dbmodels.FixedUser) error {
	preferredTitle := strings.TrimSpace(firstValue(fields["preferred_title"]))
	if preferredTitle == "" {
		label := content.Id
		if content.Numbering() > 0 {
			label = strconv.FormatFloat(content.Numbering(), 'f', -1, 64)
		}
		return fmt.Errorf("Kurztitel ist erforderlich (Beitrag %s).", label)
	}

	yearValue := strings.TrimSpace(firstValue(fields["year"]))
	year := 0
	if yearValue != "" {
		parsed, err := strconv.Atoi(yearValue)
		if err != nil {
			return fmt.Errorf("Ungültiges Jahr (Beitrag %s).", content.Id)
		}
		year = parsed
	}

	numberingValue := strings.TrimSpace(firstValue(fields["numbering"]))
	numbering := 0.0
	if numberingValue != "" {
		parsed, err := strconv.ParseFloat(numberingValue, 64)
		if err != nil {
			return fmt.Errorf("Ungültige Nummerierung (Beitrag %s).", content.Id)
		}
		numbering = parsed
	}

	status := strings.TrimSpace(firstValue(fields["edit_state"]))
	if status == "" {
		status = content.EditState()
	}
	if !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
		return fmt.Errorf("Ungültiger Status (Beitrag %s).", content.Id)
	}

	content.SetPreferredTitle(preferredTitle)
	content.SetVariantTitle(strings.TrimSpace(firstValue(fields["variant_title"])))
	content.SetParallelTitle(strings.TrimSpace(firstValue(fields["parallel_title"])))
	content.SetTitleStmt(strings.TrimSpace(firstValue(fields["title_statement"])))
	content.SetSubtitleStmt(strings.TrimSpace(firstValue(fields["subtitle_statement"])))
	content.SetIncipitStmt(strings.TrimSpace(firstValue(fields["incipit_statement"])))
	content.SetResponsibilityStmt(strings.TrimSpace(firstValue(fields["responsibility_statement"])))
	content.SetPlaceStmt(strings.TrimSpace(firstValue(fields["place_statement"])))
	content.SetPublicationStmt(strings.TrimSpace(firstValue(fields["publication_statement"])))
	content.SetYear(year)
	content.SetExtent(strings.TrimSpace(firstValue(fields["extent"])))
	content.SetDimensions(strings.TrimSpace(firstValue(fields["dimensions"])))
	content.SetLanguage(fields["language"])
	content.SetContentType(fields["content_type"])
	content.SetMusenalmType(fields["musenalm_type"])
	content.SetMusenalmPagination(strings.TrimSpace(firstValue(fields["musenalm_pagination"])))
	content.SetNumbering(numbering)
	content.SetEntry(entry.Id)
	content.SetMusenalmID(entry.MusenalmID())
	content.SetEditState(status)
	content.SetComment(strings.TrimSpace(firstValue(fields["edit_comment"])))
	content.SetAnnotation(strings.TrimSpace(firstValue(fields["annotation"])))
	if user != nil {
		content.SetEditor(user.Id)
	}
	return nil
}

func firstValue(values []string) string {
	if len(values) == 0 {
		return ""
	}
	return values[0]
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
