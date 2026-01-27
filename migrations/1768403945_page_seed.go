package migrations

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

const (
	INDEX_ABS1 = "<p>Die Epoche der Almanache und Taschenb&uuml;cher in der deutschsprachigen Publizistik beginnt im Jahr 1770 und klingt ab 1848 allmählich aus.</p><p>Noch heute erstaunt die Vielfalt der im Almanachwesen anzutreffenden Gegenstände: es gab literarische, politische, historische, satirische, philosophische und naturwissenschaftliche Almanache und Taschenbücher; es gab solche die der Mode, der Forstwirtschaft, dem Laientheater, dem Schachspiel oder der leichten Abendunterhaltung gewidmet waren etc.</p><p>In ihrer thematischen Bandbreite stellen Almanache und Taschenbücher über ihre oft reizvolle Ausstattung und Illustration hinaus wichtige kulturhistorische Zeitzeugen dar.</p>"
	INDEX_ABS2 = "Die laufend aktualisierte Datenbank erfasst die Almanache nach <a href='/reihen'>Reihen</a>, <a href='/personen'>Personen</a> und verschiedenen Arten von Beiträgen — Textbeiträgen, Graphiken oder Musikbeiträgen. Umfangreiche <a href='/suche'>Suchfunktionen</a> helfen bei der Erschließung des Materials."

	INDEX_TITLE        = "Musenalm"
	INDEX_DESCRIPTION  = "Musenalm: Verzeichnis deutschsprachiger Almanache des 18. und 19. Jahrhunderts."
	REIHEN_TITLE       = "Reihen"
	REIHEN_DESCRIPTION = "Musenalm: Verzeichnis deutschsprachiger Almanache des 18. und 19. Jahrhunderts. Reihenverzeichnis."
	REIHEN_TEXT        = "<p>Ziel der Musenalm ist die&nbsp;bibliographische Erfassung eines Jahrhunderts deutscher Almanache und Taschenb&uuml;cher;<strong>&nbsp;</strong>das Projekt ist im Aufbau und wird kontinuierlich weitergef&uuml;hrt.</p><p>Verzeichnet werden:</p><ul><li><strong>Reihen </strong>und<strong> B&auml;nde</strong> bekannter Almanache und einzelne Druckauflagen mit ausf&uuml;hrlichen bibliographischen Angaben und kurzer systematisierter&nbsp;<strong>Darstellung ihres strukturellen Aufbaus </strong>&nbsp;(Paginierung, Anordnung der Druckteile, Graphiken und Beilagen),<strong><br></strong></li><li><strong>Beitr&auml;ge literarisch oder musisch ausgerichteter Almanache&nbsp;</strong>einzeln, nach Autor, &Uuml;berschrift und Incipit,<strong> </strong>inklusive<strong> Digitalisate </strong>graphischer und musischer Beitr&auml;ge,</li><li>Beitr&auml;ge vorwiegend&nbsp;<strong>nicht literarischer Almanache</strong>&nbsp;in der Regel durch Wiedergabe des&nbsp;<strong>Inhaltsverzeichnisses.</strong></li></ul><p>Die Bibliographie ist zug&auml;nglich mit umfangreichen Suchfunktionen &uuml;ber:</p><ul><li><strong>Reihentitel der Almanache,</strong></li><li><strong>Abbildungen (Graphiken und Musikbeilagen),</strong></li><li>Personennamen von Herausgebern und Beitr&auml;gern einerseits &uuml;ber normierte<strong> Realnamen </strong>und andererseits &uuml;ber die im Druck erscheinenden Schreibweisen der Personen (auch Pseudonyme)<strong> </strong>als<strong> Autornamen,</strong></li><li><strong>Einzeltitel und Incipit </strong>(w&ouml;rtliche Textanf&auml;nge) von Beitr&auml;gen.</li></ul><p>Die Musenalm ist ein Projekt der Theodor Springmann Stiftung in Heidelberg.</p>"
	REIHEN_IMAGE_PATH  = "./import/Static-Bilder/musen.png"

	DANKSAGUNGEN_TEXT = `<div>
<p>Der bibliographische Auftrieb auf die Musenalm bedarf der Unterst&uuml;tzung durch ihre Nutzer und insbesondere durch die Besitzer seltener und wenig bekannter, kaum auffindbarer Almanache und Taschenb&uuml;cher des gew&auml;hlten Zeitraumes von etwa 1750 bis 1870. Sie helfen uns durch Hinweise, Leihgaben auf kurze Frist, sowie durch Benennung von Fehlern und Unstimmigkeiten, die uns unterlaufen m&ouml;gen, sich aber auch aus Eigen- und Abarten untersuchter Exemplare herleiten k&ouml;nnen.</p>
<p>F&uuml;r viele geleistete Hilfen danken wir:</p>
<p>Frau <strong>Susanne Koppel</strong><br>Antiquariat Susanne Koppel<br>Parkallee 4<br>20144 Hamburg<br><a href="http://www.antiquariat-koppel.de" target="_blank" rel="noreferrer noopener">www.antiquariat-koppel.de</a><br><a href="mailto:info@antiquariat-koppel.de">info@antiquariat-koppel.de</a></p>
<p>Herrn <strong>Thomas Rezek</strong><br>Antiquariat Thomas Rezek<br>Amalienstra&szlig;e 63<br>80799 M&uuml;nchen<br><a href="http://www.a-rezek.de" target="_blank" rel="noreferrer noopener">www.a-rezek.de</a><br><a href="mailto:arezek@web.de">arezek@web.de</a></p>
<p>Herrn <strong>G&uuml;nther Trauzettel-Loibl</strong><br>Antiquariat Trauzettel<br>Haum&uuml;hle 8<br>52223 Stolberg<br><a href="http://www.antiquariat-trauzettel.de" target="_blank" rel="noreferrer noopener">www.antiquariat-trauzettel.de</a><br><a href="mailto:antiquariat.trauzettel@t-online.de">antiquariat.trauzettel@t-online.de</a></p>
<p>Herrn <strong>Uwe Turszynski</strong><br>Antiquariat Turszynski<br>Herzogstra&szlig;e 66<br>80803 M&uuml;nchen<br><a href="http://www.turszynski.de" target="_blank" rel="noreferrer noopener">www.turszynski.de</a><br><a href="mailto:antiquariat@turszynski.de">antiquariat@turszynski.de</a></p>
<p>Herrn <strong>Dieter Zipprich</strong><br>Antiquariat Zipprich<br>Karolinenstra&szlig;e 18<br>96049 Bamberg<br><a href="mailto:antiquariat.zipprich@freenet.de">antiquariat.zipprich@freenet.de</a></p>
<p>Frau Mag. <strong>Rita Robosch</strong><br>Matthaeus Truppe Buchhandlung &amp; Antiquariat<br>Stubenberggasse 7<br>A-8010 Graz<br>Austria<br><a href="mailto:truppe@aon.at">truppe@aon.at</a></p>
</div>`
	DANKSAGUNGEN_DESCRIPTION = "Danksagungen an Unterstützer:innen bei der Erfassung von Almanachen und Taschenbüchern."

	EINLEITUNG_TITLE       = "Einleitung"
	EINLEITUNG_DESCRIPTION = "Musenalm: Einführung in das Verzeichnis deutschsprachiger Almanache."
	EINLEITUNG_TEXT        = `<h2 class="wp-block-heading">Vorbemerkung</h2>
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
<p>Schwerpunkt der bibliographischen Erfassung und inhaltlichen Erschlie&szlig;ung sind zun&auml;chst die literarischen Almanache &ndash; ungeachtet ihres Niveaus. Sie sind Versammlungsort nicht nur der Gro&szlig;en, sondern vorz&uuml;glich derjenigen Dichter und Prosaisten, deren Schriften heute &ndash; zu Recht oder zu Unrecht&ndash; vergessen sind, die aber aus manchen Gr&uuml;nden gelegentlich doch in den Blick des Interesses r&uuml;cken. Das Verzeichnis soll sie, die bislang nur unter Schwierigkeiten aufzufinden waren, zug&auml;nglich machen. Besonders wichtig, weil eine Wahrnehmungsl&uuml;cke f&uuml;llend, erschien uns daneben die Registrierung der Zeichner und Kupferstecher, deren Graphiken wir als Vollbild wiedergeben wollen. Da&szlig; gerade in diesem Bereich die vorliegenden Exemplare oft unvollst&auml;ndig sind, f&uuml;hrt gelegentlich zu Fehlstellen in unserer Darstellung (die aber auf Dauer geschlossen werden); es unterstreicht zugleich die Notwendigkeit des gesetzten Ziels. Indes werden nicht nur die Vorlagen M&auml;ngel aufweisen, auch in der Bearbeitung werden unvermeidbar Fehler entstehen. Wir bitten aufmerksame Benutzer, uns hier&uuml;ber zu informieren und dadurch zur Besserung zu verhelfen.</p>
<p>Auf l&auml;ngere Sicht sollen alle periodisch angelegten Almanache und Taschenb&uuml;cher des 18. und 19. Jahrhunderts aufgenommen werden, um das gesamte Spektrum dieser Publikationsart sichtbar zu machen. Im nicht-literarischen Bereich werden wir uns jedoch zumeist beschr&auml;nken auf die bibliographische Registrierung und eine kurze Beschreibung der Einzelb&auml;nde und wir werden hierbei auf die ausf&uuml;hrliche Inhalts&uuml;bersicht verzichten und uns mit der Wiedergabe eines Inhaltsverzeichnisses begn&uuml;gen.</p>
<p>Grunds&auml;tzlich ist Voraussetzung unserer bibliographischen Erfassung die Autopsie des Einzelemplares. Dies sch&uuml;tzt indes nicht immer vor Verwirrung: Variante Doppeldrucke (etwa bei unbezeichnetet Folgeauflagen oder nach Zensureingriffen), fehlende Bl&auml;tter und andere Fehlerquellen sind nicht in jedem Fall wahrnehmbar. Auf alles auff&auml;llig Sonderliche wird anmerkend hingewiesen. Um uns m&ouml;glicher Vollst&auml;ndigkeit anzun&auml;hern, behalten wir uns vor, im Einzelfall auch ohne Autopsie nach bibliographischen Vorgaben aufzunehmen; wir werden dies jedoch immer unter Nennung der Quelle ausdr&uuml;cklich anmerken.</p>
<p>Adrian Braunbehrens</p>`

	KONTAKT_TITLE       = "Kontakt"
	KONTAKT_TEXT        = `<p>Martin Sietzen und Dr. Jakob Br&uuml;ssermann<br>Theodor-Springmann-Stiftung<br>Hirschgasse 2 <br><br>69120 Heidelberg<br><a href="mailto:info@musenalm.de">info@musenalm.de</a></p>`
	KONTAKT_DESCRIPTION = "Musenalm: Verzeichnis deutschsprachiger Almanache des 18. und 19. Jahrhunderts. Kontakt zur Redaktion."

	LITERATUR_TITLE       = "Literatur"
	LITERATUR_DESCRIPTION = "Musenalm: Verzeichnis deutschsprachiger Almanache des 18. und 19. Jahrhunderts. Weiterführende Literatur zum Almanachwesen."
	LITERATUR_TEXT        = `<h2>Ausstellungs- und Bibliothekskataloge</h2>
<p><span style="font-variant: small-caps;">Baumg&auml;rtel</span>, Ehrfried (Hg.): <em>Die Almanache, Kalender und Taschenb&uuml;cher (1750&ndash;1860) der Landesbibliothek Coburg.</em>&nbsp;Wiesbaden 1970.</p>
<p><span style="font-variant: small-caps;">Bernhardt</span>, Ursula;&nbsp;<span style="font-variant: small-caps;">Reuter-Rautenberg</span>, <span style="text-decoration: none;">Anneliese (Hgg.): </span><em>Bild und Buch. Rheinbl&uuml;then, Moosrosen und Vergi&szlig;meinnicht: Taschenb&uuml;cher f&uuml;r Frauenzimmer von Bildung</em>. Eine Studioausstellung in Zusammenarbeit mit der Badischen Landesbiliothek.&nbsp;Staatliche Kunsthalle Karlsruhe 1995.</p>
<p><span style="font-variant: small-caps;">Braunbehrens</span>, Adrian et al. (Hgg.): <em>Kalender im Wandel der Zeiten. Eine Ausstellung der Badischen Landesbibliothek zur Erinnerung an die Kalenderreform durch Papst Gregor XIII. im Jahr 1582.</em>&nbsp;Ausstellungskatalog, Bad. Landesbibliothek 1982.</p>
<p><span style="font-variant: small-caps;">Drescher</span>, Georg (Hg.): <em>O sehet her! die allerliebsten Dingerchen. Friedrich R&uuml;ckert und der Almanach</em>.&nbsp;Eine Ausstellung der Bibliothek Otto Sch&auml;fer, des Stadtarchivs Schweinfurt, der St&auml;dtischen Sammlungen Schweinfurt und der R&uuml;ckert-Gesellschaft e.V. W&uuml;rzburg 2000.</p>
<p><span style="font-variant: small-caps;">Fallbacher</span>, Karl-Heinz (Hg.): <em>Taschenb&uuml;cher im 19. Jahrhundert</em>.&nbsp;Ausstellung im Schiller-Nationalmuseum Marbach zwischen November 1992 und Februar 1993. Dt. Schillergesellschaft, Marbach am Neckar 1992.</p>
<p><span style="font-variant: small-caps;">Marwinski</span>, Felicitas (Hg.): <em>Almanache, Taschenb&uuml;cher, Taschenkalender.</em>&nbsp;Weimar 1967. Katalog der Sammlung der Th&uuml;ringischen Landesbibliothek Weimar mit 816 Nummern, 8 Abbildungen.</p>
<p><span style="font-variant: small-caps;">Mix</span>, York-Gothart (Hg.): <em>Kalender? Ey, wie viel Kalender! Literarische Almanache zwischen Rokoko und Klassizismus</em>. Ausstellung im Zeughaus der Herzog August Bibliothek in Wolfenb&uuml;ttel vom 15. Juni bis 5. November 1986. Ausstellungskataloge der Herzog August Bibliothek Nr. 50. Wolfenb&uuml;ttel 1986.</p>
<p><span style="font-variant: small-caps;">Patzer</span>, Franz (Hg.): <em>Wiener Kalender, Almanache und Taschenb&uuml;cher aus f&uuml;nf Jahrhunderten (1495&ndash;1977)</em>&nbsp;Wechselausstellung der Wiener Stadt- u. Landesbibliothek, Rathaus, Dezember 1976&ndash;J&auml;nner 1977. Wiener Stadt- u. Landesbibliothek. Wien 1976.</p>
<p><span style="font-variant: small-caps;">Schieth</span>, Lydia (Hg.): F&uuml;rs sch&ouml;ne Geschlecht. Frauenalmanache zwischen 1800 und 1850.&nbsp;Ausstellung der Universit&auml;t Bamberg in Zusammenarbeit mit der Staatsbibliothek Bamberg 12. November 1992 &ndash; 27. Februar 1993. Bamberg o. J.</p>
<p>&nbsp;</p>
<h2>Sekund&auml;rliteratur</h2>
<p><span style="font-variant: small-caps;">Ananieva</span>, Anna; <span style="font-variant: small-caps;">B&ouml;ck</span>, Dorothea; <span style="font-variant: small-caps;">Pompe</span>, Hedwig (Hgg.):&nbsp;<em>Geselliges Vergn&uuml;gen. Kulturelle Praktiken von Unterhaltung im langen 19. Jahrhundert</em>.&nbsp;Bielefeld 2011.</p>
<p><span style="font-variant: small-caps;">Anderle</span>, Martin:&nbsp;<em>Wiener Lyrik im 18. Jahrhundert. Die Gedichte des &raquo;Wiener Musenalmanachs 1777-1796&laquo;</em>.&nbsp;Stuttgart 1996.</p>
<p><span style="font-variant: small-caps;">Benjamin</span>, Walter:&nbsp;<em>Was die Deutschen lasen, w&auml;hrend ihre Klassiker schrieben</em>&nbsp;[H&ouml;rst&uuml;ck]. Ges. Werke hrsg. von Rolf Tiedeman u. Hermann Schweppenh&auml;user. Bd IV/1; Frankfurt/Main 1972, S. 641.</p>
<p><span style="font-variant: small-caps;">Boehn</span>, Max von:&nbsp;&sbquo;Der Almanach&lsquo;.&nbsp;in:&nbsp;Das Antiquariat&nbsp;7 (1951), S. 3.</p>
<p><span style="font-variant: small-caps;">Bunzel</span>, Wolfgang:&nbsp;&sbquo;Almanache und Taschenb&uuml;cher&lsquo;.&nbsp;in:&nbsp;FISCHER, Ernst; HAEFS, Wilhelm; MIX, York-Gothart (Hgg.):&nbsp;<em>Von Almanach bis Zeitung. Ein Handbuch der Medien in Deutschland 1700-1800</em>.&nbsp;M&uuml;nchen 1999, S. 24-35.</p>
<p><span style="font-variant: small-caps;">Bunzel</span>, Wolfgang:&nbsp;<em>Poetik und Publikation. Goethes Ver&ouml;ffentlichungen in Musenalmanachen und literarischen Taschenb&uuml;chern. Mit einer Bibliographie der Erst- und autorisierten Folgedrucke literarischer Texte Goethes im Almanach (1773-1832).</em>&nbsp;Weimar 1997.</p>
<p><span style="font-variant: small-caps;">Casser</span>, Paul:&nbsp;<em>Die westf&auml;lischen Musenalmanache und poetischen Taschenb&uuml;cher: ein Beitrag zur Geschichte Westfalens in der ersten H&auml;lfte des 19. Jahrhunderts</em>.&nbsp;Diss., M&uuml;nster 1928. Mikrofiche-Ausg.: Egelsbach 1992.</p>
<p><span style="font-variant: small-caps;">Dickenberger</span>, Udo (Hg.):&nbsp;<em>Der Tod und die Dichter. Scherzgedichte in den Musenalmanachen um 1800. Eine Sammlung von 220 Spottgrabinschriften</em>&nbsp;Hildesheim 1991.</p>
<p><span style="font-variant: small-caps;">Engelsing</span>, Rolf:&nbsp;&sbquo;Die Perioden der Lesergeschichte in der Neuzeit. Das statistische Ausma&szlig; und die soziokulturelle Bedeutung der Lekt&uuml;re&lsquo;.&nbsp;in: AGB 10 (1970), S. 946-1002.</p>
<p><span style="font-variant: small-caps;">Fischer</span>, Bernhard:&nbsp;<em>Der Verleger Johann Friedrich Cotta. Chronologische Verlagsbibliographie 1787-1814. Aus den Quellen bearbeitet</em>.&nbsp;3 Bde., M&uuml;nchen 2003.</p>
<p><span style="font-variant: small-caps;">Fischer</span>, Bernhard:&nbsp;&sbquo;Cottas &raquo;Morgenblatt f&uuml;r gebildete St&auml;nde&laquo; in der Zeit von 1807 bis 1823 und die Mitarbeit Therese Hubers&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;43 (1995), S. 203-239.</p>
<p><span style="font-variant: small-caps;">Fischer</span>, Ernst; <span style="font-variant: small-caps;">Haefs</span>, Wilhelm; <span style="font-variant: small-caps;">Mix</span>, York-Gothart:&nbsp;&sbquo;Einleitung: Aufkl&auml;rung, &Ouml;ffentlichkeit und Medienkultur in Deutschland im 18. Jahrhundert&lsquo;&nbsp;in:&nbsp;<span style="font-variant: small-caps;">Fischer</span>, Ernst; <span style="font-variant: small-caps;">Haefs</span>, Wilhelm; <span style="font-variant: small-caps;">Mix</span>, York-Gothart (Hgg.):&nbsp;<em>Von Almanach bis Zeitung. Ein Handbuch der Medien in Deutschland 1700-1800</em>.&nbsp;M&uuml;nchen 1999, S. 9-23.</p>
<p><span style="font-variant: small-caps;">Friedl&auml;nder</span>, Max:&nbsp;<em>Gedichte von Goethe in Compositionen seiner Zeitgenossen</em>.&nbsp;Weimar 1896. Reprint Hildesheim 1975.</p>
<p><span style="font-variant: small-caps;">Fritsch</span>, Thomas Freiherr von:&nbsp;<em>Die Gothaischen Taschenb&uuml;cher, Hofkalender und Almanach</em>.&nbsp;Limburg an der Lahn 1968.</p>
<p><span style="font-variant: small-caps;">F&uuml;rst</span>, Rainer:&nbsp;<em>&raquo;F&uuml;r edle Weiber und M&auml;dchen.&laquo; Wilhelmine M&uuml;ller geb. Maisch, Verfasserin und F&ouml;rderin der Almanachliteratur um 1800. Ein Beitrag zur Verlagsgeschichte</em>.&nbsp;Heidelberg 1995.</p>
<p><span style="font-variant: small-caps;">Gladt</span>, Karl:&nbsp;Almanache und Taschenb&uuml;cher aus Wien.&nbsp;Wien 1971</p>
<p><span style="font-variant: small-caps;">Gleissner</span>, Stephanie; <span style="font-variant: small-caps;">Husic</span>, Mirela; <span style="font-variant: small-caps;">Kaminski</span>, Nicola; <span style="font-variant: small-caps;">Mergenthaler</span>, Volker:&nbsp;<em>Optische Auftritte. Marktszenen in der medialen Konkurrenz von Journal-, Almanachs- und B&uuml;cherliteratur</em>.&nbsp;Hannover 2019 [=&nbsp;Journalliteratur,&nbsp;2].</p>
<p><span style="font-variant: small-caps;">Goldschmidt</span>, Arthur:&nbsp;<em>Goethe im Almanach</em>.&nbsp;Leipzig 1932.</p>
<p><span style="font-variant: small-caps;">Grantzow</span>, Hans:&nbsp;<em>Geschichte des G&ouml;ttinger und des Vossischen Musenalmanachs</em> [Kap. 1-4].&nbsp;Diss., Berlin 1909.</p>
<p><span style="font-variant: small-caps;">Haefs</span>, Wilhelm:&nbsp;&sbquo;Ein Kalender f&uuml;r die &raquo;mitleidigen Schwestern der Venus&laquo;? Die Literarisierung der Prostitution im Wiener &raquo;Taschenbuch f&uuml;r Grabennymphen auf das Jahr 1787&laquo;&lsquo;.&nbsp;in: Jahrbuch der R&uuml;ckert- Gesellschaft e. V. 15 (2003), S. 101-110.</p>
<p><span style="font-variant: small-caps;">Haefs</span>, Wilhelm; <span style="font-variant: small-caps;">Mix</span>, York-Gothart:&nbsp;&sbquo;Der Musenhort in der Provinz. Literarische Almanache in den Kronl&auml;ndern der &ouml;sterreichischen Monarchie im ausgehenden 18. und beginnenden 19. Jahrhundert&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;27 (1986), S. 171-194.</p>
<p><span style="font-variant: small-caps;">Haferkorn</span>, Hans J&uuml;rgen:&nbsp;&sbquo;Der freie Schriftsteller. Eine literatur-soziologische Studie &uuml;ber seine Entstehung und Lage in Deutschland zwischen 1750 und 1800&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;5 (1964), S. 523-713.</p>
<p><span style="font-variant: small-caps;">Hay</span>, Gerhard:&nbsp;<em>Die Beitr&auml;ger des Voss'schen Musenalmanaches. Ein Verzeichnis</em>.&nbsp;Hildesheim 1975.</p>
<p><span style="font-variant: small-caps;">Herzog</span>, Rudolph:&nbsp;<em>Die schlesischen Musenalmanache von 1773-1823</em>.&nbsp;Breslau 1912.</p>
<p><span style="font-variant: small-caps;">Klussmann</span>, Paul Gerhard; <span style="font-variant: small-caps;">Mix</span>, York-Gothart (Hgg.):&nbsp;<em>Literarische Leitmedien. Almanach und Taschenbuch im kulturwissenschaftlichen Kontext</em>.&nbsp;Wiesbaden 1998<em> </em></p>
<p><span style="font-variant: small-caps;">Kossmann</span>, E. F.:&nbsp;<em>Der deutsche Musenalmanach 1833-1839</em>.&nbsp;Haag 1909.</p>
<p><span style="font-variant: small-caps;">Lanckaronska</span>, Maria; <span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur<em>:&nbsp;Geschichte der deutschen Taschenb&uuml;cher und Almanache aus der klassisch-romantischen Zeit</em>.&nbsp;M&uuml;nchen 1957. Neudruck Osnabr&uuml;ck 1985.</p>
<p><span style="font-variant: small-caps;">Lieres</span>, Vita von:&nbsp;&sbquo;Kalender und Almanache&lsquo;.&nbsp;in:&nbsp;Zeitschrift f&uuml;r B&uuml;cherfreunde&nbsp;18 (1926), S. 101-114.</p>
<p><span style="font-variant: small-caps;">Ludin</span>, Alfred:&nbsp;<em>Der schweizerische Musenalmanach &raquo;Alpenrosen&laquo; und seine Vorg&auml;nger (1780-1830)</em>.&nbsp;Diss. Z&uuml;rich 1902.</p>
<p><span style="font-variant: small-caps;">L&uuml;sebrink</span>, Hans-J&uuml;rgen; Mix, York-Gothart u. a. (Hg.):&nbsp;<em>Franz&ouml;sische Almanachkultur im deutschen Sprachraum (1700-1815). Gattungsstrukturen, komparatistische Aspekte, Diskursformen</em>.&nbsp;G&ouml;ttingen 2013 [=&nbsp;Deutschland und Frankreich im wissenschaftlichen Dialog,&nbsp;3].</p>
<p><span style="font-variant: small-caps;">Mix</span>, York-Gothart<em>:&nbsp;Alamanach- und Taschenbuchkultur des 18. und 19. Jahrhunderts</em>.&nbsp;Wiesbaden 1996. [= Wolfenb&uuml;tteler Forschungen, Bd. 69]</p>
<p><span style="font-variant: small-caps;">Mix</span>, York-Gothart:&nbsp;<em>Die deutschen Musenalmanache des 18. Jahrhunderts</em>.&nbsp;M&uuml;nchen 1987.</p>
<p><span style="font-variant: small-caps;">Mix</span>, York-Gothart:&nbsp;&sbquo;Geselligkeitskultur, Gattungskonvention und Publikumsinteresse. Zur Intention und Funktion von C. M. Wielands und J. W. v. Goethes &raquo;Taschenbuch auf das Jahr 1804&laquo; und O. J. Bierbaums &raquo;Modernem Musen-Almanach&laquo;&lsquo;.&nbsp;in:&nbsp;Jahrbuch des Wiener Goethe-Vereins&nbsp;97/98 (1993), S. 35-45.</p>
<p><span style="font-variant: small-caps;">Obenaus</span>, Sibylle:&nbsp;&sbquo;Die deutschen allgemeinen kritischen Zeitschriften in der ersten H&auml;lfte des 19. Jahrhunderts&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;14 (1974), S. 2-122.</p>
<p><span style="font-variant: small-caps;">Peperkorn</span>, G&uuml;nter:&nbsp;<em>Dieses ephemerische Werckchen: Georg Christoph Lichtenberg und der G&ouml;ttinger Taschen Calender</em>.&nbsp;G&ouml;ttingen [St&auml;dt. Museum] 1992.</p>
<p><span style="font-variant: small-caps;">Pissin</span>, Raimund:&nbsp;<em>Almanache der Romantik</em>.&nbsp;Berlin-Zehlendorf 1910.</p>
<p><span style="font-variant: small-caps;">Pfeiffer</span>, Emil:&nbsp;&sbquo;Bibliographie der Schillerschen Musenalmanache 1796-1800&lsquo;.&nbsp;in:&nbsp;Jahresbericht des Schw&auml;bischer Schillerverein.&nbsp;Marbach 1916, S. 35-48</p>
<p><span style="font-variant: small-caps;">Pfister</span>, Karl:&nbsp;<em>Das Prinzip der Gedichtanordnung in Schillers Musenalmanachen 1796/1800</em>.&nbsp;Diss., Bern 1937.</p>
<p><span style="font-variant: small-caps;">Pr&uuml;sener</span>, Marlies:&nbsp;&sbquo;Lesegesellschaften im 18. Jahrhundert&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;13 (1973), S. 371-594.</p>
<p><span style="font-variant: small-caps;">Prutz</span>, Robert:&nbsp;<em>Der G&ouml;ttinger Dichterbund. Zur Geschichte der deutschen Literatur</em>.&nbsp;Leipzig 1841.</p>
<p><span style="font-variant: small-caps;">Prutz</span>, Robert:&nbsp;<em>Neue Schriften. Zur deutschen Literatur- und Kulturgeschichte</em>.&nbsp;2 Bde.; Halle 1847. bes.: Bd. I. S. 105-165:&nbsp;&sbquo;Die Musenalmanache und Taschenb&uuml;cher in Deutschland&lsquo;.</p>
<p><span style="font-variant: small-caps;">Raabe</span>, Paul:&nbsp;&sbquo;Zeitschriften und Almanache&lsquo;.&nbsp;in: <span style="font-variant: small-caps;">Hauswedel</span>, Ernst und <span style="font-variant: small-caps;">Vogt</span>, Christian (Hgg.):&nbsp;<em>Buchkunst und Literatur in Deutschland 1750 bis 1850</em>. Hamburg 1977, Bd. 1. S. 145-195 [mit ausf&uuml;hrlichem Abbildungsteil in Bd. 2. S. 108-140].</p>
<p><span style="font-variant: small-caps;">Redlich</span>, Carl Christian:&nbsp;<em>Versuch eines Chiffernlexikons zu den G&ouml;ttinger, Vo&szlig;ischen, Schillerschen und Schlegel-Tieckschen Musenalmanachen</em>.&nbsp;Hamburg 1875.</p>
<p><span style="font-variant: small-caps;">Rommel</span>, Otto:&nbsp;&sbquo;Der Wiener Musenalmanach&lsquo;.&nbsp;in:&nbsp;Euphorion&nbsp;6. Erg&auml;nzungsheft,1906.</p>
<p><span style="font-variant: small-caps;">Schr&ouml;der</span>, Rolf:&nbsp;&sbquo;Zur Struktur des &raquo;Taschenbuchs&laquo; im Biedermeier&lsquo;.&nbsp;in:&nbsp;Germanisch-Romanische Monatsschrift&nbsp;41 (1960), S. 442-448.</p>
<p><span style="font-variant: small-caps;">Schwerdtfeger</span>, Walter:&nbsp;<em>Die litteraturhistorische Bedeutung der Schillerschen Musenalmanache 1796-1800</em>.&nbsp;Leipzig 1899.</p>
<p><span style="font-variant: small-caps;">Seyffert</span>, Wolfgang:&nbsp;<em>Schillers Musenalmanache</em>.&nbsp;Berlin 1913.</p>
<p><span style="font-variant: small-caps;">Skreb</span>, Zdenko:&nbsp;<em>Das Epigramm in deutschen Musenalmanachen und Taschenb&uuml;chern um 1800</em>.&nbsp;Wien, 1977 [=&nbsp;&Ouml;sterreichische Akademie der Wissenschaften, Philosophisch-historische Klasse, Sitzungsberichte,&nbsp;331].</p>
<p><span style="font-variant: small-caps;">Skreb</span>, Zdenko:&nbsp;<em>Gattungsdominanz im deutschsprachigen literarischen Taschenbuch oder vom Sieg der Erz&auml;hlprosa</em>,&nbsp;Wien 1986 [=&nbsp;&Ouml;sterreichische Akademie der Wissenschaften, Philosophisch-historische Klasse, Sitzungsberichte,&nbsp;471].</p>
<p><span style="font-variant: small-caps;">Steig</span>, Reinhold:&nbsp;&sbquo;Ueber den G&ouml;ttingischen Musen-Almanach f&uuml;r das Jahr 1803&lsquo;.&nbsp;in:&nbsp;Euphorion&nbsp;2 (1895), S. 312-323</p>
<p><span style="font-variant: small-caps;">Stolpe</span>, Heinz:&nbsp;<em>Zeitschriften und Almanache der deutschen Klassik</em>.&nbsp;Weimar 1959.</p>
<p><span style="font-variant: small-caps;">Willnat</span>, Elisabeth:&nbsp;&sbquo;Johann Christian Dieterich. Ein Verlagsbuchh&auml;ndler und Drucker in der Zeit der Aufkl&auml;rung&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;39 (1993), S. 1-254.</p>
<p><span style="font-variant: small-caps;">Wittmann</span>, Reinhard:&nbsp;&sbquo;Der Verleger Johann Friedrich Weygand in Briefen des G&ouml;ttinger Hains&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;10 (1970), S. 319-343.</p>
<p><span style="font-variant: small-caps;">Zuber</span>, Margarete:&nbsp;&sbquo;Die deutschen Musenalmanache und sch&ouml;ngeistigen Taschenb&uuml;cher des Biedermeier 1815- 1848&lsquo;.&nbsp;in:&nbsp;AGB&nbsp;1 (1958), S. 398-489.</p>
<p>&nbsp;</p>
<h2>Graphik, Einband etc.</h2>
<p><span style="font-variant: small-caps;">Barge</span>, Hermann:&nbsp;<em>Geschichte der Buchdruckerkunst</em>.&nbsp;Leipzig 1940.</p>
<p><span style="font-variant: small-caps;">Bauer</span>, Jens-Heiner:&nbsp;<em>Daniel Nikolaus Chodowiecki. Das druckgraphische Werk. Die Sammlung Wilhelm Burggraf zu Dohna-Schlobitten. Ein Bildband mit 2340 Abbildungen in Erg&auml;nzung zum Werkverzeichnis von Wilhelm Engelmann</em>.&nbsp;Hannover 1982.</p>
<p><span style="font-variant: small-caps;">Dorn</span>, Wilhelm:&nbsp;<em>Meil-Bibliographie. Verzeichnis der von dem Radierer Johann Wilhelm Meil illustrierten B&uuml;cher und Almanache.</em>&nbsp;Berlin 1928.</p>
<p><span style="font-variant: small-caps;">Focke</span>, Rudolf [Hg.]:&nbsp;<em>Chodowiecki und Lichtenberg.</em> <em>Daniel Chodowiecki&rsquo;s Monatskupfer zum &raquo;G&ouml;ttinger Taschen Calender&laquo; nach Georg Christoph Lichtenberg's Erkl&auml;rungen (1778-1783), mit einer kunst- und litterargeschichtlichen Einleitung</em>.&nbsp;Leipzig 1901.</p>
<p><span style="font-variant: small-caps;">Forster-Hahn</span>, Franziska:&nbsp;<em>Johann Heinrich Ramberg als Karikaturist und Satiriker</em>.&nbsp;Diss. Univ. Bonn 1963. [o. O.] [o. J.] [=&nbsp;Sonderdruck aus Hann. Geschichtsbl&auml;ttern,&nbsp;NF 17 (1963)].</p>
<p><span style="font-variant: small-caps;">Haldenwang</span>, Hasso von:&nbsp;<em>Christian Haldenwang, Kupferstecher (1770-1831)</em>.&nbsp;Diss. Johann-Wolfgang-Goethe-Univ. Frankfurt am Main 1995, Frankfurt am Main 1997 [=&nbsp;Frankfurter Fundamente der Kunstgeschichte,&nbsp;14].</p>
<p><span style="font-variant: small-caps;">Hauswedell</span>, Ernst L.; VOIGT, Christian (Hgg.):&nbsp;<em>Buchkunst und Literatur in Deutschland 1750 bis 1850</em>.&nbsp;2 Bde., Hamburg 1977.</p>
<p><span style="font-variant: small-caps;">Hogarth</span>, William; <span style="font-variant: small-caps;">Lichtenberg</span>, Georg Christoph: <em>Sammlung Hogarthscher Kupfer-Stiche</em>.&nbsp;Neue wohlfeile Ausg., G&ouml;ttingen [o. J.].</p>
<p><span style="font-variant: small-caps;">Ko</span><span style="font-variant: small-caps;">&scaron;</span><span style="font-variant: small-caps;">enina</span>, Alexander (Hg.):&nbsp;<em>Literatur &mdash; Bilder. Johann Heinrich Ramberg als Buchillustrator der Goethezeit</em>.&nbsp;Hannover 2013.</p>
<p><span style="font-variant: small-caps;">Lanckaronska</span>, Maria; <span style="font-variant: small-caps;">Oehler</span>, Richard:&nbsp;<em>Die Buchillustration dex XVIII. Jahrhunderts in Deutschland, &Ouml;sterreich und der Schweiz</em>.&nbsp;3 Bde., Leipzig 1932-1934.</p>
<p><span style="font-variant: small-caps;">Rodenberg</span>, J.:&nbsp;&sbquo;Geschichte der Illustration von 1800 bis heute&lsquo;.&nbsp;in:&nbsp;<span style="font-variant: small-caps;">Leih</span>, G. (Hg.):&nbsp;<em>Handbuch der Bibliothekswissenschaft</em>.&nbsp;2. Aufl. Stuttgart 1950, Bd. 1.</p>
<p><span style="font-variant: small-caps;">Rhein</span>, Adolf:&nbsp;&sbquo;Die fr&uuml;hen Verlagseinb&auml;nde. Eine technische Entwicklung 1735-1850&lsquo;.&nbsp;in:&nbsp;Gutenberg-Jahrbuch,&nbsp;Mainz 1962, S. 519-532.</p>
<p><span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur:&nbsp;<em>Das illustrierte Buch des XIX. Jahrhunderts in England, Frankreich und Deutschland 1790-1860</em>.&nbsp;Nachdruck der Ausgabe des Insel Verlages 1930, Osnabr&uuml;ck 1975.</p>
<p><span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur:&nbsp;<em>Die illustrierten deutschen B&uuml;cher des 18. Jahrhunderts</em>.&nbsp;Stuttgart 1927.</p>
<p><span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur:&nbsp;<em>Die illustrierten deutschen B&uuml;cher des 19. Jahrhunderts</em>.&nbsp;Stuttgart 1926.</p>
<p><span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur:&nbsp;<em>Das deutsche illustrierte Buch des XVIII. Jahrhunderts</em>.&nbsp;Stra&szlig;burg 1931 [=&nbsp;Studien zur deutschen Kunstgeschichte,&nbsp;Heft 282].</p>
<p><span style="font-variant: small-caps;">Schumacher</span>, Doris:&nbsp;<em>Kupfer und Poesie. Die Illustrationskunst um 1800 im Spiegel der zeitgen&ouml;ssischen deutschen Kritik</em>.&nbsp;K&ouml;ln 2000 [=&nbsp;Pictura et Poesis,&nbsp;13].</p>
<p><span style="font-variant: small-caps;">Shesgrenn</span>, Sean (Hg.):&nbsp;<em>Engravings by Hogarth. 101 Prints</em>.&nbsp;New York 1973.</p>
<p><span style="font-variant: small-caps;">Stubbe</span>, Wolf:&nbsp;&sbquo;Illustrationen und Illustratoren&lsquo;.&nbsp;in:&nbsp;<span style="font-variant: small-caps;">Hauswedell</span>, Ernst; <span style="font-variant: small-caps;">Voigt</span>, Christian (Hgg.):&nbsp;<em>Buchkunst und Literatur in Deutschland 1750 bis 1850</em>.&nbsp;Bd. 1., Hamburg 1977, S. 58-144 [mit ausf&uuml;hrlichem Abbildungsteil Bd. 2. S. 49-106]</p>
<p><span style="font-variant: small-caps;">Stuttmann</span>, Ferdinand:&nbsp;<em>Johann Heinrich Ramberg</em>. M&uuml;nchen 1929.</p>
<p>&nbsp;</p>
<h2>Bibliographien und Nachschlagewerke (mit Siglen)</h2>
<p><em>Allgemeine Deutsche Biographie.</em>&nbsp;Hg. v. der Historischen Commission bei der K&ouml;niglichen Akademie der Wissenschaften. 55 Bde., Leipzig 1875-1910. Sigle: ADB.</p>
<p><em>Brockhaus&rsquo; Conversations-Lexikon. Allgemeine deutsche Real-Encyklop&auml;die.</em>&nbsp;13. vollst. umgearb. Aufl., Leipzig 1883-1888. Sigle: Brockh 13.</p>
<p><span style="font-variant: small-caps;">Gorzny</span>, Willy:&nbsp;<em>Deutscher Biographischer Index</em>.&nbsp;Bearb. v. Hans-Albrecht Koch, Uta Koch und Angelika Koller, 4 Bde., M&uuml;nchen 1986 [Register zu:&nbsp;GORZNY, Willy (Hg.)&nbsp;Deutsches Biographisches Archiv.&nbsp;M&uuml;nchen 1985]. Sigle: DBI.</p>
<p><span style="font-variant: small-caps;">Eymer</span>, Wilfried:&nbsp;<em>Eymers Pseudonymen Lexikon. Realnamen und Pseudonyme in der deutschen Literatur</em>.&nbsp;Bonn 1997. Sigle: E.</p>
<p><span style="font-variant: small-caps;">Goldschmidt</span>, Arthur:&nbsp;<em>Goethe im Almanach</em>.&nbsp;Leipzig 1932. Sigle: G.</p>
<p><span style="font-variant: small-caps;">Grand-Carteret</span>, John:&nbsp;<em>Les Almanachs Fran&ccedil;ais. Bibliographie &ndash; Iconographie 1600-1895</em>.&nbsp;Paris 1896. Sigle: G-C.</p>
<p><span style="font-variant: small-caps;">Goedeke</span>, Karl et al.:&nbsp;<em>Grundri&szlig; zur Geschichte der deutschen Dichtung</em>.&nbsp;13 Bde., 2. Aufl, Dresden 1884 ff.; (Bd. IV/1-4 in der dritten neubearbeiteten Aufl., Dresden 1896-1913. Neudruck Berlin 1955; Bd. IV/5 in der ersten Aufl. D&uuml;sseldorf 1957-1960; au&szlig;erdem die &bdquo;Neue Folge&ldquo;, N. F. Bd. I, Berlin 1955ff.). Sigle: Goed</p>
<p><span style="font-variant: small-caps;">Hayn</span> Hugo;<span style="font-variant: small-caps;">Gotendorf</span>, Alfred N. (Hgg.):&nbsp;<em>Bibliotheca Germanorum Erotica &amp; Curiosa. Verzeichnis der gesamten deutschen erotischen Literatur mit Einschlu&szlig; der &Uuml;bersetzungen, nebst Beif&uuml;gung der Originale</em>.&nbsp;9 Bde., Unver&auml;nd. Nachdr. d. 3. ungemein verm. Aufl. Hanau [o. J.], Hanau 1968. Sigle: H.-G.</p>
<p><span style="font-variant: small-caps;">Hirschberg</span>, Leopold:&nbsp;<em>Der Taschengoedeke. Bibliographie deutscher Erstausgaben</em>.&nbsp;M&uuml;nchen 1970. Sigle: Goed (H).</p>
<p><span style="font-variant: small-caps;">Holzmann</span>, Michael; BOHATTA, Hanns:&nbsp;Deutsches Pseudonymen-Lexikon. Aus den Quellen bearbeitet von Michael Holzmann und Hanns Bohatta.&nbsp;Hildesheim 1970. Sigle: H/B.</p>
<p><span style="font-variant: small-caps;">K&ouml;hring</span>, Hans (Hg.):&nbsp;<em>Bibliographie der Almanache, Kalender und Taschenb&uuml;cher f&uuml;r die Zeit von ca. 1750-1860</em>.&nbsp;Hamburg 1929. Neudruck Bad Karlshafen 1987. Sigle: K.</p>
<p><span style="font-variant: small-caps;">Lanckaronska</span>, Maria; <span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur:&nbsp;<em>Geschichte der deutschen Taschenb&uuml;cher und Almanache aus der klassisch-romantischen Zeit</em>.&nbsp;M&uuml;nchen 1957. Neudruck Osnabr&uuml;ck 1985. Sigle: L/R.</p>
<p><span style="font-variant: small-caps;">Redlich</span>, Carl Christian:&nbsp;<em>Versuch eines Chiffernlexikons zu den G&ouml;ttinger, Vo&szlig;ischen, Schillerschen und Schlegel-Tieckschen Musenalmanachen</em>.&nbsp;Hamburg 1875. Sigle: Re.</p>
<p><span style="font-variant: small-caps;">R&uuml;mann</span>, Arthur:&nbsp;<em>Die illustrierten deutschen B&uuml;cher des 18. Jahrhunderts</em>.&nbsp;Stuttgart 1927. Sigle: R&uuml;.</p>
<p><span style="font-variant: small-caps;">Thieme</span>, Ulrich; <span style="font-variant: small-caps;">Becker</span>, Felix [Hg.]:&nbsp;<em>Allgemeines Lexikon der bildenden K&uuml;nstler von der Antike bis zur Gegenwart</em>.&nbsp;37 Bde., Leipzig 1907-1950. Neudruck Leipzig 1999. Sigle: T/B.</p>
<p><span style="font-variant: small-caps;">Ziegler</span>, Konrad; <span style="font-variant: small-caps;">Sontheimer</span>, Walther (Hgg.):&nbsp;<em>Der kleine Pauly. Lexikon der Antike</em>.&nbsp;5 Bde., M&uuml;nchen 1979. Sigle: P.</p>`

	DOKUMENTATION_TITLE       = "Benutzerhinweise"
	DOKUMENTATION_DESCRIPTION = "Musenalm: Verzeichnis deutschsprachiger Almanache des 18. und 19. Jahrhunderts. Dokumentation der Sortierung und Struktur der Almanache."
	DOKUMENTATION_TEXT        = `
		<div class="text">
			<h3>Sortierung der Reihentitel</h3>
<p>Wir sortieren die Reihentitel nach dem Kopf der Nominalphrase, den wir zu diesem Zweck ggf. an den Anfang stellen und mit Kommas abtrennen.</p>
<p>Somit wird:</p>
<p><em>Wiener Musenalmach</em></p>
<p>bei uns geführt unter:</p>
<p><em>Musenalmanach, Wiener</em>.</p>
<p>Ebenso findet sich:</p>
<p><em>Des Churbayerischen Hohen Ritterordens S. Georgii Wappenkalender </em></p>
<p>Unter ‚W‘ einsortiert als:</p>
<p><em>Wappenkalender, Des Churbayerischen Hohen Ritterordens S. Georgii </em></p>
<p>Aus diesem Grund empfehlen wir, nicht per ("…") nach genauen Zeichenketten zu suchen.</p>
<p>Bei manchen Almanachen geben wir zur leichteren Findbarkeit den autoptischen Titel und verweisen von dort auf den systematischen. Etwa:</p>
<p><em>Baltisches Album, s. u. Album, Baltisches</em></p>
<h3>Umschläge</h3>
<p>Alle künstlerisch gestalteten Umschläge sind mit einem Bild erfasst. Nicht erfasst sind Verlagsbroschuren und unauffällige Privateinbände. Auf Nachfrage fertigen wir von allen Umschlägen Scans an.</p>
<p>&nbsp;</p>
<h3>Die Zeilen ‚Struktur‘ und ‚Nachweis‘</h3>
<p>Die Zeile ‚Struktur‘ am Einzelband dient dazu, den Aufbau und die Ausstattung eines Almanachs auf einen Blick zu erfassen.</p>
<p>Eine Erläuterung der in dieser Zeile verwendeten Abkürzungen findet sich unten.</p>
<p>In der Zeile ‚Nachweis‘ geben wir an, wo der Almanach in den einschlägigen Nachschlagewerken belegt ist. Die Auflösung der Siglen, die wir hierbei verwenden findet sich im <a href="/redaktion/literatur">Literaturverzeichnis</a>.</p>
<h3>Sammlungen</h3>
<p>Häufig finden sich in Almanachen verschiedene Objekte desselben Typs durch eine gemeinsame Überschrift zusammengefasst. In diesem Fall sprechen wir von einer Sammlung. Dies kann alle Arten von Objekten betreffen: Es gibt Sammlungen von Gedichten, Prosastücken, Graphiken oder Musikbeilagen.</p>
<p>So enthält bspw. das <em>Taschenbuch der Liebe und Freundschaft</em> gewidmet von 1805 neun unter der Überschrift <em>Gedichte</em> zusammengefasste Gedichte von Hölderlin. Der Jahrgang 1822 der <em>Minerva</em> enthält unter dem Titel <em>Gallerie zu Göthe’s Werken</em> eine Sammlung von sieben Gedichten und sieben Illustrationen.</p>
<p>Jede Sammlung ist von uns mit einer Anmerkung versehen, die Auskunft gibt, welche Objekte zu ihr gehören. Umgekehrt ist an den betreffenden Objekten jeweils die Zugehörigkeit zu der Sammlung vermerkt.</p>
<h3>s. a., s. u., Titelauflage</h3>
<p>‚s.a.‘ weist in den Anmerkungen zu Reihentiteln darauf hin, dass ein Almanach noch unter einem anderen Titel erschienen ist. So wird etwa in den Anmerkungen zum <em>Almanach historique de la Revolution Françoise</em> auf die deutsche Übersetzung des Almanachs hingewiesen: „s. a. die übersetzte Ausgabe: <em>Taschenbuch der Franken, enthaltend die Geschichte der französischen Revolution, von Hrn. Rabaut de St. Etienne</em> […].“</p>
<p style="text-align: left;">Bisweilen liegen uns inhaltsgleiche Almanache unter verschiedenen Titeln vor. Wir legen uns dann auf einen für die Sortierung maßgeblichen Titel fest und stützen uns bei dieser Entscheidung auf die relevanten Nachschlagewerke, die im Literaturverzeichnis aufgelistet sind. Mithilfe von ‚s. u.‘ verweisen wir von den alternativen auf den maßgeblichen Titel. Etwa:</p>
<p style="text-align: center;">Blumenlese, Heßische Poetische<br>s. u. Musenalmanach, Hessischer</p>
<p>Dass ein Almanach unter abweichenden Titeln erscheint, kann verschiedene Gründe haben, die von uns nicht immer rekonstruierbar sind. Ein Sonderfall dieses Sachverhalts ist die sog. Titelauflage: Ein Almanach wird (nahezu) inhaltsgleich unter einem anderen Titel ein zweites Mal publiziert. Hierauf weisen wir in den Anmerkungen zur Reihe und zu dem betreffenden Jahrgang eigens hin. So etwa bei dem <em>Almanach für die Geschichte der Menschheit 1796</em>. Zu diesem Almanach ist vermerkt, dass unter dem Titel <em>Darstellung aus der Geschichte der Menschheit</em> eine „Titelauflage ohne Nachtitel, Vorwort und Kalendarium“ erschien.</p>
<p>&nbsp;</p>
<h3><strong>Abkürzungen</strong></h3>
<p>&nbsp;</p>
<table style="width: 96.2254%;" border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Titel</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Titel des Almanachs ohne Änderungen, Auslassungen oder Kürzungen. Schreibweise: wie im Almanach</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Reihentitel</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Der Reihentitel wird pragmatisch vergeben, er dient dazu, zusammengehörige Bände trotz Änderungen des Titels etc. unter einem einheitlichen Namen zu erfassen. Der Reihentitel, auch Kurztitel genannt, dient als Suchtitel.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Herausgeber</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Name des Herausgebers, wie im Almanach zu finden</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Realname</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Der gedeutete Name in überlieferter Schreibweise</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Ort</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Verlagsort(e) wie im Almanach angegeben.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Jahr</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Jahr, auf das sich der Almanach im Titel bezieht.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>AlmanachNr</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Eindeutige Referenznummer des Almanachs</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Struktur</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Reihenfolge der tatsächlich in diesem Band vorliegenden Inhaltsobjekte, wobei diese nur nach ihrer Kategorie, nicht nach den Details, aufgelistet werden.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Norm</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Reihenfolge der tatsächlichen oder vermutlich beabsichtigten Inhaltsobjekte; Aufbau des Almanachs</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Anmerkungen</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Anmerkungen zum Band bzw. zum Beitrag</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Autor</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Der angezeigte Name des Autors (auch Pseudonyme und Kürzel oder »unbezeichnet«), wie im Almanach zu finden</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Realname</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Der gedeutete Name in überlieferter Schreibweise</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Titel</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Titel des Objekts</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Incipit</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Textanfang (ca zwei Zeilen)</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Objekt</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Um was handelt es sich? Z. B. Gedicht, Text, Prosabeitrag. Vgl. dazu auch die Tabelle Objekte unten</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Abbildung</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Ja/Nein für Foto des Objekts vorhanden/nicht vorhanden.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Paginierung</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>römische/arabische Paginierung</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Seite</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Seitennummer nach arabischer oder römischer Paginierung</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Objektzähler</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Unabhängig von Art oder vorhandener Paginierung wird jedem Inhalt seine relative Position zugewiesen.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Inhaltsnummer</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Eindeutige Datensatznummer</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<h3>Abkürzungen in der Zeile ‚Struktur‘</h3>
<p>&nbsp;</p>
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td valign="top">
<p>Anm.</p>
</td>
<td valign="top">
<p>Anmerkung</p>
</td>
</tr>
<tr>
<td valign="top">
<p>ar, ar1, ar2</p>
</td>
<td valign="top">
<p>arabische Paginierung (ggf mehrere)</p>
</td>
</tr>
<tr>
<td valign="top">
<p>B; BB</p>
</td>
<td valign="top">
<p>Blatt; Blätter</p>
</td>
</tr>
<tr>
<td valign="top">
<p>C</p>
</td>
<td valign="top">
<p>Corrigenda</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Diagr</p>
</td>
<td valign="top">
<p>Diagramm</p>
</td>
</tr>
<tr>
<td valign="top">
<p>G; GG</p>
</td>
<td valign="top">
<p>Graphik; Graphiken</p>
</td>
</tr>
<tr>
<td valign="top">
<p>UG r, v</p>
</td>
<td valign="top">
<p>Umschlaggraphik recto, verso</p>
</td>
</tr>
<tr>
<td valign="top">
<p>TG r, v</p>
</td>
<td valign="top">
<p>Titelgraphik, Titelportrait etc</p>
</td>
</tr>
<tr>
<td valign="top">
<p>gA</p>
</td>
<td valign="top">
<p>graphische Anleitung</p>
</td>
</tr>
<tr>
<td valign="top">
<p>gTzA</p>
</td>
<td valign="top">
<p>graphische Tanzanleitung</p>
</td>
</tr>
<tr>
<td valign="top">
<p>G-Verz</p>
</td>
<td valign="top">
<p>Verzeichnis der Kupfer u. ä.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Hrsg</p>
</td>
<td valign="top">
<p>Herausgeber</p>
</td>
</tr>
<tr>
<td valign="top">
<p>I-Verz</p>
</td>
<td valign="top">
<p>Inhaltsverzeichnis</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Kal</p>
</td>
<td valign="top">
<p>Kalendarium</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Kr</p>
</td>
<td valign="top">
<p>Karte</p>
</td>
</tr>
<tr>
<td valign="top">
<p>MusB; MusBB</p>
</td>
<td valign="top">
<p>Musikbeigabe; Musikbeigaben</p>
</td>
</tr>
<tr>
<td valign="top">
<p>röm, röm1, röm2</p>
</td>
<td valign="top">
<p>römische Paginierung (ggf. mehrere)</p>
</td>
</tr>
<tr>
<td valign="top">
<p>S; SS</p>
</td>
<td valign="top">
<p>Seite; Seiten</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Sp</p>
</td>
<td valign="top">
<p>Spiegel</p>
</td>
</tr>
<tr>
<td valign="top">
<p>T</p>
</td>
<td valign="top">
<p>Titel</p>
</td>
</tr>
<tr>
<td valign="top">
<p>gT</p>
</td>
<td valign="top">
<p>graphischer Titel</p>
</td>
</tr>
<tr>
<td valign="top">
<p>vT</p>
</td>
<td valign="top">
<p>Vortitel</p>
</td>
</tr>
<tr>
<td valign="top">
<p>nT</p>
</td>
<td valign="top">
<p>Nachtitel</p>
</td>
</tr>
<tr>
<td valign="top">
<p>zT</p>
</td>
<td valign="top">
<p>Zwischentitel</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Tab</p>
</td>
<td valign="top">
<p>Tabelle</p>
</td>
</tr>
<tr>
<td valign="top">
<p>VB</p>
</td>
<td valign="top">
<p>Vorsatzblatt</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Vf</p>
</td>
<td valign="top">
<p>Verfasser</p>
</td>
</tr>
<tr>
<td valign="top">
<p>VrlgM</p>
</td>
<td valign="top">
<p>Verlagsmitteilung</p>
</td>
</tr>
<tr>
<td valign="top">
<p>Vrwrt</p>
</td>
<td valign="top">
<p>Vorwort</p>
</td>
</tr>
<tr>
<td valign="top">
<p>#</p>
</td>
<td valign="top">
<p>Hinweis auf weitere Informationen in der Anmerkung.</p>
</td>
</tr>
<tr>
<td valign="top">
<p>§§</p>
</td>
<td valign="top">
<p>Hinweis auf Mängel im Almanach (Beschädigungen, fehlende Graphiken od. Beiträge, unvollständige Sammlungen etc) in der Anmerkung</p>
</td>
</tr>
<tr>
<td valign="top">
<p>+++</p>
</td>
<td valign="top">
<p>Inhalte aus mehreren Almanachen interpoliert</p>
</td>
</tr>
<tr>
<td valign="top">
<p>$</p>
</td>
<td valign="top">
<p>vermutlich</p>
</td>
</tr>
</tbody>
</table>
		</div>
	`

	KABINETT_TITLE       = "Lesekabinett"
	KABINETT_DESCRIPTION = "Musenalm: Verzeichnis deutschsprachiger Almanache des 18. und 19. Jahrhunderts. Historische Texte zum Almanachwesen."
	LESEKABINETT_FILES_PATH = "./views/public/Lesekabinett"

	ABKUERZUNGEN_PATH = "./import/data/abkuerzungen.txt"
)

