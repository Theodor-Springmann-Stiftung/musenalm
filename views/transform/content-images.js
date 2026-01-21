const CONTENT_IMAGES_LIST_ROLE = "content-images-list";
const CONTENT_IMAGES_DIALOG_ROLE = "content-images-dialog";
const CONTENT_IMAGES_CLOSE_ROLE = "content-images-close";
const CONTENT_IMAGES_FULL_ROLE = "content-images-full";
const CONTENT_IMAGES_DELETE_DIALOG_ROLE = "content-images-delete-dialog";
const CONTENT_IMAGES_DELETE_CONFIRM_ROLE = "content-images-delete-confirm";
const CONTENT_IMAGES_DELETE_CANCEL_ROLE = "content-images-delete-cancel";
const CONTENT_IMAGES_DELETE_NAME_ROLE = "content-images-delete-name";

const THUMB_PARAM = "300x0";
const FULL_PARAM = "0x1000";

const buildThumbUrl = (rawUrl, size) => {
	if (!rawUrl) {
		return "";
	}
	if (rawUrl.includes("thumb=")) {
		return rawUrl;
	}
	const separator = rawUrl.includes("?") ? "&" : "?";
	return `${rawUrl}${separator}thumb=${size}`;
};

const buildFullUrl = (rawUrl) => {
	return buildThumbUrl(rawUrl, FULL_PARAM);
};

const extractFileName = (rawUrl) => {
	if (!rawUrl) {
		return "";
	}
	const cleanUrl = rawUrl.split("?")[0] || "";
	const parts = cleanUrl.split("/");
	return parts[parts.length - 1] || "";
};

const normalizeImages = (rawImages, rawFiles) => {
	const files = Array.isArray(rawFiles) ? rawFiles : [];
	return (Array.isArray(rawImages) ? rawImages : []).map((item, index) => {
		if (typeof item === "string") {
			const name = files[index] || extractFileName(item);
			return { url: item, name };
		}
		if (item && typeof item === "object") {
			const url = item.url || "";
			const name = item.name || files[index] || extractFileName(url);
			return { url, name };
		}
		return { url: "", name: "" };
	});
};

export class ContentImages extends HTMLElement {
	connectedCallback() {
		if (this.dataset.init === "true") {
			return;
		}
		this.dataset.init = "true";
		this._pendingFiles = [];
		this._pendingUrls = [];
		this._pendingDeletes = new Set();
		this._pendingIds = [];
		this._pendingIdCounter = 0;
		this._scanOrder = [];

		this._wireUpload();

		const raw = this.getAttribute("data-images") || "[]";
		const rawFiles = this.getAttribute("data-files") || "[]";
		let images = [];
		let files = [];
		try {
			images = JSON.parse(raw);
		} catch {
			images = [];
		}
		try {
			files = JSON.parse(rawFiles);
		} catch {
			files = [];
		}

		const normalized = normalizeImages(images, files);

		this._render(normalized);
	}

	_wireUpload() {
		const panel = this.closest("[data-role='content-images-panel']");
		if (!panel) {
			return;
		}
		const uploadInput = panel.querySelector("[data-role='content-images-upload-input']");
		if (!uploadInput || uploadInput.dataset.bound === "true") {
			return;
		}
		uploadInput.dataset.bound = "true";
		uploadInput.addEventListener("change", () => {
			this._setPendingFiles(Array.from(uploadInput.files || []));
		});
	}

	_setPendingFiles(files) {
		const incoming = Array.isArray(files) ? files : [];
		if (incoming.length === 0) {
			return;
		}
		if (!Array.isArray(this._pendingFiles)) {
			this._pendingFiles = [];
		}
		if (!Array.isArray(this._pendingUrls)) {
			this._pendingUrls = [];
		}
		if (!Array.isArray(this._pendingIds)) {
			this._pendingIds = [];
		}
		const newIds = [];
		incoming.forEach((file) => {
			this._pendingFiles.push(file);
			this._pendingUrls.push(URL.createObjectURL(file));
			const id = `p${Date.now()}_${this._pendingIdCounter++}`;
			this._pendingIds.push(id);
			newIds.push(id);
		});
		if (!Array.isArray(this._scanOrder)) {
			this._scanOrder = [];
		}
		this._scanOrder = this._scanOrder.concat(newIds.map((id) => `pending:${id}`));
		this._render(this._currentImages || []);
	}

