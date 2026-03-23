package seed

import "github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"

const LEGACY_FALLBACK_MIN_ENTRY_ID = 4797

func LegacyFallbackContentsByEntry(
	baende xmlmodels.Bände,
	modernContentCounts map[int]int,
	legacy *xmlmodels.LegacyFallbackData,
) map[int][]xmlmodels.LegacyINHTabRow {
	ret := make(map[int][]xmlmodels.LegacyINHTabRow)
	if legacy == nil {
		return ret
	}

	for _, band := range baende.Bände {
		if band.ID < LEGACY_FALLBACK_MIN_ENTRY_ID {
			continue
		}
		if modernContentCounts[band.ID] > 0 {
			continue
		}
		if band.BiblioID == 0 {
			continue
		}

		oldEntry, ok := legacy.AlmByBiblioID[band.BiblioID]
		if !ok || oldEntry.ID <= 0 {
			continue
		}

		rows := legacy.InhalteByEntryID[oldEntry.ID]
		if len(rows) == 0 {
			continue
		}

		ret[band.ID] = rows
	}

	return ret
}
