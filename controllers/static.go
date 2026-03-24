package controllers

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
)

type HandleFunc func(e *core.RequestEvent) error

func init() {
	RegisterStaticPage(URL_DATENSCHUTZ, pagemodels.P_DATENSCHUTZ_NAME)
	RegisterTextPage(URL_REDAKTION_KONTAKT, pagemodels.P_KONTAKT_NAME)
	RegisterTextPage(URL_REDAKTION_DANKSAGUNGEN, pagemodels.P_DANK_NAME)
	RegisterTextPage(URL_REDAKTION_LITERATUR, pagemodels.P_LIT_NAME)
	RegisterTextPage(URL_REDAKTION_EINLEITUNG, pagemodels.P_EINFUEHRUNG_NAME)
	RegisterTextPage(URL_REDAKTION_HINWEISE, pagemodels.P_DOK_NAME)
	RegisterTextPage(URL_REDAKTION_LESEKABINETT, pagemodels.P_KABINETT_NAME)
}

func RegisterStaticPage(url, name string, layout ...string) {
	layoutName := templating.DEFAULT_LAYOUT_NAME
	if len(layout) > 0 {
		layoutName = layout[0]
	}

	app.Register(&pagemodels.StaticPage{
		Name:     name,
		Layout:   layoutName,
		Template: url,
		URL:      url,
	})
}

// TODO: mocve textpage to defaultpage with T = TextPageRecord
func RegisterTextPage(url, name string, layout ...string) {
	layoutName := templating.DEFAULT_LAYOUT_NAME
	if len(layout) > 0 {
		layoutName = layout[0]
	}

	app.Register(&pagemodels.TextPage{
		Name:     name,
		Layout:   layoutName,
		Template: url,
		URL:      url,
	})
}

func RegisterDefaultPage(url string, name string, layout ...string) {
	layoutName := templating.DEFAULT_LAYOUT_NAME
	if len(layout) > 0 {
		layoutName = layout[0]
	}

	app.Register(&pagemodels.DefaultPage[*pagemodels.DefaultPageRecord]{
		Name:     name,
		Layout:   layoutName,
		Template: url,
		URL:      url,
		Record:   &pagemodels.DefaultPageRecord{},
	})
}
