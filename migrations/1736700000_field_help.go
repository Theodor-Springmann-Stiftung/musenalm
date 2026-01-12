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

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.HTML_TABLE)
		if err != nil {
			app.Logger().Error("Could not find HTML table!", "error", err)
			return err
		}

		fieldHelps := getAllFieldHelps()

		for _, fh := range fieldHelps {
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
		}

		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(dbmodels.HTML_TABLE)
		if err != nil {
			return err
		}

		fieldHelps := getAllFieldHelps()

		for _, fh := range fieldHelps {
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
		}

		return nil
	})
}

func getAllFieldHelps() []FieldHelp {
	helps := []FieldHelp{}

	// Common fields for all tables
	commonFields := []FieldHelp{
		{FieldName: "id", Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diesen Datensatz"},
		{FieldName: "created", Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieses Datensatzes"},
		{FieldName: "updated", Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieses Datensatzes"},
		{FieldName: "annotation", Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen und Hinweise zu diesem Datensatz"},
		{FieldName: "edit_comment", Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung und zum Bearbeitungsstatus"},
	}

	// Places table
	for _, cf := range commonFields {
		cf.TableName = dbmodels.PLACES_TABLE
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: dbmodels.PLACES_TABLE, FieldName: "editor", Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
		{TableName: dbmodels.PLACES_TABLE, FieldName: "musenalm_id", Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
		{TableName: dbmodels.PLACES_TABLE, FieldName: "edit_state", Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
		{TableName: dbmodels.PLACES_TABLE, FieldName: "name", Help: "Ortsname", Description: "Name des Ortes"},
		{TableName: dbmodels.PLACES_TABLE, FieldName: "fictional", Help: "Fiktiv", Description: "Ist dieser Ort fiktiv?"},
		{TableName: dbmodels.PLACES_TABLE, FieldName: "pseudonyms", Help: "Pseudonyme", Description: "Alternative Namen oder Pseudonyme für diesen Ort"},
		{TableName: dbmodels.PLACES_TABLE, FieldName: "uri", Help: "URI", Description: "Uniform Resource Identifier (externe Referenz)"},
	}...)

	// Agents table
	for _, cf := range commonFields {
		cf.TableName = dbmodels.AGENTS_TABLE
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "editor", Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "musenalm_id", Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "edit_state", Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "name", Help: "Name", Description: "Name der Person oder Körperschaft"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "corporate_body", Help: "Körperschaft", Description: "Handelt es sich um eine Körperschaft (Organisation)?"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "fictional", Help: "Fiktiv", Description: "Ist diese Person/Körperschaft fiktiv?"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "biographical_data", Help: "Biografische Daten", Description: "Lebensdaten und biografische Informationen"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "profession", Help: "Beruf", Description: "Beruf oder Tätigkeit der Person"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "pseudonyms", Help: "Pseudonyme", Description: "Pseudonyme und alternative Namen"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "refs", Help: "Referenzen", Description: "Verweise auf externe Quellen und Nachschlagewerke"},
		{TableName: dbmodels.AGENTS_TABLE, FieldName: "uri", Help: "URI", Description: "Uniform Resource Identifier (externe Referenz)"},
	}...)

	// Series table
	for _, cf := range commonFields {
		cf.TableName = dbmodels.SERIES_TABLE
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: dbmodels.SERIES_TABLE, FieldName: "editor", Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
		{TableName: dbmodels.SERIES_TABLE, FieldName: "musenalm_id", Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
		{TableName: dbmodels.SERIES_TABLE, FieldName: "edit_state", Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
		{TableName: dbmodels.SERIES_TABLE, FieldName: "title", Help: "Reihentitel", Description: "Titel der Reihe"},
		{TableName: dbmodels.SERIES_TABLE, FieldName: "pseudonyms", Help: "Alternative Titel", Description: "Alternative Titel und Schreibweisen"},
		{TableName: dbmodels.SERIES_TABLE, FieldName: "refs", Help: "Referenzen", Description: "Verweise auf externe Quellen und Nachschlagewerke"},
		{TableName: dbmodels.SERIES_TABLE, FieldName: "frequency", Help: "Erscheinungsweise", Description: "Frequenz und Rhythmus der Veröffentlichung"},
	}...)

	// Entries table
	for _, cf := range commonFields {
		cf.TableName = dbmodels.ENTRIES_TABLE
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "editor", Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "musenalm_id", Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "edit_state", Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "edit_fielddata", Help: "Feldmetadaten", Description: "Metadaten zur Bearbeitung einzelner Felder"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "preferred_title", Help: "Bevorzugter Titel", Description: "Haupttitel des Almanachs"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "variant_title", Help: "Titelvariation", Description: "Alternative Titelform"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "parallel_title", Help: "Paralleltitel", Description: "Titel in anderer Sprache oder Schrift"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "title_statement", Help: "Titelangabe", Description: "Vollständige Titelangabe vom Titelblatt"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "subtitle_statement", Help: "Untertitel", Description: "Untertitel und Titelzusätze"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "incipit_statement", Help: "Incipit", Description: "Textanfang (erste Zeilen)"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "responsibility_statement", Help: "Verantwortlichkeitsangabe", Description: "Angaben zu Autor, Herausgeber, etc."},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "publication_statement", Help: "Verlagsangabe", Description: "Verlag und Veröffentlichungsangaben"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "place_statement", Help: "Verlagsort", Description: "Ort der Veröffentlichung"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "year", Help: "Erscheinungsjahr", Description: "Jahr der Veröffentlichung"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "language", Help: "Sprache", Description: "Sprache(n) des Almanachs"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "content_type", Help: "Inhaltstyp", Description: "Art des Inhalts (Text, Musik, Bild, etc.)"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "extent", Help: "Umfang", Description: "Seitenzahl und physischer Umfang"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "dimensions", Help: "Abmessungen", Description: "Physische Abmessungen des Objekts"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "edition", Help: "Ausgabebezeichnung", Description: "Auflage oder Ausgabe"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "media_type", Help: "Medientyp", Description: "Art des Mediums (ohne Hilfsmittel, audio, etc.)"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "carrier_type", Help: "Datenträgertyp", Description: "Art des physischen Trägers"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "refs", Help: "Referenzen", Description: "Nachweise in Bibliografien und Katalogen"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "places", Help: "Verknüpfte Orte", Description: "Orte, die mit diesem Almanach verbunden sind"},
		{TableName: dbmodels.ENTRIES_TABLE, FieldName: "musenalm_deprecated", Help: "Veraltete Daten", Description: "Frühere Datenversionen aus dem alten System"},
	}...)

	// Contents table
	for _, cf := range commonFields {
		cf.TableName = dbmodels.CONTENTS_TABLE
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "editor", Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "musenalm_id", Help: "Musenalm ID", Description: "Interne Musenalm-Identifikationsnummer"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "edit_state", Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "entries", Help: "Zugehöriger Band", Description: "Band, in dem dieser Inhalt erscheint"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "preferred_title", Help: "Bevorzugter Titel", Description: "Haupttitel des Beitrags"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "variant_title", Help: "Titelvariation", Description: "Alternative Titelform"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "parallel_title", Help: "Paralleltitel", Description: "Titel in anderer Sprache oder Schrift"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "title_statement", Help: "Titelangabe", Description: "Vollständige Titelangabe"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "subtitle_statement", Help: "Untertitel", Description: "Untertitel und Titelzusätze"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "incipit_statement", Help: "Incipit", Description: "Textanfang (erste Zeilen)"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "responsibility_statement", Help: "Verantwortlichkeitsangabe", Description: "Angaben zu Autor, Illustrator, etc."},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "publication_statement", Help: "Publikationsangabe", Description: "Angaben zur Erstveröffentlichung"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "place_statement", Help: "Ortsangabe", Description: "Ortsangaben im Kontext des Beitrags"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "year", Help: "Jahr", Description: "Jahr des Beitrags"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "language", Help: "Sprache", Description: "Sprache(n) des Beitrags"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "content_type", Help: "Inhaltstyp", Description: "Art des Inhalts (Gedicht, Prosa, Graphik, etc.)"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "extent", Help: "Umfang", Description: "Seitenumfang des Beitrags"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "dimensions", Help: "Abmessungen", Description: "Physische Abmessungen (bei Graphiken)"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "numbering", Help: "Nummerierung", Description: "Position im Inhaltsverzeichnis"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "musenalm_type", Help: "Objekttyp", Description: "Kategorie des Inhaltsobjekts (Gedicht, Graphik, etc.)"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "musenalm_pagination", Help: "Paginierung", Description: "Seitennummerierung (römisch, arabisch, etc.)"},
		{TableName: dbmodels.CONTENTS_TABLE, FieldName: "scans", Help: "Digitalisate", Description: "Verknüpfte Scans und Abbildungen"},
	}...)

	// Items table
	for _, cf := range commonFields {
		cf.TableName = dbmodels.ITEMS_TABLE
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "editor", Help: "Bearbeiter", Description: "Person, die diesen Datensatz bearbeitet hat"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "edit_state", Help: "Bearbeitungsstatus", Description: "Aktueller Status der Bearbeitung"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "entries", Help: "Zugehöriger Band", Description: "Band, zu dem dieses Exemplar gehört"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "identifier", Help: "Signatur", Description: "Bibliothekssignatur oder Kennzeichen"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "location", Help: "Standort", Description: "Aufbewahrungsort des Exemplars"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "owner", Help: "Besitzer", Description: "Eigentümer oder besitzende Institution"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "media", Help: "Medien", Description: "Zugehörige Mediendateien"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "scans", Help: "Digitalisate", Description: "Verknüpfte Scans des Exemplars"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "condition", Help: "Zustand", Description: "Erhaltungszustand und Besonderheiten"},
		{TableName: dbmodels.ITEMS_TABLE, FieldName: "uri", Help: "URI", Description: "Uniform Resource Identifier (externe Referenz)"},
	}...)

	// R_entries_agents table
	relationCommonFields := []FieldHelp{
		{FieldName: "id", Help: "Eindeutige Identifikationsnummer", Description: "Systemgenerierte eindeutige ID für diese Relation"},
		{FieldName: "created", Help: "Erstellungsdatum", Description: "Zeitpunkt der Erstellung dieser Relation"},
		{FieldName: "updated", Help: "Aktualisierungsdatum", Description: "Zeitpunkt der letzten Änderung dieser Relation"},
		{FieldName: "annotation", Help: "Anmerkungen", Description: "Zusätzliche Anmerkungen zu dieser Relation"},
		{FieldName: "edit_comment", Help: "Bearbeitungskommentar", Description: "Kommentare zur Bearbeitung"},
	}

	for _, cf := range relationCommonFields {
		cf.TableName = "R_entries_agents"
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: "R_entries_agents", FieldName: "entries", Help: "Band", Description: "Verknüpfter Almanachband"},
		{TableName: "R_entries_agents", FieldName: "agents", Help: "Person/Körperschaft", Description: "Verknüpfte Person oder Körperschaft"},
		{TableName: "R_entries_agents", FieldName: "type", Help: "Relationstyp", Description: "Art der Beziehung (Autor, Herausgeber, etc.)"},
		{TableName: "R_entries_agents", FieldName: "conjecture", Help: "Vermutung", Description: "Ist diese Zuordnung eine Vermutung?"},
		{TableName: "R_entries_agents", FieldName: "uncertain", Help: "Unsicher", Description: "Ist diese Zuordnung unsicher?"},
	}...)

	// R_contents_agents table
	for _, cf := range relationCommonFields {
		cf.TableName = "R_contents_agents"
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: "R_contents_agents", FieldName: "contents", Help: "Inhalt", Description: "Verknüpfter Inhaltsbeitrag"},
		{TableName: "R_contents_agents", FieldName: "agents", Help: "Person/Körperschaft", Description: "Verknüpfte Person oder Körperschaft"},
		{TableName: "R_contents_agents", FieldName: "type", Help: "Relationstyp", Description: "Art der Beziehung (Autor, Stecher, etc.)"},
		{TableName: "R_contents_agents", FieldName: "conjecture", Help: "Vermutung", Description: "Ist diese Zuordnung eine Vermutung?"},
		{TableName: "R_contents_agents", FieldName: "uncertain", Help: "Unsicher", Description: "Ist diese Zuordnung unsicher?"},
	}...)

	// R_entries_series table
	for _, cf := range relationCommonFields {
		cf.TableName = "R_entries_series"
		helps = append(helps, cf)
	}
	helps = append(helps, []FieldHelp{
		{TableName: "R_entries_series", FieldName: "entries", Help: "Band", Description: "Verknüpfter Almanachband"},
		{TableName: "R_entries_series", FieldName: "series", Help: "Reihe", Description: "Verknüpfter Reihentitel"},
		{TableName: "R_entries_series", FieldName: "type", Help: "Relationstyp", Description: "Art der Beziehung (Bevorzugter Titel, Alternative, etc.)"},
		{TableName: "R_entries_series", FieldName: "conjecture", Help: "Vermutung", Description: "Ist diese Zuordnung eine Vermutung?"},
		{TableName: "R_entries_series", FieldName: "uncertain", Help: "Unsicher", Description: "Ist diese Zuordnung unsicher?"},
	}...)

	return helps
}
