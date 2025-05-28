export class FilterPill extends HTMLElement {
	constructor() {
		super();
		this._value = "";
		this.render();
	}

	static get observedAttributes() {
		return ["data-text", "data-queryparam", "data-value"];
	}

	set value(value) {
		this.setAttribute("data-value", value);
	}

	get value() {
		return this.getAttribute("data-value") || "";
	}

	set text(value) {
		this.setAttribute("data-text", value);
	}

	get text() {
		return this.getAttribute("data-text") || "";
	}

	set queryparam(value) {
		this.setAttribute("data-queryparam", value);
	}

	get queryparam() {
		return this.getAttribute("data-queryparam") || "";
	}

	connectedCallback() {
		this._filter = this.text;
		this._queryparam = this.queryparam;
		this.render();
		htmx.process(this);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			if (name === "data-text") {
				this._filter = newValue;
			}
			if (name === "data-queryparam") {
				this._queryparam = newValue;
			}
			if (name === "data-value") {
				this._value = newValue;
			}
			this.render();
		}
	}

	getURL() {
		if (this._queryparam) {
			let url = new URL(window.location);
			let params = new URLSearchParams(url.search);
			params.delete(this._queryparam);
			params.delete("page");
			url.search = params.toString();
			return url.toString();
		}
		return "#";
	}

	render() {
		this.innerHTML = `
		<a href="${this.getURL()}" class="!no-underline block text-base" hx-target="#searchresults" hx-select="#searchresults" hx-indicator="body" hx-swap="outerHTML show:window:top">
			<div class="flex flex-row filter-pill rounded-lg bg-orange-100 hover:saturate-50 px-2.5">
				${this.renderIcon()}
				<div class="flex flex-row filter-pill-label-value !items-baseline text-slate-700">
					<div class="filter-pill-label font-bold mr-1.5 align-baseline">${this.text}</div>
					${this.renderValue()}
				</div>
			</div>
		</a>
		`;
	}

	renderIcon() {
		const isBool = this.value === "true" || this.value === "false";
		if (!isBool) {
			return `<div
				href="${this.getURL()}"
				class="filter-pill-close no-underline font-bold mr-1 text-orange-900 hover:text-orange-800">
				<i class="ri-arrow-left-s-line"></i>
			</div>
			`;
		}
		return `
			<div href="${this.getURL()}" class="filter-pill-close no-underline font-bold mr-1 text-orange-900 hover:text-orange-800">
				<i class="ri-close-circle-line"></i>
			</div>
		`;
	}

	renderValue() {
		const isBool = this.value === "true" || this.value === "false";
		if (isBool) return ``;
		return `
			<div class="filter-pill-value">${this.value}</div>
		`;
	}
}
