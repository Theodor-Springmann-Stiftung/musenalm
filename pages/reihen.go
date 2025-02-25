package pages

import (
	"strconv"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_REIHEN   = "/reihen/"
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

func (p *ReihenPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_REIHEN, func(e *core.RequestEvent) error {
		search := e.Request.URL.Query().Get(PARAM_SEARCH)
		if search != "" {
			return p.SearchRequest(app, engine, e)
		}
		person := e.Request.URL.Query().Get(PARAM_PERSON)
		if person != "" {
			return p.PersonRequest(app, engine, e)
		}
		place := e.Request.URL.Query().Get(PARAM_PLACE)
		if place != "" {
			return p.PlaceRequest(app, engine, e)
		}
		year := e.Request.URL.Query().Get(PARAM_YEAR)
		if year != "" {
			return p.YearRequest(app, engine, e)
		}

		return p.LetterRequest(app, engine, e)
	})

	return nil
}

func (p *ReihenPage) YearRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	year := e.Request.URL.Query().Get(PARAM_YEAR)
	data := map[string]interface{}{}
	data[PARAM_HIDDEN] = e.Request.URL.Query().Get(PARAM_HIDDEN)
	data[PARAM_YEAR] = year

	y, err := strconv.Atoi(year)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	result, err := NewSeriesResult_Year(app, y)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	data["result"] = result
	return p.Get(e, engine, data)
}

func (p *ReihenPage) LetterRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	letter := e.Request.URL.Query().Get(PARAM_LETTER)
	data := map[string]interface{}{}
	data[PARAM_HIDDEN] = e.Request.URL.Query().Get(PARAM_HIDDEN)
	if letter == "" {
		data["startpage"] = true
		letter = "A"
	}
	data[PARAM_LETTER] = letter

	result, err := NewSeriesListResult_Letter(app, letter)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	data["result"] = result
	return p.Get(e, engine, data)
}

func (p *ReihenPage) PersonRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	person := e.Request.URL.Query().Get(PARAM_PERSON)
	data := map[string]interface{}{}
	data[PARAM_PERSON] = person
	data[PARAM_HIDDEN] = e.Request.URL.Query().Get(PARAM_HIDDEN)

	result, err := NewSeriesResult_Agent(app, person)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	data["result"] = result
	return p.Get(e, engine, data)
}

func (p *ReihenPage) PlaceRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	place := e.Request.URL.Query().Get(PARAM_PLACE)
	data := map[string]interface{}{}
	data[PARAM_PLACE] = place
	data[PARAM_HIDDEN] = e.Request.URL.Query().Get(PARAM_HIDDEN)

	result, err := NewSeriesResult_Place(app, place)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	data["result"] = result
	return p.Get(e, engine, data)
}

// TODO: Suchverhalten bei gefilterten Personen, Orten und Jahren
func (p *ReihenPage) SearchRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	search := e.Request.URL.Query().Get(PARAM_SEARCH)
	data := map[string]interface{}{}
	data[PARAM_SEARCH] = search

	result, err := NewSeriesResult_Search(app, search)
	if err != nil {
		return engine.Response404(e, err, data)
	}

	data["result"] = result
	return p.Get(e, engine, data)
}

