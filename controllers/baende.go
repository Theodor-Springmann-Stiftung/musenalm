package controllers

import (
	"fmt"
	"net/url"
	"slices"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"

	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_BAENDE         = "/baende/"
	URL_BAENDE_RESULTS = "/baende/results/"
	URL_BAENDE_MORE    = "/baende/more/"
	TEMPLATE_BAENDE    = "/baende/"
	URL_BAENDE_DETAILS = "/baende/details/{id}"
	BAENDE_PAGE_SIZE   = 150
)

func init() {
	bp := &BaendePage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_BAENDE_NAME,
			URL:      URL_BAENDE,
			Template: TEMPLATE_BAENDE,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
		},
	}
	app.Register(bp)
}

type BaendePage struct {
	pagemodels.StaticPage
}

type BaendeResult struct {
	Entries       []*dbmodels.Entry
	Series        map[string]*dbmodels.Series
	EntriesSeries map[string][]*dbmodels.REntriesSeries
	Places        map[string]*dbmodels.Place
	Agents        map[string]*dbmodels.Agent
	EntriesAgents map[string][]*dbmodels.REntriesAgents
	Items         map[string][]*dbmodels.Item
}

type BaendeDetailsResult struct {
	Entry      *dbmodels.Entry
	Series     []*dbmodels.Series
	Places     []*dbmodels.Place
	Agents     []*dbmodels.Agent
	Items      []*dbmodels.Item
	SeriesRels []*dbmodels.REntriesSeries
	AgentRels  []*dbmodels.REntriesAgents
	IsAdmin    bool
	CSRFToken  string
}

func (p *BaendePage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_BAENDE)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app, ia))
	rg.GET("results/", p.handleResults(engine, app, ia))
	rg.GET("more/", p.handleMore(engine, app, ia))
	rg.GET("details/{id}", p.handleDetails(engine, app))
	rg.GET("row/{id}", p.handleRow(engine, app))
	return nil
}

func (p *BaendePage) handlePage(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, "/login/?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, ma, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *BaendePage) handleResults(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, "/login/?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, ma, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, URL_BAENDE_RESULTS, data, "fragment")
	}
}

func (p *BaendePage) handleRow(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, "/login/")
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
			app.Logger().Error("Failed to get items for entry", "error", err)
		}

		data := map[string]any{
			"entry":      entry,
			"items":      items,
			"is_admin":   req.IsAdmin(),
			"csrf_token": req.Session().Token,
		}

		return engine.Response200(e, "/baende/row/", data, "fragment")
	}
}

func (p *BaendePage) handleDetails(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, "/login/")
		}

		id := e.Request.PathValue("id")
		if id == "" {
			return engine.Response404(e, nil, nil)
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		entryIDs := []any{entry.Id}

		series, relations, err := Series_Entries(app, []*dbmodels.Entry{entry})
		if err != nil {
			app.Logger().Error("Failed to get series for entry", "error", err)
		}

		agents, arelations, err := Agents_Entries_IDs(app, entryIDs)
		if err != nil {
			app.Logger().Error("Failed to get agents for entry", "error", err)
		}

		toStringAny := func(ss []string) []any {
			res := make([]any, len(ss))
			for i, s := range ss {
				res[i] = s
			}
			return res
		}

		places, err := dbmodels.Places_IDs(app, toStringAny(entry.Places()))
		if err != nil {
			app.Logger().Error("Failed to get places for entry", "error", err)
		}

		items, err := dbmodels.Items_Entry(app, entry.Id)
		if err != nil {
			app.Logger().Error("Failed to get items for entry", "error", err)
		}

		data := map[string]any{
			"result": &BaendeDetailsResult{
				Entry:      entry,
				Series:     series,
				Places:     places,
				Agents:     agents,
				Items:      items,
				SeriesRels: relations,
				AgentRels:  arelations,
				IsAdmin:    req.IsAdmin(),
				CSRFToken:  req.Session().Token,
			},
		}

		return engine.Response200(e, "/baende/details/", data, "fragment")
	}
}

