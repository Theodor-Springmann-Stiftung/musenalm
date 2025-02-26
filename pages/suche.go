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

		allparas, _ := NewSearchParameters(e, *paras)

		if paras.Query != "" || allparas.IsBaendeSearch() {
			return p.SearchBaendeRequest(app, engine, e, *allparas)
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

func (p *SuchePage) SearchBaendeRequest(app core.App, engine *templating.Engine, e *core.RequestEvent, params SearchParameters) error {
	data := make(map[string]interface{})

	result, err := SimpleSearchBaende(app, params)
	if err != nil {
		return engine.Response404(e, err, nil)
	}

	data["parameters"] = params
	data["result"] = result
	return engine.Response200(e, p.Template+params.Collection+"/", data, p.Layout)
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
	BAENDE_PARAM_PLACES      = "places"
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

type SearchParameters struct {
	Parameters
	Sort string

	Annotations bool
	Persons     bool
	Title       bool
	Alm         bool
	Series      bool
	Places      bool
	Refs        bool
	Year        bool

	AnnotationsString string
	PersonsString     string
	TitleString       string
	AlmString         string
	SeriesString      string
	PlacesString      string
	RefsString        string
	YearString        string

	TypeFilter string
}

func NewSearchParameters(e *core.RequestEvent, p Parameters) (*SearchParameters, error) {
	alm := e.Request.URL.Query().Get(BAENDE_PARAM_ALM_NR) == "on"
	title := e.Request.URL.Query().Get(BAENDE_PARAM_TITLE) == "on"
	series := e.Request.URL.Query().Get(BAENDE_PARAM_SERIES) == "on"
	persons := e.Request.URL.Query().Get(BAENDE_PARAM_PERSONS) == "on"
	places := e.Request.URL.Query().Get(BAENDE_PARAM_PLACES) == "on"
	refs := e.Request.URL.Query().Get(BAENDE_PARAM_REFS) == "on"
	annotations := e.Request.URL.Query().Get(BAENDE_PARAM_ANNOTATIONS) == "on"
	year := e.Request.URL.Query().Get(BAENDE_PARAM_YEAR) == "on"

	almstring := e.Request.URL.Query().Get(BAENDE_PARAM_ALM_NR + "string")
	titlestring := e.Request.URL.Query().Get(BAENDE_PARAM_TITLE + "string")
	seriesstring := e.Request.URL.Query().Get(BAENDE_PARAM_SERIES + "string")
	personsstring := e.Request.URL.Query().Get(BAENDE_PARAM_PERSONS + "string")
	placesstring := e.Request.URL.Query().Get(BAENDE_PARAM_PLACES + "string")
	refsstring := e.Request.URL.Query().Get(BAENDE_PARAM_REFS + "string")
	annotationsstring := e.Request.URL.Query().Get(BAENDE_PARAM_ANNOTATIONS + "string")
	yearstring := e.Request.URL.Query().Get(BAENDE_PARAM_YEAR + "string")

	sort := e.Request.URL.Query().Get("sort")
	if sort == "" {
		sort = "year"
	}

	return &SearchParameters{
		Parameters: p,
		Sort:       sort,
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

		// INFO: Expanded search
		AlmString:         almstring,
		TitleString:       titlestring,
		SeriesString:      seriesstring,
		PersonsString:     personsstring,
		PlacesString:      placesstring,
		RefsString:        refsstring,
		AnnotationsString: annotationsstring,
		YearString:        yearstring,
	}, nil
}

func (p SearchParameters) AllSearchTerms() string {
	q := p.Query + " " + p.AnnotationsString + " " + p.PersonsString + " " + p.TitleString + " " + p.AlmString + " " + p.SeriesString + " " + p.PlacesString + " " + p.RefsString + " " + p.YearString
	return q
}

func (p SearchParameters) ToQueryParams() string {
	q := "?"

	// TODO: use variables, url escape
	if p.Extended {
		q += "extended=true"
	}

	if p.Query != "" {
		q += fmt.Sprintf("q=%s", p.Query)
	}

	if p.Alm {
		q += "&alm=on"
	}
	if p.Title {
		q += "&title=on"
	}
	if p.Persons {
		q += "&persons=on"
	}
	if p.Annotations {
		q += "&annotations=on"
	}
	if p.Series {
		q += "&series=on"
	}
	if p.Places {
		q += "&places=on"
	}
	if p.Refs {
		q += "&references=on"
	}
	if p.Year {
		q += "&year=on"
	}

	if p.YearString != "" {
		q += fmt.Sprintf("&yearstring=%s", p.YearString)
	}
	if p.AnnotationsString != "" {
		q += fmt.Sprintf("&annotationsstring=%s", p.AnnotationsString)
	}
	if p.PersonsString != "" {
		q += fmt.Sprintf("&personsstring=%s", p.PersonsString)
	}
	if p.TitleString != "" {
		q += fmt.Sprintf("&titlestring=%s", p.TitleString)
	}
	if p.AlmString != "" {
		q += fmt.Sprintf("&almstring=%s", p.AlmString)
	}
	if p.SeriesString != "" {
		q += fmt.Sprintf("&seriesstring=%s", p.SeriesString)
	}
	if p.PlacesString != "" {
		q += fmt.Sprintf("&placesstring=%s", p.PlacesString)
	}
	if p.RefsString != "" {
		q += fmt.Sprintf("&refsstring=%s", p.RefsString)
	}

	return q
}

func (p SearchParameters) IsBaendeSearch() bool {
	return p.Collection == "baende" && (p.Query != "" || (p.AnnotationsString != "" || p.PersonsString != "" || p.TitleString != "" || p.AlmString != "" || p.SeriesString != "" || p.PlacesString != "" || p.RefsString != "" || p.YearString != ""))
}

func (p SearchParameters) FieldSetBaende() []dbmodels.FTS5QueryRequest {
	ret := []dbmodels.FTS5QueryRequest{}
	if p.Query != "" {
		fields := []string{dbmodels.ID_FIELD}
		if p.Alm {
			fields = append(fields, dbmodels.MUSENALMID_FIELD)
		}
		if p.Title {
			// INFO: Preferred Title is not here to avoid hitting the Reihentitel
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
			fields = append(fields, dbmodels.PLACES_TABLE, dbmodels.PLACE_STMT_FIELD)
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

		que := p.NormalizeQuery()

		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: fields,
				Query:  p.NormalizeQuery(),
			})
		}
	}

	if p.AnnotationsString != "" {
		que := dbmodels.NormalizeQuery(p.AnnotationsString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.ANNOTATION_FIELD},
				Query:  que,
			})
		}
	}

	if p.PersonsString != "" {
		que := dbmodels.NormalizeQuery(p.PersonsString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.AGENTS_TABLE, dbmodels.RESPONSIBILITY_STMT_FIELD},
				Query:  que,
			})
		}
	}

	if p.TitleString != "" {
		que := dbmodels.NormalizeQuery(p.TitleString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.TITLE_STMT_FIELD, dbmodels.SUBTITLE_STMT_FIELD, dbmodels.INCIPIT_STMT_FIELD, dbmodels.VARIANT_TITLE_FIELD, dbmodels.PARALLEL_TITLE_FIELD},
				Query:  que,
			})
		}
	}

	if p.AlmString != "" {
		que := dbmodels.NormalizeQuery(p.AlmString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.MUSENALMID_FIELD},
				Query:  que,
			})
		}
	}

	if p.SeriesString != "" {
		que := dbmodels.NormalizeQuery(p.SeriesString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.SERIES_TABLE},
				Query:  que,
			})
		}
	}

	if p.PlacesString != "" {
		que := dbmodels.NormalizeQuery(p.PlacesString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.PLACES_TABLE, dbmodels.PLACE_STMT_FIELD},
				Query:  que,
			})
		}
	}

	if p.RefsString != "" {
		que := dbmodels.NormalizeQuery(p.RefsString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.REFERENCES_FIELD},
				Query:  que,
			})
		}
	}

	if p.YearString != "" {
		que := dbmodels.NormalizeQuery(p.YearString)
		if len(que) > 0 {
			ret = append(ret, dbmodels.FTS5QueryRequest{
				Fields: []string{dbmodels.YEAR_FIELD},
				Query:  dbmodels.NormalizeQuery(p.YearString),
			})
		}
	}

	return ret
}

