package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
)

// INFO: Queries to be reused
// Rules
// 1. Only one return type + error for every function
// 2. Parameters can only be two
// 		- core.App
//		- any id or multiple IDs (of an indexed field)
// 3. Naming convention: <TableName>_<FilteredField>[s]
//    For scanning, with an Iter_ prefix, yields single row results

func REntriesAgents_Agent(app core.App, id string) ([]*REntriesAgents, error) {
	return TableByField[[]*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)
}

func REntriesAgents_Entry(app core.App, id string) ([]*REntriesAgents, error) {
	return TableByField[[]*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		ENTRIES_TABLE,
		id,
	)
}

func RContentsAgents_Agent(app core.App, id string) ([]*RContentsAgents, error) {
	return TableByField[[]*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)
}

func REntriesSeries_Entries(app core.App, ids any) ([]*REntriesSeries, error) {
	return TableByField[[]*REntriesSeries](
		app,
		RelationTableName(ENTRIES_TABLE, SERIES_TABLE),
		ENTRIES_TABLE,
		ids,
	)
}

func Agents_ID(app core.App, id string) (*Agent, error) {
	return TableByID[*Agent](app, AGENTS_TABLE, id)
}

func Entries_IDs(app core.App, ids []any) ([]*Entry, error) {
	return TableByID[[]*Entry](app, ENTRIES_TABLE, ids)
}

func Series_IDs(app core.App, ids []any) ([]*Series, error) {
	return TableByID[[]*Series](app, SERIES_TABLE, ids)
}

func Contents_IDs(app core.App, ids []any) ([]*Content, error) {
	return TableByID[[]*Content](app, CONTENTS_TABLE, ids)
}
