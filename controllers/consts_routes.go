package controllers

const (
	URL_API_AGENTS         = "/admin/api/agents"
	URL_API_AGENTS_SEARCH  = "/search"
	URL_API_ENTRIES        = "/admin/api/entries"
	URL_API_ENTRIES_SEARCH = "/search"
	URL_API_PLACES         = "/admin/api/places"
	URL_API_PLACES_SEARCH  = "/search"
	URL_API_SERIES         = "/admin/api/series"
	URL_API_SERIES_SEARCH  = "/search"
)

const (
	URL_LOGIN       = "/login/"
	TEMPLATE_LOGIN  = "/login/"
	URL_LOGOUT      = "/logout/"
	TEMPLATE_LOGOUT = "/logout/"
	URL_REIHEN_LIST = "/reihen"

	URL_USER_CREATE      = "/user/new/"
	PATH_VALUE_ROLE      = "role"
	TEMPLATE_USER_CREATE = "/user/new/"

	URL_USER_MANAGEMENT             = "/admin/user/management"
	TEMPLATE_USER_MANAGEMENT        = "/admin/user/management/"
	URL_DEACTIVATE_USER             = "/deactivate/"
	URL_ACTIVATE_USER               = "/activate/"
	URL_LOGOUT_USER                 = "/logout/"
	URL_USER_MGMT_LOGIN             = "/login/"
	URL_USER_MANAGEMENT_ACCESS      = "/admin/user/management/access/"
	TEMPLATE_USER_MANAGEMENT_ACCESS = "/admin/user/management/access/"

	URL_USER            = "/admin/user/{uid}/"
	URL_USER_EDIT       = "edit/"
	URL_USER_LOGOUT     = "logout/"
	URL_USER_DEACTIVATE = "deactivate/"
	URL_USER_ACTIVATE   = "activate/"
	UID_PATH_VALUE      = "uid"
	TEMPLATE_USER_EDIT  = "/admin/user/edit/"
	URL_USER_LOGIN      = "/login/"
)

const (
	URL_INDEX_ROOT      = "/{$}"
	TEMPLATE_INDEX_ROOT = "/"
	URL_HOME            = "/"

	URL_DATENSCHUTZ            = "/datenschutz/"
	URL_REDAKTION_KONTAKT      = "/redaktion/kontakt/"
	URL_REDAKTION_DANKSAGUNGEN = "/redaktion/danksagungen/"
	URL_REDAKTION_LITERATUR    = "/redaktion/literatur/"
	URL_REDAKTION_EINLEITUNG   = "/redaktion/einleitung/"
	URL_REDAKTION_HINWEISE     = "/redaktion/benutzerhinweise/"
	URL_REDAKTION_LESEKABINETT = "/redaktion/lesekabinett/"
)

const (
	URL_SUCHE      = "/suche/{type}"
	URL_SUCHE_ALT  = "/suche/{$}"
	DEFAULT_SUCHE  = "/suche/baende"
	TEMPLATE_SUCHE = "/suche/"
)

const (
	URL_REIHEN                        = "/reihen/"
	URL_REIHEN_RESULTS                = "/reihen/results/"
	URL_REIHE                         = "/reihe/{id}/"
	TEMPLATE_REIHE                    = "/reihe/"
	URL_REIHEN_ADMIN                  = "/admin/reihen/"
	URL_REIHEN_ADMIN_RESULTS          = "/admin/reihen/results/"
	URL_REIHEN_ADMIN_MORE             = "/admin/reihen/more/"
	URL_REIHEN_ADMIN_FILTER_OPTIONS   = "/admin/reihen/filters/{kind}/"
	URL_REIHEN_ADMIN_DELETE_INFO      = "/admin/reihen/delete-info/{id}"
	TEMPLATE_REIHEN_ADMIN             = "/admin/reihen/"
	TEMPLATE_REIHEN_ADMIN_FILTERS     = "/admin/reihen/filter_options/"
	TEMPLATE_REIHEN_ADMIN_DELETE_INFO = "/admin/reihen/delete_info/"
	URL_REIHEN_NEW                    = "/admin/reihen/new/"
	URL_REIHE_REDIRECT                = "/reihe/%d/"

	URL_REIHE_ADMIN_BASE  = "/admin/reihe/{id}/"
	URL_REIHE_EDIT        = "edit"
	URL_REIHE_DELETE      = "edit/delete"
	TEMPLATE_REIHE_EDIT   = "/admin/reihe/edit/"
	URL_REIHEN_REDIRECT   = "/reihen"
	URL_REIHE_VIEW_FORMAT = "/reihe/%s/"
	URL_REIHE_EDIT_FORMAT = "/admin/reihe/%s/edit"
)

