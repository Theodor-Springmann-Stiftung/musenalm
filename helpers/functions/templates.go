package functions

import "fmt"

func Arr(els ...any) []any {
	return els
}

func Dict(values ...interface{}) (map[string]interface{}, error) {
	// Must have even number of args: key, value, key, value, ...
	if len(values)%2 != 0 {
		return nil, fmt.Errorf("invalid dict call: must have even number of args")
	}

	m := make(map[string]interface{}, len(values)/2)
	for i := 0; i < len(values); i += 2 {
		key, ok := values[i].(string)
		if !ok {
			return nil, fmt.Errorf("dict keys must be strings")
		}
		m[key] = values[i+1]
	}
	return m, nil
}
