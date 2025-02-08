package xmlmodels

import "encoding/xml"

type Akteure struct {
	XMLName xml.Name `xml:"dataroot"`
	Akteure []Akteur `xml:"Akteure"`
}

type Akteur struct {
	ID           string `xml:"ID"`
	Name         string `xml:"NAME"`
	Körperschaft bool   `xml:"ORGANISATION"`
	Beruf        string `xml:"BERUF"`
	Nachweis     string `xml:"NACHWEIS"`
	Pseudonyme   string `xml:"PSEUDONYM"`
	Lebensdaten  string `xml:"LEBENSDATEN"`
	Anmerkungen  string `xml:"ANMERKUNGEN"`
	GND          string `xml:"GND"`
}
