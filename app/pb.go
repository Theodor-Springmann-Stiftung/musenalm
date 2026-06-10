package app

import (
	"database/sql"
	"fmt"
	"html/template"
	"log/slog"
	"sort"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/exports"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/imports"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/Theodor-Springmann-Stiftung/musenalm/views"
	"github.com/mattn/go-sqlite3"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

const (
	LAYOUT_DIR = "./views/layouts"
	ROUTES_DIR = "./views/routes"
)

type ServeFunc = func(e *core.ServeEvent) error
type BootFunc = func(e *core.BootstrapEvent) error

// INFO: this is the main application that mainly is a pocketbase wrapper
type App struct {
	PB                                  *pocketbase.PocketBase
	MAConfig                            Config
	Pages                               []pagemodels.IPage
	dataCache                           atomic.Pointer[PrefixCache]
	dataCacheBuildMutex                 sync.Mutex
	dataCacheRefreshMutex               sync.Mutex
	dataCacheRefreshRun                 bool
	dataCacheRefreshQueued              bool
	htmlCache                           atomic.Pointer[PrefixCache]
	htmlCacheBuildMutex                 sync.Mutex
	htmlCacheRefreshMutex               sync.Mutex
	htmlCacheRefreshRun                 bool
	htmlCacheRefreshQueued              bool
	pagesCache                          atomic.Pointer[PagesCacheSnapshot]
	pagesCacheBuildMutex                sync.Mutex
	pagesCacheRefreshMutex              sync.Mutex
	pagesCacheRefreshRun                bool
	pagesCacheRefreshQueued             bool
	imagesCache                         atomic.Pointer[ImagesCacheSnapshot]
	imagesCacheBuildMutex               sync.Mutex
	imagesCacheRefreshMutex             sync.Mutex
	imagesCacheRefreshRun               bool
	imagesCacheRefreshQueued            bool
	entrySummaryCache                   atomic.Pointer[EntrySummaryCache]
	entrySummaryCacheBuildMutex         sync.Mutex
	entrySummaryCacheRefreshMutex       sync.Mutex
	entrySummaryCacheRefreshRun         bool
	entrySummaryCacheRefreshQueued      bool
	baendeCache                         atomic.Pointer[BaendeCache]
	baendeCacheBuildMutex               sync.Mutex
	baendeCacheRefreshMutex             sync.Mutex
	baendeCacheRefreshRun               bool
	baendeCacheRefreshQueued            bool
	entryAgentOrderCache                atomic.Pointer[OrderedIDsCache]
	entryAgentOrderCacheBuildMutex      sync.Mutex
	entryAgentOrderCacheRefreshMutex    sync.Mutex
	entryAgentOrderCacheRefreshRun      bool
	entryAgentOrderCacheRefreshQueued   bool
	contentAgentOrderCache              atomic.Pointer[OrderedIDsCache]
	contentAgentOrderCacheBuildMutex    sync.Mutex
	contentAgentOrderCacheRefreshMutex  sync.Mutex
	contentAgentOrderCacheRefreshRun    bool
	contentAgentOrderCacheRefreshQueued bool
	seriesOrderCache                    atomic.Pointer[OrderedIDsCache]
	seriesOrderCacheBuildMutex          sync.Mutex
	seriesOrderCacheRefreshMutex        sync.Mutex
	seriesOrderCacheRefreshRun          bool
	seriesOrderCacheRefreshQueued       bool
	lobidClientMu                       sync.Mutex
	lobidClient                         *lobidClient
	placeOrderCache                     atomic.Pointer[OrderedIDsCache]
	placeOrderCacheBuildMutex           sync.Mutex
	placeOrderCacheRefreshMutex         sync.Mutex
	placeOrderCacheRefreshRun           bool
	placeOrderCacheRefreshQueued        bool
	displayCache                        *DisplayCache
	displayCacheRefreshMutex            sync.Mutex
	displayCacheRefreshRun              bool
	displayCacheRefreshQueued           bool
	displayCacheRefreshPlan             displayRefreshPlan
	baendeCacheBuildFunc                func() (*BaendeCache, error)
	dataCacheBuildFunc                  func() (*PrefixCache, error)
	htmlCacheBuildFunc                  func() (*PrefixCache, error)
	pagesCacheBuildFunc                 func() (*PagesCacheSnapshot, error)
	imagesCacheBuildFunc                func() (*ImagesCacheSnapshot, error)
	entrySummaryCacheBuildFunc          func() (*EntrySummaryCache, error)
	entryAgentOrderCacheBuildFunc       func() (*OrderedIDsCache, error)
	contentAgentOrderCacheBuildFunc     func() (*OrderedIDsCache, error)
	seriesOrderCacheBuildFunc           func() (*OrderedIDsCache, error)
	placeOrderCacheBuildFunc            func() (*OrderedIDsCache, error)
	canonicalStore                      *canonical.Store
}

type BaendeCache struct {
	Entries       []*dbmodels.Entry
	SortedEntries map[string][]*dbmodels.Entry
	Users         map[string]*dbmodels.User
	CachedAt      time.Time
}

type OrderedIDsCache struct {
	IDs      []string
	CachedAt time.Time
}

type EntrySummary struct {
	ContentCount int
}

type EntrySummaryCache struct {
	Entries  map[string]EntrySummary
	CachedAt time.Time
}

// Implement BaendeCacheInterface methods
func (bc *BaendeCache) GetEntries() interface{} {
	return bc.Entries
}

func (bc *BaendeCache) GetSortedEntries() interface{} {
	return bc.SortedEntries
}

func (bc *BaendeCache) GetUsers() interface{} {
	return bc.Users
}

func (bc *BaendeCache) GetCachedAt() time.Time {
	return bc.CachedAt
}

const (
	TEST_SUPERUSER_MAIL = "demo@example.com"
	TEST_SUPERUSER_PASS = "password"
)

func init() {
	sql.Register("pb_sqlite3",
		&sqlite3.SQLiteDriver{
			ConnectHook: func(conn *sqlite3.SQLiteConn) error {
				_, err := conn.Exec(`
                    PRAGMA busy_timeout       = 10000;
                    PRAGMA journal_mode       = WAL;
                    PRAGMA journal_size_limit = 200000000;
                    PRAGMA synchronous        = FULL;
                    PRAGMA foreign_keys       = ON;
                    PRAGMA temp_store         = MEMORY;
                    PRAGMA cache_size         = -32768;
                `, nil)

				return err
			},
		},
	)

	dbx.BuilderFuncMap["pb_sqlite3"] = dbx.BuilderFuncMap["sqlite3"]
}

func New(config Config) *App {
	app := App{
		MAConfig:                config,
		displayCache:            NewDisplayCache(),
		displayCacheRefreshPlan: newDisplayRefreshPlan(),
	}
	app.canonicalStore = canonical.NewStore()

	app.createPBInstance()
	app.Bootstrap()

	return &app
}

func (app *App) createPBInstance() {
	app.PB = pocketbase.NewWithConfig(pocketbase.Config{
		DBConnect: func(dbPath string) (*dbx.DB, error) {
			return dbx.Open("pb_sqlite3", dbPath)
		},
		DefaultDev: app.MAConfig.Debug,
	})
}

func (app *App) setupTestuser() BootFunc {
	return func(e *core.BootstrapEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		superusersCol, err := e.App.FindCachedCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return fmt.Errorf("failed to fetch %q collection: %w", core.CollectionNameSuperusers, err)
		}

		superuser, err := e.App.FindAuthRecordByEmail(superusersCol, TEST_SUPERUSER_MAIL)
		if err != nil && app.MAConfig.AllowTestLogin {
			superuser = core.NewRecord(superusersCol)
		} else if err == nil && !app.MAConfig.AllowTestLogin {
			// INFO: we to it as a raw query here since PB does not support deleting the last superuser
			_, err = e.App.DB().
				NewQuery("DELETE FROM " + superusersCol.Name + " WHERE id = '" + superuser.Id + "'").
				Execute()
			if err != nil {
				return fmt.Errorf("failed to delete superuser account: %w", err)
			}

			return nil
		} else if err != nil {
			return nil
		}

		superuser.SetEmail(TEST_SUPERUSER_MAIL)
		superuser.SetPassword(TEST_SUPERUSER_PASS)

		if err := e.App.Save(superuser); err != nil {
			return fmt.Errorf("failed to upsert superuser account: %w", err)
		}

		return e.Next()
	}
}

