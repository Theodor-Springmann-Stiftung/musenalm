package xmlmodels

import "encoding/xml"

type Bände struct {
	XMLName xml.Name `xml:"dataroot"`
	Bände   []Band   `xml:"Baende"`
}

type Band struct {
	ID                        int          `xml:"ID"`
	BiblioID                  int          `xml:"BIBLIO-ID"`
	Titelangabe               string       `xml:"TITEL"`
	Ortsangabe                string       `xml:"ORT-ALT"`
	Orte                      []Ortverweis `xml:"ORTE"`
	Verantwortlichkeitsangabe string       `xml:"HERAUSGEBER"`
	Jahr                      int          `xml:"JAHR"`
	Gesichtet                 bool         `xml:"AUTOPSIE"`
	Erfasst                   bool         `xml:"ERFASST"`
	Nachweis                  string       `xml:"NACHWEIS"`
	Struktur                  string       `xml:"STRUKTUR"`
	Norm                      string       `xml:"NORM"`
	Status                    Status       `xml:"STATUS"`
	Anmerkungen               string       `xml:"ANMERKUNGEN"`
	ReihentitelALT            string       `xml:"REIHENTITEL-ALT"`
}

type Ortverweis struct {
	Value int `xml:"Value"`
}

type Status struct {
	Value []string `xml:"Value"`
}
