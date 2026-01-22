const PREFERRED_SERIES_RELATION = "Bevorzugter Reihentitel";

export class AlmanachEditPage extends HTMLElement {
	constructor() {
		super();
		this._pendingAgent = null;
		this._form = null;
		this._saveButton = null;
		this._resetButton = null;
		this._deleteButton = null;
		this._deleteDialog = null;
		this._deleteConfirmButton = null;
		this._deleteCancelButton = null;
		this._statusEl = null;
		this._saveEndpoint = "";
		this._deleteEndpoint = "";
		this._isSaving = false;
		this._preferredSeriesRelationId = "";
		this._preferredSeriesSeriesId = "";
		this._handleSaveClick = this._handleSaveClick.bind(this);
		this._handleResetClick = this._handleResetClick.bind(this);
		this._handleDeleteClick = this._handleDeleteClick.bind(this);
		this._handleDeleteConfirmClick = this._handleDeleteConfirmClick.bind(this);
		this._handleDeleteCancelClick = this._handleDeleteCancelClick.bind(this);
	}

	connectedCallback() {
		// Small delay to ensure main.js has loaded
		setTimeout(() => {
			this._initForm();
			this._initPlaces();
			this._initPreferredSeries();
			this._initSaveHandling();
			this._initStatusSelect();
		}, 0);
	}

