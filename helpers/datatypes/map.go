package datatypes

// INFO: use this if your key is unique
func MakeMap[T any, U comparable](data []T, f func(T) U) map[U]T {
	m := make(map[U]T, len(data))
	for _, v := range data {
		m[f(v)] = v
	}
	return m
}

// INFO: use this if your key is not unique
func MakeMultiMap[T any, U comparable](data []T, f func(T) U) map[U][]T {
	m := make(map[U][]T, len(data))
	for _, v := range data {
		m[f(v)] = append(m[f(v)], v)
	}
	return m
}
