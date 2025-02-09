package dbmodels

type Deprecated struct {
	Reihentitel string   `json:"reihentitel"`
	Norm        string   `json:"norm"`
	BiblioID    int      `json:"biblio"`
	Status      []string `json:"status"`
	Gesichtet   bool     `json:"gesichtet"`
	Erfasst     bool     `json:"erfasst"`
}
