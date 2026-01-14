package controllers

import (
	"encoding/json"
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
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_SEITEN_EDITOR       = "/redaktion/seiten/"
	URL_SEITEN_EDITOR_FORM  = "form/"
	URL_SEITEN_EDITOR_SAVE  = "save/"
	TEMPLATE_SEITEN_EDITOR  = "/redaktion/seiten/"
	TEMPLATE_SEITEN_FORM    = "/redaktion/seiten/form/"
	LAYOUT_FRAGMENT         = "fragment"
	pageHTMLPrefixSeparator = "."
)

func init() {
	p := &SeitenEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_SEITEN_EDIT_NAME,
			URL:      URL_SEITEN_EDITOR,
			Template: TEMPLATE_SEITEN_EDITOR,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(p)
}

type SeitenEditPage struct {
	pagemodels.StaticPage
}

type SeitenEditorPageItem struct {
	Key   string
	Title string
}

type SeitenEditorSection struct {
	Key   string
	Label string
	HTML  string
}

type SeitenEditorSelected struct {
	Key         string
	Title       string
	Description string
	Keywords    string
	Sections    []SeitenEditorSection
}

func (p *SeitenEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_SEITEN_EDITOR)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.GET(URL_SEITEN_EDITOR_FORM, p.GETForm(engine, app))
	rg.POST(URL_SEITEN_EDITOR_SAVE, p.POSTSave(engine, ia))
	return nil
}

func (p *SeitenEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data, err := seitenEditorData(e, app)
		if err != nil {
			return engine.Response500(e, err, nil)
		}
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *SeitenEditPage) GETForm(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data, err := seitenEditorData(e, app)
		if err != nil {
			return engine.Response500(e, err, nil)
		}
		return engine.Response200(e, TEMPLATE_SEITEN_FORM, data, LAYOUT_FRAGMENT)
	}
}

