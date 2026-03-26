package seed

import (
	"fmt"
	"slices"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func RecordsFromBände(
	app core.App,
	adb xmlmodels.AccessDB,
	// INFO: this is a string map, bc it's not by ID but by place name
	places map[string]*dbmodels.Place,
	contentCounts map[int]int,
	legacy map[int]LegacyBandMatch,
) ([]*dbmodels.Entry, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	records := make([]*dbmodels.Entry, 0, len(adb.Bände.Bände))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	ocoll, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.PLACES_TABLE)
		return records, err
	}

	// INFO: lets make some maps to speed this up
	omap := datatypes.MakeMap(adb.Orte.Orte, func(o xmlmodels.Ort) int { return o.ID })
	relmap := datatypes.MakeMultiMap(
		adb.Relationen_Bände_Reihen.Relationen,
		func(r xmlmodels.Relation_Band_Reihe) int { return r.Band },
	)
	rmap := datatypes.MakeMap(adb.Reihen.Reihen, func(r xmlmodels.Reihe) int { return r.ID })

	for i := 0; i < len(adb.Bände.Bände); i++ {
		band := adb.Bände.Bände[i]
		record := dbmodels.NewEntry(core.NewRecord(collection))

		// TODO: Hier bevorzugter reihentitel + jahr, oder irgendein reihentitel, oder reihentitelALT
		if band.ReihentitelALT == "" {
			continue
		}

		record.SetTitleStmt(NormalizeString(band.Titelangabe))
		record.SetReferences(NormalizeString(band.Nachweis))
		record.SetAnnotation(NormalizeString(band.Anmerkungen))
		record.SetResponsibilityStmt(NormalizeString(band.Verantwortlichkeitsangabe))
		record.SetPlaceStmt(NormalizeString(band.Ortsangabe))
		record.SetExtent(NormalizeString(band.Struktur))
		record.SetCarrierType([]string{"Band"})
		record.SetContentType([]string{"unbewegtes Bild", "Text"})
		record.SetMediaType([]string{"ohne Hilfsmittel"})
		record.SetLanguage([]string{"ger"})
		record.SetMusenalmID(band.ID)

		if band.Jahr != 0 {
			record.SetYear(band.Jahr)
		}

		match, hasLegacy := legacy[band.ID]
		if hasLegacy {
			enrichEntryFromLegacy(record, match.LegacyAlm)
		}

		contentCount := contentCounts[band.ID]
		record.SetEditState(determineEntryEditState(record, band, match, hasLegacy, contentCount))

		hasAutopsieFromData := entryHasAutopsieFromData(band)
		if band.BiblioID != 0 && !band.Erfasst && !(band.Gesichtet || hasAutopsieFromData) {
			appendEntryComment(record, "Weder erfasst noch autopsiert, obwohl eine Biblio-ID vergeben wurde; bitte überprüfen.")
		}
		if band.BiblioID == 0 && len(band.Status.Value) > 0 && !band.Erfasst && !(band.Gesichtet || hasAutopsieFromData) {
			appendEntryComment(record, "Band ist als vorhanden markiert aber nicht autospiert.")
		}
		if band.BiblioID == 0 && len(band.Status.Value) == 0 && (band.Erfasst || band.Gesichtet || hasAutopsieFromData) {
			appendEntryComment(record, "Quelle für autopsiert oder Erfassung fehlt.")
		}

		handlePreferredTitleEntry(record, band, rmap, relmap, match, hasLegacy)
		handleDeprecated(record, band, match, hasLegacy)
		applyLegacyUpdatedToEntry(record, match, hasLegacy)
		handleOrte(record, band, omap, app, ocoll, places)

		records = append(records, record)
	}

	return records, nil
}

