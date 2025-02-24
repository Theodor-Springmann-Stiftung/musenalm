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
- In der Almanach- und Suchansicht werden auch mehrere Bilder zu einem Eintrag angezeigt
- In der Almanach- und Suchansicht kann nach Inhalten frei gefiltert werden, oder nach Typ

- Es gibt neue URLs, die fest verlinkt werden können für einzelne:
    - Personen 
    - Reihen
    - Bände
    - Beiträge

- Die Suche ist klar nach Typ unterteilt und insgesamt zuverlässiger
- Zusätzlich zur jetzigen Suchfunktion gibt es für jeden Typ noch eine Detailsuche
- Suchergebnisse können nach Typ, Person, Jahr gefiltert werden
- Suchergebnisse könnnen nach Jahr und Band, nach Band und Jahr (nach Personen) sortiert werden
- Jede Suche hat eine eindeutige URL


TODO danach:
- Google-Suchoptimierung
- Error Pages prüfen & error-Verhalten von HTMX
- Stimmigere Page-Abstraktion
- Weißraum in den Antworten
- Antworten komprimieren
- Cache?
- Footer
