package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	rep := &ReiheEditPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_REIHE_EDIT_NAME,
			URL:      URL_REIHE_EDIT,
			Template: TEMPLATE_REIHE_EDIT,
			Layout:   pagemodels.LAYOUT_LOGIN_PAGES,
		},
	}
	app.Register(rep)
}

type ReiheEditPage struct {
	pagemodels.StaticPage
}

func (p *ReiheEditPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	store := ia.GetCanonicalStore()
	rg := router.Group(URL_REIHE_ADMIN_BASE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_REIHE_EDIT, p.GET(engine, app))
	rg.POST(URL_REIHE_EDIT, p.POST(engine, app, ia, store))
	rg.POST(URL_REIHE_DELETE, p.POSTDelete(engine, app, ia, store))
	return nil
}

type ReiheEditResult struct {
	Series           *dbmodels.Series
	User             *dbmodels.User
	Prev             *dbmodels.Series
	Next             *dbmodels.Series
	Entries          []*dbmodels.Entry
	Contents         []*dbmodels.Content
	ContentEntries   map[string]*dbmodels.Entry
	ContentTypes     map[string][]string
	PreferredEntries []*dbmodels.Entry
}

func NewReiheEditResult(app core.App, id string) (*ReiheEditResult, error) {
	series, err := dbmodels.Series_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	var user *dbmodels.User
	if series.Editor() != "" {
		u, err := dbmodels.Users_ID(app, series.Editor())
		if err == nil {
			user = u
		} else {
			app.Logger().Error("Failed to load user for series editor", "series", series.Id, "error", err)
		}
	}

	prev, next, err := seriesNeighbors(app, series.Id)
	if err != nil {
		app.Logger().Error("Failed to load series neighbors", "series", series.Id, "error", err)
	}

	entries, _, err := Entries_Series_IDs(app, []any{series.Id})
	if err != nil {
		app.Logger().Error("Failed to load series entries", "series", series.Id, "error", err)
	}
	if len(entries) > 0 {
		dbmodels.Sort_Entries_Year_Title(entries)
	}

	contents, contentEntries, contentTypes, err := seriesContentsDetails(app, entries)
	if err != nil {
		app.Logger().Error("Failed to load series contents", "series", series.Id, "error", err)
	}
	if len(contents) > 0 {
		dbmodels.Sort_Contents_Numbering(contents)
	}

	preferredEntries, err := preferredSeriesEntries(app, series.Id)
	if err != nil {
		app.Logger().Error("Failed to load preferred series entries", "series", series.Id, "error", err)
	}
	if len(preferredEntries) > 0 {
		dbmodels.Sort_Entries_Year_Title(preferredEntries)
	}

	return &ReiheEditResult{
		Series:           series,
		User:             user,
		Prev:             prev,
		Next:             next,
		Entries:          entries,
		Contents:         contents,
		ContentEntries:   contentEntries,
		ContentTypes:     contentTypes,
		PreferredEntries: preferredEntries,
	}, nil
}

func (p *ReiheEditPage) GET(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		result, err := NewReiheEditResult(app, id)
		if err != nil {
			return engine.Response404(e, err, data)
		}
		data["result"] = result

		req := templating.NewRequest(e)
		data["csrf_token"] = req.Session().Token
		data["cancel_url"] = cancelURLFromHeader(e)

		if msg := popFlashSuccess(e); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *ReiheEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string, formdata *reiheEditForm) error {
	id := e.Request.PathValue("id")
	data := make(map[string]any)
	result, err := NewReiheEditResult(app, id)
	if err != nil {
		return engine.Response404(e, err, data)
	}
	if formdata != nil && result != nil && result.Series != nil {
		title := strings.TrimSpace(formdata.Title)
		status := strings.TrimSpace(formdata.Status)
		applySeriesForm(result.Series, *formdata, title, status, nil)
	}
	data["result"] = result
	data["error"] = message

	req := templating.NewRequest(e)
	data["csrf_token"] = req.Session().Token
	data["cancel_url"] = cancelURLFromHeader(e)

	return engine.Response200(e, p.Template, data, p.Layout)
}

type reiheDeletePayload struct {
	CSRFToken  string `json:"csrf_token"`
	LastEdited string `json:"last_edited"`
}

func (p *ReiheEditPage) POSTDelete(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		payload := reiheDeletePayload{}
		if err := e.BindBody(&payload); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültige Formulardaten.",
			})
		}

		if err := req.CheckCSRF(payload.CSRFToken); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": err.Error(),
			})
		}

		series, err := dbmodels.Series_MusenalmID(app, id)
		if err != nil {
			return e.JSON(http.StatusNotFound, map[string]any{
				"error": "Reihe wurde nicht gefunden.",
			})
		}

		expectedUpdatedAt, err := parseExpectedUpdatedAt(payload.LastEdited)
		if err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{
				"error": "Ungültiger Bearbeitungszeitstempel.",
			})
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			return store.DeleteSeries(tx, series, preferredSeriesRelationType, canonical.DeleteOptions{ExpectedUpdatedAt: expectedUpdatedAt}, effects)
		}); err != nil {
			app.Logger().Error("Failed to delete series", "series_id", series.Id, "error", err)
			return e.JSON(canonicalHTTPStatus(err, http.StatusInternalServerError), map[string]any{
				"error": canonicalErrorMessage(err, "Löschen fehlgeschlagen."),
			})
		}

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": URL_REIHEN_REDIRECT,
		})
	}
}

