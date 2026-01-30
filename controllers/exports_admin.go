package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/exports"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/imports"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_EXPORTS_ADMIN        = "/redaktion/exports/"
	URL_EXPORTS_RUN          = "run/"
	URL_EXPORTS_LIST         = "list/"
	URL_EXPORTS_DOWNLOAD     = "download/"
	URL_EXPORTS_DELETE       = "delete/"
	URL_EXPORTS_SETTINGS     = "settings/"
	URL_EXPORTS_FTS5_REBUILD = "fts5/rebuild/"
	URL_EXPORTS_FTS5_STATUS  = "fts5/status/"
	TEMPLATE_EXPORTS         = "/redaktion/exports/"
	TEMPLATE_EXPORTS_LIST    = "/redaktion/exports/list/"
	LAYOUT_EXPORTS_FRAGMENT  = "fragment"
)

func init() {
	app.Register(&ExportsAdmin{})
}

type ExportsAdmin struct{}

func (p *ExportsAdmin) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *ExportsAdmin) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *ExportsAdmin) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	appInstance := ia.Core()
	exports.StartCleanup(appInstance, 12*time.Hour)

	rg := router.Group(URL_EXPORTS_ADMIN)
	rg.BindFunc(middleware.Authenticated(appInstance))
	rg.BindFunc(middleware.IsAdmin())
	rg.GET("", p.pageHandler(engine, appInstance))
	rg.GET(URL_EXPORTS_LIST, p.listHandler(engine, appInstance))
	rg.POST(URL_EXPORTS_RUN, p.runHandler(appInstance))
	rg.GET(URL_EXPORTS_DOWNLOAD+"{id}", p.downloadHandler(appInstance))
	rg.POST(URL_EXPORTS_DELETE+"{id}", p.deleteHandler(appInstance))
	rg.POST(URL_EXPORTS_SETTINGS+"save/", handleSettingSave(appInstance, URL_EXPORTS_ADMIN))
	rg.POST(URL_EXPORTS_SETTINGS+"delete/", handleSettingDelete(appInstance, URL_EXPORTS_ADMIN))
	rg.POST(URL_EXPORTS_FTS5_REBUILD, p.fts5RunHandler(appInstance))
	rg.GET(URL_EXPORTS_FTS5_STATUS, p.fts5StatusHandler(appInstance))
	return nil
}

type exportView struct {
	Id           string
	Name         string
	Filename     string
	Type         string
	Status       string
	Progress     int
	TablesTotal  int
	TablesDone   int
	SizeBytes    int64
	SizeLabel    string
	Created      types.DateTime
	Expires      types.DateTime
	CurrentTable string
	Error        string
}

func (p *ExportsAdmin) pageHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data, err := exportsData(e, app)
		if err != nil {
			return engine.Response500(e, err, nil)
		}
		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}
		if errMsg := strings.TrimSpace(e.Request.URL.Query().Get("error")); errMsg != "" {
			data["error"] = errMsg
		}
		return engine.Response200(e, TEMPLATE_EXPORTS, data, pagemodels.LAYOUT_LOGIN_PAGES)
	}
}

func (p *ExportsAdmin) listHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data, err := exportsData(e, app)
		if err != nil {
			return engine.Response500(e, err, nil)
		}
		return engine.Response200(e, TEMPLATE_EXPORTS_LIST, data, LAYOUT_EXPORTS_FRAGMENT)
	}
}

func (p *ExportsAdmin) fts5RunHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := e.Request.ParseForm(); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Formulardaten ungueltig."})
		}
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		status, err := imports.StartFTS5Rebuild(app, true)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		if status == "running" {
			return e.JSON(http.StatusConflict, map[string]any{"error": "FTS5-Neuaufbau läuft bereits."})
		}
		if status == "restarting" {
			return e.JSON(http.StatusOK, map[string]any{"success": true, "status": "restarting"})
		}

		return e.JSON(http.StatusOK, map[string]any{"success": true, "status": "started"})
	}
}

