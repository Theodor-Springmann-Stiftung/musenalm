package controllers

import (
	"fmt"
	"html"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"unicode/utf8"

	musapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	BEITRAEGE_ADMIN_PAGE_SIZE = 80
)

var adminBeitraegeAnnotationTags = regexp.MustCompile(`<[^>]+>`)

type BeitraegeAdminPage struct {
	pagemodels.StaticPage
}

type BeitraegeAdminResult struct {
	Groups []*BeitraegeAdminGroup
}

type BeitraegeAdminGroup struct {
	Entry *dbmodels.Entry
	Rows  []*BeitraegeAdminRow
}

type BeitraegeAdminRow struct {
	Content           *dbmodels.Content
	AgentDisplays     []*ContentAgentDisplay
	AnnotationPreview string
}

type beitraegeFilterData struct {
	Entries      []beitraegeLazyFilterOption
	EntryLabels  map[string]string
	Agents       []beitraegeLazyFilterOption
	AgentLabels  map[string]string
	Years        []int
	YearLabels   map[string]string
	Types        []string
	TypeLabels   map[string]string
	Statuses     []string
	StatusLabels map[string]string
	ScansLabels  map[string]string
}

type beitraegeLazyFilterOption struct {
	Value       string
	Label       string
	Meta        string
	MetaIsBadge bool
}

type beitraegeLazyFilterData struct {
	Kind        string
	Title       string
	Placeholder string
	SpinnerID   string
	Options     []beitraegeLazyFilterOption
}

func init() {
	bp := &BeitraegeAdminPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_BEITRAEGE_NAME,
			URL:      URL_BEITRAEGE_ADMIN,
			Template: TEMPLATE_BEITRAEGE_ADMIN,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	musapp.Register(bp)
}

func (p *BeitraegeAdminPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_BEITRAEGE_ADMIN)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app, ia))
	rg.GET("results/", p.handleResults(engine, app, ia))
	rg.GET("more/", p.handleMore(engine, app, ia))
	rg.GET("filters/{kind}/", p.handleFilterOptions(engine, app, ia))
	return nil
}

func (p *BeitraegeAdminPage) handlePage(engine *templating.Engine, app core.App, ia pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, ia, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["include_count_oob"] = false
		return engine.Response200(e, p.Template, data, adminPageLayout(e, p.Layout))
	}
}

