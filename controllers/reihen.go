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
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
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
		data["common"] = NewCommonReihenData(musenalmApp)
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
	Places  []map[string]any
	Letters []string
	Agents  []map[string]any
}

func NewCommonReihenData(musenalmApp *app.App) CommonReihenData {
	pbApp := musenalmApp.Core()
	agentOptions, placeOptions, err := loadCommonReihenFilterOptions(musenalmApp)
	if err != nil {
		pbApp.Logger().Error("Failed to build reihen filter options", "error", err)
	}

	letterrecs := []core.Record{}
	letters := []string{}

	err = pbApp.RecordQuery(dbmodels.SERIES_TABLE).
		Select("upper(substr(" + dbmodels.SERIES_TITLE_FIELD + ", 1, 1)) AS id").
		Distinct(true).
		OrderBy("id").
		All(&letterrecs)
	if err != nil {
		pbApp.Logger().Error("Failed to fetch letters", "error", err)
	}

	for _, l := range letterrecs {
		letters = append(letters, l.GetString("id"))
	}

	rec := []core.Record{}
	err = pbApp.RecordQuery(dbmodels.ENTRIES_TABLE).
		Select(dbmodels.YEAR_FIELD + " AS id").
		Distinct(true).
		OrderBy("id").
		All(&rec)
	if err != nil {
		pbApp.Logger().Error("Failed to fetch years", "error", err)
	}

	years := []int{}
	for _, r := range rec {
		years = append(years, r.GetInt("id"))
	}

	return CommonReihenData{
		Years:   years,
		Places:  placeOptions,
		Letters: letters,
		Agents:  agentOptions,
	}
}

