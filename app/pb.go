package app

import (
	"database/sql"
	"fmt"
	"html/template"
	"log/slog"
	"sort"
	"strings"
	"sync"
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
	PB               *pocketbase.PocketBase
	MAConfig         Config
	Pages            []pagemodels.IPage
	dataCache        *PrefixCache
	dataMutex        sync.RWMutex
	htmlCache        *PrefixCache
	htmlMutex        sync.RWMutex
	pagesCache       map[string]PageMetaData
	pagesMutex       sync.RWMutex
	imagesCache      map[string]*dbmodels.Image
	imagesMutex      sync.RWMutex
	baendeCache      *BaendeCache
	baendeCacheMutex sync.RWMutex
	canonicalStore   *canonical.Store
}

type BaendeCache struct {
	Entries       []*dbmodels.Entry
	SortedEntries map[string][]*dbmodels.Entry
	Series        map[string]*dbmodels.Series
	EntriesSeries map[string][]*dbmodels.REntriesSeries
	Places        map[string]*dbmodels.Place
	Agents        map[string]*dbmodels.Agent
	EntriesAgents map[string][]*dbmodels.REntriesAgents
	Items         map[string][]*dbmodels.Item
	Users         map[string]*dbmodels.User
	ContentsCount map[string]int
	CachedAt      time.Time
}

// Implement BaendeCacheInterface methods
func (bc *BaendeCache) GetEntries() interface{} {
	return bc.Entries
}

func (bc *BaendeCache) GetSortedEntries() interface{} {
	return bc.SortedEntries
}

func (bc *BaendeCache) GetSeries() interface{} {
	return bc.Series
}

func (bc *BaendeCache) GetEntriesSeries() interface{} {
	return bc.EntriesSeries
}

func (bc *BaendeCache) GetPlaces() interface{} {
	return bc.Places
}

func (bc *BaendeCache) GetAgents() interface{} {
	return bc.Agents
}

func (bc *BaendeCache) GetEntriesAgents() interface{} {
	return bc.EntriesAgents
}

func (bc *BaendeCache) GetItems() interface{} {
	return bc.Items
}

func (bc *BaendeCache) GetUsers() interface{} {
	return bc.Users
}

func (bc *BaendeCache) GetContentsCount() interface{} {
	return bc.ContentsCount
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
		MAConfig: config,
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
			return fmt.Errorf("Failed to fetch %q collection: %w.", core.CollectionNameSuperusers, err)
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
				return fmt.Errorf("Failed to delete superuser account: %w.", err)
			}

			return nil
		} else if err != nil {
			return nil
		}

		superuser.SetEmail(TEST_SUPERUSER_MAIL)
		superuser.SetPassword(TEST_SUPERUSER_PASS)

		if err := e.App.Save(superuser); err != nil {
			return fmt.Errorf("Failed to upsert superuser account: %w.", err)
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

	app.ResetDataCache()
	engine.AddFunc("data", func(key string) any {
		app.ensureDataCache()
		app.dataMutex.RLock()
		defer app.dataMutex.RUnlock()
		return app.dataCache.Get(key)
	})
	engine.AddFunc("dataPrefix", func(prefix string) map[string]any {
		app.ensureDataCache()
		app.dataMutex.RLock()
		defer app.dataMutex.RUnlock()
		return app.dataCache.GetPrefix(prefix)
	})

	app.ResetHtmlCache()
	engine.AddFunc("html", func(key string) any {
		app.ensureHtmlCache()
		app.htmlMutex.RLock()
		defer app.htmlMutex.RUnlock()
		return app.htmlCache.Get(key)
	})
	engine.AddFunc("help", func(table string, field ...string) template.HTML {
		app.ensureHtmlCache()
		key := "help." + table
		if len(field) > 0 && field[0] != "" {
			key = key + "." + field[0]
		}
		app.htmlMutex.RLock()
		defer app.htmlMutex.RUnlock()
		return template.HTML(app.htmlCache.GetString(key))
	})
	engine.AddFunc("helpOr", func(table, field, fallback string) template.HTML {
		app.ensureHtmlCache()
		key := "help." + table + "." + field
		app.htmlMutex.RLock()
		value := app.htmlCache.GetString(key)
		app.htmlMutex.RUnlock()
		if value == "" {
			value = fallback
		}
		return template.HTML(value)
	})
	app.ResetPagesCache()
	engine.AddFunc("pageMeta", func(name string) map[string]any {
		app.ensurePagesCache()
		app.pagesMutex.RLock()
		meta, ok := app.pagesCache[name]
		app.pagesMutex.RUnlock()
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
		app.ensurePagesCache()
		app.pagesMutex.RLock()
		meta, ok := app.pagesCache[name]
		app.pagesMutex.RUnlock()
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
		app.ensureHtmlCache()
		key := "page." + name
		if len(section) > 0 && section[0] != "" {
			key = key + "." + section[0]
		}
		app.htmlMutex.RLock()
		defer app.htmlMutex.RUnlock()
		return template.HTML(app.htmlCache.GetString(key))
	})
	engine.AddFunc("imagePath", func(key string, preview ...bool) string {
		app.ensureImagesCache()
		app.imagesMutex.RLock()
		image := app.imagesCache[key]
		app.imagesMutex.RUnlock()
		if image == nil {
			return ""
		}
		if len(preview) > 0 && preview[0] {
			return image.PreviewPath()
		}
		return image.ImagePath()
	})
	engine.AddFunc("htmlPrefix", func(prefix string) map[string]any {
		app.ensureHtmlCache()
		app.htmlMutex.RLock()
		defer app.htmlMutex.RUnlock()
		return app.htmlCache.GetPrefix(prefix)
	})

	app.ResetImagesCache()
	return engine, nil
}

