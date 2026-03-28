package migrations

import (
	"fmt"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		tables := []string{
			dbmodels.AGENTS_TABLE,
			dbmodels.ENTRIES_TABLE,
			dbmodels.PLACES_TABLE,
			dbmodels.SERIES_TABLE,
		}

		for _, table := range tables {
			if err := validateMusenalmIDIntegrity(app, table); err != nil {
				return err
			}

			collection, err := app.FindCollectionByNameOrId(table)
			if err != nil {
				return fmt.Errorf("failed to find %q collection: %w", table, err)
			}

			field, ok := collection.Fields.GetByName(dbmodels.MUSENALMID_FIELD).(*core.NumberField)
			if !ok {
				return fmt.Errorf("failed to find %q number field on %q", dbmodels.MUSENALMID_FIELD, table)
			}
			field.Required = true

			collection.Indexes = removeMusenalmIndexes(collection.Indexes, table)
			dbmodels.AddMusenalmIDIndex(collection)

			if err := app.Save(collection); err != nil {
				return fmt.Errorf("failed to save %q collection: %w", table, err)
			}
		}

		return nil
	}, func(app core.App) error {
		return nil
	})
}

func validateMusenalmIDIntegrity(app core.App, table string) error {
	invalidCount := 0
	if err := app.DB().NewQuery(
		"SELECT COUNT(*) AS count FROM " + table + " WHERE " + dbmodels.MUSENALMID_FIELD + " IS NULL OR " + dbmodels.MUSENALMID_FIELD + " = 0",
	).Row(&invalidCount); err != nil {
		return fmt.Errorf("failed to validate %q musenalm_id values: %w", table, err)
	}
	if invalidCount > 0 {
		return fmt.Errorf("%q contains %d invalid musenalm_id values", table, invalidCount)
	}

	duplicates := []struct {
		MusenalmID int `db:"musenalm_id"`
		Count      int `db:"count"`
	}{}
	if err := app.DB().NewQuery(
		"SELECT " + dbmodels.MUSENALMID_FIELD + " AS musenalm_id, COUNT(*) AS count FROM " + table + " GROUP BY " + dbmodels.MUSENALMID_FIELD + " HAVING COUNT(*) > 1",
	).All(&duplicates); err != nil {
		return fmt.Errorf("failed to validate %q musenalm_id duplicates: %w", table, err)
	}
	if len(duplicates) > 0 {
		return fmt.Errorf("%q contains duplicate musenalm_id values", table)
	}

	return nil
}

func removeMusenalmIndexes(indexes []string, table string) []string {
	filtered := make([]string, 0, len(indexes))
	indexName := "idx_" + table + "_" + dbmodels.MUSENALMID_FIELD
	for _, index := range indexes {
		if strings.Contains(index, indexName) {
			continue
		}
		filtered = append(filtered, index)
	}
	return filtered
}
