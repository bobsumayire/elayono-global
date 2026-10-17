export const richFonts = ["body", "heading", "serif"] as const;
export type RichFont = (typeof richFonts)[number];

export const richSizes = ["sm", "md", "lg", "xl"] as const;
export type RichSize = (typeof richSizes)[number];

export const richAligns = ["left", "center", "right"] as const;
export type RichAlign = (typeof richAligns)[number];

export type RichNode =
  | { type: "text"; text: string }
  | { type: "strong" | "em" | "u"; children: RichNode[] }
  | { type: "a"; href: string; children: RichNode[] }
  | { type: "span"; font?: RichFont; size?: RichSize; children: RichNode[] };

const tagPattern = /<\/?(strong|em|u|b|i|a|span)\b([^>]*)>/gi;

export function splitAlign(value: string): { align: RichAlign; body: string } {
  const match = /^(?:::((?:left|center|right))::)/.exec(value);
  if (!match) return { align: "left", body: value };
  return { align: match[1] as RichAlign, body: value.slice(match[0].length) };
}

export function joinAlign(align: RichAlign, body: string) {
  return align === "left" ? body : `::${align}::${body}`;
}

export function alignClass(align: RichAlign) {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "";
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function decodeHtml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function safeHref(value: string) {
  const href = decodeHtml(value).trim();
  if (/^(https?:\/\/|mailto:|\/)/i.test(href)) return href;
  return "";
}

function readAttr(source: string, name: string) {
  const match = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i").exec(source);
  return match?.[1] ?? match?.[2] ?? "";
}

export function parseRich(input: string): RichNode[] {
  const root: RichNode[] = [];
  const parents: RichNode[][] = [];
  let current = root;
  let last = 0;
  tagPattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = tagPattern.exec(input))) {
    if (match.index > last) current.push({ type: "text", text: decodeHtml(input.slice(last, match.index)) });
    const closing = match[0].startsWith("</");
    const name = match[1].toLowerCase();
    const kind = name === "b" ? "strong" : name === "i" ? "em" : name;
    if (!closing) {
      const attrs = match[2] ?? "";
      let node: RichNode;
      if (kind === "a") {
        const href = safeHref(readAttr(attrs, "href"));
        node = href ? { type: "a", href, children: [] } : { type: "span", children: [] };
      } else if (kind === "span") {
        const font = richFonts.find((item) => item === readAttr(attrs, "data-font"));
        const size = richSizes.find((item) => item === readAttr(attrs, "data-size"));
        node = { type: "span", font: font === "body" ? undefined : font, size: size === "md" ? undefined : size, children: [] };
      } else {
        node = { type: kind as "strong" | "em" | "u", children: [] };
      }
      current.push(node);
      parents.push(current);
      current = node.children;
    } else if (parents.length) {
      current = parents.pop() ?? root;
    }
    last = tagPattern.lastIndex;
  }
  if (last < input.length) current.push({ type: "text", text: decodeHtml(input.slice(last)) });
  return root;
}

