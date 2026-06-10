package app

import (
	"errors"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

func TestRefreshAgentGNDUpdatesDataForDNBURI(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	agent := createTestAgent(t, testApp, "https://d-nb.info/gnd/116267968", map[string]any{"custom": "keep"})

	origClient := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: http.StatusOK,
			Body: io.NopCloser(strings.NewReader(
				`{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}`,
			)),
			Header:  make(http.Header),
			Request: req,
		}, nil
	}))
	defer origClient()

	musenalmApp.refreshAgentGND(agent.Id)

	stored, err := dbmodels.Agents_ID(testApp, agent.Id)
	if err != nil {
		t.Fatalf("reload agent: %v", err)
	}
	if stored.URI() != "https://d-nb.info/gnd/116267968" {
		t.Fatalf("expected normalized URI, got %q", stored.URI())
	}
	if stored.Data()["custom"] != "keep" {
		t.Fatalf("expected custom data preserved, got %#v", stored.Data())
	}
	if stored.GND() == nil || stored.GND().PreferredName != "Barth, Carl" {
		t.Fatalf("expected refreshed GND payload, got %#v", stored.Data())
	}
}

func TestRefreshAgentLinkedDataUpdatesDataForDNBURI(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	agent := createTestAgent(t, testApp, "https://d-nb.info/gnd/116267968", map[string]any{"custom": "keep"})

	restoreClient := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: http.StatusOK,
			Body: io.NopCloser(strings.NewReader(
				`{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}`,
			)),
			Header:  make(http.Header),
			Request: req,
		}, nil
	}))
	defer restoreClient()

	refreshed, err := musenalmApp.RefreshAgentLinkedData(agent.Id)
	if err != nil {
		t.Fatalf("RefreshAgentLinkedData: %v", err)
	}
	if refreshed.URI() != "https://d-nb.info/gnd/116267968" {
		t.Fatalf("expected normalized URI, got %q", refreshed.URI())
	}
	if refreshed.GND() == nil || refreshed.GND().PreferredName != "Barth, Carl" {
		t.Fatalf("expected refreshed GND payload, got %#v", refreshed.Data())
	}
}

func TestRefreshAgentLinkedDataRejectsUnsupportedURI(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	agent := createTestAgent(t, testApp, "https://example.com/person/1", map[string]any{"custom": "keep"})

	_, err := musenalmApp.RefreshAgentLinkedData(agent.Id)
	if err == nil {
		t.Fatal("expected unsupported URI error")
	}
	if !errors.Is(err, ErrLinkedDataRefreshUnsupportedURI) {
		t.Fatalf("expected ErrLinkedDataRefreshUnsupportedURI, got %v", err)
	}
}

func TestRefreshAgentGNDClearsStaleDataOnFetchFailure(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	agent := createTestAgent(t, testApp, "https://d-nb.info/gnd/116267968", map[string]any{
		"gnd":    map[string]any{"preferredName": "Old"},
		"custom": "keep",
	})

	restoreClient := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		return &http.Response{
			StatusCode: http.StatusInternalServerError,
			Body:       io.NopCloser(strings.NewReader("boom")),
			Header:     make(http.Header),
			Request:    req,
		}, nil
	}))
	defer restoreClient()

	musenalmApp.refreshAgentGND(agent.Id)

	stored, err := dbmodels.Agents_ID(testApp, agent.Id)
	if err != nil {
		t.Fatalf("reload agent: %v", err)
	}
	if stored.URI() != "https://d-nb.info/gnd/116267968" {
		t.Fatalf("expected URI preserved, got %q", stored.URI())
	}
	if stored.Data()["custom"] != "keep" {
		t.Fatalf("expected custom data preserved, got %#v", stored.Data())
	}
	if stored.GND() != nil {
		t.Fatalf("expected stale GND data to be cleared, got %#v", stored.Data())
	}
}

func TestRefreshAgentGNDSkipsStaleWorkerResult(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	agent := createTestAgent(t, testApp, "https://d-nb.info/gnd/116267968", map[string]any{
		"gnd": map[string]any{"preferredName": "Old"},
	})

	release := make(chan struct{})
	restoreClient := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		<-release
		return &http.Response{
			StatusCode: http.StatusOK,
			Body: io.NopCloser(strings.NewReader(
				`{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}`,
			)),
			Header:  make(http.Header),
			Request: req,
		}, nil
	}))
	defer restoreClient()

	done := make(chan struct{})
	go func() {
		defer close(done)
		musenalmApp.refreshAgentGND(agent.Id)
	}()

	time.Sleep(20 * time.Millisecond)
	stale, err := dbmodels.Agents_ID(testApp, agent.Id)
	if err != nil {
		t.Fatalf("reload stale agent: %v", err)
	}
	stale.SetURI("https://example.com/person/1")
	stale.SetData(map[string]any{"custom": "new"})
	if err := testApp.Save(stale); err != nil {
		t.Fatalf("save changed URI: %v", err)
	}

	close(release)
	<-done

	stored, err := dbmodels.Agents_ID(testApp, agent.Id)
	if err != nil {
		t.Fatalf("reload agent: %v", err)
	}
	if stored.URI() != "https://example.com/person/1" {
		t.Fatalf("expected newer URI to win, got %q", stored.URI())
	}
	if stored.Data()["custom"] != "new" {
		t.Fatalf("expected newer data to win, got %#v", stored.Data())
	}
	if stored.GND() != nil {
		t.Fatalf("expected stale worker to be ignored, got %#v", stored.Data())
	}
}

