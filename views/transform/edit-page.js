export class EditPage extends HTMLElement {
	connectedCallback() {
		setTimeout(() => {
			const form = this.querySelector("form");
			if (form && typeof window.FormLoad === "function") {
				window.FormLoad(form);
			}
		}, 0);
	}
}
