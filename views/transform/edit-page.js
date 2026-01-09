export class EditPage extends HTMLElement {
	connectedCallback() {
		setTimeout(() => {
			const form = this.querySelector("form");
			if (form && typeof window.FormLoad === "function") {
				window.FormLoad(form);
			}
			this._setupDelete();
		}, 0);
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
