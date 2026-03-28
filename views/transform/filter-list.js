const FILTER_LIST_LIST = "filter-list-list";
const FILTER_LIST_ITEM = "filter-list-item";
const FILTER_LIST_INPUT = "filter-list-input";
const FILTER_LIST_SEARCHABLE = "filter-list-searchable";

export class FilterList extends HTMLElement {
	#hiddenlist = false;

	constructor() {
		super();
		this._items = [];
		this._url = "";
		this._filterstart = false;
		this._placeholder = "Liste filtern...";
		this._queryparam = "";
		this._startparams = null;
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
		this._queryparam = this.getAttribute("data-queryparam") || "";

		if (this._queryparam) {
		}

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
		if (name === "data-queryparam" && oldValue !== newValue) {
			this._queryparam = newValue;
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
		} else if (item.id == null) {
			return "";
		}
		return String(item.id);
	}

	getHREFEncoded(item) {
		return encodeURIComponent(this.getHREF(item));
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
		if (href === "") {
			return false;
		}

		if (this._queryparam) {
			let params = new URLSearchParams(window.location.search);
			let activequery = params.get(this._queryparam) || "";
			if (activequery === href) {
				return true;
			}
		}

		if (!window.location.href.endsWith(href)) {
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

	getURL(item) {
		if (this._queryparam) {
			let url = new URL(window.location);
			let params = new URLSearchParams(url.search);
			params.set(this._queryparam, this.getHREF(item));
			params.delete("page");
			url.search = params.toString();
			return url.toString();
		}
		return this._url + this.getHREFEncoded(item);
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
		if (!htmx) return;
		htmx.process(this);
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
							<div id="${FILTER_LIST_LIST}" class="${FILTER_LIST_LIST} pt-1 max-h-60 overflow-auto bg-stone-50 ${this.#hiddenlist ? "hidden" : ""}">
								${filtereditems
									.map(
										(item, index) => `
									<a
										href="${this.getURL(item)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${FILTER_LIST_ITEM} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${index % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
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
