package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func TestNormalizeLegacyEntryPreferredTitle(t *testing.T) {
	got := normalizeLegacyEntryPreferredTitle("  <div> Taschenbuch,   Herzogl.   S. Coburg </div>  ")
	want := "Taschenbuch, Herzogl. S. Coburg"

	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestNormalizeLegacyEntryPreferredTitleBracketedNotes(t *testing.T) {
	got := normalizeLegacyEntryPreferredTitle("Almanac de Poche pour l’Année 1756 /) vielleicht französische Ausgabe von: Schreib- und Postkalender, Genealogischer (Berlin) 1756")
	want := "Almanac de Poche pour l’Année 1756 [vielleicht französische Ausgabe von: Schreib- und Postkalender, Genealogischer (Berlin) 1756]"

	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestNormalizeLegacyEntryPreferredTitleMultipleBracketedNotes(t *testing.T) {
	got := normalizeLegacyEntryPreferredTitle("Titel /) erste Notiz /) zweite Notiz")
	want := "Titel [erste Notiz] [zweite Notiz]"

	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestNormalizeLegacyEntryPreferredTitleKeepsExistingParens(t *testing.T) {
	got := normalizeLegacyEntryPreferredTitle("Kalender, Genealogischer-Militärischer 1785 /) (franz. Ausgabe: Almanac Généalogique et Militaire pour l’Année 1785)")
	want := "Kalender, Genealogischer-Militärischer 1785 (franz. Ausgabe: Almanac Généalogique et Militaire pour l’Année 1785)"

	if got != want {
		t.Fatalf("expected %q, got %q", want, got)
	}
}

func TestEnrichEntryFromLegacyFillMissingOnly(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))
	entry.SetYear(0)
	entry.SetResponsibilityStmt("")
	entry.SetPlaceStmt("Modern Place")
	entry.SetAnnotation("")
	entry.SetReferences("")
	entry.SetExtent("")

	enrichEntryFromLegacy(entry, xmlmodels.LegacyAlmNeuRow{
		Jahr:        1801,
		Herausgeber: "Old Editor",
		Ort:         "Old Place",
		Anmerkungen: "Old Note",
		Nachweis:    "Old Ref",
		Struktur:    "Old Extent",
		Reihentitel: "Old Title",
	})

	if entry.Year() != 1801 {
		t.Fatalf("expected year 1801, got %d", entry.Year())
	}
	if entry.ResponsibilityStmt() != "Old Editor" {
		t.Fatalf("expected legacy responsibility, got %q", entry.ResponsibilityStmt())
	}
	if entry.PlaceStmt() != "Modern Place" {
		t.Fatalf("expected modern place to be preserved, got %q", entry.PlaceStmt())
	}
	if entry.Annotation() != "Old Note" {
		t.Fatalf("expected legacy annotation, got %q", entry.Annotation())
	}
	if entry.References() != "Old Ref" {
		t.Fatalf("expected legacy references, got %q", entry.References())
	}
	if entry.Extent() != "Old Extent" {
		t.Fatalf("expected legacy extent, got %q", entry.Extent())
	}
}

func TestEnrichEntryFromLegacyExtractsPseudonymMarkers(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))

	enrichEntryFromLegacy(entry, xmlmodels.LegacyAlmNeuRow{
		Herausgeber: "Editor #",
		Anmerkungen: "# Pseud. /) Hinweis",
	})

	if !entry.Pseudonym() {
		t.Fatal("expected legacy pseudonym marker to set pseudonym")
	}
	if entry.ResponsibilityStmt() != "Editor" {
		t.Fatalf("expected stripped legacy responsibility, got %q", entry.ResponsibilityStmt())
	}
	if entry.Annotation() != "Hinweis" {
		t.Fatalf("expected stripped legacy annotation, got %q", entry.Annotation())
	}
}

func TestExtractEntryPseudonymImportDataRemovesTaggedMarkerPrefix(t *testing.T) {
	data := extractEntryPseudonymImportData("H. Clauren #", "<div># Pseud. /) 19 Jgg 1818-1837</div>")

	if !data.pseudonym {
		t.Fatal("expected tagged entry marker to set pseudonym")
	}
	if data.responsibility != "H. Clauren" {
		t.Fatalf("expected stripped responsibility, got %q", data.responsibility)
	}
	if data.annotation != "19 Jgg 1818-1837" {
		t.Fatalf("expected stripped tagged annotation, got %q", data.annotation)
	}
}

func TestHandlePreferredTitleEntryPrefersLegacyReihentitel(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))
	band := xmlmodels.Band{
		ID:             100,
		ReihentitelALT: "Modern Alt",
		Jahr:           1801,
	}

	handlePreferredTitleEntry(
		entry,
		band,
		map[int]xmlmodels.Reihe{},
		map[int][]xmlmodels.Relation_Band_Reihe{},
		LegacyBandMatch{LegacyAlm: xmlmodels.LegacyAlmNeuRow{Reihentitel: " <div>Old  Title</div> "}},
		true,
	)

	if entry.PreferredTitle() != "Old Title" {
		t.Fatalf("expected legacy preferred title, got %q", entry.PreferredTitle())
	}
}

