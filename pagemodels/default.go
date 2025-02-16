package pagemodels

import (
	"net/http"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type DefaultPage struct {
	core.BaseRecordProxy
	Page
	URL string
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

func (r *DefaultPage) Text() string {
	return r.GetString(F_TEXT)
}

func (r *DefaultPage) SetText(text string) {
	r.Set(F_TEXT, text)
}

func (r *DefaultPage) Up(app core.App) error {
	record := &core.Record{}
	err := app.RecordQuery(GeneratePageTableName(r.Name)).
		OrderBy("created").
		One(record)
	if err != nil {
		return err
	}

	r.SetProxyRecord(record)
	return nil
}

func (p *DefaultPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(p.URL, func(e *core.RequestEvent) error {
		data := make(map[string]interface{})
		data["title"] = p.Title()
		data["description"] = p.Description()
		data["keywords"] = p.Keywords()
		data["text"] = p.Text()

		var builder strings.Builder
		err := engine.Render(&builder, p.Template, data, p.Layout)
		if err != nil {
			return e.HTML(http.StatusInternalServerError, err.Error())
		}
		return e.HTML(http.StatusOK, builder.String())
	})
	return nil
}
