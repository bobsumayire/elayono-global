import type { Metadata } from "next";
import { postAuthor, type BlogPost } from "@/data/blog";
import { ensureShareJpeg } from "@/lib/shareCard";
import { articleShareSource, shareImageId, shareImagePath } from "@/lib/share";
import { siteConfig } from "@/lib/site";

/** Open Graph tags for an article. The JPEG is written before the page is sent, so the preview photo is already there. */
export async function articleMetadata(post: BlogPost, pagePath: string): Promise<Metadata> {
  const source = articleShareSource(post);
  const imageUrl = new URL(shareImagePath(shareImageId(post.slug, source)), siteConfig.url).href;
  await ensureShareJpeg(post.slug, source).catch(() => undefined);
  const image = {
    url: imageUrl,
    secureUrl: imageUrl,
    width: 1200,
    height: 630,
    alt: post.title,
    type: "image/jpeg" as const,
  };

  return {
    metadataBase: new URL(siteConfig.url),
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: pagePath },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: pagePath,
      type: "article",
      publishedTime: post.date,
      authors: [postAuthor(post)],
      siteName: siteConfig.name,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [image],
    },
  };
}
