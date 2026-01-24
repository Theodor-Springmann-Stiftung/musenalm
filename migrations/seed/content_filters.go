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

func shouldSkipDummyContent(inhalt xmlmodels.Inhalt, images map[int][]string) bool {
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

	if len(images[inhalt.ID]) > 0 {
		return false
	}

	return true
}
