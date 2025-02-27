package main

import (
	"log"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/migrations"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_danksagungen"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_dokumentation"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_einfuehrung"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_index"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_kontakt"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_literatur"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/pages/migrations_reihen"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
)

const (
	DEV_CONFIG     = "config.dev.json"
	DEFAULT_CONFIG = "config.json"
)

func main() {
	cfg := app.NewConfigProvider([]string{DEFAULT_CONFIG}, []string{DEV_CONFIG})
	if err := cfg.Read(); err != nil {
		helpers.Assert(err, "Error reading config")
	}

	app := app.New(*cfg.Config)

	migratecmd.MustRegister(app.PB, app.PB.RootCmd, migratecmd.Config{
		Automigrate:  false,
		TemplateLang: migratecmd.TemplateLangGo,
	})

	if err := app.Serve(); err != nil {
		log.Fatal(err)
	}
}
