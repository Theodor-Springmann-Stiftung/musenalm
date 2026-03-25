package controllers

import (
	"fmt"
	"net/url"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

const (
	REIHEN_ADMIN_PAGE_SIZE    = 80
	adminReihenFilterCacheTTL = 30 * time.Second
)

var adminReihenFilterCache struct {
	mu       sync.RWMutex
	data     *adminReihenFilterData
	cachedAt time.Time
}

var adminAlphabet = []string{
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
	"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
}

func init() {
	rp := &ReihenAdminPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHEN_NAME,
			URL:      URL_REIHEN_ADMIN,
			Template: TEMPLATE_REIHEN_ADMIN,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(rp)
}

type ReihenAdminPage struct {
	pagemodels.StaticPage
}

type ReihenAdminResult struct {
	Series        []*dbmodels.Series
	Entries       map[string]*dbmodels.Entry
	SeriesEntries map[string][]*dbmodels.REntriesSeries
	BandLinks     map[string][]*ReihenBandLink
	Users         map[string]*dbmodels.User
}

type ReihenBandLink struct {
	Entry    *dbmodels.Entry
	Relation *dbmodels.REntriesSeries
}

type adminReihenLazyFilterOption struct {
	Value string
	Label string
}

type adminReihenLazyFilterData struct {
	Kind        string
	Title       string
	Placeholder string
	SpinnerID   string
	Options     []adminReihenLazyFilterOption
}

func (p *ReihenAdminPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_REIHEN_ADMIN)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app))
	rg.GET("results/", p.handleResults(engine, app))
	rg.GET("more/", p.handleMore(engine, app))
	rg.GET("filters/{kind}/", p.handleFilterOptions(engine, app))
	rg.GET("row/{id}", p.handleRow(engine, app))
	rg.GET("details/{id}", p.handleDetails(engine, app))
	rg.GET("delete-info/{id}", p.handleDeleteInfo(engine, app))
	return nil
}

func (p *ReihenAdminPage) handlePage(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, p.Template, data, adminPageLayout(e, p.Layout))
	}
}

