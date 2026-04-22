package seed

import (
	"os"
	"path/filepath"
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
	if data.annotation != "mutmaßlich nur Kürzel" {
		t.Fatalf("expected stripped pseudonym marker text, got %q", data.annotation)
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

func TestLegacyPageExtentDropsFractionalPart(t *testing.T) {
	if got := legacyPageExtent(37.001); got != "37" {
		t.Fatalf("expected 37, got %q", got)
	}
	if got := legacyPageExtent(103.999); got != "103" {
		t.Fatalf("expected 103, got %q", got)
	}
}

func TestParseIndexedImageSupportsLegacyFilenameVariants(t *testing.T) {
	tests := []struct {
		path      string
		wantID    int
		wantGroup int
		wantOrder int
	}{
		{path: "/tmp/alm-2720-116493.jpg", wantID: 116493, wantGroup: 0, wantOrder: 0},
		{path: "/tmp/alm-2738-134137,02.jpg", wantID: 134137, wantGroup: 1, wantOrder: 2},
		{path: "/tmp/alm-2731-125756-3.jpg", wantID: 125756, wantGroup: 1, wantOrder: 3},
		{path: "/tmp/alm2365-120372.jpg", wantID: 120372, wantGroup: 0, wantOrder: 0},
		{path: "/tmp/alm.1905-132650.jpg", wantID: 132650, wantGroup: 0, wantOrder: 0},
		{path: "/tmp/alm-2731-125756 (2).jpg", wantID: 125756, wantGroup: 2, wantOrder: 0},
	}

	for _, tt := range tests {
		gotID, image, ok := parseIndexedImage(tt.path)
		if !ok {
			t.Fatalf("expected %q to parse", tt.path)
		}
		if gotID != tt.wantID || image.orderGroup != tt.wantGroup || image.order != tt.wantOrder {
			t.Fatalf("unexpected parse for %q: id=%d group=%d order=%d", tt.path, gotID, image.orderGroup, image.order)
		}
	}
}

func TestIndexContentImagesSortsBaseThenOrderedThenUnordered(t *testing.T) {
	dir := t.TempDir()
	files := []string{
		"nested/alm-2731-125756-3.jpg",
		"nested/alm-2731-125756.jpg",
		"nested/alm-2731-125756 (2).jpg",
		"nested/alm-2731-125756-1.jpg",
		"nested/Thumbs.db",
		"nested/alm-2731-125756,02.jpg",
	}

	for _, name := range files {
		full := filepath.Join(dir, name)
		if err := os.MkdirAll(filepath.Dir(full), 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(full, []byte("x"), 0o644); err != nil {
			t.Fatal(err)
		}
	}

	got := IndexContentImages(dir).PathsForContent(125756)
	want := []string{
		filepath.Join(dir, "nested/alm-2731-125756.jpg"),
		filepath.Join(dir, "nested/alm-2731-125756-1.jpg"),
		filepath.Join(dir, "nested/alm-2731-125756,02.jpg"),
		filepath.Join(dir, "nested/alm-2731-125756-3.jpg"),
		filepath.Join(dir, "nested/alm-2731-125756 (2).jpg"),
	}

	if len(got) != len(want) {
		t.Fatalf("expected %d images, got %d: %#v", len(want), len(got), got)
	}

	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("expected %q at %d, got %q", want[i], i, got[i])
		}
	}
}
