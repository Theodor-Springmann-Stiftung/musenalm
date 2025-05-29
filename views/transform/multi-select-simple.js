// --- Class Name Constants for MultiSelectSimple ---
const MSS_COMPONENT_WRAPPER_CLASS = "mss-component-wrapper";
const MSS_SELECTED_ITEMS_CONTAINER_CLASS = "mss-selected-items-container";
const MSS_SELECTED_ITEM_PILL_CLASS = "mss-selected-item-pill";
const MSS_SELECTED_ITEM_TEXT_CLASS = "mss-selected-item-text";
const MSS_SELECTED_ITEM_DELETE_BTN_CLASS = "mss-selected-item-delete-btn";
const MSS_INPUT_CONTROLS_CONTAINER_CLASS = "mss-input-controls-container"; // New container for input and create button
const MSS_INPUT_WRAPPER_CLASS = "mss-input-wrapper";
const MSS_TEXT_INPUT_CLASS = "mss-text-input";
const MSS_CREATE_NEW_BUTTON_CLASS = "mss-create-new-button";
const MSS_OPTIONS_LIST_CLASS = "mss-options-list";
const MSS_OPTION_ITEM_CLASS = "mss-option-item";
const MSS_OPTION_ITEM_NAME_CLASS = "mss-option-item-name";
const MSS_OPTION_ITEM_DETAIL_CLASS = "mss-option-item-detail";
const MSS_HIGHLIGHTED_OPTION_CLASS = "mss-option-item-highlighted";
const MSS_HIDDEN_SELECT_CLASS = "mss-hidden-select";
// State classes for MultiSelectSimple
const MSS_STATE_NO_SELECTION = "mss-state-no-selection";
const MSS_STATE_HAS_SELECTION = "mss-state-has-selection";
const MSS_STATE_LIST_OPEN = "mss-state-list-open";

// --- MultiSelectSimple Element ---
export class MultiSelectSimple extends HTMLElement {
	static formAssociated = true;

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this._value = []; // Array of selected item IDs
		this._options = [
			// Default options
			{ id: "opt1", name: "Option Alpha", additional_data: "Info A" },
			{ id: "opt2", name: "Option Beta", additional_data: "Info B" },
			{ id: "opt3", name: "Option Gamma", additional_data: "Info C" },
			{ id: "opt4", name: "Option Delta", additional_data: "Info D" },
		];
		this._filteredOptions = [];
		this._highlightedIndex = -1;
		this._isOptionsListVisible = false;