	_render(images) {
		this._currentImages = images;
		this.classList.add("block");
		this.style.display = "block";
		this.style.width = "100%";
		const list = this._ensureList();
		const uploadProxy = this._ensureUploadProxy();
		if (uploadProxy && uploadProxy.parentElement === list) {
			uploadProxy.remove();
		}
		list.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((node) => {
			node.remove();
		});

		const deleteEndpoint = this.getAttribute("data-delete-endpoint") || "";
		const contentId = this.getAttribute("data-content-id") || "";
		const csrfToken = this.getAttribute("data-csrf-token") || "";
		const canDelete = deleteEndpoint && contentId && csrfToken;

		const imagesByName = new Map();
		images.forEach((image) => {
			if (image && image.name) {
				imagesByName.set(image.name, image);
			}
		});

		if (!Array.isArray(this._scanOrder) || this._scanOrder.length === 0) {
			this._scanOrder = images.map((image) => `existing:${image.name}`);
			this._scanOrder = this._scanOrder.concat(this._pendingIds.map((id) => `pending:${id}`));
		}

		const pendingById = new Map();
		this._pendingIds.forEach((id, index) => {
			pendingById.set(id, { url: this._pendingUrls[index] });
		});

		const order = [];
		this._scanOrder.forEach((token) => {
			if (token.startsWith("existing:")) {
				const name = token.slice("existing:".length);
				if (imagesByName.has(name)) {
					order.push({ type: "existing", name, image: imagesByName.get(name) });
				}
				return;
			}
			if (token.startsWith("pending:")) {
				const id = token.slice("pending:".length);
				if (pendingById.has(id)) {
					order.push({ type: "pending", id, url: pendingById.get(id).url });
				}
			}
		});

		order.forEach((item, index) => {
			if (item.type === "pending") {
				const wrapper = document.createElement("div");
				wrapper.className = "group relative";
				wrapper.dataset.role = "content-images-pending";
				wrapper.dataset.scanKey = `pending:${item.id}`;
				wrapper.draggable = true;
				const button = document.createElement("button");
				button.type = "button";
				button.className = [
					"rounded",
					"border",
					"border-dashed",
					"border-slate-300",
					"bg-stone-50",
					"p-1",
					"shadow-sm",
				].join(" ");
				button.dataset.imageUrl = item.url;
				button.dataset.imageIndex = `pending-${index}`;
				const img = document.createElement("img");
				img.src = item.url;
				img.alt = "Digitalisat (neu)";
				img.loading = "lazy";
				img.className = "h-28 w-28 object-cover opacity-70";
				button.appendChild(img);
				const badge = document.createElement("span");
				badge.className = "absolute left-1 top-1 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900";
				badge.textContent = "Neu";
				wrapper.appendChild(button);
				wrapper.appendChild(badge);
				const removeButton = document.createElement("button");
				removeButton.type = "button";
				removeButton.className = "absolute right-1 top-1 hidden rounded-full border border-red-200 bg-white/90 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm transition group-hover:flex hover:text-red-900 hover:border-red-300";
				removeButton.innerHTML = '<i class="ri-close-line mr-1"></i>Entfernen';
				removeButton.addEventListener("click", (event) => {
					event.preventDefault();
					event.stopPropagation();
					this._removePendingFileById(item.id);
				});
				wrapper.appendChild(removeButton);
				list.appendChild(wrapper);
				return;
			}

			const image = item.image;
			const wrapper = document.createElement("div");
			wrapper.className = "group relative";
			wrapper.dataset.role = "content-images-item";
			wrapper.dataset.scanKey = `existing:${item.name}`;
			wrapper.draggable = true;
			const isPendingDelete = this._pendingDeletes.has(image.name);
			if (isPendingDelete) {
				wrapper.classList.add("content-image-pending");
			}
			const button = document.createElement("button");
			button.type = "button";
			button.className = [
				"relative",
				"rounded",
				"border",
				"border-slate-200",
				"bg-white",
				"p-1",
				"shadow-sm",
				"transition",
				"hover:border-slate-400",
				"hover:shadow-md",
			].join(" ");
			button.dataset.imageUrl = image.url;
			button.dataset.imageIndex = String(index);
			if (isPendingDelete) {
				button.setAttribute("aria-disabled", "true");
				button.classList.add("content-image-pending-button");
			}

			const img = document.createElement("img");
			img.src = buildThumbUrl(image.url, THUMB_PARAM);
			img.alt = "Digitalisat";
			img.loading = "lazy";
			img.className = "h-28 w-28 object-cover";

			button.appendChild(img);
			wrapper.appendChild(button);

			if (canDelete && image.name) {
				const deleteButton = document.createElement("button");
				deleteButton.type = "button";
				deleteButton.className = [
					"absolute",
					"right-1",
					"top-1",
					"hidden",
					"rounded-full",
					"border",
					"border-red-200",
					"bg-white/90",
					"px-2",
					"py-1",
					"text-xs",
					"font-semibold",
					"text-red-700",
					"z-20",
					"shadow-sm",
					"transition",
					"group-hover:flex",
					"hover:text-red-900",
					"hover:border-red-300",
				].join(" ");
				if (isPendingDelete) {
					deleteButton.classList.remove("border-red-200", "text-red-700");
					deleteButton.classList.add("border-amber-300", "bg-amber-100", "text-amber-900", "hover:border-amber-400", "hover:text-amber-950");
					deleteButton.innerHTML = '<i class="ri-arrow-go-back-line mr-1"></i>Rueckgaengig';
				} else {
					deleteButton.innerHTML = '<i class="ri-delete-bin-line mr-1"></i>Entfernen';
				}
				deleteButton.addEventListener("click", (event) => {
					event.preventDefault();
					event.stopPropagation();
					this._togglePendingDelete(image.name);
				});
				wrapper.appendChild(deleteButton);
			}

			list.appendChild(wrapper);
		});

		if (uploadProxy && uploadProxy.parentElement !== list) {
			list.appendChild(uploadProxy);
		}

		const dialog = this._ensureDialog();
		const fullImage = dialog.querySelector(`[data-role='${CONTENT_IMAGES_FULL_ROLE}']`);

		list.addEventListener("click", (event) => {
			const target = event.target.closest("button[data-image-url]");
			if (!target || !fullImage) {
				return;
			}
			const url = target.dataset.imageUrl || "";
			const fullUrl = url.startsWith("blob:") ? url : buildFullUrl(url);
			fullImage.src = fullUrl;
			fullImage.alt = "Digitalisat";
			if (dialog.showModal) {
				dialog.showModal();
			} else {
				dialog.setAttribute("open", "true");
			}
		});

		this._wireDrag(list);
	}