func (p *BeitraegeAdminPage) handleResults(engine *templating.Engine, app core.App, ia pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, ia, e, req, true)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["include_count_oob"] = true
		return engine.Response200(e, URL_BEITRAEGE_RESULTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *BeitraegeAdminPage) handleMore(engine *templating.Engine, app core.App, ia pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, ia, e, req, false)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["include_count_oob"] = false

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

		return engine.Response200(e, TEMPLATE_BEITRAEGE_MORE, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *BeitraegeAdminPage) handleFilterOptions(engine *templating.Engine, app core.App, ia pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_LOGIN)
		}

		data, err := buildBeitraegeLazyFilterData(app, ia, e.Request.PathValue("kind"))
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		return engine.Response200(e, TEMPLATE_BEITRAEGE_FILTERS, map[string]any{
			"Kind":        data.Kind,
			"Title":       data.Title,
			"Placeholder": data.Placeholder,
			"SpinnerID":   data.SpinnerID,
			"Options":     data.Options,
		}, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *BeitraegeAdminPage) buildResultData(app core.App, ia pagemodels.IApp, e *core.RequestEvent, req *templating.Request, showAggregated bool) (data map[string]any, err error) {
	data = map[string]any{}
	timer := newAdminRequestTimer(app, e, "beitraege", showAggregated)
	defer func() {
		timer.Finish(err)
	}()

	displayApp, ok := ia.(*musapp.App)
	if !ok {
		return data, fmt.Errorf("unexpected app type %T", ia)
	}

	offset := 0
	if offsetStr := strings.TrimSpace(e.Request.URL.Query().Get("offset")); offsetStr != "" {
		if value, convErr := strconv.Atoi(offsetStr); convErr == nil && value >= 0 {
			offset = value
		}
	}
	sortField := strings.ToLower(strings.TrimSpace(e.Request.URL.Query().Get("sort")))
	switch sortField {
	case "title", "year":
	default:
		sortField = "title"
	}

	search := strings.TrimSpace(e.Request.URL.Query().Get("search"))
	entryFilter := strings.TrimSpace(e.Request.URL.Query().Get("entry"))
	year := strings.TrimSpace(e.Request.URL.Query().Get("year"))
	person := strings.TrimSpace(e.Request.URL.Query().Get("person"))
	contentType := strings.TrimSpace(e.Request.URL.Query().Get("type"))
	status := strings.TrimSpace(e.Request.URL.Query().Get("status"))
	scans := strings.TrimSpace(e.Request.URL.Query().Get("scans"))
	if scans != "" && scans != "with" && scans != "without" {
		scans = ""
	}
	timer.Mark("params")

	cacheInterface, err := ia.GetBaendeCache()
	if err != nil {
		return data, err
	}
	musenalmApp, ok := ia.(*musapp.App)
	if !ok {
		return data, fmt.Errorf("unexpected app type %T", ia)
	}

	allEntries, ok := cacheInterface.GetEntries().([]*dbmodels.Entry)
	if !ok {
		return data, fmt.Errorf("failed to get entries from cache")
	}
	sortedEntriesMap, ok := cacheInterface.GetSortedEntries().(map[string][]*dbmodels.Entry)
	if !ok {
		return data, fmt.Errorf("failed to get sorted entries from cache")
	}
	orderedEntries := selectBeitraegeOrderedEntries(sortedEntriesMap, allEntries, sortField)
	if entryFilter != "" {
		filteredOrderedEntries := make([]*dbmodels.Entry, 0, 1)
		for _, entry := range orderedEntries {
			if entry != nil && entry.Id == entryFilter {
				filteredOrderedEntries = append(filteredOrderedEntries, entry)
				break
			}
		}
		orderedEntries = filteredOrderedEntries
	}

	entriesMap := make(map[string]*dbmodels.Entry, len(allEntries))
	for _, entry := range allEntries {
		if entry != nil {
			entriesMap[entry.Id] = entry
		}
	}
	timer.Mark("cache")

	contentIDs, searchWasFTS, matchErr := adminBeitraegeMatchingContentIDs(app, search, person, contentType, status)
	if matchErr != nil {
		err = matchErr
		return data, err
	}
	timer.Mark("matching_ids")

	yearInt, hasYearFilter := parseAdminBeitraegeYear(year)
	totalCount := 0
	orderedEntryIDs := []string{}
	pageEntryIDs := []string{}
	contentGroups := make(map[string][]*dbmodels.Content)
	useCachedCountPath := contentIDs == nil && scans == ""
	contentsCountMap := map[string]int{}

	if useCachedCountPath {
		summaryCache, summaryErr := musenalmApp.EnsureEntrySummaryCache()
		if summaryErr != nil {
			return data, summaryErr
		}
		contentsCountMap = make(map[string]int, len(orderedEntries))
		for _, entry := range orderedEntries {
			if entry == nil {
				continue
			}
			contentsCountMap[entry.Id] = summaryCache.Entries[entry.Id].ContentCount
		}
		orderedEntryIDs, totalCount = adminBeitraegeOrderedEntryIDsFromCounts(orderedEntries, contentsCountMap, yearInt, hasYearFilter)
		timer.Mark("contents")
		timer.Mark("grouping")
	} else {
		contents, loadErr := loadAdminBeitraegeContents(app, contentIDs)
		if loadErr != nil {
			return data, loadErr
		}
		timer.Mark("contents")

		for _, content := range contents {
			if content == nil || content.Entry() == "" {
				continue
			}

			entry := entriesMap[content.Entry()]
			if entry == nil {
				continue
			}
			if hasYearFilter && entry.Year() != yearInt {
				continue
			}

			hasScans := len(content.Scans()) > 0
			if scans == "with" && !hasScans {
				continue
			}
			if scans == "without" && hasScans {
				continue
			}

			contentGroups[entry.Id] = append(contentGroups[entry.Id], content)
			totalCount++
		}

		for _, entry := range orderedEntries {
			if entry == nil {
				continue
			}
			group := contentGroups[entry.Id]
			if len(group) == 0 {
				continue
			}
			dbmodels.Sort_Contents_Numbering(group)
			orderedEntryIDs = append(orderedEntryIDs, entry.Id)
		}
		timer.Mark("grouping")
	}

	var bounds []int
	if useCachedCountPath {
		bounds = adminBeitraegeCountBounds(orderedEntryIDs, contentsCountMap, BEITRAEGE_ADMIN_PAGE_SIZE)
	} else {
		bounds = adminBeitraegePageBounds(orderedEntryIDs, contentGroups, BEITRAEGE_ADMIN_PAGE_SIZE)
	}
	pageCount := 0
	if len(bounds) > 1 {
		pageCount = len(bounds) - 1
	}

	currentCount := 0
	nextOffset := 0
	hasMore := false
	if pageCount > 0 {
		if showAggregated {
			loadedPages := offset + 1
			if loadedPages < 1 {
				loadedPages = 1
			}
			if loadedPages > pageCount {
				loadedPages = pageCount
			}
			pageEntryIDs = orderedEntryIDs[:bounds[loadedPages]]
			if useCachedCountPath {
				currentCount = adminBeitraegeCountEntries(pageEntryIDs, contentsCountMap)
			} else {
				currentCount = adminBeitraegeCountContents(pageEntryIDs, contentGroups)
			}
			nextOffset = loadedPages
			hasMore = loadedPages < pageCount
		} else if offset >= 0 && offset < pageCount {
			start := bounds[offset]
			end := bounds[offset+1]
			pageEntryIDs = orderedEntryIDs[start:end]
			if useCachedCountPath {
				currentCount = adminBeitraegeCountEntries(orderedEntryIDs[:end], contentsCountMap)
			} else {
				currentCount = adminBeitraegeCountContents(orderedEntryIDs[:end], contentGroups)
			}
			nextOffset = offset + 1
			hasMore = nextOffset < pageCount
		}
	}
	timer.Mark("pagination")

	pageContents := []*dbmodels.Content{}
	if useCachedCountPath {
		pageContents, err = loadAdminBeitraegeContentsForEntries(app, pageEntryIDs)
		if err != nil {
			return data, err
		}
		for _, content := range pageContents {
			if content == nil || content.Entry() == "" {
				continue
			}
			contentGroups[content.Entry()] = append(contentGroups[content.Entry()], content)
		}
		for _, entryID := range pageEntryIDs {
			if group := contentGroups[entryID]; len(group) > 0 {
				dbmodels.Sort_Contents_Numbering(group)
			}
		}
	} else {
		pageContents = make([]*dbmodels.Content, 0, currentCount)
		for _, entryID := range pageEntryIDs {
			pageContents = append(pageContents, contentGroups[entryID]...)
		}
	}

	contentRelations := map[string][]*dbmodels.RContentsAgents{}
	if len(pageContents) > 0 {
		rels, relErr := dbmodels.RContentsAgents_Contents(app, dbmodels.Ids(pageContents))
		if relErr != nil {
			return data, relErr
		}
		for _, rel := range rels {
			if rel == nil || rel.Content() == "" {
				continue
			}
			contentRelations[rel.Content()] = append(contentRelations[rel.Content()], rel)
		}
	}

	pageDisplays := buildContentAgentDisplays(pageContents, contentRelations, displayApp)
	groups := make([]*BeitraegeAdminGroup, 0, len(pageEntryIDs))
	for _, entryID := range pageEntryIDs {
		entry := entriesMap[entryID]
		if entry == nil {
			continue
		}

		rows := make([]*BeitraegeAdminRow, 0, len(contentGroups[entryID]))
		for _, content := range contentGroups[entryID] {
			if content == nil {
				continue
			}
			rows = append(rows, &BeitraegeAdminRow{
				Content:           content,
				AgentDisplays:     pageDisplays[content.Id],
				AnnotationPreview: adminBeitraegeAnnotationPreview(content.Annotation()),
			})
		}

		if len(rows) == 0 {
			continue
		}

		groups = append(groups, &BeitraegeAdminGroup{
			Entry: entry,
			Rows:  rows,
		})
	}
	timer.Mark("page_groups")

	data["result"] = &BeitraegeAdminResult{Groups: groups}
	data["search"] = search
	data["search_fts"] = searchWasFTS
	data["entry"] = entryFilter
	data["year"] = year
	data["person"] = person
	data["type"] = contentType
	data["status"] = status
	data["scans"] = scans
	data["sort_field"] = sortField
	data["offset"] = offset
	data["next_offset"] = nextOffset
	data["has_more"] = hasMore
	data["total_count"] = totalCount
	data["current_count"] = currentCount
	data["total_groups"] = len(orderedEntryIDs)
	data["selected_filter_labels"] = buildBeitraegeSelectedFilterLabels(app, entryFilter, year, person, contentType, status, scans)
	data["csrf_token"] = req.Session().Token

	filterData, err := loadBeitraegeFilterData(app, ia)
	if err != nil {
		return data, err
	}
	data["filter_types"] = filterData.Types
	data["filter_statuses"] = filterData.Statuses
	data["filter_status_labels"] = filterData.StatusLabels
	timer.Mark("result")

	return data, nil
}

