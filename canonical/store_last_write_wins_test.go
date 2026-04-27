package canonical

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
)

func TestUpdateAgentAllowsStaleSave(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	agent := createTestCanonicalAgent(t, app, "Original")

	fresh, err := dbmodels.Agents_ID(app, agent.Id)
	if err != nil {
		t.Fatalf("reload agent: %v", err)
	}
	fresh.SetComment("current db value")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("save current agent: %v", err)
	}

	if err := store.UpdateAgent(app, agent, AgentInput{
		Name:     "Saved from stale form",
		Status:   "Review",
		Comment:  "later save wins",
		EditorID: "editor-1",
	}, nil); err != nil {
		t.Fatalf("UpdateAgent: %v", err)
	}

	stored, err := dbmodels.Agents_ID(app, agent.Id)
	if err != nil {
		t.Fatalf("reload saved agent: %v", err)
	}
	if stored.Name() != "Saved from stale form" {
		t.Fatalf("expected saved name to win, got %q", stored.Name())
	}
	if stored.Comment() != "later save wins" {
		t.Fatalf("expected saved comment to win, got %q", stored.Comment())
	}
}

func TestUpdatePlaceAllowsStaleSave(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	place := createTestCanonicalPlace(t, app, "Original Place")

	fresh, err := dbmodels.Places_ID(app, place.Id)
	if err != nil {
		t.Fatalf("reload place: %v", err)
	}
	fresh.SetAnnotation("current db value")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("save current place: %v", err)
	}

	if err := store.UpdatePlace(app, place, PlaceInput{
		Name:       "Saved from stale form",
		Status:     "Edited",
		Annotation: "later save wins",
		EditorID:   "editor-2",
	}, nil); err != nil {
		t.Fatalf("UpdatePlace: %v", err)
	}

	stored, err := dbmodels.Places_ID(app, place.Id)
	if err != nil {
		t.Fatalf("reload saved place: %v", err)
	}
	if stored.Name() != "Saved from stale form" {
		t.Fatalf("expected saved name to win, got %q", stored.Name())
	}
	if stored.Annotation() != "later save wins" {
		t.Fatalf("expected saved annotation to win, got %q", stored.Annotation())
	}
}

func TestUpdateSeriesAllowsStaleSave(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Original Series")

	fresh, err := dbmodels.Series_ID(app, series.Id)
	if err != nil {
		t.Fatalf("reload series: %v", err)
	}
	fresh.SetComment("current db value")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("save current series: %v", err)
	}

	if err := store.UpdateSeries(app, series, SeriesInput{
		Title:    "Saved from stale form",
		Status:   "Review",
		Comment:  "later save wins",
		EditorID: "editor-3",
	}, nil); err != nil {
		t.Fatalf("UpdateSeries: %v", err)
	}

	stored, err := dbmodels.Series_ID(app, series.Id)
	if err != nil {
		t.Fatalf("reload saved series: %v", err)
	}
	if stored.Title() != "Saved from stale form" {
		t.Fatalf("expected saved title to win, got %q", stored.Title())
	}
	if stored.Comment() != "later save wins" {
		t.Fatalf("expected saved comment to win, got %q", stored.Comment())
	}
}

