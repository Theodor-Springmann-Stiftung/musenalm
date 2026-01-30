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
)

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
		err := rebuildFTSFromScratchWithContext(app, ctx)
		fts5Mu.Lock()
		restart := fts5RestartRequested
		fts5Running = false
		fts5Cancel = nil
		fts5RestartRequested = false
		fts5Mu.Unlock()

		if restart {
			_, _ = StartFTS5Rebuild(app, false)
			return
		}

		if errors.Is(err, context.Canceled) {
			return
		}
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
	fail := func(err error, done, total int) error {
		setFTS5RebuildState(app, "error", "Neuaufbau fehlgeschlagen.", done, total, err.Error())
		return err
	}

	if clearExisting {
		if err := dbmodels.DeleteFTS5Data(app); err != nil {
			return fail(err, 0, 0)
		}
	}

	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return fail(err, 0, 0)
	}
	agents := []*dbmodels.Agent{}
	if err := app.RecordQuery(dbmodels.AGENTS_TABLE).All(&agents); err != nil {
		return fail(err, 0, 0)
	}
	series := []*dbmodels.Series{}
	if err := app.RecordQuery(dbmodels.SERIES_TABLE).All(&series); err != nil {
		return fail(err, 0, 0)
	}
	items := []*dbmodels.Item{}
	if err := app.RecordQuery(dbmodels.ITEMS_TABLE).All(&items); err != nil {
		return fail(err, 0, 0)
	}
	entries := []*dbmodels.Entry{}
	if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return fail(err, 0, 0)
	}
	contents := []*dbmodels.Content{}
	if err := app.RecordQuery(dbmodels.CONTENTS_TABLE).All(&contents); err != nil {
		return fail(err, 0, 0)
	}

	entriesSeries := []*dbmodels.REntriesSeries{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)).All(&entriesSeries); err != nil {
		return fail(err, 0, 0)
	}
	entriesAgents := []*dbmodels.REntriesAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).All(&entriesAgents); err != nil {
		return fail(err, 0, 0)
	}
	contentsAgents := []*dbmodels.RContentsAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)).All(&contentsAgents); err != nil {
		return fail(err, 0, 0)
	}

	total := len(places) + len(agents) + len(series) + len(items) + len(entries) + len(contents)
	done := 0
	setFTS5RebuildState(app, "running", "FTS5-Neuaufbau läuft.", done, total, "")
	if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
		return err
	}

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

	qp := dbmodels.FTS5InsertQuery(app, dbmodels.PLACES_TABLE, dbmodels.PLACES_FTS5_FIELDS)
	qa := dbmodels.FTS5InsertQuery(app, dbmodels.AGENTS_TABLE, dbmodels.AGENTS_FTS5_FIELDS)
	qs := dbmodels.FTS5InsertQuery(app, dbmodels.SERIES_TABLE, dbmodels.SERIES_FTS5_FIELDS)
	qi := dbmodels.FTS5InsertQuery(app, dbmodels.ITEMS_TABLE, dbmodels.ITEMS_FTS5_FIELDS)
	qe := dbmodels.FTS5InsertQuery(app, dbmodels.ENTRIES_TABLE, dbmodels.ENTRIES_FTS5_FIELDS)
	qc := dbmodels.FTS5InsertQuery(app, dbmodels.CONTENTS_TABLE, dbmodels.CONTENTS_FTS5_FIELDS)

	for _, place := range places {
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return err
		}
		if err := dbmodels.BulkInsertFTS5Place(qp, place); err != nil {
			return fail(err, done, total)
		}
		done++
		maybeUpdateFTS5Progress(app, ctx, done, total)
	}
	for _, agent := range agents {
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return err
		}
		if err := dbmodels.BulkInsertFTS5Agent(qa, agent); err != nil {
			return fail(err, done, total)
		}
		done++
		maybeUpdateFTS5Progress(app, ctx, done, total)
	}
	for _, s := range series {
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return err
		}
		if err := dbmodels.BulkInsertFTS5Series(qs, s); err != nil {
			return fail(err, done, total)
		}
		done++
		maybeUpdateFTS5Progress(app, ctx, done, total)
	}
	for _, item := range items {
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return err
		}
		if err := dbmodels.BulkInsertFTS5Item(qi, item); err != nil {
			return fail(err, done, total)
		}
		done++
		maybeUpdateFTS5Progress(app, ctx, done, total)
	}

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
		if err := dbmodels.BulkInsertFTS5Entry(qe, entry, entryPlaces, entryAgents, entrySeries); err != nil {
			return fail(err, done, total)
		}
		done++
		maybeUpdateFTS5Progress(app, ctx, done, total)
	}

	for _, content := range contents {
		if err := checkFTS5Canceled(app, ctx, done, total); err != nil {
			return err
		}
		entry := entriesById[content.Entry()]
		contentAgents := contentsAgentsMap[content.Id]
		if err := dbmodels.BulkInsertFTS5Content(qc, content, entry, contentAgents); err != nil {
			return fail(err, done, total)
		}
		done++
		maybeUpdateFTS5Progress(app, ctx, done, total)
	}

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
