package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

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
