var to = Object.defineProperty;
var fs = (s) => {
  throw TypeError(s);
};
var eo = (s, t, e) => t in s ? to(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var Xt = (s, t, e) => eo(s, typeof t != "symbol" ? t + "" : t, e), Oi = (s, t, e) => t.has(s) || fs("Cannot " + e);
var Bi = (s, t, e) => (Oi(s, t, "read from private field"), e ? e.call(s) : t.get(s)), he = (s, t, e) => t.has(s) ? fs("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, e), Ve = (s, t, e, i) => (Oi(s, t, "write to private field"), i ? i.call(s, e) : t.set(s, e), e), je = (s, t, e) => (Oi(s, t, "access private method"), e);
var io = "2.1.16";
const Mt = "[data-trix-attachment]", Pn = { preview: { presentation: "gallery", caption: { name: !0, size: !0 } }, file: { caption: { size: !0 } } }, X = { default: { tagName: "div", parse: !1 }, quote: { tagName: "blockquote", nestable: !0 }, heading1: { tagName: "h1", terminal: !0, breakOnReturn: !0, group: !1 }, code: { tagName: "pre", terminal: !0, htmlAttributes: ["language"], text: { plaintext: !0 } }, bulletList: { tagName: "ul", parse: !1 }, bullet: { tagName: "li", listAttribute: "bulletList", group: !1, nestable: !0, test(s) {
  return bs(s.parentNode) === X[this.listAttribute].tagName;
} }, numberList: { tagName: "ol", parse: !1 }, number: { tagName: "li", listAttribute: "numberList", group: !1, nestable: !0, test(s) {
  return bs(s.parentNode) === X[this.listAttribute].tagName;
} }, attachmentGallery: { tagName: "div", exclusive: !0, terminal: !0, parse: !1, group: !1 } }, bs = (s) => {
  var t;
  return s == null || (t = s.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, _s = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i), Mi = _s && parseInt(_s[1]);
var Oe = { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), recentAndroid: Mi && Mi > 12, samsungAndroid: Mi && navigator.userAgent.match(/Android.*SM-/), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: typeof InputEvent < "u" && ["data", "getTargetRanges", "inputType"].every((s) => s in InputEvent.prototype) }, Gr = { ADD_ATTR: ["language"], SAFE_FOR_XML: !1, RETURN_DOM: !0 }, v = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", byte: "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption…", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL…", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
const no = [v.bytes, v.KB, v.MB, v.GB, v.TB, v.PB];
var Jr = { prefix: "IEC", precision: 2, formatter(s) {
  switch (s) {
    case 0:
      return "0 ".concat(v.bytes);
    case 1:
      return "1 ".concat(v.byte);
    default:
      let t;
      this.prefix === "SI" ? t = 1e3 : this.prefix === "IEC" && (t = 1024);
      const e = Math.floor(Math.log(s) / Math.log(t)), i = (s / Math.pow(t, e)).toFixed(this.precision).replace(/0*$/, "").replace(/\.$/, "");
      return "".concat(i, " ").concat(no[e]);
  }
} };
const ui = "\uFEFF", St = " ", Yr = function(s) {
  for (const t in s) {
    const e = s[t];
    this[t] = e;
  }
  return this;
}, Fn = document.documentElement, so = Fn.matches, B = function(s) {
  let { onElement: t, matchingSelector: e, withCallback: i, inPhase: n, preventDefault: r, times: a } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const o = t || Fn, l = e, c = n === "capturing", u = function(m) {
    a != null && --a == 0 && u.destroy();
    const p = Lt(m.target, { matchingSelector: l });
    p != null && (i == null || i.call(p, m, p), r && m.preventDefault());
  };
  return u.destroy = () => o.removeEventListener(s, u, c), o.addEventListener(s, u, c), u;
}, Xr = function(s) {
  let { bubbles: t, cancelable: e, attributes: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  t = t !== !1, e = e !== !1;
  const n = document.createEvent("Events");
  return n.initEvent(s, t, e), i != null && Yr.call(n, i), n;
}, Ae = function(s) {
  let { onElement: t, bubbles: e, cancelable: i, attributes: n } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const r = t ?? Fn, a = Xr(s, { bubbles: e, cancelable: i, attributes: n });
  return r.dispatchEvent(a);
}, Qr = function(s, t) {
  if ((s == null ? void 0 : s.nodeType) === 1) return so.call(s, t);
}, Lt = function(s) {
  let { matchingSelector: t, untilNode: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  for (; s && s.nodeType !== Node.ELEMENT_NODE; ) s = s.parentNode;
  if (s != null) {
    if (t == null) return s;
    if (s.closest && e == null) return s.closest(t);
    for (; s && s !== e; ) {
      if (Qr(s, t)) return s;
      s = s.parentNode;
    }
  }
}, qn = (s) => document.activeElement !== s && Ot(s, document.activeElement), Ot = function(s, t) {
  if (s && t) for (; t; ) {
    if (t === s) return !0;
    t = t.parentNode;
  }
}, Ni = function(s) {
  var t;
  if ((t = s) === null || t === void 0 || !t.parentNode) return;
  let e = 0;
  for (s = s.previousSibling; s; ) e++, s = s.previousSibling;
  return e;
}, Ct = (s) => {
  var t;
  return s == null || (t = s.parentNode) === null || t === void 0 ? void 0 : t.removeChild(s);
}, ri = function(s) {
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
}, Y = (s) => {
  var t;
  return s == null || (t = s.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, E = function(s) {
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
let ue;
const xe = function() {
  if (ue != null) return ue;
  ue = [];
  for (const s in X) {
    const t = X[s];
    t.tagName && ue.push(t.tagName);
  }
  return ue;
}, Pi = (s) => ee(s == null ? void 0 : s.firstChild), vs = function(s) {
  let { strict: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { strict: !0 };
  return t ? ee(s) : ee(s) || !ee(s.firstChild) && function(e) {
    return xe().includes(Y(e)) && !xe().includes(Y(e.firstChild));
  }(s);
}, ee = (s) => ro(s) && (s == null ? void 0 : s.data) === "block", ro = (s) => (s == null ? void 0 : s.nodeType) === Node.COMMENT_NODE, ie = function(s) {
  let { name: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (s) return Ee(s) ? s.data === ui ? !t || s.parentNode.dataset.trixCursorTarget === t : void 0 : ie(s.firstChild);
}, Nt = (s) => Qr(s, Mt), Zr = (s) => Ee(s) && (s == null ? void 0 : s.data) === "", Ee = (s) => (s == null ? void 0 : s.nodeType) === Node.TEXT_NODE, Hn = { level2Enabled: !0, getLevel() {
  return this.level2Enabled && Oe.supportsInputEvents ? 2 : 0;
}, pickFiles(s) {
  const t = E("input", { type: "file", multiple: !0, hidden: !0, id: this.fileInputId });
  t.addEventListener("change", () => {
    s(t.files), Ct(t);
  }), Ct(document.getElementById(this.fileInputId)), document.body.appendChild(t), t.click();
} };
var ii = { removeBlankTableCells: !1, tableCellSeparator: " | ", tableRowSeparator: `
` }, Ft = { bold: { tagName: "strong", inheritable: !0, parser(s) {
  const t = window.getComputedStyle(s);
  return t.fontWeight === "bold" || t.fontWeight >= 600;
} }, italic: { tagName: "em", inheritable: !0, parser: (s) => window.getComputedStyle(s).fontStyle === "italic" }, href: { groupTagName: "a", parser(s) {
  const t = "a:not(".concat(Mt, ")"), e = s.closest(t);
  if (e) return e.getAttribute("href");
} }, strike: { tagName: "del", inheritable: !0 }, frozen: { style: { backgroundColor: "highlight" } } }, ta = { getDefaultHTML: () => `<div class="trix-button-row">
      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="`.concat(v.bold, '" tabindex="-1">').concat(v.bold, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="`).concat(v.italic, '" tabindex="-1">').concat(v.italic, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="`).concat(v.strike, '" tabindex="-1">').concat(v.strike, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="`).concat(v.link, '" tabindex="-1">').concat(v.link, `</button>
      </span>

      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="`).concat(v.heading1, '" tabindex="-1">').concat(v.heading1, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="`).concat(v.quote, '" tabindex="-1">').concat(v.quote, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="`).concat(v.code, '" tabindex="-1">').concat(v.code, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="`).concat(v.bullets, '" tabindex="-1">').concat(v.bullets, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="`).concat(v.numbers, '" tabindex="-1">').concat(v.numbers, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="`).concat(v.outdent, '" tabindex="-1">').concat(v.outdent, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="`).concat(v.indent, '" tabindex="-1">').concat(v.indent, `</button>
      </span>

      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="`).concat(v.attachFiles, '" tabindex="-1">').concat(v.attachFiles, `</button>
      </span>

      <span class="trix-button-group-spacer"></span>

      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="`).concat(v.undo, '" tabindex="-1">').concat(v.undo, `</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="`).concat(v.redo, '" tabindex="-1">').concat(v.redo, `</button>
      </span>
    </div>

    <div class="trix-dialogs" data-trix-dialogs>
      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
        <div class="trix-dialog__link-fields">
          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="`).concat(v.urlPlaceholder, '" aria-label="').concat(v.url, `" data-trix-validate-href required data-trix-input>
          <div class="trix-button-group">
            <input type="button" class="trix-button trix-button--dialog" value="`).concat(v.link, `" data-trix-method="setAttribute">
            <input type="button" class="trix-button trix-button--dialog" value="`).concat(v.unlink, `" data-trix-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>`) };
const An = { interval: 5e3 };
var Be = Object.freeze({ __proto__: null, attachments: Pn, blockAttributes: X, browser: Oe, css: { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" }, dompurify: Gr, fileSize: Jr, input: Hn, keyNames: { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" }, lang: v, parser: ii, textAttributes: Ft, toolbar: ta, undo: An });
class H {
  static proxyMethod(t) {
    const { name: e, toMethod: i, toProperty: n, optional: r } = ao(t);
    this.prototype[e] = function() {
      let a, o;
      var l, c;
      return i ? o = r ? (l = this[i]) === null || l === void 0 ? void 0 : l.call(this) : this[i]() : n && (o = this[n]), r ? (a = (c = o) === null || c === void 0 ? void 0 : c[e], a ? ys.call(a, o, arguments) : void 0) : (a = o[e], ys.call(a, o, arguments));
    };
  }
}
const ao = function(s) {
  const t = s.match(oo);
  if (!t) throw new Error("can't parse @proxyMethod expression: ".concat(s));
  const e = { name: t[4] };
  return t[2] != null ? e.toMethod = t[1] : e.toProperty = t[1], t[3] != null && (e.optional = !0), e;
}, { apply: ys } = Function.prototype, oo = new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");
var Fi, qi, Hi;
class ke extends H {
  static box() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return t instanceof this ? t : this.fromUCS2String(t == null ? void 0 : t.toString());
  }
  static fromUCS2String(t) {
    return new this(t, xn(t));
  }
  static fromCodepoints(t) {
    return new this(En(t), t);
  }
  constructor(t, e) {
    super(...arguments), this.ucs2String = t, this.codepoints = e, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
  }
  offsetToUCS2Offset(t) {
    return En(this.codepoints.slice(0, Math.max(0, t))).length;
  }
  offsetFromUCS2Offset(t) {
    return xn(this.ucs2String.slice(0, Math.max(0, t))).length;
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
const lo = ((Fi = Array.from) === null || Fi === void 0 ? void 0 : Fi.call(Array, "👼").length) === 1, co = ((qi = " ".codePointAt) === null || qi === void 0 ? void 0 : qi.call(" ", 0)) != null, ho = ((Hi = String.fromCodePoint) === null || Hi === void 0 ? void 0 : Hi.call(String, 32, 128124)) === " 👼";
let xn, En;
xn = lo && co ? (s) => Array.from(s).map((t) => t.codePointAt(0)) : function(s) {
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
}, En = ho ? (s) => String.fromCodePoint(...Array.from(s || [])) : function(s) {
  return (() => {
    const t = [];
    return Array.from(s).forEach((e) => {
      let i = "";
      e > 65535 && (e -= 65536, i += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t.push(i + String.fromCharCode(e));
    }), t;
  })().join("");
};
let uo = 0;
class $t extends H {
  static fromJSONString(t) {
    return this.fromJSON(JSON.parse(t));
  }
  constructor() {
    super(...arguments), this.id = ++uo;
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
    return ke.box(this);
  }
  getCacheKey() {
    return this.id.toString();
  }
}
const qt = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (s.length !== t.length) return !1;
  for (let e = 0; e < s.length; e++)
    if (s[e] !== t[e]) return !1;
  return !0;
}, $n = function(s) {
  const t = s.slice(0);
  for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
  return t.splice(...i), t;
}, mo = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/, go = function() {
  const s = E("input", { dir: "auto", name: "x", dirName: "x.dir" }), t = E("textarea", { dir: "auto", name: "y", dirName: "y.dir" }), e = E("form");
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
    const a = r.trim().charAt(0);
    return mo.test(a) ? "rtl" : "ltr";
  };
}();
let $i = null, Ui = null, Vi = null, We = null;
const Sn = () => ($i || ($i = fo().concat(po())), $i), F = (s) => X[s], po = () => (Ui || (Ui = Object.keys(X)), Ui), Ln = (s) => Ft[s], fo = () => (Vi || (Vi = Object.keys(Ft)), Vi), ea = function(s, t) {
  bo(s).textContent = t.replace(/%t/g, s);
}, bo = function(s) {
  const t = document.createElement("style");
  t.setAttribute("type", "text/css"), t.setAttribute("data-tag-name", s.toLowerCase());
  const e = _o();
  return e && t.setAttribute("nonce", e), document.head.insertBefore(t, document.head.firstChild), t;
}, _o = function() {
  const s = As("trix-csp-nonce") || As("csp-nonce");
  if (s) {
    const { nonce: t, content: e } = s;
    return t == "" ? e : t;
  }
}, As = (s) => document.head.querySelector("meta[name=".concat(s, "]")), xs = { "application/x-trix-feature-detection": "test" }, ia = function(s) {
  const t = s.getData("text/plain"), e = s.getData("text/html");
  if (!t || !e) return t == null ? void 0 : t.length;
  {
    const { body: i } = new DOMParser().parseFromString(e, "text/html");
    if (i.textContent === t) return !i.querySelector("*");
  }
}, na = /Mac|^iP/.test(navigator.platform) ? (s) => s.metaKey : (s) => s.ctrlKey, Un = (s) => setTimeout(s, 1), sa = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const t = {};
  for (const e in s) {
    const i = s[e];
    t[e] = i;
  }
  return t;
}, re = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (Object.keys(s).length !== Object.keys(t).length) return !1;
  for (const e in s)
    if (s[e] !== t[e]) return !1;
  return !0;
}, k = function(s) {
  if (s != null) return Array.isArray(s) || (s = [s, s]), [Es(s[0]), Es(s[1] != null ? s[1] : s[0])];
}, vt = function(s) {
  if (s == null) return;
  const [t, e] = k(s);
  return Cn(t, e);
}, ai = function(s, t) {
  if (s == null || t == null) return;
  const [e, i] = k(s), [n, r] = k(t);
  return Cn(e, n) && Cn(i, r);
}, Es = function(s) {
  return typeof s == "number" ? s : sa(s);
}, Cn = function(s, t) {
  return typeof s == "number" ? s === t : re(s, t);
};
class ra extends H {
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
const Ht = new ra(), aa = function() {
  const s = window.getSelection();
  if (s.rangeCount > 0) return s;
}, Se = function() {
  var s;
  const t = (s = aa()) === null || s === void 0 ? void 0 : s.getRangeAt(0);
  if (t && !vo(t)) return t;
}, oa = function(s) {
  const t = window.getSelection();
  return t.removeAllRanges(), t.addRange(s), Ht.update();
}, vo = (s) => Ss(s.startContainer) || Ss(s.endContainer), Ss = (s) => !Object.getPrototypeOf(s), ye = (s) => s.replace(new RegExp("".concat(ui), "g"), "").replace(new RegExp("".concat(St), "g"), " "), Vn = new RegExp("[^\\S".concat(St, "]")), jn = (s) => s.replace(new RegExp("".concat(Vn.source), "g"), " ").replace(/\ {2,}/g, " "), Ls = function(s, t) {
  if (s.isEqualTo(t)) return ["", ""];
  const e = ji(s, t), { length: i } = e.utf16String;
  let n;
  if (i) {
    const { offset: r } = e, a = s.codepoints.slice(0, r).concat(s.codepoints.slice(r + i));
    n = ji(t, ke.fromCodepoints(a));
  } else n = ji(t, s);
  return [e.utf16String.toString(), n.utf16String.toString()];
}, ji = function(s, t) {
  let e = 0, i = s.length, n = t.length;
  for (; e < i && s.charAt(e).isEqualTo(t.charAt(e)); ) e++;
  for (; i > e + 1 && s.charAt(i - 1).isEqualTo(t.charAt(n - 1)); ) i--, n--;
  return { utf16String: s.slice(e, i), offset: e };
};
class et extends $t {
  static fromCommonAttributesOfObjects() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    if (!t.length) return new this();
    let e = me(t[0]), i = e.getKeys();
    return t.slice(1).forEach((n) => {
      i = e.getKeysCommonToHash(me(n)), e = e.slice(i);
    }), e;
  }
  static box(t) {
    return me(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(...arguments), this.values = ni(t);
  }
  add(t, e) {
    return this.merge(yo(t, e));
  }
  remove(t) {
    return new et(ni(this.values, t));
  }
  get(t) {
    return this.values[t];
  }
  has(t) {
    return t in this.values;
  }
  merge(t) {
    return new et(Ao(this.values, xo(t)));
  }
  slice(t) {
    const e = {};
    return Array.from(t).forEach((i) => {
      this.has(i) && (e[i] = this.values[i]);
    }), new et(e);
  }
  getKeys() {
    return Object.keys(this.values);
  }
  getKeysCommonToHash(t) {
    return t = me(t), this.getKeys().filter((e) => this.values[e] === t.values[e]);
  }
  isEqualTo(t) {
    return qt(this.toArray(), me(t).toArray());
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
    return ni(this.values);
  }
  toJSON() {
    return this.toObject();
  }
  contentsForInspection() {
    return { values: JSON.stringify(this.values) };
  }
}
const yo = function(s, t) {
  const e = {};
  return e[s] = t, e;
}, Ao = function(s, t) {
  const e = ni(s);
  for (const i in t) {
    const n = t[i];
    e[i] = n;
  }
  return e;
}, ni = function(s, t) {
  const e = {};
  return Object.keys(s).sort().forEach((i) => {
    i !== t && (e[i] = s[i]);
  }), e;
}, me = function(s) {
  return s instanceof et ? s : new et(s);
}, xo = function(s) {
  return s instanceof et ? s.values : s;
};
class Wn {
  static groupObjects() {
    let t, e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], { depth: i, asTree: n } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    n && i == null && (i = 0);
    const r = [];
    return Array.from(e).forEach((a) => {
      var o;
      if (t) {
        var l, c, u;
        if ((l = a.canBeGrouped) !== null && l !== void 0 && l.call(a, i) && (c = (u = t[t.length - 1]).canBeGroupedWith) !== null && c !== void 0 && c.call(u, a, i)) return void t.push(a);
        r.push(new this(t, { depth: i, asTree: n })), t = null;
      }
      (o = a.canBeGrouped) !== null && o !== void 0 && o.call(a, i) ? t = [a] : r.push(a);
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
class Eo extends H {
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
class So {
  constructor(t) {
    this.reset(t);
  }
  add(t) {
    const e = Cs(t);
    this.elements[e] = t;
  }
  remove(t) {
    const e = Cs(t), i = this.elements[e];
    if (i) return delete this.elements[e], i;
  }
  reset() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return this.elements = {}, Array.from(t).forEach((e) => {
      this.add(e);
    }), t;
  }
}
const Cs = (s) => s.dataset.trixStoreKey;
class oi extends H {
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
oi.proxyMethod("getPromise().then"), oi.proxyMethod("getPromise().catch");
class Ut extends H {
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
    e instanceof Wn && (i.viewClass = t, t = Lo);
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
class Lo extends Ut {
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
const { entries: la, setPrototypeOf: ws, isFrozen: Co, getPrototypeOf: wo, getOwnPropertyDescriptor: To } = Object;
let { freeze: Q, seal: st, create: da } = Object, { apply: wn, construct: Tn } = typeof Reflect < "u" && Reflect;
Q || (Q = function(s) {
  return s;
}), st || (st = function(s) {
  return s;
}), wn || (wn = function(s, t) {
  for (var e = arguments.length, i = new Array(e > 2 ? e - 2 : 0), n = 2; n < e; n++) i[n - 2] = arguments[n];
  return s.apply(t, i);
}), Tn || (Tn = function(s) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) e[i - 1] = arguments[i];
  return new s(...e);
});
const ze = Z(Array.prototype.forEach), ko = Z(Array.prototype.lastIndexOf), Ts = Z(Array.prototype.pop), ge = Z(Array.prototype.push), Io = Z(Array.prototype.splice), si = Z(String.prototype.toLowerCase), Wi = Z(String.prototype.toString), zi = Z(String.prototype.match), pe = Z(String.prototype.replace), Ro = Z(String.prototype.indexOf), Do = Z(String.prototype.trim), lt = Z(Object.prototype.hasOwnProperty), J = Z(RegExp.prototype.test), fe = (ks = TypeError, function() {
  for (var s = arguments.length, t = new Array(s), e = 0; e < s; e++) t[e] = arguments[e];
  return Tn(ks, t);
});
var ks;
function Z(s) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) i[n - 1] = arguments[n];
    return wn(s, t, i);
  };
}
function L(s, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : si;
  ws && ws(s, null);
  let i = t.length;
  for (; i--; ) {
    let n = t[i];
    if (typeof n == "string") {
      const r = e(n);
      r !== n && (Co(t) || (t[i] = r), n = r);
    }
    s[n] = !0;
  }
  return s;
}
function Oo(s) {
  for (let t = 0; t < s.length; t++)
    lt(s, t) || (s[t] = null);
  return s;
}
function ft(s) {
  const t = da(null);
  for (const [e, i] of la(s))
    lt(s, e) && (Array.isArray(i) ? t[e] = Oo(i) : i && typeof i == "object" && i.constructor === Object ? t[e] = ft(i) : t[e] = i);
  return t;
}
function be(s, t) {
  for (; s !== null; ) {
    const e = To(s, t);
    if (e) {
      if (e.get) return Z(e.get);
      if (typeof e.value == "function") return Z(e.value);
    }
    s = wo(s);
  }
  return function() {
    return null;
  };
}
const Is = Q(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Ki = Q(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "slot", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Gi = Q(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Bo = Q(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Ji = Q(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Mo = Q(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Rs = Q(["#text"]), Ds = Q(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Yi = Q(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Os = Q(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Ke = Q(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), No = st(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Po = st(/<%[\w\W]*|[\w\W]*%>/gm), Fo = st(/\$\{[\w\W]*/gm), qo = st(/^data-[\-\w.\u00B7-\uFFFF]+$/), Ho = st(/^aria-[\-\w]+$/), ca = st(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), $o = st(/^(?:\w+script|data):/i), Uo = st(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), ha = st(/^html$/i), Vo = st(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Bs = Object.freeze({ __proto__: null, ARIA_ATTR: Ho, ATTR_WHITESPACE: Uo, CUSTOM_ELEMENT: Vo, DATA_ATTR: qo, DOCTYPE_NAME: ha, ERB_EXPR: Po, IS_ALLOWED_URI: ca, IS_SCRIPT_OR_DATA: $o, MUSTACHE_EXPR: No, TMPLIT_EXPR: Fo });
const jo = 1, Wo = 3, zo = 7, Ko = 8, Go = 9, Jo = function() {
  return typeof window > "u" ? null : window;
};
var Ie = function s() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Jo();
  const e = (d) => s(d);
  if (e.version = "3.2.7", e.removed = [], !t || !t.document || t.document.nodeType !== Go || !t.Element) return e.isSupported = !1, e;
  let { document: i } = t;
  const n = i, r = n.currentScript, { DocumentFragment: a, HTMLTemplateElement: o, Node: l, Element: c, NodeFilter: u, NamedNodeMap: m = t.NamedNodeMap || t.MozNamedAttrMap, HTMLFormElement: p, DOMParser: h, trustedTypes: f } = t, A = c.prototype, I = be(A, "cloneNode"), $ = be(A, "remove"), R = be(A, "nextSibling"), U = be(A, "childNodes"), _ = be(A, "parentNode");
  if (typeof o == "function") {
    const d = i.createElement("template");
    d.content && d.content.ownerDocument && (i = d.content.ownerDocument);
  }
  let S, x = "";
  const { implementation: z, createNodeIterator: ct, createDocumentFragment: wt, getElementsByTagName: mt } = i, { importNode: bi } = n;
  let V = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  e.isSupported = typeof la == "function" && typeof _ == "function" && z && z.createHTMLDocument !== void 0;
  const { MUSTACHE_EXPR: Tt, ERB_EXPR: jt, TMPLIT_EXPR: tt, DATA_ATTR: _i, ARIA_ATTR: vi, IS_SCRIPT_OR_DATA: yi, ATTR_WHITESPACE: Me, CUSTOM_ELEMENT: Ai } = Bs;
  let { IS_ALLOWED_URI: oe } = Bs, M = null;
  const q = L({}, [...Is, ...Ki, ...Gi, ...Ji, ...Rs]);
  let D = null;
  const Gn = L({}, [...Ds, ...Yi, ...Os, ...Ke]);
  let N = Object.seal(da(null, { tagNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, attributeNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, allowCustomizedBuiltInElements: { writable: !0, configurable: !1, enumerable: !0, value: !1 } })), le = null, xi = null, Jn = !0, Ei = !0, Yn = !1, Xn = !0, Wt = !1, Ne = !0, kt = !1, Si = !1, Li = !1, zt = !1, Pe = !1, Fe = !1, Qn = !0, Zn = !1, Ci = !0, de = !1, Kt = {}, Gt = null;
  const ts = L({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let es = null;
  const is = L({}, ["audio", "video", "img", "source", "image", "track"]);
  let wi = null;
  const ns = L({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), qe = "http://www.w3.org/1998/Math/MathML", He = "http://www.w3.org/2000/svg", gt = "http://www.w3.org/1999/xhtml";
  let Jt = gt, Ti = !1, ki = null;
  const Ja = L({}, [qe, He, gt], Wi);
  let $e = L({}, ["mi", "mo", "mn", "ms", "mtext"]), Ue = L({}, ["annotation-xml"]);
  const Ya = L({}, ["title", "style", "font", "a", "script"]);
  let ce = null;
  const Xa = ["application/xhtml+xml", "text/html"];
  let W = null, Yt = null;
  const Qa = i.createElement("form"), ss = function(d) {
    return d instanceof RegExp || d instanceof Function;
  }, Ii = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!Yt || Yt !== d) {
      if (d && typeof d == "object" || (d = {}), d = ft(d), ce = Xa.indexOf(d.PARSER_MEDIA_TYPE) === -1 ? "text/html" : d.PARSER_MEDIA_TYPE, W = ce === "application/xhtml+xml" ? Wi : si, M = lt(d, "ALLOWED_TAGS") ? L({}, d.ALLOWED_TAGS, W) : q, D = lt(d, "ALLOWED_ATTR") ? L({}, d.ALLOWED_ATTR, W) : Gn, ki = lt(d, "ALLOWED_NAMESPACES") ? L({}, d.ALLOWED_NAMESPACES, Wi) : Ja, wi = lt(d, "ADD_URI_SAFE_ATTR") ? L(ft(ns), d.ADD_URI_SAFE_ATTR, W) : ns, es = lt(d, "ADD_DATA_URI_TAGS") ? L(ft(is), d.ADD_DATA_URI_TAGS, W) : is, Gt = lt(d, "FORBID_CONTENTS") ? L({}, d.FORBID_CONTENTS, W) : ts, le = lt(d, "FORBID_TAGS") ? L({}, d.FORBID_TAGS, W) : ft({}), xi = lt(d, "FORBID_ATTR") ? L({}, d.FORBID_ATTR, W) : ft({}), Kt = !!lt(d, "USE_PROFILES") && d.USE_PROFILES, Jn = d.ALLOW_ARIA_ATTR !== !1, Ei = d.ALLOW_DATA_ATTR !== !1, Yn = d.ALLOW_UNKNOWN_PROTOCOLS || !1, Xn = d.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Wt = d.SAFE_FOR_TEMPLATES || !1, Ne = d.SAFE_FOR_XML !== !1, kt = d.WHOLE_DOCUMENT || !1, zt = d.RETURN_DOM || !1, Pe = d.RETURN_DOM_FRAGMENT || !1, Fe = d.RETURN_TRUSTED_TYPE || !1, Li = d.FORCE_BODY || !1, Qn = d.SANITIZE_DOM !== !1, Zn = d.SANITIZE_NAMED_PROPS || !1, Ci = d.KEEP_CONTENT !== !1, de = d.IN_PLACE || !1, oe = d.ALLOWED_URI_REGEXP || ca, Jt = d.NAMESPACE || gt, $e = d.MATHML_TEXT_INTEGRATION_POINTS || $e, Ue = d.HTML_INTEGRATION_POINTS || Ue, N = d.CUSTOM_ELEMENT_HANDLING || {}, d.CUSTOM_ELEMENT_HANDLING && ss(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (N.tagNameCheck = d.CUSTOM_ELEMENT_HANDLING.tagNameCheck), d.CUSTOM_ELEMENT_HANDLING && ss(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (N.attributeNameCheck = d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), d.CUSTOM_ELEMENT_HANDLING && typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (N.allowCustomizedBuiltInElements = d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Wt && (Ei = !1), Pe && (zt = !0), Kt && (M = L({}, Rs), D = [], Kt.html === !0 && (L(M, Is), L(D, Ds)), Kt.svg === !0 && (L(M, Ki), L(D, Yi), L(D, Ke)), Kt.svgFilters === !0 && (L(M, Gi), L(D, Yi), L(D, Ke)), Kt.mathMl === !0 && (L(M, Ji), L(D, Os), L(D, Ke))), d.ADD_TAGS && (M === q && (M = ft(M)), L(M, d.ADD_TAGS, W)), d.ADD_ATTR && (D === Gn && (D = ft(D)), L(D, d.ADD_ATTR, W)), d.ADD_URI_SAFE_ATTR && L(wi, d.ADD_URI_SAFE_ATTR, W), d.FORBID_CONTENTS && (Gt === ts && (Gt = ft(Gt)), L(Gt, d.FORBID_CONTENTS, W)), Ci && (M["#text"] = !0), kt && L(M, ["html", "head", "body"]), M.table && (L(M, ["tbody"]), delete le.tbody), d.TRUSTED_TYPES_POLICY) {
        if (typeof d.TRUSTED_TYPES_POLICY.createHTML != "function") throw fe('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof d.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw fe('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        S = d.TRUSTED_TYPES_POLICY, x = S.createHTML("");
      } else S === void 0 && (S = function(b, g) {
        if (typeof b != "object" || typeof b.createPolicy != "function") return null;
        let C = null;
        const T = "data-tt-policy-suffix";
        g && g.hasAttribute(T) && (C = g.getAttribute(T));
        const y = "dompurify" + (C ? "#" + C : "");
        try {
          return b.createPolicy(y, { createHTML: (j) => j, createScriptURL: (j) => j });
        } catch {
          return console.warn("TrustedTypes policy " + y + " could not be created."), null;
        }
      }(f, r)), S !== null && typeof x == "string" && (x = S.createHTML(""));
      Q && Q(d), Yt = d;
    }
  }, rs = L({}, [...Ki, ...Gi, ...Bo]), as = L({}, [...Ji, ...Mo]), ht = function(d) {
    ge(e.removed, { element: d });
    try {
      _(d).removeChild(d);
    } catch {
      $(d);
    }
  }, It = function(d, b) {
    try {
      ge(e.removed, { attribute: b.getAttributeNode(d), from: b });
    } catch {
      ge(e.removed, { attribute: null, from: b });
    }
    if (b.removeAttribute(d), d === "is") if (zt || Pe) try {
      ht(b);
    } catch {
    }
    else try {
      b.setAttribute(d, "");
    } catch {
    }
  }, os = function(d) {
    let b = null, g = null;
    if (Li) d = "<remove></remove>" + d;
    else {
      const y = zi(d, /^[\r\n\t ]+/);
      g = y && y[0];
    }
    ce === "application/xhtml+xml" && Jt === gt && (d = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + d + "</body></html>");
    const C = S ? S.createHTML(d) : d;
    if (Jt === gt) try {
      b = new h().parseFromString(C, ce);
    } catch {
    }
    if (!b || !b.documentElement) {
      b = z.createDocument(Jt, "template", null);
      try {
        b.documentElement.innerHTML = Ti ? x : C;
      } catch {
      }
    }
    const T = b.body || b.documentElement;
    return d && g && T.insertBefore(i.createTextNode(g), T.childNodes[0] || null), Jt === gt ? mt.call(b, kt ? "html" : "body")[0] : kt ? b.documentElement : T;
  }, ls = function(d) {
    return ct.call(d.ownerDocument || d, d, u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION, null);
  }, Ri = function(d) {
    return d instanceof p && (typeof d.nodeName != "string" || typeof d.textContent != "string" || typeof d.removeChild != "function" || !(d.attributes instanceof m) || typeof d.removeAttribute != "function" || typeof d.setAttribute != "function" || typeof d.namespaceURI != "string" || typeof d.insertBefore != "function" || typeof d.hasChildNodes != "function");
  }, ds = function(d) {
    return typeof l == "function" && d instanceof l;
  };
  function pt(d, b, g) {
    ze(d, (C) => {
      C.call(e, b, g, Yt);
    });
  }
  const cs = function(d) {
    let b = null;
    if (pt(V.beforeSanitizeElements, d, null), Ri(d)) return ht(d), !0;
    const g = W(d.nodeName);
    if (pt(V.uponSanitizeElement, d, { tagName: g, allowedTags: M }), Ne && d.hasChildNodes() && !ds(d.firstElementChild) && J(/<[/\w!]/g, d.innerHTML) && J(/<[/\w!]/g, d.textContent) || d.nodeType === zo || Ne && d.nodeType === Ko && J(/<[/\w]/g, d.data)) return ht(d), !0;
    if (!M[g] || le[g]) {
      if (!le[g] && us(g) && (N.tagNameCheck instanceof RegExp && J(N.tagNameCheck, g) || N.tagNameCheck instanceof Function && N.tagNameCheck(g)))
        return !1;
      if (Ci && !Gt[g]) {
        const C = _(d) || d.parentNode, T = U(d) || d.childNodes;
        if (T && C)
          for (let y = T.length - 1; y >= 0; --y) {
            const j = I(T[y], !0);
            j.__removalCount = (d.__removalCount || 0) + 1, C.insertBefore(j, R(d));
          }
      }
      return ht(d), !0;
    }
    return d instanceof c && !function(C) {
      let T = _(C);
      T && T.tagName || (T = { namespaceURI: Jt, tagName: "template" });
      const y = si(C.tagName), j = si(T.tagName);
      return !!ki[C.namespaceURI] && (C.namespaceURI === He ? T.namespaceURI === gt ? y === "svg" : T.namespaceURI === qe ? y === "svg" && (j === "annotation-xml" || $e[j]) : !!rs[y] : C.namespaceURI === qe ? T.namespaceURI === gt ? y === "math" : T.namespaceURI === He ? y === "math" && Ue[j] : !!as[y] : C.namespaceURI === gt ? !(T.namespaceURI === He && !Ue[j]) && !(T.namespaceURI === qe && !$e[j]) && !as[y] && (Ya[y] || !rs[y]) : !(ce !== "application/xhtml+xml" || !ki[C.namespaceURI]));
    }(d) ? (ht(d), !0) : g !== "noscript" && g !== "noembed" && g !== "noframes" || !J(/<\/no(script|embed|frames)/i, d.innerHTML) ? (Wt && d.nodeType === Wo && (b = d.textContent, ze([Tt, jt, tt], (C) => {
      b = pe(b, C, " ");
    }), d.textContent !== b && (ge(e.removed, { element: d.cloneNode() }), d.textContent = b)), pt(V.afterSanitizeElements, d, null), !1) : (ht(d), !0);
  }, hs = function(d, b, g) {
    if (Qn && (b === "id" || b === "name") && (g in i || g in Qa)) return !1;
    if (!(Ei && !xi[b] && J(_i, b))) {
      if (!(Jn && J(vi, b))) {
        if (!D[b] || xi[b]) {
          if (!(us(d) && (N.tagNameCheck instanceof RegExp && J(N.tagNameCheck, d) || N.tagNameCheck instanceof Function && N.tagNameCheck(d)) && (N.attributeNameCheck instanceof RegExp && J(N.attributeNameCheck, b) || N.attributeNameCheck instanceof Function && N.attributeNameCheck(b, d)) || b === "is" && N.allowCustomizedBuiltInElements && (N.tagNameCheck instanceof RegExp && J(N.tagNameCheck, g) || N.tagNameCheck instanceof Function && N.tagNameCheck(g)))) return !1;
        } else if (!wi[b]) {
          if (!J(oe, pe(g, Me, ""))) {
            if ((b !== "src" && b !== "xlink:href" && b !== "href" || d === "script" || Ro(g, "data:") !== 0 || !es[d]) && !(Yn && !J(yi, pe(g, Me, "")))) {
              if (g) return !1;
            }
          }
        }
      }
    }
    return !0;
  }, us = function(d) {
    return d !== "annotation-xml" && zi(d, Ai);
  }, ms = function(d) {
    pt(V.beforeSanitizeAttributes, d, null);
    const { attributes: b } = d;
    if (!b || Ri(d)) return;
    const g = { attrName: "", attrValue: "", keepAttr: !0, allowedAttributes: D, forceKeepAttr: void 0 };
    let C = b.length;
    for (; C--; ) {
      const T = b[C], { name: y, namespaceURI: j, value: yt } = T, rt = W(y), Di = yt;
      let K = y === "value" ? Di : Do(Di);
      if (g.attrName = rt, g.attrValue = K, g.keepAttr = !0, g.forceKeepAttr = void 0, pt(V.uponSanitizeAttribute, d, g), K = g.attrValue, !Zn || rt !== "id" && rt !== "name" || (It(y, d), K = "user-content-" + K), Ne && J(/((--!?|])>)|<\/(style|title|textarea)/i, K)) {
        It(y, d);
        continue;
      }
      if (rt === "attributename" && zi(K, "href")) {
        It(y, d);
        continue;
      }
      if (g.forceKeepAttr) continue;
      if (!g.keepAttr) {
        It(y, d);
        continue;
      }
      if (!Xn && J(/\/>/i, K)) {
        It(y, d);
        continue;
      }
      Wt && ze([Tt, jt, tt], (ps) => {
        K = pe(K, ps, " ");
      });
      const gs = W(d.nodeName);
      if (hs(gs, rt, K)) {
        if (S && typeof f == "object" && typeof f.getAttributeType == "function" && !j) switch (f.getAttributeType(gs, rt)) {
          case "TrustedHTML":
            K = S.createHTML(K);
            break;
          case "TrustedScriptURL":
            K = S.createScriptURL(K);
        }
        if (K !== Di) try {
          j ? d.setAttributeNS(j, y, K) : d.setAttribute(y, K), Ri(d) ? ht(d) : Ts(e.removed);
        } catch {
          It(y, d);
        }
      } else It(y, d);
    }
    pt(V.afterSanitizeAttributes, d, null);
  }, Za = function d(b) {
    let g = null;
    const C = ls(b);
    for (pt(V.beforeSanitizeShadowDOM, b, null); g = C.nextNode(); ) pt(V.uponSanitizeShadowNode, g, null), cs(g), ms(g), g.content instanceof a && d(g.content);
    pt(V.afterSanitizeShadowDOM, b, null);
  };
  return e.sanitize = function(d) {
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, g = null, C = null, T = null, y = null;
    if (Ti = !d, Ti && (d = "<!-->"), typeof d != "string" && !ds(d)) {
      if (typeof d.toString != "function") throw fe("toString is not a function");
      if (typeof (d = d.toString()) != "string") throw fe("dirty is not a string, aborting");
    }
    if (!e.isSupported) return d;
    if (Si || Ii(b), e.removed = [], typeof d == "string" && (de = !1), de) {
      if (d.nodeName) {
        const rt = W(d.nodeName);
        if (!M[rt] || le[rt]) throw fe("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof l) g = os("<!---->"), C = g.ownerDocument.importNode(d, !0), C.nodeType === jo && C.nodeName === "BODY" || C.nodeName === "HTML" ? g = C : g.appendChild(C);
    else {
      if (!zt && !Wt && !kt && d.indexOf("<") === -1) return S && Fe ? S.createHTML(d) : d;
      if (g = os(d), !g) return zt ? null : Fe ? x : "";
    }
    g && Li && ht(g.firstChild);
    const j = ls(de ? d : g);
    for (; T = j.nextNode(); ) cs(T), ms(T), T.content instanceof a && Za(T.content);
    if (de) return d;
    if (zt) {
      if (Pe) for (y = wt.call(g.ownerDocument); g.firstChild; ) y.appendChild(g.firstChild);
      else y = g;
      return (D.shadowroot || D.shadowrootmode) && (y = bi.call(n, y, !0)), y;
    }
    let yt = kt ? g.outerHTML : g.innerHTML;
    return kt && M["!doctype"] && g.ownerDocument && g.ownerDocument.doctype && g.ownerDocument.doctype.name && J(ha, g.ownerDocument.doctype.name) && (yt = "<!DOCTYPE " + g.ownerDocument.doctype.name + `>
` + yt), Wt && ze([Tt, jt, tt], (rt) => {
      yt = pe(yt, rt, " ");
    }), S && Fe ? S.createHTML(yt) : yt;
  }, e.setConfig = function() {
    Ii(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), Si = !0;
  }, e.clearConfig = function() {
    Yt = null, Si = !1;
  }, e.isValidAttribute = function(d, b, g) {
    Yt || Ii({});
    const C = W(d), T = W(b);
    return hs(C, T, g);
  }, e.addHook = function(d, b) {
    typeof b == "function" && ge(V[d], b);
  }, e.removeHook = function(d, b) {
    if (b !== void 0) {
      const g = ko(V[d], b);
      return g === -1 ? void 0 : Io(V[d], g, 1)[0];
    }
    return Ts(V[d]);
  }, e.removeHooks = function(d) {
    V[d] = [];
  }, e.removeAllHooks = function() {
    V = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  }, e;
}();
Ie.addHook("uponSanitizeAttribute", function(s, t) {
  /^data-trix-/.test(t.attrName) && (t.forceKeepAttr = !0);
});
const Yo = "style href src width height language class".split(" "), Xo = "javascript:".split(" "), Qo = "script iframe form noscript".split(" ");
class mi extends H {
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
    super(...arguments), this.allowedAttributes = e || Yo, this.forbiddenProtocols = i || Xo, this.forbiddenElements = n || Qo, this.purifyOptions = r || {}, this.body = Zo(t);
  }
  sanitize() {
    this.sanitizeElements(), this.normalizeListElementNesting();
    const t = Object.assign({}, Gr, this.purifyOptions);
    return Ie.setConfig(t), this.body = Ie.sanitize(this.body), this.body;
  }
  getHTML() {
    return this.body.innerHTML;
  }
  getBody() {
    return this.body;
  }
  sanitizeElements() {
    const t = ri(this.body), e = [];
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
    return e.forEach((i) => Ct(i)), this.body;
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
      e && Y(e) === "li" && e.appendChild(t);
    }), this.body;
  }
  elementIsRemovable(t) {
    if ((t == null ? void 0 : t.nodeType) === Node.ELEMENT_NODE) return this.elementIsForbidden(t) || this.elementIsntSerializable(t);
  }
  elementIsForbidden(t) {
    return this.forbiddenElements.includes(Y(t));
  }
  elementIsntSerializable(t) {
    return t.getAttribute("data-trix-serialize") === "false" && !Nt(t);
  }
}
const Zo = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  s = s.replace(/<\/html[^>]*>[^]*$/i, "</html>");
  const t = document.implementation.createHTMLDocument("");
  return t.documentElement.innerHTML = s, Array.from(t.head.querySelectorAll("style")).forEach((e) => {
    t.body.appendChild(e);
  }), t.body;
}, { css: At } = Be;
class zn extends Ut {
  constructor() {
    super(...arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
  }
  createContentNodes() {
    return [];
  }
  createNodes() {
    let t;
    const e = t = E({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: !1 }), i = this.getHref();
    return i && (t = E({ tagName: "a", editable: !1, attributes: { href: i, tabindex: -1 } }), e.appendChild(t)), this.attachment.hasContent() ? mi.setHTML(t, this.attachment.getContent()) : this.createContentNodes().forEach((n) => {
      t.appendChild(n);
    }), t.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = E({ tagName: "progress", attributes: { class: At.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: !0, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e.appendChild(this.progressElement)), [Ms("left"), e, Ms("right")];
  }
  createCaptionElement() {
    const t = E({ tagName: "figcaption", className: At.attachmentCaption }), e = this.attachmentPiece.getCaption();
    if (e) t.classList.add("".concat(At.attachmentCaption, "--edited")), t.textContent = e;
    else {
      let i, n;
      const r = this.getCaptionConfig();
      if (r.name && (i = this.attachment.getFilename()), r.size && (n = this.attachment.getFormattedFilesize()), i) {
        const a = E({ tagName: "span", className: At.attachmentName, textContent: i });
        t.appendChild(a);
      }
      if (n) {
        i && t.appendChild(document.createTextNode(" "));
        const a = E({ tagName: "span", className: At.attachmentSize, textContent: n });
        t.appendChild(a);
      }
    }
    return t;
  }
  getClassName() {
    const t = [At.attachment, "".concat(At.attachment, "--").concat(this.attachment.getType())], e = this.attachment.getExtension();
    return e && t.push("".concat(At.attachment, "--").concat(e)), t.join(" ");
  }
  getData() {
    const t = { trixAttachment: JSON.stringify(this.attachment), trixContentType: this.attachment.getContentType(), trixId: this.attachment.id }, { attributes: e } = this.attachmentPiece;
    return e.isEmpty() || (t.trixAttributes = JSON.stringify(e)), this.attachment.isPending() && (t.trixSerialize = !1), t;
  }
  getHref() {
    if (!tl(this.attachment.getContent(), "a")) {
      const t = this.attachment.getHref();
      if (t && Ie.isValidAttribute("a", "href", t)) return t;
    }
  }
  getCaptionConfig() {
    var t;
    const e = this.attachment.getType(), i = sa((t = Pn[e]) === null || t === void 0 ? void 0 : t.caption);
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
const Ms = (s) => E({ tagName: "span", textContent: ui, data: { trixCursorTarget: s, trixSerialize: !1 } }), tl = function(s, t) {
  const e = E("div");
  return mi.setHTML(e, s || ""), e.querySelector(t);
};
class ua extends zn {
  constructor() {
    super(...arguments), this.attachment.previewDelegate = this;
  }
  createContentNodes() {
    return this.image = E({ tagName: "img", attributes: { src: "" }, data: { trixMutable: !0 } }), this.refresh(this.image), [this.image];
  }
  createCaptionElement() {
    const t = super.createCaptionElement(...arguments);
    return t.textContent || t.setAttribute("data-trix-placeholder", v.captionPlaceholder), t;
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
    const n = this.attachment.getWidth(), r = this.attachment.getHeight(), a = this.attachment.getAttribute("alt");
    n != null && (t.width = n), r != null && (t.height = r), a != null && (t.alt = a);
    const o = ["imageElement", this.attachment.id, t.src, t.width, t.height].join("/");
    t.dataset.trixStoreKey = o;
  }
  attachmentDidChangeAttributes() {
    return this.refresh(this.image), this.refresh();
  }
}
class ma extends Ut {
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
    const t = this.attachment.isPreviewable() ? ua : zn;
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
          const a = E("br");
          e.push(a);
        }
        if (r.length) {
          const a = document.createTextNode(this.preserveSpaces(r));
          e.push(a);
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
      const a = Ln(e);
      if (a) {
        if (a.tagName) {
          var r;
          const o = E(a.tagName);
          r ? (r.appendChild(o), r = o) : t = r = o;
        }
        if (a.styleProperty && (n[a.styleProperty] = i), a.style) for (e in a.style) i = a.style[e], n[e] = i;
      }
    }
    if (Object.keys(n).length) for (e in t || (t = E("span")), n) i = n[e], t.style[e] = i;
    return t;
  }
  createContainerElement() {
    for (const t in this.attributes) {
      const e = this.attributes[t], i = Ln(t);
      if (i && i.groupTagName) {
        const n = {};
        return n[t] = e, E(i.groupTagName, n);
      }
    }
  }
  preserveSpaces(t) {
    return this.context.isLast && (t = t.replace(/\ $/, St)), t = t.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(St, " $2")).replace(/\ {2}/g, "".concat(St, " ")).replace(/\ {2}/g, " ".concat(St)), (this.context.isFirst || this.context.followsWhitespace) && (t = t.replace(/^\ /, St)), t;
  }
}
class ga extends Ut {
  constructor() {
    super(...arguments), this.text = this.object, this.textConfig = this.options.textConfig;
  }
  createNodes() {
    const t = [], e = Wn.groupObjects(this.getPieces()), i = e.length - 1;
    for (let r = 0; r < e.length; r++) {
      const a = e[r], o = {};
      r === 0 && (o.isFirst = !0), r === i && (o.isLast = !0), el(n) && (o.followsWhitespace = !0);
      const l = this.findOrCreateCachedChildView(ma, a, { textConfig: this.textConfig, context: o });
      t.push(...Array.from(l.getNodes() || []));
      var n = a;
    }
    return t;
  }
  getPieces() {
    return Array.from(this.text.getPieces()).filter((t) => !t.hasAttribute("blockBreak"));
  }
}
const el = (s) => /\s$/.test(s == null ? void 0 : s.toString()), { css: Ns } = Be;
class pa extends Ut {
  constructor() {
    super(...arguments), this.block = this.object, this.attributes = this.block.getAttributes();
  }
  createNodes() {
    const t = [document.createComment("block")];
    if (this.block.isEmpty()) t.push(E("br"));
    else {
      var e;
      const i = (e = F(this.block.getLastAttribute())) === null || e === void 0 ? void 0 : e.text, n = this.findOrCreateCachedChildView(ga, this.block.text, { textConfig: i });
      t.push(...Array.from(n.getNodes() || [])), this.shouldAddExtraNewlineElement() && t.push(E("br"));
    }
    if (this.attributes.length) return t;
    {
      let i;
      const { tagName: n } = X.default;
      this.block.isRTL() && (i = { dir: "rtl" });
      const r = E({ tagName: n, attributes: i });
      return t.forEach((a) => r.appendChild(a)), [r];
    }
  }
  createContainerElement(t) {
    const e = {};
    let i;
    const n = this.attributes[t], { tagName: r, htmlAttributes: a = [] } = F(n);
    if (t === 0 && this.block.isRTL() && Object.assign(e, { dir: "rtl" }), n === "attachmentGallery") {
      const o = this.block.getBlockBreakPosition();
      i = "".concat(Ns.attachmentGallery, " ").concat(Ns.attachmentGallery, "--").concat(o);
    }
    return Object.entries(this.block.htmlAttributes).forEach((o) => {
      let [l, c] = o;
      a.includes(l) && (e[l] = c);
    }), E({ tagName: r, className: i, attributes: e });
  }
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }
}
class gi extends Ut {
  static render(t) {
    const e = E("div"), i = new this(t, { element: e });
    return i.render(), i.sync(), e;
  }
  constructor() {
    super(...arguments), this.element = this.options.element, this.elementStore = new So(), this.setDocument(this.object);
  }
  setDocument(t) {
    t.isEqualTo(this.document) || (this.document = this.object = t);
  }
  render() {
    if (this.childViews = [], this.shadowElement = E("div"), !this.document.isEmpty()) {
      const t = Wn.groupObjects(this.document.getBlocks(), { asTree: !0 });
      Array.from(t).forEach((e) => {
        const i = this.findOrCreateCachedChildView(pa, e);
        Array.from(i.getNodes()).map((n) => this.shadowElement.appendChild(n));
      });
    }
  }
  isSynced() {
    return il(this.shadowElement, this.element);
  }
  sync() {
    const t = Xr("trix-before-render", { cancelable: !1, attributes: { render: (i, n) => {
      for (; i.lastChild; ) i.removeChild(i.lastChild);
      i.appendChild(n);
    } } });
    this.element.dispatchEvent(t);
    const e = this.createDocumentFragmentForSync();
    return t.render(this.element, e), this.didSync();
  }
  didSync() {
    return this.elementStore.reset(Ps(this.element)), Un(() => this.garbageCollectCachedViews());
  }
  createDocumentFragmentForSync() {
    const t = document.createDocumentFragment();
    return Array.from(this.shadowElement.childNodes).forEach((e) => {
      t.appendChild(e.cloneNode(!0));
    }), Array.from(Ps(t)).forEach((e) => {
      const i = this.elementStore.remove(e);
      i && e.parentNode.replaceChild(i, e);
    }), t;
  }
}
const Ps = (s) => s.querySelectorAll("[data-trix-store-key]"), il = (s, t) => Fs(s.innerHTML) === Fs(t.innerHTML), Fs = (s) => s.replace(/&nbsp;/g, " ");
function nl(s) {
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
function G(s, t, e) {
  return (t = nl(t)) in s ? Object.defineProperty(s, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : s[t] = e, s;
}
function w(s, t) {
  return sl(s, fa(s, t, "get"));
}
function Le(s, t, e) {
  return rl(s, fa(s, t, "set"), e), e;
}
function fa(s, t, e) {
  if (!t.has(s)) throw new TypeError("attempted to " + e + " private field on non-instance");
  return t.get(s);
}
function sl(s, t) {
  return t.get ? t.get.call(s) : t.value;
}
function rl(s, t, e) {
  if (t.set) t.set.call(s, e);
  else {
    if (!t.writable) throw new TypeError("attempted to set read only private field");
    t.value = e;
  }
}
function Ge(s, t, e) {
  if (!t.has(s)) throw new TypeError("attempted to get private field on non-instance");
  return e;
}
function ba(s, t) {
  if (t.has(s)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function ne(s, t, e) {
  ba(s, t), t.set(s, e);
}
class Vt extends $t {
  static registerType(t, e) {
    e.type = t, this.types[t] = e;
  }
  static fromJSON(t) {
    const e = this.types[t.type];
    if (e) return e.fromJSON(t);
  }
  constructor(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.attributes = et.box(e);
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
G(Vt, "types", {});
class _a extends oi {
  constructor(t) {
    super(...arguments), this.url = t;
  }
  perform(t) {
    const e = new Image();
    e.onload = () => (e.width = this.width = e.naturalWidth, e.height = this.height = e.naturalHeight, t(!0, e)), e.onerror = () => t(!1), e.src = this.url;
  }
}
class ae extends $t {
  static attachmentForFile(t) {
    const e = new this(this.attributesForFile(t));
    return e.setFile(t), e;
  }
  static attributesForFile(t) {
    return new et({ filename: t.name, filesize: t.size, contentType: t.type });
  }
  static fromJSON(t) {
    return new this(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(t), this.releaseFile = this.releaseFile.bind(this), this.attributes = et.box(t), this.didChangeAttributes();
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
    var i, n, r, a;
    if (!this.attributes.isEqualTo(e)) return this.attributes = e, this.didChangeAttributes(), (i = this.previewDelegate) === null || i === void 0 || (n = i.attachmentDidChangeAttributes) === null || n === void 0 || n.call(i, this), (r = this.delegate) === null || r === void 0 || (a = r.attachmentDidChangeAttributes) === null || a === void 0 ? void 0 : a.call(r, this);
  }
  didChangeAttributes() {
    if (this.isPreviewable()) return this.preloadURL();
  }
  isPending() {
    return this.file != null && !(this.getURL() || this.getHref());
  }
  isPreviewable() {
    return this.attributes.has("previewable") ? this.attributes.get("previewable") : ae.previewablePattern.test(this.getContentType());
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
    return typeof t == "number" ? Jr.formatter(t) : "";
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
      return this.preloadingURL = t, new _a(t).then((i) => {
        let { width: n, height: r } = i;
        return this.getWidth() && this.getHeight() || this.setAttributes({ width: n, height: r }), this.preloadingURL = null, this.setPreviewURL(t), e == null ? void 0 : e();
      }).catch(() => (this.preloadingURL = null, e == null ? void 0 : e()));
  }
}
G(ae, "previewablePattern", /^image(\/(gif|png|webp|jpe?g)|$)/);
class se extends Vt {
  static fromJSON(t) {
    return new this(ae.fromJSON(t.attachment), t.attributes);
  }
  constructor(t) {
    super(...arguments), this.attachment = t, this.length = 1, this.ensureAttachmentExclusivelyHasAttribute("href"), this.attachment.hasContent() || this.removeProhibitedAttributes();
  }
  ensureAttachmentExclusivelyHasAttribute(t) {
    this.hasAttribute(t) && (this.attachment.hasAttribute(t) || this.attachment.setAttributes(this.attributes.slice([t])), this.attributes = this.attributes.remove(t));
  }
  removeProhibitedAttributes() {
    const t = this.attributes.slice(se.permittedAttributes);
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
G(se, "permittedAttributes", ["caption", "presentation"]), Vt.registerType("attachment", se);
class Kn extends Vt {
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
Vt.registerType("string", Kn);
class li extends $t {
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
    return new this.constructor($n(this.objects, ...e));
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
    const [i, n, r] = this.splitObjectsAtRange(t), a = i.map((o, l) => n <= l && l <= r ? e(o) : o);
    return new this.constructor(a);
  }
  splitObjectsAtRange(t) {
    let e, [i, n, r] = this.splitObjectAtPosition(ol(t));
    return [i, e] = new this.constructor(i).splitObjectAtPosition(ll(t) + r), [i, n, e - 1];
  }
  getObjectAtPosition(t) {
    const { index: e } = this.findIndexAndOffsetAtPosition(t);
    return this.objects[e];
  }
  splitObjectAtPosition(t) {
    let e, i;
    const { index: n, offset: r } = this.findIndexAndOffsetAtPosition(t), a = this.objects.slice(0);
    if (n != null) if (r === 0) e = n, i = 0;
    else {
      const o = this.getObjectAtIndex(n), [l, c] = o.splitAtOffset(r);
      a.splice(n, 1, l, c), e = n + 1, i = l.getLength() - r;
    }
    else e = a.length, i = 0;
    return [a, e, i];
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
    return super.isEqualTo(...arguments) || al(this.objects, t == null ? void 0 : t.objects);
  }
  contentsForInspection() {
    return { objects: "[".concat(this.objects.map((t) => t.inspect()).join(", "), "]") };
  }
}
const al = function(s) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (s.length !== t.length) return !1;
  let e = !0;
  for (let i = 0; i < s.length; i++) {
    const n = s[i];
    e && !n.isEqualTo(t[i]) && (e = !1);
  }
  return e;
}, ol = (s) => s[0], ll = (s) => s[1];
class dt extends $t {
  static textForAttachmentWithAttributes(t, e) {
    return new this([new se(t, e)]);
  }
  static textForStringWithAttributes(t, e) {
    return new this([new Kn(t, e)]);
  }
  static fromJSON(t) {
    return new this(Array.from(t).map((e) => Vt.fromJSON(e)));
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments);
    const e = t.filter((i) => !i.isEmpty());
    this.pieceList = new li(e);
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
    return et.fromCommonAttributesOfObjects(t).toObject();
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
    return go(this.toString());
  }
  isRTL() {
    return this.getDirection() === "rtl";
  }
}
class ut extends $t {
  static fromJSON(t) {
    return new this(dt.fromJSON(t.text), t.attributes, t.htmlAttributes);
  }
  constructor(t, e, i) {
    super(...arguments), this.text = dl(t || new dt()), this.attributes = e || [], this.htmlAttributes = i || {};
  }
  isEmpty() {
    return this.text.isBlockBreak();
  }
  isEqualTo(t) {
    return !!super.isEqualTo(t) || this.text.isEqualTo(t == null ? void 0 : t.text) && qt(this.attributes, t == null ? void 0 : t.attributes) && re(this.htmlAttributes, t == null ? void 0 : t.htmlAttributes);
  }
  copyWithText(t) {
    return new ut(t, this.attributes, this.htmlAttributes);
  }
  copyWithoutText() {
    return this.copyWithText(null);
  }
  copyWithAttributes(t) {
    return new ut(this.text, t, this.htmlAttributes);
  }
  copyWithoutAttributes() {
    return this.copyWithAttributes(null);
  }
  copyUsingObjectMap(t) {
    const e = t.find(this.text);
    return e ? this.copyWithText(e) : this.copyWithText(this.text.copyUsingObjectMap(t));
  }
  addAttribute(t) {
    const e = this.attributes.concat(qs(t));
    return this.copyWithAttributes(e);
  }
  addHTMLAttribute(t, e) {
    const i = Object.assign({}, this.htmlAttributes, { [t]: e });
    return new ut(this.text, this.attributes, i);
  }
  removeAttribute(t) {
    const { listAttribute: e } = F(t), i = $s($s(this.attributes, t), e);
    return this.copyWithAttributes(i);
  }
  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }
  getLastAttribute() {
    return Hs(this.attributes);
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
    return Hs(this.getNestableAttributes());
  }
  getNestableAttributes() {
    return this.attributes.filter((t) => F(t).nestable);
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
      const e = this.attributes.lastIndexOf(t), i = $n(this.attributes, e + 1, 0, ...qs(t));
      return this.copyWithAttributes(i);
    }
    return this;
  }
  getListItemAttributes() {
    return this.attributes.filter((t) => F(t).listAttribute);
  }
  isListItem() {
    var t;
    return (t = F(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.listAttribute;
  }
  isTerminalBlock() {
    var t;
    return (t = F(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.terminal;
  }
  breaksOnReturn() {
    var t;
    return (t = F(this.getLastAttribute())) === null || t === void 0 ? void 0 : t.breakOnReturn;
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
    const e = dt.textForStringWithAttributes(`
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
    return va(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
  }
  canBeGrouped(t) {
    return this.attributes[t];
  }
  canBeGroupedWith(t, e) {
    const i = t.getAttributes(), n = i[e], r = this.attributes[e];
    return r === n && !(F(r).group === !1 && !(() => {
      if (!We) {
        We = [];
        for (const a in X) {
          const { listAttribute: o } = X[a];
          o != null && We.push(o);
        }
      }
      return We;
    })().includes(i[e + 1])) && (this.getDirection() === t.getDirection() || t.isEmpty());
  }
}
const dl = function(s) {
  return s = cl(s), s = ul(s);
}, cl = function(s) {
  let t = !1;
  const e = s.getPieces();
  let i = e.slice(0, e.length - 1);
  const n = e[e.length - 1];
  return n ? (i = i.map((r) => r.isBlockBreak() ? (t = !0, ml(r)) : r), t ? new dt([...i, n]) : s) : s;
}, hl = dt.textForStringWithAttributes(`
`, { blockBreak: !0 }), ul = function(s) {
  return va(s) ? s : s.appendText(hl);
}, va = function(s) {
  const t = s.getLength();
  return t === 0 ? !1 : s.getTextAtRange([t - 1, t]).isBlockBreak();
}, ml = (s) => s.copyWithoutAttribute("blockBreak"), qs = function(s) {
  const { listAttribute: t } = F(s);
  return t ? [t, s] : [s];
}, Hs = (s) => s.slice(-1)[0], $s = function(s, t) {
  const e = s.lastIndexOf(t);
  return e === -1 ? s : $n(s, e, 1);
};
class nt extends $t {
  static fromJSON(t) {
    return new this(Array.from(t).map((e) => ut.fromJSON(e)));
  }
  static fromString(t, e) {
    const i = dt.textForStringWithAttributes(t, e);
    return new this([new ut(i)]);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    super(...arguments), t.length === 0 && (t = [new ut()]), this.blockList = li.box(t);
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
    const e = new Eo(t.getObjects());
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
    e = k(e);
    let [n] = e;
    const { index: r, offset: a } = this.locationFromPosition(n);
    let o = this;
    const l = this.getBlockAtPosition(n);
    return vt(e) && l.isEmpty() && !l.hasAttributes() ? o = new this.constructor(o.blockList.removeObjectAtIndex(r)) : l.getBlockBreakPosition() === a && n++, o = o.removeTextAtRange(e), new this.constructor(o.blockList.insertSplittableListAtPosition(i, n));
  }
  mergeDocumentAtRange(t, e) {
    let i, n;
    e = k(e);
    const [r] = e, a = this.locationFromPosition(r), o = this.getBlockAtIndex(a.index).getAttributes(), l = t.getBaseBlockAttributes(), c = o.slice(-l.length);
    if (qt(l, c)) {
      const p = o.slice(0, -l.length);
      i = t.copyWithBaseBlockAttributes(p);
    } else i = t.copy({ consolidateBlocks: !0 }).copyWithBaseBlockAttributes(o);
    const u = i.getBlockCount(), m = i.getBlockAtIndex(0);
    if (qt(o, m.getAttributes())) {
      const p = m.getTextWithoutBlockBreak();
      if (n = this.insertTextAtRange(p, e), u > 1) {
        i = new this.constructor(i.getBlocks().slice(1));
        const h = r + p.getLength();
        n = n.insertDocumentAtRange(i, h);
      }
    } else n = this.insertDocumentAtRange(i, e);
    return n;
  }
  insertTextAtRange(t, e) {
    e = k(e);
    const [i] = e, { index: n, offset: r } = this.locationFromPosition(i), a = this.removeTextAtRange(e);
    return new this.constructor(a.blockList.editObjectAtIndex(n, (o) => o.copyWithText(o.text.insertTextAtPosition(t, r))));
  }
  removeTextAtRange(t) {
    let e;
    t = k(t);
    const [i, n] = t;
    if (vt(t)) return this;
    const [r, a] = Array.from(this.locationRangeFromRange(t)), o = r.index, l = r.offset, c = this.getBlockAtIndex(o), u = a.index, m = a.offset, p = this.getBlockAtIndex(u);
    if (n - i == 1 && c.getBlockBreakPosition() === l && p.getBlockBreakPosition() !== m && p.text.getStringAtPosition(m) === `
`) e = this.blockList.editObjectAtIndex(u, (h) => h.copyWithText(h.text.removeTextAtRange([m, m + 1])));
    else {
      let h;
      const f = c.text.getTextAtRange([0, l]), A = p.text.getTextAtRange([m, p.getLength()]), I = f.appendText(A);
      h = o !== u && l === 0 && c.getAttributeLevel() >= p.getAttributeLevel() ? p.copyWithText(I) : c.copyWithText(I);
      const $ = u + 1 - o;
      e = this.blockList.splice(o, $, h);
    }
    return new this.constructor(e);
  }
  moveTextFromRangeToPosition(t, e) {
    let i;
    t = k(t);
    const [n, r] = t;
    if (n <= e && e <= r) return this;
    let a = this.getDocumentAtRange(t), o = this.removeTextAtRange(t);
    const l = n < e;
    l && (e -= a.getLength());
    const [c, ...u] = a.getBlocks();
    return u.length === 0 ? (i = c.getTextWithoutBlockBreak(), l && (e += 1)) : i = c.text, o = o.insertTextAtRange(i, e), u.length === 0 ? o : (a = new this.constructor(u), e += i.getLength(), o.insertDocumentAtRange(a, e));
  }
  addAttributeAtRange(t, e, i) {
    let { blockList: n } = this;
    return this.eachBlockAtRange(i, (r, a, o) => n = n.editObjectAtIndex(o, function() {
      return F(t) ? r.addAttribute(t, e) : a[0] === a[1] ? r : r.copyWithText(r.text.addAttributeAtRange(t, e, a));
    })), new this.constructor(n);
  }
  addAttribute(t, e) {
    let { blockList: i } = this;
    return this.eachBlock((n, r) => i = i.editObjectAtIndex(r, () => n.addAttribute(t, e))), new this.constructor(i);
  }
  removeAttributeAtRange(t, e) {
    let { blockList: i } = this;
    return this.eachBlockAtRange(e, function(n, r, a) {
      F(t) ? i = i.editObjectAtIndex(a, () => n.removeAttribute(t)) : r[0] !== r[1] && (i = i.editObjectAtIndex(a, () => n.copyWithText(n.text.removeAttributeAtRange(t, r))));
    }), new this.constructor(i);
  }
  updateAttributesForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e), [n] = Array.from(i), { index: r } = this.locationFromPosition(n), a = this.getTextAtIndex(r);
    return new this.constructor(this.blockList.editObjectAtIndex(r, (o) => o.copyWithText(a.updateAttributesForAttachment(t, e))));
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
    t = k(t);
    const [i] = t, { offset: n } = this.locationFromPosition(i), r = this.removeTextAtRange(t);
    return n === 0 && (e = [new ut()]), new this.constructor(r.blockList.insertSplittableListAtPosition(new li(e), i));
  }
  applyBlockAttributeAtRange(t, e, i) {
    const n = this.expandRangeToLineBreaksAndSplitBlocks(i);
    let r = n.document;
    i = n.range;
    const a = F(t);
    if (a.listAttribute) {
      r = r.removeLastListAttributeAtRange(i, { exceptAttributeName: t });
      const o = r.convertLineBreaksToBlockBreaksInRange(i);
      r = o.document, i = o.range;
    } else r = a.exclusive ? r.removeBlockAttributesAtRange(i) : a.terminal ? r.removeLastTerminalAttributeAtRange(i) : r.consolidateBlocksAtRange(i);
    return r.addAttributeAtRange(t, e, i);
  }
  removeLastListAttributeAtRange(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, { blockList: i } = this;
    return this.eachBlockAtRange(t, function(n, r, a) {
      const o = n.getLastAttribute();
      o && F(o).listAttribute && o !== e.exceptAttributeName && (i = i.editObjectAtIndex(a, () => n.removeAttribute(o)));
    }), new this.constructor(i);
  }
  removeLastTerminalAttributeAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, function(i, n, r) {
      const a = i.getLastAttribute();
      a && F(a).terminal && (e = e.editObjectAtIndex(r, () => i.removeAttribute(a)));
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
    t = k(t);
    let [i, n] = t;
    const r = this.locationFromPosition(i), a = this.locationFromPosition(n);
    let o = this;
    const l = o.getBlockAtIndex(r.index);
    if (r.offset = l.findLineBreakInDirectionFromPosition("backward", r.offset), r.offset != null && (e = o.positionFromLocation(r), o = o.insertBlockBreakAtRange([e, e + 1]), a.index += 1, a.offset -= o.getBlockAtIndex(r.index).getLength(), r.index += 1), r.offset = 0, a.offset === 0 && a.index > r.index) a.index -= 1, a.offset = o.getBlockAtIndex(a.index).getBlockBreakPosition();
    else {
      const c = o.getBlockAtIndex(a.index);
      c.text.getStringAtRange([a.offset - 1, a.offset]) === `
` ? a.offset -= 1 : a.offset = c.findLineBreakInDirectionFromPosition("forward", a.offset), a.offset !== c.getBlockBreakPosition() && (e = o.positionFromLocation(a), o = o.insertBlockBreakAtRange([e, e + 1]));
    }
    return i = o.positionFromLocation(r), n = o.positionFromLocation(a), { document: o, range: t = k([i, n]) };
  }
  convertLineBreaksToBlockBreaksInRange(t) {
    t = k(t);
    let [e] = t;
    const i = this.getStringAtRange(t).slice(0, -1);
    let n = this;
    return i.replace(/.*?\n/g, function(r) {
      e += r.length, n = n.insertBlockBreakAtRange([e - 1, e]);
    }), { document: n, range: t };
  }
  consolidateBlocksAtRange(t) {
    t = k(t);
    const [e, i] = t, n = this.locationFromPosition(e).index, r = this.locationFromPosition(i).index;
    return new this.constructor(this.blockList.consolidateFromIndexToIndex(n, r));
  }
  getDocumentAtRange(t) {
    t = k(t);
    const e = this.blockList.getSplittableListInRange(t).toArray();
    return new this.constructor(e);
  }
  getStringAtRange(t) {
    let e;
    const i = t = k(t);
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
    t = k(t);
    const [r, a] = t, o = this.locationFromPosition(r), l = this.locationFromPosition(a);
    if (o.index === l.index) return i = this.getBlockAtIndex(o.index), n = [o.offset, l.offset], e(i, n, o.index);
    for (let c = o.index; c <= l.index; c++) if (i = this.getBlockAtIndex(c), i) {
      switch (c) {
        case o.index:
          n = [o.offset, i.text.getLength()];
          break;
        case l.index:
          n = [0, l.offset];
          break;
        default:
          n = [0, i.text.getLength()];
      }
      e(i, n, c);
    }
  }
  getCommonAttributesAtRange(t) {
    t = k(t);
    const [e] = t;
    if (vt(t)) return this.getCommonAttributesAtPosition(e);
    {
      const i = [], n = [];
      return this.eachBlockAtRange(t, function(r, a) {
        if (a[0] !== a[1]) return i.push(r.text.getCommonAttributesAtRange(a)), n.push(Us(r));
      }), et.fromCommonAttributesOfObjects(i).merge(et.fromCommonAttributesOfObjects(n)).toObject();
    }
  }
  getCommonAttributesAtPosition(t) {
    let e, i;
    const { index: n, offset: r } = this.locationFromPosition(t), a = this.getBlockAtIndex(n);
    if (!a) return {};
    const o = Us(a), l = a.text.getAttributesAtPosition(r), c = a.text.getAttributesAtPosition(r - 1), u = Object.keys(Ft).filter((m) => Ft[m].inheritable);
    for (e in c) i = c[e], (i === l[e] || u.includes(e)) && (o[e] = i);
    return o;
  }
  getRangeOfCommonAttributeAtPosition(t, e) {
    const { index: i, offset: n } = this.locationFromPosition(e), r = this.getTextAtIndex(i), [a, o] = Array.from(r.getExpandedRangeForAttributeAtOffset(t, n)), l = this.positionFromLocation({ index: i, offset: a }), c = this.positionFromLocation({ index: i, offset: o });
    return k([l, c]);
  }
  getBaseBlockAttributes() {
    let t = this.getBlockAtIndex(0).getAttributes();
    for (let e = 1; e < this.getBlockCount(); e++) {
      const i = this.getBlockAtIndex(e).getAttributes(), n = Math.min(t.length, i.length);
      t = (() => {
        const r = [];
        for (let a = 0; a < n && i[a] === t[a]; a++) r.push(i[a]);
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
      const { text: r } = i[n], a = r.getRangeOfAttachment(t);
      if (a) return k([e + a[0], e + a[1]]);
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
    return this.getPieces().forEach((a) => {
      const o = a.getLength();
      (function(l) {
        return e ? l.getAttribute(t) === e : l.hasAttribute(t);
      })(a) && (n[1] === i ? n[1] = i + o : r.push(n = [i, i + o])), i += o;
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
    return k(this.locationFromPosition(t));
  }
  locationRangeFromRange(t) {
    if (!(t = k(t))) return;
    const [e, i] = Array.from(t), n = this.locationFromPosition(e), r = this.locationFromPosition(i);
    return k([n, r]);
  }
  rangeFromLocationRange(t) {
    let e;
    t = k(t);
    const i = this.positionFromLocation(t[0]);
    return vt(t) || (e = this.positionFromLocation(t[1])), k([i, e]);
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
const Us = function(s) {
  const t = {}, e = s.getLastAttribute();
  return e && (t[e] = !0), t;
}, Xi = function(s) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return { string: s = ye(s), attributes: t, type: "string" };
}, Vs = (s, t) => {
  try {
    return JSON.parse(s.getAttribute("data-trix-".concat(t)));
  } catch {
    return {};
  }
};
class Re extends H {
  static parse(t, e) {
    const i = new this(t, e);
    return i.parse(), i;
  }
  constructor(t) {
    let { referenceElement: e, purifyOptions: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.html = t, this.referenceElement = e, this.purifyOptions = i, this.blocks = [], this.blockElements = [], this.processedElements = [];
  }
  getDocument() {
    return nt.fromJSON(this.blocks);
  }
  parse() {
    try {
      this.createHiddenContainer(), mi.setHTML(this.containerElement, this.html, { purifyOptions: this.purifyOptions });
      const t = ri(this.containerElement, { usingFilter: pl });
      for (; t.nextNode(); ) this.processNode(t.currentNode);
      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }
  createHiddenContainer() {
    return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(!1), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = E({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
  }
  removeHiddenContainer() {
    return Ct(this.containerElement);
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
      qt(n, (i = this.currentBlock) === null || i === void 0 ? void 0 : i.attributes) || (this.currentBlock = this.appendBlockForAttributesWithElement(n, e, r), this.currentBlockElement = e);
    }
  }
  appendBlockForElement(t) {
    const e = this.isBlockElement(t), i = Ot(this.currentBlockElement, t);
    if (e && !this.isBlockElement(t.firstChild)) {
      if (!this.isInsignificantTextNode(t.firstChild) || !this.isBlockElement(t.firstElementChild)) {
        const n = this.getBlockAttributes(t), r = this.getBlockHTMLAttributes(t);
        if (t.firstChild) {
          if (i && qt(n, this.currentBlock.attributes)) return this.appendStringWithAttributes(`
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
    return js(t.parentNode) || (e = jn(e), ya((i = t.previousSibling) === null || i === void 0 ? void 0 : i.textContent) && (e = fl(e))), this.appendStringWithAttributes(e, this.getTextAttributes(t.parentNode));
  }
  processElement(t) {
    let e;
    if (Nt(t)) {
      if (e = Vs(t, "attachment"), Object.keys(e).length) {
        const i = this.getTextAttributes(t);
        this.appendAttachmentWithAttributes(e, i), t.innerHTML = "";
      }
      return this.processedElements.push(t);
    }
    switch (Y(t)) {
      case "br":
        return this.isExtraBR(t) || this.isBlockElement(t.nextSibling) || this.appendStringWithAttributes(`
`, this.getTextAttributes(t)), this.processedElements.push(t);
      case "img":
        e = { url: t.getAttribute("src"), contentType: "image" };
        const i = ((n) => {
          const r = n.getAttribute("width"), a = n.getAttribute("height"), o = {};
          return r && (o.width = parseInt(r, 10)), a && (o.height = parseInt(a, 10)), o;
        })(t);
        for (const n in i) {
          const r = i[n];
          e[n] = r;
        }
        return this.appendAttachmentWithAttributes(e, this.getTextAttributes(t)), this.processedElements.push(t);
      case "tr":
        if (this.needsTableSeparator(t)) return this.appendStringWithAttributes(ii.tableRowSeparator);
        break;
      case "td":
        if (this.needsTableSeparator(t)) return this.appendStringWithAttributes(ii.tableCellSeparator);
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
    return this.appendPiece(Xi(t, e));
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
    if ((n == null ? void 0 : n.type) !== "string") return i.push(Xi(t));
    n.string += t;
  }
  prependStringToTextAtIndex(t, e) {
    const { text: i } = this.blocks[e], n = i[0];
    if ((n == null ? void 0 : n.type) !== "string") return i.unshift(Xi(t));
    n.string = t + n.string;
  }
  getTextAttributes(t) {
    let e;
    const i = {};
    for (const n in Ft) {
      const r = Ft[n];
      if (r.tagName && Lt(t, { matchingSelector: r.tagName, untilNode: this.containerElement })) i[n] = !0;
      else if (r.parser) {
        if (e = r.parser(t), e) {
          let a = !1;
          for (const o of this.findBlockElementAncestors(t)) if (r.parser(o) === e) {
            a = !0;
            break;
          }
          a || (i[n] = e);
        }
      } else r.styleProperty && (e = t.style[r.styleProperty], e && (i[n] = e));
    }
    if (Nt(t)) {
      const n = Vs(t, "attributes");
      for (const r in n) e = n[r], i[r] = e;
    }
    return i;
  }
  getBlockAttributes(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      for (const n in X) {
        const r = X[n];
        var i;
        r.parse !== !1 && Y(t) === r.tagName && ((i = r.test) !== null && i !== void 0 && i.call(r, t) || !r.test) && (e.push(n), r.listAttribute && e.push(r.listAttribute));
      }
      t = t.parentNode;
    }
    return e.reverse();
  }
  getBlockHTMLAttributes(t) {
    const e = {}, i = Object.values(X).find((n) => n.tagName === Y(t));
    return ((i == null ? void 0 : i.htmlAttributes) || []).forEach((n) => {
      t.hasAttribute(n) && (e[n] = t.getAttribute(n));
    }), e;
  }
  findBlockElementAncestors(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      const i = Y(t);
      xe().includes(i) && e.push(t), t = t.parentNode;
    }
    return e;
  }
  isBlockElement(t) {
    if ((t == null ? void 0 : t.nodeType) === Node.ELEMENT_NODE && !Nt(t) && !Lt(t, { matchingSelector: "td", untilNode: this.containerElement })) return xe().includes(Y(t)) || window.getComputedStyle(t).display === "block";
  }
  isInsignificantTextNode(t) {
    if ((t == null ? void 0 : t.nodeType) !== Node.TEXT_NODE || !bl(t.data)) return;
    const { parentNode: e, previousSibling: i, nextSibling: n } = t;
    return gl(e.previousSibling) && !this.isBlockElement(e.previousSibling) || js(e) ? void 0 : !i || this.isBlockElement(i) || !n || this.isBlockElement(n);
  }
  isExtraBR(t) {
    return Y(t) === "br" && this.isBlockElement(t.parentNode) && t.parentNode.lastChild === t;
  }
  needsTableSeparator(t) {
    if (ii.removeBlankTableCells) {
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
    if (e && e.textContent && !xe().includes(Y(e)) && !this.processedElements.includes(e)) return Ws(e);
  }
  getMarginOfDefaultBlockElement() {
    const t = E(X.default.tagName);
    return this.containerElement.appendChild(t), Ws(t);
  }
}
const js = function(s) {
  const { whiteSpace: t } = window.getComputedStyle(s);
  return ["pre", "pre-wrap", "pre-line"].includes(t);
}, gl = (s) => s && !ya(s.textContent), Ws = function(s) {
  const t = window.getComputedStyle(s);
  if (t.display === "block") return { top: parseInt(t.marginTop), bottom: parseInt(t.marginBottom) };
}, pl = function(s) {
  return Y(s) === "style" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, fl = (s) => s.replace(new RegExp("^".concat(Vn.source, "+")), ""), bl = (s) => new RegExp("^".concat(Vn.source, "*$")).test(s), ya = (s) => /\s$/.test(s), _l = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"], kn = "data-trix-serialized-attributes", vl = "[".concat(kn, "]"), yl = new RegExp("<!--block-->", "g"), Al = { "application/json": function(s) {
  let t;
  if (s instanceof nt) t = s;
  else {
    if (!(s instanceof HTMLElement)) throw new Error("unserializable object");
    t = Re.parse(s.innerHTML).getDocument();
  }
  return t.toSerializableDocument().toJSONString();
}, "text/html": function(s) {
  let t;
  if (s instanceof nt) t = gi.render(s);
  else {
    if (!(s instanceof HTMLElement)) throw new Error("unserializable object");
    t = s.cloneNode(!0);
  }
  return Array.from(t.querySelectorAll("[data-trix-serialize=false]")).forEach((e) => {
    Ct(e);
  }), _l.forEach((e) => {
    Array.from(t.querySelectorAll("[".concat(e, "]"))).forEach((i) => {
      i.removeAttribute(e);
    });
  }), Array.from(t.querySelectorAll(vl)).forEach((e) => {
    try {
      const i = JSON.parse(e.getAttribute(kn));
      e.removeAttribute(kn);
      for (const n in i) {
        const r = i[n];
        e.setAttribute(n, r);
      }
    } catch {
    }
  }), t.innerHTML.replace(yl, "");
} };
var xl = Object.freeze({ __proto__: null });
class O extends H {
  constructor(t, e) {
    super(...arguments), this.attachmentManager = t, this.attachment = e, this.id = this.attachment.id, this.file = this.attachment.file;
  }
  remove() {
    return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
  }
}
O.proxyMethod("attachment.getAttribute"), O.proxyMethod("attachment.hasAttribute"), O.proxyMethod("attachment.setAttribute"), O.proxyMethod("attachment.getAttributes"), O.proxyMethod("attachment.setAttributes"), O.proxyMethod("attachment.isPending"), O.proxyMethod("attachment.isPreviewable"), O.proxyMethod("attachment.getURL"), O.proxyMethod("attachment.getPreviewURL"), O.proxyMethod("attachment.setPreviewURL"), O.proxyMethod("attachment.getHref"), O.proxyMethod("attachment.getFilename"), O.proxyMethod("attachment.getFilesize"), O.proxyMethod("attachment.getFormattedFilesize"), O.proxyMethod("attachment.getExtension"), O.proxyMethod("attachment.getContentType"), O.proxyMethod("attachment.getFile"), O.proxyMethod("attachment.setFile"), O.proxyMethod("attachment.releaseFile"), O.proxyMethod("attachment.getUploadProgress"), O.proxyMethod("attachment.setUploadProgress");
class Aa extends H {
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
    return this.managedAttachments[t.id] || (this.managedAttachments[t.id] = new O(this, t)), this.managedAttachments[t.id];
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
class xa {
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
class Et extends H {
  constructor() {
    super(...arguments), this.document = new nt(), this.attachments = [], this.currentAttributes = {}, this.revision = 0;
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
    let { document: a, selectedRange: o } = t;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionWillLoadSnapshot) === null || i === void 0 || i.call(e), this.setDocument(a ?? new nt()), this.setSelection(o ?? [0, 0]), (n = this.delegate) === null || n === void 0 || (r = n.compositionDidLoadSnapshot) === null || r === void 0 ? void 0 : r.call(n);
  }
  insertText(t) {
    let { updatePosition: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { updatePosition: !0 };
    const i = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(t, i));
    const n = i[0], r = n + t.getLength();
    return e && this.setSelection(r), this.notifyDelegateOfInsertionAtRange([n, r]);
  }
  insertBlock() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new ut();
    const e = new nt([t]);
    return this.insertDocument(e);
  }
  insertDocument() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new nt();
    const e = this.getSelectedRange();
    this.setDocument(this.document.insertDocumentAtRange(t, e));
    const i = e[0], n = i + t.getLength();
    return this.setSelection(n), this.notifyDelegateOfInsertionAtRange([i, n]);
  }
  insertString(t, e) {
    const i = this.getCurrentTextAttributes(), n = dt.textForStringWithAttributes(t, i);
    return this.insertText(n, e);
  }
  insertBlockBreak() {
    const t = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(t));
    const e = t[0], i = e + 1;
    return this.setSelection(i), this.notifyDelegateOfInsertionAtRange([e, i]);
  }
  insertLineBreak() {
    const t = new xa(this);
    if (t.shouldDecreaseListLevel()) return this.decreaseListLevel(), this.setSelection(t.startPosition);
    if (t.shouldPrependListItem()) {
      const e = new nt([t.block.copyWithoutText()]);
      return this.insertDocument(e);
    }
    return t.shouldInsertBlockBreak() ? this.insertBlockBreak() : t.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : t.shouldBreakFormattedBlock() ? this.breakFormattedBlock(t) : this.insertString(`
`);
  }
  insertHTML(t) {
    const e = Re.parse(t, { purifyOptions: { SAFE_FOR_XML: !0 } }).getDocument(), i = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(e, i));
    const n = i[0], r = n + e.getLength() - 1;
    return this.setSelection(r), this.notifyDelegateOfInsertionAtRange([n, r]);
  }
  replaceHTML(t) {
    const e = Re.parse(t).getDocument().copyUsingObjectsFromDocument(this.document), i = this.getLocationRange({ strict: !1 }), n = this.document.rangeFromLocationRange(i);
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
        const r = ae.attachmentForFile(i);
        e.push(r);
      }
    }), this.insertAttachments(e);
  }
  insertAttachment(t) {
    return this.insertAttachments([t]);
  }
  insertAttachments(t) {
    let e = new dt();
    return Array.from(t).forEach((i) => {
      var n;
      const r = i.getType(), a = (n = Pn[r]) === null || n === void 0 ? void 0 : n.presentation, o = this.getCurrentTextAttributes();
      a && (o.presentation = a);
      const l = dt.textForAttachmentWithAttributes(i, o);
      e = e.appendText(l);
    }), this.insertText(e);
  }
  shouldManageDeletingInDirection(t) {
    const e = this.getLocationRange();
    if (vt(e)) {
      if (t === "backward" && e[0].offset === 0 || this.shouldManageMovingCursorInDirection(t)) return !0;
    } else if (e[0].index !== e[1].index) return !0;
    return !1;
  }
  deleteInDirection(t) {
    let e, i, n, { length: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const a = this.getLocationRange();
    let o = this.getSelectedRange();
    const l = vt(o);
    if (l ? i = t === "backward" && a[0].offset === 0 : n = a[0].index !== a[1].index, i && this.canDecreaseBlockAttributeLevel()) {
      const c = this.getBlock();
      if (c.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(o[0]), c.isEmpty()) return !1;
    }
    return l && (o = this.getExpandedRangeInDirection(t, { length: r }), t === "backward" && (e = this.getAttachmentAtRange(o))), e ? (this.editAttachment(e), !1) : (this.setDocument(this.document.removeTextAtRange(o)), this.setSelection(o[0]), !i && !n && void 0);
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
    return F(t) ? this.canSetCurrentBlockAttribute(t) : this.canSetCurrentTextAttribute(t);
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
    return F(t) ? this.setBlockAttribute(t, e) : (this.setTextAttribute(t, e), this.currentAttributes[t] = e, this.notifyDelegateOfCurrentAttributesChange());
  }
  setHTMLAtributeAtPosition(t, e, i) {
    var n;
    const r = this.document.getBlockAtPosition(t), a = (n = F(r.getLastAttribute())) === null || n === void 0 ? void 0 : n.htmlAttributes;
    if (r && a != null && a.includes(e)) {
      const o = this.document.setHTMLAttributeAtPosition(t, e, i);
      this.setDocument(o);
    }
  }
  setTextAttribute(t, e) {
    const i = this.getSelectedRange();
    if (!i) return;
    const [n, r] = Array.from(i);
    if (n !== r) return this.setDocument(this.document.addAttributeAtRange(t, e, i));
    if (t === "href") {
      const a = dt.textForStringWithAttributes(e, { href: e });
      return this.insertText(a);
    }
  }
  setBlockAttribute(t, e) {
    const i = this.getSelectedRange();
    if (this.canSetCurrentAttribute(t)) return this.setDocument(this.document.applyBlockAttributeAtRange(t, e, i)), this.setSelection(i);
  }
  removeCurrentAttribute(t) {
    return F(t) ? (this.removeBlockAttribute(t), this.updateCurrentAttributes()) : (this.removeTextAttribute(t), delete this.currentAttributes[t], this.notifyDelegateOfCurrentAttributesChange());
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
      if ((t = F(e.getLastNestableAttribute())) === null || t === void 0 || !t.listAttribute) return e.getNestingLevel() > 0;
      {
        const i = this.getPreviousBlock();
        if (i) return function() {
          let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
          return qt((arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).slice(0, n.length), n);
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
    const a = this.document.positionFromLocation({ index: i, offset: 0 });
    return this.setDocument(this.document.removeLastListAttributeAtRange([t, a]));
  }
  updateCurrentAttributes() {
    const t = this.getSelectedRange({ ignoreLock: !0 });
    if (t) {
      const e = this.document.getCommonAttributesAtRange(t);
      if (Array.from(Sn()).forEach((i) => {
        e[i] || this.canSetCurrentAttribute(i) || (e[i] = !1);
      }), !re(e, this.currentAttributes)) return this.currentAttributes = e, this.notifyDelegateOfCurrentAttributesChange();
    }
  }
  getCurrentAttributes() {
    return Yr.call({}, this.currentAttributes);
  }
  getCurrentTextAttributes() {
    const t = {};
    for (const e in this.currentAttributes) {
      const i = this.currentAttributes[e];
      i !== !1 && Ln(e) && (t[e] = i);
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
    return this.targetLocationRange ? this.targetLocationRange : this.getSelectionManager().getLocationRange(t) || k({ index: 0, offset: 0 });
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
    return t === "backward" ? e ? i -= e : i = this.translateUTF16PositionFromOffset(i, -1) : e ? n += e : n = this.translateUTF16PositionFromOffset(n, 1), k([i, n]);
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
      i = this.getExpandedRangeInDirection(t), e = !ai(n, i);
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
      const a = [], o = [], l = /* @__PURE__ */ new Set();
      n.forEach((u) => {
        l.add(u);
      });
      const c = /* @__PURE__ */ new Set();
      return r.forEach((u) => {
        c.add(u), l.has(u) || a.push(u);
      }), n.forEach((u) => {
        c.has(u) || o.push(u);
      }), { added: a, removed: o };
    }(this.attachments, t);
    return this.attachments = t, Array.from(i).forEach((n) => {
      var r, a;
      n.delegate = null, (r = this.delegate) === null || r === void 0 || (a = r.compositionDidRemoveAttachment) === null || a === void 0 || a.call(r, n);
    }), (() => {
      const n = [];
      return Array.from(e).forEach((r) => {
        var a, o;
        r.delegate = this, n.push((a = this.delegate) === null || a === void 0 || (o = a.compositionDidAddAttachment) === null || o === void 0 ? void 0 : o.call(a, r));
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
    const a = new nt([i.removeLastAttribute().copyWithoutText()]);
    return this.setDocument(e.insertDocumentAtRange(a, r)), this.setSelection(n);
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
Et.proxyMethod("getSelectionManager().getPointRange"), Et.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), Et.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), Et.proxyMethod("getSelectionManager().locationIsCursorTarget"), Et.proxyMethod("getSelectionManager().selectionIsExpanded"), Et.proxyMethod("delegate?.getSelectionManager");
class In extends H {
  constructor(t) {
    super(...arguments), this.composition = t, this.undoEntries = [], this.redoEntries = [];
  }
  recordUndoEntry(t) {
    let { context: e, consolidatable: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const n = this.undoEntries.slice(-1)[0];
    if (!i || !El(n, t, e)) {
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
const El = (s, t, e) => (s == null ? void 0 : s.description) === (t == null ? void 0 : t.toString()) && (s == null ? void 0 : s.context) === JSON.stringify(e), Qi = "attachmentGallery";
class Ea {
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
    return this.findRangesOfBlocks().map((t) => this.document = this.document.removeAttributeAtRange(Qi, t));
  }
  applyBlockAttribute() {
    let t = 0;
    this.findRangesOfPieces().forEach((e) => {
      e[1] - e[0] > 1 && (e[0] += t, e[1] += t, this.document.getCharacterAtPosition(e[1]) !== `
` && (this.document = this.document.insertBlockBreakAtRange(e[1]), e[1] < this.selectedRange[1] && this.moveSelectedRangeForward(), e[1]++, t++), e[0] !== 0 && this.document.getCharacterAtPosition(e[0] - 1) !== `
` && (this.document = this.document.insertBlockBreakAtRange(e[0]), e[0] < this.selectedRange[0] && this.moveSelectedRangeForward(), e[0]++, t++), this.document = this.document.applyBlockAttributeAtRange(Qi, !0, e));
    });
  }
  findRangesOfBlocks() {
    return this.document.findRangesForBlockAttribute(Qi);
  }
  findRangesOfPieces() {
    return this.document.findRangesForTextAttribute("presentation", { withValue: "gallery" });
  }
  moveSelectedRangeForward() {
    this.selectedRange[0] += 1, this.selectedRange[1] += 1;
  }
}
const Sa = function(s) {
  const t = new Ea(s);
  return t.perform(), t.getSnapshot();
}, Sl = [Sa];
class La {
  constructor(t, e, i) {
    this.insertFiles = this.insertFiles.bind(this), this.composition = t, this.selectionManager = e, this.element = i, this.undoManager = new In(this.composition), this.filters = Sl.slice(0);
  }
  loadDocument(t) {
    return this.loadSnapshot({ document: t, selectedRange: [0, 0] });
  }
  loadHTML() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    const e = Re.parse(t, { referenceElement: this.element }).getDocument();
    return this.loadDocument(e);
  }
  loadJSON(t) {
    let { document: e, selectedRange: i } = t;
    return e = nt.fromJSON(e), this.loadSnapshot({ document: e, selectedRange: i });
  }
  loadSnapshot(t) {
    return this.undoManager = new In(this.composition), this.composition.loadSnapshot(t);
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
class Ca {
  constructor(t) {
    this.element = t;
  }
  findLocationFromContainerAndOffset(t, e) {
    let { strict: i } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { strict: !0 }, n = 0, r = !1;
    const a = { index: 0, offset: 0 }, o = this.findAttachmentElementParentForNode(t);
    o && (t = o.parentNode, e = Ni(o));
    const l = ri(this.element, { usingFilter: wa });
    for (; l.nextNode(); ) {
      const c = l.currentNode;
      if (c === t && Ee(t)) {
        ie(c) || (a.offset += e);
        break;
      }
      if (c.parentNode === t) {
        if (n++ === e) break;
      } else if (!Ot(t, c) && n > 0) break;
      vs(c, { strict: i }) ? (r && a.index++, a.offset = 0, r = !0) : a.offset += Zi(c);
    }
    return a;
  }
  findContainerAndOffsetFromLocation(t) {
    let e, i;
    if (t.index === 0 && t.offset === 0) {
      for (e = this.element, i = 0; e.firstChild; ) if (e = e.firstChild, Pi(e)) {
        i = 1;
        break;
      }
      return [e, i];
    }
    let [n, r] = this.findNodeAndOffsetFromLocation(t);
    if (n) {
      if (Ee(n)) Zi(n) === 0 ? (e = n.parentNode.parentNode, i = Ni(n.parentNode), ie(n, { name: "right" }) && i++) : (e = n, i = t.offset - r);
      else {
        if (e = n.parentNode, !vs(n.previousSibling) && !Pi(e)) for (; n === e.lastChild && (n = e, e = e.parentNode, !Pi(e)); ) ;
        i = Ni(n), t.offset !== 0 && i++;
      }
      return [e, i];
    }
  }
  findNodeAndOffsetFromLocation(t) {
    let e, i, n = 0;
    for (const r of this.getSignificantNodesForIndex(t.index)) {
      const a = Zi(r);
      if (t.offset <= n + a) if (Ee(r)) {
        if (e = r, i = n, t.offset === i && ie(e)) break;
      } else e || (e = r, i = n);
      if (n += a, n > t.offset) break;
    }
    return [e, i];
  }
  findAttachmentElementParentForNode(t) {
    for (; t && t !== this.element; ) {
      if (Nt(t)) return t;
      t = t.parentNode;
    }
  }
  getSignificantNodesForIndex(t) {
    const e = [], i = ri(this.element, { usingFilter: Ll });
    let n = !1;
    for (; i.nextNode(); ) {
      const a = i.currentNode;
      var r;
      if (ee(a)) {
        if (r != null ? r++ : r = 0, r === t) n = !0;
        else if (n) break;
      } else n && e.push(a);
    }
    return e;
  }
}
const Zi = function(s) {
  return s.nodeType === Node.TEXT_NODE ? ie(s) ? 0 : s.textContent.length : Y(s) === "br" || Nt(s) ? 1 : 0;
}, Ll = function(s) {
  return Cl(s) === NodeFilter.FILTER_ACCEPT ? wa(s) : NodeFilter.FILTER_REJECT;
}, Cl = function(s) {
  return Zr(s) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, wa = function(s) {
  return Nt(s.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
};
class Ta {
  createDOMRangeFromPoint(t) {
    let e, { x: i, y: n } = t;
    if (document.caretPositionFromPoint) {
      const { offsetNode: r, offset: a } = document.caretPositionFromPoint(i, n);
      return e = document.createRange(), e.setStart(r, a), e;
    }
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(i, n);
    if (document.body.createTextRange) {
      const r = Se();
      try {
        const a = document.body.createTextRange();
        a.moveToPoint(i, n), a.select();
      } catch {
      }
      return e = Se(), oa(r), e;
    }
  }
  getClientRectsForDOMRange(t) {
    const e = Array.from(t.getClientRects());
    return [e[0], e[e.length - 1]];
  }
}
class Dt extends H {
  constructor(t) {
    super(...arguments), this.didMouseDown = this.didMouseDown.bind(this), this.selectionDidChange = this.selectionDidChange.bind(this), this.element = t, this.locationMapper = new Ca(this.element), this.pointMapper = new Ta(), this.lockCount = 0, B("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
  }
  getLocationRange() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return t.strict === !1 ? this.createLocationRangeFromDOMRange(Se()) : t.ignoreLock ? this.currentLocationRange : this.lockedLocationRange ? this.lockedLocationRange : this.currentLocationRange;
  }
  setLocationRange(t) {
    if (this.lockedLocationRange) return;
    t = k(t);
    const e = this.createDOMRangeFromLocationRange(t);
    e && (oa(e), this.updateCurrentLocationRange(t));
  }
  setLocationRangeFromPointRange(t) {
    t = k(t);
    const e = this.getLocationAtPoint(t[0]), i = this.getLocationAtPoint(t[1]);
    this.setLocationRange([e, i]);
  }
  getClientRectAtLocationRange(t) {
    const e = this.createDOMRangeFromLocationRange(t);
    if (e) return this.getClientRectsForDOMRange(e)[1];
  }
  locationIsCursorTarget(t) {
    const e = Array.from(this.findNodeAndOffsetFromLocation(t))[0];
    return ie(e);
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
    return (t = aa()) === null || t === void 0 ? void 0 : t.removeAllRanges();
  }
  selectionIsCollapsed() {
    var t;
    return ((t = Se()) === null || t === void 0 ? void 0 : t.collapsed) === !0;
  }
  selectionIsExpanded() {
    return !this.selectionIsCollapsed();
  }
  createLocationRangeFromDOMRange(t, e) {
    if (t == null || !this.domRangeWithinElement(t)) return;
    const i = this.findLocationFromContainerAndOffset(t.startContainer, t.startOffset, e);
    if (!i) return;
    const n = t.collapsed ? void 0 : this.findLocationFromContainerAndOffset(t.endContainer, t.endOffset, e);
    return k([i, n]);
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
      }), Ot(document, this.element)) return this.selectionDidChange();
    }, i = setTimeout(e, 200);
    t = ["mousemove", "keydown"].map((n) => B(n, { onElement: document, withCallback: e }));
  }
  selectionDidChange() {
    if (!this.paused && !qn(this.element)) return this.updateCurrentLocationRange();
  }
  updateCurrentLocationRange(t) {
    var e, i;
    if ((t ?? (t = this.createLocationRangeFromDOMRange(Se()))) && !ai(t, this.currentLocationRange)) return this.currentLocationRange = t, (e = this.delegate) === null || e === void 0 || (i = e.locationRangeDidChange) === null || i === void 0 ? void 0 : i.call(e, this.currentLocationRange.slice(0));
  }
  createDOMRangeFromLocationRange(t) {
    const e = this.findContainerAndOffsetFromLocation(t[0]), i = vt(t) ? e : this.findContainerAndOffsetFromLocation(t[1]) || e;
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
    return t.collapsed ? Ot(this.element, t.startContainer) : Ot(this.element, t.startContainer) && Ot(this.element, t.endContainer);
  }
}
Dt.proxyMethod("locationMapper.findLocationFromContainerAndOffset"), Dt.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"), Dt.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"), Dt.proxyMethod("pointMapper.createDOMRangeFromPoint"), Dt.proxyMethod("pointMapper.getClientRectsForDOMRange");
var ka = Object.freeze({ __proto__: null, Attachment: ae, AttachmentManager: Aa, AttachmentPiece: se, Block: ut, Composition: Et, Document: nt, Editor: La, HTMLParser: Re, HTMLSanitizer: mi, LineBreakInsertion: xa, LocationMapper: Ca, ManagedAttachment: O, Piece: Vt, PointMapper: Ta, SelectionManager: Dt, SplittableList: li, StringPiece: Kn, Text: dt, UndoManager: In }), wl = Object.freeze({ __proto__: null, ObjectView: Ut, AttachmentView: zn, BlockView: pa, DocumentView: gi, PieceView: ma, PreviewableAttachmentView: ua, TextView: ga });
const { lang: tn, css: Rt, keyNames: Tl } = Be, en = function(s) {
  return function() {
    const t = s.apply(this, arguments);
    t.do(), this.undos || (this.undos = []), this.undos.push(t.undo);
  };
};
class Ia extends H {
  constructor(t, e, i) {
    let n = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(...arguments), G(this, "makeElementMutable", en(() => ({ do: () => {
      this.element.dataset.trixMutable = !0;
    }, undo: () => delete this.element.dataset.trixMutable }))), G(this, "addToolbar", en(() => {
      const r = E({ tagName: "div", className: Rt.attachmentToolbar, data: { trixMutable: !0 }, childNodes: E({ tagName: "div", className: "trix-button-row", childNodes: E({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: E({ tagName: "button", className: "trix-button trix-button--remove", textContent: tn.remove, attributes: { title: tn.remove }, data: { trixAction: "remove" } }) }) }) });
      return this.attachment.isPreviewable() && r.appendChild(E({ tagName: "div", className: Rt.attachmentMetadataContainer, childNodes: E({ tagName: "span", className: Rt.attachmentMetadata, childNodes: [E({ tagName: "span", className: Rt.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), E({ tagName: "span", className: Rt.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), B("click", { onElement: r, withCallback: this.didClickToolbar }), B("click", { onElement: r, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), Ae("trix-attachment-before-toolbar", { onElement: this.element, attributes: { toolbar: r, attachment: this.attachment } }), { do: () => this.element.appendChild(r), undo: () => Ct(r) };
    })), G(this, "installCaptionEditor", en(() => {
      const r = E({ tagName: "textarea", className: Rt.attachmentCaptionEditor, attributes: { placeholder: tn.captionPlaceholder }, data: { trixMutable: !0 } });
      r.value = this.attachmentPiece.getCaption();
      const a = r.cloneNode();
      a.classList.add("trix-autoresize-clone"), a.tabIndex = -1;
      const o = function() {
        a.value = r.value, r.style.height = a.scrollHeight + "px";
      };
      B("input", { onElement: r, withCallback: o }), B("input", { onElement: r, withCallback: this.didInputCaption }), B("keydown", { onElement: r, withCallback: this.didKeyDownCaption }), B("change", { onElement: r, withCallback: this.didChangeCaption }), B("blur", { onElement: r, withCallback: this.didBlurCaption });
      const l = this.element.querySelector("figcaption"), c = l.cloneNode();
      return { do: () => {
        if (l.style.display = "none", c.appendChild(r), c.appendChild(a), c.classList.add("".concat(Rt.attachmentCaption, "--editing")), l.parentElement.insertBefore(c, l), o(), this.options.editCaption) return Un(() => r.focus());
      }, undo() {
        Ct(c), l.style.display = null;
      } };
    })), this.didClickToolbar = this.didClickToolbar.bind(this), this.didClickActionButton = this.didClickActionButton.bind(this), this.didKeyDownCaption = this.didKeyDownCaption.bind(this), this.didInputCaption = this.didInputCaption.bind(this), this.didChangeCaption = this.didChangeCaption.bind(this), this.didBlurCaption = this.didBlurCaption.bind(this), this.attachmentPiece = t, this.element = e, this.container = i, this.options = n, this.attachment = this.attachmentPiece.attachment, Y(this.element) === "a" && (this.element = this.element.firstChild), this.install();
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
    if (Tl[t.keyCode] === "return") return t.preventDefault(), this.savePendingCaption(), (e = this.delegate) === null || e === void 0 || (i = e.attachmentEditorDidRequestDeselectingAttachment) === null || i === void 0 ? void 0 : i.call(e, this.attachment);
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
class Ra extends H {
  constructor(t, e) {
    super(...arguments), this.didFocus = this.didFocus.bind(this), this.didBlur = this.didBlur.bind(this), this.didClickAttachment = this.didClickAttachment.bind(this), this.element = t, this.composition = e, this.documentView = new gi(this.composition.document, { element: this.element }), B("focus", { onElement: this.element, withCallback: this.didFocus }), B("blur", { onElement: this.element, withCallback: this.didBlur }), B("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: !0 }), B("mousedown", { onElement: this.element, matchingSelector: Mt, withCallback: this.didClickAttachment }), B("click", { onElement: this.element, matchingSelector: "a".concat(Mt), preventDefault: !0 });
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
    this.blurPromise = new Promise((e) => Un(() => {
      var i, n;
      return qn(this.element) || (this.focused = null, (i = this.delegate) === null || i === void 0 || (n = i.compositionControllerDidBlur) === null || n === void 0 || n.call(i)), this.blurPromise = null, e();
    }));
  }
  didClickAttachment(t, e) {
    var i, n;
    const r = this.findAttachmentForElement(e), a = !!Lt(t.target, { matchingSelector: "figcaption" });
    return (i = this.delegate) === null || i === void 0 || (n = i.compositionControllerDidSelectAttachment) === null || n === void 0 ? void 0 : n.call(i, r, { editCaption: a });
  }
  getSerializableElement() {
    return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
  }
  render() {
    var t, e, i, n, r, a;
    return this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced() && ((i = this.delegate) === null || i === void 0 || (n = i.compositionControllerWillSyncDocumentView) === null || n === void 0 || n.call(i), this.documentView.sync(), (r = this.delegate) === null || r === void 0 || (a = r.compositionControllerDidSyncDocumentView) === null || a === void 0 || a.call(r)), (t = this.delegate) === null || t === void 0 || (e = t.compositionControllerDidRender) === null || e === void 0 ? void 0 : e.call(t);
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
    this.attachmentEditor = new Ia(r, n, this.element, e), this.attachmentEditor.delegate = this;
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
class Da extends H {
}
const Oa = "data-trix-mutable", kl = "[".concat(Oa, "]"), Il = { attributes: !0, childList: !0, characterData: !0, characterDataOldValue: !0, subtree: !0 };
class Ba extends H {
  constructor(t) {
    super(t), this.didMutate = this.didMutate.bind(this), this.element = t, this.observer = new window.MutationObserver(this.didMutate), this.start();
  }
  start() {
    return this.reset(), this.observer.observe(this.element, Il);
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
    return t !== this.element && !this.nodeIsMutable(t) && !Zr(t);
  }
  nodeIsMutable(t) {
    return Lt(t, { matchingSelector: kl });
  }
  nodesModifiedByMutation(t) {
    const e = [];
    switch (t.type) {
      case "attributes":
        t.attributeName !== Oa && e.push(t.target);
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
    Array.from(i.additions).forEach((o) => {
      Array.from(t).includes(o) || t.push(o);
    }), e.push(...Array.from(i.deletions || []));
    const n = {}, r = t.join("");
    r && (n.textAdded = r);
    const a = e.join("");
    return a && (n.textDeleted = a), n;
  }
  getMutationsByType(t) {
    return Array.from(this.mutations).filter((e) => e.type === t);
  }
  getTextChangesFromChildList() {
    let t, e;
    const i = [], n = [];
    Array.from(this.getMutationsByType("childList")).forEach((o) => {
      i.push(...Array.from(o.addedNodes || [])), n.push(...Array.from(o.removedNodes || []));
    }), i.length === 0 && n.length === 1 && ee(n[0]) ? (t = [], e = [`
`]) : (t = Rn(i), e = Rn(n));
    const r = t.filter((o, l) => o !== e[l]).map(ye), a = e.filter((o, l) => o !== t[l]).map(ye);
    return { additions: r, deletions: a };
  }
  getTextChangesFromCharacterData() {
    let t, e;
    const i = this.getMutationsByType("characterData");
    if (i.length) {
      const n = i[0], r = i[i.length - 1], a = function(o, l) {
        let c, u;
        return o = ke.box(o), (l = ke.box(l)).length < o.length ? [u, c] = Ls(o, l) : [c, u] = Ls(l, o), { added: c, removed: u };
      }(ye(n.oldValue), ye(r.target.data));
      t = a.added, e = a.removed;
    }
    return { additions: t ? [t] : [], deletions: e ? [e] : [] };
  }
}
const Rn = function() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const t = [];
  for (const e of Array.from(s)) switch (e.nodeType) {
    case Node.TEXT_NODE:
      t.push(e.data);
      break;
    case Node.ELEMENT_NODE:
      Y(e) === "br" ? t.push(`
`) : t.push(...Array.from(Rn(e.childNodes) || []));
  }
  return t;
};
class Ma extends oi {
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
class Rl {
  constructor(t) {
    this.element = t;
  }
  shouldIgnore(t) {
    return !!Oe.samsungAndroid && (this.previousEvent = this.event, this.event = t, this.checkSamsungKeyboardBuggyModeStart(), this.checkSamsungKeyboardBuggyModeEnd(), this.buggyMode);
  }
  checkSamsungKeyboardBuggyModeStart() {
    this.insertingLongTextAfterUnidentifiedChar() && Dl(this.element.innerText, this.event.data) && (this.buggyMode = !0, this.event.preventDefault());
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
const Dl = (s, t) => zs(s) === zs(t), Ol = new RegExp("(".concat("￼", "|").concat(ui, "|").concat(St, "|\\s)+"), "g"), zs = (s) => s.replace(Ol, " ").trim();
class pi extends H {
  constructor(t) {
    super(...arguments), this.element = t, this.mutationObserver = new Ba(this.element), this.mutationObserver.delegate = this, this.flakyKeyboardDetector = new Rl(this.element);
    for (const e in this.constructor.events) B(e, { onElement: this.element, withCallback: this.handlerFor(e) });
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
    const e = Array.from(t).map((i) => new Ma(i));
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
        if (!qn(this.element)) {
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
var nn;
G(pi, "events", {});
const { browser: Bl, keyNames: Na } = Be;
let Ml = 0;
class bt extends pi {
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
    return this.resetInputSummary(), Ht.reset();
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
    const n = e != null ? e === this.inputSummary.textAdded : !this.inputSummary.textAdded, r = i != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete, a = [`
`, ` 
`].includes(e) && !n, o = i === `
` && !r;
    if (a && !o || o && !a) {
      const c = this.getSelectedRange();
      if (c) {
        var l;
        const u = a ? e.replace(/\n$/, "").length || -1 : (e == null ? void 0 : e.length) || 1;
        if ((l = this.responder) !== null && l !== void 0 && l.positionIsBlockBreak(c[1] + u)) return !0;
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
    this.compositionInput = new xt(this);
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
      for (const r in xs) {
        const a = xs[r];
        try {
          if (n.setData(r, a), !n.getData(r) === a) return !1;
        } catch {
          return !1;
        }
      }
      return !0;
    }(t)) return;
    const i = (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedDocument().toSerializableDocument();
    return t.setData("application/x-trix-document", JSON.stringify(i)), t.setData("text/html", gi.render(i).innerHTML), t.setData("text/plain", i.toString().replace(/\n$/, "")), !0;
  }
  canAcceptDataTransfer(t) {
    const e = {};
    return Array.from((t == null ? void 0 : t.types) || []).forEach((i) => {
      e[i] = !0;
    }), e.Files || e["application/x-trix-document"] || e["text/html"] || e["text/plain"];
  }
  getPastedHTMLUsingHiddenElement(t) {
    const e = this.getSelectedRange(), i = { position: "absolute", left: "".concat(window.pageXOffset, "px"), top: "".concat(window.pageYOffset, "px"), opacity: 0 }, n = E({ style: i, tagName: "div", editable: !0 });
    return document.body.appendChild(n), n.focus(), requestAnimationFrame(() => {
      const r = n.innerHTML;
      return Ct(n), this.setSelectedRange(e), t(r);
    });
  }
}
G(bt, "events", { keydown(s) {
  this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = !0;
  const t = Na[s.keyCode];
  if (t) {
    var e;
    let n = this.keys;
    ["ctrl", "alt", "shift", "meta"].forEach((r) => {
      var a;
      s["".concat(r, "Key")] && (r === "ctrl" && (r = "control"), n = (a = n) === null || a === void 0 ? void 0 : a[r]);
    }), ((e = n) === null || e === void 0 ? void 0 : e[t]) != null && (this.setInputSummary({ keyName: t }), Ht.reset(), n[t].call(this, s));
  }
  if (na(s)) {
    const n = String.fromCharCode(s.keyCode).toLowerCase();
    if (n) {
      var i;
      const r = ["alt", "shift"].map((a) => {
        if (s["".concat(a, "Key")]) return a;
      }).filter((a) => a);
      r.push(n), (i = this.delegate) !== null && i !== void 0 && i.inputControllerDidReceiveKeyboardCommand(r) && s.preventDefault();
    }
  }
}, keypress(s) {
  if (this.inputSummary.eventName != null || s.metaKey || s.ctrlKey && !s.altKey) return;
  const t = Fl(s);
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
    if (!re(i, this.draggingPoint)) return this.draggingPoint = i, (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidReceiveDragOverPoint) === null || e === void 0 ? void 0 : e.call(t, this.draggingPoint);
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
    var a, o;
    (a = this.delegate) === null || a === void 0 || a.inputControllerWillMoveText(), (o = this.responder) === null || o === void 0 || o.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender();
  } else if (n) {
    var l;
    const c = nt.fromJSONString(n);
    (l = this.responder) === null || l === void 0 || l.insertDocument(c), this.requestRender();
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
  if (!t || ql(s)) return void this.getPastedHTMLUsingHiddenElement((_) => {
    var S, x, z;
    return e.type = "text/html", e.html = _, (S = this.delegate) === null || S === void 0 || S.inputControllerWillPaste(e), (x = this.responder) === null || x === void 0 || x.insertHTML(e.html), this.requestRender(), (z = this.delegate) === null || z === void 0 ? void 0 : z.inputControllerDidPaste(e);
  });
  const i = t.getData("URL"), n = t.getData("text/html"), r = t.getData("public.url-name");
  if (i) {
    var a, o, l;
    let _;
    e.type = "text/html", _ = r ? jn(r).trim() : i, e.html = this.createLinkHTML(i, _), (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(e), this.setInputSummary({ textAdded: _, didDelete: this.selectionIsExpanded() }), (o = this.responder) === null || o === void 0 || o.insertHTML(e.html), this.requestRender(), (l = this.delegate) === null || l === void 0 || l.inputControllerDidPaste(e);
  } else if (ia(t)) {
    var c, u, m;
    e.type = "text/plain", e.string = t.getData("text/plain"), (c = this.delegate) === null || c === void 0 || c.inputControllerWillPaste(e), this.setInputSummary({ textAdded: e.string, didDelete: this.selectionIsExpanded() }), (u = this.responder) === null || u === void 0 || u.insertString(e.string), this.requestRender(), (m = this.delegate) === null || m === void 0 || m.inputControllerDidPaste(e);
  } else if (n) {
    var p, h, f;
    e.type = "text/html", e.html = n, (p = this.delegate) === null || p === void 0 || p.inputControllerWillPaste(e), (h = this.responder) === null || h === void 0 || h.insertHTML(e.html), this.requestRender(), (f = this.delegate) === null || f === void 0 || f.inputControllerDidPaste(e);
  } else if (Array.from(t.types).includes("Files")) {
    var A, I;
    const _ = (A = t.items) === null || A === void 0 || (A = A[0]) === null || A === void 0 || (I = A.getAsFile) === null || I === void 0 ? void 0 : I.call(A);
    if (_) {
      var $, R, U;
      const S = Nl(_);
      !_.name && S && (_.name = "pasted-file-".concat(++Ml, ".").concat(S)), e.type = "File", e.file = _, ($ = this.delegate) === null || $ === void 0 || $.inputControllerWillAttachFiles(), (R = this.responder) === null || R === void 0 || R.insertFile(e.file), this.requestRender(), (U = this.delegate) === null || U === void 0 || U.inputControllerDidPaste(e);
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
} }), G(bt, "keys", { backspace(s) {
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
} } }), bt.proxyMethod("responder?.getSelectedRange"), bt.proxyMethod("responder?.setSelectedRange"), bt.proxyMethod("responder?.expandSelectionInDirection"), bt.proxyMethod("responder?.selectionIsInCursorTarget"), bt.proxyMethod("responder?.selectionIsExpanded");
const Nl = (s) => {
  var t;
  return (t = s.type) === null || t === void 0 || (t = t.match(/\/(\w+)$/)) === null || t === void 0 ? void 0 : t[1];
}, Pl = !((nn = " ".codePointAt) === null || nn === void 0 || !nn.call(" ", 0)), Fl = function(s) {
  if (s.key && Pl && s.key.codePointAt(0) === s.keyCode) return s.key;
  {
    let t;
    if (s.which === null ? t = s.keyCode : s.which !== 0 && s.charCode !== 0 && (t = s.charCode), t != null && Na[t] !== "escape") return ke.fromCodepoints([t]).toString();
  }
}, ql = function(s) {
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
class xt extends H {
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
    return !Bl.composesExistingText || this.inputSummary.didInput;
  }
  canApplyToDocument() {
    var t, e;
    return ((t = this.data.start) === null || t === void 0 ? void 0 : t.length) === 0 && ((e = this.data.end) === null || e === void 0 ? void 0 : e.length) > 0 && this.range;
  }
}
xt.proxyMethod("inputController.setInputSummary"), xt.proxyMethod("inputController.requestRender"), xt.proxyMethod("inputController.requestReparse"), xt.proxyMethod("responder?.selectionIsExpanded"), xt.proxyMethod("responder?.insertPlaceholder"), xt.proxyMethod("responder?.selectPlaceholder"), xt.proxyMethod("responder?.forgetPlaceholder");
class Ce extends pi {
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
    if (Sn().includes(t)) return (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformFormatting(t), this.withTargetDOMRange(function() {
      var i;
      return (i = this.responder) === null || i === void 0 ? void 0 : i.toggleCurrentAttribute(t);
    });
  }
  activateAttributeIfSupported(t, e) {
    var i;
    if (Sn().includes(t)) return (i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformFormatting(t), this.withTargetDOMRange(function() {
      var n;
      return (n = this.responder) === null || n === void 0 ? void 0 : n.setCurrentAttribute(t, e);
    });
  }
  deleteInDirection(t) {
    let { recordUndoEntry: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { recordUndoEntry: !0 };
    var i;
    e && ((i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformTyping());
    const n = () => {
      var a;
      return (a = this.responder) === null || a === void 0 ? void 0 : a.deleteInDirection(t);
    }, r = this.getTargetDOMRange({ minLength: this.composing ? 1 : 2 });
    return r ? this.withTargetDOMRange(r, n) : n();
  }
  withTargetDOMRange(t, e) {
    var i;
    return typeof t == "function" && (e = t, t = this.getTargetDOMRange()), t ? (i = this.responder) === null || i === void 0 ? void 0 : i.withTargetDOMRange(t, e.bind(this)) : (Ht.reset(), e.call(this));
  }
  getTargetDOMRange() {
    var t, e;
    let { minLength: i } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { minLength: 0 };
    const n = (t = (e = this.event).getTargetRanges) === null || t === void 0 ? void 0 : t.call(e);
    if (n && n.length) {
      const r = Hl(n[0]);
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
G(Ce, "events", { keydown(s) {
  if (na(s)) {
    var t;
    const e = Vl(s);
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
  return Pa(s) ? (s.preventDefault(), this.attachFiles(s.clipboardData.files)) : Ul(s) ? (s.preventDefault(), e = { type: "text/plain", string: s.clipboardData.getData("text/plain") }, (n = this.delegate) === null || n === void 0 || n.inputControllerWillPaste(e), (r = this.responder) === null || r === void 0 || r.insertString(e.string), this.render(), (a = this.delegate) === null || a === void 0 ? void 0 : a.inputControllerDidPaste(e)) : i ? (s.preventDefault(), e = { type: "text/html", html: this.createLinkHTML(i) }, (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(e), (l = this.responder) === null || l === void 0 || l.insertHTML(e.html), this.render(), (c = this.delegate) === null || c === void 0 ? void 0 : c.inputControllerDidPaste(e)) : void 0;
  var n, r, a, o, l, c;
}, beforeinput(s) {
  const t = this.constructor.inputTypes[s.inputType], e = (i = s, !(!/iPhone|iPad/.test(navigator.userAgent) || i.inputType && i.inputType !== "insertParagraph"));
  var i;
  t && (this.withEvent(s, t), e || this.scheduleRender()), e && this.render();
}, input(s) {
  Ht.reset();
}, dragstart(s) {
  var t, e;
  (t = this.responder) !== null && t !== void 0 && t.selectionContainsAttachments() && (s.dataTransfer.setData("application/x-trix-dragging", !0), this.dragging = { range: (e = this.responder) === null || e === void 0 ? void 0 : e.getSelectedRange(), point: rn(s) });
}, dragenter(s) {
  sn(s) && s.preventDefault();
}, dragover(s) {
  if (this.dragging) {
    s.preventDefault();
    const e = rn(s);
    var t;
    if (!re(e, this.dragging.point)) return this.dragging.point = e, (t = this.responder) === null || t === void 0 ? void 0 : t.setLocationRangeFromPointRange(e);
  } else sn(s) && s.preventDefault();
}, drop(s) {
  var t, e;
  if (this.dragging) return s.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillMoveText(), (e = this.responder) === null || e === void 0 || e.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender();
  if (sn(s)) {
    var i;
    s.preventDefault();
    const n = rn(s);
    return (i = this.responder) === null || i === void 0 || i.setLocationRangeFromPointRange(n), this.attachFiles(s.dataTransfer.files);
  }
}, dragend() {
  var s;
  this.dragging && ((s = this.responder) === null || s === void 0 || s.setSelectedRange(this.dragging.range), this.dragging = null);
}, compositionend(s) {
  this.composing && (this.composing = !1, Oe.recentAndroid || this.scheduleRender());
} }), G(Ce, "keys", { ArrowLeft() {
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
} }), G(Ce, "inputTypes", { deleteByComposition() {
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
    let l;
    this.event.preventDefault(), t.type = "text/html";
    const c = s.getData("public.url-name");
    l = c ? jn(c).trim() : e, t.html = this.createLinkHTML(e, l), (n = this.delegate) === null || n === void 0 || n.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var u;
      return (u = this.responder) === null || u === void 0 ? void 0 : u.insertHTML(t.html);
    }), this.afterRender = () => {
      var u;
      return (u = this.delegate) === null || u === void 0 ? void 0 : u.inputControllerDidPaste(t);
    };
  } else if (ia(s)) {
    var r;
    t.type = "text/plain", t.string = s.getData("text/plain"), (r = this.delegate) === null || r === void 0 || r.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertString(t.string);
    }), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
    };
  } else if ($l(this.event)) {
    var a;
    t.type = "File", t.file = s.files[0], (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertFile(t.file);
    }), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
    };
  } else if (i) {
    var o;
    this.event.preventDefault(), t.type = "text/html", t.html = i, (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(t), this.withTargetDOMRange(function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertHTML(t.html);
    }), this.afterRender = () => {
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
const Hl = function(s) {
  const t = document.createRange();
  return t.setStart(s.startContainer, s.startOffset), t.setEnd(s.endContainer, s.endOffset), t;
}, sn = (s) => {
  var t;
  return Array.from(((t = s.dataTransfer) === null || t === void 0 ? void 0 : t.types) || []).includes("Files");
}, $l = (s) => {
  var t;
  return ((t = s.dataTransfer.files) === null || t === void 0 ? void 0 : t[0]) && !Pa(s) && !((e) => {
    let { dataTransfer: i } = e;
    return i.types.includes("Files") && i.types.includes("text/html") && i.getData("text/html").includes("urn:schemas-microsoft-com:office:office");
  })(s);
}, Pa = function(s) {
  const t = s.clipboardData;
  if (t)
    return Array.from(t.types).filter((e) => e.match(/file/i)).length === t.types.length && t.files.length >= 1;
}, Ul = function(s) {
  const t = s.clipboardData;
  if (t) return t.types.includes("text/plain") && t.types.length === 1;
}, Vl = function(s) {
  const t = [];
  return s.altKey && t.push("alt"), s.shiftKey && t.push("shift"), t.push(s.key), t;
}, rn = (s) => ({ x: s.clientX, y: s.clientY }), Dn = "[data-trix-attribute]", On = "[data-trix-action]", jl = "".concat(Dn, ", ").concat(On), fi = "[data-trix-dialog]", Wl = "".concat(fi, "[data-trix-active]"), zl = "".concat(fi, " [data-trix-method]"), Ks = "".concat(fi, " [data-trix-input]"), Gs = (s, t) => (t || (t = te(s)), s.querySelector("[data-trix-input][name='".concat(t, "']"))), Js = (s) => s.getAttribute("data-trix-action"), te = (s) => s.getAttribute("data-trix-attribute") || s.getAttribute("data-trix-dialog-attribute");
class Fa extends H {
  constructor(t) {
    super(t), this.didClickActionButton = this.didClickActionButton.bind(this), this.didClickAttributeButton = this.didClickAttributeButton.bind(this), this.didClickDialogButton = this.didClickDialogButton.bind(this), this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this), this.element = t, this.attributes = {}, this.actions = {}, this.resetDialogInputs(), B("mousedown", { onElement: this.element, matchingSelector: On, withCallback: this.didClickActionButton }), B("mousedown", { onElement: this.element, matchingSelector: Dn, withCallback: this.didClickAttributeButton }), B("click", { onElement: this.element, matchingSelector: jl, preventDefault: !0 }), B("click", { onElement: this.element, matchingSelector: zl, withCallback: this.didClickDialogButton }), B("keydown", { onElement: this.element, matchingSelector: Ks, withCallback: this.didKeyDownDialogInput });
  }
  didClickActionButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const n = Js(e);
    return this.getDialog(n) ? this.toggleDialog(n) : (r = this.delegate) === null || r === void 0 ? void 0 : r.toolbarDidInvokeAction(n, e);
    var r;
  }
  didClickAttributeButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const n = te(e);
    var r;
    return this.getDialog(n) ? this.toggleDialog(n) : (r = this.delegate) === null || r === void 0 || r.toolbarDidToggleAttribute(n), this.refreshAttributeButtons();
  }
  didClickDialogButton(t, e) {
    const i = Lt(e, { matchingSelector: fi });
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
    return Array.from(this.element.querySelectorAll(On)).map((e) => t(e, Js(e)));
  }
  updateAttributes(t) {
    return this.attributes = t, this.refreshAttributeButtons();
  }
  refreshAttributeButtons() {
    return this.eachAttributeButton((t, e) => (t.disabled = this.attributes[e] === !1, this.attributes[e] || this.dialogIsVisible(e) ? (t.setAttribute("data-trix-active", ""), t.classList.add("trix-active")) : (t.removeAttribute("data-trix-active"), t.classList.remove("trix-active"))));
  }
  eachAttributeButton(t) {
    return Array.from(this.element.querySelectorAll(Dn)).map((e) => t(e, te(e)));
  }
  applyKeyboardCommand(t) {
    const e = JSON.stringify(t.sort());
    for (const i of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
      const n = i.getAttribute("data-trix-key").split("+");
      if (JSON.stringify(n.sort()) === e) return Ae("mousedown", { onElement: i }), !0;
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
    n.setAttribute("data-trix-active", ""), n.classList.add("trix-active"), Array.from(n.querySelectorAll("input[disabled]")).forEach((a) => {
      a.removeAttribute("disabled");
    });
    const r = te(n);
    if (r) {
      const a = Gs(n, t);
      a && (a.value = this.attributes[r] || "", a.select());
    }
    return (i = this.delegate) === null || i === void 0 ? void 0 : i.toolbarDidShowDialog(t);
  }
  setAttribute(t) {
    var e;
    const i = te(t), n = Gs(t, i);
    return !n.willValidate || (n.setCustomValidity(""), n.checkValidity() && this.isSafeAttribute(n)) ? ((e = this.delegate) === null || e === void 0 || e.toolbarDidUpdateAttribute(i, n.value), this.hideDialog()) : (n.setCustomValidity("Invalid value"), n.setAttribute("data-trix-validate", ""), n.classList.add("trix-validate"), n.focus());
  }
  isSafeAttribute(t) {
    return !t.hasAttribute("data-trix-validate-href") || Ie.isValidAttribute("a", "href", t.value);
  }
  removeAttribute(t) {
    var e;
    const i = te(t);
    return (e = this.delegate) === null || e === void 0 || e.toolbarDidRemoveAttribute(i), this.hideDialog();
  }
  hideDialog() {
    const t = this.element.querySelector(Wl);
    var e;
    if (t) return t.removeAttribute("data-trix-active"), t.classList.remove("trix-active"), this.resetDialogInputs(), (e = this.delegate) === null || e === void 0 ? void 0 : e.toolbarDidHideDialog(((i) => i.getAttribute("data-trix-dialog"))(t));
  }
  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(Ks)).forEach((t) => {
      t.setAttribute("disabled", "disabled"), t.removeAttribute("data-trix-validate"), t.classList.remove("trix-validate");
    });
  }
  getDialog(t) {
    return this.element.querySelector("[data-trix-dialog=".concat(t, "]"));
  }
}
class we extends Da {
  constructor(t) {
    let { editorElement: e, document: i, html: n } = t;
    super(...arguments), this.editorElement = e, this.selectionManager = new Dt(this.editorElement), this.selectionManager.delegate = this, this.composition = new Et(), this.composition.delegate = this, this.attachmentManager = new Aa(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = Hn.getLevel() === 2 ? new Ce(this.editorElement) : new bt(this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new Ra(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new Fa(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new La(this.composition, this.selectionManager, this.editorElement), i ? this.editor.loadDocument(i) : this.editor.loadHTML(n);
  }
  registerSelectionManager() {
    return Ht.registerSelectionManager(this.selectionManager);
  }
  unregisterSelectionManager() {
    return Ht.unregisterSelectionManager(this.selectionManager);
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
    return this.composition.updateCurrentAttributes(), this.updateCurrentActions(), this.attachmentLocationRange && !ai(this.attachmentLocationRange, t) && this.composition.stopEditingAttachment(), this.notifyEditorElement("selection-change");
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
    if (!re(t, this.currentActions)) return this.currentActions = t, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions });
  }
  runEditorFilters() {
    let t = this.composition.getSnapshot();
    if (Array.from(this.editor.filters).forEach((n) => {
      const { document: r, selectedRange: a } = t;
      t = n.call(this.editor, t) || {}, t.document || (t.document = r), t.selectedRange || (t.selectedRange = a);
    }), e = t, i = this.composition.getSnapshot(), !ai(e.selectedRange, i.selectedRange) || !e.document.isEqualTo(i.document)) return this.composition.loadSnapshot(t);
    var e, i;
  }
  updateInputElement() {
    const t = function(e, i) {
      const n = Al[i];
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
    const e = F(t), i = this.selectionManager.getLocationRange();
    if (e || !vt(i)) return this.editor.recordUndoEntry("Formatting", { context: this.getUndoContext(), consolidatable: !0 });
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
    return vt(t) ? t[0].index : t;
  }
  getTimeContext() {
    return An.interval > 0 ? Math.floor((/* @__PURE__ */ new Date()).getTime() / An.interval) : 0;
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
G(we, "actions", { undo: { test() {
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
  return Hn.pickFiles(this.editor.insertFiles);
} } }), we.proxyMethod("getSelectionManager().setLocationRange"), we.proxyMethod("getSelectionManager().getLocationRange");
var Kl = Object.freeze({ __proto__: null, AttachmentEditorController: Ia, CompositionController: Ra, Controller: Da, EditorController: we, InputController: pi, Level0InputController: bt, Level2InputController: Ce, ToolbarController: Fa }), Gl = Object.freeze({ __proto__: null, MutationObserver: Ba, SelectionChangeObserver: ra }), Jl = Object.freeze({ __proto__: null, FileVerificationOperation: Ma, ImagePreloadOperation: _a });
ea("trix-toolbar", `%t {
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
class qa extends HTMLElement {
  connectedCallback() {
    this.innerHTML === "" && (this.innerHTML = ta.getDefaultHTML());
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
let Yl = 0;
const Xl = function(s) {
  if (!s.hasAttribute("contenteditable")) return s.toggleAttribute("contenteditable", !s.disabled), function(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return e.times = 1, B(t, e);
  }("focus", { onElement: s, withCallback: () => Ql(s) });
}, Ql = function(s) {
  return Zl(s), td();
}, Zl = function(s) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "enableObjectResizing")) return document.execCommand("enableObjectResizing", !1, !1), B("mscontrolselect", { onElement: s, preventDefault: !0 });
}, td = function(s) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "DefaultParagraphSeparator")) {
    const { tagName: i } = X.default;
    if (["div", "p"].includes(i)) return document.execCommand("DefaultParagraphSeparator", !1, i);
  }
}, Ys = Oe.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
ea("trix-editor", `%t {
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

%t `.concat(Mt, ` figcaption textarea {
    resize: none;
}

%t `).concat(Mt, ` figcaption textarea.trix-autoresize-clone {
    position: absolute;
    left: -9999px;
    max-height: 0px;
}

%t `).concat(Mt, ` figcaption[data-trix-placeholder]:empty::before {
    content: attr(data-trix-placeholder);
    color: graytext;
}

%t [data-trix-cursor-target] {
    display: `).concat(Ys.display, ` !important;
    width: `).concat(Ys.width, ` !important;
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
var ot = /* @__PURE__ */ new WeakMap(), Je = /* @__PURE__ */ new WeakMap(), _e = /* @__PURE__ */ new WeakSet();
class ed {
  constructor(t) {
    var e, i;
    ba(e = this, i = _e), i.add(e), G(this, "value", ""), ne(this, ot, { writable: !0, value: void 0 }), ne(this, Je, { writable: !0, value: void 0 }), this.element = t, Le(this, ot, t.attachInternals()), Le(this, Je, !1);
  }
  connectedCallback() {
    Ge(this, _e, Ye).call(this);
  }
  disconnectedCallback() {
  }
  get form() {
    return w(this, ot).form;
  }
  get name() {
    return this.element.getAttribute("name");
  }
  set name(t) {
    this.element.setAttribute("name", t);
  }
  get labels() {
    return w(this, ot).labels;
  }
  get disabled() {
    return w(this, Je) || this.element.hasAttribute("disabled");
  }
  set disabled(t) {
    this.element.toggleAttribute("disabled", t);
  }
  get required() {
    return this.element.hasAttribute("required");
  }
  set required(t) {
    this.element.toggleAttribute("required", t), Ge(this, _e, Ye).call(this);
  }
  get validity() {
    return w(this, ot).validity;
  }
  get validationMessage() {
    return w(this, ot).validationMessage;
  }
  get willValidate() {
    return w(this, ot).willValidate;
  }
  formDisabledCallback(t) {
    Le(this, Je, t);
  }
  setFormValue(t) {
    this.value = t, Ge(this, _e, Ye).call(this), w(this, ot).setFormValue(this.element.disabled ? void 0 : this.value);
  }
  checkValidity() {
    return w(this, ot).checkValidity();
  }
  reportValidity() {
    return w(this, ot).reportValidity();
  }
  setCustomValidity(t) {
    Ge(this, _e, Ye).call(this, t);
  }
}
function Ye() {
  let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  const { required: t, value: e } = this.element, i = t && !e, n = !!s, r = E("input", { required: t }), a = s || r.validationMessage;
  w(this, ot).setValidity({ valueMissing: i, customError: n }, a);
}
var an = /* @__PURE__ */ new WeakMap(), on = /* @__PURE__ */ new WeakMap(), ln = /* @__PURE__ */ new WeakMap();
class id {
  constructor(t) {
    ne(this, an, { writable: !0, value: void 0 }), ne(this, on, { writable: !0, value: (e) => {
      e.defaultPrevented || e.target === this.element.form && this.element.reset();
    } }), ne(this, ln, { writable: !0, value: (e) => {
      if (e.defaultPrevented || this.element.contains(e.target)) return;
      const i = Lt(e.target, { matchingSelector: "label" });
      i && Array.from(this.labels).includes(i) && this.element.focus();
    } }), this.element = t;
  }
  connectedCallback() {
    Le(this, an, function(t) {
      if (t.hasAttribute("aria-label") || t.hasAttribute("aria-labelledby")) return;
      const e = function() {
        const i = Array.from(t.labels).map((r) => {
          if (!r.contains(t)) return r.textContent;
        }).filter((r) => r), n = i.join(" ");
        return n ? t.setAttribute("aria-label", n) : t.removeAttribute("aria-label");
      };
      return e(), B("focus", { onElement: t, withCallback: e });
    }(this.element)), window.addEventListener("reset", w(this, on), !1), window.addEventListener("click", w(this, ln), !1);
  }
  disconnectedCallback() {
    var t;
    (t = w(this, an)) === null || t === void 0 || t.destroy(), window.removeEventListener("reset", w(this, on), !1), window.removeEventListener("click", w(this, ln), !1);
  }
  get labels() {
    const t = [];
    this.element.id && this.element.ownerDocument && t.push(...Array.from(this.element.ownerDocument.querySelectorAll("label[for='".concat(this.element.id, "']")) || []));
    const e = Lt(this.element, { matchingSelector: "label" });
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
var P = /* @__PURE__ */ new WeakMap();
class di extends HTMLElement {
  constructor() {
    super(), ne(this, P, { writable: !0, value: void 0 }), this.willCreateInput = !0, Le(this, P, this.constructor.formAssociated ? new ed(this) : new id(this));
  }
  get trixId() {
    return this.hasAttribute("trix-id") ? this.getAttribute("trix-id") : (this.setAttribute("trix-id", ++Yl), this.trixId);
  }
  get labels() {
    return w(this, P).labels;
  }
  get disabled() {
    const { inputElement: t } = this;
    return t ? t.disabled : w(this, P).disabled;
  }
  set disabled(t) {
    const { inputElement: e } = this;
    e && (e.disabled = t), w(this, P).disabled = t;
  }
  get required() {
    return w(this, P).required;
  }
  set required(t) {
    w(this, P).required = t;
  }
  get validity() {
    return w(this, P).validity;
  }
  get validationMessage() {
    return w(this, P).validationMessage;
  }
  get willValidate() {
    return w(this, P).willValidate;
  }
  get type() {
    return this.localName;
  }
  get toolbarElement() {
    var t;
    if (this.hasAttribute("toolbar")) return (t = this.ownerDocument) === null || t === void 0 ? void 0 : t.getElementById(this.getAttribute("toolbar"));
    if (this.parentNode) {
      const e = "trix-toolbar-".concat(this.trixId);
      return this.setAttribute("toolbar", e), this.internalToolbar = E("trix-toolbar", { id: e }), this.parentNode.insertBefore(this.internalToolbar, this), this.internalToolbar;
    }
  }
  get form() {
    const { inputElement: t } = this;
    return t ? t.form : w(this, P).form;
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
    return t ? t.name : w(this, P).name;
  }
  set name(t) {
    const { inputElement: e } = this;
    e ? e.name = t : w(this, P).name = t;
  }
  get value() {
    const { inputElement: t } = this;
    return t ? t.value : w(this, P).value;
  }
  set value(t) {
    var e;
    this.defaultValue = t, (e = this.editor) === null || e === void 0 || e.loadHTML(this.defaultValue);
  }
  attributeChangedCallback(t, e, i) {
    t === "connected" && this.isConnected && e != null && e !== i && requestAnimationFrame(() => this.reconnect());
  }
  notify(t, e) {
    if (this.editorController) return Ae("trix-".concat(t), { onElement: this, attributes: e });
  }
  setFormValue(t) {
    const { inputElement: e } = this;
    e && (e.value = t), w(this, P).setFormValue(t);
  }
  connectedCallback() {
    if (!this.hasAttribute("data-trix-internal")) {
      if (Xl(this), function(t) {
        t.hasAttribute("role") || t.setAttribute("role", "textbox");
      }(this), !this.editorController) {
        if (Ae("trix-before-initialize", { onElement: this }), this.defaultValue = this.inputElement ? this.inputElement.value : this.innerHTML, !this.hasAttribute("input") && this.parentNode && this.willCreateInput) {
          const t = "trix-input-".concat(this.trixId);
          this.setAttribute("input", t);
          const e = E("input", { type: "hidden", id: t });
          this.parentNode.insertBefore(e, this.nextElementSibling);
        }
        this.editorController = new we({ editorElement: this, html: this.defaultValue }), requestAnimationFrame(() => Ae("trix-initialize", { onElement: this }));
      }
      this.editorController.registerSelectionManager(), w(this, P).connectedCallback(), this.toggleAttribute("connected", !0), function(t) {
        !document.querySelector(":focus") && t.hasAttribute("autofocus") && document.querySelector("[autofocus]") === t && t.focus();
      }(this);
    }
  }
  disconnectedCallback() {
    var t;
    (t = this.editorController) === null || t === void 0 || t.unregisterSelectionManager(), w(this, P).disconnectedCallback(), this.toggleAttribute("connected", !1);
  }
  reconnect() {
    this.removeInternalToolbar(), this.disconnectedCallback(), this.connectedCallback();
  }
  removeInternalToolbar() {
    var t;
    (t = this.internalToolbar) === null || t === void 0 || t.remove(), this.internalToolbar = null;
  }
  checkValidity() {
    return w(this, P).checkValidity();
  }
  reportValidity() {
    return w(this, P).reportValidity();
  }
  setCustomValidity(t) {
    w(this, P).setCustomValidity(t);
  }
  formDisabledCallback(t) {
    const { inputElement: e } = this;
    e && (e.disabled = t), this.toggleAttribute("contenteditable", !t), w(this, P).formDisabledCallback(t);
  }
  formResetCallback() {
    this.reset();
  }
  reset() {
    this.value = this.defaultValue;
  }
}
G(di, "formAssociated", "ElementInternals" in window), G(di, "observedAttributes", ["connected"]);
const Xs = { VERSION: io, config: Be, core: xl, models: ka, views: wl, controllers: Kl, observers: Gl, operations: Jl, elements: Object.freeze({ __proto__: null, TrixEditorElement: di, TrixToolbarElement: qa }), filters: Object.freeze({ __proto__: null, Filter: Ea, attachmentGalleryFilter: Sa }) };
Object.assign(Xs, ka), window.Trix = Xs, setTimeout(function() {
  customElements.get("trix-toolbar") || customElements.define("trix-toolbar", qa), customElements.get("trix-editor") || customElements.define("trix-editor", di);
}, 0);
class nd extends HTMLElement {
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
const Xe = "filter-list-list", sd = "filter-list-item", rd = "filter-list-input", Qs = "filter-list-searchable";
var Bt, De, Bn;
class ad extends HTMLElement {
  constructor() {
    super();
    he(this, De);
    he(this, Bt, !1);
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
    this._url = this.getAttribute("data-url") || "./", this._filterstart = this.getAttribute("data-filterstart") === "true", this._placeholder = this.getAttribute("data-placeholder") || "Liste filtern...", this._queryparam = this.getAttribute("data-queryparam") || "", this._queryparam, this._filterstart && Ve(this, Bt, !0), this.addEventListener("input", this.onInput.bind(this)), this.addEventListener("keydown", this.onEnter.bind(this)), this.addEventListener("focusin", this.onGainFocus.bind(this)), this.addEventListener("focusout", this.onLoseFocus.bind(this));
  }
  attributeChangedCallback(e, i, n) {
    e === "data-url" && i !== n && (this._url = n, this.render()), e === "data-filterstart" && i !== n && (this._filterstart = n === "true", this.render()), e === "data-placeholder" && i !== n && (this._placeholder = n, this.render()), e === "data-queryparam" && i !== n && (this._queryparam = n, this.render());
  }
  onInput(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (this._filter = e.target.value, this.renderList());
  }
  onGainFocus(e) {
    e.target && e.target.tagName.toLowerCase() === "input" && (Ve(this, Bt, !1), this.renderList());
  }
  onLoseFocus(e) {
    let i = this.querySelector("input");
    if (e.target && e.target === i) {
      if (relatedElement = e.relatedTarget, relatedElement && this.contains(relatedElement))
        return;
      i.value = "", this._filter = "", this._filterstart && Ve(this, Bt, !0), this.renderList();
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
    let e = this.querySelector("#" + Xe);
    if (!e)
      return;
    let i = new Mark(e.querySelectorAll("." + Qs));
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
    return i === "" ? "" : `<span class="${Qs}">${i}</span>`;
  }
  getURL(e) {
    if (this._queryparam) {
      let i = new URL(window.location), n = new URLSearchParams(i.search);
      return n.set(this._queryparam, this.getHREF(e)), n.delete("page"), i.search = n.toString(), i.toString();
    }
    return this._url + this.getHREFEncoded(e);
  }
  renderList() {
    let e = this.querySelector("#" + Xe);
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
    return je(this, De, Bn).call(this, e), "";
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
								class="${rd} w-full placeholder:italic px-2 py-0.5" />
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
							<div id="${Xe}" class="${Xe} pt-1 max-h-60 overflow-auto bg-stone-50 ${Bi(this, Bt) ? "hidden" : ""}">
								${e.map(
      (i, n) => `
									<a
										href="${this.getURL(i)}"
										hx-indicator="body"
										hx-swap="outerHTML show:none"
										hx-select="main"
										hx-target="main"
										class="${sd} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${n % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
										${je(this, De, Bn).call(this, i) ? 'aria-current="page"' : ""}>
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
Bt = new WeakMap(), De = new WeakSet(), Bn = function(e) {
  if (!e)
    return !1;
  let i = this.getHREF(e);
  return i === "" ? !1 : this._queryparam && (new URLSearchParams(window.location.search).get(this._queryparam) || "") === i ? !0 : !!window.location.href.endsWith(i);
};
class od extends HTMLElement {
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
const _t = class _t extends HTMLElement {
  static get observedAttributes() {
    return ["position", "timeout"];
  }
  static _setDragging(t) {
    window.__toolTipDragging = t, document.documentElement && document.documentElement.classList.toggle("dragging", t), document.body && (t ? document.body.dataset.dragging = "true" : delete document.body.dataset.dragging), t && document.querySelectorAll(".tooltip-box").forEach((e) => {
      e.classList.remove("opacity-100"), e.classList.add("opacity-0"), e.classList.add("hidden");
    });
  }
  static _ensureDragGuard() {
    if (_t._dragGuardInitialized)
      return;
    _t._dragGuardInitialized = !0;
    const t = (i) => {
      var r, a;
      (((a = (r = i.target) == null ? void 0 : r.closest) == null ? void 0 : a.call(r, "[data-role='content-drag-handle']")) || i.type === "dragstart") && _t._setDragging(!0);
    }, e = () => {
      _t._setDragging(!1);
    };
    document.addEventListener("pointerdown", t, !0), document.addEventListener("mousedown", t, !0), document.addEventListener("dragstart", t, !0), document.addEventListener("pointerup", e, !0), document.addEventListener("mouseup", e, !0), document.addEventListener("pointercancel", e, !0), document.addEventListener("dragend", e, !0), document.addEventListener("drop", e, !0), window.addEventListener("blur", e), window.addEventListener("contentsdragging", (i) => {
      var r;
      const n = !!((r = i.detail) != null && r.active);
      _t._setDragging(n);
    });
  }
  constructor() {
    super(), this._tooltipBox = null, this._timeout = 200, this._hideTimeout = null, this._hiddenTimeout = null, this._dataTipElem = null, this._observer = null;
  }
  connectedCallback() {
    _t._ensureDragGuard(), this.classList.add("relative", "block", "leading-none", "[&>*]:leading-normal"), this._dataTipElem = this.querySelector(".data-tip");
    const t = this._dataTipElem ? this._dataTipElem.innerHTML : "Tooltip";
    this._dataTipElem && this._dataTipElem.classList.add("hidden"), this._tooltipBox = document.createElement("div"), this._tooltipBox.innerHTML = t, this._tooltipBox.className = [
      "tooltip-box",
      "opacity-0",
      "hidden",
      "fixed",
      "px-2",
      "py-1",
      "text-sm",
      "text-white",
      "bg-gray-900",
      "rounded",
      "shadow",
      "z-50",
      "whitespace-nowrap",
      "transition-opacity",
      "duration-100",
      "ease-out",
      "font-sans"
    ].join(" "), this.appendChild(this._tooltipBox), this._updatePosition(), this.addEventListener("mouseenter", () => this._showTooltip()), this.addEventListener("mouseleave", () => this._hideTooltip()), this.addEventListener("pointerdown", () => this._forceHide()), this.addEventListener("mousedown", () => this._forceHide()), this.addEventListener("click", () => this._forceHide()), this.addEventListener("keydown", (e) => {
      (e.key === "Enter" || e.key === " ") && this._forceHide();
    }), this._dataTipElem && (this._observer = new MutationObserver(() => {
      this._tooltipBox && (this._tooltipBox.innerHTML = this._dataTipElem.innerHTML);
    }), this._observer.observe(this._dataTipElem, {
      childList: !0,
      characterData: !0,
      subtree: !0
    }));
  }
  attributeChangedCallback(t, e, i) {
    t === "position" && this._tooltipBox && this._updatePosition(), t === "timeout" && i && (this._timeout = parseInt(i) || 200);
  }
  disconnectedCallback() {
    this._observer && this._observer.disconnect();
  }
  _forceHide() {
    clearTimeout(this._hideTimeout), clearTimeout(this._hiddenTimeout), this._tooltipBox && (this._tooltipBox.classList.remove("opacity-100"), this._tooltipBox.classList.add("opacity-0"), this._tooltipBox.classList.add("hidden"));
  }
  _isDragging() {
    var t, e;
    return window.__toolTipDragging || ((e = (t = document.body) == null ? void 0 : t.dataset) == null ? void 0 : e.dragging) === "true" ? !0 : !!document.querySelector("[data-dragging='true']");
  }
  _showTooltip() {
    if (this._isDragging()) {
      this._forceHide();
      return;
    }
    clearTimeout(this._hideTimeout), clearTimeout(this._hiddenTimeout), this._tooltipBox.classList.remove("hidden"), this._updatePosition(), setTimeout(() => {
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
    const t = this.getBoundingClientRect(), e = this._tooltipBox.getBoundingClientRect(), i = 6;
    let n = 0, r = 0;
    switch (this.getAttribute("position") || "top") {
      case "bottom":
        n = t.bottom + i, r = t.left + (t.width - e.width) / 2;
        break;
      case "left":
        n = t.top + (t.height - e.height) / 2, r = t.left - e.width - i;
        break;
      case "right":
        n = t.top + (t.height - e.height) / 2, r = t.right + i;
        break;
      case "top":
      default:
        n = t.top - e.height - i, r = t.left + (t.width - e.width) / 2;
    }
    const o = 4, l = window.innerWidth - e.width - o, c = window.innerHeight - e.height - o;
    r = Math.max(o, Math.min(r, l)), n = Math.max(o, Math.min(n, c)), this._tooltipBox.style.left = `${r}px`, this._tooltipBox.style.top = `${n}px`;
  }
};
Xt(_t, "_dragGuardInitialized", !1);
let Mn = _t;
class ld extends HTMLElement {
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
class dd extends HTMLElement {
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
      for (let a of n)
        a.classList.add("hidden");
      let r = i.querySelectorAll(".show-closed");
      for (let a of r)
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
class Te extends HTMLElement {
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
    super(), this._abbrevMap = Te.defaultAbbrevMap;
  }
  connectedCallback() {
    this.render();
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-abbrevmap" && this._parseAndSetAbbrevMap(i), this.render());
  }
  _parseAndSetAbbrevMap(t) {
    if (!t) {
      this._abbrevMap = Te.defaultAbbrevMap;
      return;
    }
    try {
      this._abbrevMap = JSON.parse(t);
    } catch {
      this._abbrevMap = Te.defaultAbbrevMap;
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
        const { match: a, meaning: o } = r;
        i += `
            <tool-tip position="top" class="!inline" timeout="300">
              <div class="data-tip p-2 text-sm text-white bg-gray-700 rounded shadow">
                ${o}
              </div>
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${a}
              </span>
            </tool-tip>
          `, n += a.length;
      } else
        i += t[n], n++;
    }
    return i;
  }
  findLongestAbbrevAt(t, e, i) {
    let n = null, r = 0;
    for (const a of Object.keys(i))
      t.startsWith(a, e) && a.length > r && (n = a, r = a.length);
    return n ? { match: n, meaning: i[n] } : null;
  }
  isSpaceOrPunct(t) {
    return /\s|[.,;:!?]/.test(t);
  }
}
class cd extends HTMLElement {
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
var ci;
class hd extends HTMLElement {
  constructor() {
    super();
    he(this, ci, 176);
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
    const i = Math.floor(e.width / (Bi(this, ci) + 10));
    for (let n = 0; n < this._images.length; n++)
      n < i - 1 ? this._images[n].classList.remove("hidden") : this._images[n].classList.add("hidden");
  }
}
ci = new WeakMap();
const ud = "msr-component-wrapper", Zs = "msr-selected-items-container", tr = "msr-placeholder-no-selection-text", md = "msr-selected-item-pill", gd = "msr-selected-item-text", pd = "msr-item-name", fd = "msr-item-additional-data", bd = "msr-selected-item-role", er = "msr-selected-item-delete-btn", _d = "msr-controls-area", ir = "msr-pre-add-button", nr = "msr-input-area-wrapper", Qe = "msr-input-area-default-border", dn = "msr-input-area-staged", sr = "msr-staging-area-container", vd = "msr-staged-item-pill", yd = "msr-staged-item-text", cn = "msr-staged-role-select", rr = "msr-staged-cancel-btn", ar = "msr-text-input", or = "msr-add-button", lr = "msr-options-list", dr = "msr-option-item", Ad = "msr-option-item-name", xd = "msr-option-item-detail", cr = "msr-option-item-highlighted", hn = "msr-hidden-select", Ed = "msr-state-no-selection", Sd = "msr-state-has-selection", Ld = "msr-state-list-open", Cd = "msr-state-item-staged";
class Ha extends HTMLElement {
  constructor() {
    super();
    Xt(this, "_blurTimeout", null);
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
                    <li role="option" class="${dr} group">
                        <span data-ref="nameEl" class="${Ad}"></span>
                        <span data-ref="detailEl" class="${xd}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${md} group">
                        <span data-ref="textEl" class="${gd}"></span>
                        <button type="button" data-ref="deleteBtn" class="${er} ml-2">&times;</button>
                    </span>
                `, this.stagedPlacePillTemplate = document.createElement("template"), this.stagedPlacePillTemplate.innerHTML = `
                    <span class="${vd} flex items-center">
                        <span data-ref="nameEl" class="${yd}"></span>
                    </span>
                `, this.stagedCancelBtnTemplate = document.createElement("template"), this.stagedCancelBtnTemplate.innerHTML = `
                    <button type="button" class="${rr} flex items-center justify-center">&times;</button>
                `, this.stagedRoleSelectTemplate = document.createElement("template"), this.stagedRoleSelectTemplate.innerHTML = `
                    <select class="${cn}">
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
      const i = e.map((a) => {
        if (typeof a == "string") {
          const o = a.split(",");
          if (o.length === 2) {
            const l = o[0].trim(), c = o[1].trim();
            if (this._getItemById(l) && this._roles.includes(c))
              return { itemId: l, role: c, instanceId: crypto.randomUUID() };
          }
        }
        return null;
      }).filter((a) => a !== null), n = [], r = /* @__PURE__ */ new Set();
      for (const a of i) {
        const o = `${a.itemId},${a.role}`;
        r.has(o) || (n.push(a), r.add(o));
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
    if (this.placeholderNoSelection = this.getAttribute("placeholder-no-selection") || this._placeholderNoSelection, this.placeholderSearch = this.getAttribute("placeholder-search") || this._placeholderSearch, this.placeholderRoleSelect = this.getAttribute("placeholder-role-select") || this._placeholderRoleSelect, this._render(), this.inputAreaWrapper = this.querySelector(`.${nr}`), this.inputElement = this.querySelector(`.${ar}`), this.stagedItemPillContainer = this.querySelector(`.${sr}`), this.optionsListElement = this.querySelector(`.${lr}`), this.selectedItemsContainer = this.querySelector(`.${Zs}`), this.addButtonElement = this.querySelector(`.${or}`), this.preAddButtonElement = this.querySelector(`.${ir}`), this.hiddenSelect = this.querySelector(`.${hn}`), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.hasAttribute("show-add-button") ? this.showAddButton = this.getAttribute("show-add-button") : this.setAttribute("show-add-button", String(this._showAddButton)), this.inputElement && (this.inputElement.placeholder = this.placeholderSearch), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleInputKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.addButtonElement.addEventListener("click", this._handleAddButtonClick), this.addEventListener("keydown", this._handleKeyDown), this._renderStagedPillOrInput(), this._updateAddButtonState(), this._updatePreAddButtonVisibility(), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
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
    this.inputElement && (this.inputElement.disabled = e), this.classList.toggle("pointer-events-none", e), this.querySelectorAll(`.${er}`).forEach(
      (n) => n.disabled = e
    );
    const i = this.querySelector(`.${cn}`);
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
    this.classList.toggle(Ed, this._value.length === 0), this.classList.toggle(Sd, this._value.length > 0), this.classList.toggle(Ld, this._isOptionsListVisible), this.classList.toggle(Cd, !!this._stagedItem);
  }
  _render() {
    const e = this.id || `msr-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e), this.innerHTML = `
                    <style>
                        .${hn} {
                            display: none !important; visibility: hidden !important; position: absolute !important;
                            width: 0 !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;
                        }
                    </style>
                    <div class="${ud} relative">
                        <div class="${Zs} flex flex-wrap gap-1 mb-2 min-h-[2.625rem] rounded-md" aria-live="polite">
                           ${this._value.length === 0 ? `<span class="${tr}">${this.placeholderNoSelection}</span>` : ""}
                        </div>
                        <div class="${_d} flex items-center">
                            <div class="${nr} ${Qe} flex-grow min-h-[42px] flex items-center flex-wrap gap-1" tabindex="-1">
                                <span class="${sr} flex items-center gap-2"></span>
                                <input type="text"
                                       class="${ar} flex-1 min-w-[100px] outline-none"
                                       placeholder="${this.placeholderSearch}"
                                       aria-haspopup="listbox"
                                       aria-expanded="false">
                            </div>
                            <button type="button"
                                    class="${ir} hidden flex items-center justify-center ml-2"
                                    aria-label="Element schnell hinzufügen">
                                +
                            </button>
                            <button type="button" class="${or} hidden ml-2">Hinzufügen</button>
                        </div>
                        <ul role="listbox" id="${e}-options-list" class="${lr} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "items_with_roles_default"}" id="hidden-select-${e}" class="${hn}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createStagedItemPillElement(e) {
    const n = this.stagedPlacePillTemplate.content.cloneNode(!0).firstElementChild;
    return n.querySelector('[data-ref="nameEl"]').textContent = e.name, n;
  }
  _createStagedRoleSelectElement(e, i) {
    const r = this.stagedRoleSelectTemplate.content.cloneNode(!0).firstElementChild;
    let a = `<option value="" disabled ${i ? "" : "selected"}>${this.placeholderRoleSelect}</option>`;
    return e.length === 0 && !this._roles.includes(i) ? (a += "<option disabled>Keine Rollen verfügbar</option>", r.disabled = !0) : (e.forEach((o) => {
      a += `<option value="${o}" ${o === i ? "selected" : ""}>${o}</option>`;
    }), r.disabled = e.length === 0 && i === ""), r.innerHTML = a, r.addEventListener("change", this._handleStagedRoleChange), r;
  }
  _createStagedCancelButtonElement(e) {
    const n = this.stagedCancelBtnTemplate.content.cloneNode(!0).firstElementChild;
    return n.setAttribute("aria-label", `Auswahl von ${e} abbrechen`), n.addEventListener("click", this._handleCancelStagedItem), n;
  }
  _renderStagedPillOrInput() {
    if (!(!this.stagedItemPillContainer || !this.inputElement || !this.inputAreaWrapper)) {
      if (this.stagedItemPillContainer.innerHTML = "", this._stagedItem && this._stagedItem.item) {
        this.inputAreaWrapper.classList.remove(Qe), this.inputAreaWrapper.classList.add(dn);
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
        this.inputAreaWrapper.classList.add(Qe), this.inputAreaWrapper.classList.remove(dn), this.inputElement.classList.remove("hidden");
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
    const r = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, a = r.querySelector('[data-ref="textEl"]');
    let o = `<span class="${pd}">${i.name}</span>`, l = i.additional_data ? ` <span class="${fd}">(${i.additional_data})</span>` : "", c = ` <span class="${bd}">${e.role}</span>`;
    a.innerHTML = `${o}${l}${c}`;
    const u = r.querySelector('[data-ref="deleteBtn"]');
    return u.setAttribute("aria-label", `Entferne ${i.name} als ${e.role}`), u.dataset.instanceId = e.instanceId, u.disabled = this.hasAttribute("disabled"), u.addEventListener("click", (m) => {
      m.stopPropagation(), this._handleDeleteSelectedItem(e.instanceId);
    }), r;
  }
  _renderSelectedItems() {
    this.selectedItemsContainer && (this.selectedItemsContainer.innerHTML = "", this._value.length === 0 ? this.selectedItemsContainer.innerHTML = `<span class="${tr}">${this.placeholderNoSelection}</span>` : this._value.forEach((e) => {
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
    return r.querySelector('[data-ref="nameEl"]').textContent = e.name, r.querySelector('[data-ref="detailEl"]').textContent = e.additional_data ? `(${e.additional_data})` : "", r.dataset.id = e.id, r.setAttribute("aria-selected", String(i === this._highlightedIndex)), r.id = `${this.id || "msr"}-option-${e.id}`, i === this._highlightedIndex && r.classList.add(cr), r;
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
          `.${cr}`
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
      `.${cn}`
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
          `.${rr}`
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
      if (!this._stagedItem && this.inputAreaWrapper && (this.inputAreaWrapper.classList.add(Qe), this.inputAreaWrapper.classList.remove(dn)), this.inputElement && this.inputElement.value.length > 0) {
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
    const i = e.target.closest(`li[data-id].${dr}`);
    if (i) {
      const n = i.dataset.id, r = this._filteredOptions.find((a) => a.id === n);
      r && this._stageItem(r);
    }
  }
  _handleDeleteSelectedItem(e) {
    this.hasAttribute("disabled") || (this._value = this._value.filter((i) => i.instanceId !== e), this._updateFormValue(), this._renderSelectedItems(), this._stagedItem && this._stagedItem.item && this._renderStagedPillOrInput(), this.inputElement && this.inputElement.focus(), this._updatePreAddButtonVisibility());
  }
}
Xt(Ha, "formAssociated", !0);
const wd = "mss-component-wrapper", hr = "mss-selected-items-container", Td = "mss-selected-item-pill", kd = "mss-selected-item-text", Id = "mss-selected-item-pill-detail", ur = "mss-selected-item-delete-btn", Rd = "mss-selected-item-edit-link", mr = "mss-input-controls-container", gr = "mss-input-wrapper", pr = "mss-input-wrapper-focused", fr = "mss-text-input", br = "mss-create-new-button", _r = "mss-toggle-button", Dd = "mss-inline-row", vr = "mss-options-list", Od = "mss-option-item", Bd = "mss-option-item-name", Md = "mss-option-item-detail", yr = "mss-option-item-highlighted", un = "mss-hidden-select", mn = "mss-no-items-text", Ar = "mss-loading", gn = 1, pn = 10, Nd = 250, Pd = "mss-state-no-selection", Fd = "mss-state-has-selection", qd = "mss-state-list-open";
class $a extends HTMLElement {
  constructor() {
    super();
    Xt(this, "_blurTimeout", null);
    this.internals_ = this.attachInternals(), this._value = [], this._initialValue = [], this._initialOrder = [], this._displayOrder = [], this._removedIds = /* @__PURE__ */ new Set(), this._initialCaptured = !1, this._allowInitialCapture = !0, this._options = [
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
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._remoteEndpoint = null, this._remoteResultKey = "items", this._remoteMinChars = gn, this._remoteLimit = pn, this._remoteFetchController = null, this._remoteFetchTimeout = null, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._editBase = this.getAttribute("data-edit-base") || "", this._editSuffix = this.getAttribute("data-edit-suffix") || "/edit", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${Od}">
                        <span data-ref="nameEl" class="${Bd}"></span>
                        <span data-ref="detailEl" class="${Md}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${Td} flex items-center">
                        <span data-ref="textEl" class="${kd}"></span>
                        <span data-ref="detailEl" class="${Id} hidden"></span>
                        <a data-ref="editLink" class="${Rd} hidden" aria-label="Bearbeiten">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" data-ref="deleteBtn" class="${ur}">&times;</button>
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
    const i = JSON.stringify([...this._value].sort());
    if (Array.isArray(e))
      this._value = [...new Set(e.filter((r) => typeof r == "string" && this._getItemById(r)))];
    else if (typeof e == "string" && e.trim() !== "") {
      const r = e.trim();
      this._getItemById(r) && !this._value.includes(r) ? this._value = [r] : this._getItemById(r) || (this._value = this._value.filter((a) => a !== r));
    } else this._value = [];
    const n = JSON.stringify([...this._value].sort());
    this._value.forEach((r) => {
      this._displayOrder.includes(r) || this._displayOrder.push(r);
    }), !this._initialCaptured && this._allowInitialCapture && this._value.length > 0 && (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0), this._value.forEach((r) => {
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
    this._render(), this.inputControlsContainer = this.querySelector(`.${mr}`), this.inputWrapper = this.querySelector(`.${gr}`), this.inputElement = this.querySelector(`.${fr}`), this.createNewButton = this.querySelector(`.${br}`), this.toggleButton = this.querySelector(`.${_r}`), this.optionsListElement = this.querySelector(`.${vr}`), this.selectedItemsContainer = this.querySelector(`.${hr}`), this.hiddenSelect = this.querySelector(`.${un}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._remoteEndpoint = this.getAttribute("data-endpoint") || null, this._remoteResultKey = this.getAttribute("data-result-key") || "items", this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), gn), this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), pn), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.addEventListener("click", this._handleToggleClick);
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
  attributeChangedCallback(e, i, n) {
    if (i !== n)
      if (e === "disabled") this.disabledCallback(this.hasAttribute("disabled"));
      else if (e === "name" && this.hiddenSelect) this.hiddenSelect.name = n;
      else if (e === "value" && this.inputElement)
        try {
          this.value = JSON.parse(n);
        } catch {
          this.value = n.split(",").map((a) => a.trim()).filter(Boolean);
        }
      else e === "placeholder" ? this.placeholder = n : e === "show-create-button" ? this.showCreateButton = n : e === "data-endpoint" ? this._remoteEndpoint = n || null : e === "data-result-key" ? this._remoteResultKey = n || "items" : e === "data-minchars" ? this._remoteMinChars = this._parsePositiveInt(n, gn) : e === "data-limit" ? this._remoteLimit = this._parsePositiveInt(n, pn) : e === "data-toggle-label" && (this._toggleLabel = n || "", this._toggleInput = this._toggleLabel !== "");
  }
  formAssociatedCallback(e) {
  }
  formDisabledCallback(e) {
    this.disabledCallback(e);
  }
  formResetCallback() {
    this.value = [], this._displayOrder = [], this._hideOptionsList(), this.inputElement && (this.inputElement.value = ""), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._updateRootElementStateClasses(), this._renderSelectedItems(), this._toggleInput && this._hideInputControls();
  }
  formStateRestoreCallback(e, i) {
    this.value = Array.isArray(e) ? e : [], this._updateRootElementStateClasses();
  }
  captureInitialSelection() {
    this._initialValue = [...this._value], this._initialOrder = [...this._value], this._displayOrder = [...this._value], this._removedIds.clear(), this._initialCaptured = !0, this._renderSelectedItems();
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
    this.inputElement && (this.inputElement.disabled = e), this.createNewButton && (this.createNewButton.disabled = e), this.toggleAttribute("disabled", e), this.querySelectorAll(`.${ur}`).forEach((i) => i.disabled = e), this.hiddenSelect && (this.hiddenSelect.disabled = e), e && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Pd, this._value.length === 0), this.classList.toggle(Fd, this._value.length > 0), this.classList.toggle(qd, this._isOptionsListVisible);
  }
  _render() {
    const e = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", e);
    const i = this.getAttribute("data-toggle-label") || "", n = i !== "", r = n ? "hidden" : "";
    this.innerHTML = `
                    <style>
                        .${un} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${wd} relative">
                        <div class="${Dd} flex flex-wrap items-center gap-2">
                            <div class="${hr} flex flex-wrap items-center gap-1 min-h-[30px]" aria-live="polite" tabindex="-1"></div>
                            ${n ? `<button type="button" class="${_r}">${i}</button>` : ""}
                            <div class="${mr} flex items-center gap-2 ${r}">
                                <div class="${gr} relative rounded-md flex items-center flex-grow">
                                    <input type="text"
                                           class="${fr} w-full outline-none bg-transparent"
                                           placeholder="${this.placeholder}"
                                           aria-autocomplete="list"
                                           aria-expanded="${this._isOptionsListVisible}"
                                           aria-controls="options-list-${e}"
                                           autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                                </div>
                                <button type="button" class="${br} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                            </div>
                        </div>
                        <ul id="options-list-${e}" role="listbox" class="${vr} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${e}" class="${un}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(e) {
    const i = this._getItemById(e);
    if (!i) return null;
    const r = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, a = r.querySelector('[data-ref="textEl"]'), o = r.querySelector('[data-ref="detailEl"]'), l = r.querySelector('[data-ref="editLink"]'), c = r.querySelector('[data-ref="deleteBtn"]');
    a.textContent = this._normalizeText(i.name);
    const u = this._normalizeText(i.additional_data);
    u ? (o.textContent = `(${u})`, o.classList.remove("hidden")) : (o.textContent = "", o.classList.add("hidden"));
    const m = this._removedIds.has(e);
    if (!this._initialValue.includes(e)) {
      const h = document.createElement("span");
      h.className = "ml-1 text-xs text-gray-600", h.textContent = "(Neu)", a.appendChild(h);
    }
    return m && (r.classList.add("bg-red-100"), r.style.position = "relative"), l && (this._editBase && !m ? (l.href = `${this._editBase}${e}${this._editSuffix}`, l.target = "_blank", l.rel = "noreferrer", l.classList.remove("hidden")) : (l.classList.add("hidden"), l.removeAttribute("href"), l.removeAttribute("target"), l.removeAttribute("rel"))), c.setAttribute("aria-label", m ? `Undo remove ${i.name}` : `Remove ${i.name}`), c.dataset.id = e, c.disabled = this.hasAttribute("disabled"), c.innerHTML = m ? '<span class="text-xs inline-flex items-center"><i class="ri-arrow-go-back-line"></i></span>' : "&times;", c.addEventListener("click", (h) => {
      h.stopPropagation(), this._handleDeleteSelectedItem(e);
    }), r;
  }
  _renderSelectedItems() {
    if (!this.selectedItemsContainer) return;
    this.selectedItemsContainer.innerHTML = "";
    const e = this._displayOrder.filter(
      (i) => this._value.includes(i) || this._removedIds.has(i)
    );
    if (e.length === 0) {
      const i = this.getAttribute("data-empty-text") || "Keine Auswahl...", n = this._inputCollapsed ? "" : "hidden";
      this.selectedItemsContainer.innerHTML = `<span class="${mn} ${n}">${i}</span>`;
    } else
      e.forEach((i) => {
        const n = this._createSelectedItemElement(i);
        n && this.selectedItemsContainer.appendChild(n);
      });
    this._updateRootElementStateClasses();
  }
  _createOptionElement(e, i) {
    const r = this.optionTemplate.content.cloneNode(!0).firstElementChild, a = r.querySelector('[data-ref="nameEl"]'), o = r.querySelector('[data-ref="detailEl"]');
    a.textContent = this._normalizeText(e.name);
    const l = this._normalizeText(e.additional_data);
    o.textContent = l ? `(${l})` : "", r.dataset.id = e.id, r.setAttribute("aria-selected", String(i === this._highlightedIndex));
    const c = `option-${this.id || "mss"}-${e.id}`;
    return r.id = c, i === this._highlightedIndex && (r.classList.add(yr), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", c)), r;
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
        const e = this.optionsListElement.querySelector(`.${yr}`);
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
        const o = this._normalizeText(r.name).toLowerCase().includes(n), l = this._normalizeText(r.additional_data), c = l && l.toLowerCase().includes(n);
        return o || c;
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
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(pr), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(pr), this._blurTimeout = setTimeout(() => {
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
        const e = this.selectedItemsContainer.querySelector(`.${mn}`);
        e && e.classList.add("hidden");
      }
      this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus(), this._inputCollapsed = !1;
    }
  }
  _hideInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.add("hidden"), this.toggleButton && this.toggleButton.classList.remove("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const e = this.selectedItemsContainer.querySelector(`.${mn}`);
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
    }, Nd);
  }
  _cancelRemoteFetch() {
    this._remoteFetchController && (this._remoteFetchController.abort(), this._remoteFetchController = null);
  }
  async _fetchRemoteOptions(e) {
    if (!this._remoteEndpoint) return;
    this._cancelRemoteFetch(), this.classList.add(Ar);
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
      const a = await r.json();
      if (i.signal.aborted)
        return;
      const o = this._extractRemoteOptions(a);
      this._applyRemoteResults(o);
    } catch (n) {
      if (i.signal.aborted)
        return;
      console.error("MultiSelectSimple remote fetch error:", n), this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
    } finally {
      this._remoteFetchController === i && (this._remoteFetchController = null), this.classList.remove(Ar);
    }
  }
  _extractRemoteOptions(e) {
    if (!e) return [];
    let i = [];
    return Array.isArray(e) ? i = e : this._remoteResultKey && Array.isArray(e[this._remoteResultKey]) ? i = e[this._remoteResultKey] : Array.isArray(e.items) && (i = e.items), i.map((n) => {
      if (!n) return null;
      const r = n.id ?? n.ID ?? n.value ?? "", a = n.name ?? n.title ?? n.label ?? "", o = n.detail ?? n.additional_data ?? n.annotation ?? "", l = this._normalizeText(a), c = this._normalizeText(o);
      return !r || !l ? null : {
        id: String(r),
        name: l,
        additional_data: c
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
Xt($a, "formAssociated", !0);
const Hd = "rbi-button", $d = "rbi-icon";
class Ud extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const t = `
              <button type="button" class="${Hd} cursor-pointer disabled:cursor-default" aria-label="Reset field">
								<tool-tip position="right">
									<div class="data-tip">Feld zurücksetzen</div>
									<span class="${$d} ri-arrow-go-back-fill"></span>
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
const it = "hidden", xr = "dm-stay", Ze = "dm-title", fn = "dm-menu-button", Vd = "dm-target", jd = "data-dm-target", Er = "dm-menu", Sr = "dm-menu-item", Wd = "dm-close-button";
var hi, Ua;
class zd extends HTMLElement {
  constructor() {
    super();
    he(this, hi);
    je(this, hi, Ua).call(this), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  connectedCallback() {
    this._target = document.getElementById(this.getAttribute(Vd)), this._target || (this._target = this), this._cildren = Array.from(this.children).filter((i) => i.nodeType === Node.ELEMENT_NODE && !i.classList.contains(fn)).map((i) => ({
      node: i,
      target: () => {
        const n = i.getAttribute(jd);
        return n ? document.getElementById(n) || this._target : this._target;
      },
      stay: () => i.hasAttribute(xr) && i.getAttribute(xr) == "true",
      hidden: () => i.classList.contains(it),
      name: () => {
        const n = i.querySelector("label");
        return n ? n.innerHTML : i.hasAttribute(Ze) ? i.getAttribute(Ze) : "";
      },
      nameText: () => {
        const n = i.querySelector("label");
        return n ? n.textContent.trim() : i.hasAttribute(Ze) ? i.getAttribute(Ze) : "";
      }
    }));
    const e = this._button;
    this._button = this.querySelector(`.${fn}`), !this._button && e && (this._button = e, this._button.parentElement || this.appendChild(this._button)), this._button || (this._button = document.createElement("button"), this._button.type = "button", this._button.classList.add(fn, it), this._button.innerHTML = '<i class="ri-add-line"></i> Felder hinzufügen', this.appendChild(this._button)), this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    for (const i of this._cildren)
      this.removeChild(i.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const i of this._cildren)
      i.node.querySelectorAll(`.${Wd}`).forEach((r) => {
        r.addEventListener("click", (a) => {
          this.hideDiv(a, i.node);
        });
      });
    this.renderIntoTarget(), this.refresh(), this._observer = new MutationObserver(() => {
      this.refresh();
    }), this._cildren.forEach((i) => {
      this._observer.observe(i.node, { attributes: !0, attributeFilter: ["class"] });
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
    const n = this._cildren.find((a) => a.node === i);
    if (!n) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    n.node.classList.add(it), this._clearFields(n.node);
    const r = n.target();
    r && r.contains(n.node) && r.removeChild(n.node), n.node.parentElement || this.appendChild(n.node), this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
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
        r.forEach((a) => {
          a.dataset.dmResizeBound !== "true" && (a.dataset.dmResizeBound = "true", a.addEventListener("input", () => {
            window.TextareaAutoResize(a);
          })), window.TextareaAutoResize(a);
        });
      }, 10);
    }
    requestAnimationFrame(() => {
      this._focusFirstField(n.node);
    });
  }
  renderMenu() {
    const e = this._cildren.filter((n) => n.hidden());
    if (e.length <= 1) {
      this.hideMenu();
      return;
    }
    (!this._menu || !this._button.contains(this._menu)) && (this._button.insertAdjacentHTML("beforeend", `<div class="${Er} absolute hidden"></div>`), this._menu = this._button.querySelector(`.${Er}`)), this._menu.innerHTML = `${e.map((n, r) => `
				<button type="button" class="${Sr}" dm-itemno="${this._cildren.indexOf(n)}">
					${n.name()}
				</button>`).join("")}`, this._menu.querySelectorAll(`.${Sr}`).forEach((n) => {
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
    const i = e.target(), n = this._cildren.indexOf(e), r = this._cildren.slice(n + 1).filter((a) => a.target() === i).map((a) => a.node).find((a) => i && i.contains(a));
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
  _clearFields(e) {
    e && (e.querySelectorAll("input, textarea, select").forEach((i) => {
      if (i.matches("input[type='checkbox'], input[type='radio']")) {
        i.checked = !1;
        return;
      }
      if (i.matches("select")) {
        i.selectedIndex = -1;
        return;
      }
      i.value = "";
    }), e.querySelectorAll("trix-editor").forEach((i) => {
      var n;
      typeof ((n = i.editor) == null ? void 0 : n.loadHTML) == "function" && i.editor.loadHTML("");
    }));
  }
  _focusFirstField(e) {
    if (!e)
      return;
    const i = e.querySelectorAll(
      "input:not([type='hidden']):not([disabled]), textarea:not([disabled]), select:not([disabled]), [contenteditable='true'], trix-editor"
    );
    for (const n of i)
      if (n instanceof HTMLElement && n.getClientRects().length !== 0) {
        try {
          n.focus({ preventScroll: !0 });
        } catch {
          n.focus();
        }
        return;
      }
  }
}
hi = new WeakSet(), Ua = function() {
  this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null, this._originalButtonText = null;
};
const at = "items-row", Kd = "items-list", Gd = "items-template", Jd = "items-add-button", Yd = "items-cancel-button", ti = "items-remove-button", Xd = "items-edit-button", Qd = "items-close-button", Zd = "items-summary", tc = "items-edit-panel", bn = "items_removed[]", ve = "data-items-removed";
class ec extends HTMLElement {
  constructor() {
    super(), this._list = null, this._template = null, this._addButton = null, this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`, this._handleAdd = this._onAddClick.bind(this);
  }
  connectedCallback() {
    if (this._list = this.querySelector(`.${Kd}`), this._template = this.querySelector(`template.${Gd}`), this._addButton = this.querySelector(`.${Jd}`), !this._list || !this._template || !this._addButton) {
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
    const t = this._template.content.cloneNode(!0), e = t.querySelector(`.${at}`);
    if (!e) {
      console.error("ItemsEditor: Template is missing a row element.");
      return;
    }
    this._list.appendChild(t), this._captureOriginalValues(e), this._wireCancelButtons(e), this._wireRemoveButtons(e), this._wireEditButtons(e), this._assignRowFieldIds(e, this._rowIndex(e)), this._wireSummarySync(e), this._syncSummary(e), this._setRowMode(e, "edit");
  }
  removeItem(t) {
    const e = t.closest(`.${at}`);
    if (!e)
      return;
    const i = e.getAttribute(ve) === "true";
    this._setRowRemoved(e, !i);
  }
  _wireRemoveButtons(t = this) {
    t.querySelectorAll(`.${ti}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault(), this.removeItem(e);
      }), e.addEventListener("mouseenter", () => {
        const i = e.closest(`.${at}`);
        if (!i || i.getAttribute(ve) !== "true")
          return;
        const n = e.querySelector("[data-delete-label]");
        n && (n.textContent = n.getAttribute("data-delete-hover") || "Rückgängig");
        const r = e.querySelector("i");
        r && (r.classList.remove("hidden"), r.classList.add("ri-arrow-go-back-line"), r.classList.remove("ri-delete-bin-line"));
      }), e.addEventListener("mouseleave", () => {
        const i = e.closest(`.${at}`), n = e.querySelector("[data-delete-label]");
        if (!n)
          return;
        i && i.getAttribute(ve) === "true" ? n.textContent = n.getAttribute("data-delete-active") || "Wird entfernt" : n.textContent = n.getAttribute("data-delete-default") || "Entfernen";
        const r = e.querySelector("i");
        r && (i && i.getAttribute(ve) === "true" ? (r.classList.add("hidden"), r.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (r.classList.remove("hidden"), r.classList.add("ri-delete-bin-line"), r.classList.remove("ri-arrow-go-back-line")));
      }));
    });
  }
  _wireCancelButtons(t = this) {
    t.querySelectorAll(`.${Yd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const n = e.closest(`.${at}`);
        n && this._cancelEdit(n);
      }));
    });
  }
  _wireEditButtons(t = this) {
    t.querySelectorAll(`.${Xd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const n = e.closest(`.${at}`);
        n && this._setRowMode(n, "edit");
      }));
    }), t.querySelectorAll(`.${Qd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const n = e.closest(`.${at}`);
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
    t.setAttribute(ve, e ? "true" : "false"), t.classList.toggle("bg-red-50", e);
    const i = t.querySelector(".items-edit-button");
    i && (e ? i.classList.add("hidden") : i.classList.remove("hidden")), t.querySelectorAll("[data-delete-label]").forEach((a) => {
      const o = a.closest(`.${ti}`), l = o && o.matches(":hover");
      let c;
      e && l ? c = a.getAttribute("data-delete-hover") || "Rückgängig" : e ? c = a.getAttribute("data-delete-active") || "Wird entfernt" : c = a.getAttribute("data-delete-default") || "Entfernen", a.textContent = c;
    }), t.querySelectorAll(`.${ti} i`).forEach((a) => {
      const o = a.closest(`.${ti}`), l = o && o.matches(":hover");
      e ? l ? (a.classList.remove("hidden"), a.classList.add("ri-arrow-go-back-line"), a.classList.remove("ri-delete-bin-line")) : (a.classList.add("hidden"), a.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (a.classList.remove("hidden"), a.classList.add("ri-delete-bin-line"), a.classList.remove("ri-arrow-go-back-line"));
    });
    const n = t.querySelector('input[name="items_id[]"]'), r = n ? n.value.trim() : "";
    r && (e ? this._ensureRemovalInput(r) : this._removeRemovalInput(r)), t.querySelectorAll("[data-field]").forEach((a) => {
      a.disabled = e;
    });
  }
  _setRowMode(t, e) {
    const i = t.querySelector(`.${Zd}`), n = t.querySelector(`.${tc}`);
    !i || !n || (e === "edit" ? (i.classList.add("hidden"), n.classList.remove("hidden")) : (i.classList.remove("hidden"), n.classList.add("hidden"), this._syncSummary(t)));
  }
  _captureAllOriginals() {
    this.querySelectorAll(`.${at}`).forEach((t) => {
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
    Array.from(this.querySelectorAll(`.${at}`)).forEach((e, i) => {
      this._assignRowFieldIds(e, i);
    });
  }
  _rowIndex(t) {
    return Array.from(this.querySelectorAll(`.${at}`)).indexOf(t);
  }
  _assignRowFieldIds(t, e) {
    e < 0 || t.querySelectorAll("[data-field-label]").forEach((i) => {
      const n = i.getAttribute("data-field-label");
      if (!n)
        return;
      const r = t.querySelector(`[data-field="${n}"]`);
      if (!r)
        return;
      const a = `${this._idPrefix}-${e}-${n}`;
      r.id = a, i.setAttribute("for", a);
    });
  }
  _syncAllSummaries() {
    this.querySelectorAll(`.${at}`).forEach((t) => {
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
      const r = this._readFieldValue(n), a = e.getAttribute("data-summary-hide-empty") === "true" ? e.closest("[data-summary-container]") : null;
      r ? (this._setSummaryContent(e, r), e.classList.remove("text-gray-400"), a && a.classList.remove("hidden")) : (this._setSummaryContent(e, "—"), e.classList.add("text-gray-400"), a && a.classList.add("hidden"));
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
    if (Array.from(this.querySelectorAll(`input[name="${bn}"]`)).some(
      (n) => n.value === t
    ))
      return;
    const i = document.createElement("input");
    i.type = "hidden", i.name = bn, i.value = t, this.appendChild(i);
  }
  _removeRemovalInput(t) {
    const e = Array.from(this.querySelectorAll(`input[name="${bn}"]`));
    for (const i of e)
      i.value === t && i.remove();
  }
}
const ic = "ssr-wrapper", Lr = "ssr-input", Cr = "ssr-list", nc = "ssr-option", sc = "ssr-option-name", rc = "ssr-option-detail", ac = "ssr-option-bio", wr = "ssr-hidden-input", Tr = "ssr-clear-button", _n = 1, vn = 10, oc = 250;
class lc extends HTMLElement {
  constructor() {
    super(), this._endpoint = "", this._resultKey = "items", this._minChars = _n, this._limit = vn, this._placeholder = "Search...", this._options = [], this._selected = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._listVisible = !1, this._linkBase = "", this._linkTarget = "_blank", this._linkButton = null, this._showWarningIcon = !1, this._linkField = "id", this._boundHandleInput = this._handleInput.bind(this), this._boundHandleFocus = this._handleFocus.bind(this), this._boundHandleKeyDown = this._handleKeyDown.bind(this), this._boundHandleClear = this._handleClear.bind(this), this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }
  static get observedAttributes() {
    return [
      "data-endpoint",
      "data-result-key",
      "data-minchars",
      "data-limit",
      "placeholder",
      "name",
      "data-link-base",
      "data-link-target",
      "data-link-field",
      "data-initial-link-id",
      "data-show-warning-icon"
    ];
  }
  connectedCallback() {
    this._render(), this._input = this.querySelector(`.${Lr}`), this._list = this.querySelector(`.${Cr}`), this._hiddenInput = this.querySelector(`.${wr}`), this._clearButton = this.querySelector(`.${Tr}`), this._endpoint = this.getAttribute("data-endpoint") || "", this._resultKey = this.getAttribute("data-result-key") || "items", this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), _n), this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), vn), this._placeholder = this.getAttribute("placeholder") || "Search...";
    const t = this.getAttribute("data-initial-id") || "", e = this.getAttribute("data-initial-name") || "", i = this.getAttribute("data-initial-link-id") || "";
    this._linkBase = this.getAttribute("data-link-base") || "", this._linkTarget = this.getAttribute("data-link-target") || "_blank", this._linkField = this.getAttribute("data-link-field") || "id", this._showWarningIcon = this.getAttribute("data-show-warning-icon") === "true", this._input && (this._input.placeholder = this._placeholder, this._input.addEventListener("input", this._boundHandleInput), this._input.addEventListener("focus", this._boundHandleFocus), this._input.addEventListener("keydown", this._boundHandleKeyDown)), this._linkButton = this.querySelector("[data-role='ssr-open-link']"), this._clearButton && this._clearButton.addEventListener("click", this._boundHandleClear), t && e && (this._selected = { id: t, name: e, linkId: i }, this._input && (this._input.value = e), this._syncHiddenInput()), this._updateLinkButton(), document.addEventListener("click", this._boundHandleClickOutside);
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleClickOutside), this._input && (this._input.removeEventListener("input", this._boundHandleInput), this._input.removeEventListener("focus", this._boundHandleFocus), this._input.removeEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.removeEventListener("click", this._boundHandleClear);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && (t === "data-endpoint" && (this._endpoint = i || ""), t === "data-result-key" && (this._resultKey = i || "items"), t === "data-minchars" && (this._minChars = this._parsePositiveInt(i, _n)), t === "data-limit" && (this._limit = this._parsePositiveInt(i, vn)), t === "placeholder" && (this._placeholder = i || "Search...", this._input && (this._input.placeholder = this._placeholder)), t === "name" && this._hiddenInput && (this._hiddenInput.name = i || ""), t === "data-link-base" && (this._linkBase = i || ""), t === "data-link-target" && (this._linkTarget = i || "_blank"), t === "data-link-field" && (this._linkField = i || "id"), t === "data-show-warning-icon" && (this._showWarningIcon = i === "true"));
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
    t.preventDefault(), this._selected = null, this._options = [], this._input && (this._input.value = ""), this._syncHiddenInput(), this._updateLinkButton(), this._renderOptions(), this._hideList(), this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: null } }));
  }
  _handleClickOutside(t) {
    this.contains(t.target) || this._hideList();
  }
  _debouncedFetch(t) {
    this._fetchTimeout && clearTimeout(this._fetchTimeout), this._fetchTimeout = setTimeout(() => {
      this._fetchOptions(t);
    }, oc);
  }
  async _fetchOptions(t) {
    var i;
    if (!this._endpoint)
      return;
    this._fetchController && this._fetchController.abort(), this.dispatchEvent(new CustomEvent("ssrbeforefetch", { bubbles: !0 })), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), this._limit > 0 && e.searchParams.set("limit", String(this._limit));
    try {
      const n = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!n.ok)
        return;
      const r = await n.json();
      let o = (Array.isArray(r == null ? void 0 : r[this._resultKey]) ? r[this._resultKey] : []).filter((l) => l && l.id && l.name);
      if (this._excludeIds && Array.isArray(this._excludeIds)) {
        const l = new Set(this._excludeIds);
        o = o.filter((c) => !l.has(c.id));
      }
      this._options = o, this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._maybeAutoSelectExactMatch(t), this._renderOptions(), this._options.length > 0 ? this._options.length === 1 && this._isExactMatch(t, ((i = this._options[0]) == null ? void 0 : i.name) || "") ? this._hideList() : this._showList() : this._hideList();
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError")
        return;
    }
  }
  _isExactMatch(t, e) {
    const i = (t || "").trim().toLowerCase(), n = (e || "").trim().toLowerCase();
    return i !== "" && i === n;
  }
  _maybeAutoSelectExactMatch(t) {
    var n;
    if (!t)
      return;
    const e = this._options.find((r) => this._isExactMatch(t, (r == null ? void 0 : r.name) || ""));
    if (!e)
      return;
    const i = ((n = this._selected) == null ? void 0 : n.id) || "";
    this._selected = e, this._syncHiddenInput(), this._updateLinkButton(), e.id !== i && (this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: e } })), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  _renderOptions() {
    this._list && (this._list.innerHTML = "", this._options.forEach((t) => {
      const e = document.createElement("button");
      e.type = "button", e.setAttribute("data-index", String(this._options.indexOf(t))), e.className = [
        nc,
        "w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors"
      ].join(" ");
      const n = this._options.indexOf(t) === this._highlightedIndex;
      e.classList.toggle("bg-slate-100", n), e.classList.toggle("text-gray-900", n), e.setAttribute("aria-selected", n ? "true" : "false");
      const r = document.createElement("div");
      if (r.className = [sc, "text-sm font-semibold text-gray-800"].join(" "), r.textContent = t.name, e.appendChild(r), t.detail) {
        const a = document.createElement("div");
        a.className = [rc, "text-xs text-gray-600"].join(" "), a.textContent = t.detail, e.appendChild(a);
      }
      if (t.bio) {
        const a = document.createElement("div");
        a.className = [ac, "text-xs text-gray-500"].join(" "), a.textContent = t.bio, e.appendChild(a);
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
    this._selected = t, this._input && (this._input.value = t.name || ""), this._syncHiddenInput(), this._updateLinkButton(), this._hideList(), this.dispatchEvent(new CustomEvent("ssrchange", { bubbles: !0, detail: { item: t } })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
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
			<div class="${ic} relative">
				<div class="flex items-center gap-2">
					<input
						type="text"
						class="${Lr} inputinput w-full"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						spellcheck="false"
						placeholder="${this._placeholder}"
					/>
					<a
						class="ssr-open-link hidden text-sm text-gray-600 hover:text-gray-900 no-underline"
						data-role="ssr-open-link"
						aria-label="Auswahl öffnen"
						target="${this._linkTarget}"
						rel="noreferrer">
						<i data-role="ssr-open-link-icon" class="ri-external-link-line"></i>
					</a>
					<button type="button" class="${Tr} text-sm text-gray-600 hover:text-gray-900">
						<i class="ri-close-line"></i>
					</button>
				</div>
				<input type="hidden" class="${wr}" name="${t}" value="" />
				<div class="${Cr} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
			</div>
		`;
  }
  _updateLinkButton() {
    var i, n, r;
    if (!this._linkButton)
      return;
    const t = ((i = this._selected) == null ? void 0 : i[this._linkField]) || ((n = this._selected) == null ? void 0 : n.linkId) || ((r = this._selected) == null ? void 0 : r.id), e = this._linkButton.querySelector("[data-role='ssr-open-link-icon']");
    if (!t || !this._linkBase) {
      this._showWarningIcon ? (this._linkButton.classList.remove("hidden"), this._linkButton.removeAttribute("href"), this._linkButton.classList.add("ssr-open-link-warning"), this._linkButton.setAttribute("aria-label", "Auswahl fehlt"), e && (e.className = "ri-error-warning-line")) : (this._linkButton.classList.add("hidden"), this._linkButton.removeAttribute("href"));
      return;
    }
    this._linkButton.classList.remove("hidden"), this._linkButton.classList.remove("ssr-open-link-warning"), this._linkButton.setAttribute("href", `${this._linkBase}${t}`), this._linkButton.setAttribute("aria-label", "Auswahl öffnen"), e && (e.className = "ri-external-link-line");
  }
}
const ei = "Bevorzugter Reihentitel";
class dc extends HTMLElement {
  constructor() {
    super(), this._pendingAgent = null, this._form = null, this._saveButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null, this._saveEndpoint = "", this._deleteEndpoint = "", this._isSaving = !1, this._preferredSeriesRelationId = "", this._preferredSeriesSeriesId = "", this._handleSaveClick = this._handleSaveClick.bind(this), this._handleSaveViewClick = this._handleSaveViewClick.bind(this), this._handleResetClick = this._handleResetClick.bind(this), this._handleDeleteClick = this._handleDeleteClick.bind(this), this._handleDeleteConfirmClick = this._handleDeleteConfirmClick.bind(this), this._handleDeleteCancelClick = this._handleDeleteCancelClick.bind(this);
  }
  connectedCallback() {
    setTimeout(() => {
      this._initForm(), this._initPlaces(), this._initPreferredSeries(), this._initSaveHandling(), this._initStatusSelect();
    }, 0);
  }
  _initStatusSelect() {
    const t = this.querySelector(".status-select");
    if (!t)
      return;
    const e = this.querySelector(".status-icon");
    t.addEventListener("change", (i) => {
      const n = i.target.value;
      t.setAttribute("data-status", n), e && this._updateStatusIcon(e, n);
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
      case "Unknown":
      default:
        t.classList.add("ri-forbid-2-line");
        break;
    }
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
    this._teardownSaveHandling(), this._form = this.querySelector("#changealmanachform"), this._saveButton = this.querySelector("[data-role='almanach-save']"), this._saveViewButton = this.querySelector("[data-role='almanach-save-view']"), this._resetButton = this.querySelector("[data-role='almanach-reset']"), this._deleteButton = this.querySelector("[data-role='almanach-delete']"), this._deleteDialog = this.querySelector("[data-role='almanach-delete-dialog']"), this._deleteConfirmButton = this.querySelector("[data-role='almanach-delete-confirm']"), this._deleteCancelButton = this.querySelector("[data-role='almanach-delete-cancel']"), this._statusEl = this.querySelector("#almanach-save-feedback"), !(!this._form || !this._saveButton) && (this._saveEndpoint = this._form.getAttribute("data-save-endpoint") || this._deriveSaveEndpoint(), this._deleteEndpoint = this._form.getAttribute("data-delete-endpoint") || "", this._saveButton.addEventListener("click", this._handleSaveClick), this._saveViewButton && this._saveViewButton.addEventListener("click", this._handleSaveViewClick), this._resetButton && this._resetButton.addEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.addEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.addEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.addEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.addEventListener("cancel", this._handleDeleteCancelClick));
  }
  _initPreferredSeries() {
    const t = this.querySelector("#preferred-series-field");
    t && (this._preferredSeriesRelationId = t.getAttribute("data-preferred-relation-id") || "", this._preferredSeriesSeriesId = t.getAttribute("data-preferred-series-id") || "");
  }
  _teardownSaveHandling() {
    this._saveButton && this._saveButton.removeEventListener("click", this._handleSaveClick), this._saveViewButton && this._saveViewButton.removeEventListener("click", this._handleSaveViewClick), this._resetButton && this._resetButton.removeEventListener("click", this._handleResetClick), this._deleteButton && this._deleteButton.removeEventListener("click", this._handleDeleteClick), this._deleteConfirmButton && this._deleteConfirmButton.removeEventListener("click", this._handleDeleteConfirmClick), this._deleteCancelButton && this._deleteCancelButton.removeEventListener("click", this._handleDeleteCancelClick), this._deleteDialog && this._deleteDialog.removeEventListener("cancel", this._handleDeleteCancelClick), this._saveButton = null, this._saveViewButton = null, this._resetButton = null, this._deleteButton = null, this._deleteDialog = null, this._deleteConfirmButton = null, this._deleteCancelButton = null, this._statusEl = null;
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
        credentials: "same-origin",
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
      await this._reloadForm((n == null ? void 0 : n.message) || "Änderungen gespeichert.");
    } catch (i) {
      this._showStatus(i instanceof Error ? i.message : "Speichern fehlgeschlagen.", "error");
    } finally {
      this._setSavingState(!1);
    }
  }
  async _handleSaveViewClick(t) {
    var n;
    if (t.preventDefault(), this._isSaving)
      return;
    const e = (n = this._saveViewButton) == null ? void 0 : n.getAttribute("data-redirect-url");
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
        let a = `Speichern fehlgeschlagen (${r.status}).`;
        try {
          const o = await r.clone().json();
          a = (o == null ? void 0 : o.error) || a;
        } catch {
        }
        throw new Error(a);
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
          const o = (r == null ? void 0 : r.error) || `Löschen fehlgeschlagen (${n.status}).`;
          throw new Error(o);
        }
        const a = (r == null ? void 0 : r.redirect) || "/suche/baende";
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
    const r = t.getAll("languages[]").map((x) => x.trim()).filter(Boolean), a = t.getAll("places[]").map((x) => x.trim()).filter(Boolean), { items: o, removedIds: l } = this._collectItems(t), {
      relations: c,
      deleted: u
    } = this._collectRelations(t, {
      prefix: "entries_series",
      targetField: "series"
    }), m = this._collectNewRelations("entries_series"), p = this._readValue(t, "preferred_series_id");
    if (!p)
      throw new Error("Reihentitel ist erforderlich.");
    const h = (x) => {
      x.type = ei, x.uncertain = !1;
    };
    let f = !1;
    c.forEach((x) => {
      x.target_id === p && (h(x), f = !0);
    }), m.forEach((x) => {
      x.target_id === p && (h(x), f = !0);
    }), f || (this._preferredSeriesRelationId && this._preferredSeriesSeriesId === p ? c.push({
      id: this._preferredSeriesRelationId,
      target_id: p,
      type: ei,
      uncertain: !1
    }) : m.push({
      target_id: p,
      type: ei,
      uncertain: !1
    })), this._preferredSeriesRelationId && this._preferredSeriesSeriesId && this._preferredSeriesSeriesId !== p && !u.includes(this._preferredSeriesRelationId) && u.push(this._preferredSeriesRelationId);
    const A = [...c, ...m].filter(
      (x) => x.type === ei
    ).length;
    if (A === 0)
      throw new Error("Mindestens ein bevorzugter Reihentitel muss verknüpft sein.");
    if (A > 1)
      throw new Error("Es darf nur ein bevorzugter Reihentitel gesetzt sein.");
    const {
      relations: I,
      deleted: $
    } = this._collectRelations(t, {
      prefix: "entries_agents",
      targetField: "agent"
    }), R = this._collectNewRelations("entries_agents"), _ = [...c, ...m].map((x) => x.target_id);
    if (_.filter((x, z) => _.indexOf(x) !== z).length > 0)
      throw new Error("Doppelte Reihenverknüpfungen sind nicht erlaubt.");
    return {
      csrf_token: this._readValue(t, "csrf_token"),
      last_edited: this._readValue(t, "last_edited"),
      entry: e,
      languages: r,
      places: a,
      items: o,
      deleted_item_ids: l,
      series_relations: c,
      new_series_relations: m,
      deleted_series_relation_ids: u,
      agent_relations: I,
      new_agent_relations: R,
      deleted_agent_relation_ids: $
    };
  }
  _collectItems(t) {
    const e = t.getAll("items_id[]").map((m) => m.trim()), i = t.getAll("items_owner[]"), n = t.getAll("items_identifier[]"), r = t.getAll("items_location[]"), a = t.getAll("items_media[]"), o = t.getAll("items_annotation[]"), l = t.getAll("items_uri[]"), c = new Set(
      t.getAll("items_removed[]").map((m) => m.trim()).filter(Boolean)
    ), u = [];
    for (let m = 0; m < e.length; m += 1) {
      const p = e[m] || "";
      if (p && c.has(p))
        continue;
      const h = (i[m] || "").trim(), f = (n[m] || "").trim(), A = (r[m] || "").trim(), I = (o[m] || "").trim(), $ = (l[m] || "").trim(), R = (a[m] || "").trim();
      if (p || h || f || A || I || $ || R) {
        if (!R)
          throw new Error(`Exemplar ${m + 1}: "Vorhanden als" muss ausgefüllt werden.`);
        u.push({
          id: p,
          owner: h,
          identifier: f,
          location: A,
          annotation: I,
          uri: $,
          media: R ? [R] : []
        });
      }
    }
    return {
      items: u,
      removedIds: Array.from(c)
    };
  }
  _collectRelations(t, { prefix: e, targetField: i }) {
    const n = [], r = [];
    for (const [a, o] of t.entries()) {
      if (!a.startsWith(`${e}_id[`))
        continue;
      const l = a.slice(a.indexOf("[") + 1, -1), c = `${e}_${i}[${l}]`, u = `${e}_type[${l}]`, m = `${e}_delete[${l}]`, p = `${e}_uncertain[${l}]`, h = (o || "").trim(), f = (t.get(c) || "").trim();
      if (!f || !h)
        continue;
      if (t.has(m)) {
        r.push(h);
        continue;
      }
      const A = (t.get(u) || "").trim();
      n.push({
        id: h,
        target_id: f,
        type: A,
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
      const a = r.querySelector(`input[name='${t}_new_id']`), o = r.querySelector(`select[name='${t}_new_type']`), l = r.querySelector(`input[name='${t}_new_uncertain']`);
      if (!a)
        return;
      const c = a.value.trim();
      c && n.push({
        target_id: c,
        type: ((o == null ? void 0 : o.value) || "").trim(),
        uncertain: !!(l != null && l.checked)
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
    const n = await i.text(), a = new DOMParser().parseFromString(n, "text/html"), o = a.querySelector("#changealmanachform"), l = this.querySelector("#changealmanachform");
    if (!o || !l)
      throw new Error("Formular konnte nicht geladen werden.");
    l.replaceWith(o), this._form = o;
    const c = a.querySelector("#user-message"), u = this.querySelector("#user-message");
    c && u && u.replaceWith(c);
    const m = a.querySelector("#almanach-header-data"), p = this.querySelector("#almanach-header-data");
    m && p && p.replaceWith(m), this._initForm(), this._initPlaces(), this._initSaveHandling(), typeof window.TextareaAutoResize == "function" && setTimeout(() => {
      this.querySelectorAll("textarea").forEach((h) => {
        window.TextareaAutoResize(h);
      });
    }, 100);
  }
}
const cc = "[data-role='relation-add-toggle']", hc = "[data-role='relation-add-panel']", uc = "[data-role='relation-add-close']", mc = "[data-role='relation-add-apply']", gc = "[data-role='relation-add-error']", pc = "[data-role='relation-add-row']", fc = "[data-role='relation-add-select']", bc = "[data-role='relation-type-select']", _c = "[data-role='relation-uncertain']", vc = "template[data-role='relation-new-template']", kr = "[data-role='relation-new-delete']", Qt = "[data-rel-row]";
class yc extends HTMLElement {
  constructor() {
    super(), this._pendingItem = null, this._pendingApply = !1;
  }
  connectedCallback() {
    this._prefix = this.getAttribute("data-prefix") || "", this._linkBase = this.getAttribute("data-link-base") || "", this._newLabel = this.getAttribute("data-new-label") || "(Neu)", this._addToggleId = this.getAttribute("data-add-toggle-id") || "", this._preferredLabel = (this.getAttribute("data-preferred-label") || "").trim(), this._emptyText = this.querySelector(".rel-empty-text"), this._setupAddPanel(), this._setupDeleteToggles(), this._setupNewRowDeletes(), this._setupPreferredOptionHandling();
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
    if (this._addToggle = this.querySelector(cc), this._addToggleId) {
      const t = document.getElementById(this._addToggleId);
      t && (this._addToggle = t);
    }
    this._addPanel = this.querySelector(hc), this._addClose = this.querySelector(uc), this._addApply = this.querySelector(mc), this._addError = this.querySelector(gc), this._addRow = this.querySelector(pc), this._addSelect = this.querySelector(fc), this._typeSelect = this.querySelector(bc), this._uncertain = this.querySelector(_c), this._template = this.querySelector(vc), this._addInput = this._addSelect ? this._addSelect.querySelector(".ssr-input") : null, !(!this._addPanel || !this._addRow || !this._addSelect || !this._typeSelect || !this._uncertain || !this._template) && (this._addSelect && this._prefix === "entries_series" && this._addSelect.addEventListener("ssrbeforefetch", () => {
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
    const t = this._template.content.cloneNode(!0), e = t.querySelector(Qt) || t.firstElementChild;
    if (!e)
      return;
    const i = t.querySelector("[data-rel-link]");
    i && i.setAttribute("href", `${this._linkBase}${this._pendingItem.id}`);
    const n = t.querySelector("[data-rel-name]");
    n && (n.textContent = this._pendingItem.name || "");
    const r = t.querySelector("[data-rel-detail]"), a = t.querySelector("[data-rel-detail-container]"), o = this._pendingItem.detail || this._pendingItem.bio || "";
    r && o ? r.textContent = o : a && a.remove();
    const l = t.querySelector("[data-rel-new]");
    l && (l.textContent = this._newLabel);
    const c = t.querySelector("[data-rel-input='type']");
    c && this._typeSelect && (c.innerHTML = this._typeSelect.innerHTML, c.value = this._typeSelect.value, c.name = `${this._prefix}_new_type`, c.addEventListener("change", () => this._updatePreferredOptions()));
    const u = t.querySelector("[data-rel-input='uncertain']");
    if (u && this._uncertain) {
      u.checked = this._uncertain.checked, u.name = `${this._prefix}_new_uncertain`, u.value = this._pendingItem.id;
      const h = `${this._prefix}_new_uncertain_row`;
      u.id = h;
      const f = t.querySelector("[data-rel-uncertain-label]");
      f && f.setAttribute("for", h);
    }
    const m = t.querySelector("[data-rel-input='id']");
    m && (m.name = `${this._prefix}_new_id`, m.value = this._pendingItem.id);
    const p = t.querySelector(kr);
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
        const n = t.closest(Qt);
        n && (n.classList.toggle("bg-red-50", i.checked), n.querySelectorAll("select, input[type='checkbox']").forEach((l) => {
          l !== i && (l.disabled = i.checked);
        }));
        const r = t.matches(":hover"), a = t.querySelector("[data-delete-label]");
        if (a) {
          let l;
          i.checked && r ? l = a.getAttribute("data-delete-hover") || "Rückgängig" : i.checked ? l = a.getAttribute("data-delete-active") || "Wird entfernt" : l = a.getAttribute("data-delete-default") || "Entfernen", a.textContent = l;
        }
        const o = t.querySelector("i");
        o && (i.checked ? r ? (o.classList.remove("hidden"), o.classList.add("ri-arrow-go-back-line"), o.classList.remove("ri-delete-bin-line")) : (o.classList.add("hidden"), o.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (o.classList.remove("hidden"), o.classList.add("ri-delete-bin-line"), o.classList.remove("ri-arrow-go-back-line"))), this._updatePreferredOptions();
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
  _setupNewRowDeletes() {
    this._addRow && this._addRow.querySelectorAll(kr).forEach((t) => {
      t.dataset.relationNewBound !== "true" && (t.dataset.relationNewBound = "true", t.addEventListener("click", () => {
        const e = t.closest(Qt);
        e && e.remove(), this._pendingItem = null, this._clearAddPanel(), this._addPanel && this._addPanel.classList.add("hidden"), this._updateEmptyTextVisibility(), this._updatePreferredOptions();
      }));
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
      e.push({ select: n, row: n.closest(Qt), isAddPanel: !1 });
    }), this._addRow && this._addRow.querySelectorAll(`select[name='${this._prefix}_new_type']`).forEach((n) => {
      e.push({ select: n, row: n.closest(Qt), isAddPanel: !1 });
    }), this._typeSelect && e.push({ select: this._typeSelect, row: this._typeSelect.closest(Qt), isAddPanel: !0 });
    const i = e.some(({ select: n, row: r, isAddPanel: a }) => {
      if (a)
        return !1;
      const o = ((n == null ? void 0 : n.value) || "").trim();
      if (!n || o !== t)
        return !1;
      if (!r)
        return !0;
      const l = r.querySelector(`input[name^="${this._prefix}_delete["]`);
      return !(l && l.checked);
    });
    e.forEach(({ select: n, row: r, isAddPanel: a }) => {
      if (!n)
        return;
      const o = Array.from(n.options).find((h) => h.value.trim() === t);
      if (!o)
        return;
      const l = r ? r.querySelector(`input[name^="${this._prefix}_delete["]`) : null, c = !!(l && l.checked), u = (n.value || "").trim(), m = !i || u === t && !c;
      if (a && i && u === t) {
        const h = Array.from(n.options).find((f) => f.value.trim() !== t);
        h && (n.value = h.value);
      }
      const p = !m || a && i;
      o.hidden = p, o.disabled = p, o.style.display = p ? "none" : "";
    });
  }
}
class Ac extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      const t = this.querySelector("form");
      t && typeof window.FormLoad == "function" && window.FormLoad(t), this._setupDelete(), this._setupStatusSelect();
    }, 0);
  }
  _setupStatusSelect() {
    const t = Array.from(this.querySelectorAll(".status-select"));
    t.length !== 0 && t.forEach((e) => {
      var n;
      const i = (n = e.parentElement) == null ? void 0 : n.querySelector(".status-icon");
      e.addEventListener("change", (r) => {
        const a = r.target.value;
        e.setAttribute("data-status", a), i && this._updateStatusIcon(i, a);
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
      case "Unknown":
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
    const i = this.querySelector("[data-role='edit-delete-dialog']"), n = this.querySelector("[data-role='edit-delete']"), r = this.querySelector("[data-role='edit-delete-confirm']"), a = this.querySelector("[data-role='edit-delete-cancel']");
    if (!i || !n || !r || !a)
      return;
    n.addEventListener("click", (l) => {
      l.preventDefault(), typeof i.showModal == "function" && i.showModal();
    });
    const o = (l) => {
      l && l.preventDefault(), i.open && i.close();
    };
    a.addEventListener("click", o), i.addEventListener("cancel", o), r.addEventListener("click", async (l) => {
      l.preventDefault(), o();
      const c = new FormData(t), u = {
        csrf_token: c.get("csrf_token") || "",
        last_edited: c.get("last_edited") || ""
      }, m = await fetch(e, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(u)
      });
      if (!m.ok)
        return;
      const p = await m.json().catch(() => null), h = (p == null ? void 0 : p.redirect) || "/";
      window.location.assign(h);
    });
  }
}
class xc extends HTMLElement {
  constructor() {
    super(), this.state = null, this.handleClick = this.handleClick.bind(this), this.handleClickAway = this.handleClickAway.bind(this);
  }
  connectedCallback() {
    var oe, M;
    const t = this.getAttribute("data-user-name") || "Benutzer", e = this.getAttribute("data-user-email") || "", i = this.getAttribute("data-user-id") || "", n = this.getAttribute("data-is-admin-or-editor") === "true", r = this.getAttribute("data-is-admin") === "true", a = this.getAttribute("data-redirect-path") || "", o = window.location.pathname;
    let l = !1, c = "", u = !1, m = "", p = !1, h = !1, f = !1, A = "", I = !1, $ = "", R = "", U = !1, _ = "";
    const S = o.match(/^\/reihe\/([^\/]+)\/?$/);
    if (S && S[1] !== "new") {
      l = !0, c = S[1];
      const q = document.querySelector('meta[name="entity-updated"]');
      q && q.content;
    }
    const x = o.match(/^\/person\/([^\/]+)\/?$/);
    x && x[1] !== "new" && (u = !0, m = x[1]);
    const z = o.match(/^\/almanach\/([^\/]+)\/?$/);
    if (z && z[1] !== "new") {
      f = !0, A = z[1];
      const q = document.querySelector('meta[name="entity-updated"]');
      q && q.content;
    }
    const ct = o.match(/^\/beitrag\/([^\/]+)\/?$/);
    if (ct) {
      I = !0, $ = ct[1];
      const q = document.querySelector('#breadcrumbs a[href^="/almanach/"]');
      if (q) {
        const D = (oe = q.getAttribute("href")) == null ? void 0 : oe.match(/^\/almanach\/([^\/#]+)/);
        D && (R = D[1]);
      }
    }
    const wt = /* @__PURE__ */ new Set([
      "kontakt",
      "danksagungen",
      "literatur",
      "einleitung",
      "benutzerhinweise",
      "lesekabinett",
      "reihen",
      "index"
    ]), mt = o.replace(/\/+$/, "") || "/", bi = (q) => !q || !wt.has(q) ? !1 : q === "index" ? mt === "/" || mt === "/index" : mt === `/${q}` || mt === `/redaktion/${q}`, V = document.querySelector('meta[name="page-key"]'), Tt = (M = V == null ? void 0 : V.content) == null ? void 0 : M.trim();
    if (Tt && bi(Tt))
      U = !0, _ = Tt;
    else {
      const q = mt.match(/^\/redaktion\/([^\/]+)$/), D = q ? q[1] : "";
      D && wt.has(D) ? (U = !0, _ = D) : (mt === "/" || mt === "/index") && (U = !0, _ = "index");
    }
    (o === "/reihen" || o === "/reihen/") && (p = !0), (o === "/personen" || o === "/personen/") && (h = !0);
    const jt = document.querySelector('input[name="csrf_token"]');
    jt && jt.value, this.hasContext = l || u || f || I || U || p || h;
    let tt = "";
    n && l ? tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihe
				</div>
				<a href="/reihe/${c}/edit" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			` : n && u ? tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Person
				</div>
				<a href="/person/${m}/edit/" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
			` : n && f ? tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Almanach
				</div>
				<a href="/almanach/${A}/edit" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				<a href="/almanach/${A}/contents/edit" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-file-list-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Beiträge bearbeiten</span>
				</a>
				<a href="/almanach/${A}/contents/new" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Beitrag</span>
				</a>
			` : n && I && R ? tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Beitrag
				</div>
				<a href="/almanach/${R}/contents/${$}/edit" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bearbeiten</span>
				</a>
				<a href="/almanach/${R}/contents/edit" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-file-list-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Beiträge bearbeiten</span>
				</a>
				<a href="/almanach/${R}/contents/new" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Beitrag</span>
				</a>
			` : n && p ? tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Reihen
				</div>
				<a href="/reihen/new/" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Reihe</span>
				</a>
			` : n && h ? tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Personen
				</div>
				<a href="/personen/new/" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-add-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Person</span>
				</a>
			` : n && U && (tt = `
				<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
					Seite
				</div>
				<a href="/redaktion/seiten/?key=${_}" hx-boost="false" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-edit-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Seite bearbeiten</span>
				</a>
			`);
    const _i = n ? `
			<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Erstellen
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/almanach-new/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-book-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Band</span>
				</a>
				<a href="/almanach-new/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/reihen/new/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Reihe</span>
				</a>
				<a href="/reihen/new/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/orte/new/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neuer Ort</span>
				</a>
				<a href="/orte/new/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/personen/new/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Neue Person</span>
				</a>
				<a href="/personen/new/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", vi = n ? `
			<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Listen
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/reihen/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-stack-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Reihen</span>
				</a>
				<a href="/reihen/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/baende/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-book-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Bände</span>
				</a>
				<a href="/baende/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/orte/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-map-pin-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Orte</span>
				</a>
				<a href="/orte/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/personen/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Personen</span>
				</a>
				<a href="/personen/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/abkuerzungen/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-text text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Abkürzungen</span>
				</a>
				<a href="/abkuerzungen/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/redaktion/seiten/" hx-boost="false" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-pages-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Seiten</span>
				</a>
				<a href="/redaktion/seiten/" target="_blank" hx-boost="false" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", yi = r ? `
			<div class="px-2.5 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
				Administration
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/redaktion/exports/" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-tools-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Daten &amp; Suche</span>
				</a>
				<a href="/redaktion/exports/" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/user/management/access/User?redirectTo=${a}" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-3-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Nutzer einladen</span>
				</a>
				<a href="/user/management/access/User?redirectTo=${a}" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="grid grid-cols-[1fr_auto] group">
				<a href="/user/management?redirectTo=${a}" class="flex items-center px-3 py-1.5 group-hover:bg-gray-100 transition-colors no-underline text-sm">
					<i class="ri-group-2-line text-base text-gray-700 mr-2.5"></i>
					<span class="text-gray-900">Benutzerverwaltung</span>
				</a>
				<a href="/user/management?redirectTo=${a}" target="_blank" class="flex items-center justify-center px-2.5 py-1.5 group-hover:bg-gray-100 text-gray-700 hover:text-slate-900 transition-colors no-underline text-sm" title="In neuem Tab öffnen">
					<i class="ri-external-link-line text-base"></i>
				</a>
			</div>
			<div class="border-t border-gray-200 my-1"></div>
		` : "", Me = tt || "", Ai = tt ? '<div class="border-t border-gray-200"></div>' : "";
    this.innerHTML = `
			<div class="fixed bottom-12 left-8 z-50">
				<!-- Unified Menu Container -->
				<div class="fab-menu hidden absolute bottom-16 left-0 w-64 max-h-[85vh] overflow-y-auto bg-white rounded border border-gray-300 shadow transition-all duration-100 ease-out">
					<!-- Contextual actions (always at top when present) -->
					${Me}
					${Ai}

					<!-- Rest of menu (hidden in half state, shown in full state) -->
					<div class="fab-full-content overflow-hidden transition-all duration-300 ease-in-out" style="max-height: 0; opacity: 0;">
						${_i}
						${vi}
						${yi}
						<div class="px-3 py-1.5">
							<div class="font-semibold text-gray-900 text-sm">${t}</div>
							<div class="text-xs text-gray-600 truncate">${e}</div>
						</div>
						<a href="/user/${i}/edit?redirectTo=${encodeURIComponent(window.location.href)}" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
							<i class="ri-user-3-line text-base text-gray-700 mr-2.5"></i>
							<span class="text-gray-900">Profil bearbeiten</span>
						</a>
						<a href="/logout?redirectTo=${a}" class="flex items-center px-3 py-1.5 hover:bg-gray-100 transition-colors no-underline text-sm">
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
    this.contains(t.target) || (this.hasContext ? this.setState("half") : this.setState("closed"));
  }
  nextState() {
    if (this.hasContext) {
      this.setState(this.state === "half" ? "full" : "half");
      return;
    }
    this.state === "closed" ? this.setState("full") : this.setState("closed");
  }
  setState(t) {
    if (this.hasContext && t === "closed" && (t = "half"), this.state = t, t === "closed")
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
const Ec = 100;
class Sc extends HTMLElement {
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
      }, Ec);
    };
  }
  async _checkDuplicates(t) {
    const e = t.value.trim(), i = t.getAttribute("data-duplicate-endpoint"), n = t.getAttribute("data-duplicate-result-key"), r = t.getAttribute("data-duplicate-current-id") || "", a = document.querySelector(`[data-duplicate-warning-for="${t.id}"]`);
    if (!(!a || !i || !n)) {
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
        const u = (await l.json())[n] || [];
        let m = u;
        r && (m = u.filter((h) => h.id !== r));
        const p = m.filter((h) => h.name && h.name.toLowerCase() === e.toLowerCase());
        if (p.length > 0) {
          const h = a.querySelector("[data-duplicate-count]");
          if (h) {
            const f = p.length === 1 ? "" : "e";
            h.textContent = `Der Name ist bereits vorhanden (${p.length} Treffer${f})`;
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
const Ir = "content-images-list", Rr = "content-images-dialog", Dr = "content-images-close", Or = "content-images-full", Br = "content-images-delete-dialog", Mr = "content-images-delete-confirm", Nr = "content-images-delete-cancel", Pr = "content-images-delete-name", Lc = "300x0", Cc = "0x1000", Va = (s, t) => {
  if (!s)
    return "";
  if (s.includes("thumb="))
    return s;
  const e = s.includes("?") ? "&" : "?";
  return `${s}${e}thumb=${t}`;
}, wc = (s) => Va(s, Cc), Fr = (s) => {
  if (!s)
    return "";
  const e = (s.split("?")[0] || "").split("/");
  return e[e.length - 1] || "";
}, Tc = (s, t) => {
  const e = Array.isArray(t) ? t : [];
  return (Array.isArray(s) ? s : []).map((i, n) => {
    if (typeof i == "string") {
      const r = e[n] || Fr(i);
      return { url: i, name: r };
    }
    if (i && typeof i == "object") {
      const r = i.url || "", a = i.name || e[n] || Fr(r);
      return { url: r, name: a };
    }
    return { url: "", name: "" };
  });
};
class kc extends HTMLElement {
  connectedCallback() {
    if (this.dataset.init === "true")
      return;
    this.dataset.init = "true", this._pendingFiles = [], this._pendingUrls = [], this._pendingDeletes = /* @__PURE__ */ new Set(), this._pendingIds = [], this._pendingIdCounter = 0, this._scanOrder = [], this._wireUpload();
    const t = this.getAttribute("data-images") || "[]", e = this.getAttribute("data-files") || "[]";
    let i = [], n = [];
    try {
      i = JSON.parse(t);
    } catch {
      i = [];
    }
    try {
      n = JSON.parse(e);
    } catch {
      n = [];
    }
    const r = Tc(i, n);
    this._render(r);
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
    e.forEach((n) => {
      this._pendingFiles.push(n), this._pendingUrls.push(URL.createObjectURL(n));
      const r = `p${Date.now()}_${this._pendingIdCounter++}`;
      this._pendingIds.push(r), i.push(r);
    }), Array.isArray(this._scanOrder) || (this._scanOrder = []), this._scanOrder = this._scanOrder.concat(i.map((n) => `pending:${n}`)), this._render(this._currentImages || []);
  }
  _render(t) {
    this._currentImages = t, this.classList.add("block"), this.style.display = "block", this.style.width = "100%";
    const e = this._ensureList(), i = this._ensureUploadProxy();
    i && i.parentElement === e && i.remove(), e.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((h) => {
      h.remove();
    });
    const n = this.getAttribute("data-delete-endpoint") || "", r = this.getAttribute("data-content-id") || "", a = this.getAttribute("data-csrf-token") || "", o = n && r && a, l = /* @__PURE__ */ new Map();
    t.forEach((h) => {
      h && h.name && l.set(h.name, h);
    }), (!Array.isArray(this._scanOrder) || this._scanOrder.length === 0) && (this._scanOrder = t.map((h) => `existing:${h.name}`), this._scanOrder = this._scanOrder.concat(this._pendingIds.map((h) => `pending:${h}`)));
    const c = /* @__PURE__ */ new Map();
    this._pendingIds.forEach((h, f) => {
      c.set(h, { url: this._pendingUrls[f] });
    });
    const u = [];
    this._scanOrder.forEach((h) => {
      if (h.startsWith("existing:")) {
        const f = h.slice(9);
        l.has(f) && u.push({ type: "existing", name: f, image: l.get(f) });
        return;
      }
      if (h.startsWith("pending:")) {
        const f = h.slice(8);
        c.has(f) && u.push({ type: "pending", id: f, url: c.get(f).url });
      }
    }), u.forEach((h, f) => {
      if (h.type === "pending") {
        const _ = document.createElement("div");
        _.className = "group relative", _.dataset.role = "content-images-pending", _.dataset.scanKey = `pending:${h.id}`, _.draggable = !0;
        const S = document.createElement("button");
        S.type = "button", S.className = [
          "rounded",
          "border",
          "border-dashed",
          "border-slate-300",
          "bg-stone-50",
          "p-1",
          "shadow-sm"
        ].join(" "), S.dataset.imageUrl = h.url, S.dataset.imageIndex = `pending-${f}`;
        const x = document.createElement("img");
        x.src = h.url, x.alt = "Digitalisat (neu)", x.loading = "lazy", x.className = "h-28 w-28 object-cover opacity-70", S.appendChild(x);
        const z = document.createElement("span");
        z.className = "absolute left-1 top-1 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900", z.textContent = "Neu", _.appendChild(S), _.appendChild(z);
        const ct = document.createElement("button");
        ct.type = "button", ct.className = "absolute right-1 top-1 hidden rounded-full border border-red-200 bg-white/90 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm transition group-hover:flex hover:text-red-900 hover:border-red-300", ct.innerHTML = '<i class="ri-close-line mr-1"></i>Entfernen', ct.addEventListener("click", (wt) => {
          wt.preventDefault(), wt.stopPropagation(), this._removePendingFileById(h.id);
        }), _.appendChild(ct), e.appendChild(_);
        return;
      }
      const A = h.image, I = document.createElement("div");
      I.className = "group relative", I.dataset.role = "content-images-item", I.dataset.scanKey = `existing:${h.name}`, I.draggable = !0;
      const $ = this._pendingDeletes.has(A.name);
      $ && I.classList.add("content-image-pending");
      const R = document.createElement("button");
      R.type = "button", R.className = [
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
      ].join(" "), R.dataset.imageUrl = A.url, R.dataset.imageIndex = String(f), $ && (R.setAttribute("aria-disabled", "true"), R.classList.add("content-image-pending-button"));
      const U = document.createElement("img");
      if (U.src = Va(A.url, Lc), U.alt = "Digitalisat", U.loading = "lazy", U.className = "h-28 w-28 object-cover", R.appendChild(U), I.appendChild(R), o && A.name) {
        const _ = document.createElement("button");
        _.type = "button", _.className = [
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
        ].join(" "), $ ? (_.classList.remove("border-red-200", "text-red-700"), _.classList.add("border-amber-300", "bg-amber-100", "text-amber-900", "hover:border-amber-400", "hover:text-amber-950"), _.innerHTML = '<i class="ri-arrow-go-back-line mr-1"></i>Rueckgaengig') : _.innerHTML = '<i class="ri-delete-bin-line mr-1"></i>Entfernen', _.addEventListener("click", (S) => {
          S.preventDefault(), S.stopPropagation(), this._togglePendingDelete(A.name);
        }), I.appendChild(_);
      }
      e.appendChild(I);
    }), i && i.parentElement !== e && e.appendChild(i);
    const m = this._ensureDialog(), p = m.querySelector(`[data-role='${Or}']`);
    e.addEventListener("click", (h) => {
      const f = h.target.closest("button[data-image-url]");
      if (!f || !p)
        return;
      const A = f.dataset.imageUrl || "", I = A.startsWith("blob:") ? A : wc(A);
      p.src = I, p.alt = "Digitalisat", m.showModal ? m.showModal() : m.setAttribute("open", "true");
    }), this._wireDrag(e);
  }
  _ensureList() {
    let t = this.querySelector(`[data-role='${Ir}']`);
    return t || (t = document.createElement("div"), t.dataset.role = Ir, this.appendChild(t)), t.className = "grid gap-2", t.style.gridTemplateColumns = "repeat(auto-fill, minmax(7rem, 1fr))", t.style.width = "100%", t;
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
    i && URL.revokeObjectURL(i), this._pendingFiles.splice(e, 1), this._pendingUrls.splice(e, 1), this._pendingIds.splice(e, 1), this._scanOrder = this._scanOrder.filter((n) => n !== `pending:${t}`), this._render(this._currentImages || []);
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
      const n = i.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
      if (!n) {
        i.preventDefault();
        return;
      }
      e = n.dataset.scanKey || null, n.classList.add("opacity-60"), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", "move");
    }), t.addEventListener("dragover", (i) => {
      if (!e)
        return;
      i.preventDefault();
      const n = i.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
      if (!n || n.dataset.scanKey === e)
        return;
      const r = n.getBoundingClientRect(), a = i.clientY - r.top < r.height / 2, o = t.querySelector(`[data-scan-key="${CSS.escape(e)}"]`);
      o && (a ? n.before(o) : n.after(o));
    }), t.addEventListener("dragend", () => {
      const i = e ? t.querySelector(`[data-scan-key="${CSS.escape(e)}"]`) : null;
      i && i.classList.remove("opacity-60"), e = null;
      const n = [];
      t.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((r) => {
        r.dataset.scanKey && n.push(r.dataset.scanKey);
      }), this._scanOrder = n;
    });
  }
  _ensureDialog() {
    let t = this.querySelector(`[data-role='${Rr}']`);
    if (t)
      return t;
    t = document.createElement("dialog"), t.dataset.role = Rr, t.className = [
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
					data-role="${Dr}">
					Schliessen
				</button>
			</div>
			<div class="p-4">
				<img data-role="${Or}" class="max-h-[75vh] w-full object-contain" alt="Digitalisat" />
			</div>
		`;
    const e = t.querySelector(`[data-role='${Dr}']`);
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
    const i = e.querySelector(`[data-role='${Pr}']`);
    i && (i.textContent = t.fileName), e.showModal ? e.showModal() : e.setAttribute("open", "true");
  }
  _ensureDeleteDialog() {
    let t = this.querySelector(`[data-role='${Br}']`);
    if (t)
      return t;
    t = document.createElement("dialog"), t.dataset.role = Br, t.className = [
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
				<div class="text-sm font-bold text-gray-900 mt-1" data-role="${Pr}"></div>
				<p class="text-sm text-gray-700 mt-2">
					Das Digitalisat wird dauerhaft entfernt.
				</p>
				<div class="flex items-center justify-end gap-3 mt-4">
					<button type="button" class="resetbutton w-auto px-3 py-1 text-sm" data-role="${Nr}">Abbrechen</button>
					<button type="button" class="submitbutton w-auto bg-red-700 hover:bg-red-800 px-3 py-1 text-sm" data-role="${Mr}">
						Loeschen
					</button>
				</div>
			</div>
		`;
    const e = t.querySelector(`[data-role='${Nr}']`), i = t.querySelector(`[data-role='${Mr}']`), n = () => {
      t.open && t.close();
    };
    return e && e.addEventListener("click", n), t.addEventListener("cancel", (r) => {
      r.preventDefault(), n();
    }), i && i.addEventListener("click", () => {
      this._performDelete(t);
    }), this.appendChild(t), t;
  }
  _performDelete(t) {
    var l;
    const e = t.dataset.endpoint || "", i = t.dataset.csrfToken || "", n = t.dataset.contentId || "", r = t.dataset.fileName || "";
    if (!e || !i || !n || !r) {
      t.close();
      return;
    }
    const a = this.closest("[data-role='content-images-panel']");
    if ((l = window.htmx) != null && l.ajax && a) {
      window.htmx.ajax("POST", e, {
        target: a,
        swap: "outerHTML",
        values: {
          csrf_token: i,
          content_id: n,
          scan: r
        }
      }), t.close();
      return;
    }
    const o = new URLSearchParams();
    o.set("csrf_token", i), o.set("content_id", n), o.set("scan", r), fetch(e, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "HX-Request": "true"
      },
      body: o.toString()
    }).then((c) => !c.ok || !a ? null : c.text()).then((c) => {
      !c || !a || this._applyServerResponse(c, a);
    }).catch(() => null).finally(() => {
      t.close();
    });
  }
  _applyServerResponse(t, e) {
    const i = document.createElement("template");
    i.innerHTML = t.trim(), Array.from(i.content.querySelectorAll("[hx-swap-oob]")).forEach((a) => {
      const o = a.getAttribute("hx-swap-oob") || "", [l, c] = o.split(":"), u = l || "outerHTML", m = c ? document.querySelector(c) : a.id ? document.getElementById(a.id) : null;
      m && (u === "innerHTML" ? m.innerHTML = a.innerHTML : m.outerHTML = a.outerHTML), a.remove();
    });
    const r = i.content.firstElementChild;
    r && e.replaceWith(r);
  }
}
const Ic = "lookup-field", yn = "lf-input", qr = "lf-list", Rc = "lf-option", Hr = "lf-hidden-input", $r = "lf-clear-button", Ur = "lf-link-button", Vr = "lf-warn-icon", jr = "lf-dup-warning", Wr = 1, zr = 10, Kr = 250;
class Dc extends HTMLElement {
  constructor() {
    super(), this._endpoint = "", this._resultKey = "items", this._minChars = Wr, this._limit = zr, this._autocomplete = !0, this._placeholder = "", this._required = !1, this._multiline = !1, this._valueName = "", this._textName = "", this._valueFn = null, this._linkFn = null, this._validFn = null, this._dupEndpoint = "", this._dupResultKey = "", this._dupCurrentId = "", this._dupExact = !0, this._options = [], this._selected = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._dupTimeout = null, this._listVisible = !1, this._input = null, this._hiddenInput = null, this._list = null, this._clearButton = null, this._linkButton = null, this._warnIcon = null, this._dupWarning = null, this._boundHandleInput = this._handleInput.bind(this), this._boundHandleFocus = this._handleFocus.bind(this), this._boundHandleKeyDown = this._handleKeyDown.bind(this), this._boundHandleClear = this._handleClear.bind(this), this._boundHandleClickOutside = this._handleClickOutside.bind(this);
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
    var t;
    this._render(), this._bindElements(), this._syncFromAttributes(), this._applyInitialValue(), this._updateValidity(), this._maybeCheckDuplicates(((t = this._input) == null ? void 0 : t.value) || "");
  }
  disconnectedCallback() {
    document.removeEventListener("click", this._boundHandleClickOutside), this._input && (this._input.removeEventListener("input", this._boundHandleInput), this._input.removeEventListener("focus", this._boundHandleFocus), this._input.removeEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.removeEventListener("click", this._boundHandleClear);
  }
  attributeChangedCallback(t, e, i) {
    e !== i && this._input && (this._syncFromAttributes(), t === "value" && this._applyInitialValue());
  }
  _render() {
    const t = this.getAttribute("data-multiline") === "true", e = this.hasAttribute("data-text-name"), i = e && this.getAttribute("data-text-name") || "", n = this.getAttribute("data-value-name") || "", r = this.getAttribute("placeholder") || "", a = this.getAttribute("id") ? `${this.getAttribute("id")}-input` : "", o = this.getAttribute("value") || "", c = this.getAttribute("data-no-enter") === "true" ? " no-enter" : "", u = this.getAttribute("name") || "", m = e ? i : u, p = m ? ` name="${m}"` : "", h = t ? `<textarea id="${a}" class="${yn} inputinput w-full${c}" rows="1" placeholder="${r}"${p}>${o}</textarea>` : `<input id="${a}" type="text" class="${yn} inputinput w-full${c}" placeholder="${r}" value="${o}"${p} />`, f = n ? `<input type="hidden" class="${Hr}" name="${n}" value="" />` : "";
    this.innerHTML = `
			<div class="${Ic} relative">
				<div class="flex items-center gap-2">
					${h.replace(/(class="[^"]*)"/, `$1" ${p}`)}
					<a class="${Ur} hidden text-sm text-gray-600 hover:text-gray-900 no-underline" aria-label="Auswahl öffnen" target="_blank" rel="noopener">
						<i class="ri-external-link-line"></i>
					</a>
					<span class="${Vr} hidden text-red-700 text-lg" aria-hidden="true">
						<i class="ri-error-warning-line"></i>
					</span>
					<button type="button" class="${$r} text-sm text-gray-600 hover:text-gray-900" aria-label="Eingabe löschen">
						<i class="ri-close-line"></i>
					</button>
				</div>
				${f}
				<div class="${qr} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
				<div class="${jr} hidden text-sm text-blue-700 mt-1 flex items-center gap-2">
					<i class="ri-information-line"></i>
					<span data-role="dup-text"></span>
				</div>
			</div>
		`;
  }
  _bindElements() {
    this._input = this.querySelector(`.${yn}`), this._hiddenInput = this.querySelector(`.${Hr}`), this._list = this.querySelector(`.${qr}`), this._clearButton = this.querySelector(`.${$r}`), this._linkButton = this.querySelector(`.${Ur}`), this._warnIcon = this.querySelector(`.${Vr}`), this._dupWarning = this.querySelector(`.${jr}`), this._input && (this._input.addEventListener("input", this._boundHandleInput), this._input.addEventListener("focus", this._boundHandleFocus), this._input.addEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.addEventListener("click", this._boundHandleClear), document.addEventListener("click", this._boundHandleClickOutside);
  }
  _syncFromAttributes() {
    this._endpoint = this.getAttribute("data-endpoint") || "", this._resultKey = this.getAttribute("data-result-key") || "items", this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), Wr), this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), zr), this._autocomplete = this.getAttribute("data-autocomplete") !== "false", this._placeholder = this.getAttribute("placeholder") || "", this._required = this.getAttribute("data-required") === "true", this._multiline = this.getAttribute("data-multiline") === "true", this._valueName = this.getAttribute("data-value-name") || "", this._textName = this.hasAttribute("data-text-name") && this.getAttribute("data-text-name") || "", this._valueFn = this._getFn(this.getAttribute("data-value-fn")), this._linkFn = this._getFn(this.getAttribute("data-link-fn")), this._validFn = this._getFn(this.getAttribute("data-valid-fn")), this._dupEndpoint = this.getAttribute("data-dup-endpoint") || "", this._dupResultKey = this.getAttribute("data-dup-result-key") || "", this._dupCurrentId = this.getAttribute("data-dup-current-id") || "", this._dupExact = this.getAttribute("data-dup-exact") !== "false";
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
    }, Kr);
  }
  async _fetchOptions(t) {
    var i;
    if (!this._endpoint)
      return;
    this._fetchController && this._fetchController.abort(), this._fetchController = new AbortController();
    const e = new URL(this._endpoint, window.location.origin);
    e.searchParams.set("q", t), this._limit > 0 && e.searchParams.set("limit", String(this._limit));
    try {
      const n = await fetch(e.toString(), { signal: this._fetchController.signal });
      if (!n.ok)
        return;
      const r = await n.json(), a = Array.isArray(r == null ? void 0 : r[this._resultKey]) ? r[this._resultKey] : [];
      this._options = a.filter((o) => o && o.id && o.name).map((o) => {
        if ("musenalm_id" in o && o.musenalm_id)
          return o;
        const l = o.MusenalmID || o.musenalmId || o.musenalmID || "";
        return l ? { ...o, musenalm_id: l } : o;
      }), this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._maybeAutoSelectExactMatch(t), this._renderOptions(), this._options.length > 0 ? this._options.length === 1 && this._isExactMatch(t, ((i = this._options[0]) == null ? void 0 : i.name) || "") ? this._hideList() : this._showList() : this._hideList();
    } catch (n) {
      if ((n == null ? void 0 : n.name) === "AbortError")
        return;
    }
  }
  _renderOptions() {
    this._list && (this._list.innerHTML = "", this._options.forEach((t, e) => {
      const i = document.createElement("button");
      i.type = "button", i.setAttribute("data-index", String(e)), i.className = `${Rc} w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors`;
      const n = e === this._highlightedIndex;
      i.classList.toggle("bg-slate-100", n), i.setAttribute("aria-selected", n ? "true" : "false");
      const r = document.createElement("div");
      if (r.className = "text-sm font-semibold text-gray-800", r.textContent = t.name, i.appendChild(r), t.detail) {
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
    const i = (t || "").trim().toLowerCase(), n = (e || "").trim().toLowerCase();
    return i !== "" && i === n;
  }
  _maybeAutoSelectExactMatch(t) {
    var n;
    const e = this._options.find((r) => this._isExactMatch(t, (r == null ? void 0 : r.name) || ""));
    if (!e)
      return;
    const i = ((n = this._selected) == null ? void 0 : n.id) || "";
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
    var e, i;
    if (!this._hiddenInput)
      return;
    let t = "";
    this._valueFn && this._selected ? t = String(this._valueFn({ item: this._selected, displayValue: ((e = this._input) == null ? void 0 : e.value) || "" }) || "") : (i = this._selected) != null && i.id && (t = this._selected.id), this._hiddenInput.value = t;
  }
  _updateValidity() {
    var r, a;
    const t = (((r = this._input) == null ? void 0 : r.value) || "").trim(), e = (((a = this._hiddenInput) == null ? void 0 : a.value) || "").trim();
    let i = !0;
    this._validFn ? i = !!this._validFn({ value: e || t, displayValue: t, hiddenValue: e, item: this._selected }) : this._required && (i = (e || t).length > 0);
    const n = this._linkFn ? this._linkFn({ item: this._selected, value: e || t }) : "";
    this._warnIcon && this._linkButton && (i ? n ? (this._warnIcon.classList.add("hidden"), this._linkButton.classList.remove("hidden"), this._linkButton.setAttribute("href", n)) : (this._warnIcon.classList.add("hidden"), this._linkButton.classList.add("hidden")) : (this._warnIcon.classList.remove("hidden"), this._linkButton.classList.add("hidden"))), this._clearButton && this._clearButton.classList.toggle("hidden", t.length === 0);
  }
  _maybeCheckDuplicates(t) {
    !this._dupEndpoint || !this._dupResultKey || !this._dupWarning || (this._dupTimeout && clearTimeout(this._dupTimeout), this._dupTimeout = setTimeout(() => {
      this._checkDuplicates(t);
    }, Kr));
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
      const n = await fetch(i.toString());
      if (!n.ok)
        return;
      const a = (await n.json())[this._dupResultKey] || [];
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
class Oc extends HTMLElement {
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
    const n = new URLSearchParams();
    n.set("csrf_token", this.getCsrfToken()), n.set("export_type", e || "data");
    try {
      const r = await fetch(this.runUrl, {
        method: "POST",
        body: n,
        credentials: "same-origin"
      });
      if (!r.ok) {
        const o = await this.extractError(r);
        this.setStatus(o || "Export konnte nicht gestartet werden.", !0);
        return;
      }
      const a = await this.safeJson(r);
      if (a && a.error) {
        this.setStatus(a.error, !0);
        return;
      }
      this.setStatus("Export läuft im Hintergrund."), await this.refreshList(), this.startPolling();
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
    const n = t.target.closest("[data-action]");
    if (!n) return;
    if (n.getAttribute("data-action") === "delete") {
      const a = n.getAttribute("data-id");
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
        const r = await this.extractError(i);
        this.setStatus(r || "Export konnte nicht gelöscht werden.", !0);
        return;
      }
      const n = await this.safeJson(i);
      if (n && n.error) {
        this.setStatus(n.error, !0);
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
    const e = this.fts5StatusValue, i = this.normalizeText(t.status) || "idle", n = this.normalizeText(t.message || ""), r = this.normalizeText(t.error || ""), a = Number.isFinite(t.done) ? t.done : 0, o = Number.isFinite(t.total) ? t.total : 0, l = this.formatGermanDateTime(this.normalizeText(t.last_rebuild || ""));
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
    ), (i === "running" || i === "restarting") && (this.fts5HadRunning = !0), i === "complete" && !this.fts5HadRunning ? (this.fts5Status.textContent = "", this.fts5Status.classList.add("hidden")) : i === "error" ? (this.fts5Status.textContent = r || "FTS5-Neuaufbau fehlgeschlagen.", this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200")) : i === "aborted" ? (this.fts5Status.textContent = n || "FTS5-Neuaufbau abgebrochen.", this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200")) : i === "complete" ? (this.fts5Status.textContent = n || "FTS5-Neuaufbau abgeschlossen.", this.fts5Status.classList.add("text-green-800", "bg-green-50", "border-green-200")) : i === "restarting" ? (this.fts5Status.textContent = n || "FTS5-Neuaufbau wird neu gestartet.", this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200")) : i === "running" ? (this.fts5Status.textContent = n || "FTS5-Neuaufbau läuft.", this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200")) : (this.fts5Status.textContent = n || "", this.fts5Status.textContent ? this.fts5Status.classList.add("text-slate-700", "bg-slate-50", "border-slate-200") : this.fts5Status.classList.add("hidden")), this.fts5Status.textContent && this.fts5Status.classList.remove("hidden"), this.fts5Progress && (i === "running" || i === "restarting" ? this.fts5Progress.classList.remove("hidden") : this.fts5Progress.classList.add("hidden")), this.fts5Button) {
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
    const r = i.replace(" ", "T"), a = new Date(r);
    if (Number.isNaN(a.getTime())) return i;
    const o = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], l = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], c = a.getDate(), u = l[a.getMonth()], m = a.getFullYear(), p = String(a.getHours()).padStart(2, "0"), h = String(a.getMinutes()).padStart(2, "0");
    return `${o[a.getDay()]}, ${c}. ${u} ${m} ${p}:${h}`;
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
      const n = await fetch(this.fts5RebuildUrl, {
        method: "POST",
        body: i,
        credentials: "same-origin"
      });
      if (!n.ok) {
        const a = await this.extractError(n);
        this.fts5Status && (this.fts5Status.textContent = a || "FTS5-Neuaufbau konnte nicht gestartet werden.", this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200"));
        return;
      }
      const r = await this.safeJson(n);
      if (r && r.error) {
        this.fts5Status && (this.fts5Status.textContent = r.error, this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200"));
        return;
      }
      this.fts5HadRunning = !0, r && r.status === "restarting" && this.updateFts5Status({
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
document.addEventListener("trix-file-accept", (s) => {
  s.preventDefault();
});
const Bc = "filter-list", Mc = "fab-menu", Nc = "scroll-button", Pc = "tool-tip", Fc = "abbrev-tooltips", qc = "int-link", Hc = "popup-image", $c = "tab-list", Uc = "filter-pill", Vc = "image-reel", jc = "multi-select-places", Wc = "multi-select-simple", zc = "single-select-remote", ja = "reset-button", Kc = "div-manager", Gc = "items-editor", Jc = "almanach-edit-page", Yc = "relations-editor", Xc = "edit-page", Qc = "duplicate-warning-checker", Zc = "content-images", th = "lookup-field", eh = "export-manager";
window.lookupSeriesValue = ({ item: s }) => (s == null ? void 0 : s.id) || "";
window.lookupSeriesLink = ({ item: s }) => s != null && s.musenalm_id ? `/reihe/${s.musenalm_id}` : "";
window.lookupRequiredText = ({ displayValue: s }) => !!(s || "").trim();
window.lookupRequiredId = ({ hiddenValue: s }) => !!(s || "").trim();
customElements.define(qc, cd);
customElements.define(Fc, Te);
customElements.define(Bc, ad);
customElements.define(Nc, od);
customElements.define(Pc, Mn);
customElements.define(Hc, ld);
customElements.define($c, dd);
customElements.define(Uc, nd);
customElements.define(Vc, hd);
customElements.define(jc, Ha);
customElements.define(Wc, $a);
customElements.define(zc, lc);
customElements.define(ja, Ud);
customElements.define(Kc, zd);
customElements.define(Gc, ec);
customElements.define(Jc, dc);
customElements.define(Yc, yc);
customElements.define(Xc, Ac);
customElements.define(Mc, xc);
customElements.define(Qc, Sc);
customElements.define(Zc, kc);
customElements.define(th, Dc);
customElements.define(eh, Oc);
function ih() {
  const s = window.location.pathname, t = window.location.search, e = s + t;
  return encodeURIComponent(e);
}
function nh(s = 5e3, t = 100) {
  return new Promise((e, i) => {
    let n = 0;
    const r = setInterval(() => {
      typeof window.QRCode == "function" ? (clearInterval(r), e(window.QRCode)) : (n += t, n >= s && (clearInterval(r), console.error("Timed out waiting for QRCode to become available."), i(new Error("QRCode not available after " + s + "ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode."))));
    }, t);
  });
}
async function sh(s) {
  const t = await nh(), e = document.getElementById("qr");
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
function rh(s) {
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
function ah() {
  document.body.addEventListener("htmx:responseError", function(s) {
    const t = s.detail.requestConfig;
    if (t.boosted) {
      document.body.innerHTML = s.detail.xhr.responseText;
      const e = s.detail.xhr.responseURL || t.url;
      window.history.pushState(null, "", e);
    }
  });
}
function Wa(s = document) {
  s.querySelectorAll("[data-role='cancel-link']").forEach((e) => {
    if (e.dataset.cancelBound === "true")
      return;
    e.dataset.cancelBound = "true";
    const i = (e.getAttribute("data-cancel-url") || "").trim();
    if (i) {
      e.setAttribute("href", i);
      return;
    }
    e.addEventListener("click", (n) => {
      (e.getAttribute("data-cancel-url") || "").trim() || (n.preventDefault(), window.history.length > 1 && window.history.back());
    });
  });
}
function oh(s, t) {
  if (!(s instanceof HTMLElement)) {
    console.warn("Target must be an HTMLElement.");
    return;
  }
  if (typeof t != "function") {
    console.warn("Action must be a function.");
    return;
  }
  const e = s.querySelectorAll(ja);
  s.addEventListener("rbichange", (i) => {
    for (const n of e)
      if (n.isCurrentlyModified()) {
        t(i.details, !0);
        return;
      }
    t(i.details, !1);
  });
}
let Zt = null;
function za() {
  return Zt !== null || (typeof CSS < "u" && typeof CSS.supports == "function" ? Zt = CSS.supports("field-sizing", "content") : Zt = !1, console.log("Browser supports field-sizing:", Zt)), Zt;
}
document.addEventListener("DOMContentLoaded", () => {
  Wa(document);
});
document.addEventListener("htmx:afterSwap", (s) => {
  var e;
  const t = ((e = s.detail) == null ? void 0 : e.target) || document;
  Wa(t);
});
function Pt(s) {
  if (console.log("TextareaAutoResize called for:", s.name || s.id), !(s instanceof HTMLTextAreaElement)) {
    console.log("Not a textarea element");
    return;
  }
  if (s.dataset.noAutoresize === "true" || s.classList.contains("no-autoresize"))
    return;
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
function Ka(s) {
  s.key === "Enter" && s.preventDefault();
}
function lh(s) {
  if (!(s instanceof HTMLTextAreaElement)) {
    console.warn("HookupTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  s.dataset.noAutoresize === "true" || s.classList.contains("no-autoresize") || za() || s.addEventListener("input", () => {
    Pt(s);
  });
}
function dh(s) {
  if (!(s instanceof HTMLTextAreaElement)) {
    console.warn("DisconnectTextareaAutoResize: Provided element is not a textarea.");
    return;
  }
  s.removeEventListener("input", () => {
    Pt(s);
  });
}
function ch(s) {
  !(s instanceof HTMLTextAreaElement) && s.classList.contains("no-enter") || s.addEventListener("keydown", Ka);
}
function hh(s) {
  !(s instanceof HTMLTextAreaElement) && s.classList.contains("no-enter") || s.removeEventListener("keydown", Ka);
}
function uh() {
  if (!window.htmx)
    return;
  const s = () => {
    var f;
    let h = document.getElementById("global-notice");
    return h || (h = document.createElement("div"), h.id = "global-notice", h.className = "global-notice hidden", h.setAttribute("role", "status"), h.setAttribute("aria-live", "polite"), h.setAttribute("aria-atomic", "true"), h.dataset.state = "", h.innerHTML = `
				<div class="global-notice-inner">
					<i class="ri-loader-4-line spinning" aria-hidden="true"></i>
					<span data-role="global-notice-text">Lädt</span>
				</div>
			`, (f = document.body) == null || f.appendChild(h)), h;
  };
  let t = s(), e = t ? t.querySelector("[data-role='global-notice-text']") : null, i = 0, n = null, r = null;
  const a = (h, f) => {
    t = s(), t && !e && (e = t.querySelector("[data-role='global-notice-text']")), e && f && (e.textContent = f), t && h ? t.dataset.state = h : t && t.removeAttribute("data-state");
  }, o = (h, f) => {
    t = s(), t && (a(h, f), t.classList.remove("hidden"));
  }, l = () => {
    t = s(), t && (t.classList.add("hidden"), t.removeAttribute("data-state"));
  }, c = (h) => {
    const f = document.documentElement;
    h ? (f && (f.dataset.htmxBusy = "true"), document.body && (document.body.dataset.htmxBusy = "true")) : (f && delete f.dataset.htmxBusy, document.body && delete document.body.dataset.htmxBusy);
  }, u = (h, f) => {
    !h || !(h instanceof HTMLElement) || (f ? (h.dataset.htmxBusy = "true", h.setAttribute("aria-busy", "true"), h instanceof HTMLButtonElement && !h.disabled && (h.dataset.htmxDisabled = "true", h.disabled = !0)) : h.dataset.htmxBusy === "true" && (delete h.dataset.htmxBusy, h.removeAttribute("aria-busy"), h instanceof HTMLButtonElement && h.dataset.htmxDisabled === "true" && (h.disabled = !1, delete h.dataset.htmxDisabled)));
  }, m = () => {
    n && (clearTimeout(n), n = null);
  }, p = () => {
    r && (clearTimeout(r), r = null);
  };
  document.addEventListener("htmx:beforeRequest", (h) => {
    var f;
    i += 1, m(), p(), c(!0), o("loading", "Lädt"), u((f = h.detail) == null ? void 0 : f.elt, !0);
  }), document.addEventListener("htmx:afterRequest", (h) => {
    var f;
    u((f = h.detail) == null ? void 0 : f.elt, !1), i = Math.max(0, i - 1), i === 0 && (c(!1), t.dataset.state !== "error" && (p(), r = setTimeout(() => {
      r = null, i === 0 && t.dataset.state !== "error" && l();
    }, 250)));
  }), document.addEventListener("htmx:responseError", () => {
    c(!1), o("error", "Laden fehlgeschlagen."), m(), p(), n = setTimeout(() => {
      i === 0 ? l() : o("loading", "Lädt");
    }, 2e3);
  }), document.addEventListener("htmx:sendError", () => {
    c(!1), o("error", "Verbindung fehlgeschlagen."), m(), p(), n = setTimeout(() => {
      i === 0 ? l() : o("loading", "Lädt");
    }, 2e3);
  }), document.addEventListener("htmx:afterSwap", () => {
    t = s(), t && !e && (e = t.querySelector("[data-role='global-notice-text']"));
  });
}
function mh(s, t) {
  const e = !za();
  for (const i of s)
    if (i.type === "childList") {
      for (const n of i.addedNodes)
        n.nodeType === Node.ELEMENT_NODE && n.matches("textarea") && e && (lh(n), Pt(n));
      for (const n of i.removedNodes)
        n.nodeType === Node.ELEMENT_NODE && n.matches("textarea") && (hh(n), e && dh(n));
    }
}
function gh(s) {
  if (console.log("=== FormLoad CALLED ==="), !(s instanceof HTMLFormElement)) {
    console.warn("FormLoad: Provided element is not a form.");
    return;
  }
  const t = document.querySelectorAll("textarea");
  console.log("Found", t.length, "textareas");
  for (const a of t)
    a.dataset.noAutoresize === "true" || a.classList.contains("no-autoresize") || (console.log("Attaching input listener to:", a.name || a.id), a.addEventListener("input", function() {
      console.log("Input event on textarea:", this.name || this.id), Pt(this);
    }));
  setTimeout(() => {
    console.log("Running initial textarea resize on", t.length, "textareas");
    for (const a of t)
      a.dataset.noAutoresize === "true" || a.classList.contains("no-autoresize") || Pt(a);
  }, 200);
  const e = document.querySelectorAll("textarea.no-enter");
  for (const a of e)
    ch(a);
  new MutationObserver(mh).observe(s, {
    childList: !0,
    subtree: !0
  }), new MutationObserver((a) => {
    for (const o of a)
      if (o.type === "attributes" && o.attributeName === "class") {
        const l = o.target;
        if (l instanceof HTMLElement) {
          const c = l.matches("textarea") ? [l] : Array.from(l.querySelectorAll("textarea"));
          for (const u of c)
            u.dataset.noAutoresize === "true" || u.classList.contains("no-autoresize") || u.offsetParent !== null && Pt(u);
        }
      }
  }).observe(s, {
    attributes: !0,
    attributeFilter: ["class"],
    subtree: !0
  }), s.querySelectorAll('input[type="checkbox"][data-boolean-checkbox]').forEach((a) => {
    a.value = "true";
    const o = () => {
      const l = s.querySelector(`input[type="hidden"][name="${a.name}"]`);
      if (l && l.remove(), !a.checked) {
        const c = document.createElement("input");
        c.type = "hidden", c.name = a.name, c.value = "false", a.parentNode.insertBefore(c, a);
      }
    };
    o(), a.addEventListener("change", o);
  });
}
function Nn() {
  if (Nn._initialized)
    return;
  Nn._initialized = !0;
  const s = () => {
    const t = document.querySelectorAll(".form-action-bar");
    if (!t.length)
      return;
    const e = window.innerHeight || document.documentElement.clientHeight;
    t.forEach((i) => {
      const r = i.getBoundingClientRect().bottom >= e - 1;
      i.classList.toggle("is-stuck", r);
    });
  };
  s(), window.addEventListener("scroll", s, { passive: !0 }), window.addEventListener("resize", s), document.addEventListener("htmx:afterSwap", s);
}
function Ga() {
  const t = (n) => {
    !n || n.classList.contains("hidden") || n.classList.contains("is-hidden") || (requestAnimationFrame(() => {
      n.classList.add("is-hiding");
    }), setTimeout(() => {
      n.classList.add("is-hidden"), n.classList.remove("is-hiding"), delete n.dataset.autohideScheduled;
    }, 320));
  }, e = (n) => {
    (n || document).querySelectorAll("[data-autohide='true']").forEach((a) => {
      a.dataset.autohideScheduled !== "true" && (a.dataset.autohideScheduled = "true", setTimeout(() => t(a), 2e3));
    });
  };
  e(document), document.addEventListener("htmx:afterSwap", (n) => {
    e(n.target);
  }), new MutationObserver((n) => {
    for (const r of n)
      for (const a of r.addedNodes)
        a.nodeType === Node.ELEMENT_NODE && e(a);
  }).observe(document.body, { childList: !0, subtree: !0 });
}
document.addEventListener("keydown", (s) => {
  if (s.key !== "Enter")
    return;
  const t = s.target;
  t instanceof HTMLElement && t.matches("textarea.no-enter") && s.preventDefault();
});
window.ShowBoostedErrors = ah;
window.GenQRCode = sh;
window.SelectableInput = rh;
window.PathPlusQuery = ih;
window.HookupRBChange = oh;
window.FormLoad = gh;
window.TextareaAutoResize = Pt;
window.InitTimedMessages = Ga;
uh();
Nn();
Ga();
export {
  Te as AbbreviationTooltips,
  dc as AlmanachEditPage,
  Ac as EditPage,
  xc as FabMenu,
  ad as FilterList,
  nd as FilterPill,
  hd as ImageReel,
  cd as IntLink,
  ec as ItemsEditor,
  Dc as LookupField,
  Ha as MultiSelectRole,
  $a as MultiSelectSimple,
  ld as PopupImage,
  yc as RelationsEditor,
  od as ScrollButton,
  lc as SingleSelectRemote,
  dd as TabList,
  Mn as ToolTip
};
