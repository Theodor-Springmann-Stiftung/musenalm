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
		4849: {LegacyAlm: xmlmodels.LegacyAlmNeuRow{Nummer: 4849}, Rows: []xmlmodels.LegacyINHTabRow{{INHNR: 1}}},
	}

	got := SelectedContentCounts(inhalte, legacy)
	if got[4848] != 2 {
		t.Fatalf("expected modern count 2 for 4848, got %d", got[4848])
	}
	if got[4849] != 1 {
		t.Fatalf("expected legacy count 1 for 4849, got %d", got[4849])
	}
}