func loadAdminBeitraegeContents(app core.App, contentIDs map[string]struct{}) ([]*dbmodels.Content, error) {
	switch {
	case contentIDs != nil && len(contentIDs) == 0:
		return []*dbmodels.Content{}, nil
	case contentIDs != nil:
		return dbmodels.Contents_IDs(app, anySliceFromStringSet(contentIDs))
	default:
		contents := []*dbmodels.Content{}
		if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).All(&contents); err != nil {
			return nil, err
		}
		return contents, nil
	}
}

func loadAdminBeitraegeContentsForEntries(app core.App, entryIDs []string) ([]*dbmodels.Content, error) {
	if len(entryIDs) == 0 {
		return []*dbmodels.Content{}, nil
	}

	contents := []*dbmodels.Content{}
	ids := make([]any, 0, len(entryIDs))
	for _, entryID := range entryIDs {
		if entryID != "" {
			ids = append(ids, entryID)
		}
	}
	if len(ids) == 0 {
		return []*dbmodels.Content{}, nil
	}

	if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).
		Where(dbx.HashExp{dbmodels.ENTRIES_TABLE: ids}).
		All(&contents); err != nil {
		return nil, err
	}
	return contents, nil
}

func parseAdminBeitraegeYear(year string) (int, bool) {
	trimmed := strings.TrimSpace(year)
	if trimmed == "" {
		return 0, false
	}
	value, err := strconv.Atoi(trimmed)
	if err != nil {
		return 0, false
	}
	return value, true
}

