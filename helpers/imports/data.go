package imports

import (
	"archive/zip"
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

type tableFile struct {
	Name string
	Path string
	Zip  *zip.File
}

type columnValue struct {
	Value  string
	IsNull bool
}

func ImportData(app core.App, candidate *ImportCandidate) error {
	if candidate == nil {
		return fmt.Errorf("no data import candidate found")
	}

	files, err := listDataFiles(candidate)
	if err != nil {
		return err
	}
	if len(files) == 0 {
		return fmt.Errorf("no XML files found in data import")
	}

	tableOrder := make([]string, 0, len(files))
	for _, file := range files {
		tableOrder = append(tableOrder, file.Name)
	}

	return app.RunInTransaction(func(txApp core.App) error {
		for i := len(tableOrder) - 1; i >= 0; i-- {
			if shouldSkipImportTable(tableOrder[i]) {
				continue
			}
			if _, err := txApp.DB().NewQuery("DELETE FROM " + quoteTableName(tableOrder[i])).Execute(); err != nil {
				return err
			}
		}

		for _, file := range files {
			if shouldSkipImportTable(file.Name) {
				continue
			}

			reader, closeFn, err := openTableReader(file)
			if err != nil {
				return err
			}
			if err := importTableXML(txApp, reader); err != nil {
				closeFn()
				return err
			}
			closeFn()
		}

		return nil
	})
}

func listDataFiles(candidate *ImportCandidate) ([]tableFile, error) {
	files := []tableFile{}
	if candidate.IsZip {
		reader, err := zip.OpenReader(candidate.Path)
		if err != nil {
			return nil, err
		}
		defer reader.Close()

		for _, file := range reader.File {
			if file.FileInfo().IsDir() || !strings.HasSuffix(strings.ToLower(file.Name), ".xml") {
				continue
			}
			files = append(files, tableFile{
				Name: strings.TrimSuffix(filepath.Base(file.Name), ".xml"),
				Zip:  file,
			})
		}
	} else {
		entries, err := os.ReadDir(candidate.Path)
		if err != nil {
			return nil, err
		}
		for _, entry := range entries {
			if entry.IsDir() {
				continue
			}
			name := entry.Name()
			if !strings.HasSuffix(strings.ToLower(name), ".xml") {
				continue
			}
			files = append(files, tableFile{
				Name: strings.TrimSuffix(name, ".xml"),
				Path: filepath.Join(candidate.Path, name),
			})
		}
	}

	sort.Slice(files, func(i, j int) bool {
		return files[i].Name < files[j].Name
	})
	return files, nil
}

func openTableReader(file tableFile) (io.ReadCloser, func(), error) {
	if file.Zip != nil {
		reader, err := file.Zip.Open()
		if err != nil {
			return nil, func() {}, err
		}
		return reader, func() { _ = reader.Close() }, nil
	}

	reader, err := os.Open(file.Path)
	if err != nil {
		return nil, func() {}, err
	}
	return reader, func() { _ = reader.Close() }, nil
}

func importTableXML(app core.App, reader io.Reader) error {
	decoder := xml.NewDecoder(reader)
	var tableName string
	inRow := false
	rowValues := map[string]columnValue{}

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		switch t := token.(type) {
		case xml.StartElement:
			if t.Name.Local == "table" {
				for _, attr := range t.Attr {
					if attr.Name.Local == "name" {
						tableName = strings.TrimSpace(attr.Value)
						break
					}
				}
				if tableName == "" {
					return fmt.Errorf("missing table name in XML")
				}
				continue
			}

			if t.Name.Local == "row" {
				inRow = true
				rowValues = map[string]columnValue{}
				continue
			}

			if inRow {
				colName := t.Name.Local
				isNull := hasNullAttr(t.Attr)
				var text string
				if err := decoder.DecodeElement(&text, &t); err != nil {
					return err
				}
				rowValues[colName] = columnValue{
					Value:  text,
					IsNull: isNull,
				}
			}
		case xml.EndElement:
			if t.Name.Local == "row" && inRow {
				if err := insertRow(app, tableName, rowValues); err != nil {
					return err
				}
				inRow = false
			}
		}
	}
	return nil
}

func insertRow(app core.App, tableName string, row map[string]columnValue) error {
	if len(row) == 0 {
		return nil
	}
	cols := make([]string, 0, len(row))
	placeholders := make([]string, 0, len(row))
	params := dbx.Params{}

	idx := 0
	for col, value := range row {
		cols = append(cols, quoteIdentifier(col))
		paramName := fmt.Sprintf("p%d", idx)
		placeholders = append(placeholders, "{:"+paramName+"}")
		if value.IsNull {
			params[paramName] = nil
		} else {
			params[paramName] = value.Value
		}
		idx++
	}

	query := "INSERT INTO " + quoteTableName(tableName) +
		" (" + strings.Join(cols, ", ") + ") VALUES (" + strings.Join(placeholders, ", ") + ")"
	_, err := app.DB().NewQuery(query).Bind(params).Execute()
	return err
}

func hasNullAttr(attrs []xml.Attr) bool {
	for _, attr := range attrs {
		if attr.Name.Local == "null" && strings.EqualFold(attr.Value, "true") {
			return true
		}
	}
	return false
}

func shouldSkipImportTable(name string) bool {
	if name == "" {
		return true
	}
	if strings.HasPrefix(name, "_") {
		return true
	}
	switch name {
	case "schema_migrations":
		return true
	}
	return false
}

func quoteTableName(name string) string {
	return "`" + strings.ReplaceAll(name, "`", "``") + "`"
}

func quoteIdentifier(name string) string {
	return "`" + strings.ReplaceAll(name, "`", "``") + "`"
}
