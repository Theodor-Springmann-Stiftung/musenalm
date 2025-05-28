export class ImageReel extends HTMLElement {
	#minWidth = 176;

	constructor() {
		super();
		this._images = [];
	}

	connectedCallback() {
		this._images = Array.from(this.querySelectorAll(".primages"));
		this.calculateShownImages();
		const rObs = new ResizeObserver((__, _) => {
			this.calculateShownImages();
		});

		this._resizeObserver = rObs;
		rObs.observe(this);
	}

	disconnectedCallback() {
		this._resizeObserver.unobserve(this);
	}

	calculateShownImages() {
		const c = this.getBoundingClientRect();
		console.log(c);
		const fits = Math.floor(c.width / (this.#minWidth + 10));
		for (let i = 0; i < this._images.length; i++) {
			if (i < fits - 1) {
				this._images[i].classList.remove("hidden");
			} else {
				this._images[i].classList.add("hidden");
			}
		}
	}
}
