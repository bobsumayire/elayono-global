export type Altar = {
  slug: string;
  country: string;
  region: string; // continent / grouping used on the map
  cities: string[];
  summary: string;
  serviceTimes: { label: string; time: string }[];
  address?: string;
  email?: string;
  phone?: string;
  /** Position on the abstract world map, as a percentage of the map's width/height */
  map: { x: number; y: number };
  heroImage: string;
};

/**
 * Every current Elayono Global altar. Add a new object to this array to bring
 * a new country or city online across the map, locations page, and footer —
 * no other file needs to change.
 */
export const altars: Altar[] = [
  {
    slug: "usa-canada",
    country: "USA & Canada",
    region: "North America",
    cities: ["Multiple cities across the USA & Canada"],
    summary:
      "Our North American family gathers across multiple cities in the United States and Canada, carrying the Elayono Global vision to communities throughout the region.",
    serviceTimes: [
      { label: "Sunday Worship", time: "10:00 AM (local time)" },
      { label: "Midweek Prayer", time: "Wednesday, 7:00 PM (local time)" },
    ],
    map: { x: 21, y: 38 },
    heroImage:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "belgium",
    country: "Belgium",
    region: "Europe",
    cities: ["Brussels"],
    summary:
      "At the crossroads of Europe, our Belgium altar welcomes a vibrant, multicultural congregation into a community of faith, worship and discipleship.",
    serviceTimes: [
      { label: "Sunday Worship", time: "11:00 AM (local time)" },
      { label: "Midweek Prayer", time: "Wednesday, 7:00 PM (local time)" },
    ],
    map: { x: 49, y: 27 },
    heroImage:
      "https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "france",
    country: "France",
    region: "Europe",
    cities: ["Paris"],
    summary:
      "Our France altar shepherds a growing Francophone congregation, extending the Elayono Global vision of transformation across the nation.",
    serviceTimes: [
      { label: "Sunday Worship", time: "11:00 AM (local time)" },
      { label: "Midweek Prayer", time: "Thursday, 7:00 PM (local time)" },
    ],
    map: { x: 48, y: 30 },
    heroImage:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "sweden",
    country: "Sweden",
    region: "Europe",
    cities: ["Stockholm"],
    summary:
      "In the Nordic region, our Sweden altar is a beacon of hope and community, gathering believers for worship, prayer and fellowship.",
    serviceTimes: [
      { label: "Sunday Worship", time: "12:00 PM (local time)" },
      { label: "Midweek Prayer", time: "Wednesday, 6:30 PM (local time)" },
    ],
    map: { x: 53, y: 19 },
    heroImage:
      "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=1600&auto=format&fit=crop",
  },
];
