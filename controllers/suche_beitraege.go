package controllers

import (
	"database/sql"
	"maps"
	"slices"
	"sort"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/pocketbase/pocketbase/core"
)

const (
	DEFAULT_PAGESIZE = 80

	FILTER_PARAM_BEIAEGE_AGENT     = "agentfilter"
	FILTER_PARAM_BEIAEGE_TYPE      = "typefilter"
	FILTER_PARAM_BEIAEGE_ONLYSCANS = "onlyscans"
	FILTER_PARAM_BEIAEGE_YEAR      = "yearfilter"
)

type BeitraegeFilterParameters struct {
	Agent     string
	Type      string
	Year      string
	OnlyScans bool
}

func NewBeitraegeFilterParameters(ev *core.RequestEvent) BeitraegeFilterParameters {
	agent := ev.Request.URL.Query().Get(FILTER_PARAM_BEIAEGE_AGENT)
	typ := ev.Request.URL.Query().Get(FILTER_PARAM_BEIAEGE_TYPE)
	year := ev.Request.URL.Query().Get(FILTER_PARAM_BEIAEGE_YEAR)
	onlyscans := ev.Request.URL.Query().Get(FILTER_PARAM_BEIAEGE_ONLYSCANS) == "on"
	return BeitraegeFilterParameters{
		Agent:     agent,
		Type:      typ,
		Year:      year,
		OnlyScans: onlyscans,
	}
}

func (p *BeitraegeFilterParameters) FieldSetBeitraege() []dbmodels.FTS5QueryRequest {
	ret := []dbmodels.FTS5QueryRequest{}

	if p.Agent != "" {
		q := "\"" + p.Agent + "\""
		que := dbmodels.NormalizeQuery(q)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.AGENTS_TABLE}, que)
		ret = append(ret, req...)
	}

	if p.Type != "" {
		q := "\"" + p.Type + "\""
		que := dbmodels.NormalizeQuery(q)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.MUSENALM_INHALTE_TYPE_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.Year != "" {
		q := "\"" + p.Year + "\""
		que := dbmodels.NormalizeQuery(q)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.ENTRIES_TABLE}, que)
		ret = append(ret, req...)
	}

	return ret
}

func (p BeitraegeFilterParameters) ToQueryParams() string {
	r := ""
	if p.Agent != "" {
		r += "&" + FILTER_PARAM_BEIAEGE_AGENT + "=" + p.Agent
	}
	if p.Type != "" {
		r += "&" + FILTER_PARAM_BEIAEGE_TYPE + "=" + p.Type
	}
	if p.Year != "" {
		r += "&" + FILTER_PARAM_BEIAEGE_YEAR + "=" + p.Year
	}
	if p.OnlyScans {
		r += "&" + FILTER_PARAM_BEIAEGE_ONLYSCANS + "=on"
	}

	return r
}

func (p BeitraegeFilterParameters) ToQueryParamsWOScans() string {
	r := ""
	if p.Agent != "" {
		r += "&" + FILTER_PARAM_BEIAEGE_AGENT + "=" + p.Agent
	}
	if p.Type != "" {
		r += "&" + FILTER_PARAM_BEIAEGE_TYPE + "=" + p.Type
	}
	if p.Year != "" {
		r += "&" + FILTER_PARAM_BEIAEGE_YEAR + "=" + p.Year
	}

	return r
}

type SearchResultBeitraege struct {
	Queries []dbmodels.FTS5QueryRequest

	// these are the sorted IDs for hits
	Hits     []string
	Entries  map[string]*dbmodels.Entry     // <- Key: Entry ID
	Contents map[string][]*dbmodels.Content // <- Key: Entry ID, or year

	ContentsAgents map[string][]*dbmodels.RContentsAgents // <- Key: Content ID
	Pages          []int

	AgentsList []*dbmodels.Agent
	TypesList  []string
	YearList   []int
}

func EmptyResultBeitraege() *SearchResultBeitraege {
	return &SearchResultBeitraege{
		Hits:           []string{},
		Entries:        make(map[string]*dbmodels.Entry),
		Contents:       make(map[string][]*dbmodels.Content),
		ContentsAgents: make(map[string][]*dbmodels.RContentsAgents),
	}
}

func NewSearchBeitraege(app core.App, params SearchParameters, filters BeitraegeFilterParameters) (*SearchResultBeitraege, error) {
	contents := []*dbmodels.Content{}
	queries := params.FieldSetBeitraege()
	fqueries := filters.FieldSetBeitraege()
	queries = append(queries, fqueries...)

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

		if filters.OnlyScans {
			scans := []*dbmodels.Content{}
			for _, c := range cs {
				if len(c.Scans()) > 0 {
					scans = append(scans, c)
				}
			}
			cs = scans
		}

		contents = append(contents, cs...)
	}

	resultids := []any{}
	uniqueresultentryids := map[string]bool{}
	types := make(map[string]bool)
	for _, content := range contents {
		resultids = append(resultids, content.Id)
		uniqueresultentryids[content.Entry()] = true
		for _, typ := range content.MusenalmType() {
			types[typ] = true
		}
	}

	resultentryids := []any{}
	for entryid := range uniqueresultentryids {
		resultentryids = append(resultentryids, entryid)
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

	uniqueaids := map[string]bool{}
	for _, a := range arels {
		uniqueaids[a.Agent()] = true
	}

	aids := []any{}
	for aid := range uniqueaids {
		aids = append(aids, aid)
	}

	agents, err := dbmodels.Agents_IDs(app, aids)
	if err != nil {
		return nil, err
	}

	contentsmap := make(map[string][]*dbmodels.Content)
	for _, c := range contents {
		contentsmap[c.Entry()] = append(contentsmap[c.Entry()], c)
	}

	for _, c := range contentsmap {
		dbmodels.Sort_Contents_Numbering(c)
	}

	contentsagents := make(map[string][]*dbmodels.RContentsAgents)
	for _, a := range arels {
		contentsagents[a.Content()] = append(contentsagents[a.Content()], a)
	}

	entriesmap := make(map[string]*dbmodels.Entry)
	years := make(map[int]bool)
	for _, e := range entries {
		entriesmap[e.Id] = e
		years[e.Year()] = true
	}

	hits := []string{}
	for _, e := range entries {
		hits = append(hits, e.Id)
	}

	pages := PagesMap(hits, contentsmap, DEFAULT_PAGESIZE)
	if params.Page < 1 || params.Page > len(pages) {
		params.Page = 1
	}

	if params.Page == len(pages) {
		hits = hits[pages[params.Page-1]:]
	} else {
		hits = hits[pages[params.Page-1]:pages[params.Page]]
	}

	tL := slices.Collect(maps.Keys(types))
	sort.Strings(tL)

	yL := slices.Collect(maps.Keys(years))
	sort.Ints(yL)

	dbmodels.Sort_Agents_Name(agents)

	return &SearchResultBeitraege{
		Queries:        queries,
		Hits:           hits,
		Entries:        entriesmap,
		Contents:       contentsmap,
		ContentsAgents: contentsagents,
		Pages:          pages,
		AgentsList:     agents,
		TypesList:      tL,
		YearList:       yL,
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

func PagesMapCounts(hits []string, counts map[string]int, pagesize int) []int {
	ret := []int{0}
	m := 0
	for i, hit := range hits {
		m += counts[hit]
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

func PagesMap[T any](hits []string, hitmap map[string][]*T, pagesize int) []int {
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

func PagesArray[T any](hits []T, pagesize int) []int {
	ret := []int{0}
	m := 0
	for i := range hits {
		m++
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
