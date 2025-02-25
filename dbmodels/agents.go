package dbmodels

import (
	"slices"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/text/collate"
	"golang.org/x/text/language"
)

type AgentsEntries map[string][]*REntriesAgents
type AgentsContents map[string][]*RContentsAgents

func AgentForId(app core.App, id string) (*Agent, error) {
	agent := &Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.HashExp{ID_FIELD: id}).
		One(agent)
	if err != nil {
		return nil, err
	}
	return agent, nil
}

func FTS5SearchAgents(app core.App, query string) ([]*Agent, error) {
	a := []*Agent{}
	q := NormalizeQuery(query)
	if len(q) == 0 {
		return a, nil
	}

	ids, err := FTS5Search(app, AGENTS_TABLE, FTS5QueryRequest{
		Fields: []string{AGENTS_NAME_FIELD, AGENTS_PSEUDONYMS_FIELD, REFERENCES_FIELD, AGENTS_BIOGRAPHICAL_DATA_FIELD, ANNOTATION_FIELD},
		Query:  q,
	})

	if err != nil {
		return nil, err
	}

	idany := []any{}
	for _, id := range ids {
		idany = append(idany, id.ID)
	}

	err = app.RecordQuery(AGENTS_TABLE).
		Where(dbx.HashExp{ID_FIELD: idany}).
		All(&a)
	if err != nil {
		return nil, err
	}

	return a, nil
}

func AgentsForEntries(app core.App, entries []*Entry) (map[string]*Agent, AgentsEntries, error) {
	eids := []any{}
	for _, e := range entries {
		eids = append(eids, e.Id)
	}

	relations := []*REntriesAgents{}
	err := app.RecordQuery(RelationTableName(ENTRIES_TABLE, AGENTS_TABLE)).
		Where(dbx.HashExp{ENTRIES_TABLE: eids}).
		All(&relations)
	if err != nil {
		return nil, nil, err
	}

	agentIds := []any{}
	for _, r := range relations {
		agentIds = append(agentIds, r.Agent())
	}

	agents := []*Agent{}
	err = app.RecordQuery(AGENTS_TABLE).
		Where(dbx.HashExp{ID_FIELD: agentIds}).
		All(&agents)
	if err != nil {
		return nil, nil, err
	}

	agentsMap := make(map[string]*Agent, len(agents))
	for _, a := range agents {
		agentsMap[a.Id] = a
	}

	relationMap := make(map[string][]*REntriesAgents, len(entries))
	for _, r := range relations {
		relationMap[r.Entry()] = append(relationMap[r.Entry()], r)
	}

	return agentsMap, relationMap, nil
}

func AgentsForContents(app core.App, contents []*Content) (map[string]*Agent, AgentsContents, error) {
	cids := []any{}
	for _, c := range contents {
		cids = append(cids, c.Id)
	}

	relations := []*RContentsAgents{}
	err := app.RecordQuery(RelationTableName(CONTENTS_TABLE, AGENTS_TABLE)).
		Where(dbx.HashExp{CONTENTS_TABLE: cids}).
		All(&relations)
	if err != nil {
		return nil, nil, err
	}

	agentIds := []any{}
	for _, r := range relations {
		agentIds = append(agentIds, r.Agent())
	}

	agents := []*Agent{}
	err = app.RecordQuery(AGENTS_TABLE).
		Where(dbx.HashExp{ID_FIELD: agentIds}).
		All(&agents)
	if err != nil {
		return nil, nil, err
	}

	agentsMap := make(map[string]*Agent, len(agents))
	for _, a := range agents {
		agentsMap[a.Id] = a
	}

	relationMap := make(map[string][]*RContentsAgents, len(contents))
	for _, r := range relations {
		relationMap[r.Content()] = append(relationMap[r.Content()], r)
	}

	return agentsMap, relationMap, nil
}

