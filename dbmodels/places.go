package dbmodels

import (
	"slices"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

func AllPlaces(app core.App) ([]*Place, error) {
	places := []*Place{}
	err := app.RecordQuery(PLACES_TABLE).
		OrderBy(PLACES_NAME_FIELD).
		All(&places)
	if err != nil {
		return nil, err
	}

	return places, nil
}

func SortPlacesByName(places []*Place) {
	collator := collate.New(language.German)
	slices.SortFunc(places, func(i, j *Place) int {
		return collator.CompareString(i.Name(), j.Name())
	})
}

func PlaceForId(app core.App, id string) (*Place, error) {
	place := &Place{}
	err := app.RecordQuery(PLACES_TABLE).
		Where(dbx.HashExp{ID_FIELD: id}).
		One(place)
	if err != nil {
		return nil, err
	}
	return place, nil
}

func PlacesForEntry(app core.App, entry *Entry) (map[string]*Place, error) {
	ids := []any{}
	places := map[string]*Place{}

	for _, r := range entry.Places() {
		ids = append(ids, r)
	}
	if len(ids) == 0 {
		return places, nil
	}

	p := []*Place{}
	err := app.RecordQuery(PLACES_TABLE).
		Where(dbx.HashExp{ID_FIELD: ids}).
		All(&p)
	if err != nil {
		return nil, err
	}

	for _, place := range p {
		places[place.Id] = place
	}

	return places, nil
}
