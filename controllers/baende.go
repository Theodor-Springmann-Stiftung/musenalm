package controllers

import (
	"fmt"
	"net/url"
	"slices"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode/utf8"

	musapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
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
	BAENDE_PAGE_SIZE = 80
)

func init() {
	bp := &BaendePage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_BAENDE_NAME,
			URL:      URL_BAENDE,
			Template: TEMPLATE_BAENDE,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	musapp.Register(bp)
}

type BaendePage struct {
	pagemodels.StaticPage
}

type BaendeResult struct {
	Entries       []*dbmodels.Entry
	Series        map[string]*dbmodels.Series
	EntriesSeries map[string][]*dbmodels.REntriesSeries
	SeriesLinks   map[string][]*BaendeSeriesLink
	Places        map[string]*dbmodels.Place
	PlaceLabels   map[string][]string
	PlaceLinks    map[string][]*BaendeRelationLink
	Agents        map[string]*dbmodels.Agent
	EntriesAgents map[string][]*dbmodels.REntriesAgents
	AgentLabels   map[string][]string
	AgentLinks    map[string][]*BaendeRelationLink
	Items         map[string][]*dbmodels.Item
	Users         map[string]*dbmodels.User
	ContentsCount map[string]int
}

type BaendeSeriesLink struct {
	Series   *dbmodels.Series
	Relation *dbmodels.REntriesSeries
}

type BaendeRelationLink struct {
	ID    string
	Label string
}

type baendeFilterData struct {
	Statuses     []map[string]string
	StatusLabels map[string]string
	Agents       []*dbmodels.Agent
	AgentLabels  map[string]string
	Users        []*dbmodels.User
	UserLabels   map[string]string
	Places       []*dbmodels.Place
	PlaceLabels  map[string]string
	Years        []int
	YearLabels   map[string]string
	Series       []*dbmodels.Series
	SeriesLabels map[string]string
}

type baendeLazyFilterOption struct {
	Value       string
	Label       string
	Meta        string
	MetaIsBadge bool
}

type baendeLazyFilterData struct {
	Kind        string
	Title       string
	Placeholder string
	SpinnerID   string
	Options     []baendeLazyFilterOption
}

var baendeRequestCache struct {
	mu       sync.RWMutex
	cachedAt time.Time
	filters  *baendeFilterData
}

func (p *BaendePage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_BAENDE)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app, ia))
	rg.GET("results/", p.handleResults(engine, app, ia))
	rg.GET("more/", p.handleMore(engine, app, ia))
	rg.GET("filters/{kind}/", p.handleFilterOptions(engine, app, ia))
	rg.GET("delete-info/{id}", p.handleDeleteInfo(engine, app))
	return nil
}

func (p *BaendePage) handlePage(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_BAENDE_LOGIN_REDIRECT+redirectTo)
		}

		data, err := p.buildResultData(app, ma, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, p.Template, data, adminPageLayout(e, p.Layout))
	}
}

