TODO danach:
- MO Input:
    - Titelauflage von/ hat TA
    - Zeilenumbrüche in Reihen-Annotationen (EVTL. fix in TinyMCE)
    - Status: Auopsiert, Erfasst etc.
- SO Display von Status u. Bearbeitungsvermerk in Almanach-Ansicht für eingeloggte Nutzer
- SO Hilfe-Texte für Felder
- MO Lösch-Links in Liste, Übersicht u.s.w. (? CSRF-Token fehlt)


Features:
- NÄCHSTE WOCHE Datenbank-Hygiene
- DI Extra-DB für FTS5: ist eigentlich nichtTeil der Haupt-DB, sondern nur Suchindex
    - Suchindex beim Start erstellen, anstatt dauerhaft zu speichern

BUGS:
- DI: Schriftgröße edit-Screen
- MO: doppelte Einträge Reihen-Liste
	- S. Abendstunden
- Löschen v. Personen syncronisiert nicht den Suchindex



Scrap that. I'd like more general tables: files, images, data, HTML

Data has two main and two metadata fields:
Key (string, indexed)
Value (JSON)
Updated (date)
Created (date)

Images has five main fields:
Key (string, indexed)
Title (string, indexed)
Description (string)
Preview (file)
Image (image, file)
Updated (date)
Created (date)

Files has three main fields:
Key (string, indexed)
Description (string)
File (file)
Updated (date)
Created (date)

HTML has two main fields:
Key (string, indexed)
HTML (editor)
Updated (date)
Created (date)

I'd like to have a table for each of these.

The following changes will be made to the db + migrations:
- Index images become a part of the more generic images table (their index starts with index-) so we can find them quickly
- Abkürzungen will be stored as an object in the data table
- All the text for the websites will be mmoved to the HTML table with the keys being the names.

Help about the fields will also be stored in the data table as a JSON object:
[
tablename: {
    description: string,
    private_description: string,
    private: boolean,
    fieldname: {
        type: string,
        firendly_name: string,
        description: string,
        private_description: string,
        required: boolean,
        private: boolean,
        default: string, 
        options: array
    }
},
tablename: {
... ]

1. Create the migrations for these three newtables in tables.go migration -- I will reapply all the migrations later
2. Move the existing abkürzungen to the data table
3. Move the existing index images to the images table
4. Move the existing websites to the HTML table (istead of each website having its own table)
