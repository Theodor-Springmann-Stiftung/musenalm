export class ExportManager extends HTMLElement {
	constructor() {
		super();
		this.listUrl = "";
		this.runUrl = "";
		this.deleteUrl = "";
		this.fts5RebuildUrl = "";
		this.fts5StatusUrl = "";
		this.csrf = "";
		this.list = null;
		this.status = null;
		this.fts5Status = null;
		this.fts5Progress = null;
		this.fts5ProgressText = null;
		this.fts5ProgressPercent = null;
		this.fts5ProgressBar = null;
		this.pollTimer = null;
		this.pollIntervalMs = 2500;
	}

	connectedCallback() {
		this.listUrl = this.dataset.listUrl || "";
		this.runUrl = this.dataset.runUrl || "";
		this.deleteUrl = this.dataset.deleteUrl || "";
		this.fts5RebuildUrl = this.dataset.fts5RebuildUrl || "";
		this.fts5StatusUrl = this.dataset.fts5StatusUrl || "";
		this.csrf = this.dataset.csrf || "";
		this.list = this.querySelector("[data-role='export-list']");
		this.status = this.querySelector("[data-role='status']");
		this.fts5Status = this.querySelector("[data-role='fts5-status']");
		this.fts5Progress = this.querySelector("[data-role='fts5-progress']");
		this.fts5ProgressText = this.querySelector("[data-role='fts5-progress-text']");
		this.fts5ProgressPercent = this.querySelector("[data-role='fts5-progress-percent']");
		this.fts5ProgressBar = this.querySelector("[data-role='fts5-progress-bar']");
		this.fts5LastRebuild = this.querySelector("[data-role='fts5-last-rebuild']");
		this.fts5LastRebuildWrap = this.querySelector("[data-role='fts5-last-rebuild-wrap']");
		this.fts5Button = this.querySelector("[data-role='fts5-rebuild']");
		this.fts5ButtonLabel = this.querySelector("[data-role='fts5-rebuild-label']");
		this.fts5StatusValue = "idle";
		this.fts5HadRunning = false;

		this.addEventListener("click", (event) => this.handleAction(event));

		this.refreshList();
		this.refreshFts5Status();
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

			this.setStatus("Export läuft...");
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

		const fts5Target = event.target.closest("[data-role='fts5-rebuild']");
		if (fts5Target) {
			await this.handleFts5Rebuild(event);
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

	async refreshFts5Status() {
		if (!this.fts5StatusUrl) return;
		try {
			const response = await fetch(this.fts5StatusUrl, { credentials: "same-origin" });
			if (!response.ok) return;
			const json = await this.safeJson(response);
			if (!json) return;
			this.updateFts5Status(json);
			this.syncPollingState();
		} catch {
			// ignore refresh errors
		}
	}

	updateFts5Status(data) {
		if (!this.fts5Status) return;
		const prevStatus = this.fts5StatusValue;
		const status = this.normalizeText(data.status) || "idle";
		const message = this.normalizeText(data.message || "");
		const err = this.normalizeText(data.error || "");
		const done = Number.isFinite(data.done) ? data.done : 0;
		const total = Number.isFinite(data.total) ? data.total : 0;
		const lastRebuild = this.formatGermanDateTime(this.normalizeText(data.last_rebuild || ""));
		this.fts5StatusValue = status;

		this.fts5Status.classList.remove(
			"hidden",
			"text-slate-700",
			"text-green-800",
			"text-red-700",
			"text-amber-800",
			"bg-slate-50",
			"bg-green-50",
			"bg-red-50",
			"bg-amber-50",
			"border-slate-200",
			"border-green-200",
			"border-red-200",
			"border-amber-200",
		);
		if (status === "running" || status === "restarting") {
			this.fts5HadRunning = true;
		}

		if (status === "complete" && !this.fts5HadRunning) {
			this.fts5Status.textContent = "";
			this.fts5Status.classList.add("hidden");
		} else if (status === "error") {
			this.fts5Status.textContent = err || "FTS5-Neuaufbau fehlgeschlagen.";
			this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200");
		} else if (status === "aborted") {
			this.fts5Status.textContent = message || "FTS5-Neuaufbau abgebrochen.";
			this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200");
		} else if (status === "complete") {
			this.fts5Status.textContent = message || "FTS5-Neuaufbau abgeschlossen.";
			this.fts5Status.classList.add("text-green-800", "bg-green-50", "border-green-200");
		} else if (status === "restarting") {
			this.fts5Status.textContent = message || "FTS5-Neuaufbau wird neu gestartet.";
			this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200");
		} else if (status === "running") {
			this.fts5Status.textContent = message || "FTS5-Neuaufbau läuft.";
			this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200");
		} else {
			this.fts5Status.textContent = message || "";
			if (!this.fts5Status.textContent) {
				this.fts5Status.classList.add("hidden");
			} else {
				this.fts5Status.classList.add("text-slate-700", "bg-slate-50", "border-slate-200");
			}
		}
		if (this.fts5Status.textContent) {
			this.fts5Status.classList.remove("hidden");
		}

		if (this.fts5Progress) {
			if (status === "running" || status === "restarting") {
				this.fts5Progress.classList.remove("hidden");
			} else {
				this.fts5Progress.classList.add("hidden");
			}
		}

		if (this.fts5Button) {
			const isRunning = status === "running";
			if (this.fts5ButtonLabel) {
				this.fts5ButtonLabel.textContent = isRunning ? "Abbrechen & neu starten" : "Neuaufbau starten";
			}
			this.fts5Button.classList.toggle("bg-slate-900", !isRunning);
			this.fts5Button.classList.toggle("hover:bg-slate-800", !isRunning);
			this.fts5Button.classList.toggle("bg-amber-600", isRunning);
			this.fts5Button.classList.toggle("hover:bg-amber-700", isRunning);
		}

		if (this.fts5LastRebuild && lastRebuild) {
			this.fts5LastRebuild.textContent = lastRebuild;
			if (this.fts5LastRebuildWrap) {
				this.fts5LastRebuildWrap.classList.remove("hidden");
			}
		}

		if (prevStatus === "running" && status !== "running") {
			window.setTimeout(() => {
				this.refreshFts5Status();
			}, 500);
		}

		if ((status === "running" || status === "restarting") && total > 0) {
			const percent = Math.min(100, Math.round((done / total) * 100));
			if (this.fts5ProgressText) {
				this.fts5ProgressText.textContent = `${done} / ${total}`;
			}
			if (this.fts5ProgressPercent) {
				this.fts5ProgressPercent.textContent = `${percent}%`;
			}
			if (this.fts5ProgressBar) {
				this.fts5ProgressBar.style.width = `${percent}%`;
			}
		} else if (status === "running" || status === "restarting") {
			if (this.fts5ProgressText) {
				this.fts5ProgressText.textContent = "Wird vorbereitet...";
			}
			if (this.fts5ProgressPercent) {
				this.fts5ProgressPercent.textContent = "";
			}
			if (this.fts5ProgressBar) {
				this.fts5ProgressBar.style.width = "0%";
			}
		}
	}

	formatGermanDateTime(value) {
		const raw = String(value || "").trim();
		if (!raw) return "";
		const normalized = raw.replace(/^"+|"+$/g, "");
		const isoMatch = normalized.match(
			/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/,
		);
		if (!isoMatch) return normalized;
		const iso = normalized.replace(" ", "T");
		const date = new Date(iso);
		if (Number.isNaN(date.getTime())) return normalized;
		const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
		const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
		const day = date.getDate();
		const month = months[date.getMonth()];
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		return `${weekdays[date.getDay()]}, ${day}. ${month} ${year} ${hours}:${minutes}`;
	}

	syncPollingState() {
		const hasExports = this.list
			? this.list.querySelector("[data-export-status='running'], [data-export-status='queued']")
			: null;
		const fts5Running = this.fts5Progress && !this.fts5Progress.classList.contains("hidden");
		if (hasExports || fts5Running) {
			this.startPolling();
		} else {
			this.stopPolling();
		}
	}

	startPolling() {
		if (this.pollTimer) return;
		this.pollTimer = window.setInterval(() => {
			this.refreshList();
			this.refreshFts5Status();
		}, this.pollIntervalMs);
	}

	stopPolling() {
		if (!this.pollTimer) return;
		window.clearInterval(this.pollTimer);
		this.pollTimer = null;
	}

	async handleFts5Rebuild(event) {
		event.preventDefault();
		if (!this.fts5RebuildUrl) return;
		const button = event.target.closest("[data-role='fts5-rebuild']");
		if (button) button.disabled = true;
		if (this.fts5Status) {
			this.fts5Status.textContent = "FTS5-Neuaufbau wird gestartet...";
			this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800");
			this.fts5Status.classList.add("text-slate-700", "bg-slate-50", "border-slate-200");
		}
		if (this.fts5Progress) {
			this.fts5Progress.classList.remove("hidden");
		}
		if (this.fts5ProgressText) {
			this.fts5ProgressText.textContent = "Wird vorbereitet...";
		}
		if (this.fts5ProgressPercent) {
			this.fts5ProgressPercent.textContent = "";
		}
		if (this.fts5ProgressBar) {
			this.fts5ProgressBar.style.width = "0%";
		}

		const payload = new URLSearchParams();
		payload.set("csrf_token", this.getCsrfToken());

		try {
			const response = await fetch(this.fts5RebuildUrl, {
				method: "POST",
				body: payload,
				credentials: "same-origin",
			});
			if (!response.ok) {
				const message = await this.extractError(response);
				if (this.fts5Status) {
					this.fts5Status.textContent = message || "FTS5-Neuaufbau konnte nicht gestartet werden.";
					this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800");
					this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200");
				}
				return;
			}
			const json = await this.safeJson(response);
			if (json && json.error) {
				if (this.fts5Status) {
					this.fts5Status.textContent = json.error;
					this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800");
					this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200");
				}
				return;
			}
			this.fts5HadRunning = true;
			if (json && json.status === "restarting") {
				this.updateFts5Status({
					status: "restarting",
					message: "FTS5-Neuaufbau wird neu gestartet.",
				});
			}
			await this.refreshFts5Status();
			this.startPolling();
		} catch {
			if (this.fts5Status) {
				this.fts5Status.textContent = "FTS5-Neuaufbau konnte nicht gestartet werden.";
				this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800");
				this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200");
			}
		} finally {
			if (button) button.disabled = false;
		}
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

	normalizeText(value) {
		if (value == null) return "";
		let text = String(value).trim();
		if (text.length >= 2 && text.startsWith("\"") && text.endsWith("\"")) {
			text = text.slice(1, -1);
		}
		return text;
	}
}
