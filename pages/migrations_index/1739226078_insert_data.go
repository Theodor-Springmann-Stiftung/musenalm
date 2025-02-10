package migrations_index

import (
	"bufio"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"
	"github.com/Theodor-Springmann-Stiftung/musenalm/xmlmodels"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/filesystem"
)

func init() {
	m.Register(func(app core.App) error {
		images := readImages(app, xmlmodels.STATIC_IMG_PATH, xmlmodels.BESCHREIBUNGEN_FN)
		for _, image := range images {
			if err := app.Save(image); err != nil {
				app.Logger().Error("Failed to save image:", "error", err, "image", image)
			}
		}
		return nil
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(
			pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_BILDER))
		if err == nil && collection != nil {
			app.DB().NewQuery("DELETE FROM " + collection.TableName()).Execute()
		}
		return nil
	})
}

func readDescriptions(collection *core.Collection, filePath string) (map[string]*pagemodels.IndexBilder, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	images := make(map[string]*pagemodels.IndexBilder)
	var filename string

	for scanner.Scan() {
		line := scanner.Text()
		if strings.HasPrefix(line, "# ") {
			filename = strings.TrimPrefix(line, "# ")
			images[filename] = pagemodels.NewIndexBilder(core.NewRecord(collection))
		} else if strings.HasPrefix(line, "## ") {
			title := strings.TrimPrefix(line, "## ")
			images[filename].SetTitel(title)
		} else if strings.HasPrefix(line, "### ") {
			beschr := strings.TrimPrefix(line, "### ")
			images[filename].SetBeschreibung(beschr)
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return images, nil
}

func readImages(app core.App, path, description_fn string) []*pagemodels.IndexBilder {
	ret := make([]*pagemodels.IndexBilder, 0)
	collection, err := app.FindCollectionByNameOrId(
		pagemodels.GeneratePageTableName(pagemodels.P_INDEX_NAME, pagemodels.T_INDEX_BILDER))
	if err != nil {
		app.Logger().Error("Could not find Table Bilder! You need to execute table migrations first!")
		return ret
	}

	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ret
	}

	descriptionPath := filepath.Join(path, description_fn)
	images, err := readDescriptions(collection, descriptionPath)
	if err != nil {
		app.Logger().Error("Failed to read descriptions file:", "error", err)
		app.Logger().Info("Proceeding without descriptions")
		return ret
	}

	e := func(path string, fileInfo os.FileInfo, inpErr error) (err error) {
		name := fileInfo.Name()
		titleWithoutExt := strings.TrimSuffix(name, filepath.Ext(name))
		if !fileInfo.IsDir() &&
			(strings.HasSuffix(name, ".png") ||
				strings.HasSuffix(name, ".jpg") ||
				strings.HasSuffix(name, ".jpeg")) {
			if strings.HasSuffix(strings.TrimSuffix(name, filepath.Ext(name)), "-vorschau") {
				return nil
			}

			info, exists := images[name]
			if exists {
				info.SetTitel(titleWithoutExt)
			} else {
				fn := strings.TrimSuffix(name, "-hintergrund"+filepath.Ext(name))
				info, exists = images[fn]
				if exists {
					info.SetTitel(titleWithoutExt)
				} else {
					return nil
				}
			}

			f, err := filesystem.NewFileFromPath(path)
			if err != nil {
				app.Logger().Error("Failed to create file from path:", "error", err)
				return nil
			}

			info.SetBild(f)

			previewName := strings.TrimSuffix(name, filepath.Ext(name)) + "-vorschau" + filepath.Ext(name)
			previewPath := filepath.Join(filepath.Dir(path), previewName)
			if _, err := os.Stat(previewPath); err == nil {
				previewFile, err := filesystem.NewFileFromPath(previewPath)
				if err != nil {
					log.Println(err)
					return nil
				}
				info.SetVorschau(previewFile)

				ret = append(ret, info)
			}
		}
		return nil
	}

	if err := filepath.Walk(path, e); err != nil {
		app.Logger().Error("Failed to walk path:", "error", err)
	}

	return ret
}
