package imports

import (
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

const importDirName = "import"

var importNamePattern = regexp.MustCompile(`^(\d{4})-(\d{2})(?:-(\d{2}))?-MUSENALM-(DATA|FILES)`)

type ImportCandidate struct {
	Path  string
	IsZip bool
}

func FindLatestImport(kind string) (*ImportCandidate, error) {
	dirEntries, err := os.ReadDir(importDirName)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, err
	}

	want := "MUSENALM-" + strings.ToUpper(kind)
	type candidate struct {
		name string
		ts   time.Time
	}
	candidates := []candidate{}
	for _, entry := range dirEntries {
		name := entry.Name()
		matches := importNamePattern.FindStringSubmatch(name)
		if matches == nil {
			continue
		}
		if !strings.Contains(strings.ToUpper(name), want) {
			continue
		}
		year := matches[1]
		month := matches[2]
		day := matches[3]
		if day == "" {
			day = "01"
		}
		ts, err := time.Parse("2006-01-02", year+"-"+month+"-"+day)
		if err != nil {
			continue
		}
		candidates = append(candidates, candidate{name: name, ts: ts})
	}

	if len(candidates) == 0 {
		return nil, nil
	}

	sort.Slice(candidates, func(i, j int) bool {
		if candidates[i].ts.Equal(candidates[j].ts) {
			return candidates[i].name < candidates[j].name
		}
		return candidates[i].ts.Before(candidates[j].ts)
	})
	latest := candidates[len(candidates)-1].name
	path := filepath.Join(importDirName, latest)
	info, err := os.Stat(path)
	if err != nil {
		return nil, err
	}

	if info.IsDir() {
		return &ImportCandidate{Path: path, IsZip: false}, nil
	}
	if strings.HasSuffix(strings.ToLower(latest), ".zip") {
		return &ImportCandidate{Path: path, IsZip: true}, nil
	}

	return &ImportCandidate{Path: path, IsZip: false}, nil
}

func HasImport(kind string) bool {
	candidate, err := FindLatestImport(kind)
	return err == nil && candidate != nil
}
