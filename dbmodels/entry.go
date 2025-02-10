package dbmodels

import (
	"log/slog"

	"github.com/pocketbase/pocketbase/core"
)

var _ core.RecordProxy = (*Entry)(nil)

type Entry struct {
	core.BaseRecordProxy
}

func NewEntry(record *core.Record) *Entry {
	i := &Entry{}
	i.SetProxyRecord(record)
	return i
}

func (e *Entry) TableName() string {
	return ENTRIES_TABLE
}

func (e *Entry) PreferredTitle() string {
	return e.GetString(PREFERRED_TITLE_FIELD)
}

func (e *Entry) SetPreferredTitle(preferredTitle string) {
	e.Set(PREFERRED_TITLE_FIELD, preferredTitle)
}

func (e *Entry) VariantTitle() string {
	return e.GetString(VARIANT_TITLE_FIELD)
}

func (e *Entry) SetVariantTitle(variantTitle string) {
	e.Set(VARIANT_TITLE_FIELD, variantTitle)
}

func (e *Entry) ParallelTitle() string {
	return e.GetString(PARALLEL_TITLE_FIELD)
}

func (e *Entry) SetParallelTitle(parallelTitle string) {
	e.Set(PARALLEL_TITLE_FIELD, parallelTitle)
}

func (e *Entry) TitleStmt() string {
	return e.GetString(TITLE_STMT_FIELD)
}

func (e *Entry) SetTitleStmt(titleStmt string) {
	e.Set(TITLE_STMT_FIELD, titleStmt)
}

func (e *Entry) SubtitleStmt() string {
	return e.GetString(SUBTITLE_STMT_FIELD)
}

func (e *Entry) SetSubtitleStmt(subtitleStmt string) {
	e.Set(SUBTITLE_STMT_FIELD, subtitleStmt)
}

func (e *Entry) IncipitStmt() string {
	return e.GetString(INCIPIT_STMT_FIELD)
}

func (e *Entry) SetIncipitStmt(incipitStmt string) {
	e.Set(INCIPIT_STMT_FIELD, incipitStmt)
}

func (e *Entry) ResponsibilityStmt() string {
	return e.GetString(RESPONSIBILITY_STMT_FIELD)
}

func (e *Entry) SetResponsibilityStmt(responsibilityStmt string) {
	e.Set(RESPONSIBILITY_STMT_FIELD, responsibilityStmt)
}

func (e *Entry) PublicationStmt() string {
	return e.GetString(PUBLICATION_STMT_FIELD)
}

func (e *Entry) SetPublicationStmt(publicationStmt string) {
	e.Set(PUBLICATION_STMT_FIELD, publicationStmt)
}

func (e *Entry) PlaceStmt() string {
	return e.GetString(PLACE_STMT_FIELD)
}

func (e *Entry) SetPlaceStmt(placeStmt string) {
	e.Set(PLACE_STMT_FIELD, placeStmt)
}

func (e *Entry) Year() int {
	return e.GetInt(YEAR_FIELD)
}

func (e *Entry) SetYear(year int) {
	e.Set(YEAR_FIELD, year)
}

func (e *Entry) Language() []string {
	return e.GetStringSlice(LANGUAGE_FIELD)
}

func (e *Entry) SetLanguage(language []string) {
	e.Set(LANGUAGE_FIELD, language)
}

func (e *Entry) ContentType() []string {
	return e.GetStringSlice(CONTENT_TYPE_FIELD)
}

func (e *Entry) SetContentType(contentType []string) {
	e.Set(CONTENT_TYPE_FIELD, contentType)
}

func (e *Entry) Extent() string {
	return e.GetString(EXTENT_FIELD)
}

func (e *Entry) SetExtent(extent string) {
	e.Set(EXTENT_FIELD, extent)
}

func (e *Entry) Dimensions() string {
	return e.GetString(DIMENSIONS_FIELD)
}

func (e *Entry) SetDimensions(dimensions string) {
	e.Set(DIMENSIONS_FIELD, dimensions)
}

func (e *Entry) Edition() string {
	return e.GetString(EDITION_FIELD)
}

func (e *Entry) SetEdition(edition string) {
	e.Set(EDITION_FIELD, edition)
}

func (e *Entry) MediaType() []string {
	return e.GetStringSlice(MEDIA_TYPE_FIELD)
}

func (e *Entry) SetMediaType(mediaType []string) {
	e.Set(MEDIA_TYPE_FIELD, mediaType)
}

func (e *Entry) CarrierType() []string {
	return e.GetStringSlice(CARRIER_TYPE_FIELD)
}

func (e *Entry) SetCarrierType(carrierType []string) {
	e.Set(CARRIER_TYPE_FIELD, carrierType)
}

func (e *Entry) References() string {
	return e.GetString(REFERENCES_FIELD)
}

func (e *Entry) SetReferences(references string) {
	e.Set(REFERENCES_FIELD, references)
}

func (e *Entry) Places() []string {
	return e.GetStringSlice(PLACES_TABLE)
}

func (e *Entry) SetPlaces(places []string) {
	e.Set(PLACES_TABLE, places)
}

func (e *Entry) Meta() map[string]MetaData {
	md := make(map[string]MetaData)
	err := e.UnmarshalJSONField(META_FIELD, &md)
	if err != nil {
		slog.Error("Error unmarshalling meta field", "error", err)
	}
	return md
}

func (e *Entry) SetMeta(meta map[string]MetaData) {
	e.Set(META_FIELD, meta)
}

func (e *Entry) Deprecated() Deprecated {
	d := Deprecated{}
	err := e.UnmarshalJSONField(MUSENALM_DEPRECATED_FIELD, &d)
	if err != nil {
		slog.Error("Error unmarshalling deprecated field", "error", err)
	}
	return d
}

func (e *Entry) SetDeprecated(deprecated Deprecated) {
	e.Set(MUSENALM_DEPRECATED_FIELD, deprecated)
}

func (e *Entry) MusenalmID() string {
	return e.GetString(MUSENALMID_FIELD)
}

func (e *Entry) SetMusenalmID(musenalmID string) {
	e.Set(MUSENALMID_FIELD, musenalmID)
}

func (e *Entry) EditState() string {
	return e.GetString(EDITSTATE_FIELD)
}

func (e *Entry) SetEditState(editState string) {
	e.Set(EDITSTATE_FIELD, editState)
}

func (e *Entry) Annotation() string {
	return e.GetString(ANNOTATION_FIELD)
}

func (e *Entry) SetAnnotation(annotation string) {
	e.Set(ANNOTATION_FIELD, annotation)
}

func (e *Entry) Comment() string {
	return e.GetString(COMMENT_FIELD)
}

func (e *Entry) SetComment(comment string) {
	e.Set(COMMENT_FIELD, comment)
}
