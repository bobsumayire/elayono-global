"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { uploadImage } from "@/lib/cms/actions";
import { blocksToText, textToBlocks } from "@/lib/cms/blocks";
import type { BlogBlock } from "@/data/blog";

type Photo = { url: string };

type TextKind = "paragraph" | "heading" | "quote";

type EditorBlock =
  | { id: string; type: TextKind; text: string }
  | { id: string; type: "list"; items: string[] }
  | { id: string; type: "image"; src: string; caption: string };

type BlockType = EditorBlock["type"];

type InserterState = {
  anchor: string;
  index: number;
  replaceId?: string;
  placement: "up" | "down";
};

export type SelectedBlock = {
  id: string;
  type: BlockType;
  index: number;
};

export type StoryHandle = {
  remove: (id: string) => void;
  move: (id: string, direction: -1 | 1) => void;
};

const BLOCKS: { type: BlockType; label: string }[] = [
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "heading", label: "Heading" },
  { type: "quote", label: "Quote" },
  { type: "list", label: "List" },
];

function uid() {
  return `b-${crypto.randomUUID()}`;
}

function fieldId(block: EditorBlock, itemIndex = 0) {
  return block.type === "list" ? `field-${block.id}-${itemIndex}` : `field-${block.id}`;
}

function fromBlog(block: BlogBlock, id: string): EditorBlock {
  if (typeof block === "string") return { id, type: "paragraph", text: block };
  if ("heading" in block) return { id, type: "heading", text: block.heading };
  if ("quote" in block) return { id, type: "quote", text: block.quote };
  if ("image" in block) return { id, type: "image", src: block.image, caption: block.caption ?? "" };
  return { id, type: "list", items: block.list.length ? [...block.list] : [""] };
}

function initialBlocks(value: string): EditorBlock[] {
  const parsed = textToBlocks(value);
  if (!parsed.length) return [fromBlog("", "block-0")];
  return parsed.map((block, index) => fromBlog(block, `block-${index}`));
}

function createBlock(type: BlockType): EditorBlock {
  const id = uid();
  if (type === "list") return { id, type, items: [""] };
  if (type === "image") return { id, type, src: "", caption: "" };
  return { id, type, text: "" };
}

function editorToBlog(blocks: EditorBlock[]): BlogBlock[] {
  const result: BlogBlock[] = [];
  for (const block of blocks) {
    if (block.type === "paragraph" && block.text.trim()) result.push(block.text);
    else if (block.type === "heading" && block.text.trim()) result.push({ heading: block.text });
    else if (block.type === "quote" && block.text.trim()) result.push({ quote: block.text });
    else if (block.type === "list") {
      const items = block.items.map((item) => item.trim()).filter(Boolean);
      if (items.length) result.push({ list: items });
    } else if (block.type === "image" && block.src.trim() && !block.src.startsWith("blob:")) {
      const image = block.src.trim();
      const caption = block.caption.trim();
      result.push(caption ? { image, caption } : { image });
    }
  }
  return result;
}

function labelFor(type: BlockType) {
  return BLOCKS.find((block) => block.type === type)?.label ?? "Block";
}

export function GrowingField({
  id,
  value,
  placeholder,
  className = "",
  ariaLabel,
  autoFocus,
  storyStart,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
}: {
  id?: string;
  value: string;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
  storyStart?: boolean;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    const grow = () => {
      field.style.height = "auto";
      field.style.height = `${field.scrollHeight}px`;
    };
    grow();
    window.addEventListener("resize", grow);
    return () => window.removeEventListener("resize", grow);
  }, [value]);

  return (
    <textarea
      ref={ref}
      id={id}
      rows={1}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      data-story-start={storyStart ? "" : undefined}
      spellCheck
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`block w-full resize-none overflow-hidden break-words bg-transparent outline-none scroll-mt-24 placeholder:text-slate/45 ${className}`}
    />
  );
}

