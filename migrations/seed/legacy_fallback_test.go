package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

func TestLegacyBandMatches(t *testing.T) {
	baende := xmlmodels.Bände{
		Bände: []xmlmodels.Band{
			{ID: 4845},
			{ID: 4846},
			{ID: 4847},
			{ID: 4848, BiblioID: 100},
			{ID: 4849, BiblioID: 101},
			{ID: 4850, BiblioID: 102},
			{ID: 4851, BiblioID: 103},
		},
	}

	inhalte := xmlmodels.Inhalte{
		Inhalte: []xmlmodels.Inhalt{
			{ID: 1, Band: 4846, Typ: xmlmodels.Typ{Value: []string{"Gedicht/Lied"}}, Urheberangabe: "unbezeichnet"},
			{ID: 2, Band: 4848, Titelangabe: "Modern 4848", Typ: xmlmodels.Typ{Value: []string{"Text"}}},
		},
	}

	legacy := &xmlmodels.LegacyFallbackData{
		AlmByLegacyEntryID: map[int]xmlmodels.LegacyAlmNeuRow{
			4845: {Nummer: 4845, Reihentitel: "Alt 4845"},
			4846: {Nummer: 4846, Reihentitel: "Alt 4846"},
			4847: {Nummer: 4847, Reihentitel: "Alt 4847"},
			4848: {Nummer: 4848, Reihentitel: "Alt 4848"},
		},
		AlmByBiblioID: map[int]xmlmodels.LegacyAlmNeuRow{
			101: {BiblioNr: 101, Nummer: 9001, ID: 0},
			102: {BiblioNr: 102, Nummer: 0, ID: 0},
			103: {BiblioNr: 103, Nummer: 9003, ID: 0},
		},
		InhalteByEntryID: map[int][]xmlmodels.LegacyINHTabRow{
			4845: {
				{ID: 4845, INHNR: 5, Autor: "unbezeichnet", Objekt: "Gedicht/Lied"},
			},
			4846: {
				{ID: 4846, INHNR: 6, Titel: "Legacy 4846"},
			},
			4847: {
				{ID: 4847, INHNR: 7, Titel: "Legacy 4847"},
			},
			9001: {
				{ID: 9001, INHNR: 1},
				{ID: 9001, INHNR: 2},
			},
		},
	}

	got := LegacyBandMatches(baende, inhalte, legacy)

	if len(got) != 6 {
		t.Fatalf("expected 6 legacy band matches, got %d", len(got))
	}

	if len(got[4845].Rows) != 0 {
		t.Fatalf("band 4845 should not receive dummy-only legacy rows")
	}

	if len(got[4846].Rows) != 1 {
		t.Fatalf("band 4846 should receive legacy fallback rows after dummy modern content was filtered, got %d", len(got[4846].Rows))
	}

	if len(got[4847].Rows) != 1 {
		t.Fatalf("band 4847 should receive legacy fallback rows when no modern content exists, got %d", len(got[4847].Rows))
	}

	if got[4848].LegacyAlm.LegacyEntryID() != 4848 {
		t.Fatalf("expected band 4848 to resolve by legacy entry id, got %+v", got[4848].LegacyAlm)
	}

	if len(got[4848].Rows) != 0 {
		t.Fatalf("band 4848 should not receive legacy content rows while modern content exists")
	}

	if got[4849].LegacyAlm.LegacyEntryID() != 9001 {
		t.Fatalf("expected band 4849 to resolve to legacy entry 9001, got %+v", got[4849].LegacyAlm)
	}

	if len(got[4849].Rows) != 2 {
		t.Fatalf("expected 2 rows for band 4849, got %d", len(got[4849].Rows))
	}

	if len(got[4851].Rows) != 0 {
		t.Fatalf("expected no legacy rows for band 4851, got %d", len(got[4851].Rows))
	}
}
