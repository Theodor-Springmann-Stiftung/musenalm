import "./site.css";

import "trix";
import "tippy.js/dist/tippy.css";

import { FilterPill } from "./filter-pill.js";
import { FilterList } from "./filter-list.js";
import { ScrollButton } from "./scroll-button.js";
import { PopupImage } from "./popup-image.js";
import { TabList } from "./tab-list.js";
import { AbbreviationTooltips } from "./abbrev-tooltips.js";
import { IntLink } from "./int-link.js";
import { ImageReel } from "./image-reel.js";
import { MultiSelectSimple } from "./multi-select-simple.js";
import { ResetButton } from "./reset-button.js";
import { DivManager } from "./div-menu.js";
import { ItemsEditor } from "./items-editor.js";
import { AlmanachEditPage } from "./almanach-edit.js";
import { EditPage } from "./edit-page.js";
import { DuplicateWarningChecker } from "./duplicate-warning.js";
import { ContentImages } from "./content-images.js";
import { LookupField } from "./lookup-field.js";
import { GndNameLookup } from "./gnd-name-lookup.js";
import { ExportManager } from "./export-manager.js";
import { ContentTypeSelect } from "./content-type-select.js";
import { ContentPersonRelations } from "./content-person-relations.js";
import { ContentSeriesRelations } from "./content-series-relations.js";
import {
	HookupRBChange,
	closeAdminStatusMenus,
	initAdminSidebarTooltips,
	initAdminStatusPickers,
	markHashNavigationCurrent,
	pruneAdminSidebarDetails,
	setupCancelLinks,
} from "./admin-runtime.js";
import { FormLoad, TextareaAutoResize } from "./form-runtime.js";
import { initStatusTooltips } from "./status-tooltips.js";
import { InitGlobalHtmxNotice, InitStickyActionBars, InitTimedMessages, showToast } from "./ui-runtime.js";

document.addEventListener("trix-file-accept", (event) => {
	event.preventDefault();
});

const ELEMENT_DEFINITIONS = [
	["int-link", IntLink],
	["abbrev-tooltips", AbbreviationTooltips],
	["filter-list", FilterList],
	["scroll-button", ScrollButton],
	["popup-image", PopupImage],
	["tab-list", TabList],
	["filter-pill", FilterPill],
	["image-reel", ImageReel],
	["multi-select-simple", MultiSelectSimple],
	["reset-button", ResetButton],
	["div-manager", DivManager],
	["items-editor", ItemsEditor],
	["almanach-edit-page", AlmanachEditPage],
	["edit-page", EditPage],
	["duplicate-warning-checker", DuplicateWarningChecker],
	["content-images", ContentImages],
	["lookup-field", LookupField],
	["gnd-name-lookup", GndNameLookup],
	["export-manager", ExportManager],
	["content-type-select", ContentTypeSelect],
	["content-person-relations", ContentPersonRelations],
	["content-series-relations", ContentSeriesRelations],
];

window.lookupSeriesValue = ({ item }) => item?.id || "";
window.lookupSeriesLink = ({ item }) => (item?.musenalm_id ? `/reihe/${item.musenalm_id}` : "");
window.lookupRequiredText = ({ displayValue }) => Boolean((displayValue || "").trim());
window.lookupRequiredId = ({ hiddenValue }) => Boolean((hiddenValue || "").trim());

for (const [name, elementClass] of ELEMENT_DEFINITIONS) {
	if (!customElements.get(name)) {
		customElements.define(name, elementClass);
	}
}

function getQRCodeWhenAvailable(timeout = 5000, interval = 100) {
	return new Promise((resolve, reject) => {
		let elapsedTime = 0;
		const checkInterval = setInterval(() => {
			if (typeof window.QRCode === "function") {
				clearInterval(checkInterval);
				resolve(window.QRCode);
				return;
			}

			elapsedTime += interval;
			if (elapsedTime >= timeout) {
				clearInterval(checkInterval);
				reject(new Error(`QRCode not available after ${timeout}ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode.`));
			}
		}, interval);
	});
}

async function GenQRCode(value) {
	const QRCode = await getQRCodeWhenAvailable();
	const qrElement = document.getElementById("qr");
	if (!qrElement) {
		return;
	}

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

function SelectableInput(tokenElement) {
	if (!tokenElement) {
		return;
	}

	tokenElement.addEventListener("focus", (event) => {
		event.preventDefault();
		tokenElement.select();
	});
	tokenElement.addEventListener("mousedown", (event) => {
		event.preventDefault();
		tokenElement.select();
	});
	tokenElement.addEventListener("mouseup", (event) => {
		event.preventDefault();
		tokenElement.select();
	});
	tokenElement.addEventListener("click", () => {
		tokenElement.select();
	});
}

function ShowBoostedErrors() {
	document.body.addEventListener("htmx:responseError", (event) => {
		const config = event.detail.requestConfig;
		if (!config.boosted) {
			return;
		}

		document.body.innerHTML = event.detail.xhr.responseText;
		const newUrl = event.detail.xhr.responseURL || config.url;
		window.history.pushState(null, "", newUrl);
	});
}

function initAdminRuntime(root = document) {
	setupCancelLinks(root);
	initAdminStatusPickers(root);
	initStatusTooltips(root);
	initAdminSidebarTooltips(document);
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll("[data-toast]").forEach((el) => {
		window.showToast?.(el.dataset.toastMessage, el.dataset.toast);
	});
	markHashNavigationCurrent();
	pruneAdminSidebarDetails();
	initAdminRuntime(document);
});

document.addEventListener("htmx:afterSwap", (event) => {
	const root = event.detail?.target || document;
	pruneAdminSidebarDetails();
	initAdminRuntime(root);
});

document.addEventListener("htmx:load", (event) => {
	const root = event.detail?.elt || document;
	initAdminRuntime(root);
});

document.addEventListener("admin-sidebar-statechange", () => {
	initAdminSidebarTooltips(document);
});

document.addEventListener("click", (event) => {
	if (event.target instanceof Element && event.target.closest("[data-role='content-status-picker']")) {
		return;
	}
	closeAdminStatusMenus();
});

document.addEventListener("keydown", (event) => {
	if (event.key !== "Enter") {
		return;
	}
	const target = event.target;
	if (target instanceof HTMLElement && target.matches("textarea.no-enter")) {
		event.preventDefault();
	}
});

window.showToast = showToast;
window.ShowBoostedErrors = ShowBoostedErrors;
window.GenQRCode = GenQRCode;
window.SelectableInput = SelectableInput;
window.HookupRBChange = HookupRBChange;
window.FormLoad = FormLoad;
window.TextareaAutoResize = TextareaAutoResize;
window.initAdminStatusPickers = initAdminStatusPickers;

// Ensure #global-toast exists for HTMX OOB swaps
if (!document.getElementById("global-toast")) {
	const t = document.createElement("div");
	t.id = "global-toast";
	t.className = "fixed bottom-3 z-50 max-w-sm pointer-events-none";
	document.body?.appendChild(t);
}

InitGlobalHtmxNotice(() => {
	pruneAdminSidebarDetails();
	closeAdminStatusMenus();
	initAdminRuntime(document);
});
InitStickyActionBars();
InitTimedMessages();

export {
	AbbreviationTooltips,
	AlmanachEditPage,
	ContentImages,
	EditPage,
	FilterList,
	FilterPill,
	ImageReel,
	IntLink,
	ItemsEditor,
	LookupField,
	MultiSelectSimple,
	PopupImage,
	ScrollButton,
	TabList,
};