func (p *ExportsAdmin) fts5StatusHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		status := settingString(app, "fts5_rebuild_status")
		if status == "" {
			status = "idle"
		}
		message := normalizeGermanMessage(settingString(app, "fts5_rebuild_message"))
		errMsg := normalizeGermanMessage(settingString(app, "fts5_rebuild_error"))
		done := 0
		total := 0
		if setting, err := dbmodels.Settings_Key(app, "fts5_rebuild_done"); err == nil && setting != nil {
			done = parseSettingInt(setting.Value())
		}
		if setting, err := dbmodels.Settings_Key(app, "fts5_rebuild_total"); err == nil && setting != nil {
			total = parseSettingInt(setting.Value())
		}
		lastRebuild := formatLastRebuild(app)

		return e.JSON(http.StatusOK, map[string]any{
			"status":       status,
			"message":      message,
			"error":        errMsg,
			"done":         done,
			"total":        total,
			"last_rebuild": lastRebuild,
		})
	}
}

func (p *ExportsAdmin) runHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := e.Request.ParseForm(); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Formulardaten ungueltig."})
		}
		csrfToken := e.Request.FormValue("csrf_token")
		if err := req.CheckCSRF(csrfToken); err != nil {
			session := req.Session()
			if session == nil {
				app.Logger().Warn("Export CSRF failed: no session", "token_len", len(csrfToken))
			} else {
				app.Logger().Warn(
					"Export CSRF failed",
					"token_len", len(csrfToken),
					"session_token_len", len(session.Token),
					"session_csrf_len", len(session.CSRF),
					"matches_token", csrfToken == session.Token,
					"matches_csrf", csrfToken == session.CSRF,
				)
			}
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		exportType := strings.TrimSpace(e.Request.FormValue("export_type"))
		if exportType == "" {
			exportType = dbmodels.EXPORT_TYPE_DATA
		}
		if exportType != dbmodels.EXPORT_TYPE_DATA && exportType != dbmodels.EXPORT_TYPE_FILES {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Unbekannter Export-Typ."})
		}

		collection, err := app.FindCollectionByNameOrId(dbmodels.EXPORTS_TABLE)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": "Export-Tabelle nicht verfuegbar."})
		}

		record := core.NewRecord(collection)
		now := time.Now()
		var name string
		if exportType == dbmodels.EXPORT_TYPE_FILES {
			name = fmt.Sprintf("Dateien-Backup %s", now.Format("02.01.2006 15:04"))
		} else {
			name = fmt.Sprintf("XML-Export %s", now.Format("02.01.2006 15:04"))
		}
		record.Set(dbmodels.EXPORT_NAME_FIELD, name)
		record.Set(dbmodels.EXPORT_TYPE_FIELD, exportType)
		record.Set(dbmodels.EXPORT_STATUS_FIELD, dbmodels.EXPORT_STATUS_QUEUED)
		record.Set(dbmodels.EXPORT_PROGRESS_FIELD, 0)
		record.Set(dbmodels.EXPORT_TABLES_TOTAL_FIELD, 0)
		record.Set(dbmodels.EXPORT_TABLES_DONE_FIELD, 0)
		record.Set(dbmodels.EXPORT_EXPIRES_FIELD, types.NowDateTime().Add(7*24*time.Hour))
		record.Set(dbmodels.EXPORT_ERROR_FIELD, "")
		record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, "")

		if user := req.User(); user != nil {
			record.Set(dbmodels.EXPORT_CREATED_BY_FIELD, user.Id)
		}

		if err := app.Save(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		go func(exportID string) {
			var runErr error
			if exportType == dbmodels.EXPORT_TYPE_FILES {
				runErr = exports.RunFiles(app, exportID)
			} else {
				runErr = exports.Run(app, exportID)
			}
			if runErr != nil {
				app.Logger().Error("Export failed", "error", runErr, "export_id", exportID)
			}
		}(record.Id)

		return e.JSON(http.StatusOK, map[string]any{"success": true, "id": record.Id})
	}
}

