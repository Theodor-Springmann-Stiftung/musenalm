package app

import (
	"database/sql"
	"fmt"
	"html/template"
	"log/slog"
	"sort"
	"strings"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
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
	PB        *pocketbase.PocketBase
	MAConfig  Config
	Pages     []pagemodels.IPage
	dataCache *PrefixCache
	dataMutex sync.RWMutex
	htmlCache *PrefixCache
	htmlMutex sync.RWMutex
	imagesCache map[string]*dbmodels.Image
	imagesMutex sync.RWMutex
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

	if app.MAConfig.Debug {
		app.setWatchers(engine)
	}

	// INFO: we use OnServe, but here is also OnBootstrap
	app.PB.OnServe().BindFunc(app.bindPages(engine))
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
	engine.AddFunc("pageMeta", func(name string) map[string]any {
		app.ensureDataCache()
		key := "page." + name
		app.dataMutex.RLock()
		value := app.dataCache.Get(key)
		app.dataMutex.RUnlock()
		if value == nil {
			return map[string]any{}
		}
		if meta, ok := value.(map[string]any); ok {
			return meta
		}
		if meta, ok := value.(map[string]interface{}); ok {
			return meta
		}
		return map[string]any{}
	})
	engine.AddFunc("pageMetaField", func(name, field string) string {
		app.ensureDataCache()
		key := "page." + name
		app.dataMutex.RLock()
		value := app.dataCache.Get(key)
		app.dataMutex.RUnlock()
		if value == nil {
			return ""
		}
		meta, ok := value.(map[string]any)
		if !ok {
			if metaAlt, ok := value.(map[string]interface{}); ok {
				meta = map[string]any(metaAlt)
			} else {
				return ""
			}
		}
		fieldValue, ok := meta[field]
		if !ok || fieldValue == nil {
			return ""
		}
		if s, ok := fieldValue.(string); ok {
			return s
		}
		return fmt.Sprint(fieldValue)
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

type PrefixCache struct {
	data map[string]any
	keys []string
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

func (app *App) setWatchers(engine *templating.Engine) {
	// INFO: hot reloading for poor people
	watcher, err := EngineWatcher(engine)
	if err != nil {
		app.PB.Logger().Error("Failed to create watcher, continuing without", "error", err)
	} else {
		watcher.AddRecursive(LAYOUT_DIR)
		watcher.AddRecursive(ROUTES_DIR)
		engine.Debug()
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

		return e.Next()
	}
}
