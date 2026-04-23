import tippy from "tippy.js";

export function setupCancelLinks(root = document) {
	const links = root.querySelectorAll("[data-role='cancel-link']");
	links.forEach((link) => {
		if (link.dataset.cancelBound === "true") {
			return;
		}
		link.dataset.cancelBound = "true";
		const cancelUrl = (link.getAttribute("data-cancel-url") || "").trim();
		if (cancelUrl) {
			link.setAttribute("href", cancelUrl);
			return;
		}
		link.addEventListener("click", (event) => {
			const resolved = (link.getAttribute("data-cancel-url") || "").trim();
			if (resolved) {
				return;
			}
			event.preventDefault();
			if (window.history.length > 1) {
				window.history.back();
			}
		});
	});
}

const ADMIN_STATUS_ICON_CLASSES = ["ri-checkbox-circle-line", "ri-information-line", "ri-search-line", "ri-list-check", "ri-forbid-2-line"];

export function closeAdminStatusMenus(except = null) {
	document.querySelectorAll("[data-role='content-status-picker']").forEach((picker) => {
		if (except && picker === except) {
			return;
		}
		picker.querySelector("[data-role='content-status-menu']")?.classList.add("hidden");
	});
}

function applyAdminStatusPickerState(picker, status) {
	if (!(picker instanceof HTMLElement)) {
		return;
	}
	const toggle = picker.querySelector("[data-role='content-status-toggle']");
	if (!(toggle instanceof HTMLButtonElement)) {
		return;
	}
	const option = picker.querySelector(`[data-role='content-status-option'][data-status='${status}']`);
	const icon = toggle.querySelector("i");
	const label = option?.dataset.label || "";
	const iconClass = option?.dataset.icon || "ri-forbid-2-line";
	toggle.dataset.status = status;
	if (label) {
		toggle.setAttribute("aria-label", `Status: ${label}`);
		toggle.setAttribute("title", `Status: ${label}`);
	}
	if (icon) {
		icon.classList.remove(...ADMIN_STATUS_ICON_CLASSES);
		icon.classList.add(iconClass);
	}
}

function updateAdminStatusTimestamps(container, value) {
	if (!(container instanceof HTMLElement) || !value) {
		return;
	}
	container.dataset.lastEdited = value;
	container.querySelectorAll("[data-last-edited], [data-place-updated]").forEach((element) => {
		if (element.hasAttribute("data-last-edited")) {
			element.setAttribute("data-last-edited", value);
		}
		if (element.hasAttribute("data-place-updated")) {
			element.setAttribute("data-place-updated", value);
		}
	});
}

export function initAdminStatusPickers(root = document) {
	const scope = root instanceof HTMLElement || root instanceof Document ? root : document;
	scope.querySelectorAll("[data-role='content-status-picker'][data-status-endpoint]").forEach((picker) => {
		if (!(picker instanceof HTMLElement) || picker.dataset.statusBound === "true") {
			return;
		}
		picker.dataset.statusBound = "true";
		const toggle = picker.querySelector("[data-role='content-status-toggle']");
		const menu = picker.querySelector("[data-role='content-status-menu']");
		const endpoint = (picker.dataset.statusEndpoint || "").trim();
		if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement) || !endpoint) {
			return;
		}

		toggle.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			const willOpen = menu.classList.contains("hidden");
			closeAdminStatusMenus(willOpen ? picker : null);
			menu.classList.toggle("hidden", !willOpen);
		});

		picker.querySelectorAll("[data-role='content-status-option']").forEach((option) => {
			if (!(option instanceof HTMLButtonElement)) {
				return;
			}
			option.addEventListener("click", async (event) => {
				event.preventDefault();
				event.stopPropagation();
				const nextStatus = (option.dataset.status || "").trim();
				const csrfToken = (picker.dataset.statusCsrfToken || document.querySelector("[data-role='global-csrf-token']")?.value || "").trim();
				const lastEdited = (picker.dataset.lastEdited || "").trim();
				if (!nextStatus || !csrfToken) {
					menu.classList.add("hidden");
					return;
				}

				const previousStatus = toggle.dataset.status || "Unknown";
				applyAdminStatusPickerState(picker, nextStatus);
				updatePersonViewChips(picker, nextStatus);
				menu.classList.add("hidden");
				toggle.disabled = true;
				toggle.classList.add("opacity-70", "pointer-events-none");

				try {
					const response = await fetch(endpoint, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							csrf_token: csrfToken,
							last_edited: lastEdited,
							status: nextStatus,
						}),
					});
					const result = await response.json().catch(() => null);
					if (!response.ok || !result?.success) {
						throw new Error(result?.error || "status update failed");
					}
					if (result.status) {
						applyAdminStatusPickerState(picker, result.status);
						updatePersonViewChips(picker, result.status);
					}
					if (result.last_edited) {
						picker.dataset.lastEdited = result.last_edited;
						const row = picker.closest("tr, [data-role='reihen-row'], [data-role='content-item']");
						if (row instanceof HTMLElement) {
							updateAdminStatusTimestamps(row, result.last_edited);
						}
					}
				} catch (error) {
					applyAdminStatusPickerState(picker, previousStatus);
					updatePersonViewChips(picker, previousStatus);
					console.error(error);
				} finally {
					toggle.disabled = false;
					toggle.classList.remove("opacity-70", "pointer-events-none");
				}
			});
		});
	});
}

