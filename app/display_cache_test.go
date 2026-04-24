package app

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
)

func TestBuildContentDisplayTitleFromFields(t *testing.T) {
	t.Run("prefers preferred title", func(t *testing.T) {
		got := buildContentDisplayTitleFromFields(
			"Kurztitel",
			"Langer Titel",
			"Untertitel",
			"Incipit",
			[]string{"Lied"},
			"Goethe",
			"12-14",
			17,
		)

		if got != "Kurztitel" {
			t.Fatalf("expected preferred title, got %q", got)
		}
	})

	t.Run("builds composite fallback from type and responsibility", func(t *testing.T) {
		got := buildContentDisplayTitleFromFields(
			"",
			"",
			"",
			"",
			[]string{"Lied", "Gedicht"},
			"Goethe",
			"",
			17,
		)

		want := "[Lied, Gedicht] Unterzeichnet: Goethe"
		if got != want {
			t.Fatalf("expected %q, got %q", want, got)
		}
	})

	t.Run("falls back to musenalm id label", func(t *testing.T) {
		got := buildContentDisplayTitleFromFields(
			"",
			"",
			"",
			"",
			nil,
			"",
			"",
			42,
		)

		if got != "Inhalt #42" {
			t.Fatalf("expected musenalm fallback, got %q", got)
		}
	})
}

func TestBuildContentDisplayPage(t *testing.T) {
	if got := buildContentDisplayPageFromFields("17", "12-14"); got != "17" {
		t.Fatalf("expected pagination to win, got %q", got)
	}

	if got := buildContentDisplayPageFromFields("", "12-14"); got != "12-14" {
		t.Fatalf("expected extent fallback, got %q", got)
	}
}

func TestFallbackDisplaysAreSafe(t *testing.T) {
	if got := fallbackAgentDisplay("agent-1"); got == nil || got.Name != "agent-1" {
		t.Fatal("expected safe agent fallback")
	}
	if got := fallbackSeriesDisplay("series-1"); got == nil || got.Name != "series-1" {
		t.Fatal("expected safe series fallback")
	}
	if got := fallbackEntryDisplay("entry-1"); got == nil || got.ShortTitle != "entry-1" {
		t.Fatal("expected safe entry fallback")
	}
	if got := fallbackEntryDisplay("entry-1"); got == nil || got.PreferredTitle != "entry-1" || got.TitleStmt != "entry-1" {
		t.Fatal("expected safe entry aliases")
	}
	if got := fallbackPlaceDisplay("place-1"); got == nil || got.Name != "place-1" {
		t.Fatal("expected safe place fallback")
	}
	if got := fallbackContentDisplay("content-1"); got == nil || got.Title != "content-1" {
		t.Fatal("expected safe content fallback")
	}
}

func TestGetAllPlaceDisplaysIncludesToDoPlaces(t *testing.T) {
	t.Parallel()

	app := &App{displayCache: NewDisplayCache()}
	app.displayCache.Places.Store("place-visible", &PlaceDisplay{
		ID:        "place-visible",
		Name:      "Augsburg",
		EditState: "Edited",
	})
	app.displayCache.Places.Store("place-todo", &PlaceDisplay{
		ID:        "place-todo",
		Name:      "Berlin",
		EditState: "ToDo",
	})

	displays := app.GetAllPlaceDisplays()
	if len(displays) != 2 {
		t.Fatalf("expected both cached places, got %d", len(displays))
	}

	gotStates := map[string]string{}
	for _, display := range displays {
		gotStates[display.ID] = display.EditState
	}

	if gotStates["place-visible"] != "Edited" {
		t.Fatalf("expected visible place in cache, got %q", gotStates["place-visible"])
	}
	if gotStates["place-todo"] != "ToDo" {
		t.Fatalf("expected ToDo place to remain in cache, got %q", gotStates["place-todo"])
	}
}

func TestGetAllAgentDisplaysIncludesToDoAgents(t *testing.T) {
	t.Parallel()

	app := &App{displayCache: NewDisplayCache()}
	app.displayCache.Agents.Store("agent-visible", &AgentDisplay{
		ID:        "agent-visible",
		Name:      "Anna Example",
		EditState: "Edited",
		LifeDates: "1770-1830",
	})
	app.displayCache.Agents.Store("agent-todo", &AgentDisplay{
		ID:            "agent-todo",
		Name:          "Botanische Gesellschaft",
		EditState:     "ToDo",
		CorporateBody: true,
	})

	displays := app.GetAllAgentDisplays()
	if len(displays) != 2 {
		t.Fatalf("expected both cached agents, got %d", len(displays))
	}

	gotStates := map[string]string{}
	for _, display := range displays {
		gotStates[display.ID] = display.EditState
	}

	if gotStates["agent-visible"] != "Edited" {
		t.Fatalf("expected visible agent in cache, got %q", gotStates["agent-visible"])
	}
	if gotStates["agent-todo"] != "ToDo" {
		t.Fatalf("expected ToDo agent to remain in cache, got %q", gotStates["agent-todo"])
	}
}

func TestDisplayRefreshPlanFromEffects(t *testing.T) {
	empty := displayRefreshPlanFromEffects(canonical.MutationEffects{})
	if empty.hasWork() {
		t.Fatal("expected empty effects not to schedule display refresh work")
	}

	effects := canonical.MutationEffects{
		UpdateAgents:   map[string]bool{"agent-1": false},
		DeleteEntries:  map[string]struct{}{"entry-1": {}},
		UpdateContents: map[string]string{"content-1": "entry-1"},
	}

	plan := displayRefreshPlanFromEffects(effects)
	if !plan.hasWork() {
		t.Fatal("expected targeted display refresh work")
	}
	if _, ok := plan.updateAgents["agent-1"]; !ok {
		t.Fatal("expected agent update to be tracked")
	}
	if _, ok := plan.deleteEntries["entry-1"]; !ok {
		t.Fatal("expected entry delete to be tracked")
	}
	if _, ok := plan.updateContents["content-1"]; !ok {
		t.Fatal("expected content update to be tracked")
	}
}

func TestDisplayRefreshPlanMergePrefersDelete(t *testing.T) {
	first := newDisplayRefreshPlan()
	first.updateEntries["entry-1"] = struct{}{}

	second := newDisplayRefreshPlan()
	second.deleteEntries["entry-1"] = struct{}{}

	first.merge(second)

	if _, ok := first.updateEntries["entry-1"]; ok {
		t.Fatal("expected delete to remove pending entry update")
	}
	if _, ok := first.deleteEntries["entry-1"]; !ok {
		t.Fatal("expected entry delete to remain queued")
	}
}