type lesekabinettFileSeed struct {
	HTML     string
	FileName string
	Title    string
}

var lesekabinettSeed = []lesekabinettFileSeed{
	{
		HTML:     `<p><em>Joseph Franz von Ratschky:</em> Vorbericht. in: Wiener Musenalmanach. 1779, S. 3-6. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "ratschky_in_wiener_1779.pdf",
		Title:    "Joseph Franz von Ratschky: Vorbericht",
	},
	{
		HTML:     `<p><em>Gottfried August B&uuml;rger:</em> Nothgedrungene Nachrede. in: G&ouml;ttinger Musenalmanach. 1782, S. 184-192. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "buerger_in_goettinger_1782.pdf",
		Title:    "Gottfried August Bürger: Nothgedrungene Nachrede",
	},
	{
		HTML:     `<p><em>Christian Cay Lorenz Hirschfeld: </em>An die Leser. in: Gartenkalender. 1783, S. 272. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "hirschfeld_in_gartenkalender_1783.pdf",
		Title:    "Christian Cay Lorenz Hirschfeld: An die Leser",
	},
	{
		HTML:     `<p><em>Johann Heinrich Vo&szlig;:</em> Ank&uuml;ndigung. in: Hamburger Musenalmanach. 1784, S. 222ff. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "voss_in_hamburger_1784.pdf",
		Title:    "Johann Heinrich Voß: Ankündigung",
	},
	{
		HTML:     `<p><em>Gotthold Friedrich St&auml;udlin: </em>Nachrede. in: Schw&auml;bischer Musenalmanach. 1786 [o. S.]. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "staeudlin_in_schwaebischer_1786.pdf",
		Title:    "Gotthold Friedrich Stäudlin: Nachrede",
	},
	{
		HTML:     `<p><em>Gottfried August B&uuml;rger:</em> F&uuml;rbitte eines ans peinliche Kreuz der Verlegenheit genagelten Herausgebers eines Musenalmanachs. in: G&ouml;ttinger Musenalmanach. 1789, S. 104. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "buerger_in_goettinger_1789.pdf",
		Title:    "Gottfried August Bürger: Fürbitte eines Herausgebers",
	},
	{
		HTML:     `<p><em>Anonymus: </em>Die deutschen Almanache. in: Bibliothek der redenden und bildenden K&uuml;nste. Zweyten Bandes erstes St&uuml;ck. Leipzig, in der Dyckischen Buchhandlung, 1806, S. 207-217. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "anonymus.pdf",
		Title:    "Anonymus: Die deutschen Almanache",
	},
	{
		HTML:     `<p><em>Stephan Sch&uuml;tze:</em> Die Neujahrsversammlung. Ein dramatischer Prolog. in: Taschenbuch der Liebe und Freundschaft gewidmet. 1813, S. 1-20. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "schuetze_in_taschenbuch_1813.pdf",
		Title:    "Stephan Schütze: Die Neujahrsversammlung",
	},
	{
		HTML:     `<p><em>N. B. E.: </em>Die deutschen Taschenb&uuml;cher f&uuml;r 1820. in: Hermes oder kritisches Jahrbuch der Literatur. Zweites St&uuml;ck f&uuml;r das Jahr 1820. Amsterdam, in der Verlags-Expedition des Hermes, S. 191-235. [&darr;<em><a href="%s" target="_blank" rel="noopener">Download</a>]</em></p>`,
		FileName: "nbe_in_hermes_1820.pdf",
		Title:    "N. B. E.: Die deutschen Taschenbücher für 1820",
	},
	{
		HTML:     `<p><em>Ferdinand Johannes Wit:</em> Die Almanachomanie. in: Politisches Taschenbuch. 1831, S. 102-111. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "wit_in_politaschenbuch_1831.pdf",
		Title:    "Ferdinand Johannes Wit: Die Almanachomanie",
	},
	{
		HTML:     `<p><em>August Wilhelm Schlegel:</em> Recept. in: Deutscher Musenalmanach (Chamisso, Schwab, Gaudy). 1836, S. 18. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "schlegel_in_deutscher_1836.pdf",
		Title:    "August Wilhelm Schlegel: Recept",
	},
	{
		HTML:     `<p><em>Robert Eduard Prutz:</em> Die Musenalmanache und Taschenb&uuml;cher in Deutschland. in: Neue Schriften. Zur deutschen Literatur- und Kulturgeschichte. Erster Band, Halle, G. Schwetschke'scher Verlag, 1854, S. 105-165. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "prutz_in_musenalmanache_1854.pdf",
		Title:    "Robert Eduard Prutz: Die Musenalmanache und Taschenbücher",
	},
	{
		HTML:     `<p data-olk-copy-source="MessageBody"><em>Friedrich Arnold Brockhaus:</em> Taschenb&uuml;cher &ndash; und Almanachsliteratur in Deutschland. In: &nbsp;Allgemeine deutsche Real-Encyclop&auml;die f&uuml;r die gebildeten St&auml;nde (Conversations-Lexicon) Leipzig 1820 Bd. 10. S. 973-978. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "brockhaus.pdf",
		Title:    "Friedrich Arnold Brockhaus: Taschenbücher und Almanachsliteratur",
	},
	{
		HTML:     `<p><em>Anonymus:</em> Woher das Wort Almanach komme. in: Neues Wochenblatt zum Nuzzen und zur Unterhaltung f&uuml;r Kinder und junge Leute. Erstes B&auml;ndchen, erstes St&uuml;ck, Leipzig, in der Sommerschen Buchhandlung 1794, S. 8f. [&darr;<a href="%s" target="_blank" rel="noopener">Download</a>]</p>`,
		FileName: "allatroia_anonymus_wochenblatt_1794.pdf",
		Title:    "Anonymus: Woher das Wort Almanach komme",
	},
}

