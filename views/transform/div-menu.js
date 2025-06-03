const TS_MENU_COMPONENT = "ts-menu";
const TS_TOGGLE_BUTTON = "ts-menu-toggle-button";
const TS_POPUP = "ts-menu-popup";
const TS_LIST = "ts-menu-list";
const TS_PLACEHOLDER_MESSAGE = "ts-menu-placeholder-message";
const TS_LIST_ITEM = "ts-menu-list-item";
const TS_ITEM_ACTION = "ts-menu-item-action";
const TS_ITEM_IS_SELECTED = "ts-item-is-selected";
const TS_CONTENT_CLOSE_BUTTON = "ts-content-close-button";
const TAILWIND_HIDDEN_CLASS = "hidden";

export class DivMenu extends HTMLElement {
	constructor() {
		super();
		this._menuItemsMap = new Map();
		this._targetElement = null;
		this._originalChildDivs = [];
		this._observer = null;
		this._menuPlaceholderMessageElement = null;

		this._toggleMenu = this._toggleMenu.bind(this);
		this._handleMenuItemClick = this._handleMenuItemClick.bind(this);
		this._handleClickOutside = this._handleClickOutside.bind(this);
		this._handleContentClose = this._handleContentClose.bind(this);
		this._handleMutations = this._handleMutations.bind(this);
		this._checkMenuPlaceholderAndButton = this._checkMenuPlaceholderAndButton.bind(this);
		this._clearFormElements = this._clearFormElements.bind(this);
	}

	connectedCallback() {
		this._originalChildDivs = Array.from(this.children).filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName === "DIV");
		this._originalChildDivs.forEach((div) => div.remove());

		const componentHTML = `
                    <button type="button" class="${TS_TOGGLE_BUTTON}">Options</button>
                    <div class="${TS_POPUP}">
                        <ul class="${TS_LIST}">
                            <li class="${TS_PLACEHOLDER_MESSAGE}">All items are currently shown.</li>
                        </ul>
                    </div>
                `;
		this.innerHTML = componentHTML;

		this._menuButton = this.querySelector(`.${TS_TOGGLE_BUTTON}`);
		this._menuPopupElement = this.querySelector(`.${TS_POPUP}`);
		this._menuListElement = this.querySelector(`.${TS_LIST}`);
		this._menuPlaceholderMessageElement = this.querySelector(`.${TS_PLACEHOLDER_MESSAGE}`);

		if (!this._menuButton || !this._menuPopupElement || !this._menuListElement || !this._menuPlaceholderMessageElement) {
			console.error("CRITICAL: Essential parts missing after creating component from string.");
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
			// Use a specific class for the menu label to distinguish from form labels
			const menuLabelElement = sourceDiv.querySelector("label.menu-label");
			const itemValue = sourceDiv.dataset.value;

			if (!menuLabelElement || !itemValue) {
				console.warn('TabSelectorMenu: Source div missing <label class="menu-label"> or data-value:', sourceDiv);
				return;
			}

			const closeButton = document.createElement("button");
			closeButton.type = "button";
			closeButton.className = TS_CONTENT_CLOSE_BUTTON;
			closeButton.innerHTML = "&times;";
			closeButton.dataset.value = itemValue;
			closeButton.addEventListener("click", this._handleContentClose);
			sourceDiv.prepend(closeButton);

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
				selected: isInitiallySelected,
			});

			this._observer.observe(sourceDiv, { attributes: true, attributeFilter: ["class"] });
		});

		this._menuItemsMap.forEach((itemData) => {
			if (itemData.selected) {
				this._updateItemState(itemData, false, true);
			}
		});
		this._checkMenuPlaceholderAndButton();

		this._menuButton.addEventListener("click", this._toggleMenu);
		this._menuListElement.addEventListener("click", this._handleMenuItemClick);
		document.addEventListener("click", this._handleClickOutside);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this._handleClickOutside);
		if (this._observer) {
			this._observer.disconnect();
		}
		this._menuItemsMap.forEach((itemData) => {
			const closeButton = itemData.sourceDiv.querySelector(`.${TS_CONTENT_CLOSE_BUTTON}`);
			if (closeButton) {
				closeButton.removeEventListener("click", this._handleContentClose);
			}
		});
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
					// For radios, only uncheck if it's the one that was checked.
					// For checkboxes, this is fine.
					// A more robust radio reset might involve finding the default or unchecking all in group.
					// For simplicity here, just unchecking.
					el.checked = false;
					break;
				case "file":
					el.value = null;
					break;
				default:
					el.value = "";
			}
			if (el.tagName === "SELECT") {
				el.selectedIndex = 0; // Reset to the first option (often a placeholder)
				// or -1 to clear completely if no placeholder.
			}
		});
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
		this._menuButton.disabled = allItemsSelected;
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
		event.stopPropagation();
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
		if (!itemData || !itemData.sourceDiv || !itemData.menuItemButton || !itemData.menuListItem) {
			console.warn("TabSelectorMenu: Incomplete itemData for update:", itemData);
			return;
		}

		if (itemData.selected) {
			if (manageHiddenClass) {
				itemData.sourceDiv.classList.remove(TAILWIND_HIDDEN_CLASS);
			}
			itemData.menuItemButton.classList.add(TS_ITEM_IS_SELECTED);
			itemData.menuListItem.style.display = "none";

			if (this._targetElement) {
				this._targetElement.appendChild(itemData.sourceDiv);
			} else {
				console.warn(`TabSelectorMenu: Cannot mount div. Target element not found.`);
			}
		} else {
			if (manageHiddenClass) {
				itemData.sourceDiv.classList.add(TAILWIND_HIDDEN_CLASS);
			}
			this._clearFormElements(itemData.sourceDiv);
			itemData.menuItemButton.classList.remove(TS_ITEM_IS_SELECTED);
			itemData.menuListItem.style.display = "";

			if (itemData.sourceDiv.parentElement !== this) {
				this.appendChild(itemData.sourceDiv);
			}
		}

		this._checkMenuPlaceholderAndButton();

		if (closeMenuAfterUpdate) {
			this._closeMenu();
		}
	}
}
