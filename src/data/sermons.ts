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
 * Sermon library sourced from Rev Prophet Ernest NYIRINDEKWE's YouTube channel
 * (youtube.com/@propheternestnyirindekwe715), favoring the international
 * crusades and revivals with the best-designed thumbnails.
 */
export const sermons: Sermon[] = [
  {
    slug: "injira-mugihe-cyawe-paris",
    title: "Injira Mugihe Cyawe — Live in Paris, France",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Injira Mugihe Cyawe",
    date: "2026-07-10",
    duration: "4h 40m",
    summary:
      "Day One of the Paris crusade — a prophetic call to step into your season and carry the Gospel across the nations of Europe.",
    thumbnail: "https://i.ytimg.com/vi/jMkv7VGMQhE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=jMkv7VGMQhE",
  },
  {
    slug: "injira-mugihe-cyawe-sweden",
    title: "Injira Mugihe Cyawe — Grand Finale in Sweden",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Injira Mugihe Cyawe",
    date: "2025-07-06",
    duration: "6h 2m",
    summary:
      "The Grand Finale of the Sweden crusade in Stockholm — a powerful close to a season of prosperity, prayer and prophetic impartation.",
    thumbnail: "https://i.ytimg.com/vi/adurVRIbIYc/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=adurVRIbIYc",
  },
  {
    slug: "injira-mugihe-cyawe-montreal",
    title: "Injira Mugihe Cyawe — Grand Finale in Montréal, Canada",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Injira Mugihe Cyawe",
    date: "2025-08-24",
    duration: "9h 2m",
    summary:
      "Edition 3's Grand Finale in Montréal — celebrating Elayono's family in Canada with a full day of worship, teaching and testimony.",
    thumbnail: "https://i.ytimg.com/vi/a9GtkL56_FI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=a9GtkL56_FI",
  },
  {
    slug: "europe-revival-brussels",
    title: "Europe Revival — Live in Brussels, Belgium",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Europe Revival",
    date: "2025-10-26",
    duration: "1h 43m",
    summary:
      "A Sunday revival service in Brussels calling the European church to a fresh outpouring and a bold, unashamed faith.",
    thumbnail: "https://i.ytimg.com/vi/aFju4q4wKAM/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=aFju4q4wKAM",
  },
  {
    slug: "expand-your-boundaries-kampala-1",
    title: "Expand Your Boundaries — Live in Kampala, Uganda",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Expand Your Boundaries",
    date: "2026-01-25",
    duration: "2h 40m",
    summary:
      "A special Sunday service in Kampala with Prophet Neza Mugisha, challenging believers to expand their boundaries and enlarge their vision.",
    thumbnail: "https://i.ytimg.com/vi/NnXBB3XneZg/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=NnXBB3XneZg",
  },
  {
    slug: "expand-your-boundaries-kampala-2",
    title: "Expand Your Boundaries — Special Service in Kampala, Uganda",
    speaker: "Rev Prophet Ernest NYIRINDEKWE",
    series: "Expand Your Boundaries",
    date: "2026-01-28",
    duration: "6h 17m",
    summary:
      "The continuation of the Kampala crusade — a marathon of worship and prophetic teaching on enlarging your capacity for God's promises.",
    thumbnail: "https://i.ytimg.com/vi/vqg5-PTpWnE/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=vqg5-PTpWnE",
  },
];
