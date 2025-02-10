package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	PAGE_DB_PREFIX = "page_"
)

type IPage interface {
	Up(app core.App) error
	Down(app core.App) error
	// TODO: pass the cache here
	Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error
}

type Page struct {
	// WARNING: this is not thread safe, just set this once in setup
	Tables []string
	Name   string
}

func (p *Page) TableExists(app core.App, name string) bool {
	coll, _ := app.FindCollectionByNameOrId(p.generateName(name))
	if coll != nil {
		p.Tables = append(p.Tables, coll.Name)
	}
	return coll != nil
}

func (p *Page) CreateTable(app core.App, collection *core.Collection) error {
	collection.Name = p.generateName(collection.Name)
	err := app.Save(collection)
	if err != nil {
		app.Logger().Error("Error creating table", "error", err, "collection", collection, "name", p.Name)
		return err
	}

	p.Tables = append(p.Tables, collection.Name)
	return nil
}

func (p *Page) DropTable(app core.App, name string) error {
	coll, _ := app.FindCollectionByNameOrId(p.generateName(name))
	if coll != nil {
		err := app.Delete(coll)
		if err != nil {
			app.Logger().Error("Error deleting table", "error", err, "collection", coll, "name", p.Name)
			return err
		}
	}
	return nil
}

func (p *Page) DropTables(app core.App) error {
	for _, table := range p.Tables {
		err := p.DropTable(app, table)
		if err != nil {
			return err
		}
	}
	return nil
}

func (p *Page) generateName(name string) string {
	return PAGE_DB_PREFIX + p.Name + "_" + name
}