function BlockIcon({ type }: { type: BlockType }) {
  const common = "h-7 w-7";
  if (type === "image") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.4" />
        <path d="M4 16.5 8.2 13l3 2.4 2.4-2L20 17" />
      </svg>
    );
  }
  if (type === "heading") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M6 5v14M14 5v14M6 12h8" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "quote") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M7 16c0-3 1.2-5 3.5-6.5L9 7C6 8.8 4.5 11.4 4.5 16H7Zm8 0c0-3 1.2-5 3.5-6.5L17 7c-3 1.8-4.5 4.4-4.5 9H15Z" />
      </svg>
    );
  }
  if (type === "list") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
        <path d="M10 7h9M10 12h9M10 17h9" strokeLinecap="round" />
        <circle cx="6.5" cy="7" r="1" fill="currentColor" stroke="none" />
        <circle cx="6.5" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="6.5" cy="17" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M5 7h14M5 12h14M5 17h9" strokeLinecap="round" />
    </svg>
  );
}

function Inserter({ placement, onPick }: { placement: "up" | "down"; onPick: (type: BlockType) => void }) {
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const matches = BLOCKS.filter((block) => block.label.toLowerCase().includes(query.trim().toLowerCase()));

  useLayoutEffect(() => {
    panelRef.current?.scrollIntoView({ block: "nearest" });
  }, []);

  return (
    <div
      ref={panelRef}
      className={`absolute z-40 w-[min(18rem,calc(100vw-2.5rem))] rounded-xl border border-line bg-white p-3 shadow-xl ${
        placement === "up" ? "bottom-full left-0 mb-2" : "top-full left-0 mt-2"
      }`}
    >
      <input
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        aria-label="Search blocks"
        className="w-full rounded-lg border border-line px-3 py-2 text-base outline-none focus:border-brand-500 sm:text-sm"
      />
      {matches.length === 0 ? (
        <p className="px-2 py-6 text-center text-sm text-slate">No matching blocks.</p>
      ) : (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {matches.map((block) => (
            <button
              key={block.type}
              type="button"
              onClick={() => onPick(block.type)}
              className="flex flex-col items-center gap-2 rounded-lg px-2 py-3 text-ink hover:bg-mist"
            >
              <BlockIcon type={block.type} />
              <span className="text-xs font-medium">{block.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Anchor({
  open,
  placement,
  onClose,
  onPick,
  children,
}: {
  open: boolean;
  placement: "up" | "down";
  onClose: () => void;
  onPick: (type: BlockType) => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  return (
    <div ref={ref} className="relative">
      {children}
      {open && <Inserter placement={placement} onPick={onPick} />}
    </div>
  );
}

export default function StoryEditor({
  ref,
  value,
  onChange,
  photos,
  help,
  onError,
  onSelect,
  onBusy,
}: {
  ref?: React.Ref<StoryHandle>;
  value: string;
  onChange: (value: string) => void;
  photos: Photo[];
  help?: string;
  onError: (message: string) => void;
  onSelect?: (block: SelectedBlock | null) => void;
  onBusy?: (busy: boolean) => void;
}) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(() => initialBlocks(value));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inserter, setInserter] = useState<InserterState | null>(null);
  const [libraryFor, setLibraryFor] = useState<string | null>(null);
  const [added, setAdded] = useState<Photo[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const blocksRef = useRef(blocks);
  const onChangeRef = useRef(onChange);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadAt = useRef<{ index: number; replaceId?: string }>({ index: 0 });
  const focusRef = useRef<string | null>(null);
  const caretRef = useRef<{ id: string; pos: number } | null>(null);
  const dragDepth = useRef(0);

  const library = [...added, ...photos.filter((photo) => !added.some((item) => item.url === photo.url))];

  const commit = useCallback((next: EditorBlock[]) => {
    const safe = next.length ? next : [fromBlog("", uid())];
    blocksRef.current = safe;
    setBlocks(safe);
    onChangeRef.current(blocksToText(editorToBlog(safe)));
  }, []);

  const closeInserter = useCallback(() => {
    setInserter((current) => {
      if (current?.replaceId) {
        const id = `field-${current.replaceId}`;
        requestAnimationFrame(() => document.getElementById(id)?.focus());
      }
      return null;
    });
  }, []);

  useLayoutEffect(() => {
    const id = focusRef.current;
    if (!id) return;
    focusRef.current = null;
    const field = document.getElementById(id) as HTMLTextAreaElement | null;
    if (!field) return;
    field.focus();
    const pos = caretRef.current?.id === id ? caretRef.current.pos : field.value.length;
    caretRef.current = null;
    const clamped = Math.min(pos, field.value.length);
    field.setSelectionRange(clamped, clamped);
  }, [blocks]);

  const onBusyRef = useRef(onBusy);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    blocksRef.current = blocks;
    onChangeRef.current = onChange;
    onBusyRef.current = onBusy;
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    onBusyRef.current?.(busy);
  }, [busy]);

  useEffect(() => {
    if (!selectedId) {
      onSelectRef.current?.(null);
      return;
    }
    const index = blocks.findIndex((block) => block.id === selectedId);
    if (index === -1) {
      onSelectRef.current?.(null);
      return;
    }
    onSelectRef.current?.({ id: selectedId, type: blocks[index].type, index });
  }, [blocks, selectedId]);

  useEffect(() => {
    if (!libraryFor) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLibraryFor(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [libraryFor]);

  const removeBlock = useCallback(
    (id: string) => {
      commit(blocksRef.current.filter((block) => block.id !== id));
      setSelectedId((current) => (current === id ? null : current));
    },
    [commit],
  );

  const moveBlock = useCallback(
    (id: string, direction: -1 | 1) => {
      const current = blocksRef.current;
      const index = current.findIndex((block) => block.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return;
      const next = current.slice();
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      commit(next);
    },
    [commit],
  );

  useEffect(() => {
    if (!ref) return;
    const handle: StoryHandle = { remove: removeBlock, move: moveBlock };
    if (typeof ref === "function") {
      ref(handle);
      return () => {
        ref(null);
      };
    }
    ref.current = handle;
    return () => {
      ref.current = null;
    };
  }, [moveBlock, ref, removeBlock]);

  const insertType = (type: BlockType) => {
    if (!inserter) return;
    const created = createBlock(type);
    const current = blocksRef.current.slice();
    let index = Math.min(inserter.index, current.length);
    if (inserter.replaceId) {
      const existing = current.findIndex((block) => block.id === inserter.replaceId);
      const block = current[existing];
      if (existing !== -1 && block?.type === "paragraph" && !block.text.trim()) {
        current.splice(existing, 1, created);
        index = existing;
      } else if (existing !== -1) {
        index = existing + 1;
        current.splice(index, 0, created);
      } else {
        current.splice(index, 0, created);
      }
    } else {
      current.splice(index, 0, created);
    }
    setInserter(null);
    setSelectedId(created.id);
    if (created.type !== "image") {
      focusRef.current = fieldId(created);
      caretRef.current = { id: fieldId(created), pos: 0 };
    }
    commit(current);
  };

  const addFiles = async (files: File[], index: number, replaceId?: string) => {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (!images.length) {
      onError("Choose a photo to place in the article.");
      return;
    }
    setBusy(true);
    onError("");
    let cursor = index;
    let replace = replaceId;
    for (const file of images) {
      const localUrl = URL.createObjectURL(file);
      const current = blocksRef.current.slice();
      let blockId = "";
      let placedAt = cursor;
      if (replace) {
        const existing = current.findIndex((block) => block.id === replace);
        const block = current[existing];
        if (existing !== -1 && block?.type === "image") {
          current[existing] = { ...block, src: localUrl };
          blockId = block.id;
          placedAt = existing;
          replace = undefined;
        }
      }
      if (!blockId) {
        const created: EditorBlock = { id: uid(), type: "image", src: localUrl, caption: "" };
        current.splice(cursor, 0, created);
        blockId = created.id;
        placedAt = cursor;
      }
      cursor = placedAt + 1;
      setSelectedId(blockId);
      commit(current);
      const body = new FormData();
      body.set("file", file);
      const result = await uploadImage(body);
      if (!result.url) {
        URL.revokeObjectURL(localUrl);
        onError(result.error ?? "The photo could not be added.");
        commit(blocksRef.current.filter((block) => !(block.id === blockId && block.type === "image" && block.src === localUrl)));
        break;
      }
      const remoteUrl = result.url;
      setAdded((currentPhotos) => [{ url: remoteUrl }, ...currentPhotos.filter((item) => item.url !== remoteUrl)]);
      commit(
        blocksRef.current.map((block) => (block.id === blockId && block.type === "image" ? { ...block, src: remoteUrl } : block)),
      );
      window.setTimeout(() => URL.revokeObjectURL(localUrl), 1500);
    }
    setBusy(false);
  };

  const openUpload = (index: number, replaceId?: string) => {
    uploadAt.current = { index, replaceId };
    fileRef.current?.click();
  };

  const updateText = (id: string, text: string) => {
    const current = blocksRef.current;
    const index = current.findIndex((block) => block.id === id);
    const block = current[index];
    if (!block || (block.type !== "paragraph" && block.type !== "heading" && block.type !== "quote")) return;
    if (block.type === "paragraph" && block.text === "" && text === "/") {
      setInserter({ anchor: `slash:${id}`, index, replaceId: id, placement: "down" });
      setSelectedId(id);
      return;
    }
    const next = current.slice();
    next[index] = { ...block, text };
    commit(next);
  };

  const splitText = (block: Extract<EditorBlock, { text: string }>, at: number) => {
    const current = blocksRef.current;
    const index = current.findIndex((item) => item.id === block.id);
    if (index === -1) return;
    const created = fromBlog(block.text.slice(at), uid());
    const next = current.slice();
    next[index] = { ...block, text: block.text.slice(0, at) };
    next.splice(index + 1, 0, created);
    focusRef.current = fieldId(created);
    caretRef.current = { id: fieldId(created), pos: 0 };
    setSelectedId(created.id);
    commit(next);
  };

  const mergeBackward = (block: Extract<EditorBlock, { text: string }>) => {
    const current = blocksRef.current;
    const index = current.findIndex((item) => item.id === block.id);
    if (index <= 0) return false;
    const previous = current[index - 1];
    if (previous.type !== "paragraph" && previous.type !== "heading" && previous.type !== "quote") return false;
    const pos = previous.text.length;
    const next = current.slice();
    next[index - 1] = { ...previous, text: previous.text + block.text };
    next.splice(index, 1);
    focusRef.current = fieldId(previous);
    caretRef.current = { id: fieldId(previous), pos };
    setSelectedId(previous.id);
    commit(next);
    return true;
  };

  const onTextKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, block: Extract<EditorBlock, { text: string }>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      splitText(block, event.currentTarget.selectionStart);
      return;
    }
    if (event.key === "Backspace" && event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0) {
      if (!block.text) {
        if (blocksRef.current.length === 1) return;
        event.preventDefault();
        const index = blocksRef.current.findIndex((item) => item.id === block.id);
        const previous = blocksRef.current[index - 1];
        removeBlock(block.id);
        if (previous) {
          focusRef.current = fieldId(previous);
          setSelectedId(previous.id);
        }
        return;
      }
      if (mergeBackward(block)) event.preventDefault();
    }
  };

  const pasteText = (block: Extract<EditorBlock, { text: string }>, start: number, end: number, text: string) => {
    const current = blocksRef.current;
    const index = current.findIndex((item) => item.id === block.id);
    if (index === -1) return;
    const merged = `${block.text.slice(0, start)}${text}${block.text.slice(end)}`.replace(/\r\n/g, "\n");
    const lines = merged.split("\n");
    const rich = lines.some((line) => /^(?:\\+|! |## |> |- )/.test(line.trim()));
    if (block.type === "paragraph" && rich) {
      const created = textToBlocks(merged).map((item) => fromBlog(item, uid()));
      const next = current.slice();
      next.splice(index, 1, ...(created.length ? created : [fromBlog("", uid())]));
      const last = next[index + Math.max(created.length, 1) - 1];
      focusRef.current = fieldId(last);
      setSelectedId(last.id);
      commit(next);
      return;
    }
    const [first, ...rest] = lines;
    const next = current.slice();
    next[index] = { ...block, text: first };
    const extras = rest.filter((line) => line.trim()).map((line) => fromBlog(line, uid()));
    next.splice(index + 1, 0, ...extras);
    const last = extras.at(-1);
    if (last) {
      focusRef.current = fieldId(last);
      caretRef.current = { id: fieldId(last), pos: last.type === "paragraph" ? last.text.length : 0 };
      setSelectedId(last.id);
    } else {
      focusRef.current = fieldId(block);
      caretRef.current = { id: fieldId(block), pos: first.length };
    }
    commit(next);
  };

  const onTextPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>, block: Extract<EditorBlock, { text: string }>) => {
    const files = [...event.clipboardData.files].filter((file) => file.type.startsWith("image/"));
    if (files.length) {
      event.preventDefault();
      const index = blocksRef.current.findIndex((item) => item.id === block.id);
      void addFiles(files, index + 1);
      return;
    }
    const text = event.clipboardData.getData("text/plain");
    if (!text.includes("\n")) return;
    event.preventDefault();
    pasteText(block, event.currentTarget.selectionStart, event.currentTarget.selectionEnd, text);
  };

  const updateItem = (id: string, itemIndex: number, text: string) => {
    commit(
      blocksRef.current.map((block) => {
        if (block.id !== id || block.type !== "list") return block;
        const items = block.items.slice();
        items[itemIndex] = text;
        return { ...block, items };
      }),
    );
  };

  const onItemKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, block: Extract<EditorBlock, { type: "list" }>, itemIndex: number) => {
    const field = event.currentTarget;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const items = block.items.slice();
      const at = field.selectionStart;
      const after = items[itemIndex].slice(at);
      items[itemIndex] = items[itemIndex].slice(0, at);
      items.splice(itemIndex + 1, 0, after);
      focusRef.current = `field-${block.id}-${itemIndex + 1}`;
      caretRef.current = { id: `field-${block.id}-${itemIndex + 1}`, pos: 0 };
      commit(blocksRef.current.map((item) => (item.id === block.id ? { ...block, items } : item)));
      return;
    }
    if (event.key !== "Backspace" || field.selectionStart !== 0 || field.selectionEnd !== 0) return;
    if (block.items.length === 1 && !block.items[0]) {
      event.preventDefault();
      const created = fromBlog("", uid());
      const next = blocksRef.current.map((item) => (item.id === block.id ? created : item));
      focusRef.current = fieldId(created);
      setSelectedId(created.id);
      commit(next);
      return;
    }
    if (!block.items[itemIndex] && block.items.length > 1) {
      event.preventDefault();
      const items = block.items.filter((_, index) => index !== itemIndex);
      const focusIndex = Math.max(0, itemIndex - 1);
      focusRef.current = `field-${block.id}-${focusIndex}`;
      caretRef.current = { id: `field-${block.id}-${focusIndex}`, pos: items[focusIndex]?.length ?? 0 };
      commit(blocksRef.current.map((item) => (item.id === block.id ? { ...block, items } : item)));
      return;
    }
    if (itemIndex === 0) return;
    event.preventDefault();
    const items = block.items.slice();
    const pos = items[itemIndex - 1].length;
    items[itemIndex - 1] += items[itemIndex];
    items.splice(itemIndex, 1);
    focusRef.current = `field-${block.id}-${itemIndex - 1}`;
    caretRef.current = { id: `field-${block.id}-${itemIndex - 1}`, pos };
    commit(blocksRef.current.map((item) => (item.id === block.id ? { ...block, items } : item)));
  };

  const choosePhoto = (url: string) => {
    const id = libraryFor;
    setLibraryFor(null);
    if (!id) return;
    setSelectedId(id);
    commit(blocksRef.current.map((block) => (block.id === id && block.type === "image" ? { ...block, src: url } : block)));
  };

  return (
    <div
      className={`relative flex flex-col gap-10 ${dragging ? "rounded-2xl outline outline-2 outline-dashed outline-brand-400" : ""}`}
      onDragEnter={(event) => {
        if (![...event.dataTransfer.types].includes("Files")) return;
        event.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(event) => {
        if ([...event.dataTransfer.types].includes("Files")) event.preventDefault();
      }}
      onDragLeave={() => {
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
          dragDepth.current = 0;
          setDragging(false);
        }
      }}
      onDrop={(event) => {
        dragDepth.current = 0;
        setDragging(false);
        const files = [...event.dataTransfer.files];
        if (!files.length) return;
        event.preventDefault();
        const selected = blocks.findIndex((block) => block.id === selectedId);
        void addFiles(files, selected === -1 ? blocks.length : selected + 1);
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="sr-only"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          const target = uploadAt.current;
          event.target.value = "";
          setLibraryFor(null);
          void addFiles(files, target.index, target.replaceId);
        }}
      />
      {dragging && <p className="text-sm font-semibold text-brand-700">Drop the photo into the article.</p>}
      {busy && (
        <p className="text-sm text-slate" aria-live="polite">
          Adding photo…
        </p>
      )}

      {blocks.map((block, index) => {
        const selected = selectedId === block.id;
        return (
          <div key={block.id} className="relative">
            {selected && (
              <div className="mb-2 flex max-w-full flex-wrap items-center gap-1">
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-line bg-white p-1 shadow-sm">
                  <span className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate">{labelFor(block.type)}</span>
                  <button type="button" className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink enabled:hover:bg-mist disabled:opacity-30" disabled={index === 0} onClick={() => moveBlock(block.id, -1)}>
                    Up
                  </button>
                  <button type="button" className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink enabled:hover:bg-mist disabled:opacity-30" disabled={index === blocks.length - 1} onClick={() => moveBlock(block.id, 1)}>
                    Down
                  </button>
                  <Anchor
                    open={inserter?.anchor === `toolbar:${block.id}`}
                    placement="down"
                    onClose={closeInserter}
                    onPick={insertType}
                  >
                    <button
                      type="button"
                      className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-ink hover:bg-mist"
                      onClick={() => setInserter({ anchor: `toolbar:${block.id}`, index: index + 1, placement: "down" })}
                    >
                      Add
                    </button>
                  </Anchor>
                  <button type="button" className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50" onClick={() => removeBlock(block.id)}>
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div
              className={selected ? "rounded-md outline outline-2 outline-brand-400" : undefined}
              onClick={() => setSelectedId(block.id)}
            >
              {block.type === "paragraph" || block.type === "heading" || block.type === "quote" ? (
                <div className={block.type === "quote" ? "border-l-4 border-brand-500 py-1 pl-5" : undefined}>
                  <GrowingField
                    id={fieldId(block)}
                    storyStart={index === 0}
                    value={block.text}
                    ariaLabel={labelFor(block.type)}
                    placeholder={
                      block.type === "heading" ? "Add a heading" : block.type === "quote" ? "Add a quote" : "Type / to choose a block"
                    }
                    onChange={(text) => updateText(block.id, text)}
                    onKeyDown={(event) => onTextKeyDown(event, block)}
                    onPaste={(event) => onTextPaste(event, block)}
                    onFocus={() => setSelectedId(block.id)}
                    className={
                      block.type === "heading"
                        ? "font-display text-2xl font-bold tracking-tight text-ink"
                        : block.type === "quote"
                          ? "text-xl font-medium leading-snug text-ink"
                          : "text-[1.0625rem] leading-[1.7] text-ink sm:text-lg"
                    }
                  />
                  {inserter?.anchor === `slash:${block.id}` && (
                    <Anchor open placement="down" onClose={closeInserter} onPick={insertType}>
                      <span className="sr-only">Choose a block</span>
                    </Anchor>
                  )}
                </div>
              ) : block.type === "list" ? (
                <ul className="flex flex-col gap-2">
                  {block.items.map((item, itemIndex) => (
                    <li key={`${block.id}-${itemIndex}`} className="flex gap-3">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                      <GrowingField
                        id={`field-${block.id}-${itemIndex}`}
                        storyStart={index === 0 && itemIndex === 0}
                        value={item}
                        ariaLabel={`List item ${itemIndex + 1}`}
                        placeholder="List item"
                        onChange={(text) => updateItem(block.id, itemIndex, text)}
                        onFocus={() => setSelectedId(block.id)}
                        onKeyDown={(event) => onItemKeyDown(event, block, itemIndex)}
                        onPaste={(event) => {
                          const files = [...event.clipboardData.files].filter((file) => file.type.startsWith("image/"));
                          if (files.length) {
                            event.preventDefault();
                            void addFiles(files, index + 1);
                            return;
                          }
                          const text = event.clipboardData.getData("text/plain");
                          if (!text.includes("\n")) return;
                          event.preventDefault();
                          const at = event.currentTarget.selectionStart;
                          const end = event.currentTarget.selectionEnd;
                          const merged = `${item.slice(0, at)}${text}${item.slice(end)}`.replace(/\r\n/g, "\n");
                          const lines = merged.split("\n");
                          const items = block.items.slice();
                          items.splice(itemIndex, 1, ...lines);
                          const last = itemIndex + lines.length - 1;
                          focusRef.current = `field-${block.id}-${last}`;
                          caretRef.current = { id: `field-${block.id}-${last}`, pos: lines.at(-1)?.length ?? 0 };
                          commit(blocksRef.current.map((entry) => (entry.id === block.id ? { ...block, items } : entry)));
                        }}
                        className="text-[1.0625rem] leading-[1.7] text-ink sm:text-lg"
                      />
                    </li>
                  ))}
                </ul>
              ) : block.type === "image" ? (
                <figure>
                  {block.src ? (
                    <img
                      src={block.src}
                      alt={block.caption || ""}
                      draggable={false}
                      className="mx-auto block h-auto w-auto max-h-[min(85vh,52rem)] max-w-full rounded-3xl object-contain"
                    />
                  ) : (
                    <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-line bg-mist px-6 py-8 text-center">
                      <BlockIcon type="image" />
                      <p className="text-sm font-semibold text-ink">Add a photo here</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                          onClick={() => openUpload(index, block.id)}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
                          onClick={() => setLibraryFor(block.id)}
                        >
                          Media library
                        </button>
                      </div>
                    </div>
                  )}
                  <GrowingField
                    id={fieldId(block)}
                    value={block.caption}
                    ariaLabel="Caption"
                    placeholder="Add a caption"
                    onFocus={() => setSelectedId(block.id)}
                    onChange={(caption) =>
                      commit(
                        blocksRef.current.map((entry) => (entry.id === block.id && entry.type === "image" ? { ...entry, caption } : entry)),
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.preventDefault();
                    }}
                    className="mt-3 text-center text-sm text-slate"
                  />
                  {block.src && (
                    <div className="mt-2 flex justify-center gap-4">
                      <button type="button" className="text-sm font-semibold text-brand-700" onClick={() => openUpload(index, block.id)}>
                        Replace
                      </button>
                      <button type="button" className="text-sm font-semibold text-brand-700" onClick={() => setLibraryFor(block.id)}>
                        Media library
                      </button>
                    </div>
                  )}
                </figure>
              ) : null}
            </div>
          </div>
        );
      })}

      <Anchor open={inserter?.anchor === "end"} placement="up" onClose={closeInserter} onPick={insertType}>
        <button
          type="button"
          className="flex items-center gap-3 rounded-full py-1 text-sm font-semibold text-slate hover:text-ink"
          onClick={() => setInserter({ anchor: "end", index: blocks.length, placement: "up" })}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-lg leading-none text-ink">+</span>
          Add a block
        </button>
      </Anchor>
      {help && <p className="text-xs leading-relaxed text-slate">{help}</p>}

      {libraryFor && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="media-library-title">
          <div className="flex max-h-[min(80vh,40rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <h2 id="media-library-title" className="text-lg font-bold text-ink">
                Media library
              </h2>
              <button type="button" className="text-sm font-semibold text-slate" onClick={() => setLibraryFor(null)}>
                Close
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => {
                    const id = libraryFor;
                    const at = blocksRef.current.findIndex((block) => block.id === id);
                    openUpload(at === -1 ? blocksRef.current.length : at, id);
                  }}
                >
                  Upload
                </button>
              </div>
              {library.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate">No photos yet. Upload one to place it in the article.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {library.map((photo) => (
                    <button key={photo.url} type="button" className="overflow-hidden rounded-xl border border-line" onClick={() => choosePhoto(photo.url)}>
                      <img src={photo.url} alt="" className="aspect-square w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
