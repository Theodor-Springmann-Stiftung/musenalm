package migrations_dokumentation

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

const START = `<h3>Sortierung der Reihentitel</h3>
<p>Wir sortieren die Reihentitel nach dem Kopf der Nominalphrase, den wir zu diesem Zweck ggf. an den Anfang stellen und mit Kommas abtrennen.</p>
<p>Somit wird:</p>
<p><em>Wiener Musenalmach</em></p>
<p>bei uns gef&uuml;hrt unter:</p>
<p><em>Musenalmanach, Wiener</em>.</p>
<p>Ebenso findet sich:</p>
<p><em>Des Churbayerischen Hohen Ritterordens S. Georgii Wappenkalender </em></p>
<p>Unter &sbquo;W&lsquo; einsortiert als:</p>
<p><em>Wappenkalender, Des Churbayerischen Hohen Ritterordens S. Georgii </em></p>
<p>Aus diesem Grund empfehlen wir, nicht per ("&hellip;") nach genauen Zeichenketten zu suchen.</p>
<p>Bei manchen Almanachen geben wir zur leichteren Findbarkeit den autoptischen Titel und verweisen von dort auf den systematischen. Etwa:</p>
<p><em>Baltisches Album, s. u. Album, Baltisches</em></p>
<h3>Umschl&auml;ge</h3>
<p>Alle k&uuml;nstlerisch gestalteten Umschl&auml;ge sind mit einem Bild erfasst. Nicht erfasst sind Verlagsbroschuren und unauff&auml;llige Privateinb&auml;nde. Auf Nachfrage fertigen wir von allen Umschl&auml;gen Scans an.</p>
<p>&nbsp;</p>
<h3>Die Zeilen &sbquo;Struktur&lsquo; und &sbquo;Nachweis&lsquo;</h3>
<p>Die Zeile &sbquo;Struktur&lsquo; am Einzelband dient dazu, den Aufbau und die Ausstattung eines Almanachs auf einen Blick zu erfassen.</p>
<p>Eine Erl&auml;uterung der in dieser Zeile verwendeten Abk&uuml;rzungen findet sich unten.</p>
<p>In der Zeile &sbquo;Nachweis&lsquo; geben wir an, wo der Almanach in den einschl&auml;gigen Nachschlagewerken belegt ist. Die Aufl&ouml;sung der Siglen, die wir hierbei verwenden findet sich im <a href="/redaktion/literatur">Literaturverzeichnis</a>.</p>
<h3>Sammlungen</h3>
<p>H&auml;ufig finden sich in Almanachen verschiedene Objekte desselben Typs durch eine gemeinsame &Uuml;berschrift zusammengefasst. In diesem Fall sprechen wir von einer Sammlung. Dies kann alle Arten von Objekten betreffen: Es gibt Sammlungen von Gedichten, Prosast&uuml;cken, Graphiken oder Musikbeilagen.</p>
<p>So enth&auml;lt bspw. das <em>Taschenbuch der Liebe und Freundschaft</em> gewidmet von 1805 neun unter der &Uuml;berschrift <em>Gedichte</em> zusammengefasste Gedichte von H&ouml;lderlin. Der Jahrgang 1822 der <em>Minerva</em> enth&auml;lt unter dem Titel <em>Gallerie zu G&ouml;the&rsquo;s Werken</em> eine Sammlung von sieben Gedichten und sieben Illustrationen.</p>
<p>Jede Sammlung ist von uns mit einer Anmerkung versehen, die Auskunft gibt, welche Objekte zu ihr geh&ouml;ren. Umgekehrt ist an den betreffenden Objekten jeweils die Zugeh&ouml;rigkeit zu der Sammlung vermerkt.</p>
<h3>s. a., s. u., Titelauflage</h3>
<p>&sbquo;s.a.&lsquo; weist in den Anmerkungen zu Reihentiteln darauf hin, dass ein Almanach noch unter einem anderen Titel erschienen ist. So wird etwa in den Anmerkungen zum <em>Almanach historique de la Revolution Fran&ccedil;oise</em> auf die deutsche &Uuml;bersetzung des Almanachs hingewiesen: &bdquo;s. a. die &uuml;bersetzte Ausgabe: <em>Taschenbuch der Franken, enthaltend die Geschichte der franz&ouml;sischen Revolution, von Hrn. Rabaut de St. Etienne</em> [&hellip;].&ldquo;</p>
<p style="text-align: left;">Bisweilen liegen uns inhaltsgleiche Almanache unter verschiedenen Titeln vor. Wir legen uns dann auf einen f&uuml;r die Sortierung ma&szlig;geblichen Titel fest und st&uuml;tzen uns bei dieser Entscheidung auf die relevanten Nachschlagewerke, die im Literaturverzeichnis aufgelistet sind. Mithilfe von &sbquo;s. u.&lsquo; verweisen wir von den alternativen auf den ma&szlig;geblichen Titel. Etwa:</p>
<p style="text-align: center;">Blumenlese, He&szlig;ische Poetische<br>s. u. Musenalmanach, Hessischer</p>
<p>Dass ein Almanach unter abweichenden Titeln erscheint, kann verschiedene Gr&uuml;nde haben, die von uns nicht immer rekonstruierbar sind. Ein Sonderfall dieses Sachverhalts ist die sog. Titelauflage: Ein Almanach wird (nahezu) inhaltsgleich unter einem anderen Titel ein zweites Mal publiziert. Hierauf weisen wir in den Anmerkungen zur Reihe und zu dem betreffenden Jahrgang eigens hin. So etwa bei dem <em>Almanach f&uuml;r die Geschichte der Menschheit 1796</em>. Zu diesem Almanach ist vermerkt, dass unter dem Titel <em>Darstellung aus der Geschichte der Menschheit</em> eine &bdquo;Titelauflage ohne Nachtitel, Vorwort und Kalendarium&ldquo; erschien.</p>
<p>&nbsp;</p>
<h3><strong>Abk&uuml;rzungen</strong></h3>
<p>&nbsp;</p>
<table style="width: 96.2254%;" border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Titel</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Titel des Almanachs ohne &Auml;nderungen, Auslassungen oder K&uuml;rzungen. Schreibweise: wie im Almanach</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Reihentitel</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Der Reihentitel wird pragmatisch vergeben, er dient dazu, zusammengeh&ouml;rige B&auml;nde trotz &Auml;nderungen des Titels etc. unter einem einheitlichen Namen zu erfassen. Der Reihentitel, auch Kurztitel genannt, dient als Suchtitel.</p>
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
<p>Der gedeutete Name in &uuml;berlieferter Schreibweise</p>
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
<p>Reihenfolge der tats&auml;chlich in diesem Band vorliegenden Inhaltsobjekte, wobei diese nur nach ihrer Kategorie, nicht nach den Details, aufgelistet werden.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Norm</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Reihenfolge der tats&auml;chlichen oder vermutlich beabsichtigten Inhaltsobjekte; Aufbau des Almanachs</p>
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
<p>Der angezeigte Name des Autors (auch Pseudonyme und K&uuml;rzel oder &raquo;unbezeichnet&laquo;), wie im Almanach zu finden</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Realname</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Der gedeutete Name in &uuml;berlieferter Schreibweise</p>
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
<p>Ja/Nein f&uuml;r Foto des Objekts vorhanden/nicht vorhanden.</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Paginierung</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>r&ouml;mische/arabische Paginierung</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Seite</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Seitennummer nach arabischer oder r&ouml;mischer Paginierung</p>
</td>
</tr>
<tr>
<td style="width: 37.11%;" valign="top" width="170">
<p>Objektz&auml;hler</p>
</td>
<td style="width: 62.8597%;" valign="top" width="434">
<p>Unabh&auml;ngig von Art oder vorhandener Paginierung wird jedem Inhalt seine relative Position zugewiesen.</p>
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
<h3>Abk&uuml;rzungen in der Zeile &sbquo;Struktur&lsquo;</h3>
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
<p>Blatt; Bl&auml;tter</p>
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
<p>Verzeichnis der Kupfer u. &auml;.</p>
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
<p>r&ouml;m, r&ouml;m1, r&ouml;m2</p>
</td>
<td valign="top">
<p>r&ouml;mische Paginierung (ggf. mehrere)</p>
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
<p>&sect;&sect;</p>
</td>
<td valign="top">
<p>Hinweis auf M&auml;ngel im Almanach (Besch&auml;digungen, fehlende Graphiken od. Beitr&auml;ge, unvollst&auml;ndige Sammlungen etc) in der Anmerkung</p>
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
</table>`

