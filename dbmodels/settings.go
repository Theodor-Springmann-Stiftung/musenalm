package dbmodels

import "github.com/pocketbase/pocketbase/core"

type Setting struct {
	core.BaseRecordProxy
}

func (s *Setting) Key() string {
	return s.GetString(KEY_FIELD)
}

func (s *Setting) SetKey(key string) {
	s.Set(KEY_FIELD, key)
}

func (s *Setting) Value() any {
	return s.GetRaw(VALUE_FIELD)
}

func (s *Setting) SetValue(value any) {
	s.Set(VALUE_FIELD, value)
}
