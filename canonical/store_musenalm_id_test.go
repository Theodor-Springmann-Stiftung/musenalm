package canonical

import "testing"

func TestCreateEntryAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	year := 1820

	entry, err := store.CreateEntry(app, EntryInput{
		PreferredTitle:    "Fresh Entry",
		Title:             "Fresh Entry",
		PreferredSeriesID: series.Id,
		Status:            "ToDo",
		Year:              &year,
	}, nil)
	if err != nil {
		t.Fatalf("CreateEntry: %v", err)
	}

	if got := entry.MusenalmID(); got != minNewMusenalmID {
		t.Fatalf("expected first musenalm ID %d, got %d", minNewMusenalmID, got)
	}
}

func TestCreateEntryIncrementsAboveExistingMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	series := createTestCanonicalSeries(t, app, "Series")
	existing := createTestCanonicalEntry(t, app, series.Id, nil, "Existing Entry", 1819)
	existing.SetMusenalmID(5007)
	if err := app.Save(existing); err != nil {
		t.Fatalf("save existing entry with musenalm ID: %v", err)
	}

	store := NewStore()
	year := 1820

	entry, err := store.CreateEntry(app, EntryInput{
		PreferredTitle:    "Fresh Entry",
		Title:             "Fresh Entry",
		PreferredSeriesID: series.Id,
		Status:            "ToDo",
		Year:              &year,
	}, nil)
	if err != nil {
		t.Fatalf("CreateEntry: %v", err)
	}

	if got := entry.MusenalmID(); got != 5008 {
		t.Fatalf("expected next musenalm ID 5008, got %d", got)
	}
}