func (app *App) Bootstrap() error {
	app.PB.OnBootstrap().BindFunc(app.setupTestuser())
	return nil
}

func (app *App) Serve() error {
	engine, err := app.createEngine()
	if err != nil {
		panic(err)
	}

	if app.MAConfig.Debug && !app.MAConfig.DisableWatchers {
		app.setWatchers(engine)
		engine.Debug()
	}

	// INFO: we use OnServe, but here is also OnBootstrap
	app.PB.OnServe().BindFunc(app.bindPages(engine))
	app.PB.OnServe().BindFunc(func(e *core.ServeEvent) error {
		imports.MarkInterruptedFTS5Rebuild(e.App)
		exports.CleanupInterrupted(e.App)
		return e.Next()
	})
	app.PB.OnServe().BindFunc(func(e *core.ServeEvent) error {
		app.ScheduleBaendeCacheRebuild()
		app.ScheduleEntrySummaryCacheRebuild()
		app.ScheduleEntryAgentOrderCacheRebuild()
		app.ScheduleContentAgentOrderCacheRebuild()
		app.ScheduleSeriesOrderCacheRebuild()
		app.SchedulePlaceOrderCacheRebuild()
		app.ScheduleDisplayCacheRebuild()
		return e.Next()
	})
	return app.PB.Start()
}

func (app *App) Logger() *slog.Logger {
	return app.PB.Logger()
}

func (app *App) createEngine() (*templating.Engine, error) {
	engine := templating.NewEngine(&views.LayoutFS, &views.RoutesFS)
	engine.Globals(map[string]interface{}{
		"isDev": app.MAConfig.Debug,
		"lang":  "de",
		"site": map[string]interface{}{
			"title": "Musenalm",
			"lang":  "de",
			"desc":  "Bibliographie deutscher Almanache des 18. und 19. Jahrhunderts",
		}})

	engine.AddFunc("data", func(key string) any {
		cache, err := app.EnsureDataCache()
		if err != nil || cache == nil {
			return nil
		}
		return cache.Get(key)
	})
	engine.AddFunc("dataPrefix", func(prefix string) map[string]any {
		cache, err := app.EnsureDataCache()
		if err != nil || cache == nil {
			return map[string]any{}
		}
		return cache.GetPrefix(prefix)
	})

	engine.AddFunc("html", func(key string) any {
		cache, err := app.EnsureHtmlCache()
		if err != nil || cache == nil {
			return nil
		}
		return cache.Get(key)
	})
	engine.AddFunc("help", func(table string, field ...string) template.HTML {
		cache, err := app.EnsureHtmlCache()
		if err != nil || cache == nil {
			return ""
		}
		key := "help." + table
		if len(field) > 0 && field[0] != "" {
			key = key + "." + field[0]
		}
		return template.HTML(cache.GetString(key))
	})
	engine.AddFunc("helpOr", func(table, field, fallback string) template.HTML {
		cache, err := app.EnsureHtmlCache()
		if err != nil || cache == nil {
			return template.HTML(fallback)
		}
		key := "help." + table + "." + field
		value := cache.GetString(key)
		if value == "" {
			value = fallback
		}
		return template.HTML(value)
	})
	engine.AddFunc("pageMeta", func(name string) map[string]any {
		cache, err := app.EnsurePagesCache()
		if err != nil || cache == nil {
			return map[string]any{}
		}
		meta, ok := cache.Meta[name]
		if !ok {
			return map[string]any{}
		}
		return map[string]any{
			"title":       meta.Title,
			"description": meta.Description,
			"keywords":    meta.Keywords,
		}
	})
	engine.AddFunc("pageMetaField", func(name, field string) string {
		cache, err := app.EnsurePagesCache()
		if err != nil || cache == nil {
			return ""
		}
		meta, ok := cache.Meta[name]
		if !ok {
			return ""
		}
		switch field {
		case "title":
			return meta.Title
		case "description":
			return meta.Description
		case "keywords":
			return meta.Keywords
		default:
			return ""
		}
	})
	engine.AddFunc("pageHtml", func(name string, section ...string) template.HTML {
		cache, err := app.EnsureHtmlCache()
		if err != nil || cache == nil {
			return ""
		}
		key := "page." + name
		if len(section) > 0 && section[0] != "" {
			key = key + "." + section[0]
		}
		return template.HTML(cache.GetString(key))
	})
	engine.AddFunc("imagePath", func(key string, preview ...bool) string {
		cache, err := app.EnsureImagesCache()
		if err != nil || cache == nil {
			return ""
		}
		image := cache.Images[key]
		if image == nil {
			return ""
		}
		if len(preview) > 0 && preview[0] {
			return image.PreviewPath()
		}
		return image.ImagePath()
	})
	engine.AddFunc("htmlPrefix", func(prefix string) map[string]any {
		cache, err := app.EnsureHtmlCache()
		if err != nil || cache == nil {
			return map[string]any{}
		}
		return cache.GetPrefix(prefix)
	})
	engine.AddFunc("agentDisplay", func(id string) *AgentDisplay {
		return app.GetAgentDisplay(id)
	})
	engine.AddFunc("seriesDisplay", func(id string) *SeriesDisplay {
		return app.GetSeriesDisplay(id)
	})
	engine.AddFunc("entryDisplay", func(id string) *EntryDisplay {
		return app.GetEntryDisplay(id)
	})
	engine.AddFunc("placeDisplay", func(id string) *PlaceDisplay {
		return app.GetPlaceDisplay(id)
	})
	engine.AddFunc("contentDisplay", func(id string) *ContentDisplay {
		return app.GetContentDisplay(id)
	})
	return engine, nil
}

