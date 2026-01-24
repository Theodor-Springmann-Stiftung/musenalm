package seed

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
)

func appendEntryComment(entry *dbmodels.Entry, note string) {
	note = strings.TrimSpace(note)
	if note == "" {
		return
	}

	current := strings.TrimSpace(entry.Comment())
	if current == "" {
		entry.SetComment(note)
		return
	}

	if strings.Contains(current, note) {
		return
	}

	entry.SetComment(current + "\n" + note)
}
