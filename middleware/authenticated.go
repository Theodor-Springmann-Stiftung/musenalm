package middleware

import (
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/collections"
	"github.com/pocketbase/pocketbase/core"
)

var SESSION_CACHE = collections.NewUserSessionCache(1000, 5*time.Minute)
var deact_cookie = &http.Cookie{
	Name:   dbmodels.SESSION_COOKIE_NAME,
	MaxAge: -1,
	Path:   "/",
}

func Authenticated(app core.App) func(*core.RequestEvent) error {
	return func(e *core.RequestEvent) error {
		if strings.HasPrefix(e.Request.URL.Path, "/assets") ||
			strings.HasPrefix(e.Request.URL.Path, "/_") {
			return e.Next()
		}

		token := e.Request.URL.Query().Get("token")
		if token != "" {
			a, err := dbmodels.AccessTokens_Token(app, token)
			if err != nil {
				slog.Error("Failed to find access token", "token", token, "error", err)
			} else {
				if a.User() != "" {
					u, err := dbmodels.Users_ID(app, a.User())
					if err != nil {
						slog.Error("Failed to find access token user", "user", a.User(), "error", err)
					} else {
						e.Set("access_token_user", u.Fixed())
					}
				}
				e.Set("access_token", a.Fixed())
			}
		}

		cookie, err := e.Request.Cookie(dbmodels.SESSION_COOKIE_NAME)
		if err != nil {
			return e.Next()
		}

		user, session, loaded := SESSION_CACHE.Get(cookie.Value)
		if !loaded {
			s, err := dbmodels.Sessions_Token(app, cookie.Value)
			if err != nil {
				e.SetCookie(deact_cookie)
				e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
				return e.Next()
			}

			slog.Debug("Session loaded from database", "session", s.Id, "user", s.User())
			u, err := dbmodels.Users_ID(app, s.User())
			if err != nil {
				e.SetCookie(deact_cookie)
				e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
				return e.Next()
			}
			user, session = SESSION_CACHE.Set(u, s)
		}

		slog.Debug("User session detected", "user", user.Id, "name", user.Name, "session", session.ID)

		if session.IsExpired() || user.Deactivated {
			// TODO: (Maybe) less rigid handling here: for creation or update of items forgive shortly
			// expired tokens, if CSRF and everything else is a match.
			slog.Warn("Session expired", "user", user.Id, "name", user.Name, "session", session.ID)
			SESSION_CACHE.Delete(cookie.Value)
			go func() {
				r, err := dbmodels.Sessions_ID(app, session.ID)
				if err == nil {
					r.SetStatus(dbmodels.TOKEN_STATUS_VALUES[1])
					if err := app.Save(r); err != nil {
						app.Logger().Error("Failed to save session status", "session", session.ID, "error", err)
					}
				}
				e.SetCookie(deact_cookie)
				e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
			}()
			return e.Next()
		}

		e.Set("user", user)
		e.Set("session", session)

		return e.Next()
	}
}
