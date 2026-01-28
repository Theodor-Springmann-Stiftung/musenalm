export class ExportManager extends HTMLElement {
	constructor() {
		super();
		this.listUrl = "";
		this.runUrl = "";
		this.deleteUrl = "";
		this.csrf = "";
		this.list = null;
		this.status = null;
		this.pollTimer = null;
		this.pollIntervalMs = 2500;
	}

	connectedCallback() {
		this.listUrl = this.dataset.listUrl || "";
		this.runUrl = this.dataset.runUrl || "";
		this.deleteUrl = this.dataset.deleteUrl || "";
		this.csrf = this.dataset.csrf || "";
		this.list = this.querySelector("[data-role='export-list']");
		this.status = this.querySelector("[data-role='status']");

		this.addEventListener("click", (event) => this.handleAction(event));

		this.refreshList();
	}

	disconnectedCallback() {
		this.stopPolling();
	}

	setStatus(message, isError) {
		if (!this.status) return;
		this.status.textContent = message || "";
		this.status.classList.remove("text-red-600", "text-green-600");
		if (isError) {
			this.status.classList.add("text-red-600");
		} else if (message) {
			this.status.classList.add("text-green-600");
		}
	}

	async handleRun(event, exportType) {
		event.preventDefault();
		if (!this.runUrl) return;
		this.setStatus("Export wird gestartet...");
		const button = event.target.closest("[data-role='run-export']");
		if (button) button.disabled = true;

		const payload = new URLSearchParams();
		payload.set("csrf_token", this.getCsrfToken());
		payload.set("export_type", exportType || "data");

		try {
			const response = await fetch(this.runUrl, {
				method: "POST",
				body: payload,
				credentials: "same-origin",
			});

			if (!response.ok) {
				const message = await this.extractError(response);
				this.setStatus(message || "Export konnte nicht gestartet werden.", true);
				return;
			}

			const json = await this.safeJson(response);
			if (json && json.error) {
				this.setStatus(json.error, true);
				return;
			}

		this.setStatus("Export läuft im Hintergrund.");
			await this.refreshList();
			this.startPolling();
		} catch (err) {
			this.setStatus("Export konnte nicht gestartet werden.", true);
		} finally {
			if (button) button.disabled = false;
		}
	}

	async handleAction(event) {
		const runTarget = event.target.closest("[data-role='run-export']");
		if (runTarget) {
			const exportType = runTarget.getAttribute("data-export-type") || "data";
			await this.handleRun(event, exportType);
			return;
		}

		const target = event.target.closest("[data-action]");
		if (!target) return;
		const action = target.getAttribute("data-action");
		if (action === "delete") {
			const id = target.getAttribute("data-id");
			if (!id || !this.deleteUrl) return;
			const confirmed = confirm("Soll der Export wirklich gelöscht werden?");
			if (!confirmed) return;
			await this.deleteExport(id);
		}
	}

	async deleteExport(id) {
		const payload = new URLSearchParams();
		payload.set("csrf_token", this.getCsrfToken());
		try {
			const response = await fetch(`${this.deleteUrl}${id}`, {
				method: "POST",
				body: payload,
				credentials: "same-origin",
			});
			if (!response.ok) {
				const message = await this.extractError(response);
				this.setStatus(message || "Export konnte nicht gelöscht werden.", true);
				return;
			}
			const json = await this.safeJson(response);
			if (json && json.error) {
				this.setStatus(json.error, true);
				return;
			}
			this.setStatus("Export gelöscht.");
			await this.refreshList();
		} catch {
			this.setStatus("Export konnte nicht gelöscht werden.", true);
		}
	}

	async refreshList() {
		if (!this.list || !this.listUrl) return;
		try {
			const response = await fetch(this.listUrl, { credentials: "same-origin" });
			if (!response.ok) {
				return;
			}
			const html = await response.text();
			this.list.innerHTML = html;
			this.syncPollingState();
		} catch {
			// ignore refresh errors
		}
	}

	syncPollingState() {
		if (!this.list) return;
		const active = this.list.querySelector("[data-export-status='running'], [data-export-status='queued']");
		if (active) {
			this.startPolling();
		} else {
			this.stopPolling();
		}
	}

	startPolling() {
		if (this.pollTimer) return;
		this.pollTimer = window.setInterval(() => {
			this.refreshList();
		}, this.pollIntervalMs);
	}

	stopPolling() {
		if (!this.pollTimer) return;
		window.clearInterval(this.pollTimer);
		this.pollTimer = null;
	}

	async safeJson(response) {
		try {
			return await response.json();
		} catch {
			return null;
		}
	}

	async extractError(response) {
		try {
			const json = await response.json();
			if (json && json.error) {
				return json.error;
			}
		} catch {
			// ignore
		}
		try {
			return await response.text();
		} catch {
			return "";
		}
	}

	getCsrfToken() {
		if (this.csrf) return this.csrf;
		const fallback = document.querySelector("input[name='csrf_token']");
		if (fallback && fallback.value) {
			this.csrf = fallback.value;
		}
		return this.csrf;
	}
}
