package dbmodels

type FieldMetaData struct {
	MetaData MetaData `json:",omitempty" db:"edit_fielddata"`
}
