package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"log/slog"
)

// BaendeCacheInterface defines the interface for Bände cache operations
// We use an interface with accessor methods to avoid circular dependencies
type BaendeCacheInterface interface {
	GetEntries() interface{}       // Returns []*dbmodels.Entry
	GetSeries() interface{}        // Returns map[string]*dbmodels.Series
	GetEntriesSeries() interface{} // Returns map[string][]*dbmodels.REntriesSeries
	GetPlaces() interface{}        // Returns map[string]*dbmodels.Place
	GetAgents() interface{}        // Returns map[string]*dbmodels.Agent
	GetEntriesAgents() interface{} // Returns map[string][]*dbmodels.REntriesAgents
	GetItems() interface{}         // Returns map[string][]*dbmodels.Item
	GetUsers() interface{}         // Returns map[string]*dbmodels.User
	GetContentsCount() interface{} // Returns map[string]int
}

type IApp interface {
	Core() core.App
	ResetDataCache()
	ResetHtmlCache()
	ResetPagesCache()
	ResetBaendeCache()
	GetBaendeCache() (BaendeCacheInterface, error)
	Logger() *slog.Logger
}

type IPage interface {
	Up(app IApp, engine *templating.Engine) error
	Down(app IApp, engine *templating.Engine) error
	Setup(router *router.Router[*core.RequestEvent], app IApp, engine *templating.Engine) error
}
