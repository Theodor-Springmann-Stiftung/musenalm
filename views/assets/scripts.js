var _ = (s) => {
  throw TypeError(s);
};
var L = (s, i, t) => i.has(s) || _("Cannot " + t);
var d = (s, i, t) => (L(s, i, "read from private field"), t ? t.call(s) : i.get(s)), n = (s, i, t) => i.has(s) ? _("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(s) : i.set(s, t), a = (s, i, t, e) => (L(s, i, "write to private field"), e ? e.call(s, t) : i.set(s, t), t), u = (s, i, t) => (L(s, i, "access private method"), t);
const S = "script[xslt-onload]", b = "xslt-template", w = "xslt-transformed", y = "filter-list", p = "filter-list-list", k = "filter-list-item", A = "filter-list-input", g = "filter-list-searchable", M = "scroll-button", F = "tool-tip";
var l, f, x;
class $ {
  constructor() {
    n(this, f);
    n(this, l);
    a(this, l, /* @__PURE__ */ new Map());
  }
  setup() {
    let i = htmx.findAll(S);
    for (let t of i)
      u(this, f, x).call(this, t);
  }
  hookupHTMX() {
    htmx.on("htmx:load", (i) => {
      this.setup();
    });
  }
}
l = new WeakMap(), f = new WeakSet(), x = function(i) {
  if (i.getAttribute(w) === "true" || !i.hasAttribute(b))
    return;
  let t = "#" + i.getAttribute(b), e = d(this, l).get(t);
  if (!e) {
    let c = htmx.find(t);
    if (c) {
      let v = c.innerHTML ? new DOMParser().parseFromString(c.innerHTML, "application/xml") : c.contentDocument;
      e = new XSLTProcessor(), e.importStylesheet(v), d(this, l).set(t, e);
    } else
      throw new Error("Unknown XSLT template: " + t);
  }
  let r = new DOMParser().parseFromString(i.innerHTML, "application/xml"), T = e.transformToFragment(r, document), E = new XMLSerializer().serializeToString(T);
  i.outerHTML = E;
};
var o, h, m;
class I extends HTMLElement {
  constructor() {
    super();
    n(this, h);
    n(this, o, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._filterstart && a(this, o, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, r) {
    t === "data-url" && e !== r && (this._url = r, this.render()), t === "data-filterstart" && e !== r && (this._filterstart = r === "true", this.render()), t === "data-placeholder" && e !== r && (this._placeholder = r, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (a(this, o, !1), this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && a(this, o, !0), this.renderList();
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
    let t = this.querySelector("#" + p);
    if (!t)
      return;
    let e = new Mark(t.querySelectorAll("." + g));
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
    return e === "" ? "" : `<span class="${g}">${e}</span>`;
  }
  renderList() {
    let t = this.querySelector("#" + p);
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
    return u(this, h, m).call(this, t), "";
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
        t = this._items.filter((r) => e.every((T) => this.getSearchText(r).toLowerCase().includes(T.toLowerCase())));
      }
    return `
							<div id="${p}" class="${p} pt-1 min-h-[19rem] max-h-60 overflow-auto border-b border-zinc-300 bg-stone-50 ${d(this, o) ? "hidden" : ""}">
								${t.map(
      (e, r) => `
									<a
										href="${this._url}${this.getHREF(e)}"
										class="${k} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${r % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${u(this, h, m).call(this, e) ? 'aria-current="page"' : ""}>
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
o = new WeakMap(), h = new WeakSet(), m = function(t) {
  if (!t)
    return !1;
  let e = this.getHREF(t);
  return !(e === "" || !window.location.href.endsWith(e));
};
class B extends HTMLElement {
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
class C extends HTMLElement {
  static get observedAttributes() {
    return ["position"];
  }
  constructor() {
    super(), this._tooltipBox = null;
  }
  connectedCallback() {
    this.classList.add(
      "w-full",
      "h-full",
      "relative",
      "block",
      "leading-none",
      "[&>*]:leading-normal"
    );
    const i = this.querySelector(".data-tip"), t = i ? i.innerHTML : "Tooltip";
    i && i.remove(), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = t, this._tooltipBox.className = [
      "opacity-0",
      "hidden",
      "absolute",
      "px-2",
      "py-1",
      "text-sm",
      "text-white",
      "bg-gray-900",
      "rounded",
      "shadow",
      "z-10",
      "whitespace-nowrap",
      "transition-all",
      "duration-200",
      "font-sans"
    ].join(" "), this.appendChild(this._tooltipBox), this._updatePosition(), this.addEventListener("mouseenter", () => this._showTooltip()), this.addEventListener("mouseleave", () => this._hideTooltip());
  }
  attributeChangedCallback(i, t, e) {
    i === "position" && this._tooltipBox && this._updatePosition();
  }
  _showTooltip() {
    this._tooltipBox.classList.remove("hidden"), setTimeout(() => {
      this._tooltipBox.classList.remove("opacity-0"), this._tooltipBox.classList.add("opacity-100");
    }, 16);
  }
  _hideTooltip() {
    setTimeout(() => {
      this._tooltipBox.classList.remove("opacity-100"), this._tooltipBox.classList.add("opacity-0"), setTimeout(() => {
        this._tooltipBox.classList.add("hidden");
      }, 200);
    }, 100);
  }
  _updatePosition() {
    switch (this._tooltipBox.classList.remove(
      "bottom-full",
      "left-1/2",
      "-translate-x-1/2",
      "mb-2",
      // top
      "top-full",
      "mt-2",
      // bottom
      "right-full",
      "-translate-y-1/2",
      "mr-2",
      "top-1/2",
      // left
      "left-full",
      "ml-2"
      // right
    ), this.getAttribute("position") || "top") {
      case "bottom":
        this._tooltipBox.classList.add(
          "top-full",
          "left-1/2",
          "transform",
          "-translate-x-1/2",
          "mt-0.5"
        );
        break;
      case "left":
        this._tooltipBox.classList.add(
          "right-full",
          "top-1/2",
          "transform",
          "-translate-y-1/2",
          "mr-0.5"
        );
        break;
      case "right":
        this._tooltipBox.classList.add(
          "left-full",
          "top-1/2",
          "transform",
          "-translate-y-1/2",
          "ml-0.5"
        );
        break;
      case "top":
      default:
        this._tooltipBox.classList.add(
          "bottom-full",
          "left-1/2",
          "transform",
          "-translate-x-1/2",
          "mb-0.5"
        );
    }
  }
}
customElements.define(y, I);
customElements.define(M, B);
customElements.define(F, C);
export {
  I as FilterList,
  B as ScrollButton,
  $ as XSLTParseProcess
};
