package app

import (
	"context"
	"errors"
	"fmt"
	"slices"
	"strings"
	"sync"
	"time"
	"unicode"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	gndprovider "github.com/Theodor-Springmann-Stiftung/musenalm/providers/gnd"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/unicode/norm"
)

const (
	gndEnrichmentDataKey              = "gnd"
	gndEnrichmentQueryNameKey         = "gnd_query_name"
	gndEnrichmentQueryBioKey          = "gnd_query_biographical_data"
	gndEnrichmentMatchStrategyKey     = "gnd_match_strategy"
	gndEnrichmentCandidateCountKey    = "gnd_candidate_count"
	gndEnrichmentMatchedAtKey         = "gnd_matched_at"
	gndEnrichmentStatusSetting        = "agents_gnd_enrichment_status"
	gndEnrichmentMessageSetting       = "agents_gnd_enrichment_message"
	gndEnrichmentErrorSetting         = "agents_gnd_enrichment_error"
	gndEnrichmentDoneSetting          = "agents_gnd_enrichment_done"
	gndEnrichmentTotalSetting         = "agents_gnd_enrichment_total"
	gndEnrichmentLastRunSetting       = "agents_gnd_enrichment_last_run"
	gndEnrichmentWeakMatchScoreMin    = 110
	gndEnrichmentWeakMatchCommentNote = "DNB: weak Match"
)

var (
	gndEnrichmentNow      = func() time.Time { return time.Now().UTC() }
	gndEnrichmentRun      = func(app *App, ctx context.Context) error { return app.enrichAgentsWithGND(ctx) }
	gndEnrichmentMu       sync.Mutex
	gndEnrichmentRunning  bool
	gndEnrichmentCancel   context.CancelFunc
	gndEnrichmentRestart  bool
	gndEnrichmentStatusMu sync.RWMutex
	gndEnrichmentStatus   AgentGNDStatusSnapshot
)

type gndSearchResponse struct {
	TotalItems int              `json:"totalItems"`
	Member     []map[string]any `json:"member"`
}

type gndBiographicalHints struct {
	BirthYear string
	DeathYear string
	Extracted []string
	HasBC     bool
	Original  string
}

type gndCandidate struct {
	Record          map[string]any
	ID              string
	PreferredName   string
	VariantNames    []string
	BirthYears      []string
	DeathYears      []string
	Score           int
	ExactYearHits   int
	PartialYearHits int
	PreferredExact  bool
	VariantExact    bool
	ASCIIExact      bool
	NameOverlap     int
}

type gndMatchResult struct {
	AgentID        string
	Name           string
	MusenalmID     int
	Matched        bool
	URI            string
	Data           map[string]any
	CandidateCount int
	MatchStrategy  string
	ChosenGNDID    string
	Retried        bool
	WeakMatch      bool
	Err            error
}

type gndStats struct {
	Processed       int
	Matched         int
	Unmatched       int
	WeakMatches     int
	Retries         int
	Failures        int
	SkippedExisting int
}

type AgentGNDStatusSnapshot struct {
	Status  string
	Message string
	Error   string
	Done    int
	Total   int
}

func AgentGNDStatus() (AgentGNDStatusSnapshot, bool) {
	gndEnrichmentStatusMu.RLock()
	defer gndEnrichmentStatusMu.RUnlock()
	if gndEnrichmentStatus.Status == "" {
		return AgentGNDStatusSnapshot{}, false
	}
	return gndEnrichmentStatus, true
}

func AgentGNDIsRunning() bool {
	gndEnrichmentMu.Lock()
	defer gndEnrichmentMu.Unlock()
	return gndEnrichmentRunning
}