	_ensureList() {
		let list = this.querySelector(`[data-role='${CONTENT_IMAGES_LIST_ROLE}']`);
		if (!list) {
			list = document.createElement("div");
			list.dataset.role = CONTENT_IMAGES_LIST_ROLE;
			this.appendChild(list);
		}
		list.className = "grid gap-2";
		list.style.gridTemplateColumns = "repeat(auto-fill, minmax(7rem, 1fr))";
		list.style.width = "100%";
		return list;
	}

	_ensureUploadProxy() {
		const panel = this.closest("[data-role='content-images-panel']");
		if (!panel) {
			return null;
		}
		const uploadInput = panel.querySelector("[data-role='content-images-upload-input']");
		if (!uploadInput) {
			return null;
		}
		let proxy = panel.querySelector("[data-role='content-images-upload-proxy']");
		if (!proxy) {
			proxy = document.createElement("button");
			proxy.type = "button";
			proxy.dataset.role = "content-images-upload-proxy";
			proxy.className = "flex h-28 w-28 items-center justify-center rounded-xs border-2 border-dashed border-slate-300 bg-stone-50 text-lg font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800";
			proxy.setAttribute("aria-label", "Bilder hinzufuegen");
			proxy.innerHTML = '<i class="ri-upload-2-line"></i>';
			proxy.addEventListener("click", () => {
				uploadInput.click();
			});
		}
		return proxy;
	}

	_togglePendingDelete(fileName) {
		if (!fileName) {
			return;
		}
		if (this._pendingDeletes.has(fileName)) {
			this._pendingDeletes.delete(fileName);
		} else {
			this._pendingDeletes.add(fileName);
		}
		this._render(this._currentImages || []);
	}

	_removePendingFileById(id) {
		const index = this._pendingIds.indexOf(id);
		if (index < 0) {
			return;
		}
		const url = this._pendingUrls[index];
		if (url) {
			URL.revokeObjectURL(url);
		}
		this._pendingFiles.splice(index, 1);
		this._pendingUrls.splice(index, 1);
		this._pendingIds.splice(index, 1);
		this._scanOrder = this._scanOrder.filter((token) => token !== `pending:${id}`);
		this._render(this._currentImages || []);
	}

	getPendingFiles() {
		return Array.isArray(this._pendingFiles) ? this._pendingFiles : [];
	}

	getPendingIds() {
		return Array.isArray(this._pendingIds) ? this._pendingIds : [];
	}

