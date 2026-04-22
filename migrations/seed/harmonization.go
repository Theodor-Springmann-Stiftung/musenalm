package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

type DataHarmonizationResult struct {
	DeletedSeries   int
	DeletedPlaces   int
	DeletedAgents   int
	DeletedContents int
}

func RunDataHarmonization(app core.App) (*DataHarmonizationResult, error) {
	result := &DataHarmonizationResult{}

	if err := deleteEmptyUntitledPoemContents(app, result); err != nil {
		return nil, err
	}
	if err := deleteUnreferencedSeries(app, result); err != nil {
		return nil, err
	}
	if err := deleteUnreferencedPlaces(app, result); err != nil {
		return nil, err
	}
	if err := deleteUnreferencedAgents(app, result); err != nil {
		return nil, err
	}

	app.Logger().Info(
		"Data harmonization completed",
		"deleted_series", result.DeletedSeries,
		"deleted_places", result.DeletedPlaces,
		"deleted_agents", result.DeletedAgents,
		"deleted_contents", result.DeletedContents,
	)

	return result, nil
}

func deleteEmptyUntitledPoemContents(app core.App, result *DataHarmonizationResult) error {
	contents := []*dbmodels.Content{}
	if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).All(&contents); err != nil {
		return err
	}

	contentRelations := []*dbmodels.RContentsAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)).All(&contentRelations); err != nil {
		return err
	}

	relationsByContent := map[string][]*dbmodels.RContentsAgents{}
	for _, rel := range contentRelations {
		if rel == nil {
			continue
		}
		contentID := strings.TrimSpace(rel.Content())
		if contentID == "" {
			continue
		}
		relationsByContent[contentID] = append(relationsByContent[contentID], rel)
	}

	for _, content := range contents {
		if content == nil || !shouldDeleteHarmonizationContent(content) {
			continue
		}

		for _, rel := range relationsByContent[content.Id] {
			if rel == nil {
				continue
			}
			if err := app.Delete(rel); err != nil {
				return err
			}
		}
		if err := app.Delete(content); err != nil {
			return err
		}
		result.DeletedContents++
	}

	return nil
}

func shouldDeleteHarmonizationContent(content *dbmodels.Content) bool {
	if content == nil || !containsExactString(content.MusenalmType(), "Gedicht/Lied") {
		return false
	}

	responsibility := strings.TrimSpace(content.ResponsibilityStmt())
	if len([]rune(responsibility)) > 1 && !strings.EqualFold(responsibility, "unbezeichnet") {
		return false
	}

	return strings.TrimSpace(content.TitleStmt()) == "" &&
		strings.TrimSpace(content.IncipitStmt()) == "" &&
		strings.TrimSpace(content.Annotation()) == ""
}

func deleteUnreferencedSeries(app core.App, result *DataHarmonizationResult) error {
	series := []*dbmodels.Series{}
	if err := app.RecordQuery(dbmodels.SERIES_TABLE).All(&series); err != nil {
		return err
	}

	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return err
	}

	relations := []*dbmodels.REntriesSeries{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)).All(&relations); err != nil {
		return err
	}

	referenced := map[string]bool{}
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		if id := strings.TrimSpace(entry.Series()); id != "" {
			referenced[id] = true
		}
	}
	for _, rel := range relations {
		if rel == nil {
			continue
		}
		if id := strings.TrimSpace(rel.Series()); id != "" {
			referenced[id] = true
		}
	}

	for _, record := range series {
		if record == nil || referenced[record.Id] {
			continue
		}
		if err := app.Delete(record); err != nil {
			return err
		}
		result.DeletedSeries++
	}

	return nil
}

func deleteUnreferencedPlaces(app core.App, result *DataHarmonizationResult) error {
	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return err
	}

	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return err
	}

	referenced := map[string]bool{}
	for _, entry := range entries {
		if entry == nil {
			continue
		}
		for _, placeID := range entry.Places() {
			placeID = strings.TrimSpace(placeID)
			if placeID != "" {
				referenced[placeID] = true
			}
		}
	}

	for _, record := range places {
		if record == nil || referenced[record.Id] {
			continue
		}
		if err := app.Delete(record); err != nil {
			return err
		}
		result.DeletedPlaces++
	}

	return nil
}

func deleteUnreferencedAgents(app core.App, result *DataHarmonizationResult) error {
	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
		return err
	}

	entryRelations := []*dbmodels.REntriesAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).All(&entryRelations); err != nil {
		return err
	}

	contentRelations := []*dbmodels.RContentsAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)).All(&contentRelations); err != nil {
		return err
	}

	referenced := map[string]bool{}
	for _, rel := range entryRelations {
		if rel == nil {
			continue
		}
		if id := strings.TrimSpace(rel.Agent()); id != "" {
			referenced[id] = true
		}
	}
	for _, rel := range contentRelations {
		if rel == nil {
			continue
		}
		if id := strings.TrimSpace(rel.Agent()); id != "" {
			referenced[id] = true
		}
	}

	for _, record := range agents {
		if record == nil || referenced[record.Id] {
			continue
		}
		if err := app.Delete(record); err != nil {
			return err
		}
		result.DeletedAgents++
	}

	return nil
}

func containsExactString(values []string, want string) bool {
	for _, value := range values {
		if strings.TrimSpace(value) == want {
			return true
		}
	}
	return false
}
