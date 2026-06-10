package gnd

import (
	"encoding/json"
	"fmt"
	"net/url"
	"path"
	"strings"
)

const dataKey = "gnd"

func FromData(uri string, data map[string]any) *Person {
	if !IsGNDURI(uri) || len(data) == 0 {
		return nil
	}

	raw, ok := data[dataKey]
	if !ok || raw == nil {
		return nil
	}

	switch typed := raw.(type) {
	case *Person:
		return typed
	case Person:
		person := typed
		return &person
	}

	payload, err := json.Marshal(raw)
	if err != nil {
		return nil
	}

	person := &Person{}
	if err := json.Unmarshal(payload, person); err != nil {
		return nil
	}
	if person.URL == "" && person.GndIdentifier == "" && person.PreferredName == "" {
		return nil
	}

	return person
}

func IsGNDURI(uri string) bool {
	uri = strings.TrimSpace(strings.ToLower(uri))
	if uri == "" {
		return false
	}

	if strings.HasPrefix(uri, "http://") || strings.HasPrefix(uri, "https://") {
		parsed, err := url.Parse(uri)
		if err != nil {
			return false
		}
		return strings.EqualFold(parsed.Hostname(), "d-nb.info")
	}

	uri = strings.TrimPrefix(uri, "//")
	return uri == "d-nb.info" || strings.HasPrefix(uri, "d-nb.info/")
}

func NormalizeURI(uri string) string {
	uri = strings.TrimSpace(uri)
	if uri == "" {
		return ""
	}
	if !IsGNDURI(uri) {
		return uri
	}
	if strings.HasPrefix(strings.ToLower(uri), "http://") || strings.HasPrefix(strings.ToLower(uri), "https://") {
		parsed, err := url.Parse(uri)
		if err != nil {
			return uri
		}
		return "https://d-nb.info" + parsed.EscapedPath()
	}

	uri = strings.TrimPrefix(uri, "//")
	if strings.HasPrefix(uri, "d-nb.info") {
		rest := strings.TrimPrefix(uri, "d-nb.info")
		if rest == "" {
			return "https://d-nb.info"
		}
		if !strings.HasPrefix(rest, "/") {
			rest = "/" + rest
		}
		return "https://d-nb.info" + rest
	}
	return uri
}

func SyncDataWithRecord(uri string, data map[string]any, record map[string]any) (string, map[string]any, error) {
	normalizedURI := NormalizeURI(uri)
	cleaned := cloneData(data)

	if normalizedURI == "" || !IsGNDURI(normalizedURI) {
		return normalizedURI, ClearedData(cleaned), nil
	}

	if _, err := ExtractGNDID(normalizedURI); err != nil {
		return normalizedURI, data, err
	}
	if len(record) == 0 {
		return normalizedURI, data, fmt.Errorf("missing GND record payload")
	}

	clearGNDData(cleaned)
	cleaned[dataKey] = record
	if id, ok := record["id"].(string); ok && id != "" {
		normalizedURI = id
	}

	return normalizedURI, normalizeDataResult(cleaned), nil
}

func ClearedData(data map[string]any) map[string]any {
	cleaned := cloneData(data)
	clearGNDData(cleaned)
	return normalizeDataResult(cleaned)
}

func ExtractGNDID(uri string) (string, error) {
	normalized := NormalizeURI(uri)
	if normalized == "" || !IsGNDURI(normalized) {
		return "", fmt.Errorf("not a d-nb.info URI: %q", uri)
	}

	parsed, err := url.Parse(normalized)
	if err != nil {
		return "", err
	}
	id := path.Base(strings.TrimSuffix(parsed.Path, "/"))
	id = strings.TrimSuffix(id, ".json")
	if id == "" || id == "gnd" {
		return "", fmt.Errorf("missing GND identifier in URI %q", uri)
	}
	return id, nil
}

func clearGNDData(data map[string]any) {
	if len(data) == 0 {
		return
	}
	delete(data, dataKey)
	delete(data, "gnd_query_name")
	delete(data, "gnd_query_biographical_data")
	delete(data, "gnd_match_strategy")
	delete(data, "gnd_candidate_count")
	delete(data, "gnd_matched_at")
}

func cloneData(in map[string]any) map[string]any {
	if len(in) == 0 {
		return map[string]any{}
	}
	out := make(map[string]any, len(in))
	for k, v := range in {
		out[k] = v
	}
	return out
}

func normalizeDataResult(data map[string]any) map[string]any {
	if len(data) == 0 {
		return nil
	}
	return data
}
