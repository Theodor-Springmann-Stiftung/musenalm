package app

import (
	"context"
	"io"
	"net/http"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func TestLobidClientSetsUserAgent(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	var attempts atomic.Int32
	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		attempts.Add(1)
		if got := req.Header.Get("User-Agent"); got != lobidUserAgent {
			t.Fatalf("expected User-Agent %q, got %q", lobidUserAgent, got)
		}
		if got := req.Header.Get("Accept-Encoding"); got != "gzip" {
			t.Fatalf("expected gzip accept encoding, got %q", got)
		}
		return &http.Response{
			StatusCode: http.StatusOK,
			Body: io.NopCloser(strings.NewReader(
				`[{"id":"https://d-nb.info/gnd/116267968","label":"Barth, Carl | * 1787 | † 1853"}]`,
			)),
			Header:  make(http.Header),
			Request: req,
		}, nil
	}))
	defer restoreHTTP()

	results, err := musenalmApp.SearchPersonGNDNameSuggestions(context.Background(), "Barth")
	if err != nil {
		t.Fatalf("SearchPersonGNDNameSuggestions: %v", err)
	}
	if len(results) != 1 {
		t.Fatalf("expected one suggestion, got %#v", results)
	}
	if attempts.Load() != 1 {
		t.Fatalf("expected one HTTP attempt, got %d", attempts.Load())
	}
}

func TestLobidClientRetriesUnauthorizedSearch(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	var attempts atomic.Int32
	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		if attempts.Add(1) == 1 {
			return &http.Response{
				StatusCode: http.StatusUnauthorized,
				Body:       io.NopCloser(strings.NewReader("unauthorized")),
				Header:     make(http.Header),
				Request:    req,
			}, nil
		}
		return &http.Response{
			StatusCode: http.StatusOK,
			Body: io.NopCloser(strings.NewReader(
				`{"totalItems":1,"member":[{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}]}`,
			)),
			Header:  make(http.Header),
			Request: req,
		}, nil
	}))
	defer restoreHTTP()

	resp, retried, err := musenalmApp.searchLobidGND(context.Background(), "Barth, Karl", parseGNDBiographicalHints("1787-1853"))
	if err != nil {
		t.Fatalf("searchLobidGND: %v", err)
	}
	if !retried {
		t.Fatal("expected retry flag")
	}
	if attempts.Load() != 2 {
		t.Fatalf("expected 2 attempts, got %d", attempts.Load())
	}
	if resp.TotalItems != 1 {
		t.Fatalf("unexpected response %#v", resp)
	}
}

func TestLobidClientDoesNotRetryForbiddenSearch(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	var attempts atomic.Int32
	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		attempts.Add(1)
		return &http.Response{
			StatusCode: http.StatusForbidden,
			Body:       io.NopCloser(strings.NewReader("forbidden")),
			Header:     make(http.Header),
			Request:    req,
		}, nil
	}))
	defer restoreHTTP()

	_, _, err := musenalmApp.searchLobidGND(context.Background(), "Barth, Karl", parseGNDBiographicalHints("1787-1853"))
	if err == nil {
		t.Fatal("expected forbidden error")
	}
	if attempts.Load() != 1 {
		t.Fatalf("expected no retry, got %d attempts", attempts.Load())
	}
	if !isLobidHTTPStatus(err, http.StatusForbidden) {
		t.Fatalf("expected forbidden lobid error, got %v", err)
	}
}

func TestLobidClientLimitsSearchConcurrencyToOne(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	var current atomic.Int32
	var max atomic.Int32
	started := make(chan struct{}, 2)
	release := make(chan struct{})

	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		if req.URL.Path != "/gnd/search" {
			t.Fatalf("unexpected path %q", req.URL.Path)
		}
		inFlight := current.Add(1)
		for {
			seen := max.Load()
			if inFlight <= seen || max.CompareAndSwap(seen, inFlight) {
				break
			}
		}
		started <- struct{}{}
		<-release
		current.Add(-1)
		return &http.Response{
			StatusCode: http.StatusOK,
			Body:       io.NopCloser(strings.NewReader(`[]`)),
			Header:     make(http.Header),
			Request:    req,
		}, nil
	}))
	defer restoreHTTP()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	var wg sync.WaitGroup
	for _, query := range []string{"Barth", "Goethe"} {
		wg.Add(1)
		go func(query string) {
			defer wg.Done()
			if _, err := musenalmApp.SearchPersonGNDNameSuggestions(ctx, query); err != nil && ctx.Err() == nil {
				t.Errorf("SearchPersonGNDNameSuggestions(%q): %v", query, err)
			}
		}(query)
	}

	<-started
	select {
	case <-started:
		t.Fatal("expected second search to wait for the first one")
	case <-time.After(20 * time.Millisecond):
	}

	close(release)
	wg.Wait()

	if max.Load() != 1 {
		t.Fatalf("expected max one in-flight search, got %d", max.Load())
	}
}

func TestLobidClientCapsTotalConcurrencyAtTwo(t *testing.T) {
	testApp, musenalmApp := newTestMusenalmApp(t)
	defer cleanupTestMusenalmApp(t, testApp, musenalmApp)

	var current atomic.Int32
	var max atomic.Int32
	started := make(chan struct{}, 3)
	release := make(chan struct{})

	restoreHTTP := lobidClientTestSwapHTTP(t, roundTripFunc(func(req *http.Request) (*http.Response, error) {
		inFlight := current.Add(1)
		for {
			seen := max.Load()
			if inFlight <= seen || max.CompareAndSwap(seen, inFlight) {
				break
			}
		}
		started <- struct{}{}
		<-release
		current.Add(-1)
		return &http.Response{
			StatusCode: http.StatusOK,
			Body: io.NopCloser(strings.NewReader(
				`{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}`,
			)),
			Header:  make(http.Header),
			Request: req,
		}, nil
	}))
	defer restoreHTTP()

	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()

	var wg sync.WaitGroup
	for _, id := range []string{"1", "2", "3"} {
		wg.Add(1)
		go func(id string) {
			defer wg.Done()
			if _, _, err := musenalmApp.fetchLobidGNDRecord(ctx, id); err != nil && ctx.Err() == nil {
				t.Errorf("fetchLobidGNDRecord(%q): %v", id, err)
			}
		}(id)
	}

	<-started
	<-started
	select {
	case <-started:
		t.Fatal("expected third request to wait for a free global slot")
	case <-time.After(20 * time.Millisecond):
	}

	close(release)
	wg.Wait()

	if max.Load() > 2 {
		t.Fatalf("expected at most two concurrent requests, got %d", max.Load())
	}
}
