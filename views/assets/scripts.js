var p = (r) => {
  throw TypeError(r);
};
var L = (r, i, t) => i.has(r) || p("Cannot " + t);
var u = (r, i, t) => (L(r, i, "read from private field"), t ? t.call(r) : i.get(r)), o = (r, i, t) => i.has(r) ? p("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(r) : i.set(r, t), h = (r, i, t, e) => (L(r, i, "write to private field"), e ? e.call(r, t) : i.set(r, t), t), f = (r, i, t) => (L(r, i, "access private method"), t);
const v = "script[xslt-onload]", g = "xslt-template", w = "xslt-transformed", A = "filter-list";
var a, c, T;
class S {
  constructor() {
    o(this, c);
    o(this, a);
    h(this, a, /* @__PURE__ */ new Map());
  }
  setup() {
    let i = htmx.findAll(v);
    for (let t of i)
      f(this, c, T).call(this, t);
  }
  hookupHTMX() {
    htmx.on("htmx:load", (i) => {
      this.setup();
    });
  }
}
a = new WeakMap(), c = new WeakSet(), T = function(i) {
  if (i.getAttribute(w) === "true" || !i.hasAttribute(g))
    return;
  let t = "#" + i.getAttribute(g), e = u(this, a).get(t);
  if (!e) {
    let d = htmx.find(t);
    if (d) {
      let E = d.innerHTML ? new DOMParser().parseFromString(d.innerHTML, "application/xml") : d.contentDocument;
      e = new XSLTProcessor(), e.importStylesheet(E), u(this, a).set(t, e);
    } else
      throw new Error("Unknown XSLT template: " + t);
  }
  let s = new DOMParser().parseFromString(i.innerHTML, "application/xml"), b = e.transformToFragment(s, document), x = new XMLSerializer().serializeToString(b);
  i.outerHTML = x;
};
var n, l, _, m;
class k extends HTMLElement {
  constructor() {
    super();
    o(this, l);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._filterstart && h(this, n, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, s) {
    t === "data-url" && e !== s && (this._url = s, this.render()), t === "data-filterstart" && e !== s && (this._filterstart = s === "true", this.render()), t === "data-placeholder" && e !== s && (this._placeholder = s, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (h(this, n, !1), this.renderList());
  }
  onLoseFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (t.target.value = "", this._filter = "", this._filterstart && h(this, n, !0), this.renderList());
  }
  onEnter(t) {
    if (t.target && t.target.tagName.toLowerCase() === "input" && t.key === "Enter") {
      t.preventDefault();
      const e = this.querySelector("a");
      e && e.click();
    }
  }
  setHREFFunc(t) {
    this.getHREF = t, this.render();
  }
  setLinkTextFunc(t) {
    this.getLinkText = t, this.render();
  }
  getHREF(t) {
    if (t) {
      if (!t.id)
        return "";
    } else return "";
    return t.id;
  }
  getLinkText(t) {
    if (t) {
      if (!t.name)
        return "";
    } else return "";
    return t.name;
  }
  renderList() {
    let t = this.querySelector("#list");
    t && (t.outerHTML = this.List());
  }
  render() {
    this.innerHTML = `
            <div class="p-4 font-serif text-base">
							${this.Input()}
							${this.List()}
            </div>
        `;
  }
  Input() {
    return `
			<div class="flex w-full pb-0.5 border-b border-zinc-600">
						<i class="ri-arrow-right-s-line mr-1"></i>
						<div class="grow">
						<input
								type="text"
								placeholder="${this._placeholder}"
								class="w-full placeholder:italic px-2 " />
						</div>
				</div>
				`;
  }
  List() {
    let t = this._items;
    return this._filter && (this._filterstart ? t = this._items.filter((e) => this.getLinkText(e).toLowerCase().startsWith(this._filter.toLowerCase())) : t = this._items.filter((e) => this.getLinkText(e).toLowerCase().includes(this._filter.toLowerCase()))), `
							<div id="list" class="links min-h-72 max-h-60 overflow-auto border-b border-zinc-300 ${f(this, l, m).call(this)}">
								${t.map(
      (e, s) => `
									<a
										href="${this._url}${this.getHREF(e)}"
										class="block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${f(this, l, _).call(this, e)}>
										${this.getLinkText(e)}
									</a>
								`
    ).join("")}
							</div>
				`;
  }
}
n = new WeakMap(), l = new WeakSet(), _ = function(t) {
  if (!t)
    return "";
  let e = this.getHREF(t);
  return e === "" || !window.location.href.endsWith(e) ? "" : "aria-current='page'";
}, m = function() {
  return u(this, n) ? "hidden" : "";
};
customElements.define(A, k);
export {
  k as FilterList,
  S as XSLTParseProcess
};