func (p *BaendePage) buildResultData(app core.App, ma pagemodels.IApp, e *core.RequestEvent, req *templating.Request, showAggregated bool) (map[string]any, error) {
	data := map[string]any{}

	// Get offset from query params (default 0)
	offset := 0
	if offsetStr := e.Request.URL.Query().Get("offset"); offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil && val >= 0 {
			offset = val
		}
	}

	// Get filters from query params
	search := strings.TrimSpace(e.Request.URL.Query().Get("search"))
	letter := strings.ToUpper(strings.TrimSpace(e.Request.URL.Query().Get("letter")))
	status := strings.TrimSpace(e.Request.URL.Query().Get("status"))
	person := strings.TrimSpace(e.Request.URL.Query().Get("person"))
	yearStr := strings.TrimSpace(e.Request.URL.Query().Get("year"))
	place := strings.TrimSpace(e.Request.URL.Query().Get("place"))

	// Validate letter
	if letter != "" {
		if len(letter) > 1 {
			letter = letter[:1]
		}
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
	}
	if !validSorts[sort] {
		sort = "title" // default
	}

	// Validate order
	if order != "asc" && order != "desc" {
		order = "asc" // default
	}

	// Load from cache
	cacheInterface, err := ma.GetBaendeCache()
	if err != nil {
		return data, err
	}

	// Extract data from cache using interface methods
	allEntries, ok := cacheInterface.GetEntries().([]*dbmodels.Entry)
	if !ok {
		return data, fmt.Errorf("failed to get entries from cache")
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

	// Determine active filter (only one at a time)
	activeFilterType := ""
	activeFilterValue := ""
	switch {
	case status != "":
		activeFilterType = "status"
		activeFilterValue = status
		person = ""
		yearStr = ""
		place = ""
	case person != "":
		activeFilterType = "person"
		activeFilterValue = person
		yearStr = ""
		place = ""
	case yearStr != "":
		activeFilterType = "year"
		activeFilterValue = yearStr
		place = ""
	case place != "":
		activeFilterType = "place"
		activeFilterValue = place
	}
	if activeFilterType != "" {
		search = ""
		letter = ""
	}

	// Apply search/letter/filters
	var filteredEntries []*dbmodels.Entry
	if activeFilterType != "" {
		switch activeFilterType {
		case "status":
			filteredEntries = filterEntriesByStatus(allEntries, status)
		case "person":
			filteredEntries = filterEntriesByAgent(allEntries, entryAgentsMap, person)
		case "year":
			yearVal, err := strconv.Atoi(yearStr)
			if err != nil {
				filteredEntries = []*dbmodels.Entry{}
			} else {
				filteredEntries = filterEntriesByYear(allEntries, yearVal)
			}
		case "place":
			filteredEntries = filterEntriesByPlace(allEntries, place)
		}
	} else if search != "" {
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
	} else if letter != "" {
		// Apply letter filter
		filteredEntries = filterEntriesByLetter(allEntries, letter)
	} else {
		filteredEntries = allEntries
	}

	// Apply sorting based on sort parameter
	switch sort {
	case "alm":
		dbmodels.Sort_Entries_MusenalmID(filteredEntries)
	case "year":
		dbmodels.Sort_Entries_Year_Title(filteredEntries)
	case "signatur":
		dbmodels.Sort_Entries_Signatur(filteredEntries, itemsMap)
	case "responsibility":
		dbmodels.Sort_Entries_Responsibility_Title(filteredEntries)
	case "place":
		dbmodels.Sort_Entries_Place_Title(filteredEntries)
	default: // "title"
		dbmodels.Sort_Entries_Title_Year(filteredEntries)
	}

	// Reverse for descending order
	if order == "desc" {
		slices.Reverse(filteredEntries)
	}

	// Calculate pagination
	totalCount := len(filteredEntries)
	var pageEntries []*dbmodels.Entry
	nextOffset := offset
	hasMore := false
	currentCount := 0

	if showAggregated {
		displayLimit := offset + BAENDE_PAGE_SIZE
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
		start := offset
		if start < 0 {
			start = 0
		}
		if start > totalCount {
			start = totalCount
		}
		endIndex := start + BAENDE_PAGE_SIZE
		if endIndex > totalCount {
			endIndex = totalCount
		}
		pageEntries = filteredEntries[start:endIndex]
		nextOffset = endIndex
		currentCount = start + len(pageEntries)
		hasMore = endIndex < totalCount
	}

	// Build result with cached associated data
	data["result"] = &BaendeResult{
		Entries:       pageEntries,
		Series:        seriesMap,
		EntriesSeries: entrySeriesMap,
		Places:        placesMap,
		Agents:        agentsMap,
		EntriesAgents: entryAgentsMap,
		Items:         itemsMap,
	}
	data["offset"] = offset
	data["total_count"] = totalCount
	data["current_count"] = currentCount
	data["has_more"] = hasMore
	data["next_offset"] = nextOffset
	data["letter"] = letter
	data["sort_field"] = sort
	data["sort_order"] = order
	data["csrf_token"] = req.Session().Token
	data["active_filter_type"] = activeFilterType
	data["active_filter_value"] = activeFilterValue

	// Keep letters array for navigation
	letters := []string{
		"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
		"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	}
	data["letters"] = letters

	// Build filter lists
	data["filter_statuses"] = buildStatusFilters()
	data["filter_status_labels"] = buildStatusLabelMap()
	data["filter_agents"] = buildAgentFilters(agentsMap)
	data["filter_agent_labels"] = buildAgentLabelMap(agentsMap)
	data["filter_places"] = buildPlaceFilters(placesMap)
	data["filter_place_labels"] = buildPlaceLabelMap(placesMap)
	data["filter_years"] = buildYearFilters(allEntries)
	data["filter_year_labels"] = buildYearLabelMap(allEntries)

	return data, nil
}

func (p *BaendePage) handleMore(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, "/login/")
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

		return engine.Response200(e, URL_BAENDE_MORE, data, "fragment")
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
	var results []*dbmodels.Entry
	for _, entry := range entries {
		preferredTitle := entry.PreferredTitle()
		if len(preferredTitle) > 0 && strings.HasPrefix(strings.ToUpper(preferredTitle), letter) {
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

	itemRequests := dbmodels.IntoQueryRequests(dbmodels.ITEMS_FTS5_FIELDS, terms)
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
