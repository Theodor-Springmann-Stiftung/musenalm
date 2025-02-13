package templating

import (
	"html/template"
	"io"
	"io/fs"
	"sync"
)

const (
	ASSETS_URL_PREFIX = "/assets"
)

type Engine struct {
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
		mu:               &sync.Mutex{},
		LayoutRegistry:   NewLayoutRegistry(*layouts),
		TemplateRegistry: NewTemplateRegistry(*templates),
		FuncMap:          make(template.FuncMap),
		GlobalData:       make(map[string]interface{}),
	}
	e.funcs()
	return &e
}

func (e *Engine) funcs() error {
	e.mu.Lock()
	e.mu.Unlock()
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

func (e *Engine) Load() error {
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
	return nil
}

func (e *Engine) Reload() error {
	wg := sync.WaitGroup{}
	wg.Add(2)

	go func() {
		defer wg.Done()
		e.LayoutRegistry.Reset()
	}()

	go func() {
		defer wg.Done()
		e.TemplateRegistry.Reset()
	}()

	wg.Wait()
	return nil
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
	// TODO: check if a reload is needed if files on disk have changed
	gd := e.GlobalData
	for k, v := range ld {
		gd[k] = v
	}

	e.mu.Lock()
	defer e.mu.Unlock()
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

	err = lay.Execute(out, gd)
	if err != nil {
		return err
	}

	return nil
}
