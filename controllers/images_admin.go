package controllers

import (
	"net/http"
	"path/filepath"
	"strings"
	"unicode"

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
	URL_IMAGES_ADMIN     = "/redaktion/images/"
	URL_IMAGES_LIST      = "list/"
	URL_IMAGES_UPLOAD    = "upload/"
	URL_IMAGES_DELETE    = "delete/"
	TEMPLATE_IMAGES_LIST = "/components/image_uploader_list/"
)

func init() {
	app.Register(&ImagesAdmin{})
}

type ImagesAdmin struct{}

func (p *ImagesAdmin) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *ImagesAdmin) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *ImagesAdmin) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_IMAGES_ADMIN)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_IMAGES_LIST, p.listHandler(engine, app))
	rg.POST(URL_IMAGES_UPLOAD, p.uploadHandler(engine, app)).Bind(apis.BodyLimit(100 << 20))
	rg.POST(URL_IMAGES_DELETE+"{id}", p.deleteHandler(engine, app))
	return nil
}

func (p *ImagesAdmin) listHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		key := strings.TrimSpace(e.Request.URL.Query().Get("key"))
		if key != "" {
			collection, err := app.FindCollectionByNameOrId(dbmodels.IMAGES_TABLE)
			if err != nil {
				return engine.Response500(e, err, nil)
			}
			record, err := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
			if err != nil {
				return engine.Response500(e, err, nil)
			}
			var image *dbmodels.Image
			if record != nil {
				image = &dbmodels.Image{}
				image.SetProxyRecord(record)
			}
			data := map[string]any{
				"image": image,
			}
			return engine.Response200(e, "/components/image_uploader_single_view/", data, LAYOUT_FRAGMENT)
		}

		prefix := strings.TrimSpace(e.Request.URL.Query().Get("prefix"))
		if prefix == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Prefix fehlt."})
		}

		keyPrefix := imageKeyPrefix(prefix)
		images, err := dbmodels.Images_KeyPrefix(app, keyPrefix)
		if err != nil {
			return engine.Response500(e, err, nil)
		}

		data := map[string]any{
			"images": images,
		}

		return engine.Response200(e, TEMPLATE_IMAGES_LIST, data, LAYOUT_FRAGMENT)
	}
}

func (p *ImagesAdmin) uploadHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)

		if err := e.Request.ParseMultipartForm(32 << 20); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Formulardaten ungültig."})
		}

		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		key := strings.TrimSpace(e.Request.FormValue("key"))
		prefix := strings.TrimSpace(e.Request.FormValue("prefix"))
		if key == "" && prefix == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Prefix fehlt."})
		}
		if key != "" && strings.ContainsAny(key, " \t") {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Schlüssel darf keine Leerzeichen enthalten."})
		}

		imageFiles, err := e.FindUploadedFiles(dbmodels.IMAGE_FIELD)
		if err != nil || len(imageFiles) == 0 {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Bitte ein Bild auswählen."})
		}
		previewFiles, _ := e.FindUploadedFiles(dbmodels.PREVIEW_FIELD)

		title := strings.TrimSpace(e.Request.FormValue("title"))
		description := strings.TrimSpace(e.Request.FormValue("description"))
		if title == "" {
			base := strings.TrimSpace(imageFiles[0].OriginalName)
			if base != "" {
				title = strings.TrimSuffix(base, filepath.Ext(base))
			}
		}
		if title == "" {
			title = "Bild"
		}

		if key == "" {
			keyPrefix := imageKeyPrefix(prefix)
			key = keyPrefix + slugify(title)
		}

		collection, err := app.FindCollectionByNameOrId(dbmodels.IMAGES_TABLE)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": "Bildsammlung konnte nicht geladen werden."})
		}

		record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
		if record == nil {
			record = core.NewRecord(collection)
			record.Set(dbmodels.KEY_FIELD, key)
		}
		record.Set(dbmodels.TITLE_FIELD, title)
		record.Set(dbmodels.DESCRIPTION_FIELD, description)
		record.Set(dbmodels.IMAGE_FIELD, imageFiles[0])
		if len(previewFiles) > 0 {
			record.Set(dbmodels.PREVIEW_FIELD, previewFiles[0])
		}

		if err := app.Save(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		return e.JSON(http.StatusOK, map[string]any{"success": true, "message": "Bild gespeichert.", "id": record.Id})
	}
}

func (p *ImagesAdmin) deleteHandler(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if err := req.CheckCSRF(e.Request.FormValue("csrf_token")); err != nil {
			return e.JSON(http.StatusUnauthorized, map[string]any{"error": err.Error()})
		}

		id := strings.TrimSpace(e.Request.PathValue("id"))
		if id == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"error": "Ungültige Bild-ID."})
		}

		record, err := app.FindRecordById(dbmodels.IMAGES_TABLE, id)
		if err != nil || record == nil {
			return e.JSON(http.StatusNotFound, map[string]any{"error": "Bild nicht gefunden."})
		}

		if err := app.Delete(record); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": err.Error()})
		}

		return e.JSON(http.StatusOK, map[string]any{"success": true, "message": "Bild gelöscht."})
	}
}

func imageKeyPrefix(prefix string) string {
	p := strings.TrimSpace(prefix)
	p = strings.TrimSuffix(p, ".")
	if strings.HasSuffix(p, ".image") {
		p += "."
	}
	if !strings.HasSuffix(p, ".image.") {
		p += ".image."
	}
	return p
}

func slugify(input string) string {
	replace := map[rune]string{
		'ä': "ae",
		'ö': "oe",
		'ü': "ue",
		'ß': "ss",
		'Ä': "ae",
		'Ö': "oe",
		'Ü': "ue",
	}
	var b strings.Builder
	lastDash := false
	for _, r := range input {
		if rep, ok := replace[r]; ok {
			if b.Len() > 0 && !lastDash {
				b.WriteByte('-')
				lastDash = true
			}
			b.WriteString(rep)
			lastDash = false
			continue
		}
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			b.WriteRune(unicode.ToLower(r))
			lastDash = false
			continue
		}
		if !lastDash {
			b.WriteByte('-')
			lastDash = true
		}
	}
	out := strings.Trim(b.String(), "-")
	if out == "" {
		return "bild"
	}
	return out
}
