package controllers

import (
	"errors"
	"testing"
	"time"
)

func berlinLocation(t *testing.T) *time.Location {
	t.Helper()

	location, err := time.LoadLocation("Europe/Berlin")
	if err != nil {
		t.Fatalf("load Europe/Berlin: %v", err)
	}

	return location
}

func TestSessionExpiryWindow(t *testing.T) {
	t.Parallel()

	berlin := berlinLocation(t)

	tests := []struct {
		name       string
		now        time.Time
		persistent bool
		want       time.Time
	}{
		{
			name:       "non-persistent before two",
			now:        time.Date(2026, time.January, 15, 1, 30, 0, 0, berlin),
			persistent: false,
			want:       time.Date(2026, time.January, 16, 2, 0, 0, 0, berlin),
		},
		{
			name:       "non-persistent after two",
			now:        time.Date(2026, time.January, 15, 15, 45, 0, 0, berlin),
			persistent: false,
			want:       time.Date(2026, time.January, 16, 2, 0, 0, 0, berlin),
		},
		{
			name:       "persistent monday to next monday",
			now:        time.Date(2026, time.January, 12, 11, 0, 0, 0, berlin),
			persistent: true,
			want:       time.Date(2026, time.January, 19, 2, 0, 0, 0, berlin),
		},
		{
			name:       "persistent friday to next friday",
			now:        time.Date(2026, time.January, 16, 23, 0, 0, 0, berlin),
			persistent: true,
			want:       time.Date(2026, time.January, 23, 2, 0, 0, 0, berlin),
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			gotExpiry, gotDuration, err := sessionExpiryWindow(tt.now, tt.persistent)
			if err != nil {
				t.Fatalf("sessionExpiryWindow returned error: %v", err)
			}

			if !gotExpiry.Equal(tt.want) {
				t.Fatalf("expected expiry %v, got %v", tt.want, gotExpiry)
			}

			wantDuration := tt.want.Sub(tt.now)
			if gotDuration != wantDuration {
				t.Fatalf("expected duration %v, got %v", wantDuration, gotDuration)
			}
		})
	}
}

func TestSessionExpiryWindowDST(t *testing.T) {
	t.Parallel()

	berlin := berlinLocation(t)

	tests := []struct {
		name         string
		now          time.Time
		want         time.Time
		wantDuration time.Duration
	}{
		{
			name:         "persistent across spring forward",
			now:          time.Date(2026, time.March, 23, 12, 0, 0, 0, berlin),
			want:         time.Date(2026, time.March, 30, 2, 0, 0, 0, berlin),
			wantDuration: 157 * time.Hour,
		},
		{
			name:         "persistent across fall back",
			now:          time.Date(2026, time.October, 19, 12, 0, 0, 0, berlin),
			want:         time.Date(2026, time.October, 26, 2, 0, 0, 0, berlin),
			wantDuration: 159 * time.Hour,
		},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			gotExpiry, gotDuration, err := sessionExpiryWindow(tt.now, true)
			if err != nil {
				t.Fatalf("sessionExpiryWindow returned error: %v", err)
			}

			if !gotExpiry.Equal(tt.want) {
				t.Fatalf("expected expiry %v, got %v", tt.want, gotExpiry)
			}

			if gotDuration != tt.wantDuration {
				t.Fatalf("expected duration %v, got %v", tt.wantDuration, gotDuration)
			}
		})
	}
}

func TestSessionExpiryWindowLoadLocationError(t *testing.T) {
	originalLoader := berlinLocationLoader
	berlinLocationLoader = func(name string) (*time.Location, error) {
		return nil, errors.New("boom")
	}
	defer func() {
		berlinLocationLoader = originalLoader
	}()

	_, _, err := sessionExpiryWindow(time.Unix(0, 0), false)
	if err == nil {
		t.Fatal("expected sessionExpiryWindow to fail when Europe/Berlin cannot be loaded")
	}
}

func TestNewSessionCookie(t *testing.T) {
	t.Parallel()

	berlin := berlinLocation(t)
	expiresAt := time.Date(2026, time.January, 19, 2, 0, 0, 0, berlin)
	duration := 15*time.Hour + 30*time.Minute

	t.Run("persistent", func(t *testing.T) {
		t.Parallel()

		cookie := newSessionCookie("clear-token", true, duration, expiresAt)

		if cookie.MaxAge != int(duration.Seconds()) {
			t.Fatalf("expected MaxAge %d, got %d", int(duration.Seconds()), cookie.MaxAge)
		}
		if !cookie.Expires.Equal(expiresAt) {
			t.Fatalf("expected Expires %v, got %v", expiresAt, cookie.Expires)
		}
	})

	t.Run("non-persistent", func(t *testing.T) {
		t.Parallel()

		cookie := newSessionCookie("clear-token", false, duration, expiresAt)

		if cookie.MaxAge != 0 {
			t.Fatalf("expected session cookie MaxAge 0, got %d", cookie.MaxAge)
		}
		if !cookie.Expires.IsZero() {
			t.Fatalf("expected zero Expires for session cookie, got %v", cookie.Expires)
		}
	})
}
