const ROLE_ADD_TOGGLE = "[data-role='content-person-add-toggle']";
const ROLE_ADD_PANEL = "[data-role='content-person-add-panel']";
const ROLE_ADD_INPUT = "[data-role='content-person-add-input']";
const ROLE_ADD_CONFIRM = "[data-role='content-person-add-confirm']";
const ROLE_ADD_ABORT = "[data-role='content-person-add-abort']";
const ROLE_ADD_RESULTS = "[data-role='content-person-add-results']";
const ROLE_ADD_ERROR = "[data-role='content-person-add-error']";
const ROLE_EMPTY = "[data-role='content-person-empty']";
const ROLE_TABLE_BODY = "[data-role='content-person-table-body']";
const ROLE_ROW = "[data-role='content-person-row']";
const ROLE_DELETE = "[data-role='content-person-delete']";
const ROLE_DELETE_INPUT = "[data-role='content-person-delete-input']";
const ROLE_NAME = "[data-role='content-person-name']";
const ROLE_LIFE = "[data-role='content-person-life']";
const ROLE_LINK = "[data-role='content-person-link']";
const ROLE_TYPE = "[data-role='content-person-type']";
const ROLE_UNCERTAIN = "[data-role='content-person-uncertain']";
const ROLE_TEMPLATE = "template[data-role='content-person-new-row-template']";

const FETCH_DEBOUNCE_MS = 200;

export class ContentPersonRelations extends HTMLElement {
	constructor() {
		super();
		this._options = [];
		this._selectedItem = null;
		this._highlightedIndex = -1;
		this._fetchTimeout = null;
		this._fetchController = null;
		this._boundHandleDocumentClick = this._handleDocumentClick.bind(this);
	}