func StartAgentGNDEnrichment(app *App, allowRestart bool) (string, error) {
	if app == nil || app.PB == nil {
		return "", fmt.Errorf("app not available")
	}

	gndEnrichmentMu.Lock()
	if gndEnrichmentRunning {
		if allowRestart {
			gndEnrichmentRestart = true
			if gndEnrichmentCancel != nil {
				gndEnrichmentCancel()
			}
			snapshot, _ := AgentGNDStatus()
			setAgentGNDEnrichmentState(app, "restarting", "GND-Anreicherung wird neu gestartet.", snapshot.Done, snapshot.Total, "")
			gndEnrichmentMu.Unlock()
			return "restarting", nil
		}
		gndEnrichmentMu.Unlock()
		return "running", nil
	}

	ctx, cancel := context.WithCancel(context.Background())
	gndEnrichmentRunning = true
	gndEnrichmentCancel = cancel
	gndEnrichmentRestart = false
	gndEnrichmentMu.Unlock()

	go func() {
		app.Logger().Info("Manual GND enrichment started")
		err := gndEnrichmentRun(app, ctx)

		gndEnrichmentMu.Lock()
		restart := gndEnrichmentRestart
		gndEnrichmentRunning = false
		gndEnrichmentCancel = nil
		gndEnrichmentRestart = false
		gndEnrichmentMu.Unlock()

		if restart {
			app.Logger().Info("Manual GND enrichment restarting")
			_, _ = StartAgentGNDEnrichment(app, false)
			return
		}
		if errors.Is(err, context.Canceled) {
			app.Logger().Info("Manual GND enrichment canceled")
			return
		}
		if err != nil {
			app.Logger().Error("Manual GND enrichment failed", "error", err)
			return
		}
		app.Logger().Info("Manual GND enrichment finished")
	}()

	return "started", nil
}

func (app *App) upsertSetting(key string, value any) error {
	collection, err := app.PB.App.FindCollectionByNameOrId(dbmodels.SETTINGS_TABLE)
	if err != nil {
		return err
	}

	var record *core.Record
	existing, err := dbmodels.Settings_Key(app.PB.App, key)
	if err != nil {
		if !isRecordNotFoundError(err) {
			return err
		}
	} else if existing != nil {
		record = existing.ProxyRecord()
	}

	if record == nil {
		record = core.NewRecord(collection)
	}

	record.Set(dbmodels.KEY_FIELD, key)
	record.Set(dbmodels.VALUE_FIELD, value)
	return app.PB.App.Save(record)
}

func setAgentGNDEnrichmentState(app *App, status string, message string, done int, total int, errMsg string) {
	gndEnrichmentStatusMu.Lock()
	gndEnrichmentStatus = AgentGNDStatusSnapshot{
		Status:  status,
		Message: message,
		Error:   errMsg,
		Done:    done,
		Total:   total,
	}
	gndEnrichmentStatusMu.Unlock()

	if app == nil || app.PB == nil {
		return
	}
	_ = app.upsertSetting(gndEnrichmentStatusSetting, status)
	_ = app.upsertSetting(gndEnrichmentMessageSetting, message)
	_ = app.upsertSetting(gndEnrichmentErrorSetting, errMsg)
	_ = app.upsertSetting(gndEnrichmentDoneSetting, done)
	_ = app.upsertSetting(gndEnrichmentTotalSetting, total)
}

