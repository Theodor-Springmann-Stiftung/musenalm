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

func TestLegacyMusenalmTypes(t *testing.T) {
	got := legacyMusenalmTypes("Text u. Tabelle")
	if len(got) != 2 || got[0] != "Text" || got[1] != "Tabelle" {
		t.Fatalf("unexpected types: %#v", got)
	}
}