const (
	URL_PERSON                          = "/person/{id}"
	TEMPLATE_PERSON                     = "/person/"
	URL_PERSONEN                        = "/personen/"
	URL_PERSONEN_ADMIN                  = "/admin/personen/"
	URL_PERSONEN_ADMIN_RESULTS          = "/admin/personen/results/"
	URL_PERSONEN_ADMIN_MORE             = "/admin/personen/more/"
	URL_PERSONEN_ADMIN_DELETE_INFO      = "/admin/personen/delete-info/{id}"
	TEMPLATE_PERSONEN_ADMIN             = "/admin/personen/"
	TEMPLATE_PERSONEN_ADMIN_RESULTS     = "/admin/personen/results/"
	TEMPLATE_PERSONEN_ADMIN_MORE        = "/admin/personen/more/"
	TEMPLATE_PERSONEN_ADMIN_DELETE_INFO = "/admin/personen/delete_info/"

	URL_PERSONEN_NEW    = "/admin/personen/new/"
	URL_PERSON_REDIRECT = "/person/%s"

	URL_PERSON_EDIT_BASE   = "/admin/person/{id}/"
	URL_PERSON_EDIT        = "edit"
	URL_PERSON_EDIT_SLASH  = "edit/"
	URL_PERSON_DELETE      = "edit/delete"
	TEMPLATE_PERSON_EDIT   = "/admin/person/edit/"
	URL_PERSON_VIEW_FORMAT = "/person/%s"
	URL_PERSON_EDIT_FORMAT = "/admin/person/%s/edit/"
	URL_PERSONEN_REDIRECT  = "/personen/"
)

const (
	URL_BEITRAG      = "/beitrag/{id}"
	TEMPLATE_BEITRAG = "/beitrag/"
)

const (
	URL_ALMANACH               = "/almanach/{id}/"
	URL_ALMANACH_CONTENTS      = "/almanach/{id}/contents-view/"
	TEMPLATE_ALMANACH          = "/almanach/"
	TEMPLATE_ALMANACH_CONTENTS = "/almanach/contents-view/"

	URL_ALMANACH_NEW      = "/admin/almanach-new/"
	URL_ALMANACH_NEW_SAVE = "save"
	URL_ALMANACH_VIEW     = "/almanach/%d/"

	URL_ALMANACH_ADMIN_BASE      = "/admin/almanach/{id}/"
	URL_ALMANACH_EDIT            = "edit/"
	TEMPLATE_ALMANACH_EDIT       = "/admin/almanach/edit/"
	URL_ALMANACH_VIEW_FORMAT     = "/almanach/%s/"
	URL_ALMANACH_REIHEN_REDIRECT = "/reihen"

	URL_ALMANACH_CONTENTS_ADMIN_BASE        = "/admin/almanach/{id}/"
	URL_ALMANACH_CONTENTS_EDIT              = "contents/edit"
	URL_ALMANACH_CONTENTS_NEW               = "contents/new"
	URL_ALMANACH_CONTENTS_PANEL_EDIT        = "contents/edit/{contentMusenalmId}"
	URL_ALMANACH_CONTENTS_PANEL_EDIT_SLASH  = "contents/edit/{contentMusenalmId}/"
	URL_ALMANACH_CONTENTS_DELETE            = "contents/delete"
	URL_ALMANACH_CONTENTS_RESERVATION       = "contents/reservation"
	URL_ALMANACH_CONTENTS_RESERVATION_STOP  = "contents/reservation/deactivate"
	URL_ALMANACH_CONTENTS_RENUMBER_PRESERVE = "contents/renumber/preserve"
	URL_ALMANACH_CONTENTS_RENUMBER_NEW      = "contents/renumber/new"
	URL_ALMANACH_CONTENTS_EDIT_EXTENT       = "contents/edit/extent"
	URL_ALMANACH_CONTENTS_UPLOAD            = "contents/upload"
	URL_ALMANACH_CONTENTS_DELETE_SCAN       = "contents/scan/delete"
	TEMPLATE_ALMANACH_CONTENTS_EDIT         = "/admin/contents/edit/"
	TEMPLATE_ALMANACH_CONTENTS_EDIT_PANEL   = "/admin/contents/edit_panel/"
	TEMPLATE_ALMANACH_CONTENTS_WORKSPACE    = "/admin/contents/edit_workspace/"
	TEMPLATE_ALMANACH_CONTENTS_IMAGES_PANEL = "/admin/contents/images_panel/"
	URL_BEITRAG_VIEW_FORMAT                 = "/beitrag/%d"
	URL_ALMANACH_CONTENTS_PANEL_EDIT_FORMAT = "/admin/almanach/%s/contents/edit/%d"
	URL_ALMANACH_CONTENTS_EDIT_FORMAT       = "/admin/almanach/%s/contents/edit"
)

