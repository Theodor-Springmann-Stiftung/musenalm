package pagemodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

type Reihen struct {
	core.BaseRecordProxy
}

func (r *Reihen) TableName() string {
	return GeneratePageTableName(P_REIHEN_NAME)
}

func NewReihen(record *core.Record) *Reihen {
	i := &Reihen{}
	i.SetProxyRecord(record)
	return i
}

func (r *Reihen) Title() string {
	return r.GetString(F_TITLE)
}

func (r *Reihen) SetTitle(titel string) {
	r.Set(F_TITLE, titel)
}

func (r *Reihen) Description() string {
	return r.GetString(F_DESCRIPTION)
}

func (r *Reihen) SetDescription(beschreibung string) {
	r.Set(F_DESCRIPTION, beschreibung)
}

func (r *Reihen) Keywords() string {
	return r.GetString(F_TAGS)
}

func (r *Reihen) SetKeywords(keywords string) {
	r.Set(F_TAGS, keywords)
}

func (r *Reihen) Text() string {
	return r.GetString(F_TEXT)
}

func (r *Reihen) SetText(text string) {
	r.Set(F_TEXT, text)
}

func (r *Reihen) Image() string {
	return r.GetString(F_IMAGE)
}

func (r *Reihen) SetImage(image *filesystem.File) {
	r.Set(F_IMAGE, image)
}
