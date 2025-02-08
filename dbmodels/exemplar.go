package dbmodels

type Exemplar struct {
	Location   string `json:",omitempty"`
	Identifier string `json:",omitempty"`
	Annotation string `json:",omitempty"`
	Condition  string `json:",omitempty"`
	Owner      string `json:",omitempty"`
	Media      string `json:",omitempty"`
}