type SeriesListResult struct {
	Series           []*dbmodels.Series
	EntriesSeries    map[string][]*dbmodels.REntriesSeries // <-- Key is Series.ID, secondary relations only
	PreferredEntries map[string][]*dbmodels.Entry          // <-- Key is Series.ID, preferred entries

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
	sortSeriesByCachedOrder(musenalmApp, series)
	series = filterPublicSeries(series)

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

	preferredEntries, err := loadPreferredEntriesBySeries(pbApp, dbmodels.Ids(series))
	if err != nil {
		return nil, err
	}

	return &SeriesListResult{
		Series:           series,
		EntriesSeries:    relationsMap,
		PreferredEntries: preferredEntries,
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
	seenSIDs := map[string]struct{}{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		if _, ok := seenSIDs[r.Series()]; !ok {
			seenSIDs[r.Series()] = struct{}{}
			sids = append(sids, r.Series())
		}
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	entries, err := dbmodels.Entries_IDs(pbApp, eids)
	if err != nil {
		return nil, err
	}
	preferredEntries := map[string][]*dbmodels.Entry{}
	for _, entry := range entries {
		if sid := entry.Series(); sid != "" {
			preferredEntries[sid] = append(preferredEntries[sid], entry)
			if _, ok := seenSIDs[sid]; !ok {
				seenSIDs[sid] = struct{}{}
				sids = append(sids, sid)
			}
		}
	}

	series, err := dbmodels.Series_IDs(pbApp, sids)
	if err != nil {
		return nil, err
	}

	sortSeriesByCachedOrder(musenalmApp, series)
	series = filterPublicSeries(series)
	for _, r := range entriesseries {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:           series,
		EntriesSeries:    entriesseries,
		PreferredEntries: preferredEntries,
		Agent:            agent,
		EntriesAgents:    entriesagents,
	}, nil
}

func NewSeriesResult_Year(musenalmApp *app.App, year int) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	fullEntries := []*dbmodels.Entry{}
	err := pbApp.RecordQuery(dbmodels.ENTRIES_TABLE).
		Where(dbx.HashExp{dbmodels.YEAR_FIELD: year}).
		All(&fullEntries)
	if err != nil {
		return nil, err
	}

	eids := dbmodels.Ids(fullEntries)

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(pbApp, eids)
	if err != nil {
		return nil, err
	}

	seenSIDs := map[string]struct{}{}
	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		if _, ok := seenSIDs[r.Series()]; !ok {
			seenSIDs[r.Series()] = struct{}{}
			sids = append(sids, r.Series())
		}
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	preferredEntries := map[string][]*dbmodels.Entry{}
	for _, entry := range fullEntries {
		if sid := entry.Series(); sid != "" {
			preferredEntries[sid] = append(preferredEntries[sid], entry)
			if _, ok := seenSIDs[sid]; !ok {
				seenSIDs[sid] = struct{}{}
				sids = append(sids, sid)
			}
		}
	}

	series, err := dbmodels.Series_IDs(pbApp, sids)
	if err != nil {
		return nil, err
	}

	sortSeriesByCachedOrder(musenalmApp, series)
	series = filterPublicSeries(series)
	for _, r := range entriesseries {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:           series,
		EntriesSeries:    entriesseries,
		PreferredEntries: preferredEntries,
	}, nil
}

func NewSeriesResult_Place(musenalmApp *app.App, place string) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	p, err := dbmodels.Places_MusenalmID(pbApp, place)
	if err != nil {
		return nil, err
	}

	fullEntries := []*dbmodels.Entry{}
	err = pbApp.RecordQuery(dbmodels.ENTRIES_TABLE).
		Where(dbx.Like(dbmodels.PLACES_TABLE, p.Id).Match(true, true)).
		All(&fullEntries)
	if err != nil {
		return nil, err
	}

	eids := dbmodels.Ids(fullEntries)

	entriesseriesrels, err := dbmodels.REntriesSeries_Entries(pbApp, eids)
	if err != nil {
		return nil, err
	}

	seenSIDs := map[string]struct{}{}
	sids := []any{}
	entriesseries := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range entriesseriesrels {
		if _, ok := seenSIDs[r.Series()]; !ok {
			seenSIDs[r.Series()] = struct{}{}
			sids = append(sids, r.Series())
		}
		entriesseries[r.Series()] = append(entriesseries[r.Series()], r)
	}

	preferredEntries := map[string][]*dbmodels.Entry{}
	for _, entry := range fullEntries {
		if sid := entry.Series(); sid != "" {
			preferredEntries[sid] = append(preferredEntries[sid], entry)
			if _, ok := seenSIDs[sid]; !ok {
				seenSIDs[sid] = struct{}{}
				sids = append(sids, sid)
			}
		}
	}

	series, err := dbmodels.Series_IDs(pbApp, sids)
	if err != nil {
		return nil, err
	}

	sortSeriesByCachedOrder(musenalmApp, series)
	series = filterPublicSeries(series)
	for _, r := range entriesseries {
		sortSeriesRelationsByEntryYear(r, musenalmApp)
	}

	return &SeriesListResult{
		Series:           series,
		EntriesSeries:    entriesseries,
		PreferredEntries: preferredEntries,
		Place:            p,
	}, nil
}

func NewSeriesResult_Search(musenalmApp *app.App, search string) (*SeriesListResult, error) {
	pbApp := musenalmApp.Core()
	series, altseries, err := dbmodels.BasicSearchSeries(pbApp, search)
	if err != nil {
		return nil, err
	}

	sortSeriesByCachedOrder(musenalmApp, series)
	sortSeriesByCachedOrder(musenalmApp, altseries)
	series = filterPublicSeries(series)
	altseries = filterPublicSeries(altseries)

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

	preferredEntries, err := loadPreferredEntriesBySeries(pbApp, keys)
	if err != nil {
		return nil, err
	}

	ret := &SeriesListResult{
		Series:           series,
		AltSeries:        altseries,
		EntriesSeries:    relationsMap,
		PreferredEntries: preferredEntries,
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

			sortSeriesByCachedOrder(musenalmApp, idseries)
			idseries = filterPublicSeries(idseries)
			ret.IDSeries = idseries

			for _, v := range idrelations {
				ret.EntriesSeries[v.Series()] = append(relationsMap[v.Series()], v)
			}
			for _, r := range ret.EntriesSeries {
				sortSeriesRelationsByEntryYear(r, musenalmApp)
			}
			for _, entry := range identries {
				if sid := entry.Series(); sid != "" {
					ret.PreferredEntries[sid] = append(ret.PreferredEntries[sid], entry)
				}
			}
		}
	}

	return ret, nil
}