func (p *ExportsAdmin) downloadHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := strings.TrimSpace(e.Request.PathValue("id"))
		if id == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Ungueltige Export-ID."})
		}

		record, err := app.FindRecordById(dbmodels.EXPORTS_TABLE, id)
		if err != nil || record == nil {
			return e.JSON(http.StatusNotFound, map[string]any{"error": "Export nicht gefunden."})
		}

		if record.GetString(dbmodels.EXPORT_STATUS_FIELD) != dbmodels.EXPORT_STATUS_COMPLETE {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Export ist noch nicht fertig."})
		}

		exportDir, err := exports.ExportDir(app)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": "Export-Verzeichnis nicht verfuegbar."})
		}

		filename := record.GetString(dbmodels.EXPORT_FILENAME_FIELD)
		if filename == "" {
			filename = record.Id + ".zip"
		}
		filename = filepath.Base(filename)

		path := filepath.Join(exportDir, filename)
		if _, err := os.Stat(path); err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{"error": "Exportdatei nicht gefunden."})
		}

		e.Response.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filename))
		return e.FileFS(os.DirFS(exportDir), filename)
	}
}

func (p *ExportsAdmin) deleteHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := e.Request.ParseForm(); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Formulardaten ungueltig."})
		}
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		id := strings.TrimSpace(e.Request.PathValue("id"))
		if id == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Ungueltige Export-ID."})
		}

		record, err := app.FindRecordById(dbmodels.EXPORTS_TABLE, id)
		if err != nil || record == nil {
			return e.JSON(http.StatusNotFound, map[string]any{"error": "Export nicht gefunden."})
		}

		status := record.GetString(dbmodels.EXPORT_STATUS_FIELD)
		if status == dbmodels.EXPORT_STATUS_RUNNING || status == dbmodels.EXPORT_STATUS_QUEUED {
			return e.JSON(http.StatusConflict, map[string]any{"error": "Export läuft noch."})
		}

		exportDir, err := exports.ExportDir(app)
		if err == nil {
			filename := record.GetString(dbmodels.EXPORT_FILENAME_FIELD)
			if filename == "" {
				filename = record.Id + ".xml"
			}
			filename = filepath.Base(filename)
			_ = os.Remove(filepath.Join(exportDir, filename))
			_ = os.Remove(filepath.Join(exportDir, filename+".tmp"))
		}

		if err := app.Delete(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		return e.JSON(http.StatusOK, map[string]any{"success": true, "message": "Export geloescht."})
	}
}

func exportsData(e *core.RequestEvent, app core.App) (map[string]any, error) {
	data := map[string]any{}
	req := templating.NewRequest(e)

	exportsList, hasRunning, err := loadExports(app)
	if err != nil {
		return nil, err
	}
	settings, err := settingsData(app)
	if err != nil {
		return nil, err
	}

	data["exports"] = exportsList
	data["has_running"] = hasRunning
	data["csrf_token"] = ""
	if req.Session() != nil {
		data["csrf_token"] = req.Session().Token
	}
	for key, value := range settings {
		data[key] = value
	}
	return data, nil
}

