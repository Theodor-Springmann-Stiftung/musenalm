package dbmodels

import (
	"slices"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

type ContentsAgents map[string][]*RContentsAgents

func ContentsForEntry(app core.App, entry *Entry) ([]*Content, error) {
	contents := []*Content{}
	err := app.RecordQuery(CONTENTS_TABLE).
		Where(dbx.HashExp{ENTRIES_TABLE: entry.Id}).
		All(&contents)
	if err != nil {
		return nil, err
	}

	slices.SortFunc(contents, func(i, j *Content) int {
		r := i.Numbering() - j.Numbering()
		if r == 0 {
			return 0
		}
		if r < 0 {
			return -1
		}
		return 1
	})

	return contents, nil
}

func ContentsForAgent(app core.App, agentId string) ([]*Content, error) {
	relations := []*RContentsAgents{}
	err := app.RecordQuery(RelationTableName(CONTENTS_TABLE, AGENTS_TABLE)).
		Where(dbx.HashExp{AGENTS_TABLE: agentId}).
		All(&relations)
	if err != nil {
		return nil, err
	}

	cids := []any{}
	for _, r := range relations {
		cids = append(cids, r.Content())
	}

	contents := []*Content{}
	err = app.RecordQuery(CONTENTS_TABLE).
		Where(dbx.HashExp{ID_FIELD: cids}).
		All(&contents)
	if err != nil {
		return nil, err
	}

	return contents, nil
}

func SortContentsByEntryNumbering(contents []*Content, entries map[string]*Entry) {
	slices.SortFunc(contents, func(i, j *Content) int {
		ii, iok := entries[i.Entry()]
		ij, jok := entries[j.Entry()]
		if iok && jok {
			ret := ii.Year() - ij.Year()
			if ret != 0 {
				return ret
			}

			ret = strings.Compare(ii.PreferredTitle(), ij.PreferredTitle())
			if ret != 0 {
				return ret
			}
		}

		r := i.Numbering() - j.Numbering()
		if r == 0 {
			return 0
		}
		if r < 0 {
			return -1
		}
		return 1
	})
}
