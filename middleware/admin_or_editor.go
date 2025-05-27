package middleware

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
)

// INFO: Here the URL must have a path value "uid" which is the user ID of the affected user.
func IsAdminOrEditor() func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		user := req.User()
		if user == nil {
			return e.Error(401, "Unauthorized", nil)
		}

		if user.Role != "Editor" && user.Role != "Admin" {
			return e.Error(403, "Forbidden", nil)
		}

		return e.Next()
	}
}
