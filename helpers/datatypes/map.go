package datatypes

func MakeMap[T any, U comparable](data []T, f func(T) U) map[U]T {
	m := make(map[U]T)
	for _, v := range data {
		m[f(v)] = v
	}
	return m
}
