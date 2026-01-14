package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"log/slog"
)

type IApp interface {
	Core() core.App
	ResetDataCache()
	ResetHtmlCache()
	Logger() *slog.Logger
}

type IPage interface {
	Up(app IApp, engine *templating.Engine) error
	Down(app IApp, engine *templating.Engine) error
	Setup(router *router.Router[*core.RequestEvent], app IApp, engine *templating.Engine) error
}
