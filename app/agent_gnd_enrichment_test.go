package app

import (
	"context"
	"io"
	"net/http"
	"strings"
	"sync/atomic"
	"testing"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func TestParseGNDBiographicalHints(t *testing.T) {
	tests := []struct {
		name      string
		input     string
		wantBirth string
		wantDeath string
		wantYears []string
	}{
		{name: "exact range", input: "1787-1853", wantBirth: "1787", wantDeath: "1853"},
		{name: "birth only with question", input: "1786-?", wantBirth: "1786"},
		{name: "birth only trailing dash", input: "1786-", wantBirth: "1786"},
		{name: "death only", input: "?-1840", wantDeath: "1840"},
		{name: "multiple explicit years", input: "e. 1832; 1836", wantYears: []string{"1832", "1836"}},
		{name: "century phrase", input: "Mitte 19. Jh.", wantYears: nil},
		{name: "uncertain death", input: "1713- <1797", wantYears: []string{"1713", "1797"}},
		{name: "bc ignored", input: "525-456 v. Chr.", wantYears: nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := parseGNDBiographicalHints(tt.input)
			if got.BirthYear != tt.wantBirth {
				t.Fatalf("expected birth %q, got %q", tt.wantBirth, got.BirthYear)
			}
			if got.DeathYear != tt.wantDeath {
				t.Fatalf("expected death %q, got %q", tt.wantDeath, got.DeathYear)
			}
			if strings.Join(got.Extracted, ",") != strings.Join(tt.wantYears, ",") {
				t.Fatalf("expected years %#v, got %#v", tt.wantYears, got.Extracted)
			}
		})
	}
}

func TestChooseGNDCandidatePrefersExactYearAndName(t *testing.T) {
	hints := parseGNDBiographicalHints("1787-1853")
	queryName := "Barth, Karl"
	members := []map[string]any{
		{
			"gndIdentifier": "2",
			"id":            "https://d-nb.info/gnd/2",
			"preferredName": "Barth, Karl",
			"variantName":   []any{"Barth, K."},
			"dateOfBirth":   []any{"1787"},
			"dateOfDeath":   []any{"1852"},
		},
		{
			"gndIdentifier": "1",
			"id":            "https://d-nb.info/gnd/1",
			"preferredName": "Barth, Carl",
			"variantName":   []any{"Barth, Karl"},
			"dateOfBirth":   []any{"1787"},
			"dateOfDeath":   []any{"1853"},
		},
	}

	got, strategy, weak := chooseGNDCandidate(queryName, hints, members)
	if got == nil {
		t.Fatal("expected a candidate")
	}
	if stringValue(got["gndIdentifier"]) != "1" {
		t.Fatalf("expected GND 1, got %v", got["gndIdentifier"])
	}
	if strategy != "exact_years" && strategy != "single_year_exact_name" {
		t.Fatalf("unexpected strategy %q", strategy)
	}
	if weak {
		t.Fatal("expected strong match")
	}
}

func TestChooseGNDCandidateVariantOnlyIsWeak(t *testing.T) {
	queryName := "Barth, Karl"
	members := []map[string]any{
		{
			"gndIdentifier": "1",
			"id":            "https://d-nb.info/gnd/1",
			"preferredName": "Barth, Carl",
			"variantName":   []any{"Barth, Karl"},
		},
	}

	got, strategy, weak := chooseGNDCandidate(queryName, gndBiographicalHints{}, members)
	if got == nil {
		t.Fatal("expected a candidate")
	}
	if strategy != "variant_name" {
		t.Fatalf("unexpected strategy %q", strategy)
	}
	if !weak {
		t.Fatal("expected weak match")
	}
}

func TestMarkAgentWeakGNDMatchSetsReviewAndCommentOnce(t *testing.T) {
	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.SelectField{Name: dbmodels.EDITSTATE_FIELD},
		&core.TextField{Name: dbmodels.COMMENT_FIELD},
	)

	record := core.NewRecord(collection)
	agent := dbmodels.NewAgent(record)
	agent.SetEditState("Unknown")
	agent.SetComment("Existing")

	markAgentWeakGNDMatch(agent)
	markAgentWeakGNDMatch(agent)

	if agent.EditState() != "Review" {
		t.Fatalf("expected Review state, got %q", agent.EditState())
	}
	if agent.Comment() != "Existing\nDNB: weak Match" {
		t.Fatalf("unexpected comment %q", agent.Comment())
	}
}