func (p *BaendePage) handleResults(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_BAENDE_LOGIN_REDIRECT+redirectTo)
		}

		data, err := p.buildResultData(app, ma, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, URL_BAENDE_RESULTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *BaendePage) handleFilterOptions(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_BAENDE_LOGIN)
		}

		data, err := buildBaendeLazyFilterData(ma, e.Request.PathValue("kind"))
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		return engine.Response200(e, TEMPLATE_BAENDE_FILTERS, map[string]any{
			"Kind":        data.Kind,
			"Title":       data.Title,
			"Placeholder": data.Placeholder,
			"SpinnerID":   data.SpinnerID,
			"Options":     data.Options,
		}, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *BaendePage) handleDeleteInfo(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_BAENDE_LOGIN)
		}

		id := e.Request.PathValue("id")
		if id == "" {
			return engine.Response404(e, nil, nil)
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		items, err := dbmodels.Items_Entry(app, entry.Id)
		if err != nil {
			app.Logger().Error("Failed to get items for delete dialog", "error", err)
		}

		contents, err := dbmodels.Contents_Entry(app, entry.Id)
		if err != nil {
			app.Logger().Error("Failed to get contents for delete dialog", "error", err)
		}

		dbmodels.Sort_Contents_Numbering(contents)

		data := map[string]any{
			"entry":    entry,
			"items":    items,
			"contents": contents,
		}

		return engine.Response200(e, TEMPLATE_BAENDE_DELETE_INFO, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *BaendePage) buildResultData(app core.App, ma pagemodels.IApp, e *core.RequestEvent, req *templating.Request, showAggregated bool) (data map[string]any, err error) {
	data = map[string]any{}
	timer := newAdminRequestTimer(app, e, "baende", showAggregated)
	defer func() {
		timer.Finish(err)
	}()

	displayApp, ok := ma.(*musapp.App)
	if !ok {
		return data, fmt.Errorf("unexpected app type %T", ma)
	}

	// Get offset from query params (default 0)
	offset := 0
	if offsetStr := e.Request.URL.Query().Get("offset"); offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil && val >= 0 {
			offset = val
		}
	}

	// Get filters from query params
	search := strings.TrimSpace(e.Request.URL.Query().Get("search"))
	letter := normalizeAdminLetter(e.Request.URL.Query().Get("letter"))
	status := strings.TrimSpace(e.Request.URL.Query().Get("status"))
	person := strings.TrimSpace(e.Request.URL.Query().Get("person"))
	user := strings.TrimSpace(e.Request.URL.Query().Get("user"))
	yearStr := strings.TrimSpace(e.Request.URL.Query().Get("year"))
	place := strings.TrimSpace(e.Request.URL.Query().Get("place"))
	series := strings.TrimSpace(e.Request.URL.Query().Get("series"))

	// Validate letter
	if letter != "" {
		if letter < "A" || letter > "Z" {
			letter = ""
		}
	}

	// Get sort parameters
	sort := strings.ToLower(strings.TrimSpace(e.Request.URL.Query().Get("sort")))
	order := strings.ToLower(strings.TrimSpace(e.Request.URL.Query().Get("order")))

	// Validate sort field - whitelist approach for security
	validSorts := map[string]bool{
		"title":          true,
		"alm":            true,
		"year":           true,
		"signatur":       true,
		"responsibility": true,
		"place":          true,
		"linked_places":  true,
		"linked_persons": true,
		"updated":        true,
	}
	if !validSorts[sort] {
		sort = "title" // default
	}

	// Validate order
	if order != "asc" && order != "desc" {
		order = "asc" // default
	}
	timer.Mark("params")

	// Load from cache
	cacheInterface, err := ma.GetBaendeCache()
	if err != nil {
		return data, err
	}
	timer.Mark("cache_load")

	// Extract data from cache using interface methods
	allEntries, ok := cacheInterface.GetEntries().([]*dbmodels.Entry)
	if !ok {
		return data, fmt.Errorf("failed to get entries from cache")
	}

	sortedEntries, ok := cacheInterface.GetSortedEntries().(map[string][]*dbmodels.Entry)
	if !ok {
		return data, fmt.Errorf("failed to get sorted entries from cache")
	}

	itemsMap, ok := cacheInterface.GetItems().(map[string][]*dbmodels.Item)
	if !ok {
		return data, fmt.Errorf("failed to get items from cache")
	}

	seriesMap, ok := cacheInterface.GetSeries().(map[string]*dbmodels.Series)
	if !ok {
		return data, fmt.Errorf("failed to get series from cache")
	}

	entrySeriesMap, ok := cacheInterface.GetEntriesSeries().(map[string][]*dbmodels.REntriesSeries)
	if !ok {
		return data, fmt.Errorf("failed to get entries series from cache")
	}

	placesMap, ok := cacheInterface.GetPlaces().(map[string]*dbmodels.Place)
	if !ok {
		return data, fmt.Errorf("failed to get places from cache")
	}

	agentsMap, ok := cacheInterface.GetAgents().(map[string]*dbmodels.Agent)
	if !ok {
		return data, fmt.Errorf("failed to get agents from cache")
	}

	entryAgentsMap, ok := cacheInterface.GetEntriesAgents().(map[string][]*dbmodels.REntriesAgents)
	if !ok {
		return data, fmt.Errorf("failed to get entries agents from cache")
	}

	usersMap, ok := cacheInterface.GetUsers().(map[string]*dbmodels.User)
	if !ok {
		return data, fmt.Errorf("failed to get users from cache")
	}

	contentsCount, ok := cacheInterface.GetContentsCount().(map[string]int)
	if !ok {
		return data, fmt.Errorf("failed to get contents count from cache")
	}
	entryPlaceLabels := buildBaendePlaceLabelsDisplayMap(allEntries, displayApp)
	entryAgentLabels := buildBaendeAgentLabelsDisplayMap(allEntries, entryAgentsMap, displayApp)
	timer.Mark("cache_extract")

	// Apply search/letter/filters
	filteredEntries := selectBaendeSortedEntries(sortedEntries, sort)
	if filteredEntries == nil {
		filteredEntries = allEntries
	}
	if search != "" {
		trimmedSearch := strings.TrimSpace(search)
		if utf8.RuneCountInString(trimmedSearch) >= 3 {
			entries, err := searchBaendeEntries(app, trimmedSearch)
			if err != nil {
				return data, err
			}
			filteredEntries = entries
		} else {
			filteredEntries = filterEntriesBySearch(allEntries, itemsMap, trimmedSearch)
		}
		data["search"] = trimmedSearch
	}
	if letter != "" {
		filteredEntries = filterEntriesByLetter(filteredEntries, letter)
	}

	if status != "" {
		filteredEntries = filterEntriesByStatus(filteredEntries, status)
	}
	if person != "" {
		filteredEntries = filterEntriesByAgent(filteredEntries, entryAgentsMap, person)
	}
	if user != "" {
		filteredEntries = filterEntriesByEditor(filteredEntries, user)
	}
	if yearStr != "" {
		yearVal, err := strconv.Atoi(yearStr)
		if err != nil {
			filteredEntries = []*dbmodels.Entry{}
		} else {
			filteredEntries = filterEntriesByYear(filteredEntries, yearVal)
		}
	}
	if place != "" {
		filteredEntries = filterEntriesByPlace(filteredEntries, place)
	}
	if series != "" {
		filteredEntries = filterEntriesBySeries(filteredEntries, entrySeriesMap, series)
	}
	timer.Mark("filters")

	// The unsearched path now starts from a cached sorted slice, so it doesn't need resorting.
	if search != "" || requiresBaendeRuntimeSort(sort) {
		sortBaendeEntries(filteredEntries, sort, itemsMap, entryPlaceLabels, entryAgentLabels)
	}

	// Reverse for descending order
	if order == "desc" {
		filteredEntries = reverseBaendeEntries(filteredEntries)
	}
	timer.Mark("sort")

	// Calculate pagination
	totalCount := len(filteredEntries)
	var pageEntries []*dbmodels.Entry
	nextOffset := offset
	hasMore := false
	currentCount := 0

	if showAggregated {
		displayLimit := aggregatedDisplayLimit(offset, BAENDE_PAGE_SIZE)
		if displayLimit > totalCount {
			displayLimit = totalCount
		}
		if displayLimit < 0 {
			displayLimit = 0
		}
		pageEntries = filteredEntries[:displayLimit]
		nextOffset = displayLimit
		currentCount = len(pageEntries)
		hasMore = displayLimit < totalCount
	} else {
		start, endIndex := paginatedSliceBounds(offset, totalCount, BAENDE_PAGE_SIZE)
		pageEntries = filteredEntries[start:endIndex]
		nextOffset = endIndex
		currentCount = start + len(pageEntries)
		hasMore = endIndex < totalCount
	}
	timer.Mark("pagination")

	// Build result with cached associated data
	data["result"] = &BaendeResult{
		Entries:       pageEntries,
		Series:        seriesMap,
		EntriesSeries: entrySeriesMap,
		SeriesLinks:   buildBaendeSeriesLinksMap(pageEntries, seriesMap, entrySeriesMap),
		Places:        placesMap,
		PlaceLabels:   nil,
		PlaceLinks:    nil,
		Agents:        agentsMap,
		EntriesAgents: entryAgentsMap,
		AgentLabels:   nil,
		AgentLinks:    nil,
		Items:         itemsMap,
		Users:         usersMap,
		ContentsCount: contentsCount,
	}
	data["offset"] = offset
	data["total_count"] = totalCount
	data["current_count"] = currentCount
	data["has_more"] = hasMore
	data["next_offset"] = nextOffset
	data["letter"] = letter
	data["status"] = status
	data["person"] = person
	data["user"] = user
	data["year"] = yearStr
	data["place"] = place
	data["series"] = series
	data["sort_field"] = sort
	data["sort_order"] = order
	data["csrf_token"] = req.Session().Token
	timer.Mark("result")

	// Keep letters array for navigation
	letters := []string{
		"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
		"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	}
	data["letters"] = letters

	filterData := buildBaendeFilterData(cacheInterface, allEntries, agentsMap, usersMap, placesMap, seriesMap, entrySeriesMap)
	data["filter_statuses"] = filterData.Statuses
	data["filter_status_labels"] = filterData.StatusLabels
	data["filter_agents"] = filterData.Agents
	data["filter_agent_labels"] = filterData.AgentLabels
	data["filter_users"] = filterData.Users
	data["filter_user_labels"] = filterData.UserLabels
	data["filter_places"] = filterData.Places
	data["filter_place_labels"] = filterData.PlaceLabels
	data["filter_years"] = filterData.Years
	data["filter_year_labels"] = filterData.YearLabels
	data["filter_series"] = filterData.Series
	data["filter_series_labels"] = filterData.SeriesLabels
	data["selected_filter_labels"] = buildBaendeSelectedFilterLabels(filterData, status, person, user, yearStr, place, series)
	timer.Mark("filter_data")

	return data, nil
}

func buildBaendeSelectedFilterLabels(filterData *baendeFilterData, status, person, user, year, place, series string) map[string]string {
	labels := map[string]string{
		"status": "",
		"person": "",
		"user":   "",
		"year":   "",
		"place":  "",
		"series": "",
	}
	if filterData == nil {
		return labels
	}

	if status != "" {
		if label, ok := filterData.StatusLabels[status]; ok && label != "" {
			labels["status"] = label
		} else {
			labels["status"] = status
		}
	}
	if person != "" {
		if label, ok := filterData.AgentLabels[person]; ok && label != "" {
			labels["person"] = label
		} else {
			labels["person"] = person
		}
	}
	if user != "" {
		if label, ok := filterData.UserLabels[user]; ok && label != "" {
			labels["user"] = label
		} else {
			labels["user"] = user
		}
	}
	if year != "" {
		if label, ok := filterData.YearLabels[year]; ok && label != "" {
			labels["year"] = label
		} else {
			labels["year"] = year
		}
	}
	if place != "" {
		if label, ok := filterData.PlaceLabels[place]; ok && label != "" {
			labels["place"] = label
		} else {
			labels["place"] = place
		}
	}
	if series != "" {
		if label, ok := filterData.SeriesLabels[series]; ok && label != "" {
			labels["series"] = label
		} else {
			labels["series"] = series
		}
	}

	return labels
}

func selectBaendeSortedEntries(sortedEntries map[string][]*dbmodels.Entry, sort string) []*dbmodels.Entry {
	if sortedEntries == nil {
		return nil
	}
	if entries, ok := sortedEntries[sort]; ok && entries != nil {
		return entries
	}
	return sortedEntries["title"]
}

func requiresBaendeRuntimeSort(sort string) bool {
	switch sort {
	case "linked_places", "linked_persons":
		return true
	default:
		return false
	}
}

func sortBaendeEntries(entries []*dbmodels.Entry, sort string, itemsMap map[string][]*dbmodels.Item, entryPlaceLabels map[string][]string, entryAgentLabels map[string][]string) {
	switch sort {
	case "alm":
		dbmodels.Sort_Entries_MusenalmID(entries)
	case "year":
		dbmodels.Sort_Entries_Year_Title(entries)
	case "signatur":
		dbmodels.Sort_Entries_Signatur(entries, itemsMap)
	case "responsibility":
		dbmodels.Sort_Entries_Responsibility_Title(entries)
	case "place":
		dbmodels.Sort_Entries_Place_Title(entries)
	case "linked_places":
		sortBaendeEntriesByLabels(entries, entryPlaceLabels)
	case "linked_persons":
		sortBaendeEntriesByLabels(entries, entryAgentLabels)
	case "updated":
		dbmodels.Sort_Entries_Updated(entries)
	default:
		dbmodels.Sort_Entries_Title_Year(entries)
	}
}

func reverseBaendeEntries(entries []*dbmodels.Entry) []*dbmodels.Entry {
	reversed := make([]*dbmodels.Entry, len(entries))
	copy(reversed, entries)
	slices.Reverse(reversed)
	return reversed
}

func toAnyStrings(values []string) []any {
	res := make([]any, len(values))
	for i, value := range values {
		res[i] = value
	}
	return res
}

func buildBaendeFilterData(cache pagemodels.BaendeCacheInterface, entries []*dbmodels.Entry, agentsMap map[string]*dbmodels.Agent, usersMap map[string]*dbmodels.User, placesMap map[string]*dbmodels.Place, seriesMap map[string]*dbmodels.Series, entrySeriesMap map[string][]*dbmodels.REntriesSeries) *baendeFilterData {
	cachedAt := cache.GetCachedAt()

	baendeRequestCache.mu.RLock()
	if baendeRequestCache.filters != nil && baendeRequestCache.cachedAt.Equal(cachedAt) {
		defer baendeRequestCache.mu.RUnlock()
		return baendeRequestCache.filters
	}
	baendeRequestCache.mu.RUnlock()

	data := &baendeFilterData{
		Statuses:     buildStatusFilters(),
		StatusLabels: buildStatusLabelMap(),
		Agents:       buildAgentFilters(agentsMap),
		AgentLabels:  buildAgentLabelMap(agentsMap),
		Users:        buildUserFilters(usersMap),
		UserLabels:   buildUserLabelMap(usersMap),
		Places:       buildPlaceFilters(placesMap),
		PlaceLabels:  buildPlaceLabelMap(placesMap),
		Years:        buildYearFilters(entries),
		YearLabels:   buildYearLabelMap(entries),
		Series:       buildSeriesFilters(seriesMap, entrySeriesMap),
		SeriesLabels: buildSeriesLabelMap(seriesMap, entrySeriesMap),
	}

	baendeRequestCache.mu.Lock()
	baendeRequestCache.cachedAt = cachedAt
	baendeRequestCache.filters = data
	baendeRequestCache.mu.Unlock()

	return data
}

func buildBaendeLazyFilterData(ma pagemodels.IApp, kind string) (*baendeLazyFilterData, error) {
	filterData, err := loadBaendeFilterData(ma)
	if err != nil {
		return nil, err
	}

	switch kind {
	case "person":
		options := make([]baendeLazyFilterOption, 0, len(filterData.Agents))
		for _, agent := range filterData.Agents {
			if agent == nil {
				continue
			}
			option := baendeLazyFilterOption{
				Value: agent.Id,
				Label: agent.Name(),
			}
			if agent.CorporateBody() {
				option.Meta = "ORG"
				option.MetaIsBadge = true
			} else if agent.BiographicalData() != "" {
				option.Meta = agent.BiographicalData()
			}
			options = append(options, option)
		}
		return &baendeLazyFilterData{
			Kind:        kind,
			Title:       "Person",
			Placeholder: "Personen filtern...",
			SpinnerID:   "baende-person-spinner",
			Options:     options,
		}, nil
	case "user":
		options := make([]baendeLazyFilterOption, 0, len(filterData.Users))
		for _, user := range filterData.Users {
			if user == nil {
				continue
			}
			options = append(options, baendeLazyFilterOption{
				Value: user.Id,
				Label: user.Name(),
			})
		}
		return &baendeLazyFilterData{
			Kind:        kind,
			Title:       "Benutzer",
			Placeholder: "Benutzer filtern...",
			SpinnerID:   "baende-user-spinner",
			Options:     options,
		}, nil
	case "year":
		options := make([]baendeLazyFilterOption, 0, len(filterData.Years))
		for _, year := range filterData.Years {
			label := strconv.Itoa(year)
			if year == 0 {
				label = "ohne Jahr"
			}
			options = append(options, baendeLazyFilterOption{
				Value: strconv.Itoa(year),
				Label: label,
			})
		}
		return &baendeLazyFilterData{
			Kind:        kind,
			Title:       "Jahr",
			Placeholder: "Jahre filtern...",
			SpinnerID:   "baende-year-spinner",
			Options:     options,
		}, nil
	case "place":
		options := make([]baendeLazyFilterOption, 0, len(filterData.Places))
		for _, place := range filterData.Places {
			if place == nil {
				continue
			}
			options = append(options, baendeLazyFilterOption{
				Value: place.Id,
				Label: place.Name(),
			})
		}
		return &baendeLazyFilterData{
			Kind:        kind,
			Title:       "Ort",
			Placeholder: "Orte filtern...",
			SpinnerID:   "baende-place-spinner",
			Options:     options,
		}, nil
	case "series":
		options := make([]baendeLazyFilterOption, 0, len(filterData.Series))
		for _, series := range filterData.Series {
			if series == nil {
				continue
			}
			options = append(options, baendeLazyFilterOption{
				Value: series.Id,
				Label: series.Title(),
			})
		}
		return &baendeLazyFilterData{
			Kind:        kind,
			Title:       "Reihentitel",
			Placeholder: "Reihentitel filtern...",
			SpinnerID:   "baende-series-spinner",
			Options:     options,
		}, nil
	default:
		return nil, fmt.Errorf("unsupported baende filter kind %q", kind)
	}
}

func loadBaendeFilterData(ma pagemodels.IApp) (*baendeFilterData, error) {
	cacheInterface, err := ma.GetBaendeCache()
	if err != nil {
		return nil, err
	}

	allEntries, ok := cacheInterface.GetEntries().([]*dbmodels.Entry)
	if !ok {
		return nil, fmt.Errorf("failed to get entries from cache")
	}
	agentsMap, ok := cacheInterface.GetAgents().(map[string]*dbmodels.Agent)
	if !ok {
		return nil, fmt.Errorf("failed to get agents from cache")
	}
	usersMap, ok := cacheInterface.GetUsers().(map[string]*dbmodels.User)
	if !ok {
		return nil, fmt.Errorf("failed to get users from cache")
	}
	placesMap, ok := cacheInterface.GetPlaces().(map[string]*dbmodels.Place)
	if !ok {
		return nil, fmt.Errorf("failed to get places from cache")
	}
	seriesMap, ok := cacheInterface.GetSeries().(map[string]*dbmodels.Series)
	if !ok {
		return nil, fmt.Errorf("failed to get series from cache")
	}
	entrySeriesMap, ok := cacheInterface.GetEntriesSeries().(map[string][]*dbmodels.REntriesSeries)
	if !ok {
		return nil, fmt.Errorf("failed to get entries series from cache")
	}

	return buildBaendeFilterData(cacheInterface, allEntries, agentsMap, usersMap, placesMap, seriesMap, entrySeriesMap), nil
}

func (p *BaendePage) handleMore(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_BAENDE_LOGIN)
		}

		data, err := p.buildResultData(app, ma, e, req, false)
		if err != nil {
			return engine.Response404(e, err, data)
		}

		// Add header to indicate if more results exist
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

		return engine.Response200(e, URL_BAENDE_MORE, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

// filterEntriesBySearch performs in-memory filtering of entries by search term
func filterEntriesBySearch(entries []*dbmodels.Entry, itemsMap map[string][]*dbmodels.Item, search string) []*dbmodels.Entry {
	query := strings.ToLower(strings.TrimSpace(search))
	if query == "" {
		return entries
	}

	var results []*dbmodels.Entry
	for _, entry := range entries {
		if matchesShortSearch(entry, itemsMap, query) {
			results = append(results, entry)
			continue
		}
	}

	return results
}

func matchesShortSearch(entry *dbmodels.Entry, itemsMap map[string][]*dbmodels.Item, query string) bool {
	if strings.Contains(strings.ToLower(entry.PreferredTitle()), query) {
		return true
	}
	if strings.Contains(strings.ToLower(entry.TitleStmt()), query) {
		return true
	}
	if strings.Contains(strings.ToLower(entry.PlaceStmt()), query) {
		return true
	}
	if strings.Contains(strings.ToLower(entry.ResponsibilityStmt()), query) {
		return true
	}
	if strings.Contains(strconv.Itoa(entry.MusenalmID()), query) {
		return true
	}
	if items, ok := itemsMap[entry.Id]; ok {
		for _, item := range items {
			if strings.Contains(strings.ToLower(item.Identifier()), query) {
				return true
			}
		}
	}
	return false
}

// filterEntriesByLetter performs in-memory filtering of entries by first letter
func filterEntriesByLetter(entries []*dbmodels.Entry, letter string) []*dbmodels.Entry {
	letter = normalizeAdminLetter(letter)
	var results []*dbmodels.Entry
	for _, entry := range entries {
		preferredTitle := entry.PreferredTitle()
		if normalizedAdminInitial(preferredTitle) == letter {
			results = append(results, entry)
		}
	}
	return results
}

func searchBaendeEntries(app core.App, search string) ([]*dbmodels.Entry, error) {
	query := strings.TrimSpace(search)
	if query == "" {
		return []*dbmodels.Entry{}, nil
	}
	if utf8.RuneCountInString(query) < 3 {
		return searchBaendeEntriesQuick(app, query)
	}

	entries, err := searchBaendeEntriesFTS(app, query)
	if err != nil {
		app.Logger().Error("FTS search failed", "error", err)
		return nil, err
	}
	return entries, nil
}

func searchBaendeEntriesFTS(app core.App, query string) ([]*dbmodels.Entry, error) {
	entryIDs := map[string]struct{}{}
	terms := dbmodels.NormalizeQuery(query)

	entryRequests := dbmodels.IntoQueryRequests(dbmodels.ENTRIES_FTS5_FIELDS, terms)
	if len(entryRequests) > 0 {
		ids, err := dbmodels.FTS5Search(app, dbmodels.ENTRIES_TABLE, entryRequests...)
		if err != nil {
			return nil, err
		}
		for _, id := range ids {
			entryIDs[id.ID] = struct{}{}
		}
	}

	itemRequests := dbmodels.IntoQueryRequests([]string{dbmodels.ITEMS_IDENTIFIER_FIELD}, terms)
	if len(itemRequests) > 0 {
		ids, err := dbmodels.FTS5Search(app, dbmodels.ITEMS_TABLE, itemRequests...)
		if err != nil {
			return nil, err
		}
		itemIDs := []any{}
		for _, id := range ids {
			itemIDs = append(itemIDs, id.ID)
		}
		if len(itemIDs) > 0 {
			items, err := dbmodels.TableByIDs[*dbmodels.Item](app, dbmodels.ITEMS_TABLE, itemIDs)
			if err != nil {
				return nil, err
			}
			for _, item := range items {
				if item == nil {
					continue
				}
				if entryID := item.Entry(); entryID != "" {
					entryIDs[entryID] = struct{}{}
				}
			}
		}
	}

	if len(entryIDs) == 0 {
		return []*dbmodels.Entry{}, nil
	}

	entryIDList := []any{}
	for id := range entryIDs {
		entryIDList = append(entryIDList, id)
	}

	entries, err := dbmodels.Entries_IDs(app, entryIDList)
	if err != nil {
		return nil, err
	}
	dbmodels.Sort_Entries_Title_Year(entries)
	return entries, nil
}

func searchBaendeEntriesQuick(app core.App, query string) ([]*dbmodels.Entry, error) {
	trimmed := strings.TrimSpace(query)
	if trimmed == "" {
		return []*dbmodels.Entry{}, nil
	}
	if utf8.RuneCountInString(trimmed) == 1 {
		return []*dbmodels.Entry{}, nil
	}

	entryFields := []string{
		dbmodels.PREFERRED_TITLE_FIELD,
		dbmodels.MUSENALMID_FIELD,
	}

	entryConditions := make([]dbx.Expression, 0, len(entryFields))
	for _, field := range entryFields {
		entryConditions = append(entryConditions, dbx.Like(field, trimmed).Match(true, true))
	}

	entryIDs := map[string]struct{}{}
	if len(entryConditions) > 0 {
		entries := []*dbmodels.Entry{}
		if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
			Where(dbx.Or(entryConditions...)).
			All(&entries); err != nil {
			return nil, err
		}
		for _, entry := range entries {
			entryIDs[entry.Id] = struct{}{}
		}
	}

	itemConditions := []dbx.Expression{
		dbx.Like(dbmodels.ITEMS_IDENTIFIER_FIELD, trimmed).Match(true, true),
	}
	if len(itemConditions) > 0 {
		items := []*dbmodels.Item{}
		if err := app.RecordQuery(dbmodels.ITEMS_TABLE).
			Where(dbx.Or(itemConditions...)).
			All(&items); err != nil {
			return nil, err
		}
		for _, item := range items {
			if entryID := item.Entry(); entryID != "" {
				entryIDs[entryID] = struct{}{}
			}
		}
	}

	if len(entryIDs) == 0 {
		return []*dbmodels.Entry{}, nil
	}

	entryIDList := make([]any, 0, len(entryIDs))
	for id := range entryIDs {
		entryIDList = append(entryIDList, id)
	}

	entries, err := dbmodels.Entries_IDs(app, entryIDList)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Entries_Title_Year(entries)
	return entries, nil
}

func filterEntriesByStatus(entries []*dbmodels.Entry, status string) []*dbmodels.Entry {
	if status == "" {
		return entries
	}
	results := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		if entry.EditState() == status {
			results = append(results, entry)
		}
	}
	return results
}

