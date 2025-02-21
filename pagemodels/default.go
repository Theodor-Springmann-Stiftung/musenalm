package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type DefaultPage struct {
	core.BaseRecordProxy
	Name     string
	Template string
	Layout   string
	URL      string
}

func NewDefaultPage(record *core.Record) *DefaultPage {
	i := &DefaultPage{}
	i.SetProxyRecord(record)
	return i
}

func (r *DefaultPage) Title() string {
	return r.GetString(F_TITLE)
}

func (r *DefaultPage) SetTitle(titel string) {
	r.Set(F_TITLE, titel)
}

func (r *DefaultPage) Description() string {
	return r.GetString(F_DESCRIPTION)
}

func (r *DefaultPage) SetDescription(beschreibung string) {
	r.Set(F_DESCRIPTION, beschreibung)
}

func (r *DefaultPage) Keywords() string {
	return r.GetString(F_TAGS)
}

func (r *DefaultPage) SetKeywords(keywords string) {
	r.Set(F_TAGS, keywords)
}

func (r *DefaultPage) Up(app core.App, engine *templating.Engine) error {
	return nil
}

func (r *DefaultPage) Down(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *DefaultPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.URL, func(e *core.RequestEvent) error {
		data := make(map[string]interface{})

		record := &core.Record{}
		err := app.RecordQuery(GeneratePageTableName(p.Name)).
			OrderBy("created").
			One(record)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		p.SetProxyRecord(record)
		data["record"] = p
		return engine.Response200(e, p.Template, data, p.Layout)
	})
	return nil
}

func (p *DefaultPage) Get(e *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	err := p.SetCommonData(e.App, data)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *DefaultPage) SetCommonData(app core.App, data map[string]interface{}) error {
	record, err := p.GetLatestData(app)
	if err != nil {
		return err
	}
	p.SetProxyRecord(record)
	data["page"] = p
	return nil
}

func (p *DefaultPage) GetLatestData(app core.App) (*core.Record, error) {
	record := &core.Record{}
	tn := GeneratePageTableName(p.Name)
	err := app.RecordQuery(tn).OrderBy("created").Limit(1).One(record)
	return record, err
}
