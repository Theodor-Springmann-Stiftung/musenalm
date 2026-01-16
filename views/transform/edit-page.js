export class EditPage extends HTMLElement {
	connectedCallback() {
		setTimeout(() => {
			const form = this.querySelector("form");
			if (form && typeof window.FormLoad === "function") {
				window.FormLoad(form);
			}
			this._setupDelete();
			this._setupStatusSelect();
		}, 0);
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
				last_edited: formData.get("last_edited") || "",
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
