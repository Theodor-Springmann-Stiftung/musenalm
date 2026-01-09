const ROLE_ADD_TOGGLE = "[data-role='relation-add-toggle']";
const ROLE_ADD_PANEL = "[data-role='relation-add-panel']";
const ROLE_ADD_CLOSE = "[data-role='relation-add-close']";
const ROLE_ADD_APPLY = "[data-role='relation-add-apply']";
const ROLE_ADD_ERROR = "[data-role='relation-add-error']";
const ROLE_ADD_ROW = "[data-role='relation-add-row']";
const ROLE_ADD_SELECT = "[data-role='relation-add-select']";
const ROLE_TYPE_SELECT = "[data-role='relation-type-select']";
const ROLE_UNCERTAIN = "[data-role='relation-uncertain']";
const ROLE_NEW_TEMPLATE = "template[data-role='relation-new-template']";
const ROLE_NEW_DELETE = "[data-role='relation-new-delete']";
const ROLE_REL_ROW = "[data-rel-row]";
const ROLE_REL_STRIKE = "[data-rel-strike]";

export class RelationsEditor extends HTMLElement {
	constructor() {
		super();
		this._pendingItem = null;
		this._pendingApply = false;
	}

	connectedCallback() {
		this._prefix = this.getAttribute("data-prefix") || "";
		this._linkBase = this.getAttribute("data-link-base") || "";
		this._newLabel = this.getAttribute("data-new-label") || "(Neu)";
		this._addToggleId = this.getAttribute("data-add-toggle-id") || "";
		this._setupAddPanel();
		this._setupDeleteToggles();
	}

