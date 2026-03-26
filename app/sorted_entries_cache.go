package app

import (
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

var sortedEntriesCache struct {
	sync.RWMutex
	entries []*dbmodels.Entry
}

func InvalidateSortedEntriesCache() {
	sortedEntriesCache.Lock()
	defer sortedEntriesCache.Unlock()
	sortedEntriesCache.entries = nil
}

func GetSortedEntries(app core.App) ([]*dbmodels.Entry, error) {
	sortedEntriesCache.RLock()
	if sortedEntriesCache.entries != nil {
		cached := sortedEntriesCache.entries
		sortedEntriesCache.RUnlock()
		return cached, nil
	}
	sortedEntriesCache.RUnlock()

	sortedEntriesCache.Lock()
	defer sortedEntriesCache.Unlock()

	if sortedEntriesCache.entries != nil {
		return sortedEntriesCache.entries, nil
	}

	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return nil, err
	}

	dbmodels.Sort_Entries_Title_Year(entries)
	sortedEntriesCache.entries = entries
	return sortedEntriesCache.entries, nil
}
