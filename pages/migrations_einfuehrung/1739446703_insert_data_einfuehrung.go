package migrations_einfuehrung

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

const START = `<h2 class="wp-block-heading">Vorbemerkung</h2>
<p>Dies ist eine Bibliographie der deutschen Almanache und Taschenb&uuml;cher, die neben der Erfassung der Reihen und ihrer Jahrg&auml;nge die Inhalte selbst erkennbar macht. In der Regel werden folgende Merkmale erfa&szlig;t und sind in verschiedenen Suchabfragen und Listen abrufbar:</p>
<ul>
<li>Reihen- und Einzeltitel des Druckwerks sowie Strukturdarstellung des autopsierten Einzelbandes.</li>
<li>Namen der Herausgeber und Verfasser, gegebenfalls zus&auml;tzlich Schreibvarianten oder Pseudonyme.</li>
<li>Literarische Beitr&auml;ge mit Titel und Incipit.</li>
<li>Nichtliterarische Beitr&auml;ge (Illustrationen, Musikbeilagen und andere Zutaten) werden als Vollbild gegeben.</li>
</ul>
<p>Erfa&szlig;t werden in erster Linie die literarischen Taschenb&uuml;cher, die von 1770 bis etwa 1870 erschienen sind. Angesichts der raschen modischen Entwicklung des Almanachwesens, das sich schnell auf viele und auch entlegene Themengebiete ausdehnte, ist eine klare Abgrenzung der literarischen zu anders ausgerichteten Erscheinungen schwierig und wird von uns nicht angestrebt. Vielmehr sind wir bem&uuml;ht, das ganze Spektrum des Almanachwesens sichtbar zu machen, und wir nehmen ebenfalls, wenn auch zun&auml;chst nur ausgew&auml;hlt und nicht vollz&auml;hlig, unliterarische Taschenbuchreihen auf, die wir zumeist allerdings nicht in inhaltlicher Aufgliederung, sondern nur unter dem Titel bibliographieren, unter Beif&uuml;gung einer kurzen allgemeinen Beschreibung. Graphische Darstellungen in solchen Reihen sollen jedoch ebenfalls bildlich aufgenommen werden, sofern sie nicht als vergleichsweise unbedeutend erscheinen.</p>
<p>Ausgegegrenzt bleiben die eigentlichen Land- und Volkskalender, die vorwiegend im Quart-Format, im Verlauf des 19. Jahrhunderts zunehmend aber auch im Oktav-Format erschienen sind.</p>
<p>Das Vorhaben wird von der <a href="https://musenalm.de/kontakt.html">THEODOR SPRINGMANN STIFTUNG</a> betrieben und greift zun&auml;chst auf deren umfangreichen Sammlungsbestand zur&uuml;ck, im weiteren Verlauf werden wir auf die Einbeziehung anderer Bibliotheken nicht verzichten k&ouml;nnen; vielfach wird es auch n&ouml;tig sein, M&auml;ngel und Fehlstellen einzelner vorhandener St&uuml;cke zu erg&auml;nzen.</p>
<p>Wir bitten um Anregungen und Korrekturen. Auch Hilfen durch methodische bibliographische Aufnahmen sind hochwillkommen und tragen zur Verk&uuml;rzung des langwierigen Verfahrens bei. Hierzu k&ouml;nnen entsprechende Formulare bei uns angefordert werden.</p>
<p>Das Inhaltsverzeichnis der deutschen Almanache wird erarbeitet von Wolfgang Binnig und Martin Sietzen und herausgegeben von Adrian Braunbehrens.</p>
<h1 class="wp-block-heading">Einleitung in das Inhaltsverzeichnis deutscher Almanache</h1>
<p>Seit Kalender geschrieben und gedruckt wurden, finden wir sie verquickt mit anderen Momenten der Jahreszeitlichkeit. Hierzu z&auml;hlen astronomische und astrologische Angaben, die Nennung guter und b&ouml;ser Tage, praktische Regeln zu den Jahreszeiten und ihrer Witterung und nicht zuletzt Texte zu musischem und geselligem Zeitvertreib. Dies f&uuml;hrte zur Ausbildung besonderer Typen, die einzelne dieser Momente ausf&uuml;hrlicher vorstellten. Zu den eigenartigsten und reizvollsten z&auml;hlen die poetischen Musenalmanache und literarisch unterhaltenden Taschenb&uuml;cher. Ihre Epoche begann in Deutschland &ndash; franz&ouml;sischen Vorbildern folgend &ndash; um 1770 und endete gegen 1848. Sie wurden zur wohl h&uuml;bschesten und zugleich langlebigsten Modeerscheinung auf dem deutschen Buchmarkt.</p>
<p>In Paris erschien 1765 der ALMANACH DES MUSES OU CHOIX DE PO&Eacute;SIES FUGITIVES, eine Bl&uuml;tenlese neuerer Dichtung, dessen Reihe sich in j&auml;hrlicher Ausgabe bis ins 19. Jahrhundert fortsetzte. Er fand alsbald auch in Deutschland Beachtung und zum Jahr 1770 erschien, herausgegeben von Heinrich Christian Boie und verlegt von J. C. Dieterich der G&Ouml;TTINGER MUSENALMANACH. Klopstock z&auml;hlte neben vielen anderen zu seinen Beitr&auml;gern. Der 1772 gegr&uuml;ndete G&ouml;ttinger Dichterbund fand in ihm ein Organ. Johann Heinrich Voss &uuml;bernahm 1774 f&uuml;r kurze Zeit die Redaktion, begann indes 1776 in Hamburg mit einem eigenen Musenalmanach, der nun &ndash; in recht &auml;hnlichem Erscheinungsbild &ndash; neben dem G&ouml;ttinger bestand. Von diesen Keimzellen aus entwickelte sich in Deutschland ein literarisches Almanach- und Taschenbuchwesen, das in vief&auml;ltiger Unterschiedenheit eine kaum &uuml;bersehbare, nach Tausenden zu z&auml;hlende, oft kurzlebige, teils auch in langen Jahresreihen sich fortsetzende F&uuml;lle hervorbrachte. Die Epoche des literarischen Taschenbuches war zugleich eine Hochzeit dichterischer Entfaltung in Deutschland, in den H&ouml;hen neuer Findung ebenso wie in den Senken der Trivialit&auml;t; und es war eine Periode umfassender sozialer Ver&auml;nderungen. Das Taschenbuch als gesellschaftliche Modeerscheinung und seine Wandlungen stehen in engem Bezug zu diesen Entwicklungen.- Eine umfassende Geschichte des Taschenbuches unter ausf&uuml;hrlicher Ber&uuml;cksichtigung dieser Bez&uuml;ge ist noch nicht geschrieben worden.</p>
<p>Die Mannigfaltigkeit des periodischen Taschenbuches zeigt so viele Facetten, da&szlig; es schwer h&auml;lt, eine best&auml;ndige Gattung auszumachen. Beschreiben lassen sich wiederkehrende Einzelmerkmale, die in unterschiedlicher H&auml;ufung, kaum aber in ihrer Gesamtheit beim jeweiligen Exemplar vorkommen. Unsicher ist schon die Verwendung der Ausdr&uuml;cke ALMANACH und TASCHENBUCH oder auch KALENDER; sie &uuml;berschneiden sich gro&szlig;enteils, ohne sich ganz zu decken. Es k&ouml;nnte sich empfehlen, im Taschenbuch den Oberbegriff zu sehen, wenn nicht heutzutage unter dem Taschenbuch eine ganz andere Produktform des Buches bezeichnet w&auml;re.</p>
<p>Das Wort ALMANACH (arabischen Ursprungs) ist eine Bezeichnung f&uuml;r Kalender, und mit dem Kalender hat das hier dargestellte Taschenbuch die angelegte J&auml;hrlichkeit gemein, auch wenn so manche Erscheinung &uuml;ber den ersten Jahrgang nicht hinauskommt. Oftmals, aber keineswegs immer und immer seltener werdend, ist ein Kalender dem Textteil vorgebunden. Regional erhobene Kalender-Stempelsteuern konnten hier prohibitiv wirken. Einige besonders erfolgreiche Almanache erfuhren noch Jahre nach dem Erstdruck Folgeauflagen, in denen dann der &uuml;berfl&uuml;ssig gewordene Kalender, nicht jedoch die urspr&uuml;ngliche Jahresdatierung, entfallen konnte. &ndash; Seiner Entwicklungsgeschichte nach ist das Taschenbuch durchaus vom Kalender herzuleiten, aber es emanzipiert sich gleichsam von diesem und l&auml;&szlig;t seine Herkunft vergessen. Was bleibt ist die Taschenhandlichkeit des Formates: Sedez oder Duodez, seltener Octav (aber auch hierzu in der Sp&auml;tzeit die seltene Ausnahme des Gro&szlig;octav). Und es scheint, da&szlig; die Almanache, Kalendern gleich, meist keinen Ruheplatz in den B&uuml;cherschr&auml;nken gefunden haben, sondern zur Hand genommen und vernutzt wurden; die bis heute erhalten gebliebenen Exemplare sind nicht selten ramponiert, zum Schaden f&uuml;r den zierlich gestalteten Einband.</p>
<p>Welche Art von Texten f&uuml;llte die Almanache und Taschenb&uuml;cher? Anfangs war es Lyrik, sehr bald aber, als die Mode grassierte: quodlibet, alles was beliebt; unterhalten sollte es, in Spa&szlig; oder Ernst. Nur selten mischt Belehrendes sich ein, im Unterschied zum gr&ouml;&szlig;er formatierten aber sehr viel schmaleren Land- oder Volkskalender. Sieht man in das Register der vorz&uuml;glichen <em>Geschichte der deutschen Taschenb&uuml;cher und Almanache aus der klassisch-romantischen Zeit</em> von LANCKORONSKA und R&Uuml;MANN, so findet man schon in den Titeln die Hinweise auf jede nur denkbare Art von Adressaten und zugeh&ouml;rigen Inhalten: Wanderer, Reiter, Bienenfreunde, K&uuml;nstler, Scheidek&uuml;nstler und Apotheker, Liebende, Tollh&auml;usler, Ketzer, &Auml;rzte und Nicht&auml;rzte, Charadenfreunde, Kaufleute, Lottospieler u.v.a.m.. Vor allem aber wird die Weiblichkeit angesprochen, seien es Frauenzimmer oder Damen, Dienstm&auml;dchen, das Sch&ouml;ne Geschlecht, Kammerjungfern, Grabennymphen, Edle Weiber und M&auml;dchen. Selbst wenn es der Titel nicht verr&auml;t, ist &ouml;fter an die Leserin gedacht als an den Herrn, sie hatte wohl mehr gesellige Mu&szlig;e, und sie war der gemeinte Empf&auml;nger des h&uuml;bschen kleinen Geschenks. Denn zum Schenken war er bestimmt und dazu f&uuml;gte sich der Erscheinungstermin zur Michaelismesse, rechtzeitig zu Weihnachten und Neujahr.</p>
<p>Schwerpunkt der bibliographischen Erfassung und inhaltlichen Erschlie&szlig;ung sind zun&auml;chst die literarischen Almanache &ndash; ungeachtet ihres Niveaus. Sie sind Versammlungsort nicht nur der Gro&szlig;en, sondern vorz&uuml;glich derjenigen Dichter und Prosaisten, deren Schriften heute &ndash; zu Recht oder zu Unrecht&ndash; vergessen sind, die aber aus manchen Gr&uuml;nden gelegentlich doch in den Blick des Interesses r&uuml;cken. Das Verzeichnis soll sie, die bislang nur unter Schwierigkeiten aufzufinden waren, zug&auml;nglich machen. Besonders wichtig, weil eine Wahrnehmungsl&uuml;cke f&uuml;llend, erschien uns daneben die Registrierung der Zeichner und Stecher, deren Graphiken wir als Vollbild wiedergeben wollen. Da&szlig; gerade in diesem Bereich die vorliegenden Exemplare oft unvollst&auml;ndig sind, f&uuml;hrt gelegentlich zu Fehlstellen in unserer Darstellung (die aber auf Dauer geschlossen werden); es unterstreicht zugleich die Notwendigkeit des gesetzten Ziels. Indes werden nicht nur die Vorlagen M&auml;ngel aufweisen, auch in der Bearbeitung werden unvermeidbar Fehler entstehen. Wir bitten aufmerksame Benutzer, uns hier&uuml;ber zu informieren und dadurch zur Besserung zu verhelfen.</p>
<p>Auf l&auml;ngere Sicht sollen alle periodisch angelegten Almanache und Taschenb&uuml;cher des 18. und 19. Jahrhunderts aufgenommen werden, um das gesamte Spektrum dieser Publikationsart sichtbar zu machen. Im nicht-literarischen Bereich werden wir uns jedoch zumeist beschr&auml;nken auf die bibliographische Registrierung und eine kurze Beschreibung der Einzelb&auml;nde und wir werden hierbei auf die ausf&uuml;hrliche Inhalts&uuml;bersicht verzichten und uns mit der Wiedergabe eines Inhaltsverzeichnisses begn&uuml;gen.</p>
<p>Grunds&auml;tzlich ist Voraussetzung unserer bibliographischen Erfassung die Autopsie des Einzelemplares. Dies sch&uuml;tzt indes nicht immer vor Verwirrung: Variante Doppeldrucke (etwa bei unbezeichnetet Folgeauflagen oder nach Zensureingriffen), fehlende Bl&auml;tter und andere Fehlerquellen sind nicht in jedem Fall wahrnehmbar. Auf alles auff&auml;llig Sonderliche wird anmerkend hingewiesen. Um uns m&ouml;glicher Vollst&auml;ndigkeit anzun&auml;hern, behalten wir uns vor, im Einzelfall auch ohne Autopsie nach bibliographischen Vorgaben aufzunehmen; wir werden dies jedoch immer unter Nennung der Quelle ausdr&uuml;cklich anmerken.</p>
<p>Adrian Braunbehrens</p>`

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_EINFUEHRUNG_NAME))
		if err != nil {
			app.Logger().Error("Could not find Table Einführung! You need to execute table migrations first!")
			return err
		}

		record := pagemodels.NewDefaultPage(core.NewRecord(collection))
		record.SetTitle("Einführung")
		record.SetText(START)

		if err := app.Save(record); err != nil {
			app.Logger().Error("Failed to save record", "error", err, "record", record)
			return err
		}

		return nil
	}, func(app core.App) error {
		coll, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_EINFUEHRUNG_NAME))

		if err == nil && coll != nil {
			app.DB().NewQuery("DELETE FROM " + coll.TableName()).Execute()
		}
		return nil
	})
}
