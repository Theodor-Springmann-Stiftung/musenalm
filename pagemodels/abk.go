package pagemodels

import "github.com/pocketbase/pocketbase/core"

type Abk struct {
	core.BaseRecordProxy
}

func (a *Abk) TableName() string {
	return GeneratePageTableName(P_DOK_NAME, T_ABK_NAME)
}

func NewAbk(record *core.Record) *Abk {
	i := &Abk{}
	i.SetProxyRecord(record)
	return i
}

func (a *Abk) Abk() string {
	return a.GetString(F_ABK)
}

func (a *Abk) SetAbk(abk string) {
	a.Set(F_ABK, abk)
}

func (a *Abk) Bedeutung() string {
	return a.GetString(F_BEDEUTUNG)
}

func (a *Abk) SetBedeutung(bedeutung string) {
	a.Set(F_BEDEUTUNG, bedeutung)
}
