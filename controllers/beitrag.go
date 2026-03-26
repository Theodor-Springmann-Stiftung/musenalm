package controllers

import (
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
		result, err := NewBeitragResult(app, id)
		if err != nil {
			engine.Response404(e, err, nil)
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

func NewBeitragResult(app core.App, id string) (*BeitragResult, error) {
	content, err := dbmodels.Contents_MusenalmID(app, id)
	if err != nil {
		return nil, err
	}

	entry, err := dbmodels.Entries_ID(app, content.Entry())
	if err != nil {
		return nil, err
	}

	acrelations, err := dbmodels.RContentsAgents_Content(app, content.Id)
	if err != nil {
		return nil, err
	}

	return &BeitragResult{
		Entry:          entry,
		Content:        content,
		ContentsAgents: acrelations,
	}, nil
}