func loadPreferredEntriesBySeries(app core.App, seriesIDs []any) (map[string][]*dbmodels.Entry, error) {
	if len(seriesIDs) == 0 {
		return map[string][]*dbmodels.Entry{}, nil
	}
	entries, err := dbmodels.Entries_SeriesIDs(app, seriesIDs)
	if err != nil {
		return nil, err
	}
	m := make(map[string][]*dbmodels.Entry, len(seriesIDs))
	for _, entry := range entries {
		sid := entry.Series()
		m[sid] = append(m[sid], entry)
	}
	return m, nil
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
	if len(ids) == 0 {
		return []*dbmodels.Entry{}, []*dbmodels.REntriesSeries{}, nil
	}

	relations, err := seriesRelationsBySeriesIDs(pbApp, ids)
	if err != nil {
		return nil, nil, err
	}

	preferredEntries, err := dbmodels.Entries_SeriesIDs(pbApp, ids)
	if err != nil {
		return nil, nil, err
	}

	entryIDs := make([]any, 0, len(relations)+len(preferredEntries))
	seenEntryIDs := make(map[string]struct{}, len(relations)+len(preferredEntries))
	for _, relation := range relations {
		if relation == nil || relation.Entry() == "" {
			continue
		}
		if _, ok := seenEntryIDs[relation.Entry()]; ok {
			continue
		}
		seenEntryIDs[relation.Entry()] = struct{}{}
		entryIDs = append(entryIDs, relation.Entry())
	}
	for _, entry := range preferredEntries {
		if entry == nil || entry.Id == "" {
			continue
		}
		if _, ok := seenEntryIDs[entry.Id]; ok {
			continue
		}
		seenEntryIDs[entry.Id] = struct{}{}
		entryIDs = append(entryIDs, entry.Id)
	}

	if len(entryIDs) == 0 {
		return []*dbmodels.Entry{}, relations, nil
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
	if len(entries) == 0 {
		return []*dbmodels.Series{}, []*dbmodels.REntriesSeries{}, nil
	}

	relations, err := dbmodels.REntriesSeries_Entries(app, dbmodels.Ids(entries))
	if err != nil {
		return nil, nil, err
	}

	sids := make([]any, 0, len(relations)+len(entries))
	seenSeriesIDs := make(map[string]struct{}, len(relations)+len(entries))
	for _, r := range relations {
		if r == nil || r.Series() == "" {
			continue
		}
		if _, ok := seenSeriesIDs[r.Series()]; ok {
			continue
		}
		seenSeriesIDs[r.Series()] = struct{}{}
		sids = append(sids, r.Series())
	}
	for _, entry := range entries {
		if entry == nil || entry.Series() == "" {
			continue
		}
		if _, ok := seenSeriesIDs[entry.Series()]; ok {
			continue
		}
		seenSeriesIDs[entry.Series()] = struct{}{}
		sids = append(sids, entry.Series())
	}

	if len(sids) == 0 {
		return []*dbmodels.Series{}, relations, nil
	}

	series, err := dbmodels.Series_IDs(app, sids)
	if err != nil {
		return nil, nil, err
	}

	return series, relations, nil
}

func loadCommonReihenFilterOptions(musenalmApp *app.App) ([]map[string]any, []map[string]any, error) {
	agentOptions := buildReihenAgentOptionsFromCache(musenalmApp.GetAllAgentDisplays())
	placeOptions := buildReihenPlaceOptionsFromCache(musenalmApp.GetAllPlaceDisplays())

	return reihenAgentItems(musenalmApp, agentOptions), reihenPlaceItems(musenalmApp, placeOptions), nil
}

func buildReihenAgentOptionsFromCache(displays []*app.AgentDisplay) []baendeLazyFilterOption {
	options := make([]baendeLazyFilterOption, 0, len(displays))
	for _, display := range displays {
		if display == nil || display.EditState == "ToDo" {
			continue
		}

		label := strings.TrimSpace(display.Name)
		if label == "" {
			label = display.ID
		}

		option := baendeLazyFilterOption{
			Value: display.ID,
			Label: label,
		}
		if display.CorporateBody {
			option.Meta = "ORG"
			option.MetaIsBadge = true
		} else if bio := strings.TrimSpace(display.LifeDates); bio != "" {
			option.Meta = bio
		}

		options = append(options, option)
	}

	collator := collate.New(language.German)
	slices.SortFunc(options, func(a, b baendeLazyFilterOption) int {
		if cmp := collator.CompareString(a.Label, b.Label); cmp != 0 {
			return cmp
		}
		return strings.Compare(a.Value, b.Value)
	})

	return options
}

func buildReihenPlaceOptionsFromCache(displays []*app.PlaceDisplay) []baendeLazyFilterOption {
	options := make([]baendeLazyFilterOption, 0, len(displays))
	for _, display := range displays {
		if display == nil || display.EditState == "ToDo" {
			continue
		}
		label := strings.TrimSpace(display.Name)
		if label == "" {
			label = display.ID
		}
		options = append(options, baendeLazyFilterOption{
			Value: display.ID,
			Label: label,
		})
	}

	collator := collate.New(language.German)
	slices.SortFunc(options, func(a, b baendeLazyFilterOption) int {
		if cmp := collator.CompareString(a.Label, b.Label); cmp != 0 {
			return cmp
		}
		return strings.Compare(a.Value, b.Value)
	})

	return options
}

func reihenAgentItems(musenalmApp *app.App, options []baendeLazyFilterOption) []map[string]any {
	items := make([]map[string]any, 0, len(options))
	for _, option := range options {
		display := musenalmApp.GetAgentDisplay(option.Value)
		musenalmID := any(nil)
		if display != nil && display.MusenalmID > 0 {
			musenalmID = display.MusenalmID
		}
		item := map[string]any{
			"id":          option.Value,
			"musenalm_id": musenalmID,
			"name":        option.Label,
		}
		if option.MetaIsBadge {
			item["corporate_body"] = true
			item["biographical_data"] = ""
		} else {
			item["corporate_body"] = false
			item["biographical_data"] = option.Meta
		}
		items = append(items, item)
	}
	return items
}

func reihenPlaceItems(musenalmApp *app.App, options []baendeLazyFilterOption) []map[string]any {
	items := make([]map[string]any, 0, len(options))
	for _, option := range options {
		display := musenalmApp.GetPlaceDisplay(option.Value)
		musenalmID := any(nil)
		if display != nil && display.MusenalmID > 0 {
			musenalmID = display.MusenalmID
		}
		items = append(items, map[string]any{
			"id":          option.Value,
			"musenalm_id": musenalmID,
			"name":        option.Label,
		})
	}
	return items
}

func sortSeriesByCachedOrder(musenalmApp *app.App, series []*dbmodels.Series) {
	orderedIDs, err := musenalmApp.GetSeriesOrderIDs()
	if err != nil {
		dbmodels.Sort_Series_Title(series)
		return
	}
	if len(orderedIDs) == 0 {
		dbmodels.Sort_Series_Title(series)
		return
	}

	rank := make(map[string]int, len(orderedIDs))
	for i, id := range orderedIDs {
		rank[id] = i
	}

	slices.SortFunc(series, func(left, right *dbmodels.Series) int {
		leftRank, leftOK := rank[left.Id]
		rightRank, rightOK := rank[right.Id]
		switch {
		case leftOK && rightOK:
			return leftRank - rightRank
		case leftOK:
			return -1
		case rightOK:
			return 1
		default:
			if left.Title() < right.Title() {
				return -1
			}
			if left.Title() > right.Title() {
				return 1
			}
			return 0
		}
	})
}
