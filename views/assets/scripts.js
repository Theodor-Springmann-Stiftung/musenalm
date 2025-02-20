var _ = (i) => {
  throw TypeError(i);
};
var g = (i, r, t) => r.has(i) || _("Cannot " + t);
var c = (i, r, t) => (g(i, r, "read from private field"), t ? t.call(i) : r.get(i)), l = (i, r, t) => r.has(i) ? _("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(i) : r.set(i, t), o = (i, r, t, e) => (g(i, r, "write to private field"), e ? e.call(i, t) : r.set(i, t), t), d = (i, r, t) => (g(i, r, "access private method"), t);
const v = "script[xslt-onload]", m = "xslt-template", A = "xslt-transformed", F = "filter-list", f = "filter-list-list", w = "filter-list-item", I = "filter-list-input", E = "filter-list-searchable";
var a, p, b;
class $ {
  constructor() {
    l(this, p);
    l(this, a);
    o(this, a, /* @__PURE__ */ new Map());
  }
  setup() {
    let r = htmx.findAll(v);
    for (let t of r)
      d(this, p, b).call(this, t);
  }
  hookupHTMX() {
    htmx.on("htmx:load", (r) => {
      this.setup();
    });
  }
}
a = new WeakMap(), p = new WeakSet(), b = function(r) {
  if (r.getAttribute(A) === "true" || !r.hasAttribute(m))
    return;
  let t = "#" + r.getAttribute(m), e = c(this, a).get(t);
  if (!e) {
    let u = htmx.find(t);
    if (u) {
      let S = u.innerHTML ? new DOMParser().parseFromString(u.innerHTML, "application/xml") : u.contentDocument;
      e = new XSLTProcessor(), e.importStylesheet(S), c(this, a).set(t, e);
    } else
      throw new Error("Unknown XSLT template: " + t);
  }
  let s = new DOMParser().parseFromString(r.innerHTML, "application/xml"), L = e.transformToFragment(s, document), x = new XMLSerializer().serializeToString(L);
  r.outerHTML = x;
};
var n, h, T;
class k extends HTMLElement {
  constructor() {
    super();
    l(this, h);
    l(this, n, !1);
    this._items = [], this._url = "", this._filterstart = !1, this._placeholder = "Liste filtern...", this.render();
  }
  static get observedAttributes() {
    return ["data-url"];
  }
  set items(t) {
    Array.isArray(t) && (this._items = t, this.render());
  }
  get items() {
    return this._items;
  }
  connectedCallback() {
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._filterstart && o(this, n, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, s) {
    t === "data-url" && e !== s && (this._url = s, this.render()), t === "data-filterstart" && e !== s && (this._filterstart = s === "true", this.render()), t === "data-placeholder" && e !== s && (this._placeholder = s, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (o(this, n, !1), this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && o(this, n, !0), this.renderList();
    }
  }
  onEnter(t) {
    if (t.target && t.target.tagName.toLowerCase() === "input" && t.key === "Enter") {
      t.preventDefault();
      const e = this.querySelector("a");
      e && e.click();
    }
  }
  mark() {
    if (typeof Mark != "function")
      return;
    let t = this.querySelector("#" + f);
    if (!t)
      return;
    let e = new Mark(t.querySelectorAll("." + E));
    this._filter && e.mark(this._filter, {
      separateWordSearch: !0
    });
  }
  // INFO: allows for setting a custom HREF of the list item
  // The function takes the item as parameter fn(item) and should return a string.
  setHREFFunc(t) {
    this.getHREF = t, this.render();
  }
  // INFO: allows for setting a custom link text of the list item
  // The function takes the item as parameter fn(item) and should return a string or
  // an HTML template literal.
  setLinkTextFunc(t) {
    this.getLinkText = t, this.render();
  }
  // INFO: allows for setting the text that will be filtered for.
  // The function takes the item as parameter fn(item) and should return a string.
  setSearchTextFunc(t) {
    this.getSearchText = t, this.render();
  }
  getHREF(t) {
    if (t) {
      if (!t.id)
        return "";
    } else return "";
    return t.id;
  }
  getSearchText(t) {
    if (t) {
      if (!t.name)
        return "";
    } else return "";
    return t.name;
  }
  getLinkText(t) {
    let e = this.getSearchText(t);
    return e === "" ? "" : `<span class="${E}">${e}</span>`;
  }
  renderList() {
    let t = this.querySelector("#" + f);
    t && (t.outerHTML = this.List()), this.mark();
  }
  render() {
    this.innerHTML = `
            <div class="font-serif text-base shadow-inner border border-stone-100">
							${this.Input()}
							${this.List()}
            </div>
        `;
  }
  ActiveDot(t) {
    return d(this, h, T).call(this, t), "";
  }
  NoItems(t) {
    return t.length === 0 ? '<div class="px-2 py-0.5 italic text-gray-500">Keine Einträge gefunden</div>' : "";
  }
  Input() {
    return `
			<div class="flex w-full py-0.5 border-b border-zinc-600 bg-stone-50">
						<i class="ri-arrow-right-s-line pl-2"></i>
						<div class="grow">
						<input
								type="text"
								placeholder="${this._placeholder}"
								class="${I} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
  }
  List() {
    let t = this._items;
    if (this._filter)
      if (this._filterstart)
        t = this._items.filter((e) => this.getSearchText(e).toLowerCase().startsWith(this._filter.toLowerCase()));
      else {
        let e = this._filter.split(" ");
        t = this._items.filter((s) => e.every((L) => this.getSearchText(s).toLowerCase().includes(L.toLowerCase())));
      }
    return `
							<div id="${f}" class="${f} pt-1 min-h-[19rem] max-h-60 overflow-auto border-b border-zinc-300 bg-stone-50 ${c(this, n) ? "hidden" : ""}">
								${t.map(
      (e, s) => `
									<a
										href="${this._url}${this.getHREF(e)}"
										class="${w} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${d(this, h, T).call(this, e) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(e)}
										${this.getLinkText(e)}
									</a>
								`
    ).join("")}
								${this.NoItems(t)}
							</div>
				`;
  }
}
n = new WeakMap(), h = new WeakSet(), T = function(t) {
  if (!t)
    return !1;
  let e = this.getHREF(t);
  return !(e === "" || !window.location.href.endsWith(e));
};
customElements.define(F, k);
export {
  k as FilterList,
  $ as XSLTParseProcess
};
