package functions

import (
	"html/template"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
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

func ReplaceSlashParenSlash(s string) string {
	return strings.ReplaceAll(s, "/)", "/")
}

func Lower(s string) string {
	return cases.Lower(language.German).String(s)
}

func Upper(s string) string {
	return cases.Upper(language.German).String(s)
}

func First(s string) string {
	r := []rune(s)
	if len(r) == 0 {
		return ""
	}

	return string(r[0])
}
