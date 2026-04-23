let browserSupportsFieldSizing = null;
function supportsFieldSizing() {
	if (browserSupportsFieldSizing !== null) {
		return browserSupportsFieldSizing;
	}
	if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
		browserSupportsFieldSizing = CSS.supports("field-sizing", "content");
	} else {
		browserSupportsFieldSizing = false;
	}
	return browserSupportsFieldSizing;
}

function resolveLineHeightPx(textarea, computed) {
	const lineHeight = computed.lineHeight;
	if (lineHeight && lineHeight !== "normal") {
		const parsed = parseFloat(lineHeight);
		if (!Number.isNaN(parsed)) {
			return parsed;
		}
	}

	const fontSize = parseFloat(computed.fontSize) || 16;
	if (!document.body) {
		return fontSize * 1.2;
	}

	const probe = document.createElement("span");
	probe.textContent = "M";
	probe.style.position = "absolute";
	probe.style.visibility = "hidden";
	probe.style.whiteSpace = "pre";
	probe.style.padding = "0";
	probe.style.margin = "0";
	probe.style.border = "0";
	probe.style.fontFamily = computed.fontFamily;
	probe.style.fontSize = computed.fontSize;
	probe.style.fontWeight = computed.fontWeight;
	probe.style.fontStyle = computed.fontStyle;
	probe.style.letterSpacing = computed.letterSpacing;
	probe.style.lineHeight = "normal";
	document.body.appendChild(probe);
	const height = probe.getBoundingClientRect().height;
	probe.remove();
	return height || fontSize * 1.2;
}

export function TextareaAutoResize(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement)) {
		return;
	}
	if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
		return;
	}
	if (textarea.offsetParent === null) {
		return;
	}

	textarea.removeAttribute("rows");
	textarea.style.overflow = "auto";

	const isAnnotation = textarea.name === "annotation";
	const computed = getComputedStyle(textarea);
	const rows = isAnnotation ? 2 : 1;
	const lineHeight = resolveLineHeightPx(textarea, computed);
	const paddingY = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
	const borderY = parseFloat(computed.borderTopWidth) + parseFloat(computed.borderBottomWidth);
	const minContentHeight = lineHeight * rows + paddingY;
	const minHeight = computed.boxSizing === "border-box" ? minContentHeight + borderY : minContentHeight;

	if (textarea.value.trim() === "") {
		textarea.style.height = minHeight + "px";
		return;
	}

	textarea.style.height = "1px";
	const contentHeight = textarea.scrollHeight;
	const contentHeightWithBox = computed.boxSizing === "border-box" ? contentHeight + borderY : contentHeight;
	textarea.style.height = Math.max(contentHeightWithBox, minHeight) + "px";
}

function NoEnters(event) {
	if (event.key === "Enter") {
		event.preventDefault();
	}
}

function HookupTextareaAutoResize(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement)) {
		return;
	}
	if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
		return;
	}
	if (supportsFieldSizing()) {
		return;
	}
	textarea.addEventListener("input", () => {
		TextareaAutoResize(textarea);
	});
}

function DisconnectTextareaAutoResize(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement)) {
		return;
	}
	textarea.removeEventListener("input", () => {
		TextareaAutoResize(textarea);
	});
}

function HookupNoEnters(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement) && textarea.classList.contains("no-enter")) {
		return;
	}
	textarea.addEventListener("keydown", NoEnters);
}

function DisconnectNoEnters(textarea) {
	if (!(textarea instanceof HTMLTextAreaElement) && textarea.classList.contains("no-enter")) {
		return;
	}
	textarea.removeEventListener("keydown", NoEnters);
}

function MutateObserve(mutations) {
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

export function FormLoad(form) {
	if (!(form instanceof HTMLFormElement)) {
		return;
	}

	const textareas = document.querySelectorAll("textarea");

	for (const textarea of textareas) {
		if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
			continue;
		}
		textarea.addEventListener("input", function () {
			TextareaAutoResize(this);
		});
	}

	setTimeout(() => {
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

	const visibilityObserver = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.attributeName === "class") {
				const target = mutation.target;
				if (target instanceof HTMLElement) {
					const textareasInTarget = target.matches("textarea") ? [target] : Array.from(target.querySelectorAll("textarea"));
					for (const textarea of textareasInTarget) {
						if (textarea.dataset.noAutoresize === "true" || textarea.classList.contains("no-autoresize")) {
							continue;
						}
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

	const booleanCheckboxes = form.querySelectorAll('input[type="checkbox"][data-boolean-checkbox]');
	booleanCheckboxes.forEach((checkbox) => {
		checkbox.value = "true";
		const updateHiddenInput = () => {
			const existingHidden = form.querySelector(`input[type="hidden"][name="${checkbox.name}"]`);
			if (existingHidden) {
				existingHidden.remove();
			}
			if (!checkbox.checked) {
				const hidden = document.createElement("input");
				hidden.type = "hidden";
				hidden.name = checkbox.name;
				hidden.value = "false";
				checkbox.parentNode.insertBefore(hidden, checkbox);
			}
		};
		updateHiddenInput();
		checkbox.addEventListener("change", updateHiddenInput);
	});
}