func TestUpdateEntryAllowsStaleSave(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	place := createTestCanonicalPlace(t, app, "Place")
	entry := createTestCanonicalEntry(t, app, series.Id, []string{place.Id}, "Original Entry", 1820)

	fresh, err := dbmodels.Entries_ID(app, entry.Id)
	if err != nil {
		t.Fatalf("reload entry: %v", err)
	}
	fresh.SetComment("current db value")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("save current entry: %v", err)
	}

	year := 1821
	if err := store.UpdateEntry(app, entry, EntryInput{
		PreferredTitle:    "Saved from stale form",
		Title:             "Long Title",
		Status:            "Edited",
		Comment:           "later save wins",
		Year:              &year,
		PreferredSeriesID: series.Id,
		Places:            []string{place.Id},
		EditorID:          "editor-4",
	}, nil); err != nil {
		t.Fatalf("UpdateEntry: %v", err)
	}

	stored, err := dbmodels.Entries_ID(app, entry.Id)
	if err != nil {
		t.Fatalf("reload saved entry: %v", err)
	}
	if stored.PreferredTitle() != "Saved from stale form" {
		t.Fatalf("expected saved preferred title to win, got %q", stored.PreferredTitle())
	}
	if stored.Comment() != "later save wins" {
		t.Fatalf("expected saved comment to win, got %q", stored.Comment())
	}
	if stored.Year() != 1821 {
		t.Fatalf("expected saved year to win, got %d", stored.Year())
	}
}

func TestUpdateContentStatusAllowsStaleSave(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	entry := createTestCanonicalEntry(t, app, series.Id, nil, "Entry", 1820)
	content := createTestCanonicalContent(t, app, entry.Id, "Content")

	fresh, err := dbmodels.Contents_ID(app, content.Id)
	if err != nil {
		t.Fatalf("reload content: %v", err)
	}
	fresh.SetComment("current db value")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("save current content: %v", err)
	}

	if err := store.UpdateContentStatus(app, content, "Edited", "editor-5", nil); err != nil {
		t.Fatalf("UpdateContentStatus: %v", err)
	}

	stored, err := dbmodels.Contents_ID(app, content.Id)
	if err != nil {
		t.Fatalf("reload saved content: %v", err)
	}
	if stored.EditState() != "Edited" {
		t.Fatalf("expected saved status to win, got %q", stored.EditState())
	}
}

func TestDeletePlaceAllowsStaleDelete(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	place := createTestCanonicalPlace(t, app, "Place")
	entry := createTestCanonicalEntry(t, app, series.Id, []string{place.Id}, "Entry", 1820)

	fresh, err := dbmodels.Places_ID(app, place.Id)
	if err != nil {
		t.Fatalf("reload place: %v", err)
	}
	fresh.SetComment("current db value")
	if err := app.Save(fresh); err != nil {
		t.Fatalf("save current place: %v", err)
	}

	if err := store.DeletePlace(app, place, DeleteOptions{}, nil); err != nil {
		t.Fatalf("DeletePlace: %v", err)
	}

	if _, err := dbmodels.Places_ID(app, place.Id); err == nil {
		t.Fatal("expected place to be deleted")
	}

	storedEntry, err := dbmodels.Entries_ID(app, entry.Id)
	if err != nil {
		t.Fatalf("reload entry after delete: %v", err)
	}
	if len(storedEntry.Places()) != 0 {
		t.Fatalf("expected deleted place to be removed from entry, got %#v", storedEntry.Places())
	}
}

func newCanonicalTestApp(t *testing.T) *tests.TestApp {
	t.Helper()

	app, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("NewTestApp: %v", err)
	}

	if err := app.Save(testCanonicalAgentsCollection()); err != nil {
		app.Cleanup()
		t.Fatalf("save agents collection: %v", err)
	}
	if err := app.Save(testCanonicalPlacesCollection()); err != nil {
		app.Cleanup()
		t.Fatalf("save places collection: %v", err)
	}
	if err := app.Save(testCanonicalSeriesCollection()); err != nil {
		app.Cleanup()
		t.Fatalf("save series collection: %v", err)
	}

	places, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		app.Cleanup()
		t.Fatalf("find places collection: %v", err)
	}
	series, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
	if err != nil {
		app.Cleanup()
		t.Fatalf("find series collection: %v", err)
	}
	if err := app.Save(testCanonicalEntriesCollection(series.Id, places.Id)); err != nil {
		app.Cleanup()
		t.Fatalf("save entries collection: %v", err)
	}

	entries, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		app.Cleanup()
		t.Fatalf("find entries collection: %v", err)
	}
	if err := app.Save(testCanonicalContentsCollection(entries.Id)); err != nil {
		app.Cleanup()
		t.Fatalf("save contents collection: %v", err)
	}

	return app
}

