// Define CSS class names as constants, above the component class
const USER_PROVIDED_MENU_BUTTON_CLASS = "div-menu-button";
const TS_MENU_COMPONENT = "ts-menu";
const TS_POPUP = "ts-menu-popup";
const TS_LIST = "ts-menu-list";
const TS_MENU_LABEL = "menu-label";
const TS_PLACEHOLDER_MESSAGE = "ts-menu-placeholder-message";
const TS_LIST_ITEM = "ts-menu-list-item";
const TS_ITEM_ACTION = "ts-menu-item-action";
const TS_ITEM_IS_SELECTED = "ts-item-is-selected";
const TS_CONTENT_CLOSE_BUTTON = "ts-content-close-button";
const TAILWIND_HIDDEN_CLASS = "hidden";
const TS_MENU_BUTTON_STATE_DISABLED = "ts-menu-button--disabled";
const TS_MENU_LABEL_IN_MENU_STATE = "ts-menu-label--in-menu";
const TS_MENU_LABEL_DISPLAYED_STATE = "ts-menu-label--displayed";
const TS_TARGET_PLACEHOLDER_CLASS = "ts-target-placeholder"; // For the target area placeholder
//
// Prereq: child divs must have prop data-value, and a label element
// the label element must have class "menu-label"
// The child divs will be moved to the target element when selected
// The target element must be specified by the attribute target-id on the custom element
// The menu button must have the class div-menu-button

export class DivMenu extends HTMLElement {
	constructor() {
		super();
		this._menuItemsMap = new Map();
		this._targetElement = null;
		this._originalChildDivs = [];
		this._observer = null;
		this._menuPlaceholderMessageElement = null;
		this._menuButton = null;

		this._toggleMenu = this._toggleMenu.bind(this);
		this._handleMenuItemClick = this._handleMenuItemClick.bind(this);
		this._handleClickOutside = this._handleClickOutside.bind(this);
		this._handleContentClose = this._handleContentClose.bind(this);
		this._handleMutations = this._handleMutations.bind(this);
		this._checkMenuPlaceholderAndButton = this._checkMenuPlaceholderAndButton.bind(this);
		this._clearFormElements = this._clearFormElements.bind(this);
		this._refreshTargetOrder = this._refreshTargetOrder.bind(this); // Bind new method
	}

