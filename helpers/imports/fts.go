package imports

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var (
	fts5Mu               sync.Mutex
	fts5Running          bool
	fts5Cancel           context.CancelFunc
	fts5RestartRequested bool
	fts5StatusMu         sync.RWMutex
	fts5StatusSnapshot   FTS5StatusSnapshot
	fts5SuppressSettings bool
)

type FTS5StatusSnapshot struct {
	Status  string
	Message string
	Error   string
	Done    int
	Total   int
}

func FTS5Status() (FTS5StatusSnapshot, bool) {
	fts5StatusMu.RLock()
	defer fts5StatusMu.RUnlock()
	if fts5StatusSnapshot.Status == "" {
		return FTS5StatusSnapshot{}, false
	}
	return fts5StatusSnapshot, true
}

func FTS5IsRunning() bool {
	fts5Mu.Lock()
	defer fts5Mu.Unlock()
	return fts5Running
}

func MarkInterruptedFTS5Rebuild(app core.App) {
	if app == nil {
		return
	}
	statusSetting, err := dbmodels.Settings_Key(app, "fts5_rebuild_status")
	if err != nil || statusSetting == nil {
		return
	}
	statusVal, ok := statusSetting.Value().(string)
	if !ok {
		statusVal = fmt.Sprintf("%v", statusSetting.Value())
	}
	status := strings.Trim(statusVal, "\"")
	if status != "running" && status != "restarting" {
		return
	}
	done := getSettingInt(app, "fts5_rebuild_done")
	total := getSettingInt(app, "fts5_rebuild_total")
	setFTS5RebuildState(app, "aborted", "Neuaufbau wurde unterbrochen.", done, total, "")
}

func StartFTS5Rebuild(app core.App, allowRestart bool) (string, error) {
	fts5Mu.Lock()
	if fts5Running {
		if allowRestart {
			fts5RestartRequested = true
			if fts5Cancel != nil {
				fts5Cancel()
			}
			done := getSettingInt(app, "fts5_rebuild_done")
			total := getSettingInt(app, "fts5_rebuild_total")
			setFTS5RebuildState(app, "running", "Neuaufbau wird neu gestartet.", done, total, "")
			fts5Mu.Unlock()
			return "restarting", nil
		}
		fts5Mu.Unlock()
		return "running", nil
	}
	ctx, cancel := context.WithCancel(context.Background())
	fts5Running = true
	fts5Cancel = cancel
	fts5RestartRequested = false
	fts5Mu.Unlock()

	go func() {
		app.Logger().Info("FTS5 rebuild started")
		err := rebuildFTSFromScratchWithContext(app, ctx)
		fts5Mu.Lock()
		restart := fts5RestartRequested
		fts5Running = false
		fts5Cancel = nil
		fts5RestartRequested = false
		fts5Mu.Unlock()

		if restart {
			app.Logger().Info("FTS5 rebuild restarting")
			_, _ = StartFTS5Rebuild(app, false)
			return
		}

		if errors.Is(err, context.Canceled) {
			app.Logger().Info("FTS5 rebuild canceled")
			return
		}
		if err != nil {
			app.Logger().Error("FTS5 rebuild failed", "error", err)
			return
		}
		app.Logger().Info("FTS5 rebuild finished")
	}()

	return "started", nil
}

func RebuildFTS(app core.App) error {
	return rebuildFTSWithContext(app, true, context.Background())
}

func RebuildFTSFromScratch(app core.App) error {
	return rebuildFTSFromScratchWithContext(app, context.Background())
}

