package functions

func Add(a, b any) int {
	val1, ok1 := a.(int)
	val2, ok2 := b.(int)
	if !ok1 || !ok2 {
		return 0
	}

	return val1 + val2
}
