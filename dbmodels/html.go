package dbmodels

import "github.com/pocketbase/pocketbase/core"

type HTML struct {
	core.BaseRecordProxy
}

func (h *HTML) Key() string {
	return h.GetString(KEY_FIELD)
}

func (h *HTML) SetKey(key string) {
	h.Set(KEY_FIELD, key)
}

func (h *HTML) HTML() string {
	return h.GetString(HTML_FIELD)
}

func (h *HTML) SetHTML(html string) {
	h.Set(HTML_FIELD, html)
}
