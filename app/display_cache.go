package app

import (
	"fmt"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
)

type DisplayCache struct {
	Agents   map[string]*AgentDisplay
	Series   map[string]*SeriesDisplay
	Entries  map[string]*EntryDisplay
	Places   map[string]*PlaceDisplay
	Contents map[string]*ContentDisplay
	CachedAt time.Time
}

type AgentDisplay struct {
	ID         string
	Id         string
	MusenalmID int
	Name       string
	LifeDates  string
	Fictional  bool
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

func (app *App) ScheduleDisplayCacheRebuild() {
	app.displayCacheRefreshMutex.Lock()
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
		app.displayCacheRefreshQueued = false
		app.displayCacheRefreshMutex.Unlock()

		if _, err := app.rebuildDisplayCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild display cache", "error", err)
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

func (app *App) EnsureDisplayCache() (*DisplayCache, error) {
	if cache := app.displayCache.Load(); cache != nil {
		return cache, nil
	}

	app.displayCacheBuildMutex.Lock()
	defer app.displayCacheBuildMutex.Unlock()

	if cache := app.displayCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextDisplayCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.displayCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildDisplayCache() (*DisplayCache, error) {
	app.displayCacheBuildMutex.Lock()
	defer app.displayCacheBuildMutex.Unlock()

	cache, err := app.nextDisplayCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.displayCache.Store(cache)
	return cache, nil
}

func (app *App) nextDisplayCacheSnapshot() (*DisplayCache, error) {
	if app.displayCacheBuildFunc != nil {
		return app.displayCacheBuildFunc()
	}
	return app.buildDisplayCache()
}

func (app *App) buildDisplayCache() (*DisplayCache, error) {
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

	cache := &DisplayCache{
		Agents:   make(map[string]*AgentDisplay, len(agents)),
		Series:   make(map[string]*SeriesDisplay, len(series)),
		Entries:  make(map[string]*EntryDisplay, len(entries)),
		Places:   make(map[string]*PlaceDisplay, len(places)),
		Contents: make(map[string]*ContentDisplay, len(contents)),
		CachedAt: time.Now(),
	}

	for _, agent := range agents {
		if agent == nil || agent.Id == "" {
			continue
		}
		cache.Agents[agent.Id] = buildAgentDisplay(agent)
	}

	for _, currentSeries := range series {
		if currentSeries == nil || currentSeries.Id == "" {
			continue
		}
		cache.Series[currentSeries.Id] = buildSeriesDisplay(currentSeries)
	}

	for _, entry := range entries {
		if entry == nil || entry.Id == "" {
			continue
		}
		cache.Entries[entry.Id] = buildEntryDisplay(entry)
	}

	for _, place := range places {
		if place == nil || place.Id == "" {
			continue
		}
		cache.Places[place.Id] = buildPlaceDisplay(place)
	}

	for _, content := range contents {
		if content == nil || content.Id == "" {
			continue
		}
		cache.Contents[content.Id] = buildContentDisplay(content)
	}

	return cache, nil
}

func (app *App) GetAgentDisplay(id string) *AgentDisplay {
	cache, err := app.EnsureDisplayCache()
	if err != nil {
		app.PB.Logger().Error("failed to ensure agent display cache", "agent_id", id, "error", err)
		return fallbackAgentDisplay(id)
	}
	if display := cache.Agents[id]; display != nil {
		return display
	}
	return fallbackAgentDisplay(id)
}

func (app *App) GetSeriesDisplay(id string) *SeriesDisplay {
	cache, err := app.EnsureDisplayCache()
	if err != nil {
		app.PB.Logger().Error("failed to ensure series display cache", "series_id", id, "error", err)
		return fallbackSeriesDisplay(id)
	}
	if display := cache.Series[id]; display != nil {
		return display
	}
	return fallbackSeriesDisplay(id)
}

func (app *App) GetEntryDisplay(id string) *EntryDisplay {
	cache, err := app.EnsureDisplayCache()
	if err != nil {
		app.PB.Logger().Error("failed to ensure entry display cache", "entry_id", id, "error", err)
		return fallbackEntryDisplay(id)
	}
	if display := cache.Entries[id]; display != nil {
		return display
	}
	return fallbackEntryDisplay(id)
}

func (app *App) GetPlaceDisplay(id string) *PlaceDisplay {
	cache, err := app.EnsureDisplayCache()
	if err != nil {
		app.PB.Logger().Error("failed to ensure place display cache", "place_id", id, "error", err)
		return fallbackPlaceDisplay(id)
	}
	if display := cache.Places[id]; display != nil {
		return display
	}
	return fallbackPlaceDisplay(id)
}

func (app *App) GetContentDisplay(id string) *ContentDisplay {
	cache, err := app.EnsureDisplayCache()
	if err != nil {
		app.PB.Logger().Error("failed to ensure content display cache", "content_id", id, "error", err)
		return fallbackContentDisplay(id)
	}
	if display := cache.Contents[id]; display != nil {
		return display
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
	return &ContentDisplay{
		ID:         content.Id,
		Id:         content.Id,
		MusenalmID: content.MusenalmID(),
		Title:      buildContentDisplayTitle(content),
		Page:       buildContentDisplayPage(content),
		ScanCount:  len(content.Scans()),
		Type:       buildContentDisplayType(content),
	}
}

func buildContentDisplayTitle(content *dbmodels.Content) string {
	if content == nil {
		return ""
	}

	return buildContentDisplayTitleFromFields(
		content.PreferredTitle(),
		content.TitleStmt(),
		content.SubtitleStmt(),
		content.IncipitStmt(),
		content.MusenalmType(),
		content.ResponsibilityStmt(),
		content.Extent(),
		content.MusenalmID(),
	)
}

func buildContentDisplayTitleFromFields(
	preferredTitle string,
	title string,
	subtitle string,
	incipit string,
	musenalmTypes []string,
	responsibility string,
	extent string,
	musenalmID int,
) string {
	if preferredTitle = strings.TrimSpace(preferredTitle); preferredTitle != "" {
		return preferredTitle
	}
	if title = strings.TrimSpace(title); title != "" {
		return title
	}
	if subtitle = strings.TrimSpace(subtitle); subtitle != "" {
		return subtitle
	}
	if incipit = strings.TrimSpace(incipit); incipit != "" {
		return incipit
	}

	typeLabel := strings.Join(cleanDisplayStrings(musenalmTypes), ", ")
	if responsibility = strings.TrimSpace(responsibility); responsibility != "" && !strings.EqualFold(responsibility, "unbezeichnet") {
		if typeLabel != "" {
			return fmt.Sprintf("[%s] Unterzeichnet: %s", typeLabel, responsibility)
		}
		return fmt.Sprintf("Unterzeichnet: %s", responsibility)
	}

	if extent = strings.TrimSpace(extent); extent != "" {
		if typeLabel == "" {
			typeLabel = "Beitrag"
		}
		return fmt.Sprintf("[%s %s]", typeLabel, extent)
	}

	if musenalmID > 0 {
		return fmt.Sprintf("Inhalt #%d", musenalmID)
	}

	if typeLabel != "" {
		return fmt.Sprintf("[%s]", typeLabel)
	}

	return "Beitrag"
}

func buildContentDisplayPage(content *dbmodels.Content) string {
	if content == nil {
		return ""
	}

	return buildContentDisplayPageFromFields(content.MusenalmPagination(), content.Extent())
}

func buildContentDisplayType(content *dbmodels.Content) string {
	if content == nil {
		return ""
	}

	types := cleanDisplayStrings(content.MusenalmType())
	if len(types) == 0 {
		types = cleanDisplayStrings(content.ContentType())
	}
	return strings.Join(types, ", ")
}

func cleanDisplayStrings(values []string) []string {
	cleaned := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		cleaned = append(cleaned, value)
	}
	return cleaned
}

func buildContentDisplayPageFromFields(pagination string, extent string) string {
	if pagination = strings.TrimSpace(pagination); pagination != "" {
		return pagination
	}
	return strings.TrimSpace(extent)
}

func fallbackAgentDisplay(id string) *AgentDisplay {
	return &AgentDisplay{
		ID:   id,
		Id:   id,
		Name: id,
	}
}

func fallbackSeriesDisplay(id string) *SeriesDisplay {
	return &SeriesDisplay{
		ID:   id,
		Id:   id,
		Name: id,
	}
}

func fallbackEntryDisplay(id string) *EntryDisplay {
	return &EntryDisplay{
		ID:             id,
		Id:             id,
		ShortTitle:     id,
		PreferredTitle: id,
		Title:          id,
		TitleStmt:      id,
	}
}

func fallbackPlaceDisplay(id string) *PlaceDisplay {
	return &PlaceDisplay{
		ID:   id,
		Id:   id,
		Name: id,
	}
}

func fallbackContentDisplay(id string) *ContentDisplay {
	return &ContentDisplay{
		ID:    id,
		Id:    id,
		Title: id,
	}
}
