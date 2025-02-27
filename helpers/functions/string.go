package functions

import (
	"fmt"
	"html/template"
	"regexp"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

var linksexp = regexp.MustCompile(`INr\s*([0-9]+)(?:\s*[-,;]\s*[0-9]*)*\s*(?:,|;)?\s*(?:obj|Obj)?\s*[0-9]*(?:\s*[-,;]\s*[0-9]*)*`)

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

func LinksAnnotation(s string) string {
	annotation := linksexp.ReplaceAllStringFunc(s, func(match string) string {
		submatches := linksexp.FindStringSubmatch(match)
		if len(submatches) > 1 {
			return fmt.Sprintf(`<a href="#%s" class="link-default oldstyle-nums">%s</a>`, submatches[1], match)
		}
		return match
	})

	return annotation
}
