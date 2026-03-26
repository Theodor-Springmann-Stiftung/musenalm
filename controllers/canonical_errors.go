package controllers

import (
	"errors"
	"net/http"
	"time"

	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/pocketbase/pocketbase/tools/types"
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

func parseExpectedUpdatedAt(value string) (*time.Time, error) {
	if value == "" {
		return nil, nil
	}
	parsed, err := types.ParseDateTime(value)
	if err != nil {
		return nil, err
	}
	expected := parsed.Time()
	return &expected, nil
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
