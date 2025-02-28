package pages

import (
	"fmt"
	"net/http"
	"slices"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

type SuchePage struct {
	pagemodels.DefaultPage[*pagemodels.DefaultPageRecord]
}

const (
	URL_SUCHE      = "/suche/{type}"
	URL_SUCHE_ALT  = "/suche/{$}"
	DEFAULT_SUCHE  = "/suche/baende"
	PARAM_EXTENDED = "extended"
	TEMPLATE_SUCHE = "/suche/"
	PARAM_QUERY    = "q"
)

var availableTypes = []string{"baende", "beitraege"}

func init() {
	rp := &SuchePage{
		DefaultPage: pagemodels.DefaultPage[*pagemodels.DefaultPageRecord]{
			Record:   &pagemodels.DefaultPageRecord{},
			Name:     pagemodels.P_SUCHE_NAME,
			Template: TEMPLATE_SUCHE,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
			URL:      URL_SUCHE,
		},
	}
	app.Register(rp)
}

func (p *SuchePage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET(URL_SUCHE_ALT, func(e *core.RequestEvent) error {
		return e.Redirect(http.StatusPermanentRedirect, DEFAULT_SUCHE)
	})

	router.GET(URL_SUCHE, func(e *core.RequestEvent) error {
		paras, err := NewParameters(e)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		allparas, _ := NewSearchParameters(e, *paras)

		if allparas.IsBaendeSearch() {
			return p.SearchBaendeRequest(app, engine, e, *allparas)
		}

		if allparas.IsBeitraegeSearch() {
			return p.SearchBeitraegeRequest(app, engine, e, *allparas)
		}

		data := make(map[string]interface{})
		data["parameters"] = allparas
		return engine.Response200(e, p.Template+paras.Collection+"/", data, p.Layout)
	})

	return nil
}

func (p *SuchePage) SimpleSearchReihenRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	return engine.Response404(e, nil, nil)
}

func (p *SuchePage) SearchBeitraegeRequest(app core.App, engine *templating.Engine, e *core.RequestEvent, params SearchParameters) error {
	data := make(map[string]interface{})

	result, err := NewSearchBeitraege(app, params)
	if err != nil {
		return engine.Response404(e, err, nil)
	}

	data["parameters"] = params
	data["result"] = result
	return engine.Response200(e, p.Template+params.Collection+"/", data, p.Layout)
}

func (p *SuchePage) SearchBaendeRequest(app core.App, engine *templating.Engine, e *core.RequestEvent, params SearchParameters) error {
	data := make(map[string]interface{})

	result, err := NewSearchBaende(app, params)
	if err != nil {
		return engine.Response404(e, err, nil)
	}

	data["parameters"] = params
	data["result"] = result
	return engine.Response200(e, p.Template+params.Collection+"/", data, p.Layout)
}

var ErrInvalidCollectionType = fmt.Errorf("Invalid collection type")

type Parameters struct {
	Extended   bool
	Collection string
	Query      string
}

func NewParameters(e *core.RequestEvent) (*Parameters, error) {
	collection := e.Request.PathValue("type")
	if !slices.Contains(availableTypes, collection) {
		return nil, ErrInvalidCollectionType
	}

	extended := false
	if e.Request.URL.Query().Get(PARAM_EXTENDED) == "true" {
		extended = true
	}

	return &Parameters{
		Collection: collection,
		Extended:   extended,
		Query:      e.Request.URL.Query().Get(PARAM_QUERY),
	}, nil
}

func (p *Parameters) NormalizeQuery() dbmodels.Query {
	return dbmodels.NormalizeQuery(p.Query)
}
