package migrations_reihen

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const START = "<p>Ziel der Musenalm ist die&nbsp;bibliographische Erfassung eines Jahrhunderts deutscher Almanache und Taschenb&uuml;cher;<strong>&nbsp;</strong>das Projekt ist im Aufbau und wird kontinuierlich weitergef&uuml;hrt.</p><p>Verzeichnet werden:</p><ul><li><strong>Reihen </strong>und<strong> B&auml;nde</strong> bekannter Almanache und einzelne Druckauflagen mit ausf&uuml;hrlichen bibliographischen Angaben und kurzer systematisierter&nbsp;<strong>Darstellung ihres strukturellen Aufbaus </strong>&nbsp;(Paginierung, Anordnung der Druckteile, Graphiken und Beilagen),<strong><br></strong></li><li><strong>Beitr&auml;ge literarisch oder musisch ausgerichteter Almanache&nbsp;</strong>einzeln, nach Autor, &Uuml;berschrift und Incipit,<strong> </strong>inklusive<strong> Digitalisate </strong>graphischer und musischer Beitr&auml;ge,</li><li>Beitr&auml;ge vorwiegend&nbsp;<strong>nicht literarischer Almanache</strong>&nbsp;in der Regel durch Wiedergabe des&nbsp;<strong>Inhaltsverzeichnisses.</strong></li></ul><p>Die Bibliographie ist zug&auml;nglich mit umfangreichen Suchfunktionen &uuml;ber:</p><ul><li><strong>Reihentitel der Almanache,</strong></li><li><strong>Abbildungen (Graphiken und Musikbeilagen),</strong></li><li>Personennamen von Herausgebern und Beitr&auml;gern einerseits &uuml;ber normierte<strong> Realnamen </strong>und andererseits &uuml;ber die im Druck erscheinenden Schreibweisen der Personen (auch Pseudonyme)<strong> </strong>als<strong> Autornamen,</strong></li><li><strong>Einzeltitel und Incipit </strong>(w&ouml;rtliche Textanf&auml;nge) von Beitr&auml;gen.</li></ul><p>Die Musenalm ist ein Projekt der Theodor Springmann Stiftung in Heidelberg.</p>"

const START_BILD = "./Static-Bilder/musen.png"

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_REIHEN_NAME))
		if err != nil {
			app.Logger().Error("Could not find Table Reihen! You need to execute table migrations first!")
			return err
		}

		record := pagemodels.NewReihen(core.NewRecord(collection))
		record.SetTitle("Musenalm")
		record.SetText(START)

		img, err := filesystem.NewFileFromPath(START_BILD)
		if err != nil {
			app.Logger().Error("Failed to read image file", "error", err, "path", START_BILD)
			return err
		}

		record.SetImage(img)

		if err := app.Save(record); err != nil {
			app.Logger().Error("Failed to save record", "error", err, "record", record)
			return err
		}

		return nil
	}, func(app core.App) error {
		coll, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_REIHEN_NAME))

		if err == nil && coll != nil {
			app.DB().NewQuery("DELETE FROM " + coll.TableName()).Execute()
		}
		return nil
	})
}
