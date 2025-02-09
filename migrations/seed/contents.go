package seed

import (
	"fmt"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromInhalte(app core.App, inhalte xmlmodels.Inhalte) ([]*core.Record, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	records := make([]*core.Record, 0, len(inhalte.Inhalte))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(inhalte.Inhalte); i++ {
		record := core.NewRecord(collection)
		inhalt := inhalte.Inhalte[i]
		band, err := app.FindFirstRecordByData(dbmodels.ENTRIES_TABLE, dbmodels.MUSENALMID_FIELD, inhalt.Band)
		if err != nil {
			app.Logger().Error("Error finding band record for inhalt", "error", err, "inhalt", inhalt)
			continue
		}
		record.Set(dbmodels.ENTRIES_TABLE, band.Id)
		record.Set(dbmodels.ANNOTATION_FIELD, NormalizeString(inhalt.Anmerkungen))
		record.Set(dbmodels.MUSENALMID_FIELD, inhalt.ID)
		record.Set(dbmodels.RESPONSIBILITY_STMT_FIELD, NormalizeString(inhalt.Urheberangabe))
		record.Set(dbmodels.MUSENALM_INHALTE_TYPE_FIELD, inhalt.Typ.Value)
		record.Set(dbmodels.EXTENT_FIELD, NormalizeString(inhalt.Seite))
		record.Set(dbmodels.TITLE_STMT_FIELD, NormalizeString(inhalt.Titelangabe))
		record.Set(dbmodels.INCIPIT_STMT_FIELD, NormalizeString(inhalt.Incipit))

		counting, ok := dbmodels.MUSENALM_PAGINATION_VALUES[inhalt.Paginierung]
		if ok {
			record.Set(dbmodels.MUSENALM_PAGINATION_FIELD, counting)
		}
		record.Set(dbmodels.NUMBERING_FIELD, NormalizeString(inhalt.Objektnummer))

		handlePreferredTitle(inhalt, record)
		n := record.GetString(dbmodels.PREFERRED_TITLE_FIELD)
		if n == "" || n == "No Title" {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}
	return records, nil
}

func handlePreferredTitle(inhalt xmlmodels.Inhalt, record *core.Record) {
	if inhalt.Titelangabe != "" {
		record.Set(dbmodels.PREFERRED_TITLE_FIELD, NormalizeString(inhalt.Titelangabe))
		return
	}

	if inhalt.Incipit != "" {
		record.Set(dbmodels.PREFERRED_TITLE_FIELD, NormalizeString(inhalt.Incipit)+"…")
		return
	}

	if len(inhalt.Typ.Value) > 0 {
		str := commatizeArray(inhalt.Typ.Value)
		if str != "" {
			if inhalt.Urheberangabe != "" &&
				!strings.Contains(inhalt.Urheberangabe, "unbezeichnet") &&
				!strings.Contains(inhalt.Urheberangabe, "unbekannt") &&
				!strings.Contains(inhalt.Urheberangabe, "unleserlich") {
				urhh := NormalizeString(inhalt.Urheberangabe)
				urhh = strings.ReplaceAll(urhh, "#", "")
				urhh = NormalizeString(urhh)
				str += " (" + urhh + ")"
			}
			record.Set(dbmodels.PREFERRED_TITLE_FIELD, "["+str+"]")
			return
		}
	}

	record.Set(dbmodels.PREFERRED_TITLE_FIELD, "[Kein Titel]")
}

func commatizeArray(array []string) string {
	if len(array) == 0 {
		return ""
	}

	res := array[0]

	for i := 1; i < len(array)-1; i++ {
		res += ", " + array[i]
	}
	return array[0]
}
