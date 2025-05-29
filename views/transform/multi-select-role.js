// --- Klassennamen-Konstanten für Styling ---
const MSR_COMPONENT_WRAPPER_CLASS = "msr-component-wrapper";
const MSR_SELECTED_ITEMS_CONTAINER_CLASS = "msr-selected-items-container";
const MSR_PLACEHOLDER_NO_SELECTION_TEXT_CLASS = "msr-placeholder-no-selection-text";
const MSR_SELECTED_ITEM_PILL_CLASS = "msr-selected-item-pill";
const MSR_SELECTED_ITEM_TEXT_CLASS = "msr-selected-item-text";
const MSR_ITEM_NAME_CLASS = "msr-item-name";
const MSR_ITEM_ADDITIONAL_DATA_CLASS = "msr-item-additional-data";
const MSR_SELECTED_ITEM_ROLE_CLASS = "msr-selected-item-role";
const MSR_SELECTED_ITEM_DELETE_BTN_CLASS = "msr-selected-item-delete-btn";

const MSR_CONTROLS_AREA_CLASS = "msr-controls-area";
const MSR_PRE_ADD_BUTTON_CLASS = "msr-pre-add-button";
const MSR_INPUT_AREA_WRAPPER_CLASS = "msr-input-area-wrapper";
const MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS = "msr-input-area-default-border";
const MSR_INPUT_AREA_WRAPPER_STAGED_CLASS = "msr-input-area-staged";

const MSR_STAGING_AREA_CONTAINER_CLASS = "msr-staging-area-container";
const MSR_STAGED_ITEM_PILL_CLASS = "msr-staged-item-pill";
const MSR_STAGED_ITEM_TEXT_CLASS = "msr-staged-item-text";
const MSR_STAGED_ROLE_SELECT_CLASS = "msr-staged-role-select";
const MSR_STAGED_CANCEL_BTN_CLASS = "msr-staged-cancel-btn";

const MSR_TEXT_INPUT_CLASS = "msr-text-input";
const MSR_ADD_BUTTON_CLASS = "msr-add-button";

const MSR_OPTIONS_LIST_CLASS = "msr-options-list";
const MSR_OPTION_ITEM_CLASS = "msr-option-item";
const MSR_OPTION_ITEM_NAME_CLASS = "msr-option-item-name";
const MSR_OPTION_ITEM_DETAIL_CLASS = "msr-option-item-detail";
const MSR_HIGHLIGHTED_OPTION_CLASS = "msr-option-item-highlighted";
const MSR_HIDDEN_SELECT_CLASS = "msr-hidden-select";

// --- Statusklassen für das Root-Element ---
const MSR_STATE_NO_SELECTION = "msr-state-no-selection";
const MSR_STATE_HAS_SELECTION = "msr-state-has-selection";
const MSR_STATE_LIST_OPEN = "msr-state-list-open";
const MSR_STATE_ITEM_STAGED = "msr-state-item-staged";

export class MultiSelectRole extends HTMLElement {
	static formAssociated = true;
	static get observedAttributes() {
		return [
			"disabled",
			"name",
			"value",
			"show-add-button",
			"placeholder-no-selection",
			"placeholder-search",
			"placeholder-role-select",
		];
	}

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this._value = [];
		this._stagedItem = null;
		this._showAddButton = true;

		this._placeholderNoSelection = "Keine Elemente ausgewählt";
		this._placeholderSearch = "Elemente suchen...";
		this._placeholderRoleSelect = "Rolle auswählen...";

		this._options = [];
		this._roles = [
			"Leitung",
			"Unterstützung",
			"Berater",
			"Beobachter",
			"Spezialist",
			"Koordinator",
		];

		this._filteredOptions = [];
		this._highlightedIndex = -1;
		this._isOptionsListVisible = false;