func (p *ReihenAdminPage) handleResults(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, URL_REIHEN_ADMIN_RESULTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *ReihenAdminPage) handleMore(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req, false)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		hasMore := "false"
		if hasMoreVal, ok := data["has_more"].(bool); ok && hasMoreVal {
			hasMore = "true"
		}
		e.Response.Header().Set("X-Has-More", hasMore)
		if nextOffsetVal, ok := data["next_offset"].(int); ok {
			e.Response.Header().Set("X-Next-Offset", strconv.Itoa(nextOffsetVal))
		} else {
			e.Response.Header().Set("X-Next-Offset", "0")
		}
		if currentCountVal, ok := data["current_count"].(int); ok {
			e.Response.Header().Set("X-Current-Count", strconv.Itoa(currentCountVal))
		} else {
			e.Response.Header().Set("X-Current-Count", "0")
		}
		if totalCountVal, ok := data["total_count"].(int); ok {
			e.Response.Header().Set("X-Total-Count", strconv.Itoa(totalCountVal))
		} else {
			e.Response.Header().Set("X-Total-Count", "0")
		}

		return engine.Response200(e, URL_REIHEN_ADMIN_MORE, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *ReihenAdminPage) handleFilterOptions(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_LOGIN)
		}

		data, err := buildAdminReihenLazyFilterData(app, e.Request.PathValue("kind"))
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		return engine.Response200(e, TEMPLATE_REIHEN_ADMIN_FILTERS, map[string]any{
			"Kind":        data.Kind,
			"Title":       data.Title,
			"Placeholder": data.Placeholder,
			"SpinnerID":   data.SpinnerID,
			"Options":     data.Options,
		}, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *ReihenAdminPage) handleDeleteInfo(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_LOGIN)
		}

		id := e.Request.PathValue("id")
		if id == "" {
			return engine.Response404(e, nil, nil)
		}

		series, err := dbmodels.Series_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		entries, err := preferredSeriesEntries(app, series.Id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		dbmodels.Sort_Entries_Year_Title(entries)

		data := map[string]any{
			"series":  series,
			"entries": entries,
		}

		return engine.Response200(e, TEMPLATE_REIHEN_ADMIN_DELETE_INFO, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *ReihenAdminPage) handleRow(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_LOGIN)
		}

		data, err := p.buildSingleSeriesRowData(app, e.Request.PathValue("id"), req)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		return engine.Response200(e, "/admin/reihen/row/", data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *ReihenAdminPage) handleDetails(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_LOGIN)
		}

		data, err := p.buildSingleSeriesRowData(app, e.Request.PathValue("id"), req)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		data["expanded"] = true

		return engine.Response200(e, "/admin/reihen/details/", data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *ReihenAdminPage) buildResultData(app core.App, e *core.RequestEvent, req *templating.Request, showAggregated bool) (data map[string]any, err error) {
	data = map[string]any{}
	timer := newAdminRequestTimer(app, e, "reihen", showAggregated)
	defer func() {
		timer.Finish(err)
	}()

	offset := 0
	if offsetStr := strings.TrimSpace(e.Request.URL.Query().Get("offset")); offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil && val >= 0 {
			offset = val
		}
	}

	search := strings.TrimSpace(e.Request.URL.Query().Get("search"))
	letter := strings.ToUpper(strings.TrimSpace(e.Request.URL.Query().Get("letter")))
	person := strings.TrimSpace(e.Request.URL.Query().Get("person"))
	place := strings.TrimSpace(e.Request.URL.Query().Get("place"))
	yearStr := strings.TrimSpace(e.Request.URL.Query().Get("year"))
	sortField := strings.ToLower(strings.TrimSpace(e.Request.URL.Query().Get("sort")))
	sortOrder := strings.ToLower(strings.TrimSpace(e.Request.URL.Query().Get("order")))

	validSorts := map[string]bool{
		"title":   true,
		"nr":      true,
		"updated": true,
	}
	if !validSorts[sortField] {
		sortField = "title"
	}
	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = "asc"
	}

	letters := adminAlphabet
	validLetters := make(map[string]struct{}, len(letters))
	for _, ch := range letters {
		validLetters[ch] = struct{}{}
	}
	if letter != "" {
		letter = normalizeAdminLetter(letter)
		if _, ok := validLetters[letter]; !ok {
			letter = ""
		}
	}
	timer.Mark("params")

	allowedIDs := []map[string]struct{}{}
	if search != "" {
		searchIDs, err := searchAdminSeriesIDs(app, search)
		if err != nil {
			return data, err
		}
		allowedIDs = append(allowedIDs, searchIDs)
	}
	if person != "" {
		personIDs, err := seriesIDsForAgent(app, person)
		if err != nil {
			return data, err
		}
		allowedIDs = append(allowedIDs, personIDs)
	}
	if place != "" {
		placeIDs, err := seriesIDsForPlace(app, place)
		if err != nil {
			return data, err
		}
		allowedIDs = append(allowedIDs, placeIDs)
	}
	if yearStr != "" {
		yearVal, err := strconv.Atoi(yearStr)
		if err != nil {
			allowedIDs = append(allowedIDs, map[string]struct{}{})
		} else {
			yearIDs, err := seriesIDsForYear(app, yearVal)
			if err != nil {
				return data, err
			}
			allowedIDs = append(allowedIDs, yearIDs)
		}
	}
	timer.Mark("allowed_ids")

	filteredIDs := applyAllowedIDs(allowedIDs...)
	if filteredIDs != nil && len(filteredIDs) == 0 {
		filterData, err := buildAdminReihenFilterData(app)
		if err != nil {
			return data, err
		}
		data["result"] = &ReihenAdminResult{
			Series:        []*dbmodels.Series{},
			Entries:       map[string]*dbmodels.Entry{},
			SeriesEntries: map[string][]*dbmodels.REntriesSeries{},
			BandLinks:     map[string][]*ReihenBandLink{},
			Users:         map[string]*dbmodels.User{},
		}
		data["offset"] = offset
		data["total_count"] = 0
		data["current_count"] = 0
		data["has_more"] = false
		data["next_offset"] = 0
		data["search"] = search
		data["letter"] = letter
		data["person"] = person
		data["place"] = place
		data["year"] = yearStr
		data["sort_field"] = sortField
		data["sort_order"] = sortOrder
		data["letters"] = letters
		data["csrf_token"] = req.Session().Token
		data["filter_agents"] = filterData.Agents
		data["filter_agent_labels"] = filterData.AgentLabels
		data["filter_places"] = filterData.Places
		data["filter_place_labels"] = filterData.PlaceLabels
		data["filter_years"] = filterData.Years
		data["filter_year_labels"] = filterData.YearLabels
		data["selected_filter_labels"] = buildAdminReihenSelectedFilterLabels(filterData, person, place, yearStr)
		timer.Mark("filter_data")
		return data, nil
	}

	var totalCount64 int64
	if err := buildAdminReihenSeriesQuery(app, letter, filteredIDs).
		Select("COUNT(*)").
		Row(&totalCount64); err != nil {
		return data, err
	}
	totalCount := int(totalCount64)
	timer.Mark("count_query")

	queryOffset, limit, currentCount, nextOffset, hasMore := paginatedQueryWindow(offset, totalCount, REIHEN_ADMIN_PAGE_SIZE, showAggregated)
	pageSeries := []*dbmodels.Series{}
	if limit > 0 {
		if err := buildAdminReihenSeriesQuery(app, letter, filteredIDs).
			OrderBy(adminReihenOrderBy(sortField, sortOrder)...).
			Limit(int64(limit)).
			Offset(int64(queryOffset)).
			All(&pageSeries); err != nil {
			return data, err
		}
	}
	timer.Mark("page_query")

	result, err := loadAdminReihenPageResult(app, pageSeries)
	if err != nil {
		return data, err
	}
	timer.Mark("page_result")
	filterData, err := buildAdminReihenFilterData(app)
	if err != nil {
		return data, err
	}
	timer.Mark("filter_data")

	data["result"] = result
	data["offset"] = offset
	data["total_count"] = totalCount
	data["current_count"] = currentCount
	data["has_more"] = hasMore
	data["next_offset"] = nextOffset
	data["search"] = search
	data["letter"] = letter
	data["person"] = person
	data["place"] = place
	data["year"] = yearStr
	data["sort_field"] = sortField
	data["sort_order"] = sortOrder
	data["letters"] = letters
	data["csrf_token"] = req.Session().Token
	data["filter_agents"] = filterData.Agents
	data["filter_agent_labels"] = filterData.AgentLabels
	data["filter_places"] = filterData.Places
	data["filter_place_labels"] = filterData.PlaceLabels
	data["filter_years"] = filterData.Years
	data["filter_year_labels"] = filterData.YearLabels
	data["selected_filter_labels"] = buildAdminReihenSelectedFilterLabels(filterData, person, place, yearStr)
	timer.Mark("result")

	return data, nil
}

