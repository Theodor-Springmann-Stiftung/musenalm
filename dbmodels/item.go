package dbmodels

import "github.com/pocketbase/pocketbase/core"

type Item struct {
	core.BaseModel
	Entry      string `json:",omitempty" db:"entries"`
	Identifier string `json:",omitempty" db:"identifier"`
	Location   string `json:",omitempty" db:"location"`
	Owner      string `json:",omitempty" db:"owner"`
	Media      string `json:",omitempty" db:"media"`
	Condition  string `json:",omitempty" db:"condition"`
	Scans      string `json:",omitempty" db:"scans"`
	Uri        string `json:",omitempty" db:"uri"`
	AnnotatioNotes
}

func (i *Item) TableName() string {
	return ITEMS_TABLE
}
