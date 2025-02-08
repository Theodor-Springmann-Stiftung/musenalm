package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func setBasicPublicRules(collection *core.Collection) {
	collection.ViewRule = types.Pointer(dbmodels.PUBLIC_VIEW_RULE)
}

func setMusenalmIDField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.TextField{Name: dbmodels.MUSENALMID_FIELD, Max: 64, Required: false})
}

func setEditorStateField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.SelectField{Name: dbmodels.EDITSTATE_FIELD, Required: false, Values: dbmodels.EDITORSTATE_VALUES})
}

func setNotesAndAnnotationsField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.EditorField{Name: dbmodels.ANNOTATION_FIELD, Required: false, ConvertURLs: false})
	fieldlist.Add(&core.EditorField{Name: dbmodels.COMMENT_FIELD, Required: false, ConvertURLs: false})
}

func addMusenalmIDIndex(collection *core.Collection) {
	addIndex(collection, dbmodels.MUSENALMID_FIELD, true)
}

func addIndex(collection *core.Collection, field string, unique bool) {
	name := collection.Name
	collection.AddIndex("idx_"+name+"_"+field, unique, field, "")
}

func basicRelationCollection(app core.App, sourcetablename, targettablename string, relations []string) (*core.Collection, error) {
	stable, err := app.FindCollectionByNameOrId(sourcetablename)
	if err != nil {
		return nil, err
	}

	ttable, err := app.FindCollectionByNameOrId(targettablename)
	if err != nil {
		return nil, err
	}

	collection := core.NewBaseCollection(dbmodels.RelationTableName(stable.Name, ttable.Name))
	setBasicPublicRules(collection)

	fields := core.NewFieldsList(
		&core.RelationField{Name: stable.Name, Required: true, CollectionId: stable.Id, MinSelect: 1, MaxSelect: 1},
		&core.RelationField{Name: ttable.Name, Required: true, CollectionId: ttable.Id, MinSelect: 1, MaxSelect: 1},
		&core.SelectField{Name: dbmodels.RELATION_TYPE_FIELD, Required: true, Values: relations, MaxSelect: 1},
		&core.BoolField{Name: dbmodels.RELATION_CONJECTURE_FIELD, Required: false},
		&core.BoolField{Name: dbmodels.RELATION_UNCERTAIN_FIELD, Required: false},
	)

	setNotesAndAnnotationsField(&fields)

	collection.Fields = fields
	addIndex(collection, stable.Name, false)
	addIndex(collection, ttable.Name, false)
	addIndex(collection, dbmodels.RELATION_TYPE_FIELD, false)

	return collection, nil
}
