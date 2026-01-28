package dbmodels

import (
	"slices"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

// INFO: Functions that implement sorting of which sqlite is not capable of.

func Sort_Series_Title(series []*Series) {
	collator := collate.New(language.German)
	slices.SortFunc(series, func(i, j *Series) int {
		return collator.CompareString(i.Title(), j.Title())
	})
}

func Sort_Agents_Name(agents []*Agent) {
	collator := collate.New(language.German)
	slices.SortFunc(agents, func(i, j *Agent) int {
		return collator.CompareString(i.Name(), j.Name())
	})
}

func Sort_Users_Name(users []*User) {
	collator := collate.New(language.German)
	slices.SortFunc(users, func(i, j *User) int {
		return collator.CompareString(i.Name(), j.Name())
	})
}

func Sort_Entries_Title_Year(entries []*Entry) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(i, j *Entry) int {
		if i.PreferredTitle() == j.PreferredTitle() {
			return i.Year() - j.Year()
		}
		return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
	})
}

func Sort_Entries_Year_Title(entries []*Entry) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(i, j *Entry) int {
		if i.Year() == j.Year() {
			return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
		}
		return i.Year() - j.Year()
	})
}

func Sort_REntriesSeries_Year(entries []*REntriesSeries, entriesMap map[string]*Entry) {
	slices.SortFunc(entries, func(i, j *REntriesSeries) int {
		ientry := entriesMap[i.Entry()]
		jentry := entriesMap[j.Entry()]
		return ientry.Year() - jentry.Year()
	})
}

func Sort_Contents_Numbering(contents []*Content) {
	slices.SortFunc(contents, func(i, j *Content) int {
		return datatypes.CompareFloat(i.Numbering(), j.Numbering())
	})
}

func Sort_Places_Name(places []*Place) {
	collator := collate.New(language.German)
	slices.SortFunc(places, func(i, j *Place) int {
		return collator.CompareString(i.Name(), j.Name())
	})
}

// Sort_Entries_MusenalmID sorts entries by MusenalmID (Alm number) in ascending order
func Sort_Entries_MusenalmID(entries []*Entry) {
	slices.SortFunc(entries, func(i, j *Entry) int {
		return i.MusenalmID() - j.MusenalmID()
	})
}

// Sort_Entries_Signatur sorts entries by their lowest signature (identifier) alphabetically
// Entries with no items sort last, entries with items but empty identifiers also sort last
func Sort_Entries_Signatur(entries []*Entry, itemsMap map[string][]*Item) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(i, j *Entry) int {
		iItems := itemsMap[i.Id]
		jItems := itemsMap[j.Id]

		// Find lowest signature for entry i
		var iLowestSig string
		for _, item := range iItems {
			sig := item.Identifier()
			if sig != "" && (iLowestSig == "" || collator.CompareString(sig, iLowestSig) < 0) {
				iLowestSig = sig
			}
		}

		// Find lowest signature for entry j
		var jLowestSig string
		for _, item := range jItems {
			sig := item.Identifier()
			if sig != "" && (jLowestSig == "" || collator.CompareString(sig, jLowestSig) < 0) {
				jLowestSig = sig
			}
		}

		// Entries without signatures sort last
		if iLowestSig == "" && jLowestSig == "" {
			return 0
		}
		if iLowestSig == "" {
			return 1 // i goes after j
		}
		if jLowestSig == "" {
			return -1 // i goes before j
		}

		// Compare using German collation for natural sorting
		return collator.CompareString(iLowestSig, jLowestSig)
	})
}

// Sort_Entries_Responsibility_Title sorts entries by responsibility statement, then preferred title.
// Empty responsibility statements sort last.
func Sort_Entries_Responsibility_Title(entries []*Entry) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(i, j *Entry) int {
		iResp := i.ResponsibilityStmt()
		jResp := j.ResponsibilityStmt()

		if iResp == "" && jResp == "" {
			return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
		}
		if iResp == "" {
			return 1
		}
		if jResp == "" {
			return -1
		}
		if iResp == jResp {
			return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
		}
		return collator.CompareString(iResp, jResp)
	})
}

// Sort_Entries_Place_Title sorts entries by place statement, then preferred title.
// Empty place statements sort last.
func Sort_Entries_Place_Title(entries []*Entry) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(i, j *Entry) int {
		iPlace := i.PlaceStmt()
		jPlace := j.PlaceStmt()

		if iPlace == "" && jPlace == "" {
			return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
		}
		if iPlace == "" {
			return 1
		}
		if jPlace == "" {
			return -1
		}
		if iPlace == jPlace {
			return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
		}
		return collator.CompareString(iPlace, jPlace)
	})
}

// Sort_Entries_Updated sorts entries by updated timestamp, then preferred title.
func Sort_Entries_Updated(entries []*Entry) {
	collator := collate.New(language.German)
	slices.SortFunc(entries, func(i, j *Entry) int {
		iUpdated := i.Updated().Time()
		jUpdated := j.Updated().Time()
		if iUpdated.Equal(jUpdated) {
			return collator.CompareString(i.PreferredTitle(), j.PreferredTitle())
		}
		if iUpdated.Before(jUpdated) {
			return -1
		}
		return 1
	})
}