func (app *App) enrichAgentsWithGND(ctx context.Context) error {
	setAgentGNDEnrichmentState(app, "running", "GND-Anreicherung wird vorbereitet...", 0, 0, "")

	agents := []*dbmodels.Agent{}
	if err := app.PB.App.RecordQuery(dbmodels.AGENTS_TABLE).
		Where(dbx.HashExp{
			dbmodels.AGENTS_CORP_FIELD:      false,
			dbmodels.AGENTS_FICTIONAL_FIELD: false,
		}).
		All(&agents); err != nil {
		setAgentGNDEnrichmentState(app, "error", "GND-Anreicherung fehlgeschlagen.", 0, 0, err.Error())
		return fmt.Errorf("load agents for GND enrichment: %w", err)
	}

	if len(agents) == 0 {
		app.Logger().Info("No eligible agents for GND enrichment")
		if err := app.upsertSetting(gndEnrichmentLastRunSetting, gndEnrichmentNow().Format(time.RFC3339)); err != nil {
			app.Logger().Warn("Failed to persist GND enrichment timestamp", "error", err)
		}
		setAgentGNDEnrichmentState(app, "complete", "Keine geeigneten Agenten fuer die GND-Anreicherung gefunden.", 0, 0, "")
		return nil
	}

	targets := make([]*dbmodels.Agent, 0, len(agents))
	stats := gndStats{}
	for _, agent := range agents {
		if hasStoredGNDPayload(agent.Data()) {
			stats.SkippedExisting++
			continue
		}
		targets = append(targets, agent)
	}

	if len(targets) == 0 {
		app.Logger().Info(
			"GND enrichment completed",
			"processed", 0,
			"matched", 0,
			"unmatched", 0,
			"weak_matches", 0,
			"retried", 0,
			"failures", 0,
			"skipped_existing", stats.SkippedExisting,
			"weak_samples", "",
		)
		if err := app.upsertSetting(gndEnrichmentLastRunSetting, gndEnrichmentNow().Format(time.RFC3339)); err != nil {
			app.Logger().Warn("Failed to persist GND enrichment timestamp", "error", err)
		}
		setAgentGNDEnrichmentState(app, "complete", "Alle Agenten verfuegen bereits ueber GND-Daten.", 0, 0, "")
		return nil
	}

	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	total := len(targets)
	setAgentGNDEnrichmentState(app, "running", "GND-Anreicherung laeuft.", 0, total, "")

	updates := make([]gndMatchResult, 0, len(targets))
	failureSamples := []string{}
	weakSamples := []string{}

	for _, agent := range targets {
		if err := ctx.Err(); err != nil {
			return err
		}

		result := app.enrichAgentRecord(ctx, agent)
		stats.Processed++
		if result.Retried {
			stats.Retries++
		}
		if result.Err != nil {
			stats.Failures++
			if len(failureSamples) < 5 {
				failureSamples = append(failureSamples, fmt.Sprintf("%d %s: %v", result.MusenalmID, result.Name, result.Err))
			}
			continue
		}

		if result.Matched {
			stats.Matched++
			if result.WeakMatch {
				stats.WeakMatches++
				if len(weakSamples) < 5 {
					weakSamples = append(weakSamples, fmt.Sprintf("%d %s -> %s", result.MusenalmID, result.Name, result.ChosenGNDID))
				}
			}
			updates = append(updates, result)
		} else {
			stats.Unmatched++
		}

		setAgentGNDEnrichmentState(app, "running", "GND-Anreicherung laeuft.", stats.Processed, total, "")
	}

	if stats.Failures > 0 {
		app.Logger().Warn(
			"GND enrichment skipped failed lookups",
			"failures", stats.Failures,
			"samples", strings.Join(failureSamples, " | "),
		)
	}

	plan := newDisplayRefreshPlan()
	for _, update := range updates {
		if err := ctx.Err(); err != nil {
			return err
		}

		record, err := dbmodels.Agents_ID(app.PB.App, update.AgentID)
		if err != nil {
			setAgentGNDEnrichmentState(app, "error", "GND-Anreicherung fehlgeschlagen.", stats.Processed, total, err.Error())
			return fmt.Errorf("reload agent %s: %w", update.AgentID, err)
		}
		record.SetURI(update.URI)
		record.SetData(update.Data)
		if update.WeakMatch {
			markAgentWeakGNDMatch(record)
		}
		if err := app.PB.App.Save(record); err != nil {
			setAgentGNDEnrichmentState(app, "error", "GND-Anreicherung fehlgeschlagen.", stats.Processed, total, err.Error())
			return fmt.Errorf("save agent %s GND enrichment: %w", update.AgentID, err)
		}
		plan.updateAgents[update.AgentID] = struct{}{}
	}

	app.Logger().Info(
		"GND enrichment completed",
		"processed", stats.Processed,
		"matched", stats.Matched,
		"unmatched", stats.Unmatched,
		"weak_matches", stats.WeakMatches,
		"retried", stats.Retries,
		"failures", stats.Failures,
		"skipped_existing", stats.SkippedExisting,
		"weak_samples", strings.Join(weakSamples, " | "),
	)

	if len(plan.updateAgents) > 0 {
		app.ScheduleDisplayCacheRefresh(plan)
	}

	if stats.Failures > 0 {
		setAgentGNDEnrichmentState(
			app,
			"error",
			"GND-Anreicherung mit Fehlern beendet.",
			stats.Processed,
			total,
			fmt.Sprintf("%d Anfragen fehlgeschlagen.", stats.Failures),
		)
		return fmt.Errorf("GND enrichment had %d failed lookups", stats.Failures)
	}

	if err := app.upsertSetting(gndEnrichmentLastRunSetting, gndEnrichmentNow().Format(time.RFC3339)); err != nil {
		app.Logger().Warn("Failed to persist GND enrichment timestamp", "error", err)
	}
	setAgentGNDEnrichmentState(app, "complete", "GND-Anreicherung abgeschlossen.", stats.Processed, total, "")
	return nil
}

