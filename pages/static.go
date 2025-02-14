package pages

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
)

func init() {
	RegisterStaticPage("/datenschutz/")
}

func RegisterStaticPage(url string) {
	app.Register(&pagemodels.Page{
		Name:     url,
		Layout:   templating.DEFAULT_LAYOUT_NAME,
		Template: url,
	})
}