	connectedCallback() {
		if (this.dataset.contentPersonRelationsBound === "true") {
			return;
		}
		this.dataset.contentPersonRelationsBound = "true";

		this._prefix = this.getAttribute("data-prefix") || "";
		this._endpoint = this.getAttribute("data-endpoint") || "/admin/api/agents/search";
		this._linkBase = this.getAttribute("data-link-base") || "/person/";
		this._defaultRelation = this.getAttribute("data-default-relation") || "Autor:in";
		this._tableBody = this.querySelector(ROLE_TABLE_BODY);
		this._addToggle = this.querySelector(ROLE_ADD_TOGGLE);
		this._addPanel = this.querySelector(ROLE_ADD_PANEL);
		this._addInput = this.querySelector(ROLE_ADD_INPUT);
		this._addConfirm = this.querySelector(ROLE_ADD_CONFIRM);
		this._addAbort = this.querySelector(ROLE_ADD_ABORT);
		this._addResults = this.querySelector(ROLE_ADD_RESULTS);
		this._addError = this.querySelector(ROLE_ADD_ERROR);
		this._emptyState = this.querySelector(ROLE_EMPTY);
		this._sectionHeader = this.querySelector("[data-role='content-person-section-header']");
		this._template = this.querySelector(ROLE_TEMPLATE);

		if (!this._tableBody || !this._addPanel || !this._addInput || !this._addConfirm || !this._addAbort || !this._addResults || !this._template) {
			return;
		}

		this._addToggle?.addEventListener("click", () => this._openAddPanel());
		this._addAbort.addEventListener("click", () => this._closeAddPanel());
		this._addConfirm.addEventListener("click", () => this._confirmSelection());
		this._addInput.addEventListener("input", () => this._handleInput());
		this._addInput.addEventListener("keydown", (event) => this._handleKeyDown(event));

		this._bindRows();
		this._syncUi();
		document.addEventListener("click", this._boundHandleDocumentClick);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this._boundHandleDocumentClick);
		if (this._fetchTimeout) {
			clearTimeout(this._fetchTimeout);
		}
		if (this._fetchController) {
			this._fetchController.abort();
		}
	}

	_openAddPanel() {
		this._resetAddState({ keepInput: false });
		this._addPanel.classList.remove("hidden");
		this._addToggle?.classList.add("hidden");
		this._syncUi();
		this._addInput.focus();
	}

	_closeAddPanel() {
		this._resetAddState({ keepInput: false });
		this._addPanel.classList.add("hidden");
		this._addToggle?.classList.remove("hidden");
		this._syncUi();
	}

	_resetAddState({ keepInput }) {
		this._selectedItem = null;
		this._options = [];
		this._highlightedIndex = -1;
		if (!keepInput) {
			this._addInput.value = "";
		}
		this._renderResults();
		this._setError("");
		this._updateConfirmState();
	}

	_handleInput() {
		const query = this._addInput.value.trim();
		this._selectedItem = null;
		this._highlightedIndex = -1;
		this._updateConfirmState();
		this._setError("");

		if (this._fetchTimeout) {
			clearTimeout(this._fetchTimeout);
		}
		if (query.length === 0) {
			this._options = [];
			this._renderResults();
			return;
		}

		this._fetchTimeout = setTimeout(() => {
			this._fetchOptions(query);
		}, FETCH_DEBOUNCE_MS);
	}

	async _fetchOptions(query) {
		if (this._fetchController) {
			this._fetchController.abort();
		}

		this._fetchController = new AbortController();
		const url = new URL(this._endpoint, window.location.origin);
		url.searchParams.set("q", query);
		url.searchParams.set("limit", "15");

		try {
			const response = await fetch(url.toString(), { signal: this._fetchController.signal });
			if (!response.ok) {
				this._options = [];
				this._renderResults();
				return;
			}
			const data = await response.json();
			this._options = Array.isArray(data?.agents) ? data.agents.filter((item) => item?.id && item?.name) : [];
			this._highlightedIndex = this._options.length > 0 ? 0 : -1;
			this._renderResults();
		} catch (error) {
			if (error?.name === "AbortError") {
				return;
			}
			this._options = [];
			this._renderResults();
		}
	}

	_renderResults() {
		this._addResults.innerHTML = "";
		if (this._options.length === 0) {
			this._addResults.classList.add("hidden");
			return;
		}

		this._options.forEach((item, index) => {
			const button = document.createElement("button");
			button.type = "button";
			button.className = [
				"w-full",
				"border-b",
				"border-stone-100",
				"px-3",
				"py-2",
				"text-left",
				"transition-colors",
				index === this._highlightedIndex ? "bg-stone-100" : "bg-white hover:bg-stone-50",
			].join(" ");
			button.setAttribute("aria-selected", index === this._highlightedIndex ? "true" : "false");
			button.innerHTML = `
				<div class="min-w-0">
					<div class="truncate text-sm font-semibold text-slate-900">${this._escapeHtml(item.name || "")}</div>
					${item.bio ? `<div class="truncate text-xs text-slate-600">${this._escapeHtml(item.bio)}</div>` : ""}
				</div>
			`;
			button.addEventListener("click", () => this._selectItem(item));
			this._addResults.appendChild(button);
		});

		this._addResults.classList.remove("hidden");
	}

	_selectItem(item) {
		this._selectedItem = item;
		this._addInput.value = item.name || "";
		this._options = [];
		this._highlightedIndex = -1;
		this._renderResults();
		this._updateConfirmState();
		this._setError("");
	}

	_handleKeyDown(event) {
		if (event.key === "Escape") {
			event.preventDefault();
			this._closeAddPanel();
			return;
		}

		if (event.key === "ArrowDown") {
			if (this._options.length === 0) {
				return;
			}
			event.preventDefault();
			this._highlightedIndex = Math.min(this._highlightedIndex + 1, this._options.length - 1);
			this._renderResults();
			return;
		}

		if (event.key === "ArrowUp") {
			if (this._options.length === 0) {
				return;
			}
			event.preventDefault();
			this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0);
			this._renderResults();
			return;
		}

		if (event.key === "Enter") {
			event.preventDefault();
			if (this._options.length > 0 && this._highlightedIndex >= 0) {
				this._selectItem(this._options[this._highlightedIndex]);
				return;
			}
			if (this._selectedItem?.id) {
				this._confirmSelection();
			}
		}
	}

	_confirmSelection() {
		if (!this._selectedItem?.id) {
			this._setError("Bitte eine bestehende Person auswählen.");
			return;
		}

		this._appendNewRow(this._selectedItem);
		this._closeAddPanel();
	}

	_appendNewRow(item) {
		const fragment = this._template.content.cloneNode(true);
		const row = fragment.querySelector(ROLE_ROW) || fragment.firstElementChild;
		if (!row) {
			return;
		}

		row.dataset.kind = "new";
		const link = fragment.querySelector(ROLE_LINK);
		const linkId = item.musenalm_id || item.id;
		if (link) {
			if (linkId) {
				link.href = `${this._linkBase}${linkId}`;
			}
			link.classList.toggle("pointer-events-none", !linkId);
		}

		const nameEl = fragment.querySelector(ROLE_NAME);
		if (nameEl) {
			nameEl.textContent = item.name || "";
		}

		const lifeEl = fragment.querySelector(ROLE_LIFE);
		if (lifeEl) {
			lifeEl.textContent = item.bio || item.detail || "";
		}

		const typeSelect = fragment.querySelector(ROLE_TYPE);
		if (typeSelect) {
			typeSelect.name = `${this._prefix}_new_type`;
			typeSelect.value = this._defaultRelation;
		}

		const uncertain = fragment.querySelector(ROLE_UNCERTAIN);
		if (uncertain) {
			uncertain.name = `${this._prefix}_new_uncertain`;
			uncertain.value = item.id;
			uncertain.checked = false;
		}

		const hiddenId = fragment.querySelector("[data-role='content-person-new-id']");
		if (hiddenId) {
			hiddenId.name = `${this._prefix}_new_id`;
			hiddenId.value = item.id;
		}

		this._tableBody.appendChild(fragment);
		this._bindRows();
		this._syncUi();
	}

	_bindRows() {
		this.querySelectorAll(ROLE_ROW).forEach((row) => {
			if (row.dataset.bound === "true") {
				return;
			}
			row.dataset.bound = "true";

			const deleteButton = row.querySelector(ROLE_DELETE);
			if (deleteButton) {
				deleteButton.addEventListener("click", () => this._handleDelete(row));
			}
		});
	}

	_handleDelete(row) {
		if (row.dataset.kind === "new") {
			row.remove();
			this._syncUi();
			return;
		}

		const deleteInput = row.querySelector(ROLE_DELETE_INPUT);
		if (!deleteInput) {
			return;
		}

		deleteInput.checked = !deleteInput.checked;
		const isDeleted = deleteInput.checked;
		row.classList.toggle("bg-red-50", isDeleted);
		row.classList.toggle("opacity-70", isDeleted);
		row.querySelectorAll(`${ROLE_TYPE}, ${ROLE_UNCERTAIN}`).forEach((field) => {
			field.disabled = isDeleted;
		});
	}

	_syncUi() {
		const rowCount = this.querySelectorAll(ROLE_ROW).length;
		this._emptyState?.classList.toggle("hidden", rowCount > 0);
		this._sectionHeader?.classList.toggle("hidden", rowCount === 0);
	}

	_updateConfirmState() {
		this._addConfirm.disabled = !this._selectedItem?.id;
		this._addConfirm.classList.toggle("opacity-50", !this._selectedItem?.id);
		this._addConfirm.classList.toggle("cursor-not-allowed", !this._selectedItem?.id);
	}

	_setError(message) {
		if (!this._addError) {
			return;
		}
		this._addError.textContent = message;
		this._addError.classList.toggle("hidden", !message);
	}

	_handleDocumentClick(event) {
		if (!this.contains(event.target)) {
			this._options = [];
			this._highlightedIndex = -1;
			this._renderResults();
		}
	}

	_escapeHtml(value) {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");
	}
}
