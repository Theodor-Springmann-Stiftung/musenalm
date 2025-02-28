package pages

import (
	"database/sql"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/pocketbase/pocketbase/core"
)

const (
	DEFAULT_PAGESIZE = 80
)

type SearchResultBeitraege struct {
	Queries []dbmodels.FTS5QueryRequest

	// these are the sorted IDs for hits
	Hits     []string
	Entries  map[string]*dbmodels.Entry     // <- Key: Entry ID
	Agents   map[string]*dbmodels.Agent     // <- Key: Agent IDs
	Contents map[string][]*dbmodels.Content // <- Key: Entry ID, or year

	ContentsAgents map[string][]*dbmodels.RContentsAgents // <- Key: Content ID
	Pages          []int
}

func EmptyResultBeitraege() *SearchResultBeitraege {
	return &SearchResultBeitraege{
		Hits:           []string{},
		Entries:        make(map[string]*dbmodels.Entry),
		Agents:         make(map[string]*dbmodels.Agent),
		Contents:       make(map[string][]*dbmodels.Content),
		ContentsAgents: make(map[string][]*dbmodels.RContentsAgents),
	}
}

func NewSearchBeitraege(app core.App, params SearchParameters) (*SearchResultBeitraege, error) {
	contents := []*dbmodels.Content{}
	queries := params.FieldSetBeitraege()

	if params.AlmString != "" {
		e, err := dbmodels.Contents_MusenalmID(app, params.AlmString)
		if err != nil && err == sql.ErrNoRows {
			return EmptyResultBeitraege(), nil
		} else if err != nil {
			return nil, err
		}

		contents = append(contents, e)
	} else {
		if len(queries) == 0 {
			return nil, ErrNoQuery
		}

		hits, err := dbmodels.FTS5Search(app, dbmodels.CONTENTS_TABLE, queries...)
		if err != nil {
			return nil, err
		} else if len(hits) == 0 {
			return EmptyResultBeitraege(), nil
		}

		ids := []any{}
		for _, hit := range hits {
			ids = append(ids, hit.ID)
		}

		cs, err := dbmodels.Contents_IDs(app, ids)
		if err != nil {
			return nil, err
		}

		contents = append(contents, cs...)
	}

	resultids := []any{}
	resultentryids := []string{}
	for _, content := range contents {
		resultids = append(resultids, content.Id)
		resultentryids = append(resultentryids, content.Entry())
	}

	entries, err := dbmodels.Entries_IDs(app, datatypes.ToAny(resultentryids))
	if err != nil {
		return nil, err
	}

	if params.Sort == "year" {
		dbmodels.Sort_Entries_Year_Title(entries)
	} else {
		dbmodels.Sort_Entries_Title_Year(entries)
	}

	arels, err := dbmodels.RContentsAgents_Contents(app, resultids)
	if err != nil {
		return nil, err
	}

	aids := []any{}
	for _, a := range arels {
		aids = append(aids, a.Agent())
	}

	agents, err := dbmodels.Agents_IDs(app, aids)
	if err != nil {
		return nil, err
	}

	contentsmap := make(map[string][]*dbmodels.Content)
	for _, c := range contents {
		contentsmap[c.Entry()] = append(contentsmap[c.Entry()], c)
	}

	contentsagents := make(map[string][]*dbmodels.RContentsAgents)
	for _, a := range arels {
		contentsagents[a.Content()] = append(contentsagents[a.Content()], a)
	}

	agentsmap := make(map[string]*dbmodels.Agent)
	for _, a := range agents {
		agentsmap[a.Id] = a
	}

	entriesmap := make(map[string]*dbmodels.Entry)
	for _, e := range entries {
		entriesmap[e.Id] = e
	}

	hits := []string{}
	for _, e := range entries {
		hits = append(hits, e.Id)
	}

	pages := PagesEntries(hits, contentsmap, DEFAULT_PAGESIZE)
	if params.Page < 1 || params.Page > len(pages) {
		params.Page = 1
	}

	if params.Page == len(pages) {
		hits = hits[pages[params.Page-1]:]
	} else {
		hits = hits[pages[params.Page-1]:pages[params.Page]]
	}

	return &SearchResultBeitraege{
		Queries:        queries,
		Hits:           hits,
		Entries:        entriesmap,
		Agents:         agentsmap,
		Contents:       contentsmap,
		ContentsAgents: contentsagents,
		Pages:          pages,
	}, nil
}

func (p *SearchResultBeitraege) CountEntries() int {
	return len(p.Entries)
}

func (p *SearchResultBeitraege) Count() int {
	cnt := 0
	for _, c := range p.Contents {
		cnt += len(c)
	}
	return cnt
}

func (p *SearchResultBeitraege) PagesCount() int {
	return len(p.Pages) - 1
}

func PagesEntries[T any](hits []string, hitmap map[string][]*T, pagesize int) []int {
	ret := []int{0}
	m := 0
	for i, hit := range hits {
		m += len(hitmap[hit])
		if m >= pagesize {
			ret = append(ret, i)
			m = 0
		}
	}

	if m > 0 {
		ret = append(ret, len(hits))
	}

	return ret
}
