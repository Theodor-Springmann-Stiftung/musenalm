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