func adminBeitraegeOrderedEntryIDsFromCounts(entries []*dbmodels.Entry, counts map[string]int, year int, hasYear bool) ([]string, int) {
	orderedEntryIDs := make([]string, 0, len(entries))
	totalCount := 0
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		if hasYear && entry.Year() != year {
			continue
		}
		count := counts[entry.Id]
		if count <= 0 {
			continue
		}
		orderedEntryIDs = append(orderedEntryIDs, entry.Id)
		totalCount += count
	}
	return orderedEntryIDs, totalCount
}

func selectBeitraegeOrderedEntries(sortedEntries map[string][]*dbmodels.Entry, allEntries []*dbmodels.Entry, sortField string) []*dbmodels.Entry {
	switch sortField {
	case "year":
		if sortedEntries != nil {
			if entries, ok := sortedEntries["year"]; ok && entries != nil {
				return entries
			}
		}
		fallback := make([]*dbmodels.Entry, len(allEntries))
		copy(fallback, allEntries)
		dbmodels.Sort_Entries_Year_Title(fallback)
		return fallback
	default:
		if sortedEntries != nil {
			if entries, ok := sortedEntries["title"]; ok && entries != nil {
				return entries
			}
		}
		fallback := make([]*dbmodels.Entry, len(allEntries))
		copy(fallback, allEntries)
		dbmodels.Sort_Entries_Title_Year(fallback)
		return fallback
	}
}