type adminReihenFilterData struct {
	Agents      []*dbmodels.Agent
	AgentLabels map[string]string
	Places      []*dbmodels.Place
	PlaceLabels map[string]string
	Years       []int
	YearLabels  map[string]string
}

func buildAdminReihenSelectedFilterLabels(filterData *adminReihenFilterData, person, place, year string) map[string]string {
	labels := map[string]string{
		"person": "",
		"place":  "",
		"year":   "",
	}
	if filterData == nil {
		return labels
	}

	if person != "" {
		if label, ok := filterData.AgentLabels[person]; ok && label != "" {
			labels["person"] = label
		} else {
			labels["person"] = person
		}
	}
	if place != "" {
		if label, ok := filterData.PlaceLabels[place]; ok && label != "" {
			labels["place"] = label
		} else {
			labels["place"] = place
		}
	}
	if year != "" {
		if label, ok := filterData.YearLabels[year]; ok && label != "" {
			labels["year"] = label
		} else {
			labels["year"] = year
		}
	}

	return labels
}

func buildAdminReihenFilterData(app core.App) (*adminReihenFilterData, error) {
	adminReihenFilterCache.mu.RLock()
	if adminReihenFilterCache.data != nil && time.Since(adminReihenFilterCache.cachedAt) < adminReihenFilterCacheTTL {
		defer adminReihenFilterCache.mu.RUnlock()
		return adminReihenFilterCache.data, nil
	}
	adminReihenFilterCache.mu.RUnlock()

	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
		return nil, err
	}
	agentMap := make(map[string]*dbmodels.Agent, len(agents))
	for _, agent := range agents {
		if agent != nil {
			agentMap[agent.Id] = agent
		}
	}

	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return nil, err
	}
	placeMap := make(map[string]*dbmodels.Place, len(places))
	for _, place := range places {
		if place != nil {
			placeMap[place.Id] = place
		}
	}

	yearRows := []struct {
		Year int `db:"year"`
	}{}
	if err := app.DB().
		NewQuery("SELECT DISTINCT " + dbmodels.YEAR_FIELD + " AS year FROM " + dbmodels.ENTRIES_TABLE + " ORDER BY " + dbmodels.YEAR_FIELD).
		All(&yearRows); err != nil {
		return nil, err
	}
	years := make(map[int]struct{}, len(yearRows))
	for _, row := range yearRows {
		years[row.Year] = struct{}{}
	}

	data := &adminReihenFilterData{
		Agents:      buildAdminReihenAgentFilters(agentMap),
		AgentLabels: buildAdminReihenAgentLabelMap(agentMap),
		Places:      buildAdminReihenPlaceFilters(placeMap),
		PlaceLabels: buildAdminReihenPlaceLabelMap(placeMap),
		Years:       buildAdminReihenYearFilters(years),
		YearLabels:  buildAdminReihenYearLabelMap(years),
	}

	adminReihenFilterCache.mu.Lock()
	adminReihenFilterCache.data = data
	adminReihenFilterCache.cachedAt = time.Now()
	adminReihenFilterCache.mu.Unlock()

	return data, nil
}

