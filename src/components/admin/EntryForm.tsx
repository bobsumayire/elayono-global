"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeEntry, saveEntry, uploadImage } from "@/lib/cms/actions";
import { slugify, type CollectionSchema } from "@/lib/cms/schema";

export default function EntryForm({
  schema,
  initial,
  originalId,
  saved,
}: {
  schema: CollectionSchema;
  initial: Record<string, string>;
  originalId: string;
  saved?: boolean;
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

  return (
    <form onSubmit={onSubmit} className="flex max-w-3xl flex-col gap-5">
      {saved && <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">Saved. The website is updated.</p>}
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      {schema.fields.map((field) => (
        <label key={field.key} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">{field.label}</span>
          {field.type === "textarea" || field.type === "lines" || field.type === "pairs" || field.type === "blocks" ? (
            <textarea
              value={values[field.key] ?? ""}
              onChange={(event) => set(field.key, event.target.value)}
              rows={field.type === "blocks" || field.type === "lines" ? 8 : 4}
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
                <img src={values[field.key]} alt="" className="h-40 w-full rounded-xl object-cover" />
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
          {field.help && <span className="text-xs leading-relaxed text-slate">{field.help}</span>}
        </label>
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
