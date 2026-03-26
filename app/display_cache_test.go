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

func TestShouldResetDisplayCache(t *testing.T) {
	if shouldResetDisplayCache(canonical.MutationEffects{}) {
		t.Fatal("expected empty effects not to reset display cache")
	}

	effects := canonical.MutationEffects{
		UpdateContents: map[string]string{"content-1": "entry-1"},
	}
	if !shouldResetDisplayCache(effects) {
		t.Fatal("expected content updates to reset display cache")
	}
}
