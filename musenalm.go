package main

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	_ "github.com/Theodor-Springmann-Stiftung/musenalm/migrations"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"log"
)

func main() {
	app := app.New(app.Config{})

	migratecmd.MustRegister(app.PB, app.PB.RootCmd, migratecmd.Config{
		Automigrate:  false,
		TemplateLang: migratecmd.TemplateLangGo,
	})

	if err := app.PB.Start(); err != nil {
		log.Fatal(err)
	}
}
