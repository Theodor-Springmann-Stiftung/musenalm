package dbmodels

import "github.com/pocketbase/pocketbase/core"

type Image struct {
	core.BaseRecordProxy
}

func (i *Image) Key() string {
	return i.GetString(KEY_FIELD)
}

func (i *Image) SetKey(key string) {
	i.Set(KEY_FIELD, key)
}

func (i *Image) Title() string {
	return i.GetString(TITLE_FIELD)
}

func (i *Image) SetTitle(title string) {
	i.Set(TITLE_FIELD, title)
}

func (i *Image) Description() string {
	return i.GetString(DESCRIPTION_FIELD)
}

func (i *Image) SetDescription(description string) {
	i.Set(DESCRIPTION_FIELD, description)
}

func (i *Image) Preview() string {
	return i.GetString(PREVIEW_FIELD)
}

func (i *Image) SetPreview(preview string) {
	i.Set(PREVIEW_FIELD, preview)
}

func (i *Image) ImageFile() string {
	return i.GetString(IMAGE_FIELD)
}

func (i *Image) SetImageFile(image string) {
	i.Set(IMAGE_FIELD, image)
}
