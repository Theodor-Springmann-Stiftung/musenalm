package middleware

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
)

func HasToken() func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		token := req.AccessToken()
		if token == nil {
			return e.Error(401, "Unauthorized", nil)
		}

		if token.IsExpired() {
			return e.Error(403, "Forbidden", nil)
		}

		if token.URL != e.Request.URL.Path {
			return e.Error(403, "Forbidden", nil)
		}

		return e.Next()
	}
}
