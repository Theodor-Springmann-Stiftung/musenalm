package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*REntriesSeries)(nil)

type REntriesSeries struct {
	core.BaseRecordProxy
}

func NewREntriesSeries(record *core.Record) *REntriesSeries {
	i := &REntriesSeries{}
	i.SetProxyRecord(record)
	return i
}

func (r *REntriesSeries) TableName() string {
	return RelationTableName(ENTRIES_TABLE, SERIES_TABLE)
}

func (r *REntriesSeries) Entry() string {
	return r.GetString(ENTRIES_TABLE)
}

func (r *REntriesSeries) SetEntry(entry string) {
	r.Set(ENTRIES_TABLE, entry)
}

func (r *REntriesSeries) Series() string {
	return r.GetString(SERIES_TABLE)
}

func (r *REntriesSeries) SetSeries(series string) {
	r.Set(SERIES_TABLE, series)
}

func (r *REntriesSeries) Numbering() string {
	return r.GetString(NUMBERING_FIELD)
}

func (r *REntriesSeries) SetNumbering(numbering string) {
	r.Set(NUMBERING_FIELD, numbering)
}

func (r *REntriesSeries) Type() string {
	return r.GetString(RELATION_TYPE_FIELD)
}

func (r *REntriesSeries) SetType(relationType string) {
	r.Set(RELATION_TYPE_FIELD, relationType)
}

func (r *REntriesSeries) Annotation() string {
	return r.GetString(ANNOTATION_FIELD)
}

func (r *REntriesSeries) SetAnnotation(annotation string) {
	r.Set(ANNOTATION_FIELD, annotation)
}

func (r *REntriesSeries) Comment() string {
	return r.GetString(COMMENT_FIELD)
}

func (r *REntriesSeries) SetComment(comment string) {
	r.Set(COMMENT_FIELD, comment)
}

func (r *REntriesSeries) Conjecture() bool {
	return r.GetBool(RELATION_CONJECTURE_FIELD)
}

func (r *REntriesSeries) SetConjecture(conjecture bool) {
	r.Set(RELATION_CONJECTURE_FIELD, conjecture)
}

func (r *REntriesSeries) Uncertain() bool {
	return r.GetBool(RELATION_UNCERTAIN_FIELD)
}

func (r *REntriesSeries) SetUncertain(uncertain bool) {
	r.Set(RELATION_UNCERTAIN_FIELD, uncertain)
}
