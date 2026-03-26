package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

func countFilteredModernContentsByBand(inhalte xmlmodels.Inhalte, images imageIndex) map[int]int {
	filteredCounts := make(map[int]int)
	for _, inhalt := range inhalte.Inhalte {
		if shouldSkipDummyContent(inhalt, images) {
			continue
		}
		filteredCounts[inhalt.Band]++
	}
	return filteredCounts
}

func SelectedContentCounts(
	inhalte xmlmodels.Inhalte,
	legacy map[int]LegacyBandMatch,
) map[int]int {
	filteredCounts := countFilteredModernContentsByBand(inhalte, getImages(xmlmodels.IMG_PATH))

	for bandID, match := range legacy {
		if len(match.Rows) == 0 {
			continue
		}
		if UsesLegacyContents(bandID) || filteredCounts[bandID] == 0 {
			filteredCounts[bandID] = len(match.Rows)
		}
	}

	return filteredCounts
}

func SelectModernInhalteForImport(inhalte xmlmodels.Inhalte) xmlmodels.Inhalte {
	ret := xmlmodels.Inhalte{Inhalte: make([]xmlmodels.Inhalt, 0, len(inhalte.Inhalte))}

	for _, inhalt := range inhalte.Inhalte {
		if UsesLegacyContents(inhalt.Band) {
			continue
		}
		ret.Inhalte = append(ret.Inhalte, inhalt)
	}

	return ret
}

func shouldSkipDummyContent(inhalt xmlmodels.Inhalt, images imageIndex) bool {
	if len(inhalt.Typ.Value) != 1 || strings.TrimSpace(inhalt.Typ.Value[0]) != "Gedicht/Lied" {
		return false
	}

	author := strings.TrimSpace(NormalizeString(inhalt.Urheberangabe))
	if !strings.EqualFold(author, "unbezeichnet") {
		return false
	}

	if strings.TrimSpace(NormalizeString(inhalt.Titelangabe)) != "" {
		return false
	}

	if strings.TrimSpace(NormalizeString(inhalt.Incipit)) != "" {
		return false
	}

	if len(images.PathsForModernContent(inhalt.ID)) > 0 {
		return false
	}

	return true
}

func filterLegacyRowsForFallback(
	rows []xmlmodels.LegacyINHTabRow,
	legacyEntryID int,
	images imageIndex,
) []xmlmodels.LegacyINHTabRow {
	filtered := make([]xmlmodels.LegacyINHTabRow, 0, len(rows))
	for _, row := range rows {
		if shouldSkipDummyLegacyContent(row, legacyEntryID, images) {
			continue
		}
		filtered = append(filtered, row)
	}
	return filtered
}

func shouldSkipDummyLegacyContent(
	row xmlmodels.LegacyINHTabRow,
	legacyEntryID int,
	images imageIndex,
) bool {
	if strings.TrimSpace(NormalizeString(row.Objekt)) != "Gedicht/Lied" {
		return false
	}

	author := strings.TrimSpace(NormalizeString(row.Autor))
	if !strings.EqualFold(author, "unbezeichnet") {
		return false
	}

	if strings.TrimSpace(NormalizeString(row.Titel)) != "" {
		return false
	}

	if strings.TrimSpace(NormalizeString(row.Incipit)) != "" {
		return false
	}

	if len(images.PathsForLegacyContent(legacyEntryID, row.INHNR)) > 0 {
		return false
	}

	return true
}
