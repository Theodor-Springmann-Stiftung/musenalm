package xmlmodels

import (
	"encoding/xml"
	"testing"
)

func TestLegacyINHTabUnmarshal(t *testing.T) {
	const src = `<?xml version="1.0" encoding="UTF-8"?>
<dataroot>
<INH-TAB>
<ID>865</ID>
<AUTOR>unbezeichnet</AUTOR>
<TITEL>I. und II.</TITEL>
<SEITE>103.001</SEITE>
<INCIPIT>Den Gegenstand dieser Darstellungen geben die Unterschriften hinlänglich zu erkennen.</INCIPIT>
<INHNR>58873</INHNR>
<ANMERKINH>Erklärung der Kupfer</ANMERKINH>
<OBJEKT>Text</OBJEKT>
<AUTORREALNAME></AUTORREALNAME>
<PAG>ar1</PAG>
<OBJZAEHL>22</OBJZAEHL>
<BILD>0</BILD>
</INH-TAB>
</dataroot>`

	var data LegacyINHTab
	if err := xml.Unmarshal([]byte(src), &data); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if len(data.Rows) != 1 {
		t.Fatalf("expected 1 row, got %d", len(data.Rows))
	}

	row := data.Rows[0]
	if row.ID != 865 || row.INHNR != 58873 || row.Seite != 103.001 || row.Objektzaehl != 22 || row.Bild {
		t.Fatalf("unexpected row: %+v", row)
	}
}

func TestLegacyAlmNeuUnmarshal(t *testing.T) {
	const src = `<?xml version="1.0" encoding="UTF-8"?>
<dataroot>
<AlmNeu>
<NUMMER>1</NUMMER>
<BIBLIO-NR>100873</BIBLIO-NR>
<ALM-TITEL>Alruna</ALM-TITEL>
<REIHENTITEL>Alruna 1805</REIHENTITEL>
<ORT>Zürich</ORT>
<JAHR>1805</JAHR>
<HERAUSGEBER>Ernst Müller</HERAUSGEBER>
<BEARBEITET_x0020_AM>2007-06-06T00:00:00</BEARBEITET_x0020_AM>
<BEARBEITET_x0020_VON>ms</BEARBEITET_x0020_VON>
<ANMERKUNGEN>Hinweis</ANMERKUNGEN>
<AUTOPSIE>1</AUTOPSIE>
<VORHANDEN>1</VORHANDEN>
<VORHANDEN_x0020_ALS>Original</VORHANDEN_x0020_ALS>
<NACHWEIS>K 22</NACHWEIS>
<STRUKTUR>VB</STRUKTUR>
<NORM>~</NORM>
<ID>42</ID>
<VOLLSTÄNDIG_x0020_ERFASST>1</VOLLSTÄNDIG_x0020_ERFASST>
<HRSGREALNAME>Müller</HRSGREALNAME>
</AlmNeu>
</dataroot>`

	var data LegacyAlmNeu
	if err := xml.Unmarshal([]byte(src), &data); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if len(data.Rows) != 1 {
		t.Fatalf("expected 1 row, got %d", len(data.Rows))
	}

	row := data.Rows[0]
	if row.BiblioNr != 100873 || row.ID != 42 || !row.Autopsie || !row.VollstaendigErfasst {
		t.Fatalf("unexpected row: %+v", row)
	}
}
