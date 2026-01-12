package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// Find source collection
		abkColl, err := app.FindCollectionByNameOrId("page_benutzerhinweise_abkuerzungen")
		if err != nil {
			return err
		}

		// Query all abbreviations
		var records []*core.Record
		err = app.RecordQuery(abkColl.Name).All(&records)
		if err != nil {
			return err
		}

		// Convert to JSON map
		abkMap := make(map[string]string)
		for _, r := range records {
			abkMap[r.GetString("Abkuerzung")] = r.GetString("Bedeutung")
		}

		// Find data collection
		dataColl, err := app.FindCollectionByNameOrId(dbmodels.DATA_TABLE)
		if err != nil {
			return err
		}

		// Create new record in data table
		record := core.NewRecord(dataColl)
		record.Set(dbmodels.KEY_FIELD, "abkuerzungen")
		record.Set(dbmodels.VALUE_FIELD, abkMap)

		return app.Save(record)
	}, func(app core.App) error {
		// Rollback: delete from data table
		dataColl, err := app.FindCollectionByNameOrId(dbmodels.DATA_TABLE)
		if err != nil {
			return err
		}

		record, err := app.FindFirstRecordByFilter(dataColl.Name, dbmodels.KEY_FIELD+" = 'abkuerzungen'")
		if err != nil {
			return nil // Already deleted
		}

		return app.Delete(record)
	})
}
