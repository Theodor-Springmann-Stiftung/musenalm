package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_API_SERIES        = "/api/series"
	URL_API_SERIES_SEARCH = "/search"
)

func init() {
	app.Register(&SeriesAPI{})
}

type SeriesAPI struct{}

func (p *SeriesAPI) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *SeriesAPI) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *SeriesAPI) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_API_SERIES)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_API_SERIES_SEARCH, p.searchHandler(app))
	return nil
}

func (p *SeriesAPI) searchHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		query := strings.TrimSpace(e.Request.URL.Query().Get("q"))
		limit := parseSeriesLimit(e.Request.URL.Query().Get("limit"))

		primary, alt, err := dbmodels.BasicSearchSeries(app, query)
		if err != nil {
			app.Logger().Error("series search failed", "query", query, "limit", limit, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "failed to search series",
			})
		}

		results := append(primary, alt...)
		seen := map[string]bool{}
		response := make([]map[string]string, 0, len(results))
		for _, series := range results {
			if series == nil || seen[series.Id] {
				continue
			}
			seen[series.Id] = true
			response = append(response, map[string]string{
				"id":          series.Id,
				"name":        series.Title(),
				"detail":      series.Pseudonyms(),
				"musenalm_id": strconv.Itoa(series.MusenalmID()),
			})
			if limit > 0 && len(response) >= limit {
				break
			}
		}

		return e.JSON(http.StatusOK, map[string]any{
			"series": response,
		})
	}
}

func parseSeriesLimit(value string) int {
	if value == "" {
		return 0
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0
	}

	if parsed <= 0 {
		return 0
	}

	return parsed
}
