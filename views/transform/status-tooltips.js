import tippy from "tippy.js";

/**
 * Tippy v6 natively reads the `data-tippy-content` attribute as tooltip content,
 * and any other `data-tippy-*` attribute as a per-element prop override (e.g.
 * `data-tippy-placement="top"`).
 *
 * We use this selector to find every element that wants a tippy tooltip.
 */
const TIPPY_SELECTOR = "[data-tippy-content]";

/**
 * Initialize tippy.js tooltips on all matching elements within `root`.
 * Safe to call multiple times — elements that already have a tippy instance
 * (indicated by `el._tippy`) are skipped so we never double-initialise.
 *
 * Default placement is "right" (suitable for status icons inline with text);
 * individual elements can override with `data-tippy-placement="top"` etc.
 *
 * @param {Element|Document} root - Scope to search within. Pass the HTMX swap
 *   target (event.detail.target) or a newly loaded element (event.detail.elt)
 *   so only fresh content is processed.
 */
export function initStatusTooltips(root = document) {
	const scope = root instanceof Element ? root : document;

	// Collect uninitialized candidates inside scope …
	const candidates = Array.from(scope.querySelectorAll(TIPPY_SELECTOR)).filter((el) => !el._tippy);

	// … and also check the root element itself (htmx:load passes the element directly)
	if (root instanceof Element && root.matches(TIPPY_SELECTOR) && !root._tippy) {
		candidates.unshift(root);
	}

	if (!candidates.length) return;

	tippy(candidates, {
		// Default placement; overridden per element via data-tippy-placement
		placement: "right",
		arrow: true,
		// Short delay so it doesn't flash on quick mouse-overs;
		// hides quickly so it doesn't block interactions
		delay: [400, 100],
		duration: [150, 100],
	});
}
