package pages

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

const (
	URL_REIHEN   = "/reihen/"
	URL_REIHE    = "/reihen/{id}/"
	PARAM_LETTER = "letter"
	PARAM_SEARCH = "search"
	PARAM_PERSON = "agent"
	PARAM_PLACE  = "place"
	PARAM_YEAR   = "year"
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
		person := e.Request.URL.Query().Get(PARAM_PERSON)
		if person != "" {
			return p.PersonRequest(app, engine, e)
		}
		place := e.Request.URL.Query().Get(PARAM_PLACE)
		if place != "" {
			return p.PlaceRequest(app, engine, e)
		}
		year := e.Request.URL.Query().Get(PARAM_YEAR)
		if year != "" {
			return p.YearRequest(app, engine, e)
		}

		return p.LetterRequest(app, engine, e)
	})
	return nil
}

func (p *ReihenPage) YearRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	year := e.Request.URL.Query().Get(PARAM_YEAR)
	data := map[string]interface{}{}
	data[PARAM_YEAR] = year

	y, err := strconv.Atoi(year)
	if err != nil {
		return err
	}

	series, relations, entries, err := dbmodels.SeriesForYear(app, y)
	if err != nil {
		return err
	}
	data["entries"] = entries
	data["relations"] = relations
	data["series"] = series

	return p.Get(e, engine, data)
}

func (p *ReihenPage) LetterRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	letter := e.Request.URL.Query().Get(PARAM_LETTER)
	data := map[string]interface{}{}
	if letter == "" {
		letter = "A"
	}
	data[PARAM_LETTER] = letter

	series, err := dbmodels.SeriesForLetter(app, letter)
	if err != nil {
		return err
	}
	// INFO: We sort again since the query can't sort german umlauts correctly
	dbmodels.SortSeriessesByTitle(series)
	data["series"] = series

	rmap, bmap, err := dbmodels.EntriesForSeriesses(app, series)
	if err != nil {
		return err
	}
	data["entries"] = bmap
	data["relations"] = rmap

	return p.Get(e, engine, data)
}

func (p *ReihenPage) PersonRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	person := e.Request.URL.Query().Get(PARAM_PERSON)
	data := map[string]interface{}{}
	data[PARAM_PERSON] = person

	agent, err := dbmodels.AgentForId(app, person)
	if err != nil {
		return err
	}
	data["a"] = agent

	series, relations, entries, err := dbmodels.SeriesForAgent(app, person)
	if err != nil {
		return err
	}
	data["series"] = series
	data["relations"] = relations
	data["entries"] = entries

	return p.Get(e, engine, data)
}

func (p *ReihenPage) PlaceRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	place := e.Request.URL.Query().Get(PARAM_PLACE)
	data := map[string]interface{}{}
	data[PARAM_PLACE] = place

	pl, err := dbmodels.PlaceForId(app, place)
	if err != nil {
		return err
	}
	data["p"] = pl

	series, relations, entries, err := dbmodels.SeriesForPlace(app, place)
	if err != nil {
		return err
	}
	data["series"] = series
	data["relations"] = relations
	data["entries"] = entries

	return p.Get(e, engine, data)
}

func (p *ReihenPage) SearchRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	search := e.Request.URL.Query().Get(PARAM_SEARCH)
	data := map[string]interface{}{}
	data[PARAM_SEARCH] = search
	series, altseries, err := dbmodels.BasicSearchSeries(app, search)
	if err != nil {
		return err
	}
	dbmodels.SortSeriessesByTitle(series)
	dbmodels.SortSeriessesByTitle(altseries)
	data["series"] = series
	data["altseries"] = altseries

	rmap, bmap, err := dbmodels.EntriesForSeriesses(app, series)
	if err != nil {
		return err
	}
	data["entries"] = bmap
	data["relations"] = rmap

	return p.Get(e, engine, data)
}

func (p *ReihenPage) CommonData(app core.App, data map[string]interface{}) error {
	agents, err := dbmodels.AllAgentsForSeries(app)
	if err != nil {
		return err
	}
	data["agents"] = agents

	letters, err := dbmodels.LettersForSeries(app)
	if err != nil {
		return err
	}
	data["letters"] = letters

	places, err := dbmodels.AllPlaces(app)
	if err != nil {
		return err
	}
	dbmodels.SortPlacesByName(places)
	data["places"] = places

	years, err := dbmodels.YearsForEntries(app)
	if err != nil {
		return err
	}
	data["years"] = years

	return nil
}

func (p *ReihenPage) Get(request *core.RequestEvent, engine *templating.Engine, data map[string]interface{}) error {
	err := p.CommonData(request.App, data)
	if err != nil {
		return err
	}

	var builder strings.Builder
	err = engine.Render(&builder, URL_REIHEN, data)
	if err != nil {
		return err
	}
	return request.HTML(http.StatusOK, builder.String())
}
