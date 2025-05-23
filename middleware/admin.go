package middleware

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
)

func IsAdmin() func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		user := req.User()
		if user == nil {
			return e.Error(401, "Unauthorized", nil)
		}

		if user.Role != "Admin" {
			return e.Error(403, "Forbidden", nil)
		}

		return e.Next()
	}
}
