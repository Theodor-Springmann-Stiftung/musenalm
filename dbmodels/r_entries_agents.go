package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*REntriesAgents)(nil)

type REntriesAgents struct {
	core.BaseRecordProxy
}

func NewREntriesAgents(record *core.Record) *REntriesAgents {
	i := &REntriesAgents{}
	i.SetProxyRecord(record)
	return i
}

func (r *REntriesAgents) TableName() string {
	return RelationTableName(ENTRIES_TABLE, AGENTS_TABLE)
}

func (r *REntriesAgents) Entry() string {
	return r.GetString(ENTRIES_TABLE)
}

func (r *REntriesAgents) SetEntry(entry string) {
	r.Set(ENTRIES_TABLE, entry)
}

func (r *REntriesAgents) Agent() string {
	return r.GetString(AGENTS_TABLE)
}

func (r *REntriesAgents) SetAgent(agent string) {
	r.Set(AGENTS_TABLE, agent)
}

func (r *REntriesAgents) Type() string {
	return r.GetString(RELATION_TYPE_FIELD)
}

func (r *REntriesAgents) SetType(relationType string) {
	r.Set(RELATION_TYPE_FIELD, relationType)
}

func (r *REntriesAgents) Annotation() string {
	return r.GetString(ANNOTATION_FIELD)
}

func (r *REntriesAgents) SetAnnotation(annotation string) {
	r.Set(ANNOTATION_FIELD, annotation)
}

func (r *REntriesAgents) Comment() string {
	return r.GetString(COMMENT_FIELD)
}

func (r *REntriesAgents) SetComment(comment string) {
	r.Set(COMMENT_FIELD, comment)
}

func (r *REntriesAgents) Conjecture() bool {
	return r.GetBool(RELATION_CONJECTURE_FIELD)
}

func (r *REntriesAgents) SetConjecture(conjecture bool) {
	r.Set(RELATION_CONJECTURE_FIELD, conjecture)
}

func (r *REntriesAgents) Uncertain() bool {
	return r.GetBool(RELATION_UNCERTAIN_FIELD)
}

func (r *REntriesAgents) SetUncertain(uncertain bool) {
	r.Set(RELATION_UNCERTAIN_FIELD, uncertain)
}