function updatePersonViewChips(picker, status) {
	const row = picker.closest("tr");
	if (!row) return;
	const chipPair = row.querySelector("[data-person-musenalm-id]");
	if (!chipPair) return;
	const id = chipPair.dataset.personMusenalmId;
	if (status === "ToDo") {
		chipPair.innerHTML =
			`<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span>` +
			`<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>`;
	} else {
		chipPair.innerHTML =
			`<a href="/person/${id}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a>` +
			`<a href="/person/${id}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
	}
}

export function markHashNavigationCurrent() {
	const hash = window.location.hash;
	if (!hash) {
		return;
	}
	const element = document.getElementById(hash.slice(1));
	if (element) {
		element.setAttribute("aria-current", "location");
	}
}

export function pruneAdminSidebarDetails() {
	document.querySelectorAll("[data-admin-main-link]").forEach((link) => {
		if (link.getAttribute("aria-current") === "page") {
			return;
		}
		link.querySelectorAll(".admin-sidebar-link-detail").forEach((detail) => detail.remove());
	});
}

const ADMIN_SIDEBAR_TOOLTIP_SELECTOR = [
	"#admin-sidebar .admin-sidebar-link",
	"#admin-sidebar .admin-sidebar-toggle",
	"#admin-sidebar .admin-sidebar-collapsed-public-trigger",
	"#admin-sidebar .admin-sidebar-collapsed-create-trigger",
	"#admin-sidebar .admin-sidebar-account-icon",
].join(", ");

function adminSidebarTooltipContent(element) {
	if (!(element instanceof HTMLElement)) {
		return "";
	}
	const explicitTooltip = (element.getAttribute("data-admin-sidebar-tooltip") || "").trim();
	if (explicitTooltip) {
		return explicitTooltip;
	}
	const title = (element.getAttribute("title") || "").trim();
	if (title) {
		return title;
	}
	return (element.getAttribute("aria-label") || "").trim();
}

function destroyAdminSidebarTooltips(root = document) {
	const scope = root instanceof Element ? root : document;
	const candidates = [];
	if (root instanceof Element && root.matches(ADMIN_SIDEBAR_TOOLTIP_SELECTOR)) {
		candidates.push(root);
	}
	candidates.push(...scope.querySelectorAll(ADMIN_SIDEBAR_TOOLTIP_SELECTOR));
	candidates.forEach((element) => {
		if (element._tippy) {
			element._tippy.destroy();
		}
	});
}

export function initAdminSidebarTooltips(root = document) {
	const sidebar = document.getElementById("admin-sidebar");
	if (!sidebar) {
		return;
	}
	const isCollapsed = document.documentElement.classList.contains("admin-layout-sidebar-collapsed");
	if (!isCollapsed) {
		destroyAdminSidebarTooltips(sidebar);
		return;
	}

	const scope = root instanceof Element ? root : sidebar;
	const candidates = [];

	if (root instanceof Element && root.matches(ADMIN_SIDEBAR_TOOLTIP_SELECTOR) && !root._tippy && adminSidebarTooltipContent(root)) {
		candidates.push(root);
	}
	scope.querySelectorAll(ADMIN_SIDEBAR_TOOLTIP_SELECTOR).forEach((element) => {
		if (element._tippy || !adminSidebarTooltipContent(element)) {
			return;
		}
		candidates.push(element);
	});

	if (!candidates.length) {
		return;
	}

	tippy(candidates, {
		placement: "right",
		arrow: true,
		delay: [0, 0],
		duration: [100, 80],
		content(reference) {
			return adminSidebarTooltipContent(reference);
		},
		onShow(instance) {
			instance.setContent(adminSidebarTooltipContent(instance.reference));
		},
	});
}

export function HookupRBChange(target, action) {
	if (!(target instanceof HTMLElement)) {
		console.warn("Target must be an HTMLElement.");
		return;
	}
	if (typeof action !== "function") {
		console.warn("Action must be a function.");
		return;
	}
	const btns = target.querySelectorAll("reset-button");
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
