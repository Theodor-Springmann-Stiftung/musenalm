package controllers

import (
	"net/url"
	"strings"
	"unicode/utf8"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"

	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_BAENDE         = "/baende/"
	URL_BAENDE_RESULTS = "/baende/results/"
	TEMPLATE_BAENDE    = "/baende/"
)

func init() {
	bp := &BaendePage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_BAENDE_NAME,
			URL:      URL_BAENDE,
			Template: TEMPLATE_BAENDE,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
		},
	}
	app.Register(bp)
}

type BaendePage struct {
	pagemodels.StaticPage
}

type BaendeResult struct {
	Entries       []*dbmodels.Entry
	Series        map[string]*dbmodels.Series
	EntriesSeries map[string][]*dbmodels.REntriesSeries
	Places        map[string]*dbmodels.Place
	Agents        map[string]*dbmodels.Agent
	EntriesAgents map[string][]*dbmodels.REntriesAgents
	Items         map[string][]*dbmodels.Item
}

func (p *BaendePage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	rg := router.Group(URL_BAENDE)
	rg.BindFunc(middleware.Authenticated(app))
	rg.GET("", p.handlePage(engine, app))
	rg.GET("results/", p.handleResults(engine, app))
	return nil
}

func (p *BaendePage) handlePage(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, "/login/?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *BaendePage) handleResults(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, "/login/?redirectTo="+redirectTo)
		}

		data, err := p.buildResultData(app, e, req)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		return engine.Response200(e, URL_BAENDE_RESULTS, data, "fragment")
	}
}