// Core returns the underlying pocketbase core.App
func (app *App) Core() core.App {
	return app.PB.App
}

func (app *App) ResetDataCache() {
	if app.dataCache.Load() != nil {
		app.ScheduleDataCacheRebuild()
	}
}

func (app *App) ResetHtmlCache() {
	if app.htmlCache.Load() != nil {
		app.ScheduleHtmlCacheRebuild()
	}
}

func (app *App) ResetImagesCache() {
	if app.imagesCache.Load() != nil {
		app.ScheduleImagesCacheRebuild()
	}
}

func (app *App) ResetPagesCache() {
	if app.pagesCache.Load() != nil {
		app.SchedulePagesCacheRebuild()
	}
}

type PrefixCache struct {
	data map[string]any
	keys []string
}

type PageMetaData struct {
	Title       string
	Description string
	Keywords    string
}

type PagesCacheSnapshot struct {
	Meta map[string]PageMetaData
}

type ImagesCacheSnapshot struct {
	Images map[string]*dbmodels.Image
}

func NewPrefixCache() *PrefixCache {
	return &PrefixCache{
		data: make(map[string]any),
	}
}

func (c *PrefixCache) Get(key string) any {
	if c == nil {
		return nil
	}
	return c.data[key]
}

func (c *PrefixCache) GetString(key string) string {
	if c == nil {
		return ""
	}
	value, ok := c.data[key]
	if !ok || value == nil {
		return ""
	}
	if s, ok := value.(string); ok {
		return s
	}
	return fmt.Sprint(value)
}

func (c *PrefixCache) GetPrefix(prefix string) map[string]any {
	if c == nil || len(c.keys) == 0 {
		return map[string]any{}
	}

	start := sort.Search(len(c.keys), func(i int) bool {
		return c.keys[i] >= prefix
	})

	matches := make(map[string]any)
	for i := start; i < len(c.keys); i++ {
		key := c.keys[i]
		if !strings.HasPrefix(key, prefix) {
			break
		}
		matches[key] = c.data[key]
	}

	return matches
}

func (app *App) ScheduleDataCacheRebuild() {
	app.dataCacheRefreshMutex.Lock()
	app.dataCacheRefreshQueued = true
	if app.dataCacheRefreshRun {
		app.dataCacheRefreshMutex.Unlock()
		return
	}
	app.dataCacheRefreshRun = true
	app.dataCacheRefreshMutex.Unlock()
	go app.runDataCacheRefreshLoop()
}

