package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func setBasicPublicRules(collection *core.Collection) {
	collection.ViewRule = types.Pointer("@request.auth.id != ''")
	collection.CreateRule = types.Pointer("@request.auth.id != '' && @request.body.user = @request.auth.id")
	collection.UpdateRule = types.Pointer(`
    @request.auth.id != '' &&
    user = @request.auth.id &&
    (@request.body.user:isset = false || @request.body.user = @request.auth.id)
`)
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

func createAgentRelationsTable(app core.App, sourcetablename, targettablename, tablename string) error {
	return nil
}

func basicRelationFields(app core.App, sourcetablename, targettablename string, relations []string) (core.FieldsList, error) {
	stable, err := app.FindCollectionByNameOrId(sourcetablename)
	if err != nil {
		return nil, err
	}

	ttable, err := app.FindCollectionByNameOrId(targettablename)
	if err != nil {
		return nil, err
	}

	fields := core.NewFieldsList(
		&core.RelationField{Name: stable.Name, Required: true, CollectionId: stable.Id},
		&core.RelationField{Name: ttable.Name, Required: true, CollectionId: ttable.Id},
		&core.TextField{Name: "relation_type", Required: true},
	)

	return fields, nil
}
