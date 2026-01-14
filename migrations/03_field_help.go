package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

type FieldHelp struct {
	TableName   string
	FieldName   string
	Help        string
	Description string
}

type FieldHelpEntry struct {
	FieldName   string
	Help        string
	Description string
}

type FieldHelpTable struct {
	TableName   string
	Common      []FieldHelpEntry
	Entries     []FieldHelpEntry
	Help        string
	Description string
}

var fieldHelpSeed = []FieldHelpTable{
	{
		TableName:   dbmodels.PLACES_TABLE,
		Help:        "Liste aller verfügbaren Orte",
		Description: "Diese Tabelle enthält alle Orte, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Orten und Ortsnamen verwendet.",
		Common: []FieldHelpEntry{
			{FieldName: dbmodels.ID_FIELD, Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
			{FieldName: dbmodels.CREATED_FIELD, Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
			{FieldName: dbmodels.UPDATED_FIELD, Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
			{FieldName: dbmodels.ANNOTATION_FIELD, Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
			{FieldName: dbmodels.COMMENT_FIELD, Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
		},
		Entries: []FieldHelpEntry{
			{FieldName: dbmodels.EDITOR_FIELD, Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
			{FieldName: dbmodels.MUSENALMID_FIELD, Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
			{FieldName: dbmodels.EDITSTATE_FIELD, Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
			{FieldName: dbmodels.PLACES_NAME_FIELD, Help: "Ortsname", Description: "Name des Ortes"},
			{FieldName: dbmodels.PLACES_FICTIONAL_FIELD, Help: "Fiktiv", Description: "Ist dieser Ort fiktiv?"},
			{FieldName: dbmodels.PLACES_PSEUDONYMS_FIELD, Help: "Pseudonyme", Description: "Alternative Namen oder Pseudonyme für diesen Ort"},
			{FieldName: dbmodels.URI_FIELD, Help: "URI", Description: "Uniform Resource Identifier (externe Referenz)"},
		},
	},
	{
		TableName:   dbmodels.AGENTS_TABLE,
		Help:        "Liste aller verfügbaren Personen und Körperschaften",
		Description: "Diese Tabelle enthält alle Personen und Körperschaften, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Personen und Körperschaften verwendet.",
		Common: []FieldHelpEntry{
			{FieldName: dbmodels.ID_FIELD, Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
			{FieldName: dbmodels.CREATED_FIELD, Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
			{FieldName: dbmodels.UPDATED_FIELD, Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
			{FieldName: dbmodels.ANNOTATION_FIELD, Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
			{FieldName: dbmodels.COMMENT_FIELD, Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
		},
		Entries: []FieldHelpEntry{
			{FieldName: dbmodels.EDITOR_FIELD, Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
			{FieldName: dbmodels.MUSENALMID_FIELD, Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
			{FieldName: dbmodels.EDITSTATE_FIELD, Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
			{FieldName: dbmodels.AGENTS_NAME_FIELD, Help: "Name", Description: "Name der Person oder Körperschaft"},
			{FieldName: dbmodels.AGENTS_CORP_FIELD, Help: "Körperschaft", Description: "Handelt es sich um eine Körperschaft (Organisation)?"},
			{FieldName: dbmodels.AGENTS_FICTIONAL_FIELD, Help: "Fiktiv", Description: "Ist diese Person/Körperschaft fiktiv?"},
			{FieldName: dbmodels.AGENTS_BIOGRAPHICAL_DATA_FIELD, Help: "Biografische Daten", Description: "Lebensdaten und biografische Informationen"},
			{FieldName: dbmodels.AGENTS_PROFESSION_FIELD, Help: "Beruf", Description: "Beruf oder Tätigkeit der Person"},
			{FieldName: dbmodels.AGENTS_PSEUDONYMS_FIELD, Help: "Pseudonyme", Description: "Pseudonyme und alternative Namen"},
			{FieldName: dbmodels.REFERENCES_FIELD, Help: "Referenzen", Description: "Verweise auf externe Quellen und Nachschlagewerke"},
			{FieldName: dbmodels.URI_FIELD, Help: "URI", Description: "Uniform Resource Identifier (externe Referenz)"},
		},
	},
	{
		TableName:   dbmodels.SERIES_TABLE,
		Help:        "Liste aller verfügbaren Reihentitel",
		Description: "Diese Tabelle enthält alle Reihentitel, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Reihentiteln verwendet.",
		Common: []FieldHelpEntry{
			{FieldName: dbmodels.ID_FIELD, Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
			{FieldName: dbmodels.CREATED_FIELD, Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
			{FieldName: dbmodels.UPDATED_FIELD, Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
			{FieldName: dbmodels.ANNOTATION_FIELD, Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
			{FieldName: dbmodels.COMMENT_FIELD, Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
		},
		Entries: []FieldHelpEntry{
			{FieldName: dbmodels.EDITOR_FIELD, Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
			{FieldName: dbmodels.MUSENALMID_FIELD, Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
			{FieldName: dbmodels.EDITSTATE_FIELD, Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
			{FieldName: dbmodels.SERIES_TITLE_FIELD, Help: "Reihentitel", Description: "Titel der Reihe"},
			{FieldName: dbmodels.SERIES_PSEUDONYMS_FIELD, Help: "Alternative Titel", Description: "Alternative Titel und Schreibweisen"},
			{FieldName: dbmodels.REFERENCES_FIELD, Help: "Referenzen", Description: "Verweise auf externe Quellen und Nachschlagewerke"},
			{FieldName: dbmodels.SERIES_FREQUENCY_FIELD, Help: "Erscheinungsweise", Description: "Frequenz und Rhythmus der Veröffentlichung"},
		},
	},
	{
		TableName:   dbmodels.ENTRIES_TABLE,
		Help:        "Bibliographische Einträge aller verfügaben und gesuchten Almanache",
		Description: "Diese Tabelle enthält alle Einträge, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Einträgen verwendet.",
		Common: []FieldHelpEntry{
			{FieldName: dbmodels.ID_FIELD, Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
			{FieldName: dbmodels.CREATED_FIELD, Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
			{FieldName: dbmodels.UPDATED_FIELD, Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
			{FieldName: dbmodels.ANNOTATION_FIELD, Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
			{FieldName: dbmodels.COMMENT_FIELD, Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
		},
		Entries: []FieldHelpEntry{
			{FieldName: dbmodels.EDITOR_FIELD, Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
			{FieldName: dbmodels.MUSENALMID_FIELD, Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
			{FieldName: dbmodels.EDITSTATE_FIELD, Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
			{FieldName: dbmodels.META_FIELD, Help: "Feldmetadaten", Description: "Metadaten zur Bearbeitung einzelner Felder"},
			{FieldName: dbmodels.PREFERRED_TITLE_FIELD, Help: "Bevorzugter Titel", Description: "Haupttitel des Almanachs"},
			{FieldName: dbmodels.VARIANT_TITLE_FIELD, Help: "Titelvariation", Description: "Alternative Titelform"},
			{FieldName: dbmodels.PARALLEL_TITLE_FIELD, Help: "Paralleltitel", Description: "Titel in anderer Sprache oder Schrift"},
			{FieldName: dbmodels.TITLE_STMT_FIELD, Help: "Titelangabe", Description: "Vollständige Titelangabe vom Titelblatt"},
			{FieldName: dbmodels.SUBTITLE_STMT_FIELD, Help: "Untertitel", Description: "Untertitel und Titelzusätze"},
			{FieldName: dbmodels.INCIPIT_STMT_FIELD, Help: "Incipit", Description: "Textanfang (erste Zeilen)"},
			{FieldName: dbmodels.RESPONSIBILITY_STMT_FIELD, Help: "Verantwortlichkeitsangabe", Description: "Angaben zu Autor, Herausgeber, etc."},
			{FieldName: dbmodels.PUBLICATION_STMT_FIELD, Help: "Verlagsangabe", Description: "Verlag und Veröffentlichungsangaben"},
			{FieldName: dbmodels.PLACE_STMT_FIELD, Help: "Verlagsort", Description: "Ort der Veröffentlichung"},
			{FieldName: dbmodels.YEAR_FIELD, Help: "Erscheinungsjahr", Description: "Jahr der Veröffentlichung"},
			{FieldName: dbmodels.LANGUAGE_FIELD, Help: "Sprache", Description: "Sprache(n) des Almanachs"},
			{FieldName: dbmodels.CONTENT_TYPE_FIELD, Help: "Inhaltstyp", Description: "Art des Inhalts (Text, Musik, Bild, etc.)"},
			{FieldName: dbmodels.EXTENT_FIELD, Help: "Umfang", Description: "Seitenzahl und physischer Umfang"},
			{FieldName: dbmodels.DIMENSIONS_FIELD, Help: "Abmessungen", Description: "Physische Abmessungen des Objekts"},
			{FieldName: dbmodels.NUMBERING_FIELD, Help: "Nummerierung", Description: "Position im Inhaltsverzeichnis"},
			{FieldName: dbmodels.MEDIA_TYPE_FIELD, Help: "Medientyp", Description: "Art des Mediums (ohne Hilfsmittel, audio, etc.)"},
			{FieldName: dbmodels.CARRIER_TYPE_FIELD, Help: "Datenträgertyp", Description: "Art des physischen Trägers"},
			{FieldName: dbmodels.REFERENCES_FIELD, Help: "Referenzen", Description: "Nachweise in Bibliografien und Katalogen"},
			{FieldName: dbmodels.PLACES_TABLE, Help: "Verknüpfte Orte", Description: "Orte, die mit diesem Almanach verbunden sind"},
			{FieldName: dbmodels.MUSENALM_DEPRECATED_FIELD, Help: "Veraltete Daten", Description: "Frühere Datenversionen aus dem alten System"},
		},
	},
	{
		TableName:   dbmodels.CONTENTS_TABLE,
		Help:        "Liste aller digitalisierten Beiträge",
		Description: "Diese Tabelle enthält alle digitalisierten Beiträge, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Inhaltsbeiträgen verwendet.",
		Common: []FieldHelpEntry{
			{FieldName: dbmodels.ID_FIELD, Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
			{FieldName: dbmodels.CREATED_FIELD, Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
			{FieldName: dbmodels.UPDATED_FIELD, Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
			{FieldName: dbmodels.ANNOTATION_FIELD, Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
			{FieldName: dbmodels.COMMENT_FIELD, Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
		},
		Entries: []FieldHelpEntry{
			{FieldName: dbmodels.EDITOR_FIELD, Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
			{FieldName: dbmodels.MUSENALMID_FIELD, Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
			{FieldName: dbmodels.EDITSTATE_FIELD, Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
			{FieldName: dbmodels.ENTRIES_TABLE, Help: "Zugehöriger Band", Description: "Band, in dem dieser Inhalt erscheint"},
			{FieldName: dbmodels.PREFERRED_TITLE_FIELD, Help: "Bevorzugter Titel", Description: "Haupttitel des Beitrags"},
			{FieldName: dbmodels.VARIANT_TITLE_FIELD, Help: "Titelvariation", Description: "Alternative Titelform"},
			{FieldName: dbmodels.PARALLEL_TITLE_FIELD, Help: "Paralleltitel", Description: "Titel in anderer Sprache oder Schrift"},
			{FieldName: dbmodels.TITLE_STMT_FIELD, Help: "Titelangabe", Description: "Vollständige Titelangabe"},
			{FieldName: dbmodels.SUBTITLE_STMT_FIELD, Help: "Untertitel", Description: "Untertitel und Titelzusätze"},
			{FieldName: dbmodels.INCIPIT_STMT_FIELD, Help: "Incipit", Description: "Textanfang (erste Zeilen)"},
			{FieldName: dbmodels.RESPONSIBILITY_STMT_FIELD, Help: "Verantwortlichkeitsangabe", Description: "Angaben zu Autor, Illustrator, etc."},
			{FieldName: dbmodels.PUBLICATION_STMT_FIELD, Help: "Publikationsangabe", Description: "Angaben zur Erstveröffentlichung"},
			{FieldName: dbmodels.PLACE_STMT_FIELD, Help: "Ortsangabe", Description: "Ortsangaben im Kontext des Beitrags"},
			{FieldName: dbmodels.YEAR_FIELD, Help: "Jahr", Description: "Jahr des Beitrags"},
			{FieldName: dbmodels.LANGUAGE_FIELD, Help: "Sprache", Description: "Sprache(n) des Beitrags"},
			{FieldName: dbmodels.CONTENT_TYPE_FIELD, Help: "Inhaltstyp", Description: "Art des Inhalts (Gedicht, Prosa, Graphik, etc.)"},
			{FieldName: dbmodels.EXTENT_FIELD, Help: "Umfang", Description: "Seitenumfang des Beitrags"},
			{FieldName: dbmodels.DIMENSIONS_FIELD, Help: "Abmessungen", Description: "Physische Abmessungen (bei Graphiken)"},
			{FieldName: dbmodels.NUMBERING_FIELD, Help: "Nummerierung", Description: "Position im Inhaltsverzeichnis"},
			{FieldName: dbmodels.MUSENALM_INHALTE_TYPE_FIELD, Help: "Objekttyp", Description: "Kategorie des Inhaltsobjekts (Gedicht, Graphik, etc.)"},
			{FieldName: dbmodels.MUSENALM_PAGINATION_FIELD, Help: "Paginierung", Description: "Seitennummerierung (römisch, arabisch, etc.)"},
			{FieldName: dbmodels.SCAN_FIELD, Help: "Digitalisate", Description: "Verknüpfte Scans und Abbildungen"},
		},
	},
	{
		TableName:   dbmodels.ITEMS_TABLE,
		Help:        "Liste aller digitalisierten Exemplare",
		Description: "Diese Tabelle enthält alle digitalisierten Exemplare, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Exemplare verwendet.",
		Common: []FieldHelpEntry{
			{FieldName: dbmodels.ID_FIELD, Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
			{FieldName: dbmodels.CREATED_FIELD, Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
			{FieldName: dbmodels.UPDATED_FIELD, Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
			{FieldName: dbmodels.ANNOTATION_FIELD, Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
			{FieldName: dbmodels.COMMENT_FIELD, Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
		},
		Entries: []FieldHelpEntry{
			{FieldName: dbmodels.EDITOR_FIELD, Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
			{FieldName: dbmodels.EDITSTATE_FIELD, Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
			{FieldName: dbmodels.ENTRIES_TABLE, Help: "Zugehöriger Band", Description: "Band, zu dem dieses Exemplar gehört"},
			{FieldName: dbmodels.ITEMS_IDENTIFIER_FIELD, Help: "Signatur", Description: "Bibliothekssignatur oder Kennzeichen"},
			{FieldName: dbmodels.ITEMS_LOCATION_FIELD, Help: "Standort", Description: "Aufbewahrungsort des Exemplars"},
			{FieldName: dbmodels.ITEMS_OWNER_FIELD, Help: "Besitzer", Description: "Eigentümer oder besitzende Institution"},
			{FieldName: dbmodels.ITEMS_MEDIA_FIELD, Help: "Medien", Description: "Zugehörige Mediendateien"},
			{FieldName: dbmodels.SCAN_FIELD, Help: "Digitalisate", Description: "Verknüpfte Scans des Exemplars"},
			{FieldName: dbmodels.ITEMS_CONDITION_FIELD, Help: "Zustand", Description: "Erhaltungszustand und Besonderheiten"},
			{FieldName: dbmodels.URI_FIELD, Help: "URI", Description: "Uniform Resource Identifier (externe Referenz)"},
		},
	},
	{
		TableName:   "R_" + dbmodels.ENTRIES_TABLE + "_" + dbmodels.AGENTS_TABLE,
		Help:        "Liste aller Verknüpfungen von Einträgen und Personen/Körperschaften",
		Description: "Diese Tabelle enthält alle Verknüpfungen von Einträgen und Personen/Körperschaften, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Verknüpfungen verwendet.",
	},
	{
		TableName:   "R_" + dbmodels.CONTENTS_TABLE + "_" + dbmodels.AGENTS_TABLE,
		Help:        "Liste aller Verknüpfungen von Inhaltsbeiträgen und Personen/Körperschaften",
		Description: "Diese Tabelle enthält alle Verknüpfungen von Inhaltsbeiträgen und Personen/Körperschaften, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Verknüpfungen verwendet.",
	},
	{
		TableName:   "R_" + dbmodels.ENTRIES_TABLE + "_" + dbmodels.SERIES_TABLE,
		Help:        "Liste aller Verknüpfungen von Einträgen und Reihentiteln",
		Description: "Diese Tabelle enthält alle Verknüpfungen von Einträgen und Reihentiteln, die in der Musenalm-Datenbank verwendet werden. Diese Liste wird für die Erstellung von Verknüpfungen verwendet.",
	},
}

var additionalFieldHelpSeed = []FieldHelp{
	{
		TableName:   dbmodels.ENTRIES_TABLE,
		FieldName:   dbmodels.EDITION_FIELD,
		Help:        "Hinweis zur Ausgabe oder Edition.",
		Description: "Angaben zur Ausgabe, Edition oder Besonderheiten der Veroeffentlichung.",
	},
	{
		TableName:   dbmodels.ENTRIES_TABLE,
		FieldName:   dbmodels.SERIES_TABLE,
		Help:        "Verknuepfte Reihen fuer diesen Almanach.",
		Description: "Reihen, die mit diesem Almanach verbunden sind.",
	},
	{
		TableName:   dbmodels.ENTRIES_TABLE,
		FieldName:   dbmodels.AGENTS_TABLE,
		Help:        "Beteiligte Personen oder Koerperschaften.",
		Description: "Personen oder Koerperschaften, die an diesem Almanach beteiligt sind.",
	},
}

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.HTML_TABLE)
		if err != nil {
			app.Logger().Error("Could not find HTML table!", "error", err)
			return err
		}

		fieldHelps := getAllFieldHelps()

		for _, fh := range fieldHelps {
			if fh.FieldName != "" {
				// Create help entry
				helpRecord := core.NewRecord(collection)
				helpRecord.Set(dbmodels.KEY_FIELD, "help."+fh.TableName+"."+fh.FieldName)
				helpRecord.Set(dbmodels.HTML_FIELD, fh.Help)
				if err := app.Save(helpRecord); err != nil {
					app.Logger().Error("Failed to save help record", "error", err, "key", helpRecord.GetString(dbmodels.KEY_FIELD))
				}

				// Create description entry
				descRecord := core.NewRecord(collection)
				descRecord.Set(dbmodels.KEY_FIELD, "description."+fh.TableName+"."+fh.FieldName)
				descRecord.Set(dbmodels.HTML_FIELD, fh.Description)
				if err := app.Save(descRecord); err != nil {
					app.Logger().Error("Failed to save description record", "error", err, "key", descRecord.GetString(dbmodels.KEY_FIELD))
				}
			} else {
				helpRecord := core.NewRecord(collection)
				helpRecord.Set(dbmodels.KEY_FIELD, "help."+fh.TableName)
				helpRecord.Set(dbmodels.HTML_FIELD, fh.Help)
				if err := app.Save(helpRecord); err != nil {
					app.Logger().Error("Failed to save help record", "error", err, "key", helpRecord.GetString(dbmodels.KEY_FIELD))
				}

				descRecord := core.NewRecord(collection)
				descRecord.Set(dbmodels.KEY_FIELD, "description."+fh.TableName)
				descRecord.Set(dbmodels.HTML_FIELD, fh.Description)
				if err := app.Save(descRecord); err != nil {
					app.Logger().Error("Failed to save description record", "error", err, "key", descRecord.GetString(dbmodels.KEY_FIELD))
				}
			}
		}

		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.HTML_TABLE)
		if err != nil {
			return err
		}

		fieldHelps := getAllFieldHelps()

		for _, fh := range fieldHelps {
			if fh.FieldName != "" {
				// Delete help entries
				helpKey := "help." + fh.TableName + "." + fh.FieldName
				helpRecord, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, helpKey)
				if helpRecord != nil {
					app.Delete(helpRecord)
				}

				// Delete description entries
				descKey := "description." + fh.TableName + "." + fh.FieldName
				descRecord, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, descKey)
				if descRecord != nil {
					app.Delete(descRecord)
				}
			} else {
				helpkey := "help." + fh.TableName
				desckey := "description." + fh.TableName
				helpRecord, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, helpkey)
				if helpRecord != nil {
					app.Delete(helpRecord)
				}
				descRecord, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, desckey)
				if descRecord != nil {
					app.Delete(descRecord)
				}
			}
		}

		return nil
	})
}

func getAllFieldHelps() []FieldHelp {
	helps := make([]FieldHelp, 0)
	for _, table := range fieldHelpSeed {
		helps = append(helps, FieldHelp{
			TableName:   table.TableName,
			Help:        table.Help,
			Description: table.Description,
		})
		for _, entry := range table.Common {
			helps = append(helps, FieldHelp{
				TableName:   table.TableName,
				FieldName:   entry.FieldName,
				Help:        entry.Help,
				Description: entry.Description,
			})
		}
		for _, entry := range table.Entries {
			helps = append(helps, FieldHelp{
				TableName:   table.TableName,
				FieldName:   entry.FieldName,
				Help:        entry.Help,
				Description: entry.Description,
			})
		}
	}

	helps = append(helps, additionalFieldHelpSeed...)

	return helps
}
