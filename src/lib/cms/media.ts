import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { platformEnv } from "@/lib/cms/store";

const UPLOADS = path.join(process.cwd(), "public", "uploads");
const SHARE_DIR = path.join(process.cwd(), ".data", "share");
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type MediaFile = { key: string; url: string };

function safeKey(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
  return `${Date.now()}-${base || "image"}`.slice(0, 80);
}

export async function listMedia(): Promise<MediaFile[]> {
  if (process.env.NODE_ENV !== "production") {
    try {
      const names = await readdir(UPLOADS);
      return names.filter((name) => !name.startsWith(".")).map((name) => ({ key: name, url: `/uploads/${name}` }));
    } catch {
      return [];
    }
  }
  const env = await platformEnv();
  if (!env?.MEDIA) return [];
  const listed = await env.MEDIA.list({ limit: 200 });
  return listed.objects.map((object) => ({ key: object.key, url: `/api/media/${object.key}` }));
}

export async function saveMedia(file: File): Promise<MediaFile> {
  const extension = TYPES[file.type];
  if (!extension) throw new Error("Use a JPG, PNG, WEBP or GIF image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be 8 MB or smaller.");
  const key = safeKey(file.name.replace(/\.[^.]+$/, "")) + `.${extension}`;
  const bytes = await file.arrayBuffer();

  if (process.env.NODE_ENV !== "production") {
    await mkdir(UPLOADS, { recursive: true });
    await writeFile(path.join(UPLOADS, key), Buffer.from(bytes));
    return { key, url: `/uploads/${key}` };
  }

  const env = await platformEnv();
  if (!env?.MEDIA) throw new Error("Media storage is not connected.");
  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: file.type } });
  return { key, url: `/api/media/${key}` };
}

export async function deleteMedia(key: string) {
  if (!/^[\w.-]+$/.test(key)) throw new Error("That file could not be found.");
  if (process.env.NODE_ENV !== "production") {
    await unlink(path.join(UPLOADS, key));
    return;
  }
  const env = await platformEnv();
  if (!env?.MEDIA) throw new Error("Media storage is not connected.");
  await env.MEDIA.delete(key);
}

function shareKey(slug: string, version: string) {
  const key = `share-${slug}-${version}.jpg`;
  return /^share-[a-z0-9.-]+$/.test(key) ? key : null;
}

export async function readShareJpeg(slug: string, version: string) {
  const key = shareKey(slug, version);
  if (!key) return null;
  const env = await platformEnv();
  if (env?.MEDIA) {
    const object = await env.MEDIA.get(key);
    if (!object) return null;
    return new Uint8Array(await new Response(object.body).arrayBuffer());
  }
  try {
    return new Uint8Array(await readFile(path.join(SHARE_DIR, key)));
  } catch {
    return null;
  }
}

export async function writeShareJpeg(slug: string, version: string, bytes: Uint8Array) {
  const key = shareKey(slug, version);
  if (!key) return;
  const env = await platformEnv();
  if (env?.MEDIA) {
    const body = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    await env.MEDIA.put(key, body, { httpMetadata: { contentType: "image/jpeg" } });
    return;
  }
  await mkdir(SHARE_DIR, { recursive: true });
  await writeFile(path.join(SHARE_DIR, key), Buffer.from(bytes));
}

export async function readMedia(key: string) {
  if (!/^[\w.-]+$/.test(key)) return null;
  const env = await platformEnv();
  const object = await env?.MEDIA?.get(key);
  if (!object) return null;
  return {
    body: object.body,
    type: object.httpMetadata?.contentType || "application/octet-stream",
  };
}
