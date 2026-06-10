package app

import (
	"compress/gzip"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	lobidBaseURLDefault          = "https://lobid.org"
	lobidUserAgent               = "Projekt Musenalm; https://musenalm.de"
	lobidSearchPath              = "/gnd/search"
	lobidSearchInterval          = 3 * time.Second
	lobidLookupInterval          = 500 * time.Millisecond
	lobidCacheTTL                = 24 * time.Hour
	lobidSearchMaxRetries        = 4
	lobidLookupMaxRetries        = 4
	lobidSearchSuggestionSize    = 10
	lobidSearchSuggestionFormat  = "json:preferredName,*_dateOfBirth in_placeOfBirth,\u2020_dateOfDeath in_placeOfDeath"
	lobidSearchSuggestionFilter  = "type:DifferentiatedPerson"
	lobidDefaultBackoffBase      = time.Second
	lobidDefaultBackoffCap       = 30 * time.Second
	lobidDefaultJitterUpperBound = 250 * time.Millisecond
	lobidRequestClassSearch      = lobidRequestClass("search")
	lobidRequestClassRecord      = lobidRequestClass("record")
)

var (
	lobidBaseURL    = lobidBaseURLDefault
	lobidNow        = func() time.Time { return time.Now().UTC() }
	lobidSleep      = time.Sleep
	lobidClientHTTP = &http.Client{
		Timeout: 20 * time.Second,
	}
	lobidRandMu sync.Mutex
	lobidRand   = rand.New(rand.NewSource(time.Now().UnixNano()))
)

type lobidRequestClass string

type lobidClientConfig struct {
	searchInterval   time.Duration
	lookupInterval   time.Duration
	searchRetries    int
	lookupRetries    int
	backoffBase      time.Duration
	backoffCap       time.Duration
	jitterUpperBound time.Duration
}

type lobidClient struct {
	app        core.App
	config     lobidClientConfig
	globalSem  chan struct{}
	searchSem  chan struct{}
	recordSem  chan struct{}
	searchRate lobidRateGate
	recordRate lobidRateGate
}

type lobidRateGate struct {
	interval    time.Duration
	mu          sync.Mutex
	nextAllowed time.Time
}

type lobidResponse struct {
	StatusCode int
	Body       []byte
	Header     http.Header
	Cached     bool
}

type lobidHTTPError struct {
	StatusCode int
	URL        string
}

func (e *lobidHTTPError) Error() string {
	return fmt.Sprintf("lobid request %s returned status %d", e.URL, e.StatusCode)
}

func defaultLobidClientConfig() lobidClientConfig {
	return lobidClientConfig{
		searchInterval:   lobidSearchInterval,
		lookupInterval:   lobidLookupInterval,
		searchRetries:    lobidSearchMaxRetries,
		lookupRetries:    lobidLookupMaxRetries,
		backoffBase:      lobidDefaultBackoffBase,
		backoffCap:       lobidDefaultBackoffCap,
		jitterUpperBound: lobidDefaultJitterUpperBound,
	}
}

func newLobidClient(app core.App, cfg lobidClientConfig) *lobidClient {
	if cfg.searchInterval == 0 {
		cfg.searchInterval = lobidSearchInterval
	}
	if cfg.lookupInterval == 0 {
		cfg.lookupInterval = lobidLookupInterval
	}
	if cfg.backoffBase == 0 {
		cfg.backoffBase = lobidDefaultBackoffBase
	}
	if cfg.backoffCap == 0 {
		cfg.backoffCap = lobidDefaultBackoffCap
	}
	if cfg.jitterUpperBound == 0 {
		cfg.jitterUpperBound = lobidDefaultJitterUpperBound
	}
	if cfg.searchRetries == 0 {
		cfg.searchRetries = lobidSearchMaxRetries
	}
	if cfg.lookupRetries == 0 {
		cfg.lookupRetries = lobidLookupMaxRetries
	}

	return &lobidClient{
		app:       app,
		config:    cfg,
		globalSem: make(chan struct{}, 2),
		searchSem: make(chan struct{}, 1),
		recordSem: make(chan struct{}, 2),
		searchRate: lobidRateGate{
			interval: cfg.searchInterval,
		},
		recordRate: lobidRateGate{
			interval: cfg.lookupInterval,
		},
	}
}

func (app *App) LobidClient() *lobidClient {
	app.lobidClientMu.Lock()
	defer app.lobidClientMu.Unlock()

	if app.lobidClient == nil {
		app.lobidClient = newLobidClient(app.PB.App, defaultLobidClientConfig())
	}

	return app.lobidClient
}

func (app *App) searchLobidGND(ctx context.Context, name string, hints gndBiographicalHints) (*gndSearchResponse, bool, error) {
	params := url.Values{}
	params.Set("q", buildGNDQuery(name, hints))
	params.Set("format", "json")

	response := &gndSearchResponse{}
	retried, err := app.LobidClient().searchJSON(ctx, params, response)
	if err != nil {
		return nil, retried, err
	}
	return response, retried, nil
}

