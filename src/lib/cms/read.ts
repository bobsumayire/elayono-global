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

export async function getTestimonies() {
  return docs<Testimony>(await readCollection("testimonies"));
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
  return (doc as typeof founderSeed | null) ?? founderSeed;
}

export async function getSite(): Promise<SiteSettings> {
  const doc = await readDocument("site", "main");
  if (!doc) return siteConfig;
  return { ...siteConfig, ...(doc as SiteSettings), social: { ...siteConfig.social, ...((doc.social as SiteSettings["social"]) ?? {}) } };
}
