package functions

import (
	"golang.org/x/net/html"
	"strconv"
	"strings"
)

type TOCEntry struct {
	Level int
	Title string
}

func getText(n *html.Node) string {
	if n.Type == html.TextNode {
		return n.Data
	}
	var sb strings.Builder
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		sb.WriteString(getText(c))
	}
	return sb.String()
}

func TOCFromHTML(htmlStr string) ([]TOCEntry, error) {
	doc, err := html.Parse(strings.NewReader(htmlStr))
	toc := []TOCEntry{}
	if err != nil {
		return toc, err
	}
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode {
			if len(n.Data) == 2 && n.Data[0] == 'h' && n.Data[1] >= '1' && n.Data[1] <= '6' {
				level, err := strconv.Atoi(n.Data[1:])
				if err == nil {
					title := strings.TrimSpace(getText(n))
					toc = append(toc, TOCEntry{Level: level, Title: title})
				}
			}
		}
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(doc)
	return toc, nil
}
