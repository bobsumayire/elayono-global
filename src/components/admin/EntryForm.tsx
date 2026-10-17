"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeEntry, saveEntry, uploadImage } from "@/lib/cms/actions";
import { slugify, type ClientCollection } from "@/lib/cms/schema";
import ArticleEditor from "@/components/admin/ArticleEditor";
import StoryEditor from "@/components/admin/StoryEditor";

export default function EntryForm({
  schema,
  initial,
  originalId,
  saved,
  photos = [],
}: {
  schema: ClientCollection;
  initial: Record<string, string>;
  originalId: string;
  saved?: boolean;
  photos?: { url: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState("");
  const [pending, setPending] = useState(false);

  const set = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    const next = { ...values };
    if (schema.fields.some((field) => field.key === "slug") && !next.slug.trim() && next.title) {
      next.slug = slugify(next.title);
      set("slug", next.slug);
    }
    const result = await saveEntry(schema.name, originalId, next);
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  };

  const upload = async (key: string, file: File | undefined) => {
    if (!file) return;
    setUploading(key);
    setError("");
    const body = new FormData();
    body.set("file", file);
    const result = await uploadImage(body);
    setUploading("");
    if (result.error || !result.url) {
      setError(result.error ?? "The image could not be uploaded.");
      return;
    }
    set(key, result.url);
  };

  if (schema.name === "blog") {
    const category = schema.fields.find((field) => field.key === "category");
    const cover = schema.fields.find((field) => field.key === "image");
    return (
      <ArticleEditor
        values={values}
        set={set}
        error={error}
        saved={saved}
        pending={pending}
        photos={photos}
        originalId={originalId}
        categoryOptions={category?.options ?? ["News", "Article"]}
        coverHelp={cover?.help}
        onSubmit={onSubmit}
        onError={setError}
        onDelete={
          originalId === "new"
            ? undefined
            : async () => {
                if (!confirm("Delete this article? It will disappear from the website.")) return;
                await removeEntry(schema.name, originalId);
                router.refresh();
              }
        }
        uploadingCover={uploading === "image"}
        onUploadCover={(file) => upload("image", file)}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-5">
      {saved && <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">Saved. The website is updated.</p>}
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      {schema.fields.map((field) => (
        <div key={field.key} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">{field.label}</span>
          {field.type === "blocks" ? (
            <StoryEditor
              value={values[field.key] ?? ""}
              onChange={(next) => set(field.key, next)}
              photos={photos}
              help={field.help}
              onError={setError}
            />
          ) : field.type === "textarea" || field.type === "lines" || field.type === "pairs" ? (
            <textarea
              value={values[field.key] ?? ""}
              onChange={(event) => set(field.key, event.target.value)}
              rows={field.type === "lines" ? 8 : 4}
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-500"
            />
          ) : field.type === "select" ? (
            <select
              value={values[field.key] ?? ""}
              onChange={(event) => set(field.key, event.target.value)}
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-500"
            >
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={values[field.key] === "true"}
              onChange={(event) => set(field.key, event.target.checked ? "true" : "false")}
              className="h-5 w-5 accent-brand-600"
            />
          ) : field.type === "image" ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4">
              {values[field.key] && (
                <img src={values[field.key]} alt="" className="mx-auto block h-auto w-auto max-h-[min(70vh,32rem)] max-w-full rounded-xl object-contain" />
              )}
              <input
                value={values[field.key] ?? ""}
                onChange={(event) => set(field.key, event.target.value)}
                placeholder="Image address, or upload below"
                className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => upload(field.key, event.target.files?.[0])}
                className="text-sm text-slate"
              />
              {uploading === field.key && <span className="text-xs text-slate">Uploading…</span>}
              {schema.name === "blog" && field.key === "image" && (
                <div className="overflow-hidden rounded-2xl border border-line">
                  <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate">Link preview</p>
                  {values.image ? (
                    <img src={values.image} alt="" className="mx-auto mt-3 block h-auto w-auto max-h-[min(70vh,32rem)] max-w-full object-contain" />
                  ) : (
                    <div className="mx-3 mt-3 flex min-h-36 items-center justify-center rounded-xl bg-mist px-6 py-8 text-center text-sm text-slate">
                      Add a cover photo. Shared links use it as the preview.
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-semibold text-ink">{values.title || "Article title"}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate">{values.excerpt || "The excerpt appears under the photo."}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <input
              type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
              value={values[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(event) => set(field.key, event.target.value)}
              onBlur={() => {
                if (field.key === "title" && schema.fields.some((item) => item.key === "slug") && !values.slug) {
                  set("slug", slugify(values.title));
                }
              }}
              className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-500"
            />
          )}
          {field.help && field.type !== "blocks" && <span className="text-xs leading-relaxed text-slate">{field.help}</span>}
        </div>
      ))}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {!schema.singleton && originalId !== "new" && (
          <button
            type="button"
            className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-red-700"
            onClick={async () => {
              if (!confirm("Delete this entry? It will disappear from the website.")) return;
              await removeEntry(schema.name, originalId);
              router.refresh();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
