package cmd

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	maapp "github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func TestResetKeepAuthDataPreservesUsersAndSuperusers(t *testing.T) {
	dataDir := filepath.Join(t.TempDir(), "pb_data")
	musenalmApp := newResetKeepAuthTestApp(t, dataDir)
	defer musenalmApp.PB.ResetBootstrapState()

	user, err := dbmodels.CreateUser(musenalmApp.PB, "user@example.com", "password123", "User Name", "Editor")
	if err != nil {
		t.Fatalf("create user: %v", err)
	}
	user.Set(dbmodels.USERS_SETTINGS_FIELD, map[string]any{"locale": "de"})
	if err := musenalmApp.PB.Save(user.Record); err != nil {
		t.Fatalf("update user settings: %v", err)
	}

	superusersCollection, err := musenalmApp.PB.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	if err != nil {
		t.Fatalf("find superusers collection: %v", err)
	}
	superuser := core.NewRecord(superusersCollection)
	superuser.SetEmail("admin@example.com")
	superuser.SetPassword("adminpass123")
	superuser.SetVerified(true)
	if err := musenalmApp.PB.Save(superuser); err != nil {
		t.Fatalf("create superuser: %v", err)
	}

	sessionCollection, err := musenalmApp.PB.FindCollectionByNameOrId(dbmodels.SESSIONS_TABLE)
	if err != nil {
		t.Fatalf("find sessions collection: %v", err)
	}
	session := dbmodels.NewSession(core.NewRecord(sessionCollection))
	session.SetToken("session-token")
	session.SetCSRF("session-csrf")
	session.SetUser(user.Id)
	session.SetExpires(types.NowDateTime().Add(2 * time.Hour))
	session.SetStatus(dbmodels.TOKEN_STATUS_VALUES[0])
	session.SetPersist(true)
	if err := musenalmApp.PB.Save(session.Record); err != nil {
		t.Fatalf("create session: %v", err)
	}

	if _, err := resetKeepAuthData(musenalmApp); err != nil {
		t.Fatalf("resetKeepAuthData: %v", err)
	}

	storedUser, err := musenalmApp.PB.FindAuthRecordByEmail(dbmodels.USERS_TABLE, "user@example.com")
	if err != nil {
		t.Fatalf("find restored user: %v", err)
	}
	if storedUser.Id != user.Id {
		t.Fatalf("expected restored user id %q, got %q", user.Id, storedUser.Id)
	}
	if !storedUser.ValidatePassword("password123") {
		t.Fatal("expected restored user password hash to remain valid")
	}
	if storedUser.GetString(dbmodels.USERS_ROLE_FIELD) != "Editor" {
		t.Fatalf("expected restored user role Editor, got %q", storedUser.GetString(dbmodels.USERS_ROLE_FIELD))
	}
	if storedUser.GetString(dbmodels.USERS_NAME_FIELD) != "User Name" {
		t.Fatalf("expected restored user name preserved, got %q", storedUser.GetString(dbmodels.USERS_NAME_FIELD))
	}

	storedSuperuser, err := musenalmApp.PB.FindAuthRecordByEmail(core.CollectionNameSuperusers, "admin@example.com")
	if err != nil {
		t.Fatalf("find restored superuser: %v", err)
	}
	if storedSuperuser.Id != superuser.Id {
		t.Fatalf("expected restored superuser id %q, got %q", superuser.Id, storedSuperuser.Id)
	}
	if !storedSuperuser.ValidatePassword("adminpass123") {
		t.Fatal("expected restored superuser password hash to remain valid")
	}

	var sessionCount int
	if err := musenalmApp.PB.DB().NewQuery("SELECT COUNT(*) FROM sessions").Row(&sessionCount); err != nil {
		t.Fatalf("count sessions after reset: %v", err)
	}
	if sessionCount != 0 {
		t.Fatalf("expected sessions to be cleared, got %d", sessionCount)
	}
}

func newResetKeepAuthTestApp(t *testing.T, dataDir string) *maapp.App {
	t.Helper()

	originalArgs := os.Args
	os.Args = []string{"musenalm", "--dir", dataDir}
	t.Cleanup(func() {
		os.Args = originalArgs
	})

	musenalmApp := maapp.New(maapp.Config{
		Debug:           false,
		AllowTestLogin:  false,
		DisableWatchers: true,
	})

	if err := musenalmApp.PB.Bootstrap(); err != nil {
		t.Fatalf("bootstrap app: %v", err)
	}
	if err := ensureResetKeepAuthTestSchema(musenalmApp.PB); err != nil {
		t.Fatalf("prepare test schema: %v", err)
	}
	if err := musenalmApp.PB.ReloadCachedCollections(); err != nil {
		t.Fatalf("reload collections: %v", err)
	}

	originalRunPostResetSetup := runPostResetSetup
	runPostResetSetup = func(app *maapp.App) error {
		if err := ensureResetKeepAuthTestSchema(app.PB); err != nil {
			return err
		}
		return app.PB.ReloadCachedCollections()
	}
	t.Cleanup(func() {
		runPostResetSetup = originalRunPostResetSetup
	})

	return musenalmApp
}

func ensureResetKeepAuthTestSchema(app core.App) error {
	usersCollection, err := app.FindCollectionByNameOrId(dbmodels.USERS_TABLE)
	if err != nil {
		return err
	}

	if usersCollection.Fields.GetByName(dbmodels.USERS_SETTINGS_FIELD) == nil {
		usersCollection.Fields.Add(&core.JSONField{Name: dbmodels.USERS_SETTINGS_FIELD})
	}
	if usersCollection.Fields.GetByName(dbmodels.USERS_ROLE_FIELD) == nil {
		usersCollection.Fields.Add(&core.TextField{Name: dbmodels.USERS_ROLE_FIELD, Required: true})
	}
	if usersCollection.Fields.GetByName(dbmodels.USERS_DEACTIVATED_FIELD) == nil {
		usersCollection.Fields.Add(&core.BoolField{Name: dbmodels.USERS_DEACTIVATED_FIELD})
	}
	if err := app.Save(usersCollection); err != nil {
		return err
	}

	if _, err := app.FindCollectionByNameOrId(dbmodels.SESSIONS_TABLE); err == nil {
		return nil
	}
	superusersCollection, err := app.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	if err != nil {
		return err
	}

	sessionCollection := core.NewBaseCollection(dbmodels.SESSIONS_TABLE)
	fields := core.NewFieldsList(
		&core.TextField{Name: dbmodels.SESSIONS_TOKEN_FIELD, Required: true},
		&core.TextField{Name: dbmodels.SESSIONS_CSRF_FIELD, Required: true},
		&core.RelationField{Name: dbmodels.SESSIONS_USER_FIELD, CollectionId: usersCollection.Id, Required: false},
		&core.RelationField{Name: dbmodels.SESSIONS_SUPERUSER_FIELD, CollectionId: superusersCollection.Id, Required: false},
		&core.DateField{Name: dbmodels.SESSIONS_EXPIRES_FIELD, Required: true},
		&core.DateField{Name: dbmodels.SESSIONS_LAST_ACCESS_FIELD},
		&core.TextField{Name: dbmodels.SESSIONS_IP_FIELD},
		&core.TextField{Name: dbmodels.SESSIONS_USER_AGENT_FIELD},
		&core.BoolField{Name: dbmodels.SESSIONS_PERSIST_FIELD},
		&core.TextField{Name: dbmodels.SESSIONS_STATUS_FIELD, Required: true},
	)
	dbmodels.SetCreatedUpdatedFields(&fields)
	sessionCollection.Fields = fields

	return app.Save(sessionCollection)
}
