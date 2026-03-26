package seed

import (
	"regexp"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
)

type pseudonymImportData struct {
	responsibility string
	annotation     string
	pseudonym      bool
}

var (
	trailingPseudonymMarkerRegexp      = regexp.MustCompile(`\s*#\s*$`)
	entryPseudonymAnnotationRegexp     = regexp.MustCompile(`^\s*#\s*Pseud\.?\s*(?:/\))?\s*`)
	contentPseudonymBlockRegexp        = regexp.MustCompile(`^\s*#\s*Pseud\.?\s*/\)\s*`)
	contentPseudonymAnnotationRegexp   = regexp.MustCompile(`^\s*#\s*Pseud\.?(?:\s|$)`)
	contentPseudonymAnnotationOnlyExpr = regexp.MustCompile(`^\s*#\s*Pseud\.?\s*$`)
	leadingHashWhitespaceRegexp        = regexp.MustCompile(`^\s*#\s*`)
)

func extractEntryPseudonymImportData(rawResponsibility, rawAnnotation string) pseudonymImportData {
	ret := pseudonymImportData{
		responsibility: rawResponsibility,
		annotation:     datatypes.DeleteTags(rawAnnotation),
	}

	if trailingPseudonymMarkerRegexp.MatchString(ret.responsibility) {
		ret.responsibility = trailingPseudonymMarkerRegexp.ReplaceAllString(ret.responsibility, "")
		ret.pseudonym = true
	}

	if entryPseudonymAnnotationRegexp.MatchString(ret.annotation) {
		ret.annotation = entryPseudonymAnnotationRegexp.ReplaceAllString(ret.annotation, "")
		ret.pseudonym = true
	}

	return ret
}

func extractContentPseudonymImportData(rawResponsibility, rawAnnotation string) pseudonymImportData {
	ret := pseudonymImportData{
		responsibility: rawResponsibility,
		annotation:     rawAnnotation,
	}

	if trailingPseudonymMarkerRegexp.MatchString(ret.responsibility) {
		ret.responsibility = trailingPseudonymMarkerRegexp.ReplaceAllString(ret.responsibility, "")
		ret.pseudonym = true
	}

	switch {
	case contentPseudonymBlockRegexp.MatchString(ret.annotation):
		ret.annotation = contentPseudonymBlockRegexp.ReplaceAllString(ret.annotation, "")
		ret.pseudonym = true
	case contentPseudonymAnnotationOnlyExpr.MatchString(ret.annotation):
		ret.annotation = ""
		ret.pseudonym = true
	case contentPseudonymAnnotationRegexp.MatchString(ret.annotation):
		ret.annotation = leadingHashWhitespaceRegexp.ReplaceAllString(ret.annotation, "")
		ret.pseudonym = true
	}

	return ret
}
