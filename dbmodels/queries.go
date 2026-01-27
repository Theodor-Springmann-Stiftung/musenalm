package dbmodels

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/pocketbase/dbx"
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
// TODO: It would be nice if the return types of these, if arrays were custom types that implemented
// some often uses functions, like getting all IDs, or creating a map of the IDs.

func REntriesAgents_Agent(app core.App, id string) ([]*REntriesAgents, error) {
	return TableByFields[*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)
}

func REntriesAgents_Entry(app core.App, id string) ([]*REntriesAgents, error) {
	return TableByFields[*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		ENTRIES_TABLE,
		id,
	)
}

func REntriesAgents_Entries(app core.App, ids []any) ([]*REntriesAgents, error) {
	return TableByFields[*REntriesAgents](
		app,
		RelationTableName(ENTRIES_TABLE, AGENTS_TABLE),
		ENTRIES_TABLE,
		ids,
	)
}

func RContentsAgents_Agent(app core.App, id string) ([]*RContentsAgents, error) {
	return TableByFields[*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		AGENTS_TABLE,
		id,
	)
}

func RContentsAgents_Contents(app core.App, id []any) ([]*RContentsAgents, error) {
	return TableByFields[*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		CONTENTS_TABLE,
		id,
	)
}

func RContentsAgents_Content(app core.App, id string) ([]*RContentsAgents, error) {
	return TableByFields[*RContentsAgents](
		app,
		RelationTableName(CONTENTS_TABLE, AGENTS_TABLE),
		CONTENTS_TABLE,
		id,
	)
}

func REntriesSeries_Entries(app core.App, ids []any) ([]*REntriesSeries, error) {
	return TableByFields[*REntriesSeries](
		app,
		RelationTableName(ENTRIES_TABLE, SERIES_TABLE),
		ENTRIES_TABLE,
		ids,
	)
}

func REntriesSeries_Entry(app core.App, id string) ([]*REntriesSeries, error) {
	return TableByFields[*REntriesSeries](
		app,
		RelationTableName(ENTRIES_TABLE, SERIES_TABLE),
		ENTRIES_TABLE,
		id,
	)
}

