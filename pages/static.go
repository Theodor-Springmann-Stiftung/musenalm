package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
)

func init() {
	RegisterStaticPage("/datenschutz/", pagemodels.P_DATENSCHUTZ_NAME)
	RegisterTextPage("/edition/kontakt/", pagemodels.P_KONTAKT_NAME)
	RegisterTextPage("/edition/danksagungen/", pagemodels.P_DANK_NAME)
	RegisterTextPage("/edition/literatur/", pagemodels.P_LIT_NAME)
	RegisterTextPage("/edition/einfuehrung/", pagemodels.P_EINFUEHRUNG_NAME)
	RegisterTextPage("/edition/dokumentation/", pagemodels.P_DOK_NAME)
}

func RegisterStaticPage(url, name string) {
	app.Register(&pagemodels.StaticPage{
		Name:     name,
		Layout:   templating.DEFAULT_LAYOUT_NAME,
		Template: url,
		URL:      url,
	})
}

// TODO: mocve textpage to defaultpage with T = TextPageRecord
func RegisterTextPage(url, name string) {
	app.Register(&pagemodels.TextPage{
		Name:     name,
		Layout:   templating.DEFAULT_LAYOUT_NAME,
		Template: url,
		URL:      url,
	})
}

func RegisterDefaultPage(url string, name string) {
	app.Register(&pagemodels.DefaultPage[*pagemodels.DefaultPageRecord]{
		Name:     name,
		Layout:   templating.DEFAULT_LAYOUT_NAME,
		Template: url,
		URL:      url,
		Record:   &pagemodels.DefaultPageRecord{},
	})
}
