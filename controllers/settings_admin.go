package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"sort"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/imports"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_SETTINGS_ADMIN        = "/redaktion/settings/"
	URL_SETTINGS_SAVE         = "save/"
	URL_SETTINGS_DELETE       = "delete/"
	URL_SETTINGS_FTS5_REBUILD = "fts5/rebuild/"
	TEMPLATE_SETTINGS         = "/redaktion/settings/"
)

func init() {
	app.Register(&SettingsAdmin{})
}

type SettingsAdmin struct{}

func (p *SettingsAdmin) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *SettingsAdmin) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *SettingsAdmin) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	appInstance := ia.Core()
	rg := router.Group(URL_SETTINGS_ADMIN)
	rg.BindFunc(middleware.Authenticated(appInstance))
	rg.BindFunc(middleware.IsAdmin())
	rg.GET("", p.redirectHandler())
	rg.POST(URL_SETTINGS_SAVE, handleSettingSave(appInstance, URL_SETTINGS_ADMIN))
	rg.POST(URL_SETTINGS_DELETE, handleSettingDelete(appInstance, URL_SETTINGS_ADMIN))
	rg.POST(URL_SETTINGS_FTS5_REBUILD, handleFTS5Rebuild(appInstance, URL_SETTINGS_ADMIN))
	return nil
}

type settingView struct {
	Key     string
	Value   string
	Updated types.DateTime
}

func (p *SettingsAdmin) redirectHandler() HandleFunc {
	return func(e *core.RequestEvent) error {
		return e.Redirect(http.StatusSeeOther, URL_EXPORTS_ADMIN)
	}
}

func handleSettingSave(app core.App, redirectBase string) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := e.Request.ParseForm(); err != nil {
			return redirectSettingsError(e, redirectBase, "Formulardaten ungueltig.")
		}
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return redirectSettingsError(e, redirectBase, err.Error())
		}

		key := strings.TrimSpace(e.Request.FormValue("key"))
		if key == "" {
			return redirectSettingsError(e, redirectBase, "Schluessel darf nicht leer sein.")
		}

		valueRaw := strings.TrimSpace(e.Request.FormValue("value"))
		value := parseSettingValue(valueRaw)

		collection, err := app.FindCollectionByNameOrId(dbmodels.SETTINGS_TABLE)
		if err != nil {
			return redirectSettingsError(e, redirectBase, "Einstellungen-Tabelle nicht verfuegbar.")
		}

		var record *core.Record
		existing, err := dbmodels.Settings_Key(app, key)
		if err != nil {
			if !isRecordNotFound(err) {
				return redirectSettingsError(e, redirectBase, "Konnte Einstellung nicht laden.")
			}
		} else if existing != nil {
			record = existing.ProxyRecord()
		}

		if record == nil {
			record = core.NewRecord(collection)
		}

		record.Set(dbmodels.KEY_FIELD, key)
		record.Set(dbmodels.VALUE_FIELD, value)
		if err := app.Save(record); err != nil {
			return redirectSettingsError(e, redirectBase, "Einstellung konnte nicht gespeichert werden.")
		}

		setFlashSuccess(e, "Einstellung gespeichert.")
		return e.Redirect(http.StatusSeeOther, redirectBase)
	}
}

func handleSettingDelete(app core.App, redirectBase string) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := e.Request.ParseForm(); err != nil {
			return redirectSettingsError(e, redirectBase, "Formulardaten ungueltig.")
		}
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return redirectSettingsError(e, redirectBase, err.Error())
		}

		key := strings.TrimSpace(e.Request.FormValue("key"))
		if key == "" {
			return redirectSettingsError(e, redirectBase, "Schluessel darf nicht leer sein.")
		}

		record, err := dbmodels.Settings_Key(app, key)
		if err != nil {
			if isRecordNotFound(err) {
				setFlashSuccess(e, "Einstellung entfernt.")
				return e.Redirect(http.StatusSeeOther, redirectBase)
			}
			return redirectSettingsError(e, redirectBase, "Einstellung konnte nicht geladen werden.")
		}

		if err := app.Delete(record.ProxyRecord()); err != nil {
			return redirectSettingsError(e, redirectBase, "Einstellung konnte nicht entfernt werden.")
		}

		setFlashSuccess(e, "Einstellung entfernt.")
		return e.Redirect(http.StatusSeeOther, redirectBase)
	}
}

func handleFTS5Rebuild(app core.App, redirectBase string) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := e.Request.ParseForm(); err != nil {
			return redirectSettingsError(e, redirectBase, "Formulardaten ungueltig.")
		}
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return redirectSettingsError(e, redirectBase, err.Error())
		}

		status, err := imports.StartFTS5Rebuild(app, true)
		if err != nil {
			return redirectSettingsError(e, redirectBase, err.Error())
		}
		if status == "running" {
			return redirectSettingsError(e, redirectBase, "FTS5-Neuaufbau läuft bereits.")
		}
		if status == "restarting" {
			setFlashSuccess(e, "FTS5-Neuaufbau wird neu gestartet.")
			return e.Redirect(http.StatusSeeOther, redirectBase)
		}

		setFlashSuccess(e, "FTS5-Neuaufbau gestartet.")
		return e.Redirect(http.StatusSeeOther, redirectBase)
	}
}

func settingsData(app core.App) (map[string]any, error) {
	settings, err := dbmodels.Settings_All(app)
	if err != nil {
		return nil, err
	}

	list := make([]settingView, 0, len(settings))
	for _, setting := range settings {
		if setting == nil {
			continue
		}
		list = append(list, settingView{
			Key:     setting.Key(),
			Value:   formatSettingValue(setting.Value()),
			Updated: setting.GetDateTime(dbmodels.UPDATED_FIELD),
		})
	}

	sort.Slice(list, func(i, j int) bool {
		return list[i].Key < list[j].Key
	})

	var lastRebuild string
	var lastRebuildDT types.DateTime
	if setting, err := dbmodels.Settings_Key(app, "fts5_last_rebuild"); err == nil && setting != nil {
		if dt, ok := parseSettingDateTime(setting.Value()); ok {
			lastRebuildDT = dt
			lastRebuild = formatSettingValue(dt)
		} else {
			lastRebuild = formatSettingValue(setting.Value())
		}
	}

	return map[string]any{
		"settings":             list,
		"fts5_last_rebuild":    lastRebuild,
		"fts5_last_rebuild_dt": lastRebuildDT,
	}, nil
}

func parseSettingValue(valueRaw string) any {
	if valueRaw == "" {
		return ""
	}
	var parsed any
	if err := json.Unmarshal([]byte(valueRaw), &parsed); err == nil {
		return parsed
	}
	return valueRaw
}

func formatSettingValue(value any) string {
	if value == nil {
		return ""
	}
	if formatted, ok := formatSettingDateTime(value); ok {
		return formatted
	}
	if str, ok := parseSettingString(value); ok && str != "" {
		return str
	}
	data, err := json.Marshal(value)
	if err != nil {
		return fmt.Sprintf("%v", value)
	}
	return string(data)
}

func isRecordNotFound(err error) bool {
	if err == nil {
		return false
	}
	msg := err.Error()
	return strings.Contains(msg, "no rows in result set") || strings.Contains(msg, "not found")
}

func redirectSettingsError(e *core.RequestEvent, baseURL, message string) error {
	redirect := fmt.Sprintf("%s?error=%s", baseURL, url.QueryEscape(message))
	return e.Redirect(http.StatusSeeOther, redirect)
}