const ABK_PATH = "./import/data/abkuerzungen.txt"

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME))
		if err != nil {
			app.Logger().Error("Could not find Table Dokumentation! You need to execute table migrations first!")
			return err
		}

		record := pagemodels.NewTextPage(core.NewRecord(collection))
		record.SetTitle("Dokumentation")
		record.SetText(START)

		if err := app.Save(record); err != nil {
			app.Logger().Error("Failed to save record", "error", err, "record", record)
			return err
		}

		abk, err := seed_abkuerzungen(app)
		if err != nil {
			app.Logger().Error("Failed to seed abkuerzungen", "error", err)
			return err
		}

		for _, a := range abk {
			if err := app.Save(a); err != nil {
				app.Logger().Error("Failed to save abk", "error", err, "abk", a)
			}
		}

		return nil
	}, func(app core.App) error {
		coll, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME))

		if err == nil && coll != nil {
			app.DB().NewQuery("DELETE FROM " + coll.TableName()).Execute()
		}

		coll_abk, err2 := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME, pagemodels.T_ABK_NAME))

		if err == nil && coll_abk != nil {
			app.DB().NewQuery("DELETE FROM " + coll_abk.TableName()).Execute()
		}

		return errors.Join(err, err2)
	})
}

func seed_abkuerzungen(app core.App) ([]*pagemodels.Abk, error) {
	collection, err := app.FindCollectionByNameOrId(pagemodels.GeneratePageTableName(pagemodels.P_DOK_NAME, pagemodels.T_ABK_NAME))
	if err != nil {
		return nil, err
	}

	if _, err := os.Stat(ABK_PATH); err != nil {
		return nil, err
	}

	file, err := os.Open(ABK_PATH)
	if err != nil {
		return nil, err
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

	ret := make([]*pagemodels.Abk, 0, len(abk))
	for a, b := range abk {
		r := pagemodels.NewAbk(core.NewRecord(collection))
		r.SetAbk(a)
		r.SetBedeutung(b)
		ret = append(ret, r)
	}

	return ret, nil
}
