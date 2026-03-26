package pagemodels

import "github.com/pocketbase/pocketbase/core"

type IndexTexte struct {
	core.BaseRecordProxy
}

func (t *IndexTexte) TableName() string {
	return GeneratePageTableName(P_INDEX_NAME)
}

func (t *IndexTexte) Title() string {
	return t.GetString(F_TITLE)
}

func (t *IndexTexte) SetDescription(s string) {
	t.Set(F_DESCRIPTION, s)
}

func (t *IndexTexte) Description() string {
	return t.GetString(F_DESCRIPTION)
}

func (t *IndexTexte) SetTitle(titel string) {
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