func TestStartAgentGNDEnrichmentRestartable(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)
	resetAgentGNDEnrichmentStateForTesting()
	defer resetAgentGNDEnrichmentStateForTesting()

	origRun := gndEnrichmentRun
	defer func() { gndEnrichmentRun = origRun }()

	firstStarted := make(chan struct{}, 1)
	secondStarted := make(chan struct{}, 1)
	secondRelease := make(chan struct{})
	var runs atomic.Int32

	gndEnrichmentRun = func(app *App, ctx context.Context) error {
		run := runs.Add(1)
		if run == 1 {
			setAgentGNDEnrichmentState(app, "running", "GND-Anreicherung laeuft.", 0, 2, "")
			select {
			case firstStarted <- struct{}{}:
			default:
			}
			<-ctx.Done()
			return ctx.Err()
		}

		setAgentGNDEnrichmentState(app, "running", "GND-Anreicherung laeuft.", 1, 1, "")
		select {
		case secondStarted <- struct{}{}:
		default:
		}
		<-secondRelease
		setAgentGNDEnrichmentState(app, "complete", "GND-Anreicherung abgeschlossen.", 1, 1, "")
		return nil
	}

	status, err := StartAgentGNDEnrichment(musenalmApp, true)
	if err != nil {
		t.Fatalf("StartAgentGNDEnrichment: %v", err)
	}
	if status != "started" {
		t.Fatalf("expected started status, got %q", status)
	}

	waitForSignal(t, firstStarted, time.Second, "first GND enrichment run")

	status, err = StartAgentGNDEnrichment(musenalmApp, true)
	if err != nil {
		t.Fatalf("restart StartAgentGNDEnrichment: %v", err)
	}
	if status != "restarting" {
		t.Fatalf("expected restarting status, got %q", status)
	}

	waitForSignal(t, secondStarted, time.Second, "second GND enrichment run")
	close(secondRelease)
	waitForCondition(t, time.Second, func() bool { return !AgentGNDIsRunning() }, "GND enrichment restart shutdown")

	if runs.Load() != 2 {
		t.Fatalf("expected two runs, got %d", runs.Load())
	}
	snapshot, ok := AgentGNDStatus()
	if !ok {
		t.Fatal("expected status snapshot")
	}
	if snapshot.Status != "complete" {
		t.Fatalf("expected complete status, got %#v", snapshot)
	}
}

func TestStartAgentGNDEnrichmentAllowsRepeatRuns(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)
	resetAgentGNDEnrichmentStateForTesting()
	defer resetAgentGNDEnrichmentStateForTesting()

	origRun := gndEnrichmentRun
	defer func() { gndEnrichmentRun = origRun }()

	var runs atomic.Int32
	gndEnrichmentRun = func(app *App, ctx context.Context) error {
		runs.Add(1)
		setAgentGNDEnrichmentState(app, "complete", "GND-Anreicherung abgeschlossen.", 0, 0, "")
		return nil
	}

	for i := 0; i < 2; i++ {
		status, err := StartAgentGNDEnrichment(musenalmApp, true)
		if err != nil {
			t.Fatalf("StartAgentGNDEnrichment run %d: %v", i+1, err)
		}
		if status != "started" {
			t.Fatalf("expected started status on run %d, got %q", i+1, status)
		}
		waitForCondition(t, time.Second, func() bool { return !AgentGNDIsRunning() }, "GND enrichment run completion")
	}

	if runs.Load() != 2 {
		t.Fatalf("expected two repeatable runs, got %d", runs.Load())
	}
}

func TestEnrichAgentsWithGNDDoesNotWriteLastRunOnFailure(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)
	resetAgentGNDEnrichmentStateForTesting()
	defer resetAgentGNDEnrichmentStateForTesting()

	createTestAgent(t, testApp, "", nil)

	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: http.StatusInternalServerError,
			Body:       io.NopCloser(strings.NewReader("boom")),
			Header:     make(http.Header),
			Request:    req,
		}, nil
	}))
	defer restoreHTTP()

	err := musenalmApp.enrichAgentsWithGND(context.Background())
	if err == nil {
		t.Fatal("expected enrichment error")
	}

	_, err = dbmodels.Settings_Key(testApp, gndEnrichmentLastRunSetting)
	if !isRecordNotFoundError(err) {
		t.Fatalf("expected no last-run marker, got err=%v", err)
	}

	snapshot, ok := AgentGNDStatus()
	if !ok {
		t.Fatal("expected status snapshot")
	}
	if snapshot.Status != "error" {
		t.Fatalf("expected error status, got %#v", snapshot)
	}
}

