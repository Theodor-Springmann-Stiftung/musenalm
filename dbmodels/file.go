package dbmodels

import "github.com/pocketbase/pocketbase/core"

type File struct {
	core.BaseRecordProxy
}

func (f *File) Key() string {
	return f.GetString(KEY_FIELD)
}

func (f *File) SetKey(key string) {
	f.Set(KEY_FIELD, key)
}

func (f *File) Description() string {
	return f.GetString(DESCRIPTION_FIELD)
}

func (f *File) SetDescription(description string) {
	f.Set(DESCRIPTION_FIELD, description)
}

func (f *File) FileField() string {
	return f.GetString(FILE_FIELD)
}

func (f *File) SetFileField(file string) {
	f.Set(FILE_FIELD, file)
}
