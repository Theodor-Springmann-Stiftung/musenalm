package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
	"github.com/pocketbase/pocketbase/tools/types"
)

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

// INFO: Email is already set on the core.Record
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
