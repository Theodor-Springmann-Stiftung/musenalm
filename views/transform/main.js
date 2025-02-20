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

		// Listen for scroll events
		window.addEventListener("scroll", this.handleScroll);

		// Listen for clicks on the button
		this._button.addEventListener("click", this.scrollToTop);
	}

	disconnectedCallback() {
		window.removeEventListener("scroll", this.handleScroll);
		this._button.removeEventListener("click", this.scrollToTop);
	}

	handleScroll() {
		// Show/hide button based on scroll position
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		if (scrollTop > 300) {
			// Remove 'hidden' so it becomes visible
			this._button.classList.remove("hidden");
		} else {
			// Add 'hidden' so it's not displayed
			this._button.classList.add("hidden");
		}
	}

	scrollToTop() {
		// Smoothly scroll back to top
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
}

customElements.define(FILTER_LIST_ELEMENT, FilterList);
customElements.define(SCROLL_BUTTON_ELEMENT, ScrollButton);

export { XSLTParseProcess, FilterList, ScrollButton };
