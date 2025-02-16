package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*Place)(nil)

type Place struct {
	core.BaseRecordProxy
}

func NewPlace(record *core.Record) *Place {
	i := &Place{}
	i.SetProxyRecord(record)
	return i
}

func (p *Place) TableName() string {
	return PLACES_TABLE
}

func (p *Place) Name() string {
	return p.GetString(PLACES_NAME_FIELD)
}

func (p *Place) SetName(name string) {
	p.Set(PLACES_NAME_FIELD, name)
}

func (p *Place) Pseudonyms() string {
	return p.GetString(PLACES_PSEUDONYMS_FIELD)
}

func (p *Place) SetPseudonyms(pseudonyms string) {
	p.Set(PLACES_PSEUDONYMS_FIELD, pseudonyms)
}

func (p *Place) Fictional() bool {
	return p.GetBool(PLACES_FICTIONAL_FIELD)
}

func (p *Place) SetFictional(fictional bool) {
	p.Set(PLACES_FICTIONAL_FIELD, fictional)
}

func (p *Place) URI() string {
	return p.GetString(URI_FIELD)
}

func (p *Place) SetURI(uri string) {
	p.Set(URI_FIELD, uri)
}

func (p *Place) Annotation() string {
	return p.GetString(ANNOTATION_FIELD)
}

func (p *Place) SetAnnotation(annotation string) {
	p.Set(ANNOTATION_FIELD, annotation)
}

func (p *Place) MusenalmID() string {
	return p.GetString(MUSENALMID_FIELD)
}

func (p *Place) SetMusenalmID(id string) {
	p.Set(MUSENALMID_FIELD, id)
}

func (p *Place) EditState() string {
	return p.GetString(EDITSTATE_FIELD)
}

func (p *Place) SetEditState(state string) {
	p.Set(EDITSTATE_FIELD, state)
}

func (p *Place) Comment() string {
	return p.GetString(COMMENT_FIELD)
}

func (p *Place) SetComment(comment string) {
	p.Set(COMMENT_FIELD, comment)
}