func filterEntriesByAgent(entries []*dbmodels.Entry, entryAgentsMap map[string][]*dbmodels.REntriesAgents, agentID string) []*dbmodels.Entry {
	if agentID == "" {
		return entries
	}
	results := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		rels := entryAgentsMap[entry.Id]
		for _, rel := range rels {
			if rel.Agent() == agentID {
				results = append(results, entry)
				break
			}
		}
	}
	return results
}

func filterEntriesByYear(entries []*dbmodels.Entry, year int) []*dbmodels.Entry {
	results := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		if entry.Year() == year {
			results = append(results, entry)
		}
	}
	return results
}

func filterEntriesByPlace(entries []*dbmodels.Entry, placeID string) []*dbmodels.Entry {
	if placeID == "" {
		return entries
	}
	results := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		for _, pid := range entry.Places() {
			if pid == placeID {
				results = append(results, entry)
				break
			}
		}
	}
	return results
}

func filterEntriesByEditor(entries []*dbmodels.Entry, userID string) []*dbmodels.Entry {
	if userID == "" {
		return entries
	}
	results := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		if entry.Editor() == userID {
			results = append(results, entry)
		}
	}
	return results
}

func filterEntriesBySeries(entries []*dbmodels.Entry, entrySeriesMap map[string][]*dbmodels.REntriesSeries, seriesID string) []*dbmodels.Entry {
	if seriesID == "" {
		return entries
	}
	results := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		rels := entrySeriesMap[entry.Id]
		for _, rel := range rels {
			if rel.Series() == seriesID {
				results = append(results, entry)
				break
			}
		}
	}
	return results
}

