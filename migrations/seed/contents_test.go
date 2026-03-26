package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func TestApplyLegacyUpdatedToContentSetsUpdatedFromLegacyBand(t *testing.T) {
	record := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))

	applyLegacyUpdatedToContent(record, LegacyBandMatch{
		LegacyAlm: xmlmodels.LegacyAlmNeuRow{BearbeitetAm: "2024-01-02 03:04:05.000Z"},
	})

	if got := record.Updated().String(); got != "2024-01-02 03:04:05.000Z" {
		t.Fatalf("expected updated timestamp from legacy band, got %q", got)
	}
}

func TestApplyLegacyUpdatedToContentIgnoresInvalidLegacyTimestamp(t *testing.T) {
	record := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))

	applyLegacyUpdatedToContent(record, LegacyBandMatch{
		LegacyAlm: xmlmodels.LegacyAlmNeuRow{BearbeitetAm: "not-a-date"},
	})

	if !record.Updated().IsZero() {
		t.Fatalf("expected zero updated timestamp, got %q", record.Updated().String())
	}
}
