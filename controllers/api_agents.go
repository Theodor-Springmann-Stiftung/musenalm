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
	app.Register(&AgentsAPI{})
}

type AgentsAPI struct{}

func (p *AgentsAPI) Up(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *AgentsAPI) Down(ia pagemodels.IApp, engine *templating.Engine) error {
	return nil
}

func (p *AgentsAPI) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_API_AGENTS)
	rg.BindFunc(middleware.Authenticated(app))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_API_AGENTS_SEARCH, p.searchHandler(app))
	return nil
}

func (p *AgentsAPI) searchHandler(app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		query := strings.TrimSpace(e.Request.URL.Query().Get("q"))
		queryLower := strings.ToLower(query)
		limit := parseAgentsLimit(e.Request.URL.Query().Get("limit"))

		results, err := dbmodels.TitleSearchAgents(app, query)
		if err != nil {
			app.Logger().Error("agent search failed", "query", query, "limit", limit, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "failed to search agents",
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

		seen := map[string]bool{}
		response := make([]map[string]string, 0, len(results))
		for _, agent := range results {
			if agent == nil || seen[agent.Id] {
				continue
			}
			seen[agent.Id] = true
			response = append(response, map[string]string{
				"id":          agent.Id,
				"name":        agent.Name(),
				"detail":      agent.Pseudonyms(),
				"bio":         agent.BiographicalData(),
				"musenalm_id": strconv.Itoa(agent.MusenalmID()),
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
