package pages

import (
	"net/http"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const INDEX_NAME = "index"
const BILDER_T_NAME = "bilder"
const TEXTE_T_NAME = "texte"

var bilder_fields = core.NewFieldsList(
	&core.TextField{Name: "Titel", Required: true, Presentable: true},
	&core.EditorField{Name: "Beschreibung", Required: false, Presentable: false},
	&core.FileField{
		Name:      "Bilder",
		Required:  false,
		MaxSize:   100 * 1024 * 1024,
		MaxSelect: 1000,
		MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
	}, // 100 MB a file
	&core.FileField{
		Name:      "Vorschau",
		Required:  false,
		MaxSize:   100 * 1024 * 1024,
		MaxSelect: 1000,
		MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
	}, // 100 MB a file
)

var texte_fields = core.NewFieldsList(
	&core.TextField{Name: "Titel", Required: true, Presentable: true},
	&core.EditorField{Name: "Abs1", Required: false, Presentable: false},
	&core.EditorField{Name: "Abs2", Required: false, Presentable: false},
)

func init() {
	ip := &IndexPage{
		Page: pagemodels.Page{
			Name: INDEX_NAME,
		},
	}
	app.Register(ip)
}

type IndexPage struct {
	pagemodels.Page
}

func (p *IndexPage) Up(app core.App) error {
	if !p.TableExists(app, BILDER_T_NAME) {
		err := p.CreateTable(app, p.bilderCollection())
		if err != nil {
			return err
		}
	}
	if !p.TableExists(app, TEXTE_T_NAME) {
		err := p.CreateTable(app, p.texteCollection())
		if err != nil {
			return err
		}
	}
	return nil
}

func (p *IndexPage) Down(app core.App) error {
	err := p.DropTable(app, BILDER_T_NAME)
	if err != nil {
		return err
	}
	err = p.DropTable(app, TEXTE_T_NAME)
	if err != nil {
		return err
	}
	return nil
}

func (p *IndexPage) bilderCollection() *core.Collection {
	c := core.NewBaseCollection(BILDER_T_NAME)
	c.ListRule = types.Pointer("")
	c.ViewRule = types.Pointer("")
	c.Fields = bilder_fields
	return c
}

func (p *IndexPage) texteCollection() *core.Collection {
	c := core.NewBaseCollection(TEXTE_T_NAME)
	c.ListRule = types.Pointer("")
	c.ViewRule = types.Pointer("")
	c.Fields = texte_fields
	return c
}

func (p *IndexPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET("/{$}", func(e *core.RequestEvent) error {
		return e.String(http.StatusOK, "Hello, World!")
	})
	return nil
}