func rebuildFTSFromScratchWithContext(app core.App, ctx context.Context) error {
	setFTS5RebuildState(app, "running", "Neuaufbau wird vorbereitet...", 0, 0, "")
	if err := checkFTS5Canceled(app, ctx, 0, 0); err != nil {
		return err
	}
	if err := dbmodels.DropFTS5Tables(app); err != nil {
		setFTS5RebuildState(app, "error", "Neuaufbau fehlgeschlagen.", 0, 0, err.Error())
		return err
	}
	if err := checkFTS5Canceled(app, ctx, 0, 0); err != nil {
		return err
	}
	if err := dbmodels.CreateFTS5Tables(app); err != nil {
		setFTS5RebuildState(app, "error", "Neuaufbau fehlgeschlagen.", 0, 0, err.Error())
		return err
	}

	if err := rebuildFTSWithContext(app, false, ctx); err != nil {
		return err
	}
	updateFTS5RebuildTimestamp(app)
	return nil
}

func rebuildFTSWithContext(app core.App, clearExisting bool, ctx context.Context) error {
	if clearExisting {
		if err := dbmodels.DeleteFTS5Data(app); err != nil {
			setFTS5RebuildState(app, "error", "Neuaufbau fehlgeschlagen.", 0, 0, err.Error())
			return err
		}
	}

	done := 0
	total := 0
	app.Logger().Info("FTS5 rebuild transaction start")
	setFTS5RebuildState(app, "running", "FTS5-Neuaufbau läuft.", 0, 0, "")
	_ = upsertSetting(app, "fts5_rebuild_started_at", types.NowDateTime())
	fts5StatusMu.Lock()
	fts5SuppressSettings = true
	fts5StatusMu.Unlock()
	defer func() {
		fts5StatusMu.Lock()
		fts5SuppressSettings = false
		fts5StatusMu.Unlock()
	}()
	txErr := app.RunInTransaction(func(txApp core.App) error {
		fail := func(err error, done, total int) error {
			setFTS5RebuildState(txApp, "error", "Neuaufbau fehlgeschlagen.", done, total, err.Error())
			return err
		}

		places := []*dbmodels.Place{}
		if err := txApp.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
			return fail(err, 0, 0)
		}
		agents := []*dbmodels.Agent{}
		if err := txApp.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
			return fail(err, 0, 0)
		}
		series := []*dbmodels.Series{}
		if err := txApp.RecordQuery(dbmodels.SERIES_TABLE).All(&series); err != nil {
			return fail(err, 0, 0)
		}
		items := []*dbmodels.Item{}
		if err := txApp.RecordQuery(dbmodels.ITEMS_TABLE).All(&items); err != nil {
			return fail(err, 0, 0)
		}
		entries := []*dbmodels.Entry{}
		if err := txApp.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
			return fail(err, 0, 0)
		}
		contents := []*dbmodels.Content{}
		if err := txApp.RecordQuery(dbmodels.CONTENTS_TABLE).All(&contents); err != nil {
			return fail(err, 0, 0)
		}

		entriesSeries := []*dbmodels.REntriesSeries{}
		if err := txApp.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)).All(&entriesSeries); err != nil {
			return fail(err, 0, 0)
		}
		entriesAgents := []*dbmodels.REntriesAgents{}
		if err := txApp.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).All(&entriesAgents); err != nil {
			return fail(err, 0, 0)
		}
		contentsAgents := []*dbmodels.RContentsAgents{}
		if err := txApp.RecordQuery(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)).All(&contentsAgents); err != nil {
			return fail(err, 0, 0)
		}

		total = len(places) + len(agents) + len(series) + len(items) + len(entries) + len(contents)
		done = 0
		setFTS5RebuildState(txApp, "running", "FTS5-Neuaufbau läuft.", done, total, "")
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return err
		}
		app.Logger().Info("FTS5 rebuild data loaded", "places", len(places), "agents", len(agents), "series", len(series), "items", len(items), "entries", len(entries), "contents", len(contents))

		placesById := map[string]*dbmodels.Place{}
		for _, place := range places {
			placesById[place.Id] = place
		}
		agentsById := map[string]*dbmodels.Agent{}
		for _, agent := range agents {
			agentsById[agent.Id] = agent
		}
		seriesById := map[string]*dbmodels.Series{}
		for _, s := range series {
			seriesById[s.Id] = s
		}
		entriesById := map[string]*dbmodels.Entry{}
		for _, entry := range entries {
			entriesById[entry.Id] = entry
		}

		entriesSeriesMap := map[string][]*dbmodels.Series{}
		for _, rel := range entriesSeries {
			if series := seriesById[rel.Series()]; series != nil {
				entriesSeriesMap[rel.Entry()] = append(entriesSeriesMap[rel.Entry()], series)
			}
		}
		entriesAgentsMap := map[string][]*dbmodels.Agent{}
		for _, rel := range entriesAgents {
			if agent := agentsById[rel.Agent()]; agent != nil {
				entriesAgentsMap[rel.Entry()] = append(entriesAgentsMap[rel.Entry()], agent)
			}
		}
		contentsAgentsMap := map[string][]*dbmodels.Agent{}
		for _, rel := range contentsAgents {
			if agent := agentsById[rel.Agent()]; agent != nil {
				contentsAgentsMap[rel.Content()] = append(contentsAgentsMap[rel.Content()], agent)
			}
		}

		builder := txApp.DB()
		batchSizeFor := func(fieldCount int) int {
			const maxParams = 900
			size := maxParams / (fieldCount + 1)
			if size < 1 {
				size = 1
			}
			return size
		}

		app.Logger().Info("FTS5 rebuild insert places", "count", len(places))
		placeBatchSize := batchSizeFor(len(dbmodels.PLACES_FTS5_FIELDS))
		placeRows := make([]dbmodels.FTS5Row, 0, placeBatchSize)
		for _, place := range places {
			if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
				return err
			}
			placeRows = append(placeRows, dbmodels.FTS5Row{Id: place.Id, Values: dbmodels.FTS5ValuesPlace(place)})
			done++
			maybeUpdateFTS5Progress(app, ctx, done, total)
			if len(placeRows) >= placeBatchSize {
				if err := dbmodels.InsertFTS5Batch(builder, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS, placeRows); err != nil {
					return fail(err, done, total)
				}
				placeRows = placeRows[:0]
			}
		}
		if len(placeRows) > 0 {
			if err := dbmodels.InsertFTS5Batch(builder, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS, placeRows); err != nil {
				return fail(err, done, total)
			}
		}

		app.Logger().Info("FTS5 rebuild insert agents", "count", len(agents))
		agentBatchSize := batchSizeFor(len(dbmodels.AGENTS_FTS5_FIELDS))
		agentRows := make([]dbmodels.FTS5Row, 0, agentBatchSize)
		for _, agent := range agents {
			if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
				return err
			}
			agentRows = append(agentRows, dbmodels.FTS5Row{Id: agent.Id, Values: dbmodels.FTS5ValuesAgent(agent)})
			done++
			maybeUpdateFTS5Progress(app, ctx, done, total)
			if len(agentRows) >= agentBatchSize {
				if err := dbmodels.InsertFTS5Batch(builder, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS, agentRows); err != nil {
					return fail(err, done, total)
				}
				agentRows = agentRows[:0]
			}
		}
		if len(agentRows) > 0 {
			if err := dbmodels.InsertFTS5Batch(builder, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS, agentRows); err != nil {
				return fail(err, done, total)
			}
		}

		app.Logger().Info("FTS5 rebuild insert series", "count", len(series))
		seriesBatchSize := batchSizeFor(len(dbmodels.SERIES_FTS5_FIELDS))
		seriesRows := make([]dbmodels.FTS5Row, 0, seriesBatchSize)
		for _, s := range series {
			if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
				return err
			}
			seriesRows = append(seriesRows, dbmodels.FTS5Row{Id: s.Id, Values: dbmodels.FTS5ValuesSeries(s)})
			done++
			maybeUpdateFTS5Progress(app, ctx, done, total)
			if len(seriesRows) >= seriesBatchSize {
				if err := dbmodels.InsertFTS5Batch(builder, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS, seriesRows); err != nil {
					return fail(err, done, total)
				}
				seriesRows = seriesRows[:0]
			}
		}
		if len(seriesRows) > 0 {
			if err := dbmodels.InsertFTS5Batch(builder, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS, seriesRows); err != nil {
				return fail(err, done, total)
			}
		}

		app.Logger().Info("FTS5 rebuild insert items", "count", len(items))
		itemBatchSize := batchSizeFor(len(dbmodels.ITEMS_FTS5_FIELDS))
		itemRows := make([]dbmodels.FTS5Row, 0, itemBatchSize)
		for _, item := range items {
			if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
				return err
			}
			itemRows = append(itemRows, dbmodels.FTS5Row{Id: item.Id, Values: dbmodels.FTS5ValuesItem(item)})
			done++
			maybeUpdateFTS5Progress(app, ctx, done, total)
			if len(itemRows) >= itemBatchSize {
				if err := dbmodels.InsertFTS5Batch(builder, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS, itemRows); err != nil {
					return fail(err, done, total)
				}
				itemRows = itemRows[:0]
			}
		}
		if len(itemRows) > 0 {
			if err := dbmodels.InsertFTS5Batch(builder, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS, itemRows); err != nil {
				return fail(err, done, total)
			}
		}

		app.Logger().Info("FTS5 rebuild insert entries", "count", len(entries))
		entryBatchSize := batchSizeFor(len(dbmodels.ENTRIES_FTS5_FIELDS))
		entryRows := make([]dbmodels.FTS5Row, 0, entryBatchSize)
		for _, entry := range entries {
			if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
				return err
			}
			entryPlaces := []*dbmodels.Place{}
			for _, placeId := range entry.Places() {
				if place := placesById[placeId]; place != nil {
					entryPlaces = append(entryPlaces, place)
				}
			}
			entryAgents := entriesAgentsMap[entry.Id]
			entrySeries := entriesSeriesMap[entry.Id]
			entryRows = append(entryRows, dbmodels.FTS5Row{
				Id:     entry.Id,
				Values: dbmodels.FTS5ValuesEntry(entry, entryPlaces, entryAgents, entrySeries),
			})
			done++
			maybeUpdateFTS5Progress(app, ctx, done, total)
			if len(entryRows) >= entryBatchSize {
				if err := dbmodels.InsertFTS5Batch(builder, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS, entryRows); err != nil {
					return fail(err, done, total)
				}
				entryRows = entryRows[:0]
			}
		}
		if len(entryRows) > 0 {
			if err := dbmodels.InsertFTS5Batch(builder, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS, entryRows); err != nil {
				return fail(err, done, total)
			}
		}

		app.Logger().Info("FTS5 rebuild insert contents", "count", len(contents))
		contentBatchSize := batchSizeFor(len(dbmodels.CONTENTS_FTS5_FIELDS))
		contentRows := make([]dbmodels.FTS5Row, 0, contentBatchSize)
		for _, content := range contents {
			if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
				return err
			}
			entry := entriesById[content.Entry()]
			contentAgents := contentsAgentsMap[content.Id]
			contentRows = append(contentRows, dbmodels.FTS5Row{
				Id:     content.Id,
				Values: dbmodels.FTS5ValuesContent(content, entry, contentAgents),
			})
			done++
			maybeUpdateFTS5Progress(app, ctx, done, total)
			if len(contentRows) >= contentBatchSize {
				if err := dbmodels.InsertFTS5Batch(builder, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS, contentRows); err != nil {
					return fail(err, done, total)
				}
				contentRows = contentRows[:0]
			}
		}
		if len(contentRows) > 0 {
			if err := dbmodels.InsertFTS5Batch(builder, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS, contentRows); err != nil {
				return fail(err, done, total)
			}
		}

		return nil
	})

	if txErr != nil {
		app.Logger().Error("FTS5 rebuild transaction failed", "error", txErr)
		setFTS5RebuildState(app, "error", "Neuaufbau fehlgeschlagen.", done, total, txErr.Error())
		return txErr
	}
	app.Logger().Info("FTS5 rebuild transaction complete")
	setFTS5RebuildState(app, "complete", "FTS5-Neuaufbau abgeschlossen.", done, total, "")
	return nil
}

