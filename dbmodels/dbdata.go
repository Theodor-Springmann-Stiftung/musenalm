package dbmodels

import "github.com/pocketbase/pocketbase/tools/types"

var EDITORSTATE_VALUES = []string{"Unknown", "ToDo", "Seen", "Partially Edited", "Waiting", "Review", "Edited"}

var ITEM_TYPE_VALUES = []string{
	"Original",
	"Reproduktion",
	"Mikrofiche",
	"Digitalisat",
	"URL",
}

var MEDIA_TYPE_VALUES = []string{
	"audio",
	"Mikroform",
	"Computermedien",
	"mikroskopisch",
	"projizierbar",
	"stereografisch",
	"ohne Hilfsmittel",
	"video",
}

var CARRIER_TYPE_VALUES = []string{
	"Tonträger",
	"Audiocartridge",
	"Phonographenzylinder",
	"Audiodisk",
	"Tonspurspule",
	"Notenrolle",
	"Audiokassette",
	"Tonbandspule",
	"Datenträger",
	"Speicherkarte",
	"Computerchip-Cartridge",
	"Computerdisk",
	"Computerdisk-Cartridge",
	"Magnetbandcartridge",
	"Magnetbandkassette",
	"Magnetbandspule",
	"Online-Ressource",
	"Datenträger für Mikroformen",
	"Mikrofilmlochkarte",
	"Mikrofiche",
	"Mikrofichekassette",
	"Mikrofilm-Cartridge",
	"Mikrofilmkassette",
	"Mikrofilmspule",
	"Mikrofilmstreifen",
	"Lichtundurchlässiger Mikrofiche",
	"Trägermedien für Mikroskop-Anwendungen",
	"Objektträger",
	"Datenträger von projizierbaren Bildern",
	"Filmdose",
	"Filmkassette",
	"Filmspule",
	"Filmstreifen",
	"Filmstreifen für Einzelbildvorführung",
	"Filmstreifen-Cartridge",
	"Overheadfolie",
	"Dia",
	"Stereografische Datenträger",
	"Stereobild",
	"Stereografische Disk",
	"Datenträger, die ohne Hilfsmittel zu benutzen sind",
	"Karte",
	"Flipchart",
	"Rolle",
	"Blatt",
	"Band",
	"Video-Datenträger",
	"Videocartridge",
	"Videokassette",
	"Videobandspule",
	"Mikrofilmrolle",
	"Gegenstand",
	"Videodisk",
	"Filmrolle",
	"Audio Belt",
	"Audio wire reel",
}
var LANGUAGE_VALUES = []string{
	"abk",
	"aar",
	"afr",
	"aka",
	"alb",
	"amh",
	"ara",
	"arg",
	"arm",
	"asm",
	"ava",
	"ave",
	"aym",
	"aze",
	"bam",
	"bak",
	"baq",
	"bel",
	"ben",
	"bis",
	"bos",
	"bre",
	"bul",
	"bur",
	"cat",
	"cha",
	"che",
	"nya",
	"chi",
	"chu",
	"chv",
	"cor",
	"cos",
	"cre",
	"hrv",
	"cze",
	"dan",
	"div",
	"dut",
	"dzo",
	"eng",
	"epo",
	"est",
	"ewe",
	"fao",
	"fij",
	"fin",
	"fre",
	"fry",
	"ful",
	"gla",
	"glg",
	"lug",
	"geo",
	"ger",
	"gre",
	"kal",
	"grn",
	"guj",
	"hat",
	"hau",
	"heb",
	"her",
	"hin",
	"hmo",
	"hun",
	"ice",
	"ido",
	"ibo",
	"ind",
	"ina",
	"ile",
	"iku",
	"ipk",
	"gle",
	"ita",
	"jpn",
	"jav",
	"kan",
	"kau",
	"kas",
	"kaz",
	"khm",
	"kik",
	"kin",
	"kir",
	"kom",
	"kon",
	"kor",
	"kua",
	"kur",
	"lao",
	"lat",
	"lav",
	"lim",
	"lin",
	"lit",
	"lub",
	"ltz",
	"mac",
	"mlg",
	"may",
	"mal",
	"mlt",
	"glv",
	"mao",
	"mar",
	"mah",
	"mon",
	"nau",
	"nav",
	"nde",
	"nbl",
	"ndo",
	"nep",
	"nor",
	"nob",
	"nno",
	"oci",
	"oji",
	"ori",
	"orm",
	"oss",
	"pli",
	"pus",
	"per",
	"pol",
	"por",
	"pan",
	"que",
	"rum",
	"roh",
	"run",
	"rus",
	"sme",
	"smo",
	"sag",
	"san",
	"srd",
	"srp",
	"sna",
	"snd",
	"sin",
	"slo",
	"slv",
	"som",
	"sot",
	"spa",
	"sun",
	"swa",
	"ssw",
	"swe",
	"tgl",
	"tah",
	"tgk",
	"tam",
	"tat",
	"tel",
	"tha",
	"tib",
	"tir",
	"ton",
	"tso",
	"tsn",
	"tur",
	"tuk",
	"twi",
	"uig",
	"ukr",
	"urd",
	"uzb",
	"ven",
	"vie",
	"vol",
	"wln",
	"wel",
	"wol",
	"xho",
	"iii",
	"yid",
	"yor",
	"zha",
	"zul",
}