		this._setupTemplates();
		this._bindEventHandlers();
	}

	_setupTemplates() {
		this.optionTemplate = document.createElement("template");
		this.optionTemplate.innerHTML = `
                    <li role="option" class="${MSS_OPTION_ITEM_CLASS} px-3 py-2 text-sm cursor-pointer transition-colors duration-75 group">
                        <span data-ref="nameEl" class="${MSS_OPTION_ITEM_NAME_CLASS} font-semibold"></span>
                        <span data-ref="detailEl" class="${MSS_OPTION_ITEM_DETAIL_CLASS} text-xs ml-2"></span>
                    </li>
                `;

		this.selectedItemTemplate = document.createElement("template");
		this.selectedItemTemplate.innerHTML = `
                    <span class="${MSS_SELECTED_ITEM_PILL_CLASS} flex items-center">
                        <span data-ref="textEl" class="${MSS_SELECTED_ITEM_TEXT_CLASS}"></span>
                        <button type="button" data-ref="deleteBtn" class="${MSS_SELECTED_ITEM_DELETE_BTN_CLASS} ml-1.5 text-xs">&times;</button>
                    </span>
                `;
	}

	_bindEventHandlers() {
		this._handleInput = this._handleInput.bind(this);
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this._handleFocus = this._handleFocus.bind(this);
		this._handleBlur = this._handleBlur.bind(this);
		this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this);
		this._handleOptionClick = this._handleOptionClick.bind(this);
		this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this);
	}

	_getItemById(id) {
		return this._options.find((opt) => opt.id === id);
	}

	// --- Public Methods ---
	setOptions(newOptions) {
		if (
			Array.isArray(newOptions) &&
			newOptions.every((o) => o && typeof o.id === "string" && typeof o.name === "string")
		) {
			this._options = [...newOptions];
			const validValues = this._value.filter((id) => this._getItemById(id));
			if (validValues.length !== this._value.length) {
				this.value = validValues;
			}
			this._filteredOptions = [];
			this._highlightedIndex = -1;
			if (this.inputElement && this.inputElement.value) {
				this._handleInput({ target: this.inputElement });
			} else {
				this._hideOptionsList();
			}
		} else {
			console.error("setOptions expects an array of objects with id and name properties.");
		}
	}

	get value() {
		return this._value;
	}

	set value(newVal) {
		if (Array.isArray(newVal)) {
			this._value = [
				...new Set(newVal.filter((id) => typeof id === "string" && this._getItemById(id))),
			];
		} else {
			this._value = [];
		}
		this._updateFormValue();
		if (this.selectedItemsContainer) this._renderSelectedItems();
		this._updateRootElementStateClasses();
	}

	get name() {
		return this.getAttribute("name");
	}
	set name(value) {
		this.setAttribute("name", value);
		if (this.hiddenSelect) this.hiddenSelect.name = value;
	}

	connectedCallback() {
		this._render();
		this.inputControlsContainer = this.querySelector(`.${MSS_INPUT_CONTROLS_CONTAINER_CLASS}`);
		this.inputWrapper = this.querySelector(`.${MSS_INPUT_WRAPPER_CLASS}`);
		this.inputElement = this.querySelector(`.${MSS_TEXT_INPUT_CLASS}`);
		this.createNewButton = this.querySelector(`.${MSS_CREATE_NEW_BUTTON_CLASS}`);
		this.optionsListElement = this.querySelector(`.${MSS_OPTIONS_LIST_CLASS}`);
		this.selectedItemsContainer = this.querySelector(`.${MSS_SELECTED_ITEMS_CONTAINER_CLASS}`);
		this.hiddenSelect = this.querySelector(`.${MSS_HIDDEN_SELECT_CLASS}`);

		if (this.name && this.hiddenSelect) this.hiddenSelect.name = this.name;

		this.inputElement.addEventListener("input", this._handleInput);
		this.inputElement.addEventListener("keydown", this._handleKeyDown);
		this.inputElement.addEventListener("focus", this._handleFocus);
		this.inputElement.addEventListener("blur", this._handleBlur);
		this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown);
		this.optionsListElement.addEventListener("click", this._handleOptionClick);
		this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick);

		this._updateRootElementStateClasses();
		// Create button is always visible now, visibility logic removed from _handleInput
		// this.createNewButton.classList.add('hidden'); // No longer initially hidden by default in JS

		if (this.hasAttribute("value")) {
			try {
				this.value = JSON.parse(this.getAttribute("value"));
			} catch (e) {
				this.value = this.getAttribute("value")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			}
		} else {
			this._renderSelectedItems();
			this._synchronizeHiddenSelect();
		}
		if (this.hasAttribute("disabled")) this.disabledCallback(true);
	}

	disconnectedCallback() {
		if (this.inputElement) {
			this.inputElement.removeEventListener("input", this._handleInput);
			this.inputElement.removeEventListener("keydown", this._handleKeyDown);
			this.inputElement.removeEventListener("focus", this._handleFocus);
			this.inputElement.removeEventListener("blur", this._handleBlur);
		}
		if (this.optionsListElement) {
			this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown);
			this.optionsListElement.removeEventListener("click", this._handleOptionClick);
		}
		if (this.createNewButton) {
			this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick);
		}
		clearTimeout(this._blurTimeout);
	}

	formAssociatedCallback(form) {}
	formDisabledCallback(disabled) {
		this.disabledCallback(disabled);
	}
	formResetCallback() {
		this.value = [];
		this._hideOptionsList();
		if (this.inputElement) this.inputElement.value = "";
		// Create button visibility is not tied to reset, it's always shown
		this._updateRootElementStateClasses();
	}
	formStateRestoreCallback(state, mode) {
		this.value = Array.isArray(state) ? state : [];
		this._updateRootElementStateClasses();
	}

	_synchronizeHiddenSelect() {
		if (!this.hiddenSelect) return;
		this.hiddenSelect.innerHTML = "";
		this._value.forEach((id) => {
			const option = document.createElement("option");
			option.value = id;
			option.textContent = id;
			option.selected = true;
			this.hiddenSelect.appendChild(option);
		});
	}

	_updateFormValue() {
		this.internals_.setFormValue(null);
		this._synchronizeHiddenSelect();
	}

	disabledCallback(disabled) {
		if (this.inputElement) this.inputElement.disabled = disabled;
		if (this.createNewButton) this.createNewButton.disabled = disabled;
		this.classList.toggle("opacity-50", disabled);
		this.classList.toggle("cursor-not-allowed", disabled);
		if (this.selectedItemsContainer)
			this.selectedItemsContainer.classList.toggle("pointer-events-none", disabled);
		this.querySelectorAll(`.${MSS_SELECTED_ITEM_DELETE_BTN_CLASS}`).forEach(
			(btn) => (btn.disabled = disabled),
		);
		if (this.hiddenSelect) this.hiddenSelect.disabled = disabled;
	}

	_updateRootElementStateClasses() {
		this.classList.toggle(MSS_STATE_NO_SELECTION, this._value.length === 0);
		this.classList.toggle(MSS_STATE_HAS_SELECTION, this._value.length > 0);
		this.classList.toggle(MSS_STATE_LIST_OPEN, this._isOptionsListVisible);
	}

	_render() {
		const componentId = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
		if (!this.id) this.setAttribute("id", componentId);
		this.innerHTML = `
                    <style> .${MSS_HIDDEN_SELECT_CLASS} { display: none !important; visibility: hidden !important; position: absolute !important; width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important; } </style>
                    <div class="${MSS_COMPONENT_WRAPPER_CLASS} relative">
                        <div class="${MSS_SELECTED_ITEMS_CONTAINER_CLASS} flex flex-wrap gap-1 mb-1 min-h-[38px]" aria-live="polite"></div>
                        <div class="${MSS_INPUT_CONTROLS_CONTAINER_CLASS} flex items-center space-x-2">
                            <div class="${MSS_INPUT_WRAPPER_CLASS} relative rounded-md flex items-center flex-grow">
                                <input type="text" class="${MSS_TEXT_INPUT_CLASS} w-full outline-none bg-transparent p-1.5 text-sm" placeholder="Search items..."/>
                            </div>
                            <button type="button" class="${MSS_CREATE_NEW_BUTTON_CLASS} px-2 py-1 text-xs rounded-sm">                                 +
                            </button>
                        </div>
                        <ul role="listbox" class="${MSS_OPTIONS_LIST_CLASS} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "simple_items_default"}" id="hidden-select-${componentId}" class="${MSS_HIDDEN_SELECT_CLASS}" aria-hidden="true"></select>
                    </div>
                `;
	}

	_createSelectedItemElement(itemId) {
		const itemData = this._getItemById(itemId);
		if (!itemData) return null;
		const fragment = this.selectedItemTemplate.content.cloneNode(true);
		const pillEl = fragment.firstElementChild;
		const textEl = pillEl.querySelector('[data-ref="textEl"]');
		textEl.textContent = itemData.name;
		if (itemData.additional_data) {
			const detailSpan = document.createElement("span");
			detailSpan.className = "ml-1 opacity-75 text-xs";
			detailSpan.textContent = `(${itemData.additional_data})`;
			textEl.appendChild(detailSpan);
		}

		const deleteBtn = pillEl.querySelector('[data-ref="deleteBtn"]');
		deleteBtn.setAttribute("aria-label", `Remove ${itemData.name}`);
		deleteBtn.dataset.id = itemId;
		deleteBtn.disabled = this.hasAttribute("disabled");
		deleteBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this._handleDeleteSelectedItem(itemId);
		});
		return pillEl;
	}

	_renderSelectedItems() {
		if (!this.selectedItemsContainer) return;
		this.selectedItemsContainer.innerHTML = "";
		this._value.forEach((id) => {
			const pillEl = this._createSelectedItemElement(id);
			if (pillEl) this.selectedItemsContainer.appendChild(pillEl);
		});
		if (this._value.length === 0) {
			this.selectedItemsContainer.innerHTML = `<span class="italic text-xs">No items selected</span>`;
		}
		this._updateRootElementStateClasses();
	}

	_createOptionElement(itemData, index) {
		const fragment = this.optionTemplate.content.cloneNode(true);
		const li = fragment.firstElementChild;
		const nameEl = li.querySelector('[data-ref="nameEl"]');
		const detailEl = li.querySelector('[data-ref="detailEl"]');
		nameEl.textContent = itemData.name;
		detailEl.textContent = itemData.additional_data ? `(${itemData.additional_data})` : "";
		li.dataset.id = itemData.id;
		li.setAttribute("aria-selected", String(index === this._highlightedIndex));
		if (index === this._highlightedIndex) {
			li.classList.add(MSS_HIGHLIGHTED_OPTION_CLASS);
			li.id = `highlighted-option-${this.id || "multi-select-simple"}`;
		}
		return li;
	}

	_renderOptionsList() {
		if (!this.optionsListElement) return;
		this.optionsListElement.innerHTML = "";
		if (this._filteredOptions.length === 0 || !this._isOptionsListVisible) {
			this.optionsListElement.classList.add("hidden");
		} else {
			this.optionsListElement.classList.remove("hidden");
			this._filteredOptions.forEach((item, index) => {
				const optionEl = this._createOptionElement(item, index);
				this.optionsListElement.appendChild(optionEl);
			});
			const highlightedElement = this.optionsListElement.querySelector(
				`#highlighted-option-${this.id || "multi-select-simple"}`,
			);
			if (highlightedElement) highlightedElement.scrollIntoView({ block: "nearest" });
		}
		this._updateRootElementStateClasses();
	}

	_handleCreateNewButtonClick() {
		const inputValue = this.inputElement ? this.inputElement.value.trim() : "";
		console.log(`"Create New" button clicked. Current input value: "${inputValue}"`);
		// User will implement the actual creation logic here.
	}

	_handleInput(event) {
		const searchTerm = event.target.value;

		// "Create New" button is always visible, no need to toggle based on input here.

		if (searchTerm.length === 0) {
			this._filteredOptions = [];
			this._isOptionsListVisible = false;
		} else {
			const searchTermLower = searchTerm.toLowerCase();
			this._filteredOptions = this._options.filter((item) => {
				if (this._value.includes(item.id)) return false;
				return (
					item.name.toLowerCase().includes(searchTermLower) ||
					(item.additional_data && item.additional_data.toLowerCase().includes(searchTermLower))
				);
			});
			this._isOptionsListVisible = this._filteredOptions.length > 0;
		}
		this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1;
		this._renderOptionsList();
	}

	_handleKeyDown(event) {
		if (this.inputElement.disabled) return;
		if (event.key === "Backspace") {
			return;
		}
		if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
			if (event.key === "Escape") this._hideOptionsList();
			return;
		}
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length;
				this._renderOptionsList();
				break;
			case "ArrowUp":
				event.preventDefault();
				this._highlightedIndex =
					(this._highlightedIndex - 1 + this._filteredOptions.length) %
					this._filteredOptions.length;
				this._renderOptionsList();
				break;
			case "Enter":
				event.preventDefault();
				if (this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex]) {
					this._selectItem(this._filteredOptions[this._highlightedIndex].id);
				}
				break;
			case "Escape":
				event.preventDefault();
				this._hideOptionsList();
				break;
			case "Tab":
				this._hideOptionsList();
				break;
		}
	}

	_hideOptionsList() {
		this._isOptionsListVisible = false;
		this._highlightedIndex = -1;
		if (this.optionsListElement) this._renderOptionsList();
	}

	_handleFocus() {
		if (this.inputElement.disabled) return;
		if (this.inputWrapper)
			this.inputWrapper.classList.add(
				"border",
				"border-gray-300",
				"focus-within:border-blue-500",
				"focus-within:ring-1",
				"focus-within:ring-blue-500",
			);

		if (this.inputElement.value.length > 0) {
			this._handleInput({ target: this.inputElement });
		} else {
			this._hideOptionsList();
		}
		this._updateRootElementStateClasses();
	}

	_blurTimeout = null;
	_handleBlur() {
		if (this.inputWrapper)
			this.inputWrapper.classList.remove(
				"border",
				"border-gray-300",
				"focus-within:border-blue-500",
				"focus-within:ring-1",
				"focus-within:ring-blue-500",
			);

		this._blurTimeout = setTimeout(() => {
			if (
				!this.contains(document.activeElement) ||
				document.activeElement === this.createNewButton
			) {
				if (
					document.activeElement !== this.createNewButton &&
					!(this.optionsListElement && this.optionsListElement.contains(document.activeElement))
				) {
					this._hideOptionsList();
				}
			}
		}, 150);
	}

	_handleOptionMouseDown(event) {
		event.preventDefault();
	}

	_handleOptionClick(event) {
		const li = event.target.closest("li[data-id]");
		if (li) {
			const itemId = li.dataset.id;
			this._selectItem(itemId);
		}
	}

	_selectItem(itemId) {
		if (itemId && !this._value.includes(itemId)) {
			this._value.push(itemId);
			this._updateFormValue();
			this._renderSelectedItems();
		}
		if (this.inputElement) this.inputElement.value = "";
		this._filteredOptions = [];
		this._hideOptionsList();
		// Create button remains visible
		if (this.inputElement) this.inputElement.focus();
	}

	_handleDeleteSelectedItem(itemId) {
		this._value = this._value.filter((id) => id !== itemId);
		this._updateFormValue();
		this._renderSelectedItems();
		if (this.inputElement) {
			this.inputElement.focus();
			this._handleInput({ target: this.inputElement });
		}
	}
}
customElements.define("multi-select-simple", MultiSelectSimple);

