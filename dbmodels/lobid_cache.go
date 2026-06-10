package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type LobidCache struct {
	core.BaseRecordProxy
}

func NewLobidCache(record *core.Record) *LobidCache {
	entry := &LobidCache{}
	entry.SetProxyRecord(record)
	return entry
}

func (l *LobidCache) TableName() string {
	return LOBID_CACHE_TABLE
}

func (l *LobidCache) Key() string {
	return l.GetString(KEY_FIELD)
}

func (l *LobidCache) SetKey(key string) {
	l.Set(KEY_FIELD, key)
}

func (l *LobidCache) Kind() string {
	return l.GetString(KIND_FIELD)
}

func (l *LobidCache) SetKind(kind string) {
	l.Set(KIND_FIELD, kind)
}

func (l *LobidCache) StatusCode() int {
	return l.GetInt(STATUS_CODE_FIELD)
}

func (l *LobidCache) SetStatusCode(statusCode int) {
	l.Set(STATUS_CODE_FIELD, statusCode)
}

func (l *LobidCache) Body() string {
	return l.GetString(BODY_FIELD)
}

func (l *LobidCache) SetBody(body string) {
	l.Set(BODY_FIELD, body)
}

func (l *LobidCache) ExpiresAt() types.DateTime {
	return l.GetDateTime(EXPIRES_AT_FIELD)
}

func (l *LobidCache) SetExpiresAt(expiresAt types.DateTime) {
	l.Set(EXPIRES_AT_FIELD, expiresAt)
}