func loadBeitraegeFilterData(app core.App, ia pagemodels.IApp) (*beitraegeFilterData, error) {
	cacheInterface, err := ia.GetBaendeCache()
	if err != nil {
		return nil, err
	}

	displayApp, ok := ia.(*musapp.App)
	if !ok {
		return nil, fmt.Errorf("unexpected app type %T", ia)
	}
	summaryCache, err := displayApp.EnsureEntrySummaryCache()
	if err != nil {
		return nil, err
	}
	agentCache, err := displayApp.EnsureContentAgentOrderCache()
	if err != nil {
		return nil, err
	}

	allEntries, ok := cacheInterface.GetEntries().([]*dbmodels.Entry)
	if !ok {
		return nil, fmt.Errorf("failed to get entries from cache")
	}
	sortedEntriesMap, ok := cacheInterface.GetSortedEntries().(map[string][]*dbmodels.Entry)
	if !ok {
		return nil, fmt.Errorf("failed to get sorted entries from cache")
	}
	agentOptions, agentLabels, err := buildBaendeAgentOptions(app, displayApp, agentCache.IDs)
	if err != nil {
		return nil, err
	}

	types := append([]string(nil), dbmodels.MUSENALM_TYPE_VALUES...)

	typeLabels := make(map[string]string, len(types))
	for _, typ := range types {
		typeLabels[typ] = typ
	}

	data := &beitraegeFilterData{
		Entries:     buildBeitraegeEntryOptions(filterEntriesWithContents(selectBaendeSortedEntries(sortedEntriesMap, "title"), summaryCache)),
		EntryLabels: buildBeitraegeEntryLabelMap(allEntries),
		Agents:      toBeitraegeFilterOptions(agentOptions),
		AgentLabels: agentLabels,
		Years:       buildYearFilters(allEntries),
		YearLabels:  buildYearLabelMap(allEntries),
		Types:       types,
		TypeLabels:  typeLabels,
		Statuses:    []string{"Unknown", "ToDo", "Review", "Edited"},
		StatusLabels: map[string]string{
			"Unknown": "Unbekannt",
			"ToDo":    "Zu erledigen",
			"Review":  "Überprüfen",
			"Edited":  "Erfasst",
		},
		ScansLabels: map[string]string{"with": "Mit Scans", "without": "Ohne Scans"},
	}

	return data, nil
}

func filterEntriesWithContents(entries []*dbmodels.Entry, summaryCache *musapp.EntrySummaryCache) []*dbmodels.Entry {
	if len(entries) == 0 || summaryCache == nil {
		return entries
	}

	filtered := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		if summaryCache.Entries[entry.Id].ContentCount > 0 {
			filtered = append(filtered, entry)
		}
	}
	return filtered
}

