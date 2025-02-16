package migrations_literatur

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

const START = `<h2>Ausstellungs- und Bibliothekskataloge</h2>
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
<p><span style="font-variant: small-caps;">Wittmann</span>, Reinhard:&nbsp;&sbquo;Der Verleger Johann Friedrich Weygand in Briefen des G&ouml;ttinger Hains&lsquo;.&nbsp;in: AGB 10 (1970), S. 319-343.</p>
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

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_LIT_NAME))
		if err != nil {
			app.Logger().Error("Could not find Table Literatur! You need to execute table migrations first!")
			return err
		}

		record := pagemodels.NewDefaultPage(core.NewRecord(collection))
		record.SetTitle("Literatur")
		record.SetText(START)

		return app.Save(record)
	}, func(app core.App) error {
		coll, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_LIT_NAME))

		if err == nil && coll != nil {
			app.DB().NewQuery("DELETE FROM " + coll.TableName()).Execute()
		}
		return nil
	})
}
