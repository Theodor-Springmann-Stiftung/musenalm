var ml = "2.1.18";
const Be = "[data-trix-attachment]", Bs = { preview: { presentation: "gallery", caption: { name: !0, size: !0 } }, file: { caption: { size: !0 } } }, mt = { default: { tagName: "div", parse: !1 }, quote: { tagName: "blockquote", nestable: !0 }, heading1: { tagName: "h1", terminal: !0, breakOnReturn: !0, group: !1 }, code: { tagName: "pre", terminal: !0, htmlAttributes: ["language"], text: { plaintext: !0 } }, bulletList: { tagName: "ul", parse: !1 }, bullet: { tagName: "li", listAttribute: "bulletList", group: !1, nestable: !0, test(n) {
  return hr(n.parentNode) === mt[this.listAttribute].tagName;
} }, numberList: { tagName: "ol", parse: !1 }, number: { tagName: "li", listAttribute: "numberList", group: !1, nestable: !0, test(n) {
  return hr(n.parentNode) === mt[this.listAttribute].tagName;
} }, attachmentGallery: { tagName: "div", exclusive: !0, terminal: !0, parse: !1, group: !1 } }, hr = (n) => {
  var t;
  return n == null || (t = n.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, mr = navigator.userAgent.match(/android\s([0-9]+.*Chrome)/i), Ln = mr && parseInt(mr[1]);
var Bi = { composesExistingText: /Android.*Chrome/.test(navigator.userAgent), recentAndroid: Ln && Ln > 12, samsungAndroid: Ln && navigator.userAgent.match(/Android.*SM-/), forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent), supportsInputEvents: typeof InputEvent < "u" && ["data", "getTargetRanges", "inputType"].every(((n) => n in InputEvent.prototype)) }, Xo = { ADD_ATTR: ["language"], SAFE_FOR_XML: !1, RETURN_DOM: !0 }, k = { attachFiles: "Attach Files", bold: "Bold", bullets: "Bullets", byte: "Byte", bytes: "Bytes", captionPlaceholder: "Add a caption…", code: "Code", heading1: "Heading", indent: "Increase Level", italic: "Italic", link: "Link", numbers: "Numbers", outdent: "Decrease Level", quote: "Quote", redo: "Redo", remove: "Remove", strike: "Strikethrough", undo: "Undo", unlink: "Unlink", url: "URL", urlPlaceholder: "Enter a URL…", GB: "GB", KB: "KB", MB: "MB", PB: "PB", TB: "TB" };
const pl = [k.bytes, k.KB, k.MB, k.GB, k.TB, k.PB];
var Qo = { prefix: "IEC", precision: 2, formatter(n) {
  switch (n) {
    case 0:
      return "0 ".concat(k.bytes);
    case 1:
      return "1 ".concat(k.byte);
    default:
      let t;
      this.prefix === "SI" ? t = 1e3 : this.prefix === "IEC" && (t = 1024);
      const e = Math.floor(Math.log(n) / Math.log(t)), i = (n / Math.pow(t, e)).toFixed(this.precision).replace(/0*$/, "").replace(/\.$/, "");
      return "".concat(i, " ").concat(pl[e]);
  }
} };
const fn = "\uFEFF", Ae = " ", Zo = function(n) {
  for (const t in n) {
    const e = n[t];
    this[t] = e;
  }
  return this;
}, Ns = document.documentElement, fl = Ns.matches, J = function(n) {
  let { onElement: t, matchingSelector: e, withCallback: i, inPhase: s, preventDefault: r, times: o } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const a = t || Ns, l = e, c = s === "capturing", h = function(g) {
    o != null && --o == 0 && h.destroy();
    const b = Ee(g.target, { matchingSelector: l });
    b != null && (i?.call(b, g, b), r && g.preventDefault());
  };
  return h.destroy = () => a.removeEventListener(n, h, c), a.addEventListener(n, h, c), h;
}, ta = function(n) {
  let { bubbles: t, cancelable: e, attributes: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  t = t !== !1, e = e !== !1;
  const s = document.createEvent("Events");
  return s.initEvent(n, t, e), i != null && Zo.call(s, i), s;
}, _i = function(n) {
  let { onElement: t, bubbles: e, cancelable: i, attributes: s } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const r = t ?? Ns, o = ta(n, { bubbles: e, cancelable: i, attributes: s });
  return r.dispatchEvent(o);
}, ea = function(n, t) {
  if (n?.nodeType === 1) return fl.call(n, t);
}, Ee = function(n) {
  let { matchingSelector: t, untilNode: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  for (; n && n.nodeType !== Node.ELEMENT_NODE; ) n = n.parentNode;
  if (n != null) {
    if (t == null) return n;
    if (n.closest && e == null) return n.closest(t);
    for (; n && n !== e; ) {
      if (ea(n, t)) return n;
      n = n.parentNode;
    }
  }
}, Ps = (n) => document.activeElement !== n && Me(n, document.activeElement), Me = function(n, t) {
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
}, an = function(n) {
  let { onlyNodesOfType: t, usingFilter: e, expandEntityReferences: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const s = (() => {
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
  return document.createTreeWalker(n, s, e ?? null, i === !0);
}, ht = (n) => {
  var t;
  return n == null || (t = n.tagName) === null || t === void 0 ? void 0 : t.toLowerCase();
}, D = function(n) {
  let t, e, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  typeof n == "object" ? (i = n, n = i.tagName) : i = { attributes: i };
  const s = document.createElement(n);
  if (i.editable != null && (i.attributes == null && (i.attributes = {}), i.attributes.contenteditable = i.editable), i.attributes) for (t in i.attributes) e = i.attributes[t], s.setAttribute(t, e);
  if (i.style) for (t in i.style) e = i.style[t], s.style[t] = e;
  if (i.data) for (t in i.data) e = i.data[t], s.dataset[t] = e;
  return i.className && i.className.split(" ").forEach(((r) => {
    s.classList.add(r);
  })), i.textContent && (s.textContent = i.textContent), i.childNodes && [].concat(i.childNodes).forEach(((r) => {
    s.appendChild(r);
  })), s;
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
}, Ye = (n) => gl(n) && n?.data === "block", gl = (n) => n?.nodeType === Node.COMMENT_NODE, Xe = function(n) {
  let { name: t } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (n) return Ei(n) ? n.data === fn ? !t || n.parentNode.dataset.trixCursorTarget === t : void 0 : Xe(n.firstChild);
}, Ne = (n) => ea(n, Be), ia = (n) => Ei(n) && n?.data === "", Ei = (n) => n?.nodeType === Node.TEXT_NODE, Fs = { level2Enabled: !0, getLevel() {
  return this.level2Enabled && Bi.supportsInputEvents ? 2 : 0;
}, pickFiles(n) {
  const t = D("input", { type: "file", multiple: !0, hidden: !0, id: this.fileInputId });
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
} }, strike: { tagName: "del", inheritable: !0 }, frozen: { style: { backgroundColor: "highlight" } } }, na = { getDefaultHTML: () => `<div class="trix-button-row">
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
const bs = { interval: 5e3 };
var Ni = Object.freeze({ __proto__: null, attachments: Bs, blockAttributes: mt, browser: Bi, css: { attachment: "attachment", attachmentCaption: "attachment__caption", attachmentCaptionEditor: "attachment__caption-editor", attachmentMetadata: "attachment__metadata", attachmentMetadataContainer: "attachment__metadata-container", attachmentName: "attachment__name", attachmentProgress: "attachment__progress", attachmentSize: "attachment__size", attachmentToolbar: "attachment__toolbar", attachmentGallery: "attachment-gallery" }, dompurify: Xo, fileSize: Qo, input: Fs, keyNames: { 8: "backspace", 9: "tab", 13: "return", 27: "escape", 37: "left", 39: "right", 46: "delete", 68: "d", 72: "h", 79: "o" }, lang: k, parser: nn, textAttributes: qe, toolbar: na, undo: bs });
class et {
  static proxyMethod(t) {
    const { name: e, toMethod: i, toProperty: s, optional: r } = bl(t);
    this.prototype[e] = function() {
      let o, a;
      var l, c;
      return i ? a = r ? (l = this[i]) === null || l === void 0 ? void 0 : l.call(this) : this[i]() : s && (a = this[s]), r ? (o = (c = a) === null || c === void 0 ? void 0 : c[e], o ? pr.call(o, a, arguments) : void 0) : (o = a[e], pr.call(o, a, arguments));
    };
  }
}
const bl = function(n) {
  const t = n.match(vl);
  if (!t) throw new Error("can't parse @proxyMethod expression: ".concat(n));
  const e = { name: t[4] };
  return t[2] != null ? e.toMethod = t[1] : e.toProperty = t[1], t[3] != null && (e.optional = !0), e;
}, { apply: pr } = Function.prototype, vl = new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");
var kn, Rn, In;
class Ii extends et {
  static box() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    return t instanceof this ? t : this.fromUCS2String(t?.toString());
  }
  static fromUCS2String(t) {
    return new this(t, vs(t));
  }
  static fromCodepoints(t) {
    return new this(ys(t), t);
  }
  constructor(t, e) {
    super(...arguments), this.ucs2String = t, this.codepoints = e, this.length = this.codepoints.length, this.ucs2Length = this.ucs2String.length;
  }
  offsetToUCS2Offset(t) {
    return ys(this.codepoints.slice(0, Math.max(0, t))).length;
  }
  offsetFromUCS2Offset(t) {
    return vs(this.ucs2String.slice(0, Math.max(0, t))).length;
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
const yl = ((kn = Array.from) === null || kn === void 0 ? void 0 : kn.call(Array, "👼").length) === 1, _l = ((Rn = " ".codePointAt) === null || Rn === void 0 ? void 0 : Rn.call(" ", 0)) != null, Al = ((In = String.fromCodePoint) === null || In === void 0 ? void 0 : In.call(String, 32, 128124)) === " 👼";
let vs, ys;
vs = yl && _l ? (n) => Array.from(n).map(((t) => t.codePointAt(0))) : function(n) {
  const t = [];
  let e = 0;
  const { length: i } = n;
  for (; e < i; ) {
    let s = n.charCodeAt(e++);
    if (55296 <= s && s <= 56319 && e < i) {
      const r = n.charCodeAt(e++);
      (64512 & r) == 56320 ? s = ((1023 & s) << 10) + (1023 & r) + 65536 : e--;
    }
    t.push(s);
  }
  return t;
}, ys = Al ? (n) => String.fromCodePoint(...Array.from(n || [])) : function(n) {
  return (() => {
    const t = [];
    return Array.from(n).forEach(((e) => {
      let i = "";
      e > 65535 && (e -= 65536, i += String.fromCharCode(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t.push(i + String.fromCharCode(e));
    })), t;
  })().join("");
};
let El = 0;
class je extends et {
  static fromJSONString(t) {
    return this.fromJSON(JSON.parse(t));
  }
  constructor() {
    super(...arguments), this.id = ++El;
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
      const s = e[i];
      t.push("".concat(i, "=").concat(s));
    }
    return "#<".concat(this.constructor.name, ":").concat(this.id).concat(t.length ? " ".concat(t.join(", ")) : "", ">");
  }
  contentsForInspection() {
  }
  toJSONString() {
    return JSON.stringify(this);
  }
  toUTF16String() {
    return Ii.box(this);
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
}, qs = function(n) {
  const t = n.slice(0);
  for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), s = 1; s < e; s++) i[s - 1] = arguments[s];
  return t.splice(...i), t;
}, xl = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/, Sl = (function() {
  const n = D("input", { dir: "auto", name: "x", dirName: "x.dir" }), t = D("textarea", { dir: "auto", name: "y", dirName: "y.dir" }), e = D("form");
  e.appendChild(n), e.appendChild(t);
  const i = (function() {
    try {
      return new FormData(e).has(t.dirName);
    } catch {
      return !1;
    }
  })(), s = (function() {
    try {
      return n.matches(":dir(ltr),:dir(rtl)");
    } catch {
      return !1;
    }
  })();
  return i ? function(r) {
    return t.value = r, new FormData(e).get(t.dirName);
  } : s ? function(r) {
    return n.value = r, n.matches(":dir(rtl)") ? "rtl" : "ltr";
  } : function(r) {
    const o = r.trim().charAt(0);
    return xl.test(o) ? "rtl" : "ltr";
  };
})();
let Dn = null, On = null, Mn = null, $i = null;
const _s = () => (Dn || (Dn = wl().concat(Ll())), Dn), Z = (n) => mt[n], Ll = () => (On || (On = Object.keys(mt)), On), As = (n) => qe[n], wl = () => (Mn || (Mn = Object.keys(qe)), Mn), sa = function(n, t) {
  Cl(n).textContent = t.replace(/%t/g, n);
}, Cl = function(n) {
  const t = document.createElement("style");
  t.setAttribute("type", "text/css"), t.setAttribute("data-tag-name", n.toLowerCase());
  const e = Tl();
  return e && t.setAttribute("nonce", e), document.head.insertBefore(t, document.head.firstChild), t;
}, Tl = function() {
  const n = fr("trix-csp-nonce") || fr("csp-nonce");
  if (n) {
    const { nonce: t, content: e } = n;
    return t == "" ? e : t;
  }
}, fr = (n) => document.head.querySelector("meta[name=".concat(n, "]")), gr = { "application/x-trix-feature-detection": "test" }, ra = function(n) {
  const t = n.getData("text/plain"), e = n.getData("text/html");
  if (!t || !e) return t?.length;
  {
    const { body: i } = new DOMParser().parseFromString(e, "text/html");
    if (i.textContent === t) return !i.querySelector("*");
  }
}, oa = /Mac|^iP/.test(navigator.platform) ? (n) => n.metaKey : (n) => n.ctrlKey, Hs = (n) => setTimeout(n, 1), aa = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const t = {};
  for (const e in n) {
    const i = n[e];
    t[e] = i;
  }
  return t;
}, ri = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  if (Object.keys(n).length !== Object.keys(t).length) return !1;
  for (const e in n)
    if (n[e] !== t[e]) return !1;
  return !0;
}, $ = function(n) {
  if (n != null) return Array.isArray(n) || (n = [n, n]), [br(n[0]), br(n[1] != null ? n[1] : n[0])];
}, ue = function(n) {
  if (n == null) return;
  const [t, e] = $(n);
  return Es(t, e);
}, ln = function(n, t) {
  if (n == null || t == null) return;
  const [e, i] = $(n), [s, r] = $(t);
  return Es(e, s) && Es(i, r);
}, br = function(n) {
  return typeof n == "number" ? n : aa(n);
}, Es = function(n, t) {
  return typeof n == "number" ? n === t : ri(n, t);
};
class la extends et {
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
const Ue = new la(), ca = function() {
  const n = window.getSelection();
  if (n.rangeCount > 0) return n;
}, xi = function() {
  var n;
  const t = (n = ca()) === null || n === void 0 ? void 0 : n.getRangeAt(0);
  if (t && !kl(t)) return t;
}, da = function(n) {
  const t = window.getSelection();
  return t.removeAllRanges(), t.addRange(n), Ue.update();
}, kl = (n) => vr(n.startContainer) || vr(n.endContainer), vr = (n) => !Object.getPrototypeOf(n), yi = (n) => n.replace(new RegExp("".concat(fn), "g"), "").replace(new RegExp("".concat(Ae), "g"), " "), Us = new RegExp("[^\\S".concat(Ae, "]")), $s = (n) => n.replace(new RegExp("".concat(Us.source), "g"), " ").replace(/\ {2,}/g, " "), yr = function(n, t) {
  if (n.isEqualTo(t)) return ["", ""];
  const e = Bn(n, t), { length: i } = e.utf16String;
  let s;
  if (i) {
    const { offset: r } = e, o = n.codepoints.slice(0, r).concat(n.codepoints.slice(r + i));
    s = Bn(t, Ii.fromCodepoints(o));
  } else s = Bn(t, n);
  return [e.utf16String.toString(), s.utf16String.toString()];
}, Bn = function(n, t) {
  let e = 0, i = n.length, s = t.length;
  for (; e < i && n.charAt(e).isEqualTo(t.charAt(e)); ) e++;
  for (; i > e + 1 && n.charAt(i - 1).isEqualTo(t.charAt(s - 1)); ) i--, s--;
  return { utf16String: n.slice(e, i), offset: e };
};
class Et extends je {
  static fromCommonAttributesOfObjects() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    if (!t.length) return new this();
    let e = di(t[0]), i = e.getKeys();
    return t.slice(1).forEach(((s) => {
      i = e.getKeysCommonToHash(di(s)), e = e.slice(i);
    })), e;
  }
  static box(t) {
    return di(t);
  }
  constructor() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    super(...arguments), this.values = sn(t);
  }
  add(t, e) {
    return this.merge(Rl(t, e));
  }
  remove(t) {
    return new Et(sn(this.values, t));
  }
  get(t) {
    return this.values[t];
  }
  has(t) {
    return t in this.values;
  }
  merge(t) {
    return new Et(Il(this.values, Dl(t)));
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
    return sn(this.values);
  }
  toJSON() {
    return this.toObject();
  }
  contentsForInspection() {
    return { values: JSON.stringify(this.values) };
  }
}
const Rl = function(n, t) {
  const e = {};
  return e[n] = t, e;
}, Il = function(n, t) {
  const e = sn(n);
  for (const i in t) {
    const s = t[i];
    e[i] = s;
  }
  return e;
}, sn = function(n, t) {
  const e = {};
  return Object.keys(n).sort().forEach(((i) => {
    i !== t && (e[i] = n[i]);
  })), e;
}, di = function(n) {
  return n instanceof Et ? n : new Et(n);
}, Dl = function(n) {
  return n instanceof Et ? n.values : n;
};
class js {
  static groupObjects() {
    let t, e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], { depth: i, asTree: s } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    s && i == null && (i = 0);
    const r = [];
    return Array.from(e).forEach(((o) => {
      var a;
      if (t) {
        var l, c, h;
        if ((l = o.canBeGrouped) !== null && l !== void 0 && l.call(o, i) && (c = (h = t[t.length - 1]).canBeGroupedWith) !== null && c !== void 0 && c.call(h, o, i)) return void t.push(o);
        r.push(new this(t, { depth: i, asTree: s })), t = null;
      }
      (a = o.canBeGrouped) !== null && a !== void 0 && a.call(o, i) ? t = [o] : r.push(o);
    })), t && r.push(new this(t, { depth: i, asTree: s })), r;
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
class Ol extends et {
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
class Ml {
  constructor(t) {
    this.reset(t);
  }
  add(t) {
    const e = _r(t);
    this.elements[e] = t;
  }
  remove(t) {
    const e = _r(t), i = this.elements[e];
    if (i) return delete this.elements[e], i;
  }
  reset() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return this.elements = {}, Array.from(t).forEach(((e) => {
      this.add(e);
    })), t;
  }
}
const _r = (n) => n.dataset.trixStoreKey;
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
    return this.promise || (this.promise = new Promise(((t, e) => (this.performing = !0, this.perform(((i, s) => {
      this.succeeded = i, this.performing = !1, this.performed = !0, this.succeeded ? t(s) : e(s);
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
    let s = this.getCachedViewForObject(e);
    return s ? this.recordChildView(s) : (s = this.createChildView(...arguments), this.cacheViewForObject(s, e)), s;
  }
  createChildView(t, e) {
    let i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    e instanceof js && (i.viewClass = t, t = Bl);
    const s = new t(e, i);
    return this.recordChildView(s);
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
class Bl extends Ve {
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
const { entries: ua, setPrototypeOf: Ar, isFrozen: Nl, getPrototypeOf: Pl, getOwnPropertyDescriptor: Fl } = Object;
let { freeze: pt, seal: Dt, create: ha } = Object, { apply: xs, construct: Ss } = typeof Reflect < "u" && Reflect;
pt || (pt = function(n) {
  return n;
}), Dt || (Dt = function(n) {
  return n;
}), xs || (xs = function(n, t) {
  for (var e = arguments.length, i = new Array(e > 2 ? e - 2 : 0), s = 2; s < e; s++) i[s - 2] = arguments[s];
  return n.apply(t, i);
}), Ss || (Ss = function(n) {
  for (var t = arguments.length, e = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) e[i - 1] = arguments[i];
  return new n(...e);
});
const ji = ft(Array.prototype.forEach), ql = ft(Array.prototype.lastIndexOf), Er = ft(Array.prototype.pop), ui = ft(Array.prototype.push), Hl = ft(Array.prototype.splice), rn = ft(String.prototype.toLowerCase), Nn = ft(String.prototype.toString), Pn = ft(String.prototype.match), hi = ft(String.prototype.replace), Ul = ft(String.prototype.indexOf), $l = ft(String.prototype.trim), Wt = ft(Object.prototype.hasOwnProperty), ut = ft(RegExp.prototype.test), mi = (xr = TypeError, function() {
  for (var n = arguments.length, t = new Array(n), e = 0; e < n; e++) t[e] = arguments[e];
  return Ss(xr, t);
});
var xr;
function ft(n) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), s = 1; s < e; s++) i[s - 1] = arguments[s];
    return xs(n, t, i);
  };
}
function M(n, t) {
  let e = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : rn;
  Ar && Ar(n, null);
  let i = t.length;
  for (; i--; ) {
    let s = t[i];
    if (typeof s == "string") {
      const r = e(s);
      r !== s && (Nl(t) || (t[i] = r), s = r);
    }
    n[s] = !0;
  }
  return n;
}
function jl(n) {
  for (let t = 0; t < n.length; t++)
    Wt(n, t) || (n[t] = null);
  return n;
}
function ce(n) {
  const t = ha(null);
  for (const [e, i] of ua(n))
    Wt(n, e) && (Array.isArray(i) ? t[e] = jl(i) : i && typeof i == "object" && i.constructor === Object ? t[e] = ce(i) : t[e] = i);
  return t;
}
function pi(n, t) {
  for (; n !== null; ) {
    const e = Fl(n, t);
    if (e) {
      if (e.get) return ft(e.get);
      if (typeof e.value == "function") return ft(e.value);
    }
    n = Pl(n);
  }
  return function() {
    return null;
  };
}
const Sr = pt(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), Fn = pt(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "slot", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), qn = pt(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Vl = pt(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Hn = pt(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Wl = pt(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Lr = pt(["#text"]), wr = pt(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), Un = pt(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Cr = pt(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Vi = pt(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), zl = Dt(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Kl = Dt(/<%[\w\W]*|[\w\W]*%>/gm), Gl = Dt(/\$\{[\w\W]*/gm), Jl = Dt(/^data-[\-\w.\u00B7-\uFFFF]+$/), Yl = Dt(/^aria-[\-\w]+$/), ma = Dt(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Xl = Dt(/^(?:\w+script|data):/i), Ql = Dt(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), pa = Dt(/^html$/i), Zl = Dt(/^[a-z][.\w]*(-[.\w]+)+$/i);
var Tr = Object.freeze({ __proto__: null, ARIA_ATTR: Yl, ATTR_WHITESPACE: Ql, CUSTOM_ELEMENT: Zl, DATA_ATTR: Jl, DOCTYPE_NAME: pa, ERB_EXPR: Kl, IS_ALLOWED_URI: ma, IS_SCRIPT_OR_DATA: Xl, MUSTACHE_EXPR: zl, TMPLIT_EXPR: Gl });
const tc = 1, ec = 3, ic = 7, nc = 8, sc = 9, rc = function() {
  return typeof window > "u" ? null : window;
};
var Ze = (function n() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : rc();
  const e = (d) => n(d);
  if (e.version = "3.2.7", e.removed = [], !t || !t.document || t.document.nodeType !== sc || !t.Element) return e.isSupported = !1, e;
  let { document: i } = t;
  const s = i, r = s.currentScript, { DocumentFragment: o, HTMLTemplateElement: a, Node: l, Element: c, NodeFilter: h, NamedNodeMap: g = t.NamedNodeMap || t.MozNamedAttrMap, HTMLFormElement: b, DOMParser: m, trustedTypes: v } = t, f = c.prototype, A = pi(f, "cloneNode"), w = pi(f, "remove"), C = pi(f, "nextSibling"), T = pi(f, "childNodes"), u = pi(f, "parentNode");
  if (typeof a == "function") {
    const d = i.createElement("template");
    d.content && d.content.ownerDocument && (i = d.content.ownerDocument);
  }
  let x, y = "";
  const { implementation: O, createNodeIterator: j, createDocumentFragment: z, getElementsByTagName: K } = i, { importNode: X } = s;
  let I = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  e.isSupported = typeof ua == "function" && typeof u == "function" && O && O.createHTMLDocument !== void 0;
  const { MUSTACHE_EXPR: V, ERB_EXPR: ot, TMPLIT_EXPR: at, DATA_ATTR: st, ARIA_ATTR: rt, IS_SCRIPT_OR_DATA: it, ATTR_WHITESPACE: _t, CUSTOM_ELEMENT: St } = Tr;
  let { IS_ALLOWED_URI: Gt } = Tr, U = null;
  const Jt = M({}, [...Sr, ...Fn, ...qn, ...Hn, ...Lr]);
  let W = null;
  const gt = M({}, [...wr, ...Un, ...Cr, ...Vi]);
  let q = Object.seal(ha(null, { tagNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, attributeNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }, allowCustomizedBuiltInElements: { writable: !0, configurable: !1, enumerable: !0, value: !1 } })), Lt = null, At = null, ee = !0, wt = !0, ie = !1, Le = !0, Ct = !1, ne = !0, Tt = !1, se = !1, re = !1, Bt = !1, oe = !1, bt = !1, Nt = !0, me = !1, Pt = !0, Ft = !1, qt = {}, Ht = null;
  const we = M({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let Ce = null;
  const qi = M({}, ["audio", "video", "img", "source", "image", "track"]);
  let li = null;
  const Hi = M({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), ze = "http://www.w3.org/1998/Math/MathML", Ke = "http://www.w3.org/2000/svg", p = "http://www.w3.org/1999/xhtml";
  let E = p, L = !1, F = null;
  const B = M({}, [ze, Ke, p], Nn);
  let tt = M({}, ["mi", "mo", "mn", "ms", "mtext"]), lt = M({}, ["annotation-xml"]);
  const pe = M({}, ["title", "style", "font", "a", "script"]);
  let fe = null;
  const ae = ["application/xhtml+xml", "text/html"];
  let Y = null, Ut = null;
  const ge = i.createElement("form"), Ui = function(d) {
    return d instanceof RegExp || d instanceof Function;
  }, Te = function() {
    let d = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!Ut || Ut !== d) {
      if (d && typeof d == "object" || (d = {}), d = ce(d), fe = ae.indexOf(d.PARSER_MEDIA_TYPE) === -1 ? "text/html" : d.PARSER_MEDIA_TYPE, Y = fe === "application/xhtml+xml" ? Nn : rn, U = Wt(d, "ALLOWED_TAGS") ? M({}, d.ALLOWED_TAGS, Y) : Jt, W = Wt(d, "ALLOWED_ATTR") ? M({}, d.ALLOWED_ATTR, Y) : gt, F = Wt(d, "ALLOWED_NAMESPACES") ? M({}, d.ALLOWED_NAMESPACES, Nn) : B, li = Wt(d, "ADD_URI_SAFE_ATTR") ? M(ce(Hi), d.ADD_URI_SAFE_ATTR, Y) : Hi, Ce = Wt(d, "ADD_DATA_URI_TAGS") ? M(ce(qi), d.ADD_DATA_URI_TAGS, Y) : qi, Ht = Wt(d, "FORBID_CONTENTS") ? M({}, d.FORBID_CONTENTS, Y) : we, Lt = Wt(d, "FORBID_TAGS") ? M({}, d.FORBID_TAGS, Y) : ce({}), At = Wt(d, "FORBID_ATTR") ? M({}, d.FORBID_ATTR, Y) : ce({}), qt = !!Wt(d, "USE_PROFILES") && d.USE_PROFILES, ee = d.ALLOW_ARIA_ATTR !== !1, wt = d.ALLOW_DATA_ATTR !== !1, ie = d.ALLOW_UNKNOWN_PROTOCOLS || !1, Le = d.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Ct = d.SAFE_FOR_TEMPLATES || !1, ne = d.SAFE_FOR_XML !== !1, Tt = d.WHOLE_DOCUMENT || !1, Bt = d.RETURN_DOM || !1, oe = d.RETURN_DOM_FRAGMENT || !1, bt = d.RETURN_TRUSTED_TYPE || !1, re = d.FORCE_BODY || !1, Nt = d.SANITIZE_DOM !== !1, me = d.SANITIZE_NAMED_PROPS || !1, Pt = d.KEEP_CONTENT !== !1, Ft = d.IN_PLACE || !1, Gt = d.ALLOWED_URI_REGEXP || ma, E = d.NAMESPACE || p, tt = d.MATHML_TEXT_INTEGRATION_POINTS || tt, lt = d.HTML_INTEGRATION_POINTS || lt, q = d.CUSTOM_ELEMENT_HANDLING || {}, d.CUSTOM_ELEMENT_HANDLING && Ui(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (q.tagNameCheck = d.CUSTOM_ELEMENT_HANDLING.tagNameCheck), d.CUSTOM_ELEMENT_HANDLING && Ui(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (q.attributeNameCheck = d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), d.CUSTOM_ELEMENT_HANDLING && typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (q.allowCustomizedBuiltInElements = d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Ct && (wt = !1), oe && (Bt = !0), qt && (U = M({}, Lr), W = [], qt.html === !0 && (M(U, Sr), M(W, wr)), qt.svg === !0 && (M(U, Fn), M(W, Un), M(W, Vi)), qt.svgFilters === !0 && (M(U, qn), M(W, Un), M(W, Vi)), qt.mathMl === !0 && (M(U, Hn), M(W, Cr), M(W, Vi))), d.ADD_TAGS && (U === Jt && (U = ce(U)), M(U, d.ADD_TAGS, Y)), d.ADD_ATTR && (W === gt && (W = ce(W)), M(W, d.ADD_ATTR, Y)), d.ADD_URI_SAFE_ATTR && M(li, d.ADD_URI_SAFE_ATTR, Y), d.FORBID_CONTENTS && (Ht === we && (Ht = ce(Ht)), M(Ht, d.FORBID_CONTENTS, Y)), Pt && (U["#text"] = !0), Tt && M(U, ["html", "head", "body"]), U.table && (M(U, ["tbody"]), delete Lt.tbody), d.TRUSTED_TYPES_POLICY) {
        if (typeof d.TRUSTED_TYPES_POLICY.createHTML != "function") throw mi('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof d.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw mi('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        x = d.TRUSTED_TYPES_POLICY, y = x.createHTML("");
      } else x === void 0 && (x = (function(S, _) {
        if (typeof S != "object" || typeof S.createPolicy != "function") return null;
        let N = null;
        const H = "data-tt-policy-suffix";
        _ && _.hasAttribute(H) && (N = _.getAttribute(H));
        const R = "dompurify" + (N ? "#" + N : "");
        try {
          return S.createPolicy(R, { createHTML: (nt) => nt, createScriptURL: (nt) => nt });
        } catch {
          return console.warn("TrustedTypes policy " + R + " could not be created."), null;
        }
      })(v, r)), x !== null && typeof y == "string" && (y = x.createHTML(""));
      pt && pt(d), Ut = d;
    }
  }, ke = M({}, [...Fn, ...qn, ...Vl]), ir = M({}, [...Hn, ...Wl]), Yt = function(d) {
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
    if (S.removeAttribute(d), d === "is") if (Bt || oe) try {
      Yt(S);
    } catch {
    }
    else try {
      S.setAttribute(d, "");
    } catch {
    }
  }, nr = function(d) {
    let S = null, _ = null;
    if (re) d = "<remove></remove>" + d;
    else {
      const R = Pn(d, /^[\r\n\t ]+/);
      _ = R && R[0];
    }
    fe === "application/xhtml+xml" && E === p && (d = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + d + "</body></html>");
    const N = x ? x.createHTML(d) : d;
    if (E === p) try {
      S = new m().parseFromString(N, fe);
    } catch {
    }
    if (!S || !S.documentElement) {
      S = O.createDocument(E, "template", null);
      try {
        S.documentElement.innerHTML = L ? y : N;
      } catch {
      }
    }
    const H = S.body || S.documentElement;
    return d && _ && H.insertBefore(i.createTextNode(_), H.childNodes[0] || null), E === p ? K.call(S, Tt ? "html" : "body")[0] : Tt ? S.documentElement : H;
  }, sr = function(d) {
    return j.call(d.ownerDocument || d, d, h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION, null);
  }, xn = function(d) {
    return d instanceof b && (typeof d.nodeName != "string" || typeof d.textContent != "string" || typeof d.removeChild != "function" || !(d.attributes instanceof g) || typeof d.removeAttribute != "function" || typeof d.setAttribute != "function" || typeof d.namespaceURI != "string" || typeof d.insertBefore != "function" || typeof d.hasChildNodes != "function");
  }, rr = function(d) {
    return typeof l == "function" && d instanceof l;
  };
  function le(d, S, _) {
    ji(d, ((N) => {
      N.call(e, S, _, Ut);
    }));
  }
  const or = function(d) {
    let S = null;
    if (le(I.beforeSanitizeElements, d, null), xn(d)) return Yt(d), !0;
    const _ = Y(d.nodeName);
    if (le(I.uponSanitizeElement, d, { tagName: _, allowedTags: U }), ne && d.hasChildNodes() && !rr(d.firstElementChild) && ut(/<[/\w!]/g, d.innerHTML) && ut(/<[/\w!]/g, d.textContent) || d.nodeType === ic || ne && d.nodeType === nc && ut(/<[/\w]/g, d.data)) return Yt(d), !0;
    if (!U[_] || Lt[_]) {
      if (!Lt[_] && lr(_) && (q.tagNameCheck instanceof RegExp && ut(q.tagNameCheck, _) || q.tagNameCheck instanceof Function && q.tagNameCheck(_)))
        return !1;
      if (Pt && !Ht[_]) {
        const N = u(d) || d.parentNode, H = T(d) || d.childNodes;
        if (H && N)
          for (let R = H.length - 1; R >= 0; --R) {
            const nt = A(H[R], !0);
            nt.__removalCount = (d.__removalCount || 0) + 1, N.insertBefore(nt, C(d));
          }
      }
      return Yt(d), !0;
    }
    return d instanceof c && !(function(N) {
      let H = u(N);
      H && H.tagName || (H = { namespaceURI: E, tagName: "template" });
      const R = rn(N.tagName), nt = rn(H.tagName);
      return !!F[N.namespaceURI] && (N.namespaceURI === Ke ? H.namespaceURI === p ? R === "svg" : H.namespaceURI === ze ? R === "svg" && (nt === "annotation-xml" || tt[nt]) : !!ke[R] : N.namespaceURI === ze ? H.namespaceURI === p ? R === "math" : H.namespaceURI === Ke ? R === "math" && lt[nt] : !!ir[R] : N.namespaceURI === p ? !(H.namespaceURI === Ke && !lt[nt]) && !(H.namespaceURI === ze && !tt[nt]) && !ir[R] && (pe[R] || !ke[R]) : !(fe !== "application/xhtml+xml" || !F[N.namespaceURI]));
    })(d) ? (Yt(d), !0) : _ !== "noscript" && _ !== "noembed" && _ !== "noframes" || !ut(/<\/no(script|embed|frames)/i, d.innerHTML) ? (Ct && d.nodeType === ec && (S = d.textContent, ji([V, ot, at], ((N) => {
      S = hi(S, N, " ");
    })), d.textContent !== S && (ui(e.removed, { element: d.cloneNode() }), d.textContent = S)), le(I.afterSanitizeElements, d, null), !1) : (Yt(d), !0);
  }, ar = function(d, S, _) {
    if (Nt && (S === "id" || S === "name") && (_ in i || _ in ge)) return !1;
    if (!(wt && !At[S] && ut(st, S))) {
      if (!(ee && ut(rt, S))) {
        if (!W[S] || At[S]) {
          if (!(lr(d) && (q.tagNameCheck instanceof RegExp && ut(q.tagNameCheck, d) || q.tagNameCheck instanceof Function && q.tagNameCheck(d)) && (q.attributeNameCheck instanceof RegExp && ut(q.attributeNameCheck, S) || q.attributeNameCheck instanceof Function && q.attributeNameCheck(S, d)) || S === "is" && q.allowCustomizedBuiltInElements && (q.tagNameCheck instanceof RegExp && ut(q.tagNameCheck, _) || q.tagNameCheck instanceof Function && q.tagNameCheck(_)))) return !1;
        } else if (!li[S]) {
          if (!ut(Gt, hi(_, _t, ""))) {
            if ((S !== "src" && S !== "xlink:href" && S !== "href" || d === "script" || Ul(_, "data:") !== 0 || !Ce[d]) && !(ie && !ut(it, hi(_, _t, "")))) {
              if (_) return !1;
            }
          }
        }
      }
    }
    return !0;
  }, lr = function(d) {
    return d !== "annotation-xml" && Pn(d, St);
  }, cr = function(d) {
    le(I.beforeSanitizeAttributes, d, null);
    const { attributes: S } = d;
    if (!S || xn(d)) return;
    const _ = { attrName: "", attrValue: "", keepAttr: !0, allowedAttributes: W, forceKeepAttr: void 0 };
    let N = S.length;
    for (; N--; ) {
      const H = S[N], { name: R, namespaceURI: nt, value: be } = H, $t = Y(R), Sn = be;
      let ct = R === "value" ? Sn : $l(Sn);
      if (_.attrName = $t, _.attrValue = ct, _.keepAttr = !0, _.forceKeepAttr = void 0, le(I.uponSanitizeAttribute, d, _), ct = _.attrValue, !me || $t !== "id" && $t !== "name" || (Re(R, d), ct = "user-content-" + ct), ne && ut(/((--!?|])>)|<\/(style|title|textarea)/i, ct)) {
        Re(R, d);
        continue;
      }
      if ($t === "attributename" && Pn(ct, "href")) {
        Re(R, d);
        continue;
      }
      if (_.forceKeepAttr) continue;
      if (!_.keepAttr) {
        Re(R, d);
        continue;
      }
      if (!Le && ut(/\/>/i, ct)) {
        Re(R, d);
        continue;
      }
      Ct && ji([V, ot, at], ((ur) => {
        ct = hi(ct, ur, " ");
      }));
      const dr = Y(d.nodeName);
      if (ar(dr, $t, ct)) {
        if (x && typeof v == "object" && typeof v.getAttributeType == "function" && !nt) switch (v.getAttributeType(dr, $t)) {
          case "TrustedHTML":
            ct = x.createHTML(ct);
            break;
          case "TrustedScriptURL":
            ct = x.createScriptURL(ct);
        }
        if (ct !== Sn) try {
          nt ? d.setAttributeNS(nt, R, ct) : d.setAttribute(R, ct), xn(d) ? Yt(d) : Er(e.removed);
        } catch {
          Re(R, d);
        }
      } else Re(R, d);
    }
    le(I.afterSanitizeAttributes, d, null);
  }, hl = function d(S) {
    let _ = null;
    const N = sr(S);
    for (le(I.beforeSanitizeShadowDOM, S, null); _ = N.nextNode(); ) le(I.uponSanitizeShadowNode, _, null), or(_), cr(_), _.content instanceof o && d(_.content);
    le(I.afterSanitizeShadowDOM, S, null);
  };
  return e.sanitize = function(d) {
    let S = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ = null, N = null, H = null, R = null;
    if (L = !d, L && (d = "<!-->"), typeof d != "string" && !rr(d)) {
      if (typeof d.toString != "function") throw mi("toString is not a function");
      if (typeof (d = d.toString()) != "string") throw mi("dirty is not a string, aborting");
    }
    if (!e.isSupported) return d;
    if (se || Te(S), e.removed = [], typeof d == "string" && (Ft = !1), Ft) {
      if (d.nodeName) {
        const $t = Y(d.nodeName);
        if (!U[$t] || Lt[$t]) throw mi("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (d instanceof l) _ = nr("<!---->"), N = _.ownerDocument.importNode(d, !0), N.nodeType === tc && N.nodeName === "BODY" || N.nodeName === "HTML" ? _ = N : _.appendChild(N);
    else {
      if (!Bt && !Ct && !Tt && d.indexOf("<") === -1) return x && bt ? x.createHTML(d) : d;
      if (_ = nr(d), !_) return Bt ? null : bt ? y : "";
    }
    _ && re && Yt(_.firstChild);
    const nt = sr(Ft ? d : _);
    for (; H = nt.nextNode(); ) or(H), cr(H), H.content instanceof o && hl(H.content);
    if (Ft) return d;
    if (Bt) {
      if (oe) for (R = z.call(_.ownerDocument); _.firstChild; ) R.appendChild(_.firstChild);
      else R = _;
      return (W.shadowroot || W.shadowrootmode) && (R = X.call(s, R, !0)), R;
    }
    let be = Tt ? _.outerHTML : _.innerHTML;
    return Tt && U["!doctype"] && _.ownerDocument && _.ownerDocument.doctype && _.ownerDocument.doctype.name && ut(pa, _.ownerDocument.doctype.name) && (be = "<!DOCTYPE " + _.ownerDocument.doctype.name + `>
` + be), Ct && ji([V, ot, at], (($t) => {
      be = hi(be, $t, " ");
    })), x && bt ? x.createHTML(be) : be;
  }, e.setConfig = function() {
    Te(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}), se = !0;
  }, e.clearConfig = function() {
    Ut = null, se = !1;
  }, e.isValidAttribute = function(d, S, _) {
    Ut || Te({});
    const N = Y(d), H = Y(S);
    return ar(N, H, _);
  }, e.addHook = function(d, S) {
    typeof S == "function" && ui(I[d], S);
  }, e.removeHook = function(d, S) {
    if (S !== void 0) {
      const _ = ql(I[d], S);
      return _ === -1 ? void 0 : Hl(I[d], _, 1)[0];
    }
    return Er(I[d]);
  }, e.removeHooks = function(d) {
    I[d] = [];
  }, e.removeAllHooks = function() {
    I = { afterSanitizeAttributes: [], afterSanitizeElements: [], afterSanitizeShadowDOM: [], beforeSanitizeAttributes: [], beforeSanitizeElements: [], beforeSanitizeShadowDOM: [], uponSanitizeAttribute: [], uponSanitizeElement: [], uponSanitizeShadowNode: [] };
  }, e;
})();
Ze.addHook("uponSanitizeAttribute", (function(n, t) {
  if (t.attrName === "data-trix-serialized-attributes") return void (t.keepAttr = !1);
  /^data-trix-/.test(t.attrName) && (t.forceKeepAttr = !0);
}));
const oc = "style href src width height language class".split(" "), ac = "javascript:".split(" "), lc = "script iframe form noscript".split(" ");
class gn extends et {
  static setHTML(t, e, i) {
    const s = new this(e, i).sanitize(), r = s.getHTML ? s.getHTML() : s.outerHTML;
    t.innerHTML = r;
  }
  static sanitize(t, e) {
    const i = new this(t, e);
    return i.sanitize(), i;
  }
  constructor(t) {
    let { allowedAttributes: e, forbiddenProtocols: i, forbiddenElements: s, purifyOptions: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super(...arguments), this.allowedAttributes = e || oc, this.forbiddenProtocols = i || ac, this.forbiddenElements = s || lc, this.purifyOptions = r || {}, this.body = cc(t);
  }
  sanitize() {
    this.sanitizeElements(), this.normalizeListElementNesting();
    const t = Object.assign({}, Xo, this.purifyOptions);
    return Ze.setConfig(t), this.body = Ze.sanitize(this.body), this.body;
  }
  getHTML() {
    return this.body.innerHTML;
  }
  getBody() {
    return this.body;
  }
  sanitizeElements() {
    const t = an(this.body), e = [];
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
const cc = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  n = n.replace(/<\/html[^>]*>[^]*$/i, "</html>");
  const t = document.implementation.createHTMLDocument("");
  return t.documentElement.innerHTML = n, Array.from(t.head.querySelectorAll("style")).forEach(((e) => {
    t.body.appendChild(e);
  })), t.body;
}, { css: ve } = Ni;
class Vs extends Ve {
  constructor() {
    super(...arguments), this.attachment = this.object, this.attachment.uploadProgressDelegate = this, this.attachmentPiece = this.options.piece;
  }
  createContentNodes() {
    return [];
  }
  createNodes() {
    let t;
    const e = t = D({ tagName: "figure", className: this.getClassName(), data: this.getData(), editable: !1 }), i = this.getHref();
    return i && (t = D({ tagName: "a", editable: !1, attributes: { href: i, tabindex: -1 } }), e.appendChild(t)), this.attachment.hasContent() ? gn.setHTML(t, this.attachment.getContent()) : this.createContentNodes().forEach(((s) => {
      t.appendChild(s);
    })), t.appendChild(this.createCaptionElement()), this.attachment.isPending() && (this.progressElement = D({ tagName: "progress", attributes: { class: ve.attachmentProgress, value: this.attachment.getUploadProgress(), max: 100 }, data: { trixMutable: !0, trixStoreKey: ["progressElement", this.attachment.id].join("/") } }), e.appendChild(this.progressElement)), [kr("left"), e, kr("right")];
  }
  createCaptionElement() {
    const t = D({ tagName: "figcaption", className: ve.attachmentCaption }), e = this.attachmentPiece.getCaption();
    if (e) t.classList.add("".concat(ve.attachmentCaption, "--edited")), t.textContent = e;
    else {
      let i, s;
      const r = this.getCaptionConfig();
      if (r.name && (i = this.attachment.getFilename()), r.size && (s = this.attachment.getFormattedFilesize()), i) {
        const o = D({ tagName: "span", className: ve.attachmentName, textContent: i });
        t.appendChild(o);
      }
      if (s) {
        i && t.appendChild(document.createTextNode(" "));
        const o = D({ tagName: "span", className: ve.attachmentSize, textContent: s });
        t.appendChild(o);
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
    if (!dc(this.attachment.getContent(), "a")) {
      const t = this.attachment.getHref();
      if (t && Ze.isValidAttribute("a", "href", t)) return t;
    }
  }
  getCaptionConfig() {
    var t;
    const e = this.attachment.getType(), i = aa((t = Bs[e]) === null || t === void 0 ? void 0 : t.caption);
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
const kr = (n) => D({ tagName: "span", textContent: fn, data: { trixCursorTarget: n, trixSerialize: !1 } }), dc = function(n, t) {
  const e = D("div");
  return gn.setHTML(e, n || ""), e.querySelector(t);
};
class fa extends Vs {
  constructor() {
    super(...arguments), this.attachment.previewDelegate = this;
  }
  createContentNodes() {
    return this.image = D({ tagName: "img", attributes: { src: "" }, data: { trixMutable: !0 } }), this.refresh(this.image), [this.image];
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
    const s = this.attachment.getWidth(), r = this.attachment.getHeight(), o = this.attachment.getAttribute("alt");
    s != null && (t.width = s), r != null && (t.height = r), o != null && (t.alt = o);
    const a = ["imageElement", this.attachment.id, t.src, t.width, t.height].join("/");
    t.dataset.trixStoreKey = a;
  }
  attachmentDidChangeAttributes() {
    return this.refresh(this.image), this.refresh();
  }
}
class ga extends Ve {
  constructor() {
    super(...arguments), this.piece = this.object, this.attributes = this.piece.getAttributes(), this.textConfig = this.options.textConfig, this.context = this.options.context, this.piece.attachment ? this.attachment = this.piece.attachment : this.string = this.piece.toString();
  }
  createNodes() {
    let t = this.attachment ? this.createAttachmentNodes() : this.createStringNodes();
    const e = this.createElement();
    if (e) {
      const i = (function(s) {
        for (; (r = s) !== null && r !== void 0 && r.firstElementChild; ) {
          var r;
          s = s.firstElementChild;
        }
        return s;
      })(e);
      Array.from(t).forEach(((s) => {
        i.appendChild(s);
      })), t = [e];
    }
    return t;
  }
  createAttachmentNodes() {
    const t = this.attachment.isPreviewable() ? fa : Vs;
    return this.createChildView(t, this.piece.attachment, { piece: this.piece }).getNodes();
  }
  createStringNodes() {
    var t;
    if ((t = this.textConfig) !== null && t !== void 0 && t.plaintext) return [document.createTextNode(this.string)];
    {
      const e = [], i = this.string.split(`
`);
      for (let s = 0; s < i.length; s++) {
        const r = i[s];
        if (s > 0) {
          const o = D("br");
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
    const s = {};
    for (e in this.attributes) {
      i = this.attributes[e];
      const o = As(e);
      if (o) {
        if (o.tagName) {
          var r;
          const a = D(o.tagName);
          r ? (r.appendChild(a), r = a) : t = r = a;
        }
        if (o.styleProperty && (s[o.styleProperty] = i), o.style) for (e in o.style) i = o.style[e], s[e] = i;
      }
    }
    if (Object.keys(s).length) for (e in t || (t = D("span")), s) i = s[e], t.style[e] = i;
    return t;
  }
  createContainerElement() {
    for (const t in this.attributes) {
      const e = this.attributes[t], i = As(t);
      if (i && i.groupTagName) {
        const s = {};
        return s[t] = e, D(i.groupTagName, s);
      }
    }
  }
  preserveSpaces(t) {
    return this.context.isLast && (t = t.replace(/\ $/, Ae)), t = t.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(Ae, " $2")).replace(/\ {2}/g, "".concat(Ae, " ")).replace(/\ {2}/g, " ".concat(Ae)), (this.context.isFirst || this.context.followsWhitespace) && (t = t.replace(/^\ /, Ae)), t;
  }
}
class ba extends Ve {
  constructor() {
    super(...arguments), this.text = this.object, this.textConfig = this.options.textConfig;
  }
  createNodes() {
    const t = [], e = js.groupObjects(this.getPieces()), i = e.length - 1;
    for (let r = 0; r < e.length; r++) {
      const o = e[r], a = {};
      r === 0 && (a.isFirst = !0), r === i && (a.isLast = !0), uc(s) && (a.followsWhitespace = !0);
      const l = this.findOrCreateCachedChildView(ga, o, { textConfig: this.textConfig, context: a });
      t.push(...Array.from(l.getNodes() || []));
      var s = o;
    }
    return t;
  }
  getPieces() {
    return Array.from(this.text.getPieces()).filter(((t) => !t.hasAttribute("blockBreak")));
  }
}
const uc = (n) => /\s$/.test(n?.toString()), { css: Rr } = Ni;
class va extends Ve {
  constructor() {
    super(...arguments), this.block = this.object, this.attributes = this.block.getAttributes();
  }
  createNodes() {
    const t = [document.createComment("block")];
    if (this.block.isEmpty()) t.push(D("br"));
    else {
      var e;
      const i = (e = Z(this.block.getLastAttribute())) === null || e === void 0 ? void 0 : e.text, s = this.findOrCreateCachedChildView(ba, this.block.text, { textConfig: i });
      t.push(...Array.from(s.getNodes() || [])), this.shouldAddExtraNewlineElement() && t.push(D("br"));
    }
    if (this.attributes.length) return t;
    {
      let i;
      const { tagName: s } = mt.default;
      this.block.isRTL() && (i = { dir: "rtl" });
      const r = D({ tagName: s, attributes: i });
      return t.forEach(((o) => r.appendChild(o))), [r];
    }
  }
  createContainerElement(t) {
    const e = {};
    let i;
    const s = this.attributes[t], { tagName: r, htmlAttributes: o = [] } = Z(s);
    if (t === 0 && this.block.isRTL() && Object.assign(e, { dir: "rtl" }), s === "attachmentGallery") {
      const a = this.block.getBlockBreakPosition();
      i = "".concat(Rr.attachmentGallery, " ").concat(Rr.attachmentGallery, "--").concat(a);
    }
    return Object.entries(this.block.htmlAttributes).forEach(((a) => {
      let [l, c] = a;
      o.includes(l) && (e[l] = c);
    })), D({ tagName: r, className: i, attributes: e });
  }
  shouldAddExtraNewlineElement() {
    return /\n\n$/.test(this.block.toString());
  }
}
class bn extends Ve {
  static render(t) {
    const e = D("div"), i = new this(t, { element: e });
    return i.render(), i.sync(), e;
  }
  constructor() {
    super(...arguments), this.element = this.options.element, this.elementStore = new Ml(), this.setDocument(this.object);
  }
  setDocument(t) {
    t.isEqualTo(this.document) || (this.document = this.object = t);
  }
  render() {
    if (this.childViews = [], this.shadowElement = D("div"), !this.document.isEmpty()) {
      const t = js.groupObjects(this.document.getBlocks(), { asTree: !0 });
      Array.from(t).forEach(((e) => {
        const i = this.findOrCreateCachedChildView(va, e);
        Array.from(i.getNodes()).map(((s) => this.shadowElement.appendChild(s)));
      }));
    }
  }
  isSynced() {
    return hc(this.shadowElement, this.element);
  }
  sync() {
    const t = ta("trix-before-render", { cancelable: !1, attributes: { render: (i, s) => {
      for (; i.lastChild; ) i.removeChild(i.lastChild);
      i.appendChild(s);
    } } });
    this.element.dispatchEvent(t);
    const e = this.createDocumentFragmentForSync();
    return t.render(this.element, e), this.didSync();
  }
  didSync() {
    return this.elementStore.reset(Ir(this.element)), Hs((() => this.garbageCollectCachedViews()));
  }
  createDocumentFragmentForSync() {
    const t = document.createDocumentFragment();
    return Array.from(this.shadowElement.childNodes).forEach(((e) => {
      t.appendChild(e.cloneNode(!0));
    })), Array.from(Ir(t)).forEach(((e) => {
      const i = this.elementStore.remove(e);
      i && e.parentNode.replaceChild(i, e);
    })), t;
  }
}
const Ir = (n) => n.querySelectorAll("[data-trix-store-key]"), hc = (n, t) => Dr(n.innerHTML) === Dr(t.innerHTML), Dr = (n) => n.replace(/&nbsp;/g, " ");
function mc(n) {
  var t = (function(e, i) {
    if (typeof e != "object" || !e) return e;
    var s = e[Symbol.toPrimitive];
    if (s !== void 0) {
      var r = s.call(e, i);
      if (typeof r != "object") return r;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (i === "string" ? String : Number)(e);
  })(n, "string");
  return typeof t == "symbol" ? t : String(t);
}
function dt(n, t, e) {
  return (t = mc(t)) in n ? Object.defineProperty(n, t, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : n[t] = e, n;
}
function P(n, t) {
  return pc(n, ya(n, t, "get"));
}
function Si(n, t, e) {
  return fc(n, ya(n, t, "set"), e), e;
}
function ya(n, t, e) {
  if (!t.has(n)) throw new TypeError("attempted to " + e + " private field on non-instance");
  return t.get(n);
}
function pc(n, t) {
  return t.get ? t.get.call(n) : t.value;
}
function fc(n, t, e) {
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
function _a(n, t) {
  if (t.has(n)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function Qe(n, t, e) {
  _a(n, t), t.set(n, e);
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
class Aa extends cn {
  constructor(t) {
    super(...arguments), this.url = t;
  }
  perform(t) {
    const e = new Image();
    e.onload = () => (e.width = this.width = e.naturalWidth, e.height = this.height = e.naturalHeight, t(!0, e)), e.onerror = () => t(!1), e.src = this.url;
  }
}
class oi extends je {
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
    var i, s, r, o;
    if (!this.attributes.isEqualTo(e)) return this.attributes = e, this.didChangeAttributes(), (i = this.previewDelegate) === null || i === void 0 || (s = i.attachmentDidChangeAttributes) === null || s === void 0 || s.call(i, this), (r = this.delegate) === null || r === void 0 || (o = r.attachmentDidChangeAttributes) === null || o === void 0 ? void 0 : o.call(r, this);
  }
  didChangeAttributes() {
    if (this.isPreviewable()) return this.preloadURL();
  }
  isPending() {
    return this.file != null && !(this.getURL() || this.getHref());
  }
  isPreviewable() {
    return this.attributes.has("previewable") ? this.attributes.get("previewable") : oi.previewablePattern.test(this.getContentType());
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
    return typeof t == "number" ? Qo.formatter(t) : "";
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
    var e, i, s, r;
    if (t !== this.getPreviewURL()) return this.previewURL = t, (e = this.previewDelegate) === null || e === void 0 || (i = e.attachmentDidChangeAttributes) === null || i === void 0 || i.call(e, this), (s = this.delegate) === null || s === void 0 || (r = s.attachmentDidChangePreviewURL) === null || r === void 0 ? void 0 : r.call(s, this);
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
      return this.preloadingURL = t, new Aa(t).then(((i) => {
        let { width: s, height: r } = i;
        return this.getWidth() && this.getHeight() || this.setAttributes({ width: s, height: r }), this.preloadingURL = null, this.setPreviewURL(t), e?.();
      })).catch((() => (this.preloadingURL = null, e?.())));
  }
}
dt(oi, "previewablePattern", /^image(\/(gif|png|webp|jpe?g)|$)/);
class ti extends We {
  static fromJSON(t) {
    return new this(oi.fromJSON(t.attachment), t.attributes);
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
class Ws extends We {
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
We.registerType("string", Ws);
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
    return new this.constructor(qs(this.objects, ...e));
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
    const [i, s] = this.splitObjectAtPosition(e);
    return new this.constructor(i).insertSplittableListAtIndex(t, s);
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
    const [e, i, s] = this.splitObjectsAtRange(t);
    return new this.constructor(e.slice(i, s + 1));
  }
  selectSplittableList(t) {
    const e = this.objects.filter(((i) => t(i)));
    return new this.constructor(e);
  }
  removeObjectsInRange(t) {
    const [e, i, s] = this.splitObjectsAtRange(t);
    return new this.constructor(e).splice(i, s - i + 1);
  }
  transformObjectsInRange(t, e) {
    const [i, s, r] = this.splitObjectsAtRange(t), o = i.map(((a, l) => s <= l && l <= r ? e(a) : a));
    return new this.constructor(o);
  }
  splitObjectsAtRange(t) {
    let e, [i, s, r] = this.splitObjectAtPosition(bc(t));
    return [i, e] = new this.constructor(i).splitObjectAtPosition(vc(t) + r), [i, s, e - 1];
  }
  getObjectAtPosition(t) {
    const { index: e } = this.findIndexAndOffsetAtPosition(t);
    return this.objects[e];
  }
  splitObjectAtPosition(t) {
    let e, i;
    const { index: s, offset: r } = this.findIndexAndOffsetAtPosition(t), o = this.objects.slice(0);
    if (s != null) if (r === 0) e = s, i = 0;
    else {
      const a = this.getObjectAtIndex(s), [l, c] = a.splitAtOffset(r);
      o.splice(s, 1, l, c), e = s + 1, i = l.getLength() - r;
    }
    else e = o.length, i = 0;
    return [o, e, i];
  }
  consolidate() {
    const t = [];
    let e = this.objects[0];
    return this.objects.slice(1).forEach(((i) => {
      var s, r;
      (s = (r = e).canBeConsolidatedWith) !== null && s !== void 0 && s.call(r, i) ? e = e.consolidateWith(i) : (t.push(e), e = i);
    })), e && t.push(e), new this.constructor(t);
  }
  consolidateFromIndexToIndex(t, e) {
    const i = this.objects.slice(0).slice(t, e + 1), s = new this.constructor(i).consolidate().toArray();
    return this.splice(t, i.length, ...s);
  }
  findIndexAndOffsetAtPosition(t) {
    let e, i = 0;
    for (e = 0; e < this.objects.length; e++) {
      const s = i + this.objects[e].getLength();
      if (i <= t && t < s) return { index: e, offset: t - i };
      i = s;
    }
    return { index: null, offset: null };
  }
  findPositionAtIndexAndOffset(t, e) {
    let i = 0;
    for (let s = 0; s < this.objects.length; s++) {
      const r = this.objects[s];
      if (s < t) i += r.getLength();
      else if (s === t) {
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
    return super.isEqualTo(...arguments) || gc(this.objects, t?.objects);
  }
  contentsForInspection() {
    return { objects: "[".concat(this.objects.map(((t) => t.inspect())).join(", "), "]") };
  }
}
const gc = function(n) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (n.length !== t.length) return !1;
  let e = !0;
  for (let i = 0; i < n.length; i++) {
    const s = n[i];
    e && !s.isEqualTo(t[i]) && (e = !1);
  }
  return e;
}, bc = (n) => n[0], vc = (n) => n[1];
class zt extends je {
  static textForAttachmentWithAttributes(t, e) {
    return new this([new ti(t, e)]);
  }
  static textForStringWithAttributes(t, e) {
    return new this([new Ws(t, e)]);
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
    const i = this.getTextAtRange(t), s = i.getLength();
    return t[0] < e && (e -= s), this.removeTextAtRange(t).insertTextAtPosition(i, e);
  }
  addAttributeAtRange(t, e, i) {
    const s = {};
    return s[t] = e, this.addAttributesAtRange(s, i);
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
    let i, s = i = e;
    const r = this.getLength();
    for (; s > 0 && this.getCommonAttributesAtRange([s - 1, i])[t]; ) s--;
    for (; i < r && this.getCommonAttributesAtRange([e, i + 1])[t]; ) i++;
    return [s, i];
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
    for (const s of this.pieceList.toArray()) {
      var i;
      if (((i = s.attachment) === null || i === void 0 ? void 0 : i.id) === t) return { attachment: s.attachment, position: e };
      e += s.length;
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
    return Sl(this.toString());
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
    super(...arguments), this.text = yc(t || new zt()), this.attributes = e || [], this.htmlAttributes = i || {};
  }
  isEmpty() {
    return this.text.isBlockBreak();
  }
  isEqualTo(t) {
    return !!super.isEqualTo(t) || this.text.isEqualTo(t?.text) && He(this.attributes, t?.attributes) && ri(this.htmlAttributes, t?.htmlAttributes);
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
    const e = this.attributes.concat(Or(t));
    return this.copyWithAttributes(e);
  }
  addHTMLAttribute(t, e) {
    const i = Object.assign({}, this.htmlAttributes, { [t]: e });
    return new Qt(this.text, this.attributes, i);
  }
  removeAttribute(t) {
    const { listAttribute: e } = Z(t), i = Br(Br(this.attributes, t), e);
    return this.copyWithAttributes(i);
  }
  removeLastAttribute() {
    return this.removeAttribute(this.getLastAttribute());
  }
  getLastAttribute() {
    return Mr(this.attributes);
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
    return Mr(this.getNestableAttributes());
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
      const e = this.attributes.lastIndexOf(t), i = qs(this.attributes, e + 1, 0, ...Or(t));
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
    let s;
    switch (t) {
      case "forward":
        s = i.indexOf(`
`, e);
        break;
      case "backward":
        s = i.slice(0, e).lastIndexOf(`
`);
    }
    if (s !== -1) return s;
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
    return Ea(this.text) ? this.text.getTextAtRange([0, this.getBlockBreakPosition()]) : this.text.copy();
  }
  canBeGrouped(t) {
    return this.attributes[t];
  }
  canBeGroupedWith(t, e) {
    const i = t.getAttributes(), s = i[e], r = this.attributes[e];
    return r === s && !(Z(r).group === !1 && !(() => {
      if (!$i) {
        $i = [];
        for (const o in mt) {
          const { listAttribute: a } = mt[o];
          a != null && $i.push(a);
        }
      }
      return $i;
    })().includes(i[e + 1])) && (this.getDirection() === t.getDirection() || t.isEmpty());
  }
}
const yc = function(n) {
  return n = _c(n), n = Ec(n);
}, _c = function(n) {
  let t = !1;
  const e = n.getPieces();
  let i = e.slice(0, e.length - 1);
  const s = e[e.length - 1];
  return s ? (i = i.map(((r) => r.isBlockBreak() ? (t = !0, xc(r)) : r)), t ? new zt([...i, s]) : n) : n;
}, Ac = zt.textForStringWithAttributes(`
`, { blockBreak: !0 }), Ec = function(n) {
  return Ea(n) ? n : n.appendText(Ac);
}, Ea = function(n) {
  const t = n.getLength();
  return t === 0 ? !1 : n.getTextAtRange([t - 1, t]).isBlockBreak();
}, xc = (n) => n.copyWithoutAttribute("blockBreak"), Or = function(n) {
  const { listAttribute: t } = Z(n);
  return t ? [t, n] : [n];
}, Mr = (n) => n.slice(-1)[0], Br = function(n, t) {
  const e = n.lastIndexOf(t);
  return e === -1 ? n : qs(n, e, 1);
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
    const e = new Ol(t.getObjects());
    return this.copyUsingObjectMap(e);
  }
  copyUsingObjectMap(t) {
    const e = this.getBlocks().map(((i) => t.find(i) || i.copyUsingObjectMap(t)));
    return new this.constructor(e);
  }
  copyWithBaseBlockAttributes() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    const e = this.getBlocks().map(((i) => {
      const s = t.concat(i.getAttributes());
      return i.copyWithAttributes(s);
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
    let [s] = e;
    const { index: r, offset: o } = this.locationFromPosition(s);
    let a = this;
    const l = this.getBlockAtPosition(s);
    return ue(e) && l.isEmpty() && !l.hasAttributes() ? a = new this.constructor(a.blockList.removeObjectAtIndex(r)) : l.getBlockBreakPosition() === o && s++, a = a.removeTextAtRange(e), new this.constructor(a.blockList.insertSplittableListAtPosition(i, s));
  }
  mergeDocumentAtRange(t, e) {
    let i, s;
    e = $(e);
    const [r] = e, o = this.locationFromPosition(r), a = this.getBlockAtIndex(o.index).getAttributes(), l = t.getBaseBlockAttributes(), c = a.slice(-l.length);
    if (He(l, c)) {
      const b = a.slice(0, -l.length);
      i = t.copyWithBaseBlockAttributes(b);
    } else i = t.copy({ consolidateBlocks: !0 }).copyWithBaseBlockAttributes(a);
    const h = i.getBlockCount(), g = i.getBlockAtIndex(0);
    if (He(a, g.getAttributes())) {
      const b = g.getTextWithoutBlockBreak();
      if (s = this.insertTextAtRange(b, e), h > 1) {
        i = new this.constructor(i.getBlocks().slice(1));
        const m = r + b.getLength();
        s = s.insertDocumentAtRange(i, m);
      }
    } else s = this.insertDocumentAtRange(i, e);
    return s;
  }
  insertTextAtRange(t, e) {
    e = $(e);
    const [i] = e, { index: s, offset: r } = this.locationFromPosition(i), o = this.removeTextAtRange(e);
    return new this.constructor(o.blockList.editObjectAtIndex(s, ((a) => a.copyWithText(a.text.insertTextAtPosition(t, r)))));
  }
  removeTextAtRange(t) {
    let e;
    t = $(t);
    const [i, s] = t;
    if (ue(t)) return this;
    const [r, o] = Array.from(this.locationRangeFromRange(t)), a = r.index, l = r.offset, c = this.getBlockAtIndex(a), h = o.index, g = o.offset, b = this.getBlockAtIndex(h);
    if (s - i == 1 && c.getBlockBreakPosition() === l && b.getBlockBreakPosition() !== g && b.text.getStringAtPosition(g) === `
`) e = this.blockList.editObjectAtIndex(h, ((m) => m.copyWithText(m.text.removeTextAtRange([g, g + 1]))));
    else {
      let m;
      const v = c.text.getTextAtRange([0, l]), f = b.text.getTextAtRange([g, b.getLength()]), A = v.appendText(f);
      m = a !== h && l === 0 && c.getAttributeLevel() >= b.getAttributeLevel() ? b.copyWithText(A) : c.copyWithText(A);
      const w = h + 1 - a;
      e = this.blockList.splice(a, w, m);
    }
    return new this.constructor(e);
  }
  moveTextFromRangeToPosition(t, e) {
    let i;
    t = $(t);
    const [s, r] = t;
    if (s <= e && e <= r) return this;
    let o = this.getDocumentAtRange(t), a = this.removeTextAtRange(t);
    const l = s < e;
    l && (e -= o.getLength());
    const [c, ...h] = o.getBlocks();
    return h.length === 0 ? (i = c.getTextWithoutBlockBreak(), l && (e += 1)) : i = c.text, a = a.insertTextAtRange(i, e), h.length === 0 ? a : (o = new this.constructor(h), e += i.getLength(), a.insertDocumentAtRange(o, e));
  }
  addAttributeAtRange(t, e, i) {
    let { blockList: s } = this;
    return this.eachBlockAtRange(i, ((r, o, a) => s = s.editObjectAtIndex(a, (function() {
      return Z(t) ? r.addAttribute(t, e) : o[0] === o[1] ? r : r.copyWithText(r.text.addAttributeAtRange(t, e, o));
    })))), new this.constructor(s);
  }
  addAttribute(t, e) {
    let { blockList: i } = this;
    return this.eachBlock(((s, r) => i = i.editObjectAtIndex(r, (() => s.addAttribute(t, e))))), new this.constructor(i);
  }
  removeAttributeAtRange(t, e) {
    let { blockList: i } = this;
    return this.eachBlockAtRange(e, (function(s, r, o) {
      Z(t) ? i = i.editObjectAtIndex(o, (() => s.removeAttribute(t))) : r[0] !== r[1] && (i = i.editObjectAtIndex(o, (() => s.copyWithText(s.text.removeAttributeAtRange(t, r)))));
    })), new this.constructor(i);
  }
  updateAttributesForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e), [s] = Array.from(i), { index: r } = this.locationFromPosition(s), o = this.getTextAtIndex(r);
    return new this.constructor(this.blockList.editObjectAtIndex(r, ((a) => a.copyWithText(o.updateAttributesForAttachment(t, e)))));
  }
  removeAttributeForAttachment(t, e) {
    const i = this.getRangeOfAttachment(e);
    return this.removeAttributeAtRange(t, i);
  }
  setHTMLAttributeAtPosition(t, e, i) {
    const s = this.getBlockAtPosition(t), r = s.addHTMLAttribute(e, i);
    return this.replaceBlock(s, r);
  }
  insertBlockBreakAtRange(t) {
    let e;
    t = $(t);
    const [i] = t, { offset: s } = this.locationFromPosition(i), r = this.removeTextAtRange(t);
    return s === 0 && (e = [new Qt()]), new this.constructor(r.blockList.insertSplittableListAtPosition(new dn(e), i));
  }
  applyBlockAttributeAtRange(t, e, i) {
    const s = this.expandRangeToLineBreaksAndSplitBlocks(i);
    let r = s.document;
    i = s.range;
    const o = Z(t);
    if (o.listAttribute) {
      r = r.removeLastListAttributeAtRange(i, { exceptAttributeName: t });
      const a = r.convertLineBreaksToBlockBreaksInRange(i);
      r = a.document, i = a.range;
    } else r = o.exclusive ? r.removeBlockAttributesAtRange(i) : o.terminal ? r.removeLastTerminalAttributeAtRange(i) : r.consolidateBlocksAtRange(i);
    return r.addAttributeAtRange(t, e, i);
  }
  removeLastListAttributeAtRange(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, { blockList: i } = this;
    return this.eachBlockAtRange(t, (function(s, r, o) {
      const a = s.getLastAttribute();
      a && Z(a).listAttribute && a !== e.exceptAttributeName && (i = i.editObjectAtIndex(o, (() => s.removeAttribute(a))));
    })), new this.constructor(i);
  }
  removeLastTerminalAttributeAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, (function(i, s, r) {
      const o = i.getLastAttribute();
      o && Z(o).terminal && (e = e.editObjectAtIndex(r, (() => i.removeAttribute(o))));
    })), new this.constructor(e);
  }
  removeBlockAttributesAtRange(t) {
    let { blockList: e } = this;
    return this.eachBlockAtRange(t, (function(i, s, r) {
      i.hasAttributes() && (e = e.editObjectAtIndex(r, (() => i.copyWithoutAttributes())));
    })), new this.constructor(e);
  }
  expandRangeToLineBreaksAndSplitBlocks(t) {
    let e;
    t = $(t);
    let [i, s] = t;
    const r = this.locationFromPosition(i), o = this.locationFromPosition(s);
    let a = this;
    const l = a.getBlockAtIndex(r.index);
    if (r.offset = l.findLineBreakInDirectionFromPosition("backward", r.offset), r.offset != null && (e = a.positionFromLocation(r), a = a.insertBlockBreakAtRange([e, e + 1]), o.index += 1, o.offset -= a.getBlockAtIndex(r.index).getLength(), r.index += 1), r.offset = 0, o.offset === 0 && o.index > r.index) o.index -= 1, o.offset = a.getBlockAtIndex(o.index).getBlockBreakPosition();
    else {
      const c = a.getBlockAtIndex(o.index);
      c.text.getStringAtRange([o.offset - 1, o.offset]) === `
` ? o.offset -= 1 : o.offset = c.findLineBreakInDirectionFromPosition("forward", o.offset), o.offset !== c.getBlockBreakPosition() && (e = a.positionFromLocation(o), a = a.insertBlockBreakAtRange([e, e + 1]));
    }
    return i = a.positionFromLocation(r), s = a.positionFromLocation(o), { document: a, range: t = $([i, s]) };
  }
  convertLineBreaksToBlockBreaksInRange(t) {
    t = $(t);
    let [e] = t;
    const i = this.getStringAtRange(t).slice(0, -1);
    let s = this;
    return i.replace(/.*?\n/g, (function(r) {
      e += r.length, s = s.insertBlockBreakAtRange([e - 1, e]);
    })), { document: s, range: t };
  }
  consolidateBlocksAtRange(t) {
    t = $(t);
    const [e, i] = t, s = this.locationFromPosition(e).index, r = this.locationFromPosition(i).index;
    return new this.constructor(this.blockList.consolidateFromIndexToIndex(s, r));
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
    let i, s;
    t = $(t);
    const [r, o] = t, a = this.locationFromPosition(r), l = this.locationFromPosition(o);
    if (a.index === l.index) return i = this.getBlockAtIndex(a.index), s = [a.offset, l.offset], e(i, s, a.index);
    for (let c = a.index; c <= l.index; c++) if (i = this.getBlockAtIndex(c), i) {
      switch (c) {
        case a.index:
          s = [a.offset, i.text.getLength()];
          break;
        case l.index:
          s = [0, l.offset];
          break;
        default:
          s = [0, i.text.getLength()];
      }
      e(i, s, c);
    }
  }
  getCommonAttributesAtRange(t) {
    t = $(t);
    const [e] = t;
    if (ue(t)) return this.getCommonAttributesAtPosition(e);
    {
      const i = [], s = [];
      return this.eachBlockAtRange(t, (function(r, o) {
        if (o[0] !== o[1]) return i.push(r.text.getCommonAttributesAtRange(o)), s.push(Nr(r));
      })), Et.fromCommonAttributesOfObjects(i).merge(Et.fromCommonAttributesOfObjects(s)).toObject();
    }
  }
  getCommonAttributesAtPosition(t) {
    let e, i;
    const { index: s, offset: r } = this.locationFromPosition(t), o = this.getBlockAtIndex(s);
    if (!o) return {};
    const a = Nr(o), l = o.text.getAttributesAtPosition(r), c = o.text.getAttributesAtPosition(r - 1), h = Object.keys(qe).filter(((g) => qe[g].inheritable));
    for (e in c) i = c[e], (i === l[e] || h.includes(e)) && (a[e] = i);
    return a;
  }
  getRangeOfCommonAttributeAtPosition(t, e) {
    const { index: i, offset: s } = this.locationFromPosition(e), r = this.getTextAtIndex(i), [o, a] = Array.from(r.getExpandedRangeForAttributeAtOffset(t, s)), l = this.positionFromLocation({ index: i, offset: o }), c = this.positionFromLocation({ index: i, offset: a });
    return $([l, c]);
  }
  getBaseBlockAttributes() {
    let t = this.getBlockAtIndex(0).getAttributes();
    for (let e = 1; e < this.getBlockCount(); e++) {
      const i = this.getBlockAtIndex(e).getAttributes(), s = Math.min(t.length, i.length);
      t = (() => {
        const r = [];
        for (let o = 0; o < s && i[o] === t[o]; o++) r.push(i[o]);
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
    for (let s = 0; s < i.length; s++) {
      const { text: r } = i[s], o = r.getRangeOfAttachment(t);
      if (o) return $([e + o[0], e + o[1]]);
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
    return this.getBlocks().forEach(((s) => {
      const r = s.getLength();
      s.hasAttribute(t) && i.push([e, e + r]), e += r;
    })), i;
  }
  findRangesForTextAttribute(t) {
    let { withValue: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = 0, s = [];
    const r = [];
    return this.getPieces().forEach(((o) => {
      const a = o.getLength();
      (function(l) {
        return e ? l.getAttribute(t) === e : l.hasAttribute(t);
      })(o) && (s[1] === i ? s[1] = i + a : r.push(s = [i, i + a])), i += a;
    })), r;
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
    const [e, i] = Array.from(t), s = this.locationFromPosition(e), r = this.locationFromPosition(i);
    return $([s, r]);
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
const Nr = function(n) {
  const t = {}, e = n.getLastAttribute();
  return e && (t[e] = !0), t;
}, $n = function(n) {
  let t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  return { string: n = yi(n), attributes: t, type: "string" };
}, Pr = (n, t) => {
  try {
    return JSON.parse(n.getAttribute("data-trix-".concat(t)));
  } catch {
    return {};
  }
};
class Di extends et {
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
      const t = an(this.containerElement, { usingFilter: Lc });
      for (; t.nextNode(); ) this.processNode(t.currentNode);
      return this.translateBlockElementMarginsToNewlines();
    } finally {
      this.removeHiddenContainer();
    }
  }
  createHiddenContainer() {
    return this.referenceElement ? (this.containerElement = this.referenceElement.cloneNode(!1), this.containerElement.removeAttribute("id"), this.containerElement.setAttribute("data-trix-internal", ""), this.containerElement.style.display = "none", this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling)) : (this.containerElement = D({ tagName: "div", style: { display: "none" } }), document.body.appendChild(this.containerElement));
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
      const s = this.getBlockAttributes(e), r = this.getBlockHTMLAttributes(e);
      He(s, (i = this.currentBlock) === null || i === void 0 ? void 0 : i.attributes) || (this.currentBlock = this.appendBlockForAttributesWithElement(s, e, r), this.currentBlockElement = e);
    }
  }
  appendBlockForElement(t) {
    const e = this.isBlockElement(t), i = Me(this.currentBlockElement, t);
    if (e && !this.isBlockElement(t.firstChild)) {
      if (!this.isInsignificantTextNode(t.firstChild) || !this.isBlockElement(t.firstElementChild)) {
        const s = this.getBlockAttributes(t), r = this.getBlockHTMLAttributes(t);
        if (t.firstChild) {
          if (i && He(s, this.currentBlock.attributes)) return this.appendStringWithAttributes(`
`);
          this.currentBlock = this.appendBlockForAttributesWithElement(s, t, r), this.currentBlockElement = t;
        }
      }
    } else if (this.currentBlockElement && !i && !e) {
      const s = this.findParentBlockElement(t);
      if (s) return this.appendBlockForElement(s);
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
    return Fr(t.parentNode) || (e = $s(e), xa((i = t.previousSibling) === null || i === void 0 ? void 0 : i.textContent) && (e = wc(e))), this.appendStringWithAttributes(e, this.getTextAttributes(t.parentNode));
  }
  processElement(t) {
    let e;
    if (Ne(t)) {
      if (e = Pr(t, "attachment"), Object.keys(e).length) {
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
        const i = ((s) => {
          const r = s.getAttribute("width"), o = s.getAttribute("height"), a = {};
          return r && (a.width = parseInt(r, 10)), o && (a.height = parseInt(o, 10)), a;
        })(t);
        for (const s in i) {
          const r = i[s];
          e[s] = r;
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
    const s = (function() {
      return { text: [], attributes: arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, htmlAttributes: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {} };
    })(t, i);
    return this.blocks.push(s), s;
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
    const { text: i } = this.blocks[e], s = i[i.length - 1];
    if (s?.type !== "string") return i.push($n(t));
    s.string += t;
  }
  prependStringToTextAtIndex(t, e) {
    const { text: i } = this.blocks[e], s = i[0];
    if (s?.type !== "string") return i.unshift($n(t));
    s.string = t + s.string;
  }
  getTextAttributes(t) {
    let e;
    const i = {};
    for (const s in qe) {
      const r = qe[s];
      if (r.tagName && Ee(t, { matchingSelector: r.tagName, untilNode: this.containerElement })) i[s] = !0;
      else if (r.parser) {
        if (e = r.parser(t), e) {
          let o = !1;
          for (const a of this.findBlockElementAncestors(t)) if (r.parser(a) === e) {
            o = !0;
            break;
          }
          o || (i[s] = e);
        }
      } else r.styleProperty && (e = t.style[r.styleProperty], e && (i[s] = e));
    }
    if (Ne(t)) {
      const s = Pr(t, "attributes");
      for (const r in s) e = s[r], i[r] = e;
    }
    return i;
  }
  getBlockAttributes(t) {
    const e = [];
    for (; t && t !== this.containerElement; ) {
      for (const s in mt) {
        const r = mt[s];
        var i;
        r.parse !== !1 && ht(t) === r.tagName && ((i = r.test) !== null && i !== void 0 && i.call(r, t) || !r.test) && (e.push(s), r.listAttribute && e.push(r.listAttribute));
      }
      t = t.parentNode;
    }
    return e.reverse();
  }
  getBlockHTMLAttributes(t) {
    const e = {}, i = Object.values(mt).find(((s) => s.tagName === ht(t)));
    return (i?.htmlAttributes || []).forEach(((s) => {
      t.hasAttribute(s) && (e[s] = t.getAttribute(s));
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
    if (t?.nodeType !== Node.TEXT_NODE || !Cc(t.data)) return;
    const { parentNode: e, previousSibling: i, nextSibling: s } = t;
    return Sc(e.previousSibling) && !this.isBlockElement(e.previousSibling) || Fr(e) ? void 0 : !i || this.isBlockElement(i) || !s || this.isBlockElement(s);
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
    if (e && e.textContent && !Ai().includes(ht(e)) && !this.processedElements.includes(e)) return qr(e);
  }
  getMarginOfDefaultBlockElement() {
    const t = D(mt.default.tagName);
    return this.containerElement.appendChild(t), qr(t);
  }
}
const Fr = function(n) {
  const { whiteSpace: t } = window.getComputedStyle(n);
  return ["pre", "pre-wrap", "pre-line"].includes(t);
}, Sc = (n) => n && !xa(n.textContent), qr = function(n) {
  const t = window.getComputedStyle(n);
  if (t.display === "block") return { top: parseInt(t.marginTop), bottom: parseInt(t.marginBottom) };
}, Lc = function(n) {
  return ht(n) === "style" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, wc = (n) => n.replace(new RegExp("^".concat(Us.source, "+")), ""), Cc = (n) => new RegExp("^".concat(Us.source, "*$")).test(n), xa = (n) => /\s$/.test(n), Tc = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"], Ls = "data-trix-serialized-attributes", kc = "[".concat(Ls, "]"), Rc = new RegExp("<!--block-->", "g"), Ic = { "application/json": function(n) {
  let t;
  if (n instanceof Rt) t = n;
  else {
    if (!(n instanceof HTMLElement)) throw new Error("unserializable object");
    t = Di.parse(n.innerHTML).getDocument();
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
  })), Tc.forEach(((e) => {
    Array.from(t.querySelectorAll("[".concat(e, "]"))).forEach(((i) => {
      i.removeAttribute(e);
    }));
  })), Array.from(t.querySelectorAll(kc)).forEach(((e) => {
    try {
      const i = JSON.parse(e.getAttribute(Ls));
      e.removeAttribute(Ls);
      for (const s in i) {
        const r = i[s];
        e.setAttribute(s, r);
      }
    } catch {
    }
  })), t.innerHTML.replace(Rc, "");
} };
var Dc = Object.freeze({ __proto__: null });
class G extends et {
  constructor(t, e) {
    super(...arguments), this.attachmentManager = t, this.attachment = e, this.id = this.attachment.id, this.file = this.attachment.file;
  }
  remove() {
    return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
  }
}
G.proxyMethod("attachment.getAttribute"), G.proxyMethod("attachment.hasAttribute"), G.proxyMethod("attachment.setAttribute"), G.proxyMethod("attachment.getAttributes"), G.proxyMethod("attachment.setAttributes"), G.proxyMethod("attachment.isPending"), G.proxyMethod("attachment.isPreviewable"), G.proxyMethod("attachment.getURL"), G.proxyMethod("attachment.getPreviewURL"), G.proxyMethod("attachment.setPreviewURL"), G.proxyMethod("attachment.getHref"), G.proxyMethod("attachment.getFilename"), G.proxyMethod("attachment.getFilesize"), G.proxyMethod("attachment.getFormattedFilesize"), G.proxyMethod("attachment.getExtension"), G.proxyMethod("attachment.getContentType"), G.proxyMethod("attachment.getFile"), G.proxyMethod("attachment.setFile"), G.proxyMethod("attachment.releaseFile"), G.proxyMethod("attachment.getUploadProgress"), G.proxyMethod("attachment.setUploadProgress");
class Sa extends et {
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
class La {
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
    var e, i, s, r;
    let { document: o, selectedRange: a } = t;
    return (e = this.delegate) === null || e === void 0 || (i = e.compositionWillLoadSnapshot) === null || i === void 0 || i.call(e), this.setDocument(o ?? new Rt()), this.setSelection(a ?? [0, 0]), (s = this.delegate) === null || s === void 0 || (r = s.compositionDidLoadSnapshot) === null || r === void 0 ? void 0 : r.call(s);
  }
  insertText(t) {
    let { updatePosition: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { updatePosition: !0 };
    const i = this.getSelectedRange();
    this.setDocument(this.document.insertTextAtRange(t, i));
    const s = i[0], r = s + t.getLength();
    return e && this.setSelection(r), this.notifyDelegateOfInsertionAtRange([s, r]);
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
    const i = e[0], s = i + t.getLength();
    return this.setSelection(s), this.notifyDelegateOfInsertionAtRange([i, s]);
  }
  insertString(t, e) {
    const i = this.getCurrentTextAttributes(), s = zt.textForStringWithAttributes(t, i);
    return this.insertText(s, e);
  }
  insertBlockBreak() {
    const t = this.getSelectedRange();
    this.setDocument(this.document.insertBlockBreakAtRange(t));
    const e = t[0], i = e + 1;
    return this.setSelection(i), this.notifyDelegateOfInsertionAtRange([e, i]);
  }
  insertLineBreak() {
    const t = new La(this);
    if (t.shouldDecreaseListLevel()) return this.decreaseListLevel(), this.setSelection(t.startPosition);
    if (t.shouldPrependListItem()) {
      const e = new Rt([t.block.copyWithoutText()]);
      return this.insertDocument(e);
    }
    return t.shouldInsertBlockBreak() ? this.insertBlockBreak() : t.shouldRemoveLastBlockAttribute() ? this.removeLastBlockAttribute() : t.shouldBreakFormattedBlock() ? this.breakFormattedBlock(t) : this.insertString(`
`);
  }
  insertHTML(t) {
    const e = Di.parse(t, { purifyOptions: { SAFE_FOR_XML: !0 } }).getDocument(), i = this.getSelectedRange();
    this.setDocument(this.document.mergeDocumentAtRange(e, i));
    const s = i[0], r = s + e.getLength() - 1;
    return this.setSelection(r), this.notifyDelegateOfInsertionAtRange([s, r]);
  }
  replaceHTML(t) {
    const e = Di.parse(t).getDocument().copyUsingObjectsFromDocument(this.document), i = this.getLocationRange({ strict: !1 }), s = this.document.rangeFromLocationRange(i);
    return this.setDocument(e), this.setSelection(s);
  }
  insertFile(t) {
    return this.insertFiles([t]);
  }
  insertFiles(t) {
    const e = [];
    return Array.from(t).forEach(((i) => {
      var s;
      if ((s = this.delegate) !== null && s !== void 0 && s.compositionShouldAcceptFile(i)) {
        const r = oi.attachmentForFile(i);
        e.push(r);
      }
    })), this.insertAttachments(e);
  }
  insertAttachment(t) {
    return this.insertAttachments([t]);
  }
  insertAttachments(t) {
    let e = new zt();
    return Array.from(t).forEach(((i) => {
      var s;
      const r = i.getType(), o = (s = Bs[r]) === null || s === void 0 ? void 0 : s.presentation, a = this.getCurrentTextAttributes();
      o && (a.presentation = o);
      const l = zt.textForAttachmentWithAttributes(i, a);
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
    let e, i, s, { length: r } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const o = this.getLocationRange();
    let a = this.getSelectedRange();
    const l = ue(a);
    if (l ? i = t === "backward" && o[0].offset === 0 : s = o[0].index !== o[1].index, i && this.canDecreaseBlockAttributeLevel()) {
      const c = this.getBlock();
      if (c.isListItem() ? this.decreaseListLevel() : this.decreaseBlockAttributeLevel(), this.setSelection(a[0]), c.isEmpty()) return !1;
    }
    return l && (a = this.getExpandedRangeInDirection(t, { length: r }), t === "backward" && (e = this.getAttachmentAtRange(a))), e ? (this.editAttachment(e), !1) : (this.setDocument(this.document.removeTextAtRange(a)), this.setSelection(a[0]), !i && !s && void 0);
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
    var s;
    const r = this.document.getBlockAtPosition(t), o = (s = Z(r.getLastAttribute())) === null || s === void 0 ? void 0 : s.htmlAttributes;
    if (r && o != null && o.includes(e)) {
      const a = this.document.setHTMLAttributeAtPosition(t, e, i);
      this.setDocument(a);
    }
  }
  setTextAttribute(t, e) {
    const i = this.getSelectedRange();
    if (!i) return;
    const [s, r] = Array.from(i);
    if (s !== r) return this.setDocument(this.document.addAttributeAtRange(t, e, i));
    if (t === "href") {
      const o = zt.textForStringWithAttributes(e, { href: e });
      return this.insertText(o);
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
          let s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
          return He((arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).slice(0, s.length), s);
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
    const s = this.getBlock().getAttributeLevel();
    let r = this.document.getBlockAtIndex(i + 1);
    for (; r && r.isListItem() && !(r.getAttributeLevel() <= s); ) i++, r = this.document.getBlockAtIndex(i + 1);
    t = this.document.positionFromLocation({ index: e, offset: 0 });
    const o = this.document.positionFromLocation({ index: i, offset: 0 });
    return this.setDocument(this.document.removeLastListAttributeAtRange([t, o]));
  }
  updateCurrentAttributes() {
    const t = this.getSelectedRange({ ignoreLock: !0 });
    if (t) {
      const e = this.document.getCommonAttributesAtRange(t);
      if (Array.from(_s()).forEach(((i) => {
        e[i] || this.canSetCurrentAttribute(i) || (e[i] = !1);
      })), !ri(e, this.currentAttributes)) return this.currentAttributes = e, this.notifyDelegateOfCurrentAttributesChange();
    }
  }
  getCurrentAttributes() {
    return Zo.call({}, this.currentAttributes);
  }
  getCurrentTextAttributes() {
    const t = {};
    for (const e in this.currentAttributes) {
      const i = this.currentAttributes[e];
      i !== !1 && As(e) && (t[e] = i);
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
    let { length: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, [i, s] = Array.from(this.getSelectedRange());
    return t === "backward" ? e ? i -= e : i = this.translateUTF16PositionFromOffset(i, -1) : e ? s += e : s = this.translateUTF16PositionFromOffset(s, 1), $([i, s]);
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
      const s = this.getSelectedRange();
      i = this.getExpandedRangeInDirection(t), e = !ln(s, i);
    }
    if (t === "backward" ? this.setSelectedRange(i[0]) : this.setSelectedRange(i[1]), e) {
      const s = this.getAttachmentAtRange(i);
      if (s) return this.editAttachment(s);
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
      let s = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
      const o = [], a = [], l = /* @__PURE__ */ new Set();
      s.forEach(((h) => {
        l.add(h);
      }));
      const c = /* @__PURE__ */ new Set();
      return r.forEach(((h) => {
        c.add(h), l.has(h) || o.push(h);
      })), s.forEach(((h) => {
        c.has(h) || a.push(h);
      })), { added: o, removed: a };
    })(this.attachments, t);
    return this.attachments = t, Array.from(i).forEach(((s) => {
      var r, o;
      s.delegate = null, (r = this.delegate) === null || r === void 0 || (o = r.compositionDidRemoveAttachment) === null || o === void 0 || o.call(r, s);
    })), (() => {
      const s = [];
      return Array.from(e).forEach(((r) => {
        var o, a;
        r.delegate = this, s.push((o = this.delegate) === null || o === void 0 || (a = o.compositionDidAddAttachment) === null || a === void 0 ? void 0 : a.call(o, r));
      })), s;
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
    var i, s;
    if (t !== this.editingAttachment) return this.stopEditingAttachment(), this.editingAttachment = t, (i = this.delegate) === null || i === void 0 || (s = i.compositionDidStartEditingAttachment) === null || s === void 0 ? void 0 : s.call(i, this.editingAttachment, e);
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
    let s = t.startPosition, r = [s - 1, s];
    i.getBlockBreakPosition() === t.startLocation.offset ? (i.breaksOnReturn() && t.nextCharacter === `
` ? s += 1 : e = e.removeTextAtRange(r), r = [s, s]) : t.nextCharacter === `
` ? t.previousCharacter === `
` ? r = [s - 1, s + 1] : (r = [s, s + 1], s += 1) : t.startLocation.offset - 1 != 0 && (s += 1);
    const o = new Rt([i.removeLastAttribute().copyWithoutText()]);
    return this.setDocument(e.insertDocumentAtRange(o, r)), this.setSelection(s);
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
    const i = this.document.toUTF16String(), s = i.offsetFromUCS2Offset(t);
    return i.offsetToUCS2Offset(s + e);
  }
}
_e.proxyMethod("getSelectionManager().getPointRange"), _e.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"), _e.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange"), _e.proxyMethod("getSelectionManager().locationIsCursorTarget"), _e.proxyMethod("getSelectionManager().selectionIsExpanded"), _e.proxyMethod("delegate?.getSelectionManager");
class ws extends et {
  constructor(t) {
    super(...arguments), this.composition = t, this.undoEntries = [], this.redoEntries = [];
  }
  recordUndoEntry(t) {
    let { context: e, consolidatable: i } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const s = this.undoEntries.slice(-1)[0];
    if (!i || !Oc(s, t, e)) {
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
    return { description: t?.toString(), context: JSON.stringify(e), snapshot: this.composition.getSnapshot() };
  }
}
const Oc = (n, t, e) => n?.description === t?.toString() && n?.context === JSON.stringify(e), jn = "attachmentGallery";
class wa {
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
const Ca = function(n) {
  const t = new wa(n);
  return t.perform(), t.getSnapshot();
}, Mc = [Ca];
class Ta {
  constructor(t, e, i) {
    this.insertFiles = this.insertFiles.bind(this), this.composition = t, this.selectionManager = e, this.element = i, this.undoManager = new ws(this.composition), this.filters = Mc.slice(0);
  }
  loadDocument(t) {
    return this.loadSnapshot({ document: t, selectedRange: [0, 0] });
  }
  loadHTML() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    const e = Di.parse(t, { referenceElement: this.element }).getDocument();
    return this.loadDocument(e);
  }
  loadJSON(t) {
    let { document: e, selectedRange: i } = t;
    return e = Rt.fromJSON(e), this.loadSnapshot({ document: e, selectedRange: i });
  }
  loadSnapshot(t) {
    return this.undoManager = new ws(this.composition), this.composition.loadSnapshot(t);
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
class ka {
  constructor(t) {
    this.element = t;
  }
  findLocationFromContainerAndOffset(t, e) {
    let { strict: i } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : { strict: !0 }, s = 0, r = !1;
    const o = { index: 0, offset: 0 }, a = this.findAttachmentElementParentForNode(t);
    a && (t = a.parentNode, e = wn(a));
    const l = an(this.element, { usingFilter: Ra });
    for (; l.nextNode(); ) {
      const c = l.currentNode;
      if (c === t && Ei(t)) {
        Xe(c) || (o.offset += e);
        break;
      }
      if (c.parentNode === t) {
        if (s++ === e) {
          !i && Tn(c, { strict: i }) && (r && o.index++, o.offset = 0, r = !0);
          break;
        }
      } else if (!Me(t, c) && s > 0) break;
      Tn(c, { strict: i }) ? (r && o.index++, o.offset = 0, r = !0) : o.offset += Vn(c);
    }
    return o;
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
    let [s, r] = this.findNodeAndOffsetFromLocation(t);
    if (s) {
      if (Ei(s)) Vn(s) === 0 ? (e = s.parentNode.parentNode, i = wn(s.parentNode), Xe(s, { name: "right" }) && i++) : (e = s, i = t.offset - r);
      else {
        if (e = s.parentNode, !Tn(s.previousSibling) && !Cn(e)) for (; s === e.lastChild && (s = e, e = e.parentNode, !Cn(e)); ) ;
        i = wn(s), t.offset !== 0 && i++;
      }
      return [e, i];
    }
  }
  findNodeAndOffsetFromLocation(t) {
    let e, i, s = 0;
    for (const r of this.getSignificantNodesForIndex(t.index)) {
      const o = Vn(r);
      if (t.offset <= s + o) if (Ei(r)) {
        if (e = r, i = s, t.offset === i && Xe(e)) break;
      } else e || (e = r, i = s);
      if (s += o, s > t.offset) break;
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
    const e = [], i = an(this.element, { usingFilter: Bc });
    let s = !1;
    for (; i.nextNode(); ) {
      const o = i.currentNode;
      var r;
      if (Ye(o)) {
        if (r != null ? r++ : r = 0, r === t) s = !0;
        else if (s) break;
      } else s && e.push(o);
    }
    return e;
  }
}
const Vn = function(n) {
  return n.nodeType === Node.TEXT_NODE ? Xe(n) ? 0 : n.textContent.length : ht(n) === "br" || Ne(n) ? 1 : 0;
}, Bc = function(n) {
  return Nc(n) === NodeFilter.FILTER_ACCEPT ? Ra(n) : NodeFilter.FILTER_REJECT;
}, Nc = function(n) {
  return ia(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
}, Ra = function(n) {
  return Ne(n.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
};
class Ia {
  createDOMRangeFromPoint(t) {
    let e, { x: i, y: s } = t;
    if (document.caretPositionFromPoint) {
      const { offsetNode: r, offset: o } = document.caretPositionFromPoint(i, s);
      return e = document.createRange(), e.setStart(r, o), e;
    }
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(i, s);
    if (document.body.createTextRange) {
      const r = xi();
      try {
        const o = document.body.createTextRange();
        o.moveToPoint(i, s), o.select();
      } catch {
      }
      return e = xi(), da(r), e;
    }
  }
  getClientRectsForDOMRange(t) {
    const e = Array.from(t.getClientRects());
    return [e[0], e[e.length - 1]];
  }
}
class Oe extends et {
  constructor(t) {
    super(...arguments), this.didMouseDown = this.didMouseDown.bind(this), this.selectionDidChange = this.selectionDidChange.bind(this), this.element = t, this.locationMapper = new ka(this.element), this.pointMapper = new Ia(), this.lockCount = 0, J("mousedown", { onElement: this.element, withCallback: this.didMouseDown });
  }
  getLocationRange() {
    let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return t.strict === !1 ? this.createLocationRangeFromDOMRange(xi()) : t.ignoreLock ? this.currentLocationRange : this.lockedLocationRange ? this.lockedLocationRange : this.currentLocationRange;
  }
  setLocationRange(t) {
    if (this.lockedLocationRange) return;
    t = $(t);
    const e = this.createDOMRangeFromLocationRange(t);
    e && (da(e), this.updateCurrentLocationRange(t));
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
    return (t = ca()) === null || t === void 0 ? void 0 : t.removeAllRanges();
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
    const s = t.collapsed ? void 0 : this.findLocationFromContainerAndOffset(t.endContainer, t.endOffset, e);
    return $([i, s]);
  }
  didMouseDown() {
    return this.pauseTemporarily();
  }
  pauseTemporarily() {
    let t;
    this.paused = !0;
    const e = () => {
      if (this.paused = !1, clearTimeout(i), Array.from(t).forEach(((s) => {
        s.destroy();
      })), Me(document, this.element)) return this.selectionDidChange();
    }, i = setTimeout(e, 200);
    t = ["mousemove", "keydown"].map(((s) => J(s, { onElement: document, withCallback: e })));
  }
  selectionDidChange() {
    if (!this.paused && !Ps(this.element)) return this.updateCurrentLocationRange();
  }
  updateCurrentLocationRange(t) {
    var e, i;
    if ((t ?? (t = this.createLocationRangeFromDOMRange(xi()))) && !ln(t, this.currentLocationRange)) return this.currentLocationRange = t, (e = this.delegate) === null || e === void 0 || (i = e.locationRangeDidChange) === null || i === void 0 ? void 0 : i.call(e, this.currentLocationRange.slice(0));
  }
  createDOMRangeFromLocationRange(t) {
    const e = this.findContainerAndOffsetFromLocation(t[0]), i = ue(t) ? e : this.findContainerAndOffsetFromLocation(t[1]) || e;
    if (e != null && i != null) {
      const s = document.createRange();
      return s.setStart(...Array.from(e || [])), s.setEnd(...Array.from(i || [])), s;
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
var Da = Object.freeze({ __proto__: null, Attachment: oi, AttachmentManager: Sa, AttachmentPiece: ti, Block: Qt, Composition: _e, Document: Rt, Editor: Ta, HTMLParser: Di, HTMLSanitizer: gn, LineBreakInsertion: La, LocationMapper: ka, ManagedAttachment: G, Piece: We, PointMapper: Ia, SelectionManager: Oe, SplittableList: dn, StringPiece: Ws, Text: zt, UndoManager: ws }), Pc = Object.freeze({ __proto__: null, ObjectView: Ve, AttachmentView: Vs, BlockView: va, DocumentView: bn, PieceView: ga, PreviewableAttachmentView: fa, TextView: ba });
const { lang: Wn, css: Ie, keyNames: Fc } = Ni, zn = function(n) {
  return function() {
    const t = n.apply(this, arguments);
    t.do(), this.undos || (this.undos = []), this.undos.push(t.undo);
  };
};
class Oa extends et {
  constructor(t, e, i) {
    let s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super(...arguments), dt(this, "makeElementMutable", zn((() => ({ do: () => {
      this.element.dataset.trixMutable = !0;
    }, undo: () => delete this.element.dataset.trixMutable })))), dt(this, "addToolbar", zn((() => {
      const r = D({ tagName: "div", className: Ie.attachmentToolbar, data: { trixMutable: !0 }, childNodes: D({ tagName: "div", className: "trix-button-row", childNodes: D({ tagName: "span", className: "trix-button-group trix-button-group--actions", childNodes: D({ tagName: "button", className: "trix-button trix-button--remove", textContent: Wn.remove, attributes: { title: Wn.remove }, data: { trixAction: "remove" } }) }) }) });
      return this.attachment.isPreviewable() && r.appendChild(D({ tagName: "div", className: Ie.attachmentMetadataContainer, childNodes: D({ tagName: "span", className: Ie.attachmentMetadata, childNodes: [D({ tagName: "span", className: Ie.attachmentName, textContent: this.attachment.getFilename(), attributes: { title: this.attachment.getFilename() } }), D({ tagName: "span", className: Ie.attachmentSize, textContent: this.attachment.getFormattedFilesize() })] }) })), J("click", { onElement: r, withCallback: this.didClickToolbar }), J("click", { onElement: r, matchingSelector: "[data-trix-action]", withCallback: this.didClickActionButton }), _i("trix-attachment-before-toolbar", { onElement: this.element, attributes: { toolbar: r, attachment: this.attachment } }), { do: () => this.element.appendChild(r), undo: () => xe(r) };
    }))), dt(this, "installCaptionEditor", zn((() => {
      const r = D({ tagName: "textarea", className: Ie.attachmentCaptionEditor, attributes: { placeholder: Wn.captionPlaceholder }, data: { trixMutable: !0 } });
      r.value = this.attachmentPiece.getCaption();
      const o = r.cloneNode();
      o.classList.add("trix-autoresize-clone"), o.tabIndex = -1;
      const a = function() {
        o.value = r.value, r.style.height = o.scrollHeight + "px";
      };
      J("input", { onElement: r, withCallback: a }), J("input", { onElement: r, withCallback: this.didInputCaption }), J("keydown", { onElement: r, withCallback: this.didKeyDownCaption }), J("change", { onElement: r, withCallback: this.didChangeCaption }), J("blur", { onElement: r, withCallback: this.didBlurCaption });
      const l = this.element.querySelector("figcaption"), c = l.cloneNode();
      return { do: () => {
        if (l.style.display = "none", c.appendChild(r), c.appendChild(o), c.classList.add("".concat(Ie.attachmentCaption, "--editing")), l.parentElement.insertBefore(c, l), a(), this.options.editCaption) return Hs((() => r.focus()));
      }, undo() {
        xe(c), l.style.display = null;
      } };
    }))), this.didClickToolbar = this.didClickToolbar.bind(this), this.didClickActionButton = this.didClickActionButton.bind(this), this.didKeyDownCaption = this.didKeyDownCaption.bind(this), this.didInputCaption = this.didInputCaption.bind(this), this.didChangeCaption = this.didChangeCaption.bind(this), this.didBlurCaption = this.didBlurCaption.bind(this), this.attachmentPiece = t, this.element = e, this.container = i, this.options = s, this.attachment = this.attachmentPiece.attachment, ht(this.element) === "a" && (this.element = this.element.firstChild), this.install();
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
      var t, e, i, s;
      this.pendingCaption = null, r ? (t = this.delegate) === null || t === void 0 || (e = t.attachmentEditorDidRequestUpdatingAttributesForAttachment) === null || e === void 0 || e.call(t, { caption: r }, this.attachment) : (i = this.delegate) === null || i === void 0 || (s = i.attachmentEditorDidRequestRemovingAttributeForAttachment) === null || s === void 0 || s.call(i, "caption", this.attachment);
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
    if (Fc[t.keyCode] === "return") return t.preventDefault(), this.savePendingCaption(), (e = this.delegate) === null || e === void 0 || (i = e.attachmentEditorDidRequestDeselectingAttachment) === null || i === void 0 ? void 0 : i.call(e, this.attachment);
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
class Ma extends et {
  constructor(t, e) {
    super(...arguments), this.didFocus = this.didFocus.bind(this), this.didBlur = this.didBlur.bind(this), this.didClickAttachment = this.didClickAttachment.bind(this), this.element = t, this.composition = e, this.documentView = new bn(this.composition.document, { element: this.element }), J("focus", { onElement: this.element, withCallback: this.didFocus }), J("blur", { onElement: this.element, withCallback: this.didBlur }), J("click", { onElement: this.element, matchingSelector: "a[contenteditable=false]", preventDefault: !0 }), J("mousedown", { onElement: this.element, matchingSelector: Be, withCallback: this.didClickAttachment }), J("click", { onElement: this.element, matchingSelector: "a".concat(Be), preventDefault: !0 });
  }
  didFocus(t) {
    var e;
    const i = () => {
      var s, r;
      if (!this.focused) return this.focused = !0, (s = this.delegate) === null || s === void 0 || (r = s.compositionControllerDidFocus) === null || r === void 0 ? void 0 : r.call(s);
    };
    return ((e = this.blurPromise) === null || e === void 0 ? void 0 : e.then(i)) || i();
  }
  didBlur(t) {
    this.blurPromise = new Promise(((e) => Hs((() => {
      var i, s;
      return Ps(this.element) || (this.focused = null, (i = this.delegate) === null || i === void 0 || (s = i.compositionControllerDidBlur) === null || s === void 0 || s.call(i)), this.blurPromise = null, e();
    }))));
  }
  didClickAttachment(t, e) {
    var i, s;
    const r = this.findAttachmentForElement(e), o = !!Ee(t.target, { matchingSelector: "figcaption" });
    return (i = this.delegate) === null || i === void 0 || (s = i.compositionControllerDidSelectAttachment) === null || s === void 0 ? void 0 : s.call(i, r, { editCaption: o });
  }
  getSerializableElement() {
    return this.isEditingAttachment() ? this.documentView.shadowElement : this.element;
  }
  render() {
    var t, e, i, s, r, o;
    return this.revision !== this.composition.revision && (this.documentView.setDocument(this.composition.document), this.documentView.render(), this.revision = this.composition.revision), this.canSyncDocumentView() && !this.documentView.isSynced() && ((i = this.delegate) === null || i === void 0 || (s = i.compositionControllerWillSyncDocumentView) === null || s === void 0 || s.call(i), this.documentView.sync(), (r = this.delegate) === null || r === void 0 || (o = r.compositionControllerDidSyncDocumentView) === null || o === void 0 || o.call(r)), (t = this.delegate) === null || t === void 0 || (e = t.compositionControllerDidRender) === null || e === void 0 ? void 0 : e.call(t);
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
    const s = this.documentView.findElementForObject(t);
    if (!s) return;
    this.uninstallAttachmentEditor();
    const r = this.composition.document.getAttachmentPieceForAttachment(t);
    this.attachmentEditor = new Oa(r, s, this.element, e), this.attachmentEditor.delegate = this;
  }
  uninstallAttachmentEditor() {
    var t;
    return (t = this.attachmentEditor) === null || t === void 0 ? void 0 : t.uninstall();
  }
  didUninstallAttachmentEditor() {
    return this.attachmentEditor = null, this.render();
  }
  attachmentEditorDidRequestUpdatingAttributesForAttachment(t, e) {
    var i, s;
    return (i = this.delegate) === null || i === void 0 || (s = i.compositionControllerWillUpdateAttachment) === null || s === void 0 || s.call(i, e), this.composition.updateAttributesForAttachment(t, e);
  }
  attachmentEditorDidRequestRemovingAttributeForAttachment(t, e) {
    var i, s;
    return (i = this.delegate) === null || i === void 0 || (s = i.compositionControllerWillUpdateAttachment) === null || s === void 0 || s.call(i, e), this.composition.removeAttributeForAttachment(t, e);
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
class Ba extends et {
}
const Na = "data-trix-mutable", qc = "[".concat(Na, "]"), Hc = { attributes: !0, childList: !0, characterData: !0, characterDataOldValue: !0, subtree: !0 };
class Pa extends et {
  constructor(t) {
    super(t), this.didMutate = this.didMutate.bind(this), this.element = t, this.observer = new window.MutationObserver(this.didMutate), this.start();
  }
  start() {
    return this.reset(), this.observer.observe(this.element, Hc);
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
    return t !== this.element && !this.nodeIsMutable(t) && !ia(t);
  }
  nodeIsMutable(t) {
    return Ee(t, { matchingSelector: qc });
  }
  nodesModifiedByMutation(t) {
    const e = [];
    switch (t.type) {
      case "attributes":
        t.attributeName !== Na && e.push(t.target);
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
    Array.from(i.additions).forEach(((a) => {
      Array.from(t).includes(a) || t.push(a);
    })), e.push(...Array.from(i.deletions || []));
    const s = {}, r = t.join("");
    r && (s.textAdded = r);
    const o = e.join("");
    return o && (s.textDeleted = o), s;
  }
  getMutationsByType(t) {
    return Array.from(this.mutations).filter(((e) => e.type === t));
  }
  getTextChangesFromChildList() {
    let t, e;
    const i = [], s = [];
    Array.from(this.getMutationsByType("childList")).forEach(((a) => {
      i.push(...Array.from(a.addedNodes || [])), s.push(...Array.from(a.removedNodes || []));
    })), i.length === 0 && s.length === 1 && Ye(s[0]) ? (t = [], e = [`
`]) : (t = Cs(i), e = Cs(s));
    const r = t.filter(((a, l) => a !== e[l])).map(yi), o = e.filter(((a, l) => a !== t[l])).map(yi);
    return { additions: r, deletions: o };
  }
  getTextChangesFromCharacterData() {
    let t, e;
    const i = this.getMutationsByType("characterData");
    if (i.length) {
      const s = i[0], r = i[i.length - 1], o = (function(a, l) {
        let c, h;
        return a = Ii.box(a), (l = Ii.box(l)).length < a.length ? [h, c] = yr(a, l) : [c, h] = yr(l, a), { added: c, removed: h };
      })(yi(s.oldValue), yi(r.target.data));
      t = o.added, e = o.removed;
    }
    return { additions: t ? [t] : [], deletions: e ? [e] : [] };
  }
}
const Cs = function() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const t = [];
  for (const e of Array.from(n)) switch (e.nodeType) {
    case Node.TEXT_NODE:
      t.push(e.data);
      break;
    case Node.ELEMENT_NODE:
      ht(e) === "br" ? t.push(`
`) : t.push(...Array.from(Cs(e.childNodes) || []));
  }
  return t;
};
class Fa extends cn {
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
class Uc {
  constructor(t) {
    this.element = t;
  }
  shouldIgnore(t) {
    return !!Bi.samsungAndroid && (this.previousEvent = this.event, this.event = t, this.checkSamsungKeyboardBuggyModeStart(), this.checkSamsungKeyboardBuggyModeEnd(), this.buggyMode);
  }
  checkSamsungKeyboardBuggyModeStart() {
    this.insertingLongTextAfterUnidentifiedChar() && $c(this.element.innerText, this.event.data) && (this.buggyMode = !0, this.event.preventDefault());
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
const $c = (n, t) => Hr(n) === Hr(t), jc = new RegExp("(".concat("￼", "|").concat(fn, "|").concat(Ae, "|\\s)+"), "g"), Hr = (n) => n.replace(jc, " ").trim();
class vn extends et {
  constructor(t) {
    super(...arguments), this.element = t, this.mutationObserver = new Pa(this.element), this.mutationObserver.delegate = this, this.flakyKeyboardDetector = new Uc(this.element);
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
    const e = Array.from(t).map(((i) => new Fa(i)));
    return Promise.all(e).then(((i) => {
      this.handleInput((function() {
        var s, r;
        return (s = this.delegate) === null || s === void 0 || s.inputControllerWillAttachFiles(), (r = this.responder) === null || r === void 0 || r.insertFiles(i), this.requestRender();
      }));
    }));
  }
  handlerFor(t) {
    return (e) => {
      e.defaultPrevented || this.handleInput((() => {
        if (!Ps(this.element)) {
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
const { browser: Vc, keyNames: qa } = Ni;
let Wc = 0;
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
    const s = e != null ? e === this.inputSummary.textAdded : !this.inputSummary.textAdded, r = i != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete, o = [`
`, ` 
`].includes(e) && !s, a = i === `
` && !r;
    if (o && !a || a && !o) {
      const c = this.getSelectedRange();
      if (c) {
        var l;
        const h = o ? e.replace(/\n$/, "").length || -1 : e?.length || 1;
        if ((l = this.responder) !== null && l !== void 0 && l.positionIsBlockBreak(c[1] + h)) return !0;
      }
    }
    return s && r;
  }
  mutationIsSignificant(t) {
    var e;
    const i = Object.keys(t).length > 0, s = ((e = this.compositionInput) === null || e === void 0 ? void 0 : e.getEndData()) === "";
    return i || !s;
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
    if (!(function(s) {
      if (s == null || !s.setData) return !1;
      for (const r in gr) {
        const o = gr[r];
        try {
          if (s.setData(r, o), !s.getData(r) === o) return !1;
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
    const e = this.getSelectedRange(), i = { position: "absolute", left: "".concat(window.pageXOffset, "px"), top: "".concat(window.pageYOffset, "px"), opacity: 0 }, s = D({ style: i, tagName: "div", editable: !0 });
    return document.body.appendChild(s), s.focus(), requestAnimationFrame((() => {
      const r = s.innerHTML;
      return xe(s), this.setSelectedRange(e), t(r);
    }));
  }
}
dt(de, "events", { keydown(n) {
  this.isComposing() || this.resetInputSummary(), this.inputSummary.didInput = !0;
  const t = qa[n.keyCode];
  if (t) {
    var e;
    let s = this.keys;
    ["ctrl", "alt", "shift", "meta"].forEach(((r) => {
      var o;
      n["".concat(r, "Key")] && (r === "ctrl" && (r = "control"), s = (o = s) === null || o === void 0 ? void 0 : o[r]);
    })), ((e = s) === null || e === void 0 ? void 0 : e[t]) != null && (this.setInputSummary({ keyName: t }), Ue.reset(), s[t].call(this, n));
  }
  if (oa(n)) {
    const s = String.fromCharCode(n.keyCode).toLowerCase();
    if (s) {
      var i;
      const r = ["alt", "shift"].map(((o) => {
        if (n["".concat(o, "Key")]) return o;
      })).filter(((o) => o));
      r.push(s), (i = this.delegate) !== null && i !== void 0 && i.inputControllerDidReceiveKeyboardCommand(r) && n.preventDefault();
    }
  }
}, keypress(n) {
  if (this.inputSummary.eventName != null || n.metaKey || n.ctrlKey && !n.altKey) return;
  const t = Gc(n);
  var e, i;
  return t ? ((e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformTyping(), (i = this.responder) === null || i === void 0 || i.insertString(t), this.setInputSummary({ textAdded: t, didDelete: this.selectionIsExpanded() })) : void 0;
}, textInput(n) {
  const { data: t } = n, { textAdded: e } = this.inputSummary;
  if (e && e !== t && e.toUpperCase() === t) {
    var i;
    const s = this.getSelectedRange();
    return this.setSelectedRange([s[0], s[1] + e.length]), (i = this.responder) === null || i === void 0 || i.insertString(t), this.setInputSummary({ textAdded: t }), this.setSelectedRange(s);
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
    if (!ri(i, this.draggingPoint)) return this.draggingPoint = i, (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidReceiveDragOverPoint) === null || e === void 0 ? void 0 : e.call(t, this.draggingPoint);
  }
}, dragend(n) {
  var t, e;
  (t = this.delegate) === null || t === void 0 || (e = t.inputControllerDidCancelDrag) === null || e === void 0 || e.call(t), this.draggedRange = null, this.draggingPoint = null;
}, drop(n) {
  var t, e;
  n.preventDefault();
  const i = (t = n.dataTransfer) === null || t === void 0 ? void 0 : t.files, s = n.dataTransfer.getData("application/x-trix-document"), r = { x: n.clientX, y: n.clientY };
  if ((e = this.responder) === null || e === void 0 || e.setLocationRangeFromPointRange(r), i != null && i.length) this.attachFiles(i);
  else if (this.draggedRange) {
    var o, a;
    (o = this.delegate) === null || o === void 0 || o.inputControllerWillMoveText(), (a = this.responder) === null || a === void 0 || a.moveTextFromRange(this.draggedRange), this.draggedRange = null, this.requestRender();
  } else if (s) {
    var l;
    const c = Rt.fromJSONString(s);
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
  if (!t || Jc(n)) return void this.getPastedHTMLUsingHiddenElement(((u) => {
    var x, y, O;
    return e.type = "text/html", e.html = u, (x = this.delegate) === null || x === void 0 || x.inputControllerWillPaste(e), (y = this.responder) === null || y === void 0 || y.insertHTML(e.html), this.requestRender(), (O = this.delegate) === null || O === void 0 ? void 0 : O.inputControllerDidPaste(e);
  }));
  const i = t.getData("URL"), s = t.getData("text/html"), r = t.getData("public.url-name");
  if (i) {
    var o, a, l;
    let u;
    e.type = "text/html", u = r ? $s(r).trim() : i, e.html = this.createLinkHTML(i, u), (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(e), this.setInputSummary({ textAdded: u, didDelete: this.selectionIsExpanded() }), (a = this.responder) === null || a === void 0 || a.insertHTML(e.html), this.requestRender(), (l = this.delegate) === null || l === void 0 || l.inputControllerDidPaste(e);
  } else if (ra(t)) {
    var c, h, g;
    e.type = "text/plain", e.string = t.getData("text/plain"), (c = this.delegate) === null || c === void 0 || c.inputControllerWillPaste(e), this.setInputSummary({ textAdded: e.string, didDelete: this.selectionIsExpanded() }), (h = this.responder) === null || h === void 0 || h.insertString(e.string), this.requestRender(), (g = this.delegate) === null || g === void 0 || g.inputControllerDidPaste(e);
  } else if (s) {
    var b, m, v;
    e.type = "text/html", e.html = s, (b = this.delegate) === null || b === void 0 || b.inputControllerWillPaste(e), (m = this.responder) === null || m === void 0 || m.insertHTML(e.html), this.requestRender(), (v = this.delegate) === null || v === void 0 || v.inputControllerDidPaste(e);
  } else if (Array.from(t.types).includes("Files")) {
    var f, A;
    const u = (f = t.items) === null || f === void 0 || (f = f[0]) === null || f === void 0 || (A = f.getAsFile) === null || A === void 0 ? void 0 : A.call(f);
    if (u) {
      var w, C, T;
      const x = zc(u);
      !u.name && x && (u.name = "pasted-file-".concat(++Wc, ".").concat(x)), e.type = "File", e.file = u, (w = this.delegate) === null || w === void 0 || w.inputControllerWillAttachFiles(), (C = this.responder) === null || C === void 0 || C.insertFile(e.file), this.requestRender(), (T = this.delegate) === null || T === void 0 || T.inputControllerDidPaste(e);
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
const zc = (n) => {
  var t;
  return (t = n.type) === null || t === void 0 || (t = t.match(/\/(\w+)$/)) === null || t === void 0 ? void 0 : t[1];
}, Kc = !((Kn = " ".codePointAt) === null || Kn === void 0 || !Kn.call(" ", 0)), Gc = function(n) {
  if (n.key && Kc && n.key.codePointAt(0) === n.keyCode) return n.key;
  {
    let t;
    if (n.which === null ? t = n.keyCode : n.which !== 0 && n.charCode !== 0 && (t = n.charCode), t != null && qa[t] !== "escape") return Ii.fromCodepoints([t]).toString();
  }
}, Jc = function(n) {
  const t = n.clipboardData;
  if (t) {
    if (t.types.includes("text/html")) {
      for (const e of t.types) {
        const i = /^CorePasteboardFlavorType/.test(e), s = /^dyn\./.test(e) && t.getData(e);
        if (i || s) return !0;
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
    return this.data.end = t, this.isSignificant() ? (this.forgetPlaceholder(), this.canApplyToDocument() ? (this.setInputSummary({ preferDocument: !0, didInput: !1 }), (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformTyping(), (i = this.responder) === null || i === void 0 || i.setSelectedRange(this.range), (s = this.responder) === null || s === void 0 || s.insertString(this.data.end), (r = this.responder) === null || r === void 0 ? void 0 : r.setSelectedRange(this.range[0] + this.data.end.length)) : this.data.start != null || this.data.update != null ? (this.requestReparse(), this.inputController.reset()) : void 0) : this.inputController.reset();
    var e, i, s, r;
  }
  getEndData() {
    return this.data.end;
  }
  isEnded() {
    return this.getEndData() != null;
  }
  isSignificant() {
    return !Vc.composesExistingText || this.inputSummary.didInput;
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
      var s;
      return (s = this.responder) === null || s === void 0 ? void 0 : s.insertString(e, i);
    }));
  }
  toggleAttributeIfSupported(t) {
    var e;
    if (_s().includes(t)) return (e = this.delegate) === null || e === void 0 || e.inputControllerWillPerformFormatting(t), this.withTargetDOMRange((function() {
      var i;
      return (i = this.responder) === null || i === void 0 ? void 0 : i.toggleCurrentAttribute(t);
    }));
  }
  activateAttributeIfSupported(t, e) {
    var i;
    if (_s().includes(t)) return (i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformFormatting(t), this.withTargetDOMRange((function() {
      var s;
      return (s = this.responder) === null || s === void 0 ? void 0 : s.setCurrentAttribute(t, e);
    }));
  }
  deleteInDirection(t) {
    let { recordUndoEntry: e } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : { recordUndoEntry: !0 };
    var i;
    e && ((i = this.delegate) === null || i === void 0 || i.inputControllerWillPerformTyping());
    const s = () => {
      var o;
      return (o = this.responder) === null || o === void 0 ? void 0 : o.deleteInDirection(t);
    }, r = this.getTargetDOMRange({ minLength: this.composing ? 1 : 2 });
    return r ? this.withTargetDOMRange(r, s) : s();
  }
  withTargetDOMRange(t, e) {
    var i;
    return typeof t == "function" && (e = t, t = this.getTargetDOMRange()), t ? (i = this.responder) === null || i === void 0 ? void 0 : i.withTargetDOMRange(t, e.bind(this)) : (Ue.reset(), e.call(this));
  }
  getTargetDOMRange() {
    var t, e;
    let { minLength: i } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : { minLength: 0 };
    const s = (t = (e = this.event).getTargetRanges) === null || t === void 0 ? void 0 : t.call(e);
    if (s && s.length) {
      const r = Yc(s[0]);
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
dt(Li, "events", { keydown(n) {
  if (oa(n)) {
    var t;
    const e = Zc(n);
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
  return Ha(n) ? (n.preventDefault(), this.attachFiles(n.clipboardData.files)) : Qc(n) ? (n.preventDefault(), e = { type: "text/plain", string: n.clipboardData.getData("text/plain") }, (s = this.delegate) === null || s === void 0 || s.inputControllerWillPaste(e), (r = this.responder) === null || r === void 0 || r.insertString(e.string), this.render(), (o = this.delegate) === null || o === void 0 ? void 0 : o.inputControllerDidPaste(e)) : i ? (n.preventDefault(), e = { type: "text/html", html: this.createLinkHTML(i) }, (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(e), (l = this.responder) === null || l === void 0 || l.insertHTML(e.html), this.render(), (c = this.delegate) === null || c === void 0 ? void 0 : c.inputControllerDidPaste(e)) : void 0;
  var s, r, o, a, l, c;
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
    if (!ri(e, this.dragging.point)) return this.dragging.point = e, (t = this.responder) === null || t === void 0 ? void 0 : t.setLocationRangeFromPointRange(e);
  } else Gn(n) && n.preventDefault();
}, drop(n) {
  var t, e;
  if (this.dragging) return n.preventDefault(), (t = this.delegate) === null || t === void 0 || t.inputControllerWillMoveText(), (e = this.responder) === null || e === void 0 || e.moveTextFromRange(this.dragging.range), this.dragging = null, this.scheduleRender();
  if (Gn(n)) {
    var i;
    n.preventDefault();
    const s = Jn(n);
    return (i = this.responder) === null || i === void 0 || i.setLocationRangeFromPointRange(s), this.attachFiles(n.dataTransfer.files);
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
    var s;
    let l;
    this.event.preventDefault(), t.type = "text/html";
    const c = n.getData("public.url-name");
    l = c ? $s(c).trim() : e, t.html = this.createLinkHTML(e, l), (s = this.delegate) === null || s === void 0 || s.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var h;
      return (h = this.responder) === null || h === void 0 ? void 0 : h.insertHTML(t.html);
    })), this.afterRender = () => {
      var h;
      return (h = this.delegate) === null || h === void 0 ? void 0 : h.inputControllerDidPaste(t);
    };
  } else if (ra(n)) {
    var r;
    t.type = "text/plain", t.string = n.getData("text/plain"), (r = this.delegate) === null || r === void 0 || r.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertString(t.string);
    })), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
    };
  } else if (Xc(this.event)) {
    var o;
    t.type = "File", t.file = n.files[0], (o = this.delegate) === null || o === void 0 || o.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
      var l;
      return (l = this.responder) === null || l === void 0 ? void 0 : l.insertFile(t.file);
    })), this.afterRender = () => {
      var l;
      return (l = this.delegate) === null || l === void 0 ? void 0 : l.inputControllerDidPaste(t);
    };
  } else if (i) {
    var a;
    this.event.preventDefault(), t.type = "text/html", t.html = i, (a = this.delegate) === null || a === void 0 || a.inputControllerWillPaste(t), this.withTargetDOMRange((function() {
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
const Yc = function(n) {
  const t = document.createRange();
  return t.setStart(n.startContainer, n.startOffset), t.setEnd(n.endContainer, n.endOffset), t;
}, Gn = (n) => {
  var t;
  return Array.from(((t = n.dataTransfer) === null || t === void 0 ? void 0 : t.types) || []).includes("Files");
}, Xc = (n) => {
  var t;
  return ((t = n.dataTransfer.files) === null || t === void 0 ? void 0 : t[0]) && !Ha(n) && !((e) => {
    let { dataTransfer: i } = e;
    return i.types.includes("Files") && i.types.includes("text/html") && i.getData("text/html").includes("urn:schemas-microsoft-com:office:office");
  })(n);
}, Ha = function(n) {
  const t = n.clipboardData;
  if (t)
    return Array.from(t.types).filter(((e) => e.match(/file/i))).length === t.types.length && t.files.length >= 1;
}, Qc = function(n) {
  const t = n.clipboardData;
  if (t) return t.types.includes("text/plain") && t.types.length === 1;
}, Zc = function(n) {
  const t = [];
  return n.altKey && t.push("alt"), n.shiftKey && t.push("shift"), t.push(n.key), t;
}, Jn = (n) => ({ x: n.clientX, y: n.clientY }), Ts = "[data-trix-attribute]", ks = "[data-trix-action]", td = "".concat(Ts, ", ").concat(ks), yn = "[data-trix-dialog]", ed = "".concat(yn, "[data-trix-active]"), id = "".concat(yn, " [data-trix-method]"), Ur = "".concat(yn, " [data-trix-input]"), $r = (n, t) => (t || (t = Ge(n)), n.querySelector("[data-trix-input][name='".concat(t, "']"))), jr = (n) => n.getAttribute("data-trix-action"), Ge = (n) => n.getAttribute("data-trix-attribute") || n.getAttribute("data-trix-dialog-attribute");
class Ua extends et {
  constructor(t) {
    super(t), this.didClickActionButton = this.didClickActionButton.bind(this), this.didClickAttributeButton = this.didClickAttributeButton.bind(this), this.didClickDialogButton = this.didClickDialogButton.bind(this), this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this), this.element = t, this.attributes = {}, this.actions = {}, this.resetDialogInputs(), J("mousedown", { onElement: this.element, matchingSelector: ks, withCallback: this.didClickActionButton }), J("mousedown", { onElement: this.element, matchingSelector: Ts, withCallback: this.didClickAttributeButton }), J("click", { onElement: this.element, matchingSelector: td, preventDefault: !0 }), J("click", { onElement: this.element, matchingSelector: id, withCallback: this.didClickDialogButton }), J("keydown", { onElement: this.element, matchingSelector: Ur, withCallback: this.didKeyDownDialogInput });
  }
  didClickActionButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const s = jr(e);
    return this.getDialog(s) ? this.toggleDialog(s) : (r = this.delegate) === null || r === void 0 ? void 0 : r.toolbarDidInvokeAction(s, e);
    var r;
  }
  didClickAttributeButton(t, e) {
    var i;
    (i = this.delegate) === null || i === void 0 || i.toolbarDidClickButton(), t.preventDefault();
    const s = Ge(e);
    var r;
    return this.getDialog(s) ? this.toggleDialog(s) : (r = this.delegate) === null || r === void 0 || r.toolbarDidToggleAttribute(s), this.refreshAttributeButtons();
  }
  didClickDialogButton(t, e) {
    const i = Ee(e, { matchingSelector: yn });
    return this[e.getAttribute("data-trix-method")].call(this, i);
  }
  didKeyDownDialogInput(t, e) {
    if (t.keyCode === 13) {
      t.preventDefault();
      const i = e.getAttribute("name"), s = this.getDialog(i);
      this.setAttribute(s);
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
    return Array.from(this.element.querySelectorAll(ks)).map(((e) => t(e, jr(e))));
  }
  updateAttributes(t) {
    return this.attributes = t, this.refreshAttributeButtons();
  }
  refreshAttributeButtons() {
    return this.eachAttributeButton(((t, e) => (t.disabled = this.attributes[e] === !1, this.attributes[e] || this.dialogIsVisible(e) ? (t.setAttribute("data-trix-active", ""), t.classList.add("trix-active")) : (t.removeAttribute("data-trix-active"), t.classList.remove("trix-active")))));
  }
  eachAttributeButton(t) {
    return Array.from(this.element.querySelectorAll(Ts)).map(((e) => t(e, Ge(e))));
  }
  applyKeyboardCommand(t) {
    const e = JSON.stringify(t.sort());
    for (const i of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
      const s = i.getAttribute("data-trix-key").split("+");
      if (JSON.stringify(s.sort()) === e) return _i("mousedown", { onElement: i }), !0;
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
    const s = this.getDialog(t);
    s.setAttribute("data-trix-active", ""), s.classList.add("trix-active"), Array.from(s.querySelectorAll("input[disabled]")).forEach(((o) => {
      o.removeAttribute("disabled");
    }));
    const r = Ge(s);
    if (r) {
      const o = $r(s, t);
      o && (o.value = this.attributes[r] || "", o.select());
    }
    return (i = this.delegate) === null || i === void 0 ? void 0 : i.toolbarDidShowDialog(t);
  }
  setAttribute(t) {
    var e;
    const i = Ge(t), s = $r(t, i);
    return !s.willValidate || (s.setCustomValidity(""), s.checkValidity() && this.isSafeAttribute(s)) ? ((e = this.delegate) === null || e === void 0 || e.toolbarDidUpdateAttribute(i, s.value), this.hideDialog()) : (s.setCustomValidity("Invalid value"), s.setAttribute("data-trix-validate", ""), s.classList.add("trix-validate"), s.focus());
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
    const t = this.element.querySelector(ed);
    var e;
    if (t) return t.removeAttribute("data-trix-active"), t.classList.remove("trix-active"), this.resetDialogInputs(), (e = this.delegate) === null || e === void 0 ? void 0 : e.toolbarDidHideDialog(((i) => i.getAttribute("data-trix-dialog"))(t));
  }
  resetDialogInputs() {
    Array.from(this.element.querySelectorAll(Ur)).forEach(((t) => {
      t.setAttribute("disabled", "disabled"), t.removeAttribute("data-trix-validate"), t.classList.remove("trix-validate");
    }));
  }
  getDialog(t) {
    return this.element.querySelector("[data-trix-dialog=".concat(t, "]"));
  }
}
class wi extends Ba {
  constructor(t) {
    let { editorElement: e, document: i, html: s } = t;
    super(...arguments), this.editorElement = e, this.selectionManager = new Oe(this.editorElement), this.selectionManager.delegate = this, this.composition = new _e(), this.composition.delegate = this, this.attachmentManager = new Sa(this.composition.getAttachments()), this.attachmentManager.delegate = this, this.inputController = Fs.getLevel() === 2 ? new Li(this.editorElement) : new de(this.editorElement), this.inputController.delegate = this, this.inputController.responder = this.composition, this.compositionController = new Ma(this.editorElement, this.composition), this.compositionController.delegate = this, this.toolbarController = new Ua(this.editorElement.toolbarElement), this.toolbarController.delegate = this, this.editor = new Ta(this.composition, this.selectionManager, this.editorElement), i ? this.editor.loadDocument(i) : this.editor.loadHTML(s);
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
    if (!ri(t, this.currentActions)) return this.currentActions = t, this.toolbarController.updateActions(this.currentActions), this.notifyEditorElement("actions-change", { actions: this.currentActions });
  }
  runEditorFilters() {
    let t = this.composition.getSnapshot();
    if (Array.from(this.editor.filters).forEach(((s) => {
      const { document: r, selectedRange: o } = t;
      t = s.call(this.editor, t) || {}, t.document || (t.document = r), t.selectedRange || (t.selectedRange = o);
    })), e = t, i = this.composition.getSnapshot(), !ln(e.selectedRange, i.selectedRange) || !e.document.isEqualTo(i.document)) return this.composition.loadSnapshot(t);
    var e, i;
  }
  updateInputElement() {
    const t = (function(e, i) {
      const s = Ic[i];
      if (s) return s(e);
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
    return bs.interval > 0 ? Math.floor((/* @__PURE__ */ new Date()).getTime() / bs.interval) : 0;
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
  return Fs.pickFiles(this.editor.insertFiles);
} } }), wi.proxyMethod("getSelectionManager().setLocationRange"), wi.proxyMethod("getSelectionManager().getLocationRange");
var nd = Object.freeze({ __proto__: null, AttachmentEditorController: Oa, CompositionController: Ma, Controller: Ba, EditorController: wi, InputController: vn, Level0InputController: de, Level2InputController: Li, ToolbarController: Ua }), sd = Object.freeze({ __proto__: null, MutationObserver: Pa, SelectionChangeObserver: la }), rd = Object.freeze({ __proto__: null, FileVerificationOperation: Fa, ImagePreloadOperation: Aa });
sa("trix-toolbar", `%t {
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
class $a extends HTMLElement {
  connectedCallback() {
    this.innerHTML === "" && (this.innerHTML = na.getDefaultHTML());
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
const ad = function(n) {
  if (!n.hasAttribute("contenteditable")) return n.toggleAttribute("contenteditable", !n.disabled), (function(t) {
    let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return e.times = 1, J(t, e);
  })("focus", { onElement: n, withCallback: () => ld(n) });
}, ld = function(n) {
  return cd(n), dd();
}, cd = function(n) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "enableObjectResizing")) return document.execCommand("enableObjectResizing", !1, !1), J("mscontrolselect", { onElement: n, preventDefault: !0 });
}, dd = function(n) {
  var t, e;
  if ((t = (e = document).queryCommandSupported) !== null && t !== void 0 && t.call(e, "DefaultParagraphSeparator")) {
    const { tagName: i } = mt.default;
    if (["div", "p"].includes(i)) return document.execCommand("DefaultParagraphSeparator", !1, i);
  }
}, Vr = Bi.forcesObjectResizing ? { display: "inline", width: "auto" } : { display: "inline-block", width: "1px" };
sa("trix-editor", `%t {
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
    display: `).concat(Vr.display, ` !important;
    width: `).concat(Vr.width, ` !important;
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
class ud {
  constructor(t) {
    var e, i;
    _a(e = this, i = fi), i.add(e), dt(this, "value", ""), Qe(this, Vt, { writable: !0, value: void 0 }), Qe(this, zi, { writable: !0, value: void 0 }), this.element = t, Si(this, Vt, t.attachInternals()), Si(this, zi, !1);
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
  const { required: t, value: e } = this.element, i = t && !e, s = !!n, r = D("input", { required: t }), o = n || r.validationMessage;
  P(this, Vt).setValidity({ valueMissing: i, customError: s }, o);
}
var Yn = /* @__PURE__ */ new WeakMap(), Xn = /* @__PURE__ */ new WeakMap(), Qn = /* @__PURE__ */ new WeakMap();
class hd {
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
        const i = Array.from(t.labels).map(((r) => {
          if (!r.contains(t)) return r.textContent;
        })).filter(((r) => r)), s = i.join(" ");
        return s ? t.setAttribute("aria-label", s) : t.removeAttribute("aria-label");
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
    super(), Qe(this, Q, { writable: !0, value: void 0 }), this.willCreateInput = !0, Si(this, Q, this.constructor.formAssociated ? new ud(this) : new hd(this));
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
      return this.setAttribute("toolbar", e), this.internalToolbar = D("trix-toolbar", { id: e }), this.parentNode.insertBefore(this.internalToolbar, this), this.internalToolbar;
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
      if (ad(this), (function(t) {
        t.hasAttribute("role") || t.setAttribute("role", "textbox");
      })(this), !this.editorController) {
        if (_i("trix-before-initialize", { onElement: this }), this.defaultValue = this.inputElement ? this.inputElement.value : this.innerHTML, !this.hasAttribute("input") && this.parentNode && this.willCreateInput) {
          const t = "trix-input-".concat(this.trixId);
          this.setAttribute("input", t);
          const e = D("input", { type: "hidden", id: t });
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
const Wr = { VERSION: ml, config: Ni, core: Dc, models: Da, views: Pc, controllers: nd, observers: sd, operations: rd, elements: Object.freeze({ __proto__: null, TrixEditorElement: un, TrixToolbarElement: $a }), filters: Object.freeze({ __proto__: null, Filter: wa, attachmentGalleryFilter: Ca }) };
Object.assign(Wr, Da), window.Trix = Wr, setTimeout((function() {
  customElements.get("trix-toolbar") || customElements.define("trix-toolbar", $a), customElements.get("trix-editor") || customElements.define("trix-editor", un);
}), 0);
class md extends HTMLElement {
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
const Gi = "filter-list-list", pd = "filter-list-item", fd = "filter-list-input", zr = "filter-list-searchable";
class gd extends HTMLElement {
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
    let e = new Mark(t.querySelectorAll("." + zr));
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
    return e === "" ? "" : `<span class="${zr}">${e}</span>`;
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
								class="${fd} w-full placeholder:italic px-2 py-0.5" />
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
        t = this._items.filter((i) => e.every((s) => this.getSearchText(i).toLowerCase().includes(s.toLowerCase())));
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
										class="${pd} block px-2.5 py-0.5 hover:bg-slate-200 no-underline ${i % 2 === 0 ? "bg-stone-100" : "bg-stone-50"}"
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
class bd extends HTMLElement {
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
class vd extends HTMLElement {
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
    i && i.addEventListener("click", this.prev.bind(this)), this.overlay.addEventListener("click", (s) => {
      s.target === this.overlay && this.hideOverlay();
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
class yd extends HTMLElement {
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
      let i = this._headings[e], s = i.querySelectorAll(".show-opened");
      for (let o of s)
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
    const s = Array.from(t.querySelectorAll(".show-opened"));
    for (let r of s)
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
    let i = "", s = 0;
    for (; s < t.length; ) {
      if (s > 0 && !this.isSpaceOrPunct(t[s - 1])) {
        i += t[s], s++;
        continue;
      }
      const r = this.findLongestAbbrevAt(t, s, e);
      if (r) {
        const { match: o, meaning: a } = r;
        i += `
            <span class="!inline" data-tippy-placement="top" data-tippy-content="${a}">
              <span class="cursor-help text-blue-900 hover:text-slate-800">
                ${o}
              </span>
            </span>
          `, s += o.length;
      } else
        i += t[s], s++;
    }
    return i;
  }
  findLongestAbbrevAt(t, e, i) {
    let s = null, r = 0;
    for (const o of Object.keys(i))
      t.startsWith(o, e) && o.length > r && (s = o, r = o.length);
    return s ? { match: s, meaning: i[s] } : null;
  }
  isSpaceOrPunct(t) {
    return /\s|[.,;:!?]/.test(t);
  }
}
class _d extends HTMLElement {
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
class Ad extends HTMLElement {
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
const Ed = "mss-component-wrapper", Kr = "mss-selected-items-container", xd = "mss-selected-item-pill", Sd = "mss-selected-item-text", Ld = "mss-selected-item-pill-detail", Gr = "mss-selected-item-delete-btn", wd = "mss-selected-item-edit-link", Jr = "mss-input-controls-container", Yr = "mss-input-wrapper", Xr = "mss-input-wrapper-focused", Qr = "mss-text-input", Zr = "mss-create-new-button", to = "mss-toggle-button", Cd = "mss-inline-row", eo = "mss-options-list", Td = "mss-option-item", kd = "mss-option-item-name", Rd = "mss-option-item-detail", io = "mss-option-item-highlighted", Zn = "mss-hidden-select", ts = "mss-no-items-text", no = "mss-loading", es = 1, is = 10, Id = 250, Dd = "mss-state-no-selection", Od = "mss-state-has-selection", Md = "mss-state-list-open";
class Bd extends HTMLElement {
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
    ], this._filteredOptions = [], this._highlightedIndex = -1, this._isOptionsListVisible = !1, this._remoteEndpoint = null, this._remoteResultKey = "items", this._remoteMinChars = es, this._remoteLimit = is, this._remoteFetchController = null, this._remoteFetchTimeout = null, this._placeholder = this.getAttribute("placeholder") || "Search items...", this._showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._editBase = this.getAttribute("data-edit-base") || "", this._editSuffix = this.getAttribute("data-edit-suffix") || "/edit", this._setupTemplates(), this._bindEventHandlers();
  }
  _setupTemplates() {
    this.optionTemplate = document.createElement("template"), this.optionTemplate.innerHTML = `
                    <li role="option" class="${Td}">
                        <span data-ref="nameEl" class="${kd}"></span>
                        <span data-ref="detailEl" class="${Rd}"></span>
                    </li>
                `, this.selectedItemTemplate = document.createElement("template"), this.selectedItemTemplate.innerHTML = `
                    <span class="${xd} flex items-center">
                        <span data-ref="textEl" class="${Sd}"></span>
                        <span data-ref="detailEl" class="${Ld} hidden"></span>
                        <a data-ref="editLink" class="${wd} hidden" aria-label="Bearbeiten">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" data-ref="deleteBtn" class="${Gr}">&times;</button>
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
        const s = { ...i };
        return s.name = this._normalizeText(s.name), s.additional_data = this._normalizeText(s.additional_data), s;
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
      this._value = [...new Set(t.filter((s) => typeof s == "string" && this._getItemById(s)))];
    else if (typeof t == "string" && t.trim() !== "") {
      const s = t.trim();
      this._getItemById(s) && !this._value.includes(s) ? this._value = [s] : this._getItemById(s) || (this._value = this._value.filter((r) => r !== s));
    } else this._value = [];
    const i = JSON.stringify([...this._value].sort());
    this._value.forEach((s) => {
      this._displayOrder.includes(s) || this._displayOrder.push(s);
    }), !this._initialCaptured && this._allowInitialCapture && this._value.length > 0 && (this._initialValue = [...this._value], this._initialOrder = [...this._value], this._initialCaptured = !0), this._value.forEach((s) => {
      this._removedIds.has(s) && this._removedIds.delete(s);
    }), e !== i && (this._updateFormValue(), this.selectedItemsContainer && this._renderSelectedItems(), this._updateRootElementStateClasses(), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
  get name() {
    return this.getAttribute("name");
  }
  set name(t) {
    this.setAttribute("name", t), this.hiddenSelect && (this.hiddenSelect.name = t);
  }
  connectedCallback() {
    this._render(), this.inputControlsContainer = this.querySelector(`.${Jr}`), this.inputWrapper = this.querySelector(`.${Yr}`), this.inputElement = this.querySelector(`.${Qr}`), this.createNewButton = this.querySelector(`.${Zr}`), this.toggleButton = this.querySelector(`.${to}`), this.optionsListElement = this.querySelector(`.${eo}`), this.selectedItemsContainer = this.querySelector(`.${Kr}`), this.hiddenSelect = this.querySelector(`.${Zn}`), this.placeholder = this.getAttribute("placeholder") || "Search items...", this.showCreateButton = this.getAttribute("show-create-button") !== "false", this._toggleLabel = this.getAttribute("data-toggle-label") || "", this._toggleInput = this._toggleLabel !== "", this._inputCollapsed = this._toggleInput, this._remoteEndpoint = this.getAttribute("data-endpoint") || null, this._remoteResultKey = this.getAttribute("data-result-key") || "items", this._remoteMinChars = this._parsePositiveInt(this.getAttribute("data-minchars"), es), this._remoteLimit = this._parsePositiveInt(this.getAttribute("data-limit"), is), this.name && this.hiddenSelect && (this.hiddenSelect.name = this.name), this.inputElement.addEventListener("input", this._handleInput), this.inputElement.addEventListener("keydown", this._handleKeyDown), this.inputElement.addEventListener("focus", this._handleFocus), this.inputElement.addEventListener("blur", this._handleBlur), this.optionsListElement.addEventListener("mousedown", this._handleOptionMouseDown), this.optionsListElement.addEventListener("click", this._handleOptionClick), this.createNewButton.addEventListener("click", this._handleCreateNewButtonClick), this.selectedItemsContainer.addEventListener("click", this._handleSelectedItemsContainerClick), this.toggleButton && this.toggleButton.addEventListener("click", this._handleToggleClick);
    const t = this.getAttribute("data-external-toggle-id");
    if (t && (this.externalToggleButton = document.getElementById(t), this.externalToggleButton && this.externalToggleButton.addEventListener("click", this._handleToggleClick)), this._updateRootElementStateClasses(), this.hasAttribute("value")) {
      const e = this.getAttribute("value");
      try {
        this.value = JSON.parse(e);
      } catch {
        this.value = e.split(",").map((s) => s.trim()).filter(Boolean);
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
          this.value = i.split(",").map((r) => r.trim()).filter(Boolean);
        }
      else t === "placeholder" ? this.placeholder = i : t === "show-create-button" ? this.showCreateButton = i : t === "data-endpoint" ? this._remoteEndpoint = i || null : t === "data-result-key" ? this._remoteResultKey = i || "items" : t === "data-minchars" ? this._remoteMinChars = this._parsePositiveInt(i, es) : t === "data-limit" ? this._remoteLimit = this._parsePositiveInt(i, is) : t === "data-toggle-label" && (this._toggleLabel = i || "", this._toggleInput = this._toggleLabel !== "");
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
    this.inputElement && (this.inputElement.disabled = t), this.createNewButton && (this.createNewButton.disabled = t), this.toggleAttribute("disabled", t), this.querySelectorAll(`.${Gr}`).forEach((e) => e.disabled = t), this.hiddenSelect && (this.hiddenSelect.disabled = t), t && this._hideOptionsList();
  }
  _updateRootElementStateClasses() {
    this.classList.toggle(Dd, this._value.length === 0), this.classList.toggle(Od, this._value.length > 0), this.classList.toggle(Md, this._isOptionsListVisible);
  }
  _render() {
    const t = this.id || `mss-${crypto.randomUUID().slice(0, 8)}`;
    this.id || this.setAttribute("id", t);
    const e = this.getAttribute("data-toggle-label") || "", i = e !== "", s = i ? "hidden" : "";
    this.innerHTML = `
                    <style>
                        .${Zn} { display: block !important; visibility: hidden !important; position: absolute !important; width: 0px !important; height: 0px !important; opacity: 0 !important; pointer-events: none !important; margin: -1px !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; }
                    </style>
                    <div class="${Ed} relative">
                        <div class="${Cd} flex flex-wrap items-center gap-2">
                            <div class="${Kr} flex flex-wrap items-center gap-1 min-h-[30px]" aria-live="polite" tabindex="-1"></div>
                            ${i ? `<button type="button" class="${to}">${e}</button>` : ""}
                            <div class="${Jr} flex items-center gap-2 ${s}">
                                <div class="${Yr} relative rounded-md flex items-center flex-grow">
                                    <input type="text"
                                           class="${Qr} w-full outline-none bg-transparent"
                                           placeholder="${this.placeholder}"
                                           aria-autocomplete="list"
                                           aria-expanded="${this._isOptionsListVisible}"
                                           aria-controls="options-list-${t}"
                                           autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="combobox" />
                                </div>
                                <button type="button" class="${Zr} ${this.showCreateButton ? "" : "hidden"}" title="Create new item from input">+</button>
                            </div>
                        </div>
                        <ul id="options-list-${t}" role="listbox" class="${eo} absolute z-20 w-full max-h-60 overflow-y-auto mt-1 hidden"></ul>
                        <select multiple name="${this.getAttribute("name") || "mss_default_name"}" id="hidden-select-${t}" class="${Zn}" aria-hidden="true"></select>
                    </div>
                `;
  }
  _createSelectedItemElement(t) {
    const e = this._getItemById(t);
    if (!e) return null;
    const s = this.selectedItemTemplate.content.cloneNode(!0).firstElementChild, r = s.querySelector('[data-ref="textEl"]'), o = s.querySelector('[data-ref="detailEl"]'), a = s.querySelector('[data-ref="editLink"]'), l = s.querySelector('[data-ref="deleteBtn"]');
    r.textContent = this._normalizeText(e.name);
    const c = this._normalizeText(e.additional_data);
    c ? (o.textContent = `(${c})`, o.classList.remove("hidden")) : (o.textContent = "", o.classList.add("hidden"));
    const h = this._removedIds.has(t);
    if (!this._initialValue.includes(t)) {
      const b = document.createElement("span");
      b.className = "ml-1 text-xs text-gray-600", b.textContent = "(Neu)", r.appendChild(b);
    }
    return h && (s.classList.add("bg-red-100"), s.style.position = "relative"), a && (this._editBase && !h ? (a.href = `${this._editBase}${t}${this._editSuffix}`, a.target = "_blank", a.rel = "noreferrer", a.classList.remove("hidden")) : (a.classList.add("hidden"), a.removeAttribute("href"), a.removeAttribute("target"), a.removeAttribute("rel"))), l.setAttribute("aria-label", h ? `Undo remove ${e.name}` : `Remove ${e.name}`), l.dataset.id = t, l.disabled = this.hasAttribute("disabled"), l.innerHTML = h ? '<span class="text-xs inline-flex items-center"><i class="ri-arrow-go-back-line"></i></span>' : "&times;", l.addEventListener("click", (b) => {
      b.stopPropagation(), this._handleDeleteSelectedItem(t);
    }), s;
  }
  _renderSelectedItems() {
    if (!this.selectedItemsContainer) return;
    this.selectedItemsContainer.innerHTML = "";
    const t = this._displayOrder.filter(
      (e) => this._value.includes(e) || this._removedIds.has(e)
    );
    if (t.length === 0) {
      const e = this.getAttribute("data-empty-text") || "Keine Auswahl...", i = this._inputCollapsed ? "" : "hidden";
      this.selectedItemsContainer.innerHTML = `<span class="${ts} ${i}">${e}</span>`;
    } else
      t.forEach((e) => {
        const i = this._createSelectedItemElement(e);
        i && this.selectedItemsContainer.appendChild(i);
      });
    this._updateRootElementStateClasses();
  }
  _createOptionElement(t, e) {
    const s = this.optionTemplate.content.cloneNode(!0).firstElementChild, r = s.querySelector('[data-ref="nameEl"]'), o = s.querySelector('[data-ref="detailEl"]');
    r.textContent = this._normalizeText(t.name);
    const a = this._normalizeText(t.additional_data);
    o.textContent = a ? `(${a})` : "", s.dataset.id = t.id, s.setAttribute("aria-selected", String(e === this._highlightedIndex));
    const l = `option-${this.id || "mss"}-${t.id}`;
    return s.id = l, e === this._highlightedIndex && (s.classList.add(io), this.inputElement && this.inputElement.setAttribute("aria-activedescendant", l)), s;
  }
  _renderOptionsList() {
    if (!(!this.optionsListElement || !this.inputElement)) {
      if (this.optionsListElement.innerHTML = "", this.inputElement.removeAttribute("aria-activedescendant"), this._filteredOptions.length === 0 || !this._isOptionsListVisible)
        this.optionsListElement.classList.add("hidden"), this.inputElement.setAttribute("aria-expanded", "false");
      else {
        this.optionsListElement.classList.remove("hidden"), this.inputElement.setAttribute("aria-expanded", "true"), this._filteredOptions.forEach((e, i) => {
          const s = this._createOptionElement(e, i);
          this.optionsListElement.appendChild(s);
        });
        const t = this.optionsListElement.querySelector(`.${io}`);
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
      this._filteredOptions = this._options.filter((s) => {
        if (this._value.includes(s.id)) return !1;
        const o = this._normalizeText(s.name).toLowerCase().includes(i), a = this._normalizeText(s.additional_data), l = a && a.toLowerCase().includes(i);
        return o || l;
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
    this.inputElement.disabled || (this.inputWrapper && this.inputWrapper.classList.add(Xr), this.inputElement.value.length > 0 && this._handleInput({ target: this.inputElement }), this._updateRootElementStateClasses());
  }
  _blurTimeout = null;
  _handleBlur() {
    this.inputWrapper && this.inputWrapper.classList.remove(Xr), this._blurTimeout = setTimeout(() => {
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
        const t = this.selectedItemsContainer.querySelector(`.${ts}`);
        t && t.classList.add("hidden");
      }
      this.inputElement && !this.hasAttribute("disabled") && this.inputElement.focus(), this._inputCollapsed = !1;
    }
  }
  _hideInputControls() {
    if (this.inputControlsContainer) {
      if (this.inputControlsContainer.classList.add("hidden"), this.toggleButton && this.toggleButton.classList.remove("hidden"), this._value.length === 0 && this.selectedItemsContainer) {
        const t = this.selectedItemsContainer.querySelector(`.${ts}`);
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
    this._cancelRemoteFetch(), this.classList.add(no);
    const e = new AbortController();
    this._remoteFetchController = e;
    try {
      const i = new URL(this._remoteEndpoint, window.location.origin);
      i.searchParams.set("q", t), this._remoteLimit && i.searchParams.set("limit", String(this._remoteLimit));
      const s = await fetch(i.toString(), {
        headers: { Accept: "application/json" },
        signal: e.signal,
        credentials: "same-origin"
      });
      if (!s.ok)
        throw new Error(`Remote fetch failed with status ${s.status}`);
      const r = await s.json();
      if (e.signal.aborted)
        return;
      const o = this._extractRemoteOptions(r);
      this._applyRemoteResults(o);
    } catch (i) {
      if (e.signal.aborted)
        return;
      console.error("MultiSelectSimple remote fetch error:", i), this._filteredOptions = [], this._isOptionsListVisible = !1, this._renderOptionsList();
    } finally {
      this._remoteFetchController === e && (this._remoteFetchController = null), this.classList.remove(no);
    }
  }
  _extractRemoteOptions(t) {
    if (!t) return [];
    let e = [];
    return Array.isArray(t) ? e = t : this._remoteResultKey && Array.isArray(t[this._remoteResultKey]) ? e = t[this._remoteResultKey] : Array.isArray(t.items) && (e = t.items), e.map((i) => {
      if (!i) return null;
      const s = i.id ?? i.ID ?? i.value ?? "", r = i.name ?? i.title ?? i.label ?? "", o = i.detail ?? i.additional_data ?? i.annotation ?? "", a = this._normalizeText(r), l = this._normalizeText(o);
      return !s || !a ? null : {
        id: String(s),
        name: a,
        additional_data: l
      };
    }).filter(Boolean);
  }
  _applyRemoteResults(t) {
    const e = new Set(this._value), i = /* @__PURE__ */ new Map();
    this._options.forEach((s) => {
      s?.id && i.set(s.id, s);
    }), t.forEach((s) => {
      s?.id && i.set(s.id, s);
    }), this._options = Array.from(i.values()), this._filteredOptions = t.filter((s) => s && !e.has(s.id)), this._isOptionsListVisible = this._filteredOptions.length > 0, this._highlightedIndex = this._isOptionsListVisible ? 0 : -1, this._renderOptionsList();
  }
  _normalizeText(t) {
    if (t == null)
      return "";
    let e = String(t).trim();
    if (!e)
      return "";
    const i = e[0], s = e[e.length - 1];
    return (i === '"' && s === '"' || i === "'" && s === "'") && (e = e.slice(1, -1).trim(), !e) ? "" : e;
  }
}
const Nd = "rbi-button", Pd = "rbi-icon";
class Fd extends HTMLElement {
  constructor() {
    super(), this.initialStates = /* @__PURE__ */ new Map(), this._controlledElements = [], this.button = null, this.lastOverallModifiedState = null, this.handleInputChange = this.handleInputChange.bind(this), this.handleReset = this.handleReset.bind(this);
  }
  static get observedAttributes() {
    return ["controls", "wrapper-class", "modified-class-suffix", "button-aria-label"];
  }
  connectedCallback() {
    const t = `
              <button type="button" class="${Nd} cursor-pointer disabled:cursor-default" aria-label="Reset field" data-tippy-placement="right" data-tippy-content="Feld zurücksetzen">
								<span class="${Pd} ri-arrow-go-back-fill"></span>
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
      const s = document.getElementById(i);
      s ? (e.push(s), this.storeInitialState(s), s.addEventListener("input", this.handleInputChange), s.addEventListener("change", this.handleInputChange)) : console.warn(`ResetButtonIndividual: Element with ID "${i}" not found.`);
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
        const i = Array.from(t.options).filter((r) => r.selected).map((r) => r.value), s = e.selectedOptions;
        return i.length !== s.length || i.some((r) => !s.includes(r)) || s.some((r) => !i.includes(r));
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
        const s = this.getAttribute("modified-class-suffix") || "modified", r = `${e}-${s}`;
        t ? i.classList.add(r) : i.classList.remove(r);
      }
    }
    if (this.button && (this.button.disabled = !t || this._controlledElements.length === 0, this.button.disabled ? this.button.setAttribute("aria-disabled", "true") : this.button.removeAttribute("aria-disabled")), this.lastOverallModifiedState !== t) {
      const i = new CustomEvent("rbichange", {
        bubbles: !0,
        composed: !0,
        detail: {
          modified: t,
          controlledElementIds: this._controlledElements.map((s) => s.id),
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
        const i = this._controlledElements[0], s = document.querySelector(`label[for="${i.id}"]`);
        let r = i.name || i.id;
        s && s.textContent ? r = s.textContent.trim().replace(/[:*]$/, "").trim() : i.getAttribute("aria-label") && (r = i.getAttribute("aria-label")), t = `Reset ${r}`;
      } else e.length > 1 ? t = "Reset selected fields" : t = "Reset field";
    }
    this.button.setAttribute("aria-label", t);
  }
}
const kt = "hidden", so = "dm-stay", Ji = "dm-title", ns = "dm-menu-button", qd = "dm-target", Hd = "data-dm-target", ro = "dm-menu", oo = "dm-menu-item", Ud = "dm-close-button";
class $d extends HTMLElement {
  constructor() {
    super(), this.#t(), this.boundHandleClickOutside = this.handleClickOutside.bind(this);
  }
  #t() {
    this._cildren = [], this._rendered = [], this._target = null, this._button = null, this._menu = null, this._originalButtonText = null;
  }
  connectedCallback() {
    this._target = document.getElementById(this.getAttribute(qd)), this._target || (this._target = this), this._cildren = Array.from(this.children).filter((e) => e.nodeType === Node.ELEMENT_NODE && !e.classList.contains(ns)).map((e) => ({
      node: e,
      target: () => {
        const i = e.getAttribute(Hd);
        return i ? document.getElementById(i) || this._target : this._target;
      },
      stay: () => e.hasAttribute(so) && e.getAttribute(so) == "true",
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
    this._button = this.querySelector(`.${ns}`), !this._button && t && (this._button = t, this._button.parentElement || this.appendChild(this._button)), this._button || (this._button = document.createElement("button"), this._button.type = "button", this._button.classList.add(ns, kt), this._button.innerHTML = '<i class="ri-add-line"></i> Felder hinzufügen', this.appendChild(this._button)), this._originalButtonText || (this._originalButtonText = this._button.innerHTML);
    for (const e of this._cildren)
      this.removeChild(e.node);
    this._button.addEventListener("click", this._toggleMenu.bind(this)), this._button.classList.add("relative");
    for (const e of this._cildren)
      e.node.querySelectorAll(`.${Ud}`).forEach((s) => {
        s.addEventListener("click", (r) => {
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
    const i = this._cildren.find((r) => r.node === e);
    if (!i) {
      console.error("DivManagerMenu: Child not found.");
      return;
    }
    i.node.classList.add(kt), this._clearFields(i.node);
    const s = i.target();
    s && s.contains(i.node) && s.removeChild(i.node), i.node.parentElement || this.appendChild(i.node), this.renderButton(), this.renderMenu(), this.updateTargetVisibility();
  }
  showDiv(t, e) {
    if (t && (t.preventDefault(), t.stopPropagation()), e < 0 || e >= this._cildren.length) {
      console.error("DivManagerMenu: Invalid index.");
      return;
    }
    const i = this._cildren[e];
    if (i.node.classList.remove(kt), this.insertChildInOrder(i), this.renderMenu(), this.renderButton(), this.updateTargetVisibility(), typeof window.TextareaAutoResize == "function") {
      const s = i.node.querySelectorAll("textarea");
      s.length > 0 && setTimeout(() => {
        s.forEach((r) => {
          r.dataset.dmResizeBound !== "true" && (r.dataset.dmResizeBound = "true", r.addEventListener("input", () => {
            window.TextareaAutoResize(r);
          })), window.TextareaAutoResize(r);
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
    (!this._menu || !this._button.contains(this._menu)) && (this._button.insertAdjacentHTML("beforeend", `<div class="${ro} absolute hidden"></div>`), this._menu = this._button.querySelector(`.${ro}`)), this._menu.innerHTML = `${t.map((i, s) => `
				<button type="button" class="${oo}" dm-itemno="${this._cildren.indexOf(i)}">
					${i.name()}
				</button>`).join("")}`, this._menu.querySelectorAll(`.${oo}`).forEach((i) => {
      i.addEventListener("click", (s) => {
        this.showDiv(s, parseInt(i.getAttribute("dm-itemno"))), this.hideMenu(), this.renderButton();
      });
    });
  }
  renderIntoTarget() {
    this._cildren.forEach((t) => {
      t.hidden() || this.insertChildInOrder(t);
    }), this.updateTargetVisibility();
  }
  insertChildInOrder(t) {
    const e = t.target(), i = this._cildren.indexOf(t), s = this._cildren.slice(i + 1).filter((r) => r.target() === e).map((r) => r.node).find((r) => e && e.contains(r));
    e && (s ? e.insertBefore(t.node, s) : e.appendChild(t.node));
  }
  updateTargetVisibility() {
    new Set(
      this._cildren.map((e) => e.target()).filter((e) => e && e !== this)
    ).forEach((e) => {
      const i = Array.from(e.children).some(
        (s) => !s.classList.contains(kt)
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
const jt = "items-row", jd = "items-list", Vd = "items-template", Wd = "items-add-button", zd = "items-cancel-button", Yi = "items-remove-button", Kd = "items-edit-button", Gd = "items-close-button", Jd = "items-summary", Yd = "items-edit-panel", ss = "items_removed[]", gi = "data-items-removed";
class Xd extends HTMLElement {
  constructor() {
    super(), this._list = null, this._template = null, this._addButton = null, this._idPrefix = `items-editor-${crypto.randomUUID().slice(0, 8)}`, this._handleAdd = this._onAddClick.bind(this);
  }
  connectedCallback() {
    if (this._list = this.querySelector(`.${jd}`), this._template = this.querySelector(`template.${Vd}`), this._addButton = this.querySelector(`.${Wd}`), !this._list || !this._template || !this._addButton) {
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
        const s = e.querySelector("[data-delete-label]");
        s && (s.textContent = s.getAttribute("data-delete-hover") || "Rückgängig");
        const r = e.querySelector("i");
        r && (r.classList.remove("hidden"), r.classList.add("ri-arrow-go-back-line"), r.classList.remove("ri-delete-bin-line"));
      }), e.addEventListener("mouseleave", () => {
        const i = e.closest(`.${jt}`), s = e.querySelector("[data-delete-label]");
        if (!s)
          return;
        i && i.getAttribute(gi) === "true" ? s.textContent = s.getAttribute("data-delete-active") || "Wird entfernt" : s.textContent = s.getAttribute("data-delete-default") || "Entfernen";
        const r = e.querySelector("i");
        r && (i && i.getAttribute(gi) === "true" ? (r.classList.add("hidden"), r.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (r.classList.remove("hidden"), r.classList.add("ri-delete-bin-line"), r.classList.remove("ri-arrow-go-back-line")));
      }));
    });
  }
  _wireCancelButtons(t = this) {
    t.querySelectorAll(`.${zd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const s = e.closest(`.${jt}`);
        s && this._cancelEdit(s);
      }));
    });
  }
  _wireEditButtons(t = this) {
    t.querySelectorAll(`.${Kd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const s = e.closest(`.${jt}`);
        s && this._setRowMode(s, "edit");
      }));
    }), t.querySelectorAll(`.${Gd}`).forEach((e) => {
      e.dataset.itemsBound !== "true" && (e.dataset.itemsBound = "true", e.addEventListener("click", (i) => {
        i.preventDefault();
        const s = e.closest(`.${jt}`);
        s && this._setRowMode(s, "summary");
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
    i && (e ? i.classList.add("hidden") : i.classList.remove("hidden")), t.querySelectorAll("[data-delete-label]").forEach((o) => {
      const a = o.closest(`.${Yi}`), l = a && a.matches(":hover");
      let c;
      e && l ? c = o.getAttribute("data-delete-hover") || "Rückgängig" : e ? c = o.getAttribute("data-delete-active") || "Wird entfernt" : c = o.getAttribute("data-delete-default") || "Entfernen", o.textContent = c;
    }), t.querySelectorAll(`.${Yi} i`).forEach((o) => {
      const a = o.closest(`.${Yi}`), l = a && a.matches(":hover");
      e ? l ? (o.classList.remove("hidden"), o.classList.add("ri-arrow-go-back-line"), o.classList.remove("ri-delete-bin-line")) : (o.classList.add("hidden"), o.classList.remove("ri-delete-bin-line", "ri-arrow-go-back-line")) : (o.classList.remove("hidden"), o.classList.add("ri-delete-bin-line"), o.classList.remove("ri-arrow-go-back-line"));
    });
    const s = t.querySelector('input[name="items_id[]"]'), r = s ? s.value.trim() : "";
    r && (e ? this._ensureRemovalInput(r) : this._removeRemovalInput(r)), t.querySelectorAll("[data-field]").forEach((o) => {
      o.disabled = e;
    });
  }
  _setRowMode(t, e) {
    const i = t.querySelector(`.${Jd}`), s = t.querySelector(`.${Yd}`);
    !i || !s || (e === "edit" ? (i.classList.add("hidden"), s.classList.remove("hidden")) : (i.classList.remove("hidden"), s.classList.add("hidden"), this._syncSummary(t)));
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
      const s = i.getAttribute("data-field-label");
      if (!s)
        return;
      const r = t.querySelector(`[data-field="${s}"]`);
      if (!r)
        return;
      const o = `${this._idPrefix}-${e}-${s}`;
      r.id = o, i.setAttribute("for", o);
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
      const s = t.querySelector(`[data-field="${i}"]`);
      if (!s)
        return;
      const r = this._readFieldValue(s), o = e.getAttribute("data-summary-hide-empty") === "true" ? e.closest("[data-summary-container]") : null;
      r ? (this._setSummaryContent(e, r), e.classList.remove("text-gray-400"), o && o.classList.remove("hidden")) : (this._setSummaryContent(e, "—"), e.classList.add("text-gray-400"), o && o.classList.add("hidden"));
    }), this._syncNewBadge(t);
  }
  _syncNewBadge(t) {
    const e = t.querySelector('input[name="items_id[]"]'), i = e ? e.value.trim() : "";
    t.querySelectorAll("[data-new-badge]").forEach((s) => {
      s.classList.toggle("hidden", i !== "");
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
    if (Array.from(this.querySelectorAll(`input[name="${ss}"]`)).some(
      (s) => s.value === t
    ))
      return;
    const i = document.createElement("input");
    i.type = "hidden", i.name = ss, i.value = t, this.appendChild(i);
  }
  _removeRemovalInput(t) {
    const e = Array.from(this.querySelectorAll(`input[name="${ss}"]`));
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
      const s = i.target.value;
      t.setAttribute("data-status", s), e && this._updateStatusIcon(e, s);
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
      const i = this._parseJSONAttr(t, "data-initial-options") || [], s = this._parseJSONAttr(t, "data-initial-values") || [];
      i.length > 0 && typeof t.setOptions == "function" && t.setOptions(i), s.length > 0 && (t.value = s, typeof t.captureInitialSelection == "function" && t.captureInitialSelection());
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
      let s = null;
      try {
        s = await i.clone().json();
      } catch {
        s = null;
      }
      if (!i.ok) {
        const r = s?.error || `Speichern fehlgeschlagen (${i.status}).`;
        throw new Error(r);
      }
      if (this._isNewEntryPage() && s?.redirect) {
        window.location.assign(s.redirect);
        return;
      }
      await this._reloadForm(s?.message || "Änderungen gespeichert.");
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
    } catch (s) {
      this._showStatus(s instanceof Error ? s.message : String(s), "error");
      return;
    }
    this._setSavingState(!0);
    try {
      const s = await fetch(this._saveEndpoint, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(i)
      });
      if (!s.ok) {
        let r = `Speichern fehlgeschlagen (${s.status}).`;
        try {
          r = (await s.clone().json())?.error || r;
        } catch {
        }
        throw new Error(r);
      }
      window.location.assign(e);
    } catch (s) {
      this._showStatus(s instanceof Error ? s.message : "Speichern fehlgeschlagen.", "error");
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
        }, s = await fetch(this._deleteEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(i)
        });
        let r = null;
        try {
          r = await s.clone().json();
        } catch {
          r = null;
        }
        if (!s.ok) {
          const a = r?.error || `Löschen fehlgeschlagen (${s.status}).`;
          throw new Error(a);
        }
        const o = r?.redirect || "/suche/baende";
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
    const s = Number.parseInt(i, 10);
    if (Number.isNaN(s))
      throw new Error("Jahr ist ungültig.");
    e.year = s;
    const r = t.getAll("languages[]").map((T) => T.trim()).filter(Boolean), o = t.getAll("places[]").map((T) => T.trim()).filter(Boolean), { items: a, removedIds: l } = this._collectItems(t), {
      relations: c,
      deleted: h
    } = this._collectRelations(t, {
      prefix: "entries_series",
      targetField: "series"
    }), g = this._collectNewRelations("entries_series"), b = this._readValue(t, "preferred_series_id");
    if (!b)
      throw new Error("Reihentitel ist erforderlich.");
    const {
      relations: m,
      deleted: v
    } = this._collectRelations(t, {
      prefix: "entries_agents",
      targetField: "agent"
    }), f = this._collectNewRelations("entries_agents"), w = [...c, ...g].map((T) => T.target_id);
    if (w.filter((T, u) => w.indexOf(T) !== u).length > 0)
      throw new Error("Doppelte Reihenverknüpfungen sind nicht erlaubt.");
    if (b && w.includes(b))
      throw new Error("Die bevorzugte Reihe darf nicht zusätzlich als weitere Reihenverknüpfung gesetzt sein.");
    return {
      csrf_token: this._readValue(t, "csrf_token"),
      last_edited: this._readValue(t, "last_edited"),
      entry: e,
      preferred_series_id: b,
      languages: r,
      places: o,
      items: a,
      deleted_item_ids: l,
      series_relations: c,
      new_series_relations: g,
      deleted_series_relation_ids: h,
      agent_relations: m,
      new_agent_relations: f,
      deleted_agent_relation_ids: v
    };
  }
  _collectItems(t) {
    const e = t.getAll("items_id[]").map((g) => g.trim()), i = t.getAll("items_owner[]"), s = t.getAll("items_identifier[]"), r = t.getAll("items_location[]"), o = t.getAll("items_media[]"), a = t.getAll("items_annotation[]"), l = t.getAll("items_uri[]"), c = new Set(
      t.getAll("items_removed[]").map((g) => g.trim()).filter(Boolean)
    ), h = [];
    for (let g = 0; g < e.length; g += 1) {
      const b = e[g] || "";
      if (b && c.has(b))
        continue;
      const m = (i[g] || "").trim(), v = (s[g] || "").trim(), f = (r[g] || "").trim(), A = (a[g] || "").trim(), w = (l[g] || "").trim(), C = (o[g] || "").trim();
      if (b || m || v || f || A || w || C) {
        if (!C)
          throw new Error(`Exemplar ${g + 1}: "Vorhanden als" muss ausgefüllt werden.`);
        h.push({
          id: b,
          owner: m,
          identifier: v,
          location: f,
          annotation: A,
          uri: w,
          media: C ? [C] : []
        });
      }
    }
    return {
      items: h,
      removedIds: Array.from(c)
    };
  }
  _collectRelations(t, { prefix: e, targetField: i }) {
    const s = [], r = [], o = e === "entries_series";
    for (const [a, l] of t.entries()) {
      if (!a.startsWith(`${e}_id[`))
        continue;
      const c = a.slice(a.indexOf("[") + 1, -1), h = `${e}_${i}[${c}]`, g = `${e}_delete[${c}]`, b = `${e}_annotation[${c}]`, m = (l || "").trim(), v = (t.get(h) || "").trim();
      if (!v || !m)
        continue;
      if (t.has(g)) {
        r.push(m);
        continue;
      }
      if (o) {
        s.push({
          id: m,
          target_id: v,
          annotation: (t.get(b) || "").trim()
        });
        continue;
      }
      const f = `${e}_type[${c}]`, A = `${e}_uncertain[${c}]`;
      s.push({
        id: m,
        target_id: v,
        type: (t.get(f) || "").trim(),
        uncertain: t.has(A)
      });
    }
    return { relations: s, deleted: r };
  }
  _collectNewRelations(t) {
    const e = t === "entries_series", i = this.querySelector(`content-person-relations[data-prefix='${t}']`) || this.querySelector(`content-series-relations[data-prefix='${t}']`);
    if (!i)
      return [];
    const s = i.querySelectorAll("[data-kind='new']"), r = [];
    return s.forEach((o) => {
      const a = o.querySelector(`input[name='${t}_new_id']`);
      if (!a)
        return;
      const l = a.value.trim();
      if (!l)
        return;
      if (e) {
        const g = o.querySelector(`input[name='${t}_new_annotation'], textarea[name='${t}_new_annotation']`);
        r.push({
          target_id: l,
          annotation: (g?.value || "").trim()
        });
        return;
      }
      const c = o.querySelector(`select[name='${t}_new_type']`), h = o.querySelector(`input[name='${t}_new_uncertain']`);
      r.push({
        target_id: l,
        type: (c?.value || "").trim(),
        uncertain: !!h?.checked
      });
    }), r;
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
    const s = await i.text(), o = new DOMParser().parseFromString(s, "text/html"), a = o.querySelector("#changealmanachform"), l = this.querySelector("#changealmanachform");
    if (!a || !l)
      throw new Error("Formular konnte nicht geladen werden.");
    l.replaceWith(a), this._form = a;
    const c = o.querySelector("#user-message"), h = this.querySelector("#user-message");
    c && h && h.replaceWith(c);
    const g = o.querySelector("#almanach-header-data"), b = this.querySelector("#almanach-header-data");
    g && b && b.replaceWith(g), this._initForm(), this._initPlaces(), this._initSaveHandling(), typeof window.TextareaAutoResize == "function" && setTimeout(() => {
      this.querySelectorAll("textarea").forEach((m) => {
        window.TextareaAutoResize(m);
      });
    }, 100);
  }
}
class Zd extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      const t = this.querySelector("form");
      t && typeof window.FormLoad == "function" && window.FormLoad(t), this._setupDelete(), this._setupStatusSelect();
    }, 0);
  }
  _setupStatusSelect() {
    const t = Array.from(this.querySelectorAll(".status-select"));
    t.length !== 0 && t.forEach((e) => {
      const i = e.parentElement?.querySelector(".status-icon");
      e.addEventListener("change", (s) => {
        const r = s.target.value;
        e.setAttribute("data-status", r), i && this._updateStatusIcon(i, r);
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
    const i = this.querySelector("[data-role='edit-delete-dialog']"), s = this.querySelector("[data-role='edit-delete']"), r = this.querySelector("[data-role='edit-delete-confirm']"), o = this.querySelector("[data-role='edit-delete-cancel']");
    if (!i || !s || !r || !o)
      return;
    s.addEventListener("click", (l) => {
      l.preventDefault(), typeof i.showModal == "function" && i.showModal();
    });
    const a = (l) => {
      l && l.preventDefault(), i.open && i.close();
    };
    o.addEventListener("click", a), i.addEventListener("cancel", a), r.addEventListener("click", async (l) => {
      l.preventDefault(), a();
      const c = new FormData(t), h = {
        csrf_token: c.get("csrf_token") || "",
        last_edited: c.get("last_edited") || ""
      }, g = await fetch(e, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(h)
      });
      if (!g.ok)
        return;
      const m = (await g.json().catch(() => null))?.redirect || "/";
      window.location.assign(m);
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
    const e = t.value.trim(), i = t.getAttribute("data-duplicate-endpoint"), s = t.getAttribute("data-duplicate-result-key"), r = t.getAttribute("data-duplicate-current-id") || "", o = document.querySelector(`[data-duplicate-warning-for="${t.id}"]`);
    if (!(!o || !i || !s)) {
      if (e === "") {
        o.classList.add("hidden");
        return;
      }
      try {
        const a = new URL(i, window.location.origin);
        a.searchParams.set("q", e), a.searchParams.set("limit", "100");
        const l = await fetch(a.toString());
        if (!l.ok)
          return;
        const h = (await l.json())[s] || [];
        let g = h;
        r && (g = h.filter((m) => m.id !== r));
        const b = g.filter((m) => m.name && m.name.toLowerCase() === e.toLowerCase());
        if (b.length > 0) {
          const m = o.querySelector("[data-duplicate-count]");
          if (m) {
            const v = b.length === 1 ? "" : "e";
            m.textContent = `Der Name ist bereits vorhanden (${b.length} Treffer${v})`;
          }
          o.classList.remove("hidden");
        } else
          o.classList.add("hidden");
      } catch (a) {
        console.error("Duplicate check failed:", a);
      }
    }
  }
}
const ao = "content-images-list", lo = "content-images-dialog", co = "content-images-close", uo = "content-images-full", ho = "content-images-delete-dialog", mo = "content-images-delete-confirm", po = "content-images-delete-cancel", fo = "content-images-delete-name", iu = "300x0", nu = "0x1000", ja = (n, t) => {
  if (!n)
    return "";
  if (n.includes("thumb="))
    return n;
  const e = n.includes("?") ? "&" : "?";
  return `${n}${e}thumb=${t}`;
}, su = (n) => ja(n, nu), go = (n) => {
  if (!n)
    return "";
  const e = (n.split("?")[0] || "").split("/");
  return e[e.length - 1] || "";
}, ru = (n, t) => {
  const e = Array.isArray(t) ? t : [];
  return (Array.isArray(n) ? n : []).map((i, s) => {
    if (typeof i == "string") {
      const r = e[s] || go(i);
      return { url: i, name: r };
    }
    if (i && typeof i == "object") {
      const r = i.url || "", o = i.name || e[s] || go(r);
      return { url: r, name: o };
    }
    return { url: "", name: "" };
  });
};
class ou extends HTMLElement {
  connectedCallback() {
    if (this.dataset.init === "true")
      return;
    this.dataset.init = "true", this._pendingFiles = [], this._pendingUrls = [], this._pendingDeletes = /* @__PURE__ */ new Set(), this._pendingIds = [], this._pendingIdCounter = 0, this._scanOrder = [], this._wireUpload();
    const t = this.getAttribute("data-images") || "[]", e = this.getAttribute("data-files") || "[]";
    let i = [], s = [];
    try {
      i = JSON.parse(t);
    } catch {
      i = [];
    }
    try {
      s = JSON.parse(e);
    } catch {
      s = [];
    }
    const r = ru(i, s);
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
    e.forEach((s) => {
      this._pendingFiles.push(s), this._pendingUrls.push(URL.createObjectURL(s));
      const r = `p${Date.now()}_${this._pendingIdCounter++}`;
      this._pendingIds.push(r), i.push(r);
    }), Array.isArray(this._scanOrder) || (this._scanOrder = []), this._scanOrder = this._scanOrder.concat(i.map((s) => `pending:${s}`)), this._render(this._currentImages || []);
  }
  _render(t) {
    this._currentImages = t, this.classList.add("block"), this.style.display = "block", this.style.width = "100%";
    const e = this._ensureList(), i = this._ensureUploadProxy();
    i && i.parentElement === e && i.remove(), e.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((m) => {
      m.remove();
    });
    const s = this.getAttribute("data-delete-endpoint") || "", r = this.getAttribute("data-content-id") || "", o = this.getAttribute("data-csrf-token") || "", a = s && r && o, l = /* @__PURE__ */ new Map();
    t.forEach((m) => {
      m && m.name && l.set(m.name, m);
    }), (!Array.isArray(this._scanOrder) || this._scanOrder.length === 0) && (this._scanOrder = t.map((m) => `existing:${m.name}`), this._scanOrder = this._scanOrder.concat(this._pendingIds.map((m) => `pending:${m}`)));
    const c = /* @__PURE__ */ new Map();
    this._pendingIds.forEach((m, v) => {
      c.set(m, { url: this._pendingUrls[v] });
    });
    const h = [];
    this._scanOrder.forEach((m) => {
      if (m.startsWith("existing:")) {
        const v = m.slice(9);
        l.has(v) && h.push({ type: "existing", name: v, image: l.get(v) });
        return;
      }
      if (m.startsWith("pending:")) {
        const v = m.slice(8);
        c.has(v) && h.push({ type: "pending", id: v, url: c.get(v).url });
      }
    }), h.forEach((m, v) => {
      if (m.type === "pending") {
        const u = document.createElement("div");
        u.className = "group relative", u.dataset.role = "content-images-pending", u.dataset.scanKey = `pending:${m.id}`, u.draggable = !0;
        const x = document.createElement("button");
        x.type = "button", x.className = [
          "rounded",
          "border",
          "border-dashed",
          "border-slate-300",
          "bg-stone-50",
          "p-1",
          "shadow-sm"
        ].join(" "), x.dataset.imageUrl = m.url, x.dataset.imageIndex = `pending-${v}`;
        const y = document.createElement("img");
        y.src = m.url, y.alt = "Digitalisat (neu)", y.loading = "lazy", y.className = "h-28 w-28 object-cover opacity-70", x.appendChild(y);
        const O = document.createElement("span");
        O.className = "absolute left-1 top-1 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900", O.textContent = "Neu", u.appendChild(x), u.appendChild(O);
        const j = document.createElement("button");
        j.type = "button", j.className = "absolute right-1 top-1 hidden rounded-full border border-red-200 bg-white/90 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm transition group-hover:flex hover:text-red-900 hover:border-red-300", j.innerHTML = '<i class="ri-close-line mr-1"></i>Entfernen', j.addEventListener("click", (z) => {
          z.preventDefault(), z.stopPropagation(), this._removePendingFileById(m.id);
        }), u.appendChild(j), e.appendChild(u);
        return;
      }
      const f = m.image, A = document.createElement("div");
      A.className = "group relative", A.dataset.role = "content-images-item", A.dataset.scanKey = `existing:${m.name}`, A.draggable = !0;
      const w = this._pendingDeletes.has(f.name);
      w && A.classList.add("content-image-pending");
      const C = document.createElement("button");
      C.type = "button", C.className = [
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
      ].join(" "), C.dataset.imageUrl = f.url, C.dataset.imageIndex = String(v), w && (C.setAttribute("aria-disabled", "true"), C.classList.add("content-image-pending-button"));
      const T = document.createElement("img");
      if (T.src = ja(f.url, iu), T.alt = "Digitalisat", T.loading = "lazy", T.className = "h-28 w-28 object-cover", C.appendChild(T), A.appendChild(C), a && f.name) {
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
    const g = this._ensureDialog(), b = g.querySelector(`[data-role='${uo}']`);
    e.addEventListener("click", (m) => {
      const v = m.target.closest("button[data-image-url]");
      if (!v || !b)
        return;
      const f = v.dataset.imageUrl || "", A = f.startsWith("blob:") ? f : su(f);
      b.src = A, b.alt = "Digitalisat", g.showModal ? g.showModal() : g.setAttribute("open", "true");
    }), this._wireDrag(e);
  }
  _ensureList() {
    let t = this.querySelector(`[data-role='${ao}']`);
    return t || (t = document.createElement("div"), t.dataset.role = ao, this.appendChild(t)), t.className = "grid gap-2", t.style.gridTemplateColumns = "repeat(auto-fill, minmax(7rem, 1fr))", t.style.width = "100%", t;
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
    i && URL.revokeObjectURL(i), this._pendingFiles.splice(e, 1), this._pendingUrls.splice(e, 1), this._pendingIds.splice(e, 1), this._scanOrder = this._scanOrder.filter((s) => s !== `pending:${t}`), this._render(this._currentImages || []);
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
      const s = i.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
      if (!s) {
        i.preventDefault();
        return;
      }
      e = s.dataset.scanKey || null, s.classList.add("opacity-60"), i.dataTransfer.effectAllowed = "move", i.dataTransfer.setData("text/plain", "move");
    }), t.addEventListener("dragover", (i) => {
      if (!e)
        return;
      i.preventDefault();
      const s = i.target.closest("[data-role='content-images-item'], [data-role='content-images-pending']");
      if (!s || s.dataset.scanKey === e)
        return;
      const r = s.getBoundingClientRect(), o = i.clientY - r.top < r.height / 2, a = t.querySelector(`[data-scan-key="${CSS.escape(e)}"]`);
      a && (o ? s.before(a) : s.after(a));
    }), t.addEventListener("dragend", () => {
      const i = e ? t.querySelector(`[data-scan-key="${CSS.escape(e)}"]`) : null;
      i && i.classList.remove("opacity-60"), e = null;
      const s = [];
      t.querySelectorAll("[data-role='content-images-item'], [data-role='content-images-pending']").forEach((r) => {
        r.dataset.scanKey && s.push(r.dataset.scanKey);
      }), this._scanOrder = s;
    });
  }
  _ensureDialog() {
    let t = this.querySelector(`[data-role='${lo}']`);
    if (t)
      return t;
    t = document.createElement("dialog"), t.dataset.role = lo, t.className = [
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
					data-role="${co}">
					Schliessen
				</button>
			</div>
			<div class="p-4">
				<img data-role="${uo}" class="max-h-[75vh] w-full object-contain" alt="Digitalisat" />
			</div>
		`;
    const e = t.querySelector(`[data-role='${co}']`);
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
    const i = e.querySelector(`[data-role='${fo}']`);
    i && (i.textContent = t.fileName), e.showModal ? e.showModal() : e.setAttribute("open", "true");
  }
  _ensureDeleteDialog() {
    let t = this.querySelector(`[data-role='${ho}']`);
    if (t)
      return t;
    t = document.createElement("dialog"), t.dataset.role = ho, t.className = [
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
				<div class="text-sm font-bold text-gray-900 mt-1" data-role="${fo}"></div>
				<p class="text-sm text-gray-700 mt-2">
					Das Digitalisat wird dauerhaft entfernt.
				</p>
				<div class="flex items-center justify-end gap-3 mt-4">
					<button type="button" class="resetbutton w-auto px-3 py-1 text-sm" data-role="${po}">Abbrechen</button>
					<button type="button" class="submitbutton w-auto bg-red-700 hover:bg-red-800 px-3 py-1 text-sm" data-role="${mo}">
						Loeschen
					</button>
				</div>
			</div>
		`;
    const e = t.querySelector(`[data-role='${po}']`), i = t.querySelector(`[data-role='${mo}']`), s = () => {
      t.open && t.close();
    };
    return e && e.addEventListener("click", s), t.addEventListener("cancel", (r) => {
      r.preventDefault(), s();
    }), i && i.addEventListener("click", () => {
      this._performDelete(t);
    }), this.appendChild(t), t;
  }
  _performDelete(t) {
    const e = t.dataset.endpoint || "", i = t.dataset.csrfToken || "", s = t.dataset.contentId || "", r = t.dataset.fileName || "";
    if (!e || !i || !s || !r) {
      t.close();
      return;
    }
    const o = this.closest("[data-role='content-images-panel']");
    if (window.htmx?.ajax && o) {
      window.htmx.ajax("POST", e, {
        target: o,
        swap: "outerHTML",
        values: {
          csrf_token: i,
          content_id: s,
          scan: r
        }
      }), t.close();
      return;
    }
    const a = new URLSearchParams();
    a.set("csrf_token", i), a.set("content_id", s), a.set("scan", r), fetch(e, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "HX-Request": "true"
      },
      body: a.toString()
    }).then((l) => !l.ok || !o ? null : l.text()).then((l) => {
      !l || !o || this._applyServerResponse(l, o);
    }).catch(() => null).finally(() => {
      t.close();
    });
  }
  _applyServerResponse(t, e) {
    const i = document.createElement("template");
    i.innerHTML = t.trim(), Array.from(i.content.querySelectorAll("[hx-swap-oob]")).forEach((o) => {
      const a = o.getAttribute("hx-swap-oob") || "", [l, c] = a.split(":"), h = l || "outerHTML", g = c ? document.querySelector(c) : o.id ? document.getElementById(o.id) : null;
      g && (h === "innerHTML" ? g.innerHTML = o.innerHTML : g.outerHTML = o.outerHTML), o.remove();
    });
    const r = i.content.firstElementChild;
    r && e.replaceWith(r);
  }
}
const au = "lookup-field", rs = "lf-input", bo = "lf-list", lu = "lf-option", vo = "lf-hidden-input", yo = "lf-clear-button", _o = "lf-link-button", Ao = "lf-warn-icon", Eo = "lf-dup-warning", xo = 1, So = 10, Lo = 250;
class cu extends HTMLElement {
  constructor() {
    super(), this._endpoint = "", this._resultKey = "items", this._minChars = xo, this._limit = So, this._autocomplete = !0, this._placeholder = "", this._required = !1, this._multiline = !1, this._valueName = "", this._textName = "", this._valueFn = null, this._linkFn = null, this._validFn = null, this._dupEndpoint = "", this._dupResultKey = "", this._dupCurrentId = "", this._dupExact = !0, this._options = [], this._selected = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._dupTimeout = null, this._listVisible = !1, this._input = null, this._hiddenInput = null, this._list = null, this._clearButton = null, this._linkButton = null, this._warnIcon = null, this._dupWarning = null, this._boundHandleInput = this._handleInput.bind(this), this._boundHandleFocus = this._handleFocus.bind(this), this._boundHandleKeyDown = this._handleKeyDown.bind(this), this._boundHandleClear = this._handleClear.bind(this), this._boundHandleClickOutside = this._handleClickOutside.bind(this);
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
    const t = this.getAttribute("data-multiline") === "true", e = this.hasAttribute("data-text-name"), i = e && this.getAttribute("data-text-name") || "", s = this.getAttribute("data-value-name") || "", r = this.getAttribute("placeholder") || "", o = this.getAttribute("id") ? `${this.getAttribute("id")}-input` : "", a = this.getAttribute("value") || "", c = this.getAttribute("data-no-enter") === "true" ? " no-enter" : "", h = this.getAttribute("name") || "", g = e ? i : h, b = g ? ` name="${g}"` : "", m = t ? `<textarea id="${o}" class="${rs} inputinput w-full${c}" rows="1" placeholder="${r}"${b}>${a}</textarea>` : `<input id="${o}" type="text" class="${rs} inputinput w-full${c}" placeholder="${r}" value="${a}"${b} />`, v = s ? `<input type="hidden" class="${vo}" name="${s}" value="" />` : "";
    this.innerHTML = `
			<div class="${au} relative">
				<div class="inputshell flex items-center gap-2">
					${m.replace(/(class="[^"]*)"/, `$1" ${b}`)}
					<a class="${_o} hidden text-sm text-gray-600 hover:text-gray-900 no-underline" aria-label="Auswahl öffnen" target="_blank" rel="noopener">
						<i class="ri-external-link-line"></i>
					</a>
					<span class="${Ao} hidden text-red-700 text-lg" aria-hidden="true">
						<i class="ri-error-warning-line"></i>
					</span>
					<button type="button" class="${yo} text-sm text-gray-600 hover:text-gray-900" aria-label="Eingabe löschen">
						<i class="ri-close-line"></i>
					</button>
				</div>
				${v}
				<div class="${bo} absolute left-0 right-0 mt-1 border border-stone-200 rounded-xs bg-white shadow-sm z-10 hidden max-h-64 overflow-auto"></div>
				<div class="${Eo} hidden text-sm text-blue-700 mt-1 flex items-center gap-2">
					<i class="ri-information-line"></i>
					<span data-role="dup-text"></span>
				</div>
			</div>
		`;
  }
  _bindElements() {
    this._input = this.querySelector(`.${rs}`), this._hiddenInput = this.querySelector(`.${vo}`), this._list = this.querySelector(`.${bo}`), this._clearButton = this.querySelector(`.${yo}`), this._linkButton = this.querySelector(`.${_o}`), this._warnIcon = this.querySelector(`.${Ao}`), this._dupWarning = this.querySelector(`.${Eo}`), this._input && (this._input.addEventListener("input", this._boundHandleInput), this._input.addEventListener("focus", this._boundHandleFocus), this._input.addEventListener("keydown", this._boundHandleKeyDown)), this._clearButton && this._clearButton.addEventListener("click", this._boundHandleClear), document.addEventListener("click", this._boundHandleClickOutside);
  }
  _syncFromAttributes() {
    this._endpoint = this.getAttribute("data-endpoint") || "", this._resultKey = this.getAttribute("data-result-key") || "items", this._minChars = this._parsePositiveInt(this.getAttribute("data-minchars"), xo), this._limit = this._parsePositiveInt(this.getAttribute("data-limit"), So), this._autocomplete = this.getAttribute("data-autocomplete") !== "false", this._placeholder = this.getAttribute("placeholder") || "", this._required = this.getAttribute("data-required") === "true", this._multiline = this.getAttribute("data-multiline") === "true", this._valueName = this.getAttribute("data-value-name") || "", this._textName = this.hasAttribute("data-text-name") && this.getAttribute("data-text-name") || "", this._valueFn = this._getFn(this.getAttribute("data-value-fn")), this._linkFn = this._getFn(this.getAttribute("data-link-fn")), this._validFn = this._getFn(this.getAttribute("data-valid-fn")), this._dupEndpoint = this.getAttribute("data-dup-endpoint") || "", this._dupResultKey = this.getAttribute("data-dup-result-key") || "", this._dupCurrentId = this.getAttribute("data-dup-current-id") || "", this._dupExact = this.getAttribute("data-dup-exact") !== "false";
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
    }, Lo);
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
      const s = await i.json(), r = Array.isArray(s?.[this._resultKey]) ? s[this._resultKey] : [];
      this._options = r.filter((o) => o && o.id && o.name).map((o) => {
        if ("musenalm_id" in o && o.musenalm_id)
          return o;
        const a = o.MusenalmID || o.musenalmId || o.musenalmID || "";
        return a ? { ...o, musenalm_id: a } : o;
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
      const s = e === this._highlightedIndex;
      i.classList.toggle("bg-slate-100", s), i.setAttribute("aria-selected", s ? "true" : "false");
      const r = document.createElement("div");
      if (r.className = "text-sm font-semibold text-gray-800", r.textContent = t.name, i.appendChild(r), t.detail) {
        const o = document.createElement("div");
        o.className = "text-xs text-gray-600", o.textContent = t.detail, i.appendChild(o);
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
    const i = (t || "").trim().toLowerCase(), s = (e || "").trim().toLowerCase();
    return i !== "" && i === s;
  }
  _maybeAutoSelectExactMatch(t) {
    const e = this._options.find((s) => this._isExactMatch(t, s?.name || ""));
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
    const s = this._linkFn ? this._linkFn({ item: this._selected, value: e || t }) : "";
    if (this._warnIcon && this._linkButton && (i ? s ? (this._warnIcon.classList.add("hidden"), this._linkButton.classList.remove("hidden"), this._linkButton.setAttribute("href", s)) : (this._warnIcon.classList.add("hidden"), this._linkButton.classList.add("hidden")) : (this._warnIcon.classList.remove("hidden"), this._linkButton.classList.add("hidden"))), this._clearButton) {
      const r = t.length > 0;
      this._clearButton.classList.toggle("hidden", !r || !i);
      const o = this._clearButton.querySelector("i");
      o && (o.className = "ri-check-line", this._clearButton.classList.add("text-green-600", "hover:text-green-800"), this._clearButton.classList.remove("text-gray-600", "hover:text-gray-900"));
    }
  }
  _maybeCheckDuplicates(t) {
    !this._dupEndpoint || !this._dupResultKey || !this._dupWarning || (this._dupTimeout && clearTimeout(this._dupTimeout), this._dupTimeout = setTimeout(() => {
      this._checkDuplicates(t);
    }, Lo));
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
      const s = await fetch(i.toString());
      if (!s.ok)
        return;
      const o = (await s.json())[this._dupResultKey] || [];
      let a = o;
      this._dupCurrentId && (a = o.filter((c) => c.id !== this._dupCurrentId));
      const l = this._dupExact ? a.filter((c) => c.name && c.name.toLowerCase() === e.toLowerCase()) : a;
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
    const s = new URLSearchParams();
    s.set("csrf_token", this.getCsrfToken()), s.set("export_type", e || "data");
    try {
      const r = await fetch(this.runUrl, {
        method: "POST",
        body: s,
        credentials: "same-origin"
      });
      if (!r.ok) {
        const a = await this.extractError(r);
        this.setStatus(a || "Export konnte nicht gestartet werden.", !0);
        return;
      }
      const o = await this.safeJson(r);
      if (o && o.error) {
        this.setStatus(o.error, !0);
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
      const o = e.getAttribute("data-export-type") || "data";
      await this.handleRun(t, o);
      return;
    }
    if (t.target.closest("[data-role='fts5-rebuild']")) {
      await this.handleFts5Rebuild(t);
      return;
    }
    const s = t.target.closest("[data-action]");
    if (!s) return;
    if (s.getAttribute("data-action") === "delete") {
      const o = s.getAttribute("data-id");
      if (!o || !this.deleteUrl || !confirm("Soll der Export wirklich gelöscht werden?")) return;
      await this.deleteExport(o);
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
      const s = await this.safeJson(i);
      if (s && s.error) {
        this.setStatus(s.error, !0);
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
    const e = this.fts5StatusValue, i = this.normalizeText(t.status) || "idle", s = this.normalizeText(t.message || ""), r = this.normalizeText(t.error || ""), o = Number.isFinite(t.done) ? t.done : 0, a = Number.isFinite(t.total) ? t.total : 0, l = this.formatGermanDateTime(this.normalizeText(t.last_rebuild || ""));
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
    ), (i === "running" || i === "restarting") && (this.fts5HadRunning = !0), i === "complete" && !this.fts5HadRunning ? (this.fts5Status.textContent = "", this.fts5Status.classList.add("hidden")) : i === "error" ? (this.fts5Status.textContent = r || "FTS5-Neuaufbau fehlgeschlagen.", this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200")) : i === "aborted" ? (this.fts5Status.textContent = s || "FTS5-Neuaufbau abgebrochen.", this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200")) : i === "complete" ? (this.fts5Status.textContent = s || "FTS5-Neuaufbau abgeschlossen.", this.fts5Status.classList.add("text-green-800", "bg-green-50", "border-green-200")) : i === "restarting" ? (this.fts5Status.textContent = s || "FTS5-Neuaufbau wird neu gestartet.", this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200")) : i === "running" ? (this.fts5Status.textContent = s || "FTS5-Neuaufbau läuft.", this.fts5Status.classList.add("text-amber-800", "bg-amber-50", "border-amber-200")) : (this.fts5Status.textContent = s || "", this.fts5Status.textContent ? this.fts5Status.classList.add("text-slate-700", "bg-slate-50", "border-slate-200") : this.fts5Status.classList.add("hidden")), this.fts5Status.textContent && this.fts5Status.classList.remove("hidden"), this.fts5Progress && (i === "running" || i === "restarting" ? this.fts5Progress.classList.remove("hidden") : this.fts5Progress.classList.add("hidden")), this.fts5Button) {
      const c = i === "running";
      this.fts5ButtonLabel && (this.fts5ButtonLabel.textContent = c ? "Abbrechen & neu starten" : "Neuaufbau starten"), this.fts5Button.classList.toggle("bg-slate-900", !c), this.fts5Button.classList.toggle("hover:bg-slate-800", !c), this.fts5Button.classList.toggle("bg-amber-600", c), this.fts5Button.classList.toggle("hover:bg-amber-700", c);
    }
    if (this.fts5LastRebuild && l && (this.fts5LastRebuild.textContent = l, this.fts5LastRebuildWrap && this.fts5LastRebuildWrap.classList.remove("hidden")), e === "running" && i !== "running" && window.setTimeout(() => {
      this.refreshFts5Status();
    }, 500), (i === "running" || i === "restarting") && a > 0) {
      const c = Math.min(100, Math.round(o / a * 100));
      this.fts5ProgressText && (this.fts5ProgressText.textContent = `${o} / ${a}`), this.fts5ProgressPercent && (this.fts5ProgressPercent.textContent = `${c}%`), this.fts5ProgressBar && (this.fts5ProgressBar.style.width = `${c}%`);
    } else (i === "running" || i === "restarting") && (this.fts5ProgressText && (this.fts5ProgressText.textContent = "Wird vorbereitet..."), this.fts5ProgressPercent && (this.fts5ProgressPercent.textContent = ""), this.fts5ProgressBar && (this.fts5ProgressBar.style.width = "0%"));
  }
  formatGermanDateTime(t) {
    const e = String(t || "").trim();
    if (!e) return "";
    const i = e.replace(/^"+|"+$/g, "");
    if (!i.match(
      /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/
    )) return i;
    const r = i.replace(" ", "T"), o = new Date(r);
    if (Number.isNaN(o.getTime())) return i;
    const a = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], l = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], c = o.getDate(), h = l[o.getMonth()], g = o.getFullYear(), b = String(o.getHours()).padStart(2, "0"), m = String(o.getMinutes()).padStart(2, "0");
    return `${a[o.getDay()]}, ${c}. ${h} ${g} ${b}:${m}`;
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
      const s = await fetch(this.fts5RebuildUrl, {
        method: "POST",
        body: i,
        credentials: "same-origin"
      });
      if (!s.ok) {
        const o = await this.extractError(s);
        this.fts5Status && (this.fts5Status.textContent = o || "FTS5-Neuaufbau konnte nicht gestartet werden.", this.fts5Status.classList.remove("hidden", "text-slate-700", "text-green-800", "text-amber-800"), this.fts5Status.classList.add("text-red-700", "bg-red-50", "border-red-200"));
        return;
      }
      const r = await this.safeJson(s);
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
    const t = this.options, e = this.selected, i = this.getAttribute("name") || "content_type[]", s = this.searchable ? `
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
					${s}
					<div class="max-h-64 overflow-y-auto py-1" data-role="content-type-select-list">
						${t.map((r) => `
							<label class="content-editor-meta-option">
								<input
									type="checkbox"
									name="${i}"
									value="${this.escapeAttribute(r.value)}"
									${e.has(r.value) ? "checked" : ""} />
								<span class="truncate">${this.escapeHtml(r.label)}</span>
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
    const e = this.checkboxes.filter((s) => s.checked).map((s) => s.closest("label")?.querySelector("span")?.textContent?.trim() || s.value), i = e.length === 0;
    this.summary.textContent = i ? this.placeholder : e.join(", "), this.summary.classList.toggle("italic", i), this.summary.classList.toggle("text-slate-400", i);
  }
  escapeHtml(t) {
    return String(t).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  }
  escapeAttribute(t) {
    return this.escapeHtml(t);
  }
}
const hu = "[data-role='content-person-add-toggle']", mu = "[data-role='content-person-add-panel']", pu = "[data-role='content-person-add-input']", fu = "[data-role='content-person-add-confirm']", gu = "[data-role='content-person-add-abort']", bu = "[data-role='content-person-add-results']", vu = "[data-role='content-person-add-error']", yu = "[data-role='content-person-empty']", _u = "[data-role='content-person-table-body']", os = "[data-role='content-person-row']", wo = "[data-role='content-person-delete']", Au = "[data-role='content-person-delete-input']", Eu = "[data-role='content-person-name']", xu = "[data-role='content-person-life']", Su = "[data-role='content-person-link']", Co = "[data-role='content-person-type']", To = "[data-role='content-person-uncertain']", Lu = "template[data-role='content-person-new-row-template']", wu = 200;
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
      const s = await i.json();
      this._options = Array.isArray(s?.agents) ? s.agents.filter((r) => r?.id && r?.name) : [], this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._renderResults();
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
    const e = this._template.content.cloneNode(!0), i = e.querySelector(os) || e.firstElementChild;
    if (!i)
      return;
    i.dataset.kind = "new";
    const s = e.querySelector(Su), r = t.musenalm_id || t.id;
    s && (r && (s.href = `${this._linkBase}${r}`), s.classList.toggle("pointer-events-none", !r));
    const o = e.querySelector(Eu);
    o && (o.textContent = t.name || "");
    const a = e.querySelector(xu);
    a && (a.textContent = t.bio || t.detail || "");
    const l = e.querySelector(Co);
    l && (l.name = `${this._prefix}_new_type`, l.value = this._defaultRelation);
    const c = e.querySelector(To);
    c && (c.name = `${this._prefix}_new_uncertain`, c.value = t.id, c.checked = !1);
    const h = e.querySelector("[data-role='content-person-new-id']");
    h && (h.name = `${this._prefix}_new_id`, h.value = t.id), this._tableBody.appendChild(e), this._bindRows(), this._syncUi();
  }
  _bindRows() {
    this.querySelectorAll(os).forEach((t) => {
      if (t.dataset.bound === "true")
        return;
      t.dataset.bound = "true";
      const e = t.querySelector(wo);
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
    t.classList.toggle("bg-red-50", i), t.classList.toggle("opacity-70", i), t.querySelectorAll(`${Co}, ${To}`).forEach((r) => {
      r.disabled = i;
    });
    const s = t.querySelector(wo);
    if (s) {
      const r = s.querySelector("i");
      r && (r.className = i ? "ri-arrow-go-back-line" : "ri-delete-bin-line"), s.setAttribute("aria-label", i ? "Rückgängig" : "Entfernen");
    }
  }
  _syncUi() {
    const t = this.querySelectorAll(os).length;
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
const Tu = "[data-role='content-series-add-toggle']", ku = "[data-role='content-series-add-panel']", Ru = "[data-role='content-series-add-input']", Iu = "[data-role='content-series-add-confirm']", Du = "[data-role='content-series-add-abort']", Ou = "[data-role='content-series-add-results']", Mu = "[data-role='content-series-add-error']", Bu = "[data-role='content-series-empty']", Nu = "[data-role='content-series-table-body']", Xi = "[data-role='content-series-row']", ko = "[data-role='content-series-delete']", Ro = "[data-role='content-series-delete-input']", Pu = "[data-role='content-series-name']", Fu = "[data-role='content-series-link']", qu = "template[data-role='content-series-new-row-template']", Io = "[data-role='content-series-new-id']", Hu = "[data-role='content-series-new-annotation']", Uu = 200, Qi = (n) => n?.title || n?.name || n?.label || "";
class $u extends HTMLElement {
  constructor() {
    super(), this._options = [], this._selectedItem = null, this._highlightedIndex = -1, this._fetchTimeout = null, this._fetchController = null, this._boundHandleDocumentClick = this._handleDocumentClick.bind(this);
  }
  connectedCallback() {
    this.dataset.contentSeriesRelationsBound !== "true" && (this.dataset.contentSeriesRelationsBound = "true", this._prefix = this.getAttribute("data-prefix") || "", this._endpoint = this.getAttribute("data-endpoint") || "/admin/api/series/search", this._linkBase = this.getAttribute("data-link-base") || "/reihe/", this._duplicateError = this.getAttribute("data-error-duplicate") || "Diese Reihe ist bereits verknüpft.", this._tableBody = this.querySelector(Nu), this._addToggle = this.querySelector(Tu), this._addPanel = this.querySelector(ku), this._addInput = this.querySelector(Ru), this._addConfirm = this.querySelector(Iu), this._addAbort = this.querySelector(Du), this._addResults = this.querySelector(Ou), this._addError = this.querySelector(Mu), this._emptyState = this.querySelector(Bu), this._sectionHeader = this.querySelector("[data-role='content-series-section-header']"), this._template = this.querySelector(qu), !(!this._tableBody || !this._addPanel || !this._addInput || !this._addConfirm || !this._addAbort || !this._addResults || !this._template) && (this._addToggle?.addEventListener("click", () => this._openAddPanel()), this._addAbort.addEventListener("click", () => this._closeAddPanel()), this._addConfirm.addEventListener("click", () => this._confirmSelection()), this._addInput.addEventListener("input", () => this._handleInput()), this._addInput.addEventListener("keydown", (t) => this._handleKeyDown(t)), this._bindRows(), this._syncUi(), document.addEventListener("click", this._boundHandleDocumentClick)));
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
      const s = await i.json();
      this._options = Array.isArray(s?.series) ? s.series.filter((r) => r?.id && Qi(r)) : [], this._highlightedIndex = this._options.length > 0 ? 0 : -1, this._renderResults();
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
        return e.querySelector(`${Io}[name='${this._prefix}_new_id']`)?.value === t;
      const i = e.querySelector(`input[name^='${this._prefix}_series[']`), s = e.querySelector(Ro);
      return i?.value === t && !s?.checked;
    });
  }
  _appendNewRow(t) {
    const e = this._template.content.cloneNode(!0), i = e.querySelector(Xi) || e.firstElementChild;
    if (!i)
      return;
    i.dataset.kind = "new";
    const s = e.querySelector(Fu), r = t.musenalm_id || t.id;
    s && (r && (s.href = `${this._linkBase}${r}`), s.classList.toggle("pointer-events-none", !r));
    const o = e.querySelector(Pu);
    o && (o.textContent = Qi(t));
    const a = e.querySelector(Io);
    a && (a.name = `${this._prefix}_new_id`, a.value = t.id);
    const l = e.querySelector(Hu);
    l && (l.name = `${this._prefix}_new_annotation`, l.value = ""), this._tableBody.appendChild(e), this._bindRows(), this._syncUi();
  }
  _bindRows() {
    this.querySelectorAll(Xi).forEach((t) => {
      if (t.dataset.bound === "true")
        return;
      t.dataset.bound = "true";
      const e = t.querySelector(ko);
      e && e.addEventListener("click", () => this._handleDelete(t));
    });
  }
  _handleDelete(t) {
    if (t.dataset.kind === "new") {
      t.remove(), this._syncUi();
      return;
    }
    const e = t.querySelector(Ro);
    if (!e)
      return;
    e.checked = !e.checked;
    const i = e.checked;
    t.classList.toggle("bg-red-50", i), t.classList.toggle("opacity-70", i);
    const s = t.querySelector(ko);
    if (s) {
      const r = s.querySelector("i");
      r && (r.className = i ? "ri-arrow-go-back-line" : "ri-delete-bin-line"), s.setAttribute("aria-label", i ? "Rückgängig" : "Entfernen");
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
var vt = "top", Ot = "bottom", Mt = "right", yt = "left", zs = "auto", Pi = [vt, Ot, Mt, yt], ei = "start", Oi = "end", ju = "clippingParents", Va = "viewport", bi = "popper", Vu = "reference", Do = /* @__PURE__ */ Pi.reduce(function(n, t) {
  return n.concat([t + "-" + ei, t + "-" + Oi]);
}, []), Wa = /* @__PURE__ */ [].concat(Pi, [zs]).reduce(function(n, t) {
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
function It(n) {
  var t = xt(n).HTMLElement;
  return n instanceof t || n instanceof HTMLElement;
}
function Ks(n) {
  if (typeof ShadowRoot > "u")
    return !1;
  var t = xt(n).ShadowRoot;
  return n instanceof t || n instanceof ShadowRoot;
}
function eh(n) {
  var t = n.state;
  Object.keys(t.elements).forEach(function(e) {
    var i = t.styles[e] || {}, s = t.attributes[e] || {}, r = t.elements[e];
    !It(r) || !te(r) || (Object.assign(r.style, i), Object.keys(s).forEach(function(o) {
      var a = s[o];
      a === !1 ? r.removeAttribute(o) : r.setAttribute(o, a === !0 ? "" : a);
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
      var s = t.elements[i], r = t.attributes[i] || {}, o = Object.keys(t.styles.hasOwnProperty(i) ? t.styles[i] : e[i]), a = o.reduce(function(l, c) {
        return l[c] = "", l;
      }, {});
      !It(s) || !te(s) || (Object.assign(s.style, a), Object.keys(r).forEach(function(l) {
        s.removeAttribute(l);
      }));
    });
  };
}
const za = {
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
function Rs() {
  var n = navigator.userAgentData;
  return n != null && n.brands && Array.isArray(n.brands) ? n.brands.map(function(t) {
    return t.brand + "/" + t.version;
  }).join(" ") : navigator.userAgent;
}
function Ka() {
  return !/^((?!chrome|android).)*safari/i.test(Rs());
}
function ni(n, t, e) {
  t === void 0 && (t = !1), e === void 0 && (e = !1);
  var i = n.getBoundingClientRect(), s = 1, r = 1;
  t && It(n) && (s = n.offsetWidth > 0 && ii(i.width) / n.offsetWidth || 1, r = n.offsetHeight > 0 && ii(i.height) / n.offsetHeight || 1);
  var o = $e(n) ? xt(n) : window, a = o.visualViewport, l = !Ka() && e, c = (i.left + (l && a ? a.offsetLeft : 0)) / s, h = (i.top + (l && a ? a.offsetTop : 0)) / r, g = i.width / s, b = i.height / r;
  return {
    width: g,
    height: b,
    top: h,
    right: c + g,
    bottom: h + b,
    left: c,
    x: c,
    y: h
  };
}
function Gs(n) {
  var t = ni(n), e = n.offsetWidth, i = n.offsetHeight;
  return Math.abs(t.width - e) <= 1 && (e = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), {
    x: n.offsetLeft,
    y: n.offsetTop,
    width: e,
    height: i
  };
}
function Ga(n, t) {
  var e = t.getRootNode && t.getRootNode();
  if (n.contains(t))
    return !0;
  if (e && Ks(e)) {
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
    (Ks(n) ? n.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    Se(n)
  );
}
function Oo(n) {
  return !It(n) || // https://github.com/popperjs/popper-core/issues/837
  he(n).position === "fixed" ? null : n.offsetParent;
}
function sh(n) {
  var t = /firefox/i.test(Rs()), e = /Trident/i.test(Rs());
  if (e && It(n)) {
    var i = he(n);
    if (i.position === "fixed")
      return null;
  }
  var s = _n(n);
  for (Ks(s) && (s = s.host); It(s) && ["html", "body"].indexOf(te(s)) < 0; ) {
    var r = he(s);
    if (r.transform !== "none" || r.perspective !== "none" || r.contain === "paint" || ["transform", "perspective"].indexOf(r.willChange) !== -1 || t && r.willChange === "filter" || t && r.filter && r.filter !== "none")
      return s;
    s = s.parentNode;
  }
  return null;
}
function Fi(n) {
  for (var t = xt(n), e = Oo(n); e && nh(e) && he(e).position === "static"; )
    e = Oo(e);
  return e && (te(e) === "html" || te(e) === "body" && he(e).position === "static") ? t : e || sh(n) || t;
}
function Js(n) {
  return ["top", "bottom"].indexOf(n) >= 0 ? "x" : "y";
}
function Ti(n, t, e) {
  return Pe(n, hn(t, e));
}
function rh(n, t, e) {
  var i = Ti(n, t, e);
  return i > e ? e : i;
}
function Ja() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function Ya(n) {
  return Object.assign({}, Ja(), n);
}
function Xa(n, t) {
  return t.reduce(function(e, i) {
    return e[i] = n, e;
  }, {});
}
var oh = function(t, e) {
  return t = typeof t == "function" ? t(Object.assign({}, e.rects, {
    placement: e.placement
  })) : t, Ya(typeof t != "number" ? t : Xa(t, Pi));
};
function ah(n) {
  var t, e = n.state, i = n.name, s = n.options, r = e.elements.arrow, o = e.modifiersData.popperOffsets, a = Zt(e.placement), l = Js(a), c = [yt, Mt].indexOf(a) >= 0, h = c ? "height" : "width";
  if (!(!r || !o)) {
    var g = oh(s.padding, e), b = Gs(r), m = l === "y" ? vt : yt, v = l === "y" ? Ot : Mt, f = e.rects.reference[h] + e.rects.reference[l] - o[l] - e.rects.popper[h], A = o[l] - e.rects.reference[l], w = Fi(r), C = w ? l === "y" ? w.clientHeight || 0 : w.clientWidth || 0 : 0, T = f / 2 - A / 2, u = g[m], x = C - b[h] - g[v], y = C / 2 - b[h] / 2 + T, O = Ti(u, y, x), j = l;
    e.modifiersData[i] = (t = {}, t[j] = O, t.centerOffset = O - y, t);
  }
}
function lh(n) {
  var t = n.state, e = n.options, i = e.element, s = i === void 0 ? "[data-popper-arrow]" : i;
  s != null && (typeof s == "string" && (s = t.elements.popper.querySelector(s), !s) || Ga(t.elements.popper, s) && (t.elements.arrow = s));
}
const ch = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: ah,
  effect: lh,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function si(n) {
  return n.split("-")[1];
}
var dh = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function uh(n, t) {
  var e = n.x, i = n.y, s = t.devicePixelRatio || 1;
  return {
    x: ii(e * s) / s || 0,
    y: ii(i * s) / s || 0
  };
}
function Mo(n) {
  var t, e = n.popper, i = n.popperRect, s = n.placement, r = n.variation, o = n.offsets, a = n.position, l = n.gpuAcceleration, c = n.adaptive, h = n.roundOffsets, g = n.isFixed, b = o.x, m = b === void 0 ? 0 : b, v = o.y, f = v === void 0 ? 0 : v, A = typeof h == "function" ? h({
    x: m,
    y: f
  }) : {
    x: m,
    y: f
  };
  m = A.x, f = A.y;
  var w = o.hasOwnProperty("x"), C = o.hasOwnProperty("y"), T = yt, u = vt, x = window;
  if (c) {
    var y = Fi(e), O = "clientHeight", j = "clientWidth";
    if (y === xt(e) && (y = Se(e), he(y).position !== "static" && a === "absolute" && (O = "scrollHeight", j = "scrollWidth")), y = y, s === vt || (s === yt || s === Mt) && r === Oi) {
      u = Ot;
      var z = g && y === x && x.visualViewport ? x.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        y[O]
      );
      f -= z - i.height, f *= l ? 1 : -1;
    }
    if (s === yt || (s === vt || s === Ot) && r === Oi) {
      T = Mt;
      var K = g && y === x && x.visualViewport ? x.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        y[j]
      );
      m -= K - i.width, m *= l ? 1 : -1;
    }
  }
  var X = Object.assign({
    position: a
  }, c && dh), I = h === !0 ? uh({
    x: m,
    y: f
  }, xt(e)) : {
    x: m,
    y: f
  };
  if (m = I.x, f = I.y, l) {
    var V;
    return Object.assign({}, X, (V = {}, V[u] = C ? "0" : "", V[T] = w ? "0" : "", V.transform = (x.devicePixelRatio || 1) <= 1 ? "translate(" + m + "px, " + f + "px)" : "translate3d(" + m + "px, " + f + "px, 0)", V));
  }
  return Object.assign({}, X, (t = {}, t[u] = C ? f + "px" : "", t[T] = w ? m + "px" : "", t.transform = "", t));
}
function hh(n) {
  var t = n.state, e = n.options, i = e.gpuAcceleration, s = i === void 0 ? !0 : i, r = e.adaptive, o = r === void 0 ? !0 : r, a = e.roundOffsets, l = a === void 0 ? !0 : a, c = {
    placement: Zt(t.placement),
    variation: si(t.placement),
    popper: t.elements.popper,
    popperRect: t.rects.popper,
    gpuAcceleration: s,
    isFixed: t.options.strategy === "fixed"
  };
  t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, Mo(Object.assign({}, c, {
    offsets: t.modifiersData.popperOffsets,
    position: t.options.strategy,
    adaptive: o,
    roundOffsets: l
  })))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, Mo(Object.assign({}, c, {
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
  var t = n.state, e = n.instance, i = n.options, s = i.scroll, r = s === void 0 ? !0 : s, o = i.resize, a = o === void 0 ? !0 : o, l = xt(t.elements.popper), c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return r && c.forEach(function(h) {
    h.addEventListener("scroll", e.update, Zi);
  }), a && l.addEventListener("resize", e.update, Zi), function() {
    r && c.forEach(function(h) {
      h.removeEventListener("scroll", e.update, Zi);
    }), a && l.removeEventListener("resize", e.update, Zi);
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
function on(n) {
  return n.replace(/left|right|bottom|top/g, function(t) {
    return gh[t];
  });
}
var bh = {
  start: "end",
  end: "start"
};
function Bo(n) {
  return n.replace(/start|end/g, function(t) {
    return bh[t];
  });
}
function Ys(n) {
  var t = xt(n), e = t.pageXOffset, i = t.pageYOffset;
  return {
    scrollLeft: e,
    scrollTop: i
  };
}
function Xs(n) {
  return ni(Se(n)).left + Ys(n).scrollLeft;
}
function vh(n, t) {
  var e = xt(n), i = Se(n), s = e.visualViewport, r = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, o = s.height;
    var c = Ka();
    (c || !c && t === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  return {
    width: r,
    height: o,
    x: a + Xs(n),
    y: l
  };
}
function yh(n) {
  var t, e = Se(n), i = Ys(n), s = (t = n.ownerDocument) == null ? void 0 : t.body, r = Pe(e.scrollWidth, e.clientWidth, s ? s.scrollWidth : 0, s ? s.clientWidth : 0), o = Pe(e.scrollHeight, e.clientHeight, s ? s.scrollHeight : 0, s ? s.clientHeight : 0), a = -i.scrollLeft + Xs(n), l = -i.scrollTop;
  return he(s || e).direction === "rtl" && (a += Pe(e.clientWidth, s ? s.clientWidth : 0) - r), {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
function Qs(n) {
  var t = he(n), e = t.overflow, i = t.overflowX, s = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(e + s + i);
}
function Qa(n) {
  return ["html", "body", "#document"].indexOf(te(n)) >= 0 ? n.ownerDocument.body : It(n) && Qs(n) ? n : Qa(_n(n));
}
function ki(n, t) {
  var e;
  t === void 0 && (t = []);
  var i = Qa(n), s = i === ((e = n.ownerDocument) == null ? void 0 : e.body), r = xt(i), o = s ? [r].concat(r.visualViewport || [], Qs(i) ? i : []) : i, a = t.concat(o);
  return s ? a : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    a.concat(ki(_n(o)))
  );
}
function Is(n) {
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
function No(n, t, e) {
  return t === Va ? Is(vh(n, e)) : $e(t) ? _h(t, e) : Is(yh(Se(n)));
}
function Ah(n) {
  var t = ki(_n(n)), e = ["absolute", "fixed"].indexOf(he(n).position) >= 0, i = e && It(n) ? Fi(n) : n;
  return $e(i) ? t.filter(function(s) {
    return $e(s) && Ga(s, i) && te(s) !== "body";
  }) : [];
}
function Eh(n, t, e, i) {
  var s = t === "clippingParents" ? Ah(n) : [].concat(t), r = [].concat(s, [e]), o = r[0], a = r.reduce(function(l, c) {
    var h = No(n, c, i);
    return l.top = Pe(h.top, l.top), l.right = hn(h.right, l.right), l.bottom = hn(h.bottom, l.bottom), l.left = Pe(h.left, l.left), l;
  }, No(n, o, i));
  return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
function Za(n) {
  var t = n.reference, e = n.element, i = n.placement, s = i ? Zt(i) : null, r = i ? si(i) : null, o = t.x + t.width / 2 - e.width / 2, a = t.y + t.height / 2 - e.height / 2, l;
  switch (s) {
    case vt:
      l = {
        x: o,
        y: t.y - e.height
      };
      break;
    case Ot:
      l = {
        x: o,
        y: t.y + t.height
      };
      break;
    case Mt:
      l = {
        x: t.x + t.width,
        y: a
      };
      break;
    case yt:
      l = {
        x: t.x - e.width,
        y: a
      };
      break;
    default:
      l = {
        x: t.x,
        y: t.y
      };
  }
  var c = s ? Js(s) : null;
  if (c != null) {
    var h = c === "y" ? "height" : "width";
    switch (r) {
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
  var e = t, i = e.placement, s = i === void 0 ? n.placement : i, r = e.strategy, o = r === void 0 ? n.strategy : r, a = e.boundary, l = a === void 0 ? ju : a, c = e.rootBoundary, h = c === void 0 ? Va : c, g = e.elementContext, b = g === void 0 ? bi : g, m = e.altBoundary, v = m === void 0 ? !1 : m, f = e.padding, A = f === void 0 ? 0 : f, w = Ya(typeof A != "number" ? A : Xa(A, Pi)), C = b === bi ? Vu : bi, T = n.rects.popper, u = n.elements[v ? C : b], x = Eh($e(u) ? u : u.contextElement || Se(n.elements.popper), l, h, o), y = ni(n.elements.reference), O = Za({
    reference: y,
    element: T,
    placement: s
  }), j = Is(Object.assign({}, T, O)), z = b === bi ? j : y, K = {
    top: x.top - z.top + w.top,
    bottom: z.bottom - x.bottom + w.bottom,
    left: x.left - z.left + w.left,
    right: z.right - x.right + w.right
  }, X = n.modifiersData.offset;
  if (b === bi && X) {
    var I = X[s];
    Object.keys(K).forEach(function(V) {
      var ot = [Mt, Ot].indexOf(V) >= 0 ? 1 : -1, at = [vt, Ot].indexOf(V) >= 0 ? "y" : "x";
      K[V] += I[at] * ot;
    });
  }
  return K;
}
function xh(n, t) {
  t === void 0 && (t = {});
  var e = t, i = e.placement, s = e.boundary, r = e.rootBoundary, o = e.padding, a = e.flipVariations, l = e.allowedAutoPlacements, c = l === void 0 ? Wa : l, h = si(i), g = h ? a ? Do : Do.filter(function(v) {
    return si(v) === h;
  }) : Pi, b = g.filter(function(v) {
    return c.indexOf(v) >= 0;
  });
  b.length === 0 && (b = g);
  var m = b.reduce(function(v, f) {
    return v[f] = Mi(n, {
      placement: f,
      boundary: s,
      rootBoundary: r,
      padding: o
    })[Zt(f)], v;
  }, {});
  return Object.keys(m).sort(function(v, f) {
    return m[v] - m[f];
  });
}
function Sh(n) {
  if (Zt(n) === zs)
    return [];
  var t = on(n);
  return [Bo(n), t, Bo(t)];
}
function Lh(n) {
  var t = n.state, e = n.options, i = n.name;
  if (!t.modifiersData[i]._skip) {
    for (var s = e.mainAxis, r = s === void 0 ? !0 : s, o = e.altAxis, a = o === void 0 ? !0 : o, l = e.fallbackPlacements, c = e.padding, h = e.boundary, g = e.rootBoundary, b = e.altBoundary, m = e.flipVariations, v = m === void 0 ? !0 : m, f = e.allowedAutoPlacements, A = t.options.placement, w = Zt(A), C = w === A, T = l || (C || !v ? [on(A)] : Sh(A)), u = [A].concat(T).reduce(function(W, gt) {
      return W.concat(Zt(gt) === zs ? xh(t, {
        placement: gt,
        boundary: h,
        rootBoundary: g,
        padding: c,
        flipVariations: v,
        allowedAutoPlacements: f
      }) : gt);
    }, []), x = t.rects.reference, y = t.rects.popper, O = /* @__PURE__ */ new Map(), j = !0, z = u[0], K = 0; K < u.length; K++) {
      var X = u[K], I = Zt(X), V = si(X) === ei, ot = [vt, Ot].indexOf(I) >= 0, at = ot ? "width" : "height", st = Mi(t, {
        placement: X,
        boundary: h,
        rootBoundary: g,
        altBoundary: b,
        padding: c
      }), rt = ot ? V ? Mt : yt : V ? Ot : vt;
      x[at] > y[at] && (rt = on(rt));
      var it = on(rt), _t = [];
      if (r && _t.push(st[I] <= 0), a && _t.push(st[rt] <= 0, st[it] <= 0), _t.every(function(W) {
        return W;
      })) {
        z = X, j = !1;
        break;
      }
      O.set(X, _t);
    }
    if (j)
      for (var St = v ? 3 : 1, Gt = function(gt) {
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
function Po(n, t, e) {
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
function Fo(n) {
  return [vt, Mt, Ot, yt].some(function(t) {
    return n[t] >= 0;
  });
}
function Ch(n) {
  var t = n.state, e = n.name, i = t.rects.reference, s = t.rects.popper, r = t.modifiersData.preventOverflow, o = Mi(t, {
    elementContext: "reference"
  }), a = Mi(t, {
    altBoundary: !0
  }), l = Po(o, i), c = Po(a, s, r), h = Fo(l), g = Fo(c);
  t.modifiersData[e] = {
    referenceClippingOffsets: l,
    popperEscapeOffsets: c,
    isReferenceHidden: h,
    hasPopperEscaped: g
  }, t.attributes.popper = Object.assign({}, t.attributes.popper, {
    "data-popper-reference-hidden": h,
    "data-popper-escaped": g
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
  var i = Zt(n), s = [yt, vt].indexOf(i) >= 0 ? -1 : 1, r = typeof e == "function" ? e(Object.assign({}, t, {
    placement: n
  })) : e, o = r[0], a = r[1];
  return o = o || 0, a = (a || 0) * s, [yt, Mt].indexOf(i) >= 0 ? {
    x: a,
    y: o
  } : {
    x: o,
    y: a
  };
}
function Rh(n) {
  var t = n.state, e = n.options, i = n.name, s = e.offset, r = s === void 0 ? [0, 0] : s, o = Wa.reduce(function(h, g) {
    return h[g] = kh(g, t.rects, r), h;
  }, {}), a = o[t.placement], l = a.x, c = a.y;
  t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += l, t.modifiersData.popperOffsets.y += c), t.modifiersData[i] = o;
}
const Ih = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: Rh
};
function Dh(n) {
  var t = n.state, e = n.name;
  t.modifiersData[e] = Za({
    reference: t.rects.reference,
    element: t.rects.popper,
    placement: t.placement
  });
}
const Oh = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Dh,
  data: {}
};
function Mh(n) {
  return n === "x" ? "y" : "x";
}
function Bh(n) {
  var t = n.state, e = n.options, i = n.name, s = e.mainAxis, r = s === void 0 ? !0 : s, o = e.altAxis, a = o === void 0 ? !1 : o, l = e.boundary, c = e.rootBoundary, h = e.altBoundary, g = e.padding, b = e.tether, m = b === void 0 ? !0 : b, v = e.tetherOffset, f = v === void 0 ? 0 : v, A = Mi(t, {
    boundary: l,
    rootBoundary: c,
    padding: g,
    altBoundary: h
  }), w = Zt(t.placement), C = si(t.placement), T = !C, u = Js(w), x = Mh(u), y = t.modifiersData.popperOffsets, O = t.rects.reference, j = t.rects.popper, z = typeof f == "function" ? f(Object.assign({}, t.rects, {
    placement: t.placement
  })) : f, K = typeof z == "number" ? {
    mainAxis: z,
    altAxis: z
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, z), X = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, I = {
    x: 0,
    y: 0
  };
  if (y) {
    if (r) {
      var V, ot = u === "y" ? vt : yt, at = u === "y" ? Ot : Mt, st = u === "y" ? "height" : "width", rt = y[u], it = rt + A[ot], _t = rt - A[at], St = m ? -j[st] / 2 : 0, Gt = C === ei ? O[st] : j[st], U = C === ei ? -j[st] : -O[st], Jt = t.elements.arrow, W = m && Jt ? Gs(Jt) : {
        width: 0,
        height: 0
      }, gt = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : Ja(), q = gt[ot], Lt = gt[at], At = Ti(0, O[st], W[st]), ee = T ? O[st] / 2 - St - At - q - K.mainAxis : Gt - At - q - K.mainAxis, wt = T ? -O[st] / 2 + St + At + Lt + K.mainAxis : U + At + Lt + K.mainAxis, ie = t.elements.arrow && Fi(t.elements.arrow), Le = ie ? u === "y" ? ie.clientTop || 0 : ie.clientLeft || 0 : 0, Ct = (V = X?.[u]) != null ? V : 0, ne = rt + ee - Ct - Le, Tt = rt + wt - Ct, se = Ti(m ? hn(it, ne) : it, rt, m ? Pe(_t, Tt) : _t);
      y[u] = se, I[u] = se - rt;
    }
    if (a) {
      var re, Bt = u === "x" ? vt : yt, oe = u === "x" ? Ot : Mt, bt = y[x], Nt = x === "y" ? "height" : "width", me = bt + A[Bt], Pt = bt - A[oe], Ft = [vt, yt].indexOf(w) !== -1, qt = (re = X?.[x]) != null ? re : 0, Ht = Ft ? me : bt - O[Nt] - j[Nt] - qt + K.altAxis, we = Ft ? bt + O[Nt] + j[Nt] - qt - K.altAxis : Pt, Ce = m && Ft ? rh(Ht, bt, we) : Ti(m ? Ht : me, bt, m ? we : Pt);
      y[x] = Ce, I[x] = Ce - bt;
    }
    t.modifiersData[i] = I;
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
  return n === xt(n) || !It(n) ? Ys(n) : Ph(n);
}
function qh(n) {
  var t = n.getBoundingClientRect(), e = ii(t.width) / n.offsetWidth || 1, i = ii(t.height) / n.offsetHeight || 1;
  return e !== 1 || i !== 1;
}
function Hh(n, t, e) {
  e === void 0 && (e = !1);
  var i = It(t), s = It(t) && qh(t), r = Se(t), o = ni(n, s, e), a = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = {
    x: 0,
    y: 0
  };
  return (i || !i && !e) && ((te(t) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Qs(r)) && (a = Fh(t)), It(t) ? (l = ni(t, !0), l.x += t.clientLeft, l.y += t.clientTop) : r && (l.x = Xs(r))), {
    x: o.left + a.scrollLeft - l.x,
    y: o.top + a.scrollTop - l.y,
    width: o.width,
    height: o.height
  };
}
function Uh(n) {
  var t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), i = [];
  n.forEach(function(r) {
    t.set(r.name, r);
  });
  function s(r) {
    e.add(r.name);
    var o = [].concat(r.requires || [], r.requiresIfExists || []);
    o.forEach(function(a) {
      if (!e.has(a)) {
        var l = t.get(a);
        l && s(l);
      }
    }), i.push(r);
  }
  return n.forEach(function(r) {
    e.has(r.name) || s(r);
  }), i;
}
function $h(n) {
  var t = Uh(n);
  return th.reduce(function(e, i) {
    return e.concat(t.filter(function(s) {
      return s.phase === i;
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
    var s = e[i.name];
    return e[i.name] = s ? Object.assign({}, s, i, {
      options: Object.assign({}, s.options, i.options),
      data: Object.assign({}, s.data, i.data)
    }) : i, e;
  }, {});
  return Object.keys(t).map(function(e) {
    return t[e];
  });
}
var qo = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Ho() {
  for (var n = arguments.length, t = new Array(n), e = 0; e < n; e++)
    t[e] = arguments[e];
  return !t.some(function(i) {
    return !(i && typeof i.getBoundingClientRect == "function");
  });
}
function Wh(n) {
  n === void 0 && (n = {});
  var t = n, e = t.defaultModifiers, i = e === void 0 ? [] : e, s = t.defaultOptions, r = s === void 0 ? qo : s;
  return function(a, l, c) {
    c === void 0 && (c = r);
    var h = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, qo, r),
      modifiersData: {},
      elements: {
        reference: a,
        popper: l
      },
      attributes: {},
      styles: {}
    }, g = [], b = !1, m = {
      state: h,
      setOptions: function(w) {
        var C = typeof w == "function" ? w(h.options) : w;
        f(), h.options = Object.assign({}, r, h.options, C), h.scrollParents = {
          reference: $e(a) ? ki(a) : a.contextElement ? ki(a.contextElement) : [],
          popper: ki(l)
        };
        var T = $h(Vh([].concat(i, h.options.modifiers)));
        return h.orderedModifiers = T.filter(function(u) {
          return u.enabled;
        }), v(), m.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!b) {
          var w = h.elements, C = w.reference, T = w.popper;
          if (Ho(C, T)) {
            h.rects = {
              reference: Hh(C, Fi(T), h.options.strategy === "fixed"),
              popper: Gs(T)
            }, h.reset = !1, h.placement = h.options.placement, h.orderedModifiers.forEach(function(K) {
              return h.modifiersData[K.name] = Object.assign({}, K.data);
            });
            for (var u = 0; u < h.orderedModifiers.length; u++) {
              if (h.reset === !0) {
                h.reset = !1, u = -1;
                continue;
              }
              var x = h.orderedModifiers[u], y = x.fn, O = x.options, j = O === void 0 ? {} : O, z = x.name;
              typeof y == "function" && (h = y({
                state: h,
                options: j,
                name: z,
                instance: m
              }) || h);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: jh(function() {
        return new Promise(function(A) {
          m.forceUpdate(), A(h);
        });
      }),
      destroy: function() {
        f(), b = !0;
      }
    };
    if (!Ho(a, l))
      return m;
    m.setOptions(c).then(function(A) {
      !b && c.onFirstUpdate && c.onFirstUpdate(A);
    });
    function v() {
      h.orderedModifiers.forEach(function(A) {
        var w = A.name, C = A.options, T = C === void 0 ? {} : C, u = A.effect;
        if (typeof u == "function") {
          var x = u({
            state: h,
            name: w,
            instance: m,
            options: T
          }), y = function() {
          };
          g.push(x || y);
        }
      });
    }
    function f() {
      g.forEach(function(A) {
        return A();
      }), g = [];
    }
    return m;
  };
}
var zh = [fh, Oh, mh, za, Ih, wh, Nh, ch, Th], Kh = /* @__PURE__ */ Wh({
  defaultModifiers: zh
}), Gh = "tippy-box", tl = "tippy-content", Jh = "tippy-backdrop", el = "tippy-arrow", il = "tippy-svg-arrow", De = {
  passive: !0,
  capture: !0
}, nl = function() {
  return document.body;
};
function as(n, t, e) {
  if (Array.isArray(n)) {
    var i = n[t];
    return i ?? (Array.isArray(e) ? e[t] : e);
  }
  return n;
}
function Zs(n, t) {
  var e = {}.toString.call(n);
  return e.indexOf("[object") === 0 && e.indexOf(t + "]") > -1;
}
function sl(n, t) {
  return typeof n == "function" ? n.apply(void 0, t) : n;
}
function Uo(n, t) {
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
function $o(n, t) {
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
function jo(n) {
  return Object.keys(n).reduce(function(t, e) {
    return n[e] !== void 0 && (t[e] = n[e]), t;
  }, {});
}
function Ri() {
  return document.createElement("div");
}
function An(n) {
  return ["Element", "Fragment"].some(function(t) {
    return Zs(n, t);
  });
}
function Zh(n) {
  return Zs(n, "NodeList");
}
function tm(n) {
  return Zs(n, "MouseEvent");
}
function em(n) {
  return !!(n && n._tippy && n._tippy.reference === n);
}
function im(n) {
  return An(n) ? [n] : Zh(n) ? mn(n) : Array.isArray(n) ? n : mn(document.querySelectorAll(n));
}
function ls(n, t) {
  n.forEach(function(e) {
    e && (e.style.transitionDuration = t + "ms");
  });
}
function Vo(n, t) {
  n.forEach(function(e) {
    e && e.setAttribute("data-state", t);
  });
}
function nm(n) {
  var t, e = Je(n), i = e[0];
  return i != null && (t = i.ownerDocument) != null && t.body ? i.ownerDocument : document;
}
function sm(n, t) {
  var e = t.clientX, i = t.clientY;
  return n.every(function(s) {
    var r = s.popperRect, o = s.popperState, a = s.props, l = a.interactiveBorder, c = Qh(o.placement), h = o.modifiersData.offset;
    if (!h)
      return !0;
    var g = c === "bottom" ? h.top.y : 0, b = c === "top" ? h.bottom.y : 0, m = c === "right" ? h.left.x : 0, v = c === "left" ? h.right.x : 0, f = r.top - i + g > l, A = i - r.bottom - b > l, w = r.left - e + m > l, C = e - r.right - v > l;
    return f || A || w || C;
  });
}
function cs(n, t, e) {
  var i = t + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(s) {
    n[i](s, e);
  });
}
function Wo(n, t) {
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
}, zo = 0;
function rm() {
  Xt.isTouch || (Xt.isTouch = !0, window.performance && document.addEventListener("mousemove", rl));
}
function rl() {
  var n = performance.now();
  n - zo < 20 && (Xt.isTouch = !1, document.removeEventListener("mousemove", rl)), zo = n;
}
function om() {
  var n = document.activeElement;
  if (em(n)) {
    var t = n._tippy;
    n.blur && !t.state.isVisible && n.blur();
  }
}
function am() {
  document.addEventListener("touchstart", rm, De), window.addEventListener("blur", om);
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
  appendTo: nl,
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
  var t = n.plugins || [], e = t.reduce(function(i, s) {
    var r = s.name, o = s.defaultValue;
    if (r) {
      var a;
      i[r] = n[r] !== void 0 ? n[r] : (a = Kt[r]) != null ? a : o;
    }
    return i;
  }, {});
  return Object.assign({}, n, e);
}
function pm(n, t) {
  var e = t ? Object.keys(ol(Object.assign({}, Kt, {
    plugins: t
  }))) : hm, i = e.reduce(function(s, r) {
    var o = (n.getAttribute("data-tippy-" + r) || "").trim();
    if (!o)
      return s;
    if (r === "content")
      s[r] = o;
    else
      try {
        s[r] = JSON.parse(o);
      } catch {
        s[r] = o;
      }
    return s;
  }, {});
  return i;
}
function Ko(n, t) {
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
function Ds(n, t) {
  n[fm()] = t;
}
function Go(n) {
  var t = Ri();
  return n === !0 ? t.className = el : (t.className = il, An(n) ? t.appendChild(n) : Ds(t, n)), t;
}
function Jo(n, t) {
  An(t.content) ? (Ds(n, ""), n.appendChild(t.content)) : typeof t.content != "function" && (t.allowHTML ? Ds(n, t.content) : n.textContent = t.content);
}
function Os(n) {
  var t = n.firstElementChild, e = mn(t.children);
  return {
    box: t,
    content: e.find(function(i) {
      return i.classList.contains(tl);
    }),
    arrow: e.find(function(i) {
      return i.classList.contains(el) || i.classList.contains(il);
    }),
    backdrop: e.find(function(i) {
      return i.classList.contains(Jh);
    })
  };
}
function al(n) {
  var t = Ri(), e = Ri();
  e.className = Gh, e.setAttribute("data-state", "hidden"), e.setAttribute("tabindex", "-1");
  var i = Ri();
  i.className = tl, i.setAttribute("data-state", "hidden"), Jo(i, n.props), t.appendChild(e), e.appendChild(i), s(n.props, n.props);
  function s(r, o) {
    var a = Os(t), l = a.box, c = a.content, h = a.arrow;
    o.theme ? l.setAttribute("data-theme", o.theme) : l.removeAttribute("data-theme"), typeof o.animation == "string" ? l.setAttribute("data-animation", o.animation) : l.removeAttribute("data-animation"), o.inertia ? l.setAttribute("data-inertia", "") : l.removeAttribute("data-inertia"), l.style.maxWidth = typeof o.maxWidth == "number" ? o.maxWidth + "px" : o.maxWidth, o.role ? l.setAttribute("role", o.role) : l.removeAttribute("role"), (r.content !== o.content || r.allowHTML !== o.allowHTML) && Jo(c, n.props), o.arrow ? h ? r.arrow !== o.arrow && (l.removeChild(h), l.appendChild(Go(o.arrow))) : l.appendChild(Go(o.arrow)) : h && l.removeChild(h);
  }
  return {
    popper: t,
    onUpdate: s
  };
}
al.$$tippy = !0;
var gm = 1, tn = [], ds = [];
function bm(n, t) {
  var e = Ko(n, Object.assign({}, Kt, ol(jo(t)))), i, s, r, o = !1, a = !1, l = !1, c = !1, h, g, b, m = [], v = Uo(ne, e.interactiveDebounce), f, A = gm++, w = null, C = Xh(e.plugins), T = {
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
    state: T,
    plugins: C,
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
  var x = e.render(u), y = x.popper, O = x.onUpdate;
  y.setAttribute("data-tippy-root", ""), y.id = "tippy-" + u.id, u.popper = y, n._tippy = u, y._tippy = u;
  var j = C.map(function(p) {
    return p.fn(u);
  }), z = n.hasAttribute("aria-expanded");
  return ie(), St(), rt(), it("onCreate", [u]), e.showOnCreate && me(), y.addEventListener("mouseenter", function() {
    u.props.interactive && u.state.isVisible && u.clearDelayTimeouts();
  }), y.addEventListener("mouseleave", function() {
    u.props.interactive && u.props.trigger.indexOf("mouseenter") >= 0 && ot().addEventListener("mousemove", v);
  }), u;
  function K() {
    var p = u.props.touch;
    return Array.isArray(p) ? p : [p, 0];
  }
  function X() {
    return K()[0] === "hold";
  }
  function I() {
    var p;
    return !!((p = u.props.render) != null && p.$$tippy);
  }
  function V() {
    return f || n;
  }
  function ot() {
    var p = V().parentNode;
    return p ? nm(p) : document;
  }
  function at() {
    return Os(y);
  }
  function st(p) {
    return u.state.isMounted && !u.state.isVisible || Xt.isTouch || h && h.type === "focus" ? 0 : as(u.props.delay, p ? 0 : 1, Kt.delay);
  }
  function rt(p) {
    p === void 0 && (p = !1), y.style.pointerEvents = u.props.interactive && !p ? "" : "none", y.style.zIndex = "" + u.props.zIndex;
  }
  function it(p, E, L) {
    if (L === void 0 && (L = !0), j.forEach(function(B) {
      B[p] && B[p].apply(B, E);
    }), L) {
      var F;
      (F = u.props)[p].apply(F, E);
    }
  }
  function _t() {
    var p = u.props.aria;
    if (p.content) {
      var E = "aria-" + p.content, L = y.id, F = Je(u.props.triggerTarget || n);
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
      var p = Je(u.props.triggerTarget || n);
      p.forEach(function(E) {
        u.props.interactive ? E.setAttribute("aria-expanded", u.state.isVisible && E === V() ? "true" : "false") : E.removeAttribute("aria-expanded");
      });
    }
  }
  function Gt() {
    ot().removeEventListener("mousemove", v), tn = tn.filter(function(p) {
      return p !== v;
    });
  }
  function U(p) {
    if (!(Xt.isTouch && (l || p.type === "mousedown"))) {
      var E = p.composedPath && p.composedPath()[0] || p.target;
      if (!(u.props.interactive && Wo(y, E))) {
        if (Je(u.props.triggerTarget || n).some(function(L) {
          return Wo(L, E);
        })) {
          if (Xt.isTouch || u.state.isVisible && u.props.trigger.indexOf("click") >= 0)
            return;
        } else
          it("onClickOutside", [u, p]);
        u.props.hideOnClick === !0 && (u.clearDelayTimeouts(), u.hide(), a = !0, setTimeout(function() {
          a = !1;
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
    var p = ot();
    p.addEventListener("mousedown", U, !0), p.addEventListener("touchend", U, De), p.addEventListener("touchstart", W, De), p.addEventListener("touchmove", Jt, De);
  }
  function q() {
    var p = ot();
    p.removeEventListener("mousedown", U, !0), p.removeEventListener("touchend", U, De), p.removeEventListener("touchstart", W, De), p.removeEventListener("touchmove", Jt, De);
  }
  function Lt(p, E) {
    ee(p, function() {
      !u.state.isVisible && y.parentNode && y.parentNode.contains(y) && E();
    });
  }
  function At(p, E) {
    ee(p, E);
  }
  function ee(p, E) {
    var L = at().box;
    function F(B) {
      B.target === L && (cs(L, "remove", F), E());
    }
    if (p === 0)
      return E();
    cs(L, "remove", g), cs(L, "add", F), g = F;
  }
  function wt(p, E, L) {
    L === void 0 && (L = !1);
    var F = Je(u.props.triggerTarget || n);
    F.forEach(function(B) {
      B.addEventListener(p, E, L), m.push({
        node: B,
        eventType: p,
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
    })), Yh(u.props.trigger).forEach(function(p) {
      if (p !== "manual")
        switch (wt(p, Ct), p) {
          case "mouseenter":
            wt("mouseleave", Tt);
            break;
          case "focus":
            wt(cm ? "focusout" : "blur", se);
            break;
          case "focusin":
            wt("focusout", se);
            break;
        }
    });
  }
  function Le() {
    m.forEach(function(p) {
      var E = p.node, L = p.eventType, F = p.handler, B = p.options;
      E.removeEventListener(L, F, B);
    }), m = [];
  }
  function Ct(p) {
    var E, L = !1;
    if (!(!u.state.isEnabled || re(p) || a)) {
      var F = ((E = h) == null ? void 0 : E.type) === "focus";
      h = p, f = p.currentTarget, St(), !u.state.isVisible && tm(p) && tn.forEach(function(B) {
        return B(p);
      }), p.type === "click" && (u.props.trigger.indexOf("mouseenter") < 0 || o) && u.props.hideOnClick !== !1 && u.state.isVisible ? L = !0 : me(p), p.type === "click" && (o = !L), L && !F && Pt(p);
    }
  }
  function ne(p) {
    var E = p.target, L = V().contains(E) || y.contains(E);
    if (!(p.type === "mousemove" && L)) {
      var F = Nt().concat(y).map(function(B) {
        var tt, lt = B._tippy, pe = (tt = lt.popperInstance) == null ? void 0 : tt.state;
        return pe ? {
          popperRect: B.getBoundingClientRect(),
          popperState: pe,
          props: e
        } : null;
      }).filter(Boolean);
      sm(F, p) && (Gt(), Pt(p));
    }
  }
  function Tt(p) {
    var E = re(p) || u.props.trigger.indexOf("click") >= 0 && o;
    if (!E) {
      if (u.props.interactive) {
        u.hideWithInteractivity(p);
        return;
      }
      Pt(p);
    }
  }
  function se(p) {
    u.props.trigger.indexOf("focusin") < 0 && p.target !== V() || u.props.interactive && p.relatedTarget && y.contains(p.relatedTarget) || Pt(p);
  }
  function re(p) {
    return Xt.isTouch ? X() !== p.type.indexOf("touch") >= 0 : !1;
  }
  function Bt() {
    oe();
    var p = u.props, E = p.popperOptions, L = p.placement, F = p.offset, B = p.getReferenceClientRect, tt = p.moveTransition, lt = I() ? Os(y).arrow : null, pe = B ? {
      getBoundingClientRect: B,
      contextElement: B.contextElement || V()
    } : n, fe = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Ut) {
        var ge = Ut.state;
        if (I()) {
          var Ui = at(), Te = Ui.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(ke) {
            ke === "placement" ? Te.setAttribute("data-placement", ge.placement) : ge.attributes.popper["data-popper-" + ke] ? Te.setAttribute("data-" + ke, "") : Te.removeAttribute("data-" + ke);
          }), ge.attributes.popper = {};
        }
      }
    }, ae = [{
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
    I() && lt && ae.push({
      name: "arrow",
      options: {
        element: lt,
        padding: 3
      }
    }), ae.push.apply(ae, E?.modifiers || []), u.popperInstance = Kh(pe, y, Object.assign({}, E, {
      placement: L,
      onFirstUpdate: b,
      modifiers: ae
    }));
  }
  function oe() {
    u.popperInstance && (u.popperInstance.destroy(), u.popperInstance = null);
  }
  function bt() {
    var p = u.props.appendTo, E, L = V();
    u.props.interactive && p === nl || p === "parent" ? E = L.parentNode : E = sl(p, [L]), E.contains(y) || E.appendChild(y), u.state.isMounted = !0, Bt();
  }
  function Nt() {
    return mn(y.querySelectorAll("[data-tippy-root]"));
  }
  function me(p) {
    u.clearDelayTimeouts(), p && it("onTrigger", [u, p]), gt();
    var E = st(!0), L = K(), F = L[0], B = L[1];
    Xt.isTouch && F === "hold" && B && (E = B), E ? i = setTimeout(function() {
      u.show();
    }, E) : u.show();
  }
  function Pt(p) {
    if (u.clearDelayTimeouts(), it("onUntrigger", [u, p]), !u.state.isVisible) {
      q();
      return;
    }
    if (!(u.props.trigger.indexOf("mouseenter") >= 0 && u.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(p.type) >= 0 && o)) {
      var E = st(!1);
      E ? s = setTimeout(function() {
        u.state.isVisible && u.hide();
      }, E) : r = requestAnimationFrame(function() {
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
    clearTimeout(i), clearTimeout(s), cancelAnimationFrame(r);
  }
  function we(p) {
    if (!u.state.isDestroyed) {
      it("onBeforeUpdate", [u, p]), Le();
      var E = u.props, L = Ko(n, Object.assign({}, E, jo(p), {
        ignoreAttributes: !0
      }));
      u.props = L, ie(), E.interactiveDebounce !== L.interactiveDebounce && (Gt(), v = Uo(ne, L.interactiveDebounce)), E.triggerTarget && !L.triggerTarget ? Je(E.triggerTarget).forEach(function(F) {
        F.removeAttribute("aria-expanded");
      }) : L.triggerTarget && n.removeAttribute("aria-expanded"), St(), rt(), O && O(E, L), u.popperInstance && (Bt(), Nt().forEach(function(F) {
        requestAnimationFrame(F._tippy.popperInstance.forceUpdate);
      })), it("onAfterUpdate", [u, p]);
    }
  }
  function Ce(p) {
    u.setProps({
      content: p
    });
  }
  function qi() {
    var p = u.state.isVisible, E = u.state.isDestroyed, L = !u.state.isEnabled, F = Xt.isTouch && !u.props.touch, B = as(u.props.duration, 0, Kt.duration);
    if (!(p || E || L || F) && !V().hasAttribute("disabled") && (it("onShow", [u], !1), u.props.onShow(u) !== !1)) {
      if (u.state.isVisible = !0, I() && (y.style.visibility = "visible"), rt(), gt(), u.state.isMounted || (y.style.transition = "none"), I()) {
        var tt = at(), lt = tt.box, pe = tt.content;
        ls([lt, pe], 0);
      }
      b = function() {
        var ae;
        if (!(!u.state.isVisible || c)) {
          if (c = !0, y.offsetHeight, y.style.transition = u.props.moveTransition, I() && u.props.animation) {
            var Y = at(), Ut = Y.box, ge = Y.content;
            ls([Ut, ge], B), Vo([Ut, ge], "visible");
          }
          _t(), St(), $o(ds, u), (ae = u.popperInstance) == null || ae.forceUpdate(), it("onMount", [u]), u.props.animation && I() && At(B, function() {
            u.state.isShown = !0, it("onShown", [u]);
          });
        }
      }, bt();
    }
  }
  function li() {
    var p = !u.state.isVisible, E = u.state.isDestroyed, L = !u.state.isEnabled, F = as(u.props.duration, 1, Kt.duration);
    if (!(p || E || L) && (it("onHide", [u], !1), u.props.onHide(u) !== !1)) {
      if (u.state.isVisible = !1, u.state.isShown = !1, c = !1, o = !1, I() && (y.style.visibility = "hidden"), Gt(), q(), rt(!0), I()) {
        var B = at(), tt = B.box, lt = B.content;
        u.props.animation && (ls([tt, lt], F), Vo([tt, lt], "hidden"));
      }
      _t(), St(), u.props.animation ? I() && Lt(F, u.unmount) : u.unmount();
    }
  }
  function Hi(p) {
    ot().addEventListener("mousemove", v), $o(tn, v), v(p);
  }
  function ze() {
    u.state.isVisible && u.hide(), u.state.isMounted && (oe(), Nt().forEach(function(p) {
      p._tippy.unmount();
    }), y.parentNode && y.parentNode.removeChild(y), ds = ds.filter(function(p) {
      return p !== u;
    }), u.state.isMounted = !1, it("onHidden", [u]));
  }
  function Ke() {
    u.state.isDestroyed || (u.clearDelayTimeouts(), u.unmount(), Le(), delete n._tippy, u.state.isDestroyed = !0, it("onDestroy", [u]));
  }
}
function ai(n, t) {
  t === void 0 && (t = {});
  var e = Kt.plugins.concat(t.plugins || []);
  am();
  var i = Object.assign({}, t, {
    plugins: e
  }), s = im(n), r = s.reduce(function(o, a) {
    var l = a && bm(a, i);
    return l && o.push(l), o;
  }, []);
  return An(n) ? r[0] : r;
}
ai.defaultProps = Kt;
ai.setDefaultProps = mm;
ai.currentInput = Xt;
Object.assign({}, za, {
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
ai.setDefaultProps({
  render: al
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
    e.addEventListener("click", (s) => {
      (e.getAttribute("data-cancel-url") || "").trim() || (s.preventDefault(), window.history.length > 1 && window.history.back());
    });
  });
}
const ym = ["ri-checkbox-circle-line", "ri-information-line", "ri-search-line", "ri-list-check", "ri-forbid-2-line"];
function tr(n = null) {
  document.querySelectorAll("[data-role='content-status-picker']").forEach((t) => {
    n && t === n || t.querySelector("[data-role='content-status-menu']")?.classList.add("hidden");
  });
}
function us(n, t) {
  if (!(n instanceof HTMLElement))
    return;
  const e = n.querySelector("[data-role='content-status-toggle']");
  if (!(e instanceof HTMLButtonElement))
    return;
  const i = n.querySelector(`[data-role='content-status-option'][data-status='${t}']`), s = e.querySelector("i"), r = i?.dataset.label || "", o = i?.dataset.icon || "ri-forbid-2-line";
  e.dataset.status = t, r && (e.setAttribute("aria-label", `Status: ${r}`), e.setAttribute("title", `Status: ${r}`)), s && (s.classList.remove(...ym), s.classList.add(o));
}
function _m(n, t) {
  !(n instanceof HTMLElement) || !t || (n.dataset.lastEdited = t, n.querySelectorAll("[data-last-edited], [data-place-updated]").forEach((e) => {
    e.hasAttribute("data-last-edited") && e.setAttribute("data-last-edited", t), e.hasAttribute("data-place-updated") && e.setAttribute("data-place-updated", t);
  }));
}
function ll(n = document) {
  (n instanceof HTMLElement || n instanceof Document ? n : document).querySelectorAll("[data-role='content-status-picker'][data-status-endpoint]").forEach((e) => {
    if (!(e instanceof HTMLElement) || e.dataset.statusBound === "true")
      return;
    e.dataset.statusBound = "true";
    const i = e.querySelector("[data-role='content-status-toggle']"), s = e.querySelector("[data-role='content-status-menu']"), r = (e.dataset.statusEndpoint || "").trim();
    !(i instanceof HTMLButtonElement) || !(s instanceof HTMLElement) || !r || (i.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation();
      const a = s.classList.contains("hidden");
      tr(a ? e : null), s.classList.toggle("hidden", !a);
    }), e.querySelectorAll("[data-role='content-status-option']").forEach((o) => {
      o instanceof HTMLButtonElement && o.addEventListener("click", async (a) => {
        a.preventDefault(), a.stopPropagation();
        const l = (o.dataset.status || "").trim(), c = (e.dataset.statusCsrfToken || document.querySelector("[data-role='global-csrf-token']")?.value || "").trim(), h = (e.dataset.lastEdited || "").trim();
        if (!l || !c) {
          s.classList.add("hidden");
          return;
        }
        const g = i.dataset.status || "Unknown";
        us(e, l), gs(e, l), ms(e, l), hs(e, l), fs(e, l), ps(e, l), s.classList.add("hidden"), i.disabled = !0, i.classList.add("opacity-70", "pointer-events-none");
        try {
          const b = await fetch(r, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              csrf_token: c,
              last_edited: h,
              status: l
            })
          }), m = await b.json().catch(() => null);
          if (!b.ok || !m?.success)
            throw new Error(m?.error || "status update failed");
          if (m.status && (us(e, m.status), gs(e, m.status), ms(e, m.status), hs(e, m.status), fs(e, m.status), ps(e, m.status)), m.last_edited) {
            e.dataset.lastEdited = m.last_edited;
            const v = e.closest("tr, [data-role='reihen-row'], [data-role='content-item']");
            v instanceof HTMLElement && _m(v, m.last_edited);
          }
        } catch (b) {
          us(e, g), gs(e, g), ms(e, g), hs(e, g), fs(e, g), ps(e, g), console.error(b);
        } finally {
          i.disabled = !1, i.classList.remove("opacity-70", "pointer-events-none");
        }
      });
    }));
  });
}
function hs(n, t) {
  const e = n.closest("[data-role='beitraege-row']");
  if (!e) return;
  const i = e.querySelector("[data-content-musenalm-id]");
  if (!i) return;
  const s = i.dataset.contentMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/beitrag/${s}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/beitrag/${s}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function ms(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-place-musenalm-id]");
  if (!i) return;
  const s = i.dataset.placeMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/reihen/?place=${s}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/reihen/?place=${s}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function ps(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-series-musenalm-id]");
  if (!i) return;
  const s = i.dataset.seriesMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/reihe/${s}/" onclick="event.stopPropagation();" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/reihe/${s}/" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function fs(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-entry-musenalm-id]");
  if (!i) return;
  const s = i.dataset.entryMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/almanach/${s}" onclick="event.stopPropagation();" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/almanach/${s}" target="_blank" rel="noopener" onclick="event.stopPropagation();" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function gs(n, t) {
  const e = n.closest("tr");
  if (!e) return;
  const i = e.querySelector("[data-person-musenalm-id]");
  if (!i) return;
  const s = i.dataset.personMusenalmId;
  t === "ToDo" ? i.innerHTML = '<span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="Anzeigen (nicht öffentlich)" aria-label="Anzeigen (nicht öffentlich)" aria-disabled="true"><i class="ri-eye-line"></i></span><span class="admin-list-chip pointer-events-none border-stone-200 bg-stone-100 text-stone-400 opacity-60" title="In neuem Tab öffnen (nicht öffentlich)" aria-label="In neuem Tab öffnen (nicht öffentlich)" aria-disabled="true"><i class="ri-external-link-line"></i></span>' : i.innerHTML = `<a href="/person/${s}" class="admin-list-chip" title="Anzeigen" aria-label="Anzeigen"><i class="ri-eye-line"></i></a><a href="/person/${s}" target="_blank" rel="noopener" class="admin-list-chip" title="In neuem Tab öffnen" aria-label="In neuem Tab öffnen"><i class="ri-external-link-line"></i></a>`;
}
function Am() {
  const n = window.location.hash;
  if (!n)
    return;
  const t = document.getElementById(n.slice(1));
  t && t.setAttribute("aria-current", "location");
}
function er() {
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
function cl(n = document) {
  const t = document.getElementById("admin-sidebar");
  if (!t)
    return;
  if (!document.documentElement.classList.contains("admin-layout-sidebar-collapsed")) {
    Em(t);
    return;
  }
  const i = n instanceof Element ? n : t, s = [];
  n instanceof Element && n.matches(pn) && !n._tippy && en(n) && s.push(n), i.querySelectorAll(pn).forEach((r) => {
    r._tippy || !en(r) || s.push(r);
  }), s.length && ai(s, {
    placement: "right",
    arrow: !0,
    delay: [0, 0],
    duration: [100, 80],
    content(r) {
      return en(r);
    },
    onShow(r) {
      r.setContent(en(r.reference));
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
    for (const s of e)
      if (s.isCurrentlyModified()) {
        t(i.details, !0);
        return;
      }
    t(i.details, !1);
  });
}
let vi = null;
function dl() {
  return vi !== null || (typeof CSS < "u" && typeof CSS.supports == "function" ? vi = CSS.supports("field-sizing", "content") : vi = !1), vi;
}
function Sm(n, t) {
  const e = t.lineHeight;
  if (e && e !== "normal") {
    const o = parseFloat(e);
    if (!Number.isNaN(o))
      return o;
  }
  const i = parseFloat(t.fontSize) || 16;
  if (!document.body)
    return i * 1.2;
  const s = document.createElement("span");
  s.textContent = "M", s.style.position = "absolute", s.style.visibility = "hidden", s.style.whiteSpace = "pre", s.style.padding = "0", s.style.margin = "0", s.style.border = "0", s.style.fontFamily = t.fontFamily, s.style.fontSize = t.fontSize, s.style.fontWeight = t.fontWeight, s.style.fontStyle = t.fontStyle, s.style.letterSpacing = t.letterSpacing, s.style.lineHeight = "normal", document.body.appendChild(s);
  const r = s.getBoundingClientRect().height;
  return s.remove(), r || i * 1.2;
}
function Fe(n) {
  if (!(n instanceof HTMLTextAreaElement) || n.dataset.noAutoresize === "true" || n.classList.contains("no-autoresize") || n.offsetParent === null)
    return;
  n.removeAttribute("rows"), n.style.overflow = "auto";
  const t = n.name === "annotation", e = getComputedStyle(n), i = t ? 2 : 1, s = Sm(n, e), r = parseFloat(e.paddingTop) + parseFloat(e.paddingBottom), o = parseFloat(e.borderTopWidth) + parseFloat(e.borderBottomWidth), a = s * i + r, l = e.boxSizing === "border-box" ? a + o : a;
  if (n.value.trim() === "") {
    n.style.height = l + "px";
    return;
  }
  n.style.height = "1px";
  const c = n.scrollHeight, h = e.boxSizing === "border-box" ? c + o : c;
  n.style.height = Math.max(h, l) + "px";
}
function ul(n) {
  n.key === "Enter" && n.preventDefault();
}
function Lm(n) {
  n instanceof HTMLTextAreaElement && (n.dataset.noAutoresize === "true" || n.classList.contains("no-autoresize") || dl() || n.addEventListener("input", () => {
    Fe(n);
  }));
}
function wm(n) {
  n instanceof HTMLTextAreaElement && n.removeEventListener("input", () => {
    Fe(n);
  });
}
function Cm(n) {
  !(n instanceof HTMLTextAreaElement) && n.classList.contains("no-enter") || n.addEventListener("keydown", ul);
}
function Tm(n) {
  !(n instanceof HTMLTextAreaElement) && n.classList.contains("no-enter") || n.removeEventListener("keydown", ul);
}
function km(n) {
  const t = !dl();
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
  for (const o of t)
    o.dataset.noAutoresize === "true" || o.classList.contains("no-autoresize") || o.addEventListener("input", function() {
      Fe(this);
    });
  setTimeout(() => {
    for (const o of t)
      o.dataset.noAutoresize === "true" || o.classList.contains("no-autoresize") || Fe(o);
  }, 200);
  const e = document.querySelectorAll("textarea.no-enter");
  for (const o of e)
    Cm(o);
  new MutationObserver(km).observe(n, {
    childList: !0,
    subtree: !0
  }), new MutationObserver((o) => {
    for (const a of o)
      if (a.type === "attributes" && a.attributeName === "class") {
        const l = a.target;
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
  }), n.querySelectorAll('input[type="checkbox"][data-boolean-checkbox]').forEach((o) => {
    o.value = "true";
    const a = () => {
      const l = n.querySelector(`input[type="hidden"][name="${o.name}"]`);
      if (l && l.remove(), !o.checked) {
        const c = document.createElement("input");
        c.type = "hidden", c.name = o.name, c.value = "false", o.parentNode.insertBefore(c, o);
      }
    };
    a(), o.addEventListener("change", a);
  });
}
const Yo = "[data-tippy-content]";
function Im(n = document) {
  const t = n instanceof Element ? n : document, e = Array.from(t.querySelectorAll(Yo)).filter((i) => !i._tippy);
  n instanceof Element && n.matches(Yo) && !n._tippy && e.unshift(n), e.length && ai(e, {
    // Default placement; overridden per element via data-tippy-placement
    placement: "right",
    arrow: !0,
    // Short delay so it doesn't flash on quick mouse-overs;
    // hides quickly so it doesn't block interactions
    delay: [400, 100],
    duration: [150, 100]
  });
}
function Dm(n = () => {
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
  let e = t(), i = e ? e.querySelector("[data-role='global-notice-text']") : null, s = 0, r = null, o = null;
  const a = (f, A) => {
    e = t(), e && !i && (i = e.querySelector("[data-role='global-notice-text']")), i && A && (i.textContent = A), e && f ? e.dataset.state = f : e && e.removeAttribute("data-state");
  }, l = (f, A) => {
    e = t(), e && (a(f, A), e.classList.remove("hidden"));
  }, c = () => {
    e = t(), e && (e.classList.add("hidden"), e.removeAttribute("data-state"));
  }, h = (f) => {
    const A = document.documentElement;
    f ? (A?.setAttribute && (A.dataset.htmxBusy = "true"), document.body && (document.body.dataset.htmxBusy = "true")) : (A && delete A.dataset.htmxBusy, document.body && delete document.body.dataset.htmxBusy);
  }, g = (f, A) => {
    !f || !(f instanceof HTMLElement) || (A ? (f.dataset.htmxBusy = "true", f.setAttribute("aria-busy", "true"), f instanceof HTMLButtonElement && !f.disabled && (f.dataset.htmxDisabled = "true", f.disabled = !0)) : f.dataset.htmxBusy === "true" && (delete f.dataset.htmxBusy, f.removeAttribute("aria-busy"), f instanceof HTMLButtonElement && f.dataset.htmxDisabled === "true" && (f.disabled = !1, delete f.dataset.htmxDisabled)));
  }, b = () => {
    r && (clearTimeout(r), r = null);
  }, m = () => {
    o && (clearTimeout(o), o = null);
  }, v = () => {
    s = 0, h(!1), delete document.documentElement.dataset.htmxBusy, document.querySelectorAll("[data-htmx-busy]").forEach((f) => {
      delete f.dataset.htmxBusy, f.removeAttribute("aria-busy");
    }), document.querySelectorAll("[data-htmx-disabled='true']").forEach((f) => {
      f instanceof HTMLButtonElement && (f.disabled = !1), delete f.dataset.htmxDisabled;
    }), m(), b(), c();
  };
  document.addEventListener("htmx:beforeRequest", (f) => {
    s += 1, b(), m(), h(!0), l("loading", "Lädt"), g(f.detail?.elt, !0);
  }), document.addEventListener("htmx:afterRequest", (f) => {
    g(f.detail?.elt, !1), s = Math.max(0, s - 1), s === 0 && (h(!1), e.dataset.state !== "error" && (m(), o = setTimeout(() => {
      o = null, s === 0 && e.dataset.state !== "error" && c();
    }, 250)));
  }), document.addEventListener("htmx:responseError", () => {
    h(!1), l("error", "Laden fehlgeschlagen."), b(), m(), r = setTimeout(() => {
      s === 0 ? c() : l("loading", "Lädt");
    }, 2e3);
  }), document.addEventListener("htmx:sendError", () => {
    h(!1), l("error", "Verbindung fehlgeschlagen."), b(), m(), r = setTimeout(() => {
      s === 0 ? c() : l("loading", "Lädt");
    }, 2e3);
  }), document.addEventListener("htmx:afterSwap", () => {
    e = t(), e && !i && (i = e.querySelector("[data-role='global-notice-text']"));
  }), window.addEventListener("pageshow", () => {
    v(), n();
  });
}
function Ms() {
  if (Ms._initialized)
    return;
  Ms._initialized = !0;
  const n = () => {
    const t = document.querySelectorAll(".form-action-bar");
    if (!t.length) return;
    const e = window.innerHeight || document.documentElement.clientHeight;
    t.forEach((i) => {
      const s = i.getBoundingClientRect();
      i.classList.toggle("is-stuck", s.bottom >= e - 1);
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
    (s || document).querySelectorAll("[data-autohide='true']").forEach((o) => {
      o.dataset.autohideScheduled !== "true" && (o.dataset.autohideScheduled = "true", setTimeout(() => t(o), 2e3));
    });
  };
  e(document), document.addEventListener("htmx:afterSwap", (s) => {
    e(s.target);
  }), new MutationObserver((s) => {
    for (const r of s)
      for (const o of r.addedNodes)
        o.nodeType === Node.ELEMENT_NODE && e(o);
  }).observe(document.body, { childList: !0, subtree: !0 });
}
document.addEventListener("trix-file-accept", (n) => {
  n.preventDefault();
});
const Mm = [
  ["int-link", _d],
  ["abbrev-tooltips", Ci],
  ["filter-list", gd],
  ["scroll-button", bd],
  ["popup-image", vd],
  ["tab-list", yd],
  ["filter-pill", md],
  ["image-reel", Ad],
  ["multi-select-simple", Bd],
  ["reset-button", Fd],
  ["div-manager", $d],
  ["items-editor", Xd],
  ["almanach-edit-page", Qd],
  ["edit-page", Zd],
  ["duplicate-warning-checker", eu],
  ["content-images", ou],
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
    let s = 0;
    const r = setInterval(() => {
      if (typeof window.QRCode == "function") {
        clearInterval(r), e(window.QRCode);
        return;
      }
      s += t, s >= n && (clearInterval(r), i(new Error(`QRCode not available after ${n}ms. Check if qrcode.min.js is loaded correctly and sets window.QRCode.`)));
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
  vm(n), ll(n), Im(n), cl(document);
}
document.addEventListener("DOMContentLoaded", () => {
  Am(), er(), En(document);
});
document.addEventListener("htmx:afterSwap", (n) => {
  const t = n.detail?.target || document;
  er(), En(t);
});
document.addEventListener("htmx:load", (n) => {
  const t = n.detail?.elt || document;
  En(t);
});
document.addEventListener("admin-sidebar-statechange", () => {
  cl(document);
});
document.addEventListener("click", (n) => {
  n.target instanceof Element && n.target.closest("[data-role='content-status-picker']") || tr();
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
window.initAdminStatusPickers = ll;
Dm(() => {
  er(), tr(), En(document);
});
Ms();
Om();
export {
  Ci as AbbreviationTooltips,
  Qd as AlmanachEditPage,
  ou as ContentImages,
  Zd as EditPage,
  gd as FilterList,
  md as FilterPill,
  Ad as ImageReel,
  _d as IntLink,
  Xd as ItemsEditor,
  cu as LookupField,
  Bd as MultiSelectSimple,
  vd as PopupImage,
  bd as ScrollButton,
  yd as TabList
};