	connectedCallback() {
		this._menuButton = this.querySelector(`.${USER_PROVIDED_MENU_BUTTON_CLASS}`);
		if (!this._menuButton) {
			console.error(`TabSelectorMenu: User-provided menu button with class '${USER_PROVIDED_MENU_BUTTON_CLASS}' not found.`);
		}

		this._originalChildDivs = Array.from(this.children).filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV" && !node.classList.contains(USER_PROVIDED_MENU_BUTTON_CLASS));
		this._originalChildDivs.forEach((div) => div.remove());

		const componentPopupHTML = `
                    <div class="${TS_POPUP}">
                        <ul class="${TS_LIST}">
                            <li class="${TS_PLACEHOLDER_MESSAGE}">All items are currently shown.</li>
                        </ul>
                    </div>
                `;
		this.insertAdjacentHTML("beforeend", componentPopupHTML);

		this._menuPopupElement = this.querySelector(`.${TS_POPUP}`);
		this._menuListElement = this.querySelector(`.${TS_LIST}`);
		this._menuPlaceholderMessageElement = this.querySelector(`.${TS_PLACEHOLDER_MESSAGE}`);

		if (!this._menuPopupElement || !this._menuListElement || !this._menuPlaceholderMessageElement) {
			console.error("CRITICAL: Popup structure parts missing.");
			return;
		}

		const targetId = this.getAttribute("target-id");
		if (targetId) {
			this._targetElement = document.getElementById(targetId);
			if (!this._targetElement) console.warn(`TabSelectorMenu: Target ID '${targetId}' not found.`);
		} else {
			console.warn(`TabSelectorMenu: 'target-id' attribute missing.`);
		}

		this._observer = new MutationObserver(this._handleMutations);

		this._originalChildDivs.forEach((sourceDiv) => {
			const menuLabelElement = sourceDiv.querySelector("label." + TS_MENU_LABEL);
			const itemValue = sourceDiv.dataset.value;

			if (!menuLabelElement || !itemValue) {
				console.warn('TabSelectorMenu: Source div missing <label class="menu-label"> or data-value:', sourceDiv);
				return;
			}

			const isInitiallySelected = !sourceDiv.classList.contains(TAILWIND_HIDDEN_CLASS);
			this.appendChild(sourceDiv);

			const labelText = menuLabelElement.textContent.trim();
			const menuItemHTML = `
                        <li class="${TS_LIST_ITEM}">
                            <button type="button" class="${TS_ITEM_ACTION}" data-value="${itemValue}">
                                ${labelText}
                            </button>
                        </li>`;
			this._menuPlaceholderMessageElement.insertAdjacentHTML("beforebegin", menuItemHTML);

			const addedMenuItemButton = this._menuListElement.querySelector(`.${TS_ITEM_ACTION}[data-value="${itemValue}"]`);

			this._menuItemsMap.set(itemValue, {
				sourceDiv,
				menuItemButton: addedMenuItemButton,
				menuListItem: addedMenuItemButton.parentElement,
				menuLabelElement: menuLabelElement,
				selected: isInitiallySelected,
			});

			this._observer.observe(sourceDiv, { attributes: true, attributeFilter: ["class"] });
		});

		this._menuItemsMap.forEach((itemData) => {
			this._updateItemState(itemData, false, true);
		});
		// _refreshTargetOrder() is called within _updateItemState, so target should be correct.
		this._checkMenuPlaceholderAndButton();

		if (this._menuButton) {
			this._menuButton.addEventListener("click", this._toggleMenu);
		}
		this._menuListElement.addEventListener("click", this._handleMenuItemClick);
		document.addEventListener("click", this._handleClickOutside);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this._handleClickOutside);
		if (this._observer) {
			this._observer.disconnect();
		}
		if (this._menuButton) {
			this._menuButton.removeEventListener("click", this._toggleMenu);
		}
	}

	_clearFormElements(parentElement) {
		if (!parentElement) return;
		const inputs = parentElement.querySelectorAll("input, textarea, select");
		inputs.forEach((el) => {
			switch (el.type) {
				case "button":
				case "submit":
				case "reset":
				case "image":
					break;
				case "checkbox":
				case "radio":
					el.checked = false;
					break;
				case "file":
					el.value = null;
					break;
				default:
					el.value = "";
			}
			if (el.tagName === "SELECT") el.selectedIndex = 0;
		});
	}

	_refreshTargetOrder() {
		if (!this._targetElement) return;

		// Detach all currently managed divs from target
		const managedDivsInTarget = [];
		this._menuItemsMap.forEach((item) => {
			if (item.sourceDiv.parentElement === this._targetElement) {
				managedDivsInTarget.push(item.sourceDiv);
			}
		});
		managedDivsInTarget.forEach((div) => this._targetElement.removeChild(div));

		// Remove existing component-managed placeholder if any
		const existingPlaceholder = this._targetElement.querySelector(`.${TS_TARGET_PLACEHOLDER_CLASS}`);
		if (existingPlaceholder) {
			this._targetElement.removeChild(existingPlaceholder);
		}

		// Append selected divs in their original order
		let hasSelectedItems = false;
		this._menuItemsMap.forEach((item) => {
			if (item.selected) {
				item.sourceDiv.classList.remove(TAILWIND_HIDDEN_CLASS); // Ensure it's visible
				this._targetElement.appendChild(item.sourceDiv);
				hasSelectedItems = true;
			}
		});

		// Add placeholder if target is empty and no items were selected to be appended
		if (!hasSelectedItems) {
			const placeholder = document.createElement("p");
			placeholder.className = TS_TARGET_PLACEHOLDER_CLASS;
			this._targetElement.appendChild(placeholder);
		}
	}

	_checkMenuPlaceholderAndButton() {
		if (!this._menuPlaceholderMessageElement || !this._menuButton) return;
		let visibleItemCount = 0;
		this._menuItemsMap.forEach((itemData) => {
			if (itemData.menuListItem.style.display !== "none") {
				visibleItemCount++;
			}
		});
		const allItemsSelected = visibleItemCount === 0;
		this._menuPlaceholderMessageElement.style.display = allItemsSelected ? "block" : "none";

		if (allItemsSelected) {
			this._menuButton.classList.add(TS_MENU_BUTTON_STATE_DISABLED);
		} else {
			this._menuButton.classList.remove(TS_MENU_BUTTON_STATE_DISABLED);
		}
	}

	_handleMutations(mutationsList) {
		for (const mutation of mutationsList) {
			if (mutation.type === "attributes" && mutation.attributeName === "class") {
				const targetDiv = mutation.target;
				const itemValue = targetDiv.dataset.value;
				const itemData = this._menuItemsMap.get(itemValue);
				if (itemData) {
					const isNowHiddenByClass = targetDiv.classList.contains(TAILWIND_HIDDEN_CLASS);
					if (isNowHiddenByClass && itemData.selected) {
						itemData.selected = false;
						this._updateItemState(itemData, false, true);
					} else if (!isNowHiddenByClass && !itemData.selected) {
						itemData.selected = true;
						this._updateItemState(itemData, false, true);
					}
				}
			}
		}
	}

	_handleContentClose(event) {
		const itemValue = event.currentTarget.dataset.value;
		const itemData = this._menuItemsMap.get(itemValue);
		if (itemData && itemData.selected) {
			itemData.selected = false;
			this._updateItemState(itemData, false, true);
		}
	}

	_toggleMenu(event) {
		event.preventDefault();
		event.stopPropagation();
		if (this._menuButton && this._menuButton.classList.contains(TS_MENU_BUTTON_STATE_DISABLED)) {
			return;
		}
		const isHidden = this._menuPopupElement.style.display === "none" || this._menuPopupElement.style.display === "";
		if (isHidden) {
			this._checkMenuPlaceholderAndButton();
		}
		this._menuPopupElement.style.display = isHidden ? "block" : "none";
	}

	_closeMenu() {
		this._menuPopupElement.style.display = "none";
	}

	_handleClickOutside(event) {
		if (!this.contains(event.target) && this._menuPopupElement.style.display !== "none") {
			if (this._menuButton && this._menuButton.contains(event.target)) {
				return;
			}
			this._closeMenu();
		}
	}

	_handleMenuItemClick(event) {
		const clickedButton = event.target.closest(`.${TS_ITEM_ACTION}`);
		if (clickedButton && clickedButton.dataset.value) {
			const itemValue = clickedButton.dataset.value;
			const itemData = this._menuItemsMap.get(itemValue);
			if (itemData) {
				if (!itemData.selected) {
					itemData.selected = true;
					this._updateItemState(itemData, true, true);
				}
			}
		}
	}

	_updateItemState(itemData, closeMenuAfterUpdate, manageHiddenClass) {
		if (!itemData || !itemData.sourceDiv || !itemData.menuItemButton || !itemData.menuListItem || !itemData.menuLabelElement) {
			console.warn("TabSelectorMenu: Incomplete itemData for update:", itemData);
			return;
		}

		const menuLabel = itemData.menuLabelElement;

		if (itemData.selected) {
			// No direct DOM manipulation of sourceDiv here regarding targetElement
			// _refreshTargetOrder will handle placement.
			if (manageHiddenClass) itemData.sourceDiv.classList.remove(TAILWIND_HIDDEN_CLASS);
			itemData.menuItemButton.classList.add(TS_ITEM_IS_SELECTED);
			itemData.menuListItem.style.display = "none";

			menuLabel.classList.add(TS_MENU_LABEL_DISPLAYED_STATE);
			menuLabel.classList.remove(TS_MENU_LABEL_IN_MENU_STATE);
		} else {
			if (manageHiddenClass) itemData.sourceDiv.classList.add(TAILWIND_HIDDEN_CLASS);
			this._clearFormElements(itemData.sourceDiv);
			itemData.menuItemButton.classList.remove(TS_ITEM_IS_SELECTED);
			itemData.menuListItem.style.display = "";

			menuLabel.classList.add(TS_MENU_LABEL_IN_MENU_STATE);
			menuLabel.classList.remove(TS_MENU_LABEL_DISPLAYED_STATE);

			// If the div is being hidden, ensure it's moved back to the component
			// if it was in the target. _refreshTargetOrder will handle its removal from target.
			if (itemData.sourceDiv.parentElement !== this && itemData.sourceDiv.parentElement !== this._targetElement) {
				this.appendChild(itemData.sourceDiv);
			} else if (itemData.sourceDiv.parentElement === this._targetElement) {
				// It will be removed by _refreshTargetOrder, then re-appended to 'this' if needed
				// For now, just ensure it's not orphaned if _refreshTargetOrder doesn't run immediately after this.
				// Actually, better to let _refreshTargetOrder handle removal from target.
				// And if it's not selected, ensure it's a child of 'this' for mutation observer.
			}
		}

		this._refreshTargetOrder(); // Centralize target DOM updates
		this._checkMenuPlaceholderAndButton();

		if (closeMenuAfterUpdate) this._closeMenu();
	}
}
