package seed

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromAkteure(app core.App, akteure xmlmodels.Akteure) ([]*dbmodels.Agent, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	records := make([]*dbmodels.Agent, 0, len(akteure.Akteure))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(akteure.Akteure); i++ {
		record := dbmodels.NewAgent(core.NewRecord(collection))
		akteur := akteure.Akteure[i]
		record.SetCorporateBody(akteur.Körperschaft)
		record.SetName(NormalizeString(akteur.Name))
		record.SetReferences(NormalizeString(akteur.Nachweis))
		record.SetBiographicalData(NormalizeString(akteur.Lebensdaten))
		record.SetProfession(NormalizeString(akteur.Beruf))
		record.SetPseudonyms(NormalizeString(akteur.Pseudonyme))
		record.SetAnnotation(NormalizeString(akteur.Anmerkungen))
		record.SetMusenalmID(akteur.ID)

		n := akteur.Name
		if n == "" {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return records, nil
}
