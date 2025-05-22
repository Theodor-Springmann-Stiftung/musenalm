package collections

import (
	"sync"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
)

type cacheEntry struct {
	user    dbmodels.FixedUser
	session dbmodels.FixedSession
}

type UserSessionCache struct {
	mu                sync.RWMutex
	capacity          int
	cache             sync.Map
	approximateSize   int
	cleanupInterval   time.Duration
	stopCleanupSignal chan struct{}
}

func NewUserSessionCache(capacity int, cleanupInterval time.Duration) *UserSessionCache {
	if capacity <= 0 {
		capacity = 1000
	}
	if cleanupInterval <= 0 {
		cleanupInterval = 5 * time.Minute
	}

	cache := &UserSessionCache{
		capacity:          capacity,
		cache:             sync.Map{},
		cleanupInterval:   cleanupInterval,
		stopCleanupSignal: make(chan struct{}),
	}
	go cache.startCleanupRoutine()
	return cache
}

func (c *UserSessionCache) Set(user *dbmodels.User, session *dbmodels.Session) (*dbmodels.FixedUser, *dbmodels.FixedSession) {
	if user == nil || session == nil {
		return nil, nil
	}

	newEntry := &cacheEntry{
		user:    user.Fixed(),
		session: session.Fixed(),
	}

	_, loaded := c.cache.LoadOrStore(session.Token(), newEntry)
	if !loaded {
		c.cache.Store(session.Token(), newEntry)
		c.mu.Lock()
		c.approximateSize++
		c.mu.Unlock()
	}

	return &newEntry.user, &newEntry.session
}

func (c *UserSessionCache) Get(sessionTokenClear string) (*dbmodels.FixedUser, *dbmodels.FixedSession, bool) {
	if sessionTokenClear == "" {
		return nil, nil, false
	}

	value, ok := c.cache.Load(sessionTokenClear)
	if !ok {
		return nil, nil, false
	}

	entry, ok := value.(*cacheEntry)
	if !ok {
		c.cache.Delete(sessionTokenClear)
		return nil, nil, false
	}

	if time.Now().After(entry.session.Expires.Time()) {
		c.cache.Delete(sessionTokenClear)
		c.mu.Lock()
		c.approximateSize--
		c.mu.Unlock()
		return nil, nil, false
	}

	return &entry.user, &entry.session, true
}

func (c *UserSessionCache) Delete(sessionTokenClear string) {
	if sessionTokenClear == "" {
		return
	}
	_, loaded := c.cache.LoadAndDelete(sessionTokenClear)
	if loaded {
		c.mu.Lock()
		c.approximateSize--
		c.mu.Unlock()
	}
}

func (c *UserSessionCache) startCleanupRoutine() {
	ticker := time.NewTicker(c.cleanupInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			c.cleanupExpiredItems()
		case <-c.stopCleanupSignal:
			return
		}
	}
}

func (c *UserSessionCache) cleanupExpiredItems() {
	now := time.Now()
	var newSize int
	c.cache.Range(func(key, value any) bool {
		entry, ok := value.(*cacheEntry)
		if !ok {
			c.cache.Delete(key)
			return true
		}

		if now.After(entry.session.Expires.Time()) {
			c.cache.Delete(key)
		} else {
			newSize++
		}
		return true
	})

	c.mu.Lock()
	c.approximateSize = newSize
	c.mu.Unlock()
}

func (c *UserSessionCache) StopCleanup() {
	select {
	case <-c.stopCleanupSignal:
	default:
		close(c.stopCleanupSignal)
	}
}
