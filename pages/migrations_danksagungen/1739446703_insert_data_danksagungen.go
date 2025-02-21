package migrations_danksagungen

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

const TEXT = `<div>
<p>Der bibliographische Auftrieb auf die Musenalm bedarf der Unterst&uuml;tzung durch ihre Nutzer und insbesondere durch die Besitzer seltener und wenig bekannter, kaum auffindbarer Almanache und Taschenb&uuml;cher des gew&auml;hlten Zeitraumes von etwa 1750 bis 1870. Sie helfen uns durch Hinweise, Leihgaben auf kurze Frist, sowie durch Benennung von Fehlern und Unstimmigkeiten, die uns unterlaufen m&ouml;gen, sich aber auch aus Eigen- und Abarten untersuchter Exemplare herleiten k&ouml;nnen.</p>
<p>F&uuml;r viele geleistete Hilfen danken wir:</p>
<p>Frau <strong>Susanne Koppel</strong><br>Antiquariat Susanne Koppel<br>Parkallee 4<br>20144 Hamburg<br><a href="http://www.antiquariat-koppel.de" target="_blank" rel="noreferrer noopener">www.antiquariat-koppel.de</a><br><a href="mailto:info@antiquariat-koppel.de">info@antiquariat-koppel.de</a></p>
<p>Herrn <strong>Thomas Rezek</strong><br>Antiquariat Thomas Rezek<br>Amalienstra&szlig;e 63<br>80799 M&uuml;nchen<br><a href="http://www.a-rezek.de" target="_blank" rel="noreferrer noopener">www.a-rezek.de</a><br><a href="mailto:arezek@web.de">arezek@web.de</a></p>
<p>Herrn <strong>G&uuml;nther Trauzettel-Loibl</strong><br>Antiquariat Trauzettel<br>Haum&uuml;hle 8<br>52223 Stolberg<br><a href="http://www.antiquariat-trauzettel.de" target="_blank" rel="noreferrer noopener">www.antiquariat-trauzettel.de</a><br><a href="mailto:antiquariat.trauzettel@t-online.de">antiquariat.trauzettel@t-online.de</a></p>
<p>Herrn <strong>Uwe Turszynski</strong><br>Antiquariat Turszynski<br>Herzogstra&szlig;e 66<br>80803 M&uuml;nchen<br><a href="http://www.turszynski.de" target="_blank" rel="noreferrer noopener">www.turszynski.de</a><br><a href="mailto:antiquariat@turszynski.de">antiquariat@turszynski.de</a></p>
<p>Herrn <strong>Dieter Zipprich</strong><br>Antiquariat Zipprich<br>Karolinenstra&szlig;e 18<br>96049 Bamberg<br><a href="mailto:antiquariat.zipprich@freenet.de">antiquariat.zipprich@freenet.de</a></p>
<p>Frau Mag. <strong>Rita Robosch</strong><br>Matthaeus Truppe Buchhandlung &amp; Antiquariat<br>Stubenberggasse 7<br>A-8010 Graz<br>Austria<br><a href="mailto:truppe@aon.at">truppe@aon.at</a></p>
</div>`

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DANK_NAME))
		if err != nil {
			app.Logger().Error("Could not find Table Danksagungen! You need to execute table migrations first!")
			return err
		}

		record := pagemodels.NewTextPage(core.NewRecord(collection))
		record.SetTitle("Danksagungen")
		record.SetText(TEXT)

		if err := app.Save(record); err != nil {
			app.Logger().Error("Failed to save record", "error", err, "record", record)
			return err
		}

		return nil
	}, func(app core.App) error {
		coll, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DANK_NAME))

		if err == nil && coll != nil {
			app.DB().NewQuery("DELETE FROM " + coll.TableName()).Execute()
		}
		return nil
	})
}
