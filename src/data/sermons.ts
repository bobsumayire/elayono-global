export type Sermon = {
  slug: string;
  title: string;
  speaker: string;
  series?: string;
  date: string; // ISO date
  duration: string;
  summary: string;
  thumbnail: string;
  videoUrl?: string; // external video platform URL (YouTube/Vimeo) — wire up when available
};

/**
 * Sample sermon library. Replace with real messages (and connect videoUrl to
 * your YouTube/Vimeo channel) as they become available — the Sermons and
 * Watch Live pages will pick up new entries automatically.
 */
export const sermons: Sermon[] = [
  {
    slug: "beyond-borders",
    title: "Taking the Gospel Beyond Borders",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Global Mission",
    date: "2026-08-30",
    duration: "58 min",
    summary:
      "A call to the global church to carry the Gospel with excellence, courage and love — reaching every nation Elayono touches.",
    thumbnail:
      "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "faith-that-builds",
    title: "Faith That Builds",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Foundations",
    date: "2026-08-23",
    duration: "51 min",
    summary:
      "Understanding the kind of faith that doesn't just believe, but builds — families, communities and nations for the Kingdom.",
    thumbnail:
      "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "a-generation-arising",
    title: "A Generation Arising",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Foundations",
    date: "2026-08-16",
    duration: "47 min",
    summary:
      "Raising a generation anchored in God's purpose — equipped, confident and ready to transform their world.",
    thumbnail:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "one-family-one-faith",
    title: "One Family, One Faith",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Global Mission",
    date: "2026-08-09",
    duration: "55 min",
    summary:
      "What it means to belong to a global family united across nations, cultures and languages by one unshakeable faith.",
    thumbnail:
      "https://images.unsplash.com/photo-1508186225823-0963cf9ab0de?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "the-open-heaven",
    title: "The Open Heaven",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Encounter",
    date: "2026-08-02",
    duration: "62 min",
    summary:
      "Living daily under an open heaven — walking in the presence, provision and power of God.",
    thumbnail:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "rooted-and-fruitful",
    title: "Rooted and Fruitful",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Encounter",
    date: "2026-07-26",
    duration: "49 min",
    summary:
      "A message on staying rooted in God's Word so that every season of life produces lasting fruit.",
    thumbnail:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
  },
];
