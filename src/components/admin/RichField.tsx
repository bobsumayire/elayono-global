"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  activeRichEditor,
  alignClass,
  applyStyle,
  caretAtStart,
  clearFormatting,
  domToMarkup,
  joinAlign,
  markupToEditorHtml,
  plainText,
  splitAlign,
  splitEditor,
  styleAtSelection,
  type RichAlign,
} from "@/lib/cms/richText";

export function RichField({
  id,
  value,
  placeholder,
  className = "",
  ariaLabel,
  storyStart,
  allowAlign = false,
  onChange,
  onFocus,
  onSplit,
  onBackspaceAtStart,
  onPasteFiles,
  onPasteLines,
}: {
  id?: string;
  value: string;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  storyStart?: boolean;
  allowAlign?: boolean;
  onChange: (value: string) => void;
  onFocus?: (element: HTMLElement) => void;
  onSplit?: (before: string, after: string) => void;
  onBackspaceAtStart?: () => boolean;
  onPasteFiles?: (files: File[]) => void;
  onPasteLines?: (before: string, text: string, after: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const emitted = useRef<string | null>(null);
  const { align, body } = splitAlign(allowAlign ? value : "");
  const storedBody = allowAlign ? body : value;

  const publish = () => {
    const field = ref.current;
    if (!field) return;
    const markup = domToMarkup(field);
    const next = allowAlign ? joinAlign(splitAlign(value).align, markup) : markup;
    const html = markupToEditorHtml(markup);
    if (field.innerHTML !== html) {
      const offsets = caretOffset(field);
      field.innerHTML = html;
      restoreCaret(field, offsets);
    }
    field.toggleAttribute("data-empty", plainText(markup) === "");
    emitted.current = next;
    if (next !== value) onChange(next);
  };

  useLayoutEffect(() => {
    const field = ref.current;
    if (!field || emitted.current === value) return;
    field.innerHTML = markupToEditorHtml(storedBody);
    field.toggleAttribute("data-empty", plainText(storedBody) === "");
    emitted.current = value;
  }, [storedBody, value]);

  return (
    <div
      ref={ref}
      id={id}
      role="textbox"
      aria-label={ariaLabel}
      aria-multiline="true"
      contentEditable
      suppressContentEditableWarning
      spellCheck
      data-rich-field=""
      data-story-start={storyStart ? "" : undefined}
      data-placeholder={placeholder}
      data-empty={plainText(storedBody) === "" ? "" : undefined}
      onInput={publish}
      onFocus={(event) => onFocus?.(event.currentTarget)}
      onKeyDown={(event) => {
        const field = ref.current;
        if (!field) return;
        if ((event.metaKey || event.ctrlKey) && !event.altKey) {
          const key = event.key.toLowerCase();
          if (key === "b" || key === "i" || key === "u") {
            event.preventDefault();
            document.execCommand("styleWithCSS", false, "false");
            document.execCommand(key === "b" ? "bold" : key === "i" ? "italic" : "underline");
            publish();
            return;
          }
        }
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          if (!onSplit) return;
          const parts = splitEditor(field);
          onSplit(parts.before, parts.after);
          return;
        }
        if (event.key === "Backspace" && caretAtStart(field) && onBackspaceAtStart?.()) event.preventDefault();
      }}
      onPaste={(event) => {
        const field = ref.current;
        if (!field) return;
        const files = [...event.clipboardData.files].filter((file) => file.type.startsWith("image/"));
        if (files.length) {
          event.preventDefault();
          onPasteFiles?.(files);
          return;
        }
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain");
        if (text.includes("\n") && onPasteLines) {
          const parts = splitEditor(field);
          onPasteLines(parts.before, text, parts.after);
          return;
        }
        const html = event.clipboardData.getData("text/html");
        if (html) {
          const parsed = new DOMParser().parseFromString(html, "text/html");
          document.execCommand("insertHTML", false, markupToEditorHtml(domToMarkup(parsed.body)));
          return;
        }
        document.execCommand("insertText", false, text);
      }}
      className={`rich-text rich-placeholder block min-h-[1.6em] w-full break-words bg-transparent outline-none scroll-mt-24 ${alignClass(allowAlign ? align : "left")} ${className}`}
    />
  );
}

function normalizeHref(value: string) {
  const href = value.trim();
  if (!href) return "";
  if (/^(https?:\/\/|mailto:|\/)/i.test(href)) return href;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(href)) return `mailto:${href}`;
  if (/^[\w.-]+\.[a-z]{2,}([/?#].*)?$/i.test(href)) return `https://${href}`;
  return "";
}

export function FormatBar({
  showAlign = false,
  align = "left",
  onAlign,
}: {
  showAlign?: boolean;
  align?: RichAlign;
  onAlign?: (align: RichAlign) => void;
}) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");
  const [revision, setRevision] = useState(0);
  const rangeRef = useRef<Range | null>(null);
  const style = styleAtSelection();
  void revision;

  const saveRange = () => {
    const selection = window.getSelection();
    const editor = activeRichEditor();
    if (!selection?.rangeCount || !editor || !selection.anchorNode || !editor.contains(selection.anchorNode)) return;
    rangeRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restore = () => {
    const range = rangeRef.current;
    if (!range) return activeRichEditor();
    const host = range.commonAncestorContainer;
    const fromRange = host instanceof Element ? host.closest("[data-rich-field]") : host.parentElement?.closest("[data-rich-field]");
    const field = fromRange instanceof HTMLElement ? fromRange : activeRichEditor();
    if (!field) return null;
    field.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    return field;
  };

  const refresh = (field?: HTMLElement | null) => {
    (field ?? activeRichEditor())?.dispatchEvent(new Event("input", { bubbles: true }));
    setRevision((value) => value + 1);
  };

  const command = (name: "bold" | "italic" | "underline") => {
    const field = activeRichEditor();
    field?.focus();
    document.execCommand("styleWithCSS", false, "false");
    document.execCommand(name);
    refresh(field);
  };

  const applyLink = () => {
    const field = restore();
    if (!field) return;
    document.execCommand("styleWithCSS", false, "false");
    const next = normalizeHref(href);
    if (!next) document.execCommand("unlink");
    else document.execCommand("createLink", false, next);
    setLinkOpen(false);
    refresh(field);
  };

  const tool = "rounded-lg px-2 py-1.5 text-sm text-ink hover:bg-mist";

  return (
    <div className="flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-line bg-white p-1 shadow-sm">
      <button type="button" className={`${tool} font-bold ${style.bold ? "bg-mist" : ""}`} aria-label="Bold" title="Bold" aria-pressed={style.bold} onMouseDown={(event) => event.preventDefault()} onClick={() => command("bold")}>
        B
      </button>
      <button type="button" className={`${tool} italic ${style.italic ? "bg-mist" : ""}`} aria-label="Italic" title="Italic" aria-pressed={style.italic} onMouseDown={(event) => event.preventDefault()} onClick={() => command("italic")}>
        I
      </button>
      <button type="button" className={`${tool} underline ${style.underline ? "bg-mist" : ""}`} aria-label="Underline" title="Underline" aria-pressed={style.underline} onMouseDown={(event) => event.preventDefault()} onClick={() => command("underline")}>
        U
      </button>
      <button
        type="button"
        className={`${tool} font-semibold ${linkOpen || style.href ? "bg-mist" : ""}`}
        aria-label="Link"
        title="Link"
        aria-pressed={Boolean(style.href)}
        onMouseDown={(event) => {
          event.preventDefault();
          saveRange();
        }}
        onClick={() => {
          setHref(style.href || "https://");
          setLinkOpen((open) => !open);
        }}
      >
        Link
      </button>
      <select
        aria-label="Font"
        title="Font"
        value={style.font}
        onMouseDown={saveRange}
        onChange={(event) => {
          const field = restore();
          applyStyle("font", event.target.value === "body" ? null : event.target.value);
          refresh(field);
        }}
        className="rounded-lg bg-transparent px-1 py-1.5 text-sm text-ink"
      >
        <option value="body">Body</option>
        <option value="heading">Heading</option>
        <option value="serif">Serif</option>
      </select>
      <select
        aria-label="Size"
        title="Size"
        value={style.size}
        onMouseDown={saveRange}
        onChange={(event) => {
          const field = restore();
          applyStyle("size", event.target.value === "md" ? null : event.target.value);
          refresh(field);
        }}
        className="rounded-lg bg-transparent px-1 py-1.5 text-sm text-ink"
      >
        <option value="sm">Small</option>
        <option value="md">Normal</option>
        <option value="lg">Large</option>
        <option value="xl">Extra large</option>
      </select>
      {showAlign &&
        (["left", "center", "right"] as const).map((item) => (
          <button
            key={item}
            type="button"
            className={`${tool} font-semibold capitalize ${align === item ? "bg-mist" : ""}`}
            aria-label={`Align ${item}`}
            aria-pressed={align === item}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onAlign?.(item)}
          >
            {item}
          </button>
        ))}
      <button
        type="button"
        className={`${tool} font-semibold`}
        aria-label="Clear formatting"
        title="Clear formatting"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          const field = activeRichEditor();
          field?.focus();
          clearFormatting();
          refresh(field);
        }}
      >
        Clear
      </button>
      {linkOpen && (
        <div className="flex items-center gap-1">
          <input
            aria-label="Link address"
            value={href}
            onChange={(event) => setHref(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              applyLink();
            }}
            className="w-44 rounded-lg border border-line px-2 py-1 text-sm text-ink"
            placeholder="https://"
          />
          <button type="button" className={`${tool} font-semibold`} onMouseDown={(event) => event.preventDefault()} onClick={applyLink}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}

function caretOffset(root: HTMLElement) {
  const selection = window.getSelection();
  if (!selection?.rangeCount || !selection.anchorNode || !root.contains(selection.anchorNode)) return 0;
  const range = selection.getRangeAt(0).cloneRange();
  range.selectNodeContents(root);
  range.setEnd(selection.anchorNode, selection.anchorOffset);
  return range.toString().length;
}

function restoreCaret(root: HTMLElement, offset: number) {
  const selection = window.getSelection();
  if (!selection) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    if (remaining <= text.length) {
      const range = document.createRange();
      range.setStart(text, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= text.length;
    node = walker.nextNode();
  }
}
