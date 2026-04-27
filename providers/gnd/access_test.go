package gnd

import "testing"

func TestFromData(t *testing.T) {
	data := map[string]any{
		"gnd": map[string]any{
			"id":            "https://d-nb.info/gnd/116267968",
			"gndIdentifier": "116267968",
			"preferredName": "Barth, Carl",
			"dateOfBirth":   []any{"1787"},
		},
	}

	person := FromData("https://d-nb.info/gnd/116267968", data)
	if person == nil {
		t.Fatal("expected typed person")
	}
	if person.GndIdentifier != "116267968" {
		t.Fatalf("expected GND identifier, got %q", person.GndIdentifier)
	}
	if person.PreferredName != "Barth, Carl" {
		t.Fatalf("expected preferred name, got %q", person.PreferredName)
	}
}

func TestFromDataReturnsNilForInvalidCases(t *testing.T) {
	if got := FromData("https://example.com/person/1", map[string]any{"gnd": map[string]any{"preferredName": "X"}}); got != nil {
		t.Fatal("expected nil for non-GND URI")
	}
	if got := FromData("https://d-nb.info/gnd/1", nil); got != nil {
		t.Fatal("expected nil for missing data")
	}
	if got := FromData("https://d-nb.info/gnd/1", map[string]any{"gnd": "broken"}); got != nil {
		t.Fatal("expected nil for malformed gnd payload")
	}
}

func TestIsGNDURI(t *testing.T) {
	cases := map[string]bool{
		"https://d-nb.info/gnd/1": true,
		"http://d-nb.info/gnd/1":  true,
		"d-nb.info/gnd/1":         true,
		"//d-nb.info/gnd/1":       true,
		"https://example.com/1":   false,
		"":                        false,
	}

	for input, want := range cases {
		if got := IsGNDURI(input); got != want {
			t.Fatalf("IsGNDURI(%q): want %v, got %v", input, want, got)
		}
	}
}
