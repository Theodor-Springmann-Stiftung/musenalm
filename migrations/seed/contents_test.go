package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func TestExtractContentPseudonymImportDataRemovesLeadingMarkerBlock(t *testing.T) {
	data := extractContentPseudonymImportData("Autor #", "# Pseud. /) Hinweis")

	if !data.pseudonym {
		t.Fatal("expected pseudonym marker to be detected")
	}
	if data.responsibility != "Autor" {
		t.Fatalf("expected stripped author, got %q", data.responsibility)
	}
	if data.annotation != "Hinweis" {
		t.Fatalf("expected stripped annotation, got %q", data.annotation)
	}
}

func TestExtractContentPseudonymImportDataClearsMarkerOnlyAnnotation(t *testing.T) {
	data := extractContentPseudonymImportData("Autor", "# Pseud.")

	if !data.pseudonym {
		t.Fatal("expected pseudonym marker to be detected")
	}
	if data.annotation != "" {
		t.Fatalf("expected empty annotation, got %q", data.annotation)
	}
}

func TestExtractContentPseudonymImportDataKeepsPseudTextWithoutSlashParen(t *testing.T) {
	data := extractContentPseudonymImportData("Autor", "# Pseud. mutmaßlich nur Kürzel")

	if !data.pseudonym {
		t.Fatal("expected pseudonym marker to be detected")
	}
	if data.annotation != "Pseud. mutmaßlich nur Kürzel" {
		t.Fatalf("expected preserved pseudonym note without leading hash, got %q", data.annotation)
	}
}

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
