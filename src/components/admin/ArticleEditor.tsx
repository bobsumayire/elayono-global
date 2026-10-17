"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { textToBlocks } from "@/lib/cms/blocks";
import { plainText } from "@/lib/cms/richText";
import { slugify } from "@/lib/cms/schema";
import StoryEditor, { GrowingField, type SelectedBlock, type StoryHandle } from "@/components/admin/StoryEditor";

const blockCopy: Record<SelectedBlock["type"], string> = {
  paragraph: "A paragraph of the article. Select words to bold, italicize, underline, link, or change the font and size. Press Enter for a new paragraph, or type / to insert a photo, heading, quote, or list.",
  heading: "A section title. It appears in the article the same way it does here.",
  quote: "A short quotation or scripture, set off from the paragraphs around it.",
  list: "A list of points. Press Enter to add the next item.",
  image: "This photo is part of the article. The picture you see here is the one readers see, with the caption underneath.",
};

function storyWords(title: string, excerpt: string, body: string) {
  const readable = textToBlocks(body).flatMap((block) => {
    if (typeof block === "string") return [block];
    if ("heading" in block) return [block.heading];
    if ("quote" in block) return [block.quote];
    if ("list" in block) return block.list;
    return block.caption ? [block.caption] : [];
  });
  return [title, excerpt, ...readable].map(plainText).join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function readingLabel(words: number) {
  if (words === 0) return "0 words";
  const minutes = Math.max(1, Math.round(words / 200));
  const wordLabel = words === 1 ? "1 word" : `${words} words`;
  const minuteLabel = minutes === 1 ? "1 minute read time" : `${minutes} minutes read time`;
  return `${wordLabel}, ${minuteLabel}`;
}

export default function ArticleEditor({
  values,
  set,
  error,
  saved,
  pending,
  photos,
  originalId,
  categoryOptions,
  coverHelp,
  onSubmit,
  onDelete,
  uploadingCover,
  onUploadCover,
  onError,
}: {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  error: string;
  saved?: boolean;
  pending: boolean;
  photos: { url: string }[];
  originalId: string;
  categoryOptions: string[];
  coverHelp?: string;
  onSubmit: (event: React.FormEvent) => void;
  onDelete?: () => void;
  uploadingCover: boolean;
  onUploadCover: (file: File | undefined) => void;
  onError: (message: string) => void;
}) {
  const storyRef = useRef<StoryHandle>(null);
  const [selected, setSelected] = useState<SelectedBlock | null>(null);
  const [tab, setTab] = useState<"post" | "block">("post");
  const [storyBusy, setStoryBusy] = useState(false);
  const words = storyWords(values.title ?? "", values.excerpt ?? "", values.body ?? "");
  const published = values.published === "true";

  const onSelect = useCallback((block: SelectedBlock | null) => {
    setSelected((current) => {
      if (!block && !current) return current;
      if (block && current && block.id === current.id && block.type === current.type && block.index === current.index) return current;
      return block;
    });
  }, []);

  const onBusy = useCallback((busy: boolean) => {
    setStoryBusy((current) => (current === busy ? current : busy));
  }, []);

  const fieldClass = "w-full rounded-xl border border-line bg-white px-3 py-2 text-base text-ink outline-none focus:border-brand-500 sm:text-sm";

  return (
    <form
      onSubmit={(event) => {
        if (storyBusy) {
          event.preventDefault();
          return;
        }
        onSubmit(event);
      }}
      className="-mx-5 -my-8 flex min-h-dvh flex-col bg-white sm:-mx-8 lg:flex-row lg:items-start"
    >
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <Link href="/admin/content/blog" className="text-sm font-semibold text-brand-700">
            ← Blog
          </Link>
          <div className="flex items-center gap-2">
            <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline ${published ? "bg-brand-50 text-brand-700" : "bg-mist text-slate"}`}>
              {published ? "Published" : "Draft"}
            </span>
            <button
              type="button"
              className="rounded-full border border-line px-3 py-2 text-sm font-semibold text-ink lg:hidden"
              onClick={() => document.getElementById("article-settings")?.scrollIntoView({ behavior: "smooth" })}
            >
              Settings
            </button>
            <button
              type="submit"
              disabled={pending || storyBusy}
              className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {storyBusy ? "Adding photo…" : pending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>

        {saved && <p className="bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 sm:px-6">Saved. The website is updated.</p>}
        {error && <p className="bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:px-6">{error}</p>}

        <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8 sm:px-8 sm:py-12">
          <GrowingField
            ariaLabel="Title"
            autoFocus={originalId === "new"}
            value={values.title ?? ""}
            placeholder="Add title"
            onChange={(title) => set("title", title)}
            onBlur={(event) => {
              const title = event.currentTarget.value;
              if (!values.slug.trim() && title.trim()) set("slug", slugify(title));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                document.querySelector<HTMLElement>("[data-story-start]")?.focus();
              }
            }}
            className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-ink sm:text-[2.5rem]"
          />
          <div className="mt-12">
            <StoryEditor
              ref={storyRef}
              value={values.body ?? ""}
              onChange={(body) => set("body", body)}
              photos={photos}
              onError={onError}
              onSelect={onSelect}
              onBusy={onBusy}
            />
          </div>
        </div>
      </div>

      <aside id="article-settings" className="w-full border-t border-line bg-white lg:sticky lg:top-0 lg:max-h-dvh lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <div className="flex border-b border-line">
          {(["post", "block"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`flex-1 px-4 py-3 text-sm font-semibold ${tab === item ? "border-b-2 border-ink text-ink" : "text-slate"}`}
            >
              {item === "post" ? "Post" : "Block"}
            </button>
          ))}
        </div>

        {tab === "block" ? (
          <div className="flex flex-col gap-4 p-5">
            {selected ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-ink">{blockCopy[selected.type] ? selected.type[0].toUpperCase() + selected.type.slice(1) : "Block"}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate">{blockCopy[selected.type]}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ink disabled:opacity-30" disabled={selected.index === 0} onClick={() => storyRef.current?.move(selected.id, -1)}>
                    Move up
                  </button>
                  <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-ink" onClick={() => storyRef.current?.move(selected.id, 1)}>
                    Move down
                  </button>
                  <button type="button" className="rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-red-700" onClick={() => storyRef.current?.remove(selected.id)}>
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm leading-relaxed text-slate">Select a paragraph, heading, list, quote, or photo in the article to change it.</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5 p-5">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Excerpt</span>
              <textarea
                value={values.excerpt ?? ""}
                onChange={(event) => set("excerpt", event.target.value)}
                rows={4}
                placeholder="One or two sentences for the blog list and link previews."
                className={fieldClass}
              />
            </label>
            <p className="text-sm text-slate">{readingLabel(words)}</p>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Status</span>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-mist p-1">
                <button
                  type="button"
                  onClick={() => set("published", "false")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${published ? "text-slate" : "bg-white text-ink shadow-sm"}`}
                >
                  Draft
                </button>
                <button
                  type="button"
                  onClick={() => set("published", "true")}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold ${published ? "bg-white text-ink shadow-sm" : "text-slate"}`}
                >
                  Published
                </button>
              </div>
              <span className="text-xs leading-relaxed text-slate">Only published articles appear on the website.</span>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Publish</span>
              <input type="date" value={values.date ?? ""} onChange={(event) => set("date", event.target.value)} className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Category</span>
              <select value={values.category ?? categoryOptions[0]} onChange={(event) => set("category", event.target.value)} className={fieldClass}>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Author</span>
              <input value={values.author ?? ""} onChange={(event) => set("author", event.target.value)} className={fieldClass} />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Slug</span>
              <input
                value={values.slug ?? ""}
                onChange={(event) => set("slug", event.target.value)}
                onBlur={() => set("slug", slugify(values.slug || values.title))}
                placeholder="article-name"
                className={fieldClass}
              />
              <span className="text-xs text-slate">/blog/{values.slug || "article-name"}</span>
            </label>

            <div className="flex flex-col gap-2 border-t border-line pt-5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate">Featured image</span>
              {coverHelp && <span className="text-xs leading-relaxed text-slate">{coverHelp}</span>}
              {values.image ? (
                <img src={values.image} alt="" className="mx-auto block max-h-48 w-auto max-w-full rounded-xl object-contain" />
              ) : (
                <div className="flex min-h-28 items-center justify-center rounded-xl bg-mist px-4 text-center text-sm text-slate">No featured image yet.</div>
              )}
              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer text-sm font-semibold text-brand-700">
                  {uploadingCover ? "Uploading…" : values.image ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={uploadingCover}
                    onChange={(event) => {
                      onUploadCover(event.target.files?.[0]);
                      event.target.value = "";
                    }}
                  />
                </label>
                {values.image && (
                  <button type="button" className="text-sm font-semibold text-red-700" onClick={() => set("image", "")}>
                    Remove
                  </button>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border border-line">
                <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate">Link preview</p>
                {values.image ? (
                  <img src={values.image} alt="" className="mx-auto mt-3 block max-h-36 w-auto max-w-full object-contain" />
                ) : (
                  <div className="mx-3 mt-3 flex min-h-20 items-center justify-center rounded-lg bg-mist px-3 text-center text-xs text-slate">Shared links use this photo.</div>
                )}
                <div className="p-3">
                  <p className="font-semibold text-ink">{values.title || "Article title"}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate">{values.excerpt || "The excerpt appears under the photo."}</p>
                </div>
              </div>
            </div>

            {onDelete && (
              <button type="button" className="self-start text-sm font-semibold text-red-700" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </aside>
    </form>
  );
}
