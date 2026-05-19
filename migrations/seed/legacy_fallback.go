package seed

import (
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
)

const LEGACY_CUTOVER_ENTRY_ID = 4849

type LegacyBandMatch struct {
	LegacyAlm xmlmodels.LegacyAlmNeuRow
	Rows      []xmlmodels.LegacyINHTabRow
}

type PostCutoverBandMatch struct {
	LegacyAlm   xmlmodels.LegacyAlmNeuRow
	ModernBand  *xmlmodels.Band
	MatchedBy   string
	Ambiguous   bool
	SeriesTitle string
}

func UsesLegacyContents(entryID int) bool {
	return entryID > LEGACY_CUTOVER_ENTRY_ID
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
	_ = inhalte

	for _, band := range baende.Bände {
		if UsesLegacyContents(band.ID) {
			continue
		}

		oldEntry, ok := legacyAlmForBand(band, legacy)
		if !ok {
			continue
		}

		oldEntryID := oldEntry.LegacyEntryID()
		if oldEntryID <= 0 {
			continue
		}

		match := LegacyBandMatch{LegacyAlm: oldEntry}
		match.Rows = legacy.InhalteByEntryID[oldEntryID]

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

func MatchPostCutoverBands(
	baende xmlmodels.Bände,
	legacy *xmlmodels.LegacyFallbackData,
) []PostCutoverBandMatch {
	if legacy == nil {
		return nil
	}

	modernBands := make([]xmlmodels.Band, 0, len(baende.Bände))
	byLegacySeries := map[string][]xmlmodels.Band{}
	byBiblioID := map[int][]xmlmodels.Band{}

	for _, band := range baende.Bände {
		if !UsesLegacyContents(band.ID) {
			continue
		}

		modernBands = append(modernBands, band)
		if title := normalizedLegacySeriesTitle(band.ReihentitelALT); title != "" {
			byLegacySeries[title] = append(byLegacySeries[title], band)
		}
		if band.BiblioID != 0 {
			byBiblioID[band.BiblioID] = append(byBiblioID[band.BiblioID], band)
		}
	}

	rows := make([]xmlmodels.LegacyAlmNeuRow, 0, len(legacy.AlmNeu.Rows))
	for _, row := range legacy.AlmNeu.Rows {
		if row.LegacyEntryID() <= LEGACY_CUTOVER_ENTRY_ID {
			continue
		}
		rows = append(rows, row)
	}

	slices.SortFunc(rows, func(a, b xmlmodels.LegacyAlmNeuRow) int {
		return a.LegacyEntryID() - b.LegacyEntryID()
	})

	ret := make([]PostCutoverBandMatch, 0, len(rows))
	for _, row := range rows {
		match := PostCutoverBandMatch{
			LegacyAlm:   row,
			SeriesTitle: normalizedLegacySeriesTitle(row.Reihentitel),
		}

		candidates := byLegacySeries[match.SeriesTitle]
		if len(candidates) > 0 {
			refined := candidates
			if row.Jahr != 0 {
				yearMatches := make([]xmlmodels.Band, 0, len(candidates))
				for _, candidate := range candidates {
					if candidate.Jahr == row.Jahr {
						yearMatches = append(yearMatches, candidate)
					}
				}
				if len(yearMatches) > 0 {
					refined = yearMatches
				}
			}

			if len(refined) == 1 {
				band := refined[0]
				match.ModernBand = &band
				match.MatchedBy = "legacy_series_title"
			} else if len(refined) > 1 {
				match.Ambiguous = true
			}
		}

		if match.ModernBand == nil && row.BiblioNr != 0 {
			if candidates := byBiblioID[row.BiblioNr]; len(candidates) == 1 {
				band := candidates[0]
				match.ModernBand = &band
				match.MatchedBy = "biblio_id"
				match.Ambiguous = false
			}
		}

		ret = append(ret, match)
	}

	return ret
}

func normalizedLegacySeriesTitle(raw string) string {
	raw = normalizeLegacySeriesTitleForMatching(raw)
	raw = strings.ToLower(strings.TrimSpace(raw))
	return raw
}
