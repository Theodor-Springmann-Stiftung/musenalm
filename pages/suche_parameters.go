package pages

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

var ErrNoQuery = fmt.Errorf("No query")

const (
	SEARCH_PARAM_ALM_NR      = "alm"
	SEARCH_PARAM_TITLE       = "title"
	SEARCH_PARAM_PERSONS     = "persons"
	SEARCH_PARAM_ANNOTATIONS = "annotations"
	SEARCH_PARAM_YEAR        = "year"
	BAENDE_PARAM_PLACES      = "places"
	BAENDE_PARAM_SERIES      = "series"
	BAENDE_PARAM_REFS        = "references"
	BEITRAEGE_PARAM_ENTRY    = "entry"
	BEITRAEGE_PARAM_INCIPT   = "incipit"
	BEITRAEGE_PARAM_TYPE     = "type"
)

type SearchParameters struct {
	Parameters
	Sort string // year, entry,

	Annotations bool
	Persons     bool
	Title       bool
	Series      bool
	Places      bool
	Refs        bool
	Year        bool
	Entry       bool
	Incipit     bool

	AnnotationsString string
	PersonsString     string
	TitleString       string
	AlmString         string
	SeriesString      string
	PlacesString      string
	RefsString        string
	YearString        string
	EntryString       string
	IncipitString     string
	TypeString        string

	Page int
}

func NewSearchParameters(e *core.RequestEvent, p Parameters) (*SearchParameters, error) {
	almstring := e.Request.URL.Query().Get(SEARCH_PARAM_ALM_NR + "string")
	title := e.Request.URL.Query().Get(SEARCH_PARAM_TITLE) == "on"
	titlestring := e.Request.URL.Query().Get(SEARCH_PARAM_TITLE + "string")
	persons := e.Request.URL.Query().Get(SEARCH_PARAM_PERSONS) == "on"
	personsstring := e.Request.URL.Query().Get(SEARCH_PARAM_PERSONS + "string")
	annotations := e.Request.URL.Query().Get(SEARCH_PARAM_ANNOTATIONS) == "on"
	annotationsstring := e.Request.URL.Query().Get(SEARCH_PARAM_ANNOTATIONS + "string")
	year := e.Request.URL.Query().Get(SEARCH_PARAM_YEAR) == "on"

	yearstring := e.Request.URL.Query().Get(SEARCH_PARAM_YEAR + "string")
	typestring := e.Request.URL.Query().Get(BEITRAEGE_PARAM_TYPE + "string")

	series := e.Request.URL.Query().Get(BAENDE_PARAM_SERIES) == "on"
	seriesstring := e.Request.URL.Query().Get(BAENDE_PARAM_SERIES + "string")
	places := e.Request.URL.Query().Get(BAENDE_PARAM_PLACES) == "on"
	placesstring := e.Request.URL.Query().Get(BAENDE_PARAM_PLACES + "string")
	refs := e.Request.URL.Query().Get(BAENDE_PARAM_REFS) == "on"

	refss := e.Request.URL.Query().Get(BAENDE_PARAM_REFS + "string")
	if refss != "" {
		refss = "\"" + refss + "\""
	}

	incipit := e.Request.URL.Query().Get(BEITRAEGE_PARAM_INCIPT) == "on"
	incipitstring := e.Request.URL.Query().Get(BEITRAEGE_PARAM_INCIPT + "string")
	entry := e.Request.URL.Query().Get(BEITRAEGE_PARAM_ENTRY) == "on"
	entrystring := e.Request.URL.Query().Get(BEITRAEGE_PARAM_ENTRY + "string")

	sort := e.Request.URL.Query().Get("sort")
	if sort == "" {
		sort = "year"
	}

	page := e.Request.URL.Query().Get("page")
	if page == "" {
		page = "1"
	}

	pageint, err := strconv.Atoi(page)
	if err != nil {
		return nil, err
	}

	return &SearchParameters{
		Parameters: p,
		Sort:       sort,
		Page:       pageint,

		// INFO: Common parameters
		Title:       title,
		Persons:     persons,
		Annotations: annotations,
		Year:        year,

		// INFO: Baende parameters
		Places: places,
		Refs:   refs,
		Series: series,

		// INFO: Beitraege parameters
		Entry:   entry,
		Incipit: incipit,

		// INFO: Expanded search
		AlmString:         almstring,
		TitleString:       titlestring,
		SeriesString:      seriesstring,
		PersonsString:     personsstring,
		PlacesString:      placesstring,
		RefsString:        refss,
		AnnotationsString: annotationsstring,
		YearString:        yearstring,
		EntryString:       entrystring,
		IncipitString:     incipitstring,
		TypeString:        typestring,
	}, nil
}

