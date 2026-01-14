package dbmodels

import (
	"log/slog"

	"github.com/pocketbase/pocketbase/core"
)

type Page struct {
	core.BaseRecordProxy
}

func (p *Page) Key() string {
	return p.GetString(KEY_FIELD)
}

func (p *Page) SetKey(key string) {
	p.Set(KEY_FIELD, key)
}

func (p *Page) URL() string {
	return p.GetString(URL_FIELD)
}

func (p *Page) Title() string {
	return p.GetString(TITLE_FIELD)
}

func (p *Page) SetTitle(title string) {
	p.Set(TITLE_FIELD, title)
}

func (p *Page) SetURL(url string) {
	p.Set(URL_FIELD, url)
}

func (p *Page) Template() string {
	return p.GetString(TEMPLATE_FIELD)
}

func (p *Page) SetTemplate(template string) {
	p.Set(TEMPLATE_FIELD, template)
}

func (p *Page) Layout() string {
	return p.GetString(LAYOUT_FIELD)
}

func (p *Page) SetLayout(layout string) {
	p.Set(LAYOUT_FIELD, layout)
}

func (p *Page) Type() string {
	return p.GetString(TYPE_FIELD)
}

func (p *Page) SetType(pageType string) {
	p.Set(TYPE_FIELD, pageType)
}

func (p *Page) Data() map[string]interface{} {
	val := p.Get(DATA_FIELD)
	if val == nil {
		return nil
	}
	if data, ok := val.(map[string]interface{}); ok {
		return data
	}

	data := make(map[string]interface{})
	if err := p.UnmarshalJSONField(DATA_FIELD, &data); err != nil {
		slog.Error("Error unmarshalling page data", "error", err)
		return nil
	}
	if len(data) == 0 {
		return nil
	}
	return data
}

func (p *Page) SetData(data map[string]interface{}) {
	p.Set(DATA_FIELD, data)
}
