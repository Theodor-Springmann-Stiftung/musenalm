package dbmodels

import (
	"testing"

	"github.com/pocketbase/pocketbase/core"
)

func TestAgentGND(t *testing.T) {
	collection := core.NewBaseCollection(AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: AGENTS_NAME_FIELD},
		&core.URLField{Name: URI_FIELD},
		&core.JSONField{Name: DATA_FIELD},
	)

	record := core.NewRecord(collection)
	record.Set(URI_FIELD, "d-nb.info/gnd/116267968")
	record.Set(DATA_FIELD, map[string]any{
		"gnd": map[string]any{
			"id":            "https://d-nb.info/gnd/116267968",
			"gndIdentifier": "116267968",
			"preferredName": "Barth, Carl",
		},
	})

	agent := NewAgent(record)
	person := agent.GND()
	if person == nil {
		t.Fatal("expected typed GND data")
	}
	if person.GndIdentifier != "116267968" {
		t.Fatalf("expected GND identifier, got %q", person.GndIdentifier)
	}
}

func TestAgentGNDReturnsNilWithoutGNDURI(t *testing.T) {
	collection := core.NewBaseCollection(AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.URLField{Name: URI_FIELD},
		&core.JSONField{Name: DATA_FIELD},
	)

	record := core.NewRecord(collection)
	record.Set(URI_FIELD, "https://example.com/person/1")
	record.Set(DATA_FIELD, map[string]any{
		"gnd": map[string]any{"preferredName": "Ignored"},
	})

	agent := NewAgent(record)
	if agent.GND() != nil {
		t.Fatal("expected nil for non-GND URI")
	}
}
