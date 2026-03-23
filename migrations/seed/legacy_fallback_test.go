package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

func TestLegacyBandMatches(t *testing.T) {
	baende := xmlmodels.Bände{
		Bände: []xmlmodels.Band{
			{ID: 4848, BiblioID: 100},
			{ID: 4849, BiblioID: 101},
			{ID: 4850, BiblioID: 102},
			{ID: 4851, BiblioID: 103},
		},
	}

	legacy := &xmlmodels.LegacyFallbackData{
		AlmByBiblioID: map[int]xmlmodels.LegacyAlmNeuRow{
			101: {BiblioNr: 101, Nummer: 9001, ID: 0},
			102: {BiblioNr: 102, Nummer: 0, ID: 0},
			103: {BiblioNr: 103, Nummer: 9003, ID: 0},
		},
		InhalteByEntryID: map[int][]xmlmodels.LegacyINHTabRow{
			9001: {
				{ID: 9001, INHNR: 1},
				{ID: 9001, INHNR: 2},
			},
		},
	}

	got := LegacyBandMatches(baende, legacy)

	if len(got) != 2 {
		t.Fatalf("expected 2 legacy band matches, got %d", len(got))
	}

	if _, ok := got[4848]; ok {
		t.Fatalf("band 4848 should not use legacy contents")
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
