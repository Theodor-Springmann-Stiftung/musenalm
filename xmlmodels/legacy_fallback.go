package xmlmodels

import "log/slog"

type LegacyFallbackData struct {
	INHTab           LegacyINHTab
	AlmNeu           LegacyAlmNeu
	AlmByBiblioID    map[int]LegacyAlmNeuRow
	InhalteByEntryID map[int][]LegacyINHTabRow
}

func ReadLegacyFallbackData(path string, logger *slog.Logger) (*LegacyFallbackData, error) {
	var inhtab LegacyINHTab
	var almneu LegacyAlmNeu

	if err := unmarshalFileStrict(path+LEGACY_INH_TAB_FN, &inhtab); err != nil {
		logger.Error("Error while unmarshalling INH-TAB.xml", "error", err, "path", path+LEGACY_INH_TAB_FN)
		return nil, err
	}

	if err := unmarshalFileStrict(path+LEGACY_ALMNEU_FN, &almneu); err != nil {
		logger.Error("Error while unmarshalling AlmNeu.xml", "error", err, "path", path+LEGACY_ALMNEU_FN)
		return nil, err
	}

	data := &LegacyFallbackData{
		INHTab:           inhtab,
		AlmNeu:           almneu,
		AlmByBiblioID:    make(map[int]LegacyAlmNeuRow),
		InhalteByEntryID: make(map[int][]LegacyINHTabRow),
	}

	for _, row := range inhtab.Rows {
		data.InhalteByEntryID[row.ID] = append(data.InhalteByEntryID[row.ID], row)
	}

	for _, row := range almneu.Rows {
		if row.BiblioNr == 0 {
			continue
		}

		existing, ok := data.AlmByBiblioID[row.BiblioNr]
		if !ok {
			data.AlmByBiblioID[row.BiblioNr] = row
			continue
		}

		if existing.ID > 0 {
			continue
		}

		if row.ID > 0 {
			data.AlmByBiblioID[row.BiblioNr] = row
		}
	}

	return data, nil
}
