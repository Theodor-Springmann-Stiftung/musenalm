package controllers

import (
	"fmt"
	"net/http"
	"slices"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/functions"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	preferredSeriesRelationType = "Bevorzugter Reihentitel"
)

func init() {
	ep := &AlmanachEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_ALMANACH_EDIT_NAME,
			URL:      URL_ALMANACH_EDIT,
			Template: TEMPLATE_ALMANACH_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(ep)
}

type AlmanachEditPage struct {
	pagemodels.StaticPage
}

func (p *AlmanachEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_ALMANACH_ADMIN_BASE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_ALMANACH_EDIT, p.GET(engine, app))
	rg.POST(URL_ALMANACH_EDIT+"save", p.POSTSave(engine, app, ia))
	rg.POST(URL_ALMANACH_EDIT+"delete", p.POSTDelete(engine, app, ia))
	return nil
}

func (p *AlmanachEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)
		data := make(map[string]any)
		filters := NewBeitraegeFilterParameters(e)
		result, err := NewAlmanachEditResult(app, id, filters)
		if err != nil {
			engine.Response404(e, err, nil)
		}
		data["result"] = result
		data["filters"] = filters
		data["csrf_token"] = req.Session().Token
		data["item_types"] = dbmodels.ITEM_TYPE_VALUES
		data["agent_relations"] = dbmodels.AGENT_RELATIONS
		data["series_relations"] = dbmodels.SERIES_RELATIONS
		data["cancel_url"] = cancelURLFromHeader(e)

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

type AlmanachEditResult struct {
	NextByID    *dbmodels.Entry
	PrevByID    *dbmodels.Entry
	NextByTitle *dbmodels.Entry
	PrevByTitle *dbmodels.Entry
	User        *dbmodels.User
	AlmanachResult
}

func NewAlmanachEditResult(app core.App, id string, filters BeitraegeFilterParameters) (*AlmanachEditResult, error) {
	result, err := NewAlmanachResult(app, id, filters)
	if err != nil {
		return nil, err
	}

	var user *dbmodels.User
	if result.Entry.Editor() != "" {
		u, err := dbmodels.Users_ID(app, result.Entry.Editor())
		if err == nil {
			user = u
		} else {
			app.Logger().Error("Failed to load user for entry editor", "entry", result.Entry.Id, "error", err)
		}
	}

	prevByID := result.Entry.Prev(app)
	nextByID := result.Entry.Next(app)
	prevByTitle, nextByTitle, err := entryNeighborsByPreferredTitle(app, result.Entry.Id)
	if err != nil {
		app.Logger().Error("Failed to load entry neighbors", "entry", result.Entry.Id, "error", err)
	}

	return &AlmanachEditResult{
		User:           user,
		AlmanachResult: *result,
		NextByID:       nextByID,
		PrevByID:       prevByID,
		NextByTitle:    nextByTitle,
		PrevByTitle:    prevByTitle,
	}, nil
}

