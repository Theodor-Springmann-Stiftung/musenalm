// --- Class Name Constants for MultiSelectSimple ---
const MSS_COMPONENT_WRAPPER_CLASS = "mss-component-wrapper";
const MSS_SELECTED_ITEMS_CONTAINER_CLASS = "mss-selected-items-container";
const MSS_SELECTED_ITEM_PILL_CLASS = "mss-selected-item-pill";
const MSS_SELECTED_ITEM_TEXT_CLASS = "mss-selected-item-text";
const MSS_SELECTED_ITEM_PILL_DETAIL_CLASS = "mss-selected-item-pill-detail"; // New class for pill detail
const MSS_SELECTED_ITEM_DELETE_BTN_CLASS = "mss-selected-item-delete-btn";
const MSS_SELECTED_ITEM_EDIT_LINK_CLASS = "mss-selected-item-edit-link";
const MSS_INPUT_CONTROLS_CONTAINER_CLASS = "mss-input-controls-container";
const MSS_INPUT_WRAPPER_CLASS = "mss-input-wrapper";
const MSS_INPUT_WRAPPER_FOCUSED_CLASS = "mss-input-wrapper-focused";
const MSS_TEXT_INPUT_CLASS = "mss-text-input";
const MSS_CREATE_NEW_BUTTON_CLASS = "mss-create-new-button";
const MSS_TOGGLE_BUTTON_CLASS = "mss-toggle-button";
const MSS_INLINE_ROW_CLASS = "mss-inline-row";
const MSS_OPTIONS_LIST_CLASS = "mss-options-list";
const MSS_OPTION_ITEM_CLASS = "mss-option-item";
const MSS_OPTION_ITEM_NAME_CLASS = "mss-option-item-name";
const MSS_OPTION_ITEM_DETAIL_CLASS = "mss-option-item-detail";
const MSS_HIGHLIGHTED_OPTION_CLASS = "mss-option-item-highlighted";
const MSS_HIDDEN_SELECT_CLASS = "mss-hidden-select";
const MSS_NO_ITEMS_TEXT_CLASS = "mss-no-items-text";
const MSS_LOADING_CLASS = "mss-loading";

const MSS_REMOTE_DEFAULT_MIN_CHARS = 1;
const MSS_REMOTE_DEFAULT_LIMIT = 10;
const MSS_REMOTE_FETCH_DEBOUNCE_MS = 250;

// State classes for MultiSelectSimple
const MSS_STATE_NO_SELECTION = "mss-state-no-selection";
const MSS_STATE_HAS_SELECTION = "mss-state-has-selection";
const MSS_STATE_LIST_OPEN = "mss-state-list-open";

