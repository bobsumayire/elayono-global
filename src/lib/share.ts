import { siteConfig } from "@/lib/site";

const FALLBACK = "/photos/hero-news.jpg";

/** Absolute image address for WhatsApp, Facebook and other link previews. */
export function shareImageUrl(src?: string) {
  const path = src?.trim() || FALLBACK;
  try {
    return new URL(path, siteConfig.url).href;
  } catch {
    return new URL(FALLBACK, siteConfig.url).href;
  }
}
