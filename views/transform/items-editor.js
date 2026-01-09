const ROW_CLASS = "items-row";
const LIST_CLASS = "items-list";
const TEMPLATE_CLASS = "items-template";
const ADD_BUTTON_CLASS = "items-add-button";
const CANCEL_BUTTON_CLASS = "items-cancel-button";
const REMOVE_BUTTON_CLASS = "items-remove-button";
const EDIT_BUTTON_CLASS = "items-edit-button";
const CLOSE_BUTTON_CLASS = "items-close-button";
const SUMMARY_CLASS = "items-summary";
const EDIT_PANEL_CLASS = "items-edit-panel";
const REMOVED_INPUT_NAME = "items_removed[]";
const REMOVED_ROW_STATE = "data-items-removed";

export class ItemsEditor extends HTMLElement {
	constructor() {
		super();
		this._list = null;
		this._template = null;
		this._addButton = null;
		this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`;
		this._handleAdd = this._onAddClick.bind(this);
	}

	connectedCallback() {
		this._list = this.querySelector(`.${LIST_CLASS}`);
		this._template = this.querySelector(`template.${TEMPLATE_CLASS}`);
		this._addButton = this.querySelector(`.${ADD_BUTTON_CLASS}`);

		if (!this._list || !this._template || !this._addButton) {
			console.error("ItemsEditor: Missing list, template, or add button.");
			return;
		}

		this._addButton.addEventListener("click", this._handleAdd);
		this._captureAllOriginals();
		this._wireCancelButtons();
		this._wireRemoveButtons();
		this._wireEditButtons();
		this._refreshRowIds();
		this._syncAllSummaries();
	}

	disconnectedCallback() {
		if (this._addButton) {
			this._addButton.removeEventListener("click", this._handleAdd);
		}
	}

	_onAddClick(event) {
		event.preventDefault();
		this.addItem();
	}

	addItem() {
		const fragment = this._template.content.cloneNode(true);
		const newRow = fragment.querySelector(`.${ROW_CLASS}`);

		if (!newRow) {
			console.error("ItemsEditor: Template is missing a row element.");
			return;
		}

		this._list.appendChild(fragment);

		this._captureOriginalValues(newRow);
		this._wireCancelButtons(newRow);
		this._wireRemoveButtons(newRow);
		this._wireEditButtons(newRow);
		this._assignRowFieldIds(newRow, this._rowIndex(newRow));
		this._wireSummarySync(newRow);
		this._syncSummary(newRow);
		this._setRowMode(newRow, "edit");
	}

	removeItem(button) {
		const row = button.closest(`.${ROW_CLASS}`);
		if (!row) {
			return;
		}
		const isRemoved = row.getAttribute(REMOVED_ROW_STATE) === "true";
		this._setRowRemoved(row, !isRemoved);
	}

	_wireRemoveButtons(root = this) {
		root.querySelectorAll(`.${REMOVE_BUTTON_CLASS}`).forEach((btn) => {
			if (btn.dataset.itemsBound === "true") {
				return;
			}
			btn.dataset.itemsBound = "true";
			btn.addEventListener("click", (event) => {
				event.preventDefault();
				this.removeItem(btn);
			});
			btn.addEventListener("mouseenter", () => {
				const row = btn.closest(`.${ROW_CLASS}`);
				if (!row || row.getAttribute(REMOVED_ROW_STATE) !== "true") {
					return;
				}
				const label = btn.querySelector("[data-delete-label]");
				if (label) {
					label.textContent = label.getAttribute("data-delete-hover") || "Rückgängig";
				}
				const icon = btn.querySelector("i");
				if (icon) {
					icon.classList.remove("hidden");
					icon.classList.add("ri-arrow-go-back-line");
					icon.classList.remove("ri-delete-bin-line");
				}
			});
			btn.addEventListener("mouseleave", () => {
				const row = btn.closest(`.${ROW_CLASS}`);
				const label = btn.querySelector("[data-delete-label]");
				if (!label) {
					return;
				}
				if (row && row.getAttribute(REMOVED_ROW_STATE) === "true") {
					label.textContent = label.getAttribute("data-delete-active") || "Wird entfernt";
				} else {
					label.textContent = label.getAttribute("data-delete-default") || "Entfernen";
				}
				const icon = btn.querySelector("i");
				if (icon) {
					if (row && row.getAttribute(REMOVED_ROW_STATE) === "true") {
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

	_wireCancelButtons(root = this) {
		root.querySelectorAll(`.${CANCEL_BUTTON_CLASS}`).forEach((btn) => {
			if (btn.dataset.itemsBound === "true") {
				return;
			}
			btn.dataset.itemsBound = "true";
			btn.addEventListener("click", (event) => {
				event.preventDefault();
				const row = btn.closest(`.${ROW_CLASS}`);
				if (row) {
					this._cancelEdit(row);
				}
			});
		});
	}

	_wireEditButtons(root = this) {
		root.querySelectorAll(`.${EDIT_BUTTON_CLASS}`).forEach((btn) => {
			if (btn.dataset.itemsBound === "true") {
				return;
			}
			btn.dataset.itemsBound = "true";
			btn.addEventListener("click", (event) => {
				event.preventDefault();
				const row = btn.closest(`.${ROW_CLASS}`);
				if (row) {
					this._setRowMode(row, "edit");
				}
			});
		});

		root.querySelectorAll(`.${CLOSE_BUTTON_CLASS}`).forEach((btn) => {
			if (btn.dataset.itemsBound === "true") {
				return;
			}
			btn.dataset.itemsBound = "true";
			btn.addEventListener("click", (event) => {
				event.preventDefault();
				const row = btn.closest(`.${ROW_CLASS}`);
				if (row) {
					this._setRowMode(row, "summary");
				}
			});
		});
	}

	_cancelEdit(row) {
		const idInput = row.querySelector('input[name="items_id[]"]');
		const itemId = idInput ? idInput.value.trim() : "";
		if (!itemId) {
			row.remove();
			this._refreshRowIds();
			return;
		}

		this._resetToOriginal(row);
		this._setRowMode(row, "summary");
	}

	_setRowRemoved(row, removed) {
		row.setAttribute(REMOVED_ROW_STATE, removed ? "true" : "false");
		row.classList.toggle("bg-red-50", removed);

		const editButton = row.querySelector(".items-edit-button");
		if (editButton) {
			if (removed) {
				editButton.classList.add("hidden");
			} else {
				editButton.classList.remove("hidden");
			}
		}

		row.querySelectorAll("[data-delete-label]").forEach((label) => {
			const button = label.closest(`.${REMOVE_BUTTON_CLASS}`);
			const isHovered = button && button.matches(":hover");

			let nextLabel;
			if (removed && isHovered) {
				nextLabel = label.getAttribute("data-delete-hover") || "Rückgängig";
			} else if (removed) {
				nextLabel = label.getAttribute("data-delete-active") || "Wird entfernt";
			} else {
				nextLabel = label.getAttribute("data-delete-default") || "Entfernen";
			}
			label.textContent = nextLabel;
		});
		row.querySelectorAll(`.${REMOVE_BUTTON_CLASS} i`).forEach((icon) => {
			const button = icon.closest(`.${REMOVE_BUTTON_CLASS}`);
			const isHovered = button && button.matches(":hover");

			if (removed) {
				if (isHovered) {
					icon.classList.remove("hidden");
					icon.classList.add("ri-arrow-go-back-line");
					icon.classList.remove("ri-delete-bin-line");
				} else {
					icon.classList.add("hidden");
					icon.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line");
				}
			} else {
				icon.classList.remove("hidden");
				icon.classList.add("ri-delete-bin-line");
				icon.classList.remove("ri-arrow-go-back-line");
			}
		});

		const idInput = row.querySelector('input[name="items_id[]"]');
		const itemId = idInput ? idInput.value.trim() : "";
		if (itemId) {
			if (removed) {
				this._ensureRemovalInput(itemId);
			} else {
				this._removeRemovalInput(itemId);
			}
		}

		row.querySelectorAll("[data-field]").forEach((field) => {
			field.disabled = removed;
		});
	}

	_setRowMode(row, mode) {
		const summary = row.querySelector(`.${SUMMARY_CLASS}`);
		const editor = row.querySelector(`.${EDIT_PANEL_CLASS}`);
		if (!summary || !editor) {
			return;
		}

		if (mode === "edit") {
			summary.classList.add("hidden");
			editor.classList.remove("hidden");
		} else {
			summary.classList.remove("hidden");
			editor.classList.add("hidden");
			this._syncSummary(row);
		}
	}

	_captureAllOriginals() {
		this.querySelectorAll(`.${ROW_CLASS}`).forEach((row) => {
			this._captureOriginalValues(row);
		});
	}

	_captureOriginalValues(row) {
		row.querySelectorAll("[data-field]").forEach((field) => {
			if (field.dataset.originalValue !== undefined) {
				return;
			}
			field.dataset.originalValue = field.value ?? "";
		});
	}

	_resetToOriginal(row) {
		row.querySelectorAll("[data-field]").forEach((field) => {
			if (field.dataset.originalValue === undefined) {
				return;
			}
			field.value = field.dataset.originalValue;
		});
		this._syncSummary(row);
	}

	_refreshRowIds() {
		const rows = Array.from(this.querySelectorAll(`.${ROW_CLASS}`));
		rows.forEach((row, index) => {
			this._assignRowFieldIds(row, index);
		});
	}

	_rowIndex(row) {
		const rows = Array.from(this.querySelectorAll(`.${ROW_CLASS}`));
		return rows.indexOf(row);
	}

	_assignRowFieldIds(row, index) {
		if (index < 0) {
			return;
		}

		row.querySelectorAll("[data-field-label]").forEach((label) => {
			const fieldName = label.getAttribute("data-field-label");
			if (!fieldName) {
				return;
			}
			const field = row.querySelector(`[data-field="${fieldName}"]`);
			if (!field) {
				return;
			}

			const fieldId = `${this._idPrefix}-${index}-${fieldName}`;
			field.id = fieldId;
			label.setAttribute("for", fieldId);
		});
	}

	_syncAllSummaries() {
		this.querySelectorAll(`.${ROW_CLASS}`).forEach((row) => {
			this._wireSummarySync(row);
			this._syncSummary(row);
			this._syncNewBadge(row);
		});
	}

	_wireSummarySync(row) {
		if (row.dataset.summaryBound === "true") {
			return;
		}

		row.dataset.summaryBound = "true";
		row.querySelectorAll("[data-field]").forEach((field) => {
			field.addEventListener("input", () => this._syncSummary(row));
			field.addEventListener("change", () => this._syncSummary(row));
		});
	}

	_syncSummary(row) {
		row.querySelectorAll("[data-summary-field]").forEach((summaryField) => {
			const fieldName = summaryField.getAttribute("data-summary-field");
			if (!fieldName) {
				return;
			}

			const formField = row.querySelector(`[data-field="${fieldName}"]`);
			if (!formField) {
				return;
			}

			const value = this._readFieldValue(formField);
			const container =
				summaryField.getAttribute("data-summary-hide-empty") === "true"
					? summaryField.closest("[data-summary-container]")
					: null;

			if (value) {
				this._setSummaryContent(summaryField, value);
				summaryField.classList.remove("text-gray-400");
				if (container) {
					container.classList.remove("hidden");
				}
			} else {
				this._setSummaryContent(summaryField, "—");
				summaryField.classList.add("text-gray-400");
				if (container) {
					container.classList.add("hidden");
				}
			}
		});
		this._syncNewBadge(row);
	}

	_syncNewBadge(row) {
		const idInput = row.querySelector('input[name="items_id[]"]');
		const itemId = idInput ? idInput.value.trim() : "";
		row.querySelectorAll("[data-new-badge]").forEach((badge) => {
			badge.classList.toggle("hidden", itemId !== "");
		});
	}

	_setSummaryContent(summaryField, value) {
		const link = summaryField.querySelector("[data-summary-link]");
		if (link) {
			if (value && value !== "—") {
				link.setAttribute("href", value);
				link.textContent = value;
			} else {
				link.setAttribute("href", "#");
				link.textContent = "—";
			}
		} else {
			summaryField.textContent = value || "—";
		}
	}

	_readFieldValue(field) {
		if (field instanceof HTMLSelectElement) {
			if (field.multiple) {
				return Array.from(field.selectedOptions)
					.map((opt) => opt.textContent.trim())
					.filter(Boolean)
					.join(", ");
			}
			const selected = field.selectedOptions[0];
			return selected ? selected.textContent.trim() : "";
		}

		if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
			return field.value.trim();
		}

		return "";
	}

	_ensureRemovalInput(itemId) {
		const existing = Array.from(this.querySelectorAll(`input[name="${REMOVED_INPUT_NAME}"]`)).some(
			(input) => input.value === itemId,
		);

		if (existing) {
			return;
		}

		const hidden = document.createElement("input");
		hidden.type = "hidden";
		hidden.name = REMOVED_INPUT_NAME;
		hidden.value = itemId;
		this.appendChild(hidden);
	}

	_removeRemovalInput(itemId) {
		const inputs = Array.from(this.querySelectorAll(`input[name="${REMOVED_INPUT_NAME}"]`));
		for (const input of inputs) {
			if (input.value === itemId) {
				input.remove();
			}
		}
	}
}
