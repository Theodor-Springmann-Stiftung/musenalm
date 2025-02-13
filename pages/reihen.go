package pages

import (
	"fmt"
	"net/http"
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
		letter := e.Request.URL.Query().Get(PARAM_LETTER)
		if letter == "" {
			letter = "A"
		}

		series := []*dbmodels.Series{}
		err := app.RecordQuery(dbmodels.SERIES_TABLE).
			AndWhere(dbx.NewExp(dbmodels.SERIES_TITLE_FIELD + " LIKE '" + letter + "%'")).
			OrderBy(dbmodels.SERIES_TITLE_FIELD).
			All(&series)
		// INFO: this does not return an error if the result set is empty
		if err != nil {
			return err
		}

		// INFO: We sort again since the query can't sort german umlauts correctly
		dbmodels.SortSeriesByTitle(series)

		var builder strings.Builder
		err = engine.Render(&builder, URL_REIHEN, map[string]interface{}{
			PARAM_LETTER: letter,
			"series":     series,
		})
		if err != nil {
			return err
		}

		return e.HTML(http.StatusOK, builder.String())
	})
	return nil
}
