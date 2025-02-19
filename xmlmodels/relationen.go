package xmlmodels

import "encoding/xml"

type Relationen_Bände_Reihen struct {
	XMLName    xml.Name              `xml:"dataroot"`
	Relationen []Relation_Band_Reihe `xml:"_x002A_RELATION_BaendeReihen"`
}

type Relation_Band_Reihe struct {
	ID       int    `xml:"ID"`
	Band     int    `xml:"BAND"`
	Relation string `xml:"BEZIEHUNG"`
	Reihe    int    `xml:"REIHE"`
}

type Relationen_Inhalte_Akteure struct {
	XMLName    xml.Name                 `xml:"dataroot"`
	Relationen []Relation_Inhalt_Akteur `xml:"_x002A_RELATION_InhalteAkteure"`
}

type Relation_Inhalt_Akteur struct {
	ID       int    `xml:"ID"`
	Inhalt   int    `xml:"INHALT"`
	Relation string `xml:"BEZIEHUNG"`
	Akteur   int    `xml:"AKTEUR"`
}

type Relationen_Bände_Akteure struct {
	XMLName    xml.Name               `xml:"dataroot"`
	Relationen []Relation_Band_Akteur `xml:"_x002A_RELATION_BaendeAkteure"`
}

type Relation_Band_Akteur struct {
	ID       int    `xml:"ID"`
	Band     int    `xml:"BAND"`
	Relation string `xml:"BEZIEHUNG"`
	Akteur   int    `xml:"AKTEUR"`
}