func (app *App) SearchPersonGNDNameSuggestions(ctx context.Context, query string) ([]map[string]any, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return []map[string]any{}, nil
	}

	params := url.Values{}
	params.Set("q", query)
	params.Set("format", lobidSearchSuggestionFormat)
	params.Set("filter", lobidSearchSuggestionFilter)
	params.Set("size", strconv.Itoa(lobidSearchSuggestionSize))

	results := []map[string]any{}
	_, err := app.LobidClient().searchJSON(ctx, params, &results)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (app *App) fetchLobidGNDRecord(ctx context.Context, gndID string) (map[string]any, bool, error) {
	return app.LobidClient().fetchRecord(ctx, gndID)
}

func (c *lobidClient) searchJSON(ctx context.Context, params url.Values, out any) (bool, error) {
	fullURL := strings.TrimRight(lobidBaseURL, "/") + lobidSearchPath + "?" + params.Encode()
	cacheKey := string(lobidRequestClassSearch) + ":" + fullURL
	response, retried, err := c.doRequest(ctx, lobidRequestClassSearch, fullURL, cacheKey, map[int]time.Duration{
		http.StatusOK: lobidCacheTTL,
	})
	if err != nil {
		return retried, err
	}
	if err := json.Unmarshal(response.Body, out); err != nil {
		return retried, err
	}
	return retried, nil
}

func (c *lobidClient) fetchRecord(ctx context.Context, gndID string) (map[string]any, bool, error) {
	fullURL := strings.TrimRight(lobidBaseURL, "/") + "/gnd/" + url.PathEscape(gndID) + ".json"
	cacheKey := string(lobidRequestClassRecord) + ":" + fullURL
	response, retried, err := c.doRequest(ctx, lobidRequestClassRecord, fullURL, cacheKey, map[int]time.Duration{
		http.StatusOK:       lobidCacheTTL,
		http.StatusNotFound: lobidCacheTTL,
	})
	if err != nil {
		return nil, retried, err
	}

	record := map[string]any{}
	if err := json.Unmarshal(response.Body, &record); err != nil {
		return nil, retried, err
	}
	return record, retried, nil
}

func (c *lobidClient) doRequest(
	ctx context.Context,
	class lobidRequestClass,
	fullURL string,
	cacheKey string,
	cacheableStatuses map[int]time.Duration,
) (*lobidResponse, bool, error) {
	if cached, err := c.loadCachedResponse(cacheKey); err != nil {
		return nil, false, err
	} else if cached != nil {
		if cached.StatusCode >= 200 && cached.StatusCode < 300 {
			return cached, false, nil
		}
		return cached, false, &lobidHTTPError{StatusCode: cached.StatusCode, URL: fullURL}
	}

	maxRetries := c.retryLimitForClass(class)
	retried := false
	var lastResp *lobidResponse
	var lastErr error

	for attempt := 0; attempt <= maxRetries; attempt++ {
		release, err := c.acquireSlot(ctx, class)
		if err != nil {
			return nil, retried, err
		}

		response, err := c.performRequest(ctx, fullURL)
		release()

		if err == nil {
			lastResp = response
			if ttl, ok := cacheableStatuses[response.StatusCode]; ok {
				if cacheErr := c.storeCachedResponse(cacheKey, string(class), response, ttl); cacheErr != nil {
					c.app.Logger().Warn("Failed to cache lobid response", "url", fullURL, "error", cacheErr)
				}
			}
			if response.StatusCode >= 200 && response.StatusCode < 300 {
				return response, retried, nil
			}
			if !shouldRetryLobidStatus(response.StatusCode) {
				return response, retried, &lobidHTTPError{StatusCode: response.StatusCode, URL: fullURL}
			}
			lastErr = &lobidHTTPError{StatusCode: response.StatusCode, URL: fullURL}
		} else {
			if ctx.Err() != nil {
				return nil, retried, ctx.Err()
			}
			lastErr = err
		}

		if attempt == maxRetries {
			break
		}

		retried = true
		delay := c.retryDelay(attempt, lastResp)
		if err := sleepWithContext(ctx, delay); err != nil {
			return nil, retried, err
		}
	}

	if lastResp != nil && lastResp.StatusCode > 0 {
		return lastResp, retried, lastErr
	}
	return nil, retried, lastErr
}

func (c *lobidClient) retryLimitForClass(class lobidRequestClass) int {
	switch class {
	case lobidRequestClassRecord:
		return c.config.lookupRetries
	default:
		return c.config.searchRetries
	}
}

func shouldRetryLobidStatus(status int) bool {
	return status == http.StatusUnauthorized ||
		status == http.StatusTooManyRequests ||
		status >= 500
}

func (c *lobidClient) retryDelay(attempt int, response *lobidResponse) time.Duration {
	if response != nil {
		if delay, ok := retryAfterDelay(response.Header.Get("Retry-After")); ok {
			return delay
		}
	}

	backoff := c.config.backoffBase << attempt
	if backoff > c.config.backoffCap {
		backoff = c.config.backoffCap
	}
	if c.config.jitterUpperBound <= 0 {
		return backoff
	}

	lobidRandMu.Lock()
	jitter := time.Duration(lobidRand.Int63n(int64(c.config.jitterUpperBound)))
	lobidRandMu.Unlock()
	return backoff + jitter
}