func hasStoredGNDPayload(data map[string]any) bool {
	if len(data) == 0 {
		return false
	}
	raw, ok := data[gndEnrichmentDataKey]
	return ok && raw != nil
}

func (app *App) enrichAgentRecord(ctx context.Context, agent *dbmodels.Agent) gndMatchResult {
	normalizedURI := gndprovider.NormalizeURI(agent.URI())
	if gndprovider.IsGNDURI(normalizedURI) {
		return app.hydrateAgentGNDRecord(ctx, agent, normalizedURI)
	}
	return app.searchAgentGNDRecord(ctx, agent)
}

func (app *App) hydrateAgentGNDRecord(ctx context.Context, agent *dbmodels.Agent, normalizedURI string) gndMatchResult {
	result := gndMatchResult{
		AgentID:    agent.Id,
		Name:       agent.Name(),
		MusenalmID: agent.MusenalmID(),
	}

	refreshed, retried, err := app.syncAgentLinkedData(ctx, normalizedURI, agent.Data())
	result.Retried = retried
	if err != nil {
		result.Err = fmt.Errorf("refresh GND for %q (%d): %w", agent.Name(), agent.MusenalmID(), err)
		return result
	}

	result.Matched = hasStoredGNDPayload(refreshed.Data)
	result.URI = refreshed.URI
	result.Data = refreshed.Data
	if rawGND, ok := refreshed.Data[gndEnrichmentDataKey].(map[string]any); ok {
		result.ChosenGNDID = stringValue(rawGND["gndIdentifier"])
		if result.ChosenGNDID == "" {
			result.ChosenGNDID = stringValue(rawGND["id"])
		}
	}
	result.MatchStrategy = "refresh_uri"
	return result
}

func (app *App) searchAgentGNDRecord(ctx context.Context, agent *dbmodels.Agent) gndMatchResult {
	result := gndMatchResult{
		AgentID:    agent.Id,
		Name:       agent.Name(),
		MusenalmID: agent.MusenalmID(),
	}

	queryName := normalizeGNDName(agent.Name())
	if queryName == "" {
		return result
	}

	hints := parseGNDBiographicalHints(agent.BiographicalData())
	response, retried, err := app.searchLobidGND(ctx, queryName, hints)
	result.Retried = retried
	if err != nil {
		result.Err = fmt.Errorf("search GND for %q (%d): %w", agent.Name(), agent.MusenalmID(), err)
		return result
	}

	result.CandidateCount = len(response.Member)
	if len(response.Member) == 0 {
		return result
	}

	chosen, strategy, weak := chooseGNDCandidate(queryName, hints, response.Member)
	if chosen == nil {
		return result
	}

	data := cloneAgentData(agent.Data())
	data[gndEnrichmentDataKey] = chosen
	data[gndEnrichmentQueryNameKey] = queryName
	data[gndEnrichmentQueryBioKey] = agent.BiographicalData()
	data[gndEnrichmentMatchStrategyKey] = strategy
	data[gndEnrichmentCandidateCountKey] = len(response.Member)
	data[gndEnrichmentMatchedAtKey] = gndEnrichmentNow().Format(time.RFC3339)

	result.Matched = true
	result.URI = stringValue(chosen["id"])
	result.Data = data
	result.MatchStrategy = strategy
	result.WeakMatch = weak
	result.ChosenGNDID = stringValue(chosen["gndIdentifier"])
	if result.ChosenGNDID == "" {
		result.ChosenGNDID = result.URI
	}

	return result
}

