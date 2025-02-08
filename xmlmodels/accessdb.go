package xmlmodels

import (
	"encoding/xml"
	"fmt"
	"io"
	"log/slog"
	"os"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
)

type AccessDB struct {
	Orte                       Orte
	Akteure                    Akteure
	Reihen                     Reihentitel
	Bände                      Bände
	Inhalte                    Inhalte
	Relationen_Bände_Akteure   Relationen_Bände_Akteure
	Relationen_Inhalte_Akteure Relationen_Inhalte_Akteure
	Relationen_Bände_Reihen    Relationen_Bände_Reihen
	BIBLIO                     map[int]BIBLIOEintrag
}

func ReadAccessDB(path string, logger *slog.Logger) (*AccessDB, error) {
	var Akteure Akteure
	var Reihentitel Reihentitel
	var Bände Bände
	var Inhalte Inhalte
	var Orte Orte
	var Relationen_Bände_Akteure Relationen_Bände_Akteure
	var Relationen_Bände_Reihen Relationen_Bände_Reihen
	var Relationen_Inhalte_Akteure Relationen_Inhalte_Akteure
	var BIBLIO BIBLIOEinträge

	var DB AccessDB
	wg := sync.WaitGroup{}
	wg.Add(9)

	go func() {
		if err := unmarshalFile(path+"GM-BIBLIO.xml", &BIBLIO); err != nil {
			logger.Error("Error while unmarshalling GM-BIBLIO.xml: ", "error", err, "path", path+"GM-BIBLIO.xml")
		}
		DB.BIBLIO = datatypes.MakeMap(BIBLIO.Einträge, func(e BIBLIOEintrag) int { return e.Nummer })
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"Akteure.xml", &Akteure); err != nil {
			logger.Error("Error while unmarshalling Akteure.xml: ", "error", err, "path", path+"Akteure.xml")
		}
		DB.Akteure = Akteure
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"Orte.xml", &Orte); err != nil {
			logger.Error("Error while unmarshalling Orte.xml: ", "error", err, "path", path+"Orte.xml")
		}
		DB.Orte = Orte
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"Reihen.xml", &Reihentitel); err != nil {
			logger.Error("Error while unmarshalling Reihen.xml: ", "error", err, "path", path+"Reihen.xml")
		}
		DB.Reihen = Reihentitel
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"Baende.xml", &Bände); err != nil {
			logger.Error("Error while unmarshalling Baende.xml: ", "error", err, "path", path+"Baende.xml")
		}
		DB.Bände = Bände
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"Inhalte.xml", &Inhalte); err != nil {
			logger.Error("Error while unmarshalling Inhalte.xml: ", "error", err, "path", path+"Inhalte.xml")
		}
		DB.Inhalte = Inhalte
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"_RELATION_BaendeAkteure.xml", &Relationen_Bände_Akteure); err != nil {
			logger.Error("Error while unmarshalling RELATION_BaendeAkteure.xml: ", "error", err, "path", path+"_RELATION_BaendeAkteure.xml")
		}
		DB.Relationen_Bände_Akteure = Relationen_Bände_Akteure
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"_RELATION_BaendeReihen.xml", &Relationen_Bände_Reihen); err != nil {
			logger.Error("Error while unmarshalling RELATION_BaendeReihen.xml: ", "error", err, "path", path+"_RELATION_BaendeReihen.xml")
		}
		DB.Relationen_Bände_Reihen = Relationen_Bände_Reihen
		wg.Done()
	}()

	go func() {
		if err := unmarshalFile(path+"_RELATION_InhalteAkteure.xml", &Relationen_Inhalte_Akteure); err != nil {
			logger.Error("Error while unmarshalling RELATION_InhalteAkteure.xml: ", "error", err, "path", path+"_RELATION_InhalteAkteure.xml")
		}
		DB.Relationen_Inhalte_Akteure = Relationen_Inhalte_Akteure
		wg.Done()
	}()

	wg.Wait()

	if len(DB.BIBLIO) == 0 || len(DB.Akteure.Akteure) == 0 || len(DB.Orte.Orte) == 0 || len(DB.Reihen.Reihen) == 0 || len(DB.Bände.Bände) == 0 || len(DB.Inhalte.Inhalte) == 0 || len(DB.Relationen_Bände_Akteure.Relationen) == 0 || len(DB.Relationen_Bände_Reihen.Relationen) == 0 || len(DB.Relationen_Inhalte_Akteure.Relationen) == 0 {
		return nil, fmt.Errorf("Source files could not be read")
	}

	return &DB, nil
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
