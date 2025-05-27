package dbmodels

import (
	"reflect"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

// INFO: These functions are very abstract interfaces to the DB that help w querying

const (
	QUERY_PARTITION_SIZE = 1200
)

// BUG: this is not working, throws an exception
// github.com/pocketbase/pocketbase/apis.NewRouter.panicRecover.func3.1()
//
// func Iter_TableByField[T interface{}](app core.App, table, field string, value interface{}) (iter.Seq2[*T, error], error) {
// 	rows, err := app.RecordQuery(table).
// 		Where(dbx.HashExp{field: value}).
// 		Rows()
// 	if err != nil {
// 		return nil, err
// 	}
//
// 	return func(yield func(*T, error) bool) {
// 		for rows.Next() {
// 			var item T
// 			err := rows.ScanStruct(&item)
// 			if !yield(&item, err) {
// 				return
// 			}
// 		}
// 	}, nil
// }
//
// func Iter_TableByID[T interface{}](app core.App, table, id interface{}) (iter.Seq2[*T, error], error) {
// 	rows, err := app.RecordQuery(table).
// 		Where(dbx.HashExp{ID_FIELD: id}).
// 		Rows()
// 	if err != nil {
// 		return nil, err
// 	}
//
// 	return func(yield func(*T, error) bool) {
// 		for rows.Next() {
// 			var item T
// 			rows.Scan(&item)
// 			if !yield(&item, nil) {
// 				return
// 			}
// 		}
// 	}, nil
// }

func TableByField[T interface{}](app core.App, table, field string, value string) (T, error) {
	var ret T
	err := app.RecordQuery(table).
		Where(dbx.HashExp{field: value}).
		One(&ret)
	if err != nil {
		return ret, err
	}

	return ret, nil
}

func TableByFields[T interface{}](app core.App, table, field string, values any) ([]T, error) {
	var ret []T
	if reflect.TypeOf(values).Kind() == reflect.Slice {
		v := values.([]any)
		if len(v) > QUERY_PARTITION_SIZE {
			for i := 0; i < len(v); i += QUERY_PARTITION_SIZE {
				part := v[i:]
				if len(part) > QUERY_PARTITION_SIZE {
					part = part[:QUERY_PARTITION_SIZE]
				}

				var partret []T
				err := app.RecordQuery(table).
					Where(dbx.HashExp{field: part}).
					All(&partret)
				if err != nil {
					return ret, err
				}

				ret = append(ret, partret...)
			}
		} else {
			err := app.RecordQuery(table).
				Where(dbx.HashExp{field: values}).
				All(&ret)
			if err != nil {
				return ret, err
			}
		}
	} else {
		err := app.RecordQuery(table).
			Where(dbx.HashExp{field: values}).
			All(&ret)
		if err != nil {
			return ret, err
		}
	}

	return ret, nil
}

func TableByID[T interface{}](app core.App, table, id string) (T, error) {
	var ret T
	err := app.RecordQuery(table).
		Where(dbx.HashExp{ID_FIELD: id}).
		One(&ret)
	if err != nil {
		return ret, err
	}

	return ret, nil
}

func TableByIDs[T interface{}](app core.App, table string, ids []any) ([]T, error) {
	var ret []T
	if len(ids) > QUERY_PARTITION_SIZE {
		for i := 0; i < len(ids); i += QUERY_PARTITION_SIZE {
			part := ids[i:]
			if len(part) > QUERY_PARTITION_SIZE {
				part = part[:QUERY_PARTITION_SIZE]
			}

			var partret []T
			err := app.RecordQuery(table).
				Where(dbx.HashExp{ID_FIELD: part}).
				All(&partret)
			if err != nil {
				return ret, err
			}

			ret = append(ret, partret...)
		}
	} else {
		err := app.RecordQuery(table).
			Where(dbx.HashExp{ID_FIELD: ids}).
			All(&ret)
		if err != nil {
			return ret, err
		}
	}

	return ret, nil
}
