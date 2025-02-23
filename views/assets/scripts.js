var L = (s) => {
  throw TypeError(s);
};
var T = (s, e, t) => e.has(s) || L("Cannot " + t);
var g = (s, e, t) => (T(s, e, "read from private field"), t ? t.call(s) : e.get(s)), c = (s, e, t) => e.has(s) ? L("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(s) : e.set(s, t), u = (s, e, t, i) => (T(s, e, "write to private field"), i ? i.call(s, t) : e.set(s, t), t), f = (s, e, t) => (T(s, e, "access private method"), t);
const w = "script[xslt-onload]", v = "xslt-template", A = "xslt-transformed", k = "filter-list", m = "filter-list-list", M = "filter-list-item", y = "filter-list-input", x = "filter-list-searchable", B = "scroll-button", P = "tool-tip", I = "abbrev-tooltips";
var h, b, E;
class R {
  constructor() {
    c(this, b);
    c(this, h);
    u(this, h, /* @__PURE__ */ new Map());
  }
  setup() {
    let e = htmx.findAll(w);
    for (let t of e)
      f(this, b, E).call(this, t);
  }
  hookupHTMX() {
    htmx.on("htmx:load", (e) => {
      this.setup();
    });
  }
}
h = new WeakMap(), b = new WeakSet(), E = function(e) {
  if (e.getAttribute(A) === "true" || !e.hasAttribute(v))
    return;
  let t = "#" + e.getAttribute(v), i = g(this, h).get(t);
  if (!i) {
    let l = htmx.find(t);
    if (l) {
      let S = l.innerHTML ? new DOMParser().parseFromString(l.innerHTML, "application/xml") : l.contentDocument;
      i = new XSLTProcessor(), i.importStylesheet(S), g(this, h).set(t, i);
    } else
      throw new Error("Unknown XSLT template: " + t);
  }
  let r = new DOMParser().parseFromString(e.innerHTML, "application/xml"), n = i.transformToFragment(r, document), a = new XMLSerializer().serializeToString(n);
  e.outerHTML = a;
};
var o, p, _;
class H extends HTMLElement {
  constructor() {
    super();
    c(this, p);
    c(this, o, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._filterstart && u(this, o, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, i, r) {
    t === "data-url" && i !== r && (this._url = r, this.render()), t === "data-filterstart" && i !== r && (this._filterstart = r === "true", this.render()), t === "data-placeholder" && i !== r && (this._placeholder = r, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (u(this, o, !1), this.renderList());
  }
  onLoseFocus(t) {
    let i = this.querySelector("input");
    if (t.target && t.target === i) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      i.value = "", this._filter = "", this._filterstart && u(this, o, !0), this.renderList();
    }
  }
  onEnter(t) {
    if (t.target && t.target.tagName.toLowerCase() === "input" && t.key === "Enter") {
      t.preventDefault();
      const i = this.querySelector("a");
      i && i.click();
    }
  }
  mark() {
    if (typeof Mark != "function")
      return;
    let t = this.querySelector("#" + m);
    if (!t)
      return;
    let i = new Mark(t.querySelectorAll("." + x));
    this._filter && i.mark(this._filter, {
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
    let i = this.getSearchText(t);
    return i === "" ? "" : `<span class="${x}">${i}</span>`;
  }
  renderList() {
    let t = this.querySelector("#" + m);
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
    return f(this, p, _).call(this, t), "";
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
								class="${y} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
  }
  List() {
    let t = this._items;
    if (this._filter)
      if (this._filterstart)
        t = this._items.filter((i) => this.getSearchText(i).toLowerCase().startsWith(this._filter.toLowerCase()));
      else {
        let i = this._filter.split(" ");
        t = this._items.filter((r) => i.every((n) => this.getSearchText(r).toLowerCase().includes(n.toLowerCase())));
      }
    return `
							<div id="${m}" class="${m} pt-1 min-h-[19rem] max-h-60 overflow-auto border-b border-zinc-300 bg-stone-50 ${g(this, o) ? "hidden" : ""}">
								${t.map(
      (i, r) => `
									<a
										href="${this._url}${this.getHREF(i)}"
										class="${M} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${r % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${f(this, p, _).call(this, i) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(i)}
										${this.getLinkText(i)}
									</a>
								`
    ).join("")}
								${this.NoItems(t)}
							</div>
				`;
  }
}
o = new WeakMap(), p = new WeakSet(), _ = function(t) {
  if (!t)
    return !1;
  let i = this.getHREF(t);
  return !(i === "" || !window.location.href.endsWith(i));
};
class C extends HTMLElement {
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
class F extends HTMLElement {
  static get observedAttributes() {
    return ["position", "timeout"];
  }
  constructor() {
    super(), this._tooltipBox = null, this._timeout = 200, this._hideTimeout = null, this._hiddenTimeout = null;
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
    const e = this.querySelector(".data-tip"), t = e ? e.innerHTML : "Tooltip";
    e && e.remove(), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = t, this._tooltipBox.className = [
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
  attributeChangedCallback(e, t, i) {
    e === "position" && this._tooltipBox && this._updatePosition(), e === "timeout" && i && (this._timeout = parseInt(i) || 200);
  }
  _showTooltip() {
    clearTimeout(this._hideTimeout), clearTimeout(this._hiddenTimeout), this._tooltipBox.classList.remove("hidden"), setTimeout(() => {
      this._tooltipBox.classList.remove("opacity-0"), this._tooltipBox.classList.add("opacity-100");
    }, 16);
  }
  _hideTooltip() {
    this._hideTimeout = setTimeout(() => {
      this._tooltipBox.classList.remove("opacity-100"), this._tooltipBox.classList.add("opacity-0"), this._hiddenTimeout = setTimeout(() => {
        this._tooltipBox.classList.add("hidden");
      }, this._timeout + 100);
    }, this._timeout);
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
class d extends HTMLElement {
  static get observedAttributes() {
    return ["data-text", "data-abbrevmap"];
  }
  static get defaultAbbrevMap() {
    return {
      "#": "Hinweis auf weitere Informationen in der Anmerkung.",
      $: "vermutlich",
      "+++": "Inhalte aus mehreren Almanachen interpoliert",
      B: "Blatt",
      BB: "Blätter",
      C: "Corrigenda",
      Diagr: "Diagramm",
      G: "Graphik",
      "G-Verz": "Verzeichnis der Kupfer u. ä.",
      GG: "Graphiken",
      Hrsg: "Herausgeber",
      "I-Verz": "Inhaltsverzeichnis",
      Kal: "Kalendarium",
      Kr: "Karte",
      MusB: "Musikbeigabe",
      MusBB: "Musikbeigaben",
      S: "Seite",
      SS: "Seiten",
      Sp: "Spiegel",
      T: "Titel",
      TG: "Titelgraphik, Titelportrait etc",
      "TG r": "Titelgraphik, Titelportrait etc recto",
      "TG v": "Titelgraphik, Titelportrait etc verso",
      Tab: "Tabelle",
      UG: "Umschlaggraphik",
      "UG r": "Umschlaggraphik recto",
      "UG v": "Umschlaggraphik verso",
      VB: "Vorsatzblatt",
      Vf: "Verfasser",
      VrlgM: "Verlagsmitteilung",
      Vrwrt: "Vorwort",
      ar: "arabische Paginierung",
      ar1: "erste arabische Paginierung",
      ar2: "zweite arabische Paginierung",
      ar3: "dritte arabische Paginierung",
      ar4: "vierte arabische Paginierung",
      ar5: "fünfte arabische Paginierung",
      ar6: "sechste arabische Paginierung",
      ar7: "siebte arabische Paginierung",
      gA: "graphische Anleitung",
      gT: "graphischer Titel",
      gTzA: "graphische Tanzanleitung",
      nT: "Nachtitel",
      röm: "römische Paginierung",
      röm1: "erste römische Paginierung",
      röm2: "zweite römische Paginierung",
      röm3: "dritte römische Paginierung",
      röm4: "vierte römische Paginierung",
      röm5: "fünfte römische Paginierung",
      röm6: "sechste römische Paginierung",
      röm7: "siebte römische Paginierung",
      vT: "Vortitel",
      zT: "Zwischentitel",
      "§§": "Hinweis auf Mängel im Almanach (Beschädigungen, fehlende Graphiken, unvollständige Sammlungen etc) in der Anmerkung"
    };
  }
  constructor() {
    super(), this._abbrevMap = d.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(e, t, i) {
    t !== i && (e === "data-abbrevmap" && this._parseAndSetAbbrevMap(i), this.render());
  }
  _parseAndSetAbbrevMap(e) {
    if (!e) {
      this._abbrevMap = d.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(e);
    } catch {
      this._abbrevMap = d.defaultAbbrevMap;
    }
  }
  setAbbrevMap(e) {
    typeof e == "object" && e !== null && (this._abbrevMap = e, this.render());
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set text(e) {
    this.setAttribute("data-text", e);
  }
  render() {
    this.innerHTML = this.transformText(this.text, this._abbrevMap);
  }
  transformText(e, t) {
    let i = "", r = 0;
    for (; r < e.length; ) {
      if (r > 0 && !this.isSpaceOrPunct(e[r - 1])) {
        i += e[r], r++;
        continue;
      }
      const n = this.findLongestAbbrevAt(e, r, t);
      if (n) {
        const { match: a, meaning: l } = n;
        i += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${l}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${a}
              </span>
            </tool-tip>
          `, r += a.length;
      } else
        i += e[r], r++;
    }
    return i;
  }
  findLongestAbbrevAt(e, t, i) {
    let r = null, n = 0;
    for (const a of Object.keys(i))
      e.startsWith(a, t) && a.length > n && (r = a, n = a.length);
    return r ? { match: r, meaning: i[r] } : null;
  }
  isSpaceOrPunct(e) {
    return /\s|[.,;:!?]/.test(e);
  }
}
customElements.define(I, d);
customElements.define(k, H);
customElements.define(B, C);
customElements.define(P, F);
export {
  d as AbbreviationTooltips,
  H as FilterList,
  C as ScrollButton,
  R as XSLTParseProcess
};
