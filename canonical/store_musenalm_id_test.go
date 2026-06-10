package canonical

import "testing"

func TestCreateAgentAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()

	agent, err := store.CreateAgent(app, AgentInput{
		Name:   "Fresh Agent",
		Status: "ToDo",
	}, nil)
	if err != nil {
		t.Fatalf("CreateAgent: %v", err)
	}

	if got := agent.MusenalmID(); got != 1 {
		t.Fatalf("expected first musenalm ID 1, got %d", got)
	}
}

func TestCreatePlaceAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()

	place, err := store.CreatePlace(app, PlaceInput{
		Name:   "Fresh Place",
		Status: "ToDo",
	}, nil)
	if err != nil {
		t.Fatalf("CreatePlace: %v", err)
	}

	if got := place.MusenalmID(); got != 1 {
		t.Fatalf("expected first musenalm ID 1, got %d", got)
	}
}

func TestCreateSeriesAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()

	series, err := store.CreateSeries(app, SeriesInput{
		Title:  "Fresh Series",
		Status: "ToDo",
	}, nil)
	if err != nil {
		t.Fatalf("CreateSeries: %v", err)
	}

	if got := series.MusenalmID(); got != 1 {
		t.Fatalf("expected first musenalm ID 1, got %d", got)
	}
}

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

	if got := entry.MusenalmID(); got != minNewEntryMusenalmID {
		t.Fatalf("expected first musenalm ID %d, got %d", minNewEntryMusenalmID, got)
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

func TestCreateContentAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	entry := createTestCanonicalEntry(t, app, series.Id, nil, "Entry", 1820)

	content, err := store.CreateContent(app, entry, ContentInput{
		PreferredTitle: "Fresh Content",
		Title:          "Fresh Content",
		MusenalmTypes:  []string{"Aufsatz"},
		Status:         "ToDo",
	}, nil)
	if err != nil {
		t.Fatalf("CreateContent: %v", err)
	}

	if got := content.MusenalmID(); got != minNewContentMusenalmID {
		t.Fatalf("expected first musenalm ID %d, got %d", minNewContentMusenalmID, got)
	}
}

func TestCreateContentReservationAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	entry := createTestCanonicalEntry(t, app, series.Id, nil, "Entry", 1820)
	existing := createTestCanonicalContent(t, app, entry.Id, "Legacy Content")
	existing.SetMusenalmID(7)
	if err := app.Save(existing); err != nil {
		t.Fatalf("save existing content: %v", err)
	}

	reservation, err := store.CreateContentNumberReservation(app, entry, 3)
	if err != nil {
		t.Fatalf("CreateContentNumberReservation: %v", err)
	}

	if got := reservation.StartMusenalmID(); got != minNewContentMusenalmID {
		t.Fatalf("expected reservation start %d, got %d", minNewContentMusenalmID, got)
	}
	if got := reservation.NextMusenalmID(); got != minNewContentMusenalmID {
		t.Fatalf("expected reservation next %d, got %d", minNewContentMusenalmID, got)
	}
}

func TestReassignEntryContentMusenalmIDsNewAssignsMinimumMusenalmID(t *testing.T) {
	app := newCanonicalTestApp(t)
	defer app.Cleanup()

	store := NewStore()
	series := createTestCanonicalSeries(t, app, "Series")
	entry := createTestCanonicalEntry(t, app, series.Id, nil, "Entry", 1820)
	first := createTestCanonicalContent(t, app, entry.Id, "First")
	first.SetMusenalmID(12)
	first.SetNumbering(1)
	if err := app.Save(first); err != nil {
		t.Fatalf("save first content: %v", err)
	}
	second := createTestCanonicalContent(t, app, entry.Id, "Second")
	second.SetMusenalmID(27)
	second.SetNumbering(2)
	if err := app.Save(second); err != nil {
		t.Fatalf("save second content: %v", err)
	}

	contents, err := store.ReassignEntryContentMusenalmIDsNew(app, entry.Id)
	if err != nil {
		t.Fatalf("ReassignEntryContentMusenalmIDsNew: %v", err)
	}

	if got := contents[0].MusenalmID(); got != minNewContentMusenalmID {
		t.Fatalf("expected first reassigned musenalm ID %d, got %d", minNewContentMusenalmID, got)
	}
	if got := contents[1].MusenalmID(); got != minNewContentMusenalmID+1 {
		t.Fatalf("expected second reassigned musenalm ID %d, got %d", minNewContentMusenalmID+1, got)
	}
}
