package xmlmodels

import "encoding/xml"

type LegacyAlmNeu struct {
	XMLName xml.Name          `xml:"dataroot"`
	Rows    []LegacyAlmNeuRow `xml:"AlmNeu"`
}

type LegacyAlmNeuRow struct {
	Nummer              int    `xml:"NUMMER"`
	BiblioNr            int    `xml:"BIBLIO-NR"`
	AlmTitel            string `xml:"ALM-TITEL"`
	Reihentitel         string `xml:"REIHENTITEL"`
	Ort                 string `xml:"ORT"`
	Jahr                int    `xml:"JAHR"`
	Herausgeber         string `xml:"HERAUSGEBER"`
	BearbeitetAm        string `xml:"BEARBEITET_x0020_AM"`
	BearbeitetVon       string `xml:"BEARBEITET_x0020_VON"`
	Anmerkungen         string `xml:"ANMERKUNGEN"`
	Autopsie            bool   `xml:"AUTOPSIE"`
	Vorhanden           bool   `xml:"VORHANDEN"`
	VorhandenAls        string `xml:"VORHANDEN_x0020_ALS"`
	Nachweis            string `xml:"NACHWEIS"`
	Struktur            string `xml:"STRUKTUR"`
	Norm                string `xml:"NORM"`
	ID                  int    `xml:"ID"`
	VollstaendigErfasst bool   `xml:"VOLLSTÄNDIG_x0020_ERFASST"`
	HRSGRealname        string `xml:"HRSGREALNAME"`
}
