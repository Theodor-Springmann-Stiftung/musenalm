package templating

import (
	"github.com/Theodor-Springmann-Stiftung/musenalm/dbmodels"
	"github.com/pocketbase/pocketbase/core"
)

type Request struct {
	*core.RequestEvent
}

func NewRequest(e *core.RequestEvent) *Request {
	return &Request{
		RequestEvent: e,
	}
}

func (r *Request) FullURL() string {
	path := r.Request.URL.EscapedPath()
	if r.Request.URL.RawQuery != "" {
		return path + "?" + r.Request.URL.RawQuery
	}
	return path
}

func (r *Request) Data() map[string]any {
	data := make(map[string]any)
	data["path"] = r.Request.URL.Path
	data["query"] = r.Request.URL.RawQuery
	data["fullpath"] = r.FullURL()
	data["method"] = r.Request.Method
	data["user"] = r.User()
	data["session"] = r.Session()
	data["access_token"] = r.AccessToken()
	return data
}

func (r *Request) User() *dbmodels.FixedUser {
	if user := r.Get("user"); user != nil {
		u, _ := user.(*dbmodels.FixedUser)
		return u
	}
	return nil
}

func (r *Request) Session() *dbmodels.FixedSession {
	if session := r.Get("session"); session != nil {
		s, _ := session.(*dbmodels.FixedSession)
		return s
	}
	return nil
}

func (r *Request) AccessToken() *dbmodels.FixedAccessToken {
	if token := r.Get("access_token"); token != nil {
		t, _ := token.(*dbmodels.FixedAccessToken)
		return t
	}
	return nil
}
