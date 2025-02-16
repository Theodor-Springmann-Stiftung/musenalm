package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
)

func init() {
	RegisterStaticPage("/datenschutz/")
	RegisterDefaultPage("/edition/kontakt/", pagemodels.P_KONTAKT_NAME)
	RegisterDefaultPage("/edition/danksagungen/", pagemodels.P_DANK_NAME)
	RegisterDefaultPage("/edition/literatur/", pagemodels.P_LIT_NAME)
	RegisterDefaultPage("/edition/einfuehrung/", pagemodels.P_EINFUEHRUNG_NAME)
}

func RegisterStaticPage(url string) {
	app.Register(&pagemodels.Page{
		Name:     url,
		Layout:   templating.DEFAULT_LAYOUT_NAME,
		Template: url,
	})
}

func RegisterDefaultPage(url string, name string) {
	app.Register(&pagemodels.DefaultPage{
		Page: pagemodels.Page{
			Name:     name,
			Layout:   templating.DEFAULT_LAYOUT_NAME,
			Template: url,
		},
		URL: url,
	})
}
