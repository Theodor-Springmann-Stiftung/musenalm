package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
)

var _ core.RecordProxy = (*Agent)(nil)

type Agent struct {
	core.BaseRecordProxy
}

func NewAgent(record *core.Record) *Agent {
	i := &Agent{}
	i.SetProxyRecord(record)
	return i
}

func (a *Agent) TableName() string {
	return AGENTS_TABLE
}

func (a *Agent) Name() string {
	return a.GetString(AGENTS_NAME_FIELD)
}

func (a *Agent) SetName(name string) {
	a.Set(AGENTS_NAME_FIELD, name)
}

func (a *Agent) Fictional() bool {
	return a.GetBool(AGENTS_FICTIONAL_FIELD)
}

func (a *Agent) SetFictional(fictional bool) {
	a.Set(AGENTS_FICTIONAL_FIELD, fictional)
}

func (a *Agent) CorporateBody() bool {
	return a.GetBool(AGENTS_CORP_FIELD)
}

func (a *Agent) SetCorporateBody(corporateBody bool) {
	a.Set(AGENTS_CORP_FIELD, corporateBody)
}

func (a *Agent) URI() string {
	return a.GetString(URI_FIELD)
}

func (a *Agent) SetURI(uri string) {
	a.Set(URI_FIELD, uri)
}

func (a *Agent) BiographicalData() string {
	return a.GetString(AGENTS_BIOGRAPHICAL_DATA_FIELD)
}

func (a *Agent) SetBiographicalData(biographicalData string) {
	a.Set(AGENTS_BIOGRAPHICAL_DATA_FIELD, biographicalData)
}

func (a *Agent) Profession() string {
	return a.GetString(AGENTS_PROFESSION_FIELD)
}

func (a *Agent) SetProfession(profession string) {
	a.Set(AGENTS_PROFESSION_FIELD, profession)
}

func (a *Agent) Pseudonyms() string {
	return a.GetString(AGENTS_PSEUDONYMS_FIELD)
}

func (a *Agent) SetPseudonyms(pseudonyms string) {
	a.Set(AGENTS_PSEUDONYMS_FIELD, pseudonyms)
}

func (a *Agent) References() string {
	return a.GetString(REFERENCES_FIELD)
}

func (a *Agent) SetReferences(references string) {
	a.Set(REFERENCES_FIELD, references)
}

func (a *Agent) Annotation() string {
	return a.GetString(ANNOTATION_FIELD)
}

func (a *Agent) SetAnnotation(annotation string) {
	a.Set(ANNOTATION_FIELD, annotation)
}

func (a *Agent) MusenalmID() string {
	return a.GetString(MUSENALMID_FIELD)
}

func (a *Agent) SetMusenalmID(id string) {
	a.Set(MUSENALMID_FIELD, id)
}

func (a *Agent) EditState() string {
	return a.GetString(EDITSTATE_FIELD)
}

func (a *Agent) SetEditState(editState string) {
	a.Set(EDITSTATE_FIELD, editState)
}

func (a *Agent) Comment() string {
	return a.GetString(COMMENT_FIELD)
}
