package migrations

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Remove list and view rules — no public access via PocketBase native API
		noAccessCollections := []string{
			dbmodels.PLACES_TABLE,
			dbmodels.AGENTS_TABLE,
			dbmodels.SERIES_TABLE,
			dbmodels.ENTRIES_TABLE,
			dbmodels.ITEMS_TABLE,
			dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE),
			dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE),
			dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE),
			dbmodels.DATA_TABLE,
			dbmodels.HTML_TABLE,
			dbmodels.PAGES_TABLE,
			dbmodels.SETTINGS_TABLE,
		}

		for _, name := range noAccessCollections {
			coll, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return fmt.Errorf("failed to find %q: %w", name, err)
			}
			coll.ListRule = nil
			coll.ViewRule = nil
			if err := app.Save(coll); err != nil {
				return fmt.Errorf("failed to save %q: %w", name, err)
			}
		}

		// Remove list rules but keep view rules — /api/files/ serving requires viewRule
		viewOnlyCollections := []string{
			dbmodels.CONTENTS_TABLE,
			dbmodels.IMAGES_TABLE,
			dbmodels.FILES_TABLE,
		}

		for _, name := range viewOnlyCollections {
			coll, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return fmt.Errorf("failed to find %q: %w", name, err)
			}
			coll.ListRule = nil
			if err := app.Save(coll); err != nil {
				return fmt.Errorf("failed to save %q: %w", name, err)
			}
		}

		return nil
	}, func(app core.App) error {
		allCollections := []string{
			dbmodels.PLACES_TABLE,
			dbmodels.AGENTS_TABLE,
			dbmodels.SERIES_TABLE,
			dbmodels.ENTRIES_TABLE,
			dbmodels.ITEMS_TABLE,
			dbmodels.CONTENTS_TABLE,
			dbmodels.IMAGES_TABLE,
			dbmodels.FILES_TABLE,
			dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE),
			dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE),
			dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE),
			dbmodels.DATA_TABLE,
			dbmodels.HTML_TABLE,
			dbmodels.PAGES_TABLE,
			dbmodels.SETTINGS_TABLE,
		}

		for _, name := range allCollections {
			coll, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				return fmt.Errorf("failed to find %q: %w", name, err)
			}
			dbmodels.SetBasicPublicRules(coll)
			if err := app.Save(coll); err != nil {
				return fmt.Errorf("failed to save %q: %w", name, err)
			}
		}

		return nil
	})
}
