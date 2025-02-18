import "./site.css";

const ATTR_XSLT_ONLOAD = "script[xslt-onload]";
const ATTR_XSLT_TEMPLATE = "xslt-template";
const ATTR_XSLT_STATE = "xslt-transformed";

const xslt_processors = new Map();

function setup_xslt() {
	let els = htmx.findAll(ATTR_XSLT_ONLOAD);
	for (let element of els) {
		transform_xslt(element);
	}
}

function transform_xslt(element) {
	if (
		element.getAttribute(ATTR_XSLT_STATE) === "true" ||
		!element.hasAttribute(ATTR_XSLT_TEMPLATE)
	) {
		return;
	}

	let templateId = "#" + element.getAttribute(ATTR_XSLT_TEMPLATE);
	let processor = xslt_processors.get(templateId);
	if (!processor) {
		let template = htmx.find(templateId);
		if (template) {
			let content = template.innerHTML
				? new DOMParser().parseFromString(template.innerHTML, "application/xml")
				: template.contentDocument;
			processor = new XSLTProcessor();
			processor.importStylesheet(content);
			xslt_processors.set(templateId, processor);
		} else {
			throw new Error("Unknown XSLT template: " + templateId);
		}
	}

	let data = new DOMParser().parseFromString(element.innerHTML, "application/xml");
	let frag = processor.transformToFragment(data, document);
	let s = new XMLSerializer().serializeToString(frag);
	element.outerHTML = s;
}

function setup_templates() {
	let templates = document.querySelectorAll("template[simple]");
	templates.forEach((template) => {
		let templateId = template.getAttribute("id");
		let templateContent = template.content;

		customElements.define(
			templateId,
			class extends HTMLElement {
				constructor() {
					super();
					this.appendChild(templateContent.cloneNode(true));
					this.slots = this.querySelectorAll("slot");
				}

				connectedCallback() {
					let toremove = [];
					this.slots.forEach((tslot) => {
						let slotName = tslot.getAttribute("name");
						let slotContent = this.querySelector(`[slot="${slotName}"]`);
						if (slotContent) {
							tslot.replaceWith(slotContent.cloneNode(true));
							toremove.push(slotContent);
						}
					});
					toremove.forEach((element) => {
						element.remove();
					});
				}
			},
		);
	});
}

// INFO: This is intended to be callled once on website load
function setup() {
	setup_xslt();

	htmx.on("htmx:load", function (_) {
		// INFO: We can instead use afterSettle; and also clear the map with
		// xslt_processors.clear();
		setup_xslt();
	});

	setup_templates();
}

function setMenuActive(url) {
	if (!url) {
		url = window.location.href;
	}
	const menus = document.querySelectorAll("nav");
	if (menus && menus.length > 0) {
		for (const menu of menus) {
			const links = menu.querySelectorAll("a, [data-url]");
			links.forEach((link) => {
				if (link.dataset.url && link.dataset.url !== "") {
					let fullurl = window.location.origin + link.dataset.url;
					if (url.startsWith(fullurl)) {
						link.setAttribute("aria-current", "page");
					} else {
						link.removeAttribute("aria-current");
					}
				} else if (link.href) {
					if (url.startsWith(link.href)) {
						link.setAttribute("aria-current", "page");
					} else {
						link.removeAttribute("aria-current");
					}
				}
			});
		}
	}
}

export { setup, setMenuActive };
