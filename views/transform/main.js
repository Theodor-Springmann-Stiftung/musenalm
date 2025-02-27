// INFO: We import this so vite processes the stylesheet
import "./site.css";

const ATTR_XSLT_ONLOAD = "script[xslt-onload]";
const ATTR_XSLT_TEMPLATE = "xslt-template";
const ATTR_XSLT_STATE = "xslt-transformed";

const FILTER_LIST_ELEMENT = "filter-list";
const FILTER_LIST_LIST = "filter-list-list";
const FILTER_LIST_ITEM = "filter-list-item";
const FILTER_LIST_INPUT = "filter-list-input";
const FILTER_LIST_SEARCHABLE = "filter-list-searchable";

const SCROLL_BUTTON_ELEMENT = "scroll-button";
const TOOLTIP_ELEMENT = "tool-tip";
const ABBREV_TOOLTIPS_ELEMENT = "abbrev-tooltips";
const INT_LINK_ELEMENT = "int-link";
const POPUP_IMAGE_ELEMENT = "popup-image";

class XSLTParseProcess {
	#processors;

	constructor() {
		this.#processors = new Map();
	}

	setup() {
		let els = htmx.findAll(ATTR_XSLT_ONLOAD);
		for (let element of els) {
			this.#transform_xslt(element);
		}
	}

	hookupHTMX() {
		// INFO: We can instead use afterSettle; and also clear the map with
		// xslt_processors.clear();
		htmx.on("htmx:load", (_) => {
			this.setup();
		});
	}

	#transform_xslt(element) {
		if (
			element.getAttribute(ATTR_XSLT_STATE) === "true" ||
			!element.hasAttribute(ATTR_XSLT_TEMPLATE)
		) {
			return;
		}

		let templateId = "#" + element.getAttribute(ATTR_XSLT_TEMPLATE);
		let processor = this.#processors.get(templateId);
		if (!processor) {
			let template = htmx.find(templateId);
			if (template) {
				let content = template.innerHTML
					? new DOMParser().parseFromString(template.innerHTML, "application/xml")
					: template.contentDocument;
				processor = new XSLTProcessor();
				processor.importStylesheet(content);
				this.#processors.set(templateId, processor);
			} else {
				throw new Error("Unknown XSLT template: " + templateId);
			}
		}

		let data = new DOMParser().parseFromString(element.innerHTML, "application/xml");
		let frag = processor.transformToFragment(data, document);
		let s = new XMLSerializer().serializeToString(frag);
		element.outerHTML = s;
	}
}

// INFO: these is a function to define simple reusable templates which we don't need.
// Since we can include templates server-side.
function setup_templates() {
	let templates = document.querySelectorAll("template[simple]");
	templates.forEach((template) => {
		let templateId = template.getAttribute("id");
		let templateContent = template.content;

		customElements.define(
			templateId,
			class extends HTMLElement {
				constructor() {
					super();
					this.appendChild(templateContent.cloneNode(true));
					this.slots = this.querySelectorAll("slot");
				}

				connectedCallback() {
					let toremove = [];
					this.slots.forEach((tslot) => {
						let slotName = tslot.getAttribute("name");
						let slotContent = this.querySelector(`[slot="${slotName}"]`);
						if (slotContent) {
							tslot.replaceWith(slotContent.cloneNode(true));
							toremove.push(slotContent);
						}
					});
					toremove.forEach((element) => {
						element.remove();
					});
				}
			},
		);
	});
}

class FilterList extends HTMLElement {
	#hiddenlist = false;
	constructor() {
		super();
		this._items = [];
		this._url = "";
		this._filterstart = false;
		this._placeholder = "Liste filtern...";
		this.render();
	}

	static get observedAttributes() {
		return ["data-url"];
	}

	set items(data) {
		if (Array.isArray(data)) {
			this._items = data;
			this.render();
		}
	}

	get items() {
		return this._items;
	}

