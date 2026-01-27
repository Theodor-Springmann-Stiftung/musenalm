package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

type File struct {
	core.BaseRecordProxy
}

func (f *File) Key() string {
	return f.GetString(KEY_FIELD)
}

func (f *File) SetKey(key string) {
	f.Set(KEY_FIELD, key)
}

func (f *File) Title() string {
	return f.GetString(TITLE_FIELD)
}

func (f *File) SetTitle(title string) {
	f.Set(TITLE_FIELD, title)
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

func (f *File) PublicURL() string {
	filename := f.FileField()
	if filename == "" {
		return ""
	}
	return "/api/files/" + FILES_TABLE + "/" + f.Id + "/" + filename
}

func (f *File) Created() types.DateTime {
	return f.GetDateTime(CREATED_FIELD)
}

func (f *File) CreatedUnix() int64 {
	t := f.GetDateTime(CREATED_FIELD)
	if t.IsZero() {
		return 0
	}
	return t.Time().Unix()
}
