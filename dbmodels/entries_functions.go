package dbmodels

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func (e *Entry) Prev(app core.App) *Entry {
	var entry Entry
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.NewExp(MUSENALMID_FIELD+" < {:exp}", dbx.Params{"exp": e.MusenalmID()})).
		OrderBy(MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&entry)
	if err != nil {
		return nil
	}

	return &entry
}

func (e *Entry) Next(app core.App) *Entry {
	var entry Entry
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.NewExp(MUSENALMID_FIELD+" > {:exp}", dbx.Params{"exp": e.MusenalmID()})).
		OrderBy(MUSENALMID_FIELD + " ASC").
		Limit(1).
		One(&entry)
	if err != nil {
		return nil
	}

	return &entry
}

func TitleSearchEntries(app core.App, query string) ([]*Entry, error) {
	entries := []*Entry{}
	err := app.RecordQuery(ENTRIES_TABLE).
		Where(dbx.Like(PREFERRED_TITLE_FIELD, query).Match(true, true)).
		OrderBy(PREFERRED_TITLE_FIELD).
		All(&entries)
	if err != nil {
		return nil, err
	}

	return entries, nil
}
