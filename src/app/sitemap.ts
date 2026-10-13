import type { MetadataRoute } from "next";
import { getAltars, getEvents, getPublishedPosts, getSite } from "@/lib/cms/read";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteConfig, altars, events, posts] = await Promise.all([getSite(), getAltars(), getEvents(), getPublishedPosts()]);
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
  posts.forEach((post) => {
    entries.push({ url: `${siteConfig.url}/blog/${post.slug}`, lastModified: new Date(post.date) });
  });

  return entries;
}
