package seed

import (
	"fmt"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromAkteure(app core.App, akteure xmlmodels.Akteure) ([]*core.Record, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	records := make([]*core.Record, 0, len(akteure.Akteure))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(akteure.Akteure); i++ {
		record := core.NewRecord(collection)
		akteur := akteure.Akteure[i]
		record.Set(dbmodels.AGENTS_CORP_FIELD, akteur.Körperschaft)
		record.Set(dbmodels.AGENTS_NAME_FIELD, NormalizeString(akteur.Name))
		record.Set(dbmodels.REFERENCES_FIELD, NormalizeString(akteur.Nachweis))
		record.Set(dbmodels.AGENTS_BIOGRAPHICAL_DATA_FIELD, NormalizeString(akteur.Lebensdaten))
		record.Set(dbmodels.AGENTS_PROFESSION_FIELD, NormalizeString(akteur.Beruf))
		record.Set(dbmodels.AGENTS_PSEUDONYMS_FIELD, NormalizeString(akteur.Pseudonyme))
		record.Set(dbmodels.ANNOTATION_FIELD, NormalizeString(akteur.Anmerkungen))
		record.Set(dbmodels.MUSENALMID_FIELD, akteur.ID)

		n := akteur.Name
		if n == "" {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}

	return records, nil
}
