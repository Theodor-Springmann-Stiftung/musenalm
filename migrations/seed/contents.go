package seed

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const NO_TITLE = "[No Title]"

func RecordsFromInhalte(app core.App, inhalte xmlmodels.Inhalte) ([]*dbmodels.Content, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.CONTENTS_TABLE)
	records := make([]*dbmodels.Content, 0, len(inhalte.Inhalte))
	if err != nil {
		fmt.Println(err)
		return records, err
	}

	images := getImages(xmlmodels.IMG_PATH)

	for i := 0; i < len(inhalte.Inhalte); i++ {
		record := dbmodels.NewContent(core.NewRecord(collection))
		inhalt := inhalte.Inhalte[i]
		band, err := app.FindFirstRecordByData(dbmodels.ENTRIES_TABLE, dbmodels.MUSENALMID_FIELD, inhalt.Band)
		if err != nil {
			app.Logger().Error("Error finding band record for inhalt", "error", err, "inhalt", inhalt)
			continue
		}

		record.SetEntry(band.Id)
		record.SetAnnotation(NormalizeString(inhalt.Anmerkungen))
		record.SetMusenalmID(inhalt.ID)
		record.SetResponsibilityStmt(NormalizeString(inhalt.Urheberangabe))
		record.SetMusenalmType(inhalt.Typ.Value)
		record.SetExtent(NormalizeString(inhalt.Seite))
		record.SetTitleStmt(NormalizeString(inhalt.Titelangabe))
		record.SetIncipitStmt(NormalizeString(inhalt.Incipit))

		counting, ok := dbmodels.MUSENALM_PAGINATION_VALUES[inhalt.Paginierung]
		if ok {
			record.SetMusenalmPagination(counting)
		}

		no, err := strconv.ParseFloat(NormalizeString(inhalt.Objektnummer), 64)
		if err != nil {
			app.Logger().Error("Error parsing object number", "error", err, "object number", inhalt.Objektnummer)
		}
		record.SetNumbering(no)

		images, ok := images[inhalt.ID]
		if ok {
			files := []*filesystem.File{}
			for _, image := range images {
				file, err := filesystem.NewFileFromPath(image)
				if err != nil {
					app.Logger().Error("Error creating file from path", "error", err, "path", image)
					continue
				}
				files = append(files, file)
			}

			record.SetScans(files)
		}

		handlePreferredTitle(inhalt, record)
		n := record.PreferredTitle()
		if n == "" || n == NO_TITLE {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[1])
		} else {
			record.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-1])
		}

		records = append(records, record)
	}
	return records, nil
}

func handlePreferredTitle(inhalt xmlmodels.Inhalt, record *dbmodels.Content) {
	if inhalt.Titelangabe != "" {
		record.SetPreferredTitle(NormalizeString(inhalt.Titelangabe))
		return
	}

	if inhalt.Incipit != "" {
		record.SetPreferredTitle(NormalizeString(inhalt.Incipit) + "…")
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
			record.SetPreferredTitle("[" + str + "]")
			return
		}
	}

	record.SetPreferredTitle(NO_TITLE)
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

func getImages(path string) map[string][]string {
	/// BUG: there is a bug somewhere, where files ending with numbers after a comma (",001") etc dont get added
	ret := make(map[string][]string)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ret
	}

	e := func(path string, fileInfo os.FileInfo, inpErr error) (err error) {
		if !fileInfo.IsDir() {
			basesplit := strings.Split(fileInfo.Name(), "-")
			if len(basesplit) == 3 {
				extensionsplit := strings.Split(basesplit[2], ".")
				if len(extensionsplit) == 2 {
					// BUG: prob here
					commaseperatorsplit := strings.Split(extensionsplit[0], ",")
					id := commaseperatorsplit[1]
					if _, ok := ret[id]; !ok {
						ret[id] = make([]string, 0)
					}
					ret[id] = append(ret[id], path)
				}
			}
		}
		return nil
	}

	if err := filepath.Walk(path, e); err != nil {
		log.Fatal(err)
	}

	return ret
}
