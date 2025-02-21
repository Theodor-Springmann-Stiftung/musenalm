package migrations_kontakt

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

const START = `<p>Martin Sietzen und Dr. Jakob Br&uuml;ssermann<br>Theodor-Springmann-Stiftung<br>Hirschgasse 2 <br><br>69120 Heidelberg<br><a href="mailto:info@musenalm.de">info@musenalm.de</a></p>`

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_KONTAKT_NAME))
		if err != nil {
			app.Logger().Error("Could not find Table Reihen! You need to execute table migrations first!")
			return err
		}

		record := pagemodels.NewTextPage(core.NewRecord(collection))
		record.SetTitle("Kontakt")
		record.SetText(START)

		if err := app.Save(record); err != nil {
			app.Logger().Error("Failed to save record", "error", err, "record", record)
			return err
		}

		return nil
	}, func(app core.App) error {
		coll, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_KONTAKT_NAME))

		if err == nil && coll != nil {
			app.DB().NewQuery("DELETE FROM " + coll.TableName()).Execute()
		}
		return nil
	})
}
