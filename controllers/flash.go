package controllers

import (
	"net/http"
	"net/url"

	"github.com/pocketbase/pocketbase/core"
)

const flashSuccessCookieName = "flash_success"

func setFlashSuccess(e *core.RequestEvent, message string) {
	if e == nil || message == "" {
		return
	}
	e.SetCookie(&http.Cookie{
		Name:     flashSuccessCookieName,
		Value:    url.QueryEscape(message),
		Path:     "/",
		MaxAge:   60,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
}

func popFlashSuccess(e *core.RequestEvent) string {
	if e == nil || e.Request == nil {
		return ""
	}
	cookie, err := e.Request.Cookie(flashSuccessCookieName)
	if err != nil || cookie == nil || cookie.Value == "" {
		return ""
	}
	e.SetCookie(&http.Cookie{
		Name:     flashSuccessCookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})
	value, err := url.QueryUnescape(cookie.Value)
	if err != nil {
		return ""
	}
	return value
}