var CONTENT_TYPE_VALUES = []string{
	"kartografisches Daten-Set",
	"kartografisches Bild",
	"kartografisches Bewegtbild",
	"kartografisches taktiles Bild",
	"kartografische taktile dreidimensionale Form",
	"kartografische dreidimensionale Form",
	"Computerdaten",
	"Computerprogramm",
	"Bewegungsnotation",
	"Noten",
	"aufgeführte Musik",
	"Geräusche",
	"gesprochenes Wort",
	"unbewegtes Bild",
	"taktiles Bild",
	"taktile Noten",
	"taktile Bewegungsnotation",
	"taktiler Text",
	"taktile dreidimensionale Form",
	"Text",
	"dreidimensionale Form",
	"dreidimensionales Bewegtbild",
	"zweidimensionales Bewegtbild",
	"aufgeführte Bewegung",
}

var MUSENALM_STATUS_VALUES = []string{
	"Original vorhanden",
	"Reprint vorhanden",
	"Fremde Herkunft",
}

var MUSENALM_TYPE_VALUES = []string{
	"Corrigenda",
	"Diagramm",
	"Gedicht/Lied",
	"Graphik",
	"Graphik-Verzeichnis",
	"graph. Anleitung",
	"graph. Strickanleitung",
	"graph. Tanzanleitung",
	"Inhaltsverzeichnis",
	"Kalendarium",
	"Karte",
	"Musikbeigabe",
	"Musikbeigaben-Verzeichnis",
	"Motto",
	"Prosa",
	"Rätsel",
	"Sammlung",
	"Spiegel",
	"szen. Darstellung",
	"Tabelle",
	"Tafel",
	"Titel",
	"Text",
	"Trinkspruch",
	"Umschlag",
	"Widmung",
}

var MUSENALM_PAGINATION_VALUES = map[string]string{
	"":      "",
	"röm":   "Römische Seitenzählung",
	"ar":    "Arabische Seitenzählung",
	"alph":  "Alphabetische Seitenzählung",
	"sonst": "Sonstige Seitenzählung",
	"ar1":   "1. Arabische Seitenzählung",
	"ar2":   "2. Arabische Seitenzählung",
	"ar3":   "3. Arabische Seitenzählung",
	"ar4":   "4. Arabische Seitenzählung",
	"ar5":   "5. Arabische Seitenzählung",
	"ar6":   "6. Arabische Seitenzählung",
	"ar7":   "7. Arabische Seitenzählung",
	"ar8":   "8. Arabische Seitenzählung",
	"röm1":  "1. Römische Seitenzählung",
	"röm2":  "2. Römische Seitenzählung",
	"röm3":  "3. Römische Seitenzählung",
	"röm4":  "4. Römische Seitenzählung",
	"röm5":  "5. Römische Seitenzählung",
	"röm6":  "6. Römische Seitenzählung",
	"röm7":  "7. Römische Seitenzählung",
	"röm8":  "8. Römische Seitenzählung",
}

var MUSENALM_MIME_TYPES = []string{
	"application/pdf",
	"image/png",
	"image/vnd.mozilla.apng",
	"image/jpeg",
	"image/jp2",
	"image/jpx",
	"image/jpm",
	"image/gif",
	"image/jxs",
	"image/jxl",
	"image/x-xpixmap",
	"image/vnd.adobe.photoshop",
	"image/webp",
	"image/tiff",
	"image/bmp",
	"image/x-icon",
	"image/vnd.djvu",
	"image/bpg",
	"image/vnd.dwg",
	"image/x-icns",
	"image/heic",
	"image/heic-sequence",
	"image/heif",
	"image/heif-sequence",
	"image/vnd.radiance",
	"image/x-xcf",
	"image/x-gimp-pat",
	"image/x-gimp-gbr",
	"image/avif",
	"image/jxr",
	"image/svg+xml",
}

