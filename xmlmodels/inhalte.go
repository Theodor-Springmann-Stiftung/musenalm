package xmlmodels

import "encoding/xml"

type Inhalte struct {
	XMLName xml.Name `xml:"dataroot"`
	Inhalte []Inhalt `xml:"Inhalte"`
}

type Inhalt struct {
	ID            string `xml:"ID"`
	Titelangabe   string `xml:"TITEL"`
	Urheberangabe string `xml:"AUTOR"`
	Band          string `xml:"BAND"`
	Objektnummer  string `xml:"OBJEKTNUMMER"`
	Incipit       string `xml:"INCIPIT"`
	Paginierung   string `xml:"PAGINIERUNG"`
	Typ           Typ    `xml:"TYP"`
	Anmerkungen   string `xml:"ANMERKUNGEN"`
	Seite         string `xml:"SEITE"`
}

type Typ struct {
	Value []string `xml:"Value"`
}
