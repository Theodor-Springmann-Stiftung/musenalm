// INFO: We import this so vite processes the stylesheet
import "./site.css";

import Trix from "trix";

// Disable file attachments in Trix editor
document.addEventListener("trix-file-accept", (event) => {
	event.preventDefault();
});

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
import { ItemsEditor } from "./items-editor.js";
import { SingleSelectRemote } from "./single-select-remote.js";
import { AlmanachEditPage } from "./almanach-edit.js";
import { RelationsEditor } from "./relations-editor.js";
import { EditPage } from "./edit-page.js";
import { FabMenu } from "./fab-menu.js";
import { DuplicateWarningChecker } from "./duplicate-warning.js";
import { ContentImages } from "./content-images.js";
import { LookupField } from "./lookup-field.js";

const FILTER_LIST_ELEMENT = "filter-list";
const FAB_MENU_ELEMENT = "fab-menu";
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
const SINGLE_SELECT_REMOTE_ELEMENT = "single-select-remote";
const RESET_BUTTON_ELEMENT = "reset-button";
const DIV_MANAGER_ELEMENT = "div-manager";
const ITEMS_EDITOR_ELEMENT = "items-editor";
const ALMANACH_EDIT_PAGE_ELEMENT = "almanach-edit-page";
const RELATIONS_EDITOR_ELEMENT = "relations-editor";
const EDIT_PAGE_ELEMENT = "edit-page";
const DUPLICATE_WARNING_ELEMENT = "duplicate-warning-checker";
const CONTENT_IMAGES_ELEMENT = "content-images";
const LOOKUP_FIELD_ELEMENT = "lookup-field";

window.lookupSeriesValue = ({ item }) => item?.id || "";
window.lookupSeriesLink = ({ item }) => (item?.musenalm_id ? `/reihe/${item.musenalm_id}` : "");
window.lookupRequiredText = ({ displayValue }) => Boolean((displayValue || "").trim());
window.lookupRequiredId = ({ hiddenValue }) => Boolean((hiddenValue || "").trim());

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
customElements.define(SINGLE_SELECT_REMOTE_ELEMENT, SingleSelectRemote);
customElements.define(RESET_BUTTON_ELEMENT, ResetButton);
customElements.define(DIV_MANAGER_ELEMENT, DivManager);
customElements.define(ITEMS_EDITOR_ELEMENT, ItemsEditor);
customElements.define(ALMANACH_EDIT_PAGE_ELEMENT, AlmanachEditPage);
customElements.define(RELATIONS_EDITOR_ELEMENT, RelationsEditor);
customElements.define(EDIT_PAGE_ELEMENT, EditPage);
customElements.define(FAB_MENU_ELEMENT, FabMenu);
customElements.define(DUPLICATE_WARNING_ELEMENT, DuplicateWarningChecker);
customElements.define(CONTENT_IMAGES_ELEMENT, ContentImages);
customElements.define(LOOKUP_FIELD_ELEMENT, LookupField);

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

// Check if browser supports field-sizing: content (Chrome 123+, Edge 123+)
// Firefox, Safari don't support it yet as of 2024
let browserSupportsFieldSizing = null;
function supportsFieldSizing() {
	if (browserSupportsFieldSizing !== null) {
		return browserSupportsFieldSizing;
	}
	// Check if CSS.supports is available and test for field-sizing
	if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
		browserSupportsFieldSizing = CSS.supports("field-sizing", "content");
	} else {
		browserSupportsFieldSizing = false;
	}
	console.log("Browser supports field-sizing:", browserSupportsFieldSizing);
	return browserSupportsFieldSizing;
}

// Simple textarea auto-resize function
function TextareaAutoResize(textarea) {
	console.log("TextareaAutoResize called for:", textarea.name || textarea.id);

	if (!(textarea instanceof HTMLTextAreaElement)) {
		console.log("Not a textarea element");
		return;
	}
	if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
		return;
	}

	// Skip if not visible
	if (textarea.offsetParent === null) {
		console.log("Textarea not visible");
		return;
	}

	// Remove rows attribute
	textarea.removeAttribute("rows");

	// Set overflow auto to allow scrolling if needed
	textarea.style.overflow = "auto";

	// Special case: annotation textarea has 2 rows minimum
	const isAnnotation = textarea.name === "annotation";
	const minHeight = isAnnotation ? 76 : 38; // 2 rows vs 1 row

	// For empty textareas, set minimum height
	if (textarea.value.trim() === "") {
		textarea.style.height = minHeight + "px";
		console.log("Empty textarea, setting height to:", minHeight + "px");
		return;
	}

	// Reset to 1px to get accurate scrollHeight
	textarea.style.height = "1px";

	// Set to content height (scrollHeight is the actual content height)
	const contentHeight = textarea.scrollHeight;
	const newHeight = Math.max(contentHeight, minHeight) + "px";
	console.log("Setting height to:", newHeight);
	textarea.style.height = newHeight;
}