var AGENT_RELATIONS = []string{
	"Schöpfer",
	"Autor:in",
	"Herausgeber:in",
	"Verlag",
	"Druck",
	"Vertrieb",
	"Stecher:in",
	"Zeichner:in",
	"Komponist:in",
	"Künstler:in",
	"Übersetzer:in",
	"Redakteur:in",
	"Kartograf:in",
	"Kupferstecher:in",
}

var SERIES_RELATIONS = []string{
	"Bevorzugter Reihentitel",
	"Alternativer Reihentitel",
	"Späterer Reihentitel",
	"Früherer Reihentitel",
	"In anderer Sprache",
}

var PUBLIC_VIEW_RULE = types.Pointer("")
var PUBLIC_LIST_RULE = types.Pointer("")

const (
	PLACES_TABLE   = "places"
	AGENTS_TABLE   = "agents"
	SERIES_TABLE   = "series"
	ENTRIES_TABLE  = "entries"
	CONTENTS_TABLE = "contents"
	ITEMS_TABLE    = "items"

	ANNOTATION_FIELD = "annotation"

	MUSENALMID_FIELD = "musenalm_id"
	EDITSTATE_FIELD  = "edit_state"
	COMMENT_FIELD    = "edit_comment"
	META_FIELD       = "edit_fielddata"

	AGENTS_NAME_FIELD              = "name"
	AGENTS_CORP_FIELD              = "corporate_body"
	AGENTS_FICTIONAL_FIELD         = "fictional"
	AGENTS_BIOGRAPHICAL_DATA_FIELD = "biographical_data"
	AGENTS_PROFESSION_FIELD        = "profession"
	AGENTS_PSEUDONYMS_FIELD        = "pseudonyms"

	PLACES_NAME_FIELD       = "name"
	PLACES_FICTIONAL_FIELD  = "fictional"
	PLACES_PSEUDONYMS_FIELD = "pseudonyms"

	SERIES_TITLE_FIELD      = "title"
	SERIES_PSEUDONYMS_FIELD = "pseudonyms"
	SERIES_FREQUENCY_FIELD  = "frequency"

	RELATION_TYPE_FIELD       = "type"
	RELATION_CONJECTURE_FIELD = "conjecture"
	RELATION_UNCERTAIN_FIELD  = "uncertain"

	PREFERRED_TITLE_FIELD = "preferred_title"
	VARIANT_TITLE_FIELD   = "variant_title"
	PARALLEL_TITLE_FIELD  = "parallel_title"

	TITLE_STMT_FIELD          = "title_statement"
	SUBTITLE_STMT_FIELD       = "subtitle_statement"
	INCIPIT_STMT_FIELD        = "incipit_statement"
	RESPONSIBILITY_STMT_FIELD = "responsibility_statement"
	PUBLICATION_STMT_FIELD    = "publication_statement"
	PLACE_STMT_FIELD          = "place_statement"

	EDITION_FIELD = "edition"
	YEAR_FIELD    = "year"

	LANGUAGE_FIELD     = "language"
	CONTENT_TYPE_FIELD = "content_type"

	EXTENT_FIELD       = "extent"
	DIMENSIONS_FIELD   = "dimensions"
	MEDIA_TYPE_FIELD   = "media_type"
	CARRIER_TYPE_FIELD = "carrier_type"

	REFERENCES_FIELD = "references"
	URI_FIELD        = "uri"

	MUSENALM_BAENDE_STATUS_FIELD = "musenalm_status"
	MUSENALM_INHALTE_TYPE_FIELD  = "musenalm_type"
	MUSENALM_DEPRECATED_FIELD    = "musenalm_deprecated"
	MUSENALM_PAGINATION_FIELD    = "musenalm_pagination"

	NUMBERING_FIELD = "numbering"
	SCAN_FIELD      = "scans"

	ITEMS_LOCATION_FIELD   = "location"
	ITEMS_OWNER_FIELD      = "owner"
	ITEMS_MEDIA_FIELD      = "media"
	ITEMS_CONDITION_FIELD  = "condition"
	ITEMS_IDENTIFIER_FIELD = "identifier"
)
