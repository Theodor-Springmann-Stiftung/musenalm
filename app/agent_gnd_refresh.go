package app

import (
	"context"
	"errors"
	"fmt"
	"reflect"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	gndprovider "github.com/Theodor-Springmann-Stiftung/musenalm/providers/gnd"
)

var (
	ErrLinkedDataRefreshUnsupportedURI = errors.New("linked data refresh unsupported for URI")
	ErrLinkedDataRefreshStaleURI       = errors.New("linked data refresh URI changed")
)

type linkedDataRefreshResult struct {
	URI      string
	Data     map[string]any
	Provider string
}

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

	result, err := syncAgentLinkedData(context.Background(), startURI, startData)
	if err != nil {
		if errors.Is(err, ErrLinkedDataRefreshUnsupportedURI) {
			app.Logger().Info("Clearing linked metadata for unsupported URI", "agent_id", agentID, "uri", startURI)
		} else {
			app.Logger().Warn("Async linked data refresh failed; clearing stale metadata", "agent_id", agentID, "uri", startURI, "error", err)
		}
	} else {
		targetURI = result.URI
		targetData = result.Data
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

func (app *App) CanRefreshAgentLinkedDataURI(uri string) bool {
	return linkedDataProviderForURI(uri) != ""
}

func (app *App) RefreshAgentLinkedData(agentID string) (*dbmodels.Agent, error) {
	if app == nil || app.PB == nil {
		return nil, fmt.Errorf("app is not initialized")
	}

	agentID = strings.TrimSpace(agentID)
	if agentID == "" {
		return nil, fmt.Errorf("agent id is required")
	}

	agent, err := dbmodels.Agents_ID(app.PB.App, agentID)
	if err != nil {
		return nil, err
	}

	startURI := gndprovider.NormalizeURI(agent.URI())
	startData := agent.Data()

	result, err := syncAgentLinkedData(context.Background(), startURI, startData)
	if err != nil {
		return nil, err
	}

	current, err := dbmodels.Agents_ID(app.PB.App, agentID)
	if err != nil {
		return nil, err
	}

	currentURI := gndprovider.NormalizeURI(current.URI())
	if currentURI != startURI {
		return nil, fmt.Errorf("%w: %s", ErrLinkedDataRefreshStaleURI, agentID)
	}

	if currentURI == result.URI && reflect.DeepEqual(current.Data(), result.Data) {
		return current, nil
	}

	current.SetURI(result.URI)
	current.SetData(result.Data)
	if err := app.PB.Save(current); err != nil {
		return nil, err
	}

	plan := newDisplayRefreshPlan()
	plan.updateAgents[agentID] = struct{}{}
	app.ScheduleDisplayCacheRefresh(plan)
	return current, nil
}

func linkedDataProviderForURI(uri string) string {
	normalizedURI := gndprovider.NormalizeURI(uri)
	if normalizedURI == "" {
		return ""
	}
	if gndprovider.IsGNDURI(normalizedURI) {
		return "gnd"
	}
	return ""
}

func syncAgentLinkedData(ctx context.Context, uri string, data map[string]any) (linkedDataRefreshResult, error) {
	normalizedURI := gndprovider.NormalizeURI(uri)
	switch linkedDataProviderForURI(normalizedURI) {
	case "gnd":
		syncedURI, syncedData, err := gndprovider.SyncData(ctx, normalizedURI, data)
		if err != nil {
			return linkedDataRefreshResult{}, err
		}
		return linkedDataRefreshResult{
			URI:      syncedURI,
			Data:     syncedData,
			Provider: "gnd",
		}, nil
	default:
		return linkedDataRefreshResult{}, fmt.Errorf("%w: %q", ErrLinkedDataRefreshUnsupportedURI, normalizedURI)
	}
}
