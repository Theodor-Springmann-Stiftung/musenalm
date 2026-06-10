package controllers

import (
	"encoding/json"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/functions"
	"github.com/pocketbase/pocketbase/tools/types"
)

func parseSettingString(value any) (string, bool) {
	switch v := value.(type) {
	case string:
		return strings.TrimSpace(v), true
	case []byte:
		if len(v) == 0 {
			return "", false
		}
		var parsed string
		if err := json.Unmarshal(v, &parsed); err == nil {
			return strings.TrimSpace(parsed), true
		}
		return strings.TrimSpace(string(v)), true
	case types.JSONRaw:
		if len(v) == 0 {
			return "", false
		}
		var parsed string
		if err := json.Unmarshal(v, &parsed); err == nil {
			return strings.TrimSpace(parsed), true
		}
		return strings.TrimSpace(string(v)), true
	case json.RawMessage:
		if len(v) == 0 {
			return "", false
		}
		var parsed string
		if err := json.Unmarshal(v, &parsed); err == nil {
			return strings.TrimSpace(parsed), true
		}
		return strings.TrimSpace(string(v)), true
	default:
		return "", false
	}
}

func formatSettingDateTime(value any) (string, bool) {
	if value == nil {
		return "", false
	}
	if dt, err := types.ParseDateTime(value); err == nil && !dt.IsZero() {
		return functions.GermanShortDateTime(dt), true
	}
	if raw, ok := parseSettingString(value); ok {
		clean := strings.Trim(raw, "\"")
		if dt, err := types.ParseDateTime(clean); err == nil && !dt.IsZero() {
			return functions.GermanShortDateTime(dt), true
		}
		if clean != "" {
			return clean, true
		}
	}
	return "", false
}

func parseSettingDateTime(value any) (types.DateTime, bool) {
	if value == nil {
		return types.DateTime{}, false
	}
	if dt, err := types.ParseDateTime(value); err == nil && !dt.IsZero() {
		return dt, true
	}
	if raw, ok := parseSettingString(value); ok {
		clean := strings.Trim(raw, "\"")
		if dt, err := types.ParseDateTime(clean); err == nil && !dt.IsZero() {
			return dt, true
		}
	}
	return types.DateTime{}, false
}

func formatSettingGermanDateTime(value any) (string, bool) {
	if dt, ok := parseSettingDateTime(value); ok {
		return functions.GermanDate(dt) + " " + functions.GermanTime(dt), true
	}
	return "", false
}
