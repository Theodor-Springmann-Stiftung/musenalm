package controllers

type ContentListFilterParams struct {
	Agent     string
	Type      string
	Page      int
	OnlyScans bool
	AlmNumber int
	Entry     string
}
