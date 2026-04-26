package controllers

import (
	"net/http"
	"sort"
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

func init() {
	app.Register(&PlacesAPI{})
}

type PlacesAPI struct{}

func (p *PlacesAPI) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *PlacesAPI) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *PlacesAPI) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_API_PLACES)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_API_PLACES_SEARCH, p.searchHandler(app))
	rg.GET(URL_API_PLACES_ALL, p.allHandler(app))
	return nil
}

func (p *PlacesAPI) searchHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		query := strings.TrimSpace(e.Request.URL.Query().Get("q"))
		queryLower := strings.ToLower(query)
		limit := parseLimit(e.Request.URL.Query().Get("limit"))

		results, err := dbmodels.SearchPlaces(app, query, limit)
		if err != nil {
			app.Logger().Error("place search failed", "query", query, "limit", limit, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "failed to search places",
			})
		}

		if queryLower != "" {
			sort.SliceStable(results, func(i, j int) bool {
				ai := results[i]
				aj := results[j]
				if ai == nil && aj == nil {
					return false
				}
				if ai == nil {
					return false
				}
				if aj == nil {
					return true
				}
				aiName := strings.ToLower(ai.Name())
				ajName := strings.ToLower(aj.Name())
				aiExact := aiName == queryLower
				ajExact := ajName == queryLower
				if aiExact != ajExact {
					return aiExact && !ajExact
				}
				aiPrefix := strings.HasPrefix(aiName, queryLower)
				ajPrefix := strings.HasPrefix(ajName, queryLower)
				if aiPrefix == ajPrefix {
					return false
				}
				return aiPrefix && !ajPrefix
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

func (p *PlacesAPI) allHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		places, err := dbmodels.Places_All(app)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"error": "failed to load places"})
		}
		dbmodels.Sort_Places_Name(places)
		options := make([]map[string]string, 0, len(places))
		for _, place := range places {
			if place == nil {
				continue
			}
			options = append(options, map[string]string{
				"value": place.Id,
				"label": place.Name(),
			})
		}
		return e.JSON(http.StatusOK, options)
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