// Core returns the underlying pocketbase core.App
func (app *App) Core() core.App {
	return app.PB.App
}

func (app *App) ResetDataCache() {
	app.dataMutex.Lock()
	defer app.dataMutex.Unlock()
	app.dataCache = NewPrefixCache()
}

func (app *App) ResetHtmlCache() {
	app.htmlMutex.Lock()
	defer app.htmlMutex.Unlock()
	app.htmlCache = NewPrefixCache()
}

func (app *App) ResetImagesCache() {
	app.imagesMutex.Lock()
	defer app.imagesMutex.Unlock()
	app.imagesCache = make(map[string]*dbmodels.Image)
}

func (app *App) ResetPagesCache() {
	app.pagesMutex.Lock()
	defer app.pagesMutex.Unlock()
	app.pagesCache = make(map[string]PageMetaData)
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

func (app *App) ensureDataCache() {
	app.dataMutex.RLock()
	if app.dataCache != nil && len(app.dataCache.data) > 0 {
		app.dataMutex.RUnlock()
		return
	}
	app.dataMutex.RUnlock()

	data, err := dbmodels.Data_All(app.PB.App)
	if err != nil {
		app.PB.Logger().Error("Failed to fetch data cache: %v", err)
		return
	}

	cache := NewPrefixCache()
	cache.keys = make([]string, 0, len(data))
	for _, d := range data {
		key := d.Key()
		cache.data[key] = d.Value()
		cache.keys = append(cache.keys, key)
	}
	sort.Strings(cache.keys)

	app.dataMutex.Lock()
	if app.dataCache == nil || len(app.dataCache.data) == 0 {
		app.dataCache = cache
	}
	app.dataMutex.Unlock()
}

func (app *App) ensureHtmlCache() {
	app.htmlMutex.RLock()
	if app.htmlCache != nil && len(app.htmlCache.data) > 0 {
		app.htmlMutex.RUnlock()
		return
	}
	app.htmlMutex.RUnlock()

	html, err := dbmodels.Html_All(app.PB.App)
	if err != nil {
		app.PB.Logger().Error("Failed to fetch html cache: %v", err)
		return
	}

	cache := NewPrefixCache()
	cache.keys = make([]string, 0, len(html))
	for _, h := range html {
		key := h.Key()
		cache.data[key] = h.HTML()
		cache.keys = append(cache.keys, key)
	}
	sort.Strings(cache.keys)

	app.htmlMutex.Lock()
	if app.htmlCache == nil || len(app.htmlCache.data) == 0 {
		app.htmlCache = cache
	}
	app.htmlMutex.Unlock()
}

func (app *App) ensurePagesCache() {
	app.pagesMutex.RLock()
	if app.pagesCache != nil && len(app.pagesCache) > 0 {
		app.pagesMutex.RUnlock()
		return
	}
	app.pagesMutex.RUnlock()

	pages, err := dbmodels.Pages_All(app.PB.App)
	if err != nil {
		app.PB.Logger().Error("Failed to fetch pages cache: %v", err)
		return
	}

	cache := make(map[string]PageMetaData, len(pages))
	for _, page := range pages {
		meta := PageMetaData{
			Title: page.Title(),
		}
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

	app.pagesMutex.Lock()
	if app.pagesCache == nil || len(app.pagesCache) == 0 {
		app.pagesCache = cache
	}
	app.pagesMutex.Unlock()
}

func (app *App) ensureImagesCache() {
	app.imagesMutex.RLock()
	if app.imagesCache != nil && len(app.imagesCache) > 0 {
		app.imagesMutex.RUnlock()
		return
	}
	app.imagesMutex.RUnlock()

	images, err := dbmodels.Images_All(app.PB.App)
	if err != nil {
		app.PB.Logger().Error("Failed to fetch images cache: %v", err)
		return
	}

	cache := make(map[string]*dbmodels.Image, len(images))
	for _, image := range images {
		cache[image.Key()] = image
	}

	app.imagesMutex.Lock()
	if app.imagesCache == nil || len(app.imagesCache) == 0 {
		app.imagesCache = cache
	}
	app.imagesMutex.Unlock()
}

func (app *App) ResetBaendeCache() {
	app.baendeCacheMutex.Lock()
	defer app.baendeCacheMutex.Unlock()
	app.baendeCache = nil
}

func (app *App) EnsureBaendeCache() (*BaendeCache, error) {
	// Check if cache is valid with read lock
	app.baendeCacheMutex.RLock()
	if app.baendeCache != nil && time.Since(app.baendeCache.CachedAt) < time.Hour {
		cache := app.baendeCache
		app.baendeCacheMutex.RUnlock()
		return cache, nil
	}
	app.baendeCacheMutex.RUnlock()

	// Acquire write lock to populate cache
	app.baendeCacheMutex.Lock()
	defer app.baendeCacheMutex.Unlock()

	// Double-check after acquiring write lock
	if app.baendeCache != nil && time.Since(app.baendeCache.CachedAt) < time.Hour {
		return app.baendeCache, nil
	}

	// Load all entries sorted by PreferredTitle
	entries := []*dbmodels.Entry{}
	if err := app.PB.RecordQuery(dbmodels.ENTRIES_TABLE).
		OrderBy(dbmodels.PREFERRED_TITLE_FIELD).
		All(&entries); err != nil {
		return nil, err
	}

	// Collect entry IDs
	entryIDs := make([]any, 0, len(entries))
	for _, entry := range entries {
		entryIDs = append(entryIDs, entry.Id)
	}

	// Load series and relations
	seriesMap := map[string]*dbmodels.Series{}
	entrySeriesMap := map[string][]*dbmodels.REntriesSeries{}
	if len(entries) > 0 {
		relations, err := dbmodels.REntriesSeries_Entries(app.PB.App, dbmodels.Ids(entries))
		if err != nil {
			return nil, err
		}

		seriesIDs := []any{}
		for _, r := range relations {
			seriesIDs = append(seriesIDs, r.Series())
			entrySeriesMap[r.Entry()] = append(entrySeriesMap[r.Entry()], r)
		}

		if len(seriesIDs) > 0 {
			series, err := dbmodels.Series_IDs(app.PB.App, seriesIDs)
			if err != nil {
				return nil, err
			}
			for _, s := range series {
				seriesMap[s.Id] = s
			}
		}
	}

	// Load agents and relations
	agentsMap := map[string]*dbmodels.Agent{}
	entryAgentsMap := map[string][]*dbmodels.REntriesAgents{}
	if len(entryIDs) > 0 {
		arelations, err := dbmodels.REntriesAgents_Entries(app.PB.App, entryIDs)
		if err != nil {
			return nil, err
		}

		agentIDs := []any{}
		for _, r := range arelations {
			agentIDs = append(agentIDs, r.Agent())
			entryAgentsMap[r.Entry()] = append(entryAgentsMap[r.Entry()], r)
		}

		if len(agentIDs) > 0 {
			agents, err := dbmodels.Agents_IDs(app.PB.App, agentIDs)
			if err != nil {
				return nil, err
			}
			for _, a := range agents {
				agentsMap[a.Id] = a
			}
		}
	}

	// Load places
	placesMap := map[string]*dbmodels.Place{}
	placesIDs := []any{}
	for _, entry := range entries {
		for _, placeID := range entry.Places() {
			placesIDs = append(placesIDs, placeID)
		}
	}
	if len(placesIDs) > 0 {
		places, err := dbmodels.Places_IDs(app.PB.App, placesIDs)
		if err != nil {
			return nil, err
		}
		for _, place := range places {
			placesMap[place.Id] = place
		}
	}

	// Load items
	itemsMap := map[string][]*dbmodels.Item{}
	if len(entryIDs) > 0 {
		allItems, err := dbmodels.Items_Entries(app.PB.App, entryIDs)
		if err != nil {
			return nil, err
		}

		interestedEntries := make(map[string]struct{})
		for _, id := range entryIDs {
			interestedEntries[id.(string)] = struct{}{}
		}

		for _, item := range allItems {
			for _, entryID := range item.Entries() {
				if _, ok := interestedEntries[entryID]; ok {
					itemsMap[entryID] = append(itemsMap[entryID], item)
				}
			}
		}
	}

	// Load contents counts
	contentsCount := map[string]int{}
	if len(entryIDs) > 0 {
		counts, err := dbmodels.CountContentsEntries(app.PB.App, entryIDs)
		if err != nil {
			return nil, err
		}
		contentsCount = counts
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

	sortedEntries := buildBaendeSortedEntries(entries, itemsMap)

	app.baendeCache = &BaendeCache{
		Entries:       entries,
		SortedEntries: sortedEntries,
		Series:        seriesMap,
		EntriesSeries: entrySeriesMap,
		Places:        placesMap,
		Agents:        agentsMap,
		EntriesAgents: entryAgentsMap,
		Items:         itemsMap,
		Users:         usersMap,
		ContentsCount: contentsCount,
		CachedAt:      time.Now(),
	}

	return app.baendeCache, nil
}

func buildBaendeSortedEntries(entries []*dbmodels.Entry, itemsMap map[string][]*dbmodels.Item) map[string][]*dbmodels.Entry {
	sorted := map[string][]*dbmodels.Entry{
		"title":          cloneBaendeEntries(entries),
		"alm":            cloneBaendeEntries(entries),
		"year":           cloneBaendeEntries(entries),
		"signatur":       cloneBaendeEntries(entries),
		"responsibility": cloneBaendeEntries(entries),
		"place":          cloneBaendeEntries(entries),
		"updated":        cloneBaendeEntries(entries),
	}

	dbmodels.Sort_Entries_Title_Year(sorted["title"])
	dbmodels.Sort_Entries_MusenalmID(sorted["alm"])
	dbmodels.Sort_Entries_Year_Title(sorted["year"])
	dbmodels.Sort_Entries_Signatur(sorted["signatur"], itemsMap)
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
		r := e.Router.GET("/assets/{path...}", apis.Static(views.StaticFS, true))
		r.Bind(apis.Gzip())
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