func buildGNDQuery(name string, hints gndBiographicalHints) string {
	escapedName := escapeGNDTerm(name)
	nameExpr := fmt.Sprintf(
		`(preferredName:"%[1]s" OR variantName:"%[1]s" OR preferredName.ascii:"%[1]s" OR variantName.ascii:"%[1]s")`,
		escapedName,
	)

	parts := []string{nameExpr}
	yearExpr := buildGNDYearQuery(hints)
	if yearExpr != "" {
		parts = append(parts, yearExpr)
	}
	parts = append(parts, "type:DifferentiatedPerson")
	return strings.Join(parts, " AND ")
}

func escapeGNDTerm(s string) string {
	return strings.ReplaceAll(s, `"`, `\"`)
}

func buildGNDYearQuery(hints gndBiographicalHints) string {
	parts := []string{}
	if hints.BirthYear != "" {
		parts = append(parts, "dateOfBirth:"+hints.BirthYear+"*")
	}
	if hints.DeathYear != "" {
		parts = append(parts, "dateOfDeath:"+hints.DeathYear+"*")
	}
	if len(parts) > 0 {
		return "(" + strings.Join(parts, " OR ") + ")"
	}

	for _, year := range hints.Extracted {
		parts = append(parts, "dateOfBirth:"+year+"*")
		parts = append(parts, "dateOfDeath:"+year+"*")
	}
	if len(parts) == 0 {
		return ""
	}
	return "(" + strings.Join(parts, " OR ") + ")"
}

func parseGNDBiographicalHints(raw string) gndBiographicalHints {
	hints := gndBiographicalHints{Original: strings.TrimSpace(raw)}
	if hints.Original == "" {
		return hints
	}

	s := strings.NewReplacer("–", "-", "—", "-", "−", "-", "‑", "-").Replace(hints.Original)
	lower := strings.ToLower(s)
	hints.HasBC = strings.Contains(lower, "v. chr")
	if hints.HasBC {
		return hints
	}

	if birth, death, ok := parseExactYearRange(s); ok {
		hints.BirthYear = birth
		hints.DeathYear = death
	}

	years := uniqueStrings(findFourDigitYears(s))
	if hints.BirthYear != "" {
		years = removeString(years, hints.BirthYear)
	}
	if hints.DeathYear != "" {
		years = removeString(years, hints.DeathYear)
	}
	hints.Extracted = years
	return hints
}

func parseExactYearRange(s string) (string, string, bool) {
	left, right, ok := strings.Cut(strings.TrimSpace(s), "-")
	if !ok {
		return "", "", false
	}

	left = strings.TrimSpace(left)
	right = strings.TrimSpace(right)
	leftYears := findFourDigitYears(left)
	rightYears := findFourDigitYears(right)

	leftClean := len(leftYears) == 1 && leftYears[0] == left && allDigits(left)
	rightClean := len(rightYears) == 1 && rightYears[0] == right && allDigits(right)
	if leftClean && rightClean {
		return leftYears[0], rightYears[0], true
	}

	if leftClean && right != "" && strings.Trim(right, "? ") == "" {
		return leftYears[0], "", true
	}
	if rightClean && left != "" && strings.Trim(left, "? ") == "" {
		return "", rightYears[0], true
	}
	if leftClean && right == "" {
		return leftYears[0], "", true
	}
	return "", "", false
}

func findFourDigitYears(s string) []string {
	out := []string{}
	runes := []rune(s)
	for i := 0; i < len(runes); i++ {
		if i+4 > len(runes) {
			break
		}
		part := string(runes[i : i+4])
		if !allDigits(part) {
			continue
		}
		if i > 0 && unicode.IsDigit(runes[i-1]) {
			continue
		}
		if i+4 < len(runes) && unicode.IsDigit(runes[i+4]) {
			continue
		}
		out = append(out, part)
		i += 3
	}
	return out
}

