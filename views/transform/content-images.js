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

		if (!Array.isArray(normalized) || normalized.length === 0) {
			this.classList.add("hidden");
			return;
		}

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
			this._uploadFiles(uploadInput, panel);
		});
	}

	_uploadFiles(input, panel) {
		const endpoint = input.getAttribute("data-upload-endpoint") || "";
		const contentId = input.getAttribute("data-content-id") || "";
		const csrfToken = input.getAttribute("data-csrf-token") || "";
		const files = Array.from(input.files || []);
		if (!endpoint || !contentId || !csrfToken || files.length === 0) {
			return;
		}
		const payload = new FormData();
		payload.append("csrf_token", csrfToken);
		payload.append("content_id", contentId);
		files.forEach((file) => payload.append("scans", file));
		fetch(endpoint, {
			method: "POST",
			headers: {
				"HX-Request": "true",
			},
			body: payload,
		})
			.then((response) => {
				if (!response.ok) {
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
				input.value = "";
			});
	}

	_render(images) {
		this.classList.add("block");
		this.style.display = "block";
		this.style.width = "100%";
		const list = this._ensureList();
		list.innerHTML = "";

		const deleteEndpoint = this.getAttribute("data-delete-endpoint") || "";
		const contentId = this.getAttribute("data-content-id") || "";
		const csrfToken = this.getAttribute("data-csrf-token") || "";
		const canDelete = deleteEndpoint && contentId && csrfToken;

		images.forEach((image, index) => {
			const wrapper = document.createElement("div");
			wrapper.className = "group relative";
			const button = document.createElement("button");
			button.type = "button";
			button.className = [
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
					"h-8",
					"w-8",
					"rounded-full",
					"border",
					"border-red-200",
					"bg-white/90",
					"flex",
					"items-center",
					"justify-center",
					"text-red-700",
					"shadow-sm",
					"transition",
					"group-hover:flex",
					"hover:text-red-900",
					"hover:border-red-300",
				].join(" ");
				deleteButton.innerHTML = '<i class="ri-delete-bin-line"></i>';
				deleteButton.addEventListener("click", (event) => {
					event.preventDefault();
					event.stopPropagation();
					this._openDeleteDialog({
						endpoint: deleteEndpoint,
						contentId,
						csrfToken,
						fileName: image.name,
					});
				});
				wrapper.appendChild(deleteButton);
			}

			list.appendChild(wrapper);
		});

		const uploadTile = this._findUploadTile();
		if (uploadTile) {
			list.appendChild(uploadTile);
		}

		const dialog = this._ensureDialog();
		const fullImage = dialog.querySelector(`[data-role='${CONTENT_IMAGES_FULL_ROLE}']`);

		list.addEventListener("click", (event) => {
			const target = event.target.closest("button[data-image-url]");
			if (!target || !fullImage) {
				return;
			}
			const url = target.dataset.imageUrl || "";
			fullImage.src = buildFullUrl(url);
			fullImage.alt = "Digitalisat";
			if (dialog.showModal) {
				dialog.showModal();
			} else {
				dialog.setAttribute("open", "true");
			}
		});
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

	_findUploadTile() {
		const panel = this.closest("[data-role='content-images-panel']");
		if (!panel) {
			return null;
		}
		const upload = panel.querySelector("[data-role='content-images-upload']");
		if (!upload) {
			return null;
		}
		return upload;
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
