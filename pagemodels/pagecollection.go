package pagemodels

import "github.com/pocketbase/pocketbase/core"

type IPageCollection interface {
	core.RecordProxy
	Collection(pagename string) *core.Collection
}
