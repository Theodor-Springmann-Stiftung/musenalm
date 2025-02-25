package dbmodels

import (
	"slices"

	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

func Sort_Series_Title(series []*Series) {
	collator := collate.New(language.German)
	slices.SortFunc(series, func(i, j *Series) int {
		return collator.CompareString(i.Title(), j.Title())
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
