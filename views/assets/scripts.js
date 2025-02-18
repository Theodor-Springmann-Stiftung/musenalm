const f = "script[xslt-onload]", i = "xslt-template", m = "xslt-transformed", c = /* @__PURE__ */ new Map();
function u() {
  let t = htmx.findAll(f);
  for (let r of t)
    p(r);
}
function p(t) {
  if (t.getAttribute(m) === "true" || !t.hasAttribute(i))
    return;
  let r = "#" + t.getAttribute(i), o = c.get(r);
  if (!o) {
    let s = htmx.find(r);
    if (s) {
      let l = s.innerHTML ? new DOMParser().parseFromString(s.innerHTML, "application/xml") : s.contentDocument;
      o = new XSLTProcessor(), o.importStylesheet(l), c.set(r, o);
    } else
      throw new Error("Unknown XSLT template: " + r);
  }
  let a = new DOMParser().parseFromString(t.innerHTML, "application/xml"), e = o.transformToFragment(a, document), n = new XMLSerializer().serializeToString(e);
  t.outerHTML = n;
}
function d() {
  document.querySelectorAll("template[simple]").forEach((r) => {
    let o = r.getAttribute("id"), a = r.content;
    customElements.define(
      o,
      class extends HTMLElement {
        constructor() {
          super(), this.appendChild(a.cloneNode(!0)), this.slots = this.querySelectorAll("slot");
        }
        connectedCallback() {
          let e = [];
          this.slots.forEach((n) => {
            let s = n.getAttribute("name"), l = this.querySelector(`[slot="${s}"]`);
            l && (n.replaceWith(l.cloneNode(!0)), e.push(l));
          }), e.forEach((n) => {
            n.remove();
          });
        }
      }
    );
  });
}
function h() {
  u(), htmx.on("htmx:load", function(t) {
    u();
  }), d();
}
function T(t) {
  t || (t = window.location.href);
  const r = document.querySelectorAll("nav");
  if (r && r.length > 0)
    for (const o of r)
      o.querySelectorAll("a, [data-url]").forEach((e) => {
        if (e.dataset.url && e.dataset.url !== "") {
          let n = window.location.origin + e.dataset.url;
          t.startsWith(n) ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current");
        } else e.href && (t.startsWith(e.href) ? e.setAttribute("aria-current", "page") : e.removeAttribute("aria-current"));
      });
}
export {
  T as setMenuActive,
  h as setup
};
