export class EditPage extends HTMLElement {
	constructor() {
		super();
		this._isSaving = false;
		this._statusEl = null;
		this._handleFormSubmit = this._handleFormSubmit.bind(this);
	}

	connectedCallback() {
		setTimeout(() => {
			this._statusEl = this.querySelector(".save-feedback");
			this._initializeForms();
			this._setupCancelLinks();
			this._setupDelete();
			this._setupLinkedDataRefresh();
			this._setupStatusSelect();
		}, 0);
	}

	disconnectedCallback() {
		this.querySelectorAll("form.form-with-action-bar").forEach((form) => {
			form.removeEventListener("submit", this._handleFormSubmit);
			delete form.dataset.editPageSaveBound;
		});
	}

	_initializeForms() {
		this.querySelectorAll("form").forEach((form) => {
			if (!(form instanceof HTMLFormElement)) {
				return;
			}
			if (typeof window.FormLoad === "function") {
				window.FormLoad(form);
			}
			if (form.classList.contains("form-with-action-bar") && form.dataset.editPageSaveBound !== "true") {
				form.dataset.editPageSaveBound = "true";
				form.addEventListener("submit", this._handleFormSubmit);
			}
		});
	}

	_setupCancelLinks() {
		const links = this.querySelectorAll("[data-role='cancel-link']");
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

	async _handleFormSubmit(event) {
		const form = event.currentTarget;
		if (!(form instanceof HTMLFormElement)) {
			return;
		}
		if (this._isSaving) {
			event.preventDefault();
			return;
		}

		const submitter = event.submitter instanceof HTMLElement ? event.submitter : null;
		const saveAction = submitter?.getAttribute("name") === "save_action" ? submitter.getAttribute("value") || "" : "";
		const isViewAction = saveAction === "view";
		const viewRedirectUrl = isViewAction ? (submitter?.dataset?.redirectUrl || "").trim() : "";

		event.preventDefault();
		this._isSaving = true;
		this._setFormSavingState(form, submitter, true);

		try {
			const response = await fetch(form.action || window.location.href, {
				method: (form.method || "POST").toUpperCase(),
				body: this._buildFormData(form, submitter),
				credentials: "same-origin",
			});
			const html = await response.text();
			const replacement = this._extractReplacementPage(html);

			if (!replacement) {
				window.location.assign(viewRedirectUrl || response.url || form.action || window.location.href);
				return;
			}

			if (isViewAction && response.redirected) {
				window.location.assign(viewRedirectUrl || response.url);
				return;
			}

			if (response.redirected) {
				window.history.replaceState(null, "", response.url);
			}

			const toastEl = replacement.querySelector("[data-toast]");
			this.replaceWith(replacement);
			if (toastEl) {
				window.showToast?.(toastEl.dataset.toastMessage, toastEl.dataset.toast);
			}
		} catch (error) {
			console.error("EditPage save failed", error);
			window.location.assign(form.action || window.location.href);
		} finally {
			this._isSaving = false;
			this._setFormSavingState(form, submitter, false);
		}
	}

	_buildFormData(form, submitter) {
		let formData;
		try {
			formData = submitter ? new FormData(form, submitter) : new FormData(form);
		} catch {
			formData = new FormData(form);
			if (submitter?.getAttribute("name")) {
				formData.append(submitter.getAttribute("name"), submitter.getAttribute("value") || "");
			}
		}
		return formData;
	}

	_extractReplacementPage(html) {
		if (!html) {
			return null;
		}
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		return doc.querySelector("edit-page");
	}

	_setFormSavingState(form, submitter, isSaving) {
		const controls = form.querySelectorAll("button, input[type='submit']");
		controls.forEach((control) => {
			if (!(control instanceof HTMLButtonElement || control instanceof HTMLInputElement)) {
				return;
			}
			if (isSaving) {
				if (!control.disabled) {
					control.dataset.editPageDisabled = "true";
					control.disabled = true;
				}
				return;
			}
			if (control.dataset.editPageDisabled === "true") {
				control.disabled = false;
				delete control.dataset.editPageDisabled;
			}
		});

		if (!submitter) {
			return;
		}
		const label = submitter.querySelector?.("span");
		if (!(label instanceof HTMLElement)) {
			return;
		}
		if (isSaving) {
			if (!label.dataset.originalText) {
				label.dataset.originalText = label.textContent || "";
			}
			label.textContent = "Speichern...";
			return;
		}
		if (label.dataset.originalText) {
			label.textContent = label.dataset.originalText;
			delete label.dataset.originalText;
		}
	}

	_setupStatusSelect() {
		const statusSelects = Array.from(this.querySelectorAll(".status-select"));
		if (statusSelects.length === 0) {
			return;
		}
		statusSelects.forEach((statusSelect) => {
			const statusIcon = statusSelect.parentElement?.querySelector(".status-icon");
			statusSelect.addEventListener("change", (event) => {
				const newStatus = event.target.value;
				statusSelect.setAttribute("data-status", newStatus);
				if (statusIcon) {
					this._updateStatusIcon(statusIcon, newStatus);
				}
			});
		});
	}

	_updateStatusIcon(iconElement, status) {
		// Remove all status icon classes
		iconElement.classList.remove(
			"ri-checkbox-circle-line",
			"ri-information-line",
			"ri-search-line",
			"ri-list-check",
			"ri-forbid-2-line"
		);
		// Add the appropriate icon class
		switch (status) {
			case "Edited":
				iconElement.classList.add("ri-checkbox-circle-line");
				break;
			case "Seen":
				iconElement.classList.add("ri-information-line");
				break;
			case "Review":
				iconElement.classList.add("ri-search-line");
				break;
			case "ToDo":
				iconElement.classList.add("ri-list-check");
				break;
			case "Unknown":
			default:
				iconElement.classList.add("ri-forbid-2-line");
				break;
		}
	}

	_clearStatus() {
		if (!this._statusEl) {
			return;
		}
		this._statusEl.textContent = "";
		this._statusEl.classList.remove("text-red-700", "text-green-700", "save-feedback-error", "save-feedback-success");
		this._statusEl.classList.remove("is-hidden", "is-hiding");
		delete this._statusEl.dataset.autohideScheduled;
		this._statusEl.classList.add("hidden");
	}

	_showStatus(message, type) {
		if (!this._statusEl) {
			return;
		}
		this._clearStatus();
		this._statusEl.textContent = message;
		this._statusEl.classList.remove("hidden");
		this._statusEl.classList.remove("is-hidden");
		if (type === "success") {
			this._statusEl.classList.add("text-green-700", "save-feedback-success");
		} else if (type === "error") {
			this._statusEl.classList.add("text-red-700", "save-feedback-error");
		}
		if (type === "success") {
			const el = this._statusEl;
			if (el.dataset.autohideScheduled === "true") {
				return;
			}
			el.dataset.autohideScheduled = "true";
			setTimeout(() => {
				el.classList.add("is-hiding");
				setTimeout(() => {
					el.classList.add("is-hidden");
					el.classList.remove("is-hiding");
					delete el.dataset.autohideScheduled;
				}, 320);
			}, 2000);
		}
	}

	_setupDelete() {
		const form = this.querySelector("form");
		if (!form) {
			return;
		}
		const deleteEndpoint = form.getAttribute("data-delete-endpoint");
		if (!deleteEndpoint) {
			return;
		}
		const dialog = this.querySelector("[data-role='edit-delete-dialog']");
		const deleteButton = this.querySelector("[data-role='edit-delete']");
		const confirmButton = this.querySelector("[data-role='edit-delete-confirm']");
		const cancelButton = this.querySelector("[data-role='edit-delete-cancel']");

		if (!dialog || !deleteButton || !confirmButton || !cancelButton) {
			return;
		}

		deleteButton.addEventListener("click", (event) => {
			event.preventDefault();
			if (typeof dialog.showModal === "function") {
				dialog.showModal();
			}
		});

		const closeDialog = (event) => {
			if (event) {
				event.preventDefault();
			}
			if (dialog.open) {
				dialog.close();
			}
		};

		cancelButton.addEventListener("click", closeDialog);
		dialog.addEventListener("cancel", closeDialog);

		confirmButton.addEventListener("click", async (event) => {
			event.preventDefault();
			closeDialog();
			const formData = new FormData(form);
			const payload = {
				csrf_token: formData.get("csrf_token") || "",
			};
			const response = await fetch(deleteEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(payload),
			});
			if (!response.ok) {
				return;
			}
			const data = await response.json().catch(() => null);
			const redirect = data?.redirect || "/";
			window.location.assign(redirect);
		});
	}

