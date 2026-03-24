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

func CleanupInterrupted(app core.App) {
	records := []*core.Record{}
	err := app.RecordQuery(dbmodels.EXPORTS_TABLE).
		Where(
			dbx.NewExp(
				dbmodels.EXPORT_STATUS_FIELD+" = {:queued} OR "+dbmodels.EXPORT_STATUS_FIELD+" = {:running}",
				dbx.Params{
					"queued":  dbmodels.EXPORT_STATUS_QUEUED,
					"running": dbmodels.EXPORT_STATUS_RUNNING,
				},
			),
		).
		All(&records)
	if err != nil {
		app.Logger().Error("Interrupted export cleanup query failed", "error", err)
		return
	}

	if len(records) == 0 {
		return
	}

	exportDir, err := ExportDir(app)
	if err != nil {
		app.Logger().Error("Interrupted export cleanup dir failed", "error", err)
		return
	}

	for _, record := range records {
		removeExportArtifacts(exportDir, record)
		if err := app.Delete(record); err != nil {
			app.Logger().Error("Interrupted export cleanup delete failed", "error", err, "export_id", record.Id)
			continue
		}
		app.Logger().Info("Interrupted export removed on startup", "export_id", record.Id)
	}
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
		removeExportArtifacts(exportDir, record)
		if err := app.Delete(record); err != nil {
			app.Logger().Error("Export cleanup delete failed", "error", err, "export_id", record.Id)
		}
	}
}

func removeExportArtifacts(exportDir string, record *core.Record) {
	filename := exportFilename(record)
	_ = os.Remove(filepath.Join(exportDir, filename))
	_ = os.Remove(filepath.Join(exportDir, filename+".tmp"))
}

func exportFilename(record *core.Record) string {
	filename := record.GetString(dbmodels.EXPORT_FILENAME_FIELD)
	if filename == "" {
		exportType := record.GetString(dbmodels.EXPORT_TYPE_FIELD)
		if exportType == "" {
			exportType = dbmodels.EXPORT_TYPE_DATA
		}
		kind := "data"
		if exportType == dbmodels.EXPORT_TYPE_FILES {
			kind = "files"
		}
		filename = buildExportFilename(kind, record.Id)
	}
	return filepath.Base(filename)
}
