package templating

import (
	"fmt"
	"strings"

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

func (r *Request) SetUser(user *dbmodels.FixedUser) {
	r.Set("user", user)
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

func (r *Request) IsAdmin() bool {
	if user := r.User(); user != nil {
		return user.Role == "Admin"
	}
	return false
}

func (r *Request) IsAuthenticated() bool {
	if user := r.User(); user != nil {
		return true
	}
	return false
}

func (r *Request) IsEditor() bool {
	if user := r.User(); user != nil {
		return user.Role == "Editor"
	}
	return false
}

func (r *Request) CheckCSRF(target string) error {
	target = strings.TrimSpace(target)
	if r.Session() == nil || target == "" {
		return fmt.Errorf("CSRF-Token nicht vorhanden oder ungültig")
	}
	if r.Session().Token != target && r.Session().CSRF != target {
		return fmt.Errorf("CSRF-Token nicht vorhanden oder ungültig")
	}
	return nil
}