func (p *ReihenPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	data["common"] = NewCommonReihenData(request.App)
	return engine.Response200(request, URL_REIHEN, data)
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
	dbmodels.SortPlacesByName(places)

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
	Entries       map[string]*dbmodels.Entry            // <-- Key is Entry.ID
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

func NewSeriesListResult_Letter(app core.App, letter string) (*SeriesListResult, error) {
	series := []*dbmodels.Series{}
	err := app.RecordQuery(dbmodels.SERIES_TABLE).
		Where(dbx.Like(dbmodels.SERIES_TITLE_FIELD, letter).Match(false, true)).
		OrderBy(dbmodels.SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return nil, err
	}
	dbmodels.Sort_Series_Title(series)

	relations, err := dbmodels.REntriesSeries_Seriess(app, dbmodels.Ids(series))
	if err != nil {
		return nil, err
	}

	eids := []any{}
	relationsMap := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range relations {
		relationsMap[r.Series()] = append(relationsMap[r.Series()], r)
		eids = append(eids, r.Entry())
	}

	entries, err := dbmodels.Entries_IDs(app, eids)
	if err != nil {
		return nil, err
	}

	entriesMap := map[string]*dbmodels.Entry{}
	for _, e := range entries {
		entriesMap[e.Id] = e
	}

	rmap, bmap, err := dbmodels.EntriesForSeriesses(app, series)
	if err != nil {
		return nil, err
	}

	return &SeriesListResult{
		Series:        series,
		Entries:       bmap,
		EntriesSeries: rmap,
	}, nil
}

func NewSeriesResult_Agent(app core.App, person string) (*SeriesListResult, error) {
	agent, err := dbmodels.Agents_ID(app, person)
	if err != nil {
		return nil, err
	}

	entriesagentsrels, err := dbmodels.REntriesAgents_Agent(app, agent.Id)
	if err != nil {
		return nil, err
	}

	eids := []any{}
	entriesagents := map[string][]*dbmodels.REntriesAgents{}
	for _, r := range entriesagentsrels {
		eids = append(eids, r.Entry())
		entriesagents[r.Entry()] = append(entriesagents[r.Entry()], r)
	}

	entries, err := dbmodels.Entries_IDs(app, eids)
	if err != nil {
		return nil, err
	}

	entriesMap := map[string]*dbmodels.Entry{}
	for _, e := range entries {
		entriesMap[e.Id] = e
	}

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(app, eids)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		sids = append(sids, r.Series())
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)

	return &SeriesListResult{
		Series:        series,
		Entries:       entriesMap,
		EntriesSeries: entriesseries,
		Agent:         agent,
		EntriesAgents: entriesagents,
	}, nil
}

func NewSeriesResult_Year(app core.App, year int) (*SeriesListResult, error) {
	entries := []*dbmodels.Entry{}
	err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Where(dbx.HashExp{dbmodels.YEAR_FIELD: year}).
		All(&entries)
	if err != nil {
		return nil, err
	}

	entriesMap := map[string]*dbmodels.Entry{}
	eids := []any{}
	for _, e := range entries {
		eids = append(eids, e.Id)
		entriesMap[e.Id] = e
	}

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(app, eids)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		sids = append(sids, r.Series())
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)

	return &SeriesListResult{
		Series:        series,
		Entries:       entriesMap,
		EntriesSeries: entriesseries,
	}, nil
}

func NewSeriesResult_Place(app core.App, place string) (*SeriesListResult, error) {
	p, err := dbmodels.Places_ID(app, place)
	if err != nil {
		return nil, err
	}

	entries := []*dbmodels.Entry{}
	err = app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Where(dbx.Like(dbmodels.PLACES_TABLE, place).Match(true, true)).
		All(&entries)
	if err != nil {
		return nil, err
	}

	entriesMap := map[string]*dbmodels.Entry{}
	eids := []any{}
	for _, e := range entries {
		eids = append(eids, e.Id)
		entriesMap[e.Id] = e
	}

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(app, eids)
	if err != nil {
		return nil, err
	}

	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		sids = append(sids, r.Series())
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)

	return &SeriesListResult{
		Series:        series,
		Entries:       entriesMap,
		EntriesSeries: entriesseries,
		Place:         p,
	}, nil
}

func NewSeriesResult_Search(app core.App, search string) (*SeriesListResult, error) {
	series, altseries, err := dbmodels.BasicSearchSeries(app, search)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Series_Title(series)
	dbmodels.Sort_Series_Title(altseries)

	rmap, bmap, err := dbmodels.EntriesForSeriesses(app, series)
	if err != nil {
		return nil, err
	}

	rmap2, bmap2, err := dbmodels.EntriesForSeriesses(app, altseries)
	if err != nil {
		return nil, err
	}

	for k, v := range rmap2 {
		rmap[k] = v
	}
	for k, v := range bmap2 {
		bmap[k] = v
	}

	ids := []*dbmodels.Series{}
	if searchint, err := strconv.Atoi(search); err == nil {
		identries, err := dbmodels.EntriesForID(app, searchint)
		if err != nil {
			return nil, err
		}

		if len(identries) != 0 {

			idseries, rmap3, bmap3, err := dbmodels.SeriesForEntries(app, identries)
			if err != nil {
				return nil, err
			}

			ids = idseries

			dbmodels.Sort_Series_Title(idseries)

			for k, v := range rmap3 {
				rmap[k] = v
			}

			for k, v := range bmap3 {
				bmap[k] = v
			}
		}
	}

	return &SeriesListResult{
		Series:        series,
		Entries:       bmap,
		EntriesSeries: rmap,
		IDSeries:      ids,
		AltSeries:     altseries,
	}, nil
}
