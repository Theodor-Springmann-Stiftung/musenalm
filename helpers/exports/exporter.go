package exports

import (
	"archive/zip"
	"encoding/xml"
	"os"
	"path/filepath"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

const exportDirName = "exports"

func ExportDir(app core.App) (string, error) {
	base := filepath.Join(app.DataDir(), exportDirName)
	if err := os.MkdirAll(base, 0o755); err != nil {
		return "", err
	}
	return base, nil
}

func ListTables(app core.App) ([]string, error) {
	tables := []string{}
	err := app.DB().
		NewQuery("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").
		Column(&tables)
	if err != nil {
		return nil, err
	}

	excluded := map[string]struct{}{
		"_superusers":     {},
		"_mfas":           {},
		"_otps":           {},
		"_externalAuths":  {},
		"_authorigins":    {},
		"_authOrigins":    {},
		"access_tokens":   {},
	}

	filtered := tables[:0]
	for _, table := range tables {
		if strings.HasPrefix(table, dbmodels.FTS5_PREFIX) {
			continue
		}
		if _, ok := excluded[table]; ok {
			continue
		}
		filtered = append(filtered, table)
	}
	return filtered, nil
}

func Run(app core.App, exportID string) error {
	record, err := app.FindRecordById(dbmodels.EXPORTS_TABLE, exportID)
	if err != nil {
		return err
	}

	tables, err := ListTables(app)
	if err != nil {
		return markFailed(app, record, err)
	}

	record.Set(dbmodels.EXPORT_STATUS_FIELD, dbmodels.EXPORT_STATUS_RUNNING)
	record.Set(dbmodels.EXPORT_TABLES_TOTAL_FIELD, len(tables))
	record.Set(dbmodels.EXPORT_TABLES_DONE_FIELD, 0)
	record.Set(dbmodels.EXPORT_PROGRESS_FIELD, 0)
	record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, "")
	record.Set(dbmodels.EXPORT_ERROR_FIELD, "")
	if err := app.Save(record); err != nil {
		return err
	}

	exportDir, err := ExportDir(app)
	if err != nil {
		return markFailed(app, record, err)
	}

	filename := exportID + ".zip"
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

	for idx, table := range tables {
		updateProgress(app, record, table, idx, len(tables))

		if err := exportTableZipEntry(app, zipWriter, table); err != nil {
			return markFailed(app, record, err)
		}

		updateProgress(app, record, table, idx+1, len(tables))
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
	record.Set(dbmodels.EXPORT_TABLES_DONE_FIELD, len(tables))
	record.Set(dbmodels.EXPORT_FILENAME_FIELD, filename)
	record.Set(dbmodels.EXPORT_SIZE_FIELD, stat.Size())
	record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, "")
	record.Set(dbmodels.EXPORT_ERROR_FIELD, "")
	if err := app.Save(record); err != nil {
		return err
	}

	return nil
}

