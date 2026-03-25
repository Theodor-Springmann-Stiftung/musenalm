package dbmodels

import (
	"fmt"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

const (
	defaultPlacesSearchLimit = 10
	maxPlacesSearchLimit     = 50
)

type PlaceCount struct {
	ID    string `db:"id"`
	Count int    `db:"count"`
}

// SearchPlaces performs a lightweight search against the places table using the provided term.
// It matches against the place name and pseudonyms fields.
func SearchPlaces(app core.App, term string, limit int) ([]*Place, error) {
	places := []*Place{}
	trimmed := strings.TrimSpace(term)

	if limit <= 0 {
		limit = defaultPlacesSearchLimit
	}
	if limit > maxPlacesSearchLimit {
		limit = maxPlacesSearchLimit
	}

	query := app.RecordQuery(PLACES_TABLE).
		Limit(int64(limit))

	if trimmed != "" {
		terms := []string{trimmed}
		if strings.Contains(trimmed, "/") {
			normalized := strings.ReplaceAll(trimmed, "/", " ")
			normalized = strings.Join(strings.Fields(normalized), " ")
			collapsed := strings.ReplaceAll(trimmed, "/", "")
			if normalized != "" && normalized != trimmed {
				terms = append(terms, normalized)
			}
			if collapsed != "" && collapsed != trimmed && collapsed != normalized {
				terms = append(terms, collapsed)
			}
		}

		conditions := make([]dbx.Expression, 0, len(terms)*2)
		for _, term := range terms {
			conditions = append(conditions,
				dbx.Like(PLACES_NAME_FIELD, term).Match(true, true),
				dbx.Like(PLACES_PSEUDONYMS_FIELD, term).Match(true, true),
			)
		}
		query = query.Where(dbx.Or(conditions...))
	}

	if err := query.All(&places); err != nil {
		return nil, err
	}

	return places, nil
}

// CountPlacesBaende counts the number of Bände (entries) linked to each place.
// Returns a map of place ID -> count.
func CountPlacesBaende(app core.App, ids []any) (map[string]int, error) {
	if len(ids) == 0 {
		return map[string]int{}, nil
	}

	params := dbx.Params{}
	placeholders := make([]string, 0, len(ids))
	for i, id := range ids {
		key := fmt.Sprintf("id%d", i)
		params[key] = id
		placeholders = append(placeholders, "{:"+key+"}")
	}

	counts := []PlaceCount{}
	query := `
		SELECT json_each.value AS id, COUNT(DISTINCT entries.id) AS count
		FROM entries, json_each(entries.places)
		WHERE json_valid(entries.places) = 1
		  AND json_each.value IN (` + strings.Join(placeholders, ", ") + `)
		GROUP BY json_each.value
	`
	if err := app.DB().NewQuery(query).Bind(params).All(&counts); err != nil {
		return nil, err
	}

	ret := make(map[string]int, len(counts))
	for _, c := range counts {
		ret[c.ID] = c.Count
	}

	return ret, nil
}
