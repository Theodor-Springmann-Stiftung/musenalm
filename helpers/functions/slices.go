package functions

func Length(arr []any) int {
	return len(arr)
}

func MapLen[T comparable, U any](m map[T]U) int {
	return len(m)
}

func Contains(arr []string, val string) bool {
	for _, v := range arr {
		if v == val {
			return true
		}
	}
	return false
}
