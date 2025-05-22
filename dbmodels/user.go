package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
	"github.com/pocketbase/pocketbase/tools/types"
)

type FixedUser struct {
	Id       string         `json:"id"`
	Email    string         `json:"email"`
	Created  types.DateTime `json:"created"`
	Updated  types.DateTime `json:"updated"`
	Name     string         `json:"name"`
	Role     string         `json:"role"`
	Avatar   string         `json:"avatar"`
	Verified bool           `json:"verified"`
	Settings string         `json:"settings"`
}

var _ core.RecordProxy = (*Place)(nil)

type User struct {
	core.BaseRecordProxy
}

func NewUser(record *core.Record) *User {
	i := &User{}
	i.SetProxyRecord(record)
	return i
}

func (u *User) TableName() string {
	return USERS_TABLE
}

// INFO: Email, password functions are already set on the core.Record
// TODO: We need to create a settings struct as soon as we have settings
func (u *User) Name() string {
	return u.GetString(USERS_NAME_FIELD)
}

func (u *User) SetName(name string) {
	u.Set(USERS_NAME_FIELD, name)
}

func (u *User) Created() types.DateTime {
	return u.GetDateTime(CREATED_FIELD)
}

func (u *User) Updated() types.DateTime {
	return u.GetDateTime(UPDATED_FIELD)
}

func (u *User) Role() string {
	return u.GetString(USERS_ROLE_FIELD)
}

func (u *User) SetRole(role string) {
	u.Set(USERS_ROLE_FIELD, role)
}

func (u *User) Avatar() string {
	av := u.GetString(USERS_AVATAR_FIELD)
	if av != "" {
		return "/api/files/" + u.TableName() + "/" + u.Id + "/" + av
	}
	return av
}

func (u *User) SetAvatar(avatar *filesystem.File) {
	u.Set(USERS_AVATAR_FIELD, avatar)
}

func (u *User) Fixed() FixedUser {
	return FixedUser{
		Id:       u.Id,
		Email:    u.Email(),
		Created:  u.Created(),
		Updated:  u.Updated(),
		Name:     u.Name(),
		Role:     u.Role(),
		Avatar:   u.Avatar(),
		Verified: u.Verified(),
	}
}
