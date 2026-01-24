package controllers

import (
	"net/url"
	"strings"

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
	URL_BAENDE      = "/baende/"
	TEMPLATE_BAENDE = "/baende/"
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
	rg.GET("", func(e *core.RequestEvent) error {
		req := templating.NewRequest(e)
		if req.User() == nil {
			redirectTo := url.QueryEscape(req.FullURL())
			return e.Redirect(303, "/login/?redirectTo="+redirectTo)
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
		if err := app.RecordQuery(dbmodels.ENTRIES_TABLE).
			Where(dbx.Like(dbmodels.PREFERRED_TITLE_FIELD, letter).Match(false, true)).
			OrderBy(dbmodels.PREFERRED_TITLE_FIELD).
			All(&entries); err != nil {
			return engine.Response500(e, err, nil)
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
				return engine.Response500(e, err, nil)
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
				return engine.Response500(e, err, nil)
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
				return engine.Response500(e, err, nil)
			}
			for _, place := range places {
				placesMap[place.Id] = place
			}
		}

		itemsMap := map[string][]*dbmodels.Item{}
		for _, entry := range entries {
			items, err := dbmodels.Items_Entry(app, entry.Id)
			if err != nil {
				return engine.Response500(e, err, nil)
			}
			if len(items) > 0 {
				itemsMap[entry.Id] = items
			}
		}

		letters := []string{
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
			"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
		}

		data := map[string]any{
			"result": &BaendeResult{
				Entries:       entries,
				Series:        seriesMap,
				EntriesSeries: entrySeriesMap,
				Places:        placesMap,
				Agents:        agentsMap,
				EntriesAgents: entryAgentsMap,
				Items:         itemsMap,
			},
			"letter":     letter,
			"letters":    letters,
			"csrf_token": req.Session().Token,
		}
		return engine.Response200(e, p.Template, data, p.Layout)
	})
	return nil
}