func retryAfterDelay(value string) (time.Duration, bool) {
	value = strings.TrimSpace(value)
	if value == "" {
		return 0, false
	}
	if seconds, err := strconv.Atoi(value); err == nil {
		if seconds < 0 {
			return 0, true
		}
		return time.Duration(seconds) * time.Second, true
	}
	if parsed, err := http.ParseTime(value); err == nil {
		delay := parsed.Sub(lobidNow())
		if delay < 0 {
			return 0, true
		}
		return delay, true
	}
	return 0, false
}

func (c *lobidClient) acquireSlot(ctx context.Context, class lobidRequestClass) (func(), error) {
	if err := acquireSemaphore(ctx, c.globalSem); err != nil {
		return nil, err
	}

	classSem := c.searchSem
	classRate := &c.searchRate
	if class == lobidRequestClassRecord {
		classSem = c.recordSem
		classRate = &c.recordRate
	}

	if err := acquireSemaphore(ctx, classSem); err != nil {
		releaseSemaphore(c.globalSem)
		return nil, err
	}

	delay := classRate.reserve()
	if err := sleepWithContext(ctx, delay); err != nil {
		releaseSemaphore(classSem)
		releaseSemaphore(c.globalSem)
		return nil, err
	}

	return func() {
		releaseSemaphore(classSem)
		releaseSemaphore(c.globalSem)
	}, nil
}

func (g *lobidRateGate) reserve() time.Duration {
	if g.interval <= 0 {
		return 0
	}

	g.mu.Lock()
	defer g.mu.Unlock()

	now := lobidNow()
	allowedAt := now
	if g.nextAllowed.After(now) {
		allowedAt = g.nextAllowed
	}
	g.nextAllowed = allowedAt.Add(g.interval)
	return allowedAt.Sub(now)
}

func (c *lobidClient) performRequest(ctx context.Context, fullURL string) (*lobidResponse, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, fullURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", lobidUserAgent)
	req.Header.Set("Accept-Encoding", "gzip")

	resp, err := lobidClientHTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := readLobidBody(resp)
	if err != nil {
		return nil, err
	}

	return &lobidResponse{
		StatusCode: resp.StatusCode,
		Body:       body,
		Header:     resp.Header.Clone(),
	}, nil
}

func readLobidBody(resp *http.Response) ([]byte, error) {
	reader := io.Reader(resp.Body)
	if strings.Contains(strings.ToLower(resp.Header.Get("Content-Encoding")), "gzip") {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			return nil, err
		}
		defer gzipReader.Close()
		reader = gzipReader
	}
	return io.ReadAll(reader)
}

func (c *lobidClient) loadCachedResponse(cacheKey string) (*lobidResponse, error) {
	entry, err := dbmodels.LobidCache_Key(c.app, cacheKey)
	if err != nil {
		if isRecordNotFoundError(err) {
			return nil, nil
		}
		return nil, err
	}
	if entry == nil {
		return nil, nil
	}
	if expiresAt := entry.ExpiresAt(); expiresAt.IsZero() || expiresAt.Time().Before(lobidNow()) {
		return nil, nil
	}

	return &lobidResponse{
		StatusCode: entry.StatusCode(),
		Body:       []byte(entry.Body()),
		Cached:     true,
	}, nil
}

func (c *lobidClient) storeCachedResponse(cacheKey, kind string, response *lobidResponse, ttl time.Duration) error {
	if response == nil {
		return nil
	}

	collection, err := c.app.FindCachedCollectionByNameOrId(dbmodels.LOBID_CACHE_TABLE)
	if err != nil {
		return err
	}

	var record *core.Record
	entry, err := dbmodels.LobidCache_Key(c.app, cacheKey)
	if err != nil {
		if !isRecordNotFoundError(err) {
			return err
		}
	} else if entry != nil {
		record = entry.ProxyRecord()
	}

	if record == nil {
		record = core.NewRecord(collection)
	}

	expiresAt, err := types.ParseDateTime(lobidNow().Add(ttl))
	if err != nil {
		return err
	}
	record.Set(dbmodels.KEY_FIELD, cacheKey)
	record.Set(dbmodels.KIND_FIELD, kind)
	record.Set(dbmodels.STATUS_CODE_FIELD, response.StatusCode)
	record.Set(dbmodels.BODY_FIELD, string(response.Body))
	record.Set(dbmodels.EXPIRES_AT_FIELD, expiresAt)

	return c.app.Save(record)
}

func acquireSemaphore(ctx context.Context, sem chan struct{}) error {
	select {
	case sem <- struct{}{}:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

func releaseSemaphore(sem chan struct{}) {
	select {
	case <-sem:
	default:
	}
}

func sleepWithContext(ctx context.Context, delay time.Duration) error {
	if delay <= 0 {
		return nil
	}

	timer := time.NewTimer(delay)
	defer timer.Stop()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}

func isLobidHTTPStatus(err error, status int) bool {
	var httpErr *lobidHTTPError
	if errors.As(err, &httpErr) {
		return httpErr.StatusCode == status
	}
	return false
}