func buildBeitraegeLazyFilterData(app core.App, ia pagemodels.IApp, kind string) (*beitraegeLazyFilterData, error) {
	filterData, err := loadBeitraegeFilterData(app, ia)
	if err != nil {
		return nil, err
	}

	switch kind {
	case "entry":
		options := make([]beitraegeLazyFilterOption, 0, len(filterData.Entries))
		options = append(options, filterData.Entries...)
		return &beitraegeLazyFilterData{
			Kind:        kind,
			Title:       "Almanach",
			Placeholder: "Almanache filtern...",
			SpinnerID:   "beitraege-entry-spinner",
			Options:     options,
		}, nil
	case "person":
		return &beitraegeLazyFilterData{
			Kind:        kind,
			Title:       "Person",
			Placeholder: "Personen filtern...",
			SpinnerID:   "beitraege-person-spinner",
			Options:     filterData.Agents,
		}, nil
	case "year":
		options := make([]beitraegeLazyFilterOption, 0, len(filterData.Years))
		for _, year := range filterData.Years {
			label := strconv.Itoa(year)
			if year == 0 {
				label = "ohne Jahr"
			}
			options = append(options, beitraegeLazyFilterOption{
				Value: strconv.Itoa(year),
				Label: label,
			})
		}
		return &beitraegeLazyFilterData{
			Kind:        kind,
			Title:       "Jahr",
			Placeholder: "Jahre filtern...",
			SpinnerID:   "beitraege-year-spinner",
			Options:     options,
		}, nil
	case "type":
		options := make([]beitraegeLazyFilterOption, 0, len(filterData.Types))
		for _, typ := range filterData.Types {
			options = append(options, beitraegeLazyFilterOption{
				Value: typ,
				Label: typ,
			})
		}
		return &beitraegeLazyFilterData{
			Kind:        kind,
			Title:       "Typ",
			Placeholder: "Typen filtern...",
			SpinnerID:   "beitraege-type-spinner",
			Options:     options,
		}, nil
	case "status":
		options := make([]beitraegeLazyFilterOption, 0, len(filterData.Statuses))
		for _, status := range filterData.Statuses {
			options = append(options, beitraegeLazyFilterOption{
				Value: status,
				Label: filterData.StatusLabels[status],
			})
		}
		return &beitraegeLazyFilterData{
			Kind:        kind,
			Title:       "Status",
			Placeholder: "Status filtern...",
			SpinnerID:   "beitraege-status-spinner",
			Options:     options,
		}, nil
	default:
		return nil, fmt.Errorf("unsupported beitraege filter kind %q", kind)
	}
}

func mapByAgentID(agents []*dbmodels.Agent) map[string]*dbmodels.Agent {
	result := make(map[string]*dbmodels.Agent, len(agents))
	for _, agent := range agents {
		if agent != nil {
			result[agent.Id] = agent
		}
	}
	return result
}

func buildBeitraegeEntryOptions(entries []*dbmodels.Entry) []beitraegeLazyFilterOption {
	options := make([]beitraegeLazyFilterOption, 0, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		label := strings.TrimSpace(entry.PreferredTitle())
		if label == "" {
			label = fmt.Sprintf("Band %d", entry.MusenalmID())
		}
		options = append(options, beitraegeLazyFilterOption{
			Value: entry.Id,
			Label: label,
			Meta:  fmt.Sprintf("Alm %d", entry.MusenalmID()),
		})
	}
	return options
}

func toBeitraegeFilterOptions(options []baendeLazyFilterOption) []beitraegeLazyFilterOption {
	converted := make([]beitraegeLazyFilterOption, 0, len(options))
	for _, option := range options {
		converted = append(converted, beitraegeLazyFilterOption{
			Value:       option.Value,
			Label:       option.Label,
			Meta:        option.Meta,
			MetaIsBadge: option.MetaIsBadge,
		})
	}
	return converted
}

func buildBeitraegeEntryLabelMap(entries []*dbmodels.Entry) map[string]string {
	result := make(map[string]string, len(entries))
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		label := strings.TrimSpace(entry.PreferredTitle())
		if label == "" {
			label = fmt.Sprintf("Band %d", entry.MusenalmID())
		}
		result[entry.Id] = label
	}
	return result
}

func buildBeitraegeSelectedFilterLabels(app core.App, entryFilter, year, person, contentType, status, scans string) map[string]string {
	labels := map[string]string{
		"entry":  "",
		"year":   "",
		"person": "",
		"type":   "",
		"status": "",
		"scans":  "",
	}

	if entryFilter != "" {
		if entry, err := dbmodels.Entries_ID(app, entryFilter); err == nil && entry != nil {
			if title := strings.TrimSpace(entry.PreferredTitle()); title != "" {
				labels["entry"] = title
			} else {
				labels["entry"] = fmt.Sprintf("Band %d", entry.MusenalmID())
			}
		} else {
			labels["entry"] = entryFilter
		}
	}
	if year != "" {
		if year == "0" {
			labels["year"] = "ohne Jahr"
		} else {
			labels["year"] = year
		}
	}
	if person != "" {
		if agent, err := dbmodels.Agents_ID(app, person); err == nil && agent != nil {
			labels["person"] = agent.Name()
		} else {
			labels["person"] = person
		}
	}
	if contentType != "" {
		labels["type"] = contentType
	}
	if status != "" {
		labels["status"] = adminBeitraegeStatusLabel(status)
	}
	if scans != "" {
		switch scans {
		case "with":
			labels["scans"] = "Mit Scans"
		case "without":
			labels["scans"] = "Ohne Scans"
		default:
			labels["scans"] = scans
		}
	}

	return labels
}

