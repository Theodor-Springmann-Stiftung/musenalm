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
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

func init() {
	ap := &AbkuerzungenPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ABKUERZUNGEN_NAME,
			URL:      URL_ABKUERZUNGEN,
			Template: TEMPLATE_ABKUERZUNGEN,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(ap)
}

type AbkuerzungenPage struct {
	pagemodels.StaticPage
}

type AbkEntry struct {
	Key   string
	Value string
}

type AbkuerzungenResult struct {
	Entries []AbkEntry
}

func (p *AbkuerzungenPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_ABKUERZUNGEN)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.GET(engine, app))
	rg.POST("", p.POST(engine, ia))

	return nil
}

func (p *AbkuerzungenPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		// Read abbreviations from data table
		dataRecord, err := dbmodels.Data_Key(app, "abkuerzungen")
		if err != nil {
			return engine.Response500(e, err, nil)
		}

		// Parse JSON value into map
		abkMap := make(map[string]string)
		rawValue := dataRecord.Value()

		// Convert via JSON marshal/unmarshal to handle types.JSONRaw
		jsonBytes, err := json.Marshal(rawValue)
		if err != nil {
			app.Logger().Error("Failed to marshal abkürzungen", "error", err)
			return engine.Response500(e, err, nil)
		}

		if err := json.Unmarshal(jsonBytes, &abkMap); err != nil {
			app.Logger().Error("Failed to unmarshal abkürzungen", "error", err)
			return engine.Response500(e, err, nil)
		}

		// Convert to sorted array
		entries := []AbkEntry{}
		for k, v := range abkMap {
			entries = append(entries, AbkEntry{Key: k, Value: v})
		}

		// Sort by key (German collation)
		collator := collate.New(language.German)
		slices.SortFunc(entries, func(a, b AbkEntry) int {
			return collator.CompareString(a.Key, b.Key)
		})

		data := map[string]any{
			"result": &AbkuerzungenResult{Entries: entries},
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

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *AbkuerzungenPage) POST(engine *templating.Engine, ia pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		app := ia.Core()
		req := templating.NewRequest(e)

		// Parse form manually to handle array syntax
		if err := e.Request.ParseForm(); err != nil {
			return p.redirectError(e, "Formulardaten ungültig.")
		}

		csrfToken := e.Request.FormValue("csrf_token")

		// Validate CSRF
		if err := req.CheckCSRF(csrfToken); err != nil {
			return p.redirectError(e, err.Error())
		}

		// Build new map from form data
		newMap := make(map[string]string)

		// Parse array fields manually
		form := e.Request.Form
		i := 0
		for {
			keyField := fmt.Sprintf("abkuerzungen[%d][key]", i)
			valueField := fmt.Sprintf("abkuerzungen[%d][value]", i)
			deleteField := fmt.Sprintf("abkuerzungen[%d][_delete]", i)

			key := form.Get(keyField)
			value := form.Get(valueField)
			delete := form.Get(deleteField)

			// No more entries
			if key == "" && value == "" {
				break
			}

			app.Logger().Info("Form entry", "i", i, "key", key, "value", value, "delete", delete)
			i++

			// Skip deleted or empty entries
			if delete == "true" || strings.TrimSpace(key) == "" {
				continue
			}

			key = strings.TrimSpace(key)
			value = strings.TrimSpace(value)

			// Validate required value
			if value == "" {
				return p.redirectError(e, fmt.Sprintf("Abkürzung '%s' benötigt eine Beschreibung.", key))
			}

			// Check for duplicates
			if _, exists := newMap[key]; exists {
				return p.redirectError(e, fmt.Sprintf("Doppelter Schlüssel: '%s'", key))
			}

			newMap[key] = value
		}

		app.Logger().Info("Saving abkürzungen", "count", len(newMap))

		// Update data record
		dataRecord, err := dbmodels.Data_Key(app, "abkuerzungen")
		if err != nil {
			app.Logger().Error("Failed to load abkuerzungen record", "error", err)
			return p.redirectError(e, "Laden der Daten fehlgeschlagen.")
		}

		dataRecord.Set(dbmodels.VALUE_FIELD, newMap)
		if err := app.Save(dataRecord); err != nil {
			app.Logger().Error("Failed to save abkuerzungen", "error", err)
			return p.redirectError(e, "Speichern fehlgeschlagen.")
		}

		go ia.ResetDataCache()

		// Redirect with success message
		redirect := fmt.Sprintf("%s?success=%s", URL_ABKUERZUNGEN, url.QueryEscape("Änderungen gespeichert."))
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}

func (p *AbkuerzungenPage) redirectError(e *core.RequestEvent, message string) error {
	redirect := fmt.Sprintf("%s?error=%s", URL_ABKUERZUNGEN, url.QueryEscape(message))
	return e.Redirect(http.StatusSeeOther, redirect)
}
