package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*ContentPermalinkRedirect)(nil)

type ContentPermalinkRedirect struct {
	core.BaseRecordProxy
}

func NewContentPermalinkRedirect(record *core.Record) *ContentPermalinkRedirect {
	r := &ContentPermalinkRedirect{}
	r.SetProxyRecord(record)
	return r
}

func (r *ContentPermalinkRedirect) TableName() string {
	return CONTENT_PERMALINK_REDIRECTS_TABLE
}

func (r *ContentPermalinkRedirect) Content() string {
	return r.GetString(CONTENTS_TABLE)
}

func (r *ContentPermalinkRedirect) SetContent(contentID string) {
	r.Set(CONTENTS_TABLE, contentID)
}

func (r *ContentPermalinkRedirect) OldMusenalmID() int {
	return r.GetInt(CONTENT_PERMALINK_REDIRECT_OLD_FIELD)
}

func (r *ContentPermalinkRedirect) SetOldMusenalmID(value int) {
	r.Set(CONTENT_PERMALINK_REDIRECT_OLD_FIELD, value)
}
