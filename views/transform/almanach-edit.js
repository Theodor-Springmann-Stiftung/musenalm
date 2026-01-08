export class AlmanachEditPage extends HTMLElement {
	constructor() {
		super();
		this._pendingAgent = null;
	}

	connectedCallback() {
		this._initForm();
		this._initPlaces();
	}

	_initForm() {
		const form = this.querySelector("#changealmanachform");
		if (form && typeof window.FormLoad === "function") {
			window.FormLoad(form);
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
		const initialPlaces = this._parseJSONAttr(placesSelect, "data-initial-options") || [];
		const initialPlaceIds = this._parseJSONAttr(placesSelect, "data-initial-values") || [];

		if (initialPlaces.length > 0 && typeof placesSelect.setOptions === "function") {
			placesSelect.setOptions(initialPlaces);
		}
		if (initialPlaceIds.length > 0) {
			placesSelect.value = initialPlaceIds;
		}
	}

}
