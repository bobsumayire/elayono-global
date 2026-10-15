/**
 * Blog posts for Elayono Global.
 *
 * To publish, copy the example into `posts` and set `published` to true.
 * Only published posts appear on the Blog page, article links, and homepage.
 *
 * {
 *   slug: "a-short-url-name",
 *   title: "Article or news headline",
 *   date: "2026-10-14",
 *   excerpt: "One or two sentences for the blog list and link previews.",
 *   category: "News", // "News" for updates, "Article" for longer stories
 *   author: "Elayono Global", // optional
 *   image: "/photos/hero-news.jpg", // optional file in /public
 *   published: true,
 *   body: [
 *     "Opening paragraph.",
 *     { heading: "A section title" },
 *     "Another paragraph.",
 *     { quote: "A short quotation or scripture." },
 *     { list: ["First point", "Second point"] },
 *     { image: "/photos/hero-news.jpg", caption: "Optional caption" },
 *   ],
 * }
 */

export const blogCategories = ["News", "Article"] as const;

export type BlogCategory = (typeof blogCategories)[number];

export type BlogBlock =
  | string
  | { heading: string }
  | { quote: string }
  | { list: string[] }
  | { image: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. Newest posts are shown first. */
  date: string;
  excerpt: string;
  category: BlogCategory;
  author?: string;
  /** Cover image path in /public, for example "/photos/hero-news.jpg". */
  image?: string;
  /** Drafts stay off the site until this is true. */
  published: boolean;
  body: BlogBlock[];
};

export const posts: BlogPost[] = [];

export function publishedPosts(): BlogPost[] {
  return posts.filter((post) => post.published).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPublishedPost(slug: string): BlogPost | undefined {
  return publishedPosts().find((post) => post.slug === slug);
}

export function postAuthor(post: BlogPost): string {
  return post.author?.trim() || "Elayono Global";
}

export function formatBlogDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function readingMinutes(post: BlogPost): number {
  const text = [
    post.excerpt,
    ...post.body.map((block) => {
      if (typeof block === "string") return block;
      if ("heading" in block) return block.heading;
      if ("quote" in block) return block.quote;
      if ("list" in block) return block.list.join(" ");
      return block.caption ?? "";
    }),
  ].join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function categoryLabel(category: BlogCategory): string {
  return category === "Article" ? "Article" : "News";
}
