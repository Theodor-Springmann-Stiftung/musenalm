var ut = Object.defineProperty;
var O = (l) => {
  throw TypeError(l);
};
var mt = (l, i, t) => i in l ? ut(l, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[i] = t;
var u = (l, i, t) => mt(l, typeof i != "symbol" ? i + "" : i, t), v = (l, i, t) => i.has(l) || O("Cannot " + t);
var L = (l, i, t) => (v(l, i, "read from private field"), t ? t.call(l) : i.get(l)), f = (l, i, t) => i.has(l) ? O("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(l) : i.set(l, t), g = (l, i, t, e) => (v(l, i, "write to private field"), e ? e.call(l, t) : i.set(l, t), t), I = (l, i, t) => (v(l, i, "access private method"), t);
class pt extends HTMLElement {
  constructor() {
    super(), this._value = "", this.render();
  }
  static get observedAttributes() {
    return ["data-text", "data-queryparam", "data-value"];
  }
  set value(i) {
    this.setAttribute("data-value", i);
  }
  get value() {
    return this.getAttribute("data-value") || "";
  }
  set text(i) {
    this.setAttribute("data-text", i);
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set queryparam(i) {
    this.setAttribute("data-queryparam", i);
  }
  get queryparam() {
    return this.getAttribute("data-queryparam") || "";
  }
  connectedCallback() {
    this._filter = this.text, this._queryparam = this.queryparam, this.render(), htmx.process(this);
  }
  attributeChangedCallback(i, t, e) {
    t !== e && (i === "data-text" && (this._filter = e), i === "data-queryparam" && (this._queryparam = e), i === "data-value" && (this._value = e), this.render());
  }
  getURL() {
    if (this._queryparam) {
      let i = new URL(window.location), t = new URLSearchParams(i.search);
      return t.delete(this._queryparam), t.delete("page"), i.search = t.toString(), i.toString();
    }
    return "#";
  }
  render() {
    this.innerHTML = `
		<a href="${this.getURL()}" class="!no-underline block text-base" hx-target="#searchresults" hx-select="#searchresults" hx-indicator="body" hx-swap="outerHTML show:window:top">
			<div class="flex flex-row filter-pill rounded-lg bg-orange-100 hover:saturate-50 px-2.5">
				${this.renderIcon()}
				<div class="flex flex-row filter-pill-label-value !items-baseline text-slate-700">
					<div class="filter-pill-label font-bold mr-1.5 align-baseline">${this.text}</div>
					${this.renderValue()}
				</div>
			</div>
		</a>
		`;
  }
  renderIcon() {
    return this.value === "true" || this.value === "false" ? `
			<div href="${this.getURL()}" class="filter-pill-close no-underline font-bold mr-1 text-orange-900 hover:text-orange-800">
				<i class="ri-close-circle-line"></i>
			</div>
		` : `<div
				href="${this.getURL()}"
				class="filter-pill-close no-underline font-bold mr-1 text-orange-900 hover:text-orange-800">
				<i class="ri-arrow-left-s-line"></i>
			</div>
			`;
  }
  renderValue() {
    return this.value === "true" || this.value === "false" ? "" : `
			<div class="filter-pill-value">${this.value}</div>
		`;
  }
}
const E = "filter-list-list", _t = "filter-list-item", ft = "filter-list-input", B = "filter-list-searchable";
var d, _, k;
class gt extends HTMLElement {
  constructor() {
    super();
    f(this, _);
    f(this, d, !1);
    this._items = [], this._url = "", this._filterstart = !1, this._placeholder = "Liste filtern...", this._queryparam = "", this._startparams = null, this.render();
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && g(this, d, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, s) {
    t === "data-url" && e !== s && (this._url = s, this.render()), t === "data-filterstart" && e !== s && (this._filterstart = s === "true", this.render()), t === "data-placeholder" && e !== s && (this._placeholder = s, this.render()), t === "data-queryparam" && e !== s && (this._queryparam = s, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (g(this, d, !1), this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && g(this, d, !0), this.renderList();
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
    let t = this.querySelector("#" + E);
    if (!t)
      return;
    let e = new Mark(t.querySelectorAll("." + B));
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
  getHREFEncoded(t) {
    return encodeURIComponent(this.getHREF(t));
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
    return e === "" ? "" : `<span class="${B}">${e}</span>`;
  }
  getURL(t) {
    if (this._queryparam) {
      let e = new URL(window.location), s = new URLSearchParams(e.search);
      return s.set(this._queryparam, this.getHREF(t)), s.delete("page"), e.search = s.toString(), e.toString();
    }
    return this._url + this.getHREFEncoded(t);
  }
  renderList() {
    let t = this.querySelector("#" + E);
    t && (t.outerHTML = this.List()), this.mark();
  }
  render() {
    this.innerHTML = `
            <div class="font-serif text-base shadow-inner border border-stone-100">
							${this.Input()}
							${this.List()}
            </div>
        `, htmx && htmx.process(this);
  }
  ActiveDot(t) {
    return I(this, _, k).call(this, t), "";
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
								class="${ft} w-full placeholder:italic px-2 py-0.5" />
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
        t = this._items.filter((s) => e.every((n) => this.getSearchText(s).toLowerCase().includes(n.toLowerCase())));
      }
    return `
							<div id="${E}" class="${E} pt-1 max-h-60 overflow-auto bg-stone-50 ${L(this, d) ? "hidden" : ""}">
								${t.map(
      (e, s) => `
									<a
										href="${this.getURL(e)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${_t} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${I(this, _, k).call(this, e) ? 'aria-current="page"' : ""}>
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
d = new WeakMap(), _ = new WeakSet(), k = function(t) {
  if (!t)
    return !1;
  let e = this.getHREF(t);
  return e === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === e ? !0 : !!window.location.href.endsWith(e);
};
class Et extends HTMLElement {
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
class bt extends HTMLElement {
  static get observedAttributes() {
    return ["position", "timeout"];
  }
  constructor() {
    super(), this._tooltipBox = null, this._timeout = 200, this._hideTimeout = null, this._hiddenTimeout = null;
  }
  connectedCallback() {
    this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal");
    const i = this.querySelector(".data-tip"), t = i ? i.innerHTML : "Tooltip";
    i && i.classList.add("hidden"), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = t, this._tooltipBox.className = [
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
    i === "position" && this._tooltipBox && this._updatePosition(), i === "timeout" && e && (this._timeout = parseInt(e) || 200);
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
class St extends HTMLElement {
  constructor() {
    super(), this.overlay = null, this._others = null, this._thisindex = -1, this._preview = null, this._description = null, this._imageURL = "", this._hideDLButton = !1;
  }
  connectedCallback() {
    this.classList.add("cursor-pointer"), this.classList.add("select-none"), this._imageURL = this.getAttribute("data-image-url") || "", this._hideDLButton = this.getAttribute("data-hide-dl-button") || !1, this._preview = this.querySelector("img"), this._description = this.querySelector(".image-description"), this._preview && this._preview.addEventListener("click", () => {
      this.showOverlay();
    });
    let i = this.closest("image-reel, .image-reel");
    i || (i = document), this._others = Array.from(i.querySelectorAll("popup-image:not(.hidden)")), this._thisindex = this._others.indexOf(this);
  }
  disconnectedCallback() {
    this.overlay && this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay);
  }
  Keys(i) {
    i.repeat || (i.preventDefault(), i.key === "ArrowRight" ? this.next() : i.key === "ArrowLeft" ? this.prev() : i.key === "Escape" && this.hideOverlay());
  }
  next() {
    this._others[this._thisindex + 1] ? (this.hideOverlay(), this._others[this._thisindex + 1].showOverlay()) : document.addEventListener("keydown", this.Keys.bind(this), { once: !0 });
  }
  prev() {
    this._others[this._thisindex - 1] ? (this.hideOverlay(), this._others[this._thisindex - 1].showOverlay()) : document.addEventListener("keydown", this.Keys.bind(this), { once: !0 });
  }
  showOverlay() {
    this.overlay = document.createElement("div"), this.overlay.classList.add(
      "fixed",
      "inset-0",
      "z-50",
      "bg-black/70",
      "flex",
      "items-center",
      "justify-center",
      "p-4"
    ), this.overlay.innerHTML = `
      <div class="relative w-max max-w-dvw max-h-dvh shadow-lg flex flex-col items-center justify-center gap-4">
				<div>
				<div class="absolute -right-16 text-white text-4xl flex flex-col">
					<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Close popup" id="closebutton">
						<i class="ri-close-fill text-4xl"></i>
					</button>
						${this.downloadButton()}
						${this.nextButton()}
						${this.prevButton()}
				</div>
        <img
          src="${this._imageURL}"
          alt="Popup Image"
          class="full max-h-[80vh] max-w-[80vw] object-contain block relative ${this.descriptionImgClass()}"
        />
				${this.description()}
					</div>
      </div>
    `;
    const i = this.overlay.querySelector("#closebutton");
    i && i.addEventListener("click", () => {
      this.hideOverlay();
    });
    const t = this.overlay.querySelector("#nextbtn");
    t && t.addEventListener("click", this.next.bind(this));
    const e = this.overlay.querySelector("#prevbtn");
    e && e.addEventListener("click", this.prev.bind(this)), this.overlay.addEventListener("click", (s) => {
      s.target === this.overlay && this.hideOverlay();
    }), document.addEventListener("keydown", this.Keys.bind(this), { once: !0 }), document.body.appendChild(this.overlay);
  }
  descriptionImgClass() {
    return this.description ? "" : "0";
  }
  nextButton() {
    return this._others[this._thisindex + 1] ? `
			<tool-tip position="right">
			<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Next image" id="nextbtn">
				<i class="ri-arrow-right-box-line"></i>
			</button>
			<div class="data-tip">Nächstes Bild</div>
			</tool-tip>
		` : "";
  }
  prevButton() {
    return this._others[this._thisindex - 1] ? `
			<tool-tip position="right">
			<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Previous image" id="prevbtn">
				<i class="ri-arrow-left-box-line"></i>
			</button>
			<div class="data-tip">Vorheriges Bild</div>
			</tool-tip>
		` : "";
  }
  description() {
    return this._description ? `
        <div class="font-serif text-left description-content mt-3 text-slate-900 ">
					<div class="max-w-[80ch] hyphens-auto px-6 py-2 bg-stone-50 shadow-lg">
          ${this._description.innerHTML}
						</div>
        </div>
			` : "";
  }
  downloadButton() {
    return this._hideDLButton ? "" : `
					<tool-tip position="right">
					<a href="${this._imageURL}" target="_blank" class="text-white no-underline hover:text-gray-300"><i class="ri-file-download-line"></i></a>
					<div class="data-tip">Bild herunterladen</div>
					</tool-tip>
		`;
  }
  hideOverlay() {
    this.overlay.parentNode.removeChild(this.overlay), this.overlay = null;
  }
}
class vt extends HTMLElement {
  static get observedAttributes() {
  }
  constructor() {
    super(), this._showall = !1, this.shown = -1, this._headings = [], this._contents = [], this._checkbox = null;
  }
  connectedCallback() {
    this._headings = Array.from(this.querySelectorAll(".tab-list-head")), this._contents = Array.from(this.querySelectorAll(".tab-list-panel")), this.hookupEvtHandlers(), this.hideDependent(), this._headings.length === 1 && this.expand(0);
  }
  expand(i) {
    i < 0 || i >= this._headings.length || (this.shown = i, this._contents.forEach((t, e) => {
      e === i ? (t.classList.remove("hidden"), this._headings[e].setAttribute("aria-pressed", "true")) : (t.classList.add("hidden"), this._headings[e].setAttribute("aria-pressed", "false"));
    }));
  }
  hookupShowAll(i) {
    i && (this._checkbox = i, i.addEventListener("change", (t) => {
      t.target.checked ? this.showAll() : this.default();
    }));
  }
  hookupEvtHandlers() {
    for (let i of this._headings)
      i.addEventListener("click", this.handleTabClick.bind(this)), i.classList.add("cursor-pointer"), i.classList.add("select-none"), i.setAttribute("role", "button"), i.setAttribute("aria-pressed", "false"), i.setAttribute("tabindex", "0");
    for (let i of this._contents)
      i.classList.add("hidden");
  }
  restore() {
    for (let i of this._headings)
      i.classList.add("cursor-pointer"), i.classList.add("select-none"), i.setAttribute("role", "button"), i.setAttribute("aria-pressed", "false"), i.setAttribute("tabindex", "0"), i.classList.remove("pointer-events-none"), i.classList.remove("!text-slate-900");
    for (let i of this._contents)
      i.classList.add("hidden");
  }
  disable() {
    for (let i of this._headings)
      i.classList.remove("cursor-pointer"), i.classList.remove("select-none"), i.removeAttribute("role"), i.removeAttribute("aria-pressed"), i.removeAttribute("tabindex"), i.classList.add("pointer-events-none"), i.classList.add("!text-slate-900");
  }
  showAll() {
    this._showall = !0, this.shown = -1, this.disable(), this._contents.forEach((i, t) => {
      i.classList.remove("hidden");
      let e = this._headings[t], s = e.querySelectorAll(".show-opened");
      for (let a of s)
        a.classList.add("hidden");
      let n = e.querySelectorAll(".show-closed");
      for (let a of n)
        a.classList.add("hidden");
    });
  }
  default() {
    this._showall = !1, this.restore(), this.hideDependent();
  }
  hideDependent() {
    if (this.shown < 0)
      for (const i of this._headings)
        this._hideAllDep(i, !1);
    else
      this._headings.forEach((i, t) => {
        this._hideAllDep(i, t === this.shown);
      });
  }
  _hideAllDep(i, t) {
    const e = i.querySelectorAll(".show-closed");
    for (let n of e)
      t ? n.classList.add("hidden") : n.classList.remove("hidden");
    const s = Array.from(i.querySelectorAll(".show-opened"));
    for (let n of s)
      t ? n.classList.remove("hidden") : n.classList.add("hidden");
  }
  handleTabClick(i) {
    if (!i.target) {
      console.warn("Invalid event target");
      return;
    }
    const t = this.findParentWithClass(i.target, "tab-list-head");
    if (!t) {
      console.warn("No parent found with class 'tab-list-head'");
      return;
    }
    const e = this._headings.indexOf(t);
    e === this.shown ? (this._contents[e].classList.toggle("hidden"), this._headings[e].setAttribute("aria-pressed", "false"), this.shown = -1) : this.expand(e), this.hideDependent();
  }
  findParentWithClass(i, t) {
    for (; i; ) {
      if (i.classList && i.classList.contains(t))
        return i;
      i = i.parentElement;
    }
    return null;
  }
}
class p extends HTMLElement {
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
    super(), this._abbrevMap = p.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(i, t, e) {
    t !== e && (i === "data-abbrevmap" && this._parseAndSetAbbrevMap(e), this.render());
  }
  _parseAndSetAbbrevMap(i) {
    if (!i) {
      this._abbrevMap = p.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(i);
    } catch {
      this._abbrevMap = p.defaultAbbrevMap;
    }
  }
  setAbbrevMap(i) {
    typeof i == "object" && i !== null && (this._abbrevMap = i, this.render());
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set text(i) {
    this.setAttribute("data-text", i);
  }
  render() {
    this.innerHTML = this.transformText(this.text, this._abbrevMap);
  }
  transformText(i, t) {
    let e = "", s = 0;
    for (; s < i.length; ) {
      if (s > 0 && !this.isSpaceOrPunct(i[s - 1])) {
        e += i[s], s++;
        continue;
      }
      const n = this.findLongestAbbrevAt(i, s, t);
      if (n) {
        const { match: a, meaning: r } = n;
        e += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${r}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${a}
              </span>
            </tool-tip>
          `, s += a.length;
      } else
        e += i[s], s++;
    }
    return e;
  }
  findLongestAbbrevAt(i, t, e) {
    let s = null, n = 0;
    for (const a of Object.keys(e))
      i.startsWith(a, t) && a.length > n && (s = a, n = a.length);
    return s ? { match: s, meaning: e[s] } : null;
  }
  isSpaceOrPunct(i) {
    return /\s|[.,;:!?]/.test(i);
  }
}
class Lt extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style.cursor = "pointer", this.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }
  handleClick(i) {
    const t = this.getAttribute("data-jump");
    if (t) {
      const e = document.querySelector(t);
      e ? e.scrollIntoView({ behavior: "smooth" }) : console.warn(`No element found for selector: ${t}`);
    }
  }
}
var S;
class It extends HTMLElement {
  constructor() {
    super();
    f(this, S, 176);
    this._images = [];
  }
  connectedCallback() {
    this._images = Array.from(this.querySelectorAll(".primages")), this.calculateShownImages();
    const t = new ResizeObserver((e, s) => {
      this.calculateShownImages();
    });
    this._resizeObserver = t, t.observe(this);
  }
  disconnectedCallback() {
    this._resizeObserver.unobserve(this);
  }
  calculateShownImages() {
    const t = this.getBoundingClientRect();
    console.log(t);
    const e = Math.floor(t.width / (L(this, S) + 10));
    for (let s = 0; s < this._images.length; s++)
      s < e - 1 ? this._images[s].classList.remove("hidden") : this._images[s].classList.add("hidden");
  }
}
S = new WeakMap();
const At = "msr-component-wrapper", R = "msr-selected-items-container", $ = "msr-placeholder-no-selection-text", Tt = "msr-selected-item-pill", Ct = "msr-selected-item-text", yt = "msr-item-name", wt = "msr-item-additional-data", xt = "msr-selected-item-role", P = "msr-selected-item-delete-btn", Mt = "msr-controls-area", N = "msr-pre-add-button", D = "msr-input-area-wrapper", b = "msr-input-area-default-border", A = "msr-input-area-staged", H = "msr-staging-area-container", kt = "msr-staged-item-pill", Ot = "msr-staged-item-text", T = "msr-staged-role-select", q = "msr-staged-cancel-btn", U = "msr-text-input", F = "msr-add-button", V = "msr-options-list", W = "msr-option-item", Bt = "msr-option-item-name", Rt = "msr-option-item-detail", G = "msr-option-item-highlighted", C = "msr-hidden-select", $t = "msr-state-no-selection", Pt = "msr-state-has-selection", Nt = "msr-state-list-open", Dt = "msr-state-item-staged";
class ot extends HTMLElement {
  constructor() {
    super();
    u(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._stagedItem = null, this._showAddButton = !0, this._placeholderNoSelection = "Keine Elemente ausgewählt", this._placeholderSearch = "Elemente suchen...", this._placeholderRoleSelect = "Rolle auswählen...", this._options = [], this._roles = [
      "Leitung",
      "Unterstützung",
      "Berater",
      "Beobachter",
      "Spezialist",
      "Koordinator"
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._setupTemplates(), this._bindEventHandlers();
  }
  static get observedAttributes() {
    return [
      "disabled",
      "name",
      "value",
      "show-add-button",
      "placeholder-no-selection",
      "placeholder-search",
      "placeholder-role-select"
    ];
  }
  get showAddButton() {
    return this._showAddButton;
  }
  set showAddButton(t) {
    const e = typeof t == "string" ? t.toLowerCase() !== "false" : !!t;
    this._showAddButton !== e && (this._showAddButton = e, this.setAttribute("show-add-button", String(e)), this.preAddButtonElement && this._updatePreAddButtonVisibility());
  }
  get placeholderNoSelection() {
    return this._placeholderNoSelection;
  }
  set placeholderNoSelection(t) {
    const e = String(t || "Keine Elemente ausgewählt");
    this._placeholderNoSelection !== e && (this._placeholderNoSelection = e, this.setAttribute("placeholder-no-selection", e), this.selectedItemsContainer && this._value.length === 0 && this._renderSelectedItems());
  }
  get placeholderSearch() {
    return this._placeholderSearch;
  }
  set placeholderSearch(t) {
    const e = String(t || "Elemente suchen...");
    this._placeholderSearch !== e && (this._placeholderSearch = e, this.setAttribute("placeholder-search", e), this.inputElement && (this.inputElement.placeholder = e));
  }
  get placeholderRoleSelect() {
    return this._placeholderRoleSelect;
  }
  set placeholderRoleSelect(t) {
    const e = String(t || "Rolle auswählen...");
    this._placeholderRoleSelect !== e && (this._placeholderRoleSelect = e, this.setAttribute("placeholder-role-select", e), this._stagedItem && this.stagedItemPillContainer && this._renderStagedPillOrInput());
  }
  attributeChangedCallback(t, e, s) {
    if (e !== s)
      switch (t) {
        case "disabled":
          this.disabledCallback(this.hasAttribute("disabled"));
          break;
        case "name":
          this.hiddenSelect && (this.hiddenSelect.name = s);
          break;
        case "value":
          break;
        case "show-add-button":
          this.showAddButton = s;
          break;
        case "placeholder-no-selection":
          this.placeholderNoSelection = s;
          break;
        case "placeholder-search":
          this.placeholderSearch = s;
          break;
        case "placeholder-role-select":
          this.placeholderRoleSelect = s;
          break;
      }
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${W} group">
                        <span data-ref="nameEl" class="${Bt}"></span>
                        <span data-ref="detailEl" class="${Rt}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${Tt} group">
                        <span data-ref="textEl" class="${Ct}"></span>
                        <button type="button" data-ref="deleteBtn" class="${P} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${kt} flex items-center">
                        <span data-ref="nameEl" class="${Ot}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${q} flex items-center justify-center">&times;</button>
                `, this.stagedRoleSelectTemplate = document.createElement("template"), this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${T}">
                    </select>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleInputKeyDown = this._handleInputKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleAddButtonClick = this._handleAddButtonClick.bind(this), this._handleCancelStagedItem = this._handleCancelStagedItem.bind(this), this._handleStagedRoleChange = this._handleStagedRoleChange.bind(this);
  }
  _getItemById(t) {
    return this._options.find((e) => e.id === t);
  }
  _getAvailableRolesForItem(t) {
    const e = this._value.filter((s) => s.itemId === t).map((s) => s.role);
    return this._roles.filter((s) => !e.includes(s));
  }
  setRoles(t) {
    if (Array.isArray(t) && t.every((e) => typeof e == "string")) {
      this._roles = [...t], this._stagedItem && this._stagedItem.item && (this._getAvailableRolesForItem(this._stagedItem.item.id).includes(this._stagedItem.currentRole) || (this._stagedItem.currentRole = ""), this._renderStagedPillOrInput(), this._updateAddButtonState());
      const e = this._value.filter((s) => this._roles.includes(s.role));
      e.length !== this._value.length && (this.value = e.map((s) => `${s.itemId},${s.role}`));
    } else
      console.error("setRoles expects an array of strings.");
  }
  setOptions(t) {
    if (Array.isArray(t) && t.every((e) => e && typeof e.id == "string" && typeof e.name == "string")) {
      this._options = [...t];
      const e = this._value.filter((s) => this._getItemById(s.itemId));
      e.length !== this._value.length && (this.value = e.map((s) => `${s.itemId},${s.role}`)), this._stagedItem && this._stagedItem.item && !this._getItemById(this._stagedItem.item.id) && this._handleCancelStagedItem(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else
      console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(t) {
    if (Array.isArray(t)) {
      const e = t.map((a) => {
        if (typeof a == "string") {
          const r = a.split(",");
          if (r.length === 2) {
            const o = r[0].trim(), h = r[1].trim();
            if (this._getItemById(o) && this._roles.includes(h))
              return { itemId: o, role: h, instanceId: crypto.randomUUID() };
          }
        }
        return null;
      }).filter((a) => a !== null), s = [], n = /* @__PURE__ */ new Set();
      for (const a of e) {
        const r = `${a.itemId},${a.role}`;
        n.has(r) || (s.push(a), n.add(r));
      }
      this._value = s;
    } else
      this._value = [];
    this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses();
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(t) {
    this.setAttribute("name", t), this.hiddenSelect && (this.hiddenSelect.name = t);
  }
  connectedCallback() {
    if (this.placeholderNoSelection = this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection, this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch, this.placeholderRoleSelect = this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect, this._render(), this.inputAreaWrapper = this.querySelector(`.${D}`), this.inputElement = this.querySelector(`.${U}`), this.stagedItemPillContainer = this.querySelector(`.${H}`), this.optionsListElement = this.querySelector(`.${V}`), this.selectedItemsContainer = this.querySelector(`.${R}`), this.addButtonElement = this.querySelector(`.${F}`), this.preAddButtonElement = this.querySelector(`.${N}`), this.hiddenSelect = this.querySelector(`.${C}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.hasAttribute("show-add-button") ? this.showAddButton = this.getAttribute("show-add-button") : this.setAttribute("show-add-button", String(this._showAddButton)), this.inputElement && (this.inputElement.placeholder = this.placeholderSearch), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const t = this.getAttribute("value");
      try {
        const e = JSON.parse(t);
        Array.isArray(e) ? this.value = e : (console.warn("Parsed value attribute is not an array:", e), this.value = []);
      } catch (e) {
        if (console.warn("Failed to parse value attribute as JSON array. Attribute was:", t, e), t.startsWith("[") && t.endsWith("]"))
          try {
            const s = t.slice(1, -1).split(",").map((n) => n.replace(/"/g, "").trim()).filter((n) => n);
            this.value = s;
          } catch (s) {
            console.error("Manual parse of value attribute also failed:", t, s), this.value = [];
          }
        else t.includes(",") ? this.value = [t] : this.value = [];
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this.hasAttribute("disabled") && this.disabledCallback(!0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleInputKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.addButtonElement && this.addButtonElement.removeEventListener("click", this._handleAddButtonClick), this.removeEventListener("keydown", this._handleKeyDown), clearTimeout(this._blurTimeout);
  }
  formAssociatedCallback(t) {
  }
  formDisabledCallback(t) {
    this.disabledCallback(t);
  }
  disabledCallback(t) {
    this.inputElement && (this.inputElement.disabled = t), this.classList.toggle("pointer-events-none", t), this.querySelectorAll(`.${P}`).forEach(
      (s) => s.disabled = t
    );
    const e = this.querySelector(`.${T}`);
    e && (e.disabled = t), this.hiddenSelect && (this.hiddenSelect.disabled = t), this._updateAddButtonState(), this._updatePreAddButtonVisibility();
  }
  formResetCallback() {
    this.value = [], this._stagedItem = null, this._renderStagedPillOrInput(), this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this._updateRootElementStateClasses();
  }
  formStateRestoreCallback(t, e) {
    Array.isArray(t) && t.every((s) => typeof s == "string" && s.includes(",")) ? this.value = t : this.value = [], this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((t) => {
      var s;
      const e = document.createElement("option");
      e.value = `${t.itemId},${t.role}`, e.textContent = `${((s = this._getItemById(t.itemId)) == null ? void 0 : s.name) || t.itemId} (${t.role})`, e.selected = !0, this.hiddenSelect.appendChild(e);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle($t, this._value.length === 0), this.classList.toggle(Pt, this._value.length > 0), this.classList.toggle(Nt, this._isOptionsListVisible), this.classList.toggle(Dt, !!this._stagedItem);
  }
  _render() {
    const t = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t), this.innerHTML = `
                    <style>
                        .${C} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${At} relative">
                        <div class="${R} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${$}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${Mt} flex items-center">
                            <div class="${D} ${b} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${H} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${U} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${N} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${F} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${t}-options-list" class="${V} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${t}" class="${C}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedItemPillElement(t) {
    const s = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return s.querySelector('[data-ref="nameEl"]').textContent = t.name, s;
  }
  _createStagedRoleSelectElement(t, e) {
    const n = this.stagedRoleSelectTemplate.content.cloneNode(!0).firstElementChild;
    let a = `<option value="" disabled ${e ? "" : "selected"}>${this.placeholderRoleSelect}</option>`;
    return t.length === 0 && !this._roles.includes(e) ? (a += "<option disabled>Keine Rollen verfügbar</option>", n.disabled = !0) : (t.forEach((r) => {
      a += `<option value="${r}" ${r === e ? "selected" : ""}>${r}</option>`;
    }), n.disabled = t.length === 0 && e === ""), n.innerHTML = a, n.addEventListener("change", this._handleStagedRoleChange), n;
  }
  _createStagedCancelButtonElement(t) {
    const s = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return s.setAttribute("aria-label", `Auswahl von ${t} abbrechen`), s.addEventListener("click", this._handleCancelStagedItem), s;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.item) {
        this.inputAreaWrapper.classList.remove(b), this.inputAreaWrapper.classList.add(A);
        const t = this._createStagedItemPillElement(this._stagedItem.item);
        this.stagedItemPillContainer.appendChild(t);
        const e = this._getAvailableRolesForItem(this._stagedItem.item.id), s = this._createStagedRoleSelectElement(
          e,
          this._stagedItem.currentRole
        );
        this.stagedItemPillContainer.appendChild(s);
        const n = this._createStagedCancelButtonElement(this._stagedItem.item.name);
        this.stagedItemPillContainer.appendChild(n), this.inputElement.classList.add("hidden"), this.inputElement.value = "", this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.setAttribute("aria-expanded", "false");
      } else
        this.inputAreaWrapper.classList.add(b), this.inputAreaWrapper.classList.remove(A), this.inputElement.classList.remove("hidden");
      this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses();
    }
  }
  _updatePreAddButtonVisibility() {
    if (!this.preAddButtonElement) return;
    const t = this.hasAttribute("disabled"), e = !this._stagedItem, s = this.showAddButton && e && !t;
    this.preAddButtonElement.classList.toggle("hidden", !s), this.preAddButtonElement.disabled = t;
  }
  _handleStagedRoleChange(t) {
    this._stagedItem && (this._stagedItem.currentRole = t.target.value, this._updateAddButtonState());
  }
  _handleCancelStagedItem(t) {
    t && t.stopPropagation(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
  }
  _createSelectedItemElement(t) {
    const e = this._getItemById(t.itemId);
    if (!e) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="textEl"]');
    let r = `<span class="${yt}">${e.name}</span>`, o = e.additional_data ? ` <span class="${wt}">(${e.additional_data})</span>` : "", h = ` <span class="${xt}">${t.role}</span>`;
    a.innerHTML = `${r}${o}${h}`;
    const c = n.querySelector('[data-ref="deleteBtn"]');
    return c.setAttribute("aria-label", `Entferne ${e.name} als ${t.role}`), c.dataset.instanceId = t.instanceId, c.disabled = this.hasAttribute("disabled"), c.addEventListener("click", (ct) => {
      ct.stopPropagation(), this._handleDeleteSelectedItem(t.instanceId);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${$}">${this.placeholderNoSelection}</span>` : this._value.forEach((t) => {
      const e = this._createSelectedItemElement(t);
      e && this.selectedItemsContainer.appendChild(e);
    }), this._updateRootElementStateClasses());
  }
  _updateAddButtonState() {
    if (this.addButtonElement) {
      const t = this.hasAttribute("disabled"), e = this._stagedItem && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole), s = !this._stagedItem || !e || t;
      this.addButtonElement.classList.toggle("hidden", s), this.addButtonElement.disabled = s;
    }
  }
  _createOptionElement(t, e) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild;
    return n.querySelector('[data-ref="nameEl"]').textContent = t.name, n.querySelector('[data-ref="detailEl"]').textContent = t.additional_data ? `(${t.additional_data})` : "", n.dataset.id = t.id, n.setAttribute("aria-selected", String(e === this._highlightedIndex)), n.id = `${this.id || "msr"}-option-${t.id}`, e === this._highlightedIndex && n.classList.add(G), n;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.removeAttribute("aria-controls");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this.inputElement.setAttribute("aria-controls", this.optionsListElement.id), this._filteredOptions.forEach((e, s) => {
          const n = this._createOptionElement(e, s);
          this.optionsListElement.appendChild(n);
        });
        const t = this.optionsListElement.querySelector(
          `.${G}`
        );
        t ? (t.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", t.id)) : this.inputElement.removeAttribute("aria-activedescendant");
      }
      this._updateRootElementStateClasses();
    }
  }
  _stageItem(t) {
    if (this._getAvailableRolesForItem(t.id).length === 0)
      return;
    this._stagedItem = { item: t, currentRole: "" }, this.inputElement && (this.inputElement.value = "", this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant")), this._renderStagedPillOrInput(), this._hideOptionsList();
    const s = this.stagedItemPillContainer.querySelector(
      `.${T}`
    );
    s && !s.disabled ? s.focus() : this.addButtonElement && !this.addButtonElement.disabled && this.addButtonElement.focus();
  }
  _handleAddButtonClick() {
    if (!this.hasAttribute("disabled") && this._stagedItem && this._stagedItem.item && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
      const t = {
        itemId: this._stagedItem.item.id,
        role: this._stagedItem.currentRole,
        instanceId: crypto.randomUUID()
      };
      if (this._value.find(
        (s) => s.itemId === t.itemId && s.role === t.role
      )) {
        this._handleCancelStagedItem();
        return;
      }
      this._value.push(t), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
    }
  }
  _handleInput(t) {
    if (this.hasAttribute("disabled")) return;
    this._stagedItem ? (this._stagedItem = null, this._renderStagedPillOrInput()) : this._updatePreAddButtonVisibility();
    const e = t.target.value;
    if (e.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = e.toLowerCase();
      this._filteredOptions = this._options.filter((n) => this._getAvailableRolesForItem(n.id).length === 0 || this._stagedItem && this._stagedItem.item.id === n.id ? !1 : n.name.toLowerCase().includes(s) || n.additional_data && n.additional_data.toLowerCase().includes(s)), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(t) {
    var e;
    if (!this.hasAttribute("disabled")) {
      if (t.key === "Enter" && this._stagedItem && this._stagedItem.item) {
        const s = document.activeElement, n = (e = this.stagedItemPillContainer) == null ? void 0 : e.querySelector(
          `.${q}`
        );
        if (s === n) {
          t.preventDefault(), this._handleCancelStagedItem(t);
          return;
        } else if (this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
          t.preventDefault(), this._handleAddButtonClick();
          return;
        }
      }
      t.key === "Escape" && (this._isOptionsListVisible ? (t.preventDefault(), this._hideOptionsList(), this.inputElement && this.inputElement.focus()) : this._stagedItem && (t.preventDefault(), this._handleCancelStagedItem(t)));
    }
  }
  _handleInputKeyDown(t) {
    if (!(this.hasAttribute("disabled") || this.inputElement && this.inputElement.disabled)) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        t.key === "Enter" && this.inputElement && this.inputElement.value === "" && t.preventDefault();
        return;
      }
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          t.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
        case "Tab":
          this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] ? (t.preventDefault(), this._stageItem(this._filteredOptions[this._highlightedIndex])) : t.key === "Tab" && this._hideOptionsList();
          break;
      }
    }
  }
  _hideOptionsList() {
    this._isOptionsListVisible = !1, this._highlightedIndex = -1, this.optionsListElement && this._renderOptionsList(), this.inputElement && (this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"));
  }
  _handleFocus() {
    if (!(this.hasAttribute("disabled") || this.inputElement && this.inputElement.disabled || this._stagedItem)) {
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(b), this.inputAreaWrapper.classList.remove(A)), this.inputElement && this.inputElement.value.length > 0) {
        const t = this.inputElement.value.toLowerCase();
        this._filteredOptions = this._options.filter((e) => this._getAvailableRolesForItem(e.id).length === 0 ? !1 : e.name.toLowerCase().includes(t) || e.additional_data && e.additional_data.toLowerCase().includes(t)), this._filteredOptions.length > 0 ? (this._isOptionsListVisible = !0, this._highlightedIndex = 0, this._renderOptionsList()) : this._hideOptionsList();
      } else
        this._hideOptionsList();
      this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
    }
  }
  _handleBlur(t) {
    this._blurTimeout = setTimeout(() => {
      const e = document.activeElement;
      e !== this.addButtonElement && e !== this.preAddButtonElement && !(this.stagedItemPillContainer && this.stagedItemPillContainer.contains(e)) && !(this.optionsListElement && this.optionsListElement.contains(e)) && !this.contains(e) && this._hideOptionsList();
    }, 150);
  }
  _handleOptionMouseDown(t) {
    t.preventDefault();
  }
  _handleOptionClick(t) {
    if (this.hasAttribute("disabled")) return;
    const e = t.target.closest(`li[data-id].${W}`);
    if (e) {
      const s = e.dataset.id, n = this._filteredOptions.find((a) => a.id === s);
      n && this._stageItem(n);
    }
  }
  _handleDeleteSelectedItem(t) {
    this.hasAttribute("disabled") || (this._value = this._value.filter((e) => e.instanceId !== t), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem && this._stagedItem.item && this._renderStagedPillOrInput(), this.inputElement && this.inputElement.focus(), this._updatePreAddButtonVisibility());
  }
}
u(ot, "formAssociated", !0);
const Ht = "mss-component-wrapper", z = "mss-selected-items-container", qt = "mss-selected-item-pill", Ut = "mss-selected-item-text", Ft = "mss-selected-item-pill-detail", K = "mss-selected-item-delete-btn", j = "mss-input-controls-container", Q = "mss-input-wrapper", J = "mss-input-wrapper-focused", X = "mss-text-input", Y = "mss-create-new-button", Z = "mss-options-list", Vt = "mss-option-item", Wt = "mss-option-item-name", Gt = "mss-option-item-detail", tt = "mss-option-item-highlighted", y = "mss-hidden-select", zt = "mss-no-items-text", Kt = "mss-state-no-selection", jt = "mss-state-has-selection", Qt = "mss-state-list-open";
class ht extends HTMLElement {
  constructor() {
    super();
    u(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._options = [
      { id: "marie_curie", name: "Marie Curie", additional_data: "Physicist and Chemist" },
      { id: "leonardo_da_vinci", name: "Leonardo da Vinci", additional_data: "Polymath" },
      { id: "albert_einstein", name: "Albert Einstein", additional_data: "Theoretical Physicist" },
      { id: "ada_lovelace", name: "Ada Lovelace", additional_data: "Mathematician and Writer" },
      { id: "isaac_newton", name: "Isaac Newton", additional_data: "Mathematician and Physicist" },
      {
        id: "galileo_galilei",
        name: "Galileo Galilei",
        additional_data: "Astronomer and Physicist"
      },
      { id: "charles_darwin", name: "Charles Darwin", additional_data: "Naturalist" },
      { id: "nikola_tesla", name: "Nikola Tesla", additional_data: "Inventor and Engineer" },
      { id: "jane_austen", name: "Jane Austen", additional_data: "Novelist" },
      {
        id: "william_shakespeare",
        name: "William Shakespeare",
        additional_data: "Playwright and Poet"
      }
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${Vt}">
                        <span data-ref="nameEl" class="${Wt}"></span>
                        <span data-ref="detailEl" class="${Gt}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${qt} flex items-center">
                        <span data-ref="textEl" class="${Ut}"></span>
                        <span data-ref="detailEl" class="${Ft} hidden"></span>
                        <button type="button" data-ref="deleteBtn" class="${K}">&times;</button>
                    </span>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this), this._handleSelectedItemsContainerClick = this._handleSelectedItemsContainerClick.bind(this);
  }
  _getItemById(t) {
    return this._options.find((e) => e.id === t);
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(t) {
    this._placeholder = t, this.inputElement && (this.inputElement.placeholder = this._placeholder), this.setAttribute("placeholder", t);
  }
  get showCreateButton() {
    return this._showCreateButton;
  }
  set showCreateButton(t) {
    const e = String(t).toLowerCase() !== "false" && t !== !1;
    this._showCreateButton !== e && (this._showCreateButton = e, this.createNewButton && this.createNewButton.classList.toggle("hidden", !this._showCreateButton), this.setAttribute("show-create-button", this._showCreateButton ? "true" : "false"));
  }
  setOptions(t) {
    if (Array.isArray(t) && t.every((e) => e && typeof e.id == "string" && typeof e.name == "string")) {
      this._options = [...t];
      const e = this._value.filter((s) => this._getItemById(s));
      e.length !== this._value.length ? this.value = e : this.selectedItemsContainer && this._renderSelectedItems(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(t) {
    const e = JSON.stringify(this._value.sort());
    if (Array.isArray(t))
      this._value = [
        ...new Set(t.filter((n) => typeof n == "string" && this._getItemById(n)))
      ];
    else if (typeof t == "string" && t.trim() !== "") {
      const n = t.trim();
      this._getItemById(n) && !this._value.includes(n) ? this._value = [n] : this._getItemById(n) || (this._value = this._value.filter((a) => a !== n));
    } else this._value = [];
    const s = JSON.stringify(this._value.sort());
    e !== s && (this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses(), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(t) {
    this.setAttribute("name", t), this.hiddenSelect && (this.hiddenSelect.name = t);
  }
  connectedCallback() {
    if (this._render(), this.inputControlsContainer = this.querySelector(`.${j}`), this.inputWrapper = this.querySelector(`.${Q}`), this.inputElement = this.querySelector(`.${X}`), this.createNewButton = this.querySelector(`.${Y}`), this.optionsListElement = this.querySelector(`.${Z}`), this.selectedItemsContainer = this.querySelector(`.${z}`), this.hiddenSelect = this.querySelector(`.${y}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const t = this.getAttribute("value");
      try {
        this.value = JSON.parse(t);
      } catch {
        this.value = t.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this.hasAttribute("disabled") && this.disabledCallback(!0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.createNewButton && this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer && this.selectedItemsContainer.removeEventListener(
      "click",
      this._handleSelectedItemsContainerClick
    ), clearTimeout(this._blurTimeout);
  }
  static get observedAttributes() {
    return ["disabled", "name", "value", "placeholder", "show-create-button"];
  }
  attributeChangedCallback(t, e, s) {
    if (e !== s)
      if (t === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (t === "name" && this.hiddenSelect) this.hiddenSelect.name = s;
      else if (t === "value" && this.inputElement)
        try {
          this.value = JSON.parse(s);
        } catch {
          this.value = s.split(",").map((a) => a.trim()).filter(Boolean);
        }
      else t === "placeholder" ? this.placeholder = s : t === "show-create-button" && (this.showCreateButton = s);
  }
  formAssociatedCallback(t) {
  }
  formDisabledCallback(t) {
    this.disabledCallback(t);
  }
  formResetCallback() {
    this.value = [], this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._updateRootElementStateClasses(), this._renderSelectedItems();
  }
  formStateRestoreCallback(t, e) {
    this.value = Array.isArray(t) ? t : [], this._updateRootElementStateClasses();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((t) => {
      const e = document.createElement("option");
      e.value = t;
      const s = this._getItemById(t);
      e.textContent = s ? s.name : t, e.selected = !0, this.hiddenSelect.appendChild(e);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  disabledCallback(t) {
    this.inputElement && (this.inputElement.disabled = t), this.createNewButton && (this.createNewButton.disabled = t), this.toggleAttribute("disabled", t), this.querySelectorAll(`.${K}`).forEach(
      (e) => e.disabled = t
    ), this.hiddenSelect && (this.hiddenSelect.disabled = t), t && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Kt, this._value.length === 0), this.classList.toggle(jt, this._value.length > 0), this.classList.toggle(Qt, this._isOptionsListVisible);
  }
  _render() {
    const t = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t), this.innerHTML = `
                    <style>
                        .${y} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${Ht} relative">
                        <div class="${z} flex flex-wrap gap-1 mb-1 min-h-[38px]" aria-live="polite" tabindex="-1"></div>
                        <div class="${j} flex items-center space-x-2">
                            <div class="${Q} relative rounded-md flex items-center flex-grow">
                                <input type="text"
                                       class="${X} w-full outline-none bg-transparent text-sm"
                                       placeholder="${this.placeholder}"
                                       aria-autocomplete="list"
                                       aria-expanded="${this._isOptionsListVisible}"
                                       aria-controls="options-list-${t}"
                                       autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                            </div>
                            <button type="button" class="${Y} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                        </div>
                        <ul id="options-list-${t}" role="listbox" class="${Z} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${t}" class="${y}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(t) {
    const e = this._getItemById(t);
    if (!e) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="textEl"]'), r = n.querySelector('[data-ref="detailEl"]'), o = n.querySelector('[data-ref="deleteBtn"]');
    return a.textContent = e.name, e.additional_data ? (r.textContent = `(${e.additional_data})`, r.classList.remove("hidden")) : r.classList.add("hidden"), o.setAttribute("aria-label", `Remove ${e.name}`), o.dataset.id = t, o.disabled = this.hasAttribute("disabled"), o.addEventListener("click", (h) => {
      h.stopPropagation(), this._handleDeleteSelectedItem(t);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${zt}">No items selected</span>` : this._value.forEach((t) => {
      const e = this._createSelectedItemElement(t);
      e && this.selectedItemsContainer.appendChild(e);
    }), this._updateRootElementStateClasses());
  }
  _createOptionElement(t, e) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="nameEl"]'), r = n.querySelector('[data-ref="detailEl"]');
    a.textContent = t.name, r.textContent = t.additional_data ? `(${t.additional_data})` : "", n.dataset.id = t.id, n.setAttribute("aria-selected", String(e === this._highlightedIndex));
    const o = `option-${this.id || "mss"}-${t.id}`;
    return n.id = o, e === this._highlightedIndex && (n.classList.add(tt), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", o)), n;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this._filteredOptions.forEach((e, s) => {
          const n = this._createOptionElement(e, s);
          this.optionsListElement.appendChild(n);
        });
        const t = this.optionsListElement.querySelector(
          `.${tt}`
        );
        t && (t.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", t.id));
      }
      this._updateRootElementStateClasses();
    }
  }
  _handleSelectedItemsContainerClick(t) {
    t.target === this.selectedItemsContainer && this.inputElement && !this.inputElement.disabled && this.inputElement.focus();
  }
  _handleCreateNewButtonClick() {
    if (this.hasAttribute("disabled") || !this.showCreateButton) return;
    const t = this.inputElement ? this.inputElement.value.trim() : "";
    this.dispatchEvent(
      new CustomEvent("createnew", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _handleInput(t) {
    const e = t.target.value;
    if (e.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = e.toLowerCase();
      this._filteredOptions = this._options.filter((n) => {
        if (this._value.includes(n.id)) return !1;
        const a = n.name.toLowerCase().includes(s), r = n.additional_data && n.additional_data.toLowerCase().includes(s);
        return a || r;
      }), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(t) {
    if (!this.inputElement.disabled) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        t.key === "Escape" && this._hideOptionsList(), (t.key === "ArrowDown" || t.key === "ArrowUp") && this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement });
        return;
      }
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          t.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
          t.preventDefault(), this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] && this._selectItem(this._filteredOptions[this._highlightedIndex].id);
          break;
        case "Escape":
          t.preventDefault(), this._hideOptionsList();
          break;
        case "Tab":
          this._hideOptionsList();
          break;
      }
    }
  }
  _hideOptionsList() {
    this._isOptionsListVisible = !1, this._highlightedIndex = -1, this.optionsListElement && this._renderOptionsList();
  }
  _handleFocus() {
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(J), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(J), this._blurTimeout = setTimeout(() => {
      this.contains(document.activeElement) || this._hideOptionsList();
    }, 150);
  }
  _handleOptionMouseDown(t) {
    t.preventDefault();
  }
  _handleOptionClick(t) {
    const e = t.target.closest("li[data-id]");
    e && e.dataset.id && this._selectItem(e.dataset.id);
  }
  _selectItem(t) {
    t && !this._value.includes(t) && (this.value = [...this._value, t]), this.inputElement && (this.inputElement.value = ""), this._filteredOptions = [], this._hideOptionsList(), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleDeleteSelectedItem(t) {
    this.value = this._value.filter((e) => e !== t), this.inputElement && this.inputElement.value && this._handleInput({ target: this.inputElement }), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
}
u(ht, "formAssociated", !0);
const Jt = "rbi-button", Xt = "rbi-icon";
class Yt extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const i = `
              <button type="button" class="${Jt} cursor-pointer disabled:cursor-default" aria-label="Reset field">
								<tool-tip position="right">
									<div class="data-tip">Feld zurücksetzen</div>
									<span class="${Xt} ri-arrow-go-back-fill"></span>
								</tool-tip>
              </button>
            `;
    this.innerHTML = i, this.button = this.querySelector("button"), this.button ? this.button.addEventListener("click", this.handleReset) : console.error("ResetButtonIndividual: Button element not found after setting innerHTML."), this.updateControlledElements(), this.updateButtonAriaLabel();
  }
  disconnectedCallback() {
    this.button && this.button.removeEventListener("click", this.handleReset), this._controlledElements.forEach((i) => {
      i.removeEventListener("input", this.handleInputChange), i.removeEventListener("change", this.handleInputChange);
    });
  }
  attributeChangedCallback(i, t, e) {
    t !== e && (i === "controls" && this.updateControlledElements(), (i === "controls" || i === "button-aria-label") && this.updateButtonAriaLabel());
  }
  updateControlledElements() {
    this._controlledElements.forEach((e) => {
      e.removeEventListener("input", this.handleInputChange), e.removeEventListener("change", this.handleInputChange);
    }), this._controlledElements = [], this.initialStates.clear(), this.lastOverallModifiedState = null;
    const i = (this.getAttribute("controls") || "").split(",").map((e) => e.trim()).filter((e) => e);
    if (!i.length && this.button) {
      this.button.disabled = !0, this.button.setAttribute("aria-disabled", "true"), this.checkIfModified();
      return;
    }
    const t = [];
    i.forEach((e) => {
      const s = document.getElementById(e);
      s ? (t.push(s), this.storeInitialState(s), s.addEventListener("input", this.handleInputChange), s.addEventListener("change", this.handleInputChange)) : console.warn(`ResetButtonIndividual: Element with ID "${e}" not found.`);
    }), this._controlledElements = t, this.button && (this.button.disabled = this._controlledElements.length === 0, this.button.setAttribute("aria-controls", this._controlledElements.map((e) => e.id).join(" ")), this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.checkIfModified();
  }
  storeInitialState(i) {
    let t;
    switch (i.type) {
      case "checkbox":
      case "radio":
        t = { checked: i.checked };
        break;
      case "select-multiple":
        t = {
          selectedOptions: Array.from(i.options).filter((e) => e.selected).map((e) => e.value)
        };
        break;
      case "select-one":
      default:
        t = { value: i.value };
        break;
    }
    this.initialStates.set(i.id, t);
  }
  resetElement(i) {
    const t = this.initialStates.get(i.id);
    if (t) {
      switch (i.type) {
        case "checkbox":
        case "radio":
          i.checked = t.checked;
          break;
        case "select-multiple":
          Array.from(i.options).forEach((e) => {
            e.selected = t.selectedOptions.includes(e.value);
          });
          break;
        case "select-one":
        default:
          i.value = t.value;
          break;
      }
      i.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), i.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
    }
  }
  handleReset() {
    this._controlledElements.forEach((i) => {
      this.resetElement(i);
    }), this.checkIfModified();
  }
  handleInputChange(i) {
    this._controlledElements.includes(i.target) && this.checkIfModified();
  }
  // Internal helper to check a single element
  isElementModified(i) {
    const t = this.initialStates.get(i.id);
    if (!t) return !1;
    switch (i.type) {
      case "checkbox":
      case "radio":
        return i.checked !== t.checked;
      case "select-multiple":
        const e = Array.from(i.options).filter((n) => n.selected).map((n) => n.value), s = t.selectedOptions;
        return e.length !== s.length || e.some((n) => !s.includes(n)) || s.some((n) => !e.includes(n));
      case "select-one":
      default:
        return i.value !== t.value;
    }
  }
  // Public method to check overall modification state
  isCurrentlyModified() {
    if (this._controlledElements.length === 0)
      return !1;
    for (const i of this._controlledElements)
      if (this.isElementModified(i))
        return !0;
    return !1;
  }
  checkIfModified() {
    const i = this.isCurrentlyModified();
    this._controlledElements.forEach((e) => {
      this.isElementModified(e) ? e.classList.add("modified-element") : e.classList.remove("modified-element");
    });
    const t = this.getAttribute("wrapper-class");
    if (t) {
      const e = this.closest(`.${t}`);
      if (e) {
        const s = this.getAttribute("modified-class-suffix") || "modified", n = `${t}-${s}`;
        i ? e.classList.add(n) : e.classList.remove(n);
      }
    }
    if (this.button && (this.button.disabled = !i || this._controlledElements.length === 0, this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.lastOverallModifiedState !== i) {
      const e = new CustomEvent("rbichange", {
        bubbles: !0,
        composed: !0,
        detail: {
          modified: i,
          controlledElementIds: this._controlledElements.map((s) => s.id),
          instance: this
        }
      });
      this.dispatchEvent(e), this.lastOverallModifiedState = i;
    }
  }
  updateButtonAriaLabel() {
    if (!this.button) return;
    let i = this.getAttribute("button-aria-label");
    if (!i) {
      const t = this._controlledElements.map((e) => e.id);
      if (t.length === 1 && this._controlledElements[0]) {
        const e = this._controlledElements[0], s = document.querySelector(`label[for="${e.id}"]`);
        let n = e.name || e.id;
        s && s.textContent ? n = s.textContent.trim().replace(/[:*]$/, "").trim() : e.getAttribute("aria-label") && (n = e.getAttribute("aria-label")), i = `Reset ${n}`;
      } else t.length > 1 ? i = "Reset selected fields" : i = "Reset field";
    }
    this.button.setAttribute("aria-label", i);
  }
}
const w = "div-menu-button", et = "ts-menu-popup", it = "ts-menu-list", Zt = "menu-label", st = "ts-menu-placeholder-message", te = "ts-menu-list-item", x = "ts-menu-item-action", nt = "ts-item-is-selected", m = "hidden", M = "ts-menu-button--disabled", lt = "ts-menu-label--in-menu", at = "ts-menu-label--displayed", rt = "ts-target-placeholder";
class ee extends HTMLElement {
  constructor() {
    super(), this._menuItemsMap = /* @__PURE__ */ new Map(), this._targetElement = null, this._originalChildDivs = [], this._observer = null, this._menuPlaceholderMessageElement = null, this._menuButton = null, this._toggleMenu = this._toggleMenu.bind(this), this._handleMenuItemClick = this._handleMenuItemClick.bind(this), this._handleClickOutside = this._handleClickOutside.bind(this), this._handleContentClose = this._handleContentClose.bind(this), this._handleMutations = this._handleMutations.bind(this), this._checkMenuPlaceholderAndButton = this._checkMenuPlaceholderAndButton.bind(this), this._clearFormElements = this._clearFormElements.bind(this), this._refreshTargetOrder = this._refreshTargetOrder.bind(this);
  }
  connectedCallback() {
    this._menuButton = this.querySelector(`.${w}`), this._menuButton || console.error(`TabSelectorMenu: User-provided menu button with class '${w}' not found.`), this._originalChildDivs = Array.from(this.children).filter((e) => e.nodeType === Node.ELEMENT_NODE && e.tagName === "DIV" && !e.classList.contains(w)), this._originalChildDivs.forEach((e) => e.remove());
    const i = `
                    <div class="${et}">
                        <ul class="${it}">
                            <li class="${st}">All items are currently shown.</li>
                        </ul>
                    </div>
                `;
    if (this.insertAdjacentHTML("beforeend", i), this._menuPopupElement = this.querySelector(`.${et}`), this._menuListElement = this.querySelector(`.${it}`), this._menuPlaceholderMessageElement = this.querySelector(`.${st}`), !this._menuPopupElement || !this._menuListElement || !this._menuPlaceholderMessageElement) {
      console.error("CRITICAL: Popup structure parts missing.");
      return;
    }
    const t = this.getAttribute("target-id");
    t ? (this._targetElement = document.getElementById(t), this._targetElement || console.warn(`TabSelectorMenu: Target ID '${t}' not found.`)) : console.warn("TabSelectorMenu: 'target-id' attribute missing."), this._observer = new MutationObserver(this._handleMutations), this._originalChildDivs.forEach((e) => {
      const s = e.querySelector("label." + Zt), n = e.dataset.value;
      if (!s || !n) {
        console.warn('TabSelectorMenu: Source div missing <label class="menu-label"> or data-value:', e);
        return;
      }
      const a = !e.classList.contains(m);
      this.appendChild(e);
      const r = s.textContent.trim(), o = `
                        <li class="${te}">
                            <button type="button" class="${x}" data-value="${n}">
                                ${r}
                            </button>
                        </li>`;
      this._menuPlaceholderMessageElement.insertAdjacentHTML("beforebegin", o);
      const h = this._menuListElement.querySelector(`.${x}[data-value="${n}"]`);
      this._menuItemsMap.set(n, {
        sourceDiv: e,
        menuItemButton: h,
        menuListItem: h.parentElement,
        menuLabelElement: s,
        selected: a
      }), this._observer.observe(e, { attributes: !0, attributeFilter: ["class"] });
    }), this._menuItemsMap.forEach((e) => {
      this._updateItemState(e, !1, !0);
    }), this._checkMenuPlaceholderAndButton(), this._menuButton && this._menuButton.addEventListener("click", this._toggleMenu), this._menuListElement.addEventListener("click", this._handleMenuItemClick), document.addEventListener("click", this._handleClickOutside);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._handleClickOutside), this._observer && this._observer.disconnect(), this._menuButton && this._menuButton.removeEventListener("click", this._toggleMenu);
  }
  _clearFormElements(i) {
    if (!i) return;
    i.querySelectorAll("input, textarea, select").forEach((e) => {
      switch (e.type) {
        case "button":
        case "submit":
        case "reset":
        case "image":
          break;
        case "checkbox":
        case "radio":
          e.checked = !1;
          break;
        case "file":
          e.value = null;
          break;
        default:
          e.value = "";
      }
      e.tagName === "SELECT" && (e.selectedIndex = 0);
    });
  }
  _refreshTargetOrder() {
    if (!this._targetElement) return;
    const i = [];
    this._menuItemsMap.forEach((s) => {
      s.sourceDiv.parentElement === this._targetElement && i.push(s.sourceDiv);
    }), i.forEach((s) => this._targetElement.removeChild(s));
    const t = this._targetElement.querySelector(`.${rt}`);
    t && this._targetElement.removeChild(t);
    let e = !1;
    if (this._menuItemsMap.forEach((s) => {
      s.selected && (s.sourceDiv.classList.remove(m), this._targetElement.appendChild(s.sourceDiv), e = !0);
    }), !e) {
      const s = document.createElement("p");
      s.className = rt, this._targetElement.appendChild(s);
    }
  }
  _checkMenuPlaceholderAndButton() {
    if (!this._menuPlaceholderMessageElement || !this._menuButton) return;
    let i = 0;
    this._menuItemsMap.forEach((e) => {
      e.menuListItem.style.display !== "none" && i++;
    });
    const t = i === 0;
    this._menuPlaceholderMessageElement.style.display = t ? "block" : "none", t ? this._menuButton.classList.add(M) : this._menuButton.classList.remove(M);
  }
  _handleMutations(i) {
    for (const t of i)
      if (t.type === "attributes" && t.attributeName === "class") {
        const e = t.target, s = e.dataset.value, n = this._menuItemsMap.get(s);
        if (n) {
          const a = e.classList.contains(m);
          a && n.selected ? (n.selected = !1, this._updateItemState(n, !1, !0)) : !a && !n.selected && (n.selected = !0, this._updateItemState(n, !1, !0));
        }
      }
  }
  _handleContentClose(i) {
    const t = i.currentTarget.dataset.value, e = this._menuItemsMap.get(t);
    e && e.selected && (e.selected = !1, this._updateItemState(e, !1, !0));
  }
  _toggleMenu(i) {
    if (i.preventDefault(), i.stopPropagation(), this._menuButton && this._menuButton.classList.contains(M))
      return;
    const t = this._menuPopupElement.style.display === "none" || this._menuPopupElement.style.display === "";
    t && this._checkMenuPlaceholderAndButton(), this._menuPopupElement.style.display = t ? "block" : "none";
  }
  _closeMenu() {
    this._menuPopupElement.style.display = "none";
  }
  _handleClickOutside(i) {
    if (!this.contains(i.target) && this._menuPopupElement.style.display !== "none") {
      if (this._menuButton && this._menuButton.contains(i.target))
        return;
      this._closeMenu();
    }
  }
  _handleMenuItemClick(i) {
    const t = i.target.closest(`.${x}`);
    if (t && t.dataset.value) {
      const e = t.dataset.value, s = this._menuItemsMap.get(e);
      s && (s.selected || (s.selected = !0, this._updateItemState(s, !0, !0)));
    }
  }
  _updateItemState(i, t, e) {
    if (!i || !i.sourceDiv || !i.menuItemButton || !i.menuListItem || !i.menuLabelElement) {
      console.warn("TabSelectorMenu: Incomplete itemData for update:", i);
      return;
    }
    const s = i.menuLabelElement;
    i.selected ? (e && i.sourceDiv.classList.remove(m), i.menuItemButton.classList.add(nt), i.menuListItem.style.display = "none", s.classList.add(at), s.classList.remove(lt)) : (e && i.sourceDiv.classList.add(m), this._clearFormElements(i.sourceDiv), i.menuItemButton.classList.remove(nt), i.menuListItem.style.display = "", s.classList.add(lt), s.classList.remove(at), i.sourceDiv.parentElement !== this && i.sourceDiv.parentElement !== this._targetElement ? this.appendChild(i.sourceDiv) : (i.sourceDiv.parentElement, this._targetElement)), this._refreshTargetOrder(), this._checkMenuPlaceholderAndButton(), t && this._closeMenu();
  }
}
const ie = "filter-list", se = "scroll-button", ne = "tool-tip", le = "abbrev-tooltips", ae = "int-link", re = "popup-image", oe = "tab-list", he = "filter-pill", de = "image-reel", ce = "multi-select-places", ue = "multi-select-simple", dt = "reset-button", me = "div-menu";
customElements.define(ae, Lt);
customElements.define(le, p);
customElements.define(ie, gt);
customElements.define(se, Et);
customElements.define(ne, bt);
customElements.define(re, St);
customElements.define(oe, vt);
customElements.define(he, pt);
customElements.define(de, It);
customElements.define(ce, ot);
customElements.define(ue, ht);
customElements.define(dt, Yt);
customElements.define(me, ee);
function pe() {
  const l = window.location.pathname, i = window.location.search, t = l + i;
  return encodeURIComponent(t);
}
function _e(l = 5e3, i = 100) {
  return new Promise((t, e) => {
    let s = 0;
    const n = setInterval(() => {
      typeof window.QRCode == "function" ? (clearInterval(n), t(window.QRCode)) : (s += i, s >= l && (clearInterval(n), console.error("Timed out waiting for QRCode to become available."), e(new Error("QRCode not available after " + l + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."))));
    }, i);
  });
}
async function fe(l) {
  const i = await _e(), t = document.getElementById("qr");
  t && (t.innerHTML = "", t.classList.add("hidden"), new i(t, {
    text: l,
    width: 1280,
    height: 1280,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: i.CorrectLevel.H
  }), setTimeout(() => {
    t.classList.remove("hidden");
  }, 20));
}
function ge(l) {
  l && (l.addEventListener("focus", (i) => {
    i.preventDefault(), l.select();
  }), l.addEventListener("mousedown", (i) => {
    i.preventDefault(), l.select();
  }), l.addEventListener("mouseup", (i) => {
    i.preventDefault(), l.select();
  })), l && (l.addEventListener("focus", () => {
    l.select();
  }), l.addEventListener("click", () => {
    l.select();
  }));
}
function Ee() {
  document.body.addEventListener("htmx:responseError", function(l) {
    const i = l.detail.requestConfig;
    if (i.boosted) {
      document.body.innerHTML = l.detail.xhr.responseText;
      const t = l.detail.xhr.responseURL || i.url;
      window.history.pushState(null, "", t);
    }
  });
}
function be(l, i) {
  if (!(l instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof i != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const t = l.querySelectorAll(dt);
  l.addEventListener("rbichange", (e) => {
    for (const s of t)
      if (s.isCurrentlyModified()) {
        i(e.details, !0);
        return;
      }
    i(e.details, !1);
  });
}
window.ShowBoostedErrors = Ee;
window.GenQRCode = fe;
window.SelectableInput = ge;
window.PathPlusQuery = pe;
window.HookupRBChange = be;
export {
  p as AbbreviationTooltips,
  gt as FilterList,
  pt as FilterPill,
  It as ImageReel,
  Lt as IntLink,
  ot as MultiSelectRole,
  ht as MultiSelectSimple,
  St as PopupImage,
  Et as ScrollButton,
  vt as TabList,
  bt as ToolTip
};
