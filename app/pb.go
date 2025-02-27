package app

import (
	"database/sql"
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/Theodor-Springmann-Stiftung/musenalm/views"
	"github.com/fsnotify/fsnotify"
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

// INFO: this is the main application that mainly is a pocketbase wrapper
type App struct {
	PB       *pocketbase.PocketBase
	MAConfig Config
	Pages    []pagemodels.IPage
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
	app.setupTestuser()

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

func (app *App) setupTestuser() {
	app.PB.OnServe().BindFunc(func(e *core.ServeEvent) error {
		superusersCol, err := e.App.FindCachedCollectionByNameOrId(core.CollectionNameSuperusers)
		if err != nil {
			return fmt.Errorf("Failed to fetch %q collection: %w.", core.CollectionNameSuperusers, err)
		}

		superuser, err := e.App.FindAuthRecordByEmail(superusersCol, TEST_SUPERUSER_MAIL)
		if err != nil {
			superuser = core.NewRecord(superusersCol)
		} else if !app.MAConfig.AllowTestLogin {
			// INFO: we to it as a raw query here since PB does not support deleting the last superuser
			_, err = e.App.DB().
				NewQuery("DELETE FROM " + superusersCol.Name + " WHERE id = '" + superuser.Id + "'").
				Execute()
			if err != nil {
				return fmt.Errorf("Failed to delete superuser account: %w.", err)
			}

			return e.Next()
		}

		superuser.SetEmail(TEST_SUPERUSER_MAIL)
		superuser.SetPassword(TEST_SUPERUSER_PASS)

		if err := e.App.Save(superuser); err != nil {
			return fmt.Errorf("Failed to upsert superuser account: %w.", err)
		}

		return e.Next()
	})
}

func (app *App) Serve() error {
	engine := templating.NewEngine(&views.LayoutFS, &views.RoutesFS)
	engine.Globals(map[string]interface{}{
		"isDev": app.MAConfig.Debug,
		"lang":  "de",
		"site": map[string]interface{}{
			"title": "Musenalm",
			"lang":  "de",
			"desc":  "Bibliographie deutscher Almanache des 18. und 19. Jahrhunderts",
		}})

	// INFO: hot reloading for poor people
	if app.MAConfig.Debug {
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

	app.PB.OnBootstrap().BindFunc(func(e *core.BootstrapEvent) error {
		if err := e.Next(); err != nil {
			return err
		}

		return nil
	})

	app.PB.OnServe().BindFunc(func(e *core.ServeEvent) error {
		e.Router.GET("/assets/{path...}", apis.Static(views.StaticFS, true))
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
	})
	return app.PB.Start()
}

func (app *App) watchFN(watcher *fsnotify.Watcher, engine *templating.Engine) {
	for {
		select {
		case _, ok := <-watcher.Events:
			if !ok {
				return
			}
			engine.Reload()
		case err, ok := <-watcher.Errors:
			if !ok {
				return
			}
			fmt.Println("error:", err)
		}
	}
}
