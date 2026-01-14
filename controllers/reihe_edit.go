package controllers

import (
	"fmt"
	"net/http"
	"slices"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/middleware"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/types"
)

const (
	URL_REIHE_EDIT      = "edit"
	URL_REIHE_DELETE    = "edit/delete"
	TEMPLATE_REIHE_EDIT = "/reihe/edit/"
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
	rg := router.Group(URL_REIHE)
	rg.BindFunc(middleware.IsAdminOrEditor())
	rg.GET(URL_REIHE_EDIT, p.GET(engine, app))
	rg.POST(URL_REIHE_EDIT, p.POST(engine, app))
	rg.POST(URL_REIHE_DELETE, p.POSTDelete(engine, app))
	return nil
}

type ReiheEditResult struct {
	Series *dbmodels.Series
	User   *dbmodels.User
	Prev   *dbmodels.Series
	Next   *dbmodels.Series
	Entries []*dbmodels.Entry
	Contents []*dbmodels.Content
	ContentEntries map[string]*dbmodels.Entry
	ContentTypes map[string][]string
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

		if msg := e.Request.URL.Query().Get("saved_message"); msg != "" {
			data["success"] = msg
		}

		return engine.Response200(e, p.Template, data, p.Layout)
	}
}

func (p *ReiheEditPage) renderError(engine *templating.Engine, app core.App, e *core.RequestEvent, message string) error {
	id := e.Request.PathValue("id")
	data := make(map[string]any)
	result, err := NewReiheEditResult(app, id)
	if err != nil {
		return engine.Response404(e, err, data)
	}
	data["result"] = result
	data["error"] = message

	req := templating.NewRequest(e)
	data["csrf_token"] = req.Session().Token

	return engine.Response200(e, p.Template, data, p.Layout)
}

type reiheDeletePayload struct {
	CSRFToken  string `json:"csrf_token"`
	LastEdited string `json:"last_edited"`
}

