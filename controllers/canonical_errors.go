package controllers

import (
	"errors"
	"net/http"

	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
)

func canonicalErrorMessage(err error, fallback string) string {
	var validationErr *canonical.ValidationError
	if errors.As(err, &validationErr) {
		return validationErr.Error()
	}

	var conflictErr *canonical.ConflictError
	if errors.As(err, &conflictErr) {
		return conflictErr.Error()
	}

	return fallback
}

func canonicalHTTPStatus(err error, fallback int) int {
	var validationErr *canonical.ValidationError
	if errors.As(err, &validationErr) {
		return http.StatusBadRequest
	}

	var conflictErr *canonical.ConflictError
	if errors.As(err, &conflictErr) {
		return http.StatusConflict
	}

	return fallback
}
