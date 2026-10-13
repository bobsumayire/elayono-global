import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { altars } from "@/data/altars";
import { publishedPosts } from "@/data/blog";
import { events } from "@/data/events";

const staticRoutes = [
  "",
  "/about",
  "/founder",
  "/sermons",
  "/watch-live",
  "/events",
  "/prayer-request",
  "/testimonies",
  "/give",
  "/altars",
  "/ministries",
  "/media",
  "/blog",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
  }));

  altars.forEach((a) => {
    entries.push({ url: `${siteConfig.url}/altars/${a.slug}`, lastModified: now });
  });
  events.forEach((e) => {
    entries.push({ url: `${siteConfig.url}/events/${e.slug}`, lastModified: now });
  });
  publishedPosts().forEach((post) => {
    entries.push({ url: `${siteConfig.url}/blog/${post.slug}`, lastModified: new Date(post.date) });
  });

  return entries;
}