func REntriesSeries_Seriess(app core.App, ids []any) ([]*REntriesSeries, error) {
	return TableByFields[*REntriesSeries](
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
	return TableByIDs[*Agent](app, AGENTS_TABLE, ids)
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
	return TableByIDs[*Entry](app, ENTRIES_TABLE, ids)
}

func Series_IDs(app core.App, ids []any) ([]*Series, error) {
	return TableByIDs[*Series](app, SERIES_TABLE, ids)
}

func Series_MusenalmID(app core.App, id string) (*Series, error) {
	ret, err := TableByField[Series](app, SERIES_TABLE, MUSENALMID_FIELD, id)
	return &ret, err
}

func Series_ID(app core.App, id string) (*Series, error) {
	ret, err := TableByID[Series](app, SERIES_TABLE, id)
	return &ret, err
}

func Users_ID(app core.App, id string) (*User, error) {
	ret, err := TableByID[User](app, USERS_TABLE, id)
	return &ret, err
}

func Sessions_ID(app core.App, id string) (*Session, error) {
	ret, err := TableByID[Session](app, SESSIONS_TABLE, id)
	return &ret, err
}

func Data_Key(app core.App, key string) (*Data, error) {
	ret, err := TableByField[Data](app, DATA_TABLE, KEY_FIELD, key)
	return &ret, err
}

func Data_All(app core.App) ([]*Data, error) {
	data := make([]*Data, 0)
	err := app.RecordQuery(DATA_TABLE).All(&data)
	return data, err
}

func Pages_All(app core.App) ([]*Page, error) {
	pages := make([]*Page, 0)
	err := app.RecordQuery(PAGES_TABLE).All(&pages)
	return pages, err
}

func Html_All(app core.App) ([]*HTML, error) {
	html := make([]*HTML, 0)
	err := app.RecordQuery(HTML_TABLE).All(&html)
	return html, err
}

func Images_All(app core.App) ([]*Image, error) {
	images := make([]*Image, 0)
	err := app.RecordQuery(IMAGES_TABLE).All(&images)
	return images, err
}

func Images_Key(app core.App, key string) (*Image, error) {
	ret, err := TableByField[Image](app, IMAGES_TABLE, KEY_FIELD, key)
	return &ret, err
}

func Images_KeyPrefix(app core.App, prefix string) ([]*Image, error) {
	images := make([]*Image, 0)
	err := app.RecordQuery(IMAGES_TABLE).
		Where(dbx.NewExp(KEY_FIELD+" LIKE {:prefix}", dbx.Params{"prefix": prefix + "%"})).
		All(&images)
	return images, err
}

func Files_All(app core.App) ([]*File, error) {
	files := make([]*File, 0)
	err := app.RecordQuery(FILES_TABLE).
		OrderBy(CREATED_FIELD + " DESC").
		All(&files)
	return files, err
}

func AccessTokens_Token(app core.App, token string) (*AccessToken, error) {
	ret, err := TableByField[AccessToken](
		app,
		ACCESS_TOKENS_TABLE,
		ACCESS_TOKENS_TOKEN_FIELD,
		token,
	)
	return &ret, err
}

func Users_Email(app core.App, email string) (*User, error) {
	ret, err := TableByField[User](app, USERS_TABLE, USERS_EMAIL_FIELD, email)
	return &ret, err
}

func Sessions_Token(app core.App, token string) (*Session, error) {
	t := HashStringSHA256(token)
	ret, err := TableByField[Session](
		app,
		SESSIONS_TABLE,
		SESSIONS_TOKEN_FIELD,
		t,
	)
	return &ret, err
}

func Places_IDs(app core.App, ids []any) ([]*Place, error) {
	return TableByIDs[*Place](app, PLACES_TABLE, ids)
}

func Contents_IDs(app core.App, ids []any) ([]*Content, error) {
	return TableByIDs[*Content](app, CONTENTS_TABLE, ids)
}

func Contents_Entry(app core.App, id string) ([]*Content, error) {
	return TableByFields[*Content](
		app,
		CONTENTS_TABLE,
		ENTRIES_TABLE,
		id,
	)
}

func Items_Entry(app core.App, id string) ([]*Item, error) {
	var ret []*Item
	err := app.RecordQuery(ITEMS_TABLE).
		Where(dbx.NewExp(
			ENTRIES_TABLE+" = {:id} OR (json_valid("+ENTRIES_TABLE+") = 1 AND EXISTS (SELECT 1 FROM json_each("+ENTRIES_TABLE+") WHERE value = {:id}))",
			dbx.Params{"id": id},
		)).
		All(&ret)
	return ret, err
}

func Items_Entries(app core.App, ids []any) ([]*Item, error) {
	if len(ids) == 0 {
		return []*Item{}, nil
	}

	params := dbx.Params{}
	idPlaceholders := make([]string, len(ids))
	for i, id := range ids {
		placeholder := "p" + strconv.Itoa(i)
		params[placeholder] = id
		idPlaceholders[i] = "{:" + placeholder + "}"
	}
	inClause := strings.Join(idPlaceholders, ", ")

	fullExpression := fmt.Sprintf(
		"%s IN (%s) OR (json_valid(%s) = 1 AND EXISTS (SELECT 1 FROM json_each(%s) WHERE value IN (%s)))",
		ENTRIES_TABLE,
		inClause,
		ENTRIES_TABLE,
		ENTRIES_TABLE,
		inClause,
	)

	var ret []*Item
	err := app.RecordQuery(ITEMS_TABLE).
		Where(dbx.NewExp(fullExpression, params)).
		All(&ret)

	return ret, err
}

func Contents_MusenalmID(app core.App, id string) (*Content, error) {
	ret, err := TableByField[Content](app, CONTENTS_TABLE, MUSENALMID_FIELD, id)
	return &ret, err
}

func Places_ID(app core.App, id string) (*Place, error) {
	ret, err := TableByField[Place](app, PLACES_TABLE, ID_FIELD, id)
	return &ret, err
}
