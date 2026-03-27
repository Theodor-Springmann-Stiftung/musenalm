package dbmodels

import (
	"database/sql"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func ActiveContentNumberReservationForEntry(app core.App, entryID string) (*ContentNumberReservation, error) {
	if entryID == "" {
		return nil, nil
	}

	reservations := []*ContentNumberReservation{}
	err := app.RecordQuery(CONTENT_NUMBER_RESERVATIONS_TABLE).
		Where(dbx.HashExp{
			ENTRIES_TABLE:                           entryID,
			CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD: true,
		}).
		OrderBy(CREATED_FIELD + " DESC").
		Limit(1).
		All(&reservations)
	if err != nil {
		return nil, err
	}
	if len(reservations) == 0 {
		return nil, nil
	}
	return reservations[0], nil
}

func MaxReservedContentMusenalmID(app core.App) (int, error) {
	var row struct {
		MaxID int `db:"max_id"`
	}

	err := app.DB().NewQuery(
		"SELECT COALESCE(MAX(" + CONTENT_NUMBER_RESERVATION_START_FIELD + " + " + CONTENT_NUMBER_RESERVATION_RESERVED_COUNT_FIELD + " - 1), 0) AS max_id FROM " + CONTENT_NUMBER_RESERVATIONS_TABLE +
			" WHERE " + CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD + " = true",
	).One(&row)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}
	return row.MaxID, nil
}

func ReservationRangeBlockedForOtherEntries(app core.App, entryID string, startID, endID int) (bool, error) {
	if startID <= 0 || endID < startID {
		return false, nil
	}

	var row struct {
		Count int `db:"count"`
	}

	err := app.DB().NewQuery(
		"SELECT COUNT(*) AS count FROM " + CONTENT_NUMBER_RESERVATIONS_TABLE +
			" WHERE " + ENTRIES_TABLE + " != {:entry} AND " + CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD + " = true AND " + CONTENT_NUMBER_RESERVATION_START_FIELD + " <= {:end}" +
			" AND (" + CONTENT_NUMBER_RESERVATION_START_FIELD + " + " + CONTENT_NUMBER_RESERVATION_RESERVED_COUNT_FIELD + " - 1) >= {:start}",
	).Bind(dbx.Params{
		"entry": entryID,
		"start": startID,
		"end":   endID,
	}).One(&row)
	if err != nil {
		return false, err
	}

	return row.Count > 0, nil
}
