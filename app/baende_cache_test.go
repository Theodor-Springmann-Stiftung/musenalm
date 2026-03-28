package app

import (
	"sync/atomic"
	"testing"
	"time"
)

func waitForSignal(t *testing.T, ch <-chan struct{}, timeout time.Duration, label string) {
	t.Helper()

	select {
	case <-ch:
	case <-time.After(timeout):
		t.Fatalf("timed out waiting for %s", label)
	}
}

func waitForCondition(t *testing.T, timeout time.Duration, condition func() bool, label string) {
	t.Helper()

	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if condition() {
			return
		}
		time.Sleep(5 * time.Millisecond)
	}

	t.Fatalf("timed out waiting for %s", label)
}

func TestEnsureBaendeCacheBuildsAndCaches(t *testing.T) {
	app := &App{}
	expected := &BaendeCache{CachedAt: time.Unix(1700000000, 0)}
	var buildCount atomic.Int32

	app.baendeCacheBuildFunc = func() (*BaendeCache, error) {
		buildCount.Add(1)
		return expected, nil
	}

	first, err := app.EnsureBaendeCache()
	if err != nil {
		t.Fatalf("EnsureBaendeCache returned error: %v", err)
	}

	second, err := app.EnsureBaendeCache()
	if err != nil {
		t.Fatalf("EnsureBaendeCache returned error on warm read: %v", err)
	}

	if first != expected {
		t.Fatalf("expected first cache snapshot %p, got %p", expected, first)
	}
	if second != expected {
		t.Fatalf("expected second cache snapshot %p, got %p", expected, second)
	}
	if buildCount.Load() != 1 {
		t.Fatalf("expected one baende cache build, got %d", buildCount.Load())
	}
	if app.baendeCache.Load() != expected {
		t.Fatal("expected published baende cache snapshot to be stored")
	}
}

func TestResetBaendeCacheKeepsPublishedSnapshotDuringRefresh(t *testing.T) {
	app := &App{}
	current := &BaendeCache{CachedAt: time.Unix(1700000000, 0)}
	refreshed := &BaendeCache{CachedAt: time.Unix(1700000100, 0)}
	started := make(chan struct{}, 1)
	release := make(chan struct{})
	var buildCount atomic.Int32

	app.baendeCache.Store(current)
	app.baendeCacheBuildFunc = func() (*BaendeCache, error) {
		buildCount.Add(1)
		select {
		case started <- struct{}{}:
		default:
		}
		<-release
		return refreshed, nil
	}

	app.ResetBaendeCache()
	waitForSignal(t, started, time.Second, "baende cache refresh start")

	got, err := app.EnsureBaendeCache()
	if err != nil {
		t.Fatalf("EnsureBaendeCache returned error during refresh: %v", err)
	}
	if got != current {
		t.Fatalf("expected current snapshot %p during refresh, got %p", current, got)
	}

	close(release)
	waitForCondition(t, time.Second, func() bool {
		return app.baendeCache.Load() == refreshed
	}, "refreshed baende cache publication")

	if buildCount.Load() != 1 {
		t.Fatalf("expected one async baende cache build, got %d", buildCount.Load())
	}
}

func TestScheduleBaendeCacheRebuildCoalescesQueuedRefreshes(t *testing.T) {
	app := &App{}
	app.baendeCache.Store(&BaendeCache{CachedAt: time.Unix(1700000000, 0)})

	firstStarted := make(chan struct{}, 1)
	firstRelease := make(chan struct{})
	secondStarted := make(chan struct{}, 1)
	var buildCount atomic.Int32

	app.baendeCacheBuildFunc = func() (*BaendeCache, error) {
		buildNumber := buildCount.Add(1)
		switch buildNumber {
		case 1:
			select {
			case firstStarted <- struct{}{}:
			default:
			}
			<-firstRelease
			return &BaendeCache{CachedAt: time.Unix(1700000100, 0)}, nil
		case 2:
			select {
			case secondStarted <- struct{}{}:
			default:
			}
			return &BaendeCache{CachedAt: time.Unix(1700000200, 0)}, nil
		default:
			return &BaendeCache{CachedAt: time.Unix(1700000300, 0)}, nil
		}
	}

	app.ScheduleBaendeCacheRebuild()
	waitForSignal(t, firstStarted, time.Second, "first baende cache rebuild")

	app.ScheduleBaendeCacheRebuild()
	close(firstRelease)

	waitForSignal(t, secondStarted, time.Second, "queued baende cache rebuild")
	waitForCondition(t, time.Second, func() bool {
		return !app.baendeCacheRefreshRun
	}, "baende cache refresh loop shutdown")

	if buildCount.Load() != 2 {
		t.Fatalf("expected two coalesced baende cache rebuilds, got %d", buildCount.Load())
	}
}
