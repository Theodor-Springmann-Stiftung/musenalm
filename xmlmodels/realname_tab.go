package xmlmodels

import (
	"encoding/xml"
	"log/slog"
)

type RealnameTab struct {
	XMLName xml.Name         `xml:"dataroot"`
	Rows    []RealnameTabRow `xml:"REALNAME-Tab"`
}

type RealnameTabRow struct {
	Realname  string `xml:"REALNAME"`
	Daten     string `xml:"Daten"`
	Nachweis  string `xml:"Nachweis"`
	Beitrag   string `xml:"Beitrag"`
	Pseudonym string `xml:"Pseudonym"`
}

func ReadRealnameTab(path string, logger *slog.Logger) (*RealnameTab, error) {
	var data RealnameTab

	if err := unmarshalFileStrict(path+REALNAME_TAB_FN, &data); err != nil {
		logger.Error("Error while unmarshalling REALNAME-Tab.xml", "error", err, "path", path+REALNAME_TAB_FN)
		return nil, err
	}

	return &data, nil
}
