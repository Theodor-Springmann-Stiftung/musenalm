package seed

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"golang.org/x/text/unicode/norm"
)

func NormalizeString(s string) string {
	s = datatypes.NormalizeString(s)
	s = norm.NFC.String(s)
	return s
}
