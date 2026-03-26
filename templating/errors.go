package templating

import "errors"

var ErrInvalidPath = errors.New("invalid path, must be a directory")
var ErrNoTemplate = errors.New("no template found for this name")
var ErrInvalidTemplate = errors.New("invalid template")
var ErrFileAccess = errors.New("could not stat file or directory")

type FSError[T error] struct {
	File string
	Err  T
}

func NewError[T error](t T, file string) FSError[T] {
	return FSError[T]{File: file, Err: t}
}

func (e FSError[T]) Error() string {
	return e.Err.Error() + ": " + e.File
}
