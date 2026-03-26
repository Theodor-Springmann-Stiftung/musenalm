package seed

import (
	"fmt"
	"log"
	"log/slog"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const NO_TITLE = "[No Title]"

type imageIndex struct {
	byContentID          map[int][]string
	byLegacyEntryContent map[string][]string
}

func legacyImageKey(entryID, contentID int) string {
	return strconv.Itoa(entryID) + ":" + strconv.Itoa(contentID)
}

func (idx imageIndex) PathsForModernContent(contentID int) []string {
	return idx.byContentID[contentID]
}

func (idx imageIndex) PathsForLegacyContent(entryID, contentID int) []string {
	if paths := idx.byLegacyEntryContent[legacyImageKey(entryID, contentID)]; len(paths) > 0 {
		return paths
	}

	return idx.byContentID[contentID]
}

func RecordsFromInhalte(
	app core.App,
	inhalte xmlmodels.Inhalte,
	legacy map[int]LegacyBandMatch,
	entries map[int]*dbmodels.Entry,
) ([]*dbmodels.Content, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	records := make([]*dbmodels.Content, 0, len(inhalte.Inhalte))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	images := getImages(xmlmodels.IMG_PATH)

	for i := 0; i < len(inhalte.Inhalte); i++ {
		record := dbmodels.NewContent(core.NewRecord(collection))
		inhalt := inhalte.Inhalte[i]
		pseudonymData := extractContentPseudonymImportData(inhalt.Urheberangabe, inhalt.Anmerkungen)
		if shouldSkipDummyContent(inhalt, images) {
			continue
		}
		band, ok := entries[inhalt.Band]
		if !ok {
			app.Logger().Error("Band not found", "band", inhalt.Band)
			continue
		}
		record.SetEntry(band.Id)
		record.SetAnnotation(NormalizeString(pseudonymData.annotation))
		record.SetMusenalmID(inhalt.ID)
		record.SetResponsibilityStmt(NormalizeString(pseudonymData.responsibility))
		record.SetPseudonym(pseudonymData.pseudonym)
		record.SetMusenalmType(inhalt.Typ.Value)
		record.SetExtent(NormalizeString(inhalt.Seite))
		record.SetTitleStmt(NormalizeString(inhalt.Titelangabe))
		record.SetIncipitStmt(NormalizeString(inhalt.Incipit))
		record.SetYear(band.Year())
		applyLegacyUpdatedToContent(record, legacy[inhalt.Band])

		counting, ok := dbmodels.MUSENALM_PAGINATION_VALUES[inhalt.Paginierung]
		if ok {
			record.SetMusenalmPagination(counting)
		}

		no, err := strconv.ParseFloat(NormalizeString(inhalt.Objektnummer), 64)
		if err != nil {
			app.Logger().Error("Error parsing object number", "error", err, "object number", inhalt.Objektnummer)
		}
		record.SetNumbering(no)

		paths := images.PathsForModernContent(inhalt.ID)
		if len(paths) > 0 {
			files := []*filesystem.File{}
			for _, image := range paths {
				file, err := filesystem.NewFileFromPath(image)
				if err != nil {
					app.Logger().Error("Error creating file from path", "error", err, "path", image)
					continue
				}
				files = append(files, file)
			}

			record.SetScans(files)
		}

		handlePreferredTitle(record)
		n := record.PreferredTitle()
		if n == "" || n == NO_TITLE {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)

	}
	return records, nil
}

func RecordsFromInhalteWithLegacy(
	app core.App,
	inhalte xmlmodels.Inhalte,
	legacy map[int]LegacyBandMatch,
	entries map[int]*dbmodels.Entry,
) ([]*dbmodels.Content, error) {
	records, err := RecordsFromInhalte(app, inhalte, legacy, entries)
	if err != nil {
		return nil, err
	}

	legacyRecords, err := RecordsFromLegacyINHTab(app, legacy, entries)
	if err != nil {
		return nil, err
	}

	return append(records, legacyRecords...), nil
}

func RecordsFromLegacyINHTab(
	app core.App,
	legacy map[int]LegacyBandMatch,
	entries map[int]*dbmodels.Entry,
) ([]*dbmodels.Content, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	if err != nil {
		return nil, err
	}

	records := []*dbmodels.Content{}
	images := getImages(xmlmodels.IMG_PATH)

	for entryID, match := range legacy {
		entry, ok := entries[entryID]
		if !ok {
			app.Logger().Error("Entry not found for legacy content fallback", "entry", entryID)
			continue
		}

		legacyEntryID := match.LegacyAlm.LegacyEntryID()

		for _, row := range match.Rows {
			record := dbmodels.NewContent(core.NewRecord(collection))
			pseudonymData := extractContentPseudonymImportData(row.Autor, row.AnmerkungInhalt)
			record.SetEntry(entry.Id)
			record.SetAnnotation(NormalizeString(pseudonymData.annotation))
			record.SetMusenalmID(row.INHNR)
			record.SetResponsibilityStmt(NormalizeString(pseudonymData.responsibility))
			record.SetPseudonym(pseudonymData.pseudonym)
			record.SetMusenalmType(legacyMusenalmTypes(row.Objekt))
			if row.Seite != 0 {
				record.SetExtent(strconv.FormatFloat(row.Seite, 'f', -1, 64))
			}
			record.SetTitleStmt(NormalizeString(row.Titel))
			record.SetIncipitStmt(NormalizeString(row.Incipit))
			record.SetYear(entry.Year())
			applyLegacyUpdatedToContent(record, match)

			if counting, ok := dbmodels.MUSENALM_PAGINATION_VALUES[row.Paginierung]; ok {
				record.SetMusenalmPagination(counting)
			}

			record.SetNumbering(row.Objektzaehl)

			paths := images.PathsForLegacyContent(legacyEntryID, row.INHNR)
			if len(paths) > 0 {
				files := []*filesystem.File{}
				for _, image := range paths {
					file, err := filesystem.NewFileFromPath(image)
					if err != nil {
						app.Logger().Error("Error creating file from path", "error", err, "path", image)
						continue
					}
					files = append(files, file)
				}
				record.SetScans(files)
			}

			handlePreferredTitle(record)
			n := record.PreferredTitle()
			if n == "" || n == NO_TITLE {
				record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
			} else {
				record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
			}

			records = append(records, record)
		}
	}

	return records, nil
}

func applyLegacyUpdatedToContent(record *dbmodels.Content, legacy LegacyBandMatch) {
	if updated, ok := parseLegacyEditedAt(legacy.LegacyAlm.BearbeitetAm); ok {
		record.SetUpdated(updated)
	}
}

func legacyMusenalmTypes(raw string) []string {
	raw = normalizeAgentString(raw)
	if raw == "" {
		return nil
	}

	replacer := strings.NewReplacer(
		" u. ", "|",
		" und ", "|",
		" & ", "|",
	)

	parts := strings.Split(replacer.Replace(raw), "|")
	ret := []string{}
	seen := map[string]bool{}

	for _, part := range parts {
		normalized := NormalizeString(strings.TrimSpace(part))
		if normalized == "" || seen[normalized] {
			continue
		}
		seen[normalized] = true
		ret = append(ret, normalized)
	}

	return ret
}

func handlePreferredTitle(record *dbmodels.Content) {
	if record.TitleStmt() != "" {
		record.SetPreferredTitle(record.TitleStmt())
		return
	}

	if record.IncipitStmt() != "" {
		record.SetPreferredTitle(record.IncipitStmt() + "…")
		return
	}

	types := record.MusenalmType()
	if len(types) > 0 {
		str := strings.Join(types, ", ")
		if str != "" {
			creator := normalizeLegacyCreatorForTitle(record.ResponsibilityStmt())
			if creator != "" {
				str += " (" + creator + ")"
			}
			record.SetPreferredTitle("[" + str + "]")
			return
		}
	}

	record.SetPreferredTitle(NO_TITLE)
}

func normalizeLegacyCreatorForTitle(raw string) string {
	if raw == "" {
		return ""
	}

	lower := strings.ToLower(raw)
	if strings.Contains(lower, "unbezeichnet") ||
		strings.Contains(lower, "unbekannt") ||
		strings.Contains(lower, "unleserlich") {
		return ""
	}

	creator := NormalizeString(raw)
	creator = strings.ReplaceAll(creator, "#", "")
	return NormalizeString(creator)
}

func commatizeArray(array []string) string {
	if len(array) == 0 {
		return ""
	}

	res := array[0]

	for i := 1; i < len(array)-1; i++ {
		res += ", " + array[i]
	}
	return array[0]
}

func getImages(path string) imageIndex {
	/// FIXED: there is a bug somewhere, where files ending with numbers after a comma (",001") etc dont get added
	ret := imageIndex{
		byContentID:          make(map[int][]string),
		byLegacyEntryContent: make(map[string][]string),
	}
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ret
	}

	e := func(path string, fileInfo os.FileInfo, inpErr error) (err error) {
		if !fileInfo.IsDir() {
			ext := filepath.Ext(fileInfo.Name())
			filename := strings.TrimSuffix(fileInfo.Name(), ext)
			if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".tiff" {
				return nil
			}
			basesplit := strings.Split(filename, "-")
			if len(basesplit) >= 3 {
				legacyEntryID, err := strconv.Atoi(NormalizeString(basesplit[1]))
				if err != nil {
					slog.Error("Error parsing legacy entry id", "error", err, "id", basesplit[1])
					return nil
				}
				commaseperatorsplit := strings.Split(basesplit[2], ",")
				id := commaseperatorsplit[0]
				no, err := strconv.Atoi(NormalizeString(id))
				if err != nil {
					slog.Error("Error parsing id", "error", err, "id", id)
					return nil
				}
				if _, ok := ret.byContentID[no]; !ok {
					ret.byContentID[no] = make([]string, 0)
				}
				ret.byContentID[no] = append(ret.byContentID[no], path)

				key := legacyImageKey(legacyEntryID, no)
				if _, ok := ret.byLegacyEntryContent[key]; !ok {
					ret.byLegacyEntryContent[key] = make([]string, 0)
				}
				ret.byLegacyEntryContent[key] = append(ret.byLegacyEntryContent[key], path)
			}
		}
		return nil
	}

	if err := filepath.Walk(path, e); err != nil {
		log.Fatal(err)
	}

	return ret
}
