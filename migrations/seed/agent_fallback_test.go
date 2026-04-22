package seed

import "testing"

func TestParseAgentNames(t *testing.T) {
	got := ParseAgentNames("  Mauch, Johann Mathäus  u.  Cooke, George ;  u.  Ramberg, Johann Heinrich & Jury, Wilhelm  ")

	want := []string{
		"Mauch, Johann Mathäus",
		"Cooke, George",
		"Ramberg, Johann Heinrich",
		"Jury, Wilhelm",
	}

	if len(got) != len(want) {
		t.Fatalf("expected %d names, got %d: %#v", len(want), len(got), got)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %q at %d, got %q", want[i], i, got[i])
		}
	}
}

func TestParseAgentNamesSplitsBareSemicolons(t *testing.T) {
	got := ParseAgentNames("Ariosto, Lodovico; Gries, Johann Diederich")
	want := []string{
		"Ariosto, Lodovico",
		"Gries, Johann Diederich",
	}

	if len(got) != len(want) {
		t.Fatalf("expected %d names, got %d: %#v", len(want), len(got), got)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %q at %d, got %q", want[i], i, got[i])
		}
	}
}

func TestParseAgentNamesSplitsThreeOrMoreNamesAndTrims(t *testing.T) {
	got := ParseAgentNames(" Ariosto, Lodovico ; Gries, Johann Diederich u. Streckfuß, Karl &  Wieland, Christoph Martin ")
	want := []string{
		"Ariosto, Lodovico",
		"Gries, Johann Diederich",
		"Streckfuß, Karl",
		"Wieland, Christoph Martin",
	}

	if len(got) != len(want) {
		t.Fatalf("expected %d names, got %d: %#v", len(want), len(got), got)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %q at %d, got %q", want[i], i, got[i])
		}
	}
}

func TestMinimalAutoCreatedAgentDefaults(t *testing.T) {
	got := buildMinimalAutoCreatedAgent("  Ariosto, Lodovico  ")

	if got.name != "Ariosto, Lodovico" {
		t.Fatalf("expected trimmed name, got %q", got.name)
	}
	if got.editState != "ToDo" {
		t.Fatalf("expected ToDo edit state, got %q", got.editState)
	}
	if got.annotation != autoCreatedLegacyContentAgentAnnotation {
		t.Fatalf("expected auto-created annotation, got %q", got.annotation)
	}
}

func TestLegacyMusenalmTypes(t *testing.T) {
	got := legacyMusenalmTypes("Text u. Tabelle")
	if len(got) != 2 || got[0] != "Text" || got[1] != "Tabelle" {
		t.Fatalf("unexpected types: %#v", got)
	}
}

func TestLegacyMusenalmTypesLegacyAbbreviations(t *testing.T) {
	got := legacyMusenalmTypes("G-Verz I-Verz")
	want := []string{"Graphik-Verzeichnis", "Inhaltsverzeichnis"}

	if len(got) != len(want) {
		t.Fatalf("expected %d types, got %d: %#v", len(want), len(got), got)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %q at %d, got %q", want[i], i, got[i])
		}
	}
}

func TestLegacyMusenalmTypesMissingSpaceAfterUDot(t *testing.T) {
	got := legacyMusenalmTypes("Text u.Tabelle")
	want := []string{"Text", "Tabelle"}

	if len(got) != len(want) {
		t.Fatalf("expected %d types, got %d: %#v", len(want), len(got), got)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %q at %d, got %q", want[i], i, got[i])
		}
	}
}

func TestLegacyMusenalmTypesMapsLegacySingles(t *testing.T) {
	got := legacyMusenalmTypes("I-Verz")
	if len(got) != 1 || got[0] != "Inhaltsverzeichnis" {
		t.Fatalf("unexpected types: %#v", got)
	}

	got = legacyMusenalmTypes("Kalender")
	if len(got) != 1 || got[0] != "Kalendarium" {
		t.Fatalf("unexpected types: %#v", got)
	}

	got = legacyMusenalmTypes("Gedicht")
	if len(got) != 1 || got[0] != "Gedicht/Lied" {
		t.Fatalf("unexpected types: %#v", got)
	}
}

func TestLegacyMusenalmTypesIgnoresGarbage(t *testing.T) {
	got := legacyMusenalmTypes("ägegen")
	if len(got) != 0 {
		t.Fatalf("expected no types, got %#v", got)
	}
}
