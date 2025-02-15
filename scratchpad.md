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