		this._setupTemplates();
		this._bindEventHandlers();
	}

	get showAddButton() {
		return this._showAddButton;
	}
	set showAddButton(value) {
		const newValue = typeof value === "string" ? value.toLowerCase() !== "false" : Boolean(value);
		if (this._showAddButton !== newValue) {
			this._showAddButton = newValue;
			this.setAttribute("show-add-button", String(newValue));
			if (this.preAddButtonElement) {
				this._updatePreAddButtonVisibility();
			}
		}
	}

	get placeholderNoSelection() {
		return this._placeholderNoSelection;
	}
	set placeholderNoSelection(value) {
		const newValue = String(value || "Keine Elemente ausgewählt");
		if (this._placeholderNoSelection !== newValue) {
			this._placeholderNoSelection = newValue;
			this.setAttribute("placeholder-no-selection", newValue);
			if (this.selectedItemsContainer && this._value.length === 0) {
				this._renderSelectedItems();
			}
		}
	}

	get placeholderSearch() {
		return this._placeholderSearch;
	}
	set placeholderSearch(value) {
		const newValue = String(value || "Elemente suchen...");
		if (this._placeholderSearch !== newValue) {
			this._placeholderSearch = newValue;
			this.setAttribute("placeholder-search", newValue);
			if (this.inputElement) {
				this.inputElement.placeholder = newValue;
			}
		}
	}

	get placeholderRoleSelect() {
		return this._placeholderRoleSelect;
	}
	set placeholderRoleSelect(value) {
		const newValue = String(value || "Rolle auswählen...");
		if (this._placeholderRoleSelect !== newValue) {
			this._placeholderRoleSelect = newValue;
			this.setAttribute("placeholder-role-select", newValue);
			if (this._stagedItem && this.stagedItemPillContainer) {
				this._renderStagedPillOrInput();
			}
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		switch (name) {
			case "disabled":
				this.disabledCallback(this.hasAttribute("disabled"));
				break;
			case "name":
				if (this.hiddenSelect) this.hiddenSelect.name = newValue;
				break;
			case "value":
				break;
			case "show-add-button":
				this.showAddButton = newValue;
				break;
			case "placeholder-no-selection":
				this.placeholderNoSelection = newValue;
				break;
			case "placeholder-search":
				this.placeholderSearch = newValue;
				break;
			case "placeholder-role-select":
				this.placeholderRoleSelect = newValue;
				break;
		}
	}

	_setupTemplates() {
		this.optionTemplate = document.createElement("template");
		this.optionTemplate.innerHTML = `
                    <li role="option" class="${MSR_OPTION_ITEM_CLASS} group">
                        <span data-ref="nameEl" class="${MSR_OPTION_ITEM_NAME_CLASS}"></span>
                        <span data-ref="detailEl" class="${MSR_OPTION_ITEM_DETAIL_CLASS}"></span>
                    </li>
                `;

		this.selectedItemTemplate = document.createElement("template");
		this.selectedItemTemplate.innerHTML = `
                    <span class="${MSR_SELECTED_ITEM_PILL_CLASS} group">
                        <span data-ref="textEl" class="${MSR_SELECTED_ITEM_TEXT_CLASS}"></span>
                        <button type="button" data-ref="deleteBtn" class="${MSR_SELECTED_ITEM_DELETE_BTN_CLASS} ml-2">&times;</button>
                    </span>
                `;

		this.stagedPlacePillTemplate = document.createElement("template");
		this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${MSR_STAGED_ITEM_PILL_CLASS} flex items-center">
                        <span data-ref="nameEl" class="${MSR_STAGED_ITEM_TEXT_CLASS}"></span>
                    </span>
                `;

		this.stagedCancelBtnTemplate = document.createElement("template");
		this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${MSR_STAGED_CANCEL_BTN_CLASS} flex items-center justify-center">&times;</button>
                `;

		this.stagedRoleSelectTemplate = document.createElement("template");
		this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${MSR_STAGED_ROLE_SELECT_CLASS}">
                    </select>
                `;
	}

	_bindEventHandlers() {
		this._handleInput = this._handleInput.bind(this);
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this._handleInputKeyDown = this._handleInputKeyDown.bind(this);
		this._handleFocus = this._handleFocus.bind(this);
		this._handleBlur = this._handleBlur.bind(this);
		this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this);
		this._handleOptionClick = this._handleOptionClick.bind(this);
		this._handleAddButtonClick = this._handleAddButtonClick.bind(this);
		this._handleCancelStagedItem = this._handleCancelStagedItem.bind(this);
		this._handleStagedRoleChange = this._handleStagedRoleChange.bind(this);
	}

	_getItemById(id) {
		return this._options.find((opt) => opt.id === id);
	}

	_getAvailableRolesForItem(itemId) {
		const assignedRoles = this._value
			.filter((item) => item.itemId === itemId)
			.map((item) => item.role);
		return this._roles.filter((role) => !assignedRoles.includes(role));
	}

	setRoles(newRoles) {
		if (Array.isArray(newRoles) && newRoles.every((r) => typeof r === "string")) {
			this._roles = [...newRoles];
			if (this._stagedItem && this._stagedItem.item) {
				const availableRoles = this._getAvailableRolesForItem(this._stagedItem.item.id);
				if (!availableRoles.includes(this._stagedItem.currentRole)) {
					this._stagedItem.currentRole = "";
				}
				this._renderStagedPillOrInput();
				this._updateAddButtonState();
			}
			const validValues = this._value.filter((item) => this._roles.includes(item.role));
			if (validValues.length !== this._value.length) {
				this.value = validValues.map((item) => `${item.itemId},${item.role}`);
			}
		} else {
			console.error("setRoles expects an array of strings.");
		}
	}

	setOptions(newOptions) {
		if (
			Array.isArray(newOptions) &&
			newOptions.every((o) => o && typeof o.id === "string" && typeof o.name === "string")
		) {
			this._options = [...newOptions];
			const validValues = this._value.filter((valItem) => this._getItemById(valItem.itemId));
			if (validValues.length !== this._value.length) {
				this.value = validValues.map((item) => `${item.itemId},${item.role}`);
			}
			if (
				this._stagedItem &&
				this._stagedItem.item &&
				!this._getItemById(this._stagedItem.item.id)
			) {
				this._handleCancelStagedItem();
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

	set value(val) {
		if (Array.isArray(val)) {
			const newInternalValue = val
				.map((itemStr) => {
					if (typeof itemStr === "string") {
						const parts = itemStr.split(",");
						if (parts.length === 2) {
							const itemId = parts[0].trim();
							const roleName = parts[1].trim();
							const item = this._getItemById(itemId);
							if (item && this._roles.includes(roleName)) {
								return { itemId: itemId, role: roleName, instanceId: crypto.randomUUID() };
							}
						}
					}
					return null;
				})
				.filter((item) => item !== null);
			const uniqueValues = [];
			const seen = new Set();
			for (const item of newInternalValue) {
				const key = `${item.itemId},${item.role}`;
				if (!seen.has(key)) {
					uniqueValues.push(item);
					seen.add(key);
				}
			}
			this._value = uniqueValues;
		} else {
			this._value = [];
		}
		this._updateFormValue();
		if (this.selectedItemsContainer) {
			this._renderSelectedItems();
		}
		this._updateRootElementStateClasses();
	}

	get name() {
		return this.getAttribute("name");
	}
	set name(value) {
		this.setAttribute("name", value);
		if (this.hiddenSelect) {
			this.hiddenSelect.name = value;
		}
	}

	connectedCallback() {
		this.placeholderNoSelection =
			this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection;
		this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch;
		this.placeholderRoleSelect =
			this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect;

		this._render();

		this.inputAreaWrapper = this.querySelector(`.${MSR_INPUT_AREA_WRAPPER_CLASS}`);
		this.inputElement = this.querySelector(`.${MSR_TEXT_INPUT_CLASS}`);
		this.stagedItemPillContainer = this.querySelector(`.${MSR_STAGING_AREA_CONTAINER_CLASS}`);
		this.optionsListElement = this.querySelector(`.${MSR_OPTIONS_LIST_CLASS}`);
		this.selectedItemsContainer = this.querySelector(`.${MSR_SELECTED_ITEMS_CONTAINER_CLASS}`);
		this.addButtonElement = this.querySelector(`.${MSR_ADD_BUTTON_CLASS}`);
		this.preAddButtonElement = this.querySelector(`.${MSR_PRE_ADD_BUTTON_CLASS}`);
		this.hiddenSelect = this.querySelector(`.${MSR_HIDDEN_SELECT_CLASS}`);

		if (this.name && this.hiddenSelect) {
			this.hiddenSelect.name = this.name;
		}

		if (this.hasAttribute("show-add-button")) {
			this.showAddButton = this.getAttribute("show-add-button");
		} else {
			this.setAttribute("show-add-button", String(this._showAddButton));
		}
		if (this.inputElement) this.inputElement.placeholder = this.placeholderSearch;

		this.inputElement.addEventListener("input", this._handleInput);
		this.inputElement.addEventListener("keydown", this._handleInputKeyDown);
		this.inputElement.addEventListener("focus", this._handleFocus);
		this.inputElement.addEventListener("blur", this._handleBlur);
		this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown);
		this.optionsListElement.addEventListener("click", this._handleOptionClick);
		this.addButtonElement.addEventListener("click", this._handleAddButtonClick);
		this.addEventListener("keydown", this._handleKeyDown);

		this._renderStagedPillOrInput();
		this._updateAddButtonState();
		this._updatePreAddButtonVisibility();
		this._updateRootElementStateClasses();

		if (this.hasAttribute("value")) {
			const attrValue = this.getAttribute("value");
			try {
				const parsedValue = JSON.parse(attrValue);
				if (Array.isArray(parsedValue)) {
					this.value = parsedValue;
				} else {
					console.warn("Parsed value attribute is not an array:", parsedValue);
					this.value = [];
				}
			} catch (e) {
				console.warn("Failed to parse value attribute as JSON array. Attribute was:", attrValue, e);
				if (attrValue.startsWith("[") && attrValue.endsWith("]")) {
					try {
						const items = attrValue
							.slice(1, -1)
							.split(",")
							.map((s) => s.replace(/"/g, "").trim())
							.filter((s) => s);
						this.value = items;
					} catch (e2) {
						console.error("Manual parse of value attribute also failed:", attrValue, e2);
						this.value = [];
					}
				} else if (attrValue.includes(",")) {
					this.value = [attrValue];
				} else {
					this.value = [];
				}
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
			this.inputElement.removeEventListener("keydown", this._handleInputKeyDown);
			this.inputElement.removeEventListener("focus", this._handleFocus);
			this.inputElement.removeEventListener("blur", this._handleBlur);
		}
		if (this.optionsListElement) {
			this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown);
			this.optionsListElement.removeEventListener("click", this._handleOptionClick);
		}
		if (this.addButtonElement) {
			this.addButtonElement.removeEventListener("click", this._handleAddButtonClick);
		}
		this.removeEventListener("keydown", this._handleKeyDown);
		clearTimeout(this._blurTimeout);
	}

	formAssociatedCallback(form) {}

	formDisabledCallback(disabled) {
		this.disabledCallback(disabled);
	}

	disabledCallback(disabled) {
		if (this.inputElement) this.inputElement.disabled = disabled;

		this.classList.toggle("pointer-events-none", disabled);

		this.querySelectorAll(`.${MSR_SELECTED_ITEM_DELETE_BTN_CLASS}`).forEach(
			(btn) => (btn.disabled = disabled),
		);

		const stagedRoleSelect = this.querySelector(`.${MSR_STAGED_ROLE_SELECT_CLASS}`);
		if (stagedRoleSelect) stagedRoleSelect.disabled = disabled;

		if (this.hiddenSelect) this.hiddenSelect.disabled = disabled;

		this._updateAddButtonState();
		this._updatePreAddButtonVisibility();
	}

	formResetCallback() {
		this.value = [];
		this._stagedItem = null;
		this._renderStagedPillOrInput();
		this._hideOptionsList();
		if (this.inputElement) this.inputElement.value = "";
		this._updateRootElementStateClasses();
	}

	formStateRestoreCallback(state, mode) {
		if (Array.isArray(state) && state.every((s) => typeof s === "string" && s.includes(","))) {
			this.value = state;
		} else {
			this.value = [];
		}
		this._updateRootElementStateClasses();
		this._updatePreAddButtonVisibility();
	}

	_synchronizeHiddenSelect() {
		if (!this.hiddenSelect) return;
		this.hiddenSelect.innerHTML = "";
		this._value.forEach((item) => {
			const option = document.createElement("option");
			option.value = `${item.itemId},${item.role}`;
			option.textContent = `${this._getItemById(item.itemId)?.name || item.itemId} (${item.role})`;
			option.selected = true;
			this.hiddenSelect.appendChild(option);
		});
	}

	_updateFormValue() {
		this.internals_.setFormValue(null);
		this._synchronizeHiddenSelect();
	}

	_updateRootElementStateClasses() {
		this.classList.toggle(MSR_STATE_NO_SELECTION, this._value.length === 0);
		this.classList.toggle(MSR_STATE_HAS_SELECTION, this._value.length > 0);
		this.classList.toggle(MSR_STATE_LIST_OPEN, this._isOptionsListVisible);
		this.classList.toggle(MSR_STATE_ITEM_STAGED, !!this._stagedItem);
	}

	_render() {
		const componentId = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
		if (!this.id) {
			this.setAttribute("id", componentId);
		}

		this.innerHTML = `
                    <style>
                        .${MSR_HIDDEN_SELECT_CLASS} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${MSR_COMPONENT_WRAPPER_CLASS} relative">
                        <div class="${MSR_SELECTED_ITEMS_CONTAINER_CLASS} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${MSR_PLACEHOLDER_NO_SELECTION_TEXT_CLASS}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${MSR_CONTROLS_AREA_CLASS} flex items-center">
                            <div class="${MSR_INPUT_AREA_WRAPPER_CLASS} ${MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${MSR_STAGING_AREA_CONTAINER_CLASS} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${MSR_TEXT_INPUT_CLASS} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${MSR_PRE_ADD_BUTTON_CLASS} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${MSR_ADD_BUTTON_CLASS} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${componentId}-options-list" class="${MSR_OPTIONS_LIST_CLASS} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${componentId}" class="${MSR_HIDDEN_SELECT_CLASS}" aria-hidden="true"></select>
                    </div>
                `;
	}

	_createStagedItemPillElement(itemData) {
		const fragment = this.stagedPlacePillTemplate.content.cloneNode(true);
		const pill = fragment.firstElementChild;
		pill.querySelector('[data-ref="nameEl"]').textContent = itemData.name;
		return pill;
	}

	_createStagedRoleSelectElement(availableRoles, currentRole) {
		const fragment = this.stagedRoleSelectTemplate.content.cloneNode(true);
		const roleSelect = fragment.firstElementChild;

		let optionsHtml = `<option value="" disabled ${!currentRole ? "selected" : ""}>${this.placeholderRoleSelect}</option>`;

		if (availableRoles.length === 0 && !this._roles.includes(currentRole)) {
			optionsHtml += `<option disabled>Keine Rollen verfügbar</option>`;
			roleSelect.disabled = true;
		} else {
			availableRoles.forEach((roleName) => {
				optionsHtml += `<option value="${roleName}" ${roleName === currentRole ? "selected" : ""}>${roleName}</option>`;
			});
			roleSelect.disabled = availableRoles.length === 0 && currentRole === "";
		}
		roleSelect.innerHTML = optionsHtml;
		roleSelect.addEventListener("change", this._handleStagedRoleChange);
		return roleSelect;
	}

	_createStagedCancelButtonElement(itemName) {
		const fragment = this.stagedCancelBtnTemplate.content.cloneNode(true);
		const button = fragment.firstElementChild;
		button.setAttribute("aria-label", `Auswahl von ${itemName} abbrechen`);
		button.addEventListener("click", this._handleCancelStagedItem);
		return button;
	}

	_renderStagedPillOrInput() {
		if (!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper) return;
		this.stagedItemPillContainer.innerHTML = "";

		if (this._stagedItem && this._stagedItem.item) {
			this.inputAreaWrapper.classList.remove(MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS);
			this.inputAreaWrapper.classList.add(MSR_INPUT_AREA_WRAPPER_STAGED_CLASS);
			const itemPill = this._createStagedItemPillElement(this._stagedItem.item);
			this.stagedItemPillContainer.appendChild(itemPill);
			const availableRoles = this._getAvailableRolesForItem(this._stagedItem.item.id);
			const roleSelect = this._createStagedRoleSelectElement(
				availableRoles,
				this._stagedItem.currentRole,
			);
			this.stagedItemPillContainer.appendChild(roleSelect);
			const cancelBtn = this._createStagedCancelButtonElement(this._stagedItem.item.name);
			this.stagedItemPillContainer.appendChild(cancelBtn);
			this.inputElement.classList.add("hidden");
			this.inputElement.value = "";
			this.inputElement.removeAttribute("aria-activedescendant");
			this.inputElement.setAttribute("aria-expanded", "false");
		} else {
			this.inputAreaWrapper.classList.add(MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS);
			this.inputAreaWrapper.classList.remove(MSR_INPUT_AREA_WRAPPER_STAGED_CLASS);
			this.inputElement.classList.remove("hidden");
		}
		this._updateAddButtonState();
		this._updatePreAddButtonVisibility();
		this._updateRootElementStateClasses();
	}

	_updatePreAddButtonVisibility() {
		if (!this.preAddButtonElement) return;
		const isComponentDisabled = this.hasAttribute("disabled");
		const noItemStaged = !this._stagedItem;

		const shouldBeVisible = this.showAddButton && noItemStaged && !isComponentDisabled;

		this.preAddButtonElement.classList.toggle("hidden", !shouldBeVisible);
		this.preAddButtonElement.disabled = isComponentDisabled;
	}

	_handleStagedRoleChange(event) {
		if (this._stagedItem) {
			this._stagedItem.currentRole = event.target.value;
			this._updateAddButtonState();
		}
	}

	_handleCancelStagedItem(event) {
		if (event) event.stopPropagation();
		this._stagedItem = null;
		this._renderStagedPillOrInput();
		if (this.inputElement) {
			this.inputElement.value = "";
			this.inputElement.focus();
		}
		this._hideOptionsList();
	}

	_createSelectedItemElement(valueItem) {
		const itemData = this._getItemById(valueItem.itemId);
		if (!itemData) return null;
		const fragment = this.selectedItemTemplate.content.cloneNode(true);
		const itemEl = fragment.firstElementChild;
		const textEl = itemEl.querySelector('[data-ref="textEl"]');

		let nameHtml = `<span class="${MSR_ITEM_NAME_CLASS}">${itemData.name}</span>`;
		let additionalDataHtml = itemData.additional_data
			? ` <span class="${MSR_ITEM_ADDITIONAL_DATA_CLASS}">(${itemData.additional_data})</span>`
			: "";
		let roleHtml = ` <span class="${MSR_SELECTED_ITEM_ROLE_CLASS}">${valueItem.role}</span>`;

		textEl.innerHTML = `${nameHtml}${additionalDataHtml}${roleHtml}`;

		const deleteBtn = itemEl.querySelector('[data-ref="deleteBtn"]');
		deleteBtn.setAttribute("aria-label", `Entferne ${itemData.name} als ${valueItem.role}`);
		deleteBtn.dataset.instanceId = valueItem.instanceId;
		deleteBtn.disabled = this.hasAttribute("disabled");
		deleteBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this._handleDeleteSelectedItem(valueItem.instanceId);
		});
		return itemEl;
	}

	_renderSelectedItems() {
		if (!this.selectedItemsContainer) return;
		this.selectedItemsContainer.innerHTML = "";
		if (this._value.length === 0) {
			this.selectedItemsContainer.innerHTML = `<span class="${MSR_PLACEHOLDER_NO_SELECTION_TEXT_CLASS}">${this.placeholderNoSelection}</span>`;
		} else {
			this._value.forEach((item) => {
				const itemEl = this._createSelectedItemElement(item);
				if (itemEl) {
					this.selectedItemsContainer.appendChild(itemEl);
				}
			});
		}
		this._updateRootElementStateClasses();
	}

	_updateAddButtonState() {
		if (this.addButtonElement) {
			const isComponentDisabled = this.hasAttribute("disabled");
			const isValidRoleSelected =
				this._stagedItem &&
				this._stagedItem.currentRole &&
				this._roles.includes(this._stagedItem.currentRole);

			const shouldBeHiddenOrDisabled =
				!this._stagedItem || !isValidRoleSelected || isComponentDisabled;

			this.addButtonElement.classList.toggle("hidden", shouldBeHiddenOrDisabled);
			this.addButtonElement.disabled = shouldBeHiddenOrDisabled;
		}
	}

	_createOptionElement(itemData, index) {
		const fragment = this.optionTemplate.content.cloneNode(true);
		const li = fragment.firstElementChild;
		li.querySelector('[data-ref="nameEl"]').textContent = itemData.name;
		li.querySelector('[data-ref="detailEl"]').textContent = itemData.additional_data
			? `(${itemData.additional_data})`
			: "";
		li.dataset.id = itemData.id;
		li.setAttribute("aria-selected", String(index === this._highlightedIndex));
		li.id = `${this.id || "msr"}-option-${itemData.id}`;
		if (index === this._highlightedIndex) {
			li.classList.add(MSR_HIGHLIGHTED_OPTION_CLASS);
		}
		return li;
	}

	_renderOptionsList() {
		if (!this.optionsListElement || !this.inputElement) return;
		this.optionsListElement.innerHTML = "";
		if (this._filteredOptions.length === 0 || !this._isOptionsListVisible) {
			this.optionsListElement.classList.add("hidden");
			this.inputElement.setAttribute("aria-expanded", "false");
			this.inputElement.removeAttribute("aria-activedescendant");
			this.inputElement.removeAttribute("aria-controls");
		} else {
			this.optionsListElement.classList.remove("hidden");
			this.inputElement.setAttribute("aria-expanded", "true");
			this.inputElement.setAttribute("aria-controls", this.optionsListElement.id);

			this._filteredOptions.forEach((itemData, index) => {
				const optionEl = this._createOptionElement(itemData, index);
				this.optionsListElement.appendChild(optionEl);
			});
			const highlightedElement = this.optionsListElement.querySelector(
				`.${MSR_HIGHLIGHTED_OPTION_CLASS}`,
			);
			if (highlightedElement) {
				highlightedElement.scrollIntoView({ block: "nearest" });
				this.inputElement.setAttribute("aria-activedescendant", highlightedElement.id);
			} else {
				this.inputElement.removeAttribute("aria-activedescendant");
			}
		}
		this._updateRootElementStateClasses();
	}

	_stageItem(itemData) {
		const availableRoles = this._getAvailableRolesForItem(itemData.id);
		if (availableRoles.length === 0) {
			return;
		}
		this._stagedItem = { item: itemData, currentRole: "" };
		if (this.inputElement) {
			this.inputElement.value = "";
			this.inputElement.setAttribute("aria-expanded", "false");
			this.inputElement.removeAttribute("aria-activedescendant");
		}
		this._renderStagedPillOrInput();
		this._hideOptionsList();
		const roleSelect = this.stagedItemPillContainer.querySelector(
			`.${MSR_STAGED_ROLE_SELECT_CLASS}`,
		);
		if (roleSelect && !roleSelect.disabled) {
			roleSelect.focus();
		} else if (this.addButtonElement && !this.addButtonElement.disabled) {
			this.addButtonElement.focus();
		}
	}

	_handleAddButtonClick() {
		if (this.hasAttribute("disabled")) return;

		if (
			this._stagedItem &&
			this._stagedItem.item &&
			this._stagedItem.currentRole &&
			this._roles.includes(this._stagedItem.currentRole)
		) {
			const newItem = {
				itemId: this._stagedItem.item.id,
				role: this._stagedItem.currentRole,
				instanceId: crypto.randomUUID(),
			};
			const alreadyExists = this._value.find(
				(v) => v.itemId === newItem.itemId && v.role === newItem.role,
			);
			if (alreadyExists) {
				this._handleCancelStagedItem();
				return;
			}
			this._value.push(newItem);
			this._updateFormValue();
			this._renderSelectedItems();
			this._stagedItem = null;
			this._renderStagedPillOrInput();
			if (this.inputElement) {
				this.inputElement.value = "";
				this.inputElement.focus();
			}
			this._hideOptionsList();
		}
	}

	_handleInput(event) {
		if (this.hasAttribute("disabled")) return;
		if (this._stagedItem) {
			this._stagedItem = null;
			this._renderStagedPillOrInput();
		} else {
			this._updatePreAddButtonVisibility();
		}

		const searchTerm = event.target.value;
		if (searchTerm.length === 0) {
			this._filteredOptions = [];
			this._isOptionsListVisible = false;
		} else {
			const searchTermLower = searchTerm.toLowerCase();
			this._filteredOptions = this._options.filter((itemData) => {
				const availableRoles = this._getAvailableRolesForItem(itemData.id);
				if (availableRoles.length === 0) return false;
				if (this._stagedItem && this._stagedItem.item.id === itemData.id) return false;
				return (
					itemData.name.toLowerCase().includes(searchTermLower) ||
					(itemData.additional_data &&
						itemData.additional_data.toLowerCase().includes(searchTermLower))
				);
			});
			this._isOptionsListVisible = this._filteredOptions.length > 0;
		}
		this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1;
		this._renderOptionsList();
	}

	_handleKeyDown(event) {
		if (this.hasAttribute("disabled")) return;

		if (event.key === "Enter" && this._stagedItem && this._stagedItem.item) {
			const activeEl = document.activeElement;
			const stagedCancelButton = this.stagedItemPillContainer?.querySelector(
				`.${MSR_STAGED_CANCEL_BTN_CLASS}`,
			);

			if (activeEl === stagedCancelButton) {
				event.preventDefault();
				this._handleCancelStagedItem(event);
				return;
			} else if (
				this._stagedItem.currentRole &&
				this._roles.includes(this._stagedItem.currentRole)
			) {
				event.preventDefault();
				this._handleAddButtonClick();
				return;
			}
		}

		if (event.key === "Escape") {
			if (this._isOptionsListVisible) {
				event.preventDefault();
				this._hideOptionsList();
				if (this.inputElement) this.inputElement.focus();
			} else if (this._stagedItem) {
				event.preventDefault();
				this._handleCancelStagedItem(event);
			}
		}
	}

	_handleInputKeyDown(event) {
		if (this.hasAttribute("disabled") || (this.inputElement && this.inputElement.disabled)) return;

		// Backspace to delete functionality removed as per request
		// if (event.key === "Backspace" && ...) { ... }

		if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
			if (event.key === "Enter" && this.inputElement && this.inputElement.value === "") {
				event.preventDefault();
			}
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
			case "Tab":
				if (this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex]) {
					event.preventDefault();
					this._stageItem(this._filteredOptions[this._highlightedIndex]);
				} else if (event.key === "Tab") {
					this._hideOptionsList();
				}
				break;
		}
	}

	_hideOptionsList() {
		this._isOptionsListVisible = false;
		this._highlightedIndex = -1;
		if (this.optionsListElement) this._renderOptionsList();
		if (this.inputElement) {
			this.inputElement.setAttribute("aria-expanded", "false");
			this.inputElement.removeAttribute("aria-activedescendant");
		}
	}

	_handleFocus() {
		if (
			this.hasAttribute("disabled") ||
			(this.inputElement && this.inputElement.disabled) ||
			this._stagedItem
		)
			return;
		if (!this._stagedItem && this.inputAreaWrapper) {
			this.inputAreaWrapper.classList.add(MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS);
			this.inputAreaWrapper.classList.remove(MSR_INPUT_AREA_WRAPPER_STAGED_CLASS);
		}
		if (this.inputElement && this.inputElement.value.length > 0) {
			const searchTerm = this.inputElement.value.toLowerCase();
			this._filteredOptions = this._options.filter((itemData) => {
				const availableRoles = this._getAvailableRolesForItem(itemData.id);
				if (availableRoles.length === 0) return false;
				return (
					itemData.name.toLowerCase().includes(searchTerm) ||
					(itemData.additional_data && itemData.additional_data.toLowerCase().includes(searchTerm))
				);
			});
			if (this._filteredOptions.length > 0) {
				this._isOptionsListVisible = true;
				this._highlightedIndex = 0;
				this._renderOptionsList();
			} else {
				this._hideOptionsList();
			}
		} else {
			this._hideOptionsList();
		}
		this._updateRootElementStateClasses();
		this._updatePreAddButtonVisibility();
	}

	_blurTimeout = null;
	_handleBlur(event) {
		this._blurTimeout = setTimeout(() => {
			const activeEl = document.activeElement;
			if (
				activeEl !== this.addButtonElement &&
				activeEl !== this.preAddButtonElement &&
				!(this.stagedItemPillContainer && this.stagedItemPillContainer.contains(activeEl)) &&
				!(this.optionsListElement && this.optionsListElement.contains(activeEl)) &&
				!this.contains(activeEl)
			) {
				this._hideOptionsList();
			}
		}, 150);
	}

	_handleOptionMouseDown(event) {
		event.preventDefault();
	}

	_handleOptionClick(event) {
		if (this.hasAttribute("disabled")) return;
		const li = event.target.closest(`li[data-id].${MSR_OPTION_ITEM_CLASS}`);
		if (li) {
			const itemId = li.dataset.id;
			const itemToStage = this._filteredOptions.find((opt) => opt.id === itemId);
			if (itemToStage) {
				this._stageItem(itemToStage);
			}
		}
	}

	_handleDeleteSelectedItem(instanceId) {
		if (this.hasAttribute("disabled")) return;
		this._value = this._value.filter((item) => item.instanceId !== instanceId);
		this._updateFormValue();
		this._renderSelectedItems();
		if (this._stagedItem && this._stagedItem.item) {
			this._renderStagedPillOrInput();
		}
		if (this.inputElement) {
			this.inputElement.focus();
		}
		this._updatePreAddButtonVisibility();
	}
}
