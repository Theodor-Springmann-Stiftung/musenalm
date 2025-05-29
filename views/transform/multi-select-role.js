// --- Class Name Constants for Styling ---
const MSR_COMPONENT_WRAPPER_CLASS = "msr-component-wrapper";
const MSR_SELECTED_ITEMS_CONTAINER_CLASS = "msr-selected-items-container";
const MSR_SELECTED_ITEM_PILL_CLASS = "msr-selected-item-pill";
const MSR_SELECTED_ITEM_TEXT_CLASS = "msr-selected-item-text";
const MSR_SELECTED_ITEM_DELETE_BTN_CLASS = "msr-selected-item-delete-btn";

const MSR_CONTROLS_AREA_CLASS = "msr-controls-area";
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

// --- State Classes for Root Element ---
const MSR_STATE_NO_SELECTION = "msr-state-no-selection";
const MSR_STATE_HAS_SELECTION = "msr-state-has-selection";
const MSR_STATE_LIST_OPEN = "msr-state-list-open";
const MSR_STATE_ITEM_STAGED = "msr-state-item-staged";

class MultiSelectRole extends HTMLElement {
	// Renamed class
	static formAssociated = true;

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this._value = [];
		this._stagedItem = null;

		// Default options, can be overridden by setOptions()
		this._options = [
			{ id: "item1", name: "First Item", additional_data: "Data A" },
			{ id: "item2", name: "Second Item", additional_data: "Data B" },
			{ id: "item3", name: "Third Item", additional_data: "Data C" },
		];
		// Default roles, can be overridden by setRoles()
		this._roles = ["Primary", "Secondary", "Auxiliary"];

		this._filteredOptions = [];
		this._highlightedIndex = -1;
		this._isOptionsListVisible = false;

