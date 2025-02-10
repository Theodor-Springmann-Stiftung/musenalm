package app

import "github.com/Theodor-Springmann-Stiftung/musenalm/pagemodels"

var pages []pagemodels.IPage

func Register(page pagemodels.IPage) {
	pages = append(pages, page)
}
