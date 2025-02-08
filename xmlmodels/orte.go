package xmlmodels

import "encoding/xml"

type Orte struct {
	XMLName xml.Name `xml:"dataroot"`
	Orte    []Ort    `xml:"Orte"`
}

type Ort struct {
	ID          string `xml:"ID"`
	Name        string `xml:"NAME"`
	Fiktiv      bool   `xml:"FIKTIV"`
	Anmerkungen string `xml:"Anmerkungen"`
}