func allDigits(s string) bool {
	if s == "" {
		return false
	}
	for _, r := range s {
		if !unicode.IsDigit(r) {
			return false
		}
	}
	return true
}

func chooseGNDCandidate(queryName string, hints gndBiographicalHints, members []map[string]any) (map[string]any, string, bool) {
	candidates := make([]gndCandidate, 0, len(members))
	for _, member := range members {
		candidates = append(candidates, scoreGNDCandidate(queryName, hints, member))
	}

	slices.SortStableFunc(candidates, compareGNDCandidates)
	if len(candidates) == 0 {
		return nil, "", false
	}

	best := candidates[0]
	strategy := "best_guess"
	switch {
	case best.ExactYearHits >= 2 && best.PreferredExact:
		strategy = "exact_years_preferred_name"
	case best.ExactYearHits >= 2:
		strategy = "exact_years"
	case best.ExactYearHits >= 1 && (best.PreferredExact || best.VariantExact):
		strategy = "single_year_exact_name"
	case best.PreferredExact:
		strategy = "preferred_name"
	case best.VariantExact:
		strategy = "variant_name"
	case best.ASCIIExact:
		strategy = "ascii_name"
	}

	weak := best.Score < gndEnrichmentWeakMatchScoreMin
	return best.Record, strategy, weak
}

func markAgentWeakGNDMatch(agent *dbmodels.Agent) {
	if agent == nil {
		return
	}

	agent.SetEditState("Review")
	appendAgentComment(agent, gndEnrichmentWeakMatchCommentNote)
}

func appendAgentComment(agent *dbmodels.Agent, note string) {
	if agent == nil {
		return
	}

	note = strings.TrimSpace(note)
	if note == "" {
		return
	}

	current := strings.TrimSpace(agent.Comment())
	if current == "" {
		agent.SetComment(note)
		return
	}

	if strings.Contains(current, note) {
		return
	}

	agent.SetComment(current + "\n" + note)
}

func scoreGNDCandidate(queryName string, hints gndBiographicalHints, record map[string]any) gndCandidate {
	candidate := gndCandidate{
		Record:        record,
		ID:            stringValue(record["gndIdentifier"]),
		PreferredName: stringValue(record["preferredName"]),
		VariantNames:  stringSlice(record["variantName"]),
		BirthYears:    stringSlice(record["dateOfBirth"]),
		DeathYears:    stringSlice(record["dateOfDeath"]),
	}

	queryNorm := normalizeGNDName(queryName)
	queryASCII := asciiFold(queryNorm)
	preferredNorm := normalizeGNDName(candidate.PreferredName)

	if preferredNorm == queryNorm {
		candidate.PreferredExact = true
		candidate.Score += 120
	}
	if asciiFold(preferredNorm) == queryASCII && preferredNorm != "" {
		candidate.ASCIIExact = true
		candidate.Score += 80
	}

	for _, variant := range candidate.VariantNames {
		variantNorm := normalizeGNDName(variant)
		if variantNorm == queryNorm {
			candidate.VariantExact = true
			candidate.Score += 100
			break
		}
		if asciiFold(variantNorm) == queryASCII && variantNorm != "" {
			candidate.ASCIIExact = true
		}
	}

	if hints.BirthYear != "" && containsStringPrefix(candidate.BirthYears, hints.BirthYear) {
		candidate.ExactYearHits++
		candidate.Score += 220
	}
	if hints.DeathYear != "" && containsStringPrefix(candidate.DeathYears, hints.DeathYear) {
		candidate.ExactYearHits++
		candidate.Score += 220
	}

	for _, year := range hints.Extracted {
		if containsStringPrefix(candidate.BirthYears, year) || containsStringPrefix(candidate.DeathYears, year) {
			candidate.PartialYearHits++
			candidate.Score += 20
		}
	}

	if len(candidate.BirthYears) > 0 && len(candidate.DeathYears) > 0 {
		candidate.Score += 5
	}

	candidate.NameOverlap = gndNameTokenOverlap(queryNorm, preferredNorm, candidate.VariantNames)
	candidate.Score += candidate.NameOverlap

	return candidate
}

