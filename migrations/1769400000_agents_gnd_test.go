package migrations

import (
	"testing"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func TestEnsureAgentsDataFieldAddsJSONField(t *testing.T) {
	pb := pocketbase.NewWithConfig(pocketbase.Config{DefaultDataDir: t.TempDir()})
	if err := pb.Bootstrap(); err != nil {
		t.Fatalf("Bootstrap: %v", err)
	}

	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: dbmodels.AGENTS_NAME_FIELD, Required: true},
	)
	if err := pb.Save(collection); err != nil {
		t.Fatalf("save agents collection: %v", err)
	}

	if err := ensureAgentsDataField(pb); err != nil {
		t.Fatalf("ensureAgentsDataField: %v", err)
	}

	saved, err := pb.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		t.Fatalf("reload agents collection: %v", err)
	}
	if saved.Fields.GetByName(dbmodels.DATA_FIELD) == nil {
		t.Fatal("expected data field to be added")
	}
}

func TestEnsureAgentsDataFieldNoopWhenFieldExists(t *testing.T) {
	pb := pocketbase.NewWithConfig(pocketbase.Config{DefaultDataDir: t.TempDir()})
	if err := pb.Bootstrap(); err != nil {
		t.Fatalf("Bootstrap: %v", err)
	}

	collection := core.NewBaseCollection(dbmodels.AGENTS_TABLE)
	collection.Fields = core.NewFieldsList(
		&core.TextField{Name: dbmodels.AGENTS_NAME_FIELD, Required: true},
		&core.JSONField{Name: dbmodels.DATA_FIELD},
	)
	if err := pb.Save(collection); err != nil {
		t.Fatalf("save agents collection: %v", err)
	}

	if err := ensureAgentsDataField(pb); err != nil {
		t.Fatalf("ensureAgentsDataField: %v", err)
	}

	saved, err := pb.FindCollectionByNameOrId(dbmodels.AGENTS_TABLE)
	if err != nil {
		t.Fatalf("reload agents collection: %v", err)
	}
	if saved.Fields.GetByName(dbmodels.DATA_FIELD) == nil {
		t.Fatal("expected data field to remain present")
	}
	if count := countFieldByName(saved.Fields, dbmodels.DATA_FIELD); count != 1 {
		t.Fatalf("expected exactly one data field, got %d", count)
	}
}

func countFieldByName(fields core.FieldsList, name string) int {
	count := 0
	for _, field := range fields {
		if field.GetName() == name {
			count++
		}
	}
	return count
}
