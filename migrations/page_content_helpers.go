package migrations

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

type PageMeta struct {
	Title       string `json:"title"`
	URL         string `json:"url"`
	Description string `json:"description"`
	Keywords    string `json:"keywords"`
}

func pageHTMLKey(name, section string) string {
	if section == "" {
		return "page." + name
	}
	return "page." + name + "." + section
}

func upsertPageMeta(app core.App, key string, meta PageMeta) error {
	collection, err := app.FindCollectionByNameOrId(dbmodels.PAGES_TABLE)
	if err != nil {
		return err
	}

	record, _ := app.FindFirstRecordByData(collection.Id, dbmodels.KEY_FIELD, key)
	if record == nil {
		record = core.NewRecord(collection)
		record.Set(dbmodels.KEY_FIELD, key)
	}
	record.Set(dbmodels.TITLE_FIELD, meta.Title)
	if meta.URL != "" {
		record.Set(dbmodels.URL_FIELD, meta.URL)
	}

	data := map[string]any{}
	if existing := record.Get(dbmodels.DATA_FIELD); existing != nil {
		if existingMap, ok := existing.(map[string]any); ok {
			data = existingMap
		} else if existingMap, ok := existing.(map[string]interface{}); ok {
			data = map[string]any(existingMap)
		}
	}
	data["description"] = meta.Description
	data["keywords"] = meta.Keywords
	record.Set(dbmodels.DATA_FIELD, data)
	return app.Save(record)
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
