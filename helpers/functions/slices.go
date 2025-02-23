package functions

func Length(arr []any) int {
	return len(arr)
}

func Contains(arr []string, val string) bool {
	for _, v := range arr {
		if v == val {
			return true
		}
	}
	return false
}