func adminBeitraegeMatchingContentIDs(app core.App, search, person, contentType, status string) (map[string]struct{}, bool, error) {
	allowedIDs := []map[string]struct{}{}
	searchWasFTS := false

	if search != "" {
		searchIDs, wasFTS, err := searchAdminContentIDs(app, search)
		if err != nil {
			return nil, false, err
		}
		allowedIDs = append(allowedIDs, searchIDs)
		searchWasFTS = wasFTS
	}

	if person != "" {
		rels, err := dbmodels.RContentsAgents_Agent(app, person)
		if err != nil {
			return nil, false, err
		}
		personIDs := make(map[string]struct{}, len(rels))
		for _, rel := range rels {
			if rel == nil || rel.Content() == "" {
				continue
			}
			personIDs[rel.Content()] = struct{}{}
		}
		allowedIDs = append(allowedIDs, personIDs)
	}

	if contentType != "" {
		typeIDs, err := adminBeitraegeContentIDsByType(app, contentType)
		if err != nil {
			return nil, false, err
		}
		allowedIDs = append(allowedIDs, typeIDs)
	}

	if status != "" {
		statusIDs, err := adminBeitraegeContentIDsByStatus(app, status)
		if err != nil {
			return nil, false, err
		}
		allowedIDs = append(allowedIDs, statusIDs)
	}

	return applyAllowedIDs(allowedIDs...), searchWasFTS, nil
}

func searchAdminContentIDs(app core.App, search string) (map[string]struct{}, bool, error) {
	result := map[string]struct{}{}
	query := strings.TrimSpace(search)
	if query == "" {
		return nil, false, nil
	}

	fields := []string{
		dbmodels.TITLE_STMT_FIELD,
		dbmodels.SUBTITLE_STMT_FIELD,
		dbmodels.VARIANT_TITLE_FIELD,
		dbmodels.PARALLEL_TITLE_FIELD,
		dbmodels.RESPONSIBILITY_STMT_FIELD,
		dbmodels.AGENTS_TABLE,
		dbmodels.ANNOTATION_FIELD,
		dbmodels.YEAR_FIELD,
		dbmodels.ENTRIES_TABLE,
		dbmodels.INCIPIT_STMT_FIELD,
		dbmodels.MUSENALM_INHALTE_TYPE_FIELD,
	}
	requests := dbmodels.IntoQueryRequests(fields, dbmodels.NormalizeQuery(query))
	hits, err := dbmodels.FTS5Search(app, dbmodels.CONTENTS_TABLE, requests...)
	if err != nil {
		return nil, false, err
	}
	for _, hit := range hits {
		if hit == nil || hit.ID == "" {
			continue
		}
		result[hit.ID] = struct{}{}
	}

	if musenalmID, convErr := strconv.Atoi(query); convErr == nil && musenalmID > 0 {
		rows := []struct {
			ID string `db:"id"`
		}{}
		if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).
			Select(dbmodels.ID_FIELD).
			Where(dbx.HashExp{dbmodels.MUSENALMID_FIELD: musenalmID}).
			All(&rows); err != nil {
			return nil, false, err
		}
		for _, row := range rows {
			if row.ID != "" {
				result[row.ID] = struct{}{}
			}
		}
	}

	return result, len(hits) > 0, nil
}

