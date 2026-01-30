package app

import (
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/imports"
	"github.com/pocketbase/pocketbase/core"
)

func StartWeeklyFTS5Rebuild(app core.App) {
	go func() {
		for {
			next := nextSundayMidnight(time.Now())
			timer := time.NewTimer(time.Until(next))
			<-timer.C
			timer.Stop()

			app.Logger().Info("Starting scheduled FTS5 rebuild", "scheduled_for", next.Format(time.RFC3339))
			status, err := imports.StartFTS5Rebuild(app, false)
			if err != nil {
				app.Logger().Error("Scheduled FTS5 rebuild failed", "error", err)
			} else if status == "running" {
				app.Logger().Info("Scheduled FTS5 rebuild skipped (already running)")
			} else {
				app.Logger().Info("Scheduled FTS5 rebuild started")
			}
		}
	}()
}

func nextSundayMidnight(now time.Time) time.Time {
	local := now.In(time.Local)
	daysUntil := (7 - int(local.Weekday())) % 7
	base := time.Date(local.Year(), local.Month(), local.Day(), 0, 0, 0, 0, local.Location())
	next := base.AddDate(0, 0, daysUntil)
	if !next.After(local) {
		next = next.AddDate(0, 0, 7)
	}
	return next
}
