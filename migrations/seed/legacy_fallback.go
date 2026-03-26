package seed

import "github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"

const LEGACY_CUTOVER_ENTRY_ID = 4849

type LegacyBandMatch struct {
	LegacyAlm xmlmodels.LegacyAlmNeuRow
	Rows      []xmlmodels.LegacyINHTabRow
}

func UsesLegacyContents(entryID int) bool {
	return entryID >= LEGACY_CUTOVER_ENTRY_ID
}

func LegacyBandMatches(
	baende xmlmodels.Bände,
	inhalte xmlmodels.Inhalte,
	legacy *xmlmodels.LegacyFallbackData,
) map[int]LegacyBandMatch {
	ret := make(map[int]LegacyBandMatch)
	if legacy == nil {
		return ret
	}

	images := getImages(xmlmodels.IMG_PATH)
	modernFilteredCounts := countFilteredModernContentsByBand(inhalte, images)

	for _, band := range baende.Bände {
		oldEntry, ok := legacyAlmForBand(band, legacy)
		if !ok {
			continue
		}

		oldEntryID := oldEntry.LegacyEntryID()
		if oldEntryID <= 0 {
			continue
		}

		match := LegacyBandMatch{LegacyAlm: oldEntry}
		if UsesLegacyContents(band.ID) {
			match.Rows = legacy.InhalteByEntryID[oldEntryID]
		} else if modernFilteredCounts[band.ID] == 0 {
			match.Rows = filterLegacyRowsForFallback(legacy.InhalteByEntryID[oldEntryID], oldEntryID, images)
		}

		ret[band.ID] = match
	}

	return ret
}

func legacyAlmForBand(
	band xmlmodels.Band,
	legacy *xmlmodels.LegacyFallbackData,
) (xmlmodels.LegacyAlmNeuRow, bool) {
	if legacy == nil {
		return xmlmodels.LegacyAlmNeuRow{}, false
	}

	if !UsesLegacyContents(band.ID) {
		row, ok := legacy.AlmByLegacyEntryID[band.ID]
		return row, ok
	}

	if band.BiblioID == 0 {
		return xmlmodels.LegacyAlmNeuRow{}, false
	}

	row, ok := legacy.AlmByBiblioID[band.BiblioID]
	return row, ok
}

func LegacyFallbackContentsByEntry(matches map[int]LegacyBandMatch) map[int][]xmlmodels.LegacyINHTabRow {
	ret := make(map[int][]xmlmodels.LegacyINHTabRow)

	for bandID, match := range matches {
		if len(match.Rows) == 0 {
			continue
		}
		ret[bandID] = match.Rows
	}

	return ret
}
