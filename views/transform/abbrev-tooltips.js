export class AbbreviationTooltips extends HTMLElement {
	static get observedAttributes() {
		return ["data-text", "data-abbrevmap"];
	}

	static get defaultAbbrevMap() {
		return {
			"#": "Hinweis auf weitere Informationen in der Anmerkung.",
			$: "vermutlich",
			"+++": "Beiträge aus mehreren Almanachen interpoliert",
			B: "Blatt",
			BB: "Blätter",
			C: "Corrigenda",
			Diagr: "Diagramm",
			G: "Graphik",
			"G-Verz": "Verzeichnis der Kupfer u. ä.",
			GG: "Graphiken",
			Hrsg: "Herausgeber",
			"I-Verz": "Inhaltsverzeichnis",
			Kal: "Kalendarium",
			Kr: "Karte",
			MusB: "Musikbeigabe",
			MusBB: "Musikbeigaben",
			S: "Seite",
			SS: "Seiten",
			Sp: "Spiegel",
			T: "Titel",
			TG: "Titelgraphik, Titelportrait etc",
			"TG r": "Titelgraphik, Titelportrait etc recto",
			"TG v": "Titelgraphik, Titelportrait etc verso",
			Tab: "Tabelle",
			UG: "Umschlaggraphik",
			"UG r": "Umschlaggraphik recto",
			"UG v": "Umschlaggraphik verso",
			VB: "Vorsatzblatt",
			Vf: "Verfasser",
			VrlgM: "Verlagsmitteilung",
			Vrwrt: "Vorwort",
			ar: "arabische Paginierung",
			ar1: "erste arabische Paginierung",
			ar2: "zweite arabische Paginierung",
			ar3: "dritte arabische Paginierung",
			ar4: "vierte arabische Paginierung",
			ar5: "fünfte arabische Paginierung",
			ar6: "sechste arabische Paginierung",
			ar7: "siebte arabische Paginierung",
			gA: "graphische Anleitung",
			gT: "graphischer Titel",
			gTzA: "graphische Tanzanleitung",
			nT: "Nachtitel",
			röm: "römische Paginierung",
			röm1: "erste römische Paginierung",
			röm2: "zweite römische Paginierung",
			röm3: "dritte römische Paginierung",
			röm4: "vierte römische Paginierung",
			röm5: "fünfte römische Paginierung",
			röm6: "sechste römische Paginierung",
			röm7: "siebte römische Paginierung",
			vT: "Vortitel",
			zT: "Zwischentitel",
			"§§": "Hinweis auf Mängel im Almanach (Beschädigungen, fehlende Graphiken, unvollständige Sammlungen etc) in der Anmerkung",
		};
	}

	constructor() {
		super();
		this._abbrevMap = AbbreviationTooltips.defaultAbbrevMap;
	}

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback(name, oldVal, newVal) {
		if (oldVal !== newVal) {
			if (name === "data-abbrevmap") {
				this._parseAndSetAbbrevMap(newVal);
			}
			this.render();
		}
	}

	_parseAndSetAbbrevMap(jsonStr) {
		if (!jsonStr) {
			this._abbrevMap = AbbreviationTooltips.defaultAbbrevMap;
			return;
		}
		try {
			this._abbrevMap = JSON.parse(jsonStr);
		} catch {
			this._abbrevMap = AbbreviationTooltips.defaultAbbrevMap;
		}
	}

	setAbbrevMap(map) {
		if (typeof map === "object" && map !== null) {
			this._abbrevMap = map;
			this.render();
		}
	}

	get text() {
		return this.getAttribute("data-text") || "";
	}
	set text(value) {
		this.setAttribute("data-text", value);
	}

	render() {
		this.innerHTML = this.transformText(this.text, this._abbrevMap);
	}

	transformText(text, abbrevMap) {
		let result = "";
		let i = 0;

		while (i < text.length) {
			// Only match if at start of text or preceded by a boundary character
			if (i > 0 && !this.isSpaceOrPunct(text[i - 1])) {
				result += text[i];
				i++;
				continue;
			}

			const matchObj = this.findLongestAbbrevAt(text, i, abbrevMap);
			if (matchObj) {
				const { match, meaning } = matchObj;
				result += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${meaning}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${match}
              </span>
            </tool-tip>
          `;
				i += match.length;
			} else {
				result += text[i];
				i++;
			}
		}

		return result;
	}

	findLongestAbbrevAt(text, i, abbrevMap) {
		let bestKey = null;
		let bestLength = 0;

		for (const key of Object.keys(abbrevMap)) {
			if (text.startsWith(key, i)) {
				if (key.length > bestLength) {
					bestKey = key;
					bestLength = key.length;
				}
			}
		}

		if (bestKey) {
			return { match: bestKey, meaning: abbrevMap[bestKey] };
		}
		return null;
	}

	isSpaceOrPunct(ch) {
		// Adjust if you want a different set of punctuation recognized
		return /\s|[.,;:!?]/.test(ch);
	}
}
