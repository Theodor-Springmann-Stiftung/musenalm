package pagemodels

import (
	"database/sql"

	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type DefaultPage[T IPageCollection] struct {
	Record   T
	Name     string
	Template string
	Layout   string
	URL      string
}

func (r *DefaultPage[T]) Up(app core.App, engine *templating.Engine) error {
	_, err := app.FindCollectionByNameOrId(GeneratePageTableName(r.Name))
	if err == sql.ErrNoRows {
		collection := r.Record.Collection(r.Name)
		err = app.Save(collection)
		if err != nil {
			app.Logger().Error("Error saving collection", "Name", GeneratePageTableName(r.Name), "Error", err, "Collection", collection)
			return err
		}
	} else if err != nil {
		app.Logger().Error("Error finding collection %s: %s", GeneratePageTableName(r.Name), err)
		return err
	}

	return nil
}

func (r *DefaultPage[T]) Down(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *DefaultPage[T]) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.URL, func(e *core.RequestEvent) error {
		data := make(map[string]interface{})

		record := &core.Record{}
		err := app.RecordQuery(GeneratePageTableName(p.Name)).
			OrderBy("created").
			One(record)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		p.Record.SetProxyRecord(record)
		data["record"] = p
		return engine.Response200(e, p.Template, data, p.Layout)
	})
	return nil
}

func (p *DefaultPage[T]) Get(e *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	err := p.SetCommonData(e.App, data)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *DefaultPage[T]) SetCommonData(app core.App, data map[string]interface{}) error {
	record, err := p.GetLatestData(app)
	if err != nil {
		return err
	}
	p.Record.SetProxyRecord(record)
	data["page"] = p.Record
	return nil
}

func (p *DefaultPage[T]) GetLatestData(app core.App) (*core.Record, error) {
	record := &core.Record{}
	tn := GeneratePageTableName(p.Name)
	err := app.RecordQuery(tn).OrderBy("created").Limit(1).One(record)
	return record, err
}
