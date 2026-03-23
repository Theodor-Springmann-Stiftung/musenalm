package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

func CountContentsByBand(inhalte xmlmodels.Inhalte) map[int]int {
	counts := make(map[int]int)
	for _, inhalt := range inhalte.Inhalte {
		counts[inhalt.Band]++
	}
	return counts
}

func ContentCountsAfterFilter(inhalte xmlmodels.Inhalte) map[int]int {
	images := getImages(xmlmodels.IMG_PATH)
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
	images := getImages(xmlmodels.IMG_PATH)
	filteredCounts := make(map[int]int)

	for _, inhalt := range inhalte.Inhalte {
		if UsesLegacyContents(inhalt.Band) {
			continue
		}
		if shouldSkipDummyContent(inhalt, images) {
			continue
		}
		filteredCounts[inhalt.Band]++
	}

	for bandID, match := range legacy {
		if !UsesLegacyContents(bandID) {
			continue
		}
		filteredCounts[bandID] = len(match.Rows)
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
