package controllers

import (
	"net/http"
	"path/filepath"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_FILES_ADMIN       = "/redaktion/files/"
	URL_FILES_LIST        = "list/"
	URL_FILES_UPLOAD      = "upload/"
	URL_FILES_DELETE      = "delete/"
	TEMPLATE_FILES_LIST   = "/components/file_uploader_list/"
	LAYOUT_FILES_FRAGMENT = "fragment"
)

func init() {
	app.Register(&FilesAdmin{})
}

type FilesAdmin struct{}

func (p *FilesAdmin) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *FilesAdmin) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *FilesAdmin) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_FILES_ADMIN)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_FILES_LIST, p.listHandler(engine, app))
	rg.POST(URL_FILES_UPLOAD, p.uploadHandler(engine, app)).Bind(apis.BodyLimit(100 << 20))
	rg.POST(URL_FILES_DELETE+"{id}", p.deleteHandler(engine, app))
	return nil
}

func (p *FilesAdmin) listHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		files, err := dbmodels.Files_All(app)
		if err != nil {
			return engine.Response500(e, err, nil)
		}

		req := templating.NewRequest(e)
		csrf := ""
		if req.Session() != nil {
			csrf = req.Session().Token
		}

		data := map[string]any{
			"files":      files,
			"csrf_token": csrf,
		}

		return engine.Response200(e, TEMPLATE_FILES_LIST, data, LAYOUT_FILES_FRAGMENT)
	}
}

func (p *FilesAdmin) uploadHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)

		if err := e.Request.ParseMultipartForm(32 << 20); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Formulardaten ungültig."})
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		files, err := e.FindUploadedFiles(dbmodels.FILE_FIELD)
		if err != nil || len(files) == 0 {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Keine Datei ausgewählt."})
		}

		title := strings.TrimSpace(e.Request.FormValue("title"))
		description := strings.TrimSpace(e.Request.FormValue("description"))
		if title == "" {
			base := strings.TrimSpace(files[0].OriginalName)
			if base != "" {
				title = strings.TrimSuffix(base, filepath.Ext(base))
			}
			if title == "" {
				title = files[0].OriginalName
			}
		}

		collection, err := app.FindCollectionByNameOrId(dbmodels.FILES_TABLE)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": "Dateiablage konnte nicht geladen werden."})
		}

		record := core.NewRecord(collection)
		record.Set(dbmodels.TITLE_FIELD, title)
		record.Set(dbmodels.DESCRIPTION_FIELD, description)
		record.Set(dbmodels.FILE_FIELD, files[0])

		if err := app.Save(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		return e.JSON(http.StatusOK, map[string]any{"success": true, "message": "Datei hochgeladen.", "id": record.Id})
	}
}

func (p *FilesAdmin) deleteHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		id := strings.TrimSpace(e.Request.PathValue("id"))
		if id == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Ungültige Datei-ID."})
		}

		record, err := app.FindRecordById(dbmodels.FILES_TABLE, id)
		if err != nil || record == nil {
			return e.JSON(http.StatusNotFound, map[string]any{"error": "Datei nicht gefunden."})
		}

		if err := app.Delete(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		return e.JSON(http.StatusOK, map[string]any{"success": true, "message": "Datei gelöscht."})
	}
}
