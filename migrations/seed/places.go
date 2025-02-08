package seed

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromOrte(app core.App, orte xmlmodels.Orte) ([]*core.Record, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	records := make([]*core.Record, 0, len(orte.Orte))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(orte.Orte); i++ {
		ort := orte.Orte[i]
		record := core.NewRecord(collection)
		record.Set(dbmodels.PLACES_NAME_FIELD, NormalizeString(ort.Name))
		record.Set(dbmodels.ANNOTATION_FIELD, NormalizeString(ort.Anmerkungen))
		record.Set(dbmodels.PLACES_FICTIONAL_FIELD, ort.Fiktiv)
		record.Set(dbmodels.MUSENALMID_FIELD, ort.ID)

		n := ort.Name
		if n == "" {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return records, nil
}
