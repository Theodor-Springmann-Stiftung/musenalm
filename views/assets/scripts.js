var pl = "2.1.18";
const Be = "[data-trix-attachment]", Br = { preview: { presentation: "gallery", caption: { name: !0, size: !0 } }, file: { caption: { size: !0 } } }, mt = { default: { tagName: "div", parse: !1 }, quote: { tagName: "blockquote", nestable: !0 }, heading1: { tagName: "h1", terminal: !0, breakOnReturn: !0, group: !1 }, code: { tagName: "pre", terminal: !0, htmlAttributes: ["language"], text: { plaintext: !0 } }, bulletList: { tagName: "ul", parse: !1 }, bullet: { tagName: "li", listAttribute: "bulletList", group: !1, nestable: !0, test(n) {
  return hs(n.parentNode) === mt[this.listAttribute].tagName;
} }, numberList: { tagName: "ol", parse: !1 }, number: { tagName: "li", listAttribute: "numberList", group: !1, nestable: !0, test(n) {
  return hs(n.parentNode) === mt[this.listAttribute].tagName;
} }, attachmentGallery: { tagName: "div", exclusive: !0, terminal: !0, parse: !1, group: !1 } }, hs = (n) => {
  var t;
  return n == null || (t = n.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, ms = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i), Ln = ms && parseInt(ms[1]);
var Bi = { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), recentAndroid: Ln && Ln > 12, samsungAndroid: Ln && navigator.userAgent.match(/Android.*SM-/), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: typeof InputEvent < "u" && ["data", "getTargetRanges", "inputType"].every(((n) => n in InputEvent.prototype)) }, Xa = { ADD_ATTR: ["language"], SAFE_FOR_XML: !1, RETURN_DOM: !0 }, k = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", byte: "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption…", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL…", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
const fl = [k.bytes, k.KB, k.MB, k.GB, k.TB, k.PB];
var Qa = { prefix: "IEC", precision: 2, formatter(n) {
  switch (n) {
    case 0:
      return "0 ".concat(k.bytes);
    case 1:
      return "1 ".concat(k.byte);
    default:
      let t;
      this.prefix === "SI" ? t = 1e3 : this.prefix === "IEC" && (t = 1024);
      const e = Math.floor(Math.log(n) / Math.log(t)), i = (n / Math.pow(t, e)).toFixed(this.precision).replace(/0*$/, "").replace(/\.$/, "");
      return "".concat(i, " ").concat(fl[e]);
  }
} };
const fn = "\uFEFF", Ae = " ", Za = function(n) {
  for (const t in n) {
    const e = n[t];
    this[t] = e;
  }
  return this;
}, Nr = document.documentElement, gl = Nr.matches, J = function(n) {
  let { onElement: t, matchingSelector: e, withCallback: i, inPhase: r, preventDefault: s, times: a } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const o = t || Nr, l = e, c = r === "capturing", h = function(b) {
    a != null && --a == 0 && h.destroy();
    const g = Ee(b.target, { matchingSelector: l });
    g != null && (i?.call(g, b, g), s && b.preventDefault());
  };
  return h.destroy = () => o.removeEventListener(n, h, c), o.addEventListener(n, h, c), h;
}, to = function(n) {
  let { bubbles: t, cancelable: e, attributes: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  t = t !== !1, e = e !== !1;
  const r = document.createEvent("Events");
  return r.initEvent(n, t, e), i != null && Za.call(r, i), r;
}, _i = function(n) {
  let { onElement: t, bubbles: e, cancelable: i, attributes: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const s = t ?? Nr, a = to(n, { bubbles: e, cancelable: i, attributes: r });
  return s.dispatchEvent(a);
}, eo = function(n, t) {
  if (n?.nodeType === 1) return gl.call(n, t);
}, Ee = function(n) {
  let { matchingSelector: t, untilNode: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  for (; n && n.nodeType !== Node.ELEMENT_NODE; ) n = n.parentNode;
  if (n != null) {
    if (t == null) return n;
    if (n.closest && e == null) return n.closest(t);
    for (; n && n !== e; ) {
      if (eo(n, t)) return n;
      n = n.parentNode;
    }
  }
}, Pr = (n) => document.activeElement !== n && Me(n, document.activeElement), Me = function(n, t) {
  if (n && t) for (; t; ) {
    if (t === n) return !0;
    t = t.parentNode;
  }
}, wn = function(n) {
  var t;
  if ((t = n) === null || t === void 0 || !t.parentNode) return;
  let e = 0;
  for (n = n.previousSibling; n; ) e++, n = n.previousSibling;
  return e;
}, xe = (n) => {
  var t;
  return n == null || (t = n.parentNode) === null || t === void 0 ? void 0 : t.removeChild(n);
}, on = function(n) {
  let { onlyNodesOfType: t, usingFilter: e, expandEntityReferences: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const r = (() => {
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
  return document.createTreeWalker(n, r, e ?? null, i === !0);
}, ht = (n) => {
  var t;
  return n == null || (t = n.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, I = function(n) {
  let t, e, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  typeof n == "object" ? (i = n, n = i.tagName) : i = { attributes: i };
  const r = document.createElement(n);
  if (i.editable != null && (i.attributes == null && (i.attributes = {}), i.attributes.contenteditable = i.editable), i.attributes) for (t in i.attributes) e = i.attributes[t], r.setAttribute(t, e);
  if (i.style) for (t in i.style) e = i.style[t], r.style[t] = e;
  if (i.data) for (t in i.data) e = i.data[t], r.dataset[t] = e;
  return i.className && i.className.split(" ").forEach(((s) => {
    r.classList.add(s);
  })), i.textContent && (r.textContent = i.textContent), i.childNodes && [].concat(i.childNodes).forEach(((s) => {
    r.appendChild(s);
  })), r;
};
let ci;
const Ai = function() {
  if (ci != null) return ci;
  ci = [];
  for (const n in mt) {
    const t = mt[n];
    t.tagName && ci.push(t.tagName);
  }
  return ci;
}, Cn = (n) => Ye(n?.firstChild), Tn = function(n) {
  let { strict: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { strict: !0 };
  return t ? Ye(n) : Ye(n) || !Ye(n.firstChild) && (function(e) {
    return Ai().includes(ht(e)) && !Ai().includes(ht(e.firstChild));
  })(n);
}, Ye = (n) => bl(n) && n?.data === "block", bl = (n) => n?.nodeType === Node.COMMENT_NODE, Xe = function(n) {
  let { name: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (n) return Ei(n) ? n.data === fn ? !t || n.parentNode.dataset.trixCursorTarget === t : void 0 : Xe(n.firstChild);
}, Ne = (n) => eo(n, Be), io = (n) => Ei(n) && n?.data === "", Ei = (n) => n?.nodeType === Node.TEXT_NODE, Fr = { level2Enabled: !0, getLevel() {
  return this.level2Enabled && Bi.supportsInputEvents ? 2 : 0;
}, pickFiles(n) {
  const t = I("input", { type: "file", multiple: !0, hidden: !0, id: this.fileInputId });
  t.addEventListener("change", (() => {
    n(t.files), xe(t);
  })), xe(document.getElementById(this.fileInputId)), document.body.appendChild(t), t.click();
} };
var nn = { removeBlankTableCells: !1, tableCellSeparator: " | ", tableRowSeparator: `
` }, qe = { bold: { tagName: "strong", inheritable: !0, parser(n) {
  const t = window.getComputedStyle(n);
  return t.fontWeight === "bold" || t.fontWeight >= 600;
} }, italic: { tagName: "em", inheritable: !0, parser: (n) => window.getComputedStyle(n).fontStyle === "italic" }, href: { groupTagName: "a", parser(n) {
  const t = "a:not(".concat(Be, ")"), e = n.closest(t);
  if (e) return e.getAttribute("href");
} }, strike: { tagName: "del", inheritable: !0 }, frozen: { style: { backgroundColor: "highlight" } } }, no = { getDefaultHTML: () => `<div class="trix-button-row">
      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="`.concat(k.bold, '" tabindex="-1">').concat(k.bold, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="`).concat(k.italic, '" tabindex="-1">').concat(k.italic, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="`).concat(k.strike, '" tabindex="-1">').concat(k.strike, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="`).concat(k.link, '" tabindex="-1">').concat(k.link, `</button>
      </span>

      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="`).concat(k.heading1, '" tabindex="-1">').concat(k.heading1, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="`).concat(k.quote, '" tabindex="-1">').concat(k.quote, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="`).concat(k.code, '" tabindex="-1">').concat(k.code, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="`).concat(k.bullets, '" tabindex="-1">').concat(k.bullets, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="`).concat(k.numbers, '" tabindex="-1">').concat(k.numbers, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="`).concat(k.outdent, '" tabindex="-1">').concat(k.outdent, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="`).concat(k.indent, '" tabindex="-1">').concat(k.indent, `</button>
      </span>

      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="`).concat(k.attachFiles, '" tabindex="-1">').concat(k.attachFiles, `</button>
      </span>

      <span class="trix-button-group-spacer"></span>

      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="`).concat(k.undo, '" tabindex="-1">').concat(k.undo, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="`).concat(k.redo, '" tabindex="-1">').concat(k.redo, `</button>
      </span>
    </div>

    <div class="trix-dialogs" data-trix-dialogs>
      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
        <div class="trix-dialog__link-fields">
          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="`).concat(k.urlPlaceholder, '" aria-label="').concat(k.url, `" data-trix-validate-href required data-trix-input>
          <div class="trix-button-group">
            <input type="button" class="trix-button trix-button--dialog" value="`).concat(k.link, `" data-trix-method="setAttribute">
            <input type="button" class="trix-button trix-button--dialog" value="`).concat(k.unlink, `" data-trix-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>`) };
const br = { interval: 5e3 };
var Ni = Object.freeze({ __proto__: null, attachments: Br, blockAttributes: mt, browser: Bi, css: { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" }, dompurify: Xa, fileSize: Qa, input: Fr, keyNames: { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" }, lang: k, parser: nn, textAttributes: qe, toolbar: no, undo: br });
class et {
  static proxyMethod(t) {
    const { name: e, toMethod: i, toProperty: r, optional: s } = vl(t);
    this.prototype[e] = function() {
      let a, o;
      var l, c;
      return i ? o = s ? (l = this[i]) === null || l === void 0 ? void 0 : l.call(this) : this[i]() : r && (o = this[r]), s ? (a = (c = o) === null || c === void 0 ? void 0 : c[e], a ? ps.call(a, o, arguments) : void 0) : (a = o[e], ps.call(a, o, arguments));
    };
  }
}
const vl = function(n) {
  const t = n.match(yl);
  if (!t) throw new Error("can't parse @proxyMethod expression: ".concat(n));
  const e = { name: t[4] };
  return t[2] != null ? e.toMethod = t[1] : e.toProperty = t[1], t[3] != null && (e.optional = !0), e;
}, { apply: ps } = Function.prototype, yl = new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");
var kn, Rn, Dn;
class Di extends et {
  static box() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return t instanceof this ? t : this.fromUCS2String(t?.toString());
  }
  static fromUCS2String(t) {
    return new this(t, vr(t));
  }
  static fromCodepoints(t) {
    return new this(yr(t), t);
  }
  constructor(t, e) {
    super(...arguments), this.ucs2String = t, this.codepoints = e, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
  }
  offsetToUCS2Offset(t) {
    return yr(this.codepoints.slice(0, Math.max(0, t))).length;
  }
  offsetFromUCS2Offset(t) {
    return vr(this.ucs2String.slice(0, Math.max(0, t))).length;
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
const _l = ((kn = Array.from) === null || kn === void 0 ? void 0 : kn.call(Array, "👼").length) === 1, Al = ((Rn = " ".codePointAt) === null || Rn === void 0 ? void 0 : Rn.call(" ", 0)) != null, El = ((Dn = String.fromCodePoint) === null || Dn === void 0 ? void 0 : Dn.call(String, 32, 128124)) === " 👼";
let vr, yr;
vr = _l && Al ? (n) => Array.from(n).map(((t) => t.codePointAt(0))) : function(n) {
  const t = [];
  let e = 0;
  const { length: i } = n;
  for (; e < i; ) {
    let r = n.charCodeAt(e++);
    if (55296 <= r && r <= 56319 && e < i) {
      const s = n.charCodeAt(e++);
      (64512 & s) == 56320 ? r = ((1023 & r) << 10) + (1023 & s) + 65536 : e--;
    }
    t.push(r);
  }
  return t;
}, yr = El ? (n) => String.fromCodePoint(...Array.from(n || [])) : function(n) {
  return (() => {
    const t = [];
    return Array.from(n).forEach(((e) => {
      let i = "";
      e > 65535 && (e -= 65536, i += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t.push(i + String.fromCharCode(e));
    })), t;
  })().join("");
};
let xl = 0;
class je extends et {
  static fromJSONString(t) {
    return this.fromJSON(JSON.parse(t));
  }
  constructor() {
    super(...arguments), this.id = ++xl;
  }
  hasSameConstructorAs(t) {
    return this.constructor === t?.constructor;
  }
  isEqualTo(t) {
    return this === t;
  }
  inspect() {
    const t = [], e = this.contentsForInspection() || {};
    for (const i in e) {
      const r = e[i];
      t.push("".concat(i, "=").concat(r));
    }
    return "#<".concat(this.constructor.name, ":").concat(this.id).concat(t.length ? " ".concat(t.join(", ")) : "", ">");
  }
  contentsForInspection() {
  }
  toJSONString() {
    return JSON.stringify(this);
  }
  toUTF16String() {
    return Di.box(this);
  }
  getCacheKey() {
    return this.id.toString();
  }
}
const He = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (n.length !== t.length) return !1;
  for (let e = 0; e < n.length; e++)
    if (n[e] !== t[e]) return !1;
  return !0;
}, qr = function(n) {
  const t = n.slice(0);
  for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) i[r - 1] = arguments[r];
  return t.splice(...i), t;
}, Sl = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/, Ll = (function() {
  const n = I("input", { dir: "auto", name: "x", dirName: "x.dir" }), t = I("textarea", { dir: "auto", name: "y", dirName: "y.dir" }), e = I("form");
  e.appendChild(n), e.appendChild(t);
  const i = (function() {
    try {
      return new FormData(e).has(t.dirName);
    } catch {
      return !1;
    }
  })(), r = (function() {
    try {
      return n.matches(":dir(ltr),:dir(rtl)");
    } catch {
      return !1;
    }
  })();
  return i ? function(s) {
    return t.value = s, new FormData(e).get(t.dirName);
  } : r ? function(s) {
    return n.value = s, n.matches(":dir(rtl)") ? "rtl" : "ltr";
  } : function(s) {
    const a = s.trim().charAt(0);
    return Sl.test(a) ? "rtl" : "ltr";
  };
})();
let In = null, On = null, Mn = null, $i = null;
const _r = () => (In || (In = Cl().concat(wl())), In), Z = (n) => mt[n], wl = () => (On || (On = Object.keys(mt)), On), Ar = (n) => qe[n], Cl = () => (Mn || (Mn = Object.keys(qe)), Mn), ro = function(n, t) {
  Tl(n).textContent = t.replace(/%t/g, n);
}, Tl = function(n) {
  const t = document.createElement("style");
  t.setAttribute("type", "text/css"), t.setAttribute("data-tag-name", n.toLowerCase());
  const e = kl();
  return e && t.setAttribute("nonce", e), document.head.insertBefore(t, document.head.firstChild), t;
}, kl = function() {
  const n = fs("trix-csp-nonce") || fs("csp-nonce");
  if (n) {
    const { nonce: t, content: e } = n;
    return t == "" ? e : t;
  }
}, fs = (n) => document.head.querySelector("meta[name=".concat(n, "]")), gs = { "application/x-trix-feature-detection": "test" }, so = function(n) {
  const t = n.getData("text/plain"), e = n.getData("text/html");
  if (!t || !e) return t?.length;
  {
    const { body: i } = new DOMParser().parseFromString(e, "text/html");
    if (i.textContent === t) return !i.querySelector("*");
  }
}, ao = /Mac|^iP/.test(navigator.platform) ? (n) => n.metaKey : (n) => n.ctrlKey, Hr = (n) => setTimeout(n, 1), oo = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const t = {};
  for (const e in n) {
    const i = n[e];
    t[e] = i;
  }
  return t;
}, si = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (Object.keys(n).length !== Object.keys(t).length) return !1;
  for (const e in n)
    if (n[e] !== t[e]) return !1;
  return !0;
}, $ = function(n) {
  if (n != null) return Array.isArray(n) || (n = [n, n]), [bs(n[0]), bs(n[1] != null ? n[1] : n[0])];
}, ue = function(n) {
  if (n == null) return;
  const [t, e] = $(n);
  return Er(t, e);
}, ln = function(n, t) {
  if (n == null || t == null) return;
  const [e, i] = $(n), [r, s] = $(t);
  return Er(e, r) && Er(i, s);
}, bs = function(n) {
  return typeof n == "number" ? n : oo(n);
}, Er = function(n, t) {
  return typeof n == "number" ? n === t : si(n, t);
};
class lo extends et {
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
    if (this.selectionManagers = this.selectionManagers.filter(((e) => e !== t)), this.selectionManagers.length === 0) return this.stop();
  }
  notifySelectionManagersOfSelectionChange() {
    return this.selectionManagers.map(((t) => t.selectionDidChange()));
  }
  update() {
    this.notifySelectionManagersOfSelectionChange();
  }
  reset() {
    this.update();
  }
}
const Ue = new lo(), co = function() {
  const n = window.getSelection();
  if (n.rangeCount > 0) return n;
}, xi = function() {
  var n;
  const t = (n = co()) === null || n === void 0 ? void 0 : n.getRangeAt(0);
  if (t && !Rl(t)) return t;
}, uo = function(n) {
  const t = window.getSelection();
  return t.removeAllRanges(), t.addRange(n), Ue.update();
}, Rl = (n) => vs(n.startContainer) || vs(n.endContainer), vs = (n) => !Object.getPrototypeOf(n), yi = (n) => n.replace(new RegExp("".concat(fn), "g"), "").replace(new RegExp("".concat(Ae), "g"), " "), Ur = new RegExp("[^\\S".concat(Ae, "]")), $r = (n) => n.replace(new RegExp("".concat(Ur.source), "g"), " ").replace(/\ {2,}/g, " "), ys = function(n, t) {
  if (n.isEqualTo(t)) return ["", ""];
  const e = Bn(n, t), { length: i } = e.utf16String;
  let r;
  if (i) {
    const { offset: s } = e, a = n.codepoints.slice(0, s).concat(n.codepoints.slice(s + i));
    r = Bn(t, Di.fromCodepoints(a));
  } else r = Bn(t, n);
  return [e.utf16String.toString(), r.utf16String.toString()];
}, Bn = function(n, t) {
  let e = 0, i = n.length, r = t.length;
  for (; e < i && n.charAt(e).isEqualTo(t.charAt(e)); ) e++;
  for (; i > e + 1 && n.charAt(i - 1).isEqualTo(t.charAt(r - 1)); ) i--, r--;
  return { utf16String: n.slice(e, i), offset: e };
};
class Et extends je {
  static fromCommonAttributesOfObjects() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    if (!t.length) return new this();
    let e = di(t[0]), i = e.getKeys();
    return t.slice(1).forEach(((r) => {
      i = e.getKeysCommonToHash(di(r)), e = e.slice(i);
    })), e;
  }
  static box(t) {
    return di(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(...arguments), this.values = rn(t);
  }
  add(t, e) {
    return this.merge(Dl(t, e));
  }
  remove(t) {
    return new Et(rn(this.values, t));
  }
  get(t) {
    return this.values[t];
  }
  has(t) {
    return t in this.values;
  }
  merge(t) {
    return new Et(Il(this.values, Ol(t)));
  }
  slice(t) {
    const e = {};
    return Array.from(t).forEach(((i) => {
      this.has(i) && (e[i] = this.values[i]);
    })), new Et(e);
  }
  getKeys() {
    return Object.keys(this.values);
  }
  getKeysCommonToHash(t) {
    return t = di(t), this.getKeys().filter(((e) => this.values[e] === t.values[e]));
  }
  isEqualTo(t) {
    return He(this.toArray(), di(t).toArray());
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
    return rn(this.values);
  }
  toJSON() {
    return this.toObject();
  }
  contentsForInspection() {
    return { values: JSON.stringify(this.values) };
  }
}
const Dl = function(n, t) {
  const e = {};
  return e[n] = t, e;
}, Il = function(n, t) {
  const e = rn(n);
  for (const i in t) {
    const r = t[i];
    e[i] = r;
  }
  return e;
}, rn = function(n, t) {
  const e = {};
  return Object.keys(n).sort().forEach(((i) => {
    i !== t && (e[i] = n[i]);
  })), e;
}, di = function(n) {
  return n instanceof Et ? n : new Et(n);
}, Ol = function(n) {
  return n instanceof Et ? n.values : n;
};
class jr {
  static groupObjects() {
    let t, e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], { depth: i, asTree: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    r && i == null && (i = 0);
    const s = [];
    return Array.from(e).forEach(((a) => {
      var o;
      if (t) {
        var l, c, h;
        if ((l = a.canBeGrouped) !== null && l !== void 0 && l.call(a, i) && (c = (h = t[t.length - 1]).canBeGroupedWith) !== null && c !== void 0 && c.call(h, a, i)) return void t.push(a);
        s.push(new this(t, { depth: i, asTree: r })), t = null;
      }
      (o = a.canBeGrouped) !== null && o !== void 0 && o.call(a, i) ? t = [a] : s.push(a);
    })), t && s.push(new this(t, { depth: i, asTree: r })), s;
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
    return Array.from(this.getObjects()).forEach(((e) => {
      t.push(e.getCacheKey());
    })), t.join("/");
  }
}
class Ml extends et {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), this.objects = {}, Array.from(t).forEach(((e) => {
      const i = JSON.stringify(e);
      this.objects[i] == null && (this.objects[i] = e);
    }));
  }
  find(t) {
    const e = JSON.stringify(t);
    return this.objects[e];
  }
}
class Bl {
  constructor(t) {
    this.reset(t);
  }
  add(t) {
    const e = _s(t);
    this.elements[e] = t;
  }
  remove(t) {
    const e = _s(t), i = this.elements[e];
    if (i) return delete this.elements[e], i;
  }
  reset() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return this.elements = {}, Array.from(t).forEach(((e) => {
      this.add(e);
    })), t;
  }
}
const _s = (n) => n.dataset.trixStoreKey;
class cn extends et {
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
    return this.promise || (this.promise = new Promise(((t, e) => (this.performing = !0, this.perform(((i, r) => {
      this.succeeded = i, this.performing = !1, this.performed = !0, this.succeeded ? t(r) : e(r);
    })))))), this.promise;
  }
  perform(t) {
    return t(!1);
  }
  release() {
    var t, e;
    (t = this.promise) === null || t === void 0 || (e = t.cancel) === null || e === void 0 || e.call(t), this.promise = null, this.performing = null, this.performed = null, this.succeeded = null;
  }
}
cn.proxyMethod("getPromise().then"), cn.proxyMethod("getPromise().catch");
class Ve extends et {
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.object = t, this.options = e, this.childViews = [], this.rootView = this;
  }
  getNodes() {
    return this.nodes || (this.nodes = this.createNodes()), this.nodes.map(((t) => t.cloneNode(!0)));
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
    let r = this.getCachedViewForObject(e);
    return r ? this.recordChildView(r) : (r = this.createChildView(...arguments), this.cacheViewForObject(r, e)), r;
  }
  createChildView(t, e) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    e instanceof jr && (i.viewClass = t, t = Nl);
    const r = new t(e, i);
    return this.recordChildView(r);
  }
  recordChildView(t) {
    return t.parentView = this, t.rootView = this.rootView, this.childViews.push(t), t;
  }
  getAllChildViews() {
    let t = [];
    return this.childViews.forEach(((e) => {
      t.push(e), t = t.concat(e.getAllChildViews());
    })), t;
  }
  findElement() {
    return this.findElementForObject(this.object);
  }
  findElementForObject(t) {
    const e = t?.id;
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
      const e = this.getAllChildViews().concat(this).map(((i) => i.object.getCacheKey()));
      for (const i in t) e.includes(i) || delete t[i];
    }
  }
}
class Nl extends Ve {
  constructor() {
    super(...arguments), this.objectGroup = this.object, this.viewClass = this.options.viewClass, delete this.options.viewClass;
  }
  getChildViews() {
    return this.childViews.length || Array.from(this.objectGroup.getObjects()).forEach(((t) => {
      this.findOrCreateCachedChildView(this.viewClass, t, this.options);
    })), this.childViews;
  }
  createNodes() {
    const t = this.createContainerElement();
    return this.getChildViews().forEach(((e) => {
      Array.from(e.getNodes()).forEach(((i) => {
        t.appendChild(i);
      }));
    })), [t];
  }
  createContainerElement() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.objectGroup.getDepth();
    return this.getChildViews()[0].createContainerElement(t);
  }
}
const { entries: ho, setPrototypeOf: As, isFrozen: Pl, getPrototypeOf: Fl, getOwnPropertyDescriptor: ql } = Object;
let { freeze: pt, seal: It, create: mo } = Object, { apply: xr, construct: Sr } = typeof Reflect < "u" && Reflect;
pt || (pt = function(n) {
  return n;
}), It || (It = function(n) {
  return n;
}), xr || (xr = function(n, t) {
  for (var e = arguments.length, i = new Array(e > 2 ? e - 2 : 0), r = 2; r < e; r++) i[r - 2] = arguments[r];
  return n.apply(t, i);
}), Sr || (Sr = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) e[i - 1] = arguments[i];
  return new n(...e);
});
const ji = ft(Array.prototype.forEach), Hl = ft(Array.prototype.lastIndexOf), Es = ft(Array.prototype.pop), ui = ft(Array.prototype.push), Ul = ft(Array.prototype.splice), sn = ft(String.prototype.toLowerCase), Nn = ft(String.prototype.toString), Pn = ft(String.prototype.match), hi = ft(String.prototype.replace), $l = ft(String.prototype.indexOf), jl = ft(String.prototype.trim), Wt = ft(Object.prototype.hasOwnProperty), ut = ft(RegExp.prototype.test), mi = (xs = TypeError, function() {
  for (var n = arguments.length, t = new Array(n), e = 0; e < n; e++) t[e] = arguments[e];
  return Sr(xs, t);
});
var xs;
function ft(n) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++) i[r - 1] = arguments[r];
    return xr(n, t, i);
  };
}
function M(n, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : sn;
  As && As(n, null);
  let i = t.length;
  for (; i--; ) {
    let r = t[i];
    if (typeof r == "string") {
      const s = e(r);
      s !== r && (Pl(t) || (t[i] = s), r = s);
    }
    n[r] = !0;
  }
  return n;
}
function Vl(n) {
  for (let t = 0; t < n.length; t++)
    Wt(n, t) || (n[t] = null);
  return n;
}
function ce(n) {
  const t = mo(null);
  for (const [e, i] of ho(n))
    Wt(n, e) && (Array.isArray(i) ? t[e] = Vl(i) : i && typeof i == "object" && i.constructor === Object ? t[e] = ce(i) : t[e] = i);
  return t;
}
function pi(n, t) {
  for (; n !== null; ) {
    const e = ql(n, t);
    if (e) {
      if (e.get) return ft(e.get);
      if (typeof e.value == "function") return ft(e.value);
    }
    n = Fl(n);
  }
  return function() {
    return null;
  };
}
const Ss = pt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Fn = pt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "slot", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), qn = pt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Wl = pt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Hn = pt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), zl = pt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Ls = pt(["#text"]), ws = pt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Un = pt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Cs = pt(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Vi = pt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Kl = It(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Gl = It(/<%[\w\W]*|[\w\W]*%>/gm), Jl = It(/\$\{[\w\W]*/gm), Yl = It(/^data-[\-\w.\u00B7-\uFFFF]+$/), Xl = It(/^aria-[\-\w]+$/), po = It(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Ql = It(/^(?:\w+script|data):/i), Zl = It(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), fo = It(/^html$/i), tc = It(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Ts = Object.freeze({ __proto__: null, ARIA_ATTR: Xl, ATTR_WHITESPACE: Zl, CUSTOM_ELEMENT: tc, DATA_ATTR: Yl, DOCTYPE_NAME: fo, ERB_EXPR: Gl, IS_ALLOWED_URI: po, IS_SCRIPT_OR_DATA: Ql, MUSTACHE_EXPR: Kl, TMPLIT_EXPR: Jl });
const ec = 1, ic = 3, nc = 7, rc = 8, sc = 9, ac = function() {
  return typeof window > "u" ? null : window;
};
var Ze = (function n() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ac();
  const e = (d) => n(d);
  if (e.version = "3.2.7", e.removed = [], !t || !t.document || t.document.nodeType !== sc || !t.Element) return e.isSupported = !1, e;
  let { document: i } = t;
  const r = i, s = r.currentScript, { DocumentFragment: a, HTMLTemplateElement: o, Node: l, Element: c, NodeFilter: h, NamedNodeMap: b = t.NamedNodeMap || t.MozNamedAttrMap, HTMLFormElement: g, DOMParser: p, trustedTypes: _ } = t, f = c.prototype, A = pi(f, "cloneNode"), w = pi(f, "remove"), T = pi(f, "nextSibling"), C = pi(f, "childNodes"), u = pi(f, "parentNode");
  if (typeof o == "function") {
    const d = i.createElement("template");
    d.content && d.content.ownerDocument && (i = d.content.ownerDocument);
  }
  let x, v = "";
  const { implementation: O, createNodeIterator: j, createDocumentFragment: z, getElementsByTagName: K } = i, { importNode: X } = r;
  let D = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  e.isSupported = typeof ho == "function" && typeof u == "function" && O && O.createHTMLDocument !== void 0;
  const { MUSTACHE_EXPR: V, ERB_EXPR: at, TMPLIT_EXPR: ot, DATA_ATTR: rt, ARIA_ATTR: st, IS_SCRIPT_OR_DATA: it, ATTR_WHITESPACE: _t, CUSTOM_ELEMENT: St } = Ts;
  let { IS_ALLOWED_URI: Gt } = Ts, U = null;
  const Jt = M({}, [...Ss, ...Fn, ...qn, ...Hn, ...Ls]);
  let W = null;
  const gt = M({}, [...ws, ...Un, ...Cs, ...Vi]);
  let q = Object.seal(mo(null, { tagNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, attributeNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, allowCustomizedBuiltInElements: { writable: !0, configurable: !1, enumerable: !0, value: !1 } })), Lt = null, At = null, ee = !0, wt = !0, ie = !1, Le = !0, Ct = !1, ne = !0, Tt = !1, re = !1, se = !1, Bt = !1, ae = !1, bt = !1, Nt = !0, me = !1, Pt = !0, Ft = !1, qt = {}, Ht = null;
  const we = M({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Ce = null;
  const qi = M({}, ["audio", "video", "img", "source", "image", "track"]);
  let li = null;
  const Hi = M({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), ze = "http://www.w3.org/1998/Math/MathML", Ke = "http://www.w3.org/2000/svg", m = "http://www.w3.org/1999/xhtml";
  let E = m, L = !1, F = null;
  const B = M({}, [ze, Ke, m], Nn);
  let tt = M({}, ["mi", "mo", "mn", "ms", "mtext"]), lt = M({}, ["annotation-xml"]);
  const pe = M({}, ["title", "style", "font", "a", "script"]);
  let fe = null;
  const oe = ["application/xhtml+xml", "text/html"];
  let Y = null, Ut = null;
  const ge = i.createElement("form"), Ui = function(d) {
    return d instanceof RegExp || d instanceof Function;
  }, Te = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!Ut || Ut !== d) {
      if (d && typeof d == "object" || (d = {}), d = ce(d), fe = oe.indexOf(d.PARSER_MEDIA_TYPE) === -1 ? "text/html" : d.PARSER_MEDIA_TYPE, Y = fe === "application/xhtml+xml" ? Nn : sn, U = Wt(d, "ALLOWED_TAGS") ? M({}, d.ALLOWED_TAGS, Y) : Jt, W = Wt(d, "ALLOWED_ATTR") ? M({}, d.ALLOWED_ATTR, Y) : gt, F = Wt(d, "ALLOWED_NAMESPACES") ? M({}, d.ALLOWED_NAMESPACES, Nn) : B, li = Wt(d, "ADD_URI_SAFE_ATTR") ? M(ce(Hi), d.ADD_URI_SAFE_ATTR, Y) : Hi, Ce = Wt(d, "ADD_DATA_URI_TAGS") ? M(ce(qi), d.ADD_DATA_URI_TAGS, Y) : qi, Ht = Wt(d, "FORBID_CONTENTS") ? M({}, d.FORBID_CONTENTS, Y) : we, Lt = Wt(d, "FORBID_TAGS") ? M({}, d.FORBID_TAGS, Y) : ce({}), At = Wt(d, "FORBID_ATTR") ? M({}, d.FORBID_ATTR, Y) : ce({}), qt = !!Wt(d, "USE_PROFILES") && d.USE_PROFILES, ee = d.ALLOW_ARIA_ATTR !== !1, wt = d.ALLOW_DATA_ATTR !== !1, ie = d.ALLOW_UNKNOWN_PROTOCOLS || !1, Le = d.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ct = d.SAFE_FOR_TEMPLATES || !1, ne = d.SAFE_FOR_XML !== !1, Tt = d.WHOLE_DOCUMENT || !1, Bt = d.RETURN_DOM || !1, ae = d.RETURN_DOM_FRAGMENT || !1, bt = d.RETURN_TRUSTED_TYPE || !1, se = d.FORCE_BODY || !1, Nt = d.SANITIZE_DOM !== !1, me = d.SANITIZE_NAMED_PROPS || !1, Pt = d.KEEP_CONTENT !== !1, Ft = d.IN_PLACE || !1, Gt = d.ALLOWED_URI_REGEXP || po, E = d.NAMESPACE || m, tt = d.MATHML_TEXT_INTEGRATION_POINTS || tt, lt = d.HTML_INTEGRATION_POINTS || lt, q = d.CUSTOM_ELEMENT_HANDLING || {}, d.CUSTOM_ELEMENT_HANDLING && Ui(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (q.tagNameCheck = d.CUSTOM_ELEMENT_HANDLING.tagNameCheck), d.CUSTOM_ELEMENT_HANDLING && Ui(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (q.attributeNameCheck = d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), d.CUSTOM_ELEMENT_HANDLING && typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (q.allowCustomizedBuiltInElements = d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Ct && (wt = !1), ae && (Bt = !0), qt && (U = M({}, Ls), W = [], qt.html === !0 && (M(U, Ss), M(W, ws)), qt.svg === !0 && (M(U, Fn), M(W, Un), M(W, Vi)), qt.svgFilters === !0 && (M(U, qn), M(W, Un), M(W, Vi)), qt.mathMl === !0 && (M(U, Hn), M(W, Cs), M(W, Vi))), d.ADD_TAGS && (U === Jt && (U = ce(U)), M(U, d.ADD_TAGS, Y)), d.ADD_ATTR && (W === gt && (W = ce(W)), M(W, d.ADD_ATTR, Y)), d.ADD_URI_SAFE_ATTR && M(li, d.ADD_URI_SAFE_ATTR, Y), d.FORBID_CONTENTS && (Ht === we && (Ht = ce(Ht)), M(Ht, d.FORBID_CONTENTS, Y)), Pt && (U["#text"] = !0), Tt && M(U, ["html", "head", "body"]), U.table && (M(U, ["tbody"]), delete Lt.tbody), d.TRUSTED_TYPES_POLICY) {
        if (typeof d.TRUSTED_TYPES_POLICY.createHTML != "function") throw mi('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof d.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw mi('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        x = d.TRUSTED_TYPES_POLICY, v = x.createHTML("");
      } else x === void 0 && (x = (function(S, y) {
        if (typeof S != "object" || typeof S.createPolicy != "function") return null;
        let N = null;
        const H = "data-tt-policy-suffix";
        y && y.hasAttribute(H) && (N = y.getAttribute(H));
        const R = "dompurify" + (N ? "#" + N : "");
        try {
          return S.createPolicy(R, { createHTML: (nt) => nt, createScriptURL: (nt) => nt });
        } catch {
          return console.warn("TrustedTypes policy " + R + " could not be created."), null;
        }
      })(_, s)), x !== null && typeof v == "string" && (v = x.createHTML(""));
      pt && pt(d), Ut = d;
    }
  }, ke = M({}, [...Fn, ...qn, ...Wl]), is = M({}, [...Hn, ...zl]), Yt = function(d) {
    ui(e.removed, { element: d });
    try {
      u(d).removeChild(d);
    } catch {
      w(d);
    }
  }, Re = function(d, S) {
    try {
      ui(e.removed, { attribute: S.getAttributeNode(d), from: S });
    } catch {
      ui(e.removed, { attribute: null, from: S });
    }
    if (S.removeAttribute(d), d === "is") if (Bt || ae) try {
      Yt(S);
    } catch {
    }
    else try {
      S.setAttribute(d, "");
    } catch {
    }
  }, ns = function(d) {
    let S = null, y = null;
    if (se) d = "<remove></remove>" + d;
    else {
      const R = Pn(d, /^[\r\n\t ]+/);
      y = R && R[0];
    }
    fe === "application/xhtml+xml" && E === m && (d = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + d + "</body></html>");
    const N = x ? x.createHTML(d) : d;
    if (E === m) try {
      S = new p().parseFromString(N, fe);
    } catch {
    }
    if (!S || !S.documentElement) {
      S = O.createDocument(E, "template", null);
      try {
        S.documentElement.innerHTML = L ? v : N;
      } catch {
      }
    }
    const H = S.body || S.documentElement;
    return d && y && H.insertBefore(i.createTextNode(y), H.childNodes[0] || null), E === m ? K.call(S, Tt ? "html" : "body")[0] : Tt ? S.documentElement : H;
  }, rs = function(d) {
    return j.call(d.ownerDocument || d, d, h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION, null);
  }, xn = function(d) {
    return d instanceof g && (typeof d.nodeName != "string" || typeof d.textContent != "string" || typeof d.removeChild != "function" || !(d.attributes instanceof b) || typeof d.removeAttribute != "function" || typeof d.setAttribute != "function" || typeof d.namespaceURI != "string" || typeof d.insertBefore != "function" || typeof d.hasChildNodes != "function");
  }, ss = function(d) {
    return typeof l == "function" && d instanceof l;
  };
  function le(d, S, y) {
    ji(d, ((N) => {
      N.call(e, S, y, Ut);
    }));
  }
  const as = function(d) {
    let S = null;
    if (le(D.beforeSanitizeElements, d, null), xn(d)) return Yt(d), !0;
    const y = Y(d.nodeName);
    if (le(D.uponSanitizeElement, d, { tagName: y, allowedTags: U }), ne && d.hasChildNodes() && !ss(d.firstElementChild) && ut(/<[/\w!]/g, d.innerHTML) && ut(/<[/\w!]/g, d.textContent) || d.nodeType === nc || ne && d.nodeType === rc && ut(/<[/\w]/g, d.data)) return Yt(d), !0;
    if (!U[y] || Lt[y]) {
      if (!Lt[y] && ls(y) && (q.tagNameCheck instanceof RegExp && ut(q.tagNameCheck, y) || q.tagNameCheck instanceof Function && q.tagNameCheck(y)))
        return !1;
      if (Pt && !Ht[y]) {
        const N = u(d) || d.parentNode, H = C(d) || d.childNodes;
        if (H && N)
          for (let R = H.length - 1; R >= 0; --R) {
            const nt = A(H[R], !0);
            nt.__removalCount = (d.__removalCount || 0) + 1, N.insertBefore(nt, T(d));
          }
      }
      return Yt(d), !0;
    }
    return d instanceof c && !(function(N) {
      let H = u(N);
      H && H.tagName || (H = { namespaceURI: E, tagName: "template" });
      const R = sn(N.tagName), nt = sn(H.tagName);
      return !!F[N.namespaceURI] && (N.namespaceURI === Ke ? H.namespaceURI === m ? R === "svg" : H.namespaceURI === ze ? R === "svg" && (nt === "annotation-xml" || tt[nt]) : !!ke[R] : N.namespaceURI === ze ? H.namespaceURI === m ? R === "math" : H.namespaceURI === Ke ? R === "math" && lt[nt] : !!is[R] : N.namespaceURI === m ? !(H.namespaceURI === Ke && !lt[nt]) && !(H.namespaceURI === ze && !tt[nt]) && !is[R] && (pe[R] || !ke[R]) : !(fe !== "application/xhtml+xml" || !F[N.namespaceURI]));
    })(d) ? (Yt(d), !0) : y !== "noscript" && y !== "noembed" && y !== "noframes" || !ut(/<\/no(script|embed|frames)/i, d.innerHTML) ? (Ct && d.nodeType === ic && (S = d.textContent, ji([V, at, ot], ((N) => {
      S = hi(S, N, " ");
    })), d.textContent !== S && (ui(e.removed, { element: d.cloneNode() }), d.textContent = S)), le(D.afterSanitizeElements, d, null), !1) : (Yt(d), !0);
  }, os = function(d, S, y) {
    if (Nt && (S === "id" || S === "name") && (y in i || y in ge)) return !1;
    if (!(wt && !At[S] && ut(rt, S))) {
      if (!(ee && ut(st, S))) {
        if (!W[S] || At[S]) {
          if (!(ls(d) && (q.tagNameCheck instanceof RegExp && ut(q.tagNameCheck, d) || q.tagNameCheck instanceof Function && q.tagNameCheck(d)) && (q.attributeNameCheck instanceof RegExp && ut(q.attributeNameCheck, S) || q.attributeNameCheck instanceof Function && q.attributeNameCheck(S, d)) || S === "is" && q.allowCustomizedBuiltInElements && (q.tagNameCheck instanceof RegExp && ut(q.tagNameCheck, y) || q.tagNameCheck instanceof Function && q.tagNameCheck(y)))) return !1;
        } else if (!li[S]) {
          if (!ut(Gt, hi(y, _t, ""))) {
            if ((S !== "src" && S !== "xlink:href" && S !== "href" || d === "script" || $l(y, "data:") !== 0 || !Ce[d]) && !(ie && !ut(it, hi(y, _t, "")))) {
              if (y) return !1;
            }
          }
        }
      }
    }
    return !0;
  }, ls = function(d) {
    return d !== "annotation-xml" && Pn(d, St);
  }, cs = function(d) {
    le(D.beforeSanitizeAttributes, d, null);
    const { attributes: S } = d;
    if (!S || xn(d)) return;
    const y = { attrName: "", attrValue: "", keepAttr: !0, allowedAttributes: W, forceKeepAttr: void 0 };
    let N = S.length;
    for (; N--; ) {
      const H = S[N], { name: R, namespaceURI: nt, value: be } = H, $t = Y(R), Sn = be;
      let ct = R === "value" ? Sn : jl(Sn);
      if (y.attrName = $t, y.attrValue = ct, y.keepAttr = !0, y.forceKeepAttr = void 0, le(D.uponSanitizeAttribute, d, y), ct = y.attrValue, !me || $t !== "id" && $t !== "name" || (Re(R, d), ct = "user-content-" + ct), ne && ut(/((--!?|])>)|<\/(style|title|textarea)/i, ct)) {
        Re(R, d);
        continue;
      }
      if ($t === "attributename" && Pn(ct, "href")) {
        Re(R, d);
        continue;
      }
      if (y.forceKeepAttr) continue;
      if (!y.keepAttr) {
        Re(R, d);
        continue;
      }
      if (!Le && ut(/\/>/i, ct)) {
        Re(R, d);
        continue;
      }
      Ct && ji([V, at, ot], ((us) => {
        ct = hi(ct, us, " ");
      }));
      const ds = Y(d.nodeName);
      if (os(ds, $t, ct)) {
        if (x && typeof _ == "object" && typeof _.getAttributeType == "function" && !nt) switch (_.getAttributeType(ds, $t)) {
          case "TrustedHTML":
            ct = x.createHTML(ct);
            break;
          case "TrustedScriptURL":
            ct = x.createScriptURL(ct);
        }
        if (ct !== Sn) try {
          nt ? d.setAttributeNS(nt, R, ct) : d.setAttribute(R, ct), xn(d) ? Yt(d) : Es(e.removed);
        } catch {
          Re(R, d);
        }
      } else Re(R, d);
    }
    le(D.afterSanitizeAttributes, d, null);
  }, ml = function d(S) {
    let y = null;
    const N = rs(S);
    for (le(D.beforeSanitizeShadowDOM, S, null); y = N.nextNode(); ) le(D.uponSanitizeShadowNode, y, null), as(y), cs(y), y.content instanceof a && d(y.content);
    le(D.afterSanitizeShadowDOM, S, null);
  };
  return e.sanitize = function(d) {
    let S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, y = null, N = null, H = null, R = null;
    if (L = !d, L && (d = "<!-->"), typeof d != "string" && !ss(d)) {
      if (typeof d.toString != "function") throw mi("toString is not a function");
      if (typeof (d = d.toString()) != "string") throw mi("dirty is not a string, aborting");
    }
    if (!e.isSupported) return d;
    if (re || Te(S), e.removed = [], typeof d == "string" && (Ft = !1), Ft) {
      if (d.nodeName) {
        const $t = Y(d.nodeName);
        if (!U[$t] || Lt[$t]) throw mi("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof l) y = ns("<!---->"), N = y.ownerDocument.importNode(d, !0), N.nodeType === ec && N.nodeName === "BODY" || N.nodeName === "HTML" ? y = N : y.appendChild(N);
    else {
      if (!Bt && !Ct && !Tt && d.indexOf("<") === -1) return x && bt ? x.createHTML(d) : d;
      if (y = ns(d), !y) return Bt ? null : bt ? v : "";
    }
    y && se && Yt(y.firstChild);
    const nt = rs(Ft ? d : y);
    for (; H = nt.nextNode(); ) as(H), cs(H), H.content instanceof a && ml(H.content);
    if (Ft) return d;
    if (Bt) {
      if (ae) for (R = z.call(y.ownerDocument); y.firstChild; ) R.appendChild(y.firstChild);
      else R = y;
      return (W.shadowroot || W.shadowrootmode) && (R = X.call(r, R, !0)), R;
    }
    let be = Tt ? y.outerHTML : y.innerHTML;
    return Tt && U["!doctype"] && y.ownerDocument && y.ownerDocument.doctype && y.ownerDocument.doctype.name && ut(fo, y.ownerDocument.doctype.name) && (be = "<!DOCTYPE " + y.ownerDocument.doctype.name + `>
` + be), Ct && ji([V, at, ot], (($t) => {
      be = hi(be, $t, " ");
    })), x && bt ? x.createHTML(be) : be;
  }, e.setConfig = function() {
    Te(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), re = !0;
  }, e.clearConfig = function() {
    Ut = null, re = !1;
  }, e.isValidAttribute = function(d, S, y) {
    Ut || Te({});
    const N = Y(d), H = Y(S);
    return os(N, H, y);
  }, e.addHook = function(d, S) {
    typeof S == "function" && ui(D[d], S);
  }, e.removeHook = function(d, S) {
    if (S !== void 0) {
      const y = Hl(D[d], S);
      return y === -1 ? void 0 : Ul(D[d], y, 1)[0];
    }
    return Es(D[d]);
  }, e.removeHooks = function(d) {
    D[d] = [];
  }, e.removeAllHooks = function() {
    D = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  }, e;
})();
Ze.addHook("uponSanitizeAttribute", (function(n, t) {
  if (t.attrName === "data-trix-serialized-attributes") return void (t.keepAttr = !1);
  /^data-trix-/.test(t.attrName) && (t.forceKeepAttr = !0);
}));
const oc = "style href src width height language class".split(" "), lc = "javascript:".split(" "), cc = "script iframe form noscript".split(" ");
class gn extends et {
  static setHTML(t, e, i) {
    const r = new this(e, i).sanitize(), s = r.getHTML ? r.getHTML() : r.outerHTML;
    t.innerHTML = s;
  }
  static sanitize(t, e) {
    const i = new this(t, e);
    return i.sanitize(), i;
  }
  constructor(t) {
    let { allowedAttributes: e, forbiddenProtocols: i, forbiddenElements: r, purifyOptions: s } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.allowedAttributes = e || oc, this.forbiddenProtocols = i || lc, this.forbiddenElements = r || cc, this.purifyOptions = s || {}, this.body = dc(t);
  }
  sanitize() {
    this.sanitizeElements(), this.normalizeListElementNesting();
    const t = Object.assign({}, Xa, this.purifyOptions);
    return Ze.setConfig(t), this.body = Ze.sanitize(this.body), this.body;
  }
  getHTML() {
    return this.body.innerHTML;
  }
  getBody() {
    return this.body;
  }
  sanitizeElements() {
    const t = on(this.body), e = [];
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
    return e.forEach(((i) => xe(i))), this.body;
  }
  sanitizeElement(t) {
    return t.hasAttribute("href") && this.forbiddenProtocols.includes(t.protocol) && t.removeAttribute("href"), Array.from(t.attributes).forEach(((e) => {
      let { name: i } = e;
      this.allowedAttributes.includes(i) || i.indexOf("data-trix") === 0 || t.removeAttribute(i);
    })), t;
  }
  normalizeListElementNesting() {
    return Array.from(this.body.querySelectorAll("ul,ol")).forEach(((t) => {
      const e = t.previousElementSibling;
      e && ht(e) === "li" && e.appendChild(t);
    })), this.body;
  }
  elementIsRemovable(t) {
    if (t?.nodeType === Node.ELEMENT_NODE) return this.elementIsForbidden(t) || this.elementIsntSerializable(t);
  }
  elementIsForbidden(t) {
    return this.forbiddenElements.includes(ht(t));
  }
  elementIsntSerializable(t) {
    return t.getAttribute("data-trix-serialize") === "false" && !Ne(t);
  }
}
const dc = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  n = n.replace(/<\/html[^>]*>[^]*$/i, "</html>");
  const t = document.implementation.createHTMLDocument("");
  return t.documentElement.innerHTML = n, Array.from(t.head.querySelectorAll("style")).forEach(((e) => {
    t.body.appendChild(e);
  })), t.body;
}, { css: ve } = Ni;
class Vr extends Ve {
  constructor() {
    super(...arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
  }
  createContentNodes() {
    return [];
  }
  createNodes() {
    let t;
    const e = t = I({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: !1 }), i = this.getHref();
    return i && (t = I({ tagName: "a", editable: !1, attributes: { href: i, tabindex: -1 } }), e.appendChild(t)), this.attachment.hasContent() ? gn.setHTML(t, this.attachment.getContent()) : this.createContentNodes().forEach(((r) => {
      t.appendChild(r);
    })), t.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = I({ tagName: "progress", attributes: { class: ve.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: !0, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e.appendChild(this.progressElement)), [ks("left"), e, ks("right")];
  }
  createCaptionElement() {
    const t = I({ tagName: "figcaption", className: ve.attachmentCaption }), e = this.attachmentPiece.getCaption();
    if (e) t.classList.add("".concat(ve.attachmentCaption, "--edited")), t.textContent = e;
    else {
      let i, r;
      const s = this.getCaptionConfig();
      if (s.name && (i = this.attachment.getFilename()), s.size && (r = this.attachment.getFormattedFilesize()), i) {
        const a = I({ tagName: "span", className: ve.attachmentName, textContent: i });
        t.appendChild(a);
      }
      if (r) {
        i && t.appendChild(document.createTextNode(" "));
        const a = I({ tagName: "span", className: ve.attachmentSize, textContent: r });
        t.appendChild(a);
      }
    }
    return t;
  }
  getClassName() {
    const t = [ve.attachment, "".concat(ve.attachment, "--").concat(this.attachment.getType())], e = this.attachment.getExtension();
    return e && t.push("".concat(ve.attachment, "--").concat(e)), t.join(" ");
  }
  getData() {
    const t = { trixAttachment: JSON.stringify(this.attachment), trixContentType: this.attachment.getContentType(), trixId: this.attachment.id }, { attributes: e } = this.attachmentPiece;
    return e.isEmpty() || (t.trixAttributes = JSON.stringify(e)), this.attachment.isPending() && (t.trixSerialize = !1), t;
  }
  getHref() {
    if (!uc(this.attachment.getContent(), "a")) {
      const t = this.attachment.getHref();
      if (t && Ze.isValidAttribute("a", "href", t)) return t;
    }
  }
  getCaptionConfig() {
    var t;
    const e = this.attachment.getType(), i = oo((t = Br[e]) === null || t === void 0 ? void 0 : t.caption);
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
const ks = (n) => I({ tagName: "span", textContent: fn, data: { trixCursorTarget: n, trixSerialize: !1 } }), uc = function(n, t) {
  const e = I("div");
  return gn.setHTML(e, n || ""), e.querySelector(t);
};
class go extends Vr {
  constructor() {
    super(...arguments), this.attachment.previewDelegate = this;
  }
  createContentNodes() {
    return this.image = I({ tagName: "img", attributes: { src: "" }, data: { trixMutable: !0 } }), this.refresh(this.image), [this.image];
  }
  createCaptionElement() {
    const t = super.createCaptionElement(...arguments);
    return t.textContent || t.setAttribute("data-trix-placeholder", k.captionPlaceholder), t;
  }
  refresh(t) {
    var e;
    if (t || (t = (e = this.findElement()) === null || e === void 0 ? void 0 : e.querySelector("img")), t) return this.updateAttributesForImage(t);
  }
  updateAttributesForImage(t) {
    const e = this.attachment.getURL(), i = this.attachment.getPreviewURL();
    if (t.src = i || e, i === e) t.removeAttribute("data-trix-serialized-attributes");
    else {
      const l = JSON.stringify({ src: e });
      t.setAttribute("data-trix-serialized-attributes", l);
    }
    const r = this.attachment.getWidth(), s = this.attachment.getHeight(), a = this.attachment.getAttribute("alt");
    r != null && (t.width = r), s != null && (t.height = s), a != null && (t.alt = a);
    const o = ["imageElement", this.attachment.id, t.src, t.width, t.height].join("/");
    t.dataset.trixStoreKey = o;
  }
  attachmentDidChangeAttributes() {
    return this.refresh(this.image), this.refresh();
  }
}
class bo extends Ve {
  constructor() {
    super(...arguments), this.piece = this.object, this.attributes = this.piece.getAttributes(), this.textConfig = this.options.textConfig, this.context = this.options.context, this.piece.attachment ? this.attachment = this.piece.attachment : this.string = this.piece.toString();
  }
  createNodes() {
    let t = this.attachment ? this.createAttachmentNodes() : this.createStringNodes();
    const e = this.createElement();
    if (e) {
      const i = (function(r) {
        for (; (s = r) !== null && s !== void 0 && s.firstElementChild; ) {
          var s;
          r = r.firstElementChild;
        }
        return r;
      })(e);
      Array.from(t).forEach(((r) => {
        i.appendChild(r);
      })), t = [e];
    }
    return t;
  }
  createAttachmentNodes() {
    const t = this.attachment.isPreviewable() ? go : Vr;
    return this.createChildView(t, this.piece.attachment, { piece: this.piece }).getNodes();
  }
  createStringNodes() {
    var t;
    if ((t = this.textConfig) !== null && t !== void 0 && t.plaintext) return [document.createTextNode(this.string)];
    {
      const e = [], i = this.string.split(`
`);
      for (let r = 0; r < i.length; r++) {
        const s = i[r];
        if (r > 0) {
          const a = I("br");
          e.push(a);
        }
        if (s.length) {
          const a = document.createTextNode(this.preserveSpaces(s));
          e.push(a);
        }
      }
      return e;
    }
  }
  createElement() {
    let t, e, i;
    const r = {};
    for (e in this.attributes) {
      i = this.attributes[e];
      const a = Ar(e);
      if (a) {
        if (a.tagName) {
          var s;
          const o = I(a.tagName);
          s ? (s.appendChild(o), s = o) : t = s = o;
        }
        if (a.styleProperty && (r[a.styleProperty] = i), a.style) for (e in a.style) i = a.style[e], r[e] = i;
      }
    }
    if (Object.keys(r).length) for (e in t || (t = I("span")), r) i = r[e], t.style[e] = i;
    return t;
  }
  createContainerElement() {
    for (const t in this.attributes) {
      const e = this.attributes[t], i = Ar(t);
      if (i && i.groupTagName) {
        const r = {};
        return r[t] = e, I(i.groupTagName, r);
      }
    }
  }
  preserveSpaces(t) {
    return this.context.isLast && (t = t.replace(/\ $/, Ae)), t = t.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(Ae, " $2")).replace(/\ {2}/g, "".concat(Ae, " ")).replace(/\ {2}/g, " ".concat(Ae)), (this.context.isFirst || this.context.followsWhitespace) && (t = t.replace(/^\ /, Ae)), t;
  }
}
class vo extends Ve {
  constructor() {
    super(...arguments), this.text = this.object, this.textConfig = this.options.textConfig;
  }
  createNodes() {
    const t = [], e = jr.groupObjects(this.getPieces()), i = e.length - 1;
    for (let s = 0; s < e.length; s++) {
      const a = e[s], o = {};
      s === 0 && (o.isFirst = !0), s === i && (o.isLast = !0), hc(r) && (o.followsWhitespace = !0);
      const l = this.findOrCreateCachedChildView(bo, a, { textConfig: this.textConfig, context: o });
      t.push(...Array.from(l.getNodes() || []));
      var r = a;
    }
    return t;
  }
  getPieces() {
    return Array.from(this.text.getPieces()).filter(((t) => !t.hasAttribute("blockBreak")));
  }
}
const hc = (n) => /\s$/.test(n?.toString()), { css: Rs } = Ni;
class yo extends Ve {
  constructor() {
    super(...arguments), this.block = this.object, this.attributes = this.block.getAttributes();
  }
  createNodes() {
    const t = [document.createComment("block")];
    if (this.block.isEmpty()) t.push(I("br"));
    else {
      var e;
      const i = (e = Z(this.block.getLastAttribute())) === null || e === void 0 ? void 0 : e.text, r = this.findOrCreateCachedChildView(vo, this.block.text, { textConfig: i });
      t.push(...Array.from(r.getNodes() || [])), this.shouldAddExtraNewlineElement() && t.push(I("br"));
    }
    if (this.attributes.length) return t;
    {
      let i;
      const { tagName: r } = mt.default;
      this.block.isRTL() && (i = { dir: "rtl" });
      const s = I({ tagName: r, attributes: i });
      return t.forEach(((a) => s.appendChild(a))), [s];
    }
  }
  createContainerElement(t) {
    const e = {};
    let i;
    const r = this.attributes[t], { tagName: s, htmlAttributes: a = [] } = Z(r);
    if (t === 0 && this.block.isRTL() && Object.assign(e, { dir: "rtl" }), r === "attachmentGallery") {
      const o = this.block.getBlockBreakPosition();
      i = "".concat(Rs.attachmentGallery, " ").concat(Rs.attachmentGallery, "--").concat(o);
    }
    return Object.entries(this.block.htmlAttributes).forEach(((o) => {
      let [l, c] = o;
      a.includes(l) && (e[l] = c);
    })), I({ tagName: s, className: i, attributes: e });
  }
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }
}
class bn extends Ve {
  static render(t) {
    const e = I("div"), i = new this(t, { element: e });
    return i.render(), i.sync(), e;
  }
  constructor() {
    super(...arguments), this.element = this.options.element, this.elementStore = new Bl(), this.setDocument(this.object);
  }
  setDocument(t) {
    t.isEqualTo(this.document) || (this.document = this.object = t);
  }
  render() {
    if (this.childViews = [], this.shadowElement = I("div"), !this.document.isEmpty()) {
      const t = jr.groupObjects(this.document.getBlocks(), { asTree: !0 });
      Array.from(t).forEach(((e) => {
        const i = this.findOrCreateCachedChildView(yo, e);
        Array.from(i.getNodes()).map(((r) => this.shadowElement.appendChild(r)));
      }));
    }
  }
  isSynced() {
    return mc(this.shadowElement, this.element);
  }
  sync() {
    const t = to("trix-before-render", { cancelable: !1, attributes: { render: (i, r) => {
      for (; i.lastChild; ) i.removeChild(i.lastChild);
      i.appendChild(r);
    } } });
    this.element.dispatchEvent(t);
    const e = this.createDocumentFragmentForSync();
    return t.render(this.element, e), this.didSync();
  }
  didSync() {
    return this.elementStore.reset(Ds(this.element)), Hr((() => this.garbageCollectCachedViews()));
  }
  createDocumentFragmentForSync() {
    const t = document.createDocumentFragment();
    return Array.from(this.shadowElement.childNodes).forEach(((e) => {
      t.appendChild(e.cloneNode(!0));
    })), Array.from(Ds(t)).forEach(((e) => {
      const i = this.elementStore.remove(e);
      i && e.parentNode.replaceChild(i, e);
    })), t;
  }
}
const Ds = (n) => n.querySelectorAll("[data-trix-store-key]"), mc = (n, t) => Is(n.innerHTML) === Is(t.innerHTML), Is = (n) => n.replace(/&nbsp;/g, " ");
function pc(n) {
  var t = (function(e, i) {
    if (typeof e != "object" || !e) return e;
    var r = e[Symbol.toPrimitive];
    if (r !== void 0) {
      var s = r.call(e, i);
      if (typeof s != "object") return s;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (i === "string" ? String : Number)(e);
  })(n, "string");
  return typeof t == "symbol" ? t : String(t);
}
function dt(n, t, e) {
  return (t = pc(t)) in n ? Object.defineProperty(n, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : n[t] = e, n;
}
function P(n, t) {
  return fc(n, _o(n, t, "get"));
}
function Si(n, t, e) {
  return gc(n, _o(n, t, "set"), e), e;
}
function _o(n, t, e) {
  if (!t.has(n)) throw new TypeError("attempted to " + e + " private field on non-instance");
  return t.get(n);
}
function fc(n, t) {
  return t.get ? t.get.call(n) : t.value;
}
function gc(n, t, e) {
  if (t.set) t.set.call(n, e);
  else {
    if (!t.writable) throw new TypeError("attempted to set read only private field");
    t.value = e;
  }
}
function Wi(n, t, e) {
  if (!t.has(n)) throw new TypeError("attempted to get private field on non-instance");
  return e;
}
function Ao(n, t) {
  if (t.has(n)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Qe(n, t, e) {
  Ao(n, t), t.set(n, e);
}
class We extends je {
  static registerType(t, e) {
    e.type = t, this.types[t] = e;
  }
  static fromJSON(t) {
    const e = this.types[t.type];
    if (e) return e.fromJSON(t);
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.attributes = Et.box(e);
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
dt(We, "types", {});
class Eo extends cn {
  constructor(t) {
    super(...arguments), this.url = t;
  }
  perform(t) {
    const e = new Image();
    e.onload = () => (e.width = this.width = e.naturalWidth, e.height = this.height = e.naturalHeight, t(!0, e)), e.onerror = () => t(!1), e.src = this.url;
  }
}
class ai extends je {
  static attachmentForFile(t) {
    const e = new this(this.attributesForFile(t));
    return e.setFile(t), e;
  }
  static attributesForFile(t) {
    return new Et({ filename: t.name, filesize: t.size, contentType: t.type });
  }
  static fromJSON(t) {
    return new this(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(t), this.releaseFile = this.releaseFile.bind(this), this.attributes = Et.box(t), this.didChangeAttributes();
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
    var i, r, s, a;
    if (!this.attributes.isEqualTo(e)) return this.attributes = e, this.didChangeAttributes(), (i = this.previewDelegate) === null || i === void 0 || (r = i.attachmentDidChangeAttributes) === null || r === void 0 || r.call(i, this), (s = this.delegate) === null || s === void 0 || (a = s.attachmentDidChangeAttributes) === null || a === void 0 ? void 0 : a.call(s, this);
  }
  didChangeAttributes() {
    if (this.isPreviewable()) return this.preloadURL();
  }
  isPending() {
    return this.file != null && !(this.getURL() || this.getHref());
  }
  isPreviewable() {
    return this.attributes.has("previewable") ? this.attributes.get("previewable") : ai.previewablePattern.test(this.getContentType());
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
    return typeof t == "number" ? Qa.formatter(t) : "";
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
    var e, i, r, s;
    if (t !== this.getPreviewURL()) return this.previewURL = t, (e = this.previewDelegate) === null || e === void 0 || (i = e.attachmentDidChangeAttributes) === null || i === void 0 || i.call(e, this), (r = this.delegate) === null || r === void 0 || (s = r.attachmentDidChangePreviewURL) === null || s === void 0 ? void 0 : s.call(r, this);
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
      return this.preloadingURL = t, new Eo(t).then(((i) => {
        let { width: r, height: s } = i;
        return this.getWidth() && this.getHeight() || this.setAttributes({ width: r, height: s }), this.preloadingURL = null, this.setPreviewURL(t), e?.();
      })).catch((() => (this.preloadingURL = null, e?.())));
  }
}
dt(ai, "previewablePattern", /^image(\/(gif|png|webp|jpe?g)|$)/);
class ti extends We {
  static fromJSON(t) {
    return new this(ai.fromJSON(t.attachment), t.attributes);
  }
  constructor(t) {
    super(...arguments), this.attachment = t, this.length = 1, this.ensureAttachmentExclusivelyHasAttribute("href"), this.attachment.hasContent() || this.removeProhibitedAttributes();
  }
  ensureAttachmentExclusivelyHasAttribute(t) {
    this.hasAttribute(t) && (this.attachment.hasAttribute(t) || this.attachment.setAttributes(this.attributes.slice([t])), this.attributes = this.attributes.remove(t));
  }
  removeProhibitedAttributes() {
    const t = this.attributes.slice(ti.permittedAttributes);
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
dt(ti, "permittedAttributes", ["caption", "presentation"]), We.registerType("attachment", ti);
class Wr extends We {
  static fromJSON(t) {
    const e = { ...t.attributes };
    return e.href && !Ze.isValidAttribute("a", "href", e.href) && delete e.href, new this(t.string, e);
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
We.registerType("string", Wr);
class dn extends je {
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
    return new this.constructor(qr(this.objects, ...e));
  }
  eachObject(t) {
    return this.objects.map(((e, i) => t(e, i)));
  }
  insertObjectAtIndex(t, e) {
    return this.splice(e, 0, t);
  }
  insertSplittableListAtIndex(t, e) {
    return this.splice(e, 0, ...t.objects);
  }
  insertSplittableListAtPosition(t, e) {
    const [i, r] = this.splitObjectAtPosition(e);
    return new this.constructor(i).insertSplittableListAtIndex(t, r);
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
    const [e, i, r] = this.splitObjectsAtRange(t);
    return new this.constructor(e.slice(i, r + 1));
  }
  selectSplittableList(t) {
    const e = this.objects.filter(((i) => t(i)));
    return new this.constructor(e);
  }
  removeObjectsInRange(t) {
    const [e, i, r] = this.splitObjectsAtRange(t);
    return new this.constructor(e).splice(i, r - i + 1);
  }
  transformObjectsInRange(t, e) {
    const [i, r, s] = this.splitObjectsAtRange(t), a = i.map(((o, l) => r <= l && l <= s ? e(o) : o));
    return new this.constructor(a);
  }
  splitObjectsAtRange(t) {
    let e, [i, r, s] = this.splitObjectAtPosition(vc(t));
    return [i, e] = new this.constructor(i).splitObjectAtPosition(yc(t) + s), [i, r, e - 1];
  }
  getObjectAtPosition(t) {
    const { index: e } = this.findIndexAndOffsetAtPosition(t);
    return this.objects[e];
  }
  splitObjectAtPosition(t) {
    let e, i;
    const { index: r, offset: s } = this.findIndexAndOffsetAtPosition(t), a = this.objects.slice(0);
    if (r != null) if (s === 0) e = r, i = 0;
    else {
      const o = this.getObjectAtIndex(r), [l, c] = o.splitAtOffset(s);
      a.splice(r, 1, l, c), e = r + 1, i = l.getLength() - s;
    }
    else e = a.length, i = 0;
    return [a, e, i];
  }
  consolidate() {
    const t = [];
    let e = this.objects[0];
    return this.objects.slice(1).forEach(((i) => {
      var r, s;
      (r = (s = e).canBeConsolidatedWith) !== null && r !== void 0 && r.call(s, i) ? e = e.consolidateWith(i) : (t.push(e), e = i);
    })), e && t.push(e), new this.constructor(t);
  }
  consolidateFromIndexToIndex(t, e) {
    const i = this.objects.slice(0).slice(t, e + 1), r = new this.constructor(i).consolidate().toArray();
    return this.splice(t, i.length, ...r);
  }
  findIndexAndOffsetAtPosition(t) {
    let e, i = 0;
    for (e = 0; e < this.objects.length; e++) {
      const r = i + this.objects[e].getLength();
      if (i <= t && t < r) return { index: e, offset: t - i };
      i = r;
    }
    return { index: null, offset: null };
  }
  findPositionAtIndexAndOffset(t, e) {
    let i = 0;
    for (let r = 0; r < this.objects.length; r++) {
      const s = this.objects[r];
      if (r < t) i += s.getLength();
      else if (r === t) {
        i += e;
        break;
      }
    }
    return i;
  }
  getEndPosition() {
    return this.endPosition == null && (this.endPosition = 0, this.objects.forEach(((t) => this.endPosition += t.getLength()))), this.endPosition;
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
    return super.isEqualTo(...arguments) || bc(this.objects, t?.objects);
  }
  contentsForInspection() {
    return { objects: "[".concat(this.objects.map(((t) => t.inspect())).join(", "), "]") };
  }
}
const bc = function(n) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (n.length !== t.length) return !1;
  let e = !0;
  for (let i = 0; i < n.length; i++) {
    const r = n[i];
    e && !r.isEqualTo(t[i]) && (e = !1);
  }
  return e;
}, vc = (n) => n[0], yc = (n) => n[1];
class zt extends je {
  static textForAttachmentWithAttributes(t, e) {
    return new this([new ti(t, e)]);
  }
  static textForStringWithAttributes(t, e) {
    return new this([new Wr(t, e)]);
  }
  static fromJSON(t) {
    return new this(Array.from(t).map(((e) => We.fromJSON(e))));
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments);
    const e = t.filter(((i) => !i.isEmpty()));
    this.pieceList = new dn(e);
  }
  copy() {
    return this.copyWithPieceList(this.pieceList);
  }
  copyWithPieceList(t) {
    return new this.constructor(t.consolidate().toArray());
  }
  copyUsingObjectMap(t) {
    const e = this.getPieces().map(((i) => t.find(i) || i));
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
    const i = this.getTextAtRange(t), r = i.getLength();
    return t[0] < e && (e -= r), this.removeTextAtRange(t).insertTextAtPosition(i, e);
  }
  addAttributeAtRange(t, e, i) {
    const r = {};
    return r[t] = e, this.addAttributesAtRange(r, i);
  }
  addAttributesAtRange(t, e) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e, ((i) => i.copyWithAdditionalAttributes(t))));
  }
  removeAttributeAtRange(t, e) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e, ((i) => i.copyWithoutAttribute(t))));
  }
  setAttributesAtRange(t, e) {
    return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e, ((i) => i.copyWithAttributes(t))));
  }
  getAttributesAtPosition(t) {
    var e;
    return ((e = this.pieceList.getObjectAtPosition(t)) === null || e === void 0 ? void 0 : e.getAttributes()) || {};
  }
  getCommonAttributes() {
    const t = Array.from(this.pieceList.toArray()).map(((e) => e.getAttributes()));
    return Et.fromCommonAttributesOfObjects(t).toObject();
  }
  getCommonAttributesAtRange(t) {
    return this.getTextAtRange(t).getCommonAttributes() || {};
  }
  getExpandedRangeForAttributeAtOffset(t, e) {
    let i, r = i = e;
    const s = this.getLength();
    for (; r > 0 && this.getCommonAttributesAtRange([r - 1, i])[t]; ) r--;
    for (; i < s && this.getCommonAttributesAtRange([e, i + 1])[t]; ) i++;
    return [r, i];
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
    return this.pieceList.toArray().filter(((t) => !!t.attachment));
  }
  getAttachments() {
    return this.getAttachmentPieces().map(((t) => t.attachment));
  }
  getAttachmentAndPositionById(t) {
    let e = 0;
    for (const r of this.pieceList.toArray()) {
      var i;
      if (((i = r.attachment) === null || i === void 0 ? void 0 : i.id) === t) return { attachment: r.attachment, position: e };
      e += r.length;
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
    const t = this.pieceList.selectSplittableList(((e) => e.isSerializable()));
    return this.copyWithPieceList(t);
  }
  toString() {
    return this.pieceList.toString();
  }
  toJSON() {
    return this.pieceList.toJSON();
  }
  toConsole() {
    return JSON.stringify(this.pieceList.toArray().map(((t) => JSON.parse(t.toConsole()))));
  }
  getDirection() {
    return Ll(this.toString());
  }
  isRTL() {
    return this.getDirection() === "rtl";
  }
}
class Qt extends je {
  static fromJSON(t) {
    return new this(zt.fromJSON(t.text), t.attributes, t.htmlAttributes);
  }
  constructor(t, e, i) {
    super(...arguments), this.text = _c(t || new zt()), this.attributes = e || [], this.htmlAttributes = i || {};
  }
  isEmpty() {
    return this.text.isBlockBreak();
  }
  isEqualTo(t) {
    return !!super.isEqualTo(t) || this.text.isEqualTo(t?.text) && He(this.attributes, t?.attributes) && si(this.htmlAttributes, t?.htmlAttributes);
  }
  copyWithText(t) {
    return new Qt(t, this.attributes, this.htmlAttributes);
  }
  copyWithoutText() {
    return this.copyWithText(null);
  }
  copyWithAttributes(t) {
    return new Qt(this.text, t, this.htmlAttributes);
  }
  copyWithoutAttributes() {
    return this.copyWithAttributes(null);
  }
  copyUsingObjectMap(t) {
    const e = t.find(this.text);
    return e ? this.copyWithText(e) : this.copyWithText(this.text.copyUsingObjectMap(t));
  }
  addAttribute(t) {
    const e = this.attributes.concat(Os(t));
    return this.copyWithAttributes(e);
  }
  addHTMLAttribute(t, e) {
    const i = Object.assign({}, this.htmlAttributes, { [t]: e });
    return new Qt(this.text, this.attributes, i);
  }
  removeAttribute(t) {
    const { listAttribute: e } = Z(t), i = Bs(Bs(this.attributes, t), e);
    return this.copyWithAttributes(i);
  }
  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }
  getLastAttribute() {
    return Ms(this.attributes);
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
    return Ms(this.getNestableAttributes());
  }
  getNestableAttributes() {
    return this.attributes.filter(((t) => Z(t).nestable));
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
      const e = this.attributes.lastIndexOf(t), i = qr(this.attributes, e + 1, 0, ...Os(t));
      return this.copyWithAttributes(i);
    }
    return this;
  }
  getListItemAttributes() {
    return this.attributes.filter(((t) => Z(t).listAttribute));
  }
  isListItem() {
    var t;
    return (t = Z(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.listAttribute;
  }
  isTerminalBlock() {
    var t;
    return (t = Z(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.terminal;
  }
  breaksOnReturn() {
    var t;
    return (t = Z(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.breakOnReturn;
  }
  findLineBreakInDirectionFromPosition(t, e) {
    const i = this.toString();
    let r;
    switch (t) {
      case "forward":
        r = i.indexOf(`
`, e);
        break;
      case "backward":
        r = i.slice(0, e).lastIndexOf(`
`);
    }
    if (r !== -1) return r;
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
    const e = zt.textForStringWithAttributes(`
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
    return xo(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
  }
  canBeGrouped(t) {
    return this.attributes[t];
  }
  canBeGroupedWith(t, e) {
    const i = t.getAttributes(), r = i[e], s = this.attributes[e];
    return s === r && !(Z(s).group === !1 && !(() => {
      if (!$i) {
        $i = [];
        for (const a in mt) {
          const { listAttribute: o } = mt[a];
          o != null && $i.push(o);
        }
      }
      return $i;
    })().includes(i[e + 1])) && (this.getDirection() === t.getDirection() || t.isEmpty());
  }
}
const _c = function(n) {
  return n = Ac(n), n = xc(n);
}, Ac = function(n) {
  let t = !1;
  const e = n.getPieces();
  let i = e.slice(0, e.length - 1);
  const r = e[e.length - 1];
  return r ? (i = i.map(((s) => s.isBlockBreak() ? (t = !0, Sc(s)) : s)), t ? new zt([...i, r]) : n) : n;
}, Ec = zt.textForStringWithAttributes(`
`, { blockBreak: !0 }), xc = function(n) {
  return xo(n) ? n : n.appendText(Ec);
}, xo = function(n) {
  const t = n.getLength();
  return t === 0 ? !1 : n.getTextAtRange([t - 1, t]).isBlockBreak();
}, Sc = (n) => n.copyWithoutAttribute("blockBreak"), Os = function(n) {
  const { listAttribute: t } = Z(n);
  return t ? [t, n] : [n];
}, Ms = (n) => n.slice(-1)[0], Bs = function(n, t) {
  const e = n.lastIndexOf(t);
  return e === -1 ? n : qr(n, e, 1);
};
class Rt extends je {
  static fromJSON(t) {
    return new this(Array.from(t).map(((e) => Qt.fromJSON(e))));
  }
  static fromString(t, e) {
    const i = zt.textForStringWithAttributes(t, e);
    return new this([new Qt(i)]);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), t.length === 0 && (t = [new Qt()]), this.blockList = dn.box(t);
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
    const e = new Ml(t.getObjects());
    return this.copyUsingObjectMap(e);
  }
  copyUsingObjectMap(t) {
    const e = this.getBlocks().map(((i) => t.find(i) || i.copyUsingObjectMap(t)));
    return new this.constructor(e);
  }
  copyWithBaseBlockAttributes() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    const e = this.getBlocks().map(((i) => {
      const r = t.concat(i.getAttributes());
      return i.copyWithAttributes(r);
    }));
    return new this.constructor(e);
  }
  replaceBlock(t, e) {
    const i = this.blockList.indexOf(t);
    return i === -1 ? this : new this.constructor(this.blockList.replaceObjectAtIndex(e, i));
  }
  insertDocumentAtRange(t, e) {
    const { blockList: i } = t;
    e = $(e);
    let [r] = e;
    const { index: s, offset: a } = this.locationFromPosition(r);
    let o = this;
    const l = this.getBlockAtPosition(r);
    return ue(e) && l.isEmpty() && !l.hasAttributes() ? o = new this.constructor(o.blockList.removeObjectAtIndex(s)) : l.getBlockBreakPosition() === a && r++, o = o.removeTextAtRange(e), new this.constructor(o.blockList.insertSplittableListAtPosition(i, r));
  }
  mergeDocumentAtRange(t, e) {
    let i, r;
    e = $(e);
    const [s] = e, a = this.locationFromPosition(s), o = this.getBlockAtIndex(a.index).getAttributes(), l = t.getBaseBlockAttributes(), c = o.slice(-l.length);
    if (He(l, c)) {
      const g = o.slice(0, -l.length);
      i = t.copyWithBaseBlockAttributes(g);
    } else i = t.copy({ consolidateBlocks: !0 }).copyWithBaseBlockAttributes(o);
    const h = i.getBlockCount(), b = i.getBlockAtIndex(0);
    if (He(o, b.getAttributes())) {
      const g = b.getTextWithoutBlockBreak();
      if (r = this.insertTextAtRange(g, e), h > 1) {
        i = new this.constructor(i.getBlocks().slice(1));
        const p = s + g.getLength();
        r = r.insertDocumentAtRange(i, p);
      }
    } else r = this.insertDocumentAtRange(i, e);
    return r;
  }
  insertTextAtRange(t, e) {
    e = $(e);
    const [i] = e, { index: r, offset: s } = this.locationFromPosition(i), a = this.removeTextAtRange(e);
    return new this.constructor(a.blockList.editObjectAtIndex(r, ((o) => o.copyWithText(o.text.insertTextAtPosition(t, s)))));
  }
  removeTextAtRange(t) {
    let e;
    t = $(t);
    const [i, r] = t;
    if (ue(t)) return this;
    const [s, a] = Array.from(this.locationRangeFromRange(t)), o = s.index, l = s.offset, c = this.getBlockAtIndex(o), h = a.index, b = a.offset, g = this.getBlockAtIndex(h);
    if (r - i == 1 && c.getBlockBreakPosition() === l && g.getBlockBreakPosition() !== b && g.text.getStringAtPosition(b) === `
`) e = this.blockList.editObjectAtIndex(h, ((p) => p.copyWithText(p.text.removeTextAtRange([b, b + 1]))));
    else {
      let p;
      const _ = c.text.getTextAtRange([0, l]), f = g.text.getTextAtRange([b, g.getLength()]), A = _.appendText(f);
      p = o !== h && l === 0 && c.getAttributeLevel() >= g.getAttributeLevel() ? g.copyWithText(A) : c.copyWithText(A);
      const w = h + 1 - o;
      e = this.blockList.splice(o, w, p);
    }
    return new this.constructor(e);
  }
  moveTextFromRangeToPosition(t, e) {
    let i;
    t = $(t);
    const [r, s] = t;
    if (r <= e && e <= s) return this;
    let a = this.getDocumentAtRange(t), o = this.removeTextAtRange(t);
    const l = r < e;
    l && (e -= a.getLength());
    const [c, ...h] = a.getBlocks();
    return h.length === 0 ? (i = c.getTextWithoutBlockBreak(), l && (e += 1)) : i = c.text, o = o.insertTextAtRange(i, e), h.length === 0 ? o : (a = new this.constructor(h), e += i.getLength(), o.insertDocumentAtRange(a, e));
  }
  addAttributeAtRange(t, e, i) {
    let { blockList: r } = this;
    return this.eachBlockAtRange(i, ((s, a, o) => r = r.editObjectAtIndex(o, (function() {
      return Z(t) ? s.addAttribute(t, e) : a[0] === a[1] ? s : s.copyWithText(s.text.addAttributeAtRange(t, e, a));
    })))), new this.constructor(r);
  }
  addAttribute(t, e) {
    let { blockList: i } = this;
    return this.eachBlock(((r, s) => i = i.editObjectAtIndex(s, (() => r.addAttribute(t, e))))), new this.constructor(i);
  }
  removeAttributeAtRange(t, e) {
    let { blockList: i } = this;
    return this.eachBlockAtRange(e, (function(r, s, a) {
      Z(t) ? i = i.editObjectAtIndex(a, (() => r.removeAttribute(t))) : s[0] !== s[1] && (i = i.editObjectAtIndex(a, (() => r.copyWithText(r.text.removeAttributeAtRange(t, s)))));
    })), new this.constructor(i);
  }
  updateAttributesForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e), [r] = Array.from(i), { index: s } = this.locationFromPosition(r), a = this.getTextAtIndex(s);
    return new this.constructor(this.blockList.editObjectAtIndex(s, ((o) => o.copyWithText(a.updateAttributesForAttachment(t, e)))));
  }
  removeAttributeForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e);
    return this.removeAttributeAtRange(t, i);
  }
  setHTMLAttributeAtPosition(t, e, i) {
    const r = this.getBlockAtPosition(t), s = r.addHTMLAttribute(e, i);
    return this.replaceBlock(r, s);
  }
  insertBlockBreakAtRange(t) {
    let e;
    t = $(t);
    const [i] = t, { offset: r } = this.locationFromPosition(i), s = this.removeTextAtRange(t);
    return r === 0 && (e = [new Qt()]), new this.constructor(s.blockList.insertSplittableListAtPosition(new dn(e), i));
  }
  applyBlockAttributeAtRange(t, e, i) {
    const r = this.expandRangeToLineBreaksAndSplitBlocks(i);
    let s = r.document;
    i = r.range;
    const a = Z(t);
    if (a.listAttribute) {
      s = s.removeLastListAttributeAtRange(i, { exceptAttributeName: t });
      const o = s.convertLineBreaksToBlockBreaksInRange(i);
      s = o.document, i = o.range;
    } else s = a.exclusive ? s.removeBlockAttributesAtRange(i) : a.terminal ? s.removeLastTerminalAttributeAtRange(i) : s.consolidateBlocksAtRange(i);
    return s.addAttributeAtRange(t, e, i);
  }
  removeLastListAttributeAtRange(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, { blockList: i } = this;
    return this.eachBlockAtRange(t, (function(r, s, a) {
      const o = r.getLastAttribute();
      o && Z(o).listAttribute && o !== e.exceptAttributeName && (i = i.editObjectAtIndex(a, (() => r.removeAttribute(o))));
    })), new this.constructor(i);
  }
  removeLastTerminalAttributeAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, (function(i, r, s) {
      const a = i.getLastAttribute();
      a && Z(a).terminal && (e = e.editObjectAtIndex(s, (() => i.removeAttribute(a))));
    })), new this.constructor(e);
  }
  removeBlockAttributesAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, (function(i, r, s) {
      i.hasAttributes() && (e = e.editObjectAtIndex(s, (() => i.copyWithoutAttributes())));
    })), new this.constructor(e);
  }
  expandRangeToLineBreaksAndSplitBlocks(t) {
    let e;
    t = $(t);
    let [i, r] = t;
    const s = this.locationFromPosition(i), a = this.locationFromPosition(r);
    let o = this;
    const l = o.getBlockAtIndex(s.index);
    if (s.offset = l.findLineBreakInDirectionFromPosition("backward", s.offset), s.offset != null && (e = o.positionFromLocation(s), o = o.insertBlockBreakAtRange([e, e + 1]), a.index += 1, a.offset -= o.getBlockAtIndex(s.index).getLength(), s.index += 1), s.offset = 0, a.offset === 0 && a.index > s.index) a.index -= 1, a.offset = o.getBlockAtIndex(a.index).getBlockBreakPosition();
    else {
      const c = o.getBlockAtIndex(a.index);
      c.text.getStringAtRange([a.offset - 1, a.offset]) === `
` ? a.offset -= 1 : a.offset = c.findLineBreakInDirectionFromPosition("forward", a.offset), a.offset !== c.getBlockBreakPosition() && (e = o.positionFromLocation(a), o = o.insertBlockBreakAtRange([e, e + 1]));
    }
    return i = o.positionFromLocation(s), r = o.positionFromLocation(a), { document: o, range: t = $([i, r]) };
  }
  convertLineBreaksToBlockBreaksInRange(t) {
    t = $(t);
    let [e] = t;
    const i = this.getStringAtRange(t).slice(0, -1);
    let r = this;
    return i.replace(/.*?\n/g, (function(s) {
      e += s.length, r = r.insertBlockBreakAtRange([e - 1, e]);
    })), { document: r, range: t };
  }
  consolidateBlocksAtRange(t) {
    t = $(t);
    const [e, i] = t, r = this.locationFromPosition(e).index, s = this.locationFromPosition(i).index;
    return new this.constructor(this.blockList.consolidateFromIndexToIndex(r, s));
  }
  getDocumentAtRange(t) {
    t = $(t);
    const e = this.blockList.getSplittableListInRange(t).toArray();
    return new this.constructor(e);
  }
  getStringAtRange(t) {
    let e;
    const i = t = $(t);
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
    let i, r;
    t = $(t);
    const [s, a] = t, o = this.locationFromPosition(s), l = this.locationFromPosition(a);
    if (o.index === l.index) return i = this.getBlockAtIndex(o.index), r = [o.offset, l.offset], e(i, r, o.index);
    for (let c = o.index; c <= l.index; c++) if (i = this.getBlockAtIndex(c), i) {
      switch (c) {
        case o.index:
          r = [o.offset, i.text.getLength()];
          break;
        case l.index:
          r = [0, l.offset];
          break;
        default:
          r = [0, i.text.getLength()];
      }
      e(i, r, c);
    }
  }
  getCommonAttributesAtRange(t) {
    t = $(t);
    const [e] = t;
    if (ue(t)) return this.getCommonAttributesAtPosition(e);
    {
      const i = [], r = [];
      return this.eachBlockAtRange(t, (function(s, a) {
        if (a[0] !== a[1]) return i.push(s.text.getCommonAttributesAtRange(a)), r.push(Ns(s));
      })), Et.fromCommonAttributesOfObjects(i).merge(Et.fromCommonAttributesOfObjects(r)).toObject();
    }
  }
  getCommonAttributesAtPosition(t) {
    let e, i;
    const { index: r, offset: s } = this.locationFromPosition(t), a = this.getBlockAtIndex(r);
    if (!a) return {};
    const o = Ns(a), l = a.text.getAttributesAtPosition(s), c = a.text.getAttributesAtPosition(s - 1), h = Object.keys(qe).filter(((b) => qe[b].inheritable));
    for (e in c) i = c[e], (i === l[e] || h.includes(e)) && (o[e] = i);
    return o;
  }
  getRangeOfCommonAttributeAtPosition(t, e) {
    const { index: i, offset: r } = this.locationFromPosition(e), s = this.getTextAtIndex(i), [a, o] = Array.from(s.getExpandedRangeForAttributeAtOffset(t, r)), l = this.positionFromLocation({ index: i, offset: a }), c = this.positionFromLocation({ index: i, offset: o });
    return $([l, c]);
  }
  getBaseBlockAttributes() {
    let t = this.getBlockAtIndex(0).getAttributes();
    for (let e = 1; e < this.getBlockCount(); e++) {
      const i = this.getBlockAtIndex(e).getAttributes(), r = Math.min(t.length, i.length);
      t = (() => {
        const s = [];
        for (let a = 0; a < r && i[a] === t[a]; a++) s.push(i[a]);
        return s;
      })();
    }
    return t;
  }
  getAttachmentById(t) {
    for (const e of this.getAttachments()) if (e.id === t) return e;
  }
  getAttachmentPieces() {
    let t = [];
    return this.blockList.eachObject(((e) => {
      let { text: i } = e;
      return t = t.concat(i.getAttachmentPieces());
    })), t;
  }
  getAttachments() {
    return this.getAttachmentPieces().map(((t) => t.attachment));
  }
  getRangeOfAttachment(t) {
    let e = 0;
    const i = this.blockList.toArray();
    for (let r = 0; r < i.length; r++) {
      const { text: s } = i[r], a = s.getRangeOfAttachment(t);
      if (a) return $([e + a[0], e + a[1]]);
      e += s.getLength();
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
    return this.getBlocks().forEach(((r) => {
      const s = r.getLength();
      r.hasAttribute(t) && i.push([e, e + s]), e += s;
    })), i;
  }
  findRangesForTextAttribute(t) {
    let { withValue: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = 0, r = [];
    const s = [];
    return this.getPieces().forEach(((a) => {
      const o = a.getLength();
      (function(l) {
        return e ? l.getAttribute(t) === e : l.hasAttribute(t);
      })(a) && (r[1] === i ? r[1] = i + o : s.push(r = [i, i + o])), i += o;
    })), s;
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
    return $(this.locationFromPosition(t));
  }
  locationRangeFromRange(t) {
    if (!(t = $(t))) return;
    const [e, i] = Array.from(t), r = this.locationFromPosition(e), s = this.locationFromPosition(i);
    return $([r, s]);
  }
  rangeFromLocationRange(t) {
    let e;
    t = $(t);
    const i = this.positionFromLocation(t[0]);
    return ue(t) || (e = this.positionFromLocation(t[1])), $([i, e]);
  }
  isEqualTo(t) {
    return this.blockList.isEqualTo(t?.blockList);
  }
  getTexts() {
    return this.getBlocks().map(((t) => t.text));
  }
  getPieces() {
    const t = [];
    return Array.from(this.getTexts()).forEach(((e) => {
      t.push(...Array.from(e.getPieces() || []));
    })), t;
  }
  getObjects() {
    return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
  }
  toSerializableDocument() {
    const t = [];
    return this.blockList.eachObject(((e) => t.push(e.copyWithText(e.text.toSerializableText())))), new this.constructor(t);
  }
  toString() {
    return this.blockList.toString();
  }
  toJSON() {
    return this.blockList.toJSON();
  }
  toConsole() {
    return JSON.stringify(this.blockList.toArray().map(((t) => JSON.parse(t.text.toConsole()))));
  }
}
const Ns = function(n) {
  const t = {}, e = n.getLastAttribute();
  return e && (t[e] = !0), t;
}, $n = function(n) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return { string: n = yi(n), attributes: t, type: "string" };
}, Ps = (n, t) => {
  try {
    return JSON.parse(n.getAttribute("data-trix-".concat(t)));
  } catch {
    return {};
  }
};
class Ii extends et {
  static parse(t, e) {
    const i = new this(t, e);
    return i.parse(), i;
  }
  constructor(t) {
    let { referenceElement: e, purifyOptions: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.html = t, this.referenceElement = e, this.purifyOptions = i, this.blocks = [], this.blockElements = [], this.processedElements = [];
  }
  getDocument() {
    return Rt.fromJSON(this.blocks);
  }
  parse() {
    try {
      this.createHiddenContainer(), gn.setHTML(this.containerElement, this.html, { purifyOptions: this.purifyOptions });
      const t = on(this.containerElement, { usingFilter: wc });
      for (; t.nextNode(); ) this.processNode(t.currentNode);
      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }
  createHiddenContainer() {
    return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(!1), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = I({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
  }
  removeHiddenContainer() {
    return xe(this.containerElement);
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
      const r = this.getBlockAttributes(e), s = this.getBlockHTMLAttributes(e);
      He(r, (i = this.currentBlock) === null || i === void 0 ? void 0 : i.attributes) || (this.currentBlock = this.appendBlockForAttributesWithElement(r, e, s), this.currentBlockElement = e);
    }
  }
  appendBlockForElement(t) {
    const e = this.isBlockElement(t), i = Me(this.currentBlockElement, t);
    if (e && !this.isBlockElement(t.firstChild)) {
      if (!this.isInsignificantTextNode(t.firstChild) || !this.isBlockElement(t.firstElementChild)) {
        const r = this.getBlockAttributes(t), s = this.getBlockHTMLAttributes(t);
        if (t.firstChild) {
          if (i && He(r, this.currentBlock.attributes)) return this.appendStringWithAttributes(`
`);
          this.currentBlock = this.appendBlockForAttributesWithElement(r, t, s), this.currentBlockElement = t;
        }
      }
    } else if (this.currentBlockElement && !i && !e) {
      const r = this.findParentBlockElement(t);
      if (r) return this.appendBlockForElement(r);
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
    return Fs(t.parentNode) || (e = $r(e), So((i = t.previousSibling) === null || i === void 0 ? void 0 : i.textContent) && (e = Cc(e))), this.appendStringWithAttributes(e, this.getTextAttributes(t.parentNode));
  }
  processElement(t) {
    let e;
    if (Ne(t)) {
      if (e = Ps(t, "attachment"), Object.keys(e).length) {
        const i = this.getTextAttributes(t);
        this.appendAttachmentWithAttributes(e, i), t.innerHTML = "";
      }
      return this.processedElements.push(t);
    }
    switch (ht(t)) {
      case "br":
        return this.isExtraBR(t) || this.isBlockElement(t.nextSibling) || this.appendStringWithAttributes(`
`, this.getTextAttributes(t)), this.processedElements.push(t);
      case "img":
        e = { url: t.getAttribute("src"), contentType: "image" };
        const i = ((r) => {
          const s = r.getAttribute("width"), a = r.getAttribute("height"), o = {};
          return s && (o.width = parseInt(s, 10)), a && (o.height = parseInt(a, 10)), o;
        })(t);
        for (const r in i) {
          const s = i[r];
          e[r] = s;
        }
        return this.appendAttachmentWithAttributes(e, this.getTextAttributes(t)), this.processedElements.push(t);
      case "tr":
        if (this.needsTableSeparator(t)) return this.appendStringWithAttributes(nn.tableRowSeparator);
        break;
      case "td":
        if (this.needsTableSeparator(t)) return this.appendStringWithAttributes(nn.tableCellSeparator);
    }
  }
  appendBlockForAttributesWithElement(t, e) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.blockElements.push(e);
    const r = (function() {
      return { text: [], attributes: arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, htmlAttributes: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {} };
    })(t, i);
    return this.blocks.push(r), r;
  }
  appendEmptyBlock() {
    return this.appendBlockForAttributesWithElement([], null);
  }
  appendStringWithAttributes(t, e) {
    return this.appendPiece($n(t, e));
  }
  appendAttachmentWithAttributes(t, e) {
    return this.appendPiece((function(i) {
      return { attachment: i, attributes: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, type: "attachment" };
    })(t, e));
  }
  appendPiece(t) {
    return this.blocks.length === 0 && this.appendEmptyBlock(), this.blocks[this.blocks.length - 1].text.push(t);
  }
  appendStringToTextAtIndex(t, e) {
    const { text: i } = this.blocks[e], r = i[i.length - 1];
    if (r?.type !== "string") return i.push($n(t));
    r.string += t;
  }
  prependStringToTextAtIndex(t, e) {
    const { text: i } = this.blocks[e], r = i[0];
    if (r?.type !== "string") return i.unshift($n(t));
    r.string = t + r.string;
  }
  getTextAttributes(t) {
    let e;
    const i = {};
    for (const r in qe) {
      const s = qe[r];
      if (s.tagName && Ee(t, { matchingSelector: s.tagName, untilNode: this.containerElement })) i[r] = !0;
      else if (s.parser) {
        if (e = s.parser(t), e) {
          let a = !1;
          for (const o of this.findBlockElementAncestors(t)) if (s.parser(o) === e) {
            a = !0;
            break;
          }
          a || (i[r] = e);
        }
      } else s.styleProperty && (e = t.style[s.styleProperty], e && (i[r] = e));
    }
    if (Ne(t)) {
      const r = Ps(t, "attributes");
      for (const s in r) e = r[s], i[s] = e;
    }
    return i;
  }
  getBlockAttributes(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      for (const r in mt) {
        const s = mt[r];
        var i;
        s.parse !== !1 && ht(t) === s.tagName && ((i = s.test) !== null && i !== void 0 && i.call(s, t) || !s.test) && (e.push(r), s.listAttribute && e.push(s.listAttribute));
      }
      t = t.parentNode;
    }
    return e.reverse();
  }
  getBlockHTMLAttributes(t) {
    const e = {}, i = Object.values(mt).find(((r) => r.tagName === ht(t)));
    return (i?.htmlAttributes || []).forEach(((r) => {
      t.hasAttribute(r) && (e[r] = t.getAttribute(r));
    })), e;
  }
  findBlockElementAncestors(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      const i = ht(t);
      Ai().includes(i) && e.push(t), t = t.parentNode;
    }
    return e;
  }
  isBlockElement(t) {
    if (t?.nodeType === Node.ELEMENT_NODE && !Ne(t) && !Ee(t, { matchingSelector: "td", untilNode: this.containerElement })) return Ai().includes(ht(t)) || window.getComputedStyle(t).display === "block";
  }
  isInsignificantTextNode(t) {
    if (t?.nodeType !== Node.TEXT_NODE || !Tc(t.data)) return;
    const { parentNode: e, previousSibling: i, nextSibling: r } = t;
    return Lc(e.previousSibling) && !this.isBlockElement(e.previousSibling) || Fs(e) ? void 0 : !i || this.isBlockElement(i) || !r || this.isBlockElement(r);
  }
  isExtraBR(t) {
    return ht(t) === "br" && this.isBlockElement(t.parentNode) && t.parentNode.lastChild === t;
  }
  needsTableSeparator(t) {
    if (nn.removeBlankTableCells) {
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
    if (e && e.textContent && !Ai().includes(ht(e)) && !this.processedElements.includes(e)) return qs(e);
  }
  getMarginOfDefaultBlockElement() {
    const t = I(mt.default.tagName);
    return this.containerElement.appendChild(t), qs(t);
  }
}
const Fs = function(n) {
  const { whiteSpace: t } = window.getComputedStyle(n);
  return ["pre", "pre-wrap", "pre-line"].includes(t);
}, Lc = (n) => n && !So(n.textContent), qs = function(n) {
  const t = window.getComputedStyle(n);
  if (t.display === "block") return { top: parseInt(t.marginTop), bottom: parseInt(t.marginBottom) };
}, wc = function(n) {
  return ht(n) === "style" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, Cc = (n) => n.replace(new RegExp("^".concat(Ur.source, "+")), ""), Tc = (n) => new RegExp("^".concat(Ur.source, "*$")).test(n), So = (n) => /\s$/.test(n), kc = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"], Lr = "data-trix-serialized-attributes", Rc = "[".concat(Lr, "]"), Dc = new RegExp("<!--block-->", "g"), Ic = { "application/json": function(n) {
  let t;
  if (n instanceof Rt) t = n;
  else {
    if (!(n instanceof HTMLElement)) throw new Error("unserializable object");
    t = Ii.parse(n.innerHTML).getDocument();
  }
  return t.toSerializableDocument().toJSONString();
}, "text/html": function(n) {
  let t;
  if (n instanceof Rt) t = bn.render(n);
  else {
    if (!(n instanceof HTMLElement)) throw new Error("unserializable object");
    t = n.cloneNode(!0);
  }
  return Array.from(t.querySelectorAll("[data-trix-serialize=false]")).forEach(((e) => {
    xe(e);
  })), kc.forEach(((e) => {
    Array.from(t.querySelectorAll("[".concat(e, "]"))).forEach(((i) => {
      i.removeAttribute(e);
    }));
  })), Array.from(t.querySelectorAll(Rc)).forEach(((e) => {
    try {
      const i = JSON.parse(e.getAttribute(Lr));
      e.removeAttribute(Lr);
      for (const r in i) {
        const s = i[r];
        e.setAttribute(r, s);
      }
    } catch {
    }
  })), t.innerHTML.replace(Dc, "");
} };
var Oc = Object.freeze({ __proto__: null });
class G extends et {
  constructor(t, e) {
    super(...arguments), this.attachmentManager = t, this.attachment = e, this.id = this.attachment.id, this.file = this.attachment.file;
  }
  remove() {
    return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
  }
}
G.proxyMethod("attachment.getAttribute"), G.proxyMethod("attachment.hasAttribute"), G.proxyMethod("attachment.setAttribute"), G.proxyMethod("attachment.getAttributes"), G.proxyMethod("attachment.setAttributes"), G.proxyMethod("attachment.isPending"), G.proxyMethod("attachment.isPreviewable"), G.proxyMethod("attachment.getURL"), G.proxyMethod("attachment.getPreviewURL"), G.proxyMethod("attachment.setPreviewURL"), G.proxyMethod("attachment.getHref"), G.proxyMethod("attachment.getFilename"), G.proxyMethod("attachment.getFilesize"), G.proxyMethod("attachment.getFormattedFilesize"), G.proxyMethod("attachment.getExtension"), G.proxyMethod("attachment.getContentType"), G.proxyMethod("attachment.getFile"), G.proxyMethod("attachment.setFile"), G.proxyMethod("attachment.releaseFile"), G.proxyMethod("attachment.getUploadProgress"), G.proxyMethod("attachment.setUploadProgress");
class Lo extends et {
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), this.managedAttachments = {}, Array.from(t).forEach(((e) => {
      this.manageAttachment(e);
    }));
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
    return this.managedAttachments[t.id] || (this.managedAttachments[t.id] = new G(this, t)), this.managedAttachments[t.id];
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
class wo {
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
class _e extends et {
  constructor() {
    super(...arguments), this.document = new Rt(), this.attachments = [], this.currentAttributes = {}, this.revision = 0;
  }
  setDocument(t) {
    var e, i;
    if (!t.isEqualTo(this.document)) return this.document = t, this.refreshAttachments(), this.revision++, (e = this.delegate) === null || e === void 0 || (i = e.compositionDidChangeDocument) === null || i === void 0 ? void 0 : i.call(e, t);
  }
  getSnapshot() {
    return { document: this.document, selectedRange: this.getSelectedRange() };
  }
  loadSnapshot(t) {
    var e, i, r, s;
    let { document: a, selectedRange: o } = t;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionWillLoadSnapshot) === null || i === void 0 || i.call(e), this.setDocument(a ?? new Rt()), this.setSelection(o ?? [0, 0]), (r = this.delegate) === null || r === void 0 || (s = r.compositionDidLoadSnapshot) === null || s === void 0 ? void 0 : s.call(r);
  }
  insertText(t) {
    let { updatePosition: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { updatePosition: !0 };
    const i = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(t, i));
    const r = i[0], s = r + t.getLength();
    return e && this.setSelection(s), this.notifyDelegateOfInsertionAtRange([r, s]);
  }
  insertBlock() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Qt();
    const e = new Rt([t]);
    return this.insertDocument(e);
  }
  insertDocument() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Rt();
    const e = this.getSelectedRange();
    this.setDocument(this.document.insertDocumentAtRange(t, e));
    const i = e[0], r = i + t.getLength();
    return this.setSelection(r), this.notifyDelegateOfInsertionAtRange([i, r]);
  }
  insertString(t, e) {
    const i = this.getCurrentTextAttributes(), r = zt.textForStringWithAttributes(t, i);
    return this.insertText(r, e);
  }
  insertBlockBreak() {
    const t = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(t));
    const e = t[0], i = e + 1;
    return this.setSelection(i), this.notifyDelegateOfInsertionAtRange([e, i]);
  }
  insertLineBreak() {
    const t = new wo(this);
    if (t.shouldDecreaseListLevel()) return this.decreaseListLevel(), this.setSelection(t.startPosition);
    if (t.shouldPrependListItem()) {
      const e = new Rt([t.block.copyWithoutText()]);
      return this.insertDocument(e);
    }
    return t.shouldInsertBlockBreak() ? this.insertBlockBreak() : t.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : t.shouldBreakFormattedBlock() ? this.breakFormattedBlock(t) : this.insertString(`
`);
  }
  insertHTML(t) {
    const e = Ii.parse(t, { purifyOptions: { SAFE_FOR_XML: !0 } }).getDocument(), i = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(e, i));
    const r = i[0], s = r + e.getLength() - 1;
    return this.setSelection(s), this.notifyDelegateOfInsertionAtRange([r, s]);
  }
  replaceHTML(t) {
    const e = Ii.parse(t).getDocument().copyUsingObjectsFromDocument(this.document), i = this.getLocationRange({ strict: !1 }), r = this.document.rangeFromLocationRange(i);
    return this.setDocument(e), this.setSelection(r);
  }
  insertFile(t) {
    return this.insertFiles([t]);
  }
  insertFiles(t) {
    const e = [];
    return Array.from(t).forEach(((i) => {
      var r;
      if ((r = this.delegate) !== null && r !== void 0 && r.compositionShouldAcceptFile(i)) {
        const s = ai.attachmentForFile(i);
        e.push(s);
      }
    })), this.insertAttachments(e);
  }
  insertAttachment(t) {
    return this.insertAttachments([t]);
  }
  insertAttachments(t) {
    let e = new zt();
    return Array.from(t).forEach(((i) => {
      var r;
      const s = i.getType(), a = (r = Br[s]) === null || r === void 0 ? void 0 : r.presentation, o = this.getCurrentTextAttributes();
      a && (o.presentation = a);
      const l = zt.textForAttachmentWithAttributes(i, o);
      e = e.appendText(l);
    })), this.insertText(e);
  }
  shouldManageDeletingInDirection(t) {
    const e = this.getLocationRange();
    if (ue(e)) {
      if (t === "backward" && e[0].offset === 0 || this.shouldManageMovingCursorInDirection(t)) return !0;
    } else if (e[0].index !== e[1].index) return !0;
    return !1;
  }
  deleteInDirection(t) {
    let e, i, r, { length: s } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const a = this.getLocationRange();
    let o = this.getSelectedRange();
    const l = ue(o);
    if (l ? i = t === "backward" && a[0].offset === 0 : r = a[0].index !== a[1].index, i && this.canDecreaseBlockAttributeLevel()) {
      const c = this.getBlock();
      if (c.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(o[0]), c.isEmpty()) return !1;
    }
    return l && (o = this.getExpandedRangeInDirection(t, { length: s }), t === "backward" && (e = this.getAttachmentAtRange(o))), e ? (this.editAttachment(e), !1) : (this.setDocument(this.document.removeTextAtRange(o)), this.setSelection(o[0]), !i && !r && void 0);
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
    return Z(t) ? this.canSetCurrentBlockAttribute(t) : this.canSetCurrentTextAttribute(t);
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
    return Z(t) ? this.setBlockAttribute(t, e) : (this.setTextAttribute(t, e), this.currentAttributes[t] = e, this.notifyDelegateOfCurrentAttributesChange());
  }
  setHTMLAtributeAtPosition(t, e, i) {
    var r;
    const s = this.document.getBlockAtPosition(t), a = (r = Z(s.getLastAttribute())) === null || r === void 0 ? void 0 : r.htmlAttributes;
    if (s && a != null && a.includes(e)) {
      const o = this.document.setHTMLAttributeAtPosition(t, e, i);
      this.setDocument(o);
    }
  }
  setTextAttribute(t, e) {
    const i = this.getSelectedRange();
    if (!i) return;
    const [r, s] = Array.from(i);
    if (r !== s) return this.setDocument(this.document.addAttributeAtRange(t, e, i));
    if (t === "href") {
      const a = zt.textForStringWithAttributes(e, { href: e });
      return this.insertText(a);
    }
  }
  setBlockAttribute(t, e) {
    const i = this.getSelectedRange();
    if (this.canSetCurrentAttribute(t)) return this.setDocument(this.document.applyBlockAttributeAtRange(t, e, i)), this.setSelection(i);
  }
  removeCurrentAttribute(t) {
    return Z(t) ? (this.removeBlockAttribute(t), this.updateCurrentAttributes()) : (this.removeTextAttribute(t), delete this.currentAttributes[t], this.notifyDelegateOfCurrentAttributesChange());
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
      if ((t = Z(e.getLastNestableAttribute())) === null || t === void 0 || !t.listAttribute) return e.getNestingLevel() > 0;
      {
        const i = this.getPreviousBlock();
        if (i) return (function() {
          let r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
          return He((arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).slice(0, r.length), r);
        })(i.getListItemAttributes(), e.getListItemAttributes());
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
    const r = this.getBlock().getAttributeLevel();
    let s = this.document.getBlockAtIndex(i + 1);
    for (; s && s.isListItem() && !(s.getAttributeLevel() <= r); ) i++, s = this.document.getBlockAtIndex(i + 1);
    t = this.document.positionFromLocation({ index: e, offset: 0 });
    const a = this.document.positionFromLocation({ index: i, offset: 0 });
    return this.setDocument(this.document.removeLastListAttributeAtRange([t, a]));
  }
  updateCurrentAttributes() {
    const t = this.getSelectedRange({ ignoreLock: !0 });
    if (t) {
      const e = this.document.getCommonAttributesAtRange(t);
      if (Array.from(_r()).forEach(((i) => {
        e[i] || this.canSetCurrentAttribute(i) || (e[i] = !1);
      })), !si(e, this.currentAttributes)) return this.currentAttributes = e, this.notifyDelegateOfCurrentAttributesChange();
    }
  }
  getCurrentAttributes() {
    return Za.call({}, this.currentAttributes);
  }
  getCurrentTextAttributes() {
    const t = {};
    for (const e in this.currentAttributes) {
      const i = this.currentAttributes[e];
      i !== !1 && Ar(e) && (t[e] = i);
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
    return this.targetLocationRange ? this.targetLocationRange : this.getSelectionManager().getLocationRange(t) || $({ index: 0, offset: 0 });
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
    let { length: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, [i, r] = Array.from(this.getSelectedRange());
    return t === "backward" ? e ? i -= e : i = this.translateUTF16PositionFromOffset(i, -1) : e ? r += e : r = this.translateUTF16PositionFromOffset(r, 1), $([i, r]);
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
      const r = this.getSelectedRange();
      i = this.getExpandedRangeInDirection(t), e = !ln(r, i);
    }
    if (t === "backward" ? this.setSelectedRange(i[0]) : this.setSelectedRange(i[1]), e) {
      const r = this.getAttachmentAtRange(i);
      if (r) return this.editAttachment(r);
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
    const t = this.document.getAttachments(), { added: e, removed: i } = (function() {
      let r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      const a = [], o = [], l = /* @__PURE__ */ new Set();
      r.forEach(((h) => {
        l.add(h);
      }));
      const c = /* @__PURE__ */ new Set();
      return s.forEach(((h) => {
        c.add(h), l.has(h) || a.push(h);
      })), r.forEach(((h) => {
        c.has(h) || o.push(h);
      })), { added: a, removed: o };
    })(this.attachments, t);
    return this.attachments = t, Array.from(i).forEach(((r) => {
      var s, a;
      r.delegate = null, (s = this.delegate) === null || s === void 0 || (a = s.compositionDidRemoveAttachment) === null || a === void 0 || a.call(s, r);
    })), (() => {
      const r = [];
      return Array.from(e).forEach(((s) => {
        var a, o;
        s.delegate = this, r.push((a = this.delegate) === null || a === void 0 || (o = a.compositionDidAddAttachment) === null || o === void 0 ? void 0 : o.call(a, s));
      })), r;
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
    var i, r;
    if (t !== this.editingAttachment) return this.stopEditingAttachment(), this.editingAttachment = t, (i = this.delegate) === null || i === void 0 || (r = i.compositionDidStartEditingAttachment) === null || r === void 0 ? void 0 : r.call(i, this.editingAttachment, e);
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
    let r = t.startPosition, s = [r - 1, r];
    i.getBlockBreakPosition() === t.startLocation.offset ? (i.breaksOnReturn() && t.nextCharacter === `
` ? r += 1 : e = e.removeTextAtRange(s), s = [r, r]) : t.nextCharacter === `
` ? t.previousCharacter === `
` ? s = [r - 1, r + 1] : (s = [r, r + 1], r += 1) : t.startLocation.offset - 1 != 0 && (r += 1);
    const a = new Rt([i.removeLastAttribute().copyWithoutText()]);
    return this.setDocument(e.insertDocumentAtRange(a, s)), this.setSelection(r);
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
    const i = this.document.toUTF16String(), r = i.offsetFromUCS2Offset(t);
    return i.offsetToUCS2Offset(r + e);
  }
}
_e.proxyMethod("getSelectionManager().getPointRange"), _e.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), _e.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), _e.proxyMethod("getSelectionManager().locationIsCursorTarget"), _e.proxyMethod("getSelectionManager().selectionIsExpanded"), _e.proxyMethod("delegate?.getSelectionManager");
class wr extends et {
  constructor(t) {
    super(...arguments), this.composition = t, this.undoEntries = [], this.redoEntries = [];
  }
  recordUndoEntry(t) {
    let { context: e, consolidatable: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const r = this.undoEntries.slice(-1)[0];
    if (!i || !Mc(r, t, e)) {
      const s = this.createEntry({ description: t, context: e });
      this.undoEntries.push(s), this.redoEntries = [];
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
    return { description: t?.toString(), context: JSON.stringify(e), snapshot: this.composition.getSnapshot() };
  }
}
const Mc = (n, t, e) => n?.description === t?.toString() && n?.context === JSON.stringify(e), jn = "attachmentGallery";
class Co {
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
    return this.findRangesOfBlocks().map(((t) => this.document = this.document.removeAttributeAtRange(jn, t)));
  }
  applyBlockAttribute() {
    let t = 0;
    this.findRangesOfPieces().forEach(((e) => {
      e[1] - e[0] > 1 && (e[0] += t, e[1] += t, this.document.getCharacterAtPosition(e[1]) !== `
` && (this.document = this.document.insertBlockBreakAtRange(e[1]), e[1] < this.selectedRange[1] && this.moveSelectedRangeForward(), e[1]++, t++), e[0] !== 0 && this.document.getCharacterAtPosition(e[0] - 1) !== `
` && (this.document = this.document.insertBlockBreakAtRange(e[0]), e[0] < this.selectedRange[0] && this.moveSelectedRangeForward(), e[0]++, t++), this.document = this.document.applyBlockAttributeAtRange(jn, !0, e));
    }));
  }
  findRangesOfBlocks() {
    return this.document.findRangesForBlockAttribute(jn);
  }
  findRangesOfPieces() {
    return this.document.findRangesForTextAttribute("presentation", { withValue: "gallery" });
  }
  moveSelectedRangeForward() {
    this.selectedRange[0] += 1, this.selectedRange[1] += 1;
  }
}
const To = function(n) {
  const t = new Co(n);
  return t.perform(), t.getSnapshot();
}, Bc = [To];
class ko {
  constructor(t, e, i) {
    this.insertFiles = this.insertFiles.bind(this), this.composition = t, this.selectionManager = e, this.element = i, this.undoManager = new wr(this.composition), this.filters = Bc.slice(0);
  }
  loadDocument(t) {
    return this.loadSnapshot({ document: t, selectedRange: [0, 0] });
  }
  loadHTML() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    const e = Ii.parse(t, { referenceElement: this.element }).getDocument();
    return this.loadDocument(e);
  }
  loadJSON(t) {
    let { document: e, selectedRange: i } = t;
    return e = Rt.fromJSON(e), this.loadSnapshot({ document: e, selectedRange: i });
  }
  loadSnapshot(t) {
    return this.undoManager = new wr(this.composition), this.composition.loadSnapshot(t);
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
class Ro {
  constructor(t) {
    this.element = t;
  }
  findLocationFromContainerAndOffset(t, e) {
    let { strict: i } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { strict: !0 }, r = 0, s = !1;
    const a = { index: 0, offset: 0 }, o = this.findAttachmentElementParentForNode(t);
    o && (t = o.parentNode, e = wn(o));
    const l = on(this.element, { usingFilter: Do });
    for (; l.nextNode(); ) {
      const c = l.currentNode;
      if (c === t && Ei(t)) {
        Xe(c) || (a.offset += e);
        break;
      }
      if (c.parentNode === t) {
        if (r++ === e) {
          !i && Tn(c, { strict: i }) && (s && a.index++, a.offset = 0, s = !0);
          break;
        }
      } else if (!Me(t, c) && r > 0) break;
      Tn(c, { strict: i }) ? (s && a.index++, a.offset = 0, s = !0) : a.offset += Vn(c);
    }
    return a;
  }
  findContainerAndOffsetFromLocation(t) {
    let e, i;
    if (t.index === 0 && t.offset === 0) {
      for (e = this.element, i = 0; e.firstChild; ) if (e = e.firstChild, Cn(e)) {
        i = 1;
        break;
      }
      return [e, i];
    }
    let [r, s] = this.findNodeAndOffsetFromLocation(t);
    if (r) {
      if (Ei(r)) Vn(r) === 0 ? (e = r.parentNode.parentNode, i = wn(r.parentNode), Xe(r, { name: "right" }) && i++) : (e = r, i = t.offset - s);
      else {
        if (e = r.parentNode, !Tn(r.previousSibling) && !Cn(e)) for (; r === e.lastChild && (r = e, e = e.parentNode, !Cn(e)); ) ;
        i = wn(r), t.offset !== 0 && i++;
      }
      return [e, i];
    }
  }
  findNodeAndOffsetFromLocation(t) {
    let e, i, r = 0;
    for (const s of this.getSignificantNodesForIndex(t.index)) {
      const a = Vn(s);
      if (t.offset <= r + a) if (Ei(s)) {
        if (e = s, i = r, t.offset === i && Xe(e)) break;
      } else e || (e = s, i = r);
      if (r += a, r > t.offset) break;
    }
    return [e, i];
  }
  findAttachmentElementParentForNode(t) {
    for (; t && t !== this.element; ) {
      if (Ne(t)) return t;
      t = t.parentNode;
    }
  }
  getSignificantNodesForIndex(t) {
    const e = [], i = on(this.element, { usingFilter: Nc });
    let r = !1;
    for (; i.nextNode(); ) {
      const a = i.currentNode;
      var s;
      if (Ye(a)) {
        if (s != null ? s++ : s = 0, s === t) r = !0;
        else if (r) break;
      } else r && e.push(a);
    }
    return e;
  }
}
const Vn = function(n) {
  return n.nodeType === Node.TEXT_NODE ? Xe(n) ? 0 : n.textContent.length : ht(n) === "br" || Ne(n) ? 1 : 0;
}, Nc = function(n) {
  return Pc(n) === NodeFilter.FILTER_ACCEPT ? Do(n) : NodeFilter.FILTER_REJECT;
}, Pc = function(n) {
  return io(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, Do = function(n) {
  return Ne(n.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
};
class Io {
  createDOMRangeFromPoint(t) {
    let e, { x: i, y: r } = t;
    if (document.caretPositionFromPoint) {
      const { offsetNode: s, offset: a } = document.caretPositionFromPoint(i, r);
      return e = document.createRange(), e.setStart(s, a), e;
    }
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(i, r);
    if (document.body.createTextRange) {
      const s = xi();
      try {
        const a = document.body.createTextRange();
        a.moveToPoint(i, r), a.select();
      } catch {
      }
      return e = xi(), uo(s), e;
    }
  }
  getClientRectsForDOMRange(t) {
    const e = Array.from(t.getClientRects());
    return [e[0], e[e.length - 1]];
  }
}
class Oe extends et {
  constructor(t) {
    super(...arguments), this.didMouseDown = this.didMouseDown.bind(this), this.selectionDidChange = this.selectionDidChange.bind(this), this.element = t, this.locationMapper = new Ro(this.element), this.pointMapper = new Io(), this.lockCount = 0, J("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
  }
  getLocationRange() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return t.strict === !1 ? this.createLocationRangeFromDOMRange(xi()) : t.ignoreLock ? this.currentLocationRange : this.lockedLocationRange ? this.lockedLocationRange : this.currentLocationRange;
  }
  setLocationRange(t) {
    if (this.lockedLocationRange) return;
    t = $(t);
    const e = this.createDOMRangeFromLocationRange(t);
    e && (uo(e), this.updateCurrentLocationRange(t));
  }
  setLocationRangeFromPointRange(t) {
    t = $(t);
    const e = this.getLocationAtPoint(t[0]), i = this.getLocationAtPoint(t[1]);
    this.setLocationRange([e, i]);
  }
  getClientRectAtLocationRange(t) {
    const e = this.createDOMRangeFromLocationRange(t);
    if (e) return this.getClientRectsForDOMRange(e)[1];
  }
  locationIsCursorTarget(t) {
    const e = Array.from(this.findNodeAndOffsetFromLocation(t))[0];
    return Xe(e);
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
    return (t = co()) === null || t === void 0 ? void 0 : t.removeAllRanges();
  }
  selectionIsCollapsed() {
    var t;
    return ((t = xi()) === null || t === void 0 ? void 0 : t.collapsed) === !0;
  }
  selectionIsExpanded() {
    return !this.selectionIsCollapsed();
  }
  createLocationRangeFromDOMRange(t, e) {
    if (t == null || !this.domRangeWithinElement(t)) return;
    const i = this.findLocationFromContainerAndOffset(t.startContainer, t.startOffset, e);
    if (!i) return;
    const r = t.collapsed ? void 0 : this.findLocationFromContainerAndOffset(t.endContainer, t.endOffset, e);
    return $([i, r]);
  }
  didMouseDown() {
    return this.pauseTemporarily();
  }
  pauseTemporarily() {
    let t;
    this.paused = !0;
    const e = () => {
      if (this.paused = !1, clearTimeout(i), Array.from(t).forEach(((r) => {
        r.destroy();
      })), Me(document, this.element)) return this.selectionDidChange();
    }, i = setTimeout(e, 200);
    t = ["mousemove", "keydown"].map(((r) => J(r, { onElement: document, withCallback: e })));
  }
  selectionDidChange() {
    if (!this.paused && !Pr(this.element)) return this.updateCurrentLocationRange();
  }
  updateCurrentLocationRange(t) {
    var e, i;
    if ((t ?? (t = this.createLocationRangeFromDOMRange(xi()))) && !ln(t, this.currentLocationRange)) return this.currentLocationRange = t, (e = this.delegate) === null || e === void 0 || (i = e.locationRangeDidChange) === null || i === void 0 ? void 0 : i.call(e, this.currentLocationRange.slice(0));
  }
  createDOMRangeFromLocationRange(t) {
    const e = this.findContainerAndOffsetFromLocation(t[0]), i = ue(t) ? e : this.findContainerAndOffsetFromLocation(t[1]) || e;
    if (e != null && i != null) {
      const r = document.createRange();
      return r.setStart(...Array.from(e || [])), r.setEnd(...Array.from(i || [])), r;
    }
  }
  getLocationAtPoint(t) {
    const e = this.createDOMRangeFromPoint(t);
    var i;
    if (e) return (i = this.createLocationRangeFromDOMRange(e)) === null || i === void 0 ? void 0 : i[0];
  }
  domRangeWithinElement(t) {
    return t.collapsed ? Me(this.element, t.startContainer) : Me(this.element, t.startContainer) && Me(this.element, t.endContainer);
  }
}
Oe.proxyMethod("locationMapper.findLocationFromContainerAndOffset"), Oe.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"), Oe.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"), Oe.proxyMethod("pointMapper.createDOMRangeFromPoint"), Oe.proxyMethod("pointMapper.getClientRectsForDOMRange");
var Oo = Object.freeze({ __proto__: null, Attachment: ai, AttachmentManager: Lo, AttachmentPiece: ti, Block: Qt, Composition: _e, Document: Rt, Editor: ko, HTMLParser: Ii, HTMLSanitizer: gn, LineBreakInsertion: wo, LocationMapper: Ro, ManagedAttachment: G, Piece: We, PointMapper: Io, SelectionManager: Oe, SplittableList: dn, StringPiece: Wr, Text: zt, UndoManager: wr }), Fc = Object.freeze({ __proto__: null, ObjectView: Ve, AttachmentView: Vr, BlockView: yo, DocumentView: bn, PieceView: bo, PreviewableAttachmentView: go, TextView: vo });
const { lang: Wn, css: De, keyNames: qc } = Ni, zn = function(n) {
  return function() {
    const t = n.apply(this, arguments);
    t.do(), this.undos || (this.undos = []), this.undos.push(t.undo);
  };
};
class Mo extends et {
  constructor(t, e, i) {
    let r = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(...arguments), dt(this, "makeElementMutable", zn((() => ({ do: () => {
      this.element.dataset.trixMutable = !0;
    }, undo: () => delete this.element.dataset.trixMutable })))), dt(this, "addToolbar", zn((() => {
      const s = I({ tagName: "div", className: De.attachmentToolbar, data: { trixMutable: !0 }, childNodes: I({ tagName: "div", className: "trix-button-row", childNodes: I({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: I({ tagName: "button", className: "trix-button trix-button--remove", textContent: Wn.remove, attributes: { title: Wn.remove }, data: { trixAction: "remove" } }) }) }) });
      return this.attachment.isPreviewable() && s.appendChild(I({ tagName: "div", className: De.attachmentMetadataContainer, childNodes: I({ tagName: "span", className: De.attachmentMetadata, childNodes: [I({ tagName: "span", className: De.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), I({ tagName: "span", className: De.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), J("click", { onElement: s, withCallback: this.didClickToolbar }), J("click", { onElement: s, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), _i("trix-attachment-before-toolbar", { onElement: this.element, attributes: { toolbar: s, attachment: this.attachment } }), { do: () => this.element.appendChild(s), undo: () => xe(s) };
    }))), dt(this, "installCaptionEditor", zn((() => {
      const s = I({ tagName: "textarea", className: De.attachmentCaptionEditor, attributes: { placeholder: Wn.captionPlaceholder }, data: { trixMutable: !0 } });
      s.value = this.attachmentPiece.getCaption();
      const a = s.cloneNode();
      a.classList.add("trix-autoresize-clone"), a.tabIndex = -1;
      const o = function() {
        a.value = s.value, s.style.height = a.scrollHeight + "px";
      };
      J("input", { onElement: s, withCallback: o }), J("input", { onElement: s, withCallback: this.didInputCaption }), J("keydown", { onElement: s, withCallback: this.didKeyDownCaption }), J("change", { onElement: s, withCallback: this.didChangeCaption }), J("blur", { onElement: s, withCallback: this.didBlurCaption });
      const l = this.element.querySelector("figcaption"), c = l.cloneNode();
      return { do: () => {
        if (l.style.display = "none", c.appendChild(s), c.appendChild(a), c.classList.add("".concat(De.attachmentCaption, "--editing")), l.parentElement.insertBefore(c, l), o(), this.options.editCaption) return Hr((() => s.focus()));
      }, undo() {
        xe(c), l.style.display = null;
      } };
    }))), this.didClickToolbar = this.didClickToolbar.bind(this), this.didClickActionButton = this.didClickActionButton.bind(this), this.didKeyDownCaption = this.didKeyDownCaption.bind(this), this.didInputCaption = this.didInputCaption.bind(this), this.didChangeCaption = this.didChangeCaption.bind(this), this.didBlurCaption = this.didBlurCaption.bind(this), this.attachmentPiece = t, this.element = e, this.container = i, this.options = r, this.attachment = this.attachmentPiece.attachment, ht(this.element) === "a" && (this.element = this.element.firstChild), this.install();
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
      const s = this.pendingCaption;
      var t, e, i, r;
      this.pendingCaption = null, s ? (t = this.delegate) === null || t === void 0 || (e = t.attachmentEditorDidRequestUpdatingAttributesForAttachment) === null || e === void 0 || e.call(t, { caption: s }, this.attachment) : (i = this.delegate) === null || i === void 0 || (r = i.attachmentEditorDidRequestRemovingAttributeForAttachment) === null || r === void 0 || r.call(i, "caption", this.attachment);
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
    if (qc[t.keyCode] === "return") return t.preventDefault(), this.savePendingCaption(), (e = this.delegate) === null || e === void 0 || (i = e.attachmentEditorDidRequestDeselectingAttachment) === null || i === void 0 ? void 0 : i.call(e, this.attachment);
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
class Bo extends et {
  constructor(t, e) {
    super(...arguments), this.didFocus = this.didFocus.bind(this), this.didBlur = this.didBlur.bind(this), this.didClickAttachment = this.didClickAttachment.bind(this), this.element = t, this.composition = e, this.documentView = new bn(this.composition.document, { element: this.element }), J("focus", { onElement: this.element, withCallback: this.didFocus }), J("blur", { onElement: this.element, withCallback: this.didBlur }), J("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: !0 }), J("mousedown", { onElement: this.element, matchingSelector: Be, withCallback: this.didClickAttachment }), J("click", { onElement: this.element, matchingSelector: "a".concat(Be), preventDefault: !0 });
  }
  didFocus(t) {
    var e;
    const i = () => {
      var r, s;
      if (!this.focused) return this.focused = !0, (r = this.delegate) === null || r === void 0 || (s = r.compositionControllerDidFocus) === null || s === void 0 ? void 0 : s.call(r);
    };
    return ((e = this.blurPromise) === null || e === void 0 ? void 0 : e.then(i)) || i();
  }
  didBlur(t) {
    this.blurPromise = new Promise(((e) => Hr((() => {
      var i, r;
      return Pr(this.element) || (this.focused = null, (i = this.delegate) === null || i === void 0 || (r = i.compositionControllerDidBlur) === null || r === void 0 || r.call(i)), this.blurPromise = null, e();
    }))));
  }
  didClickAttachment(t, e) {
    var i, r;
    const s = this.findAttachmentForElement(e), a = !!Ee(t.target, { matchingSelector: "figcaption" });
    return (i = this.delegate) === null || i === void 0 || (r = i.compositionControllerDidSelectAttachment) === null || r === void 0 ? void 0 : r.call(i, s, { editCaption: a });
  }
  getSerializableElement() {
    return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
  }
  render() {
    var t, e, i, r, s, a;
    return this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced() && ((i = this.delegate) === null || i === void 0 || (r = i.compositionControllerWillSyncDocumentView) === null || r === void 0 || r.call(i), this.documentView.sync(), (s = this.delegate) === null || s === void 0 || (a = s.compositionControllerDidSyncDocumentView) === null || a === void 0 || a.call(s)), (t = this.delegate) === null || t === void 0 || (e = t.compositionControllerDidRender) === null || e === void 0 ? void 0 : e.call(t);
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
    const r = this.documentView.findElementForObject(t);
    if (!r) return;
    this.uninstallAttachmentEditor();
    const s = this.composition.document.getAttachmentPieceForAttachment(t);
    this.attachmentEditor = new Mo(s, r, this.element, e), this.attachmentEditor.delegate = this;
  }
  uninstallAttachmentEditor() {
    var t;
    return (t = this.attachmentEditor) === null || t === void 0 ? void 0 : t.uninstall();
  }
  didUninstallAttachmentEditor() {
    return this.attachmentEditor = null, this.render();
  }
  attachmentEditorDidRequestUpdatingAttributesForAttachment(t, e) {
    var i, r;
    return (i = this.delegate) === null || i === void 0 || (r = i.compositionControllerWillUpdateAttachment) === null || r === void 0 || r.call(i, e), this.composition.updateAttributesForAttachment(t, e);
  }
  attachmentEditorDidRequestRemovingAttributeForAttachment(t, e) {
    var i, r;
    return (i = this.delegate) === null || i === void 0 || (r = i.compositionControllerWillUpdateAttachment) === null || r === void 0 || r.call(i, e), this.composition.removeAttributeForAttachment(t, e);
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
class No extends et {
}
const Po = "data-trix-mutable", Hc = "[".concat(Po, "]"), Uc = { attributes: !0, childList: !0, characterData: !0, characterDataOldValue: !0, subtree: !0 };
class Fo extends et {
  constructor(t) {
    super(t), this.didMutate = this.didMutate.bind(this), this.element = t, this.observer = new window.MutationObserver(this.didMutate), this.start();
  }
  start() {
    return this.reset(), this.observer.observe(this.element, Uc);
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
    return t.filter(((e) => this.mutationIsSignificant(e)));
  }
  mutationIsSignificant(t) {
    if (this.nodeIsMutable(t.target)) return !1;
    for (const e of Array.from(this.nodesModifiedByMutation(t))) if (this.nodeIsSignificant(e)) return !0;
    return !1;
  }
  nodeIsSignificant(t) {
    return t !== this.element && !this.nodeIsMutable(t) && !io(t);
  }
  nodeIsMutable(t) {
    return Ee(t, { matchingSelector: Hc });
  }
  nodesModifiedByMutation(t) {
    const e = [];
    switch (t.type) {
      case "attributes":
        t.attributeName !== Po && e.push(t.target);
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
    Array.from(i.additions).forEach(((o) => {
      Array.from(t).includes(o) || t.push(o);
    })), e.push(...Array.from(i.deletions || []));
    const r = {}, s = t.join("");
    s && (r.textAdded = s);
    const a = e.join("");
    return a && (r.textDeleted = a), r;
  }
  getMutationsByType(t) {
    return Array.from(this.mutations).filter(((e) => e.type === t));
  }
  getTextChangesFromChildList() {
    let t, e;
    const i = [], r = [];
    Array.from(this.getMutationsByType("childList")).forEach(((o) => {
      i.push(...Array.from(o.addedNodes || [])), r.push(...Array.from(o.removedNodes || []));
    })), i.length === 0 && r.length === 1 && Ye(r[0]) ? (t = [], e = [`
`]) : (t = Cr(i), e = Cr(r));
    const s = t.filter(((o, l) => o !== e[l])).map(yi), a = e.filter(((o, l) => o !== t[l])).map(yi);
    return { additions: s, deletions: a };
  }
  getTextChangesFromCharacterData() {
    let t, e;
    const i = this.getMutationsByType("characterData");
    if (i.length) {
      const r = i[0], s = i[i.length - 1], a = (function(o, l) {
        let c, h;
        return o = Di.box(o), (l = Di.box(l)).length < o.length ? [h, c] = ys(o, l) : [c, h] = ys(l, o), { added: c, removed: h };
      })(yi(r.oldValue), yi(s.target.data));
      t = a.added, e = a.removed;
    }
    return { additions: t ? [t] : [], deletions: e ? [e] : [] };
  }
}
const Cr = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const t = [];
  for (const e of Array.from(n)) switch (e.nodeType) {
    case Node.TEXT_NODE:
      t.push(e.data);
      break;
    case Node.ELEMENT_NODE:
      ht(e) === "br" ? t.push(`
`) : t.push(...Array.from(Cr(e.childNodes) || []));
  }
  return t;
};
class qo extends cn {
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
class $c {
  constructor(t) {
    this.element = t;
  }
  shouldIgnore(t) {
    return !!Bi.samsungAndroid && (this.previousEvent = this.event, this.event = t, this.checkSamsungKeyboardBuggyModeStart(), this.checkSamsungKeyboardBuggyModeEnd(), this.buggyMode);
  }
  checkSamsungKeyboardBuggyModeStart() {
    this.insertingLongTextAfterUnidentifiedChar() && jc(this.element.innerText, this.event.data) && (this.buggyMode = !0, this.event.preventDefault());
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
const jc = (n, t) => Hs(n) === Hs(t), Vc = new RegExp("(".concat("￼", "|").concat(fn, "|").concat(Ae, "|\\s)+"), "g"), Hs = (n) => n.replace(Vc, " ").trim();
class vn extends et {
  constructor(t) {
    super(...arguments), this.element = t, this.mutationObserver = new Fo(this.element), this.mutationObserver.delegate = this, this.flakyKeyboardDetector = new $c(this.element);
    for (const e in this.constructor.events) J(e, { onElement: this.element, withCallback: this.handlerFor(e) });
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
    const e = Array.from(t).map(((i) => new qo(i)));
    return Promise.all(e).then(((i) => {
      this.handleInput((function() {
        var r, s;
        return (r = this.delegate) === null || r === void 0 || r.inputControllerWillAttachFiles(), (s = this.responder) === null || s === void 0 || s.insertFiles(i), this.requestRender();
      }));
    }));
  }
  handlerFor(t) {
    return (e) => {
      e.defaultPrevented || this.handleInput((() => {
        if (!Pr(this.element)) {
          if (this.flakyKeyboardDetector.shouldIgnore(e)) return;
          this.eventName = t, this.constructor.events[t].call(this, e);
        }
      }));
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
var Kn;
dt(vn, "events", {});
const { browser: Wc, keyNames: Ho } = Ni;
let zc = 0;
class de extends vn {
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
    return this.resetInputSummary(), Ue.reset();
  }
  elementDidMutate(t) {
    var e, i;
    return this.isComposing() ? (e = this.delegate) === null || e === void 0 || (i = e.inputControllerDidAllowUnhandledInput) === null || i === void 0 ? void 0 : i.call(e) : this.handleInput((function() {
      return this.mutationIsSignificant(t) && (this.mutationIsExpected(t) ? this.requestRender() : this.requestReparse()), this.reset();
    }));
  }
  mutationIsExpected(t) {
    let { textAdded: e, textDeleted: i } = t;
    if (this.inputSummary.preferDocument) return !0;
    const r = e != null ? e === this.inputSummary.textAdded : !this.inputSummary.textAdded, s = i != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete, a = [`
`, ` 
`].includes(e) && !r, o = i === `
` && !s;
    if (a && !o || o && !a) {
      const c = this.getSelectedRange();
      if (c) {
        var l;
        const h = a ? e.replace(/\n$/, "").length || -1 : e?.length || 1;
        if ((l = this.responder) !== null && l !== void 0 && l.positionIsBlockBreak(c[1] + h)) return !0;
      }
    }
    return r && s;
  }
  mutationIsSignificant(t) {
    var e;
    const i = Object.keys(t).length > 0, r = ((e = this.compositionInput) === null || e === void 0 ? void 0 : e.getEndData()) === "";
    return i || !r;
  }
  getCompositionInput() {
    if (this.isComposing()) return this.compositionInput;
    this.compositionInput = new ye(this);
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
    if (!(function(r) {
      if (r == null || !r.setData) return !1;
      for (const s in gs) {
        const a = gs[s];
        try {
          if (r.setData(s, a), !r.getData(s) === a) return !1;
        } catch {
          return !1;
        }
      }
      return !0;
    })(t)) return;
    const i = (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedDocument().toSerializableDocument();
    return t.setData("application/x-trix-document", JSON.stringify(i)), t.setData("text/html", bn.render(i).innerHTML), t.setData("text/plain", i.toString().replace(/\n$/, "")), !0;
  }
  canAcceptDataTransfer(t) {
    const e = {};
    return Array.from(t?.types || []).forEach(((i) => {
      e[i] = !0;
    })), e.Files || e["application/x-trix-document"] || e["text/html"] || e["text/plain"];
  }
  getPastedHTMLUsingHiddenElement(t) {
    const e = this.getSelectedRange(), i = { position: "absolute", left: "".concat(window.pageXOffset, "px"), top: "".concat(window.pageYOffset, "px"), opacity: 0 }, r = I({ style: i, tagName: "div", editable: !0 });
    return document.body.appendChild(r), r.focus(), requestAnimationFrame((() => {
      const s = r.innerHTML;
      return xe(r), this.setSelectedRange(e), t(s);
    }));
  }
}
dt(de, "events", { keydown(n) {
  this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = !0;
  const t = Ho[n.keyCode];
  if (t) {
    var e;
    let r = this.keys;
    ["ctrl", "alt", "shift", "meta"].forEach(((s) => {
      var a;
      n["".concat(s, "Key")] && (s === "ctrl" && (s = "control"), r = (a = r) === null || a === void 0 ? void 0 : a[s]);
    })), ((e = r) === null || e === void 0 ? void 0 : e[t]) != null && (this.setInputSummary({ keyName: t }), Ue.reset(), r[t].call(this, n));
  }
  if (ao(n)) {
    const r = String.fromCharCode(n.keyCode).toLowerCase();
    if (r) {
      var i;
      const s = ["alt", "shift"].map(((a) => {
        if (n["".concat(a, "Key")]) return a;
      })).filter(((a) => a));
      s.push(r), (i = this.delegate) !== null && i !== void 0 && i.inputControllerDidReceiveKeyboardCommand(s) && n.preventDefault();
    }
  }
}, keypress(n) {
  if (this.inputSummary.eventName != null || n.metaKey || n.ctrlKey && !n.altKey) return;
  const t = Jc(n);
  var e, i;
  return t ? ((e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformTyping(), (i = this.responder) === null || i === void 0 || i.insertString(t), this.setInputSummary({ textAdded: t, didDelete: this.selectionIsExpanded() })) : void 0;
}, textInput(n) {
  const { data: t } = n, { textAdded: e } = this.inputSummary;
  if (e && e !== t && e.toUpperCase() === t) {
    var i;
    const r = this.getSelectedRange();
    return this.setSelectedRange([r[0], r[1] + e.length]), (i = this.responder) === null || i === void 0 || i.insertString(t), this.setInputSummary({ textAdded: t }), this.setSelectedRange(r);
  }
}, dragenter(n) {
  n.preventDefault();
}, dragstart(n) {
  var t, e;
  return this.serializeSelectionToDataTransfer(n.dataTransfer), this.draggedRange = this.getSelectedRange(), (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidStartDrag) === null || e === void 0 ? void 0 : e.call(t);
}, dragover(n) {
  if (this.draggedRange || this.canAcceptDataTransfer(n.dataTransfer)) {
    n.preventDefault();
    const i = { x: n.clientX, y: n.clientY };
    var t, e;
    if (!si(i, this.draggingPoint)) return this.draggingPoint = i, (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidReceiveDragOverPoint) === null || e === void 0 ? void 0 : e.call(t, this.draggingPoint);
  }
}, dragend(n) {
  var t, e;
  (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidCancelDrag) === null || e === void 0 || e.call(t), this.draggedRange = null, this.draggingPoint = null;
}, drop(n) {
  var t, e;
  n.preventDefault();
  const i = (t = n.dataTransfer) === null || t === void 0 ? void 0 : t.files, r = n.dataTransfer.getData("application/x-trix-document"), s = { x: n.clientX, y: n.clientY };
  if ((e = this.responder) === null || e === void 0 || e.setLocationRangeFromPointRange(s), i != null && i.length) this.attachFiles(i);
  else if (this.draggedRange) {
    var a, o;
    (a = this.delegate) === null || a === void 0 || a.inputControllerWillMoveText(), (o = this.responder) === null || o === void 0 || o.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender();
  } else if (r) {
    var l;
    const c = Rt.fromJSONString(r);
    (l = this.responder) === null || l === void 0 || l.insertDocument(c), this.requestRender();
  }
  this.draggedRange = null, this.draggingPoint = null;
}, cut(n) {
  var t, e;
  if ((t = this.responder) !== null && t !== void 0 && t.selectionIsExpanded() && (this.serializeSelectionToDataTransfer(n.clipboardData) && n.preventDefault(), (e = this.delegate) === null || e === void 0 || e.inputControllerWillCutText(), this.deleteInDirection("backward"), n.defaultPrevented)) return this.requestRender();
}, copy(n) {
  var t;
  (t = this.responder) !== null && t !== void 0 && t.selectionIsExpanded() && this.serializeSelectionToDataTransfer(n.clipboardData) && n.preventDefault();
}, paste(n) {
  const t = n.clipboardData || n.testClipboardData, e = { clipboard: t };
  if (!t || Yc(n)) return void this.getPastedHTMLUsingHiddenElement(((u) => {
    var x, v, O;
    return e.type = "text/html", e.html = u, (x = this.delegate) === null || x === void 0 || x.inputControllerWillPaste(e), (v = this.responder) === null || v === void 0 || v.insertHTML(e.html), this.requestRender(), (O = this.delegate) === null || O === void 0 ? void 0 : O.inputControllerDidPaste(e);
  }));
  const i = t.getData("URL"), r = t.getData("text/html"), s = t.getData("public.url-name");
  if (i) {
    var a, o, l;
    let u;
    e.type = "text/html", u = s ? $r(s).trim() : i, e.html = this.createLinkHTML(i, u), (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(e), this.setInputSummary({ textAdded: u, didDelete: this.selectionIsExpanded() }), (o = this.responder) === null || o === void 0 || o.insertHTML(e.html), this.requestRender(), (l = this.delegate) === null || l === void 0 || l.inputControllerDidPaste(e);
  } else if (so(t)) {
    var c, h, b;
    e.type = "text/plain", e.string = t.getData("text/plain"), (c = this.delegate) === null || c === void 0 || c.inputControllerWillPaste(e), this.setInputSummary({ textAdded: e.string, didDelete: this.selectionIsExpanded() }), (h = this.responder) === null || h === void 0 || h.insertString(e.string), this.requestRender(), (b = this.delegate) === null || b === void 0 || b.inputControllerDidPaste(e);
  } else if (r) {
    var g, p, _;
    e.type = "text/html", e.html = r, (g = this.delegate) === null || g === void 0 || g.inputControllerWillPaste(e), (p = this.responder) === null || p === void 0 || p.insertHTML(e.html), this.requestRender(), (_ = this.delegate) === null || _ === void 0 || _.inputControllerDidPaste(e);
  } else if (Array.from(t.types).includes("Files")) {
    var f, A;
    const u = (f = t.items) === null || f === void 0 || (f = f[0]) === null || f === void 0 || (A = f.getAsFile) === null || A === void 0 ? void 0 : A.call(f);
    if (u) {
      var w, T, C;
      const x = Kc(u);
      !u.name && x && (u.name = "pasted-file-".concat(++zc, ".").concat(x)), e.type = "File", e.file = u, (w = this.delegate) === null || w === void 0 || w.inputControllerWillAttachFiles(), (T = this.responder) === null || T === void 0 || T.insertFile(e.file), this.requestRender(), (C = this.delegate) === null || C === void 0 || C.inputControllerDidPaste(e);
    }
  }
  n.preventDefault();
}, compositionstart(n) {
  return this.getCompositionInput().start(n.data);
}, compositionupdate(n) {
  return this.getCompositionInput().update(n.data);
}, compositionend(n) {
  return this.getCompositionInput().end(n.data);
}, beforeinput(n) {
  this.inputSummary.didInput = !0;
}, input(n) {
  return this.inputSummary.didInput = !0, n.stopPropagation();
} }), dt(de, "keys", { backspace(n) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("backward", n);
}, delete(n) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("forward", n);
}, return(n) {
  var t, e;
  return this.setInputSummary({ preferDocument: !0 }), (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 ? void 0 : e.insertLineBreak();
}, tab(n) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.canIncreaseNestingLevel() && ((e = this.responder) === null || e === void 0 || e.increaseNestingLevel(), this.requestRender(), n.preventDefault());
}, left(n) {
  var t;
  if (this.selectionIsInCursorTarget()) return n.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("backward");
}, right(n) {
  var t;
  if (this.selectionIsInCursorTarget()) return n.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("forward");
}, control: { d(n) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("forward", n);
}, h(n) {
  var t;
  return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.deleteInDirection("backward", n);
}, o(n) {
  var t, e;
  return n.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 || e.insertString(`
`, { updatePosition: !1 }), this.requestRender();
} }, shift: { return(n) {
  var t, e;
  (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 || e.insertString(`
`), this.requestRender(), n.preventDefault();
}, tab(n) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.canDecreaseNestingLevel() && ((e = this.responder) === null || e === void 0 || e.decreaseNestingLevel(), this.requestRender(), n.preventDefault());
}, left(n) {
  if (this.selectionIsInCursorTarget()) return n.preventDefault(), this.expandSelectionInDirection("backward");
}, right(n) {
  if (this.selectionIsInCursorTarget()) return n.preventDefault(), this.expandSelectionInDirection("forward");
} }, alt: { backspace(n) {
  var t;
  return this.setInputSummary({ preferDocument: !1 }), (t = this.delegate) === null || t === void 0 ? void 0 : t.inputControllerWillPerformTyping();
} }, meta: { backspace(n) {
  var t;
  return this.setInputSummary({ preferDocument: !1 }), (t = this.delegate) === null || t === void 0 ? void 0 : t.inputControllerWillPerformTyping();
} } }), de.proxyMethod("responder?.getSelectedRange"), de.proxyMethod("responder?.setSelectedRange"), de.proxyMethod("responder?.expandSelectionInDirection"), de.proxyMethod("responder?.selectionIsInCursorTarget"), de.proxyMethod("responder?.selectionIsExpanded");
const Kc = (n) => {
  var t;
  return (t = n.type) === null || t === void 0 || (t = t.match(/\/(\w+)$/)) === null || t === void 0 ? void 0 : t[1];
}, Gc = !((Kn = " ".codePointAt) === null || Kn === void 0 || !Kn.call(" ", 0)), Jc = function(n) {
  if (n.key && Gc && n.key.codePointAt(0) === n.keyCode) return n.key;
  {
    let t;
    if (n.which === null ? t = n.keyCode : n.which !== 0 && n.charCode !== 0 && (t = n.charCode), t != null && Ho[t] !== "escape") return Di.fromCodepoints([t]).toString();
  }
}, Yc = function(n) {
  const t = n.clipboardData;
  if (t) {
    if (t.types.includes("text/html")) {
      for (const e of t.types) {
        const i = /^CorePasteboardFlavorType/.test(e), r = /^dyn\./.test(e) && t.getData(e);
        if (i || r) return !0;
      }
      return !1;
    }
    {
      const e = t.types.includes("com.apple.webarchive"), i = t.types.includes("com.apple.flat-rtfd");
      return e || i;
    }
  }
};
class ye extends et {
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
    return this.data.end = t, this.isSignificant() ? (this.forgetPlaceholder(), this.canApplyToDocument() ? (this.setInputSummary({ preferDocument: !0, didInput: !1 }), (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformTyping(), (i = this.responder) === null || i === void 0 || i.setSelectedRange(this.range), (r = this.responder) === null || r === void 0 || r.insertString(this.data.end), (s = this.responder) === null || s === void 0 ? void 0 : s.setSelectedRange(this.range[0] + this.data.end.length)) : this.data.start != null || this.data.update != null ? (this.requestReparse(), this.inputController.reset()) : void 0) : this.inputController.reset();
    var e, i, r, s;
  }
  getEndData() {
    return this.data.end;
  }
  isEnded() {
    return this.getEndData() != null;
  }
  isSignificant() {
    return !Wc.composesExistingText || this.inputSummary.didInput;
  }
  canApplyToDocument() {
    var t, e;
    return ((t = this.data.start) === null || t === void 0 ? void 0 : t.length) === 0 && ((e = this.data.end) === null || e === void 0 ? void 0 : e.length) > 0 && this.range;
  }
}
ye.proxyMethod("inputController.setInputSummary"), ye.proxyMethod("inputController.requestRender"), ye.proxyMethod("inputController.requestReparse"), ye.proxyMethod("responder?.selectionIsExpanded"), ye.proxyMethod("responder?.insertPlaceholder"), ye.proxyMethod("responder?.selectPlaceholder"), ye.proxyMethod("responder?.forgetPlaceholder");
class Li extends vn {
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
    return (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), this.withTargetDOMRange((function() {
      var r;
      return (r = this.responder) === null || r === void 0 ? void 0 : r.insertString(e, i);
    }));
  }
  toggleAttributeIfSupported(t) {
    var e;
    if (_r().includes(t)) return (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformFormatting(t), this.withTargetDOMRange((function() {
      var i;
      return (i = this.responder) === null || i === void 0 ? void 0 : i.toggleCurrentAttribute(t);
    }));
  }
  activateAttributeIfSupported(t, e) {
    var i;
    if (_r().includes(t)) return (i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformFormatting(t), this.withTargetDOMRange((function() {
      var r;
      return (r = this.responder) === null || r === void 0 ? void 0 : r.setCurrentAttribute(t, e);
    }));
  }
  deleteInDirection(t) {
    let { recordUndoEntry: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { recordUndoEntry: !0 };
    var i;
    e && ((i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformTyping());
    const r = () => {
      var a;
      return (a = this.responder) === null || a === void 0 ? void 0 : a.deleteInDirection(t);
    }, s = this.getTargetDOMRange({ minLength: this.composing ? 1 : 2 });
    return s ? this.withTargetDOMRange(s, r) : r();
  }
  withTargetDOMRange(t, e) {
    var i;
    return typeof t == "function" && (e = t, t = this.getTargetDOMRange()), t ? (i = this.responder) === null || i === void 0 ? void 0 : i.withTargetDOMRange(t, e.bind(this)) : (Ue.reset(), e.call(this));
  }
  getTargetDOMRange() {
    var t, e;
    let { minLength: i } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { minLength: 0 };
    const r = (t = (e = this.event).getTargetRanges) === null || t === void 0 ? void 0 : t.call(e);
    if (r && r.length) {
      const s = Xc(r[0]);
      if (i === 0 || s.toString().length >= i) return s;
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
dt(Li, "events", { keydown(n) {
  if (ao(n)) {
    var t;
    const e = td(n);
    (t = this.delegate) !== null && t !== void 0 && t.inputControllerDidReceiveKeyboardCommand(e) && n.preventDefault();
  } else {
    let e = n.key;
    n.altKey && (e += "+Alt"), n.shiftKey && (e += "+Shift");
    const i = this.constructor.keys[e];
    if (i) return this.withEvent(n, i);
  }
}, paste(n) {
  var t;
  let e;
  const i = (t = n.clipboardData) === null || t === void 0 ? void 0 : t.getData("URL");
  return Uo(n) ? (n.preventDefault(), this.attachFiles(n.clipboardData.files)) : Zc(n) ? (n.preventDefault(), e = { type: "text/plain", string: n.clipboardData.getData("text/plain") }, (r = this.delegate) === null || r === void 0 || r.inputControllerWillPaste(e), (s = this.responder) === null || s === void 0 || s.insertString(e.string), this.render(), (a = this.delegate) === null || a === void 0 ? void 0 : a.inputControllerDidPaste(e)) : i ? (n.preventDefault(), e = { type: "text/html", html: this.createLinkHTML(i) }, (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(e), (l = this.responder) === null || l === void 0 || l.insertHTML(e.html), this.render(), (c = this.delegate) === null || c === void 0 ? void 0 : c.inputControllerDidPaste(e)) : void 0;
  var r, s, a, o, l, c;
}, beforeinput(n) {
  const t = this.constructor.inputTypes[n.inputType], e = (i = n, !(!/iPhone|iPad/.test(navigator.userAgent) || i.inputType && i.inputType !== "insertParagraph"));
  var i;
  t && (this.withEvent(n, t), e || this.scheduleRender()), e && this.render();
}, input(n) {
  Ue.reset();
}, dragstart(n) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.selectionContainsAttachments() && (n.dataTransfer.setData("application/x-trix-dragging", !0), this.dragging = { range: (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedRange(), point: Jn(n) });
}, dragenter(n) {
  Gn(n) && n.preventDefault();
}, dragover(n) {
  if (this.dragging) {
    n.preventDefault();
    const e = Jn(n);
    var t;
    if (!si(e, this.dragging.point)) return this.dragging.point = e, (t = this.responder) === null || t === void 0 ? void 0 : t.setLocationRangeFromPointRange(e);
  } else Gn(n) && n.preventDefault();
}, drop(n) {
  var t, e;
  if (this.dragging) return n.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillMoveText(), (e = this.responder) === null || e === void 0 || e.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender();
  if (Gn(n)) {
    var i;
    n.preventDefault();
    const r = Jn(n);
    return (i = this.responder) === null || i === void 0 || i.setLocationRangeFromPointRange(r), this.attachFiles(n.dataTransfer.files);
  }
}, dragend() {
  var n;
  this.dragging && ((n = this.responder) === null || n === void 0 || n.setSelectedRange(this.dragging.range), this.dragging = null);
}, compositionend(n) {
  this.composing && (this.composing = !1, Bi.recentAndroid || this.scheduleRender());
} }), dt(Li, "keys", { ArrowLeft() {
  var n, t;
  if ((n = this.responder) !== null && n !== void 0 && n.shouldManageMovingCursorInDirection("backward")) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("backward");
}, ArrowRight() {
  var n, t;
  if ((n = this.responder) !== null && n !== void 0 && n.shouldManageMovingCursorInDirection("forward")) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 ? void 0 : t.moveCursorInDirection("forward");
}, Backspace() {
  var n, t, e;
  if ((n = this.responder) !== null && n !== void 0 && n.shouldManageDeletingInDirection("backward")) return this.event.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillPerformTyping(), (e = this.responder) === null || e === void 0 || e.deleteInDirection("backward"), this.render();
}, Tab() {
  var n, t;
  if ((n = this.responder) !== null && n !== void 0 && n.canIncreaseNestingLevel()) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 || t.increaseNestingLevel(), this.render();
}, "Tab+Shift"() {
  var n, t;
  if ((n = this.responder) !== null && n !== void 0 && n.canDecreaseNestingLevel()) return this.event.preventDefault(), (t = this.responder) === null || t === void 0 || t.decreaseNestingLevel(), this.render();
} }), dt(Li, "inputTypes", { deleteByComposition() {
  return this.deleteInDirection("backward", { recordUndoEntry: !1 });
}, deleteByCut() {
  return this.deleteInDirection("backward");
}, deleteByDrag() {
  return this.event.preventDefault(), this.withTargetDOMRange((function() {
    var n;
    this.deleteByDragRange = (n = this.responder) === null || n === void 0 ? void 0 : n.getSelectedRange();
  }));
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
  var n;
  if ((n = this.responder) !== null && n !== void 0 && n.canIncreaseNestingLevel()) return this.withTargetDOMRange((function() {
    var t;
    return (t = this.responder) === null || t === void 0 ? void 0 : t.increaseNestingLevel();
  }));
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
  var n;
  if ((n = this.responder) !== null && n !== void 0 && n.canDecreaseNestingLevel()) return this.withTargetDOMRange((function() {
    var t;
    return (t = this.responder) === null || t === void 0 ? void 0 : t.decreaseNestingLevel();
  }));
}, formatRemove() {
  this.withTargetDOMRange((function() {
    for (const e in (n = this.responder) === null || n === void 0 ? void 0 : n.getCurrentAttributes()) {
      var n, t;
      (t = this.responder) === null || t === void 0 || t.removeCurrentAttribute(e);
    }
  }));
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
  var n;
  return (n = this.delegate) === null || n === void 0 ? void 0 : n.inputControllerWillPerformRedo();
}, historyUndo() {
  var n;
  return (n = this.delegate) === null || n === void 0 ? void 0 : n.inputControllerWillPerformUndo();
}, insertCompositionText() {
  return this.composing = !0, this.insertString(this.event.data);
}, insertFromComposition() {
  return this.composing = !1, this.insertString(this.event.data);
}, insertFromDrop() {
  const n = this.deleteByDragRange;
  var t;
  if (n) return this.deleteByDragRange = null, (t = this.delegate) === null || t === void 0 || t.inputControllerWillMoveText(), this.withTargetDOMRange((function() {
    var e;
    return (e = this.responder) === null || e === void 0 ? void 0 : e.moveTextFromRange(n);
  }));
}, insertFromPaste() {
  const { dataTransfer: n } = this.event, t = { dataTransfer: n }, e = n.getData("URL"), i = n.getData("text/html");
  if (e) {
    var r;
    let l;
    this.event.preventDefault(), t.type = "text/html";
    const c = n.getData("public.url-name");
    l = c ? $r(c).trim() : e, t.html = this.createLinkHTML(e, l), (r = this.delegate) === null || r === void 0 || r.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var h;
      return (h = this.responder) === null || h === void 0 ? void 0 : h.insertHTML(t.html);
    })), this.afterRender = () => {
      var h;
      return (h = this.delegate) === null || h === void 0 ? void 0 : h.inputControllerDidPaste(t);
    };
  } else if (so(n)) {
    var s;
    t.type = "text/plain", t.string = n.getData("text/plain"), (s = this.delegate) === null || s === void 0 || s.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertString(t.string);
    })), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
    };
  } else if (Qc(this.event)) {
    var a;
    t.type = "File", t.file = n.files[0], (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertFile(t.file);
    })), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
    };
  } else if (i) {
    var o;
    this.event.preventDefault(), t.type = "text/html", t.html = i, (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertHTML(t.html);
    })), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
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
  var n;
  return (n = this.delegate) === null || n === void 0 || n.inputControllerWillPerformTyping(), this.withTargetDOMRange((function() {
    var t;
    return (t = this.responder) === null || t === void 0 ? void 0 : t.insertLineBreak();
  }));
}, insertReplacementText() {
  const n = this.event.dataTransfer.getData("text/plain"), t = this.event.getTargetRanges()[0];
  this.withTargetDOMRange(t, (() => {
    this.insertString(n, { updatePosition: !1 });
  }));
}, insertText() {
  var n;
  return this.insertString(this.event.data || ((n = this.event.dataTransfer) === null || n === void 0 ? void 0 : n.getData("text/plain")));
}, insertTranspose() {
  return this.insertString(this.event.data);
}, insertUnorderedList() {
  return this.toggleAttributeIfSupported("bullet");
} });
const Xc = function(n) {
  const t = document.createRange();
  return t.setStart(n.startContainer, n.startOffset), t.setEnd(n.endContainer, n.endOffset), t;
}, Gn = (n) => {
  var t;
  return Array.from(((t = n.dataTransfer) === null || t === void 0 ? void 0 : t.types) || []).includes("Files");
}, Qc = (n) => {
  var t;
  return ((t = n.dataTransfer.files) === null || t === void 0 ? void 0 : t[0]) && !Uo(n) && !((e) => {
    let { dataTransfer: i } = e;
    return i.types.includes("Files") && i.types.includes("text/html") && i.getData("text/html").includes("urn:schemas-microsoft-com:office:office");
  })(n);
}, Uo = function(n) {
  const t = n.clipboardData;
  if (t)
    return Array.from(t.types).filter(((e) => e.match(/file/i))).length === t.types.length && t.files.length >= 1;
}, Zc = function(n) {
  const t = n.clipboardData;
  if (t) return t.types.includes("text/plain") && t.types.length === 1;
}, td = function(n) {
  const t = [];
  return n.altKey && t.push("alt"), n.shiftKey && t.push("shift"), t.push(n.key), t;
}, Jn = (n) => ({ x: n.clientX, y: n.clientY }), Tr = "[data-trix-attribute]", kr = "[data-trix-action]", ed = "".concat(Tr, ", ").concat(kr), yn = "[data-trix-dialog]", id = "".concat(yn, "[data-trix-active]"), nd = "".concat(yn, " [data-trix-method]"), Us = "".concat(yn, " [data-trix-input]"), $s = (n, t) => (t || (t = Ge(n)), n.querySelector("[data-trix-input][name='".concat(t, "']"))), js = (n) => n.getAttribute("data-trix-action"), Ge = (n) => n.getAttribute("data-trix-attribute") || n.getAttribute("data-trix-dialog-attribute");
class $o extends et {
  constructor(t) {
    super(t), this.didClickActionButton = this.didClickActionButton.bind(this), this.didClickAttributeButton = this.didClickAttributeButton.bind(this), this.didClickDialogButton = this.didClickDialogButton.bind(this), this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this), this.element = t, this.attributes = {}, this.actions = {}, this.resetDialogInputs(), J("mousedown", { onElement: this.element, matchingSelector: kr, withCallback: this.didClickActionButton }), J("mousedown", { onElement: this.element, matchingSelector: Tr, withCallback: this.didClickAttributeButton }), J("click", { onElement: this.element, matchingSelector: ed, preventDefault: !0 }), J("click", { onElement: this.element, matchingSelector: nd, withCallback: this.didClickDialogButton }), J("keydown", { onElement: this.element, matchingSelector: Us, withCallback: this.didKeyDownDialogInput });
  }
  didClickActionButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const r = js(e);
    return this.getDialog(r) ? this.toggleDialog(r) : (s = this.delegate) === null || s === void 0 ? void 0 : s.toolbarDidInvokeAction(r, e);
    var s;
  }
  didClickAttributeButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const r = Ge(e);
    var s;
    return this.getDialog(r) ? this.toggleDialog(r) : (s = this.delegate) === null || s === void 0 || s.toolbarDidToggleAttribute(r), this.refreshAttributeButtons();
  }
  didClickDialogButton(t, e) {
    const i = Ee(e, { matchingSelector: yn });
    return this[e.getAttribute("data-trix-method")].call(this, i);
  }
  didKeyDownDialogInput(t, e) {
    if (t.keyCode === 13) {
      t.preventDefault();
      const i = e.getAttribute("name"), r = this.getDialog(i);
      this.setAttribute(r);
    }
    if (t.keyCode === 27) return t.preventDefault(), this.hideDialog();
  }
  updateActions(t) {
    return this.actions = t, this.refreshActionButtons();
  }
  refreshActionButtons() {
    return this.eachActionButton(((t, e) => {
      t.disabled = this.actions[e] === !1;
    }));
  }
  eachActionButton(t) {
    return Array.from(this.element.querySelectorAll(kr)).map(((e) => t(e, js(e))));
  }
  updateAttributes(t) {
    return this.attributes = t, this.refreshAttributeButtons();
  }
  refreshAttributeButtons() {
    return this.eachAttributeButton(((t, e) => (t.disabled = this.attributes[e] === !1, this.attributes[e] || this.dialogIsVisible(e) ? (t.setAttribute("data-trix-active", ""), t.classList.add("trix-active")) : (t.removeAttribute("data-trix-active"), t.classList.remove("trix-active")))));
  }
  eachAttributeButton(t) {
    return Array.from(this.element.querySelectorAll(Tr)).map(((e) => t(e, Ge(e))));
  }
  applyKeyboardCommand(t) {
    const e = JSON.stringify(t.sort());
    for (const i of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
      const r = i.getAttribute("data-trix-key").split("+");
      if (JSON.stringify(r.sort()) === e) return _i("mousedown", { onElement: i }), !0;
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
    const r = this.getDialog(t);
    r.setAttribute("data-trix-active", ""), r.classList.add("trix-active"), Array.from(r.querySelectorAll("input[disabled]")).forEach(((a) => {
      a.removeAttribute("disabled");
    }));
    const s = Ge(r);
    if (s) {
      const a = $s(r, t);
      a && (a.value = this.attributes[s] || "", a.select());
    }
    return (i = this.delegate) === null || i === void 0 ? void 0 : i.toolbarDidShowDialog(t);
  }
  setAttribute(t) {
    var e;
    const i = Ge(t), r = $s(t, i);
    return !r.willValidate || (r.setCustomValidity(""), r.checkValidity() && this.isSafeAttribute(r)) ? ((e = this.delegate) === null || e === void 0 || e.toolbarDidUpdateAttribute(i, r.value), this.hideDialog()) : (r.setCustomValidity("Invalid value"), r.setAttribute("data-trix-validate", ""), r.classList.add("trix-validate"), r.focus());
  }
  isSafeAttribute(t) {
    return !t.hasAttribute("data-trix-validate-href") || Ze.isValidAttribute("a", "href", t.value);
  }
  removeAttribute(t) {
    var e;
    const i = Ge(t);
    return (e = this.delegate) === null || e === void 0 || e.toolbarDidRemoveAttribute(i), this.hideDialog();
  }
  hideDialog() {
    const t = this.element.querySelector(id);
    var e;
    if (t) return t.removeAttribute("data-trix-active"), t.classList.remove("trix-active"), this.resetDialogInputs(), (e = this.delegate) === null || e === void 0 ? void 0 : e.toolbarDidHideDialog(((i) => i.getAttribute("data-trix-dialog"))(t));
  }
  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(Us)).forEach(((t) => {
      t.setAttribute("disabled", "disabled"), t.removeAttribute("data-trix-validate"), t.classList.remove("trix-validate");
    }));
  }
  getDialog(t) {
    return this.element.querySelector("[data-trix-dialog=".concat(t, "]"));
  }
}
class wi extends No {
  constructor(t) {
    let { editorElement: e, document: i, html: r } = t;
    super(...arguments), this.editorElement = e, this.selectionManager = new Oe(this.editorElement), this.selectionManager.delegate = this, this.composition = new _e(), this.composition.delegate = this, this.attachmentManager = new Lo(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = Fr.getLevel() === 2 ? new Li(this.editorElement) : new de(this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new Bo(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new $o(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new ko(this.composition, this.selectionManager, this.editorElement), i ? this.editor.loadDocument(i) : this.editor.loadHTML(r);
  }
  registerSelectionManager() {
    return Ue.registerSelectionManager(this.selectionManager);
  }
  unregisterSelectionManager() {
    return Ue.unregisterSelectionManager(this.selectionManager);
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
    return this.composition.updateCurrentAttributes(), this.updateCurrentActions(), this.attachmentLocationRange && !ln(this.attachmentLocationRange, t) && this.composition.stopEditingAttachment(), this.notifyEditorElement("selection-change");
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
    if (!si(t, this.currentActions)) return this.currentActions = t, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions });
  }
  runEditorFilters() {
    let t = this.composition.getSnapshot();
    if (Array.from(this.editor.filters).forEach(((r) => {
      const { document: s, selectedRange: a } = t;
      t = r.call(this.editor, t) || {}, t.document || (t.document = s), t.selectedRange || (t.selectedRange = a);
    })), e = t, i = this.composition.getSnapshot(), !ln(e.selectedRange, i.selectedRange) || !e.document.isEqualTo(i.document)) return this.composition.loadSnapshot(t);
    var e, i;
  }
  updateInputElement() {
    const t = (function(e, i) {
      const r = Ic[i];
      if (r) return r(e);
      throw new Error("unknown content type: ".concat(i));
    })(this.compositionController.getSerializableElement(), "text/html");
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
    const e = Z(t), i = this.selectionManager.getLocationRange();
    if (e || !ue(i)) return this.editor.recordUndoEntry("Formatting", { context: this.getUndoContext(), consolidatable: !0 });
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
    return ue(t) ? t[0].index : t;
  }
  getTimeContext() {
    return br.interval > 0 ? Math.floor((/* @__PURE__ */ new Date()).getTime() / br.interval) : 0;
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
dt(wi, "actions", { undo: { test() {
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
  return Fr.pickFiles(this.editor.insertFiles);
} } }), wi.proxyMethod("getSelectionManager().setLocationRange"), wi.proxyMethod("getSelectionManager().getLocationRange");
var rd = Object.freeze({ __proto__: null, AttachmentEditorController: Mo, CompositionController: Bo, Controller: No, EditorController: wi, InputController: vn, Level0InputController: de, Level2InputController: Li, ToolbarController: $o }), sd = Object.freeze({ __proto__: null, MutationObserver: Fo, SelectionChangeObserver: lo }), ad = Object.freeze({ __proto__: null, FileVerificationOperation: qo, ImagePreloadOperation: Eo });
ro("trix-toolbar", `%t {
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
class jo extends HTMLElement {
  connectedCallback() {
    this.innerHTML === "" && (this.innerHTML = no.getDefaultHTML());
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
let od = 0;
const ld = function(n) {
  if (!n.hasAttribute("contenteditable")) return n.toggleAttribute("contenteditable", !n.disabled), (function(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return e.times = 1, J(t, e);
  })("focus", { onElement: n, withCallback: () => cd(n) });
}, cd = function(n) {
  return dd(n), ud();
}, dd = function(n) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "enableObjectResizing")) return document.execCommand("enableObjectResizing", !1, !1), J("mscontrolselect", { onElement: n, preventDefault: !0 });
}, ud = function(n) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "DefaultParagraphSeparator")) {
    const { tagName: i } = mt.default;
    if (["div", "p"].includes(i)) return document.execCommand("DefaultParagraphSeparator", !1, i);
  }
}, Vs = Bi.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
ro("trix-editor", `%t {
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

%t `.concat(Be, ` figcaption textarea {
    resize: none;
}

%t `).concat(Be, ` figcaption textarea.trix-autoresize-clone {
    position: absolute;
    left: -9999px;
    max-height: 0px;
}

%t `).concat(Be, ` figcaption[data-trix-placeholder]:empty::before {
    content: attr(data-trix-placeholder);
    color: graytext;
}

%t [data-trix-cursor-target] {
    display: `).concat(Vs.display, ` !important;
    width: `).concat(Vs.width, ` !important;
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
var Vt = /* @__PURE__ */ new WeakMap(), zi = /* @__PURE__ */ new WeakMap(), fi = /* @__PURE__ */ new WeakSet();
class hd {
  constructor(t) {
    var e, i;
    Ao(e = this, i = fi), i.add(e), dt(this, "value", ""), Qe(this, Vt, { writable: !0, value: void 0 }), Qe(this, zi, { writable: !0, value: void 0 }), this.element = t, Si(this, Vt, t.attachInternals()), Si(this, zi, !1);
  }
  connectedCallback() {
    Wi(this, fi, Ki).call(this);
  }
  disconnectedCallback() {
  }
  get form() {
    return P(this, Vt).form;
  }
  get name() {
    return this.element.getAttribute("name");
  }
  set name(t) {
    this.element.setAttribute("name", t);
  }
  get labels() {
    return P(this, Vt).labels;
  }
  get disabled() {
    return P(this, zi) || this.element.hasAttribute("disabled");
  }
  set disabled(t) {
    this.element.toggleAttribute("disabled", t);
  }
  get required() {
    return this.element.hasAttribute("required");
  }
  set required(t) {
    this.element.toggleAttribute("required", t), Wi(this, fi, Ki).call(this);
  }
  get validity() {
    return P(this, Vt).validity;
  }
  get validationMessage() {
    return P(this, Vt).validationMessage;
  }
  get willValidate() {
    return P(this, Vt).willValidate;
  }
  formDisabledCallback(t) {
    Si(this, zi, t);
  }
  setFormValue(t) {
    this.value = t, Wi(this, fi, Ki).call(this), P(this, Vt).setFormValue(this.element.disabled ? void 0 : this.value);
  }
  checkValidity() {
    return P(this, Vt).checkValidity();
  }
  reportValidity() {
    return P(this, Vt).reportValidity();
  }
  setCustomValidity(t) {
    Wi(this, fi, Ki).call(this, t);
  }
}
function Ki() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const { required: t, value: e } = this.element, i = t && !e, r = !!n, s = I("input", { required: t }), a = n || s.validationMessage;
  P(this, Vt).setValidity({ valueMissing: i, customError: r }, a);
}
var Yn = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), Qn = /* @__PURE__ */ new WeakMap();
class md {
  constructor(t) {
    Qe(this, Yn, { writable: !0, value: void 0 }), Qe(this, Xn, { writable: !0, value: (e) => {
      e.defaultPrevented || e.target === this.element.form && this.element.reset();
    } }), Qe(this, Qn, { writable: !0, value: (e) => {
      if (e.defaultPrevented || this.element.contains(e.target)) return;
      const i = Ee(e.target, { matchingSelector: "label" });
      i && Array.from(this.labels).includes(i) && this.element.focus();
    } }), this.element = t;
  }
  connectedCallback() {
    Si(this, Yn, (function(t) {
      if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) return;
      const e = function() {
        const i = Array.from(t.labels).map(((s) => {
          if (!s.contains(t)) return s.textContent;
        })).filter(((s) => s)), r = i.join(" ");
        return r ? t.setAttribute("aria-label", r) : t.removeAttribute("aria-label");
      };
      return e(), J("focus", { onElement: t, withCallback: e });
    })(this.element)), window.addEventListener("reset", P(this, Xn), !1), window.addEventListener("click", P(this, Qn), !1);
  }
  disconnectedCallback() {
    var t;
    (t = P(this, Yn)) === null || t === void 0 || t.destroy(), window.removeEventListener("reset", P(this, Xn), !1), window.removeEventListener("click", P(this, Qn), !1);
  }
  get labels() {
    const t = [];
    this.element.id && this.element.ownerDocument && t.push(...Array.from(this.element.ownerDocument.querySelectorAll("label[for='".concat(this.element.id, "']")) || []));
    const e = Ee(this.element, { matchingSelector: "label" });
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
var Q = /* @__PURE__ */ new WeakMap();
class un extends HTMLElement {
  constructor() {
    super(), Qe(this, Q, { writable: !0, value: void 0 }), this.willCreateInput = !0, Si(this, Q, this.constructor.formAssociated ? new hd(this) : new md(this));
  }
  get trixId() {
    return this.hasAttribute("trix-id") ? this.getAttribute("trix-id") : (this.setAttribute("trix-id", ++od), this.trixId);
  }
  get labels() {
    return P(this, Q).labels;
  }
  get disabled() {
    const { inputElement: t } = this;
    return t ? t.disabled : P(this, Q).disabled;
  }
  set disabled(t) {
    const { inputElement: e } = this;
    e && (e.disabled = t), P(this, Q).disabled = t;
  }
  get required() {
    return P(this, Q).required;
  }
  set required(t) {
    P(this, Q).required = t;
  }
  get validity() {
    return P(this, Q).validity;
  }
  get validationMessage() {
    return P(this, Q).validationMessage;
  }
  get willValidate() {
    return P(this, Q).willValidate;
  }
  get type() {
    return this.localName;
  }
  get toolbarElement() {
    var t;
    if (this.hasAttribute("toolbar")) return (t = this.ownerDocument) === null || t === void 0 ? void 0 : t.getElementById(this.getAttribute("toolbar"));
    if (this.parentNode) {
      const e = "trix-toolbar-".concat(this.trixId);
      return this.setAttribute("toolbar", e), this.internalToolbar = I("trix-toolbar", { id: e }), this.parentNode.insertBefore(this.internalToolbar, this), this.internalToolbar;
    }
  }
  get form() {
    const { inputElement: t } = this;
    return t ? t.form : P(this, Q).form;
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
    return t ? t.name : P(this, Q).name;
  }
  set name(t) {
    const { inputElement: e } = this;
    e ? e.name = t : P(this, Q).name = t;
  }
  get value() {
    const { inputElement: t } = this;
    return t ? t.value : P(this, Q).value;
  }
  set value(t) {
    var e;
    this.defaultValue = t, (e = this.editor) === null || e === void 0 || e.loadHTML(this.defaultValue);
  }
  attributeChangedCallback(t, e, i) {
    t === "connected" && this.isConnected && e != null && e !== i && requestAnimationFrame((() => this.reconnect()));
  }
  notify(t, e) {
    if (this.editorController) return _i("trix-".concat(t), { onElement: this, attributes: e });
  }
  setFormValue(t) {
    const { inputElement: e } = this;
    e && (e.value = t), P(this, Q).setFormValue(t);
  }
  connectedCallback() {
    if (!this.hasAttribute("data-trix-internal")) {
      if (ld(this), (function(t) {
        t.hasAttribute("role") || t.setAttribute("role", "textbox");
      })(this), !this.editorController) {
        if (_i("trix-before-initialize", { onElement: this }), this.defaultValue = this.inputElement ? this.inputElement.value : this.innerHTML, !this.hasAttribute("input") && this.parentNode && this.willCreateInput) {
          const t = "trix-input-".concat(this.trixId);
          this.setAttribute("input", t);
          const e = I("input", { type: "hidden", id: t });
          this.parentNode.insertBefore(e, this.nextElementSibling);
        }
        this.editorController = new wi({ editorElement: this, html: this.defaultValue }), requestAnimationFrame((() => _i("trix-initialize", { onElement: this })));
      }
      this.editorController.registerSelectionManager(), P(this, Q).connectedCallback(), this.toggleAttribute("connected", !0), (function(t) {
        !document.querySelector(":focus") && t.hasAttribute("autofocus") && document.querySelector("[autofocus]") === t && t.focus();
      })(this);
    }
  }
  disconnectedCallback() {
    var t;
    (t = this.editorController) === null || t === void 0 || t.unregisterSelectionManager(), P(this, Q).disconnectedCallback(), this.toggleAttribute("connected", !1);
  }
  reconnect() {
    this.removeInternalToolbar(), this.disconnectedCallback(), this.connectedCallback();
  }
  removeInternalToolbar() {
    var t;
    (t = this.internalToolbar) === null || t === void 0 || t.remove(), this.internalToolbar = null;
  }
  checkValidity() {
    return P(this, Q).checkValidity();
  }
  reportValidity() {
    return P(this, Q).reportValidity();
  }
  setCustomValidity(t) {
    P(this, Q).setCustomValidity(t);
  }
  formDisabledCallback(t) {
    const { inputElement: e } = this;
    e && (e.disabled = t), this.toggleAttribute("contenteditable", !t), P(this, Q).formDisabledCallback(t);
  }
  formResetCallback() {
    this.reset();
  }
  reset() {
    this.value = this.defaultValue;
  }
}
dt(un, "formAssociated", "ElementInternals" in window), dt(un, "observedAttributes", ["connected"]);
const Ws = { VERSION: pl, config: Ni, core: Oc, models: Oo, views: Fc, controllers: rd, observers: sd, operations: ad, elements: Object.freeze({ __proto__: null, TrixEditorElement: un, TrixToolbarElement: jo }), filters: Object.freeze({ __proto__: null, Filter: Co, attachmentGalleryFilter: To }) };
Object.assign(Ws, Oo), window.Trix = Ws, setTimeout((function() {
  customElements.get("trix-toolbar") || customElements.define("trix-toolbar", jo), customElements.get("trix-editor") || customElements.define("trix-editor", un);
}), 0);
class pd extends HTMLElement {
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
const Gi = "filter-list-list", fd = "filter-list-item", gd = "filter-list-input", zs = "filter-list-searchable";
class bd extends HTMLElement {
  #t = !1;
  constructor() {
    super(), this._items = [], this._url = "", this._filterstart = !1, this._placeholder = "Liste filtern...", this._queryparam = "", this._startparams = null, this.render();
  }
  static get observedAttributes() {
    return ["data-url"];
  }
  set items(t) {
    Array.isArray(t) && (this._items = t, this.render());
  }
  get items() {
    return this._items;
  }
  connectedCallback() {
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && (this.#t = !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(t, e, i) {
    t === "data-url" && e !== i && (this._url = i, this.render()), t === "data-filterstart" && e !== i && (this._filterstart = i === "true", this.render()), t === "data-placeholder" && e !== i && (this._placeholder = i, this.render()), t === "data-queryparam" && e !== i && (this._queryparam = i, this.render());
  }
  onInput(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this._filter = t.target.value, this.renderList());
  }
  onGainFocus(t) {
    t.target && t.target.tagName.toLowerCase() === "input" && (this.#t = !1, this.renderList());
  }
  onLoseFocus(t) {
    let e = this.querySelector("input");
    if (t.target && t.target === e) {
      if (relatedElement = t.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      e.value = "", this._filter = "", this._filterstart && (this.#t = !0), this.renderList();
    }
  }
  onEnter(t) {
    if (t.target && t.target.tagName.toLowerCase() === "input" && t.key === "Enter") {
      t.preventDefault();
      const e = this.querySelector("a");
      e && e.click();
    }
  }
  mark() {
    if (typeof Mark != "function")
      return;
    let t = this.querySelector("#" + Gi);
    if (!t)
      return;
    let e = new Mark(t.querySelectorAll("." + zs));
    this._filter && e.mark(this._filter, {
      separateWordSearch: !0
    });
  }
  // INFO: allows for setting a custom HREF of the list item
  // The function takes the item as parameter fn(item) and should return a string.
  setHREFFunc(t) {
    this.getHREF = t, this.render();
  }
  // INFO: allows for setting a custom link text of the list item
  // The function takes the item as parameter fn(item) and should return a string or
  // an HTML template literal.
  setLinkTextFunc(t) {
    this.getLinkText = t, this.render();
  }
  // INFO: allows for setting the text that will be filtered for.
  // The function takes the item as parameter fn(item) and should return a string.
  setSearchTextFunc(t) {
    this.getSearchText = t, this.render();
  }
  getHREF(t) {
    if (t) {
      if (t.id == null)
        return "";
    } else return "";
    return String(t.id);
  }
  getHREFEncoded(t) {
    return encodeURIComponent(this.getHREF(t));
  }
  getSearchText(t) {
    if (t) {
      if (!t.name)
        return "";
    } else return "";
    return t.name;
  }
  #e(t) {
    if (!t)
      return !1;
    let e = this.getHREF(t);
    return e === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === e ? !0 : !!window.location.href.endsWith(e);
  }
  getLinkText(t) {
    let e = this.getSearchText(t);
    return e === "" ? "" : `<span class="${zs}">${e}</span>`;
  }
  getURL(t) {
    if (this._queryparam) {
      let e = new URL(window.location), i = new URLSearchParams(e.search);
      return i.set(this._queryparam, this.getHREF(t)), i.delete("page"), e.search = i.toString(), e.toString();
    }
    return this._url + this.getHREFEncoded(t);
  }
  renderList() {
    let t = this.querySelector("#" + Gi);
    t && (t.outerHTML = this.List()), this.mark();
  }
  render() {
    this.innerHTML = `
            <div class="font-serif text-base shadow-inner border border-stone-100">
							${this.Input()}
							${this.List()}
            </div>
        `, htmx && htmx.process(this);
  }
  ActiveDot(t) {
    return this.#e(t), "";
  }
  NoItems(t) {
    return t.length === 0 ? '<div class="px-2 py-0.5 italic text-gray-500">Keine Einträge gefunden</div>' : "";
  }
  Input() {
    return `
			<div class="flex w-full py-0.5 border-b border-zinc-600 bg-stone-50">
						<i class="ri-arrow-right-s-line pl-2"></i>
						<div class="grow">
						<input
								type="text"
								placeholder="${this._placeholder}"
								class="${gd} w-full placeholder:italic px-2 py-0.5" />
						</div>
				</div>
				`;
  }
  List() {
    let t = this._items;
    if (this._filter)
      if (this._filterstart)
        t = this._items.filter((e) => this.getSearchText(e).toLowerCase().startsWith(this._filter.toLowerCase()));
      else {
        let e = this._filter.split(" ");
        t = this._items.filter((i) => e.every((r) => this.getSearchText(i).toLowerCase().includes(r.toLowerCase())));
      }
    return `
							<div id="${Gi}" class="${Gi} pt-1 max-h-60 overflow-auto bg-stone-50 ${this.#t ? "hidden" : ""}">
								${t.map(
      (e, i) => `
									<a
										href="${this.getURL(e)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${fd} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${i % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${this.#e(e) ? 'aria-current="page"' : ""}>
										${this.ActiveDot(e)}
										${this.getLinkText(e)}
									</a>
								`
    ).join("")}
								${this.NoItems(t)}
							</div>
				`;
  }
}
class vd extends HTMLElement {
  constructor() {
    super(), this.handleScroll = this.handleScroll.bind(this), this.scrollToTop = this.scrollToTop.bind(this);
  }
  connectedCallback() {
    this.innerHTML = `
          <button
            class="
              scroll-to-top
              fixed bottom-12 right-8 z-50
              hidden
              w-12 h-12
              bg-slate-700 hover:bg-slate-800 text-white
              rounded border-2 border-slate-600
              shadow-sm transition-all duration-200
              flex items-center justify-center
              cursor-pointer
            "
            aria-label="Scroll to top"
          >
					<i class="ri-arrow-up-double-line text-2xl"></i>
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
class yd extends HTMLElement {
  constructor() {
    super(), this.overlay = null, this._others = null, this._thisindex = -1, this._preview = null, this._description = null, this._imageURL = "", this._fullImageURL = "", this._hideDLButton = !1;
  }
  connectedCallback() {
    this.classList.add("cursor-pointer"), this.classList.add("select-none"), this._imageURL = this.getAttribute("data-image-url") || "", this._fullImageURL = this.getAttribute("data-full-image-url") || this._imageURL, this._hideDLButton = this.getAttribute("data-hide-dl-button") || !1, this._preview = this.querySelector("img"), this._description = this.querySelector(".image-description"), this._preview && this._preview.addEventListener("click", () => {
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
          src="${this._fullImageURL}"
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
    i && i.addEventListener("click", this.prev.bind(this)), this.overlay.addEventListener("click", (r) => {
      r.target === this.overlay && this.hideOverlay();
    }), document.addEventListener("keydown", this.Keys.bind(this), { once: !0 }), document.body.appendChild(this.overlay);
  }
  descriptionImgClass() {
    return this.description ? "" : "0";
  }
  nextButton() {
    return this._others[this._thisindex + 1] ? `
			<span data-tippy-placement="right" data-tippy-content="Nächstes Bild">
				<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Next image" id="nextbtn">
					<i class="ri-arrow-right-box-line"></i>
				</button>
			</span>
		` : "";
  }
  prevButton() {
    return this._others[this._thisindex - 1] ? `
			<span data-tippy-placement="right" data-tippy-content="Vorheriges Bild">
				<button class="hover:text-gray-300 cursor-pointer focus:outline-none" aria-label="Previous image" id="prevbtn">
					<i class="ri-arrow-left-box-line"></i>
				</button>
			</span>
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
					<span data-tippy-placement="right" data-tippy-content="Bild herunterladen">
						<a href="${this._fullImageURL}" target="_blank" class="text-white no-underline hover:text-gray-300"><i class="ri-file-download-line"></i></a>
					</span>
		`;
  }
  hideOverlay() {
    this.overlay.parentNode.removeChild(this.overlay), this.overlay = null;
  }
}
class _d extends HTMLElement {
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
      let i = this._headings[e], r = i.querySelectorAll(".show-opened");
      for (let a of r)
        a.classList.add("hidden");
      let s = i.querySelectorAll(".show-closed");
      for (let a of s)
        a.classList.add("hidden");
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
    for (let s of i)
      e ? s.classList.add("hidden") : s.classList.remove("hidden");
    const r = Array.from(t.querySelectorAll(".show-opened"));
    for (let s of r)
      e ? s.classList.remove("hidden") : s.classList.add("hidden");
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
class Ci extends HTMLElement {
  static get observedAttributes() {
    return ["data-text", "data-abbrevmap"];
  }
  static get defaultAbbrevMap() {
    return {
      "#": "Hinweis auf weitere Informationen in der Anmerkung.",
      $: "vermutlich",
      "+++": "Beiträge aus mehreren Almanachen interpoliert",
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
    super(), this._abbrevMap = Ci.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-abbrevmap" && this._parseAndSetAbbrevMap(i), this.render());
  }
  _parseAndSetAbbrevMap(t) {
    if (!t) {
      this._abbrevMap = Ci.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(t);
    } catch {
      this._abbrevMap = Ci.defaultAbbrevMap;
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
    let i = "", r = 0;
    for (; r < t.length; ) {
      if (r > 0 && !this.isSpaceOrPunct(t[r - 1])) {
        i += t[r], r++;
        continue;
      }
      const s = this.findLongestAbbrevAt(t, r, e);
      if (s) {
        const { match: a, meaning: o } = s;
        i += `
            <span class="!inline" data-tippy-placement="top" data-tippy-content="${o}">
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${a}
              </span>
            </span>
          `, r += a.length;
      } else
        i += t[r], r++;
    }
    return i;
  }
  findLongestAbbrevAt(t, e, i) {
    let r = null, s = 0;
    for (const a of Object.keys(i))
      t.startsWith(a, e) && a.length > s && (r = a, s = a.length);
    return r ? { match: r, meaning: i[r] } : null;
  }
  isSpaceOrPunct(t) {
    return /\s|[.,;:!?]/.test(t);
  }
}
class Ad extends HTMLElement {
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
class Ed extends HTMLElement {
  #t = 176;
  constructor() {
    super(), this._images = [];
  }
  connectedCallback() {
    this._images = Array.from(this.querySelectorAll(".primages")), this.calculateShownImages();
    const t = new ResizeObserver((e, i) => {
      this.calculateShownImages();
    });
    this._resizeObserver = t, t.observe(this);
  }
  disconnectedCallback() {
    this._resizeObserver.unobserve(this);
  }
  calculateShownImages() {
    const t = this.getBoundingClientRect(), e = Math.floor(t.width / (this.#t + 10));
    for (let i = 0; i < this._images.length; i++)
      i < e - 1 ? this._images[i].classList.remove("hidden") : this._images[i].classList.add("hidden");
  }
}
const xd = "mss-component-wrapper", Ks = "mss-selected-items-container", Sd = "mss-selected-item-pill", Ld = "mss-selected-item-text", wd = "mss-selected-item-pill-detail", Gs = "mss-selected-item-delete-btn", Cd = "mss-selected-item-edit-link", Js = "mss-input-controls-container", Ys = "mss-input-wrapper", Xs = "mss-input-wrapper-focused", Qs = "mss-text-input", Zs = "mss-create-new-button", ta = "mss-toggle-button", Td = "mss-inline-row", ea = "mss-options-list", kd = "mss-option-item", Rd = "mss-option-item-name", Dd = "mss-option-item-detail", ia = "mss-option-item-highlighted", Zn = "mss-hidden-select", tr = "mss-no-items-text", na = "mss-loading", er = 1, ir = 10, Id = 250, Od = "mss-state-no-selection", Md = "mss-state-has-selection", Bd = "mss-state-list-open";
class Nd extends HTMLElement {
  static formAssociated = !0;
  constructor() {
    super(), this.internals_ = this.attachInternals(), this._value = [], this._initialValue = [], this._initialOrder = [], this._displayOrder = [], this._removedIds = /* @__PURE__ */ new Set(), this._initialCaptured = !1, this._allowInitialCapture = !0, this._options = [
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
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._remoteEndpoint = null, this._remoteResultKey = "items", this._remoteMinChars = er, this._remoteLimit = ir, this._remoteFetchController = null, this._remoteFetchTimeout = null, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._editBase = this.getAttribute("data-edit-base") || "", this._editSuffix = this.getAttribute("data-edit-suffix") || "/edit", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${kd}">
                        <span data-ref="nameEl" class="${Rd}"></span>
                        <span data-ref="detailEl" class="${Dd}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${Sd} flex items-center">
                        <span data-ref="textEl" class="${Ld}"></span>
                        <span data-ref="detailEl" class="${wd} hidden"></span>
                        <a data-ref="editLink" class="${Cd} hidden" aria-label="Bearbeiten">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" data-ref="deleteBtn" class="${Gs}">&times;</button>
                    </span>
                `;
  }
  _bindEventHandlers() {
    this._handleInput = this._handleInput.bind(this), this._handleKeyDown = this._handleKeyDown.bind(this), this._handleFocus = this._handleFocus.bind(this), this._handleBlur = this._handleBlur.bind(this), this._handleOptionMouseDown = this._handleOptionMouseDown.bind(this), this._handleOptionClick = this._handleOptionClick.bind(this), this._handleCreateNewButtonClick = this._handleCreateNewButtonClick.bind(this), this._handleSelectedItemsContainerClick = this._handleSelectedItemsContainerClick.bind(this), this._handleToggleClick = this._handleToggleClick.bind(this);
  }
  _getItemById(t) {
    return this._options.find((e) => e.id === t);
  }
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(t) {
    this._placeholder = t, this.inputElement && (this.inputElement.placeholder = this._placeholder), this.setAttribute("placeholder", t);
  }
  get showCreateButton() {
    return this._showCreateButton;
  }
  set showCreateButton(t) {
    const e = String(t).toLowerCase() !== "false" && t !== !1;
    this._showCreateButton !== e && (this._showCreateButton = e, this.createNewButton && this.createNewButton.classList.toggle("hidden", !this._showCreateButton), this.setAttribute("show-create-button", this._showCreateButton ? "true" : "false"));
  }
  setOptions(t) {
    if (Array.isArray(t) && t.every((e) => e && typeof e.id == "string" && typeof e.name == "string")) {
      this._options = t.map((i) => {
        const r = { ...i };
        return r.name = this._normalizeText(r.name), r.additional_data = this._normalizeText(r.additional_data), r;
      });
      const e = this._value.filter((i) => this._getItemById(i));
      e.length !== this._value.length ? this.value = e : this.selectedItemsContainer && this._renderSelectedItems(), this._filteredOptions = [], this._highlightedIndex = -1, this.inputElement && this.inputElement.value ? this._handleInput({ target: this.inputElement }) : this._hideOptionsList();
    } else console.error("setOptions expects an array of objects with id and name properties.");
  }
  get value() {
    return this._value;
  }
  set value(t) {
    const e = JSON.stringify([...this._value].sort());
    if (Array.isArray(t))
      this._value = [...new Set(t.filter((r) => typeof r == "string" && this._getItemById(r)))];
    else if (typeof t == "string" && t.trim() !== "") {
      const r = t.trim();
      this._getItemById(r) && !this._value.includes(r) ? this._value = [r] : this._getItemById(r) || (this._value = this._value.filter((s) => s !== r));
    } else this._value = [];
    const i = JSON.stringify([...this._value].sort());
    this._value.forEach((r) => {
      this._displayOrder.includes(r) || this._displayOrder.push(r);
    }), !this._initialCaptured && this._allowInitialCapture && this._value.length > 0 && (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0), this._value.forEach((r) => {
      this._removedIds.has(r) && this._removedIds.delete(r);
    }), e !== i && (this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses(), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(t) {
    this.setAttribute("name", t), this.hiddenSelect && (this.hiddenSelect.name = t);
  }
  connectedCallback() {
    this._render(), this.inputControlsContainer = this.querySelector(`.${Js}`), this.inputWrapper = this.querySelector(`.${Ys}`), this.inputElement = this.querySelector(`.${Qs}`), this.createNewButton = this.querySelector(`.${Zs}`), this.toggleButton = this.querySelector(`.${ta}`), this.optionsListElement = this.querySelector(`.${ea}`), this.selectedItemsContainer = this.querySelector(`.${Ks}`), this.hiddenSelect = this.querySelector(`.${Zn}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._remoteEndpoint = this.getAttribute("data-endpoint") || null, this._remoteResultKey = this.getAttribute("data-result-key") || "items", this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), er), this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), ir), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.addEventListener("click", this._handleToggleClick);
    const t = this.getAttribute("data-external-toggle-id");
    if (t && (this.externalToggleButton = document.getElementById(t), this.externalToggleButton && this.externalToggleButton.addEventListener("click", this._handleToggleClick)), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        this.value = JSON.parse(e);
      } catch {
        this.value = e.split(",").map((r) => r.trim()).filter(Boolean);
      }
    } else
      this._renderSelectedItems(), this._synchronizeHiddenSelect();
    this._value.length === 0 && this._renderSelectedItems(), this.hasAttribute("disabled") && this.disabledCallback(!0), this._toggleInput && this._hideInputControls(), this._allowInitialCapture = !1, this._initialCaptured || (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._displayOrder = [...this._value], this._initialCaptured = !0);
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
  attributeChangedCallback(t, e, i) {
    if (e !== i)
      if (t === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (t === "name" && this.hiddenSelect) this.hiddenSelect.name = i;
      else if (t === "value" && this.inputElement)
        try {
          this.value = JSON.parse(i);
        } catch {
          this.value = i.split(",").map((s) => s.trim()).filter(Boolean);
        }
      else t === "placeholder" ? this.placeholder = i : t === "show-create-button" ? this.showCreateButton = i : t === "data-endpoint" ? this._remoteEndpoint = i || null : t === "data-result-key" ? this._remoteResultKey = i || "items" : t === "data-minchars" ? this._remoteMinChars = this._parsePositiveInt(i, er) : t === "data-limit" ? this._remoteLimit = this._parsePositiveInt(i, ir) : t === "data-toggle-label" && (this._toggleLabel = i || "", this._toggleInput = this._toggleLabel !== "");
  }
  formAssociatedCallback(t) {
  }
  formDisabledCallback(t) {
    this.disabledCallback(t);
  }
  formResetCallback() {
    this.value = [], this._displayOrder = [], this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._updateRootElementStateClasses(), this._renderSelectedItems(), this._toggleInput && this._hideInputControls();
  }
  formStateRestoreCallback(t, e) {
    this.value = Array.isArray(t) ? t : [], this._updateRootElementStateClasses();
  }
  captureInitialSelection() {
    this._initialValue = [...this._value], this._initialOrder = [...this._value], this._displayOrder = [...this._value], this._removedIds.clear(), this._initialCaptured = !0, this._renderSelectedItems();
  }
  _synchronizeHiddenSelect() {
    this.hiddenSelect && (this.hiddenSelect.innerHTML = "", this._value.forEach((t) => {
      const e = document.createElement("option");
      e.value = t;
      const i = this._getItemById(t);
      e.textContent = i ? i.name : t, e.selected = !0, this.hiddenSelect.appendChild(e);
    }));
  }
  _updateFormValue() {
    this.internals_.setFormValue(null), this._synchronizeHiddenSelect();
  }
  disabledCallback(t) {
    this.inputElement && (this.inputElement.disabled = t), this.createNewButton && (this.createNewButton.disabled = t), this.toggleAttribute("disabled", t), this.querySelectorAll(`.${Gs}`).forEach((e) => e.disabled = t), this.hiddenSelect && (this.hiddenSelect.disabled = t), t && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Od, this._value.length === 0), this.classList.toggle(Md, this._value.length > 0), this.classList.toggle(Bd, this._isOptionsListVisible);
  }
  _render() {
    const t = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t);
    const e = this.getAttribute("data-toggle-label") || "", i = e !== "", r = i ? "hidden" : "";
    this.innerHTML = `
                    <style>
                        .${Zn} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${xd} relative">
                        <div class="${Td} flex flex-wrap items-center gap-2">
                            <div class="${Ks} flex flex-wrap items-center gap-1 min-h-[30px]" aria-live="polite" tabindex="-1"></div>
                            ${i ? `<button type="button" class="${ta}">${e}</button>` : ""}
                            <div class="${Js} flex items-center gap-2 ${r}">
                                <div class="${Ys} relative rounded-md flex items-center flex-grow">
                                    <input type="text"
                                           class="${Qs} w-full outline-none bg-transparent"
                                           placeholder="${this.placeholder}"
                                           aria-autocomplete="list"
                                           aria-expanded="${this._isOptionsListVisible}"
                                           aria-controls="options-list-${t}"
                                           autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                                </div>
                                <button type="button" class="${Zs} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                            </div>
                        </div>
                        <ul id="options-list-${t}" role="listbox" class="${ea} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${t}" class="${Zn}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(t) {
    const e = this._getItemById(t);
    if (!e) return null;
    const r = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, s = r.querySelector('[data-ref="textEl"]'), a = r.querySelector('[data-ref="detailEl"]'), o = r.querySelector('[data-ref="editLink"]'), l = r.querySelector('[data-ref="deleteBtn"]');
    s.textContent = this._normalizeText(e.name);
    const c = this._normalizeText(e.additional_data);
    c ? (a.textContent = `(${c})`, a.classList.remove("hidden")) : (a.textContent = "", a.classList.add("hidden"));
    const h = this._removedIds.has(t);
    if (!this._initialValue.includes(t)) {
      const g = document.createElement("span");
      g.className = "ml-1 text-xs text-gray-600", g.textContent = "(Neu)", s.appendChild(g);
    }
    return h && (r.classList.add("bg-red-100"), r.style.position = "relative"), o && (this._editBase && !h ? (o.href = `${this._editBase}${t}${this._editSuffix}`, o.target = "_blank", o.rel = "noreferrer", o.classList.remove("hidden")) : (o.classList.add("hidden"), o.removeAttribute("href"), o.removeAttribute("target"), o.removeAttribute("rel"))), l.setAttribute("aria-label", h ? `Undo remove ${e.name}` : `Remove ${e.name}`), l.dataset.id = t, l.disabled = this.hasAttribute("disabled"), l.innerHTML = h ? '<span class="text-xs inline-flex items-center"><i class="ri-arrow-go-back-line"></i></span>' : "&times;", l.addEventListener("click", (g) => {
      g.stopPropagation(), this._handleDeleteSelectedItem(t);
    }), r;
  }
  _renderSelectedItems() {
    if (!this.selectedItemsContainer) return;
    this.selectedItemsContainer.innerHTML = "";
    const t = this._displayOrder.filter(
      (e) => this._value.includes(e) || this._removedIds.has(e)
    );
    if (t.length === 0) {
      const e = this.getAttribute("data-empty-text") || "Keine Auswahl...", i = this._inputCollapsed ? "" : "hidden";
      this.selectedItemsContainer.innerHTML = `<span class="${tr} ${i}">${e}</span>`;
    } else
      t.forEach((e) => {
        const i = this._createSelectedItemElement(e);
        i && this.selectedItemsContainer.appendChild(i);
      });
    this._updateRootElementStateClasses();
  }
  _createOptionElement(t, e) {
    const r = this.optionTemplate.content.cloneNode(!0).firstElementChild, s = r.querySelector('[data-ref="nameEl"]'), a = r.querySelector('[data-ref="detailEl"]');
    s.textContent = this._normalizeText(t.name);
    const o = this._normalizeText(t.additional_data);
    a.textContent = o ? `(${o})` : "", r.dataset.id = t.id, r.setAttribute("aria-selected", String(e === this._highlightedIndex));
    const l = `option-${this.id || "mss"}-${t.id}`;
    return r.id = l, e === this._highlightedIndex && (r.classList.add(ia), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", l)), r;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this._filteredOptions.forEach((e, i) => {
          const r = this._createOptionElement(e, i);
          this.optionsListElement.appendChild(r);
        });
        const t = this.optionsListElement.querySelector(`.${ia}`);
        t && (t.scrollIntoView({ block: "nearest" }), this.inputElement.setAttribute("aria-activedescendant", t.id));
      }
      this._updateRootElementStateClasses();
    }
  }
  _handleSelectedItemsContainerClick(t) {
    t.target === this.selectedItemsContainer && this.inputElement && !this.inputElement.disabled && this.inputElement.focus();
  }
  _handleCreateNewButtonClick() {
    if (this.hasAttribute("disabled") || !this.showCreateButton) return;
    const t = this.inputElement ? this.inputElement.value.trim() : "";
    this.dispatchEvent(
      new CustomEvent("createnew", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  _handleInput(t) {
    const e = t.target.value;
    if (this._remoteEndpoint) {
      this._handleRemoteInput(e);
      return;
    }
    if (e.length === 0)
      this._filteredOptions = [], this._isOptionsListVisible = !1;
    else {
      const i = e.toLowerCase();
      this._filteredOptions = this._options.filter((r) => {
        if (this._value.includes(r.id)) return !1;
        const a = this._normalizeText(r.name).toLowerCase().includes(i), o = this._normalizeText(r.additional_data), l = o && o.toLowerCase().includes(i);
        return a || l;
      }), this._isOptionsListVisible = this._filteredOptions.length > 0;
    }
    this._highlightedIndex = this._filteredOptions.length > 0 ? 0 : -1, this._renderOptionsList();
  }
  _handleKeyDown(t) {
    if (!this.inputElement.disabled) {
      if (!this._isOptionsListVisible || this._filteredOptions.length === 0) {
        t.key === "Enter" && this.inputElement.value.length > 0 && t.preventDefault(), t.key === "Escape" && this._hideOptionsList(), (t.key === "ArrowDown" || t.key === "ArrowUp") && this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement });
        return;
      }
      switch (t.key) {
        case "ArrowDown":
          t.preventDefault(), this._highlightedIndex = (this._highlightedIndex + 1) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "ArrowUp":
          t.preventDefault(), this._highlightedIndex = (this._highlightedIndex - 1 + this._filteredOptions.length) % this._filteredOptions.length, this._renderOptionsList();
          break;
        case "Enter":
          t.stopPropagation(), t.preventDefault(), this._highlightedIndex > -1 && this._filteredOptions[this._highlightedIndex] && this._selectItem(this._filteredOptions[this._highlightedIndex].id);
          break;
        case "Escape":
          t.preventDefault(), this._hideOptionsList(), this._toggleInput && this._hideInputControls();
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
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(Xs), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _blurTimeout = null;
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(Xs), this._blurTimeout = setTimeout(() => {
      this.contains(document.activeElement) || (this._hideOptionsList(), this._toggleInput && (!this.inputElement || this.inputElement.value.trim() === "") && this._hideInputControls());
    }, 150);
  }
  _handleOptionMouseDown(t) {
    t.preventDefault();
  }
  _handleOptionClick(t) {
    const e = t.target.closest("li[data-id]");
    e && e.dataset.id && this._selectItem(e.dataset.id);
  }
  _selectItem(t) {
    t && !this._value.includes(t) && (this.value = [...this._value, t]), this.inputElement && (this.inputElement.value = ""), this._filteredOptions = [], this._hideOptionsList(), this._toggleInput ? this._hideInputControls() : this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleDeleteSelectedItem(t) {
    if (this._removedIds.has(t)) {
      this._removedIds.delete(t), this._value.includes(t) ? this._renderSelectedItems() : this.value = [...this._value, t];
      return;
    }
    if (this._initialValue.includes(t)) {
      this._removedIds.add(t), this.value = this._value.filter((e) => e !== t);
      return;
    }
    this.value = this._value.filter((e) => e !== t), this.inputElement && this.inputElement.value && this._handleInput({ target: this.inputElement }), this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus();
  }
  _handleToggleClick(t) {
    t.preventDefault(), this._showInputControls();
  }
  _showInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.remove("hidden"), this.toggleButton && this.toggleButton.classList.add("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const t = this.selectedItemsContainer.querySelector(`.${tr}`);
        t && t.classList.add("hidden");
      }
      this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus(), this._inputCollapsed = !1;
    }
  }
  _hideInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.add("hidden"), this.toggleButton && this.toggleButton.classList.remove("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const t = this.selectedItemsContainer.querySelector(`.${tr}`);
        t && t.classList.remove("hidden");
      }
      this._hideOptionsList(), this._inputCollapsed = !0;
    }
  }
  _parsePositiveInt(t, e) {
    if (!t) return e;
    const i = parseInt(t, 10);
    return Number.isNaN(i) || i <= 0 ? e : i;
  }
  _handleRemoteInput(t) {
    if (this._remoteFetchTimeout && clearTimeout(this._remoteFetchTimeout), t.length < this._remoteMinChars) {
      this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
      return;
    }
    this._remoteFetchTimeout = setTimeout(() => {
      this._fetchRemoteOptions(t);
    }, Id);
  }
  _cancelRemoteFetch() {
    this._remoteFetchController && (this._remoteFetchController.abort(), this._remoteFetchController = null);
  }
  async _fetchRemoteOptions(t) {
    if (!this._remoteEndpoint) return;
    this._cancelRemoteFetch(), this.classList.add(na);
    const e = new AbortController();
    this._remoteFetchController = e;
    try {
      const i = new URL(this._remoteEndpoint, window.location.origin);
      i.searchParams.set("q", t), this._remoteLimit && i.searchParams.set("limit", String(this._remoteLimit));
      const r = await fetch(i.toString(), {
        headers: { Accept: "application/json" },
        signal: e.signal,
        credentials: "same-origin"
      });
      if (!r.ok)
        throw new Error(`Remote fetch failed with status ${r.status}`);
      const s = await r.json();
      if (e.signal.aborted)
        return;
      const a = this._extractRemoteOptions(s);
      this._applyRemoteResults(a);
    } catch (i) {
      if (e.signal.aborted)
        return;
      console.error("MultiSelectSimple remote fetch error:", i), this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
    } finally {
      this._remoteFetchController === e && (this._remoteFetchController = null), this.classList.remove(na);
    }
  }
  _extractRemoteOptions(t) {
    if (!t) return [];
    let e = [];
    return Array.isArray(t) ? e = t : this._remoteResultKey && Array.isArray(t[this._remoteResultKey]) ? e = t[this._remoteResultKey] : Array.isArray(t.items) && (e = t.items), e.map((i) => {
      if (!i) return null;
      const r = i.id ?? i.ID ?? i.value ?? "", s = i.name ?? i.title ?? i.label ?? "", a = i.detail ?? i.additional_data ?? i.annotation ?? "", o = this._normalizeText(s), l = this._normalizeText(a);
      return !r || !o ? null : {
        id: String(r),
        name: o,
        additional_data: l
      };
    }).filter(Boolean);
  }
  _applyRemoteResults(t) {
    const e = new Set(this._value), i = /* @__PURE__ */ new Map();
    this._options.forEach((r) => {
      r?.id && i.set(r.id, r);
    }), t.forEach((r) => {
      r?.id && i.set(r.id, r);
    }), this._options = Array.from(i.values()), this._filteredOptions = t.filter((r) => r && !e.has(r.id)), this._isOptionsListVisible = this._filteredOptions.length > 0, this._highlightedIndex = this._isOptionsListVisible ? 0 : -1, this._renderOptionsList();
  }
  _normalizeText(t) {
    if (t == null)
      return "";
    let e = String(t).trim();
    if (!e)
      return "";
    const i = e[0], r = e[e.length - 1];
    return (i === '"' && r === '"' || i === "'" && r === "'") && (e = e.slice(1, -1).trim(), !e) ? "" : e;
  }
}
const Pd = "rbi-button", Fd = "rbi-icon";
class qd extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const t = `
              <button type="button" class="${Pd} cursor-pointer disabled:cursor-default" aria-label="Reset field" data-tippy-placement="right" data-tippy-content="Feld zurücksetzen">
								<span class="${Fd} ri-arrow-go-back-fill"></span>
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
      const r = document.getElementById(i);
      r ? (e.push(r), this.storeInitialState(r), r.addEventListener("input", this.handleInputChange), r.addEventListener("change", this.handleInputChange)) : console.warn(`ResetButtonIndividual: Element with ID "${i}" not found.`);
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
        const i = Array.from(t.options).filter((s) => s.selected).map((s) => s.value), r = e.selectedOptions;
        return i.length !== r.length || i.some((s) => !r.includes(s)) || r.some((s) => !i.includes(s));
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
        const r = this.getAttribute("modified-class-suffix") || "modified", s = `${e}-${r}`;
        t ? i.classList.add(s) : i.classList.remove(s);
      }
    }
    if (this.button && (this.button.disabled = !t || this._controlledElements.length === 0, this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.lastOverallModifiedState !== t) {
      const i = new CustomEvent("rbichange", {
        bubbles: !0,
        composed: !0,
        detail: {
          modified: t,
          controlledElementIds: this._controlledElements.map((r) => r.id),
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
        const i = this._controlledElements[0], r = document.querySelector(`label[for="${i.id}"]`);
        let s = i.name || i.id;
        r && r.textContent ? s = r.textContent.trim().replace(/[:*]$/, "").trim() : i.getAttribute("aria-label") && (s = i.getAttribute("aria-label")), t = `Reset ${s}`;
      } else e.length > 1 ? t = "Reset selected fields" : t = "Reset field";
    }
    this.button.setAttribute("aria-label", t);
  }
}
const kt = "hidden", ra = "dm-stay", Ji = "dm-title", nr = "dm-menu-button", Hd = "dm-target", Ud = "data-dm-target", sa = "dm-menu", aa = "dm-menu-item", $d = "dm-close-button";
class jd extends HTMLElement {
  constructor() {
    super(), this.#t(), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  #t() {
    this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null, this._originalButtonText = null;
  }
  connectedCallback() {
    this._target = document.getElementById(this.getAttribute(Hd)), this._target || (this._target = this), this._cildren = Array.from(this.children).filter((e) => e.nodeType === Node.ELEMENT_NODE && !e.classList.contains(nr)).map((e) => ({
      node: e,
      target: () => {
        const i = e.getAttribute(Ud);
        return i ? document.getElementById(i) || this._target : this._target;
      },
      stay: () => e.hasAttribute(ra) && e.getAttribute(ra) == "true",
      hidden: () => e.classList.contains(kt),
      name: () => {
        const i = e.querySelector("label");
        return i ? i.innerHTML : e.hasAttribute(Ji) ? e.getAttribute(Ji) : "";
      },
      nameText: () => {
        const i = e.querySelector("label");
        return i ? i.textContent.trim() : e.hasAttribute(Ji) ? e.getAttribute(Ji) : "";
      }
    }));
    const t = this._button;
    this._button = this.querySelector(`.${nr}`), !this._button && t && (this._button = t, this._button.parentElement || this.appendChild(this._button)), this._button || (this._button = document.createElement("button"), this._button.type = "button", this._button.classList.add(nr, kt), this._button.innerHTML = '<i class="ri-add-line"></i> Felder hinzufügen', this.appendChild(this._button)), this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    for (const e of this._cildren)
      this.removeChild(e.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const e of this._cildren)
      e.node.querySelectorAll(`.${$d}`).forEach((r) => {
        r.addEventListener("click", (s) => {
          this.hideDiv(s, e.node);
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
  _toggleMenu(t) {
    t.preventDefault(), t.stopPropagation();
    const e = this._cildren.filter((i) => i.hidden());
    if (e.length === 1) {
      const i = this._cildren.indexOf(e[0]);
      this.showDiv(t, i);
      return;
    }
    if (e.length === 0) {
      this.hideMenu();
      return;
    }
    this.renderMenu(), this._menu.classList.contains(kt) ? (this._menu.classList.remove(kt), document.addEventListener("click", this.boundHandleClickOutside)) : (this._menu.classList.add(kt), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  handleClickOutside(t) {
    this._menu && !this._menu.contains(t.target) && !this._button.contains(t.target) && this.hideMenu();
  }
  hideMenu() {
    this._menu && (this._menu.classList.add(kt), document.removeEventListener("click", this.boundHandleClickOutside));
  }
  renderButton() {
    if (!this._button)
      return;
    this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    const t = this._cildren.filter((e) => e.hidden());
    if (t.length === 0) {
      this._button.classList.add(kt), this._button.parentElement && this._button.parentElement.removeChild(this._button), this._menu = null, this.hideMenu();
      return;
    }
    if (this._button.parentElement || this.appendChild(this._button), this._button.classList.remove(kt), t.length === 1) {
      const e = this._button.querySelector("i"), i = e ? e.outerHTML : '<i class="ri-add-line"></i>';
      this._button.innerHTML = `${i}
${t[0].nameText()} hinzufügen`, this._menu = null, this.hideMenu();
    } else
      this._button.innerHTML = this._originalButtonText, this._menu = null;
  }
  hideDiv(t, e) {
    if (t && (t.preventDefault(), t.stopPropagation()), !e || !(e instanceof HTMLElement)) {
      console.error("DivManagerMenu: Invalid node provided.");
      return;
    }
    const i = this._cildren.find((s) => s.node === e);
    if (!i) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    i.node.classList.add(kt), this._clearFields(i.node);
    const r = i.target();
    r && r.contains(i.node) && r.removeChild(i.node), i.node.parentElement || this.appendChild(i.node), this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  showDiv(t, e) {
    if (t && (t.preventDefault(), t.stopPropagation()), e < 0 || e >= this._cildren.length) {
      console.error("DivManagerMenu: Invalid index.");
      return;
    }
    const i = this._cildren[e];
    if (i.node.classList.remove(kt), this.insertChildInOrder(i), this.renderMenu(), this.renderButton(), this.updateTargetVisibility(), typeof window.TextareaAutoResize == "function") {
      const r = i.node.querySelectorAll("textarea");
      r.length > 0 && setTimeout(() => {
        r.forEach((s) => {
          s.dataset.dmResizeBound !== "true" && (s.dataset.dmResizeBound = "true", s.addEventListener("input", () => {
            window.TextareaAutoResize(s);
          })), window.TextareaAutoResize(s);
        });
      }, 10);
    }
    requestAnimationFrame(() => {
      this._focusFirstField(i.node);
    });
  }
  renderMenu() {
    const t = this._cildren.filter((i) => i.hidden());
    if (t.length <= 1) {
      this.hideMenu();
      return;
    }
    (!this._menu || !this._button.contains(this._menu)) && (this._button.insertAdjacentHTML("beforeend", `<div class="${sa} absolute hidden"></div>`), this._menu = this._button.querySelector(`.${sa}`)), this._menu.innerHTML = `${t.map((i, r) => `
				<button type="button" class="${aa}" dm-itemno="${this._cildren.indexOf(i)}">
					${i.name()}
				</button>`).join("")}`, this._menu.querySelectorAll(`.${aa}`).forEach((i) => {
      i.addEventListener("click", (r) => {
        this.showDiv(r, parseInt(i.getAttribute("dm-itemno"))), this.hideMenu(), this.renderButton();
      });
    });
  }
  renderIntoTarget() {
    this._cildren.forEach((t) => {
      t.hidden() || this.insertChildInOrder(t);
    }), this.updateTargetVisibility();
  }
  insertChildInOrder(t) {
    const e = t.target(), i = this._cildren.indexOf(t), r = this._cildren.slice(i + 1).filter((s) => s.target() === e).map((s) => s.node).find((s) => e && e.contains(s));
    e && (r ? e.insertBefore(t.node, r) : e.appendChild(t.node));
  }
  updateTargetVisibility() {
    new Set(
      this._cildren.map((e) => e.target()).filter((e) => e && e !== this)
    ).forEach((e) => {
      const i = Array.from(e.children).some(
        (r) => !r.classList.contains(kt)
      );
      e.classList.toggle(kt, !i);
    });
  }
  _clearFields(t) {
    t && (t.querySelectorAll("input, textarea, select").forEach((e) => {
      if (e.matches("input[type='checkbox'], input[type='radio']")) {
        e.checked = !1;
        return;
      }
      if (e.matches("select")) {
        e.selectedIndex = -1;
        return;
      }
      e.value = "";
    }), t.querySelectorAll("trix-editor").forEach((e) => {
      typeof e.editor?.loadHTML == "function" && e.editor.loadHTML("");
    }));
  }
  _focusFirstField(t) {
    if (!t)
      return;
    const e = t.querySelectorAll(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled]), [contenteditable='true'], trix-editor"
    );
    for (const i of e)
      if (i instanceof HTMLElement && i.getClientRects().length !== 0) {
        try {
          i.focus({ preventScroll: !0 });
        } catch {
          i.focus();
        }
        return;
      }
  }
}
const jt = "items-row", Vd = "items-list", Wd = "items-template", zd = "items-add-button", Kd = "items-cancel-button", Yi = "items-remove-button", Gd = "items-edit-button", Jd = "items-close-button", Yd = "items-summary", oa = "items-edit-panel", rr = "items_removed[]", gi = "data-items-removed";
class Xd extends HTMLElement {
  constructor() {
    super(), this._list = null, this._template = null, this._addButton = null, this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`, this._handleAdd = this._onAddClick.bind(this);
  }
  connectedCallback() {
    if (this._list = this.querySelector(`.${Vd}`), this._template = this.querySelector(`template.${Wd}`), this._addButton = this.querySelector(`.${zd}`), !this._list || !this._template || !this._addButton) {
      console.error("ItemsEditor: Missing list, template, or add button.");
      return;
    }
    this._addButton.addEventListener("click", this._handleAdd), this._captureAllOriginals(), this._wireCancelButtons(), this._wireRemoveButtons(), this._wireEditButtons(), this._refreshRowIds(), this._syncAllSummaries(), this._syncAddButtonVisibility();
  }
  disconnectedCallback() {
    this._addButton && this._addButton.removeEventListener("click", this._handleAdd);
  }
  _onAddClick(t) {
    t.preventDefault(), this.addItem();
  }
  addItem() {
    const t = this._template.content.cloneNode(!0), e = t.querySelector(`.${jt}`);
    if (!e) {
      console.error("ItemsEditor: Template is missing a row element.");
      return;
    }
    this._list.appendChild(t), this._captureOriginalValues(e), this._wireCancelButtons(e), this._wireRemoveButtons(e), this._wireEditButtons(e), this._assignRowFieldIds(e, this._rowIndex(e)), this._wireSummarySync(e), this._syncSummary(e), this._setRowMode(e, "edit");
  }
  removeItem(t) {
    const e = t.closest(`.${jt}`);
    if (!e)
      return;
    const i = e.getAttribute(gi) === "true";
    this._setRowRemoved(e, !i);
  }
  _wireRemoveButtons(t = this) {
    t.querySelectorAll(`.${Yi}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault(), this.removeItem(e);
      }), e.addEventListener("mouseenter", () => {
        const i = e.closest(`.${jt}`);
        if (!i || i.getAttribute(gi) !== "true")
          return;
        const r = e.querySelector("[data-delete-label]");
        r && (r.textContent = r.getAttribute("data-delete-hover") || "Rückgängig");
        const s = e.querySelector("i");
        s && (s.classList.remove("hidden"), s.classList.add("ri-arrow-go-back-line"), s.classList.remove("ri-delete-bin-line"));
      }), e.addEventListener("mouseleave", () => {
        const i = e.closest(`.${jt}`), r = e.querySelector("[data-delete-label]");
        if (!r)
          return;
        i && i.getAttribute(gi) === "true" ? r.textContent = r.getAttribute("data-delete-active") || "Wird entfernt" : r.textContent = r.getAttribute("data-delete-default") || "Entfernen";
        const s = e.querySelector("i");
        s && (i && i.getAttribute(gi) === "true" ? (s.classList.add("hidden"), s.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (s.classList.remove("hidden"), s.classList.add("ri-delete-bin-line"), s.classList.remove("ri-arrow-go-back-line")));
      }));
    });
  }
  _wireCancelButtons(t = this) {
    t.querySelectorAll(`.${Kd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const r = e.closest(`.${jt}`);
        r && this._cancelEdit(r);
      }));
    });
  }
  _wireEditButtons(t = this) {
    t.querySelectorAll(`.${Gd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const r = e.closest(`.${jt}`);
        r && this._setRowMode(r, "edit");
      }));
    }), t.querySelectorAll(`.${Jd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const r = e.closest(`.${jt}`);
        r && this._setRowMode(r, "summary");
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
    t.setAttribute(gi, e ? "true" : "false"), t.classList.toggle("bg-red-50", e);
    const i = t.querySelector(".items-edit-button");
    i && (e ? i.classList.add("hidden") : i.classList.remove("hidden")), t.querySelectorAll("[data-delete-label]").forEach((a) => {
      const o = a.closest(`.${Yi}`), l = o && o.matches(":hover");
      let c;
      e && l ? c = a.getAttribute("data-delete-hover") || "Rückgängig" : e ? c = a.getAttribute("data-delete-active") || "Wird entfernt" : c = a.getAttribute("data-delete-default") || "Entfernen", a.textContent = c;
    }), t.querySelectorAll(`.${Yi} i`).forEach((a) => {
      const o = a.closest(`.${Yi}`), l = o && o.matches(":hover");
      e ? l ? (a.classList.remove("hidden"), a.classList.add("ri-arrow-go-back-line"), a.classList.remove("ri-delete-bin-line")) : (a.classList.add("hidden"), a.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (a.classList.remove("hidden"), a.classList.add("ri-delete-bin-line"), a.classList.remove("ri-arrow-go-back-line"));
    });
    const r = t.querySelector('input[name="items_id[]"]'), s = r ? r.value.trim() : "";
    s && (e ? this._ensureRemovalInput(s) : this._removeRemovalInput(s)), t.querySelectorAll("[data-field]").forEach((a) => {
      a.disabled = e;
    });
  }
  _setRowMode(t, e) {
    const i = t.querySelector(`.${Yd}`), r = t.querySelector(`.${oa}`);
    !i || !r || (e === "edit" ? (i.classList.add("hidden"), r.classList.remove("hidden")) : (i.classList.remove("hidden"), r.classList.add("hidden"), this._syncSummary(t)), this._syncAddButtonVisibility());
  }
  _syncAddButtonVisibility() {
    if (!this._addButton)
      return;
    const t = Array.from(this.querySelectorAll(`.${oa}`)).some(
      (e) => !e.classList.contains("hidden")
    );
    this._addButton.classList.toggle("hidden", t);
  }
  _captureAllOriginals() {
    this.querySelectorAll(`.${jt}`).forEach((t) => {
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
    Array.from(this.querySelectorAll(`.${jt}`)).forEach((e, i) => {
      this._assignRowFieldIds(e, i);
    });
  }
  _rowIndex(t) {
    return Array.from(this.querySelectorAll(`.${jt}`)).indexOf(t);
  }
  _assignRowFieldIds(t, e) {
    e < 0 || t.querySelectorAll("[data-field-label]").forEach((i) => {
      const r = i.getAttribute("data-field-label");
      if (!r)
        return;
      const s = t.querySelector(`[data-field="${r}"]`);
      if (!s)
        return;
      const a = `${this._idPrefix}-${e}-${r}`;
      s.id = a, i.setAttribute("for", a);
    });
  }
  _syncAllSummaries() {
    this.querySelectorAll(`.${jt}`).forEach((t) => {
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
      const r = t.querySelector(`[data-field="${i}"]`);
      if (!r)
        return;
      const s = this._readFieldValue(r), a = e.getAttribute("data-summary-hide-empty") === "true" ? e.closest("[data-summary-container]") : null;
      s ? (this._setSummaryContent(e, s), e.classList.remove("text-gray-400"), a && a.classList.remove("hidden")) : (this._setSummaryContent(e, "—"), e.classList.add("text-gray-400"), a && a.classList.add("hidden"));
    }), this._syncNewBadge(t);
  }
  _syncNewBadge(t) {
    const e = t.querySelector('input[name="items_id[]"]'), i = e ? e.value.trim() : "";
    t.querySelectorAll("[data-new-badge]").forEach((r) => {
      r.classList.toggle("hidden", i !== "");
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
    if (Array.from(this.querySelectorAll(`input[name="${rr}"]`)).some(
      (r) => r.value === t
    ))
      return;
    const i = document.createElement("input");
    i.type = "hidden", i.name = rr, i.value = t, this.appendChild(i);
  }
  _removeRemovalInput(t) {
    const e = Array.from(this.querySelectorAll(`input[name="${rr}"]`));
    for (const i of e)
      i.value === t && i.remove();
  }
}
class Qd extends HTMLElement {
  constructor() {
    super(), this._pendingAgent = null, this._form = null, this._saveButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null, this._saveEndpoint = "", this._deleteEndpoint = "", this._isSaving = !1, this._handleSaveClick = this._handleSaveClick.bind(this), this._handleSaveViewClick = this._handleSaveViewClick.bind(this), this._handleResetClick = this._handleResetClick.bind(this), this._handleDeleteClick = this._handleDeleteClick.bind(this), this._handleDeleteConfirmClick = this._handleDeleteConfirmClick.bind(this), this._handleDeleteCancelClick = this._handleDeleteCancelClick.bind(this);
  }
  connectedCallback() {
    setTimeout(() => {
      this._initForm(), this._initPlaces(), this._initSaveHandling(), this._initStatusSelect();
    }, 0);
  }
  _initStatusSelect() {
    const t = this.querySelector(".status-select");
    if (!t)
      return;
    const e = this.querySelector(".status-icon");
    t.addEventListener("change", (i) => {
      const r = i.target.value;
      t.setAttribute("data-status", r), e && this._updateStatusIcon(e, r);
    });
  }
  _updateStatusIcon(t, e) {
    switch (t.classList.remove(
      "ri-checkbox-circle-line",
      "ri-information-line",
      "ri-search-line",
      "ri-list-check",
      "ri-forbid-2-line"
    ), e) {
      case "Edited":
        t.classList.add("ri-checkbox-circle-line");
        break;
      case "Seen":
        t.classList.add("ri-information-line");
        break;
      case "Review":
        t.classList.add("ri-search-line");
        break;
      case "ToDo":
        t.classList.add("ri-list-check");
        break;
      default:
        t.classList.add("ri-forbid-2-line");
        break;
    }
  }
  disconnectedCallback() {
    this._teardownSaveHandling();
  }
  _initForm() {
    const t = this.querySelector("#changealmanachform");
    t && typeof window.FormLoad == "function" && window.FormLoad(t);
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
    const t = this.querySelector("#places");
    if (!t)
      return;
    const e = () => {
      const i = this._parseJSONAttr(t, "data-initial-options") || [], r = this._parseJSONAttr(t, "data-initial-values") || [];
      i.length > 0 && typeof t.setOptions == "function" && t.setOptions(i), r.length > 0 && (t.value = r, typeof t.captureInitialSelection == "function" && t.captureInitialSelection());
    };
    if (typeof t.setOptions == "function") {
      e();
      return;
    }
    typeof window.customElements?.whenDefined == "function" && window.customElements.whenDefined("multi-select-simple").then(() => {
      requestAnimationFrame(() => e());
    });
  }
  _initSaveHandling() {
    this._teardownSaveHandling(), this._form = this.querySelector("#changealmanachform"), this._saveButton = this.querySelector("[data-role='almanach-save']"), this._saveViewButton = this.querySelector("[data-role='almanach-save-view']"), this._resetButton = this.querySelector("[data-role='almanach-reset']"), this._deleteButton = this.querySelector("[data-role='almanach-delete']"), this._deleteDialog = this.querySelector("[data-role='almanach-delete-dialog']"), this._deleteConfirmButton = this.querySelector("[data-role='almanach-delete-confirm']"), this._deleteCancelButton = this.querySelector("[data-role='almanach-delete-cancel']"), this._statusEl = this.querySelector("#almanach-save-feedback"), !(!this._form || !this._saveButton) && (this._saveEndpoint = this._form.getAttribute("data-save-endpoint") || this._deriveSaveEndpoint(), this._deleteEndpoint = this._form.getAttribute("data-delete-endpoint") || "", this._saveButton.addEventListener("click", this._handleSaveClick), this._saveViewButton && this._saveViewButton.addEventListener("click", this._handleSaveViewClick), this._resetButton && this._resetButton.addEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.addEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.addEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.addEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.addEventListener("cancel", this._handleDeleteCancelClick));
  }
  _teardownSaveHandling() {
    this._saveButton && this._saveButton.removeEventListener("click", this._handleSaveClick), this._saveViewButton && this._saveViewButton.removeEventListener("click", this._handleSaveViewClick), this._resetButton && this._resetButton.removeEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.removeEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.removeEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.removeEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.removeEventListener("cancel", this._handleDeleteCancelClick), this._saveButton = null, this._saveViewButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null;
  }
  _deriveSaveEndpoint() {
    return window?.location?.pathname ? `${window.location.pathname.endsWith("/") ? window.location.pathname.slice(0, -1) : window.location.pathname}/save` : "/almanach/save";
  }
  _isNewEntryPage() {
    const t = window?.location?.pathname || "";
    return t === "/admin/almanach-new/" || t === "/admin/almanach-new";
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
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(e)
      });
      let r = null;
      try {
        r = await i.clone().json();
      } catch {
        r = null;
      }
      if (!i.ok) {
        const s = r?.error || `Speichern fehlgeschlagen (${i.status}).`;
        throw new Error(s);
      }
      if (this._isNewEntryPage() && r?.redirect) {
        window.location.assign(r.redirect);
        return;
      }
      await this._reloadForm(r?.message || "Änderungen gespeichert.");
    } catch (i) {
      this._showStatus(i instanceof Error ? i.message : "Speichern fehlgeschlagen.", "error");
    } finally {
      this._setSavingState(!1);
    }
  }
  async _handleSaveViewClick(t) {
    if (t.preventDefault(), this._isSaving)
      return;
    const e = this._saveViewButton?.getAttribute("data-redirect-url");
    if (!e)
      return;
    this._clearStatus();
    let i;
    try {
      i = this._buildPayload();
    } catch (r) {
      this._showStatus(r instanceof Error ? r.message : String(r), "error");
      return;
    }
    this._setSavingState(!0);
    try {
      const r = await fetch(this._saveEndpoint, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(i)
      });
      if (!r.ok) {
        let s = `Speichern fehlgeschlagen (${r.status}).`;
        try {
          s = (await r.clone().json())?.error || s;
        } catch {
        }
        throw new Error(s);
      }
      window.location.assign(e);
    } catch (r) {
      this._showStatus(r instanceof Error ? r.message : "Speichern fehlgeschlagen.", "error");
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
          csrf_token: this._readValue(e, "csrf_token")
        }, r = await fetch(this._deleteEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(i)
        });
        let s = null;
        try {
          s = await r.clone().json();
        } catch {
          s = null;
        }
        if (!r.ok) {
          const o = s?.error || `Löschen fehlgeschlagen (${r.status}).`;
          throw new Error(o);
        }
        const a = s?.redirect || "/suche/baende";
        window.location.assign(a);
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
      pseudonym: this._readChecked("pseudonym"),
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
    const r = Number.parseInt(i, 10);
    if (Number.isNaN(r))
      throw new Error("Jahr ist ungültig.");
    e.year = r;
    const s = t.getAll("languages[]").map((C) => C.trim()).filter(Boolean), a = t.getAll("places[]").map((C) => C.trim()).filter(Boolean), { items: o, removedIds: l } = this._collectItems(t), {
      relations: c,
      deleted: h
    } = this._collectRelations(t, {
      prefix: "entries_series",
      targetField: "series"
    }), b = this._collectNewRelations("entries_series"), g = this._readValue(t, "preferred_series_id");
    if (!g)
      throw new Error("Reihentitel ist erforderlich.");
    const {
      relations: p,
      deleted: _
    } = this._collectRelations(t, {
      prefix: "entries_agents",
      targetField: "agent"
    }), f = this._collectNewRelations("entries_agents"), w = [...c, ...b].map((C) => C.target_id);
    if (w.filter((C, u) => w.indexOf(C) !== u).length > 0)
      throw new Error("Doppelte Reihenverknüpfungen sind nicht erlaubt.");
    if (g && w.includes(g))
      throw new Error("Die bevorzugte Reihe darf nicht zusätzlich als weitere Reihenverknüpfung gesetzt sein.");
    return {
      csrf_token: this._readValue(t, "csrf_token"),
      entry: e,
      preferred_series_id: g,
      languages: s,
      places: a,
      items: o,
      deleted_item_ids: l,
      series_relations: c,
      new_series_relations: b,
      deleted_series_relation_ids: h,
      agent_relations: p,
      new_agent_relations: f,
      deleted_agent_relation_ids: _
    };
  }
  _collectItems(t) {
    const e = new Set(
      t.getAll("items_removed[]").map((s) => s.trim()).filter(Boolean)
    ), i = [], r = Array.from(this.querySelectorAll(".items-row"));
    for (let s = 0; s < r.length; s += 1) {
      const a = r[s], o = (a.querySelector('input[name="items_id[]"]')?.value || "").trim();
      if (o && e.has(o))
        continue;
      const l = (a.querySelector('[name="items_owner[]"]')?.value || "").trim(), c = (a.querySelector('[name="items_identifier[]"]')?.value || "").trim(), h = (a.querySelector('[name="items_location[]"]')?.value || "").trim(), b = (a.querySelector('[name="items_annotation[]"]')?.value || "").trim(), g = (a.querySelector('[name="items_uri[]"]')?.value || "").trim(), p = (a.querySelector('[name="items_media[]"]')?.value || "").trim();
      if (o || l || c || h || b || g || p) {
        if (!p)
          throw new Error(`Exemplar ${s + 1}: "Vorhanden als" muss ausgefüllt werden.`);
        i.push({
          id: o,
          owner: l,
          identifier: c,
          location: h,
          annotation: b,
          uri: g,
          media: p ? [p] : []
        });
      }
    }
    return {
      items: i,
      removedIds: Array.from(e)
    };
  }
  _collectRelations(t, { prefix: e, targetField: i }) {
    const r = [], s = [], a = e === "entries_series";
    for (const [o, l] of t.entries()) {
      if (!o.startsWith(`${e}_id[`))
        continue;
      const c = o.slice(o.indexOf("[") + 1, -1), h = `${e}_${i}[${c}]`, b = `${e}_delete[${c}]`, g = `${e}_annotation[${c}]`, p = (l || "").trim(), _ = (t.get(h) || "").trim();
      if (!_ || !p)
        continue;
      if (t.has(b)) {
        s.push(p);
        continue;
      }
      if (a) {
        r.push({
          id: p,
          target_id: _,
          annotation: (t.get(g) || "").trim()
        });
        continue;
      }
      const f = `${e}_type[${c}]`, A = `${e}_uncertain[${c}]`;
      r.push({
        id: p,
        target_id: _,
        type: (t.get(f) || "").trim(),
        uncertain: t.has(A)
      });
    }
    return { relations: r, deleted: s };
  }
  _collectNewRelations(t) {
    const e = t === "entries_series", i = this.querySelector(`content-person-relations[data-prefix='${t}']`) || this.querySelector(`content-series-relations[data-prefix='${t}']`);
    if (!i)
      return [];
    const r = i.querySelectorAll("[data-kind='new']"), s = [];
    return r.forEach((a) => {
      const o = a.querySelector(`input[name='${t}_new_id']`);
      if (!o)
        return;
      const l = o.value.trim();
      if (!l)
        return;
      if (e) {
        const b = a.querySelector(`input[name='${t}_new_annotation'], textarea[name='${t}_new_annotation']`);
        s.push({
          target_id: l,
          annotation: (b?.value || "").trim()
        });
        return;
      }
      const c = a.querySelector(`select[name='${t}_new_type']`), h = a.querySelector(`input[name='${t}_new_uncertain']`);
      s.push({
        target_id: l,
        type: (c?.value || "").trim(),
        uncertain: !!h?.checked
      });
    }), s;
  }
  _readValue(t, e) {
    const i = t.get(e);
    return i ? String(i).trim() : "";
  }
  _readChecked(t) {
    if (!this._form?.elements)
      return !1;
    const e = this._form.elements.namedItem(t);
    return e ? typeof RadioNodeList < "u" && e instanceof RadioNodeList ? Array.from(e).some((i) => i?.checked) : !!e.checked : !1;
  }
  _setSavingState(t) {
    if (this._isSaving = t, !this._saveButton)
      return;
    this._saveButton.disabled = t;
    const e = this._saveButton.querySelector("span");
    e && (e.textContent = t ? "Speichern..." : "Speichern"), this._resetButton && (this._resetButton.disabled = t), this._deleteButton && (this._deleteButton.disabled = t);
  }
  _clearStatus() {
    this._statusEl && (this._statusEl.textContent = "", this._statusEl.classList.remove("text-red-700", "text-green-700", "save-feedback-error", "save-feedback-success"), this._statusEl.classList.remove("is-hidden"), this._statusEl.classList.add("hidden"));
  }
  _showStatus(t, e) {
    if (this._statusEl && (this._clearStatus(), this._statusEl.textContent = t, this._statusEl.classList.remove("hidden"), this._statusEl.classList.remove("is-hidden"), e === "success" ? this._statusEl.classList.add("text-green-700", "save-feedback-success") : e === "error" && this._statusEl.classList.add("text-red-700", "save-feedback-error"), e === "success")) {
      const i = this._statusEl;
      if (i) {
        if (i.dataset.autohideScheduled === "true")
          return;
        i.dataset.autohideScheduled = "true", setTimeout(() => {
          i.classList.add("is-hiding"), setTimeout(() => {
            i.classList.add("is-hidden"), i.classList.remove("is-hiding"), delete i.dataset.autohideScheduled;
          }, 320);
        }, 4e3);
      }
    }
  }
  async _reloadForm(t) {
    this._teardownSaveHandling();
    const e = new URL(window.location.href);
    t ? e.searchParams.set("saved_message", t) : e.searchParams.delete("saved_message");
    const i = await fetch(e.toString(), {
      credentials: "same-origin",
      headers: {
        "X-Requested-With": "fetch"
      }
    });
    if (!i.ok)
      throw new Error("Formular konnte nicht aktualisiert werden.");
    const r = await i.text(), a = new DOMParser().parseFromString(r, "text/html"), o = a.querySelector("#changealmanachform"), l = this.querySelector("#changealmanachform");
    if (!o || !l)
      throw new Error("Formular konnte nicht geladen werden.");
    l.replaceWith(o), this._form = o;
    const c = a.querySelector("#user-message"), h = this.querySelector("#user-message");
    c && h && h.replaceWith(c);
    const b = a.querySelector("#almanach-header-data"), g = this.querySelector("#almanach-header-data");
    b && g && g.replaceWith(b), this._initForm(), this._initPlaces(), this._initSaveHandling(), typeof window.TextareaAutoResize == "function" && setTimeout(() => {
      this.querySelectorAll("textarea").forEach((p) => {
        window.TextareaAutoResize(p);
      });
    }, 100);
  }
}
class Zd extends HTMLElement {
  constructor() {
    super(), this._isSaving = !1, this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }
  connectedCallback() {
    setTimeout(() => {
      this._initializeForms(), this._setupCancelLinks(), this._setupDelete(), this._setupStatusSelect();
    }, 0);
  }
  disconnectedCallback() {
    this.querySelectorAll("form.form-with-action-bar").forEach((t) => {
      t.removeEventListener("submit", this._handleFormSubmit), delete t.dataset.editPageSaveBound;
    });
  }
  _initializeForms() {
    this.querySelectorAll("form").forEach((t) => {
      t instanceof HTMLFormElement && (typeof window.FormLoad == "function" && window.FormLoad(t), t.classList.contains("form-with-action-bar") && t.dataset.editPageSaveBound !== "true" && (t.dataset.editPageSaveBound = "true", t.addEventListener("submit", this._handleFormSubmit)));
    });
  }
  _setupCancelLinks() {
    this.querySelectorAll("[data-role='cancel-link']").forEach((e) => {
      if (e.dataset.cancelBound === "true")
        return;
      e.dataset.cancelBound = "true";
      const i = (e.getAttribute("data-cancel-url") || "").trim();
      if (i) {
        e.setAttribute("href", i);
        return;
      }
      e.addEventListener("click", (r) => {
        (e.getAttribute("data-cancel-url") || "").trim() || (r.preventDefault(), window.history.length > 1 && window.history.back());
      });
    });
  }
  async _handleFormSubmit(t) {
    const e = t.currentTarget;
    if (!(e instanceof HTMLFormElement))
      return;
    if (this._isSaving) {
      t.preventDefault();
      return;
    }
    const i = t.submitter instanceof HTMLElement ? t.submitter : null, s = (i?.getAttribute("name") === "save_action" && i.getAttribute("value") || "") === "view";
    t.preventDefault(), this._isSaving = !0, this._setFormSavingState(e, i, !0);
    try {
      const a = await fetch(e.action || window.location.href, {
        method: (e.method || "POST").toUpperCase(),
        body: this._buildFormData(e, i),
        credentials: "same-origin"
      }), o = await a.text(), l = this._extractReplacementPage(o);
      if (!l) {
        window.location.assign(a.url || e.action || window.location.href);
        return;
      }
      if (s && a.redirected) {
        window.location.assign(a.url);
        return;
      }
      a.redirected && window.history.replaceState(null, "", a.url), this.replaceWith(l);
    } catch (a) {
      console.error("EditPage save failed", a), window.location.assign(e.action || window.location.href);
    } finally {
      this._isSaving = !1, this._setFormSavingState(e, i, !1);
    }
  }
  _buildFormData(t, e) {
    let i;
    try {
      i = e ? new FormData(t, e) : new FormData(t);
    } catch {
      i = new FormData(t), e?.getAttribute("name") && i.append(e.getAttribute("name"), e.getAttribute("value") || "");
    }
    return i;
  }
  _extractReplacementPage(t) {
    return t ? new DOMParser().parseFromString(t, "text/html").querySelector("edit-page") : null;
  }
  _setFormSavingState(t, e, i) {
    if (t.querySelectorAll("button, input[type='submit']").forEach((a) => {
      if (a instanceof HTMLButtonElement || a instanceof HTMLInputElement) {
        if (i) {
          a.disabled || (a.dataset.editPageDisabled = "true", a.disabled = !0);
          return;
        }
        a.dataset.editPageDisabled === "true" && (a.disabled = !1, delete a.dataset.editPageDisabled);
      }
    }), !e)
      return;
    const s = e.querySelector?.("span");
    if (s instanceof HTMLElement) {
      if (i) {
        s.dataset.originalText || (s.dataset.originalText = s.textContent || ""), s.textContent = "Speichern...";
        return;
      }
      s.dataset.originalText && (s.textContent = s.dataset.originalText, delete s.dataset.originalText);
    }
  }
  _setupStatusSelect() {
    const t = Array.from(this.querySelectorAll(".status-select"));
    t.length !== 0 && t.forEach((e) => {
      const i = e.parentElement?.querySelector(".status-icon");
      e.addEventListener("change", (r) => {
        const s = r.target.value;
        e.setAttribute("data-status", s), i && this._updateStatusIcon(i, s);
      });
    });
  }
  _updateStatusIcon(t, e) {
    switch (t.classList.remove(
      "ri-checkbox-circle-line",
      "ri-information-line",
      "ri-search-line",
      "ri-list-check",
      "ri-forbid-2-line"
    ), e) {
      case "Edited":
        t.classList.add("ri-checkbox-circle-line");
        break;
      case "Seen":
        t.classList.add("ri-information-line");
        break;
      case "Review":
        t.classList.add("ri-search-line");
        break;
      case "ToDo":
        t.classList.add("ri-list-check");
        break;
      default:
        t.classList.add("ri-forbid-2-line");
        break;
    }
  }
  _setupDelete() {
    const t = this.querySelector("form");
    if (!t)
      return;
    const e = t.getAttribute("data-delete-endpoint");
    if (!e)
      return;
    const i = this.querySelector("[data-role='edit-delete-dialog']"), r = this.querySelector("[data-role='edit-delete']"), s = this.querySelector("[data-role='edit-delete-confirm']"), a = this.querySelector("[data-role='edit-delete-cancel']");
    if (!i || !r || !s || !a)
      return;
    r.addEventListener("click", (l) => {
      l.preventDefault(), typeof i.showModal == "function" && i.showModal();
    });
    const o = (l) => {
      l && l.preventDefault(), i.open && i.close();
    };
    a.addEventListener("click", o), i.addEventListener("cancel", o), s.addEventListener("click", async (l) => {
      l.preventDefault(), o();
      const h = {
        csrf_token: new FormData(t).get("csrf_token") || ""
      }, b = await fetch(e, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(h)
      });
      if (!b.ok)
        return;
      const p = (await b.json().catch(() => null))?.redirect || "/";
      window.location.assign(p);
    });
  }
}
const tu = 100;
class eu extends HTMLElement {
  constructor() {
    super(), this._fields = null, this._boundHandlers = /* @__PURE__ */ new Map();
  }
  connectedCallback() {
    this._fields = document.querySelectorAll("[data-duplicate-check]"), this._fields.forEach((t) => {
      const e = this._createHandler(t);
      this._boundHandlers.set(t, e), t.addEventListener("input", e), (t.value ? t.value.trim() : "") !== "" && this._checkDuplicates(t);
    });
  }
  disconnectedCallback() {
    this._boundHandlers.forEach((t, e) => {
      e.removeEventListener("input", t);
    }), this._boundHandlers.clear();
  }
  _createHandler(t) {
    let e = null;
    return (i) => {
      e && clearTimeout(e), e = setTimeout(() => {
        this._checkDuplicates(t);
      }, tu);
    };
  }
  async _checkDuplicates(t) {
    const e = t.value.trim(), i = t.getAttribute("data-duplicate-endpoint"), r = t.getAttribute("data-duplicate-result-key"), s = t.getAttribute("data-duplicate-current-id") || "", a = document.querySelector(`[data-duplicate-warning-for="${t.id}"]`);
    if (!(!a || !i || !r)) {
      if (e === "") {
        a.classList.add("hidden");
        return;
      }
      try {
        const o = new URL(i, window.location.origin);
        o.searchParams.set("q", e), o.searchParams.set("limit", "100");
        const l = await fetch(o.toString());
        if (!l.ok)
          return;
        const h = (await l.json())[r] || [];
        let b = h;
        s && (b = h.filter((p) => p.id !== s));
        const g = b.filter((p) => p.name && p.name.toLowerCase() === e.toLowerCase());
        if (g.length > 0) {
          const p = a.querySelector("[data-duplicate-count]");
          if (p) {
            const _ = g.length === 1 ? "" : "e";
            p.textContent = `Der Name ist bereits vorhanden (${g.length} Treffer${_})`;
          }
          a.classList.remove("hidden");
        } else
          a.classList.add("hidden");
      } catch (o) {
        console.error("Duplicate check failed:", o);
      }
    }
  }
}
const la = "content-images-list", ca = "content-images-dialog", da = "content-images-close", ua = "content-images-full", ha = "content-images-delete-dialog", ma = "content-images-delete-confirm", pa = "content-images-delete-cancel", fa = "content-images-delete-name", iu = "300x0", nu = "0x1000", Vo = (n, t) => {
  if (!n)
    return "";
  if (n.includes("thumb="))
    return n;
  const e = n.includes("?") ? "&" : "?";
  return `${n}${e}thumb=${t}`;
}, ru = (n) => Vo(n, nu), ga = (n) => {
  if (!n)
    return "";
  const e = (n.split("?")[0] || "").split("/");
  return e[e.length - 1] || "";
}, su = (n, t) => {
  const e = Array.isArray(t) ? t : [];
  return (Array.isArray(n) ? n : []).map((i, r) => {
    if (typeof i == "string") {
      const s = e[r] || ga(i);
      return { url: i, name: s };
    }
    if (i && typeof i == "object") {
      const s = i.url || "", a = i.name || e[r] || ga(s);
      return { url: s, name: a };
    }
    return { url: "", name: "" };
  });
};
class au extends HTMLElement {
  connectedCallback() {
    if (this.dataset.init === "true")
      return;
    this.dataset.init = "true", this._pendingFiles = [], this._pendingUrls = [], this._pendingDeletes = /* @__PURE__ */ new Set(), this._pendingIds = [], this._pendingIdCounter = 0, this._scanOrder = [], this._wireUpload();
    const t = this.getAttribute("data-images") || "[]", e = this.getAttribute("data-files") || "[]";
    let i = [], r = [];
    try {
      i = JSON.parse(t);
    } catch {
      i = [];
    }
    try {
      r = JSON.parse(e);
    } catch {
      r = [];
    }
    const s = su(i, r);
    this._render(s);
  }
  _wireUpload() {
    const t = this.closest("[data-role='content-images-panel']");
    if (!t)
      return;
    const e = t.querySelector("[data-role='content-images-upload-input']");
    !e || e.dataset.bound === "true" || (e.dataset.bound = "true", e.addEventListener("change", () => {
      this._setPendingFiles(Array.from(e.files || []));
    }));
  }
  _setPendingFiles(t) {
    const e = Array.isArray(t) ? t : [];
    if (e.length === 0)
      return;
    Array.isArray(this._pendingFiles) || (this._pendingFiles = []), Array.isArray(this._pendingUrls) || (this._pendingUrls = []), Array.isArray(this._pendingIds) || (this._pendingIds = []);
    const i = [];
    e.forEach((r) => {
      this._pendingFiles.push(r), this._pendingUrls.push(URL.createObjectURL(r));
      const s = `p${Date.now()}_${this._pendingIdCounter++}`;
      this._pendingIds.push(s), i.push(s);
    }), Array.isArray(this._scanOrder) || (this._scanOrder = []), this._scanOrder = this._scanOrder.concat(i.map((r) => `pending:${r}`)), this._render(this._currentImages || []);
  }
  _render(t) {
    this._currentImages = t, this.classList.add("block"), this.style.display = "block", this.style.width = "100%";
    const e = this._ensureList(), i = this._ensureUploadProxy();
    i && i.parentElement === e && i.remove(), e.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((p) => {
      p.remove();
    });
    const r = this.getAttribute("data-delete-endpoint") || "", s = this.getAttribute("data-content-id") || "", a = this.getAttribute("data-csrf-token") || "", o = r && s && a, l = /* @__PURE__ */ new Map();
    t.forEach((p) => {
      p && p.name && l.set(p.name, p);
    }), (!Array.isArray(this._scanOrder) || this._scanOrder.length === 0) && (this._scanOrder = t.map((p) => `existing:${p.name}`), this._scanOrder = this._scanOrder.concat(this._pendingIds.map((p) => `pending:${p}`)));
    const c = /* @__PURE__ */ new Map();
    this._pendingIds.forEach((p, _) => {
      c.set(p, { url: this._pendingUrls[_] });
    });
    const h = [];
    this._scanOrder.forEach((p) => {
      if (p.startsWith("existing:")) {
        const _ = p.slice(9);
        l.has(_) && h.push({ type: "existing", name: _, image: l.get(_) });
        return;
      }
      if (p.startsWith("pending:")) {
        const _ = p.slice(8);
        c.has(_) && h.push({ type: "pending", id: _, url: c.get(_).url });
      }
    }), h.forEach((p, _) => {
      if (p.type === "pending") {
        const u = document.createElement("div");
        u.className = "group relative", u.dataset.role = "content-images-pending", u.dataset.scanKey = `pending:${p.id}`, u.draggable = !0;
        const x = document.createElement("button");
        x.type = "button", x.className = [
          "rounded",
          "border",
          "border-dashed",
          "border-slate-300",
          "bg-stone-50",
          "p-1",
          "shadow-sm"
        ].join(" "), x.dataset.imageUrl = p.url, x.dataset.imageIndex = `pending-${_}`;
        const v = document.createElement("img");
        v.src = p.url, v.alt = "Digitalisat (neu)", v.loading = "lazy", v.className = "h-28 w-28 object-cover opacity-70", x.appendChild(v);
        const O = document.createElement("span");
        O.className = "absolute left-1 top-1 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900", O.textContent = "Neu", u.appendChild(x), u.appendChild(O);
        const j = document.createElement("button");
        j.type = "button", j.className = "absolute right-1 top-1 hidden rounded-full border border-red-200 bg-white/90 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm transition group-hover:flex hover:text-red-900 hover:border-red-300", j.innerHTML = '<i class="ri-close-line mr-1"></i>Entfernen', j.addEventListener("click", (z) => {
          z.preventDefault(), z.stopPropagation(), this._removePendingFileById(p.id);
        }), u.appendChild(j), e.appendChild(u);
        return;
      }
      const f = p.image, A = document.createElement("div");
      A.className = "group relative", A.dataset.role = "content-images-item", A.dataset.scanKey = `existing:${p.name}`, A.draggable = !0;
      const w = this._pendingDeletes.has(f.name);
      w && A.classList.add("content-image-pending");
      const T = document.createElement("button");
      T.type = "button", T.className = [
        "relative",
        "rounded",
        "border",
        "border-slate-200",
        "bg-white",
        "p-1",
        "shadow-sm",
        "transition",
        "hover:border-slate-400",
        "hover:shadow-md"
      ].join(" "), T.dataset.imageUrl = f.url, T.dataset.imageIndex = String(_), w && (T.setAttribute("aria-disabled", "true"), T.classList.add("content-image-pending-button"));
      const C = document.createElement("img");
      if (C.src = Vo(f.url, iu), C.alt = "Digitalisat", C.loading = "lazy", C.className = "h-28 w-28 object-cover", T.appendChild(C), A.appendChild(T), o && f.name) {
        const u = document.createElement("button");
        u.type = "button", u.className = [
          "absolute",
          "right-1",
          "top-1",
          "hidden",
          "rounded-full",
          "border",
          "border-red-200",
          "bg-white/90",
          "px-2",
          "py-1",
          "text-xs",
          "font-semibold",
          "text-red-700",
          "z-20",
          "shadow-sm",
          "transition",
          "group-hover:flex",
          "hover:text-red-900",
          "hover:border-red-300"
        ].join(" "), w ? (u.classList.remove("border-red-200", "text-red-700"), u.classList.add("border-amber-300", "bg-amber-100", "text-amber-900", "hover:border-amber-400", "hover:text-amber-950"), u.innerHTML = '<i class="ri-arrow-go-back-line mr-1"></i>Rueckgaengig') : u.innerHTML = '<i class="ri-delete-bin-line mr-1"></i>Entfernen', u.addEventListener("click", (x) => {
          x.preventDefault(), x.stopPropagation(), this._togglePendingDelete(f.name);
        }), A.appendChild(u);
      }
      e.appendChild(A);
    }), i && i.parentElement !== e && e.appendChild(i);
    const b = this._ensureDialog(), g = b.querySelector(`[data-role='${ua}']`);
    e.addEventListener("click", (p) => {
      const _ = p.target.closest("button[data-image-url]");
      if (!_ || !g)
        return;
      const f = _.dataset.imageUrl || "", A = f.startsWith("blob:") ? f : ru(f);
      g.src = A, g.alt = "Digitalisat", b.showModal ? b.showModal() : b.setAttribute("open", "true");
    }), this._wireDrag(e);
  }
  _ensureList() {
    let t = this.querySelector(`[data-role='${la}']`);
    return t || (t = document.createElement("div"), t.dataset.role = la, this.appendChild(t)), t.className = "grid gap-2", t.style.gridTemplateColumns = "repeat(auto-fill, minmax(7rem, 1fr))", t.style.width = "100%", t;
  }
  _ensureUploadProxy() {
    const t = this.closest("[data-role='content-images-panel']");
    if (!t)
      return null;
    const e = t.querySelector("[data-role='content-images-upload-input']");
    if (!e)
      return null;
    let i = t.querySelector("[data-role='content-images-upload-proxy']");
    return i || (i = document.createElement("button"), i.type = "button", i.dataset.role = "content-images-upload-proxy", i.className = "flex h-28 w-28 items-center justify-center rounded-xs border-2 border-dashed border-slate-300 bg-stone-50 text-lg font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-800", i.setAttribute("aria-label", "Bilder hinzufuegen"), i.innerHTML = '<i class="ri-upload-2-line"></i>', i.addEventListener("click", () => {
      e.click();
    })), i;
  }
  _togglePendingDelete(t) {
    t && (this._pendingDeletes.has(t) ? this._pendingDeletes.delete(t) : this._pendingDeletes.add(t), this._render(this._currentImages || []));
  }
  _removePendingFileById(t) {
    const e = this._pendingIds.indexOf(t);
    if (e < 0)
      return;
    const i = this._pendingUrls[e];
    i && URL.revokeObjectURL(i), this._pendingFiles.splice(e, 1), this._pendingUrls.splice(e, 1), this._pendingIds.splice(e, 1), this._scanOrder = this._scanOrder.filter((r) => r !== `pending:${t}`), this._render(this._currentImages || []);
  }
  getPendingFiles() {
    return Array.isArray(this._pendingFiles) ? this._pendingFiles : [];
  }
  getPendingIds() {
    return Array.isArray(this._pendingIds) ? this._pendingIds : [];
  }
  getPendingDeletes() {
    return Array.from(this._pendingDeletes || []);
  }
  getScanOrder() {
    return Array.isArray(this._scanOrder) ? this._scanOrder.slice() : [];
  }
  _clearPendingPreviews() {
    Array.isArray(this._pendingUrls) && this._pendingUrls.forEach((t) => URL.revokeObjectURL(t)), this._pendingUrls = [];
  }
  disconnectedCallback() {
    this._clearPendingPreviews();
  }
  _wireDrag(t) {
    if (!t || t.dataset.dragInit === "true")
      return;
    t.dataset.dragInit = "true";
    let e = null;
    t.addEventListener("dragstart", (i) => {
      const r = i.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
      if (!r) {
        i.preventDefault();
        return;
      }
      e = r.dataset.scanKey || null, r.classList.add("opacity-60"), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", "move");
    }), t.addEventListener("dragover", (i) => {
      if (!e)
        return;
      i.preventDefault();
      const r = i.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
      if (!r || r.dataset.scanKey === e)
        return;
      const s = r.getBoundingClientRect(), a = i.clientY - s.top < s.height / 2, o = t.querySelector(`[data-scan-key="${CSS.escape(e)}"]`);
      o && (a ? r.before(o) : r.after(o));
    }), t.addEventListener("dragend", () => {
      const i = e ? t.querySelector(`[data-scan-key="${CSS.escape(e)}"]`) : null;
      i && i.classList.remove("opacity-60"), e = null;
      const r = [];
      t.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((s) => {
        s.dataset.scanKey && r.push(s.dataset.scanKey);
      }), this._scanOrder = r;
    });
  }
  _ensureDialog() {
    let t = this.querySelector(`[data-role='${ca}']`);
    if (t)
      return t;
    t = document.createElement("dialog"), t.dataset.role = ca, t.className = [
      "fixed",
      "inset-0",
      "m-auto",
      "w-full",
      "max-w-5xl",
      "rounded-md",
      "border",
      "border-slate-200",
      "bg-white",
      "p-0",
      "shadow-xl",
      "backdrop:bg-black/60"
    ].join(" "), t.innerHTML = `
			<div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
				<div class="text-sm font-semibold text-gray-800">Digitalisat</div>
				<button
					type="button"
					class="rounded-xs border border-slate-300 bg-stone-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-stone-200"
					data-role="${da}">
					Schliessen
				</button>
			</div>
			<div class="p-4">
				<img data-role="${ua}" class="max-h-[75vh] w-full object-contain" alt="Digitalisat" />
			</div>
		`;
    const e = t.querySelector(`[data-role='${da}']`);
    return e && e.addEventListener("click", () => {
      t.close();
    }), t.addEventListener("cancel", (i) => {
      i.preventDefault(), t.close();
    }), t.addEventListener("click", (i) => {
      i.target === t && t.close();
    }), this.appendChild(t), t;
  }
  _openDeleteDialog(t) {
    const e = this._ensureDeleteDialog();
    if (!e)
      return;
    e.dataset.endpoint = t.endpoint, e.dataset.contentId = t.contentId, e.dataset.csrfToken = t.csrfToken, e.dataset.fileName = t.fileName;
    const i = e.querySelector(`[data-role='${fa}']`);
    i && (i.textContent = t.fileName), e.showModal ? e.showModal() : e.setAttribute("open", "true");
  }
  _ensureDeleteDialog() {
    let t = this.querySelector(`[data-role='${ha}']`);
    if (t)
      return t;
    t = document.createElement("dialog"), t.dataset.role = ha, t.className = [
      "dbform",
      "fixed",
      "inset-0",
      "m-auto",
      "rounded-md",
      "border",
      "border-slate-200",
      "p-0",
      "shadow-xl",
      "backdrop:bg-black/40"
    ].join(" "), t.innerHTML = `
			<div class="p-5 w-[22rem]">
				<div class="text-base font-bold text-gray-900">Digitalisat loeschen?</div>
				<div class="text-sm font-bold text-gray-900 mt-1" data-role="${fa}"></div>
				<p class="text-sm text-gray-700 mt-2">
					Das Digitalisat wird dauerhaft entfernt.
				</p>
				<div class="flex items-center justify-end gap-3 mt-4">
					<button type="button" class="resetbutton w-auto px-3 py-1 text-sm" data-role="${pa}">Abbrechen</button>
					<button type="button" class="submitbutton w-auto bg-red-700 hover:bg-red-800 px-3 py-1 text-sm" data-role="${ma}">
						Loeschen
					</button>
				</div>
			</div>
		`;
    const e = t.querySelector(`[data-role='${pa}']`), i = t.querySelector(`[data-role='${ma}']`), r = () => {
      t.open && t.close();
    };
    return e && e.addEventListener("click", r), t.addEventListener("cancel", (s) => {
      s.preventDefault(), r();
    }), i && i.addEventListener("click", () => {
      this._performDelete(t);
    }), this.appendChild(t), t;
  }
  _performDelete(t) {
    const e = t.dataset.endpoint || "", i = t.dataset.csrfToken || "", r = t.dataset.contentId || "", s = t.dataset.fileName || "";
    if (!e || !i || !r || !s) {
      t.close();
      return;
    }
    const a = this.closest("[data-role='content-images-panel']");
    if (window.htmx?.ajax && a) {
      window.htmx.ajax("POST", e, {
        target: a,
        swap: "outerHTML",
        values: {
          csrf_token: i,
          content_id: r,
          scan: s
        }
      }), t.close();
      return;
    }
    const o = new URLSearchParams();
    o.set("csrf_token", i), o.set("content_id", r), o.set("scan", s), fetch(e, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "HX-Request": "true"
      },
      body: o.toString()
    }).then((l) => !l.ok || !a ? null : l.text()).then((l) => {
      !l || !a || this._applyServerResponse(l, a);
    }).catch(() => null).finally(() => {
      t.close();
    });
  }
  _applyServerResponse(t, e) {
    const i = document.createElement("template");
    i.innerHTML = t.trim(), Array.from(i.content.querySelectorAll("[hx-swap-oob]")).forEach((a) => {
      const o = a.getAttribute("hx-swap-oob") || "", [l, c] = o.split(":"), h = l || "outerHTML", b = c ? document.querySelector(c) : a.id ? document.getElementById(a.id) : null;
      b && (h === "innerHTML" ? b.innerHTML = a.innerHTML : b.outerHTML = a.outerHTML), a.remove();
    });
    const s = i.content.firstElementChild;
    s && e.replaceWith(s);
  }
}
const ou = "lookup-field", sr = "lf-input", ba = "lf-list", lu = "lf-option", va = "lf-hidden-input", ya = "lf-clear-button", _a = "lf-link-button", Aa = "lf-warn-icon", Ea = "lf-dup-warning", xa = 1, Sa = 10, La = 250;
class cu extends HTMLElement {
  constructor() {
    super(), this._endpoint = "", this._resultKey = "items", this._minChars = xa, this._limit = Sa, this._autocomplete = !0, this._placeholder = "", this._required = !1, this._multiline = !1, this._valueName = "", this._textName = "", this._valueFn = null, this._linkFn = null, this._validFn = null, this._dupEndpoint = "", this._dupResultKey = "", this._dupCurrentId = "", this._dupExact = !0, this._options = [], this._selected = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._dupTimeout = null, this._listVisible = !1, this._input = null, this._hiddenInput = null, this._list = null, this._clearButton = null, this._linkButton = null, this._warnIcon = null, this._dupWarning = null, this._boundHandleInput = this._handleInput.bind(this), this._boundHandleFocus = this._handleFocus.bind(this), this._boundHandleKeyDown = this._handleKeyDown.bind(this), this._boundHandleClear = this._handleClear.bind(this), this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }
  static get observedAttributes() {
    return [
      "name",
      "value",
      "placeholder",
      "data-endpoint",
      "data-result-key",
      "data-minchars",
      "data-limit",
      "data-autocomplete",
      "data-required",
      "data-multiline",
      "data-value-name",
      "data-text-name",
      "data-value-fn",
      "data-link-fn",
      "data-valid-fn",
      "data-dup-endpoint",
      "data-dup-result-key",
      "data-dup-current-id",
      "data-dup-exact",
      "data-initial-id",
      "data-initial-name",
      "data-initial-musenalm-id"
    ];
  }
  connectedCallback() {
    this._render(), this._bindElements(), this._syncFromAttributes(), this._applyInitialValue(), this._updateValidity(), this._maybeCheckDuplicates(this._input?.value || "");
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleClickOutside), this._input && (this._input.removeEventListener("input", this._boundHandleInput), this._input.removeEventListener("focus", this._boundHandleFocus), this._input.removeEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.removeEventListener("click", this._boundHandleClear);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && this._input && (this._syncFromAttributes(), t === "value" && this._applyInitialValue());
  }
  _render() {
    const t = this.getAttribute("data-multiline") === "true", e = this.hasAttribute("data-text-name"), i = e && this.getAttribute("data-text-name") || "", r = this.getAttribute("data-value-name") || "", s = this.getAttribute("placeholder") || "", a = this.getAttribute("id") ? `${this.getAttribute("id")}-input` : "", o = this.getAttribute("value") || "", c = this.getAttribute("data-no-enter") === "true" ? " no-enter" : "", h = this.getAttribute("name") || "", b = e ? i : h, g = b ? ` name="${b}"` : "", p = t ? `<textarea id="${a}" class="${sr} inputinput w-full${c}" rows="1" placeholder="${s}"${g}>${o}</textarea>` : `<input id="${a}" type="text" class="${sr} inputinput w-full${c}" placeholder="${s}" value="${o}"${g} />`, _ = r ? `<input type="hidden" class="${va}" name="${r}" value="" />` : "";
    this.innerHTML = `
			<div class="${ou} relative">
				<div class="inputshell flex items-center gap-2">
					${p.replace(/(class="[^"]*)"/, `$1" ${g}`)}
					<a class="${_a} hidden text-sm text-gray-600 hover:text-gray-900 no-underline" aria-label="Auswahl öffnen" target="_blank" rel="noopener">
						<i class="ri-external-link-line"></i>
					</a>
					<span class="${Aa} hidden text-red-700 text-lg" aria-hidden="true">
						<i class="ri-error-warning-line"></i>
					</span>
					<button type="button" class="${ya} text-sm text-gray-600 hover:text-gray-900" aria-label="Eingabe löschen">
						<i class="ri-close-line"></i>
					</button>
				</div>
				${_}
				<div class="${ba} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
				<div class="${Ea} hidden text-sm text-blue-700 mt-1 flex items-center gap-2">
					<i class="ri-information-line"></i>
					<span data-role="dup-text"></span>
				</div>
			</div>
		`;
  }
  _bindElements() {
    this._input = this.querySelector(`.${sr}`), this._hiddenInput = this.querySelector(`.${va}`), this._list = this.querySelector(`.${ba}`), this._clearButton = this.querySelector(`.${ya}`), this._linkButton = this.querySelector(`.${_a}`), this._warnIcon = this.querySelector(`.${Aa}`), this._dupWarning = this.querySelector(`.${Ea}`), this._input && (this._input.addEventListener("input", this._boundHandleInput), this._input.addEventListener("focus", this._boundHandleFocus), this._input.addEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.addEventListener("click", this._boundHandleClear), document.addEventListener("click", this._boundHandleClickOutside);
  }
  _syncFromAttributes() {
    this._endpoint = this.getAttribute("data-endpoint") || "", this._resultKey = this.getAttribute("data-result-key") || "items", this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), xa), this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), Sa), this._autocomplete = this.getAttribute("data-autocomplete") !== "false", this._placeholder = this.getAttribute("placeholder") || "", this._required = this.getAttribute("data-required") === "true", this._multiline = this.getAttribute("data-multiline") === "true", this._valueName = this.getAttribute("data-value-name") || "", this._textName = this.hasAttribute("data-text-name") && this.getAttribute("data-text-name") || "", this._valueFn = this._getFn(this.getAttribute("data-value-fn")), this._linkFn = this._getFn(this.getAttribute("data-link-fn")), this._validFn = this._getFn(this.getAttribute("data-valid-fn")), this._dupEndpoint = this.getAttribute("data-dup-endpoint") || "", this._dupResultKey = this.getAttribute("data-dup-result-key") || "", this._dupCurrentId = this.getAttribute("data-dup-current-id") || "", this._dupExact = this.getAttribute("data-dup-exact") !== "false";
    const t = this.getAttribute("data-initial-name") || "", e = this.getAttribute("data-initial-id") || "", i = this.getAttribute("data-initial-musenalm-id") || "";
    e && t && !this._selected && (this._selected = { id: e, name: t, musenalm_id: i || void 0 }, this._syncHiddenInput(), this._input && !this._input.value && (this._input.value = t)), this._input && (this._input.placeholder = this._placeholder);
  }
  _getFn(t) {
    if (!t)
      return null;
    const e = window[t];
    return typeof e == "function" ? e : null;
  }
  _applyInitialValue() {
    const t = this.getAttribute("value") || "";
    this._input && t && !this._input.value && (this._input.value = t);
  }
  _handleInput(t) {
    const e = t.target.value.trim();
    if (this._selected = null, this._highlightedIndex = -1, this._syncHiddenInput(), this._updateValidity(), this._maybeCheckDuplicates(e), !!this._autocomplete) {
      if (e.length < this._minChars) {
        this._options = [], this._renderOptions(), this._hideList();
        return;
      }
      this._debouncedFetch(e);
    }
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
    t.preventDefault(), this._input && (this._input.value = ""), this._selected = null, this._options = [], this._syncHiddenInput(), this._updateValidity(), this._renderOptions(), this._hideList(), this._maybeCheckDuplicates(""), this.dispatchEvent(new CustomEvent("lfchange", { bubbles: !0, detail: { item: null } })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  _handleClickOutside(t) {
    this.contains(t.target) || this._hideList();
  }
  _debouncedFetch(t) {
    this._fetchTimeout && clearTimeout(this._fetchTimeout), this._fetchTimeout = setTimeout(() => {
      this._fetchOptions(t);
    }, La);
  }
  async _fetchOptions(t) {
    if (!this._endpoint)
      return;
    this._fetchController && this._fetchController.abort(), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), this._limit > 0 && e.searchParams.set("limit", String(this._limit));
    try {
      const i = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!i.ok)
        return;
      const r = await i.json(), s = Array.isArray(r?.[this._resultKey]) ? r[this._resultKey] : [];
      this._options = s.filter((a) => a && a.id && a.name).map((a) => {
        if ("musenalm_id" in a && a.musenalm_id)
          return a;
        const o = a.MusenalmID || a.musenalmId || a.musenalmID || "";
        return o ? { ...a, musenalm_id: o } : a;
      }), this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._maybeAutoSelectExactMatch(t), this._renderOptions(), this._options.length > 0 ? this._options.length === 1 && this._isExactMatch(t, this._options[0]?.name || "") ? this._hideList() : this._showList() : this._hideList();
    } catch (i) {
      if (i?.name === "AbortError")
        return;
    }
  }
  _renderOptions() {
    this._list && (this._list.innerHTML = "", this._options.forEach((t, e) => {
      const i = document.createElement("button");
      i.type = "button", i.setAttribute("data-index", String(e)), i.className = `${lu} w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors`;
      const r = e === this._highlightedIndex;
      i.classList.toggle("bg-slate-100", r), i.setAttribute("aria-selected", r ? "true" : "false");
      const s = document.createElement("div");
      if (s.className = "text-sm font-semibold text-gray-800", s.textContent = t.name, i.appendChild(s), t.detail) {
        const a = document.createElement("div");
        a.className = "text-xs text-gray-600", a.textContent = t.detail, i.appendChild(a);
      }
      i.addEventListener("click", () => {
        this._selectOption(t);
      }), this._list.appendChild(i);
    }));
  }
  _selectOption(t) {
    this._selected = t, this._input && (this._input.value = t.name || ""), this._syncHiddenInput(), this._updateValidity(), this._hideList(), this.dispatchEvent(new CustomEvent("lfchange", { bubbles: !0, detail: { item: t } })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  _isExactMatch(t, e) {
    const i = (t || "").trim().toLowerCase(), r = (e || "").trim().toLowerCase();
    return i !== "" && i === r;
  }
  _maybeAutoSelectExactMatch(t) {
    const e = this._options.find((r) => this._isExactMatch(t, r?.name || ""));
    if (!e)
      return;
    const i = this._selected?.id || "";
    this._selected = e, this._syncHiddenInput(), this._updateValidity(), e.id !== i && (this.dispatchEvent(new CustomEvent("lfchange", { bubbles: !0, detail: { item: e } })), this.dispatchEvent(new Event("change", { bubbles: !0 })));
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
  _syncHiddenInput() {
    if (!this._hiddenInput)
      return;
    let t = "";
    this._valueFn && this._selected ? t = String(this._valueFn({ item: this._selected, displayValue: this._input?.value || "" }) || "") : this._selected?.id && (t = this._selected.id), this._hiddenInput.value = t;
  }
  _updateValidity() {
    const t = (this._input?.value || "").trim(), e = (this._hiddenInput?.value || "").trim();
    let i = !0;
    this._validFn ? i = !!this._validFn({ value: e || t, displayValue: t, hiddenValue: e, item: this._selected }) : this._required && (i = (e || t).length > 0);
    const r = this._linkFn ? this._linkFn({ item: this._selected, value: e || t }) : "";
    if (this._warnIcon && this._linkButton && (i ? r ? (this._warnIcon.classList.add("hidden"), this._linkButton.classList.remove("hidden"), this._linkButton.setAttribute("href", r)) : (this._warnIcon.classList.add("hidden"), this._linkButton.classList.add("hidden")) : (this._warnIcon.classList.remove("hidden"), this._linkButton.classList.add("hidden"))), this._clearButton) {
      const s = t.length > 0;
      this._clearButton.classList.toggle("hidden", !s || !i);
      const a = this._clearButton.querySelector("i");
      a && (a.className = "ri-check-line", this._clearButton.classList.add("text-green-600", "hover:text-green-800"), this._clearButton.classList.remove("text-gray-600", "hover:text-gray-900"));
    }
  }
  _maybeCheckDuplicates(t) {
    !this._dupEndpoint || !this._dupResultKey || !this._dupWarning || (this._dupTimeout && clearTimeout(this._dupTimeout), this._dupTimeout = setTimeout(() => {
      this._checkDuplicates(t);
    }, La));
  }
  async _checkDuplicates(t) {
    if (!this._dupEndpoint || !this._dupResultKey || !this._dupWarning)
      return;
    const e = (t || "").trim();
    if (!e) {
      this._dupWarning.classList.add("hidden");
      return;
    }
    try {
      const i = new URL(this._dupEndpoint, window.location.origin);
      i.searchParams.set("q", e), i.searchParams.set("limit", "100");
      const r = await fetch(i.toString());
      if (!r.ok)
        return;
      const a = (await r.json())[this._dupResultKey] || [];
      let o = a;
      this._dupCurrentId && (o = a.filter((c) => c.id !== this._dupCurrentId));
      const l = this._dupExact ? o.filter((c) => c.name && c.name.toLowerCase() === e.toLowerCase()) : o;
      if (l.length > 0) {
        const c = this._dupWarning.querySelector("[data-role='dup-text']");
        c && (c.textContent = `Der Name ist bereits vorhanden (${l.length} Treffer)`), this._dupWarning.classList.remove("hidden");
      } else
        this._dupWarning.classList.add("hidden");
    } catch {
      this._dupWarning.classList.add("hidden");
    }
  }
  _parsePositiveInt(t, e) {
    const i = parseInt(t || "", 10);
    return Number.isNaN(i) || i <= 0 ? e : i;
  }
  _showList() {
    this._list && (this._listVisible = !0, this._list.classList.remove("hidden"));
  }
  _hideList() {
    this._list && (this._listVisible = !1, this._list.classList.add("hidden"));
  }
}
class du extends HTMLElement {
  constructor() {
    super(), this.listUrl = "", this.runUrl = "", this.deleteUrl = "", this.fts5RebuildUrl = "", this.fts5StatusUrl = "", this.csrf = "", this.list = null, this.status = null, this.fts5Status = null, this.fts5Progress = null, this.fts5ProgressText = null, this.fts5ProgressPercent = null, this.fts5ProgressBar = null, this.pollTimer = null, this.pollIntervalMs = 2500;
  }
  connectedCallback() {
    this.listUrl = this.dataset.listUrl || "", this.runUrl = this.dataset.runUrl || "", this.deleteUrl = this.dataset.deleteUrl || "", this.fts5RebuildUrl = this.dataset.fts5RebuildUrl || "", this.fts5StatusUrl = this.dataset.fts5StatusUrl || "", this.csrf = this.dataset.csrf || "", this.list = this.querySelector("[data-role='export-list']"), this.status = this.querySelector("[data-role='status']"), this.fts5Status = this.querySelector("[data-role='fts5-status']"), this.fts5Progress = this.querySelector("[data-role='fts5-progress']"), this.fts5ProgressText = this.querySelector("[data-role='fts5-progress-text']"), this.fts5ProgressPercent = this.querySelector("[data-role='fts5-progress-percent']"), this.fts5ProgressBar = this.querySelector("[data-role='fts5-progress-bar']"), this.fts5LastRebuild = this.querySelector("[data-role='fts5-last-rebuild']"), this.fts5LastRebuildWrap = this.querySelector("[data-role='fts5-last-rebuild-wrap']"), this.fts5Button = this.querySelector("[data-role='fts5-rebuild']"), this.fts5ButtonLabel = this.querySelector("[data-role='fts5-rebuild-label']"), this.fts5StatusValue = "idle", this.fts5HadRunning = !1, this.addEventListener("click", (t) => this.handleAction(t)), this.refreshList(), this.refreshFts5Status();
  }
  disconnectedCallback() {
    this.stopPolling();
  }
  setStatus(t, e) {
    this.status && (this.status.textContent = t || "", this.status.classList.remove("text-red-600", "text-green-600"), e ? this.status.classList.add("text-red-600") : t && this.status.classList.add("text-green-600"));
  }
  async handleRun(t, e) {
    if (t.preventDefault(), !this.runUrl) return;
    this.setStatus("Export wird gestartet...");
    const i = t.target.closest("[data-role='run-export']");
    i && (i.disabled = !0);
    const r = new URLSearchParams();
    r.set("csrf_token", this.getCsrfToken()), r.set("export_type", e || "data");
    try {
      const s = await fetch(this.runUrl, {
        method: "POST",
        body: r,
        credentials: "same-origin"
      });
      if (!s.ok) {
        const o = await this.extractError(s);
        this.setStatus(o || "Export konnte nicht gestartet werden.", !0);
        return;
      }
      const a = await this.safeJson(s);
      if (a && a.error) {
        this.setStatus(a.error, !0);
        return;
      }
      this.setStatus("Export läuft..."), await this.refreshList(), this.startPolling();
    } catch {
      this.setStatus("Export konnte nicht gestartet werden.", !0);
    } finally {
      i && (i.disabled = !1);
    }
  }
  async handleAction(t) {
    const e = t.target.closest("[data-role='run-export']");
    if (e) {
      const a = e.getAttribute("data-export-type") || "data";
      await this.handleRun(t, a);
      return;
    }
    if (t.target.closest("[data-role='fts5-rebuild']")) {
      await this.handleFts5Rebuild(t);
      return;
    }
    const r = t.target.closest("[data-action]");
    if (!r) return;
    if (r.getAttribute("data-action") === "delete") {
      const a = r.getAttribute("data-id");
      if (!a || !this.deleteUrl || !confirm("Soll der Export wirklich gelöscht werden?")) return;
      await this.deleteExport(a);
    }
  }
  async deleteExport(t) {
    const e = new URLSearchParams();
    e.set("csrf_token", this.getCsrfToken());
    try {
      const i = await fetch(`${this.deleteUrl}${t}`, {
        method: "POST",
        body: e,
        credentials: "same-origin"
      });
      if (!i.ok) {
        const s = await this.extractError(i);
        this.setStatus(s || "Export konnte nicht gelöscht werden.", !0);
        return;
      }
      const r = await this.safeJson(i);
      if (r && r.error) {
        this.setStatus(r.error, !0);
        return;
      }
      this.setStatus("Export gelöscht."), await this.refreshList();
    } catch {
      this.setStatus("Export konnte nicht gelöscht werden.", !0);
    }
  }
  async refreshList() {
    if (!(!this.list || !this.listUrl))
      try {
        const t = await fetch(this.listUrl, { credentials: "same-origin" });
        if (!t.ok)
          return;
        const e = await t.text();
        this.list.innerHTML = e, this.syncPollingState();
      } catch {
      }
  }
  async refreshFts5Status() {
    if (this.fts5StatusUrl)
      try {
        const t = await fetch(this.fts5StatusUrl, { credentials: "same-origin" });
        if (!t.ok) return;
        const e = await this.safeJson(t);
        if (!e) return;
        this.updateFts5Status(e), this.syncPollingState();
      } catch {
      }
  }
  updateFts5Status(t) {
    if (!this.fts5Status) return;
    const e = this.fts5StatusValue, i = this.normalizeText(t.status) || "idle", r = this.normalizeText(t.message || ""), s = this.normalizeText(t.error || ""), a = Number.isFinite(t.done) ? t.done : 0, o = Number.isFinite(t.total) ? t.total : 0, l = this.formatGermanDateTime(this.normalizeText(t.last_rebuild || ""));
    if (this.fts5StatusValue = i, this.fts5Status.classList.remove(
      "hidden",
      "text-slate-700",
      "text-green-800",
      "text-red-700",
      "text-amber-800",
      "bg-slate-50",
      "bg-green-50",
      "bg-red-50",
      "bg-amber-50",
      "border-slate-200",
      "border-green-200",
      "border-red-200",
      "border-amber-200"
    ), (i === "running" || i === "restarting") && (this.fts5HadRunning = !0), i === "complete" && !this.fts5HadRunning ? (this.fts5Status.textContent = "", this.fts5Status.classList.add("hidden")) : i === "error" ? (this.fts5Status.textContent = s || "FTS5-Neuaufbau fehlgeschlagen.", this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200")) : i === "aborted" ? (this.fts5Status.textContent = r || "FTS5-Neuaufbau abgebrochen.", this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200")) : i === "complete" ? (this.fts5Status.textContent = r || "FTS5-Neuaufbau abgeschlossen.", this.fts5Status.classList.add("text-green-800", "bg-green-50", "border-green-200")) : i === "restarting" ? (this.fts5Status.textContent = r || "FTS5-Neuaufbau wird neu gestartet.", this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200")) : i === "running" ? (this.fts5Status.textContent = r || "FTS5-Neuaufbau läuft.", this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200")) : (this.fts5Status.textContent = r || "", this.fts5Status.textContent ? this.fts5Status.classList.add("text-slate-700", "bg-slate-50", "border-slate-200") : this.fts5Status.classList.add("hidden")), this.fts5Status.textContent && this.fts5Status.classList.remove("hidden"), this.fts5Progress && (i === "running" || i === "restarting" ? this.fts5Progress.classList.remove("hidden") : this.fts5Progress.classList.add("hidden")), this.fts5Button) {
      const c = i === "running";
      this.fts5ButtonLabel && (this.fts5ButtonLabel.textContent = c ? "Abbrechen & neu starten" : "Neuaufbau starten"), this.fts5Button.classList.toggle("bg-slate-900", !c), this.fts5Button.classList.toggle("hover:bg-slate-800", !c), this.fts5Button.classList.toggle("bg-amber-600", c), this.fts5Button.classList.toggle("hover:bg-amber-700", c);
    }
    if (this.fts5LastRebuild && l && (this.fts5LastRebuild.textContent = l, this.fts5LastRebuildWrap && this.fts5LastRebuildWrap.classList.remove("hidden")), e === "running" && i !== "running" && window.setTimeout(() => {
      this.refreshFts5Status();
    }, 500), (i === "running" || i === "restarting") && o > 0) {
      const c = Math.min(100, Math.round(a / o * 100));
      this.fts5ProgressText && (this.fts5ProgressText.textContent = `${a} / ${o}`), this.fts5ProgressPercent && (this.fts5ProgressPercent.textContent = `${c}%`), this.fts5ProgressBar && (this.fts5ProgressBar.style.width = `${c}%`);
    } else (i === "running" || i === "restarting") && (this.fts5ProgressText && (this.fts5ProgressText.textContent = "Wird vorbereitet..."), this.fts5ProgressPercent && (this.fts5ProgressPercent.textContent = ""), this.fts5ProgressBar && (this.fts5ProgressBar.style.width = "0%"));
  }
  formatGermanDateTime(t) {
    const e = String(t || "").trim();
    if (!e) return "";
    const i = e.replace(/^"+|"+$/g, "");
    if (!i.match(
      /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/
    )) return i;
    const s = i.replace(" ", "T"), a = new Date(s);
    if (Number.isNaN(a.getTime())) return i;
    const o = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], l = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], c = a.getDate(), h = l[a.getMonth()], b = a.getFullYear(), g = String(a.getHours()).padStart(2, "0"), p = String(a.getMinutes()).padStart(2, "0");
    return `${o[a.getDay()]}, ${c}. ${h} ${b} ${g}:${p}`;
  }
  syncPollingState() {
    const t = this.list ? this.list.querySelector("[data-export-status='running'], [data-export-status='queued']") : null, e = this.fts5Progress && !this.fts5Progress.classList.contains("hidden");
    t || e ? this.startPolling() : this.stopPolling();
  }
  startPolling() {
    this.pollTimer || (this.pollTimer = window.setInterval(() => {
      this.refreshList(), this.refreshFts5Status();
    }, this.pollIntervalMs));
  }
  stopPolling() {
    this.pollTimer && (window.clearInterval(this.pollTimer), this.pollTimer = null);
  }
  async handleFts5Rebuild(t) {
    if (t.preventDefault(), !this.fts5RebuildUrl) return;
    const e = t.target.closest("[data-role='fts5-rebuild']");
    e && (e.disabled = !0), this.fts5Status && (this.fts5Status.textContent = "FTS5-Neuaufbau wird gestartet...", this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-slate-700", "bg-slate-50", "border-slate-200")), this.fts5Progress && this.fts5Progress.classList.remove("hidden"), this.fts5ProgressText && (this.fts5ProgressText.textContent = "Wird vorbereitet..."), this.fts5ProgressPercent && (this.fts5ProgressPercent.textContent = ""), this.fts5ProgressBar && (this.fts5ProgressBar.style.width = "0%");
    const i = new URLSearchParams();
    i.set("csrf_token", this.getCsrfToken());
    try {
      const r = await fetch(this.fts5RebuildUrl, {
        method: "POST",
        body: i,
        credentials: "same-origin"
      });
      if (!r.ok) {
        const a = await this.extractError(r);
        this.fts5Status && (this.fts5Status.textContent = a || "FTS5-Neuaufbau konnte nicht gestartet werden.", this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200"));
        return;
      }
      const s = await this.safeJson(r);
      if (s && s.error) {
        this.fts5Status && (this.fts5Status.textContent = s.error, this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200"));
        return;
      }
      this.fts5HadRunning = !0, s && s.status === "restarting" && this.updateFts5Status({
        status: "restarting",
        message: "FTS5-Neuaufbau wird neu gestartet."
      }), await this.refreshFts5Status(), this.startPolling();
    } catch {
      this.fts5Status && (this.fts5Status.textContent = "FTS5-Neuaufbau konnte nicht gestartet werden.", this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200"));
    } finally {
      e && (e.disabled = !1);
    }
  }
  async safeJson(t) {
    try {
      return await t.json();
    } catch {
      return null;
    }
  }
  async extractError(t) {
    try {
      const e = await t.json();
      if (e && e.error)
        return e.error;
    } catch {
    }
    try {
      return await t.text();
    } catch {
      return "";
    }
  }
  getCsrfToken() {
    if (this.csrf) return this.csrf;
    const t = document.querySelector("input[name='csrf_token']");
    return t && t.value && (this.csrf = t.value), this.csrf;
  }
  normalizeText(t) {
    if (t == null) return "";
    let e = String(t).trim();
    return e.length >= 2 && e.startsWith('"') && e.endsWith('"') && (e = e.slice(1, -1)), e;
  }
}
class uu extends HTMLElement {
  constructor() {
    super(), this.handleDocumentClick = this.handleDocumentClick.bind(this), this.handleDocumentKeydown = this.handleDocumentKeydown.bind(this), this.handleTriggerClick = this.handleTriggerClick.bind(this), this.handleOptionChange = this.handleOptionChange.bind(this), this.handleSearchInput = this.handleSearchInput.bind(this), this._bound = !1;
  }
  static get observedAttributes() {
    return ["data-options", "data-selected", "data-placeholder", "name"];
  }
  connectedCallback() {
    this.render(), this.bindEvents(), this.syncSummary(), this.close();
  }
  disconnectedCallback() {
    this.unbindEvents(), document.removeEventListener("click", this.handleDocumentClick, !0), document.removeEventListener("keydown", this.handleDocumentKeydown);
  }
  attributeChangedCallback() {
    this.isConnected && (this.render(), this.bindEvents(), this.syncSummary(), this.close());
  }
  parseJsonAttribute(t) {
    const e = this.getAttribute(t) || "[]";
    try {
      const i = JSON.parse(e);
      return Array.isArray(i) ? i : [];
    } catch {
      return [];
    }
  }
  get options() {
    return this.parseJsonAttribute("data-options").map((t) => t !== null && typeof t == "object" && "value" in t ? { value: String(t.value), label: String(t.label ?? t.value) } : { value: String(t), label: String(t) });
  }
  get selected() {
    return new Set(this.parseJsonAttribute("data-selected").map((t) => String(t)));
  }
  get placeholder() {
    return this.getAttribute("data-placeholder") || "Auswählen";
  }
  get searchable() {
    return this.getAttribute("data-searchable") === "true";
  }
  render() {
    const t = this.options, e = this.selected, i = this.getAttribute("name") || "content_type[]", r = this.searchable ? `
			<div class="px-2 pt-2 pb-1">
				<input
					type="text"
					class="w-full rounded-xs border border-stone-300 bg-white px-2 py-1 text-sm text-slate-900 focus:outline-none"
					placeholder="Suchen…"
					autocomplete="off"
					data-role="content-type-search" />
			</div>` : "";
    this.innerHTML = `
			<div class="relative" data-role="content-type-select-root">
				<button
					type="button"
					class="content-editor-meta-trigger"
					data-role="content-type-select-trigger"
					aria-haspopup="true"
					aria-expanded="false">
					<span class="min-w-0 truncate" data-role="content-type-select-summary">${this.placeholder}</span>
					<i class="ri-arrow-down-s-line shrink-0 text-base transition-transform" data-role="content-type-select-icon"></i>
				</button>
				<div class="content-editor-meta-dropdown hidden" data-role="content-type-select-menu">
					${r}
					<div class="max-h-64 overflow-y-auto py-1" data-role="content-type-select-list">
						${t.map((s) => `
							<label class="content-editor-meta-option">
								<input
									type="checkbox"
									name="${i}"
									value="${this.escapeAttribute(s.value)}"
									${e.has(s.value) ? "checked" : ""} />
								<span class="truncate">${this.escapeHtml(s.label)}</span>
							</label>
						`).join("")}
					</div>
				</div>
			</div>
		`;
  }
  bindEvents() {
    this.unbindEvents(), this.trigger = this.querySelector("[data-role='content-type-select-trigger']"), this.menu = this.querySelector("[data-role='content-type-select-menu']"), this.summary = this.querySelector("[data-role='content-type-select-summary']"), this.icon = this.querySelector("[data-role='content-type-select-icon']"), this.searchInput = this.querySelector("[data-role='content-type-search']"), this.checkboxes = Array.from(this.querySelectorAll("input[type='checkbox']")), this.trigger?.addEventListener("click", this.handleTriggerClick), this.checkboxes.forEach((t) => {
      t.addEventListener("change", this.handleOptionChange);
    }), this.searchInput?.addEventListener("input", this.handleSearchInput), document.addEventListener("click", this.handleDocumentClick, !0), document.addEventListener("keydown", this.handleDocumentKeydown), this._bound = !0;
  }
  unbindEvents() {
    this._bound && (this.trigger?.removeEventListener("click", this.handleTriggerClick), this.checkboxes?.forEach((t) => {
      t.removeEventListener("change", this.handleOptionChange);
    }), this.searchInput?.removeEventListener("input", this.handleSearchInput), document.removeEventListener("click", this.handleDocumentClick, !0), document.removeEventListener("keydown", this.handleDocumentKeydown), this._bound = !1);
  }
  handleTriggerClick(t) {
    if (t.preventDefault(), t.stopPropagation(), this.isOpen()) {
      this.close();
      return;
    }
    this.open();
  }
  handleOptionChange() {
    this.syncSummary();
  }
  handleSearchInput() {
    const t = (this.searchInput?.value || "").trim().toLowerCase();
    this.querySelectorAll("[data-role='content-type-select-list'] label").forEach((e) => {
      const i = e.querySelector("span")?.textContent?.toLowerCase() || "";
      e.style.display = t === "" || i.includes(t) ? "" : "none";
    });
  }
  handleDocumentClick(t) {
    this.contains(t.target) || this.close();
  }
  handleDocumentKeydown(t) {
    t.key === "Escape" && this.close();
  }
  isOpen() {
    return this.dataset.open === "true";
  }
  open() {
    this.dataset.open = "true", this.trigger?.setAttribute("data-open", "true"), this.trigger?.setAttribute("aria-expanded", "true"), this.menu?.classList.remove("hidden"), this.icon?.classList.add("rotate-180"), this.searchInput && (this.searchInput.value = "", this.handleSearchInput(), this.searchInput.focus());
  }
  close() {
    this.dataset.open = "false", this.trigger?.setAttribute("data-open", "false"), this.trigger?.setAttribute("aria-expanded", "false"), this.menu?.classList.add("hidden"), this.icon?.classList.remove("rotate-180");
  }
  syncSummary() {
    if (!this.summary)
      return;
    const e = this.checkboxes.filter((r) => r.checked).map((r) => r.closest("label")?.querySelector("span")?.textContent?.trim() || r.value), i = e.length === 0;
    this.summary.textContent = i ? this.placeholder : e.join(", "), this.summary.classList.toggle("italic", i), this.summary.classList.toggle("text-slate-400", i);
  }
  escapeHtml(t) {
    return String(t).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  escapeAttribute(t) {
    return this.escapeHtml(t);
  }
}
const hu = "[data-role='content-person-add-toggle']", mu = "[data-role='content-person-add-panel']", pu = "[data-role='content-person-add-input']", fu = "[data-role='content-person-add-confirm']", gu = "[data-role='content-person-add-abort']", bu = "[data-role='content-person-add-results']", vu = "[data-role='content-person-add-error']", yu = "[data-role='content-person-empty']", _u = "[data-role='content-person-table-body']", ar = "[data-role='content-person-row']", wa = "[data-role='content-person-delete']", Au = "[data-role='content-person-delete-input']", Eu = "[data-role='content-person-name']", xu = "[data-role='content-person-life']", Su = "[data-role='content-person-link']", Ca = "[data-role='content-person-type']", Ta = "[data-role='content-person-uncertain']", Lu = "template[data-role='content-person-new-row-template']", wu = 200;
class Cu extends HTMLElement {
  constructor() {
    super(), this._options = [], this._selectedItem = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._boundHandleDocumentClick = this._handleDocumentClick.bind(this);
  }
  connectedCallback() {
    this.dataset.contentPersonRelationsBound !== "true" && (this.dataset.contentPersonRelationsBound = "true", this._prefix = this.getAttribute("data-prefix") || "", this._endpoint = this.getAttribute("data-endpoint") || "/admin/api/agents/search", this._linkBase = this.getAttribute("data-link-base") || "/person/", this._defaultRelation = this.getAttribute("data-default-relation") || "Autor:in", this._tableBody = this.querySelector(_u), this._addToggle = this.querySelector(hu), this._addPanel = this.querySelector(mu), this._addInput = this.querySelector(pu), this._addConfirm = this.querySelector(fu), this._addAbort = this.querySelector(gu), this._addResults = this.querySelector(bu), this._addError = this.querySelector(vu), this._emptyState = this.querySelector(yu), this._sectionHeader = this.querySelector("[data-role='content-person-section-header']"), this._template = this.querySelector(Lu), !(!this._tableBody || !this._addPanel || !this._addInput || !this._addConfirm || !this._addAbort || !this._addResults || !this._template) && (this._addToggle?.addEventListener("click", () => this._openAddPanel()), this._addAbort.addEventListener("click", () => this._closeAddPanel()), this._addConfirm.addEventListener("click", () => this._confirmSelection()), this._addInput.addEventListener("input", () => this._handleInput()), this._addInput.addEventListener("keydown", (t) => this._handleKeyDown(t)), this._bindRows(), this._syncUi(), document.addEventListener("click", this._boundHandleDocumentClick)));
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleDocumentClick), this._fetchTimeout && clearTimeout(this._fetchTimeout), this._fetchController && this._fetchController.abort();
  }
  _openAddPanel() {
    this._resetAddState({ keepInput: !1 }), this._addPanel.classList.remove("hidden"), this._addToggle?.classList.add("hidden"), this._syncUi(), this._addInput.focus();
  }
  _closeAddPanel() {
    this._resetAddState({ keepInput: !1 }), this._addPanel.classList.add("hidden"), this._addToggle?.classList.remove("hidden"), this._syncUi();
  }
  _resetAddState({ keepInput: t }) {
    this._selectedItem = null, this._options = [], this._highlightedIndex = -1, t || (this._addInput.value = ""), this._renderResults(), this._setError(""), this._updateConfirmState();
  }
  _handleInput() {
    const t = this._addInput.value.trim();
    if (this._selectedItem = null, this._highlightedIndex = -1, this._updateConfirmState(), this._setError(""), this._fetchTimeout && clearTimeout(this._fetchTimeout), t.length === 0) {
      this._options = [], this._renderResults();
      return;
    }
    this._fetchTimeout = setTimeout(() => {
      this._fetchOptions(t);
    }, wu);
  }
  async _fetchOptions(t) {
    this._fetchController && this._fetchController.abort(), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), e.searchParams.set("limit", "15");
    try {
      const i = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!i.ok) {
        this._options = [], this._renderResults();
        return;
      }
      const r = await i.json();
      this._options = Array.isArray(r?.agents) ? r.agents.filter((s) => s?.id && s?.name) : [], this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._renderResults();
    } catch (i) {
      if (i?.name === "AbortError")
        return;
      this._options = [], this._renderResults();
    }
  }
  _renderResults() {
    if (this._addResults.innerHTML = "", this._options.length === 0) {
      this._addResults.classList.add("hidden");
      return;
    }
    this._options.forEach((t, e) => {
      const i = document.createElement("button");
      i.type = "button", i.className = [
        "w-full",
        "border-b",
        "border-stone-100",
        "px-3",
        "py-2",
        "text-left",
        "transition-colors",
        e === this._highlightedIndex ? "bg-stone-100" : "bg-white hover:bg-stone-50"
      ].join(" "), i.setAttribute("aria-selected", e === this._highlightedIndex ? "true" : "false"), i.innerHTML = `
				<div class="min-w-0">
					<div class="truncate text-sm font-semibold text-slate-900">${this._escapeHtml(t.name || "")}</div>
					${t.bio ? `<div class="truncate text-xs text-slate-600">${this._escapeHtml(t.bio)}</div>` : ""}
				</div>
			`, i.addEventListener("click", () => this._selectItem(t)), this._addResults.appendChild(i);
    }), this._addResults.classList.remove("hidden");
  }
  _selectItem(t) {
    this._selectedItem = t, this._addInput.value = t.name || "", this._options = [], this._highlightedIndex = -1, this._renderResults(), this._updateConfirmState(), this._setError("");
  }
  _handleKeyDown(t) {
    if (t.key === "Escape") {
      t.preventDefault(), this._closeAddPanel();
      return;
    }
    if (t.key === "ArrowDown") {
      if (this._options.length === 0)
        return;
      t.preventDefault(), this._highlightedIndex = Math.min(this._highlightedIndex + 1, this._options.length - 1), this._renderResults();
      return;
    }
    if (t.key === "ArrowUp") {
      if (this._options.length === 0)
        return;
      t.preventDefault(), this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0), this._renderResults();
      return;
    }
    if (t.key === "Enter") {
      if (t.preventDefault(), this._options.length > 0 && this._highlightedIndex >= 0) {
        this._selectItem(this._options[this._highlightedIndex]);
        return;
      }
      this._selectedItem?.id && this._confirmSelection();
    }
  }
  _confirmSelection() {
    if (!this._selectedItem?.id) {
      this._setError("Bitte eine bestehende Person auswählen.");
      return;
    }
    this._appendNewRow(this._selectedItem), this._closeAddPanel();
  }
  _appendNewRow(t) {
    const e = this._template.content.cloneNode(!0), i = e.querySelector(ar) || e.firstElementChild;
    if (!i)
      return;
    i.dataset.kind = "new";
    const r = e.querySelector(Su), s = t.musenalm_id || t.id;
    r && (s && (r.href = `${this._linkBase}${s}`), r.classList.toggle("pointer-events-none", !s));
    const a = e.querySelector(Eu);
    a && (a.textContent = t.name || "");
    const o = e.querySelector(xu);
    o && (o.textContent = t.bio || t.detail || "");
    const l = e.querySelector(Ca);
    l && (l.name = `${this._prefix}_new_type`, l.value = this._defaultRelation);
    const c = e.querySelector(Ta);
    c && (c.name = `${this._prefix}_new_uncertain`, c.value = t.id, c.checked = !1);
    const h = e.querySelector("[data-role='content-person-new-id']");
    h && (h.name = `${this._prefix}_new_id`, h.value = t.id), this._tableBody.appendChild(e), this._bindRows(), this._syncUi();
  }
  _bindRows() {
    this.querySelectorAll(ar).forEach((t) => {
      if (t.dataset.bound === "true")
        return;
      t.dataset.bound = "true";
      const e = t.querySelector(wa);
      e && e.addEventListener("click", () => this._handleDelete(t));
    });
  }
  _handleDelete(t) {
    if (t.dataset.kind === "new") {
      t.remove(), this._syncUi();
      return;
    }
    const e = t.querySelector(Au);
    if (!e)
      return;
    e.checked = !e.checked;
    const i = e.checked;
    t.classList.toggle("bg-red-50", i), t.classList.toggle("opacity-70", i), t.querySelectorAll(`${Ca}, ${Ta}`).forEach((s) => {
      s.disabled = i;
    });
    const r = t.querySelector(wa);
    if (r) {
      const s = r.querySelector("i");
      s && (s.className = i ? "ri-arrow-go-back-line" : "ri-delete-bin-line"), r.setAttribute("aria-label", i ? "Rückgängig" : "Entfernen");
    }
  }
  _syncUi() {
    const t = this.querySelectorAll(ar).length;
    this._emptyState?.classList.toggle("hidden", t > 0), this._sectionHeader?.classList.toggle("hidden", t === 0);
  }
  _updateConfirmState() {
    this._addConfirm.disabled = !this._selectedItem?.id, this._addConfirm.classList.toggle("opacity-50", !this._selectedItem?.id), this._addConfirm.classList.toggle("cursor-not-allowed", !this._selectedItem?.id);
  }
  _setError(t) {
    this._addError && (this._addError.textContent = t, this._addError.classList.toggle("hidden", !t));
  }
  _handleDocumentClick(t) {
    this.contains(t.target) || (this._options = [], this._highlightedIndex = -1, this._renderResults());
  }
  _escapeHtml(t) {
    return String(t).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
}
const Tu = "[data-role='content-series-add-toggle']", ku = "[data-role='content-series-add-panel']", Ru = "[data-role='content-series-add-input']", Du = "[data-role='content-series-add-confirm']", Iu = "[data-role='content-series-add-abort']", Ou = "[data-role='content-series-add-results']", Mu = "[data-role='content-series-add-error']", Bu = "[data-role='content-series-empty']", Nu = "[data-role='content-series-table-body']", Xi = "[data-role='content-series-row']", ka = "[data-role='content-series-delete']", Ra = "[data-role='content-series-delete-input']", Pu = "[data-role='content-series-name']", Fu = "[data-role='content-series-link']", qu = "template[data-role='content-series-new-row-template']", Da = "[data-role='content-series-new-id']", Hu = "[data-role='content-series-new-annotation']", Uu = 200, Qi = (n) => n?.title || n?.name || n?.label || "";
class $u extends HTMLElement {
  constructor() {
    super(), this._options = [], this._selectedItem = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._boundHandleDocumentClick = this._handleDocumentClick.bind(this);
  }
  connectedCallback() {
    this.dataset.contentSeriesRelationsBound !== "true" && (this.dataset.contentSeriesRelationsBound = "true", this._prefix = this.getAttribute("data-prefix") || "", this._endpoint = this.getAttribute("data-endpoint") || "/admin/api/series/search", this._linkBase = this.getAttribute("data-link-base") || "/reihe/", this._duplicateError = this.getAttribute("data-error-duplicate") || "Diese Reihe ist bereits verknüpft.", this._tableBody = this.querySelector(Nu), this._addToggle = this.querySelector(Tu), this._addPanel = this.querySelector(ku), this._addInput = this.querySelector(Ru), this._addConfirm = this.querySelector(Du), this._addAbort = this.querySelector(Iu), this._addResults = this.querySelector(Ou), this._addError = this.querySelector(Mu), this._emptyState = this.querySelector(Bu), this._sectionHeader = this.querySelector("[data-role='content-series-section-header']"), this._template = this.querySelector(qu), !(!this._tableBody || !this._addPanel || !this._addInput || !this._addConfirm || !this._addAbort || !this._addResults || !this._template) && (this._addToggle?.addEventListener("click", () => this._openAddPanel()), this._addAbort.addEventListener("click", () => this._closeAddPanel()), this._addConfirm.addEventListener("click", () => this._confirmSelection()), this._addInput.addEventListener("input", () => this._handleInput()), this._addInput.addEventListener("keydown", (t) => this._handleKeyDown(t)), this._bindRows(), this._syncUi(), document.addEventListener("click", this._boundHandleDocumentClick)));
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleDocumentClick), this._fetchTimeout && clearTimeout(this._fetchTimeout), this._fetchController && this._fetchController.abort();
  }
  _openAddPanel() {
    this._resetAddState({ keepInput: !1 }), this._addPanel.classList.remove("hidden"), this._addToggle?.classList.add("hidden"), this._syncUi(), this._addInput.focus();
  }
  _closeAddPanel() {
    this._resetAddState({ keepInput: !1 }), this._addPanel.classList.add("hidden"), this._addToggle?.classList.remove("hidden"), this._syncUi();
  }
  _resetAddState({ keepInput: t }) {
    this._selectedItem = null, this._options = [], this._highlightedIndex = -1, t || (this._addInput.value = ""), this._renderResults(), this._setError(""), this._updateConfirmState();
  }
  _handleInput() {
    const t = this._addInput.value.trim();
    if (this._selectedItem = null, this._highlightedIndex = -1, this._updateConfirmState(), this._setError(""), this._fetchTimeout && clearTimeout(this._fetchTimeout), t.length === 0) {
      this._options = [], this._renderResults();
      return;
    }
    this._fetchTimeout = setTimeout(() => {
      this._fetchOptions(t);
    }, Uu);
  }
  async _fetchOptions(t) {
    this._fetchController && this._fetchController.abort(), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), e.searchParams.set("limit", "15");
    try {
      const i = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!i.ok) {
        this._options = [], this._renderResults();
        return;
      }
      const r = await i.json();
      this._options = Array.isArray(r?.series) ? r.series.filter((s) => s?.id && Qi(s)) : [], this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._renderResults();
    } catch (i) {
      if (i?.name === "AbortError")
        return;
      this._options = [], this._renderResults();
    }
  }
  _renderResults() {
    if (this._addResults.innerHTML = "", this._options.length === 0) {
      this._addResults.classList.add("hidden");
      return;
    }
    this._options.forEach((t, e) => {
      const i = document.createElement("button");
      i.type = "button", i.className = [
        "w-full",
        "border-b",
        "border-stone-100",
        "px-3",
        "py-2",
        "text-left",
        "transition-colors",
        e === this._highlightedIndex ? "bg-stone-100" : "bg-white hover:bg-stone-50"
      ].join(" "), i.setAttribute("aria-selected", e === this._highlightedIndex ? "true" : "false"), i.innerHTML = `
				<div class="min-w-0">
					<div class="truncate text-sm font-semibold text-slate-900">${this._escapeHtml(Qi(t))}</div>
				</div>
			`, i.addEventListener("click", () => this._selectItem(t)), this._addResults.appendChild(i);
    }), this._addResults.classList.remove("hidden");
  }
  _selectItem(t) {
    this._selectedItem = t, this._addInput.value = Qi(t), this._options = [], this._highlightedIndex = -1, this._renderResults(), this._updateConfirmState(), this._setError("");
  }
  _handleKeyDown(t) {
    if (t.key === "Escape") {
      t.preventDefault(), this._closeAddPanel();
      return;
    }
    if (t.key === "ArrowDown") {
      if (this._options.length === 0)
        return;
      t.preventDefault(), this._highlightedIndex = Math.min(this._highlightedIndex + 1, this._options.length - 1), this._renderResults();
      return;
    }
    if (t.key === "ArrowUp") {
      if (this._options.length === 0)
        return;
      t.preventDefault(), this._highlightedIndex = Math.max(this._highlightedIndex - 1, 0), this._renderResults();
      return;
    }
    if (t.key === "Enter") {
      if (t.preventDefault(), this._options.length > 0 && this._highlightedIndex >= 0) {
        this._selectItem(this._options[this._highlightedIndex]);
        return;
      }
      this._selectedItem?.id && this._confirmSelection();
    }
  }
  _confirmSelection() {
    if (!this._selectedItem?.id) {
      this._setError("Bitte eine bestehende Reihe auswählen.");
      return;
    }
    if (this._hasDuplicate(this._selectedItem.id)) {
      this._setError(this._duplicateError);
      return;
    }
    this._appendNewRow(this._selectedItem), this._closeAddPanel();
  }
  _hasDuplicate(t) {
    return Array.from(this.querySelectorAll(Xi)).some((e) => {
      if (e.dataset.kind === "new")
        return e.querySelector(`${Da}[name='${this._prefix}_new_id']`)?.value === t;
      const i = e.querySelector(`input[name^='${this._prefix}_series[']`), r = e.querySelector(Ra);
      return i?.value === t && !r?.checked;
    });
  }
  _appendNewRow(t) {
    const e = this._template.content.cloneNode(!0), i = e.querySelector(Xi) || e.firstElementChild;
    if (!i)
      return;
    i.dataset.kind = "new";
    const r = e.querySelector(Fu), s = t.musenalm_id || t.id;
    r && (s && (r.href = `${this._linkBase}${s}`), r.classList.toggle("pointer-events-none", !s));
    const a = e.querySelector(Pu);
    a && (a.textContent = Qi(t));
    const o = e.querySelector(Da);
    o && (o.name = `${this._prefix}_new_id`, o.value = t.id);
    const l = e.querySelector(Hu);
    l && (l.name = `${this._prefix}_new_annotation`, l.value = ""), this._tableBody.appendChild(e), this._bindRows(), this._syncUi();
  }
  _bindRows() {
    this.querySelectorAll(Xi).forEach((t) => {
      if (t.dataset.bound === "true")
        return;
      t.dataset.bound = "true";
      const e = t.querySelector(ka);
      e && e.addEventListener("click", () => this._handleDelete(t));
    });
  }
  _handleDelete(t) {
    if (t.dataset.kind === "new") {
      t.remove(), this._syncUi();
      return;
    }
    const e = t.querySelector(Ra);
    if (!e)
      return;
    e.checked = !e.checked;
    const i = e.checked;
    t.classList.toggle("bg-red-50", i), t.classList.toggle("opacity-70", i);
    const r = t.querySelector(ka);
    if (r) {
      const s = r.querySelector("i");
      s && (s.className = i ? "ri-arrow-go-back-line" : "ri-delete-bin-line"), r.setAttribute("aria-label", i ? "Rückgängig" : "Entfernen");
    }
  }
  _syncUi() {
    const t = this.querySelectorAll(Xi).length;
    this._emptyState?.classList.toggle("hidden", t > 0), this._sectionHeader?.classList.toggle("hidden", t === 0);
  }
  _updateConfirmState() {
    this._addConfirm.disabled = !this._selectedItem?.id, this._addConfirm.classList.toggle("opacity-50", !this._selectedItem?.id), this._addConfirm.classList.toggle("cursor-not-allowed", !this._selectedItem?.id);
  }
  _setError(t) {
    this._addError && (this._addError.textContent = t, this._addError.classList.toggle("hidden", !t));
  }
  _handleDocumentClick(t) {
    this.contains(t.target) || (this._options = [], this._highlightedIndex = -1, this._renderResults());
  }
  _escapeHtml(t) {
    return String(t).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
}
var vt = "top", Ot = "bottom", Mt = "right", yt = "left", zr = "auto", Pi = [vt, Ot, Mt, yt], ei = "start", Oi = "end", ju = "clippingParents", Wo = "viewport", bi = "popper", Vu = "reference", Ia = /* @__PURE__ */ Pi.reduce(function(n, t) {
  return n.concat([t + "-" + ei, t + "-" + Oi]);
}, []), zo = /* @__PURE__ */ [].concat(Pi, [zr]).reduce(function(n, t) {
  return n.concat([t, t + "-" + ei, t + "-" + Oi]);
}, []), Wu = "beforeRead", zu = "read", Ku = "afterRead", Gu = "beforeMain", Ju = "main", Yu = "afterMain", Xu = "beforeWrite", Qu = "write", Zu = "afterWrite", th = [Wu, zu, Ku, Gu, Ju, Yu, Xu, Qu, Zu];
function te(n) {
  return n ? (n.nodeName || "").toLowerCase() : null;
}
function xt(n) {
  if (n == null)
    return window;
  if (n.toString() !== "[object Window]") {
    var t = n.ownerDocument;
    return t && t.defaultView || window;
  }
  return n;
}
function $e(n) {
  var t = xt(n).Element;
  return n instanceof t || n instanceof Element;
}
function Dt(n) {
  var t = xt(n).HTMLElement;
  return n instanceof t || n instanceof HTMLElement;
}
function Kr(n) {
  if (typeof ShadowRoot > "u")
    return !1;
  var t = xt(n).ShadowRoot;
  return n instanceof t || n instanceof ShadowRoot;
}
function eh(n) {
  var t = n.state;
  Object.keys(t.elements).forEach(function(e) {
    var i = t.styles[e] || {}, r = t.attributes[e] || {}, s = t.elements[e];
    !Dt(s) || !te(s) || (Object.assign(s.style, i), Object.keys(r).forEach(function(a) {
      var o = r[a];
      o === !1 ? s.removeAttribute(a) : s.setAttribute(a, o === !0 ? "" : o);
    }));
  });
}
function ih(n) {
  var t = n.state, e = {
    popper: {
      position: t.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(t.elements.popper.style, e.popper), t.styles = e, t.elements.arrow && Object.assign(t.elements.arrow.style, e.arrow), function() {
    Object.keys(t.elements).forEach(function(i) {
      var r = t.elements[i], s = t.attributes[i] || {}, a = Object.keys(t.styles.hasOwnProperty(i) ? t.styles[i] : e[i]), o = a.reduce(function(l, c) {
        return l[c] = "", l;
      }, {});
      !Dt(r) || !te(r) || (Object.assign(r.style, o), Object.keys(s).forEach(function(l) {
        r.removeAttribute(l);
      }));
    });
  };
}
const Ko = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: eh,
  effect: ih,
  requires: ["computeStyles"]
};
function Zt(n) {
  return n.split("-")[0];
}
var Pe = Math.max, hn = Math.min, ii = Math.round;
function Rr() {
  var n = navigator.userAgentData;
  return n != null && n.brands && Array.isArray(n.brands) ? n.brands.map(function(t) {
    return t.brand + "/" + t.version;
  }).join(" ") : navigator.userAgent;
}
function Go() {
  return !/^((?!chrome|android).)*safari/i.test(Rr());
}
function ni(n, t, e) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  var i = n.getBoundingClientRect(), r = 1, s = 1;
  t && Dt(n) && (r = n.offsetWidth > 0 && ii(i.width) / n.offsetWidth || 1, s = n.offsetHeight > 0 && ii(i.height) / n.offsetHeight || 1);
  var a = $e(n) ? xt(n) : window, o = a.visualViewport, l = !Go() && e, c = (i.left + (l && o ? o.offsetLeft : 0)) / r, h = (i.top + (l && o ? o.offsetTop : 0)) / s, b = i.width / r, g = i.height / s;
  return {
    width: b,
    height: g,
    top: h,
    right: c + b,
    bottom: h + g,
    left: c,
    x: c,
    y: h
  };
}
function Gr(n) {
  var t = ni(n), e = n.offsetWidth, i = n.offsetHeight;
  return Math.abs(t.width - e) <= 1 && (e = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
    x: n.offsetLeft,
    y: n.offsetTop,
    width: e,
    height: i
  };
}
function Jo(n, t) {
  var e = t.getRootNode && t.getRootNode();
  if (n.contains(t))
    return !0;
  if (e && Kr(e)) {
    var i = t;
    do {
      if (i && n.isSameNode(i))
        return !0;
      i = i.parentNode || i.host;
    } while (i);
  }
  return !1;
}
function he(n) {
  return xt(n).getComputedStyle(n);
}
function nh(n) {
  return ["table", "td", "th"].indexOf(te(n)) >= 0;
}
function Se(n) {
  return (($e(n) ? n.ownerDocument : (
    // $FlowFixMe[prop-missing]
    n.document
  )) || window.document).documentElement;
}
function _n(n) {
  return te(n) === "html" ? n : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    n.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    n.parentNode || // DOM Element detected
    (Kr(n) ? n.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Se(n)
  );
}
function Oa(n) {
  return !Dt(n) || // https://github.com/popperjs/popper-core/issues/837
  he(n).position === "fixed" ? null : n.offsetParent;
}
function rh(n) {
  var t = /firefox/i.test(Rr()), e = /Trident/i.test(Rr());
  if (e && Dt(n)) {
    var i = he(n);
    if (i.position === "fixed")
      return null;
  }
  var r = _n(n);
  for (Kr(r) && (r = r.host); Dt(r) && ["html", "body"].indexOf(te(r)) < 0; ) {
    var s = he(r);
    if (s.transform !== "none" || s.perspective !== "none" || s.contain === "paint" || ["transform", "perspective"].indexOf(s.willChange) !== -1 || t && s.willChange === "filter" || t && s.filter && s.filter !== "none")
      return r;
    r = r.parentNode;
  }
  return null;
}
function Fi(n) {
  for (var t = xt(n), e = Oa(n); e && nh(e) && he(e).position === "static"; )
    e = Oa(e);
  return e && (te(e) === "html" || te(e) === "body" && he(e).position === "static") ? t : e || rh(n) || t;
}
function Jr(n) {
  return ["top", "bottom"].indexOf(n) >= 0 ? "x" : "y";
}
function Ti(n, t, e) {
  return Pe(n, hn(t, e));
}
function sh(n, t, e) {
  var i = Ti(n, t, e);
  return i > e ? e : i;
}
function Yo() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function Xo(n) {
  return Object.assign({}, Yo(), n);
}
function Qo(n, t) {
  return t.reduce(function(e, i) {
    return e[i] = n, e;
  }, {});
}
var ah = function(t, e) {
  return t = typeof t == "function" ? t(Object.assign({}, e.rects, {
    placement: e.placement
  })) : t, Xo(typeof t != "number" ? t : Qo(t, Pi));
};
function oh(n) {
  var t, e = n.state, i = n.name, r = n.options, s = e.elements.arrow, a = e.modifiersData.popperOffsets, o = Zt(e.placement), l = Jr(o), c = [yt, Mt].indexOf(o) >= 0, h = c ? "height" : "width";
  if (!(!s || !a)) {
    var b = ah(r.padding, e), g = Gr(s), p = l === "y" ? vt : yt, _ = l === "y" ? Ot : Mt, f = e.rects.reference[h] + e.rects.reference[l] - a[l] - e.rects.popper[h], A = a[l] - e.rects.reference[l], w = Fi(s), T = w ? l === "y" ? w.clientHeight || 0 : w.clientWidth || 0 : 0, C = f / 2 - A / 2, u = b[p], x = T - g[h] - b[_], v = T / 2 - g[h] / 2 + C, O = Ti(u, v, x), j = l;
    e.modifiersData[i] = (t = {}, t[j] = O, t.centerOffset = O - v, t);
  }
}
function lh(n) {
  var t = n.state, e = n.options, i = e.element, r = i === void 0 ? "[data-popper-arrow]" : i;
  r != null && (typeof r == "string" && (r = t.elements.popper.querySelector(r), !r) || Jo(t.elements.popper, r) && (t.elements.arrow = r));
}
const ch = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: oh,
  effect: lh,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function ri(n) {
  return n.split("-")[1];
}
var dh = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function uh(n, t) {
  var e = n.x, i = n.y, r = t.devicePixelRatio || 1;
  return {
    x: ii(e * r) / r || 0,
    y: ii(i * r) / r || 0
  };
}
function Ma(n) {
  var t, e = n.popper, i = n.popperRect, r = n.placement, s = n.variation, a = n.offsets, o = n.position, l = n.gpuAcceleration, c = n.adaptive, h = n.roundOffsets, b = n.isFixed, g = a.x, p = g === void 0 ? 0 : g, _ = a.y, f = _ === void 0 ? 0 : _, A = typeof h == "function" ? h({
    x: p,
    y: f
  }) : {
    x: p,
    y: f
  };
  p = A.x, f = A.y;
  var w = a.hasOwnProperty("x"), T = a.hasOwnProperty("y"), C = yt, u = vt, x = window;
  if (c) {
    var v = Fi(e), O = "clientHeight", j = "clientWidth";
    if (v === xt(e) && (v = Se(e), he(v).position !== "static" && o === "absolute" && (O = "scrollHeight", j = "scrollWidth")), v = v, r === vt || (r === yt || r === Mt) && s === Oi) {
      u = Ot;
      var z = b && v === x && x.visualViewport ? x.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        v[O]
      );
      f -= z - i.height, f *= l ? 1 : -1;
    }
    if (r === yt || (r === vt || r === Ot) && s === Oi) {
      C = Mt;
      var K = b && v === x && x.visualViewport ? x.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        v[j]
      );
      p -= K - i.width, p *= l ? 1 : -1;
    }
  }
  var X = Object.assign({
    position: o
  }, c && dh), D = h === !0 ? uh({
    x: p,
    y: f
  }, xt(e)) : {
    x: p,
    y: f
  };
  if (p = D.x, f = D.y, l) {
    var V;
    return Object.assign({}, X, (V = {}, V[u] = T ? "0" : "", V[C] = w ? "0" : "", V.transform = (x.devicePixelRatio || 1) <= 1 ? "translate(" + p + "px, " + f + "px)" : "translate3d(" + p + "px, " + f + "px, 0)", V));
  }
  return Object.assign({}, X, (t = {}, t[u] = T ? f + "px" : "", t[C] = w ? p + "px" : "", t.transform = "", t));
}
function hh(n) {
  var t = n.state, e = n.options, i = e.gpuAcceleration, r = i === void 0 ? !0 : i, s = e.adaptive, a = s === void 0 ? !0 : s, o = e.roundOffsets, l = o === void 0 ? !0 : o, c = {
    placement: Zt(t.placement),
    variation: ri(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: r,
    isFixed: t.options.strategy === "fixed"
  };
  t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, Ma(Object.assign({}, c, {
    offsets: t.modifiersData.popperOffsets,
    position: t.options.strategy,
    adaptive: a,
    roundOffsets: l
  })))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, Ma(Object.assign({}, c, {
    offsets: t.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: l
  })))), t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-placement": t.placement
  });
}
const mh = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: hh,
  data: {}
};
var Zi = {
  passive: !0
};
function ph(n) {
  var t = n.state, e = n.instance, i = n.options, r = i.scroll, s = r === void 0 ? !0 : r, a = i.resize, o = a === void 0 ? !0 : a, l = xt(t.elements.popper), c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return s && c.forEach(function(h) {
    h.addEventListener("scroll", e.update, Zi);
  }), o && l.addEventListener("resize", e.update, Zi), function() {
    s && c.forEach(function(h) {
      h.removeEventListener("scroll", e.update, Zi);
    }), o && l.removeEventListener("resize", e.update, Zi);
  };
}
const fh = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: ph,
  data: {}
};
var gh = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function an(n) {
  return n.replace(/left|right|bottom|top/g, function(t) {
    return gh[t];
  });
}
var bh = {
  start: "end",
  end: "start"
};
function Ba(n) {
  return n.replace(/start|end/g, function(t) {
    return bh[t];
  });
}
function Yr(n) {
  var t = xt(n), e = t.pageXOffset, i = t.pageYOffset;
  return {
    scrollLeft: e,
    scrollTop: i
  };
}
function Xr(n) {
  return ni(Se(n)).left + Yr(n).scrollLeft;
}
function vh(n, t) {
  var e = xt(n), i = Se(n), r = e.visualViewport, s = i.clientWidth, a = i.clientHeight, o = 0, l = 0;
  if (r) {
    s = r.width, a = r.height;
    var c = Go();
    (c || !c && t === "fixed") && (o = r.offsetLeft, l = r.offsetTop);
  }
  return {
    width: s,
    height: a,
    x: o + Xr(n),
    y: l
  };
}
function yh(n) {
  var t, e = Se(n), i = Yr(n), r = (t = n.ownerDocument) == null ? void 0 : t.body, s = Pe(e.scrollWidth, e.clientWidth, r ? r.scrollWidth : 0, r ? r.clientWidth : 0), a = Pe(e.scrollHeight, e.clientHeight, r ? r.scrollHeight : 0, r ? r.clientHeight : 0), o = -i.scrollLeft + Xr(n), l = -i.scrollTop;
  return he(r || e).direction === "rtl" && (o += Pe(e.clientWidth, r ? r.clientWidth : 0) - s), {
    width: s,
    height: a,
    x: o,
    y: l
  };
}
function Qr(n) {
  var t = he(n), e = t.overflow, i = t.overflowX, r = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(e + r + i);
}
function Zo(n) {
  return ["html", "body", "#document"].indexOf(te(n)) >= 0 ? n.ownerDocument.body : Dt(n) && Qr(n) ? n : Zo(_n(n));
}
function ki(n, t) {
  var e;
  t === void 0 && (t = []);
  var i = Zo(n), r = i === ((e = n.ownerDocument) == null ? void 0 : e.body), s = xt(i), a = r ? [s].concat(s.visualViewport || [], Qr(i) ? i : []) : i, o = t.concat(a);
  return r ? o : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    o.concat(ki(_n(a)))
  );
}
function Dr(n) {
  return Object.assign({}, n, {
    left: n.x,
    top: n.y,
    right: n.x + n.width,
    bottom: n.y + n.height
  });
}
function _h(n, t) {
  var e = ni(n, !1, t === "fixed");
  return e.top = e.top + n.clientTop, e.left = e.left + n.clientLeft, e.bottom = e.top + n.clientHeight, e.right = e.left + n.clientWidth, e.width = n.clientWidth, e.height = n.clientHeight, e.x = e.left, e.y = e.top, e;
}
function Na(n, t, e) {
  return t === Wo ? Dr(vh(n, e)) : $e(t) ? _h(t, e) : Dr(yh(Se(n)));
}
function Ah(n) {
  var t = ki(_n(n)), e = ["absolute", "fixed"].indexOf(he(n).position) >= 0, i = e && Dt(n) ? Fi(n) : n;
  return $e(i) ? t.filter(function(r) {
    return $e(r) && Jo(r, i) && te(r) !== "body";
  }) : [];
}
function Eh(n, t, e, i) {
  var r = t === "clippingParents" ? Ah(n) : [].concat(t), s = [].concat(r, [e]), a = s[0], o = s.reduce(function(l, c) {
    var h = Na(n, c, i);
    return l.top = Pe(h.top, l.top), l.right = hn(h.right, l.right), l.bottom = hn(h.bottom, l.bottom), l.left = Pe(h.left, l.left), l;
  }, Na(n, a, i));
  return o.width = o.right - o.left, o.height = o.bottom - o.top, o.x = o.left, o.y = o.top, o;
}
function tl(n) {
  var t = n.reference, e = n.element, i = n.placement, r = i ? Zt(i) : null, s = i ? ri(i) : null, a = t.x + t.width / 2 - e.width / 2, o = t.y + t.height / 2 - e.height / 2, l;
  switch (r) {
    case vt:
      l = {
        x: a,
        y: t.y - e.height
      };
      break;
    case Ot:
      l = {
        x: a,
        y: t.y + t.height
      };
      break;
    case Mt:
      l = {
        x: t.x + t.width,
        y: o
      };
      break;
    case yt:
      l = {
        x: t.x - e.width,
        y: o
      };
      break;
    default:
      l = {
        x: t.x,
        y: t.y
      };
  }
  var c = r ? Jr(r) : null;
  if (c != null) {
    var h = c === "y" ? "height" : "width";
    switch (s) {
      case ei:
        l[c] = l[c] - (t[h] / 2 - e[h] / 2);
        break;
      case Oi:
        l[c] = l[c] + (t[h] / 2 - e[h] / 2);
        break;
    }
  }
  return l;
}
function Mi(n, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, r = i === void 0 ? n.placement : i, s = e.strategy, a = s === void 0 ? n.strategy : s, o = e.boundary, l = o === void 0 ? ju : o, c = e.rootBoundary, h = c === void 0 ? Wo : c, b = e.elementContext, g = b === void 0 ? bi : b, p = e.altBoundary, _ = p === void 0 ? !1 : p, f = e.padding, A = f === void 0 ? 0 : f, w = Xo(typeof A != "number" ? A : Qo(A, Pi)), T = g === bi ? Vu : bi, C = n.rects.popper, u = n.elements[_ ? T : g], x = Eh($e(u) ? u : u.contextElement || Se(n.elements.popper), l, h, a), v = ni(n.elements.reference), O = tl({
    reference: v,
    element: C,
    placement: r
  }), j = Dr(Object.assign({}, C, O)), z = g === bi ? j : v, K = {
    top: x.top - z.top + w.top,
    bottom: z.bottom - x.bottom + w.bottom,
    left: x.left - z.left + w.left,
    right: z.right - x.right + w.right
  }, X = n.modifiersData.offset;
  if (g === bi && X) {
    var D = X[r];
    Object.keys(K).forEach(function(V) {
      var at = [Mt, Ot].indexOf(V) >= 0 ? 1 : -1, ot = [vt, Ot].indexOf(V) >= 0 ? "y" : "x";
      K[V] += D[ot] * at;
    });
  }
  return K;
}
function xh(n, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, r = e.boundary, s = e.rootBoundary, a = e.padding, o = e.flipVariations, l = e.allowedAutoPlacements, c = l === void 0 ? zo : l, h = ri(i), b = h ? o ? Ia : Ia.filter(function(_) {
    return ri(_) === h;
  }) : Pi, g = b.filter(function(_) {
    return c.indexOf(_) >= 0;
  });
  g.length === 0 && (g = b);
  var p = g.reduce(function(_, f) {
    return _[f] = Mi(n, {
      placement: f,
      boundary: r,
      rootBoundary: s,
      padding: a
    })[Zt(f)], _;
  }, {});
  return Object.keys(p).sort(function(_, f) {
    return p[_] - p[f];
  });
}
function Sh(n) {
  if (Zt(n) === zr)
    return [];
  var t = an(n);
  return [Ba(n), t, Ba(t)];
}
function Lh(n) {
  var t = n.state, e = n.options, i = n.name;
  if (!t.modifiersData[i]._skip) {
    for (var r = e.mainAxis, s = r === void 0 ? !0 : r, a = e.altAxis, o = a === void 0 ? !0 : a, l = e.fallbackPlacements, c = e.padding, h = e.boundary, b = e.rootBoundary, g = e.altBoundary, p = e.flipVariations, _ = p === void 0 ? !0 : p, f = e.allowedAutoPlacements, A = t.options.placement, w = Zt(A), T = w === A, C = l || (T || !_ ? [an(A)] : Sh(A)), u = [A].concat(C).reduce(function(W, gt) {
      return W.concat(Zt(gt) === zr ? xh(t, {
        placement: gt,
        boundary: h,
        rootBoundary: b,
        padding: c,
        flipVariations: _,
        allowedAutoPlacements: f
      }) : gt);
    }, []), x = t.rects.reference, v = t.rects.popper, O = /* @__PURE__ */ new Map(), j = !0, z = u[0], K = 0; K < u.length; K++) {
      var X = u[K], D = Zt(X), V = ri(X) === ei, at = [vt, Ot].indexOf(D) >= 0, ot = at ? "width" : "height", rt = Mi(t, {
        placement: X,
        boundary: h,
        rootBoundary: b,
        altBoundary: g,
        padding: c
      }), st = at ? V ? Mt : yt : V ? Ot : vt;
      x[ot] > v[ot] && (st = an(st));
      var it = an(st), _t = [];
      if (s && _t.push(rt[D] <= 0), o && _t.push(rt[st] <= 0, rt[it] <= 0), _t.every(function(W) {
        return W;
      })) {
        z = X, j = !1;
        break;
      }
      O.set(X, _t);
    }
    if (j)
      for (var St = _ ? 3 : 1, Gt = function(gt) {
        var q = u.find(function(Lt) {
          var At = O.get(Lt);
          if (At)
            return At.slice(0, gt).every(function(ee) {
              return ee;
            });
        });
        if (q)
          return z = q, "break";
      }, U = St; U > 0; U--) {
        var Jt = Gt(U);
        if (Jt === "break") break;
      }
    t.placement !== z && (t.modifiersData[i]._skip = !0, t.placement = z, t.reset = !0);
  }
}
const wh = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Lh,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function Pa(n, t, e) {
  return e === void 0 && (e = {
    x: 0,
    y: 0
  }), {
    top: n.top - t.height - e.y,
    right: n.right - t.width + e.x,
    bottom: n.bottom - t.height + e.y,
    left: n.left - t.width - e.x
  };
}
function Fa(n) {
  return [vt, Mt, Ot, yt].some(function(t) {
    return n[t] >= 0;
  });
}
function Ch(n) {
  var t = n.state, e = n.name, i = t.rects.reference, r = t.rects.popper, s = t.modifiersData.preventOverflow, a = Mi(t, {
    elementContext: "reference"
  }), o = Mi(t, {
    altBoundary: !0
  }), l = Pa(a, i), c = Pa(o, r, s), h = Fa(l), b = Fa(c);
  t.modifiersData[e] = {
    referenceClippingOffsets: l,
    popperEscapeOffsets: c,
    isReferenceHidden: h,
    hasPopperEscaped: b
  }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-reference-hidden": h,
    "data-popper-escaped": b
  });
}
const Th = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Ch
};
function kh(n, t, e) {
  var i = Zt(n), r = [yt, vt].indexOf(i) >= 0 ? -1 : 1, s = typeof e == "function" ? e(Object.assign({}, t, {
    placement: n
  })) : e, a = s[0], o = s[1];
  return a = a || 0, o = (o || 0) * r, [yt, Mt].indexOf(i) >= 0 ? {
    x: o,
    y: a
  } : {
    x: a,
    y: o
  };
}
function Rh(n) {
  var t = n.state, e = n.options, i = n.name, r = e.offset, s = r === void 0 ? [0, 0] : r, a = zo.reduce(function(h, b) {
    return h[b] = kh(b, t.rects, s), h;
  }, {}), o = a[t.placement], l = o.x, c = o.y;
  t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += c), t.modifiersData[i] = a;
}
const Dh = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: Rh
};
function Ih(n) {
  var t = n.state, e = n.name;
  t.modifiersData[e] = tl({
    reference: t.rects.reference,
    element: t.rects.popper,
    placement: t.placement
  });
}
const Oh = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Ih,
  data: {}
};
function Mh(n) {
  return n === "x" ? "y" : "x";
}
function Bh(n) {
  var t = n.state, e = n.options, i = n.name, r = e.mainAxis, s = r === void 0 ? !0 : r, a = e.altAxis, o = a === void 0 ? !1 : a, l = e.boundary, c = e.rootBoundary, h = e.altBoundary, b = e.padding, g = e.tether, p = g === void 0 ? !0 : g, _ = e.tetherOffset, f = _ === void 0 ? 0 : _, A = Mi(t, {
    boundary: l,
    rootBoundary: c,
    padding: b,
    altBoundary: h
  }), w = Zt(t.placement), T = ri(t.placement), C = !T, u = Jr(w), x = Mh(u), v = t.modifiersData.popperOffsets, O = t.rects.reference, j = t.rects.popper, z = typeof f == "function" ? f(Object.assign({}, t.rects, {
    placement: t.placement
  })) : f, K = typeof z == "number" ? {
    mainAxis: z,
    altAxis: z
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, z), X = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, D = {
    x: 0,
    y: 0
  };
  if (v) {
    if (s) {
      var V, at = u === "y" ? vt : yt, ot = u === "y" ? Ot : Mt, rt = u === "y" ? "height" : "width", st = v[u], it = st + A[at], _t = st - A[ot], St = p ? -j[rt] / 2 : 0, Gt = T === ei ? O[rt] : j[rt], U = T === ei ? -j[rt] : -O[rt], Jt = t.elements.arrow, W = p && Jt ? Gr(Jt) : {
        width: 0,
        height: 0
      }, gt = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : Yo(), q = gt[at], Lt = gt[ot], At = Ti(0, O[rt], W[rt]), ee = C ? O[rt] / 2 - St - At - q - K.mainAxis : Gt - At - q - K.mainAxis, wt = C ? -O[rt] / 2 + St + At + Lt + K.mainAxis : U + At + Lt + K.mainAxis, ie = t.elements.arrow && Fi(t.elements.arrow), Le = ie ? u === "y" ? ie.clientTop || 0 : ie.clientLeft || 0 : 0, Ct = (V = X?.[u]) != null ? V : 0, ne = st + ee - Ct - Le, Tt = st + wt - Ct, re = Ti(p ? hn(it, ne) : it, st, p ? Pe(_t, Tt) : _t);
      v[u] = re, D[u] = re - st;
    }
    if (o) {
      var se, Bt = u === "x" ? vt : yt, ae = u === "x" ? Ot : Mt, bt = v[x], Nt = x === "y" ? "height" : "width", me = bt + A[Bt], Pt = bt - A[ae], Ft = [vt, yt].indexOf(w) !== -1, qt = (se = X?.[x]) != null ? se : 0, Ht = Ft ? me : bt - O[Nt] - j[Nt] - qt + K.altAxis, we = Ft ? bt + O[Nt] + j[Nt] - qt - K.altAxis : Pt, Ce = p && Ft ? sh(Ht, bt, we) : Ti(p ? Ht : me, bt, p ? we : Pt);
      v[x] = Ce, D[x] = Ce - bt;
    }
    t.modifiersData[i] = D;
  }
}
const Nh = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Bh,
  requiresIfExists: ["offset"]
};
function Ph(n) {
  return {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  };
}
function Fh(n) {
  return n === xt(n) || !Dt(n) ? Yr(n) : Ph(n);
}
function qh(n) {
  var t = n.getBoundingClientRect(), e = ii(t.width) / n.offsetWidth || 1, i = ii(t.height) / n.offsetHeight || 1;
  return e !== 1 || i !== 1;
}
function Hh(n, t, e) {
  e === void 0 && (e = !1);
  var i = Dt(t), r = Dt(t) && qh(t), s = Se(t), a = ni(n, r, e), o = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = {
    x: 0,
    y: 0
  };
  return (i || !i && !e) && ((te(t) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Qr(s)) && (o = Fh(t)), Dt(t) ? (l = ni(t, !0), l.x += t.clientLeft, l.y += t.clientTop) : s && (l.x = Xr(s))), {
    x: a.left + o.scrollLeft - l.x,
    y: a.top + o.scrollTop - l.y,
    width: a.width,
    height: a.height
  };
}
function Uh(n) {
  var t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), i = [];
  n.forEach(function(s) {
    t.set(s.name, s);
  });
  function r(s) {
    e.add(s.name);
    var a = [].concat(s.requires || [], s.requiresIfExists || []);
    a.forEach(function(o) {
      if (!e.has(o)) {
        var l = t.get(o);
        l && r(l);
      }
    }), i.push(s);
  }
  return n.forEach(function(s) {
    e.has(s.name) || r(s);
  }), i;
}
function $h(n) {
  var t = Uh(n);
  return th.reduce(function(e, i) {
    return e.concat(t.filter(function(r) {
      return r.phase === i;
    }));
  }, []);
}
function jh(n) {
  var t;
  return function() {
    return t || (t = new Promise(function(e) {
      Promise.resolve().then(function() {
        t = void 0, e(n());
      });
    })), t;
  };
}
function Vh(n) {
  var t = n.reduce(function(e, i) {
    var r = e[i.name];
    return e[i.name] = r ? Object.assign({}, r, i, {
      options: Object.assign({}, r.options, i.options),
      data: Object.assign({}, r.data, i.data)
    }) : i, e;
  }, {});
  return Object.keys(t).map(function(e) {
    return t[e];
  });
}
var qa = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Ha() {
  for (var n = arguments.length, t = new Array(n), e = 0; e < n; e++)
    t[e] = arguments[e];
  return !t.some(function(i) {
    return !(i && typeof i.getBoundingClientRect == "function");
  });
}
function Wh(n) {
  n === void 0 && (n = {});
  var t = n, e = t.defaultModifiers, i = e === void 0 ? [] : e, r = t.defaultOptions, s = r === void 0 ? qa : r;
  return function(o, l, c) {
    c === void 0 && (c = s);
    var h = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, qa, s),
      modifiersData: {},
      elements: {
        reference: o,
        popper: l
      },
      attributes: {},
      styles: {}
    }, b = [], g = !1, p = {
      state: h,
      setOptions: function(w) {
        var T = typeof w == "function" ? w(h.options) : w;
        f(), h.options = Object.assign({}, s, h.options, T), h.scrollParents = {
          reference: $e(o) ? ki(o) : o.contextElement ? ki(o.contextElement) : [],
          popper: ki(l)
        };
        var C = $h(Vh([].concat(i, h.options.modifiers)));
        return h.orderedModifiers = C.filter(function(u) {
          return u.enabled;
        }), _(), p.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!g) {
          var w = h.elements, T = w.reference, C = w.popper;
          if (Ha(T, C)) {
            h.rects = {
              reference: Hh(T, Fi(C), h.options.strategy === "fixed"),
              popper: Gr(C)
            }, h.reset = !1, h.placement = h.options.placement, h.orderedModifiers.forEach(function(K) {
              return h.modifiersData[K.name] = Object.assign({}, K.data);
            });
            for (var u = 0; u < h.orderedModifiers.length; u++) {
              if (h.reset === !0) {
                h.reset = !1, u = -1;
                continue;
              }
              var x = h.orderedModifiers[u], v = x.fn, O = x.options, j = O === void 0 ? {} : O, z = x.name;
              typeof v == "function" && (h = v({
                state: h,
                options: j,
                name: z,
                instance: p
              }) || h);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: jh(function() {
        return new Promise(function(A) {
          p.forceUpdate(), A(h);
        });
      }),
      destroy: function() {
        f(), g = !0;
      }
    };
    if (!Ha(o, l))
      return p;
    p.setOptions(c).then(function(A) {
      !g && c.onFirstUpdate && c.onFirstUpdate(A);
    });
    function _() {
      h.orderedModifiers.forEach(function(A) {
        var w = A.name, T = A.options, C = T === void 0 ? {} : T, u = A.effect;
        if (typeof u == "function") {
          var x = u({
            state: h,
            name: w,
            instance: p,
            options: C
          }), v = function() {
          };
          b.push(x || v);
        }
      });
    }
    function f() {
      b.forEach(function(A) {
        return A();
      }), b = [];
    }
    return p;
  };
}
var zh = [fh, Oh, mh, Ko, Dh, wh, Nh, ch, Th], Kh = /* @__PURE__ */ Wh({
  defaultModifiers: zh
}), Gh = "tippy-box", el = "tippy-content", Jh = "tippy-backdrop", il = "tippy-arrow", nl = "tippy-svg-arrow", Ie = {
  passive: !0,
  capture: !0
}, rl = function() {
  return document.body;
};
function or(n, t, e) {
  if (Array.isArray(n)) {
    var i = n[t];
    return i ?? (Array.isArray(e) ? e[t] : e);
  }
  return n;
}
function Zr(n, t) {
  var e = {}.toString.call(n);
  return e.indexOf("[object") === 0 && e.indexOf(t + "]") > -1;
}
function sl(n, t) {
  return typeof n == "function" ? n.apply(void 0, t) : n;
}
function Ua(n, t) {
  if (t === 0)
    return n;
  var e;
  return function(i) {
    clearTimeout(e), e = setTimeout(function() {
      n(i);
    }, t);
  };
}
function Yh(n) {
  return n.split(/\s+/).filter(Boolean);
}
function Je(n) {
  return [].concat(n);
}
function $a(n, t) {
  n.indexOf(t) === -1 && n.push(t);
}
function Xh(n) {
  return n.filter(function(t, e) {
    return n.indexOf(t) === e;
  });
}
function Qh(n) {
  return n.split("-")[0];
}
function mn(n) {
  return [].slice.call(n);
}
function ja(n) {
  return Object.keys(n).reduce(function(t, e) {
    return n[e] !== void 0 && (t[e] = n[e]), t;
  }, {});
}
function Ri() {
  return document.createElement("div");
}
function An(n) {
  return ["Element", "Fragment"].some(function(t) {
    return Zr(n, t);
  });
}
function Zh(n) {
  return Zr(n, "NodeList");
}
function tm(n) {
  return Zr(n, "MouseEvent");
}
function em(n) {
  return !!(n && n._tippy && n._tippy.reference === n);
}
function im(n) {
  return An(n) ? [n] : Zh(n) ? mn(n) : Array.isArray(n) ? n : mn(document.querySelectorAll(n));
}
function lr(n, t) {
  n.forEach(function(e) {
    e && (e.style.transitionDuration = t + "ms");
  });
}
function Va(n, t) {
  n.forEach(function(e) {
    e && e.setAttribute("data-state", t);
  });
}
function nm(n) {
  var t, e = Je(n), i = e[0];
  return i != null && (t = i.ownerDocument) != null && t.body ? i.ownerDocument : document;
}
function rm(n, t) {
  var e = t.clientX, i = t.clientY;
  return n.every(function(r) {
    var s = r.popperRect, a = r.popperState, o = r.props, l = o.interactiveBorder, c = Qh(a.placement), h = a.modifiersData.offset;
    if (!h)
      return !0;
    var b = c === "bottom" ? h.top.y : 0, g = c === "top" ? h.bottom.y : 0, p = c === "right" ? h.left.x : 0, _ = c === "left" ? h.right.x : 0, f = s.top - i + b > l, A = i - s.bottom - g > l, w = s.left - e + p > l, T = e - s.right - _ > l;
    return f || A || w || T;
  });
}
function cr(n, t, e) {
  var i = t + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(r) {
    n[i](r, e);
  });
}
function Wa(n, t) {
  for (var e = t; e; ) {
    var i;
    if (n.contains(e))
      return !0;
    e = e.getRootNode == null || (i = e.getRootNode()) == null ? void 0 : i.host;
  }
  return !1;
}
var Xt = {
  isTouch: !1
}, za = 0;
function sm() {
  Xt.isTouch || (Xt.isTouch = !0, window.performance && document.addEventListener("mousemove", al));
}
function al() {
  var n = performance.now();
  n - za < 20 && (Xt.isTouch = !1, document.removeEventListener("mousemove", al)), za = n;
}
function am() {
  var n = document.activeElement;
  if (em(n)) {
    var t = n._tippy;
    n.blur && !t.state.isVisible && n.blur();
  }
}
function om() {
  document.addEventListener("touchstart", sm, Ie), window.addEventListener("blur", am);
}
var lm = typeof window < "u" && typeof document < "u", cm = lm ? (
  // @ts-ignore
  !!window.msCrypto
) : !1, dm = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, um = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, Kt = Object.assign({
  appendTo: rl,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: !0,
  ignoreAttributes: !1,
  interactive: !1,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function() {
  },
  onBeforeUpdate: function() {
  },
  onCreate: function() {
  },
  onDestroy: function() {
  },
  onHidden: function() {
  },
  onHide: function() {
  },
  onMount: function() {
  },
  onShow: function() {
  },
  onShown: function() {
  },
  onTrigger: function() {
  },
  onUntrigger: function() {
  },
  onClickOutside: function() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: !1,
  touch: !0,
  trigger: "mouseenter focus",
  triggerTarget: null
}, dm, um), hm = Object.keys(Kt), mm = function(t) {
  var e = Object.keys(t);
  e.forEach(function(i) {
    Kt[i] = t[i];
  });
};
function ol(n) {
  var t = n.plugins || [], e = t.reduce(function(i, r) {
    var s = r.name, a = r.defaultValue;
    if (s) {
      var o;
      i[s] = n[s] !== void 0 ? n[s] : (o = Kt[s]) != null ? o : a;
    }
    return i;
  }, {});
  return Object.assign({}, n, e);
}
function pm(n, t) {
  var e = t ? Object.keys(ol(Object.assign({}, Kt, {
    plugins: t
  }))) : hm, i = e.reduce(function(r, s) {
    var a = (n.getAttribute("data-tippy-" + s) || "").trim();
    if (!a)
      return r;
    if (s === "content")
      r[s] = a;
    else
      try {
        r[s] = JSON.parse(a);
      } catch {
        r[s] = a;
      }
    return r;
  }, {});
  return i;
}
function Ka(n, t) {
  var e = Object.assign({}, t, {
    content: sl(t.content, [n])
  }, t.ignoreAttributes ? {} : pm(n, t.plugins));
  return e.aria = Object.assign({}, Kt.aria, e.aria), e.aria = {
    expanded: e.aria.expanded === "auto" ? t.interactive : e.aria.expanded,
    content: e.aria.content === "auto" ? t.interactive ? null : "describedby" : e.aria.content
  }, e;
}
var fm = function() {
  return "innerHTML";
};
function Ir(n, t) {
  n[fm()] = t;
}
function Ga(n) {
  var t = Ri();
  return n === !0 ? t.className = il : (t.className = nl, An(n) ? t.appendChild(n) : Ir(t, n)), t;
}
function Ja(n, t) {
  An(t.content) ? (Ir(n, ""), n.appendChild(t.content)) : typeof t.content != "function" && (t.allowHTML ? Ir(n, t.content) : n.textContent = t.content);
}
function Or(n) {
  var t = n.firstElementChild, e = mn(t.children);
  return {
    box: t,
    content: e.find(function(i) {
      return i.classList.contains(el);
    }),
    arrow: e.find(function(i) {
      return i.classList.contains(il) || i.classList.contains(nl);
    }),
    backdrop: e.find(function(i) {
      return i.classList.contains(Jh);
    })
  };
}
function ll(n) {
  var t = Ri(), e = Ri();
  e.className = Gh, e.setAttribute("data-state", "hidden"), e.setAttribute("tabindex", "-1");
  var i = Ri();
  i.className = el, i.setAttribute("data-state", "hidden"), Ja(i, n.props), t.appendChild(e), e.appendChild(i), r(n.props, n.props);
  function r(s, a) {
    var o = Or(t), l = o.box, c = o.content, h = o.arrow;
    a.theme ? l.setAttribute("data-theme", a.theme) : l.removeAttribute("data-theme"), typeof a.animation == "string" ? l.setAttribute("data-animation", a.animation) : l.removeAttribute("data-animation"), a.inertia ? l.setAttribute("data-inertia", "") : l.removeAttribute("data-inertia"), l.style.maxWidth = typeof a.maxWidth == "number" ? a.maxWidth + "px" : a.maxWidth, a.role ? l.setAttribute("role", a.role) : l.removeAttribute("role"), (s.content !== a.content || s.allowHTML !== a.allowHTML) && Ja(c, n.props), a.arrow ? h ? s.arrow !== a.arrow && (l.removeChild(h), l.appendChild(Ga(a.arrow))) : l.appendChild(Ga(a.arrow)) : h && l.removeChild(h);
  }
  return {
    popper: t,
    onUpdate: r
  };
}
ll.$$tippy = !0;
var gm = 1, tn = [], dr = [];
function bm(n, t) {
  var e = Ka(n, Object.assign({}, Kt, ol(ja(t)))), i, r, s, a = !1, o = !1, l = !1, c = !1, h, b, g, p = [], _ = Ua(ne, e.interactiveDebounce), f, A = gm++, w = null, T = Xh(e.plugins), C = {
    // Is the instance currently enabled?
    isEnabled: !0,
    // Is the tippy currently showing and not transitioning out?
    isVisible: !1,
    // Has the instance been destroyed?
    isDestroyed: !1,
    // Is the tippy currently mounted to the DOM?
    isMounted: !1,
    // Has the tippy finished transitioning in?
    isShown: !1
  }, u = {
    // properties
    id: A,
    reference: n,
    popper: Ri(),
    popperInstance: w,
    props: e,
    state: C,
    plugins: T,
    // methods
    clearDelayTimeouts: Ht,
    setProps: we,
    setContent: Ce,
    show: qi,
    hide: li,
    hideWithInteractivity: Hi,
    enable: Ft,
    disable: qt,
    unmount: ze,
    destroy: Ke
  };
  if (!e.render)
    return u;
  var x = e.render(u), v = x.popper, O = x.onUpdate;
  v.setAttribute("data-tippy-root", ""), v.id = "tippy-" + u.id, u.popper = v, n._tippy = u, v._tippy = u;
  var j = T.map(function(m) {
    return m.fn(u);
  }), z = n.hasAttribute("aria-expanded");
  return ie(), St(), st(), it("onCreate", [u]), e.showOnCreate && me(), v.addEventListener("mouseenter", function() {
    u.props.interactive && u.state.isVisible && u.clearDelayTimeouts();
  }), v.addEventListener("mouseleave", function() {
    u.props.interactive && u.props.trigger.indexOf("mouseenter") >= 0 && at().addEventListener("mousemove", _);
  }), u;
  function K() {
    var m = u.props.touch;
    return Array.isArray(m) ? m : [m, 0];
  }
  function X() {
    return K()[0] === "hold";
  }
  function D() {
    var m;
    return !!((m = u.props.render) != null && m.$$tippy);
  }
  function V() {
    return f || n;
  }
  function at() {
    var m = V().parentNode;
    return m ? nm(m) : document;
  }
  function ot() {
    return Or(v);
  }
  function rt(m) {
    return u.state.isMounted && !u.state.isVisible || Xt.isTouch || h && h.type === "focus" ? 0 : or(u.props.delay, m ? 0 : 1, Kt.delay);
  }
  function st(m) {
    m === void 0 && (m = !1), v.style.pointerEvents = u.props.interactive && !m ? "" : "none", v.style.zIndex = "" + u.props.zIndex;
  }
  function it(m, E, L) {
    if (L === void 0 && (L = !0), j.forEach(function(B) {
      B[m] && B[m].apply(B, E);
    }), L) {
      var F;
      (F = u.props)[m].apply(F, E);
    }
  }
  function _t() {
    var m = u.props.aria;
    if (m.content) {
      var E = "aria-" + m.content, L = v.id, F = Je(u.props.triggerTarget || n);
      F.forEach(function(B) {
        var tt = B.getAttribute(E);
        if (u.state.isVisible)
          B.setAttribute(E, tt ? tt + " " + L : L);
        else {
          var lt = tt && tt.replace(L, "").trim();
          lt ? B.setAttribute(E, lt) : B.removeAttribute(E);
        }
      });
    }
  }
  function St() {
    if (!(z || !u.props.aria.expanded)) {
      var m = Je(u.props.triggerTarget || n);
      m.forEach(function(E) {
        u.props.interactive ? E.setAttribute("aria-expanded", u.state.isVisible && E === V() ? "true" : "false") : E.removeAttribute("aria-expanded");
      });
    }
  }
  function Gt() {
    at().removeEventListener("mousemove", _), tn = tn.filter(function(m) {
      return m !== _;
    });
  }
  function U(m) {
    if (!(Xt.isTouch && (l || m.type === "mousedown"))) {
      var E = m.composedPath && m.composedPath()[0] || m.target;
      if (!(u.props.interactive && Wa(v, E))) {
        if (Je(u.props.triggerTarget || n).some(function(L) {
          return Wa(L, E);
        })) {
          if (Xt.isTouch || u.state.isVisible && u.props.trigger.indexOf("click") >= 0)
            return;
        } else
          it("onClickOutside", [u, m]);
        u.props.hideOnClick === !0 && (u.clearDelayTimeouts(), u.hide(), o = !0, setTimeout(function() {
          o = !1;
        }), u.state.isMounted || q());
      }
    }
  }
  function Jt() {
    l = !0;
  }
  function W() {
    l = !1;
  }
  function gt() {
    var m = at();
    m.addEventListener("mousedown", U, !0), m.addEventListener("touchend", U, Ie), m.addEventListener("touchstart", W, Ie), m.addEventListener("touchmove", Jt, Ie);
  }
  function q() {
    var m = at();
    m.removeEventListener("mousedown", U, !0), m.removeEventListener("touchend", U, Ie), m.removeEventListener("touchstart", W, Ie), m.removeEventListener("touchmove", Jt, Ie);
  }
  function Lt(m, E) {
    ee(m, function() {
      !u.state.isVisible && v.parentNode && v.parentNode.contains(v) && E();
    });
  }
  function At(m, E) {
    ee(m, E);
  }
  function ee(m, E) {
    var L = ot().box;
    function F(B) {
      B.target === L && (cr(L, "remove", F), E());
    }
    if (m === 0)
      return E();
    cr(L, "remove", b), cr(L, "add", F), b = F;
  }
  function wt(m, E, L) {
    L === void 0 && (L = !1);
    var F = Je(u.props.triggerTarget || n);
    F.forEach(function(B) {
      B.addEventListener(m, E, L), p.push({
        node: B,
        eventType: m,
        handler: E,
        options: L
      });
    });
  }
  function ie() {
    X() && (wt("touchstart", Ct, {
      passive: !0
    }), wt("touchend", Tt, {
      passive: !0
    })), Yh(u.props.trigger).forEach(function(m) {
      if (m !== "manual")
        switch (wt(m, Ct), m) {
          case "mouseenter":
            wt("mouseleave", Tt);
            break;
          case "focus":
            wt(cm ? "focusout" : "blur", re);
            break;
          case "focusin":
            wt("focusout", re);
            break;
        }
    });
  }
  function Le() {
    p.forEach(function(m) {
      var E = m.node, L = m.eventType, F = m.handler, B = m.options;
      E.removeEventListener(L, F, B);
    }), p = [];
  }
  function Ct(m) {
    var E, L = !1;
    if (!(!u.state.isEnabled || se(m) || o)) {
      var F = ((E = h) == null ? void 0 : E.type) === "focus";
      h = m, f = m.currentTarget, St(), !u.state.isVisible && tm(m) && tn.forEach(function(B) {
        return B(m);
      }), m.type === "click" && (u.props.trigger.indexOf("mouseenter") < 0 || a) && u.props.hideOnClick !== !1 && u.state.isVisible ? L = !0 : me(m), m.type === "click" && (a = !L), L && !F && Pt(m);
    }
  }
  function ne(m) {
    var E = m.target, L = V().contains(E) || v.contains(E);
    if (!(m.type === "mousemove" && L)) {
      var F = Nt().concat(v).map(function(B) {
        var tt, lt = B._tippy, pe = (tt = lt.popperInstance) == null ? void 0 : tt.state;
        return pe ? {
          popperRect: B.getBoundingClientRect(),
          popperState: pe,
          props: e
        } : null;
      }).filter(Boolean);
      rm(F, m) && (Gt(), Pt(m));
    }
  }
  function Tt(m) {
    var E = se(m) || u.props.trigger.indexOf("click") >= 0 && a;
    if (!E) {
      if (u.props.interactive) {
        u.hideWithInteractivity(m);
        return;
      }
      Pt(m);
    }
  }
  function re(m) {
    u.props.trigger.indexOf("focusin") < 0 && m.target !== V() || u.props.interactive && m.relatedTarget && v.contains(m.relatedTarget) || Pt(m);
  }
  function se(m) {
    return Xt.isTouch ? X() !== m.type.indexOf("touch") >= 0 : !1;
  }
  function Bt() {
    ae();
    var m = u.props, E = m.popperOptions, L = m.placement, F = m.offset, B = m.getReferenceClientRect, tt = m.moveTransition, lt = D() ? Or(v).arrow : null, pe = B ? {
      getBoundingClientRect: B,
      contextElement: B.contextElement || V()
    } : n, fe = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Ut) {
        var ge = Ut.state;
        if (D()) {
          var Ui = ot(), Te = Ui.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(ke) {
            ke === "placement" ? Te.setAttribute("data-placement", ge.placement) : ge.attributes.popper["data-popper-" + ke] ? Te.setAttribute("data-" + ke, "") : Te.removeAttribute("data-" + ke);
          }), ge.attributes.popper = {};
        }
      }
    }, oe = [{
      name: "offset",
      options: {
        offset: F
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !tt
      }
    }, fe];
    D() && lt && oe.push({
      name: "arrow",
      options: {
        element: lt,
        padding: 3
      }
    }), oe.push.apply(oe, E?.modifiers || []), u.popperInstance = Kh(pe, v, Object.assign({}, E, {
      placement: L,
      onFirstUpdate: g,
      modifiers: oe
    }));
  }
  function ae() {
    u.popperInstance && (u.popperInstance.destroy(), u.popperInstance = null);
  }
  function bt() {
    var m = u.props.appendTo, E, L = V();
    u.props.interactive && m === rl || m === "parent" ? E = L.parentNode : E = sl(m, [L]), E.contains(v) || E.appendChild(v), u.state.isMounted = !0, Bt();
  }
  function Nt() {
    return mn(v.querySelectorAll("[data-tippy-root]"));
  }
  function me(m) {
    u.clearDelayTimeouts(), m && it("onTrigger", [u, m]), gt();
    var E = rt(!0), L = K(), F = L[0], B = L[1];
    Xt.isTouch && F === "hold" && B && (E = B), E ? i = setTimeout(function() {
      u.show();
    }, E) : u.show();
  }
  function Pt(m) {
    if (u.clearDelayTimeouts(), it("onUntrigger", [u, m]), !u.state.isVisible) {
      q();
      return;
    }
    if (!(u.props.trigger.indexOf("mouseenter") >= 0 && u.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(m.type) >= 0 && a)) {
      var E = rt(!1);
      E ? r = setTimeout(function() {
        u.state.isVisible && u.hide();
      }, E) : s = requestAnimationFrame(function() {
        u.hide();
      });
    }
  }
  function Ft() {
    u.state.isEnabled = !0;
  }
  function qt() {
    u.hide(), u.state.isEnabled = !1;
  }
  function Ht() {
    clearTimeout(i), clearTimeout(r), cancelAnimationFrame(s);
  }
  function we(m) {
    if (!u.state.isDestroyed) {
      it("onBeforeUpdate", [u, m]), Le();
      var E = u.props, L = Ka(n, Object.assign({}, E, ja(m), {
        ignoreAttributes: !0
      }));
      u.props = L, ie(), E.interactiveDebounce !== L.interactiveDebounce && (Gt(), _ = Ua(ne, L.interactiveDebounce)), E.triggerTarget && !L.triggerTarget ? Je(E.triggerTarget).forEach(function(F) {
        F.removeAttribute("aria-expanded");
      }) : L.triggerTarget && n.removeAttribute("aria-expanded"), St(), st(), O && O(E, L), u.popperInstance && (Bt(), Nt().forEach(function(F) {
        requestAnimationFrame(F._tippy.popperInstance.forceUpdate);
      })), it("onAfterUpdate", [u, m]);
    }
  }
  function Ce(m) {
    u.setProps({
      content: m
    });
  }
  function qi() {
    var m = u.state.isVisible, E = u.state.isDestroyed, L = !u.state.isEnabled, F = Xt.isTouch && !u.props.touch, B = or(u.props.duration, 0, Kt.duration);
    if (!(m || E || L || F) && !V().hasAttribute("disabled") && (it("onShow", [u], !1), u.props.onShow(u) !== !1)) {
      if (u.state.isVisible = !0, D() && (v.style.visibility = "visible"), st(), gt(), u.state.isMounted || (v.style.transition = "none"), D()) {
        var tt = ot(), lt = tt.box, pe = tt.content;
        lr([lt, pe], 0);
      }
      g = function() {
        var oe;
        if (!(!u.state.isVisible || c)) {
          if (c = !0, v.offsetHeight, v.style.transition = u.props.moveTransition, D() && u.props.animation) {
            var Y = ot(), Ut = Y.box, ge = Y.content;
            lr([Ut, ge], B), Va([Ut, ge], "visible");
          }
          _t(), St(), $a(dr, u), (oe = u.popperInstance) == null || oe.forceUpdate(), it("onMount", [u]), u.props.animation && D() && At(B, function() {
            u.state.isShown = !0, it("onShown", [u]);
          });
        }
      }, bt();
    }
  }
  function li() {
    var m = !u.state.isVisible, E = u.state.isDestroyed, L = !u.state.isEnabled, F = or(u.props.duration, 1, Kt.duration);
    if (!(m || E || L) && (it("onHide", [u], !1), u.props.onHide(u) !== !1)) {
      if (u.state.isVisible = !1, u.state.isShown = !1, c = !1, a = !1, D() && (v.style.visibility = "hidden"), Gt(), q(), st(!0), D()) {
        var B = ot(), tt = B.box, lt = B.content;
        u.props.animation && (lr([tt, lt], F), Va([tt, lt], "hidden"));
      }
      _t(), St(), u.props.animation ? D() && Lt(F, u.unmount) : u.unmount();
    }
  }
  function Hi(m) {
    at().addEventListener("mousemove", _), $a(tn, _), _(m);
  }
  function ze() {
    u.state.isVisible && u.hide(), u.state.isMounted && (ae(), Nt().forEach(function(m) {
      m._tippy.unmount();
    }), v.parentNode && v.parentNode.removeChild(v), dr = dr.filter(function(m) {
      return m !== u;
    }), u.state.isMounted = !1, it("onHidden", [u]));
  }
  function Ke() {
    u.state.isDestroyed || (u.clearDelayTimeouts(), u.unmount(), Le(), delete n._tippy, u.state.isDestroyed = !0, it("onDestroy", [u]));
  }
}
function oi(n, t) {
  t === void 0 && (t = {});
  var e = Kt.plugins.concat(t.plugins || []);
  om();
  var i = Object.assign({}, t, {
    plugins: e
  }), r = im(n), s = r.reduce(function(a, o) {
    var l = o && bm(o, i);
    return l && a.push(l), a;
  }, []);
  return An(n) ? s[0] : s;
}
oi.defaultProps = Kt;
oi.setDefaultProps = mm;
oi.currentInput = Xt;
Object.assign({}, Ko, {
  effect: function(t) {
    var e = t.state, i = {
      popper: {
        position: e.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(e.elements.popper.style, i.popper), e.styles = i, e.elements.arrow && Object.assign(e.elements.arrow.style, i.arrow);
  }
});
oi.setDefaultProps({
  render: ll
});
function vm(n = document) {
  n.querySelectorAll("[data-role='cancel-link']").forEach((e) => {
    if (e.dataset.cancelBound === "true")
      return;
    e.dataset.cancelBound = "true";
    const i = (e.getAttribute("data-cancel-url") || "").trim();
    if (i) {
      e.setAttribute("href", i);
      return;
    }
    e.addEventListener("click", (r) => {
      (e.getAttribute("data-cancel-url") || "").trim() || (r.preventDefault(), window.history.length > 1 && window.history.back());
    });
  });
}
const ym = ["ri-checkbox-circle-line", "ri-information-line", "ri-search-line", "ri-list-check", "ri-forbid-2-line"];
function ts(n = null) {
  document.querySelectorAll("[data-role='content-status-picker']").forEach((t) => {
    n && t === n || t.querySelector("[data-role='content-status-menu']")?.classList.add("hidden");
  });
}
function ur(n, t) {
  if (!(n instanceof HTMLElement))
    return;
  const e = n.querySelector("[data-role='content-status-toggle']");
  if (!(e instanceof HTMLButtonElement))
    return;
  const i = n.querySelector(`[data-role='content-status-option'][data-status='${t}']`), r = e.querySelector("i"), s = i?.dataset.label || "", a = i?.dataset.icon || "ri-forbid-2-line";
  e.dataset.status = t, s && (e.setAttribute("aria-label", `Status: ${s}`), e.setAttribute("title", `Status: ${s}`)), r && (r.classList.remove(...ym), r.classList.add(a));
}
function _m(n, t) {
  !(n instanceof HTMLElement) || !t || (n.dataset.lastEdited = t, n.querySelectorAll("[data-last-edited], [data-place-updated]").forEach((e) => {
    e.hasAttribute("data-last-edited") && e.setAttribute("data-last-edited", t), e.hasAttribute("data-place-updated") && e.setAttribute("data-place-updated", t);
  }));
}
function cl(n = document) {
  (n instanceof HTMLElement || n instanceof Document ? n : document).querySelectorAll("[data-role='content-status-picker'][data-status-endpoint]").forEach((e) => {
    if (!(e instanceof HTMLElement) || e.dataset.statusBound === "true")
      return;
    e.dataset.statusBound = "true";
    const i = e.querySelector("[data-role='content-status-toggle']"), r = e.querySelector("[data-role='content-status-menu']"), s = (e.dataset.statusEndpoint || "").trim();
    !(i instanceof HTMLButtonElement) || !(r instanceof HTMLElement) || !s || (i.addEventListener("click", (a) => {
      a.preventDefault(), a.stopPropagation();
      const o = r.classList.contains("hidden");
      ts(o ? e : null), r.classList.toggle("hidden", !o);
    }), e.querySelectorAll("[data-role='content-status-option']").forEach((a) => {
      a instanceof HTMLButtonElement && a.addEventListener("click", async (o) => {
        o.preventDefault(), o.stopPropagation();
        const l = (a.dataset.status || "").trim(), c = (e.dataset.statusCsrfToken || document.querySelector("[data-role='global-csrf-token']")?.value || "").trim();
        if (!l || !c) {
          r.classList.add("hidden");
          return;
        }
        const h = i.dataset.status || "Unknown";
        ur(e, l), gr(e, l), mr(e, l), hr(e, l), fr(e, l), pr(e, l), r.classList.add("hidden"), i.disabled = !0, i.classList.add("opacity-70", "pointer-events-none");
        try {
          const b = await fetch(s, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              csrf_token: c,
              status: l
            })
          }), g = await b.json().catch(() => null);
          if (!b.ok || !g?.success)
            throw new Error(g?.error || "status update failed");
          if (g.status && (ur(e, g.status), gr(e, g.status), mr(e, g.status), hr(e, g.status), fr(e, g.status), pr(e, g.status)), g.last_edited) {
            const p = e.closest("tr, [data-role='reihen-row'], [data-role='content-item']");
            p instanceof HTMLElement && _m(p, g.last_edited);
          }
        } catch (b) {
          ur(e, h), gr(e, h), mr(e, h), hr(e, h), fr(e, h), pr(e, h), console.error(b);
        } finally {
          i.disabled = !1, i.classList.remove("opacity-70", "pointer-events-none");
        }
      });
    }));
  });
}
function hr(n, t) {
  const e = n.closest("[data-role='beitraege-row']");
  if (!e) return;
  const i = e.querySelector("[data-content-musenalm-id]");
  if (!i) return;
  const r = i.dataset.contentMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/beitrag/${r}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/beitrag/${r}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function mr(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-place-musenalm-id]");
  if (!i) return;
  const r = i.dataset.placeMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/reihen/?place=${r}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/reihen/?place=${r}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function pr(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-series-musenalm-id]");
  if (!i) return;
  const r = i.dataset.seriesMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/reihe/${r}/" onclick="event.stopPropagation();" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/reihe/${r}/" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function fr(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-entry-musenalm-id]");
  if (!i) return;
  const r = i.dataset.entryMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/almanach/${r}" onclick="event.stopPropagation();" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/almanach/${r}" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function gr(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-person-musenalm-id]");
  if (!i) return;
  const r = i.dataset.personMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/person/${r}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/person/${r}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function Am() {
  const n = window.location.hash;
  if (!n)
    return;
  const t = document.getElementById(n.slice(1));
  t && t.setAttribute("aria-current", "location");
}
function es() {
  document.querySelectorAll("[data-admin-main-link]").forEach((n) => {
    n.getAttribute("aria-current") !== "page" && n.querySelectorAll(".admin-sidebar-link-detail").forEach((t) => t.remove());
  });
}
const pn = [
  "#admin-sidebar .admin-sidebar-link",
  "#admin-sidebar .admin-sidebar-toggle",
  "#admin-sidebar .admin-sidebar-collapsed-public-trigger",
  "#admin-sidebar .admin-sidebar-collapsed-create-trigger",
  "#admin-sidebar .admin-sidebar-account-icon"
].join(", ");
function en(n) {
  if (!(n instanceof HTMLElement))
    return "";
  const t = (n.getAttribute("data-admin-sidebar-tooltip") || "").trim();
  if (t)
    return t;
  const e = (n.getAttribute("title") || "").trim();
  return e || (n.getAttribute("aria-label") || "").trim();
}
function Em(n = document) {
  const t = n instanceof Element ? n : document, e = [];
  n instanceof Element && n.matches(pn) && e.push(n), e.push(...t.querySelectorAll(pn)), e.forEach((i) => {
    i._tippy && i._tippy.destroy();
  });
}
function dl(n = document) {
  const t = document.getElementById("admin-sidebar");
  if (!t)
    return;
  if (!document.documentElement.classList.contains("admin-layout-sidebar-collapsed")) {
    Em(t);
    return;
  }
  const i = n instanceof Element ? n : t, r = [];
  n instanceof Element && n.matches(pn) && !n._tippy && en(n) && r.push(n), i.querySelectorAll(pn).forEach((s) => {
    s._tippy || !en(s) || r.push(s);
  }), r.length && oi(r, {
    placement: "right",
    arrow: !0,
    delay: [0, 0],
    duration: [100, 80],
    content(s) {
      return en(s);
    },
    onShow(s) {
      s.setContent(en(s.reference));
    }
  });
}
function xm(n, t) {
  if (!(n instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof t != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const e = n.querySelectorAll("reset-button");
  n.addEventListener("rbichange", (i) => {
    for (const r of e)
      if (r.isCurrentlyModified()) {
        t(i.details, !0);
        return;
      }
    t(i.details, !1);
  });
}
let vi = null;
function ul() {
  return vi !== null || (typeof CSS < "u" && typeof CSS.supports == "function" ? vi = CSS.supports("field-sizing", "content") : vi = !1), vi;
}
function Sm(n, t) {
  const e = t.lineHeight;
  if (e && e !== "normal") {
    const a = parseFloat(e);
    if (!Number.isNaN(a))
      return a;
  }
  const i = parseFloat(t.fontSize) || 16;
  if (!document.body)
    return i * 1.2;
  const r = document.createElement("span");
  r.textContent = "M", r.style.position = "absolute", r.style.visibility = "hidden", r.style.whiteSpace = "pre", r.style.padding = "0", r.style.margin = "0", r.style.border = "0", r.style.fontFamily = t.fontFamily, r.style.fontSize = t.fontSize, r.style.fontWeight = t.fontWeight, r.style.fontStyle = t.fontStyle, r.style.letterSpacing = t.letterSpacing, r.style.lineHeight = "normal", document.body.appendChild(r);
  const s = r.getBoundingClientRect().height;
  return r.remove(), s || i * 1.2;
}
function Fe(n) {
  if (!(n instanceof HTMLTextAreaElement) || n.dataset.noAutoresize === "true" || n.classList.contains("no-autoresize") || n.offsetParent === null)
    return;
  n.removeAttribute("rows"), n.style.overflow = "auto";
  const t = n.name === "annotation", e = getComputedStyle(n), i = t ? 2 : 1, r = Sm(n, e), s = parseFloat(e.paddingTop) + parseFloat(e.paddingBottom), a = parseFloat(e.borderTopWidth) + parseFloat(e.borderBottomWidth), o = r * i + s, l = e.boxSizing === "border-box" ? o + a : o;
  if (n.value.trim() === "") {
    n.style.height = l + "px";
    return;
  }
  n.style.height = "1px";
  const c = n.scrollHeight, h = e.boxSizing === "border-box" ? c + a : c;
  n.style.height = Math.max(h, l) + "px";
}
function hl(n) {
  n.key === "Enter" && n.preventDefault();
}
function Lm(n) {
  n instanceof HTMLTextAreaElement && (n.dataset.noAutoresize === "true" || n.classList.contains("no-autoresize") || ul() || n.addEventListener("input", () => {
    Fe(n);
  }));
}
function wm(n) {
  n instanceof HTMLTextAreaElement && n.removeEventListener("input", () => {
    Fe(n);
  });
}
function Cm(n) {
  !(n instanceof HTMLTextAreaElement) && n.classList.contains("no-enter") || n.addEventListener("keydown", hl);
}
function Tm(n) {
  !(n instanceof HTMLTextAreaElement) && n.classList.contains("no-enter") || n.removeEventListener("keydown", hl);
}
function km(n) {
  const t = !ul();
  for (const e of n)
    if (e.type === "childList") {
      for (const i of e.addedNodes)
        i.nodeType === Node.ELEMENT_NODE && i.matches("textarea") && t && (Lm(i), Fe(i));
      for (const i of e.removedNodes)
        i.nodeType === Node.ELEMENT_NODE && i.matches("textarea") && (Tm(i), t && wm(i));
    }
}
function Rm(n) {
  if (!(n instanceof HTMLFormElement))
    return;
  const t = document.querySelectorAll("textarea");
  for (const a of t)
    a.dataset.noAutoresize === "true" || a.classList.contains("no-autoresize") || a.addEventListener("input", function() {
      Fe(this);
    });
  setTimeout(() => {
    for (const a of t)
      a.dataset.noAutoresize === "true" || a.classList.contains("no-autoresize") || Fe(a);
  }, 200);
  const e = document.querySelectorAll("textarea.no-enter");
  for (const a of e)
    Cm(a);
  new MutationObserver(km).observe(n, {
    childList: !0,
    subtree: !0
  }), new MutationObserver((a) => {
    for (const o of a)
      if (o.type === "attributes" && o.attributeName === "class") {
        const l = o.target;
        if (l instanceof HTMLElement) {
          const c = l.matches("textarea") ? [l] : Array.from(l.querySelectorAll("textarea"));
          for (const h of c)
            h.dataset.noAutoresize === "true" || h.classList.contains("no-autoresize") || h.offsetParent !== null && Fe(h);
        }
      }
  }).observe(n, {
    attributes: !0,
    attributeFilter: ["class"],
    subtree: !0
  }), n.querySelectorAll('input[type="checkbox"][data-boolean-checkbox]').forEach((a) => {
    a.value = "true";
    const o = () => {
      const l = n.querySelector(`input[type="hidden"][name="${a.name}"]`);
      if (l && l.remove(), !a.checked) {
        const c = document.createElement("input");
        c.type = "hidden", c.name = a.name, c.value = "false", a.parentNode.insertBefore(c, a);
      }
    };
    o(), a.addEventListener("change", o);
  });
}
const Ya = "[data-tippy-content]";
function Dm(n = document) {
  const t = n instanceof Element ? n : document, e = Array.from(t.querySelectorAll(Ya)).filter((i) => !i._tippy);
  n instanceof Element && n.matches(Ya) && !n._tippy && e.unshift(n), e.length && oi(e, {
    // Default placement; overridden per element via data-tippy-placement
    placement: "right",
    arrow: !0,
    // Short delay so it doesn't flash on quick mouse-overs;
    // hides quickly so it doesn't block interactions
    delay: [400, 100],
    duration: [150, 100]
  });
}
function Im(n = () => {
}) {
  if (!window.htmx)
    return;
  const t = () => {
    let f = document.getElementById("global-notice");
    return f || (f = document.createElement("div"), f.id = "global-notice", f.className = "global-notice hidden", f.setAttribute("role", "status"), f.setAttribute("aria-live", "polite"), f.setAttribute("aria-atomic", "true"), f.dataset.state = "", f.innerHTML = `
				<div class="global-notice-inner">
					<i class="ri-loader-4-line spinning" aria-hidden="true"></i>
					<span data-role="global-notice-text">Lädt</span>
				</div>
			`, document.body?.appendChild(f)), f;
  };
  let e = t(), i = e ? e.querySelector("[data-role='global-notice-text']") : null, r = 0, s = null, a = null;
  const o = (f, A) => {
    e = t(), e && !i && (i = e.querySelector("[data-role='global-notice-text']")), i && A && (i.textContent = A), e && f ? e.dataset.state = f : e && e.removeAttribute("data-state");
  }, l = (f, A) => {
    e = t(), e && (o(f, A), e.classList.remove("hidden"));
  }, c = () => {
    e = t(), e && (e.classList.add("hidden"), e.removeAttribute("data-state"));
  }, h = (f) => {
    const A = document.documentElement;
    f ? (A?.setAttribute && (A.dataset.htmxBusy = "true"), document.body && (document.body.dataset.htmxBusy = "true")) : (A && delete A.dataset.htmxBusy, document.body && delete document.body.dataset.htmxBusy);
  }, b = (f, A) => {
    !f || !(f instanceof HTMLElement) || (A ? (f.dataset.htmxBusy = "true", f.setAttribute("aria-busy", "true"), f instanceof HTMLButtonElement && !f.disabled && (f.dataset.htmxDisabled = "true", f.disabled = !0)) : f.dataset.htmxBusy === "true" && (delete f.dataset.htmxBusy, f.removeAttribute("aria-busy"), f instanceof HTMLButtonElement && f.dataset.htmxDisabled === "true" && (f.disabled = !1, delete f.dataset.htmxDisabled)));
  }, g = () => {
    s && (clearTimeout(s), s = null);
  }, p = () => {
    a && (clearTimeout(a), a = null);
  }, _ = () => {
    r = 0, h(!1), delete document.documentElement.dataset.htmxBusy, document.querySelectorAll("[data-htmx-busy]").forEach((f) => {
      delete f.dataset.htmxBusy, f.removeAttribute("aria-busy");
    }), document.querySelectorAll("[data-htmx-disabled='true']").forEach((f) => {
      f instanceof HTMLButtonElement && (f.disabled = !1), delete f.dataset.htmxDisabled;
    }), p(), g(), c();
  };
  document.addEventListener("htmx:beforeRequest", (f) => {
    r += 1, g(), p(), h(!0), l("loading", "Lädt"), b(f.detail?.elt, !0);
  }), document.addEventListener("htmx:afterRequest", (f) => {
    b(f.detail?.elt, !1), r = Math.max(0, r - 1), r === 0 && (h(!1), e.dataset.state !== "error" && (p(), a = setTimeout(() => {
      a = null, r === 0 && e.dataset.state !== "error" && c();
    }, 250)));
  }), document.addEventListener("htmx:responseError", () => {
    h(!1), l("error", "Laden fehlgeschlagen."), g(), p(), s = setTimeout(() => {
      r === 0 ? c() : l("loading", "Lädt");
    }, 2e3);
  }), document.addEventListener("htmx:sendError", () => {
    h(!1), l("error", "Verbindung fehlgeschlagen."), g(), p(), s = setTimeout(() => {
      r === 0 ? c() : l("loading", "Lädt");
    }, 2e3);
  }), document.addEventListener("htmx:afterSwap", () => {
    e = t(), e && !i && (i = e.querySelector("[data-role='global-notice-text']"));
  }), window.addEventListener("pageshow", () => {
    _(), n();
  });
}
function Mr() {
  if (Mr._initialized)
    return;
  Mr._initialized = !0;
  const n = () => {
    const t = document.querySelectorAll(".form-action-bar");
    if (!t.length) return;
    const e = window.innerHeight || document.documentElement.clientHeight;
    t.forEach((i) => {
      const r = i.getBoundingClientRect();
      i.classList.toggle("is-stuck", r.bottom >= e - 1);
    });
  };
  n(), window.addEventListener("scroll", n, { passive: !0 }), window.addEventListener("resize", n), document.addEventListener("htmx:afterSwap", n);
}
function Om() {
  const t = (s) => {
    !s || s.classList.contains("hidden") || s.classList.contains("is-hidden") || (requestAnimationFrame(() => {
      s.classList.add("is-hiding");
    }), setTimeout(() => {
      s.classList.add("is-hidden"), s.classList.remove("is-hiding"), delete s.dataset.autohideScheduled;
    }, 320));
  }, e = (s) => {
    s.dataset.autohideScheduled !== "true" && (s.dataset.autohideScheduled = "true", setTimeout(() => t(s), 2e3));
  }, i = (s) => {
    const a = s || document;
    a !== document && a.matches?.("[data-autohide='true']") && e(a), a.querySelectorAll("[data-autohide='true']").forEach(e);
  };
  i(document), document.addEventListener("htmx:afterSwap", (s) => {
    i(s.target);
  }), new MutationObserver((s) => {
    for (const a of s)
      for (const o of a.addedNodes)
        o.nodeType === Node.ELEMENT_NODE && i(o);
  }).observe(document.body, { childList: !0, subtree: !0 });
}
document.addEventListener("trix-file-accept", (n) => {
  n.preventDefault();
});
const Mm = [
  ["int-link", Ad],
  ["abbrev-tooltips", Ci],
  ["filter-list", bd],
  ["scroll-button", vd],
  ["popup-image", yd],
  ["tab-list", _d],
  ["filter-pill", pd],
  ["image-reel", Ed],
  ["multi-select-simple", Nd],
  ["reset-button", qd],
  ["div-manager", jd],
  ["items-editor", Xd],
  ["almanach-edit-page", Qd],
  ["edit-page", Zd],
  ["duplicate-warning-checker", eu],
  ["content-images", au],
  ["lookup-field", cu],
  ["export-manager", du],
  ["content-type-select", uu],
  ["content-person-relations", Cu],
  ["content-series-relations", $u]
];
window.lookupSeriesValue = ({ item: n }) => n?.id || "";
window.lookupSeriesLink = ({ item: n }) => n?.musenalm_id ? `/reihe/${n.musenalm_id}` : "";
window.lookupRequiredText = ({ displayValue: n }) => !!(n || "").trim();
window.lookupRequiredId = ({ hiddenValue: n }) => !!(n || "").trim();
for (const [n, t] of Mm)
  customElements.get(n) || customElements.define(n, t);
function Bm(n = 5e3, t = 100) {
  return new Promise((e, i) => {
    let r = 0;
    const s = setInterval(() => {
      if (typeof window.QRCode == "function") {
        clearInterval(s), e(window.QRCode);
        return;
      }
      r += t, r >= n && (clearInterval(s), i(new Error(`QRCode not available after ${n}ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode.`)));
    }, t);
  });
}
async function Nm(n) {
  const t = await Bm(), e = document.getElementById("qr");
  e && (e.innerHTML = "", e.classList.add("hidden"), new t(e, {
    text: n,
    width: 1280,
    height: 1280,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: t.CorrectLevel.H
  }), setTimeout(() => {
    e.classList.remove("hidden");
  }, 20));
}
function Pm(n) {
  n && (n.addEventListener("focus", (t) => {
    t.preventDefault(), n.select();
  }), n.addEventListener("mousedown", (t) => {
    t.preventDefault(), n.select();
  }), n.addEventListener("mouseup", (t) => {
    t.preventDefault(), n.select();
  }), n.addEventListener("click", () => {
    n.select();
  }));
}
function Fm() {
  document.body.addEventListener("htmx:responseError", (n) => {
    const t = n.detail.requestConfig;
    if (!t.boosted)
      return;
    document.body.innerHTML = n.detail.xhr.responseText;
    const e = n.detail.xhr.responseURL || t.url;
    window.history.pushState(null, "", e);
  });
}
function En(n = document) {
  vm(n), cl(n), Dm(n), dl(document);
}
document.addEventListener("DOMContentLoaded", () => {
  Am(), es(), En(document);
});
document.addEventListener("htmx:afterSwap", (n) => {
  const t = n.detail?.target || document;
  es(), En(t);
});
document.addEventListener("htmx:load", (n) => {
  const t = n.detail?.elt || document;
  En(t);
});
document.addEventListener("admin-sidebar-statechange", () => {
  dl(document);
});
document.addEventListener("click", (n) => {
  n.target instanceof Element && n.target.closest("[data-role='content-status-picker']") || ts();
});
document.addEventListener("keydown", (n) => {
  if (n.key !== "Enter")
    return;
  const t = n.target;
  t instanceof HTMLElement && t.matches("textarea.no-enter") && n.preventDefault();
});
window.ShowBoostedErrors = Fm;
window.GenQRCode = Nm;
window.SelectableInput = Pm;
window.HookupRBChange = xm;
window.FormLoad = Rm;
window.TextareaAutoResize = Fe;
window.initAdminStatusPickers = cl;
Im(() => {
  es(), ts(), En(document);
});
Mr();
Om();
export {
  Ci as AbbreviationTooltips,
  Qd as AlmanachEditPage,
  au as ContentImages,
  Zd as EditPage,
  bd as FilterList,
  pd as FilterPill,
  Ed as ImageReel,
  Ad as IntLink,
  Xd as ItemsEditor,
  cu as LookupField,
  Nd as MultiSelectSimple,
  yd as PopupImage,
  vd as ScrollButton,
  _d as TabList
};
