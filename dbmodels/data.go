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

func (d *Data) Value() map[string]interface{} {
	val := d.Get(VALUE_FIELD)
	if val == nil {
		return nil
	}
	return val.(map[string]interface{})
}

func (d *Data) SetValue(value map[string]interface{}) {
	d.Set(VALUE_FIELD, value)
}