	connectedCallback() {
		this._url = this.getAttribute("data-url") || "./";
		this._filterstart = this.getAttribute("data-filterstart") === "true";
		this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...";

		if (this._filterstart) {
			this.#hiddenlist = true;
		}

		this.addEventListener("input", this.onInput.bind(this));
		this.addEventListener("keydown", this.onEnter.bind(this));
		this.addEventListener("focusin", this.onGainFocus.bind(this));
		this.addEventListener("focusout", this.onLoseFocus.bind(this));
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "data-url" && oldValue !== newValue) {
			this._url = newValue;
			this.render();
		}
		if (name === "data-filterstart" && oldValue !== newValue) {
			this._filterstart = newValue === "true";
			this.render();
		}
		if (name === "data-placeholder" && oldValue !== newValue) {
			this._placeholder = newValue;
			this.render();
		}
	}

	onInput(e) {
		if (e.target && e.target.tagName.toLowerCase() === "input") {
			this._filter = e.target.value;
			this.renderList();
		}
	}

	onGainFocus(e) {
		if (e.target && e.target.tagName.toLowerCase() === "input") {
			this.#hiddenlist = false;
			this.renderList();
		}
	}

	onLoseFocus(e) {
		let input = this.querySelector("input");
		if (e.target && e.target === input) {
			relatedElement = e.relatedTarget;
			if (relatedElement && this.contains(relatedElement)) {
				return;
			}

			input.value = "";
			this._filter = "";
			if (this._filterstart) {
				this.#hiddenlist = true;
			}
			this.renderList();
		}
	}

	onEnter(e) {
		if (e.target && e.target.tagName.toLowerCase() === "input" && e.key === "Enter") {
			e.preventDefault();
			const link = this.querySelector("a");
			if (link) {
				link.click();
			}
		}
	}

	mark() {
		if (typeof Mark !== "function") {
			return;
		}

		let list = this.querySelector("#" + FILTER_LIST_LIST);
		if (!list) {
			return;
		}

		let instance = new Mark(list.querySelectorAll("." + FILTER_LIST_SEARCHABLE));
		if (this._filter) {
			instance.mark(this._filter, {
				separateWordSearch: true,
			});
		}
	}

	// INFO: allows for setting a custom HREF of the list item
	// The function takes the item as parameter fn(item) and should return a string.
	setHREFFunc(fn) {
		this.getHREF = fn;
		this.render();
	}

	// INFO: allows for setting a custom link text of the list item
	// The function takes the item as parameter fn(item) and should return a string or
	// an HTML template literal.
	setLinkTextFunc(fn) {
		this.getLinkText = fn;
		this.render();
	}

	// INFO: allows for setting the text that will be filtered for.
	// The function takes the item as parameter fn(item) and should return a string.
	setSearchTextFunc(fn) {
		this.getSearchText = fn;
		this.render();
	}

	getHREF(item) {
		if (!item) {
			return "";
		} else if (!item.id) {
			return "";
		}
		return item.id;
	}

	getSearchText(item) {
		if (!item) {
			return "";
		} else if (!item.name) {
			return "";
		}
		return item.name;
	}

	#isActive(item) {
		if (!item) {
			return false;
		}

		let href = this.getHREF(item);
		if (href === "" || !window.location.href.endsWith(href)) {
			return false;
		}

		return true;
	}

	getLinkText(item) {
		let text = this.getSearchText(item);
		if (text === "") {
			return ``;
		}
		return `<span class="${FILTER_LIST_SEARCHABLE}">${text}</span>`;
	}

	renderList() {
		let list = this.querySelector("#" + FILTER_LIST_LIST);
		if (list) {
			list.outerHTML = this.List();
		}
		this.mark();
	}

	render() {
		this.innerHTML = `
            <div class="font-serif text-base shadow-inner border border-stone-100">
							${this.Input()}
							${this.List()}
            </div>
        `;
	}

	ActiveDot(item) {
		if (this.#isActive(item)) {
			return ``;
		}
		return "";
	}

	NoItems(items) {
		if (items.length === 0) {
			return `<div class="px-2 py-0.5 italic text-gray-500">Keine Einträge gefunden</div>`;
		}
		return "";
	}

	Input() {
		return `
			<div class="flex w-full py-0.5 border-b border-zinc-600 bg-stone-50">
						<i class="ri-arrow-right-s-line pl-2"></i>
						<div class="grow">
						<input
								type="text"
								placeholder="${this._placeholder}"
								class="${FILTER_LIST_INPUT} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
	}

	List() {
		let filtereditems = this._items;
		if (this._filter) {
			if (!this._filterstart) {
				let joins = this._filter.split(" ");
				filtereditems = this._items.filter((item) => {
					return joins.every((join) => {
						return this.getSearchText(item).toLowerCase().includes(join.toLowerCase());
					});
				});
			} else {
				filtereditems = this._items.filter((item) => {
					return this.getSearchText(item).toLowerCase().startsWith(this._filter.toLowerCase());
				});
			}
		}

		return `
							<div id="${FILTER_LIST_LIST}" class="${FILTER_LIST_LIST} pt-1 min-h-[19rem] max-h-60 overflow-auto border-b border-zinc-300 bg-stone-50 ${this.#hiddenlist ? "hidden" : ""}">
								${filtereditems
									.map(
										(item, index) => `
									<a
										href="${this._url}${this.getHREF(item)}"
										class="${FILTER_LIST_ITEM} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${
											index % 2 === 0 ? "bg-stone-100" : "bg-stone-50"
										}"
										${this.#isActive(item) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(item)}
										${this.getLinkText(item)}
									</a>
								`,
									)
									.join("")}
								${this.NoItems(filtereditems)}
							</div>
				`;
	}
}

class ScrollButton extends HTMLElement {
	constructor() {
		super();
		this.handleScroll = this.handleScroll.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
	}

	connectedCallback() {
		// Insert Tailwind-styled button in light DOM
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
        `;

		this._button = this.querySelector(".scroll-to-top");

		window.addEventListener("scroll", this.handleScroll);
		this._button.addEventListener("click", this.scrollToTop);
	}

	disconnectedCallback() {
		window.removeEventListener("scroll", this.handleScroll);
		this._button.removeEventListener("click", this.scrollToTop);
	}

	handleScroll() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		if (scrollTop > 300) {
			this._button.classList.remove("hidden");
		} else {
			this._button.classList.add("hidden");
		}
	}

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
}

