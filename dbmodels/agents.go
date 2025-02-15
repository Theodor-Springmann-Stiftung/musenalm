package dbmodels

import (
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

func AgentForId(app core.App, id string) (*Agent, error) {
	agent := &Agent{}
	err := app.RecordQuery(AGENTS_TABLE).
		Where(dbx.HashExp{ID_FIELD: id}).
		One(agent)
	if err != nil {
		return nil, err
	}
	return agent, nil
}