func exportTableZipEntry(app core.App, zipWriter *zip.Writer, table string) error {
	entryName := safeFilename(table)
	if entryName == "" {
		entryName = "table"
	}
	entryName += ".xml"

	entry, err := zipWriter.Create(entryName)
	if err != nil {
		return err
	}
	if _, err := entry.Write([]byte(xml.Header)); err != nil {
		return err
	}

	encoder := xml.NewEncoder(entry)
	start := xml.StartElement{
		Name: xml.Name{Local: "table"},
		Attr: []xml.Attr{{Name: xml.Name{Local: "name"}, Value: table}},
	}
	if err := encoder.EncodeToken(start); err != nil {
		return err
	}

	query := "SELECT * FROM " + quoteTableName(table)
	rows, err := app.DB().NewQuery(query).Rows()
	if err != nil {
		return err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return err
	}

	for rows.Next() {
		rowData := dbx.NullStringMap{}
		if err := rows.ScanMap(rowData); err != nil {
			return err
		}

		if err := encoder.EncodeToken(xml.StartElement{Name: xml.Name{Local: "row"}}); err != nil {
			return err
		}

		sensitiveFields := map[string]struct{}{}
		if table == "users" {
			sensitiveFields = map[string]struct{}{
				"password":      {},
				"password_hash": {},
				"passwordhash":  {},
				"tokenkey":      {},
				"token_key":     {},
			}
		}

		for _, col := range columns {
			lowerCol := strings.ToLower(col)
			if _, ok := sensitiveFields[lowerCol]; ok {
				if err := encoder.EncodeToken(xml.StartElement{Name: xml.Name{Local: col}, Attr: []xml.Attr{{Name: xml.Name{Local: "null"}, Value: "true"}}}); err != nil {
					return err
				}
				if err := encoder.EncodeToken(xml.EndElement{Name: xml.Name{Local: col}}); err != nil {
					return err
				}
				continue
			}

			value := rowData[col]
			attrs := []xml.Attr{}
			if !value.Valid {
				attrs = append(attrs, xml.Attr{Name: xml.Name{Local: "null"}, Value: "true"})
			}

			if err := encoder.EncodeToken(xml.StartElement{Name: xml.Name{Local: col}, Attr: attrs}); err != nil {
				return err
			}
			if value.Valid {
				if err := encoder.EncodeToken(xml.CharData([]byte(value.String))); err != nil {
					return err
				}
			}
			if err := encoder.EncodeToken(xml.EndElement{Name: xml.Name{Local: col}}); err != nil {
				return err
			}
		}

		if err := encoder.EncodeToken(xml.EndElement{Name: xml.Name{Local: "row"}}); err != nil {
			return err
		}
	}

	if err := rows.Err(); err != nil {
		return err
	}

	if err := encoder.EncodeToken(start.End()); err != nil {
		return err
	}

	return encoder.Flush()
}

func updateProgress(app core.App, record *core.Record, table string, done, total int) {
	progress := 0
	if total > 0 {
		progress = int(float64(done) / float64(total) * 100)
	}
	record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, table)
	record.Set(dbmodels.EXPORT_TABLES_DONE_FIELD, done)
	record.Set(dbmodels.EXPORT_PROGRESS_FIELD, progress)
	if err := app.Save(record); err != nil {
		app.Logger().Error("Export progress update failed", "error", err, "export_id", record.Id)
	}
}

func markFailed(app core.App, record *core.Record, err error) error {
	record.Set(dbmodels.EXPORT_STATUS_FIELD, dbmodels.EXPORT_STATUS_FAILED)
	record.Set(dbmodels.EXPORT_ERROR_FIELD, err.Error())
	record.Set(dbmodels.EXPORT_CURRENT_TABLE_FIELD, "")
	record.Set(dbmodels.EXPORT_PROGRESS_FIELD, 0)
	if saveErr := app.Save(record); saveErr != nil {
		return saveErr
	}

	exportDir, dirErr := ExportDir(app)
	if dirErr == nil {
		filename := record.GetString(dbmodels.EXPORT_FILENAME_FIELD)
		if filename == "" {
			filename = record.Id + ".zip"
		}
		filename = filepath.Base(filename)
		_ = os.Remove(filepath.Join(exportDir, filename))
		_ = os.Remove(filepath.Join(exportDir, filename+".tmp"))
	}

	return err
}

func quoteTableName(name string) string {
	return "`" + strings.ReplaceAll(name, "`", "``") + "`"
}

func safeFilename(name string) string {
	name = strings.TrimSpace(name)
	if name == "" {
		return ""
	}
	var b strings.Builder
	b.Grow(len(name))
	for _, r := range name {
		if (r >= 'a' && r <= 'z') ||
			(r >= 'A' && r <= 'Z') ||
			(r >= '0' && r <= '9') ||
			r == '_' || r == '-' || r == '.' {
			b.WriteRune(r)
		} else {
			b.WriteByte('_')
		}
	}
	return b.String()
}