// --- MultiSelectSimple Element ---
export class MultiSelectSimple extends HTMLElement {
	static formAssociated = true;

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this._value = [];
		this._initialValue = [];
		this._initialOrder = [];
		this._removedIds = new Set();
		this._initialCaptured = false;
		this._allowInitialCapture = true;
		this._options = [
			{ id: "abk", name: "Abchasisch" },
			{ id: "aar", name: "Afar" },
			{ id: "afr", name: "Afrikaans" },
			{ id: "aka", name: "Akan" },
			{ id: "alb", name: "Albanisch" },
			{ id: "amh", name: "Amharisch" },
			{ id: "ara", name: "Arabisch" },
			{ id: "arg", name: "Aragonesisch" },
			{ id: "arm", name: "Armenisch" },
			{ id: "asm", name: "Assamesisch" },
			{ id: "ava", name: "Awarisch" },
			{ id: "ave", name: "Avestisch" },
			{ id: "aym", name: "Aymara" },
			{ id: "aze", name: "Aserbaidschanisch" },
			{ id: "bam", name: "Bambara" },
			{ id: "bak", name: "Baschkirisch" },
			{ id: "baq", name: "Baskisch" },
			{ id: "bel", name: "Belarussisch" },
			{ id: "ben", name: "Bengalisch" },
			{ id: "bis", name: "Bislama" },
			{ id: "bos", name: "Bosnisch" },
			{ id: "bre", name: "Bretonisch" },
			{ id: "bul", name: "Bulgarisch" },
			{ id: "bur", name: "Birmanisch" },
			{ id: "cat", name: "Katalanisch" },
			{ id: "cha", name: "Chamorro" },
			{ id: "che", name: "Tschetschenisch" },
			{ id: "nya", name: "Nyanja" },
			{ id: "chi", name: "Chinesisch" },
			{ id: "chu", name: "Kirchenslawisch" },
			{ id: "chv", name: "Tschuwaschisch" },
			{ id: "cor", name: "Kornisch" },
			{ id: "cos", name: "Korsisch" },
			{ id: "cre", name: "Cree" },
			{ id: "hrv", name: "Kroatisch" },
			{ id: "cze", name: "Tschechisch" },
			{ id: "dan", name: "Dänisch" },
			{ id: "div", name: "Dhivehi" },
			{ id: "dut", name: "Niederländisch" },
			{ id: "dzo", name: "Dzongkha" },
			{ id: "eng", name: "Englisch" },
			{ id: "epo", name: "Esperanto" },
			{ id: "est", name: "Estnisch" },
			{ id: "ewe", name: "Ewe" },
			{ id: "fao", name: "Färöisch" },
			{ id: "fij", name: "Fidschianisch" },
			{ id: "fin", name: "Finnisch" },
			{ id: "fre", name: "Französisch" },
			{ id: "fry", name: "Westfriesisch" },
			{ id: "ful", name: "Ful" },
			{ id: "gla", name: "Schottisch-Gälisch" },
			{ id: "glg", name: "Galicisch" },
			{ id: "lug", name: "Ganda" },
			{ id: "geo", name: "Georgisch" },
			{ id: "ger", name: "Deutsch" },
			{ id: "gre", name: "Griechisch" },
			{ id: "kal", name: "Kalaallisut" },
			{ id: "grn", name: "Guaraní" },
			{ id: "guj", name: "Gujarati" },
			{ id: "hat", name: "Haitianisch-Kreolisch" },
			{ id: "hau", name: "Hausa" },
			{ id: "heb", name: "Hebräisch" },
			{ id: "her", name: "Herero" },
			{ id: "hin", name: "Hindi" },
			{ id: "hmo", name: "Hiri Motu" },
			{ id: "hun", name: "Ungarisch" },
			{ id: "ice", name: "Isländisch" },
			{ id: "ido", name: "Ido" },
			{ id: "ibo", name: "Igbo" },
			{ id: "ind", name: "Indonesisch" },
			{ id: "ina", name: "Interlingua" },
			{ id: "ile", name: "Interlingue" },
			{ id: "iku", name: "Inuktitut" },
			{ id: "ipk", name: "Inupiaq" },
			{ id: "gle", name: "Irisch" },
			{ id: "ita", name: "Italienisch" },
			{ id: "jpn", name: "Japanisch" },
			{ id: "jav", name: "Javanisch" },
			{ id: "kan", name: "Kannada" },
			{ id: "kau", name: "Kanuri" },
			{ id: "kas", name: "Kashmiri" },
			{ id: "kaz", name: "Kasachisch" },
			{ id: "khm", name: "Khmer" },
			{ id: "kik", name: "Kikuyu" },
			{ id: "kin", name: "Kinyarwanda" },
			{ id: "kir", name: "Kirgisisch" },
			{ id: "kom", name: "Komi" },
			{ id: "kon", name: "Kongo" },
			{ id: "kor", name: "Koreanisch" },
			{ id: "kua", name: "Kwanyama" },
			{ id: "kur", name: "Kurdisch" },
			{ id: "lao", name: "Laotisch" },
			{ id: "lat", name: "Latein" },
			{ id: "lav", name: "Lettisch" },
			{ id: "lim", name: "Limburgisch" },
			{ id: "lin", name: "Lingala" },
			{ id: "lit", name: "Litauisch" },
			{ id: "lub", name: "Luba-Katanga" },
			{ id: "ltz", name: "Luxemburgisch" },
			{ id: "mac", name: "Mazedonisch" },
			{ id: "mlg", name: "Malagasy" },
			{ id: "may", name: "Malaiisch" },
			{ id: "mal", name: "Malayalam" },
			{ id: "mlt", name: "Maltesisch" },
			{ id: "glv", name: "Manx" },
			{ id: "mao", name: "Maori" },
			{ id: "mar", name: "Marathi" },
			{ id: "mah", name: "Marshallesisch" },
			{ id: "mon", name: "Mongolisch" },
			{ id: "nau", name: "Nauruisch" },
			{ id: "nav", name: "Navajo" },
			{ id: "nde", name: "Nord-Ndebele" },
			{ id: "nbl", name: "Süd-Ndebele" },
			{ id: "ndo", name: "Ndonga" },
			{ id: "nep", name: "Nepali" },
			{ id: "nor", name: "Norwegisch" },
			{ id: "nob", name: "Norwegisch Bokmål" },
			{ id: "nno", name: "Norwegisch Nynorsk" },
			{ id: "oci", name: "Okzitanisch" },
			{ id: "oji", name: "Ojibwa" },
			{ id: "ori", name: "Oriya" },
			{ id: "orm", name: "Oromo" },
			{ id: "oss", name: "Ossetisch" },
			{ id: "pli", name: "Pali" },
			{ id: "pus", name: "Paschtu" },
			{ id: "per", name: "Persisch" },
			{ id: "pol", name: "Polnisch" },
			{ id: "por", name: "Portugiesisch" },
			{ id: "pan", name: "Panjabi" },
			{ id: "que", name: "Quechua" },
			{ id: "rum", name: "Rumänisch" },
			{ id: "roh", name: "Rätoromanisch" },
			{ id: "run", name: "Rundi" },
			{ id: "rus", name: "Russisch" },
			{ id: "sme", name: "Nordsamisch" },
			{ id: "smo", name: "Samoanisch" },
			{ id: "sag", name: "Sango" },
			{ id: "san", name: "Sanskrit" },
			{ id: "srd", name: "Sardisch" },
			{ id: "srp", name: "Serbisch" },
			{ id: "sna", name: "Shona" },
			{ id: "snd", name: "Sindhi" },
			{ id: "sin", name: "Singhalesisch" },
			{ id: "slo", name: "Slowakisch" },
			{ id: "slv", name: "Slowenisch" },
			{ id: "som", name: "Somali" },
			{ id: "sot", name: "Süd-Sotho" },
			{ id: "spa", name: "Spanisch" },
			{ id: "sun", name: "Sundanesisch" },
			{ id: "swa", name: "Swahili" },
			{ id: "ssw", name: "Swazi" },
			{ id: "swe", name: "Schwedisch" },
			{ id: "tgl", name: "Tagalog" },
			{ id: "tah", name: "Tahitisch" },
			{ id: "tgk", name: "Tadschikisch" },
			{ id: "tam", name: "Tamil" },
			{ id: "tat", name: "Tatarisch" },
			{ id: "tel", name: "Telugu" },
			{ id: "tha", name: "Thailändisch" },
			{ id: "tib", name: "Tibetisch" },
			{ id: "tir", name: "Tigrinya" },
			{ id: "ton", name: "Tongaisch" },
			{ id: "tso", name: "Tsonga" },
			{ id: "tsn", name: "Tswana" },
			{ id: "tur", name: "Türkisch" },
			{ id: "tuk", name: "Turkmenisch" },
			{ id: "twi", name: "Twi" },
			{ id: "uig", name: "Uigurisch" },
			{ id: "ukr", name: "Ukrainisch" },
			{ id: "urd", name: "Urdu" },
			{ id: "uzb", name: "Usbekisch" },
			{ id: "ven", name: "Venda" },
			{ id: "vie", name: "Vietnamesisch" },
			{ id: "vol", name: "Volapük" },
			{ id: "wln", name: "Wallonisch" },
			{ id: "wel", name: "Walisisch" },
			{ id: "wol", name: "Wolof" },
			{ id: "xho", name: "Xhosa" },
			{ id: "iii", name: "Sichuan Yi" },
			{ id: "yid", name: "Jiddisch" },
			{ id: "yor", name: "Yoruba" },
			{ id: "zha", name: "Zhuang" },
			{ id: "zul", name: "Zulu" },
		];
		this._filteredOptions = [];
		this._highlightedIndex = -1;
		this._isOptionsListVisible = false;