func LettersForAgents(app core.App, filter string) ([]string, error) {
	letters := []core.Record{}
	ids := []string{}

	if filter == "" || filter == "noorg" {
		err := app.RecordQuery(AGENTS_TABLE).
			Select("upper(substr(" + AGENTS_NAME_FIELD + ", 1, 1)) AS id").
			Distinct(true).
			Where(dbx.HashExp{AGENTS_CORP_FIELD: false}).
			All(&letters)
		if err != nil {
			return nil, err
		}
	} else if filter == "org" {
		err := app.RecordQuery(AGENTS_TABLE).
			Select("upper(substr(" + AGENTS_NAME_FIELD + ", 1, 1)) AS id").
			Distinct(true).
			Where(dbx.HashExp{AGENTS_CORP_FIELD: true}).
			All(&letters)
		if err != nil {
			return nil, err
		}
	} else if filter == "musik" {
		err := app.RecordQuery(AGENTS_TABLE).
			Select("upper(substr(" + AGENTS_NAME_FIELD + ", 1, 1)) AS id").
			Distinct(true).
			Where(dbx.Like(AGENTS_PROFESSION_FIELD, "Musik").Match(true, true)).
			All(&letters)
		if err != nil {
			return nil, err
		}
	} else if filter == "autor" {
		err := app.RecordQuery(AGENTS_TABLE).
			Select("upper(substr(" + AGENTS_NAME_FIELD + ", 1, 1)) AS id").
			Distinct(true).
			Where(dbx.Like(AGENTS_PROFESSION_FIELD, "Text").Match(true, true)).
			All(&letters)
		if err != nil {
			return nil, err
		}
	} else if filter == "graphik" {
		err := app.RecordQuery(AGENTS_TABLE).
			Select("upper(substr(" + AGENTS_NAME_FIELD + ", 1, 1)) AS id").
			Distinct(true).
			Where(dbx.Like(AGENTS_PROFESSION_FIELD, "Graphik").Match(true, true)).
			All(&letters)
		if err != nil {
			return nil, err
		}
	} else if filter == "hrsg" {
		err := app.RecordQuery(AGENTS_TABLE).
			Select("upper(substr(" + AGENTS_NAME_FIELD + ", 1, 1)) AS id").
			Distinct(true).
			Where(dbx.Like(AGENTS_PROFESSION_FIELD, "Hrsg").Match(true, true)).
			All(&letters)
		if err != nil {
			return nil, err
		}
	}

	for _, l := range letters {
		ids = append(ids, l.GetString("id"))
	}

	collator := collate.New(language.German, collate.Loose)
	collator.SortStrings(ids)

	return ids, nil
}

func AgentsForLetter(app core.App, letter string) ([]*Agent, error) {
	agents := []*Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.Like(AGENTS_NAME_FIELD, letter).Match(false, true)).
		OrderBy(AGENTS_NAME_FIELD).
		All(&agents)
	if err != nil {
		return nil, err
	}

	return agents, nil
}

func SortAgentsByName(series []*Agent) {
	collator := collate.New(language.German, collate.Loose)
	slices.SortFunc(series, func(i, j *Agent) int {
		return collator.CompareString(i.Name(), j.Name())
	})
}

func BasicSearchAgents(app core.App, query string) ([]*Agent, []*Agent, error) {
	agents, err := TitleSearchAgents(app, query)
	if err != nil {
		return nil, nil, err
	}

	altagents, err := AltSearchAgents(app, query)
	if err != nil {
		return nil, nil, err
	}
	return agents, altagents, nil
}

func TitleSearchAgents(app core.App, query string) ([]*Agent, error) {
	agents := []*Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.Like(AGENTS_NAME_FIELD, query).Match(true, true)).
		OrWhere(dbx.Like(AGENTS_PSEUDONYMS_FIELD, query).Match(true, true)).
		OrderBy(AGENTS_NAME_FIELD).
		All(&agents)
	if err != nil {
		return nil, err
	}

	return agents, nil
}

func AltSearchAgents(app core.App, query string) ([]*Agent, error) {
	agents := []*Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.Like(ANNOTATION_FIELD, query).Match(true, true)).
		OrderBy(AGENTS_NAME_FIELD).
		All(&agents)
	if err != nil {
		return nil, err
	}

	return agents, nil
}

func AgentsForProfession(app core.App, profession string, letter string) ([]*Agent, error) {
	agents := []*Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.Like(AGENTS_NAME_FIELD, letter).Match(false, true)).
		AndWhere(dbx.Like(AGENTS_PROFESSION_FIELD, profession).Match(true, true)).
		OrderBy(AGENTS_NAME_FIELD).
		All(&agents)
	if err != nil {
		return nil, err
	}

	return agents, nil
}

func AgentsForOrg(app core.App, org bool, letter string) ([]*Agent, error) {
	agents := []*Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.Like(AGENTS_NAME_FIELD, letter).Match(false, true)).
		AndWhere(dbx.HashExp{AGENTS_CORP_FIELD: org}).
		OrderBy(AGENTS_NAME_FIELD).
		All(&agents)
	if err != nil {
		return nil, err
	}

	return agents, nil
}
