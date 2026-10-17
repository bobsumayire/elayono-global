import type { Altar } from "@/data/altars";
import type { BlogPost } from "@/data/blog";
import type { EventItem } from "@/data/events";
import type { GalleryImage } from "@/data/gallery";
import type { Ministry } from "@/data/ministries";
import type { Sermon } from "@/data/sermons";
import type { Testimony } from "@/data/testimonies";
import type { TestimonyVideo } from "@/data/testimonyVideos";
import { siteConfig, type SiteSettings } from "@/lib/site";
import { founder as founderSeed } from "@/data/founder";
import { readCollection, readDocument } from "@/lib/cms/store";
import { sharePageId } from "@/lib/share";

function docs<T>(rows: { data: Record<string, unknown> }[]) {
  return rows.map((row) => row.data as T);
}

export async function getBlogPosts() {
  const posts = docs<BlogPost>(await readCollection("blog"));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPublishedPosts() {
  return (await getBlogPosts()).filter((post) => post.published);
}

export async function getPublishedPost(slug: string) {
  return (await getPublishedPosts()).find((post) => post.slug === slug) ?? null;
}

export async function getPublishedPostBySharePage(id: string) {
  if (!/^[a-f0-9]+$/.test(id)) return null;
  return (await getPublishedPosts()).find((post) => sharePageId(post.slug) === id) ?? null;
}

export async function getEvents() {
  const events = docs<EventItem>(await readCollection("events"));
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSermons() {
  const sermons = docs<Sermon>(await readCollection("sermons"));
  return sermons.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getGallery() {
  return docs<GalleryImage>(await readCollection("gallery"));
}

function isSampleTestimony(testimony: Testimony) {
  return testimony.quote.trim().startsWith("Sample testimony placeholder");
}

export async function getTestimonies() {
  const testimonies = docs<Testimony>(await readCollection("testimonies"));
  return testimonies.filter((testimony) => !isSampleTestimony(testimony));
}

export async function getTestimonyVideos() {
  return docs<TestimonyVideo>(await readCollection("testimonyVideos"));
}

export async function getAltars() {
  return docs<Altar>(await readCollection("altars"));
}

export async function getAltar(slug: string) {
  return (await getAltars()).find((altar) => altar.slug === slug) ?? null;
}

export async function getMinistries() {
  return docs<Ministry>(await readCollection("ministries"));
}

export async function getFounder() {
  const doc = await readDocument("founder", "main");
  if (!doc) return founderSeed;
  const saved = doc as typeof founderSeed;
  return { ...founderSeed, ...saved, portrait: saved.portrait || founderSeed.portrait };
}

export async function getSite(): Promise<SiteSettings> {
  const doc = await readDocument("site", "main");
  if (!doc) return siteConfig;
  return { ...siteConfig, ...(doc as SiteSettings), social: { ...siteConfig.social, ...((doc.social as SiteSettings["social"]) ?? {}) } };
}
