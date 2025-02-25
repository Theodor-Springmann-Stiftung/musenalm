package dbmodels

import (
	"iter"

	"github.com/pocketbase/pocketbase/core"
)

// INFO: Iterator queries to be reused
// Rules
// 1. Only iterator return type + error for every function
// 2. Parameters can only be two
// 		- core.App
//		- any id or multiple IDs (of an indexed field)
// 3. Naming convention: Iter_<TableName>_<FilteredField>[s]

// BUG: this is not working as expected, see Iter_TableByField in queryhelpers.go
func Iter_REntriesAgents_Agent(app core.App, id string) (iter.Seq2[*REntriesAgents, error], error) {
	innerIterator, err := Iter_TableByField[REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)

	if err != nil {
		return nil, err
	}

	return func(yield func(*REntriesAgents, error) bool) {
		for item, err := range innerIterator {
			if !yield(item, err) {
				return
			}
		}
	}, nil
}
