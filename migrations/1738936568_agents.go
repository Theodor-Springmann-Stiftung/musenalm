package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		agents := agentsTable()
		agents.Fields = agentsFields()
		agentsIndexes(agents)

		return app.Save(agents)
	}, func(app core.App) error {
		agents, err := app.FindCollectionByNameOrId(models.AGENTS_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(agents)
	})
}

func agentsTable() *core.Collection {
	collection := core.NewBaseCollection(models.AGENTS_TABLE)
	setBasicPublicRules(collection)
	return collection
}

func agentsFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: models.AGENTS_NAME_FIELD, Required: true, Presentable: true},
		&core.BoolField{Name: models.AGENTS_CORP_FIELD, Required: false},
		&core.BoolField{Name: models.AGENTS_FICTIONAL_FIELD, Required: false},
		&core.URLField{Name: models.URI_FIELD, Required: false},
		&core.TextField{Name: models.AGENTS_BIOGRAPHICAL_DATA_FIELD, Required: false, Presentable: true},
		&core.TextField{Name: models.AGENTS_PROFESSION_FIELD, Required: false},
		&core.TextField{Name: models.AGENTS_PSEUDONYMS_FIELD, Required: false},
		&core.TextField{Name: models.REFERENCES_FIELD, Required: false},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return fields
}

func agentsIndexes(collection *core.Collection) {
	addMusenalmIDIndex(collection)
	addIndex(collection, models.AGENTS_NAME_FIELD, false)
	addIndex(collection, models.URI_FIELD, true)
}
