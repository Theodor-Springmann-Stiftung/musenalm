package dbmodels

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
)

func CreateUser(
	app core.App,
	email string,
	password string,
	name string,
	role string,
) (*User, error) {
	collection, err := app.FindCollectionByNameOrId(USERS_TABLE)
	if err != nil {
		return nil, fmt.Errorf("failed to find '%s' collection: %w", USERS_TABLE, err)
	}

	record := core.NewRecord(collection)
	user := NewUser(record)
	user.SetEmail(email)
	user.SetPassword(password)
	user.SetName(name)
	user.SetVerified(true)
	user.SetDeactivated(false)
	user.SetRole(role)

	if err := app.Save(record); err != nil {
		return nil, fmt.Errorf("failed to save user record: %w", err)
	}

	return user, nil
}