func (p *ReiheEditPage) POSTDelete(engine *templating.Engine, app core.App) HandleFunc {
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

		if payload.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(payload.LastEdited)
			if err != nil {
				return e.JSON(http.StatusBadRequest, map[string]any{
					"error": "Ungültiger Bearbeitungszeitstempel.",
				})
			}
			if !series.Updated().Time().Equal(lastEdited.Time()) {
				return e.JSON(http.StatusConflict, map[string]any{
					"error": "Die Reihe wurde inzwischen geändert. Bitte Seite neu laden.",
				})
			}
		}

		preferredEntries, err := preferredSeriesEntries(app, series.Id)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Löschen fehlgeschlagen.",
			})
		}

		if err := app.RunInTransaction(func(tx core.App) error {
			for _, entry := range preferredEntries {
				if err := deleteEntryRelations(tx, entry.Id); err != nil {
					return err
				}
				if err := deleteEntryItems(tx, entry.Id); err != nil {
					return err
				}
				if err := deleteEntryContents(tx, entry.Id); err != nil {
					return err
				}
				record, err := tx.FindRecordById(dbmodels.ENTRIES_TABLE, entry.Id)
				if err != nil {
					continue
				}
				if err := tx.Delete(record); err != nil {
					return err
				}
			}

			relations, err := dbmodels.REntriesSeries_Seriess(tx, []any{series.Id})
			if err != nil {
				return err
			}
			relationsTable := dbmodels.RelationTableName(dbmodels.ENTRIES_TABLE, dbmodels.SERIES_TABLE)
			for _, relation := range relations {
				record, err := tx.FindRecordById(relationsTable, relation.Id)
				if err != nil {
					continue
				}
				if err := tx.Delete(record); err != nil {
					return err
				}
			}

			record, err := tx.FindRecordById(dbmodels.SERIES_TABLE, series.Id)
			if err != nil {
				return err
			}
			return tx.Delete(record)
		}); err != nil {
			app.Logger().Error("Failed to delete series", "series_id", series.Id, "error", err)
			return e.JSON(http.StatusInternalServerError, map[string]any{
				"error": "Löschen fehlgeschlagen.",
			})
		}

		// Delete series and entries from FTS5 asynchronously
		go func(appInstance core.App, seriesID string, deletedEntries []*dbmodels.Entry) {
			if err := dbmodels.DeleteFTS5Series(appInstance, seriesID); err != nil {
				appInstance.Logger().Error("Failed to delete series from FTS5", "series_id", seriesID, "error", err)
			}

			for _, entry := range deletedEntries {
				if err := dbmodels.DeleteFTS5Entry(appInstance, entry.Id); err != nil {
					appInstance.Logger().Error("Failed to delete FTS5 entry", "entry_id", entry.Id, "error", err)
				}
			}
		}(app, series.Id, preferredEntries)

		return e.JSON(http.StatusOK, map[string]any{
			"success":  true,
			"redirect": "/reihen",
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
	if user != nil {
		series.SetEditor(user.Id)
	}
}

func (p *ReiheEditPage) POST(engine *templating.Engine, app core.App) HandleFunc {
	return func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		req := templating.NewRequest(e)

		formdata := reiheEditForm{}
		if err := e.BindBody(&formdata); err != nil {
			return p.renderError(engine, app, e, "Formulardaten ungültig.")
		}

		if err := req.CheckCSRF(formdata.CSRFToken); err != nil {
			return p.renderError(engine, app, e, err.Error())
		}

		series, err := dbmodels.Series_MusenalmID(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		if formdata.LastEdited != "" {
			lastEdited, err := types.ParseDateTime(formdata.LastEdited)
			if err != nil {
				return p.renderError(engine, app, e, "Ungültiger Bearbeitungszeitstempel.")
			}
			if !series.Updated().Time().Equal(lastEdited.Time()) {
				return p.renderError(engine, app, e, "Die Reihe wurde inzwischen geändert. Bitte Seite neu laden.")
			}
		}

		title := strings.TrimSpace(formdata.Title)
		if title == "" {
			return p.renderError(engine, app, e, "Reihentitel ist erforderlich.")
		}

		status := strings.TrimSpace(formdata.Status)
		if status == "" || !slices.Contains(dbmodels.EDITORSTATE_VALUES, status) {
			return p.renderError(engine, app, e, "Ungültiger Status.")
		}

		// Capture old title (entries depend on series title)
		oldTitle := series.Title()

		user := req.User()
		if err := app.RunInTransaction(func(tx core.App) error {
			applySeriesForm(series, formdata, title, status, user)
			return tx.Save(series)
		}); err != nil {
			app.Logger().Error("Failed to save series", "series_id", series.Id, "error", err)
			return p.renderError(engine, app, e, "Speichern fehlgeschlagen.")
		}

		// Check if title changed (entries store series title)
		titleChanged := series.Title() != oldTitle

		// Update FTS5 index for series and conditionally update related entries asynchronously
		go func(appInstance core.App, seriesID string, updateEntries bool) {
			freshSeries, err := dbmodels.Series_ID(appInstance, seriesID)
			if err != nil {
				appInstance.Logger().Error("Failed to load series for FTS5 update", "series_id", seriesID, "error", err)
				return
			}
			// If title changed, update series + entries. Otherwise just update series.
			if updateEntries {
				if err := dbmodels.UpdateFTS5SeriesAndRelatedEntries(appInstance, freshSeries); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 index for series and entries", "series_id", seriesID, "error", err)
				}
			} else {
				if err := dbmodels.UpdateFTS5Series(appInstance, freshSeries); err != nil {
					appInstance.Logger().Error("Failed to update FTS5 index for series", "series_id", seriesID, "error", err)
				}
			}
		}(app, series.Id, titleChanged)

		redirect := fmt.Sprintf("/reihe/%s/", id)
		return e.Redirect(http.StatusSeeOther, redirect)
	}
}
