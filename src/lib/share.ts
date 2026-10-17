import type { BlogPost } from "@/data/blog";
import { siteConfig } from "@/lib/site";

export const SHARE_FALLBACK = "/photos/hero-news.jpg";

/** Absolute image address for WhatsApp, Facebook and other link previews. */
export function shareImageUrl(src?: string) {
  const path = src?.trim() || SHARE_FALLBACK;
  try {
    return new URL(path, siteConfig.url).href;
  } catch {
    return new URL(SHARE_FALLBACK, siteConfig.url).href;
  }
}

/** Cover photo, otherwise the first photo in the story, otherwise a site photo. */
export function articleShareSource(post: Pick<BlogPost, "image" | "body">) {
  const cover = post.image?.trim();
  if (cover && !cover.startsWith("blob:")) return cover;
  for (const block of post.body) {
    if (typeof block !== "string" && "image" in block && block.image.trim() && !block.image.startsWith("blob:")) return block.image.trim();
  }
  return SHARE_FALLBACK;
}

export function shareVersion(source: string) {
  let hash = 0;
  for (const char of source) hash = Math.imul(hash, 31) + char.charCodeAt(0);
  return (hash >>> 0).toString(16);
}

/** Short id for /i/{id}.jpg. WhatsApp only attaches a photo when the address ends in .jpg. */
export function shareImageId(slug: string, source: string) {
  return shareVersion(`${slug}\n${source}`);
}

export function shareImagePath(id: string) {
  return `/i/${id}.jpg`;
}

/** Stable address for a share. WhatsApp remembers each address, so this one is separate from the article page. */
export function sharePageId(slug: string) {
  return shareVersion(`page:${slug}`);
}

export function sharePagePath(slug: string) {
  return `/s/${sharePageId(slug)}`;
}
