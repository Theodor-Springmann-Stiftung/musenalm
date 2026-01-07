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