func seriesNeighbors(app core.App, currentID string) (*dbmodels.Series, *dbmodels.Series, error) {
	series := []*dbmodels.Series{}
	if err := app.RecordQuery(dbmodels.SERIES_TABLE).All(&series); err != nil {
		return nil, nil, err
	}
	if len(series) == 0 {
		return nil, nil, nil
	}
	dbmodels.Sort_Series_Title(series)
	for index, item := range series {
		if item.Id != currentID {
			continue
		}
		var prev *dbmodels.Series
		var next *dbmodels.Series
		if index > 0 {
			prev = series[index-1]
		}
		if index+1 < len(series) {
			next = series[index+1]
		}
		return prev, next, nil
	}
	return nil, nil, nil
}

func seriesContentsDetails(app core.App, entries []*dbmodels.Entry) ([]*dbmodels.Content, map[string]*dbmodels.Entry, map[string][]string, error) {
	if len(entries) == 0 {
		return []*dbmodels.Content{}, map[string]*dbmodels.Entry{}, map[string][]string{}, nil
	}
	entryMap := make(map[string]*dbmodels.Entry, len(entries))
	for _, entry := range entries {
		entryMap[entry.Id] = entry
	}

	contents := []*dbmodels.Content{}
	typeMap := make(map[string][]string)
	for _, entry := range entries {
		entryContents, err := dbmodels.Contents_Entry(app, entry.Id)
		if err != nil {
			return nil, nil, nil, err
		}
		for _, content := range entryContents {
			contents = append(contents, content)
			typeMap[content.Id] = append(typeMap[content.Id], content.MusenalmType()...)
		}
	}

	return contents, entryMap, typeMap, nil
}

func preferredSeriesEntries(app core.App, seriesID string) ([]*dbmodels.Entry, error) {
	relations, err := dbmodels.REntriesSeries_Seriess(app, []any{seriesID})
	if err != nil {
		return nil, err
	}
	if len(relations) == 0 {
		return []*dbmodels.Entry{}, nil
	}
	entryIDs := []any{}
	for _, relation := range relations {
		if strings.TrimSpace(relation.Type()) != preferredSeriesRelationType {
			continue
		}
		entryIDs = append(entryIDs, relation.Entry())
	}
	if len(entryIDs) == 0 {
		return []*dbmodels.Entry{}, nil
	}
	return dbmodels.Entries_IDs(app, entryIDs)
}

type reiheEditForm struct {
	CSRFToken  string `form:"csrf_token"`
	LastEdited string `form:"last_edited"`
	SaveAction string `form:"save_action"`
	Title      string `form:"title"`
	Pseudonyms string `form:"pseudonyms"`
	Annotation string `form:"annotation"`
	References string `form:"references"`
	Frequency  string `form:"frequency"`
	Status     string `form:"status"`
	Comment    string `form:"edit_comment"`
}

func applySeriesForm(series *dbmodels.Series, formdata reiheEditForm, title string, status string, user *dbmodels.FixedUser) {
	series.SetTitle(title)
	series.SetPseudonyms(strings.TrimSpace(formdata.Pseudonyms))
	series.SetAnnotation(strings.TrimSpace(formdata.Annotation))
	series.SetReferences(strings.TrimSpace(formdata.References))
	series.SetFrequency(strings.TrimSpace(formdata.Frequency))
	series.SetEditState(status)
	series.SetComment(strings.TrimSpace(formdata.Comment))
	if user != nil && !user.IsSuperuser {
		editorID := user.Id
		series.SetEditor(editorID)
	}
}

func (p *ReiheEditPage) POST(engine *templating.Engine, app core.App, ia pagemodels.IApp, store *canonical.Store) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		formdata := reiheEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.", nil)
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderError(engine, app, e, err.Error(), &formdata)
		}

		series, err := dbmodels.Series_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		expectedUpdatedAt, err := parseExpectedUpdatedAt(formdata.LastEdited)
		if err != nil {
			return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.", &formdata)
		}

		if err := runCanonicalMutation(app, ia, func(tx core.App, effects *canonical.MutationEffects) error {
			editorID := req.EditorUserID()
			return store.UpdateSeries(tx, series, canonical.SeriesInput{
				Title:             formdata.Title,
				Pseudonyms:        formdata.Pseudonyms,
				Annotation:        formdata.Annotation,
				References:        formdata.References,
				Frequency:         formdata.Frequency,
				Status:            formdata.Status,
				Comment:           formdata.Comment,
				EditorID:          editorID,
				ExpectedUpdatedAt: expectedUpdatedAt,
			}, effects)
		}); err != nil {
			app.Logger().Error("Failed to save series", "series_id", series.Id, "error", err)
			return p.renderError(engine, app, e, canonicalErrorMessage(err, "Speichern fehlgeschlagen."), &formdata)
		}

		if strings.TrimSpace(formdata.SaveAction) == "view" {
			redirect := fmt.Sprintf(URL_REIHE_VIEW_FORMAT, id)
			return e.Redirect(http.StatusSeeOther, redirect)
		}
		setFlashSuccess(e, "Änderungen gespeichert.")
		redirect := fmt.Sprintf(URL_REIHE_EDIT_FORMAT, id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
