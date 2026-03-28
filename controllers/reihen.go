package controllers

import (
	"fmt"
	"net/url"
	"slices"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	PARAM_LETTER = "letter"
	PARAM_SEARCH = "search"
	PARAM_PERSON = "agent"
	PARAM_PLACE  = "place"
	PARAM_YEAR   = "year"
	PARAM_HIDDEN = "hidden"
)

func init() {
	rp := &ReihenPage{
		DefaultPage: pagemodels.DefaultPage[*pagemodels.DefaultPageRecord]{
			Name:     pagemodels.P_REIHEN_NAME,
			URL:      URL_REIHEN,
			Template: URL_REIHEN,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
			Record:   &pagemodels.DefaultPageRecord{},
		},
	}
	app.Register(rp)
}

type ReihenPage struct {
	pagemodels.DefaultPage[*pagemodels.DefaultPageRecord]
}

func (p *ReihenPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	musenalmApp, ok := ia.(*app.App)
	if !ok {
		return fmt.Errorf("unexpected app implementation %T", ia)
	}
	router.GET(URL_REIHEN, p.handlePage(engine, musenalmApp))
	router.GET(URL_REIHEN_RESULTS, p.handleResults(engine, musenalmApp))

	return nil
}

func (p *ReihenPage) handlePage(engine *templating.Engine, musenalmApp *app.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data, err := p.buildResultData(musenalmApp, e)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["common"] = NewCommonReihenData(musenalmApp.Core())
		return engine.Response200(e, URL_REIHEN, data)
	}
}

func (p *ReihenPage) handleResults(engine *templating.Engine, musenalmApp *app.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data, err := p.buildResultData(musenalmApp, e)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, URL_REIHEN_RESULTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

// TODO: Suchverhalten bei gefilterten Personen, Orten und Jahren
func (p *ReihenPage) buildResultData(musenalmApp *app.App, e *core.RequestEvent) (map[string]any, error) {
	data := map[string]any{}
	data[PARAM_HIDDEN] = e.Request.URL.Query().Get(PARAM_HIDDEN)

	// HINT: Param pparsing ahs a certian order of precedence
	search := e.Request.URL.Query().Get(PARAM_SEARCH)
	if search != "" {
		data[PARAM_SEARCH] = search
		result, err := NewSeriesResult_Search(musenalmApp, search)
		if err != nil {
			return data, err
		}
		data["result"] = result
		return data, nil
	}

	person := e.Request.URL.Query().Get(PARAM_PERSON)
	if person != "" {
		data[PARAM_PERSON] = person
		result, err := NewSeriesResult_Agent(musenalmApp, person)
		if err != nil {
			return data, err
		}
		data["result"] = result
		return data, nil
	}

	place := e.Request.URL.Query().Get(PARAM_PLACE)
	if place != "" {
		data[PARAM_PLACE] = place
		result, err := NewSeriesResult_Place(musenalmApp, place)
		if err != nil {
			return data, err
		}
		data["result"] = result
		return data, nil
	}

	year := e.Request.URL.Query().Get(PARAM_YEAR)
	if year != "" {
		data[PARAM_YEAR] = year
		y, err := strconv.Atoi(year)
		if err != nil {
			return data, err
		}
		result, err := NewSeriesResult_Year(musenalmApp, y)
		if err != nil {
			return data, err
		}
		data["result"] = result
		return data, nil
	}

	letter := e.Request.URL.Query().Get(PARAM_LETTER)
	if letter == "" {
		letter = "A"
	}
	data[PARAM_LETTER] = letter

	// When we came from the start page, we want the hero banner to show
	ref := e.Request.Referer()
	if ref != "" {
		u, err := url.Parse(ref)
		if err == nil && (u.Path == "/" || u.Path == "") {
			data["startpage"] = true
		}
	}

	result, err := NewSeriesListResult_Letter(musenalmApp, letter)
	if err != nil {
		return data, err
	}

	data["result"] = result
	return data, nil
}

type CommonReihenData struct {
	Years   []int
	Places  []*dbmodels.Place
	Letters []string
	Agents  []*dbmodels.Agent
}

func NewCommonReihenData(app core.App) CommonReihenData {
	arels := []*core.Record{}
	err := app.RecordQuery(
		dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).
		GroupBy(dbmodels.AGENTS_TABLE).
		All(&arels)
	if err != nil {
		app.Logger().Error("Failed to fetch agents", "error", err)
	}

	ids := []any{}
	for _, a := range arels {
		ids = append(ids, a.GetString(dbmodels.AGENTS_TABLE))
	}

	agents, err := dbmodels.Agents_IDs(app, ids)
	if err != nil {
		app.Logger().Error("Failed to fetch agents", "error", err)
	}

	letterrecs := []core.Record{}
	letters := []string{}

	err = app.RecordQuery(dbmodels.SERIES_TABLE).
		Select("upper(substr(" + dbmodels.SERIES_TITLE_FIELD + ", 1, 1)) AS id").
		Distinct(true).
		OrderBy("id").
		All(&letterrecs)
	if err != nil {
		app.Logger().Error("Failed to fetch letters", "error", err)
	}

	for _, l := range letterrecs {
		letters = append(letters, l.GetString("id"))
	}

	places := []*dbmodels.Place{}
	err = app.RecordQuery(dbmodels.PLACES_TABLE).
		OrderBy(dbmodels.PLACES_NAME_FIELD).
		All(&places)
	if err != nil {
		app.Logger().Error("Failed to fetch places", "error", err)
	}
	dbmodels.Sort_Places_Name(places)

	rec := []core.Record{}
	err = app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Select(dbmodels.YEAR_FIELD + " AS id").
		Distinct(true).
		OrderBy("id").
		All(&rec)
	if err != nil {
		app.Logger().Error("Failed to fetch years", "error", err)
	}

	years := []int{}
	for _, r := range rec {
		years = append(years, r.GetInt("id"))
	}

	return CommonReihenData{
		Years:   years,
		Places:  places,
		Letters: letters,
		Agents:  agents,
	}
}

type SeriesListResult struct {
	Series        []*dbmodels.Series
	EntriesSeries map[string][]*dbmodels.REntriesSeries // <-- Key is Series.ID

	// INFO: Only on agent request
	Agent         *dbmodels.Agent
	EntriesAgents map[string][]*dbmodels.REntriesAgents // <-- Key is Entry.ID

	// INFO: Only on search request
	IDSeries  []*dbmodels.Series
	AltSeries []*dbmodels.Series

	// INFO: Only on place request
	Place *dbmodels.Place
}

func NewSeriesListResult_Letter(musenalmApp *app.App, letter string) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	series := []*dbmodels.Series{}
	err := pbApp.RecordQuery(dbmodels.SERIES_TABLE).
		Where(dbx.Like(dbmodels.SERIES_TITLE_FIELD, letter).Match(false, true)).
		OrderBy(dbmodels.SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return nil, err
	}
	dbmodels.Sort_Series_Title(series)

	relations, err := dbmodels.REntriesSeries_Seriess(pbApp, dbmodels.Ids(series))
	if err != nil {
		return nil, err
	}

	relationsMap := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range relations {
		relationsMap[r.Series()] = append(relationsMap[r.Series()], r)
	}

	for _, r := range relationsMap {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:        series,
		EntriesSeries: relationsMap,
	}, nil
}

