package controllers

import (
	"net/url"
	"slices"
	"strconv"
	"strings"

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
	REIHEN_ADMIN_PAGE_SIZE = 80
)

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

func (p *ReihenAdminPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_REIHEN_ADMIN)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app))
	rg.GET("results/", p.handleResults(engine, app))
	rg.GET("more/", p.handleMore(engine, app))
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
		return engine.Response200(e, p.Template, data, p.Layout)
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

		return engine.Response200(e, URL_REIHEN_ADMIN_MORE, data, pagemodels.LAYOUT_FRAGMENT)
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

func (p *ReihenAdminPage) buildResultData(app core.App, e *core.RequestEvent, req *templating.Request, showAggregated bool) (map[string]any, error) {
	data := map[string]any{}

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

	allSeries := []*dbmodels.Series{}
	if err := app.RecordQuery(dbmodels.SERIES_TABLE).All(&allSeries); err != nil {
		return data, err
	}

	seriesIDs := dbmodels.Ids(allSeries)
	relations, err := dbmodels.REntriesSeries_Seriess(app, seriesIDs)
	if err != nil {
		return data, err
	}

	entryIDsSet := map[string]struct{}{}
	seriesEntriesMap := make(map[string][]*dbmodels.REntriesSeries)
	for _, rel := range relations {
		if rel == nil {
			continue
		}
		seriesEntriesMap[rel.Series()] = append(seriesEntriesMap[rel.Series()], rel)
		if rel.Entry() != "" {
			entryIDsSet[rel.Entry()] = struct{}{}
		}
	}

	entryIDs := make([]any, 0, len(entryIDsSet))
	for id := range entryIDsSet {
		entryIDs = append(entryIDs, id)
	}

	entriesMap := map[string]*dbmodels.Entry{}
	if len(entryIDs) > 0 {
		entries, err := dbmodels.Entries_IDs(app, entryIDs)
		if err != nil {
			return data, err
		}
		for _, entry := range entries {
			if entry == nil {
				continue
			}
			entriesMap[entry.Id] = entry
		}
	}

	for seriesID, rels := range seriesEntriesMap {
		seriesEntriesMap[seriesID] = sortSeriesRelationsForAdmin(rels, entriesMap)
	}

	agentMap := map[string]*dbmodels.Agent{}
	entryAgentsMap := map[string][]*dbmodels.REntriesAgents{}
	if len(entryIDs) > 0 {
		agents, agentRelations, err := Agents_Entries_IDs(app, entryIDs)
		if err != nil {
			return data, err
		}
		for _, agent := range agents {
			if agent == nil {
				continue
			}
			agentMap[agent.Id] = agent
		}
		for _, rel := range agentRelations {
			if rel == nil {
				continue
			}
			entryAgentsMap[rel.Entry()] = append(entryAgentsMap[rel.Entry()], rel)
		}
	}

	placeIDsSet := map[string]struct{}{}
	yearSet := map[int]struct{}{}
	for _, entry := range entriesMap {
		if entry == nil {
			continue
		}
		yearSet[entry.Year()] = struct{}{}
		for _, placeID := range entry.Places() {
			if placeID != "" {
				placeIDsSet[placeID] = struct{}{}
			}
		}
	}

	placeMap := map[string]*dbmodels.Place{}
	if len(placeIDsSet) > 0 {
		placeIDs := make([]any, 0, len(placeIDsSet))
		for id := range placeIDsSet {
			placeIDs = append(placeIDs, id)
		}
		places, err := dbmodels.Places_IDs(app, placeIDs)
		if err != nil {
			return data, err
		}
		for _, place := range places {
			if place == nil {
				continue
			}
			placeMap[place.Id] = place
		}
	}

	userMap := map[string]*dbmodels.User{}
	userIDsSet := map[string]struct{}{}
	for _, series := range allSeries {
		if series == nil || series.Editor() == "" {
			continue
		}
		userIDsSet[series.Editor()] = struct{}{}
	}
	if len(userIDsSet) > 0 {
		userIDs := make([]any, 0, len(userIDsSet))
		for id := range userIDsSet {
			userIDs = append(userIDs, id)
		}
		users, err := dbmodels.TableByIDs[*dbmodels.User](app, dbmodels.USERS_TABLE, userIDs)
		if err != nil {
			return data, err
		}
		for _, user := range users {
			if user == nil {
				continue
			}
			userMap[user.Id] = user
		}
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

	filteredSeries := allSeries
	if search != "" {
		searchIDs, err := searchAdminSeriesIDs(app, search)
		if err != nil {
			return data, err
		}
		filteredSeries = filterSeriesBySearchIDs(filteredSeries, searchIDs)
	}
	if letter != "" {
		filteredSeries = filterSeriesByLetter(filteredSeries, letter)
	}
	if person != "" {
		filteredSeries = filterSeriesByAgent(filteredSeries, seriesEntriesMap, entryAgentsMap, person)
	}
	if place != "" {
		filteredSeries = filterSeriesByPlace(filteredSeries, seriesEntriesMap, entriesMap, place)
	}
	if yearStr != "" {
		yearVal, err := strconv.Atoi(yearStr)
		if err != nil {
			filteredSeries = []*dbmodels.Series{}
		} else {
			filteredSeries = filterSeriesByYear(filteredSeries, seriesEntriesMap, entriesMap, yearVal)
		}
	}

	sortAdminSeries(filteredSeries, sortField, sortOrder, userMap)

	totalCount := len(filteredSeries)
	var pageSeries []*dbmodels.Series
	nextOffset := offset
	hasMore := false
	currentCount := 0

	if showAggregated {
		displayLimit := offset + REIHEN_ADMIN_PAGE_SIZE
		if displayLimit > totalCount {
			displayLimit = totalCount
		}
		if displayLimit < 0 {
			displayLimit = 0
		}
		pageSeries = filteredSeries[:displayLimit]
		nextOffset = displayLimit
		currentCount = len(pageSeries)
		hasMore = displayLimit < totalCount
	} else {
		start := offset
		if start < 0 {
			start = 0
		}
		if start > totalCount {
			start = totalCount
		}
		endIndex := start + REIHEN_ADMIN_PAGE_SIZE
		if endIndex > totalCount {
			endIndex = totalCount
		}
		pageSeries = filteredSeries[start:endIndex]
		nextOffset = endIndex
		currentCount = start + len(pageSeries)
		hasMore = endIndex < totalCount
	}

	data["result"] = &ReihenAdminResult{
		Series:        pageSeries,
		Entries:       entriesMap,
		SeriesEntries: seriesEntriesMap,
		BandLinks:     buildReihenBandLinksMap(pageSeries, entriesMap, seriesEntriesMap),
		Users:         userMap,
	}
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
	data["filter_agents"] = buildAdminReihenAgentFilters(agentMap)
	data["filter_agent_labels"] = buildAdminReihenAgentLabelMap(agentMap)
	data["filter_places"] = buildAdminReihenPlaceFilters(placeMap)
	data["filter_place_labels"] = buildAdminReihenPlaceLabelMap(placeMap)
	data["filter_years"] = buildAdminReihenYearFilters(yearSet)
	data["filter_year_labels"] = buildAdminReihenYearLabelMap(yearSet)

	return data, nil
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
		entries := []*dbmodels.Entry{}
		err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
			Where(dbx.HashExp{dbmodels.MUSENALMID_FIELD: search}).
			All(&entries)
		if err != nil {
			return nil, err
		}
		if len(entries) > 0 {
			idSeries, _, err := Series_Entries(app, entries)
			if err != nil {
				return nil, err
			}
			for _, series := range idSeries {
				if series != nil {
					result[series.Id] = struct{}{}
				}
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
