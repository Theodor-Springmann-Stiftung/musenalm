package controllers

import (
	"math/rand"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

func init() {
	ip := &IndexPage{
		DefaultPage: pagemodels.DefaultPage[*pagemodels.IndexTexte]{
			Name: pagemodels.P_INDEX_NAME,
		},
	}
	app.Register(ip)
}

type IndexPage struct {
	pagemodels.DefaultPage[*pagemodels.IndexTexte]
}

// TODO:
func (p *IndexPage) Setup(router *router.Router[*core.RequestEvent], ia pagemodels.IApp, engine *templating.Engine) error {
	app := ia.Core()
	router.GET("/{$}", func(e *core.RequestEvent) error {
		bilder, err := dbmodels.Images_KeyPrefix(app, "page.index.image.")
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		Shuffle(bilder)
		data := map[string]interface{}{
			"bilder": bilder,
		}

		return engine.Response200(e, "/", data, "blank")

	})
	return nil
}

func Shuffle[T any](arr []T) {
	rand.Seed(time.Now().UnixNano()) // Ensure random seed
	n := len(arr)
	for i := n - 1; i > 0; i-- {
		j := rand.Intn(i + 1)           // Get a random index
		arr[i], arr[j] = arr[j], arr[i] // Swap
	}
}
