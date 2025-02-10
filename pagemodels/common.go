package pagemodels

const PAGE_DB_PREFIX = "page_"

func GeneratePageTableName(pagename, tablename string) string {
	return PAGE_DB_PREFIX + pagename + "_" + tablename
}
