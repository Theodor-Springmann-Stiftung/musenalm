package app

import (
	"sync"
	"sync/atomic"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

type sortedEntriesSnapshot struct {
	Entries []*dbmodels.Entry
}

var sortedEntriesCache atomic.Pointer[sortedEntriesSnapshot]
var sortedEntriesBuildMutex sync.Mutex
var sortedEntriesRefreshMutex sync.Mutex
var sortedEntriesRefreshRun bool
var sortedEntriesRefreshQueued bool

func InvalidateSortedEntriesCache(app core.App) {
	if sortedEntriesCache.Load() == nil {
		return
	}
	ScheduleSortedEntriesCacheRebuild(app)
}

func ScheduleSortedEntriesCacheRebuild(app core.App) {
	sortedEntriesRefreshMutex.Lock()
	sortedEntriesRefreshQueued = true
	if sortedEntriesRefreshRun {
		sortedEntriesRefreshMutex.Unlock()
		return
	}
	sortedEntriesRefreshRun = true
	sortedEntriesRefreshMutex.Unlock()

	go runSortedEntriesCacheRefreshLoop(app)
}

func runSortedEntriesCacheRefreshLoop(app core.App) {
	for {
		sortedEntriesRefreshMutex.Lock()
		sortedEntriesRefreshQueued = false
		sortedEntriesRefreshMutex.Unlock()

		if _, err := rebuildSortedEntriesCache(app); err != nil {
			app.Logger().Error("failed to rebuild sorted entries cache", "error", err)
		}

		sortedEntriesRefreshMutex.Lock()
		if sortedEntriesRefreshQueued {
			sortedEntriesRefreshMutex.Unlock()
			continue
		}
		sortedEntriesRefreshRun = false
		sortedEntriesRefreshMutex.Unlock()
		return
	}
}

func GetSortedEntries(app core.App) ([]*dbmodels.Entry, error) {
	if snapshot := sortedEntriesCache.Load(); snapshot != nil {
		return snapshot.Entries, nil
	}

	sortedEntriesBuildMutex.Lock()
	defer sortedEntriesBuildMutex.Unlock()

	if snapshot := sortedEntriesCache.Load(); snapshot != nil {
		return snapshot.Entries, nil
	}

	snapshot, err := nextSortedEntriesSnapshot(app)
	if err != nil {
		return nil, err
	}
	sortedEntriesCache.Store(snapshot)
	return snapshot.Entries, nil
}

func rebuildSortedEntriesCache(app core.App) (*sortedEntriesSnapshot, error) {
	sortedEntriesBuildMutex.Lock()
	defer sortedEntriesBuildMutex.Unlock()

	snapshot, err := nextSortedEntriesSnapshot(app)
	if err != nil {
		return nil, err
	}
	sortedEntriesCache.Store(snapshot)
	return snapshot, nil
}

func nextSortedEntriesSnapshot(app core.App) (*sortedEntriesSnapshot, error) {
	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return nil, err
	}

	dbmodels.Sort_Entries_Title_Year(entries)
	return &sortedEntriesSnapshot{Entries: entries}, nil
}
