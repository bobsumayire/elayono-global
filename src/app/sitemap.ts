import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { altars } from "@/data/altars";
import { news } from "@/data/news";

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
  "/news",
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
  news.forEach((n) => {
    entries.push({ url: `${siteConfig.url}/news/${n.slug}`, lastModified: new Date(n.date) });
  });

  return entries;
}
