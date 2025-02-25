package app

import (
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/fsnotify/fsnotify"
)

const (
	WATCHER_DEBOUNCE = 300 * time.Millisecond
)

// INFO: this is hot reload for poor people
type Watcher struct {
	*fsnotify.Watcher
}

func RefreshWatcher(engine *templating.Engine) (*Watcher, error) {
	watcher := Watcher{}
	w, err := fsnotify.NewWatcher()
	if err != nil {
		return nil, err
	}
	watcher.Watcher = w

	done := make(chan bool)

	go func() {
		var reloadTimer *time.Timer

		for {
			select {
			case event := <-watcher.Events:
				if event.Op&(fsnotify.Create|fsnotify.Write|fsnotify.Remove|fsnotify.Rename) != 0 {
					if reloadTimer != nil {
						reloadTimer.Stop()
					}
					reloadTimer = time.AfterFunc(WATCHER_DEBOUNCE, func() {
						log.Println("Changes detected, reloading templates...")
						engine.Refresh()
					})
				}

				if event.Op&fsnotify.Create == fsnotify.Create {
					fi, statErr := os.Stat(event.Name)
					if statErr == nil && fi.IsDir() {
						_ = watcher.Add(event.Name)
						log.Printf("Now watching new directory: %s", event.Name)
					}
				}

			case err := <-watcher.Errors:
				if err != nil {
					log.Printf("fsnotify error: %v\n", err)
				}

			case <-done:
				watcher.Close()
				return
			}
		}
	}()

	return &watcher, nil

}

func EngineWatcher(engine *templating.Engine) (*Watcher, error) {
	watcher := Watcher{}
	w, err := fsnotify.NewWatcher()
	if err != nil {
		return nil, err
	}
	watcher.Watcher = w

	done := make(chan bool)

	go func() {
		var reloadTimer *time.Timer

		for {
			select {
			case event := <-watcher.Events:
				if event.Op&(fsnotify.Create|fsnotify.Write|fsnotify.Remove|fsnotify.Rename) != 0 {
					if reloadTimer != nil {
						reloadTimer.Stop()
					}
					reloadTimer = time.AfterFunc(WATCHER_DEBOUNCE, func() {
						log.Println("Changes detected, reloading templates...")
						engine.Reload()
					})
				}

				if event.Op&fsnotify.Create == fsnotify.Create {
					fi, statErr := os.Stat(event.Name)
					if statErr == nil && fi.IsDir() {
						_ = watcher.Add(event.Name)
						log.Printf("Now watching new directory: %s", event.Name)
					}
				}

			case err := <-watcher.Errors:
				if err != nil {
					log.Printf("fsnotify error: %v\n", err)
				}

			case <-done:
				watcher.Close()
				return
			}
		}
	}()

	return &watcher, nil
}

func (w *Watcher) AddRecursive(root string) error {
	return filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			werr := w.Add(path)
			if werr != nil {
				return werr
			}
			log.Printf("Now watching directory: %s", path)
		}
		return nil
	})
}
