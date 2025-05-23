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
			strings.HasPrefix(e.Request.URL.Path, "/api") {
			return e.Next()
		}

		cookie, err := e.Request.Cookie(dbmodels.SESSION_COOKIE_NAME)
		if err != nil {
			return e.Next()
		}

		user, session, loaded := SESSION_CACHE.Get(cookie.Value)
		if !loaded {
			record, err := app.FindFirstRecordByData(dbmodels.SESSIONS_TABLE, dbmodels.SESSIONS_TOKEN_FIELD, cookie.Value)
			if err != nil {
				e.SetCookie(deact_cookie)
				e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
				return e.Next()
			}

			s := dbmodels.NewSession(record)
			r, err := app.FindRecordById(dbmodels.USERS_TABLE, s.User())
			if err != nil {
				e.SetCookie(deact_cookie)
				e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
				return e.Next()
			}
			u := dbmodels.NewUser(r)
			user, session = SESSION_CACHE.Set(u, s)
		}

		slog.Debug("User session detected", "user", user.Id, "name", user.Name, "session", session.ID)

		if session.IsExpired() || user.Deactivated {
			// TODO: (Maybe) less rigid handling here: for creation or update of items forgive shortly
			// expired tokens, if CSRF and everything else is a match.
			slog.Warn("Session expired", "user", user.Id, "name", user.Name, "session", session.ID)
			SESSION_CACHE.Delete(cookie.Value)
			go func() {
				r, err := app.FindRecordById(dbmodels.SESSIONS_TABLE, session.ID)
				e.SetCookie(deact_cookie)
				e.Response.Header().Set("Clear-Site-Data", "\"cookies\"")
				if err == nil {
					app.Delete(r)
				}
			}()
			return e.Next()
		}

		e.Set("user", user)
		e.Set("session", session)

		token := e.Request.URL.Query().Get("token")
		if token != "" {
			record, err := app.FindFirstRecordByData(dbmodels.ACCESS_TOKENS_TABLE, dbmodels.ACCESS_TOKENS_TOKEN_FIELD, token)
			if err != nil {
				slog.Error("Failed to find access token", "token", token, "error", err)
				return e.Next()
			}
			a := dbmodels.NewAccessToken(record)

			if a.User() != "" {
				r, err := app.FindRecordById(dbmodels.USERS_TABLE, a.User())
				if err != nil {
					slog.Error("Failed to find access token user", "user", a.User(), "error", err)
					return e.Next()
				}

				u := dbmodels.NewUser(r)
				e.Set("access_token_user", u.Fixed())
			}

			e.Set("access_token", a.Fixed())
		}

		return e.Next()
	}
}
