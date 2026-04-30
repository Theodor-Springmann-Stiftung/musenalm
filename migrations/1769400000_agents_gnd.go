package migrations

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"net/url"
	"runtime"
	"slices"
	"strings"
	"sync"
	"time"
	"unicode"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"golang.org/x/text/unicode/norm"
)

const (
	gndDataKey           = "gnd"
	gndQueryNameKey      = "gnd_query_name"
	gndQueryBioKey       = "gnd_query_biographical_data"
	gndMatchStrategyKey  = "gnd_match_strategy"
	gndCandidateCountKey = "gnd_candidate_count"
	gndMatchedAtKey      = "gnd_matched_at"
	gndWeakMatchScoreMin = 110
	gndWeakMatchNote     = "DNB: weak Match"
)

var (
	gndLobidBaseURL = "https://lobid.org/gnd/search"
	gndHTTPClient   = &http.Client{Timeout: 15 * time.Second}
	gndNow          = func() time.Time { return time.Now().UTC() }
	gndSleep        = time.Sleep
	gndRand         = rand.New(rand.NewSource(time.Now().UnixNano()))
)

func init() {
	m.Register(func(app core.App) error {
		if err := ensureAgentsDataField(app); err != nil {
			return err
		}
		return enrichAgentsWithGND(app)
	}, func(app core.App) error {
		return nil
	})
}

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
	Processed   int
	Matched     int
	Unmatched   int
	WeakMatches int
	Retries     int
	Failures    int
}

func ensureAgentsDataField(app core.App) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		return fmt.Errorf("find agents collection: %w", err)
	}

	if collection.Fields.GetByName(dbmodels.DATA_FIELD) != nil {
		return nil
	}

	collection.Fields.Add(&core.JSONField{Name: dbmodels.DATA_FIELD, Required: false})
	return app.Save(collection)
}

func enrichAgentsWithGND(app core.App) error {
	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).
		Where(dbx.HashExp{
			dbmodels.AGENTS_CORP_FIELD:      false,
			dbmodels.AGENTS_FICTIONAL_FIELD: false,
		}).
		All(&agents); err != nil {
		return fmt.Errorf("load agents for GND enrichment: %w", err)
	}

	if len(agents) == 0 {
		app.Logger().Info("No eligible agents for GND enrichment")
		return nil
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	workers := gndWorkerCount()
	jobs := make(chan *dbmodels.Agent)
	results := make(chan gndMatchResult, workers)

	var wg sync.WaitGroup
	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for agent := range jobs {
				select {
				case <-ctx.Done():
					return
				default:
				}

				result := enrichAgentWithGND(ctx, agent)
				results <- result
			}
		}()
	}

	go func() {
		stopped := false
		for _, agent := range agents {
			select {
			case <-ctx.Done():
				stopped = true
			case jobs <- agent:
			}
			if stopped {
				break
			}
		}
		close(jobs)
		wg.Wait()
		close(results)
	}()

	updates := make([]gndMatchResult, 0, len(agents))
	stats := gndStats{}
	failureSamples := []string{}
	weakSamples := []string{}

	for result := range results {
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
	}

	if stats.Failures > 0 {
		app.Logger().Warn(
			"GND enrichment skipped failed lookups",
			"failures", stats.Failures,
			"samples", strings.Join(failureSamples, " | "),
		)
	}

	for _, update := range updates {
		record, err := dbmodels.Agents_ID(app, update.AgentID)
		if err != nil {
			return fmt.Errorf("reload agent %s: %w", update.AgentID, err)
		}
		record.SetURI(update.URI)
		record.SetData(update.Data)
		if update.WeakMatch {
			markAgentWeakGNDMatch(record)
		}
		if err := app.Save(record); err != nil {
			return fmt.Errorf("save agent %s GND enrichment: %w", update.AgentID, err)
		}
	}

	app.Logger().Info(
		"GND enrichment completed",
		"processed", stats.Processed,
		"matched", stats.Matched,
		"unmatched", stats.Unmatched,
		"weak_matches", stats.WeakMatches,
		"retried", stats.Retries,
		"failures", stats.Failures,
		"weak_samples", strings.Join(weakSamples, " | "),
	)

	return nil
}

func gndWorkerCount() int {
	workers := runtime.NumCPU() * 2
	if workers < 4 {
		return 4
	}
	if workers > 16 {
		return 16
	}
	return workers
}

func enrichAgentWithGND(ctx context.Context, agent *dbmodels.Agent) gndMatchResult {
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
	response, retried, err := searchLobidGND(ctx, queryName, hints)
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
	data[gndDataKey] = chosen
	data[gndQueryNameKey] = queryName
	data[gndQueryBioKey] = agent.BiographicalData()
	data[gndMatchStrategyKey] = strategy
	data[gndCandidateCountKey] = len(response.Member)
	data[gndMatchedAtKey] = gndNow().Format(time.RFC3339)

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

func searchLobidGND(ctx context.Context, name string, hints gndBiographicalHints) (*gndSearchResponse, bool, error) {
	rawQuery := buildGNDQuery(name, hints)
	params := url.Values{}
	params.Set("q", rawQuery)
	params.Set("format", "json")

	fullURL := gndLobidBaseURL + "?" + params.Encode()

	var lastErr error
	retried := false
	for attempt := 0; attempt < 5; attempt++ {
		if attempt == 0 {
			log.Printf("GND lookup %q  %s", name, fullURL)
		} else {
			log.Printf("GND retry %d/4 %q  %s", attempt, name, fullURL)
		}

		req, err := http.NewRequestWithContext(ctx, http.MethodGet, fullURL, nil)
		if err != nil {
			return nil, retried, err
		}

		resp, err := gndHTTPClient.Do(req)
		if err == nil {
			body, readErr := io.ReadAll(resp.Body)
			resp.Body.Close()
			if readErr != nil {
				lastErr = readErr
			} else if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				out := &gndSearchResponse{}
				if err := json.Unmarshal(body, out); err != nil {
					return nil, retried, err
				}
				log.Printf("GND ok    %q  hits=%d", name, out.TotalItems)
				return out, retried, nil
			} else if !shouldRetryGNDStatus(resp.StatusCode) {
				return nil, retried, fmt.Errorf("unexpected status %d", resp.StatusCode)
			} else {
				lastErr = fmt.Errorf("transient status %d", resp.StatusCode)
				log.Printf("GND error %q  status=%d", name, resp.StatusCode)
			}
		} else {
			lastErr = err
			log.Printf("GND error %q  err=%v", name, err)
		}

		if attempt == 4 {
			break
		}

		retried = true
		gndSleep(gndBackoffDuration(attempt))
	}

	return nil, retried, lastErr
}

func shouldRetryGNDStatus(status int) bool {
	return status < 200 || status >= 300
}

func gndBackoffDuration(attempt int) time.Duration {
	base := 250 * time.Millisecond
	backoff := base << attempt
	if backoff > 5*time.Second {
		backoff = 5 * time.Second
	}
	jitter := time.Duration(gndRand.Int63n(int64(base)))
	return backoff + jitter
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

	weak := best.Score < gndWeakMatchScoreMin
	return best.Record, strategy, weak
}

func markAgentWeakGNDMatch(agent *dbmodels.Agent) {
	if agent == nil {
		return
	}

	agent.SetEditState("Review")
	appendAgentComment(agent, gndWeakMatchNote)
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