const (
	URL_BAENDE                  = "/admin/baende/"
	URL_BAENDE_RESULTS          = "/admin/baende/results/"
	URL_BAENDE_MORE             = "/admin/baende/more/"
	URL_BAENDE_FILTER_OPTIONS   = "/admin/baende/filters/{kind}/"
	URL_BAENDE_DELETE           = "/admin/baende/delete-info/{id}"
	TEMPLATE_BAENDE             = "/admin/baende/"
	TEMPLATE_BAENDE_FILTERS     = "/admin/baende/filter_options/"
	URL_BAENDE_DETAILS          = "/admin/baende/details/{id}"
	URL_BAENDE_LOGIN            = "/login/"
	URL_BAENDE_LOGIN_REDIRECT   = "/login/?redirectTo="
	TEMPLATE_BAENDE_ROW         = "/admin/baende/row/"
	TEMPLATE_BAENDE_DETAILS     = "/admin/baende/details/"
	TEMPLATE_BAENDE_DELETE_INFO = "/admin/baende/delete_info/"
)

const (
	URL_BEITRAEGE_ADMIN        = "/admin/beitraege/"
	URL_BEITRAEGE_RESULTS      = "/admin/beitraege/results/"
	URL_BEITRAEGE_MORE         = "/admin/beitraege/more/"
	URL_BEITRAEGE_FILTERS      = "/admin/beitraege/filters/{kind}/"
	TEMPLATE_BEITRAEGE_ADMIN   = "/admin/beitraege/"
	TEMPLATE_BEITRAEGE_FILTERS = "/admin/beitraege/filter_options/"
	TEMPLATE_BEITRAEGE_MORE    = "/admin/beitraege/more/"
)

const (
	URL_ORTE           = "/admin/orte/"
	URL_ORTE_RESULTS   = "/admin/orte/results/"
	URL_ORTE_MORE      = "/admin/orte/more/"
	TEMPLATE_ORTE      = "/admin/orte/"
	TEMPLATE_ORTE_MORE = "/admin/orte/more/"

	URL_ORT                 = "/admin/ort/{id}/"
	URL_ORT_EDIT            = "edit"
	URL_ORT_DELETE          = "edit/delete"
	TEMPLATE_ORT_EDIT       = "/admin/ort/edit/"
	URL_REIHEN_PLACE_FILTER = "/reihen/?place=%s"
	URL_ORT_VIEW_FORMAT     = "/ort/%s"
	URL_ORT_EDIT_FORMAT     = "/admin/ort/%s/edit"
	URL_ORTE_REDIRECT       = "/orte"

	URL_ORTE_NEW          = "/admin/orte/new/"
	URL_ORT_EDIT_REDIRECT = "/admin/ort/%s/edit"
)

const (
	URL_ABKUERZUNGEN      = "/admin/abkuerzungen/"
	TEMPLATE_ABKUERZUNGEN = "/admin/abkuerzungen/"
)

const (
	URL_SEITEN_EDITOR      = "/admin/seiten/"
	URL_SEITEN_EDITOR_FORM = "form/"
	URL_SEITEN_EDITOR_SAVE = "save/"
	TEMPLATE_SEITEN_EDITOR = "/admin/seiten/"
	TEMPLATE_SEITEN_FORM   = "/admin/seiten/form/"
	URL_SEITEN_HOME        = "/"
)

const (
	URL_EXPORTS_ADMIN        = "/admin/exports/"
	URL_EXPORTS_RUN          = "run/"
	URL_EXPORTS_LIST         = "list/"
	URL_EXPORTS_DOWNLOAD     = "download/"
	URL_EXPORTS_DELETE       = "delete/"
	URL_EXPORTS_SETTINGS     = "settings/"
	URL_EXPORTS_FTS5_REBUILD = "fts5/rebuild/"
	URL_EXPORTS_FTS5_STATUS  = "fts5/status/"
	TEMPLATE_EXPORTS         = "/admin/exports/"
	TEMPLATE_EXPORTS_LIST    = "/admin/exports/list/"

	URL_SETTINGS_ADMIN        = "/admin/settings/"
	URL_SETTINGS_SAVE         = "save/"
	URL_SETTINGS_DELETE       = "delete/"
	URL_SETTINGS_FTS5_REBUILD = "fts5/rebuild/"
	URL_SETTINGS_FTS5_STATUS  = "fts5/status/"
	TEMPLATE_SETTINGS         = "/admin/settings/"

	URL_FILES_ADMIN     = "/admin/files/"
	URL_FILES_LIST      = "list/"
	URL_FILES_UPLOAD    = "upload/"
	URL_FILES_DELETE    = "delete/"
	TEMPLATE_FILES_LIST = "/admin/components/file_uploader_list/"

	URL_IMAGES_ADMIN           = "/admin/images/"
	URL_IMAGES_LIST            = "list/"
	URL_IMAGES_UPLOAD          = "upload/"
	URL_IMAGES_DELETE          = "delete/"
	TEMPLATE_IMAGES_LIST       = "/admin/components/image_uploader_list/"
	TEMPLATE_IMAGE_SINGLE_VIEW = "/admin/components/image_uploader_single_view/"
)

const (
	URL_ERROR_404 = "/errors/404/"
	URL_ERROR_500 = "/errors/500/"
)