func TestEnrichAgentsWithGNDSearchesMissingAndRefreshesExistingURI(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)
	resetAgentGNDEnrichmentStateForTesting()
	defer resetAgentGNDEnrichmentStateForTesting()

	existing := createTestAgent(t, testApp, "", map[string]any{
		"gnd": map[string]any{"preferredName": "Existing"},
	})
	refresh := createTestAgent(t, testApp, "https://d-nb.info/gnd/116267968", map[string]any{"custom": "keep"})
	search := createTestAgent(t, testApp, "", map[string]any{"custom": "search"})

	origNow := gndEnrichmentNow
	defer func() {
		gndEnrichmentNow = origNow
	}()
	gndEnrichmentNow = func() time.Time { return time.Date(2026, 6, 10, 12, 0, 0, 0, time.UTC) }

	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		switch req.URL.Path {
		case "/gnd/search":
			return &http.Response{
				StatusCode: http.StatusOK,
				Body: io.NopCloser(strings.NewReader(
					`{"totalItems":1,"member":[{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl","variantName":["Karl Barth"]}]}`,
				)),
				Header:  make(http.Header),
				Request: req,
			}, nil
		case "/gnd/116267968.json":
			return &http.Response{
				StatusCode: http.StatusOK,
				Body: io.NopCloser(strings.NewReader(
					`{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}`,
				)),
				Header:  make(http.Header),
				Request: req,
			}, nil
		default:
			return &http.Response{
				StatusCode: http.StatusNotFound,
				Body:       io.NopCloser(strings.NewReader("not found")),
				Header:     make(http.Header),
				Request:    req,
			}, nil
		}
	}))
	defer restoreHTTP()

	if err := musenalmApp.enrichAgentsWithGND(context.Background()); err != nil {
		t.Fatalf("enrichAgentsWithGND: %v", err)
	}

	storedExisting, err := dbmodels.Agents_ID(testApp, existing.Id)
	if err != nil {
		t.Fatalf("reload existing agent: %v", err)
	}
	rawGND, ok := storedExisting.Data()["gnd"].(map[string]any)
	if !ok || rawGND["preferredName"] != "Existing" {
		t.Fatalf("expected existing GND payload to be preserved, got %#v", storedExisting.Data())
	}

	storedRefresh, err := dbmodels.Agents_ID(testApp, refresh.Id)
	if err != nil {
		t.Fatalf("reload refreshed agent: %v", err)
	}
	if storedRefresh.GND() == nil || storedRefresh.GND().PreferredName != "Barth, Carl" {
		t.Fatalf("expected GND payload to be hydrated, got %#v", storedRefresh.Data())
	}
	if storedRefresh.Data()["custom"] != "keep" {
		t.Fatalf("expected custom data preserved, got %#v", storedRefresh.Data())
	}

	storedSearch, err := dbmodels.Agents_ID(testApp, search.Id)
	if err != nil {
		t.Fatalf("reload searched agent: %v", err)
	}
	if storedSearch.GND() == nil || storedSearch.GND().PreferredName != "Barth, Carl" {
		t.Fatalf("expected GND payload to be searched, got %#v", storedSearch.Data())
	}
	if storedSearch.Data()["custom"] != "search" {
		t.Fatalf("expected custom data preserved for searched agent, got %#v", storedSearch.Data())
	}

	setting, err := dbmodels.Settings_Key(testApp, gndEnrichmentLastRunSetting)
	if err != nil {
		t.Fatalf("load last-run setting: %v", err)
	}
	if setting == nil {
		t.Fatal("expected last-run setting")
	}
	if value, ok := parseSettingStringFromAny(setting.Value()); !ok || value != "2026-06-10T12:00:00Z" {
		t.Fatalf("unexpected last-run value %#v", setting.Value())
	}

	snapshot, ok := AgentGNDStatus()
	if !ok {
		t.Fatal("expected status snapshot")
	}
	if snapshot.Status != "complete" || snapshot.Done != 2 || snapshot.Total != 2 {
		t.Fatalf("unexpected status snapshot %#v", snapshot)
	}
}

func resetAgentGNDEnrichmentStateForTesting() {
	gndEnrichmentMu.Lock()
	gndEnrichmentRunning = false
	gndEnrichmentCancel = nil
	gndEnrichmentRestart = false
	gndEnrichmentMu.Unlock()

	gndEnrichmentStatusMu.Lock()
	gndEnrichmentStatus = AgentGNDStatusSnapshot{}
	gndEnrichmentStatusMu.Unlock()
}

func parseSettingStringFromAny(value any) (string, bool) {
	switch typed := value.(type) {
	case string:
		return strings.Trim(typed, `"`), true
	case []byte:
		return strings.Trim(string(typed), `"`), true
	case types.JSONRaw:
		return strings.Trim(string(typed), `"`), true
	default:
		return "", false
	}
}
