package dbmodels

import (
	"encoding/json"
	"regexp"
	"strconv"
	"strings"
)

// INFO: tries to parse the Sammlungen field of contents.
// Doesn't do a good job at all, but it's hard, there are many errors
// Safe for concurrent use:
var inrex = regexp.MustCompile(`(?is)inr[.:,;]?\s*([\d,\-(?:u.?)\v\f\t –—;\.]+)`)
var onrex = regexp.MustCompile(`(?is)obj[.:,;]?\s*([\d,\-(?:u.?)\v\f\t –—;\.]+)`)
var dashRegex = regexp.MustCompile(`[–—−‒]`)
var delims = regexp.MustCompile(`[;/]+`)
var reno = regexp.MustCompile(`\b\d+\b`)

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

func (ci CollectionInfo) String() string {
	marshalled, _ := json.Marshal(ci)
	return string(marshalled)
}

func (ci CollectionInfo) ShortString() string {
	s := strings.Builder{}
	s.WriteString(strconv.Itoa(ci.Collection))
	s.WriteString(": ")
	s.WriteString(ci.Annotation)
	s.WriteString("\n")

	if ci.Recorded {
		s.WriteString("recorded")
	} else {
		s.WriteString("not recorded")
	}

	s.WriteString("\n")

	if len(ci.INrRanges) > 0 {
		s.WriteString("INr-Ranges: ")
		for _, r := range ci.INrRanges {
			s.WriteString(strconv.Itoa(r.From))
			s.WriteString("-")
			s.WriteString(strconv.Itoa(r.To))
			s.WriteString("; ")
		}
		s.WriteString("\n")
	}

	if len(ci.INr) > 0 {
		s.WriteString("INr-Singles: ")
		for _, i := range ci.INr {
			s.WriteString(strconv.Itoa(i))
			s.WriteString("; ")
		}
	}

	if len(ci.INr_Unsure) > 0 {
		s.WriteString("INr-Unsure: ")
		if len(ci.INr_Unsure) > 100 {
			s.WriteString("many")
		} else {
			for _, i := range ci.INr_Unsure {
				s.WriteString(strconv.Itoa(i))
				s.WriteString("; ")
			}
			s.WriteString("\n")
		}
	}

	if len(ci.ObjRanges) > 0 {
		s.WriteString("Obj-Ranges: ")
		for _, r := range ci.ObjRanges {
			s.WriteString(r.From)
			s.WriteString("-")
			s.WriteString(r.To)
			s.WriteString("; ")
		}
		s.WriteString("\n")
	}

	if len(ci.Obj) > 0 {
		s.WriteString("Obj-Singles: ")
		for _, i := range ci.Obj {
			s.WriteString(i)
			s.WriteString("; ")
		}
		s.WriteString("\n")
	}

	if len(ci.Obj_Unsure) > 0 {
		s.WriteString("Obj-Unsure: ")
		for _, i := range ci.Obj_Unsure {
			s.WriteString(i)
			s.WriteString("; ")
		}
		s.WriteString("\n")
	}

	return s.String()
}

type Range[T any] struct {
	From T
	To   T
}

