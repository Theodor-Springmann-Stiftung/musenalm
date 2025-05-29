var $ = Object.defineProperty;
var I = (l) => {
  throw TypeError(l);
};
var D = (l, i, t) => i in l ? $(l, i, { enumerable: !0, configurable: !0, writable: !0, value: t }) : l[i] = t;
var _ = (l, i, t) => D(l, typeof i != "symbol" ? i + "" : i, t), g = (l, i, t) => i.has(l) || I("Cannot " + t);
var f = (l, i, t) => (g(l, i, "read from private field"), t ? t.call(l) : i.get(l)), c = (l, i, t) => i.has(l) ? I("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(l) : i.set(l, t), u = (l, i, t, e) => (g(l, i, "write to private field"), e ? e.call(l, t) : i.set(l, t), t), b = (l, i, t) => (g(l, i, "access private method"), t);
class N extends HTMLElement {
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
const p = "filter-list-list", q = "filter-list-item", H = "filter-list-input", T = "filter-list-searchable";
var o, d, S;
class U extends HTMLElement {
  constructor() {
    super();
    c(this, d);
    c(this, o, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && u(this, o, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, s) {
    t === "data-url" && e !== s && (this._url = s, this.render()), t === "data-filterstart" && e !== s && (this._filterstart = s === "true", this.render()), t === "data-placeholder" && e !== s && (this._placeholder = s, this.render()), t === "data-queryparam" && e !== s && (this._queryparam = s, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (u(this, o, !1), this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && u(this, o, !0), this.renderList();
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
    let e = new Mark(t.querySelectorAll("." + T));
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
    return e === "" ? "" : `<span class="${T}">${e}</span>`;
  }
  getURL(t) {
    if (this._queryparam) {
      let e = new URL(window.location), s = new URLSearchParams(e.search);
      return s.set(this._queryparam, this.getHREF(t)), s.delete("page"), e.search = s.toString(), e.toString();
    }
    return this._url + this.getHREFEncoded(t);
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
        `, htmx && htmx.process(this);
  }
  ActiveDot(t) {
    return b(this, d, S).call(this, t), "";
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
								class="${H} w-full placeholder:italic px-2 py-0.5" />
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
							<div id="${p}" class="${p} pt-1 max-h-60 overflow-auto bg-stone-50 ${f(this, o) ? "hidden" : ""}">
								${t.map(
      (e, s) => `
									<a
										href="${this.getURL(e)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${q} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${b(this, d, S).call(this, e) ? 'aria-current="page"' : ""}>
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
o = new WeakMap(), d = new WeakSet(), S = function(t) {
  if (!t)
    return !1;
  let e = this.getHREF(t);
  return e === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === e ? !0 : !!window.location.href.endsWith(e);
};
class F extends HTMLElement {
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
class G extends HTMLElement {
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
class W extends HTMLElement {
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
class K extends HTMLElement {
  static get observedAttributes() {
  }
  constructor() {
    super(), this._showall = !1, this.shown = -1, this._headings = [], this._contents = [];
  }
  connectedCallback() {
    this._headings = Array.from(this.querySelectorAll(".tab-list-head")), this._contents = Array.from(this.querySelectorAll(".tab-list-panel")), this.hookupEvtHandlers(), this.hideDependent(), this._headings.length === 1 && this.expand(0);
  }
  expand(i) {
    i < 0 || i >= this._headings.length || (this.shown = i, this._contents.forEach((t, e) => {
      e === i ? (t.classList.remove("hidden"), this._headings[e].setAttribute("aria-pressed", "true")) : (t.classList.add("hidden"), this._headings[e].setAttribute("aria-pressed", "false"));
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
class h extends HTMLElement {
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
    super(), this._abbrevMap = h.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(i, t, e) {
    t !== e && (i === "data-abbrevmap" && this._parseAndSetAbbrevMap(e), this.render());
  }
  _parseAndSetAbbrevMap(i) {
    if (!i) {
      this._abbrevMap = h.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(i);
    } catch {
      this._abbrevMap = h.defaultAbbrevMap;
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
class V extends HTMLElement {
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
var m;
class z extends HTMLElement {
  constructor() {
    super();
    c(this, m, 176);
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
    const e = Math.floor(t.width / (f(this, m) + 10));
    for (let s = 0; s < this._images.length; s++)
      s < e - 1 ? this._images[s].classList.remove("hidden") : this._images[s].classList.add("hidden");
  }
}
m = new WeakMap();
const j = "msp-component-wrapper", x = "msp-selected-items-container", J = "msp-selected-item-pill", X = "msp-selected-item-text", A = "msp-selected-item-delete-btn", Y = "msp-controls-area", C = "msp-input-area-wrapper", E = "msp-input-area-default-border", v = "msp-input-area-staged", w = "msp-staging-area-container", P = "msp-staged-item-pill", Z = "msp-staged-item-text", k = "msp-staged-role-select", Q = "msp-staged-cancel-btn", O = "msp-text-input", M = "msp-add-button", B = "msp-options-list", tt = "msp-option-item", et = "msp-option-item-name", it = "msp-option-item-detail", st = "msp-option-item-highlighted", L = "msp-hidden-select", nt = "msp-state-no-selection", at = "msp-state-has-selection", lt = "msp-state-list-open", rt = "msp-state-item-staged";
class R extends HTMLElement {
  constructor() {
    super();
    _(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._stagedItem = null, this._options = [
      { id: "par_fr", name: "Paris", country: "France" },
      { id: "par_us", name: "Paris", country: "USA" },
      { id: "lon_uk", name: "London", country: "UK" },
      { id: "lon_ca", name: "London", country: "Canada" },
      { id: "ber_de", name: "Berlin", country: "Germany" },
      { id: "mad_es", name: "Madrid", country: "Spain" },
      { id: "rom_it", name: "Rome", country: "Italy" },
      { id: "tok_jp", name: "Tokyo", country: "Japan" },
      { id: "syd_au", name: "Sydney", country: "Australia" },
      { id: "spr_il", name: "Springfield", country: "USA (IL)" },
      { id: "spr_ma", name: "Springfield", country: "USA (MA)" },
      { id: "van_ca", name: "Vancouver", country: "Canada" },
      { id: "van_us", name: "Vancouver", country: "USA (WA)" }
    ], this._roles = ["Origin", "Destination", "Stop"], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${tt} px-3 py-2 text-sm cursor-pointer transition-colors duration-75 group">
                        <span data-ref="nameEl" class="${et} font-semibold"></span>
                        <span data-ref="detailEl" class="${it} text-xs ml-2"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${J} flex items-center">
                        <span data-ref="textEl" class="${X}"></span>
                        <button type="button" data-ref="deleteBtn" class="${A} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${P} flex items-center">
                        <span data-ref="nameEl" class="${Z}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${Q} flex items-center justify-center w-5 h-5">&times;</button>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleInputKeyDown = this._handleInputKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleAddButtonClick = this._handleAddButtonClick.bind(this), this._handleCancelStagedItem = this._handleCancelStagedItem.bind(this), this._handleStagedRoleChange = this._handleStagedRoleChange.bind(this);
  }
  _getPlaceById(t) {
    return this._options.find((e) => e.id === t);
  }
  _getAvailableRolesForPlace(t) {
    const e = this._value.filter((s) => s.placeId === t).map((s) => s.role);
    return this._roles.filter((s) => !e.includes(s));
  }
  get value() {
    return this._value;
  }
  set value(t) {
    Array.isArray(t) ? this._value = t.map((e) => {
      if (typeof e == "string") {
        const s = e.split(",");
        if (s.length === 2) {
          const n = this._getPlaceById(s[0]), a = s[1];
          if (n && this._roles.includes(a))
            return this._value.find(
              (y) => y.placeId === s[0] && y.role === a
            ) ? null : { placeId: s[0], role: a, instanceId: crypto.randomUUID() };
        }
      }
      return null;
    }).filter((e) => e !== null) : this._value = [], this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses();
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(t) {
    this.setAttribute("name", t), this.hiddenSelect && (this.hiddenSelect.name = t);
  }
  connectedCallback() {
    if (this._render(), this.inputAreaWrapper = this.querySelector(`.${C}`), this.inputElement = this.querySelector(`.${O}`), this.stagedItemPillContainer = this.querySelector(`.${w}`), this.optionsListElement = this.querySelector(`.${B}`), this.selectedItemsContainer = this.querySelector(`.${x}`), this.addButtonElement = this.querySelector(`.${M}`), this.hiddenSelect = this.querySelector(`.${L}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updateRootElementStateClasses(), this.hasAttribute("value"))
      try {
        const t = JSON.parse(this.getAttribute("value"));
        this.value = t;
      } catch (t) {
        const e = this.getAttribute("value");
        if (e.startsWith("[") && e.endsWith("]")) {
          console.warn(
            "Failed to parse value attribute as JSON array, attempting manual parse:",
            e,
            t
          );
          try {
            const s = e.slice(1, -1).split('","').map((n) => n.replace(/"/g, "").trim());
            this.value = s;
          } catch (s) {
            console.error("Manual parse of value attribute also failed:", e, s), this.value = [];
          }
        } else
          this.value = [e];
      }
    else
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
  formResetCallback() {
    this.value = [], this._stagedItem = null, this._renderStagedPillOrInput(), this._hideOptionsList(), this._updateAddButtonState(), this.inputElement && (this.inputElement.value = ""), this._updateRootElementStateClasses();
  }
  formStateRestoreCallback(t, e) {
    Array.isArray(t) && t.every((s) => typeof s == "string" && s.includes(",")) ? this.value = t : this.value = [], this._updateRootElementStateClasses();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((t) => {
      const e = document.createElement("option");
      e.value = `${t.placeId},${t.role}`, e.textContent = `${t.placeId} (${t.role})`, e.selected = !0, this.hiddenSelect.appendChild(e);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  disabledCallback(t) {
    this.inputElement && (this.inputElement.disabled = t), this.addButtonElement && (this.addButtonElement.classList.toggle(
      "hidden",
      t || !this._stagedItem || !this._stagedItem.currentRole
    ), this.addButtonElement.disabled = t || !this._stagedItem || !this._stagedItem.currentRole), this.classList.toggle("opacity-50", t), this.classList.toggle("cursor-not-allowed", t), this.selectedItemsContainer && this.selectedItemsContainer.classList.toggle("pointer-events-none", t), this.querySelectorAll(`.${A}`).forEach(
      (s) => s.disabled = t
    );
    const e = this.querySelector(`.${k}`);
    e && (e.disabled = t), this.hiddenSelect && (this.hiddenSelect.disabled = t);
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(nt, this._value.length === 0), this.classList.toggle(at, this._value.length > 0), this.classList.toggle(lt, this._isOptionsListVisible), this.classList.toggle(rt, !!this._stagedItem);
  }
  _render() {
    const t = this.id || `msp-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t), this.innerHTML = `
                    <style>
                        .${L} {
                            display: none !important;
                            visibility: hidden !important;
                            position: absolute !important;
                            width: 0 !important;
                            height: 0 !important;
                            opacity: 0 !important;
                            pointer-events: none !important;
                        }
                    </style>
                    <div class="${j} relative">
                        <div class="${x} flex flex-wrap gap-2 mb-2 min-h-[42px]" aria-live="polite"></div>
                        <div class="${Y} flex items-center space-x-2">
                            <div class="${C} flex-grow min-h-[42px] flex items-center flex-wrap gap-1 p-1 rounded-md" tabindex="-1">
                                <span class="${w} flex items-center gap-2"></span>
                                <input type="text" class="${O} flex-1 min-w-[60px] outline-none bg-transparent" placeholder="Search...">
                            </div>
                            <button type="button" class="${M} hidden px-4 py-2 text-sm rounded-md">Add</button>
                        </div>
                        <ul role="listbox" class="${B} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "places_with_roles_default"}" id="hidden-select-${t}" class="${L}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedPlacePillElement(t) {
    const s = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return s.classList.add(P), s.querySelector('[data-ref="nameEl"]').textContent = t.name, s;
  }
  _createStagedRoleSelectElement(t, e) {
    const s = document.createElement("select");
    s.className = `${k} px-2 py-1 text-sm rounded-md border`;
    const n = document.createElement("option");
    if (n.value = "", n.textContent = "Select Role...", n.disabled = !0, e || (n.selected = !0), s.appendChild(n), t.length === 0 && !this._roles.includes(e)) {
      const a = document.createElement("option");
      a.textContent = "No roles left", a.disabled = !0, s.appendChild(a), s.disabled = !0;
    } else
      t.forEach((a) => {
        const r = document.createElement("option");
        r.value = a, r.textContent = a, a === e && (r.selected = !0), s.appendChild(r);
      }), s.disabled = t.length === 0 && e === "";
    return s.addEventListener("change", this._handleStagedRoleChange), s;
  }
  _createStagedCancelButtonElement(t) {
    const s = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return s.setAttribute("aria-label", `Cancel staging ${t}`), s.addEventListener("click", this._handleCancelStagedItem), s;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.place) {
        this.inputAreaWrapper.classList.remove(
          E,
          "border",
          "border-gray-300",
          "focus-within:border-blue-500",
          "focus-within:ring-1",
          "focus-within:ring-blue-500"
        ), this.inputAreaWrapper.classList.add(
          v,
          "border",
          "border-transparent"
        );
        const t = this._createStagedPlacePillElement(this._stagedItem.place);
        this.stagedItemPillContainer.appendChild(t);
        const e = this._getAvailableRolesForPlace(this._stagedItem.place.id), s = this._createStagedRoleSelectElement(
          e,
          this._stagedItem.currentRole
        );
        this.stagedItemPillContainer.appendChild(s);
        const n = this._createStagedCancelButtonElement(this._stagedItem.place.name);
        this.stagedItemPillContainer.appendChild(n), this.inputElement.classList.add("hidden"), this.inputElement.value = "";
      } else
        this.inputAreaWrapper.classList.add(
          E,
          "border",
          "border-gray-300",
          "focus-within:border-blue-500",
          "focus-within:ring-1",
          "focus-within:ring-blue-500"
        ), this.inputAreaWrapper.classList.remove(
          v,
          "border-transparent"
        ), this.inputElement.classList.remove("hidden");
      this._updateAddButtonState(), this._updateRootElementStateClasses();
    }
  }
  _handleStagedRoleChange(t) {
    this._stagedItem && (this._stagedItem.currentRole = t.target.value, this._updateAddButtonState(), t.target.focus());
  }
  _handleCancelStagedItem(t) {
    t && t.stopPropagation(), this._stagedItem = null, this._renderStagedPillOrInput(), this._updateAddButtonState(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList(), this._updateRootElementStateClasses();
  }
  _createSelectedItemElement(t) {
    const e = this._getPlaceById(t.placeId);
    if (!e) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild;
    n.querySelector('[data-ref="textEl"]').textContent = `${e.name} (${e.country}) - ${t.role}`;
    const a = n.querySelector('[data-ref="deleteBtn"]');
    return a.setAttribute("aria-label", `Remove ${e.name} as ${t.role}`), a.dataset.instanceId = t.instanceId, a.disabled = this.hasAttribute("disabled"), a.addEventListener("click", (r) => {
      r.stopPropagation(), this._handleDeleteSelectedItem(t.instanceId);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.forEach((t) => {
      const e = this._createSelectedItemElement(t);
      e && this.selectedItemsContainer.appendChild(e);
    }), this._value.length === 0 && (this.selectedItemsContainer.innerHTML = '<span class="italic">No places selected</span>'), this._updateRootElementStateClasses());
  }
  _updateAddButtonState() {
    if (this.addButtonElement) {
      const t = this.hasAttribute("disabled"), e = this._stagedItem && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole), s = !this._stagedItem || !e || t;
      this.addButtonElement.classList.toggle("hidden", s), this.addButtonElement.disabled = s;
    }
  }
  _createOptionElement(t, e) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="nameEl"]'), r = n.querySelector('[data-ref="detailEl"]');
    return a.textContent = t.name, r.textContent = `(${t.country})`, n.dataset.id = t.id, n.setAttribute("aria-selected", String(e === this._highlightedIndex)), e === this._highlightedIndex && (n.classList.add(st), n.id = `highlighted-option-${this.id || "multi-select"}`), n;
  }
  _renderOptionsList() {
    if (this.optionsListElement) {
      if (this.optionsListElement.innerHTML = "", this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden");
      else {
        this.optionsListElement.classList.remove("hidden"), this._filteredOptions.forEach((e, s) => {
          const n = this._createOptionElement(e, s);
          this.optionsListElement.appendChild(n);
        });
        const t = this.optionsListElement.querySelector(
          `#highlighted-option-${this.id || "multi-select"}`
        );
        t && t.scrollIntoView({ block: "nearest" });
      }
      this._updateRootElementStateClasses();
    }
  }
  _stageItem(t) {
    if (this._getAvailableRolesForPlace(t.id).length === 0) {
      console.warn(`Cannot stage ${t.name}, no available roles.`);
      return;
    }
    this._stagedItem = { place: t, currentRole: "" }, this.inputElement && (this.inputElement.value = ""), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._hideOptionsList();
    const s = this.stagedItemPillContainer.querySelector("select");
    s && !s.disabled ? s.focus() : this.addButtonElement && !this.addButtonElement.disabled && this.addButtonElement.focus(), this._updateRootElementStateClasses();
  }
  _handleAddButtonClick() {
    if (this._stagedItem && this._stagedItem.place && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
      const t = {
        placeId: this._stagedItem.place.id,
        role: this._stagedItem.currentRole,
        instanceId: crypto.randomUUID()
      };
      if (this._value.find(
        (s) => s.placeId === t.placeId && s.role === t.role
      )) {
        console.warn("Attempted to add duplicate place-role combination:", t), this._handleCancelStagedItem();
        return;
      }
      this._value.push(t), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem = null, this._renderStagedPillOrInput(), this._updateAddButtonState(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
    } else
      console.warn("Add button clicked but staged item or role is invalid.", this._stagedItem);
    this._updateRootElementStateClasses();
  }
  _handleInput(t) {
    this._stagedItem && (this._stagedItem = null, this._renderStagedPillOrInput(), this._updateAddButtonState());
    const e = t.target.value;
    if (e.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = e.toLowerCase();
      this._filteredOptions = this._options.filter((n) => this._getAvailableRolesForPlace(n.id).length === 0 || this._stagedItem && this._stagedItem.place.id === n.id ? !1 : n.name.toLowerCase().includes(s) || n.country.toLowerCase().includes(s)), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(t) {
    t.key === "Escape" && (this._isOptionsListVisible ? (t.preventDefault(), this._hideOptionsList(), this.inputElement && this.inputElement.focus()) : this._stagedItem && (t.preventDefault(), this._handleCancelStagedItem(t)));
  }
  _handleInputKeyDown(t) {
    if (!(this.inputElement && this.inputElement.disabled)) {
      if (t.key === "Backspace" && this.inputElement && this.inputElement.value === "" && !this._stagedItem && this._value.length > 0) {
        t.preventDefault(), this._handleDeleteSelectedItem(this._value[this._value.length - 1].instanceId);
        return;
      }
      if (this._stagedItem && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole) && t.key === "Enter" && (document.activeElement === this.addButtonElement || this.stagedItemPillContainer && this.stagedItemPillContainer.contains(document.activeElement))) {
        t.preventDefault(), this._handleAddButtonClick();
        return;
      }
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
          t.preventDefault(), this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] ? this._stageItem(this._filteredOptions[this._highlightedIndex]) : t.key === "Tab" && this._hideOptionsList();
          break;
      }
    }
  }
  _hideOptionsList() {
    this._isOptionsListVisible = !1, this._highlightedIndex = -1, this.optionsListElement && this._renderOptionsList();
  }
  _handleFocus() {
    if (!(this.inputElement && (this.inputElement.disabled || this._stagedItem))) {
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(
        E,
        "border",
        "border-gray-300",
        "focus-within:border-blue-500",
        "focus-within:ring-1",
        "focus-within:ring-blue-500"
      ), this.inputAreaWrapper.classList.remove(
        v,
        "border-transparent"
      )), this.inputElement && this.inputElement.value.length > 0) {
        const t = this.inputElement.value.toLowerCase();
        this._filteredOptions = this._options.filter((e) => this._getAvailableRolesForPlace(e.id).length === 0 || this._stagedItem && this._stagedItem.place.id === e.id ? !1 : e.name.toLowerCase().includes(t) || e.country.toLowerCase().includes(t)), this._filteredOptions.length > 0 ? (this._isOptionsListVisible = !0, this._highlightedIndex = 0, this._renderOptionsList()) : this._hideOptionsList();
      } else
        this._hideOptionsList();
      this._updateRootElementStateClasses();
    }
  }
  _handleBlur(t) {
    !this._stagedItem && this.inputAreaWrapper, this._blurTimeout = setTimeout(() => {
      const e = document.activeElement;
      e !== this.addButtonElement && !(this.stagedItemPillContainer && this.stagedItemPillContainer.contains(e)) && !(this.optionsListElement && this.optionsListElement.contains(e)) && !this.contains(e) && this._hideOptionsList();
    }, 150);
  }
  _handleOptionMouseDown(t) {
    t.preventDefault();
  }
  _handleOptionClick(t) {
    const e = t.target.closest("li[data-id]");
    if (e) {
      const s = e.dataset.id, n = this._filteredOptions.find((a) => a.id === s);
      n && this._stageItem(n);
    }
  }
  _handleDeleteSelectedItem(t) {
    this._value = this._value.filter((e) => e.instanceId !== t), this._updateFormValue(), this._renderSelectedItems(), this.inputElement && (this.inputElement.focus(), this._handleInput({ target: this.inputElement }));
  }
}
_(R, "formAssociated", !0);
const ot = "filter-list", ht = "scroll-button", dt = "tool-tip", ct = "abbrev-tooltips", ut = "int-link", pt = "popup-image", mt = "tab-list", _t = "filter-pill", gt = "image-reel", ft = "multi-select-places";
customElements.define(ut, V);
customElements.define(ct, h);
customElements.define(ot, U);
customElements.define(ht, F);
customElements.define(dt, G);
customElements.define(pt, W);
customElements.define(mt, K);
customElements.define(_t, N);
customElements.define(gt, z);
customElements.define(ft, R);
export {
  h as AbbreviationTooltips,
  U as FilterList,
  F as ScrollButton
};
