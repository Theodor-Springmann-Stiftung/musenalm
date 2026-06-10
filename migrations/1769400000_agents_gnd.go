package migrations

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		return ensureAgentsDataField(app)
	}, func(app core.App) error {
		return nil
	})
}

func ensureAgentsDataField(app core.App) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		return fmt.Errorf("find agents collection: %w", err)
	}

	if collection.Fields.GetByName(dbmodels.DATA_FIELD) != nil {
		return nil
	}

	collection.Fields.Add(&core.JSONField{Name: dbmodels.DATA_FIELD, Required: false})
	return app.Save(collection)
}
