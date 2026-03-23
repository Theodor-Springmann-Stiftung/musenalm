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
	legacy *xmlmodels.LegacyFallbackData,
) map[int]LegacyBandMatch {
	ret := make(map[int]LegacyBandMatch)
	if legacy == nil {
		return ret
	}

	for _, band := range baende.Bände {
		if !UsesLegacyContents(band.ID) || band.BiblioID == 0 {
			continue
		}

		oldEntry, ok := legacy.AlmByBiblioID[band.BiblioID]
		if !ok {
			continue
		}

		oldEntryID := oldEntry.LegacyEntryID()
		if oldEntryID <= 0 {
			continue
		}

		ret[band.ID] = LegacyBandMatch{
			LegacyAlm: oldEntry,
			Rows:      legacy.InhalteByEntryID[oldEntryID],
		}
	}

	return ret
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