func buildStatusFilters() []map[string]string {
	labels := buildStatusLabelMap()
	allowed := []string{"Unknown", "ToDo", "Review", "Seen", "Edited"}
	filters := make([]map[string]string, 0, len(allowed))
	for _, val := range allowed {
		label := val
		if mapped, ok := labels[val]; ok {
			label = mapped
		}
		filters = append(filters, map[string]string{
			"value": val,
			"label": label,
		})
	}
	return filters
}

func buildStatusLabelMap() map[string]string {
	return map[string]string{
		"Unknown": "Gesucht",
		"ToDo":    "Zu erledigen",
		"Review":  "Überprüfen",
		"Seen":    "Autopsiert",
		"Edited":  "Vollständig Erfasst",
	}
}

func buildAgentFilters(agentsMap map[string]*dbmodels.Agent) []*dbmodels.Agent {
	agents := make([]*dbmodels.Agent, 0, len(agentsMap))
	for _, agent := range agentsMap {
		agents = append(agents, agent)
	}
	dbmodels.Sort_Agents_Name(agents)
	return agents
}

func buildAgentLabelMap(agentsMap map[string]*dbmodels.Agent) map[string]string {
	labels := make(map[string]string, len(agentsMap))
	for id, agent := range agentsMap {
		if agent != nil {
			labels[id] = agent.Name()
		}
	}
	return labels
}

