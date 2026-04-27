package gnd

import (
	"encoding/json"
	"net/url"
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
