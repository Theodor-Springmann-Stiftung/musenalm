package dbmodels

import (
	"strings"

	"github.com/Theodor-Springmann-Stiftung/musenalm/helpers/datatypes"
)

type FTS5QueryRequest struct {
	Fields []string
	Query  []string
	OP     Operator
}

type FTS5IDQueryResult struct {
	ID string `db:"id"`
}
type Operator int

const (
	NONE Operator = iota
	OP_AND
	OP_OR
	OP_NOT
)

type FTS5QueryPhrase struct {
	Fields []string
	Op     Operator
	Value  string
}

type FTS5Query struct {
	FROM   string
	SELECT []string
	MATCH  []FTS5QueryPhrase
}

func NewFTS5Query() *FTS5Query {
	return &FTS5Query{}
}

func (q *FTS5Query) From(tn string) *FTS5Query {
	q.FROM = FTS5TableName(datatypes.NormalizeString(tn))
	return q
}

func (q *FTS5Query) Select(fields ...string) *FTS5Query {
	if len(fields) == 0 {
		return q
	}

	q.SELECT = append(q.SELECT, fields...)
	return q
}

func (q *FTS5Query) SelectID() *FTS5Query {
	q.SELECT = append(q.SELECT, ID_FIELD)
	return q
}

func (q *FTS5Query) Match(fields []string, value string) *FTS5Query {
	if len(value) < 3 {
		return q
	}

	q.MATCH = append([]FTS5QueryPhrase{
		FTS5QueryPhrase{
			Fields: fields,
			Op:     NONE,
			Value:  value,
		}}, q.MATCH...)

	if len(q.MATCH) > 1 && q.MATCH[1].Op == NONE {
		q.MATCH[1].Op = OP_AND
	}

	return q
}

func (q *FTS5Query) AndMatch(fields []string, value string) *FTS5Query {
	if len(value) < 3 {
		return q
	}

	q.MATCH = append(q.MATCH, FTS5QueryPhrase{
		Fields: fields,
		Op:     OP_AND,
		Value:  value,
	})

	return q
}

func (q *FTS5Query) OrMatch(fields []string, value string) *FTS5Query {
	if len(value) < 3 {
		return q
	}

	q.MATCH = append(q.MATCH, FTS5QueryPhrase{
		Fields: fields,
		Op:     OP_OR,
		Value:  value,
	})

	return q
}

func (q *FTS5Query) NotMatch(fields []string, value string) *FTS5Query {
	if len(value) < 3 {
		return q
	}

	q.MATCH = append(q.MATCH, FTS5QueryPhrase{
		Fields: fields,
		Op:     OP_NOT,
		Value:  value,
	})

	return q
}

func (q *FTS5Query) Query() string {
	if len(q.MATCH) == 0 {
		return ""
	}

	if q.FROM == "" {
		return ""
	}

	query := q.buildQueryHead()
	query += " '"
	for i, m := range q.MATCH {
		if i > 0 {
			switch m.Op {
			case OP_AND:
				query += " AND"
			case OP_OR:
				query += " OR"
			case OP_NOT:
				query += " NOT"
			}
		}

		query += " { " + strings.Join(m.Fields, " ") + " } : \"" + q.Escape(m.Value) + "\""
	}

	query += "'"
	return query
}

func (q FTS5Query) Escape(s string) string {
	s = strings.ReplaceAll(s, "'", "''")
	s = strings.ReplaceAll(s, "\"", "\"\"")
	return s
}

func (q FTS5Query) buildQueryHead() string {
	if len(q.SELECT) == 0 {
		return "SELECT * FROM " + q.FROM + " WHERE " + q.FROM + " MATCH"
	}

	return "SELECT " + strings.Join(q.SELECT, ", ") + " FROM " + q.FROM + " WHERE " + q.FROM + " MATCH"
}
