package dbmodels

import (
	"errors"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

const (
	FTS5_PREFIX = "fts5_"
	DIVIDER_STR = "; "
)

var SERIES_FTS5_FIELDS = []string{
	SERIES_TITLE_FIELD,
	SERIES_PSEUDONYMS_FIELD,
	REFERENCES_FIELD,
	ANNOTATION_FIELD,
	COMMENT_FIELD,
}

var AGENTS_FTS5_FIELDS = []string{
	AGENTS_NAME_FIELD,
	AGENTS_BIOGRAPHICAL_DATA_FIELD,
	AGENTS_PSEUDONYMS_FIELD,
	ANNOTATION_FIELD,
	COMMENT_FIELD,
}

var PLACES_FTS5_FIELDS = []string{
	PLACES_NAME_FIELD,
	PLACES_PSEUDONYMS_FIELD,
	URI_FIELD,
	ANNOTATION_FIELD,
	COMMENT_FIELD,
}

var ITEMS_FTS5_FIELDS = []string{
	ITEMS_LOCATION_FIELD,
	ITEMS_OWNER_FIELD,
	ITEMS_MEDIA_FIELD,
	ITEMS_CONDITION_FIELD,
	ITEMS_IDENTIFIER_FIELD,
	URI_FIELD,
	ANNOTATION_FIELD,
	COMMENT_FIELD,
}

var ENTRIES_FTS5_FIELDS = []string{
	PREFERRED_TITLE_FIELD,
	VARIANT_TITLE_FIELD,
	PARALLEL_TITLE_FIELD,
	TITLE_STMT_FIELD,
	SUBTITLE_STMT_FIELD,
	INCIPIT_STMT_FIELD,
	RESPONSIBILITY_STMT_FIELD,
	PUBLICATION_STMT_FIELD,
	PLACE_STMT_FIELD,
	EDITION_FIELD,
	YEAR_FIELD,
	EXTENT_FIELD,
	DIMENSIONS_FIELD,
	REFERENCES_FIELD,
	PLACES_TABLE,
	AGENTS_TABLE,
	SERIES_TABLE,
	MUSENALMID_FIELD,
	ANNOTATION_FIELD,
	COMMENT_FIELD,
}

var CONTENTS_FTS5_FIELDS = []string{
	PREFERRED_TITLE_FIELD,
	VARIANT_TITLE_FIELD,
	PARALLEL_TITLE_FIELD,
	TITLE_STMT_FIELD,
	SUBTITLE_STMT_FIELD,
	INCIPIT_STMT_FIELD,
	RESPONSIBILITY_STMT_FIELD,
	PUBLICATION_STMT_FIELD,
	PLACE_STMT_FIELD,
	YEAR_FIELD,
	EXTENT_FIELD,
	DIMENSIONS_FIELD,
	NUMBERING_FIELD,
	ENTRIES_TABLE,
	AGENTS_TABLE,
	MUSENALMID_FIELD,
	ANNOTATION_FIELD,
	COMMENT_FIELD,
}

var ErrInvalidQuery = errors.New("invalid input into the search function")

func NormalizeQuery(query string) []string {
	query = datatypes.NormalizeString(query)
	query = datatypes.DeleteTags(query)
	query = datatypes.RemovePunctuation(query)
	query = cases.Lower(language.German).String(query)
	// TODO: how to normalize, which unicode normalization to use?

	split := strings.Split(query, " ")
	res := []string{}
	for _, s := range split {
		if len(s) > 2 {
			res = append(res, s)
		}
	}

	return res
}

func FTS5Search(app core.App, table string, mapfq ...FTS5QueryRequest) ([]*FTS5IDQueryResult, error) {
	if mapfq == nil || len(mapfq) == 0 || table == "" {
		return nil, ErrInvalidQuery
	}

	q := NewFTS5Query().From(table).SelectID()
	for _, v := range mapfq {
		for _, que := range v.Query {
			q.AndMatch(v.Fields, que)
		}
	}

	querystring := q.Query()
	if querystring == "" {
		return nil, ErrInvalidQuery
	}

	res := []*FTS5IDQueryResult{}
	err := app.DB().NewQuery(querystring).All(&res)
	if err != nil {
		return nil, err
	}

	return res, nil
}

func CreateFTS5TableQuery(tablename string, fields ...string) string {
	if len(fields) == 0 {
		return ""
	}

	str := "CREATE VIRTUAL TABLE IF NOT EXISTS " +
		FTS5TableName(tablename) +
		" USING fts5(" +
		ID_FIELD +
		", "
	for i, f := range fields {
		str += f
		if i < len(fields)-1 {
			str += ", "
		}
	}
	str += ", tokenize = 'trigram')"
	return str
}

func FTS5TableName(table string) string {
	return FTS5_PREFIX + table
}

func InsertFTS5Agent(app core.App, agent *Agent) error {
	query := FTS5InsertQuery(app, AGENTS_TABLE, AGENTS_FTS5_FIELDS)
	return BulkInsertFTS5Agent(query, agent)
}

func BulkInsertFTS5Agent(query *dbx.Query, agent *Agent) error {
	return InsertFTS5Record(
		query,
		agent.Id,
		AGENTS_FTS5_FIELDS,
		FTS5ValuesAgent(agent)...,
	)
}

func InsertFTS5Place(app core.App, place *Place) error {
	query := FTS5InsertQuery(app, PLACES_TABLE, PLACES_FTS5_FIELDS)
	return BulkInsertFTS5Place(query, place)
}

func BulkInsertFTS5Place(query *dbx.Query, place *Place) error {
	return InsertFTS5Record(
		query,
		place.Id,
		PLACES_FTS5_FIELDS,
		FTS5ValuesPlace(place)...,
	)
}

func InsertFTS5Series(app core.App, series *Series) error {
	query := FTS5InsertQuery(app, SERIES_TABLE, SERIES_FTS5_FIELDS)
	return BulkInsertFTS5Series(query, series)
}

func BulkInsertFTS5Series(query *dbx.Query, series *Series) error {
	return InsertFTS5Record(
		query,
		series.Id,
		SERIES_FTS5_FIELDS,
		FTS5ValuesSeries(series)...,
	)
}

func InsertFTS5Item(app core.App, item *Item) error {
	query := FTS5InsertQuery(app, ITEMS_TABLE, ITEMS_FTS5_FIELDS)
	return BulkInsertFTS5Item(query, item)
}

func BulkInsertFTS5Item(query *dbx.Query, item *Item) error {
	return InsertFTS5Record(
		query,
		item.Id,
		ITEMS_FTS5_FIELDS,
		FTS5ValuesItem(item)...,
	)
}

func InsertFTS5Entry(app core.App, entry *Entry, places []*Place, agents []*Agent, series []*Series) error {
	query := FTS5InsertQuery(app, ENTRIES_TABLE, ENTRIES_FTS5_FIELDS)
	return BulkInsertFTS5Entry(query, entry, places, agents, series)
}

func BulkInsertFTS5Entry(query *dbx.Query, entry *Entry, places []*Place, agents []*Agent, series []*Series) error {
	return InsertFTS5Record(
		query,
		entry.Id,
		ENTRIES_FTS5_FIELDS,
		FTS5ValuesEntry(entry, places, agents, series)...,
	)
}

func InsertFTS5Content(app core.App, content *Content, entry *Entry, agents []*Agent) error {
	query := FTS5InsertQuery(app, CONTENTS_TABLE, CONTENTS_FTS5_FIELDS)
	return BulkInsertFTS5Content(query, content, entry, agents)
}

func BulkInsertFTS5Content(query *dbx.Query, content *Content, entry *Entry, agents []*Agent) error {
	return InsertFTS5Record(
		query,
		content.Id,
		CONTENTS_FTS5_FIELDS,
		FTS5ValuesContent(content, entry, agents)...,
	)
}

func FTS5ValuesContent(content *Content, entry *Entry, agents []*Agent) []string {
	agentstring := ""
	if agents != nil {
		agentstring = datatypes.SliceJoin(agents, DIVIDER_STR, func(agent *Agent) string {
			if agent == nil {
				return ""
			}
			return agent.Name()
		})
	}

	entrystring := entry.PreferredTitle()
	if entry.Year() != 0 {
		entrystring += "; " + strconv.Itoa(entry.Year())
	} else {
		entrystring += "; [o.J.]"
	}

	return []string{
		content.PreferredTitle(),
		content.VariantTitle(),
		content.ParallelTitle(),
		content.TitleStmt(),
		content.SubtitleStmt(),
		content.IncipitStmt(),
		content.ResponsibilityStmt(),
		content.PublicationStmt(),
		content.PlaceStmt(),
		strconv.Itoa(content.Year()),
		content.Extent(),
		content.Dimensions(),
		strconv.FormatFloat(content.Numbering(), 'f', 3, 64),
		entrystring,
		agentstring,
		strconv.Itoa(content.MusenalmID()),
		datatypes.DeleteTags(content.Annotation()),
		datatypes.DeleteTags(content.Comment()),
	}
}

func FTS5ValuesEntry(entry *Entry, places []*Place, agents []*Agent, series []*Series) []string {
	placestring := ""
	if places != nil {
		placestring = datatypes.SliceJoin(places, DIVIDER_STR, func(place *Place) string {
			if place == nil {
				return ""
			}
			return place.Name()
		})
	}

	agentstring := ""
	if agents != nil {
		agentstring = datatypes.SliceJoin(agents, DIVIDER_STR, func(agent *Agent) string {
			if agent == nil {
				return ""
			}
			return agent.Name()
		})
	}

	seriesstring := ""
	if series != nil {
		seriesstring = datatypes.SliceJoin(series, DIVIDER_STR, func(series *Series) string {
			if series == nil {
				return ""
			}
			return series.Title()
		})
	}
	return []string{
		entry.PreferredTitle(),
		entry.VariantTitle(),
		entry.ParallelTitle(),
		entry.TitleStmt(),
		entry.SubtitleStmt(),
		entry.IncipitStmt(),
		entry.ResponsibilityStmt(),
		entry.PublicationStmt(),
		entry.PlaceStmt(),
		entry.Edition(),
		strconv.Itoa(entry.Year()),
		entry.Extent(),
		entry.Dimensions(),
		entry.References(),
		placestring,
		agentstring,
		seriesstring,
		strconv.Itoa(entry.MusenalmID()),
		datatypes.DeleteTags(entry.Annotation()),
		datatypes.DeleteTags(entry.Comment()),
	}
}

func FTS5ValuesItem(item *Item) []string {
	return []string{
		item.Location(),
		item.Owner(),
		strings.Join(item.Media(), DIVIDER_STR),
		item.Condition(),
		item.Identifier(),
		item.Uri(),
		datatypes.DeleteTags(item.Annotation()),
		datatypes.DeleteTags(item.Comment()),
	}
}

func FTS5ValuesSeries(series *Series) []string {
	return []string{
		series.Title(),
		series.Pseudonyms(),
		series.References(),
		datatypes.DeleteTags(series.Annotation()),
		datatypes.DeleteTags(series.Comment()),
	}
}

func FTS5ValuesPlace(place *Place) []string {
	return []string{
		place.Name(),
		place.Pseudonyms(),
		place.URI(),
		datatypes.DeleteTags(place.Annotation()),
		datatypes.DeleteTags(place.Comment()),
	}
}

func FTS5ValuesAgent(agent *Agent) []string {
	return []string{
		agent.Name(),
		agent.BiographicalData(),
		agent.Pseudonyms(),
		datatypes.DeleteTags(agent.Annotation()),
		datatypes.DeleteTags(agent.Comment()),
	}
}

func FTS5ValuesItems(item *Item) []string {
	return []string{
		item.Location(),
		item.Owner(),
		strings.Join(item.Media(), DIVIDER_STR),
		item.Condition(),
		item.Identifier(),
		item.Uri(),
		datatypes.DeleteTags(item.Annotation()),
		datatypes.DeleteTags(item.Comment()),
	}
}

func FTS5InsertQuery(app core.App, table string, fields []string) *dbx.Query {
	tn := FTS5TableName(table)
	query := "INSERT INTO " +
		tn +
		" (" +
		ID_FIELD +
		", " +
		strings.Join(fields, ", ") +
		") VALUES ({:" +
		ID_FIELD +
		"}, {:" +
		strings.Join(fields, "}, {:") +
		"})"
	return app.DB().NewQuery(query).Prepare()
}

func InsertFTS5Record(query *dbx.Query, id string, fields []string, values ...string) error {
	if len(fields) != len(values) {
		return errors.New("fields and values must have the same length")
	}

	params := dbx.Params{ID_FIELD: id}
	for i, v := range fields {
		params[v] = values[i]
	}

	_, err := query.Bind(params).Execute()
	return err
}

func DeleteFTS5Data(app core.App) error {
	err1 := deleteTableContents(app, FTS5TableName(AGENTS_TABLE))
	err2 := deleteTableContents(app, FTS5TableName(SERIES_TABLE))
	err3 := deleteTableContents(app, FTS5TableName(ENTRIES_TABLE))
	err4 := deleteTableContents(app, FTS5TableName(PLACES_TABLE))
	err5 := deleteTableContents(app, FTS5TableName(ITEMS_TABLE))
	err6 := deleteTableContents(app, FTS5TableName(CONTENTS_TABLE))
	return errors.Join(err1, err2, err3, err4, err5, err6)
}

func deleteTableContents(app core.App, table string) error {
	_, err := app.DB().NewQuery("DELETE FROM " + table).Execute()
	if err != nil {
		return err
	}
	return nil
}
