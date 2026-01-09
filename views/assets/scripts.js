var We = Object.defineProperty;
var se = (l) => {
  throw TypeError(l);
};
var je = (l, t, e) => t in l ? We(l, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[t] = e;
var x = (l, t, e) => je(l, typeof t != "symbol" ? t + "" : t, e), z = (l, t, e) => t.has(l) || se("Cannot " + e);
var K = (l, t, e) => (z(l, t, "read from private field"), e ? e.call(l) : t.get(l)), w = (l, t, e) => t.has(l) ? se("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(l) : t.set(l, e), $ = (l, t, e, i) => (z(l, t, "write to private field"), i ? i.call(l, e) : t.set(l, e), e), N = (l, t, e) => (z(l, t, "access private method"), e);
class Ge extends HTMLElement {
  constructor() {
    super(), this._value = "", this.render();
  }
  static get observedAttributes() {
    return ["data-text", "data-queryparam", "data-value"];
  }
  set value(t) {
    this.setAttribute("data-value", t);
  }
  get value() {
    return this.getAttribute("data-value") || "";
  }
  set text(t) {
    this.setAttribute("data-text", t);
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set queryparam(t) {
    this.setAttribute("data-queryparam", t);
  }
  get queryparam() {
    return this.getAttribute("data-queryparam") || "";
  }
  connectedCallback() {
    this._filter = this.text, this._queryparam = this.queryparam, this.render(), htmx.process(this);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-text" && (this._filter = i), t === "data-queryparam" && (this._queryparam = i), t === "data-value" && (this._value = i), this.render());
  }
  getURL() {
    if (this._queryparam) {
      let t = new URL(window.location), e = new URLSearchParams(t.search);
      return e.delete(this._queryparam), e.delete("page"), t.search = e.toString(), t.toString();
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
const D = "filter-list-list", Je = "filter-list-item", Qe = "filter-list-input", ne = "filter-list-searchable";
var y, O, ie;
class Ye extends HTMLElement {
  constructor() {
    super();
    w(this, O);
    w(this, y, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && $(this, y, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(e, i, s) {
    e === "data-url" && i !== s && (this._url = s, this.render()), e === "data-filterstart" && i !== s && (this._filterstart = s === "true", this.render()), e === "data-placeholder" && i !== s && (this._placeholder = s, this.render()), e === "data-queryparam" && i !== s && (this._queryparam = s, this.render());
  }
  onInput(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (this._filter = e.target.value, this.renderList());
  }
  onGainFocus(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && ($(this, y, !1), this.renderList());
  }
  onLoseFocus(e) {
    let i = this.querySelector("input");
    if (e.target && e.target === i) {
      if (relatedElement = e.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      i.value = "", this._filter = "", this._filterstart && $(this, y, !0), this.renderList();
    }
  }
  onEnter(e) {
    if (e.target && e.target.tagName.toLowerCase() === "input" && e.key === "Enter") {
      e.preventDefault();
      const i = this.querySelector("a");
      i && i.click();
    }
  }
  mark() {
    if (typeof Mark != "function")
      return;
    let e = this.querySelector("#" + D);
    if (!e)
      return;
    let i = new Mark(e.querySelectorAll("." + ne));
    this._filter && i.mark(this._filter, {
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
    let i = this.getSearchText(e);
    return i === "" ? "" : `<span class="${ne}">${i}</span>`;
  }
  getURL(e) {
    if (this._queryparam) {
      let i = new URL(window.location), s = new URLSearchParams(i.search);
      return s.set(this._queryparam, this.getHREF(e)), s.delete("page"), i.search = s.toString(), i.toString();
    }
    return this._url + this.getHREFEncoded(e);
  }
  renderList() {
    let e = this.querySelector("#" + D);
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
    return N(this, O, ie).call(this, e), "";
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
								class="${Qe} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
  }
  List() {
    let e = this._items;
    if (this._filter)
      if (this._filterstart)
        e = this._items.filter((i) => this.getSearchText(i).toLowerCase().startsWith(this._filter.toLowerCase()));
      else {
        let i = this._filter.split(" ");
        e = this._items.filter((s) => i.every((n) => this.getSearchText(s).toLowerCase().includes(n.toLowerCase())));
      }
    return `
							<div id="${D}" class="${D} pt-1 max-h-60 overflow-auto bg-stone-50 ${K(this, y) ? "hidden" : ""}">
								${e.map(
      (i, s) => `
									<a
										href="${this.getURL(i)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${Je} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${s % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${N(this, O, ie).call(this, i) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(i)}
										${this.getLinkText(i)}
									</a>
								`
    ).join("")}
								${this.NoItems(e)}
							</div>
				`;
  }
}
y = new WeakMap(), O = new WeakSet(), ie = function(e) {
  if (!e)
    return !1;
  let i = this.getHREF(e);
  return i === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === i ? !0 : !!window.location.href.endsWith(i);
};
class Xe extends HTMLElement {
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
class Ze extends HTMLElement {
  static get observedAttributes() {
    return ["position", "timeout"];
  }
  constructor() {
    super(), this._tooltipBox = null, this._timeout = 200, this._hideTimeout = null, this._hiddenTimeout = null;
  }
  connectedCallback() {
    this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal");
    const t = this.querySelector(".data-tip"), e = t ? t.innerHTML : "Tooltip";
    t && t.classList.add("hidden"), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = e, this._tooltipBox.className = [
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
  attributeChangedCallback(t, e, i) {
    t === "position" && this._tooltipBox && this._updatePosition(), t === "timeout" && i && (this._timeout = parseInt(i) || 200);
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
class et extends HTMLElement {
  constructor() {
    super(), this.overlay = null, this._others = null, this._thisindex = -1, this._preview = null, this._description = null, this._imageURL = "", this._hideDLButton = !1;
  }
  connectedCallback() {
    this.classList.add("cursor-pointer"), this.classList.add("select-none"), this._imageURL = this.getAttribute("data-image-url") || "", this._hideDLButton = this.getAttribute("data-hide-dl-button") || !1, this._preview = this.querySelector("img"), this._description = this.querySelector(".image-description"), this._preview && this._preview.addEventListener("click", () => {
      this.showOverlay();
    });
    let t = this.closest("image-reel, .image-reel");
    t || (t = document), this._others = Array.from(t.querySelectorAll("popup-image:not(.hidden)")), this._thisindex = this._others.indexOf(this);
  }
  disconnectedCallback() {
    this.overlay && this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay);
  }
  Keys(t) {
    t.repeat || (t.preventDefault(), t.key === "ArrowRight" ? this.next() : t.key === "ArrowLeft" ? this.prev() : t.key === "Escape" && this.hideOverlay());
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
    const t = this.overlay.querySelector("#closebutton");
    t && t.addEventListener("click", () => {
      this.hideOverlay();
    });
    const e = this.overlay.querySelector("#nextbtn");
    e && e.addEventListener("click", this.next.bind(this));
    const i = this.overlay.querySelector("#prevbtn");
    i && i.addEventListener("click", this.prev.bind(this)), this.overlay.addEventListener("click", (s) => {
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
class tt extends HTMLElement {
  static get observedAttributes() {
  }
  constructor() {
    super(), this._showall = !1, this.shown = -1, this._headings = [], this._contents = [], this._checkbox = null, this._disabled = /* @__PURE__ */ new Set(), this._defaultIndex = null;
  }
  connectedCallback() {
    if (this._headings = Array.from(this.querySelectorAll(".tab-list-head")), this._contents = Array.from(this.querySelectorAll(".tab-list-panel")), this._readConfig(), this.hookupEvtHandlers(), this._applyDisabled(), this.hideDependent(), this._headings.length === 1) {
      this.expand(0);
      return;
    }
    this._defaultIndex !== null && this._expandFirstAvailable(this._defaultIndex);
  }
  expand(t) {
    t < 0 || t >= this._headings.length || this._disabled.has(t) || (this.shown = t, this._contents.forEach((e, i) => {
      i === t ? (e.classList.remove("hidden"), this._headings[i].setAttribute("aria-pressed", "true")) : (e.classList.add("hidden"), this._headings[i].setAttribute("aria-pressed", "false"));
    }));
  }
  hookupShowAll(t) {
    t && (this._checkbox = t, t.addEventListener("change", (e) => {
      e.target.checked ? this.showAll() : this.default();
    }));
  }
  hookupEvtHandlers() {
    for (let t of this._headings)
      t.addEventListener("click", this.handleTabClick.bind(this)), t.classList.add("cursor-pointer"), t.classList.add("select-none"), t.setAttribute("role", "button"), t.setAttribute("aria-pressed", "false"), t.setAttribute("tabindex", "0");
    for (let t of this._contents)
      t.classList.add("hidden");
  }
  _readConfig() {
    const t = (this.getAttribute("data-disabled-indices") || "").trim(), e = (this.getAttribute("data-default-index") || "").trim();
    if (this._disabled.clear(), t && t.split(",").map((i) => parseInt(i.trim(), 10)).filter((i) => Number.isFinite(i)).forEach((i) => this._disabled.add(i)), e !== "") {
      const i = parseInt(e, 10);
      this._defaultIndex = Number.isFinite(i) ? i : null;
    } else
      this._defaultIndex = null;
  }
  _applyDisabled() {
    this._headings.forEach((t, e) => {
      this._disabled.has(e) ? t.classList.add("pointer-events-none", "opacity-60") : t.classList.remove("pointer-events-none", "opacity-60");
    });
  }
  _expandFirstAvailable(t) {
    if (this._headings.length !== 0) {
      if (!this._disabled.has(t)) {
        this.expand(t);
        return;
      }
      for (let e = 0; e < this._headings.length; e += 1)
        if (!this._disabled.has(e)) {
          this.expand(e);
          return;
        }
    }
  }
  restore() {
    for (let t of this._headings)
      t.classList.add("cursor-pointer"), t.classList.add("select-none"), t.setAttribute("role", "button"), t.setAttribute("aria-pressed", "false"), t.setAttribute("tabindex", "0"), t.classList.remove("pointer-events-none"), t.classList.remove("!text-slate-900");
    for (let t of this._contents)
      t.classList.add("hidden");
  }
  disable() {
    for (let t of this._headings)
      t.classList.remove("cursor-pointer"), t.classList.remove("select-none"), t.removeAttribute("role"), t.removeAttribute("aria-pressed"), t.removeAttribute("tabindex"), t.classList.add("pointer-events-none"), t.classList.add("!text-slate-900");
  }
  showAll() {
    this._showall = !0, this.shown = -1, this.disable(), this._contents.forEach((t, e) => {
      t.classList.remove("hidden");
      let i = this._headings[e], s = i.querySelectorAll(".show-opened");
      for (let a of s)
        a.classList.add("hidden");
      let n = i.querySelectorAll(".show-closed");
      for (let a of n)
        a.classList.add("hidden");
    });
  }
  default() {
    this._showall = !1, this.restore(), this.hideDependent();
  }
  hideDependent() {
    if (this.shown < 0)
      for (const t of this._headings)
        this._hideAllDep(t, !1);
    else
      this._headings.forEach((t, e) => {
        this._hideAllDep(t, e === this.shown);
      });
  }
  _hideAllDep(t, e) {
    const i = t.querySelectorAll(".show-closed");
    for (let n of i)
      e ? n.classList.add("hidden") : n.classList.remove("hidden");
    const s = Array.from(t.querySelectorAll(".show-opened"));
    for (let n of s)
      e ? n.classList.remove("hidden") : n.classList.add("hidden");
  }
  handleTabClick(t) {
    if (!t.target) {
      console.warn("Invalid event target");
      return;
    }
    const e = this.findParentWithClass(t.target, "tab-list-head");
    if (!e) {
      console.warn("No parent found with class 'tab-list-head'");
      return;
    }
    const i = this._headings.indexOf(e);
    i === this.shown ? (this._contents[i].classList.toggle("hidden"), this._headings[i].setAttribute("aria-pressed", "false"), this.shown = -1) : this.expand(i), this.hideDependent();
  }
  findParentWithClass(t, e) {
    for (; t; ) {
      if (t.classList && t.classList.contains(e))
        return t;
      t = t.parentElement;
    }
    return null;
  }
}
class R extends HTMLElement {
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
    super(), this._abbrevMap = R.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-abbrevmap" && this._parseAndSetAbbrevMap(i), this.render());
  }
  _parseAndSetAbbrevMap(t) {
    if (!t) {
      this._abbrevMap = R.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(t);
    } catch {
      this._abbrevMap = R.defaultAbbrevMap;
    }
  }
  setAbbrevMap(t) {
    typeof t == "object" && t !== null && (this._abbrevMap = t, this.render());
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set text(t) {
    this.setAttribute("data-text", t);
  }
  render() {
    this.innerHTML = this.transformText(this.text, this._abbrevMap);
  }
  transformText(t, e) {
    let i = "", s = 0;
    for (; s < t.length; ) {
      if (s > 0 && !this.isSpaceOrPunct(t[s - 1])) {
        i += t[s], s++;
        continue;
      }
      const n = this.findLongestAbbrevAt(t, s, e);
      if (n) {
        const { match: a, meaning: r } = n;
        i += `
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
        i += t[s], s++;
    }
    return i;
  }
  findLongestAbbrevAt(t, e, i) {
    let s = null, n = 0;
    for (const a of Object.keys(i))
      t.startsWith(a, e) && a.length > n && (s = a, n = a.length);
    return s ? { match: s, meaning: i[s] } : null;
  }
  isSpaceOrPunct(t) {
    return /\s|[.,;:!?]/.test(t);
  }
}
class it extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style.cursor = "pointer", this.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }
  handleClick(t) {
    const e = this.getAttribute("data-jump");
    if (e) {
      const i = document.querySelector(e);
      i ? i.scrollIntoView({ behavior: "smooth" }) : console.warn(`No element found for selector: ${e}`);
    }
  }
}
var F;
class st extends HTMLElement {
  constructor() {
    super();
    w(this, F, 176);
    this._images = [];
  }
  connectedCallback() {
    this._images = Array.from(this.querySelectorAll(".primages")), this.calculateShownImages();
    const e = new ResizeObserver((i, s) => {
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
    const i = Math.floor(e.width / (K(this, F) + 10));
    for (let s = 0; s < this._images.length; s++)
      s < i - 1 ? this._images[s].classList.remove("hidden") : this._images[s].classList.add("hidden");
  }
}
F = new WeakMap();
const nt = "msr-component-wrapper", ae = "msr-selected-items-container", le = "msr-placeholder-no-selection-text", at = "msr-selected-item-pill", lt = "msr-selected-item-text", rt = "msr-item-name", ot = "msr-item-additional-data", dt = "msr-selected-item-role", re = "msr-selected-item-delete-btn", ht = "msr-controls-area", oe = "msr-pre-add-button", de = "msr-input-area-wrapper", q = "msr-input-area-default-border", W = "msr-input-area-staged", he = "msr-staging-area-container", ct = "msr-staged-item-pill", ut = "msr-staged-item-text", j = "msr-staged-role-select", ce = "msr-staged-cancel-btn", ue = "msr-text-input", me = "msr-add-button", _e = "msr-options-list", pe = "msr-option-item", mt = "msr-option-item-name", _t = "msr-option-item-detail", fe = "msr-option-item-highlighted", G = "msr-hidden-select", pt = "msr-state-no-selection", ft = "msr-state-has-selection", gt = "msr-state-list-open", bt = "msr-state-item-staged";
class Ne extends HTMLElement {
  constructor() {
    super();
    x(this, "_blurTimeout", null);
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
    const i = typeof e == "string" ? e.toLowerCase() !== "false" : !!e;
    this._showAddButton !== i && (this._showAddButton = i, this.setAttribute("show-add-button", String(i)), this.preAddButtonElement && this._updatePreAddButtonVisibility());
  }
  get placeholderNoSelection() {
    return this._placeholderNoSelection;
  }
  set placeholderNoSelection(e) {
    const i = String(e || "Keine Elemente ausgewählt");
    this._placeholderNoSelection !== i && (this._placeholderNoSelection = i, this.setAttribute("placeholder-no-selection", i), this.selectedItemsContainer && this._value.length === 0 && this._renderSelectedItems());
  }
  get placeholderSearch() {
    return this._placeholderSearch;
  }
  set placeholderSearch(e) {
    const i = String(e || "Elemente suchen...");
    this._placeholderSearch !== i && (this._placeholderSearch = i, this.setAttribute("placeholder-search", i), this.inputElement && (this.inputElement.placeholder = i));
  }
  get placeholderRoleSelect() {
    return this._placeholderRoleSelect;
  }
  set placeholderRoleSelect(e) {
    const i = String(e || "Rolle auswählen...");
    this._placeholderRoleSelect !== i && (this._placeholderRoleSelect = i, this.setAttribute("placeholder-role-select", i), this._stagedItem && this.stagedItemPillContainer && this._renderStagedPillOrInput());
  }
  attributeChangedCallback(e, i, s) {
    if (i !== s)
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
                    <li role="option" class="${pe} group">
                        <span data-ref="nameEl" class="${mt}"></span>
                        <span data-ref="detailEl" class="${_t}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${at} group">
                        <span data-ref="textEl" class="${lt}"></span>
                        <button type="button" data-ref="deleteBtn" class="${re} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${ct} flex items-center">
                        <span data-ref="nameEl" class="${ut}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${ce} flex items-center justify-center">&times;</button>
                `, this.stagedRoleSelectTemplate = document.createElement("template"), this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${j}">
                    </select>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleInputKeyDown = this._handleInputKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleAddButtonClick = this._handleAddButtonClick.bind(this), this._handleCancelStagedItem = this._handleCancelStagedItem.bind(this), this._handleStagedRoleChange = this._handleStagedRoleChange.bind(this);
  }
  _getItemById(e) {
    return this._options.find((i) => i.id === e);
  }
  _getAvailableRolesForItem(e) {
    const i = this._value.filter((s) => s.itemId === e).map((s) => s.role);
    return this._roles.filter((s) => !i.includes(s));
  }
  setRoles(e) {
    if (Array.isArray(e) && e.every((i) => typeof i == "string")) {
      this._roles = [...e], this._stagedItem && this._stagedItem.item && (this._getAvailableRolesForItem(this._stagedItem.item.id).includes(this._stagedItem.currentRole) || (this._stagedItem.currentRole = ""), this._renderStagedPillOrInput(), this._updateAddButtonState());
      const i = this._value.filter((s) => this._roles.includes(s.role));
      i.length !== this._value.length && (this.value = i.map((s) => `${s.itemId},${s.role}`));
    } else
      console.error("setRoles expects an array of strings.");
  }
  setOptions(e) {
    if (Array.isArray(e) && e.every((i) => i && typeof i.id == "string" && typeof i.name == "string")) {
      this._options = [...e];
      const i = this._value.filter((s) => this._getItemById(s.itemId));
      i.length !== this._value.length && (this.value = i.map((s) => `${s.itemId},${s.role}`)), this._stagedItem && this._stagedItem.item && !this._getItemById(this._stagedItem.item.id) && this._handleCancelStagedItem(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else
      console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(e) {
    if (Array.isArray(e)) {
      const i = e.map((a) => {
        if (typeof a == "string") {
          const r = a.split(",");
          if (r.length === 2) {
            const o = r[0].trim(), d = r[1].trim();
            if (this._getItemById(o) && this._roles.includes(d))
              return { itemId: o, role: d, instanceId: crypto.randomUUID() };
          }
        }
        return null;
      }).filter((a) => a !== null), s = [], n = /* @__PURE__ */ new Set();
      for (const a of i) {
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
  set name(e) {
    this.setAttribute("name", e), this.hiddenSelect && (this.hiddenSelect.name = e);
  }
  connectedCallback() {
    if (this.placeholderNoSelection = this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection, this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch, this.placeholderRoleSelect = this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect, this._render(), this.inputAreaWrapper = this.querySelector(`.${de}`), this.inputElement = this.querySelector(`.${ue}`), this.stagedItemPillContainer = this.querySelector(`.${he}`), this.optionsListElement = this.querySelector(`.${_e}`), this.selectedItemsContainer = this.querySelector(`.${ae}`), this.addButtonElement = this.querySelector(`.${me}`), this.preAddButtonElement = this.querySelector(`.${oe}`), this.hiddenSelect = this.querySelector(`.${G}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.hasAttribute("show-add-button") ? this.showAddButton = this.getAttribute("show-add-button") : this.setAttribute("show-add-button", String(this._showAddButton)), this.inputElement && (this.inputElement.placeholder = this.placeholderSearch), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        const i = JSON.parse(e);
        Array.isArray(i) ? this.value = i : (console.warn("Parsed value attribute is not an array:", i), this.value = []);
      } catch (i) {
        if (console.warn("Failed to parse value attribute as JSON array. Attribute was:", e, i), e.startsWith("[") && e.endsWith("]"))
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
    this.inputElement && (this.inputElement.disabled = e), this.classList.toggle("pointer-events-none", e), this.querySelectorAll(`.${re}`).forEach(
      (s) => s.disabled = e
    );
    const i = this.querySelector(`.${j}`);
    i && (i.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), this._updateAddButtonState(), this._updatePreAddButtonVisibility();
  }
  formResetCallback() {
    this.value = [], this._stagedItem = null, this._renderStagedPillOrInput(), this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this._updateRootElementStateClasses();
  }
  formStateRestoreCallback(e, i) {
    Array.isArray(e) && e.every((s) => typeof s == "string" && s.includes(",")) ? this.value = e : this.value = [], this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((e) => {
      var s;
      const i = document.createElement("option");
      i.value = `${e.itemId},${e.role}`, i.textContent = `${((s = this._getItemById(e.itemId)) == null ? void 0 : s.name) || e.itemId} (${e.role})`, i.selected = !0, this.hiddenSelect.appendChild(i);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(pt, this._value.length === 0), this.classList.toggle(ft, this._value.length > 0), this.classList.toggle(gt, this._isOptionsListVisible), this.classList.toggle(bt, !!this._stagedItem);
  }
  _render() {
    const e = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e), this.innerHTML = `
                    <style>
                        .${G} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${nt} relative">
                        <div class="${ae} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${le}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${ht} flex items-center">
                            <div class="${de} ${q} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${he} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${ue} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${oe} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${me} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${e}-options-list" class="${_e} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${e}" class="${G}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedItemPillElement(e) {
    const s = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return s.querySelector('[data-ref="nameEl"]').textContent = e.name, s;
  }
  _createStagedRoleSelectElement(e, i) {
    const n = this.stagedRoleSelectTemplate.content.cloneNode(!0).firstElementChild;
    let a = `<option value="" disabled ${i ? "" : "selected"}>${this.placeholderRoleSelect}</option>`;
    return e.length === 0 && !this._roles.includes(i) ? (a += "<option disabled>Keine Rollen verfügbar</option>", n.disabled = !0) : (e.forEach((r) => {
      a += `<option value="${r}" ${r === i ? "selected" : ""}>${r}</option>`;
    }), n.disabled = e.length === 0 && i === ""), n.innerHTML = a, n.addEventListener("change", this._handleStagedRoleChange), n;
  }
  _createStagedCancelButtonElement(e) {
    const s = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return s.setAttribute("aria-label", `Auswahl von ${e} abbrechen`), s.addEventListener("click", this._handleCancelStagedItem), s;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.item) {
        this.inputAreaWrapper.classList.remove(q), this.inputAreaWrapper.classList.add(W);
        const e = this._createStagedItemPillElement(this._stagedItem.item);
        this.stagedItemPillContainer.appendChild(e);
        const i = this._getAvailableRolesForItem(this._stagedItem.item.id), s = this._createStagedRoleSelectElement(
          i,
          this._stagedItem.currentRole
        );
        this.stagedItemPillContainer.appendChild(s);
        const n = this._createStagedCancelButtonElement(this._stagedItem.item.name);
        this.stagedItemPillContainer.appendChild(n), this.inputElement.classList.add("hidden"), this.inputElement.value = "", this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.setAttribute("aria-expanded", "false");
      } else
        this.inputAreaWrapper.classList.add(q), this.inputAreaWrapper.classList.remove(W), this.inputElement.classList.remove("hidden");
      this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses();
    }
  }
  _updatePreAddButtonVisibility() {
    if (!this.preAddButtonElement) return;
    const e = this.hasAttribute("disabled"), i = !this._stagedItem, s = this.showAddButton && i && !e;
    this.preAddButtonElement.classList.toggle("hidden", !s), this.preAddButtonElement.disabled = e;
  }
  _handleStagedRoleChange(e) {
    this._stagedItem && (this._stagedItem.currentRole = e.target.value, this._updateAddButtonState());
  }
  _handleCancelStagedItem(e) {
    e && e.stopPropagation(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
  }
  _createSelectedItemElement(e) {
    const i = this._getItemById(e.itemId);
    if (!i) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="textEl"]');
    let r = `<span class="${rt}">${i.name}</span>`, o = i.additional_data ? ` <span class="${ot}">(${i.additional_data})</span>` : "", d = ` <span class="${dt}">${e.role}</span>`;
    a.innerHTML = `${r}${o}${d}`;
    const c = n.querySelector('[data-ref="deleteBtn"]');
    return c.setAttribute("aria-label", `Entferne ${i.name} als ${e.role}`), c.dataset.instanceId = e.instanceId, c.disabled = this.hasAttribute("disabled"), c.addEventListener("click", (h) => {
      h.stopPropagation(), this._handleDeleteSelectedItem(e.instanceId);
    }), n;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${le}">${this.placeholderNoSelection}</span>` : this._value.forEach((e) => {
      const i = this._createSelectedItemElement(e);
      i && this.selectedItemsContainer.appendChild(i);
    }), this._updateRootElementStateClasses());
  }
  _updateAddButtonState() {
    if (this.addButtonElement) {
      const e = this.hasAttribute("disabled"), i = this._stagedItem && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole), s = !this._stagedItem || !i || e;
      this.addButtonElement.classList.toggle("hidden", s), this.addButtonElement.disabled = s;
    }
  }
  _createOptionElement(e, i) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild;
    return n.querySelector('[data-ref="nameEl"]').textContent = e.name, n.querySelector('[data-ref="detailEl"]').textContent = e.additional_data ? `(${e.additional_data})` : "", n.dataset.id = e.id, n.setAttribute("aria-selected", String(i === this._highlightedIndex)), n.id = `${this.id || "msr"}-option-${e.id}`, i === this._highlightedIndex && n.classList.add(fe), n;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.removeAttribute("aria-controls");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this.inputElement.setAttribute("aria-controls", this.optionsListElement.id), this._filteredOptions.forEach((i, s) => {
          const n = this._createOptionElement(i, s);
          this.optionsListElement.appendChild(n);
        });
        const e = this.optionsListElement.querySelector(
          `.${fe}`
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
      `.${j}`
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
    const i = e.target.value;
    if (i.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = i.toLowerCase();
      this._filteredOptions = this._options.filter((n) => this._getAvailableRolesForItem(n.id).length === 0 || this._stagedItem && this._stagedItem.item.id === n.id ? !1 : n.name.toLowerCase().includes(s) || n.additional_data && n.additional_data.toLowerCase().includes(s)), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(e) {
    var i;
    if (!this.hasAttribute("disabled")) {
      if (e.key === "Enter" && this._stagedItem && this._stagedItem.item) {
        const s = document.activeElement, n = (i = this.stagedItemPillContainer) == null ? void 0 : i.querySelector(
          `.${ce}`
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
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(q), this.inputAreaWrapper.classList.remove(W)), this.inputElement && this.inputElement.value.length > 0) {
        const e = this.inputElement.value.toLowerCase();
        this._filteredOptions = this._options.filter((i) => this._getAvailableRolesForItem(i.id).length === 0 ? !1 : i.name.toLowerCase().includes(e) || i.additional_data && i.additional_data.toLowerCase().includes(e)), this._filteredOptions.length > 0 ? (this._isOptionsListVisible = !0, this._highlightedIndex = 0, this._renderOptionsList()) : this._hideOptionsList();
      } else
        this._hideOptionsList();
      this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
    }
  }
  _handleBlur(e) {
    this._blurTimeout = setTimeout(() => {
      const i = document.activeElement;
      i !== this.addButtonElement && i !== this.preAddButtonElement && !(this.stagedItemPillContainer && this.stagedItemPillContainer.contains(i)) && !(this.optionsListElement && this.optionsListElement.contains(i)) && !this.contains(i) && this._hideOptionsList();
    }, 150);
  }
  _handleOptionMouseDown(e) {
    e.preventDefault();
  }
  _handleOptionClick(e) {
    if (this.hasAttribute("disabled")) return;
    const i = e.target.closest(`li[data-id].${pe}`);
    if (i) {
      const s = i.dataset.id, n = this._filteredOptions.find((a) => a.id === s);
      n && this._stageItem(n);
    }
  }
  _handleDeleteSelectedItem(e) {
    this.hasAttribute("disabled") || (this._value = this._value.filter((i) => i.instanceId !== e), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem && this._stagedItem.item && this._renderStagedPillOrInput(), this.inputElement && this.inputElement.focus(), this._updatePreAddButtonVisibility());
  }
}
x(Ne, "formAssociated", !0);
const Et = "mss-component-wrapper", ge = "mss-selected-items-container", St = "mss-selected-item-pill", vt = "mss-selected-item-text", Lt = "mss-selected-item-pill-detail", be = "mss-selected-item-delete-btn", yt = "mss-selected-item-edit-link", Ee = "mss-input-controls-container", Se = "mss-input-wrapper", ve = "mss-input-wrapper-focused", Le = "mss-text-input", ye = "mss-create-new-button", Ae = "mss-toggle-button", At = "mss-inline-row", Ce = "mss-options-list", Ct = "mss-option-item", It = "mss-option-item-name", xt = "mss-option-item-detail", Ie = "mss-option-item-highlighted", J = "mss-hidden-select", Q = "mss-no-items-text", xe = "mss-loading", Y = 1, X = 10, wt = 250, Tt = "mss-state-no-selection", kt = "mss-state-has-selection", Rt = "mss-state-list-open";
class De extends HTMLElement {
  constructor() {
    super();
    x(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._initialValue = [], this._initialOrder = [], this._removedIds = /* @__PURE__ */ new Set(), this._initialCaptured = !1, this._allowInitialCapture = !0, this._options = [
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
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._remoteEndpoint = null, this._remoteResultKey = "items", this._remoteMinChars = Y, this._remoteLimit = X, this._remoteFetchController = null, this._remoteFetchTimeout = null, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._editBase = this.getAttribute("data-edit-base") || "", this._editSuffix = this.getAttribute("data-edit-suffix") || "/edit", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${Ct}">
                        <span data-ref="nameEl" class="${It}"></span>
                        <span data-ref="detailEl" class="${xt}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${St} flex items-center">
                        <span data-ref="textEl" class="${vt}"></span>
                        <span data-ref="detailEl" class="${Lt} hidden"></span>
                        <a data-ref="editLink" class="${yt} hidden" aria-label="Bearbeiten">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" data-ref="deleteBtn" class="${be}">&times;</button>
                    </span>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this), this._handleSelectedItemsContainerClick = this._handleSelectedItemsContainerClick.bind(this), this._handleToggleClick = this._handleToggleClick.bind(this);
  }
  _getItemById(e) {
    return this._options.find((i) => i.id === e);
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
    const i = String(e).toLowerCase() !== "false" && e !== !1;
    this._showCreateButton !== i && (this._showCreateButton = i, this.createNewButton && this.createNewButton.classList.toggle("hidden", !this._showCreateButton), this.setAttribute("show-create-button", this._showCreateButton ? "true" : "false"));
  }
  setOptions(e) {
    if (Array.isArray(e) && e.every((i) => i && typeof i.id == "string" && typeof i.name == "string")) {
      this._options = e.map((s) => {
        const n = { ...s };
        return n.name = this._normalizeText(n.name), n.additional_data = this._normalizeText(n.additional_data), n;
      });
      const i = this._value.filter((s) => this._getItemById(s));
      i.length !== this._value.length ? this.value = i : this.selectedItemsContainer && this._renderSelectedItems(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(e) {
    const i = JSON.stringify(this._value.sort());
    if (Array.isArray(e))
      this._value = [...new Set(e.filter((n) => typeof n == "string" && this._getItemById(n)))];
    else if (typeof e == "string" && e.trim() !== "") {
      const n = e.trim();
      this._getItemById(n) && !this._value.includes(n) ? this._value = [n] : this._getItemById(n) || (this._value = this._value.filter((a) => a !== n));
    } else this._value = [];
    const s = JSON.stringify(this._value.sort());
    !this._initialCaptured && this._allowInitialCapture && this._value.length > 0 && (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0), this._value.forEach((n) => {
      this._removedIds.has(n) && this._removedIds.delete(n);
    }), i !== s && (this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses(), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(e) {
    this.setAttribute("name", e), this.hiddenSelect && (this.hiddenSelect.name = e);
  }
  connectedCallback() {
    if (this._render(), this.inputControlsContainer = this.querySelector(`.${Ee}`), this.inputWrapper = this.querySelector(`.${Se}`), this.inputElement = this.querySelector(`.${Le}`), this.createNewButton = this.querySelector(`.${ye}`), this.toggleButton = this.querySelector(`.${Ae}`), this.optionsListElement = this.querySelector(`.${Ce}`), this.selectedItemsContainer = this.querySelector(`.${ge}`), this.hiddenSelect = this.querySelector(`.${J}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._remoteEndpoint = this.getAttribute("data-endpoint") || null, this._remoteResultKey = this.getAttribute("data-result-key") || "items", this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), Y), this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), X), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.addEventListener("click", this._handleToggleClick), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        this.value = JSON.parse(e);
      } catch {
        this.value = e.split(",").map((s) => s.trim()).filter(Boolean);
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this.hasAttribute("disabled") && this.disabledCallback(!0), this._toggleInput && this._hideInputControls(), this._allowInitialCapture = !1, this._initialCaptured || (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.createNewButton && this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer && this.selectedItemsContainer.removeEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.removeEventListener("click", this._handleToggleClick), clearTimeout(this._blurTimeout), this._remoteFetchTimeout && (clearTimeout(this._remoteFetchTimeout), this._remoteFetchTimeout = null), this._cancelRemoteFetch();
  }
  static get observedAttributes() {
    return [
      "disabled",
      "name",
      "value",
      "placeholder",
      "show-create-button",
      "data-endpoint",
      "data-result-key",
      "data-minchars",
      "data-limit",
      "data-toggle-label"
    ];
  }
  attributeChangedCallback(e, i, s) {
    if (i !== s)
      if (e === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (e === "name" && this.hiddenSelect) this.hiddenSelect.name = s;
      else if (e === "value" && this.inputElement)
        try {
          this.value = JSON.parse(s);
        } catch {
          this.value = s.split(",").map((a) => a.trim()).filter(Boolean);
        }
      else e === "placeholder" ? this.placeholder = s : e === "show-create-button" ? this.showCreateButton = s : e === "data-endpoint" ? this._remoteEndpoint = s || null : e === "data-result-key" ? this._remoteResultKey = s || "items" : e === "data-minchars" ? this._remoteMinChars = this._parsePositiveInt(s, Y) : e === "data-limit" ? this._remoteLimit = this._parsePositiveInt(s, X) : e === "data-toggle-label" && (this._toggleLabel = s || "", this._toggleInput = this._toggleLabel !== "");
  }
  formAssociatedCallback(e) {
  }
  formDisabledCallback(e) {
    this.disabledCallback(e);
  }
  formResetCallback() {
    this.value = [], this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._updateRootElementStateClasses(), this._renderSelectedItems(), this._toggleInput && this._hideInputControls();
  }
  formStateRestoreCallback(e, i) {
    this.value = Array.isArray(e) ? e : [], this._updateRootElementStateClasses();
  }
  captureInitialSelection() {
    this._initialValue = [...this._value], this._initialOrder = [...this._value], this._removedIds.clear(), this._initialCaptured = !0, this._renderSelectedItems();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((e) => {
      const i = document.createElement("option");
      i.value = e;
      const s = this._getItemById(e);
      i.textContent = s ? s.name : e, i.selected = !0, this.hiddenSelect.appendChild(i);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  disabledCallback(e) {
    this.inputElement && (this.inputElement.disabled = e), this.createNewButton && (this.createNewButton.disabled = e), this.toggleAttribute("disabled", e), this.querySelectorAll(`.${be}`).forEach((i) => i.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), e && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Tt, this._value.length === 0), this.classList.toggle(kt, this._value.length > 0), this.classList.toggle(Rt, this._isOptionsListVisible);
  }
  _render() {
    const e = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e);
    const i = this.getAttribute("data-toggle-label") || "", s = i !== "", n = s ? "hidden" : "";
    this.innerHTML = `
                    <style>
                        .${J} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${Et} relative">
                        <div class="${At} flex flex-wrap items-center gap-2">
                            <div class="${ge} flex flex-wrap items-center gap-1 min-h-[30px]" aria-live="polite" tabindex="-1"></div>
                            ${s ? `<button type="button" class="${Ae}">${i}</button>` : ""}
                            <div class="${Ee} flex items-center gap-2 ${n}">
                                <div class="${Se} relative rounded-md flex items-center flex-grow">
                                    <input type="text"
                                           class="${Le} w-full outline-none bg-transparent"
                                           placeholder="${this.placeholder}"
                                           aria-autocomplete="list"
                                           aria-expanded="${this._isOptionsListVisible}"
                                           aria-controls="options-list-${e}"
                                           autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                                </div>
                                <button type="button" class="${ye} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                            </div>
                        </div>
                        <ul id="options-list-${e}" role="listbox" class="${Ce} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${e}" class="${J}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(e) {
    const i = this._getItemById(e);
    if (!i) return null;
    const n = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="textEl"]'), r = n.querySelector('[data-ref="detailEl"]'), o = n.querySelector('[data-ref="editLink"]'), d = n.querySelector('[data-ref="deleteBtn"]');
    a.textContent = this._normalizeText(i.name);
    const c = this._normalizeText(i.additional_data);
    c ? (r.textContent = `(${c})`, r.classList.remove("hidden")) : (r.textContent = "", r.classList.add("hidden"));
    const h = this._removedIds.has(e);
    if (!this._initialValue.includes(e)) {
      const u = document.createElement("span");
      u.className = "ml-1 text-xs text-gray-600", u.textContent = "(Neu)", a.appendChild(u);
    }
    return h && (n.classList.add("bg-red-100"), n.style.position = "relative"), o && (this._editBase && !h ? (o.href = `${this._editBase}${e}${this._editSuffix}`, o.target = "_blank", o.rel = "noreferrer", o.classList.remove("hidden")) : (o.classList.add("hidden"), o.removeAttribute("href"), o.removeAttribute("target"), o.removeAttribute("rel"))), d.setAttribute("aria-label", h ? `Undo remove ${i.name}` : `Remove ${i.name}`), d.dataset.id = e, d.disabled = this.hasAttribute("disabled"), d.innerHTML = h ? '<span class="text-xs inline-flex items-center"><i class="ri-arrow-go-back-line"></i></span>' : "&times;", d.addEventListener("click", (u) => {
      u.stopPropagation(), this._handleDeleteSelectedItem(e);
    }), n;
  }
  _renderSelectedItems() {
    if (!this.selectedItemsContainer) return;
    this.selectedItemsContainer.innerHTML = "";
    const e = this._initialOrder.filter((s) => this._removedIds.has(s) && !this._value.includes(s)), i = [...this._value, ...e];
    if (i.length === 0) {
      const s = this.getAttribute("data-empty-text") || "Keine Auswahl...";
      this.selectedItemsContainer.innerHTML = `<span class="${Q}">${s}</span>`;
    } else
      i.forEach((s) => {
        const n = this._createSelectedItemElement(s);
        n && this.selectedItemsContainer.appendChild(n);
      });
    this._updateRootElementStateClasses();
  }
  _createOptionElement(e, i) {
    const n = this.optionTemplate.content.cloneNode(!0).firstElementChild, a = n.querySelector('[data-ref="nameEl"]'), r = n.querySelector('[data-ref="detailEl"]');
    a.textContent = this._normalizeText(e.name);
    const o = this._normalizeText(e.additional_data);
    r.textContent = o ? `(${o})` : "", n.dataset.id = e.id, n.setAttribute("aria-selected", String(i === this._highlightedIndex));
    const d = `option-${this.id || "mss"}-${e.id}`;
    return n.id = d, i === this._highlightedIndex && (n.classList.add(Ie), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", d)), n;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this._filteredOptions.forEach((i, s) => {
          const n = this._createOptionElement(i, s);
          this.optionsListElement.appendChild(n);
        });
        const e = this.optionsListElement.querySelector(`.${Ie}`);
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
    const i = e.target.value;
    if (this._remoteEndpoint) {
      this._handleRemoteInput(i);
      return;
    }
    if (i.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const s = i.toLowerCase();
      this._filteredOptions = this._options.filter((n) => {
        if (this._value.includes(n.id)) return !1;
        const r = this._normalizeText(n.name).toLowerCase().includes(s), o = this._normalizeText(n.additional_data), d = o && o.toLowerCase().includes(s);
        return r || d;
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
          e.preventDefault(), this._hideOptionsList(), this._toggleInput && this._hideInputControls();
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
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(ve), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(ve), this._blurTimeout = setTimeout(() => {
      this.contains(document.activeElement) || (this._hideOptionsList(), this._toggleInput && (!this.inputElement || this.inputElement.value.trim() === "") && this._hideInputControls());
    }, 150);
  }
  _handleOptionMouseDown(e) {
    e.preventDefault();
  }
  _handleOptionClick(e) {
    const i = e.target.closest("li[data-id]");
    i && i.dataset.id && this._selectItem(i.dataset.id);
  }
  _selectItem(e) {
    e && !this._value.includes(e) && (this.value = [...this._value, e]), this.inputElement && (this.inputElement.value = ""), this._filteredOptions = [], this._hideOptionsList(), this._toggleInput ? this._hideInputControls() : this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleDeleteSelectedItem(e) {
    if (this._removedIds.has(e)) {
      this._removedIds.delete(e), this._value.includes(e) ? this._renderSelectedItems() : this.value = [...this._value, e];
      return;
    }
    if (this._initialValue.includes(e)) {
      this._removedIds.add(e), this.value = this._value.filter((i) => i !== e);
      return;
    }
    this.value = this._value.filter((i) => i !== e), this.inputElement && this.inputElement.value && this._handleInput({ target: this.inputElement }), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleToggleClick(e) {
    e.preventDefault(), this._showInputControls();
  }
  _showInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.remove("hidden"), this.toggleButton && this.toggleButton.classList.add("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const e = this.selectedItemsContainer.querySelector(`.${Q}`);
        e && e.classList.add("hidden");
      }
      this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus(), this._inputCollapsed = !1;
    }
  }
  _hideInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.add("hidden"), this.toggleButton && this.toggleButton.classList.remove("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const e = this.selectedItemsContainer.querySelector(`.${Q}`);
        e && e.classList.remove("hidden");
      }
      this._hideOptionsList(), this._inputCollapsed = !0;
    }
  }
  _parsePositiveInt(e, i) {
    if (!e) return i;
    const s = parseInt(e, 10);
    return Number.isNaN(s) || s <= 0 ? i : s;
  }
  _handleRemoteInput(e) {
    if (this._remoteFetchTimeout && clearTimeout(this._remoteFetchTimeout), e.length < this._remoteMinChars) {
      this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
      return;
    }
    this._remoteFetchTimeout = setTimeout(() => {
      this._fetchRemoteOptions(e);
    }, wt);
  }
  _cancelRemoteFetch() {
    this._remoteFetchController && (this._remoteFetchController.abort(), this._remoteFetchController = null);
  }
  async _fetchRemoteOptions(e) {
    if (!this._remoteEndpoint) return;
    this._cancelRemoteFetch(), this.classList.add(xe);
    const i = new AbortController();
    this._remoteFetchController = i;
    try {
      const s = new URL(this._remoteEndpoint, window.location.origin);
      s.searchParams.set("q", e), this._remoteLimit && s.searchParams.set("limit", String(this._remoteLimit));
      const n = await fetch(s.toString(), {
        headers: { Accept: "application/json" },
        signal: i.signal,
        credentials: "same-origin"
      });
      if (!n.ok)
        throw new Error(`Remote fetch failed with status ${n.status}`);
      const a = await n.json();
      if (i.signal.aborted)
        return;
      const r = this._extractRemoteOptions(a);
      this._applyRemoteResults(r);
    } catch (s) {
      if (i.signal.aborted)
        return;
      console.error("MultiSelectSimple remote fetch error:", s), this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
    } finally {
      this._remoteFetchController === i && (this._remoteFetchController = null), this.classList.remove(xe);
    }
  }
  _extractRemoteOptions(e) {
    if (!e) return [];
    let i = [];
    return Array.isArray(e) ? i = e : this._remoteResultKey && Array.isArray(e[this._remoteResultKey]) ? i = e[this._remoteResultKey] : Array.isArray(e.items) && (i = e.items), i.map((s) => {
      if (!s) return null;
      const n = s.id ?? s.ID ?? s.value ?? "", a = s.name ?? s.title ?? s.label ?? "", r = s.detail ?? s.additional_data ?? s.annotation ?? "", o = this._normalizeText(a), d = this._normalizeText(r);
      return !n || !o ? null : {
        id: String(n),
        name: o,
        additional_data: d
      };
    }).filter(Boolean);
  }
  _applyRemoteResults(e) {
    const i = new Set(this._value), s = /* @__PURE__ */ new Map();
    this._options.forEach((n) => {
      n != null && n.id && s.set(n.id, n);
    }), e.forEach((n) => {
      n != null && n.id && s.set(n.id, n);
    }), this._options = Array.from(s.values()), this._filteredOptions = e.filter((n) => n && !i.has(n.id)), this._isOptionsListVisible = this._filteredOptions.length > 0, this._highlightedIndex = this._isOptionsListVisible ? 0 : -1, this._renderOptionsList();
  }
  _normalizeText(e) {
    if (e == null)
      return "";
    let i = String(e).trim();
    if (!i)
      return "";
    const s = i[0], n = i[i.length - 1];
    return (s === '"' && n === '"' || s === "'" && n === "'") && (i = i.slice(1, -1).trim(), !i) ? "" : i;
  }
}
x(De, "formAssociated", !0);
const Ot = "rbi-button", Bt = "rbi-icon";
class Mt extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const t = `
              <button type="button" class="${Ot} cursor-pointer disabled:cursor-default" aria-label="Reset field">
								<tool-tip position="right">
									<div class="data-tip">Feld zurücksetzen</div>
									<span class="${Bt} ri-arrow-go-back-fill"></span>
								</tool-tip>
              </button>
            `;
    this.innerHTML = t, this.button = this.querySelector("button"), this.button ? this.button.addEventListener("click", this.handleReset) : console.error("ResetButtonIndividual: Button element not found after setting innerHTML."), this.updateControlledElements(), this.updateButtonAriaLabel();
  }
  disconnectedCallback() {
    this.button && this.button.removeEventListener("click", this.handleReset), this._controlledElements.forEach((t) => {
      t.removeEventListener("input", this.handleInputChange), t.removeEventListener("change", this.handleInputChange);
    });
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "controls" && this.updateControlledElements(), (t === "controls" || t === "button-aria-label") && this.updateButtonAriaLabel());
  }
  updateControlledElements() {
    this._controlledElements.forEach((i) => {
      i.removeEventListener("input", this.handleInputChange), i.removeEventListener("change", this.handleInputChange);
    }), this._controlledElements = [], this.lastOverallModifiedState = null;
    const t = (this.getAttribute("controls") || "").split(",").map((i) => i.trim()).filter((i) => i);
    if (!t.length && this.button) {
      this.button.disabled = !0, this.button.setAttribute("aria-disabled", "true"), this.checkIfModified();
      return;
    }
    const e = [];
    t.forEach((i) => {
      const s = document.getElementById(i);
      s ? (e.push(s), this.storeInitialState(s), s.addEventListener("input", this.handleInputChange), s.addEventListener("change", this.handleInputChange)) : console.warn(`ResetButtonIndividual: Element with ID "${i}" not found.`);
    }), this._controlledElements = e, this.button && (this.button.disabled = this._controlledElements.length === 0, this.button.setAttribute("aria-controls", this._controlledElements.map((i) => i.id).join(" ")), this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.checkIfModified();
  }
  storeInitialState(t) {
    if (this.initialStates.has(t.id))
      return;
    let e;
    switch (t.type) {
      case "checkbox":
      case "radio":
        e = { checked: t.checked };
        break;
      case "select-multiple":
        e = {
          selectedOptions: Array.from(t.options).filter((i) => i.selected).map((i) => i.value)
        };
        break;
      case "select-one":
      default:
        e = { value: t.value };
        break;
    }
    this.initialStates.set(t.id, e);
  }
  resetElement(t) {
    const e = this.initialStates.get(t.id);
    if (e) {
      switch (t.type) {
        case "checkbox":
        case "radio":
          t.checked = e.checked;
          break;
        case "select-multiple":
          Array.from(t.options).forEach((i) => {
            i.selected = e.selectedOptions.includes(i.value);
          });
          break;
        case "select-one":
        default:
          t.value = e.value;
          break;
      }
      t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
    }
  }
  handleReset() {
    this._controlledElements.forEach((t) => {
      this.resetElement(t);
    }), this.checkIfModified();
  }
  handleInputChange(t) {
    this._controlledElements.includes(t.target) && this.checkIfModified();
  }
  // Internal helper to check a single element
  isElementModified(t) {
    const e = this.initialStates.get(t.id);
    if (!e) return !1;
    switch (t.type) {
      case "checkbox":
      case "radio":
        return t.checked !== e.checked;
      case "select-multiple":
        const i = Array.from(t.options).filter((n) => n.selected).map((n) => n.value), s = e.selectedOptions;
        return i.length !== s.length || i.some((n) => !s.includes(n)) || s.some((n) => !i.includes(n));
      case "select-one":
      default:
        return t.value !== e.value;
    }
  }
  // Public method to check overall modification state
  isCurrentlyModified() {
    if (this._controlledElements.length === 0)
      return !1;
    for (const t of this._controlledElements)
      if (this.isElementModified(t))
        return !0;
    return !1;
  }
  checkIfModified() {
    const t = this.isCurrentlyModified();
    this._controlledElements.forEach((i) => {
      this.isElementModified(i) ? i.classList.add("modified-element") : i.classList.remove("modified-element");
    });
    const e = this.getAttribute("wrapper-class");
    if (e) {
      const i = this.closest(`.${e}`);
      if (i) {
        const s = this.getAttribute("modified-class-suffix") || "modified", n = `${e}-${s}`;
        t ? i.classList.add(n) : i.classList.remove(n);
      }
    }
    if (this.button && (this.button.disabled = !t || this._controlledElements.length === 0, this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.lastOverallModifiedState !== t) {
      const i = new CustomEvent("rbichange", {
        bubbles: !0,
        composed: !0,
        detail: {
          modified: t,
          controlledElementIds: this._controlledElements.map((s) => s.id),
          instance: this
        }
      });
      this.dispatchEvent(i), this.lastOverallModifiedState = t;
    }
  }
  updateButtonAriaLabel() {
    if (!this.button) return;
    let t = this.getAttribute("button-aria-label");
    if (!t) {
      const e = this._controlledElements.map((i) => i.id);
      if (e.length === 1 && this._controlledElements[0]) {
        const i = this._controlledElements[0], s = document.querySelector(`label[for="${i.id}"]`);
        let n = i.name || i.id;
        s && s.textContent ? n = s.textContent.trim().replace(/[:*]$/, "").trim() : i.getAttribute("aria-label") && (n = i.getAttribute("aria-label")), t = `Reset ${n}`;
      } else e.length > 1 ? t = "Reset selected fields" : t = "Reset field";
    }
    this.button.setAttribute("aria-label", t);
  }
}
const g = "hidden", we = "dm-stay", P = "dm-title", Te = "dm-menu-button", $t = "dm-target", Nt = "data-dm-target", ke = "dm-menu", Re = "dm-menu-item", Dt = "dm-close-button";
var V, qe;
class qt extends HTMLElement {
  constructor() {
    super();
    w(this, V);
    N(this, V, qe).call(this), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  connectedCallback() {
    if (this._target = document.getElementById(this.getAttribute($t)), this._target || (this._target = this), this._cildren = Array.from(this.children).filter((e) => e.nodeType === Node.ELEMENT_NODE && !e.classList.contains(Te)).map((e) => ({
      node: e,
      target: () => {
        const i = e.getAttribute(Nt);
        return i ? document.getElementById(i) || this._target : this._target;
      },
      stay: () => e.hasAttribute(we) && e.getAttribute(we) == "true",
      hidden: () => e.classList.contains(g),
      name: () => {
        const i = e.querySelector("label");
        return i ? i.innerHTML : e.hasAttribute(P) ? e.getAttribute(P) : "";
      },
      nameText: () => {
        const i = e.querySelector("label");
        return i ? i.textContent.trim() : e.hasAttribute(P) ? e.getAttribute(P) : "";
      }
    })), this._button = this.querySelector(`.${Te}`), !this._button) {
      console.error("DivManagerMenu needs a button element.");
      return;
    }
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    for (const e of this._cildren)
      this.removeChild(e.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const e of this._cildren)
      e.node.querySelectorAll(`.${Dt}`).forEach((s) => {
        s.addEventListener("click", (n) => {
          this.hideDiv(n, e.node);
        });
      });
    this.renderIntoTarget(), this.refresh(), this._observer = new MutationObserver(() => {
      this.refresh();
    }), this._cildren.forEach((e) => {
      this._observer.observe(e.node, { attributes: !0, attributeFilter: ["class"] });
    });
  }
  disconnectedCallback() {
    this._observer && this._observer.disconnect(), document.removeEventListener("click", this.boundHandleClickOutside);
  }
  refresh() {
    this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  _toggleMenu(e) {
    e.preventDefault(), e.stopPropagation();
    const i = this._cildren.filter((s) => s.hidden());
    if (i.length === 1) {
      const s = this._cildren.indexOf(i[0]);
      this.showDiv(e, s);
      return;
    }
    if (i.length === 0) {
      this.hideMenu();
      return;
    }
    this.renderMenu(), this._menu.classList.contains(g) ? (this._menu.classList.remove(g), document.addEventListener("click", this.boundHandleClickOutside)) : (this._menu.classList.add(g), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  handleClickOutside(e) {
    this._menu && !this._menu.contains(e.target) && !this._button.contains(e.target) && this.hideMenu();
  }
  hideMenu() {
    this._menu && (this._menu.classList.add(g), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  renderButton() {
    if (!this._button)
      return;
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    const e = this._cildren.filter((i) => i.hidden());
    if (e.length === 0) {
      this._button.classList.add(g), this._button.parentElement && this._button.parentElement.removeChild(this._button), this._menu = null, this.hideMenu();
      return;
    }
    if (this._button.parentElement || this.appendChild(this._button), this._button.classList.remove(g), e.length === 1) {
      const i = this._button.querySelector("i"), s = i ? i.outerHTML : '<i class="ri-add-line"></i>';
      this._button.innerHTML = `${s}
${e[0].nameText()} hinzufügen`, this._menu = null, this.hideMenu();
    } else
      this._button.innerHTML = this._originalButtonText, this._menu = null;
  }
  hideDiv(e, i) {
    if (e && (e.preventDefault(), e.stopPropagation()), !i || !(i instanceof HTMLElement)) {
      console.error("DivManagerMenu: Invalid node provided.");
      return;
    }
    const s = this._cildren.find((a) => a.node === i);
    if (!s) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    s.node.classList.add(g);
    const n = s.target();
    n && n.contains(s.node) && n.removeChild(s.node), this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  showDiv(e, i) {
    if (e && (e.preventDefault(), e.stopPropagation()), i < 0 || i >= this._cildren.length) {
      console.error("DivManagerMenu: Invalid index.");
      return;
    }
    const s = this._cildren[i];
    if (s.node.classList.remove(g), this.insertChildInOrder(s), this.renderMenu(), this.renderButton(), this.updateTargetVisibility(), typeof window.TextareaAutoResize == "function") {
      const n = s.node.querySelectorAll("textarea");
      n.length > 0 && setTimeout(() => {
        n.forEach((a) => {
          a.dataset.dmResizeBound !== "true" && (a.dataset.dmResizeBound = "true", a.addEventListener("input", () => {
            window.TextareaAutoResize(a);
          })), window.TextareaAutoResize(a);
        });
      }, 10);
    }
  }
  renderMenu() {
    const e = this._cildren.filter((s) => s.hidden());
    if (e.length <= 1) {
      this.hideMenu();
      return;
    }
    (!this._menu || !this._button.contains(this._menu)) && (this._button.insertAdjacentHTML("beforeend", `<div class="${ke} absolute hidden"></div>`), this._menu = this._button.querySelector(`.${ke}`)), this._menu.innerHTML = `${e.map((s, n) => `
				<button type="button" class="${Re}" dm-itemno="${this._cildren.indexOf(s)}">
					${s.name()}
				</button>`).join("")}`, this._menu.querySelectorAll(`.${Re}`).forEach((s) => {
      s.addEventListener("click", (n) => {
        this.showDiv(n, parseInt(s.getAttribute("dm-itemno"))), this.hideMenu(), this.renderButton();
      });
    });
  }
  renderIntoTarget() {
    this._cildren.forEach((e) => {
      e.hidden() || this.insertChildInOrder(e);
    }), this.updateTargetVisibility();
  }
  insertChildInOrder(e) {
    const i = e.target(), s = this._cildren.indexOf(e), n = this._cildren.slice(s + 1).filter((a) => a.target() === i).map((a) => a.node).find((a) => i && i.contains(a));
    i && (n ? i.insertBefore(e.node, n) : i.appendChild(e.node));
  }
  updateTargetVisibility() {
    new Set(
      this._cildren.map((i) => i.target()).filter((i) => i && i !== this)
    ).forEach((i) => {
      const s = Array.from(i.children).some(
        (n) => !n.classList.contains(g)
      );
      i.classList.toggle(g, !s);
    });
  }
}
V = new WeakSet(), qe = function() {
  this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null, this._originalButtonText = null;
};
const b = "items-row", Pt = "items-list", Ht = "items-template", Ft = "items-add-button", Vt = "items-cancel-button", H = "items-remove-button", Ut = "items-edit-button", zt = "items-close-button", Kt = "items-summary", Wt = "items-edit-panel", Z = "items_removed[]", T = "data-items-removed";
class jt extends HTMLElement {
  constructor() {
    super(), this._list = null, this._template = null, this._addButton = null, this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`, this._handleAdd = this._onAddClick.bind(this);
  }
  connectedCallback() {
    if (this._list = this.querySelector(`.${Pt}`), this._template = this.querySelector(`template.${Ht}`), this._addButton = this.querySelector(`.${Ft}`), !this._list || !this._template || !this._addButton) {
      console.error("ItemsEditor: Missing list, template, or add button.");
      return;
    }
    this._addButton.addEventListener("click", this._handleAdd), this._captureAllOriginals(), this._wireCancelButtons(), this._wireRemoveButtons(), this._wireEditButtons(), this._refreshRowIds(), this._syncAllSummaries();
  }
  disconnectedCallback() {
    this._addButton && this._addButton.removeEventListener("click", this._handleAdd);
  }
  _onAddClick(t) {
    t.preventDefault(), this.addItem();
  }
  addItem() {
    const t = this._template.content.cloneNode(!0), e = t.querySelector(`.${b}`);
    if (!e) {
      console.error("ItemsEditor: Template is missing a row element.");
      return;
    }
    this._list.appendChild(t), this._captureOriginalValues(e), this._wireCancelButtons(e), this._wireRemoveButtons(e), this._wireEditButtons(e), this._assignRowFieldIds(e, this._rowIndex(e)), this._wireSummarySync(e), this._syncSummary(e), this._setRowMode(e, "edit");
  }
  removeItem(t) {
    const e = t.closest(`.${b}`);
    if (!e)
      return;
    const i = e.getAttribute(T) === "true";
    this._setRowRemoved(e, !i);
  }
  _wireRemoveButtons(t = this) {
    t.querySelectorAll(`.${H}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault(), this.removeItem(e);
      }), e.addEventListener("mouseenter", () => {
        const i = e.closest(`.${b}`);
        if (!i || i.getAttribute(T) !== "true")
          return;
        const s = e.querySelector("[data-delete-label]");
        s && (s.textContent = s.getAttribute("data-delete-hover") || "Rückgängig");
        const n = e.querySelector("i");
        n && (n.classList.remove("hidden"), n.classList.add("ri-arrow-go-back-line"), n.classList.remove("ri-delete-bin-line"));
      }), e.addEventListener("mouseleave", () => {
        const i = e.closest(`.${b}`), s = e.querySelector("[data-delete-label]");
        if (!s)
          return;
        i && i.getAttribute(T) === "true" ? s.textContent = s.getAttribute("data-delete-active") || "Wird entfernt" : s.textContent = s.getAttribute("data-delete-default") || "Entfernen";
        const n = e.querySelector("i");
        n && (i && i.getAttribute(T) === "true" ? (n.classList.add("hidden"), n.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (n.classList.remove("hidden"), n.classList.add("ri-delete-bin-line"), n.classList.remove("ri-arrow-go-back-line")));
      }));
    });
  }
  _wireCancelButtons(t = this) {
    t.querySelectorAll(`.${Vt}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const s = e.closest(`.${b}`);
        s && this._cancelEdit(s);
      }));
    });
  }
  _wireEditButtons(t = this) {
    t.querySelectorAll(`.${Ut}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const s = e.closest(`.${b}`);
        s && this._setRowMode(s, "edit");
      }));
    }), t.querySelectorAll(`.${zt}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const s = e.closest(`.${b}`);
        s && this._setRowMode(s, "summary");
      }));
    });
  }
  _cancelEdit(t) {
    const e = t.querySelector('input[name="items_id[]"]');
    if (!(e ? e.value.trim() : "")) {
      t.remove(), this._refreshRowIds();
      return;
    }
    this._resetToOriginal(t), this._setRowMode(t, "summary");
  }
  _setRowRemoved(t, e) {
    t.setAttribute(T, e ? "true" : "false"), t.classList.toggle("bg-red-50", e);
    const i = t.querySelector(".items-edit-button");
    i && (e ? i.classList.add("hidden") : i.classList.remove("hidden")), t.querySelectorAll("[data-delete-label]").forEach((a) => {
      const r = a.closest(`.${H}`), o = r && r.matches(":hover");
      let d;
      e && o ? d = a.getAttribute("data-delete-hover") || "Rückgängig" : e ? d = a.getAttribute("data-delete-active") || "Wird entfernt" : d = a.getAttribute("data-delete-default") || "Entfernen", a.textContent = d;
    }), t.querySelectorAll(`.${H} i`).forEach((a) => {
      const r = a.closest(`.${H}`), o = r && r.matches(":hover");
      e ? o ? (a.classList.remove("hidden"), a.classList.add("ri-arrow-go-back-line"), a.classList.remove("ri-delete-bin-line")) : (a.classList.add("hidden"), a.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (a.classList.remove("hidden"), a.classList.add("ri-delete-bin-line"), a.classList.remove("ri-arrow-go-back-line"));
    });
    const s = t.querySelector('input[name="items_id[]"]'), n = s ? s.value.trim() : "";
    n && (e ? this._ensureRemovalInput(n) : this._removeRemovalInput(n)), t.querySelectorAll("[data-field]").forEach((a) => {
      a.disabled = e;
    });
  }
  _setRowMode(t, e) {
    const i = t.querySelector(`.${Kt}`), s = t.querySelector(`.${Wt}`);
    !i || !s || (e === "edit" ? (i.classList.add("hidden"), s.classList.remove("hidden")) : (i.classList.remove("hidden"), s.classList.add("hidden"), this._syncSummary(t)));
  }
  _captureAllOriginals() {
    this.querySelectorAll(`.${b}`).forEach((t) => {
      this._captureOriginalValues(t);
    });
  }
  _captureOriginalValues(t) {
    t.querySelectorAll("[data-field]").forEach((e) => {
      e.dataset.originalValue === void 0 && (e.dataset.originalValue = e.value ?? "");
    });
  }
  _resetToOriginal(t) {
    t.querySelectorAll("[data-field]").forEach((e) => {
      e.dataset.originalValue !== void 0 && (e.value = e.dataset.originalValue);
    }), this._syncSummary(t);
  }
  _refreshRowIds() {
    Array.from(this.querySelectorAll(`.${b}`)).forEach((e, i) => {
      this._assignRowFieldIds(e, i);
    });
  }
  _rowIndex(t) {
    return Array.from(this.querySelectorAll(`.${b}`)).indexOf(t);
  }
  _assignRowFieldIds(t, e) {
    e < 0 || t.querySelectorAll("[data-field-label]").forEach((i) => {
      const s = i.getAttribute("data-field-label");
      if (!s)
        return;
      const n = t.querySelector(`[data-field="${s}"]`);
      if (!n)
        return;
      const a = `${this._idPrefix}-${e}-${s}`;
      n.id = a, i.setAttribute("for", a);
    });
  }
  _syncAllSummaries() {
    this.querySelectorAll(`.${b}`).forEach((t) => {
      this._wireSummarySync(t), this._syncSummary(t), this._syncNewBadge(t);
    });
  }
  _wireSummarySync(t) {
    t.dataset.summaryBound !== "true" && (t.dataset.summaryBound = "true", t.querySelectorAll("[data-field]").forEach((e) => {
      e.addEventListener("input", () => this._syncSummary(t)), e.addEventListener("change", () => this._syncSummary(t));
    }));
  }
  _syncSummary(t) {
    t.querySelectorAll("[data-summary-field]").forEach((e) => {
      const i = e.getAttribute("data-summary-field");
      if (!i)
        return;
      const s = t.querySelector(`[data-field="${i}"]`);
      if (!s)
        return;
      const n = this._readFieldValue(s), a = e.getAttribute("data-summary-hide-empty") === "true" ? e.closest("[data-summary-container]") : null;
      n ? (this._setSummaryContent(e, n), e.classList.remove("text-gray-400"), a && a.classList.remove("hidden")) : (this._setSummaryContent(e, "—"), e.classList.add("text-gray-400"), a && a.classList.add("hidden"));
    }), this._syncNewBadge(t);
  }
  _syncNewBadge(t) {
    const e = t.querySelector('input[name="items_id[]"]'), i = e ? e.value.trim() : "";
    t.querySelectorAll("[data-new-badge]").forEach((s) => {
      s.classList.toggle("hidden", i !== "");
    });
  }
  _setSummaryContent(t, e) {
    const i = t.querySelector("[data-summary-link]");
    i ? e && e !== "—" ? (i.setAttribute("href", e), i.textContent = e) : (i.setAttribute("href", "#"), i.textContent = "—") : t.textContent = e || "—";
  }
  _readFieldValue(t) {
    if (t instanceof HTMLSelectElement) {
      if (t.multiple)
        return Array.from(t.selectedOptions).map((i) => i.textContent.trim()).filter(Boolean).join(", ");
      const e = t.selectedOptions[0];
      return e ? e.textContent.trim() : "";
    }
    return t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement ? t.value.trim() : "";
  }
  _ensureRemovalInput(t) {
    if (Array.from(this.querySelectorAll(`input[name="${Z}"]`)).some(
      (s) => s.value === t
    ))
      return;
    const i = document.createElement("input");
    i.type = "hidden", i.name = Z, i.value = t, this.appendChild(i);
  }
  _removeRemovalInput(t) {
    const e = Array.from(this.querySelectorAll(`input[name="${Z}"]`));
    for (const i of e)
      i.value === t && i.remove();
  }
}
const Gt = "ssr-wrapper", Oe = "ssr-input", Be = "ssr-list", Jt = "ssr-option", Qt = "ssr-option-name", Yt = "ssr-option-detail", Xt = "ssr-option-bio", Me = "ssr-hidden-input", $e = "ssr-clear-button", ee = 1, te = 10, Zt = 250;
class ei extends HTMLElement {
  constructor() {
    super(), this._endpoint = "", this._resultKey = "items", this._minChars = ee, this._limit = te, this._placeholder = "Search...", this._options = [], this._selected = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._listVisible = !1, this._boundHandleInput = this._handleInput.bind(this), this._boundHandleFocus = this._handleFocus.bind(this), this._boundHandleKeyDown = this._handleKeyDown.bind(this), this._boundHandleClear = this._handleClear.bind(this), this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }
  static get observedAttributes() {
    return ["data-endpoint", "data-result-key", "data-minchars", "data-limit", "placeholder", "name"];
  }
  connectedCallback() {
    this._render(), this._input = this.querySelector(`.${Oe}`), this._list = this.querySelector(`.${Be}`), this._hiddenInput = this.querySelector(`.${Me}`), this._clearButton = this.querySelector(`.${$e}`), this._endpoint = this.getAttribute("data-endpoint") || "", this._resultKey = this.getAttribute("data-result-key") || "items", this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), ee), this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), te), this._placeholder = this.getAttribute("placeholder") || "Search...", this._input && (this._input.placeholder = this._placeholder, this._input.addEventListener("input", this._boundHandleInput), this._input.addEventListener("focus", this._boundHandleFocus), this._input.addEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.addEventListener("click", this._boundHandleClear), document.addEventListener("click", this._boundHandleClickOutside);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleClickOutside), this._input && (this._input.removeEventListener("input", this._boundHandleInput), this._input.removeEventListener("focus", this._boundHandleFocus), this._input.removeEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.removeEventListener("click", this._boundHandleClear);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-endpoint" && (this._endpoint = i || ""), t === "data-result-key" && (this._resultKey = i || "items"), t === "data-minchars" && (this._minChars = this._parsePositiveInt(i, ee)), t === "data-limit" && (this._limit = this._parsePositiveInt(i, te)), t === "placeholder" && (this._placeholder = i || "Search...", this._input && (this._input.placeholder = this._placeholder)), t === "name" && this._hiddenInput && (this._hiddenInput.name = i || ""));
  }
  _handleInput(t) {
    const e = t.target.value.trim();
    if (this._selected = null, this._highlightedIndex = -1, this._syncHiddenInput(), e.length < this._minChars) {
      this._options = [], this._renderOptions(), this._hideList();
      return;
    }
    this._debouncedFetch(e);
  }
  _handleFocus() {
    this._options.length > 0 && this._showList();
  }
  _handleKeyDown(t) {
    if (t.key === "Escape") {
      this._hideList();
      return;
    }
    if (t.key === "ArrowDown") {
      t.preventDefault(), this._moveHighlight(1);
      return;
    }
    if (t.key === "ArrowUp") {
      t.preventDefault(), this._moveHighlight(-1);
      return;
    }
    if (t.key === "Home") {
      t.preventDefault(), this._setHighlight(0);
      return;
    }
    if (t.key === "End") {
      t.preventDefault(), this._setHighlight(this._options.length - 1);
      return;
    }
    if (t.key === "Enter") {
      if (this._options.length === 0)
        return;
      t.preventDefault();
      const e = this._highlightedIndex >= 0 ? this._highlightedIndex : 0;
      this._selectOption(this._options[e]);
    }
  }
  _handleClear(t) {
    t.preventDefault(), this._selected = null, this._options = [], this._input && (this._input.value = ""), this._syncHiddenInput(), this._renderOptions(), this._hideList(), this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: null } }));
  }
  _handleClickOutside(t) {
    this.contains(t.target) || this._hideList();
  }
  _debouncedFetch(t) {
    this._fetchTimeout && clearTimeout(this._fetchTimeout), this._fetchTimeout = setTimeout(() => {
      this._fetchOptions(t);
    }, Zt);
  }
  async _fetchOptions(t) {
    if (!this._endpoint)
      return;
    this._fetchController && this._fetchController.abort(), this.dispatchEvent(new CustomEvent("ssrbeforefetch", { bubbles: !0 })), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), this._limit > 0 && e.searchParams.set("limit", String(this._limit));
    try {
      const i = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!i.ok)
        return;
      const s = await i.json();
      let a = (Array.isArray(s == null ? void 0 : s[this._resultKey]) ? s[this._resultKey] : []).filter((r) => r && r.id && r.name);
      if (this._excludeIds && Array.isArray(this._excludeIds)) {
        const r = new Set(this._excludeIds);
        a = a.filter((o) => !r.has(o.id));
      }
      this._options = a, this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._renderOptions(), this._options.length > 0 ? this._showList() : this._hideList();
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError")
        return;
    }
  }
  _renderOptions() {
    this._list && (this._list.innerHTML = "", this._options.forEach((t) => {
      const e = document.createElement("button");
      e.type = "button", e.setAttribute("data-index", String(this._options.indexOf(t))), e.className = [
        Jt,
        "w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors"
      ].join(" ");
      const s = this._options.indexOf(t) === this._highlightedIndex;
      e.classList.toggle("bg-slate-100", s), e.classList.toggle("text-gray-900", s), e.setAttribute("aria-selected", s ? "true" : "false");
      const n = document.createElement("div");
      if (n.className = [Qt, "text-sm font-semibold text-gray-800"].join(" "), n.textContent = t.name, e.appendChild(n), t.detail) {
        const a = document.createElement("div");
        a.className = [Yt, "text-xs text-gray-600"].join(" "), a.textContent = t.detail, e.appendChild(a);
      }
      if (t.bio) {
        const a = document.createElement("div");
        a.className = [Xt, "text-xs text-gray-500"].join(" "), a.textContent = t.bio, e.appendChild(a);
      }
      e.addEventListener("click", () => {
        this._selectOption(t);
      }), this._list.appendChild(e);
    }));
  }
  _setHighlight(t) {
    if (this._options.length === 0) {
      this._highlightedIndex = -1;
      return;
    }
    const e = Math.max(0, Math.min(t, this._options.length - 1));
    this._highlightedIndex = e, this._renderOptions(), this._scrollHighlightedIntoView(), this._showList();
  }
  _moveHighlight(t) {
    if (this._options.length === 0) {
      this._highlightedIndex = -1;
      return;
    }
    const e = this._highlightedIndex >= 0 ? this._highlightedIndex : 0, i = Math.max(0, Math.min(e + t, this._options.length - 1));
    this._highlightedIndex = i, this._renderOptions(), this._scrollHighlightedIntoView(), this._showList();
  }
  _scrollHighlightedIntoView() {
    if (!this._list || this._highlightedIndex < 0)
      return;
    const t = this._list.querySelector(`[data-index="${this._highlightedIndex}"]`);
    t && t.scrollIntoView({ block: "nearest" });
  }
  _selectOption(t) {
    this._selected = t, this._input && (this._input.value = t.name || ""), this._syncHiddenInput(), this._hideList(), this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: t } })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  _syncHiddenInput() {
    var t;
    this._hiddenInput && (this._hiddenInput.value = ((t = this._selected) == null ? void 0 : t.id) || "");
  }
  _showList() {
    !this._list || this._listVisible || (this._list.classList.remove("hidden"), this._listVisible = !0);
  }
  _hideList() {
    !this._list || !this._listVisible || (this._list.classList.add("hidden"), this._listVisible = !1);
  }
  _parsePositiveInt(t, e) {
    const i = parseInt(t || "", 10);
    return Number.isNaN(i) || i <= 0 ? e : i;
  }
  _render() {
    const t = this.getAttribute("name") || "";
    this.innerHTML = `
			<div class="${Gt} relative">
				<div class="flex items-center gap-2">
					<input
						type="text"
						class="${Oe} inputinput w-full"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						spellcheck="false"
						placeholder="${this._placeholder}"
					/>
					<button type="button" class="${$e} text-sm text-gray-600 hover:text-gray-900">
						<i class="ri-close-line"></i>
					</button>
				</div>
				<input type="hidden" class="${Me}" name="${t}" value="" />
				<div class="${Be} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
			</div>
		`;
  }
}
const ti = "Bevorzugter Reihentitel";
class ii extends HTMLElement {
  constructor() {
    super(), this._pendingAgent = null, this._form = null, this._saveButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null, this._saveEndpoint = "", this._deleteEndpoint = "", this._isSaving = !1, this._handleSaveClick = this._handleSaveClick.bind(this), this._handleResetClick = this._handleResetClick.bind(this), this._handleDeleteClick = this._handleDeleteClick.bind(this), this._handleDeleteConfirmClick = this._handleDeleteConfirmClick.bind(this), this._handleDeleteCancelClick = this._handleDeleteCancelClick.bind(this);
  }
  connectedCallback() {
    setTimeout(() => {
      this._initForm(), this._initPlaces(), this._initSaveHandling();
    }, 0);
  }
  disconnectedCallback() {
    this._teardownSaveHandling();
  }
  _initForm() {
    console.log("AlmanachEditPage: _initForm called");
    const t = this.querySelector("#changealmanachform");
    console.log("Form found:", !!t, "FormLoad exists:", typeof window.FormLoad == "function"), t && typeof window.FormLoad == "function" ? window.FormLoad(t) : console.error("Cannot initialize form - form or FormLoad missing");
  }
  _parseJSONAttr(t, e) {
    if (!t)
      return null;
    const i = t.getAttribute(e);
    if (!i)
      return null;
    try {
      return JSON.parse(i);
    } catch {
      return null;
    }
  }
  _initPlaces() {
    var i;
    const t = this.querySelector("#places");
    if (!t)
      return;
    const e = () => {
      const s = this._parseJSONAttr(t, "data-initial-options") || [], n = this._parseJSONAttr(t, "data-initial-values") || [];
      s.length > 0 && typeof t.setOptions == "function" && t.setOptions(s), n.length > 0 && (t.value = n, typeof t.captureInitialSelection == "function" && t.captureInitialSelection());
    };
    if (typeof t.setOptions == "function") {
      e();
      return;
    }
    typeof ((i = window.customElements) == null ? void 0 : i.whenDefined) == "function" && window.customElements.whenDefined("multi-select-simple").then(() => {
      requestAnimationFrame(() => e());
    });
  }
  _initSaveHandling() {
    this._teardownSaveHandling(), this._form = this.querySelector("#changealmanachform"), this._saveButton = this.querySelector("[data-role='almanach-save']"), this._resetButton = this.querySelector("[data-role='almanach-reset']"), this._deleteButton = this.querySelector("[data-role='almanach-delete']"), this._deleteDialog = this.querySelector("[data-role='almanach-delete-dialog']"), this._deleteConfirmButton = this.querySelector("[data-role='almanach-delete-confirm']"), this._deleteCancelButton = this.querySelector("[data-role='almanach-delete-cancel']"), this._statusEl = this.querySelector("#almanach-save-feedback"), !(!this._form || !this._saveButton) && (this._saveEndpoint = this._form.getAttribute("data-save-endpoint") || this._deriveSaveEndpoint(), this._deleteEndpoint = this._form.getAttribute("data-delete-endpoint") || "", this._saveButton.addEventListener("click", this._handleSaveClick), this._resetButton && this._resetButton.addEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.addEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.addEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.addEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.addEventListener("cancel", this._handleDeleteCancelClick));
  }
  _teardownSaveHandling() {
    this._saveButton && this._saveButton.removeEventListener("click", this._handleSaveClick), this._resetButton && this._resetButton.removeEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.removeEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.removeEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.removeEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.removeEventListener("cancel", this._handleDeleteCancelClick), this._saveButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null;
  }
  _deriveSaveEndpoint() {
    var e;
    return (e = window == null ? void 0 : window.location) != null && e.pathname ? `${window.location.pathname.endsWith("/") ? window.location.pathname.slice(0, -1) : window.location.pathname}/save` : "/almanach/save";
  }
  async _handleSaveClick(t) {
    if (t.preventDefault(), this._isSaving)
      return;
    this._clearStatus();
    let e;
    try {
      e = this._buildPayload();
    } catch (i) {
      this._showStatus(i instanceof Error ? i.message : String(i), "error");
      return;
    }
    this._setSavingState(!0);
    try {
      const i = await fetch(this._saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(e)
      });
      let s = null;
      try {
        s = await i.clone().json();
      } catch {
        s = null;
      }
      if (!i.ok) {
        const n = (s == null ? void 0 : s.error) || `Speichern fehlgeschlagen (${i.status}).`;
        throw new Error(n);
      }
      if (s != null && s.redirect) {
        window.location.assign(s.redirect);
        return;
      }
      await this._reloadForm((s == null ? void 0 : s.message) || "Änderungen gespeichert."), this._clearStatus();
    } catch (i) {
      this._showStatus(i instanceof Error ? i.message : "Speichern fehlgeschlagen.", "error");
    } finally {
      this._setSavingState(!1);
    }
  }
  async _handleResetClick(t) {
    if (t.preventDefault(), !this._isSaving) {
      this._clearStatus();
      try {
        await this._reloadForm("");
      } catch (e) {
        this._showStatus(e instanceof Error ? e.message : "Formular konnte nicht aktualisiert werden.", "error");
      }
    }
  }
  async _handleDeleteClick(t) {
    t.preventDefault(), !this._isSaving && this._deleteDialog && typeof this._deleteDialog.showModal == "function" && this._deleteDialog.showModal();
  }
  _handleDeleteCancelClick(t) {
    t && t.preventDefault(), this._deleteDialog && this._deleteDialog.open && this._deleteDialog.close();
  }
  async _handleDeleteConfirmClick(t) {
    if (t.preventDefault(), !(!this._form || !this._deleteEndpoint || this._isSaving)) {
      this._deleteDialog && this._deleteDialog.open && this._deleteDialog.close(), this._clearStatus(), this._setSavingState(!0);
      try {
        const e = new FormData(this._form), i = {
          csrf_token: this._readValue(e, "csrf_token"),
          last_edited: this._readValue(e, "last_edited")
        }, s = await fetch(this._deleteEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(i)
        });
        let n = null;
        try {
          n = await s.clone().json();
        } catch {
          n = null;
        }
        if (!s.ok) {
          const r = (n == null ? void 0 : n.error) || `Löschen fehlgeschlagen (${s.status}).`;
          throw new Error(r);
        }
        const a = (n == null ? void 0 : n.redirect) || "/suche/baende";
        window.location.assign(a);
      } catch (e) {
        this._showStatus(e instanceof Error ? e.message : "Löschen fehlgeschlagen.", "error");
      } finally {
        this._setSavingState(!1);
      }
    }
  }
  _buildPayload() {
    if (!this._form)
      throw new Error("Formular konnte nicht gefunden werden.");
    const t = new FormData(this._form), e = {
      preferred_title: this._readValue(t, "preferred_title"),
      title: this._readValue(t, "title"),
      parallel_title: this._readValue(t, "paralleltitle"),
      subtitle: this._readValue(t, "subtitle"),
      variant_title: this._readValue(t, "varianttitle"),
      incipit: this._readValue(t, "incipit"),
      responsibility_statement: this._readValue(t, "responsibility_statement"),
      publication_statement: this._readValue(t, "publication_statement"),
      place_statement: this._readValue(t, "place_statement"),
      edition: this._readValue(t, "edition"),
      annotation: this._readValue(t, "annotation"),
      edit_comment: this._readValue(t, "edit_comment"),
      extent: this._readValue(t, "extent"),
      dimensions: this._readValue(t, "dimensions"),
      references: this._readValue(t, "refs"),
      status: this._readValue(t, "type")
    };
    if (!e.preferred_title)
      throw new Error("Kurztitel ist erforderlich.");
    const i = this._readValue(t, "year");
    if (i === "")
      throw new Error("Jahr muss angegeben werden (0 ist erlaubt).");
    const s = Number.parseInt(i, 10);
    if (Number.isNaN(s))
      throw new Error("Jahr ist ungültig.");
    e.year = s;
    const n = t.getAll("languages[]").map((p) => p.trim()).filter(Boolean), a = t.getAll("places[]").map((p) => p.trim()).filter(Boolean), { items: r, removedIds: o } = this._collectItems(t), {
      relations: d,
      deleted: c
    } = this._collectRelations(t, {
      prefix: "entries_series",
      targetField: "series"
    }), h = this._collectNewRelations("entries_series"), m = [...d, ...h].filter(
      (p) => p.type === ti
    ).length;
    if (m === 0)
      throw new Error("Mindestens ein bevorzugter Reihentitel muss verknüpft sein.");
    if (m > 1)
      throw new Error("Es darf nur ein bevorzugter Reihentitel gesetzt sein.");
    const {
      relations: u,
      deleted: _
    } = this._collectRelations(t, {
      prefix: "entries_agents",
      targetField: "agent"
    }), E = this._collectNewRelations("entries_agents"), S = [...d, ...h].map((p) => p.target_id);
    if (S.filter((p, B) => S.indexOf(p) !== B).length > 0)
      throw new Error("Doppelte Reihenverknüpfungen sind nicht erlaubt.");
    return {
      csrf_token: this._readValue(t, "csrf_token"),
      last_edited: this._readValue(t, "last_edited"),
      entry: e,
      languages: n,
      places: a,
      items: r,
      deleted_item_ids: o,
      series_relations: d,
      new_series_relations: h,
      deleted_series_relation_ids: c,
      agent_relations: u,
      new_agent_relations: E,
      deleted_agent_relation_ids: _
    };
  }
  _collectItems(t) {
    const e = t.getAll("items_id[]").map((h) => h.trim()), i = t.getAll("items_owner[]"), s = t.getAll("items_identifier[]"), n = t.getAll("items_location[]"), a = t.getAll("items_media[]"), r = t.getAll("items_annotation[]"), o = t.getAll("items_uri[]"), d = new Set(
      t.getAll("items_removed[]").map((h) => h.trim()).filter(Boolean)
    ), c = [];
    for (let h = 0; h < e.length; h += 1) {
      const m = e[h] || "";
      if (m && d.has(m))
        continue;
      const u = (i[h] || "").trim(), _ = (s[h] || "").trim(), E = (n[h] || "").trim(), L = (r[h] || "").trim(), S = (o[h] || "").trim(), v = (a[h] || "").trim();
      (m || u || _ || E || L || S || v) && c.push({
        id: m,
        owner: u,
        identifier: _,
        location: E,
        annotation: L,
        uri: S,
        media: v ? [v] : []
      });
    }
    return {
      items: c,
      removedIds: Array.from(d)
    };
  }
  _collectRelations(t, { prefix: e, targetField: i }) {
    const s = [], n = [];
    for (const [a, r] of t.entries()) {
      if (!a.startsWith(`${e}_id[`))
        continue;
      const o = a.slice(a.indexOf("[") + 1, -1), d = `${e}_${i}[${o}]`, c = `${e}_type[${o}]`, h = `${e}_delete[${o}]`, m = `${e}_uncertain[${o}]`, u = (r || "").trim(), _ = (t.get(d) || "").trim();
      if (!_ || !u)
        continue;
      if (t.has(h)) {
        n.push(u);
        continue;
      }
      const E = (t.get(c) || "").trim();
      s.push({
        id: u,
        target_id: _,
        type: E,
        uncertain: t.has(m)
      });
    }
    return { relations: s, deleted: n };
  }
  _collectNewRelations(t) {
    const e = this.querySelector(`relations-editor[data-prefix='${t}']`);
    if (!e)
      return [];
    const i = e.querySelectorAll("[data-role='relation-add-row'] [data-rel-row]"), s = [];
    return i.forEach((n) => {
      const a = n.querySelector(`input[name='${t}_new_id']`), r = n.querySelector(`select[name='${t}_new_type']`), o = n.querySelector(`input[name='${t}_new_uncertain']`);
      if (!a)
        return;
      const d = a.value.trim();
      d && s.push({
        target_id: d,
        type: ((r == null ? void 0 : r.value) || "").trim(),
        uncertain: !!(o != null && o.checked)
      });
    }), s;
  }
  _readValue(t, e) {
    const i = t.get(e);
    return i ? String(i).trim() : "";
  }
  _setSavingState(t) {
    if (this._isSaving = t, !this._saveButton)
      return;
    this._saveButton.disabled = t;
    const e = this._saveButton.querySelector("span");
    e && (e.textContent = t ? "Speichern..." : "Speichern"), this._resetButton && (this._resetButton.disabled = t), this._deleteButton && (this._deleteButton.disabled = t);
  }
  _clearStatus() {
    this._statusEl && (this._statusEl.textContent = "", this._statusEl.classList.remove("text-red-700", "text-green-700"));
  }
  _showStatus(t, e) {
    this._statusEl && (this._clearStatus(), this._statusEl.textContent = t, e === "success" ? this._statusEl.classList.add("text-green-700") : e === "error" && this._statusEl.classList.add("text-red-700"));
  }
  async _reloadForm(t) {
    this._teardownSaveHandling();
    const e = new URL(window.location.href);
    t ? e.searchParams.set("saved_message", t) : e.searchParams.delete("saved_message");
    const i = await fetch(e.toString(), {
      headers: {
        "X-Requested-With": "fetch"
      }
    });
    if (!i.ok)
      throw new Error("Formular konnte nicht aktualisiert werden.");
    const s = await i.text(), a = new DOMParser().parseFromString(s, "text/html"), r = a.querySelector("#changealmanachform"), o = this.querySelector("#changealmanachform");
    if (!r || !o)
      throw new Error("Formular konnte nicht geladen werden.");
    o.replaceWith(r), this._form = r;
    const d = a.querySelector("#user-message"), c = this.querySelector("#user-message");
    d && c && c.replaceWith(d);
    const h = a.querySelector("#almanach-header-data"), m = this.querySelector("#almanach-header-data");
    h && m && m.replaceWith(h), this._initForm(), this._initPlaces(), this._initSaveHandling(), typeof window.TextareaAutoResize == "function" && setTimeout(() => {
      this.querySelectorAll("textarea").forEach((u) => {
        window.TextareaAutoResize(u);
      });
    }, 100);
  }
}
const si = "[data-role='relation-add-toggle']", ni = "[data-role='relation-add-panel']", ai = "[data-role='relation-add-close']", li = "[data-role='relation-add-apply']", ri = "[data-role='relation-add-error']", oi = "[data-role='relation-add-row']", di = "[data-role='relation-add-select']", hi = "[data-role='relation-type-select']", ci = "[data-role='relation-uncertain']", ui = "template[data-role='relation-new-template']", mi = "[data-role='relation-new-delete']", k = "[data-rel-row]";
class _i extends HTMLElement {
  constructor() {
    super(), this._pendingItem = null, this._pendingApply = !1;
  }
  connectedCallback() {
    this._prefix = this.getAttribute("data-prefix") || "", this._linkBase = this.getAttribute("data-link-base") || "", this._newLabel = this.getAttribute("data-new-label") || "(Neu)", this._addToggleId = this.getAttribute("data-add-toggle-id") || "", this._preferredLabel = (this.getAttribute("data-preferred-label") || "").trim(), this._emptyText = this.querySelector(".rel-empty-text"), this._setupAddPanel(), this._setupDeleteToggles(), this._setupPreferredOptionHandling();
  }
  _getExistingIds() {
    const t = /* @__PURE__ */ new Set(), e = this._prefix === "entries_series" ? "series" : "agent";
    return this.querySelectorAll(`input[name^="${this._prefix}_${e}["]`).forEach((i) => {
      const s = i.value.trim();
      s && t.add(s);
    }), this._addRow && this._addRow.querySelectorAll(`input[name="${this._prefix}_new_id"]`).forEach((i) => {
      const s = i.value.trim();
      s && t.add(s);
    }), t;
  }
  _updateEmptyTextVisibility() {
    if (!this._emptyText)
      return;
    const t = this._prefix === "entries_series" ? "series" : "agent", e = this.querySelectorAll(`input[name^="${this._prefix}_${t}["]`).length > 0, i = this._addRow && this._addRow.querySelectorAll(`input[name="${this._prefix}_new_id"]`).length > 0;
    this._addPanel && !this._addPanel.classList.contains("hidden") || e || i ? this._emptyText.classList.add("hidden") : this._emptyText.classList.remove("hidden");
  }
  _setupAddPanel() {
    if (this._addToggle = this.querySelector(si), this._addToggleId) {
      const t = document.getElementById(this._addToggleId);
      t && (this._addToggle = t);
    }
    this._addPanel = this.querySelector(ni), this._addClose = this.querySelector(ai), this._addApply = this.querySelector(li), this._addError = this.querySelector(ri), this._addRow = this.querySelector(oi), this._addSelect = this.querySelector(di), this._typeSelect = this.querySelector(hi), this._uncertain = this.querySelector(ci), this._template = this.querySelector(ui), this._addInput = this._addSelect ? this._addSelect.querySelector(".ssr-input") : null, !(!this._addPanel || !this._addRow || !this._addSelect || !this._typeSelect || !this._uncertain || !this._template) && (this._addSelect && this._prefix === "entries_series" && this._addSelect.addEventListener("ssrbeforefetch", () => {
      this._addSelect._excludeIds = Array.from(this._getExistingIds());
    }), this._addToggle && this._addToggle.addEventListener("click", () => {
      this._addPanel.classList.toggle("hidden"), this._updateEmptyTextVisibility();
    }), this._addClose && this._addClose.addEventListener("click", () => {
      this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility();
    }), this._addInput && this._addInput.addEventListener("keydown", (t) => {
      t.key === "Enter" && (this._pendingApply = !0);
    }), this._addApply && this._addApply.addEventListener("click", () => {
      this._pendingApply = !1;
      const t = this._addPanel.querySelector(`input[name='${this._prefix}_new_id']`);
      if (!(t && t.value.trim().length > 0)) {
        this._addError && (this._addError.textContent = this._addError.getAttribute("data-error-empty") || "Bitte Reihe auswählen.", this._addError.classList.remove("hidden"));
        return;
      }
      if (this._pendingItem) {
        if (this._prefix === "entries_series" && this._getExistingIds().has(this._pendingItem.id)) {
          this._addError && (this._addError.textContent = this._addError.getAttribute("data-error-duplicate") || "Diese Verknüpfung existiert bereits.", this._addError.classList.remove("hidden"));
          return;
        }
        this._addError && this._addError.classList.add("hidden"), this._insertNewRow();
      }
    }), this._addSelect.addEventListener("ssrchange", (t) => {
      var e;
      this._pendingItem = ((e = t.detail) == null ? void 0 : e.item) || null, this._pendingItem && this._addError && this._addError.classList.add("hidden"), this._pendingApply && this._pendingItem && this._addApply && (this._pendingApply = !1, this._addApply.click());
    }));
  }
  _clearAddPanel() {
    if (this._addSelect) {
      const t = this._addSelect.querySelector(".ssr-clear-button");
      t && t.click();
    }
    this._typeSelect && (this._typeSelect.selectedIndex = 0), this._uncertain && (this._uncertain.checked = !1), this._addError && this._addError.classList.add("hidden");
  }
  _insertNewRow() {
    const t = this._template.content.cloneNode(!0);
    if (!(t.querySelector(k) || t.firstElementChild))
      return;
    const i = t.querySelector("[data-rel-link]");
    i && i.setAttribute("href", `${this._linkBase}${this._pendingItem.id}`);
    const s = t.querySelector("[data-rel-name]");
    s && (s.textContent = this._pendingItem.name || "");
    const n = t.querySelector("[data-rel-detail]"), a = t.querySelector("[data-rel-detail-container]"), r = this._pendingItem.detail || this._pendingItem.bio || "";
    n && r ? n.textContent = r : a && a.remove();
    const o = t.querySelector("[data-rel-new]");
    o && (o.textContent = this._newLabel);
    const d = t.querySelector("[data-rel-input='type']");
    d && this._typeSelect && (d.innerHTML = this._typeSelect.innerHTML, d.value = this._typeSelect.value, d.name = `${this._prefix}_new_type`, d.addEventListener("change", () => this._updatePreferredOptions()));
    const c = t.querySelector("[data-rel-input='uncertain']");
    if (c && this._uncertain) {
      c.checked = this._uncertain.checked, c.name = `${this._prefix}_new_uncertain`;
      const u = `${this._prefix}_new_uncertain_row`;
      c.id = u;
      const _ = t.querySelector("[data-rel-uncertain-label]");
      _ && _.setAttribute("for", u);
    }
    const h = t.querySelector("[data-rel-input='id']");
    h && (h.name = `${this._prefix}_new_id`, h.value = this._pendingItem.id);
    const m = t.querySelector(mi);
    m && m.addEventListener("click", () => {
      this._addRow.innerHTML = "", this._pendingItem = null, this._clearAddPanel(), this._addPanel && this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility();
    }), this._addRow.innerHTML = "", this._addRow.appendChild(t), this._pendingItem = null, this._clearAddPanel(), this._addPanel && this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility(), this._updatePreferredOptions();
  }
  _setupDeleteToggles() {
    this.querySelectorAll("[data-delete-toggle]").forEach((t) => {
      t.addEventListener("click", () => {
        const e = t.getAttribute("data-delete-toggle"), i = this.querySelector(`#${CSS.escape(e)}`);
        if (!i)
          return;
        i.checked = !i.checked;
        const s = t.closest(k);
        s && (s.classList.toggle("bg-red-50", i.checked), s.querySelectorAll("select, input[type='checkbox']").forEach((o) => {
          o !== i && (o.disabled = i.checked);
        }));
        const n = t.matches(":hover"), a = t.querySelector("[data-delete-label]");
        if (a) {
          let o;
          i.checked && n ? o = a.getAttribute("data-delete-hover") || "Rückgängig" : i.checked ? o = a.getAttribute("data-delete-active") || "Wird entfernt" : o = a.getAttribute("data-delete-default") || "Entfernen", a.textContent = o;
        }
        const r = t.querySelector("i");
        r && (i.checked ? n ? (r.classList.remove("hidden"), r.classList.add("ri-arrow-go-back-line"), r.classList.remove("ri-delete-bin-line")) : (r.classList.add("hidden"), r.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (r.classList.remove("hidden"), r.classList.add("ri-delete-bin-line"), r.classList.remove("ri-arrow-go-back-line"))), this._updatePreferredOptions();
      }), t.addEventListener("mouseenter", () => {
        const e = t.getAttribute("data-delete-toggle"), i = this.querySelector(`#${CSS.escape(e)}`);
        if (!i || !i.checked)
          return;
        const s = t.querySelector("[data-delete-label]");
        s && (s.textContent = s.getAttribute("data-delete-hover") || "Rückgängig");
        const n = t.querySelector("i");
        n && (n.classList.remove("hidden"), n.classList.add("ri-arrow-go-back-line"), n.classList.remove("ri-delete-bin-line"));
      }), t.addEventListener("mouseleave", () => {
        const e = t.getAttribute("data-delete-toggle"), i = this.querySelector(`#${CSS.escape(e)}`), s = t.querySelector("[data-delete-label]");
        if (!s)
          return;
        i && i.checked ? s.textContent = s.getAttribute("data-delete-active") || "Wird entfernt" : s.textContent = s.getAttribute("data-delete-default") || "Entfernen";
        const n = t.querySelector("i");
        n && (i && i.checked ? (n.classList.add("hidden"), n.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (n.classList.remove("hidden"), n.classList.add("ri-delete-bin-line"), n.classList.remove("ri-arrow-go-back-line")));
      });
    });
  }
  _setupPreferredOptionHandling() {
    this._prefix !== "entries_series" || !this._preferredLabel || (this.querySelectorAll(`select[name^="${this._prefix}_type["]`).forEach((t) => {
      t.addEventListener("change", () => this._updatePreferredOptions());
    }), this._typeSelect && this._typeSelect.addEventListener("change", () => this._updatePreferredOptions()), this._updatePreferredOptions());
  }
  _updatePreferredOptions() {
    if (this._prefix !== "entries_series" || !this._preferredLabel)
      return;
    const t = this._preferredLabel.trim(), e = [];
    this.querySelectorAll(`select[name^="${this._prefix}_type["]`).forEach((s) => {
      e.push({ select: s, row: s.closest(k), isAddPanel: !1 });
    }), this._addRow && this._addRow.querySelectorAll(`select[name='${this._prefix}_new_type']`).forEach((s) => {
      e.push({ select: s, row: s.closest(k), isAddPanel: !1 });
    }), this._typeSelect && e.push({ select: this._typeSelect, row: this._typeSelect.closest(k), isAddPanel: !0 });
    const i = e.some(({ select: s, row: n, isAddPanel: a }) => {
      if (a)
        return !1;
      const r = ((s == null ? void 0 : s.value) || "").trim();
      if (!s || r !== t)
        return !1;
      if (!n)
        return !0;
      const o = n.querySelector(`input[name^="${this._prefix}_delete["]`);
      return !(o && o.checked);
    });
    e.forEach(({ select: s, row: n, isAddPanel: a }) => {
      if (!s)
        return;
      const r = Array.from(s.options).find((u) => u.value.trim() === t);
      if (!r)
        return;
      const o = n ? n.querySelector(`input[name^="${this._prefix}_delete["]`) : null, d = !!(o && o.checked), c = (s.value || "").trim(), h = !i || c === t && !d;
      if (a && i && c === t) {
        const u = Array.from(s.options).find((_) => _.value.trim() !== t);
        u && (s.value = u.value);
      }
      const m = !h || a && i;
      r.hidden = m, r.disabled = m, r.style.display = m ? "none" : "";
    });
  }
}
class pi extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      const t = this.querySelector("form");
      t && typeof window.FormLoad == "function" && window.FormLoad(t), this._setupDelete();
    }, 0);
  }
  _setupDelete() {
    const t = this.querySelector("form");
    if (!t)
      return;
    const e = t.getAttribute("data-delete-endpoint");
    if (!e)
      return;
    const i = this.querySelector("[data-role='edit-delete-dialog']"), s = this.querySelector("[data-role='edit-delete']"), n = this.querySelector("[data-role='edit-delete-confirm']"), a = this.querySelector("[data-role='edit-delete-cancel']");
    if (!i || !s || !n || !a)
      return;
    s.addEventListener("click", (o) => {
      o.preventDefault(), typeof i.showModal == "function" && i.showModal();
    });
    const r = (o) => {
      o && o.preventDefault(), i.open && i.close();
    };
    a.addEventListener("click", r), i.addEventListener("cancel", r), n.addEventListener("click", async (o) => {
      o.preventDefault(), r();
      const d = new FormData(t), c = {
        csrf_token: d.get("csrf_token") || "",
        last_edited: d.get("last_edited") || ""
      }, h = await fetch(e, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(c)
      });
      if (!h.ok)
        return;
      const m = await h.json().catch(() => null), u = (m == null ? void 0 : m.redirect) || "/";
      window.location.assign(u);
    });
  }
}
class fi extends HTMLElement {
  constructor() {
    super(), this.state = null, this.handleClick = this.handleClick.bind(this), this.handleClickAway = this.handleClickAway.bind(this), this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  connectedCallback() {
    const t = this.getAttribute("data-user-name") || "Benutzer", e = this.getAttribute("data-user-email") || "", i = this.getAttribute("data-user-id") || "", s = this.getAttribute("data-is-admin-or-editor") === "true", n = this.getAttribute("data-is-admin") === "true", a = this.getAttribute("data-redirect-path") || "", r = window.location.pathname;
    let o = !1, d = "", c = "", h = !1, m = "", u = !1, _ = "", E = "";
    const L = r.match(/^\/reihe\/([^\/]+)\/?$/);
    if (L && L[1] !== "new") {
      o = !0, d = L[1];
      const f = document.querySelector('meta[name="entity-updated"]');
      f && (c = f.content);
    }
    const S = r.match(/^\/person\/([^\/]+)\/?$/);
    S && S[1] !== "new" && (h = !0, m = S[1]);
    const v = r.match(/^\/almanach\/([^\/]+)\/?$/);
    if (v && v[1] !== "new") {
      u = !0, _ = v[1];
      const f = document.querySelector('meta[name="entity-updated"]');
      f && (E = f.content);
    }
    let p = "";
    const B = document.querySelector('input[name="csrf_token"]');
    B && (p = B.value);
    const M = p !== "";
    this.hasContext = o || h || u;
    let C = "";
    if (o) {
      const f = M ? `
				<button data-action="delete-reihe" data-id="${d}" class="w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-left">
					<i class="ri-delete-bin-line text-base text-red-600 mr-2.5"></i>
					<span class="text-red-600">Löschen</span>
				</button>
			` : "";
      C = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihe
				</div>
				<a href="/reihe/${d}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				${f}
			`;
    } else if (h)
      C = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Person
				</div>
				<a href="/person/${m}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			`;
    else if (u) {
      const f = M ? `
				<button data-action="delete-almanach" data-id="${_}" class="w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-left">
					<i class="ri-delete-bin-line text-base text-red-600 mr-2.5"></i>
					<span class="text-red-600">Löschen</span>
				</button>
			` : "";
      C = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Almanach
				</div>
				<a href="/almanach/${_}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				${f}
			`;
    }
    const Ve = s ? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Erstellen
			</div>
			<a href="/almanach-new/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
				<i class="ri-book-line text-base text-gray-700 mr-2.5"></i>
				<span class="text-gray-900">Neuer Band</span>
			</a>
			<a href="/reihen/new/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
				<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
				<span class="text-gray-900">Neue Reihe</span>
			</a>
			<a href="/orte/new/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
				<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
				<span class="text-gray-900">Neuer Ort</span>
			</a>
			<a href="/personen/new/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
				<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
				<span class="text-gray-900">Neue Person</span>
			</a>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", Ue = n ? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Administration
			</div>
			<a href="/user/management/access/User?redirectTo=${a}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
				<i class="ri-group-3-line text-base text-gray-700 mr-2.5"></i>
				<span class="text-gray-900">Nutzer einladen</span>
			</a>
			<a href="/user/management?redirectTo=${a}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
				<i class="ri-group-2-line text-base text-gray-700 mr-2.5"></i>
				<span class="text-gray-900">Benutzerverwaltung</span>
			</a>
			<div class="border-t border-gray-200 my-1"></div>
		` : "";
    let U = "";
    o && M && (U += `
				<div class="fab-delete-dialog hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-dialog="reihe">
					<div class="bg-white rounded-lg p-6 max-w-md mx-4">
						<h3 class="text-lg font-semibold mb-4">Reihe löschen?</h3>
						<p class="text-gray-700 mb-6">Möchten Sie diese Reihe wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
						<div class="flex gap-3 justify-end">
							<button data-action="cancel-delete" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
								Abbrechen
							</button>
							<form method="POST" action="/reihe/${d}/edit/delete">
								<input type="hidden" name="csrf_token" value="${p}">
								<input type="hidden" name="last_edited" value="${c}">
								<button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
									Löschen
								</button>
							</form>
						</div>
					</div>
				</div>
			`), u && M && (U += `
				<div class="fab-delete-dialog hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-dialog="almanach">
					<div class="bg-white rounded-lg p-6 max-w-md mx-4">
						<h3 class="text-lg font-semibold mb-4">Almanach-Eintrag löschen?</h3>
						<p class="text-gray-700 mb-6">Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
						<div class="flex gap-3 justify-end">
							<button data-action="cancel-delete" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
								Abbrechen
							</button>
							<form method="POST" action="/almanach/${_}/edit/delete">
								<input type="hidden" name="csrf_token" value="${p}">
								<input type="hidden" name="last_edited" value="${E}">
								<button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
									Löschen
								</button>
							</form>
						</div>
					</div>
				</div>
			`);
    const ze = C || "", Ke = C ? '<div class="border-t border-gray-200"></div>' : "";
    this.innerHTML = `
			<div class="fixed bottom-12 left-8 z-50">
				<!-- Unified Menu Container -->
				<div class="fab-menu hidden absolute bottom-16 left-0 w-64 bg-white rounded border border-gray-300 shadow transition-all duration-200 ease-out">
					<!-- Contextual actions (always at top when present) -->
					${ze}
					${Ke}

					<!-- Rest of menu (hidden in half state, shown in full state) -->
					<div class="fab-full-content overflow-hidden transition-all duration-300 ease-in-out" style="max-height: 0; opacity: 0;">
						${Ve}
						${Ue}
						<div class="px-4 py-2">
							<div class="font-semibold text-gray-900 text-sm">${t}</div>
							<div class="text-xs text-gray-600 truncate">${e}</div>
						</div>
						<a href="/user/${i}/edit?redirectTo=${encodeURIComponent(window.location.href)}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-user-3-line text-base text-gray-700 mr-2.5"></i>
							<span class="text-gray-900">Profil bearbeiten</span>
						</a>
						<a href="/logout?redirectTo=${a}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-logout-box-line text-base text-gray-700 mr-2.5 mb-1"></i>
							<span class="text-gray-900">Logout</span>
						</a>
					</div>
				</div>

				<!-- FAB Button -->
				<button class="fab-button w-12 h-12 bg-slate-700 hover:bg-slate-800 text-white rounded border-2 border-slate-600 shadow-sm transition-all duration-200 flex items-center justify-center" aria-label="Menü">
					<i class="fab-icon text-2xl transition-all duration-200 ri-menu-line"></i>
				</button>

				${U}
			</div>
		`, this._button = this.querySelector(".fab-button"), this._icon = this.querySelector(".fab-icon"), this._menu = this.querySelector(".fab-menu"), this._fullContent = this.querySelector(".fab-full-content"), this.state = this.hasContext ? "half" : "closed", this.setState(this.state), this._button.addEventListener("click", this.handleClick), document.addEventListener("click", this.handleClickAway), this.querySelectorAll('[data-action^="delete-"]').forEach((f) => {
      f.addEventListener("click", this.handleDeleteClick);
    }), this.querySelectorAll('[data-action="cancel-delete"]').forEach((f) => {
      f.addEventListener("click", () => {
        this.closeAllDialogs();
      });
    });
  }
  disconnectedCallback() {
    this._button.removeEventListener("click", this.handleClick), document.removeEventListener("click", this.handleClickAway);
  }
  handleClick(t) {
    t.stopPropagation(), this.nextState();
  }
  handleClickAway(t) {
    this.contains(t.target) || this.setState("closed");
  }
  handleDeleteClick(t) {
    const i = t.currentTarget.getAttribute("data-action").replace("delete-", ""), s = this.querySelector(`[data-dialog="${i}"]`);
    s && s.classList.remove("hidden");
  }
  closeAllDialogs() {
    this.querySelectorAll(".fab-delete-dialog").forEach((e) => e.classList.add("hidden"));
  }
  nextState() {
    this.state === "closed" ? this.setState(this.hasContext ? "half" : "full") : this.state === "half" ? this.setState("full") : this.setState("closed");
  }
  setState(t) {
    if (this.state = t, t === "closed")
      this._menu.style.opacity = "0", this._menu.style.transform = "translateY(8px)", this._fullContent.style.maxHeight = "0", this._fullContent.style.opacity = "0", setTimeout(() => {
        this.state === "closed" && this._menu.classList.add("hidden");
      }, 200), this._icon.classList.remove("ri-arrow-up-s-line", "ri-close-line"), this._icon.classList.add("ri-menu-line"), this._button.style.backgroundColor = "", this._button.style.borderColor = "", this._button.classList.remove("shadow-md"), this._button.classList.add("shadow-sm");
    else if (t === "half")
      this._menu.classList.remove("hidden"), this._menu.offsetHeight, this._menu.style.opacity = "1", this._menu.style.transform = "translateY(0)", this._fullContent.style.maxHeight = "0", this._fullContent.style.opacity = "0", this._icon.classList.remove("ri-menu-line", "ri-close-line"), this._icon.classList.add("ri-arrow-up-s-line"), this._button.style.backgroundColor = "rgb(51 65 85)", this._button.style.borderColor = "rgb(71 85 105)", this._button.classList.remove("shadow-sm"), this._button.classList.add("shadow-md");
    else if (t === "full") {
      this._menu.classList.remove("hidden"), this._menu.style.opacity = "1", this._menu.style.transform = "translateY(0)", this._fullContent.style.maxHeight = "none";
      const e = this._fullContent.scrollHeight;
      this._fullContent.style.maxHeight = "0", this._fullContent.offsetHeight, this._fullContent.style.maxHeight = e + "px", this._fullContent.style.opacity = "1", this._icon.classList.remove("ri-menu-line", "ri-arrow-up-s-line"), this._icon.classList.add("ri-close-line"), this._button.style.backgroundColor = "rgb(30 41 59)", this._button.style.borderColor = "rgb(51 65 85)", this._button.classList.remove("shadow-sm"), this._button.classList.add("shadow-md");
    }
  }
}
const gi = "filter-list", bi = "fab-menu", Ei = "scroll-button", Si = "tool-tip", vi = "abbrev-tooltips", Li = "int-link", yi = "popup-image", Ai = "tab-list", Ci = "filter-pill", Ii = "image-reel", xi = "multi-select-places", wi = "multi-select-simple", Ti = "single-select-remote", Pe = "reset-button", ki = "div-manager", Ri = "items-editor", Oi = "almanach-edit-page", Bi = "relations-editor", Mi = "edit-page";
customElements.define(Li, it);
customElements.define(vi, R);
customElements.define(gi, Ye);
customElements.define(Ei, Xe);
customElements.define(Si, Ze);
customElements.define(yi, et);
customElements.define(Ai, tt);
customElements.define(Ci, Ge);
customElements.define(Ii, st);
customElements.define(xi, Ne);
customElements.define(wi, De);
customElements.define(Ti, ei);
customElements.define(Pe, Mt);
customElements.define(ki, qt);
customElements.define(Ri, jt);
customElements.define(Oi, ii);
customElements.define(Bi, _i);
customElements.define(Mi, pi);
customElements.define(bi, fi);
function $i() {
  const l = window.location.pathname, t = window.location.search, e = l + t;
  return encodeURIComponent(e);
}
function Ni(l = 5e3, t = 100) {
  return new Promise((e, i) => {
    let s = 0;
    const n = setInterval(() => {
      typeof window.QRCode == "function" ? (clearInterval(n), e(window.QRCode)) : (s += t, s >= l && (clearInterval(n), console.error("Timed out waiting for QRCode to become available."), i(new Error("QRCode not available after " + l + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."))));
    }, t);
  });
}
async function Di(l) {
  const t = await Ni(), e = document.getElementById("qr");
  e && (e.innerHTML = "", e.classList.add("hidden"), new t(e, {
    text: l,
    width: 1280,
    height: 1280,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: t.CorrectLevel.H
  }), setTimeout(() => {
    e.classList.remove("hidden");
  }, 20));
}
function qi(l) {
  l && (l.addEventListener("focus", (t) => {
    t.preventDefault(), l.select();
  }), l.addEventListener("mousedown", (t) => {
    t.preventDefault(), l.select();
  }), l.addEventListener("mouseup", (t) => {
    t.preventDefault(), l.select();
  })), l && (l.addEventListener("focus", () => {
    l.select();
  }), l.addEventListener("click", () => {
    l.select();
  }));
}
function Pi() {
  document.body.addEventListener("htmx:responseError", function(l) {
    const t = l.detail.requestConfig;
    if (t.boosted) {
      document.body.innerHTML = l.detail.xhr.responseText;
      const e = l.detail.xhr.responseURL || t.url;
      window.history.pushState(null, "", e);
    }
  });
}
function Hi(l, t) {
  if (!(l instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof t != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const e = l.querySelectorAll(Pe);
  l.addEventListener("rbichange", (i) => {
    for (const s of e)
      if (s.isCurrentlyModified()) {
        t(i.details, !0);
        return;
      }
    t(i.details, !1);
  });
}
let I = null;
function He() {
  return I !== null || (typeof CSS < "u" && typeof CSS.supports == "function" ? I = CSS.supports("field-sizing", "content") : I = !1, console.log("Browser supports field-sizing:", I)), I;
}
function A(l) {
  if (console.log("TextareaAutoResize called for:", l.name || l.id), !(l instanceof HTMLTextAreaElement)) {
    console.log("Not a textarea element");
    return;
  }
  if (l.offsetParent === null) {
    console.log("Textarea not visible");
    return;
  }
  l.removeAttribute("rows"), l.style.overflow = "auto";
  const e = l.name === "annotation" ? 76 : 38;
  if (l.value.trim() === "") {
    l.style.height = e + "px", console.log("Empty textarea, setting height to:", e + "px");
    return;
  }
  l.style.height = "1px";
  const i = l.scrollHeight, s = Math.max(i, e) + "px";
  console.log("Setting height to:", s), l.style.height = s;
}
function Fe(l) {
  l.key === "Enter" && l.preventDefault();
}
function Fi(l) {
  if (!(l instanceof HTMLTextAreaElement)) {
    console.warn("HookupTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  He() || l.addEventListener("input", () => {
    A(l);
  });
}
function Vi(l) {
  if (!(l instanceof HTMLTextAreaElement)) {
    console.warn("DisconnectTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  l.removeEventListener("input", () => {
    A(l);
  });
}
function Ui(l) {
  !(l instanceof HTMLTextAreaElement) && l.classList.contains("no-enter") || l.addEventListener("keydown", Fe);
}
function zi(l) {
  !(l instanceof HTMLTextAreaElement) && l.classList.contains("no-enter") || l.removeEventListener("keydown", Fe);
}
function Ki(l, t) {
  const e = !He();
  for (const i of l)
    if (i.type === "childList") {
      for (const s of i.addedNodes)
        s.nodeType === Node.ELEMENT_NODE && s.matches("textarea") && e && (Fi(s), A(s));
      for (const s of i.removedNodes)
        s.nodeType === Node.ELEMENT_NODE && s.matches("textarea") && (zi(s), e && Vi(s));
    }
}
function Wi(l) {
  if (console.log("=== FormLoad CALLED ==="), !(l instanceof HTMLFormElement)) {
    console.warn("FormLoad: Provided element is not a form.");
    return;
  }
  const t = document.querySelectorAll("textarea");
  console.log("Found", t.length, "textareas");
  for (const n of t)
    console.log("Attaching input listener to:", n.name || n.id), n.addEventListener("input", function() {
      console.log("Input event on textarea:", this.name || this.id), A(this);
    });
  setTimeout(() => {
    console.log("Running initial textarea resize on", t.length, "textareas");
    for (const n of t)
      A(n);
  }, 200);
  const e = document.querySelectorAll("textarea.no-enter");
  for (const n of e)
    Ui(n);
  new MutationObserver(Ki).observe(l, {
    childList: !0,
    subtree: !0
  }), new MutationObserver((n) => {
    for (const a of n)
      if (a.type === "attributes" && a.attributeName === "class") {
        const r = a.target;
        if (r instanceof HTMLElement) {
          const o = r.matches("textarea") ? [r] : Array.from(r.querySelectorAll("textarea"));
          for (const d of o)
            d.offsetParent !== null && A(d);
        }
      }
  }).observe(l, {
    attributes: !0,
    attributeFilter: ["class"],
    subtree: !0
  });
}
document.addEventListener("keydown", (l) => {
  if (l.key !== "Enter")
    return;
  const t = l.target;
  t instanceof HTMLElement && t.matches("textarea.no-enter") && l.preventDefault();
});
window.ShowBoostedErrors = Pi;
window.GenQRCode = Di;
window.SelectableInput = qi;
window.PathPlusQuery = $i;
window.HookupRBChange = Hi;
window.FormLoad = Wi;
window.TextareaAutoResize = A;
export {
  R as AbbreviationTooltips,
  ii as AlmanachEditPage,
  pi as EditPage,
  fi as FabMenu,
  Ye as FilterList,
  Ge as FilterPill,
  st as ImageReel,
  it as IntLink,
  jt as ItemsEditor,
  Ne as MultiSelectRole,
  De as MultiSelectSimple,
  et as PopupImage,
  _i as RelationsEditor,
  Xe as ScrollButton,
  ei as SingleSelectRemote,
  tt as TabList,
  Ze as ToolTip
};