func buildUserFilters(usersMap map[string]*dbmodels.User) []*dbmodels.User {
	users := make([]*dbmodels.User, 0, len(usersMap))
	for _, user := range usersMap {
		users = append(users, user)
	}
	dbmodels.Sort_Users_Name(users)
	return users
}

func buildUserLabelMap(usersMap map[string]*dbmodels.User) map[string]string {
	labels := make(map[string]string, len(usersMap))
	for id, user := range usersMap {
		if user != nil {
			labels[id] = user.Name()
		}
	}
	return labels
}

func buildPlaceFilters(placesMap map[string]*dbmodels.Place) []*dbmodels.Place {
	places := make([]*dbmodels.Place, 0, len(placesMap))
	for _, place := range placesMap {
		places = append(places, place)
	}
	dbmodels.Sort_Places_Name(places)
	return places
}

func buildPlaceLabelMap(placesMap map[string]*dbmodels.Place) map[string]string {
	labels := make(map[string]string, len(placesMap))
	for id, place := range placesMap {
		if place != nil {
			labels[id] = place.Name()
		}
	}
	return labels
}

func buildYearFilters(entries []*dbmodels.Entry) []int {
	yearSet := map[int]struct{}{}
	for _, entry := range entries {
		yearSet[entry.Year()] = struct{}{}
	}
	years := make([]int, 0, len(yearSet))
	for year := range yearSet {
		years = append(years, year)
	}
	slices.Sort(years)
	return years
}

