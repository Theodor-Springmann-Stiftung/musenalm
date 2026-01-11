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
	URL_API_AGENTS        = "/api/agents"
	URL_API_AGENTS_SEARCH = "/search"
)

func init() {
	app.Register(&AgentsAPI{})
}

type AgentsAPI struct{}

func (p *AgentsAPI) Up(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *AgentsAPI) Down(app core.App, engine *templating.Engine) error {
	return nil
}

func (p *AgentsAPI) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	rg := router.Group(URL_API_AGENTS)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_API_AGENTS_SEARCH, p.searchHandler(app))
	return nil
}

func (p *AgentsAPI) searchHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		query := strings.TrimSpace(e.Request.URL.Query().Get("q"))
		limit := parseAgentsLimit(e.Request.URL.Query().Get("limit"))

		results, err := dbmodels.TitleSearchAgents(app, query)
		if err != nil {
			app.Logger().Error("agent search failed", "query", query, "limit", limit, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "failed to search agents",
			})
		}

		seen := map[string]bool{}
		response := make([]map[string]string, 0, len(results))
		for _, agent := range results {
			if agent == nil || seen[agent.Id] {
				continue
			}
			seen[agent.Id] = true
			response = append(response, map[string]string{
				"id":     agent.Id,
				"name":   agent.Name(),
				"detail": agent.Pseudonyms(),
				"bio":    agent.BiographicalData(),
			})
			if limit > 0 && len(response) >= limit {
				break
			}
		}

		return e.JSON(http.StatusOK, map[string]any{
			"agents": response,
		})
	}
}

func parseAgentsLimit(value string) int {
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