	_setupAddPanel() {
		this._addToggle = this.querySelector(ROLE_ADD_TOGGLE);
		if (this._addToggleId) {
			const externalToggle = document.getElementById(this._addToggleId);
			if (externalToggle) {
				this._addToggle = externalToggle;
			}
		}
		this._addPanel = this.querySelector(ROLE_ADD_PANEL);
		this._addClose = this.querySelector(ROLE_ADD_CLOSE);
		this._addApply = this.querySelector(ROLE_ADD_APPLY);
		this._addError = this.querySelector(ROLE_ADD_ERROR);
		this._addRow = this.querySelector(ROLE_ADD_ROW);
		this._addSelect = this.querySelector(ROLE_ADD_SELECT);
		this._typeSelect = this.querySelector(ROLE_TYPE_SELECT);
		this._uncertain = this.querySelector(ROLE_UNCERTAIN);
		this._template = this.querySelector(ROLE_NEW_TEMPLATE);
		this._addInput = this._addSelect ? this._addSelect.querySelector(".ssr-input") : null;

		if (!this._addPanel || !this._addRow || !this._addSelect || !this._typeSelect || !this._uncertain || !this._template) {
			return;
		}

		if (this._addToggle) {
			this._addToggle.addEventListener("click", () => {
				this._addPanel.classList.toggle("hidden");
			});
		}

		if (this._addClose) {
			this._addClose.addEventListener("click", () => {
				this._addPanel.classList.add("hidden");
			});
		}

		if (this._addInput) {
			this._addInput.addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					this._pendingApply = true;
				}
			});
		}

		if (this._addApply) {
			this._addApply.addEventListener("click", () => {
				this._pendingApply = false;
				const idInput = this._addPanel.querySelector(`input[name='${this._prefix}_new_id']`);
				const hasSelection = idInput && idInput.value.trim().length > 0;
				if (!hasSelection) {
					if (this._addError) {
						this._addError.classList.remove("hidden");
					}
					return;
				}
				if (this._addError) {
					this._addError.classList.add("hidden");
				}
				if (!this._pendingItem) {
					return;
				}
				this._insertNewRow();
			});
		}

		this._addSelect.addEventListener("ssrchange", (event) => {
			this._pendingItem = event.detail?.item || null;
			if (this._pendingItem && this._addError) {
				this._addError.classList.add("hidden");
			}
			if (this._pendingApply && this._pendingItem && this._addApply) {
				this._pendingApply = false;
				this._addApply.click();
			}
		});
	}

	_clearAddPanel() {
		if (this._addSelect) {
			const clearButton = this._addSelect.querySelector(".ssr-clear-button");
			if (clearButton) {
				clearButton.click();
			}
		}
		if (this._typeSelect) {
			this._typeSelect.selectedIndex = 0;
		}
		if (this._uncertain) {
			this._uncertain.checked = false;
		}
		if (this._addError) {
			this._addError.classList.add("hidden");
		}
	}

	_insertNewRow() {
		const fragment = this._template.content.cloneNode(true);
		const row = fragment.querySelector(ROLE_REL_ROW) || fragment.firstElementChild;
		if (!row) {
			return;
		}

		const link = fragment.querySelector("[data-rel-link]");
		if (link) {
			link.setAttribute("href", `${this._linkBase}${this._pendingItem.id}`);
		}

		const nameEl = fragment.querySelector("[data-rel-name]");
		if (nameEl) {
			nameEl.textContent = this._pendingItem.name || "";
		}

		const detailEl = fragment.querySelector("[data-rel-detail]");
		const detailContainer = fragment.querySelector("[data-rel-detail-container]");
		const detailText = this._pendingItem.detail || this._pendingItem.bio || "";
		if (detailEl && detailText) {
			detailEl.textContent = detailText;
		} else if (detailContainer) {
			detailContainer.remove();
		}

		const newBadge = fragment.querySelector("[data-rel-new]");
		if (newBadge) {
			newBadge.textContent = this._newLabel;
		}

		const typeSelect = fragment.querySelector("[data-rel-input='type']");
		if (typeSelect && this._typeSelect) {
			typeSelect.innerHTML = this._typeSelect.innerHTML;
			typeSelect.value = this._typeSelect.value;
			typeSelect.name = `${this._prefix}_new_type`;
		}

		const uncertain = fragment.querySelector("[data-rel-input='uncertain']");
		if (uncertain && this._uncertain) {
			uncertain.checked = this._uncertain.checked;
			uncertain.name = `${this._prefix}_new_uncertain`;
			const uncertainId = `${this._prefix}_new_uncertain_row`;
			uncertain.id = uncertainId;
			const uncertainLabel = fragment.querySelector("[data-rel-uncertain-label]");
			if (uncertainLabel) {
				uncertainLabel.setAttribute("for", uncertainId);
			}
		}

		const hiddenId = fragment.querySelector("[data-rel-input='id']");
		if (hiddenId) {
			hiddenId.name = `${this._prefix}_new_id`;
			hiddenId.value = this._pendingItem.id;
		}

		const deleteButton = fragment.querySelector(ROLE_NEW_DELETE);
		if (deleteButton) {
			deleteButton.addEventListener("click", () => {
				this._addRow.innerHTML = "";
				this._pendingItem = null;
				this._clearAddPanel();
				if (this._addPanel) {
					this._addPanel.classList.add("hidden");
				}
			});
		}

		this._addRow.innerHTML = "";
		this._addRow.appendChild(fragment);
		this._pendingItem = null;
		this._clearAddPanel();
		if (this._addPanel) {
			this._addPanel.classList.add("hidden");
		}
	}

	_setupDeleteToggles() {
		this.querySelectorAll("[data-delete-toggle]").forEach((button) => {
			button.addEventListener("click", () => {
				const targetId = button.getAttribute("data-delete-toggle");
				const checkbox = this.querySelector(`#${CSS.escape(targetId)}`);
				if (!checkbox) {
					return;
				}
				checkbox.checked = !checkbox.checked;

				const row = button.closest(ROLE_REL_ROW);
				if (row) {
					row.classList.toggle("bg-red-50", checkbox.checked);
				}

				const label = button.querySelector("[data-delete-label]");
				if (label) {
					label.textContent = checkbox.checked
						? label.getAttribute("data-delete-active") || "Wird entfernt"
						: label.getAttribute("data-delete-default") || "Entfernen";
				}

				const icon = button.querySelector("i");
				if (icon) {
					if (checkbox.checked) {
						icon.classList.add("hidden");
						icon.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line");
					} else {
						icon.classList.remove("hidden");
						icon.classList.add("ri-delete-bin-line");
						icon.classList.remove("ri-arrow-go-back-line");
					}
				}
			});

			button.addEventListener("mouseenter", () => {
				const targetId = button.getAttribute("data-delete-toggle");
				const checkbox = this.querySelector(`#${CSS.escape(targetId)}`);
				if (!checkbox || !checkbox.checked) {
					return;
				}
				const label = button.querySelector("[data-delete-label]");
				if (label) {
					label.textContent = label.getAttribute("data-delete-hover") || "Rückgängig";
				}
				const icon = button.querySelector("i");
				if (icon) {
					icon.classList.remove("hidden");
					icon.classList.add("ri-arrow-go-back-line");
					icon.classList.remove("ri-delete-bin-line");
				}
			});

			button.addEventListener("mouseleave", () => {
				const targetId = button.getAttribute("data-delete-toggle");
				const checkbox = this.querySelector(`#${CSS.escape(targetId)}`);
				const label = button.querySelector("[data-delete-label]");
				if (!label) {
					return;
				}
				if (checkbox && checkbox.checked) {
					label.textContent = label.getAttribute("data-delete-active") || "Wird entfernt";
				} else {
					label.textContent = label.getAttribute("data-delete-default") || "Entfernen";
				}
				const icon = button.querySelector("i");
				if (icon) {
					if (checkbox && checkbox.checked) {
						icon.classList.add("hidden");
						icon.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line");
					} else {
						icon.classList.remove("hidden");
						icon.classList.add("ri-delete-bin-line");
						icon.classList.remove("ri-arrow-go-back-line");
					}
				}
			});
		});
	}
}
