// onPageShow is called after busy state is reset, for any caller-provided cleanup
export function InitGlobalHtmxNotice(onPageShow = () => {}) {
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
					<span data-role="global-notice-text">Lädt</span>
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
	let loadingHideTimeout = null;

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
		if (!notice) return;
		setNoticeState(state, message);
		notice.classList.remove("hidden");
	};

	const hideNotice = () => {
		notice = ensureNotice();
		if (!notice) return;
		notice.classList.add("hidden");
		notice.removeAttribute("data-state");
	};

	const setBodyBusy = (busy) => {
		const root = document.documentElement;
		if (busy) {
			root?.setAttribute && (root.dataset.htmxBusy = "true");
			if (document.body) document.body.dataset.htmxBusy = "true";
		} else {
			if (root) delete root.dataset.htmxBusy;
			if (document.body) delete document.body.dataset.htmxBusy;
		}
	};

	const markElementBusy = (element, busy) => {
		if (!element || !(element instanceof HTMLElement)) return;
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

	const clearLoadingHideTimeout = () => {
		if (loadingHideTimeout) {
			clearTimeout(loadingHideTimeout);
			loadingHideTimeout = null;
		}
	};

	const resetBusyState = () => {
		pending = 0;
		setBodyBusy(false);
		delete document.documentElement.dataset.htmxBusy;
		document.querySelectorAll("[data-htmx-busy]").forEach((element) => {
			delete element.dataset.htmxBusy;
			element.removeAttribute("aria-busy");
		});
		document.querySelectorAll("[data-htmx-disabled='true']").forEach((element) => {
			if (element instanceof HTMLButtonElement) element.disabled = false;
			delete element.dataset.htmxDisabled;
		});
		clearLoadingHideTimeout();
		clearErrorTimeout();
		hideNotice();
	};

	document.addEventListener("htmx:beforeRequest", (event) => {
		pending += 1;
		clearErrorTimeout();
		clearLoadingHideTimeout();
		setBodyBusy(true);
		showNotice("loading", "Lädt");
		markElementBusy(event.detail?.elt, true);
	});

	document.addEventListener("htmx:afterRequest", (event) => {
		markElementBusy(event.detail?.elt, false);
		pending = Math.max(0, pending - 1);
		if (pending === 0) {
			setBodyBusy(false);
			if (notice.dataset.state !== "error") {
				clearLoadingHideTimeout();
				loadingHideTimeout = setTimeout(() => {
					loadingHideTimeout = null;
					if (pending === 0 && notice.dataset.state !== "error") {
						hideNotice();
					}
				}, 250);
			}
		}
	});

	document.addEventListener("htmx:responseError", () => {
		setBodyBusy(false);
		showNotice("error", "Laden fehlgeschlagen.");
		clearErrorTimeout();
		clearLoadingHideTimeout();
		errorTimeout = setTimeout(() => {
			pending === 0 ? hideNotice() : showNotice("loading", "Lädt");
		}, 2000);
	});

	document.addEventListener("htmx:sendError", () => {
		setBodyBusy(false);
		showNotice("error", "Verbindung fehlgeschlagen.");
		clearErrorTimeout();
		clearLoadingHideTimeout();
		errorTimeout = setTimeout(() => {
			pending === 0 ? hideNotice() : showNotice("loading", "Lädt");
		}, 2000);
	});

	document.addEventListener("htmx:afterSwap", () => {
		notice = ensureNotice();
		if (notice && !textEl) {
			textEl = notice.querySelector("[data-role='global-notice-text']");
		}
	});

	window.addEventListener("pageshow", () => {
		resetBusyState();
		onPageShow();
	});
}

export function InitStickyActionBars() {
	if (InitStickyActionBars._initialized) {
		return;
	}
	InitStickyActionBars._initialized = true;

	const update = () => {
		const bars = document.querySelectorAll(".form-action-bar");
		if (!bars.length) return;
		const viewportBottom = window.innerHeight || document.documentElement.clientHeight;
		bars.forEach((bar) => {
			const rect = bar.getBoundingClientRect();
			bar.classList.toggle("is-stuck", rect.bottom >= viewportBottom - 1);
		});
	};

	update();
	window.addEventListener("scroll", update, { passive: true });
	window.addEventListener("resize", update);
	document.addEventListener("htmx:afterSwap", update);
}

export function InitTimedMessages() {
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

	const scheduleEl = (el) => {
		if (el.dataset.autohideScheduled === "true") return;
		el.dataset.autohideScheduled = "true";
		setTimeout(() => hide(el), duration);
	};

	const schedule = (root) => {
		const scope = root || document;
		if (scope !== document && scope.matches?.("[data-autohide='true']")) {
			scheduleEl(scope);
		}
		scope.querySelectorAll("[data-autohide='true']").forEach(scheduleEl);
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