func loadExports(app core.App) ([]exportView, bool, error) {
	records := []*core.Record{}
	err := app.RecordQuery(dbmodels.EXPORTS_TABLE).
		OrderBy(dbmodels.CREATED_FIELD + " DESC").
		All(&records)
	if err != nil {
		return nil, false, err
	}

	exportsList := make([]exportView, 0, len(records))
	hasRunning := false
	for _, record := range records {
		status := record.GetString(dbmodels.EXPORT_STATUS_FIELD)
		if status == dbmodels.EXPORT_STATUS_RUNNING || status == dbmodels.EXPORT_STATUS_QUEUED {
			hasRunning = true
		}
		exportType := record.GetString(dbmodels.EXPORT_TYPE_FIELD)
		if exportType == "" {
			exportType = dbmodels.EXPORT_TYPE_DATA
		}
		sizeBytes := int64(record.GetInt(dbmodels.EXPORT_SIZE_FIELD))
		exportsList = append(exportsList, exportView{
			Id:           record.Id,
			Name:         record.GetString(dbmodels.EXPORT_NAME_FIELD),
			Filename:     record.GetString(dbmodels.EXPORT_FILENAME_FIELD),
			Type:         exportType,
			Status:       status,
			Progress:     record.GetInt(dbmodels.EXPORT_PROGRESS_FIELD),
			TablesTotal:  record.GetInt(dbmodels.EXPORT_TABLES_TOTAL_FIELD),
			TablesDone:   record.GetInt(dbmodels.EXPORT_TABLES_DONE_FIELD),
			SizeBytes:    sizeBytes,
			SizeLabel:    formatBytes(sizeBytes),
			Created:      record.GetDateTime(dbmodels.CREATED_FIELD),
			Expires:      record.GetDateTime(dbmodels.EXPORT_EXPIRES_FIELD),
			CurrentTable: record.GetString(dbmodels.EXPORT_CURRENT_TABLE_FIELD),
			Error:        record.GetString(dbmodels.EXPORT_ERROR_FIELD),
		})
	}

	return exportsList, hasRunning, nil
}

func formatBytes(size int64) string {
	if size <= 0 {
		return "0 B"
	}
	units := []string{"B", "KB", "MB", "GB", "TB"}
	value := float64(size)
	unitIdx := 0
	for value >= 1024 && unitIdx < len(units)-1 {
		value /= 1024
		unitIdx++
	}
	if value >= 100 {
		return fmt.Sprintf("%.0f %s", value, units[unitIdx])
	}
	if value >= 10 {
		return fmt.Sprintf("%.1f %s", value, units[unitIdx])
	}
	return fmt.Sprintf("%.2f %s", value, units[unitIdx])
}

func settingString(app core.App, key string) string {
	setting, err := dbmodels.Settings_Key(app, key)
	if err != nil || setting == nil {
		return ""
	}
	if value, ok := setting.Value().(string); ok {
		return normalizeSettingString(value)
	}
	return normalizeSettingString(fmt.Sprintf("%v", setting.Value()))
}

func formatLastRebuild(app core.App) string {
	setting, err := dbmodels.Settings_Key(app, "fts5_last_rebuild")
	if err != nil || setting == nil {
		return ""
	}
	if formatted, ok := formatSettingGermanDateTime(setting.Value()); ok {
		return normalizeSettingString(formatted)
	}
	if value, ok := parseSettingString(setting.Value()); ok {
		return normalizeSettingString(value)
	}
	return normalizeSettingString(fmt.Sprintf("%v", setting.Value()))
}

func parseSettingInt(value any) int {
	switch v := value.(type) {
	case float64:
		return int(v)
	case int:
		return v
	case int64:
		return int(v)
	case string:
		if parsed, err := strconv.Atoi(v); err == nil {
			return parsed
		}
	default:
		if parsed, err := strconv.Atoi(fmt.Sprintf("%v", value)); err == nil {
			return parsed
		}
	}
	return 0
}

func normalizeSettingString(value string) string {
	trimmed := strings.TrimSpace(value)
	if len(trimmed) >= 2 && strings.HasPrefix(trimmed, "\"") && strings.HasSuffix(trimmed, "\"") {
		if unquoted, err := strconv.Unquote(trimmed); err == nil {
			return unquoted
		}
		return strings.Trim(trimmed, "\"")
	}
	return trimmed
}

func normalizeGermanMessage(value string) string {
	replacer := strings.NewReplacer(
		"laeuft", "läuft",
		"Laeuft", "Läuft",
		"Loescht", "Löscht",
		"loescht", "löscht",
		"fuellt", "füllt",
		"Fuellt", "Füllt",
		"Eintraegen", "Einträgen",
		"eintraegen", "einträgen",
	)
	return replacer.Replace(value)
}
