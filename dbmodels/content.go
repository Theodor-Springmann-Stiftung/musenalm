package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

var _ core.RecordProxy = (*Content)(nil)

type Content struct {
	core.BaseRecordProxy
}

func NewContent(record *core.Record) *Content {
	i := &Content{}
	i.SetProxyRecord(record)
	return i
}

func (c *Content) TableName() string {
	return CONTENTS_TABLE
}

func (c *Content) PreferredTitle() string {
	return c.GetString(PREFERRED_TITLE_FIELD)
}

func (c *Content) SetPreferredTitle(preferredTitle string) {
	c.Set(PREFERRED_TITLE_FIELD, preferredTitle)
}

func (c *Content) VariantTitle() string {
	return c.GetString(VARIANT_TITLE_FIELD)
}

func (c *Content) SetVariantTitle(variantTitle string) {
	c.Set(VARIANT_TITLE_FIELD, variantTitle)
}

func (c *Content) ParallelTitle() string {
	return c.GetString(PARALLEL_TITLE_FIELD)
}

func (c *Content) SetParallelTitle(parallelTitle string) {
	c.Set(PARALLEL_TITLE_FIELD, parallelTitle)
}

func (c *Content) TitleStmt() string {
	return c.GetString(TITLE_STMT_FIELD)
}

func (c *Content) SetTitleStmt(titleStmt string) {
	c.Set(TITLE_STMT_FIELD, titleStmt)
}

func (c *Content) SubtitleStmt() string {
	return c.GetString(SUBTITLE_STMT_FIELD)
}

func (c *Content) SetSubtitleStmt(subtitleStmt string) {
	c.Set(SUBTITLE_STMT_FIELD, subtitleStmt)
}

func (c *Content) IncipitStmt() string {
	return c.GetString(INCIPIT_STMT_FIELD)
}

func (c *Content) SetIncipitStmt(incipitStmt string) {
	c.Set(INCIPIT_STMT_FIELD, incipitStmt)
}

func (c *Content) ResponsibilityStmt() string {
	return c.GetString(RESPONSIBILITY_STMT_FIELD)
}

func (c *Content) SetResponsibilityStmt(responsibilityStmt string) {
	c.Set(RESPONSIBILITY_STMT_FIELD, responsibilityStmt)
}

func (c *Content) PublicationStmt() string {
	return c.GetString(PUBLICATION_STMT_FIELD)
}

func (c *Content) SetPublicationStmt(publicationStmt string) {
	c.Set(PUBLICATION_STMT_FIELD, publicationStmt)
}

func (c *Content) PlaceStmt() string {
	return c.GetString(PLACE_STMT_FIELD)
}

func (c *Content) SetPlaceStmt(placeStmt string) {
	c.Set(PLACE_STMT_FIELD, placeStmt)
}

func (c *Content) Year() int {
	return c.GetInt(YEAR_FIELD)
}

func (c *Content) SetYear(year int) {
	c.Set(YEAR_FIELD, year)
}

func (c *Content) Language() []string {
	return c.GetStringSlice(LANGUAGE_FIELD)
}

func (c *Content) SetLanguage(language []string) {
	c.Set(LANGUAGE_FIELD, language)
}

func (c *Content) ContentType() []string {
	return c.GetStringSlice(CONTENT_TYPE_FIELD)
}

func (c *Content) SetContentType(contentType []string) {
	c.Set(CONTENT_TYPE_FIELD, contentType)
}

func (c *Content) Extent() string {
	return c.GetString(EXTENT_FIELD)
}

func (c *Content) SetExtent(extent string) {
	c.Set(EXTENT_FIELD, extent)
}

func (c *Content) Dimensions() string {
	return c.GetString(DIMENSIONS_FIELD)
}

func (c *Content) SetDimensions(dimensions string) {
	c.Set(DIMENSIONS_FIELD, dimensions)
}

func (c *Content) MusenalmType() []string {
	return c.GetStringSlice(MUSENALM_INHALTE_TYPE_FIELD)
}

func (c *Content) SetMusenalmType(musenalmType []string) {
	c.Set(MUSENALM_INHALTE_TYPE_FIELD, musenalmType)
}

func (c *Content) MusenalmPagination() string {
	return c.GetString(MUSENALM_PAGINATION_FIELD)
}

func (c *Content) SetMusenalmPagination(musenalmPagination string) {
	c.Set(MUSENALM_PAGINATION_FIELD, musenalmPagination)
}

func (c *Content) Scans() []string {
	return c.GetStringSlice(SCAN_FIELD)
}

func (c *Content) SetScans(scans []*filesystem.File) {
	c.Set(SCAN_FIELD, scans)
}

func (c *Content) Numbering() float64 {
	return c.GetFloat(NUMBERING_FIELD)
}

func (c *Content) SetNumbering(numbering float64) {
	c.Set(NUMBERING_FIELD, numbering)
}

func (c *Content) Entry() string {
	return c.GetString(ENTRIES_TABLE)
}

func (c *Content) SetEntry(entry string) {
	c.Set(ENTRIES_TABLE, entry)
}

func (c *Content) MusenalmID() string {
	return c.GetString(MUSENALMID_FIELD)
}

func (c *Content) SetMusenalmID(musenalmID string) {
	c.Set(MUSENALMID_FIELD, musenalmID)
}

func (c *Content) EditState() string {
	return c.GetString(EDITSTATE_FIELD)
}

func (c *Content) SetEditState(editState string) {
	c.Set(EDITSTATE_FIELD, editState)
}

func (c *Content) Annotation() string {
	return c.GetString(ANNOTATION_FIELD)
}

func (c *Content) SetAnnotation(annotation string) {
	c.Set(ANNOTATION_FIELD, annotation)
}

func (c *Content) Comment() string {
	return c.GetString(COMMENT_FIELD)
}

func (c *Content) SetComment(comment string) {
	c.Set(COMMENT_FIELD, comment)
}
