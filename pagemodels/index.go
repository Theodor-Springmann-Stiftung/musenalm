package pagemodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

type IndexBilder struct {
	core.BaseRecordProxy
}

func (b *IndexBilder) TableName() string {
	return GeneratePageTableName(P_INDEX_NAME, T_INDEX_BILDER)
}

func NewIndexBilder(record *core.Record) *IndexBilder {
	i := &IndexBilder{}
	i.SetProxyRecord(record)
	return i
}

func (b *IndexBilder) Titel() string {
	return b.GetString(F_TITLE)
}

func (b *IndexBilder) SetTitel(titel string) {
	b.Set(F_TITLE, titel)
}

func (b *IndexBilder) Beschreibung() string {
	return b.GetString(F_DESCRIPTION)
}

func (b *IndexBilder) SetBeschreibung(beschreibung string) {
	b.Set(F_DESCRIPTION, beschreibung)
}

func (b *IndexBilder) Bild() string {
	return b.GetString(F_IMAGE)
}

func (b *IndexBilder) SetBild(bild *filesystem.File) {
	b.Set(F_IMAGE, bild)
}

func (b *IndexBilder) Vorschau() string {
	return b.GetString(F_PREVIEW)
}

func (b *IndexBilder) SetVorschau(vorschau *filesystem.File) {
	b.Set(F_PREVIEW, vorschau)
}

type IndexTexte struct {
	core.BaseRecordProxy
}

func (t *IndexTexte) TableName() string {
	return GeneratePageTableName(P_INDEX_NAME)
}

func NewIndexTexte(record *core.Record) *IndexTexte {
	i := &IndexTexte{}
	i.SetProxyRecord(record)
	return i
}

func (t *IndexTexte) Titel() string {
	return t.GetString(F_TITLE)
}

func (t *IndexTexte) SetTitel(titel string) {
	t.Set(F_TITLE, titel)
}

func (t *IndexTexte) Abs1() string {
	return t.GetString(F_INDEX_TEXTE_ABS1)
}

func (t *IndexTexte) SetAbs1(abs1 string) {
	t.Set(F_INDEX_TEXTE_ABS1, abs1)
}

func (t *IndexTexte) Abs2() string {
	return t.GetString(F_INDEX_TEXTE_ABS2)
}

func (t *IndexTexte) SetAbs2(abs2 string) {
	t.Set(F_INDEX_TEXTE_ABS2, abs2)
}

func (t *IndexTexte) Collection(pagename string) *core.Collection {
	coll := BasePageCollection(pagename)
	coll.Fields = append(coll.Fields, StandardPageFields()...)
	coll.Fields = append(coll.Fields, core.NewFieldsList(
		EditorField(F_INDEX_TEXTE_ABS1),
		EditorField(F_INDEX_TEXTE_ABS2),
	)...)
	return coll
}
