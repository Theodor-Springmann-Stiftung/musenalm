package migrations

import (
	"context"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

func TestParseGNDBiographicalHints(t *testing.T) {
	tests := []struct {
		name      string
		input     string
		wantBirth string
		wantDeath string
		wantYears []string
	}{
		{name: "exact range", input: "1787-1853", wantBirth: "1787", wantDeath: "1853"},
		{name: "birth only with question", input: "1786-?", wantBirth: "1786"},
		{name: "birth only trailing dash", input: "1786-", wantBirth: "1786"},
		{name: "death only", input: "?-1840", wantDeath: "1840"},
		{name: "multiple explicit years", input: "e. 1832; 1836", wantYears: []string{"1832", "1836"}},
		{name: "century phrase", input: "Mitte 19. Jh.", wantYears: nil},
		{name: "uncertain death", input: "1713- <1797", wantYears: []string{"1713", "1797"}},
		{name: "bc ignored", input: "525-456 v. Chr.", wantYears: nil},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := parseGNDBiographicalHints(tt.input)
			if got.BirthYear != tt.wantBirth {
				t.Fatalf("expected birth %q, got %q", tt.wantBirth, got.BirthYear)
			}
			if got.DeathYear != tt.wantDeath {
				t.Fatalf("expected death %q, got %q", tt.wantDeath, got.DeathYear)
			}
			if strings.Join(got.Extracted, ",") != strings.Join(tt.wantYears, ",") {
				t.Fatalf("expected years %#v, got %#v", tt.wantYears, got.Extracted)
			}
		})
	}
}

func TestChooseGNDCandidatePrefersExactYearAndName(t *testing.T) {
	hints := parseGNDBiographicalHints("1787-1853")
	queryName := "Barth, Karl"
	members := []map[string]any{
		{
			"gndIdentifier": "2",
			"id":            "https://d-nb.info/gnd/2",
			"preferredName": "Barth, Karl",
			"variantName":   []any{"Barth, K."},
			"dateOfBirth":   []any{"1787"},
			"dateOfDeath":   []any{"1852"},
		},
		{
			"gndIdentifier": "1",
			"id":            "https://d-nb.info/gnd/1",
			"preferredName": "Barth, Carl",
			"variantName":   []any{"Barth, Karl"},
			"dateOfBirth":   []any{"1787"},
			"dateOfDeath":   []any{"1853"},
		},
	}

	got, strategy, weak := chooseGNDCandidate(queryName, hints, members)
	if got == nil {
		t.Fatal("expected a candidate")
	}
	if stringValue(got["gndIdentifier"]) != "1" {
		t.Fatalf("expected GND 1, got %v", got["gndIdentifier"])
	}
	if strategy != "exact_years" && strategy != "single_year_exact_name" {
		t.Fatalf("unexpected strategy %q", strategy)
	}
	if weak {
		t.Fatal("expected strong match")
	}
}

func TestChooseGNDCandidateVariantOnlyIsWeak(t *testing.T) {
	queryName := "Barth, Karl"
	members := []map[string]any{
		{
			"gndIdentifier": "1",
			"id":            "https://d-nb.info/gnd/1",
			"preferredName": "Barth, Carl",
			"variantName":   []any{"Barth, Karl"},
		},
	}

	got, strategy, weak := chooseGNDCandidate(queryName, gndBiographicalHints{}, members)
	if got == nil {
		t.Fatal("expected a candidate")
	}
	if strategy != "variant_name" {
		t.Fatalf("unexpected strategy %q", strategy)
	}
	if !weak {
		t.Fatal("expected weak match")
	}
}

func TestMarkAgentWeakGNDMatchSetsReviewAndCommentOnce(t *testing.T) {
	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.SelectField{Name: dbmodels.EDITSTATE_FIELD},
		&core.TextField{Name: dbmodels.COMMENT_FIELD},
	)

	record := core.NewRecord(collection)
	agent := dbmodels.NewAgent(record)
	agent.SetEditState("Unknown")
	agent.SetComment("Existing")

	markAgentWeakGNDMatch(agent)
	markAgentWeakGNDMatch(agent)

	if agent.EditState() != "Review" {
		t.Fatalf("expected Review state, got %q", agent.EditState())
	}
	if agent.Comment() != "Existing\nDNB: weak Match" {
		t.Fatalf("unexpected comment %q", agent.Comment())
	}
}

func TestSearchLobidGNDRetriesTransient404(t *testing.T) {
	attempts := 0
	origURL := gndLobidBaseURL
	origSleep := gndSleep
	origClient := gndHTTPClient
	defer func() {
		gndLobidBaseURL = origURL
		gndSleep = origSleep
		gndHTTPClient = origClient
	}()
	gndLobidBaseURL = "https://lobid.test/gnd/search"
	gndSleep = func(time.Duration) {}
	gndHTTPClient = &http.Client{
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
					`{"totalItems":1,"member":[{"id":"https://d-nb.info/gnd/116267968","gndIdentifier":"116267968","preferredName":"Barth, Carl","variantName":["Barth, Karl"],"dateOfBirth":["1787"],"dateOfDeath":["1853"]}]}`,
				)),
				Header:  make(http.Header),
				Request: req,
			}, nil
		}),
	}

	resp, retried, err := searchLobidGND(context.Background(), "Barth, Karl", parseGNDBiographicalHints("1787-1853"))
	if err != nil {
		t.Fatalf("searchLobidGND: %v", err)
	}
	if !retried {
		t.Fatal("expected retry flag")
	}
	if attempts != 2 {
		t.Fatalf("expected 2 attempts, got %d", attempts)
	}
	if resp.TotalItems != 1 || len(resp.Member) != 1 {
		t.Fatalf("unexpected response: %#v", resp)
	}
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (f roundTripFunc) RoundTrip(req *http.Request) (*http.Response, error) {
	return f(req)
}
