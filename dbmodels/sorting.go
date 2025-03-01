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