func NewSeriesResult_Agent(musenalmApp *app.App, person string) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	agent, err := dbmodels.Agents_MusenalmID(pbApp, person)
	if err != nil {
		return nil, err
	}

	entriesagentsrels, err := dbmodels.REntriesAgents_Agent(pbApp, agent.Id)
	if err != nil {
		return nil, err
	}

	eids := []any{}
	entriesagents := map[string][]*dbmodels.REntriesAgents{}
	for _, r := range entriesagentsrels {
		eids = append(eids, r.Entry())
		entriesagents[r.Entry()] = append(entriesagents[r.Entry()], r)
	}

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(pbApp, eids)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		sids = append(sids, r.Series())
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	series, err := dbmodels.Series_IDs(pbApp, sids)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)
	for _, r := range entriesseries {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:        series,
		EntriesSeries: entriesseries,
		Agent:         agent,
		EntriesAgents: entriesagents,
	}, nil
}

func NewSeriesResult_Year(musenalmApp *app.App, year int) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	entries := []*core.Record{}
	err := pbApp.RecordQuery(dbmodels.ENTRIES_TABLE).
		Select(dbmodels.ID_FIELD).
		Where(dbx.HashExp{dbmodels.YEAR_FIELD: year}).
		All(&entries)
	if err != nil {
		return nil, err
	}

	eids := []any{}
	for _, e := range entries {
		eids = append(eids, e.Id)
	}

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(pbApp, eids)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		sids = append(sids, r.Series())
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	series, err := dbmodels.Series_IDs(pbApp, sids)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)
	for _, r := range entriesseries {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:        series,
		EntriesSeries: entriesseries,
	}, nil
}

