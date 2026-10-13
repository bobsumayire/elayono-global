"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { removeImage, uploadImage } from "@/lib/cms/actions";
import type { MediaFile } from "@/lib/cms/media";

export default function MediaLibrary({ files }: { files: MediaFile[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [pending, setPending] = useState(false);

  const upload = async (list: FileList | null) => {
    if (!list?.length) return;
    setPending(true);
    setError("");
    for (const file of list) {
      const body = new FormData();
      body.set("file", file);
      const result = await uploadImage(body);
      if (result.error) {
        setError(result.error);
        break;
      }
    }
    setPending(false);
    router.refresh();
  };

  const copy = async (url: string) => {
    const absolute = `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(absolute);
    setCopied(url);
  };

  return (
    <div className="flex flex-col gap-6">
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border border-dashed border-brand-300 bg-white px-6 py-10 text-center">
        <span className="text-sm font-semibold text-ink">{pending ? "Uploading…" : "Upload photos"}</span>
        <span className="text-xs text-slate">JPG, PNG, WEBP or GIF, up to 8 MB.</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={(event) => upload(event.target.files)}
        />
      </label>
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      {files.length === 0 ? (
        <p className="text-sm text-slate">No uploaded photos yet. Existing site photos stay available at their current addresses.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <article key={file.key} className="overflow-hidden rounded-3xl border border-line bg-white">
              <img src={file.url} alt="" className="h-44 w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-3">
                <button type="button" onClick={() => copy(file.url)} className="text-sm font-semibold text-brand-600">
                  {copied === file.url ? "Copied" : "Copy link"}
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-red-700"
                  onClick={async () => {
                    if (!confirm("Remove this photo from the library?")) return;
                    const result = await removeImage(file.key);
                    if (result.error) setError(result.error);
                    else router.refresh();
                  }}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
