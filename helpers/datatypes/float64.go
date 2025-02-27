package datatypes

import "math"

const float64EqualityThreshold = 1e-9

func CompareFloat(a, b float64) int {
	if math.Abs(a-b) < float64EqualityThreshold {
		return 0
	}
	if a < b {
		return -1
	}
	return 1
}
