package security

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"log/slog"
	"sync"
	"time"
)

// --- NonceCache ---

type nonceEntry struct {
	expiresAt time.Time
}

// NonceCache stores nonces and their expiration times.
// It is safe for concurrent use.
type NonceCache struct {
	mu                sync.RWMutex
	nonces            map[string]nonceEntry
	defaultExpiration time.Duration
	cleanupInterval   time.Duration
	stopCleanup       chan struct{} // Channel to signal cleanup goroutine to stop
}

// NewNonceCache creates a new in-memory nonce cache.
// defaultExpiration: The default duration for which a nonce is valid.
// cleanupInterval: How often to scan for and remove expired nonces.
func NewNonceCache(defaultExpiration, cleanupInterval time.Duration) *NonceCache {
	if defaultExpiration <= 0 {
		defaultExpiration = 15 * time.Minute // Default to 15 minutes if invalid
	}
	if cleanupInterval <= 0 {
		cleanupInterval = 5 * time.Minute // Default to 5 minutes if invalid
	}
	nc := &NonceCache{
		nonces:            make(map[string]nonceEntry),
		defaultExpiration: defaultExpiration,
		cleanupInterval:   cleanupInterval,
		stopCleanup:       make(chan struct{}),
	}
	go nc.startCleanupRoutine()
	return nc
}

func (nc *NonceCache) Add(nonce string) {
	nc.addWithExpiration(nonce, nc.defaultExpiration)
}

func (nc *NonceCache) addWithExpiration(nonce string, expiresIn time.Duration) {
	if nonce == "" {
		return
	}
	nc.mu.Lock()
	defer nc.mu.Unlock()
	nc.nonces[nonce] = nonceEntry{expiresAt: time.Now().Add(expiresIn)}
}

func (nc *NonceCache) Use(nonce string) bool {
	if nonce == "" {
		return false
	}
	nc.mu.Lock()
	defer nc.mu.Unlock()

	entry, exists := nc.nonces[nonce]
	if !exists {
		return false
	}

	if time.Now().After(entry.expiresAt) {
		delete(nc.nonces, nonce)
		return false
	}

	delete(nc.nonces, nonce)
	return true
}

func (nc *NonceCache) startCleanupRoutine() {
	ticker := time.NewTicker(nc.cleanupInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			nc.cleanupExpiredNonces()
		case <-nc.stopCleanup:
			return
		}
	}
}

func (nc *NonceCache) cleanupExpiredNonces() {
	nc.mu.Lock()
	defer nc.mu.Unlock()

	now := time.Now()
	slog.Debug("Cleaning up expired nonces", "current_time", now, "nonces_count", len(nc.nonces))
	for nonce, entry := range nc.nonces {
		if now.After(entry.expiresAt) {
			delete(nc.nonces, nonce)
		}
	}
}

func (nc *NonceCache) StopCleanup() {
	select {
	case <-nc.stopCleanup:
	default:
		close(nc.stopCleanup)
	}
}

const (
	defaultServerSecretSize = 32 // bytes
	defaultNonceSize        = 16 // bytes for raw nonce before encoding
)

type CSRFProtector struct {
	serverSecret []byte
	nonceCache   *NonceCache
}

func NewCSRFProtector(nonceExpiration, nonceCleanupInterval time.Duration) (*CSRFProtector, error) {
	secretToUse := make([]byte, defaultServerSecretSize)
	if _, err := rand.Read(secretToUse); err != nil {
		return nil, fmt.Errorf("failed to generate server secret: %w", err)
	}

	return &CSRFProtector{
		serverSecret: secretToUse,
		nonceCache:   NewNonceCache(nonceExpiration, nonceCleanupInterval),
	}, nil
}

func (p *CSRFProtector) GenerateTokenBundleWithExpiration(nonceExpiration time.Duration) (nonceB64 string, validationTokenB64 string, err error) {
	if nonceExpiration <= 0 {
		return "", "", errors.New("invalid nonce expiration duration")
	}

	nonceBytes := make([]byte, defaultNonceSize)
	if _, errRand := rand.Read(nonceBytes); errRand != nil {
		return "", "", fmt.Errorf("failed to generate nonce bytes: %w", errRand)
	}
	nonceB64 = base64.URLEncoding.EncodeToString(nonceBytes)

	p.nonceCache.addWithExpiration(nonceB64, nonceExpiration)

	mac := hmac.New(sha256.New, p.serverSecret)
	mac.Write([]byte(nonceB64)) // Sign the base64 encoded nonce string
	validationTokenBytes := mac.Sum(nil)
	validationTokenB64 = base64.URLEncoding.EncodeToString(validationTokenBytes)

	return nonceB64, validationTokenB64, nil
}

func (p *CSRFProtector) GenerateTokenBundle() (nonceB64 string, validationTokenB64 string, err error) {
	nonceBytes := make([]byte, defaultNonceSize)
	if _, errRand := rand.Read(nonceBytes); errRand != nil {
		return "", "", fmt.Errorf("failed to generate nonce bytes: %w", errRand)
	}
	nonceB64 = base64.URLEncoding.EncodeToString(nonceBytes)

	p.nonceCache.Add(nonceB64)

	mac := hmac.New(sha256.New, p.serverSecret)
	mac.Write([]byte(nonceB64)) // Sign the base64 encoded nonce string
	validationTokenBytes := mac.Sum(nil)
	validationTokenB64 = base64.URLEncoding.EncodeToString(validationTokenBytes)

	return nonceB64, validationTokenB64, nil
}

func (p *CSRFProtector) ValidateTokenBundle(nonceSubmittedB64 string, validationTokenSubmittedB64 string) (bool, error) {
	if nonceSubmittedB64 == "" || validationTokenSubmittedB64 == "" {
		return false, errors.New("Leeres CSRF-Token oder Nonce übermittelt.")
	}

	mac := hmac.New(sha256.New, p.serverSecret)
	mac.Write([]byte(nonceSubmittedB64))
	expectedMACTokenBytes := mac.Sum(nil)

	validationTokenSubmittedBytes, err := base64.URLEncoding.DecodeString(validationTokenSubmittedB64)
	if err != nil {
		return false, errors.New("HMAC-Dekodierung des CSRF-Tokens fehlgeschlagen,")
	}

	if !hmac.Equal(validationTokenSubmittedBytes, expectedMACTokenBytes) {
		return false, errors.New("CSRF-Token ungültig, HMAC-Überprüfung fehlgeschlagen")
	}

	if !p.nonceCache.Use(nonceSubmittedB64) {
		return false, errors.New("CSRF-Token ungültig, Nonce abgelaufen oder bereits verwendet.")
	}

	return true, nil
}

func (p *CSRFProtector) StopNonceCacheCleanup() {
	if p.nonceCache != nil {
		p.nonceCache.StopCleanup()
	}
}
