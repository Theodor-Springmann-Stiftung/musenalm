const RBI_BUTTON_BASE_CLASS = "rbi-button";
const RBI_ICON_CLASS = "rbi-icon";
export class ResetButton extends HTMLElement {
	constructor() {
		super();
		this.initialStates = new Map();
		this._controlledElements = [];
		this.button = null;
		this.lastOverallModifiedState = null;

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	static get observedAttributes() {
		return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
	}

	connectedCallback() {
		const buttonHTML = `
              <button type="button" class="${RBI_BUTTON_BASE_CLASS} cursor-pointer disabled:cursor-default" aria-label="Reset field" data-tippy-placement="right" data-tippy-content="Feld zurücksetzen">
								<span class="${RBI_ICON_CLASS} ri-arrow-go-back-fill"></span>
              </button>
            `;
		this.innerHTML = buttonHTML;
		this.button = this.querySelector("button");

		if (this.button) {
			this.button.addEventListener("click", this.handleReset);
		} else {
			console.error("ResetButtonIndividual: Button element not found after setting innerHTML.");
		}

		this.updateControlledElements();
		this.updateButtonAriaLabel();
	}

	disconnectedCallback() {
		if (this.button) {
			this.button.removeEventListener("click", this.handleReset);
		}
		this._controlledElements.forEach((el) => {
			el.removeEventListener("input", this.handleInputChange);
			el.removeEventListener("change", this.handleInputChange);
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;

		if (name === "controls") {
			this.updateControlledElements();
		}
		if (name === "controls" || name === "button-aria-label") {
			this.updateButtonAriaLabel();
		}
	}

	updateControlledElements() {
		this._controlledElements.forEach((el) => {
			el.removeEventListener("input", this.handleInputChange);
			el.removeEventListener("change", this.handleInputChange);
		});
		this._controlledElements = [];
		// INFO: we don't clear the intitial states here, in case we
		// want to reattach the same elements later.
		// this.initialStates.clear();
		this.lastOverallModifiedState = null;

		const controlIds = (this.getAttribute("controls") || "")
			.split(",")
			.map((id) => id.trim())
			.filter((id) => id);

		if (!controlIds.length && this.button) {
			this.button.disabled = true;
			this.button.setAttribute("aria-disabled", "true");
			this.checkIfModified();
			return;
		}

		const foundElements = [];
		controlIds.forEach((id) => {
			const element = document.getElementById(id);
			if (element) {
				foundElements.push(element);
				this.storeInitialState(element);
				element.addEventListener("input", this.handleInputChange);
				element.addEventListener("change", this.handleInputChange);
			} else {
				console.warn(`ResetButtonIndividual: Element with ID "${id}" not found.`);
			}
		});
		this._controlledElements = foundElements;

		if (this.button) {
			this.button.disabled = this._controlledElements.length === 0;
			this.button.setAttribute("aria-controls", this._controlledElements.map((el) => el.id).join(" "));
			if (this.button.disabled) {
				this.button.setAttribute("aria-disabled", "true");
			} else {
				this.button.removeAttribute("aria-disabled");
			}
		}
		this.checkIfModified();
	}

	storeInitialState(element) {
		if (this.initialStates.has(element.id)) {
			return;
		}
		let state;
		switch (element.type) {
			case "checkbox":
			case "radio":
				state = { checked: element.checked };
				break;
			case "select-multiple":
				state = {
					selectedOptions: Array.from(element.options)
						.filter((o) => o.selected)
						.map((o) => o.value),
				};
				break;
			case "select-one":
			default:
				state = { value: element.value };
				break;
		}
		this.initialStates.set(element.id, state);
	}

	resetElement(element) {
		const initialState = this.initialStates.get(element.id);
		if (!initialState) return;

		switch (element.type) {
			case "checkbox":
			case "radio":
				element.checked = initialState.checked;
				break;
			case "select-multiple":
				Array.from(element.options).forEach((option) => {
					option.selected = initialState.selectedOptions.includes(option.value);
				});
				break;
			case "select-one":
			default:
				element.value = initialState.value;
				break;
		}
		element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
		element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
	}

	handleReset() {
		this._controlledElements.forEach((el) => {
			this.resetElement(el);
		});
		this.checkIfModified();
	}

	handleInputChange(event) {
		if (this._controlledElements.includes(event.target)) {
			this.checkIfModified();
		}
	}

	// Internal helper to check a single element
	isElementModified(element) {
		const initialState = this.initialStates.get(element.id);
		if (!initialState) return false;

		switch (element.type) {
			case "checkbox":
			case "radio":
				return element.checked !== initialState.checked;
			case "select-multiple":
				const currentSelected = Array.from(element.options)
					.filter((o) => o.selected)
					.map((o) => o.value);
				const initialSelected = initialState.selectedOptions;
				return currentSelected.length !== initialSelected.length || currentSelected.some((val) => !initialSelected.includes(val)) || initialSelected.some((val) => !currentSelected.includes(val));
			case "select-one":
			default:
				return element.value !== initialState.value;
		}
	}

	// Public method to check overall modification state
	isCurrentlyModified() {
		if (this._controlledElements.length === 0) {
			return false; // Not modified if there are no elements to control
		}
		for (const el of this._controlledElements) {
			if (this.isElementModified(el)) {
				return true; // Found one modified element
			}
		}
		return false; // No elements were modified
	}

	checkIfModified() {
		const overallModified = this.isCurrentlyModified(); // Use the new public method

		// Update classes for controlled elements
		this._controlledElements.forEach((el) => {
			if (this.isElementModified(el)) {
				el.classList.add("modified-element");
			} else {
				el.classList.remove("modified-element");
			}
		});

		const wrapperClass = this.getAttribute("wrapper-class");
		if (wrapperClass) {
			const wrapperElement = this.closest(`.${wrapperClass}`);
			if (wrapperElement) {
				const modifiedSuffix = this.getAttribute("modified-class-suffix") || "modified";
				const modifiedWrapperClassName = `${wrapperClass}-${modifiedSuffix}`;
				if (overallModified) {
					wrapperElement.classList.add(modifiedWrapperClassName);
				} else {
					wrapperElement.classList.remove(modifiedWrapperClassName);
				}
			}
		}

		if (this.button) {
			this.button.disabled = !overallModified || this._controlledElements.length === 0;
			if (this.button.disabled) {
				this.button.setAttribute("aria-disabled", "true");
			} else {
				this.button.removeAttribute("aria-disabled");
			}
		}

		if (this.lastOverallModifiedState !== overallModified) {
			const event = new CustomEvent("rbichange", {
				bubbles: true,
				composed: true,
				detail: {
					modified: overallModified,
					controlledElementIds: this._controlledElements.map((el) => el.id),
					instance: this,
				},
			});
			this.dispatchEvent(event);
			this.lastOverallModifiedState = overallModified;
		}
	}

	updateButtonAriaLabel() {
		if (!this.button) return;

		let labelText = this.getAttribute("button-aria-label");

		if (!labelText) {
			const controlIds = this._controlledElements.map((el) => el.id);
			if (controlIds.length === 1 && this._controlledElements[0]) {
				const controlledEl = this._controlledElements[0];
				const labelEl = document.querySelector(`label[for="${controlledEl.id}"]`);
				let fieldName = controlledEl.name || controlledEl.id;
				if (labelEl && labelEl.textContent) {
					fieldName = labelEl.textContent.trim().replace(/[:*]$/, "").trim();
				} else if (controlledEl.getAttribute("aria-label")) {
					fieldName = controlledEl.getAttribute("aria-label");
				}
				labelText = `Reset ${fieldName}`;
			} else if (controlIds.length > 1) {
				labelText = "Reset selected fields";
			} else {
				labelText = "Reset field";
			}
		}
		this.button.setAttribute("aria-label", labelText);
	}
}
