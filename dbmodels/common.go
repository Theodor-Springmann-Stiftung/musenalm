package dbmodels

type AnnotatioNotes struct {
	Annotation string `json:",omitempty" db:"annotation"`
	Notes      string `json:",omitempty" db:"edit_comment"`
}

type FieldMetaData struct {
	MetaData MetaData `json:",omitempty" db:"edit_fielddata"`
}
