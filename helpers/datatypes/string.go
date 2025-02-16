package datatypes

import (
	"regexp"
	"strings"
)

var html_regexp = regexp.MustCompile(`<[^>]+>`)

func DeleteTags(s string) string {
	return html_regexp.ReplaceAllString(s, "")
}

func NormalizeString(s string) string {
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, "<div>", "")
	s = strings.ReplaceAll(s, "</div>", "")
	return s
}

func SliceJoin[T any](slice []T, join string, f func(T) string) string {
	var result []string
	for _, item := range slice {
		ap := f(item)
		if ap != "" {
			result = append(result, ap)
		}
	}
	return strings.Join(result, join)
}