func NewSeriesResult_Place(musenalmApp *app.App, place string) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	p, err := dbmodels.Places_MusenalmID(pbApp, place)
	if err != nil {
		return nil, err
	}

	entries := []*core.Record{}
	err = pbApp.RecordQuery(dbmodels.ENTRIES_TABLE).
		Select(dbmodels.ID_FIELD).
		Where(dbx.Like(dbmodels.PLACES_TABLE, p.Id).Match(true, true)).
		All(&entries)
	if err != nil {
		return nil, err
	}

	eids := []any{}
	for _, e := range entries {
		eids = append(eids, e.Id)
	}

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(pbApp, eids)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		sids = append(sids, r.Series())
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	series, err := dbmodels.Series_IDs(pbApp, sids)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)
	for _, r := range entriesseries {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:        series,
		EntriesSeries: entriesseries,
		Place:         p,
	}, nil
}

func NewSeriesResult_Search(musenalmApp *app.App, search string) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	series, altseries, err := dbmodels.BasicSearchSeries(pbApp, search)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)
	dbmodels.Sort_Series_Title(altseries)

	keys := []any{}
	keys = append(keys, dbmodels.Ids(series)...)
	keys = append(keys, dbmodels.Ids(altseries)...)

	relations, err := seriesRelationsBySeriesIDs(pbApp, keys)
	if err != nil {
		return nil, err
	}

	relationsMap := make(map[string][]*dbmodels.REntriesSeries)
	for _, v := range relations {
		relationsMap[v.Series()] = append(relationsMap[v.Series()], v)
	}
	for _, r := range relationsMap {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	ret := &SeriesListResult{
		Series:        series,
		AltSeries:     altseries,
		EntriesSeries: relationsMap,
	}

	if _, err := strconv.Atoi(strings.TrimSpace(search)); err == nil {
		identries := []*dbmodels.Entry{}
		err := pbApp.RecordQuery(dbmodels.ENTRIES_TABLE).
			Where(dbx.HashExp{dbmodels.MUSENALMID_FIELD: search}).
			All(&identries)
		if err != nil {
			return nil, err
		}

		if len(identries) != 0 {
			pbApp.Logger().Info("Found entries by musenalmid", "count", len(identries))
			idseries, idrelations, err := Series_Entries(pbApp, identries)
			if err != nil {
				return nil, err
			}

			dbmodels.Sort_Series_Title(idseries)
			ret.IDSeries = idseries

			for _, v := range idrelations {
				ret.EntriesSeries[v.Series()] = append(relationsMap[v.Series()], v)
			}
			for _, r := range ret.EntriesSeries {
				sortSeriesRelationsByEntryYear(r, musenalmApp)
			}
		}
	}

	return ret, nil
}

func (r *SeriesListResult) Count() int {
	return len(r.Series) + len(r.AltSeries) + len(r.IDSeries)
}

func seriesRelationsBySeriesIDs(pbApp core.App, ids []any) ([]*dbmodels.REntriesSeries, error) {
	relations, err := dbmodels.REntriesSeries_Seriess(pbApp, ids)
	if err != nil {
		return nil, err
	}
	return relations, nil
}

func Entries_Series_IDs(pbApp core.App, ids []any) ([]*dbmodels.Entry, []*dbmodels.REntriesSeries, error) {
	relations, err := seriesRelationsBySeriesIDs(pbApp, ids)
	if err != nil {
		return nil, nil, err
	}

	entryIDs := make([]any, 0, len(relations))
	for _, relation := range relations {
		entryIDs = append(entryIDs, relation.Entry())
	}

	entries, err := dbmodels.Entries_IDs(pbApp, entryIDs)
	if err != nil {
		return nil, nil, err
	}

	return entries, relations, nil
}

func sortSeriesRelationsByEntryYear(relations []*dbmodels.REntriesSeries, musenalmApp *app.App) {
	slices.SortFunc(relations, func(left, right *dbmodels.REntriesSeries) int {
		leftEntry := musenalmApp.GetEntryDisplay(left.Entry())
		rightEntry := musenalmApp.GetEntryDisplay(right.Entry())
		if leftEntry.Year == rightEntry.Year {
			return leftEntry.MusenalmID - rightEntry.MusenalmID
		}
		return leftEntry.Year - rightEntry.Year
	})
}

func Series_Entries(app core.App, entries []*dbmodels.Entry) ([]*dbmodels.Series, []*dbmodels.REntriesSeries, error) {
	relations, err := dbmodels.REntriesSeries_Entries(app, dbmodels.Ids(entries))
	if err != nil {
		return nil, nil, err
	}

	sids := []any{}
	for _, r := range relations {
		sids = append(sids, r.Series())
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, nil, err
	}

	return series, relations, nil
}
