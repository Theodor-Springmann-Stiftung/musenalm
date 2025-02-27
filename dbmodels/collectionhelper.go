package dbmodels

import (
	"encoding/json"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

// CollectionInfo holds only the ID, a list of single references, and the Recorded flag.
type CollectionInfo struct {
	Collection *Content
	Singles    []int
	Recorded   bool
}

func (ci CollectionInfo) String() string {
	marshalled, _ := json.Marshal(ci)
	return string(marshalled)
}

// parseAnnotation detects "nicht erfasst" references (Recorded=false),
// then finds all "INr" references (both single values and ranges).
// Ranges like "100-105" are fully expanded to singles. Duplicates are removed.
// Any references not in `inos` are ignored.
func ParseAnnotation(c *Content, annotation string, inos []int) CollectionInfo {
	ci := CollectionInfo{
		Collection: c,
		Singles:    []int{},
		Recorded:   true, // Default
	}

	// 1) Detect phrases like "nicht erfasst", "nicht aufgenommen", etc.
	notRecordedPatterns := []string{"erfasst", "aufgenommen", "verzeichnet", "registriert"}
	lowerAnn := strings.ToLower(annotation)
	if strings.Contains(lowerAnn, "nicht") {
		for _, kw := range notRecordedPatterns {
			if strings.Contains(lowerAnn, kw) {
				ci.Recorded = false
				break
			}
		}
	}

	// We'll keep singles in a map for deduplication
	singlesMap := make(map[int]struct{})

	// 2) Regex that matches "INr" plus the numeric portion (including dash / punctuation).
	re := regexp.MustCompile(`(?i)\bINr[.:]?\s+([\d,\-\s–—;/.]+)`)
	matches := re.FindAllStringSubmatch(annotation, -1)

	// Regex to unify different dash characters into a simple '-'
	dashRegex := regexp.MustCompile(`[–—−‒]`)

	// Helper to expand a range, e.g. 10615–10621 => 10615..10621
	expandRange := func(fromVal, toVal int) {
		// If reversed, its a typo
		if fromVal > toVal {
			return
		}
		for v := fromVal; v <= toVal; v++ {
			if inList(v, inos) {
				singlesMap[v] = struct{}{}
			}
		}
	}

	for _, m := range matches {
		numericChunk := m[1]

		// Replace typographic dashes with ASCII hyphen
		numericChunk = dashRegex.ReplaceAllString(numericChunk, "-")

		// Also unify semicolons or slashes to commas
		extraDelims := regexp.MustCompile(`[;/]+`)
		numericChunk = extraDelims.ReplaceAllString(numericChunk, ",")

		// Now split on commas
		parts := strings.Split(numericChunk, ",")
		for _, p := range parts {
			p = strings.TrimSpace(p)
			if p == "" {
				continue
			}
			// If we see a hyphen, treat it as a range
			if strings.Contains(p, "-") {
				rangeParts := strings.SplitN(p, "-", 2)
				if len(rangeParts) == 2 {
					fromStr := strings.TrimSpace(rangeParts[0])
					toStr := strings.TrimSpace(rangeParts[1])
					if fromVal, errFrom := strconv.Atoi(fromStr); errFrom == nil {
						if toVal, errTo := strconv.Atoi(toStr); errTo == nil {
							expandRange(fromVal, toVal)
						}
					}
				}
			} else {
				// Single integer reference
				if val, err := strconv.Atoi(p); err == nil {
					if inList(val, inos) {
						singlesMap[val] = struct{}{}
					}
				}
			}
		}
	}

	// Flatten the map into a sorted slice
	for s := range singlesMap {
		ci.Singles = append(ci.Singles, s)
	}
	sort.Ints(ci.Singles)

	return ci
}

// inList checks membership in `inos`
func inList(x int, list []int) bool {
	for _, item := range list {
		if item == x {
			return true
		}
	}
	return false
}