func buildYearLabelMap(entries []*dbmodels.Entry) map[string]string {
	labels := map[string]string{}
	for _, entry := range entries {
		year := entry.Year()
		if _, ok := labels[strconv.Itoa(year)]; ok {
			continue
		}
		if year == 0 {
			labels[strconv.Itoa(year)] = "ohne Jahr"
		} else {
			labels[strconv.Itoa(year)] = strconv.Itoa(year)
		}
	}
	return labels
}

func buildSeriesFilters(seriesMap map[string]*dbmodels.Series, entrySeriesMap map[string][]*dbmodels.REntriesSeries) []*dbmodels.Series {
	usedSeries := map[string]*dbmodels.Series{}
	for _, rels := range entrySeriesMap {
		for _, rel := range rels {
			if rel == nil {
				continue
			}
			series := seriesMap[rel.Series()]
			if series == nil {
				continue
			}
			usedSeries[series.Id] = series
		}
	}

	series := make([]*dbmodels.Series, 0, len(usedSeries))
	for _, s := range usedSeries {
		series = append(series, s)
	}
	dbmodels.Sort_Series_Title(series)
	return series
}

func buildSeriesLabelMap(seriesMap map[string]*dbmodels.Series, entrySeriesMap map[string][]*dbmodels.REntriesSeries) map[string]string {
	labels := map[string]string{}
	for _, series := range buildSeriesFilters(seriesMap, entrySeriesMap) {
		if series != nil {
			labels[series.Id] = series.Title()
		}
	}
	return labels
}

