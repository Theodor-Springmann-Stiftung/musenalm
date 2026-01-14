package functions

import (
	"strings"

	"golang.org/x/text/language"
	"golang.org/x/text/language/display"
)

var languageAliases = map[string]string{
	"ger": "de",
	"deu": "de",
	"fre": "fr",
	"fra": "fr",
	"eng": "en",
	"ita": "it",
	"lat": "la",
	"dut": "nl",
	"nld": "nl",
	"spa": "es",
	"por": "pt",
	"rus": "ru",
	"pol": "pl",
	"cze": "cs",
	"ces": "cs",
	"slo": "sk",
	"slk": "sk",
	"gre": "el",
	"ell": "el",
	"arm": "hy",
	"hye": "hy",
	"baq": "eu",
	"eus": "eu",
	"ice": "is",
	"isl": "is",
	"rum": "ro",
	"ron": "ro",
	"chi": "zh",
	"zho": "zh",
	"jpn": "ja",
	"kor": "ko",
	"tur": "tr",
	"ara": "ar",
	"heb": "he",
	"ukr": "uk",
	"swe": "sv",
	"dan": "da",
	"nor": "no",
	"fin": "fi",
	"hun": "hu",
	"lit": "lt",
	"lav": "lv",
	"est": "et",
	"cat": "ca",
	"gle": "ga",
	"glg": "gl",
	"bul": "bg",
	"hrv": "hr",
	"srp": "sr",
	"slv": "sl",
	"mkd": "mk",
	"mac": "mk",
	"bel": "be",
	"bos": "bs",
	"ind": "id",
	"msa": "ms",
	"may": "ms",
	"tha": "th",
	"vie": "vi",
	"hin": "hi",
	"tam": "ta",
	"tel": "te",
	"urd": "ur",
	"fas": "fa",
	"per": "fa",
	"mar": "mr",
	"nno": "nn",
	"nob": "nb",
}

func LanguageNameGerman(code string) string {
	normalized := strings.TrimSpace(strings.ToLower(code))
	if normalized == "" {
		return ""
	}

	if alias, ok := languageAliases[normalized]; ok {
		normalized = alias
	}

	tag, err := language.Parse(normalized)
	if err != nil || tag == language.Und {
		return code
	}

	name := display.German.Languages().Name(tag)
	if name == "" {
		return code
	}

	return name
}
