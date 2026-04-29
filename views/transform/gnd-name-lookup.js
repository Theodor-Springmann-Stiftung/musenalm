const GND_SEARCH_URL = "https://lobid.org/gnd/search";
const GND_DEBOUNCE_MS = 300;
const GND_MIN_CHARS = 3;
const GND_SIZE = 10;

export class GndNameLookup extends HTMLElement {
	constructor() {
		super();
		this._timeout = null;
		this._results = [];
		this._highlighted = -1;
		this._isOpen = false;
		this._textarea = null;
		this._dropdown = null;
		this._onDocClick = this._onDocClick.bind(this);
	}

	connectedCallback() {
		this._render();
		this._textarea = this.querySelector("textarea");
		this._dropdown = this.querySelector(".gnl-dropdown");
		this._textarea.addEventListener("input", (e) => this._onInput(e));
		this._textarea.addEventListener("keydown", (e) => this._onKeydown(e));
		document.addEventListener("click", this._onDocClick);
	}

	disconnectedCallback() {
		document.removeEventListener("click", this._onDocClick);
		if (this._timeout) clearTimeout(this._timeout);
	}

	_render() {
		const name = this.getAttribute("name") || "name";
		const value = this.getAttribute("value") || "";
		const required = this.getAttribute("data-required") === "true";
		this.innerHTML =
			`<div class="relative">` +
			`<textarea name="${this._esc(name)}" class="inputinput w-full no-enter" rows="1"` +
			(required ? " required" : "") +
			` autocomplete="off">${this._esc(value)}</textarea>` +
			`<div class="gnl-dropdown absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>` +
			`</div>`;
	}

	_esc(str) {
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	_onInput(e) {
		const query = e.target.value.trim();
		if (this._timeout) clearTimeout(this._timeout);
		if (query.length < GND_MIN_CHARS) {
			this._close();
			return;
		}
		this._timeout = setTimeout(() => this._fetch(query), GND_DEBOUNCE_MS);
	}

	_onKeydown(e) {
		if (!this._isOpen) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			this._setHighlight(Math.min(this._highlighted + 1, this._results.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			this._setHighlight(Math.max(this._highlighted - 1, 0));
		} else if (e.key === "Enter" && this._highlighted >= 0) {
			e.preventDefault();
			this._select(this._highlighted);
		} else if (e.key === "Escape") {
			e.preventDefault();
			this._close();
		}
	}

	_onDocClick(e) {
		if (!this.contains(e.target)) this._close();
	}

	async _fetch(query) {
		const params = new URLSearchParams({
			q: query,
			format: "json:preferredName,*_dateOfBirth in_placeOfBirth,†_dateOfDeath in_placeOfDeath",
			filter: "type:DifferentiatedPerson",
			size: String(GND_SIZE),
		});
		try {
			const resp = await fetch(`${GND_SEARCH_URL}?${params}`);
			if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
			const data = await resp.json();
			this._results = Array.isArray(data) ? data : [];
			this._renderResults();
		} catch (err) {
			console.warn("GND lookup failed", err);
			this._results = [];
			this._close();
		}
	}

	_parseItem(item) {
		const parts = (item.label || "").split(" | ");
		const name = parts[0] || "";
		const bioRaw = parts.slice(1).join(" | ");
		return { name, bioRaw, bio: this._formatBio(bioRaw) };
	}

	_formatBio(bioRaw) {
		if (!bioRaw) return "";
		const birth = (bioRaw.match(/\*\s*(\d{4})/) || [])[1] ?? null;
		const death = (bioRaw.match(/†\s*(\d{4})/) || [])[1] ?? null;
		if (!birth && !death) return "";
		if (birth && death) return `${birth}-${death}`;
		if (birth) return `${birth}-?`;
		return `?-${death}`;
	}

	_renderResults() {
		if (!this._results.length) {
			this._close();
			return;
		}
		this._dropdown.innerHTML = "";
		this._results.forEach((item, i) => {
			const { name, bioRaw } = this._parseItem(item);
			const btn = document.createElement("button");
			btn.type = "button";
			btn.className = "w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors";
			btn.dataset.index = String(i);
			const nameDiv = document.createElement("div");
			nameDiv.className = "text-sm font-semibold text-gray-800";
			nameDiv.textContent = name;
			btn.appendChild(nameDiv);
			if (bioRaw) {
				const bioDiv = document.createElement("div");
				bioDiv.className = "text-xs text-gray-500";
				bioDiv.textContent = bioRaw;
				btn.appendChild(bioDiv);
			}
			btn.addEventListener("mousedown", (e) => {
				e.preventDefault();
				this._select(i);
			});
			this._dropdown.appendChild(btn);
		});
		this._highlighted = -1;
		this._dropdown.classList.remove("hidden");
		this._isOpen = true;
	}

	_setHighlight(index) {
		this._dropdown.querySelectorAll("button").forEach((btn, i) => {
			btn.classList.toggle("bg-slate-100", i === index);
		});
		this._highlighted = index;
	}

	_select(index) {
		const item = this._results[index];
		if (!item) return;
		const { name, bio } = this._parseItem(item);
		this._textarea.value = name;
		const bioId = this.getAttribute("data-bio-field");
		if (bioId) {
			const el = document.getElementById(bioId);
			if (el) el.value = bio;
		}
		const uriId = this.getAttribute("data-uri-field");
		if (uriId) {
			const el = document.getElementById(uriId);
			if (el) el.value = item.id || "";
		}
		this._close();
	}

	_close() {
		if (this._dropdown) this._dropdown.classList.add("hidden");
		this._isOpen = false;
		this._highlighted = -1;
	}
}
