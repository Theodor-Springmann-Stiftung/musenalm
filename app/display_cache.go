package app

import (
	"fmt"
	"strings"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
)

type DisplayCache struct {
	Agents   sync.Map
	Series   sync.Map
	Entries  sync.Map
	Places   sync.Map
	Contents sync.Map
}

type displaySnapshot struct {
	Agents   map[string]*AgentDisplay
	Series   map[string]*SeriesDisplay
	Entries  map[string]*EntryDisplay
	Places   map[string]*PlaceDisplay
	Contents map[string]*ContentDisplay
}

type displayRefreshPlan struct {
	full           bool
	updateAgents   map[string]struct{}
	deleteAgents   map[string]struct{}
	updateSeries   map[string]struct{}
	deleteSeries   map[string]struct{}
	updateEntries  map[string]struct{}
	deleteEntries  map[string]struct{}
	updatePlaces   map[string]struct{}
	deletePlaces   map[string]struct{}
	updateContents map[string]struct{}
	deleteContents map[string]struct{}
}

type AgentDisplay struct {
	ID         string
	Id         string
	MusenalmID int
	Name       string
	LifeDates  string
	Fictional  bool
	EditState  string
}

type SeriesDisplay struct {
	ID         string
	Id         string
	MusenalmID int
	Name       string
}

type EntryDisplay struct {
	ID             string
	Id             string
	MusenalmID     int
	ShortTitle     string
	PreferredTitle string
	Title          string
	TitleStmt      string
	Year           int
	EditState      string
	Language       []string
}

type PlaceDisplay struct {
	ID         string
	Id         string
	MusenalmID int
	Name       string
	Fictional  bool
}

type ContentDisplay struct {
	ID         string
	Id         string
	MusenalmID int
	Title      string
	Page       string
	ScanCount  int
	Type       string
}

func NewDisplayCache() *DisplayCache {
	return &DisplayCache{}
}

func newDisplayRefreshPlan() displayRefreshPlan {
	return displayRefreshPlan{
		updateAgents:   map[string]struct{}{},
		deleteAgents:   map[string]struct{}{},
		updateSeries:   map[string]struct{}{},
		deleteSeries:   map[string]struct{}{},
		updateEntries:  map[string]struct{}{},
		deleteEntries:  map[string]struct{}{},
		updatePlaces:   map[string]struct{}{},
		deletePlaces:   map[string]struct{}{},
		updateContents: map[string]struct{}{},
		deleteContents: map[string]struct{}{},
	}
}

func (p displayRefreshPlan) hasWork() bool {
	return p.full ||
		len(p.updateAgents) > 0 ||
		len(p.deleteAgents) > 0 ||
		len(p.updateSeries) > 0 ||
		len(p.deleteSeries) > 0 ||
		len(p.updateEntries) > 0 ||
		len(p.deleteEntries) > 0 ||
		len(p.updatePlaces) > 0 ||
		len(p.deletePlaces) > 0 ||
		len(p.updateContents) > 0 ||
		len(p.deleteContents) > 0
}

func (p *displayRefreshPlan) merge(other displayRefreshPlan) {
	if other.full {
		p.full = true
	}

	mergeDisplaySet(p.updateAgents, p.deleteAgents, other.updateAgents, other.deleteAgents)
	mergeDisplaySet(p.updateSeries, p.deleteSeries, other.updateSeries, other.deleteSeries)
	mergeDisplaySet(p.updateEntries, p.deleteEntries, other.updateEntries, other.deleteEntries)
	mergeDisplaySet(p.updatePlaces, p.deletePlaces, other.updatePlaces, other.deletePlaces)
	mergeDisplaySet(p.updateContents, p.deleteContents, other.updateContents, other.deleteContents)
}

func mergeDisplaySet(targetUpdates, targetDeletes, sourceUpdates, sourceDeletes map[string]struct{}) {
	for id := range sourceDeletes {
		delete(targetUpdates, id)
		targetDeletes[id] = struct{}{}
	}
	for id := range sourceUpdates {
		if _, deleted := targetDeletes[id]; deleted {
			continue
		}
		targetUpdates[id] = struct{}{}
	}
}

