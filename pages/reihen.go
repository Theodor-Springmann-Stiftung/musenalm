package pages

import (
	"net/http"
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_REIHEN   = "/reihen/"
	PARAM_LETTER = "letter"
	PARAM_SEARCH = "search"
)

func init() {
	rp := &ReihenPage{
		Page: pagemodels.Page{
			Name: pagemodels.P_REIHEN_NAME,
		},
	}
	app.Register(rp)
}

type ReihenPage struct {
	pagemodels.Page
}

func (p *ReihenPage) Up(app core.App) error {
	return nil
}

func (p *ReihenPage) Down(app core.App) error {
	return nil
}

func (p *ReihenPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_REIHEN, func(e *core.RequestEvent) error {
		search := e.Request.URL.Query().Get(PARAM_SEARCH)
		if search != "" {
			return p.SearchRequest(app, engine, e)
		}

		return p.LetterRequest(app, engine, e)
	})
	return nil
}

func (p *ReihenPage) LetterRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	letter := e.Request.URL.Query().Get(PARAM_LETTER)
	if letter == "" {
		letter = "A"
	}
	series := []*dbmodels.Series{}
	err := app.RecordQuery(dbmodels.SERIES_TABLE).
		Where(dbx.Like(dbmodels.SERIES_TITLE_FIELD, letter).Match(false, true)).
		OrderBy(dbmodels.SERIES_TITLE_FIELD).
		All(&series)
	// INFO: this does not return an error if the result set is empty
	if err != nil {
		return err
	}

	// INFO: We sort again since the query can't sort german umlauts correctly
	dbmodels.SortSeriesByTitle(series)

	smap, bmap := p.EntriesForSeries(app, series)
	agents, _ := p.GetAgents(app)

	var builder strings.Builder
	err = engine.Render(&builder, URL_REIHEN, map[string]interface{}{
		PARAM_LETTER: letter,
		"series":     series,
		"letters":    p.Letters(app),
		"entries":    bmap,
		"relations":  smap,
		"agents":     agents,
	})
	if err != nil {
		return err
	}

	return e.HTML(http.StatusOK, builder.String())
}

func (p *ReihenPage) SearchRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	search := e.Request.URL.Query().Get(PARAM_SEARCH)
	series := []*dbmodels.Series{}
	err := app.RecordQuery(dbmodels.SERIES_TABLE).
		Where(dbx.Like(dbmodels.SERIES_TITLE_FIELD, search).Match(true, true)).
		OrderBy(dbmodels.SERIES_TITLE_FIELD).
		All(&series)
	if err != nil {
		return err
	}

	altseries := []*dbmodels.Series{}
	err = app.RecordQuery(dbmodels.SERIES_TABLE).
		Where(dbx.Like(dbmodels.ANNOTATION_FIELD, search).Match(true, true)).
		OrderBy(dbmodels.SERIES_TITLE_FIELD).
		All(&altseries)
	if err != nil {
		return err
	}

	dbmodels.SortSeriesByTitle(series)
	dbmodels.SortSeriesByTitle(altseries)

	smap, bmap := p.EntriesForSeries(app, series)
	agents, _ := p.GetAgents(app)

	var builder strings.Builder
	err = engine.Render(&builder, URL_REIHEN, map[string]interface{}{
		PARAM_SEARCH: search,
		"series":     series,
		"altseries":  altseries,
		"letters":    p.Letters(app),
		"entries":    bmap,
		"relations":  smap,
		"agents":     agents,
	})
	if err != nil {
		return err
	}

	return e.HTML(http.StatusOK, builder.String())
}

func (p *ReihenPage) Letters(app core.App) []string {
	letters := []core.Record{}
	ids := []string{}

	err := app.RecordQuery(dbmodels.SERIES_TABLE).
		Select("upper(substr(" + dbmodels.SERIES_TITLE_FIELD + ", 1, 1)) AS id").
		Distinct(true).
		All(&letters)
	if err != nil {
		return ids
	}

	for _, l := range letters {
		ids = append(ids, l.GetString("id"))
	}
	return ids
}

func (p *ReihenPage) EntriesForSeries(app core.App, series []*dbmodels.Series) (
	map[string][]*dbmodels.REntriesSeries,
	map[string]*dbmodels.Entry) {
	ids := []any{}
	for _, s := range series {
		ids = append(ids, s.Id)
	}

	relations := []*core.Record{}

	err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)).
		Where(dbx.HashExp{
			dbmodels.SERIES_TABLE: ids,
		}).
		All(&relations)
	if err != nil {
		return nil, nil
	}

	app.ExpandRecords(relations, []string{dbmodels.ENTRIES_TABLE}, nil)
	bmap := map[string]*dbmodels.Entry{}
	for _, r := range relations {
		record := r.ExpandedOne(dbmodels.ENTRIES_TABLE)
		if record == nil {
			continue
		}
		entry := dbmodels.NewEntry(record)
		bmap[entry.Id] = entry
	}

	smap := map[string][]*dbmodels.REntriesSeries{}
	for _, r := range relations {
		series := dbmodels.NewREntriesSeries(r)
		smap[series.Id] = append(smap[series.Id], series)
	}

	for _, rel := range smap {
		slices.SortFunc(rel, func(i, j *dbmodels.REntriesSeries) int {
			ientry := bmap[i.Entry()]
			jentry := bmap[j.Entry()]
			return ientry.Year() - jentry.Year()
		})
	}

	return smap, bmap
}

func (p *ReihenPage) GetAgents(app core.App) ([]*dbmodels.Agent, error) {
	rels := []*core.Record{}
	// INFO: we could just fetch all relations here
	err := app.RecordQuery(dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.AGENTS_TABLE)).
		GroupBy(dbmodels.AGENTS_TABLE).
		All(&rels)
	if err != nil {
		return nil, err
	}

	app.ExpandRecords(rels, []string{dbmodels.AGENTS_TABLE}, nil)
	agents := []*dbmodels.Agent{}
	for _, r := range rels {
		record := r.ExpandedOne(dbmodels.AGENTS_TABLE)
		if record == nil {
			continue
		}
		agent := dbmodels.NewAgent(record)
		agents = append(agents, agent)
	}

	dbmodels.SortAgentsByName(agents)

	return agents, err
}
