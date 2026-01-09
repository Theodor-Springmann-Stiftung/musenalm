package controllers

import (
	"database/sql"
	"errors"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func nextEntryMusenalmID(app core.App) (int, error) {
	var entry dbmodels.Entry
	err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
		OrderBy(dbmodels.MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&entry)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 1, nil
		}
		return 0, err
	}
	return entry.MusenalmID() + 1, nil
}

func nextSeriesMusenalmID(app core.App) (int, error) {
	var series dbmodels.Series
	err := app.RecordQuery(dbmodels.SERIES_TABLE).
		OrderBy(dbmodels.MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&series)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 1, nil
		}
		return 0, err
	}
	return series.MusenalmID() + 1, nil
}

func nextAgentMusenalmID(app core.App) (int, error) {
	var agent dbmodels.Agent
	err := app.RecordQuery(dbmodels.AGENTS_TABLE).
		OrderBy(dbmodels.MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&agent)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 1, nil
		}
		return 0, err
	}
	return agent.MusenalmID() + 1, nil
}

func nextPlaceMusenalmID(app core.App) (int, error) {
	var place dbmodels.Place
	err := app.RecordQuery(dbmodels.PLACES_TABLE).
		OrderBy(dbmodels.MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&place)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 1, nil
		}
		return 0, err
	}
	return place.MusenalmID() + 1, nil
}
