package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type FixedAccessToken struct {
	Token   string         `json:"token"`
	CSRF    string         `json:"csrf"`
	User    string         `json:"user"`
	Created string         `json:"created"`
	Updated string         `json:"updated"`
	Expires types.DateTime `json:"expires"`
	URL     string         `json:"url"`
	Status  string         `json:"status"`
}

func (s *FixedAccessToken) IsExpired() bool {
	return s.Expires.IsZero() || s.Expires.Before(types.NowDateTime())
}

var _ core.RecordProxy = (*AccessToken)(nil)

type AccessToken struct {
	core.BaseRecordProxy
}

func NewAccessToken(record *core.Record) *AccessToken {
	i := &AccessToken{}
	i.SetProxyRecord(record)
	return i
}

func (u *AccessToken) TableName() string {
	return ACCESS_TOKENS_TABLE
}

func (u *AccessToken) Token() string {
	return u.GetString(ACCESS_TOKENS_TOKEN_FIELD)
}

func (u *AccessToken) SetToken(token string) {
	u.Set(ACCESS_TOKENS_TOKEN_FIELD, token)
}

func (u *AccessToken) User() string {
	return u.GetString(ACCESS_TOKENS_USER_FIELD)
}

func (u *AccessToken) CSRF() string {
	return u.GetString(ACCESS_TOKENS_CSRF_FIELD)
}

func (u *AccessToken) SetCSRF(csrf string) {
	u.Set(ACCESS_TOKENS_CSRF_FIELD, csrf)
}

func (u *AccessToken) SetUser(userId string) {
	u.Set(ACCESS_TOKENS_USER_FIELD, userId)
}

func (u *AccessToken) Created() string {
	return u.GetString(CREATED_FIELD)
}

func (u *AccessToken) Updated() string {
	return u.GetString(UPDATED_FIELD)
}

func (u *AccessToken) Expires() types.DateTime {
	return u.GetDateTime(ACCESS_TOKENS_EXPIRES_FIELD)
}

func (u *AccessToken) SetExpires(expires types.DateTime) {
	u.Set(ACCESS_TOKENS_EXPIRES_FIELD, expires)
}

func (u *AccessToken) URL() string {
	return u.GetString(ACCESS_TOKENS_URL_FIELD)
}

func (u *AccessToken) SetURL(url string) {
	u.Set(ACCESS_TOKENS_URL_FIELD, url)
}

func (u *AccessToken) Status() string {
	return u.GetString(ACCESS_TOKENS_STATUS_FIELD)
}

func (u *AccessToken) SetStatus(status string) {
	u.Set(ACCESS_TOKENS_STATUS_FIELD, status)
}

func (u *AccessToken) IsExpired() bool {
	return u.Expires().IsZero() || u.Expires().Before(types.NowDateTime())
}

func (u *AccessToken) Fixed() *FixedAccessToken {
	return &FixedAccessToken{
		Token:   u.Token(),
		User:    u.User(),
		Created: u.Created(),
		Updated: u.Updated(),
		Expires: u.Expires(),
		URL:     u.URL(),
		Status:  u.Status(),
	}
}
