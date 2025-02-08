package seed

import (
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func NormalizeString(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, "<div>", "")
	s = strings.ReplaceAll(s, "</div>", "")
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
