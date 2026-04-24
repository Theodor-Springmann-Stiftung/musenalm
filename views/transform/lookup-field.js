const LF_WRAPPER_CLASS = "lookup-field";
const LF_INPUT_CLASS = "lf-input";
const LF_LIST_CLASS = "lf-list";
const LF_OPTION_CLASS = "lf-option";
const LF_HIDDEN_INPUT_CLASS = "lf-hidden-input";
const LF_CLEAR_BUTTON_CLASS = "lf-clear-button";
const LF_LINK_BUTTON_CLASS = "lf-link-button";
const LF_WARN_ICON_CLASS = "lf-warn-icon";
const LF_DUP_WARNING_CLASS = "lf-dup-warning";

const LF_DEFAULT_MIN_CHARS = 1;
const LF_DEFAULT_LIMIT = 10;
const LF_FETCH_DEBOUNCE_MS = 250;

export class LookupField extends HTMLElement {
	constructor() {
		super();
		this._endpoint = "";
		this._resultKey = "items";
		this._minChars = LF_DEFAULT_MIN_CHARS;
		this._limit = LF_DEFAULT_LIMIT;
		this._autocomplete = true;
		this._placeholder = "";
		this._required = false;
		this._multiline = false;
		this._valueName = "";
		this._textName = "";
		this._valueFn = null;
		this._linkFn = null;
		this._validFn = null;

		this._dupEndpoint = "";
		this._dupResultKey = "";
		this._dupCurrentId = "";
		this._dupExact = true;

		this._options = [];
		this._selected = null;
		this._highlightedIndex = -1;
		this._fetchTimeout = null;
		this._fetchController = null;
		this._dupTimeout = null;
		this._listVisible = false;

		this._input = null;
		this._hiddenInput = null;
		this._list = null;
		this._clearButton = null;
		this._linkButton = null;
		this._warnIcon = null;
		this._dupWarning = null;

		this._boundHandleInput = this._handleInput.bind(this);
		this._boundHandleFocus = this._handleFocus.bind(this);
		this._boundHandleKeyDown = this._handleKeyDown.bind(this);
		this._boundHandleClear = this._handleClear.bind(this);
		this._boundHandleClickOutside = this._handleClickOutside.bind(this);
	}

	static get observedAttributes() {
		return [
			"name",
			"value",
			"placeholder",
			"data-endpoint",
			"data-result-key",
			"data-minchars",
			"data-limit",
			"data-autocomplete",
			"data-required",
			"data-multiline",
			"data-value-name",
			"data-text-name",
			"data-value-fn",
			"data-link-fn",
			"data-valid-fn",
			"data-dup-endpoint",
			"data-dup-result-key",
			"data-dup-current-id",
			"data-dup-exact",
			"data-initial-id",
			"data-initial-name",
			"data-initial-musenalm-id",
		];
	}

	connectedCallback() {
		this._render();
		this._bindElements();
		this._syncFromAttributes();
		this._applyInitialValue();
		this._updateValidity();
		this._maybeCheckDuplicates(this._input?.value || "");
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
		if (!this._input) {
			return;
		}
		this._syncFromAttributes();
		if (name === "value") {
			this._applyInitialValue();
		}
	}