func buildAdminReihenLazyFilterData(app core.App, kind string) (*adminReihenLazyFilterData, error) {
	filterData, err := buildAdminReihenFilterData(app)
	if err != nil {
		return nil, err
	}

	switch kind {
	case "person":
		options := make([]adminReihenLazyFilterOption, 0, len(filterData.Agents))
		for _, agent := range filterData.Agents {
			if agent == nil {
				continue
			}
			options = append(options, adminReihenLazyFilterOption{
				Value: agent.Id,
				Label: agent.Name(),
			})
		}
		return &adminReihenLazyFilterData{
			Kind:        kind,
			Title:       "Person",
			Placeholder: "Personen filtern...",
			SpinnerID:   "reihen-person-spinner",
			Options:     options,
		}, nil
	case "place":
		options := make([]adminReihenLazyFilterOption, 0, len(filterData.Places))
		for _, place := range filterData.Places {
			if place == nil {
				continue
			}
			options = append(options, adminReihenLazyFilterOption{
				Value: place.Id,
				Label: place.Name(),
			})
		}
		return &adminReihenLazyFilterData{
			Kind:        kind,
			Title:       "Ort",
			Placeholder: "Orte filtern...",
			SpinnerID:   "reihen-place-spinner",
			Options:     options,
		}, nil
	case "year":
		options := make([]adminReihenLazyFilterOption, 0, len(filterData.Years))
		for _, year := range filterData.Years {
			label := strconv.Itoa(year)
			if year == 0 {
				label = "ohne Jahr"
			}
			options = append(options, adminReihenLazyFilterOption{
				Value: strconv.Itoa(year),
				Label: label,
			})
		}
		return &adminReihenLazyFilterData{
			Kind:        kind,
			Title:       "Jahr",
			Placeholder: "Jahre filtern...",
			SpinnerID:   "reihen-year-spinner",
			Options:     options,
		}, nil
	default:
		return nil, fmt.Errorf("unsupported reihen filter kind %q", kind)
	}
}

func buildAdminReihenSeriesQuery(app core.App, letter string, filteredIDs map[string]struct{}) *dbx.SelectQuery {
	query := app.RecordQuery(dbmodels.SERIES_TABLE)
	if letter != "" {
		query = query.AndWhere(adminInitialFilterExp(dbmodels.SERIES_TITLE_FIELD, letter))
	}
	if filteredIDs != nil {
		query = query.AndWhere(dbx.HashExp{dbmodels.ID_FIELD: anySliceFromStringSet(filteredIDs)})
	}
	return query
}

func adminReihenOrderBy(sortField, sortOrder string) []string {
	desc := sortOrder == "desc"
	order := "ASC"
	if desc {
		order = "DESC"
	}

	switch sortField {
	case "nr":
		return []string{
			dbmodels.MUSENALMID_FIELD + " " + order,
			dbmodels.SERIES_TITLE_FIELD + " " + order,
			dbmodels.ID_FIELD + " " + order,
		}
	case "updated":
		return []string{
			dbmodels.UPDATED_FIELD + " " + order,
			dbmodels.SERIES_TITLE_FIELD + " " + order,
			dbmodels.ID_FIELD + " " + order,
		}
	default:
		return []string{
			dbmodels.SERIES_TITLE_FIELD + " " + order,
			dbmodels.ID_FIELD + " " + order,
		}
	}
}

