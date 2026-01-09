export class TabList extends HTMLElement {
	static get observedAttributes() {}

	constructor() {
		super();
		this._showall = false;
		this.shown = -1;
		this._headings = [];
		this._contents = [];
		this._checkbox = null;
		this._disabled = new Set();
		this._defaultIndex = null;
	}

	connectedCallback() {
		this._headings = Array.from(this.querySelectorAll(".tab-list-head"));
		this._contents = Array.from(this.querySelectorAll(".tab-list-panel"));
		this._readConfig();
		this.hookupEvtHandlers();
		this._applyDisabled();
		this.hideDependent();

		if (this._headings.length === 1) {
			this.expand(0);
			return;
		}

		if (this._defaultIndex !== null) {
			this._expandFirstAvailable(this._defaultIndex);
		}
	}

	expand(index) {
		if (index < 0 || index >= this._headings.length) {
			return;
		}
		if (this._disabled.has(index)) {
			return;
		}

		this.shown = index;

		this._contents.forEach((content, i) => {
			if (i === index) {
				content.classList.remove("hidden");
				this._headings[i].setAttribute("aria-pressed", "true");
			} else {
				content.classList.add("hidden");
				this._headings[i].setAttribute("aria-pressed", "false");
			}
		});
	}

	hookupShowAll(checkbox) {
		if (checkbox) {
			this._checkbox = checkbox;
			checkbox.addEventListener("change", (event) => {
				if (event.target.checked) {
					this.showAll();
				} else {
					this.default();
				}
			});
		}
	}

	hookupEvtHandlers() {
		for (let heading of this._headings) {
			heading.addEventListener("click", this.handleTabClick.bind(this));
			heading.classList.add("cursor-pointer");
			heading.classList.add("select-none");
			heading.setAttribute("role", "button");
			heading.setAttribute("aria-pressed", "false");
			heading.setAttribute("tabindex", "0");
		}

		for (let content of this._contents) {
			content.classList.add("hidden");
		}
	}

	_readConfig() {
		const disabledRaw = (this.getAttribute("data-disabled-indices") || "").trim();
		const defaultRaw = (this.getAttribute("data-default-index") || "").trim();

		this._disabled.clear();
		if (disabledRaw) {
			disabledRaw
				.split(",")
				.map((value) => parseInt(value.trim(), 10))
				.filter((value) => Number.isFinite(value))
				.forEach((value) => this._disabled.add(value));
		}

		if (defaultRaw !== "") {
			const parsed = parseInt(defaultRaw, 10);
			this._defaultIndex = Number.isFinite(parsed) ? parsed : null;
		} else {
			this._defaultIndex = null;
		}
	}

	_applyDisabled() {
		this._headings.forEach((heading, index) => {
			if (this._disabled.has(index)) {
				heading.classList.add("pointer-events-none", "opacity-60");
			} else {
				heading.classList.remove("pointer-events-none", "opacity-60");
			}
		});
	}

	_expandFirstAvailable(preferredIndex) {
		if (this._headings.length === 0) {
			return;
		}
		if (!this._disabled.has(preferredIndex)) {
			this.expand(preferredIndex);
			return;
		}
		for (let i = 0; i < this._headings.length; i += 1) {
			if (!this._disabled.has(i)) {
				this.expand(i);
				return;
			}
		}
	}

	restore() {
		for (let heading of this._headings) {
			heading.classList.add("cursor-pointer");
			heading.classList.add("select-none");
			heading.setAttribute("role", "button");
			heading.setAttribute("aria-pressed", "false");
			heading.setAttribute("tabindex", "0");
			heading.classList.remove("pointer-events-none");
			heading.classList.remove("!text-slate-900");
		}

		for (let content of this._contents) {
			content.classList.add("hidden");
		}
	}

	disable() {
		for (let heading of this._headings) {
			heading.classList.remove("cursor-pointer");
			heading.classList.remove("select-none");
			heading.removeAttribute("role");
			heading.removeAttribute("aria-pressed");
			heading.removeAttribute("tabindex");
			heading.classList.add("pointer-events-none");
			heading.classList.add("!text-slate-900");
		}
	}

	showAll() {
		this._showall = true;
		this.shown = -1;
		this.disable();
		this._contents.forEach((content, i) => {
			content.classList.remove("hidden");
			let heading = this._headings[i];
			let showopened = heading.querySelectorAll(".show-opened");
			for (let e of showopened) {
				e.classList.add("hidden");
			}
			let showclosed = heading.querySelectorAll(".show-closed");
			for (let e of showclosed) {
				e.classList.add("hidden");
			}
		});
	}

	default() {
		this._showall = false;
		this.restore();
		this.hideDependent();
	}

	hideDependent() {
		if (this.shown < 0) {
			for (const el of this._headings) {
				this._hideAllDep(el, false);
			}
		} else {
			this._headings.forEach((el, i) => {
				this._hideAllDep(el, i === this.shown);
			});
		}
	}

	_hideAllDep(element, opened) {
		const el = element.querySelectorAll(".show-closed");
		for (let e of el) {
			if (opened) {
				e.classList.add("hidden");
			} else {
				e.classList.remove("hidden");
			}
		}
		const oel = Array.from(element.querySelectorAll(".show-opened"));
		for (let e of oel) {
			if (opened) {
				e.classList.remove("hidden");
			} else {
				e.classList.add("hidden");
			}
		}
	}

	handleTabClick(event) {
		if (!event.target) {
			console.warn("Invalid event target");
			return;
		}

		const parent = this.findParentWithClass(event.target, "tab-list-head");
		if (!parent) {
			console.warn("No parent found with class 'tab-list-head'");
			return;
		}

		const index = this._headings.indexOf(parent);
		if (index === this.shown) {
			this._contents[index].classList.toggle("hidden");
			this._headings[index].setAttribute("aria-pressed", "false");
			this.shown = -1;
		} else {
			this.expand(index);
		}

		this.hideDependent();
	}

	findParentWithClass(element, className) {
		while (element) {
			if (element.classList && element.classList.contains(className)) {
				return element;
			}
			element = element.parentElement;
		}
		return null;
	}
}
