package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type TextPage struct {
	core.BaseRecordProxy
	Name     string
	Template string
	Layout   string
	URL      string
}

func NewTextPage(record *core.Record) *TextPage {
	i := &TextPage{}
	i.SetProxyRecord(record)
	return i
}

func (r *TextPage) Title() string {
	return r.GetString(F_TITLE)
}

func (r *TextPage) SetTitle(titel string) {
	r.Set(F_TITLE, titel)
}

func (r *TextPage) Description() string {
	return r.GetString(F_DESCRIPTION)
}

func (r *TextPage) SetDescription(beschreibung string) {
	r.Set(F_DESCRIPTION, beschreibung)
}

func (r *TextPage) Keywords() string {
	return r.GetString(F_TAGS)
}

func (r *TextPage) SetKeywords(keywords string) {
	r.Set(F_TAGS, keywords)
}

func (r *TextPage) Text() string {
	return r.GetString(F_TEXT)
}

func (r *TextPage) SetText(text string) {
	r.Set(F_TEXT, text)
}

func (r *TextPage) Up(app core.App, engine *templating.Engine) error {
	return nil
}

func (r *TextPage) Down(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *TextPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
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

func (p *TextPage) Get(e *core.RequestEvent, data map[string]interface{}, engine *templating.Engine) error {
	err := p.SetCommonData(e.App, data)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *TextPage) SetCommonData(app core.App, data map[string]interface{}) error {
	record, err := p.GetLatestData(app)
	if err != nil {
		return err
	}
	p.SetProxyRecord(record)
	data["page"] = p
	return nil
}

func (p *TextPage) GetLatestData(app core.App) (*core.Record, error) {
	record := &core.Record{}
	tn := GeneratePageTableName(p.Name)
	err := app.RecordQuery(tn).OrderBy("created").Limit(1).One(record)
	return record, err
}
