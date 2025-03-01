package migrations_index

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

var text = `<h1>Texte zum Almanachwesen</h1>
<p><em>Joseph Franz von Ratschky:</em> Vorbericht. in: Wiener Musenalmanach. 1779, S. 3-6. [&darr;<a href="/assets/Lesekabinett/ratschky_in_wiener_1779.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Gottfried August B&uuml;rger:</em> Nothgedrungene Nachrede. in: G&ouml;ttinger Musenalmanach. 1782, S. 184-192. [&darr;<a href="/assets/Lesekabinett/buerger_in_goettinger_1782.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Christian Cay Lorenz Hirschfeld: </em>An die Leser. in: Gartenkalender. 1783, S. 272. [&darr;<a href="/assets/Lesekabinett/hirschfeld_in_gartenkalender_1783.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Johann Heinrich Vo&szlig;:</em> Ank&uuml;ndigung. in: Hamburger Musenalmanach. 1784, S. 222ff. [&darr;<a href="/assets/Lesekabinett/voss_in_hamburger_1784.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Gotthold Friedrich St&auml;udlin: </em>Nachrede. in: Schw&auml;bischer Musenalmanach. 1786 [o. S.]. [&darr;<a href="/assets/Lesekabinett/staeudlin_in_schwaebischer_1786.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Gottfried August B&uuml;rger:</em> F&uuml;rbitte eines ans peinliche Kreuz der Verlegenheit genagelten Herausgebers eines Musenalmanachs. in: G&ouml;ttinger Musenalmanach. 1789, S. 104. [&darr;<a href="/assets/Lesekabinett/buerger_in_goettinger_1789.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Anonymus: </em>Die deutschen Almanache. in: Bibliothek der redenden und bildenden K&uuml;nste. Zweyten Bandes erstes St&uuml;ck. Leipzig, in der Dyckischen Buchhandlung, 1806, S. 207-217. [&darr;<a href="/assets/Lesekabinett/anonymus.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Stephan Sch&uuml;tze:</em> Die Neujahrsversammlung. Ein dramatischer Prolog. in: Taschenbuch der Liebe und Freundschaft gewidmet. 1813, S. 1-20. [&darr;<a href="/assets/Lesekabinett/schuetze_in_taschenbuch_1813.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>N. B. E.: </em>Die deutschen Taschenb&uuml;cher f&uuml;r 1820. in: Hermes oder kritisches Jahrbuch der Literatur. Zweites St&uuml;ck f&uuml;r das Jahr 1820. Amsterdam, in der Verlags-Expedition des Hermes, S. 191-235. [&darr;<em><a href="/assets/Lesekabinett/nbe_in_hermes_1820.pdf" target="_blank" rel="noopener">Download</a>]</em></p>
<p><em>Ferdinand Johannes Wit:</em> Die Almanachomanie. in: Politisches Taschenbuch. 1831, S. 102-111. [&darr;<a href="/assets/Lesekabinett/wit_in_politaschenbuch_1831.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>August Wilhelm Schlegel:</em> Recept. in: Deutscher Musenalmanach (Chamisso, Schwab, Gaudy). 1836, S. 18. [&darr;<a href="/assets/Lesekabinett/schlegel_in_deutscher_1836.pdf" target="_blank" rel="noopener">Download</a>]</p>
<p><em>Robert Eduard Prutz:</em> Die Musenalmanache und Taschenb&uuml;cher in Deutschland. in: Neue Schriften. Zur deutschen Literatur- und Kulturgeschichte. Erster Band, Halle, G. Schwetschke'scher Verlag, 1854, S. 105-165. [&darr;<a href="/assets/Lesekabinett/prutz_in_musenalmanache_1854.pdf" target="_blank" rel="noopener">Download</a>]</p>
<h1>Allotria und Kuriosa</h1>
<p><em>Anonymus:</em> Woher das Wort Almanach komme. in: Neues Wochenblatt zum Nuzzen und zur Unterhaltung f&uuml;r Kinder und junge Leute. Erstes B&auml;ndchen, erstes St&uuml;ck, Leipzig, in der Sommerschen Buchhandlung 1794, S. 8f. [&darr;<a href="/assets/Lesekabinett/allatroia_anonymus_wochenblatt_1794.pdf" target="_blank" rel="noopener">Download</a>]</p>`

var texte_fields = core.NewFieldsList(
	pagemodels.EditorField(pagemodels.F_TEXT),
)

func init() {
	m.Register(func(app core.App) error {
		collection_t := texteCollection()
		if err := app.Save(collection_t); err != nil {
			return err
		}

		r := core.NewRecord(collection_t)
		page := pagemodels.NewTextPage(r)
		page.SetText(text)
		page.SetTitle("Lesekabinett")

		if err := app.Save(r); err != nil {
			return err
		}
		return nil

	}, func(app core.App) error {

		collection_t, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_KABINETT_NAME))
		if err == nil && collection_t != nil {
			if err := app.Delete(collection_t); err != nil {
				return err
			}
		}
		return nil
	})
}

func texteCollection() *core.Collection {
	c := pagemodels.BasePageCollection(pagemodels.P_KABINETT_NAME)
	c.Fields = append(c.Fields, texte_fields...)
	return c
}