func testCanonicalAgentsCollection() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.AGENTS_NAME_FIELD, Required: true},
		&core.BoolField{Name: dbmodels.AGENTS_CORP_FIELD},
		&core.BoolField{Name: dbmodels.AGENTS_FICTIONAL_FIELD},
		&core.URLField{Name: dbmodels.URI_FIELD},
		&core.TextField{Name: dbmodels.AGENTS_BIOGRAPHICAL_DATA_FIELD},
		&core.TextField{Name: dbmodels.AGENTS_PROFESSION_FIELD},
		&core.TextField{Name: dbmodels.AGENTS_PSEUDONYMS_FIELD},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD},
		&core.JSONField{Name: dbmodels.DATA_FIELD},
		&core.TextField{Name: dbmodels.EDITOR_FIELD},
	)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)
	dbmodels.SetCreatedUpdatedFields(&fields)
	collection.Fields = fields
	return collection
}

func testCanonicalPlacesCollection() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.PLACES_TABLE)
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.PLACES_NAME_FIELD, Required: true},
		&core.TextField{Name: dbmodels.PLACES_PSEUDONYMS_FIELD},
		&core.BoolField{Name: dbmodels.PLACES_FICTIONAL_FIELD},
		&core.URLField{Name: dbmodels.URI_FIELD},
		&core.TextField{Name: dbmodels.EDITOR_FIELD},
	)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)
	dbmodels.SetCreatedUpdatedFields(&fields)
	collection.Fields = fields
	return collection
}

func testCanonicalSeriesCollection() *core.Collection {
	collection := core.NewBaseCollection(dbmodels.SERIES_TABLE)
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.SERIES_TITLE_FIELD, Required: true},
		&core.TextField{Name: dbmodels.SERIES_PSEUDONYMS_FIELD},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD},
		&core.TextField{Name: dbmodels.SERIES_FREQUENCY_FIELD},
		&core.TextField{Name: dbmodels.EDITOR_FIELD},
	)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)
	dbmodels.SetCreatedUpdatedFields(&fields)
	collection.Fields = fields
	return collection
}

func testCanonicalEntriesCollection(seriesCollectionID, placesCollectionID string) *core.Collection {
	collection := core.NewBaseCollection(dbmodels.ENTRIES_TABLE)
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.PREFERRED_TITLE_FIELD, Required: true},
		&core.TextField{Name: dbmodels.TITLE_STMT_FIELD},
		&core.TextField{Name: dbmodels.PARALLEL_TITLE_FIELD},
		&core.TextField{Name: dbmodels.SUBTITLE_STMT_FIELD},
		&core.TextField{Name: dbmodels.VARIANT_TITLE_FIELD},
		&core.TextField{Name: dbmodels.INCIPIT_STMT_FIELD},
		&core.TextField{Name: dbmodels.RESPONSIBILITY_STMT_FIELD},
		&core.BoolField{Name: dbmodels.PSEUDONYM_FIELD},
		&core.TextField{Name: dbmodels.PUBLICATION_STMT_FIELD},
		&core.TextField{Name: dbmodels.PLACE_STMT_FIELD},
		&core.TextField{Name: dbmodels.EDITION_FIELD},
		&core.NumberField{Name: dbmodels.YEAR_FIELD, Required: true},
		&core.TextField{Name: dbmodels.EXTENT_FIELD},
		&core.TextField{Name: dbmodels.DIMENSIONS_FIELD},
		&core.TextField{Name: dbmodels.REFERENCES_FIELD},
		&core.RelationField{Name: dbmodels.SERIES_TABLE, CollectionId: seriesCollectionID, MaxSelect: 1},
		&core.RelationField{Name: dbmodels.PLACES_TABLE, CollectionId: placesCollectionID, MaxSelect: 999},
		&core.JSONField{Name: dbmodels.LANGUAGE_FIELD},
		&core.JSONField{Name: dbmodels.CONTENT_TYPE_FIELD},
		&core.JSONField{Name: dbmodels.MEDIA_TYPE_FIELD},
		&core.JSONField{Name: dbmodels.CARRIER_TYPE_FIELD},
		&core.TextField{Name: dbmodels.EDITOR_FIELD},
	)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)
	dbmodels.SetCreatedUpdatedFields(&fields)
	collection.Fields = fields
	return collection
}

