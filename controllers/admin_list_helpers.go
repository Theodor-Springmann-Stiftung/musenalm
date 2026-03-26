package controllers

import (
	"slices"
	"strings"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

const adminMainNavigationHeader = "X-Admin-Main-Nav"

func isAdminMainNavigationRequest(e *core.RequestEvent) bool {
	return strings.EqualFold(e.Request.Header.Get(adminMainNavigationHeader), "true")
}

func adminPageLayout(e *core.RequestEvent, defaultLayout string) string {
	if isAdminMainNavigationRequest(e) {
		return pagemodels.LAYOUT_FRAGMENT
	}
	return defaultLayout
}

func aggregatedDisplayLimit(offset, pageSize int) int {
	if offset > pageSize {
		return offset
	}
	return pageSize
}

func paginatedSliceBounds(offset, totalCount, pageSize int) (int, int) {
	start := offset
	if start < 0 {
		start = 0
	}
	if start > totalCount {
		start = totalCount
	}

	endIndex := start + pageSize
	if endIndex > totalCount {
		endIndex = totalCount
	}

	return start, endIndex
}

func paginatedQueryWindow(offset, totalCount, pageSize int, showAggregated bool) (int, int, int, int, bool) {
	if showAggregated {
		limit := aggregatedDisplayLimit(offset, pageSize)
		if limit > totalCount {
			limit = totalCount
		}
		if limit < 0 {
			limit = 0
		}

		return 0, limit, limit, limit, limit < totalCount
	}

	start, endIndex := paginatedSliceBounds(offset, totalCount, pageSize)
	limit := endIndex - start
	return start, limit, endIndex, endIndex, endIndex < totalCount
}

func anySliceFromStringSet(items map[string]struct{}) []any {
	if len(items) == 0 {
		return nil
	}

	keys := make([]string, 0, len(items))
	for item := range items {
		keys = append(keys, item)
	}
	slices.Sort(keys)

	result := make([]any, 0, len(keys))
	for _, key := range keys {
		result = append(result, key)
	}
	return result
}

func intersectStringSets(base map[string]struct{}, other map[string]struct{}) map[string]struct{} {
	if len(base) == 0 || len(other) == 0 {
		return map[string]struct{}{}
	}

	if len(other) < len(base) {
		base, other = other, base
	}

	result := make(map[string]struct{}, len(base))
	for key := range base {
		if _, ok := other[key]; ok {
			result[key] = struct{}{}
		}
	}
	return result
}

func applyAllowedIDs(allowedSets ...map[string]struct{}) map[string]struct{} {
	var filtered []map[string]struct{}
	for _, set := range allowedSets {
		if set == nil {
			continue
		}
		filtered = append(filtered, set)
	}
	if len(filtered) == 0 {
		return nil
	}

	current := filtered[0]
	for _, set := range filtered[1:] {
		current = intersectStringSets(current, set)
		if len(current) == 0 {
			return map[string]struct{}{}
		}
	}
	return current
}

func adminInitialVariants(letter string) []string {
	switch normalizeAdminLetter(letter) {
	case "A":
		return []string{"A", "Ä"}
	case "O":
		return []string{"O", "Ö"}
	case "U":
		return []string{"U", "Ü"}
	default:
		normalized := normalizeAdminLetter(letter)
		if normalized == "" {
			return nil
		}
		return []string{normalized}
	}
}

func adminInitialFilterExp(field, letter string) dbx.Expression {
	variants := adminInitialVariants(letter)
	if len(variants) == 0 {
		return dbx.NewExp("1 = 1")
	}

	conditions := make([]dbx.Expression, 0, len(variants))
	for _, variant := range variants {
		conditions = append(conditions, dbx.Like(field, variant).Match(false, true))
	}
	return dbx.Or(conditions...)
}

type adminRequestTimer struct {
	app     core.App
	started time.Time
	last    time.Time
	fields  []any
}

func newAdminRequestTimer(app core.App, e *core.RequestEvent, listName string, showAggregated bool) *adminRequestTimer {
	now := time.Now()
	return &adminRequestTimer{
		app:     app,
		started: now,
		last:    now,
		fields: []any{
			"list", listName,
			"path", e.Request.URL.Path,
			"query", e.Request.URL.RawQuery,
			"aggregated", showAggregated,
		},
	}
}

func (t *adminRequestTimer) Mark(stage string) {
	now := time.Now()
	t.fields = append(t.fields, stage+"_ms", now.Sub(t.last).Milliseconds())
	t.last = now
}

func (t *adminRequestTimer) Finish(err error, extra ...any) {
	t.fields = append(t.fields, "total_ms", time.Since(t.started).Milliseconds())
	if err != nil {
		t.fields = append(t.fields, "status", "error", "error", err.Error())
	} else {
		t.fields = append(t.fields, "status", "ok")
	}
	t.fields = append(t.fields, extra...)
	t.app.Logger().Info("admin list timing", t.fields...)
}
