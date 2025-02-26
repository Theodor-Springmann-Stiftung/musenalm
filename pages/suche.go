package pages

import (
	"fmt"
	"net/http"
	"slices"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
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
	PARAM_QUERY    = "q"
	PARAM_EXTENDED = "extended"
	TEMPLATE_SUCHE = "/suche/"
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

		data := make(map[string]interface{})
		data["parameters"] = paras
		return engine.Response200(e, p.Template+paras.Collection+"/", data, p.Layout)
	})

	return nil
}

func (p *SuchePage) SimpleSearchReihenRequest(app core.App, engine *templating.Engine, e *core.RequestEvent) error {
	return engine.Response404(e, nil, nil)
}

func (p *SuchePage) SimpleSearchBaendeRequest(app core.App, engine *templating.Engine, e *core.RequestEvent, pp Parameters) error {
	data := make(map[string]interface{})
	params, err := NewSimpleParameters(e, pp)
	if err != nil {
		return engine.Response404(e, err, nil)
	}

	query := params.NormalizeQuery()
	if len(query) == 0 {
		engine.Response404(e, nil, nil)
	}

	fields := params.FieldSetBaende()
	if len(fields) == 0 {
		return engine.Response404(e, nil, nil)
	}

	ids, err := dbmodels.FTS5Search(app, dbmodels.ENTRIES_TABLE, dbmodels.FTS5QueryRequest{
		Fields: fields,
		Query:  query,
	})
	if err != nil {
		return engine.Response500(e, err, nil)
	}

	idsany := datatypes.ToAny(ids)
	entries, err := dbmodels.Entries_IDs(app, idsany)
	if err != nil {
		return engine.Response500(e, err, nil)
	}

	dbmodels.Sort_Entries_Title_Year(entries)
	data["entries"] = entries
	data["count"] = len(entries)

	eids := []any{}
	for _, entry := range entries {
		eids = append(eids, entry.Id)
	}

	return engine.Response404(e, nil, nil)
}

const (
	BEITRAEGE_PARAM_ALM_NR      = "nr"
	BEITRAEGE_PARAM_TITLE       = "title"
	BEITRAEGE_PARAM_INCIPT      = "incipit"
	BEITRAEGE_PARAM_PERSONS     = "persons"
	BEITRAEGE_PARAM_ANNOTATIONS = "annotations"
	// INFO: this is expanded search only:
	BEITRAEGE_PARAM_PSEUDONYMS = "pseudonyms"
	// INFO: these are filter types & expanded search:
	BEITRAEGE_PARAM_TYPE  = "type"
	BEITRAEGE_PARAM_SCANS = "scans"

	REIHEN_PARAM_TITLE       = "title"
	REIHEN_PARAM_ANNOTATIONS = "annotations"
	REIHEN_PARAM_REFERENCES  = "references"

	BAENDE_PARAM_ALM_NR      = "alm"
	BAENDE_PARAM_TITLE       = "title"
	BAENDE_PARAM_SERIES      = "series"
	BAENDE_PARAM_PERSONS     = "persons"
	BAENDE_PARAM_PLACES      = "pubdata"
	BAENDE_PARAM_REFS        = "references"
	BAENDE_PARAM_ANNOTATIONS = "annotations"
	BAENDE_PARAM_YEAR        = "year"
	// INFO: this is expanded search only:
	BAENDE_PARAM_PSEUDONYMS = "pseudonyms"
	// INFO: this is a filter type & expanded search:
	BAENDE_PARAM_STATE = "state" // STATE: "full" "partial" "none"
)

var ErrInvalidCollectionType = fmt.Errorf("Invalid collection type")
var ErrNoQuery = fmt.Errorf("No query")

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

func (p *Parameters) NormalizeQuery() []string {
	return dbmodels.NormalizeQuery(p.Query)
}

type SimpleParameters struct {
	Parameters
	Annotations bool
	Persons     bool
	Title       bool
	Alm         bool
	Series      bool
	Places      bool
	Refs        bool
	Year        bool
}

func NewSimpleParameters(e *core.RequestEvent, p Parameters) (*SimpleParameters, error) {
	q := e.Request.URL.Query().Get(PARAM_QUERY)
	if q == "" {
		return nil, ErrNoQuery
	}

	alm := e.Request.URL.Query().Get(BAENDE_PARAM_ALM_NR) == "on"
	title := e.Request.URL.Query().Get(BAENDE_PARAM_TITLE) == "on"
	series := e.Request.URL.Query().Get(BAENDE_PARAM_SERIES) == "on"
	persons := e.Request.URL.Query().Get(BAENDE_PARAM_PERSONS) == "on"
	places := e.Request.URL.Query().Get(BAENDE_PARAM_PLACES) == "on"
	refs := e.Request.URL.Query().Get(BAENDE_PARAM_REFS) == "on"
	annotations := e.Request.URL.Query().Get(BAENDE_PARAM_ANNOTATIONS) == "on"
	year := e.Request.URL.Query().Get(BAENDE_PARAM_YEAR) == "on"

	// TODO: sanity check here if any single field is selected

	return &SimpleParameters{
		Parameters: p,
		// INFO: Common parameters
		Alm:         alm,
		Title:       title,
		Persons:     persons,
		Annotations: annotations,

		// INFO: Baende parameters
		Places: places,
		Refs:   refs,
		Year:   year,
		Series: series,
	}, nil
}

func (p SimpleParameters) FieldSetBaende() []string {
	fields := []string{}
	if p.Alm {
		fields = append(fields, dbmodels.MUSENALMID_FIELD)
	}
	if p.Title {
		fields = append(fields,
			dbmodels.TITLE_STMT_FIELD,
			dbmodels.SUBTITLE_STMT_FIELD,
			dbmodels.INCIPIT_STMT_FIELD,
			dbmodels.VARIANT_TITLE_FIELD,
			dbmodels.PARALLEL_TITLE_FIELD,
		)
	}
	if p.Series {
		fields = append(fields, dbmodels.SERIES_TABLE)
	}
	if p.Persons {
		fields = append(fields, dbmodels.RESPONSIBILITY_STMT_FIELD, dbmodels.AGENTS_TABLE)
	}
	if p.Places {
		fields = append(fields, dbmodels.PLACE_STMT_FIELD, dbmodels.PLACES_TABLE, dbmodels.PUBLICATION_STMT_FIELD)
	}
	if p.Refs {
		fields = append(fields, dbmodels.REFERENCES_FIELD)
	}
	if p.Annotations {
		fields = append(fields, dbmodels.ANNOTATION_FIELD)
	}
	if p.Year {
		fields = append(fields, dbmodels.YEAR_FIELD)
	}
	return fields
}
