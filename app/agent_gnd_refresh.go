package app

import (
	"context"
	"reflect"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	gndprovider "github.com/Theodor-Springmann-Stiftung/musenalm/providers/gnd"
)

func (app *App) ScheduleAgentGNDRefresh(agentID string) {
	if app == nil || app.PB == nil {
		return
	}

	agentID = strings.TrimSpace(agentID)
	if agentID == "" {
		return
	}

	go app.refreshAgentGND(agentID)
}

func (app *App) refreshAgentGND(agentID string) {
	agent, err := dbmodels.Agents_ID(app.PB.App, agentID)
	if err != nil {
		app.Logger().Error("Failed to load agent for async GND refresh", "agent_id", agentID, "error", err)
		return
	}

	startURI := gndprovider.NormalizeURI(agent.URI())
	startData := agent.Data()
	app.Logger().Info("Starting async GND refresh", "agent_id", agentID, "uri", startURI)

	targetURI := startURI
	targetData := gndprovider.ClearedData(startData)

	if startURI != "" && gndprovider.IsGNDURI(startURI) {
		syncedURI, syncedData, err := gndprovider.SyncData(context.Background(), startURI, startData)
		if err != nil {
			app.Logger().Warn("Async GND refresh failed; clearing stale metadata", "agent_id", agentID, "uri", startURI, "error", err)
		} else {
			targetURI = syncedURI
			targetData = syncedData
		}
	} else {
		app.Logger().Info("Clearing GND metadata for non-DNB URI", "agent_id", agentID, "uri", startURI)
	}

	current, err := dbmodels.Agents_ID(app.PB.App, agentID)
	if err != nil {
		app.Logger().Error("Failed to reload agent for async GND refresh", "agent_id", agentID, "error", err)
		return
	}

	currentURI := gndprovider.NormalizeURI(current.URI())
	if currentURI != startURI {
		app.Logger().Info("Skipping stale async GND refresh result", "agent_id", agentID, "start_uri", startURI, "current_uri", currentURI)
		return
	}

	if currentURI == targetURI && reflect.DeepEqual(current.Data(), targetData) {
		app.Logger().Info("Async GND refresh produced no changes", "agent_id", agentID, "uri", currentURI)
		return
	}

	current.SetURI(targetURI)
	current.SetData(targetData)
	if err := app.PB.Save(current); err != nil {
		app.Logger().Error("Failed to save async GND refresh result", "agent_id", agentID, "uri", targetURI, "error", err)
		return
	}

	plan := newDisplayRefreshPlan()
	plan.updateAgents[agentID] = struct{}{}
	app.ScheduleDisplayCacheRefresh(plan)
	app.Logger().Info("Completed async GND refresh", "agent_id", agentID, "uri", targetURI)
}
