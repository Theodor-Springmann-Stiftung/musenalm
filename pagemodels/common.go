package pagemodels

const PAGE_DB_PREFIX = "page_"

func GeneratePageTableName(pagename string, tablename ...string) string {
	name := PAGE_DB_PREFIX + pagename
	for _, t := range tablename {
		name += "_" + t
	}
	return name
}
