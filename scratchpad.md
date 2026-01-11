TODO danach:
- MO Input:
    - Titelauflage von/ hat TA
    - Zeilenumbrüche in Reihen-Annotationen (EVTL. fix in TinyMCE)
    - Status: Auopsiert, Erfasst etc.
- SO Status farbig
- SO Löschen von Personen: werden relationen zu Inhalten mitgelöscht? optional inhalte löschen?
- SO Display von Status u. Bearbeitungsvermerk in Almanach-Ansicht für eingeloggte Nutzer
- SO Hilfe-Texte für Felder
- MO Lösch-Links in Liste, Übersicht u.s.w. (? CSRF-Token fehlt)


Features:
- SO, DI Double detection für Ortsnamen, Personennamen, Reihentitel, Kurztitel
- NÄCHSTE WOCHE Datenbank-Hygiene
- DI Extra-DB für FTS5: ist eigentlich nichtTeil der Haupt-DB, sondern nur Suchindex
    - Suchindex beim Start erstellen, anstatt dauerhaft zu speichern

BUGS:
- DI: Schriftgröße edit-Screen
- MO: doppelte Einträge Reihen-Liste
	- S. Abendstunden
