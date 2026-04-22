package xmlmodels

import (
	"encoding/xml"
	"testing"
)

func TestRealnameTabUnmarshal(t *testing.T) {
	const src = `<?xml version="1.0" encoding="UTF-8"?>
<dataroot>
<REALNAME-Tab>
<REALNAME>Doe, Jane</REALNAME>
<Daten>1800-1850</Daten>
<Nachweis>Ref 1</Nachweis>
<Beitrag>Text u. Hrsg</Beitrag>
<Pseudonym>Anon</Pseudonym>
</REALNAME-Tab>
</dataroot>`

	var data RealnameTab
	if err := xml.Unmarshal([]byte(src), &data); err != nil {
		t.Fatalf("unmarshal failed: %v", err)
	}

	if len(data.Rows) != 1 {
		t.Fatalf("expected 1 row, got %d", len(data.Rows))
	}

	row := data.Rows[0]
	if row.Realname != "Doe, Jane" || row.Daten != "1800-1850" || row.Nachweis != "Ref 1" || row.Beitrag != "Text u. Hrsg" || row.Pseudonym != "Anon" {
		t.Fatalf("unexpected row: %+v", row)
	}
}
