package pages

import (
	"net/http"
	"slices"
	"strings"

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
	DEFAULT_SUCHE  = "/suche/reihen"
	PARAM_QUERY    = "q"
	PARAM_EXTENDED = "extended"
	TEMPLATE_SUCHE = "/suche/"
)

var availableTypes = []string{"reihen", "baende", "beitraege", "personen"}

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
		if !slices.Contains(availableTypes, e.Request.PathValue("type")) {
			return engine.Response404(e, nil, nil)
		}

		q := e.Request.URL.Query().Get(PARAM_QUERY)
		q = strings.TrimSpace(q)
		if q != "" {
			return p.SimpleSearchRequest(app, engine, e)
		}
		// if e.Request.URL.Query().Get(PARAM_QUERY) != "" {
		// 	return p.SearchRequest(app, engine, e)
		// }
		return p.DefaultRequest(app, engine, e)
	})

	return nil
}

func (p *SuchePage) SimpleSearchRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	t := e.Request.PathValue("type")
	if t == "reihen" {
		return p.SimpleSearchReihenRequest(app, engine, e)
	}
	// if t == "baende" {
	// 	return p.SimpleSearchBaendeRequest(app, engine, e)
	// }
	// if t == "beitraege" {
	// 	return p.SimpleSearchBeitraegeRequest(app, engine, e)
	// }
	// if t == "personen" {
	// 	return p.SimpleSearchPersonenRequest(app, engine, e)
	// }
	return engine.Response404(e, nil, nil)
}

func (p *SuchePage) SimpleSearchReihenRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	q := e.Request.URL.Query().Get(PARAM_QUERY)
	data := p.CommonData(app, engine, e)
	data["q"] = q

	hasTitle := e.Request.URL.Query().Get("title") == "on"
	hasAnnotations := e.Request.URL.Query().Get("annotations") == "on"
	hasReferences := e.Request.URL.Query().Get("references") == "on"

	if !hasTitle && !hasAnnotations && !hasReferences {
		engine.Response404(e, nil, nil)
	}

	fields := []string{}
	options := map[string]bool{}
	if hasTitle {
		fields = append(fields, dbmodels.SERIES_TITLE_FIELD)
		options["title"] = true
	}
	if hasAnnotations {
		fields = append(fields, dbmodels.ANNOTATION_FIELD)
		options["annotations"] = true
	}
	if hasReferences {
		fields = append(fields, dbmodels.REFERENCES_FIELD)
		options["references"] = true
	}
	data["options"] = options

	query := dbmodels.NormalizeQuery(q)
	if len(q) == 0 {
		return engine.Response404(e, nil, nil)
	}

	ids, err := dbmodels.FTS5Search(app, dbmodels.SERIES_TABLE, dbmodels.FTS5QueryRequest{
		Fields: fields,
		Query:  query,
	})
	if err != nil {
		return engine.Response500(e, err, nil)
	}

	idsany := []any{}
	for _, id := range ids {
		idsany = append(idsany, id.ID)
	}

	series, err := dbmodels.SeriessesForIds(app, idsany)
	rmap, bmap, err := dbmodels.EntriesForSeriesses(app, series)
	if err != nil {
		return engine.Response500(e, err, nil)
	}

	dbmodels.SortSeriessesByTitle(series)
	data["series"] = series
	data["relations"] = rmap
	data["entries"] = bmap

	data["count"] = len(series)
	// TODO: get relavant agents, years and places

	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *SuchePage) DefaultRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	data := p.CommonData(app, engine, e)
	return engine.Response200(e, p.Template, data, p.Layout)
}

func (p *SuchePage) CommonData(app core.App, engine *templating.Engine, e *core.RequestEvent) map[string]interface{} {
	data := map[string]interface{}{}
	data["type"] = e.Request.PathValue("type")
	data[PARAM_EXTENDED] = false
	if e.Request.URL.Query().Get(PARAM_EXTENDED) == "true" {
		data[PARAM_EXTENDED] = true
	}
	return data
}