function NoEnters(event) {
	if (event.key === "Enter") {
		event.preventDefault();
	}
}

function HookupTextareaAutoResize(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement)) {
		console.warn("HookupTextareaAutoResize: Provided element is not a textarea.");
		return;
	}
	if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
		return;
	}

	// If browser supports field-sizing, CSS handles it
	if (supportsFieldSizing()) {
		return;
	}

	// Fallback: attach event listener for manual resizing
	textarea.addEventListener("input", () => {
		TextareaAutoResize(textarea);
	});
}

function DisconnectTextareaAutoResize(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement)) {
		console.warn("DisconnectTextareaAutoResize: Provided element is not a textarea.");
		return;
	}

	// Remove the input event listener
	textarea.removeEventListener("input", () => {
		TextareaAutoResize(textarea);
	});
}

// INFO: Prevents Enter key from being used in textareas.
// @param {HTMLTextAreaElement} textarea - The textarea element to hook up the no-enter
// functionality.
function HookupNoEnters(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement) && textarea.classList.contains("no-enter")) {
		return;
	}

	textarea.addEventListener("keydown", NoEnters);
}

// @param {HTMLTextAreaElement} textarea - The textarea element to disconnect the no-enter
function DisconnectNoEnters(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement) && textarea.classList.contains("no-enter")) {
		return;
	}

	textarea.removeEventListener("keydown", NoEnters);
}

function InitGlobalHtmxNotice() {
	if (!window.htmx) {
		return;
	}
	const ensureNotice = () => {
		let noticeEl = document.getElementById("global-notice");
		if (!noticeEl) {
			noticeEl = document.createElement("div");
			noticeEl.id = "global-notice";
			noticeEl.className = "global-notice hidden";
			noticeEl.setAttribute("role", "status");
			noticeEl.setAttribute("aria-live", "polite");
			noticeEl.setAttribute("aria-atomic", "true");
			noticeEl.dataset.state = "";
			noticeEl.innerHTML = `
				<div class="global-notice-inner">
					<i class="ri-loader-4-line spinning" aria-hidden="true"></i>
					<span data-role="global-notice-text">Laden&#8230;</span>
				</div>
			`;
			document.body?.appendChild(noticeEl);
		}
		return noticeEl;
	};
	let notice = ensureNotice();
	let textEl = notice ? notice.querySelector("[data-role='global-notice-text']") : null;
	let pending = 0;
	let errorTimeout = null;

	const setNoticeState = (state, message) => {
		notice = ensureNotice();
		if (notice && !textEl) {
			textEl = notice.querySelector("[data-role='global-notice-text']");
		}
		if (textEl && message) {
			textEl.textContent = message;
		}
		if (notice && state) {
			notice.dataset.state = state;
		} else if (notice) {
			notice.removeAttribute("data-state");
		}
	};

	const showNotice = (state, message) => {
		notice = ensureNotice();
		if (!notice) {
			return;
		}
		setNoticeState(state, message);
		notice.classList.remove("hidden");
	};

	const hideNotice = () => {
		notice = ensureNotice();
		if (!notice) {
			return;
		}
		notice.classList.add("hidden");
		notice.removeAttribute("data-state");
	};

	const setBodyBusy = (busy) => {
		const root = document.documentElement;
		if (busy) {
			if (root) {
				root.dataset.htmxBusy = "true";
			}
			if (document.body) {
				document.body.dataset.htmxBusy = "true";
			}
		} else {
			if (root) {
				delete root.dataset.htmxBusy;
			}
			if (document.body) {
				delete document.body.dataset.htmxBusy;
			}
		}
	};

	const markElementBusy = (element, busy) => {
		if (!element || !(element instanceof HTMLElement)) {
			return;
		}
		if (busy) {
			element.dataset.htmxBusy = "true";
			element.setAttribute("aria-busy", "true");
			if (element instanceof HTMLButtonElement && !element.disabled) {
				element.dataset.htmxDisabled = "true";
				element.disabled = true;
			}
		} else if (element.dataset.htmxBusy === "true") {
			delete element.dataset.htmxBusy;
			element.removeAttribute("aria-busy");
			if (element instanceof HTMLButtonElement && element.dataset.htmxDisabled === "true") {
				element.disabled = false;
				delete element.dataset.htmxDisabled;
			}
		}
	};

	const clearErrorTimeout = () => {
		if (errorTimeout) {
			clearTimeout(errorTimeout);
			errorTimeout = null;
		}
	};

	document.addEventListener("htmx:beforeRequest", (event) => {
		pending += 1;
		clearErrorTimeout();
		setBodyBusy(true);
		showNotice("loading", "Laden...");
		markElementBusy(event.detail?.elt, true);
	});

	document.addEventListener("htmx:afterRequest", (event) => {
		markElementBusy(event.detail?.elt, false);
		pending = Math.max(0, pending - 1);
		if (pending === 0) {
			setBodyBusy(false);
			if (notice.dataset.state !== "error") {
				hideNotice();
			}
		}
	});

	document.addEventListener("htmx:responseError", () => {
		setBodyBusy(false);
		showNotice("error", "Laden fehlgeschlagen.");
		clearErrorTimeout();
		errorTimeout = setTimeout(() => {
			if (pending === 0) {
				hideNotice();
			} else {
				showNotice("loading", "Laden...");
			}
		}, 2000);
	});

	document.addEventListener("htmx:sendError", () => {
		setBodyBusy(false);
		showNotice("error", "Verbindung fehlgeschlagen.");
		clearErrorTimeout();
		errorTimeout = setTimeout(() => {
			if (pending === 0) {
				hideNotice();
			} else {
				showNotice("loading", "Laden...");
			}
		}, 2000);
	});

	document.addEventListener("htmx:afterSwap", () => {
		notice = ensureNotice();
		if (notice && !textEl) {
			textEl = notice.querySelector("[data-role='global-notice-text']");
		}
	});
}

