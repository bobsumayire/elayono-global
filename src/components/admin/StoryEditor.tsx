"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/cms/actions";

type Photo = { url: string };

function pictureFromLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("! ")) return null;
  const [src, ...captionParts] = trimmed.slice(2).split("|");
  return { src: src.trim(), caption: captionParts.join("|").trim() };
}

export default function StoryEditor({
  value,
  onChange,
  photos,
  help,
  onError,
}: {
  value: string;
  onChange: (value: string) => void;
  photos: Photo[];
  help?: string;
  onError: (message: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const pictures = value
    .split("\n")
    .map(pictureFromLine)
    .filter((picture): picture is { src: string; caption: string } => Boolean(picture?.src));

  const append = (url: string) => {
    const line = `! ${url}`;
    onChange(value.trim() ? `${value.trimEnd()}\n\n${line}\n` : `${line}\n`);
  };

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    setUploading(true);
    onError("");
    let next = value;
    for (const file of list) {
      const body = new FormData();
      body.set("file", file);
      const result = await uploadImage(body);
      if (result.error || !result.url) {
        onError(result.error ?? "The photo could not be added.");
        break;
      }
      const line = `! ${result.url}`;
      next = next.trim() ? `${next.trimEnd()}\n\n${line}\n` : `${line}\n`;
    }
    onChange(next);
    setUploading(false);
  };

  const setCaption = (src: string, caption: string) => {
    const lines = value.split("\n");
    const index = lines.findIndex((line) => pictureFromLine(line)?.src === src);
    if (index === -1) return;
    lines[index] = caption.trim() ? `! ${src} | ${caption.trim()}` : `! ${src}`;
    onChange(lines.join("\n"));
  };

  const remove = (src: string) => {
    const lines = value.split("\n");
    const index = lines.findIndex((line) => pictureFromLine(line)?.src === src);
    if (index === -1) return;
    lines.splice(index, 1);
    onChange(lines.join("\n").replace(/\n{3,}/g, "\n\n"));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
          {uploading ? "Adding…" : "Add photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              void upload(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        <button
          type="button"
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink"
          onClick={() => setLibraryOpen((open) => !open)}
        >
          {libraryOpen ? "Hide library" : "Choose from library"}
        </button>
      </div>
      {libraryOpen && (
        <div className="rounded-2xl border border-line bg-white p-3">
          {photos.length === 0 ? (
            <p className="px-2 py-4 text-sm text-slate">No photos in the library yet. Use Add photo to upload one into this article.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((photo) => (
                <button
                  key={photo.url}
                  type="button"
                  className="overflow-hidden rounded-xl border border-line"
                  onClick={() => append(photo.url)}
                >
                  <img src={photo.url} alt="" className="h-20 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={10}
        className="rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand-500"
      />
      {help && <span className="text-xs leading-relaxed text-slate">{help}</span>}
      {pictures.length > 0 && (
        <div className="flex flex-col gap-3">
          {pictures.map((picture, index) => (
            <div key={`${picture.src}-${index}`} className="flex gap-3 rounded-2xl border border-line bg-white p-3">
              <img src={picture.src} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  value={picture.caption}
                  onChange={(event) => setCaption(picture.src, event.target.value)}
                  placeholder="Caption, optional"
                  className="rounded-xl border border-line px-3 py-2 text-sm outline-none focus:border-brand-500"
                />
                <button type="button" className="self-start text-sm font-semibold text-red-700" onClick={() => remove(picture.src)}>
                  Remove from article
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
