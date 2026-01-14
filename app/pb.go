package app

import (
	"database/sql"
	"fmt"
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
	dataCache map[string]any
	dataMutex sync.RWMutex
	htmlCache map[string]any
	htmlMutex sync.RWMutex
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

func New(config Config) App {
	app := App{
		MAConfig: config,
	}

	app.createPBInstance()
	app.Bootstrap()

	return app
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
		if len(app.dataCache) == 0 {
			data, err := dbmodels.Data_All(app.PB.App)
			if err != nil {
				app.PB.Logger().Error("Failed to fetch data cache: %v", err)
				return "{}"
			}
			app.dataMutex.Lock()
			for _, d := range data {
				app.dataCache[d.Key()] = d.Value()
			}
			app.dataMutex.Unlock()
		}
		app.dataMutex.RLock()
		defer app.dataMutex.RUnlock()
		return app.dataCache[key]
	})

	app.ResetHtmlCache()
	engine.AddFunc("html", func(key string) any {
		if len(app.htmlCache) == 0 {
			html, err := dbmodels.Html_All(app.PB.App)
			if err != nil {
				app.PB.Logger().Error("Failed to fetch html cache: %v", err)
				return "{}"
			}
			app.htmlMutex.Lock()
			for _, h := range html {
				app.htmlCache[h.Key()] = h.HTML()
			}
			app.htmlMutex.Unlock()
		}
		app.htmlMutex.RLock()
		defer app.htmlMutex.RUnlock()
		return app.htmlCache[key]
	})

	return engine, nil
}

// BUG: we cant call this from the templates, bc this App struct is not available
func (app *App) ResetDataCache() {
	app.dataMutex.Lock()
	defer app.dataMutex.Unlock()
	app.dataCache = make(map[string]any)
}

func (app *App) ResetHtmlCache() {
	app.htmlMutex.Lock()
	defer app.htmlMutex.Unlock()
	app.htmlCache = make(map[string]any)
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
			err := page.Up(e.App, engine)
			if err != nil {
				app.PB.Logger().Error("Failed to up page %q: %v", "error", err)
				page.Down(e.App, engine)
				continue
			}
			app.Pages = append(app.Pages, page)
		}

		for _, page := range app.Pages {
			page.Setup(e.Router, e.App, engine)
		}

		return e.Next()
	}
}
