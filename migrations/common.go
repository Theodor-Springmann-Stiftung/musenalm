package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func setBasicPublicRules(collection *core.Collection) {
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
}

func setMusenalmIDField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.TextField{Name: models.MUSENALMID_FIELD, Max: 64, Required: false})
}

func setEditorStateField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.SelectField{Name: models.EDITSTATE_FIELD, Required: false, Values: models.EDITORSTATE_VALUES})
}

func setNotesAndAnnotationsField(fieldlist *core.FieldsList) {
	fieldlist.Add(&core.EditorField{Name: models.ANNOTATION_FIELD, Required: false, ConvertURLs: false})
	fieldlist.Add(&core.EditorField{Name: models.COMMENT_FIELD, Required: false, ConvertURLs: false})
}

func addMusenalmIDIndex(collection *core.Collection) {
	addIndex(collection, models.MUSENALMID_FIELD, true)
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

	collection := core.NewBaseCollection(relationTableName(stable.Name, ttable.Name))
	setBasicPublicRules(collection)

	fields := core.NewFieldsList(
		&core.RelationField{Name: stable.Name, Required: true, CollectionId: stable.Id, MinSelect: 1, MaxSelect: 1},
		&core.RelationField{Name: ttable.Name, Required: true, CollectionId: ttable.Id, MinSelect: 1, MaxSelect: 1},
		&core.SelectField{Name: "relation_type", Required: true, Values: relations, MaxSelect: 1},
		&core.BoolField{Name: "conjecture", Required: false},
		&core.BoolField{Name: "uncertain", Required: false},
	)

	setNotesAndAnnotationsField(&fields)

	collection.Fields = fields
	addIndex(collection, stable.Name, false)
	addIndex(collection, ttable.Name, false)
	addIndex(collection, "relation_type", false)

	return collection, nil
}

func relationTableName(collection1, collection2 string) string {
	return "R_" + collection1 + "_" + collection2
}
