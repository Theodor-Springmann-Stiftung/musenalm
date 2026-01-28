package exports

import (
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var cleanupOnce sync.Once

func StartCleanup(app core.App, interval time.Duration) {
	if interval <= 0 {
		interval = 12 * time.Hour
	}

	cleanupOnce.Do(func() {
		go func() {
			CleanupExpired(app)
			ticker := time.NewTicker(interval)
			defer ticker.Stop()
			for range ticker.C {
				CleanupExpired(app)
			}
		}()
	})
}

func CleanupExpired(app core.App) {
	now := types.NowDateTime()
	records := []*core.Record{}
	err := app.RecordQuery(dbmodels.EXPORTS_TABLE).
		Where(dbx.NewExp(dbmodels.EXPORT_EXPIRES_FIELD+" <= {:now}", dbx.Params{"now": now})).
		All(&records)
	if err != nil {
		app.Logger().Error("Export cleanup query failed", "error", err)
		return
	}

	if len(records) == 0 {
		return
	}

	exportDir, err := ExportDir(app)
	if err != nil {
		app.Logger().Error("Export cleanup dir failed", "error", err)
		return
	}

	for _, record := range records {
		filename := record.GetString(dbmodels.EXPORT_FILENAME_FIELD)
		if filename == "" {
			filename = record.Id + ".xml"
		}
		filename = filepath.Base(filename)
		_ = os.Remove(filepath.Join(exportDir, filename))
		_ = os.Remove(filepath.Join(exportDir, filename+".tmp"))
		if err := app.Delete(record); err != nil {
			app.Logger().Error("Export cleanup delete failed", "error", err, "export_id", record.Id)
		}
	}
}
