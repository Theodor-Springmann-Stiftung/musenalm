package dbmodels

import "github.com/pocketbase/pocketbase/core"

type Data struct {
	core.BaseRecordProxy
}

func (d *Data) Key() string {
	return d.GetString(KEY_FIELD)
}

func (d *Data) SetKey(key string) {
	d.Set(KEY_FIELD, key)
}

func (d *Data) Value() any {
	return d.GetRaw(VALUE_FIELD)
}

func (d *Data) SetValue(value string) {
	d.Set(VALUE_FIELD, value)
}
