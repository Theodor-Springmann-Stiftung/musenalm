package dbmodels

import "github.com/pocketbase/pocketbase/core"

var _ core.RecordProxy = (*ContentNumberReservation)(nil)

type ContentNumberReservation struct {
	core.BaseRecordProxy
}

func NewContentNumberReservation(record *core.Record) *ContentNumberReservation {
	r := &ContentNumberReservation{}
	r.SetProxyRecord(record)
	return r
}

func (r *ContentNumberReservation) TableName() string {
	return CONTENT_NUMBER_RESERVATIONS_TABLE
}

func (r *ContentNumberReservation) Entry() string {
	return r.GetString(ENTRIES_TABLE)
}

func (r *ContentNumberReservation) SetEntry(entryID string) {
	r.Set(ENTRIES_TABLE, entryID)
}

func (r *ContentNumberReservation) StartMusenalmID() int {
	return r.GetInt(CONTENT_NUMBER_RESERVATION_START_FIELD)
}

func (r *ContentNumberReservation) SetStartMusenalmID(value int) {
	r.Set(CONTENT_NUMBER_RESERVATION_START_FIELD, value)
}

func (r *ContentNumberReservation) ReservedCount() int {
	return r.GetInt(CONTENT_NUMBER_RESERVATION_RESERVED_COUNT_FIELD)
}

func (r *ContentNumberReservation) SetReservedCount(value int) {
	r.Set(CONTENT_NUMBER_RESERVATION_RESERVED_COUNT_FIELD, value)
}

func (r *ContentNumberReservation) NextMusenalmID() int {
	return r.GetInt(CONTENT_NUMBER_RESERVATION_NEXT_FIELD)
}

func (r *ContentNumberReservation) SetNextMusenalmID(value int) {
	r.Set(CONTENT_NUMBER_RESERVATION_NEXT_FIELD, value)
}

func (r *ContentNumberReservation) Active() bool {
	return r.GetBool(CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD)
}

func (r *ContentNumberReservation) SetActive(value bool) {
	r.Set(CONTENT_NUMBER_RESERVATION_ACTIVE_FIELD, value)
}

func (r *ContentNumberReservation) EndMusenalmID() int {
	start := r.StartMusenalmID()
	count := r.ReservedCount()
	if start <= 0 || count <= 0 {
		return 0
	}
	return start + count - 1
}

func (r *ContentNumberReservation) HasRemaining() bool {
	next := r.NextMusenalmID()
	end := r.EndMusenalmID()
	return next > 0 && end > 0 && next <= end
}

func (r *ContentNumberReservation) RemainingCount() int {
	if !r.HasRemaining() {
		return 0
	}
	return r.EndMusenalmID() - r.NextMusenalmID() + 1
}
