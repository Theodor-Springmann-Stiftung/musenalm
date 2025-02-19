package seed

import (
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

func RecordsFromRelationInhalteAkteure(
	app core.App,
	relations xmlmodels.Relationen_Inhalte_Akteure,
	contents map[int]*dbmodels.Content,
	agents map[int]*dbmodels.Agent,
) ([]*dbmodels.RContentsAgents, error) {
	records := make([]*dbmodels.RContentsAgents, 0, len(relations.Relationen))
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
	if err != nil {
		app.Logger().Error("Error finding collection", "error", err, "collection", dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
		return nil, err
	}

	for _, relation := range relations.Relationen {
		content, ok := contents[relation.Inhalt]
		if !ok {
			app.Logger().Error("Error finding Content", "error", err, "relation", relation)
			continue
		}

		agent, ok := agents[relation.Akteur]
		if !ok {
			app.Logger().Error("Error finding Agent", "error", err, "relation", relation)
			continue
		}

		record := dbmodels.NewRContentsAgents(core.NewRecord(collection))
		record.SetContent(content.Id)
		record.SetAgent(agent.Id)

		switch relation.Relation {
		case "1":
			record.SetType("Schöpfer")
			cat := content.MusenalmType()
			ber := agent.Profession()
			probt := 0
			probm := 0
			probg := 0

			if slices.ContainsFunc(cat, isProse) {
				probt += 1
			} else {
				probt -= 1
			}

			if Text(ber) {
				if probt > 0 {
					probt += 1
				}
				probt += 1
			}

			if slices.ContainsFunc(cat, isMusic) {
				probm += 1
			} else {
				probm -= 1
			}
			if Musik(ber) {
				if probm > 0 {
					probm += 1
				}
				probm += 1
			}

			if slices.ContainsFunc(cat, isGraph) {
				probg += 1
			} else {
				probg -= 1
			}
			if Graphiker(ber) {
				if probg > 0 {
					probg += 1
				}
				probg += 1
			}

			if probt == 3 && probm <= 1 && probg <= 1 {
				record.SetType("Autor:in")
				break
			}

			if probm == 3 && probt <= 1 && probg <= 1 {
				record.SetType("Komponist:in")
				break
			}

			if probg == 3 && probt <= 1 && probm <= 1 {
				record.SetType("Künstler:in")
				break
			}

			record.SetType("Schöpfer")
		case "2":
			record.SetType("Autor:in")
		case "3":
			record.SetType("Herausgeber:in")
		case "4":
			record.SetType("Verlag")
		}

		rel := record.Type()
		ent := record.Content()
		ser := record.Agent()

		if strings.TrimSpace(rel) == "" || strings.TrimSpace(ent) == "" || strings.TrimSpace(ser) == "" {
			content.Set(dbmodels.EDITSTATE_FIELD, dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])
			_ = app.Save(content)
		}

		records = append(records, record)
	}

	return records, err
}

func isProse(cat string) bool {
	return cat == "Corrigenda" || cat == "Gedicht/Lied" || cat == "Motto" || cat == "Kalendarium" || cat == "Tabelle" || cat == "Inhaltsverzeichnis" || cat == "Text" || cat == "Prosa"
}

func isGraph(cat string) bool {
	return strings.HasPrefix(cat, "graph") || cat == "Graphik"
}

func Graphiker(beruf string) bool {
	return strings.Contains(beruf, "Graphik")
}

func Text(beruf string) bool {
	return strings.Contains(beruf, "Text")
}

func Musik(beruf string) bool {
	return strings.Contains(beruf, "Musik")
}

func isMusic(cat string) bool {
	return cat == "Gedicht/Lied" || cat == "Musikbeigabe"
}