export function plainText(value: string) {
  return decodeHtml(splitAlign(value).body.replace(/<\/?[^>]+>/g, ""))
    .replace(/\u200b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function textLength(value: string) {
  return decodeHtml(splitAlign(value).body.replace(/<\/?[^>]+>/g, "")).replace(/\u200b/g, "").length;
}

export function markupToEditorHtml(value: string) {
  return nodesToHtml(parseRich(value));
}

function nodesToHtml(nodes: RichNode[]): string {
  return nodes.map(nodeToHtml).join("");
}

function nodeToHtml(node: RichNode): string {
  if (node.type === "text") return escapeHtml(node.text);
  const inner = nodesToHtml(node.children);
  if (!inner.replace(/\u200b/g, "")) {
    if (node.type !== "span") return "";
    const font = node.font && node.font !== "body" ? ` data-font="${node.font}"` : "";
    const size = node.size && node.size !== "md" ? ` data-size="${node.size}"` : "";
    return font || size ? `<span${font}${size}>\u200b</span>` : "";
  }
  if (node.type === "strong") return `<strong>${inner}</strong>`;
  if (node.type === "em") return `<em>${inner}</em>`;
  if (node.type === "u") return `<u>${inner}</u>`;
  if (node.type === "a") return `<a href="${escapeHtml(node.href)}">${inner}</a>`;
  if (node.type !== "span") return inner;
  const font = node.font && node.font !== "body" ? ` data-font="${node.font}"` : "";
  const size = node.size && node.size !== "md" ? ` data-size="${node.size}"` : "";
  return font || size ? `<span${font}${size}>${inner}</span>` : inner;
}

export function domToMarkup(root: ParentNode) {
  return [...root.childNodes].map(nodeToMarkup).join("");
}

function nodeToMarkup(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? "");
  if (!(node instanceof HTMLElement)) return "";
  const inner = domToMarkup(node);
  const name = node.tagName;
  if (!inner.replace(/\u200b/g, "")) {
    if (name !== "SPAN" && name !== "FONT") return "";
    const font = fontOf(node);
    const size = sizeOf(node);
    const attrs = `${font ? ` data-font="${font}"` : ""}${size ? ` data-size="${size}"` : ""}`;
    return attrs ? `<span${attrs}>\u200b</span>` : "";
  }
  if (name === "STRONG" || name === "B") return `<strong>${inner}</strong>`;
  if (name === "EM" || name === "I") return `<em>${inner}</em>`;
  if (name === "U") return `<u>${inner}</u>`;
  if (name === "A") {
    const href = safeHref(node.getAttribute("href") ?? "");
    return href ? `<a href="${escapeHtml(href)}">${inner}</a>` : inner;
  }
  if (name === "SPAN" || name === "FONT") {
    const font = fontOf(node);
    const size = sizeOf(node);
    const attrs = `${font ? ` data-font="${font}"` : ""}${size ? ` data-size="${size}"` : ""}`;
    return attrs ? `<span${attrs}>${inner}</span>` : inner;
  }
  return inner;
}

function fontOf(element: HTMLElement): RichFont | undefined {
  const data = element.getAttribute("data-font");
  if (data === "heading" || data === "serif") return data;
  const face = `${element.getAttribute("face") ?? ""} ${element.style.fontFamily}`.toLowerCase();
  if (/georgia|times|serif|palatino/.test(face)) return "serif";
  if (/manrope|heading/.test(face)) return "heading";
  return undefined;
}

function sizeOf(element: HTMLElement): RichSize | undefined {
  const data = element.getAttribute("data-size");
  if (data === "sm" || data === "lg" || data === "xl") return data;
  const fontSize = element.getAttribute("size") ?? "";
  if (fontSize === "1" || fontSize === "2") return "sm";
  if (fontSize === "5" || fontSize === "4") return "lg";
  if (fontSize === "6" || fontSize === "7") return "xl";
  const pixels = Number.parseFloat(element.style.fontSize);
  if (!Number.isFinite(pixels)) return undefined;
  if (pixels <= 14) return "sm";
  if (pixels >= 28) return "xl";
  if (pixels >= 20) return "lg";
  return undefined;
}

export function focusRich(element: HTMLElement, pos: number | "end") {
  element.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let remaining = pos === "end" ? Number.POSITIVE_INFINITY : pos;
  let last: Text | null = null;
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    last = text;
    if (remaining <= text.length) {
      range.setStart(text, Math.max(0, remaining));
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= text.length;
    node = walker.nextNode();
  }
  if (last) range.setStart(last, pos === "end" ? last.length : 0);
  else {
    range.selectNodeContents(element);
    range.collapse(true);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function caretAtStart(root: HTMLElement) {
  const selection = window.getSelection();
  if (!selection?.isCollapsed || !selection.rangeCount || !selection.anchorNode || !root.contains(selection.anchorNode)) return false;
  const range = selection.getRangeAt(0).cloneRange();
  range.selectNodeContents(root);
  range.setEnd(selection.anchorNode, selection.anchorOffset);
  return range.toString().replace(/\u200b/g, "") === "";
}

export function splitEditor(root: HTMLElement) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return { before: domToMarkup(root), after: "" };
  const range = selection.getRangeAt(0);
  const beforeRange = document.createRange();
  beforeRange.selectNodeContents(root);
  beforeRange.setEnd(range.startContainer, range.startOffset);
  const afterRange = document.createRange();
  afterRange.selectNodeContents(root);
  afterRange.setStart(range.endContainer, range.endOffset);
  const before = document.createElement("div");
  before.appendChild(beforeRange.cloneContents());
  const after = document.createElement("div");
  after.appendChild(afterRange.cloneContents());
  return { before: domToMarkup(before), after: domToMarkup(after) };
}

export function activeRichEditor() {
  if (typeof window === "undefined") return null;
  const selection = window.getSelection();
  const node = selection?.anchorNode;
  const element = node instanceof HTMLElement ? node : node?.parentElement;
  return element?.closest<HTMLElement>("[data-rich-field]") ?? null;
}

export function applyStyle(kind: "font" | "size", value: string | null) {
  const editor = activeRichEditor();
  const selection = window.getSelection();
  if (!editor || !selection?.rangeCount || !selection.anchorNode || !editor.contains(selection.anchorNode)) return;
  const range = selection.getRangeAt(0);
  const attr = kind === "font" ? "data-font" : "data-size";
  if (range.collapsed) {
    if (!value) {
      let element = range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement;
      while (element && element !== editor) {
        if (element.tagName === "SPAN" && element.hasAttribute(attr)) element.removeAttribute(attr);
        element = element.parentElement;
      }
      return;
    }
    const span = document.createElement("span");
    span.setAttribute(attr, value);
    span.textContent = "\u200b";
    range.insertNode(span);
    const text = span.firstChild;
    if (text) {
      const next = document.createRange();
      next.setStart(text, text.textContent?.length ?? 0);
      next.collapse(true);
      selection.removeAllRanges();
      selection.addRange(next);
    }
    return;
  }
  const fragment = range.extractContents();
  unwrap(fragment, attr);
  if (value) {
    const span = document.createElement("span");
    span.setAttribute(attr, value);
    span.appendChild(fragment);
    range.insertNode(span);
    selection.removeAllRanges();
    const next = document.createRange();
    next.selectNodeContents(span);
    selection.addRange(next);
    return;
  }
  range.insertNode(fragment);
}

function unwrap(root: ParentNode, attr: string) {
  root.querySelectorAll(`span[${attr}]`).forEach((span) => {
    span.removeAttribute(attr);
    if (!span.getAttribute("data-font") && !span.getAttribute("data-size")) {
      span.replaceWith(...span.childNodes);
    }
  });
}

export function clearFormatting() {
  const editor = activeRichEditor();
  const selection = window.getSelection();
  if (!editor || !selection?.rangeCount || !selection.anchorNode || !editor.contains(selection.anchorNode)) return;
  document.execCommand("styleWithCSS", false, "false");
  const range = selection.getRangeAt(0);
  if (range.collapsed) {
    document.execCommand("removeFormat");
    document.execCommand("unlink");
    let element = selection.anchorNode instanceof HTMLElement ? selection.anchorNode : selection.anchorNode?.parentElement;
    while (element && element !== editor) {
      if (element.tagName === "SPAN") {
        element.removeAttribute("data-font");
        element.removeAttribute("data-size");
      }
      element = element.parentElement;
    }
    return;
  }
  const text = range.toString().replace(/\u200b/g, "");
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  const next = document.createRange();
  next.setStart(node, node.length);
  next.collapse(true);
  selection.removeAllRanges();
  selection.addRange(next);
}

export function styleAtSelection() {
  const empty = { bold: false, italic: false, underline: false, font: "body" as RichFont, size: "md" as RichSize, href: "" };
  if (typeof document === "undefined") return empty;
  const selection = window.getSelection();
  const node = selection?.anchorNode;
  let element = node instanceof HTMLElement ? node : node?.parentElement;
  let font: RichFont = "body";
  let size: RichSize = "md";
  let href = "";
  while (element) {
    if (!font || font === "body") {
      const value = element.getAttribute("data-font");
      if (value === "heading" || value === "serif" || value === "body") font = value;
    }
    if (size === "md") {
      const value = element.getAttribute("data-size");
      if (value === "sm" || value === "lg" || value === "xl") size = value;
    }
    if (!href && element.tagName === "A") href = element.getAttribute("href") ?? "";
    if (element.dataset.richField != null) break;
    element = element.parentElement;
  }
  let bold = false;
  let italic = false;
  let underline = false;
  try {
    bold = document.queryCommandState("bold");
    italic = document.queryCommandState("italic");
    underline = document.queryCommandState("underline");
  } catch {
    bold = false;
  }
  return { bold, italic, underline, font, size, href };
}
