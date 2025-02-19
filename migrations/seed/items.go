package seed

import (
	"fmt"
	"regexp"
	"slices"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func ItemsFromBändeAndBIBLIO(
	app core.App,
	entries xmlmodels.Bände,
	biblio map[int]xmlmodels.BIBLIOEintrag,
	entriesmap map[int]*dbmodels.Entry,
) ([]*dbmodels.Item, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.ITEMS_TABLE)
	records := make([]*dbmodels.Item, 0, len(entries.Bände))
	r := regexp.MustCompile("\\d{6}")
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	for i := 0; i < len(entries.Bände); i++ {
		band := entries.Bände[i]
		banddb, ok := entriesmap[band.ID]
		if !ok {
			app.Logger().Error("Error finding entry", "error", err, "entry", band.ID)
			continue
		}

		nst := NormalizeString(band.Norm)
		matches := r.FindAllStringSubmatchIndex(nst, -1)
		t := map[string]string{}
		for i, m := range matches {
			nr := nst[m[0]:m[1]]
			end := len(nst)

			if m[1] >= len(nst) {
				t[nr] = ""
				continue
			}

			if len(matches)-1 > i {
				end = matches[i+1][0]
			}

			rest := nst[m[1]:end]
			var last []rune

			for y, c := range rest {
				if c == '\\' && y < len(rest)-1 && rest[y+1] == ')' {
					break
				}
				if c != '(' && c != ')' {
					last = append(last, c)
				}
			}

			if last != nil && len(last) > 0 {
				t[nr] = string(last)
			}
		}

		if band.BiblioID != 0 {
			exem := dbmodels.NewItem(core.NewRecord(collection))
			exem.SetIdentifier(strconv.Itoa(band.BiblioID))
			if e, ok := biblio[band.BiblioID]; ok {
				exem.SetLocation(strings.TrimSpace(e.Standort))
				exem.SetCondition(strings.TrimSpace(e.Zustand))
				message := ""
				message = appendMessage(e.NotizÄusseres, message)
				message = appendMessage(e.NotizInhalt, message)
				message = appendMessage(e.Anmerkungen, message)
				exem.SetAnnotation(message)
			}

			records = append(records, exem)
		}

		for nr, m := range t {
			exem := dbmodels.NewItem(core.NewRecord(collection))
			exem.SetIdentifier(nr)

			no, err := strconv.Atoi(strings.TrimSpace(nr))
			message := strings.TrimSpace(m)
			if err != nil {
				if e, ok := biblio[no]; ok {
					exem.SetLocation(strings.TrimSpace(e.Standort))
					exem.SetCondition(strings.TrimSpace(e.Zustand))
					message = appendMessage(e.NotizÄusseres, message)
					message = appendMessage(e.NotizInhalt, message)
					message = appendMessage(e.Anmerkungen, message)
				}
			}
			exem.SetAnnotation(message)

			if exem.Identifier() != "" {
				records = append(records, exem)
			}
		}

		if len(records) > 0 {
			for _, exem := range records {
				exem.SetEntry(banddb.Id)
				exem.SetOwner("Theodor Springmann Stiftung")

				if slices.Contains(band.Status.Value, "Original vorhanden") {
					exem.SetMedia([]string{dbmodels.ITEM_TYPE_VALUES[0]})
				}

				if slices.Contains(band.Status.Value, "Reprint vorhanden") {
					med := exem.Media()
					exem.SetMedia(append(med, dbmodels.ITEM_TYPE_VALUES[1]))
				}

				if exem.Location() == "" {
					exem.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
				} else {
					exem.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
				}
			}
		}
	}

	return records, nil
}

func appendMessage(message string, toAppend string) string {
	notiza := strings.TrimSpace(toAppend)
	if notiza != "" {
		if message != "" {
			message += "\n"
		}
		message += notiza
	}
	return message
}