func loadAdminReihenPageResult(app core.App, pageSeries []*dbmodels.Series) (*ReihenAdminResult, error) {
	result := &ReihenAdminResult{
		Series:        pageSeries,
		Entries:       map[string]*dbmodels.Entry{},
		SeriesEntries: map[string][]*dbmodels.REntriesSeries{},
		BandLinks:     map[string][]*ReihenBandLink{},
		Users:         map[string]*dbmodels.User{},
	}

	if len(pageSeries) == 0 {
		return result, nil
	}

	relations, err := dbmodels.REntriesSeries_Seriess(app, dbmodels.Ids(pageSeries))
	if err != nil {
		return nil, err
	}

	entryIDs := map[string]struct{}{}
	for _, rel := range relations {
		if rel == nil {
			continue
		}
		result.SeriesEntries[rel.Series()] = append(result.SeriesEntries[rel.Series()], rel)
		if entryID := rel.Entry(); entryID != "" {
			entryIDs[entryID] = struct{}{}
		}
	}

	if len(entryIDs) > 0 {
		entries, err := dbmodels.Entries_IDs(app, anySliceFromStringSet(entryIDs))
		if err != nil {
			return nil, err
		}
		for _, entry := range entries {
			if entry != nil {
				result.Entries[entry.Id] = entry
			}
		}
	}

	for seriesID, rels := range result.SeriesEntries {
		result.SeriesEntries[seriesID] = sortSeriesRelationsForAdmin(rels, result.Entries)
	}

	userIDs := map[string]struct{}{}
	for _, series := range pageSeries {
		if series != nil && series.Editor() != "" {
			userIDs[series.Editor()] = struct{}{}
		}
	}
	if len(userIDs) > 0 {
		users, err := dbmodels.TableByIDs[*dbmodels.User](app, dbmodels.USERS_TABLE, anySliceFromStringSet(userIDs))
		if err != nil {
			return nil, err
		}
		for _, user := range users {
			if user != nil {
				result.Users[user.Id] = user
			}
		}
	}

	result.BandLinks = buildReihenBandLinksMap(pageSeries, result.Entries, result.SeriesEntries)
	return result, nil
}

func seriesIDsForAgent(app core.App, agentID string) (map[string]struct{}, error) {
	rels, err := dbmodels.REntriesAgents_Agent(app, agentID)
	if err != nil {
		return nil, err
	}

	entryIDs := map[string]struct{}{}
	for _, rel := range rels {
		if rel != nil && rel.Entry() != "" {
			entryIDs[rel.Entry()] = struct{}{}
		}
	}
	return seriesIDsForEntrySet(app, entryIDs)
}

