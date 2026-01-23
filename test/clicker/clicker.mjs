import { chromium } from "playwright";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
};

const baseUrl = getArg("base", "http://localhost:8090/reihen");
const workers = Number.parseInt(getArg("workers", "20"), 10);
const steps = Number.parseInt(getArg("steps", "200"), 10);
const minDelay = Number.parseInt(getArg("minDelay", "2000"), 10);
const maxDelay = Number.parseInt(getArg("maxDelay", "30000"), 10);
const timeout = Number.parseInt(getArg("timeout", "10000"), 10);
const startStagger = Number.parseInt(getArg("startStagger", "500"), 10);
const typeChance = Number.parseFloat(getArg("typeChance", "0.8"));
const enterChance = Number.parseFloat(getArg("enterChance", "0.35"));
const postChance = Number.parseFloat(getArg("postChance", "0.15"));
const minTypeLen = Number.parseInt(getArg("minTypeLen", "3"), 10);
const maxTypeLen = Number.parseInt(getArg("maxTypeLen", "5"), 10);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomText = (minLen, maxLen) => {
	const chars = "abcdefghijklmnopqrstuvwxyzäöüß ";
	const len = rand(minLen, maxLen);
	let out = "";
	for (let i = 0; i < len; i += 1) {
		out += chars[Math.floor(Math.random() * chars.length)];
	}
	return out.trim() || "test";
};

const pickAndClick = async (page) => {
  return page.evaluate(() => {
    const origin = window.location.origin;
    const links = Array.from(document.querySelectorAll("a[href]"));
    const candidates = links.filter((a) => {
      const raw = a.getAttribute("href") || "";
      if (!raw || raw.startsWith("#")) return false;
      if (raw.startsWith("javascript:")) return false;
      if (raw.startsWith("mailto:")) return false;
      if (a.getAttribute("target") === "_blank") return false;
      if (a.getAttribute("aria-disabled") === "true") return false;
      const url = new URL(raw, window.location.href);
      const path = `${url.pathname}${url.search}`.toLowerCase();
      if (path.includes("logout") || path.includes("delete") || path.includes("/login")) return false;
      if (url.origin !== origin) return false;
      return true;
    });
    if (!candidates.length) return null;
    const link = candidates[Math.floor(Math.random() * candidates.length)];
    const href = link.href;
    const clickerId = `clicker-${Math.random().toString(36).slice(2)}`;
    link.setAttribute("data-clicker-id", clickerId);
    return { href, clickerId };
  });
};

const pickAndFocusInput = async (page) => {
	return page.evaluate(() => {
		const candidates = Array.from(document.querySelectorAll("input, textarea")).filter((el) => {
			if (!(el instanceof HTMLElement)) return false;
			if (el.closest("[aria-hidden='true']")) return false;
			if (el.closest("[data-htmx-busy='true']")) return false;
			if (el.hasAttribute("disabled") || el.hasAttribute("readonly")) return false;
			if (el instanceof HTMLInputElement) {
				const type = (el.type || "text").toLowerCase();
				if (["hidden", "password", "checkbox", "radio", "file", "submit", "button"].includes(type)) {
					return false;
				}
			}
			if (el.offsetParent === null) return false;
			return true;
		});
		if (!candidates.length) return null;
		const el = candidates[Math.floor(Math.random() * candidates.length)];
		el.focus();
		return {
			tag: el.tagName.toLowerCase(),
			id: el.id || "",
			name: el.getAttribute("name") || "",
			placeholder: el.getAttribute("placeholder") || "",
		};
	});
};

const submitRandomPostForm = async (page) => {
	return page.evaluate(() => {
		const forms = Array.from(document.querySelectorAll("form")).filter((form) => {
			if (!(form instanceof HTMLFormElement)) return false;
			const method = (form.getAttribute("method") || "get").toLowerCase();
			if (method !== "post") return false;
			const action = (form.getAttribute("action") || "").toLowerCase();
			if (action.includes("/login") || action.includes("logout") || action.includes("delete")) return false;
			if (form.hasAttribute("disabled")) return false;
			if (form.closest("[aria-hidden='true']")) return false;
			if (form.closest("[data-htmx-busy='true']")) return false;
			return true;
		});
		if (!forms.length) return null;
		const form = forms[Math.floor(Math.random() * forms.length)];
		const submit = form.querySelector("button[type='submit'], input[type='submit']");
		if (submit instanceof HTMLElement) {
			submit.click();
		} else {
			form.requestSubmit();
		}
		return form.getAttribute("action") || window.location.href;
	});
};

const runWorker = async (id, browser, delayMs) => {
	const context = await browser.newContext();
	const page = await context.newPage();
	page.setDefaultTimeout(timeout);
	const label = `worker-${id}`;
	try {
		if (delayMs > 0) {
			await sleep(delayMs);
		}
		await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
		for (let i = 0; i < steps; i += 1) {
			const clickInfo = await pickAndClick(page);
			if (clickInfo) {
				const selector = `[data-clicker-id="${clickInfo.clickerId}"]`;
				await page.click(selector).catch(() => {});
				console.log(`${label}: click ${clickInfo.href}`);
			} else {
				console.log(`${label}: no candidates`);
			}
			await page.waitForLoadState("domcontentloaded").catch(() => {});
			await page.waitForTimeout(200);
			const currentUrl = page.url();
			if (currentUrl) {
				console.log(`${label}: at ${currentUrl}`);
			}
			if (Math.random() < typeChance) {
				const focused = await pickAndFocusInput(page);
				if (focused) {
					const text = randomText(minTypeLen, maxTypeLen);
					await page.keyboard.type(text, { delay: rand(10, 80) });
					console.log(
						`${label}: type \"${text}\" into ${focused.tag}${focused.id ? `#${focused.id}` : ""}${focused.name ? `[name=\"${focused.name}\"]` : ""}`,
					);
					if (focused.tag !== "textarea" && Math.random() < enterChance) {
						await page.keyboard.press("Enter");
						console.log(`${label}: press Enter`);
					}
				} else {
					console.log(`${label}: no inputs to type`);
				}
			} else {
				console.log(`${label}: skip typing`);
			}
			if (Math.random() < postChance) {
				const action = await submitRandomPostForm(page);
				if (action) {
					console.log(`${label}: submit POST ${action}`);
				} else {
					console.log(`${label}: no POST forms`);
				}
			}
			await sleep(rand(minDelay, maxDelay));
		}
  } catch (error) {
    console.error(`${label}: error`, error?.message || error);
  } finally {
    await context.close();
  }
};

const main = async () => {
  const browser = await chromium.launch({ headless: true });
  try {
		const runs = Array.from({ length: workers }, (_, idx) => runWorker(idx + 1, browser, idx * startStagger));
    await Promise.all(runs);
  } finally {
    await browser.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
