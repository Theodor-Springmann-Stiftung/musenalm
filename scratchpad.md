TODO danach:
- MO Input:
    - Titelauflage von/ hat TA
    - Zeilenumbrüche in Reihen-Annotationen (EVTL. fix in TinyMCE)
    - Status: Auopsiert, Erfasst etc.
    - \) parse on input
- SO Hilfe-Texte für Felder
- MO Lösch-Links in Liste, Übersicht u.s.w. (? CSRF-Token fehlt)

Features:
- NÄCHSTE WOCHE Datenbank-Hygiene
- DI Extra-DB für FTS5: ist eigentlich nichtTeil der Haupt-DB, sondern nur Suchindex
    - Suchindex beim Start erstellen, anstatt dauerhaft zu speichern

- text person groß bei Inhalten
- Inhlts-Typ anzeigen bei Liste v. Inhalten im Edit-Scrren

BUGS:
- DI: Schriftgröße edit-Screen
- MO: doppelte Einträge Reihen-Liste
	- S. Abendstunden
- Löschen v. Personen syncronisiert nicht den Suchindex
- Index images become a part of the more generic images table (their index starts with index-) so we can find them quickly
- All the text for the websites will be mmoved to the HTML table with the keys being the names.
