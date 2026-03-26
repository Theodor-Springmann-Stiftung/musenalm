package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type FixedSession struct {
	ID         string         `json:"id"`
	Token      string         `json:"token"`
	Superuser  string         `json:"superuser"`
	User       string         `json:"user"`
	Created    string         `json:"created"`
	Updated    string         `json:"updated"`
	Expires    types.DateTime `json:"expires"`
	IP         string         `json:"ip"`
	UserAgent  string         `json:"user_agent"`
	LastAccess types.DateTime `json:"last_access"`
	Persist    bool           `json:"persist"`
	CSRF       string         `json:"csrf"`
}

func (s *FixedSession) IsExpired() bool {
	return s.Expires.IsZero() || s.Expires.Before(types.NowDateTime())
}

var _ core.RecordProxy = (*Place)(nil)

type Session struct {
	SessionTokenClear string `json:"-"`
	core.BaseRecordProxy
}

func NewSession(record *core.Record) *Session {
	i := &Session{}
	i.SetProxyRecord(record)
	return i
}

func (u *Session) TableName() string {
	return SESSIONS_TABLE
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

func (u *Session) Superuser() string {
	return u.GetString(SESSIONS_SUPERUSER_FIELD)
}

func (u *Session) SetSuperuser(superuserId string) {
	u.Set(SESSIONS_SUPERUSER_FIELD, superuserId)
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

func (u *Session) CSRF() string {
	return u.GetString(SESSIONS_CSRF_FIELD)
}

func (u *Session) SetCSRF(csrf string) {
	u.Set(SESSIONS_CSRF_FIELD, csrf)
}

func (u *Session) IsExpired() bool {
	return u.Expires().IsZero() || u.Expires().Before(types.NowDateTime())
}

func (u *Session) Status() string {
	return u.GetString(SESSIONS_STATUS_FIELD)
}

func (u *Session) SetStatus(status string) {
	u.Set(SESSIONS_STATUS_FIELD, status)
}

func (u *Session) Fixed() FixedSession {
	return FixedSession{
		ID:         u.Id,
		Token:      u.Token(),
		Superuser:  u.Superuser(),
		User:       u.User(),
		Created:    u.Created(),
		Updated:    u.Updated(),
		Expires:    u.Expires(),
		IP:         u.IP(),
		UserAgent:  u.UserAgent(),
		LastAccess: u.LastAccess(),
		Persist:    u.Persist(),
		CSRF:       u.CSRF(),
	}
}