func (app *App) runDataCacheRefreshLoop() {
	for {
		app.dataCacheRefreshMutex.Lock()
		app.dataCacheRefreshQueued = false
		app.dataCacheRefreshMutex.Unlock()

		if _, err := app.rebuildDataCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild data cache", "error", err)
		}

		app.dataCacheRefreshMutex.Lock()
		if app.dataCacheRefreshQueued {
			app.dataCacheRefreshMutex.Unlock()
			continue
		}
		app.dataCacheRefreshRun = false
		app.dataCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureDataCache() (*PrefixCache, error) {
	if cache := app.dataCache.Load(); cache != nil {
		return cache, nil
	}
	app.dataCacheBuildMutex.Lock()
	defer app.dataCacheBuildMutex.Unlock()
	if cache := app.dataCache.Load(); cache != nil {
		return cache, nil
	}
	cache, err := app.nextDataCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.dataCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildDataCache() (*PrefixCache, error) {
	app.dataCacheBuildMutex.Lock()
	defer app.dataCacheBuildMutex.Unlock()
	cache, err := app.nextDataCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.dataCache.Store(cache)
	return cache, nil
}

func (app *App) nextDataCacheSnapshot() (*PrefixCache, error) {
	if app.dataCacheBuildFunc != nil {
		return app.dataCacheBuildFunc()
	}
	return app.buildDataCache()
}

func (app *App) buildDataCache() (*PrefixCache, error) {
	data, err := dbmodels.Data_All(app.PB.App)
	if err != nil {
		return nil, err
	}

	cache := NewPrefixCache()
	cache.keys = make([]string, 0, len(data))
	for _, d := range data {
		key := d.Key()
		cache.data[key] = d.Value()
		cache.keys = append(cache.keys, key)
	}
	sort.Strings(cache.keys)
	return cache, nil
}

func (app *App) ScheduleHtmlCacheRebuild() {
	app.htmlCacheRefreshMutex.Lock()
	app.htmlCacheRefreshQueued = true
	if app.htmlCacheRefreshRun {
		app.htmlCacheRefreshMutex.Unlock()
		return
	}
	app.htmlCacheRefreshRun = true
	app.htmlCacheRefreshMutex.Unlock()
	go app.runHtmlCacheRefreshLoop()
}

func (app *App) runHtmlCacheRefreshLoop() {
	for {
		app.htmlCacheRefreshMutex.Lock()
		app.htmlCacheRefreshQueued = false
		app.htmlCacheRefreshMutex.Unlock()

		if _, err := app.rebuildHtmlCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild html cache", "error", err)
		}

		app.htmlCacheRefreshMutex.Lock()
		if app.htmlCacheRefreshQueued {
			app.htmlCacheRefreshMutex.Unlock()
			continue
		}
		app.htmlCacheRefreshRun = false
		app.htmlCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureHtmlCache() (*PrefixCache, error) {
	if cache := app.htmlCache.Load(); cache != nil {
		return cache, nil
	}
	app.htmlCacheBuildMutex.Lock()
	defer app.htmlCacheBuildMutex.Unlock()
	if cache := app.htmlCache.Load(); cache != nil {
		return cache, nil
	}
	cache, err := app.nextHtmlCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.htmlCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildHtmlCache() (*PrefixCache, error) {
	app.htmlCacheBuildMutex.Lock()
	defer app.htmlCacheBuildMutex.Unlock()
	cache, err := app.nextHtmlCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.htmlCache.Store(cache)
	return cache, nil
}

func (app *App) nextHtmlCacheSnapshot() (*PrefixCache, error) {
	if app.htmlCacheBuildFunc != nil {
		return app.htmlCacheBuildFunc()
	}
	return app.buildHtmlCache()
}

func (app *App) buildHtmlCache() (*PrefixCache, error) {
	html, err := dbmodels.Html_All(app.PB.App)
	if err != nil {
		return nil, err
	}

	cache := NewPrefixCache()
	cache.keys = make([]string, 0, len(html))
	for _, h := range html {
		key := h.Key()
		cache.data[key] = h.HTML()
		cache.keys = append(cache.keys, key)
	}
	sort.Strings(cache.keys)
	return cache, nil
}

func (app *App) SchedulePagesCacheRebuild() {
	app.pagesCacheRefreshMutex.Lock()
	app.pagesCacheRefreshQueued = true
	if app.pagesCacheRefreshRun {
		app.pagesCacheRefreshMutex.Unlock()
		return
	}
	app.pagesCacheRefreshRun = true
	app.pagesCacheRefreshMutex.Unlock()
	go app.runPagesCacheRefreshLoop()
}

func (app *App) runPagesCacheRefreshLoop() {
	for {
		app.pagesCacheRefreshMutex.Lock()
		app.pagesCacheRefreshQueued = false
		app.pagesCacheRefreshMutex.Unlock()

		if _, err := app.rebuildPagesCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild pages cache", "error", err)
		}

		app.pagesCacheRefreshMutex.Lock()
		if app.pagesCacheRefreshQueued {
			app.pagesCacheRefreshMutex.Unlock()
			continue
		}
		app.pagesCacheRefreshRun = false
		app.pagesCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsurePagesCache() (*PagesCacheSnapshot, error) {
	if cache := app.pagesCache.Load(); cache != nil {
		return cache, nil
	}
	app.pagesCacheBuildMutex.Lock()
	defer app.pagesCacheBuildMutex.Unlock()
	if cache := app.pagesCache.Load(); cache != nil {
		return cache, nil
	}
	cache, err := app.nextPagesCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.pagesCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildPagesCache() (*PagesCacheSnapshot, error) {
	app.pagesCacheBuildMutex.Lock()
	defer app.pagesCacheBuildMutex.Unlock()
	cache, err := app.nextPagesCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.pagesCache.Store(cache)
	return cache, nil
}

func (app *App) nextPagesCacheSnapshot() (*PagesCacheSnapshot, error) {
	if app.pagesCacheBuildFunc != nil {
		return app.pagesCacheBuildFunc()
	}
	return app.buildPagesCache()
}

func (app *App) buildPagesCache() (*PagesCacheSnapshot, error) {
	pages, err := dbmodels.Pages_All(app.PB.App)
	if err != nil {
		return nil, err
	}

	cache := make(map[string]PageMetaData, len(pages))
	for _, page := range pages {
		meta := PageMetaData{Title: page.Title()}
		if data := page.Data(); data != nil {
			if value, ok := data["description"]; ok && value != nil {
				meta.Description = fmt.Sprint(value)
			}
			if value, ok := data["keywords"]; ok && value != nil {
				meta.Keywords = fmt.Sprint(value)
			}
		}
		cache[page.Key()] = meta
	}
	return &PagesCacheSnapshot{Meta: cache}, nil
}

func (app *App) ScheduleImagesCacheRebuild() {
	app.imagesCacheRefreshMutex.Lock()
	app.imagesCacheRefreshQueued = true
	if app.imagesCacheRefreshRun {
		app.imagesCacheRefreshMutex.Unlock()
		return
	}
	app.imagesCacheRefreshRun = true
	app.imagesCacheRefreshMutex.Unlock()
	go app.runImagesCacheRefreshLoop()
}

func (app *App) runImagesCacheRefreshLoop() {
	for {
		app.imagesCacheRefreshMutex.Lock()
		app.imagesCacheRefreshQueued = false
		app.imagesCacheRefreshMutex.Unlock()

		if _, err := app.rebuildImagesCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild images cache", "error", err)
		}

		app.imagesCacheRefreshMutex.Lock()
		if app.imagesCacheRefreshQueued {
			app.imagesCacheRefreshMutex.Unlock()
			continue
		}
		app.imagesCacheRefreshRun = false
		app.imagesCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureImagesCache() (*ImagesCacheSnapshot, error) {
	if cache := app.imagesCache.Load(); cache != nil {
		return cache, nil
	}
	app.imagesCacheBuildMutex.Lock()
	defer app.imagesCacheBuildMutex.Unlock()
	if cache := app.imagesCache.Load(); cache != nil {
		return cache, nil
	}
	cache, err := app.nextImagesCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.imagesCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildImagesCache() (*ImagesCacheSnapshot, error) {
	app.imagesCacheBuildMutex.Lock()
	defer app.imagesCacheBuildMutex.Unlock()
	cache, err := app.nextImagesCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.imagesCache.Store(cache)
	return cache, nil
}

func (app *App) nextImagesCacheSnapshot() (*ImagesCacheSnapshot, error) {
	if app.imagesCacheBuildFunc != nil {
		return app.imagesCacheBuildFunc()
	}
	return app.buildImagesCache()
}

func (app *App) buildImagesCache() (*ImagesCacheSnapshot, error) {
	images, err := dbmodels.Images_All(app.PB.App)
	if err != nil {
		return nil, err
	}

	cache := make(map[string]*dbmodels.Image, len(images))
	for _, image := range images {
		cache[image.Key()] = image
	}
	return &ImagesCacheSnapshot{Images: cache}, nil
}

func (app *App) ResetEntrySummaryCache() {
	app.ScheduleEntrySummaryCacheRebuild()
}

func (app *App) ScheduleEntrySummaryCacheRebuild() {
	app.entrySummaryCacheRefreshMutex.Lock()
	app.entrySummaryCacheRefreshQueued = true
	if app.entrySummaryCacheRefreshRun {
		app.entrySummaryCacheRefreshMutex.Unlock()
		return
	}
	app.entrySummaryCacheRefreshRun = true
	app.entrySummaryCacheRefreshMutex.Unlock()

	go app.runEntrySummaryCacheRefreshLoop()
}

func (app *App) runEntrySummaryCacheRefreshLoop() {
	for {
		app.entrySummaryCacheRefreshMutex.Lock()
		app.entrySummaryCacheRefreshQueued = false
		app.entrySummaryCacheRefreshMutex.Unlock()

		if _, err := app.rebuildEntrySummaryCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild entry summary cache", "error", err)
		}

		app.entrySummaryCacheRefreshMutex.Lock()
		if app.entrySummaryCacheRefreshQueued {
			app.entrySummaryCacheRefreshMutex.Unlock()
			continue
		}
		app.entrySummaryCacheRefreshRun = false
		app.entrySummaryCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureEntrySummaryCache() (*EntrySummaryCache, error) {
	if cache := app.entrySummaryCache.Load(); cache != nil {
		return cache, nil
	}

	app.entrySummaryCacheBuildMutex.Lock()
	defer app.entrySummaryCacheBuildMutex.Unlock()

	if cache := app.entrySummaryCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextEntrySummaryCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.entrySummaryCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildEntrySummaryCache() (*EntrySummaryCache, error) {
	app.entrySummaryCacheBuildMutex.Lock()
	defer app.entrySummaryCacheBuildMutex.Unlock()

	cache, err := app.nextEntrySummaryCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.entrySummaryCache.Store(cache)
	return cache, nil
}

func (app *App) nextEntrySummaryCacheSnapshot() (*EntrySummaryCache, error) {
	if app.entrySummaryCacheBuildFunc != nil {
		return app.entrySummaryCacheBuildFunc()
	}
	return app.buildEntrySummaryCache()
}

func (app *App) buildEntrySummaryCache() (*EntrySummaryCache, error) {
	entries := []*dbmodels.Entry{}
	if err := app.PB.RecordQuery(dbmodels.ENTRIES_TABLE).All(&entries); err != nil {
		return nil, err
	}

	summary := make(map[string]EntrySummary, len(entries))
	if len(entries) == 0 {
		return &EntrySummaryCache{Entries: summary, CachedAt: time.Now()}, nil
	}

	counts, err := dbmodels.CountContentsEntries(app.PB.App, dbmodels.Ids(entries))
	if err != nil {
		return nil, err
	}

	for _, entry := range entries {
		if entry == nil {
			continue
		}
		summary[entry.Id] = EntrySummary{ContentCount: counts[entry.Id]}
	}

	return &EntrySummaryCache{Entries: summary, CachedAt: time.Now()}, nil
}

func (app *App) GetEntrySummary(id string) EntrySummary {
	cache, err := app.EnsureEntrySummaryCache()
	if err != nil || cache == nil {
		return EntrySummary{}
	}
	return cache.Entries[id]
}

func (app *App) ResetBaendeCache() {
	app.ScheduleBaendeCacheRebuild()
}

func (app *App) ScheduleBaendeCacheRebuild() {
	app.baendeCacheRefreshMutex.Lock()
	app.baendeCacheRefreshQueued = true
	if app.baendeCacheRefreshRun {
		app.baendeCacheRefreshMutex.Unlock()
		return
	}
	app.baendeCacheRefreshRun = true
	app.baendeCacheRefreshMutex.Unlock()

	go app.runBaendeCacheRefreshLoop()
}

func (app *App) runBaendeCacheRefreshLoop() {
	for {
		app.baendeCacheRefreshMutex.Lock()
		app.baendeCacheRefreshQueued = false
		app.baendeCacheRefreshMutex.Unlock()

		if _, err := app.rebuildBaendeCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild baende cache", "error", err)
		}

		app.baendeCacheRefreshMutex.Lock()
		if app.baendeCacheRefreshQueued {
			app.baendeCacheRefreshMutex.Unlock()
			continue
		}
		app.baendeCacheRefreshRun = false
		app.baendeCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureBaendeCache() (*BaendeCache, error) {
	if cache := app.baendeCache.Load(); cache != nil {
		return cache, nil
	}

	app.baendeCacheBuildMutex.Lock()
	defer app.baendeCacheBuildMutex.Unlock()

	if cache := app.baendeCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextBaendeCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.baendeCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildBaendeCache() (*BaendeCache, error) {
	app.baendeCacheBuildMutex.Lock()
	defer app.baendeCacheBuildMutex.Unlock()

	cache, err := app.nextBaendeCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.baendeCache.Store(cache)
	return cache, nil
}

func (app *App) nextBaendeCacheSnapshot() (*BaendeCache, error) {
	if app.baendeCacheBuildFunc != nil {
		return app.baendeCacheBuildFunc()
	}
	return app.buildBaendeCache()
}

func (app *App) buildBaendeCache() (*BaendeCache, error) {
	// Load all entries sorted by PreferredTitle
	entries := []*dbmodels.Entry{}
	if err := app.PB.RecordQuery(dbmodels.ENTRIES_TABLE).
		OrderBy(dbmodels.PREFERRED_TITLE_FIELD).
		All(&entries); err != nil {
		return nil, err
	}

	// Load all users so the quick filter can show every account, not only
	// editors currently referenced by entries in the table.
	usersMap := map[string]*dbmodels.User{}
	users, err := dbmodels.Users_All(app.PB.App)
	if err != nil {
		return nil, err
	}
	for _, user := range users {
		if user != nil {
			usersMap[user.Id] = user
		}
	}

	sortedEntries := buildBaendeSortedEntries(entries)

	return &BaendeCache{
		Entries:       entries,
		SortedEntries: sortedEntries,
		Users:         usersMap,
		CachedAt:      time.Now(),
	}, nil
}

func buildBaendeSortedEntries(entries []*dbmodels.Entry) map[string][]*dbmodels.Entry {
	sorted := map[string][]*dbmodels.Entry{
		"title":          cloneBaendeEntries(entries),
		"alm":            cloneBaendeEntries(entries),
		"year":           cloneBaendeEntries(entries),
		"responsibility": cloneBaendeEntries(entries),
		"place":          cloneBaendeEntries(entries),
		"updated":        cloneBaendeEntries(entries),
	}

	dbmodels.Sort_Entries_Title_Year(sorted["title"])
	dbmodels.Sort_Entries_MusenalmID(sorted["alm"])
	dbmodels.Sort_Entries_Year_Title(sorted["year"])
	dbmodels.Sort_Entries_Responsibility_Title(sorted["responsibility"])
	dbmodels.Sort_Entries_Place_Title(sorted["place"])
	dbmodels.Sort_Entries_Updated(sorted["updated"])

	return sorted
}

func cloneBaendeEntries(entries []*dbmodels.Entry) []*dbmodels.Entry {
	cloned := make([]*dbmodels.Entry, len(entries))
	copy(cloned, entries)
	return cloned
}

func (app *App) ResetEntryAgentOrderCache() {
	app.ScheduleEntryAgentOrderCacheRebuild()
}

func (app *App) ScheduleEntryAgentOrderCacheRebuild() {
	app.entryAgentOrderCacheRefreshMutex.Lock()
	app.entryAgentOrderCacheRefreshQueued = true
	if app.entryAgentOrderCacheRefreshRun {
		app.entryAgentOrderCacheRefreshMutex.Unlock()
		return
	}
	app.entryAgentOrderCacheRefreshRun = true
	app.entryAgentOrderCacheRefreshMutex.Unlock()

	go app.runEntryAgentOrderCacheRefreshLoop()
}

func (app *App) runEntryAgentOrderCacheRefreshLoop() {
	for {
		app.entryAgentOrderCacheRefreshMutex.Lock()
		app.entryAgentOrderCacheRefreshQueued = false
		app.entryAgentOrderCacheRefreshMutex.Unlock()

		if _, err := app.rebuildEntryAgentOrderCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild entry agent order cache", "error", err)
		}

		app.entryAgentOrderCacheRefreshMutex.Lock()
		if app.entryAgentOrderCacheRefreshQueued {
			app.entryAgentOrderCacheRefreshMutex.Unlock()
			continue
		}
		app.entryAgentOrderCacheRefreshRun = false
		app.entryAgentOrderCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureEntryAgentOrderCache() (*OrderedIDsCache, error) {
	if cache := app.entryAgentOrderCache.Load(); cache != nil {
		return cache, nil
	}

	app.entryAgentOrderCacheBuildMutex.Lock()
	defer app.entryAgentOrderCacheBuildMutex.Unlock()

	if cache := app.entryAgentOrderCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextEntryAgentOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.entryAgentOrderCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildEntryAgentOrderCache() (*OrderedIDsCache, error) {
	app.entryAgentOrderCacheBuildMutex.Lock()
	defer app.entryAgentOrderCacheBuildMutex.Unlock()

	cache, err := app.nextEntryAgentOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.entryAgentOrderCache.Store(cache)
	return cache, nil
}

func (app *App) nextEntryAgentOrderCacheSnapshot() (*OrderedIDsCache, error) {
	if app.entryAgentOrderCacheBuildFunc != nil {
		return app.entryAgentOrderCacheBuildFunc()
	}
	ids, err := buildOrderedEntryAgentIDs(app.PB.App)
	if err != nil {
		return nil, err
	}
	return &OrderedIDsCache{IDs: ids, CachedAt: time.Now()}, nil
}

func (app *App) GetEntryAgentOrderIDs() ([]string, error) {
	cache, err := app.EnsureEntryAgentOrderCache()
	if err != nil {
		return nil, err
	}
	return cache.IDs, nil
}

func (app *App) ResetContentAgentOrderCache() {
	app.ScheduleContentAgentOrderCacheRebuild()
}

func (app *App) ScheduleContentAgentOrderCacheRebuild() {
	app.contentAgentOrderCacheRefreshMutex.Lock()
	app.contentAgentOrderCacheRefreshQueued = true
	if app.contentAgentOrderCacheRefreshRun {
		app.contentAgentOrderCacheRefreshMutex.Unlock()
		return
	}
	app.contentAgentOrderCacheRefreshRun = true
	app.contentAgentOrderCacheRefreshMutex.Unlock()

	go app.runContentAgentOrderCacheRefreshLoop()
}

func (app *App) runContentAgentOrderCacheRefreshLoop() {
	for {
		app.contentAgentOrderCacheRefreshMutex.Lock()
		app.contentAgentOrderCacheRefreshQueued = false
		app.contentAgentOrderCacheRefreshMutex.Unlock()

		if _, err := app.rebuildContentAgentOrderCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild content agent order cache", "error", err)
		}

		app.contentAgentOrderCacheRefreshMutex.Lock()
		if app.contentAgentOrderCacheRefreshQueued {
			app.contentAgentOrderCacheRefreshMutex.Unlock()
			continue
		}
		app.contentAgentOrderCacheRefreshRun = false
		app.contentAgentOrderCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureContentAgentOrderCache() (*OrderedIDsCache, error) {
	if cache := app.contentAgentOrderCache.Load(); cache != nil {
		return cache, nil
	}

	app.contentAgentOrderCacheBuildMutex.Lock()
	defer app.contentAgentOrderCacheBuildMutex.Unlock()

	if cache := app.contentAgentOrderCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextContentAgentOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.contentAgentOrderCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildContentAgentOrderCache() (*OrderedIDsCache, error) {
	app.contentAgentOrderCacheBuildMutex.Lock()
	defer app.contentAgentOrderCacheBuildMutex.Unlock()

	cache, err := app.nextContentAgentOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.contentAgentOrderCache.Store(cache)
	return cache, nil
}

func (app *App) nextContentAgentOrderCacheSnapshot() (*OrderedIDsCache, error) {
	if app.contentAgentOrderCacheBuildFunc != nil {
		return app.contentAgentOrderCacheBuildFunc()
	}
	ids, err := buildOrderedContentAgentIDs(app.PB.App)
	if err != nil {
		return nil, err
	}
	return &OrderedIDsCache{IDs: ids, CachedAt: time.Now()}, nil
}

func (app *App) GetContentAgentOrderIDs() ([]string, error) {
	cache, err := app.EnsureContentAgentOrderCache()
	if err != nil {
		return nil, err
	}
	return cache.IDs, nil
}

func (app *App) ResetSeriesOrderCache() {
	app.ScheduleSeriesOrderCacheRebuild()
}

func (app *App) ScheduleSeriesOrderCacheRebuild() {
	app.seriesOrderCacheRefreshMutex.Lock()
	app.seriesOrderCacheRefreshQueued = true
	if app.seriesOrderCacheRefreshRun {
		app.seriesOrderCacheRefreshMutex.Unlock()
		return
	}
	app.seriesOrderCacheRefreshRun = true
	app.seriesOrderCacheRefreshMutex.Unlock()

	go app.runSeriesOrderCacheRefreshLoop()
}

func (app *App) runSeriesOrderCacheRefreshLoop() {
	for {
		app.seriesOrderCacheRefreshMutex.Lock()
		app.seriesOrderCacheRefreshQueued = false
		app.seriesOrderCacheRefreshMutex.Unlock()

		if _, err := app.rebuildSeriesOrderCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild series order cache", "error", err)
		}

		app.seriesOrderCacheRefreshMutex.Lock()
		if app.seriesOrderCacheRefreshQueued {
			app.seriesOrderCacheRefreshMutex.Unlock()
			continue
		}
		app.seriesOrderCacheRefreshRun = false
		app.seriesOrderCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsureSeriesOrderCache() (*OrderedIDsCache, error) {
	if cache := app.seriesOrderCache.Load(); cache != nil {
		return cache, nil
	}

	app.seriesOrderCacheBuildMutex.Lock()
	defer app.seriesOrderCacheBuildMutex.Unlock()

	if cache := app.seriesOrderCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextSeriesOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.seriesOrderCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildSeriesOrderCache() (*OrderedIDsCache, error) {
	app.seriesOrderCacheBuildMutex.Lock()
	defer app.seriesOrderCacheBuildMutex.Unlock()

	cache, err := app.nextSeriesOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.seriesOrderCache.Store(cache)
	return cache, nil
}

func (app *App) nextSeriesOrderCacheSnapshot() (*OrderedIDsCache, error) {
	if app.seriesOrderCacheBuildFunc != nil {
		return app.seriesOrderCacheBuildFunc()
	}
	ids, err := buildOrderedSeriesIDs(app.PB.App)
	if err != nil {
		return nil, err
	}
	return &OrderedIDsCache{IDs: ids, CachedAt: time.Now()}, nil
}

func (app *App) GetSeriesOrderIDs() ([]string, error) {
	cache, err := app.EnsureSeriesOrderCache()
	if err != nil {
		return nil, err
	}
	return cache.IDs, nil
}

func (app *App) ResetPlaceOrderCache() {
	app.SchedulePlaceOrderCacheRebuild()
}

func (app *App) SchedulePlaceOrderCacheRebuild() {
	app.placeOrderCacheRefreshMutex.Lock()
	app.placeOrderCacheRefreshQueued = true
	if app.placeOrderCacheRefreshRun {
		app.placeOrderCacheRefreshMutex.Unlock()
		return
	}
	app.placeOrderCacheRefreshRun = true
	app.placeOrderCacheRefreshMutex.Unlock()

	go app.runPlaceOrderCacheRefreshLoop()
}

func (app *App) runPlaceOrderCacheRefreshLoop() {
	for {
		app.placeOrderCacheRefreshMutex.Lock()
		app.placeOrderCacheRefreshQueued = false
		app.placeOrderCacheRefreshMutex.Unlock()

		if _, err := app.rebuildPlaceOrderCache(); err != nil {
			app.PB.Logger().Error("failed to rebuild place order cache", "error", err)
		}

		app.placeOrderCacheRefreshMutex.Lock()
		if app.placeOrderCacheRefreshQueued {
			app.placeOrderCacheRefreshMutex.Unlock()
			continue
		}
		app.placeOrderCacheRefreshRun = false
		app.placeOrderCacheRefreshMutex.Unlock()
		return
	}
}

func (app *App) EnsurePlaceOrderCache() (*OrderedIDsCache, error) {
	if cache := app.placeOrderCache.Load(); cache != nil {
		return cache, nil
	}

	app.placeOrderCacheBuildMutex.Lock()
	defer app.placeOrderCacheBuildMutex.Unlock()

	if cache := app.placeOrderCache.Load(); cache != nil {
		return cache, nil
	}

	cache, err := app.nextPlaceOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.placeOrderCache.Store(cache)
	return cache, nil
}

func (app *App) rebuildPlaceOrderCache() (*OrderedIDsCache, error) {
	app.placeOrderCacheBuildMutex.Lock()
	defer app.placeOrderCacheBuildMutex.Unlock()

	cache, err := app.nextPlaceOrderCacheSnapshot()
	if err != nil {
		return nil, err
	}
	app.placeOrderCache.Store(cache)
	return cache, nil
}

func (app *App) nextPlaceOrderCacheSnapshot() (*OrderedIDsCache, error) {
	if app.placeOrderCacheBuildFunc != nil {
		return app.placeOrderCacheBuildFunc()
	}
	ids, err := buildOrderedPlaceIDs(app.PB.App)
	if err != nil {
		return nil, err
	}
	return &OrderedIDsCache{IDs: ids, CachedAt: time.Now()}, nil
}

func (app *App) GetPlaceOrderIDs() ([]string, error) {
	cache, err := app.EnsurePlaceOrderCache()
	if err != nil {
		return nil, err
	}
	return cache.IDs, nil
}

func buildOrderedEntryAgentIDs(app core.App) ([]string, error) {
	rels := []*dbmodels.REntriesAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).All(&rels); err != nil {
		return nil, err
	}
	return buildOrderedRelatedAgentIDs(app, collectEntryRelationAgentIDs(rels))
}

func buildOrderedContentAgentIDs(app core.App) ([]string, error) {
	rels := []*dbmodels.RContentsAgents{}
	if err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE)).All(&rels); err != nil {
		return nil, err
	}
	return buildOrderedRelatedAgentIDs(app, collectContentRelationAgentIDs(rels))
}

func buildOrderedRelatedAgentIDs(app core.App, ids []string) ([]string, error) {
	if len(ids) == 0 {
		return []string{}, nil
	}
	agentIDs := make([]any, 0, len(ids))
	for _, id := range ids {
		agentIDs = append(agentIDs, id)
	}
	agents, err := dbmodels.Agents_IDs(app, agentIDs)
	if err != nil {
		return nil, err
	}
	dbmodels.Sort_Agents_Name(agents)
	ordered := make([]string, 0, len(agents))
	for _, agent := range agents {
		if agent != nil {
			ordered = append(ordered, agent.Id)
		}
	}
	return ordered, nil
}

func collectEntryRelationAgentIDs(rels []*dbmodels.REntriesAgents) []string {
	seen := map[string]struct{}{}
	ids := make([]string, 0, len(rels))
	for _, rel := range rels {
		if rel == nil || rel.Agent() == "" {
			continue
		}
		if _, ok := seen[rel.Agent()]; ok {
			continue
		}
		seen[rel.Agent()] = struct{}{}
		ids = append(ids, rel.Agent())
	}
	return ids
}

func collectContentRelationAgentIDs(rels []*dbmodels.RContentsAgents) []string {
	seen := map[string]struct{}{}
	ids := make([]string, 0, len(rels))
	for _, rel := range rels {
		if rel == nil || rel.Agent() == "" {
			continue
		}
		if _, ok := seen[rel.Agent()]; ok {
			continue
		}
		seen[rel.Agent()] = struct{}{}
		ids = append(ids, rel.Agent())
	}
	return ids
}

func buildOrderedSeriesIDs(app core.App) ([]string, error) {
	series := []*dbmodels.Series{}
	if err := app.RecordQuery(dbmodels.SERIES_TABLE).All(&series); err != nil {
		return nil, err
	}
	dbmodels.Sort_Series_Title(series)
	ids := make([]string, 0, len(series))
	for _, item := range series {
		if item != nil {
			ids = append(ids, item.Id)
		}
	}
	return ids, nil
}

func buildOrderedPlaceIDs(app core.App) ([]string, error) {
	places := []*dbmodels.Place{}
	if err := app.RecordQuery(dbmodels.PLACES_TABLE).All(&places); err != nil {
		return nil, err
	}
	dbmodels.Sort_Places_Name(places)
	ids := make([]string, 0, len(places))
	for _, place := range places {
		if place != nil {
			ids = append(ids, place.Id)
		}
	}
	return ids, nil
}

func (app *App) GetBaendeCache() (pagemodels.BaendeCacheInterface, error) {
	return app.EnsureBaendeCache()
}

func (app *App) GetCanonicalStore() *canonical.Store {
	return app.canonicalStore
}

func (app *App) setWatchers(engine *templating.Engine) {
	// INFO: hot reloading for poor people
	watcher, err := EngineWatcher(engine)
	if err != nil {
		app.PB.Logger().Error("Failed to create watcher, continuing without", "error", err)
	} else {
		watcher.AddRecursive(LAYOUT_DIR)
		watcher.AddRecursive(ROUTES_DIR)
		rwatcher, err := RefreshWatcher(engine)
		if err != nil {
			app.PB.Logger().Error("Failed to create watcher, continuing without", "error", err)
		} else {
			rwatcher.Add("./views/assets")
		}
	}
}

func (app *App) bindPages(engine *templating.Engine) ServeFunc {
	return func(e *core.ServeEvent) error {
		e.Router.GET("/assets/{path...}", apis.Static(views.StaticFS, true))
		e.Router.Bind(apis.Gzip())
		// INFO: Global middleware to get the authenticated user:
		e.Router.BindFunc(middleware.Authenticated(e.App))

		// INFO: we put this here, to make sure all migrations are done
		for _, page := range pages {
			err := page.Up(app, engine)
			if err != nil {
				app.PB.Logger().Error("Failed to up page %q: %v", "error", err)
				page.Down(app, engine)
				continue
			}
			app.Pages = append(app.Pages, page)
		}

		for _, page := range app.Pages {
			page.Setup(e.Router, app, engine)
		}

		StartWeeklyFTS5Rebuild(e.App)

		return e.Next()
	}
}
