package templating

import (
	"errors"
	"html/template"
	"io"
	"io/fs"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/functions"
	"github.com/pocketbase/pocketbase/core"
	"golang.org/x/net/websocket"
)

const (
	ASSETS_URL_PREFIX = "/assets"
	RELOAD_TEMPLATE   = `
<script type="module">
(function () {
	let relto = -1;
  const scheme = location.protocol === "https:" ? "wss" : "ws";
  // Hardcode port 9000 here:
  const url = scheme + "://" + location.hostname + ":9000/pb/reload";

  function connect() {
    const socket = new WebSocket(url);

    socket.addEventListener("open", function () {
      console.log("Reload socket connected (port 9000).");
    });

    socket.addEventListener("message", function (evt) {
      if (evt.data === "reload") {
        console.log("Received reload signal. Reloading...");
				if (relto !== -1) clearTimeout(relto);
				relto = setTimeout(() => location.reload(), 0);	
      }
    });

    socket.addEventListener("close", function () {
      console.log("Reload socket closed. Reconnecting in 3 seconds...");
      setTimeout(connect, 3000);
    });

    socket.addEventListener("error", function (err) {
      console.error("Reload socket error:", err);
      // We'll let onclose handle reconnection.
    });
  }

  // Initiate the first connection attempt.
  connect();
})();
</script>
`
)

type Engine struct {
	regmu  *sync.Mutex
	debug  bool
	ws     *WsServer
	onceWS sync.Once

	// NOTE: LayoutRegistry and TemplateRegistry have their own syncronization & cache and do not require a mutex here
	LayoutRegistry   *LayoutRegistry
	TemplateRegistry *TemplateRegistry

	mu         *sync.Mutex
	FuncMap    template.FuncMap
	GlobalData map[string]interface{}
}

// INFO: We pass the app here to be able to access the config and other data for functions
// which also means we must reload the engine if the app changes
func NewEngine(layouts, templates *fs.FS) *Engine {
	e := Engine{
		regmu:            &sync.Mutex{},
		mu:               &sync.Mutex{},
		LayoutRegistry:   NewLayoutRegistry(*layouts),
		TemplateRegistry: NewTemplateRegistry(*templates),
		FuncMap:          make(template.FuncMap),
		GlobalData:       make(map[string]interface{}),
	}
	e.funcs()
	return &e
}

func (e *Engine) Debug() {
	e.debug = true

	e.onceWS.Do(func() {
		e.ws = NewWsServer()
		go e.startWsServerOnPort9000()
	})
}

func (e *Engine) startWsServerOnPort9000() {
	// We'll create a basic default mux here and mount /pb/reload
	mux := http.NewServeMux()
	mux.Handle("/pb/reload", websocket.Handler(e.ws.Handler))

	log.Println("[Engine Debug] Starting separate WebSocket server on :9000 for live reload...")
	if err := http.ListenAndServe(":9000", mux); err != nil {
		log.Println("[Engine Debug] WebSocket server error:", err)
	}
}

func (e *Engine) funcs() error {
	e.mu.Lock()
	e.mu.Unlock()

	// Passing HTML
	e.AddFunc("Safe", functions.Safe)
	// Creating an array or dict (to pass to a template)
	e.AddFunc("Arr", functions.Arr)
	e.AddFunc("Dict", functions.Dict)

	// Datatype Functions
	e.AddFunc("HasPrefix", strings.HasPrefix)
	e.AddFunc("Contains", functions.Contains)
	e.AddFunc("Add", functions.Add)
	e.AddFunc("Len", functions.Length)

	// String Functions
	e.AddFunc("Lower", functions.Lower)
	e.AddFunc("Upper", functions.Upper)
	e.AddFunc("First", functions.First)
	e.AddFunc("ReplaceSlashParen", functions.ReplaceSlashParen)
	e.AddFunc("ReplaceSlashParenSlash", functions.ReplaceSlashParenSlash)
	e.AddFunc("LinksAnnotation", functions.LinksAnnotation)

	// Time & Date Functions
	e.AddFunc("Today", functions.Today)
	e.AddFunc("GetMonth", functions.GetMonth)

	// TOC
	e.AddFunc("TOCFromHTML", functions.TOCFromHTML)

	return nil
}

func (e *Engine) Globals(data map[string]interface{}) {
	e.mu.Lock()
	defer e.mu.Unlock()
	if e.GlobalData == nil {
		e.GlobalData = data
	} else {
		for k, v := range data {
			(e.GlobalData)[k] = v
		}
	}
}

