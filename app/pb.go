package app

import (
	"database/sql"
	"fmt"

	"github.com/mattn/go-sqlite3"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

// INFO: this is the main application that mainly is a pocketbase wrapper
type App struct {
	PB       *pocketbase.PocketBase
	MAConfig Config
}

const (
	TEST_SUPERUSER_MAIL = "test@test.de"
	TEST_SUPERUSER_PASS = "passwort"
)

func init() {
	sql.Register("pb_sqlite3",
		&sqlite3.SQLiteDriver{
			ConnectHook: func(conn *sqlite3.SQLiteConn) error {
				_, err := conn.Exec(`
                    PRAGMA busy_timeout       = 10000;
                    PRAGMA journal_mode       = WAL;
                    PRAGMA journal_size_limit = 200000000;
                    PRAGMA synchronous        = NORMAL;
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
