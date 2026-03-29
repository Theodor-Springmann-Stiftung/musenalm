package controllers

type statusUpdatePayload struct {
	CSRFToken  string `json:"csrf_token" form:"csrf_token"`
	LastEdited string `json:"last_edited" form:"last_edited"`
	Status     string `json:"status" form:"status"`
}