func (p *AlmanachEditPage) POSTSave(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := almanachEditPayload{}
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültige Formulardaten.",
			})
		}

		if err := req.CheckCSRF(payload.CSRFToken); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": err.Error(),
			})
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Band wurde nicht gefunden.",
			})
		}

		if err := payload.Validate(); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": err.Error(),
			})
		}

		if payload.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(payload.LastEdited)
			if err != nil {
				return e.JSON(http.StatusBadRequest, map[string]any{
					"error": "Ungültiger Bearbeitungszeitstempel.",
				})
			}
			if !entry.Updated().Time().Equal(lastEdited.Time()) {
				return e.JSON(http.StatusConflict, map[string]any{
					"error": "Der Eintrag wurde inzwischen geändert. Bitte Seite neu laden.",
				})
			}
		}

		// Capture old values that affect content FTS5 records
		oldPreferredTitle := entry.PreferredTitle()
		oldYear := entry.Year()

		// Check if agent relations will change (affects contents)
		agentRelationsChanged := len(payload.NewAgentRelations) > 0 || len(payload.DeletedAgentRelationIDs) > 0

		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			if err := applyEntryChanges(tx, entry, &payload, user); err != nil {
				return err
			}
			if err := applyItemsChanges(tx, entry, &payload); err != nil {
				return err
			}
			if err := applySeriesRelations(tx, entry, &payload); err != nil {
				return err
			}
			if err := applyAgentRelations(tx, entry, &payload); err != nil {
				return err
			}
			return nil
		}); err != nil {
			app.Logger().Error("Failed to save almanach entry", "entry_id", entry.Id, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Speichern fehlgeschlagen.",
			})
		}

		// Invalidate sorted entries cache since entry was modified
		InvalidateSortedEntriesCache()

		// Invalidate Bände cache since entry was modified
		ma.ResetBaendeCache()

		// Check if fields that affect contents changed
		contentsNeedUpdate := entry.PreferredTitle() != oldPreferredTitle ||
			entry.Year() != oldYear ||
			agentRelationsChanged

		// Update FTS5 index asynchronously
		go func(appInstance core.App, entryID string, updateContents bool) {
			freshEntry, err := dbmodels.Entries_ID(appInstance, entryID)
			if err != nil {
				appInstance.Logger().Error("Failed to load entry for FTS5 update", "entry_id", entryID, "error", err)
				return
			}
			if err := updateEntryFTS5WithContents(appInstance, freshEntry, updateContents); err != nil {
				appInstance.Logger().Error("Failed to update FTS5 index for entry", "entry_id", entryID, "error", err)
			}
		}(app, entry.Id, contentsNeedUpdate)

		freshEntry, err := dbmodels.Entries_MusenalmID(app, id)
		if err == nil {
			entry = freshEntry
		}

		updatedInfo := map[string]string{
			"raw":  entry.Updated().Time().Format(time.RFC3339Nano),
			"date": functions.GermanDate(entry.Updated()),
			"time": functions.GermanTime(entry.Updated()),
		}
		if user != nil && strings.TrimSpace(user.Name) != "" {
			updatedInfo["user"] = user.Name
		}

		setFlashSuccess(e, "Änderungen gespeichert.")
		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"message":  "Änderungen gespeichert.",
			"updated":  updatedInfo,
			"redirect": fmt.Sprintf(URL_ALMANACH_VIEW_FORMAT, id),
		})
	}
}

func (p *AlmanachEditPage) POSTDelete(engine *templating.Engine, app core.App, ma pagemodels.IApp) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := almanachDeletePayload{}
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültige Formulardaten.",
			})
		}

		if err := req.CheckCSRF(payload.CSRFToken); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": err.Error(),
			})
		}

		entry, err := dbmodels.Entries_MusenalmID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Band wurde nicht gefunden.",
			})
		}

		if payload.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(payload.LastEdited)
			if err != nil {
				return e.JSON(http.StatusBadRequest, map[string]any{
					"error": "Ungültiger Bearbeitungszeitstempel.",
				})
			}
			if !entry.Updated().Time().Equal(lastEdited.Time()) {
				return e.JSON(http.StatusConflict, map[string]any{
					"error": "Der Eintrag wurde inzwischen geändert. Bitte Seite neu laden.",
				})
			}
		}

		if err := app.RunInTransaction(func(tx core.App) error {
			if err := deleteEntryRelations(tx, entry.Id); err != nil {
				return err
			}
			if err := deleteEntryItems(tx, entry.Id); err != nil {
				return err
			}
			if err := deleteEntryContents(tx, entry.Id); err != nil {
				return err
			}
			record, err := tx.FindRecordById(dbmodels.ENTRIES_TABLE, entry.Id)
			if err != nil {
				return err
			}
			return tx.Delete(record)
		}); err != nil {
			app.Logger().Error("Failed to delete almanach entry", "entry_id", entry.Id, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Löschen fehlgeschlagen.",
			})
		}

		// Invalidate sorted entries cache since entry was deleted
		InvalidateSortedEntriesCache()

		// Invalidate Bände cache since entry was deleted
		ma.ResetBaendeCache()

		// Delete from FTS5 index asynchronously
		go func(appInstance core.App, entryID string) {
			if err := dbmodels.DeleteFTS5Entry(appInstance, entryID); err != nil {
				appInstance.Logger().Error("Failed to delete FTS5 entry", "entry_id", entryID, "error", err)
			}
		}(app, entry.Id)

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": URL_ALMANACH_REIHEN_REDIRECT,
		})
	}
}

