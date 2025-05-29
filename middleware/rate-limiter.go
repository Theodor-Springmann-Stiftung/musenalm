package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

type clientStats struct {
	count       int
	windowStart time.Time
}

func RateLimiter(limit int, windowDuration time.Duration, cleanupInterval time.Duration) func(*core.RequestEvent) error {
	clientRequests := make(map[string]*clientStats)
	var mu sync.Mutex

	startPeriodicCleanup(clientRequests, &mu, windowDuration, cleanupInterval)

	return func(e *core.RequestEvent) error {
		if e == nil {
			return nil
		}

		ipStr := e.RealIP()

		mu.Lock()
		defer mu.Unlock()

		stats, exists := clientRequests[ipStr]
		now := time.Now()

		if !exists || now.After(stats.windowStart.Add(windowDuration)) {
			clientRequests[ipStr] = &clientStats{
				count:       1,
				windowStart: now,
			}
			return e.Next()
		}

		if stats.count >= limit {
			return e.Error(http.StatusTooManyRequests, "Too Many Requests", nil)
		}

		stats.count++
		return e.Next()
	}
}

func performCleanupCycle(clientRequests map[string]*clientStats, mu *sync.Mutex, windowDuration time.Duration) {
	mu.Lock()
	defer mu.Unlock()

	now := time.Now()
	maxEntryAge := 2 * windowDuration
	for ip, stats := range clientRequests {
		if now.After(stats.windowStart.Add(maxEntryAge)) {
			delete(clientRequests, ip)
		}
	}
}

func startPeriodicCleanup(clientRequests map[string]*clientStats, mu *sync.Mutex, windowDuration time.Duration, cleanupInterval time.Duration) {
	go func() {
		ticker := time.NewTicker(cleanupInterval)
		defer ticker.Stop() // Stop the ticker when this goroutine exits (though it runs indefinitely here)

		for range ticker.C {
			performCleanupCycle(clientRequests, mu, windowDuration)
		}
	}()
}
