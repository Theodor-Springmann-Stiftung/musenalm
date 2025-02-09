package helpers

import (
	"fmt"
	"os"
)

func Assert(err error, msg ...string) {
	if err == nil {
		return
	}

	fmt.Println(err)
	for msg := range msg {
		fmt.Println(msg)
	}
	os.Exit(1)
}

func AssertNonNil(obj interface{}, msg ...string) {
	if obj != nil {
		return
	}

	for msg := range msg {
		fmt.Println(msg)
	}
	os.Exit(1)
}

func AssertNil(obj interface{}, msg ...string) {
	if obj == nil {
		return
	}

	for msg := range msg {
		fmt.Println(msg)
	}
	os.Exit(1)
}

func AssertStr(str string, msg ...string) {
	if str != "" {
		return
	}

	fmt.Println(str)
	for msg := range msg {
		fmt.Println(msg)
	}
	os.Exit(1)
}
