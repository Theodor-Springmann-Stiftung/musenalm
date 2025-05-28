export class ToolTip extends HTMLElement {
	static get observedAttributes() {
		return ["position", "timeout"];
	}

	constructor() {
		super();
		this._tooltipBox = null;
		this._timeout = 200;
		this._hideTimeout = null;
		this._hiddenTimeout = null;
	}

	connectedCallback() {
		this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal");
		const dataTipElem = this.querySelector(".data-tip");
		const tipContent = dataTipElem ? dataTipElem.innerHTML : "Tooltip";

		if (dataTipElem) {
			dataTipElem.classList.add("hidden");
		}

		this._tooltipBox = document.createElement("div");
		this._tooltipBox.innerHTML = tipContent;
		this._tooltipBox.className = [
			"opacity-0",
			"hidden",
			"absolute",
			"px-2",
			"py-1",
			"text-sm",
			"text-white",
			"bg-gray-900",
			"rounded",
			"shadow",
			"z-10",
			"whitespace-nowrap",
			"transition-all",
			"duration-200",
			"font-sans",
		].join(" ");

		this.appendChild(this._tooltipBox);

		this._updatePosition();

		this.addEventListener("mouseenter", () => this._showTooltip());
		this.addEventListener("mouseleave", () => this._hideTooltip());
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "position" && this._tooltipBox) {
			this._updatePosition();
		}
		if (name === "timeout" && newValue) {
			this._timeout = parseInt(newValue) || 200;
		}
	}

	_showTooltip() {
		clearTimeout(this._hideTimeout);
		clearTimeout(this._hiddenTimeout);
		this._tooltipBox.classList.remove("hidden");
		setTimeout(() => {
			this._tooltipBox.classList.remove("opacity-0");
			this._tooltipBox.classList.add("opacity-100");
		}, 16);
	}

	_hideTooltip() {
		this._hideTimeout = setTimeout(() => {
			this._tooltipBox.classList.remove("opacity-100");
			this._tooltipBox.classList.add("opacity-0");
			this._hiddenTimeout = setTimeout(() => {
				this._tooltipBox.classList.add("hidden");
			}, this._timeout + 100);
		}, this._timeout);
	}

	_updatePosition() {
		this._tooltipBox.classList.remove(
			"bottom-full",
			"left-1/2",
			"-translate-x-1/2",
			"mb-2", // top
			"top-full",
			"mt-2", // bottom
			"right-full",
			"-translate-y-1/2",
			"mr-2",
			"top-1/2", // left
			"left-full",
			"ml-2", // right
		);

		const pos = this.getAttribute("position") || "top";

		switch (pos) {
			case "bottom":
				this._tooltipBox.classList.add(
					"top-full",
					"left-1/2",
					"transform",
					"-translate-x-1/2",
					"mt-0.5",
				);
				break;
			case "left":
				this._tooltipBox.classList.add(
					"right-full",
					"top-1/2",
					"transform",
					"-translate-y-1/2",
					"mr-0.5",
				);
				break;
			case "right":
				this._tooltipBox.classList.add(
					"left-full",
					"top-1/2",
					"transform",
					"-translate-y-1/2",
					"ml-0.5",
				);
				break;
			case "top":
			default:
				// top as default
				this._tooltipBox.classList.add(
					"bottom-full",
					"left-1/2",
					"transform",
					"-translate-x-1/2",
					"mb-0.5",
				);
		}
	}
}
