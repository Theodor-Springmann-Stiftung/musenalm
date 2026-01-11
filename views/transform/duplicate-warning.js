const DEBOUNCE_DELAY_MS = 100;

export class DuplicateWarningChecker extends HTMLElement {
	constructor() {
		super();
		this._fields = null;
		this._boundHandlers = new Map();
	}

	connectedCallback() {
		// Find all fields marked for duplicate checking
		this._fields = document.querySelectorAll("[data-duplicate-check]");

		this._fields.forEach((field) => {
			const handler = this._createHandler(field);
			this._boundHandlers.set(field, handler);
			field.addEventListener("input", handler);
		});
	}

	disconnectedCallback() {
		this._boundHandlers.forEach((handler, field) => {
			field.removeEventListener("input", handler);
		});
		this._boundHandlers.clear();
	}

	_createHandler(field) {
		let timeout = null;
		return (event) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				this._checkDuplicates(field);
			}, DEBOUNCE_DELAY_MS);
		};
	}

	async _checkDuplicates(field) {
		const value = field.value.trim();
		const endpoint = field.getAttribute("data-duplicate-endpoint");
		const resultKey = field.getAttribute("data-duplicate-result-key");
		const currentId = field.getAttribute("data-duplicate-current-id") || "";
		const warningEl = document.querySelector(`[data-duplicate-warning-for="${field.id}"]`);

		if (!warningEl || !endpoint || !resultKey) {
			return;
		}

		// Hide warning if field is empty
		if (value === "") {
			warningEl.classList.add("hidden");
			return;
		}

		// Fetch duplicates
		try {
			const url = new URL(endpoint, window.location.origin);
			url.searchParams.set("q", value);
			url.searchParams.set("limit", "100"); // Get all to filter

			const response = await fetch(url.toString());
			if (!response.ok) {
				return;
			}

			const data = await response.json();
			const results = data[resultKey] || [];

			// Filter out current item if editing
			let filtered = results;
			if (currentId) {
				filtered = results.filter((item) => item.id !== currentId);
			}

			// Filter for exact matches only (case-insensitive)
			const exactMatches = filtered.filter((item) => item.name && item.name.toLowerCase() === value.toLowerCase());

			// Show or hide warning
			if (exactMatches.length > 0) {
				const countEl = warningEl.querySelector("[data-duplicate-count]");
				if (countEl) {
					const plural = exactMatches.length === 1 ? "" : "e";
					countEl.textContent = `Der Name ist bereits vorhanden (${exactMatches.length} Treffer${plural})`;
				}
				warningEl.classList.remove("hidden");
			} else {
				warningEl.classList.add("hidden");
			}
		} catch (err) {
			// Silently fail - don't show errors to user
			console.error("Duplicate check failed:", err);
		}
	}
}