func buildBaendeSeriesLinksMap(entries []*dbmodels.Entry, seriesMap map[string]*dbmodels.Series, entrySeriesMap map[string][]*dbmodels.REntriesSeries) map[string][]*BaendeSeriesLink {
	linksMap := make(map[string][]*BaendeSeriesLink, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		linksMap[entry.Id] = buildBaendeSeriesLinks(seriesMap, entrySeriesMap[entry.Id])
	}
	return linksMap
}

func buildBaendeSeriesLinks(seriesMap map[string]*dbmodels.Series, rels []*dbmodels.REntriesSeries) []*BaendeSeriesLink {
	links := make([]*BaendeSeriesLink, 0, len(rels))
	for _, rel := range rels {
		if rel == nil {
			continue
		}
		series := seriesMap[rel.Series()]
		if series == nil {
			continue
		}
		links = append(links, &BaendeSeriesLink{
			Series:   series,
			Relation: rel,
		})
	}

	collator := collate.New(language.German)
	slices.SortFunc(links, func(i, j *BaendeSeriesLink) int {
		iPreferred := i.Relation != nil && i.Relation.Type() == preferredSeriesRelationType
		jPreferred := j.Relation != nil && j.Relation.Type() == preferredSeriesRelationType
		if iPreferred != jPreferred {
			if iPreferred {
				return -1
			}
			return 1
		}
		return collator.CompareString(i.Series.Title(), j.Series.Title())
	})

	return links
}

func buildBaendePlaceLabelsMap(entries []*dbmodels.Entry, placesMap map[string]*dbmodels.Place) map[string][]string {
	labelsByEntry := make(map[string][]string, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		labelsByEntry[entry.Id] = collectBaendePlaceLabels(entry, placesMap)
	}
	return labelsByEntry
}

func buildBaendePlaceLabelsDisplayMap(entries []*dbmodels.Entry, displayApp *musapp.App) map[string][]string {
	labelsByEntry := make(map[string][]string, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		labels := make([]string, 0, len(entry.Places()))
		seen := make(map[string]struct{}, len(entry.Places()))
		for _, placeID := range entry.Places() {
			if placeID == "" {
				continue
			}
			display := displayApp.GetPlaceDisplay(placeID)
			if display == nil || strings.TrimSpace(display.Name) == "" {
				continue
			}
			if _, ok := seen[display.ID]; ok {
				continue
			}
			seen[display.ID] = struct{}{}
			labels = append(labels, display.Name)
		}
		sortGermanStrings(labels)
		labelsByEntry[entry.Id] = labels
	}
	return labelsByEntry
}

func buildBaendePlaceLinksMap(entries []*dbmodels.Entry, placesMap map[string]*dbmodels.Place) map[string][]*BaendeRelationLink {
	linksByEntry := make(map[string][]*BaendeRelationLink, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		linksByEntry[entry.Id] = collectBaendePlaceLinks(entry, placesMap)
	}
	return linksByEntry
}

func collectBaendePlaceLabels(entry *dbmodels.Entry, placesMap map[string]*dbmodels.Place) []string {
	if entry == nil {
		return nil
	}
	labels := make([]string, 0, len(entry.Places()))
	seen := make(map[string]struct{}, len(entry.Places()))
	for _, placeID := range entry.Places() {
		if placeID == "" {
			continue
		}
		place := placesMap[placeID]
		if place == nil || place.Name() == "" {
			continue
		}
		label := place.Name()
		if _, ok := seen[label]; ok {
			continue
		}
		seen[label] = struct{}{}
		labels = append(labels, label)
	}
	sortGermanStrings(labels)
	return labels
}

