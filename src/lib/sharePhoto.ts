import { readFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { readMedia } from "@/lib/cms/media";
import { SHARE_FALLBACK, shareImageUrl } from "@/lib/share";
import { siteConfig } from "@/lib/site";

function mime(src: string) {
  if (src.endsWith(".png")) return "image/png";
  if (src.endsWith(".webp")) return "image/webp";
  if (src.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

function dataUrl(bytes: ArrayBuffer, type: string) {
  const safe = type.startsWith("image/") ? type.split(";")[0] : "image/jpeg";
  return `data:${safe};base64,${Buffer.from(bytes).toString("base64")}`;
}

async function bytesOf(body: unknown) {
  if (body instanceof ArrayBuffer) return body;
  if (ArrayBuffer.isView(body)) {
    return body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;
  }
  return new Response(body as BodyInit).arrayBuffer();
}

async function requestOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  if (!host) return siteConfig.url;
  const proto = headerList.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function fromPublicFile(src: string) {
  const filePath = path.join(process.cwd(), "public", src);
  const bytes = await readFile(filePath);
  return dataUrl(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), mime(src));
}

async function fromFetch(url: string) {
  const response = await fetch(url);
  if (!response.ok) return null;
  return dataUrl(await response.arrayBuffer(), response.headers.get("content-type") || "image/jpeg");
}

/** Image bytes for the share card. Returns null when the file cannot be read. */
export async function loadSharePhoto(src: string) {
  const pathName = src.trim();
  if (!pathName || pathName.startsWith("blob:")) return null;
  try {
    if (pathName.startsWith("/api/media/")) {
      const key = decodeURIComponent(pathName.slice("/api/media/".length).split("?")[0]);
      const file = await readMedia(key);
      if (!file) return null;
      return dataUrl(await bytesOf(file.body), file.type);
    }
    if (pathName.startsWith("/")) {
      try {
        return await fromPublicFile(pathName);
      } catch {
        const origin = await requestOrigin();
        return (await fromFetch(new URL(pathName, origin).href)) || (await fromFetch(shareImageUrl(pathName)));
      }
    }
    return await fromFetch(pathName);
  } catch {
    return null;
  }
}

export async function loadArticlePhoto(src: string) {
  return (await loadSharePhoto(src)) || (await loadSharePhoto(SHARE_FALLBACK));
}