func (p *BaendePage) buildResultData(app core.App, e *core.RequestEvent, req *templating.Request) (map[string]any, error) {
	data := map[string]any{}

	search := strings.TrimSpace(e.Request.URL.Query().Get("search"))
	if search != "" {
		data["search"] = search
	}

	letter := strings.ToUpper(strings.TrimSpace(e.Request.URL.Query().Get("letter")))
	if letter == "" {
		letter = "A"
	}
	if len(letter) > 1 {
		letter = letter[:1]
	}
	if letter < "A" || letter > "Z" {
		letter = "A"
	}

	entries := []*dbmodels.Entry{}
	if search != "" {
		var err error
		entries, err = searchBaendeEntries(app, search)
		if err != nil {
			return data, err
		}
	} else {
		if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
			Where(dbx.Like(dbmodels.PREFERRED_TITLE_FIELD, letter).Match(false, true)).
			OrderBy(dbmodels.PREFERRED_TITLE_FIELD).
			All(&entries); err != nil {
			return data, err
		}
	}

	entryIDs := []any{}
	for _, entry := range entries {
		entryIDs = append(entryIDs, entry.Id)
	}

	seriesMap := map[string]*dbmodels.Series{}
	entrySeriesMap := map[string][]*dbmodels.REntriesSeries{}
	if len(entries) > 0 {
		series, relations, err := Series_Entries(app, entries)
		if err != nil {
			return data, err
		}
		for _, s := range series {
			seriesMap[s.Id] = s
		}
		for _, r := range relations {
			entrySeriesMap[r.Entry()] = append(entrySeriesMap[r.Entry()], r)
		}
	}

	agentsMap := map[string]*dbmodels.Agent{}
	entryAgentsMap := map[string][]*dbmodels.REntriesAgents{}
	if len(entryIDs) > 0 {
		agents, arelations, err := Agents_Entries_IDs(app, entryIDs)
		if err != nil {
			return data, err
		}
		for _, a := range agents {
			agentsMap[a.Id] = a
		}
		for _, r := range arelations {
			entryAgentsMap[r.Entry()] = append(entryAgentsMap[r.Entry()], r)
		}
	}

	placesMap := map[string]*dbmodels.Place{}
	placesIDs := []any{}
	for _, entry := range entries {
		for _, placeID := range entry.Places() {
			placesIDs = append(placesIDs, placeID)
		}
	}
	if len(placesIDs) > 0 {
		places, err := dbmodels.Places_IDs(app, placesIDs)
		if err != nil {
			return data, err
		}
		for _, place := range places {
			placesMap[place.Id] = place
		}
	}

	itemsMap := map[string][]*dbmodels.Item{}
	for _, entry := range entries {
		items, err := dbmodels.Items_Entry(app, entry.Id)
		if err != nil {
			return data, err
		}
		if len(items) > 0 {
			itemsMap[entry.Id] = items
		}
	}

	letters := []string{
		"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
		"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	}

	data["result"] = &BaendeResult{
		Entries:       entries,
		Series:        seriesMap,
		EntriesSeries: entrySeriesMap,
		Places:        placesMap,
		Agents:        agentsMap,
		EntriesAgents: entryAgentsMap,
		Items:         itemsMap,
	}
	data["letter"] = letter
	data["letters"] = letters
	data["csrf_token"] = req.Session().Token

	return data, nil
}

func searchBaendeEntries(app core.App, search string) ([]*dbmodels.Entry, error) {
	query := strings.TrimSpace(search)
	if query == "" {
		return []*dbmodels.Entry{}, nil
	}
	if utf8.RuneCountInString(query) < 3 {
		return searchBaendeEntriesQuick(app, query)
	}

	entries, err := searchBaendeEntriesFTS(app, query)
	if err != nil {
		app.Logger().Error("FTS search failed", "error", err)
		return nil, err
	}
	return entries, nil
}

func searchBaendeEntriesFTS(app core.App, query string) ([]*dbmodels.Entry, error) {
	entryIDs := map[string]struct{}{}
	terms := dbmodels.NormalizeQuery(query)

	entryRequests := dbmodels.IntoQueryRequests(dbmodels.ENTRIES_FTS5_FIELDS, terms)
	if len(entryRequests) > 0 {
		ids, err := dbmodels.FTS5Search(app, dbmodels.ENTRIES_TABLE, entryRequests...)
		if err != nil {
			return nil, err
		}
		for _, id := range ids {
			entryIDs[id.ID] = struct{}{}
		}
	}

	itemRequests := dbmodels.IntoQueryRequests(dbmodels.ITEMS_FTS5_FIELDS, terms)
	if len(itemRequests) > 0 {
		ids, err := dbmodels.FTS5Search(app, dbmodels.ITEMS_TABLE, itemRequests...)
		if err != nil {
			return nil, err
		}
		itemIDs := []any{}
		for _, id := range ids {
			itemIDs = append(itemIDs, id.ID)
		}
		if len(itemIDs) > 0 {
			items, err := dbmodels.TableByIDs[*dbmodels.Item](app, dbmodels.ITEMS_TABLE, itemIDs)
			if err != nil {
				return nil, err
			}
			for _, item := range items {
				if item == nil {
					continue
				}
				if entryID := item.Entry(); entryID != "" {
					entryIDs[entryID] = struct{}{}
				}
			}
		}
	}

	if len(entryIDs) == 0 {
		return []*dbmodels.Entry{}, nil
	}

	entryIDList := []any{}
	for id := range entryIDs {
		entryIDList = append(entryIDList, id)
	}

	entries, err := dbmodels.Entries_IDs(app, entryIDList)
	if err != nil {
		return nil, err
	}
	dbmodels.Sort_Entries_Title_Year(entries)
	return entries, nil
}



func searchBaendeEntriesQuick(app core.App, query string) ([]*dbmodels.Entry, error) {
	trimmed := strings.TrimSpace(query)
	if trimmed == "" {
		return []*dbmodels.Entry{}, nil
	}
	if utf8.RuneCountInString(trimmed) == 1 {
		return []*dbmodels.Entry{}, nil
	}

	entryFields := []string{
		dbmodels.PREFERRED_TITLE_FIELD,
	}

	entryConditions := make([]dbx.Expression, 0, len(entryFields))
	for _, field := range entryFields {
		entryConditions = append(entryConditions, dbx.Like(field, trimmed).Match(true, true))
	}

	entryIDs := map[string]struct{}{}
	if len(entryConditions) > 0 {
		entries := []*dbmodels.Entry{}
		if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
			Where(dbx.Or(entryConditions...)).
			All(&entries); err != nil {
			return nil, err
		}
		for _, entry := range entries {
			entryIDs[entry.Id] = struct{}{}
		}
	}

	itemConditions := []dbx.Expression{
		dbx.Like(dbmodels.ITEMS_IDENTIFIER_FIELD, trimmed).Match(true, true),
	}
	if len(itemConditions) > 0 {
		items := []*dbmodels.Item{}
		if err := app.RecordQuery(dbmodels.ITEMS_TABLE).
			Where(dbx.Or(itemConditions...)).
			All(&items); err != nil {
			return nil, err
		}
		for _, item := range items {
			if entryID := item.Entry(); entryID != "" {
				entryIDs[entryID] = struct{}{}
			}
		}
	}

	if len(entryIDs) == 0 {
		return []*dbmodels.Entry{}, nil
	}

	entryIDList := make([]any, 0, len(entryIDs))
	for id := range entryIDs {
		entryIDList = append(entryIDList, id)
	}

	entries, err := dbmodels.Entries_IDs(app, entryIDList)
	if err != nil {
		return nil, err
	}

	dbmodels.Sort_Entries_Title_Year(entries)
	return entries, nil
}