	_render() {
		const isMultiline = this.getAttribute("data-multiline") === "true";
		const hasTextName = this.hasAttribute("data-text-name");
		const textName = hasTextName ? this.getAttribute("data-text-name") || "" : "";
		const valueName = this.getAttribute("data-value-name") || "";
		const placeholder = this.getAttribute("placeholder") || "";
		const inputId = this.getAttribute("id") ? `${this.getAttribute("id")}-input` : "";
		const initialValue = this.getAttribute("value") || "";

		const noEnter = this.getAttribute("data-no-enter") === "true";
		const extraClass = noEnter ? " no-enter" : "";
		const fallbackName = this.getAttribute("name") || "";
		const finalTextName = hasTextName ? textName : fallbackName;
		const textNameAttr = finalTextName ? ` name="${finalTextName}"` : "";
		const inputMarkup = isMultiline
			? `<textarea id="${inputId}" class="${LF_INPUT_CLASS} inputinput w-full${extraClass}" rows="1" placeholder="${placeholder}"${textNameAttr}>${initialValue}</textarea>`
			: `<input id="${inputId}" type="text" class="${LF_INPUT_CLASS} inputinput w-full${extraClass}" placeholder="${placeholder}" value="${initialValue}"${textNameAttr} />`;
		const hiddenInputMarkup = valueName ? `<input type="hidden" class="${LF_HIDDEN_INPUT_CLASS}" name="${valueName}" value="" />` : "";

		this.innerHTML = `
			<div class="${LF_WRAPPER_CLASS} relative">
				<div class="inputshell flex items-center gap-2">
					${inputMarkup.replace(/(class="[^"]*)"/, `$1" ${textNameAttr}`)}
					<a class="${LF_LINK_BUTTON_CLASS} hidden text-sm text-gray-600 hover:text-gray-900 no-underline" aria-label="Auswahl öffnen" target="_blank" rel="noopener">
						<i class="ri-external-link-line"></i>
					</a>
					<span class="${LF_WARN_ICON_CLASS} hidden text-red-700 text-lg" aria-hidden="true">
						<i class="ri-error-warning-line"></i>
					</span>
					<button type="button" class="${LF_CLEAR_BUTTON_CLASS} text-sm text-gray-600 hover:text-gray-900" aria-label="Eingabe löschen">
						<i class="ri-close-line"></i>
					</button>
				</div>
				${hiddenInputMarkup}
				<div class="${LF_LIST_CLASS} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
				<div class="${LF_DUP_WARNING_CLASS} hidden text-sm text-blue-700 mt-1 flex items-center gap-2">
					<i class="ri-information-line"></i>
					<span data-role="dup-text"></span>
				</div>
			</div>
		`;
	}

	_bindElements() {
		this._input = this.querySelector(`.${LF_INPUT_CLASS}`);
		this._hiddenInput = this.querySelector(`.${LF_HIDDEN_INPUT_CLASS}`);
		this._list = this.querySelector(`.${LF_LIST_CLASS}`);
		this._clearButton = this.querySelector(`.${LF_CLEAR_BUTTON_CLASS}`);
		this._linkButton = this.querySelector(`.${LF_LINK_BUTTON_CLASS}`);
		this._warnIcon = this.querySelector(`.${LF_WARN_ICON_CLASS}`);
		this._dupWarning = this.querySelector(`.${LF_DUP_WARNING_CLASS}`);

		if (this._input) {
			this._input.addEventListener("input", this._boundHandleInput);
			this._input.addEventListener("focus", this._boundHandleFocus);
			this._input.addEventListener("keydown", this._boundHandleKeyDown);
		}
		if (this._clearButton) {
			this._clearButton.addEventListener("click", this._boundHandleClear);
		}
		document.addEventListener("click", this._boundHandleClickOutside);
	}

	_syncFromAttributes() {
		this._endpoint = this.getAttribute("data-endpoint") || "";
		this._resultKey = this.getAttribute("data-result-key") || "items";
		this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), LF_DEFAULT_MIN_CHARS);
		this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), LF_DEFAULT_LIMIT);
		this._autocomplete = this.getAttribute("data-autocomplete") !== "false";
		this._placeholder = this.getAttribute("placeholder") || "";
		this._required = this.getAttribute("data-required") === "true";
		this._multiline = this.getAttribute("data-multiline") === "true";
		this._valueName = this.getAttribute("data-value-name") || "";
		this._textName = this.hasAttribute("data-text-name") ? this.getAttribute("data-text-name") || "" : "";
		this._valueFn = this._getFn(this.getAttribute("data-value-fn"));
		this._linkFn = this._getFn(this.getAttribute("data-link-fn"));
		this._validFn = this._getFn(this.getAttribute("data-valid-fn"));
		this._dupEndpoint = this.getAttribute("data-dup-endpoint") || "";
		this._dupResultKey = this.getAttribute("data-dup-result-key") || "";
		this._dupCurrentId = this.getAttribute("data-dup-current-id") || "";
		this._dupExact = this.getAttribute("data-dup-exact") !== "false";
		const initialName = this.getAttribute("data-initial-name") || "";
		const initialId = this.getAttribute("data-initial-id") || "";
		const initialMusenalmId = this.getAttribute("data-initial-musenalm-id") || "";
		if (initialId && initialName && !this._selected) {
			this._selected = { id: initialId, name: initialName, musenalm_id: initialMusenalmId || undefined };
			this._syncHiddenInput();
			if (this._input && !this._input.value) {
				this._input.value = initialName;
			}
		}
		if (this._input) {
			this._input.placeholder = this._placeholder;
		}
	}

	_getFn(name) {
		if (!name) {
			return null;
		}
		const fn = window[name];
		return typeof fn === "function" ? fn : null;
	}

	_applyInitialValue() {
		const valueAttr = this.getAttribute("value") || "";
		if (this._input && valueAttr && !this._input.value) {
			this._input.value = valueAttr;
		}
	}

	_handleInput(event) {
		const value = event.target.value.trim();
		this._selected = null;
		this._highlightedIndex = -1;
		this._syncHiddenInput();
		this._updateValidity();
		this._maybeCheckDuplicates(value);
		if (!this._autocomplete) {
			return;
		}
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
		if (this._input) {
			this._input.value = "";
		}
		this._selected = null;
		this._options = [];
		this._syncHiddenInput();
		this._updateValidity();
		this._renderOptions();
		this._hideList();
		this._maybeCheckDuplicates("");
		this.dispatchEvent(new CustomEvent("lfchange", { bubbles: true, detail: { item: null } }));
		this.dispatchEvent(new Event("change", { bubbles: true }));
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
		}, LF_FETCH_DEBOUNCE_MS);
	}

	async _fetchOptions(query) {
		if (!this._endpoint) {
			return;
		}
		if (this._fetchController) {
			this._fetchController.abort();
		}
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
			this._options = items
				.filter((item) => item && item.id && item.name)
				.map((item) => {
					if ("musenalm_id" in item && item.musenalm_id) {
						return item;
					}
					const musenalmId = item.MusenalmID || item.musenalmId || item.musenalmID || "";
					return musenalmId ? { ...item, musenalm_id: musenalmId } : item;
				});
			this._highlightedIndex = this._options.length > 0 ? 0 : -1;
			this._maybeAutoSelectExactMatch(query);
			this._renderOptions();
			if (this._options.length > 0) {
				if (this._options.length === 1 && this._isExactMatch(query, this._options[0]?.name || "")) {
					this._hideList();
				} else {
					this._showList();
				}
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
		this._options.forEach((item, idx) => {
			const option = document.createElement("button");
			option.type = "button";
			option.setAttribute("data-index", String(idx));
			option.className = `${LF_OPTION_CLASS} w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors`;
			const isHighlighted = idx === this._highlightedIndex;
			option.classList.toggle("bg-slate-100", isHighlighted);
			option.setAttribute("aria-selected", isHighlighted ? "true" : "false");

			const nameEl = document.createElement("div");
			nameEl.className = "text-sm font-semibold text-gray-800";
			nameEl.textContent = item.name;
			option.appendChild(nameEl);

			if (item.detail) {
				const detailEl = document.createElement("div");
				detailEl.className = "text-xs text-gray-600";
				detailEl.textContent = item.detail;
				option.appendChild(detailEl);
			}

			option.addEventListener("click", () => {
				this._selectOption(item);
			});
			this._list.appendChild(option);
		});
	}

	_selectOption(item) {
		this._selected = item;
		if (this._input) {
			this._input.value = item.name || "";
		}
		this._syncHiddenInput();
		this._updateValidity();
		this._hideList();
		this.dispatchEvent(new CustomEvent("lfchange", { bubbles: true, detail: { item } }));
		this.dispatchEvent(new Event("change", { bubbles: true }));
	}

	_isExactMatch(query, name) {
		const lhs = (query || "").trim().toLowerCase();
		const rhs = (name || "").trim().toLowerCase();
		return lhs !== "" && lhs === rhs;
	}

	_maybeAutoSelectExactMatch(query) {
		const match = this._options.find((item) => this._isExactMatch(query, item?.name || ""));
		if (!match) {
			return;
		}
		const prevId = this._selected?.id || "";
		this._selected = match;
		this._syncHiddenInput();
		this._updateValidity();
		if (match.id !== prevId) {
			this.dispatchEvent(new CustomEvent("lfchange", { bubbles: true, detail: { item: match } }));
			this.dispatchEvent(new Event("change", { bubbles: true }));
		}
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

	_syncHiddenInput() {
		if (!this._hiddenInput) {
			return;
		}
		let nextValue = "";
		if (this._valueFn && this._selected) {
			nextValue = String(this._valueFn({ item: this._selected, displayValue: this._input?.value || "" }) || "");
		} else if (this._selected?.id) {
			nextValue = this._selected.id;
		}
		this._hiddenInput.value = nextValue;
	}

	_updateValidity() {
		const displayValue = (this._input?.value || "").trim();
		const hiddenValue = (this._hiddenInput?.value || "").trim();
		let isValid = true;
		if (this._validFn) {
			isValid = Boolean(this._validFn({ value: hiddenValue || displayValue, displayValue, hiddenValue, item: this._selected }));
		} else if (this._required) {
			isValid = (hiddenValue || displayValue).length > 0;
		}

		const linkUrl = this._linkFn ? this._linkFn({ item: this._selected, value: hiddenValue || displayValue }) : "";
		if (this._warnIcon && this._linkButton) {
			if (!isValid) {
				this._warnIcon.classList.remove("hidden");
				this._linkButton.classList.add("hidden");
			} else if (linkUrl) {
				this._warnIcon.classList.add("hidden");
				this._linkButton.classList.remove("hidden");
				this._linkButton.setAttribute("href", linkUrl);
			} else {
				this._warnIcon.classList.add("hidden");
				this._linkButton.classList.add("hidden");
			}
		}

		if (this._clearButton) {
			const hasValue = displayValue.length > 0;
			this._clearButton.classList.toggle("hidden", !hasValue || !isValid);
			const icon = this._clearButton.querySelector("i");
			if (icon) {
				icon.className = "ri-check-line";
				this._clearButton.classList.add("text-green-600", "hover:text-green-800");
				this._clearButton.classList.remove("text-gray-600", "hover:text-gray-900");
			}
		}
	}

	_maybeCheckDuplicates(value) {
		if (!this._dupEndpoint || !this._dupResultKey || !this._dupWarning) {
			return;
		}
		if (this._dupTimeout) {
			clearTimeout(this._dupTimeout);
		}
		this._dupTimeout = setTimeout(() => {
			this._checkDuplicates(value);
		}, LF_FETCH_DEBOUNCE_MS);
	}

	async _checkDuplicates(value) {
		if (!this._dupEndpoint || !this._dupResultKey || !this._dupWarning) {
			return;
		}
		const trimmed = (value || "").trim();
		if (!trimmed) {
			this._dupWarning.classList.add("hidden");
			return;
		}
		try {
			const url = new URL(this._dupEndpoint, window.location.origin);
			url.searchParams.set("q", trimmed);
			url.searchParams.set("limit", "100");
			const resp = await fetch(url.toString());
			if (!resp.ok) {
				return;
			}
			const data = await resp.json();
			const results = data[this._dupResultKey] || [];
			let filtered = results;
			if (this._dupCurrentId) {
				filtered = results.filter((item) => item.id !== this._dupCurrentId);
			}
			const matches = this._dupExact
				? filtered.filter((item) => item.name && item.name.toLowerCase() === trimmed.toLowerCase())
				: filtered;
			if (matches.length > 0) {
				const textEl = this._dupWarning.querySelector("[data-role='dup-text']");
				if (textEl) {
					textEl.textContent = `Der Name ist bereits vorhanden (${matches.length} Treffer)`;
				}
				this._dupWarning.classList.remove("hidden");
			} else {
				this._dupWarning.classList.add("hidden");
			}
		} catch {
			this._dupWarning.classList.add("hidden");
		}
	}

	_parsePositiveInt(value, fallback) {
		const parsed = parseInt(value || "", 10);
		if (Number.isNaN(parsed) || parsed <= 0) {
			return fallback;
		}
		return parsed;
	}

	_showList() {
		if (!this._list) {
			return;
		}
		this._listVisible = true;
		this._list.classList.remove("hidden");
	}

	_hideList() {
		if (!this._list) {
			return;
		}
		this._listVisible = false;
		this._list.classList.add("hidden");
	}
}