var pageMetaSeed = map[string]PageMeta{
	pagemodels.P_INDEX_NAME: {
		Title:       INDEX_TITLE,
		URL:         "/",
		Description: INDEX_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_REIHEN_NAME: {
		Title:       REIHEN_TITLE,
		URL:         "/reihen/",
		Description: REIHEN_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_DANK_NAME: {
		Title:       "Danksagungen",
		URL:         "/redaktion/danksagungen/",
		Description: DANKSAGUNGEN_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_EINFUEHRUNG_NAME: {
		Title:       EINLEITUNG_TITLE,
		URL:         "/redaktion/einleitung/",
		Description: EINLEITUNG_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_KONTAKT_NAME: {
		Title:       KONTAKT_TITLE,
		URL:         "/redaktion/kontakt/",
		Description: KONTAKT_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_LIT_NAME: {
		Title:       LITERATUR_TITLE,
		URL:         "/redaktion/literatur/",
		Description: LITERATUR_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_DOK_NAME: {
		Title:       DOKUMENTATION_TITLE,
		URL:         "/redaktion/benutzerhinweise/",
		Description: DOKUMENTATION_DESCRIPTION,
		Keywords:    "",
	},
	pagemodels.P_KABINETT_NAME: {
		Title:       KABINETT_TITLE,
		URL:         "/redaktion/lesekabinett/",
		Description: KABINETT_DESCRIPTION,
		Keywords:    "",
	},
}

func pageHTMLSeed(kabinetText string) map[string]string {
	return map[string]string{
		pageHTMLKey(pagemodels.P_INDEX_NAME, "abs1"):       INDEX_ABS1,
		pageHTMLKey(pagemodels.P_INDEX_NAME, "abs2"):       INDEX_ABS2,
		pageHTMLKey(pagemodels.P_REIHEN_NAME, "text"):      REIHEN_TEXT,
		pageHTMLKey(pagemodels.P_DANK_NAME, "text"):        DANKSAGUNGEN_TEXT,
		pageHTMLKey(pagemodels.P_EINFUEHRUNG_NAME, "text"): EINLEITUNG_TEXT,
		pageHTMLKey(pagemodels.P_KONTAKT_NAME, "text"):     KONTAKT_TEXT,
		pageHTMLKey(pagemodels.P_LIT_NAME, "text"):         LITERATUR_TEXT,
		pageHTMLKey(pagemodels.P_DOK_NAME, "text"):         DOKUMENTATION_TEXT,
		pageHTMLKey(pagemodels.P_KABINETT_NAME, "text"):    kabinetText,
	}
}

func init() {
	m.Register(func(app core.App) error {
		kabinetUrls, err := seedLesekabinettFiles(app)
		if err != nil {
			return err
		}
		kabinetText, err := buildLesekabinettHTML(kabinetUrls)
		if err != nil {
			return err
		}

		for key, meta := range pageMetaSeed {
			if err := upsertPageMeta(app, key, meta); err != nil {
				return err
			}
		}

		for key, html := range pageHTMLSeed(kabinetText) {
			if err := upsertHTML(app, key, html); err != nil {
				return err
			}
		}

		if err := seedReihenImage(app); err != nil {
			return err
		}

		images := readIndexImages(app, xmlmodels.STATIC_IMG_PATH, xmlmodels.BESCHREIBUNGEN_FN)
		for _, image := range images {
			if err := app.Save(image); err != nil {
				app.Logger().Error("Failed to save image:", "error", err, "image", image)
			}
		}

		return seedAbkuerzungen(app)
	}, func(app core.App) error {
		for key := range pageHTMLSeed("") {
			if err := deleteByKey(app, dbmodels.HTML_TABLE, key); err != nil {
				return err
			}
		}

		for key := range pageMetaSeed {
			if err := deleteByKey(app, dbmodels.PAGES_TABLE, key); err != nil {
				return err
			}
		}

		if err := deleteByKey(app, dbmodels.IMAGES_TABLE, pageHTMLKey(pagemodels.P_REIHEN_NAME, "image")); err != nil {
			return err
		}

		imagesCollection, err := app.FindCollectionByNameOrId(dbmodels.IMAGES_TABLE)
		if err != nil {
			return err
		}
		_, err = app.DB().
			NewQuery("DELETE FROM " + imagesCollection.TableName() + " WHERE " + dbmodels.KEY_FIELD + " LIKE 'page.index.image.%'").
			Execute()
		if err != nil {
			return err
		}

		return deleteLesekabinettFiles(app)
	})
}

func seedLesekabinettFiles(app core.App) (map[string]string, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.FILES_TABLE)
	if err != nil {
		return nil, err
	}

	urls := map[string]string{}
	for _, entry := range lesekabinettSeed {
		path := filepath.Join(LESEKABINETT_FILES_PATH, entry.FileName)
		file, err := filesystem.NewFileFromPath(path)
		if err != nil {
			app.Logger().Error("Failed to read lesekabinett file", "error", err, "path", path)
			return nil, err
		}

		record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.TITLE_FIELD, entry.Title)
		if record == nil {
			record = core.NewRecord(collection)
		}
		record.Set(dbmodels.TITLE_FIELD, entry.Title)
		record.Set(dbmodels.DESCRIPTION_FIELD, entry.Title)
		record.Set(dbmodels.FILE_FIELD, file)

		if err := app.Save(record); err != nil {
			return nil, err
		}

		fileName := record.GetString(dbmodels.FILE_FIELD)
		if fileName == "" {
			fileName = entry.FileName
		}
		urls[entry.FileName] = "/api/files/" + dbmodels.FILES_TABLE + "/" + record.Id + "/" + fileName
	}

	return urls, nil
}

func buildLesekabinettHTML(urls map[string]string) (string, error) {
	var builder strings.Builder
	builder.WriteString("<h1>Texte zum Almanachwesen</h1>\n")
	for _, entry := range lesekabinettSeed {
		if entry.FileName == "allatroia_anonymus_wochenblatt_1794.pdf" {
			builder.WriteString("<h1>Allotria und Kuriosa</h1>\n")
		}
		url, ok := urls[entry.FileName]
		if !ok {
			return "", fmt.Errorf("missing file url for %s", entry.FileName)
		}
		builder.WriteString(fmt.Sprintf(entry.HTML, url))
	}
	return builder.String(), nil
}

func deleteLesekabinettFiles(app core.App) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.FILES_TABLE)
	if err != nil {
		return err
	}

	if len(lesekabinettSeed) == 0 {
		return nil
	}

	params := dbx.Params{}
	placeholders := make([]string, 0, len(lesekabinettSeed))
	for i, entry := range lesekabinettSeed {
		key := fmt.Sprintf("p%d", i)
		params[key] = entry.FileName
		placeholders = append(placeholders, "{:"+key+"}")
	}

	query := "DELETE FROM " + collection.TableName() + " WHERE " + dbmodels.FILE_FIELD + " IN (" + strings.Join(placeholders, ", ") + ")"
	_, err = app.DB().NewQuery(query).Bind(params).Execute()
	return err
}

func seedReihenImage(app core.App) error {
	img, err := filesystem.NewFileFromPath(REIHEN_IMAGE_PATH)
	if err != nil {
		app.Logger().Error("Failed to read image file", "error", err, "path", REIHEN_IMAGE_PATH)
		return err
	}

	collection, err := app.FindCollectionByNameOrId(dbmodels.IMAGES_TABLE)
	if err != nil {
		return err
	}

	key := pageHTMLKey(pagemodels.P_REIHEN_NAME, "image")
	record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
	if record == nil {
		record = core.NewRecord(collection)
		record.Set(dbmodels.KEY_FIELD, key)
	}
	record.Set(dbmodels.TITLE_FIELD, REIHEN_TITLE)
	record.Set(dbmodels.DESCRIPTION_FIELD, REIHEN_DESCRIPTION)
	record.Set(dbmodels.IMAGE_FIELD, img)
	return app.Save(record)
}

func seedAbkuerzungen(app core.App) error {
	if _, err := os.Stat(ABKUERZUNGEN_PATH); err != nil {
		return err
	}

	file, err := os.Open(ABKUERZUNGEN_PATH)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	abk := make(map[string]string)

	for scanner.Scan() {
		line := scanner.Text()
		split := strings.Split(line, ":")
		if len(split) <= 1 {
			fmt.Println("Abkürzung nicht definiert: " + line)
			continue
		}

		besch := strings.Join(split[1:], ":")
		abk[split[0]] = strings.TrimSpace(besch)
	}

	dataColl, err := app.FindCollectionByNameOrId(dbmodels.DATA_TABLE)
	if err != nil {
		return err
	}

	record := core.NewRecord(dataColl)
	record.Set(dbmodels.KEY_FIELD, "abkuerzungen")
	record.Set(dbmodels.VALUE_FIELD, abk)
	return app.Save(record)
}

type indexImageMeta struct {
	Title       string
	Description string
}

func readIndexDescriptions(filePath string) (map[string]*indexImageMeta, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	images := make(map[string]*indexImageMeta)
	var filename string

	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "# ") {
			filename = strings.TrimPrefix(line, "# ")
			images[filename] = &indexImageMeta{}
		} else if strings.HasPrefix(line, "## ") {
			title := strings.TrimPrefix(line, "## ")
			images[filename].Title = title
		} else if strings.HasPrefix(line, "### ") {
			beschr := strings.TrimPrefix(line, "### ")
			images[filename].Description = beschr
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return images, nil
}

func readIndexImages(app core.App, path, descriptionFn string) []*core.Record {
	ret := make([]*core.Record, 0)
	collection, err := app.FindCollectionByNameOrId(dbmodels.IMAGES_TABLE)
	if err != nil {
		app.Logger().Error("Could not find images table!", "error", err)
		return ret
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ret
	}

	descriptionPath := filepath.Join(path, descriptionFn)
	images, err := readIndexDescriptions(descriptionPath)
	if err != nil {
		app.Logger().Error("Failed to read descriptions file:", "error", err)
		app.Logger().Info("Proceeding without descriptions")
		return ret
	}

	walkFn := func(path string, fileInfo os.FileInfo, inpErr error) (err error) {
		name := fileInfo.Name()
		titleWithoutExt := strings.TrimSuffix(name, filepath.Ext(name))
		if !fileInfo.IsDir() &&
			(strings.HasSuffix(name, ".png") ||
				strings.HasSuffix(name, ".jpg") ||
				strings.HasSuffix(name, ".jpeg")) {
			if strings.HasSuffix(strings.TrimSuffix(name, filepath.Ext(name)), "-vorschau") {
				return nil
			}

			info, exists := images[name]
			if exists {
				info.Title = titleWithoutExt
			} else {
				fn := strings.TrimSuffix(name, "-hintergrund"+filepath.Ext(name))
				info, exists = images[fn]
				if exists {
					info.Title = titleWithoutExt
				} else {
					return nil
				}
			}

			f, err := filesystem.NewFileFromPath(path)
			if err != nil {
				app.Logger().Error("Failed to create file from path:", "error", err)
				return nil
			}

			imageKeyBase := strings.TrimSuffix(name, filepath.Ext(name))
			imageKeyBase = strings.TrimSuffix(imageKeyBase, "-hintergrund")
			record := core.NewRecord(collection)
			record.Set(dbmodels.KEY_FIELD, "page.index.image."+imageKeyBase)
			record.Set(dbmodels.TITLE_FIELD, info.Title)
			record.Set(dbmodels.DESCRIPTION_FIELD, info.Description)
			record.Set(dbmodels.IMAGE_FIELD, f)

			previewName := strings.TrimSuffix(name, filepath.Ext(name)) + "-vorschau" + filepath.Ext(name)
			previewPath := filepath.Join(filepath.Dir(path), previewName)
			if _, err := os.Stat(previewPath); err == nil {
				previewFile, err := filesystem.NewFileFromPath(previewPath)
				if err != nil {
					log.Println(err)
					return nil
				}
				record.Set(dbmodels.PREVIEW_FIELD, previewFile)
				ret = append(ret, record)
			}
		}
		return nil
	}

	if err := filepath.Walk(path, walkFn); err != nil {
		app.Logger().Error("Failed to walk path:", "error", err)
	}

	return ret
}