type almanachEditPayload struct {
	CSRFToken                string                       `json:"csrf_token"`
	LastEdited               string                       `json:"last_edited"`
	Entry                    almanachEntryPayload         `json:"entry"`
	Languages                []string                     `json:"languages"`
	Places                   []string                     `json:"places"`
	Items                    []almanachItemPayload        `json:"items"`
	DeletedItemIDs           []string                     `json:"deleted_item_ids"`
	SeriesRelations          []almanachRelationPayload    `json:"series_relations"`
	NewSeriesRelations       []almanachNewRelationPayload `json:"new_series_relations"`
	DeletedSeriesRelationIDs []string                     `json:"deleted_series_relation_ids"`
	AgentRelations           []almanachRelationPayload    `json:"agent_relations"`
	NewAgentRelations        []almanachNewRelationPayload `json:"new_agent_relations"`
	DeletedAgentRelationIDs  []string                     `json:"deleted_agent_relation_ids"`
}

type almanachDeletePayload struct {
	CSRFToken  string `json:"csrf_token" form:"csrf_token"`
	LastEdited string `json:"last_edited" form:"last_edited"`
}

type almanachEntryPayload struct {
	PreferredTitle          string `json:"preferred_title"`
	Title                   string `json:"title"`
	ParallelTitle           string `json:"parallel_title"`
	Subtitle                string `json:"subtitle"`
	VariantTitle            string `json:"variant_title"`
	Incipit                 string `json:"incipit"`
	ResponsibilityStatement string `json:"responsibility_statement"`
	PublicationStatement    string `json:"publication_statement"`
	PlaceStatement          string `json:"place_statement"`
	Edition                 string `json:"edition"`
	Annotation              string `json:"annotation"`
	EditComment             string `json:"edit_comment"`
	Extent                  string `json:"extent"`
	Dimensions              string `json:"dimensions"`
	References              string `json:"references"`
	Status                  string `json:"status"`
	Year                    *int   `json:"year"`
}

type almanachItemPayload struct {
	ID         string   `json:"id"`
	Owner      string   `json:"owner"`
	Identifier string   `json:"identifier"`
	Location   string   `json:"location"`
	Media      []string `json:"media"`
	Annotation string   `json:"annotation"`
	URI        string   `json:"uri"`
}

type almanachRelationPayload struct {
	ID        string `json:"id"`
	TargetID  string `json:"target_id"`
	Type      string `json:"type"`
	Uncertain bool   `json:"uncertain"`
}

type almanachNewRelationPayload struct {
	TargetID  string `json:"target_id"`
	Type      string `json:"type"`
	Uncertain bool   `json:"uncertain"`
}

func (payload *almanachEditPayload) Validate() error {
	payload.Entry.Status = strings.TrimSpace(payload.Entry.Status)
	if strings.TrimSpace(payload.Entry.PreferredTitle) == "" {
		return fmt.Errorf("kurztitel ist erforderlich")
	}
	if payload.Entry.Year == nil {
		return fmt.Errorf("jahr muss angegeben werden")
	}
	if payload.Entry.Status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, payload.Entry.Status) {
		return fmt.Errorf("ungültiger status")
	}
	for _, relation := range payload.SeriesRelations {
		if err := validateRelationType(relation.Type, dbmodels.SERIES_RELATIONS); err != nil {
			return err
		}
	}
	for _, relation := range payload.NewSeriesRelations {
		if err := validateRelationType(relation.Type, dbmodels.SERIES_RELATIONS); err != nil {
			return err
		}
	}
	for _, relation := range payload.AgentRelations {
		if err := validateRelationType(relation.Type, dbmodels.AGENT_RELATIONS); err != nil {
			return err
		}
	}
	for _, relation := range payload.NewAgentRelations {
		if err := validateRelationType(relation.Type, dbmodels.AGENT_RELATIONS); err != nil {
			return err
		}
	}

	preferredCount := 0
	for _, relation := range payload.SeriesRelations {
		if strings.TrimSpace(relation.Type) == preferredSeriesRelationType {
			preferredCount++
		}
	}
	for _, relation := range payload.NewSeriesRelations {
		if strings.TrimSpace(relation.Type) == preferredSeriesRelationType {
			preferredCount++
		}
	}
	if preferredCount == 0 {
		return fmt.Errorf("mindestens ein bevorzugter reihentitel muss verknüpft sein")
	}
	if preferredCount > 1 {
		return fmt.Errorf("es darf nur ein bevorzugter reihentitel gesetzt sein")
	}

	// Check for duplicate series relations
	seriesTargetIDs := make(map[string]bool)
	for _, relation := range payload.SeriesRelations {
		if seriesTargetIDs[relation.TargetID] {
			return fmt.Errorf("doppelte reihenverknüpfungen sind nicht erlaubt")
		}
		seriesTargetIDs[relation.TargetID] = true
	}
	for _, relation := range payload.NewSeriesRelations {
		if seriesTargetIDs[relation.TargetID] {
			return fmt.Errorf("doppelte reihenverknüpfungen sind nicht erlaubt")
		}
		seriesTargetIDs[relation.TargetID] = true
	}

	return nil
}