func adminBeitraegeContentIDsByType(app core.App, contentType string) (map[string]struct{}, error) {
	rows := []struct {
		ID string `db:"id"`
	}{}
	if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).
		Select(dbmodels.ID_FIELD).
		Where(dbx.NewExp(
			dbmodels.MUSENALM_INHALTE_TYPE_FIELD+" = {:type} OR (json_valid("+dbmodels.MUSENALM_INHALTE_TYPE_FIELD+") = 1 AND EXISTS (SELECT 1 FROM json_each("+dbmodels.MUSENALM_INHALTE_TYPE_FIELD+") WHERE value = {:type}))",
			dbx.Params{"type": strings.TrimSpace(contentType)},
		)).
		All(&rows); err != nil {
		return nil, err
	}

	result := make(map[string]struct{}, len(rows))
	for _, row := range rows {
		if row.ID == "" {
			continue
		}
		result[row.ID] = struct{}{}
	}
	return result, nil
}

func adminBeitraegeContentIDsByStatus(app core.App, status string) (map[string]struct{}, error) {
	rows := []struct {
		ID string `db:"id"`
	}{}
	if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).
		Select(dbmodels.ID_FIELD).
		Where(dbx.HashExp{dbmodels.EDITSTATE_FIELD: strings.TrimSpace(status)}).
		All(&rows); err != nil {
		return nil, err
	}

	result := make(map[string]struct{}, len(rows))
	for _, row := range rows {
		if row.ID == "" {
			continue
		}
		result[row.ID] = struct{}{}
	}
	return result, nil
}

func adminBeitraegeStatusLabel(status string) string {
	switch strings.TrimSpace(status) {
	case "Unknown":
		return "Unbekannt"
	case "ToDo":
		return "Zu erledigen"
	case "Review":
		return "Überprüfen"
	case "Seen":
		return "Gesichtet"
	case "Edited":
		return "Erfasst"
	default:
		return strings.TrimSpace(status)
	}
}

func adminBeitraegePageBounds(hits []string, groupedContents map[string][]*dbmodels.Content, pageSize int) []int {
	if len(hits) == 0 {
		return []int{0}
	}

	bounds := []int{0}
	currentCount := 0
	for i, hit := range hits {
		groupSize := len(groupedContents[hit])
		if currentCount > 0 && currentCount+groupSize > pageSize {
			bounds = append(bounds, i)
			currentCount = 0
		}
		currentCount += groupSize
		if groupSize >= pageSize {
			if bounds[len(bounds)-1] != i+1 {
				bounds = append(bounds, i+1)
			}
			currentCount = 0
		}
	}
	if bounds[len(bounds)-1] != len(hits) {
		bounds = append(bounds, len(hits))
	}
	return bounds
}

func adminBeitraegeCountBounds(hits []string, counts map[string]int, pageSize int) []int {
	if len(hits) == 0 {
		return []int{0}
	}

	bounds := []int{0}
	currentCount := 0
	for i, hit := range hits {
		groupSize := counts[hit]
		if groupSize <= 0 {
			continue
		}
		if currentCount > 0 && currentCount+groupSize > pageSize {
			bounds = append(bounds, i)
			currentCount = 0
		}
		currentCount += groupSize
		if groupSize >= pageSize {
			if bounds[len(bounds)-1] != i+1 {
				bounds = append(bounds, i+1)
			}
			currentCount = 0
		}
	}
	if bounds[len(bounds)-1] != len(hits) {
		bounds = append(bounds, len(hits))
	}
	return bounds
}

func adminBeitraegeCountContents(hits []string, groupedContents map[string][]*dbmodels.Content) int {
	count := 0
	for _, hit := range hits {
		count += len(groupedContents[hit])
	}
	return count
}

func adminBeitraegeCountEntries(hits []string, counts map[string]int) int {
	count := 0
	for _, hit := range hits {
		count += counts[hit]
	}
	return count
}

func adminBeitraegeAnnotationPreview(annotation string) string {
	trimmed := strings.TrimSpace(annotation)
	if trimmed == "" {
		return ""
	}

	plain := adminBeitraegeAnnotationTags.ReplaceAllString(trimmed, " ")
	plain = html.UnescapeString(plain)
	plain = strings.Join(strings.Fields(plain), " ")
	if plain == "" {
		return ""
	}

	const maxRunes = 180
	if utf8.RuneCountInString(plain) <= maxRunes {
		return plain
	}

	runes := []rune(plain)
	return strings.TrimSpace(string(runes[:maxRunes])) + "…"
}
