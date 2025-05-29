package controllers

import (
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/app"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"math/rand"
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
func (p *IndexPage) Setup(router *router.Router[*core.RequestEvent], app core.App, engine *templating.Engine) error {
	router.GET("/{$}", func(e *core.RequestEvent) error {
		bilder := []*pagemodels.IndexBilder{}
		err := app.RecordQuery(pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_BILDER)).
			All(&bilder)
		if err != nil {
			return engine.Response404(e, err, nil)
		}
		texte := []*pagemodels.IndexTexte{}
		err = app.RecordQuery(pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME)).
			All(&texte)
		if err != nil {
			return engine.Response404(e, err, nil)
		}

		Shuffle(bilder)
		data := map[string]interface{}{
			"bilder": bilder,
			"texte":  texte[0],
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