func (p SearchParameters) AllSearchTermsBaende() string {
	res := []string{}
	res = append(res, p.includedParams(p.Query)...)
	res = append(res, p.includedParams(p.AnnotationsString)...)
	res = append(res, p.includedParams(p.PersonsString)...)
	res = append(res, p.includedParams(p.TitleString)...)
	res = append(res, p.includedParams(p.SeriesString)...)
	res = append(res, p.includedParams(p.PlacesString)...)
	res = append(res, p.includedParams(p.RefsString)...)
	res = append(res, p.includedParams(p.YearString)...)
	res = append(res, p.AlmString)
	return strings.Join(res, " ")
}

func (p SearchParameters) AllSearchTermsBeitraege() string {
	res := []string{}
	res = append(res, p.includedParams(p.Query)...)
	res = append(res, p.includedParams(p.AnnotationsString)...)
	res = append(res, p.includedParams(p.PersonsString)...)
	res = append(res, p.includedParams(p.TitleString)...)
	res = append(res, p.includedParams(p.YearString)...)
	res = append(res, p.includedParams(p.EntryString)...)
	res = append(res, p.includedParams(p.IncipitString)...)
	res = append(res, p.includedParams(p.TypeString)...)
	return strings.Join(res, " ")
}

func (p SearchParameters) includedParams(q string) []string {
	res := []string{}
	que := dbmodels.NormalizeQuery(q)
	for _, qq := range que.Include {
		res = append(res, qq)
	}
	for _, qq := range que.UnsafeI {
		res = append(res, qq)
	}
	return res
}

func (p SearchParameters) SortToQueryParams() string {
	return fmt.Sprintf("&sort=%s", p.Sort)
}

