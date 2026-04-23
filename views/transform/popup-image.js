export class PopupImage extends HTMLElement {
	constructor() {
		super();
		this.overlay = null;
		this._others = null;
		this._thisindex = -1;
		this._preview = null;
		this._description = null;
		this._imageURL = "";
		this._fullImageURL = "";
		this._hideDLButton = false;
	}

	connectedCallback() {
		this.classList.add("cursor-pointer");
		this.classList.add("select-none");
		this._imageURL = this.getAttribute("data-image-url") || "";
		this._fullImageURL = this.getAttribute("data-full-image-url") || this._imageURL;
		this._hideDLButton = this.getAttribute("data-hide-dl-button") || false;
		this._preview = this.querySelector("img");
		this._description = this.querySelector(".image-description");

		if (this._preview) {
			this._preview.addEventListener("click", () => {
				this.showOverlay();
			});
		}

		let enclosing = this.closest("image-reel, .image-reel");
		if (!enclosing) {
			enclosing = document;
		}

		this._others = Array.from(enclosing.querySelectorAll("popup-image:not(.hidden)"));
		this._thisindex = this._others.indexOf(this);
	}

	disconnectedCallback() {
		// Optionally remove the overlay if the element is removed from the DOM
		if (this.overlay && this.overlay.parentNode) {
			this.overlay.parentNode.removeChild(this.overlay);
		}
	}

	Keys(evt) {
		if (evt.repeat) {
			return;
		}
		evt.preventDefault();
		if (evt.key === "ArrowRight") {
			this.next();
		} else if (evt.key === "ArrowLeft") {
			this.prev();
		} else if (evt.key === "Escape") {
			this.hideOverlay();
		}
	}

	next() {
		if (this._others[this._thisindex + 1]) {
			this.hideOverlay();
			this._others[this._thisindex + 1].showOverlay();
		} else {
			document.addEventListener("keydown", this.Keys.bind(this), { once: true });
		}
	}

	prev() {
		if (this._others[this._thisindex - 1]) {
			this.hideOverlay();
			this._others[this._thisindex - 1].showOverlay();
		} else {
			document.addEventListener("keydown", this.Keys.bind(this), { once: true });
		}
	}

	showOverlay() {
		this.overlay = document.createElement("div");
		this.overlay.classList.add(
			"fixed",
			"inset-0",
			"z-50",
			"bg-black/70",
			"flex",
			"items-center",
			"justify-center",
			"p-4",
		);

		this.overlay.innerHTML = `
      <div class="relative w-max max-w-dvw max-h-dvh shadow-lg flex flex-col items-center justify-center gap-4">
				<div>
				<div class="absolute -right-16 text-white text-4xl flex flex-col">
					<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Close popup" id="closebutton">
						<i class="ri-close-fill text-4xl"></i>
					</button>
						${this.downloadButton()}
						${this.nextButton()}
						${this.prevButton()}
				</div>
        <img
          src="${this._fullImageURL}"
          alt="Popup Image"
          class="full max-h-[80vh] max-w-[80vw] object-contain block relative ${this.descriptionImgClass()}"
        />
				${this.description()}
					</div>
      </div>
    `;

		const closeButton = this.overlay.querySelector("#closebutton");
		if (closeButton) {
			closeButton.addEventListener("click", () => {
				this.hideOverlay();
			});
		}

		const nextButton = this.overlay.querySelector("#nextbtn");
		if (nextButton) {
			nextButton.addEventListener("click", this.next.bind(this));
		}

		const prevButton = this.overlay.querySelector("#prevbtn");
		if (prevButton) {
			prevButton.addEventListener("click", this.prev.bind(this));
		}

		this.overlay.addEventListener("click", (evt) => {
			if (evt.target === this.overlay) {
				this.hideOverlay();
			}
		});

		document.addEventListener("keydown", this.Keys.bind(this), { once: true });
		document.body.appendChild(this.overlay);
	}

	descriptionImgClass() {
		if (!this.description) {
			return "0";
		}
		return "";
	}

	nextButton() {
		if (!this._others[this._thisindex + 1]) {
			return "";
		}

		return `
			<span data-tippy-placement="right" data-tippy-content="Nächstes Bild">
				<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Next image" id="nextbtn">
					<i class="ri-arrow-right-box-line"></i>
				</button>
			</span>
		`;
	}

	prevButton() {
		if (!this._others[this._thisindex - 1]) {
			return "";
		}

		return `
			<span data-tippy-placement="right" data-tippy-content="Vorheriges Bild">
				<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Previous image" id="prevbtn">
					<i class="ri-arrow-left-box-line"></i>
				</button>
			</span>
		`;
	}

	description() {
		if (!this._description) {
			return "";
		}

		return `
        <div class="font-serif text-left description-content mt-3 text-slate-900 ">
					<div class="max-w-[80ch] hyphens-auto px-6 py-2 bg-stone-50 shadow-lg">
          ${this._description.innerHTML}
						</div>
        </div>
			`;
	}

	downloadButton() {
		if (this._hideDLButton) {
			return "";
		}

		return `
					<span data-tippy-placement="right" data-tippy-content="Bild herunterladen">
						<a href="${this._fullImageURL}" target="_blank" class="text-white no-underline hover:text-gray-300"><i class="ri-file-download-line"></i></a>
					</span>
		`;
	}

	hideOverlay() {
		this.overlay.parentNode.removeChild(this.overlay);
		this.overlay = null;
	}
}