class ToolTip extends HTMLElement {
	static get observedAttributes() {
		return ["position", "timeout"];
	}

	constructor() {
		super();
		this._tooltipBox = null;
		this._timeout = 200;
		this._hideTimeout = null;
		this._hiddenTimeout = null;
	}

	connectedCallback() {
		this.classList.add(
			"w-full",
			"h-full",
			"relative",
			"block",
			"leading-none",
			"[&>*]:leading-normal",
		);
		const dataTipElem = this.querySelector(".data-tip");
		const tipContent = dataTipElem ? dataTipElem.innerHTML : "Tooltip";

		if (dataTipElem) {
			dataTipElem.remove();
		}

		this._tooltipBox = document.createElement("div");
		this._tooltipBox.innerHTML = tipContent;
		this._tooltipBox.className = [
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
			"font-sans",
		].join(" ");

		this.appendChild(this._tooltipBox);

		this._updatePosition();

		this.addEventListener("mouseenter", () => this._showTooltip());
		this.addEventListener("mouseleave", () => this._hideTooltip());
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "position" && this._tooltipBox) {
			this._updatePosition();
		}
		if (name === "timeout" && newValue) {
			this._timeout = parseInt(newValue) || 200;
		}
	}

	_showTooltip() {
		clearTimeout(this._hideTimeout);
		clearTimeout(this._hiddenTimeout);
		this._tooltipBox.classList.remove("hidden");
		setTimeout(() => {
			this._tooltipBox.classList.remove("opacity-0");
			this._tooltipBox.classList.add("opacity-100");
		}, 16);
	}

	_hideTooltip() {
		this._hideTimeout = setTimeout(() => {
			this._tooltipBox.classList.remove("opacity-100");
			this._tooltipBox.classList.add("opacity-0");
			this._hiddenTimeout = setTimeout(() => {
				this._tooltipBox.classList.add("hidden");
			}, this._timeout + 100);
		}, this._timeout);
	}

	_updatePosition() {
		this._tooltipBox.classList.remove(
			"bottom-full",
			"left-1/2",
			"-translate-x-1/2",
			"mb-2", // top
			"top-full",
			"mt-2", // bottom
			"right-full",
			"-translate-y-1/2",
			"mr-2",
			"top-1/2", // left
			"left-full",
			"ml-2", // right
		);

		const pos = this.getAttribute("position") || "top";

		switch (pos) {
			case "bottom":
				this._tooltipBox.classList.add(
					"top-full",
					"left-1/2",
					"transform",
					"-translate-x-1/2",
					"mt-0.5",
				);
				break;
			case "left":
				this._tooltipBox.classList.add(
					"right-full",
					"top-1/2",
					"transform",
					"-translate-y-1/2",
					"mr-0.5",
				);
				break;
			case "right":
				this._tooltipBox.classList.add(
					"left-full",
					"top-1/2",
					"transform",
					"-translate-y-1/2",
					"ml-0.5",
				);
				break;
			case "top":
			default:
				// top as default
				this._tooltipBox.classList.add(
					"bottom-full",
					"left-1/2",
					"transform",
					"-translate-x-1/2",
					"mb-0.5",
				);
		}
	}
}

class PopupImage extends HTMLElement {
	constructor() {
		super();
		this.overlay = null;
		this._preview = null;
		this._description = null;
		this._imageURL = "";
	}

	connectedCallback() {
		this._imageURL = this.getAttribute("data-image-url") || "";
		this._preview = this.querySelector("img");
		this._description = this.querySelector(".image-description");

		if (this._preview) {
			this._preview.addEventListener("click", () => {
				this.showOverlay();
			});
		}
	}

	disconnectedCallback() {
		// Optionally remove the overlay if the element is removed from the DOM
		if (this.overlay && this.overlay.parentNode) {
			this.overlay.parentNode.removeChild(this.overlay);
		}
	}