func compareGNDCandidates(a, b gndCandidate) int {
	switch {
	case a.Score != b.Score:
		return b.Score - a.Score
	case a.ExactYearHits != b.ExactYearHits:
		return b.ExactYearHits - a.ExactYearHits
	case a.PreferredExact != b.PreferredExact:
		if a.PreferredExact {
			return -1
		}
		return 1
	case a.VariantExact != b.VariantExact:
		if a.VariantExact {
			return -1
		}
		return 1
	case (len(a.BirthYears) > 0 && len(a.DeathYears) > 0) != (len(b.BirthYears) > 0 && len(b.DeathYears) > 0):
		if len(a.BirthYears) > 0 && len(a.DeathYears) > 0 {
			return -1
		}
		return 1
	default:
		return strings.Compare(a.ID, b.ID)
	}
}

func normalizeGNDName(s string) string {
	s = datatypes.NormalizeWhitespace(datatypes.NormalizeString(s))
	s = norm.NFC.String(s)
	return strings.ToLower(strings.TrimSpace(s))
}

func asciiFold(s string) string {
	replacer := strings.NewReplacer(
		"ä", "a", "ö", "o", "ü", "u", "ß", "ss",
		"à", "a", "á", "a", "â", "a", "ã", "a", "å", "a",
		"ç", "c",
		"è", "e", "é", "e", "ê", "e", "ë", "e",
		"ì", "i", "í", "i", "î", "i", "ï", "i",
		"ñ", "n",
		"ò", "o", "ó", "o", "ô", "o", "õ", "o",
		"ù", "u", "ú", "u", "û", "u",
		"ý", "y", "ÿ", "y",
	)
	return replacer.Replace(s)
}

func gndNameTokenOverlap(queryNorm, preferredNorm string, variants []string) int {
	queryTokens := tokenSet(queryNorm)
	best := tokenOverlap(queryTokens, tokenSet(preferredNorm))
	for _, variant := range variants {
		if score := tokenOverlap(queryTokens, tokenSet(normalizeGNDName(variant))); score > best {
			best = score
		}
	}
	return best
}

func tokenSet(s string) map[string]struct{} {
	tokens := map[string]struct{}{}
	for _, token := range strings.FieldsFunc(s, func(r rune) bool {
		return r == ',' || r == ' ' || r == '\'' || r == '-' || r == '.'
	}) {
		token = strings.TrimSpace(token)
		if token == "" {
			continue
		}
		tokens[token] = struct{}{}
	}
	return tokens
}

func tokenOverlap(a, b map[string]struct{}) int {
	score := 0
	for token := range a {
		if _, ok := b[token]; ok {
			score++
		}
	}
	return score
}

func cloneAgentData(in map[string]any) map[string]any {
	if len(in) == 0 {
		return map[string]any{}
	}
	out := make(map[string]any, len(in))
	for k, v := range in {
		out[k] = v
	}
	return out
}

func stringValue(v any) string {
	s, _ := v.(string)
	return s
}

func stringSlice(v any) []string {
	switch typed := v.(type) {
	case []string:
		return typed
	case []any:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if s, ok := item.(string); ok {
				out = append(out, s)
			}
		}
		return out
	default:
		return nil
	}
}

func uniqueStrings(values []string) []string {
	seen := map[string]struct{}{}
	out := make([]string, 0, len(values))
	for _, value := range values {
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		out = append(out, value)
	}
	return out
}

func removeString(values []string, remove string) []string {
	out := make([]string, 0, len(values))
	for _, value := range values {
		if value != remove {
			out = append(out, value)
		}
	}
	return out
}

func containsStringPrefix(values []string, prefix string) bool {
	for _, value := range values {
		if value == prefix || strings.HasPrefix(value, prefix+"-") {
			return true
		}
	}
	return false
}

func isRecordNotFoundError(err error) bool {
	if err == nil {
		return false
	}
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "no rows in result set") || strings.Contains(msg, "not found")
}