func maybeUpdateFTS5Progress(app core.App, ctx context.Context, done, total int) {
	if total <= 0 {
		return
	}
	if done%100 == 0 || done == total {
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return
		}
		setFTS5RebuildState(app, "running", "FTS5-Neuaufbau läuft.", done, total, "")
	}
}

func checkFTS5Canceled(app core.App, ctx context.Context, done, total int) error {
	if ctx == nil {
		return nil
	}
	select {
	case <-ctx.Done():
		setFTS5RebuildState(app, "aborted", "Neuaufbau abgebrochen.", done, total, "")
		return ctx.Err()
	default:
		return nil
	}
}

func updateFTS5RebuildTimestamp(app core.App) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.SETTINGS_TABLE)
	if err != nil {
		app.Logger().Error("Failed to load settings collection for FTS5 timestamp", "error", err)
		return
	}

	var record *core.Record
	existing, err := dbmodels.Settings_Key(app, "fts5_last_rebuild")
	if err == nil && existing != nil {
		record = existing.ProxyRecord()
	} else if err != nil {
		if !isRecordNotFound(err) {
			app.Logger().Error("Failed to load FTS5 timestamp setting", "error", err)
			return
		}
	}
	if record == nil {
		record = core.NewRecord(collection)
	}

	record.Set(dbmodels.KEY_FIELD, "fts5_last_rebuild")
	record.Set(dbmodels.VALUE_FIELD, types.NowDateTime())
	if err := app.Save(record); err != nil {
		app.Logger().Error("Failed to save FTS5 timestamp", "error", err)
	}
}

