package app

import (
	"sort"

	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func (app *App) HandleCanonicalEffects(pbApp core.App, effects canonical.MutationEffects) {
	if effects.InvalidateSortedEntries {
		InvalidateSortedEntriesCache(pbApp)
	}
	if effects.ResetBaende {
		app.ResetBaendeCache()
	}
	if effects.ResetEntryAgentOrder {
		app.ResetEntryAgentOrderCache()
	}
	if effects.ResetContentAgentOrder {
		app.ResetContentAgentOrderCache()
	}
	if effects.ResetPlaceOrder {
		app.ResetPlaceOrderCache()
	}
	if effects.ResetSeriesOrder {
		app.ResetSeriesOrderCache()
	}
	if displayPlan := displayRefreshPlanFromEffects(effects); displayPlan.hasWork() {
		app.ScheduleDisplayCacheRefresh(displayPlan)
	}
	if !effects.HasAsyncWork() {
		return
	}

	cloned := effects.Clone()
	go app.runCanonicalEffects(pbApp, cloned)
}

func (app *App) runCanonicalEffects(pbApp core.App, effects canonical.MutationEffects) {
	for _, contentID := range sortedIDs(effects.DeleteContents) {
		if err := dbmodels.DeleteFTS5Content(pbApp, contentID); err != nil {
			pbApp.Logger().Error("Failed to delete FTS5 content", "content_id", contentID, "error", err)
		}
	}

	for _, entryID := range sortedIDs(effects.DeleteEntries) {
		if err := dbmodels.DeleteFTS5Entry(pbApp, entryID); err != nil {
			pbApp.Logger().Error("Failed to delete FTS5 entry", "entry_id", entryID, "error", err)
		}
	}

	for _, agentID := range sortedIDs(effects.DeleteAgents) {
		if err := dbmodels.DeleteFTS5Agent(pbApp, agentID); err != nil {
			pbApp.Logger().Error("Failed to delete FTS5 agent", "agent_id", agentID, "error", err)
		}
	}

	for _, placeID := range sortedIDs(effects.DeletePlaces) {
		if err := dbmodels.DeleteFTS5Place(pbApp, placeID); err != nil {
			pbApp.Logger().Error("Failed to delete place from FTS5", "place_id", placeID, "error", err)
		}
	}

	for _, seriesID := range sortedIDs(effects.DeleteSeries) {
		if err := dbmodels.DeleteFTS5Series(pbApp, seriesID); err != nil {
			pbApp.Logger().Error("Failed to delete series from FTS5", "series_id", seriesID, "error", err)
		}
	}

	for _, agentID := range sortedBoolKeys(effects.UpdateAgents) {
		agent, err := dbmodels.Agents_ID(pbApp, agentID)
		if err != nil {
			pbApp.Logger().Error("Failed to load agent for FTS5 update", "agent_id", agentID, "error", err)
			continue
		}
		if effects.UpdateAgents[agentID] {
			if err := dbmodels.UpdateFTS5AgentAndRelated(pbApp, agent); err != nil {
				pbApp.Logger().Error("Failed to update FTS5 index for agent and related records", "agent_id", agentID, "error", err)
			}
			continue
		}
		if err := dbmodels.UpdateFTS5Agent(pbApp, agent); err != nil {
			pbApp.Logger().Error("Failed to update FTS5 index for agent", "agent_id", agentID, "error", err)
		}
	}

	for _, placeID := range sortedBoolKeys(effects.UpdatePlaces) {
		place, err := dbmodels.Places_ID(pbApp, placeID)
		if err != nil {
			pbApp.Logger().Error("Failed to load place for FTS5 update", "place_id", placeID, "error", err)
			continue
		}
		if effects.UpdatePlaces[placeID] {
			if err := dbmodels.UpdateFTS5PlaceAndRelatedEntries(pbApp, place); err != nil {
				pbApp.Logger().Error("Failed to update FTS5 index for place and entries", "place_id", placeID, "error", err)
			}
			continue
		}
		if err := dbmodels.UpdateFTS5Place(pbApp, place); err != nil {
			pbApp.Logger().Error("Failed to update FTS5 index for place", "place_id", placeID, "error", err)
		}
	}

	for _, seriesID := range sortedBoolKeys(effects.UpdateSeries) {
		series, err := dbmodels.Series_ID(pbApp, seriesID)
		if err != nil {
			pbApp.Logger().Error("Failed to load series for FTS5 update", "series_id", seriesID, "error", err)
			continue
		}
		if effects.UpdateSeries[seriesID] {
			if err := dbmodels.UpdateFTS5SeriesAndRelatedEntries(pbApp, series); err != nil {
				pbApp.Logger().Error("Failed to update FTS5 index for series and entries", "series_id", seriesID, "error", err)
			}
			continue
		}
		if err := dbmodels.UpdateFTS5Series(pbApp, series); err != nil {
			pbApp.Logger().Error("Failed to update FTS5 index for series", "series_id", seriesID, "error", err)
		}
	}

	for _, entryID := range sortedEntryModeKeys(effects.UpdateEntries) {
		entry, err := dbmodels.Entries_ID(pbApp, entryID)
		if err != nil {
			pbApp.Logger().Error("Failed to load entry for FTS5 update", "entry_id", entryID, "error", err)
			continue
		}
		if err := updateEntryFTS5WithContents(pbApp, entry, effects.UpdateEntries[entryID] == canonical.EntryFTSEntryAndContents); err != nil {
			pbApp.Logger().Error("Failed to update FTS5 index for entry", "entry_id", entryID, "error", err)
		}
	}

	if len(effects.UpdateContents) == 0 {
		return
	}

	byEntry := map[string][]string{}
	for contentID, entryID := range effects.UpdateContents {
		byEntry[entryID] = append(byEntry[entryID], contentID)
	}
	for entryID, contentIDs := range byEntry {
		entry, err := dbmodels.Entries_ID(pbApp, entryID)
		if err != nil {
			pbApp.Logger().Error("Failed to load entry for content FTS5 update", "entry_id", entryID, "error", err)
			continue
		}
		contentRefs := make([]any, 0, len(contentIDs))
		for _, contentID := range contentIDs {
			contentRefs = append(contentRefs, contentID)
		}
		contents, err := dbmodels.Contents_IDs(pbApp, contentRefs)
		if err != nil {
			pbApp.Logger().Error("Failed to load contents for FTS5 update", "entry_id", entryID, "error", err)
			continue
		}
		updateContentsFTS5(pbApp, entry, contents)
	}
}

func updateEntryFTS5WithContents(app core.App, entry *dbmodels.Entry, updateContents bool) error {
	if entry == nil {
		return nil
	}

	places := []*dbmodels.Place{}
	for _, placeID := range entry.Places() {
		place, err := dbmodels.Places_ID(app, placeID)
		if err == nil && place != nil {
			places = append(places, place)
		}
	}

	agents := []*dbmodels.Agent{}
	agentRelations, err := dbmodels.REntriesAgents_Entry(app, entry.Id)
	if err == nil {
		for _, relation := range agentRelations {
			agent, err := dbmodels.Agents_ID(app, relation.Agent())
			if err == nil && agent != nil {
				agents = append(agents, agent)
			}
		}
	}

	series := []*dbmodels.Series{}
	seriesRelations, err := dbmodels.REntriesSeries_Entry(app, entry.Id)
	if err == nil {
		for _, relation := range seriesRelations {
			seriesEntry, err := dbmodels.Series_ID(app, relation.Series())
			if err == nil && seriesEntry != nil {
				series = append(series, seriesEntry)
			}
		}
	}

	if updateContents {
		return dbmodels.UpdateFTS5EntryAndRelatedContents(app, entry, places, agents, series)
	}
	return dbmodels.UpdateFTS5Entry(app, entry, places, agents, series)
}

func updateContentsFTS5(app core.App, entry *dbmodels.Entry, contents []*dbmodels.Content) {
	if len(contents) == 0 {
		return
	}

	agents, relations, err := dbmodels.AgentsForContents(app, contents)
	if err != nil {
		app.Logger().Error("Failed to load content agents for FTS5 update", "entry_id", entry.Id, "error", err)
		return
	}

	for _, content := range contents {
		contentAgents := []*dbmodels.Agent{}
		for _, relation := range relations[content.Id] {
			if agent := agents[relation.Agent()]; agent != nil {
				contentAgents = append(contentAgents, agent)
			}
		}
		if err := dbmodels.UpdateFTS5Content(app, content, entry, contentAgents); err != nil {
			app.Logger().Error("Failed to update FTS5 content", "content_id", content.Id, "error", err)
		}
	}
}

func sortedIDs(values map[string]struct{}) []string {
	ids := make([]string, 0, len(values))
	for id := range values {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids
}

func sortedBoolKeys(values map[string]bool) []string {
	ids := make([]string, 0, len(values))
	for id := range values {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids
}

func sortedEntryModeKeys(values map[string]canonical.EntryFTSMode) []string {
	ids := make([]string, 0, len(values))
	for id := range values {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids
}
