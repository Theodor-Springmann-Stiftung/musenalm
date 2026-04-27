package controllers

type statusUpdatePayload struct {
	CSRFToken string `json:"csrf_token" form:"csrf_token"`
	Status    string `json:"status" form:"status"`
}