		this._remoteEndpoint = null;
		this._remoteResultKey = "items";
		this._remoteMinChars = MSS_REMOTE_DEFAULT_MIN_CHARS;
		this._remoteLimit = MSS_REMOTE_DEFAULT_LIMIT;
		this._remoteFetchController = null;
		this._remoteFetchTimeout = null;

		this._placeholder = this.getAttribute("placeholder") || "Search items...";
		this._showCreateButton = this.getAttribute("show-create-button") !== "false";
		this._toggleLabel = this.getAttribute("data-toggle-label") || "";
		this._toggleInput = this._toggleLabel !== "";
		this._inputCollapsed = this._toggleInput;
		this._editBase = this.getAttribute("data-edit-base") || "";
		this._editSuffix = this.getAttribute("data-edit-suffix") || "/edit";

		this._setupTemplates();
		this._bindEventHandlers();
	}

	_setupTemplates() {
		this.optionTemplate = document.createElement("template");
		this.optionTemplate.innerHTML = `
                    <li role="option" class="${MSS_OPTION_ITEM_CLASS}">
                        <span data-ref="nameEl" class="${MSS_OPTION_ITEM_NAME_CLASS}"></span>
                        <span data-ref="detailEl" class="${MSS_OPTION_ITEM_DETAIL_CLASS}"></span>
                    </li>
                `;

		this.selectedItemTemplate = document.createElement("template");
		// Apply new MSS_SELECTED_ITEM_PILL_DETAIL_CLASS to the detail span
		this.selectedItemTemplate.innerHTML = `
                    <span class="${MSS_SELECTED_ITEM_PILL_CLASS} flex items-center">
                        <span data-ref="textEl" class="${MSS_SELECTED_ITEM_TEXT_CLASS}"></span>
                        <span data-ref="detailEl" class="${MSS_SELECTED_ITEM_PILL_DETAIL_CLASS} hidden"></span>
                        <a data-ref="editLink" class="${MSS_SELECTED_ITEM_EDIT_LINK_CLASS} hidden" aria-label="Bearbeiten">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" data-ref="deleteBtn" class="${MSS_SELECTED_ITEM_DELETE_BTN_CLASS}">&times;</button>
                    </span>
                `;
	}

	_bindEventHandlers() {
		this._handleInput = this._handleInput.bind(this);
		this._handleKeyDown = this._handleKeyDown.bind(this);
		this._handleFocus = this._handleFocus.bind(this);
		this._handleBlur = this._handleBlur.bind(this);
		this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this);
		this._handleOptionClick = this._handleOptionClick.bind(this);
		this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this);
		this._handleSelectedItemsContainerClick = this._handleSelectedItemsContainerClick.bind(this);
		this._handleToggleClick = this._handleToggleClick.bind(this);
	}

	_getItemById(id) {
		return this._options.find((opt) => opt.id === id);
	}

	get placeholder() {
		return this._placeholder;
	}
	set placeholder(value) {
		this._placeholder = value;
		if (this.inputElement) this.inputElement.placeholder = this._placeholder;
		this.setAttribute("placeholder", value);
	}

	get showCreateButton() {
		return this._showCreateButton;
	}
	set showCreateButton(value) {
		const boolValue = String(value).toLowerCase() !== "false" && value !== false;
		if (this._showCreateButton === boolValue) return;
		this._showCreateButton = boolValue;
		if (this.createNewButton) this.createNewButton.classList.toggle("hidden", !this._showCreateButton);
		this.setAttribute("show-create-button", this._showCreateButton ? "true" : "false");
	}

	setOptions(newOptions) {
		if (Array.isArray(newOptions) && newOptions.every((o) => o && typeof o.id === "string" && typeof o.name === "string")) {
			this._options = newOptions.map((option) => {
				const normalized = { ...option };
				normalized.name = this._normalizeText(normalized.name);
				normalized.additional_data = this._normalizeText(normalized.additional_data);
				return normalized;
			});
			const validValues = this._value.filter((id) => this._getItemById(id));
			if (validValues.length !== this._value.length) this.value = validValues;
			else if (this.selectedItemsContainer) this._renderSelectedItems();
			this._filteredOptions = [];
			this._highlightedIndex = -1;
			if (this.inputElement && this.inputElement.value) this._handleInput({ target: this.inputElement });
			else this._hideOptionsList();
		} else console.error("setOptions expects an array of objects with id and name properties.");
	}

	get value() {
		return this._value;
	}
	set value(newVal) {
		const oldValString = JSON.stringify(this._value.sort());
		if (Array.isArray(newVal)) {
			this._value = [...new Set(newVal.filter((id) => typeof id === "string" && this._getItemById(id)))];
		} else if (typeof newVal === "string" && newVal.trim() !== "") {
			const singleId = newVal.trim();
			if (this._getItemById(singleId) && !this._value.includes(singleId)) this._value = [singleId];
			else if (!this._getItemById(singleId)) this._value = this._value.filter((id) => id !== singleId);
		} else this._value = [];
		const newValString = JSON.stringify(this._value.sort());
		if (!this._initialCaptured && this._allowInitialCapture && this._value.length > 0) {
			this._initialValue = [...this._value];
			this._initialOrder = [...this._value];
			this._initialCaptured = true;
		}
		this._value.forEach((id) => {
			if (this._removedIds.has(id)) {
				this._removedIds.delete(id);
			}
		});
		if (oldValString !== newValString) {
			this._updateFormValue();
			if (this.selectedItemsContainer) this._renderSelectedItems();
			this._updateRootElementStateClasses();
			this.dispatchEvent(new Event("change", { bubbles: true }));
		}
	}

	get name() {
		return this.getAttribute("name");
	}
	set name(value) {
		this.setAttribute("name", value);
		if (this.hiddenSelect) this.hiddenSelect.name = value;
	}

	connectedCallback() {
		this._render();
		this.inputControlsContainer = this.querySelector(`.${MSS_INPUT_CONTROLS_CONTAINER_CLASS}`);
		this.inputWrapper = this.querySelector(`.${MSS_INPUT_WRAPPER_CLASS}`);
		this.inputElement = this.querySelector(`.${MSS_TEXT_INPUT_CLASS}`);
		this.createNewButton = this.querySelector(`.${MSS_CREATE_NEW_BUTTON_CLASS}`);
		this.toggleButton = this.querySelector(`.${MSS_TOGGLE_BUTTON_CLASS}`);
		this.optionsListElement = this.querySelector(`.${MSS_OPTIONS_LIST_CLASS}`);
		this.selectedItemsContainer = this.querySelector(`.${MSS_SELECTED_ITEMS_CONTAINER_CLASS}`);
		this.hiddenSelect = this.querySelector(`.${MSS_HIDDEN_SELECT_CLASS}`);

		this.placeholder = this.getAttribute("placeholder") || "Search items...";
		this.showCreateButton = this.getAttribute("show-create-button") !== "false";
		this._toggleLabel = this.getAttribute("data-toggle-label") || "";
		this._toggleInput = this._toggleLabel !== "";
		this._inputCollapsed = this._toggleInput;
		this._remoteEndpoint = this.getAttribute("data-endpoint") || null;
		this._remoteResultKey = this.getAttribute("data-result-key") || "items";
		this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), MSS_REMOTE_DEFAULT_MIN_CHARS);
		this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), MSS_REMOTE_DEFAULT_LIMIT);

		if (this.name && this.hiddenSelect) this.hiddenSelect.name = this.name;

		this.inputElement.addEventListener("input", this._handleInput);
		this.inputElement.addEventListener("keydown", this._handleKeyDown);
		this.inputElement.addEventListener("focus", this._handleFocus);
		this.inputElement.addEventListener("blur", this._handleBlur);
		this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown);
		this.optionsListElement.addEventListener("click", this._handleOptionClick);
		this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick);
		this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick);
		if (this.toggleButton) {
			this.toggleButton.addEventListener("click", this._handleToggleClick);
		}

		// Setup external toggle button if specified
		const externalToggleId = this.getAttribute("data-external-toggle-id");
		if (externalToggleId) {
			this.externalToggleButton = document.getElementById(externalToggleId);
			if (this.externalToggleButton) {
				this.externalToggleButton.addEventListener("click", this._handleToggleClick);
			}
		}

		this._updateRootElementStateClasses();
		if (this.hasAttribute("value")) {
			const attrValue = this.getAttribute("value");
			try {
				this.value = JSON.parse(attrValue);
			} catch (e) {
				this.value = attrValue
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			}
		} else {
			this._renderSelectedItems();
			this._synchronizeHiddenSelect();
		}
		// Ensure selected items are rendered even if value is empty
		if (this._value.length === 0) {
			this._renderSelectedItems();
		}
		if (this.hasAttribute("disabled")) this.disabledCallback(true);
		if (this._toggleInput) {
			this._hideInputControls();
		}
		this._allowInitialCapture = false;
		if (!this._initialCaptured) {
			this._initialValue = [...this._value];
			this._initialOrder = [...this._value];
			this._initialCaptured = true;
		}
	}

	disconnectedCallback() {
		if (this.inputElement) {
			this.inputElement.removeEventListener("input", this._handleInput);
			this.inputElement.removeEventListener("keydown", this._handleKeyDown);
			this.inputElement.removeEventListener("focus", this._handleFocus);
			this.inputElement.removeEventListener("blur", this._handleBlur);
		}
		if (this.optionsListElement) {
			this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown);
			this.optionsListElement.removeEventListener("click", this._handleOptionClick);
		}
		if (this.createNewButton) this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick);
		if (this.selectedItemsContainer) this.selectedItemsContainer.removeEventListener("click", this._handleSelectedItemsContainerClick);
		if (this.toggleButton) this.toggleButton.removeEventListener("click", this._handleToggleClick);
		if (this.externalToggleButton) this.externalToggleButton.removeEventListener("click", this._handleToggleClick);
		clearTimeout(this._blurTimeout);
		if (this._remoteFetchTimeout) {
			clearTimeout(this._remoteFetchTimeout);
			this._remoteFetchTimeout = null;
		}
		this._cancelRemoteFetch();
	}

	static get observedAttributes() {
		return [
			"disabled",
			"name",
			"value",
			"placeholder",
			"show-create-button",
			"data-endpoint",
			"data-result-key",
			"data-minchars",
			"data-limit",
			"data-toggle-label",
		];
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
		else if (name === "name" && this.hiddenSelect) this.hiddenSelect.name = newValue;
		else if (name === "value" && this.inputElement) {
			try {
				this.value = JSON.parse(newValue);
			} catch (e) {
				this.value = newValue
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);
			}
		} else if (name === "placeholder") this.placeholder = newValue;
		else if (name === "show-create-button") this.showCreateButton = newValue;
		else if (name === "data-endpoint") this._remoteEndpoint = newValue || null;
		else if (name === "data-result-key") this._remoteResultKey = newValue || "items";
		else if (name === "data-minchars") this._remoteMinChars = this._parsePositiveInt(newValue, MSS_REMOTE_DEFAULT_MIN_CHARS);
		else if (name === "data-limit") this._remoteLimit = this._parsePositiveInt(newValue, MSS_REMOTE_DEFAULT_LIMIT);
		else if (name === "data-toggle-label") {
			this._toggleLabel = newValue || "";
			this._toggleInput = this._toggleLabel !== "";
		}
	}

	formAssociatedCallback(form) {}
	formDisabledCallback(disabled) {
		this.disabledCallback(disabled);
	}
	formResetCallback() {
		this.value = [];
		this._hideOptionsList();
		if (this.inputElement) this.inputElement.value = "";
		this.placeholder = this.getAttribute("placeholder") || "Search items...";
		this.showCreateButton = this.getAttribute("show-create-button") !== "false";
		this._updateRootElementStateClasses();
		this._renderSelectedItems();
		if (this._toggleInput) {
			this._hideInputControls();
		}
	}
	formStateRestoreCallback(state, mode) {
		this.value = Array.isArray(state) ? state : [];
		this._updateRootElementStateClasses();
	}

	captureInitialSelection() {
		this._initialValue = [...this._value];
		this._initialOrder = [...this._value];
		this._removedIds.clear();
		this._initialCaptured = true;
		this._renderSelectedItems();
	}

	_synchronizeHiddenSelect() {
		if (!this.hiddenSelect) return;
		this.hiddenSelect.innerHTML = "";
		this._value.forEach((id) => {
			const option = document.createElement("option");
			option.value = id;
			const itemData = this._getItemById(id);
			option.textContent = itemData ? itemData.name : id;
			option.selected = true;
			this.hiddenSelect.appendChild(option);
		});
	}
	_updateFormValue() {
		this.internals_.setFormValue(null);
		this._synchronizeHiddenSelect();
	}
	disabledCallback(disabled) {
		if (this.inputElement) this.inputElement.disabled = disabled;
		if (this.createNewButton) this.createNewButton.disabled = disabled;
		this.toggleAttribute("disabled", disabled);
		this.querySelectorAll(`.${MSS_SELECTED_ITEM_DELETE_BTN_CLASS}`).forEach((btn) => (btn.disabled = disabled));
		if (this.hiddenSelect) this.hiddenSelect.disabled = disabled;
		if (disabled) this._hideOptionsList();
	}
	_updateRootElementStateClasses() {
		this.classList.toggle(MSS_STATE_NO_SELECTION, this._value.length === 0);
		this.classList.toggle(MSS_STATE_HAS_SELECTION, this._value.length > 0);
		this.classList.toggle(MSS_STATE_LIST_OPEN, this._isOptionsListVisible);
	}
	_render() {
		const componentId = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
		if (!this.id) this.setAttribute("id", componentId);
		const toggleLabel = this.getAttribute("data-toggle-label") || "";
		const toggleInput = toggleLabel !== "";
		const inputHiddenClass = toggleInput ? "hidden" : "";
		this.innerHTML = `
                    <style>
                        .${MSS_HIDDEN_SELECT_CLASS} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${MSS_COMPONENT_WRAPPER_CLASS} relative">
                        <div class="${MSS_INLINE_ROW_CLASS} flex flex-wrap items-center gap-2">
                            <div class="${MSS_SELECTED_ITEMS_CONTAINER_CLASS} flex flex-wrap items-center gap-1 min-h-[30px]" aria-live="polite" tabindex="-1"></div>
                            ${toggleInput ? `<button type="button" class="${MSS_TOGGLE_BUTTON_CLASS}">${toggleLabel}</button>` : ""}
                            <div class="${MSS_INPUT_CONTROLS_CONTAINER_CLASS} flex items-center gap-2 ${inputHiddenClass}">
                                <div class="${MSS_INPUT_WRAPPER_CLASS} relative rounded-md flex items-center flex-grow">
                                    <input type="text"
                                           class="${MSS_TEXT_INPUT_CLASS} w-full outline-none bg-transparent"
                                           placeholder="${this.placeholder}"
                                           aria-autocomplete="list"
                                           aria-expanded="${this._isOptionsListVisible}"
                                           aria-controls="options-list-${componentId}"
                                           autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                                </div>
                                <button type="button" class="${MSS_CREATE_NEW_BUTTON_CLASS} ${!this.showCreateButton ? "hidden" : ""}" title="Create new item from input">+</button>
                            </div>
                        </div>
                        <ul id="options-list-${componentId}" role="listbox" class="${MSS_OPTIONS_LIST_CLASS} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${componentId}" class="${MSS_HIDDEN_SELECT_CLASS}" aria-hidden="true"></select>
                    </div>
                `;
	}
	_createSelectedItemElement(itemId) {
		const itemData = this._getItemById(itemId);
		if (!itemData) return null;
		const fragment = this.selectedItemTemplate.content.cloneNode(true);
		const pillEl = fragment.firstElementChild;
		const textEl = pillEl.querySelector('[data-ref="textEl"]');
		const detailEl = pillEl.querySelector('[data-ref="detailEl"]'); // This now uses MSS_SELECTED_ITEM_PILL_DETAIL_CLASS
		const editLink = pillEl.querySelector('[data-ref="editLink"]');
		const deleteBtn = pillEl.querySelector('[data-ref="deleteBtn"]');
		textEl.textContent = this._normalizeText(itemData.name);
		const detailText = this._normalizeText(itemData.additional_data);
		if (detailText) {
			detailEl.textContent = `(${detailText})`;
			detailEl.classList.remove("hidden"); // Toggle visibility via JS
		} else {
			detailEl.textContent = "";
			detailEl.classList.add("hidden"); // Toggle visibility via JS
		}
		const isRemoved = this._removedIds.has(itemId);
		const isNew = !this._initialValue.includes(itemId);
		if (isNew) {
			const newBadge = document.createElement("span");
			newBadge.className = "ml-1 text-xs text-gray-600";
			newBadge.textContent = "(Neu)";
			textEl.appendChild(newBadge);
		}
		if (isRemoved) {
			pillEl.classList.add("bg-red-100");
			pillEl.style.position = "relative";
		}
		if (editLink) {
			if (this._editBase && !isRemoved) {
				editLink.href = `${this._editBase}${itemId}${this._editSuffix}`;
				editLink.target = "_blank";
				editLink.rel = "noreferrer";
				editLink.classList.remove("hidden");
			} else {
				editLink.classList.add("hidden");
				editLink.removeAttribute("href");
				editLink.removeAttribute("target");
				editLink.removeAttribute("rel");
			}
		}
		deleteBtn.setAttribute("aria-label", isRemoved ? `Undo remove ${itemData.name}` : `Remove ${itemData.name}`);
		deleteBtn.dataset.id = itemId;
		deleteBtn.disabled = this.hasAttribute("disabled");
		deleteBtn.innerHTML = isRemoved ? '<span class="text-xs inline-flex items-center"><i class="ri-arrow-go-back-line"></i></span>' : "&times;";
		deleteBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this._handleDeleteSelectedItem(itemId);
		});
		return pillEl;
	}
	_renderSelectedItems() {
		if (!this.selectedItemsContainer) return;
		this.selectedItemsContainer.innerHTML = "";
		const removedInOrder = this._initialOrder.filter((id) => this._removedIds.has(id) && !this._value.includes(id));
		const displayIds = [...this._value, ...removedInOrder];
		if (displayIds.length === 0) {
			const emptyText = this.getAttribute("data-empty-text") || "Keine Auswahl...";
			// Start with hidden class - visibility will be managed by show/hide input controls
			const hiddenClass = this._inputCollapsed ? '' : 'hidden';
			this.selectedItemsContainer.innerHTML = `<span class="${MSS_NO_ITEMS_TEXT_CLASS} ${hiddenClass}">${emptyText}</span>`;
		} else {
			displayIds.forEach((id) => {
				const pillEl = this._createSelectedItemElement(id);
				if (pillEl) this.selectedItemsContainer.appendChild(pillEl);
			});
		}
		this._updateRootElementStateClasses();
	}
	_createOptionElement(itemData, index) {
		const fragment = this.optionTemplate.content.cloneNode(true);
		const li = fragment.firstElementChild;
		const nameEl = li.querySelector('[data-ref="nameEl"]');
		const detailEl = li.querySelector('[data-ref="detailEl"]');
		nameEl.textContent = this._normalizeText(itemData.name);
		const detailText = this._normalizeText(itemData.additional_data);
		detailEl.textContent = detailText ? `(${detailText})` : "";
		li.dataset.id = itemData.id;
		li.setAttribute("aria-selected", String(index === this._highlightedIndex));
		const optionElementId = `option-${this.id || "mss"}-${itemData.id}`;
		li.id = optionElementId;
		if (index === this._highlightedIndex) {
			li.classList.add(MSS_HIGHLIGHTED_OPTION_CLASS);
			if (this.inputElement) this.inputElement.setAttribute("aria-activedescendant", optionElementId);
		}
		return li;
	}
	_renderOptionsList() {
		if (!this.optionsListElement || !this.inputElement) return;
		this.optionsListElement.innerHTML = "";
		this.inputElement.removeAttribute("aria-activedescendant");
		if (this._filteredOptions.length === 0 || !this._isOptionsListVisible) {
			this.optionsListElement.classList.add("hidden");
			this.inputElement.setAttribute("aria-expanded", "false");
		} else {
			this.optionsListElement.classList.remove("hidden");
			this.inputElement.setAttribute("aria-expanded", "true");
			this._filteredOptions.forEach((item, index) => {
				const optionEl = this._createOptionElement(item, index);
				this.optionsListElement.appendChild(optionEl);
			});
			const highlightedElement = this.optionsListElement.querySelector(`.${MSS_HIGHLIGHTED_OPTION_CLASS}`);
			if (highlightedElement) {
				highlightedElement.scrollIntoView({ block: "nearest" });
				this.inputElement.setAttribute("aria-activedescendant", highlightedElement.id);
			}
		}
		this._updateRootElementStateClasses();
	}
	_handleSelectedItemsContainerClick(event) {
		if (event.target === this.selectedItemsContainer && this.inputElement && !this.inputElement.disabled) {
			this.inputElement.focus();
		}
	}
	_handleCreateNewButtonClick() {
		if (this.hasAttribute("disabled") || !this.showCreateButton) return;
		const inputValue = this.inputElement ? this.inputElement.value.trim() : "";
		this.dispatchEvent(
			new CustomEvent("createnew", {
				detail: { value: inputValue },
				bubbles: true,
				composed: true,
			}),
		);
	}
	_handleInput(event) {
		const searchTerm = event.target.value;
		if (this._remoteEndpoint) {
			this._handleRemoteInput(searchTerm);
			return;
		}
		if (searchTerm.length === 0) {
			this._filteredOptions = [];
			this._isOptionsListVisible = false;
		} else {
			const searchTermLower = searchTerm.toLowerCase();
			this._filteredOptions = this._options.filter((item) => {
				if (this._value.includes(item.id)) return false;
				const normalizedName = this._normalizeText(item.name);
				const nameMatch = normalizedName.toLowerCase().includes(searchTermLower);
				const detailValue = this._normalizeText(item.additional_data);
				const additionalDataMatch = detailValue && detailValue.toLowerCase().includes(searchTermLower);
				return nameMatch || additionalDataMatch;
			});
			this._isOptionsListVisible = this._filteredOptions.length > 0;
		}
		this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1;
		this._renderOptionsList();
	}
	_handleKeyDown(event) {
		if (this.inputElement.disabled) return;
		// Removed: Backspace on empty input to delete last item
		// if (event.key === "Backspace" && this.inputElement.value === "" && this._value.length > 0) {
		//      event.preventDefault();
		//      const lastItemId = this._value[this._value.length - 1];
		//      this._handleDeleteSelectedItem(lastItemId);
		//      return;
		// }
		if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
			if (event.key === "Enter" && this.inputElement.value.length > 0) {
				event.preventDefault();
			}
			if (event.key === "Escape") this._hideOptionsList();
			if ((event.key === "ArrowDown" || event.key === "ArrowUp") && this.inputElement.value.length > 0) {
				this._handleInput({ target: this.inputElement });
			}
			return;
		}
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length;
				this._renderOptionsList();
				break;
			case "ArrowUp":
				event.preventDefault();
				this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length;
				this._renderOptionsList();
				break;
			case "Enter":
				event.stopPropagation();
				event.preventDefault();
				if (this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex]) {
					this._selectItem(this._filteredOptions[this._highlightedIndex].id);
				}
				break;
			case "Escape":
				event.preventDefault();
				this._hideOptionsList();
				if (this._toggleInput) {
					this._hideInputControls();
				}
				break;
			case "Tab":
				this._hideOptionsList();
				break;
		}
	}
	_hideOptionsList() {
		this._isOptionsListVisible = false;
		this._highlightedIndex = -1;
		if (this.optionsListElement) this._renderOptionsList();
	}
	_handleFocus() {
		if (this.inputElement.disabled) return;
		if (this.inputWrapper) this.inputWrapper.classList.add(MSS_INPUT_WRAPPER_FOCUSED_CLASS);
		if (this.inputElement.value.length > 0) this._handleInput({ target: this.inputElement });
		this._updateRootElementStateClasses();
	}
	_blurTimeout = null;
	_handleBlur() {
		if (this.inputWrapper) this.inputWrapper.classList.remove(MSS_INPUT_WRAPPER_FOCUSED_CLASS);
		this._blurTimeout = setTimeout(() => {
			if (!this.contains(document.activeElement)) {
				this._hideOptionsList();
				if (this._toggleInput && (!this.inputElement || this.inputElement.value.trim() === "")) {
					this._hideInputControls();
				}
			}
		}, 150);
	}
	_handleOptionMouseDown(event) {
		event.preventDefault();
	}
	_handleOptionClick(event) {
		const li = event.target.closest("li[data-id]");
		if (li && li.dataset.id) this._selectItem(li.dataset.id);
	}
	_selectItem(itemId) {
		if (itemId && !this._value.includes(itemId)) this.value = [...this._value, itemId];
		if (this.inputElement) this.inputElement.value = "";
		this._filteredOptions = [];
		this._hideOptionsList();
		if (this._toggleInput) {
			this._hideInputControls();
		} else if (this.inputElement && !this.hasAttribute("disabled")) {
			this.inputElement.focus();
		}
	}
	_handleDeleteSelectedItem(itemId) {
		if (this._removedIds.has(itemId)) {
			this._removedIds.delete(itemId);
			if (!this._value.includes(itemId)) {
				this.value = [...this._value, itemId];
			} else {
				this._renderSelectedItems();
			}
			return;
		}
		if (this._initialValue.includes(itemId)) {
			this._removedIds.add(itemId);
			this.value = this._value.filter((id) => id !== itemId);
			return;
		}
		this.value = this._value.filter((id) => id !== itemId);
		if (this.inputElement && this.inputElement.value) this._handleInput({ target: this.inputElement });
		if (this.inputElement && !this.hasAttribute("disabled")) this.inputElement.focus();
	}

	_handleToggleClick(event) {
		event.preventDefault();
		this._showInputControls();
	}

	_showInputControls() {
		if (!this.inputControlsContainer) {
			return;
		}
		this.inputControlsContainer.classList.remove("hidden");
		if (this.toggleButton) {
			this.toggleButton.classList.add("hidden");
		}
		if (this._value.length === 0 && this.selectedItemsContainer) {
			const emptyText = this.selectedItemsContainer.querySelector(`.${MSS_NO_ITEMS_TEXT_CLASS}`);
			if (emptyText) {
				emptyText.classList.add("hidden");
			}
		}
		if (this.inputElement && !this.hasAttribute("disabled")) {
			this.inputElement.focus();
		}
		this._inputCollapsed = false;
	}

	_hideInputControls() {
		if (!this.inputControlsContainer) {
			return;
		}
		this.inputControlsContainer.classList.add("hidden");
		if (this.toggleButton) {
			this.toggleButton.classList.remove("hidden");
		}
		if (this._value.length === 0 && this.selectedItemsContainer) {
			const emptyText = this.selectedItemsContainer.querySelector(`.${MSS_NO_ITEMS_TEXT_CLASS}`);
			if (emptyText) {
				emptyText.classList.remove("hidden");
			}
		}
		this._hideOptionsList();
		this._inputCollapsed = true;
	}

	_parsePositiveInt(value, fallback) {
		if (!value) return fallback;
		const parsed = parseInt(value, 10);
		if (Number.isNaN(parsed) || parsed <= 0) {
			return fallback;
		}
		return parsed;
	}

	_handleRemoteInput(searchTerm) {
		if (this._remoteFetchTimeout) {
			clearTimeout(this._remoteFetchTimeout);
		}

		if (searchTerm.length < this._remoteMinChars) {
			this._filteredOptions = [];
			this._isOptionsListVisible = false;
			this._renderOptionsList();
			return;
		}

		this._remoteFetchTimeout = setTimeout(() => {
			this._fetchRemoteOptions(searchTerm);
		}, MSS_REMOTE_FETCH_DEBOUNCE_MS);
	}

	_cancelRemoteFetch() {
		if (this._remoteFetchController) {
			this._remoteFetchController.abort();
			this._remoteFetchController = null;
		}
	}

	async _fetchRemoteOptions(searchTerm) {
		if (!this._remoteEndpoint) return;

		this._cancelRemoteFetch();
		this.classList.add(MSS_LOADING_CLASS);

		const controller = new AbortController();
		this._remoteFetchController = controller;

		try {
			const url = new URL(this._remoteEndpoint, window.location.origin);
			url.searchParams.set("q", searchTerm);
			if (this._remoteLimit) {
				url.searchParams.set("limit", String(this._remoteLimit));
			}

			const response = await fetch(url.toString(), {
				headers: { Accept: "application/json" },
				signal: controller.signal,
				credentials: "same-origin",
			});

			if (!response.ok) {
				throw new Error(`Remote fetch failed with status ${response.status}`);
			}

			const payload = await response.json();
			if (controller.signal.aborted) {
				return;
			}

			const options = this._extractRemoteOptions(payload);
			this._applyRemoteResults(options);
		} catch (error) {
			if (controller.signal.aborted) {
				return;
			}
			console.error("MultiSelectSimple remote fetch error:", error);
			this._filteredOptions = [];
			this._isOptionsListVisible = false;
			this._renderOptionsList();
		} finally {
			if (this._remoteFetchController === controller) {
				this._remoteFetchController = null;
			}
			this.classList.remove(MSS_LOADING_CLASS);
		}
	}

	_extractRemoteOptions(payload) {
		if (!payload) return [];

		let entries = [];
		if (Array.isArray(payload)) {
			entries = payload;
		} else if (this._remoteResultKey && Array.isArray(payload[this._remoteResultKey])) {
			entries = payload[this._remoteResultKey];
		} else if (Array.isArray(payload.items)) {
			entries = payload.items;
		}

		return entries
			.map((entry) => {
				if (!entry) return null;
				const id = entry.id ?? entry.ID ?? entry.value ?? "";
				const name = entry.name ?? entry.title ?? entry.label ?? "";
				const detail = entry.detail ?? entry.additional_data ?? entry.annotation ?? "";
				const normalizedName = this._normalizeText(name);
				const detailText = this._normalizeText(detail);
				if (!id || !normalizedName) return null;
				return {
					id: String(id),
					name: normalizedName,
					additional_data: detailText,
				};
			})
			.filter(Boolean);
	}

	_applyRemoteResults(options) {
		const selected = new Set(this._value);
		const merged = new Map();

		this._options.forEach((opt) => {
			if (opt?.id) {
				merged.set(opt.id, opt);
			}
		});

		options.forEach((opt) => {
			if (opt?.id) {
				merged.set(opt.id, opt);
			}
		});

		this._options = Array.from(merged.values());
		this._filteredOptions = options.filter((opt) => opt && !selected.has(opt.id));
		this._isOptionsListVisible = this._filteredOptions.length > 0;
		this._highlightedIndex = this._isOptionsListVisible ? 0 : -1;
		this._renderOptionsList();
	}

	_normalizeText(rawValue) {
		if (rawValue === null || rawValue === undefined) {
			return "";
		}

		let text = String(rawValue).trim();
		if (!text) {
			return "";
		}

		const first = text[0];
		const last = text[text.length - 1];
		if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
			text = text.slice(1, -1).trim();
			if (!text) {
				return "";
			}
		}

		return text;
	}
}
