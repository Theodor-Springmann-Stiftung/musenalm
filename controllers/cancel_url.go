package controllers

import (
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func cancelURLFromHeader(e *core.RequestEvent) string {
	if e == nil || e.Request == nil {
		return ""
	}
	return strings.TrimSpace(e.Request.Header.Get("HX-Current-URL"))
}
