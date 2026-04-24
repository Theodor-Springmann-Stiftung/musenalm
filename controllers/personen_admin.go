package controllers

import (
	"net/url"
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
)

const (
	PERSONEN_ADMIN_PAGE_SIZE = 80
)

type PersonenAdminPage struct {
	pagemodels.StaticPage
}

type PersonenAdminResult struct {
	Agents        []*dbmodels.Agent
	BandCounts    map[string]int
	ContentCounts map[string]int
	EditorNames   map[string]string
}

type PersonenAdminProfessionFilter struct {
	Value string
	Label string
}

func init() {
	pp := &PersonenAdminPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHEN_NAME,
			URL:      URL_PERSONEN_ADMIN,
			Template: TEMPLATE_PERSONEN_ADMIN,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(pp)
}

func (p *PersonenAdminPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_PERSONEN_ADMIN)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app))
	rg.GET("results/", p.handleResults(engine, app))
	rg.GET("more/", p.handleMore(engine, app))
	rg.GET("delete-info/{id}", p.handleDeleteInfo(engine, app))
	return nil
}

func (p *PersonenAdminPage) handlePage(engine *templating.Engine, app core.App) HandleFunc {
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

func (p *PersonenAdminPage) handleResults(engine *templating.Engine, app core.App) HandleFunc {
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
		return engine.Response200(e, URL_PERSONEN_ADMIN_RESULTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *PersonenAdminPage) handleMore(engine *templating.Engine, app core.App) HandleFunc {
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

		return engine.Response200(e, TEMPLATE_PERSONEN_ADMIN_MORE, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *PersonenAdminPage) handleDeleteInfo(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			return e.Redirect(303, URL_LOGIN)
		}

		id := strings.TrimSpace(e.Request.PathValue("id"))
		if id == "" {
			return engine.Response404(e, nil, nil)
		}

		agent, err := dbmodels.Agents_ID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		ids := []any{agent.Id}
		bandCounts, err := dbmodels.CountAgentsBaende(app, ids)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		contentCounts, err := dbmodels.CountAgentsContents(app, ids)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		data := map[string]any{
			"agent":         agent,
			"band_count":    bandCounts[agent.Id],
			"content_count": contentCounts[agent.Id],
		}

		return engine.Response200(e, TEMPLATE_PERSONEN_ADMIN_DELETE_INFO, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *PersonenAdminPage) buildResultData(app core.App, e *core.RequestEvent, req *templating.Request, showAggregated bool) (map[string]any, error) {
	data := map[string]any{}

	offset := 0
	if offsetStr := strings.TrimSpace(e.Request.URL.Query().Get("offset")); offsetStr != "" {
		if val, err := strconv.Atoi(offsetStr); err == nil && val >= 0 {
			offset = val
		}
	}

	search := strings.TrimSpace(e.Request.URL.Query().Get("search"))
	letter := strings.ToUpper(strings.TrimSpace(e.Request.URL.Query().Get("letter")))
	status := strings.TrimSpace(e.Request.URL.Query().Get("status"))
	corp := strings.TrimSpace(e.Request.URL.Query().Get("corp"))
	profession := strings.TrimSpace(e.Request.URL.Query().Get("profession"))

	if corp != "" && corp != "person" && corp != "org" {
		corp = ""
	}

	validProfessions := map[string]struct{}{
		"musik":   {},
		"text":    {},
		"graphik": {},
		"hrsg":    {},
	}
	if profession != "" {
		if _, ok := validProfessions[profession]; !ok {
			profession = ""
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

	allowedIDs := []map[string]struct{}{}
	if search != "" {
		searchIDs, fts, err := searchAdminAgentIDs(app, search)
		if err != nil {
			return data, err
		}
		allowedIDs = append(allowedIDs, searchIDs)
		data["fts"] = fts
	}

	filteredIDs := applyAllowedIDs(allowedIDs...)
	if filteredIDs != nil && len(filteredIDs) == 0 {
		data["result"] = &PersonenAdminResult{
			Agents:        []*dbmodels.Agent{},
			BandCounts:    map[string]int{},
			ContentCounts: map[string]int{},
			EditorNames:   map[string]string{},
		}
		data["offset"] = offset
		data["total_count"] = 0
		data["current_count"] = 0
		data["has_more"] = false
		data["next_offset"] = 0
		data["search"] = search
		data["letter"] = letter
		data["status"] = status
		data["corp"] = corp
		data["profession"] = profession
		data["letters"] = letters
		data["csrf_token"] = req.Session().Token
		data["filter_statuses"] = buildNonEntryStatusFilters()
		data["filter_status_labels"] = buildNonEntryStatusLabelMap()
		data["filter_professions"] = buildAdminAgentProfessionFilters()
		data["filter_profession_labels"] = buildAdminAgentProfessionLabelMap()
		return data, nil
	}

	var totalCount64 int64
	if err := buildAdminPersonenQuery(app, status, corp, profession, letter, filteredIDs).
		Select("COUNT(*)").
		Row(&totalCount64); err != nil {
		return data, err
	}
	totalCount := int(totalCount64)

	queryOffset, limit, currentCount, nextOffset, hasMore := paginatedQueryWindow(offset, totalCount, PERSONEN_ADMIN_PAGE_SIZE, showAggregated)
	pageAgents := []*dbmodels.Agent{}
	if limit > 0 {
		if err := buildAdminPersonenQuery(app, status, corp, profession, letter, filteredIDs).
			OrderBy(dbmodels.AGENTS_NAME_FIELD, dbmodels.ID_FIELD).
			Limit(int64(limit)).
			Offset(int64(queryOffset)).
			All(&pageAgents); err != nil {
			return data, err
		}
	}

	ids := make([]any, 0, len(pageAgents))
	for _, agent := range pageAgents {
		if agent == nil {
			continue
		}
		ids = append(ids, agent.Id)
	}

	bandCounts := map[string]int{}
	contentCounts := map[string]int{}
	editorIDs := make([]string, 0, len(pageAgents))
	if len(ids) > 0 {
		var err error
		bandCounts, err = dbmodels.CountAgentsBaende(app, ids)
		if err != nil {
			return data, err
		}
		contentCounts, err = dbmodels.CountAgentsContents(app, ids)
		if err != nil {
			return data, err
		}
	}
	for _, agent := range pageAgents {
		if agent == nil {
			continue
		}
		editorIDs = append(editorIDs, agent.Editor())
	}
	editorNames, err := loadAdminEditorNames(app, editorIDs)
	if err != nil {
		return data, err
	}

	data["result"] = &PersonenAdminResult{
		Agents:        pageAgents,
		BandCounts:    bandCounts,
		ContentCounts: contentCounts,
		EditorNames:   editorNames,
	}
	data["offset"] = offset
	data["total_count"] = totalCount
	data["current_count"] = currentCount
	data["has_more"] = hasMore
	data["next_offset"] = nextOffset
	data["search"] = search
	data["letter"] = letter
	data["status"] = status
	data["corp"] = corp
	data["profession"] = profession
	data["letters"] = letters
	data["csrf_token"] = req.Session().Token
	data["filter_statuses"] = buildNonEntryStatusFilters()
	data["filter_status_labels"] = buildNonEntryStatusLabelMap()
	data["filter_professions"] = buildAdminAgentProfessionFilters()
	data["filter_profession_labels"] = buildAdminAgentProfessionLabelMap()

	return data, nil
}

func buildAdminPersonenQuery(app core.App, status, corp, profession, letter string, filteredIDs map[string]struct{}) *dbx.SelectQuery {
	query := app.RecordQuery(dbmodels.AGENTS_TABLE)
	if status != "" {
		query = query.AndWhere(dbx.HashExp{dbmodels.EDITSTATE_FIELD: status})
	}
	if corp != "" {
		query = query.AndWhere(dbx.HashExp{
			dbmodels.AGENTS_CORP_FIELD: corp == "org",
		})
	}
	if profession != "" {
		label := professionLabelForValue(profession)
		if label != "" {
			query = query.AndWhere(dbx.Like(dbmodels.AGENTS_PROFESSION_FIELD, label).Match(true, true))
		}
	}
	if letter != "" {
		query = query.AndWhere(adminInitialFilterExp(dbmodels.AGENTS_NAME_FIELD, letter))
	}
	if filteredIDs != nil {
		query = query.AndWhere(dbx.HashExp{dbmodels.ID_FIELD: anySliceFromStringSet(filteredIDs)})
	}
	return query
}

func searchAdminAgentIDs(app core.App, search string) (map[string]struct{}, bool, error) {
	result := map[string]struct{}{}

	agents, err := dbmodels.FTS5SearchAgents(app, search)
	if err != nil {
		return nil, false, err
	}
	if len(agents) > 0 {
		for _, agent := range agents {
			if agent != nil {
				result[agent.Id] = struct{}{}
			}
		}
		return result, true, nil
	}

	agents, altAgents, err := dbmodels.BasicSearchAgents(app, search)
	if err != nil {
		return nil, false, err
	}
	for _, agent := range agents {
		if agent != nil {
			result[agent.Id] = struct{}{}
		}
	}
	for _, agent := range altAgents {
		if agent != nil {
			result[agent.Id] = struct{}{}
		}
	}

	return result, false, nil
}

func buildAdminAgentProfessionFilters() []*PersonenAdminProfessionFilter {
	return []*PersonenAdminProfessionFilter{
		{Value: "musik", Label: "Musik"},
		{Value: "text", Label: "Text"},
		{Value: "graphik", Label: "Graphik"},
		{Value: "hrsg", Label: "Hrsg"},
	}
}

func buildAdminAgentProfessionLabelMap() map[string]string {
	return map[string]string{
		"musik":   "Musik",
		"text":    "Text",
		"graphik": "Graphik",
		"hrsg":    "Hrsg",
	}
}

func professionLabelForValue(value string) string {
	switch value {
	case "musik":
		return "Musik"
	case "text":
		return "Text"
	case "graphik":
		return "Graphik"
	case "hrsg":
		return "Hrsg"
	default:
		return ""
	}
}
