package controllers

import (
	"testing"

	musenalmapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
)

func TestBuildReihenPlaceOptionsFromCacheFiltersToDoAndSorts(t *testing.T) {
	t.Parallel()

	options := buildReihenPlaceOptionsFromCache([]*musenalmapp.PlaceDisplay{
		{ID: "2", Name: "Zuerich", EditState: "Edited"},
		{ID: "3", Name: "Berlin", EditState: "ToDo"},
		{ID: "1", Name: "Aachen", EditState: "Review"},
	})

	if len(options) != 2 {
		t.Fatalf("expected 2 visible place options, got %d", len(options))
	}

	if options[0].Value != "1" || options[0].Label != "Aachen" {
		t.Fatalf("expected Aachen first, got %#v", options[0])
	}
	if options[1].Value != "2" || options[1].Label != "Zuerich" {
		t.Fatalf("expected Zuerich second, got %#v", options[1])
	}
}

func TestBuildReihenPlaceOptionsFromCacheFallsBackToIDLabel(t *testing.T) {
	t.Parallel()

	options := buildReihenPlaceOptionsFromCache([]*musenalmapp.PlaceDisplay{
		{ID: "place-1", Name: "   ", EditState: "Edited"},
	})

	if len(options) != 1 {
		t.Fatalf("expected 1 place option, got %d", len(options))
	}
	if options[0].Label != "place-1" {
		t.Fatalf("expected fallback label from ID, got %q", options[0].Label)
	}
}

func TestBuildReihenAgentOptionsFromCacheFiltersToDoSortsAndKeepsMetadata(t *testing.T) {
	t.Parallel()

	options := buildReihenAgentOptionsFromCache([]*musenalmapp.AgentDisplay{
		{ID: "2", Name: "Zweite", EditState: "Edited", LifeDates: "1770-1830"},
		{ID: "3", Name: "Berliner Kreis", EditState: "ToDo", CorporateBody: true},
		{ID: "1", Name: "Aachen", EditState: "Review"},
		{ID: "4", Name: "Archivverein", EditState: "Edited", CorporateBody: true},
	})

	if len(options) != 3 {
		t.Fatalf("expected 3 visible agent options, got %d", len(options))
	}

	if options[0].Value != "1" || options[0].Label != "Aachen" {
		t.Fatalf("expected Aachen first, got %#v", options[0])
	}
	if options[1].Value != "4" || options[1].Label != "Archivverein" || !options[1].MetaIsBadge || options[1].Meta != "ORG" {
		t.Fatalf("expected corporate body metadata for Archivverein, got %#v", options[1])
	}
	if options[2].Value != "2" || options[2].Label != "Zweite" || options[2].Meta != "1770-1830" || options[2].MetaIsBadge {
		t.Fatalf("expected bio metadata for Zweite, got %#v", options[2])
	}
}

func TestBuildReihenAgentOptionsFromCacheFallsBackToIDLabel(t *testing.T) {
	t.Parallel()

	options := buildReihenAgentOptionsFromCache([]*musenalmapp.AgentDisplay{
		{ID: "agent-1", Name: "   ", EditState: "Edited"},
	})

	if len(options) != 1 {
		t.Fatalf("expected 1 agent option, got %d", len(options))
	}
	if options[0].Label != "agent-1" {
		t.Fatalf("expected fallback label from ID, got %q", options[0].Label)
	}
}
