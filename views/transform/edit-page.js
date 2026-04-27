export class EditPage extends HTMLElement {
	constructor() {
		super();
		this._isSaving = false;
		this._handleFormSubmit = this._handleFormSubmit.bind(this);
	}

	connectedCallback() {
		setTimeout(() => {
			this._initializeForms();
			this._setupCancelLinks();
			this._setupDelete();
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
				window.location.assign(response.url || form.action || window.location.href);
				return;
			}

			if (isViewAction && response.redirected) {
				window.location.assign(response.url);
				return;
			}

			if (response.redirected) {
				window.history.replaceState(null, "", response.url);
			}

			this.replaceWith(replacement);
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
}
