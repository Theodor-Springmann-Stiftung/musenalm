var ue = Object.defineProperty;
var O = (a) => {
  throw TypeError(a);
};
var me = (a, i, e) => i in a ? ue(a, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[i] = e;
var m = (a, i, e) => me(a, typeof i != "symbol" ? i + "" : i, e), T = (a, i, e) => i.has(a) || O("Cannot " + e);
var C = (a, i, e) => (T(a, i, "read from private field"), e ? e.call(a) : i.get(a)), p = (a, i, e) => i.has(a) ? O("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(a) : i.set(a, e), g = (a, i, e, t) => (T(a, i, "write to private field"), t ? t.call(a, e) : i.set(a, e), e), b = (a, i, e) => (T(a, i, "access private method"), e);
class pe extends HTMLElement {
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
  attributeChangedCallback(i, e, t) {
    e !== t && (i === "data-text" && (this._filter = t), i === "data-queryparam" && (this._queryparam = t), i === "data-value" && (this._value = t), this.render());
  }
  getURL() {
    if (this._queryparam) {
      let i = new URL(window.location), e = new URLSearchParams(i.search);
      return e.delete(this._queryparam), e.delete("page"), i.search = e.toString(), i.toString();
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
const E = "filter-list-list", _e = "filter-list-item", fe = "filter-list-input", B = "filter-list-searchable";
var d, f, M;
class ge extends HTMLElement {
  constructor() {
    super();
    p(this, f);
    p(this, d, !1);
    this._items = [], this._url = "", this._filterstart = !1, this._placeholder = "Liste filtern...", this._queryparam = "", this._startparams = null, this.render();
  }
  static get observedAttributes() {
    return ["data-url"];
  }
  set items(e) {
    Array.isArray(e) && (this._items = e, this.render());
  }
  get items() {
    return this._items;
  }
  connectedCallback() {
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && g(this, d, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(e, t, s) {
    e === "data-url" && t !== s && (this._url = s, this.render()), e === "data-filterstart" && t !== s && (this._filterstart = s === "true", this.render()), e === "data-placeholder" && t !== s && (this._placeholder = s, this.render()), e === "data-queryparam" && t !== s && (this._queryparam = s, this.render());
  }
  onInput(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (this._filter = e.target.value, this.renderList());
  }
  onGainFocus(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (g(this, d, !1), this.renderList());
  }
  onLoseFocus(e) {
    let t = this.querySelector("input");
    if (e.target && e.target === t) {
      if (relatedElement = e.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      t.value = "", this._filter = "", this._filterstart && g(this, d, !0), this.renderList();
    }
  }
  onEnter(e) {
    if (e.target && e.target.tagName.toLowerCase() === "input" && e.key === "Enter") {
      e.preventDefault();
      const t = this.querySelector("a");
      t && t.click();
    }
  }
  mark() {
    if (typeof Mark != "function")
      return;
    let e = this.querySelector("#" + E);
    if (!e)
      return;
    let t = new Mark(e.querySelectorAll("." + B));
    this._filter && t.mark(this._filter, {
      separateWordSearch: !0
    });
  }
  // INFO: allows for setting a custom HREF of the list item
  // The function takes the item as parameter fn(item) and should return a string.
  setHREFFunc(e) {
    this.getHREF = e, this.render();
  }
  // INFO: allows for setting a custom link text of the list item
  // The function takes the item as parameter fn(item) and should return a string or
  // an HTML template literal.
  setLinkTextFunc(e) {
    this.getLinkText = e, this.render();
  }
  // INFO: allows for setting the text that will be filtered for.
  // The function takes the item as parameter fn(item) and should return a string.
  setSearchTextFunc(e) {
    this.getSearchText = e, this.render();
  }
  getHREF(e) {
    if (e) {
      if (!e.id)
        return "";
    } else return "";
    return e.id;
  }
  getHREFEncoded(e) {
    return encodeURIComponent(this.getHREF(e));
  }
  getSearchText(e) {
    if (e) {
      if (!e.name)
        return "";
    } else return "";
    return e.name;
  }
  getLinkText(e) {
    let t = this.getSearchText(e);
    return t === "" ? "" : `<span class="${B}">${t}</span>`;
  }
  getURL(e) {
    if (this._queryparam) {
      let t = new URL(window.location), s = new URLSearchParams(t.search);
      return s.set(this._queryparam, this.getHREF(e)), s.delete("page"), t.search = s.toString(), t.toString();
    }
    return this._url + this.getHREFEncoded(e);
  }
  renderList() {
    let e = this.querySelector("#" + E);
    e && (e.outerHTML = this.List()), this.mark();
  }
  render() {
    this.innerHTML = `
            <div class="font-serif text-base shadow-inner border border-stone-100">
							${this.Input()}
							${this.List()}
            </div>
        `, htmx && htmx.process(this);
  }
  ActiveDot(e) {
    return b(this, f, M).call(this, e), "";
  }
  NoItems(e) {
    return e.length === 0 ? '<div class="px-2 py-0.5 italic text-gray-500">Keine Einträge gefunden</div>' : "";
  }
  Input() {
    return `
			<div class="flex w-full py-0.5 border-b border-zinc-600 bg-stone-50">
						<i class="ri-arrow-right-s-line pl-2"></i>
						<div class="grow">
						<input
								type="text"
								placeholder="${this._placeholder}"
								class="${fe} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
  }
  List() {
    let e = this._items;
    if (this._filter)
      if (this._filterstart)
        e = this._items.filter((t) => this.getSearchText(t).toLowerCase().startsWith(this._filter.toLowerCase()));
      else {
        let t = this._filter.split(" ");
        e = this._items.filter((s) => t.every((n) => this.getSearchText(s).toLowerCase().includes(n.toLowerCase())));
      }
    return `
							<div id="${E}" class="${E} pt-1 max-h-60 overflow-auto bg-stone-50 ${C(this, d) ? "hidden" : ""}">
								${e.map(
      (t, s) => `
									<a
										href="${this.getURL(t)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${_e} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${b(this, f, M).call(this, t) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(t)}
										${this.getLinkText(t)}
									</a>
								`
    ).join("")}
								${this.NoItems(e)}
							</div>
				`;
  }
}
d = new WeakMap(), f = new WeakSet(), M = function(e) {
  if (!e)
    return !1;
  let t = this.getHREF(e);
  return t === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === t ? !0 : !!window.location.href.endsWith(t);
};
class be extends HTMLElement {
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
class Ee extends HTMLElement {
  static get observedAttributes() {
    return ["position", "timeout"];
  }
  constructor() {
    super(), this._tooltipBox = null, this._timeout = 200, this._hideTimeout = null, this._hiddenTimeout = null;
  }
  connectedCallback() {
    this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal");
    const i = this.querySelector(".data-tip"), e = i ? i.innerHTML : "Tooltip";
    i && i.classList.add("hidden"), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = e, this._tooltipBox.className = [
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
  attributeChangedCallback(i, e, t) {
    i === "position" && this._tooltipBox && this._updatePosition(), i === "timeout" && t && (this._timeout = parseInt(t) || 200);
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
class Se extends HTMLElement {
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
    const e = this.overlay.querySelector("#nextbtn");
    e && e.addEventListener("click", this.next.bind(this));
    const t = this.overlay.querySelector("#prevbtn");
    t && t.addEventListener("click", this.prev.bind(this)), this.overlay.addEventListener("click", (s) => {
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
class ve extends HTMLElement {
  static get observedAttributes() {
  }
  constructor() {
    super(), this._showall = !1, this.shown = -1, this._headings = [], this._contents = [], this._checkbox = null;
  }
  connectedCallback() {
    this._headings = Array.from(this.querySelectorAll(".tab-list-head")), this._contents = Array.from(this.querySelectorAll(".tab-list-panel")), this.hookupEvtHandlers(), this.hideDependent(), this._headings.length === 1 && this.expand(0);
  }
  expand(i) {
    i < 0 || i >= this._headings.length || (this.shown = i, this._contents.forEach((e, t) => {
      t === i ? (e.classList.remove("hidden"), this._headings[t].setAttribute("aria-pressed", "true")) : (e.classList.add("hidden"), this._headings[t].setAttribute("aria-pressed", "false"));
    }));
  }
  hookupShowAll(i) {
    i && (this._checkbox = i, i.addEventListener("change", (e) => {
      e.target.checked ? this.showAll() : this.default();
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
    this._showall = !0, this.shown = -1, this.disable(), this._contents.forEach((i, e) => {
      i.classList.remove("hidden");
      let t = this._headings[e], s = t.querySelectorAll(".show-opened");
      for (let l of s)
        l.classList.add("hidden");
      let n = t.querySelectorAll(".show-closed");
      for (let l of n)
        l.classList.add("hidden");
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
      this._headings.forEach((i, e) => {
        this._hideAllDep(i, e === this.shown);
      });
  }
  _hideAllDep(i, e) {
    const t = i.querySelectorAll(".show-closed");
    for (let n of t)
      e ? n.classList.add("hidden") : n.classList.remove("hidden");
    const s = Array.from(i.querySelectorAll(".show-opened"));
    for (let n of s)
      e ? n.classList.remove("hidden") : n.classList.add("hidden");
  }
  handleTabClick(i) {
    if (!i.target) {
      console.warn("Invalid event target");
      return;
    }
    const e = this.findParentWithClass(i.target, "tab-list-head");
    if (!e) {
      console.warn("No parent found with class 'tab-list-head'");
      return;
    }
    const t = this._headings.indexOf(e);
    t === this.shown ? (this._contents[t].classList.toggle("hidden"), this._headings[t].setAttribute("aria-pressed", "false"), this.shown = -1) : this.expand(t), this.hideDependent();
  }
  findParentWithClass(i, e) {
    for (; i; ) {
      if (i.classList && i.classList.contains(e))
        return i;
      i = i.parentElement;
    }
    return null;
  }
}
class _ extends HTMLElement {
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
    super(), this._abbrevMap = _.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(i, e, t) {
    e !== t && (i === "data-abbrevmap" && this._parseAndSetAbbrevMap(t), this.render());
  }
  _parseAndSetAbbrevMap(i) {
    if (!i) {
      this._abbrevMap = _.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(i);
    } catch {
      this._abbrevMap = _.defaultAbbrevMap;
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
  transformText(i, e) {
    let t = "", s = 0;
    for (; s < i.length; ) {
      if (s > 0 && !this.isSpaceOrPunct(i[s - 1])) {
        t += i[s], s++;
        continue;
      }
      const n = this.findLongestAbbrevAt(i, s, e);
      if (n) {
        const { match: l, meaning: r } = n;
        t += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${r}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${l}
              </span>
            </tool-tip>
          `, s += l.length;
      } else
        t += i[s], s++;
    }
    return t;
  }
  findLongestAbbrevAt(i, e, t) {
    let s = null, n = 0;
    for (const l of Object.keys(t))
      i.startsWith(l, e) && l.length > n && (s = l, n = l.length);
    return s ? { match: s, meaning: t[s] } : null;
  }
  isSpaceOrPunct(i) {
    return /\s|[.,;:!?]/.test(i);
  }
}
class Le extends HTMLElement {
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
    const e = this.getAttribute("data-jump");
    if (e) {
      const t = document.querySelector(e);
      t ? t.scrollIntoView({ behavior: "smooth" }) : console.warn(`No element found for selector: ${e}`);
    }
  }
}
var L;
class Ie extends HTMLElement {
  constructor() {
    super();
    p(this, L, 176);
    this._images = [];
  }
  connectedCallback() {
    this._images = Array.from(this.querySelectorAll(".primages")), this.calculateShownImages();
    const e = new ResizeObserver((t, s) => {
      this.calculateShownImages();
    });
    this._resizeObserver = e, e.observe(this);
  }
  disconnectedCallback() {
    this._resizeObserver.unobserve(this);
  }
  calculateShownImages() {
    const e = this.getBoundingClientRect();
    console.log(e);
    const t = Math.floor(e.width / (C(this, L) + 10));
    for (let s = 0; s < this._images.length; s++)
      s < t - 1 ? this._images[s].classList.remove("hidden") : this._images[s].classList.add("hidden");
  }
}
L = new WeakMap();
const Ae = "msr-component-wrapper", R = "msr-selected-items-container", $ = "msr-placeholder-no-selection-text", Te = "msr-selected-item-pill", Ce = "msr-selected-item-text", ye = "msr-item-name", we = "msr-item-additional-data", xe = "msr-selected-item-role", N = "msr-selected-item-delete-btn", ke = "msr-controls-area", P = "msr-pre-add-button", D = "msr-input-area-wrapper", S = "msr-input-area-default-border", y = "msr-input-area-staged", H = "msr-staging-area-container", Me = "msr-staged-item-pill", Oe = "msr-staged-item-text", w = "msr-staged-role-select", q = "msr-staged-cancel-btn", U = "msr-text-input", F = "msr-add-button", K = "msr-options-list", z = "msr-option-item", Be = "msr-option-item-name", Re = "msr-option-item-detail", V = "msr-option-item-highlighted", x = "msr-hidden-select", $e = "msr-state-no-selection", Ne = "msr-state-has-selection", Pe = "msr-state-list-open", De = "msr-state-item-staged";
class ae extends HTMLElement {
  constructor() {
    super();
    m(this, "_blurTimeout", null);
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
  set showAddButton(e) {
    const t = typeof e == "string" ? e.toLowerCase() !== "false" : !!e;
    this._showAddButton !== t && (this._showAddButton = t, this.setAttribute("show-add-button", String(t)), this.preAddButtonElement && this._updatePreAddButtonVisibility());
  }
  get placeholderNoSelection() {
    return this._placeholderNoSelection;
  }
  set placeholderNoSelection(e) {
    const t = String(e || "Keine Elemente ausgewählt");
    this._placeholderNoSelection !== t && (this._placeholderNoSelection = t, this.setAttribute("placeholder-no-selection", t), this.selectedItemsContainer && this._value.length === 0 && this._renderSelectedItems());
  }
  get placeholderSearch() {
    return this._placeholderSearch;
  }
  set placeholderSearch(e) {
    const t = String(e || "Elemente suchen...");
    this._placeholderSearch !== t && (this._placeholderSearch = t, this.setAttribute("placeholder-search", t), this.inputElement && (this.inputElement.placeholder = t));
  }
  get placeholderRoleSelect() {
    return this._placeholderRoleSelect;
  }
  set placeholderRoleSelect(e) {
    const t = String(e || "Rolle auswählen...");
    this._placeholderRoleSelect !== t && (this._placeholderRoleSelect = t, this.setAttribute("placeholder-role-select", t), this._stagedItem && this.stagedItemPillContainer && this._renderStagedPillOrInput());
  }
  attributeChangedCallback(e, t, s) {
    if (t !== s)
      switch (e) {
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
                    <li role="option" class="${z} group">
                        <span data-ref="nameEl" class="${Be}"></span>
                        <span data-ref="detailEl" class="${Re}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${Te} group">
                        <span data-ref="textEl" class="${Ce}"></span>
                        <button type="button" data-ref="deleteBtn" class="${N} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${Me} flex items-center">
                        <span data-ref="nameEl" class="${Oe}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${q} flex items-center justify-center">&times;</button>
                `, this.stagedRoleSelectTemplate = document.createElement("template"), this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${w}">
                    </select>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleInputKeyDown = this._handleInputKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleAddButtonClick = this._handleAddButtonClick.bind(this), this._handleCancelStagedItem = this._handleCancelStagedItem.bind(this), this._handleStagedRoleChange = this._handleStagedRoleChange.bind(this);
  }
  _getItemById(e) {
    return this._options.find((t) => t.id === e);
  }
  _getAvailableRolesForItem(e) {
    const t = this._value.filter((s) => s.itemId === e).map((s) => s.role);
    return this._roles.filter((s) => !t.includes(s));
  }
  setRoles(e) {
    if (Array.isArray(e) && e.every((t) => typeof t == "string")) {
      this._roles = [...e], this._stagedItem && this._stagedItem.item && (this._getAvailableRolesForItem(this._stagedItem.item.id).includes(this._stagedItem.currentRole) || (this._stagedItem.currentRole = ""), this._renderStagedPillOrInput(), this._updateAddButtonState());
      const t = this._value.filter((s) => this._roles.includes(s.role));
      t.length !== this._value.length && (this.value = t.map((s) => `${s.itemId},${s.role}`));
    } else
      console.error("setRoles expects an array of strings.");
  }
  setOptions(e) {
    if (Array.isArray(e) && e.every((t) => t && typeof t.id == "string" && typeof t.name == "string")) {
      this._options = [...e];
      const t = this._value.filter((s) => this._getItemById(s.itemId));
      t.length !== this._value.length && (this.value = t.map((s) => `${s.itemId},${s.role}`)), this._stagedItem && this._stagedItem.item && !this._getItemById(this._stagedItem.item.id) && this._handleCancelStagedItem(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else
      console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(e) {
    if (Array.isArray(e)) {
      const t = e.map((l) => {
        if (typeof l == "string") {
          const r = l.split(",");
          if (r.length === 2) {
            const o = r[0].trim(), c = r[1].trim();
            if (this._getItemById(o) && this._roles.includes(c))
              return { itemId: o, role: c, instanceId: crypto.randomUUID() };
          }
        }
        return null;
      }).filter((l) => l !== null), s = [], n = /* @__PURE__ */ new Set();
      for (const l of t) {
        const r = `${l.itemId},${l.role}`;
        n.has(r) || (s.push(l), n.add(r));
      }
      this._value = s;
    } else
      this._value = [];
    this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses();
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(e) {
    this.setAttribute("name", e), this.hiddenSelect && (this.hiddenSelect.name = e);
  }
  connectedCallback() {
    if (this.placeholderNoSelection = this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection, this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch, this.placeholderRoleSelect = this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect, this._render(), this.inputAreaWrapper = this.querySelector(`.${D}`), this.inputElement = this.querySelector(`.${U}`), this.stagedItemPillContainer = this.querySelector(`.${H}`), this.optionsListElement = this.querySelector(`.${K}`), this.selectedItemsContainer = this.querySelector(`.${R}`), this.addButtonElement = this.querySelector(`.${F}`), this.preAddButtonElement = this.querySelector(`.${P}`), this.hiddenSelect = this.querySelector(`.${x}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.hasAttribute("show-add-button") ? this.showAddButton = this.getAttribute("show-add-button") : this.setAttribute("show-add-button", String(this._showAddButton)), this.inputElement && (this.inputElement.placeholder = this.placeholderSearch), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        const t = JSON.parse(e);
        Array.isArray(t) ? this.value = t : (console.warn("Parsed value attribute is not an array:", t), this.value = []);
      } catch (t) {
        if (console.warn("Failed to parse value attribute as JSON array. Attribute was:", e, t), e.startsWith("[") && e.endsWith("]"))
          try {
            const s = e.slice(1, -1).split(",").map((n) => n.replace(/"/g, "").trim()).filter((n) => n);
            this.value = s;
          } catch (s) {
            console.error("Manual parse of value attribute also failed:", e, s), this.value = [];
          }
        else e.includes(",") ? this.value = [e] : this.value = [];
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this.hasAttribute("disabled") && this.disabledCallback(!0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleInputKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.addButtonElement && this.addButtonElement.removeEventListener("click", this._handleAddButtonClick), this.removeEventListener("keydown", this._handleKeyDown), clearTimeout(this._blurTimeout);
  }
  formAssociatedCallback(e) {
  }
  formDisabledCallback(e) {
    this.disabledCallback(e);
  }
  disabledCallback(e) {
    this.inputElement && (this.inputElement.disabled = e), this.classList.toggle("pointer-events-none", e), this.querySelectorAll(`.${N}`).forEach(
      (s) => s.disabled = e
    );
    const t = this.querySelector(`.${w}`);
    t && (t.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), this._updateAddButtonState(), this._updatePreAddButtonVisibility();
  }
  formResetCallback() {
    this.value = [], this._stagedItem = null, this._renderStagedPillOrInput(), this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this._updateRootElementStateClasses();
  }
  formStateRestoreCallback(e, t) {
    Array.isArray(e) && e.every((s) => typeof s == "string" && s.includes(",")) ? this.value = e : this.value = [], this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((e) => {
      var s;
      const t = document.createElement("option");
      t.value = `${e.itemId},${e.role}`, t.textContent = `${((s = this._getItemById(e.itemId)) == null ? void 0 : s.name) || e.itemId} (${e.role})`, t.selected = !0, this.hiddenSelect.appendChild(t);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle($e, this._value.length === 0), this.classList.toggle(Ne, this._value.length > 0), this.classList.toggle(Pe, this._isOptionsListVisible), this.classList.toggle(De, !!this._stagedItem);
  }
  _render() {
    const e = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e), this.innerHTML = `
                    <style>
                        .${x} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${Ae} relative">
                        <div class="${R} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${$}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${ke} flex items-center">
                            <div class="${D} ${S} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${H} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${U} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${P} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${F} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${e}-options-list" class="${K} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${e}" class="${x}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedItemPillElement(e) {
    const s = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return s.querySelector('[data-ref="nameEl"]').textContent = e.name, s;
  }
  _createStagedRoleSelectElement(e, t) {
    const n = this.stagedRoleSelectTemplate.content.cloneNode(!0).firstElementChild;
    let l = `<option value="" disabled ${t ? "" : "selected"}>${this.placeholderRoleSelect}</option>`;
    return e.length === 0 && !this._roles.includes(t) ? (l += "<option disabled>Keine Rollen verfügbar</option>", n.disabled = !0) : (e.forEach((r) => {
      l += `<option value="${r}" ${r === t ? "selected" : ""}>${r}</option>`;
    }), n.disabled = e.length === 0 && t === ""), n.innerHTML = l, n.addEventListener("change", this._handleStagedRoleChange), n;
  }
  _createStagedCancelButtonElement(e) {
    const s = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return s.setAttribute("aria-label", `Auswahl von ${e} abbrechen`), s.addEventListener("click", this._handleCancelStagedItem), s;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.item) {
        this.inputAreaWrapper.classList.remove(S), this.inputAreaWrapper.classList.add(y);
        const e = this._createStagedItemPillElement(this._stagedItem.item);
        this.stagedItemPillContainer.appendChild(e);
        const t = this._getAvailableRolesForItem(this._stagedItem.item.id), s = this._createStagedRoleSelectElement(
          t,
          this._stagedItem.currentRole
        );
        this.stagedItemPillContainer.appendChild(s);
        const n = this._createStagedCancelButtonElement(this._stagedItem.item.name);
        this.stagedItemPillContainer.appendChild(n), this.inputElement.classList.add("hidden"), this.inputElement.value = "", this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.setAttribute("aria-expanded", "false");
      } else
        this.inputAreaWrapper.classList.add(S), this.inputAreaWrapper.classList.remove(y), this.inputElement.classList.remove("hidden");
      this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses();
    }
  }
  _updatePreAddButtonVisibility() {
    if (!this.preAddButtonElement) return;
    const e = this.hasAttribute("disabled"), t = !this._stagedItem, s = this.showAddButton && t && !e;
    this.preAddButtonElement.classList.toggle("hidden", !s), this.preAddButtonElement.disabled = e;
  }
  _handleStagedRoleChange(e) {
    this._stagedItem && (this._stagedItem.currentRole = e.target.value, this._updateAddButtonState());
  }
  _handleCancelStagedItem(e) {
    e && e.stopPropagation(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
  }
  _createSelectedItemElement(e) {
    const t = this._getItemById(e.itemId);
    if (!t) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, l = n.querySelector('[data-ref="textEl"]');
    let r = `<span class="${ye}">${t.name}</span>`, o = t.additional_data ? ` <span class="${we}">(${t.additional_data})</span>` : "", c = ` <span class="${xe}">${e.role}</span>`;
    l.innerHTML = `${r}${o}${c}`;
    const u = n.querySelector('[data-ref="deleteBtn"]');
    return u.setAttribute("aria-label", `Entferne ${t.name} als ${e.role}`), u.dataset.instanceId = e.instanceId, u.disabled = this.hasAttribute("disabled"), u.addEventListener("click", (ce) => {
      ce.stopPropagation(), this._handleDeleteSelectedItem(e.instanceId);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${$}">${this.placeholderNoSelection}</span>` : this._value.forEach((e) => {
      const t = this._createSelectedItemElement(e);
      t && this.selectedItemsContainer.appendChild(t);
    }), this._updateRootElementStateClasses());
  }
  _updateAddButtonState() {
    if (this.addButtonElement) {
      const e = this.hasAttribute("disabled"), t = this._stagedItem && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole), s = !this._stagedItem || !t || e;
      this.addButtonElement.classList.toggle("hidden", s), this.addButtonElement.disabled = s;
    }
  }
  _createOptionElement(e, t) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild;
    return n.querySelector('[data-ref="nameEl"]').textContent = e.name, n.querySelector('[data-ref="detailEl"]').textContent = e.additional_data ? `(${e.additional_data})` : "", n.dataset.id = e.id, n.setAttribute("aria-selected", String(t === this._highlightedIndex)), n.id = `${this.id || "msr"}-option-${e.id}`, t === this._highlightedIndex && n.classList.add(V), n;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.removeAttribute("aria-controls");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this.inputElement.setAttribute("aria-controls", this.optionsListElement.id), this._filteredOptions.forEach((t, s) => {
          const n = this._createOptionElement(t, s);
          this.optionsListElement.appendChild(n);
        });
        const e = this.optionsListElement.querySelector(
          `.${V}`
        );
        e ? (e.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", e.id)) : this.inputElement.removeAttribute("aria-activedescendant");
      }
      this._updateRootElementStateClasses();
    }
  }
  _stageItem(e) {
    if (this._getAvailableRolesForItem(e.id).length === 0)
      return;
    this._stagedItem = { item: e, currentRole: "" }, this.inputElement && (this.inputElement.value = "", this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant")), this._renderStagedPillOrInput(), this._hideOptionsList();
    const s = this.stagedItemPillContainer.querySelector(
      `.${w}`
    );
    s && !s.disabled ? s.focus() : this.addButtonElement && !this.addButtonElement.disabled && this.addButtonElement.focus();
  }
  _handleAddButtonClick() {
    if (!this.hasAttribute("disabled") && this._stagedItem && this._stagedItem.item && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
      const e = {
        itemId: this._stagedItem.item.id,
        role: this._stagedItem.currentRole,
        instanceId: crypto.randomUUID()
      };
      if (this._value.find(
        (s) => s.itemId === e.itemId && s.role === e.role
      )) {
        this._handleCancelStagedItem();
        return;
      }
      this._value.push(e), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
    }
  }
  _handleInput(e) {
    if (this.hasAttribute("disabled")) return;
    this._stagedItem ? (this._stagedItem = null, this._renderStagedPillOrInput()) : this._updatePreAddButtonVisibility();
    const t = e.target.value;
    if (t.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = t.toLowerCase();
      this._filteredOptions = this._options.filter((n) => this._getAvailableRolesForItem(n.id).length === 0 || this._stagedItem && this._stagedItem.item.id === n.id ? !1 : n.name.toLowerCase().includes(s) || n.additional_data && n.additional_data.toLowerCase().includes(s)), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(e) {
    var t;
    if (!this.hasAttribute("disabled")) {
      if (e.key === "Enter" && this._stagedItem && this._stagedItem.item) {
        const s = document.activeElement, n = (t = this.stagedItemPillContainer) == null ? void 0 : t.querySelector(
          `.${q}`
        );
        if (s === n) {
          e.preventDefault(), this._handleCancelStagedItem(e);
          return;
        } else if (this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
          e.preventDefault(), this._handleAddButtonClick();
          return;
        }
      }
      e.key === "Escape" && (this._isOptionsListVisible ? (e.preventDefault(), this._hideOptionsList(), this.inputElement && this.inputElement.focus()) : this._stagedItem && (e.preventDefault(), this._handleCancelStagedItem(e)));
    }
  }
  _handleInputKeyDown(e) {
    if (!(this.hasAttribute("disabled") || this.inputElement && this.inputElement.disabled)) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        e.key === "Enter" && this.inputElement && this.inputElement.value === "" && e.preventDefault();
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
        case "Tab":
          this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] ? (e.preventDefault(), this._stageItem(this._filteredOptions[this._highlightedIndex])) : e.key === "Tab" && this._hideOptionsList();
          break;
      }
    }
  }
  _hideOptionsList() {
    this._isOptionsListVisible = !1, this._highlightedIndex = -1, this.optionsListElement && this._renderOptionsList(), this.inputElement && (this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"));
  }
  _handleFocus() {
    if (!(this.hasAttribute("disabled") || this.inputElement && this.inputElement.disabled || this._stagedItem)) {
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(S), this.inputAreaWrapper.classList.remove(y)), this.inputElement && this.inputElement.value.length > 0) {
        const e = this.inputElement.value.toLowerCase();
        this._filteredOptions = this._options.filter((t) => this._getAvailableRolesForItem(t.id).length === 0 ? !1 : t.name.toLowerCase().includes(e) || t.additional_data && t.additional_data.toLowerCase().includes(e)), this._filteredOptions.length > 0 ? (this._isOptionsListVisible = !0, this._highlightedIndex = 0, this._renderOptionsList()) : this._hideOptionsList();
      } else
        this._hideOptionsList();
      this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
    }
  }
  _handleBlur(e) {
    this._blurTimeout = setTimeout(() => {
      const t = document.activeElement;
      t !== this.addButtonElement && t !== this.preAddButtonElement && !(this.stagedItemPillContainer && this.stagedItemPillContainer.contains(t)) && !(this.optionsListElement && this.optionsListElement.contains(t)) && !this.contains(t) && this._hideOptionsList();
    }, 150);
  }
  _handleOptionMouseDown(e) {
    e.preventDefault();
  }
  _handleOptionClick(e) {
    if (this.hasAttribute("disabled")) return;
    const t = e.target.closest(`li[data-id].${z}`);
    if (t) {
      const s = t.dataset.id, n = this._filteredOptions.find((l) => l.id === s);
      n && this._stageItem(n);
    }
  }
  _handleDeleteSelectedItem(e) {
    this.hasAttribute("disabled") || (this._value = this._value.filter((t) => t.instanceId !== e), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem && this._stagedItem.item && this._renderStagedPillOrInput(), this.inputElement && this.inputElement.focus(), this._updatePreAddButtonVisibility());
  }
}
m(ae, "formAssociated", !0);
const He = "mss-component-wrapper", G = "mss-selected-items-container", qe = "mss-selected-item-pill", Ue = "mss-selected-item-text", Fe = "mss-selected-item-pill-detail", W = "mss-selected-item-delete-btn", j = "mss-input-controls-container", Q = "mss-input-wrapper", J = "mss-input-wrapper-focused", X = "mss-text-input", Y = "mss-create-new-button", Z = "mss-options-list", Ke = "mss-option-item", ze = "mss-option-item-name", Ve = "mss-option-item-detail", ee = "mss-option-item-highlighted", k = "mss-hidden-select", Ge = "mss-no-items-text", We = "mss-state-no-selection", je = "mss-state-has-selection", Qe = "mss-state-list-open";
class le extends HTMLElement {
  constructor() {
    super();
    m(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._options = [
      { id: "abk", name: "Abchasisch" },
      { id: "aar", name: "Afar" },
      { id: "afr", name: "Afrikaans" },
      { id: "aka", name: "Akan" },
      { id: "alb", name: "Albanisch" },
      { id: "amh", name: "Amharisch" },
      { id: "ara", name: "Arabisch" },
      { id: "arg", name: "Aragonesisch" },
      { id: "arm", name: "Armenisch" },
      { id: "asm", name: "Assamesisch" },
      { id: "ava", name: "Awarisch" },
      { id: "ave", name: "Avestisch" },
      { id: "aym", name: "Aymara" },
      { id: "aze", name: "Aserbaidschanisch" },
      { id: "bam", name: "Bambara" },
      { id: "bak", name: "Baschkirisch" },
      { id: "baq", name: "Baskisch" },
      { id: "bel", name: "Belarussisch" },
      { id: "ben", name: "Bengalisch" },
      { id: "bis", name: "Bislama" },
      { id: "bos", name: "Bosnisch" },
      { id: "bre", name: "Bretonisch" },
      { id: "bul", name: "Bulgarisch" },
      { id: "bur", name: "Birmanisch" },
      { id: "cat", name: "Katalanisch" },
      { id: "cha", name: "Chamorro" },
      { id: "che", name: "Tschetschenisch" },
      { id: "nya", name: "Nyanja" },
      { id: "chi", name: "Chinesisch" },
      { id: "chu", name: "Kirchenslawisch" },
      { id: "chv", name: "Tschuwaschisch" },
      { id: "cor", name: "Kornisch" },
      { id: "cos", name: "Korsisch" },
      { id: "cre", name: "Cree" },
      { id: "hrv", name: "Kroatisch" },
      { id: "cze", name: "Tschechisch" },
      { id: "dan", name: "Dänisch" },
      { id: "div", name: "Dhivehi" },
      { id: "dut", name: "Niederländisch" },
      { id: "dzo", name: "Dzongkha" },
      { id: "eng", name: "Englisch" },
      { id: "epo", name: "Esperanto" },
      { id: "est", name: "Estnisch" },
      { id: "ewe", name: "Ewe" },
      { id: "fao", name: "Färöisch" },
      { id: "fij", name: "Fidschianisch" },
      { id: "fin", name: "Finnisch" },
      { id: "fre", name: "Französisch" },
      { id: "fry", name: "Westfriesisch" },
      { id: "ful", name: "Ful" },
      { id: "gla", name: "Schottisch-Gälisch" },
      { id: "glg", name: "Galicisch" },
      { id: "lug", name: "Ganda" },
      { id: "geo", name: "Georgisch" },
      { id: "ger", name: "Deutsch" },
      { id: "gre", name: "Griechisch" },
      { id: "kal", name: "Kalaallisut" },
      { id: "grn", name: "Guaraní" },
      { id: "guj", name: "Gujarati" },
      { id: "hat", name: "Haitianisch-Kreolisch" },
      { id: "hau", name: "Hausa" },
      { id: "heb", name: "Hebräisch" },
      { id: "her", name: "Herero" },
      { id: "hin", name: "Hindi" },
      { id: "hmo", name: "Hiri Motu" },
      { id: "hun", name: "Ungarisch" },
      { id: "ice", name: "Isländisch" },
      { id: "ido", name: "Ido" },
      { id: "ibo", name: "Igbo" },
      { id: "ind", name: "Indonesisch" },
      { id: "ina", name: "Interlingua" },
      { id: "ile", name: "Interlingue" },
      { id: "iku", name: "Inuktitut" },
      { id: "ipk", name: "Inupiaq" },
      { id: "gle", name: "Irisch" },
      { id: "ita", name: "Italienisch" },
      { id: "jpn", name: "Japanisch" },
      { id: "jav", name: "Javanisch" },
      { id: "kan", name: "Kannada" },
      { id: "kau", name: "Kanuri" },
      { id: "kas", name: "Kashmiri" },
      { id: "kaz", name: "Kasachisch" },
      { id: "khm", name: "Khmer" },
      { id: "kik", name: "Kikuyu" },
      { id: "kin", name: "Kinyarwanda" },
      { id: "kir", name: "Kirgisisch" },
      { id: "kom", name: "Komi" },
      { id: "kon", name: "Kongo" },
      { id: "kor", name: "Koreanisch" },
      { id: "kua", name: "Kwanyama" },
      { id: "kur", name: "Kurdisch" },
      { id: "lao", name: "Laotisch" },
      { id: "lat", name: "Latein" },
      { id: "lav", name: "Lettisch" },
      { id: "lim", name: "Limburgisch" },
      { id: "lin", name: "Lingala" },
      { id: "lit", name: "Litauisch" },
      { id: "lub", name: "Luba-Katanga" },
      { id: "ltz", name: "Luxemburgisch" },
      { id: "mac", name: "Mazedonisch" },
      { id: "mlg", name: "Malagasy" },
      { id: "may", name: "Malaiisch" },
      { id: "mal", name: "Malayalam" },
      { id: "mlt", name: "Maltesisch" },
      { id: "glv", name: "Manx" },
      { id: "mao", name: "Maori" },
      { id: "mar", name: "Marathi" },
      { id: "mah", name: "Marshallesisch" },
      { id: "mon", name: "Mongolisch" },
      { id: "nau", name: "Nauruisch" },
      { id: "nav", name: "Navajo" },
      { id: "nde", name: "Nord-Ndebele" },
      { id: "nbl", name: "Süd-Ndebele" },
      { id: "ndo", name: "Ndonga" },
      { id: "nep", name: "Nepali" },
      { id: "nor", name: "Norwegisch" },
      { id: "nob", name: "Norwegisch Bokmål" },
      { id: "nno", name: "Norwegisch Nynorsk" },
      { id: "oci", name: "Okzitanisch" },
      { id: "oji", name: "Ojibwa" },
      { id: "ori", name: "Oriya" },
      { id: "orm", name: "Oromo" },
      { id: "oss", name: "Ossetisch" },
      { id: "pli", name: "Pali" },
      { id: "pus", name: "Paschtu" },
      { id: "per", name: "Persisch" },
      { id: "pol", name: "Polnisch" },
      { id: "por", name: "Portugiesisch" },
      { id: "pan", name: "Panjabi" },
      { id: "que", name: "Quechua" },
      { id: "rum", name: "Rumänisch" },
      { id: "roh", name: "Rätoromanisch" },
      { id: "run", name: "Rundi" },
      { id: "rus", name: "Russisch" },
      { id: "sme", name: "Nordsamisch" },
      { id: "smo", name: "Samoanisch" },
      { id: "sag", name: "Sango" },
      { id: "san", name: "Sanskrit" },
      { id: "srd", name: "Sardisch" },
      { id: "srp", name: "Serbisch" },
      { id: "sna", name: "Shona" },
      { id: "snd", name: "Sindhi" },
      { id: "sin", name: "Singhalesisch" },
      { id: "slo", name: "Slowakisch" },
      { id: "slv", name: "Slowenisch" },
      { id: "som", name: "Somali" },
      { id: "sot", name: "Süd-Sotho" },
      { id: "spa", name: "Spanisch" },
      { id: "sun", name: "Sundanesisch" },
      { id: "swa", name: "Swahili" },
      { id: "ssw", name: "Swazi" },
      { id: "swe", name: "Schwedisch" },
      { id: "tgl", name: "Tagalog" },
      { id: "tah", name: "Tahitisch" },
      { id: "tgk", name: "Tadschikisch" },
      { id: "tam", name: "Tamil" },
      { id: "tat", name: "Tatarisch" },
      { id: "tel", name: "Telugu" },
      { id: "tha", name: "Thailändisch" },
      { id: "tib", name: "Tibetisch" },
      { id: "tir", name: "Tigrinya" },
      { id: "ton", name: "Tongaisch" },
      { id: "tso", name: "Tsonga" },
      { id: "tsn", name: "Tswana" },
      { id: "tur", name: "Türkisch" },
      { id: "tuk", name: "Turkmenisch" },
      { id: "twi", name: "Twi" },
      { id: "uig", name: "Uigurisch" },
      { id: "ukr", name: "Ukrainisch" },
      { id: "urd", name: "Urdu" },
      { id: "uzb", name: "Usbekisch" },
      { id: "ven", name: "Venda" },
      { id: "vie", name: "Vietnamesisch" },
      { id: "vol", name: "Volapük" },
      { id: "wln", name: "Wallonisch" },
      { id: "wel", name: "Walisisch" },
      { id: "wol", name: "Wolof" },
      { id: "xho", name: "Xhosa" },
      { id: "iii", name: "Sichuan Yi" },
      { id: "yid", name: "Jiddisch" },
      { id: "yor", name: "Yoruba" },
      { id: "zha", name: "Zhuang" },
      { id: "zul", name: "Zulu" }
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${Ke}">
                        <span data-ref="nameEl" class="${ze}"></span>
                        <span data-ref="detailEl" class="${Ve}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${qe} flex items-center">
                        <span data-ref="textEl" class="${Ue}"></span>
                        <span data-ref="detailEl" class="${Fe} hidden"></span>
                        <button type="button" data-ref="deleteBtn" class="${W}">&times;</button>
                    </span>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this), this._handleSelectedItemsContainerClick = this._handleSelectedItemsContainerClick.bind(this);
  }
  _getItemById(e) {
    return this._options.find((t) => t.id === e);
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(e) {
    this._placeholder = e, this.inputElement && (this.inputElement.placeholder = this._placeholder), this.setAttribute("placeholder", e);
  }
  get showCreateButton() {
    return this._showCreateButton;
  }
  set showCreateButton(e) {
    const t = String(e).toLowerCase() !== "false" && e !== !1;
    this._showCreateButton !== t && (this._showCreateButton = t, this.createNewButton && this.createNewButton.classList.toggle("hidden", !this._showCreateButton), this.setAttribute("show-create-button", this._showCreateButton ? "true" : "false"));
  }
  setOptions(e) {
    if (Array.isArray(e) && e.every((t) => t && typeof t.id == "string" && typeof t.name == "string")) {
      this._options = [...e];
      const t = this._value.filter((s) => this._getItemById(s));
      t.length !== this._value.length ? this.value = t : this.selectedItemsContainer && this._renderSelectedItems(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(e) {
    const t = JSON.stringify(this._value.sort());
    if (Array.isArray(e))
      this._value = [...new Set(e.filter((n) => typeof n == "string" && this._getItemById(n)))];
    else if (typeof e == "string" && e.trim() !== "") {
      const n = e.trim();
      this._getItemById(n) && !this._value.includes(n) ? this._value = [n] : this._getItemById(n) || (this._value = this._value.filter((l) => l !== n));
    } else this._value = [];
    const s = JSON.stringify(this._value.sort());
    t !== s && (this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses(), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(e) {
    this.setAttribute("name", e), this.hiddenSelect && (this.hiddenSelect.name = e);
  }
  connectedCallback() {
    if (this._render(), this.inputControlsContainer = this.querySelector(`.${j}`), this.inputWrapper = this.querySelector(`.${Q}`), this.inputElement = this.querySelector(`.${X}`), this.createNewButton = this.querySelector(`.${Y}`), this.optionsListElement = this.querySelector(`.${Z}`), this.selectedItemsContainer = this.querySelector(`.${G}`), this.hiddenSelect = this.querySelector(`.${k}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        this.value = JSON.parse(e);
      } catch {
        this.value = e.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this.hasAttribute("disabled") && this.disabledCallback(!0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.createNewButton && this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer && this.selectedItemsContainer.removeEventListener("click", this._handleSelectedItemsContainerClick), clearTimeout(this._blurTimeout);
  }
  static get observedAttributes() {
    return ["disabled", "name", "value", "placeholder", "show-create-button"];
  }
  attributeChangedCallback(e, t, s) {
    if (t !== s)
      if (e === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (e === "name" && this.hiddenSelect) this.hiddenSelect.name = s;
      else if (e === "value" && this.inputElement)
        try {
          this.value = JSON.parse(s);
        } catch {
          this.value = s.split(",").map((l) => l.trim()).filter(Boolean);
        }
      else e === "placeholder" ? this.placeholder = s : e === "show-create-button" && (this.showCreateButton = s);
  }
  formAssociatedCallback(e) {
  }
  formDisabledCallback(e) {
    this.disabledCallback(e);
  }
  formResetCallback() {
    this.value = [], this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._updateRootElementStateClasses(), this._renderSelectedItems();
  }
  formStateRestoreCallback(e, t) {
    this.value = Array.isArray(e) ? e : [], this._updateRootElementStateClasses();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((e) => {
      const t = document.createElement("option");
      t.value = e;
      const s = this._getItemById(e);
      t.textContent = s ? s.name : e, t.selected = !0, this.hiddenSelect.appendChild(t);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  disabledCallback(e) {
    this.inputElement && (this.inputElement.disabled = e), this.createNewButton && (this.createNewButton.disabled = e), this.toggleAttribute("disabled", e), this.querySelectorAll(`.${W}`).forEach((t) => t.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), e && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(We, this._value.length === 0), this.classList.toggle(je, this._value.length > 0), this.classList.toggle(Qe, this._isOptionsListVisible);
  }
  _render() {
    const e = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e), this.innerHTML = `
                    <style>
                        .${k} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${He} relative">
                        <div class="${G} flex flex-wrap gap-1 mb-1 min-h-[38px]" aria-live="polite" tabindex="-1"></div>
                        <div class="${j} flex items-center space-x-2">
                            <div class="${Q} relative rounded-md flex items-center flex-grow">
                                <input type="text"
                                       class="${X} w-full outline-none bg-transparent text-sm"
                                       placeholder="${this.placeholder}"
                                       aria-autocomplete="list"
                                       aria-expanded="${this._isOptionsListVisible}"
                                       aria-controls="options-list-${e}"
                                       autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                            </div>
                            <button type="button" class="${Y} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                        </div>
                        <ul id="options-list-${e}" role="listbox" class="${Z} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${e}" class="${k}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(e) {
    const t = this._getItemById(e);
    if (!t) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, l = n.querySelector('[data-ref="textEl"]'), r = n.querySelector('[data-ref="detailEl"]'), o = n.querySelector('[data-ref="deleteBtn"]');
    return l.textContent = t.name, t.additional_data ? (r.textContent = `(${t.additional_data})`, r.classList.remove("hidden")) : r.classList.add("hidden"), o.setAttribute("aria-label", `Remove ${t.name}`), o.dataset.id = e, o.disabled = this.hasAttribute("disabled"), o.addEventListener("click", (c) => {
      c.stopPropagation(), this._handleDeleteSelectedItem(e);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${Ge}">Keine Sprachen ausgewählt...</span>` : this._value.forEach((e) => {
      const t = this._createSelectedItemElement(e);
      t && this.selectedItemsContainer.appendChild(t);
    }), this._updateRootElementStateClasses());
  }
  _createOptionElement(e, t) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild, l = n.querySelector('[data-ref="nameEl"]'), r = n.querySelector('[data-ref="detailEl"]');
    l.textContent = e.name, r.textContent = e.additional_data ? `(${e.additional_data})` : "", n.dataset.id = e.id, n.setAttribute("aria-selected", String(t === this._highlightedIndex));
    const o = `option-${this.id || "mss"}-${e.id}`;
    return n.id = o, t === this._highlightedIndex && (n.classList.add(ee), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", o)), n;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this._filteredOptions.forEach((t, s) => {
          const n = this._createOptionElement(t, s);
          this.optionsListElement.appendChild(n);
        });
        const e = this.optionsListElement.querySelector(`.${ee}`);
        e && (e.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", e.id));
      }
      this._updateRootElementStateClasses();
    }
  }
  _handleSelectedItemsContainerClick(e) {
    e.target === this.selectedItemsContainer && this.inputElement && !this.inputElement.disabled && this.inputElement.focus();
  }
  _handleCreateNewButtonClick() {
    if (this.hasAttribute("disabled") || !this.showCreateButton) return;
    const e = this.inputElement ? this.inputElement.value.trim() : "";
    this.dispatchEvent(
      new CustomEvent("createnew", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _handleInput(e) {
    const t = e.target.value;
    if (t.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = t.toLowerCase();
      this._filteredOptions = this._options.filter((n) => {
        if (this._value.includes(n.id)) return !1;
        const l = n.name.toLowerCase().includes(s), r = n.additional_data && n.additional_data.toLowerCase().includes(s);
        return l || r;
      }), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(e) {
    if (!this.inputElement.disabled) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        e.key === "Enter" && this.inputElement.value.length > 0 && e.preventDefault(), e.key === "Escape" && this._hideOptionsList(), (e.key === "ArrowDown" || e.key === "ArrowUp") && this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement });
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
          e.stopPropagation(), e.preventDefault(), this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] && this._selectItem(this._filteredOptions[this._highlightedIndex].id);
          break;
        case "Escape":
          e.preventDefault(), this._hideOptionsList();
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
  _handleOptionMouseDown(e) {
    e.preventDefault();
  }
  _handleOptionClick(e) {
    const t = e.target.closest("li[data-id]");
    t && t.dataset.id && this._selectItem(t.dataset.id);
  }
  _selectItem(e) {
    e && !this._value.includes(e) && (this.value = [...this._value, e]), this.inputElement && (this.inputElement.value = ""), this._filteredOptions = [], this._hideOptionsList(), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleDeleteSelectedItem(e) {
    this.value = this._value.filter((t) => t !== e), this.inputElement && this.inputElement.value && this._handleInput({ target: this.inputElement }), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
}
m(le, "formAssociated", !0);
const Je = "rbi-button", Xe = "rbi-icon";
class Ye extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const i = `
              <button type="button" class="${Je} cursor-pointer disabled:cursor-default" aria-label="Reset field">
								<tool-tip position="right">
									<div class="data-tip">Feld zurücksetzen</div>
									<span class="${Xe} ri-arrow-go-back-fill"></span>
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
  attributeChangedCallback(i, e, t) {
    e !== t && (i === "controls" && this.updateControlledElements(), (i === "controls" || i === "button-aria-label") && this.updateButtonAriaLabel());
  }
  updateControlledElements() {
    this._controlledElements.forEach((t) => {
      t.removeEventListener("input", this.handleInputChange), t.removeEventListener("change", this.handleInputChange);
    }), this._controlledElements = [], this.lastOverallModifiedState = null;
    const i = (this.getAttribute("controls") || "").split(",").map((t) => t.trim()).filter((t) => t);
    if (!i.length && this.button) {
      this.button.disabled = !0, this.button.setAttribute("aria-disabled", "true"), this.checkIfModified();
      return;
    }
    const e = [];
    i.forEach((t) => {
      const s = document.getElementById(t);
      s ? (e.push(s), this.storeInitialState(s), s.addEventListener("input", this.handleInputChange), s.addEventListener("change", this.handleInputChange)) : console.warn(`ResetButtonIndividual: Element with ID "${t}" not found.`);
    }), this._controlledElements = e, this.button && (this.button.disabled = this._controlledElements.length === 0, this.button.setAttribute("aria-controls", this._controlledElements.map((t) => t.id).join(" ")), this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.checkIfModified();
  }
  storeInitialState(i) {
    if (this.initialStates.has(i.id))
      return;
    let e;
    switch (i.type) {
      case "checkbox":
      case "radio":
        e = { checked: i.checked };
        break;
      case "select-multiple":
        e = {
          selectedOptions: Array.from(i.options).filter((t) => t.selected).map((t) => t.value)
        };
        break;
      case "select-one":
      default:
        e = { value: i.value };
        break;
    }
    this.initialStates.set(i.id, e);
  }
  resetElement(i) {
    const e = this.initialStates.get(i.id);
    if (e) {
      switch (i.type) {
        case "checkbox":
        case "radio":
          i.checked = e.checked;
          break;
        case "select-multiple":
          Array.from(i.options).forEach((t) => {
            t.selected = e.selectedOptions.includes(t.value);
          });
          break;
        case "select-one":
        default:
          i.value = e.value;
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
    const e = this.initialStates.get(i.id);
    if (!e) return !1;
    switch (i.type) {
      case "checkbox":
      case "radio":
        return i.checked !== e.checked;
      case "select-multiple":
        const t = Array.from(i.options).filter((n) => n.selected).map((n) => n.value), s = e.selectedOptions;
        return t.length !== s.length || t.some((n) => !s.includes(n)) || s.some((n) => !t.includes(n));
      case "select-one":
      default:
        return i.value !== e.value;
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
    this._controlledElements.forEach((t) => {
      this.isElementModified(t) ? t.classList.add("modified-element") : t.classList.remove("modified-element");
    });
    const e = this.getAttribute("wrapper-class");
    if (e) {
      const t = this.closest(`.${e}`);
      if (t) {
        const s = this.getAttribute("modified-class-suffix") || "modified", n = `${e}-${s}`;
        i ? t.classList.add(n) : t.classList.remove(n);
      }
    }
    if (this.button && (this.button.disabled = !i || this._controlledElements.length === 0, this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.lastOverallModifiedState !== i) {
      const t = new CustomEvent("rbichange", {
        bubbles: !0,
        composed: !0,
        detail: {
          modified: i,
          controlledElementIds: this._controlledElements.map((s) => s.id),
          instance: this
        }
      });
      this.dispatchEvent(t), this.lastOverallModifiedState = i;
    }
  }
  updateButtonAriaLabel() {
    if (!this.button) return;
    let i = this.getAttribute("button-aria-label");
    if (!i) {
      const e = this._controlledElements.map((t) => t.id);
      if (e.length === 1 && this._controlledElements[0]) {
        const t = this._controlledElements[0], s = document.querySelector(`label[for="${t.id}"]`);
        let n = t.name || t.id;
        s && s.textContent ? n = s.textContent.trim().replace(/[:*]$/, "").trim() : t.getAttribute("aria-label") && (n = t.getAttribute("aria-label")), i = `Reset ${n}`;
      } else e.length > 1 ? i = "Reset selected fields" : i = "Reset field";
    }
    this.button.setAttribute("aria-label", i);
  }
}
const h = "hidden", te = "dm-stay", ie = "dm-title", se = "dm-menu-button", Ze = "dm-target", v = "dm-menu", ne = "dm-menu-item", et = "dm-close-button";
var I, re;
class tt extends HTMLElement {
  constructor() {
    super();
    p(this, I);
    b(this, I, re).call(this), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  connectedCallback() {
    if (this._cildren = Array.from(this.children).filter((e) => e.nodeType === Node.ELEMENT_NODE && !e.classList.contains(se)).map((e) => ({
      node: e,
      stay: () => e.hasAttribute(te) && e.getAttribute(te) == "true",
      hidden: () => e.classList.contains(h),
      name: () => {
        const t = e.querySelector("label");
        return t ? t.innerHTML : e.hasAttribute(ie) ? e.getAttribute(ie) : "";
      }
    })), this._target = document.getElementById(this.getAttribute(Ze)), this._target || (this._target = this), this._button = this.querySelector(`.${se}`), !this._button) {
      console.error("DivManagerMenu needs a button element.");
      return;
    }
    for (const e of this._cildren)
      this.removeChild(e.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const e of this._cildren)
      e.node.querySelectorAll(`.${et}`).forEach((s) => {
        s.addEventListener("click", (n) => {
          this.hideDiv(n, e.node);
        });
      });
    this.renderMenu(), this.renderIntoTarget();
  }
  _toggleMenu(e) {
    if (e.preventDefault(), e.stopPropagation(), this._menu || (this._menu = this.querySelector(`.${v}`)), !this._menu) {
      console.error("DivManagerMenu: Menu not found.");
      return;
    }
    this._menu.classList.contains(h) ? (this._menu.classList.remove(h), document.addEventListener("click", this.handleClickOutside)) : (this._menu.classList.add(h), document.removeEventListener("click", this.handleClickOutside));
  }
  handleClickOutside(e) {
    this._menu && !this._menu.contains(e.target) && !this._button.contains(e.target) && this._menu.classList.add(h);
  }
  renderButton() {
    if (this._button) {
      for (const e of this._cildren)
        if (e.hidden()) {
          this._button.parentElement !== this && (this._button.classList.remove(h), this.appendChild(this._button));
          return;
        }
      this._button.classList.add(h), this.removeChild(this._button);
    }
  }
  hideDiv(e, t) {
    if (e && (e.preventDefault(), e.stopPropagation()), !t || !(t instanceof HTMLElement)) {
      console.error("DivManagerMenu: Invalid node provided.");
      return;
    }
    const s = this._cildren.find((n) => n.node === t);
    if (!s) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    s.hidden() || s.node.classList.add(h), this._target.removeChild(s.node), this.renderButton(), this.renderMenu();
  }
  showDiv(e, t) {
    if (e && (e.preventDefault(), e.stopPropagation()), t < 0 || t >= this._cildren.length) {
      console.error("DivManagerMenu: Invalid index.");
      return;
    }
    const s = this._cildren[t];
    s.hidden() && s.node.classList.remove(h), this._target.appendChild(s.node), this.renderMenu(), this.renderButton();
  }
  renderMenu() {
    this._menu || (this._button.innerHTML += `<div class="${v} absolute hidden"></div>`, this._menu = this._button.querySelector(`.${v}`)), this._menu.innerHTML = `${this._cildren.map((t, s) => t.hidden() ? `
				<button type="button" class="${ne}" dm-itemno="${s}">
					${t.name()}
				</button>` : "").join("")}`, this._menu = this.querySelector(`.${v}`), this._menu.querySelectorAll(`.${ne}`).forEach((t) => {
      t.addEventListener("click", (s) => {
        this.showDiv(s, parseInt(t.getAttribute("dm-itemno"))), this._toggleMenu(s);
      });
    });
  }
  renderIntoTarget() {
    this._cildren.forEach((e) => {
      e.hidden() || this._target.appendChild(e.node);
    });
  }
}
I = new WeakSet(), re = function() {
  this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null;
};
const it = "filter-list", st = "scroll-button", nt = "tool-tip", at = "abbrev-tooltips", lt = "int-link", rt = "popup-image", ot = "tab-list", ht = "filter-pill", dt = "image-reel", ct = "multi-select-places", ut = "multi-select-simple", oe = "reset-button", mt = "div-manager";
customElements.define(lt, Le);
customElements.define(at, _);
customElements.define(it, ge);
customElements.define(st, be);
customElements.define(nt, Ee);
customElements.define(rt, Se);
customElements.define(ot, ve);
customElements.define(ht, pe);
customElements.define(dt, Ie);
customElements.define(ct, ae);
customElements.define(ut, le);
customElements.define(oe, Ye);
customElements.define(mt, tt);
function pt() {
  const a = window.location.pathname, i = window.location.search, e = a + i;
  return encodeURIComponent(e);
}
function _t(a = 5e3, i = 100) {
  return new Promise((e, t) => {
    let s = 0;
    const n = setInterval(() => {
      typeof window.QRCode == "function" ? (clearInterval(n), e(window.QRCode)) : (s += i, s >= a && (clearInterval(n), console.error("Timed out waiting for QRCode to become available."), t(new Error("QRCode not available after " + a + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."))));
    }, i);
  });
}
async function ft(a) {
  const i = await _t(), e = document.getElementById("qr");
  e && (e.innerHTML = "", e.classList.add("hidden"), new i(e, {
    text: a,
    width: 1280,
    height: 1280,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: i.CorrectLevel.H
  }), setTimeout(() => {
    e.classList.remove("hidden");
  }, 20));
}
function gt(a) {
  a && (a.addEventListener("focus", (i) => {
    i.preventDefault(), a.select();
  }), a.addEventListener("mousedown", (i) => {
    i.preventDefault(), a.select();
  }), a.addEventListener("mouseup", (i) => {
    i.preventDefault(), a.select();
  })), a && (a.addEventListener("focus", () => {
    a.select();
  }), a.addEventListener("click", () => {
    a.select();
  }));
}
function bt() {
  document.body.addEventListener("htmx:responseError", function(a) {
    const i = a.detail.requestConfig;
    if (i.boosted) {
      document.body.innerHTML = a.detail.xhr.responseText;
      const e = a.detail.xhr.responseURL || i.url;
      window.history.pushState(null, "", e);
    }
  });
}
function Et(a, i) {
  if (!(a instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof i != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const e = a.querySelectorAll(oe);
  a.addEventListener("rbichange", (t) => {
    for (const s of e)
      if (s.isCurrentlyModified()) {
        i(t.details, !0);
        return;
      }
    i(t.details, !1);
  });
}
function A(a) {
  if (!(a instanceof HTMLTextAreaElement)) {
    console.warn("TextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  a.style.height = "auto", a.style.height = `${a.scrollHeight}px`;
}
function he(a) {
  a.key === "Enter" && a.preventDefault();
}
function de(a) {
  if (!(a instanceof HTMLTextAreaElement)) {
    console.warn("HookupTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  a.addEventListener("input", () => {
    A(a);
  });
}
function St(a) {
  if (!(a instanceof HTMLTextAreaElement)) {
    console.warn("DisconnectTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  a.removeEventListener("input", () => {
    A(a);
  });
}
function vt(a) {
  !(a instanceof HTMLTextAreaElement) && a.classList.contains("no-enter") || a.addEventListener("keydown", he);
}
function Lt(a) {
  !(a instanceof HTMLTextAreaElement) && a.classList.contains("no-enter") || a.removeEventListener("keydown", he);
}
function It(a, i) {
  for (const e of a)
    if (e.type === "childList") {
      for (const t of e.addedNodes)
        t.nodeType === Node.ELEMENT_NODE && t.matches("textarea") && (de(t), A(t));
      for (const t of e.removedNodes)
        t.nodeType === Node.ELEMENT_NODE && t.matches("textarea") && (Lt(t), St(t));
    }
}
function At(a) {
  if (!(a instanceof HTMLFormElement)) {
    console.warn("FormLoad: Provided element is not a form.");
    return;
  }
  const i = document.querySelectorAll("textarea");
  for (const s of i)
    de(s), A(s);
  const e = document.querySelectorAll("textarea.no-enter");
  for (const s of e)
    vt(s);
  new MutationObserver(It).observe(a, {
    childList: !0,
    subtree: !0
  });
}
window.ShowBoostedErrors = bt;
window.GenQRCode = ft;
window.SelectableInput = gt;
window.PathPlusQuery = pt;
window.HookupRBChange = Et;
window.FormLoad = At;
export {
  _ as AbbreviationTooltips,
  ge as FilterList,
  pe as FilterPill,
  Ie as ImageReel,
  Le as IntLink,
  ae as MultiSelectRole,
  le as MultiSelectSimple,
  Se as PopupImage,
  be as ScrollButton,
  ve as TabList,
  Ee as ToolTip
};