		this._setupTemplates();
		this._bindEventHandlers();
	}

	_setupTemplates() {
		this.optionTemplate = document.createElement("template");
		this.optionTemplate.innerHTML = `
                    <li role="option" class="${MSR_OPTION_ITEM_CLASS} px-3 py-2 text-sm cursor-pointer transition-colors duration-75 group">
                        <span data-ref="nameEl" class="${MSR_OPTION_ITEM_NAME_CLASS} font-semibold"></span>
                        <span data-ref="detailEl" class="${MSR_OPTION_ITEM_DETAIL_CLASS} text-xs ml-2"></span>
                    </li>
                `;

		this.selectedItemTemplate = document.createElement("template");
		this.selectedItemTemplate.innerHTML = `
                    <span class="${MSR_SELECTED_ITEM_PILL_CLASS} flex items-center">
                        <span data-ref="textEl" class="${MSR_SELECTED_ITEM_TEXT_CLASS}"></span>
                        <button type="button" data-ref="deleteBtn" class="${MSR_SELECTED_ITEM_DELETE_BTN_CLASS} ml-2">&times;</button>
                    </span>
                `;

		this.stagedPlacePillTemplate = document.createElement("template"); // Renaming to generic item
		this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${MSR_STAGED_ITEM_PILL_CLASS} flex items-center">
                        <span data-ref="nameEl" class="${MSR_STAGED_ITEM_TEXT_CLASS}"></span>
                    </span>
                `;

		this.stagedCancelBtnTemplate = document.createElement("template");
		this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${MSR_STAGED_CANCEL_BTN_CLASS} flex items-center justify-center w-5 h-5">&times;</button>
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
		// Renamed from _getPlaceById
		return this._options.find((opt) => opt.id === id);
	}

	_getAvailableRolesForItem(itemId) {
		// Renamed from _getAvailableRolesForPlace
		const assignedRoles = this._value
			.filter((item) => item.itemId === itemId) // Updated property name
			.map((item) => item.role);
		return this._roles.filter((role) => !assignedRoles.includes(role));
	}

	// --- Public Methods for Programmatic Configuration ---
	setRoles(newRoles) {
		if (Array.isArray(newRoles) && newRoles.every((r) => typeof r === "string")) {
			this._roles = [...newRoles];
			console.log("Roles set to:", this._roles);

			// If an item is staged, its role dropdown needs to be updated
			if (this._stagedItem && this._stagedItem.item) {
				const availableRoles = this._getAvailableRolesForItem(this._stagedItem.item.id);
				if (!availableRoles.includes(this._stagedItem.currentRole)) {
					this._stagedItem.currentRole = availableRoles.length > 0 ? "" : null; // Set to placeholder or null if no roles
				}
				this._renderStagedPillOrInput(); // Re-render to update dropdown
				this._updateAddButtonState();
			}
			// Potentially re-validate/update existing selected items if their roles are no longer valid
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
			console.log("Options set to:", this._options);

			// Re-validate current value against new options
			const validValues = this._value.filter((valItem) => this._getItemById(valItem.itemId));
			if (validValues.length !== this._value.length) {
				this.value = validValues.map((item) => `${item.itemId},${item.role}`);
			}

			// Clear staged item if its item is no longer in options
			if (
				this._stagedItem &&
				this._stagedItem.item &&
				!this._getItemById(this._stagedItem.item.id)
			) {
				this._handleCancelStagedItem(); // Clear and reset
			}

			this._filteredOptions = [];
			this._highlightedIndex = -1;
			if (this.inputElement && this.inputElement.value) {
				// Re-filter if there was a search term
				this._handleInput({ target: this.inputElement });
			} else {
				this._hideOptionsList();
			}
		} else {
			console.error("setOptions expects an array of objects with id and name properties.");
		}
	}
	// Programmatic setting of selected items is done via the `value` setter.
	// Example: element.value = ["itemId1,RoleA", "itemId2,RoleB"];

	get value() {
		return this._value;
	}

	set value(val) {
		if (Array.isArray(val)) {
			this._value = val
				.map((itemStr) => {
					if (typeof itemStr === "string") {
						const parts = itemStr.split(",");
						if (parts.length === 2) {
							const item = this._getItemById(parts[0]); // Use generic _getItemById
							const roleName = parts[1];
							if (item && this._roles.includes(roleName)) {
								const existing = this._value.find(
									(v) => v.itemId === parts[0] && v.role === roleName,
								);
								if (existing) return null;
								return { itemId: parts[0], role: roleName, instanceId: crypto.randomUUID() };
							}
						}
					}
					return null;
				})
				.filter((item) => item !== null);
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
		this._render();
		this.inputAreaWrapper = this.querySelector(`.${MSR_INPUT_AREA_WRAPPER_CLASS}`);
		this.inputElement = this.querySelector(`.${MSR_TEXT_INPUT_CLASS}`);
		this.stagedItemPillContainer = this.querySelector(`.${MSR_STAGING_AREA_CONTAINER_CLASS}`);
		this.optionsListElement = this.querySelector(`.${MSR_OPTIONS_LIST_CLASS}`);
		this.selectedItemsContainer = this.querySelector(`.${MSR_SELECTED_ITEMS_CONTAINER_CLASS}`);
		this.addButtonElement = this.querySelector(`.${MSR_ADD_BUTTON_CLASS}`);
		this.hiddenSelect = this.querySelector(`.${MSR_HIDDEN_SELECT_CLASS}`);

		if (this.name && this.hiddenSelect) {
			this.hiddenSelect.name = this.name;
		}

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
		this._updateRootElementStateClasses();

		if (this.hasAttribute("value")) {
			try {
				const parsedValue = JSON.parse(this.getAttribute("value"));
				this.value = parsedValue;
			} catch (e) {
				const attrValue = this.getAttribute("value");
				if (attrValue.startsWith("[") && attrValue.endsWith("]")) {
					console.warn(
						"Failed to parse value attribute as JSON array, attempting manual parse:",
						attrValue,
						e,
					);
					try {
						const items = attrValue
							.slice(1, -1)
							.split('","')
							.map((s) => s.replace(/"/g, "").trim());
						this.value = items;
					} catch (e2) {
						console.error("Manual parse of value attribute also failed:", attrValue, e2);
						this.value = [];
					}
				} else {
					this.value = [attrValue];
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
	formResetCallback() {
		this.value = [];
		this._stagedItem = null;
		this._renderStagedPillOrInput();
		this._hideOptionsList();
		this._updateAddButtonState();
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
	}

	_synchronizeHiddenSelect() {
		if (!this.hiddenSelect) return;
		this.hiddenSelect.innerHTML = "";
		this._value.forEach((item) => {
			const option = document.createElement("option");
			option.value = `${item.itemId},${item.role}`; // Updated to itemId
			option.textContent = `${item.itemId} (${item.role})`;
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
		if (this.addButtonElement) {
			this.addButtonElement.classList.toggle(
				"hidden",
				disabled || !this._stagedItem || !this._stagedItem.currentRole,
			);
			this.addButtonElement.disabled =
				disabled || !this._stagedItem || !this._stagedItem.currentRole;
		}
		this.classList.toggle("opacity-50", disabled);
		this.classList.toggle("cursor-not-allowed", disabled);
		if (this.selectedItemsContainer)
			this.selectedItemsContainer.classList.toggle("pointer-events-none", disabled);
		this.querySelectorAll(`.${MSR_SELECTED_ITEM_DELETE_BTN_CLASS}`).forEach(
			(btn) => (btn.disabled = disabled),
		);
		const stagedRoleSelect = this.querySelector(`.${MSR_STAGED_ROLE_SELECT_CLASS}`);
		if (stagedRoleSelect) stagedRoleSelect.disabled = disabled;
		if (this.hiddenSelect) this.hiddenSelect.disabled = disabled;
	}

	_updateRootElementStateClasses() {
		this.classList.toggle(MSR_STATE_NO_SELECTION, this._value.length === 0);
		this.classList.toggle(MSR_STATE_HAS_SELECTION, this._value.length > 0);
		this.classList.toggle(MSR_STATE_LIST_OPEN, this._isOptionsListVisible);
		this.classList.toggle(MSR_STATE_ITEM_STAGED, !!this._stagedItem);
	}

	_render() {
		const componentId = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`; // Changed prefix
		if (!this.id) {
			this.setAttribute("id", componentId);
		}
		this.innerHTML = `
                    <style>
                        .${MSR_HIDDEN_SELECT_CLASS} {
                            display: none !important;
                            visibility: hidden !important;
                            position: absolute !important;
                            width: 0 !important;
                            height: 0 !important;
                            opacity: 0 !important;
                            pointer-events: none !important;
                        }
                    </style>
                    <div class="${MSR_COMPONENT_WRAPPER_CLASS} relative">
                        <div class="${MSR_SELECTED_ITEMS_CONTAINER_CLASS} flex flex-wrap gap-2 mb-2 min-h-[42px]" aria-live="polite"></div>
                        <div class="${MSR_CONTROLS_AREA_CLASS} flex items-center space-x-2">
                            <div class="${MSR_INPUT_AREA_WRAPPER_CLASS} flex-grow min-h-[42px] flex items-center flex-wrap gap-1 p-1 rounded-md" tabindex="-1">
                                <span class="${MSR_STAGING_AREA_CONTAINER_CLASS} flex items-center gap-2"></span>
                                <input type="text" class="${MSR_TEXT_INPUT_CLASS} flex-1 min-w-[60px] outline-none bg-transparent" placeholder="Search...">
                            </div>
                            <button type="button" class="${MSR_ADD_BUTTON_CLASS} hidden px-4 py-2 text-sm rounded-md">Add</button>
                        </div>
                        <ul role="listbox" class="${MSR_OPTIONS_LIST_CLASS} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${componentId}" class="${MSR_HIDDEN_SELECT_CLASS}" aria-hidden="true"></select>
                    </div>
                `;
	}

	_createStagedItemPillElement(itemData) {
		// Renamed from _createStagedPlacePillElement
		const fragment = this.stagedPlacePillTemplate.content.cloneNode(true); // Template name can remain for structure
		const pill = fragment.firstElementChild;
		pill.classList.add(MSR_STAGED_ITEM_PILL_CLASS);
		pill.querySelector('[data-ref="nameEl"]').textContent = itemData.name;
		return pill;
	}

	_createStagedRoleSelectElement(availableRoles, currentRole) {
		const roleSelect = document.createElement("select");
		roleSelect.className = `${MSR_STAGED_ROLE_SELECT_CLASS} px-2 py-1 text-sm rounded-md border`;

		const placeholderOption = document.createElement("option");
		placeholderOption.value = "";
		placeholderOption.textContent = "Select Role...";
		placeholderOption.disabled = true;
		if (!currentRole) {
			placeholderOption.selected = true;
		}
		roleSelect.appendChild(placeholderOption);

		if (availableRoles.length === 0 && !this._roles.includes(currentRole)) {
			const noRoleOption = document.createElement("option");
			noRoleOption.textContent = "No roles left";
			noRoleOption.disabled = true;
			roleSelect.appendChild(noRoleOption);
			roleSelect.disabled = true;
		} else {
			availableRoles.forEach((roleName) => {
				const option = document.createElement("option");
				option.value = roleName;
				option.textContent = roleName;
				if (roleName === currentRole) {
					option.selected = true;
				}
				roleSelect.appendChild(option);
			});
			roleSelect.disabled = availableRoles.length === 0 && currentRole === "";
		}
		roleSelect.addEventListener("change", this._handleStagedRoleChange);
		return roleSelect;
	}

	_createStagedCancelButtonElement(itemName) {
		// Renamed from placeName
		const fragment = this.stagedCancelBtnTemplate.content.cloneNode(true);
		const button = fragment.firstElementChild;
		button.setAttribute("aria-label", `Cancel staging ${itemName}`);
		button.addEventListener("click", this._handleCancelStagedItem);
		return button;
	}

	_renderStagedPillOrInput() {
		if (!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper) return;
		this.stagedItemPillContainer.innerHTML = "";

		if (this._stagedItem && this._stagedItem.item) {
			// Changed from .place to .item
			this.inputAreaWrapper.classList.remove(
				MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS,
				"border",
				"border-gray-300",
				"focus-within:border-blue-500",
				"focus-within:ring-1",
				"focus-within:ring-blue-500",
			);
			this.inputAreaWrapper.classList.add(
				MSR_INPUT_AREA_WRAPPER_STAGED_CLASS,
				"border",
				"border-transparent",
			);

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
		} else {
			this.inputAreaWrapper.classList.add(
				MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS,
				"border",
				"border-gray-300",
				"focus-within:border-blue-500",
				"focus-within:ring-1",
				"focus-within:ring-blue-500",
			);
			this.inputAreaWrapper.classList.remove(
				MSR_INPUT_AREA_WRAPPER_STAGED_CLASS,
				"border-transparent",
			);
			this.inputElement.classList.remove("hidden");
		}
		this._updateAddButtonState();
		this._updateRootElementStateClasses();
	}

	_handleStagedRoleChange(event) {
		if (this._stagedItem) {
			this._stagedItem.currentRole = event.target.value;
			this._updateAddButtonState();
			event.target.focus();
		}
	}

	_handleCancelStagedItem(event) {
		if (event) event.stopPropagation();
		this._stagedItem = null;
		this._renderStagedPillOrInput();
		this._updateAddButtonState();
		if (this.inputElement) {
			this.inputElement.value = "";
			this.inputElement.focus();
		}
		this._hideOptionsList();
		this._updateRootElementStateClasses();
	}

	_createSelectedItemElement(valueItem) {
		// valueItem is {itemId, role, instanceId}
		const itemData = this._getItemById(valueItem.itemId);
		if (!itemData) return null;

		const fragment = this.selectedItemTemplate.content.cloneNode(true);
		const itemEl = fragment.firstElementChild;

		itemEl.querySelector('[data-ref="textEl"]').textContent =
			`${itemData.name} ${itemData.additional_data ? "(" + itemData.additional_data + ")" : ""} - ${valueItem.role}`;
		const deleteBtn = itemEl.querySelector('[data-ref="deleteBtn"]');
		deleteBtn.setAttribute("aria-label", `Remove ${itemData.name} as ${valueItem.role}`);
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
		this._value.forEach((item) => {
			const itemEl = this._createSelectedItemElement(item);
			if (itemEl) {
				this.selectedItemsContainer.appendChild(itemEl);
			}
		});
		if (this._value.length === 0) {
			this.selectedItemsContainer.innerHTML = `<span class="italic">No items selected</span>`;
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
		// itemData instead of place
		const fragment = this.optionTemplate.content.cloneNode(true);
		const li = fragment.firstElementChild;

		const nameEl = li.querySelector('[data-ref="nameEl"]');
		const detailEl = li.querySelector('[data-ref="detailEl"]');

		nameEl.textContent = itemData.name;
		detailEl.textContent = itemData.additional_data ? `(${itemData.additional_data})` : ""; // Use additional_data

		li.dataset.id = itemData.id;
		li.setAttribute("aria-selected", String(index === this._highlightedIndex));

		if (index === this._highlightedIndex) {
			li.classList.add(MSR_HIGHLIGHTED_OPTION_CLASS);
			li.id = `highlighted-option-${this.id || "multi-select-role"}`;
			// User styles MSP_HIGHLIGHTED_OPTION_CLASS and its effect on MSP_OPTION_ITEM_DETAIL_CLASS
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
			this._filteredOptions.forEach((itemData, index) => {
				const optionEl = this._createOptionElement(itemData, index);
				this.optionsListElement.appendChild(optionEl);
			});
			const highlightedElement = this.optionsListElement.querySelector(
				`#highlighted-option-${this.id || "multi-select-role"}`,
			);
			if (highlightedElement) {
				highlightedElement.scrollIntoView({ block: "nearest" });
			}
		}
		this._updateRootElementStateClasses();
	}

	_stageItem(itemData) {
		// itemData instead of item
		const availableRoles = this._getAvailableRolesForItem(itemData.id);
		if (availableRoles.length === 0) {
			console.warn(`Cannot stage ${itemData.name}, no available roles.`);
			return;
		}
		this._stagedItem = { item: itemData, currentRole: "" }; // Changed from place to item

		if (this.inputElement) this.inputElement.value = "";
		this._renderStagedPillOrInput();
		this._updateAddButtonState();
		this._hideOptionsList();

		const roleSelect = this.stagedItemPillContainer.querySelector("select");
		if (roleSelect && !roleSelect.disabled) {
			roleSelect.focus();
		} else if (this.addButtonElement && !this.addButtonElement.disabled) {
			this.addButtonElement.focus();
		}
		this._updateRootElementStateClasses();
	}

	_handleAddButtonClick() {
		if (
			this._stagedItem &&
			this._stagedItem.item &&
			this._stagedItem.currentRole &&
			this._roles.includes(this._stagedItem.currentRole)
		) {
			const newItem = {
				itemId: this._stagedItem.item.id, // Changed from placeId
				role: this._stagedItem.currentRole,
				instanceId: crypto.randomUUID(),
			};
			const alreadyExists = this._value.find(
				(v) => v.itemId === newItem.itemId && v.role === newItem.role,
			);
			if (alreadyExists) {
				console.warn("Attempted to add duplicate item-role combination:", newItem);
				this._handleCancelStagedItem();
				return;
			}

			this._value.push(newItem);
			this._updateFormValue();
			this._renderSelectedItems();

			this._stagedItem = null;
			this._renderStagedPillOrInput();
			this._updateAddButtonState();
			if (this.inputElement) {
				this.inputElement.value = "";
				this.inputElement.focus();
			}
			this._hideOptionsList();
		} else {
			console.warn("Add button clicked but staged item or role is invalid.", this._stagedItem);
		}
		this._updateRootElementStateClasses();
	}

	_handleInput(event) {
		if (this._stagedItem) {
			this._stagedItem = null;
			this._renderStagedPillOrInput();
			this._updateAddButtonState();
		}
		const searchTerm = event.target.value;
		if (searchTerm.length === 0) {
			this._filteredOptions = [];
			this._isOptionsListVisible = false;
		} else {
			const searchTermLower = searchTerm.toLowerCase();
			this._filteredOptions = this._options.filter((itemData) => {
				// itemData instead of place
				const availableRoles = this._getAvailableRolesForItem(itemData.id);
				if (availableRoles.length === 0) {
					return false;
				}
				if (this._stagedItem && this._stagedItem.item.id === itemData.id) return false;

				return (
					itemData.name.toLowerCase().includes(searchTermLower) ||
					(itemData.additional_data &&
						itemData.additional_data.toLowerCase().includes(searchTermLower))
				); // Use additional_data
			});
			this._isOptionsListVisible = this._filteredOptions.length > 0;
		}
		this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1;
		this._renderOptionsList();
	}

	_handleKeyDown(event) {
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
		if (this.inputElement && this.inputElement.disabled) return;

		if (
			event.key === "Backspace" &&
			this.inputElement &&
			this.inputElement.value === "" &&
			!this._stagedItem &&
			this._value.length > 0
		) {
			event.preventDefault();
			this._handleDeleteSelectedItem(this._value[this._value.length - 1].instanceId);
			return;
		}
		if (
			this._stagedItem &&
			this._stagedItem.currentRole &&
			this._roles.includes(this._stagedItem.currentRole) &&
			event.key === "Enter"
		) {
			if (
				document.activeElement === this.addButtonElement ||
				(this.stagedItemPillContainer &&
					this.stagedItemPillContainer.contains(document.activeElement))
			) {
				event.preventDefault();
				this._handleAddButtonClick();
				return;
			}
		}

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
				event.preventDefault();
				if (this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex]) {
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
	}

	_handleFocus() {
		if (this.inputElement && (this.inputElement.disabled || this._stagedItem)) return;
		if (!this._stagedItem && this.inputAreaWrapper) {
			this.inputAreaWrapper.classList.add(
				MSR_INPUT_AREA_WRAPPER_DEFAULT_BORDER_CLASS,
				"border",
				"border-gray-300",
				"focus-within:border-blue-500",
				"focus-within:ring-1",
				"focus-within:ring-blue-500",
			);
			this.inputAreaWrapper.classList.remove(
				MSR_INPUT_AREA_WRAPPER_STAGED_CLASS,
				"border-transparent",
			);
		}

		if (this.inputElement && this.inputElement.value.length > 0) {
			const searchTerm = this.inputElement.value.toLowerCase();
			this._filteredOptions = this._options.filter((itemData) => {
				// itemData instead of place
				const availableRoles = this._getAvailableRolesForItem(itemData.id);
				if (availableRoles.length === 0) return false;
				if (this._stagedItem && this._stagedItem.item.id === itemData.id) return false;
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
	}

	_blurTimeout = null;
	_handleBlur(event) {
		if (!this._stagedItem && this.inputAreaWrapper) {
			// Border styling is handled by adding/removing classes in _renderStagedPillOrInput
		}

		this._blurTimeout = setTimeout(() => {
			const activeEl = document.activeElement;
			if (
				activeEl !== this.addButtonElement &&
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
		const li = event.target.closest("li[data-id]");
		if (li) {
			const itemId = li.dataset.id; // itemId instead of placeId
			const itemToStage = this._filteredOptions.find((opt) => opt.id === itemId);
			if (itemToStage) {
				this._stageItem(itemToStage);
			}
		}
	}

	_handleDeleteSelectedItem(instanceId) {
		this._value = this._value.filter((item) => item.instanceId !== instanceId);
		this._updateFormValue();
		this._renderSelectedItems();
		if (this.inputElement) {
			this.inputElement.focus();
			this._handleInput({ target: this.inputElement });
		}
	}
}

customElements.define("multi-select-role", MultiSelectRole); // Renamed custom element definition

// --- Demo Page Script ---
const myForm = document.getElementById("myForm");
const formDataDisplay = document.getElementById("form-data-display");
const formDataPre = formDataDisplay.querySelector("pre");

myForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const formData = new FormData(this);
	let output = "";
	console.log("Form Submitted. FormData entries:");
	for (let [name, value] of formData.entries()) {
		console.log(`FormData - ${name}: ${value}`);
		output += `FormData - ${name}: ${value}\n`;
	}

	const itemSelectEl = document.getElementById("item-select"); // Updated ID
	const formattedValue = itemSelectEl.value
		.map((item) => `(${item.itemId}, ${item.role})`)
		.join("; ");
	output += `\nCustom element .value (internal): [${formattedValue}]`;

	const prefilledSelectEl = document.getElementById("place-select-prefilled"); // Keep old ID for demo or update
	if (prefilledSelectEl) {
		const prefilledValue = prefilledSelectEl.value; // This is an array of objects
		if (Array.isArray(prefilledValue)) {
			const formattedPrefilled = prefilledValue
				.map((item) => `(${item.itemId || item.placeId}, ${item.role})`)
				.join("; ");
			output += `\nPrefilled element .value (internal): [${formattedPrefilled}]`;
		}
	}

	formDataPre.textContent = output;
	formDataDisplay.classList.remove("hidden");
});

myForm.addEventListener("reset", function (event) {
	console.log("Form reset!");
	formDataPre.textContent = "";
	formDataDisplay.classList.add("hidden");
	setTimeout(() => {
		["item-select", "place-select-prefilled"].forEach((id) => {
			// Updated ID
			const el = document.getElementById(id);
			if (el && typeof el.value !== "undefined") {
				// Check if element and value exist
				console.log(`${id} .value after reset:`, el.value);
				if (el._stagedItem)
					console.warn(`${id} still has staged item after reset:`, el._stagedItem);
				if (el.hiddenSelect) {
					const hiddenOptions = Array.from(el.hiddenSelect.options).map((opt) => opt.value);
					console.log(`${id} hidden select values:`, hiddenOptions);
				}
			}
		});
	}, 0);
});