func (p SearchParameters) ToQueryParamsBeitraege() string {
	q := "?"

	if p.Extended {
		q += "extended=true"
	}

	if p.Query != "" {
		q += fmt.Sprintf("q=%s", p.Query)

		if p.Title {
			q += "&title=on"
		}

		if p.Persons {
			q += "&persons=on"
		}

		if p.Annotations {
			q += "&annotations=on"
		}

		if p.Year {
			q += "&year=on"
		}

		if p.Entry {
			q += "&entry=on"
		}

		if p.Incipit {
			q += "&incipit=on"
		}

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

	if p.EntryString != "" {
		q += fmt.Sprintf("&entrystring=%s", p.EntryString)
	}

	if p.IncipitString != "" {
		q += fmt.Sprintf("&incipitstring=%s", p.IncipitString)
	}

	if p.TypeString != "" {
		q += fmt.Sprintf("&typestring=%s", p.TypeString)
	}

	return q
}

func (p SearchParameters) ToQueryParamsBaende() string {
	q := "?"

	// TODO: use variables, url escape
	if p.Extended {
		q += "extended=true"
	}

	if p.Query != "" {
		q += fmt.Sprintf("q=%s", p.Query)

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

func (p SearchParameters) IsBeitraegeSearch() bool {
	return p.Collection == "beitraege" && (p.Query != "" || p.TypeString != "" || p.AlmString != "" || p.AnnotationsString != "" || p.PersonsString != "" || p.TitleString != "" || p.YearString != "" || p.EntryString != "" || p.IncipitString != "")
}

func (p SearchParameters) IsBaendeSearch() bool {
	return p.Collection == "baende" && (p.Query != "" || p.AlmString != "" || p.AnnotationsString != "" || p.PersonsString != "" || p.TitleString != "" || p.SeriesString != "" || p.PlacesString != "" || p.RefsString != "" || p.YearString != "")
}

func (p SearchParameters) FieldSetBeitraege() []dbmodels.FTS5QueryRequest {
	ret := []dbmodels.FTS5QueryRequest{}
	if p.Query != "" {
		fields := []string{dbmodels.ID_FIELD}
		if p.Title {
			fields = append(fields, dbmodels.TITLE_STMT_FIELD, dbmodels.SUBTITLE_STMT_FIELD, dbmodels.VARIANT_TITLE_FIELD, dbmodels.PARALLEL_TITLE_FIELD)
		}
		if p.Persons {
			fields = append(fields, dbmodels.RESPONSIBILITY_STMT_FIELD, dbmodels.AGENTS_TABLE)
		}
		if p.Annotations {
			fields = append(fields, dbmodels.ANNOTATION_FIELD)
		}
		if p.Year {
			fields = append(fields, dbmodels.YEAR_FIELD)
		}
		if p.Entry {
			fields = append(fields, dbmodels.ENTRIES_TABLE)
		}
		if p.Incipit {
			fields = append(fields, dbmodels.INCIPIT_STMT_FIELD)
		}

		que := p.NormalizeQuery()
		req := dbmodels.IntoQueryRequests(fields, que)
		ret = append(ret, req...)
	}

	if p.AnnotationsString != "" {
		que := dbmodels.NormalizeQuery(p.AnnotationsString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.ANNOTATION_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.PersonsString != "" {
		que := dbmodels.NormalizeQuery(p.PersonsString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.AGENTS_TABLE, dbmodels.RESPONSIBILITY_STMT_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.TitleString != "" {
		que := dbmodels.NormalizeQuery(p.TitleString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.TITLE_STMT_FIELD, dbmodels.SUBTITLE_STMT_FIELD, dbmodels.VARIANT_TITLE_FIELD, dbmodels.PARALLEL_TITLE_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.YearString != "" {
		que := dbmodels.NormalizeQuery(p.YearString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.YEAR_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.EntryString != "" {
		que := dbmodels.NormalizeQuery(p.EntryString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.ENTRIES_TABLE}, que)
		ret = append(ret, req...)
	}

	if p.IncipitString != "" {
		que := dbmodels.NormalizeQuery(p.IncipitString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.INCIPIT_STMT_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.TypeString != "" {
		que := dbmodels.NormalizeQuery(p.TypeString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.MUSENALM_INHALTE_TYPE_FIELD}, que)
		ret = append(ret, req...)
	}

	return ret
}

func (p SearchParameters) FieldSetBaende() []dbmodels.FTS5QueryRequest {
	ret := []dbmodels.FTS5QueryRequest{}
	if p.Query != "" {
		fields := []string{dbmodels.ID_FIELD}
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
		req := dbmodels.IntoQueryRequests(fields, que)
		ret = append(ret, req...)
	}

	if p.AnnotationsString != "" {
		que := dbmodels.NormalizeQuery(p.AnnotationsString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.ANNOTATION_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.PersonsString != "" {
		que := dbmodels.NormalizeQuery(p.PersonsString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.AGENTS_TABLE, dbmodels.RESPONSIBILITY_STMT_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.TitleString != "" {
		que := dbmodels.NormalizeQuery(p.TitleString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.TITLE_STMT_FIELD, dbmodels.SUBTITLE_STMT_FIELD, dbmodels.INCIPIT_STMT_FIELD, dbmodels.VARIANT_TITLE_FIELD, dbmodels.PARALLEL_TITLE_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.SeriesString != "" {
		que := dbmodels.NormalizeQuery(p.SeriesString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.SERIES_TABLE}, que)
		ret = append(ret, req...)
	}

	if p.PlacesString != "" {
		que := dbmodels.NormalizeQuery(p.PlacesString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.PLACES_TABLE, dbmodels.PLACE_STMT_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.RefsString != "" {
		que := dbmodels.NormalizeQuery(p.RefsString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.REFERENCES_FIELD}, que)
		ret = append(ret, req...)
	}

	if p.YearString != "" {
		que := dbmodels.NormalizeQuery(p.YearString)
		req := dbmodels.IntoQueryRequests([]string{dbmodels.YEAR_FIELD}, que)
		ret = append(ret, req...)
	}

	return ret
}

func (p SearchParameters) IsExtendedSearch() bool {
	return p.AnnotationsString != "" || p.PersonsString != "" || p.TitleString != "" || p.AlmString != "" || p.SeriesString != "" || p.PlacesString != "" || p.RefsString != "" || p.YearString != "" || p.EntryString != "" || p.IncipitString != ""
}

func (p SearchParameters) NormalizeQuery() dbmodels.Query {
	return dbmodels.NormalizeQuery(p.Query)
}

func (p SearchParameters) Prev() int {
	if p.Page > 1 {
		return p.Page - 1
	}
	return 1
}

func (p SearchParameters) Next() int {
	return p.Page + 1
}
