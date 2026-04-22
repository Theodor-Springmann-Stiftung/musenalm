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
	trailingPseudonymMarkerRegexp  = regexp.MustCompile(`\s*#\s*$`)
	entryPseudonymAnnotationRegexp = regexp.MustCompile(`^\s*#\s*Pseud\.?\s*(?:/\))?\s*`)
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
	return extractEntryPseudonymImportData(rawResponsibility, rawAnnotation)
}