func (p SearchParameters) IsExtendedSearch() bool {
	return p.AnnotationsString != "" || p.PersonsString != "" || p.TitleString != "" || p.AlmString != "" || p.SeriesString != "" || p.PlacesString != "" || p.RefsString != "" || p.YearString != ""
}

func (p SearchParameters) NormalizeQuery() []string {
	return dbmodels.NormalizeQuery(p.Query)
}

type SearchResultBaende struct {
	// these are the sorted IDs for hits
	Hits    []string
	Series  map[string]*dbmodels.Series // <- Key: Series ID
	Entries map[string]*dbmodels.Entry  // <- Key: Entry ID
	Places  map[string]*dbmodels.Place  // <- All places, Key: Place IDs
	Agents  map[string]*dbmodels.Agent  // <- Key: Agent IDs

	// INFO: this is as they say doppelt gemoppelt bc of a logic error i made while tired
	EntriesSeries map[string][]*dbmodels.REntriesSeries // <- Key: Entry ID
	SeriesEntries map[string][]*dbmodels.REntriesSeries // <- Key: Series ID
	EntriesAgents map[string][]*dbmodels.REntriesAgents // <- Key: Entry ID
}

func SimpleSearchBaende(app core.App, params SearchParameters) (*SearchResultBaende, error) {
	fields := params.FieldSetBaende()
	if len(fields) == 0 {
		return nil, ErrNoQuery
	}

	ids, err := dbmodels.FTS5Search(app, dbmodels.ENTRIES_TABLE, fields...)
	if err != nil {
		return nil, err
	}

	resultids := []any{}
	for _, id := range ids {
		resultids = append(resultids, id.ID)
	}

	entries, err := dbmodels.Entries_IDs(app, resultids)
	if err != nil {
		return nil, err
	}

	entriesmap := make(map[string]*dbmodels.Entry)
	for _, entry := range entries {
		entriesmap[entry.Id] = entry
	}

	series, relations, err := Series_Entries(app, entries)
	if err != nil {
		return nil, err
	}

	seriesmap := make(map[string]*dbmodels.Series)
	for _, s := range series {
		seriesmap[s.Id] = s
	}

	relationsmap := make(map[string][]*dbmodels.REntriesSeries)
	invrelationsmap := make(map[string][]*dbmodels.REntriesSeries)
	for _, r := range relations {
		invrelationsmap[r.Series()] = append(invrelationsmap[r.Series()], r)
		relationsmap[r.Entry()] = append(relationsmap[r.Entry()], r)
	}

	agents, arelations, err := Agents_Entries_IDs(app, resultids)
	if err != nil {
		return nil, err
	}

	agentsmap := make(map[string]*dbmodels.Agent)
	for _, a := range agents {
		agentsmap[a.Id] = a
	}

	relationsagentsmap := make(map[string][]*dbmodels.REntriesAgents)
	for _, r := range arelations {
		relationsagentsmap[r.Entry()] = append(relationsagentsmap[r.Entry()], r)
	}

	placesids := []any{}
	for _, entry := range entries {
		for _, place := range entry.Places() {
			placesids = append(placesids, place)
		}
	}

	places, err := dbmodels.Places_IDs(app, placesids)
	if err != nil {
		return nil, err
	}

	placesmap := make(map[string]*dbmodels.Place)
	for _, place := range places {
		placesmap[place.Id] = place
	}

	hits := []string{}
	if params.Sort == "series" {
		dbmodels.Sort_Series_Title(series)
		for _, s := range series {
			hits = append(hits, s.Id)
		}
	} else {
		dbmodels.Sort_Entries_Year_Title(entries)
		for _, e := range entries {
			hits = append(hits, e.Id)
		}
	}

	return &SearchResultBaende{
		Hits:          hits,
		Series:        seriesmap,
		Entries:       entriesmap,
		Places:        placesmap,
		Agents:        agentsmap,
		EntriesSeries: relationsmap,
		SeriesEntries: invrelationsmap,
		EntriesAgents: relationsagentsmap,
	}, nil

}

func (r SearchResultBaende) Count() int {
	return len(r.Entries)
}

func (r SearchResultBaende) SeriesCount() int {
	return len(r.Series)
}

func Agents_Entries_IDs(app core.App, ids []any) ([]*dbmodels.Agent, []*dbmodels.REntriesAgents, error) {
	relations, err := dbmodels.REntriesAgents_Entries(app, ids)
	if err != nil {
		return nil, nil, err
	}

	agentids := []any{}
	for _, r := range relations {
		agentids = append(agentids, r.Agent())
	}

	agents, err := dbmodels.Agents_IDs(app, agentids)
	if err != nil {
		return nil, nil, err
	}

	return agents, relations, nil
}
