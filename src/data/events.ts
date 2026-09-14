export type EventItem = {
  slug: string;
  title: string;
  date: string; // ISO date
  endDate?: string;
  time: string;
  location: string;
  altarSlug?: string;
  category: "Conference" | "Service" | "Outreach" | "Prayer" | "Youth";
  summary: string;
  image: string;
};

/**
 * Sample upcoming events across the ministry. Add or edit entries here — the
 * homepage, Events page and altar pages read from this single source.
 */
export const events: EventItem[] = [
  {
    slug: "global-prayer-conference-2026",
    title: "Elayono Global Prayer Conference",
    date: "2026-11-06",
    endDate: "2026-11-08",
    time: "9:00 AM daily",
    location: "USA & Canada Altar",
    altarSlug: "usa-canada",
    category: "Conference",
    summary:
      "Three days of prayer, worship and impartation, uniting believers from every Elayono Global altar around the world.",
    image:
      "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "night-of-worship-brussels",
    title: "Night of Worship",
    date: "2026-10-17",
    time: "7:00 PM",
    location: "Belgium Altar, Brussels",
    altarSlug: "belgium",
    category: "Service",
    summary: "An evening dedicated to praise, worship and the presence of God, open to all.",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "community-outreach-paris",
    title: "Community Outreach",
    date: "2026-10-24",
    time: "10:00 AM",
    location: "France Altar, Paris",
    altarSlug: "france",
    category: "Outreach",
    summary: "Sharing the love of Christ practically through service to our neighbors in Paris.",
    image:
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "youth-summit-stockholm",
    title: "Elayono Youth Summit",
    date: "2026-11-14",
    time: "2:00 PM",
    location: "Sweden Altar, Stockholm",
    altarSlug: "sweden",
    category: "Youth",
    summary: "Raising a generation arising for God's purpose — a day of worship, teaching and community for youth.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "global-day-of-prayer",
    title: "Global Day of Prayer",
    date: "2026-10-03",
    time: "6:00 AM (each local time zone)",
    location: "All Elayono Global Altars",
    category: "Prayer",
    summary: "Every altar, in every nation, joining together in a single day of unified prayer and fasting.",
    image:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1200&auto=format&fit=crop",
  },
];
