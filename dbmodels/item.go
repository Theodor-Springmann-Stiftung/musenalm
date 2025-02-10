package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*Item)(nil)

type Item struct {
	core.BaseRecordProxy
	// Entry      string `json:",omitempty" db:"entries"`
	// Identifier string `json:",omitempty" db:"identifier"`
	// Location   string `json:",omitempty" db:"location"`
	// Owner      string `json:",omitempty" db:"owner"`
	// Media      string `json:",omitempty" db:"media"`
	// Condition  string `json:",omitempty" db:"condition"`
	// Scans      string `json:",omitempty" db:"scans"`
	// Uri        string `json:",omitempty" db:"uri"`
}

func NewItem(record *core.Record) *Item {
	i := &Item{}
	i.SetProxyRecord(record)
	return i
}

func (i *Item) TableName() string {
	return ITEMS_TABLE
}

func (a *Item) Entry() string {
	return a.GetString(ENTRIES_TABLE)
}

func (a *Item) SetEntry(entry string) {
	a.Set(ENTRIES_TABLE, entry)
}

func (a *Item) Identifier() string {
	return a.GetString(ITEMS_IDENTIFIER_FIELD)
}

func (a *Item) SetIdentifier(identifier string) {
	a.Set(ITEMS_IDENTIFIER_FIELD, identifier)
}

func (a *Item) Location() string {
	return a.GetString(ITEMS_LOCATION_FIELD)
}

func (a *Item) SetLocation(location string) {
	a.Set(ITEMS_LOCATION_FIELD, location)
}

func (a *Item) Owner() string {
	return a.GetString(ITEMS_OWNER_FIELD)
}

func (a *Item) SetOwner(owner string) {
	a.Set(ITEMS_OWNER_FIELD, owner)
}

func (a *Item) Media() []string {
	return a.GetStringSlice(ITEMS_MEDIA_FIELD)
}

func (a *Item) SetMedia(media []string) {
	a.Set(ITEMS_MEDIA_FIELD, media)
}

func (a *Item) Condition() string {
	return a.GetString(ITEMS_CONDITION_FIELD)
}

func (a *Item) SetCondition(condition string) {
	a.Set(ITEMS_CONDITION_FIELD, condition)
}

func (a *Item) Scans() string {
	return a.GetString(SCAN_FIELD)
}

func (a *Item) SetScans(scans string) {
	a.Set(SCAN_FIELD, scans)
}

func (a *Item) Uri() string {
	return a.GetString(URI_FIELD)
}

func (a *Item) SetUri(uri string) {
	a.Set(URI_FIELD, uri)
}

func (a *Item) Notes() string {
	return a.GetString(COMMENT_FIELD)
}

func (a *Item) SetNotes(notes string) {
	a.Set(COMMENT_FIELD, notes)
}

func (a *Item) Annotation() string {
	return a.GetString(ANNOTATION_FIELD)
}

func (a *Item) SetAnnotation(annotation string) {
	a.Set(ANNOTATION_FIELD, annotation)
}

func (a *Item) EditState() string {
	return a.GetString(EDITSTATE_FIELD)
}

func (a *Item) SetEditState(editState string) {
	a.Set(EDITSTATE_FIELD, editState)
}

func (a *Item) Comments() string {
	return a.GetString(COMMENT_FIELD)
}

func (a *Item) SetComments(comments string) {
	a.Set(COMMENT_FIELD, comments)
}
