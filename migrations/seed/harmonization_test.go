package seed

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func TestShouldDeleteHarmonizationContentDeletesEmptyUntitledPoem(t *testing.T) {
	content := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))
	content.SetMusenalmType([]string{"Gedicht/Lied"})
	content.SetTitleStmt(" ")
	content.SetIncipitStmt("\t")
	content.SetAnnotation("\n")

	if !shouldDeleteHarmonizationContent(content) {
		t.Fatal("expected empty untitled Gedicht/Lied to be deleted")
	}
}

func TestShouldDeleteHarmonizationContentKeepsPoemWithTitle(t *testing.T) {
	content := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))
	content.SetMusenalmType([]string{"Gedicht/Lied"})
	content.SetTitleStmt("Der Titel")

	if shouldDeleteHarmonizationContent(content) {
		t.Fatal("expected titled Gedicht/Lied to be kept")
	}
}

func TestShouldDeleteHarmonizationContentKeepsPoemWithMeaningfulResponsibility(t *testing.T) {
	content := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))
	content.SetMusenalmType([]string{"Gedicht/Lied"})
	content.SetResponsibilityStmt("Goethe")

	if shouldDeleteHarmonizationContent(content) {
		t.Fatal("expected Gedicht/Lied with meaningful responsibility statement to be kept")
	}
}

func TestShouldDeleteHarmonizationContentStillDeletesUnbezeichnet(t *testing.T) {
	content := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))
	content.SetMusenalmType([]string{"Gedicht/Lied"})
	content.SetResponsibilityStmt("unbezeichnet")

	if !shouldDeleteHarmonizationContent(content) {
		t.Fatal("expected Gedicht/Lied with unbezeichnet responsibility statement to still be deleted")
	}
}

func TestShouldDeleteHarmonizationContentKeepsNonPoem(t *testing.T) {
	content := dbmodels.NewContent(core.NewRecord(core.NewBaseCollection(dbmodels.CONTENTS_TABLE)))
	content.SetMusenalmType([]string{"Text"})

	if shouldDeleteHarmonizationContent(content) {
		t.Fatal("expected non-Gedicht/Lied content to be kept")
	}
}
