// INFO: We import this so vite processes the stylesheet
import "./site.css";

const ATTR_XSLT_ONLOAD = "script[xslt-onload]";
const ATTR_XSLT_TEMPLATE = "xslt-template";
const ATTR_XSLT_STATE = "xslt-transformed";
const FILTER_LIST_ELEMENT = "filter-list";

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
		if (e.target && e.target.tagName.toLowerCase() === "input") {
			e.target.value = "";
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

	setHREFFunc(fn) {
		this.getHREF = fn;
		this.render();
	}

	setLinkTextFunc(fn) {
		this.getLinkText = fn;
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

	getLinkText(item) {
		if (!item) {
			return "";
		} else if (!item.name) {
			return "";
		}
		return item.name;
	}

	#isActive(item) {
		if (!item) {
			return "";
		}

		let href = this.getHREF(item);
		if (href === "") {
			return "";
		}

		if (!window.location.href.endsWith(href)) {
			return "";
		}

		return "aria-current='page'";
	}

	#hiddenList() {
		if (this.#hiddenlist) {
			return "hidden";
		}
		return "";
	}

	renderList() {
		let list = this.querySelector("#list");
		if (list) {
			list.outerHTML = this.List();
		}
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
		let filtereditems = this._items;
		if (this._filter) {
			if (!this._filterstart)
				filtereditems = this._items.filter((item) => {
					return this.getLinkText(item).toLowerCase().includes(this._filter.toLowerCase());
				});
			else
				filtereditems = this._items.filter((item) => {
					return this.getLinkText(item).toLowerCase().startsWith(this._filter.toLowerCase());
				});
		}

		return `
							<div id="list" class="links min-h-72 max-h-60 overflow-auto border-b border-zinc-300 ${this.#hiddenList()}">
								${filtereditems
									.map(
										(item, index) => `
									<a
										href="${this._url}${this.getHREF(item)}"
										class="block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${
											index % 2 === 0 ? "bg-stone-100" : "bg-stone-50"
										}"
										${this.#isActive(item)}>
										${this.getLinkText(item)}
									</a>
								`,
									)
									.join("")}
							</div>
				`;
	}
}

customElements.define(FILTER_LIST_ELEMENT, FilterList);

export { XSLTParseProcess, FilterList };
