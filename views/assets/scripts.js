var _ = (i) => {
  throw TypeError(i);
};
var L = (i, r, t) => r.has(i) || _("Cannot " + t);
var d = (i, r, t) => (L(i, r, "read from private field"), t ? t.call(i) : r.get(i)), o = (i, r, t) => r.has(i) ? _("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(i) : r.set(i, t), a = (i, r, t, e) => (L(i, r, "write to private field"), e ? e.call(i, t) : r.set(i, t), t), u = (i, r, t) => (L(i, r, "access private method"), t);
const v = "script[xslt-onload]", b = "xslt-template", w = "xslt-transformed", k = "filter-list", f = "filter-list-list", y = "filter-list-item", A = "filter-list-input", m = "filter-list-searchable", F = "scroll-button";
var l, p, E;
class H {
  constructor() {
    o(this, p);
    o(this, l);
    a(this, l, /* @__PURE__ */ new Map());
  }
  setup() {
    let r = htmx.findAll(v);
    for (let t of r)
      u(this, p, E).call(this, t);
  }
  hookupHTMX() {
    htmx.on("htmx:load", (r) => {
      this.setup();
    });
  }
}
l = new WeakMap(), p = new WeakSet(), E = function(r) {
  if (r.getAttribute(w) === "true" || !r.hasAttribute(b))
    return;
  let t = "#" + r.getAttribute(b), e = d(this, l).get(t);
  if (!e) {
    let c = htmx.find(t);
    if (c) {
      let x = c.innerHTML ? new DOMParser().parseFromString(c.innerHTML, "application/xml") : c.contentDocument;
      e = new XSLTProcessor(), e.importStylesheet(x), d(this, l).set(t, e);
    } else
      throw new Error("Unknown XSLT template: " + t);
  }
  let s = new DOMParser().parseFromString(r.innerHTML, "application/xml"), T = e.transformToFragment(s, document), S = new XMLSerializer().serializeToString(T);
  r.outerHTML = S;
};
var n, h, g;
class I extends HTMLElement {
  constructor() {
    super();
    o(this, h);
    o(this, n, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._filterstart && a(this, n, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, s) {
    t === "data-url" && e !== s && (this._url = s, this.render()), t === "data-filterstart" && e !== s && (this._filterstart = s === "true", this.render()), t === "data-placeholder" && e !== s && (this._placeholder = s, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (a(this, n, !1), this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && a(this, n, !0), this.renderList();
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
    let e = new Mark(t.querySelectorAll("." + m));
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
    return e === "" ? "" : `<span class="${m}">${e}</span>`;
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
    return u(this, h, g).call(this, t), "";
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
								class="${A} w-full placeholder:italic px-2 py-0.5" />
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
        t = this._items.filter((s) => e.every((T) => this.getSearchText(s).toLowerCase().includes(T.toLowerCase())));
      }
    return `
							<div id="${f}" class="${f} pt-1 min-h-[19rem] max-h-60 overflow-auto border-b border-zinc-300 bg-stone-50 ${d(this, n) ? "hidden" : ""}">
								${t.map(
      (e, s) => `
									<a
										href="${this._url}${this.getHREF(e)}"
										class="${y} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${u(this, h, g).call(this, e) ? 'aria-current="page"' : ""}>
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
n = new WeakMap(), h = new WeakSet(), g = function(t) {
  if (!t)
    return !1;
  let e = this.getHREF(t);
  return !(e === "" || !window.location.href.endsWith(e));
};
class M extends HTMLElement {
  constructor() {
    super(), this.handleScroll = this.handleScroll.bind(this), this.scrollToTop = this.scrollToTop.bind(this);
  }
  connectedCallback() {
    this.innerHTML = `
          <button
            class="
              scroll-to-top
              fixed bottom-5 right-5
              hidden
              bg-gray-800 text-white
              p-2
              rounded-md
              cursor-pointer
              text-2xl
              hover:opacity-80
              transition-opacity
              border-0
            "
            aria-label="Scroll to top"
          >
					<i class="ri-arrow-up-double-line"></i>
          </button>
        `, this._button = this.querySelector(".scroll-to-top"), window.addEventListener("scroll", this.handleScroll), this._button.addEventListener("click", this.scrollToTop);
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll), this._button.removeEventListener("click", this.scrollToTop);
  }
  handleScroll() {
    (window.scrollY || document.documentElement.scrollTop) > 300 ? this._button.classList.remove("hidden") : this._button.classList.add("hidden");
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
customElements.define(k, I);
customElements.define(F, M);
export {
  I as FilterList,
  M as ScrollButton,
  H as XSLTParseProcess
};