func TestHandlePreferredTitleEntryFallsBackWithoutLegacyReihentitel(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))
	band := xmlmodels.Band{
		ID:             100,
		ReihentitelALT: "Modern Alt",
	}

	handlePreferredTitleEntry(
		entry,
		band,
		map[int]xmlmodels.Reihe{},
		map[int][]xmlmodels.Relation_Band_Reihe{},
		LegacyBandMatch{LegacyAlm: xmlmodels.LegacyAlmNeuRow{Reihentitel: ""}},
		true,
	)

	if entry.PreferredTitle() != "Modern Alt" {
		t.Fatalf("expected fallback preferred title, got %q", entry.PreferredTitle())
	}
}

func TestDetermineEntryEditStateEditedWhenMultipleContents(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))
	entry.SetTitleStmt("Some title")

	got := determineEntryEditState(entry, xmlmodels.Band{}, LegacyBandMatch{}, false, 2)
	if got != dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1] {
		t.Fatalf("expected Edited, got %q", got)
	}
}

func TestDetermineEntryEditStateSeenWhenAutopsiedAndDescribed(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))
	entry.SetTitleStmt("Some title")

	got := determineEntryEditState(
		entry,
		xmlmodels.Band{},
		LegacyBandMatch{LegacyAlm: xmlmodels.LegacyAlmNeuRow{Autopsie: true}},
		true,
		1,
	)
	if got != dbmodels.EDITORSTATE_VALUES[2] {
		t.Fatalf("expected Seen, got %q", got)
	}
}

func TestDetermineEntryEditStateSeenWhenTitleStmtExists(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))
	entry.SetTitleStmt("Some title")

	got := determineEntryEditState(entry, xmlmodels.Band{}, LegacyBandMatch{}, false, 0)
	if got != dbmodels.EDITORSTATE_VALUES[2] {
		t.Fatalf("expected Seen, got %q", got)
	}
}

func TestDetermineEntryEditStateUnknownWithoutAutopsie(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))

	got := determineEntryEditState(entry, xmlmodels.Band{}, LegacyBandMatch{}, false, 1)
	if got != dbmodels.EDITORSTATE_VALUES[0] {
		t.Fatalf("expected Unknown, got %q", got)
	}
}

func TestHandleDeprecatedIncludesLegacyEditProvenance(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))

	handleDeprecated(entry, xmlmodels.Band{}, LegacyBandMatch{
		LegacyAlm: xmlmodels.LegacyAlmNeuRow{
			BearbeitetAm:  " 2024-01-02 03:04:05.000Z ",
			BearbeitetVon: " AB ",
		},
	}, true)

	deprecated, ok := entry.Get(dbmodels.MUSENALM_DEPRECATED_FIELD).(dbmodels.Deprecated)
	if !ok {
		t.Fatalf("expected deprecated field to store dbmodels.Deprecated, got %T", entry.Get(dbmodels.MUSENALM_DEPRECATED_FIELD))
	}
	if deprecated.BearbeitetAm != "2024-01-02 03:04:05.000Z" {
		t.Fatalf("expected trimmed legacy BearbeitetAm, got %q", deprecated.BearbeitetAm)
	}
	if deprecated.BearbeitetVon != "AB" {
		t.Fatalf("expected trimmed legacy BearbeitetVon, got %q", deprecated.BearbeitetVon)
	}
}

func TestApplyLegacyUpdatedToEntrySetsUpdatedFromLegacyBand(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))

	applyLegacyUpdatedToEntry(entry, LegacyBandMatch{
		LegacyAlm: xmlmodels.LegacyAlmNeuRow{BearbeitetAm: "2024-01-02 03:04:05.000Z"},
	}, true)

	if got := entry.Updated().String(); got != "2024-01-02 03:04:05.000Z" {
		t.Fatalf("expected updated timestamp from legacy band, got %q", got)
	}
}

func TestApplyLegacyUpdatedToEntryIgnoresInvalidLegacyTimestamp(t *testing.T) {
	entry := dbmodels.NewEntry(core.NewRecord(core.NewBaseCollection(dbmodels.ENTRIES_TABLE)))

	applyLegacyUpdatedToEntry(entry, LegacyBandMatch{
		LegacyAlm: xmlmodels.LegacyAlmNeuRow{BearbeitetAm: "invalid"},
	}, true)

	if !entry.Updated().IsZero() {
		t.Fatalf("expected zero updated timestamp, got %q", entry.Updated().String())
	}
}