func handlePreferredTitleEntry(
	record *dbmodels.Entry,
	band xmlmodels.Band,
	rmap map[int]xmlmodels.Reihe,
	rrelmap map[int][]xmlmodels.Relation_Band_Reihe,
	legacy LegacyBandMatch,
	hasLegacy bool,
) {
	if hasLegacy {
		if oldTitle := normalizeLegacyEntryPreferredTitle(legacy.LegacyAlm.Reihentitel); oldTitle != "" {
			record.SetPreferredTitle(oldTitle)
			return
		}
	}

	rels := rrelmap[band.ID]
	if len(rels) == 0 {
		record.SetPreferredTitle(NormalizeString(band.ReihentitelALT))
		appendEntryComment(record, "Kein Reihentitel-Bezug; Reihentitel ALT verwendet.")
		return
	}

	jahr := strconv.Itoa(band.Jahr)
	if band.Jahr == 0 {
		jahr = "[o. J.]"
	}

	bevti := slices.IndexFunc(rels, func(r xmlmodels.Relation_Band_Reihe) bool { return r.Relation == "1" })
	if bevti != -1 {
		bevt := rmap[rels[bevti].Reihe]
		record.SetPreferredTitle(NormalizeString(bevt.Titel) + " " + jahr)
		return
	}

	slices.SortFunc(rels, func(a, b xmlmodels.Relation_Band_Reihe) int {
		return strings.Compare(a.Relation, b.Relation)
	})

	record.SetPreferredTitle(NormalizeString(rmap[rels[0].Reihe].Titel) + jahr)
}

func entryHasAutopsieFromData(band xmlmodels.Band) bool {
	title := strings.TrimSpace(NormalizeString(band.Titelangabe))
	if title == "" {
		return false
	}

	responsibility := strings.TrimSpace(NormalizeString(band.Verantwortlichkeitsangabe))
	place := strings.TrimSpace(NormalizeString(band.Ortsangabe))
	notes := strings.TrimSpace(NormalizeString(band.Anmerkungen))

	return responsibility != "" || place != "" || notes != ""
}

func handleOrte(
	record *dbmodels.Entry,
	band xmlmodels.Band,
	orte map[int]xmlmodels.Ort,
	app core.App,
	ocollection *core.Collection,
	places map[string]*dbmodels.Place,
) {
	for _, v := range band.Orte {
		o, ok := orte[v.Value]
		if ok {
			n := NormalizeString(o.Name)
			e := false
			if strings.HasPrefix(n, "[") {
				n = n[1 : len(n)-1]
				e = true
			}

			ort, ok := places[n]
			if ok {
				before := record.Places()
				record.SetPlaces(append(before, ort.Id))
			} else {
				orec := dbmodels.NewPlace(core.NewRecord(ocollection))
				orec.SetName(n)
				orec.SetAnnotation(o.Anmerkungen)
				orec.SetFictional(o.Fiktiv)
				orec.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
				if err := app.Save(orec); err != nil {
					app.Logger().Error("Error saving record", "error", err, "record", orec)
					continue
				} else {
					before := record.Places()
					record.SetPlaces(append(before, orec.Id))
				}
			}

			if e {
				rec, err := app.FindFirstRecordByData(dbmodels.PLACES_TABLE, dbmodels.PLACES_NAME_FIELD, NormalizeString(o.Name))
				if err != nil {
					app.Logger().Error("Error finding record", "error", err, "record", rec)
				} else if rec != nil {
					err = app.Delete(rec)
					if err != nil {
						app.Logger().Error("Error deleting record", "error", err, "record", rec)
					}
				}
				// INFO: We do not need to get the record metadata here, as we know that the record is new
				record.SetMeta(map[string]dbmodels.MetaData{dbmodels.PLACES_TABLE: {Conjecture: true}})
			}
		}
	}
}

func handleDeprecated(record *dbmodels.Entry, band xmlmodels.Band, legacy LegacyBandMatch, hasLegacy bool) {
	depr := dbmodels.Deprecated{
		Reihentitel: NormalizeString(band.ReihentitelALT),
		Norm:        NormalizeString(band.Norm),
		BiblioID:    band.BiblioID,
		Status:      band.Status.Value,
		Gesichtet:   band.Gesichtet,
		Erfasst:     band.Erfasst,
	}
	if hasLegacy {
		depr.BearbeitetAm = strings.TrimSpace(legacy.LegacyAlm.BearbeitetAm)
		depr.BearbeitetVon = strings.TrimSpace(legacy.LegacyAlm.BearbeitetVon)
	}

	record.SetDeprecated(depr)
}

func parseLegacyEditedAt(raw string) (types.DateTime, bool) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return types.DateTime{}, false
	}

	dt, err := types.ParseDateTime(raw)
	if err != nil || dt.IsZero() {
		return types.DateTime{}, false
	}

	return dt, true
}

