package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/models"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		agents := agentsTable()
		agents.Fields = agentsFields(agents)
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

func agentsFields(collection *core.Collection) core.FieldsList {
	fields := core.NewFieldsList(
		&core.TextField{Name: "name", Required: true, Presentable: true},
		&core.BoolField{Name: "corporate_body", Required: false},
		&core.BoolField{Name: "fictional", Required: false},
		&core.URLField{Name: "registry_domains", Required: false},
		&core.TextField{Name: "biographical_data", Required: false, Presentable: true},
		&core.TextField{Name: "profession", Required: false},
		&core.TextField{Name: "pseudonyms", Required: false},
		&core.TextField{Name: "references", Required: false},
	)

	setMusenalmIDField(&fields)
	setEditorStateField(&fields)
	setNotesAndAnnotationsField(&fields)

	return fields
}

func agentsIndexes(collection *core.Collection) {
	addMusenalmIDIndex(collection)
	addIndex(collection, "name", false)
}