	getPendingDeletes() {
		return Array.from(this._pendingDeletes || []);
	}

	getScanOrder() {
		if (!Array.isArray(this._scanOrder)) {
			return [];
		}
		return this._scanOrder.slice();
	}

	_clearPendingPreviews() {
		if (Array.isArray(this._pendingUrls)) {
			this._pendingUrls.forEach((url) => URL.revokeObjectURL(url));
		}
		this._pendingUrls = [];
	}

	disconnectedCallback() {
		this._clearPendingPreviews();
	}

	_wireDrag(list) {
		if (!list || list.dataset.dragInit === "true") {
			return;
		}
		list.dataset.dragInit = "true";
		let draggingKey = null;

		list.addEventListener("dragstart", (event) => {
			const item = event.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
			if (!item) {
				event.preventDefault();
				return;
			}
			draggingKey = item.dataset.scanKey || null;
			item.classList.add("opacity-60");
			event.dataTransfer.effectAllowed = "move";
			event.dataTransfer.setData("text/plain", "move");
		});

		list.addEventListener("dragover", (event) => {
			if (!draggingKey) {
				return;
			}
			event.preventDefault();
			const target = event.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
			if (!target || target.dataset.scanKey === draggingKey) {
				return;
			}
			const rect = target.getBoundingClientRect();
			const before = event.clientY - rect.top < rect.height / 2;
			const dragged = list.querySelector(`[data-scan-key="${CSS.escape(draggingKey)}"]`);
			if (!dragged) {
				return;
			}
			if (before) {
				target.before(dragged);
			} else {
				target.after(dragged);
			}
		});

		list.addEventListener("dragend", () => {
			const dragged = draggingKey ? list.querySelector(`[data-scan-key="${CSS.escape(draggingKey)}"]`) : null;
			if (dragged) {
				dragged.classList.remove("opacity-60");
			}
			draggingKey = null;
			const newOrder = [];
			list.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((item) => {
				if (item.dataset.scanKey) {
					newOrder.push(item.dataset.scanKey);
				}
			});
			this._scanOrder = newOrder;
		});
	}

	_ensureDialog() {
		let dialog = this.querySelector(`[data-role='${CONTENT_IMAGES_DIALOG_ROLE}']`);
		if (dialog) {
			return dialog;
		}
		dialog = document.createElement("dialog");
		dialog.dataset.role = CONTENT_IMAGES_DIALOG_ROLE;
		dialog.className = [
			"fixed",
			"inset-0",
			"m-auto",
			"w-full",
			"max-w-5xl",
			"rounded-md",
			"border",
			"border-slate-200",
			"bg-white",
			"p-0",
			"shadow-xl",
			"backdrop:bg-black/60",
		].join(" ");

		dialog.innerHTML = `
			<div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
				<div class="text-sm font-semibold text-gray-800">Digitalisat</div>
				<button
					type="button"
					class="rounded-xs border border-slate-300 bg-stone-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-stone-200"
					data-role="${CONTENT_IMAGES_CLOSE_ROLE}">
					Schliessen
				</button>
			</div>
			<div class="p-4">
				<img data-role="${CONTENT_IMAGES_FULL_ROLE}" class="max-h-[75vh] w-full object-contain" alt="Digitalisat" />
			</div>
		`;

		const closeButton = dialog.querySelector(`[data-role='${CONTENT_IMAGES_CLOSE_ROLE}']`);
		if (closeButton) {
			closeButton.addEventListener("click", () => {
				dialog.close();
			});
		}
		dialog.addEventListener("cancel", (event) => {
			event.preventDefault();
			dialog.close();
		});
		dialog.addEventListener("click", (event) => {
			if (event.target === dialog) {
				dialog.close();
			}
		});

		this.appendChild(dialog);
		return dialog;
	}

	_openDeleteDialog(payload) {
		const dialog = this._ensureDeleteDialog();
		if (!dialog) {
			return;
		}
		dialog.dataset.endpoint = payload.endpoint;
		dialog.dataset.contentId = payload.contentId;
		dialog.dataset.csrfToken = payload.csrfToken;
		dialog.dataset.fileName = payload.fileName;

		const nameEl = dialog.querySelector(`[data-role='${CONTENT_IMAGES_DELETE_NAME_ROLE}']`);
		if (nameEl) {
			nameEl.textContent = payload.fileName;
		}

		if (dialog.showModal) {
			dialog.showModal();
		} else {
			dialog.setAttribute("open", "true");
		}
	}

