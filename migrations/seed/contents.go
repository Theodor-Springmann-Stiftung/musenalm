package seed

import (
	"fmt"
	"log/slog"
	"math"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const NO_TITLE = "[No Title]"

type imageIndex struct {
	byContentID map[int][]indexedImage
}

type indexedImage struct {
	path       string
	orderGroup int
	order      int
}

func (idx imageIndex) PathsForModernContent(contentID int) []string {
	return idx.PathsForContent(contentID)
}

func (idx imageIndex) PathsForLegacyContent(entryID, contentID int) []string {
	return idx.PathsForContent(contentID)
}

func (idx imageIndex) PathsForContent(contentID int) []string {
	images := idx.byContentID[contentID]
	if len(images) == 0 {
		return nil
	}

	paths := make([]string, 0, len(images))
	for _, image := range images {
		paths = append(paths, image.path)
	}

	return paths
}

var legacyImageNameRegexp = regexp.MustCompile(`(?i)^alm[-.]?(\d+)-(\d+)(.*)$`)

type legacyContentEntryResolver struct {
	app          core.App
	entriesByOld map[int]*dbmodels.Entry
	allEntries   []*dbmodels.Entry
	itemsByIdent map[string][]*dbmodels.Item
	legacy       *xmlmodels.LegacyFallbackData
	cache        map[int]legacyResolvedEntry
}

type legacyResolvedEntry struct {
	entry     *dbmodels.Entry
	legacyAlm xmlmodels.LegacyAlmNeuRow
	ok        bool
}

func newLegacyContentEntryResolver(
	app core.App,
	legacy *xmlmodels.LegacyFallbackData,
	entries map[int]*dbmodels.Entry,
	items []*dbmodels.Item,
) *legacyContentEntryResolver {
	itemsByIdent := make(map[string][]*dbmodels.Item)
	for _, item := range items {
		if item == nil || strings.TrimSpace(item.Identifier()) == "" {
			continue
		}
		itemsByIdent[item.Identifier()] = append(itemsByIdent[item.Identifier()], item)
	}

	allEntries := make([]*dbmodels.Entry, 0, len(entries))
	for _, entry := range entries {
		if entry != nil {
			allEntries = append(allEntries, entry)
		}
	}

	return &legacyContentEntryResolver{
		app:          app,
		entriesByOld: entries,
		allEntries:   allEntries,
		itemsByIdent: itemsByIdent,
		legacy:       legacy,
		cache:        make(map[int]legacyResolvedEntry),
	}
}

func (r *legacyContentEntryResolver) Resolve(legacyEntryID int) (*dbmodels.Entry, xmlmodels.LegacyAlmNeuRow, bool) {
	if cached, ok := r.cache[legacyEntryID]; ok {
		return cached.entry, cached.legacyAlm, cached.ok
	}

	entry, legacyAlm, ok := r.resolveUncached(legacyEntryID)
	r.cache[legacyEntryID] = legacyResolvedEntry{entry: entry, legacyAlm: legacyAlm, ok: ok}
	return entry, legacyAlm, ok
}

func (r *legacyContentEntryResolver) resolveUncached(legacyEntryID int) (*dbmodels.Entry, xmlmodels.LegacyAlmNeuRow, bool) {
	if r.legacy == nil {
		return nil, xmlmodels.LegacyAlmNeuRow{}, false
	}

	legacyAlm, hasLegacyAlm := r.legacy.AlmByLegacyEntryID[legacyEntryID]
	if !hasLegacyAlm {
		legacyAlm = xmlmodels.LegacyAlmNeuRow{Nummer: legacyEntryID}
	}

	if entry, ok := r.entriesByOld[legacyEntryID]; ok && entry != nil {
		return entry, legacyAlm, true
	}

	if legacyEntryID <= LEGACY_CUTOVER_ENTRY_ID {
		entry, _ := r.entriesByOld[legacyEntryID]
		if entry != nil {
			return entry, legacyAlm, true
		}

		if fallback := r.findEntriesByLegacyMetadata(legacyAlm); len(fallback) > 0 {
			sort.Slice(fallback, func(i, j int) bool {
				return fallback[i].MusenalmID() < fallback[j].MusenalmID()
			})
			if len(fallback) > 1 {
				r.app.Logger().Warn(
					"Multiple metadata-only matches for direct legacy content entry; using first candidate",
					"legacy_entry_id", legacyEntryID,
					"candidate_count", len(fallback),
					"chosen_entry_musenalm_id", fallback[0].MusenalmID(),
				)
			}
			return fallback[0], legacyAlm, true
		}

		r.app.Logger().Error("Entry not found for legacy content row", "legacy_entry_id", legacyEntryID)
		return nil, legacyAlm, false
	}

	legacyAlm, ok := r.legacy.AlmByLegacyEntryID[legacyEntryID]
	if !ok {
		r.app.Logger().Error("Legacy AlmNeu entry not found for content row", "legacy_entry_id", legacyEntryID)
		return nil, xmlmodels.LegacyAlmNeuRow{}, false
	}

	if legacyAlm.BiblioNr != 0 {
		items := r.itemsByIdent[strconv.Itoa(legacyAlm.BiblioNr)]
		if len(items) > 0 {
			candidates := dedupeEntriesByID(r.entriesForItems(items))
			if len(candidates) > 0 {
				refined := refineEntryCandidatesByLegacyMetadata(candidates, legacyAlm)
				if len(refined) == 0 {
					refined = candidates
				}
				if len(refined) > 1 {
					sort.Slice(refined, func(i, j int) bool {
						return refined[i].MusenalmID() < refined[j].MusenalmID()
					})
					r.app.Logger().Warn(
						"Duplicate entry match for legacy content row; using first refined candidate",
						"legacy_entry_id", legacyEntryID,
						"biblio_nr", legacyAlm.BiblioNr,
						"candidate_count", len(refined),
						"chosen_entry_musenalm_id", refined[0].MusenalmID(),
					)
				}

				return refined[0], legacyAlm, true
			}
		}
	}

	if fallback := r.findEntriesByLegacyMetadata(legacyAlm); len(fallback) > 0 {
		sort.Slice(fallback, func(i, j int) bool {
			return fallback[i].MusenalmID() < fallback[j].MusenalmID()
		})
		if len(fallback) > 1 {
			r.app.Logger().Warn(
				"Multiple metadata fallback matches for legacy content row; using first candidate",
				"legacy_entry_id", legacyEntryID,
				"biblio_nr", legacyAlm.BiblioNr,
				"candidate_count", len(fallback),
				"chosen_entry_musenalm_id", fallback[0].MusenalmID(),
			)
		}
		return fallback[0], legacyAlm, true
	}

	if legacyAlm.BiblioNr == 0 {
		r.app.Logger().Error("Legacy AlmNeu entry has no BIBLIO-NR for content row", "legacy_entry_id", legacyEntryID)
	} else {
		r.app.Logger().Error("No item or metadata match found for legacy content BIBLIO-NR", "legacy_entry_id", legacyEntryID, "biblio_nr", legacyAlm.BiblioNr)
	}

	return nil, legacyAlm, false
}

func (r *legacyContentEntryResolver) findEntriesByLegacyMetadata(legacyAlm xmlmodels.LegacyAlmNeuRow) []*dbmodels.Entry {
	return refineEntryCandidatesByLegacyMetadata(r.allEntries, legacyAlm)
}

func (r *legacyContentEntryResolver) entriesForItems(items []*dbmodels.Item) []*dbmodels.Entry {
	ret := make([]*dbmodels.Entry, 0, len(items))
	for _, item := range items {
		for _, entryID := range item.Entries() {
			if entryID == "" {
				continue
			}
			for _, entry := range r.entriesByOld {
				if entry != nil && entry.Id == entryID {
					ret = append(ret, entry)
				}
			}
		}
	}
	return ret
}

func dedupeEntriesByID(entries []*dbmodels.Entry) []*dbmodels.Entry {
	ret := make([]*dbmodels.Entry, 0, len(entries))
	seen := make(map[string]bool)
	for _, entry := range entries {
		if entry == nil || seen[entry.Id] {
			continue
		}
		seen[entry.Id] = true
		ret = append(ret, entry)
	}
	return ret
}

func refineEntryCandidatesByLegacyMetadata(entries []*dbmodels.Entry, legacy xmlmodels.LegacyAlmNeuRow) []*dbmodels.Entry {
	if len(entries) <= 1 {
		return entries
	}

	refined := entries
	if legacy.Jahr != 0 {
		yearMatches := []*dbmodels.Entry{}
		for _, entry := range refined {
			if entry.Year() == legacy.Jahr {
				yearMatches = append(yearMatches, entry)
			}
		}
		if len(yearMatches) > 0 {
			refined = yearMatches
		}
	}

	if len(refined) <= 1 {
		return refined
	}

	legacyTitles := candidateLegacyTitles(legacy)
	if len(legacyTitles) == 0 {
		return refined
	}

	titleMatches := []*dbmodels.Entry{}
	for _, entry := range refined {
		entryTitles := []string{
			normalizeLegacyTitleMatch(entry.PreferredTitle()),
			normalizeLegacyTitleMatch(entry.TitleStmt()),
		}
		for _, entryTitle := range entryTitles {
			if entryTitle == "" {
				continue
			}
			matched := false
			for _, legacyTitle := range legacyTitles {
				if entryTitle == legacyTitle {
					titleMatches = append(titleMatches, entry)
					matched = true
					break
				}
			}
			if matched {
				break
			}
		}
	}
	if len(titleMatches) > 0 {
		return dedupeEntriesByID(titleMatches)
	}

	return refined
}

func candidateLegacyTitles(legacy xmlmodels.LegacyAlmNeuRow) []string {
	raw := []string{
		normalizeLegacyTitleMatch(normalizeLegacyEntryPreferredTitle(legacy.Reihentitel)),
		normalizeLegacyTitleMatch(legacy.AlmTitel),
	}
	ret := []string{}
	seen := map[string]bool{}
	for _, title := range raw {
		if title == "" || seen[title] {
			continue
		}
		seen[title] = true
		ret = append(ret, title)
	}
	return ret
}

func normalizeLegacyTitleMatch(raw string) string {
	raw = datatypes.DeleteTags(raw)
	raw = NormalizeString(raw)
	raw = strings.ToLower(datatypes.NormalizeWhitespace(raw))
	return strings.TrimSpace(raw)
}

func RecordsFromInhalte(
	app core.App,
	inhalte xmlmodels.Inhalte,
	legacy map[int]LegacyBandMatch,
	entries map[int]*dbmodels.Entry,
	images imageIndex,
) ([]*dbmodels.Content, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	records := make([]*dbmodels.Content, 0, len(inhalte.Inhalte))
	if err != nil {
		fmt.Println(err)
		return records, err
	}
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

		if files := filesForContentImages(app, images.PathsForModernContent(inhalt.ID)); len(files) > 0 {
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
	images imageIndex,
) ([]*dbmodels.Content, error) {
	records, err := RecordsFromInhalte(app, inhalte, legacy, entries, images)
	if err != nil {
		return nil, err
	}

	legacyRecords, err := RecordsFromLegacyINHTab(app, legacy, entries, images)
	if err != nil {
		return nil, err
	}

	return append(records, legacyRecords...), nil
}

func RecordsFromLegacyData(
	app core.App,
	legacyData *xmlmodels.LegacyFallbackData,
	entries map[int]*dbmodels.Entry,
	items []*dbmodels.Item,
	images imageIndex,
) ([]*dbmodels.Content, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	if err != nil {
		return nil, err
	}

	resolver := newLegacyContentEntryResolver(app, legacyData, entries, items)
	records := make([]*dbmodels.Content, 0, len(legacyData.INHTab.Rows))

	for _, row := range legacyData.INHTab.Rows {
		entry, legacyAlm, ok := resolver.Resolve(row.ID)
		if !ok {
			continue
		}

		record := dbmodels.NewContent(core.NewRecord(collection))
		pseudonymData := extractContentPseudonymImportData(row.Autor, row.AnmerkungInhalt)
		record.SetEntry(entry.Id)
		record.SetAnnotation(NormalizeString(pseudonymData.annotation))
		record.SetMusenalmID(row.INHNR)
		record.SetResponsibilityStmt(NormalizeString(pseudonymData.responsibility))
		record.SetPseudonym(pseudonymData.pseudonym)
		record.SetMusenalmType(legacyMusenalmTypes(row.Objekt))
		if row.Seite != 0 {
			record.SetExtent(legacyPageExtent(row.Seite))
		}
		record.SetTitleStmt(NormalizeString(row.Titel))
		record.SetIncipitStmt(NormalizeString(row.Incipit))
		record.SetYear(entry.Year())
		applyLegacyUpdatedToContent(record, LegacyBandMatch{LegacyAlm: legacyAlm})

		if counting, ok := dbmodels.MUSENALM_PAGINATION_VALUES[row.Paginierung]; ok {
			record.SetMusenalmPagination(counting)
		}

		record.SetNumbering(row.Objektzaehl)

		if files := filesForContentImages(app, images.PathsForContent(row.INHNR)); len(files) > 0 {
			record.SetScans(files)
		}

		handlePreferredTitle(record)
		if n := record.PreferredTitle(); n == "" || n == NO_TITLE {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return records, nil
}

func RecordsFromLegacyINHTab(
	app core.App,
	legacy map[int]LegacyBandMatch,
	entries map[int]*dbmodels.Entry,
	images imageIndex,
) ([]*dbmodels.Content, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	if err != nil {
		return nil, err
	}

	records := []*dbmodels.Content{}
	for entryID, match := range legacy {
		entry, ok := entries[entryID]
		if !ok {
			app.Logger().Error("Entry not found for legacy content fallback", "entry", entryID)
			continue
		}

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
				record.SetExtent(legacyPageExtent(row.Seite))
			}
			record.SetTitleStmt(NormalizeString(row.Titel))
			record.SetIncipitStmt(NormalizeString(row.Incipit))
			record.SetYear(entry.Year())
			applyLegacyUpdatedToContent(record, match)

			if counting, ok := dbmodels.MUSENALM_PAGINATION_VALUES[row.Paginierung]; ok {
				record.SetMusenalmPagination(counting)
			}

			record.SetNumbering(row.Objektzaehl)

			if files := filesForContentImages(app, images.PathsForContent(row.INHNR)); len(files) > 0 {
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

func legacyPageExtent(page float64) string {
	return strconv.FormatInt(int64(math.Floor(page)), 10)
}

func legacyMusenalmTypes(raw string) []string {
	raw = normalizeLegacyContentTypeString(raw)
	if raw == "" {
		return nil
	}

	raw = strings.ReplaceAll(raw, "G-Verz I-Verz", "G-Verz u. I-Verz")
	raw = strings.ReplaceAll(raw, "I-Verz G-Verz", "I-Verz u. G-Verz")
	raw = strings.ReplaceAll(raw, "I-verz G-Verz", "I-verz u. G-Verz")
	raw = strings.ReplaceAll(raw, "G-Verz I-verz", "G-Verz u. I-verz")
	raw = strings.ReplaceAll(raw, "Text und Tabelle", "Text u. Tabelle")
	raw = strings.ReplaceAll(raw, "Tabelle u.Text", "Tabelle u. Text")
	raw = strings.ReplaceAll(raw, "Text u.Tabelle", "Text u. Tabelle")

	splitter := strings.NewReplacer(
		" u. ", "|",
		" u. ", "|",
		" u.", "|",
		" u ", "|",
		" & ", "|",
	)

	parts := strings.Split(splitter.Replace(raw), "|")
	seen := map[string]bool{}
	ret := []string{}

	for _, part := range parts {
		for _, mapped := range mapLegacyContentTypeToken(part) {
			if seen[mapped] {
				continue
			}
			seen[mapped] = true
			ret = append(ret, mapped)
		}
	}

	if len(ret) == 0 {
		return nil
	}

	return ret
}

func normalizeLegacyContentTypeString(raw string) string {
	raw = normalizeAgentString(raw)
	raw = strings.Trim(raw, " ,;")
	if raw == "" {
		return ""
	}

	fields := strings.Fields(raw)
	if len(fields) > 1 {
		last := strings.Trim(fields[len(fields)-1], " .,#;")
		if len([]rune(last)) == 1 {
			fields = fields[:len(fields)-1]
		}
	}

	raw = strings.Join(fields, " ")
	raw = strings.TrimSpace(strings.Trim(raw, ".,;"))
	switch raw {
	case "Text .":
		return "Text"
	default:
		return raw
	}
}

func mapLegacyContentTypeToken(raw string) []string {
	token := normalizeLegacyContentTypeString(raw)
	if token == "" {
		return nil
	}

	switch token {
	case "ägegen":
		return nil
	case "Gedicht":
		return []string{"Gedicht/Lied"}
	case "G-Verz":
		return []string{"Graphik-Verzeichnis"}
	case "I-Verz", "I-verz":
		return []string{"Inhaltsverzeichnis"}
	case "MusBB-Verz":
		return []string{"Musikbeigaben-Verzeichnis"}
	case "Graphik/Tafel":
		return []string{"Graphik"}
	case "Graphik/Karte":
		return []string{"Karte"}
	case "Vrwrt", "VrlgM":
		return []string{"Text"}
	case "Kalender":
		return []string{"Kalendarium"}
	case "graph. Stickanleitung":
		return []string{"graph. Strickanleitung"}
	case "Tablle":
		return []string{"Tabelle"}
	}

	if token == "Text u. Gedicht" {
		return []string{"Text", "Gedicht/Lied"}
	}
	if token == "Prosa u. Gedicht" {
		return []string{"Prosa", "Gedicht/Lied"}
	}
	if token == "Tabelle u. Text" {
		return []string{"Tabelle", "Text"}
	}

	switch token {
	case "Corrigenda",
		"Diagramm",
		"Gedicht/Lied",
		"Graphik",
		"Graphik-Verzeichnis",
		"graph. Anleitung",
		"graph. Strickanleitung",
		"graph. Tanzanleitung",
		"Inhaltsverzeichnis",
		"Kalendarium",
		"Karte",
		"Musikbeigabe",
		"Musikbeigaben-Verzeichnis",
		"Motto",
		"Prosa",
		"Rätsel",
		"Sammlung",
		"Spiegel",
		"szen. Darstellung",
		"Tabelle",
		"Tafel",
		"Titel",
		"Text",
		"Trinkspruch",
		"Umschlag",
		"Widmung":
		return []string{token}
	default:
		return nil
	}
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

func filesForContentImages(app core.App, paths []string) []*filesystem.File {
	if len(paths) == 0 {
		return nil
	}

	files := make([]*filesystem.File, 0, len(paths))
	for _, image := range paths {
		file, err := filesystem.NewFileFromPath(image)
		if err != nil {
			app.Logger().Error("Error creating file from path", "error", err, "path", image)
			continue
		}
		files = append(files, file)
	}

	return files
}

func IndexContentImages(path string) imageIndex {
	ret := imageIndex{byContentID: make(map[int][]indexedImage)}
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ret
	}

	err := filepath.Walk(path, func(fullPath string, info os.FileInfo, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		if info.IsDir() {
			return nil
		}

		if !isSupportedImageExt(filepath.Ext(info.Name())) {
			return nil
		}

		contentID, image, ok := parseIndexedImage(fullPath)
		if !ok {
			slog.Warn("Skipping image with unparseable content id", "path", fullPath)
			return nil
		}

		ret.byContentID[contentID] = append(ret.byContentID[contentID], image)
		return nil
	})
	if err != nil {
		slog.Error("Error indexing content images", "error", err, "path", path)
		return ret
	}

	for contentID, images := range ret.byContentID {
		sort.Slice(images, func(i, j int) bool {
			if images[i].orderGroup != images[j].orderGroup {
				return images[i].orderGroup < images[j].orderGroup
			}
			if images[i].order != images[j].order {
				return images[i].order < images[j].order
			}
			return images[i].path < images[j].path
		})
		ret.byContentID[contentID] = images
	}

	return ret
}

func getImages(path string) imageIndex {
	return IndexContentImages(path)
}

func isSupportedImageExt(ext string) bool {
	switch strings.ToLower(ext) {
	case ".jpg", ".jpeg", ".png", ".tif", ".tiff":
		return true
	default:
		return false
	}
}

func parseIndexedImage(path string) (int, indexedImage, bool) {
	filename := filepath.Base(path)
	ext := filepath.Ext(filename)
	stem := strings.TrimSuffix(filename, ext)

	matches := legacyImageNameRegexp.FindStringSubmatch(stem)
	if matches == nil {
		return 0, indexedImage{}, false
	}

	contentID, err := strconv.Atoi(matches[2])
	if err != nil {
		return 0, indexedImage{}, false
	}

	group, order := parseIndexedImageOrder(matches[3])
	return contentID, indexedImage{
		path:       path,
		orderGroup: group,
		order:      order,
	}, true
}

func parseIndexedImageOrder(raw string) (int, int) {
	suffix := strings.TrimSpace(raw)
	if suffix == "" {
		return 0, 0
	}

	if strings.HasPrefix(suffix, ",") || strings.HasPrefix(suffix, "-") {
		number := readLeadingDigits(suffix[1:])
		if number != "" {
			if parsed, err := strconv.Atoi(number); err == nil {
				return 1, parsed
			}
		}
	}

	return 2, 0
}

func readLeadingDigits(raw string) string {
	var digits []rune
	for _, r := range raw {
		if r < '0' || r > '9' {
			break
		}
		digits = append(digits, r)
	}
	return string(digits)
}