func isRecordNotFound(err error) bool {
	if err == nil {
		return false
	}
	msg := err.Error()
	return strings.Contains(msg, "no rows in result set") || strings.Contains(msg, "not found")
}

func setFTS5RebuildState(app core.App, status, message string, done, total int, errMsg string) {
	fts5StatusMu.Lock()
	fts5StatusSnapshot = FTS5StatusSnapshot{
		Status:  status,
		Message: message,
		Error:   errMsg,
		Done:    done,
		Total:   total,
	}
	suppress := fts5SuppressSettings
	fts5StatusMu.Unlock()

	if suppress || app.IsTransactional() {
		return
	}

	_ = upsertSetting(app, "fts5_rebuild_status", status)
	_ = upsertSetting(app, "fts5_rebuild_message", message)
	_ = upsertSetting(app, "fts5_rebuild_done", done)
	_ = upsertSetting(app, "fts5_rebuild_total", total)
	if errMsg != "" {
		_ = upsertSetting(app, "fts5_rebuild_error", errMsg)
	} else {
		_ = upsertSetting(app, "fts5_rebuild_error", "")
	}
}

func upsertSetting(app core.App, key string, value any) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.SETTINGS_TABLE)
	if err != nil {
		return err
	}

	var record *core.Record
	existing, err := dbmodels.Settings_Key(app, key)
	if err == nil && existing != nil {
		record = existing.ProxyRecord()
	} else if err != nil {
		if !isRecordNotFound(err) {
			return err
		}
	}
	if record == nil {
		record = core.NewRecord(collection)
	}
	record.Set(dbmodels.KEY_FIELD, key)
	record.Set(dbmodels.VALUE_FIELD, value)
	return app.Save(record)
}

func getSettingInt(app core.App, key string) int {
	setting, err := dbmodels.Settings_Key(app, key)
	if err != nil || setting == nil {
		return 0
	}
	switch v := setting.Value().(type) {
	case float64:
		return int(v)
	case int:
		return v
	case int64:
		return int(v)
	case string:
		if parsed, err := strconv.Atoi(v); err == nil {
			return parsed
		}
	default:
		if parsed, err := strconv.Atoi(fmt.Sprintf("%v", v)); err == nil {
			return parsed
		}
	}
	return 0
}
