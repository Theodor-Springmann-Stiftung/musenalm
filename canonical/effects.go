package canonical

type EntryFTSMode int

const (
	EntryFTSNone EntryFTSMode = iota
	EntryFTSEntryOnly
	EntryFTSEntryAndContents
)

type MutationEffects struct {
	InvalidateSortedEntries bool
	ResetBaende             bool

	UpdateAgents   map[string]bool
	DeleteAgents   map[string]struct{}
	UpdatePlaces   map[string]bool
	DeletePlaces   map[string]struct{}
	UpdateSeries   map[string]bool
	DeleteSeries   map[string]struct{}
	UpdateEntries  map[string]EntryFTSMode
	DeleteEntries  map[string]struct{}
	UpdateContents map[string]string
	DeleteContents map[string]struct{}
}

func (e *MutationEffects) ensure() {
	if e.UpdateAgents == nil {
		e.UpdateAgents = map[string]bool{}
	}
	if e.DeleteAgents == nil {
		e.DeleteAgents = map[string]struct{}{}
	}
	if e.UpdatePlaces == nil {
		e.UpdatePlaces = map[string]bool{}
	}
	if e.DeletePlaces == nil {
		e.DeletePlaces = map[string]struct{}{}
	}
	if e.UpdateSeries == nil {
		e.UpdateSeries = map[string]bool{}
	}
	if e.DeleteSeries == nil {
		e.DeleteSeries = map[string]struct{}{}
	}
	if e.UpdateEntries == nil {
		e.UpdateEntries = map[string]EntryFTSMode{}
	}
	if e.DeleteEntries == nil {
		e.DeleteEntries = map[string]struct{}{}
	}
	if e.UpdateContents == nil {
		e.UpdateContents = map[string]string{}
	}
	if e.DeleteContents == nil {
		e.DeleteContents = map[string]struct{}{}
	}
}

func (e *MutationEffects) MarkAgentUpdated(id string, related bool) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	if _, deleted := e.DeleteAgents[id]; deleted {
		return
	}
	e.UpdateAgents[id] = e.UpdateAgents[id] || related
}

func (e *MutationEffects) MarkAgentDeleted(id string) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	delete(e.UpdateAgents, id)
	e.DeleteAgents[id] = struct{}{}
}

func (e *MutationEffects) MarkPlaceUpdated(id string, related bool) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	if _, deleted := e.DeletePlaces[id]; deleted {
		return
	}
	e.UpdatePlaces[id] = e.UpdatePlaces[id] || related
}

func (e *MutationEffects) MarkPlaceDeleted(id string) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	delete(e.UpdatePlaces, id)
	e.DeletePlaces[id] = struct{}{}
}

func (e *MutationEffects) MarkSeriesUpdated(id string, related bool) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	if _, deleted := e.DeleteSeries[id]; deleted {
		return
	}
	e.UpdateSeries[id] = e.UpdateSeries[id] || related
}

func (e *MutationEffects) MarkSeriesDeleted(id string) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	delete(e.UpdateSeries, id)
	e.DeleteSeries[id] = struct{}{}
}

func (e *MutationEffects) MarkEntryUpdated(id string, mode EntryFTSMode) {
	if e == nil || id == "" || mode == EntryFTSNone {
		return
	}
	e.ensure()
	if _, deleted := e.DeleteEntries[id]; deleted {
		return
	}
	if current, ok := e.UpdateEntries[id]; !ok || mode > current {
		e.UpdateEntries[id] = mode
	}
}

func (e *MutationEffects) MarkEntryDeleted(id string) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	delete(e.UpdateEntries, id)
	e.DeleteEntries[id] = struct{}{}
}

func (e *MutationEffects) MarkContentUpdated(contentID string, entryID string) {
	if e == nil || contentID == "" || entryID == "" {
		return
	}
	e.ensure()
	if _, deleted := e.DeleteContents[contentID]; deleted {
		return
	}
	e.UpdateContents[contentID] = entryID
}

func (e *MutationEffects) MarkContentDeleted(id string) {
	if e == nil || id == "" {
		return
	}
	e.ensure()
	delete(e.UpdateContents, id)
	e.DeleteContents[id] = struct{}{}
}

func (e MutationEffects) HasAsyncWork() bool {
	return len(e.UpdateAgents) > 0 ||
		len(e.DeleteAgents) > 0 ||
		len(e.UpdatePlaces) > 0 ||
		len(e.DeletePlaces) > 0 ||
		len(e.UpdateSeries) > 0 ||
		len(e.DeleteSeries) > 0 ||
		len(e.UpdateEntries) > 0 ||
		len(e.DeleteEntries) > 0 ||
		len(e.UpdateContents) > 0 ||
		len(e.DeleteContents) > 0
}

func (e MutationEffects) Clone() MutationEffects {
	cloned := MutationEffects{
		InvalidateSortedEntries: e.InvalidateSortedEntries,
		ResetBaende:             e.ResetBaende,
		UpdateAgents:            map[string]bool{},
		DeleteAgents:            map[string]struct{}{},
		UpdatePlaces:            map[string]bool{},
		DeletePlaces:            map[string]struct{}{},
		UpdateSeries:            map[string]bool{},
		DeleteSeries:            map[string]struct{}{},
		UpdateEntries:           map[string]EntryFTSMode{},
		DeleteEntries:           map[string]struct{}{},
		UpdateContents:          map[string]string{},
		DeleteContents:          map[string]struct{}{},
	}

	for id, related := range e.UpdateAgents {
		cloned.UpdateAgents[id] = related
	}
	for id := range e.DeleteAgents {
		cloned.DeleteAgents[id] = struct{}{}
	}
	for id, related := range e.UpdatePlaces {
		cloned.UpdatePlaces[id] = related
	}
	for id := range e.DeletePlaces {
		cloned.DeletePlaces[id] = struct{}{}
	}
	for id, related := range e.UpdateSeries {
		cloned.UpdateSeries[id] = related
	}
	for id := range e.DeleteSeries {
		cloned.DeleteSeries[id] = struct{}{}
	}
	for id, mode := range e.UpdateEntries {
		cloned.UpdateEntries[id] = mode
	}
	for id := range e.DeleteEntries {
		cloned.DeleteEntries[id] = struct{}{}
	}
	for id, entryID := range e.UpdateContents {
		cloned.UpdateContents[id] = entryID
	}
	for id := range e.DeleteContents {
		cloned.DeleteContents[id] = struct{}{}
	}

	return cloned
}