func seriesIDsForPlace(app core.App, placeID string) (map[string]struct{}, error) {
	entryRows := []struct {
		ID string `db:"id"`
	}{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Select(dbmodels.ID_FIELD).
		Where(dbx.NewExp(
			"json_valid("+dbmodels.PLACES_TABLE+") = 1 AND EXISTS (SELECT 1 FROM json_each("+dbmodels.PLACES_TABLE+") WHERE value = {:id})",
			dbx.Params{"id": placeID},
		)).
		All(&entryRows); err != nil {
		return nil, err
	}

	entryIDs := make(map[string]struct{}, len(entryRows))
	for _, row := range entryRows {
		if row.ID != "" {
			entryIDs[row.ID] = struct{}{}
		}
	}
	return seriesIDsForEntrySet(app, entryIDs)
}

func seriesIDsForYear(app core.App, year int) (map[string]struct{}, error) {
	entryRows := []struct {
		ID string `db:"id"`
	}{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Select(dbmodels.ID_FIELD).
		Where(dbx.HashExp{dbmodels.YEAR_FIELD: year}).
		All(&entryRows); err != nil {
		return nil, err
	}

	entryIDs := make(map[string]struct{}, len(entryRows))
	for _, row := range entryRows {
		if row.ID != "" {
			entryIDs[row.ID] = struct{}{}
		}
	}
	return seriesIDsForEntrySet(app, entryIDs)
}

func seriesIDsForEntrySet(app core.App, entryIDs map[string]struct{}) (map[string]struct{}, error) {
	if len(entryIDs) == 0 {
		return map[string]struct{}{}, nil
	}

	rels, err := dbmodels.REntriesSeries_Entries(app, anySliceFromStringSet(entryIDs))
	if err != nil {
		return nil, err
	}

	seriesIDs := map[string]struct{}{}
	for _, rel := range rels {
		if rel != nil && rel.Series() != "" {
			seriesIDs[rel.Series()] = struct{}{}
		}
	}
	return seriesIDs, nil
}

func searchAdminSeriesIDs(app core.App, search string) (map[string]struct{}, error) {
	series, altSeries, err := dbmodels.BasicSearchSeries(app, search)
	if err != nil {
		return nil, err
	}

	result := map[string]struct{}{}
	for _, series := range series {
		if series != nil {
			result[series.Id] = struct{}{}
		}
	}
	for _, series := range altSeries {
		if series != nil {
			result[series.Id] = struct{}{}
		}
	}

	if _, err := strconv.Atoi(strings.TrimSpace(search)); err == nil {
		entryRows := []struct {
			ID string `db:"id"`
		}{}
		err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
			Select(dbmodels.ID_FIELD).
			Where(dbx.HashExp{dbmodels.MUSENALMID_FIELD: search}).
			All(&entryRows)
		if err != nil {
			return nil, err
		}
		if len(entryRows) > 0 {
			entryIDs := make(map[string]struct{}, len(entryRows))
			for _, row := range entryRows {
				if row.ID != "" {
					entryIDs[row.ID] = struct{}{}
				}
			}
			idSeries, err := seriesIDsForEntrySet(app, entryIDs)
			if err != nil {
				return nil, err
			}
			for id := range idSeries {
				result[id] = struct{}{}
			}
		}
	}

	return result, nil
}

func filterSeriesBySearchIDs(series []*dbmodels.Series, allowed map[string]struct{}) []*dbmodels.Series {
	if len(allowed) == 0 {
		return []*dbmodels.Series{}
	}
	result := make([]*dbmodels.Series, 0, len(series))
	for _, item := range series {
		if item == nil {
			continue
		}
		if _, ok := allowed[item.Id]; ok {
			result = append(result, item)
		}
	}
	return result
}

func filterSeriesByLetter(series []*dbmodels.Series, letter string) []*dbmodels.Series {
	if letter == "" {
		return series
	}
	letter = normalizeAdminLetter(letter)
	result := make([]*dbmodels.Series, 0, len(series))
	for _, item := range series {
		if item == nil {
			continue
		}
		if normalizedAdminInitial(item.Title()) == letter {
			result = append(result, item)
		}
	}
	return result
}

func filterSeriesByAgent(series []*dbmodels.Series, seriesEntries map[string][]*dbmodels.REntriesSeries, entryAgents map[string][]*dbmodels.REntriesAgents, agentID string) []*dbmodels.Series {
	if agentID == "" {
		return series
	}
	result := make([]*dbmodels.Series, 0, len(series))
	for _, item := range series {
		if item == nil {
			continue
		}
		rels := seriesEntries[item.Id]
		if seriesHasAgent(rels, entryAgents, agentID) {
			result = append(result, item)
		}
	}
	return result
}

func filterSeriesByPlace(series []*dbmodels.Series, seriesEntries map[string][]*dbmodels.REntriesSeries, entries map[string]*dbmodels.Entry, placeID string) []*dbmodels.Series {
	if placeID == "" {
		return series
	}
	result := make([]*dbmodels.Series, 0, len(series))
	for _, item := range series {
		if item == nil {
			continue
		}
		rels := seriesEntries[item.Id]
		if seriesHasPlace(rels, entries, placeID) {
			result = append(result, item)
		}
	}
	return result
}

func filterSeriesByYear(series []*dbmodels.Series, seriesEntries map[string][]*dbmodels.REntriesSeries, entries map[string]*dbmodels.Entry, year int) []*dbmodels.Series {
	result := make([]*dbmodels.Series, 0, len(series))
	for _, item := range series {
		if item == nil {
			continue
		}
		rels := seriesEntries[item.Id]
		if seriesHasYear(rels, entries, year) {
			result = append(result, item)
		}
	}
	return result
}

func seriesHasAgent(rels []*dbmodels.REntriesSeries, entryAgents map[string][]*dbmodels.REntriesAgents, agentID string) bool {
	for _, rel := range rels {
		if rel == nil {
			continue
		}
		for _, agentRel := range entryAgents[rel.Entry()] {
			if agentRel != nil && agentRel.Agent() == agentID {
				return true
			}
		}
	}
	return false
}

func seriesHasPlace(rels []*dbmodels.REntriesSeries, entries map[string]*dbmodels.Entry, placeID string) bool {
	for _, rel := range rels {
		if rel == nil {
			continue
		}
		entry := entries[rel.Entry()]
		if entry == nil {
			continue
		}
		for _, entryPlaceID := range entry.Places() {
			if entryPlaceID == placeID {
				return true
			}
		}
	}
	return false
}

func seriesHasYear(rels []*dbmodels.REntriesSeries, entries map[string]*dbmodels.Entry, year int) bool {
	for _, rel := range rels {
		if rel == nil {
			continue
		}
		entry := entries[rel.Entry()]
		if entry != nil && entry.Year() == year {
			return true
		}
	}
	return false
}

func sortAdminSeries(series []*dbmodels.Series, sortField, sortOrder string, users map[string]*dbmodels.User) {
	collator := collate.New(language.German)
	slices.SortFunc(series, func(i, j *dbmodels.Series) int {
		switch sortField {
		case "nr":
			if i.MusenalmID() == j.MusenalmID() {
				return collator.CompareString(i.Title(), j.Title())
			}
			return i.MusenalmID() - j.MusenalmID()
		case "updated":
			iUpdated := i.Updated().Time()
			jUpdated := j.Updated().Time()
			if iUpdated.Equal(jUpdated) {
				return collator.CompareString(i.Title(), j.Title())
			}
			if iUpdated.Before(jUpdated) {
				return -1
			}
			return 1
		default:
			return collator.CompareString(i.Title(), j.Title())
		}
	})

	if sortField == "user" {
		slices.SortFunc(series, func(i, j *dbmodels.Series) int {
			iName := adminSeriesUserName(users[i.Editor()])
			jName := adminSeriesUserName(users[j.Editor()])
			if iName == jName {
				return collator.CompareString(i.Title(), j.Title())
			}
			if iName == "" {
				return 1
			}
			if jName == "" {
				return -1
			}
			return collator.CompareString(iName, jName)
		})
	}

	if sortOrder == "desc" {
		slices.Reverse(series)
	}
}

func buildSeriesLetters(series []*dbmodels.Series) []string {
	lettersSet := map[string]struct{}{}
	for _, item := range series {
		if item == nil {
			continue
		}
		letter := strings.ToUpper(firstTitleLetter(item.Title()))
		if letter != "" {
			lettersSet[letter] = struct{}{}
		}
	}
	letters := make([]string, 0, len(lettersSet))
	for letter := range lettersSet {
		letters = append(letters, letter)
	}
	collator := collate.New(language.German)
	slices.SortFunc(letters, collator.CompareString)
	return letters
}

func firstTitleLetter(title string) string {
	trimmed := strings.TrimSpace(title)
	if trimmed == "" {
		return ""
	}
	runes := []rune(trimmed)
	if len(runes) == 0 {
		return ""
	}
	return string(runes[0])
}

func normalizeAdminLetter(letter string) string {
	switch strings.ToUpper(strings.TrimSpace(letter)) {
	case "Ä":
		return "A"
	case "Ö":
		return "O"
	case "Ü":
		return "U"
	default:
		return strings.ToUpper(strings.TrimSpace(letter))
	}
}

func normalizedAdminInitial(value string) string {
	return normalizeAdminLetter(firstTitleLetter(value))
}

func buildAdminReihenAgentFilters(agentMap map[string]*dbmodels.Agent) []*dbmodels.Agent {
	agents := make([]*dbmodels.Agent, 0, len(agentMap))
	for _, agent := range agentMap {
		agents = append(agents, agent)
	}
	dbmodels.Sort_Agents_Name(agents)
	return agents
}

func buildAdminReihenAgentLabelMap(agentMap map[string]*dbmodels.Agent) map[string]string {
	labels := map[string]string{}
	for id, agent := range agentMap {
		if agent != nil {
			labels[id] = agent.Name()
		}
	}
	return labels
}

func buildAdminReihenPlaceFilters(placeMap map[string]*dbmodels.Place) []*dbmodels.Place {
	places := make([]*dbmodels.Place, 0, len(placeMap))
	for _, place := range placeMap {
		places = append(places, place)
	}
	dbmodels.Sort_Places_Name(places)
	return places
}

func buildAdminReihenPlaceLabelMap(placeMap map[string]*dbmodels.Place) map[string]string {
	labels := map[string]string{}
	for id, place := range placeMap {
		if place != nil {
			labels[id] = place.Name()
		}
	}
	return labels
}

func buildAdminReihenYearFilters(years map[int]struct{}) []int {
	result := make([]int, 0, len(years))
	for year := range years {
		result = append(result, year)
	}
	slices.Sort(result)
	return result
}

func buildAdminReihenYearLabelMap(years map[int]struct{}) map[string]string {
	labels := map[string]string{}
	for year := range years {
		if year == 0 {
			labels["0"] = "ohne Jahr"
			continue
		}
		labels[strconv.Itoa(year)] = strconv.Itoa(year)
	}
	return labels
}

func buildReihenBandLinksMap(series []*dbmodels.Series, entries map[string]*dbmodels.Entry, seriesEntries map[string][]*dbmodels.REntriesSeries) map[string][]*ReihenBandLink {
	result := make(map[string][]*ReihenBandLink, len(series))
	for _, item := range series {
		if item == nil {
			continue
		}
		result[item.Id] = buildReihenBandLinks(entries, seriesEntries[item.Id])
	}
	return result
}

func buildReihenBandLinks(entries map[string]*dbmodels.Entry, rels []*dbmodels.REntriesSeries) []*ReihenBandLink {
	links := make([]*ReihenBandLink, 0, len(rels))
	for _, rel := range sortSeriesRelationsForAdmin(rels, entries) {
		if rel == nil {
			continue
		}
		entry := entries[rel.Entry()]
		if entry == nil {
			continue
		}
		links = append(links, &ReihenBandLink{
			Entry:    entry,
			Relation: rel,
		})
	}
	return links
}

func sortSeriesRelationsForAdmin(rels []*dbmodels.REntriesSeries, entries map[string]*dbmodels.Entry) []*dbmodels.REntriesSeries {
	sorted := make([]*dbmodels.REntriesSeries, 0, len(rels))
	for _, rel := range rels {
		if rel != nil {
			sorted = append(sorted, rel)
		}
	}
	collator := collate.New(language.German)
	slices.SortFunc(sorted, func(i, j *dbmodels.REntriesSeries) int {
		iEntry := entries[i.Entry()]
		jEntry := entries[j.Entry()]
		if iEntry == nil && jEntry == nil {
			return 0
		}
		if iEntry == nil {
			return 1
		}
		if jEntry == nil {
			return -1
		}
		if iEntry.Year() == jEntry.Year() {
			return collator.CompareString(iEntry.PreferredTitle(), jEntry.PreferredTitle())
		}
		return iEntry.Year() - jEntry.Year()
	})
	return sorted
}

func adminSeriesUserName(user *dbmodels.User) string {
	if user == nil {
		return ""
	}
	return user.Name()
}

func (p *ReihenAdminPage) buildSingleSeriesRowData(app core.App, id string, req *templating.Request) (map[string]any, error) {
	series, err := dbmodels.Series_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	entries, relations, err := Entries_Series_IDs(app, []any{series.Id})
	if err != nil {
		return nil, err
	}

	entriesMap := make(map[string]*dbmodels.Entry, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		entriesMap[entry.Id] = entry
	}

	var editorUser *dbmodels.User
	if editorID := series.Editor(); editorID != "" {
		user, err := dbmodels.Users_ID(app, editorID)
		if err == nil {
			editorUser = user
		} else {
			app.Logger().Error("Failed to get editor user for series", "error", err)
		}
	}

	data := map[string]any{
		"series":       series,
		"editor_user":  editorUser,
		"band_links":   buildReihenBandLinks(entriesMap, relations),
		"can_edit":     req.IsAdmin() || req.IsEditor(),
		"expanded":     false,
		"details_open": false,
	}

	return data, nil
}