	_initStatusSelect() {
		const statusSelect = this.querySelector(".status-select");
		if (!statusSelect) {
			return;
		}
		const statusIcon = this.querySelector(".status-icon");
		statusSelect.addEventListener("change", (event) => {
			const newStatus = event.target.value;
			statusSelect.setAttribute("data-status", newStatus);
			if (statusIcon) {
				this._updateStatusIcon(statusIcon, newStatus);
			}
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

	disconnectedCallback() {
		this._teardownSaveHandling();
	}

	_initForm() {
		console.log("AlmanachEditPage: _initForm called");
		const form = this.querySelector("#changealmanachform");
		console.log("Form found:", !!form, "FormLoad exists:", typeof window.FormLoad === "function");
		if (form && typeof window.FormLoad === "function") {
			window.FormLoad(form);
		} else {
			console.error("Cannot initialize form - form or FormLoad missing");
		}
	}

	_parseJSONAttr(element, name) {
		if (!element) {
			return null;
		}
		const raw = element.getAttribute(name);
		if (!raw) {
			return null;
		}
		try {
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}

		_initPlaces() {
			const placesSelect = this.querySelector("#places");
			if (!placesSelect) {
				return;
			}
			const applyInitial = () => {
				const initialPlaces = this._parseJSONAttr(placesSelect, "data-initial-options") || [];
				const initialPlaceIds = this._parseJSONAttr(placesSelect, "data-initial-values") || [];
				if (initialPlaces.length > 0 && typeof placesSelect.setOptions === "function") {
					placesSelect.setOptions(initialPlaces);
				}
				if (initialPlaceIds.length > 0) {
					placesSelect.value = initialPlaceIds;
					if (typeof placesSelect.captureInitialSelection === "function") {
						placesSelect.captureInitialSelection();
					}
				}
			};

			if (typeof placesSelect.setOptions === "function") {
				applyInitial();
				return;
			}

			if (typeof window.customElements?.whenDefined === "function") {
				window.customElements.whenDefined("multi-select-simple").then(() => {
					requestAnimationFrame(() => applyInitial());
				});
			}
		}

	_initSaveHandling() {
		this._teardownSaveHandling();
		this._form = this.querySelector("#changealmanachform");
		this._saveButton = this.querySelector("[data-role='almanach-save']");
		this._resetButton = this.querySelector("[data-role='almanach-reset']");
		this._deleteButton = this.querySelector("[data-role='almanach-delete']");
		this._deleteDialog = this.querySelector("[data-role='almanach-delete-dialog']");
		this._deleteConfirmButton = this.querySelector("[data-role='almanach-delete-confirm']");
		this._deleteCancelButton = this.querySelector("[data-role='almanach-delete-cancel']");
		this._statusEl = this.querySelector("#almanach-save-feedback");
		if (!this._form || !this._saveButton) {
			return;
		}
		this._saveEndpoint = this._form.getAttribute("data-save-endpoint") || this._deriveSaveEndpoint();
		this._deleteEndpoint = this._form.getAttribute("data-delete-endpoint") || "";
		this._saveButton.addEventListener("click", this._handleSaveClick);
		if (this._resetButton) {
			this._resetButton.addEventListener("click", this._handleResetClick);
		}
		if (this._deleteButton) {
			this._deleteButton.addEventListener("click", this._handleDeleteClick);
		}
		if (this._deleteConfirmButton) {
			this._deleteConfirmButton.addEventListener("click", this._handleDeleteConfirmClick);
		}
		if (this._deleteCancelButton) {
			this._deleteCancelButton.addEventListener("click", this._handleDeleteCancelClick);
		}
		if (this._deleteDialog) {
			this._deleteDialog.addEventListener("cancel", this._handleDeleteCancelClick);
		}
	}

	_initPreferredSeries() {
		const preferredSelect = this.querySelector("#preferred-series-field");
		if (!preferredSelect) {
			return;
		}
		this._preferredSeriesRelationId = preferredSelect.getAttribute("data-preferred-relation-id") || "";
		this._preferredSeriesSeriesId = preferredSelect.getAttribute("data-preferred-series-id") || "";
	}


	_teardownSaveHandling() {
		if (this._saveButton) {
			this._saveButton.removeEventListener("click", this._handleSaveClick);
		}
		if (this._resetButton) {
			this._resetButton.removeEventListener("click", this._handleResetClick);
		}
		if (this._deleteButton) {
			this._deleteButton.removeEventListener("click", this._handleDeleteClick);
		}
		if (this._deleteConfirmButton) {
			this._deleteConfirmButton.removeEventListener("click", this._handleDeleteConfirmClick);
		}
		if (this._deleteCancelButton) {
			this._deleteCancelButton.removeEventListener("click", this._handleDeleteCancelClick);
		}
		if (this._deleteDialog) {
			this._deleteDialog.removeEventListener("cancel", this._handleDeleteCancelClick);
		}
		this._saveButton = null;
		this._resetButton = null;
		this._deleteButton = null;
		this._deleteDialog = null;
		this._deleteConfirmButton = null;
		this._deleteCancelButton = null;
		this._statusEl = null;
	}

	_deriveSaveEndpoint() {
		if (!window?.location?.pathname) {
			return "/almanach/save";
		}
		const path = window.location.pathname.endsWith("/")
			? window.location.pathname.slice(0, -1)
			: window.location.pathname;
		return `${path}/save`;
	}

	async _handleSaveClick(event) {
		event.preventDefault();
		if (this._isSaving) {
			return;
		}
		this._clearStatus();
		let payload;
		try {
			payload = this._buildPayload();
		} catch (error) {
			this._showStatus(error instanceof Error ? error.message : String(error), "error");
			return;
		}
		this._setSavingState(true);
		try {
			const response = await fetch(this._saveEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(payload),
			});

			let data = null;
			try {
				data = await response.clone().json();
			} catch {
				data = null;
			}

			if (!response.ok) {
				const message = data?.error || `Speichern fehlgeschlagen (${response.status}).`;
				throw new Error(message);
			}

			if (data?.redirect) {
				window.location.assign(data.redirect);
				return;
			}

			await this._reloadForm(data?.message || "Änderungen gespeichert.");
			this._clearStatus();
		} catch (error) {
			this._showStatus(error instanceof Error ? error.message : "Speichern fehlgeschlagen.", "error");
		} finally {
			this._setSavingState(false);
		}
	}

	async _handleResetClick(event) {
		event.preventDefault();
		if (this._isSaving) {
			return;
		}
		this._clearStatus();
		try {
			await this._reloadForm("");
		} catch (error) {
			this._showStatus(error instanceof Error ? error.message : "Formular konnte nicht aktualisiert werden.", "error");
		}
	}

	async _handleDeleteClick(event) {
		event.preventDefault();
		if (this._isSaving) {
			return;
		}
		if (this._deleteDialog && typeof this._deleteDialog.showModal === "function") {
			this._deleteDialog.showModal();
		}
	}

	_handleDeleteCancelClick(event) {
		if (event) {
			event.preventDefault();
		}
		if (this._deleteDialog && this._deleteDialog.open) {
			this._deleteDialog.close();
		}
	}

	async _handleDeleteConfirmClick(event) {
		event.preventDefault();
		if (!this._form || !this._deleteEndpoint || this._isSaving) {
			return;
		}
		if (this._deleteDialog && this._deleteDialog.open) {
			this._deleteDialog.close();
		}
		this._clearStatus();
		this._setSavingState(true);
		try {
			const formData = new FormData(this._form);
			const payload = {
				csrf_token: this._readValue(formData, "csrf_token"),
				last_edited: this._readValue(formData, "last_edited"),
			};
			const response = await fetch(this._deleteEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(payload),
			});
			let data = null;
			try {
				data = await response.clone().json();
			} catch {
				data = null;
			}
			if (!response.ok) {
				const message = data?.error || `Löschen fehlgeschlagen (${response.status}).`;
				throw new Error(message);
			}
			const redirect = data?.redirect || "/suche/baende";
			window.location.assign(redirect);
		} catch (error) {
			this._showStatus(error instanceof Error ? error.message : "Löschen fehlgeschlagen.", "error");
		} finally {
			this._setSavingState(false);
		}
	}

	_buildPayload() {
		if (!this._form) {
			throw new Error("Formular konnte nicht gefunden werden.");
		}
		const formData = new FormData(this._form);
		const entry = {
			preferred_title: this._readValue(formData, "preferred_title"),
			title: this._readValue(formData, "title"),
			parallel_title: this._readValue(formData, "paralleltitle"),
			subtitle: this._readValue(formData, "subtitle"),
			variant_title: this._readValue(formData, "varianttitle"),
			incipit: this._readValue(formData, "incipit"),
			responsibility_statement: this._readValue(formData, "responsibility_statement"),
			publication_statement: this._readValue(formData, "publication_statement"),
			place_statement: this._readValue(formData, "place_statement"),
			edition: this._readValue(formData, "edition"),
			annotation: this._readValue(formData, "annotation"),
			edit_comment: this._readValue(formData, "edit_comment"),
			extent: this._readValue(formData, "extent"),
			dimensions: this._readValue(formData, "dimensions"),
			references: this._readValue(formData, "refs"),
			status: this._readValue(formData, "type"),
		};

		if (!entry.preferred_title) {
			throw new Error("Kurztitel ist erforderlich.");
		}

		const yearValue = this._readValue(formData, "year");
		if (yearValue === "") {
			throw new Error("Jahr muss angegeben werden (0 ist erlaubt).");
		}
		const parsedYear = Number.parseInt(yearValue, 10);
		if (Number.isNaN(parsedYear)) {
			throw new Error("Jahr ist ungültig.");
		}
		entry.year = parsedYear;

		const languages = formData.getAll("languages[]").map((value) => value.trim()).filter(Boolean);
		const places = formData.getAll("places[]").map((value) => value.trim()).filter(Boolean);
		const { items, removedIds } = this._collectItems(formData);
		const {
			relations: seriesRelations,
			deleted: deletedSeriesRelationIds,
		} = this._collectRelations(formData, {
			prefix: "entries_series",
			targetField: "series",
		});
		const newSeriesRelations = this._collectNewRelations("entries_series");
		const preferredSeriesId = this._readValue(formData, "preferred_series_id");
		if (!preferredSeriesId) {
			throw new Error("Reihentitel ist erforderlich.");
		}

		const applyPreferred = (relation) => {
			relation.type = PREFERRED_SERIES_RELATION;
			relation.uncertain = false;
		};

		let preferredApplied = false;
		seriesRelations.forEach((relation) => {
			if (relation.target_id === preferredSeriesId) {
				applyPreferred(relation);
				preferredApplied = true;
			}
		});
		newSeriesRelations.forEach((relation) => {
			if (relation.target_id === preferredSeriesId) {
				applyPreferred(relation);
				preferredApplied = true;
			}
		});
		if (!preferredApplied) {
			if (this._preferredSeriesRelationId && this._preferredSeriesSeriesId === preferredSeriesId) {
				seriesRelations.push({
					id: this._preferredSeriesRelationId,
					target_id: preferredSeriesId,
					type: PREFERRED_SERIES_RELATION,
					uncertain: false,
				});
			} else {
				newSeriesRelations.push({
					target_id: preferredSeriesId,
					type: PREFERRED_SERIES_RELATION,
					uncertain: false,
				});
			}
		}

		if (
			this._preferredSeriesRelationId &&
			this._preferredSeriesSeriesId &&
			this._preferredSeriesSeriesId !== preferredSeriesId &&
			!deletedSeriesRelationIds.includes(this._preferredSeriesRelationId)
		) {
			deletedSeriesRelationIds.push(this._preferredSeriesRelationId);
		}
		const preferredCount = [...seriesRelations, ...newSeriesRelations].filter(
			(relation) => relation.type === PREFERRED_SERIES_RELATION,
		).length;
		if (preferredCount === 0) {
			throw new Error("Mindestens ein bevorzugter Reihentitel muss verknüpft sein.");
		}
		if (preferredCount > 1) {
			throw new Error("Es darf nur ein bevorzugter Reihentitel gesetzt sein.");
		}

		const {
			relations: agentRelations,
			deleted: deletedAgentRelationIds,
		} = this._collectRelations(formData, {
			prefix: "entries_agents",
			targetField: "agent",
		});
		const newAgentRelations = this._collectNewRelations("entries_agents");

		// Validate no duplicate series relations
		const allSeriesRelations = [...seriesRelations, ...newSeriesRelations];
		const seriesTargetIds = allSeriesRelations.map((r) => r.target_id);
		const duplicateSeries = seriesTargetIds.filter((id, index) => seriesTargetIds.indexOf(id) !== index);
		if (duplicateSeries.length > 0) {
			throw new Error("Doppelte Reihenverknüpfungen sind nicht erlaubt.");
		}

		return {
			csrf_token: this._readValue(formData, "csrf_token"),
			last_edited: this._readValue(formData, "last_edited"),
			entry,
			languages,
			places,
			items,
			deleted_item_ids: removedIds,
			series_relations: seriesRelations,
			new_series_relations: newSeriesRelations,
			deleted_series_relation_ids: deletedSeriesRelationIds,
			agent_relations: agentRelations,
			new_agent_relations: newAgentRelations,
			deleted_agent_relation_ids: deletedAgentRelationIds,
		};
	}

	_collectItems(formData) {
		const ids = formData.getAll("items_id[]").map((value) => value.trim());
		const owners = formData.getAll("items_owner[]");
		const identifiers = formData.getAll("items_identifier[]");
		const locations = formData.getAll("items_location[]");
		const media = formData.getAll("items_media[]");
		const annotations = formData.getAll("items_annotation[]");
		const uris = formData.getAll("items_uri[]");
		const removed = new Set(
			formData
				.getAll("items_removed[]")
				.map((value) => value.trim())
				.filter(Boolean),
		);
		const items = [];
		for (let index = 0; index < ids.length; index += 1) {
			const id = ids[index] || "";
			if (id && removed.has(id)) {
				continue;
			}
			const owner = (owners[index] || "").trim();
			const identifier = (identifiers[index] || "").trim();
			const location = (locations[index] || "").trim();
			const annotation = (annotations[index] || "").trim();
			const uri = (uris[index] || "").trim();
			const mediaValue = (media[index] || "").trim();
			const hasValues = id || owner || identifier || location || annotation || uri || mediaValue;
			if (!hasValues) {
				continue;
			}
			// Validate that media field is not empty
			if (!mediaValue) {
				throw new Error(`Exemplar ${index + 1}: "Vorhanden als" muss ausgefüllt werden.`);
			}
			items.push({
				id,
				owner,
				identifier,
				location,
				annotation,
				uri,
				media: mediaValue ? [mediaValue] : [],
			});
		}
		return {
			items,
			removedIds: Array.from(removed),
		};
	}

	_collectRelations(formData, { prefix, targetField }) {
		const relations = [];
		const deleted = [];

		// Iterate over ID fields instead of type fields (IDs are always submitted even when disabled)
		for (const [key, value] of formData.entries()) {
			if (!key.startsWith(`${prefix}_id[`)) {
				continue;
			}
			const relationKey = key.slice(key.indexOf("[") + 1, -1);
			const targetKey = `${prefix}_${targetField}[${relationKey}]`;
			const typeKey = `${prefix}_type[${relationKey}]`;
			const deleteKey = `${prefix}_delete[${relationKey}]`;
			const uncertainKey = `${prefix}_uncertain[${relationKey}]`;

			const relationId = (value || "").trim();
			const targetId = (formData.get(targetKey) || "").trim();

			if (!targetId || !relationId) {
				continue;
			}

			// Check if marked for deletion
			if (formData.has(deleteKey)) {
				deleted.push(relationId);
				continue;
			}

			// Not deleted, add to relations
			const type = (formData.get(typeKey) || "").trim();
			relations.push({
				id: relationId,
				target_id: targetId,
				type: type,
				uncertain: formData.has(uncertainKey),
			});
		}
		return { relations, deleted };
	}

	_collectNewRelations(prefix) {
		const editor = this.querySelector(`relations-editor[data-prefix='${prefix}']`);
		if (!editor) {
			return [];
		}
		const newRows = editor.querySelectorAll("[data-role='relation-add-row'] [data-rel-row]");
		const relations = [];
		newRows.forEach((row) => {
			const idInput = row.querySelector(`input[name='${prefix}_new_id']`);
			const typeInput = row.querySelector(`select[name='${prefix}_new_type']`);
			const uncertainInput = row.querySelector(`input[name='${prefix}_new_uncertain']`);
			if (!idInput) {
				return;
			}
			const targetId = idInput.value.trim();
			if (!targetId) {
				return;
			}
			relations.push({
				target_id: targetId,
				type: (typeInput?.value || "").trim(),
				uncertain: Boolean(uncertainInput?.checked),
			});
		});
		return relations;
	}

	_readValue(formData, field) {
		const value = formData.get(field);
		return value ? String(value).trim() : "";
	}

	_setSavingState(isSaving) {
		this._isSaving = isSaving;
		if (!this._saveButton) {
			return;
		}
		this._saveButton.disabled = isSaving;
		const label = this._saveButton.querySelector("span");
		if (label) {
			label.textContent = isSaving ? "Speichern..." : "Speichern";
		}
		if (this._resetButton) {
			this._resetButton.disabled = isSaving;
		}
		if (this._deleteButton) {
			this._deleteButton.disabled = isSaving;
		}
	}

	_clearStatus() {
		if (!this._statusEl) {
			return;
		}
		this._statusEl.textContent = "";
		this._statusEl.classList.remove("text-red-700", "text-green-700", "save-feedback-error", "save-feedback-success");
		this._statusEl.classList.add("hidden");
	}

	_showStatus(message, type) {
		if (!this._statusEl) {
			return;
		}
		this._clearStatus();
		this._statusEl.textContent = message;
		this._statusEl.classList.remove("hidden");
		if (type === "success") {
			this._statusEl.classList.add("text-green-700", "save-feedback-success");
		} else if (type === "error") {
			this._statusEl.classList.add("text-red-700", "save-feedback-error");
		}
	}

	async _reloadForm(successMessage) {
		this._teardownSaveHandling();
		const targetUrl = new URL(window.location.href);
		if (successMessage) {
			targetUrl.searchParams.set("saved_message", successMessage);
		} else {
			targetUrl.searchParams.delete("saved_message");
		}

		const response = await fetch(targetUrl.toString(), {
			headers: {
				"X-Requested-With": "fetch",
			},
		});
		if (!response.ok) {
			throw new Error("Formular konnte nicht aktualisiert werden.");
		}

		const html = await response.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");

		const newForm = doc.querySelector("#changealmanachform");
		const currentForm = this.querySelector("#changealmanachform");
		if (!newForm || !currentForm) {
			throw new Error("Formular konnte nicht geladen werden.");
		}
		currentForm.replaceWith(newForm);
		this._form = newForm;

		const newMessage = doc.querySelector("#user-message");
		const currentMessage = this.querySelector("#user-message");
		if (newMessage && currentMessage) {
			currentMessage.replaceWith(newMessage);
		}

		const newHeader = doc.querySelector("#almanach-header-data");
		const currentHeader = this.querySelector("#almanach-header-data");
		if (newHeader && currentHeader) {
			currentHeader.replaceWith(newHeader);
		}

		this._initForm();
		this._initPlaces();
		this._initSaveHandling();

		// Resize all textareas after reload
		if (typeof window.TextareaAutoResize === "function") {
			setTimeout(() => {
				this.querySelectorAll("textarea").forEach((textarea) => {
					window.TextareaAutoResize(textarea);
				});
			}, 100);
		}
	}

}