func newTestMusenalmApp(t *testing.T) (*tests.TestApp, *App) {
	t.Helper()

	testApp, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("NewTestApp: %v", err)
	}
	if err := testApp.Save(testAgentsCollection()); err != nil {
		testApp.Cleanup()
		t.Fatalf("save agents collection: %v", err)
	}
	if err := testApp.Save(testSettingsCollection()); err != nil {
		testApp.Cleanup()
		t.Fatalf("save settings collection: %v", err)
	}
	if err := testApp.Save(testLobidCacheCollection()); err != nil {
		testApp.Cleanup()
		t.Fatalf("save lobid cache collection: %v", err)
	}

	musenalmApp := &App{
		PB:                      &pocketbase.PocketBase{App: testApp},
		displayCache:            NewDisplayCache(),
		displayCacheRefreshPlan: newDisplayRefreshPlan(),
		lobidClient: newLobidClient(testApp, lobidClientConfig{
			searchInterval:   time.Nanosecond,
			lookupInterval:   time.Nanosecond,
			searchRetries:    lobidSearchMaxRetries,
			lookupRetries:    lobidLookupMaxRetries,
			backoffBase:      time.Millisecond,
			backoffCap:       2 * time.Millisecond,
			jitterUpperBound: time.Nanosecond,
		}),
	}
	return testApp, musenalmApp
}

func cleanupTestMusenalmApp(t *testing.T, testApp *tests.TestApp, musenalmApp *App) {
	t.Helper()

	waitForCondition(t, time.Second, func() bool {
		return !musenalmApp.displayCacheRefreshRun
	}, "display cache refresh loop shutdown")
	testApp.Cleanup()
}

func createTestAgent(t *testing.T, app core.App, uri string, data map[string]any) *dbmodels.Agent {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		t.Fatalf("find agents collection: %v", err)
	}

	agent := dbmodels.NewAgent(core.NewRecord(collection))
	agent.SetName("Karl Barth")
	agent.SetURI(uri)
	agent.SetData(data)
	if err := app.Save(agent); err != nil {
		t.Fatalf("save agent: %v", err)
	}
	return agent
}

func testAgentsCollection() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: dbmodels.AGENTS_NAME_FIELD, Required: true},
		&core.BoolField{Name: dbmodels.AGENTS_CORP_FIELD},
		&core.BoolField{Name: dbmodels.AGENTS_FICTIONAL_FIELD},
		&core.URLField{Name: dbmodels.URI_FIELD},
		&core.TextField{Name: dbmodels.AGENTS_BIOGRAPHICAL_DATA_FIELD},
		&core.TextField{Name: dbmodels.AGENTS_PROFESSION_FIELD},
		&core.TextField{Name: dbmodels.AGENTS_PSEUDONYMS_FIELD},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD},
		&core.JSONField{Name: dbmodels.DATA_FIELD},
		&core.NumberField{Name: dbmodels.MUSENALMID_FIELD},
		&core.TextField{Name: dbmodels.EDITSTATE_FIELD},
		&core.TextField{Name: dbmodels.COMMENT_FIELD},
		&core.TextField{Name: dbmodels.ANNOTATION_FIELD},
		&core.TextField{Name: dbmodels.EDITOR_FIELD},
	)
	return collection
}

func testSettingsCollection() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.SETTINGS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true},
		&core.JSONField{Name: dbmodels.VALUE_FIELD},
	)
	return collection
}

func testLobidCacheCollection() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.LOBID_CACHE_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true},
		&core.TextField{Name: dbmodels.KIND_FIELD, Required: true},
		&core.NumberField{Name: dbmodels.STATUS_CODE_FIELD, Required: true},
		&core.TextField{Name: dbmodels.BODY_FIELD},
		&core.DateField{Name: dbmodels.EXPIRES_AT_FIELD, Required: true},
	)
	return collection
}

func lobidClientTestSwapHTTP(t *testing.T, transport http.RoundTripper) func() {
	t.Helper()
	original := lobidClientHTTP
	lobidClientHTTP = &http.Client{Transport: transport}
	return func() {
		lobidClientHTTP = original
	}
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}
