package dbmodels

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"time"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types" // For types.NewDateTimeFromTime
)

const (
	secureTokenByteLength = 64
)

func generateSecureRandomToken(length int) (string, error) {
	if length <= 0 {
		length = secureTokenByteLength
	}
	randomBytes := make([]byte, length)
	_, err := rand.Read(randomBytes)
	if err != nil {
		return "", fmt.Errorf("failed to generate random bytes for token: %w", err)
	}

	return base64.URLEncoding.EncodeToString(randomBytes), nil
}

func CreateSessionToken(
	app core.App,
	userID string,
	ipAddress string,
	userAgent string,
	isPersistent bool,
	sessionDuration time.Duration,
) (*Session, error) {

	collection, err := app.FindCollectionByNameOrId(SESSIONS_TABLE)
	if err != nil {
		return nil, fmt.Errorf("failed to find '%s' collection: %w", SESSIONS_TABLE, err)
	}

	sessionTokenClear, err := generateSecureRandomToken(secureTokenByteLength)
	if err != nil {
		return nil, fmt.Errorf("failed to generate session token: %w", err)
	}

	csrfTokenClear, err := generateSecureRandomToken(secureTokenByteLength)
	if err != nil {
		return nil, fmt.Errorf("failed to generate CSRF token: %w", err)
	}

	record := core.NewRecord(collection)
	session := NewSession(record)

	// Set required fields with hashed tokens
	session.SetToken(sessionTokenClear)
	session.SetCSRF(csrfTokenClear)
	session.SetUser(userID)

	date := types.NowDateTime()
	expires := date.Add(sessionDuration)
	session.SetExpires(expires)

	session.SetPersist(isPersistent)
	session.SetLastAccess(types.NowDateTime())
	session.SetUserAgent(userAgent)
	session.SetIP(ipAddress)
	session.SetStatus(TOKEN_STATUS_VALUES[0]) // Active

	if errSave := app.Save(session); errSave != nil {
		app.Logger().Error("Failed to save session token record", "error", errSave, "userID", userID)
		return nil, fmt.Errorf("failed to save session token record: %w", errSave)
	}

	app.Logger().Info("Successfully created session token entry", "recordId", record.Id, "userID", userID)
	return session, nil
}
