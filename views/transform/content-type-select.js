export class ContentTypeSelect extends HTMLElement {
	constructor() {
		super();
		this.handleDocumentClick = this.handleDocumentClick.bind(this);
		this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this);
		this.handleTriggerClick = this.handleTriggerClick.bind(this);
		this.handleOptionChange = this.handleOptionChange.bind(this);
		this._bound = false;
	}

	static get observedAttributes() {
		return ["data-options", "data-selected", "data-placeholder", "name"];
	}

	connectedCallback() {
		this.render();
		this.bindEvents();
		this.syncSummary();
		this.close();
	}

	disconnectedCallback() {
		this.unbindEvents();
		document.removeEventListener("click", this.handleDocumentClick, true);
		document.removeEventListener("keydown", this.handleDocumentKeydown);
	}

	attributeChangedCallback() {
		if (!this.isConnected) {
			return;
		}
		this.render();
		this.bindEvents();
		this.syncSummary();
		this.close();
	}

	parseJsonAttribute(name) {
		const raw = this.getAttribute(name) || "[]";
		try {
			const parsed = JSON.parse(raw);
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}

	get options() {
		return this.parseJsonAttribute("data-options").map((value) => String(value));
	}

	get selected() {
		return new Set(this.parseJsonAttribute("data-selected").map((value) => String(value)));
	}

	get placeholder() {
		return this.getAttribute("data-placeholder") || "Auswählen";
	}

	render() {
		const options = this.options;
		const selected = this.selected;
		const name = this.getAttribute("name") || "content_type[]";

		this.innerHTML = `
			<div class="relative" data-role="content-type-select-root">
				<button
					type="button"
					class="content-editor-meta-trigger"
					data-role="content-type-select-trigger"
					aria-haspopup="true"
					aria-expanded="false">
					<span class="min-w-0 truncate" data-role="content-type-select-summary">${this.placeholder}</span>
					<i class="ri-arrow-down-s-line shrink-0 text-base transition-transform" data-role="content-type-select-icon"></i>
				</button>
				<div class="content-editor-meta-dropdown hidden" data-role="content-type-select-menu">
					<div class="max-h-64 overflow-y-auto py-1">
						${options.map((option) => `
							<label class="content-editor-meta-option">
								<input
									type="checkbox"
									name="${name}"
									value="${this.escapeAttribute(option)}"
									${selected.has(option) ? "checked" : ""} />
								<span class="truncate">${this.escapeHtml(option)}</span>
							</label>
						`).join("")}
					</div>
				</div>
			</div>
		`;
	}

	bindEvents() {
		this.unbindEvents();
		this.trigger = this.querySelector("[data-role='content-type-select-trigger']");
		this.menu = this.querySelector("[data-role='content-type-select-menu']");
		this.summary = this.querySelector("[data-role='content-type-select-summary']");
		this.icon = this.querySelector("[data-role='content-type-select-icon']");
		this.checkboxes = Array.from(this.querySelectorAll("input[type='checkbox']"));

		this.trigger?.addEventListener("click", this.handleTriggerClick);
		this.checkboxes.forEach((checkbox) => {
			checkbox.addEventListener("change", this.handleOptionChange);
		});
		document.addEventListener("click", this.handleDocumentClick, true);
		document.addEventListener("keydown", this.handleDocumentKeydown);
		this._bound = true;
	}

	unbindEvents() {
		if (!this._bound) {
			return;
		}
		this.trigger?.removeEventListener("click", this.handleTriggerClick);
		this.checkboxes?.forEach((checkbox) => {
			checkbox.removeEventListener("change", this.handleOptionChange);
		});
		document.removeEventListener("click", this.handleDocumentClick, true);
		document.removeEventListener("keydown", this.handleDocumentKeydown);
		this._bound = false;
	}

	handleTriggerClick(event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.isOpen()) {
			this.close();
			return;
		}
		this.open();
	}

	handleOptionChange() {
		this.syncSummary();
	}

	handleDocumentClick(event) {
		if (!this.contains(event.target)) {
			this.close();
		}
	}

	handleDocumentKeydown(event) {
		if (event.key === "Escape") {
			this.close();
		}
	}

	isOpen() {
		return this.dataset.open === "true";
	}

	open() {
		this.dataset.open = "true";
		this.trigger?.setAttribute("data-open", "true");
		this.trigger?.setAttribute("aria-expanded", "true");
		this.menu?.classList.remove("hidden");
		this.icon?.classList.add("rotate-180");
	}

	close() {
		this.dataset.open = "false";
		this.trigger?.setAttribute("data-open", "false");
		this.trigger?.setAttribute("aria-expanded", "false");
		this.menu?.classList.add("hidden");
		this.icon?.classList.remove("rotate-180");
	}

	syncSummary() {
		if (!this.summary) {
			return;
		}
		const values = this.checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
		this.summary.textContent = values.length ? values.join(", ") : this.placeholder;
	}

	escapeHtml(value) {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#39;");
	}

	escapeAttribute(value) {
		return this.escapeHtml(value);
	}
}
