package dbmodels

import (
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
		query = query.Where(dbx.Or(
			dbx.Like(PLACES_NAME_FIELD, trimmed).Match(true, true),
			dbx.Like(PLACES_PSEUDONYMS_FIELD, trimmed).Match(true, true),
		))
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

	counts := []PlaceCount{}

	// For each place ID, count how many entries have this place in their places field
	for _, id := range ids {
		var count int64

		// Query counts entries where the places field contains this place ID
		// PocketBase stores relation fields as JSON arrays, even for single values
		err := app.DB().
			Select("COUNT(*)").
			From(ENTRIES_TABLE).
			Where(dbx.NewExp(
				"json_valid("+PLACES_TABLE+") = 1 AND EXISTS (SELECT 1 FROM json_each("+PLACES_TABLE+") WHERE value = {:id})",
				dbx.Params{"id": id},
			)).
			Row(&count)

		if err != nil {
			return nil, err
		}

		if count > 0 {
			counts = append(counts, PlaceCount{
				ID:    id.(string),
				Count: int(count),
			})
		}
	}

	ret := make(map[string]int, len(counts))
	for _, c := range counts {
		ret[c.ID] = c.Count
	}

	return ret, nil
}
