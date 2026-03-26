package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func BasePageCollection(pagename string) *core.Collection {
	c := core.NewBaseCollection(GeneratePageTableName(pagename))
	c.ListRule = dbmodels.PUBLIC_LIST_RULE
	c.ViewRule = dbmodels.PUBLIC_VIEW_RULE
	c.Fields = append(c.Fields, StandardPageFields()...)
	return c
}

func StandardPageFields() core.FieldsList {
	ret := core.NewFieldsList(
		RequiredTextField(F_TITLE),
		EditorField(F_DESCRIPTION),
		TextField(F_TAGS),
	)

	ret = append(ret, CreatedUpdatedFields()...)
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

func CreatedUpdatedFields() core.FieldsList {
	return core.NewFieldsList(
		&core.AutodateField{Name: dbmodels.CREATED_FIELD, OnCreate: true},
		&core.AutodateField{Name: dbmodels.UPDATED_FIELD, OnCreate: true, OnUpdate: true},
	)
}
