var wo = Object.defineProperty;
var ns = (s) => {
  throw TypeError(s);
};
var ko = (s, t, e) => t in s ? wo(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var ee = (s, t, e) => ko(s, typeof t != "symbol" ? t + "" : t, e), yi = (s, t, e) => t.has(s) || ns("Cannot " + e);
var Ei = (s, t, e) => (yi(s, t, "read from private field"), e ? e.call(s) : t.get(s)), ie = (s, t, e) => t.has(s) ? ns("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), Me = (s, t, e, i) => (yi(s, t, "write to private field"), i ? i.call(s, e) : t.set(s, e), e), Be = (s, t, e) => (yi(s, t, "access private method"), e);
var Io = "2.1.16";
const kt = "[data-trix-attachment]", yn = { preview: { presentation: "gallery", caption: { name: !0, size: !0 } }, file: { caption: { size: !0 } } }, G = { default: { tagName: "div", parse: !1 }, quote: { tagName: "blockquote", nestable: !0 }, heading1: { tagName: "h1", terminal: !0, breakOnReturn: !0, group: !1 }, code: { tagName: "pre", terminal: !0, htmlAttributes: ["language"], text: { plaintext: !0 } }, bulletList: { tagName: "ul", parse: !1 }, bullet: { tagName: "li", listAttribute: "bulletList", group: !1, nestable: !0, test(s) {
  return ss(s.parentNode) === G[this.listAttribute].tagName;
} }, numberList: { tagName: "ol", parse: !1 }, number: { tagName: "li", listAttribute: "numberList", group: !1, nestable: !0, test(s) {
  return ss(s.parentNode) === G[this.listAttribute].tagName;
} }, attachmentGallery: { tagName: "div", exclusive: !0, terminal: !0, parse: !1, group: !1 } }, ss = (s) => {
  var t;
  return s == null || (t = s.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, rs = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i), Si = rs && parseInt(rs[1]);
var Ce = { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), recentAndroid: Si && Si > 12, samsungAndroid: Si && navigator.userAgent.match(/Android.*SM-/), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: typeof InputEvent < "u" && ["data", "getTargetRanges", "inputType"].every((s) => s in InputEvent.prototype) }, br = { ADD_ATTR: ["language"], SAFE_FOR_XML: !1, RETURN_DOM: !0 }, b = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", byte: "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption…", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL…", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
const Ro = [b.bytes, b.KB, b.MB, b.GB, b.TB, b.PB];
var vr = { prefix: "IEC", precision: 2, formatter(s) {
  switch (s) {
    case 0:
      return "0 ".concat(b.bytes);
    case 1:
      return "1 ".concat(b.byte);
    default:
      let t;
      this.prefix === "SI" ? t = 1e3 : this.prefix === "IEC" && (t = 1024);
      const e = Math.floor(Math.log(s) / Math.log(t)), i = (s / Math.pow(t, e)).toFixed(this.precision).replace(/0*$/, "").replace(/\.$/, "");
      return "".concat(i, " ").concat(Ro[e]);
  }
} };
const ii = "\uFEFF", _t = " ", _r = function(s) {
  for (const t in s) {
    const e = s[t];
    this[t] = e;
  }
  return this;
}, En = document.documentElement, Do = En.matches, k = function(s) {
  let { onElement: t, matchingSelector: e, withCallback: i, inPhase: n, preventDefault: r, times: o } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const a = t || En, c = e, h = n === "capturing", d = function(m) {
    o != null && --o == 0 && d.destroy();
    const p = At(m.target, { matchingSelector: c });
    p != null && (i == null || i.call(p, m, p), r && m.preventDefault());
  };
  return d.destroy = () => a.removeEventListener(s, d, h), a.addEventListener(s, d, h), d;
}, Ar = function(s) {
  let { bubbles: t, cancelable: e, attributes: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  t = t !== !1, e = e !== !1;
  const n = document.createEvent("Events");
  return n.initEvent(s, t, e), i != null && _r.call(n, i), n;
}, me = function(s) {
  let { onElement: t, bubbles: e, cancelable: i, attributes: n } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const r = t ?? En, o = Ar(s, { bubbles: e, cancelable: i, attributes: n });
  return r.dispatchEvent(o);
}, yr = function(s, t) {
  if ((s == null ? void 0 : s.nodeType) === 1) return Do.call(s, t);
}, At = function(s) {
  let { matchingSelector: t, untilNode: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  for (; s && s.nodeType !== Node.ELEMENT_NODE; ) s = s.parentNode;
  if (s != null) {
    if (t == null) return s;
    if (s.closest && e == null) return s.closest(t);
    for (; s && s !== e; ) {
      if (yr(s, t)) return s;
      s = s.parentNode;
    }
  }
}, Sn = (s) => document.activeElement !== s && Tt(s, document.activeElement), Tt = function(s, t) {
  if (s && t) for (; t; ) {
    if (t === s) return !0;
    t = t.parentNode;
  }
}, xi = function(s) {
  var t;
  if ((t = s) === null || t === void 0 || !t.parentNode) return;
  let e = 0;
  for (s = s.previousSibling; s; ) e++, s = s.previousSibling;
  return e;
}, yt = (s) => {
  var t;
  return s == null || (t = s.parentNode) === null || t === void 0 ? void 0 : t.removeChild(s);
}, Je = function(s) {
  let { onlyNodesOfType: t, usingFilter: e, expandEntityReferences: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const n = (() => {
    switch (t) {
      case "element":
        return NodeFilter.SHOW_ELEMENT;
      case "text":
        return NodeFilter.SHOW_TEXT;
      case "comment":
        return NodeFilter.SHOW_COMMENT;
      default:
        return NodeFilter.SHOW_ALL;
    }
  })();
  return document.createTreeWalker(s, n, e ?? null, i === !0);
}, K = (s) => {
  var t;
  return s == null || (t = s.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, _ = function(s) {
  let t, e, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  typeof s == "object" ? (i = s, s = i.tagName) : i = { attributes: i };
  const n = document.createElement(s);
  if (i.editable != null && (i.attributes == null && (i.attributes = {}), i.attributes.contenteditable = i.editable), i.attributes) for (t in i.attributes) e = i.attributes[t], n.setAttribute(t, e);
  if (i.style) for (t in i.style) e = i.style[t], n.style[t] = e;
  if (i.data) for (t in i.data) e = i.data[t], n.dataset[t] = e;
  return i.className && i.className.split(" ").forEach((r) => {
    n.classList.add(r);
  }), i.textContent && (n.textContent = i.textContent), i.childNodes && [].concat(i.childNodes).forEach((r) => {
    n.appendChild(r);
  }), n;
};
let ne;
const ge = function() {
  if (ne != null) return ne;
  ne = [];
  for (const s in G) {
    const t = G[s];
    t.tagName && ne.push(t.tagName);
  }
  return ne;
}, Ci = (s) => zt(s == null ? void 0 : s.firstChild), os = function(s) {
  let { strict: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { strict: !0 };
  return t ? zt(s) : zt(s) || !zt(s.firstChild) && function(e) {
    return ge().includes(K(e)) && !ge().includes(K(e.firstChild));
  }(s);
}, zt = (s) => Oo(s) && (s == null ? void 0 : s.data) === "block", Oo = (s) => (s == null ? void 0 : s.nodeType) === Node.COMMENT_NODE, Kt = function(s) {
  let { name: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (s) return pe(s) ? s.data === ii ? !t || s.parentNode.dataset.trixCursorTarget === t : void 0 : Kt(s.firstChild);
}, It = (s) => yr(s, kt), Er = (s) => pe(s) && (s == null ? void 0 : s.data) === "", pe = (s) => (s == null ? void 0 : s.nodeType) === Node.TEXT_NODE, xn = { level2Enabled: !0, getLevel() {
  return this.level2Enabled && Ce.supportsInputEvents ? 2 : 0;
}, pickFiles(s) {
  const t = _("input", { type: "file", multiple: !0, hidden: !0, id: this.fileInputId });
  t.addEventListener("change", () => {
    s(t.files), yt(t);
  }), yt(document.getElementById(this.fileInputId)), document.body.appendChild(t), t.click();
} };
var ze = { removeBlankTableCells: !1, tableCellSeparator: " | ", tableRowSeparator: `
` }, Dt = { bold: { tagName: "strong", inheritable: !0, parser(s) {
  const t = window.getComputedStyle(s);
  return t.fontWeight === "bold" || t.fontWeight >= 600;
} }, italic: { tagName: "em", inheritable: !0, parser: (s) => window.getComputedStyle(s).fontStyle === "italic" }, href: { groupTagName: "a", parser(s) {
  const t = "a:not(".concat(kt, ")"), e = s.closest(t);
  if (e) return e.getAttribute("href");
} }, strike: { tagName: "del", inheritable: !0 }, frozen: { style: { backgroundColor: "highlight" } } }, Sr = { getDefaultHTML: () => `<div class="trix-button-row">
      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="`.concat(b.bold, '" tabindex="-1">').concat(b.bold, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="`).concat(b.italic, '" tabindex="-1">').concat(b.italic, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="`).concat(b.strike, '" tabindex="-1">').concat(b.strike, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="`).concat(b.link, '" tabindex="-1">').concat(b.link, `</button>
      </span>

      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="`).concat(b.heading1, '" tabindex="-1">').concat(b.heading1, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="`).concat(b.quote, '" tabindex="-1">').concat(b.quote, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="`).concat(b.code, '" tabindex="-1">').concat(b.code, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="`).concat(b.bullets, '" tabindex="-1">').concat(b.bullets, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="`).concat(b.numbers, '" tabindex="-1">').concat(b.numbers, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="`).concat(b.outdent, '" tabindex="-1">').concat(b.outdent, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="`).concat(b.indent, '" tabindex="-1">').concat(b.indent, `</button>
      </span>

      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="`).concat(b.attachFiles, '" tabindex="-1">').concat(b.attachFiles, `</button>
      </span>

      <span class="trix-button-group-spacer"></span>

      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="`).concat(b.undo, '" tabindex="-1">').concat(b.undo, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="`).concat(b.redo, '" tabindex="-1">').concat(b.redo, `</button>
      </span>
    </div>

    <div class="trix-dialogs" data-trix-dialogs>
      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
        <div class="trix-dialog__link-fields">
          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="`).concat(b.urlPlaceholder, '" aria-label="').concat(b.url, `" data-trix-validate-href required data-trix-input>
          <div class="trix-button-group">
            <input type="button" class="trix-button trix-button--dialog" value="`).concat(b.link, `" data-trix-method="setAttribute">
            <input type="button" class="trix-button trix-button--dialog" value="`).concat(b.unlink, `" data-trix-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>`) };
const an = { interval: 5e3 };
var Le = Object.freeze({ __proto__: null, attachments: yn, blockAttributes: G, browser: Ce, css: { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" }, dompurify: br, fileSize: vr, input: xn, keyNames: { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" }, lang: b, parser: ze, textAttributes: Dt, toolbar: Sr, undo: an });
class M {
  static proxyMethod(t) {
    const { name: e, toMethod: i, toProperty: n, optional: r } = Mo(t);
    this.prototype[e] = function() {
      let o, a;
      var c, h;
      return i ? a = r ? (c = this[i]) === null || c === void 0 ? void 0 : c.call(this) : this[i]() : n && (a = this[n]), r ? (o = (h = a) === null || h === void 0 ? void 0 : h[e], o ? as.call(o, a, arguments) : void 0) : (o = a[e], as.call(o, a, arguments));
    };
  }
}
const Mo = function(s) {
  const t = s.match(Bo);
  if (!t) throw new Error("can't parse @proxyMethod expression: ".concat(s));
  const e = { name: t[4] };
  return t[2] != null ? e.toMethod = t[1] : e.toProperty = t[1], t[3] != null && (e.optional = !0), e;
}, { apply: as } = Function.prototype, Bo = new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");
var Li, Ti, wi;
class ye extends M {
  static box() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return t instanceof this ? t : this.fromUCS2String(t == null ? void 0 : t.toString());
  }
  static fromUCS2String(t) {
    return new this(t, ln(t));
  }
  static fromCodepoints(t) {
    return new this(cn(t), t);
  }
  constructor(t, e) {
    super(...arguments), this.ucs2String = t, this.codepoints = e, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
  }
  offsetToUCS2Offset(t) {
    return cn(this.codepoints.slice(0, Math.max(0, t))).length;
  }
  offsetFromUCS2Offset(t) {
    return ln(this.ucs2String.slice(0, Math.max(0, t))).length;
  }
  slice() {
    return this.constructor.fromCodepoints(this.codepoints.slice(...arguments));
  }
  charAt(t) {
    return this.slice(t, t + 1);
  }
  isEqualTo(t) {
    return this.constructor.box(t).ucs2String === this.ucs2String;
  }
  toJSON() {
    return this.ucs2String;
  }
  getCacheKey() {
    return this.ucs2String;
  }
  toString() {
    return this.ucs2String;
  }
}
const No = ((Li = Array.from) === null || Li === void 0 ? void 0 : Li.call(Array, "👼").length) === 1, Po = ((Ti = " ".codePointAt) === null || Ti === void 0 ? void 0 : Ti.call(" ", 0)) != null, Fo = ((wi = String.fromCodePoint) === null || wi === void 0 ? void 0 : wi.call(String, 32, 128124)) === " 👼";
let ln, cn;
ln = No && Po ? (s) => Array.from(s).map((t) => t.codePointAt(0)) : function(s) {
  const t = [];
  let e = 0;
  const { length: i } = s;
  for (; e < i; ) {
    let n = s.charCodeAt(e++);
    if (55296 <= n && n <= 56319 && e < i) {
      const r = s.charCodeAt(e++);
      (64512 & r) == 56320 ? n = ((1023 & n) << 10) + (1023 & r) + 65536 : e--;
    }
    t.push(n);
  }
  return t;
}, cn = Fo ? (s) => String.fromCodePoint(...Array.from(s || [])) : function(s) {
  return (() => {
    const t = [];
    return Array.from(s).forEach((e) => {
      let i = "";
      e > 65535 && (e -= 65536, i += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t.push(i + String.fromCharCode(e));
    }), t;
  })().join("");
};
let qo = 0;
class Bt extends M {
  static fromJSONString(t) {
    return this.fromJSON(JSON.parse(t));
  }
  constructor() {
    super(...arguments), this.id = ++qo;
  }
  hasSameConstructorAs(t) {
    return this.constructor === (t == null ? void 0 : t.constructor);
  }
  isEqualTo(t) {
    return this === t;
  }
  inspect() {
    const t = [], e = this.contentsForInspection() || {};
    for (const i in e) {
      const n = e[i];
      t.push("".concat(i, "=").concat(n));
    }
    return "#<".concat(this.constructor.name, ":").concat(this.id).concat(t.length ? " ".concat(t.join(", ")) : "", ">");
  }
  contentsForInspection() {
  }
  toJSONString() {
    return JSON.stringify(this);
  }
  toUTF16String() {
    return ye.box(this);
  }
  getCacheKey() {
    return this.id.toString();
  }
}
const Ot = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (s.length !== t.length) return !1;
  for (let e = 0; e < s.length; e++)
    if (s[e] !== t[e]) return !1;
  return !0;
}, Cn = function(s) {
  const t = s.slice(0);
  for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
  return t.splice(...i), t;
}, Ho = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/, $o = function() {
  const s = _("input", { dir: "auto", name: "x", dirName: "x.dir" }), t = _("textarea", { dir: "auto", name: "y", dirName: "y.dir" }), e = _("form");
  e.appendChild(s), e.appendChild(t);
  const i = function() {
    try {
      return new FormData(e).has(t.dirName);
    } catch {
      return !1;
    }
  }(), n = function() {
    try {
      return s.matches(":dir(ltr),:dir(rtl)");
    } catch {
      return !1;
    }
  }();
  return i ? function(r) {
    return t.value = r, new FormData(e).get(t.dirName);
  } : n ? function(r) {
    return s.value = r, s.matches(":dir(rtl)") ? "rtl" : "ltr";
  } : function(r) {
    const o = r.trim().charAt(0);
    return Ho.test(o) ? "rtl" : "ltr";
  };
}();
let ki = null, Ii = null, Ri = null, Ne = null;
const hn = () => (ki || (ki = jo().concat(Uo())), ki), D = (s) => G[s], Uo = () => (Ii || (Ii = Object.keys(G)), Ii), dn = (s) => Dt[s], jo = () => (Ri || (Ri = Object.keys(Dt)), Ri), xr = function(s, t) {
  Vo(s).textContent = t.replace(/%t/g, s);
}, Vo = function(s) {
  const t = document.createElement("style");
  t.setAttribute("type", "text/css"), t.setAttribute("data-tag-name", s.toLowerCase());
  const e = Wo();
  return e && t.setAttribute("nonce", e), document.head.insertBefore(t, document.head.firstChild), t;
}, Wo = function() {
  const s = ls("trix-csp-nonce") || ls("csp-nonce");
  if (s) {
    const { nonce: t, content: e } = s;
    return t == "" ? e : t;
  }
}, ls = (s) => document.head.querySelector("meta[name=".concat(s, "]")), cs = { "application/x-trix-feature-detection": "test" }, Cr = function(s) {
  const t = s.getData("text/plain"), e = s.getData("text/html");
  if (!t || !e) return t == null ? void 0 : t.length;
  {
    const { body: i } = new DOMParser().parseFromString(e, "text/html");
    if (i.textContent === t) return !i.querySelector("*");
  }
}, Lr = /Mac|^iP/.test(navigator.platform) ? (s) => s.metaKey : (s) => s.ctrlKey, Ln = (s) => setTimeout(s, 1), Tr = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const t = {};
  for (const e in s) {
    const i = s[e];
    t[e] = i;
  }
  return t;
}, Yt = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (Object.keys(s).length !== Object.keys(t).length) return !1;
  for (const e in s)
    if (s[e] !== t[e]) return !1;
  return !0;
}, x = function(s) {
  if (s != null) return Array.isArray(s) || (s = [s, s]), [hs(s[0]), hs(s[1] != null ? s[1] : s[0])];
}, gt = function(s) {
  if (s == null) return;
  const [t, e] = x(s);
  return un(t, e);
}, Ye = function(s, t) {
  if (s == null || t == null) return;
  const [e, i] = x(s), [n, r] = x(t);
  return un(e, n) && un(i, r);
}, hs = function(s) {
  return typeof s == "number" ? s : Tr(s);
}, un = function(s, t) {
  return typeof s == "number" ? s === t : Yt(s, t);
};
class wr extends M {
  constructor() {
    super(...arguments), this.update = this.update.bind(this), this.selectionManagers = [];
  }
  start() {
    this.started || (this.started = !0, document.addEventListener("selectionchange", this.update, !0));
  }
  stop() {
    if (this.started) return this.started = !1, document.removeEventListener("selectionchange", this.update, !0);
  }
  registerSelectionManager(t) {
    if (!this.selectionManagers.includes(t)) return this.selectionManagers.push(t), this.start();
  }
  unregisterSelectionManager(t) {
    if (this.selectionManagers = this.selectionManagers.filter((e) => e !== t), this.selectionManagers.length === 0) return this.stop();
  }
  notifySelectionManagersOfSelectionChange() {
    return this.selectionManagers.map((t) => t.selectionDidChange());
  }
  update() {
    this.notifySelectionManagersOfSelectionChange();
  }
  reset() {
    this.update();
  }
}
const Mt = new wr(), kr = function() {
  const s = window.getSelection();
  if (s.rangeCount > 0) return s;
}, fe = function() {
  var s;
  const t = (s = kr()) === null || s === void 0 ? void 0 : s.getRangeAt(0);
  if (t && !zo(t)) return t;
}, Ir = function(s) {
  const t = window.getSelection();
  return t.removeAllRanges(), t.addRange(s), Mt.update();
}, zo = (s) => ds(s.startContainer) || ds(s.endContainer), ds = (s) => !Object.getPrototypeOf(s), ue = (s) => s.replace(new RegExp("".concat(ii), "g"), "").replace(new RegExp("".concat(_t), "g"), " "), Tn = new RegExp("[^\\S".concat(_t, "]")), wn = (s) => s.replace(new RegExp("".concat(Tn.source), "g"), " ").replace(/\ {2,}/g, " "), us = function(s, t) {
  if (s.isEqualTo(t)) return ["", ""];
  const e = Di(s, t), { length: i } = e.utf16String;
  let n;
  if (i) {
    const { offset: r } = e, o = s.codepoints.slice(0, r).concat(s.codepoints.slice(r + i));
    n = Di(t, ye.fromCodepoints(o));
  } else n = Di(t, s);
  return [e.utf16String.toString(), n.utf16String.toString()];
}, Di = function(s, t) {
  let e = 0, i = s.length, n = t.length;
  for (; e < i && s.charAt(e).isEqualTo(t.charAt(e)); ) e++;
  for (; i > e + 1 && s.charAt(i - 1).isEqualTo(t.charAt(n - 1)); ) i--, n--;
  return { utf16String: s.slice(e, i), offset: e };
};
class X extends Bt {
  static fromCommonAttributesOfObjects() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    if (!t.length) return new this();
    let e = se(t[0]), i = e.getKeys();
    return t.slice(1).forEach((n) => {
      i = e.getKeysCommonToHash(se(n)), e = e.slice(i);
    }), e;
  }
  static box(t) {
    return se(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(...arguments), this.values = Ke(t);
  }
  add(t, e) {
    return this.merge(Ko(t, e));
  }
  remove(t) {
    return new X(Ke(this.values, t));
  }
  get(t) {
    return this.values[t];
  }
  has(t) {
    return t in this.values;
  }
  merge(t) {
    return new X(Go(this.values, Jo(t)));
  }
  slice(t) {
    const e = {};
    return Array.from(t).forEach((i) => {
      this.has(i) && (e[i] = this.values[i]);
    }), new X(e);
  }
  getKeys() {
    return Object.keys(this.values);
  }
  getKeysCommonToHash(t) {
    return t = se(t), this.getKeys().filter((e) => this.values[e] === t.values[e]);
  }
  isEqualTo(t) {
    return Ot(this.toArray(), se(t).toArray());
  }
  isEmpty() {
    return this.getKeys().length === 0;
  }
  toArray() {
    if (!this.array) {
      const t = [];
      for (const e in this.values) {
        const i = this.values[e];
        t.push(t.push(e, i));
      }
      this.array = t.slice(0);
    }
    return this.array;
  }
  toObject() {
    return Ke(this.values);
  }
  toJSON() {
    return this.toObject();
  }
  contentsForInspection() {
    return { values: JSON.stringify(this.values) };
  }
}
const Ko = function(s, t) {
  const e = {};
  return e[s] = t, e;
}, Go = function(s, t) {
  const e = Ke(s);
  for (const i in t) {
    const n = t[i];
    e[i] = n;
  }
  return e;
}, Ke = function(s, t) {
  const e = {};
  return Object.keys(s).sort().forEach((i) => {
    i !== t && (e[i] = s[i]);
  }), e;
}, se = function(s) {
  return s instanceof X ? s : new X(s);
}, Jo = function(s) {
  return s instanceof X ? s.values : s;
};
class kn {
  static groupObjects() {
    let t, e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], { depth: i, asTree: n } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    n && i == null && (i = 0);
    const r = [];
    return Array.from(e).forEach((o) => {
      var a;
      if (t) {
        var c, h, d;
        if ((c = o.canBeGrouped) !== null && c !== void 0 && c.call(o, i) && (h = (d = t[t.length - 1]).canBeGroupedWith) !== null && h !== void 0 && h.call(d, o, i)) return void t.push(o);
        r.push(new this(t, { depth: i, asTree: n })), t = null;
      }
      (a = o.canBeGrouped) !== null && a !== void 0 && a.call(o, i) ? t = [o] : r.push(o);
    }), t && r.push(new this(t, { depth: i, asTree: n })), r;
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], { depth: e, asTree: i } = arguments.length > 1 ? arguments[1] : void 0;
    this.objects = t, i && (this.depth = e, this.objects = this.constructor.groupObjects(this.objects, { asTree: i, depth: this.depth + 1 }));
  }
  getObjects() {
    return this.objects;
  }
  getDepth() {
    return this.depth;
  }
  getCacheKey() {
    const t = ["objectGroup"];
    return Array.from(this.getObjects()).forEach((e) => {
      t.push(e.getCacheKey());
    }), t.join("/");
  }
}
class Yo extends M {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), this.objects = {}, Array.from(t).forEach((e) => {
      const i = JSON.stringify(e);
      this.objects[i] == null && (this.objects[i] = e);
    });
  }
  find(t) {
    const e = JSON.stringify(t);
    return this.objects[e];
  }
}
class Xo {
  constructor(t) {
    this.reset(t);
  }
  add(t) {
    const e = ms(t);
    this.elements[e] = t;
  }
  remove(t) {
    const e = ms(t), i = this.elements[e];
    if (i) return delete this.elements[e], i;
  }
  reset() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return this.elements = {}, Array.from(t).forEach((e) => {
      this.add(e);
    }), t;
  }
}
const ms = (s) => s.dataset.trixStoreKey;
class Xe extends M {
  isPerforming() {
    return this.performing === !0;
  }
  hasPerformed() {
    return this.performed === !0;
  }
  hasSucceeded() {
    return this.performed && this.succeeded;
  }
  hasFailed() {
    return this.performed && !this.succeeded;
  }
  getPromise() {
    return this.promise || (this.promise = new Promise((t, e) => (this.performing = !0, this.perform((i, n) => {
      this.succeeded = i, this.performing = !1, this.performed = !0, this.succeeded ? t(n) : e(n);
    })))), this.promise;
  }
  perform(t) {
    return t(!1);
  }
  release() {
    var t, e;
    (t = this.promise) === null || t === void 0 || (e = t.cancel) === null || e === void 0 || e.call(t), this.promise = null, this.performing = null, this.performed = null, this.succeeded = null;
  }
}
Xe.proxyMethod("getPromise().then"), Xe.proxyMethod("getPromise().catch");
class Nt extends M {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.object = t, this.options = e, this.childViews = [], this.rootView = this;
  }
  getNodes() {
    return this.nodes || (this.nodes = this.createNodes()), this.nodes.map((t) => t.cloneNode(!0));
  }
  invalidate() {
    var t;
    return this.nodes = null, this.childViews = [], (t = this.parentView) === null || t === void 0 ? void 0 : t.invalidate();
  }
  invalidateViewForObject(t) {
    var e;
    return (e = this.findViewForObject(t)) === null || e === void 0 ? void 0 : e.invalidate();
  }
  findOrCreateCachedChildView(t, e, i) {
    let n = this.getCachedViewForObject(e);
    return n ? this.recordChildView(n) : (n = this.createChildView(...arguments), this.cacheViewForObject(n, e)), n;
  }
  createChildView(t, e) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    e instanceof kn && (i.viewClass = t, t = Qo);
    const n = new t(e, i);
    return this.recordChildView(n);
  }
  recordChildView(t) {
    return t.parentView = this, t.rootView = this.rootView, this.childViews.push(t), t;
  }
  getAllChildViews() {
    let t = [];
    return this.childViews.forEach((e) => {
      t.push(e), t = t.concat(e.getAllChildViews());
    }), t;
  }
  findElement() {
    return this.findElementForObject(this.object);
  }
  findElementForObject(t) {
    const e = t == null ? void 0 : t.id;
    if (e) return this.rootView.element.querySelector("[data-trix-id='".concat(e, "']"));
  }
  findViewForObject(t) {
    for (const e of this.getAllChildViews()) if (e.object === t) return e;
  }
  getViewCache() {
    return this.rootView !== this ? this.rootView.getViewCache() : this.isViewCachingEnabled() ? (this.viewCache || (this.viewCache = {}), this.viewCache) : void 0;
  }
  isViewCachingEnabled() {
    return this.shouldCacheViews !== !1;
  }
  enableViewCaching() {
    this.shouldCacheViews = !0;
  }
  disableViewCaching() {
    this.shouldCacheViews = !1;
  }
  getCachedViewForObject(t) {
    var e;
    return (e = this.getViewCache()) === null || e === void 0 ? void 0 : e[t.getCacheKey()];
  }
  cacheViewForObject(t, e) {
    const i = this.getViewCache();
    i && (i[e.getCacheKey()] = t);
  }
  garbageCollectCachedViews() {
    const t = this.getViewCache();
    if (t) {
      const e = this.getAllChildViews().concat(this).map((i) => i.object.getCacheKey());
      for (const i in t) e.includes(i) || delete t[i];
    }
  }
}
class Qo extends Nt {
  constructor() {
    super(...arguments), this.objectGroup = this.object, this.viewClass = this.options.viewClass, delete this.options.viewClass;
  }
  getChildViews() {
    return this.childViews.length || Array.from(this.objectGroup.getObjects()).forEach((t) => {
      this.findOrCreateCachedChildView(this.viewClass, t, this.options);
    }), this.childViews;
  }
  createNodes() {
    const t = this.createContainerElement();
    return this.getChildViews().forEach((e) => {
      Array.from(e.getNodes()).forEach((i) => {
        t.appendChild(i);
      });
    }), [t];
  }
  createContainerElement() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.objectGroup.getDepth();
    return this.getChildViews()[0].createContainerElement(t);
  }
}
/*! @license DOMPurify 3.2.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.7/LICENSE */
const { entries: Rr, setPrototypeOf: gs, isFrozen: Zo, getPrototypeOf: ta, getOwnPropertyDescriptor: ea } = Object;
let { freeze: J, seal: Z, create: Dr } = Object, { apply: mn, construct: gn } = typeof Reflect < "u" && Reflect;
J || (J = function(s) {
  return s;
}), Z || (Z = function(s) {
  return s;
}), mn || (mn = function(s, t) {
  for (var e = arguments.length, i = new Array(e > 2 ? e - 2 : 0), n = 2; n < e; n++) i[n - 2] = arguments[n];
  return s.apply(t, i);
}), gn || (gn = function(s) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) e[i - 1] = arguments[i];
  return new s(...e);
});
const Pe = Y(Array.prototype.forEach), ia = Y(Array.prototype.lastIndexOf), ps = Y(Array.prototype.pop), re = Y(Array.prototype.push), na = Y(Array.prototype.splice), Ge = Y(String.prototype.toLowerCase), Oi = Y(String.prototype.toString), Mi = Y(String.prototype.match), oe = Y(String.prototype.replace), sa = Y(String.prototype.indexOf), ra = Y(String.prototype.trim), rt = Y(Object.prototype.hasOwnProperty), z = Y(RegExp.prototype.test), ae = (fs = TypeError, function() {
  for (var s = arguments.length, t = new Array(s), e = 0; e < s; e++) t[e] = arguments[e];
  return gn(fs, t);
});
var fs;
function Y(s) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
    return mn(s, t, i);
  };
}
function A(s, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Ge;
  gs && gs(s, null);
  let i = t.length;
  for (; i--; ) {
    let n = t[i];
    if (typeof n == "string") {
      const r = e(n);
      r !== n && (Zo(t) || (t[i] = r), n = r);
    }
    s[n] = !0;
  }
  return s;
}
function oa(s) {
  for (let t = 0; t < s.length; t++)
    rt(s, t) || (s[t] = null);
  return s;
}
function ut(s) {
  const t = Dr(null);
  for (const [e, i] of Rr(s))
    rt(s, e) && (Array.isArray(i) ? t[e] = oa(i) : i && typeof i == "object" && i.constructor === Object ? t[e] = ut(i) : t[e] = i);
  return t;
}
function le(s, t) {
  for (; s !== null; ) {
    const e = ea(s, t);
    if (e) {
      if (e.get) return Y(e.get);
      if (typeof e.value == "function") return Y(e.value);
    }
    s = ta(s);
  }
  return function() {
    return null;
  };
}
const bs = J(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Bi = J(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "slot", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Ni = J(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), aa = J(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Pi = J(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), la = J(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), vs = J(["#text"]), _s = J(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Fi = J(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), As = J(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Fe = J(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), ca = Z(/\{\{[\w\W]*|[\w\W]*\}\}/gm), ha = Z(/<%[\w\W]*|[\w\W]*%>/gm), da = Z(/\$\{[\w\W]*/gm), ua = Z(/^data-[\-\w.\u00B7-\uFFFF]+$/), ma = Z(/^aria-[\-\w]+$/), Or = Z(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), ga = Z(/^(?:\w+script|data):/i), pa = Z(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Mr = Z(/^html$/i), fa = Z(/^[a-z][.\w]*(-[.\w]+)+$/i);
var ys = Object.freeze({ __proto__: null, ARIA_ATTR: ma, ATTR_WHITESPACE: pa, CUSTOM_ELEMENT: fa, DATA_ATTR: ua, DOCTYPE_NAME: Mr, ERB_EXPR: ha, IS_ALLOWED_URI: Or, IS_SCRIPT_OR_DATA: ga, MUSTACHE_EXPR: ca, TMPLIT_EXPR: da });
const ba = 1, va = 3, _a = 7, Aa = 8, ya = 9, Ea = function() {
  return typeof window > "u" ? null : window;
};
var Ee = function s() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ea();
  const e = (l) => s(l);
  if (e.version = "3.2.7", e.removed = [], !t || !t.document || t.document.nodeType !== ya || !t.Element) return e.isSupported = !1, e;
  let { document: i } = t;
  const n = i, r = n.currentScript, { DocumentFragment: o, HTMLTemplateElement: a, Node: c, Element: h, NodeFilter: d, NamedNodeMap: m = t.NamedNodeMap || t.MozNamedAttrMap, HTMLFormElement: p, DOMParser: f, trustedTypes: C } = t, L = h.prototype, U = le(L, "cloneNode"), j = le(L, "remove"), q = le(L, "nextSibling"), N = le(L, "childNodes"), O = le(L, "parentNode");
  if (typeof a == "function") {
    const l = i.createElement("template");
    l.content && l.content.ownerDocument && (i = l.content.ownerDocument);
  }
  let T, tt = "";
  const { implementation: ct, createNodeIterator: Et, createDocumentFragment: fo, getElementsByTagName: bo } = i, { importNode: vo } = n;
  let W = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  e.isSupported = typeof Rr == "function" && typeof O == "function" && ct && ct.createHTMLDocument !== void 0;
  const { MUSTACHE_EXPR: ai, ERB_EXPR: li, TMPLIT_EXPR: ci, DATA_ATTR: _o, ARIA_ATTR: Ao, IS_SCRIPT_OR_DATA: yo, ATTR_WHITESPACE: Dn, CUSTOM_ELEMENT: Eo } = ys;
  let { IS_ALLOWED_URI: On } = ys, P = null;
  const Mn = A({}, [...bs, ...Bi, ...Ni, ...Pi, ...vs]);
  let H = null;
  const Bn = A({}, [..._s, ...Fi, ...As, ...Fe]);
  let I = Object.seal(Dr(null, { tagNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, attributeNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, allowCustomizedBuiltInElements: { writable: !0, configurable: !1, enumerable: !0, value: !1 } })), Qt = null, hi = null, Nn = !0, di = !0, Pn = !1, Fn = !0, Ft = !1, Te = !0, St = !1, ui = !1, mi = !1, qt = !1, we = !1, ke = !1, qn = !0, Hn = !1, gi = !0, Zt = !1, Ht = {}, $t = null;
  const $n = A({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Un = null;
  const jn = A({}, ["audio", "video", "img", "source", "image", "track"]);
  let pi = null;
  const Vn = A({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ie = "http://www.w3.org/1998/Math/MathML", Re = "http://www.w3.org/2000/svg", ht = "http://www.w3.org/1999/xhtml";
  let Ut = ht, fi = !1, bi = null;
  const So = A({}, [Ie, Re, ht], Oi);
  let De = A({}, ["mi", "mo", "mn", "ms", "mtext"]), Oe = A({}, ["annotation-xml"]);
  const xo = A({}, ["title", "style", "font", "a", "script"]);
  let te = null;
  const Co = ["application/xhtml+xml", "text/html"];
  let F = null, jt = null;
  const Lo = i.createElement("form"), Wn = function(l) {
    return l instanceof RegExp || l instanceof Function;
  }, vi = function() {
    let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!jt || jt !== l) {
      if (l && typeof l == "object" || (l = {}), l = ut(l), te = Co.indexOf(l.PARSER_MEDIA_TYPE) === -1 ? "text/html" : l.PARSER_MEDIA_TYPE, F = te === "application/xhtml+xml" ? Oi : Ge, P = rt(l, "ALLOWED_TAGS") ? A({}, l.ALLOWED_TAGS, F) : Mn, H = rt(l, "ALLOWED_ATTR") ? A({}, l.ALLOWED_ATTR, F) : Bn, bi = rt(l, "ALLOWED_NAMESPACES") ? A({}, l.ALLOWED_NAMESPACES, Oi) : So, pi = rt(l, "ADD_URI_SAFE_ATTR") ? A(ut(Vn), l.ADD_URI_SAFE_ATTR, F) : Vn, Un = rt(l, "ADD_DATA_URI_TAGS") ? A(ut(jn), l.ADD_DATA_URI_TAGS, F) : jn, $t = rt(l, "FORBID_CONTENTS") ? A({}, l.FORBID_CONTENTS, F) : $n, Qt = rt(l, "FORBID_TAGS") ? A({}, l.FORBID_TAGS, F) : ut({}), hi = rt(l, "FORBID_ATTR") ? A({}, l.FORBID_ATTR, F) : ut({}), Ht = !!rt(l, "USE_PROFILES") && l.USE_PROFILES, Nn = l.ALLOW_ARIA_ATTR !== !1, di = l.ALLOW_DATA_ATTR !== !1, Pn = l.ALLOW_UNKNOWN_PROTOCOLS || !1, Fn = l.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ft = l.SAFE_FOR_TEMPLATES || !1, Te = l.SAFE_FOR_XML !== !1, St = l.WHOLE_DOCUMENT || !1, qt = l.RETURN_DOM || !1, we = l.RETURN_DOM_FRAGMENT || !1, ke = l.RETURN_TRUSTED_TYPE || !1, mi = l.FORCE_BODY || !1, qn = l.SANITIZE_DOM !== !1, Hn = l.SANITIZE_NAMED_PROPS || !1, gi = l.KEEP_CONTENT !== !1, Zt = l.IN_PLACE || !1, On = l.ALLOWED_URI_REGEXP || Or, Ut = l.NAMESPACE || ht, De = l.MATHML_TEXT_INTEGRATION_POINTS || De, Oe = l.HTML_INTEGRATION_POINTS || Oe, I = l.CUSTOM_ELEMENT_HANDLING || {}, l.CUSTOM_ELEMENT_HANDLING && Wn(l.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (I.tagNameCheck = l.CUSTOM_ELEMENT_HANDLING.tagNameCheck), l.CUSTOM_ELEMENT_HANDLING && Wn(l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (I.attributeNameCheck = l.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), l.CUSTOM_ELEMENT_HANDLING && typeof l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (I.allowCustomizedBuiltInElements = l.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Ft && (di = !1), we && (qt = !0), Ht && (P = A({}, vs), H = [], Ht.html === !0 && (A(P, bs), A(H, _s)), Ht.svg === !0 && (A(P, Bi), A(H, Fi), A(H, Fe)), Ht.svgFilters === !0 && (A(P, Ni), A(H, Fi), A(H, Fe)), Ht.mathMl === !0 && (A(P, Pi), A(H, As), A(H, Fe))), l.ADD_TAGS && (P === Mn && (P = ut(P)), A(P, l.ADD_TAGS, F)), l.ADD_ATTR && (H === Bn && (H = ut(H)), A(H, l.ADD_ATTR, F)), l.ADD_URI_SAFE_ATTR && A(pi, l.ADD_URI_SAFE_ATTR, F), l.FORBID_CONTENTS && ($t === $n && ($t = ut($t)), A($t, l.FORBID_CONTENTS, F)), gi && (P["#text"] = !0), St && A(P, ["html", "head", "body"]), P.table && (A(P, ["tbody"]), delete Qt.tbody), l.TRUSTED_TYPES_POLICY) {
        if (typeof l.TRUSTED_TYPES_POLICY.createHTML != "function") throw ae('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof l.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw ae('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        T = l.TRUSTED_TYPES_POLICY, tt = T.createHTML("");
      } else T === void 0 && (T = function(g, u) {
        if (typeof g != "object" || typeof g.createPolicy != "function") return null;
        let y = null;
        const S = "data-tt-policy-suffix";
        u && u.hasAttribute(S) && (y = u.getAttribute(S));
        const v = "dompurify" + (y ? "#" + y : "");
        try {
          return g.createPolicy(v, { createHTML: (B) => B, createScriptURL: (B) => B });
        } catch {
          return console.warn("TrustedTypes policy " + v + " could not be created."), null;
        }
      }(C, r)), T !== null && typeof tt == "string" && (tt = T.createHTML(""));
      J && J(l), jt = l;
    }
  }, zn = A({}, [...Bi, ...Ni, ...aa]), Kn = A({}, [...Pi, ...la]), at = function(l) {
    re(e.removed, { element: l });
    try {
      O(l).removeChild(l);
    } catch {
      j(l);
    }
  }, xt = function(l, g) {
    try {
      re(e.removed, { attribute: g.getAttributeNode(l), from: g });
    } catch {
      re(e.removed, { attribute: null, from: g });
    }
    if (g.removeAttribute(l), l === "is") if (qt || we) try {
      at(g);
    } catch {
    }
    else try {
      g.setAttribute(l, "");
    } catch {
    }
  }, Gn = function(l) {
    let g = null, u = null;
    if (mi) l = "<remove></remove>" + l;
    else {
      const v = Mi(l, /^[\r\n\t ]+/);
      u = v && v[0];
    }
    te === "application/xhtml+xml" && Ut === ht && (l = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + l + "</body></html>");
    const y = T ? T.createHTML(l) : l;
    if (Ut === ht) try {
      g = new f().parseFromString(y, te);
    } catch {
    }
    if (!g || !g.documentElement) {
      g = ct.createDocument(Ut, "template", null);
      try {
        g.documentElement.innerHTML = fi ? tt : y;
      } catch {
      }
    }
    const S = g.body || g.documentElement;
    return l && u && S.insertBefore(i.createTextNode(u), S.childNodes[0] || null), Ut === ht ? bo.call(g, St ? "html" : "body")[0] : St ? g.documentElement : S;
  }, Jn = function(l) {
    return Et.call(l.ownerDocument || l, l, d.SHOW_ELEMENT | d.SHOW_COMMENT | d.SHOW_TEXT | d.SHOW_PROCESSING_INSTRUCTION | d.SHOW_CDATA_SECTION, null);
  }, _i = function(l) {
    return l instanceof p && (typeof l.nodeName != "string" || typeof l.textContent != "string" || typeof l.removeChild != "function" || !(l.attributes instanceof m) || typeof l.removeAttribute != "function" || typeof l.setAttribute != "function" || typeof l.namespaceURI != "string" || typeof l.insertBefore != "function" || typeof l.hasChildNodes != "function");
  }, Yn = function(l) {
    return typeof c == "function" && l instanceof c;
  };
  function dt(l, g, u) {
    Pe(l, (y) => {
      y.call(e, g, u, jt);
    });
  }
  const Xn = function(l) {
    let g = null;
    if (dt(W.beforeSanitizeElements, l, null), _i(l)) return at(l), !0;
    const u = F(l.nodeName);
    if (dt(W.uponSanitizeElement, l, { tagName: u, allowedTags: P }), Te && l.hasChildNodes() && !Yn(l.firstElementChild) && z(/<[/\w!]/g, l.innerHTML) && z(/<[/\w!]/g, l.textContent) || l.nodeType === _a || Te && l.nodeType === Aa && z(/<[/\w]/g, l.data)) return at(l), !0;
    if (!P[u] || Qt[u]) {
      if (!Qt[u] && Zn(u) && (I.tagNameCheck instanceof RegExp && z(I.tagNameCheck, u) || I.tagNameCheck instanceof Function && I.tagNameCheck(u)))
        return !1;
      if (gi && !$t[u]) {
        const y = O(l) || l.parentNode, S = N(l) || l.childNodes;
        if (S && y)
          for (let v = S.length - 1; v >= 0; --v) {
            const B = U(S[v], !0);
            B.__removalCount = (l.__removalCount || 0) + 1, y.insertBefore(B, q(l));
          }
      }
      return at(l), !0;
    }
    return l instanceof h && !function(y) {
      let S = O(y);
      S && S.tagName || (S = { namespaceURI: Ut, tagName: "template" });
      const v = Ge(y.tagName), B = Ge(S.tagName);
      return !!bi[y.namespaceURI] && (y.namespaceURI === Re ? S.namespaceURI === ht ? v === "svg" : S.namespaceURI === Ie ? v === "svg" && (B === "annotation-xml" || De[B]) : !!zn[v] : y.namespaceURI === Ie ? S.namespaceURI === ht ? v === "math" : S.namespaceURI === Re ? v === "math" && Oe[B] : !!Kn[v] : y.namespaceURI === ht ? !(S.namespaceURI === Re && !Oe[B]) && !(S.namespaceURI === Ie && !De[B]) && !Kn[v] && (xo[v] || !zn[v]) : !(te !== "application/xhtml+xml" || !bi[y.namespaceURI]));
    }(l) ? (at(l), !0) : u !== "noscript" && u !== "noembed" && u !== "noframes" || !z(/<\/no(script|embed|frames)/i, l.innerHTML) ? (Ft && l.nodeType === va && (g = l.textContent, Pe([ai, li, ci], (y) => {
      g = oe(g, y, " ");
    }), l.textContent !== g && (re(e.removed, { element: l.cloneNode() }), l.textContent = g)), dt(W.afterSanitizeElements, l, null), !1) : (at(l), !0);
  }, Qn = function(l, g, u) {
    if (qn && (g === "id" || g === "name") && (u in i || u in Lo)) return !1;
    if (!(di && !hi[g] && z(_o, g))) {
      if (!(Nn && z(Ao, g))) {
        if (!H[g] || hi[g]) {
          if (!(Zn(l) && (I.tagNameCheck instanceof RegExp && z(I.tagNameCheck, l) || I.tagNameCheck instanceof Function && I.tagNameCheck(l)) && (I.attributeNameCheck instanceof RegExp && z(I.attributeNameCheck, g) || I.attributeNameCheck instanceof Function && I.attributeNameCheck(g, l)) || g === "is" && I.allowCustomizedBuiltInElements && (I.tagNameCheck instanceof RegExp && z(I.tagNameCheck, u) || I.tagNameCheck instanceof Function && I.tagNameCheck(u)))) return !1;
        } else if (!pi[g]) {
          if (!z(On, oe(u, Dn, ""))) {
            if ((g !== "src" && g !== "xlink:href" && g !== "href" || l === "script" || sa(u, "data:") !== 0 || !Un[l]) && !(Pn && !z(yo, oe(u, Dn, "")))) {
              if (u) return !1;
            }
          }
        }
      }
    }
    return !0;
  }, Zn = function(l) {
    return l !== "annotation-xml" && Mi(l, Eo);
  }, ts = function(l) {
    dt(W.beforeSanitizeAttributes, l, null);
    const { attributes: g } = l;
    if (!g || _i(l)) return;
    const u = { attrName: "", attrValue: "", keepAttr: !0, allowedAttributes: H, forceKeepAttr: void 0 };
    let y = g.length;
    for (; y--; ) {
      const S = g[y], { name: v, namespaceURI: B, value: pt } = S, et = F(v), Ai = pt;
      let $ = v === "value" ? Ai : ra(Ai);
      if (u.attrName = et, u.attrValue = $, u.keepAttr = !0, u.forceKeepAttr = void 0, dt(W.uponSanitizeAttribute, l, u), $ = u.attrValue, !Hn || et !== "id" && et !== "name" || (xt(v, l), $ = "user-content-" + $), Te && z(/((--!?|])>)|<\/(style|title|textarea)/i, $)) {
        xt(v, l);
        continue;
      }
      if (et === "attributename" && Mi($, "href")) {
        xt(v, l);
        continue;
      }
      if (u.forceKeepAttr) continue;
      if (!u.keepAttr) {
        xt(v, l);
        continue;
      }
      if (!Fn && z(/\/>/i, $)) {
        xt(v, l);
        continue;
      }
      Ft && Pe([ai, li, ci], (is) => {
        $ = oe($, is, " ");
      });
      const es = F(l.nodeName);
      if (Qn(es, et, $)) {
        if (T && typeof C == "object" && typeof C.getAttributeType == "function" && !B) switch (C.getAttributeType(es, et)) {
          case "TrustedHTML":
            $ = T.createHTML($);
            break;
          case "TrustedScriptURL":
            $ = T.createScriptURL($);
        }
        if ($ !== Ai) try {
          B ? l.setAttributeNS(B, v, $) : l.setAttribute(v, $), _i(l) ? at(l) : ps(e.removed);
        } catch {
          xt(v, l);
        }
      } else xt(v, l);
    }
    dt(W.afterSanitizeAttributes, l, null);
  }, To = function l(g) {
    let u = null;
    const y = Jn(g);
    for (dt(W.beforeSanitizeShadowDOM, g, null); u = y.nextNode(); ) dt(W.uponSanitizeShadowNode, u, null), Xn(u), ts(u), u.content instanceof o && l(u.content);
    dt(W.afterSanitizeShadowDOM, g, null);
  };
  return e.sanitize = function(l) {
    let g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, u = null, y = null, S = null, v = null;
    if (fi = !l, fi && (l = "<!-->"), typeof l != "string" && !Yn(l)) {
      if (typeof l.toString != "function") throw ae("toString is not a function");
      if (typeof (l = l.toString()) != "string") throw ae("dirty is not a string, aborting");
    }
    if (!e.isSupported) return l;
    if (ui || vi(g), e.removed = [], typeof l == "string" && (Zt = !1), Zt) {
      if (l.nodeName) {
        const et = F(l.nodeName);
        if (!P[et] || Qt[et]) throw ae("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (l instanceof c) u = Gn("<!---->"), y = u.ownerDocument.importNode(l, !0), y.nodeType === ba && y.nodeName === "BODY" || y.nodeName === "HTML" ? u = y : u.appendChild(y);
    else {
      if (!qt && !Ft && !St && l.indexOf("<") === -1) return T && ke ? T.createHTML(l) : l;
      if (u = Gn(l), !u) return qt ? null : ke ? tt : "";
    }
    u && mi && at(u.firstChild);
    const B = Jn(Zt ? l : u);
    for (; S = B.nextNode(); ) Xn(S), ts(S), S.content instanceof o && To(S.content);
    if (Zt) return l;
    if (qt) {
      if (we) for (v = fo.call(u.ownerDocument); u.firstChild; ) v.appendChild(u.firstChild);
      else v = u;
      return (H.shadowroot || H.shadowrootmode) && (v = vo.call(n, v, !0)), v;
    }
    let pt = St ? u.outerHTML : u.innerHTML;
    return St && P["!doctype"] && u.ownerDocument && u.ownerDocument.doctype && u.ownerDocument.doctype.name && z(Mr, u.ownerDocument.doctype.name) && (pt = "<!DOCTYPE " + u.ownerDocument.doctype.name + `>
` + pt), Ft && Pe([ai, li, ci], (et) => {
      pt = oe(pt, et, " ");
    }), T && ke ? T.createHTML(pt) : pt;
  }, e.setConfig = function() {
    vi(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), ui = !0;
  }, e.clearConfig = function() {
    jt = null, ui = !1;
  }, e.isValidAttribute = function(l, g, u) {
    jt || vi({});
    const y = F(l), S = F(g);
    return Qn(y, S, u);
  }, e.addHook = function(l, g) {
    typeof g == "function" && re(W[l], g);
  }, e.removeHook = function(l, g) {
    if (g !== void 0) {
      const u = ia(W[l], g);
      return u === -1 ? void 0 : na(W[l], u, 1)[0];
    }
    return ps(W[l]);
  }, e.removeHooks = function(l) {
    W[l] = [];
  }, e.removeAllHooks = function() {
    W = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  }, e;
}();
Ee.addHook("uponSanitizeAttribute", function(s, t) {
  /^data-trix-/.test(t.attrName) && (t.forceKeepAttr = !0);
});
const Sa = "style href src width height language class".split(" "), xa = "javascript:".split(" "), Ca = "script iframe form noscript".split(" ");
class ni extends M {
  static setHTML(t, e, i) {
    const n = new this(e, i).sanitize(), r = n.getHTML ? n.getHTML() : n.outerHTML;
    t.innerHTML = r;
  }
  static sanitize(t, e) {
    const i = new this(t, e);
    return i.sanitize(), i;
  }
  constructor(t) {
    let { allowedAttributes: e, forbiddenProtocols: i, forbiddenElements: n, purifyOptions: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.allowedAttributes = e || Sa, this.forbiddenProtocols = i || xa, this.forbiddenElements = n || Ca, this.purifyOptions = r || {}, this.body = La(t);
  }
  sanitize() {
    this.sanitizeElements(), this.normalizeListElementNesting();
    const t = Object.assign({}, br, this.purifyOptions);
    return Ee.setConfig(t), this.body = Ee.sanitize(this.body), this.body;
  }
  getHTML() {
    return this.body.innerHTML;
  }
  getBody() {
    return this.body;
  }
  sanitizeElements() {
    const t = Je(this.body), e = [];
    for (; t.nextNode(); ) {
      const i = t.currentNode;
      switch (i.nodeType) {
        case Node.ELEMENT_NODE:
          this.elementIsRemovable(i) ? e.push(i) : this.sanitizeElement(i);
          break;
        case Node.COMMENT_NODE:
          e.push(i);
      }
    }
    return e.forEach((i) => yt(i)), this.body;
  }
  sanitizeElement(t) {
    return t.hasAttribute("href") && this.forbiddenProtocols.includes(t.protocol) && t.removeAttribute("href"), Array.from(t.attributes).forEach((e) => {
      let { name: i } = e;
      this.allowedAttributes.includes(i) || i.indexOf("data-trix") === 0 || t.removeAttribute(i);
    }), t;
  }
  normalizeListElementNesting() {
    return Array.from(this.body.querySelectorAll("ul,ol")).forEach((t) => {
      const e = t.previousElementSibling;
      e && K(e) === "li" && e.appendChild(t);
    }), this.body;
  }
  elementIsRemovable(t) {
    if ((t == null ? void 0 : t.nodeType) === Node.ELEMENT_NODE) return this.elementIsForbidden(t) || this.elementIsntSerializable(t);
  }
  elementIsForbidden(t) {
    return this.forbiddenElements.includes(K(t));
  }
  elementIsntSerializable(t) {
    return t.getAttribute("data-trix-serialize") === "false" && !It(t);
  }
}
const La = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  s = s.replace(/<\/html[^>]*>[^]*$/i, "</html>");
  const t = document.implementation.createHTMLDocument("");
  return t.documentElement.innerHTML = s, Array.from(t.head.querySelectorAll("style")).forEach((e) => {
    t.body.appendChild(e);
  }), t.body;
}, { css: ft } = Le;
class In extends Nt {
  constructor() {
    super(...arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
  }
  createContentNodes() {
    return [];
  }
  createNodes() {
    let t;
    const e = t = _({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: !1 }), i = this.getHref();
    return i && (t = _({ tagName: "a", editable: !1, attributes: { href: i, tabindex: -1 } }), e.appendChild(t)), this.attachment.hasContent() ? ni.setHTML(t, this.attachment.getContent()) : this.createContentNodes().forEach((n) => {
      t.appendChild(n);
    }), t.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = _({ tagName: "progress", attributes: { class: ft.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: !0, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e.appendChild(this.progressElement)), [Es("left"), e, Es("right")];
  }
  createCaptionElement() {
    const t = _({ tagName: "figcaption", className: ft.attachmentCaption }), e = this.attachmentPiece.getCaption();
    if (e) t.classList.add("".concat(ft.attachmentCaption, "--edited")), t.textContent = e;
    else {
      let i, n;
      const r = this.getCaptionConfig();
      if (r.name && (i = this.attachment.getFilename()), r.size && (n = this.attachment.getFormattedFilesize()), i) {
        const o = _({ tagName: "span", className: ft.attachmentName, textContent: i });
        t.appendChild(o);
      }
      if (n) {
        i && t.appendChild(document.createTextNode(" "));
        const o = _({ tagName: "span", className: ft.attachmentSize, textContent: n });
        t.appendChild(o);
      }
    }
    return t;
  }
  getClassName() {
    const t = [ft.attachment, "".concat(ft.attachment, "--").concat(this.attachment.getType())], e = this.attachment.getExtension();
    return e && t.push("".concat(ft.attachment, "--").concat(e)), t.join(" ");
  }
  getData() {
    const t = { trixAttachment: JSON.stringify(this.attachment), trixContentType: this.attachment.getContentType(), trixId: this.attachment.id }, { attributes: e } = this.attachmentPiece;
    return e.isEmpty() || (t.trixAttributes = JSON.stringify(e)), this.attachment.isPending() && (t.trixSerialize = !1), t;
  }
  getHref() {
    if (!Ta(this.attachment.getContent(), "a")) {
      const t = this.attachment.getHref();
      if (t && Ee.isValidAttribute("a", "href", t)) return t;
    }
  }
  getCaptionConfig() {
    var t;
    const e = this.attachment.getType(), i = Tr((t = yn[e]) === null || t === void 0 ? void 0 : t.caption);
    return e === "file" && (i.name = !0), i;
  }
  findProgressElement() {
    var t;
    return (t = this.findElement()) === null || t === void 0 ? void 0 : t.querySelector("progress");
  }
  attachmentDidChangeUploadProgress() {
    const t = this.attachment.getUploadProgress(), e = this.findProgressElement();
    e && (e.value = t);
  }
}
const Es = (s) => _({ tagName: "span", textContent: ii, data: { trixCursorTarget: s, trixSerialize: !1 } }), Ta = function(s, t) {
  const e = _("div");
  return ni.setHTML(e, s || ""), e.querySelector(t);
};
class Br extends In {
  constructor() {
    super(...arguments), this.attachment.previewDelegate = this;
  }
  createContentNodes() {
    return this.image = _({ tagName: "img", attributes: { src: "" }, data: { trixMutable: !0 } }), this.refresh(this.image), [this.image];
  }
  createCaptionElement() {
    const t = super.createCaptionElement(...arguments);
    return t.textContent || t.setAttribute("data-trix-placeholder", b.captionPlaceholder), t;
  }
  refresh(t) {
    var e;
    if (t || (t = (e = this.findElement()) === null || e === void 0 ? void 0 : e.querySelector("img")), t) return this.updateAttributesForImage(t);
  }
  updateAttributesForImage(t) {
    const e = this.attachment.getURL(), i = this.attachment.getPreviewURL();
    if (t.src = i || e, i === e) t.removeAttribute("data-trix-serialized-attributes");
    else {
      const c = JSON.stringify({ src: e });
      t.setAttribute("data-trix-serialized-attributes", c);
    }
    const n = this.attachment.getWidth(), r = this.attachment.getHeight(), o = this.attachment.getAttribute("alt");
    n != null && (t.width = n), r != null && (t.height = r), o != null && (t.alt = o);
    const a = ["imageElement", this.attachment.id, t.src, t.width, t.height].join("/");
    t.dataset.trixStoreKey = a;
  }
  attachmentDidChangeAttributes() {
    return this.refresh(this.image), this.refresh();
  }
}
class Nr extends Nt {
  constructor() {
    super(...arguments), this.piece = this.object, this.attributes = this.piece.getAttributes(), this.textConfig = this.options.textConfig, this.context = this.options.context, this.piece.attachment ? this.attachment = this.piece.attachment : this.string = this.piece.toString();
  }
  createNodes() {
    let t = this.attachment ? this.createAttachmentNodes() : this.createStringNodes();
    const e = this.createElement();
    if (e) {
      const i = function(n) {
        for (; (r = n) !== null && r !== void 0 && r.firstElementChild; ) {
          var r;
          n = n.firstElementChild;
        }
        return n;
      }(e);
      Array.from(t).forEach((n) => {
        i.appendChild(n);
      }), t = [e];
    }
    return t;
  }
  createAttachmentNodes() {
    const t = this.attachment.isPreviewable() ? Br : In;
    return this.createChildView(t, this.piece.attachment, { piece: this.piece }).getNodes();
  }
  createStringNodes() {
    var t;
    if ((t = this.textConfig) !== null && t !== void 0 && t.plaintext) return [document.createTextNode(this.string)];
    {
      const e = [], i = this.string.split(`
`);
      for (let n = 0; n < i.length; n++) {
        const r = i[n];
        if (n > 0) {
          const o = _("br");
          e.push(o);
        }
        if (r.length) {
          const o = document.createTextNode(this.preserveSpaces(r));
          e.push(o);
        }
      }
      return e;
    }
  }
  createElement() {
    let t, e, i;
    const n = {};
    for (e in this.attributes) {
      i = this.attributes[e];
      const o = dn(e);
      if (o) {
        if (o.tagName) {
          var r;
          const a = _(o.tagName);
          r ? (r.appendChild(a), r = a) : t = r = a;
        }
        if (o.styleProperty && (n[o.styleProperty] = i), o.style) for (e in o.style) i = o.style[e], n[e] = i;
      }
    }
    if (Object.keys(n).length) for (e in t || (t = _("span")), n) i = n[e], t.style[e] = i;
    return t;
  }
  createContainerElement() {
    for (const t in this.attributes) {
      const e = this.attributes[t], i = dn(t);
      if (i && i.groupTagName) {
        const n = {};
        return n[t] = e, _(i.groupTagName, n);
      }
    }
  }
  preserveSpaces(t) {
    return this.context.isLast && (t = t.replace(/\ $/, _t)), t = t.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(_t, " $2")).replace(/\ {2}/g, "".concat(_t, " ")).replace(/\ {2}/g, " ".concat(_t)), (this.context.isFirst || this.context.followsWhitespace) && (t = t.replace(/^\ /, _t)), t;
  }
}
class Pr extends Nt {
  constructor() {
    super(...arguments), this.text = this.object, this.textConfig = this.options.textConfig;
  }
  createNodes() {
    const t = [], e = kn.groupObjects(this.getPieces()), i = e.length - 1;
    for (let r = 0; r < e.length; r++) {
      const o = e[r], a = {};
      r === 0 && (a.isFirst = !0), r === i && (a.isLast = !0), wa(n) && (a.followsWhitespace = !0);
      const c = this.findOrCreateCachedChildView(Nr, o, { textConfig: this.textConfig, context: a });
      t.push(...Array.from(c.getNodes() || []));
      var n = o;
    }
    return t;
  }
  getPieces() {
    return Array.from(this.text.getPieces()).filter((t) => !t.hasAttribute("blockBreak"));
  }
}
const wa = (s) => /\s$/.test(s == null ? void 0 : s.toString()), { css: Ss } = Le;
class Fr extends Nt {
  constructor() {
    super(...arguments), this.block = this.object, this.attributes = this.block.getAttributes();
  }
  createNodes() {
    const t = [document.createComment("block")];
    if (this.block.isEmpty()) t.push(_("br"));
    else {
      var e;
      const i = (e = D(this.block.getLastAttribute())) === null || e === void 0 ? void 0 : e.text, n = this.findOrCreateCachedChildView(Pr, this.block.text, { textConfig: i });
      t.push(...Array.from(n.getNodes() || [])), this.shouldAddExtraNewlineElement() && t.push(_("br"));
    }
    if (this.attributes.length) return t;
    {
      let i;
      const { tagName: n } = G.default;
      this.block.isRTL() && (i = { dir: "rtl" });
      const r = _({ tagName: n, attributes: i });
      return t.forEach((o) => r.appendChild(o)), [r];
    }
  }
  createContainerElement(t) {
    const e = {};
    let i;
    const n = this.attributes[t], { tagName: r, htmlAttributes: o = [] } = D(n);
    if (t === 0 && this.block.isRTL() && Object.assign(e, { dir: "rtl" }), n === "attachmentGallery") {
      const a = this.block.getBlockBreakPosition();
      i = "".concat(Ss.attachmentGallery, " ").concat(Ss.attachmentGallery, "--").concat(a);
    }
    return Object.entries(this.block.htmlAttributes).forEach((a) => {
      let [c, h] = a;
      o.includes(c) && (e[c] = h);
    }), _({ tagName: r, className: i, attributes: e });
  }
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }
}
class si extends Nt {
  static render(t) {
    const e = _("div"), i = new this(t, { element: e });
    return i.render(), i.sync(), e;
  }
  constructor() {
    super(...arguments), this.element = this.options.element, this.elementStore = new Xo(), this.setDocument(this.object);
  }
  setDocument(t) {
    t.isEqualTo(this.document) || (this.document = this.object = t);
  }
  render() {
    if (this.childViews = [], this.shadowElement = _("div"), !this.document.isEmpty()) {
      const t = kn.groupObjects(this.document.getBlocks(), { asTree: !0 });
      Array.from(t).forEach((e) => {
        const i = this.findOrCreateCachedChildView(Fr, e);
        Array.from(i.getNodes()).map((n) => this.shadowElement.appendChild(n));
      });
    }
  }
  isSynced() {
    return ka(this.shadowElement, this.element);
  }
  sync() {
    const t = Ar("trix-before-render", { cancelable: !1, attributes: { render: (i, n) => {
      for (; i.lastChild; ) i.removeChild(i.lastChild);
      i.appendChild(n);
    } } });
    this.element.dispatchEvent(t);
    const e = this.createDocumentFragmentForSync();
    return t.render(this.element, e), this.didSync();
  }
  didSync() {
    return this.elementStore.reset(xs(this.element)), Ln(() => this.garbageCollectCachedViews());
  }
  createDocumentFragmentForSync() {
    const t = document.createDocumentFragment();
    return Array.from(this.shadowElement.childNodes).forEach((e) => {
      t.appendChild(e.cloneNode(!0));
    }), Array.from(xs(t)).forEach((e) => {
      const i = this.elementStore.remove(e);
      i && e.parentNode.replaceChild(i, e);
    }), t;
  }
}
const xs = (s) => s.querySelectorAll("[data-trix-store-key]"), ka = (s, t) => Cs(s.innerHTML) === Cs(t.innerHTML), Cs = (s) => s.replace(/&nbsp;/g, " ");
function Ia(s) {
  var t = function(e, i) {
    if (typeof e != "object" || !e) return e;
    var n = e[Symbol.toPrimitive];
    if (n !== void 0) {
      var r = n.call(e, i);
      if (typeof r != "object") return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (i === "string" ? String : Number)(e);
  }(s, "string");
  return typeof t == "symbol" ? t : String(t);
}
function V(s, t, e) {
  return (t = Ia(t)) in s ? Object.defineProperty(s, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : s[t] = e, s;
}
function E(s, t) {
  return Ra(s, qr(s, t, "get"));
}
function be(s, t, e) {
  return Da(s, qr(s, t, "set"), e), e;
}
function qr(s, t, e) {
  if (!t.has(s)) throw new TypeError("attempted to " + e + " private field on non-instance");
  return t.get(s);
}
function Ra(s, t) {
  return t.get ? t.get.call(s) : t.value;
}
function Da(s, t, e) {
  if (t.set) t.set.call(s, e);
  else {
    if (!t.writable) throw new TypeError("attempted to set read only private field");
    t.value = e;
  }
}
function qe(s, t, e) {
  if (!t.has(s)) throw new TypeError("attempted to get private field on non-instance");
  return e;
}
function Hr(s, t) {
  if (t.has(s)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Gt(s, t, e) {
  Hr(s, t), t.set(s, e);
}
class Pt extends Bt {
  static registerType(t, e) {
    e.type = t, this.types[t] = e;
  }
  static fromJSON(t) {
    const e = this.types[t.type];
    if (e) return e.fromJSON(t);
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.attributes = X.box(e);
  }
  copyWithAttributes(t) {
    return new this.constructor(this.getValue(), t);
  }
  copyWithAdditionalAttributes(t) {
    return this.copyWithAttributes(this.attributes.merge(t));
  }
  copyWithoutAttribute(t) {
    return this.copyWithAttributes(this.attributes.remove(t));
  }
  copy() {
    return this.copyWithAttributes(this.attributes);
  }
  getAttribute(t) {
    return this.attributes.get(t);
  }
  getAttributesHash() {
    return this.attributes;
  }
  getAttributes() {
    return this.attributes.toObject();
  }
  hasAttribute(t) {
    return this.attributes.has(t);
  }
  hasSameStringValueAsPiece(t) {
    return t && this.toString() === t.toString();
  }
  hasSameAttributesAsPiece(t) {
    return t && (this.attributes === t.attributes || this.attributes.isEqualTo(t.attributes));
  }
  isBlockBreak() {
    return !1;
  }
  isEqualTo(t) {
    return super.isEqualTo(...arguments) || this.hasSameConstructorAs(t) && this.hasSameStringValueAsPiece(t) && this.hasSameAttributesAsPiece(t);
  }
  isEmpty() {
    return this.length === 0;
  }
  isSerializable() {
    return !0;
  }
  toJSON() {
    return { type: this.constructor.type, attributes: this.getAttributes() };
  }
  contentsForInspection() {
    return { type: this.constructor.type, attributes: this.attributes.inspect() };
  }
  canBeGrouped() {
    return this.hasAttribute("href");
  }
  canBeGroupedWith(t) {
    return this.getAttribute("href") === t.getAttribute("href");
  }
  getLength() {
    return this.length;
  }
  canBeConsolidatedWith(t) {
    return !1;
  }
}
V(Pt, "types", {});
class $r extends Xe {
  constructor(t) {
    super(...arguments), this.url = t;
  }
  perform(t) {
    const e = new Image();
    e.onload = () => (e.width = this.width = e.naturalWidth, e.height = this.height = e.naturalHeight, t(!0, e)), e.onerror = () => t(!1), e.src = this.url;
  }
}
class Xt extends Bt {
  static attachmentForFile(t) {
    const e = new this(this.attributesForFile(t));
    return e.setFile(t), e;
  }
  static attributesForFile(t) {
    return new X({ filename: t.name, filesize: t.size, contentType: t.type });
  }
  static fromJSON(t) {
    return new this(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(t), this.releaseFile = this.releaseFile.bind(this), this.attributes = X.box(t), this.didChangeAttributes();
  }
  setAttribute(t, e) {
    this.setAttributes({ [t]: e });
  }
  getAttribute(t) {
    return this.attributes.get(t);
  }
  hasAttribute(t) {
    return this.attributes.has(t);
  }
  getAttributes() {
    return this.attributes.toObject();
  }
  setAttributes() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const e = this.attributes.merge(t);
    var i, n, r, o;
    if (!this.attributes.isEqualTo(e)) return this.attributes = e, this.didChangeAttributes(), (i = this.previewDelegate) === null || i === void 0 || (n = i.attachmentDidChangeAttributes) === null || n === void 0 || n.call(i, this), (r = this.delegate) === null || r === void 0 || (o = r.attachmentDidChangeAttributes) === null || o === void 0 ? void 0 : o.call(r, this);
  }
  didChangeAttributes() {
    if (this.isPreviewable()) return this.preloadURL();
  }
  isPending() {
    return this.file != null && !(this.getURL() || this.getHref());
  }
  isPreviewable() {
    return this.attributes.has("previewable") ? this.attributes.get("previewable") : Xt.previewablePattern.test(this.getContentType());
  }
  getType() {
    return this.hasContent() ? "content" : this.isPreviewable() ? "preview" : "file";
  }
  getURL() {
    return this.attributes.get("url");
  }
  getHref() {
    return this.attributes.get("href");
  }
  getFilename() {
    return this.attributes.get("filename") || "";
  }
  getFilesize() {
    return this.attributes.get("filesize");
  }
  getFormattedFilesize() {
    const t = this.attributes.get("filesize");
    return typeof t == "number" ? vr.formatter(t) : "";
  }
  getExtension() {
    var t;
    return (t = this.getFilename().match(/\.(\w+)$/)) === null || t === void 0 ? void 0 : t[1].toLowerCase();
  }
  getContentType() {
    return this.attributes.get("contentType");
  }
  hasContent() {
    return this.attributes.has("content");
  }
  getContent() {
    return this.attributes.get("content");
  }
  getWidth() {
    return this.attributes.get("width");
  }
  getHeight() {
    return this.attributes.get("height");
  }
  getFile() {
    return this.file;
  }
  setFile(t) {
    if (this.file = t, this.isPreviewable()) return this.preloadFile();
  }
  releaseFile() {
    this.releasePreloadedFile(), this.file = null;
  }
  getUploadProgress() {
    return this.uploadProgress != null ? this.uploadProgress : 0;
  }
  setUploadProgress(t) {
    var e, i;
    if (this.uploadProgress !== t) return this.uploadProgress = t, (e = this.uploadProgressDelegate) === null || e === void 0 || (i = e.attachmentDidChangeUploadProgress) === null || i === void 0 ? void 0 : i.call(e, this);
  }
  toJSON() {
    return this.getAttributes();
  }
  getCacheKey() {
    return [super.getCacheKey(...arguments), this.attributes.getCacheKey(), this.getPreviewURL()].join("/");
  }
  getPreviewURL() {
    return this.previewURL || this.preloadingURL;
  }
  setPreviewURL(t) {
    var e, i, n, r;
    if (t !== this.getPreviewURL()) return this.previewURL = t, (e = this.previewDelegate) === null || e === void 0 || (i = e.attachmentDidChangeAttributes) === null || i === void 0 || i.call(e, this), (n = this.delegate) === null || n === void 0 || (r = n.attachmentDidChangePreviewURL) === null || r === void 0 ? void 0 : r.call(n, this);
  }
  preloadURL() {
    return this.preload(this.getURL(), this.releaseFile);
  }
  preloadFile() {
    if (this.file) return this.fileObjectURL = URL.createObjectURL(this.file), this.preload(this.fileObjectURL);
  }
  releasePreloadedFile() {
    this.fileObjectURL && (URL.revokeObjectURL(this.fileObjectURL), this.fileObjectURL = null);
  }
  preload(t, e) {
    if (t && t !== this.getPreviewURL())
      return this.preloadingURL = t, new $r(t).then((i) => {
        let { width: n, height: r } = i;
        return this.getWidth() && this.getHeight() || this.setAttributes({ width: n, height: r }), this.preloadingURL = null, this.setPreviewURL(t), e == null ? void 0 : e();
      }).catch(() => (this.preloadingURL = null, e == null ? void 0 : e()));
  }
}
V(Xt, "previewablePattern", /^image(\/(gif|png|webp|jpe?g)|$)/);
class Jt extends Pt {
  static fromJSON(t) {
    return new this(Xt.fromJSON(t.attachment), t.attributes);
  }
  constructor(t) {
    super(...arguments), this.attachment = t, this.length = 1, this.ensureAttachmentExclusivelyHasAttribute("href"), this.attachment.hasContent() || this.removeProhibitedAttributes();
  }
  ensureAttachmentExclusivelyHasAttribute(t) {
    this.hasAttribute(t) && (this.attachment.hasAttribute(t) || this.attachment.setAttributes(this.attributes.slice([t])), this.attributes = this.attributes.remove(t));
  }
  removeProhibitedAttributes() {
    const t = this.attributes.slice(Jt.permittedAttributes);
    t.isEqualTo(this.attributes) || (this.attributes = t);
  }
  getValue() {
    return this.attachment;
  }
  isSerializable() {
    return !this.attachment.isPending();
  }
  getCaption() {
    return this.attributes.get("caption") || "";
  }
  isEqualTo(t) {
    var e;
    return super.isEqualTo(t) && this.attachment.id === (t == null || (e = t.attachment) === null || e === void 0 ? void 0 : e.id);
  }
  toString() {
    return "￼";
  }
  toJSON() {
    const t = super.toJSON(...arguments);
    return t.attachment = this.attachment, t;
  }
  getCacheKey() {
    return [super.getCacheKey(...arguments), this.attachment.getCacheKey()].join("/");
  }
  toConsole() {
    return JSON.stringify(this.toString());
  }
}
V(Jt, "permittedAttributes", ["caption", "presentation"]), Pt.registerType("attachment", Jt);
class Rn extends Pt {
  static fromJSON(t) {
    return new this(t.string, t.attributes);
  }
  constructor(t) {
    super(...arguments), this.string = ((e) => e.replace(/\r\n?/g, `
`))(t), this.length = this.string.length;
  }
  getValue() {
    return this.string;
  }
  toString() {
    return this.string.toString();
  }
  isBlockBreak() {
    return this.toString() === `
` && this.getAttribute("blockBreak") === !0;
  }
  toJSON() {
    const t = super.toJSON(...arguments);
    return t.string = this.string, t;
  }
  canBeConsolidatedWith(t) {
    return t && this.hasSameConstructorAs(t) && this.hasSameAttributesAsPiece(t);
  }
  consolidateWith(t) {
    return new this.constructor(this.toString() + t.toString(), this.attributes);
  }
  splitAtOffset(t) {
    let e, i;
    return t === 0 ? (e = null, i = this) : t === this.length ? (e = this, i = null) : (e = new this.constructor(this.string.slice(0, t), this.attributes), i = new this.constructor(this.string.slice(t), this.attributes)), [e, i];
  }
  toConsole() {
    let { string: t } = this;
    return t.length > 15 && (t = t.slice(0, 14) + "…"), JSON.stringify(t.toString());
  }
}
Pt.registerType("string", Rn);
class Qe extends Bt {
  static box(t) {
    return t instanceof this ? t : new this(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), this.objects = t.slice(0), this.length = this.objects.length;
  }
  indexOf(t) {
    return this.objects.indexOf(t);
  }
  splice() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
    return new this.constructor(Cn(this.objects, ...e));
  }
  eachObject(t) {
    return this.objects.map((e, i) => t(e, i));
  }
  insertObjectAtIndex(t, e) {
    return this.splice(e, 0, t);
  }
  insertSplittableListAtIndex(t, e) {
    return this.splice(e, 0, ...t.objects);
  }
  insertSplittableListAtPosition(t, e) {
    const [i, n] = this.splitObjectAtPosition(e);
    return new this.constructor(i).insertSplittableListAtIndex(t, n);
  }
  editObjectAtIndex(t, e) {
    return this.replaceObjectAtIndex(e(this.objects[t]), t);
  }
  replaceObjectAtIndex(t, e) {
    return this.splice(e, 1, t);
  }
  removeObjectAtIndex(t) {
    return this.splice(t, 1);
  }
  getObjectAtIndex(t) {
    return this.objects[t];
  }
  getSplittableListInRange(t) {
    const [e, i, n] = this.splitObjectsAtRange(t);
    return new this.constructor(e.slice(i, n + 1));
  }
  selectSplittableList(t) {
    const e = this.objects.filter((i) => t(i));
    return new this.constructor(e);
  }
  removeObjectsInRange(t) {
    const [e, i, n] = this.splitObjectsAtRange(t);
    return new this.constructor(e).splice(i, n - i + 1);
  }
  transformObjectsInRange(t, e) {
    const [i, n, r] = this.splitObjectsAtRange(t), o = i.map((a, c) => n <= c && c <= r ? e(a) : a);
    return new this.constructor(o);
  }
  splitObjectsAtRange(t) {
    let e, [i, n, r] = this.splitObjectAtPosition(Ma(t));
    return [i, e] = new this.constructor(i).splitObjectAtPosition(Ba(t) + r), [i, n, e - 1];
  }
  getObjectAtPosition(t) {
    const { index: e } = this.findIndexAndOffsetAtPosition(t);
    return this.objects[e];
  }
  splitObjectAtPosition(t) {
    let e, i;
    const { index: n, offset: r } = this.findIndexAndOffsetAtPosition(t), o = this.objects.slice(0);
    if (n != null) if (r === 0) e = n, i = 0;
    else {
      const a = this.getObjectAtIndex(n), [c, h] = a.splitAtOffset(r);
      o.splice(n, 1, c, h), e = n + 1, i = c.getLength() - r;
    }
    else e = o.length, i = 0;
    return [o, e, i];
  }
  consolidate() {
    const t = [];
    let e = this.objects[0];
    return this.objects.slice(1).forEach((i) => {
      var n, r;
      (n = (r = e).canBeConsolidatedWith) !== null && n !== void 0 && n.call(r, i) ? e = e.consolidateWith(i) : (t.push(e), e = i);
    }), e && t.push(e), new this.constructor(t);
  }
  consolidateFromIndexToIndex(t, e) {
    const i = this.objects.slice(0).slice(t, e + 1), n = new this.constructor(i).consolidate().toArray();
    return this.splice(t, i.length, ...n);
  }
  findIndexAndOffsetAtPosition(t) {
    let e, i = 0;
    for (e = 0; e < this.objects.length; e++) {
      const n = i + this.objects[e].getLength();
      if (i <= t && t < n) return { index: e, offset: t - i };
      i = n;
    }
    return { index: null, offset: null };
  }
  findPositionAtIndexAndOffset(t, e) {
    let i = 0;
    for (let n = 0; n < this.objects.length; n++) {
      const r = this.objects[n];
      if (n < t) i += r.getLength();
      else if (n === t) {
        i += e;
        break;
      }
    }
    return i;
  }
  getEndPosition() {
    return this.endPosition == null && (this.endPosition = 0, this.objects.forEach((t) => this.endPosition += t.getLength())), this.endPosition;
  }
  toString() {
    return this.objects.join("");
  }
  toArray() {
    return this.objects.slice(0);
  }
  toJSON() {
    return this.toArray();
  }
  isEqualTo(t) {
    return super.isEqualTo(...arguments) || Oa(this.objects, t == null ? void 0 : t.objects);
  }
  contentsForInspection() {
    return { objects: "[".concat(this.objects.map((t) => t.inspect()).join(", "), "]") };
  }
}
const Oa = function(s) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (s.length !== t.length) return !1;
  let e = !0;
  for (let i = 0; i < s.length; i++) {
    const n = s[i];
    e && !n.isEqualTo(t[i]) && (e = !1);
  }
  return e;
}, Ma = (s) => s[0], Ba = (s) => s[1];
class ot extends Bt {
  static textForAttachmentWithAttributes(t, e) {
    return new this([new Jt(t, e)]);
  }
  static textForStringWithAttributes(t, e) {
    return new this([new Rn(t, e)]);
  }
  static fromJSON(t) {
    return new this(Array.from(t).map((e) => Pt.fromJSON(e)));
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments);
    const e = t.filter((i) => !i.isEmpty());
    this.pieceList = new Qe(e);
  }
  copy() {
    return this.copyWithPieceList(this.pieceList);
  }
  copyWithPieceList(t) {
    return new this.constructor(t.consolidate().toArray());
  }
  copyUsingObjectMap(t) {
    const e = this.getPieces().map((i) => t.find(i) || i);
    return new this.constructor(e);
  }
  appendText(t) {
    return this.insertTextAtPosition(t, this.getLength());
  }
  insertTextAtPosition(t, e) {
    return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(t.pieceList, e));
  }
  removeTextAtRange(t) {
    return this.copyWithPieceList(this.pieceList.removeObjectsInRange(t));
  }
  replaceTextAtRange(t, e) {
    return this.removeTextAtRange(e).insertTextAtPosition(t, e[0]);
  }
  moveTextFromRangeToPosition(t, e) {
    if (t[0] <= e && e <= t[1]) return;
    const i = this.getTextAtRange(t), n = i.getLength();
    return t[0] < e && (e -= n), this.removeTextAtRange(t).insertTextAtPosition(i, e);
  }
  addAttributeAtRange(t, e, i) {
    const n = {};
    return n[t] = e, this.addAttributesAtRange(n, i);
  }
  addAttributesAtRange(t, e) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e, (i) => i.copyWithAdditionalAttributes(t)));
  }
  removeAttributeAtRange(t, e) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e, (i) => i.copyWithoutAttribute(t)));
  }
  setAttributesAtRange(t, e) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e, (i) => i.copyWithAttributes(t)));
  }
  getAttributesAtPosition(t) {
    var e;
    return ((e = this.pieceList.getObjectAtPosition(t)) === null || e === void 0 ? void 0 : e.getAttributes()) || {};
  }
  getCommonAttributes() {
    const t = Array.from(this.pieceList.toArray()).map((e) => e.getAttributes());
    return X.fromCommonAttributesOfObjects(t).toObject();
  }
  getCommonAttributesAtRange(t) {
    return this.getTextAtRange(t).getCommonAttributes() || {};
  }
  getExpandedRangeForAttributeAtOffset(t, e) {
    let i, n = i = e;
    const r = this.getLength();
    for (; n > 0 && this.getCommonAttributesAtRange([n - 1, i])[t]; ) n--;
    for (; i < r && this.getCommonAttributesAtRange([e, i + 1])[t]; ) i++;
    return [n, i];
  }
  getTextAtRange(t) {
    return this.copyWithPieceList(this.pieceList.getSplittableListInRange(t));
  }
  getStringAtRange(t) {
    return this.pieceList.getSplittableListInRange(t).toString();
  }
  getStringAtPosition(t) {
    return this.getStringAtRange([t, t + 1]);
  }
  startsWithString(t) {
    return this.getStringAtRange([0, t.length]) === t;
  }
  endsWithString(t) {
    const e = this.getLength();
    return this.getStringAtRange([e - t.length, e]) === t;
  }
  getAttachmentPieces() {
    return this.pieceList.toArray().filter((t) => !!t.attachment);
  }
  getAttachments() {
    return this.getAttachmentPieces().map((t) => t.attachment);
  }
  getAttachmentAndPositionById(t) {
    let e = 0;
    for (const n of this.pieceList.toArray()) {
      var i;
      if (((i = n.attachment) === null || i === void 0 ? void 0 : i.id) === t) return { attachment: n.attachment, position: e };
      e += n.length;
    }
    return { attachment: null, position: null };
  }
  getAttachmentById(t) {
    const { attachment: e } = this.getAttachmentAndPositionById(t);
    return e;
  }
  getRangeOfAttachment(t) {
    const e = this.getAttachmentAndPositionById(t.id), i = e.position;
    if (t = e.attachment) return [i, i + 1];
  }
  updateAttributesForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e);
    return i ? this.addAttributesAtRange(t, i) : this;
  }
  getLength() {
    return this.pieceList.getEndPosition();
  }
  isEmpty() {
    return this.getLength() === 0;
  }
  isEqualTo(t) {
    var e;
    return super.isEqualTo(t) || (t == null || (e = t.pieceList) === null || e === void 0 ? void 0 : e.isEqualTo(this.pieceList));
  }
  isBlockBreak() {
    return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak();
  }
  eachPiece(t) {
    return this.pieceList.eachObject(t);
  }
  getPieces() {
    return this.pieceList.toArray();
  }
  getPieceAtPosition(t) {
    return this.pieceList.getObjectAtPosition(t);
  }
  contentsForInspection() {
    return { pieceList: this.pieceList.inspect() };
  }
  toSerializableText() {
    const t = this.pieceList.selectSplittableList((e) => e.isSerializable());
    return this.copyWithPieceList(t);
  }
  toString() {
    return this.pieceList.toString();
  }
  toJSON() {
    return this.pieceList.toJSON();
  }
  toConsole() {
    return JSON.stringify(this.pieceList.toArray().map((t) => JSON.parse(t.toConsole())));
  }
  getDirection() {
    return $o(this.toString());
  }
  isRTL() {
    return this.getDirection() === "rtl";
  }
}
class lt extends Bt {
  static fromJSON(t) {
    return new this(ot.fromJSON(t.text), t.attributes, t.htmlAttributes);
  }
  constructor(t, e, i) {
    super(...arguments), this.text = Na(t || new ot()), this.attributes = e || [], this.htmlAttributes = i || {};
  }
  isEmpty() {
    return this.text.isBlockBreak();
  }
  isEqualTo(t) {
    return !!super.isEqualTo(t) || this.text.isEqualTo(t == null ? void 0 : t.text) && Ot(this.attributes, t == null ? void 0 : t.attributes) && Yt(this.htmlAttributes, t == null ? void 0 : t.htmlAttributes);
  }
  copyWithText(t) {
    return new lt(t, this.attributes, this.htmlAttributes);
  }
  copyWithoutText() {
    return this.copyWithText(null);
  }
  copyWithAttributes(t) {
    return new lt(this.text, t, this.htmlAttributes);
  }
  copyWithoutAttributes() {
    return this.copyWithAttributes(null);
  }
  copyUsingObjectMap(t) {
    const e = t.find(this.text);
    return e ? this.copyWithText(e) : this.copyWithText(this.text.copyUsingObjectMap(t));
  }
  addAttribute(t) {
    const e = this.attributes.concat(Ls(t));
    return this.copyWithAttributes(e);
  }
  addHTMLAttribute(t, e) {
    const i = Object.assign({}, this.htmlAttributes, { [t]: e });
    return new lt(this.text, this.attributes, i);
  }
  removeAttribute(t) {
    const { listAttribute: e } = D(t), i = ws(ws(this.attributes, t), e);
    return this.copyWithAttributes(i);
  }
  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }
  getLastAttribute() {
    return Ts(this.attributes);
  }
  getAttributes() {
    return this.attributes.slice(0);
  }
  getAttributeLevel() {
    return this.attributes.length;
  }
  getAttributeAtLevel(t) {
    return this.attributes[t - 1];
  }
  hasAttribute(t) {
    return this.attributes.includes(t);
  }
  hasAttributes() {
    return this.getAttributeLevel() > 0;
  }
  getLastNestableAttribute() {
    return Ts(this.getNestableAttributes());
  }
  getNestableAttributes() {
    return this.attributes.filter((t) => D(t).nestable);
  }
  getNestingLevel() {
    return this.getNestableAttributes().length;
  }
  decreaseNestingLevel() {
    const t = this.getLastNestableAttribute();
    return t ? this.removeAttribute(t) : this;
  }
  increaseNestingLevel() {
    const t = this.getLastNestableAttribute();
    if (t) {
      const e = this.attributes.lastIndexOf(t), i = Cn(this.attributes, e + 1, 0, ...Ls(t));
      return this.copyWithAttributes(i);
    }
    return this;
  }
  getListItemAttributes() {
    return this.attributes.filter((t) => D(t).listAttribute);
  }
  isListItem() {
    var t;
    return (t = D(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.listAttribute;
  }
  isTerminalBlock() {
    var t;
    return (t = D(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.terminal;
  }
  breaksOnReturn() {
    var t;
    return (t = D(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.breakOnReturn;
  }
  findLineBreakInDirectionFromPosition(t, e) {
    const i = this.toString();
    let n;
    switch (t) {
      case "forward":
        n = i.indexOf(`
`, e);
        break;
      case "backward":
        n = i.slice(0, e).lastIndexOf(`
`);
    }
    if (n !== -1) return n;
  }
  contentsForInspection() {
    return { text: this.text.inspect(), attributes: this.attributes };
  }
  toString() {
    return this.text.toString();
  }
  toJSON() {
    return { text: this.text, attributes: this.attributes, htmlAttributes: this.htmlAttributes };
  }
  getDirection() {
    return this.text.getDirection();
  }
  isRTL() {
    return this.text.isRTL();
  }
  getLength() {
    return this.text.getLength();
  }
  canBeConsolidatedWith(t) {
    return !this.hasAttributes() && !t.hasAttributes() && this.getDirection() === t.getDirection();
  }
  consolidateWith(t) {
    const e = ot.textForStringWithAttributes(`
`), i = this.getTextWithoutBlockBreak().appendText(e);
    return this.copyWithText(i.appendText(t.text));
  }
  splitAtOffset(t) {
    let e, i;
    return t === 0 ? (e = null, i = this) : t === this.getLength() ? (e = this, i = null) : (e = this.copyWithText(this.text.getTextAtRange([0, t])), i = this.copyWithText(this.text.getTextAtRange([t, this.getLength()]))), [e, i];
  }
  getBlockBreakPosition() {
    return this.text.getLength() - 1;
  }
  getTextWithoutBlockBreak() {
    return Ur(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
  }
  canBeGrouped(t) {
    return this.attributes[t];
  }
  canBeGroupedWith(t, e) {
    const i = t.getAttributes(), n = i[e], r = this.attributes[e];
    return r === n && !(D(r).group === !1 && !(() => {
      if (!Ne) {
        Ne = [];
        for (const o in G) {
          const { listAttribute: a } = G[o];
          a != null && Ne.push(a);
        }
      }
      return Ne;
    })().includes(i[e + 1])) && (this.getDirection() === t.getDirection() || t.isEmpty());
  }
}
const Na = function(s) {
  return s = Pa(s), s = qa(s);
}, Pa = function(s) {
  let t = !1;
  const e = s.getPieces();
  let i = e.slice(0, e.length - 1);
  const n = e[e.length - 1];
  return n ? (i = i.map((r) => r.isBlockBreak() ? (t = !0, Ha(r)) : r), t ? new ot([...i, n]) : s) : s;
}, Fa = ot.textForStringWithAttributes(`
`, { blockBreak: !0 }), qa = function(s) {
  return Ur(s) ? s : s.appendText(Fa);
}, Ur = function(s) {
  const t = s.getLength();
  return t === 0 ? !1 : s.getTextAtRange([t - 1, t]).isBlockBreak();
}, Ha = (s) => s.copyWithoutAttribute("blockBreak"), Ls = function(s) {
  const { listAttribute: t } = D(s);
  return t ? [t, s] : [s];
}, Ts = (s) => s.slice(-1)[0], ws = function(s, t) {
  const e = s.lastIndexOf(t);
  return e === -1 ? s : Cn(s, e, 1);
};
class Q extends Bt {
  static fromJSON(t) {
    return new this(Array.from(t).map((e) => lt.fromJSON(e)));
  }
  static fromString(t, e) {
    const i = ot.textForStringWithAttributes(t, e);
    return new this([new lt(i)]);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), t.length === 0 && (t = [new lt()]), this.blockList = Qe.box(t);
  }
  isEmpty() {
    const t = this.getBlockAtIndex(0);
    return this.blockList.length === 1 && t.isEmpty() && !t.hasAttributes();
  }
  copy() {
    const t = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray();
    return new this.constructor(t);
  }
  copyUsingObjectsFromDocument(t) {
    const e = new Yo(t.getObjects());
    return this.copyUsingObjectMap(e);
  }
  copyUsingObjectMap(t) {
    const e = this.getBlocks().map((i) => t.find(i) || i.copyUsingObjectMap(t));
    return new this.constructor(e);
  }
  copyWithBaseBlockAttributes() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    const e = this.getBlocks().map((i) => {
      const n = t.concat(i.getAttributes());
      return i.copyWithAttributes(n);
    });
    return new this.constructor(e);
  }
  replaceBlock(t, e) {
    const i = this.blockList.indexOf(t);
    return i === -1 ? this : new this.constructor(this.blockList.replaceObjectAtIndex(e, i));
  }
  insertDocumentAtRange(t, e) {
    const { blockList: i } = t;
    e = x(e);
    let [n] = e;
    const { index: r, offset: o } = this.locationFromPosition(n);
    let a = this;
    const c = this.getBlockAtPosition(n);
    return gt(e) && c.isEmpty() && !c.hasAttributes() ? a = new this.constructor(a.blockList.removeObjectAtIndex(r)) : c.getBlockBreakPosition() === o && n++, a = a.removeTextAtRange(e), new this.constructor(a.blockList.insertSplittableListAtPosition(i, n));
  }
  mergeDocumentAtRange(t, e) {
    let i, n;
    e = x(e);
    const [r] = e, o = this.locationFromPosition(r), a = this.getBlockAtIndex(o.index).getAttributes(), c = t.getBaseBlockAttributes(), h = a.slice(-c.length);
    if (Ot(c, h)) {
      const p = a.slice(0, -c.length);
      i = t.copyWithBaseBlockAttributes(p);
    } else i = t.copy({ consolidateBlocks: !0 }).copyWithBaseBlockAttributes(a);
    const d = i.getBlockCount(), m = i.getBlockAtIndex(0);
    if (Ot(a, m.getAttributes())) {
      const p = m.getTextWithoutBlockBreak();
      if (n = this.insertTextAtRange(p, e), d > 1) {
        i = new this.constructor(i.getBlocks().slice(1));
        const f = r + p.getLength();
        n = n.insertDocumentAtRange(i, f);
      }
    } else n = this.insertDocumentAtRange(i, e);
    return n;
  }
  insertTextAtRange(t, e) {
    e = x(e);
    const [i] = e, { index: n, offset: r } = this.locationFromPosition(i), o = this.removeTextAtRange(e);
    return new this.constructor(o.blockList.editObjectAtIndex(n, (a) => a.copyWithText(a.text.insertTextAtPosition(t, r))));
  }
  removeTextAtRange(t) {
    let e;
    t = x(t);
    const [i, n] = t;
    if (gt(t)) return this;
    const [r, o] = Array.from(this.locationRangeFromRange(t)), a = r.index, c = r.offset, h = this.getBlockAtIndex(a), d = o.index, m = o.offset, p = this.getBlockAtIndex(d);
    if (n - i == 1 && h.getBlockBreakPosition() === c && p.getBlockBreakPosition() !== m && p.text.getStringAtPosition(m) === `
`) e = this.blockList.editObjectAtIndex(d, (f) => f.copyWithText(f.text.removeTextAtRange([m, m + 1])));
    else {
      let f;
      const C = h.text.getTextAtRange([0, c]), L = p.text.getTextAtRange([m, p.getLength()]), U = C.appendText(L);
      f = a !== d && c === 0 && h.getAttributeLevel() >= p.getAttributeLevel() ? p.copyWithText(U) : h.copyWithText(U);
      const j = d + 1 - a;
      e = this.blockList.splice(a, j, f);
    }
    return new this.constructor(e);
  }
  moveTextFromRangeToPosition(t, e) {
    let i;
    t = x(t);
    const [n, r] = t;
    if (n <= e && e <= r) return this;
    let o = this.getDocumentAtRange(t), a = this.removeTextAtRange(t);
    const c = n < e;
    c && (e -= o.getLength());
    const [h, ...d] = o.getBlocks();
    return d.length === 0 ? (i = h.getTextWithoutBlockBreak(), c && (e += 1)) : i = h.text, a = a.insertTextAtRange(i, e), d.length === 0 ? a : (o = new this.constructor(d), e += i.getLength(), a.insertDocumentAtRange(o, e));
  }
  addAttributeAtRange(t, e, i) {
    let { blockList: n } = this;
    return this.eachBlockAtRange(i, (r, o, a) => n = n.editObjectAtIndex(a, function() {
      return D(t) ? r.addAttribute(t, e) : o[0] === o[1] ? r : r.copyWithText(r.text.addAttributeAtRange(t, e, o));
    })), new this.constructor(n);
  }
  addAttribute(t, e) {
    let { blockList: i } = this;
    return this.eachBlock((n, r) => i = i.editObjectAtIndex(r, () => n.addAttribute(t, e))), new this.constructor(i);
  }
  removeAttributeAtRange(t, e) {
    let { blockList: i } = this;
    return this.eachBlockAtRange(e, function(n, r, o) {
      D(t) ? i = i.editObjectAtIndex(o, () => n.removeAttribute(t)) : r[0] !== r[1] && (i = i.editObjectAtIndex(o, () => n.copyWithText(n.text.removeAttributeAtRange(t, r))));
    }), new this.constructor(i);
  }
  updateAttributesForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e), [n] = Array.from(i), { index: r } = this.locationFromPosition(n), o = this.getTextAtIndex(r);
    return new this.constructor(this.blockList.editObjectAtIndex(r, (a) => a.copyWithText(o.updateAttributesForAttachment(t, e))));
  }
  removeAttributeForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e);
    return this.removeAttributeAtRange(t, i);
  }
  setHTMLAttributeAtPosition(t, e, i) {
    const n = this.getBlockAtPosition(t), r = n.addHTMLAttribute(e, i);
    return this.replaceBlock(n, r);
  }
  insertBlockBreakAtRange(t) {
    let e;
    t = x(t);
    const [i] = t, { offset: n } = this.locationFromPosition(i), r = this.removeTextAtRange(t);
    return n === 0 && (e = [new lt()]), new this.constructor(r.blockList.insertSplittableListAtPosition(new Qe(e), i));
  }
  applyBlockAttributeAtRange(t, e, i) {
    const n = this.expandRangeToLineBreaksAndSplitBlocks(i);
    let r = n.document;
    i = n.range;
    const o = D(t);
    if (o.listAttribute) {
      r = r.removeLastListAttributeAtRange(i, { exceptAttributeName: t });
      const a = r.convertLineBreaksToBlockBreaksInRange(i);
      r = a.document, i = a.range;
    } else r = o.exclusive ? r.removeBlockAttributesAtRange(i) : o.terminal ? r.removeLastTerminalAttributeAtRange(i) : r.consolidateBlocksAtRange(i);
    return r.addAttributeAtRange(t, e, i);
  }
  removeLastListAttributeAtRange(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, { blockList: i } = this;
    return this.eachBlockAtRange(t, function(n, r, o) {
      const a = n.getLastAttribute();
      a && D(a).listAttribute && a !== e.exceptAttributeName && (i = i.editObjectAtIndex(o, () => n.removeAttribute(a)));
    }), new this.constructor(i);
  }
  removeLastTerminalAttributeAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, function(i, n, r) {
      const o = i.getLastAttribute();
      o && D(o).terminal && (e = e.editObjectAtIndex(r, () => i.removeAttribute(o)));
    }), new this.constructor(e);
  }
  removeBlockAttributesAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, function(i, n, r) {
      i.hasAttributes() && (e = e.editObjectAtIndex(r, () => i.copyWithoutAttributes()));
    }), new this.constructor(e);
  }
  expandRangeToLineBreaksAndSplitBlocks(t) {
    let e;
    t = x(t);
    let [i, n] = t;
    const r = this.locationFromPosition(i), o = this.locationFromPosition(n);
    let a = this;
    const c = a.getBlockAtIndex(r.index);
    if (r.offset = c.findLineBreakInDirectionFromPosition("backward", r.offset), r.offset != null && (e = a.positionFromLocation(r), a = a.insertBlockBreakAtRange([e, e + 1]), o.index += 1, o.offset -= a.getBlockAtIndex(r.index).getLength(), r.index += 1), r.offset = 0, o.offset === 0 && o.index > r.index) o.index -= 1, o.offset = a.getBlockAtIndex(o.index).getBlockBreakPosition();
    else {
      const h = a.getBlockAtIndex(o.index);
      h.text.getStringAtRange([o.offset - 1, o.offset]) === `
` ? o.offset -= 1 : o.offset = h.findLineBreakInDirectionFromPosition("forward", o.offset), o.offset !== h.getBlockBreakPosition() && (e = a.positionFromLocation(o), a = a.insertBlockBreakAtRange([e, e + 1]));
    }
    return i = a.positionFromLocation(r), n = a.positionFromLocation(o), { document: a, range: t = x([i, n]) };
  }
  convertLineBreaksToBlockBreaksInRange(t) {
    t = x(t);
    let [e] = t;
    const i = this.getStringAtRange(t).slice(0, -1);
    let n = this;
    return i.replace(/.*?\n/g, function(r) {
      e += r.length, n = n.insertBlockBreakAtRange([e - 1, e]);
    }), { document: n, range: t };
  }
  consolidateBlocksAtRange(t) {
    t = x(t);
    const [e, i] = t, n = this.locationFromPosition(e).index, r = this.locationFromPosition(i).index;
    return new this.constructor(this.blockList.consolidateFromIndexToIndex(n, r));
  }
  getDocumentAtRange(t) {
    t = x(t);
    const e = this.blockList.getSplittableListInRange(t).toArray();
    return new this.constructor(e);
  }
  getStringAtRange(t) {
    let e;
    const i = t = x(t);
    return i[i.length - 1] !== this.getLength() && (e = -1), this.getDocumentAtRange(t).toString().slice(0, e);
  }
  getBlockAtIndex(t) {
    return this.blockList.getObjectAtIndex(t);
  }
  getBlockAtPosition(t) {
    const { index: e } = this.locationFromPosition(t);
    return this.getBlockAtIndex(e);
  }
  getTextAtIndex(t) {
    var e;
    return (e = this.getBlockAtIndex(t)) === null || e === void 0 ? void 0 : e.text;
  }
  getTextAtPosition(t) {
    const { index: e } = this.locationFromPosition(t);
    return this.getTextAtIndex(e);
  }
  getPieceAtPosition(t) {
    const { index: e, offset: i } = this.locationFromPosition(t);
    return this.getTextAtIndex(e).getPieceAtPosition(i);
  }
  getCharacterAtPosition(t) {
    const { index: e, offset: i } = this.locationFromPosition(t);
    return this.getTextAtIndex(e).getStringAtRange([i, i + 1]);
  }
  getLength() {
    return this.blockList.getEndPosition();
  }
  getBlocks() {
    return this.blockList.toArray();
  }
  getBlockCount() {
    return this.blockList.length;
  }
  getEditCount() {
    return this.editCount;
  }
  eachBlock(t) {
    return this.blockList.eachObject(t);
  }
  eachBlockAtRange(t, e) {
    let i, n;
    t = x(t);
    const [r, o] = t, a = this.locationFromPosition(r), c = this.locationFromPosition(o);
    if (a.index === c.index) return i = this.getBlockAtIndex(a.index), n = [a.offset, c.offset], e(i, n, a.index);
    for (let h = a.index; h <= c.index; h++) if (i = this.getBlockAtIndex(h), i) {
      switch (h) {
        case a.index:
          n = [a.offset, i.text.getLength()];
          break;
        case c.index:
          n = [0, c.offset];
          break;
        default:
          n = [0, i.text.getLength()];
      }
      e(i, n, h);
    }
  }
  getCommonAttributesAtRange(t) {
    t = x(t);
    const [e] = t;
    if (gt(t)) return this.getCommonAttributesAtPosition(e);
    {
      const i = [], n = [];
      return this.eachBlockAtRange(t, function(r, o) {
        if (o[0] !== o[1]) return i.push(r.text.getCommonAttributesAtRange(o)), n.push(ks(r));
      }), X.fromCommonAttributesOfObjects(i).merge(X.fromCommonAttributesOfObjects(n)).toObject();
    }
  }
  getCommonAttributesAtPosition(t) {
    let e, i;
    const { index: n, offset: r } = this.locationFromPosition(t), o = this.getBlockAtIndex(n);
    if (!o) return {};
    const a = ks(o), c = o.text.getAttributesAtPosition(r), h = o.text.getAttributesAtPosition(r - 1), d = Object.keys(Dt).filter((m) => Dt[m].inheritable);
    for (e in h) i = h[e], (i === c[e] || d.includes(e)) && (a[e] = i);
    return a;
  }
  getRangeOfCommonAttributeAtPosition(t, e) {
    const { index: i, offset: n } = this.locationFromPosition(e), r = this.getTextAtIndex(i), [o, a] = Array.from(r.getExpandedRangeForAttributeAtOffset(t, n)), c = this.positionFromLocation({ index: i, offset: o }), h = this.positionFromLocation({ index: i, offset: a });
    return x([c, h]);
  }
  getBaseBlockAttributes() {
    let t = this.getBlockAtIndex(0).getAttributes();
    for (let e = 1; e < this.getBlockCount(); e++) {
      const i = this.getBlockAtIndex(e).getAttributes(), n = Math.min(t.length, i.length);
      t = (() => {
        const r = [];
        for (let o = 0; o < n && i[o] === t[o]; o++) r.push(i[o]);
        return r;
      })();
    }
    return t;
  }
  getAttachmentById(t) {
    for (const e of this.getAttachments()) if (e.id === t) return e;
  }
  getAttachmentPieces() {
    let t = [];
    return this.blockList.eachObject((e) => {
      let { text: i } = e;
      return t = t.concat(i.getAttachmentPieces());
    }), t;
  }
  getAttachments() {
    return this.getAttachmentPieces().map((t) => t.attachment);
  }
  getRangeOfAttachment(t) {
    let e = 0;
    const i = this.blockList.toArray();
    for (let n = 0; n < i.length; n++) {
      const { text: r } = i[n], o = r.getRangeOfAttachment(t);
      if (o) return x([e + o[0], e + o[1]]);
      e += r.getLength();
    }
  }
  getLocationRangeOfAttachment(t) {
    const e = this.getRangeOfAttachment(t);
    return this.locationRangeFromRange(e);
  }
  getAttachmentPieceForAttachment(t) {
    for (const e of this.getAttachmentPieces()) if (e.attachment === t) return e;
  }
  findRangesForBlockAttribute(t) {
    let e = 0;
    const i = [];
    return this.getBlocks().forEach((n) => {
      const r = n.getLength();
      n.hasAttribute(t) && i.push([e, e + r]), e += r;
    }), i;
  }
  findRangesForTextAttribute(t) {
    let { withValue: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = 0, n = [];
    const r = [];
    return this.getPieces().forEach((o) => {
      const a = o.getLength();
      (function(c) {
        return e ? c.getAttribute(t) === e : c.hasAttribute(t);
      })(o) && (n[1] === i ? n[1] = i + a : r.push(n = [i, i + a])), i += a;
    }), r;
  }
  locationFromPosition(t) {
    const e = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, t));
    if (e.index != null) return e;
    {
      const i = this.getBlocks();
      return { index: i.length - 1, offset: i[i.length - 1].getLength() };
    }
  }
  positionFromLocation(t) {
    return this.blockList.findPositionAtIndexAndOffset(t.index, t.offset);
  }
  locationRangeFromPosition(t) {
    return x(this.locationFromPosition(t));
  }
  locationRangeFromRange(t) {
    if (!(t = x(t))) return;
    const [e, i] = Array.from(t), n = this.locationFromPosition(e), r = this.locationFromPosition(i);
    return x([n, r]);
  }
  rangeFromLocationRange(t) {
    let e;
    t = x(t);
    const i = this.positionFromLocation(t[0]);
    return gt(t) || (e = this.positionFromLocation(t[1])), x([i, e]);
  }
  isEqualTo(t) {
    return this.blockList.isEqualTo(t == null ? void 0 : t.blockList);
  }
  getTexts() {
    return this.getBlocks().map((t) => t.text);
  }
  getPieces() {
    const t = [];
    return Array.from(this.getTexts()).forEach((e) => {
      t.push(...Array.from(e.getPieces() || []));
    }), t;
  }
  getObjects() {
    return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
  }
  toSerializableDocument() {
    const t = [];
    return this.blockList.eachObject((e) => t.push(e.copyWithText(e.text.toSerializableText()))), new this.constructor(t);
  }
  toString() {
    return this.blockList.toString();
  }
  toJSON() {
    return this.blockList.toJSON();
  }
  toConsole() {
    return JSON.stringify(this.blockList.toArray().map((t) => JSON.parse(t.text.toConsole())));
  }
}
const ks = function(s) {
  const t = {}, e = s.getLastAttribute();
  return e && (t[e] = !0), t;
}, qi = function(s) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return { string: s = ue(s), attributes: t, type: "string" };
}, Is = (s, t) => {
  try {
    return JSON.parse(s.getAttribute("data-trix-".concat(t)));
  } catch {
    return {};
  }
};
class Se extends M {
  static parse(t, e) {
    const i = new this(t, e);
    return i.parse(), i;
  }
  constructor(t) {
    let { referenceElement: e, purifyOptions: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.html = t, this.referenceElement = e, this.purifyOptions = i, this.blocks = [], this.blockElements = [], this.processedElements = [];
  }
  getDocument() {
    return Q.fromJSON(this.blocks);
  }
  parse() {
    try {
      this.createHiddenContainer(), ni.setHTML(this.containerElement, this.html, { purifyOptions: this.purifyOptions });
      const t = Je(this.containerElement, { usingFilter: Ua });
      for (; t.nextNode(); ) this.processNode(t.currentNode);
      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }
  createHiddenContainer() {
    return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(!1), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = _({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
  }
  removeHiddenContainer() {
    return yt(this.containerElement);
  }
  processNode(t) {
    switch (t.nodeType) {
      case Node.TEXT_NODE:
        if (!this.isInsignificantTextNode(t)) return this.appendBlockForTextNode(t), this.processTextNode(t);
        break;
      case Node.ELEMENT_NODE:
        return this.appendBlockForElement(t), this.processElement(t);
    }
  }
  appendBlockForTextNode(t) {
    const e = t.parentNode;
    if (e === this.currentBlockElement && this.isBlockElement(t.previousSibling)) return this.appendStringWithAttributes(`
`);
    if (e === this.containerElement || this.isBlockElement(e)) {
      var i;
      const n = this.getBlockAttributes(e), r = this.getBlockHTMLAttributes(e);
      Ot(n, (i = this.currentBlock) === null || i === void 0 ? void 0 : i.attributes) || (this.currentBlock = this.appendBlockForAttributesWithElement(n, e, r), this.currentBlockElement = e);
    }
  }
  appendBlockForElement(t) {
    const e = this.isBlockElement(t), i = Tt(this.currentBlockElement, t);
    if (e && !this.isBlockElement(t.firstChild)) {
      if (!this.isInsignificantTextNode(t.firstChild) || !this.isBlockElement(t.firstElementChild)) {
        const n = this.getBlockAttributes(t), r = this.getBlockHTMLAttributes(t);
        if (t.firstChild) {
          if (i && Ot(n, this.currentBlock.attributes)) return this.appendStringWithAttributes(`
`);
          this.currentBlock = this.appendBlockForAttributesWithElement(n, t, r), this.currentBlockElement = t;
        }
      }
    } else if (this.currentBlockElement && !i && !e) {
      const n = this.findParentBlockElement(t);
      if (n) return this.appendBlockForElement(n);
      this.currentBlock = this.appendEmptyBlock(), this.currentBlockElement = null;
    }
  }
  findParentBlockElement(t) {
    let { parentElement: e } = t;
    for (; e && e !== this.containerElement; ) {
      if (this.isBlockElement(e) && this.blockElements.includes(e)) return e;
      e = e.parentElement;
    }
    return null;
  }
  processTextNode(t) {
    let e = t.data;
    var i;
    return Rs(t.parentNode) || (e = wn(e), jr((i = t.previousSibling) === null || i === void 0 ? void 0 : i.textContent) && (e = ja(e))), this.appendStringWithAttributes(e, this.getTextAttributes(t.parentNode));
  }
  processElement(t) {
    let e;
    if (It(t)) {
      if (e = Is(t, "attachment"), Object.keys(e).length) {
        const i = this.getTextAttributes(t);
        this.appendAttachmentWithAttributes(e, i), t.innerHTML = "";
      }
      return this.processedElements.push(t);
    }
    switch (K(t)) {
      case "br":
        return this.isExtraBR(t) || this.isBlockElement(t.nextSibling) || this.appendStringWithAttributes(`
`, this.getTextAttributes(t)), this.processedElements.push(t);
      case "img":
        e = { url: t.getAttribute("src"), contentType: "image" };
        const i = ((n) => {
          const r = n.getAttribute("width"), o = n.getAttribute("height"), a = {};
          return r && (a.width = parseInt(r, 10)), o && (a.height = parseInt(o, 10)), a;
        })(t);
        for (const n in i) {
          const r = i[n];
          e[n] = r;
        }
        return this.appendAttachmentWithAttributes(e, this.getTextAttributes(t)), this.processedElements.push(t);
      case "tr":
        if (this.needsTableSeparator(t)) return this.appendStringWithAttributes(ze.tableRowSeparator);
        break;
      case "td":
        if (this.needsTableSeparator(t)) return this.appendStringWithAttributes(ze.tableCellSeparator);
    }
  }
  appendBlockForAttributesWithElement(t, e) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.blockElements.push(e);
    const n = function() {
      return { text: [], attributes: arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, htmlAttributes: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {} };
    }(t, i);
    return this.blocks.push(n), n;
  }
  appendEmptyBlock() {
    return this.appendBlockForAttributesWithElement([], null);
  }
  appendStringWithAttributes(t, e) {
    return this.appendPiece(qi(t, e));
  }
  appendAttachmentWithAttributes(t, e) {
    return this.appendPiece(function(i) {
      return { attachment: i, attributes: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, type: "attachment" };
    }(t, e));
  }
  appendPiece(t) {
    return this.blocks.length === 0 && this.appendEmptyBlock(), this.blocks[this.blocks.length - 1].text.push(t);
  }
  appendStringToTextAtIndex(t, e) {
    const { text: i } = this.blocks[e], n = i[i.length - 1];
    if ((n == null ? void 0 : n.type) !== "string") return i.push(qi(t));
    n.string += t;
  }
  prependStringToTextAtIndex(t, e) {
    const { text: i } = this.blocks[e], n = i[0];
    if ((n == null ? void 0 : n.type) !== "string") return i.unshift(qi(t));
    n.string = t + n.string;
  }
  getTextAttributes(t) {
    let e;
    const i = {};
    for (const n in Dt) {
      const r = Dt[n];
      if (r.tagName && At(t, { matchingSelector: r.tagName, untilNode: this.containerElement })) i[n] = !0;
      else if (r.parser) {
        if (e = r.parser(t), e) {
          let o = !1;
          for (const a of this.findBlockElementAncestors(t)) if (r.parser(a) === e) {
            o = !0;
            break;
          }
          o || (i[n] = e);
        }
      } else r.styleProperty && (e = t.style[r.styleProperty], e && (i[n] = e));
    }
    if (It(t)) {
      const n = Is(t, "attributes");
      for (const r in n) e = n[r], i[r] = e;
    }
    return i;
  }
  getBlockAttributes(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      for (const n in G) {
        const r = G[n];
        var i;
        r.parse !== !1 && K(t) === r.tagName && ((i = r.test) !== null && i !== void 0 && i.call(r, t) || !r.test) && (e.push(n), r.listAttribute && e.push(r.listAttribute));
      }
      t = t.parentNode;
    }
    return e.reverse();
  }
  getBlockHTMLAttributes(t) {
    const e = {}, i = Object.values(G).find((n) => n.tagName === K(t));
    return ((i == null ? void 0 : i.htmlAttributes) || []).forEach((n) => {
      t.hasAttribute(n) && (e[n] = t.getAttribute(n));
    }), e;
  }
  findBlockElementAncestors(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      const i = K(t);
      ge().includes(i) && e.push(t), t = t.parentNode;
    }
    return e;
  }
  isBlockElement(t) {
    if ((t == null ? void 0 : t.nodeType) === Node.ELEMENT_NODE && !It(t) && !At(t, { matchingSelector: "td", untilNode: this.containerElement })) return ge().includes(K(t)) || window.getComputedStyle(t).display === "block";
  }
  isInsignificantTextNode(t) {
    if ((t == null ? void 0 : t.nodeType) !== Node.TEXT_NODE || !Va(t.data)) return;
    const { parentNode: e, previousSibling: i, nextSibling: n } = t;
    return $a(e.previousSibling) && !this.isBlockElement(e.previousSibling) || Rs(e) ? void 0 : !i || this.isBlockElement(i) || !n || this.isBlockElement(n);
  }
  isExtraBR(t) {
    return K(t) === "br" && this.isBlockElement(t.parentNode) && t.parentNode.lastChild === t;
  }
  needsTableSeparator(t) {
    if (ze.removeBlankTableCells) {
      var e;
      const i = (e = t.previousSibling) === null || e === void 0 ? void 0 : e.textContent;
      return i && /\S/.test(i);
    }
    return t.previousSibling;
  }
  translateBlockElementMarginsToNewlines() {
    const t = this.getMarginOfDefaultBlockElement();
    for (let e = 0; e < this.blocks.length; e++) {
      const i = this.getMarginOfBlockElementAtIndex(e);
      i && (i.top > 2 * t.top && this.prependStringToTextAtIndex(`
`, e), i.bottom > 2 * t.bottom && this.appendStringToTextAtIndex(`
`, e));
    }
  }
  getMarginOfBlockElementAtIndex(t) {
    const e = this.blockElements[t];
    if (e && e.textContent && !ge().includes(K(e)) && !this.processedElements.includes(e)) return Ds(e);
  }
  getMarginOfDefaultBlockElement() {
    const t = _(G.default.tagName);
    return this.containerElement.appendChild(t), Ds(t);
  }
}
const Rs = function(s) {
  const { whiteSpace: t } = window.getComputedStyle(s);
  return ["pre", "pre-wrap", "pre-line"].includes(t);
}, $a = (s) => s && !jr(s.textContent), Ds = function(s) {
  const t = window.getComputedStyle(s);
  if (t.display === "block") return { top: parseInt(t.marginTop), bottom: parseInt(t.marginBottom) };
}, Ua = function(s) {
  return K(s) === "style" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, ja = (s) => s.replace(new RegExp("^".concat(Tn.source, "+")), ""), Va = (s) => new RegExp("^".concat(Tn.source, "*$")).test(s), jr = (s) => /\s$/.test(s), Wa = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"], pn = "data-trix-serialized-attributes", za = "[".concat(pn, "]"), Ka = new RegExp("<!--block-->", "g"), Ga = { "application/json": function(s) {
  let t;
  if (s instanceof Q) t = s;
  else {
    if (!(s instanceof HTMLElement)) throw new Error("unserializable object");
    t = Se.parse(s.innerHTML).getDocument();
  }
  return t.toSerializableDocument().toJSONString();
}, "text/html": function(s) {
  let t;
  if (s instanceof Q) t = si.render(s);
  else {
    if (!(s instanceof HTMLElement)) throw new Error("unserializable object");
    t = s.cloneNode(!0);
  }
  return Array.from(t.querySelectorAll("[data-trix-serialize=false]")).forEach((e) => {
    yt(e);
  }), Wa.forEach((e) => {
    Array.from(t.querySelectorAll("[".concat(e, "]"))).forEach((i) => {
      i.removeAttribute(e);
    });
  }), Array.from(t.querySelectorAll(za)).forEach((e) => {
    try {
      const i = JSON.parse(e.getAttribute(pn));
      e.removeAttribute(pn);
      for (const n in i) {
        const r = i[n];
        e.setAttribute(n, r);
      }
    } catch {
    }
  }), t.innerHTML.replace(Ka, "");
} };
var Ja = Object.freeze({ __proto__: null });
class w extends M {
  constructor(t, e) {
    super(...arguments), this.attachmentManager = t, this.attachment = e, this.id = this.attachment.id, this.file = this.attachment.file;
  }
  remove() {
    return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
  }
}
w.proxyMethod("attachment.getAttribute"), w.proxyMethod("attachment.hasAttribute"), w.proxyMethod("attachment.setAttribute"), w.proxyMethod("attachment.getAttributes"), w.proxyMethod("attachment.setAttributes"), w.proxyMethod("attachment.isPending"), w.proxyMethod("attachment.isPreviewable"), w.proxyMethod("attachment.getURL"), w.proxyMethod("attachment.getPreviewURL"), w.proxyMethod("attachment.setPreviewURL"), w.proxyMethod("attachment.getHref"), w.proxyMethod("attachment.getFilename"), w.proxyMethod("attachment.getFilesize"), w.proxyMethod("attachment.getFormattedFilesize"), w.proxyMethod("attachment.getExtension"), w.proxyMethod("attachment.getContentType"), w.proxyMethod("attachment.getFile"), w.proxyMethod("attachment.setFile"), w.proxyMethod("attachment.releaseFile"), w.proxyMethod("attachment.getUploadProgress"), w.proxyMethod("attachment.setUploadProgress");
class Vr extends M {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), this.managedAttachments = {}, Array.from(t).forEach((e) => {
      this.manageAttachment(e);
    });
  }
  getAttachments() {
    const t = [];
    for (const e in this.managedAttachments) {
      const i = this.managedAttachments[e];
      t.push(i);
    }
    return t;
  }
  manageAttachment(t) {
    return this.managedAttachments[t.id] || (this.managedAttachments[t.id] = new w(this, t)), this.managedAttachments[t.id];
  }
  attachmentIsManaged(t) {
    return t.id in this.managedAttachments;
  }
  requestRemovalOfAttachment(t) {
    var e, i;
    if (this.attachmentIsManaged(t)) return (e = this.delegate) === null || e === void 0 || (i = e.attachmentManagerDidRequestRemovalOfAttachment) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  unmanageAttachment(t) {
    const e = this.managedAttachments[t.id];
    return delete this.managedAttachments[t.id], e;
  }
}
class Wr {
  constructor(t) {
    this.composition = t, this.document = this.composition.document;
    const e = this.composition.getSelectedRange();
    this.startPosition = e[0], this.endPosition = e[1], this.startLocation = this.document.locationFromPosition(this.startPosition), this.endLocation = this.document.locationFromPosition(this.endPosition), this.block = this.document.getBlockAtIndex(this.endLocation.index), this.breaksOnReturn = this.block.breaksOnReturn(), this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1), this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
  }
  shouldInsertBlockBreak() {
    return this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty() ? this.startLocation.offset !== 0 : this.breaksOnReturn && this.nextCharacter !== `
`;
  }
  shouldBreakFormattedBlock() {
    return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && this.nextCharacter === `
` || this.previousCharacter === `
`);
  }
  shouldDecreaseListLevel() {
    return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
  }
  shouldPrependListItem() {
    return this.block.isListItem() && this.startLocation.offset === 0 && !this.block.isEmpty();
  }
  shouldRemoveLastBlockAttribute() {
    return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
  }
}
class vt extends M {
  constructor() {
    super(...arguments), this.document = new Q(), this.attachments = [], this.currentAttributes = {}, this.revision = 0;
  }
  setDocument(t) {
    var e, i;
    if (!t.isEqualTo(this.document)) return this.document = t, this.refreshAttachments(), this.revision++, (e = this.delegate) === null || e === void 0 || (i = e.compositionDidChangeDocument) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  getSnapshot() {
    return { document: this.document, selectedRange: this.getSelectedRange() };
  }
  loadSnapshot(t) {
    var e, i, n, r;
    let { document: o, selectedRange: a } = t;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionWillLoadSnapshot) === null || i === void 0 || i.call(e), this.setDocument(o ?? new Q()), this.setSelection(a ?? [0, 0]), (n = this.delegate) === null || n === void 0 || (r = n.compositionDidLoadSnapshot) === null || r === void 0 ? void 0 : r.call(n);
  }
  insertText(t) {
    let { updatePosition: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { updatePosition: !0 };
    const i = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(t, i));
    const n = i[0], r = n + t.getLength();
    return e && this.setSelection(r), this.notifyDelegateOfInsertionAtRange([n, r]);
  }
  insertBlock() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new lt();
    const e = new Q([t]);
    return this.insertDocument(e);
  }
  insertDocument() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Q();
    const e = this.getSelectedRange();
    this.setDocument(this.document.insertDocumentAtRange(t, e));
    const i = e[0], n = i + t.getLength();
    return this.setSelection(n), this.notifyDelegateOfInsertionAtRange([i, n]);
  }
  insertString(t, e) {
    const i = this.getCurrentTextAttributes(), n = ot.textForStringWithAttributes(t, i);
    return this.insertText(n, e);
  }
  insertBlockBreak() {
    const t = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(t));
    const e = t[0], i = e + 1;
    return this.setSelection(i), this.notifyDelegateOfInsertionAtRange([e, i]);
  }
  insertLineBreak() {
    const t = new Wr(this);
    if (t.shouldDecreaseListLevel()) return this.decreaseListLevel(), this.setSelection(t.startPosition);
    if (t.shouldPrependListItem()) {
      const e = new Q([t.block.copyWithoutText()]);
      return this.insertDocument(e);
    }
    return t.shouldInsertBlockBreak() ? this.insertBlockBreak() : t.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : t.shouldBreakFormattedBlock() ? this.breakFormattedBlock(t) : this.insertString(`
`);
  }
  insertHTML(t) {
    const e = Se.parse(t, { purifyOptions: { SAFE_FOR_XML: !0 } }).getDocument(), i = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(e, i));
    const n = i[0], r = n + e.getLength() - 1;
    return this.setSelection(r), this.notifyDelegateOfInsertionAtRange([n, r]);
  }
  replaceHTML(t) {
    const e = Se.parse(t).getDocument().copyUsingObjectsFromDocument(this.document), i = this.getLocationRange({ strict: !1 }), n = this.document.rangeFromLocationRange(i);
    return this.setDocument(e), this.setSelection(n);
  }
  insertFile(t) {
    return this.insertFiles([t]);
  }
  insertFiles(t) {
    const e = [];
    return Array.from(t).forEach((i) => {
      var n;
      if ((n = this.delegate) !== null && n !== void 0 && n.compositionShouldAcceptFile(i)) {
        const r = Xt.attachmentForFile(i);
        e.push(r);
      }
    }), this.insertAttachments(e);
  }
  insertAttachment(t) {
    return this.insertAttachments([t]);
  }
  insertAttachments(t) {
    let e = new ot();
    return Array.from(t).forEach((i) => {
      var n;
      const r = i.getType(), o = (n = yn[r]) === null || n === void 0 ? void 0 : n.presentation, a = this.getCurrentTextAttributes();
      o && (a.presentation = o);
      const c = ot.textForAttachmentWithAttributes(i, a);
      e = e.appendText(c);
    }), this.insertText(e);
  }
  shouldManageDeletingInDirection(t) {
    const e = this.getLocationRange();
    if (gt(e)) {
      if (t === "backward" && e[0].offset === 0 || this.shouldManageMovingCursorInDirection(t)) return !0;
    } else if (e[0].index !== e[1].index) return !0;
    return !1;
  }
  deleteInDirection(t) {
    let e, i, n, { length: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const o = this.getLocationRange();
    let a = this.getSelectedRange();
    const c = gt(a);
    if (c ? i = t === "backward" && o[0].offset === 0 : n = o[0].index !== o[1].index, i && this.canDecreaseBlockAttributeLevel()) {
      const h = this.getBlock();
      if (h.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(a[0]), h.isEmpty()) return !1;
    }
    return c && (a = this.getExpandedRangeInDirection(t, { length: r }), t === "backward" && (e = this.getAttachmentAtRange(a))), e ? (this.editAttachment(e), !1) : (this.setDocument(this.document.removeTextAtRange(a)), this.setSelection(a[0]), !i && !n && void 0);
  }
  moveTextFromRange(t) {
    const [e] = Array.from(this.getSelectedRange());
    return this.setDocument(this.document.moveTextFromRangeToPosition(t, e)), this.setSelection(e);
  }
  removeAttachment(t) {
    const e = this.document.getRangeOfAttachment(t);
    if (e) return this.stopEditingAttachment(), this.setDocument(this.document.removeTextAtRange(e)), this.setSelection(e[0]);
  }
  removeLastBlockAttribute() {
    const [t, e] = Array.from(this.getSelectedRange()), i = this.document.getBlockAtPosition(e);
    return this.removeCurrentAttribute(i.getLastAttribute()), this.setSelection(t);
  }
  insertPlaceholder() {
    return this.placeholderPosition = this.getPosition(), this.insertString(" ");
  }
  selectPlaceholder() {
    if (this.placeholderPosition != null) return this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + 1]), this.getSelectedRange();
  }
  forgetPlaceholder() {
    this.placeholderPosition = null;
  }
  hasCurrentAttribute(t) {
    const e = this.currentAttributes[t];
    return e != null && e !== !1;
  }
  toggleCurrentAttribute(t) {
    const e = !this.currentAttributes[t];
    return e ? this.setCurrentAttribute(t, e) : this.removeCurrentAttribute(t);
  }
  canSetCurrentAttribute(t) {
    return D(t) ? this.canSetCurrentBlockAttribute(t) : this.canSetCurrentTextAttribute(t);
  }
  canSetCurrentTextAttribute(t) {
    const e = this.getSelectedDocument();
    if (e) {
      for (const i of Array.from(e.getAttachments())) if (!i.hasContent()) return !1;
      return !0;
    }
  }
  canSetCurrentBlockAttribute(t) {
    const e = this.getBlock();
    if (e) return !e.isTerminalBlock();
  }
  setCurrentAttribute(t, e) {
    return D(t) ? this.setBlockAttribute(t, e) : (this.setTextAttribute(t, e), this.currentAttributes[t] = e, this.notifyDelegateOfCurrentAttributesChange());
  }
  setHTMLAtributeAtPosition(t, e, i) {
    var n;
    const r = this.document.getBlockAtPosition(t), o = (n = D(r.getLastAttribute())) === null || n === void 0 ? void 0 : n.htmlAttributes;
    if (r && o != null && o.includes(e)) {
      const a = this.document.setHTMLAttributeAtPosition(t, e, i);
      this.setDocument(a);
    }
  }
  setTextAttribute(t, e) {
    const i = this.getSelectedRange();
    if (!i) return;
    const [n, r] = Array.from(i);
    if (n !== r) return this.setDocument(this.document.addAttributeAtRange(t, e, i));
    if (t === "href") {
      const o = ot.textForStringWithAttributes(e, { href: e });
      return this.insertText(o);
    }
  }
  setBlockAttribute(t, e) {
    const i = this.getSelectedRange();
    if (this.canSetCurrentAttribute(t)) return this.setDocument(this.document.applyBlockAttributeAtRange(t, e, i)), this.setSelection(i);
  }
  removeCurrentAttribute(t) {
    return D(t) ? (this.removeBlockAttribute(t), this.updateCurrentAttributes()) : (this.removeTextAttribute(t), delete this.currentAttributes[t], this.notifyDelegateOfCurrentAttributesChange());
  }
  removeTextAttribute(t) {
    const e = this.getSelectedRange();
    if (e) return this.setDocument(this.document.removeAttributeAtRange(t, e));
  }
  removeBlockAttribute(t) {
    const e = this.getSelectedRange();
    if (e) return this.setDocument(this.document.removeAttributeAtRange(t, e));
  }
  canDecreaseNestingLevel() {
    var t;
    return ((t = this.getBlock()) === null || t === void 0 ? void 0 : t.getNestingLevel()) > 0;
  }
  canIncreaseNestingLevel() {
    var t;
    const e = this.getBlock();
    if (e) {
      if ((t = D(e.getLastNestableAttribute())) === null || t === void 0 || !t.listAttribute) return e.getNestingLevel() > 0;
      {
        const i = this.getPreviousBlock();
        if (i) return function() {
          let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
          return Ot((arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).slice(0, n.length), n);
        }(i.getListItemAttributes(), e.getListItemAttributes());
      }
    }
  }
  decreaseNestingLevel() {
    const t = this.getBlock();
    if (t) return this.setDocument(this.document.replaceBlock(t, t.decreaseNestingLevel()));
  }
  increaseNestingLevel() {
    const t = this.getBlock();
    if (t) return this.setDocument(this.document.replaceBlock(t, t.increaseNestingLevel()));
  }
  canDecreaseBlockAttributeLevel() {
    var t;
    return ((t = this.getBlock()) === null || t === void 0 ? void 0 : t.getAttributeLevel()) > 0;
  }
  decreaseBlockAttributeLevel() {
    var t;
    const e = (t = this.getBlock()) === null || t === void 0 ? void 0 : t.getLastAttribute();
    if (e) return this.removeCurrentAttribute(e);
  }
  decreaseListLevel() {
    let [t] = Array.from(this.getSelectedRange());
    const { index: e } = this.document.locationFromPosition(t);
    let i = e;
    const n = this.getBlock().getAttributeLevel();
    let r = this.document.getBlockAtIndex(i + 1);
    for (; r && r.isListItem() && !(r.getAttributeLevel() <= n); ) i++, r = this.document.getBlockAtIndex(i + 1);
    t = this.document.positionFromLocation({ index: e, offset: 0 });
    const o = this.document.positionFromLocation({ index: i, offset: 0 });
    return this.setDocument(this.document.removeLastListAttributeAtRange([t, o]));
  }
  updateCurrentAttributes() {
    const t = this.getSelectedRange({ ignoreLock: !0 });
    if (t) {
      const e = this.document.getCommonAttributesAtRange(t);
      if (Array.from(hn()).forEach((i) => {
        e[i] || this.canSetCurrentAttribute(i) || (e[i] = !1);
      }), !Yt(e, this.currentAttributes)) return this.currentAttributes = e, this.notifyDelegateOfCurrentAttributesChange();
    }
  }
  getCurrentAttributes() {
    return _r.call({}, this.currentAttributes);
  }
  getCurrentTextAttributes() {
    const t = {};
    for (const e in this.currentAttributes) {
      const i = this.currentAttributes[e];
      i !== !1 && dn(e) && (t[e] = i);
    }
    return t;
  }
  freezeSelection() {
    return this.setCurrentAttribute("frozen", !0);
  }
  thawSelection() {
    return this.removeCurrentAttribute("frozen");
  }
  hasFrozenSelection() {
    return this.hasCurrentAttribute("frozen");
  }
  setSelection(t) {
    var e;
    const i = this.document.locationRangeFromRange(t);
    return (e = this.delegate) === null || e === void 0 ? void 0 : e.compositionDidRequestChangingSelectionToLocationRange(i);
  }
  getSelectedRange() {
    const t = this.getLocationRange();
    if (t) return this.document.rangeFromLocationRange(t);
  }
  setSelectedRange(t) {
    const e = this.document.locationRangeFromRange(t);
    return this.getSelectionManager().setLocationRange(e);
  }
  getPosition() {
    const t = this.getLocationRange();
    if (t) return this.document.positionFromLocation(t[0]);
  }
  getLocationRange(t) {
    return this.targetLocationRange ? this.targetLocationRange : this.getSelectionManager().getLocationRange(t) || x({ index: 0, offset: 0 });
  }
  withTargetLocationRange(t, e) {
    let i;
    this.targetLocationRange = t;
    try {
      i = e();
    } finally {
      this.targetLocationRange = null;
    }
    return i;
  }
  withTargetRange(t, e) {
    const i = this.document.locationRangeFromRange(t);
    return this.withTargetLocationRange(i, e);
  }
  withTargetDOMRange(t, e) {
    const i = this.createLocationRangeFromDOMRange(t, { strict: !1 });
    return this.withTargetLocationRange(i, e);
  }
  getExpandedRangeInDirection(t) {
    let { length: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, [i, n] = Array.from(this.getSelectedRange());
    return t === "backward" ? e ? i -= e : i = this.translateUTF16PositionFromOffset(i, -1) : e ? n += e : n = this.translateUTF16PositionFromOffset(n, 1), x([i, n]);
  }
  shouldManageMovingCursorInDirection(t) {
    if (this.editingAttachment) return !0;
    const e = this.getExpandedRangeInDirection(t);
    return this.getAttachmentAtRange(e) != null;
  }
  moveCursorInDirection(t) {
    let e, i;
    if (this.editingAttachment) i = this.document.getRangeOfAttachment(this.editingAttachment);
    else {
      const n = this.getSelectedRange();
      i = this.getExpandedRangeInDirection(t), e = !Ye(n, i);
    }
    if (t === "backward" ? this.setSelectedRange(i[0]) : this.setSelectedRange(i[1]), e) {
      const n = this.getAttachmentAtRange(i);
      if (n) return this.editAttachment(n);
    }
  }
  expandSelectionInDirection(t) {
    let { length: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const i = this.getExpandedRangeInDirection(t, { length: e });
    return this.setSelectedRange(i);
  }
  expandSelectionForEditing() {
    if (this.hasCurrentAttribute("href")) return this.expandSelectionAroundCommonAttribute("href");
  }
  expandSelectionAroundCommonAttribute(t) {
    const e = this.getPosition(), i = this.document.getRangeOfCommonAttributeAtPosition(t, e);
    return this.setSelectedRange(i);
  }
  selectionContainsAttachments() {
    var t;
    return ((t = this.getSelectedAttachments()) === null || t === void 0 ? void 0 : t.length) > 0;
  }
  selectionIsInCursorTarget() {
    return this.editingAttachment || this.positionIsCursorTarget(this.getPosition());
  }
  positionIsCursorTarget(t) {
    const e = this.document.locationFromPosition(t);
    if (e) return this.locationIsCursorTarget(e);
  }
  positionIsBlockBreak(t) {
    var e;
    return (e = this.document.getPieceAtPosition(t)) === null || e === void 0 ? void 0 : e.isBlockBreak();
  }
  getSelectedDocument() {
    const t = this.getSelectedRange();
    if (t) return this.document.getDocumentAtRange(t);
  }
  getSelectedAttachments() {
    var t;
    return (t = this.getSelectedDocument()) === null || t === void 0 ? void 0 : t.getAttachments();
  }
  getAttachments() {
    return this.attachments.slice(0);
  }
  refreshAttachments() {
    const t = this.document.getAttachments(), { added: e, removed: i } = function() {
      let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      const o = [], a = [], c = /* @__PURE__ */ new Set();
      n.forEach((d) => {
        c.add(d);
      });
      const h = /* @__PURE__ */ new Set();
      return r.forEach((d) => {
        h.add(d), c.has(d) || o.push(d);
      }), n.forEach((d) => {
        h.has(d) || a.push(d);
      }), { added: o, removed: a };
    }(this.attachments, t);
    return this.attachments = t, Array.from(i).forEach((n) => {
      var r, o;
      n.delegate = null, (r = this.delegate) === null || r === void 0 || (o = r.compositionDidRemoveAttachment) === null || o === void 0 || o.call(r, n);
    }), (() => {
      const n = [];
      return Array.from(e).forEach((r) => {
        var o, a;
        r.delegate = this, n.push((o = this.delegate) === null || o === void 0 || (a = o.compositionDidAddAttachment) === null || a === void 0 ? void 0 : a.call(o, r));
      }), n;
    })();
  }
  attachmentDidChangeAttributes(t) {
    var e, i;
    return this.revision++, (e = this.delegate) === null || e === void 0 || (i = e.compositionDidEditAttachment) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  attachmentDidChangePreviewURL(t) {
    var e, i;
    return this.revision++, (e = this.delegate) === null || e === void 0 || (i = e.compositionDidChangeAttachmentPreviewURL) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  editAttachment(t, e) {
    var i, n;
    if (t !== this.editingAttachment) return this.stopEditingAttachment(), this.editingAttachment = t, (i = this.delegate) === null || i === void 0 || (n = i.compositionDidStartEditingAttachment) === null || n === void 0 ? void 0 : n.call(i, this.editingAttachment, e);
  }
  stopEditingAttachment() {
    var t, e;
    this.editingAttachment && ((t = this.delegate) === null || t === void 0 || (e = t.compositionDidStopEditingAttachment) === null || e === void 0 || e.call(t, this.editingAttachment), this.editingAttachment = null);
  }
  updateAttributesForAttachment(t, e) {
    return this.setDocument(this.document.updateAttributesForAttachment(t, e));
  }
  removeAttributeForAttachment(t, e) {
    return this.setDocument(this.document.removeAttributeForAttachment(t, e));
  }
  breakFormattedBlock(t) {
    let { document: e } = t;
    const { block: i } = t;
    let n = t.startPosition, r = [n - 1, n];
    i.getBlockBreakPosition() === t.startLocation.offset ? (i.breaksOnReturn() && t.nextCharacter === `
` ? n += 1 : e = e.removeTextAtRange(r), r = [n, n]) : t.nextCharacter === `
` ? t.previousCharacter === `
` ? r = [n - 1, n + 1] : (r = [n, n + 1], n += 1) : t.startLocation.offset - 1 != 0 && (n += 1);
    const o = new Q([i.removeLastAttribute().copyWithoutText()]);
    return this.setDocument(e.insertDocumentAtRange(o, r)), this.setSelection(n);
  }
  getPreviousBlock() {
    const t = this.getLocationRange();
    if (t) {
      const { index: e } = t[0];
      if (e > 0) return this.document.getBlockAtIndex(e - 1);
    }
  }
  getBlock() {
    const t = this.getLocationRange();
    if (t) return this.document.getBlockAtIndex(t[0].index);
  }
  getAttachmentAtRange(t) {
    const e = this.document.getDocumentAtRange(t);
    if (e.toString() === "".concat("￼", `
`)) return e.getAttachments()[0];
  }
  notifyDelegateOfCurrentAttributesChange() {
    var t, e;
    return (t = this.delegate) === null || t === void 0 || (e = t.compositionDidChangeCurrentAttributes) === null || e === void 0 ? void 0 : e.call(t, this.currentAttributes);
  }
  notifyDelegateOfInsertionAtRange(t) {
    var e, i;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionDidPerformInsertionAtRange) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  translateUTF16PositionFromOffset(t, e) {
    const i = this.document.toUTF16String(), n = i.offsetFromUCS2Offset(t);
    return i.offsetToUCS2Offset(n + e);
  }
}
vt.proxyMethod("getSelectionManager().getPointRange"), vt.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), vt.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), vt.proxyMethod("getSelectionManager().locationIsCursorTarget"), vt.proxyMethod("getSelectionManager().selectionIsExpanded"), vt.proxyMethod("delegate?.getSelectionManager");
class fn extends M {
  constructor(t) {
    super(...arguments), this.composition = t, this.undoEntries = [], this.redoEntries = [];
  }
  recordUndoEntry(t) {
    let { context: e, consolidatable: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const n = this.undoEntries.slice(-1)[0];
    if (!i || !Ya(n, t, e)) {
      const r = this.createEntry({ description: t, context: e });
      this.undoEntries.push(r), this.redoEntries = [];
    }
  }
  undo() {
    const t = this.undoEntries.pop();
    if (t) {
      const e = this.createEntry(t);
      return this.redoEntries.push(e), this.composition.loadSnapshot(t.snapshot);
    }
  }
  redo() {
    const t = this.redoEntries.pop();
    if (t) {
      const e = this.createEntry(t);
      return this.undoEntries.push(e), this.composition.loadSnapshot(t.snapshot);
    }
  }
  canUndo() {
    return this.undoEntries.length > 0;
  }
  canRedo() {
    return this.redoEntries.length > 0;
  }
  createEntry() {
    let { description: t, context: e } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return { description: t == null ? void 0 : t.toString(), context: JSON.stringify(e), snapshot: this.composition.getSnapshot() };
  }
}
const Ya = (s, t, e) => (s == null ? void 0 : s.description) === (t == null ? void 0 : t.toString()) && (s == null ? void 0 : s.context) === JSON.stringify(e), Hi = "attachmentGallery";
class zr {
  constructor(t) {
    this.document = t.document, this.selectedRange = t.selectedRange;
  }
  perform() {
    return this.removeBlockAttribute(), this.applyBlockAttribute();
  }
  getSnapshot() {
    return { document: this.document, selectedRange: this.selectedRange };
  }
  removeBlockAttribute() {
    return this.findRangesOfBlocks().map((t) => this.document = this.document.removeAttributeAtRange(Hi, t));
  }
  applyBlockAttribute() {
    let t = 0;
    this.findRangesOfPieces().forEach((e) => {
      e[1] - e[0] > 1 && (e[0] += t, e[1] += t, this.document.getCharacterAtPosition(e[1]) !== `
` && (this.document = this.document.insertBlockBreakAtRange(e[1]), e[1] < this.selectedRange[1] && this.moveSelectedRangeForward(), e[1]++, t++), e[0] !== 0 && this.document.getCharacterAtPosition(e[0] - 1) !== `
` && (this.document = this.document.insertBlockBreakAtRange(e[0]), e[0] < this.selectedRange[0] && this.moveSelectedRangeForward(), e[0]++, t++), this.document = this.document.applyBlockAttributeAtRange(Hi, !0, e));
    });
  }
  findRangesOfBlocks() {
    return this.document.findRangesForBlockAttribute(Hi);
  }
  findRangesOfPieces() {
    return this.document.findRangesForTextAttribute("presentation", { withValue: "gallery" });
  }
  moveSelectedRangeForward() {
    this.selectedRange[0] += 1, this.selectedRange[1] += 1;
  }
}
const Kr = function(s) {
  const t = new zr(s);
  return t.perform(), t.getSnapshot();
}, Xa = [Kr];
class Gr {
  constructor(t, e, i) {
    this.insertFiles = this.insertFiles.bind(this), this.composition = t, this.selectionManager = e, this.element = i, this.undoManager = new fn(this.composition), this.filters = Xa.slice(0);
  }
  loadDocument(t) {
    return this.loadSnapshot({ document: t, selectedRange: [0, 0] });
  }
  loadHTML() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    const e = Se.parse(t, { referenceElement: this.element }).getDocument();
    return this.loadDocument(e);
  }
  loadJSON(t) {
    let { document: e, selectedRange: i } = t;
    return e = Q.fromJSON(e), this.loadSnapshot({ document: e, selectedRange: i });
  }
  loadSnapshot(t) {
    return this.undoManager = new fn(this.composition), this.composition.loadSnapshot(t);
  }
  getDocument() {
    return this.composition.document;
  }
  getSelectedDocument() {
    return this.composition.getSelectedDocument();
  }
  getSnapshot() {
    return this.composition.getSnapshot();
  }
  toJSON() {
    return this.getSnapshot();
  }
  deleteInDirection(t) {
    return this.composition.deleteInDirection(t);
  }
  insertAttachment(t) {
    return this.composition.insertAttachment(t);
  }
  insertAttachments(t) {
    return this.composition.insertAttachments(t);
  }
  insertDocument(t) {
    return this.composition.insertDocument(t);
  }
  insertFile(t) {
    return this.composition.insertFile(t);
  }
  insertFiles(t) {
    return this.composition.insertFiles(t);
  }
  insertHTML(t) {
    return this.composition.insertHTML(t);
  }
  insertString(t) {
    return this.composition.insertString(t);
  }
  insertText(t) {
    return this.composition.insertText(t);
  }
  insertLineBreak() {
    return this.composition.insertLineBreak();
  }
  getSelectedRange() {
    return this.composition.getSelectedRange();
  }
  getPosition() {
    return this.composition.getPosition();
  }
  getClientRectAtPosition(t) {
    const e = this.getDocument().locationRangeFromRange([t, t + 1]);
    return this.selectionManager.getClientRectAtLocationRange(e);
  }
  expandSelectionInDirection(t) {
    return this.composition.expandSelectionInDirection(t);
  }
  moveCursorInDirection(t) {
    return this.composition.moveCursorInDirection(t);
  }
  setSelectedRange(t) {
    return this.composition.setSelectedRange(t);
  }
  activateAttribute(t) {
    let e = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
    return this.composition.setCurrentAttribute(t, e);
  }
  attributeIsActive(t) {
    return this.composition.hasCurrentAttribute(t);
  }
  canActivateAttribute(t) {
    return this.composition.canSetCurrentAttribute(t);
  }
  deactivateAttribute(t) {
    return this.composition.removeCurrentAttribute(t);
  }
  setHTMLAtributeAtPosition(t, e, i) {
    this.composition.setHTMLAtributeAtPosition(t, e, i);
  }
  canDecreaseNestingLevel() {
    return this.composition.canDecreaseNestingLevel();
  }
  canIncreaseNestingLevel() {
    return this.composition.canIncreaseNestingLevel();
  }
  decreaseNestingLevel() {
    if (this.canDecreaseNestingLevel()) return this.composition.decreaseNestingLevel();
  }
  increaseNestingLevel() {
    if (this.canIncreaseNestingLevel()) return this.composition.increaseNestingLevel();
  }
  canRedo() {
    return this.undoManager.canRedo();
  }
  canUndo() {
    return this.undoManager.canUndo();
  }
  recordUndoEntry(t) {
    let { context: e, consolidatable: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return this.undoManager.recordUndoEntry(t, { context: e, consolidatable: i });
  }
  redo() {
    if (this.canRedo()) return this.undoManager.redo();
  }
  undo() {
    if (this.canUndo()) return this.undoManager.undo();
  }
}
class Jr {
  constructor(t) {
    this.element = t;
  }
  findLocationFromContainerAndOffset(t, e) {
    let { strict: i } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { strict: !0 }, n = 0, r = !1;
    const o = { index: 0, offset: 0 }, a = this.findAttachmentElementParentForNode(t);
    a && (t = a.parentNode, e = xi(a));
    const c = Je(this.element, { usingFilter: Yr });
    for (; c.nextNode(); ) {
      const h = c.currentNode;
      if (h === t && pe(t)) {
        Kt(h) || (o.offset += e);
        break;
      }
      if (h.parentNode === t) {
        if (n++ === e) break;
      } else if (!Tt(t, h) && n > 0) break;
      os(h, { strict: i }) ? (r && o.index++, o.offset = 0, r = !0) : o.offset += $i(h);
    }
    return o;
  }
  findContainerAndOffsetFromLocation(t) {
    let e, i;
    if (t.index === 0 && t.offset === 0) {
      for (e = this.element, i = 0; e.firstChild; ) if (e = e.firstChild, Ci(e)) {
        i = 1;
        break;
      }
      return [e, i];
    }
    let [n, r] = this.findNodeAndOffsetFromLocation(t);
    if (n) {
      if (pe(n)) $i(n) === 0 ? (e = n.parentNode.parentNode, i = xi(n.parentNode), Kt(n, { name: "right" }) && i++) : (e = n, i = t.offset - r);
      else {
        if (e = n.parentNode, !os(n.previousSibling) && !Ci(e)) for (; n === e.lastChild && (n = e, e = e.parentNode, !Ci(e)); ) ;
        i = xi(n), t.offset !== 0 && i++;
      }
      return [e, i];
    }
  }
  findNodeAndOffsetFromLocation(t) {
    let e, i, n = 0;
    for (const r of this.getSignificantNodesForIndex(t.index)) {
      const o = $i(r);
      if (t.offset <= n + o) if (pe(r)) {
        if (e = r, i = n, t.offset === i && Kt(e)) break;
      } else e || (e = r, i = n);
      if (n += o, n > t.offset) break;
    }
    return [e, i];
  }
  findAttachmentElementParentForNode(t) {
    for (; t && t !== this.element; ) {
      if (It(t)) return t;
      t = t.parentNode;
    }
  }
  getSignificantNodesForIndex(t) {
    const e = [], i = Je(this.element, { usingFilter: Qa });
    let n = !1;
    for (; i.nextNode(); ) {
      const o = i.currentNode;
      var r;
      if (zt(o)) {
        if (r != null ? r++ : r = 0, r === t) n = !0;
        else if (n) break;
      } else n && e.push(o);
    }
    return e;
  }
}
const $i = function(s) {
  return s.nodeType === Node.TEXT_NODE ? Kt(s) ? 0 : s.textContent.length : K(s) === "br" || It(s) ? 1 : 0;
}, Qa = function(s) {
  return Za(s) === NodeFilter.FILTER_ACCEPT ? Yr(s) : NodeFilter.FILTER_REJECT;
}, Za = function(s) {
  return Er(s) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, Yr = function(s) {
  return It(s.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
};
class Xr {
  createDOMRangeFromPoint(t) {
    let e, { x: i, y: n } = t;
    if (document.caretPositionFromPoint) {
      const { offsetNode: r, offset: o } = document.caretPositionFromPoint(i, n);
      return e = document.createRange(), e.setStart(r, o), e;
    }
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(i, n);
    if (document.body.createTextRange) {
      const r = fe();
      try {
        const o = document.body.createTextRange();
        o.moveToPoint(i, n), o.select();
      } catch {
      }
      return e = fe(), Ir(r), e;
    }
  }
  getClientRectsForDOMRange(t) {
    const e = Array.from(t.getClientRects());
    return [e[0], e[e.length - 1]];
  }
}
class Lt extends M {
  constructor(t) {
    super(...arguments), this.didMouseDown = this.didMouseDown.bind(this), this.selectionDidChange = this.selectionDidChange.bind(this), this.element = t, this.locationMapper = new Jr(this.element), this.pointMapper = new Xr(), this.lockCount = 0, k("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
  }
  getLocationRange() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return t.strict === !1 ? this.createLocationRangeFromDOMRange(fe()) : t.ignoreLock ? this.currentLocationRange : this.lockedLocationRange ? this.lockedLocationRange : this.currentLocationRange;
  }
  setLocationRange(t) {
    if (this.lockedLocationRange) return;
    t = x(t);
    const e = this.createDOMRangeFromLocationRange(t);
    e && (Ir(e), this.updateCurrentLocationRange(t));
  }
  setLocationRangeFromPointRange(t) {
    t = x(t);
    const e = this.getLocationAtPoint(t[0]), i = this.getLocationAtPoint(t[1]);
    this.setLocationRange([e, i]);
  }
  getClientRectAtLocationRange(t) {
    const e = this.createDOMRangeFromLocationRange(t);
    if (e) return this.getClientRectsForDOMRange(e)[1];
  }
  locationIsCursorTarget(t) {
    const e = Array.from(this.findNodeAndOffsetFromLocation(t))[0];
    return Kt(e);
  }
  lock() {
    this.lockCount++ == 0 && (this.updateCurrentLocationRange(), this.lockedLocationRange = this.getLocationRange());
  }
  unlock() {
    if (--this.lockCount == 0) {
      const { lockedLocationRange: t } = this;
      if (this.lockedLocationRange = null, t != null) return this.setLocationRange(t);
    }
  }
  clearSelection() {
    var t;
    return (t = kr()) === null || t === void 0 ? void 0 : t.removeAllRanges();
  }
  selectionIsCollapsed() {
    var t;
    return ((t = fe()) === null || t === void 0 ? void 0 : t.collapsed) === !0;
  }
  selectionIsExpanded() {
    return !this.selectionIsCollapsed();
  }
  createLocationRangeFromDOMRange(t, e) {
    if (t == null || !this.domRangeWithinElement(t)) return;
    const i = this.findLocationFromContainerAndOffset(t.startContainer, t.startOffset, e);
    if (!i) return;
    const n = t.collapsed ? void 0 : this.findLocationFromContainerAndOffset(t.endContainer, t.endOffset, e);
    return x([i, n]);
  }
  didMouseDown() {
    return this.pauseTemporarily();
  }
  pauseTemporarily() {
    let t;
    this.paused = !0;
    const e = () => {
      if (this.paused = !1, clearTimeout(i), Array.from(t).forEach((n) => {
        n.destroy();
      }), Tt(document, this.element)) return this.selectionDidChange();
    }, i = setTimeout(e, 200);
    t = ["mousemove", "keydown"].map((n) => k(n, { onElement: document, withCallback: e }));
  }
  selectionDidChange() {
    if (!this.paused && !Sn(this.element)) return this.updateCurrentLocationRange();
  }
  updateCurrentLocationRange(t) {
    var e, i;
    if ((t ?? (t = this.createLocationRangeFromDOMRange(fe()))) && !Ye(t, this.currentLocationRange)) return this.currentLocationRange = t, (e = this.delegate) === null || e === void 0 || (i = e.locationRangeDidChange) === null || i === void 0 ? void 0 : i.call(e, this.currentLocationRange.slice(0));
  }
  createDOMRangeFromLocationRange(t) {
    const e = this.findContainerAndOffsetFromLocation(t[0]), i = gt(t) ? e : this.findContainerAndOffsetFromLocation(t[1]) || e;
    if (e != null && i != null) {
      const n = document.createRange();
      return n.setStart(...Array.from(e || [])), n.setEnd(...Array.from(i || [])), n;
    }
  }
  getLocationAtPoint(t) {
    const e = this.createDOMRangeFromPoint(t);
    var i;
    if (e) return (i = this.createLocationRangeFromDOMRange(e)) === null || i === void 0 ? void 0 : i[0];
  }
  domRangeWithinElement(t) {
    return t.collapsed ? Tt(this.element, t.startContainer) : Tt(this.element, t.startContainer) && Tt(this.element, t.endContainer);
  }
}
Lt.proxyMethod("locationMapper.findLocationFromContainerAndOffset"), Lt.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"), Lt.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"), Lt.proxyMethod("pointMapper.createDOMRangeFromPoint"), Lt.proxyMethod("pointMapper.getClientRectsForDOMRange");
var Qr = Object.freeze({ __proto__: null, Attachment: Xt, AttachmentManager: Vr, AttachmentPiece: Jt, Block: lt, Composition: vt, Document: Q, Editor: Gr, HTMLParser: Se, HTMLSanitizer: ni, LineBreakInsertion: Wr, LocationMapper: Jr, ManagedAttachment: w, Piece: Pt, PointMapper: Xr, SelectionManager: Lt, SplittableList: Qe, StringPiece: Rn, Text: ot, UndoManager: fn }), tl = Object.freeze({ __proto__: null, ObjectView: Nt, AttachmentView: In, BlockView: Fr, DocumentView: si, PieceView: Nr, PreviewableAttachmentView: Br, TextView: Pr });
const { lang: Ui, css: Ct, keyNames: el } = Le, ji = function(s) {
  return function() {
    const t = s.apply(this, arguments);
    t.do(), this.undos || (this.undos = []), this.undos.push(t.undo);
  };
};
class Zr extends M {
  constructor(t, e, i) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(...arguments), V(this, "makeElementMutable", ji(() => ({ do: () => {
      this.element.dataset.trixMutable = !0;
    }, undo: () => delete this.element.dataset.trixMutable }))), V(this, "addToolbar", ji(() => {
      const r = _({ tagName: "div", className: Ct.attachmentToolbar, data: { trixMutable: !0 }, childNodes: _({ tagName: "div", className: "trix-button-row", childNodes: _({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: _({ tagName: "button", className: "trix-button trix-button--remove", textContent: Ui.remove, attributes: { title: Ui.remove }, data: { trixAction: "remove" } }) }) }) });
      return this.attachment.isPreviewable() && r.appendChild(_({ tagName: "div", className: Ct.attachmentMetadataContainer, childNodes: _({ tagName: "span", className: Ct.attachmentMetadata, childNodes: [_({ tagName: "span", className: Ct.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), _({ tagName: "span", className: Ct.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), k("click", { onElement: r, withCallback: this.didClickToolbar }), k("click", { onElement: r, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), me("trix-attachment-before-toolbar", { onElement: this.element, attributes: { toolbar: r, attachment: this.attachment } }), { do: () => this.element.appendChild(r), undo: () => yt(r) };
    })), V(this, "installCaptionEditor", ji(() => {
      const r = _({ tagName: "textarea", className: Ct.attachmentCaptionEditor, attributes: { placeholder: Ui.captionPlaceholder }, data: { trixMutable: !0 } });
      r.value = this.attachmentPiece.getCaption();
      const o = r.cloneNode();
      o.classList.add("trix-autoresize-clone"), o.tabIndex = -1;
      const a = function() {
        o.value = r.value, r.style.height = o.scrollHeight + "px";
      };
      k("input", { onElement: r, withCallback: a }), k("input", { onElement: r, withCallback: this.didInputCaption }), k("keydown", { onElement: r, withCallback: this.didKeyDownCaption }), k("change", { onElement: r, withCallback: this.didChangeCaption }), k("blur", { onElement: r, withCallback: this.didBlurCaption });
      const c = this.element.querySelector("figcaption"), h = c.cloneNode();
      return { do: () => {
        if (c.style.display = "none", h.appendChild(r), h.appendChild(o), h.classList.add("".concat(Ct.attachmentCaption, "--editing")), c.parentElement.insertBefore(h, c), a(), this.options.editCaption) return Ln(() => r.focus());
      }, undo() {
        yt(h), c.style.display = null;
      } };
    })), this.didClickToolbar = this.didClickToolbar.bind(this), this.didClickActionButton = this.didClickActionButton.bind(this), this.didKeyDownCaption = this.didKeyDownCaption.bind(this), this.didInputCaption = this.didInputCaption.bind(this), this.didChangeCaption = this.didChangeCaption.bind(this), this.didBlurCaption = this.didBlurCaption.bind(this), this.attachmentPiece = t, this.element = e, this.container = i, this.options = n, this.attachment = this.attachmentPiece.attachment, K(this.element) === "a" && (this.element = this.element.firstChild), this.install();
  }
  install() {
    this.makeElementMutable(), this.addToolbar(), this.attachment.isPreviewable() && this.installCaptionEditor();
  }
  uninstall() {
    var t;
    let e = this.undos.pop();
    for (this.savePendingCaption(); e; ) e(), e = this.undos.pop();
    (t = this.delegate) === null || t === void 0 || t.didUninstallAttachmentEditor(this);
  }
  savePendingCaption() {
    if (this.pendingCaption != null) {
      const r = this.pendingCaption;
      var t, e, i, n;
      this.pendingCaption = null, r ? (t = this.delegate) === null || t === void 0 || (e = t.attachmentEditorDidRequestUpdatingAttributesForAttachment) === null || e === void 0 || e.call(t, { caption: r }, this.attachment) : (i = this.delegate) === null || i === void 0 || (n = i.attachmentEditorDidRequestRemovingAttributeForAttachment) === null || n === void 0 || n.call(i, "caption", this.attachment);
    }
  }
  didClickToolbar(t) {
    return t.preventDefault(), t.stopPropagation();
  }
  didClickActionButton(t) {
    var e;
    if (t.target.getAttribute("data-trix-action") === "remove") return (e = this.delegate) === null || e === void 0 ? void 0 : e.attachmentEditorDidRequestRemovalOfAttachment(this.attachment);
  }
  didKeyDownCaption(t) {
    var e, i;
    if (el[t.keyCode] === "return") return t.preventDefault(), this.savePendingCaption(), (e = this.delegate) === null || e === void 0 || (i = e.attachmentEditorDidRequestDeselectingAttachment) === null || i === void 0 ? void 0 : i.call(e, this.attachment);
  }
  didInputCaption(t) {
    this.pendingCaption = t.target.value.replace(/\s/g, " ").trim();
  }
  didChangeCaption(t) {
    return this.savePendingCaption();
  }
  didBlurCaption(t) {
    return this.savePendingCaption();
  }
}
class to extends M {
  constructor(t, e) {
    super(...arguments), this.didFocus = this.didFocus.bind(this), this.didBlur = this.didBlur.bind(this), this.didClickAttachment = this.didClickAttachment.bind(this), this.element = t, this.composition = e, this.documentView = new si(this.composition.document, { element: this.element }), k("focus", { onElement: this.element, withCallback: this.didFocus }), k("blur", { onElement: this.element, withCallback: this.didBlur }), k("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: !0 }), k("mousedown", { onElement: this.element, matchingSelector: kt, withCallback: this.didClickAttachment }), k("click", { onElement: this.element, matchingSelector: "a".concat(kt), preventDefault: !0 });
  }
  didFocus(t) {
    var e;
    const i = () => {
      var n, r;
      if (!this.focused) return this.focused = !0, (n = this.delegate) === null || n === void 0 || (r = n.compositionControllerDidFocus) === null || r === void 0 ? void 0 : r.call(n);
    };
    return ((e = this.blurPromise) === null || e === void 0 ? void 0 : e.then(i)) || i();
  }
  didBlur(t) {
    this.blurPromise = new Promise((e) => Ln(() => {
      var i, n;
      return Sn(this.element) || (this.focused = null, (i = this.delegate) === null || i === void 0 || (n = i.compositionControllerDidBlur) === null || n === void 0 || n.call(i)), this.blurPromise = null, e();
    }));
  }
  didClickAttachment(t, e) {
    var i, n;
    const r = this.findAttachmentForElement(e), o = !!At(t.target, { matchingSelector: "figcaption" });
    return (i = this.delegate) === null || i === void 0 || (n = i.compositionControllerDidSelectAttachment) === null || n === void 0 ? void 0 : n.call(i, r, { editCaption: o });
  }
  getSerializableElement() {
    return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
  }
  render() {
    var t, e, i, n, r, o;
    return this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced() && ((i = this.delegate) === null || i === void 0 || (n = i.compositionControllerWillSyncDocumentView) === null || n === void 0 || n.call(i), this.documentView.sync(), (r = this.delegate) === null || r === void 0 || (o = r.compositionControllerDidSyncDocumentView) === null || o === void 0 || o.call(r)), (t = this.delegate) === null || t === void 0 || (e = t.compositionControllerDidRender) === null || e === void 0 ? void 0 : e.call(t);
  }
  rerenderViewForObject(t) {
    return this.invalidateViewForObject(t), this.render();
  }
  invalidateViewForObject(t) {
    return this.documentView.invalidateViewForObject(t);
  }
  isViewCachingEnabled() {
    return this.documentView.isViewCachingEnabled();
  }
  enableViewCaching() {
    return this.documentView.enableViewCaching();
  }
  disableViewCaching() {
    return this.documentView.disableViewCaching();
  }
  refreshViewCache() {
    return this.documentView.garbageCollectCachedViews();
  }
  isEditingAttachment() {
    return !!this.attachmentEditor;
  }
  installAttachmentEditorForAttachment(t, e) {
    var i;
    if (((i = this.attachmentEditor) === null || i === void 0 ? void 0 : i.attachment) === t) return;
    const n = this.documentView.findElementForObject(t);
    if (!n) return;
    this.uninstallAttachmentEditor();
    const r = this.composition.document.getAttachmentPieceForAttachment(t);
    this.attachmentEditor = new Zr(r, n, this.element, e), this.attachmentEditor.delegate = this;
  }
  uninstallAttachmentEditor() {
    var t;
    return (t = this.attachmentEditor) === null || t === void 0 ? void 0 : t.uninstall();
  }
  didUninstallAttachmentEditor() {
    return this.attachmentEditor = null, this.render();
  }
  attachmentEditorDidRequestUpdatingAttributesForAttachment(t, e) {
    var i, n;
    return (i = this.delegate) === null || i === void 0 || (n = i.compositionControllerWillUpdateAttachment) === null || n === void 0 || n.call(i, e), this.composition.updateAttributesForAttachment(t, e);
  }
  attachmentEditorDidRequestRemovingAttributeForAttachment(t, e) {
    var i, n;
    return (i = this.delegate) === null || i === void 0 || (n = i.compositionControllerWillUpdateAttachment) === null || n === void 0 || n.call(i, e), this.composition.removeAttributeForAttachment(t, e);
  }
  attachmentEditorDidRequestRemovalOfAttachment(t) {
    var e, i;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionControllerDidRequestRemovalOfAttachment) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  attachmentEditorDidRequestDeselectingAttachment(t) {
    var e, i;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionControllerDidRequestDeselectingAttachment) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  canSyncDocumentView() {
    return !this.isEditingAttachment();
  }
  findAttachmentForElement(t) {
    return this.composition.document.getAttachmentById(parseInt(t.dataset.trixId, 10));
  }
}
class eo extends M {
}
const io = "data-trix-mutable", il = "[".concat(io, "]"), nl = { attributes: !0, childList: !0, characterData: !0, characterDataOldValue: !0, subtree: !0 };
class no extends M {
  constructor(t) {
    super(t), this.didMutate = this.didMutate.bind(this), this.element = t, this.observer = new window.MutationObserver(this.didMutate), this.start();
  }
  start() {
    return this.reset(), this.observer.observe(this.element, nl);
  }
  stop() {
    return this.observer.disconnect();
  }
  didMutate(t) {
    var e, i;
    if (this.mutations.push(...Array.from(this.findSignificantMutations(t) || [])), this.mutations.length) return (e = this.delegate) === null || e === void 0 || (i = e.elementDidMutate) === null || i === void 0 || i.call(e, this.getMutationSummary()), this.reset();
  }
  reset() {
    this.mutations = [];
  }
  findSignificantMutations(t) {
    return t.filter((e) => this.mutationIsSignificant(e));
  }
  mutationIsSignificant(t) {
    if (this.nodeIsMutable(t.target)) return !1;
    for (const e of Array.from(this.nodesModifiedByMutation(t))) if (this.nodeIsSignificant(e)) return !0;
    return !1;
  }
  nodeIsSignificant(t) {
    return t !== this.element && !this.nodeIsMutable(t) && !Er(t);
  }
  nodeIsMutable(t) {
    return At(t, { matchingSelector: il });
  }
  nodesModifiedByMutation(t) {
    const e = [];
    switch (t.type) {
      case "attributes":
        t.attributeName !== io && e.push(t.target);
        break;
      case "characterData":
        e.push(t.target.parentNode), e.push(t.target);
        break;
      case "childList":
        e.push(...Array.from(t.addedNodes || [])), e.push(...Array.from(t.removedNodes || []));
    }
    return e;
  }
  getMutationSummary() {
    return this.getTextMutationSummary();
  }
  getTextMutationSummary() {
    const { additions: t, deletions: e } = this.getTextChangesFromCharacterData(), i = this.getTextChangesFromChildList();
    Array.from(i.additions).forEach((a) => {
      Array.from(t).includes(a) || t.push(a);
    }), e.push(...Array.from(i.deletions || []));
    const n = {}, r = t.join("");
    r && (n.textAdded = r);
    const o = e.join("");
    return o && (n.textDeleted = o), n;
  }
  getMutationsByType(t) {
    return Array.from(this.mutations).filter((e) => e.type === t);
  }
  getTextChangesFromChildList() {
    let t, e;
    const i = [], n = [];
    Array.from(this.getMutationsByType("childList")).forEach((a) => {
      i.push(...Array.from(a.addedNodes || [])), n.push(...Array.from(a.removedNodes || []));
    }), i.length === 0 && n.length === 1 && zt(n[0]) ? (t = [], e = [`
`]) : (t = bn(i), e = bn(n));
    const r = t.filter((a, c) => a !== e[c]).map(ue), o = e.filter((a, c) => a !== t[c]).map(ue);
    return { additions: r, deletions: o };
  }
  getTextChangesFromCharacterData() {
    let t, e;
    const i = this.getMutationsByType("characterData");
    if (i.length) {
      const n = i[0], r = i[i.length - 1], o = function(a, c) {
        let h, d;
        return a = ye.box(a), (c = ye.box(c)).length < a.length ? [d, h] = us(a, c) : [h, d] = us(c, a), { added: h, removed: d };
      }(ue(n.oldValue), ue(r.target.data));
      t = o.added, e = o.removed;
    }
    return { additions: t ? [t] : [], deletions: e ? [e] : [] };
  }
}
const bn = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const t = [];
  for (const e of Array.from(s)) switch (e.nodeType) {
    case Node.TEXT_NODE:
      t.push(e.data);
      break;
    case Node.ELEMENT_NODE:
      K(e) === "br" ? t.push(`
`) : t.push(...Array.from(bn(e.childNodes) || []));
  }
  return t;
};
class so extends Xe {
  constructor(t) {
    super(...arguments), this.file = t;
  }
  perform(t) {
    const e = new FileReader();
    return e.onerror = () => t(!1), e.onload = () => {
      e.onerror = null;
      try {
        e.abort();
      } catch {
      }
      return t(!0, this.file);
    }, e.readAsArrayBuffer(this.file);
  }
}
class sl {
  constructor(t) {
    this.element = t;
  }
  shouldIgnore(t) {
    return !!Ce.samsungAndroid && (this.previousEvent = this.event, this.event = t, this.checkSamsungKeyboardBuggyModeStart(), this.checkSamsungKeyboardBuggyModeEnd(), this.buggyMode);
  }
  checkSamsungKeyboardBuggyModeStart() {
    this.insertingLongTextAfterUnidentifiedChar() && rl(this.element.innerText, this.event.data) && (this.buggyMode = !0, this.event.preventDefault());
  }
  checkSamsungKeyboardBuggyModeEnd() {
    this.buggyMode && this.event.inputType !== "insertText" && (this.buggyMode = !1);
  }
  insertingLongTextAfterUnidentifiedChar() {
    var t;
    return this.isBeforeInputInsertText() && this.previousEventWasUnidentifiedKeydown() && ((t = this.event.data) === null || t === void 0 ? void 0 : t.length) > 50;
  }
  isBeforeInputInsertText() {
    return this.event.type === "beforeinput" && this.event.inputType === "insertText";
  }
  previousEventWasUnidentifiedKeydown() {
    var t, e;
    return ((t = this.previousEvent) === null || t === void 0 ? void 0 : t.type) === "keydown" && ((e = this.previousEvent) === null || e === void 0 ? void 0 : e.key) === "Unidentified";
  }
}
const rl = (s, t) => Os(s) === Os(t), ol = new RegExp("(".concat("￼", "|").concat(ii, "|").concat(_t, "|\\s)+"), "g"), Os = (s) => s.replace(ol, " ").trim();
class ri extends M {
  constructor(t) {
    super(...arguments), this.element = t, this.mutationObserver = new no(this.element), this.mutationObserver.delegate = this, this.flakyKeyboardDetector = new sl(this.element);
    for (const e in this.constructor.events) k(e, { onElement: this.element, withCallback: this.handlerFor(e) });
  }
  elementDidMutate(t) {
  }
  editorWillSyncDocumentView() {
    return this.mutationObserver.stop();
  }
  editorDidSyncDocumentView() {
    return this.mutationObserver.start();
  }
  requestRender() {
    var t, e;
    return (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidRequestRender) === null || e === void 0 ? void 0 : e.call(t);
  }
  requestReparse() {
    var t, e;
    return (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidRequestReparse) === null || e === void 0 || e.call(t), this.requestRender();
  }
  attachFiles(t) {
    const e = Array.from(t).map((i) => new so(i));
    return Promise.all(e).then((i) => {
      this.handleInput(function() {
        var n, r;
        return (n = this.delegate) === null || n === void 0 || n.inputControllerWillAttachFiles(), (r = this.responder) === null || r === void 0 || r.insertFiles(i), this.requestRender();
      });
    });
  }
  handlerFor(t) {
    return (e) => {
      e.defaultPrevented || this.handleInput(() => {
        if (!Sn(this.element)) {
          if (this.flakyKeyboardDetector.shouldIgnore(e)) return;
          this.eventName = t, this.constructor.events[t].call(this, e);
        }
      });
    };
  }
  handleInput(t) {
    try {
      var e;
      (e = this.delegate) === null || e === void 0 || e.inputControllerWillHandleInput(), t.call(this);
    } finally {
      var i;
      (i = this.delegate) === null || i === void 0 || i.inputControllerDidHandleInput();
    }
  }
  createLinkHTML(t, e) {
    const i = document.createElement("a");
    return i.href = t, i.textContent = e || t, i.outerHTML;
  }
}
var Vi;
V(ri, "events", {});
const { browser: al, keyNames: ro } = Le;
let ll = 0;
class mt extends ri {
  constructor() {
    super(...arguments), this.resetInputSummary();
  }
  setInputSummary() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.inputSummary.eventName = this.eventName;
    for (const e in t) {
      const i = t[e];
      this.inputSummary[e] = i;
    }
    return this.inputSummary;
  }
  resetInputSummary() {
    this.inputSummary = {};
  }
  reset() {
    return this.resetInputSummary(), Mt.reset();
  }
  elementDidMutate(t) {
    var e, i;
    return this.isComposing() ? (e = this.delegate) === null || e === void 0 || (i = e.inputControllerDidAllowUnhandledInput) === null || i === void 0 ? void 0 : i.call(e) : this.handleInput(function() {
      return this.mutationIsSignificant(t) && (this.mutationIsExpected(t) ? this.requestRender() : this.requestReparse()), this.reset();
    });
  }
  mutationIsExpected(t) {
    let { textAdded: e, textDeleted: i } = t;
    if (this.inputSummary.preferDocument) return !0;
    const n = e != null ? e === this.inputSummary.textAdded : !this.inputSummary.textAdded, r = i != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete, o = [`
`, ` 
`].includes(e) && !n, a = i === `
` && !r;
    if (o && !a || a && !o) {
      const h = this.getSelectedRange();
      if (h) {
        var c;
        const d = o ? e.replace(/\n$/, "").length || -1 : (e == null ? void 0 : e.length) || 1;
        if ((c = this.responder) !== null && c !== void 0 && c.positionIsBlockBreak(h[1] + d)) return !0;
      }
    }
    return n && r;
  }
  mutationIsSignificant(t) {
    var e;
    const i = Object.keys(t).length > 0, n = ((e = this.compositionInput) === null || e === void 0 ? void 0 : e.getEndData()) === "";
    return i || !n;
  }
  getCompositionInput() {
    if (this.isComposing()) return this.compositionInput;
    this.compositionInput = new bt(this);
  }
  isComposing() {
    return this.compositionInput && !this.compositionInput.isEnded();
  }
  deleteInDirection(t, e) {
    var i;
    return ((i = this.responder) === null || i === void 0 ? void 0 : i.deleteInDirection(t)) !== !1 ? this.setInputSummary({ didDelete: !0 }) : e ? (e.preventDefault(), this.requestRender()) : void 0;
  }
  serializeSelectionToDataTransfer(t) {
    var e;
    if (!function(n) {
      if (n == null || !n.setData) return !1;
      for (const r in cs) {
        const o = cs[r];
        try {
          if (n.setData(r, o), !n.getData(r) === o) return !1;
        } catch {
          return !1;
        }
      }
      return !0;
    }(t)) return;
    const i = (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedDocument().toSerializableDocument();
    return t.setData("application/x-trix-document", JSON.stringify(i)), t.setData("text/html", si.render(i).innerHTML), t.setData("text/plain", i.toString().replace(/\n$/, "")), !0;
  }
  canAcceptDataTransfer(t) {
    const e = {};
    return Array.from((t == null ? void 0 : t.types) || []).forEach((i) => {
      e[i] = !0;
    }), e.Files || e["application/x-trix-document"] || e["text/html"] || e["text/plain"];
  }
  getPastedHTMLUsingHiddenElement(t) {
    const e = this.getSelectedRange(), i = { position: "absolute", left: "".concat(window.pageXOffset, "px"), top: "".concat(window.pageYOffset, "px"), opacity: 0 }, n = _({ style: i, tagName: "div", editable: !0 });
    return document.body.appendChild(n), n.focus(), requestAnimationFrame(() => {
      const r = n.innerHTML;
      return yt(n), this.setSelectedRange(e), t(r);
    });
  }
}
V(mt, "events", { keydown(s) {
  this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = !0;
  const t = ro[s.keyCode];
  if (t) {
    var e;
    let n = this.keys;
    ["ctrl", "alt", "shift", "meta"].forEach((r) => {
      var o;
      s["".concat(r, "Key")] && (r === "ctrl" && (r = "control"), n = (o = n) === null || o === void 0 ? void 0 : o[r]);
    }), ((e = n) === null || e === void 0 ? void 0 : e[t]) != null && (this.setInputSummary({ keyName: t }), Mt.reset(), n[t].call(this, s));
  }
  if (Lr(s)) {
    const n = String.fromCharCode(s.keyCode).toLowerCase();
    if (n) {
      var i;
      const r = ["alt", "shift"].map((o) => {
        if (s["".concat(o, "Key")]) return o;
      }).filter((o) => o);
      r.push(n), (i = this.delegate) !== null && i !== void 0 && i.inputControllerDidReceiveKeyboardCommand(r) && s.preventDefault();
    }
  }
}, keypress(s) {
  if (this.inputSummary.eventName != null || s.metaKey || s.ctrlKey && !s.altKey) return;
  const t = dl(s);
  var e, i;
  return t ? ((e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformTyping(), (i = this.responder) === null || i === void 0 || i.insertString(t), this.setInputSummary({ textAdded: t, didDelete: this.selectionIsExpanded() })) : void 0;
}, textInput(s) {
  const { data: t } = s, { textAdded: e } = this.inputSummary;
  if (e && e !== t && e.toUpperCase() === t) {
    var i;
    const n = this.getSelectedRange();
    return this.setSelectedRange([n[0], n[1] + e.length]), (i = this.responder) === null || i === void 0 || i.insertString(t), this.setInputSummary({ textAdded: t }), this.setSelectedRange(n);
  }
}, dragenter(s) {
  s.preventDefault();
}, dragstart(s) {
  var t, e;
  return this.serializeSelectionToDataTransfer(s.dataTransfer), this.draggedRange = this.getSelectedRange(), (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidStartDrag) === null || e === void 0 ? void 0 : e.call(t);
}, dragover(s) {
  if (this.draggedRange || this.canAcceptDataTransfer(s.dataTransfer)) {
    s.preventDefault();
    const i = { x: s.clientX, y: s.clientY };
    var t, e;
    if (!Yt(i, this.draggingPoint)) return this.draggingPoint = i, (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidReceiveDragOverPoint) === null || e === void 0 ? void 0 : e.call(t, this.draggingPoint);
  }
}, dragend(s) {
  var t, e;
  (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidCancelDrag) === null || e === void 0 || e.call(t), this.draggedRange = null, this.draggingPoint = null;
}, drop(s) {
  var t, e;
  s.preventDefault();
  const i = (t = s.dataTransfer) === null || t === void 0 ? void 0 : t.files, n = s.dataTransfer.getData("application/x-trix-document"), r = { x: s.clientX, y: s.clientY };
  if ((e = this.responder) === null || e === void 0 || e.setLocationRangeFromPointRange(r), i != null && i.length) this.attachFiles(i);
  else if (this.draggedRange) {
    var o, a;
    (o = this.delegate) === null || o === void 0 || o.inputControllerWillMoveText(), (a = this.responder) === null || a === void 0 || a.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender();
  } else if (n) {
    var c;
    const h = Q.fromJSONString(n);
    (c = this.responder) === null || c === void 0 || c.insertDocument(h), this.requestRender();
  }
  this.draggedRange = null, this.draggingPoint = null;
}, cut(s) {
  var t, e;
  if ((t = this.responder) !== null && t !== void 0 && t.selectionIsExpanded() && (this.serializeSelectionToDataTransfer(s.clipboardData) && s.preventDefault(), (e = this.delegate) === null || e === void 0 || e.inputControllerWillCutText(), this.deleteInDirection("backward"), s.defaultPrevented)) return this.requestRender();
}, copy(s) {
  var t;
  (t = this.responder) !== null && t !== void 0 && t.selectionIsExpanded() && this.serializeSelectionToDataTransfer(s.clipboardData) && s.preventDefault();
}, paste(s) {
  const t = s.clipboardData || s.testClipboardData, e = { clipboard: t };
  if (!t || ul(s)) return void this.getPastedHTMLUsingHiddenElement((O) => {
    var T, tt, ct;
    return e.type = "text/html", e.html = O, (T = this.delegate) === null || T === void 0 || T.inputControllerWillPaste(e), (tt = this.responder) === null || tt === void 0 || tt.insertHTML(e.html), this.requestRender(), (ct = this.delegate) === null || ct === void 0 ? void 0 : ct.inputControllerDidPaste(e);
  });
  const i = t.getData("URL"), n = t.getData("text/html"), r = t.getData("public.url-name");
  if (i) {
    var o, a, c;
    let O;
    e.type = "text/html", O = r ? wn(r).trim() : i, e.html = this.createLinkHTML(i, O), (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(e), this.setInputSummary({ textAdded: O, didDelete: this.selectionIsExpanded() }), (a = this.responder) === null || a === void 0 || a.insertHTML(e.html), this.requestRender(), (c = this.delegate) === null || c === void 0 || c.inputControllerDidPaste(e);
  } else if (Cr(t)) {
    var h, d, m;
    e.type = "text/plain", e.string = t.getData("text/plain"), (h = this.delegate) === null || h === void 0 || h.inputControllerWillPaste(e), this.setInputSummary({ textAdded: e.string, didDelete: this.selectionIsExpanded() }), (d = this.responder) === null || d === void 0 || d.insertString(e.string), this.requestRender(), (m = this.delegate) === null || m === void 0 || m.inputControllerDidPaste(e);
  } else if (n) {
    var p, f, C;
    e.type = "text/html", e.html = n, (p = this.delegate) === null || p === void 0 || p.inputControllerWillPaste(e), (f = this.responder) === null || f === void 0 || f.insertHTML(e.html), this.requestRender(), (C = this.delegate) === null || C === void 0 || C.inputControllerDidPaste(e);
  } else if (Array.from(t.types).includes("Files")) {
    var L, U;
    const O = (L = t.items) === null || L === void 0 || (L = L[0]) === null || L === void 0 || (U = L.getAsFile) === null || U === void 0 ? void 0 : U.call(L);
    if (O) {
      var j, q, N;
      const T = cl(O);
      !O.name && T && (O.name = "pasted-file-".concat(++ll, ".").concat(T)), e.type = "File", e.file = O, (j = this.delegate) === null || j === void 0 || j.inputControllerWillAttachFiles(), (q = this.responder) === null || q === void 0 || q.insertFile(e.file), this.requestRender(), (N = this.delegate) === null || N === void 0 || N.inputControllerDidPaste(e);
    }
  }
  s.preventDefault();
}, compositionstart(s) {
  return this.getCompositionInput().start(s.data);
}, compositionupdate(s) {
  return this.getCompositionInput().update(s.data);
}, compositionend(s) {
  return this.getCompositionInput().end(s.data);
}, beforeinput(s) {
  this.inputSummary.didInput = !0;
}, input(s) {
  return this.inputSummary.didInput = !0, s.stopPropagation();
} }), V(mt, "keys", { backspace(s) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("backward", s);
}, delete(s) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("forward", s);
}, return(s) {
  var t, e;
  return this.setInputSummary({ preferDocument: !0 }), (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 ? void 0 : e.insertLineBreak();
}, tab(s) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.canIncreaseNestingLevel() && ((e = this.responder) === null || e === void 0 || e.increaseNestingLevel(), this.requestRender(), s.preventDefault());
}, left(s) {
  var t;
  if (this.selectionIsInCursorTarget()) return s.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("backward");
}, right(s) {
  var t;
  if (this.selectionIsInCursorTarget()) return s.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("forward");
}, control: { d(s) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("forward", s);
}, h(s) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("backward", s);
}, o(s) {
  var t, e;
  return s.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 || e.insertString(`
`, { updatePosition: !1 }), this.requestRender();
} }, shift: { return(s) {
  var t, e;
  (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 || e.insertString(`
`), this.requestRender(), s.preventDefault();
}, tab(s) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.canDecreaseNestingLevel() && ((e = this.responder) === null || e === void 0 || e.decreaseNestingLevel(), this.requestRender(), s.preventDefault());
}, left(s) {
  if (this.selectionIsInCursorTarget()) return s.preventDefault(), this.expandSelectionInDirection("backward");
}, right(s) {
  if (this.selectionIsInCursorTarget()) return s.preventDefault(), this.expandSelectionInDirection("forward");
} }, alt: { backspace(s) {
  var t;
  return this.setInputSummary({ preferDocument: !1 }), (t = this.delegate) === null || t === void 0 ? void 0 : t.inputControllerWillPerformTyping();
} }, meta: { backspace(s) {
  var t;
  return this.setInputSummary({ preferDocument: !1 }), (t = this.delegate) === null || t === void 0 ? void 0 : t.inputControllerWillPerformTyping();
} } }), mt.proxyMethod("responder?.getSelectedRange"), mt.proxyMethod("responder?.setSelectedRange"), mt.proxyMethod("responder?.expandSelectionInDirection"), mt.proxyMethod("responder?.selectionIsInCursorTarget"), mt.proxyMethod("responder?.selectionIsExpanded");
const cl = (s) => {
  var t;
  return (t = s.type) === null || t === void 0 || (t = t.match(/\/(\w+)$/)) === null || t === void 0 ? void 0 : t[1];
}, hl = !((Vi = " ".codePointAt) === null || Vi === void 0 || !Vi.call(" ", 0)), dl = function(s) {
  if (s.key && hl && s.key.codePointAt(0) === s.keyCode) return s.key;
  {
    let t;
    if (s.which === null ? t = s.keyCode : s.which !== 0 && s.charCode !== 0 && (t = s.charCode), t != null && ro[t] !== "escape") return ye.fromCodepoints([t]).toString();
  }
}, ul = function(s) {
  const t = s.clipboardData;
  if (t) {
    if (t.types.includes("text/html")) {
      for (const e of t.types) {
        const i = /^CorePasteboardFlavorType/.test(e), n = /^dyn\./.test(e) && t.getData(e);
        if (i || n) return !0;
      }
      return !1;
    }
    {
      const e = t.types.includes("com.apple.webarchive"), i = t.types.includes("com.apple.flat-rtfd");
      return e || i;
    }
  }
};
class bt extends M {
  constructor(t) {
    super(...arguments), this.inputController = t, this.responder = this.inputController.responder, this.delegate = this.inputController.delegate, this.inputSummary = this.inputController.inputSummary, this.data = {};
  }
  start(t) {
    if (this.data.start = t, this.isSignificant()) {
      var e, i;
      this.inputSummary.eventName === "keypress" && this.inputSummary.textAdded && ((i = this.responder) === null || i === void 0 || i.deleteInDirection("left")), this.selectionIsExpanded() || (this.insertPlaceholder(), this.requestRender()), this.range = (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedRange();
    }
  }
  update(t) {
    if (this.data.update = t, this.isSignificant()) {
      const e = this.selectPlaceholder();
      e && (this.forgetPlaceholder(), this.range = e);
    }
  }
  end(t) {
    return this.data.end = t, this.isSignificant() ? (this.forgetPlaceholder(), this.canApplyToDocument() ? (this.setInputSummary({ preferDocument: !0, didInput: !1 }), (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformTyping(), (i = this.responder) === null || i === void 0 || i.setSelectedRange(this.range), (n = this.responder) === null || n === void 0 || n.insertString(this.data.end), (r = this.responder) === null || r === void 0 ? void 0 : r.setSelectedRange(this.range[0] + this.data.end.length)) : this.data.start != null || this.data.update != null ? (this.requestReparse(), this.inputController.reset()) : void 0) : this.inputController.reset();
    var e, i, n, r;
  }
  getEndData() {
    return this.data.end;
  }
  isEnded() {
    return this.getEndData() != null;
  }
  isSignificant() {
    return !al.composesExistingText || this.inputSummary.didInput;
  }
  canApplyToDocument() {
    var t, e;
    return ((t = this.data.start) === null || t === void 0 ? void 0 : t.length) === 0 && ((e = this.data.end) === null || e === void 0 ? void 0 : e.length) > 0 && this.range;
  }
}
bt.proxyMethod("inputController.setInputSummary"), bt.proxyMethod("inputController.requestRender"), bt.proxyMethod("inputController.requestReparse"), bt.proxyMethod("responder?.selectionIsExpanded"), bt.proxyMethod("responder?.insertPlaceholder"), bt.proxyMethod("responder?.selectPlaceholder"), bt.proxyMethod("responder?.forgetPlaceholder");
class ve extends ri {
  constructor() {
    super(...arguments), this.render = this.render.bind(this);
  }
  elementDidMutate() {
    return this.scheduledRender ? this.composing ? (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidAllowUnhandledInput) === null || e === void 0 ? void 0 : e.call(t) : void 0 : this.reparse();
    var t, e;
  }
  scheduleRender() {
    return this.scheduledRender ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
  }
  render() {
    var t, e;
    cancelAnimationFrame(this.scheduledRender), this.scheduledRender = null, this.composing || (e = this.delegate) === null || e === void 0 || e.render(), (t = this.afterRender) === null || t === void 0 || t.call(this), this.afterRender = null;
  }
  reparse() {
    var t;
    return (t = this.delegate) === null || t === void 0 ? void 0 : t.reparse();
  }
  insertString() {
    var t;
    let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", i = arguments.length > 1 ? arguments[1] : void 0;
    return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.withTargetDOMRange(function() {
      var n;
      return (n = this.responder) === null || n === void 0 ? void 0 : n.insertString(e, i);
    });
  }
  toggleAttributeIfSupported(t) {
    var e;
    if (hn().includes(t)) return (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformFormatting(t), this.withTargetDOMRange(function() {
      var i;
      return (i = this.responder) === null || i === void 0 ? void 0 : i.toggleCurrentAttribute(t);
    });
  }
  activateAttributeIfSupported(t, e) {
    var i;
    if (hn().includes(t)) return (i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformFormatting(t), this.withTargetDOMRange(function() {
      var n;
      return (n = this.responder) === null || n === void 0 ? void 0 : n.setCurrentAttribute(t, e);
    });
  }
  deleteInDirection(t) {
    let { recordUndoEntry: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { recordUndoEntry: !0 };
    var i;
    e && ((i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformTyping());
    const n = () => {
      var o;
      return (o = this.responder) === null || o === void 0 ? void 0 : o.deleteInDirection(t);
    }, r = this.getTargetDOMRange({ minLength: this.composing ? 1 : 2 });
    return r ? this.withTargetDOMRange(r, n) : n();
  }
  withTargetDOMRange(t, e) {
    var i;
    return typeof t == "function" && (e = t, t = this.getTargetDOMRange()), t ? (i = this.responder) === null || i === void 0 ? void 0 : i.withTargetDOMRange(t, e.bind(this)) : (Mt.reset(), e.call(this));
  }
  getTargetDOMRange() {
    var t, e;
    let { minLength: i } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { minLength: 0 };
    const n = (t = (e = this.event).getTargetRanges) === null || t === void 0 ? void 0 : t.call(e);
    if (n && n.length) {
      const r = ml(n[0]);
      if (i === 0 || r.toString().length >= i) return r;
    }
  }
  withEvent(t, e) {
    let i;
    this.event = t;
    try {
      i = e.call(this);
    } finally {
      this.event = null;
    }
    return i;
  }
}
V(ve, "events", { keydown(s) {
  if (Lr(s)) {
    var t;
    const e = fl(s);
    (t = this.delegate) !== null && t !== void 0 && t.inputControllerDidReceiveKeyboardCommand(e) && s.preventDefault();
  } else {
    let e = s.key;
    s.altKey && (e += "+Alt"), s.shiftKey && (e += "+Shift");
    const i = this.constructor.keys[e];
    if (i) return this.withEvent(s, i);
  }
}, paste(s) {
  var t;
  let e;
  const i = (t = s.clipboardData) === null || t === void 0 ? void 0 : t.getData("URL");
  return oo(s) ? (s.preventDefault(), this.attachFiles(s.clipboardData.files)) : pl(s) ? (s.preventDefault(), e = { type: "text/plain", string: s.clipboardData.getData("text/plain") }, (n = this.delegate) === null || n === void 0 || n.inputControllerWillPaste(e), (r = this.responder) === null || r === void 0 || r.insertString(e.string), this.render(), (o = this.delegate) === null || o === void 0 ? void 0 : o.inputControllerDidPaste(e)) : i ? (s.preventDefault(), e = { type: "text/html", html: this.createLinkHTML(i) }, (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(e), (c = this.responder) === null || c === void 0 || c.insertHTML(e.html), this.render(), (h = this.delegate) === null || h === void 0 ? void 0 : h.inputControllerDidPaste(e)) : void 0;
  var n, r, o, a, c, h;
}, beforeinput(s) {
  const t = this.constructor.inputTypes[s.inputType], e = (i = s, !(!/iPhone|iPad/.test(navigator.userAgent) || i.inputType && i.inputType !== "insertParagraph"));
  var i;
  t && (this.withEvent(s, t), e || this.scheduleRender()), e && this.render();
}, input(s) {
  Mt.reset();
}, dragstart(s) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.selectionContainsAttachments() && (s.dataTransfer.setData("application/x-trix-dragging", !0), this.dragging = { range: (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedRange(), point: zi(s) });
}, dragenter(s) {
  Wi(s) && s.preventDefault();
}, dragover(s) {
  if (this.dragging) {
    s.preventDefault();
    const e = zi(s);
    var t;
    if (!Yt(e, this.dragging.point)) return this.dragging.point = e, (t = this.responder) === null || t === void 0 ? void 0 : t.setLocationRangeFromPointRange(e);
  } else Wi(s) && s.preventDefault();
}, drop(s) {
  var t, e;
  if (this.dragging) return s.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillMoveText(), (e = this.responder) === null || e === void 0 || e.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender();
  if (Wi(s)) {
    var i;
    s.preventDefault();
    const n = zi(s);
    return (i = this.responder) === null || i === void 0 || i.setLocationRangeFromPointRange(n), this.attachFiles(s.dataTransfer.files);
  }
}, dragend() {
  var s;
  this.dragging && ((s = this.responder) === null || s === void 0 || s.setSelectedRange(this.dragging.range), this.dragging = null);
}, compositionend(s) {
  this.composing && (this.composing = !1, Ce.recentAndroid || this.scheduleRender());
} }), V(ve, "keys", { ArrowLeft() {
  var s, t;
  if ((s = this.responder) !== null && s !== void 0 && s.shouldManageMovingCursorInDirection("backward")) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("backward");
}, ArrowRight() {
  var s, t;
  if ((s = this.responder) !== null && s !== void 0 && s.shouldManageMovingCursorInDirection("forward")) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("forward");
}, Backspace() {
  var s, t, e;
  if ((s = this.responder) !== null && s !== void 0 && s.shouldManageDeletingInDirection("backward")) return this.event.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 || e.deleteInDirection("backward"), this.render();
}, Tab() {
  var s, t;
  if ((s = this.responder) !== null && s !== void 0 && s.canIncreaseNestingLevel()) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 || t.increaseNestingLevel(), this.render();
}, "Tab+Shift"() {
  var s, t;
  if ((s = this.responder) !== null && s !== void 0 && s.canDecreaseNestingLevel()) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 || t.decreaseNestingLevel(), this.render();
} }), V(ve, "inputTypes", { deleteByComposition() {
  return this.deleteInDirection("backward", { recordUndoEntry: !1 });
}, deleteByCut() {
  return this.deleteInDirection("backward");
}, deleteByDrag() {
  return this.event.preventDefault(), this.withTargetDOMRange(function() {
    var s;
    this.deleteByDragRange = (s = this.responder) === null || s === void 0 ? void 0 : s.getSelectedRange();
  });
}, deleteCompositionText() {
  return this.deleteInDirection("backward", { recordUndoEntry: !1 });
}, deleteContent() {
  return this.deleteInDirection("backward");
}, deleteContentBackward() {
  return this.deleteInDirection("backward");
}, deleteContentForward() {
  return this.deleteInDirection("forward");
}, deleteEntireSoftLine() {
  return this.deleteInDirection("forward");
}, deleteHardLineBackward() {
  return this.deleteInDirection("backward");
}, deleteHardLineForward() {
  return this.deleteInDirection("forward");
}, deleteSoftLineBackward() {
  return this.deleteInDirection("backward");
}, deleteSoftLineForward() {
  return this.deleteInDirection("forward");
}, deleteWordBackward() {
  return this.deleteInDirection("backward");
}, deleteWordForward() {
  return this.deleteInDirection("forward");
}, formatBackColor() {
  return this.activateAttributeIfSupported("backgroundColor", this.event.data);
}, formatBold() {
  return this.toggleAttributeIfSupported("bold");
}, formatFontColor() {
  return this.activateAttributeIfSupported("color", this.event.data);
}, formatFontName() {
  return this.activateAttributeIfSupported("font", this.event.data);
}, formatIndent() {
  var s;
  if ((s = this.responder) !== null && s !== void 0 && s.canIncreaseNestingLevel()) return this.withTargetDOMRange(function() {
    var t;
    return (t = this.responder) === null || t === void 0 ? void 0 : t.increaseNestingLevel();
  });
}, formatItalic() {
  return this.toggleAttributeIfSupported("italic");
}, formatJustifyCenter() {
  return this.toggleAttributeIfSupported("justifyCenter");
}, formatJustifyFull() {
  return this.toggleAttributeIfSupported("justifyFull");
}, formatJustifyLeft() {
  return this.toggleAttributeIfSupported("justifyLeft");
}, formatJustifyRight() {
  return this.toggleAttributeIfSupported("justifyRight");
}, formatOutdent() {
  var s;
  if ((s = this.responder) !== null && s !== void 0 && s.canDecreaseNestingLevel()) return this.withTargetDOMRange(function() {
    var t;
    return (t = this.responder) === null || t === void 0 ? void 0 : t.decreaseNestingLevel();
  });
}, formatRemove() {
  this.withTargetDOMRange(function() {
    for (const e in (s = this.responder) === null || s === void 0 ? void 0 : s.getCurrentAttributes()) {
      var s, t;
      (t = this.responder) === null || t === void 0 || t.removeCurrentAttribute(e);
    }
  });
}, formatSetBlockTextDirection() {
  return this.activateAttributeIfSupported("blockDir", this.event.data);
}, formatSetInlineTextDirection() {
  return this.activateAttributeIfSupported("textDir", this.event.data);
}, formatStrikeThrough() {
  return this.toggleAttributeIfSupported("strike");
}, formatSubscript() {
  return this.toggleAttributeIfSupported("sub");
}, formatSuperscript() {
  return this.toggleAttributeIfSupported("sup");
}, formatUnderline() {
  return this.toggleAttributeIfSupported("underline");
}, historyRedo() {
  var s;
  return (s = this.delegate) === null || s === void 0 ? void 0 : s.inputControllerWillPerformRedo();
}, historyUndo() {
  var s;
  return (s = this.delegate) === null || s === void 0 ? void 0 : s.inputControllerWillPerformUndo();
}, insertCompositionText() {
  return this.composing = !0, this.insertString(this.event.data);
}, insertFromComposition() {
  return this.composing = !1, this.insertString(this.event.data);
}, insertFromDrop() {
  const s = this.deleteByDragRange;
  var t;
  if (s) return this.deleteByDragRange = null, (t = this.delegate) === null || t === void 0 || t.inputControllerWillMoveText(), this.withTargetDOMRange(function() {
    var e;
    return (e = this.responder) === null || e === void 0 ? void 0 : e.moveTextFromRange(s);
  });
}, insertFromPaste() {
  const { dataTransfer: s } = this.event, t = { dataTransfer: s }, e = s.getData("URL"), i = s.getData("text/html");
  if (e) {
    var n;
    let c;
    this.event.preventDefault(), t.type = "text/html";
    const h = s.getData("public.url-name");
    c = h ? wn(h).trim() : e, t.html = this.createLinkHTML(e, c), (n = this.delegate) === null || n === void 0 || n.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var d;
      return (d = this.responder) === null || d === void 0 ? void 0 : d.insertHTML(t.html);
    }), this.afterRender = () => {
      var d;
      return (d = this.delegate) === null || d === void 0 ? void 0 : d.inputControllerDidPaste(t);
    };
  } else if (Cr(s)) {
    var r;
    t.type = "text/plain", t.string = s.getData("text/plain"), (r = this.delegate) === null || r === void 0 || r.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var c;
      return (c = this.responder) === null || c === void 0 ? void 0 : c.insertString(t.string);
    }), this.afterRender = () => {
      var c;
      return (c = this.delegate) === null || c === void 0 ? void 0 : c.inputControllerDidPaste(t);
    };
  } else if (gl(this.event)) {
    var o;
    t.type = "File", t.file = s.files[0], (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var c;
      return (c = this.responder) === null || c === void 0 ? void 0 : c.insertFile(t.file);
    }), this.afterRender = () => {
      var c;
      return (c = this.delegate) === null || c === void 0 ? void 0 : c.inputControllerDidPaste(t);
    };
  } else if (i) {
    var a;
    this.event.preventDefault(), t.type = "text/html", t.html = i, (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var c;
      return (c = this.responder) === null || c === void 0 ? void 0 : c.insertHTML(t.html);
    }), this.afterRender = () => {
      var c;
      return (c = this.delegate) === null || c === void 0 ? void 0 : c.inputControllerDidPaste(t);
    };
  }
}, insertFromYank() {
  return this.insertString(this.event.data);
}, insertLineBreak() {
  return this.insertString(`
`);
}, insertLink() {
  return this.activateAttributeIfSupported("href", this.event.data);
}, insertOrderedList() {
  return this.toggleAttributeIfSupported("number");
}, insertParagraph() {
  var s;
  return (s = this.delegate) === null || s === void 0 || s.inputControllerWillPerformTyping(), this.withTargetDOMRange(function() {
    var t;
    return (t = this.responder) === null || t === void 0 ? void 0 : t.insertLineBreak();
  });
}, insertReplacementText() {
  const s = this.event.dataTransfer.getData("text/plain"), t = this.event.getTargetRanges()[0];
  this.withTargetDOMRange(t, () => {
    this.insertString(s, { updatePosition: !1 });
  });
}, insertText() {
  var s;
  return this.insertString(this.event.data || ((s = this.event.dataTransfer) === null || s === void 0 ? void 0 : s.getData("text/plain")));
}, insertTranspose() {
  return this.insertString(this.event.data);
}, insertUnorderedList() {
  return this.toggleAttributeIfSupported("bullet");
} });
const ml = function(s) {
  const t = document.createRange();
  return t.setStart(s.startContainer, s.startOffset), t.setEnd(s.endContainer, s.endOffset), t;
}, Wi = (s) => {
  var t;
  return Array.from(((t = s.dataTransfer) === null || t === void 0 ? void 0 : t.types) || []).includes("Files");
}, gl = (s) => {
  var t;
  return ((t = s.dataTransfer.files) === null || t === void 0 ? void 0 : t[0]) && !oo(s) && !((e) => {
    let { dataTransfer: i } = e;
    return i.types.includes("Files") && i.types.includes("text/html") && i.getData("text/html").includes("urn:schemas-microsoft-com:office:office");
  })(s);
}, oo = function(s) {
  const t = s.clipboardData;
  if (t)
    return Array.from(t.types).filter((e) => e.match(/file/i)).length === t.types.length && t.files.length >= 1;
}, pl = function(s) {
  const t = s.clipboardData;
  if (t) return t.types.includes("text/plain") && t.types.length === 1;
}, fl = function(s) {
  const t = [];
  return s.altKey && t.push("alt"), s.shiftKey && t.push("shift"), t.push(s.key), t;
}, zi = (s) => ({ x: s.clientX, y: s.clientY }), vn = "[data-trix-attribute]", _n = "[data-trix-action]", bl = "".concat(vn, ", ").concat(_n), oi = "[data-trix-dialog]", vl = "".concat(oi, "[data-trix-active]"), _l = "".concat(oi, " [data-trix-method]"), Ms = "".concat(oi, " [data-trix-input]"), Bs = (s, t) => (t || (t = Wt(s)), s.querySelector("[data-trix-input][name='".concat(t, "']"))), Ns = (s) => s.getAttribute("data-trix-action"), Wt = (s) => s.getAttribute("data-trix-attribute") || s.getAttribute("data-trix-dialog-attribute");
class ao extends M {
  constructor(t) {
    super(t), this.didClickActionButton = this.didClickActionButton.bind(this), this.didClickAttributeButton = this.didClickAttributeButton.bind(this), this.didClickDialogButton = this.didClickDialogButton.bind(this), this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this), this.element = t, this.attributes = {}, this.actions = {}, this.resetDialogInputs(), k("mousedown", { onElement: this.element, matchingSelector: _n, withCallback: this.didClickActionButton }), k("mousedown", { onElement: this.element, matchingSelector: vn, withCallback: this.didClickAttributeButton }), k("click", { onElement: this.element, matchingSelector: bl, preventDefault: !0 }), k("click", { onElement: this.element, matchingSelector: _l, withCallback: this.didClickDialogButton }), k("keydown", { onElement: this.element, matchingSelector: Ms, withCallback: this.didKeyDownDialogInput });
  }
  didClickActionButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const n = Ns(e);
    return this.getDialog(n) ? this.toggleDialog(n) : (r = this.delegate) === null || r === void 0 ? void 0 : r.toolbarDidInvokeAction(n, e);
    var r;
  }
  didClickAttributeButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const n = Wt(e);
    var r;
    return this.getDialog(n) ? this.toggleDialog(n) : (r = this.delegate) === null || r === void 0 || r.toolbarDidToggleAttribute(n), this.refreshAttributeButtons();
  }
  didClickDialogButton(t, e) {
    const i = At(e, { matchingSelector: oi });
    return this[e.getAttribute("data-trix-method")].call(this, i);
  }
  didKeyDownDialogInput(t, e) {
    if (t.keyCode === 13) {
      t.preventDefault();
      const i = e.getAttribute("name"), n = this.getDialog(i);
      this.setAttribute(n);
    }
    if (t.keyCode === 27) return t.preventDefault(), this.hideDialog();
  }
  updateActions(t) {
    return this.actions = t, this.refreshActionButtons();
  }
  refreshActionButtons() {
    return this.eachActionButton((t, e) => {
      t.disabled = this.actions[e] === !1;
    });
  }
  eachActionButton(t) {
    return Array.from(this.element.querySelectorAll(_n)).map((e) => t(e, Ns(e)));
  }
  updateAttributes(t) {
    return this.attributes = t, this.refreshAttributeButtons();
  }
  refreshAttributeButtons() {
    return this.eachAttributeButton((t, e) => (t.disabled = this.attributes[e] === !1, this.attributes[e] || this.dialogIsVisible(e) ? (t.setAttribute("data-trix-active", ""), t.classList.add("trix-active")) : (t.removeAttribute("data-trix-active"), t.classList.remove("trix-active"))));
  }
  eachAttributeButton(t) {
    return Array.from(this.element.querySelectorAll(vn)).map((e) => t(e, Wt(e)));
  }
  applyKeyboardCommand(t) {
    const e = JSON.stringify(t.sort());
    for (const i of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
      const n = i.getAttribute("data-trix-key").split("+");
      if (JSON.stringify(n.sort()) === e) return me("mousedown", { onElement: i }), !0;
    }
    return !1;
  }
  dialogIsVisible(t) {
    const e = this.getDialog(t);
    if (e) return e.hasAttribute("data-trix-active");
  }
  toggleDialog(t) {
    return this.dialogIsVisible(t) ? this.hideDialog() : this.showDialog(t);
  }
  showDialog(t) {
    var e, i;
    this.hideDialog(), (e = this.delegate) === null || e === void 0 || e.toolbarWillShowDialog();
    const n = this.getDialog(t);
    n.setAttribute("data-trix-active", ""), n.classList.add("trix-active"), Array.from(n.querySelectorAll("input[disabled]")).forEach((o) => {
      o.removeAttribute("disabled");
    });
    const r = Wt(n);
    if (r) {
      const o = Bs(n, t);
      o && (o.value = this.attributes[r] || "", o.select());
    }
    return (i = this.delegate) === null || i === void 0 ? void 0 : i.toolbarDidShowDialog(t);
  }
  setAttribute(t) {
    var e;
    const i = Wt(t), n = Bs(t, i);
    return !n.willValidate || (n.setCustomValidity(""), n.checkValidity() && this.isSafeAttribute(n)) ? ((e = this.delegate) === null || e === void 0 || e.toolbarDidUpdateAttribute(i, n.value), this.hideDialog()) : (n.setCustomValidity("Invalid value"), n.setAttribute("data-trix-validate", ""), n.classList.add("trix-validate"), n.focus());
  }
  isSafeAttribute(t) {
    return !t.hasAttribute("data-trix-validate-href") || Ee.isValidAttribute("a", "href", t.value);
  }
  removeAttribute(t) {
    var e;
    const i = Wt(t);
    return (e = this.delegate) === null || e === void 0 || e.toolbarDidRemoveAttribute(i), this.hideDialog();
  }
  hideDialog() {
    const t = this.element.querySelector(vl);
    var e;
    if (t) return t.removeAttribute("data-trix-active"), t.classList.remove("trix-active"), this.resetDialogInputs(), (e = this.delegate) === null || e === void 0 ? void 0 : e.toolbarDidHideDialog(((i) => i.getAttribute("data-trix-dialog"))(t));
  }
  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(Ms)).forEach((t) => {
      t.setAttribute("disabled", "disabled"), t.removeAttribute("data-trix-validate"), t.classList.remove("trix-validate");
    });
  }
  getDialog(t) {
    return this.element.querySelector("[data-trix-dialog=".concat(t, "]"));
  }
}
class _e extends eo {
  constructor(t) {
    let { editorElement: e, document: i, html: n } = t;
    super(...arguments), this.editorElement = e, this.selectionManager = new Lt(this.editorElement), this.selectionManager.delegate = this, this.composition = new vt(), this.composition.delegate = this, this.attachmentManager = new Vr(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = xn.getLevel() === 2 ? new ve(this.editorElement) : new mt(this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new to(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new ao(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new Gr(this.composition, this.selectionManager, this.editorElement), i ? this.editor.loadDocument(i) : this.editor.loadHTML(n);
  }
  registerSelectionManager() {
    return Mt.registerSelectionManager(this.selectionManager);
  }
  unregisterSelectionManager() {
    return Mt.unregisterSelectionManager(this.selectionManager);
  }
  render() {
    return this.compositionController.render();
  }
  reparse() {
    return this.composition.replaceHTML(this.editorElement.innerHTML);
  }
  compositionDidChangeDocument(t) {
    if (this.notifyEditorElement("document-change"), !this.handlingInput) return this.render();
  }
  compositionDidChangeCurrentAttributes(t) {
    return this.currentAttributes = t, this.toolbarController.updateAttributes(this.currentAttributes), this.updateCurrentActions(), this.notifyEditorElement("attributes-change", { attributes: this.currentAttributes });
  }
  compositionDidPerformInsertionAtRange(t) {
    this.pasting && (this.pastedRange = t);
  }
  compositionShouldAcceptFile(t) {
    return this.notifyEditorElement("file-accept", { file: t });
  }
  compositionDidAddAttachment(t) {
    const e = this.attachmentManager.manageAttachment(t);
    return this.notifyEditorElement("attachment-add", { attachment: e });
  }
  compositionDidEditAttachment(t) {
    this.compositionController.rerenderViewForObject(t);
    const e = this.attachmentManager.manageAttachment(t);
    return this.notifyEditorElement("attachment-edit", { attachment: e }), this.notifyEditorElement("change");
  }
  compositionDidChangeAttachmentPreviewURL(t) {
    return this.compositionController.invalidateViewForObject(t), this.notifyEditorElement("change");
  }
  compositionDidRemoveAttachment(t) {
    const e = this.attachmentManager.unmanageAttachment(t);
    return this.notifyEditorElement("attachment-remove", { attachment: e });
  }
  compositionDidStartEditingAttachment(t, e) {
    return this.attachmentLocationRange = this.composition.document.getLocationRangeOfAttachment(t), this.compositionController.installAttachmentEditorForAttachment(t, e), this.selectionManager.setLocationRange(this.attachmentLocationRange);
  }
  compositionDidStopEditingAttachment(t) {
    this.compositionController.uninstallAttachmentEditor(), this.attachmentLocationRange = null;
  }
  compositionDidRequestChangingSelectionToLocationRange(t) {
    if (!this.loadingSnapshot || this.isFocused()) return this.requestedLocationRange = t, this.compositionRevisionWhenLocationRangeRequested = this.composition.revision, this.handlingInput ? void 0 : this.render();
  }
  compositionWillLoadSnapshot() {
    this.loadingSnapshot = !0;
  }
  compositionDidLoadSnapshot() {
    this.compositionController.refreshViewCache(), this.render(), this.loadingSnapshot = !1;
  }
  getSelectionManager() {
    return this.selectionManager;
  }
  attachmentManagerDidRequestRemovalOfAttachment(t) {
    return this.removeAttachment(t);
  }
  compositionControllerWillSyncDocumentView() {
    return this.inputController.editorWillSyncDocumentView(), this.selectionManager.lock(), this.selectionManager.clearSelection();
  }
  compositionControllerDidSyncDocumentView() {
    return this.inputController.editorDidSyncDocumentView(), this.selectionManager.unlock(), this.updateCurrentActions(), this.notifyEditorElement("sync");
  }
  compositionControllerDidRender() {
    this.requestedLocationRange && (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision && this.selectionManager.setLocationRange(this.requestedLocationRange), this.requestedLocationRange = null, this.compositionRevisionWhenLocationRangeRequested = null), this.renderedCompositionRevision !== this.composition.revision && (this.runEditorFilters(), this.composition.updateCurrentAttributes(), this.notifyEditorElement("render")), this.renderedCompositionRevision = this.composition.revision;
  }
  compositionControllerDidFocus() {
    return this.isFocusedInvisibly() && this.setLocationRange({ index: 0, offset: 0 }), this.toolbarController.hideDialog(), this.notifyEditorElement("focus");
  }
  compositionControllerDidBlur() {
    return this.notifyEditorElement("blur");
  }
  compositionControllerDidSelectAttachment(t, e) {
    return this.toolbarController.hideDialog(), this.composition.editAttachment(t, e);
  }
  compositionControllerDidRequestDeselectingAttachment(t) {
    const e = this.attachmentLocationRange || this.composition.document.getLocationRangeOfAttachment(t);
    return this.selectionManager.setLocationRange(e[1]);
  }
  compositionControllerWillUpdateAttachment(t) {
    return this.editor.recordUndoEntry("Edit Attachment", { context: t.id, consolidatable: !0 });
  }
  compositionControllerDidRequestRemovalOfAttachment(t) {
    return this.removeAttachment(t);
  }
  inputControllerWillHandleInput() {
    this.handlingInput = !0, this.requestedRender = !1;
  }
  inputControllerDidRequestRender() {
    this.requestedRender = !0;
  }
  inputControllerDidHandleInput() {
    if (this.handlingInput = !1, this.requestedRender) return this.requestedRender = !1, this.render();
  }
  inputControllerDidAllowUnhandledInput() {
    return this.notifyEditorElement("change");
  }
  inputControllerDidRequestReparse() {
    return this.reparse();
  }
  inputControllerWillPerformTyping() {
    return this.recordTypingUndoEntry();
  }
  inputControllerWillPerformFormatting(t) {
    return this.recordFormattingUndoEntry(t);
  }
  inputControllerWillCutText() {
    return this.editor.recordUndoEntry("Cut");
  }
  inputControllerWillPaste(t) {
    return this.editor.recordUndoEntry("Paste"), this.pasting = !0, this.notifyEditorElement("before-paste", { paste: t });
  }
  inputControllerDidPaste(t) {
    return t.range = this.pastedRange, this.pastedRange = null, this.pasting = null, this.notifyEditorElement("paste", { paste: t });
  }
  inputControllerWillMoveText() {
    return this.editor.recordUndoEntry("Move");
  }
  inputControllerWillAttachFiles() {
    return this.editor.recordUndoEntry("Drop Files");
  }
  inputControllerWillPerformUndo() {
    return this.editor.undo();
  }
  inputControllerWillPerformRedo() {
    return this.editor.redo();
  }
  inputControllerDidReceiveKeyboardCommand(t) {
    return this.toolbarController.applyKeyboardCommand(t);
  }
  inputControllerDidStartDrag() {
    this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
  }
  inputControllerDidReceiveDragOverPoint(t) {
    return this.selectionManager.setLocationRangeFromPointRange(t);
  }
  inputControllerDidCancelDrag() {
    this.selectionManager.setLocationRange(this.locationRangeBeforeDrag), this.locationRangeBeforeDrag = null;
  }
  locationRangeDidChange(t) {
    return this.composition.updateCurrentAttributes(), this.updateCurrentActions(), this.attachmentLocationRange && !Ye(this.attachmentLocationRange, t) && this.composition.stopEditingAttachment(), this.notifyEditorElement("selection-change");
  }
  toolbarDidClickButton() {
    if (!this.getLocationRange()) return this.setLocationRange({ index: 0, offset: 0 });
  }
  toolbarDidInvokeAction(t, e) {
    return this.invokeAction(t, e);
  }
  toolbarDidToggleAttribute(t) {
    if (this.recordFormattingUndoEntry(t), this.composition.toggleCurrentAttribute(t), this.render(), !this.selectionFrozen) return this.editorElement.focus();
  }
  toolbarDidUpdateAttribute(t, e) {
    if (this.recordFormattingUndoEntry(t), this.composition.setCurrentAttribute(t, e), this.render(), !this.selectionFrozen) return this.editorElement.focus();
  }
  toolbarDidRemoveAttribute(t) {
    if (this.recordFormattingUndoEntry(t), this.composition.removeCurrentAttribute(t), this.render(), !this.selectionFrozen) return this.editorElement.focus();
  }
  toolbarWillShowDialog(t) {
    return this.composition.expandSelectionForEditing(), this.freezeSelection();
  }
  toolbarDidShowDialog(t) {
    return this.notifyEditorElement("toolbar-dialog-show", { dialogName: t });
  }
  toolbarDidHideDialog(t) {
    return this.thawSelection(), this.editorElement.focus(), this.notifyEditorElement("toolbar-dialog-hide", { dialogName: t });
  }
  freezeSelection() {
    if (!this.selectionFrozen) return this.selectionManager.lock(), this.composition.freezeSelection(), this.selectionFrozen = !0, this.render();
  }
  thawSelection() {
    if (this.selectionFrozen) return this.composition.thawSelection(), this.selectionManager.unlock(), this.selectionFrozen = !1, this.render();
  }
  canInvokeAction(t) {
    return !!this.actionIsExternal(t) || !((e = this.actions[t]) === null || e === void 0 || (e = e.test) === null || e === void 0 || !e.call(this));
    var e;
  }
  invokeAction(t, e) {
    return this.actionIsExternal(t) ? this.notifyEditorElement("action-invoke", { actionName: t, invokingElement: e }) : (i = this.actions[t]) === null || i === void 0 || (i = i.perform) === null || i === void 0 ? void 0 : i.call(this);
    var i;
  }
  actionIsExternal(t) {
    return /^x-./.test(t);
  }
  getCurrentActions() {
    const t = {};
    for (const e in this.actions) t[e] = this.canInvokeAction(e);
    return t;
  }
  updateCurrentActions() {
    const t = this.getCurrentActions();
    if (!Yt(t, this.currentActions)) return this.currentActions = t, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions });
  }
  runEditorFilters() {
    let t = this.composition.getSnapshot();
    if (Array.from(this.editor.filters).forEach((n) => {
      const { document: r, selectedRange: o } = t;
      t = n.call(this.editor, t) || {}, t.document || (t.document = r), t.selectedRange || (t.selectedRange = o);
    }), e = t, i = this.composition.getSnapshot(), !Ye(e.selectedRange, i.selectedRange) || !e.document.isEqualTo(i.document)) return this.composition.loadSnapshot(t);
    var e, i;
  }
  updateInputElement() {
    const t = function(e, i) {
      const n = Ga[i];
      if (n) return n(e);
      throw new Error("unknown content type: ".concat(i));
    }(this.compositionController.getSerializableElement(), "text/html");
    return this.editorElement.setFormValue(t);
  }
  notifyEditorElement(t, e) {
    switch (t) {
      case "document-change":
        this.documentChangedSinceLastRender = !0;
        break;
      case "render":
        this.documentChangedSinceLastRender && (this.documentChangedSinceLastRender = !1, this.notifyEditorElement("change"));
        break;
      case "change":
      case "attachment-add":
      case "attachment-edit":
      case "attachment-remove":
        this.updateInputElement();
    }
    return this.editorElement.notify(t, e);
  }
  removeAttachment(t) {
    return this.editor.recordUndoEntry("Delete Attachment"), this.composition.removeAttachment(t), this.render();
  }
  recordFormattingUndoEntry(t) {
    const e = D(t), i = this.selectionManager.getLocationRange();
    if (e || !gt(i)) return this.editor.recordUndoEntry("Formatting", { context: this.getUndoContext(), consolidatable: !0 });
  }
  recordTypingUndoEntry() {
    return this.editor.recordUndoEntry("Typing", { context: this.getUndoContext(this.currentAttributes), consolidatable: !0 });
  }
  getUndoContext() {
    for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++) e[i] = arguments[i];
    return [this.getLocationContext(), this.getTimeContext(), ...Array.from(e)];
  }
  getLocationContext() {
    const t = this.selectionManager.getLocationRange();
    return gt(t) ? t[0].index : t;
  }
  getTimeContext() {
    return an.interval > 0 ? Math.floor((/* @__PURE__ */ new Date()).getTime() / an.interval) : 0;
  }
  isFocused() {
    var t;
    return this.editorElement === ((t = this.editorElement.ownerDocument) === null || t === void 0 ? void 0 : t.activeElement);
  }
  isFocusedInvisibly() {
    return this.isFocused() && !this.getLocationRange();
  }
  get actions() {
    return this.constructor.actions;
  }
}
V(_e, "actions", { undo: { test() {
  return this.editor.canUndo();
}, perform() {
  return this.editor.undo();
} }, redo: { test() {
  return this.editor.canRedo();
}, perform() {
  return this.editor.redo();
} }, link: { test() {
  return this.editor.canActivateAttribute("href");
} }, increaseNestingLevel: { test() {
  return this.editor.canIncreaseNestingLevel();
}, perform() {
  return this.editor.increaseNestingLevel() && this.render();
} }, decreaseNestingLevel: { test() {
  return this.editor.canDecreaseNestingLevel();
}, perform() {
  return this.editor.decreaseNestingLevel() && this.render();
} }, attachFiles: { test: () => !0, perform() {
  return xn.pickFiles(this.editor.insertFiles);
} } }), _e.proxyMethod("getSelectionManager().setLocationRange"), _e.proxyMethod("getSelectionManager().getLocationRange");
var Al = Object.freeze({ __proto__: null, AttachmentEditorController: Zr, CompositionController: to, Controller: eo, EditorController: _e, InputController: ri, Level0InputController: mt, Level2InputController: ve, ToolbarController: ao }), yl = Object.freeze({ __proto__: null, MutationObserver: no, SelectionChangeObserver: wr }), El = Object.freeze({ __proto__: null, FileVerificationOperation: so, ImagePreloadOperation: $r });
xr("trix-toolbar", `%t {
  display: block;
}

%t {
  white-space: nowrap;
}

%t [data-trix-dialog] {
  display: none;
}

%t [data-trix-dialog][data-trix-active] {
  display: block;
}

%t [data-trix-dialog] [data-trix-validate]:invalid {
  background-color: #ffdddd;
}`);
class lo extends HTMLElement {
  connectedCallback() {
    this.innerHTML === "" && (this.innerHTML = Sr.getDefaultHTML());
  }
  get editorElements() {
    if (this.id) {
      var t;
      const e = (t = this.ownerDocument) === null || t === void 0 ? void 0 : t.querySelectorAll('trix-editor[toolbar="'.concat(this.id, '"]'));
      return Array.from(e);
    }
    return [];
  }
  get editorElement() {
    const [t] = this.editorElements;
    return t;
  }
}
let Sl = 0;
const xl = function(s) {
  if (!s.hasAttribute("contenteditable")) return s.toggleAttribute("contenteditable", !s.disabled), function(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return e.times = 1, k(t, e);
  }("focus", { onElement: s, withCallback: () => Cl(s) });
}, Cl = function(s) {
  return Ll(s), Tl();
}, Ll = function(s) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "enableObjectResizing")) return document.execCommand("enableObjectResizing", !1, !1), k("mscontrolselect", { onElement: s, preventDefault: !0 });
}, Tl = function(s) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "DefaultParagraphSeparator")) {
    const { tagName: i } = G.default;
    if (["div", "p"].includes(i)) return document.execCommand("DefaultParagraphSeparator", !1, i);
  }
}, Ps = Ce.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
xr("trix-editor", `%t {
    display: block;
}

%t:empty::before {
    content: attr(placeholder);
    color: graytext;
    cursor: text;
    pointer-events: none;
    white-space: pre-line;
}

%t a[contenteditable=false] {
    cursor: text;
}

%t img {
    max-width: 100%;
    height: auto;
}

%t `.concat(kt, ` figcaption textarea {
    resize: none;
}

%t `).concat(kt, ` figcaption textarea.trix-autoresize-clone {
    position: absolute;
    left: -9999px;
    max-height: 0px;
}

%t `).concat(kt, ` figcaption[data-trix-placeholder]:empty::before {
    content: attr(data-trix-placeholder);
    color: graytext;
}

%t [data-trix-cursor-target] {
    display: `).concat(Ps.display, ` !important;
    width: `).concat(Ps.width, ` !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
}

%t [data-trix-cursor-target=left] {
    vertical-align: top !important;
    margin-left: -1px !important;
}

%t [data-trix-cursor-target=right] {
    vertical-align: bottom !important;
    margin-right: -1px !important;
}`));
var st = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap(), ce = /* @__PURE__ */ new WeakSet();
class wl {
  constructor(t) {
    var e, i;
    Hr(e = this, i = ce), i.add(e), V(this, "value", ""), Gt(this, st, { writable: !0, value: void 0 }), Gt(this, He, { writable: !0, value: void 0 }), this.element = t, be(this, st, t.attachInternals()), be(this, He, !1);
  }
  connectedCallback() {
    qe(this, ce, $e).call(this);
  }
  disconnectedCallback() {
  }
  get form() {
    return E(this, st).form;
  }
  get name() {
    return this.element.getAttribute("name");
  }
  set name(t) {
    this.element.setAttribute("name", t);
  }
  get labels() {
    return E(this, st).labels;
  }
  get disabled() {
    return E(this, He) || this.element.hasAttribute("disabled");
  }
  set disabled(t) {
    this.element.toggleAttribute("disabled", t);
  }
  get required() {
    return this.element.hasAttribute("required");
  }
  set required(t) {
    this.element.toggleAttribute("required", t), qe(this, ce, $e).call(this);
  }
  get validity() {
    return E(this, st).validity;
  }
  get validationMessage() {
    return E(this, st).validationMessage;
  }
  get willValidate() {
    return E(this, st).willValidate;
  }
  formDisabledCallback(t) {
    be(this, He, t);
  }
  setFormValue(t) {
    this.value = t, qe(this, ce, $e).call(this), E(this, st).setFormValue(this.element.disabled ? void 0 : this.value);
  }
  checkValidity() {
    return E(this, st).checkValidity();
  }
  reportValidity() {
    return E(this, st).reportValidity();
  }
  setCustomValidity(t) {
    qe(this, ce, $e).call(this, t);
  }
}
function $e() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const { required: t, value: e } = this.element, i = t && !e, n = !!s, r = _("input", { required: t }), o = s || r.validationMessage;
  E(this, st).setValidity({ valueMissing: i, customError: n }, o);
}
var Ki = /* @__PURE__ */ new WeakMap(), Gi = /* @__PURE__ */ new WeakMap(), Ji = /* @__PURE__ */ new WeakMap();
class kl {
  constructor(t) {
    Gt(this, Ki, { writable: !0, value: void 0 }), Gt(this, Gi, { writable: !0, value: (e) => {
      e.defaultPrevented || e.target === this.element.form && this.element.reset();
    } }), Gt(this, Ji, { writable: !0, value: (e) => {
      if (e.defaultPrevented || this.element.contains(e.target)) return;
      const i = At(e.target, { matchingSelector: "label" });
      i && Array.from(this.labels).includes(i) && this.element.focus();
    } }), this.element = t;
  }
  connectedCallback() {
    be(this, Ki, function(t) {
      if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) return;
      const e = function() {
        const i = Array.from(t.labels).map((r) => {
          if (!r.contains(t)) return r.textContent;
        }).filter((r) => r), n = i.join(" ");
        return n ? t.setAttribute("aria-label", n) : t.removeAttribute("aria-label");
      };
      return e(), k("focus", { onElement: t, withCallback: e });
    }(this.element)), window.addEventListener("reset", E(this, Gi), !1), window.addEventListener("click", E(this, Ji), !1);
  }
  disconnectedCallback() {
    var t;
    (t = E(this, Ki)) === null || t === void 0 || t.destroy(), window.removeEventListener("reset", E(this, Gi), !1), window.removeEventListener("click", E(this, Ji), !1);
  }
  get labels() {
    const t = [];
    this.element.id && this.element.ownerDocument && t.push(...Array.from(this.element.ownerDocument.querySelectorAll("label[for='".concat(this.element.id, "']")) || []));
    const e = At(this.element, { matchingSelector: "label" });
    return e && [this.element, null].includes(e.control) && t.push(e), t;
  }
  get form() {
    return console.warn("This browser does not support the .form property for trix-editor elements."), null;
  }
  get name() {
    return console.warn("This browser does not support the .name property for trix-editor elements."), null;
  }
  set name(t) {
    console.warn("This browser does not support the .name property for trix-editor elements.");
  }
  get disabled() {
    return console.warn("This browser does not support the [disabled] attribute for trix-editor elements."), !1;
  }
  set disabled(t) {
    console.warn("This browser does not support the [disabled] attribute for trix-editor elements.");
  }
  get required() {
    return console.warn("This browser does not support the [required] attribute for trix-editor elements."), !1;
  }
  set required(t) {
    console.warn("This browser does not support the [required] attribute for trix-editor elements.");
  }
  get validity() {
    return console.warn("This browser does not support the validity property for trix-editor elements."), null;
  }
  get validationMessage() {
    return console.warn("This browser does not support the validationMessage property for trix-editor elements."), "";
  }
  get willValidate() {
    return console.warn("This browser does not support the willValidate property for trix-editor elements."), !1;
  }
  formDisabledCallback(t) {
  }
  setFormValue(t) {
  }
  checkValidity() {
    return console.warn("This browser does not support checkValidity() for trix-editor elements."), !0;
  }
  reportValidity() {
    return console.warn("This browser does not support reportValidity() for trix-editor elements."), !0;
  }
  setCustomValidity(t) {
    console.warn("This browser does not support setCustomValidity(validationMessage) for trix-editor elements.");
  }
}
var R = /* @__PURE__ */ new WeakMap();
class Ze extends HTMLElement {
  constructor() {
    super(), Gt(this, R, { writable: !0, value: void 0 }), this.willCreateInput = !0, be(this, R, this.constructor.formAssociated ? new wl(this) : new kl(this));
  }
  get trixId() {
    return this.hasAttribute("trix-id") ? this.getAttribute("trix-id") : (this.setAttribute("trix-id", ++Sl), this.trixId);
  }
  get labels() {
    return E(this, R).labels;
  }
  get disabled() {
    const { inputElement: t } = this;
    return t ? t.disabled : E(this, R).disabled;
  }
  set disabled(t) {
    const { inputElement: e } = this;
    e && (e.disabled = t), E(this, R).disabled = t;
  }
  get required() {
    return E(this, R).required;
  }
  set required(t) {
    E(this, R).required = t;
  }
  get validity() {
    return E(this, R).validity;
  }
  get validationMessage() {
    return E(this, R).validationMessage;
  }
  get willValidate() {
    return E(this, R).willValidate;
  }
  get type() {
    return this.localName;
  }
  get toolbarElement() {
    var t;
    if (this.hasAttribute("toolbar")) return (t = this.ownerDocument) === null || t === void 0 ? void 0 : t.getElementById(this.getAttribute("toolbar"));
    if (this.parentNode) {
      const e = "trix-toolbar-".concat(this.trixId);
      return this.setAttribute("toolbar", e), this.internalToolbar = _("trix-toolbar", { id: e }), this.parentNode.insertBefore(this.internalToolbar, this), this.internalToolbar;
    }
  }
  get form() {
    const { inputElement: t } = this;
    return t ? t.form : E(this, R).form;
  }
  get inputElement() {
    var t;
    return this.hasAttribute("input") ? (t = this.ownerDocument) === null || t === void 0 ? void 0 : t.getElementById(this.getAttribute("input")) : void 0;
  }
  get editor() {
    var t;
    return (t = this.editorController) === null || t === void 0 ? void 0 : t.editor;
  }
  get name() {
    const { inputElement: t } = this;
    return t ? t.name : E(this, R).name;
  }
  set name(t) {
    const { inputElement: e } = this;
    e ? e.name = t : E(this, R).name = t;
  }
  get value() {
    const { inputElement: t } = this;
    return t ? t.value : E(this, R).value;
  }
  set value(t) {
    var e;
    this.defaultValue = t, (e = this.editor) === null || e === void 0 || e.loadHTML(this.defaultValue);
  }
  attributeChangedCallback(t, e, i) {
    t === "connected" && this.isConnected && e != null && e !== i && requestAnimationFrame(() => this.reconnect());
  }
  notify(t, e) {
    if (this.editorController) return me("trix-".concat(t), { onElement: this, attributes: e });
  }
  setFormValue(t) {
    const { inputElement: e } = this;
    e && (e.value = t), E(this, R).setFormValue(t);
  }
  connectedCallback() {
    if (!this.hasAttribute("data-trix-internal")) {
      if (xl(this), function(t) {
        t.hasAttribute("role") || t.setAttribute("role", "textbox");
      }(this), !this.editorController) {
        if (me("trix-before-initialize", { onElement: this }), this.defaultValue = this.inputElement ? this.inputElement.value : this.innerHTML, !this.hasAttribute("input") && this.parentNode && this.willCreateInput) {
          const t = "trix-input-".concat(this.trixId);
          this.setAttribute("input", t);
          const e = _("input", { type: "hidden", id: t });
          this.parentNode.insertBefore(e, this.nextElementSibling);
        }
        this.editorController = new _e({ editorElement: this, html: this.defaultValue }), requestAnimationFrame(() => me("trix-initialize", { onElement: this }));
      }
      this.editorController.registerSelectionManager(), E(this, R).connectedCallback(), this.toggleAttribute("connected", !0), function(t) {
        !document.querySelector(":focus") && t.hasAttribute("autofocus") && document.querySelector("[autofocus]") === t && t.focus();
      }(this);
    }
  }
  disconnectedCallback() {
    var t;
    (t = this.editorController) === null || t === void 0 || t.unregisterSelectionManager(), E(this, R).disconnectedCallback(), this.toggleAttribute("connected", !1);
  }
  reconnect() {
    this.removeInternalToolbar(), this.disconnectedCallback(), this.connectedCallback();
  }
  removeInternalToolbar() {
    var t;
    (t = this.internalToolbar) === null || t === void 0 || t.remove(), this.internalToolbar = null;
  }
  checkValidity() {
    return E(this, R).checkValidity();
  }
  reportValidity() {
    return E(this, R).reportValidity();
  }
  setCustomValidity(t) {
    E(this, R).setCustomValidity(t);
  }
  formDisabledCallback(t) {
    const { inputElement: e } = this;
    e && (e.disabled = t), this.toggleAttribute("contenteditable", !t), E(this, R).formDisabledCallback(t);
  }
  formResetCallback() {
    this.reset();
  }
  reset() {
    this.value = this.defaultValue;
  }
}
V(Ze, "formAssociated", "ElementInternals" in window), V(Ze, "observedAttributes", ["connected"]);
const Fs = { VERSION: Io, config: Le, core: Ja, models: Qr, views: tl, controllers: Al, observers: yl, operations: El, elements: Object.freeze({ __proto__: null, TrixEditorElement: Ze, TrixToolbarElement: lo }), filters: Object.freeze({ __proto__: null, Filter: zr, attachmentGalleryFilter: Kr }) };
Object.assign(Fs, Qr), window.Trix = Fs, setTimeout(function() {
  customElements.get("trix-toolbar") || customElements.define("trix-toolbar", lo), customElements.get("trix-editor") || customElements.define("trix-editor", Ze);
}, 0);
class Il extends HTMLElement {
  constructor() {
    super(), this._value = "", this.render();
  }
  static get observedAttributes() {
    return ["data-text", "data-queryparam", "data-value"];
  }
  set value(t) {
    this.setAttribute("data-value", t);
  }
  get value() {
    return this.getAttribute("data-value") || "";
  }
  set text(t) {
    this.setAttribute("data-text", t);
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set queryparam(t) {
    this.setAttribute("data-queryparam", t);
  }
  get queryparam() {
    return this.getAttribute("data-queryparam") || "";
  }
  connectedCallback() {
    this._filter = this.text, this._queryparam = this.queryparam, this.render(), htmx.process(this);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-text" && (this._filter = i), t === "data-queryparam" && (this._queryparam = i), t === "data-value" && (this._value = i), this.render());
  }
  getURL() {
    if (this._queryparam) {
      let t = new URL(window.location), e = new URLSearchParams(t.search);
      return e.delete(this._queryparam), e.delete("page"), t.search = e.toString(), t.toString();
    }
    return "#";
  }
  render() {
    this.innerHTML = `
		<a href="${this.getURL()}" class="!no-underline block text-base" hx-target="#searchresults" hx-select="#searchresults" hx-indicator="body" hx-swap="outerHTML show:window:top">
			<div class="flex flex-row filter-pill rounded-lg bg-orange-100 hover:saturate-50 px-2.5">
				${this.renderIcon()}
				<div class="flex flex-row filter-pill-label-value !items-baseline text-slate-700">
					<div class="filter-pill-label font-bold mr-1.5 align-baseline">${this.text}</div>
					${this.renderValue()}
				</div>
			</div>
		</a>
		`;
  }
  renderIcon() {
    return this.value === "true" || this.value === "false" ? `
			<div href="${this.getURL()}" class="filter-pill-close no-underline font-bold mr-1 text-orange-900 hover:text-orange-800">
				<i class="ri-close-circle-line"></i>
			</div>
		` : `<div
				href="${this.getURL()}"
				class="filter-pill-close no-underline font-bold mr-1 text-orange-900 hover:text-orange-800">
				<i class="ri-arrow-left-s-line"></i>
			</div>
			`;
  }
  renderValue() {
    return this.value === "true" || this.value === "false" ? "" : `
			<div class="filter-pill-value">${this.value}</div>
		`;
  }
}
const Ue = "filter-list-list", Rl = "filter-list-item", Dl = "filter-list-input", qs = "filter-list-searchable";
var wt, xe, An;
class Ol extends HTMLElement {
  constructor() {
    super();
    ie(this, xe);
    ie(this, wt, !1);
    this._items = [], this._url = "", this._filterstart = !1, this._placeholder = "Liste filtern...", this._queryparam = "", this._startparams = null, this.render();
  }
  static get observedAttributes() {
    return ["data-url"];
  }
  set items(e) {
    Array.isArray(e) && (this._items = e, this.render());
  }
  get items() {
    return this._items;
  }
  connectedCallback() {
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && Me(this, wt, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(e, i, n) {
    e === "data-url" && i !== n && (this._url = n, this.render()), e === "data-filterstart" && i !== n && (this._filterstart = n === "true", this.render()), e === "data-placeholder" && i !== n && (this._placeholder = n, this.render()), e === "data-queryparam" && i !== n && (this._queryparam = n, this.render());
  }
  onInput(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (this._filter = e.target.value, this.renderList());
  }
  onGainFocus(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (Me(this, wt, !1), this.renderList());
  }
  onLoseFocus(e) {
    let i = this.querySelector("input");
    if (e.target && e.target === i) {
      if (relatedElement = e.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      i.value = "", this._filter = "", this._filterstart && Me(this, wt, !0), this.renderList();
    }
  }
  onEnter(e) {
    if (e.target && e.target.tagName.toLowerCase() === "input" && e.key === "Enter") {
      e.preventDefault();
      const i = this.querySelector("a");
      i && i.click();
    }
  }
  mark() {
    if (typeof Mark != "function")
      return;
    let e = this.querySelector("#" + Ue);
    if (!e)
      return;
    let i = new Mark(e.querySelectorAll("." + qs));
    this._filter && i.mark(this._filter, {
      separateWordSearch: !0
    });
  }
  // INFO: allows for setting a custom HREF of the list item
  // The function takes the item as parameter fn(item) and should return a string.
  setHREFFunc(e) {
    this.getHREF = e, this.render();
  }
  // INFO: allows for setting a custom link text of the list item
  // The function takes the item as parameter fn(item) and should return a string or
  // an HTML template literal.
  setLinkTextFunc(e) {
    this.getLinkText = e, this.render();
  }
  // INFO: allows for setting the text that will be filtered for.
  // The function takes the item as parameter fn(item) and should return a string.
  setSearchTextFunc(e) {
    this.getSearchText = e, this.render();
  }
  getHREF(e) {
    if (e) {
      if (!e.id)
        return "";
    } else return "";
    return e.id;
  }
  getHREFEncoded(e) {
    return encodeURIComponent(this.getHREF(e));
  }
  getSearchText(e) {
    if (e) {
      if (!e.name)
        return "";
    } else return "";
    return e.name;
  }
  getLinkText(e) {
    let i = this.getSearchText(e);
    return i === "" ? "" : `<span class="${qs}">${i}</span>`;
  }
  getURL(e) {
    if (this._queryparam) {
      let i = new URL(window.location), n = new URLSearchParams(i.search);
      return n.set(this._queryparam, this.getHREF(e)), n.delete("page"), i.search = n.toString(), i.toString();
    }
    return this._url + this.getHREFEncoded(e);
  }
  renderList() {
    let e = this.querySelector("#" + Ue);
    e && (e.outerHTML = this.List()), this.mark();
  }
  render() {
    this.innerHTML = `
            <div class="font-serif text-base shadow-inner border border-stone-100">
							${this.Input()}
							${this.List()}
            </div>
        `, htmx && htmx.process(this);
  }
  ActiveDot(e) {
    return Be(this, xe, An).call(this, e), "";
  }
  NoItems(e) {
    return e.length === 0 ? '<div class="px-2 py-0.5 italic text-gray-500">Keine Einträge gefunden</div>' : "";
  }
  Input() {
    return `
			<div class="flex w-full py-0.5 border-b border-zinc-600 bg-stone-50">
						<i class="ri-arrow-right-s-line pl-2"></i>
						<div class="grow">
						<input
								type="text"
								placeholder="${this._placeholder}"
								class="${Dl} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
  }
  List() {
    let e = this._items;
    if (this._filter)
      if (this._filterstart)
        e = this._items.filter((i) => this.getSearchText(i).toLowerCase().startsWith(this._filter.toLowerCase()));
      else {
        let i = this._filter.split(" ");
        e = this._items.filter((n) => i.every((r) => this.getSearchText(n).toLowerCase().includes(r.toLowerCase())));
      }
    return `
							<div id="${Ue}" class="${Ue} pt-1 max-h-60 overflow-auto bg-stone-50 ${Ei(this, wt) ? "hidden" : ""}">
								${e.map(
      (i, n) => `
									<a
										href="${this.getURL(i)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${Rl} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${n % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${Be(this, xe, An).call(this, i) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(i)}
										${this.getLinkText(i)}
									</a>
								`
    ).join("")}
								${this.NoItems(e)}
							</div>
				`;
  }
}
wt = new WeakMap(), xe = new WeakSet(), An = function(e) {
  if (!e)
    return !1;
  let i = this.getHREF(e);
  return i === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === i ? !0 : !!window.location.href.endsWith(i);
};
class Ml extends HTMLElement {
  constructor() {
    super(), this.handleScroll = this.handleScroll.bind(this), this.scrollToTop = this.scrollToTop.bind(this);
  }
  connectedCallback() {
    this.innerHTML = `
          <button
            class="
              scroll-to-top
              fixed bottom-5 right-5
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
        `, this._button = this.querySelector(".scroll-to-top"), window.addEventListener("scroll", this.handleScroll), this._button.addEventListener("click", this.scrollToTop);
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll), this._button.removeEventListener("click", this.scrollToTop);
  }
  handleScroll() {
    (window.scrollY || document.documentElement.scrollTop) > 300 ? this._button.classList.remove("hidden") : this._button.classList.add("hidden");
  }
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
class Bl extends HTMLElement {
  static get observedAttributes() {
    return ["position", "timeout"];
  }
  constructor() {
    super(), this._tooltipBox = null, this._timeout = 200, this._hideTimeout = null, this._hiddenTimeout = null;
  }
  connectedCallback() {
    this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal");
    const t = this.querySelector(".data-tip"), e = t ? t.innerHTML : "Tooltip";
    t && t.classList.add("hidden"), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = e, this._tooltipBox.className = [
      "opacity-0",
      "hidden",
      "absolute",
      "px-2",
      "py-1",
      "text-sm",
      "text-white",
      "bg-gray-900",
      "rounded",
      "shadow",
      "z-10",
      "whitespace-nowrap",
      "transition-all",
      "duration-200",
      "font-sans"
    ].join(" "), this.appendChild(this._tooltipBox), this._updatePosition(), this.addEventListener("mouseenter", () => this._showTooltip()), this.addEventListener("mouseleave", () => this._hideTooltip());
  }
  attributeChangedCallback(t, e, i) {
    t === "position" && this._tooltipBox && this._updatePosition(), t === "timeout" && i && (this._timeout = parseInt(i) || 200);
  }
  _showTooltip() {
    clearTimeout(this._hideTimeout), clearTimeout(this._hiddenTimeout), this._tooltipBox.classList.remove("hidden"), setTimeout(() => {
      this._tooltipBox.classList.remove("opacity-0"), this._tooltipBox.classList.add("opacity-100");
    }, 16);
  }
  _hideTooltip() {
    this._hideTimeout = setTimeout(() => {
      this._tooltipBox.classList.remove("opacity-100"), this._tooltipBox.classList.add("opacity-0"), this._hiddenTimeout = setTimeout(() => {
        this._tooltipBox.classList.add("hidden");
      }, this._timeout + 100);
    }, this._timeout);
  }
  _updatePosition() {
    switch (this._tooltipBox.classList.remove(
      "bottom-full",
      "left-1/2",
      "-translate-x-1/2",
      "mb-2",
      // top
      "top-full",
      "mt-2",
      // bottom
      "right-full",
      "-translate-y-1/2",
      "mr-2",
      "top-1/2",
      // left
      "left-full",
      "ml-2"
      // right
    ), this.getAttribute("position") || "top") {
      case "bottom":
        this._tooltipBox.classList.add(
          "top-full",
          "left-1/2",
          "transform",
          "-translate-x-1/2",
          "mt-0.5"
        );
        break;
      case "left":
        this._tooltipBox.classList.add(
          "right-full",
          "top-1/2",
          "transform",
          "-translate-y-1/2",
          "mr-0.5"
        );
        break;
      case "right":
        this._tooltipBox.classList.add(
          "left-full",
          "top-1/2",
          "transform",
          "-translate-y-1/2",
          "ml-0.5"
        );
        break;
      case "top":
      default:
        this._tooltipBox.classList.add(
          "bottom-full",
          "left-1/2",
          "transform",
          "-translate-x-1/2",
          "mb-0.5"
        );
    }
  }
}
class Nl extends HTMLElement {
  constructor() {
    super(), this.overlay = null, this._others = null, this._thisindex = -1, this._preview = null, this._description = null, this._imageURL = "", this._hideDLButton = !1;
  }
  connectedCallback() {
    this.classList.add("cursor-pointer"), this.classList.add("select-none"), this._imageURL = this.getAttribute("data-image-url") || "", this._hideDLButton = this.getAttribute("data-hide-dl-button") || !1, this._preview = this.querySelector("img"), this._description = this.querySelector(".image-description"), this._preview && this._preview.addEventListener("click", () => {
      this.showOverlay();
    });
    let t = this.closest("image-reel, .image-reel");
    t || (t = document), this._others = Array.from(t.querySelectorAll("popup-image:not(.hidden)")), this._thisindex = this._others.indexOf(this);
  }
  disconnectedCallback() {
    this.overlay && this.overlay.parentNode && this.overlay.parentNode.removeChild(this.overlay);
  }
  Keys(t) {
    t.repeat || (t.preventDefault(), t.key === "ArrowRight" ? this.next() : t.key === "ArrowLeft" ? this.prev() : t.key === "Escape" && this.hideOverlay());
  }
  next() {
    this._others[this._thisindex + 1] ? (this.hideOverlay(), this._others[this._thisindex + 1].showOverlay()) : document.addEventListener("keydown", this.Keys.bind(this), { once: !0 });
  }
  prev() {
    this._others[this._thisindex - 1] ? (this.hideOverlay(), this._others[this._thisindex - 1].showOverlay()) : document.addEventListener("keydown", this.Keys.bind(this), { once: !0 });
  }
  showOverlay() {
    this.overlay = document.createElement("div"), this.overlay.classList.add(
      "fixed",
      "inset-0",
      "z-50",
      "bg-black/70",
      "flex",
      "items-center",
      "justify-center",
      "p-4"
    ), this.overlay.innerHTML = `
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
          src="${this._imageURL}"
          alt="Popup Image"
          class="full max-h-[80vh] max-w-[80vw] object-contain block relative ${this.descriptionImgClass()}"
        />
				${this.description()}
					</div>
      </div>
    `;
    const t = this.overlay.querySelector("#closebutton");
    t && t.addEventListener("click", () => {
      this.hideOverlay();
    });
    const e = this.overlay.querySelector("#nextbtn");
    e && e.addEventListener("click", this.next.bind(this));
    const i = this.overlay.querySelector("#prevbtn");
    i && i.addEventListener("click", this.prev.bind(this)), this.overlay.addEventListener("click", (n) => {
      n.target === this.overlay && this.hideOverlay();
    }), document.addEventListener("keydown", this.Keys.bind(this), { once: !0 }), document.body.appendChild(this.overlay);
  }
  descriptionImgClass() {
    return this.description ? "" : "0";
  }
  nextButton() {
    return this._others[this._thisindex + 1] ? `
			<tool-tip position="right">
			<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Next image" id="nextbtn">
				<i class="ri-arrow-right-box-line"></i>
			</button>
			<div class="data-tip">Nächstes Bild</div>
			</tool-tip>
		` : "";
  }
  prevButton() {
    return this._others[this._thisindex - 1] ? `
			<tool-tip position="right">
			<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Previous image" id="prevbtn">
				<i class="ri-arrow-left-box-line"></i>
			</button>
			<div class="data-tip">Vorheriges Bild</div>
			</tool-tip>
		` : "";
  }
  description() {
    return this._description ? `
        <div class="font-serif text-left description-content mt-3 text-slate-900 ">
					<div class="max-w-[80ch] hyphens-auto px-6 py-2 bg-stone-50 shadow-lg">
          ${this._description.innerHTML}
						</div>
        </div>
			` : "";
  }
  downloadButton() {
    return this._hideDLButton ? "" : `
					<tool-tip position="right">
					<a href="${this._imageURL}" target="_blank" class="text-white no-underline hover:text-gray-300"><i class="ri-file-download-line"></i></a>
					<div class="data-tip">Bild herunterladen</div>
					</tool-tip>
		`;
  }
  hideOverlay() {
    this.overlay.parentNode.removeChild(this.overlay), this.overlay = null;
  }
}
class Pl extends HTMLElement {
  static get observedAttributes() {
  }
  constructor() {
    super(), this._showall = !1, this.shown = -1, this._headings = [], this._contents = [], this._checkbox = null, this._disabled = /* @__PURE__ */ new Set(), this._defaultIndex = null;
  }
  connectedCallback() {
    if (this._headings = Array.from(this.querySelectorAll(".tab-list-head")), this._contents = Array.from(this.querySelectorAll(".tab-list-panel")), this._readConfig(), this.hookupEvtHandlers(), this._applyDisabled(), this.hideDependent(), this._headings.length === 1) {
      this.expand(0);
      return;
    }
    this._defaultIndex !== null && this._expandFirstAvailable(this._defaultIndex);
  }
  expand(t) {
    t < 0 || t >= this._headings.length || this._disabled.has(t) || (this.shown = t, this._contents.forEach((e, i) => {
      i === t ? (e.classList.remove("hidden"), this._headings[i].setAttribute("aria-pressed", "true")) : (e.classList.add("hidden"), this._headings[i].setAttribute("aria-pressed", "false"));
    }));
  }
  hookupShowAll(t) {
    t && (this._checkbox = t, t.addEventListener("change", (e) => {
      e.target.checked ? this.showAll() : this.default();
    }));
  }
  hookupEvtHandlers() {
    for (let t of this._headings)
      t.addEventListener("click", this.handleTabClick.bind(this)), t.classList.add("cursor-pointer"), t.classList.add("select-none"), t.setAttribute("role", "button"), t.setAttribute("aria-pressed", "false"), t.setAttribute("tabindex", "0");
    for (let t of this._contents)
      t.classList.add("hidden");
  }
  _readConfig() {
    const t = (this.getAttribute("data-disabled-indices") || "").trim(), e = (this.getAttribute("data-default-index") || "").trim();
    if (this._disabled.clear(), t && t.split(",").map((i) => parseInt(i.trim(), 10)).filter((i) => Number.isFinite(i)).forEach((i) => this._disabled.add(i)), e !== "") {
      const i = parseInt(e, 10);
      this._defaultIndex = Number.isFinite(i) ? i : null;
    } else
      this._defaultIndex = null;
  }
  _applyDisabled() {
    this._headings.forEach((t, e) => {
      this._disabled.has(e) ? t.classList.add("pointer-events-none", "opacity-60") : t.classList.remove("pointer-events-none", "opacity-60");
    });
  }
  _expandFirstAvailable(t) {
    if (this._headings.length !== 0) {
      if (!this._disabled.has(t)) {
        this.expand(t);
        return;
      }
      for (let e = 0; e < this._headings.length; e += 1)
        if (!this._disabled.has(e)) {
          this.expand(e);
          return;
        }
    }
  }
  restore() {
    for (let t of this._headings)
      t.classList.add("cursor-pointer"), t.classList.add("select-none"), t.setAttribute("role", "button"), t.setAttribute("aria-pressed", "false"), t.setAttribute("tabindex", "0"), t.classList.remove("pointer-events-none"), t.classList.remove("!text-slate-900");
    for (let t of this._contents)
      t.classList.add("hidden");
  }
  disable() {
    for (let t of this._headings)
      t.classList.remove("cursor-pointer"), t.classList.remove("select-none"), t.removeAttribute("role"), t.removeAttribute("aria-pressed"), t.removeAttribute("tabindex"), t.classList.add("pointer-events-none"), t.classList.add("!text-slate-900");
  }
  showAll() {
    this._showall = !0, this.shown = -1, this.disable(), this._contents.forEach((t, e) => {
      t.classList.remove("hidden");
      let i = this._headings[e], n = i.querySelectorAll(".show-opened");
      for (let o of n)
        o.classList.add("hidden");
      let r = i.querySelectorAll(".show-closed");
      for (let o of r)
        o.classList.add("hidden");
    });
  }
  default() {
    this._showall = !1, this.restore(), this.hideDependent();
  }
  hideDependent() {
    if (this.shown < 0)
      for (const t of this._headings)
        this._hideAllDep(t, !1);
    else
      this._headings.forEach((t, e) => {
        this._hideAllDep(t, e === this.shown);
      });
  }
  _hideAllDep(t, e) {
    const i = t.querySelectorAll(".show-closed");
    for (let r of i)
      e ? r.classList.add("hidden") : r.classList.remove("hidden");
    const n = Array.from(t.querySelectorAll(".show-opened"));
    for (let r of n)
      e ? r.classList.remove("hidden") : r.classList.add("hidden");
  }
  handleTabClick(t) {
    if (!t.target) {
      console.warn("Invalid event target");
      return;
    }
    const e = this.findParentWithClass(t.target, "tab-list-head");
    if (!e) {
      console.warn("No parent found with class 'tab-list-head'");
      return;
    }
    const i = this._headings.indexOf(e);
    i === this.shown ? (this._contents[i].classList.toggle("hidden"), this._headings[i].setAttribute("aria-pressed", "false"), this.shown = -1) : this.expand(i), this.hideDependent();
  }
  findParentWithClass(t, e) {
    for (; t; ) {
      if (t.classList && t.classList.contains(e))
        return t;
      t = t.parentElement;
    }
    return null;
  }
}
class Ae extends HTMLElement {
  static get observedAttributes() {
    return ["data-text", "data-abbrevmap"];
  }
  static get defaultAbbrevMap() {
    return {
      "#": "Hinweis auf weitere Informationen in der Anmerkung.",
      $: "vermutlich",
      "+++": "Inhalte aus mehreren Almanachen interpoliert",
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
      "§§": "Hinweis auf Mängel im Almanach (Beschädigungen, fehlende Graphiken, unvollständige Sammlungen etc) in der Anmerkung"
    };
  }
  constructor() {
    super(), this._abbrevMap = Ae.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-abbrevmap" && this._parseAndSetAbbrevMap(i), this.render());
  }
  _parseAndSetAbbrevMap(t) {
    if (!t) {
      this._abbrevMap = Ae.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(t);
    } catch {
      this._abbrevMap = Ae.defaultAbbrevMap;
    }
  }
  setAbbrevMap(t) {
    typeof t == "object" && t !== null && (this._abbrevMap = t, this.render());
  }
  get text() {
    return this.getAttribute("data-text") || "";
  }
  set text(t) {
    this.setAttribute("data-text", t);
  }
  render() {
    this.innerHTML = this.transformText(this.text, this._abbrevMap);
  }
  transformText(t, e) {
    let i = "", n = 0;
    for (; n < t.length; ) {
      if (n > 0 && !this.isSpaceOrPunct(t[n - 1])) {
        i += t[n], n++;
        continue;
      }
      const r = this.findLongestAbbrevAt(t, n, e);
      if (r) {
        const { match: o, meaning: a } = r;
        i += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${a}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${o}
              </span>
            </tool-tip>
          `, n += o.length;
      } else
        i += t[n], n++;
    }
    return i;
  }
  findLongestAbbrevAt(t, e, i) {
    let n = null, r = 0;
    for (const o of Object.keys(i))
      t.startsWith(o, e) && o.length > r && (n = o, r = o.length);
    return n ? { match: n, meaning: i[n] } : null;
  }
  isSpaceOrPunct(t) {
    return /\s|[.,;:!?]/.test(t);
  }
}
class Fl extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style.cursor = "pointer", this.addEventListener("click", this.handleClick);
  }
  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }
  handleClick(t) {
    const e = this.getAttribute("data-jump");
    if (e) {
      const i = document.querySelector(e);
      i ? i.scrollIntoView({ behavior: "smooth" }) : console.warn(`No element found for selector: ${e}`);
    }
  }
}
var ti;
class ql extends HTMLElement {
  constructor() {
    super();
    ie(this, ti, 176);
    this._images = [];
  }
  connectedCallback() {
    this._images = Array.from(this.querySelectorAll(".primages")), this.calculateShownImages();
    const e = new ResizeObserver((i, n) => {
      this.calculateShownImages();
    });
    this._resizeObserver = e, e.observe(this);
  }
  disconnectedCallback() {
    this._resizeObserver.unobserve(this);
  }
  calculateShownImages() {
    const e = this.getBoundingClientRect();
    console.log(e);
    const i = Math.floor(e.width / (Ei(this, ti) + 10));
    for (let n = 0; n < this._images.length; n++)
      n < i - 1 ? this._images[n].classList.remove("hidden") : this._images[n].classList.add("hidden");
  }
}
ti = new WeakMap();
const Hl = "msr-component-wrapper", Hs = "msr-selected-items-container", $s = "msr-placeholder-no-selection-text", $l = "msr-selected-item-pill", Ul = "msr-selected-item-text", jl = "msr-item-name", Vl = "msr-item-additional-data", Wl = "msr-selected-item-role", Us = "msr-selected-item-delete-btn", zl = "msr-controls-area", js = "msr-pre-add-button", Vs = "msr-input-area-wrapper", je = "msr-input-area-default-border", Yi = "msr-input-area-staged", Ws = "msr-staging-area-container", Kl = "msr-staged-item-pill", Gl = "msr-staged-item-text", Xi = "msr-staged-role-select", zs = "msr-staged-cancel-btn", Ks = "msr-text-input", Gs = "msr-add-button", Js = "msr-options-list", Ys = "msr-option-item", Jl = "msr-option-item-name", Yl = "msr-option-item-detail", Xs = "msr-option-item-highlighted", Qi = "msr-hidden-select", Xl = "msr-state-no-selection", Ql = "msr-state-has-selection", Zl = "msr-state-list-open", tc = "msr-state-item-staged";
class co extends HTMLElement {
  constructor() {
    super();
    ee(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._stagedItem = null, this._showAddButton = !0, this._placeholderNoSelection = "Keine Elemente ausgewählt", this._placeholderSearch = "Elemente suchen...", this._placeholderRoleSelect = "Rolle auswählen...", this._options = [], this._roles = [
      "Leitung",
      "Unterstützung",
      "Berater",
      "Beobachter",
      "Spezialist",
      "Koordinator"
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._setupTemplates(), this._bindEventHandlers();
  }
  static get observedAttributes() {
    return [
      "disabled",
      "name",
      "value",
      "show-add-button",
      "placeholder-no-selection",
      "placeholder-search",
      "placeholder-role-select"
    ];
  }
  get showAddButton() {
    return this._showAddButton;
  }
  set showAddButton(e) {
    const i = typeof e == "string" ? e.toLowerCase() !== "false" : !!e;
    this._showAddButton !== i && (this._showAddButton = i, this.setAttribute("show-add-button", String(i)), this.preAddButtonElement && this._updatePreAddButtonVisibility());
  }
  get placeholderNoSelection() {
    return this._placeholderNoSelection;
  }
  set placeholderNoSelection(e) {
    const i = String(e || "Keine Elemente ausgewählt");
    this._placeholderNoSelection !== i && (this._placeholderNoSelection = i, this.setAttribute("placeholder-no-selection", i), this.selectedItemsContainer && this._value.length === 0 && this._renderSelectedItems());
  }
  get placeholderSearch() {
    return this._placeholderSearch;
  }
  set placeholderSearch(e) {
    const i = String(e || "Elemente suchen...");
    this._placeholderSearch !== i && (this._placeholderSearch = i, this.setAttribute("placeholder-search", i), this.inputElement && (this.inputElement.placeholder = i));
  }
  get placeholderRoleSelect() {
    return this._placeholderRoleSelect;
  }
  set placeholderRoleSelect(e) {
    const i = String(e || "Rolle auswählen...");
    this._placeholderRoleSelect !== i && (this._placeholderRoleSelect = i, this.setAttribute("placeholder-role-select", i), this._stagedItem && this.stagedItemPillContainer && this._renderStagedPillOrInput());
  }
  attributeChangedCallback(e, i, n) {
    if (i !== n)
      switch (e) {
        case "disabled":
          this.disabledCallback(this.hasAttribute("disabled"));
          break;
        case "name":
          this.hiddenSelect && (this.hiddenSelect.name = n);
          break;
        case "value":
          break;
        case "show-add-button":
          this.showAddButton = n;
          break;
        case "placeholder-no-selection":
          this.placeholderNoSelection = n;
          break;
        case "placeholder-search":
          this.placeholderSearch = n;
          break;
        case "placeholder-role-select":
          this.placeholderRoleSelect = n;
          break;
      }
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${Ys} group">
                        <span data-ref="nameEl" class="${Jl}"></span>
                        <span data-ref="detailEl" class="${Yl}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${$l} group">
                        <span data-ref="textEl" class="${Ul}"></span>
                        <button type="button" data-ref="deleteBtn" class="${Us} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${Kl} flex items-center">
                        <span data-ref="nameEl" class="${Gl}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${zs} flex items-center justify-center">&times;</button>
                `, this.stagedRoleSelectTemplate = document.createElement("template"), this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${Xi}">
                    </select>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleInputKeyDown = this._handleInputKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleAddButtonClick = this._handleAddButtonClick.bind(this), this._handleCancelStagedItem = this._handleCancelStagedItem.bind(this), this._handleStagedRoleChange = this._handleStagedRoleChange.bind(this);
  }
  _getItemById(e) {
    return this._options.find((i) => i.id === e);
  }
  _getAvailableRolesForItem(e) {
    const i = this._value.filter((n) => n.itemId === e).map((n) => n.role);
    return this._roles.filter((n) => !i.includes(n));
  }
  setRoles(e) {
    if (Array.isArray(e) && e.every((i) => typeof i == "string")) {
      this._roles = [...e], this._stagedItem && this._stagedItem.item && (this._getAvailableRolesForItem(this._stagedItem.item.id).includes(this._stagedItem.currentRole) || (this._stagedItem.currentRole = ""), this._renderStagedPillOrInput(), this._updateAddButtonState());
      const i = this._value.filter((n) => this._roles.includes(n.role));
      i.length !== this._value.length && (this.value = i.map((n) => `${n.itemId},${n.role}`));
    } else
      console.error("setRoles expects an array of strings.");
  }
  setOptions(e) {
    if (Array.isArray(e) && e.every((i) => i && typeof i.id == "string" && typeof i.name == "string")) {
      this._options = [...e];
      const i = this._value.filter((n) => this._getItemById(n.itemId));
      i.length !== this._value.length && (this.value = i.map((n) => `${n.itemId},${n.role}`)), this._stagedItem && this._stagedItem.item && !this._getItemById(this._stagedItem.item.id) && this._handleCancelStagedItem(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else
      console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(e) {
    if (Array.isArray(e)) {
      const i = e.map((o) => {
        if (typeof o == "string") {
          const a = o.split(",");
          if (a.length === 2) {
            const c = a[0].trim(), h = a[1].trim();
            if (this._getItemById(c) && this._roles.includes(h))
              return { itemId: c, role: h, instanceId: crypto.randomUUID() };
          }
        }
        return null;
      }).filter((o) => o !== null), n = [], r = /* @__PURE__ */ new Set();
      for (const o of i) {
        const a = `${o.itemId},${o.role}`;
        r.has(a) || (n.push(o), r.add(a));
      }
      this._value = n;
    } else
      this._value = [];
    this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses();
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(e) {
    this.setAttribute("name", e), this.hiddenSelect && (this.hiddenSelect.name = e);
  }
  connectedCallback() {
    if (this.placeholderNoSelection = this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection, this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch, this.placeholderRoleSelect = this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect, this._render(), this.inputAreaWrapper = this.querySelector(`.${Vs}`), this.inputElement = this.querySelector(`.${Ks}`), this.stagedItemPillContainer = this.querySelector(`.${Ws}`), this.optionsListElement = this.querySelector(`.${Js}`), this.selectedItemsContainer = this.querySelector(`.${Hs}`), this.addButtonElement = this.querySelector(`.${Gs}`), this.preAddButtonElement = this.querySelector(`.${js}`), this.hiddenSelect = this.querySelector(`.${Qi}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.hasAttribute("show-add-button") ? this.showAddButton = this.getAttribute("show-add-button") : this.setAttribute("show-add-button", String(this._showAddButton)), this.inputElement && (this.inputElement.placeholder = this.placeholderSearch), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        const i = JSON.parse(e);
        Array.isArray(i) ? this.value = i : (console.warn("Parsed value attribute is not an array:", i), this.value = []);
      } catch (i) {
        if (console.warn("Failed to parse value attribute as JSON array. Attribute was:", e, i), e.startsWith("[") && e.endsWith("]"))
          try {
            const n = e.slice(1, -1).split(",").map((r) => r.replace(/"/g, "").trim()).filter((r) => r);
            this.value = n;
          } catch (n) {
            console.error("Manual parse of value attribute also failed:", e, n), this.value = [];
          }
        else e.includes(",") ? this.value = [e] : this.value = [];
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this.hasAttribute("disabled") && this.disabledCallback(!0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleInputKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.addButtonElement && this.addButtonElement.removeEventListener("click", this._handleAddButtonClick), this.removeEventListener("keydown", this._handleKeyDown), clearTimeout(this._blurTimeout);
  }
  formAssociatedCallback(e) {
  }
  formDisabledCallback(e) {
    this.disabledCallback(e);
  }
  disabledCallback(e) {
    this.inputElement && (this.inputElement.disabled = e), this.classList.toggle("pointer-events-none", e), this.querySelectorAll(`.${Us}`).forEach(
      (n) => n.disabled = e
    );
    const i = this.querySelector(`.${Xi}`);
    i && (i.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), this._updateAddButtonState(), this._updatePreAddButtonVisibility();
  }
  formResetCallback() {
    this.value = [], this._stagedItem = null, this._renderStagedPillOrInput(), this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this._updateRootElementStateClasses();
  }
  formStateRestoreCallback(e, i) {
    Array.isArray(e) && e.every((n) => typeof n == "string" && n.includes(",")) ? this.value = e : this.value = [], this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((e) => {
      var n;
      const i = document.createElement("option");
      i.value = `${e.itemId},${e.role}`, i.textContent = `${((n = this._getItemById(e.itemId)) == null ? void 0 : n.name) || e.itemId} (${e.role})`, i.selected = !0, this.hiddenSelect.appendChild(i);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Xl, this._value.length === 0), this.classList.toggle(Ql, this._value.length > 0), this.classList.toggle(Zl, this._isOptionsListVisible), this.classList.toggle(tc, !!this._stagedItem);
  }
  _render() {
    const e = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e), this.innerHTML = `
                    <style>
                        .${Qi} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${Hl} relative">
                        <div class="${Hs} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${$s}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${zl} flex items-center">
                            <div class="${Vs} ${je} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${Ws} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${Ks} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${js} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${Gs} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${e}-options-list" class="${Js} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${e}" class="${Qi}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedItemPillElement(e) {
    const n = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return n.querySelector('[data-ref="nameEl"]').textContent = e.name, n;
  }
  _createStagedRoleSelectElement(e, i) {
    const r = this.stagedRoleSelectTemplate.content.cloneNode(!0).firstElementChild;
    let o = `<option value="" disabled ${i ? "" : "selected"}>${this.placeholderRoleSelect}</option>`;
    return e.length === 0 && !this._roles.includes(i) ? (o += "<option disabled>Keine Rollen verfügbar</option>", r.disabled = !0) : (e.forEach((a) => {
      o += `<option value="${a}" ${a === i ? "selected" : ""}>${a}</option>`;
    }), r.disabled = e.length === 0 && i === ""), r.innerHTML = o, r.addEventListener("change", this._handleStagedRoleChange), r;
  }
  _createStagedCancelButtonElement(e) {
    const n = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return n.setAttribute("aria-label", `Auswahl von ${e} abbrechen`), n.addEventListener("click", this._handleCancelStagedItem), n;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.item) {
        this.inputAreaWrapper.classList.remove(je), this.inputAreaWrapper.classList.add(Yi);
        const e = this._createStagedItemPillElement(this._stagedItem.item);
        this.stagedItemPillContainer.appendChild(e);
        const i = this._getAvailableRolesForItem(this._stagedItem.item.id), n = this._createStagedRoleSelectElement(
          i,
          this._stagedItem.currentRole
        );
        this.stagedItemPillContainer.appendChild(n);
        const r = this._createStagedCancelButtonElement(this._stagedItem.item.name);
        this.stagedItemPillContainer.appendChild(r), this.inputElement.classList.add("hidden"), this.inputElement.value = "", this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.setAttribute("aria-expanded", "false");
      } else
        this.inputAreaWrapper.classList.add(je), this.inputAreaWrapper.classList.remove(Yi), this.inputElement.classList.remove("hidden");
      this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses();
    }
  }
  _updatePreAddButtonVisibility() {
    if (!this.preAddButtonElement) return;
    const e = this.hasAttribute("disabled"), i = !this._stagedItem, n = this.showAddButton && i && !e;
    this.preAddButtonElement.classList.toggle("hidden", !n), this.preAddButtonElement.disabled = e;
  }
  _handleStagedRoleChange(e) {
    this._stagedItem && (this._stagedItem.currentRole = e.target.value, this._updateAddButtonState());
  }
  _handleCancelStagedItem(e) {
    e && e.stopPropagation(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
  }
  _createSelectedItemElement(e) {
    const i = this._getItemById(e.itemId);
    if (!i) return null;
    const r = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, o = r.querySelector('[data-ref="textEl"]');
    let a = `<span class="${jl}">${i.name}</span>`, c = i.additional_data ? ` <span class="${Vl}">(${i.additional_data})</span>` : "", h = ` <span class="${Wl}">${e.role}</span>`;
    o.innerHTML = `${a}${c}${h}`;
    const d = r.querySelector('[data-ref="deleteBtn"]');
    return d.setAttribute("aria-label", `Entferne ${i.name} als ${e.role}`), d.dataset.instanceId = e.instanceId, d.disabled = this.hasAttribute("disabled"), d.addEventListener("click", (m) => {
      m.stopPropagation(), this._handleDeleteSelectedItem(e.instanceId);
    }), r;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${$s}">${this.placeholderNoSelection}</span>` : this._value.forEach((e) => {
      const i = this._createSelectedItemElement(e);
      i && this.selectedItemsContainer.appendChild(i);
    }), this._updateRootElementStateClasses());
  }
  _updateAddButtonState() {
    if (this.addButtonElement) {
      const e = this.hasAttribute("disabled"), i = this._stagedItem && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole), n = !this._stagedItem || !i || e;
      this.addButtonElement.classList.toggle("hidden", n), this.addButtonElement.disabled = n;
    }
  }
  _createOptionElement(e, i) {
    const r = this.optionTemplate.content.cloneNode(!0).firstElementChild;
    return r.querySelector('[data-ref="nameEl"]').textContent = e.name, r.querySelector('[data-ref="detailEl"]').textContent = e.additional_data ? `(${e.additional_data})` : "", r.dataset.id = e.id, r.setAttribute("aria-selected", String(i === this._highlightedIndex)), r.id = `${this.id || "msr"}-option-${e.id}`, i === this._highlightedIndex && r.classList.add(Xs), r;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"), this.inputElement.removeAttribute("aria-controls");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this.inputElement.setAttribute("aria-controls", this.optionsListElement.id), this._filteredOptions.forEach((i, n) => {
          const r = this._createOptionElement(i, n);
          this.optionsListElement.appendChild(r);
        });
        const e = this.optionsListElement.querySelector(
          `.${Xs}`
        );
        e ? (e.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", e.id)) : this.inputElement.removeAttribute("aria-activedescendant");
      }
      this._updateRootElementStateClasses();
    }
  }
  _stageItem(e) {
    if (this._getAvailableRolesForItem(e.id).length === 0)
      return;
    this._stagedItem = { item: e, currentRole: "" }, this.inputElement && (this.inputElement.value = "", this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant")), this._renderStagedPillOrInput(), this._hideOptionsList();
    const n = this.stagedItemPillContainer.querySelector(
      `.${Xi}`
    );
    n && !n.disabled ? n.focus() : this.addButtonElement && !this.addButtonElement.disabled && this.addButtonElement.focus();
  }
  _handleAddButtonClick() {
    if (!this.hasAttribute("disabled") && this._stagedItem && this._stagedItem.item && this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
      const e = {
        itemId: this._stagedItem.item.id,
        role: this._stagedItem.currentRole,
        instanceId: crypto.randomUUID()
      };
      if (this._value.find(
        (n) => n.itemId === e.itemId && n.role === e.role
      )) {
        this._handleCancelStagedItem();
        return;
      }
      this._value.push(e), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem = null, this._renderStagedPillOrInput(), this.inputElement && (this.inputElement.value = "", this.inputElement.focus()), this._hideOptionsList();
    }
  }
  _handleInput(e) {
    if (this.hasAttribute("disabled")) return;
    this._stagedItem ? (this._stagedItem = null, this._renderStagedPillOrInput()) : this._updatePreAddButtonVisibility();
    const i = e.target.value;
    if (i.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const n = i.toLowerCase();
      this._filteredOptions = this._options.filter((r) => this._getAvailableRolesForItem(r.id).length === 0 || this._stagedItem && this._stagedItem.item.id === r.id ? !1 : r.name.toLowerCase().includes(n) || r.additional_data && r.additional_data.toLowerCase().includes(n)), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(e) {
    var i;
    if (!this.hasAttribute("disabled")) {
      if (e.key === "Enter" && this._stagedItem && this._stagedItem.item) {
        const n = document.activeElement, r = (i = this.stagedItemPillContainer) == null ? void 0 : i.querySelector(
          `.${zs}`
        );
        if (n === r) {
          e.preventDefault(), this._handleCancelStagedItem(e);
          return;
        } else if (this._stagedItem.currentRole && this._roles.includes(this._stagedItem.currentRole)) {
          e.preventDefault(), this._handleAddButtonClick();
          return;
        }
      }
      e.key === "Escape" && (this._isOptionsListVisible ? (e.preventDefault(), this._hideOptionsList(), this.inputElement && this.inputElement.focus()) : this._stagedItem && (e.preventDefault(), this._handleCancelStagedItem(e)));
    }
  }
  _handleInputKeyDown(e) {
    if (!(this.hasAttribute("disabled") || this.inputElement && this.inputElement.disabled)) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        e.key === "Enter" && this.inputElement && this.inputElement.value === "" && e.preventDefault();
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
        case "Tab":
          this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] ? (e.preventDefault(), this._stageItem(this._filteredOptions[this._highlightedIndex])) : e.key === "Tab" && this._hideOptionsList();
          break;
      }
    }
  }
  _hideOptionsList() {
    this._isOptionsListVisible = !1, this._highlightedIndex = -1, this.optionsListElement && this._renderOptionsList(), this.inputElement && (this.inputElement.setAttribute("aria-expanded", "false"), this.inputElement.removeAttribute("aria-activedescendant"));
  }
  _handleFocus() {
    if (!(this.hasAttribute("disabled") || this.inputElement && this.inputElement.disabled || this._stagedItem)) {
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(je), this.inputAreaWrapper.classList.remove(Yi)), this.inputElement && this.inputElement.value.length > 0) {
        const e = this.inputElement.value.toLowerCase();
        this._filteredOptions = this._options.filter((i) => this._getAvailableRolesForItem(i.id).length === 0 ? !1 : i.name.toLowerCase().includes(e) || i.additional_data && i.additional_data.toLowerCase().includes(e)), this._filteredOptions.length > 0 ? (this._isOptionsListVisible = !0, this._highlightedIndex = 0, this._renderOptionsList()) : this._hideOptionsList();
      } else
        this._hideOptionsList();
      this._updateRootElementStateClasses(), this._updatePreAddButtonVisibility();
    }
  }
  _handleBlur(e) {
    this._blurTimeout = setTimeout(() => {
      const i = document.activeElement;
      i !== this.addButtonElement && i !== this.preAddButtonElement && !(this.stagedItemPillContainer && this.stagedItemPillContainer.contains(i)) && !(this.optionsListElement && this.optionsListElement.contains(i)) && !this.contains(i) && this._hideOptionsList();
    }, 150);
  }
  _handleOptionMouseDown(e) {
    e.preventDefault();
  }
  _handleOptionClick(e) {
    if (this.hasAttribute("disabled")) return;
    const i = e.target.closest(`li[data-id].${Ys}`);
    if (i) {
      const n = i.dataset.id, r = this._filteredOptions.find((o) => o.id === n);
      r && this._stageItem(r);
    }
  }
  _handleDeleteSelectedItem(e) {
    this.hasAttribute("disabled") || (this._value = this._value.filter((i) => i.instanceId !== e), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem && this._stagedItem.item && this._renderStagedPillOrInput(), this.inputElement && this.inputElement.focus(), this._updatePreAddButtonVisibility());
  }
}
ee(co, "formAssociated", !0);
const ec = "mss-component-wrapper", Qs = "mss-selected-items-container", ic = "mss-selected-item-pill", nc = "mss-selected-item-text", sc = "mss-selected-item-pill-detail", Zs = "mss-selected-item-delete-btn", rc = "mss-selected-item-edit-link", tr = "mss-input-controls-container", er = "mss-input-wrapper", ir = "mss-input-wrapper-focused", nr = "mss-text-input", sr = "mss-create-new-button", rr = "mss-toggle-button", oc = "mss-inline-row", or = "mss-options-list", ac = "mss-option-item", lc = "mss-option-item-name", cc = "mss-option-item-detail", ar = "mss-option-item-highlighted", Zi = "mss-hidden-select", tn = "mss-no-items-text", lr = "mss-loading", en = 1, nn = 10, hc = 250, dc = "mss-state-no-selection", uc = "mss-state-has-selection", mc = "mss-state-list-open";
class ho extends HTMLElement {
  constructor() {
    super();
    ee(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._initialValue = [], this._initialOrder = [], this._removedIds = /* @__PURE__ */ new Set(), this._initialCaptured = !1, this._allowInitialCapture = !0, this._options = [
      { id: "abk", name: "Abchasisch" },
      { id: "aar", name: "Afar" },
      { id: "afr", name: "Afrikaans" },
      { id: "aka", name: "Akan" },
      { id: "alb", name: "Albanisch" },
      { id: "amh", name: "Amharisch" },
      { id: "ara", name: "Arabisch" },
      { id: "arg", name: "Aragonesisch" },
      { id: "arm", name: "Armenisch" },
      { id: "asm", name: "Assamesisch" },
      { id: "ava", name: "Awarisch" },
      { id: "ave", name: "Avestisch" },
      { id: "aym", name: "Aymara" },
      { id: "aze", name: "Aserbaidschanisch" },
      { id: "bam", name: "Bambara" },
      { id: "bak", name: "Baschkirisch" },
      { id: "baq", name: "Baskisch" },
      { id: "bel", name: "Belarussisch" },
      { id: "ben", name: "Bengalisch" },
      { id: "bis", name: "Bislama" },
      { id: "bos", name: "Bosnisch" },
      { id: "bre", name: "Bretonisch" },
      { id: "bul", name: "Bulgarisch" },
      { id: "bur", name: "Birmanisch" },
      { id: "cat", name: "Katalanisch" },
      { id: "cha", name: "Chamorro" },
      { id: "che", name: "Tschetschenisch" },
      { id: "nya", name: "Nyanja" },
      { id: "chi", name: "Chinesisch" },
      { id: "chu", name: "Kirchenslawisch" },
      { id: "chv", name: "Tschuwaschisch" },
      { id: "cor", name: "Kornisch" },
      { id: "cos", name: "Korsisch" },
      { id: "cre", name: "Cree" },
      { id: "hrv", name: "Kroatisch" },
      { id: "cze", name: "Tschechisch" },
      { id: "dan", name: "Dänisch" },
      { id: "div", name: "Dhivehi" },
      { id: "dut", name: "Niederländisch" },
      { id: "dzo", name: "Dzongkha" },
      { id: "eng", name: "Englisch" },
      { id: "epo", name: "Esperanto" },
      { id: "est", name: "Estnisch" },
      { id: "ewe", name: "Ewe" },
      { id: "fao", name: "Färöisch" },
      { id: "fij", name: "Fidschianisch" },
      { id: "fin", name: "Finnisch" },
      { id: "fre", name: "Französisch" },
      { id: "fry", name: "Westfriesisch" },
      { id: "ful", name: "Ful" },
      { id: "gla", name: "Schottisch-Gälisch" },
      { id: "glg", name: "Galicisch" },
      { id: "lug", name: "Ganda" },
      { id: "geo", name: "Georgisch" },
      { id: "ger", name: "Deutsch" },
      { id: "gre", name: "Griechisch" },
      { id: "kal", name: "Kalaallisut" },
      { id: "grn", name: "Guaraní" },
      { id: "guj", name: "Gujarati" },
      { id: "hat", name: "Haitianisch-Kreolisch" },
      { id: "hau", name: "Hausa" },
      { id: "heb", name: "Hebräisch" },
      { id: "her", name: "Herero" },
      { id: "hin", name: "Hindi" },
      { id: "hmo", name: "Hiri Motu" },
      { id: "hun", name: "Ungarisch" },
      { id: "ice", name: "Isländisch" },
      { id: "ido", name: "Ido" },
      { id: "ibo", name: "Igbo" },
      { id: "ind", name: "Indonesisch" },
      { id: "ina", name: "Interlingua" },
      { id: "ile", name: "Interlingue" },
      { id: "iku", name: "Inuktitut" },
      { id: "ipk", name: "Inupiaq" },
      { id: "gle", name: "Irisch" },
      { id: "ita", name: "Italienisch" },
      { id: "jpn", name: "Japanisch" },
      { id: "jav", name: "Javanisch" },
      { id: "kan", name: "Kannada" },
      { id: "kau", name: "Kanuri" },
      { id: "kas", name: "Kashmiri" },
      { id: "kaz", name: "Kasachisch" },
      { id: "khm", name: "Khmer" },
      { id: "kik", name: "Kikuyu" },
      { id: "kin", name: "Kinyarwanda" },
      { id: "kir", name: "Kirgisisch" },
      { id: "kom", name: "Komi" },
      { id: "kon", name: "Kongo" },
      { id: "kor", name: "Koreanisch" },
      { id: "kua", name: "Kwanyama" },
      { id: "kur", name: "Kurdisch" },
      { id: "lao", name: "Laotisch" },
      { id: "lat", name: "Latein" },
      { id: "lav", name: "Lettisch" },
      { id: "lim", name: "Limburgisch" },
      { id: "lin", name: "Lingala" },
      { id: "lit", name: "Litauisch" },
      { id: "lub", name: "Luba-Katanga" },
      { id: "ltz", name: "Luxemburgisch" },
      { id: "mac", name: "Mazedonisch" },
      { id: "mlg", name: "Malagasy" },
      { id: "may", name: "Malaiisch" },
      { id: "mal", name: "Malayalam" },
      { id: "mlt", name: "Maltesisch" },
      { id: "glv", name: "Manx" },
      { id: "mao", name: "Maori" },
      { id: "mar", name: "Marathi" },
      { id: "mah", name: "Marshallesisch" },
      { id: "mon", name: "Mongolisch" },
      { id: "nau", name: "Nauruisch" },
      { id: "nav", name: "Navajo" },
      { id: "nde", name: "Nord-Ndebele" },
      { id: "nbl", name: "Süd-Ndebele" },
      { id: "ndo", name: "Ndonga" },
      { id: "nep", name: "Nepali" },
      { id: "nor", name: "Norwegisch" },
      { id: "nob", name: "Norwegisch Bokmål" },
      { id: "nno", name: "Norwegisch Nynorsk" },
      { id: "oci", name: "Okzitanisch" },
      { id: "oji", name: "Ojibwa" },
      { id: "ori", name: "Oriya" },
      { id: "orm", name: "Oromo" },
      { id: "oss", name: "Ossetisch" },
      { id: "pli", name: "Pali" },
      { id: "pus", name: "Paschtu" },
      { id: "per", name: "Persisch" },
      { id: "pol", name: "Polnisch" },
      { id: "por", name: "Portugiesisch" },
      { id: "pan", name: "Panjabi" },
      { id: "que", name: "Quechua" },
      { id: "rum", name: "Rumänisch" },
      { id: "roh", name: "Rätoromanisch" },
      { id: "run", name: "Rundi" },
      { id: "rus", name: "Russisch" },
      { id: "sme", name: "Nordsamisch" },
      { id: "smo", name: "Samoanisch" },
      { id: "sag", name: "Sango" },
      { id: "san", name: "Sanskrit" },
      { id: "srd", name: "Sardisch" },
      { id: "srp", name: "Serbisch" },
      { id: "sna", name: "Shona" },
      { id: "snd", name: "Sindhi" },
      { id: "sin", name: "Singhalesisch" },
      { id: "slo", name: "Slowakisch" },
      { id: "slv", name: "Slowenisch" },
      { id: "som", name: "Somali" },
      { id: "sot", name: "Süd-Sotho" },
      { id: "spa", name: "Spanisch" },
      { id: "sun", name: "Sundanesisch" },
      { id: "swa", name: "Swahili" },
      { id: "ssw", name: "Swazi" },
      { id: "swe", name: "Schwedisch" },
      { id: "tgl", name: "Tagalog" },
      { id: "tah", name: "Tahitisch" },
      { id: "tgk", name: "Tadschikisch" },
      { id: "tam", name: "Tamil" },
      { id: "tat", name: "Tatarisch" },
      { id: "tel", name: "Telugu" },
      { id: "tha", name: "Thailändisch" },
      { id: "tib", name: "Tibetisch" },
      { id: "tir", name: "Tigrinya" },
      { id: "ton", name: "Tongaisch" },
      { id: "tso", name: "Tsonga" },
      { id: "tsn", name: "Tswana" },
      { id: "tur", name: "Türkisch" },
      { id: "tuk", name: "Turkmenisch" },
      { id: "twi", name: "Twi" },
      { id: "uig", name: "Uigurisch" },
      { id: "ukr", name: "Ukrainisch" },
      { id: "urd", name: "Urdu" },
      { id: "uzb", name: "Usbekisch" },
      { id: "ven", name: "Venda" },
      { id: "vie", name: "Vietnamesisch" },
      { id: "vol", name: "Volapük" },
      { id: "wln", name: "Wallonisch" },
      { id: "wel", name: "Walisisch" },
      { id: "wol", name: "Wolof" },
      { id: "xho", name: "Xhosa" },
      { id: "iii", name: "Sichuan Yi" },
      { id: "yid", name: "Jiddisch" },
      { id: "yor", name: "Yoruba" },
      { id: "zha", name: "Zhuang" },
      { id: "zul", name: "Zulu" }
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._remoteEndpoint = null, this._remoteResultKey = "items", this._remoteMinChars = en, this._remoteLimit = nn, this._remoteFetchController = null, this._remoteFetchTimeout = null, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._editBase = this.getAttribute("data-edit-base") || "", this._editSuffix = this.getAttribute("data-edit-suffix") || "/edit", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${ac}">
                        <span data-ref="nameEl" class="${lc}"></span>
                        <span data-ref="detailEl" class="${cc}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${ic} flex items-center">
                        <span data-ref="textEl" class="${nc}"></span>
                        <span data-ref="detailEl" class="${sc} hidden"></span>
                        <a data-ref="editLink" class="${rc} hidden" aria-label="Bearbeiten">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" data-ref="deleteBtn" class="${Zs}">&times;</button>
                    </span>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this), this._handleSelectedItemsContainerClick = this._handleSelectedItemsContainerClick.bind(this), this._handleToggleClick = this._handleToggleClick.bind(this);
  }
  _getItemById(e) {
    return this._options.find((i) => i.id === e);
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(e) {
    this._placeholder = e, this.inputElement && (this.inputElement.placeholder = this._placeholder), this.setAttribute("placeholder", e);
  }
  get showCreateButton() {
    return this._showCreateButton;
  }
  set showCreateButton(e) {
    const i = String(e).toLowerCase() !== "false" && e !== !1;
    this._showCreateButton !== i && (this._showCreateButton = i, this.createNewButton && this.createNewButton.classList.toggle("hidden", !this._showCreateButton), this.setAttribute("show-create-button", this._showCreateButton ? "true" : "false"));
  }
  setOptions(e) {
    if (Array.isArray(e) && e.every((i) => i && typeof i.id == "string" && typeof i.name == "string")) {
      this._options = e.map((n) => {
        const r = { ...n };
        return r.name = this._normalizeText(r.name), r.additional_data = this._normalizeText(r.additional_data), r;
      });
      const i = this._value.filter((n) => this._getItemById(n));
      i.length !== this._value.length ? this.value = i : this.selectedItemsContainer && this._renderSelectedItems(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(e) {
    const i = JSON.stringify(this._value.sort());
    if (Array.isArray(e))
      this._value = [...new Set(e.filter((r) => typeof r == "string" && this._getItemById(r)))];
    else if (typeof e == "string" && e.trim() !== "") {
      const r = e.trim();
      this._getItemById(r) && !this._value.includes(r) ? this._value = [r] : this._getItemById(r) || (this._value = this._value.filter((o) => o !== r));
    } else this._value = [];
    const n = JSON.stringify(this._value.sort());
    !this._initialCaptured && this._allowInitialCapture && this._value.length > 0 && (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0), this._value.forEach((r) => {
      this._removedIds.has(r) && this._removedIds.delete(r);
    }), i !== n && (this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses(), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(e) {
    this.setAttribute("name", e), this.hiddenSelect && (this.hiddenSelect.name = e);
  }
  connectedCallback() {
    this._render(), this.inputControlsContainer = this.querySelector(`.${tr}`), this.inputWrapper = this.querySelector(`.${er}`), this.inputElement = this.querySelector(`.${nr}`), this.createNewButton = this.querySelector(`.${sr}`), this.toggleButton = this.querySelector(`.${rr}`), this.optionsListElement = this.querySelector(`.${or}`), this.selectedItemsContainer = this.querySelector(`.${Qs}`), this.hiddenSelect = this.querySelector(`.${Zi}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._remoteEndpoint = this.getAttribute("data-endpoint") || null, this._remoteResultKey = this.getAttribute("data-result-key") || "items", this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), en), this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), nn), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.addEventListener("click", this._handleToggleClick);
    const e = this.getAttribute("data-external-toggle-id");
    if (e && (this.externalToggleButton = document.getElementById(e), this.externalToggleButton && this.externalToggleButton.addEventListener("click", this._handleToggleClick)), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const i = this.getAttribute("value");
      try {
        this.value = JSON.parse(i);
      } catch {
        this.value = i.split(",").map((r) => r.trim()).filter(Boolean);
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this._value.length === 0 && this._renderSelectedItems(), this.hasAttribute("disabled") && this.disabledCallback(!0), this._toggleInput && this._hideInputControls(), this._allowInitialCapture = !1, this._initialCaptured || (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0);
  }
  disconnectedCallback() {
    this.inputElement && (this.inputElement.removeEventListener("input", this._handleInput), this.inputElement.removeEventListener("keydown", this._handleKeyDown), this.inputElement.removeEventListener("focus", this._handleFocus), this.inputElement.removeEventListener("blur", this._handleBlur)), this.optionsListElement && (this.optionsListElement.removeEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.removeEventListener("click", this._handleOptionClick)), this.createNewButton && this.createNewButton.removeEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer && this.selectedItemsContainer.removeEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.removeEventListener("click", this._handleToggleClick), this.externalToggleButton && this.externalToggleButton.removeEventListener("click", this._handleToggleClick), clearTimeout(this._blurTimeout), this._remoteFetchTimeout && (clearTimeout(this._remoteFetchTimeout), this._remoteFetchTimeout = null), this._cancelRemoteFetch();
  }
  static get observedAttributes() {
    return [
      "disabled",
      "name",
      "value",
      "placeholder",
      "show-create-button",
      "data-endpoint",
      "data-result-key",
      "data-minchars",
      "data-limit",
      "data-toggle-label"
    ];
  }
  attributeChangedCallback(e, i, n) {
    if (i !== n)
      if (e === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (e === "name" && this.hiddenSelect) this.hiddenSelect.name = n;
      else if (e === "value" && this.inputElement)
        try {
          this.value = JSON.parse(n);
        } catch {
          this.value = n.split(",").map((o) => o.trim()).filter(Boolean);
        }
      else e === "placeholder" ? this.placeholder = n : e === "show-create-button" ? this.showCreateButton = n : e === "data-endpoint" ? this._remoteEndpoint = n || null : e === "data-result-key" ? this._remoteResultKey = n || "items" : e === "data-minchars" ? this._remoteMinChars = this._parsePositiveInt(n, en) : e === "data-limit" ? this._remoteLimit = this._parsePositiveInt(n, nn) : e === "data-toggle-label" && (this._toggleLabel = n || "", this._toggleInput = this._toggleLabel !== "");
  }
  formAssociatedCallback(e) {
  }
  formDisabledCallback(e) {
    this.disabledCallback(e);
  }
  formResetCallback() {
    this.value = [], this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._updateRootElementStateClasses(), this._renderSelectedItems(), this._toggleInput && this._hideInputControls();
  }
  formStateRestoreCallback(e, i) {
    this.value = Array.isArray(e) ? e : [], this._updateRootElementStateClasses();
  }
  captureInitialSelection() {
    this._initialValue = [...this._value], this._initialOrder = [...this._value], this._removedIds.clear(), this._initialCaptured = !0, this._renderSelectedItems();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((e) => {
      const i = document.createElement("option");
      i.value = e;
      const n = this._getItemById(e);
      i.textContent = n ? n.name : e, i.selected = !0, this.hiddenSelect.appendChild(i);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  disabledCallback(e) {
    this.inputElement && (this.inputElement.disabled = e), this.createNewButton && (this.createNewButton.disabled = e), this.toggleAttribute("disabled", e), this.querySelectorAll(`.${Zs}`).forEach((i) => i.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), e && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(dc, this._value.length === 0), this.classList.toggle(uc, this._value.length > 0), this.classList.toggle(mc, this._isOptionsListVisible);
  }
  _render() {
    const e = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e);
    const i = this.getAttribute("data-toggle-label") || "", n = i !== "", r = n ? "hidden" : "";
    this.innerHTML = `
                    <style>
                        .${Zi} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${ec} relative">
                        <div class="${oc} flex flex-wrap items-center gap-2">
                            <div class="${Qs} flex flex-wrap items-center gap-1 min-h-[30px]" aria-live="polite" tabindex="-1"></div>
                            ${n ? `<button type="button" class="${rr}">${i}</button>` : ""}
                            <div class="${tr} flex items-center gap-2 ${r}">
                                <div class="${er} relative rounded-md flex items-center flex-grow">
                                    <input type="text"
                                           class="${nr} w-full outline-none bg-transparent"
                                           placeholder="${this.placeholder}"
                                           aria-autocomplete="list"
                                           aria-expanded="${this._isOptionsListVisible}"
                                           aria-controls="options-list-${e}"
                                           autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                                </div>
                                <button type="button" class="${sr} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                            </div>
                        </div>
                        <ul id="options-list-${e}" role="listbox" class="${or} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${e}" class="${Zi}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(e) {
    const i = this._getItemById(e);
    if (!i) return null;
    const r = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, o = r.querySelector('[data-ref="textEl"]'), a = r.querySelector('[data-ref="detailEl"]'), c = r.querySelector('[data-ref="editLink"]'), h = r.querySelector('[data-ref="deleteBtn"]');
    o.textContent = this._normalizeText(i.name);
    const d = this._normalizeText(i.additional_data);
    d ? (a.textContent = `(${d})`, a.classList.remove("hidden")) : (a.textContent = "", a.classList.add("hidden"));
    const m = this._removedIds.has(e);
    if (!this._initialValue.includes(e)) {
      const f = document.createElement("span");
      f.className = "ml-1 text-xs text-gray-600", f.textContent = "(Neu)", o.appendChild(f);
    }
    return m && (r.classList.add("bg-red-100"), r.style.position = "relative"), c && (this._editBase && !m ? (c.href = `${this._editBase}${e}${this._editSuffix}`, c.target = "_blank", c.rel = "noreferrer", c.classList.remove("hidden")) : (c.classList.add("hidden"), c.removeAttribute("href"), c.removeAttribute("target"), c.removeAttribute("rel"))), h.setAttribute("aria-label", m ? `Undo remove ${i.name}` : `Remove ${i.name}`), h.dataset.id = e, h.disabled = this.hasAttribute("disabled"), h.innerHTML = m ? '<span class="text-xs inline-flex items-center"><i class="ri-arrow-go-back-line"></i></span>' : "&times;", h.addEventListener("click", (f) => {
      f.stopPropagation(), this._handleDeleteSelectedItem(e);
    }), r;
  }
  _renderSelectedItems() {
    if (!this.selectedItemsContainer) return;
    this.selectedItemsContainer.innerHTML = "";
    const e = this._initialOrder.filter((n) => this._removedIds.has(n) && !this._value.includes(n)), i = [...this._value, ...e];
    if (i.length === 0) {
      const n = this.getAttribute("data-empty-text") || "Keine Auswahl...", r = this._inputCollapsed ? "" : "hidden";
      this.selectedItemsContainer.innerHTML = `<span class="${tn} ${r}">${n}</span>`;
    } else
      i.forEach((n) => {
        const r = this._createSelectedItemElement(n);
        r && this.selectedItemsContainer.appendChild(r);
      });
    this._updateRootElementStateClasses();
  }
  _createOptionElement(e, i) {
    const r = this.optionTemplate.content.cloneNode(!0).firstElementChild, o = r.querySelector('[data-ref="nameEl"]'), a = r.querySelector('[data-ref="detailEl"]');
    o.textContent = this._normalizeText(e.name);
    const c = this._normalizeText(e.additional_data);
    a.textContent = c ? `(${c})` : "", r.dataset.id = e.id, r.setAttribute("aria-selected", String(i === this._highlightedIndex));
    const h = `option-${this.id || "mss"}-${e.id}`;
    return r.id = h, i === this._highlightedIndex && (r.classList.add(ar), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", h)), r;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this._filteredOptions.forEach((i, n) => {
          const r = this._createOptionElement(i, n);
          this.optionsListElement.appendChild(r);
        });
        const e = this.optionsListElement.querySelector(`.${ar}`);
        e && (e.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", e.id));
      }
      this._updateRootElementStateClasses();
    }
  }
  _handleSelectedItemsContainerClick(e) {
    e.target === this.selectedItemsContainer && this.inputElement && !this.inputElement.disabled && this.inputElement.focus();
  }
  _handleCreateNewButtonClick() {
    if (this.hasAttribute("disabled") || !this.showCreateButton) return;
    const e = this.inputElement ? this.inputElement.value.trim() : "";
    this.dispatchEvent(
      new CustomEvent("createnew", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _handleInput(e) {
    const i = e.target.value;
    if (this._remoteEndpoint) {
      this._handleRemoteInput(i);
      return;
    }
    if (i.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const n = i.toLowerCase();
      this._filteredOptions = this._options.filter((r) => {
        if (this._value.includes(r.id)) return !1;
        const a = this._normalizeText(r.name).toLowerCase().includes(n), c = this._normalizeText(r.additional_data), h = c && c.toLowerCase().includes(n);
        return a || h;
      }), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(e) {
    if (!this.inputElement.disabled) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        e.key === "Enter" && this.inputElement.value.length > 0 && e.preventDefault(), e.key === "Escape" && this._hideOptionsList(), (e.key === "ArrowDown" || e.key === "ArrowUp") && this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement });
        return;
      }
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          e.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
          e.stopPropagation(), e.preventDefault(), this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] && this._selectItem(this._filteredOptions[this._highlightedIndex].id);
          break;
        case "Escape":
          e.preventDefault(), this._hideOptionsList(), this._toggleInput && this._hideInputControls();
          break;
        case "Tab":
          this._hideOptionsList();
          break;
      }
    }
  }
  _hideOptionsList() {
    this._isOptionsListVisible = !1, this._highlightedIndex = -1, this.optionsListElement && this._renderOptionsList();
  }
  _handleFocus() {
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(ir), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(ir), this._blurTimeout = setTimeout(() => {
      this.contains(document.activeElement) || (this._hideOptionsList(), this._toggleInput && (!this.inputElement || this.inputElement.value.trim() === "") && this._hideInputControls());
    }, 150);
  }
  _handleOptionMouseDown(e) {
    e.preventDefault();
  }
  _handleOptionClick(e) {
    const i = e.target.closest("li[data-id]");
    i && i.dataset.id && this._selectItem(i.dataset.id);
  }
  _selectItem(e) {
    e && !this._value.includes(e) && (this.value = [...this._value, e]), this.inputElement && (this.inputElement.value = ""), this._filteredOptions = [], this._hideOptionsList(), this._toggleInput ? this._hideInputControls() : this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleDeleteSelectedItem(e) {
    if (this._removedIds.has(e)) {
      this._removedIds.delete(e), this._value.includes(e) ? this._renderSelectedItems() : this.value = [...this._value, e];
      return;
    }
    if (this._initialValue.includes(e)) {
      this._removedIds.add(e), this.value = this._value.filter((i) => i !== e);
      return;
    }
    this.value = this._value.filter((i) => i !== e), this.inputElement && this.inputElement.value && this._handleInput({ target: this.inputElement }), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleToggleClick(e) {
    e.preventDefault(), this._showInputControls();
  }
  _showInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.remove("hidden"), this.toggleButton && this.toggleButton.classList.add("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const e = this.selectedItemsContainer.querySelector(`.${tn}`);
        e && e.classList.add("hidden");
      }
      this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus(), this._inputCollapsed = !1;
    }
  }
  _hideInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.add("hidden"), this.toggleButton && this.toggleButton.classList.remove("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const e = this.selectedItemsContainer.querySelector(`.${tn}`);
        e && e.classList.remove("hidden");
      }
      this._hideOptionsList(), this._inputCollapsed = !0;
    }
  }
  _parsePositiveInt(e, i) {
    if (!e) return i;
    const n = parseInt(e, 10);
    return Number.isNaN(n) || n <= 0 ? i : n;
  }
  _handleRemoteInput(e) {
    if (this._remoteFetchTimeout && clearTimeout(this._remoteFetchTimeout), e.length < this._remoteMinChars) {
      this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
      return;
    }
    this._remoteFetchTimeout = setTimeout(() => {
      this._fetchRemoteOptions(e);
    }, hc);
  }
  _cancelRemoteFetch() {
    this._remoteFetchController && (this._remoteFetchController.abort(), this._remoteFetchController = null);
  }
  async _fetchRemoteOptions(e) {
    if (!this._remoteEndpoint) return;
    this._cancelRemoteFetch(), this.classList.add(lr);
    const i = new AbortController();
    this._remoteFetchController = i;
    try {
      const n = new URL(this._remoteEndpoint, window.location.origin);
      n.searchParams.set("q", e), this._remoteLimit && n.searchParams.set("limit", String(this._remoteLimit));
      const r = await fetch(n.toString(), {
        headers: { Accept: "application/json" },
        signal: i.signal,
        credentials: "same-origin"
      });
      if (!r.ok)
        throw new Error(`Remote fetch failed with status ${r.status}`);
      const o = await r.json();
      if (i.signal.aborted)
        return;
      const a = this._extractRemoteOptions(o);
      this._applyRemoteResults(a);
    } catch (n) {
      if (i.signal.aborted)
        return;
      console.error("MultiSelectSimple remote fetch error:", n), this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
    } finally {
      this._remoteFetchController === i && (this._remoteFetchController = null), this.classList.remove(lr);
    }
  }
  _extractRemoteOptions(e) {
    if (!e) return [];
    let i = [];
    return Array.isArray(e) ? i = e : this._remoteResultKey && Array.isArray(e[this._remoteResultKey]) ? i = e[this._remoteResultKey] : Array.isArray(e.items) && (i = e.items), i.map((n) => {
      if (!n) return null;
      const r = n.id ?? n.ID ?? n.value ?? "", o = n.name ?? n.title ?? n.label ?? "", a = n.detail ?? n.additional_data ?? n.annotation ?? "", c = this._normalizeText(o), h = this._normalizeText(a);
      return !r || !c ? null : {
        id: String(r),
        name: c,
        additional_data: h
      };
    }).filter(Boolean);
  }
  _applyRemoteResults(e) {
    const i = new Set(this._value), n = /* @__PURE__ */ new Map();
    this._options.forEach((r) => {
      r != null && r.id && n.set(r.id, r);
    }), e.forEach((r) => {
      r != null && r.id && n.set(r.id, r);
    }), this._options = Array.from(n.values()), this._filteredOptions = e.filter((r) => r && !i.has(r.id)), this._isOptionsListVisible = this._filteredOptions.length > 0, this._highlightedIndex = this._isOptionsListVisible ? 0 : -1, this._renderOptionsList();
  }
  _normalizeText(e) {
    if (e == null)
      return "";
    let i = String(e).trim();
    if (!i)
      return "";
    const n = i[0], r = i[i.length - 1];
    return (n === '"' && r === '"' || n === "'" && r === "'") && (i = i.slice(1, -1).trim(), !i) ? "" : i;
  }
}
ee(ho, "formAssociated", !0);
const gc = "rbi-button", pc = "rbi-icon";
class fc extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const t = `
              <button type="button" class="${gc} cursor-pointer disabled:cursor-default" aria-label="Reset field">
								<tool-tip position="right">
									<div class="data-tip">Feld zurücksetzen</div>
									<span class="${pc} ri-arrow-go-back-fill"></span>
								</tool-tip>
              </button>
            `;
    this.innerHTML = t, this.button = this.querySelector("button"), this.button ? this.button.addEventListener("click", this.handleReset) : console.error("ResetButtonIndividual: Button element not found after setting innerHTML."), this.updateControlledElements(), this.updateButtonAriaLabel();
  }
  disconnectedCallback() {
    this.button && this.button.removeEventListener("click", this.handleReset), this._controlledElements.forEach((t) => {
      t.removeEventListener("input", this.handleInputChange), t.removeEventListener("change", this.handleInputChange);
    });
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "controls" && this.updateControlledElements(), (t === "controls" || t === "button-aria-label") && this.updateButtonAriaLabel());
  }
  updateControlledElements() {
    this._controlledElements.forEach((i) => {
      i.removeEventListener("input", this.handleInputChange), i.removeEventListener("change", this.handleInputChange);
    }), this._controlledElements = [], this.lastOverallModifiedState = null;
    const t = (this.getAttribute("controls") || "").split(",").map((i) => i.trim()).filter((i) => i);
    if (!t.length && this.button) {
      this.button.disabled = !0, this.button.setAttribute("aria-disabled", "true"), this.checkIfModified();
      return;
    }
    const e = [];
    t.forEach((i) => {
      const n = document.getElementById(i);
      n ? (e.push(n), this.storeInitialState(n), n.addEventListener("input", this.handleInputChange), n.addEventListener("change", this.handleInputChange)) : console.warn(`ResetButtonIndividual: Element with ID "${i}" not found.`);
    }), this._controlledElements = e, this.button && (this.button.disabled = this._controlledElements.length === 0, this.button.setAttribute("aria-controls", this._controlledElements.map((i) => i.id).join(" ")), this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.checkIfModified();
  }
  storeInitialState(t) {
    if (this.initialStates.has(t.id))
      return;
    let e;
    switch (t.type) {
      case "checkbox":
      case "radio":
        e = { checked: t.checked };
        break;
      case "select-multiple":
        e = {
          selectedOptions: Array.from(t.options).filter((i) => i.selected).map((i) => i.value)
        };
        break;
      case "select-one":
      default:
        e = { value: t.value };
        break;
    }
    this.initialStates.set(t.id, e);
  }
  resetElement(t) {
    const e = this.initialStates.get(t.id);
    if (e) {
      switch (t.type) {
        case "checkbox":
        case "radio":
          t.checked = e.checked;
          break;
        case "select-multiple":
          Array.from(t.options).forEach((i) => {
            i.selected = e.selectedOptions.includes(i.value);
          });
          break;
        case "select-one":
        default:
          t.value = e.value;
          break;
      }
      t.dispatchEvent(new Event("input", { bubbles: !0, cancelable: !0 })), t.dispatchEvent(new Event("change", { bubbles: !0, cancelable: !0 }));
    }
  }
  handleReset() {
    this._controlledElements.forEach((t) => {
      this.resetElement(t);
    }), this.checkIfModified();
  }
  handleInputChange(t) {
    this._controlledElements.includes(t.target) && this.checkIfModified();
  }
  // Internal helper to check a single element
  isElementModified(t) {
    const e = this.initialStates.get(t.id);
    if (!e) return !1;
    switch (t.type) {
      case "checkbox":
      case "radio":
        return t.checked !== e.checked;
      case "select-multiple":
        const i = Array.from(t.options).filter((r) => r.selected).map((r) => r.value), n = e.selectedOptions;
        return i.length !== n.length || i.some((r) => !n.includes(r)) || n.some((r) => !i.includes(r));
      case "select-one":
      default:
        return t.value !== e.value;
    }
  }
  // Public method to check overall modification state
  isCurrentlyModified() {
    if (this._controlledElements.length === 0)
      return !1;
    for (const t of this._controlledElements)
      if (this.isElementModified(t))
        return !0;
    return !1;
  }
  checkIfModified() {
    const t = this.isCurrentlyModified();
    this._controlledElements.forEach((i) => {
      this.isElementModified(i) ? i.classList.add("modified-element") : i.classList.remove("modified-element");
    });
    const e = this.getAttribute("wrapper-class");
    if (e) {
      const i = this.closest(`.${e}`);
      if (i) {
        const n = this.getAttribute("modified-class-suffix") || "modified", r = `${e}-${n}`;
        t ? i.classList.add(r) : i.classList.remove(r);
      }
    }
    if (this.button && (this.button.disabled = !t || this._controlledElements.length === 0, this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.lastOverallModifiedState !== t) {
      const i = new CustomEvent("rbichange", {
        bubbles: !0,
        composed: !0,
        detail: {
          modified: t,
          controlledElementIds: this._controlledElements.map((n) => n.id),
          instance: this
        }
      });
      this.dispatchEvent(i), this.lastOverallModifiedState = t;
    }
  }
  updateButtonAriaLabel() {
    if (!this.button) return;
    let t = this.getAttribute("button-aria-label");
    if (!t) {
      const e = this._controlledElements.map((i) => i.id);
      if (e.length === 1 && this._controlledElements[0]) {
        const i = this._controlledElements[0], n = document.querySelector(`label[for="${i.id}"]`);
        let r = i.name || i.id;
        n && n.textContent ? r = n.textContent.trim().replace(/[:*]$/, "").trim() : i.getAttribute("aria-label") && (r = i.getAttribute("aria-label")), t = `Reset ${r}`;
      } else e.length > 1 ? t = "Reset selected fields" : t = "Reset field";
    }
    this.button.setAttribute("aria-label", t);
  }
}
const it = "hidden", cr = "dm-stay", Ve = "dm-title", hr = "dm-menu-button", bc = "dm-target", vc = "data-dm-target", dr = "dm-menu", ur = "dm-menu-item", _c = "dm-close-button";
var ei, uo;
class Ac extends HTMLElement {
  constructor() {
    super();
    ie(this, ei);
    Be(this, ei, uo).call(this), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  connectedCallback() {
    if (this._target = document.getElementById(this.getAttribute(bc)), this._target || (this._target = this), this._cildren = Array.from(this.children).filter((e) => e.nodeType === Node.ELEMENT_NODE && !e.classList.contains(hr)).map((e) => ({
      node: e,
      target: () => {
        const i = e.getAttribute(vc);
        return i ? document.getElementById(i) || this._target : this._target;
      },
      stay: () => e.hasAttribute(cr) && e.getAttribute(cr) == "true",
      hidden: () => e.classList.contains(it),
      name: () => {
        const i = e.querySelector("label");
        return i ? i.innerHTML : e.hasAttribute(Ve) ? e.getAttribute(Ve) : "";
      },
      nameText: () => {
        const i = e.querySelector("label");
        return i ? i.textContent.trim() : e.hasAttribute(Ve) ? e.getAttribute(Ve) : "";
      }
    })), this._button = this.querySelector(`.${hr}`), !this._button) {
      console.error("DivManagerMenu needs a button element.");
      return;
    }
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    for (const e of this._cildren)
      this.removeChild(e.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const e of this._cildren)
      e.node.querySelectorAll(`.${_c}`).forEach((n) => {
        n.addEventListener("click", (r) => {
          this.hideDiv(r, e.node);
        });
      });
    this.renderIntoTarget(), this.refresh(), this._observer = new MutationObserver(() => {
      this.refresh();
    }), this._cildren.forEach((e) => {
      this._observer.observe(e.node, { attributes: !0, attributeFilter: ["class"] });
    });
  }
  disconnectedCallback() {
    this._observer && this._observer.disconnect(), document.removeEventListener("click", this.boundHandleClickOutside);
  }
  refresh() {
    this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  _toggleMenu(e) {
    e.preventDefault(), e.stopPropagation();
    const i = this._cildren.filter((n) => n.hidden());
    if (i.length === 1) {
      const n = this._cildren.indexOf(i[0]);
      this.showDiv(e, n);
      return;
    }
    if (i.length === 0) {
      this.hideMenu();
      return;
    }
    this.renderMenu(), this._menu.classList.contains(it) ? (this._menu.classList.remove(it), document.addEventListener("click", this.boundHandleClickOutside)) : (this._menu.classList.add(it), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  handleClickOutside(e) {
    this._menu && !this._menu.contains(e.target) && !this._button.contains(e.target) && this.hideMenu();
  }
  hideMenu() {
    this._menu && (this._menu.classList.add(it), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  renderButton() {
    if (!this._button)
      return;
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    const e = this._cildren.filter((i) => i.hidden());
    if (e.length === 0) {
      this._button.classList.add(it), this._button.parentElement && this._button.parentElement.removeChild(this._button), this._menu = null, this.hideMenu();
      return;
    }
    if (this._button.parentElement || this.appendChild(this._button), this._button.classList.remove(it), e.length === 1) {
      const i = this._button.querySelector("i"), n = i ? i.outerHTML : '<i class="ri-add-line"></i>';
      this._button.innerHTML = `${n}
${e[0].nameText()} hinzufügen`, this._menu = null, this.hideMenu();
    } else
      this._button.innerHTML = this._originalButtonText, this._menu = null;
  }
  hideDiv(e, i) {
    if (e && (e.preventDefault(), e.stopPropagation()), !i || !(i instanceof HTMLElement)) {
      console.error("DivManagerMenu: Invalid node provided.");
      return;
    }
    const n = this._cildren.find((o) => o.node === i);
    if (!n) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    n.node.classList.add(it);
    const r = n.target();
    r && r.contains(n.node) && r.removeChild(n.node), this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  showDiv(e, i) {
    if (e && (e.preventDefault(), e.stopPropagation()), i < 0 || i >= this._cildren.length) {
      console.error("DivManagerMenu: Invalid index.");
      return;
    }
    const n = this._cildren[i];
    if (n.node.classList.remove(it), this.insertChildInOrder(n), this.renderMenu(), this.renderButton(), this.updateTargetVisibility(), typeof window.TextareaAutoResize == "function") {
      const r = n.node.querySelectorAll("textarea");
      r.length > 0 && setTimeout(() => {
        r.forEach((o) => {
          o.dataset.dmResizeBound !== "true" && (o.dataset.dmResizeBound = "true", o.addEventListener("input", () => {
            window.TextareaAutoResize(o);
          })), window.TextareaAutoResize(o);
        });
      }, 10);
    }
  }
  renderMenu() {
    const e = this._cildren.filter((n) => n.hidden());
    if (e.length <= 1) {
      this.hideMenu();
      return;
    }
    (!this._menu || !this._button.contains(this._menu)) && (this._button.insertAdjacentHTML("beforeend", `<div class="${dr} absolute hidden"></div>`), this._menu = this._button.querySelector(`.${dr}`)), this._menu.innerHTML = `${e.map((n, r) => `
				<button type="button" class="${ur}" dm-itemno="${this._cildren.indexOf(n)}">
					${n.name()}
				</button>`).join("")}`, this._menu.querySelectorAll(`.${ur}`).forEach((n) => {
      n.addEventListener("click", (r) => {
        this.showDiv(r, parseInt(n.getAttribute("dm-itemno"))), this.hideMenu(), this.renderButton();
      });
    });
  }
  renderIntoTarget() {
    this._cildren.forEach((e) => {
      e.hidden() || this.insertChildInOrder(e);
    }), this.updateTargetVisibility();
  }
  insertChildInOrder(e) {
    const i = e.target(), n = this._cildren.indexOf(e), r = this._cildren.slice(n + 1).filter((o) => o.target() === i).map((o) => o.node).find((o) => i && i.contains(o));
    i && (r ? i.insertBefore(e.node, r) : i.appendChild(e.node));
  }
  updateTargetVisibility() {
    new Set(
      this._cildren.map((i) => i.target()).filter((i) => i && i !== this)
    ).forEach((i) => {
      const n = Array.from(i.children).some(
        (r) => !r.classList.contains(it)
      );
      i.classList.toggle(it, !n);
    });
  }
}
ei = new WeakSet(), uo = function() {
  this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null, this._originalButtonText = null;
};
const nt = "items-row", yc = "items-list", Ec = "items-template", Sc = "items-add-button", xc = "items-cancel-button", We = "items-remove-button", Cc = "items-edit-button", Lc = "items-close-button", Tc = "items-summary", wc = "items-edit-panel", sn = "items_removed[]", he = "data-items-removed";
class kc extends HTMLElement {
  constructor() {
    super(), this._list = null, this._template = null, this._addButton = null, this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`, this._handleAdd = this._onAddClick.bind(this);
  }
  connectedCallback() {
    if (this._list = this.querySelector(`.${yc}`), this._template = this.querySelector(`template.${Ec}`), this._addButton = this.querySelector(`.${Sc}`), !this._list || !this._template || !this._addButton) {
      console.error("ItemsEditor: Missing list, template, or add button.");
      return;
    }
    this._addButton.addEventListener("click", this._handleAdd), this._captureAllOriginals(), this._wireCancelButtons(), this._wireRemoveButtons(), this._wireEditButtons(), this._refreshRowIds(), this._syncAllSummaries();
  }
  disconnectedCallback() {
    this._addButton && this._addButton.removeEventListener("click", this._handleAdd);
  }
  _onAddClick(t) {
    t.preventDefault(), this.addItem();
  }
  addItem() {
    const t = this._template.content.cloneNode(!0), e = t.querySelector(`.${nt}`);
    if (!e) {
      console.error("ItemsEditor: Template is missing a row element.");
      return;
    }
    this._list.appendChild(t), this._captureOriginalValues(e), this._wireCancelButtons(e), this._wireRemoveButtons(e), this._wireEditButtons(e), this._assignRowFieldIds(e, this._rowIndex(e)), this._wireSummarySync(e), this._syncSummary(e), this._setRowMode(e, "edit");
  }
  removeItem(t) {
    const e = t.closest(`.${nt}`);
    if (!e)
      return;
    const i = e.getAttribute(he) === "true";
    this._setRowRemoved(e, !i);
  }
  _wireRemoveButtons(t = this) {
    t.querySelectorAll(`.${We}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault(), this.removeItem(e);
      }), e.addEventListener("mouseenter", () => {
        const i = e.closest(`.${nt}`);
        if (!i || i.getAttribute(he) !== "true")
          return;
        const n = e.querySelector("[data-delete-label]");
        n && (n.textContent = n.getAttribute("data-delete-hover") || "Rückgängig");
        const r = e.querySelector("i");
        r && (r.classList.remove("hidden"), r.classList.add("ri-arrow-go-back-line"), r.classList.remove("ri-delete-bin-line"));
      }), e.addEventListener("mouseleave", () => {
        const i = e.closest(`.${nt}`), n = e.querySelector("[data-delete-label]");
        if (!n)
          return;
        i && i.getAttribute(he) === "true" ? n.textContent = n.getAttribute("data-delete-active") || "Wird entfernt" : n.textContent = n.getAttribute("data-delete-default") || "Entfernen";
        const r = e.querySelector("i");
        r && (i && i.getAttribute(he) === "true" ? (r.classList.add("hidden"), r.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (r.classList.remove("hidden"), r.classList.add("ri-delete-bin-line"), r.classList.remove("ri-arrow-go-back-line")));
      }));
    });
  }
  _wireCancelButtons(t = this) {
    t.querySelectorAll(`.${xc}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const n = e.closest(`.${nt}`);
        n && this._cancelEdit(n);
      }));
    });
  }
  _wireEditButtons(t = this) {
    t.querySelectorAll(`.${Cc}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const n = e.closest(`.${nt}`);
        n && this._setRowMode(n, "edit");
      }));
    }), t.querySelectorAll(`.${Lc}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const n = e.closest(`.${nt}`);
        n && this._setRowMode(n, "summary");
      }));
    });
  }
  _cancelEdit(t) {
    const e = t.querySelector('input[name="items_id[]"]');
    if (!(e ? e.value.trim() : "")) {
      t.remove(), this._refreshRowIds();
      return;
    }
    this._resetToOriginal(t), this._setRowMode(t, "summary");
  }
  _setRowRemoved(t, e) {
    t.setAttribute(he, e ? "true" : "false"), t.classList.toggle("bg-red-50", e);
    const i = t.querySelector(".items-edit-button");
    i && (e ? i.classList.add("hidden") : i.classList.remove("hidden")), t.querySelectorAll("[data-delete-label]").forEach((o) => {
      const a = o.closest(`.${We}`), c = a && a.matches(":hover");
      let h;
      e && c ? h = o.getAttribute("data-delete-hover") || "Rückgängig" : e ? h = o.getAttribute("data-delete-active") || "Wird entfernt" : h = o.getAttribute("data-delete-default") || "Entfernen", o.textContent = h;
    }), t.querySelectorAll(`.${We} i`).forEach((o) => {
      const a = o.closest(`.${We}`), c = a && a.matches(":hover");
      e ? c ? (o.classList.remove("hidden"), o.classList.add("ri-arrow-go-back-line"), o.classList.remove("ri-delete-bin-line")) : (o.classList.add("hidden"), o.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (o.classList.remove("hidden"), o.classList.add("ri-delete-bin-line"), o.classList.remove("ri-arrow-go-back-line"));
    });
    const n = t.querySelector('input[name="items_id[]"]'), r = n ? n.value.trim() : "";
    r && (e ? this._ensureRemovalInput(r) : this._removeRemovalInput(r)), t.querySelectorAll("[data-field]").forEach((o) => {
      o.disabled = e;
    });
  }
  _setRowMode(t, e) {
    const i = t.querySelector(`.${Tc}`), n = t.querySelector(`.${wc}`);
    !i || !n || (e === "edit" ? (i.classList.add("hidden"), n.classList.remove("hidden")) : (i.classList.remove("hidden"), n.classList.add("hidden"), this._syncSummary(t)));
  }
  _captureAllOriginals() {
    this.querySelectorAll(`.${nt}`).forEach((t) => {
      this._captureOriginalValues(t);
    });
  }
  _captureOriginalValues(t) {
    t.querySelectorAll("[data-field]").forEach((e) => {
      e.dataset.originalValue === void 0 && (e.dataset.originalValue = e.value ?? "");
    });
  }
  _resetToOriginal(t) {
    t.querySelectorAll("[data-field]").forEach((e) => {
      e.dataset.originalValue !== void 0 && (e.value = e.dataset.originalValue);
    }), this._syncSummary(t);
  }
  _refreshRowIds() {
    Array.from(this.querySelectorAll(`.${nt}`)).forEach((e, i) => {
      this._assignRowFieldIds(e, i);
    });
  }
  _rowIndex(t) {
    return Array.from(this.querySelectorAll(`.${nt}`)).indexOf(t);
  }
  _assignRowFieldIds(t, e) {
    e < 0 || t.querySelectorAll("[data-field-label]").forEach((i) => {
      const n = i.getAttribute("data-field-label");
      if (!n)
        return;
      const r = t.querySelector(`[data-field="${n}"]`);
      if (!r)
        return;
      const o = `${this._idPrefix}-${e}-${n}`;
      r.id = o, i.setAttribute("for", o);
    });
  }
  _syncAllSummaries() {
    this.querySelectorAll(`.${nt}`).forEach((t) => {
      this._wireSummarySync(t), this._syncSummary(t), this._syncNewBadge(t);
    });
  }
  _wireSummarySync(t) {
    t.dataset.summaryBound !== "true" && (t.dataset.summaryBound = "true", t.querySelectorAll("[data-field]").forEach((e) => {
      e.addEventListener("input", () => this._syncSummary(t)), e.addEventListener("change", () => this._syncSummary(t));
    }));
  }
  _syncSummary(t) {
    t.querySelectorAll("[data-summary-field]").forEach((e) => {
      const i = e.getAttribute("data-summary-field");
      if (!i)
        return;
      const n = t.querySelector(`[data-field="${i}"]`);
      if (!n)
        return;
      const r = this._readFieldValue(n), o = e.getAttribute("data-summary-hide-empty") === "true" ? e.closest("[data-summary-container]") : null;
      r ? (this._setSummaryContent(e, r), e.classList.remove("text-gray-400"), o && o.classList.remove("hidden")) : (this._setSummaryContent(e, "—"), e.classList.add("text-gray-400"), o && o.classList.add("hidden"));
    }), this._syncNewBadge(t);
  }
  _syncNewBadge(t) {
    const e = t.querySelector('input[name="items_id[]"]'), i = e ? e.value.trim() : "";
    t.querySelectorAll("[data-new-badge]").forEach((n) => {
      n.classList.toggle("hidden", i !== "");
    });
  }
  _setSummaryContent(t, e) {
    const i = t.querySelector("[data-summary-link]");
    i ? e && e !== "—" ? (i.setAttribute("href", e), i.textContent = e) : (i.setAttribute("href", "#"), i.textContent = "—") : t.textContent = e || "—";
  }
  _readFieldValue(t) {
    if (t instanceof HTMLSelectElement) {
      if (t.multiple)
        return Array.from(t.selectedOptions).map((i) => i.textContent.trim()).filter(Boolean).join(", ");
      const e = t.selectedOptions[0];
      return e ? e.textContent.trim() : "";
    }
    return t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement ? t.value.trim() : "";
  }
  _ensureRemovalInput(t) {
    if (Array.from(this.querySelectorAll(`input[name="${sn}"]`)).some(
      (n) => n.value === t
    ))
      return;
    const i = document.createElement("input");
    i.type = "hidden", i.name = sn, i.value = t, this.appendChild(i);
  }
  _removeRemovalInput(t) {
    const e = Array.from(this.querySelectorAll(`input[name="${sn}"]`));
    for (const i of e)
      i.value === t && i.remove();
  }
}
const Ic = "ssr-wrapper", mr = "ssr-input", gr = "ssr-list", Rc = "ssr-option", Dc = "ssr-option-name", Oc = "ssr-option-detail", Mc = "ssr-option-bio", pr = "ssr-hidden-input", fr = "ssr-clear-button", rn = 1, on = 10, Bc = 250;
class Nc extends HTMLElement {
  constructor() {
    super(), this._endpoint = "", this._resultKey = "items", this._minChars = rn, this._limit = on, this._placeholder = "Search...", this._options = [], this._selected = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._listVisible = !1, this._boundHandleInput = this._handleInput.bind(this), this._boundHandleFocus = this._handleFocus.bind(this), this._boundHandleKeyDown = this._handleKeyDown.bind(this), this._boundHandleClear = this._handleClear.bind(this), this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }
  static get observedAttributes() {
    return ["data-endpoint", "data-result-key", "data-minchars", "data-limit", "placeholder", "name"];
  }
  connectedCallback() {
    this._render(), this._input = this.querySelector(`.${mr}`), this._list = this.querySelector(`.${gr}`), this._hiddenInput = this.querySelector(`.${pr}`), this._clearButton = this.querySelector(`.${fr}`), this._endpoint = this.getAttribute("data-endpoint") || "", this._resultKey = this.getAttribute("data-result-key") || "items", this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), rn), this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), on), this._placeholder = this.getAttribute("placeholder") || "Search...", this._input && (this._input.placeholder = this._placeholder, this._input.addEventListener("input", this._boundHandleInput), this._input.addEventListener("focus", this._boundHandleFocus), this._input.addEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.addEventListener("click", this._boundHandleClear), document.addEventListener("click", this._boundHandleClickOutside);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleClickOutside), this._input && (this._input.removeEventListener("input", this._boundHandleInput), this._input.removeEventListener("focus", this._boundHandleFocus), this._input.removeEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.removeEventListener("click", this._boundHandleClear);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-endpoint" && (this._endpoint = i || ""), t === "data-result-key" && (this._resultKey = i || "items"), t === "data-minchars" && (this._minChars = this._parsePositiveInt(i, rn)), t === "data-limit" && (this._limit = this._parsePositiveInt(i, on)), t === "placeholder" && (this._placeholder = i || "Search...", this._input && (this._input.placeholder = this._placeholder)), t === "name" && this._hiddenInput && (this._hiddenInput.name = i || ""));
  }
  _handleInput(t) {
    const e = t.target.value.trim();
    if (this._selected = null, this._highlightedIndex = -1, this._syncHiddenInput(), e.length < this._minChars) {
      this._options = [], this._renderOptions(), this._hideList();
      return;
    }
    this._debouncedFetch(e);
  }
  _handleFocus() {
    this._options.length > 0 && this._showList();
  }
  _handleKeyDown(t) {
    if (t.key === "Escape") {
      this._hideList();
      return;
    }
    if (t.key === "ArrowDown") {
      t.preventDefault(), this._moveHighlight(1);
      return;
    }
    if (t.key === "ArrowUp") {
      t.preventDefault(), this._moveHighlight(-1);
      return;
    }
    if (t.key === "Home") {
      t.preventDefault(), this._setHighlight(0);
      return;
    }
    if (t.key === "End") {
      t.preventDefault(), this._setHighlight(this._options.length - 1);
      return;
    }
    if (t.key === "Enter") {
      if (this._options.length === 0)
        return;
      t.preventDefault();
      const e = this._highlightedIndex >= 0 ? this._highlightedIndex : 0;
      this._selectOption(this._options[e]);
    }
  }
  _handleClear(t) {
    t.preventDefault(), this._selected = null, this._options = [], this._input && (this._input.value = ""), this._syncHiddenInput(), this._renderOptions(), this._hideList(), this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: null } }));
  }
  _handleClickOutside(t) {
    this.contains(t.target) || this._hideList();
  }
  _debouncedFetch(t) {
    this._fetchTimeout && clearTimeout(this._fetchTimeout), this._fetchTimeout = setTimeout(() => {
      this._fetchOptions(t);
    }, Bc);
  }
  async _fetchOptions(t) {
    if (!this._endpoint)
      return;
    this._fetchController && this._fetchController.abort(), this.dispatchEvent(new CustomEvent("ssrbeforefetch", { bubbles: !0 })), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), this._limit > 0 && e.searchParams.set("limit", String(this._limit));
    try {
      const i = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!i.ok)
        return;
      const n = await i.json();
      let o = (Array.isArray(n == null ? void 0 : n[this._resultKey]) ? n[this._resultKey] : []).filter((a) => a && a.id && a.name);
      if (this._excludeIds && Array.isArray(this._excludeIds)) {
        const a = new Set(this._excludeIds);
        o = o.filter((c) => !a.has(c.id));
      }
      this._options = o, this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._renderOptions(), this._options.length > 0 ? this._showList() : this._hideList();
    } catch (i) {
      if ((i == null ? void 0 : i.name) === "AbortError")
        return;
    }
  }
  _renderOptions() {
    this._list && (this._list.innerHTML = "", this._options.forEach((t) => {
      const e = document.createElement("button");
      e.type = "button", e.setAttribute("data-index", String(this._options.indexOf(t))), e.className = [
        Rc,
        "w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors"
      ].join(" ");
      const n = this._options.indexOf(t) === this._highlightedIndex;
      e.classList.toggle("bg-slate-100", n), e.classList.toggle("text-gray-900", n), e.setAttribute("aria-selected", n ? "true" : "false");
      const r = document.createElement("div");
      if (r.className = [Dc, "text-sm font-semibold text-gray-800"].join(" "), r.textContent = t.name, e.appendChild(r), t.detail) {
        const o = document.createElement("div");
        o.className = [Oc, "text-xs text-gray-600"].join(" "), o.textContent = t.detail, e.appendChild(o);
      }
      if (t.bio) {
        const o = document.createElement("div");
        o.className = [Mc, "text-xs text-gray-500"].join(" "), o.textContent = t.bio, e.appendChild(o);
      }
      e.addEventListener("click", () => {
        this._selectOption(t);
      }), this._list.appendChild(e);
    }));
  }
  _setHighlight(t) {
    if (this._options.length === 0) {
      this._highlightedIndex = -1;
      return;
    }
    const e = Math.max(0, Math.min(t, this._options.length - 1));
    this._highlightedIndex = e, this._renderOptions(), this._scrollHighlightedIntoView(), this._showList();
  }
  _moveHighlight(t) {
    if (this._options.length === 0) {
      this._highlightedIndex = -1;
      return;
    }
    const e = this._highlightedIndex >= 0 ? this._highlightedIndex : 0, i = Math.max(0, Math.min(e + t, this._options.length - 1));
    this._highlightedIndex = i, this._renderOptions(), this._scrollHighlightedIntoView(), this._showList();
  }
  _scrollHighlightedIntoView() {
    if (!this._list || this._highlightedIndex < 0)
      return;
    const t = this._list.querySelector(`[data-index="${this._highlightedIndex}"]`);
    t && t.scrollIntoView({ block: "nearest" });
  }
  _selectOption(t) {
    this._selected = t, this._input && (this._input.value = t.name || ""), this._syncHiddenInput(), this._hideList(), this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: t } })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  _syncHiddenInput() {
    var t;
    this._hiddenInput && (this._hiddenInput.value = ((t = this._selected) == null ? void 0 : t.id) || "");
  }
  _showList() {
    !this._list || this._listVisible || (this._list.classList.remove("hidden"), this._listVisible = !0);
  }
  _hideList() {
    !this._list || !this._listVisible || (this._list.classList.add("hidden"), this._listVisible = !1);
  }
  _parsePositiveInt(t, e) {
    const i = parseInt(t || "", 10);
    return Number.isNaN(i) || i <= 0 ? e : i;
  }
  _render() {
    const t = this.getAttribute("name") || "";
    this.innerHTML = `
			<div class="${Ic} relative">
				<div class="flex items-center gap-2">
					<input
						type="text"
						class="${mr} inputinput w-full"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						spellcheck="false"
						placeholder="${this._placeholder}"
					/>
					<button type="button" class="${fr} text-sm text-gray-600 hover:text-gray-900">
						<i class="ri-close-line"></i>
					</button>
				</div>
				<input type="hidden" class="${pr}" name="${t}" value="" />
				<div class="${gr} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
			</div>
		`;
  }
}
const Pc = "Bevorzugter Reihentitel";
class Fc extends HTMLElement {
  constructor() {
    super(), this._pendingAgent = null, this._form = null, this._saveButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null, this._saveEndpoint = "", this._deleteEndpoint = "", this._isSaving = !1, this._handleSaveClick = this._handleSaveClick.bind(this), this._handleResetClick = this._handleResetClick.bind(this), this._handleDeleteClick = this._handleDeleteClick.bind(this), this._handleDeleteConfirmClick = this._handleDeleteConfirmClick.bind(this), this._handleDeleteCancelClick = this._handleDeleteCancelClick.bind(this);
  }
  connectedCallback() {
    setTimeout(() => {
      this._initForm(), this._initPlaces(), this._initSaveHandling();
    }, 0);
  }
  disconnectedCallback() {
    this._teardownSaveHandling();
  }
  _initForm() {
    console.log("AlmanachEditPage: _initForm called");
    const t = this.querySelector("#changealmanachform");
    console.log("Form found:", !!t, "FormLoad exists:", typeof window.FormLoad == "function"), t && typeof window.FormLoad == "function" ? window.FormLoad(t) : console.error("Cannot initialize form - form or FormLoad missing");
  }
  _parseJSONAttr(t, e) {
    if (!t)
      return null;
    const i = t.getAttribute(e);
    if (!i)
      return null;
    try {
      return JSON.parse(i);
    } catch {
      return null;
    }
  }
  _initPlaces() {
    var i;
    const t = this.querySelector("#places");
    if (!t)
      return;
    const e = () => {
      const n = this._parseJSONAttr(t, "data-initial-options") || [], r = this._parseJSONAttr(t, "data-initial-values") || [];
      n.length > 0 && typeof t.setOptions == "function" && t.setOptions(n), r.length > 0 && (t.value = r, typeof t.captureInitialSelection == "function" && t.captureInitialSelection());
    };
    if (typeof t.setOptions == "function") {
      e();
      return;
    }
    typeof ((i = window.customElements) == null ? void 0 : i.whenDefined) == "function" && window.customElements.whenDefined("multi-select-simple").then(() => {
      requestAnimationFrame(() => e());
    });
  }
  _initSaveHandling() {
    this._teardownSaveHandling(), this._form = this.querySelector("#changealmanachform"), this._saveButton = this.querySelector("[data-role='almanach-save']"), this._resetButton = this.querySelector("[data-role='almanach-reset']"), this._deleteButton = this.querySelector("[data-role='almanach-delete']"), this._deleteDialog = this.querySelector("[data-role='almanach-delete-dialog']"), this._deleteConfirmButton = this.querySelector("[data-role='almanach-delete-confirm']"), this._deleteCancelButton = this.querySelector("[data-role='almanach-delete-cancel']"), this._statusEl = this.querySelector("#almanach-save-feedback"), !(!this._form || !this._saveButton) && (this._saveEndpoint = this._form.getAttribute("data-save-endpoint") || this._deriveSaveEndpoint(), this._deleteEndpoint = this._form.getAttribute("data-delete-endpoint") || "", this._saveButton.addEventListener("click", this._handleSaveClick), this._resetButton && this._resetButton.addEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.addEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.addEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.addEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.addEventListener("cancel", this._handleDeleteCancelClick));
  }
  _teardownSaveHandling() {
    this._saveButton && this._saveButton.removeEventListener("click", this._handleSaveClick), this._resetButton && this._resetButton.removeEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.removeEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.removeEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.removeEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.removeEventListener("cancel", this._handleDeleteCancelClick), this._saveButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null;
  }
  _deriveSaveEndpoint() {
    var e;
    return (e = window == null ? void 0 : window.location) != null && e.pathname ? `${window.location.pathname.endsWith("/") ? window.location.pathname.slice(0, -1) : window.location.pathname}/save` : "/almanach/save";
  }
  async _handleSaveClick(t) {
    if (t.preventDefault(), this._isSaving)
      return;
    this._clearStatus();
    let e;
    try {
      e = this._buildPayload();
    } catch (i) {
      this._showStatus(i instanceof Error ? i.message : String(i), "error");
      return;
    }
    this._setSavingState(!0);
    try {
      const i = await fetch(this._saveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(e)
      });
      let n = null;
      try {
        n = await i.clone().json();
      } catch {
        n = null;
      }
      if (!i.ok) {
        const r = (n == null ? void 0 : n.error) || `Speichern fehlgeschlagen (${i.status}).`;
        throw new Error(r);
      }
      if (n != null && n.redirect) {
        window.location.assign(n.redirect);
        return;
      }
      await this._reloadForm((n == null ? void 0 : n.message) || "Änderungen gespeichert."), this._clearStatus();
    } catch (i) {
      this._showStatus(i instanceof Error ? i.message : "Speichern fehlgeschlagen.", "error");
    } finally {
      this._setSavingState(!1);
    }
  }
  async _handleResetClick(t) {
    if (t.preventDefault(), !this._isSaving) {
      this._clearStatus();
      try {
        await this._reloadForm("");
      } catch (e) {
        this._showStatus(e instanceof Error ? e.message : "Formular konnte nicht aktualisiert werden.", "error");
      }
    }
  }
  async _handleDeleteClick(t) {
    t.preventDefault(), !this._isSaving && this._deleteDialog && typeof this._deleteDialog.showModal == "function" && this._deleteDialog.showModal();
  }
  _handleDeleteCancelClick(t) {
    t && t.preventDefault(), this._deleteDialog && this._deleteDialog.open && this._deleteDialog.close();
  }
  async _handleDeleteConfirmClick(t) {
    if (t.preventDefault(), !(!this._form || !this._deleteEndpoint || this._isSaving)) {
      this._deleteDialog && this._deleteDialog.open && this._deleteDialog.close(), this._clearStatus(), this._setSavingState(!0);
      try {
        const e = new FormData(this._form), i = {
          csrf_token: this._readValue(e, "csrf_token"),
          last_edited: this._readValue(e, "last_edited")
        }, n = await fetch(this._deleteEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(i)
        });
        let r = null;
        try {
          r = await n.clone().json();
        } catch {
          r = null;
        }
        if (!n.ok) {
          const a = (r == null ? void 0 : r.error) || `Löschen fehlgeschlagen (${n.status}).`;
          throw new Error(a);
        }
        const o = (r == null ? void 0 : r.redirect) || "/suche/baende";
        window.location.assign(o);
      } catch (e) {
        this._showStatus(e instanceof Error ? e.message : "Löschen fehlgeschlagen.", "error");
      } finally {
        this._setSavingState(!1);
      }
    }
  }
  _buildPayload() {
    if (!this._form)
      throw new Error("Formular konnte nicht gefunden werden.");
    const t = new FormData(this._form), e = {
      preferred_title: this._readValue(t, "preferred_title"),
      title: this._readValue(t, "title"),
      parallel_title: this._readValue(t, "paralleltitle"),
      subtitle: this._readValue(t, "subtitle"),
      variant_title: this._readValue(t, "varianttitle"),
      incipit: this._readValue(t, "incipit"),
      responsibility_statement: this._readValue(t, "responsibility_statement"),
      publication_statement: this._readValue(t, "publication_statement"),
      place_statement: this._readValue(t, "place_statement"),
      edition: this._readValue(t, "edition"),
      annotation: this._readValue(t, "annotation"),
      edit_comment: this._readValue(t, "edit_comment"),
      extent: this._readValue(t, "extent"),
      dimensions: this._readValue(t, "dimensions"),
      references: this._readValue(t, "refs"),
      status: this._readValue(t, "type")
    };
    if (!e.preferred_title)
      throw new Error("Kurztitel ist erforderlich.");
    const i = this._readValue(t, "year");
    if (i === "")
      throw new Error("Jahr muss angegeben werden (0 ist erlaubt).");
    const n = Number.parseInt(i, 10);
    if (Number.isNaN(n))
      throw new Error("Jahr ist ungültig.");
    e.year = n;
    const r = t.getAll("languages[]").map((N) => N.trim()).filter(Boolean), o = t.getAll("places[]").map((N) => N.trim()).filter(Boolean), { items: a, removedIds: c } = this._collectItems(t), {
      relations: h,
      deleted: d
    } = this._collectRelations(t, {
      prefix: "entries_series",
      targetField: "series"
    }), m = this._collectNewRelations("entries_series"), p = [...h, ...m].filter(
      (N) => N.type === Pc
    ).length;
    if (p === 0)
      throw new Error("Mindestens ein bevorzugter Reihentitel muss verknüpft sein.");
    if (p > 1)
      throw new Error("Es darf nur ein bevorzugter Reihentitel gesetzt sein.");
    const {
      relations: f,
      deleted: C
    } = this._collectRelations(t, {
      prefix: "entries_agents",
      targetField: "agent"
    }), L = this._collectNewRelations("entries_agents"), j = [...h, ...m].map((N) => N.target_id);
    if (j.filter((N, O) => j.indexOf(N) !== O).length > 0)
      throw new Error("Doppelte Reihenverknüpfungen sind nicht erlaubt.");
    return {
      csrf_token: this._readValue(t, "csrf_token"),
      last_edited: this._readValue(t, "last_edited"),
      entry: e,
      languages: r,
      places: o,
      items: a,
      deleted_item_ids: c,
      series_relations: h,
      new_series_relations: m,
      deleted_series_relation_ids: d,
      agent_relations: f,
      new_agent_relations: L,
      deleted_agent_relation_ids: C
    };
  }
  _collectItems(t) {
    const e = t.getAll("items_id[]").map((m) => m.trim()), i = t.getAll("items_owner[]"), n = t.getAll("items_identifier[]"), r = t.getAll("items_location[]"), o = t.getAll("items_media[]"), a = t.getAll("items_annotation[]"), c = t.getAll("items_uri[]"), h = new Set(
      t.getAll("items_removed[]").map((m) => m.trim()).filter(Boolean)
    ), d = [];
    for (let m = 0; m < e.length; m += 1) {
      const p = e[m] || "";
      if (p && h.has(p))
        continue;
      const f = (i[m] || "").trim(), C = (n[m] || "").trim(), L = (r[m] || "").trim(), U = (a[m] || "").trim(), j = (c[m] || "").trim(), q = (o[m] || "").trim();
      (p || f || C || L || U || j || q) && d.push({
        id: p,
        owner: f,
        identifier: C,
        location: L,
        annotation: U,
        uri: j,
        media: q ? [q] : []
      });
    }
    return {
      items: d,
      removedIds: Array.from(h)
    };
  }
  _collectRelations(t, { prefix: e, targetField: i }) {
    const n = [], r = [];
    for (const [o, a] of t.entries()) {
      if (!o.startsWith(`${e}_id[`))
        continue;
      const c = o.slice(o.indexOf("[") + 1, -1), h = `${e}_${i}[${c}]`, d = `${e}_type[${c}]`, m = `${e}_delete[${c}]`, p = `${e}_uncertain[${c}]`, f = (a || "").trim(), C = (t.get(h) || "").trim();
      if (!C || !f)
        continue;
      if (t.has(m)) {
        r.push(f);
        continue;
      }
      const L = (t.get(d) || "").trim();
      n.push({
        id: f,
        target_id: C,
        type: L,
        uncertain: t.has(p)
      });
    }
    return { relations: n, deleted: r };
  }
  _collectNewRelations(t) {
    const e = this.querySelector(`relations-editor[data-prefix='${t}']`);
    if (!e)
      return [];
    const i = e.querySelectorAll("[data-role='relation-add-row'] [data-rel-row]"), n = [];
    return i.forEach((r) => {
      const o = r.querySelector(`input[name='${t}_new_id']`), a = r.querySelector(`select[name='${t}_new_type']`), c = r.querySelector(`input[name='${t}_new_uncertain']`);
      if (!o)
        return;
      const h = o.value.trim();
      h && n.push({
        target_id: h,
        type: ((a == null ? void 0 : a.value) || "").trim(),
        uncertain: !!(c != null && c.checked)
      });
    }), n;
  }
  _readValue(t, e) {
    const i = t.get(e);
    return i ? String(i).trim() : "";
  }
  _setSavingState(t) {
    if (this._isSaving = t, !this._saveButton)
      return;
    this._saveButton.disabled = t;
    const e = this._saveButton.querySelector("span");
    e && (e.textContent = t ? "Speichern..." : "Speichern"), this._resetButton && (this._resetButton.disabled = t), this._deleteButton && (this._deleteButton.disabled = t);
  }
  _clearStatus() {
    this._statusEl && (this._statusEl.textContent = "", this._statusEl.classList.remove("text-red-700", "text-green-700"));
  }
  _showStatus(t, e) {
    this._statusEl && (this._clearStatus(), this._statusEl.textContent = t, e === "success" ? this._statusEl.classList.add("text-green-700") : e === "error" && this._statusEl.classList.add("text-red-700"));
  }
  async _reloadForm(t) {
    this._teardownSaveHandling();
    const e = new URL(window.location.href);
    t ? e.searchParams.set("saved_message", t) : e.searchParams.delete("saved_message");
    const i = await fetch(e.toString(), {
      headers: {
        "X-Requested-With": "fetch"
      }
    });
    if (!i.ok)
      throw new Error("Formular konnte nicht aktualisiert werden.");
    const n = await i.text(), o = new DOMParser().parseFromString(n, "text/html"), a = o.querySelector("#changealmanachform"), c = this.querySelector("#changealmanachform");
    if (!a || !c)
      throw new Error("Formular konnte nicht geladen werden.");
    c.replaceWith(a), this._form = a;
    const h = o.querySelector("#user-message"), d = this.querySelector("#user-message");
    h && d && d.replaceWith(h);
    const m = o.querySelector("#almanach-header-data"), p = this.querySelector("#almanach-header-data");
    m && p && p.replaceWith(m), this._initForm(), this._initPlaces(), this._initSaveHandling(), typeof window.TextareaAutoResize == "function" && setTimeout(() => {
      this.querySelectorAll("textarea").forEach((f) => {
        window.TextareaAutoResize(f);
      });
    }, 100);
  }
}
const qc = "[data-role='relation-add-toggle']", Hc = "[data-role='relation-add-panel']", $c = "[data-role='relation-add-close']", Uc = "[data-role='relation-add-apply']", jc = "[data-role='relation-add-error']", Vc = "[data-role='relation-add-row']", Wc = "[data-role='relation-add-select']", zc = "[data-role='relation-type-select']", Kc = "[data-role='relation-uncertain']", Gc = "template[data-role='relation-new-template']", Jc = "[data-role='relation-new-delete']", de = "[data-rel-row]";
class Yc extends HTMLElement {
  constructor() {
    super(), this._pendingItem = null, this._pendingApply = !1;
  }
  connectedCallback() {
    this._prefix = this.getAttribute("data-prefix") || "", this._linkBase = this.getAttribute("data-link-base") || "", this._newLabel = this.getAttribute("data-new-label") || "(Neu)", this._addToggleId = this.getAttribute("data-add-toggle-id") || "", this._preferredLabel = (this.getAttribute("data-preferred-label") || "").trim(), this._emptyText = this.querySelector(".rel-empty-text"), this._setupAddPanel(), this._setupDeleteToggles(), this._setupPreferredOptionHandling();
  }
  _getExistingIds() {
    const t = /* @__PURE__ */ new Set(), e = this._prefix === "entries_series" ? "series" : "agent";
    return this.querySelectorAll(`input[name^="${this._prefix}_${e}["]`).forEach((i) => {
      const n = i.value.trim();
      n && t.add(n);
    }), this._addRow && this._addRow.querySelectorAll(`input[name="${this._prefix}_new_id"]`).forEach((i) => {
      const n = i.value.trim();
      n && t.add(n);
    }), t;
  }
  _updateEmptyTextVisibility() {
    if (!this._emptyText)
      return;
    const t = this._prefix === "entries_series" ? "series" : "agent", e = this.querySelectorAll(`input[name^="${this._prefix}_${t}["]`).length > 0, i = this._addRow && this._addRow.querySelectorAll(`input[name="${this._prefix}_new_id"]`).length > 0;
    this._addPanel && !this._addPanel.classList.contains("hidden") || e || i ? this._emptyText.classList.add("hidden") : this._emptyText.classList.remove("hidden");
  }
  _setupAddPanel() {
    if (this._addToggle = this.querySelector(qc), this._addToggleId) {
      const t = document.getElementById(this._addToggleId);
      t && (this._addToggle = t);
    }
    this._addPanel = this.querySelector(Hc), this._addClose = this.querySelector($c), this._addApply = this.querySelector(Uc), this._addError = this.querySelector(jc), this._addRow = this.querySelector(Vc), this._addSelect = this.querySelector(Wc), this._typeSelect = this.querySelector(zc), this._uncertain = this.querySelector(Kc), this._template = this.querySelector(Gc), this._addInput = this._addSelect ? this._addSelect.querySelector(".ssr-input") : null, !(!this._addPanel || !this._addRow || !this._addSelect || !this._typeSelect || !this._uncertain || !this._template) && (this._addSelect && this._prefix === "entries_series" && this._addSelect.addEventListener("ssrbeforefetch", () => {
      this._addSelect._excludeIds = Array.from(this._getExistingIds());
    }), this._addToggle && this._addToggle.addEventListener("click", () => {
      const t = this._addPanel.classList.contains("hidden");
      this._addPanel.classList.toggle("hidden"), this._updateEmptyTextVisibility(), t && this._addInput && setTimeout(() => {
        this._addInput.focus();
      }, 0);
    }), this._addClose && this._addClose.addEventListener("click", () => {
      this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility();
    }), this._addInput && this._addInput.addEventListener("keydown", (t) => {
      t.key === "Enter" && (this._pendingApply = !0);
    }), this._addApply && this._addApply.addEventListener("click", () => {
      this._pendingApply = !1;
      const t = this._addPanel.querySelector(`input[name='${this._prefix}_new_id']`);
      if (!(t && t.value.trim().length > 0)) {
        this._addError && (this._addError.textContent = this._addError.getAttribute("data-error-empty") || "Bitte Reihe auswählen.", this._addError.classList.remove("hidden"));
        return;
      }
      if (this._pendingItem) {
        if (this._prefix === "entries_series" && this._getExistingIds().has(this._pendingItem.id)) {
          this._addError && (this._addError.textContent = this._addError.getAttribute("data-error-duplicate") || "Diese Verknüpfung existiert bereits.", this._addError.classList.remove("hidden"));
          return;
        }
        this._addError && this._addError.classList.add("hidden"), this._insertNewRow();
      }
    }), this._addSelect.addEventListener("ssrchange", (t) => {
      var e;
      this._pendingItem = ((e = t.detail) == null ? void 0 : e.item) || null, this._pendingItem && this._addError && this._addError.classList.add("hidden"), this._pendingApply && this._pendingItem && this._addApply && (this._pendingApply = !1, this._addApply.click());
    }));
  }
  _clearAddPanel() {
    if (this._addSelect) {
      const t = this._addSelect.querySelector(".ssr-clear-button");
      t && t.click();
    }
    this._typeSelect && (this._typeSelect.selectedIndex = 0), this._uncertain && (this._uncertain.checked = !1), this._addError && this._addError.classList.add("hidden");
  }
  _insertNewRow() {
    const t = this._template.content.cloneNode(!0), e = t.querySelector(de) || t.firstElementChild;
    if (!e)
      return;
    const i = t.querySelector("[data-rel-link]");
    i && i.setAttribute("href", `${this._linkBase}${this._pendingItem.id}`);
    const n = t.querySelector("[data-rel-name]");
    n && (n.textContent = this._pendingItem.name || "");
    const r = t.querySelector("[data-rel-detail]"), o = t.querySelector("[data-rel-detail-container]"), a = this._pendingItem.detail || this._pendingItem.bio || "";
    r && a ? r.textContent = a : o && o.remove();
    const c = t.querySelector("[data-rel-new]");
    c && (c.textContent = this._newLabel);
    const h = t.querySelector("[data-rel-input='type']");
    h && this._typeSelect && (h.innerHTML = this._typeSelect.innerHTML, h.value = this._typeSelect.value, h.name = `${this._prefix}_new_type`, h.addEventListener("change", () => this._updatePreferredOptions()));
    const d = t.querySelector("[data-rel-input='uncertain']");
    if (d && this._uncertain) {
      d.checked = this._uncertain.checked, d.name = `${this._prefix}_new_uncertain`;
      const f = `${this._prefix}_new_uncertain_row`;
      d.id = f;
      const C = t.querySelector("[data-rel-uncertain-label]");
      C && C.setAttribute("for", f);
    }
    const m = t.querySelector("[data-rel-input='id']");
    m && (m.name = `${this._prefix}_new_id`, m.value = this._pendingItem.id);
    const p = t.querySelector(Jc);
    p && p.addEventListener("click", () => {
      e.remove(), this._pendingItem = null, this._clearAddPanel(), this._addPanel && this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility();
    }), this._addRow.appendChild(t), this._pendingItem = null, this._clearAddPanel(), this._addPanel && this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility(), this._updatePreferredOptions();
  }
  _setupDeleteToggles() {
    this.querySelectorAll("[data-delete-toggle]").forEach((t) => {
      t.addEventListener("click", () => {
        const e = t.getAttribute("data-delete-toggle"), i = this.querySelector(`#${CSS.escape(e)}`);
        if (!i)
          return;
        i.checked = !i.checked;
        const n = t.closest(de);
        n && (n.classList.toggle("bg-red-50", i.checked), n.querySelectorAll("select, input[type='checkbox']").forEach((c) => {
          c !== i && (c.disabled = i.checked);
        }));
        const r = t.matches(":hover"), o = t.querySelector("[data-delete-label]");
        if (o) {
          let c;
          i.checked && r ? c = o.getAttribute("data-delete-hover") || "Rückgängig" : i.checked ? c = o.getAttribute("data-delete-active") || "Wird entfernt" : c = o.getAttribute("data-delete-default") || "Entfernen", o.textContent = c;
        }
        const a = t.querySelector("i");
        a && (i.checked ? r ? (a.classList.remove("hidden"), a.classList.add("ri-arrow-go-back-line"), a.classList.remove("ri-delete-bin-line")) : (a.classList.add("hidden"), a.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (a.classList.remove("hidden"), a.classList.add("ri-delete-bin-line"), a.classList.remove("ri-arrow-go-back-line"))), this._updatePreferredOptions();
      }), t.addEventListener("mouseenter", () => {
        const e = t.getAttribute("data-delete-toggle"), i = this.querySelector(`#${CSS.escape(e)}`);
        if (!i || !i.checked)
          return;
        const n = t.querySelector("[data-delete-label]");
        n && (n.textContent = n.getAttribute("data-delete-hover") || "Rückgängig");
        const r = t.querySelector("i");
        r && (r.classList.remove("hidden"), r.classList.add("ri-arrow-go-back-line"), r.classList.remove("ri-delete-bin-line"));
      }), t.addEventListener("mouseleave", () => {
        const e = t.getAttribute("data-delete-toggle"), i = this.querySelector(`#${CSS.escape(e)}`), n = t.querySelector("[data-delete-label]");
        if (!n)
          return;
        i && i.checked ? n.textContent = n.getAttribute("data-delete-active") || "Wird entfernt" : n.textContent = n.getAttribute("data-delete-default") || "Entfernen";
        const r = t.querySelector("i");
        r && (i && i.checked ? (r.classList.add("hidden"), r.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (r.classList.remove("hidden"), r.classList.add("ri-delete-bin-line"), r.classList.remove("ri-arrow-go-back-line")));
      });
    });
  }
  _setupPreferredOptionHandling() {
    this._prefix !== "entries_series" || !this._preferredLabel || (this.querySelectorAll(`select[name^="${this._prefix}_type["]`).forEach((t) => {
      t.addEventListener("change", () => this._updatePreferredOptions());
    }), this._typeSelect && this._typeSelect.addEventListener("change", () => this._updatePreferredOptions()), this._updatePreferredOptions());
  }
  _updatePreferredOptions() {
    if (this._prefix !== "entries_series" || !this._preferredLabel)
      return;
    const t = this._preferredLabel.trim(), e = [];
    this.querySelectorAll(`select[name^="${this._prefix}_type["]`).forEach((n) => {
      e.push({ select: n, row: n.closest(de), isAddPanel: !1 });
    }), this._addRow && this._addRow.querySelectorAll(`select[name='${this._prefix}_new_type']`).forEach((n) => {
      e.push({ select: n, row: n.closest(de), isAddPanel: !1 });
    }), this._typeSelect && e.push({ select: this._typeSelect, row: this._typeSelect.closest(de), isAddPanel: !0 });
    const i = e.some(({ select: n, row: r, isAddPanel: o }) => {
      if (o)
        return !1;
      const a = ((n == null ? void 0 : n.value) || "").trim();
      if (!n || a !== t)
        return !1;
      if (!r)
        return !0;
      const c = r.querySelector(`input[name^="${this._prefix}_delete["]`);
      return !(c && c.checked);
    });
    e.forEach(({ select: n, row: r, isAddPanel: o }) => {
      if (!n)
        return;
      const a = Array.from(n.options).find((f) => f.value.trim() === t);
      if (!a)
        return;
      const c = r ? r.querySelector(`input[name^="${this._prefix}_delete["]`) : null, h = !!(c && c.checked), d = (n.value || "").trim(), m = !i || d === t && !h;
      if (o && i && d === t) {
        const f = Array.from(n.options).find((C) => C.value.trim() !== t);
        f && (n.value = f.value);
      }
      const p = !m || o && i;
      a.hidden = p, a.disabled = p, a.style.display = p ? "none" : "";
    });
  }
}
class Xc extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      const t = this.querySelector("form");
      t && typeof window.FormLoad == "function" && window.FormLoad(t), this._setupDelete();
    }, 0);
  }
  _setupDelete() {
    const t = this.querySelector("form");
    if (!t)
      return;
    const e = t.getAttribute("data-delete-endpoint");
    if (!e)
      return;
    const i = this.querySelector("[data-role='edit-delete-dialog']"), n = this.querySelector("[data-role='edit-delete']"), r = this.querySelector("[data-role='edit-delete-confirm']"), o = this.querySelector("[data-role='edit-delete-cancel']");
    if (!i || !n || !r || !o)
      return;
    n.addEventListener("click", (c) => {
      c.preventDefault(), typeof i.showModal == "function" && i.showModal();
    });
    const a = (c) => {
      c && c.preventDefault(), i.open && i.close();
    };
    o.addEventListener("click", a), i.addEventListener("cancel", a), r.addEventListener("click", async (c) => {
      c.preventDefault(), a();
      const h = new FormData(t), d = {
        csrf_token: h.get("csrf_token") || "",
        last_edited: h.get("last_edited") || ""
      }, m = await fetch(e, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(d)
      });
      if (!m.ok)
        return;
      const p = await m.json().catch(() => null), f = (p == null ? void 0 : p.redirect) || "/";
      window.location.assign(f);
    });
  }
}
class Qc extends HTMLElement {
  constructor() {
    super(), this.state = null, this.handleClick = this.handleClick.bind(this), this.handleClickAway = this.handleClickAway.bind(this);
  }
  connectedCallback() {
    const t = this.getAttribute("data-user-name") || "Benutzer", e = this.getAttribute("data-user-email") || "", i = this.getAttribute("data-user-id") || "", n = this.getAttribute("data-is-admin-or-editor") === "true", r = this.getAttribute("data-is-admin") === "true", o = this.getAttribute("data-redirect-path") || "", a = window.location.pathname;
    let c = !1, h = "", d = !1, m = "", p = !1, f = "";
    const C = a.match(/^\/reihe\/([^\/]+)\/?$/);
    if (C && C[1] !== "new") {
      c = !0, h = C[1];
      const Et = document.querySelector('meta[name="entity-updated"]');
      Et && Et.content;
    }
    const L = a.match(/^\/person\/([^\/]+)\/?$/);
    L && L[1] !== "new" && (d = !0, m = L[1]);
    const U = a.match(/^\/almanach\/([^\/]+)\/?$/);
    if (U && U[1] !== "new") {
      p = !0, f = U[1];
      const Et = document.querySelector('meta[name="entity-updated"]');
      Et && Et.content;
    }
    const j = document.querySelector('input[name="csrf_token"]');
    j && j.value, this.hasContext = c || d || p;
    let q = "";
    c ? q = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihe
				</div>
				<a href="/reihe/${h}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			` : d ? q = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Person
				</div>
				<a href="/person/${m}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			` : p && (q = `
				<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Almanach
				</div>
				<a href="/almanach/${f}/edit" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			`);
    const N = n ? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Erstellen
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/almanach-new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-book-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Band</span>
				</a>
				<a href="/almanach-new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/reihen/new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Reihe</span>
				</a>
				<a href="/reihen/new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/orte/new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Ort</span>
				</a>
				<a href="/orte/new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/personen/new/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Person</span>
				</a>
				<a href="/personen/new/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", O = n ? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Listen
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/reihen/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Reihen</span>
				</a>
				<a href="/reihen/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/orte/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Orte</span>
				</a>
				<a href="/orte/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/personen/" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Personen</span>
				</a>
				<a href="/personen/" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", T = r ? `
			<div class="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Administration
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/user/management/access/User?redirectTo=${o}" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Nutzer einladen</span>
				</a>
				<a href="/user/management/access/User?redirectTo=${o}" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/user/management?redirectTo=${o}" class="flex items-center px-4 py-2 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-2-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Benutzerverwaltung</span>
				</a>
				<a href="/user/management?redirectTo=${o}" target="_blank" class="flex items-center justify-center px-3 py-2 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", tt = q || "", ct = q ? '<div class="border-t border-gray-200"></div>' : "";
    this.innerHTML = `
			<div class="fixed bottom-12 left-8 z-50">
				<!-- Unified Menu Container -->
				<div class="fab-menu hidden absolute bottom-16 left-0 w-64 bg-white rounded border border-gray-300 shadow transition-all duration-100 ease-out">
					<!-- Contextual actions (always at top when present) -->
					${tt}
					${ct}

					<!-- Rest of menu (hidden in half state, shown in full state) -->
					<div class="fab-full-content overflow-hidden transition-all duration-300 ease-in-out" style="max-height: 0; opacity: 0;">
						${N}
						${O}
						${T}
						<div class="px-4 py-2">
							<div class="font-semibold text-gray-900 text-sm">${t}</div>
							<div class="text-xs text-gray-600 truncate">${e}</div>
						</div>
						<a href="/user/${i}/edit?redirectTo=${encodeURIComponent(window.location.href)}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-user-3-line text-base text-gray-700 mr-2.5"></i>
							<span class="text-gray-900">Profil bearbeiten</span>
						</a>
						<a href="/logout?redirectTo=${o}" class="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-logout-box-line text-base text-gray-700 mr-2.5 mb-1"></i>
							<span class="text-gray-900">Logout</span>
						</a>
					</div>
				</div>

				<!-- FAB Button -->
				<button class="fab-button w-12 h-12 bg-slate-700 hover:bg-slate-800 text-white rounded border-2 border-slate-600 shadow-sm transition-all duration-200 flex items-center justify-center" aria-label="Menü">
					<i class="fab-icon text-2xl transition-all duration-200 ri-menu-line"></i>
				</button>

			</div>
		`, this._button = this.querySelector(".fab-button"), this._icon = this.querySelector(".fab-icon"), this._menu = this.querySelector(".fab-menu"), this._fullContent = this.querySelector(".fab-full-content"), this.state = this.hasContext ? "half" : "closed", this.setState(this.state), this._button.addEventListener("click", this.handleClick), document.addEventListener("click", this.handleClickAway);
  }
  disconnectedCallback() {
    this._button.removeEventListener("click", this.handleClick), document.removeEventListener("click", this.handleClickAway);
  }
  handleClick(t) {
    t.stopPropagation(), this.nextState();
  }
  handleClickAway(t) {
    this.contains(t.target) || this.setState("closed");
  }
  nextState() {
    this.state === "closed" ? this.setState(this.hasContext ? "half" : "full") : this.state === "half" ? this.setState("full") : this.setState("closed");
  }
  setState(t) {
    if (this.state = t, t === "closed")
      this._menu.style.opacity = "0", this._menu.style.transform = "translateY(8px)", this._fullContent.style.maxHeight = "0", this._fullContent.style.opacity = "0", setTimeout(() => {
        this.state === "closed" && this._menu.classList.add("hidden");
      }, 200), this._icon.classList.remove("ri-arrow-up-s-line", "ri-close-line"), this._icon.classList.add("ri-menu-line"), this._button.style.backgroundColor = "", this._button.style.borderColor = "", this._button.classList.remove("shadow-md"), this._button.classList.add("shadow-sm");
    else if (t === "half")
      this._menu.classList.remove("hidden"), this._menu.offsetHeight, this._menu.style.opacity = "1", this._menu.style.transform = "translateY(0)", this._fullContent.style.maxHeight = "0", this._fullContent.style.opacity = "0", this._icon.classList.remove("ri-menu-line", "ri-close-line"), this._icon.classList.add("ri-arrow-up-s-line"), this._button.style.backgroundColor = "rgb(51 65 85)", this._button.style.borderColor = "rgb(71 85 105)", this._button.classList.remove("shadow-sm"), this._button.classList.add("shadow-md");
    else if (t === "full") {
      this._menu.classList.remove("hidden"), this._menu.style.opacity = "1", this._menu.style.transform = "translateY(0)", this._fullContent.style.maxHeight = "none";
      const e = this._fullContent.scrollHeight;
      this._fullContent.style.maxHeight = "0", this._fullContent.offsetHeight, this._fullContent.style.maxHeight = e + "px", this._fullContent.style.opacity = "1", this._icon.classList.remove("ri-menu-line", "ri-arrow-up-s-line"), this._icon.classList.add("ri-close-line"), this._button.style.backgroundColor = "rgb(30 41 59)", this._button.style.borderColor = "rgb(51 65 85)", this._button.classList.remove("shadow-sm"), this._button.classList.add("shadow-md");
    }
  }
}
document.addEventListener("trix-file-accept", (s) => {
  s.preventDefault();
});
const Zc = "filter-list", th = "fab-menu", eh = "scroll-button", ih = "tool-tip", nh = "abbrev-tooltips", sh = "int-link", rh = "popup-image", oh = "tab-list", ah = "filter-pill", lh = "image-reel", ch = "multi-select-places", hh = "multi-select-simple", dh = "single-select-remote", mo = "reset-button", uh = "div-manager", mh = "items-editor", gh = "almanach-edit-page", ph = "relations-editor", fh = "edit-page";
customElements.define(sh, Fl);
customElements.define(nh, Ae);
customElements.define(Zc, Ol);
customElements.define(eh, Ml);
customElements.define(ih, Bl);
customElements.define(rh, Nl);
customElements.define(oh, Pl);
customElements.define(ah, Il);
customElements.define(lh, ql);
customElements.define(ch, co);
customElements.define(hh, ho);
customElements.define(dh, Nc);
customElements.define(mo, fc);
customElements.define(uh, Ac);
customElements.define(mh, kc);
customElements.define(gh, Fc);
customElements.define(ph, Yc);
customElements.define(fh, Xc);
customElements.define(th, Qc);
function bh() {
  const s = window.location.pathname, t = window.location.search, e = s + t;
  return encodeURIComponent(e);
}
function vh(s = 5e3, t = 100) {
  return new Promise((e, i) => {
    let n = 0;
    const r = setInterval(() => {
      typeof window.QRCode == "function" ? (clearInterval(r), e(window.QRCode)) : (n += t, n >= s && (clearInterval(r), console.error("Timed out waiting for QRCode to become available."), i(new Error("QRCode not available after " + s + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."))));
    }, t);
  });
}
async function _h(s) {
  const t = await vh(), e = document.getElementById("qr");
  e && (e.innerHTML = "", e.classList.add("hidden"), new t(e, {
    text: s,
    width: 1280,
    height: 1280,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: t.CorrectLevel.H
  }), setTimeout(() => {
    e.classList.remove("hidden");
  }, 20));
}
function Ah(s) {
  s && (s.addEventListener("focus", (t) => {
    t.preventDefault(), s.select();
  }), s.addEventListener("mousedown", (t) => {
    t.preventDefault(), s.select();
  }), s.addEventListener("mouseup", (t) => {
    t.preventDefault(), s.select();
  })), s && (s.addEventListener("focus", () => {
    s.select();
  }), s.addEventListener("click", () => {
    s.select();
  }));
}
function yh() {
  document.body.addEventListener("htmx:responseError", function(s) {
    const t = s.detail.requestConfig;
    if (t.boosted) {
      document.body.innerHTML = s.detail.xhr.responseText;
      const e = s.detail.xhr.responseURL || t.url;
      window.history.pushState(null, "", e);
    }
  });
}
function Eh(s, t) {
  if (!(s instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof t != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const e = s.querySelectorAll(mo);
  s.addEventListener("rbichange", (i) => {
    for (const n of e)
      if (n.isCurrentlyModified()) {
        t(i.details, !0);
        return;
      }
    t(i.details, !1);
  });
}
let Vt = null;
function go() {
  return Vt !== null || (typeof CSS < "u" && typeof CSS.supports == "function" ? Vt = CSS.supports("field-sizing", "content") : Vt = !1, console.log("Browser supports field-sizing:", Vt)), Vt;
}
function Rt(s) {
  if (console.log("TextareaAutoResize called for:", s.name || s.id), !(s instanceof HTMLTextAreaElement)) {
    console.log("Not a textarea element");
    return;
  }
  if (s.offsetParent === null) {
    console.log("Textarea not visible");
    return;
  }
  s.removeAttribute("rows"), s.style.overflow = "auto";
  const e = s.name === "annotation" ? 76 : 38;
  if (s.value.trim() === "") {
    s.style.height = e + "px", console.log("Empty textarea, setting height to:", e + "px");
    return;
  }
  s.style.height = "1px";
  const i = s.scrollHeight, n = Math.max(i, e) + "px";
  console.log("Setting height to:", n), s.style.height = n;
}
function po(s) {
  s.key === "Enter" && s.preventDefault();
}
function Sh(s) {
  if (!(s instanceof HTMLTextAreaElement)) {
    console.warn("HookupTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  go() || s.addEventListener("input", () => {
    Rt(s);
  });
}
function xh(s) {
  if (!(s instanceof HTMLTextAreaElement)) {
    console.warn("DisconnectTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  s.removeEventListener("input", () => {
    Rt(s);
  });
}
function Ch(s) {
  !(s instanceof HTMLTextAreaElement) && s.classList.contains("no-enter") || s.addEventListener("keydown", po);
}
function Lh(s) {
  !(s instanceof HTMLTextAreaElement) && s.classList.contains("no-enter") || s.removeEventListener("keydown", po);
}
function Th(s, t) {
  const e = !go();
  for (const i of s)
    if (i.type === "childList") {
      for (const n of i.addedNodes)
        n.nodeType === Node.ELEMENT_NODE && n.matches("textarea") && e && (Sh(n), Rt(n));
      for (const n of i.removedNodes)
        n.nodeType === Node.ELEMENT_NODE && n.matches("textarea") && (Lh(n), e && xh(n));
    }
}
function wh(s) {
  if (console.log("=== FormLoad CALLED ==="), !(s instanceof HTMLFormElement)) {
    console.warn("FormLoad: Provided element is not a form.");
    return;
  }
  const t = document.querySelectorAll("textarea");
  console.log("Found", t.length, "textareas");
  for (const o of t)
    console.log("Attaching input listener to:", o.name || o.id), o.addEventListener("input", function() {
      console.log("Input event on textarea:", this.name || this.id), Rt(this);
    });
  setTimeout(() => {
    console.log("Running initial textarea resize on", t.length, "textareas");
    for (const o of t)
      Rt(o);
  }, 200);
  const e = document.querySelectorAll("textarea.no-enter");
  for (const o of e)
    Ch(o);
  new MutationObserver(Th).observe(s, {
    childList: !0,
    subtree: !0
  }), new MutationObserver((o) => {
    for (const a of o)
      if (a.type === "attributes" && a.attributeName === "class") {
        const c = a.target;
        if (c instanceof HTMLElement) {
          const h = c.matches("textarea") ? [c] : Array.from(c.querySelectorAll("textarea"));
          for (const d of h)
            d.offsetParent !== null && Rt(d);
        }
      }
  }).observe(s, {
    attributes: !0,
    attributeFilter: ["class"],
    subtree: !0
  }), s.querySelectorAll('input[type="checkbox"][data-boolean-checkbox]').forEach((o) => {
    o.value = "true";
    const a = () => {
      const c = s.querySelector(`input[type="hidden"][name="${o.name}"]`);
      if (c && c.remove(), !o.checked) {
        const h = document.createElement("input");
        h.type = "hidden", h.name = o.name, h.value = "false", o.parentNode.insertBefore(h, o);
      }
    };
    a(), o.addEventListener("change", a);
  });
}
document.addEventListener("keydown", (s) => {
  if (s.key !== "Enter")
    return;
  const t = s.target;
  t instanceof HTMLElement && t.matches("textarea.no-enter") && s.preventDefault();
});
window.ShowBoostedErrors = yh;
window.GenQRCode = _h;
window.SelectableInput = Ah;
window.PathPlusQuery = bh;
window.HookupRBChange = Eh;
window.FormLoad = wh;
window.TextareaAutoResize = Rt;
export {
  Ae as AbbreviationTooltips,
  Fc as AlmanachEditPage,
  Xc as EditPage,
  Qc as FabMenu,
  Ol as FilterList,
  Il as FilterPill,
  ql as ImageReel,
  Fl as IntLink,
  kc as ItemsEditor,
  co as MultiSelectRole,
  ho as MultiSelectSimple,
  Nl as PopupImage,
  Yc as RelationsEditor,
  Ml as ScrollButton,
  Nc as SingleSelectRemote,
  Pl as TabList,
  Bl as ToolTip
};
