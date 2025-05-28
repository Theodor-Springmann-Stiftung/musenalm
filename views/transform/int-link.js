export class IntLink extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// Basic styling to mimic a link.
		this.style.cursor = "pointer";
		this.addEventListener("click", this.handleClick);
	}

	disconnectedCallback() {
		this.removeEventListener("click", this.handleClick);
	}

	handleClick(event) {
		const selector = this.getAttribute("data-jump");
		if (selector) {
			const target = document.querySelector(selector);
			if (target) {
				target.scrollIntoView({ behavior: "smooth" });
			} else {
				console.warn(`No element found for selector: ${selector}`);
			}
		}
	}
}
