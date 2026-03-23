package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

func TestLegacyFallbackContentsByEntry(t *testing.T) {
	baende := xmlmodels.Bände{
		Bände: []xmlmodels.Band{
			{ID: 4796, BiblioID: 100},
			{ID: 4797, BiblioID: 101},
			{ID: 4798, BiblioID: 102},
			{ID: 4799, BiblioID: 103},
			{ID: 4800, BiblioID: 104},
		},
	}

	modernCounts := map[int]int{
		4798: 1,
	}

	legacy := &xmlmodels.LegacyFallbackData{
		AlmByBiblioID: map[int]xmlmodels.LegacyAlmNeuRow{
			101: {BiblioNr: 101, ID: 0},
			103: {BiblioNr: 103, ID: 9001},
			104: {BiblioNr: 104, ID: 9002},
		},
		InhalteByEntryID: map[int][]xmlmodels.LegacyINHTabRow{
			9001: {
				{ID: 9001, INHNR: 1},
				{ID: 9001, INHNR: 2},
			},
		},
	}

	got := LegacyFallbackContentsByEntry(baende, modernCounts, legacy)

	if len(got) != 1 {
		t.Fatalf("expected 1 fallback hit, got %d", len(got))
	}

	rows := got[4799]
	if len(rows) != 2 {
		t.Fatalf("expected 2 fallback rows for entry 4799, got %d", len(rows))
	}
}
