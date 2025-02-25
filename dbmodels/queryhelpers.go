package dbmodels

import (
	"iter"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

// INFO: These functions are very abstract interfaces to the DB that help w querying

// BUG: this is not working:
// github.com/pocketbase/pocketbase/apis.NewRouter.panicRecover.func3.1()
//         /home/simon/go/pkg/mod/github.com/pocketbase/pocketbase@v0.25.5/apis/middlewares.go:269 +0x13c
// panic({0x15b34c0?, 0x2831680?})
//         /usr/local/go/src/runtime/panic.go:787 +0x132
// github.com/pocketbase/pocketbase/core.(*Record).FieldsData(0xc000632820)
//         /home/simon/go/pkg/mod/github.com/pocketbase/pocketbase@v0.25.5/core/record_model.go:774 +0x1a
// github.com/pocketbase/pocketbase/core.(*Record).PostScan(0xc000632820)
//         /home/simon/go/pkg/mod/github.com/pocketbase/pocketbase@v0.25.5/core/record_model.go:591 +0x4e
// github.com/pocketbase/dbx.(*Rows).ScanStruct(0xc00052e6d0, {0x175f840?, 0xc000586060?})
//         /home/simon/go/pkg/mod/github.com/pocketbase/dbx@v1.11.0/rows.go:97 +0x32e
// github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels.Iter_TableByField[...].func1()
//         /home/simon/source/musenalm/dbmodels/queryhelpers.go:23 +0x65
// github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels.Iter_REntriesAgents_Agent.func1(0xc000624840)
//         /home/simon/source/musenalm/dbmodels/queries_iter.go:30 +0xae
// github.com/Theodor-Springmann-Stiftung/musenalm/pages.(*PersonResult).FilterEntriesByPerson(0x1762c40?, {0x1dfba88, 0xc000438870}, {0xc00004627c, 0xf}, 0xc000064720)
//         /home/simon/source/musenalm/pages/person.go:111 +0x248
// github.com/Theodor-Springmann-Stiftung/musenalm/pages.NewPersonResult({0x1dfba88, 0xc000438870}, {0xc00004627c, 0xf})
//         /home/simon/source/musenalm/pages/person.go:92 +0x4f
// github.com/Theodor-Springmann-Stiftung/musenalm/pages.(*PersonPage).Setup.func1(0xc0002da000)
//         /home/simon/source/musenalm/pages/person.go:46 +0x1ee
// github.com/pocketbase/pocketbase/tools/hook.(*Hook[...]).Trigger.func1()
//         /home/simon/go/pkg/mod/github.com/pocketbase/pocketbase@v0.25.5/tools/hook/hook.go:169 +0x5d
// github.com/pocketbase/pocketbase/tools/hook.(*Event).Next(0xc0002da000?)
//         /home/simon/go/pkg/mod/github.com/pocketbase/pocketbase@v0.25.5/tools/hook/event.go:32 +0x17
// github.com/pocketbase/pocketbase/apis.NewRouter.BodyLimit.func7(0xc0002da000)
//         /home
func Iter_TableByField[T interface{}](app core.App, table, field string, value interface{}) (iter.Seq2[*T, error], error) {
	rows, err := app.RecordQuery(table).
		Where(dbx.HashExp{field: value}).
		Rows()
	if err != nil {
		return nil, err
	}

	return func(yield func(*T, error) bool) {
		for rows.Next() {
			var item T
			err := rows.ScanStruct(&item)
			if !yield(&item, err) {
				return
			}
		}
	}, nil
}

func Iter_TableByID[T interface{}](app core.App, table, id interface{}) (iter.Seq2[*T, error], error) {
	rows, err := app.RecordQuery(table).
		Where(dbx.HashExp{ID_FIELD: id}).
		Rows()
	if err != nil {
		return nil, err
	}

	return func(yield func(*T, error) bool) {
		for rows.Next() {
			var item T
			rows.Scan(&item)
			if !yield(&item, nil) {
				return
			}
		}
	}, nil
}

func TableByField[T interface{}](app core.App, table, field string, value interface{}) (T, error) {
	var ret T
	err := app.RecordQuery(table).
		Where(dbx.HashExp{field: value}).
		All(&ret)
	if err != nil {
		return ret, err
	}

	return ret, nil
}

func TableByID[T interface{}](app core.App, table, id interface{}) (T, error) {
	var ret T
	err := app.RecordQuery(table).
		Where(dbx.HashExp{ID_FIELD: id}).
		All(&ret)
	if err != nil {
		return ret, err
	}

	return ret, nil
}
