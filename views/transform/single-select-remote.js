const SSR_WRAPPER_CLASS = "ssr-wrapper";
const SSR_INPUT_CLASS = "ssr-input";
const SSR_LIST_CLASS = "ssr-list";
const SSR_OPTION_CLASS = "ssr-option";
const SSR_OPTION_NAME_CLASS = "ssr-option-name";
const SSR_OPTION_DETAIL_CLASS = "ssr-option-detail";
const SSR_OPTION_BIO_CLASS = "ssr-option-bio";
const SSR_HIDDEN_INPUT_CLASS = "ssr-hidden-input";
const SSR_CLEAR_BUTTON_CLASS = "ssr-clear-button";

const SSR_DEFAULT_MIN_CHARS = 1;
const SSR_DEFAULT_LIMIT = 10;
const SSR_FETCH_DEBOUNCE_MS = 250;

export class SingleSelectRemote extends HTMLElement {
	constructor() {
		super();
		this._endpoint = "";
		this._resultKey = "items";
		this._minChars = SSR_DEFAULT_MIN_CHARS;
		this._limit = SSR_DEFAULT_LIMIT;
		this._placeholder = "Search...";
		this._options = [];
		this._selected = null;
		this._highlightedIndex = -1;
		this._fetchTimeout = null;
		this._fetchController = null;
		this._listVisible = false;
		this._boundHandleInput = this._handleInput.bind(this);
		this._boundHandleFocus = this._handleFocus.bind(this);
		this._boundHandleKeyDown = this._handleKeyDown.bind(this);
		this._boundHandleClear = this._handleClear.bind(this);
		this._boundHandleClickOutside = this._handleClickOutside.bind(this);
	}

	static get observedAttributes() {
		return ["data-endpoint", "data-result-key", "data-minchars", "data-limit", "placeholder", "name"];
	}

