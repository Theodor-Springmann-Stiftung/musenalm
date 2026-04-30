package canonical

import (
	"database/sql"
	"errors"
	"fmt"
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

type Store struct{}

type ValidationError struct {
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}

type ConflictError struct {
	Message string
}

func (e *ConflictError) Error() string {
	return e.Message
}

type DeleteOptions struct {
}

type AgentInput struct {
	Name             string
	Pseudonyms       string
	BiographicalData string
	Profession       string
	References       string
	Annotation       string
	URI              string
	CorporateBody    bool
	Fictional        bool
	Status           string
	Comment          string
	EditorID         string
}

type PlaceInput struct {
	Name       string
	Pseudonyms string
	Annotation string
	URI        string
	Fictional  bool
	Status     string
	Comment    string
	EditorID   string
}

type SeriesInput struct {
	Title      string
	Pseudonyms string
	Annotation string
	References string
	Frequency  string
	Status     string
	Comment    string
	EditorID   string
}

type EntryInput struct {
	PreferredTitle    string
	Title             string
	ParallelTitle     string
	Subtitle          string
	VariantTitle      string
	Incipit           string
	Responsibility    string
	Pseudonym         bool
	Publication       string
	PlaceStatement    string
	Edition           string
	Annotation        string
	Comment           string
	Extent            string
	Dimensions        string
	References        string
	Status            string
	Year              *int
	Languages         []string
	Places            []string
	PreferredSeriesID string
	EditorID          string
}

type ItemInput struct {
	ID         string
	Owner      string
	Identifier string
	Location   string
	Media      []string
	Annotation string
	URI        string
	Public     bool
}

type RelationInput struct {
	ID        string
	TargetID  string
	Type      string
	Uncertain bool
}

type EntrySeriesRelationInput struct {
	ID         string
	TargetID   string
	Annotation string
}

type ContentInput struct {
	PreferredTitle string
	VariantTitle   string
	ParallelTitle  string
	Title          string
	Subtitle       string
	Incipit        string
	Responsibility string
	Pseudonym      bool
	PlaceStatement string
	Extent         string
	Annotation     string
	Comment        string
	Language       []string
	ContentTypes   []string
	MusenalmTypes  []string
	Pagination     string
	Status         string
	Numbering      float64
	EditorID       string
}

type ContentScansInput struct {
	UploadedFiles  []*filesystem.File
	DeleteScans    []string
	ScansOrder     []string
	PendingScanIDs []string
	EditorID       string
}

func NewStore() *Store {
	return &Store{}
}

func (s *Store) CreateAgent(tx core.App, input AgentInput, effects *MutationEffects) (*dbmodels.Agent, error) {
	if err := validateAgentInput(input); err != nil {
		return nil, err
	}

	collection, err := tx.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		return nil, err
	}

	agent := dbmodels.NewAgent(core.NewRecord(collection))
	nextID, err := nextMusenalmID(tx, dbmodels.AGENTS_TABLE)
	if err != nil {
		return nil, err
	}
	agent.SetMusenalmID(nextID)
	s.applyAgentInput(agent, input)
	if err := tx.Save(agent); err != nil {
		return nil, err
	}
	if effects != nil {
		effects.MarkAgentUpdated(agent.Id, false)
	}

	return agent, nil
}

func (s *Store) UpdateAgent(tx core.App, agent *dbmodels.Agent, input AgentInput, effects *MutationEffects) error {
	if err := validateAgentInput(input); err != nil {
		return err
	}
	nameChanged := agent.Name() != strings.TrimSpace(input.Name)
	s.applyAgentInput(agent, input)
	if err := tx.Save(agent); err != nil {
		return err
	}
	if effects != nil {
		if nameChanged {
			hasEntryRelations, err := agentHasEntryRelations(tx, agent.Id)
			if err != nil {
				return err
			}
			hasContentRelations, err := agentHasContentRelations(tx, agent.Id)
			if err != nil {
				return err
			}
			effects.ResetEntryAgentOrder = effects.ResetEntryAgentOrder || hasEntryRelations
			effects.ResetContentAgentOrder = effects.ResetContentAgentOrder || hasContentRelations
		}
		effects.MarkAgentUpdated(agent.Id, nameChanged)
	}
	return nil
}

func (s *Store) UpdateAgentStatus(tx core.App, agent *dbmodels.Agent, status string, editorID string, effects *MutationEffects) error {
	if err := validateStatus(status); err != nil {
		return err
	}
	agent.SetEditState(strings.TrimSpace(status))
	if editorID != "" {
		agent.SetEditor(editorID)
	}
	if err := tx.Save(agent); err != nil {
		return err
	}
	if effects != nil {
		effects.MarkAgentUpdated(agent.Id, false)
	}
	return nil
}

func (s *Store) DeleteAgent(tx core.App, agent *dbmodels.Agent, opts DeleteOptions, effects *MutationEffects) error {
	hasEntryRelations, err := agentHasEntryRelations(tx, agent.Id)
	if err != nil {
		return err
	}
	hasContentRelations, err := agentHasContentRelations(tx, agent.Id)
	if err != nil {
		return err
	}
	if err := s.deleteAgentRelations(tx, agent.Id); err != nil {
		return err
	}

	record, err := tx.FindRecordById(dbmodels.AGENTS_TABLE, agent.Id)
	if err != nil {
		return err
	}
	if err := tx.Delete(record); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetEntryAgentOrder = effects.ResetEntryAgentOrder || hasEntryRelations
		effects.ResetContentAgentOrder = effects.ResetContentAgentOrder || hasContentRelations
		effects.MarkAgentDeleted(agent.Id)
	}
	return nil
}

func (s *Store) CreatePlace(tx core.App, input PlaceInput, effects *MutationEffects) (*dbmodels.Place, error) {
	if err := validatePlaceInput(input); err != nil {
		return nil, err
	}

	collection, err := tx.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	if err != nil {
		return nil, err
	}

	place := dbmodels.NewPlace(core.NewRecord(collection))
	nextID, err := nextMusenalmID(tx, dbmodels.PLACES_TABLE)
	if err != nil {
		return nil, err
	}
	place.SetMusenalmID(nextID)
	s.applyPlaceInput(place, input)
	if err := tx.Save(place); err != nil {
		return nil, err
	}
	if effects != nil {
		effects.ResetPlaceOrder = true
		effects.MarkPlaceUpdated(place.Id, false)
	}

	return place, nil
}

