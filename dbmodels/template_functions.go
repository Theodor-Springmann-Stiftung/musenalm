package dbmodels

func IsAdminOrEditor(user *FixedUser) bool {
	if user == nil {
		return false
	}
	return user.Role == "Admin" || user.Role == "Editor"
}

func IsAdmin(user *FixedUser) bool {
	if user == nil {
		return false
	}
	return user.Role == "Admin"
}
