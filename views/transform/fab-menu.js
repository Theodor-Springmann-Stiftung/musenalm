export class FabMenu extends HTMLElement {
	constructor() {
		super();
		this.state = null; // Will be set in connectedCallback: 'closed', 'half', 'full'
		this.handleClick = this.handleClick.bind(this);
		this.handleClickAway = this.handleClickAway.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
	}

	connectedCallback() {
		// Get data attributes passed from template
		const userName = this.getAttribute("data-user-name") || "Benutzer";
		const userEmail = this.getAttribute("data-user-email") || "";
		const userId = this.getAttribute("data-user-id") || "";
		const isAdminOrEditor = this.getAttribute("data-is-admin-or-editor") === "true";
		const isAdmin = this.getAttribute("data-is-admin") === "true";
		const redirectPath = this.getAttribute("data-redirect-path") || "";

		// Detect context from URL
		const path = window.location.pathname;
		let hasReihe = false,
			reiheId = "",
			reiheUpdated = "";
		let hasPerson = false,
			personId = "";
		let hasEntry = false,
			entryId = "",
			entryUpdated = "";

		// Reihe detail page: /reihe/{id} (but not /reihe/new or /reihe/{id}/edit)
		const reiheMatch = path.match(/^\/reihe\/([^\/]+)\/?$/);
		if (reiheMatch && reiheMatch[1] !== "new") {
			hasReihe = true;
			reiheId = reiheMatch[1];
			// Try to get updated timestamp from page
			const updatedMeta = document.querySelector('meta[name="entity-updated"]');
			if (updatedMeta) {
				reiheUpdated = updatedMeta.content;
			}
		}

		// Person detail page: /person/{id} (but not /person/new or /person/{id}/edit)
		const personMatch = path.match(/^\/person\/([^\/]+)\/?$/);
		if (personMatch && personMatch[1] !== "new") {
			hasPerson = true;
			personId = personMatch[1];
		}

		// Almanach detail page: /almanach/{id} (but not /almanach-new or /almanach/{id}/edit)
		const almanachMatch = path.match(/^\/almanach\/([^\/]+)\/?$/);
		if (almanachMatch && almanachMatch[1] !== "new") {
			hasEntry = true;
			entryId = almanachMatch[1];
			// Try to get updated timestamp from page
			const updatedMeta = document.querySelector('meta[name="entity-updated"]');
			if (updatedMeta) {
				entryUpdated = updatedMeta.content;
			}
		}

		// Try to find CSRF token from page forms
		let csrfToken = "";
		const csrfInput = document.querySelector('input[name="csrf_token"]');
		if (csrfInput) {
			csrfToken = csrfInput.value;
		}
		const hasCsrf = csrfToken !== "";

		this.hasContext = hasReihe || hasPerson || hasEntry;

		// Build half-open menu content
		let halfOpenContent = "";
		if (hasReihe) {
			const deleteButton = hasCsrf
				? `
				<button data-action="delete-reihe" data-id="${reiheId}" class="w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-left">
					<i class="ri-delete-bin-line text-base text-red-600 mr-2.5"></i>
					<span class="text-red-600">Löschen</span>
				</button>
			`
				: "";
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihe
				</div>
				<a href="/reihe/${reiheId}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				${deleteButton}
			`;
		} else if (hasPerson) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Person
				</div>
				<a href="/person/${personId}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			`;
		} else if (hasEntry) {
			const deleteButton = hasCsrf
				? `
				<button data-action="delete-almanach" data-id="${entryId}" class="w-full flex items-center px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-left">
					<i class="ri-delete-bin-line text-base text-red-600 mr-2.5"></i>
					<span class="text-red-600">Löschen</span>
				</button>
			`
				: "";
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Almanach
				</div>
				<a href="/almanach/${entryId}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				${deleteButton}
			`;
		}

		// Build full menu content
		const createSection = isAdminOrEditor
			? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Erstellen
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/almanach-new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-book-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Band</span>
				</a>
				<a href="/almanach-new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/reihen/new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Reihe</span>
				</a>
				<a href="/reihen/new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/orte/new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Ort</span>
				</a>
				<a href="/orte/new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/personen/new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Person</span>
				</a>
				<a href="/personen/new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		`
			: "";

		const listenSection = isAdminOrEditor
			? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Listen
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/reihen/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Reihen</span>
				</a>
				<a href="/reihen/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/orte/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Orte</span>
				</a>
				<a href="/orte/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/personen/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Personen</span>
				</a>
				<a href="/personen/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		`
			: "";

		const adminSection = isAdmin
			? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Administration
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/user/management/access/User?redirectTo=${redirectPath}" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Nutzer einladen</span>
				</a>
				<a href="/user/management/access/User?redirectTo=${redirectPath}" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/user/management?redirectTo=${redirectPath}" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-2-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Benutzerverwaltung</span>
				</a>
				<a href="/user/management?redirectTo=${redirectPath}" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		`
			: "";

		// Build delete dialogs (only if CSRF token is available)
		let deleteDialogs = "";
		if (hasReihe && hasCsrf) {
			deleteDialogs += `
				<div class="fab-delete-dialog hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-dialog="reihe">
					<div class="bg-white rounded-lg p-6 max-w-md mx-4">
						<h3 class="text-lg font-semibold mb-4">Reihe löschen?</h3>
						<p class="text-gray-700 mb-6">Möchten Sie diese Reihe wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
						<div class="flex gap-3 justify-end">
							<button data-action="cancel-delete" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
								Abbrechen
							</button>
							<form method="POST" action="/reihe/${reiheId}/edit/delete">
								<input type="hidden" name="csrf_token" value="${csrfToken}">
								<input type="hidden" name="last_edited" value="${reiheUpdated}">
								<button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
									Löschen
								</button>
							</form>
						</div>
					</div>
				</div>
			`;
		}
		if (hasEntry && hasCsrf) {
			deleteDialogs += `
				<div class="fab-delete-dialog hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-dialog="almanach">
					<div class="bg-white rounded-lg p-6 max-w-md mx-4">
						<h3 class="text-lg font-semibold mb-4">Almanach-Eintrag löschen?</h3>
						<p class="text-gray-700 mb-6">Möchten Sie diesen Eintrag wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
						<div class="flex gap-3 justify-end">
							<button data-action="cancel-delete" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors">
								Abbrechen
							</button>
							<form method="POST" action="/almanach/${entryId}/edit/delete">
								<input type="hidden" name="csrf_token" value="${csrfToken}">
								<input type="hidden" name="last_edited" value="${entryUpdated}">
								<button type="submit" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
									Löschen
								</button>
							</form>
						</div>
					</div>
				</div>
			`;
		}

		// Build the unified menu content
		const contextualSection = halfOpenContent ? halfOpenContent : "";
		const contextualDivider = halfOpenContent ? '<div class="border-t border-gray-200"></div>' : "";

		// Insert HTML into light DOM
		this.innerHTML = `
			<div class="fixed bottom-12 left-8 z-50">
				<!-- Unified Menu Container -->
				<div class="fab-menu hidden absolute bottom-16 left-0 w-64 bg-white rounded border border-gray-300 shadow transition-all duration-200 ease-out">
					<!-- Contextual actions (always at top when present) -->
					${contextualSection}
					${contextualDivider}

					<!-- Rest of menu (hidden in half state, shown in full state) -->
					<div class="fab-full-content overflow-hidden transition-all duration-300 ease-in-out" style="max-height: 0; opacity: 0;">
						${createSection}
						${listenSection}
						${adminSection}
						<div class="px-4 py-2">
							<div class="font-semibold text-gray-900 text-sm">${userName}</div>
							<div class="text-xs text-gray-600 truncate">${userEmail}</div>
						</div>
						<a href="/user/${userId}/edit?redirectTo=${encodeURIComponent(window.location.href)}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-user-3-line text-base text-gray-700 mr-2.5"></i>
							<span class="text-gray-900">Profil bearbeiten</span>
						</a>
						<a href="/logout?redirectTo=${redirectPath}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-logout-box-line text-base text-gray-700 mr-2.5 mb-1"></i>
							<span class="text-gray-900">Logout</span>
						</a>
					</div>
				</div>

				<!-- FAB Button -->
				<button class="fab-button w-12 h-12 bg-slate-700 hover:bg-slate-800 text-white rounded border-2 border-slate-600 shadow-sm transition-all duration-200 flex items-center justify-center" aria-label="Menü">
					<i class="fab-icon text-2xl transition-all duration-200 ri-menu-line"></i>
				</button>

				${deleteDialogs}
			</div>
		`;

		// Get elements
		this._button = this.querySelector(".fab-button");
		this._icon = this.querySelector(".fab-icon");
		this._menu = this.querySelector(".fab-menu");
		this._fullContent = this.querySelector(".fab-full-content");

		// Initialize state: if we have context, start half-open, otherwise closed
		this.state = this.hasContext ? "half" : "closed";
		this.setState(this.state);

		// Add event listeners
		this._button.addEventListener("click", this.handleClick);
		document.addEventListener("click", this.handleClickAway);

		// Delete button handlers
		const deleteButtons = this.querySelectorAll('[data-action^="delete-"]');
		deleteButtons.forEach((btn) => {
			btn.addEventListener("click", this.handleDeleteClick);
		});

		// Cancel delete handlers
		const cancelButtons = this.querySelectorAll('[data-action="cancel-delete"]');
		cancelButtons.forEach((btn) => {
			btn.addEventListener("click", () => {
				this.closeAllDialogs();
			});
		});
	}

	disconnectedCallback() {
		this._button.removeEventListener("click", this.handleClick);
		document.removeEventListener("click", this.handleClickAway);
	}

	handleClick(e) {
		e.stopPropagation();
		this.nextState();
	}

	handleClickAway(e) {
		if (!this.contains(e.target)) {
			this.setState("closed");
		}
	}

	handleDeleteClick(e) {
		const action = e.currentTarget.getAttribute("data-action");
		const entityType = action.replace("delete-", "");
		const dialog = this.querySelector(`[data-dialog="${entityType}"]`);
		if (dialog) {
			dialog.classList.remove("hidden");
		}
	}

	closeAllDialogs() {
		const dialogs = this.querySelectorAll(".fab-delete-dialog");
		dialogs.forEach((dialog) => dialog.classList.add("hidden"));
	}

	nextState() {
		if (this.state === "closed") {
			this.setState(this.hasContext ? "half" : "full");
		} else if (this.state === "half") {
			this.setState("full");
		} else {
			this.setState("closed");
		}
	}

	setState(newState) {
		this.state = newState;

		// Update menu visibility with animations
		if (newState === "closed") {
			// Fade out and slide down
			this._menu.style.opacity = "0";
			this._menu.style.transform = "translateY(8px)";

			// Collapse full content
			this._fullContent.style.maxHeight = "0";
			this._fullContent.style.opacity = "0";

			// After animation, hide completely
			setTimeout(() => {
				if (this.state === "closed") {
					this._menu.classList.add("hidden");
				}
			}, 200);

			// Button state: closed - menu icon
			this._icon.classList.remove("ri-arrow-up-s-line", "ri-close-line");
			this._icon.classList.add("ri-menu-line");
			this._button.style.backgroundColor = "";
			this._button.style.borderColor = "";
			this._button.classList.remove("shadow-md");
			this._button.classList.add("shadow-sm");
		} else if (newState === "half") {
			// Show menu, fade in and slide up
			this._menu.classList.remove("hidden");
			// Force reflow for animation
			this._menu.offsetHeight;
			this._menu.style.opacity = "1";
			this._menu.style.transform = "translateY(0)";

			// Keep full content collapsed
			this._fullContent.style.maxHeight = "0";
			this._fullContent.style.opacity = "0";

			// Button state: half-open - arrow up icon (can expand more)
			this._icon.classList.remove("ri-menu-line", "ri-close-line");
			this._icon.classList.add("ri-arrow-up-s-line");
			this._button.style.backgroundColor = "rgb(51 65 85)"; // slate-700
			this._button.style.borderColor = "rgb(71 85 105)"; // slate-600
			this._button.classList.remove("shadow-sm");
			this._button.classList.add("shadow-md");
		} else if (newState === "full") {
			// Menu visible, ensure it's shown
			this._menu.classList.remove("hidden");
			this._menu.style.opacity = "1";
			this._menu.style.transform = "translateY(0)";

			// Expand full content with animation
			// Calculate the natural height
			this._fullContent.style.maxHeight = "none";
			const height = this._fullContent.scrollHeight;
			this._fullContent.style.maxHeight = "0";

			// Force reflow
			this._fullContent.offsetHeight;

			// Animate to full height
			this._fullContent.style.maxHeight = height + "px";
			this._fullContent.style.opacity = "1";

			// Button state: full-open - close icon
			this._icon.classList.remove("ri-menu-line", "ri-arrow-up-s-line");
			this._icon.classList.add("ri-close-line");
			this._button.style.backgroundColor = "rgb(30 41 59)"; // slate-800
			this._button.style.borderColor = "rgb(51 65 85)"; // slate-700
			this._button.classList.remove("shadow-sm");
			this._button.classList.add("shadow-md");
		}
	}
}
