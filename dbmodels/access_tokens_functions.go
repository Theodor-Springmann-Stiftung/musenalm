package dbmodels

import (
	"fmt"
	"time"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

func CreateAccessToken(
	app core.App,
	userID string,
	url string,
	duration time.Duration,
) (*AccessToken, error) {
	collection, err := app.FindCollectionByNameOrId(ACCESS_TOKENS_TABLE)
	if err != nil {
		return nil, fmt.Errorf("failed to find '%s' collection: %w", ACCESS_TOKENS_TABLE, err)
	}

	accesTokenClear, err := generateSecureRandomToken(secureTokenByteLength)
	if err != nil {
		return nil, fmt.Errorf("failed to generate session token: %w", err)
	}

	csrfTokenClear, err := generateSecureRandomToken(secureTokenByteLength)
	if err != nil {
		return nil, fmt.Errorf("failed to generate CSRF token: %w", err)
	}

	record := core.NewRecord(collection)
	token := NewAccessToken(record)

	token.SetToken(accesTokenClear)
	token.SetCSRF(csrfTokenClear)
	token.SetUser(userID)
	token.SetURL(url)
	token.SetStatus(TOKEN_STATUS_VALUES[0]) // Active
	token.SetExpires(types.NowDateTime().Add(duration))

	if err := app.Save(record); err != nil {
		return nil, fmt.Errorf("failed to save access token record: %w", err)
	}

	return token, nil
}
