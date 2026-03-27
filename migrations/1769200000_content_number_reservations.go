package migrations

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		entriesCollection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
		if err != nil {
			return err
		}

		collection := core.NewBaseCollection(dbmodels.CONTENT_NUMBER_RESERVATIONS_TABLE)
		fields := core.NewFieldsList(
			&core.RelationField{
				Name:          dbmodels.ENTRIES_TABLE,
				Required:      true,
				CollectionId:  entriesCollection.Id,
				MinSelect:     1,
				MaxSelect:     1,
				CascadeDelete: true,
			},
			&core.NumberField{
				Name:     dbmodels.CONTENT_NUMBER_RESERVATION_START_FIELD,
				Required: true,
			},
			&core.NumberField{
				Name:     dbmodels.CONTENT_NUMBER_RESERVATION_RESERVED_COUNT_FIELD,
				Required: true,
			},
			&core.NumberField{
				Name:     dbmodels.CONTENT_NUMBER_RESERVATION_NEXT_FIELD,
				Required: true,
			},
			&core.BoolField{
				Name:     dbmodels.CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD,
				Required: false,
			},
		)
		dbmodels.SetCreatedUpdatedFields(&fields)
		collection.Fields = fields

		dbmodels.AddIndex(collection, dbmodels.ENTRIES_TABLE, false)
		dbmodels.AddIndexNoCollate(collection, dbmodels.CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD, false)
		dbmodels.AddIndexNoCollate(collection, dbmodels.CONTENT_NUMBER_RESERVATION_START_FIELD, false)
		collection.Indexes = append(
			collection.Indexes,
			"CREATE UNIQUE INDEX idx_content_number_reservations_entry_active ON "+dbmodels.CONTENT_NUMBER_RESERVATIONS_TABLE+" ("+dbmodels.ENTRIES_TABLE+") WHERE "+dbmodels.CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD+" = true",
		)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENT_NUMBER_RESERVATIONS_TABLE)
		if err != nil {
			if strings.Contains(err.Error(), "not found") || strings.Contains(err.Error(), "no rows in result set") {
				return nil
			}
			return err
		}
		return app.Delete(collection)
	})
}
