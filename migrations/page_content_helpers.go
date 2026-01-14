package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

type PageMeta struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Keywords    string `json:"keywords"`
}

func pageDataKey(name string) string {
	return "page." + name
}

func pageHTMLKey(name, section string) string {
	if section == "" {
		return "page." + name
	}
	return "page." + name + "." + section
}

func upsertHTML(app core.App, key, value string) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.HTML_TABLE)
	if err != nil {
		return err
	}

	record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
	if record == nil {
		record = core.NewRecord(collection)
		record.Set(dbmodels.KEY_FIELD, key)
	}
	record.Set(dbmodels.HTML_FIELD, value)
	return app.Save(record)
}

func upsertData(app core.App, key string, value any) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.DATA_TABLE)
	if err != nil {
		return err
	}

	record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
	if record == nil {
		record = core.NewRecord(collection)
		record.Set(dbmodels.KEY_FIELD, key)
	}
	record.Set(dbmodels.VALUE_FIELD, value)
	return app.Save(record)
}

func deleteByKey(app core.App, tableName, key string) error {
	collection, err := app.FindCollectionByNameOrId(tableName)
	if err != nil {
		return err
	}

	record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
	if record != nil {
		return app.Delete(record)
	}
	return nil
}
