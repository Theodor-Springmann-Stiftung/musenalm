package controllers

import (
	"fmt"
	"net/http"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	rp := &BeitragPage{
		StaticPage: pagemodels.StaticPage{
			Name:     pagemodels.P_BEITRAG_NAME,
			URL:      URL_BEITRAG,
			Template: TEMPLATE_BEITRAG,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
		},
	}
	app.Register(rp)
}

type BeitragPage struct {
	pagemodels.StaticPage
}

func (p *BeitragPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET(p.URL, func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		data := make(map[string]any)
		result, redirect, err := NewBeitragResult(app, id)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		if redirect {
			return e.Redirect(http.StatusFound, fmt.Sprintf(URL_BEITRAG_VIEW_FORMAT, result.Content.MusenalmID()))
		}
		data["result"] = result

		return engine.Response200(e, p.Template, data)
	})

	return nil
}

type BeitragResult struct {
	Entry   *dbmodels.Entry
	Content *dbmodels.Content

	ContentsAgents []*dbmodels.RContentsAgents // <- Key is content id
}

func NewBeitragResult(app core.App, id string) (*BeitragResult, bool, error) {
	content, redirect, err := dbmodels.ResolveContentByPermalink(app, id)
	if err != nil {
		return nil, false, err
	}

	entry, err := dbmodels.Entries_ID(app, content.Entry())
	if err != nil {
		return nil, false, err
	}

	acrelations, err := dbmodels.RContentsAgents_Content(app, content.Id)
	if err != nil {
		return nil, false, err
	}

	return &BeitragResult{
		Entry:          entry,
		Content:        content,
		ContentsAgents: acrelations,
	}, redirect, nil
}
