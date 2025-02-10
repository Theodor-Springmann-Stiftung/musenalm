package seed

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromOrte(app core.App, orte xmlmodels.Orte) ([]*dbmodels.Place, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.PLACES_TABLE)
	records := make([]*dbmodels.Place, 0, len(orte.Orte))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(orte.Orte); i++ {
		ort := orte.Orte[i]
		record := dbmodels.NewPlace(core.NewRecord(collection))
		record.SetName(NormalizeString(ort.Name))
		record.SetAnnotation(NormalizeString(ort.Anmerkungen))
		record.SetFictional(ort.Fiktiv)
		record.SetMusenalmID(ort.ID)

		n := ort.Name
		if n == "" {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return records, nil
}