func (s *Store) UpdatePlace(tx core.App, place *dbmodels.Place, input PlaceInput, effects *MutationEffects) error {
	if err := validatePlaceInput(input); err != nil {
		return err
	}
	nameChanged := place.Name() != strings.TrimSpace(input.Name)
	s.applyPlaceInput(place, input)
	if err := tx.Save(place); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetPlaceOrder = effects.ResetPlaceOrder || nameChanged
		effects.MarkPlaceUpdated(place.Id, nameChanged)
	}
	return nil
}

func (s *Store) UpdatePlaceStatus(tx core.App, place *dbmodels.Place, status string, editorID string, effects *MutationEffects) error {
	if err := validateStatus(status); err != nil {
		return err
	}
	place.SetEditState(strings.TrimSpace(status))
	if editorID != "" {
		place.SetEditor(editorID)
	}
	if err := tx.Save(place); err != nil {
		return err
	}
	if effects != nil {
		effects.MarkPlaceUpdated(place.Id, false)
	}
	return nil
}

func (s *Store) DeletePlace(tx core.App, place *dbmodels.Place, opts DeleteOptions, effects *MutationEffects) error {
	entries, err := s.PlaceEntries(tx, place.Id)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		updatedPlaces := make([]string, 0, len(entry.Places()))
		for _, placeID := range entry.Places() {
			if placeID != place.Id {
				updatedPlaces = append(updatedPlaces, placeID)
			}
		}
		entry.SetPlaces(updatedPlaces)
		if err := tx.Save(entry); err != nil {
			return err
		}
	}

	record, err := tx.FindRecordById(dbmodels.PLACES_TABLE, place.Id)
	if err != nil {
		return err
	}
	if err := tx.Delete(record); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetPlaceOrder = true
		effects.MarkPlaceDeleted(place.Id)
		for _, entry := range entries {
			effects.MarkEntryUpdated(entry.Id, EntryFTSEntryAndContents)
		}
	}
	return nil
}

func (s *Store) CreateSeries(tx core.App, input SeriesInput, effects *MutationEffects) (*dbmodels.Series, error) {
	if err := validateSeriesInput(input); err != nil {
		return nil, err
	}

	collection, err := tx.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
	if err != nil {
		return nil, err
	}

	series := dbmodels.NewSeries(core.NewRecord(collection))
	nextID, err := nextMusenalmID(tx, dbmodels.SERIES_TABLE)
	if err != nil {
		return nil, err
	}
	series.SetMusenalmID(nextID)
	s.applySeriesInput(series, input)
	if err := tx.Save(series); err != nil {
		return nil, err
	}
	if effects != nil {
		effects.ResetSeriesOrder = true
		effects.MarkSeriesUpdated(series.Id, false)
	}

	return series, nil
}

func (s *Store) UpdateSeries(tx core.App, series *dbmodels.Series, input SeriesInput, effects *MutationEffects) error {
	if err := validateSeriesInput(input); err != nil {
		return err
	}
	titleChanged := series.Title() != strings.TrimSpace(input.Title)
	s.applySeriesInput(series, input)
	if err := tx.Save(series); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetSeriesOrder = effects.ResetSeriesOrder || titleChanged
		effects.MarkSeriesUpdated(series.Id, titleChanged)
	}
	return nil
}

func (s *Store) UpdateSeriesStatus(tx core.App, series *dbmodels.Series, status string, editorID string, effects *MutationEffects) error {
	if err := validateStatus(status); err != nil {
		return err
	}
	series.SetEditState(strings.TrimSpace(status))
	if editorID != "" {
		series.SetEditor(editorID)
	}
	if err := tx.Save(series); err != nil {
		return err
	}
	if effects != nil {
		effects.MarkSeriesUpdated(series.Id, false)
	}
	return nil
}

func (s *Store) DeleteSeries(tx core.App, series *dbmodels.Series, opts DeleteOptions, effects *MutationEffects) error {
	preferredEntries, err := s.preferredSeriesEntries(tx, series.Id)
	if err != nil {
		return err
	}

	for _, entry := range preferredEntries {
		if err := s.DeleteEntry(tx, entry, DeleteOptions{}, effects); err != nil {
			return err
		}
	}

	relations, err := dbmodels.REntriesSeries_Seriess(tx, []any{series.Id})
	if err != nil {
		return err
	}

	relationsTable := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)
	for _, relation := range relations {
		record, err := tx.FindRecordById(relationsTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	record, err := tx.FindRecordById(dbmodels.SERIES_TABLE, series.Id)
	if err != nil {
		return err
	}
	if err := tx.Delete(record); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetSeriesOrder = true
		effects.MarkSeriesDeleted(series.Id)
	}
	return nil
}

func (s *Store) CreateEntry(tx core.App, input EntryInput, effects *MutationEffects) (*dbmodels.Entry, error) {
	if err := validateEntryInput(input); err != nil {
		return nil, err
	}

	collection, err := tx.FindCollectionByNameOrId(dbmodels.ENTRIES_TABLE)
	if err != nil {
		return nil, err
	}

	entry := dbmodels.NewEntry(core.NewRecord(collection))
	nextID, err := nextMusenalmID(tx, dbmodels.ENTRIES_TABLE)
	if err != nil {
		return nil, err
	}
	entry.SetMusenalmID(nextID)
	s.applyEntryInput(entry, input)
	if err := tx.Save(entry); err != nil {
		return nil, err
	}
	if effects != nil {
		effects.InvalidateSortedEntries = true
		effects.ResetBaende = true
		effects.ResetEntrySummary = true
		effects.MarkEntryUpdated(entry.Id, EntryFTSEntryAndContents)
	}

	return entry, nil
}

func (s *Store) UpdateEntry(tx core.App, entry *dbmodels.Entry, input EntryInput, effects *MutationEffects) error {
	if err := validateEntryInput(input); err != nil {
		return err
	}
	updateMode := EntryFTSEntryOnly
	if entry.PreferredTitle() != strings.TrimSpace(input.PreferredTitle) || entry.Year() != *input.Year {
		updateMode = EntryFTSEntryAndContents
	}
	s.applyEntryInput(entry, input)
	if err := tx.Save(entry); err != nil {
		return err
	}
	if effects != nil {
		effects.InvalidateSortedEntries = true
		effects.ResetBaende = true
		effects.MarkEntryUpdated(entry.Id, updateMode)
	}
	return nil
}

