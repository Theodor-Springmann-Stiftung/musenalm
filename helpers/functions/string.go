package functions

import "html/template"

func Safe(s string) template.HTML {
	if len(s) == 0 {
		return ""
	}
	return template.HTML(s)
}
