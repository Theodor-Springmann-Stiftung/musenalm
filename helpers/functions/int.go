package functions

import "strconv"

func Add(a, b any) int {
	val1, ok1 := a.(int)
	val2, ok2 := b.(int)
	if !ok1 || !ok2 {
		return 0
	}

	return val1 + val2
}

func GermanInt(value int) string {
	sign := ""
	if value < 0 {
		sign = "-"
		value = -value
	}

	raw := strconv.Itoa(value)
	if len(raw) <= 3 {
		return sign + raw
	}

	out := make([]byte, 0, len(raw)+(len(raw)-1)/3)
	firstGroup := len(raw) % 3
	if firstGroup == 0 {
		firstGroup = 3
	}

	out = append(out, raw[:firstGroup]...)
	for i := firstGroup; i < len(raw); i += 3 {
		out = append(out, '.')
		out = append(out, raw[i:i+3]...)
	}

	return sign + string(out)
}
