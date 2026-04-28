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

const ORTE_PAGE_SIZE = 80

func init() {
	op := &OrtePage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ORTE_NAME,
			URL:      URL_ORTE,
			Template: TEMPLATE_ORTE,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(op)
}

type OrtePage struct {
	pagemodels.StaticPage
}

type OrteResult struct {
	Places      []*dbmodels.Place
	EditorNames map[string]string
}

func (p *OrtePage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_ORTE)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app))
	rg.GET("results/", p.handleResults(engine, app))
	rg.GET("more/", p.handleMore(engine, app))
	return nil
}

func (p *OrtePage) handlePage(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req, true)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		return engine.Response200(e, p.Template, data, adminPageLayout(e, p.Layout))
	}
}

func (p *OrtePage) handleResults(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req, true)
		if err != nil {
			return engine.Response500(e, err, data)
		}
		e.Response.Header().Set("X-Has-More", boolHeaderValue(data["has_more"]))
		e.Response.Header().Set("X-Next-Offset", intHeaderValue(data["next_offset"]))
		e.Response.Header().Set("X-Current-Count", intHeaderValue(data["current_count"]))
		e.Response.Header().Set("X-Total-Count", intHeaderValue(data["total_count"]))

		return engine.Response200(e, URL_ORTE_RESULTS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *OrtePage) handleMore(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, URL_LOGIN+"?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req, false)
		if err != nil {
			return engine.Response500(e, err, data)
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
		e.Response.Header().Set("X-Current-Count", intHeaderValue(data["current_count"]))
		e.Response.Header().Set("X-Total-Count", intHeaderValue(data["total_count"]))

		return engine.Response200(e, TEMPLATE_ORTE_MORE, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *OrtePage) buildResultData(app core.App, e *core.RequestEvent, req *templating.Request, showAggregated bool) (map[string]any, error) {
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
	fictional := strings.TrimSpace(e.Request.URL.Query().Get("fictional"))
	if fictional != "" && fictional != "fictional" && fictional != "nonfictional" {
		fictional = ""
	}

	validLetters := make(map[string]struct{}, len(adminAlphabet))
	for _, ch := range adminAlphabet {
		validLetters[ch] = struct{}{}
	}
	if letter != "" {
		letter = normalizeAdminLetter(letter)
		if _, ok := validLetters[letter]; !ok {
			letter = ""
		}
	}

	var totalCount64 int64
	if err := buildAdminOrteQuery(app, search, letter, status, fictional).
		Select("COUNT(*)").
		Row(&totalCount64); err != nil {
		return data, err
	}
	totalCount := int(totalCount64)

	queryOffset, limit, currentCount, nextOffset, hasMore := paginatedQueryWindow(offset, totalCount, ORTE_PAGE_SIZE, showAggregated)
	pagePlaces := []*dbmodels.Place{}
	if limit > 0 {
		if err := buildAdminOrteQuery(app, search, letter, status, fictional).
			OrderBy(dbmodels.PLACES_NAME_FIELD, dbmodels.ID_FIELD).
			Limit(int64(limit)).
			Offset(int64(queryOffset)).
			All(&pagePlaces); err != nil {
			return data, err
		}
	}

	countIDs := make([]any, 0, len(pagePlaces))
	for _, place := range pagePlaces {
		if place != nil {
			countIDs = append(countIDs, place.Id)
		}
	}

	bcount := map[string]int{}
	editorIDs := make([]string, 0, len(pagePlaces))
	if len(countIDs) > 0 {
		counts, err := dbmodels.CountPlacesBaende(app, countIDs)
		if err != nil {
			return data, err
		}
		bcount = counts
	}
	for _, place := range pagePlaces {
		if place == nil {
			continue
		}
		editorIDs = append(editorIDs, place.Editor())
	}
	editorNames, err := loadAdminEditorNames(app, editorIDs)
	if err != nil {
		return data, err
	}

	data["result"] = &OrteResult{Places: pagePlaces, EditorNames: editorNames}
	data["bcount"] = bcount
	data["offset"] = offset
	data["total_count"] = totalCount
	data["current_count"] = currentCount
	data["has_more"] = hasMore
	data["next_offset"] = nextOffset
	data["search"] = search
	data["letter"] = letter
	data["status"] = status
	data["fictional"] = fictional
	data["letters"] = adminAlphabet
	data["csrf_token"] = req.Session().Token
	data["filter_statuses"] = buildNonEntryStatusFilters()
	data["filter_status_labels"] = buildNonEntryStatusLabelMap()
	return data, nil
}

func buildAdminOrteQuery(app core.App, search, letter, status, fictional string) *dbx.SelectQuery {
	query := app.RecordQuery(dbmodels.PLACES_TABLE)
	if search != "" {
		query = query.AndWhere(dbx.Or(
			dbx.Like(dbmodels.PLACES_NAME_FIELD, search).Match(true, true),
			dbx.Like(dbmodels.PLACES_PSEUDONYMS_FIELD, search).Match(true, true),
		))
	}
	if letter != "" {
		query = query.AndWhere(adminInitialFilterExp(dbmodels.PLACES_NAME_FIELD, letter))
	}
	if status != "" {
		query = query.AndWhere(dbx.HashExp{dbmodels.EDITSTATE_FIELD: status})
	}
	if fictional != "" {
		query = query.AndWhere(dbx.HashExp{
			dbmodels.PLACES_FICTIONAL_FIELD: fictional == "fictional",
		})
	}
	return query
}

func boolHeaderValue(value any) string {
	if typed, ok := value.(bool); ok && typed {
		return "true"
	}
	return "false"
}

func intHeaderValue(value any) string {
	if typed, ok := value.(int); ok {
		return strconv.Itoa(typed)
	}
	return "0"
}
