package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func BasePageCollection(pagename string) *core.Collection {
	c := core.NewBaseCollection(GeneratePageTableName(pagename))
	c.ListRule = dbmodels.PUBLIC_LIST_RULE
	c.ViewRule = dbmodels.PUBLIC_VIEW_RULE
	c.Fields = StandardPageFields()
	return c
}

func StandardPageFields() core.FieldsList {
	ret := core.NewFieldsList(
		RequiredTextField(F_TITLE),
		EditorField(F_DESCRIPTION),
		TextField(F_TAGS),
	)
	return ret
}

func RequiredTextField(name string) *core.TextField {
	return &core.TextField{Name: name, Required: true, Presentable: true}
}

func EditorField(name string) *core.EditorField {
	return &core.EditorField{Name: name, Required: false, Presentable: false}
}

func TextField(name string) *core.TextField {
	return &core.TextField{Name: name, Required: false, Presentable: false}
}

func ImageField(name string, multiselect bool) *core.FileField {
	maxSelect := 1
	if multiselect {
		maxSelect = 999
	}
	return &core.FileField{
		Name:      name,
		Required:  false,
		MaxSize:   100 * 1024 * 1024,
		MaxSelect: maxSelect,
		MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
	}
}

func RequiredImageField(name string, multiselect bool) *core.FileField {
	maxSelect := 1
	if multiselect {
		maxSelect = 999
	}
	return &core.FileField{
		Name:      name,
		Required:  true,
		MaxSize:   100 * 1024 * 1024,
		MaxSelect: maxSelect,
		MimeTypes: dbmodels.MUSENALM_MIME_TYPES,
		Thumbs:    []string{"0x300", "0x500", "0x1000", "300x0", "500x0", "1000x0"},
	}
}