function MutateObserve(mutations, observer) {
	const needsJSResize = !supportsFieldSizing();

	for (const mutation of mutations) {
		if (mutation.type === "childList") {
			for (const node of mutation.addedNodes) {
				if (node.nodeType === Node.ELEMENT_NODE && node.matches("textarea")) {
					if (needsJSResize) {
						HookupTextareaAutoResize(node);
						TextareaAutoResize(node);
					}
				}
			}
			for (const node of mutation.removedNodes) {
				if (node.nodeType === Node.ELEMENT_NODE && node.matches("textarea")) {
					DisconnectNoEnters(node);
					if (needsJSResize) {
						DisconnectTextareaAutoResize(node);
					}
				}
			}
		}
	}
}

// INFO: Various options and plugs for laoding and parsing forms.
function FormLoad(form) {
	console.log("=== FormLoad CALLED ===");

	if (!(form instanceof HTMLFormElement)) {
		console.warn("FormLoad: Provided element is not a form.");
		return;
	}

	const textareas = document.querySelectorAll("textarea");
	console.log("Found", textareas.length, "textareas");

	// Attach resize handler to all textareas
	for (const textarea of textareas) {
		if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
			continue;
		}
		console.log("Attaching input listener to:", textarea.name || textarea.id);
		textarea.addEventListener("input", function () {
			console.log("Input event on textarea:", this.name || this.id);
			TextareaAutoResize(this);
		});
	}

	// Initial resize after short delay (increased to ensure content is loaded)
	setTimeout(() => {
		console.log("Running initial textarea resize on", textareas.length, "textareas");
		for (const textarea of textareas) {
			if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
				continue;
			}
			TextareaAutoResize(textarea);
		}
	}, 200);

	const noEnterTextareas = document.querySelectorAll("textarea.no-enter");
	for (const textarea of noEnterTextareas) {
		HookupNoEnters(textarea);
	}

	const observer = new MutationObserver(MutateObserve);
	observer.observe(form, {
		childList: true,
		subtree: true,
	});

	// Watch for class changes (hidden/visible) and resize textareas when they become visible
	const visibilityObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.attributeName === "class") {
				const target = mutation.target;
				// Check if this element or its children contain textareas
				if (target instanceof HTMLElement) {
					const textareasInTarget = target.matches("textarea") ? [target] : Array.from(target.querySelectorAll("textarea"));

					for (const textarea of textareasInTarget) {
						if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
							continue;
						}
						// Only resize if now visible
						if (textarea.offsetParent !== null) {
							TextareaAutoResize(textarea);
						}
					}
				}
			}
		}
	});

	visibilityObserver.observe(form, {
		attributes: true,
		attributeFilter: ["class"],
		subtree: true,
	});

	// Handle boolean checkboxes
	const booleanCheckboxes = form.querySelectorAll('input[type="checkbox"][data-boolean-checkbox]');
	booleanCheckboxes.forEach((checkbox) => {
		// Ensure each boolean checkbox has proper value handling
		checkbox.value = "true";

		// Add change handler to manage hidden input
		const updateHiddenInput = () => {
			// Remove any existing hidden input for this checkbox
			const existingHidden = form.querySelector(`input[type="hidden"][name="${checkbox.name}"]`);
			if (existingHidden) {
				existingHidden.remove();
			}

			// If checkbox is unchecked, add hidden input with false value
			if (!checkbox.checked) {
				const hidden = document.createElement("input");
				hidden.type = "hidden";
				hidden.name = checkbox.name;
				hidden.value = "false";
				checkbox.parentNode.insertBefore(hidden, checkbox);
			}
		};

		// Initial setup
		updateHiddenInput();

		// Update on change
		checkbox.addEventListener("change", updateHiddenInput);
	});

}

