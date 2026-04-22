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

func (r *REntriesSeries) Annotation() string {
	return r.GetString(ANNOTATION_FIELD)
}

func (r *REntriesSeries) SetAnnotation(annotation string) {
	r.Set(ANNOTATION_FIELD, annotation)
}
