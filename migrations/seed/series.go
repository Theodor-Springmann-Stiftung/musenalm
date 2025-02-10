package seed

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromReihentitel(app core.App, reihen xmlmodels.Reihentitel) ([]*dbmodels.Series, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
	records := make([]*dbmodels.Series, 0, len(reihen.Reihen))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(reihen.Reihen); i++ {
		record := dbmodels.NewSeries(core.NewRecord(collection))
		reihe := reihen.Reihen[i]
		if reihe.Titel == "" {
			record.SetTitle(NormalizeString(reihe.Sortiername))
		} else {
			record.SetTitle(NormalizeString(reihe.Titel))
		}

		record.SetReferences(NormalizeString(reihe.Nachweis))
		record.SetAnnotation(NormalizeString(reihe.Anmerkungen))
		record.SetFrequency("jährlich")
		record.SetMusenalmID(reihe.ID)

		n := record.Title()
		if n == "" {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return records, nil
}