	connectedCallback() {
		this._render();
		this._input = this.querySelector(`.${SSR_INPUT_CLASS}`);
		this._list = this.querySelector(`.${SSR_LIST_CLASS}`);
		this._hiddenInput = this.querySelector(`.${SSR_HIDDEN_INPUT_CLASS}`);
		this._clearButton = this.querySelector(`.${SSR_CLEAR_BUTTON_CLASS}`);

		this._endpoint = this.getAttribute("data-endpoint") || "";
		this._resultKey = this.getAttribute("data-result-key") || "items";
		this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), SSR_DEFAULT_MIN_CHARS);
		this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), SSR_DEFAULT_LIMIT);
		this._placeholder = this.getAttribute("placeholder") || "Search...";

		if (this._input) {
			this._input.placeholder = this._placeholder;
			this._input.addEventListener("input", this._boundHandleInput);
			this._input.addEventListener("focus", this._boundHandleFocus);
			this._input.addEventListener("keydown", this._boundHandleKeyDown);
		}

		if (this._clearButton) {
			this._clearButton.addEventListener("click", this._boundHandleClear);
		}

		document.addEventListener("click", this._boundHandleClickOutside);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this._boundHandleClickOutside);
		if (this._input) {
			this._input.removeEventListener("input", this._boundHandleInput);
			this._input.removeEventListener("focus", this._boundHandleFocus);
			this._input.removeEventListener("keydown", this._boundHandleKeyDown);
		}
		if (this._clearButton) {
			this._clearButton.removeEventListener("click", this._boundHandleClear);
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}
		if (name === "data-endpoint") this._endpoint = newValue || "";
		if (name === "data-result-key") this._resultKey = newValue || "items";
		if (name === "data-minchars") this._minChars = this._parsePositiveInt(newValue, SSR_DEFAULT_MIN_CHARS);
		if (name === "data-limit") this._limit = this._parsePositiveInt(newValue, SSR_DEFAULT_LIMIT);
		if (name === "placeholder") {
			this._placeholder = newValue || "Search...";
			if (this._input) this._input.placeholder = this._placeholder;
		}
		if (name === "name" && this._hiddenInput) this._hiddenInput.name = newValue || "";
	}

	_handleInput(event) {
		const value = event.target.value.trim();
		this._selected = null;
		this._highlightedIndex = -1;
		this._syncHiddenInput();

		if (value.length < this._minChars) {
			this._options = [];
			this._renderOptions();
			this._hideList();
			return;
		}

		this._debouncedFetch(value);
	}

	_handleFocus() {
		if (this._options.length > 0) {
			this._showList();
		}
	}

	_handleKeyDown(event) {
		if (event.key === "Escape") {
			this._hideList();
			return;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			this._moveHighlight(1);
			return;
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			this._moveHighlight(-1);
			return;
		}
		if (event.key === "Home") {
			event.preventDefault();
			this._setHighlight(0);
			return;
		}
		if (event.key === "End") {
			event.preventDefault();
			this._setHighlight(this._options.length - 1);
			return;
		}
		if (event.key === "Enter") {
			if (this._options.length === 0) {
				return;
			}
			event.preventDefault();
			const index = this._highlightedIndex >= 0 ? this._highlightedIndex : 0;
			this._selectOption(this._options[index]);
		}
	}

	_handleClear(event) {
		event.preventDefault();
		this._selected = null;
		this._options = [];
		if (this._input) this._input.value = "";
		this._syncHiddenInput();
		this._renderOptions();
		this._hideList();
		this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: true, detail: { item: null } }));
	}

	_handleClickOutside(event) {
		if (!this.contains(event.target)) {
			this._hideList();
		}
	}

	_debouncedFetch(query) {
		if (this._fetchTimeout) {
			clearTimeout(this._fetchTimeout);
		}
		this._fetchTimeout = setTimeout(() => {
			this._fetchOptions(query);
		}, SSR_FETCH_DEBOUNCE_MS);
	}

	async _fetchOptions(query) {
		if (!this._endpoint) {
			return;
		}
		if (this._fetchController) {
			this._fetchController.abort();
		}

		// Dispatch event before fetch to allow filtering
		this.dispatchEvent(new CustomEvent("ssrbeforefetch", { bubbles: true }));

		this._fetchController = new AbortController();
		const url = new URL(this._endpoint, window.location.origin);
		url.searchParams.set("q", query);
		if (this._limit > 0) {
			url.searchParams.set("limit", String(this._limit));
		}
		try {
			const resp = await fetch(url.toString(), { signal: this._fetchController.signal });
			if (!resp.ok) {
				return;
			}
			const data = await resp.json();
			const items = Array.isArray(data?.[this._resultKey]) ? data[this._resultKey] : [];
			let filteredItems = items.filter((item) => item && item.id && item.name);

			// Filter out excluded IDs if provided
			if (this._excludeIds && Array.isArray(this._excludeIds)) {
				const excludeSet = new Set(this._excludeIds);
				filteredItems = filteredItems.filter((item) => !excludeSet.has(item.id));
			}

			this._options = filteredItems;
			this._highlightedIndex = this._options.length > 0 ? 0 : -1;
			this._renderOptions();
			if (this._options.length > 0) {
				this._showList();
			} else {
				this._hideList();
			}
		} catch (err) {
			if (err?.name === "AbortError") {
				return;
			}
		}
	}

	_renderOptions() {
		if (!this._list) {
			return;
		}
		this._list.innerHTML = "";

		this._options.forEach((item) => {
			const option = document.createElement("button");
			option.type = "button";
			option.setAttribute("data-index", String(this._options.indexOf(item)));
			option.className = [
				SSR_OPTION_CLASS,
				"w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors",
			].join(" ");
			const optionIndex = this._options.indexOf(item);
			const isHighlighted = optionIndex === this._highlightedIndex;
			option.classList.toggle("bg-slate-100", isHighlighted);
			option.classList.toggle("text-gray-900", isHighlighted);
			option.setAttribute("aria-selected", isHighlighted ? "true" : "false");

			const nameEl = document.createElement("div");
			nameEl.className = [SSR_OPTION_NAME_CLASS, "text-sm font-semibold text-gray-800"].join(" ");
			nameEl.textContent = item.name;
			option.appendChild(nameEl);

			if (item.detail) {
				const detailEl = document.createElement("div");
				detailEl.className = [SSR_OPTION_DETAIL_CLASS, "text-xs text-gray-600"].join(" ");
				detailEl.textContent = item.detail;
				option.appendChild(detailEl);
			}

			if (item.bio) {
				const bioEl = document.createElement("div");
				bioEl.className = [SSR_OPTION_BIO_CLASS, "text-xs text-gray-500"].join(" ");
				bioEl.textContent = item.bio;
				option.appendChild(bioEl);
			}

			option.addEventListener("click", () => {
				this._selectOption(item);
			});

			this._list.appendChild(option);
		});
	}

	_setHighlight(index) {
		if (this._options.length === 0) {
			this._highlightedIndex = -1;
			return;
		}
		const nextIndex = Math.max(0, Math.min(index, this._options.length - 1));
		this._highlightedIndex = nextIndex;
		this._renderOptions();
		this._scrollHighlightedIntoView();
		this._showList();
	}

	_moveHighlight(delta) {
		if (this._options.length === 0) {
			this._highlightedIndex = -1;
			return;
		}
		const startIndex = this._highlightedIndex >= 0 ? this._highlightedIndex : 0;
		const nextIndex = Math.max(0, Math.min(startIndex + delta, this._options.length - 1));
		this._highlightedIndex = nextIndex;
		this._renderOptions();
		this._scrollHighlightedIntoView();
		this._showList();
	}

	_scrollHighlightedIntoView() {
		if (!this._list || this._highlightedIndex < 0) {
			return;
		}
		const option = this._list.querySelector(`[data-index="${this._highlightedIndex}"]`);
		if (option) {
			option.scrollIntoView({ block: "nearest" });
		}
	}

	_selectOption(item) {
		this._selected = item;
		if (this._input) {
			this._input.value = item.name || "";
		}
		this._syncHiddenInput();
		this._hideList();
		this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: true, detail: { item } }));
		this.dispatchEvent(new Event("change", { bubbles: true }));
	}

	_syncHiddenInput() {
		if (!this._hiddenInput) {
			return;
		}
		this._hiddenInput.value = this._selected?.id || "";
	}

	_showList() {
		if (!this._list || this._listVisible) {
			return;
		}
		this._list.classList.remove("hidden");
		this._listVisible = true;
	}

	_hideList() {
		if (!this._list || !this._listVisible) {
			return;
		}
		this._list.classList.add("hidden");
		this._listVisible = false;
	}

	_parsePositiveInt(value, fallback) {
		const parsed = parseInt(value || "", 10);
		if (Number.isNaN(parsed) || parsed <= 0) {
			return fallback;
		}
		return parsed;
	}

	_render() {
		const inputName = this.getAttribute("name") || "";
		this.innerHTML = `
			<div class="${SSR_WRAPPER_CLASS} relative">
				<div class="flex items-center gap-2">
					<input
						type="text"
						class="${SSR_INPUT_CLASS} inputinput w-full"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						spellcheck="false"
						placeholder="${this._placeholder}"
					/>
					<button type="button" class="${SSR_CLEAR_BUTTON_CLASS} text-sm text-gray-600 hover:text-gray-900">
						<i class="ri-close-line"></i>
					</button>
				</div>
				<input type="hidden" class="${SSR_HIDDEN_INPUT_CLASS}" name="${inputName}" value="" />
				<div class="${SSR_LIST_CLASS} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
			</div>
		`;
	}
}
