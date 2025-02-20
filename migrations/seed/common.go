package seed

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/unicode/norm"
)

func NormalizeString(s string) string {
	s = datatypes.NormalizeString(s)
	s = norm.NFC.String(s)
	return s
}

func BatchSave(app core.App, records []*core.Record) error {
	app.RunInTransaction(func(txapp core.App) error {
		for _, record := range records {
			if err := txapp.Save(record); err != nil {
				app.Logger().Error("Error saving record.", "error", err, "record", record)
				continue
			}
		}
		return nil
	})

	return nil
}
