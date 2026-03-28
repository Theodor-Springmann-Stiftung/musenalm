export class ToolTip extends HTMLElement {
	static get observedAttributes() {
		return ["position", "timeout"];
	}

	static _dragGuardInitialized = false;

	static _setDragging(active) {
		window.__toolTipDragging = active;
		if (document.documentElement) {
			document.documentElement.classList.toggle("dragging", active);
		}
		if (document.body) {
			if (active) {
				document.body.dataset.dragging = "true";
			} else {
				delete document.body.dataset.dragging;
			}
		}
		if (active) {
			document.querySelectorAll(".tooltip-box").forEach((box) => {
				box.classList.remove("opacity-100");
				box.classList.add("opacity-0");
				box.classList.add("hidden");
			});
		}
	}

	static _ensureDragGuard() {
		if (ToolTip._dragGuardInitialized) {
			return;
		}
		ToolTip._dragGuardInitialized = true;
		const start = (event) => {
			const handle = event.target?.closest?.("[data-role='content-drag-handle']");
			if (handle || event.type === "dragstart") {
				ToolTip._setDragging(true);
			}
		};
		const end = () => {
			ToolTip._setDragging(false);
		};
		document.addEventListener("pointerdown", start, true);
		document.addEventListener("mousedown", start, true);
		document.addEventListener("dragstart", start, true);
		document.addEventListener("pointerup", end, true);
		document.addEventListener("mouseup", end, true);
		document.addEventListener("pointercancel", end, true);
		document.addEventListener("dragend", end, true);
		document.addEventListener("drop", end, true);
		window.addEventListener("blur", end);
		window.addEventListener("contentsdragging", (event) => {
			const active = Boolean(event.detail?.active);
			ToolTip._setDragging(active);
		});
	}

	constructor() {
		super();
		this._tooltipBox = null;
		this._timeout = 200;
		this._showDelay = 500;
		this._hideTimeout = null;
		this._hiddenTimeout = null;
		this._showTimeout = null;
		this._dataTipElem = null;
		this._observer = null;
	}

	connectedCallback() {
		ToolTip._ensureDragGuard();
		this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal");
		this._dataTipElem = this.querySelector(".data-tip");
		const tipContent = this._dataTipElem ? this._dataTipElem.innerHTML : "Tooltip";

		if (this._dataTipElem) {
			this._dataTipElem.classList.add("hidden");
		}

		this._tooltipBox = document.createElement("div");
		this._tooltipBox.innerHTML = tipContent;
		this._tooltipBox.className = [
			"tooltip-box",
			"opacity-0",
			"hidden",
			"fixed",
			"px-2",
			"py-1",
			"text-sm",
			"text-white",
			"bg-gray-900",
			"rounded",
			"shadow",
			"z-50",
			"whitespace-nowrap",
			"transition-opacity",
			"duration-100",
			"ease-out",
			"font-sans",
		].join(" ");

		this.appendChild(this._tooltipBox);

		this._updatePosition();

		this.addEventListener("mouseenter", () => this._showTooltip());
		this.addEventListener("mouseleave", () => this._hideTooltip());
		this.addEventListener("pointerdown", () => this._forceHide());
		this.addEventListener("mousedown", () => this._forceHide());
		this.addEventListener("click", () => this._forceHide());
		this.addEventListener("keydown", (event) => {
			if (event.key === "Enter" || event.key === " ") {
				this._forceHide();
			}
		});

		if (this._dataTipElem) {
			this._observer = new MutationObserver(() => {
				if (this._tooltipBox) {
					this._tooltipBox.innerHTML = this._dataTipElem.innerHTML;
				}
			});
			this._observer.observe(this._dataTipElem, {
				childList: true,
				characterData: true,
				subtree: true,
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "position" && this._tooltipBox) {
			this._updatePosition();
		}
		if (name === "timeout" && newValue) {
			this._timeout = parseInt(newValue) || 200;
		}
	}

	disconnectedCallback() {
		if (this._observer) {
			this._observer.disconnect();
		}
	}

	_forceHide() {
		clearTimeout(this._showTimeout);
		clearTimeout(this._hideTimeout);
		clearTimeout(this._hiddenTimeout);
		if (!this._tooltipBox) {
			return;
		}
		this._tooltipBox.classList.remove("opacity-100");
		this._tooltipBox.classList.add("opacity-0");
		this._tooltipBox.classList.add("hidden");
	}

	_isDragging() {
		if (window.__toolTipDragging) {
			return true;
		}
		if (document.body?.dataset?.dragging === "true") {
			return true;
		}
		return Boolean(document.querySelector("[data-dragging='true']"));
	}

	_showTooltip() {
		if (this._isDragging()) {
			this._forceHide();
			return;
		}
		clearTimeout(this._showTimeout);
		clearTimeout(this._hideTimeout);
		clearTimeout(this._hiddenTimeout);
		this._showTimeout = setTimeout(() => {
			this._tooltipBox.classList.remove("hidden");
			this._updatePosition();
			setTimeout(() => {
				this._tooltipBox.classList.remove("opacity-0");
				this._tooltipBox.classList.add("opacity-100");
			}, 16);
		}, this._showDelay);
	}

	_hideTooltip() {
		clearTimeout(this._showTimeout);
		this._hideTimeout = setTimeout(() => {
			this._tooltipBox.classList.remove("opacity-100");
			this._tooltipBox.classList.add("opacity-0");
			this._hiddenTimeout = setTimeout(() => {
				this._tooltipBox.classList.add("hidden");
			}, this._timeout + 100);
		}, this._timeout);
	}

	_updatePosition() {
		const anchorRect = this.getBoundingClientRect();
		const tipRect = this._tooltipBox.getBoundingClientRect();
		const gap = 6;

		let top = 0;
		let left = 0;
		const pos = this.getAttribute("position") || "top";

		switch (pos) {
			case "bottom":
				top = anchorRect.bottom + gap;
				left = anchorRect.left + (anchorRect.width - tipRect.width) / 2;
				break;
			case "left":
				top = anchorRect.top + (anchorRect.height - tipRect.height) / 2;
				left = anchorRect.left - tipRect.width - gap;
				break;
			case "right":
				top = anchorRect.top + (anchorRect.height - tipRect.height) / 2;
				left = anchorRect.right + gap;
				break;
			case "top":
			default:
				top = anchorRect.top - tipRect.height - gap;
				left = anchorRect.left + (anchorRect.width - tipRect.width) / 2;
		}

		const padding = 4;
		const maxLeft = window.innerWidth - tipRect.width - padding;
		const maxTop = window.innerHeight - tipRect.height - padding;
		left = Math.max(padding, Math.min(left, maxLeft));
		top = Math.max(padding, Math.min(top, maxTop));

		this._tooltipBox.style.left = `${left}px`;
		this._tooltipBox.style.top = `${top}px`;
	}
}
