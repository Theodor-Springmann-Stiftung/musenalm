package dbmodels

import (
	"database/sql"
	"strconv"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func ContentPermalinkRedirect_OldMusenalmID(app core.App, id string) (*ContentPermalinkRedirect, error) {
	oldID, err := strconv.Atoi(id)
	if err != nil {
		return nil, nil
	}

	return ContentPermalinkRedirect_OldMusenalmIDInt(app, oldID)
}

func ContentPermalinkRedirect_OldMusenalmIDInt(app core.App, oldID int) (*ContentPermalinkRedirect, error) {
	if oldID <= 0 {
		return nil, nil
	}

	redirects := []*ContentPermalinkRedirect{}
	err := app.RecordQuery(CONTENT_PERMALINK_REDIRECTS_TABLE).
		Where(dbx.HashExp{CONTENT_PERMALINK_REDIRECT_OLD_FIELD: oldID}).
		Limit(1).
		All(&redirects)
	if err != nil {
		return nil, err
	}
	if len(redirects) == 0 {
		return nil, nil
	}
	return redirects[0], nil
}

func MaxContentPermalinkRedirectMusenalmID(app core.App) (int, error) {
	var row struct {
		MaxID int `db:"max_id"`
	}

	err := app.DB().NewQuery(
		"SELECT COALESCE(MAX(" + CONTENT_PERMALINK_REDIRECT_OLD_FIELD + "), 0) AS max_id FROM " + CONTENT_PERMALINK_REDIRECTS_TABLE,
	).One(&row)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil
		}
		return 0, err
	}

	return row.MaxID, nil
}

func ContentPermalinkRedirectRangeBlocked(app core.App, startID, endID int) (bool, error) {
	if startID <= 0 || endID < startID {
		return false, nil
	}

	var row struct {
		Count int `db:"count"`
	}

	err := app.DB().NewQuery(
		"SELECT COUNT(*) AS count FROM " + CONTENT_PERMALINK_REDIRECTS_TABLE +
			" WHERE " + CONTENT_PERMALINK_REDIRECT_OLD_FIELD + " BETWEEN {:start} AND {:end}",
	).Bind(dbx.Params{
		"start": startID,
		"end":   endID,
	}).One(&row)
	if err != nil {
		return false, err
	}

	return row.Count > 0, nil
}

func ResolveContentByPermalink(app core.App, id string) (*Content, bool, error) {
	content, err := Contents_MusenalmID(app, id)
	if err == nil && content != nil {
		return content, false, nil
	}

	redirect, err := ContentPermalinkRedirect_OldMusenalmID(app, id)
	if err != nil {
		return nil, false, err
	}
	if redirect == nil {
		return nil, false, err
	}

	content, err = Contents_ID(app, redirect.Content())
	if err != nil {
		return nil, false, err
	}

	return content, true, nil
}