	_setupLinkedDataRefresh() {
		const form = this.querySelector("form.form-with-action-bar");
		const button = this.querySelector("[data-role='linked-data-refresh']");
		const uriInput = this.querySelector("[data-role='linked-data-uri-input']");
		if (!(form instanceof HTMLFormElement) || !(button instanceof HTMLButtonElement) || !(uriInput instanceof HTMLInputElement)) {
			return;
		}
		if (button.dataset.refreshBound === "true") {
			return;
		}
		button.dataset.refreshBound = "true";

		const endpoint = (button.getAttribute("data-refresh-endpoint") || "").trim();
		const csrfInput = form.querySelector("[name='csrf_token']");
		if (!(csrfInput instanceof HTMLInputElement) || !endpoint) {
			button.classList.add("hidden");
			return;
		}

		let originalURI = (button.getAttribute("data-original-uri") || "").trim();
		const supportsRefresh = () => button.getAttribute("data-supported") === "true";
		const syncVisibility = () => {
			const currentURI = (uriInput.value || "").trim();
			const shouldShow = supportsRefresh() && currentURI === originalURI;
			button.classList.toggle("hidden", !shouldShow);
		};
		const setLoading = (isLoading) => {
			button.disabled = isLoading;
			button.classList.toggle("is-refreshing", isLoading);
			button.classList.toggle("opacity-70", isLoading);
			button.classList.toggle("pointer-events-none", isLoading);
			const icon = button.querySelector("i");
			if (!(icon instanceof HTMLElement)) {
				return;
			}
			if (isLoading) {
				if (!icon.dataset.originalClass) {
					icon.dataset.originalClass = icon.className;
				}
				icon.className = "ri-loader-4-line spinning";
				return;
			}
			if (icon.dataset.originalClass) {
				icon.className = icon.dataset.originalClass;
				delete icon.dataset.originalClass;
			}
		};

		const handleURIChange = () => {
			syncVisibility();
		};

		uriInput.addEventListener("input", handleURIChange);
		uriInput.addEventListener("change", handleURIChange);

		button.addEventListener("click", async (event) => {
			event.preventDefault();
			if (this._isSaving || button.classList.contains("hidden")) {
				return;
			}

			const requestOriginalURI = originalURI;
			this._clearStatus();
			setLoading(true);

			try {
				const response = await fetch(endpoint, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({
						csrf_token: csrfInput.value || "",
					}),
					credentials: "same-origin",
				});
				const data = await response.json().catch(() => null);
				if (!response.ok || !data?.success) {
					throw new Error(data?.error || "Verknüpfte Daten konnten nicht aktualisiert werden.");
				}

				const refreshedURI = typeof data.uri === "string" ? data.uri.trim() : requestOriginalURI;
				const currentURI = (uriInput.value || "").trim();
				if (currentURI === requestOriginalURI) {
					uriInput.value = refreshedURI;
				}

				originalURI = refreshedURI;
				button.setAttribute("data-original-uri", refreshedURI);
				if (typeof data.can_refresh_linked_data === "boolean") {
					button.setAttribute("data-supported", data.can_refresh_linked_data ? "true" : "false");
				}
				syncVisibility();
				this._showStatus(data.message || "Verknüpfte Daten aktualisiert.", "success");
			} catch (error) {
				this._showStatus(error instanceof Error ? error.message : "Verknüpfte Daten konnten nicht aktualisiert werden.", "error");
			} finally {
				setLoading(false);
				syncVisibility();
			}
		});

		syncVisibility();
	}
}
