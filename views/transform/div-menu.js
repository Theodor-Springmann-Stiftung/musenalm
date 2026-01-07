const TAILWIND_HIDDEN_CLASS = "hidden";
const DM_STAY_ATTRIBUTE = "dm-stay";
const DM_TITLE_ATTRIBUTE = "dm-title";
const DM_MENU_BUTTON_CLASS = "dm-menu-button";
const DM_TARGET_ATTRIBUTE = "dm-target";
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
	}

	connectedCallback() {
		this._cildren = Array.from(this.children)
			.filter((node) => node.nodeType === Node.ELEMENT_NODE && !node.classList.contains(DM_MENU_BUTTON_CLASS))
			.map((node) => {
				return {
					node: node,
					stay: () => node.hasAttribute(DM_STAY_ATTRIBUTE) && node.getAttribute(DM_STAY_ATTRIBUTE) == "true",
					hidden: () => node.classList.contains(TAILWIND_HIDDEN_CLASS),
					name: () => {
						const label = node.querySelector("label");
						return label ? label.innerHTML : node.hasAttribute(DM_TITLE_ATTRIBUTE) ? node.getAttribute(DM_TITLE_ATTRIBUTE) : "";
					},
				};
			});

		this._target = document.getElementById(this.getAttribute(DM_TARGET_ATTRIBUTE));
		if (!this._target) {
			this._target = this;
		}

		this._button = this.querySelector(`.${DM_MENU_BUTTON_CLASS}`);
		if (!this._button) {
			console.error("DivManagerMenu needs a button element.");
			return;
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

		this.renderMenu();
		this.renderIntoTarget();
	}

	_toggleMenu(event) {
		event.preventDefault();
		event.stopPropagation();

		if (!this._menu) {
			this._menu = this.querySelector(`.${DM_MENU_CLASS}`);
		}

		if (!this._menu) {
			console.error("DivManagerMenu: Menu not found.");
			return;
		}

		if (this._menu.classList.contains(TAILWIND_HIDDEN_CLASS)) {
			this._menu.classList.remove(TAILWIND_HIDDEN_CLASS);
			document.addEventListener("click", this.handleClickOutside);
		} else {
			this._menu.classList.add(TAILWIND_HIDDEN_CLASS);
			document.removeEventListener("click", this.handleClickOutside);
		}
	}

	handleClickOutside(event) {
		if (!this._menu) return;
		if (!this._menu.contains(event.target) && !this._button.contains(event.target)) {
			this._menu.classList.add(TAILWIND_HIDDEN_CLASS);
		}
	}

	renderButton() {
		if (!this._button) {
			return;
		}

		for (const child of this._cildren) {
			if (child.hidden()) {
				if (this._button.parentElement !== this) {
					this._button.classList.remove(TAILWIND_HIDDEN_CLASS);
					this.appendChild(this._button);
				}
				return;
			}
		}

		this._button.classList.add(TAILWIND_HIDDEN_CLASS);
		this.removeChild(this._button);
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

		if (!child.hidden()) {
			child.node.classList.add(TAILWIND_HIDDEN_CLASS);
		}

		this._target.removeChild(child.node);
		// INFO: the order of these matter, dont fuck it up
		this.renderButton();
		this.renderMenu();
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
		if (child.hidden()) {
			child.node.classList.remove(TAILWIND_HIDDEN_CLASS);
		}

		this._target.appendChild(child.node);
		// INFO: the order of these matter, dont fuck it up
		this.renderMenu();
		this.renderButton();
	}

	renderMenu() {
		if (!this._menu) {
			this._button.innerHTML += `<div class="${DM_MENU_CLASS} absolute hidden"></div>`;
			this._menu = this._button.querySelector(`.${DM_MENU_CLASS}`);
		}

		this._menu.innerHTML = `${this._cildren
			.map((c, index) => {
				if (!c.hidden()) return "";
				return `
				<button type="button" class="${DM_ITEM_CLASS}" dm-itemno="${index}">
					${c.name()}
				</button>`;
			})
			.join("")}`;
		this._menu = this.querySelector(`.${DM_MENU_CLASS}`);
		const buttons = this._menu.querySelectorAll(`.${DM_ITEM_CLASS}`);
		buttons.forEach((button) => {
			button.addEventListener("click", (event) => {
				this.showDiv(event, parseInt(button.getAttribute("dm-itemno")));
				this._toggleMenu(event);
			});
		});
	}

	renderIntoTarget() {
		this._cildren.forEach((child) => {
			if (!child.hidden()) {
				this._target.appendChild(child.node);
			}
		});
	}
}
