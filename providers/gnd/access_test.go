package gnd

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"
)

func TestFromData(t *testing.T) {
	data := map[string]any{
		"gnd": map[string]any{
			"id":            "https://d-nb.info/gnd/116267968",
			"gndIdentifier": "116267968",
			"preferredName": "Barth, Carl",
			"dateOfBirth":   []any{"1787"},
		},
	}

	person := FromData("https://d-nb.info/gnd/116267968", data)
	if person == nil {
		t.Fatal("expected typed person")
	}
	if person.GndIdentifier != "116267968" {
		t.Fatalf("expected GND identifier, got %q", person.GndIdentifier)
	}
	if person.PreferredName != "Barth, Carl" {
		t.Fatalf("expected preferred name, got %q", person.PreferredName)
	}
}

func TestFromDataReturnsNilForInvalidCases(t *testing.T) {
	if got := FromData("https://example.com/person/1", map[string]any{"gnd": map[string]any{"preferredName": "X"}}); got != nil {
		t.Fatal("expected nil for non-GND URI")
	}
	if got := FromData("https://d-nb.info/gnd/1", nil); got != nil {
		t.Fatal("expected nil for missing data")
	}
	if got := FromData("https://d-nb.info/gnd/1", map[string]any{"gnd": "broken"}); got != nil {
		t.Fatal("expected nil for malformed gnd payload")
	}
}

func TestIsGNDURI(t *testing.T) {
	cases := map[string]bool{
		"https://d-nb.info/gnd/1": true,
		"http://d-nb.info/gnd/1":  true,
		"d-nb.info/gnd/1":         true,
		"//d-nb.info/gnd/1":       true,
		"https://example.com/1":   false,
		"":                        false,
	}

	for input, want := range cases {
		if got := IsGNDURI(input); got != want {
			t.Fatalf("IsGNDURI(%q): want %v, got %v", input, want, got)
		}
	}
}

func TestSyncDataRemovesGNDPayloadWhenURICleared(t *testing.T) {
	data := map[string]any{
		"gnd":                         map[string]any{"preferredName": "Barth, Carl"},
		"gnd_query_name":              "Barth, Karl",
		"gnd_query_biographical_data": "1787-1853",
		"custom":                      "keep",
	}

	uri, synced, err := SyncData(context.Background(), "", data)
	if err != nil {
		t.Fatalf("SyncData: %v", err)
	}
	if uri != "" {
		t.Fatalf("expected empty URI, got %q", uri)
	}
	if synced["custom"] != "keep" {
		t.Fatalf("expected custom data to remain, got %#v", synced)
	}
	if _, ok := synced["gnd"]; ok {
		t.Fatalf("expected gnd data to be removed, got %#v", synced)
	}
}

func TestSyncDataFetchesAndNormalizesGNDRecord(t *testing.T) {
	origClient := httpClient
	origBaseURL := lobidBaseURL
	origSleep := sleep
	defer func() {
		httpClient = origClient
		lobidBaseURL = origBaseURL
		sleep = origSleep
	}()

	attempts := 0
	httpClient = &http.Client{
		Transport: roundTripFunc(func(req *http.Request) (*http.Response, error) {
			attempts++
			if attempts == 1 {
				return &http.Response{
					StatusCode: http.StatusNotFound,
					Body:       io.NopCloser(strings.NewReader("not found")),
					Header:     make(http.Header),
					Request:    req,
				}, nil
			}
			return &http.Response{
				StatusCode: http.StatusOK,
				Body: io.NopCloser(strings.NewReader(
					`{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl"}`,
				)),
				Header:  make(http.Header),
				Request: req,
			}, nil
		}),
	}
	lobidBaseURL = "https://lobid.test/gnd"
	sleep = func(time.Duration) {}

	uri, synced, err := SyncData(context.Background(), "d-nb.info/gnd/116267968", map[string]any{"custom": "keep"})
	if err != nil {
		t.Fatalf("SyncData: %v", err)
	}
	if attempts != 2 {
		t.Fatalf("expected retry, got %d attempts", attempts)
	}
	if uri != "https://d-nb.info/gnd/116267968" {
		t.Fatalf("expected normalized URI, got %q", uri)
	}
	if synced["custom"] != "keep" {
		t.Fatalf("expected custom data preserved, got %#v", synced)
	}
	record, ok := synced["gnd"].(map[string]any)
	if !ok {
		t.Fatalf("expected raw record map, got %#v", synced["gnd"])
	}
	if record["preferredName"] != "Barth, Carl" {
		t.Fatalf("expected fetched GND payload, got %#v", record)
	}
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}
