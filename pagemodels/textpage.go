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

func (r *TextPage) Up(ia IApp, engine *templating.Engine) error {
	return nil
}

func (r *TextPage) Down(ia IApp, engine *templating.Engine) error {
	return nil
}

func (p *TextPage) Setup(router *router.Router[*core.RequestEvent], ia IApp, engine *templating.Engine) error {
	router.GET(p.URL, func(e *core.RequestEvent) error {
		data := make(map[string]interface{})
		return engine.Response200(e, p.Template, data, p.Layout)
	})
	return nil
}

func (p *TextPage) Get(e *core.RequestEvent, data map[string]interface{}, engine *templating.Engine) error {
	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *TextPage) SetCommonData(app core.App, data map[string]interface{}) error {
	return nil
}

func (p *TextPage) GetLatestData(app core.App) (*core.Record, error) {
	return nil, nil
}
