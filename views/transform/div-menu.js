const TAILWIND_HIDDEN_CLASS = "hidden";
const DM_STAY_ATTRIBUTE = "dm-stay";
const DM_TITLE_ATTRIBUTE = "dm-title";
const DM_MENU_BUTTON_CLASS = "dm-menu-button";
const DM_TARGET_ATTRIBUTE = "dm-target";
const DM_CHILD_TARGET_ATTRIBUTE = "data-dm-target";
const DM_MENU_CLASS = "dm-menu";
const DM_ITEM_CLASS = "dm-menu-item";
const DM_CLOSE_BUTTON_CLASS = "dm-close-button";

// Prereq: child divs must eiteher have dm-title attr or a label element
// The child divs will be moved to the target element when selected
// The target element must be specified by the attribute dm-target on the custom element
// The menu button must have the class dm-menu-button
// The child divs can contain a button with the class dm-close-button

export class DivManager extends HTMLElement {
	constructor() {
		super();
		this.#reset();
		// INFO: we do this to avoid binding issues with the event listener
		this.boundHandleClickOutside = this.handleClickOutside.bind(this);
	}

	#reset() {
		this._cildren = [];
		this._rendered = [];
		this._target = null;
		this._button = null;
		this._menu = null;
		this._originalButtonText = null;
	}

	connectedCallback() {
		this._target = document.getElementById(this.getAttribute(DM_TARGET_ATTRIBUTE));
		if (!this._target) {
			this._target = this;
		}

		this._cildren = Array.from(this.children)
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && !node.classList.contains(DM_MENU_BUTTON_CLASS))
			.map((node) => {
				return {
					node: node,
					target: () => {
						const targetId = node.getAttribute(DM_CHILD_TARGET_ATTRIBUTE);
						if (!targetId) {
							return this._target;
						}
						return document.getElementById(targetId) || this._target;
					},
					stay: () => node.hasAttribute(DM_STAY_ATTRIBUTE) && node.getAttribute(DM_STAY_ATTRIBUTE) == "true",
					hidden: () => node.classList.contains(TAILWIND_HIDDEN_CLASS),
					name: () => {
						const label = node.querySelector("label");
						return label ? label.innerHTML : node.hasAttribute(DM_TITLE_ATTRIBUTE) ? node.getAttribute(DM_TITLE_ATTRIBUTE) : "";
					},
					nameText: () => {
						const label = node.querySelector("label");
						return label ? label.textContent.trim() : node.hasAttribute(DM_TITLE_ATTRIBUTE) ? node.getAttribute(DM_TITLE_ATTRIBUTE) : "";
					},
				};
			});

		const existingButton = this._button;
		this._button = this.querySelector(`.${DM_MENU_BUTTON_CLASS}`);
		if (!this._button && existingButton) {
			this._button = existingButton;
			if (!this._button.parentElement) {
				this.appendChild(this._button);
			}
		}
		if (!this._button) {
			this._button = document.createElement("button");
			this._button.type = "button";
			this._button.classList.add(DM_MENU_BUTTON_CLASS, TAILWIND_HIDDEN_CLASS);
			this._button.innerHTML = '<i class="ri-add-line"></i> Felder hinzufügen';
			this.appendChild(this._button);
		}
		if (!this._originalButtonText) {
			this._originalButtonText = this._button.innerHTML;
		}

		for (const child of this._cildren) {
			this.removeChild(child.node);
		}
		this._button.addEventListener("click", this._toggleMenu.bind(this));
		this._button.classList.add("relative");

		for (const child of this._cildren) {
			const closebtns = child.node.querySelectorAll(`.${DM_CLOSE_BUTTON_CLASS}`);
			closebtns.forEach((btn) => {
				btn.addEventListener("click", (event) => {
					this.hideDiv(event, child.node);
				});
			});
		}

		this.renderIntoTarget();
		this.refresh();

		this._observer = new MutationObserver(() => {
			this.refresh();
		});
		this._cildren.forEach((child) => {
			this._observer.observe(child.node, { attributes: true, attributeFilter: ["class"] });
		});
	}

	disconnectedCallback() {
		if (this._observer) {
			this._observer.disconnect();
		}
		document.removeEventListener("click", this.boundHandleClickOutside);
	}

	refresh() {
		this.renderButton();
		this.renderMenu();
		this.updateTargetVisibility();
	}

	_toggleMenu(event) {
		event.preventDefault();
		event.stopPropagation();

		const hiddenChildren = this._cildren.filter((c) => c.hidden());
		if (hiddenChildren.length === 1) {
			const index = this._cildren.indexOf(hiddenChildren[0]);
			this.showDiv(event, index);
			return;
		}

		if (hiddenChildren.length === 0) {
			this.hideMenu();
			return;
		}

		this.renderMenu();

		if (this._menu.classList.contains(TAILWIND_HIDDEN_CLASS)) {
			this._menu.classList.remove(TAILWIND_HIDDEN_CLASS);
			document.addEventListener("click", this.boundHandleClickOutside);
		} else {
			this._menu.classList.add(TAILWIND_HIDDEN_CLASS);
			document.removeEventListener("click", this.boundHandleClickOutside);
		}
	}

	handleClickOutside(event) {
		if (!this._menu) return;
		if (!this._menu.contains(event.target) && !this._button.contains(event.target)) {
			this.hideMenu();
		}
	}

	hideMenu() {
		if (!this._menu) return;
		this._menu.classList.add(TAILWIND_HIDDEN_CLASS);
		document.removeEventListener("click", this.boundHandleClickOutside);
	}

	renderButton() {
		if (!this._button) {
			return;
		}

		// Store original button text if not already stored (do this first)
		if (!this._originalButtonText) {
			this._originalButtonText = this._button.innerHTML;
		}

		// Check if there are any hidden children
		const hiddenChildren = this._cildren.filter((c) => c.hidden());

		if (hiddenChildren.length === 0) {
			// No hidden children, hide and remove the button completely
			this._button.classList.add(TAILWIND_HIDDEN_CLASS);
			if (this._button.parentElement) {
				this._button.parentElement.removeChild(this._button);
			}
			this._menu = null;
			this.hideMenu();
			return;
		}

		// There are hidden children, ensure button is in the DOM and visible
		if (!this._button.parentElement) {
			this.appendChild(this._button);
		}
		this._button.classList.remove(TAILWIND_HIDDEN_CLASS);

		// Update button text based on number of hidden children
		if (hiddenChildren.length === 1) {
			// Only one option left - show its name
			const icon = this._button.querySelector("i");
			const iconHTML = icon ? icon.outerHTML : '<i class="ri-add-line"></i>';
			this._button.innerHTML = `${iconHTML}\n${hiddenChildren[0].nameText()} hinzufügen`;
			this._menu = null;
			this.hideMenu();
		} else {
			// Multiple options - restore original text
			this._button.innerHTML = this._originalButtonText;
			this._menu = null;
		}
	}

	hideDiv(event, node) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (!node || !(node instanceof HTMLElement)) {
			console.error("DivManagerMenu: Invalid node provided.");
			return;
		}

		const child = this._cildren.find((c) => c.node === node);
		if (!child) {
			console.error("DivManagerMenu: Child not found.");
			return;
		}

		// Always ensure the hidden class is added
		child.node.classList.add(TAILWIND_HIDDEN_CLASS);
		this._clearFields(child.node);

		const target = child.target();
		if (target && target.contains(child.node)) {
			target.removeChild(child.node);
		}
		if (!child.node.parentElement) {
			this.appendChild(child.node);
		}
		// INFO: the order of these matter, dont fuck it up
		this.renderButton();
		this.renderMenu();
		this.updateTargetVisibility();
	}

	showDiv(event, index) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (index < 0 || index >= this._cildren.length) {
			console.error("DivManagerMenu: Invalid index.");
			return;
		}

		const child = this._cildren[index];
		// Always ensure the hidden class is removed
		child.node.classList.remove(TAILWIND_HIDDEN_CLASS);

		this.insertChildInOrder(child);
		// INFO: the order of these matter, dont fuck it up
		this.renderMenu();
		this.renderButton();
		this.updateTargetVisibility();

		// Resize any textareas in the newly shown element
		if (typeof window.TextareaAutoResize === "function") {
			const textareas = child.node.querySelectorAll("textarea");
			if (textareas.length > 0) {
				// Small delay to ensure element is visible before measuring
				setTimeout(() => {
					textareas.forEach((textarea) => {
						if (textarea.dataset.dmResizeBound !== "true") {
							textarea.dataset.dmResizeBound = "true";
							textarea.addEventListener("input", () => {
								window.TextareaAutoResize(textarea);
							});
						}
						window.TextareaAutoResize(textarea);
					});
				}, 10);
			}
		}
	}

	renderMenu() {
		const hiddenChildren = this._cildren.filter((c) => c.hidden());
		if (hiddenChildren.length <= 1) {
			this.hideMenu();
			return;
		}

		if (!this._menu || !this._button.contains(this._menu)) {
			this._button.insertAdjacentHTML("beforeend", `<div class="${DM_MENU_CLASS} absolute hidden"></div>`);
			this._menu = this._button.querySelector(`.${DM_MENU_CLASS}`);
		}

		this._menu.innerHTML = `${hiddenChildren
			.map((c, index) => {
				return `
				<button type="button" class="${DM_ITEM_CLASS}" dm-itemno="${this._cildren.indexOf(c)}">
					${c.name()}
				</button>`;
			})
			.join("")}`;
		const buttons = this._menu.querySelectorAll(`.${DM_ITEM_CLASS}`);
		buttons.forEach((button) => {
			button.addEventListener("click", (event) => {
				this.showDiv(event, parseInt(button.getAttribute("dm-itemno")));
				this.hideMenu();
				this.renderButton();
			});
		});
	}

	renderIntoTarget() {
		this._cildren.forEach((child) => {
			if (!child.hidden()) {
				this.insertChildInOrder(child);
			}
		});
		this.updateTargetVisibility();
	}

	insertChildInOrder(child) {
		const target = child.target();
		const currentIndex = this._cildren.indexOf(child);
		const nextVisibleSibling = this._cildren
			.slice(currentIndex + 1)
			.filter((c) => c.target() === target)
			.map((c) => c.node)
			.find((node) => target && target.contains(node));

		if (!target) {
			return;
		}

		if (nextVisibleSibling) {
			target.insertBefore(child.node, nextVisibleSibling);
		} else {
			target.appendChild(child.node);
		}
	}

	updateTargetVisibility() {
		const targets = new Set(
			this._cildren.map((child) => child.target()).filter((target) => target && target !== this),
		);

		targets.forEach((target) => {
			const hasVisibleChild = Array.from(target.children).some(
				(node) => !node.classList.contains(TAILWIND_HIDDEN_CLASS),
			);
			target.classList.toggle(TAILWIND_HIDDEN_CLASS, !hasVisibleChild);
		});
	}

	_clearFields(container) {
		if (!container) {
			return;
		}
		container.querySelectorAll("input, textarea, select").forEach((field) => {
			if (field.matches("input[type='checkbox'], input[type='radio']")) {
				field.checked = false;
				return;
			}
			if (field.matches("select")) {
				field.selectedIndex = -1;
				return;
			}
			field.value = "";
		});
		container.querySelectorAll("trix-editor").forEach((editor) => {
			if (typeof editor.editor?.loadHTML === "function") {
				editor.editor.loadHTML("");
			}
		});
	}
}