func validateRelationType(value string, allowed []string) error {
	value = strings.TrimSpace(value)
	if value == "" {
		return fmt.Errorf("ungültiger beziehungstyp")
	}
	if !slices.Contains(allowed, value) {
		return fmt.Errorf("ungültiger beziehungstyp")
	}
	return nil
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

func applyEntryChanges(tx core.App, entry *dbmodels.Entry, payload *almanachEditPayload, user *dbmodels.FixedUser) error {
	entry.SetPreferredTitle(strings.TrimSpace(payload.Entry.PreferredTitle))
	entry.SetTitleStmt(strings.TrimSpace(payload.Entry.Title))
	entry.SetParallelTitle(strings.TrimSpace(payload.Entry.ParallelTitle))
	entry.SetSubtitleStmt(strings.TrimSpace(payload.Entry.Subtitle))
	entry.SetVariantTitle(strings.TrimSpace(payload.Entry.VariantTitle))
	entry.SetIncipitStmt(strings.TrimSpace(payload.Entry.Incipit))
	entry.SetResponsibilityStmt(strings.TrimSpace(payload.Entry.ResponsibilityStatement))
	entry.SetPublicationStmt(strings.TrimSpace(payload.Entry.PublicationStatement))
	entry.SetPlaceStmt(strings.TrimSpace(payload.Entry.PlaceStatement))
	entry.SetEdition(strings.TrimSpace(payload.Entry.Edition))
	entry.SetAnnotation(strings.TrimSpace(payload.Entry.Annotation))
	entry.SetComment(strings.TrimSpace(payload.Entry.EditComment))
	entry.SetExtent(strings.TrimSpace(payload.Entry.Extent))
	entry.SetDimensions(strings.TrimSpace(payload.Entry.Dimensions))
	entry.SetReferences(strings.TrimSpace(payload.Entry.References))
	entry.SetYear(*payload.Entry.Year)
	entry.SetEditState(payload.Entry.Status)
	entry.SetLanguage(sanitizeStrings(payload.Languages))
	entry.SetPlaces(sanitizeStrings(payload.Places))
	if user != nil {
		entry.SetEditor(user.Id)
	}
	return tx.Save(entry)
}

func applyItemsChanges(tx core.App, entry *dbmodels.Entry, payload *almanachEditPayload) error {
	var itemsCollection *core.Collection
	getItemsCollection := func() (*core.Collection, error) {
		if itemsCollection != nil {
			return itemsCollection, nil
		}
		collection, err := tx.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
		if err != nil {
			return nil, err
		}
		itemsCollection = collection
		return itemsCollection, nil
	}

	for _, itemPayload := range payload.Items {
		itemID := strings.TrimSpace(itemPayload.ID)
		var item *dbmodels.Item
		if itemID != "" {
			record, err := tx.FindRecordById(dbmodels.ITEMS_TABLE, itemID)
			if err != nil {
				return err
			}
			item = dbmodels.NewItem(record)
			if item.Entry() != entry.Id {
				return fmt.Errorf("exemplar %s gehört zu einem anderen eintrag", itemID)
			}
		} else {
			collection, err := getItemsCollection()
			if err != nil {
				return err
			}
			item = dbmodels.NewItem(core.NewRecord(collection))
		}

		item.SetEntry(entry.Id)
		item.SetOwner(strings.TrimSpace(itemPayload.Owner))
		item.SetIdentifier(strings.TrimSpace(itemPayload.Identifier))
		item.SetLocation(strings.TrimSpace(itemPayload.Location))
		item.SetAnnotation(strings.TrimSpace(itemPayload.Annotation))
		item.SetUri(strings.TrimSpace(itemPayload.URI))
		item.SetMedia(sanitizeStrings(itemPayload.Media))

		if err := tx.Save(item); err != nil {
			return err
		}
	}

	for _, id := range payload.DeletedItemIDs {
		itemID := strings.TrimSpace(id)
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

func applySeriesRelations(tx core.App, entry *dbmodels.Entry, payload *almanachEditPayload) error {
	tableName := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		col, err := tx.FindCollectionByNameOrId(tableName)
		if err != nil {
			return nil, err
		}
		collection = col
		return collection, nil
	}

	for _, relation := range payload.SeriesRelations {
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
			return fmt.Errorf("relation %s gehört zu einem anderen eintrag", relationID)
		}
		proxy.SetEntry(entry.Id)
		proxy.SetSeries(strings.TrimSpace(relation.TargetID))
		proxy.SetType(strings.TrimSpace(relation.Type))
		proxy.SetUncertain(relation.Uncertain)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	for _, relationID := range payload.DeletedSeriesRelationIDs {
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

	for _, relation := range payload.NewSeriesRelations {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		col, err := getCollection()
		if err != nil {
			return err
		}
		proxy := dbmodels.NewREntriesSeries(core.NewRecord(col))
		proxy.SetEntry(entry.Id)
		proxy.SetSeries(targetID)
		proxy.SetType(strings.TrimSpace(relation.Type))
		proxy.SetUncertain(relation.Uncertain)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	return nil
}

func applyAgentRelations(tx core.App, entry *dbmodels.Entry, payload *almanachEditPayload) error {
	tableName := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)
	var collection *core.Collection
	getCollection := func() (*core.Collection, error) {
		if collection != nil {
			return collection, nil
		}
		col, err := tx.FindCollectionByNameOrId(tableName)
		if err != nil {
			return nil, err
		}
		collection = col
		return collection, nil
	}

	for _, relation := range payload.AgentRelations {
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
			return fmt.Errorf("relation %s gehört zu einem anderen eintrag", relationID)
		}
		proxy.SetEntry(entry.Id)
		proxy.SetAgent(strings.TrimSpace(relation.TargetID))
		proxy.SetType(strings.TrimSpace(relation.Type))
		proxy.SetUncertain(relation.Uncertain)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	for _, relationID := range payload.DeletedAgentRelationIDs {
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

	for _, relation := range payload.NewAgentRelations {
		targetID := strings.TrimSpace(relation.TargetID)
		if targetID == "" {
			continue
		}
		col, err := getCollection()
		if err != nil {
			return err
		}
		proxy := dbmodels.NewREntriesAgents(core.NewRecord(col))
		proxy.SetEntry(entry.Id)
		proxy.SetAgent(targetID)
		proxy.SetType(strings.TrimSpace(relation.Type))
		proxy.SetUncertain(relation.Uncertain)
		if err := tx.Save(proxy); err != nil {
			return err
		}
	}

	return nil
}

func deleteEntryRelations(tx core.App, entryID string) error {
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

func deleteEntryItems(tx core.App, entryID string) error {
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

func deleteEntryContents(tx core.App, entryID string) error {
	contents, err := dbmodels.Contents_Entry(tx, entryID)
	if err != nil {
		return err
	}
	relationsTable := dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)
	for _, content := range contents {
		contentRelations, err := dbmodels.RContentsAgents_Content(tx, content.Id)
		if err != nil {
			return err
		}
		for _, relation := range contentRelations {
			record, err := tx.FindRecordById(relationsTable, relation.Id)
			if err != nil {
				continue
			}
			if err := tx.Delete(record); err != nil {
				return err
			}
		}
		record, err := tx.FindRecordById(dbmodels.CONTENTS_TABLE, content.Id)
		if err != nil {
			continue
		}
		if err := tx.Delete(record); err != nil {
			return err
		}
	}
	return nil
}
