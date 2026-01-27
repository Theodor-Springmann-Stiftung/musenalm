package dbmodels

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

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

func (i *Image) Description() string {
	return i.GetString(DESCRIPTION_FIELD)
}

func (i *Image) Preview() string {
	return i.GetString(PREVIEW_FIELD)
}

func (i *Image) Image() string {
	return i.GetString(IMAGE_FIELD)
}

func (i *Image) PreviewPath() string {
	preview := i.Preview()
	if preview == "" {
		return ""
	}
	return "/api/files/" + IMAGES_TABLE + "/" + i.Id + "/" + preview
}

func (i *Image) ImagePath() string {
	image := i.Image()
	if image == "" {
		return ""
	}
	return "/api/files/" + IMAGES_TABLE + "/" + i.Id + "/" + image
}

func (i *Image) BildPath() string {
	return i.ImagePath()
}

func (i *Image) VorschauPath() string {
	return i.PreviewPath()
}

func (i *Image) Beschreibung() string {
	return i.Description()
}

func (i *Image) Created() types.DateTime {
	return i.GetDateTime(CREATED_FIELD)
}

func (i *Image) CreatedUnix() int64 {
	t := i.GetDateTime(CREATED_FIELD)
	if t.IsZero() {
		return 0
	}
	return t.Time().Unix()
}
