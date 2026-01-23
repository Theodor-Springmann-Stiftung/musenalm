export class ScrollButton extends HTMLElement {
	constructor() {
		super();
		this.handleScroll = this.handleScroll.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
	}

	connectedCallback() {
		// Insert Tailwind-styled button in light DOM
		this.innerHTML = `
          <button
            class="
              scroll-to-top
              fixed bottom-12 right-8 z-50
              hidden
              bg-gray-800 text-white
              p-2
              rounded-md
              cursor-pointer
              text-2xl
              hover:opacity-80
              transition-opacity
              border-0
            "
            aria-label="Scroll to top"
          >
					<i class="ri-arrow-up-double-line"></i>
          </button>
        `;

		this._button = this.querySelector(".scroll-to-top");

		window.addEventListener("scroll", this.handleScroll);
		this._button.addEventListener("click", this.scrollToTop);
	}

	disconnectedCallback() {
		window.removeEventListener("scroll", this.handleScroll);
		this._button.removeEventListener("click", this.scrollToTop);
	}

	handleScroll() {
		const scrollTop = window.scrollY || document.documentElement.scrollTop;
		if (scrollTop > 300) {
			this._button.classList.remove("hidden");
		} else {
			this._button.classList.add("hidden");
		}
	}

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}
}
