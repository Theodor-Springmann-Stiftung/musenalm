var gt = Object.defineProperty;
var $ = (a) => {
  throw TypeError(a);
};
var bt = (a, i, t) => i in a ? gt(a, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[i] = t;
var p = (a, i, t) => bt(a, typeof i != "symbol" ? i + "" : i, t), y = (a, i, t) => i.has(a) || $("Cannot " + t);
var C = (a, i, t) => (y(a, i, "read from private field"), t ? t.call(a) : i.get(a)), _ = (a, i, t) => i.has(a) ? $("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(a) : i.set(a, t), b = (a, i, t, e) => (y(a, i, "write to private field"), e ? e.call(a, t) : i.set(a, t), t), E = (a, i, t) => (y(a, i, "access private method"), t);
class Et extends HTMLElement {
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
const S = "filter-list-list", St = "filter-list-item", Lt = "filter-list-input", N = "filter-list-searchable";
var m, g, B;
class vt extends HTMLElement {
  constructor() {
    super();
    _(this, g);
    _(this, m, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && b(this, m, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, s) {
    t === "data-url" && e !== s && (this._url = s, this.render()), t === "data-filterstart" && e !== s && (this._filterstart = s === "true", this.render()), t === "data-placeholder" && e !== s && (this._placeholder = s, this.render()), t === "data-queryparam" && e !== s && (this._queryparam = s, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (b(this, m, !1), this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && b(this, m, !0), this.renderList();
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
    let t = this.querySelector("#" + S);
    if (!t)
      return;
    let e = new Mark(t.querySelectorAll("." + N));
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
    return e === "" ? "" : `<span class="${N}">${e}</span>`;
  }
  getURL(t) {
    if (this._queryparam) {
      let e = new URL(window.location), s = new URLSearchParams(e.search);
      return s.set(this._queryparam, this.getHREF(t)), s.delete("page"), e.search = s.toString(), e.toString();
    }
    return this._url + this.getHREFEncoded(t);
  }
  renderList() {
    let t = this.querySelector("#" + S);
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
    return E(this, g, B).call(this, t), "";
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
								class="${Lt} w-full placeholder:italic px-2 py-0.5" />
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
							<div id="${S}" class="${S} pt-1 max-h-60 overflow-auto bg-stone-50 ${C(this, m) ? "hidden" : ""}">
								${t.map(
      (e, s) => `
									<a
										href="${this.getURL(e)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${St} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${E(this, g, B).call(this, e) ? 'aria-current="page"' : ""}>
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
m = new WeakMap(), g = new WeakSet(), B = function(t) {
  if (!t)
    return !1;
  let e = this.getHREF(t);
  return e === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === e ? !0 : !!window.location.href.endsWith(e);
};
class At extends HTMLElement {
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
class Tt extends HTMLElement {
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
class It extends HTMLElement {
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
class yt extends HTMLElement {
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
      for (let r of s)
        r.classList.add("hidden");
      let n = e.querySelectorAll(".show-closed");
      for (let r of n)
        r.classList.add("hidden");
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
class f extends HTMLElement {
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
    super(), this._abbrevMap = f.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(i, t, e) {
    t !== e && (i === "data-abbrevmap" && this._parseAndSetAbbrevMap(e), this.render());
  }
  _parseAndSetAbbrevMap(i) {
    if (!i) {
      this._abbrevMap = f.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(i);
    } catch {
      this._abbrevMap = f.defaultAbbrevMap;
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
        const { match: r, meaning: l } = n;
        e += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${l}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${r}
              </span>
            </tool-tip>
          `, s += r.length;
      } else
        e += i[s], s++;
    }
    return e;
  }
  findLongestAbbrevAt(i, t, e) {
    let s = null, n = 0;
    for (const r of Object.keys(e))
      i.startsWith(r, t) && r.length > n && (s = r, n = r.length);
    return s ? { match: s, meaning: e[s] } : null;
  }
  isSpaceOrPunct(i) {
    return /\s|[.,;:!?]/.test(i);
  }
}
class Ct extends HTMLElement {
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
var A;
class wt extends HTMLElement {
  constructor() {
    super();
    _(this, A, 176);
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
    const e = Math.floor(t.width / (C(this, A) + 10));
    for (let s = 0; s < this._images.length; s++)
      s < e - 1 ? this._images[s].classList.remove("hidden") : this._images[s].classList.add("hidden");
  }
}
A = new WeakMap();
const xt = "msr-component-wrapper", D = "msr-selected-items-container", P = "msr-placeholder-no-selection-text", Mt = "msr-selected-item-pill", kt = "msr-selected-item-text", Ot = "msr-item-name", Rt = "msr-item-additional-data", Bt = "msr-selected-item-role", H = "msr-selected-item-delete-btn", $t = "msr-controls-area", q = "msr-pre-add-button", U = "msr-input-area-wrapper", L = "msr-input-area-default-border", w = "msr-input-area-staged", F = "msr-staging-area-container", Nt = "msr-staged-item-pill", Dt = "msr-staged-item-text", x = "msr-staged-role-select", z = "msr-staged-cancel-btn", K = "msr-text-input", V = "msr-add-button", G = "msr-options-list", W = "msr-option-item", Pt = "msr-option-item-name", Ht = "msr-option-item-detail", j = "msr-option-item-highlighted", M = "msr-hidden-select", qt = "msr-state-no-selection", Ut = "msr-state-has-selection", Ft = "msr-state-list-open", zt = "msr-state-item-staged";
class dt extends HTMLElement {
  constructor() {
    super();
    p(this, "_blurTimeout", null);
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
                        <span data-ref="nameEl" class="${Pt}"></span>
                        <span data-ref="detailEl" class="${Ht}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${Mt} group">
                        <span data-ref="textEl" class="${kt}"></span>
                        <button type="button" data-ref="deleteBtn" class="${H} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${Nt} flex items-center">
                        <span data-ref="nameEl" class="${Dt}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${z} flex items-center justify-center">&times;</button>
                `, this.stagedRoleSelectTemplate = document.createElement("template"), this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${x}">
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
      const e = t.map((r) => {
        if (typeof r == "string") {
          const l = r.split(",");
          if (l.length === 2) {
            const o = l[0].trim(), h = l[1].trim();
            if (this._getItemById(o) && this._roles.includes(h))
              return { itemId: o, role: h, instanceId: crypto.randomUUID() };
          }
        }
        return null;
      }).filter((r) => r !== null), s = [], n = /* @__PURE__ */ new Set();
      for (const r of e) {
        const l = `${r.itemId},${r.role}`;
        n.has(l) || (s.push(r), n.add(l));
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
    if (this.placeholderNoSelection = this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection, this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch, this.placeholderRoleSelect = this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect, this._render(), this.inputAreaWrapper = this.querySelector(`.${U}`), this.inputElement = this.querySelector(`.${K}`), this.stagedItemPillContainer = this.querySelector(`.${F}`), this.optionsListElement = this.querySelector(`.${G}`), this.selectedItemsContainer = this.querySelector(`.${D}`), this.addButtonElement = this.querySelector(`.${V}`), this.preAddButtonElement = this.querySelector(`.${q}`), this.hiddenSelect = this.querySelector(`.${M}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.hasAttribute("show-add-button") ? this.showAddButton = this.getAttribute("show-add-button") : this.setAttribute("show-add-button", String(this._showAddButton)), this.inputElement && (this.inputElement.placeholder = this.placeholderSearch), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
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
    this.inputElement && (this.inputElement.disabled = t), this.classList.toggle("pointer-events-none", t), this.querySelectorAll(`.${H}`).forEach(
      (s) => s.disabled = t
    );
    const e = this.querySelector(`.${x}`);
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
    this.classList.toggle(qt, this._value.length === 0), this.classList.toggle(Ut, this._value.length > 0), this.classList.toggle(Ft, this._isOptionsListVisible), this.classList.toggle(zt, !!this._stagedItem);
  }
  _render() {
    const t = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t), this.innerHTML = `
                    <style>
                        .${M} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${xt} relative">
                        <div class="${D} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${P}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${$t} flex items-center">
                            <div class="${U} ${L} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${F} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${K} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${q} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${V} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${t}-options-list" class="${G} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${t}" class="${M}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedItemPillElement(t) {
    const s = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return s.querySelector('[data-ref="nameEl"]').textContent = t.name, s;
  }
  _createStagedRoleSelectElement(t, e) {
    const n = this.stagedRoleSelectTemplate.content.cloneNode(!0).firstElementChild;
    let r = `<option value="" disabled ${e ? "" : "selected"}>${this.placeholderRoleSelect}</option>`;
    return t.length === 0 && !this._roles.includes(e) ? (r += "<option disabled>Keine Rollen verfügbar</option>", n.disabled = !0) : (t.forEach((l) => {
      r += `<option value="${l}" ${l === e ? "selected" : ""}>${l}</option>`;
    }), n.disabled = t.length === 0 && e === ""), n.innerHTML = r, n.addEventListener("change", this._handleStagedRoleChange), n;
  }
  _createStagedCancelButtonElement(t) {
    const s = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return s.setAttribute("aria-label", `Auswahl von ${t} abbrechen`), s.addEventListener("click", this._handleCancelStagedItem), s;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.item) {
        this.inputAreaWrapper.classList.remove(L), this.inputAreaWrapper.classList.add(w);
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
        this.inputAreaWrapper.classList.add(L), this.inputAreaWrapper.classList.remove(w), this.inputElement.classList.remove("hidden");
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
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, r = n.querySelector('[data-ref="textEl"]');
    let l = `<span class="${Ot}">${e.name}</span>`, o = e.additional_data ? ` <span class="${Rt}">(${e.additional_data})</span>` : "", h = ` <span class="${Bt}">${t.role}</span>`;
    r.innerHTML = `${l}${o}${h}`;
    const c = n.querySelector('[data-ref="deleteBtn"]');
    return c.setAttribute("aria-label", `Entferne ${e.name} als ${t.role}`), c.dataset.instanceId = t.instanceId, c.disabled = this.hasAttribute("disabled"), c.addEventListener("click", (ft) => {
      ft.stopPropagation(), this._handleDeleteSelectedItem(t.instanceId);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${P}">${this.placeholderNoSelection}</span>` : this._value.forEach((t) => {
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
    return n.querySelector('[data-ref="nameEl"]').textContent = t.name, n.querySelector('[data-ref="detailEl"]').textContent = t.additional_data ? `(${t.additional_data})` : "", n.dataset.id = t.id, n.setAttribute("aria-selected", String(e === this._highlightedIndex)), n.id = `${this.id || "msr"}-option-${t.id}`, e === this._highlightedIndex && n.classList.add(j), n;
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
          `.${j}`
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
      `.${x}`
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
          `.${z}`
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
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(L), this.inputAreaWrapper.classList.remove(w)), this.inputElement && this.inputElement.value.length > 0) {
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
      const s = e.dataset.id, n = this._filteredOptions.find((r) => r.id === s);
      n && this._stageItem(n);
    }
  }
  _handleDeleteSelectedItem(t) {
    this.hasAttribute("disabled") || (this._value = this._value.filter((e) => e.instanceId !== t), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem && this._stagedItem.item && this._renderStagedPillOrInput(), this.inputElement && this.inputElement.focus(), this._updatePreAddButtonVisibility());
  }
}
p(dt, "formAssociated", !0);
const Kt = "mss-component-wrapper", Q = "mss-selected-items-container", Vt = "mss-selected-item-pill", Gt = "mss-selected-item-text", Wt = "mss-selected-item-pill-detail", J = "mss-selected-item-delete-btn", X = "mss-input-controls-container", Y = "mss-input-wrapper", Z = "mss-input-wrapper-focused", tt = "mss-text-input", et = "mss-create-new-button", it = "mss-options-list", jt = "mss-option-item", Qt = "mss-option-item-name", Jt = "mss-option-item-detail", st = "mss-option-item-highlighted", k = "mss-hidden-select", Xt = "mss-no-items-text", nt = "mss-loading", O = 1, R = 10, Yt = 250, Zt = "mss-state-no-selection", te = "mss-state-has-selection", ee = "mss-state-list-open";
class ct extends HTMLElement {
  constructor() {
    super();
    p(this, "_blurTimeout", null);
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
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._remoteEndpoint = null, this._remoteResultKey = "items", this._remoteMinChars = O, this._remoteLimit = R, this._remoteFetchController = null, this._remoteFetchTimeout = null, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${jt}">
                        <span data-ref="nameEl" class="${Qt}"></span>
                        <span data-ref="detailEl" class="${Jt}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${Vt} flex items-center">
                        <span data-ref="textEl" class="${Gt}"></span>
                        <span data-ref="detailEl" class="${Wt} hidden"></span>
                        <button type="button" data-ref="deleteBtn" class="${J}">&times;</button>
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
      this._options = t.map((s) => {
        const n = { ...s };
        return n.name = this._normalizeText(n.name), n.additional_data = this._normalizeText(n.additional_data), n;
      });
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
      this._value = [...new Set(t.filter((n) => typeof n == "string" && this._getItemById(n)))];
    else if (typeof t == "string" && t.trim() !== "") {
      const n = t.trim();
      this._getItemById(n) && !this._value.includes(n) ? this._value = [n] : this._getItemById(n) || (this._value = this._value.filter((r) => r !== n));
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
    if (this._render(), this.inputControlsContainer = this.querySelector(`.${X}`), this.inputWrapper = this.querySelector(`.${Y}`), this.inputElement = this.querySelector(`.${tt}`), this.createNewButton = this.querySelector(`.${et}`), this.optionsListElement = this.querySelector(`.${it}`), this.selectedItemsContainer = this.querySelector(`.${Q}`), this.hiddenSelect = this.querySelector(`.${k}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._remoteEndpoint = this.getAttribute("data-endpoint") || null, this._remoteResultKey = this.getAttribute("data-result-key") || "items", this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), O), this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), R), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
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
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.createNewButton && this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer && this.selectedItemsContainer.removeEventListener("click", this._handleSelectedItemsContainerClick), clearTimeout(this._blurTimeout), this._remoteFetchTimeout && (clearTimeout(this._remoteFetchTimeout), this._remoteFetchTimeout = null), this._cancelRemoteFetch();
  }
  static get observedAttributes() {
    return ["disabled", "name", "value", "placeholder", "show-create-button", "data-endpoint", "data-result-key", "data-minchars", "data-limit"];
  }
  attributeChangedCallback(t, e, s) {
    if (e !== s)
      if (t === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (t === "name" && this.hiddenSelect) this.hiddenSelect.name = s;
      else if (t === "value" && this.inputElement)
        try {
          this.value = JSON.parse(s);
        } catch {
          this.value = s.split(",").map((r) => r.trim()).filter(Boolean);
        }
      else t === "placeholder" ? this.placeholder = s : t === "show-create-button" ? this.showCreateButton = s : t === "data-endpoint" ? this._remoteEndpoint = s || null : t === "data-result-key" ? this._remoteResultKey = s || "items" : t === "data-minchars" ? this._remoteMinChars = this._parsePositiveInt(s, O) : t === "data-limit" && (this._remoteLimit = this._parsePositiveInt(s, R));
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
    this.inputElement && (this.inputElement.disabled = t), this.createNewButton && (this.createNewButton.disabled = t), this.toggleAttribute("disabled", t), this.querySelectorAll(`.${J}`).forEach((e) => e.disabled = t), this.hiddenSelect && (this.hiddenSelect.disabled = t), t && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Zt, this._value.length === 0), this.classList.toggle(te, this._value.length > 0), this.classList.toggle(ee, this._isOptionsListVisible);
  }
  _render() {
    const t = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t), this.innerHTML = `
                    <style>
                        .${k} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${Kt} relative">
                        <div class="${Q} flex flex-wrap gap-1 mb-1 min-h-[38px]" aria-live="polite" tabindex="-1"></div>
                        <div class="${X} flex items-center space-x-4">
                            <div class="${Y} relative rounded-md flex items-center flex-grow">
                                <input type="text"
                                       class="${tt} w-full outline-none bg-transparent"
                                       placeholder="${this.placeholder}"
                                       aria-autocomplete="list"
                                       aria-expanded="${this._isOptionsListVisible}"
                                       aria-controls="options-list-${t}"
                                       autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                            </div>
                            <button type="button" class="${et} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                        </div>
                        <ul id="options-list-${t}" role="listbox" class="${it} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${t}" class="${k}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(t) {
    const e = this._getItemById(t);
    if (!e) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, r = n.querySelector('[data-ref="textEl"]'), l = n.querySelector('[data-ref="detailEl"]'), o = n.querySelector('[data-ref="deleteBtn"]');
    r.textContent = this._normalizeText(e.name);
    const h = this._normalizeText(e.additional_data);
    return h ? (l.textContent = `(${h})`, l.classList.remove("hidden")) : (l.textContent = "", l.classList.add("hidden")), o.setAttribute("aria-label", `Remove ${e.name}`), o.dataset.id = t, o.disabled = this.hasAttribute("disabled"), o.addEventListener("click", (c) => {
      c.stopPropagation(), this._handleDeleteSelectedItem(t);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${Xt}">Keine Sprachen ausgewählt...</span>` : this._value.forEach((t) => {
      const e = this._createSelectedItemElement(t);
      e && this.selectedItemsContainer.appendChild(e);
    }), this._updateRootElementStateClasses());
  }
  _createOptionElement(t, e) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild, r = n.querySelector('[data-ref="nameEl"]'), l = n.querySelector('[data-ref="detailEl"]');
    r.textContent = this._normalizeText(t.name);
    const o = this._normalizeText(t.additional_data);
    l.textContent = o ? `(${o})` : "", n.dataset.id = t.id, n.setAttribute("aria-selected", String(e === this._highlightedIndex));
    const h = `option-${this.id || "mss"}-${t.id}`;
    return n.id = h, e === this._highlightedIndex && (n.classList.add(st), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", h)), n;
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
        const t = this.optionsListElement.querySelector(`.${st}`);
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
    if (this._remoteEndpoint) {
      this._handleRemoteInput(e);
      return;
    }
    if (e.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = e.toLowerCase();
      this._filteredOptions = this._options.filter((n) => {
        if (this._value.includes(n.id)) return !1;
        const l = this._normalizeText(n.name).toLowerCase().includes(s), o = this._normalizeText(n.additional_data), h = o && o.toLowerCase().includes(s);
        return l || h;
      }), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(t) {
    if (!this.inputElement.disabled) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        t.key === "Enter" && this.inputElement.value.length > 0 && t.preventDefault(), t.key === "Escape" && this._hideOptionsList(), (t.key === "ArrowDown" || t.key === "ArrowUp") && this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement });
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
          t.stopPropagation(), t.preventDefault(), this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] && this._selectItem(this._filteredOptions[this._highlightedIndex].id);
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
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(Z), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(Z), this._blurTimeout = setTimeout(() => {
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
  _parsePositiveInt(t, e) {
    if (!t) return e;
    const s = parseInt(t, 10);
    return Number.isNaN(s) || s <= 0 ? e : s;
  }
  _handleRemoteInput(t) {
    if (this._remoteFetchTimeout && clearTimeout(this._remoteFetchTimeout), t.length < this._remoteMinChars) {
      this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
      return;
    }
    this._remoteFetchTimeout = setTimeout(() => {
      this._fetchRemoteOptions(t);
    }, Yt);
  }
  _cancelRemoteFetch() {
    this._remoteFetchController && (this._remoteFetchController.abort(), this._remoteFetchController = null);
  }
  async _fetchRemoteOptions(t) {
    if (!this._remoteEndpoint) return;
    this._cancelRemoteFetch(), this.classList.add(nt);
    const e = new AbortController();
    this._remoteFetchController = e;
    try {
      const s = new URL(this._remoteEndpoint, window.location.origin);
      s.searchParams.set("q", t), this._remoteLimit && s.searchParams.set("limit", String(this._remoteLimit));
      const n = await fetch(s.toString(), {
        headers: { Accept: "application/json" },
        signal: e.signal,
        credentials: "same-origin"
      });
      if (!n.ok)
        throw new Error(`Remote fetch failed with status ${n.status}`);
      const r = await n.json();
      if (e.signal.aborted)
        return;
      const l = this._extractRemoteOptions(r);
      this._applyRemoteResults(l);
    } catch (s) {
      if (e.signal.aborted)
        return;
      console.error("MultiSelectSimple remote fetch error:", s), this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
    } finally {
      this._remoteFetchController === e && (this._remoteFetchController = null), this.classList.remove(nt);
    }
  }
  _extractRemoteOptions(t) {
    if (!t) return [];
    let e = [];
    return Array.isArray(t) ? e = t : this._remoteResultKey && Array.isArray(t[this._remoteResultKey]) ? e = t[this._remoteResultKey] : Array.isArray(t.items) && (e = t.items), e.map((s) => {
      if (!s) return null;
      const n = s.id ?? s.ID ?? s.value ?? "", r = s.name ?? s.title ?? s.label ?? "", l = s.detail ?? s.additional_data ?? s.annotation ?? "", o = this._normalizeText(r), h = this._normalizeText(l);
      return !n || !o ? null : {
        id: String(n),
        name: o,
        additional_data: h
      };
    }).filter(Boolean);
  }
  _applyRemoteResults(t) {
    const e = new Set(this._value), s = /* @__PURE__ */ new Map();
    this._options.forEach((n) => {
      n != null && n.id && s.set(n.id, n);
    }), t.forEach((n) => {
      n != null && n.id && s.set(n.id, n);
    }), this._options = Array.from(s.values()), this._filteredOptions = t.filter((n) => n && !e.has(n.id)), this._isOptionsListVisible = this._filteredOptions.length > 0, this._highlightedIndex = this._isOptionsListVisible ? 0 : -1, this._renderOptionsList();
  }
  _normalizeText(t) {
    if (t == null)
      return "";
    let e = String(t).trim();
    if (!e)
      return "";
    const s = e[0], n = e[e.length - 1];
    return (s === '"' && n === '"' || s === "'" && n === "'") && (e = e.slice(1, -1).trim(), !e) ? "" : e;
  }
}
p(ct, "formAssociated", !0);
const ie = "rbi-button", se = "rbi-icon";
class ne extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const i = `
              <button type="button" class="${ie} cursor-pointer disabled:cursor-default" aria-label="Reset field">
								<tool-tip position="right">
									<div class="data-tip">Feld zurücksetzen</div>
									<span class="${se} ri-arrow-go-back-fill"></span>
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
    }), this._controlledElements = [], this.lastOverallModifiedState = null;
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
    if (this.initialStates.has(i.id))
      return;
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
const d = "hidden", at = "dm-stay", v = "dm-title", rt = "dm-menu-button", ae = "dm-target", lt = "dm-menu", ot = "dm-menu-item", re = "dm-close-button";
var T, ut;
class le extends HTMLElement {
  constructor() {
    super();
    _(this, T);
    E(this, T, ut).call(this), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  connectedCallback() {
    if (this._cildren = Array.from(this.children).filter((t) => t.nodeType === Node.ELEMENT_NODE && !t.classList.contains(rt)).map((t) => ({
      node: t,
      stay: () => t.hasAttribute(at) && t.getAttribute(at) == "true",
      hidden: () => t.classList.contains(d),
      name: () => {
        const e = t.querySelector("label");
        return e ? e.innerHTML : t.hasAttribute(v) ? t.getAttribute(v) : "";
      },
      nameText: () => {
        const e = t.querySelector("label");
        return e ? e.textContent.trim() : t.hasAttribute(v) ? t.getAttribute(v) : "";
      }
    })), this._target = document.getElementById(this.getAttribute(ae)), this._target || (this._target = this), this._button = this.querySelector(`.${rt}`), !this._button) {
      console.error("DivManagerMenu needs a button element.");
      return;
    }
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    for (const t of this._cildren)
      this.removeChild(t.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const t of this._cildren)
      t.node.querySelectorAll(`.${re}`).forEach((s) => {
        s.addEventListener("click", (n) => {
          this.hideDiv(n, t.node);
        });
      });
    this.renderIntoTarget(), this.refresh(), this._observer = new MutationObserver(() => {
      this.refresh();
    }), this._cildren.forEach((t) => {
      this._observer.observe(t.node, { attributes: !0, attributeFilter: ["class"] });
    });
  }
  disconnectedCallback() {
    this._observer && this._observer.disconnect(), document.removeEventListener("click", this.boundHandleClickOutside);
  }
  refresh() {
    this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  _toggleMenu(t) {
    t.preventDefault(), t.stopPropagation();
    const e = this._cildren.filter((s) => s.hidden());
    if (e.length === 1) {
      const s = this._cildren.indexOf(e[0]);
      this.showDiv(t, s);
      return;
    }
    if (e.length === 0) {
      this.hideMenu();
      return;
    }
    this.renderMenu(), this._menu.classList.contains(d) ? (this._menu.classList.remove(d), document.addEventListener("click", this.boundHandleClickOutside)) : (this._menu.classList.add(d), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  handleClickOutside(t) {
    this._menu && !this._menu.contains(t.target) && !this._button.contains(t.target) && this.hideMenu();
  }
  hideMenu() {
    this._menu && (this._menu.classList.add(d), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  renderButton() {
    if (!this._button)
      return;
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    const t = this._cildren.filter((e) => e.hidden());
    if (t.length === 0) {
      this._button.classList.add(d), this._button.parentElement && this._button.parentElement.removeChild(this._button), this._menu = null, this.hideMenu();
      return;
    }
    if (this._button.parentElement || this.appendChild(this._button), this._button.classList.remove(d), t.length === 1) {
      const e = this._button.querySelector("i"), s = e ? e.outerHTML : '<i class="ri-add-line"></i>';
      this._button.innerHTML = `${s}
${t[0].nameText()} hinzufügen`, this._menu = null, this.hideMenu();
    } else
      this._button.innerHTML = this._originalButtonText, this._menu = null;
  }
  hideDiv(t, e) {
    if (t && (t.preventDefault(), t.stopPropagation()), !e || !(e instanceof HTMLElement)) {
      console.error("DivManagerMenu: Invalid node provided.");
      return;
    }
    const s = this._cildren.find((n) => n.node === e);
    if (!s) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    s.node.classList.add(d), this._target.removeChild(s.node), this.renderButton(), this.renderMenu();
  }
  showDiv(t, e) {
    if (t && (t.preventDefault(), t.stopPropagation()), e < 0 || e >= this._cildren.length) {
      console.error("DivManagerMenu: Invalid index.");
      return;
    }
    const s = this._cildren[e];
    s.node.classList.remove(d), this.insertChildInOrder(s), this.renderMenu(), this.renderButton(), this.updateTargetVisibility();
  }
  renderMenu() {
    const t = this._cildren.filter((s) => s.hidden());
    if (t.length <= 1) {
      this.hideMenu();
      return;
    }
    (!this._menu || !this._button.contains(this._menu)) && (this._button.insertAdjacentHTML("beforeend", `<div class="${lt} absolute hidden"></div>`), this._menu = this._button.querySelector(`.${lt}`)), this._menu.innerHTML = `${t.map((s, n) => `
				<button type="button" class="${ot}" dm-itemno="${this._cildren.indexOf(s)}">
					${s.name()}
				</button>`).join("")}`, this._menu.querySelectorAll(`.${ot}`).forEach((s) => {
      s.addEventListener("click", (n) => {
        this.showDiv(n, parseInt(s.getAttribute("dm-itemno"))), this.hideMenu(), this.renderButton();
      });
    });
  }
  renderIntoTarget() {
    this._cildren.forEach((t) => {
      t.hidden() || this.insertChildInOrder(t);
    }), this.updateTargetVisibility();
  }
  insertChildInOrder(t) {
    const e = this._cildren.indexOf(t), s = this._cildren.slice(e + 1).map((n) => n.node).find((n) => this._target.contains(n));
    s ? this._target.insertBefore(t.node, s) : this._target.appendChild(t.node);
  }
  updateTargetVisibility() {
    if (!this._target || this._target === this)
      return;
    const t = Array.from(this._target.children).some(
      (e) => !e.classList.contains(d)
    );
    this._target.classList.toggle(d, !t);
  }
}
T = new WeakSet(), ut = function() {
  this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null, this._originalButtonText = null;
};
const u = "items-row", oe = "items-list", he = "items-template", de = "items-add-button", ce = "items-remove-button", ue = "items-edit-button", me = "items-close-button", pe = "items-summary", _e = "items-edit-panel", ht = "items_removed[]";
class fe extends HTMLElement {
  constructor() {
    super(), this._list = null, this._template = null, this._addButton = null, this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`, this._handleAdd = this._onAddClick.bind(this);
  }
  connectedCallback() {
    if (this._list = this.querySelector(`.${oe}`), this._template = this.querySelector(`template.${he}`), this._addButton = this.querySelector(`.${de}`), !this._list || !this._template || !this._addButton) {
      console.error("ItemsEditor: Missing list, template, or add button.");
      return;
    }
    this._addButton.addEventListener("click", this._handleAdd), this._wireRemoveButtons(), this._wireEditButtons(), this._refreshRowIds(), this._syncAllSummaries();
  }
  disconnectedCallback() {
    this._addButton && this._addButton.removeEventListener("click", this._handleAdd);
  }
  _onAddClick(i) {
    i.preventDefault(), this.addItem();
  }
  addItem() {
    const i = this._template.content.cloneNode(!0), t = i.querySelector(`.${u}`);
    if (!t) {
      console.error("ItemsEditor: Template is missing a row element.");
      return;
    }
    this._list.appendChild(i), this._wireRemoveButtons(t), this._wireEditButtons(t), this._assignRowFieldIds(t, this._rowIndex(t)), this._wireSummarySync(t), this._syncSummary(t), this._setRowMode(t, "edit");
  }
  removeItem(i) {
    const t = i.closest(`.${u}`);
    if (!t)
      return;
    const e = t.querySelector('input[name="items_id[]"]'), s = e ? e.value.trim() : "";
    s && this._ensureRemovalInput(s), t.remove(), this._refreshRowIds();
  }
  _wireRemoveButtons(i = this) {
    i.querySelectorAll(`.${ce}`).forEach((t) => {
      t.dataset.itemsBound !== "true" && (t.dataset.itemsBound = "true", t.addEventListener("click", (e) => {
        e.preventDefault(), this.removeItem(t);
      }));
    });
  }
  _wireEditButtons(i = this) {
    i.querySelectorAll(`.${ue}`).forEach((t) => {
      t.dataset.itemsBound !== "true" && (t.dataset.itemsBound = "true", t.addEventListener("click", (e) => {
        e.preventDefault();
        const s = t.closest(`.${u}`);
        s && this._setRowMode(s, "edit");
      }));
    }), i.querySelectorAll(`.${me}`).forEach((t) => {
      t.dataset.itemsBound !== "true" && (t.dataset.itemsBound = "true", t.addEventListener("click", (e) => {
        e.preventDefault();
        const s = t.closest(`.${u}`);
        s && this._setRowMode(s, "summary");
      }));
    });
  }
  _setRowMode(i, t) {
    const e = i.querySelector(`.${pe}`), s = i.querySelector(`.${_e}`);
    !e || !s || (t === "edit" ? (e.classList.add("hidden"), s.classList.remove("hidden")) : (e.classList.remove("hidden"), s.classList.add("hidden"), this._syncSummary(i)));
  }
  _refreshRowIds() {
    Array.from(this.querySelectorAll(`.${u}`)).forEach((t, e) => {
      this._assignRowFieldIds(t, e);
    });
  }
  _rowIndex(i) {
    return Array.from(this.querySelectorAll(`.${u}`)).indexOf(i);
  }
  _assignRowFieldIds(i, t) {
    t < 0 || i.querySelectorAll("[data-field-label]").forEach((e) => {
      const s = e.getAttribute("data-field-label");
      if (!s)
        return;
      const n = i.querySelector(`[data-field="${s}"]`);
      if (!n)
        return;
      const r = `${this._idPrefix}-${t}-${s}`;
      n.id = r, e.setAttribute("for", r);
    });
  }
  _syncAllSummaries() {
    this.querySelectorAll(`.${u}`).forEach((i) => {
      this._wireSummarySync(i), this._syncSummary(i);
    });
  }
  _wireSummarySync(i) {
    i.dataset.summaryBound !== "true" && (i.dataset.summaryBound = "true", i.querySelectorAll("[data-field]").forEach((t) => {
      t.addEventListener("input", () => this._syncSummary(i)), t.addEventListener("change", () => this._syncSummary(i));
    }));
  }
  _syncSummary(i) {
    i.querySelectorAll("[data-summary-field]").forEach((t) => {
      const e = t.getAttribute("data-summary-field");
      if (!e)
        return;
      const s = i.querySelector(`[data-field="${e}"]`);
      if (!s)
        return;
      const n = this._readFieldValue(s), r = t.getAttribute("data-summary-hide-empty") === "true" ? t.closest("[data-summary-container]") : null;
      n ? (this._setSummaryContent(t, n), t.classList.remove("text-gray-400"), r && r.classList.remove("hidden")) : (this._setSummaryContent(t, "—"), t.classList.add("text-gray-400"), r && r.classList.add("hidden"));
    });
  }
  _setSummaryContent(i, t) {
    const e = i.querySelector("[data-summary-link]");
    e ? t && t !== "—" ? (e.setAttribute("href", t), e.textContent = t) : (e.setAttribute("href", "#"), e.textContent = "—") : i.textContent = t || "—";
  }
  _readFieldValue(i) {
    if (i instanceof HTMLSelectElement) {
      if (i.multiple)
        return Array.from(i.selectedOptions).map((e) => e.textContent.trim()).filter(Boolean).join(", ");
      const t = i.selectedOptions[0];
      return t ? t.textContent.trim() : "";
    }
    return i instanceof HTMLInputElement || i instanceof HTMLTextAreaElement ? i.value.trim() : "";
  }
  _ensureRemovalInput(i) {
    if (Array.from(this.querySelectorAll(`input[name="${ht}"]`)).some(
      (s) => s.value === i
    ))
      return;
    const e = document.createElement("input");
    e.type = "hidden", e.name = ht, e.value = i, this.appendChild(e);
  }
}
const ge = "filter-list", be = "scroll-button", Ee = "tool-tip", Se = "abbrev-tooltips", Le = "int-link", ve = "popup-image", Ae = "tab-list", Te = "filter-pill", Ie = "image-reel", ye = "multi-select-places", Ce = "multi-select-simple", mt = "reset-button", we = "div-manager", xe = "items-editor";
customElements.define(Le, Ct);
customElements.define(Se, f);
customElements.define(ge, vt);
customElements.define(be, At);
customElements.define(Ee, Tt);
customElements.define(ve, It);
customElements.define(Ae, yt);
customElements.define(Te, Et);
customElements.define(Ie, wt);
customElements.define(ye, dt);
customElements.define(Ce, ct);
customElements.define(mt, ne);
customElements.define(we, le);
customElements.define(xe, fe);
function Me() {
  const a = window.location.pathname, i = window.location.search, t = a + i;
  return encodeURIComponent(t);
}
function ke(a = 5e3, i = 100) {
  return new Promise((t, e) => {
    let s = 0;
    const n = setInterval(() => {
      typeof window.QRCode == "function" ? (clearInterval(n), t(window.QRCode)) : (s += i, s >= a && (clearInterval(n), console.error("Timed out waiting for QRCode to become available."), e(new Error("QRCode not available after " + a + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."))));
    }, i);
  });
}
async function Oe(a) {
  const i = await ke(), t = document.getElementById("qr");
  t && (t.innerHTML = "", t.classList.add("hidden"), new i(t, {
    text: a,
    width: 1280,
    height: 1280,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: i.CorrectLevel.H
  }), setTimeout(() => {
    t.classList.remove("hidden");
  }, 20));
}
function Re(a) {
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
function Be() {
  document.body.addEventListener("htmx:responseError", function(a) {
    const i = a.detail.requestConfig;
    if (i.boosted) {
      document.body.innerHTML = a.detail.xhr.responseText;
      const t = a.detail.xhr.responseURL || i.url;
      window.history.pushState(null, "", t);
    }
  });
}
function $e(a, i) {
  if (!(a instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof i != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const t = a.querySelectorAll(mt);
  a.addEventListener("rbichange", (e) => {
    for (const s of t)
      if (s.isCurrentlyModified()) {
        i(e.details, !0);
        return;
      }
    i(e.details, !1);
  });
}
function I(a) {
  if (!(a instanceof HTMLTextAreaElement)) {
    console.warn("TextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  a.style.height = "auto", a.style.height = `${a.scrollHeight}px`;
}
function pt(a) {
  a.key === "Enter" && a.preventDefault();
}
function _t(a) {
  if (!(a instanceof HTMLTextAreaElement)) {
    console.warn("HookupTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  a.addEventListener("input", () => {
    I(a);
  });
}
function Ne(a) {
  if (!(a instanceof HTMLTextAreaElement)) {
    console.warn("DisconnectTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  a.removeEventListener("input", () => {
    I(a);
  });
}
function De(a) {
  !(a instanceof HTMLTextAreaElement) && a.classList.contains("no-enter") || a.addEventListener("keydown", pt);
}
function Pe(a) {
  !(a instanceof HTMLTextAreaElement) && a.classList.contains("no-enter") || a.removeEventListener("keydown", pt);
}
function He(a, i) {
  for (const t of a)
    if (t.type === "childList") {
      for (const e of t.addedNodes)
        e.nodeType === Node.ELEMENT_NODE && e.matches("textarea") && (_t(e), I(e));
      for (const e of t.removedNodes)
        e.nodeType === Node.ELEMENT_NODE && e.matches("textarea") && (Pe(e), Ne(e));
    }
}
function qe(a) {
  if (!(a instanceof HTMLFormElement)) {
    console.warn("FormLoad: Provided element is not a form.");
    return;
  }
  const i = document.querySelectorAll("textarea");
  for (const s of i)
    _t(s), I(s);
  const t = document.querySelectorAll("textarea.no-enter");
  for (const s of t)
    De(s);
  new MutationObserver(He).observe(a, {
    childList: !0,
    subtree: !0
  });
}
window.ShowBoostedErrors = Be;
window.GenQRCode = Oe;
window.SelectableInput = Re;
window.PathPlusQuery = Me;
window.HookupRBChange = $e;
window.FormLoad = qe;
export {
  f as AbbreviationTooltips,
  vt as FilterList,
  Et as FilterPill,
  wt as ImageReel,
  Ct as IntLink,
  fe as ItemsEditor,
  dt as MultiSelectRole,
  ct as MultiSelectSimple,
  It as PopupImage,
  At as ScrollButton,
  yt as TabList,
  Tt as ToolTip
};