func testCanonicalContentsCollection(entriesCollectionID string) *core.Collection {
	collection := core.NewBaseCollection(dbmodels.CONTENTS_TABLE)
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.PREFERRED_TITLE_FIELD, Required: true},
		&core.RelationField{Name: dbmodels.ENTRIES_TABLE, CollectionId: entriesCollectionID, MaxSelect: 1, Required: true},
		&core.NumberField{Name: dbmodels.NUMBERING_FIELD},
		&core.TextField{Name: dbmodels.EDITOR_FIELD},
	)
	dbmodels.SetMusenalmIDField(&fields)
	dbmodels.SetEditorStateField(&fields)
	dbmodels.SetNotesAndAnnotationsField(&fields)
	dbmodels.SetCreatedUpdatedFields(&fields)
	collection.Fields = fields
	return collection
}

func createTestCanonicalAgent(t *testing.T, app core.App, name string) *dbmodels.Agent {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		t.Fatalf("find agents collection: %v", err)
	}
	agent := dbmodels.NewAgent(core.NewRecord(collection))
	agent.SetName(name)
	agent.SetMusenalmID(1)
	agent.SetEditState("ToDo")
	if err := app.Save(agent); err != nil {
		t.Fatalf("save agent: %v", err)
	}
	return agent
}

func createTestCanonicalPlace(t *testing.T, app core.App, name string) *dbmodels.Place {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		t.Fatalf("find places collection: %v", err)
	}
	place := dbmodels.NewPlace(core.NewRecord(collection))
	place.SetName(name)
	place.SetMusenalmID(1)
	place.SetEditState("ToDo")
	if err := app.Save(place); err != nil {
		t.Fatalf("save place: %v", err)
	}
	return place
}

func createTestCanonicalSeries(t *testing.T, app core.App, title string) *dbmodels.Series {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
	if err != nil {
		t.Fatalf("find series collection: %v", err)
	}
	series := dbmodels.NewSeries(core.NewRecord(collection))
	series.SetTitle(title)
	series.SetMusenalmID(1)
	series.SetEditState("ToDo")
	if err := app.Save(series); err != nil {
		t.Fatalf("save series: %v", err)
	}
	return series
}

func createTestCanonicalEntry(t *testing.T, app core.App, seriesID string, placeIDs []string, title string, year int) *dbmodels.Entry {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		t.Fatalf("find entries collection: %v", err)
	}
	entry := dbmodels.NewEntry(core.NewRecord(collection))
	entry.SetPreferredTitle(title)
	entry.SetSeries(seriesID)
	entry.SetPlaces(placeIDs)
	entry.SetYear(year)
	entry.SetMusenalmID(1)
	entry.SetEditState("ToDo")
	if err := app.Save(entry); err != nil {
		t.Fatalf("save entry: %v", err)
	}
	return entry
}

func createTestCanonicalContent(t *testing.T, app core.App, entryID string, title string) *dbmodels.Content {
	t.Helper()

	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	if err != nil {
		t.Fatalf("find contents collection: %v", err)
	}
	content := dbmodels.NewContent(core.NewRecord(collection))
	content.SetPreferredTitle(title)
	content.SetEntry(entryID)
	content.SetMusenalmID(1)
	content.SetEditState("ToDo")
	if err := app.Save(content); err != nil {
		t.Fatalf("save content: %v", err)
	}
	return content
}
