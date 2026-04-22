package controllers

import (
	"fmt"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	app.Register(&AdminStartPage{})
}

type AdminStartPage struct{}

func (p *AdminStartPage) Up(ia pagemodels.IApp, engine *templating.Engine) error   { return nil }
func (p *AdminStartPage) Down(ia pagemodels.IApp, engine *templating.Engine) error { return nil }

func (p *AdminStartPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	appInstance := ia.Core()
	rg := router.Group(URL_ADMIN_START)
	rg.BindFunc(middleware.Authenticated(appInstance))
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET("", p.pageHandler(engine, appInstance))
	rg.GET(URL_ADMIN_START_SCANS, p.scansHandler(engine, appInstance))
	return nil
}

type startEntryView struct {
	Id             string
	MusenalmId     int
	PreferredTitle string
	Updated        types.DateTime
	EditURL        string
	ViewURL        string
}

type startContentView struct {
	Id             string
	MusenalmId     int
	PreferredTitle string
	Updated        types.DateTime
	EntryId        string
	EditURL        string
	ViewURL        string
	ImagePaths     []string
}

type siteStats struct {
	Reihen  int
	Baende  int
	Inhalte int
	Scans   int
	Persons int
}

func loadSiteStats(appInstance core.App) (siteStats, error) {
	var stats siteStats
	var row struct {
		Count int `db:"count"`
	}

	tables := []struct {
		table string
		dest  *int
	}{
		{dbmodels.SERIES_TABLE, &stats.Reihen},
		{dbmodels.ENTRIES_TABLE, &stats.Baende},
		{dbmodels.CONTENTS_TABLE, &stats.Inhalte},
		{dbmodels.AGENTS_TABLE, &stats.Persons},
	}
	for _, t := range tables {
		row.Count = 0
		if err := appInstance.DB().
			NewQuery("SELECT COUNT(*) AS count FROM " + t.table).
			One(&row); err != nil {
			return stats, err
		}
		*t.dest = row.Count
	}

	row.Count = 0
	if err := appInstance.DB().
		NewQuery("SELECT COALESCE(SUM(json_array_length(" + dbmodels.SCAN_FIELD + ")), 0) AS count FROM " + dbmodels.CONTENTS_TABLE + " WHERE " + dbmodels.SCAN_FIELD + " != '' AND " + dbmodels.SCAN_FIELD + " IS NOT NULL").
		One(&row); err != nil {
		return stats, err
	}
	stats.Scans = row.Count

	return stats, nil
}

func loadScanPaths(appInstance core.App, random bool) []string {
	var records []*core.Record
	q := appInstance.RecordQuery(dbmodels.CONTENTS_TABLE).
		Where(dbx.Not(dbx.HashExp{dbmodels.SCAN_FIELD: ""})).
		Limit(200)
	if random {
		q = q.OrderBy("RANDOM()")
	} else {
		q = q.OrderBy(dbmodels.UPDATED_FIELD + " DESC")
	}
	_ = q.All(&records)
	paths := make([]string, 0, len(records)*2)
	for _, r := range records {
		for _, p := range dbmodels.NewContent(r).ImagePaths() {
			paths = append(paths, p)
		}
	}
	return paths
}

func (p *AdminStartPage) scansHandler(engine *templating.Engine, appInstance core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		random := e.Request.URL.Query().Get("random") == "1"
		paths := loadScanPaths(appInstance, random)
		data := map[string]any{
			"scan_paths": paths,
			"random":     random,
		}
		return engine.Response200(e, TEMPLATE_ADMIN_START_SCANS, data, pagemodels.LAYOUT_FRAGMENT)
	}
}