func (p *SeitenEditPage) POSTSave(engine *templating.Engine, ia pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		app := ia.Core()
		req := templating.NewRequest(e)

		if err := e.Request.ParseForm(); err != nil {
			return p.redirectError(e, "Formulardaten ungültig.")
		}

		csrfToken := e.Request.FormValue("csrf_token")
		if err := req.CheckCSRF(csrfToken); err != nil {
			return p.redirectError(e, err.Error())
		}

		pageKey := strings.TrimSpace(e.Request.FormValue("page_key"))
		if pageKey == "" {
			return p.redirectError(e, "Bitte eine Seite auswählen.")
		}

		title := strings.TrimSpace(e.Request.FormValue("title"))
		description := strings.TrimSpace(e.Request.FormValue("description"))
		keywords := strings.TrimSpace(e.Request.FormValue("keywords"))

		htmlUpdates := make(map[string]string)
		for key, values := range e.Request.Form {
			if !strings.HasPrefix(key, "html[") || !strings.HasSuffix(key, "]") {
				continue
			}
			htmlKey := strings.TrimSuffix(strings.TrimPrefix(key, "html["), "]")
			if htmlKey == "" || len(values) == 0 {
				continue
			}
			htmlUpdates[htmlKey] = values[0]
		}

		pagesCollection, err := app.FindCollectionByNameOrId(dbmodels.PAGES_TABLE)
		if err != nil {
			app.Logger().Error("Failed to load pages collection", "error", err)
			return p.redirectError(e, "Speichern fehlgeschlagen.")
		}

		pageRecord, err := app.FindFirstRecordByData(pagesCollection.Id, dbmodels.KEY_FIELD, pageKey)
		if err != nil || pageRecord == nil {
			return p.redirectError(e, "Seite nicht gefunden.")
		}

		data := map[string]any{}
		if existing := pageRecord.Get(dbmodels.DATA_FIELD); existing != nil {
			switch value := existing.(type) {
			case map[string]any:
				data = value
			case types.JSONRaw:
				if err := json.Unmarshal(value, &data); err != nil {
					app.Logger().Error("Failed to unmarshal page data", "error", err)
				}
			}
		}
		data["description"] = description
		data["keywords"] = keywords

		pageRecord.Set(dbmodels.TITLE_FIELD, title)
		pageRecord.Set(dbmodels.DATA_FIELD, data)

		htmlCollection, err := app.FindCollectionByNameOrId(dbmodels.HTML_TABLE)
		if err != nil {
			app.Logger().Error("Failed to load html collection", "error", err)
			return p.redirectError(e, "Speichern fehlgeschlagen.")
		}

		if err := app.RunInTransaction(func(tx core.App) error {
			if err := tx.Save(pageRecord); err != nil {
				return err
			}
			for key, value := range htmlUpdates {
				record, _ := tx.FindFirstRecordByData(htmlCollection.Id, dbmodels.KEY_FIELD, key)
				if record == nil {
					record = core.NewRecord(htmlCollection)
					record.Set(dbmodels.KEY_FIELD, key)
				}
				record.Set(dbmodels.HTML_FIELD, value)
				if err := tx.Save(record); err != nil {
					return err
				}
			}
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save page data", "page", pageKey, "error", err)
			return p.redirectError(e, "Speichern fehlgeschlagen.")
		}

		go ia.ResetPagesCache()
		go ia.ResetHtmlCache()

		redirect := fmt.Sprintf("%s?key=%s&success=%s", URL_SEITEN_EDITOR, url.QueryEscape(pageKey), url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *SeitenEditPage) redirectError(e *core.RequestEvent, message string) error {
	redirect := fmt.Sprintf("%s?error=%s", URL_SEITEN_EDITOR, url.QueryEscape(message))
	return e.Redirect(http.StatusSeeOther, redirect)
}

func seitenEditorData(e *core.RequestEvent, app core.App) (map[string]any, error) {
	pages, err := seitenEditorPages(app)
	if err != nil {
		return nil, err
	}

	selectedKey := strings.TrimSpace(e.Request.URL.Query().Get("key"))
	if selectedKey == "" && len(pages) > 0 {
		selectedKey = pages[0].Key
	}

	var selected *SeitenEditorSelected
	if selectedKey != "" {
		selected, err = seitenEditorSelected(app, selectedKey)
		if err != nil {
			return nil, err
		}
	}

	data := map[string]any{
		"pages":        pages,
		"selected":     selected,
		"selected_key": selectedKey,
	}

	req := templating.NewRequest(e)
	if req.Session() != nil {
		data["csrf_token"] = req.Session().Token
	} else {
		data["csrf_token"] = ""
	}

	if msg := e.Request.URL.Query().Get("success"); msg != "" {
		data["success"] = msg
	}
	if msg := e.Request.URL.Query().Get("error"); msg != "" {
		data["error"] = msg
	}

	return data, nil
}

func seitenEditorPages(app core.App) ([]SeitenEditorPageItem, error) {
	pages, err := dbmodels.Pages_All(app)
	if err != nil {
		return nil, err
	}

	items := make([]SeitenEditorPageItem, 0, len(pages))
	for _, page := range pages {
		title := strings.TrimSpace(page.Title())
		if title == "" {
			title = page.Key()
		}
		items = append(items, SeitenEditorPageItem{
			Key:   page.Key(),
			Title: title,
		})
	}

	slices.SortFunc(items, func(a, b SeitenEditorPageItem) int {
		return strings.Compare(strings.ToLower(a.Title), strings.ToLower(b.Title))
	})

	return items, nil
}

func seitenEditorSelected(app core.App, key string) (*SeitenEditorSelected, error) {
	page, err := dbmodels.TableByField[dbmodels.Page](app, dbmodels.PAGES_TABLE, dbmodels.KEY_FIELD, key)
	if err != nil {
		return nil, err
	}

	description := ""
	keywords := ""
	if data := (&page).Data(); data != nil {
		if value, ok := data["description"]; ok && value != nil {
			description = fmt.Sprint(value)
		}
		if value, ok := data["keywords"]; ok && value != nil {
			keywords = fmt.Sprint(value)
		}
	}

	sections, err := seitenEditorSections(app, key)
	if err != nil {
		return nil, err
	}

	return &SeitenEditorSelected{
		Key:         key,
		Title:       page.Title(),
		Description: description,
		Keywords:    keywords,
		Sections:    sections,
	}, nil
}

func seitenEditorSections(app core.App, key string) ([]SeitenEditorSection, error) {
	prefix := "page." + key
	records := make([]*dbmodels.HTML, 0)
	err := app.RecordQuery(dbmodels.HTML_TABLE).
		Where(dbx.NewExp(dbmodels.KEY_FIELD+" LIKE {:prefix}", dbx.Params{"prefix": prefix + "%"})).
		All(&records)
	if err != nil {
		return nil, err
	}

	sections := make([]SeitenEditorSection, 0, len(records))
	for _, record := range records {
		section := strings.TrimPrefix(record.Key(), prefix)
		section = strings.TrimPrefix(section, pageHTMLPrefixSeparator)
		label := "Inhalt"
		if section != "" {
			label = strings.ReplaceAll(section, "_", " ")
		}

		sections = append(sections, SeitenEditorSection{
			Key:   record.Key(),
			Label: label,
			HTML:  seitenEditorHTMLValue(record.HTML()),
		})
	}

	slices.SortFunc(sections, func(a, b SeitenEditorSection) int {
		return strings.Compare(a.Key, b.Key)
	})

	return sections, nil
}

func seitenEditorHTMLValue(value any) string {
	switch v := value.(type) {
	case string:
		return v
	case []byte:
		return string(v)
	case types.JSONRaw:
		return string(v)
	default:
		return fmt.Sprint(value)
	}
}
