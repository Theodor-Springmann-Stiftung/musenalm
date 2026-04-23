package dbmodels

import (
	"testing"
	"time"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
	"github.com/pocketbase/pocketbase/tools/types"
)

func testSessionCollection(superusersCollectionID string) *core.Collection {
	collection := core.NewBaseCollection(SESSIONS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: SESSIONS_TOKEN_FIELD, Required: true},
		&core.TextField{Name: SESSIONS_CSRF_FIELD, Required: true},
		&core.RelationField{Name: SESSIONS_SUPERUSER_FIELD, CollectionId: superusersCollectionID},
		&core.DateField{Name: SESSIONS_EXPIRES_FIELD, Required: true},
		&core.DateField{Name: SESSIONS_LAST_ACCESS_FIELD},
		&core.TextField{Name: SESSIONS_IP_FIELD},
		&core.TextField{Name: SESSIONS_USER_AGENT_FIELD},
		&core.BoolField{Name: SESSIONS_PERSIST_FIELD},
		&core.SelectField{Name: SESSIONS_STATUS_FIELD, Required: true, MaxSelect: 1, Values: TOKEN_STATUS_VALUES},
	)
	return collection
}

func TestCreateSessionTokenUsesDurationForExactExpiry(t *testing.T) {
	testApp, err := tests.NewTestApp()
	if err != nil {
		t.Fatalf("NewTestApp: %v", err)
	}
	defer testApp.Cleanup()

	superusers, err := testApp.FindCollectionByNameOrId(core.CollectionNameSuperusers)
	if err != nil {
		t.Fatalf("find superusers collection: %v", err)
	}

	superuser := core.NewRecord(superusers)
	superuser.SetEmail("login-test@example.com")
	superuser.SetPassword("password123")
	if err := testApp.Save(superuser); err != nil {
		t.Fatalf("save superuser: %v", err)
	}

	if err := testApp.Save(testSessionCollection(superusers.Id)); err != nil {
		t.Fatalf("save sessions collection: %v", err)
	}

	berlin, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		t.Fatalf("load Europe/Berlin: %v", err)
	}

	now := time.Date(2026, time.January, 16, 23, 0, 0, 0, berlin)
	wantExpiry := time.Date(2026, time.January, 23, 2, 0, 0, 0, berlin)
	duration := wantExpiry.Sub(now)

	nowDateTime, err := types.ParseDateTime(now)
	if err != nil {
		t.Fatalf("ParseDateTime: %v", err)
	}

	originalSessionNow := sessionNow
	sessionNow = func() types.DateTime {
		return nowDateTime
	}
	defer func() {
		sessionNow = originalSessionNow
	}()

	session, err := CreateSessionToken(
		testApp,
		"",
		superuser.Id,
		"127.0.0.1",
		"test-agent",
		true,
		duration,
	)
	if err != nil {
		t.Fatalf("CreateSessionToken: %v", err)
	}

	storedSession, err := Sessions_Token(testApp, session.SessionTokenClear)
	if err != nil {
		t.Fatalf("Sessions_Token: %v", err)
	}

	if !storedSession.Expires().Time().Equal(wantExpiry) {
		t.Fatalf("expected session expiry %v, got %v", wantExpiry, storedSession.Expires().Time())
	}
	if storedSession.LastAccess().Compare(nowDateTime) != 0 {
		t.Fatalf("expected last access %v, got %v", nowDateTime.Time(), storedSession.LastAccess().Time())
	}
	if !storedSession.Persist() {
		t.Fatal("expected persistent session record")
	}
}
