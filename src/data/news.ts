export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
};

/**
 * Placeholder news/articles. Replace with real ministry updates — this feed
 * powers both the News page and the homepage highlights.
 */
export const news: NewsArticle[] = [
  {
    slug: "sweden-altar-launch",
    title: "Elayono Global Opens New Altar in Stockholm",
    date: "2026-06-12",
    excerpt:
      "We are grateful to announce the launch of our newest altar in Sweden, extending the Elayono Global family into the Nordic region.",
    image:
      "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=1200&auto=format&fit=crop",
    category: "Ministry News",
  },
  {
    slug: "global-prayer-conference-announced",
    title: "Global Prayer Conference 2026 Announced",
    date: "2026-07-20",
    excerpt:
      "Believers from every altar will gather both in person and online for three days of prayer, worship and impartation.",
    image:
      "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1200&auto=format&fit=crop",
    category: "Events",
  },
  {
    slug: "media-ministry-expansion",
    title: "Media Ministry Expands Global Streaming",
    date: "2026-08-02",
    excerpt:
      "Elayono Global's Media Ministry is expanding its reach, bringing sermons and teachings to believers around the world.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200&auto=format&fit=crop",
    category: "Ministry News",
  },
];
