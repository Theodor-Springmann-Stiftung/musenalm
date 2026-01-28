package imports

import (
	"archive/zip"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func ImportFiles(app core.App, candidate *ImportCandidate) error {
	if candidate == nil {
		return fmt.Errorf("no file import candidate found")
	}

	if candidate.IsZip {
		return importFilesFromZip(app, candidate.Path)
	}
	return importFilesFromDir(app, candidate.Path)
}

func importFilesFromZip(app core.App, zipPath string) error {
	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return err
	}
	defer reader.Close()

	for _, file := range reader.File {
		if file.FileInfo().IsDir() {
			continue
		}
		reader, err := file.Open()
		if err != nil {
			return err
		}
		if err := importFileEntry(app, file.Name, reader); err != nil {
			_ = reader.Close()
			return err
		}
		_ = reader.Close()
	}

	return nil
}

func importFilesFromDir(app core.App, dirPath string) error {
	return filepath.WalkDir(dirPath, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.IsDir() {
			return nil
		}
		relPath, err := filepath.Rel(dirPath, path)
		if err != nil {
			return err
		}
		reader, err := os.Open(path)
		if err != nil {
			return err
		}
		defer reader.Close()
		return importFileEntry(app, relPath, reader)
	})
}

func importFileEntry(app core.App, relPath string, reader io.Reader) error {
	parts := strings.Split(filepath.ToSlash(relPath), "/")
	if len(parts) < 3 {
		return nil
	}

	collectionName := parts[0]
	recordId := parts[1]
	filename := parts[len(parts)-1]
	if collectionName == "" || recordId == "" || filename == "" {
		return nil
	}

	collection, err := app.FindCollectionByNameOrId(collectionName)
	if err != nil || collection == nil {
		return nil
	}

	destDir := filepath.Join(app.DataDir(), "storage", collection.Id, recordId)
	if err := os.MkdirAll(destDir, 0o755); err != nil {
		return err
	}
	destPath := filepath.Join(destDir, filename)

	dest, err := os.Create(destPath)
	if err != nil {
		return err
	}
	defer dest.Close()

	_, err = io.Copy(dest, reader)
	return err
}
