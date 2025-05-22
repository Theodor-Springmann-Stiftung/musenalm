package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var _ core.RecordProxy = (*Place)(nil)

type Session struct {
	core.BaseRecordProxy
}

func NewSession(record *core.Record) *Session {
	i := &Session{}
	i.SetProxyRecord(record)
	return i
}

func (u *Session) TableName() string {
	return USERS_TABLE
}

func (u *Session) Token() string {
	return u.GetString(SESSIONS_TOKEN_FIELD)
}

func (u *Session) SetToken(token string) {
	u.Set(SESSIONS_TOKEN_FIELD, token)
}

func (u *Session) User() string {
	return u.GetString(SESSIONS_USER_FIELD)
}

func (u *Session) SetUser(userId string) {
	u.Set(SESSIONS_USER_FIELD, userId)
}

func (u *Session) Created() string {
	return u.GetString(CREATED_FIELD)
}

func (u *Session) Updated() string {
	return u.GetString(UPDATED_FIELD)
}

func (u *Session) Expires() types.DateTime {
	return u.GetDateTime(SESSIONS_EXPIRES_FIELD)
}

func (u *Session) SetExpires(expires types.DateTime) {
	u.Set(SESSIONS_EXPIRES_FIELD, expires)
}

func (u *Session) IP() string {
	return u.GetString(SESSIONS_IP_FIELD)
}

func (u *Session) SetIP(ip string) {
	u.Set(SESSIONS_IP_FIELD, ip)
}

func (u *Session) UserAgent() string {
	return u.GetString(SESSIONS_USER_AGENT_FIELD)
}

func (u *Session) SetUserAgent(userAgent string) {
	u.Set(SESSIONS_USER_AGENT_FIELD, userAgent)
}

func (u *Session) LastAccess() types.DateTime {
	return u.GetDateTime(SESSIONS_LAST_ACCESS_FIELD)
}

func (u *Session) SetLastAccess(lastAccess types.DateTime) {
	u.Set(SESSIONS_LAST_ACCESS_FIELD, lastAccess)
}

func (u *Session) Persist() bool {
	return u.GetBool(SESSIONS_PERSIST_FIELD)
}

func (u *Session) SetPersist(persist bool) {
	u.Set(SESSIONS_PERSIST_FIELD, persist)
}
