import { altars } from "@/data/altars";
import { posts } from "@/data/blog";
import { events } from "@/data/events";
import { founder } from "@/data/founder";
import { galleryImages } from "@/data/gallery";
import { ministries } from "@/data/ministries";
import { sermons } from "@/data/sermons";
import { testimonies } from "@/data/testimonies";
import { testimonyVideos } from "@/data/testimonyVideos";
import { siteConfig } from "@/lib/site";

export type SeedRecord = { id: string; data: Record<string, unknown> };

export function seedDocuments(collection: string): SeedRecord[] {
  switch (collection) {
    case "blog":
      return posts.map((post) => ({ id: post.slug, data: { ...post } }));
    case "events":
      return events.map((event) => ({ id: event.slug, data: { ...event } }));
    case "sermons":
      return sermons.map((sermon) => ({ id: sermon.slug, data: { ...sermon } }));
    case "gallery":
      return galleryImages.map((image, index) => {
        const id = `photo-${index + 1}`;
        return { id, data: { ...image, id } };
      });
    case "testimonies":
      return testimonies.map((testimony, index) => {
        const id = `testimony-${index + 1}`;
        return { id, data: { ...testimony, id } };
      });
    case "testimonyVideos":
      return testimonyVideos.map((video) => ({ id: video.youtubeId, data: { ...video } }));
    case "altars":
      return altars.map((altar) => ({ id: altar.slug, data: { ...altar } }));
    case "ministries":
      return ministries.map((ministry) => ({ id: ministry.slug, data: { ...ministry } }));
    case "founder":
      return [{ id: "main", data: { ...founder } }];
    case "site":
      return [{ id: "main", data: { ...siteConfig } }];
    default:
      return [];
  }
}
