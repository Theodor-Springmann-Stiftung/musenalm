package controllers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
	"github.com/pocketbase/pocketbase/tools/router"
)

func TestSettingsDataIncludesGNDLastRun(t *testing.T) {
	testApp := newSettingsTestApp(t)
	defer testApp.Cleanup()

	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_last_run", "2026-06-10T12:00:00Z")

	data, err := settingsData(testApp)
	if err != nil {
		t.Fatalf("settingsData: %v", err)
	}

	if got := data["gnd_last_run"]; got == "" {
		t.Fatalf("expected gnd_last_run, got %#v", got)
	}
	if dt, ok := data["gnd_last_run_dt"].(interface{ IsZero() bool }); !ok || dt.IsZero() {
		t.Fatalf("expected non-zero gnd_last_run_dt, got %#v", data["gnd_last_run_dt"])
	}
}

func TestHandleAgentGNDStatusReturnsStoredStatus(t *testing.T) {
	testApp := newSettingsTestApp(t)
	defer testApp.Cleanup()

	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_status", "complete")
	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_message", "GND-Anreicherung abgeschlossen.")
	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_error", "")
	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_done", 5)
	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_total", 5)
	upsertSettingsRecord(t, testApp, "agents_gnd_enrichment_last_run", "2026-06-10T12:00:00Z")

	req := httptest.NewRequest(http.MethodGet, "/admin/settings/gnd/status/", nil)
	rec := httptest.NewRecorder()
	event := &core.RequestEvent{
		App: testApp,
		Event: router.Event{
			Request:  req,
			Response: rec,
		},
	}

	if err := handleAgentGNDStatus(testApp)(event); err != nil {
		t.Fatalf("handleAgentGNDStatus: %v", err)
	}

	var payload map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload["status"] != "complete" {
		t.Fatalf("expected complete status, got %#v", payload["status"])
	}
	if payload["done"] != float64(5) || payload["total"] != float64(5) {
		t.Fatalf("unexpected progress payload %#v", payload)
	}
	if payload["last_run"] == "" {
		t.Fatalf("expected last_run payload, got %#v", payload)
	}
}

func newSettingsTestApp(t *testing.T) *tests.TestApp {
	t.Helper()

	testApp, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("NewTestApp: %v", err)
	}
	if err := testApp.Save(testSettingsCollectionForController()); err != nil {
		testApp.Cleanup()
		t.Fatalf("save settings collection: %v", err)
	}

	return testApp
}

func upsertSettingsRecord(t *testing.T, app core.App, key string, value any) {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.SETTINGS_TABLE)
	if err != nil {
		t.Fatalf("find settings collection: %v", err)
	}

	record := core.NewRecord(collection)
	record.Set(dbmodels.KEY_FIELD, key)
	record.Set(dbmodels.VALUE_FIELD, value)
	if err := app.Save(record); err != nil {
		t.Fatalf("save setting %s: %v", key, err)
	}
}

func testSettingsCollectionForController() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.SETTINGS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: dbmodels.KEY_FIELD, Required: true},
		&core.JSONField{Name: dbmodels.VALUE_FIELD},
	)
	return collection
}
