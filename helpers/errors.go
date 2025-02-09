package helpers

import (
	"os"
)

func Assert(err error, msg ...string) {
	if err == nil {
		return
	}

	os.Exit(1)
}

func AssertNonNil(obj interface{}, msg ...string) {
	if obj != nil {
		return
	}

	os.Exit(1)
}

func AssertNil(obj interface{}, msg ...string) {
	if obj == nil {
		return
	}

	os.Exit(1)
}

func AssertStr(str string, msg ...string) {
	if str != "" {
		return
	}

	os.Exit(1)
}
