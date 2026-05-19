package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

func TestSelectedContentCountsPreservesModernCountsBeforeCutover(t *testing.T) {
	inhalte := xmlmodels.Inhalte{
		Inhalte: []xmlmodels.Inhalt{
			{ID: 1, Band: 4848, Titelangabe: "A", Typ: xmlmodels.Typ{Value: []string{"Text"}}},
			{ID: 2, Band: 4848, Titelangabe: "B", Typ: xmlmodels.Typ{Value: []string{"Text"}}},
		},
	}

	legacy := map[int]LegacyBandMatch{
		4848: {LegacyAlm: xmlmodels.LegacyAlmNeuRow{Nummer: 4848}},
		4850: {LegacyAlm: xmlmodels.LegacyAlmNeuRow{Nummer: 4850}, Rows: []xmlmodels.LegacyINHTabRow{{INHNR: 1}}},
	}

	got := SelectedContentCounts(inhalte, legacy)
	if got[4848] != 0 {
		t.Fatalf("expected no count for 4848 without legacy rows, got %d", got[4848])
	}
	if got[4850] != 1 {
		t.Fatalf("expected legacy count 1 for 4850, got %d", got[4850])
	}
}

func TestSelectedContentCountsUsesLegacyFallbackBeforeCutoverWhenModernContentIsFilteredOut(t *testing.T) {
	inhalte := xmlmodels.Inhalte{
		Inhalte: []xmlmodels.Inhalt{
			{ID: 1, Band: 4848, Typ: xmlmodels.Typ{Value: []string{"Gedicht/Lied"}}, Urheberangabe: "unbezeichnet"},
		},
	}

	legacy := map[int]LegacyBandMatch{
		4848: {
			LegacyAlm: xmlmodels.LegacyAlmNeuRow{Nummer: 4848},
			Rows: []xmlmodels.LegacyINHTabRow{
				{INHNR: 10, Titel: "Legacy A"},
				{INHNR: 11, Titel: "Legacy B"},
			},
		},
	}

	got := SelectedContentCounts(inhalte, legacy)
	if got[4848] != 2 {
		t.Fatalf("expected legacy count 2 for 4848, got %d", got[4848])
	}
}

func TestFilterLegacyRowsForFallbackSkipsDummyRows(t *testing.T) {
	rows := []xmlmodels.LegacyINHTabRow{
		{INHNR: 1, Autor: "unbezeichnet", Objekt: "Gedicht/Lied"},
		{INHNR: 2, Titel: "Legacy title"},
	}

	got := filterLegacyRowsForFallback(rows, 42, imageIndex{})
	if len(got) != 1 {
		t.Fatalf("expected 1 filtered legacy row, got %d", len(got))
	}
	if got[0].INHNR != 2 {
		t.Fatalf("expected INHNR 2 to survive filtering, got %d", got[0].INHNR)
	}
}

func TestShouldSkipDummyLegacyContentKeepsRowsWithScans(t *testing.T) {
	row := xmlmodels.LegacyINHTabRow{
		INHNR:  1,
		Autor:  "unbezeichnet",
		Objekt: "Gedicht/Lied",
	}

	images := imageIndex{
		byContentID: map[int][]indexedImage{
			1: {{path: "scan.jpg"}},
		},
	}

	if shouldSkipDummyLegacyContent(row, 42, images) {
		t.Fatal("expected legacy row with scans to be kept")
	}
}