func (s *Store) UpdateEntryStatus(tx core.App, entry *dbmodels.Entry, status string, editorID string, effects *MutationEffects) error {
	if err := validateStatus(status); err != nil {
		return err
	}
	entry.SetEditState(strings.TrimSpace(status))
	if editorID != "" {
		entry.SetEditor(editorID)
	}
	if err := tx.Save(entry); err != nil {
		return err
	}
	if effects != nil {
		effects.InvalidateSortedEntries = true
		effects.ResetBaende = true
		effects.MarkEntryUpdated(entry.Id, EntryFTSEntryOnly)
	}
	return nil
}

func (s *Store) UpdateEntryExtent(tx core.App, entry *dbmodels.Entry, extent string, editorID string, effects *MutationEffects) error {
	entry.SetExtent(strings.TrimSpace(extent))
	if editorID != "" {
		entry.SetEditor(editorID)
	}
	if err := tx.Save(entry); err != nil {
		return err
	}
	if effects != nil {
		effects.InvalidateSortedEntries = true
		effects.MarkEntryUpdated(entry.Id, EntryFTSEntryOnly)
	}
	return nil
}

func (s *Store) SaveEntryItems(tx core.App, entry *dbmodels.Entry, items []ItemInput, deletedIDs []string) error {
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		found, err := tx.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err != nil {
			return nil, err
		}
		collection = found
		return collection, nil
	}

	for _, input := range items {
		itemID := strings.TrimSpace(input.ID)
		var item *dbmodels.Item
		if itemID != "" {
			record, err := tx.FindRecordById(dbmodels.ITEMS_TABLE, itemID)
			if err != nil {
				return err
			}
			item = dbmodels.NewItem(record)
			if item.Entry() != entry.Id {
				return validationErrorf("Exemplar %s gehört zu einem anderen Eintrag.", itemID)
			}
		} else {
			found, err := getCollection()
			if err != nil {
				return err
			}
			item = dbmodels.NewItem(core.NewRecord(found))
		}

		s.applyItemInput(item, entry.Id, input)
		if err := tx.Save(item); err != nil {
			return err
		}
	}

	for _, itemID := range deletedIDs {
		itemID = strings.TrimSpace(itemID)
		if itemID == "" {
			continue
		}
		record, err := tx.FindRecordById(dbmodels.ITEMS_TABLE, itemID)
		if err != nil {
			continue
		}
		item := dbmodels.NewItem(record)
		if item.Entry() != entry.Id {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) SaveEntrySeriesRelations(tx core.App, entry *dbmodels.Entry, preferredSeriesID string, relations []EntrySeriesRelationInput, newRelations []EntrySeriesRelationInput, deletedIDs []string, effects *MutationEffects) error {
	if err := validateEntrySeriesRelations(preferredSeriesID, relations, newRelations); err != nil {
		return err
	}

	tableName := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		found, err := tx.FindCollectionByNameOrId(tableName)
		if err != nil {
			return nil, err
		}
		collection = found
		return collection, nil
	}

	for _, relation := range relations {
		relationID := strings.TrimSpace(relation.ID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			return err
		}
		proxy := dbmodels.NewREntriesSeries(record)
		if proxy.Entry() != entry.Id {
			return validationErrorf("Relation %s gehört zu einem anderen Eintrag.", relationID)
		}
		s.applyEntrySeriesRelation(proxy, entry.Id, relation)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	for _, relationID := range deletedIDs {
		relationID = strings.TrimSpace(relationID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			continue
		}
		proxy := dbmodels.NewREntriesSeries(record)
		if proxy.Entry() != entry.Id {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	for _, relation := range newRelations {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		found, err := getCollection()
		if err != nil {
			return err
		}
		proxy := dbmodels.NewREntriesSeries(core.NewRecord(found))
		s.applyEntrySeriesRelation(proxy, entry.Id, relation)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) SaveEntryAgentRelations(tx core.App, entry *dbmodels.Entry, relations []RelationInput, newRelations []RelationInput, deletedIDs []string, effects *MutationEffects) error {
	if err := validateRelations(relations, dbmodels.AGENT_RELATIONS); err != nil {
		return err
	}
	if err := validateRelations(newRelations, dbmodels.AGENT_RELATIONS); err != nil {
		return err
	}

	tableName := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		found, err := tx.FindCollectionByNameOrId(tableName)
		if err != nil {
			return nil, err
		}
		collection = found
		return collection, nil
	}

	for _, relation := range relations {
		relationID := strings.TrimSpace(relation.ID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			return err
		}
		proxy := dbmodels.NewREntriesAgents(record)
		if proxy.Entry() != entry.Id {
			return validationErrorf("Relation %s gehört zu einem anderen Eintrag.", relationID)
		}
		s.applyEntryAgentRelation(proxy, entry.Id, relation)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	for _, relationID := range deletedIDs {
		relationID = strings.TrimSpace(relationID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			continue
		}
		proxy := dbmodels.NewREntriesAgents(record)
		if proxy.Entry() != entry.Id {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	for _, relation := range newRelations {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		found, err := getCollection()
		if err != nil {
			return err
		}
		proxy := dbmodels.NewREntriesAgents(core.NewRecord(found))
		s.applyEntryAgentRelation(proxy, entry.Id, relation)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	if effects != nil && (len(newRelations) > 0 || len(deletedIDs) > 0) {
		effects.ResetEntryAgentOrder = true
		effects.MarkEntryUpdated(entry.Id, EntryFTSEntryAndContents)
	}

	return nil
}

func (s *Store) DeleteEntry(tx core.App, entry *dbmodels.Entry, opts DeleteOptions, effects *MutationEffects) error {
	if err := s.deleteEntryRelations(tx, entry.Id); err != nil {
		return err
	}
	if err := s.deleteEntryItems(tx, entry.Id); err != nil {
		return err
	}
	if err := s.deleteEntryContents(tx, entry.Id); err != nil {
		return err
	}

	record, err := tx.FindRecordById(dbmodels.ENTRIES_TABLE, entry.Id)
	if err != nil {
		return err
	}
	if err := tx.Delete(record); err != nil {
		return err
	}
	if effects != nil {
		effects.InvalidateSortedEntries = true
		effects.ResetBaende = true
		effects.ResetEntrySummary = true
		effects.MarkEntryDeleted(entry.Id)
	}
	return nil
}

func (s *Store) CreateContent(tx core.App, entry *dbmodels.Entry, input ContentInput, effects *MutationEffects) (*dbmodels.Content, error) {
	collection, err := tx.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	if err != nil {
		return nil, err
	}

	content := dbmodels.NewContent(core.NewRecord(collection))
	nextID, err := s.allocateContentMusenalmID(tx, entry)
	if err != nil {
		return nil, err
	}
	content.SetMusenalmID(nextID)
	if err := s.applyContentInput(content, entry, input); err != nil {
		return nil, err
	}
	if err := tx.Save(content); err != nil {
		return nil, err
	}
	if effects != nil {
		effects.ResetEntrySummary = true
		effects.MarkContentUpdated(content.Id, entry.Id)
	}

	return content, nil
}

func (s *Store) CreateContentNumberReservation(tx core.App, entry *dbmodels.Entry, reservedCount int) (*dbmodels.ContentNumberReservation, error) {
	if entry == nil || strings.TrimSpace(entry.Id) == "" {
		return nil, validationErrorf("Band wurde nicht gefunden.")
	}
	if reservedCount <= 0 {
		return nil, validationErrorf("Die Anzahl der zu reservierenden Alm-Nummern muss groesser als 0 sein.")
	}

	activeReservation, err := dbmodels.ActiveContentNumberReservationForEntry(tx, entry.Id)
	if err != nil {
		return nil, err
	}
	if activeReservation != nil {
		return nil, conflictErrorf("Fuer diesen Band ist bereits ein aktiver Reservierungsblock vorhanden.")
	}

	collection, err := tx.FindCollectionByNameOrId(dbmodels.CONTENT_NUMBER_RESERVATIONS_TABLE)
	if err != nil {
		return nil, err
	}

	startID := 0
	highestEntryContentID, err := dbmodels.MaxContentMusenalmIDForEntry(tx, entry.Id)
	if err != nil {
		return nil, err
	}
	if highestEntryContentID > 0 {
		candidateStart := highestEntryContentID + 1
		rangeEnd := candidateStart + reservedCount - 1
		fits, err := s.contentNumberRangeFitsForEntry(tx, entry.Id, candidateStart, rangeEnd)
		if err != nil {
			return nil, err
		}
		if fits {
			startID = candidateStart
		}
	}
	if startID == 0 {
		startID, err = globalNextContentMusenalmID(tx)
		if err != nil {
			return nil, err
		}
	}

	reservation := dbmodels.NewContentNumberReservation(core.NewRecord(collection))
	reservation.SetEntry(entry.Id)
	reservation.SetStartMusenalmID(startID)
	reservation.SetReservedCount(reservedCount)
	reservation.SetNextMusenalmID(startID)
	reservation.SetActive(true)

	if err := tx.Save(reservation); err != nil {
		return nil, err
	}

	return reservation, nil
}

func (s *Store) DeactivateContentNumberReservation(tx core.App, reservation *dbmodels.ContentNumberReservation) error {
	if reservation == nil {
		return validationErrorf("Keine aktive Reservierung gefunden.")
	}
	if !reservation.Active() {
		return nil
	}
	reservation.SetActive(false)
	return tx.Save(reservation)
}

func (s *Store) UpdateContent(tx core.App, content *dbmodels.Content, entry *dbmodels.Entry, input ContentInput, effects *MutationEffects) error {
	if err := s.applyContentInput(content, entry, input); err != nil {
		return err
	}
	if err := tx.Save(content); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetEntrySummary = true
		effects.MarkContentUpdated(content.Id, entry.Id)
	}
	return nil
}

func (s *Store) UpdateContentStatus(tx core.App, content *dbmodels.Content, status string, editorID string, effects *MutationEffects) error {
	if err := validateStatus(status); err != nil {
		return err
	}
	content.SetEditState(strings.TrimSpace(status))
	if editorID != "" {
		content.SetEditor(editorID)
	}
	if err := tx.Save(content); err != nil {
		return err
	}
	if effects != nil {
		effects.MarkContentUpdated(content.Id, content.Entry())
	}
	return nil
}

func (s *Store) SaveContentAgentRelations(tx core.App, content *dbmodels.Content, relations []RelationInput, newRelations []RelationInput, deletedIDs []string, effects *MutationEffects) error {
	if err := validateRelations(relations, dbmodels.AGENT_RELATIONS); err != nil {
		return err
	}
	if err := validateRelations(newRelations, dbmodels.AGENT_RELATIONS); err != nil {
		return err
	}

	tableName := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		found, err := tx.FindCollectionByNameOrId(tableName)
		if err != nil {
			return nil, err
		}
		collection = found
		return collection, nil
	}

	for _, relation := range relations {
		relationID := strings.TrimSpace(relation.ID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			return err
		}
		proxy := dbmodels.NewRContentsAgents(record)
		if proxy.Content() != content.Id {
			return validationErrorf("Relation %s gehört zu einem anderen Beitrag.", relationID)
		}
		s.applyContentAgentRelation(proxy, content.Id, relation)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	for _, relationID := range deletedIDs {
		relationID = strings.TrimSpace(relationID)
		if relationID == "" {
			continue
		}
		record, err := tx.FindRecordById(tableName, relationID)
		if err != nil {
			continue
		}
		proxy := dbmodels.NewRContentsAgents(record)
		if proxy.Content() != content.Id {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	for _, relation := range newRelations {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		found, err := getCollection()
		if err != nil {
			return err
		}
		proxy := dbmodels.NewRContentsAgents(core.NewRecord(found))
		s.applyContentAgentRelation(proxy, content.Id, relation)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	if effects != nil && (len(newRelations) > 0 || len(deletedIDs) > 0) {
		effects.ResetContentAgentOrder = true
	}

	return nil
}

func (s *Store) UpdateContentScans(tx core.App, content *dbmodels.Content, input ContentScansInput) error {
	deleteSet := map[string]struct{}{}
	for _, scan := range input.DeleteScans {
		scan = strings.TrimSpace(scan)
		if scan == "" {
			continue
		}
		deleteSet[scan] = struct{}{}
	}

	if len(input.ScansOrder) > 0 || len(input.PendingScanIDs) > 0 {
		pendingMap := map[string]*filesystem.File{}
		for idx, id := range input.PendingScanIDs {
			if idx >= len(input.UploadedFiles) {
				break
			}
			id = strings.TrimSpace(id)
			if id == "" {
				continue
			}
			pendingMap[id] = input.UploadedFiles[idx]
		}

		ordered := make([]any, 0, len(input.ScansOrder)+len(input.UploadedFiles))
		seenExisting := map[string]struct{}{}
		for _, token := range input.ScansOrder {
			token = strings.TrimSpace(token)
			if token == "" {
				continue
			}
			if strings.HasPrefix(token, "pending:") {
				id := strings.TrimPrefix(token, "pending:")
				if file, ok := pendingMap[id]; ok {
					ordered = append(ordered, file)
				}
				continue
			}
			if strings.HasPrefix(token, "existing:") {
				name := strings.TrimPrefix(token, "existing:")
				if name == "" {
					continue
				}
				if _, deleted := deleteSet[name]; deleted {
					continue
				}
				ordered = append(ordered, name)
				seenExisting[name] = struct{}{}
			}
		}
		for _, name := range content.Scans() {
			if _, deleted := deleteSet[name]; deleted {
				continue
			}
			if _, seen := seenExisting[name]; seen {
				continue
			}
			ordered = append(ordered, name)
		}
		content.Set(dbmodels.SCAN_FIELD, ordered)
	} else {
		if len(input.UploadedFiles) > 0 {
			content.Set(dbmodels.SCAN_FIELD+"+", input.UploadedFiles)
		}
		for _, scan := range input.DeleteScans {
			scan = strings.TrimSpace(scan)
			if scan == "" {
				continue
			}
			content.Set(dbmodels.SCAN_FIELD+"-", scan)
		}
	}

	if input.EditorID != "" {
		content.SetEditor(input.EditorID)
	}
	return tx.Save(content)
}

func (s *Store) DeleteContent(tx core.App, content *dbmodels.Content, effects *MutationEffects) error {
	tableName := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
	relations, err := dbmodels.RContentsAgents_Content(tx, content.Id)
	if err != nil {
		return err
	}
	for _, relation := range relations {
		record, err := tx.FindRecordById(tableName, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, content.Id)
	if err != nil {
		return err
	}
	if err := tx.Delete(record); err != nil {
		return err
	}
	if effects != nil {
		effects.ResetEntrySummary = true
		effects.MarkContentDeleted(content.Id)
	}
	return nil
}

func (s *Store) RenumberEntryContents(tx core.App, entryID string) ([]*dbmodels.Content, error) {
	contents, err := dbmodels.Contents_Entry(tx, entryID)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Contents_Numbering(contents)
	for idx, content := range contents {
		content.SetNumbering(float64(idx + 1))
		if err := tx.Save(content); err != nil {
			return nil, err
		}
	}

	return contents, nil
}

func (s *Store) ReassignEntryContentMusenalmIDsPreserveSet(tx core.App, entryID string) ([]*dbmodels.Content, error) {
	contents, err := dbmodels.Contents_Entry(tx, entryID)
	if err != nil {
		return nil, err
	}
	if len(contents) == 0 {
		return nil, validationErrorf("Keine Beiträge zum Neu-Nummerieren vorhanden.")
	}

	dbmodels.Sort_Contents_Numbering(contents)
	targetIDs := make([]int, 0, len(contents))
	for _, content := range contents {
		targetIDs = append(targetIDs, content.MusenalmID())
	}
	slices.Sort(targetIDs)

	if err := s.reassignContentMusenalmIDs(tx, contents, targetIDs); err != nil {
		return nil, err
	}
	return contents, nil
}

func (s *Store) ReassignEntryContentMusenalmIDsNew(tx core.App, entryID string) ([]*dbmodels.Content, error) {
	activeReservation, err := dbmodels.ActiveContentNumberReservationForEntry(tx, entryID)
	if err != nil {
		return nil, err
	}
	if activeReservation != nil {
		return nil, conflictErrorf("Solange ein aktiver Reservierungsblock besteht, können keine neuen Nummern vergeben werden.")
	}

	contents, err := dbmodels.Contents_Entry(tx, entryID)
	if err != nil {
		return nil, err
	}
	if len(contents) == 0 {
		return nil, validationErrorf("Keine Beiträge zum Neu-Nummerieren vorhanden.")
	}

	dbmodels.Sort_Contents_Numbering(contents)
	if err := s.upsertContentPermalinkRedirects(tx, contents); err != nil {
		return nil, err
	}
	startID, err := globalNextContentMusenalmID(tx)
	if err != nil {
		return nil, err
	}
	targetIDs := make([]int, 0, len(contents))
	for idx := range contents {
		targetIDs = append(targetIDs, startID+idx)
	}

	if err := s.reassignContentMusenalmIDs(tx, contents, targetIDs); err != nil {
		return nil, err
	}
	return contents, nil
}

func (s *Store) upsertContentPermalinkRedirects(tx core.App, contents []*dbmodels.Content) error {
	if len(contents) == 0 {
		return nil
	}

	collection, err := tx.FindCollectionByNameOrId(dbmodels.CONTENT_PERMALINK_REDIRECTS_TABLE)
	if err != nil {
		return err
	}

	for _, content := range contents {
		if content == nil || strings.TrimSpace(content.Id) == "" || content.MusenalmID() <= 0 {
			continue
		}

		existing, err := dbmodels.ContentPermalinkRedirect_OldMusenalmIDInt(tx, content.MusenalmID())
		if err != nil {
			return err
		}
		if existing != nil {
			if existing.Content() != content.Id {
				return conflictErrorf("Alte Beitragsnummer %d ist bereits als Redirect vergeben.", content.MusenalmID())
			}
			continue
		}

		redirect := dbmodels.NewContentPermalinkRedirect(core.NewRecord(collection))
		redirect.SetContent(content.Id)
		redirect.SetOldMusenalmID(content.MusenalmID())
		if err := tx.Save(redirect); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) reassignContentMusenalmIDs(tx core.App, contents []*dbmodels.Content, targetIDs []int) error {
	if len(contents) != len(targetIDs) {
		return validationErrorf("Ungültige Renummerierung.")
	}
	if len(contents) == 0 {
		return nil
	}

	tempStart, err := globalNextContentMusenalmID(tx)
	if err != nil {
		return err
	}
	if maxTarget := slices.Max(targetIDs); tempStart <= maxTarget {
		tempStart = maxTarget + 1
	}

	for idx, content := range contents {
		content.SetMusenalmID(tempStart + idx)
		if err := tx.Save(content); err != nil {
			return err
		}
	}

	for idx, content := range contents {
		content.SetMusenalmID(targetIDs[idx])
		if err := tx.Save(content); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) PlaceEntries(app core.App, placeID string) ([]*dbmodels.Entry, error) {
	entries := []*dbmodels.Entry{}
	err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
		Where(dbx.NewExp(
			dbmodels.PLACES_TABLE+" = {:id} OR (json_valid("+dbmodels.PLACES_TABLE+") = 1 AND EXISTS (SELECT 1 FROM json_each("+dbmodels.PLACES_TABLE+") WHERE value = {:id}))",
			dbx.Params{"id": placeID},
		)).
		All(&entries)
	return entries, err
}

func (s *Store) applyAgentInput(agent *dbmodels.Agent, input AgentInput) {
	agent.SetName(strings.TrimSpace(input.Name))
	agent.SetPseudonyms(strings.TrimSpace(input.Pseudonyms))
	agent.SetBiographicalData(strings.TrimSpace(input.BiographicalData))
	agent.SetProfession(strings.TrimSpace(input.Profession))
	agent.SetReferences(strings.TrimSpace(input.References))
	agent.SetAnnotation(strings.TrimSpace(input.Annotation))
	agent.SetURI(strings.TrimSpace(input.URI))
	agent.SetCorporateBody(input.CorporateBody)
	agent.SetFictional(input.Fictional)
	agent.SetEditState(strings.TrimSpace(input.Status))
	agent.SetComment(strings.TrimSpace(input.Comment))
	if input.EditorID != "" {
		agent.SetEditor(input.EditorID)
	}
}

func (s *Store) applyPlaceInput(place *dbmodels.Place, input PlaceInput) {
	place.SetName(strings.TrimSpace(input.Name))
	place.SetPseudonyms(strings.TrimSpace(input.Pseudonyms))
	place.SetAnnotation(strings.TrimSpace(input.Annotation))
	place.SetURI(strings.TrimSpace(input.URI))
	place.SetFictional(input.Fictional)
	place.SetEditState(strings.TrimSpace(input.Status))
	place.SetComment(strings.TrimSpace(input.Comment))
	if input.EditorID != "" {
		place.SetEditor(input.EditorID)
	}
}

func (s *Store) applySeriesInput(series *dbmodels.Series, input SeriesInput) {
	series.SetTitle(strings.TrimSpace(input.Title))
	series.SetPseudonyms(strings.TrimSpace(input.Pseudonyms))
	series.SetAnnotation(strings.TrimSpace(input.Annotation))
	series.SetReferences(strings.TrimSpace(input.References))
	series.SetFrequency(strings.TrimSpace(input.Frequency))
	series.SetEditState(strings.TrimSpace(input.Status))
	series.SetComment(strings.TrimSpace(input.Comment))
	if input.EditorID != "" {
		series.SetEditor(input.EditorID)
	}
}

func (s *Store) applyEntryInput(entry *dbmodels.Entry, input EntryInput) {
	entry.SetPreferredTitle(strings.TrimSpace(input.PreferredTitle))
	entry.SetTitleStmt(strings.TrimSpace(input.Title))
	entry.SetParallelTitle(strings.TrimSpace(input.ParallelTitle))
	entry.SetSubtitleStmt(strings.TrimSpace(input.Subtitle))
	entry.SetVariantTitle(strings.TrimSpace(input.VariantTitle))
	entry.SetIncipitStmt(strings.TrimSpace(input.Incipit))
	entry.SetResponsibilityStmt(strings.TrimSpace(input.Responsibility))
	entry.SetPseudonym(input.Pseudonym)
	entry.SetPublicationStmt(strings.TrimSpace(input.Publication))
	entry.SetPlaceStmt(strings.TrimSpace(input.PlaceStatement))
	entry.SetEdition(strings.TrimSpace(input.Edition))
	entry.SetAnnotation(strings.TrimSpace(input.Annotation))
	entry.SetComment(strings.TrimSpace(input.Comment))
	entry.SetExtent(strings.TrimSpace(input.Extent))
	entry.SetDimensions(strings.TrimSpace(input.Dimensions))
	entry.SetReferences(strings.TrimSpace(input.References))
	if input.Year != nil {
		entry.SetYear(*input.Year)
	}
	entry.SetEditState(strings.TrimSpace(input.Status))
	entry.SetLanguage(sanitizeStrings(input.Languages))
	entry.SetPlaces(sanitizeStrings(input.Places))
	entry.SetSeries(strings.TrimSpace(input.PreferredSeriesID))
	if input.EditorID != "" {
		entry.SetEditor(input.EditorID)
	}
}

func (s *Store) applyItemInput(item *dbmodels.Item, entryID string, input ItemInput) {
	item.SetEntry(entryID)
	item.SetOwner(strings.TrimSpace(input.Owner))
	item.SetIdentifier(strings.TrimSpace(input.Identifier))
	item.SetLocation(strings.TrimSpace(input.Location))
	item.SetAnnotation(strings.TrimSpace(input.Annotation))
	item.SetUri(strings.TrimSpace(input.URI))
	item.SetMedia(sanitizeStrings(input.Media))
	item.SetPublic(input.Public)
}

func (s *Store) applyEntrySeriesRelation(proxy *dbmodels.REntriesSeries, entryID string, input EntrySeriesRelationInput) {
	proxy.SetEntry(entryID)
	proxy.SetSeries(strings.TrimSpace(input.TargetID))
	proxy.SetAnnotation(strings.TrimSpace(input.Annotation))
}

func (s *Store) applyEntryAgentRelation(proxy *dbmodels.REntriesAgents, entryID string, input RelationInput) {
	proxy.SetEntry(entryID)
	proxy.SetAgent(strings.TrimSpace(input.TargetID))
	proxy.SetType(strings.TrimSpace(input.Type))
	proxy.SetUncertain(input.Uncertain)
}

func (s *Store) applyContentAgentRelation(proxy *dbmodels.RContentsAgents, contentID string, input RelationInput) {
	proxy.SetContent(contentID)
	proxy.SetAgent(strings.TrimSpace(input.TargetID))
	proxy.SetType(strings.TrimSpace(input.Type))
	proxy.SetUncertain(input.Uncertain)
}

func (s *Store) applyContentInput(content *dbmodels.Content, entry *dbmodels.Entry, input ContentInput) error {
	if err := validateContentInput(content, input); err != nil {
		return err
	}

	preferredTitle := strings.TrimSpace(input.PreferredTitle)
	if preferredTitle == "" {
		preferredTitle = buildContentPreferredTitle(content, input)
	}
	if preferredTitle == "" {
		return validationErrorf("Kurztitel ist erforderlich (Beitrag %s).", contentLabel(content))
	}

	content.SetPreferredTitle(preferredTitle)
	content.SetVariantTitle(strings.TrimSpace(input.VariantTitle))
	content.SetParallelTitle(strings.TrimSpace(input.ParallelTitle))
	content.SetTitleStmt(strings.TrimSpace(input.Title))
	content.SetSubtitleStmt(strings.TrimSpace(input.Subtitle))
	content.SetIncipitStmt(strings.TrimSpace(input.Incipit))
	content.SetResponsibilityStmt(strings.TrimSpace(input.Responsibility))
	content.SetPseudonym(input.Pseudonym)
	content.SetPlaceStmt(strings.TrimSpace(input.PlaceStatement))
	content.SetYear(entry.Year())
	content.SetExtent(strings.TrimSpace(input.Extent))
	content.SetLanguage(sanitizeStrings(input.Language))
	content.SetContentType(sanitizeStrings(input.ContentTypes))
	content.SetMusenalmType(sanitizeStrings(input.MusenalmTypes))
	content.SetMusenalmPagination(strings.TrimSpace(input.Pagination))
	if input.Numbering > 0 {
		content.SetNumbering(input.Numbering)
	}
	content.SetEntry(entry.Id)
	content.SetEditState(strings.TrimSpace(input.Status))
	content.SetComment(strings.TrimSpace(input.Comment))
	content.SetAnnotation(strings.TrimSpace(input.Annotation))
	if input.EditorID != "" {
		content.SetEditor(input.EditorID)
	}

	return nil
}

func validationErrorf(format string, args ...any) error {
	return &ValidationError{Message: fmt.Sprintf(format, args...)}
}

func conflictErrorf(format string, args ...any) error {
	return &ConflictError{Message: fmt.Sprintf(format, args...)}
}

func validateStatus(status string) error {
	status = strings.TrimSpace(status)
	if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
		return validationErrorf("Ungültiger Status.")
	}
	return nil
}

func validateRelationType(value string, allowed []string) error {
	value = strings.TrimSpace(value)
	if value == "" || !slices.Contains(allowed, value) {
		return validationErrorf("Ungültiger Beziehungstyp.")
	}
	return nil
}

func validateRelations(relations []RelationInput, allowed []string) error {
	for _, relation := range relations {
		if err := validateRelationType(relation.Type, allowed); err != nil {
			return err
		}
	}
	return nil
}

func validateAgentInput(input AgentInput) error {
	if strings.TrimSpace(input.Name) == "" {
		return validationErrorf("Name ist erforderlich.")
	}
	return validateStatus(input.Status)
}

func validatePlaceInput(input PlaceInput) error {
	if strings.TrimSpace(input.Name) == "" {
		return validationErrorf("Name ist erforderlich.")
	}
	return validateStatus(input.Status)
}

func validateSeriesInput(input SeriesInput) error {
	if strings.TrimSpace(input.Title) == "" {
		return validationErrorf("Reihentitel ist erforderlich.")
	}
	return validateStatus(input.Status)
}

func validateEntryInput(input EntryInput) error {
	if strings.TrimSpace(input.PreferredTitle) == "" {
		return validationErrorf("Kurztitel ist erforderlich.")
	}
	if strings.TrimSpace(input.PreferredSeriesID) == "" {
		return validationErrorf("Reihentitel ist erforderlich.")
	}
	if input.Year == nil {
		return validationErrorf("Jahr muss angegeben werden.")
	}
	return validateStatus(input.Status)
}

func validateEntrySeriesRelations(preferredSeriesID string, relations []EntrySeriesRelationInput, newRelations []EntrySeriesRelationInput) error {
	seriesTargetIDs := make(map[string]struct{}, len(relations)+len(newRelations))
	preferredSeriesID = strings.TrimSpace(preferredSeriesID)
	for _, relation := range append(append([]EntrySeriesRelationInput{}, relations...), newRelations...) {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		if _, exists := seriesTargetIDs[targetID]; exists {
			return validationErrorf("Doppelte Reihenverknüpfungen sind nicht erlaubt.")
		}
		if preferredSeriesID != "" && targetID == preferredSeriesID {
			return validationErrorf("Die bevorzugte Reihe darf nicht zusätzlich als weitere Reihenverknüpfung gesetzt sein.")
		}
		seriesTargetIDs[targetID] = struct{}{}
	}

	return nil
}

func validateContentInput(content *dbmodels.Content, input ContentInput) error {
	if err := validateStatus(input.Status); err != nil {
		if v, ok := err.(*ValidationError); ok {
			return validationErrorf("%s (Beitrag %s).", strings.TrimSuffix(v.Message, "."), contentLabel(content))
		}
		return err
	}
	if len(sanitizeStrings(input.MusenalmTypes)) == 0 {
		return validationErrorf("Musenalm-Typ ist erforderlich (Beitrag %s).", contentLabel(content))
	}
	return nil
}

func contentLabel(content *dbmodels.Content) string {
	if content == nil {
		return ""
	}
	if content.Numbering() > 0 {
		return fmt.Sprintf("%v", content.Numbering())
	}
	if strings.TrimSpace(content.Id) != "" {
		return content.Id
	}
	return "neu"
}

func agentHasEntryRelations(tx core.App, agentID string) (bool, error) {
	rels, err := dbmodels.REntriesAgents_Agent(tx, agentID)
	if err != nil {
		return false, err
	}
	return len(rels) > 0, nil
}

func agentHasContentRelations(tx core.App, agentID string) (bool, error) {
	rels, err := dbmodels.RContentsAgents_Agent(tx, agentID)
	if err != nil {
		return false, err
	}
	return len(rels) > 0, nil
}

func (s *Store) deleteAgentRelations(tx core.App, agentID string) error {
	entryRelations, err := dbmodels.REntriesAgents_Agent(tx, agentID)
	if err != nil {
		return err
	}
	entryTable := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)
	for _, relation := range entryRelations {
		record, err := tx.FindRecordById(entryTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	contentRelations, err := dbmodels.RContentsAgents_Agent(tx, agentID)
	if err != nil {
		return err
	}
	contentTable := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
	for _, relation := range contentRelations {
		record, err := tx.FindRecordById(contentTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) deleteEntryRelations(tx core.App, entryID string) error {
	seriesRelations, err := dbmodels.REntriesSeries_Entry(tx, entryID)
	if err != nil {
		return err
	}
	seriesTable := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)
	for _, relation := range seriesRelations {
		record, err := tx.FindRecordById(seriesTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	agentRelations, err := dbmodels.REntriesAgents_Entry(tx, entryID)
	if err != nil {
		return err
	}
	agentTable := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)
	for _, relation := range agentRelations {
		record, err := tx.FindRecordById(agentTable, relation.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}

	return nil
}

func (s *Store) deleteEntryItems(tx core.App, entryID string) error {
	items, err := dbmodels.Items_Entry(tx, entryID)
	if err != nil {
		return err
	}
	for _, item := range items {
		record, err := tx.FindRecordById(dbmodels.ITEMS_TABLE, item.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) deleteEntryContents(tx core.App, entryID string) error {
	contents, err := dbmodels.Contents_Entry(tx, entryID)
	if err != nil {
		return err
	}
	for _, content := range contents {
		if err := s.DeleteContent(tx, content, nil); err != nil {
			return err
		}
	}
	return nil
}

func (s *Store) preferredSeriesEntries(app core.App, seriesID string) ([]*dbmodels.Entry, error) {
	return dbmodels.Entries_Series(app, seriesID)
}

func nextMusenalmID(app core.App, table string) (int, error) {
	var record struct {
		MusenalmID int `db:"musenalm_id"`
	}

	err := app.RecordQuery(table).
		Select(dbmodels.MUSENALMID_FIELD).
		OrderBy(dbmodels.MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&record)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 1, nil
		}
		return 0, err
	}

	return record.MusenalmID + 1, nil
}

func globalNextContentMusenalmID(app core.App) (int, error) {
	nextContentID, err := nextMusenalmID(app, dbmodels.CONTENTS_TABLE)
	if err != nil {
		return 0, err
	}

	maxReservedID, err := dbmodels.MaxReservedContentMusenalmID(app)
	if err != nil {
		return 0, err
	}

	maxRedirectID, err := dbmodels.MaxContentPermalinkRedirectMusenalmID(app)
	if err != nil {
		return 0, err
	}

	nextID := nextContentID
	if maxReservedID+1 > nextID {
		nextID = maxReservedID + 1
	}
	if maxRedirectID+1 > nextID {
		nextID = maxRedirectID + 1
	}
	return nextID, nil
}

func (s *Store) allocateContentMusenalmID(tx core.App, entry *dbmodels.Entry) (int, error) {
	if entry == nil || strings.TrimSpace(entry.Id) == "" {
		return 0, validationErrorf("Band wurde nicht gefunden.")
	}

	reservation, err := dbmodels.ActiveContentNumberReservationForEntry(tx, entry.Id)
	if err != nil {
		return 0, err
	}
	if reservation == nil {
		return globalNextContentMusenalmID(tx)
	}

	for reservation.HasRemaining() {
		assignedID := reservation.NextMusenalmID()
		blocked, err := dbmodels.ContentPermalinkRedirectRangeBlocked(tx, assignedID, assignedID)
		if err != nil {
			return 0, err
		}
		if blocked {
			reservation.SetNextMusenalmID(assignedID + 1)
			continue
		}

		reservation.SetNextMusenalmID(assignedID + 1)
		if !reservation.HasRemaining() {
			reservation.SetActive(false)
		}
		if err := tx.Save(reservation); err != nil {
			return 0, err
		}

		return assignedID, nil
	}

	reservation.SetActive(false)
	if err := tx.Save(reservation); err != nil {
		return 0, err
	}
	return globalNextContentMusenalmID(tx)
}

func (s *Store) contentNumberRangeFitsForEntry(tx core.App, entryID string, startID, endID int) (bool, error) {
	if startID <= 0 || endID < startID {
		return false, nil
	}

	var row struct {
		Count int `db:"count"`
	}
	err := tx.DB().NewQuery(
		"SELECT COUNT(*) AS count FROM " + dbmodels.CONTENTS_TABLE + " WHERE " + dbmodels.MUSENALMID_FIELD + " BETWEEN {:start} AND {:end}",
	).Bind(dbx.Params{
		"start": startID,
		"end":   endID,
	}).One(&row)
	if err != nil {
		return false, err
	}
	if row.Count > 0 {
		return false, nil
	}

	redirectBlocked, err := dbmodels.ContentPermalinkRedirectRangeBlocked(tx, startID, endID)
	if err != nil {
		return false, err
	}
	if redirectBlocked {
		return false, nil
	}

	blocked, err := dbmodels.ReservationRangeBlockedForOtherEntries(tx, entryID, startID, endID)
	if err != nil {
		return false, err
	}
	return !blocked, nil
}

func sanitizeStrings(values []string) []string {
	seen := map[string]struct{}{}
	cleaned := make([]string, 0, len(values))
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		cleaned = append(cleaned, value)
	}
	return cleaned
}

func buildContentPreferredTitle(content *dbmodels.Content, input ContentInput) string {
	title := strings.TrimSpace(input.Title)
	if title == "" {
		title = strings.TrimSpace(content.TitleStmt())
	}
	if title != "" {
		return title
	}

	subtitle := strings.TrimSpace(input.Subtitle)
	if subtitle == "" {
		subtitle = strings.TrimSpace(content.SubtitleStmt())
	}
	if subtitle != "" {
		return subtitle
	}

	incipit := strings.TrimSpace(input.Incipit)
	if incipit == "" {
		incipit = strings.TrimSpace(content.IncipitStmt())
	}
	if incipit != "" {
		return incipit
	}

	types := sanitizeStrings(input.MusenalmTypes)
	if len(types) == 0 {
		types = sanitizeStrings(content.MusenalmType())
	}
	typeLabel := strings.Join(types, ", ")

	responsibility := strings.TrimSpace(input.Responsibility)
	if responsibility == "" {
		responsibility = strings.TrimSpace(content.ResponsibilityStmt())
	}
	if responsibility != "" && !strings.EqualFold(responsibility, "unbezeichnet") {
		if typeLabel != "" {
			return fmt.Sprintf("[%s] Unterzeichnet: %s", typeLabel, responsibility)
		}
		return fmt.Sprintf("Unterzeichnet: %s", responsibility)
	}

	extent := strings.TrimSpace(input.Extent)
	if extent == "" {
		extent = strings.TrimSpace(content.Extent())
	}
	if typeLabel == "" {
		typeLabel = "Beitrag"
	}
	if extent != "" {
		return fmt.Sprintf("[%s %s]", typeLabel, extent)
	}

	return fmt.Sprintf("[%s]", typeLabel)
}