func applyLegacyUpdatedToEntry(record *dbmodels.Entry, legacy LegacyBandMatch, hasLegacy bool) {
	if !hasLegacy {
		return
	}

	if updated, ok := parseLegacyEditedAt(legacy.LegacyAlm.BearbeitetAm); ok {
		record.SetUpdated(updated)
	}
}

func enrichEntryFromLegacy(record *dbmodels.Entry, legacy xmlmodels.LegacyAlmNeuRow) {
	if record.Year() == 0 && legacy.Jahr != 0 {
		record.SetYear(legacy.Jahr)
	}

	if strings.TrimSpace(record.ResponsibilityStmt()) == "" && strings.TrimSpace(legacy.Herausgeber) != "" {
		record.SetResponsibilityStmt(NormalizeString(legacy.Herausgeber))
	}

	if strings.TrimSpace(record.PlaceStmt()) == "" && strings.TrimSpace(legacy.Ort) != "" {
		record.SetPlaceStmt(NormalizeString(legacy.Ort))
	}

	if strings.TrimSpace(record.Annotation()) == "" && strings.TrimSpace(legacy.Anmerkungen) != "" {
		record.SetAnnotation(NormalizeString(legacy.Anmerkungen))
	}

	if strings.TrimSpace(record.References()) == "" && strings.TrimSpace(legacy.Nachweis) != "" {
		record.SetReferences(NormalizeString(legacy.Nachweis))
	}

	if strings.TrimSpace(record.Extent()) == "" && strings.TrimSpace(legacy.Struktur) != "" {
		record.SetExtent(NormalizeString(legacy.Struktur))
	}
}

func determineEntryEditState(
	record *dbmodels.Entry,
	band xmlmodels.Band,
	legacy LegacyBandMatch,
	hasLegacy bool,
	contentCount int,
) string {
	if contentCount > 1 {
		return dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1]
	}

	if strings.TrimSpace(record.TitleStmt()) != "" {
		return dbmodels.EDITORSTATE_VALUES[2]
	}

	autopsied := band.Gesichtet
	if hasLegacy && legacy.LegacyAlm.Autopsie {
		autopsied = true
	}

	if autopsied && entryHasDescriptiveData(record) {
		return dbmodels.EDITORSTATE_VALUES[2]
	}

	return dbmodels.EDITORSTATE_VALUES[0]
}

func entryHasDescriptiveData(record *dbmodels.Entry) bool {
	if strings.TrimSpace(record.TitleStmt()) != "" {
		return true
	}
	if strings.TrimSpace(record.ResponsibilityStmt()) != "" {
		return true
	}
	if strings.TrimSpace(record.PlaceStmt()) != "" {
		return true
	}
	if strings.TrimSpace(record.Annotation()) != "" {
		return true
	}
	if strings.TrimSpace(record.References()) != "" {
		return true
	}
	if strings.TrimSpace(record.Extent()) != "" {
		return true
	}

	return false
}

func normalizeLegacyEntryPreferredTitle(raw string) string {
	raw = datatypes.DeleteTags(raw)
	raw = NormalizeString(raw)
	raw = datatypes.NormalizeWhitespace(raw)

	parts := strings.Split(raw, "/)")
	if len(parts) == 0 {
		return ""
	}

	base := strings.TrimSpace(parts[0])
	if len(parts) == 1 {
		return base
	}

	suffixes := make([]string, 0, len(parts)-1)
	for _, part := range parts[1:] {
		part = datatypes.NormalizeWhitespace(NormalizeString(part))
		part = strings.TrimSpace(part)
		if part == "" {
			continue
		}
		if isWrappedLegacyTitleNote(part) {
			suffixes = append(suffixes, part)
		} else {
			suffixes = append(suffixes, "["+part+"]")
		}
	}

	if len(suffixes) == 0 {
		return base
	}

	if base == "" {
		return strings.Join(suffixes, " ")
	}

	return base + " " + strings.Join(suffixes, " ")
}

func isWrappedLegacyTitleNote(part string) bool {
	if len(part) < 2 {
		return false
	}

	switch {
	case strings.HasPrefix(part, "(") && strings.HasSuffix(part, ")"):
		return true
	case strings.HasPrefix(part, "[") && strings.HasSuffix(part, "]"):
		return true
	case strings.HasPrefix(part, "{") && strings.HasSuffix(part, "}"):
		return true
	default:
		return false
	}
}
