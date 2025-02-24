package functions

import (
	"fmt"
	"time"
)

type Weekday struct {
	Name      string
	ShortName string
	Number    int
}

type Month struct {
	Name      string
	ShortName string
	Number    int
}

var Months = []Month{
	{"Januar", "Jan", 1},
	{"Februar", "Feb", 2},
	{"März", "Mär", 3},
	{"April", "Apr", 4},
	{"Mai", "Mai", 5},
	{"Juni", "Jun", 6},
	{"Juli", "Jul", 7},
	{"August", "Aug", 8},
	{"September", "Sep", 9},
	{"Oktober", "Okt", 10},
	{"November", "Nov", 11},
	{"Dezember", "Dez", 12},
	{"N/A", "N/A", 0},
}

var Weekdays = []Weekday{
	{"Sonntag", "So", 0},
	{"Montag", "Mo", 1},
	{"Dienstag", "Di", 2},
	{"Mittwoch", "Mi", 3},
	{"Donnerstag", "Do", 4},
	{"Freitag", "Fr", 5},
	{"Samstag", "Sa", 6},
	{"N/A", "N/A", 7},
}

func Today() time.Time {
	return time.Now()
}

func GetMonth(month any) Month {
	if val, ok := month.(int); ok {
		val -= 1
		if val < 0 || val > 11 {
			val = 12
		}
		return Months[val]
	}

	if val, ok := month.(time.Time); ok {
		m := val.Month() - 1
		return Months[m]
	}

	fmt.Println("Invalid month value", month)
	return Months[12]
}
