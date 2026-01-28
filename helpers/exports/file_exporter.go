package exports

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

type fileEntry struct {
	CollectionName string
	CollectionId   string
	RecordId       string
	FieldName      string
	Filename       string
}

func RunFiles(app core.App, exportID string) error {
	record, err := app.FindRecordById(dbmodels.EXPORTS_TABLE, exportID)
	if err != nil {
		return err
	}

	files, err := collectFileEntries(app)
	if err != nil {
		return markFailed(app, record, err)
	}

	record.Set(dbmodels.EXPORT_STATUS_FIELD, dbmodels.EXPORT_STATUS_RUNNING)
	record.Set(dbmodels.EXPORT_TABLES_TOTAL_FIELD, len(files))
	record.Set(dbmodels.EXPORT_TABLES_DONE_FIELD, 0)
	record.Set(dbmodels.EXPORT_PROGRESS_FIELD, 0)
	record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, "")
	record.Set(dbmodels.EXPORT_ERROR_FIELD, "")
	record.Set(dbmodels.EXPORT_FILENAME_FIELD, exportID+"-files.zip")
	if err := app.Save(record); err != nil {
		return err
	}

	exportDir, err := ExportDir(app)
	if err != nil {
		return markFailed(app, record, err)
	}

	filename := exportID + "-files.zip"
	tempPath := filepath.Join(exportDir, filename+".tmp")
	finalPath := filepath.Join(exportDir, filename)

	file, err := os.Create(tempPath)
	if err != nil {
		return markFailed(app, record, err)
	}
	defer func() {
		if file != nil {
			_ = file.Close()
		}
	}()

	zipWriter := zip.NewWriter(file)

	missing := 0
	lastProgressSave := time.Now()
	for idx, entry := range files {
		label := entry.CollectionName + "/" + entry.RecordId + "/" + entry.Filename
		if shouldUpdateProgress(idx, len(files), lastProgressSave) {
			updateProgress(app, record, label, idx, len(files))
			lastProgressSave = time.Now()
		}

		if err := addFileToZip(app, zipWriter, entry); err != nil {
			if os.IsNotExist(err) {
				missing++
				continue
			}
			return markFailed(app, record, err)
		}

		if shouldUpdateProgress(idx+1, len(files), lastProgressSave) {
			updateProgress(app, record, label, idx+1, len(files))
			lastProgressSave = time.Now()
		}
	}

	if err := zipWriter.Close(); err != nil {
		return markFailed(app, record, err)
	}
	if err := file.Close(); err != nil {
		return markFailed(app, record, err)
	}
	file = nil

	if err := os.Rename(tempPath, finalPath); err != nil {
		return markFailed(app, record, err)
	}

	stat, err := os.Stat(finalPath)
	if err != nil {
		return markFailed(app, record, err)
	}

	record.Set(dbmodels.EXPORT_STATUS_FIELD, dbmodels.EXPORT_STATUS_COMPLETE)
	record.Set(dbmodels.EXPORT_PROGRESS_FIELD, 100)
	record.Set(dbmodels.EXPORT_TABLES_DONE_FIELD, len(files))
	record.Set(dbmodels.EXPORT_FILENAME_FIELD, filename)
	record.Set(dbmodels.EXPORT_SIZE_FIELD, stat.Size())
	record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, "")
	if missing > 0 {
		record.Set(dbmodels.EXPORT_ERROR_FIELD, fmt.Sprintf("%d Datei(en) fehlen im Speicher.", missing))
	} else {
		record.Set(dbmodels.EXPORT_ERROR_FIELD, "")
	}
	if err := app.Save(record); err != nil {
		return err
	}

	return nil
}

func collectFileEntries(app core.App) ([]fileEntry, error) {
	collections, err := app.FindAllCollections()
	if err != nil {
		return nil, err
	}

	entries := make([]fileEntry, 0)
	seen := make(map[string]struct{})

	for _, collection := range collections {
		if collection == nil || collection.IsView() {
			continue
		}
		if strings.HasPrefix(collection.Name, "_") {
			continue
		}

		fileFields := make([]string, 0)
		for _, field := range collection.Fields {
			if field.Type() == core.FieldTypeFile {
				fileFields = append(fileFields, field.GetName())
			}
		}
		if len(fileFields) == 0 {
			continue
		}

		records := []*core.Record{}
		if err := app.RecordQuery(collection.Name).All(&records); err != nil {
			return nil, err
		}

		for _, record := range records {
			if record == nil {
				continue
			}
			for _, fieldName := range fileFields {
				raw := record.GetRaw(fieldName)
				for _, filename := range extractFileNames(raw) {
					if filename == "" {
						continue
					}
					key := collection.Id + "|" + record.Id + "|" + filename
					if _, ok := seen[key]; ok {
						continue
					}
					seen[key] = struct{}{}
					entries = append(entries, fileEntry{
						CollectionName: collection.Name,
						CollectionId:   collection.Id,
						RecordId:       record.Id,
						FieldName:      fieldName,
						Filename:       filename,
					})
				}
			}
		}
	}

	return entries, nil
}

func extractFileNames(raw any) []string {
	switch value := raw.(type) {
	case nil:
		return nil
	case string:
		v := strings.TrimSpace(value)
		if v == "" {
			return nil
		}
		if strings.HasPrefix(v, "[") {
			var list []string
			if err := json.Unmarshal([]byte(v), &list); err == nil {
				return list
			}
		}
		return []string{v}
	case []string:
		return value
	case []any:
		out := make([]string, 0, len(value))
		for _, item := range value {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	case []byte:
		var list []string
		if err := json.Unmarshal(value, &list); err == nil {
			return list
		}
	}
	return nil
}

func addFileToZip(app core.App, zipWriter *zip.Writer, entry fileEntry) error {
	root := filepath.Join(app.DataDir(), "storage")
	sourcePath := filepath.Join(root, entry.CollectionId, entry.RecordId, entry.Filename)

	reader, err := os.Open(sourcePath)
	if err != nil {
		return err
	}
	defer reader.Close()

	zipPath := entry.CollectionName + "/" + entry.RecordId + "/" + entry.Filename
	zipEntry, err := zipWriter.Create(zipPath)
	if err != nil {
		return err
	}

	_, err = io.Copy(zipEntry, reader)
	return err
}

func shouldUpdateProgress(done, total int, lastSave time.Time) bool {
	if total == 0 {
		return true
	}
	if done == 0 || done >= total {
		return true
	}
	if done%200 == 0 {
		return true
	}
	return time.Since(lastSave) > 2*time.Second
}
