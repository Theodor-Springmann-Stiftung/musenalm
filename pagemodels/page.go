package pagemodels

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/templating"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"log/slog"
	"time"
)

// BaendeCacheInterface defines the interface for Bände cache operations
// We use an interface with accessor methods to avoid circular dependencies
type BaendeCacheInterface interface {
	GetEntries() interface{}       // Returns []*dbmodels.Entry
	GetSortedEntries() interface{} // Returns map[string][]*dbmodels.Entry
	GetUsers() interface{}         // Returns map[string]*dbmodels.User
	GetCachedAt() time.Time
}

type IApp interface {
	Core() core.App
	ResetDataCache()
	ResetHtmlCache()
	ResetPagesCache()
	ResetBaendeCache()
	GetBaendeCache() (BaendeCacheInterface, error)
	GetCanonicalStore() *canonical.Store
	HandleCanonicalEffects(core.App, canonical.MutationEffects)
	Logger() *slog.Logger
}

type IPage interface {
	Up(app IApp, engine *templating.Engine) error
	Down(app IApp, engine *templating.Engine) error
	Setup(router *router.Router[*core.RequestEvent], app IApp, engine *templating.Engine) error
}