func ParseAnnotation(c int, annotation string, inos []int, objnos []string) CollectionInfo {
	ci := CollectionInfo{
		Annotation: annotation,
		Collection: c,
		Recorded:   true,
	}

	split := strings.Split(annotation, "/)")

	inomap := make(map[int]bool)
	for _, i := range inos {
		inomap[i] = true
	}

	objnomap := make(map[string]bool)
	for _, o := range objnos {
		objnomap[o] = true
	}

	unsure_inr := func(in int) {
		instr := strconv.Itoa(in)
		if _, ok := objnomap[instr]; ok {
			ci.Obj = append(ci.Obj, instr)
		} else {
			ci.INr_Unsure = append(ci.INr_Unsure, in)
		}
	}

	unsure_inr_range := func(r Range[int]) {
		cfrom := strconv.Itoa(r.From)
		cto := strconv.Itoa(r.To)
		_, ok := objnomap[cfrom]
		_, ok2 := objnomap[cto]
		if ok && ok2 {
			ci.ObjRanges = append(ci.ObjRanges, Range[string]{From: cfrom, To: cto})
		} else {
			for i := r.From; i <= r.To; i++ {
				unsure_inr(i)
			}
		}
	}

	for _, s := range split {
		l := strings.ToLower(s)

		// TODO: before this, we may cut the annotation into /) pieces
		notRecordedPatterns := []string{"erfasst", "aufgenommen", "verzeichnet", "registriert"}
		if strings.Contains(l, "nicht") {
			for _, kw := range notRecordedPatterns {
				if strings.Contains(l, kw) {
					ci.Recorded = false
					break
				}
			}
		}

		matches := inrex.FindAllStringSubmatch(s, -1)
		inRanges, inSingles := findINrRangesSingles(matches)

		// INFO: Heuristics
		for _, in := range inSingles {
			if _, ok := inomap[in]; ok {
				ci.INr = append(ci.INr, in)
			} else {
				unsure_inr(in)
			}
		}

		for _, r := range inRanges {
			if r.From < r.To {
				_, ok := inomap[r.From]
				_, ok2 := inomap[r.To]
				if ok && ok2 {
					ci.INrRanges = append(ci.INrRanges, r)
					continue
				}

				unsure_inr_range(r)
			} else {
				for i := r.From; i <= r.To; i++ {
					ci.INr_Unsure = append(ci.INr_Unsure, i)
				}
			}
		}

		matches = onrex.FindAllStringSubmatch(s, -1)
		objRanges, objSingles := findONrRangesSingles(matches)

		for _, o := range objSingles {
			if _, ok := objnomap[o]; ok {
				ci.Obj = append(ci.Obj, o)
			} else {
				ci.Obj_Unsure = append(ci.Obj_Unsure, o)
			}
		}

		for _, r := range objRanges {
			if r.From < r.To {
				_, ok := objnomap[r.From]
				_, ok2 := objnomap[r.To]
				if ok && ok2 {
					ci.ObjRanges = append(ci.ObjRanges, r)
					continue
				}
			}
		}

	}

	return ci
}

func findINrRangesSingles(matches [][]string) ([]Range[int], []int) {
	ranges := make([]Range[int], 0)
	singles := make([]int, 0)

	for _, match := range matches {
		chunk := match[1]
		normalized := dashRegex.ReplaceAllString(chunk, "-")
		// WARNING: Replacing the OBj and INr delimiter ; with a comma here.
		// It's a problem if the Obj was left out: INr 323345-323398; 23-53
		//                      Here is an Obj often, but not always ^
		// We do some heuristics later on to differentiate INr from Obj.
		normalized = delims.ReplaceAllString(normalized, ",")
		parts := strings.Split(normalized, ",")
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}

			rangeParts := strings.Split(p, "-")
			if len(rangeParts) == 2 {
				// INFO: we have a range, most prob
				fromStr := strings.TrimSpace(rangeParts[0])
				toStr := strings.TrimSpace(rangeParts[1])
				if fromVal, errFrom := strconv.Atoi(fromStr); errFrom == nil {
					if toVal, errTo := strconv.Atoi(toStr); errTo == nil {
						ranges = append(ranges, Range[int]{From: fromVal, To: toVal})
						continue
					}
					to := reno.FindAllString(toStr, -1)
					if len(to) >= 1 {
						if val, err := strconv.Atoi(to[0]); err == nil {
							ranges = append(ranges, Range[int]{From: fromVal, To: val})
						}
						if len(to) > 1 {
							if val, err := strconv.Atoi(to[1]); err == nil {
								singles = append(singles, val)
							}
						}
					}
				}
				continue
			}

			rangeParts = strings.Split(p, " u")
			for _, r := range rangeParts {
				trimmed := strings.TrimSpace(r)
				matches := reno.FindAllString(trimmed, -1)
				for _, m := range matches {
					if val, err := strconv.Atoi(m); err == nil {
						singles = append(singles, val)
					}
				}
			}
		}
	}

	return ranges, singles
}

func findONrRangesSingles(matches [][]string) ([]Range[string], []string) {
	ranges := make([]Range[string], 0)
	singles := make([]string, 0)

	for _, match := range matches {
		chunk := match[1]
		normalized := dashRegex.ReplaceAllString(chunk, "-")
		normalized = delims.ReplaceAllString(normalized, ",")
		parts := strings.Split(normalized, ",")
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}

			rangeParts := strings.Split(p, "-")
			if len(rangeParts) == 2 {
				// INFO: we have a range, most prob
				fromStr := strings.TrimSpace(rangeParts[0])
				toStr := strings.TrimSpace(rangeParts[1])
				ranges = append(ranges, Range[string]{From: fromStr, To: toStr})
				continue
			}

			rangeParts = strings.Split(p, " u")
			for _, r := range rangeParts {
				trimmed := strings.TrimSpace(r)
				matches := reno.FindAllString(trimmed, -1)
				for _, m := range matches {
					singles = append(singles, m)
				}
			}
		}
	}

	return ranges, singles
}
