package dbmodels

import "github.com/pocketbase/pocketbase/core"

func Ids[T core.RecordProxy](records []T) []any {
	ids := []any{}
	for _, r := range records {
		ids = append(ids, r.ProxyRecord().Id)
	}
	return ids
}

func SetBasicPublicRules(collection *core.Collection) {
	collection.ViewRule = PUBLIC_VIEW_RULE
	collection.ListRule = PUBLIC_LIST_RULE
}

func SetCreatedUpdatedFields(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.AutodateField{Name: CREATED_FIELD, OnCreate: true})
	fieldlist.Add(&core.AutodateField{Name: UPDATED_FIELD, OnCreate: true, OnUpdate: true})
}

func SetMusenalmIDField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.NumberField{Name: MUSENALMID_FIELD, Required: true})
}

func SetEditorStateField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.SelectField{Name: EDITSTATE_FIELD, Required: false, Values: EDITORSTATE_VALUES})
}

func SetNotesAndAnnotationsField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.EditorField{Name: ANNOTATION_FIELD, Required: false, ConvertURLs: false})
	fieldlist.Add(&core.EditorField{Name: COMMENT_FIELD, Required: false, ConvertURLs: false})
}

func AddMusenalmIDIndex(collection *core.Collection) {
	AddIndexNoCollate(collection, MUSENALMID_FIELD, true)
}

func AddIndex(collection *core.Collection, field string, unique bool) {
	name := collection.Name
	iname := "idx_" + name + "_" + field
	u := ""
	if unique {
		u = "UNIQUE "
	}
	itext := "CREATE " + u + "INDEX " + iname + " ON " + name + " (" + field + " COLLATE NOCASE)"
	collection.Indexes = append(collection.Indexes, itext)
}

func AddIndexNoCollate(collection *core.Collection, field string, unique bool) {
	name := collection.Name
	iname := "idx_" + name + "_" + field
	u := ""
	if unique {
		u = "UNIQUE "
	}
	itext := "CREATE " + u + "INDEX " + iname + " ON " + name + " (" + field + ")"
	collection.Indexes = append(collection.Indexes, itext)
}

func RelationTableName(collection1, collection2 string) string {
	return "R_" + collection1 + "_" + collection2
}

func BasicRelationCollection(app core.App, sourcetablename, targettablename string, relations []string) (*core.Collection, error) {
	stable, err := app.FindCollectionByNameOrId(sourcetablename)
	if err != nil {
		return nil, err
	}

	ttable, err := app.FindCollectionByNameOrId(targettablename)
	if err != nil {
		return nil, err
	}

	collection := core.NewBaseCollection(RelationTableName(stable.Name, ttable.Name))
	SetBasicPublicRules(collection)

	fields := core.NewFieldsList(
		&core.RelationField{Name: stable.Name, Required: true, CollectionId: stable.Id, MinSelect: 1, MaxSelect: 1},
		&core.RelationField{Name: ttable.Name, Required: true, CollectionId: ttable.Id, MinSelect: 1, MaxSelect: 1},
		&core.SelectField{Name: RELATION_TYPE_FIELD, Required: true, Values: relations, MaxSelect: 1},
		&core.BoolField{Name: RELATION_CONJECTURE_FIELD, Required: false},
		&core.BoolField{Name: RELATION_UNCERTAIN_FIELD, Required: false},
		&core.AutodateField{Name: CREATED_FIELD, OnCreate: true},
		&core.AutodateField{Name: UPDATED_FIELD, OnCreate: true, OnUpdate: true},
	)

	SetNotesAndAnnotationsField(&fields)

	collection.Fields = fields
	AddIndex(collection, stable.Name, false)
	AddIndex(collection, ttable.Name, false)
	AddIndex(collection, RELATION_TYPE_FIELD, false)

	return collection, nil
}

func GetIDs(records []*core.Record) []any {
	ids := []any{}
	for _, r := range records {
		ids = append(ids, r.Id)
	}
	return ids
}

func GetFields(records []*core.Record, field string) []any {
	fields := []any{}
	for _, r := range records {
		fields = append(fields, r.GetString(field))
	}
	return fields
}