func collectBaendePlaceLinks(entry *dbmodels.Entry, placesMap map[string]*dbmodels.Place) []*BaendeRelationLink {
	if entry == nil {
		return nil
	}
	links := make([]*BaendeRelationLink, 0, len(entry.Places()))
	seen := make(map[string]struct{}, len(entry.Places()))
	for _, placeID := range entry.Places() {
		if placeID == "" {
			continue
		}
		place := placesMap[placeID]
		if place == nil || place.Name() == "" {
			continue
		}
		if _, ok := seen[place.Id]; ok {
			continue
		}
		seen[place.Id] = struct{}{}
		links = append(links, &BaendeRelationLink{
			ID:    place.Id,
			Label: place.Name(),
		})
	}
	sortBaendeRelationLinks(links)
	return links
}

func buildBaendeAgentLabelsMap(entries []*dbmodels.Entry, entryAgentsMap map[string][]*dbmodels.REntriesAgents, agentsMap map[string]*dbmodels.Agent) map[string][]string {
	labelsByEntry := make(map[string][]string, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		labelsByEntry[entry.Id] = collectBaendeAgentLabels(entryAgentsMap[entry.Id], agentsMap)
	}
	return labelsByEntry
}

func buildBaendeAgentLabelsDisplayMap(entries []*dbmodels.Entry, entryAgentsMap map[string][]*dbmodels.REntriesAgents, displayApp *musapp.App) map[string][]string {
	labelsByEntry := make(map[string][]string, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		labels := make([]string, 0, len(entryAgentsMap[entry.Id]))
		seen := make(map[string]struct{}, len(entryAgentsMap[entry.Id]))
		for _, rel := range entryAgentsMap[entry.Id] {
			if rel == nil {
				continue
			}
			display := displayApp.GetAgentDisplay(rel.Agent())
			if display == nil || strings.TrimSpace(display.Name) == "" {
				continue
			}
			if _, ok := seen[display.ID]; ok {
				continue
			}
			seen[display.ID] = struct{}{}
			labels = append(labels, display.Name)
		}
		sortGermanStrings(labels)
		labelsByEntry[entry.Id] = labels
	}
	return labelsByEntry
}

func buildBaendeAgentLinksMap(entries []*dbmodels.Entry, entryAgentsMap map[string][]*dbmodels.REntriesAgents, agentsMap map[string]*dbmodels.Agent) map[string][]*BaendeRelationLink {
	linksByEntry := make(map[string][]*BaendeRelationLink, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		linksByEntry[entry.Id] = collectBaendeAgentLinks(entryAgentsMap[entry.Id], agentsMap)
	}
	return linksByEntry
}

func collectBaendeAgentLabels(rels []*dbmodels.REntriesAgents, agentsMap map[string]*dbmodels.Agent) []string {
	labels := make([]string, 0, len(rels))
	seen := make(map[string]struct{}, len(rels))
	for _, rel := range rels {
		if rel == nil {
			continue
		}
		agent := agentsMap[rel.Agent()]
		if agent == nil || agent.Name() == "" {
			continue
		}
		label := agent.Name()
		if _, ok := seen[label]; ok {
			continue
		}
		seen[label] = struct{}{}
		labels = append(labels, label)
	}
	sortGermanStrings(labels)
	return labels
}

func collectBaendeAgentLinks(rels []*dbmodels.REntriesAgents, agentsMap map[string]*dbmodels.Agent) []*BaendeRelationLink {
	links := make([]*BaendeRelationLink, 0, len(rels))
	seen := make(map[string]struct{}, len(rels))
	for _, rel := range rels {
		if rel == nil {
			continue
		}
		agent := agentsMap[rel.Agent()]
		if agent == nil || agent.Name() == "" {
			continue
		}
		if _, ok := seen[agent.Id]; ok {
			continue
		}
		seen[agent.Id] = struct{}{}
		links = append(links, &BaendeRelationLink{
			ID:    agent.Id,
			Label: agent.Name(),
		})
	}
	sortBaendeRelationLinks(links)
	return links
}

func sortBaendeEntriesByLabels(entries []*dbmodels.Entry, labelsByEntry map[string][]string) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(a, b *dbmodels.Entry) int {
		aLabel := baendeJoinedLabels(labelsByEntry[a.Id])
		bLabel := baendeJoinedLabels(labelsByEntry[b.Id])
		if cmp := collator.CompareString(aLabel, bLabel); cmp != 0 {
			return cmp
		}
		return compareBaendeTitles(collator, a, b)
	})
}

func baendeJoinedLabels(labels []string) string {
	if len(labels) == 0 {
		return ""
	}
	return strings.Join(labels, " | ")
}

func compareBaendeTitles(collator *collate.Collator, a, b *dbmodels.Entry) int {
	aTitle := baendeSortTitle(a)
	bTitle := baendeSortTitle(b)
	if cmp := collator.CompareString(aTitle, bTitle); cmp != 0 {
		return cmp
	}
	if a.Year() != b.Year() {
		if a.Year() < b.Year() {
			return -1
		}
		return 1
	}
	return collator.CompareString(a.MusenalmIDString(), b.MusenalmIDString())
}

func baendeSortTitle(entry *dbmodels.Entry) string {
	if entry == nil {
		return ""
	}
	if title := strings.TrimSpace(entry.PreferredTitle()); title != "" {
		return title
	}
	if title := strings.TrimSpace(entry.TitleStmt()); title != "" {
		return title
	}
	return entry.MusenalmIDString()
}

func sortGermanStrings(values []string) {
	collator := collate.New(language.German)
	slices.SortFunc(values, func(a, b string) int {
		return collator.CompareString(a, b)
	})
}

func sortBaendeRelationLinks(links []*BaendeRelationLink) {
	collator := collate.New(language.German)
	slices.SortFunc(links, func(a, b *BaendeRelationLink) int {
		return collator.CompareString(a.Label, b.Label)
	})
}
