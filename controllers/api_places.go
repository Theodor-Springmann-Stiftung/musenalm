package controllers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_API_PLACES        = "/api/places"
	URL_API_PLACES_SEARCH = "/search"
)

func init() {
	app.Register(&PlacesAPI{})
}

type PlacesAPI struct{}

func (p *PlacesAPI) Up(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *PlacesAPI) Down(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *PlacesAPI) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_API_PLACES)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_API_PLACES_SEARCH, p.searchHandler(app))
	return nil
}

func (p *PlacesAPI) searchHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		query := strings.TrimSpace(e.Request.URL.Query().Get("q"))
		limit := parseLimit(e.Request.URL.Query().Get("limit"))

		results, err := dbmodels.SearchPlaces(app, query, limit)
		if err != nil {
			app.Logger().Error("place search failed", "query", query, "limit", limit, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "failed to search places",
			})
		}

		response := make([]map[string]string, 0, len(results))
		for _, place := range results {
			if place == nil {
				continue
			}
			response = append(response, map[string]string{
				"id":         place.Id,
				"name":       place.Name(),
				"detail":     place.Pseudonyms(),
				"annotation": place.Annotation(),
			})
		}

		return e.JSON(http.StatusOK, map[string]any{
			"places": response,
		})
	}
}

func parseLimit(value string) int {
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
