package xmlmodels

import "encoding/xml"

type BIBLIOEinträge struct {
	XMLName  xml.Name        `xml:"dataroot"`
	Einträge []BIBLIOEintrag `xml:"GM-BIBLIO"`
}

type BIBLIOEintrag struct {
	Nummer        int    `xml:"NUMMER"`
	Eingetragen   bool   `xml:"EINGETRAGEN_x003F_"`
	Gesucht       bool   `xml:"GESUCHT_x003F_"`
	Autor         string `xml:"AUTOR"`
	Herausgeber   string `xml:"HERAUSGEBER"`
	Titel         string `xml:"TITEL"`
	Untertitel    string `xml:"UNTERTITEL"`
	ErschienenIn  string `xml:"ERSCHIENEN_x0020_IN"`
	Ort           string `xml:"ORT"`
	Jahr          int    `xml:"JAHR"`
	Nachweis      string `xml:"NACHWEIS"`
	Kurztitel     string `xml:"KURZTITEL"`
	Zugehörig     string `xml:"ZUGEHöRIG"`
	VorhandenAls  string `xml:"VORHANDEN_x0020_ALS"`
	Inhalt        string `xml:"INHALT"`
	Zustand       string `xml:"ZUSTAND"`
	NotizÄusseres string `xml:"NOTIZ_x0020_ÄUSSERES"`
	NotizInhalt   string `xml:"NOTIZ_x0020_INHALT"`
	Anmerkungen   string `xml:"ALLGEMEINE_x0020_BEMERKUNG"`
	Standort      string `xml:"STANDORT"`
	Unklar        bool   `xml:"UNKLAR"`
}
