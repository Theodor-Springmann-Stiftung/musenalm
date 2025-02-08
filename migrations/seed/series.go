package seed

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func SeedTableSeries(app core.App, reihen xmlmodels.Reihentitel) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.SERIES_TABLE)
	records := make([]*core.Record, 0, len(reihen.Reihen))
	if err != nil {
		fmt.Println(err)
	}

	for i := 0; i < len(reihen.Reihen); i++ {
		record := core.NewRecord(collection)
		reihe := reihen.Reihen[i]
		if reihe.Titel == "" {
			record.Set(dbmodels.SERIES_NAME_FIELD, reihe.Sortiername)
		} else {
			record.Set(dbmodels.SERIES_NAME_FIELD, reihe.Titel)
		}

		record.Set(dbmodels.REFERENCES_FIELD, NormalizeString(reihe.Nachweis))
		record.Set(dbmodels.ANNOTATION_FIELD, NormalizeString(reihe.Anmerkungen))
		record.Set(dbmodels.SERIES_FREQUENCY_FIELD, "jährlich")
		record.Set(dbmodels.MUSENALMID_FIELD, reihe.ID)

		n := record.GetString(dbmodels.SERIES_NAME_FIELD)
		if n == "" {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return batchSave(app, records)
}
