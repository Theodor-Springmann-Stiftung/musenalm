export class FabMenu extends HTMLElement {
	constructor() {
		super();
		this.state = null; // Will be set in connectedCallback: 'closed', 'half', 'full'
		this.handleClick = this.handleClick.bind(this);
		this.handleClickAway = this.handleClickAway.bind(this);
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
		let hasReihenList = false;
		let hasPersonenList = false;
		let hasEntry = false,
			entryId = "",
			entryUpdated = "";
		let hasContent = false,
			contentId = "",
			contentEntryId = "";
		let hasPage = false,
			pageKey = "";

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

		// Content detail page: /beitrag/{id}
		const contentMatch = path.match(/^\/beitrag\/([^\/]+)\/?$/);
		if (contentMatch) {
			hasContent = true;
			contentId = contentMatch[1];
			const entryLink = document.querySelector('#breadcrumbs a[href^="/almanach/"]');
			if (entryLink) {
				const match = entryLink.getAttribute("href")?.match(/^\/almanach\/([^\/#]+)/);
				if (match) {
					contentEntryId = match[1];
				}
			}
		}

		const knownPageKeys = new Set([
			"kontakt",
			"danksagungen",
			"literatur",
			"einleitung",
			"benutzerhinweise",
			"lesekabinett",
			"reihen",
			"index",
		]);
		const normalizedPath = path.replace(/\/+$/, "") || "/";
		const matchesPageKeyPath = (key) => {
			if (!key || !knownPageKeys.has(key)) {
				return false;
			}
			if (key === "index") {
				return normalizedPath === "/" || normalizedPath === "/index";
			}
			return normalizedPath === `/${key}` || normalizedPath === `/redaktion/${key}`;
		};

		// Page views use page editor keys via meta tag or URL mapping
		const pageKeyMeta = document.querySelector('meta[name="page-key"]');
		const metaPageKey = pageKeyMeta?.content?.trim();
		if (metaPageKey && matchesPageKeyPath(metaPageKey)) {
			hasPage = true;
			pageKey = metaPageKey;
		} else {
			const textPageMatch = normalizedPath.match(/^\/redaktion\/([^\/]+)$/);
			const textPageKey = textPageMatch ? textPageMatch[1] : "";
			if (textPageKey && knownPageKeys.has(textPageKey)) {
				hasPage = true;
				pageKey = textPageKey;
			} else if (normalizedPath === "/" || normalizedPath === "/index") {
				hasPage = true;
				pageKey = "index";
			}
		}
		if (path === "/reihen" || path === "/reihen/") {
			hasReihenList = true;
		}
		if (path === "/personen" || path === "/personen/") {
			hasPersonenList = true;
		}

		// Try to find CSRF token from page forms
		let csrfToken = "";
		const csrfInput = document.querySelector('input[name="csrf_token"]');
		if (csrfInput) {
			csrfToken = csrfInput.value;
		}
		const hasCsrf = csrfToken !== "";

		this.hasContext = hasReihe || hasPerson || hasEntry || hasContent || hasPage || hasReihenList || hasPersonenList;

		// Build half-open menu content
		let halfOpenContent = "";
		if (isAdminOrEditor && hasReihe) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihe
				</div>
				<a href="/reihe/${reiheId}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			`;
		} else if (isAdminOrEditor && hasPerson) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Person
				</div>
				<a href="/person/${personId}/edit/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			`;
		} else if (isAdminOrEditor && hasEntry) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Almanach
				</div>
				<a href="/almanach/${entryId}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				<a href="/almanach/${entryId}/contents/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-file-list-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Beiträge bearbeiten</span>
				</a>
				<a href="/almanach/${entryId}/contents/new" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Beitrag</span>
				</a>
			`;
		} else if (isAdminOrEditor && hasContent && contentEntryId) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Beitrag
				</div>
				<a href="/almanach/${contentEntryId}/contents/${contentId}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				<a href="/almanach/${contentEntryId}/contents/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-file-list-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Beiträge bearbeiten</span>
				</a>
				<a href="/almanach/${contentEntryId}/contents/new" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Beitrag</span>
				</a>
			`;
		} else if (isAdminOrEditor && hasReihenList) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihen
				</div>
				<a href="/reihen/new/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Reihe</span>
				</a>
			`;
		} else if (isAdminOrEditor && hasPersonenList) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Personen
				</div>
				<a href="/personen/new/" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Person</span>
				</a>
			`;
		} else if (isAdminOrEditor && hasPage) {
			halfOpenContent = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Seite
				</div>
				<a href="/redaktion/seiten/?key=${pageKey}" hx-boost="false" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Seite bearbeiten</span>
				</a>
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
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/abkuerzungen/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-text text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Abkürzungen</span>
				</a>
				<a href="/abkuerzungen/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/redaktion/seiten/" hx-boost="false" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-pages-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Seiten</span>
				</a>
				<a href="/redaktion/seiten/" target="_blank" hx-boost="false" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
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

		// Build the unified menu content
		const contextualSection = halfOpenContent ? halfOpenContent : "";
		const contextualDivider = halfOpenContent ? '<div class="border-t border-gray-200"></div>' : "";

		// Insert HTML into light DOM
		this.innerHTML = `
			<div class="fixed bottom-12 left-8 z-50">
				<!-- Unified Menu Container -->
				<div class="fab-menu hidden absolute bottom-16 left-0 w-64 bg-white rounded border border-gray-300 shadow transition-all duration-100 ease-out">
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