	showOverlay() {
		const descriptionHtml = this._description ? this._description.innerHTML : "";
		this.overlay = document.createElement("div");
		this.overlay.classList.add(
			"fixed",
			"inset-0",
			"z-50",
			"bg-black/70",
			"flex",
			"items-center",
			"justify-center",
			"p-4",
		);

		this.overlay.innerHTML = `
      <div class="relative w-max max-w-dvw max-h-dvh shadow-lg flex flex-col items-center gap-4">
        <button class="absolute top-0 -right-16 text-white hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Close popup">
          <i class="ri-close-fill text-4xl"></i>
        </button>

        <img
          src="${this._imageURL}"
          alt="Popup Image"
          class="max-h-[90vh] max-w-[80vw] object-contain"
        />

        <div class="text-center text-gray-700 description-content">
          ${descriptionHtml}
        </div>
      </div>
    `;

		const closeButton = this.overlay.querySelector("button");
		if (closeButton) {
			closeButton.addEventListener("click", () => {
				this.hideOverlay();
			});
		}

		this.overlay.addEventListener("click", (evt) => {
			if (evt.target === this.overlay) {
				this.hideOverlay();
			}
		});

		document.body.appendChild(this.overlay);
	}

	hideOverlay() {
		this.overlay.parentNode.removeChild(this.overlay);
		this.overlay = null;
	}
}

class AbbreviationTooltips extends HTMLElement {
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
			"§§": "Hinweis auf Mängel im Almanach (Beschädigungen, fehlende Graphiken, unvollständige Sammlungen etc) in der Anmerkung",
		};
	}

	constructor() {
		super();
		this._abbrevMap = AbbreviationTooltips.defaultAbbrevMap;
	}

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (oldVal !== newVal) {
			if (name === "data-abbrevmap") {
				this._parseAndSetAbbrevMap(newVal);
			}
			this.render();
		}
	}

	_parseAndSetAbbrevMap(jsonStr) {
		if (!jsonStr) {
			this._abbrevMap = AbbreviationTooltips.defaultAbbrevMap;
			return;
		}
		try {
			this._abbrevMap = JSON.parse(jsonStr);
		} catch {
			this._abbrevMap = AbbreviationTooltips.defaultAbbrevMap;
		}
	}

	setAbbrevMap(map) {
		if (typeof map === "object" && map !== null) {
			this._abbrevMap = map;
			this.render();
		}
	}

	get text() {
		return this.getAttribute("data-text") || "";
	}
	set text(value) {
		this.setAttribute("data-text", value);
	}

	render() {
		this.innerHTML = this.transformText(this.text, this._abbrevMap);
	}

	transformText(text, abbrevMap) {
		let result = "";
		let i = 0;

		while (i < text.length) {
			// Only match if at start of text or preceded by a boundary character
			if (i > 0 && !this.isSpaceOrPunct(text[i - 1])) {
				result += text[i];
				i++;
				continue;
			}

			const matchObj = this.findLongestAbbrevAt(text, i, abbrevMap);
			if (matchObj) {
				const { match, meaning } = matchObj;
				result += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${meaning}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${match}
              </span>
            </tool-tip>
          `;
				i += match.length;
			} else {
				result += text[i];
				i++;
			}
		}

		return result;
	}

	findLongestAbbrevAt(text, i, abbrevMap) {
		let bestKey = null;
		let bestLength = 0;

		for (const key of Object.keys(abbrevMap)) {
			if (text.startsWith(key, i)) {
				if (key.length > bestLength) {
					bestKey = key;
					bestLength = key.length;
				}
			}
		}

		if (bestKey) {
			return { match: bestKey, meaning: abbrevMap[bestKey] };
		}
		return null;
	}

	isSpaceOrPunct(ch) {
		// Adjust if you want a different set of punctuation recognized
		return /\s|[.,;:!?]/.test(ch);
	}
}

class IntLink extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// Basic styling to mimic a link.
		this.style.cursor = "pointer";
		this.addEventListener("click", this.handleClick);
	}

	disconnectedCallback() {
		this.removeEventListener("click", this.handleClick);
	}

	handleClick(event) {
		const selector = this.getAttribute("data-jump");
		if (selector) {
			const target = document.querySelector(selector);
			if (target) {
				target.scrollIntoView({ behavior: "smooth" });
			} else {
				console.warn(`No element found for selector: ${selector}`);
			}
		}
	}
}

customElements.define(INT_LINK_ELEMENT, IntLink);
customElements.define(ABBREV_TOOLTIPS_ELEMENT, AbbreviationTooltips);
customElements.define(FILTER_LIST_ELEMENT, FilterList);
customElements.define(SCROLL_BUTTON_ELEMENT, ScrollButton);
customElements.define(TOOLTIP_ELEMENT, ToolTip);
customElements.define("popup-image", PopupImage);

export { XSLTParseProcess, FilterList, ScrollButton, AbbreviationTooltips };
