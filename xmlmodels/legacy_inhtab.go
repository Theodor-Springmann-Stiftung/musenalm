package xmlmodels

import "encoding/xml"

type LegacyINHTab struct {
	XMLName xml.Name          `xml:"dataroot"`
	Rows    []LegacyINHTabRow `xml:"INH-TAB"`
}

type LegacyINHTabRow struct {
	ID              int     `xml:"ID"`
	Autor           string  `xml:"AUTOR"`
	Titel           string  `xml:"TITEL"`
	Seite           float64 `xml:"SEITE"`
	Incipit         string  `xml:"INCIPIT"`
	INHNR           int     `xml:"INHNR"`
	AnmerkungInhalt string  `xml:"ANMERKINH"`
	Objekt          string  `xml:"OBJEKT"`
	AutorRealname   string  `xml:"AUTORREALNAME"`
	Paginierung     string  `xml:"PAG"`
	Objektzaehl     float64 `xml:"OBJZAEHL"`
	Bild            bool    `xml:"BILD"`
}
