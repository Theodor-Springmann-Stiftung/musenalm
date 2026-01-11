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
	URL_API_ENTRIES        = "/api/entries"
	URL_API_ENTRIES_SEARCH = "/search"
)

func init() {
	app.Register(&EntriesAPI{})
}

type EntriesAPI struct{}

func (p *EntriesAPI) Up(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *EntriesAPI) Down(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *EntriesAPI) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_API_ENTRIES)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_API_ENTRIES_SEARCH, p.searchHandler(app))
	return nil
}

func (p *EntriesAPI) searchHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		query := strings.TrimSpace(e.Request.URL.Query().Get("q"))
		limit := parseEntriesLimit(e.Request.URL.Query().Get("limit"))

		results, err := dbmodels.TitleSearchEntries(app, query)
		if err != nil {
			app.Logger().Error("entry search failed", "query", query, "limit", limit, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "failed to search entries",
			})
		}

		seen := map[string]bool{}
		response := make([]map[string]string, 0, len(results))
		for _, entry := range results {
			if entry == nil || seen[entry.Id] {
				continue
			}
			seen[entry.Id] = true

			detail := ""
			if entry.Year() != 0 {
				detail = strconv.Itoa(entry.Year())
			}

			response = append(response, map[string]string{
				"id":     entry.Id,
				"name":   entry.PreferredTitle(),
				"detail": detail,
			})
			if limit > 0 && len(response) >= limit {
				break
			}
		}

		return e.JSON(http.StatusOK, map[string]any{
			"entries": response,
		})
	}
}

func parseEntriesLimit(value string) int {
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