func displayRefreshPlanFromEffects(effects canonical.MutationEffects) displayRefreshPlan {
	plan := newDisplayRefreshPlan()

	for id := range effects.UpdateAgents {
		plan.updateAgents[id] = struct{}{}
	}
	for id := range effects.DeleteAgents {
		plan.deleteAgents[id] = struct{}{}
		delete(plan.updateAgents, id)
	}

	for id := range effects.UpdateSeries {
		plan.updateSeries[id] = struct{}{}
	}
	for id := range effects.DeleteSeries {
		plan.deleteSeries[id] = struct{}{}
		delete(plan.updateSeries, id)
	}

	for id := range effects.UpdateEntries {
		plan.updateEntries[id] = struct{}{}
	}
	for id := range effects.DeleteEntries {
		plan.deleteEntries[id] = struct{}{}
		delete(plan.updateEntries, id)
	}

	for id := range effects.UpdatePlaces {
		plan.updatePlaces[id] = struct{}{}
	}
	for id := range effects.DeletePlaces {
		plan.deletePlaces[id] = struct{}{}
		delete(plan.updatePlaces, id)
	}

	for id := range effects.UpdateContents {
		plan.updateContents[id] = struct{}{}
	}
	for id := range effects.DeleteContents {
		plan.deleteContents[id] = struct{}{}
		delete(plan.updateContents, id)
	}

	return plan
}

func (app *App) ScheduleDisplayCacheRebuild() {
	plan := newDisplayRefreshPlan()
	plan.full = true
	app.ScheduleDisplayCacheRefresh(plan)
}

func (app *App) ScheduleDisplayCacheRefresh(plan displayRefreshPlan) {
	if !plan.hasWork() {
		return
	}

	app.displayCacheRefreshMutex.Lock()
	app.displayCacheRefreshPlan.merge(plan)
	app.displayCacheRefreshQueued = true
	if app.displayCacheRefreshRun {
		app.displayCacheRefreshMutex.Unlock()
		return
	}
	app.displayCacheRefreshRun = true
	app.displayCacheRefreshMutex.Unlock()

	go app.runDisplayCacheRefreshLoop()
}

