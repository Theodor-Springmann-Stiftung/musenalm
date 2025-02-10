package pagemodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const (
	P_INDEX_NAME   = "index"
	T_INDEX_BILDER = "bilder"
	T_INDEX_TEXTE  = "texte"

	F_INDEX_BILDER_TITEL        = "Titel"
	F_INDEX_BILDER_BESCHREIBUNG = "Beschreibung"
	F_INDEX_BILDER_BILD         = "Bild"
	F_INDEX_BILDER_VORSCHAU     = "Vorschau"

	F_INDEX_TEXTE_TITEL = "Titel"
	F_INDEX_TEXTE_ABS1  = "Abs1"
	F_INDEX_TEXTE_ABS2  = "Abs2"
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
	return b.GetString(F_INDEX_BILDER_TITEL)
}

func (b *IndexBilder) SetTitel(titel string) {
	b.Set(F_INDEX_BILDER_TITEL, titel)
}

func (b *IndexBilder) Beschreibung() string {
	return b.GetString(F_INDEX_BILDER_BESCHREIBUNG)
}

func (b *IndexBilder) SetBeschreibung(beschreibung string) {
	b.Set(F_INDEX_BILDER_BESCHREIBUNG, beschreibung)
}

func (b *IndexBilder) Bild() string {
	return b.GetString(F_INDEX_BILDER_BILD)
}

func (b *IndexBilder) SetBild(bild *filesystem.File) {
	b.Set(F_INDEX_BILDER_BILD, bild)
}

func (b *IndexBilder) Vorschau() string {
	return b.GetString(F_INDEX_BILDER_VORSCHAU)
}

func (b *IndexBilder) SetVorschau(vorschau *filesystem.File) {
	b.Set(F_INDEX_BILDER_VORSCHAU, vorschau)
}

type IndexTexte struct {
	core.BaseRecordProxy
}

func (t *IndexTexte) TableName() string {
	return GeneratePageTableName(P_INDEX_NAME, T_INDEX_TEXTE)
}

func NewIndexTexte(record *core.Record) *IndexTexte {
	i := &IndexTexte{}
	i.SetProxyRecord(record)
	return i
}

func (t *IndexTexte) Titel() string {
	return t.GetString(F_INDEX_TEXTE_TITEL)
}

func (t *IndexTexte) SetTitel(titel string) {
	t.Set(F_INDEX_TEXTE_TITEL, titel)
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