func (p *AdminStartPage) pageHandler(engine *templating.Engine, appInstance core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		data := map[string]any{}

		var entryRecords []*core.Record
		if err := appInstance.RecordQuery(dbmodels.ENTRIES_TABLE).
			OrderBy(dbmodels.UPDATED_FIELD + " DESC").
			Limit(10).
			All(&entryRecords); err != nil {
			return engine.Response500(e, err, data)
		}
		recentBaende := make([]startEntryView, 0, len(entryRecords))
		for _, r := range entryRecords {
			entry := dbmodels.NewEntry(r)
			recentBaende = append(recentBaende, startEntryView{
				Id:             entry.Id,
				MusenalmId:     entry.MusenalmID(),
				PreferredTitle: entry.PreferredTitle(),
				Updated:        entry.Updated(),
				EditURL:        fmt.Sprintf(URL_ALMANACH_EDIT_FORMAT, fmt.Sprintf("%d", entry.MusenalmID())),
				ViewURL:        fmt.Sprintf(URL_ALMANACH_VIEW, entry.MusenalmID()),
			})
		}

		var contentRecords []*core.Record
		if err := appInstance.RecordQuery(dbmodels.CONTENTS_TABLE).
			OrderBy(dbmodels.UPDATED_FIELD + " DESC").
			Limit(10).
			All(&contentRecords); err != nil {
			return engine.Response500(e, err, data)
		}

		// Batch-lookup parent entry MusenalmIDs (route uses MusenalmID, not DB id)
		entryMusenalmIDs := map[string]int{}
		{
			ids := make([]any, 0, len(contentRecords))
			seen := map[string]struct{}{}
			for _, r := range contentRecords {
				if id := r.GetString(dbmodels.ENTRIES_TABLE); id != "" {
					if _, ok := seen[id]; !ok {
						seen[id] = struct{}{}
						ids = append(ids, id)
					}
				}
			}
			if len(ids) > 0 {
				var parentRecords []*core.Record
				_ = appInstance.RecordQuery(dbmodels.ENTRIES_TABLE).
					Where(dbx.In(dbmodels.ID_FIELD, ids...)).
					All(&parentRecords)
				for _, pr := range parentRecords {
					entryMusenalmIDs[pr.Id] = dbmodels.NewEntry(pr).MusenalmID()
				}
			}
		}

		recentInhalte := make([]startContentView, 0, len(contentRecords))
		for _, r := range contentRecords {
			content := dbmodels.NewContent(r)
			entryDbId := content.Entry()
			entryMID := entryMusenalmIDs[entryDbId]
			recentInhalte = append(recentInhalte, startContentView{
				Id:             content.Id,
				MusenalmId:     content.MusenalmID(),
				PreferredTitle: content.PreferredTitle(),
				Updated:        content.Updated(),
				EntryId:        entryDbId,
				EditURL:        fmt.Sprintf(URL_ALMANACH_CONTENTS_PANEL_EDIT_FORMAT, fmt.Sprintf("%d", entryMID), content.MusenalmID()),
				ViewURL:        fmt.Sprintf(URL_BEITRAG_VIEW_FORMAT, content.MusenalmID()),
				ImagePaths:     content.ImagePaths(),
			})
		}

		recentScanPaths := loadScanPaths(appInstance, false)

		exports, _, err := loadExports(appInstance)
		if err != nil {
			return engine.Response500(e, err, data)
		}
		var latestExport *exportView
		if len(exports) > 0 {
			ev := exports[0]
			latestExport = &ev
		}

		fts5Status := settingString(appInstance, "fts5_rebuild_status")
		if fts5Status == "" {
			fts5Status = "idle"
		}
		fts5LastRebuild := formatLastRebuild(appInstance)

		stats, err := loadSiteStats(appInstance)
		if err != nil {
			return engine.Response500(e, err, data)
		}

		req := templating.NewRequest(e)
		var sessionMinutesLeft int64
		var sessionExpiresAt types.DateTime
		if session := req.Session(); session != nil && !session.Expires.IsZero() {
			sessionExpiresAt = session.Expires
			sessionMinutesLeft = int64(time.Until(session.Expires.Time()).Minutes())
		}

		data["recent_scan_paths"] = recentScanPaths
		data["recent_baende"] = recentBaende
		data["recent_inhalte"] = recentInhalte
		data["latest_export"] = latestExport
		data["fts5_status"] = fts5Status
		data["fts5_last_rebuild"] = fts5LastRebuild
		data["stats"] = stats
		data["session_minutes_left"] = sessionMinutesLeft
		data["session_expires_at"] = sessionExpiresAt

		return engine.Response200(e, TEMPLATE_ADMIN_START, data, pagemodels.LAYOUT_LOGIN_PAGES)
	}
}
