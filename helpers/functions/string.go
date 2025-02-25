package functions

import (
	"html/template"
	"strings"
)

func Safe(s string) template.HTML {
	if len(s) == 0 {
		return ""
	}
	return template.HTML(s)
}

func ReplaceSlashParen(s string) string {
	return strings.ReplaceAll(s, "/)", "<p>")
}