function InitStickyActionBars() {
	if (InitStickyActionBars._initialized) {
		return;
	}
	InitStickyActionBars._initialized = true;

	const update = () => {
		const bars = document.querySelectorAll(".form-action-bar");
		if (!bars.length) {
			return;
		}
		const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
		bars.forEach((bar) => {
			const rect = bar.getBoundingClientRect();
			const stuck = rect.bottom >= viewportBottom - 1;
			bar.classList.toggle("is-stuck", stuck);
		});
	};

	update();
	window.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update);
	document.addEventListener("htmx:afterSwap", update);
}

function InitTimedMessages() {
	const duration = 2000;
	const hide = (el) => {
		if (!el || el.classList.contains("hidden") || el.classList.contains("is-hidden")) {
			return;
		}
		requestAnimationFrame(() => {
			el.classList.add("is-hiding");
		});
		setTimeout(() => {
			el.classList.add("is-hidden");
			el.classList.remove("is-hiding");
			delete el.dataset.autohideScheduled;
		}, 320);
	};

	const schedule = (root) => {
		const scope = root || document;
		scope.querySelectorAll("[data-autohide='true']").forEach((el) => {
			if (el.dataset.autohideScheduled === "true") {
				return;
			}
			el.dataset.autohideScheduled = "true";
			setTimeout(() => hide(el), duration);
		});
	};

	schedule(document);
	document.addEventListener("htmx:afterSwap", (event) => {
		schedule(event.target);
	});
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== Node.ELEMENT_NODE) continue;
				schedule(node);
			}
		}
	});
	observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("keydown", (event) => {
	if (event.key !== "Enter") {
		return;
	}
	const target = event.target;
	if (!(target instanceof HTMLElement)) {
		return;
	}
	if (target.matches("textarea.no-enter")) {
		event.preventDefault();
	}
});

window.ShowBoostedErrors = ShowBoostedErrors;
window.GenQRCode = GenQRCode;
window.SelectableInput = SelectableInput;
window.PathPlusQuery = PathPlusQuery;
window.HookupRBChange = HookupRBChange;
window.FormLoad = FormLoad;
window.TextareaAutoResize = TextareaAutoResize;
window.InitTimedMessages = InitTimedMessages;
InitGlobalHtmxNotice();
InitStickyActionBars();
InitTimedMessages();

export { FilterList, ScrollButton, AbbreviationTooltips, MultiSelectSimple, MultiSelectRole, ToolTip, PopupImage, TabList, FilterPill, ImageReel, IntLink, ItemsEditor, SingleSelectRemote, AlmanachEditPage, RelationsEditor, EditPage, FabMenu, LookupField };