	_ensureDeleteDialog() {
		let dialog = this.querySelector(`[data-role='${CONTENT_IMAGES_DELETE_DIALOG_ROLE}']`);
		if (dialog) {
			return dialog;
		}
		dialog = document.createElement("dialog");
		dialog.dataset.role = CONTENT_IMAGES_DELETE_DIALOG_ROLE;
		dialog.className = [
			"dbform",
			"fixed",
			"inset-0",
			"m-auto",
			"rounded-md",
			"border",
			"border-slate-200",
			"p-0",
			"shadow-xl",
			"backdrop:bg-black/40",
		].join(" ");
		dialog.innerHTML = `
			<div class="p-5 w-[22rem]">
				<div class="text-base font-bold text-gray-900">Digitalisat loeschen?</div>
				<div class="text-sm font-bold text-gray-900 mt-1" data-role="${CONTENT_IMAGES_DELETE_NAME_ROLE}"></div>
				<p class="text-sm text-gray-700 mt-2">
					Das Digitalisat wird dauerhaft entfernt.
				</p>
				<div class="flex items-center justify-end gap-3 mt-4">
					<button type="button" class="resetbutton w-auto px-3 py-1 text-sm" data-role="${CONTENT_IMAGES_DELETE_CANCEL_ROLE}">Abbrechen</button>
					<button type="button" class="submitbutton w-auto bg-red-700 hover:bg-red-800 px-3 py-1 text-sm" data-role="${CONTENT_IMAGES_DELETE_CONFIRM_ROLE}">
						Loeschen
					</button>
				</div>
			</div>
		`;

		const cancelButton = dialog.querySelector(`[data-role='${CONTENT_IMAGES_DELETE_CANCEL_ROLE}']`);
		const confirmButton = dialog.querySelector(`[data-role='${CONTENT_IMAGES_DELETE_CONFIRM_ROLE}']`);

		const closeDialog = () => {
			if (dialog.open) {
				dialog.close();
			}
		};

		if (cancelButton) {
			cancelButton.addEventListener("click", closeDialog);
		}
		dialog.addEventListener("cancel", (event) => {
			event.preventDefault();
			closeDialog();
		});

		if (confirmButton) {
			confirmButton.addEventListener("click", () => {
				this._performDelete(dialog);
			});
		}

		this.appendChild(dialog);
		return dialog;
	}

	_performDelete(dialog) {
		const endpoint = dialog.dataset.endpoint || "";
		const csrfToken = dialog.dataset.csrfToken || "";
		const contentId = dialog.dataset.contentId || "";
		const fileName = dialog.dataset.fileName || "";
		if (!endpoint || !csrfToken || !contentId || !fileName) {
			dialog.close();
			return;
		}
		const panel = this.closest("[data-role='content-images-panel']");
		if (window.htmx?.ajax && panel) {
			window.htmx.ajax("POST", endpoint, {
				target: panel,
				swap: "outerHTML",
				values: {
					csrf_token: csrfToken,
					content_id: contentId,
					scan: fileName,
				},
			});
			dialog.close();
			return;
		}
		const payload = new URLSearchParams();
		payload.set("csrf_token", csrfToken);
		payload.set("content_id", contentId);
		payload.set("scan", fileName);
		fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"HX-Request": "true",
			},
			body: payload.toString(),
		})
			.then((response) => {
				if (!response.ok || !panel) {
					return null;
				}
				return response.text();
			})
			.then((html) => {
				if (!html || !panel) {
					return;
				}
				this._applyServerResponse(html, panel);
			})
			.catch(() => null)
			.finally(() => {
				dialog.close();
			});
	}

	_applyServerResponse(html, panel) {
		const template = document.createElement("template");
		template.innerHTML = html.trim();
		const oobNodes = Array.from(template.content.querySelectorAll("[hx-swap-oob]"));
		oobNodes.forEach((node) => {
			const swapRaw = node.getAttribute("hx-swap-oob") || "";
			const [swapTypeRaw, selector] = swapRaw.split(":");
			const swapType = swapTypeRaw || "outerHTML";
			const target = selector ? document.querySelector(selector) : (node.id ? document.getElementById(node.id) : null);
			if (target) {
				if (swapType === "innerHTML") {
					target.innerHTML = node.innerHTML;
				} else {
					target.outerHTML = node.outerHTML;
				}
			}
			node.remove();
		});
		const replacement = template.content.firstElementChild;
		if (replacement) {
			panel.replaceWith(replacement);
		}
	}
}