func (app *App) runDisplayCacheRefreshLoop() {
	for {
		app.displayCacheRefreshMutex.Lock()
		plan := app.displayCacheRefreshPlan
		app.displayCacheRefreshPlan = newDisplayRefreshPlan()
		app.displayCacheRefreshQueued = false
		app.displayCacheRefreshMutex.Unlock()

		if err := app.applyDisplayRefreshPlan(plan); err != nil {
			app.PB.Logger().Error("failed to refresh display cache", "error", err)
		}

		app.displayCacheRefreshMutex.Lock()
		if app.displayCacheRefreshQueued {
			app.displayCacheRefreshMutex.Unlock()
			continue
		}
		app.displayCacheRefreshRun = false
		app.displayCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) applyDisplayRefreshPlan(plan displayRefreshPlan) error {
	if !plan.hasWork() {
		return nil
	}

	if plan.full {
		snapshot, err := app.buildDisplaySnapshot()
		if err != nil {
			return err
		}
		app.displayCache.replaceAll(snapshot)
		return nil
	}

	app.displayCache.deleteAgents(plan.deleteAgents)
	app.displayCache.deleteSeries(plan.deleteSeries)
	app.displayCache.deleteEntries(plan.deleteEntries)
	app.displayCache.deletePlaces(plan.deletePlaces)
	app.displayCache.deleteContents(plan.deleteContents)

	if err := app.refreshAgentDisplays(plan.updateAgents); err != nil {
		return err
	}
	if err := app.refreshSeriesDisplays(plan.updateSeries); err != nil {
		return err
	}
	if err := app.refreshEntryDisplays(plan.updateEntries); err != nil {
		return err
	}
	if err := app.refreshPlaceDisplays(plan.updatePlaces); err != nil {
		return err
	}
	if err := app.refreshContentDisplays(plan.updateContents); err != nil {
		return err
	}

	return nil
}

func (app *App) buildDisplaySnapshot() (*displaySnapshot, error) {
	agents := []*dbmodels.Agent{}
	if err := app.PB.RecordQuery(dbmodels.AGENTS_TABLE).
		OrderBy(dbmodels.AGENTS_NAME_FIELD).
		All(&agents); err != nil {
		return nil, err
	}

	series := []*dbmodels.Series{}
	if err := app.PB.RecordQuery(dbmodels.SERIES_TABLE).
		OrderBy(dbmodels.SERIES_TITLE_FIELD).
		All(&series); err != nil {
		return nil, err
	}

	entries := []*dbmodels.Entry{}
	if err := app.PB.RecordQuery(dbmodels.ENTRIES_TABLE).
		OrderBy(dbmodels.PREFERRED_TITLE_FIELD).
		All(&entries); err != nil {
		return nil, err
	}

	places := []*dbmodels.Place{}
	if err := app.PB.RecordQuery(dbmodels.PLACES_TABLE).
		OrderBy(dbmodels.PLACES_NAME_FIELD).
		All(&places); err != nil {
		return nil, err
	}

	contents := []*dbmodels.Content{}
	if err := app.PB.RecordQuery(dbmodels.CONTENTS_TABLE).
		OrderBy(dbmodels.MUSENALMID_FIELD).
		All(&contents); err != nil {
		return nil, err
	}

	snapshot := &displaySnapshot{
		Agents:   make(map[string]*AgentDisplay, len(agents)),
		Series:   make(map[string]*SeriesDisplay, len(series)),
		Entries:  make(map[string]*EntryDisplay, len(entries)),
		Places:   make(map[string]*PlaceDisplay, len(places)),
		Contents: make(map[string]*ContentDisplay, len(contents)),
	}

	for _, agent := range agents {
		if agent == nil || agent.Id == "" {
			continue
		}
		snapshot.Agents[agent.Id] = buildAgentDisplay(agent)
	}

	for _, currentSeries := range series {
		if currentSeries == nil || currentSeries.Id == "" {
			continue
		}
		snapshot.Series[currentSeries.Id] = buildSeriesDisplay(currentSeries)
	}

	for _, entry := range entries {
		if entry == nil || entry.Id == "" {
			continue
		}
		snapshot.Entries[entry.Id] = buildEntryDisplay(entry)
	}

	for _, place := range places {
		if place == nil || place.Id == "" {
			continue
		}
		snapshot.Places[place.Id] = buildPlaceDisplay(place)
	}

	for _, content := range contents {
		if content == nil || content.Id == "" {
			continue
		}
		snapshot.Contents[content.Id] = buildContentDisplay(content)
	}

	return snapshot, nil
}

func (app *App) refreshAgentDisplays(ids map[string]struct{}) error {
	if len(ids) == 0 {
		return nil
	}

	agents, err := dbmodels.Agents_IDs(app.PB.App, stringIDsToAny(ids))
	if err != nil {
		return err
	}
	for _, agent := range agents {
		if agent == nil || agent.Id == "" {
			continue
		}
		app.displayCache.Agents.Store(agent.Id, buildAgentDisplay(agent))
	}
	return nil
}

func (app *App) refreshSeriesDisplays(ids map[string]struct{}) error {
	if len(ids) == 0 {
		return nil
	}

	series, err := dbmodels.Series_IDs(app.PB.App, stringIDsToAny(ids))
	if err != nil {
		return err
	}
	for _, currentSeries := range series {
		if currentSeries == nil || currentSeries.Id == "" {
			continue
		}
		app.displayCache.Series.Store(currentSeries.Id, buildSeriesDisplay(currentSeries))
	}
	return nil
}

func (app *App) refreshEntryDisplays(ids map[string]struct{}) error {
	if len(ids) == 0 {
		return nil
	}

	entries, err := dbmodels.Entries_IDs(app.PB.App, stringIDsToAny(ids))
	if err != nil {
		return err
	}
	for _, entry := range entries {
		if entry == nil || entry.Id == "" {
			continue
		}
		app.displayCache.Entries.Store(entry.Id, buildEntryDisplay(entry))
	}
	return nil
}

func (app *App) refreshPlaceDisplays(ids map[string]struct{}) error {
	if len(ids) == 0 {
		return nil
	}

	places, err := dbmodels.Places_IDs(app.PB.App, stringIDsToAny(ids))
	if err != nil {
		return err
	}
	for _, place := range places {
		if place == nil || place.Id == "" {
			continue
		}
		app.displayCache.Places.Store(place.Id, buildPlaceDisplay(place))
	}
	return nil
}

func (app *App) refreshContentDisplays(ids map[string]struct{}) error {
	if len(ids) == 0 {
		return nil
	}

	contents, err := dbmodels.Contents_IDs(app.PB.App, stringIDsToAny(ids))
	if err != nil {
		return err
	}
	for _, content := range contents {
		if content == nil || content.Id == "" {
			continue
		}
		app.displayCache.Contents.Store(content.Id, buildContentDisplay(content))
	}
	return nil
}

func stringIDsToAny(ids map[string]struct{}) []any {
	values := make([]any, 0, len(ids))
	for id := range ids {
		values = append(values, id)
	}
	return values
}

func (c *DisplayCache) replaceAll(snapshot *displaySnapshot) {
	clearSyncMap(&c.Agents)
	clearSyncMap(&c.Series)
	clearSyncMap(&c.Entries)
	clearSyncMap(&c.Places)
	clearSyncMap(&c.Contents)

	for id, value := range snapshot.Agents {
		c.Agents.Store(id, value)
	}
	for id, value := range snapshot.Series {
		c.Series.Store(id, value)
	}
	for id, value := range snapshot.Entries {
		c.Entries.Store(id, value)
	}
	for id, value := range snapshot.Places {
		c.Places.Store(id, value)
	}
	for id, value := range snapshot.Contents {
		c.Contents.Store(id, value)
	}
}

func (c *DisplayCache) deleteAgents(ids map[string]struct{}) {
	for id := range ids {
		c.Agents.Delete(id)
	}
}

func (c *DisplayCache) deleteSeries(ids map[string]struct{}) {
	for id := range ids {
		c.Series.Delete(id)
	}
}

func (c *DisplayCache) deleteEntries(ids map[string]struct{}) {
	for id := range ids {
		c.Entries.Delete(id)
	}
}

func (c *DisplayCache) deletePlaces(ids map[string]struct{}) {
	for id := range ids {
		c.Places.Delete(id)
	}
}

func (c *DisplayCache) deleteContents(ids map[string]struct{}) {
	for id := range ids {
		c.Contents.Delete(id)
	}
}

func clearSyncMap(m *sync.Map) {
	m.Range(func(key, _ any) bool {
		m.Delete(key)
		return true
	})
}

func (app *App) GetAgentDisplay(id string) *AgentDisplay {
	if display, ok := app.displayCache.Agents.Load(id); ok {
		if casted, ok := display.(*AgentDisplay); ok && casted != nil {
			return casted
		}
	}
	return fallbackAgentDisplay(id)
}

func (app *App) GetSeriesDisplay(id string) *SeriesDisplay {
	if display, ok := app.displayCache.Series.Load(id); ok {
		if casted, ok := display.(*SeriesDisplay); ok && casted != nil {
			return casted
		}
	}
	return fallbackSeriesDisplay(id)
}

func (app *App) GetEntryDisplay(id string) *EntryDisplay {
	if display, ok := app.displayCache.Entries.Load(id); ok {
		if casted, ok := display.(*EntryDisplay); ok && casted != nil {
			return casted
		}
	}
	return fallbackEntryDisplay(id)
}

func (app *App) GetPlaceDisplay(id string) *PlaceDisplay {
	if display, ok := app.displayCache.Places.Load(id); ok {
		if casted, ok := display.(*PlaceDisplay); ok && casted != nil {
			return casted
		}
	}
	return fallbackPlaceDisplay(id)
}

func (app *App) GetContentDisplay(id string) *ContentDisplay {
	if display, ok := app.displayCache.Contents.Load(id); ok {
		if casted, ok := display.(*ContentDisplay); ok && casted != nil {
			return casted
		}
	}
	return fallbackContentDisplay(id)
}

func buildAgentDisplay(agent *dbmodels.Agent) *AgentDisplay {
	return &AgentDisplay{
		ID:         agent.Id,
		Id:         agent.Id,
		MusenalmID: agent.MusenalmID(),
		Name:       strings.TrimSpace(agent.Name()),
		LifeDates:  strings.TrimSpace(agent.BiographicalData()),
		Fictional:  agent.Fictional(),
		EditState:  strings.TrimSpace(agent.EditState()),
	}
}

func buildSeriesDisplay(series *dbmodels.Series) *SeriesDisplay {
	return &SeriesDisplay{
		ID:         series.Id,
		Id:         series.Id,
		MusenalmID: series.MusenalmID(),
		Name:       strings.TrimSpace(series.Title()),
	}
}

func buildEntryDisplay(entry *dbmodels.Entry) *EntryDisplay {
	preferredTitle := strings.TrimSpace(entry.PreferredTitle())
	title := strings.TrimSpace(entry.TitleStmt())
	return &EntryDisplay{
		ID:             entry.Id,
		Id:             entry.Id,
		MusenalmID:     entry.MusenalmID(),
		ShortTitle:     preferredTitle,
		PreferredTitle: preferredTitle,
		Title:          title,
		TitleStmt:      title,
		Year:           entry.Year(),
		EditState:      strings.TrimSpace(entry.EditState()),
		Language:       append([]string(nil), entry.Language()...),
	}
}

func buildPlaceDisplay(place *dbmodels.Place) *PlaceDisplay {
	return &PlaceDisplay{
		ID:         place.Id,
		Id:         place.Id,
		MusenalmID: place.MusenalmID(),
		Name:       strings.TrimSpace(place.Name()),
		Fictional:  place.Fictional(),
	}
}

func buildContentDisplay(content *dbmodels.Content) *ContentDisplay {
	types := make([]string, 0, len(content.MusenalmType()))
	for _, typ := range content.MusenalmType() {
		trimmed := strings.TrimSpace(typ)
		if trimmed != "" {
			types = append(types, trimmed)
		}
	}

	return &ContentDisplay{
		ID:         content.Id,
		Id:         content.Id,
		MusenalmID: content.MusenalmID(),
		Title: buildContentDisplayTitleFromFields(
			content.PreferredTitle(),
			content.TitleStmt(),
			content.SubtitleStmt(),
			content.IncipitStmt(),
			types,
			content.ResponsibilityStmt(),
			content.Extent(),
			content.MusenalmID(),
		),
		Page:      buildContentDisplayPageFromFields(content.MusenalmPagination(), content.Extent()),
		ScanCount: len(content.Scans()),
		Type:      strings.Join(types, ", "),
	}
}

func buildContentDisplayTitleFromFields(preferredTitle, title, subtitle, incipit string, types []string, responsibility, extent string, musenalmID int) string {
	if trimmed := strings.TrimSpace(preferredTitle); trimmed != "" {
		return trimmed
	}
	if trimmed := strings.TrimSpace(title); trimmed != "" {
		if sub := strings.TrimSpace(subtitle); sub != "" {
			return trimmed + ": " + sub
		}
		return trimmed
	}
	if trimmed := strings.TrimSpace(incipit); trimmed != "" {
		return trimmed
	}

	parts := make([]string, 0, 3)
	if len(types) > 0 {
		parts = append(parts, "["+strings.Join(types, ", ")+"]")
	}
	if trimmed := strings.TrimSpace(responsibility); trimmed != "" {
		parts = append(parts, "Unterzeichnet: "+trimmed)
	}
	if trimmed := strings.TrimSpace(extent); trimmed != "" {
		parts = append(parts, trimmed)
	}
	if len(parts) > 0 {
		return strings.Join(parts, " ")
	}

	return fmt.Sprintf("Inhalt #%d", musenalmID)
}

func buildContentDisplayPageFromFields(pagination, extent string) string {
	if trimmed := strings.TrimSpace(pagination); trimmed != "" {
		return trimmed
	}
	return strings.TrimSpace(extent)
}

func fallbackAgentDisplay(id string) *AgentDisplay {
	return &AgentDisplay{ID: id, Id: id, Name: id}
}

func fallbackSeriesDisplay(id string) *SeriesDisplay {
	return &SeriesDisplay{ID: id, Id: id, Name: id}
}

func fallbackEntryDisplay(id string) *EntryDisplay {
	return &EntryDisplay{ID: id, Id: id, ShortTitle: id, PreferredTitle: id, Title: id, TitleStmt: id}
}

func fallbackPlaceDisplay(id string) *PlaceDisplay {
	return &PlaceDisplay{ID: id, Id: id, Name: id}
}

func fallbackContentDisplay(id string) *ContentDisplay {
	return &ContentDisplay{ID: id, Id: id, Title: id}
}
