package controllers

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/canonical"
	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/pocketbase/pocketbase/core"
)

func runCanonicalMutation(app core.App, ia pagemodels.IApp, fn func(tx core.App, effects *canonical.MutationEffects) error) error {
	effects := canonical.MutationEffects{}
	if err := app.RunInTransaction(func(tx core.App) error {
		return fn(tx, &effects)
	}); err != nil {
		return err
	}
	ia.HandleCanonicalEffects(app, effects)
	return nil
}
