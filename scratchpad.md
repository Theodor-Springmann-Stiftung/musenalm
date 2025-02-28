Vorteile PocketBase
- Log-Datenbank
- User-Management
- Kurze Übernahme neuer Features
- Backup
- Email

- Hooks


Nachteile PocketBase
- Alles muss über Hooks gemacht werden
- Eigener HTTP-Server
- Eigene Cache-Implemtation
- Eigene Cookies on Auth

- Eine weitere Abhängigkeit


Für einen Umzug:
Alle PB-Abfragen die Record benutzen, nach sql-Abfragen umwandeln.
Eigene DB-Connection
Modelle umwandeln (zzt RecordProxy)


- Abfragen Personen
- Abfragen Person
- Ersellen & Abfragen FTS5-Tabellen
- Erstellen Textseiten

- Technologie-Stack auf Server-Rendering / Go Templates umgestellt
- Die Seiten sollten jetzt insgesamt schneller laden

- Man kann auf der Startseite und in der Suche nach Almanach-Nummern suchen
- Überall werden die Almanachnummer und Inhaltsnummer angezeigt
- Die URL referenziert die Almanachnummern, nicht mher die Datenbank-IDs

- In der Almanach-Ansicht werden die Abkürzungen erklärt
- In der Almanach- und Suchansicht werden Sammlungen abgehoben 
- In der Almanach- und Suchansicht werden auch mehrere Bilder zu einem Eintrag angezeigt, falls vorhanden
- In der Almanach- und Suchansicht kann nach Inhalten frei gefiltert werden, oder nach Typ

- Es gibt URLs, die fest verlinkt werden können für einzelne:
    - Personen 
    - Reihen
    - Bände
    - Beiträge
		- Alle Suchanfragen

- Die Suche ist klar nach Typ unterteilt und insgesamt zuverlässiger
- Zusätzlich zur jetzigen Suchfunktion gibt es für Beiträge und Bände noch eine Detailsuche
- Suchergebnisse können nach Typ, Person, Jahr gefiltert werden
- Suchergebnisse könnnen nach Jahr und Band, nach Band und Jahr (nach Personen) sortiert werden


TODO danach:
- Google-Suchoptimierung
- Error Pages prüfen & error-Verhalten von HTMX
- Weißraum in den Antworten
- Antworten komprimieren
- Cache?


- HTMX + Smooth scroll
- Personen: related
- Inhaltsliste: Personen sehen komisch aus
- Sammlungen neuer versuch
- Inhaltsliste Personen
    - Sortierung nach Band A-Z?