func (e *Engine) Load() {
	wg := sync.WaitGroup{}
	wg.Add(2)

	go func() {
		defer wg.Done()
		e.LayoutRegistry.Load()
	}()

	go func() {
		defer wg.Done()
		e.TemplateRegistry.Load()
	}()

	wg.Wait()
}

func (e *Engine) Reload() {
	e.regmu.Lock()
	defer e.regmu.Unlock()
	e.LayoutRegistry = e.LayoutRegistry.Reset()
	e.TemplateRegistry = e.TemplateRegistry.Reset()
	e.Load()
}

func (e *Engine) Refresh() {
	if e.debug && e.ws != nil {
		e.ws.BroadcastReload()
	}
}

// INFO: fn is a function that returns either one value or two values, the second one being an error
func (e *Engine) AddFunc(name string, fn interface{}) {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.FuncMap[name] = fn
}

func (e *Engine) AddFuncs(funcs map[string]interface{}) {
	e.mu.Lock()
	defer e.mu.Unlock()
	for k, v := range funcs {
		e.FuncMap[k] = v
	}
}

func (e *Engine) Render(out io.Writer, path string, ld map[string]interface{}, layout ...string) error {
	gd := e.GlobalData
	if ld == nil {
		ld = make(map[string]interface{})
	}

	// INFO: don't pollute the global data space
	for k, v := range gd {
		_, ok := ld[k]
		if !ok {
			ld[k] = v
		}
	}

	e.mu.Lock()
	defer e.mu.Unlock()
	e.regmu.Lock()
	defer e.regmu.Unlock()
	var l *template.Template
	if layout == nil || len(layout) == 0 {
		lay, err := e.LayoutRegistry.Default(&e.FuncMap)
		if err != nil {
			return err
		}
		l = lay
	} else {
		lay, err := e.LayoutRegistry.Layout(layout[0], &e.FuncMap)
		if err != nil {
			return err
		}
		l = lay
	}

	lay, err := l.Clone()
	if err != nil {
		return err
	}

	err = e.TemplateRegistry.Add(path, lay, &e.FuncMap)
	if err != nil {
		return err
	}

	err = lay.Execute(out, ld)
	if err != nil {
		return err
	}

	return nil
}

func (e *Engine) Response404(request *core.RequestEvent, err error, data map[string]interface{}) error {
	if data == nil {
		data = make(map[string]interface{})
	}

	var sb strings.Builder
	if err != nil {
		request.App.Logger().Error("404 error fetching URL!", "error", err, "request", request.Request.URL)
		data["Error"] = err.Error()
	}

	data["page"] = requestData(request)

	err2 := e.Render(&sb, "/errors/404/", data)
	if err2 != nil {
		return e.Response500(request, errors.Join(err, err2), data)
	}

	return request.HTML(http.StatusNotFound, sb.String())
}

func (e *Engine) Response500(request *core.RequestEvent, err error, data map[string]interface{}) error {
	if data == nil {
		data = make(map[string]interface{})
	}

	var sb strings.Builder
	if err != nil {
		request.App.Logger().Error("500 error fetching URL!", "error", err, "request", request.Request.URL)
		data["Error"] = err.Error()
	}

	data["page"] = requestData(request)

	err2 := e.Render(&sb, "/errors/500/", data)
	if err != nil {
		return request.String(http.StatusInternalServerError, errors.Join(err, err2).Error())
	}

	return request.HTML(http.StatusInternalServerError, sb.String())
}

func (e *Engine) Response200(request *core.RequestEvent, path string, ld map[string]interface{}, layout ...string) error {
	if ld == nil {
		ld = make(map[string]interface{})
	}

	ld["page"] = requestData(request)

	var builder strings.Builder
	err := e.Render(&builder, path, ld, layout...)
	if err != nil {
		return e.Response500(request, err, ld)
	}

	tstring := builder.String()
	if e.debug {
		idx := strings.LastIndex(tstring, "</body>")
		if idx != -1 {
			tstring = tstring[:idx] + RELOAD_TEMPLATE + tstring[idx:]
		}
	}

	return request.HTML(http.StatusOK, tstring)
}

func requestData(request *core.RequestEvent) map[string]interface{} {
	data := make(map[string]interface{})
	data["Path"] = request.Request.URL.Path
	data["Query"] = request.Request.URL.Query()
	data["Method"] = request.Request.Method
	data["Host"] = request.Request.Host
	return data
}
