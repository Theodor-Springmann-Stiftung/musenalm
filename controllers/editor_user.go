package controllers

import "github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"

func editableUserID(user *dbmodels.FixedUser) string {
	if user == nil || user.IsSuperuser {
		return ""
	}
	return user.Id
}
