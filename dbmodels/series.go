package dbmodels

import (
	"slices"

	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

var _ core.RecordProxy = (*Series)(nil)

type Series struct {
	core.BaseRecordProxy
}

func NewSeries(record *core.Record) *Series {
	i := &Series{}
	i.SetProxyRecord(record)
	return i
}

func (s *Series) TableName() string {
	return SERIES_TABLE
}

func (s *Series) Title() string {
	return s.GetString(SERIES_TITLE_FIELD)
}

func (s *Series) SetTitle(title string) {
	s.Set(SERIES_TITLE_FIELD, title)
}

func (s *Series) Pseudonyms() string {
	return s.GetString(SERIES_PSEUDONYMS_FIELD)
}

func (s *Series) SetPseudonyms(pseudonyms string) {
	s.Set(SERIES_PSEUDONYMS_FIELD, pseudonyms)
}

func (s *Series) References() string {
	return s.GetString(REFERENCES_FIELD)
}

func (s *Series) SetReferences(references string) {
	s.Set(REFERENCES_FIELD, references)
}

func (s *Series) Annotation() string {
	return s.GetString(ANNOTATION_FIELD)
}

func (s *Series) SetAnnotation(annotation string) {
	s.Set(ANNOTATION_FIELD, annotation)
}

func (s *Series) MusenalmID() string {
	return s.GetString(MUSENALMID_FIELD)
}

func (s *Series) SetMusenalmID(id string) {
	s.Set(MUSENALMID_FIELD, id)
}

func (s *Series) EditState() string {
	return s.GetString(EDITSTATE_FIELD)
}

func (s *Series) SetEditState(editState string) {
	s.Set(EDITSTATE_FIELD, editState)
}

func (s *Series) Comment() string {
	return s.GetString(COMMENT_FIELD)
}

func (s *Series) SetComment(comment string) {
	s.Set(COMMENT_FIELD, comment)
}

func (s *Series) Frequency() string {
	return s.GetString(SERIES_FREQUENCY_FIELD)
}

func (s *Series) SetFrequency(frequency string) {
	s.Set(SERIES_FREQUENCY_FIELD, frequency)
}

func SortSeriesByTitle(series []*Series) {
	collator := collate.New(language.German)
	slices.SortFunc(series, func(i, j *Series) int {
		return collator.CompareString(i.Title(), j.Title())
	})
}
