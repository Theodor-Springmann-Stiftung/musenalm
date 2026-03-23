package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
)

type AgentResolver struct {
	app        core.App
	collection *core.Collection
	byName     map[string]*dbmodels.Agent
	byID       map[string]*dbmodels.Agent
}

func NewAgentResolver(
	app core.App,
	byName map[string]*dbmodels.Agent,
	byID map[string]*dbmodels.Agent,
) (*AgentResolver, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		return nil, err
	}

	return &AgentResolver{
		app:        app,
		collection: collection,
		byName:     byName,
		byID:       byID,
	}, nil
}

func ParseAgentNames(raw string) []string {
	normalized := normalizeAgentString(raw)
	if normalized == "" {
		return nil
	}

	replacer := strings.NewReplacer(
		"; u. ", "|",
		" u. ", "|",
		" u ", "|",
		" und ", "|",
		" & ", "|",
	)

	parts := strings.Split(replacer.Replace(normalized), "|")
	seen := map[string]bool{}
	ret := []string{}

	for _, part := range parts {
		name := normalizeAgentName(part)
		if shouldSkipAgentName(name) || seen[name] {
			continue
		}
		seen[name] = true
		ret = append(ret, name)
	}

	return ret
}

func normalizeAgentString(raw string) string {
	return strings.Join(strings.Fields(NormalizeString(raw)), " ")
}

func normalizeAgentName(raw string) string {
	name := normalizeAgentString(raw)
	name = strings.Trim(name, " ,;")
	return strings.TrimSpace(name)
}

func shouldSkipAgentName(name string) bool {
	switch strings.ToLower(normalizeAgentName(name)) {
	case "", "unbezeichnet", "unbekannt", "unleserlich":
		return true
	default:
		return false
	}
}

func (r *AgentResolver) ResolveRaw(raw string, createMissing bool) ([]*dbmodels.Agent, error) {
	return r.ResolveNames(ParseAgentNames(raw), createMissing)
}

func (r *AgentResolver) ResolveNames(names []string, createMissing bool) ([]*dbmodels.Agent, error) {
	ret := []*dbmodels.Agent{}
	seen := map[string]bool{}

	for _, name := range names {
		agent, err := r.resolveOne(name, createMissing)
		if err != nil {
			return nil, err
		}
		if agent == nil || seen[agent.Id] {
			continue
		}

		seen[agent.Id] = true
		ret = append(ret, agent)
	}

	return ret, nil
}

func (r *AgentResolver) resolveOne(name string, createMissing bool) (*dbmodels.Agent, error) {
	name = normalizeAgentName(name)
	if shouldSkipAgentName(name) {
		return nil, nil
	}

	if agent, ok := r.byName[name]; ok {
		return agent, nil
	}

	record, err := r.app.FindFirstRecordByData(dbmodels.AGENTS_TABLE, dbmodels.AGENTS_NAME_FIELD, name)
	if err == nil && record != nil {
		agent := dbmodels.NewAgent(record)
		r.byName[name] = agent
		r.byID[agent.Id] = agent
		return agent, nil
	}

	if !createMissing {
		return nil, nil
	}

	agent := dbmodels.NewAgent(core.NewRecord(r.collection))
	agent.SetName(name)
	agent.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])

	if err := r.app.Save(agent); err != nil {
		return nil, err
	}

	r.byName[name] = agent
	r.byID[agent.Id] = agent

	return agent, nil
}

func LegacyRowsByINHNR(legacy map[int][]xmlmodels.LegacyINHTabRow) map[int]xmlmodels.LegacyINHTabRow {
	ret := make(map[int]xmlmodels.LegacyINHTabRow)

	for _, rows := range legacy {
		for _, row := range rows {
			ret[row.INHNR] = row
		}
	}

	return ret
}

func InferFallbackContentAgentRelationType(content *dbmodels.Content) string {
	categories := content.MusenalmType()
	if len(categories) == 0 {
		return "Autor:in"
	}

	if containsCategory(categories, isGraph) {
		return "Künstler:in"
	}

	if containsCategory(categories, isMusic) {
		return "Komponist:in"
	}

	return "Autor:in"
}

func containsCategory(categories []string, predicate func(string) bool) bool {
	for _, category := range categories {
		if predicate(category) {
			return true
		}
	}

	return false
}

func RecordsFromFallbackContentsAgents(
	app core.App,
	contentsByID map[string]*dbmodels.Content,
	existing map[string][]*dbmodels.RContentsAgents,
	legacyByINHNR map[int]xmlmodels.LegacyINHTabRow,
	resolver *AgentResolver,
) ([]*dbmodels.RContentsAgents, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
	if err != nil {
		return nil, err
	}

	records := []*dbmodels.RContentsAgents{}

	for _, content := range contentsByID {
		if len(existing[content.Id]) > 0 {
			continue
		}

		rawNames := content.ResponsibilityStmt()
		createMissing := false

		if legacyRow, ok := legacyByINHNR[content.MusenalmID()]; ok {
			if normalizeAgentString(legacyRow.AutorRealname) != "" {
				rawNames = legacyRow.AutorRealname
				createMissing = true
			} else {
				rawNames = legacyRow.Autor
			}
		}

		agents, err := resolver.ResolveRaw(rawNames, createMissing)
		if err != nil {
			return nil, err
		}
		if len(agents) == 0 {
			continue
		}

		relationType := InferFallbackContentAgentRelationType(content)
		for _, agent := range agents {
			record := dbmodels.NewRContentsAgents(core.NewRecord(collection))
			record.SetContent(content.Id)
			record.SetAgent(agent.Id)
			record.SetType(relationType)

			records = append(records, record)
			existing[content.Id] = append(existing[content.Id], record)
		}
	}

	return records, nil
}

func RecordsFromFallbackEntriesAgents(
	app core.App,
	entriesByID map[string]*dbmodels.Entry,
	existing map[string][]*dbmodels.REntriesAgents,
	resolver *AgentResolver,
) ([]*dbmodels.REntriesAgents, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE))
	if err != nil {
		return nil, err
	}

	records := []*dbmodels.REntriesAgents{}

	for _, entry := range entriesByID {
		if len(existing[entry.Id]) > 0 {
			continue
		}

		agents, err := resolver.ResolveRaw(entry.ResponsibilityStmt(), false)
		if err != nil {
			return nil, err
		}
		if len(agents) == 0 {
			continue
		}

		for _, agent := range agents {
			record := dbmodels.NewREntriesAgents(core.NewRecord(collection))
			record.SetEntry(entry.Id)
			record.SetAgent(agent.Id)
			record.SetType("Herausgeber:in")

			records = append(records, record)
			existing[entry.Id] = append(existing[entry.Id], record)
		}
	}

	return records, nil
}
