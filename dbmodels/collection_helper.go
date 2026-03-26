package dbmodels

type CollectionInfo struct {
	Annotation string
	Collection int
	Obj        []string
	INr        []int
	Obj_Unsure []string
	INr_Unsure []int

	ObjRanges []Range[string]
	INrRanges []Range[int]
	Recorded  bool
}

type Range[T any] struct {
	From T
	To   T
}
