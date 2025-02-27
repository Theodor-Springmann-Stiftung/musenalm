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
	return TableByFields[[]*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)
}

func REntriesAgents_Entry(app core.App, id string) ([]*REntriesAgents, error) {
	return TableByFields[[]*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		ENTRIES_TABLE,
		id,
	)
}

func REntriesAgents_Entries(app core.App, ids []any) ([]*REntriesAgents, error) {
	return TableByFields[[]*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		ENTRIES_TABLE,
		ids,
	)
}

func RContentsAgents_Agent(app core.App, id string) ([]*RContentsAgents, error) {
	return TableByFields[[]*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)
}

func RContentsAgents_Contents(app core.App, id []any) ([]*RContentsAgents, error) {
	return TableByFields[[]*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		CONTENTS_TABLE,
		id,
	)
}

func RContentsAgents_Content(app core.App, id string) ([]*RContentsAgents, error) {
	return TableByFields[[]*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		CONTENTS_TABLE,
		id,
	)
}

func REntriesSeries_Entries(app core.App, ids []any) ([]*REntriesSeries, error) {
	return TableByFields[[]*REntriesSeries](
		app,
		RelationTableName(ENTRIES_TABLE, SERIES_TABLE),
		ENTRIES_TABLE,
		ids,
	)
}

func REntriesSeries_Entry(app core.App, id string) ([]*REntriesSeries, error) {
	return TableByFields[[]*REntriesSeries](
		app,
		RelationTableName(ENTRIES_TABLE, SERIES_TABLE),
		ENTRIES_TABLE,
		id,
	)
}

func REntriesSeries_Seriess(app core.App, ids []any) ([]*REntriesSeries, error) {
	return TableByFields[[]*REntriesSeries](
		app,
		RelationTableName(ENTRIES_TABLE, SERIES_TABLE),
		SERIES_TABLE,
		ids,
	)
}

func Agents_ID(app core.App, id string) (*Agent, error) {
	r, err := TableByID[Agent](app, AGENTS_TABLE, id)
	return &r, err
}

func Agents_IDs(app core.App, ids []any) ([]*Agent, error) {
	return TableByIDs[[]*Agent](app, AGENTS_TABLE, ids)
}

func Entries_ID(app core.App, id string) (*Entry, error) {
	e, err := TableByID[Entry](app, ENTRIES_TABLE, id)
	return &e, err
}

func Entries_MusenalmID(app core.App, id string) (*Entry, error) {
	ret, err := TableByField[Entry](app, ENTRIES_TABLE, MUSENALMID_FIELD, id)
	return &ret, err
}

func Entries_IDs(app core.App, ids []any) ([]*Entry, error) {
	return TableByIDs[[]*Entry](app, ENTRIES_TABLE, ids)
}

func Series_IDs(app core.App, ids []any) ([]*Series, error) {
	return TableByIDs[[]*Series](app, SERIES_TABLE, ids)
}

func Series_MusenalmID(app core.App, id string) (*Series, error) {
	ret, err := TableByField[Series](app, SERIES_TABLE, MUSENALMID_FIELD, id)
	return &ret, err
}

func Series_ID(app core.App, id string) (*Series, error) {
	ret, err := TableByID[Series](app, SERIES_TABLE, id)
	return &ret, err
}

func Places_IDs(app core.App, ids []any) ([]*Place, error) {
	return TableByIDs[[]*Place](app, PLACES_TABLE, ids)
}

func Contents_IDs(app core.App, ids []any) ([]*Content, error) {
	return TableByIDs[[]*Content](app, CONTENTS_TABLE, ids)
}

func Contents_Entry(app core.App, id string) ([]*Content, error) {
	return TableByFields[[]*Content](
		app,
		CONTENTS_TABLE,
		ENTRIES_TABLE,
		id,
	)
}

func Contents_MusenalmID(app core.App, id string) (*Content, error) {
	ret, err := TableByField[Content](app, CONTENTS_TABLE, MUSENALMID_FIELD, id)
	return &ret, err
}

func Places_ID(app core.App, id string) (*Place, error) {
	ret, err := TableByField[Place](app, PLACES_TABLE, ID_FIELD, id)
	return &ret, err
}
