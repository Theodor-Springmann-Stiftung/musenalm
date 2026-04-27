package gnd

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"net/url"
	"path"
	"strings"
	"time"
)

const dataKey = "gnd"

var (
	lobidBaseURL = "https://lobid.org/gnd"
	httpClient   = &http.Client{Timeout: 15 * time.Second}
	sleep        = time.Sleep
	rng          = rand.New(rand.NewSource(time.Now().UnixNano()))
)

func SetHTTPClientForTesting(client *http.Client) func() {
	original := httpClient
	httpClient = client
	return func() {
		httpClient = original
	}
}

func SetSleepForTesting(fn func(time.Duration)) func() {
	original := sleep
	sleep = fn
	return func() {
		sleep = original
	}
}

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

func SyncData(ctx context.Context, uri string, data map[string]any) (string, map[string]any, error) {
	normalizedURI := NormalizeURI(uri)
	cleaned := cloneData(data)

	if normalizedURI == "" || !IsGNDURI(normalizedURI) {
		return normalizedURI, ClearedData(cleaned), nil
	}

	gndID, err := extractGNDID(normalizedURI)
	if err != nil {
		return normalizedURI, data, err
	}

	record, err := fetchRecord(ctx, gndID)
	if err != nil {
		return normalizedURI, data, err
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

func extractGNDID(uri string) (string, error) {
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

func fetchRecord(ctx context.Context, gndID string) (map[string]any, error) {
	endpoint := strings.TrimRight(lobidBaseURL, "/") + "/" + url.PathEscape(gndID) + ".json"

	var lastErr error
	for attempt := 0; attempt < 5; attempt++ {
		req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
		if err != nil {
			return nil, err
		}

		resp, err := httpClient.Do(req)
		if err == nil {
			body, readErr := io.ReadAll(resp.Body)
			resp.Body.Close()
			if readErr != nil {
				lastErr = readErr
			} else if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				record := map[string]any{}
				if err := json.Unmarshal(body, &record); err != nil {
					return nil, err
				}
				return record, nil
			} else if !shouldRetryStatus(resp.StatusCode) {
				return nil, fmt.Errorf("unexpected status %d", resp.StatusCode)
			} else {
				lastErr = fmt.Errorf("transient status %d", resp.StatusCode)
			}
		} else {
			lastErr = err
		}

		if attempt == 4 {
			break
		}
		sleep(backoffDuration(attempt))
	}

	return nil, lastErr
}

func shouldRetryStatus(status int) bool {
	return status == http.StatusTooManyRequests ||
		status == http.StatusNotFound ||
		status >= 500
}

func backoffDuration(attempt int) time.Duration {
	base := 250 * time.Millisecond
	backoff := base << attempt
	if backoff > 5*time.Second {
		backoff = 5 * time.Second
	}
	jitter := time.Duration(rng.Int63n(int64(base)))
	return backoff + jitter
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
