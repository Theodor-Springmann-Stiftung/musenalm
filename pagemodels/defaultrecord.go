package pagemodels

import (
	"github.com/pocketbase/pocketbase/core"
)

type DefaultPageRecord struct {
	core.BaseRecordProxy
}

func NewDefaultPageRecord(record *core.Record) *DefaultPageRecord {
	i := &DefaultPageRecord{}
	i.SetProxyRecord(record)
	return i
}

func (r *DefaultPageRecord) Title() string {
	return r.GetString(F_TITLE)
}

func (r *DefaultPageRecord) SetTitle(titel string) {
	r.Set(F_TITLE, titel)
}

func (r *DefaultPageRecord) Description() string {
	return r.GetString(F_DESCRIPTION)
}

func (r *DefaultPageRecord) SetDescription(beschreibung string) {
	r.Set(F_DESCRIPTION, beschreibung)
}

func (r *DefaultPageRecord) Keywords() string {
	return r.GetString(F_TAGS)
}

func (r *DefaultPageRecord) SetKeywords(keywords string) {
	r.Set(F_TAGS, keywords)
}

func (r *DefaultPageRecord) Collection(pagename string) *core.Collection {
	coll := BasePageCollection(pagename)
	return coll
}