// --- Demo Page Script for MultiSelectSimple ---
const myFormSimple = document.getElementById("myFormSimple");
const formDataDisplaySimple = document.getElementById("form-data-display-simple");
const formDataPreSimple = formDataDisplaySimple.querySelector("pre");

myFormSimple.addEventListener("submit", function (event) {
	event.preventDefault();
	const formData = new FormData(this);
	let output = "";
	console.log("Simple Form Submitted. FormData entries:");
	for (let [name, value] of formData.entries()) {
		console.log(`FormData - ${name}: ${value}`);
		output += `FormData - ${name}: ${value}\n`;
	}
	const simpleItemSelectEl = document.getElementById("simple-item-select");
	output += `\nCustom element .value (IDs): [${simpleItemSelectEl.value.join(", ")}]`;

	formDataPreSimple.textContent = output;
	formDataDisplaySimple.classList.remove("hidden");
});

myFormSimple.addEventListener("reset", function (event) {
	console.log("Simple Form reset!");
	formDataPreSimple.textContent = "";
	formDataDisplaySimple.classList.add("hidden");
	setTimeout(() => {
		const el = document.getElementById("simple-item-select");
		if (el) {
			console.log(`simple-item-select .value after reset:`, el.value);
			if (el.hiddenSelect) {
				const hiddenOptions = Array.from(el.hiddenSelect.options).map((opt) => opt.value);
				console.log(`simple-item-select hidden select values:`, hiddenOptions);
			}
		}
	}, 0);
});
