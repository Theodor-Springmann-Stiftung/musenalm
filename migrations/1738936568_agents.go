package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
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
		agents, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
		if err != nil {
			return nil
		}

		return app.Delete(agents)
	})
}

func agentsTable() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	dbmodels.SetBasicPublicRules(collection)
	return collection
}

func agentsFields() core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.AGENTS_NAME_FIELD, Required: true, Presentable: true},
		&core.BoolField{Name: dbmodels.AGENTS_CORP_FIELD, Required: false},
		&core.BoolField{Name: dbmodels.AGENTS_FICTIONAL_FIELD, Required: false},
		&core.URLField{Name: dbmodels.URI_FIELD, Required: false},
		&core.TextField{Name: dbmodels.AGENTS_BIOGRAPHICAL_DATA_FIELD, Required: false, Presentable: true},
		&core.TextField{Name: dbmodels.AGENTS_PROFESSION_FIELD, Required: false},
		&core.TextField{Name: dbmodels.AGENTS_PSEUDONYMS_FIELD, Required: false},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD, Required: false},
	)

	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)

	return fields
}

func agentsIndexes(collection *core.Collection) {
	dbmodels.AddMusenalmIDIndex(collection)
	dbmodels.AddIndex(collection, dbmodels.AGENTS_NAME_FIELD, false)
	dbmodels.AddIndex(collection, dbmodels.URI_FIELD, false)
}
