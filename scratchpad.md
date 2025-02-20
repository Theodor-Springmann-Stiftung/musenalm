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


- Man kann auf der Startseit nach Almanach-Nummern suchen
- Überall werden die Almanachnummer und Inhaltsnummer angezeigt
- Die URL referenziert die Almanachnummern, nicht mher die DB-IDs

- In der Almanach-Ansicht werden die Abkürzungen erklärt
- In der Almanach-Ansicht können die Beiträge nach Sammlungen gruppiert werden
- In der Almanach-Ansicht kann nach Inhalten frei gefiltert werden, oder nach Typ

- Es gibt neue URLs sowohl für die einzelne Reihe, als auch für den einzelnen Beitrag

- Die Suche ist klar nach Typ unterteilt
- Zusätzlich zur jetzigen Suchfunktion gibt es für jeden Typ noch eine Detailsuche
- Suchergebnisse können nach Typ, Person, Jahr gefiltert werden
- Suchergebnisse könnnen nach Jahr und Band, nach Band und Jahr (nach Personen) sortiert werden
- Jede Suche hat eine eindeutige URL
