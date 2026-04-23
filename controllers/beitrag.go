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
	Entry        *dbmodels.Entry
	Content      *dbmodels.Content
	PrevByNumber *dbmodels.Content
	NextByNumber *dbmodels.Content

	ContentsAgents []*dbmodels.RContentsAgents // <- Key is content id
}

func filterContentsAgentsByPublicIDs(app core.App, rels []*dbmodels.RContentsAgents) []*dbmodels.RContentsAgents {
	ids := make([]any, 0, len(rels))
	for _, r := range rels {
		ids = append(ids, r.Agent())
	}
	publicIDs, err := dbmodels.PublicAgentIDSet(app, ids)
	if err != nil {
		return rels
	}
	out := rels[:0]
	for _, r := range rels {
		if _, ok := publicIDs[r.Agent()]; ok {
			out = append(out, r)
		}
	}
	return out
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
	acrelations = filterContentsAgentsByPublicIDs(app, acrelations)

	entryContents, err := dbmodels.Contents_Entry(app, entry.Id)
	if err != nil {
		return nil, false, err
	}
	dbmodels.Sort_Contents_Numbering(entryContents)

	var prevByNumber *dbmodels.Content
	var nextByNumber *dbmodels.Content
	for i, candidate := range entryContents {
		if candidate.Id != content.Id {
			continue
		}
		if i > 0 {
			prevByNumber = entryContents[i-1]
		}
		if i+1 < len(entryContents) {
			nextByNumber = entryContents[i+1]
		}
		break
	}

	return &BeitragResult{
		Entry:          entry,
		Content:        content,
		PrevByNumber:   prevByNumber,
		NextByNumber:   nextByNumber,
		ContentsAgents: acrelations,
	}, redirect, nil
}
