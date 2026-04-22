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
	nextFreeID int
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

	nextFreeID, err := nextFreeAgentMusenalmID(app, byID)
	if err != nil {
		return nil, err
	}

	return &AgentResolver{
		app:        app,
		collection: collection,
		byName:     byName,
		byID:       byID,
		nextFreeID: nextFreeID,
	}, nil
}

func nextFreeAgentMusenalmID(app core.App, byID map[string]*dbmodels.Agent) (int, error) {
	maxID := 0
	for _, agent := range byID {
		if agent == nil {
			continue
		}
		if id := agent.MusenalmID(); id > maxID {
			maxID = id
		}
	}

	var row struct {
		MusenalmID int `db:"musenalm_id"`
	}
	err := app.RecordQuery(dbmodels.AGENTS_TABLE).
		Select(dbmodels.MUSENALMID_FIELD).
		OrderBy(dbmodels.MUSENALMID_FIELD + " DESC").
		Limit(1).
		One(&row)
	if err == nil && row.MusenalmID > maxID {
		maxID = row.MusenalmID
	}

	return maxID + 1, nil
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

func (r *AgentResolver) LookupByName(name string) *dbmodels.Agent {
	name = normalizeAgentName(name)
	if shouldSkipAgentName(name) {
		return nil
	}

	if agent, ok := r.byName[name]; ok {
		return agent
	}

	record, err := r.app.FindFirstRecordByData(dbmodels.AGENTS_TABLE, dbmodels.AGENTS_NAME_FIELD, name)
	if err != nil || record == nil {
		return nil
	}

	agent := dbmodels.NewAgent(record)
	r.byName[name] = agent
	r.byID[agent.Id] = agent
	return agent
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
	agent.SetMusenalmID(r.nextFreeID)
	agent.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])

	if err := r.app.Save(agent); err != nil {
		return nil, err
	}

	r.nextFreeID++

	r.byName[name] = agent
	r.byID[agent.Id] = agent

	return agent, nil
}

func (r *AgentResolver) CreateAgentFromRealname(row xmlmodels.RealnameTabRow) (*dbmodels.Agent, error) {
	name := normalizeAgentName(row.Realname)
	if shouldSkipAgentName(name) {
		return nil, nil
	}

	if existing := r.LookupByName(name); existing != nil {
		return existing, nil
	}

	agent := dbmodels.NewAgent(core.NewRecord(r.collection))
	agent.SetName(name)
	agent.SetBiographicalData(NormalizeString(row.Daten))
	agent.SetReferences(NormalizeString(row.Nachweis))
	agent.SetProfession(NormalizeString(row.Beitrag))
	agent.SetPseudonyms(NormalizeString(row.Pseudonym))
	agent.SetMusenalmID(r.nextFreeID)
	agent.SetEditState(dbmodels.EDITORSTATE_VALUES[len(dbmodels.EDITORSTATE_VALUES)-2])

	if err := r.app.Save(agent); err != nil {
		return nil, err
	}

	r.nextFreeID++
	r.byName[name] = agent
	r.byID[agent.Id] = agent

	return agent, nil
}

func LegacyRowsByINHNR(legacy map[int]LegacyBandMatch) map[int]xmlmodels.LegacyINHTabRow {
	ret := make(map[int]xmlmodels.LegacyINHTabRow)

	for _, match := range legacy {
		for _, row := range match.Rows {
			ret[row.INHNR] = row
		}
	}

	return ret
}

type RealnameResolver struct {
	byName map[string]xmlmodels.RealnameTabRow
}

func NewRealnameResolver(data *xmlmodels.RealnameTab) *RealnameResolver {
	ret := &RealnameResolver{byName: make(map[string]xmlmodels.RealnameTabRow)}
	if data == nil {
		return ret
	}

	for _, row := range data.Rows {
		name := normalizeAgentName(row.Realname)
		if shouldSkipAgentName(name) {
			continue
		}
		if _, ok := ret.byName[name]; !ok {
			ret.byName[name] = row
		}
	}

	return ret
}

func (r *RealnameResolver) Lookup(name string) (xmlmodels.RealnameTabRow, bool) {
	if r == nil {
		return xmlmodels.RealnameTabRow{}, false
	}

	row, ok := r.byName[normalizeAgentName(name)]
	return row, ok
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

func legacyAuthorNameParts(raw string) []string {
	exact := normalizeAgentName(raw)
	if shouldSkipAgentName(exact) {
		return nil
	}

	if !(strings.Contains(exact, " u ") ||
		strings.Contains(exact, " u. ") ||
		strings.Contains(exact, ";") ||
		strings.Contains(exact, " & ")) {
		return []string{exact}
	}

	return ParseAgentNames(exact)
}

func RecordsFromLegacyContentsAgents(
	app core.App,
	contentsByMusenalmID map[int]*dbmodels.Content,
	existing map[string][]*dbmodels.RContentsAgents,
	legacyData *xmlmodels.LegacyFallbackData,
	resolver *AgentResolver,
	realnames *RealnameResolver,
) ([]*dbmodels.RContentsAgents, error) {
	collection, err := app.FindCollectionByNameOrId(dbmodels.RelationTableName(dbmodels.CONTENTS_TABLE, dbmodels.AGENTS_TABLE))
	if err != nil {
		return nil, err
	}

	records := []*dbmodels.RContentsAgents{}
	if legacyData == nil {
		return records, nil
	}

	for _, row := range legacyData.INHTab.Rows {
		content, ok := contentsByMusenalmID[row.INHNR]
		if !ok || content == nil {
			continue
		}
		if len(existing[content.Id]) > 0 {
			continue
		}

		names := legacyAuthorNameParts(row.AutorRealname)
		if len(names) == 0 {
			continue
		}

		seen := map[string]bool{}
		for _, name := range names {
			agent := resolver.LookupByName(name)
			if agent == nil {
				if realnameRow, found := realnames.Lookup(name); found {
					created, err := resolver.CreateAgentFromRealname(realnameRow)
					if err != nil {
						return nil, err
					}
					agent = created
				} else {
					app.Logger().Error("Legacy content author not found in agents or REALNAME-Tab", "content_musenalm_id", row.INHNR, "name", name)
					continue
				}
			}

			if agent == nil || seen[agent.Id] {
				continue
			}
			seen[agent.Id] = true

			record := dbmodels.NewRContentsAgents(core.NewRecord(collection))
			record.SetContent(content.Id)
			record.SetAgent(agent.Id)
			record.SetType("Autor:in")
			records = append(records, record)
			existing[content.Id] = append(existing[content.Id], record)
		}
	}

	return records, nil
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
