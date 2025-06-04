// INFO: We import this so vite processes the stylesheet
import "./site.css";

import { FilterPill } from "./filter-pill.js";
import { FilterList } from "./filter-list.js";
import { ScrollButton } from "./scroll-button.js";
import { ToolTip } from "./tool-tip.js";
import { PopupImage } from "./popup-image.js";
import { TabList } from "./tab-list.js";
import { AbbreviationTooltips } from "./abbrev-tooltips.js";
import { IntLink } from "./int-link.js";
import { ImageReel } from "./image-reel.js";
import { MultiSelectRole } from "./multi-select-role.js";
import { MultiSelectSimple } from "./multi-select-simple.js";
import { ResetButton } from "./reset-button.js";
import { DivManager } from "./div-menu.js";

const FILTER_LIST_ELEMENT = "filter-list";
const SCROLL_BUTTON_ELEMENT = "scroll-button";
const TOOLTIP_ELEMENT = "tool-tip";
const ABBREV_TOOLTIPS_ELEMENT = "abbrev-tooltips";
const INT_LINK_ELEMENT = "int-link";
const POPUP_IMAGE_ELEMENT = "popup-image";
const TABLIST_ELEMENT = "tab-list";
const FILTER_PILL_ELEMENT = "filter-pill";
const IMAGE_REEL_ELEMENT = "image-reel";
const MULTI_SELECT_ROLE_ELEMENT = "multi-select-places";
const MULTI_SELECT_SIMPLE_ELEMENT = "multi-select-simple";
const RESET_BUTTON_ELEMENT = "reset-button";
const DIV_MANAGER_ELEMENT = "div-manager";

customElements.define(INT_LINK_ELEMENT, IntLink);
customElements.define(ABBREV_TOOLTIPS_ELEMENT, AbbreviationTooltips);
customElements.define(FILTER_LIST_ELEMENT, FilterList);
customElements.define(SCROLL_BUTTON_ELEMENT, ScrollButton);
customElements.define(TOOLTIP_ELEMENT, ToolTip);
customElements.define(POPUP_IMAGE_ELEMENT, PopupImage);
customElements.define(TABLIST_ELEMENT, TabList);
customElements.define(FILTER_PILL_ELEMENT, FilterPill);
customElements.define(IMAGE_REEL_ELEMENT, ImageReel);
customElements.define(MULTI_SELECT_ROLE_ELEMENT, MultiSelectRole);
customElements.define(MULTI_SELECT_SIMPLE_ELEMENT, MultiSelectSimple);
customElements.define(RESET_BUTTON_ELEMENT, ResetButton);
customElements.define(DIV_MANAGER_ELEMENT, DivManager);

function PathPlusQuery() {
	const path = window.location.pathname;
	const query = window.location.search;
	const fullPath = path + query;
	return encodeURIComponent(fullPath);
}

/**
 * @param {number} timeout - Maximum time to wait in milliseconds.
 * @param {number} interval - How often to check in milliseconds.
 * @returns {Promise<Function>} Resolves with the QRCode constructor when available.
 */
function getQRCodeWhenAvailable(timeout = 5000, interval = 100) {
	return new Promise((resolve, reject) => {
		let elapsedTime = 0;
		const checkInterval = setInterval(() => {
			if (typeof window.QRCode === "function") {
				clearInterval(checkInterval);
				resolve(window.QRCode); // Resolve with the QRCode object/function
			} else {
				elapsedTime += interval;
				if (elapsedTime >= timeout) {
					clearInterval(checkInterval);
					console.error("Timed out waiting for QRCode to become available.");
					reject(new Error("QRCode not available after " + timeout + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."));
				}
			}
		}, interval);
	});
}

// INFO: We have to wait for the QRCode object to be available. It's messy.
async function GenQRCode(value) {
	const QRCode = await getQRCodeWhenAvailable();
	const qrElement = document.getElementById("qr");
	if (qrElement) {
		// INFO: Clear previous QR code if any
		// Also hide it initially to prevent flickering
		qrElement.innerHTML = "";
		qrElement.classList.add("hidden");
		new QRCode(qrElement, {
			text: value,
			width: 1280,
			height: 1280,
			colorDark: "#000000",
			colorLight: "#ffffff",
			correctLevel: QRCode.CorrectLevel.H,
		});
		setTimeout(() => {
			qrElement.classList.remove("hidden");
		}, 20);
	}

	// Add event listeners to the token input field to select its content on focus or click
}

function SelectableInput(tokenElement) {
	if (tokenElement) {
		tokenElement.addEventListener("focus", (ev) => {
			ev.preventDefault();
			tokenElement.select();
		});
		tokenElement.addEventListener("mousedown", (ev) => {
			ev.preventDefault();
			tokenElement.select();
		});
		tokenElement.addEventListener("mouseup", (ev) => {
			ev.preventDefault();
			tokenElement.select();
		});
	}
	if (tokenElement) {
		tokenElement.addEventListener("focus", () => {
			tokenElement.select();
		});
		tokenElement.addEventListener("click", () => {
			tokenElement.select();
		});
	}
}

// TODO: Doesn't work properly.
// Intended to make sure errors from boosted links are shown.
function ShowBoostedErrors() {
	document.body.addEventListener("htmx:responseError", function (event) {
		const config = event.detail.requestConfig;
		if (config.boosted) {
			document.body.innerHTML = event.detail.xhr.responseText;
			const newUrl = event.detail.xhr.responseURL || config.url;
			window.history.pushState(null, "", newUrl);
		}
	});
}

// INFO: Hooks up to all the reset button children of the target element.
// If an element has a changed state, it will trigger the action with `true`.
// If no elements are changed, it will trigger the action with `false`.
// @param {HTMLElement} target - The parent element containing reset buttons.
// @param {Function} action - The function to call with the change state.
function HookupRBChange(target, action) {
	if (!(target instanceof HTMLElement)) {
		console.warn("Target must be an HTMLElement.");
		return;
	}

	if (typeof action !== "function") {
		console.warn("Action must be a function.");
		return;
	}

	const btns = target.querySelectorAll(RESET_BUTTON_ELEMENT);
	target.addEventListener("rbichange", (event) => {
		for (const btn of btns) {
			if (btn.isCurrentlyModified()) {
				action(event.details, true);
				return;
			}
		}
		action(event.details, false);
	});
}

window.ShowBoostedErrors = ShowBoostedErrors;
window.GenQRCode = GenQRCode;
window.SelectableInput = SelectableInput;
window.PathPlusQuery = PathPlusQuery;
window.HookupRBChange = HookupRBChange;

export { FilterList, ScrollButton, AbbreviationTooltips, MultiSelectSimple, MultiSelectRole, ToolTip, PopupImage, TabList, FilterPill, ImageReel, IntLink };
