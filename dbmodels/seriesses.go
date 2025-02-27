package dbmodels

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type SeriesEntries map[string][]*REntriesSeries

func MusenalmIDSearchSeries(app core.App, query string) ([]*Series, error) {
	series := []*Series{}
	err := app.RecordQuery(SERIES_TABLE).
		Where(dbx.Like(MUSENALMID_FIELD, query).Match(true, false)).
		All(&series)
	if err != nil {
		return nil, err
	}

	return series, nil
}

func BasicSearchSeries(app core.App, query string) ([]*Series, []*Series, error) {
	query = strings.TrimSpace(query)
	query = datatypes.DeleteTags(query)
	query = datatypes.NormalizeString(query)
	query = datatypes.RemovePunctuation(query)
	query = cases.Lower(language.German).String(query)
	// TODO: how to normalize, which unicode normalization to use?

	if query == "" {
		return []*Series{}, []*Series{}, nil
	}

	series, err := TitleSearchSeries(app, query)
	if err != nil {
		return nil, nil, err
	}

	// INFO: Needing to differentiate matches
	querysplit := NormalizeQuery(query)
	req := IntoQueryRequests([]string{SERIES_TITLE_FIELD, ANNOTATION_FIELD, REFERENCES_FIELD}, querysplit)

	if len(req) == 0 {
		return series, []*Series{}, nil
	}

	altids, err := FTS5Search(app, SERIES_TABLE, req...)
	if err != nil {
		return nil, nil, err
	}

	/// INFO: this is inefficient, but it only happens when there are matches longer than 3 characters, so we should be fine
	ids := []any{}
outer_loop:
	for _, id := range altids {
		for _, i := range series {
			sid := i.Id
			if sid == id.ID {
				continue outer_loop
			}
		}
		ids = append(ids, id.ID)
	}

	altseries, err := Series_IDs(app, ids)
	if err != nil {
		return nil, nil, err
	}

	return series, altseries, nil
}

// INFO: expects a normalized query string
func TitleSearchSeries(app core.App, query string) ([]*Series, error) {
	series := []*Series{}
	queries := strings.Split(query, " ")
	q := app.RecordQuery(SERIES_TABLE).
		Where(dbx.Like(SERIES_TITLE_FIELD, queries[0]).Match(true, true))

	if len(queries) > 1 {
		for _, que := range queries[1:] {
			q.AndWhere(dbx.Like(SERIES_TITLE_FIELD, que).Match(true, true))
		}
	}

	err := q.
		OrderBy(SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return nil, err
	}

	return series, nil
}
