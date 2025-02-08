package xmlmodels

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
)

type AccessDB struct {
	Orte                       *Orte
	Akteure                    *Akteure
	Reihen                     *Reihentitel
	Bände                      *Bände
	Inhalte                    *Inhalte
	Relationen_Bände_Akteure   *Relationen_Bände_Akteure
	Relationen_Inhalte_Akteure *Relationen_Inhalte_Akteure
	Relationen_Bände_Reihen    *Relationen_Bände_Reihen
	BIBLIO                     *map[int]BIBLIOEintrag
}

func ReadAccessDB(path string) (*AccessDB, error) {
	var Akteure Akteure
	var Reihentitel Reihentitel
	var Bände Bände
	var Inhalte Inhalte
	var Orte Orte
	var Relationen_Bände_Akteure Relationen_Bände_Akteure
	var Relationen_Bände_Reihen Relationen_Bände_Reihen
	var Relationen_Inhalte_Akteure Relationen_Inhalte_Akteure
	var BIBLIO BIBLIOEinträge

	if err := unmarshalFile(path+"Akteure.xml", &Akteure); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"Orte.xml", &Orte); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"Reihen.xml", &Reihentitel); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"Baende.xml", &Bände); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"Inhalte.xml", &Inhalte); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"_RELATION_BaendeAkteure.xml", &Relationen_Bände_Akteure); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"_RELATION_BaendeReihen.xml", &Relationen_Bände_Reihen); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"_RELATION_InhalteAkteure.xml", &Relationen_Inhalte_Akteure); err != nil {
		return nil, err
	}

	if err := unmarshalFile(path+"GM-BIBLIO.xml", &BIBLIO); err != nil {
		return nil, err
	}

	var BIBLIOM = datatypes.MakeMap(BIBLIO.Einträge, func(e BIBLIOEintrag) int { return e.Nummer })

	lib := AccessDB{
		Orte:                       &Orte,
		Akteure:                    &Akteure,
		Reihen:                     &Reihentitel,
		Bände:                      &Bände,
		Inhalte:                    &Inhalte,
		Relationen_Bände_Akteure:   &Relationen_Bände_Akteure,
		Relationen_Bände_Reihen:    &Relationen_Bände_Reihen,
		Relationen_Inhalte_Akteure: &Relationen_Inhalte_Akteure,
		BIBLIO:                     &BIBLIOM,
	}

	return &lib, nil
}

func unmarshalFile[T any](filename string, data *T) error {
	xmlFile, err := os.Open(filename)
	if err != nil {
		fmt.Println(err)
		return err
	}
	fmt.Println("Successfully opened " + filename)
	defer xmlFile.Close()
	byteValue, _ := io.ReadAll(xmlFile)
	xml.Unmarshal(byteValue, data)

	return nil
}
