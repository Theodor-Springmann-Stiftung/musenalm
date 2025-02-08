package xmlmodels

import "encoding/xml"

type Reihentitel struct {
	XMLName xml.Name `xml:"dataroot"`
	Reihen  []Reihe  `xml:"Reihen"`
}

type Reihe struct {
	ID          string `xml:"ID"`
	Titel       string `xml:"NAME"`
	Sortiername string `xml:"SORTIERNAME"`
	Nachweis    string `xml:"NACHWEIS"`
	Anmerkungen string `xml:"Anmerkungen"`
}

func SanitizeReihen(reihentitel Reihentitel, relationen Relationen_Bände_Reihen) Reihentitel {
	m := make(map[string]bool)
	o := Reihentitel{
		Reihen: []Reihe{},
	}

	for _, r := range relationen.Relationen {
		m[r.Reihe] = true
	}

	for i := 0; i < len(reihentitel.Reihen); i++ {
		if _, ok := m[reihentitel.Reihen[i].ID]; ok {
			o.Reihen = append(o.Reihen, reihentitel.Reihen[i])
		}
	}

	return o
}
