package templating

import (
	"io/fs"
	"log/slog"
	"path/filepath"
	"slices"
	"strings"
	"sync"
)

// TODO: redo template parsing to allow for just rendering single components
type File struct {
	Name string
	Path string
	Ext  string
}

func FromDirEntry(entry fs.DirEntry, path string) File {
	ext := filepath.Ext(entry.Name())
	Name := strings.TrimSuffix(entry.Name(), ext)
	return File{
		Name: Name,
		Ext:  ext,
		Path: path,
	}
}

type Directory struct {
	Path    string
	Locals  map[string]File
	Globals map[string]File
}

type Templates struct {
	Directories sync.Map // map[string]*Directory
}

func (t *Templates) NewDirectory(path string, fsys fs.FS) (*Directory, error) {
	fspath := PathToFSPath(path)
	entries, err := fs.ReadDir(fsys, fspath)

	wg := &sync.WaitGroup{}

	if err != nil {
		return nil, NewError(FileAccessError, fspath)
	}

	dir := &Directory{}
	for _, file := range entries {
		if file.IsDir() && file.Name() == TEMPLATE_COMPONENT_DIRECTORY {
			wg.Add(1)
			go func() {
				defer wg.Done()
				locals, globals, err := t.ScanComponentDirectory(filepath.Join(fspath, file.Name()), fsys)
				if err != nil {
					slog.Error("Failed to scan component directory", "path", file.Name(), "error", err)
					return
				}
				dir.Locals = locals
				dir.Globals = globals
			}()
		}

		if !slices.Contains(TEMPLATE_FORMATS, filepath.Ext(file.Name())) {
			continue
		}

	}

	wg.Wait()
	return dir, nil
}

func (t *Templates) ScanComponentDirectory(path string, fsys fs.FS) (map[string]File, map[string]File, error) {
	locals := make(map[string]File)
	globals := make(map[string]File)
	fspath := PathToFSPath(path)
	err := fs.WalkDir(fsys, fspath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return NewError(FileAccessError, path)
		}

		if d.IsDir() || !slices.Contains(TEMPLATE_FORMATS, filepath.Ext(d.Name())) {
			return nil
		}

		f := FromDirEntry(d, path)
		if strings.HasPrefix(f.Name, TEMPLATE_GLOBAL_PREFIX) {
			globals[f.Name] = f
		} else {
			locals[f.Name] = f
		}

		return nil
	})

	if err != nil {
		return nil, nil, NewError(FileAccessError, path)
	}

	return locals, globals, nil
}
