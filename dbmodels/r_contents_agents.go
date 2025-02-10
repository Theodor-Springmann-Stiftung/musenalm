package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*RContentsAgents)(nil)

type RContentsAgents struct {
	core.BaseRecordProxy
}

func NewRContentsAgents(record *core.Record) *RContentsAgents {
	i := &RContentsAgents{}
	i.SetProxyRecord(record)
	return i
}

func (r *RContentsAgents) TableName() string {
	return RelationTableName(CONTENTS_TABLE, AGENTS_TABLE)
}

func (r *RContentsAgents) Content() string {
	return r.GetString(CONTENTS_TABLE)
}

func (r *RContentsAgents) SetContent(content string) {
	r.Set(CONTENTS_TABLE, content)
}

func (r *RContentsAgents) Agent() string {
	return r.GetString(AGENTS_TABLE)
}

func (r *RContentsAgents) SetAgent(agent string) {
	r.Set(AGENTS_TABLE, agent)
}

func (r *RContentsAgents) Type() string {
	return r.GetString(RELATION_TYPE_FIELD)
}

func (r *RContentsAgents) SetType(relationType string) {
	r.Set(RELATION_TYPE_FIELD, relationType)
}

func (r *RContentsAgents) Annotation() string {
	return r.GetString(ANNOTATION_FIELD)
}

func (r *RContentsAgents) SetAnnotation(annotation string) {
	r.Set(ANNOTATION_FIELD, annotation)
}

func (r *RContentsAgents) Comment() string {
	return r.GetString(COMMENT_FIELD)
}

func (r *RContentsAgents) SetComment(comment string) {
	r.Set(COMMENT_FIELD, comment)
}

func (r *RContentsAgents) Conjecture() bool {
	return r.GetBool(RELATION_CONJECTURE_FIELD)
}

func (r *RContentsAgents) SetConjecture(conjecture bool) {
	r.Set(RELATION_CONJECTURE_FIELD, conjecture)
}

func (r *RContentsAgents) Uncertain() bool {
	return r.GetBool(RELATION_UNCERTAIN_FIELD)
}

func (r *RContentsAgents) SetUncertain(uncertain bool) {
	r.Set(RELATION_UNCERTAIN_FIELD, uncertain)
}
